/**
 * @file anime command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const Kitsu = require('kitsu');
const kitsu = new Kitsu();

exports.run = async (Bastion, message, args) => {
  if (!args.name) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let { data: anime } = await kitsu.fetch('anime', {
    filter: {
      text: args.name
    },
    fields: {
      anime: 'titles,slug,synopsis,startDate,endDate,ageRating,ageRatingGuide,nsfw,posterImage'
    }
  });
  anime = anime[0];

  message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: Object.values(anime.titles)[0],
      url: `https://kitsu.io/anime/${anime.slug}`,
      description: anime.synopsis,
      fields: [
        {
          name: 'Status',
          value: anime.endDate ? 'Finished' : 'Airing',
          inline: true
        },
        {
          name: 'Aired',
          value: anime.endDate ? `${anime.startDate} - ${anime.endDate}` : `${anime.startDate} - Present`,
          inline: true
        },
        {
          name: 'Rating',
          value: `${anime.ageRating} - ${anime.ageRatingGuide} ${anime.nsfw ? '[NSFW]' : ''}`,
          inline: true
        }
      ],
      image: {
        url: anime.posterImage.original
      },
      footer: {
        text: 'Powered by Kitsu'
      }
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'anime',
  botPermission: '',
  userTextPermission: '',
  usage: 'anime <Anime Name>',
  example: [ 'anime One Piece' ]
};
