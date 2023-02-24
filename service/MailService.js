import nodeMailer from "nodemailer"
import config from "config";

class MailService {

    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: config.get("SMTP_HOST"),
            port: config.get("SMTP_PORT"),
            secure: false,
            auth: {
                user: config.get("MAIL_USER"),
                pass: config.get("MAIL_PASSWORD")
            }
        })
    }


    sendActivationMail = async (to, link) => {
        await this.transporter.sendMail({
            from: config.get("MAIL_USER"),
            to,
            subject: "Активация аккаунта на " + config.get("API_URL"),
            text: "Мой текст",
            html: `
                <div>
                    <h1>Для активации передйите по ссылке:</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        }, (err, info) => {
            if (err) console.log(err)
            else console.log(info.response)
        })
    }

}

export default new MailService()