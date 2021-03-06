
const models = require('../models/database');
const fs = require('fs');

exports.createGame = async (req, res) => {
    console.log("atooo")
    // let image_path = req.body.image;
    // let image_data = fs.readFileSync(image_path);
    // let base64data = image_data.toString('base64');
    let base64data = req.body.image;
    models.Games.create({ ...req.body })
        .then(async (newgame) => {

            newgame = newgame.dataValues;
            console.log("hahahaha", newgame)
            for (let i = 0; i < req.body.platforms.length; i++) {
                await models.GamesPlatforms.create({
                    PlatformId: req.body.platforms[i],
                    GamesID: newgame.id
                })
            }

            for (let i = 0; i < req.body.technologies.length; i++) {
                await models.GamesTechnologies.create({
                    TechnologyId: req.body.technologies[i],
                    GamesID: newgame.id
                })
            }

            for (let i = 0; i < req.body.tags.length; i++) {
                await models.GamesTags.create({
                    TagId: req.body.tags[i],
                    GamesID: newgame.id
                })
            }

            await models.Images.create({
                GamesID: newgame.id,
                picture: base64data
            })

            let game = await models.Games.findByPk(newgame.id, {
                include: [
                    { model: models.Technologies },
                    { model: models.Platform },
                    { model: models.Tag },
                ]
            })

            let image = await models.Images.findAll({
                where: {
                    GamesID: game.dataValues.id
                }
            })
            game.dataValues.images = image;
            res.status(200).json({ game });

        })
}

exports.allGame = async (req, res) => {
    models.Games.findAll({
        include: [
            { model: models.Technologies },
            { model: models.Platform },
            { model: models.Tag }
        ]
    })
        .then(async  game => {
            for (let i = 0; i < game.length; i++) {
                let image = await models.Images.findAll({
                    where: {
                        GamesID: game[i].dataValues.id
                    }
                })
                game[i].dataValues.images = image;
            }
            res.status(200).json({ game })
        })
        .catch(err => {
            console.log(err);
            res.status(404).send(err);
        })
}

exports.getGame = (req, res) => {
    let id = req.params.id;

    models.Games.findByPk(id, {
        include: [
            { model: models.Technologies },
            { model: models.Platform },
            { model: models.Tag },
        ]
    })
        .then(async (game) => {
            if (!game) {
                res.status(404).send('User not found')
            } else {
                let image = await models.Images.findAll({
                    where: {
                        GamesID: game.dataValues.id
                    }
                })
                console.log(image);
                game.dataValues.images = image;
                console.log('game', game)
                res.status(200).json({ game })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).send(err);
        })
}

exports.getGameUser = (req, res) => {
    let id = req.params.idUser;

    models.Games.findAll({
        where: {
            UsersID: id
        }
    }, {
        include: [
            { model: models.Technologies },
            { model: models.Platform },
            { model: models.Tag },
        ]
    })
        .then(async (game) => {
            if (!game) {
                res.status(404).send('User not found')
            } else {
                for (let i = 0; i < game.length; i++) {
                    let image = await models.Images.findAll({
                        where: {
                            GamesID: game[i].dataValues.id
                        }
                    })
                    game[i].dataValues.images = image;
                }
                res.status(200).json({ game })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).send(err);
        })
}

exports.getTags = (req, res) => {
    models.Tag.findAll({
    }).then((tag) => {
        if (!tag) {
            res.status(404).send('tags not found')
        } else {
            res.status(200).json({ tag })
        }
    })
        .catch(err => {
            console.log(err);
            res.status(404).send(err);
        })
}

exports.getPlatforms = (req, res) => {
    models.Platform.findAll({})
        .then((platforms) => {
            if (!platforms) {
                res.status(404).send('Platforms not found')
            } else {
                res.status(200).json({ platforms })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).send(err);
        })
}

exports.getTechnologies = (req, res) => {
    models.Technologies.findAll({})
        .then((technology) => {
            if (!technology) {
                res.status(404).send('technology not found')
            } else {
                res.status(200).json({ technology })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).send(err);
        })
}

// exports.getDowloadedGame = (req, res) => {
//     let iduser = req.params.id;

// models.Games.findAll(
//         {
//             where: {
//                 userId : iduser
//             }
//         }, {   
//         include: [ 
//             { model:models.Technologies},
//             { model:models.Platform},
//             { model:models.Tag},
//         ]
//     })
//         .then(game => { 
//         if(!game) {
//             res.status(404).send('User not found')
//         } else
//             res.status(200).json({game});
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(404).send(err);
//         })
// }