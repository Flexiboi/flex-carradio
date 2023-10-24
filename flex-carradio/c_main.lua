local QBCore = exports['qb-core']:GetCoreObject()
xSound = exports.xsound
local Vehicles = {}
local MuteState = false
local CurrentVolume = 0.0

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    QBCore.Functions.TriggerCallback('flex-carradio:server:getactiveradios', function(radios)
        if radios then
            Vehicles = radios
        end
     end)
end)

RegisterNetEvent('flex-carradio:client:open', function()
    QBCore.Functions.TriggerCallback('flex-carradio:server:getactiveradios', function(isowned)
        if isowned or not Config.OwnedCarCheck then
            local ped = PlayerPedId()
            if IsPedInAnyVehicle(ped, false) then
                if GetPedInVehicleSeat(GetVehiclePedIsIn(ped), -1) == ped or GetPedInVehicleSeat(GetVehiclePedIsIn(ped), 0) == ped or Config.EveryoneCanOpen then
                    SendNUIMessage({
                        type = 'open',
                        channels = Config.DefaultChannels,
                        mutestate = MuteState,
                        vehicle = GetVehiclePedIsIn(ped),
                        currentsong = Vehicles[GetVehiclePedIsIn(ped)].Url or nil,
                    })
                    SetNuiFocus(true, true)
                end
            end
        end
    end)
end)

RegisterNUICallback('PlaySong', function(data, cb)
    Vehicles[data.vehicle] = {
        Id = data.vehicle,
        Url = data.url,
        Volume = data.volume,
        Loop = data.loop,
        TimeStamp = 0
    }
    xSound:PlayUrl(data.vehicle, data.url, data.volume, data.loop or false)
    TriggerServerEvent('flex-carradio:server:syncradio', data.vehicle, data.url, data.volume, data.loop, 0)
end)

RegisterNUICallback('MuteState', function(data, cb)
    if xSound:soundExists(data.vehicle) then
        MuteState = data.mutestate
        SendNUIMessage({
            type = 'mutestate',
            mutestate = MuteState,
        })
        local MusicVolume = xSound:getVolume(data.vehicle)
        if MusicVolume > 0 then
            CurrentVolume = MusicVolume
            TriggerServerEvent('flex-carradio:server:mutestate', data.vehicle, 0)
        else
            TriggerServerEvent('flex-carradio:server:mutestate', data.vehicle, CurrentVolume)
        end
    end
end)

RegisterNUICallback('PlayPause', function(data, cb)
    if xSound:soundExists(data.vehicle) then
        TriggerServerEvent('flex-carradio:server:pauseresume', data.state, data.vehicle)
    end
end)

RegisterNUICallback('SetVolume', function(data, cb)
    if xSound:soundExists(data.vehicle) then
        local MusicVolume = xSound:getVolume(data.vehicle)
        if data.state == 'up' then
            if MusicVolume < 1 then
                TriggerServerEvent('flex-carradio:server:volume', data.vehicle, MusicVolume + 0.1)
            end
        elseif data.state == 'down' then
            if MusicVolume > 0 then
                TriggerServerEvent('flex-carradio:server:volume', data.vehicle, MusicVolume - 0.1)
            end
        end
    end
end)

RegisterNUICallback('StopSound', function(data, cb)
    if xSound:soundExists(data.vehicle) then
        TriggerServerEvent('flex-carradio:server:stop', data.vehicle)
    end
end)

RegisterNUICallback('CloseNui', function(data, cb)
    SetNuiFocus(false, false)
end)

RegisterNetEvent('flex-carradio:client:syncradio', function(vehicle, url, volume, loop, timestamp)
    Vehicles[vehicle] = {
        Id = vehicle,
        Url = url,
        Volume = volume,
        Loop = loop,
        TimeStamp = timestamp
    }
end)

RegisterNetEvent('flex-carradio:client:mutestate', function(vehicle, volume)
    if xSound:soundExists(vehicle) then
		if vehicle and volume then
            xSound:Distance(vehicle,volume)
            Vehicles[vehicle].Distance = volume
            xSound:setVolume(vehicle, volume)
            Vehicles[vehicle].Volume = volume
		end
	end
end)

RegisterNetEvent('flex-carradio:client:pauseresume', function(state, veh)
    if state == 'resume' then
        xSound:Resume(veh)
    elseif state == 'pause' then
        xSound:Pause(veh)
    end
end)

RegisterNetEvent('flex-carradio:client:stop', function(veh)
    xSound:Destroy(veh)
end)

RegisterNetEvent('flex-carradio:client:volume', function(Vehicle, Volume)
    if xSound:soundExists(Vehicle) then
		if Vehicle and Volume then
            xSound:setVolume(Vehicle, Volume)
            Vehicles[Vehicle].Volume = Volume
		end
	end
end)

local InOutVehicleCheck = 500
CreateThread(function()
    while true do
        Wait(InOutVehicleCheck)
        local ped = PlayerPedId()
        local playerPos = GetEntityCoords(ped)
        for k, v in pairs(Vehicles) do
            if not DoesEntityExist(v.Id) then
                table.remove(Vehicles, v.Id)
                xSound:Destroy(v.Id)
            end
            if not xSound:soundExists(v.Id) then 
                break InOutVehicleCheck = 1000
            end
            local vehPos = GetEntityCoords(v.Id)
            if #(vehPos - playerPos) <= Config.MaxCarDistance then
                InOutVehicleCheck = 100
                if xSound:isPlaying(v.Id) then
                    local CurrentTimeStamp = xSound:getTimeStamp(v.Id)
                    Vehicles[v.Id].TimeStamp = CurrentTimeStamp
                    if not IsPedInAnyVehicle(ped, false) then
                        local doors = 0
                        for i = 0, 5, 1 do
                            if GetVehicleDoorAngleRatio(v.Id, i) > 0.0 then
                                doors = doors + 1
                            end
                        end
                        if doors > 0 then
                            xSound:Distance(v.Id, Config.Default3DDistance * (doors) + (Config.Default3DDistance * v.Volume))
                        end
                        if xSound:isPlaying(v.Id) then
                            if not xSound:isDynamic(v.Id) then
                                xSound:PlayUrlPos(v.Id, v.Url, v.Volume, vehPos, v.Loop or false,{
                                onPlayStart = function(event)
                                    xSound:setTimeStamp(v.Id, CurrentTimeStamp)
                                    xSound:Distance(v.Id, Config.Default3DDistance)
                                end,})
                                xSound:setSoundDynamic(v.Id, true)
                            end
                        end
                    else
                        if xSound:isDynamic(v.Id) then
                            xSound:setSoundDynamic(v.Id, false)
                        end
                        if not xSound:isPlaying(v.Id) then
                            xSound:PlayUrl(v.Id, v.Url, v.Volume, v.Loop or false,{
                            onPlayStart = function(event)
                                xSound:setTimeStamp(v.Id, CurrentTimeStamp)
                                xSound:Distance(v.Id, Config.Default3DDistance)
                            end,})
                        end
                    end
                end
            else
                InOutVehicleCheck = 1000
            end
        end
    end
end)

Citizen.CreateThread(function()
	while true do
        Citizen.Wait(1000)
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped) then
            SetUserRadioControlEnabled(false)
            if GetPlayerRadioStationName() ~= nil then
                SetVehRadioStation(GetVehiclePedIsIn(ped),"OFF")
            end
		end
	end
end)

RegisterKeyMapping('carradio', 'flex-carradio', 'keyboard', 'Q')
RegisterCommand('carradio', function(source, args)
    TriggerEvent('flex-carradio:client:open')
end, false)

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        for k, v in pairs(Vehicles) do
            if xSound:soundExists(v.Id) then 
                xSound:Destroy(v.Id)
            end
        end
    end
end)