import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import { ButtonInteraction, GuildChannel, MessageActionRow, MessageButton } from "discord.js";
import { Server } from "../models/serverModel";

export default class closeTicketButton extends InteractionHandler {
    constructor(ctx: PieceContext) {
        super(ctx, { interactionHandlerType: InteractionHandlerTypes.Button })
    }

    async run(interaction: ButtonInteraction) {

        if (interaction.customId !== 'ticketerCloseTicket') return;
        await interaction.deferReply();

        //@ts-ignore
        let server: any = await Server.findOne({ id: interaction.message.guild?.id });
        if (!server.channel) return;

        //@ts-ignore
        const { channel, guild } = interaction.message

        let closedTickets = await guild.channels.cache.find((c: GuildChannel) => c.name === 'Closed Tickets' && c.type === 'GUILD_CATEGORY')
        if (!closedTickets) {
            closedTickets = await guild.channels.create('Closed Tickets', {
                type: 'GUILD_CATEGORY',
            })
        }

        await channel.edit({
            // name: 'channel.name.replace('open', 'closed')',
            parent: closedTickets.id
        })

        let infoRow1 = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('ticketerCloseTicket')
                    .setEmoji('❎')
                    .setLabel('Close')
                    .setStyle('DANGER')
                    .setDisabled(true),

                new MessageButton()
                    .setCustomId('ticketerOpenTicket')
                    .setEmoji('✅')
                    .setLabel('Open')
                    .setStyle('SUCCESS')
                    .setDisabled(false)
            ])

        let infoRow2 = new MessageActionRow().addComponents([
            new MessageButton()
                .setCustomId('ticketerCreateTranscript')
                .setEmoji('📋')
                .setLabel('Transcript')
                .setStyle('SECONDARY')
                .setDisabled(false)
        ])

        //@ts-ignore
        interaction.message.edit({
            components: [infoRow1, infoRow2]
        })

        await interaction.followUp({
            content: `Ticket closed by ${interaction.member}`
        })

    }

}