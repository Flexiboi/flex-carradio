local QBCore = exports['qb-core']:GetCoreObject()
local Vehicles = {}

QBCore.Functions.CreateCallback('flex-carradio:server:getactiveradios', function(source, cb)
    cb(Vehicles)
end)

QBCore.Functions.CreateCallback('flex-carradio:server:iscarowned', function(source, cb, plate)
    local result = MySQL.query.await('SELECT plate, citizenid, id FROM player_vehicles WHERE plate = @plate', {['@plate'] = plate})
	if result and result[1] then
		cb(true)
	end
end)

RegisterNetEvent('flex-carradio:server:pauseresume', function(state, veh)
    TriggerClientEvent('flex-carradio:client:pauseresume', -1, state, veh)
end)

RegisterNetEvent('flex-carradio:server:volume', function(veh, volume)
    TriggerClientEvent('flex-carradio:client:volume', -1, veh, volume)
end)

RegisterNetEvent('flex-carradio:server:stop', function(veh)
    TriggerClientEvent('flex-carradio:client:stop', -1, veh)
end)

RegisterNetEvent('flex-carradio:server:stop', function(veh)
    TriggerClientEvent('flex-carradio:client:stop', -1, veh)
end)

RegisterNetEvent('flex-carradio:server:syncradio', function(vehicle, url, volume, loop, timestamp)
    Vehicles[vehicle] = {
        Id = vehicle,
        Url = url,
        Volume = volume,
        Loop = loop,
        TimeStamp = timestamp
    }
    TriggerClientEvent('flex-carradio:client:syncradio', -1, vehicle, url, volume, loop, timestamp)
end)

RegisterNetEvent('flex-carradio:server:mutestate', function(vehicle, volume)
    Vehicles[vehicle].Volume = volume
    TriggerClientEvent('flex-carradio:client:mutestate', -1, vehicle, volume)
end)

RegisterNetEvent('flex-carradio:server:settimestamp', function(vehicle, time)
    Vehicles[vehicle].TimeStamp = time
    TriggerClientEvent('flex-carradio:client:settimestamp', -1, vehicle, time)
end)