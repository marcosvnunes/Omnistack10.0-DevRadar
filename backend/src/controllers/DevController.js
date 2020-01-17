const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnetions , sendMessage } = require('../websocket')

module.exports ={
    async index(request, response){
        const devs = await Dev.find();
        return response.json(devs);
    },
    async store(request,response) {
        const { github_username , techs , latitude , longitude} = request.body;
        
        let dev = await Dev.findOne({ github_username });
        if(!dev){
            const ApiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
        
            const { name = login, avatar_url, bio } = ApiResponse.data;
            
            const techsArray = parseStringAsArray(techs);
        
            const location = { 
                type:'Point',
                coordinates:[longitude,latitude]
            }
            dev =  await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
        
            })

            const sendSocketMessageTo = findConnetions(
                { latitude, longitude },
                techsArray,
            )
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return response.json(dev);
    
    },
    async update(request, response){
        let dev = await Dev.findById(request.params.id);

        const {
            name = dev.name ,
            avatar_url = dev.avatar_url,
            techs,
            latitude = dev.coordinates.latitude,
            longitude = dev.coordinates.longitude
        } = request.body;
        let techsArray;
        if(techs)
        {
            techsArray = parseStringAsArray(techs);
        }else{
            techsArray = dev.techs
        }
        
        const location = { 
            type:'Point',
            coordinates:[longitude,latitude]
        }

        dev = await Dev.findByIdAndUpdate(request.params.id,{
            name,
            avatar_url,
            techs:techsArray,
            location,

        },{new:true})

        return response.json(dev);

    },
    async destroy(request, response){
      const dev =  await Dev.findByIdAndRemove(request.params.id);
        return response.json(dev);
    }
}