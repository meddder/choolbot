const {
     Telegraf,
     Markup
    } = require('telegraf')
require('dotenv').config()
const text = require('./help.js')

const bot  = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}
 Я школьный бот, который поможет тебе лучше разобраться в навигации сайта: ГУО "Ольшанская средняя школа 2".
 Вся информация находится ниже, здесь ты можешь переходить по ссылкам и попадать на разные части сайта, это быстро и удобно!
 Чтобы посмотреть что умеет бот напишит команду /help.`))
bot.help((ctx) => ctx.reply (text.commands))

bot.command ('home',async (ctx) => { 
    try {
   await ctx.replyWithHTML('<b>Основная страница:</b>', Markup.inlineKeyboard(
    [
        [Markup.button.callback('Главная', 'btn_1')],
        [Markup.button.callback('Об учреждении', 'btn_2')],[Markup.button.callback('Учащимся', 'btn_3')],
        [ Markup.button.callback('Родителям', 'btn_4')],[Markup.button.callback('Учительская', 'btn_5')],
        [Markup.button.callback('Выпускнику', 'btn_6')],[Markup.button.callback('Летопись учреждения образования', 'btn_7')],
        [Markup.button.callback('Сервисы', 'btn_8')]
    ]
    ))
} catch(e) {
    console.error(e)
}
})
function addActionBot(name,src,text) {
    bot.action(name, async(ctx) => {
        try {
            await ctx.answerCbQuery()
            if(src !== false){
                await ctx.replyWithPhoto({
                    sourse: src 
            })
        }

           await ctx.replyWithHTML(text,{
                disable_web_page_preview:true
            })
        } catch(e) {
            console.error(e)
        }
    }) 
}
addActionBot('btn_1', false,text.text1)
addActionBot('btn_2', false,text.text2)
addActionBot('btn_3', false,text.text3)
addActionBot('btn_4', false,text.text4)
addActionBot('btn_5', false,text.text5)
addActionBot('btn_6', false,text.text6)
addActionBot('btn_7', false,text.text7)
addActionBot('btn_8', false,text.text8)



bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop('SIGINT'));
process.once("SIGTERM", () => bot.stop('SIGTERM'));