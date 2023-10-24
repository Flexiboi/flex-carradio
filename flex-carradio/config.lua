Config = {}

Config.OwnedCarCheck = false -- false = every car
Config.EveryoneCanOpen = false -- true so everyone can open the radio in the car (false = driver and front passanger only)
Config.MaxCarDistance = 30 -- Distance till audio will stop
Config.Default3DDistance = 2 -- Distance of default volume without doors open
Config.DefaultChannels = {
    [1] = {
        canchange = true, -- True = can replace wth own saved song
        link = 'https://www.youtube.com/watch?v=GUpmWzSSrG8' -- Link to youtube
    },
    [2] = {
        canchange = true,
        link = 'https://www.youtube.com/watch?v=u1I9ITfzqFs'
    },
    [3] = {
        canchange = true,
        link = 'https://www.youtube.com/watch?v=xN1WOlptE58'
    },
    [4] = {
        canchange = false,
        link = 'https://www.youtube.com/watch?v=K4DyBUG242c'
    },
    [5] = {
        canchange = false,
        link = 'https://www.youtube.com/watch?v=CZX_OUrPooM'
    },
    [6] = {
        canchange = false,
        link = 'https://www.youtube.com/watch?v=86GVdFyPVi4'
    },
}