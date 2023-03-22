const validator = require("validator");

const validate = (params) => {
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES");

    let surname = params.surname;
    if (surname != undefined) {
        surname = validator.isLength(params.surname, { min: undefined, max: 30 }) &&
                    validator.isAlpha(params.surname, "es-ES");
    } else {
        surname = true;
    }

    let nick = !validator.isEmpty(params.nick) &&
        validator.isLength(params.nick, { min: 3, max: undefined });

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password);

    let bio = params.bio;
    if (bio != undefined) {
        bio = validator.isLength(params.bio, { min: undefined, max: 100 });
    } else {
        bio = true;
    }



    if (!name || !surname || !nick || !email || !password || !bio) {
        throw new Error("No se ha superado la validacion");
    } else {
        console.log("Validacion superada");
    }
}

module.exports = validate;