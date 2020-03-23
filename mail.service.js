const mailData = require('./mail.model');

const save = async (mail) => {
    let mailObj = {
        date: mail.date[0],
        subject: mail.subject[0],
        from: mail.from[0],
        to: mail.to[0],
    }
    console.log(mailObj);
    let mailObject = new mailData(mailObj);
    mailObject.save(async (error, response) => {
        if (error) {
            console.log("error", error);
            return (error);
        }
        else {
            console.log(response);
            return { success: true, data: response };
        }
    });
};

exports.save = save;