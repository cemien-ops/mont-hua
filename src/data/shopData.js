export const perms = [
  { id: "kami", deco: "Kami", role: "Co-owner", price: 10, color: "#e8c4d0",
    description: "+snipe, +tempmute, +warn, -unmute" },
  { id: "oni", deco: "Oni", role: "Owner", price: 25, color: "#c4b5d0",
    description: "=find +vc stats +member +user\nGérer les messages (discussion)" },
  { id: "ryu", deco: "Ryu", role: "Diamant", price: 50, color: "#b5c4e8",
    description: "+ban (jugement) +pic =mv, -delsanction, /rank /derank /rankup\nGérer les pseudos" },
  { id: "samui", deco: "Samui", role: "Billet", price: 100, color: "#b5d4c4",
    description: "Mute clic droit" },
  { id: "shogun", deco: "Shogun", role: "Soleil", price: 160, color: "#e8d4b5",
    description: "+serverinfo +vocinfo +channel [salon]\n/rank /derank /rankup\nMove & Déco clic droit (vc public)" },
  { id: "nakama", deco: "Nakama", role: "Trèfle", price: 230, color: "#d4e8b5",
    description: "-derank (raison)\nLogs serveur intégrées\n80% accès backup serveur (mod, msg, vc)" },
  { id: "daimyo", deco: "Daimyō", role: "Flocon", price: 300, color: "#b5e8e8",
    description: "To /unto 1jour Max" },
  { id: "shinigami", deco: "Shinigami", role: "Bulle", price: 400, color: "#e8b5b5",
    description: "/addrole /delrole\nTO clic droit 1sem Max" },
  { id: "royal", deco: null, role: "Royal", price: 550, color: "#d4b5e8",
    description: "+join +ban (immédiat)\nperms (wl) : Bypass salon sanction, bypass jugement, bypass raison\n-derank" },
  { id: "crown", deco: null, role: "Crown", price: 800, color: "#e8c4a0",
    description: "PERM ROLE, Image\nPerms clic droit partout" },
  { id: "admin", deco: null, role: "Admin", price: 1200, color: "#a0c4e8",
    description: "&clear -mutelist +unmuteall\n/bl /unir /blr -blr-usr\nperms Voice accès backup serveur\ncoeur logs" },
  { id: "botbot", deco: null, role: "BOT=BOT", price: 1800, color: "#c4e8a0",
    description: "+lock -unlock +slowmode +create\n+badword add/delete/list\npyrms (wl) : gérant serveur\nWL TO clic droit" },
  { id: "invisible", deco: null, role: "Invisible", price: 2500, color: "#e8e8a0",
    description: "perms : &BL MASTER\nWL ADMIN" },
  { id: "couronne", deco: null, role: "Couronne", price: 3500, color: "#e8a0c4",
    description: "+giveaway +allbots\nPERM SALON\nPERM BAN CLIC DROIT" },
  { id: "createur", deco: null, role: "Créateur", price: 5500, color: "#a0e8c4",
    description: "+renew /lockname /unlockname\n&DERANK ULTIME, &BL SYS\nPERM ADMIN" },
  { id: "systeme", deco: null, role: "Système", price: 8500, color: "#ffd700", description: "" },
];

export const abonnements = [
  { id: "silver", name: "SILVER", price: 14.99, gradient: "linear-gradient(135deg,#C0C0C0,#E8E8E8)", banner: "https://i.imgur.com/GJTtOEg.png", icon: "https://i.imgur.com/6o5ZI7i.png",
    description: "Avantages exclusifs :\n• Flex UHQ : rôle déco supérieur & holographique\n• Giveaway Journalier : nitros, décorations, et +\n• Rôle @Acces : donnant l'accès à un chat-owner, vocaux owner, réunions owner\n• WL clic droit : +1 à la limite de TO/MUTE/MOVE (15 minutes)\n\nCommandes exclusives :\n• /aide : permet de demander de l'aide de manière privilégiée et automatique aux gérants\n• /rerank : permet de récupérer ses rôles dans n'importe quel salon (24h cooldown)\n• /gift : tirage au sort de cadeaux/promos invest (1/jour) - moyennes chances" },
  { id: "gold", name: "GOLD", price: 29.99, gradient: "linear-gradient(135deg,#FFD700,#FFF4A0)", banner: "https://i.imgur.com/HgQRXn1.png", icon: "https://i.imgur.com/9SbS7kj.png",
    description: "Avantages exclusifs :\n• WL clic droit : +2 à la limite de TO/MUTE/MOVE (15 minutes)\n• Flex UHQ : rôle déco supérieur & holographique\n• Giveaway Journalier : nitros, décorations, et +\n• Rôle @Acces : donnant l'accès à un chat-owner, vocaux owner, réunions owner\n\nCommandes exclusives :\n• /affichage : ajout/retrait du rôle affiché à droite (Bypass affichage auto)\n• /rerank : permet de récupérer ses rôles dans n'importe quel salon (2/jour)\n• /gift : tirage au sort de cadeaux/promos invest (2/jour) - moyennes chances\n• /aide : permet de demander de l'aide de manière privilégiée et automatique aux gérants" },
  { id: "plat", name: "PLAT", price: 44.99, gradient: "linear-gradient(135deg,#9ab8c2,#E5E4E2)", banner: "https://i.imgur.com/BpaeBSS.png", icon: "https://i.imgur.com/C3Vfbml.png",
    description: "Avantages exclusifs :\n• Couleur Dégradée : pour ceux ayant un rôle perso (3 prédéfinis)\n• Owner Fabulous BOT : /dog-add, /wakeup, /snap\n• Limite augmentée : +1 au max du /dog-add pour ceux déjà owner\n• WL clic droit : +3 à la limite de TO/MUTE/MOVE (15 minutes)\n• Flex UHQ : rôle déco supérieur & holographique\n• Giveaway Journalier : nitros, décorations, et +\n• Rôle @Acces : donnant l'accès à un chat-owner, vocaux owner, réunions owner\n\nCommandes exclusives :\n• /protect-role : permet de lock son rôle perso afin que personne ne l'ajoute sauf soi-même\n• /gift : tirage au sort de cadeaux/promos invest (2/jour) - hautes chances\n• /rerank : permet de récupérer ses rôles dans n'importe quel salon (2/jour)\n• /affichage : ajout/retrait du rôle affiché à droite (bypass affichage auto)\n• /aide : permet de demander de l'aide de manière privilégiée et automatique aux gérants" },
  { id: "diams", name: "DIAMS", price: 74.99, gradient: "linear-gradient(135deg,#b9f2ff,#89CFF0)", banner: "https://i.imgur.com/lEy2teB.png", icon: "https://i.imgur.com/I2EQshL.png",
    description: "Avantages exclusifs (ROYAL+) :\n• Appel Exclusif : possibilité de voc 5 min avec les fondateurs du serveur\n• Upgrade Rôle Perso : rend visible son rôle perso au dessus de Légende\n• WL +ban : limite x2 (30 minutes)\n• Couleur Dégradée : pour ceux ayant un rôle perso (5 prédéfinis)\n• Owner Fabulous BOT : /dog-add (+1), /wakeup, /snap\n• Limite augmentée : +2 au max du /dog-add pour ceux déjà owner\n• WL clic droit : +6 à la limite de TO/MUTE/MOVE (15 minutes)\n• Flex UHQ : rôle déco supérieur & holographique\n• Giveaway Journalier : nitros, décorations, et +\n• Rôle @Acces : donnant l'accès à un chat-owner, vocaux owner, réunions owner\n\nCommandes exclusives :\n• /protect-salon : permet de lock son salon perso afin que les commandes ne soient accessibles que par vous (=mv, =join, =pv)\n• /rerank : permet de récupérer ses rôles dans n'importe quel salon (3/jour)\n• /gift : tirage au sort de cadeaux/promos invest (3/jour) - hautes chances\n• /protect-role : permet de lock son rôle perso afin que personne ne l'ajoute sauf soi-même\n• /affichage : ajout/retrait du rôle affiché à droite (bypass affichage auto)\n• /aide : permet de demander de l'aide de manière privilégiée et automatique aux gérants" },
  { id: "ruby", name: "RUBY", price: 149.99, gradient: "linear-gradient(135deg,#E0115F,#FF6B8A)", banner: "https://i.imgur.com/hmmubEp.png", icon: "https://i.imgur.com/u4PfIyF.png",
    description: "Avantages exclusifs (LIMITED, CROWN+) :\n• Appel Exclusif : possibilité de voc 10 min avec les fondateurs du serveur\n• Upgrade Rôle Perso : rend visible son rôle perso au dessus des Gestions\n• Couleur Dégradée : pour ceux ayant un rôle perso (∞)\n• WL clic droit : +10 à la limite de TO/MUTE/MOVE (15 minutes)\n• WL +ban : limite x2 (30 minutes)\n• Owner Fabulous BOT : /dog-add (+1), /wakeup, /snap\n• Limite augmentée : +2 au max du /dog-add pour ceux déjà owner\n• Flex UHQ : rôle déco supérieur & holographique\n• Giveaway Journalier : nitros, décorations, et +\n• Rôle @Acces : donnant l'accès à un chat-owner, vocaux owner, réunions owner\n\nCommandes exclusives :\n• /gift : tirage au sort de cadeaux/promos invest (4/jour) - hautes chances\n• /rerank : permet de récupérer ses rôles dans n'importe quel salon (4/jour)\n• /protect-salon : permet de lock son salon perso afin que les commandes ne soient accessibles que par vous (=mv, =join, =pv)\n• /protect-role : permet de lock son rôle perso afin que personne ne l'ajoute sauf soi-même\n• /affichage : ajout/retrait du rôle affiché à droite (bypass affichage auto)\n• /aide : permet de demander de l'aide de manière privilégiée et automatique aux gérants" },
  { id: "opal", name: "OPAL", price: 299.99, gradient: "linear-gradient(135deg,#a8c0c0,#d4ebd0,#f0c8d0)", banner: "https://i.imgur.com/J7LfCtI.png", icon: "https://i.imgur.com/psQokGf.png",
    description: "Avantages exclusifs :\n• SYS Fabulous Bot : /fiston et perm de supprimer les dog et tipeu des autres\n• Appel Exclusif : possibilité de voc 15 min avec les fondateurs du serveur\n• Upgrade Rôle Perso : rend visible son rôle perso au dessus de Ryu\n• Couleur Dégradée : pour ceux ayant un rôle perso (∞)\n• WL clic droit : +12 à la limite de TO/MUTE/MOVE (15 minutes)\n• WL +ban : limite x2 (30 minutes)\n• Owner Fabulous BOT : /dog-add (+1), /wakeup, /snap\n• Limite augmentée : +2 au max du /dog-add pour ceux déjà owner\n• Flex UHQ : rôle déco supérieur & holographique\n• Giveaway Journalier : nitros, décorations, et +\n• Rôle @Acces : donnant l'accès à un chat-owner, vocaux owner, réunions owner\n\nCommandes exclusives :\n• /wet : la punition ultime\n• /gift : tirage au sort de cadeaux/promos invest (5/jour) - hautes chances\n• /rerank : permet de récupérer ses rôles dans n'importe quel salon (5/jour)\n• /protect-salon : permet de lock son salon perso afin que les commandes ne soient accessibles que par vous (=mv, =join, =pv)\n• /protect-role : permet de lock son rôle perso afin que personne ne l'ajoute sauf soi-même\n• /affichage : ajout/retrait du rôle affiché à droite (bypass affichage auto)\n• /aide : permet de demander de l'aide de manière privilégiée et automatique aux gérants" },
];

export const whitelist = [
  { category: "Permanent", items: [
    { id: "perm-bl", name: "Perm BL", price: 225,
      description: "Un membre enfreint le règlement du serveur ou les T.O.S Discord ? Fais-lui goûter au châtiment divin et BL le du plus grand serv commu fr !\n\nIl pourra seulement être &unbl par un autre owner...\n\nAttention, c'est une perm très puissante ! N'en abuse pas sous peine de sanction." }
  ]},
  { category: "Voice", items: [
    { id: "owner-vm", name: "Owner VoiceMaster", price: 200,
      description: "Le pack pour privatiser sa vie et flex dans les salons :\n\n=pv : permet de rendre privé un vocal ou de le rendre public\n=acces : donne l'accès à un membre dans un vocal privé\n=all : donne l'accès à tous les membres déjà présents dans la voc\n=mv : upgrade de la commande, donne l'accès si la voc est pv\n=mp : permet de DM un membre\n=join : déjà accessible de base mais ici permet de rejoindre certains vocaux qui sont =pv (et en catégorie privée)\n=wl : permet de WL quelqu'un (=vc, =ui, ...) ou d'afficher la WL\n=pvlist : affiche la liste des salons pv\n\nAttention : respecte l'intimité des membres et ne privatise pas tous les vocaux." },
    { id: "sys-vm", name: "Sys VoiceMaster", price: 300, requiredPerm: "owner-vm",
      description: "Le moyen le plus efficace pour régner sur tous les vocaux du serveur...\n\n=menotte : permet de menotter quelqu'un (1 max)\n=wlmv : permet d'autoriser un user de te mv\n=vmall : moove tous les gens de ton salon dans le salon ciblé\n=follow : permet de suivre quelqu'un" }
  ]},
  { category: "Gestion", items: [
    { id: "owner-g", name: "Owner Gestion", price: 150,
      description: "Un staff manque de respect, abuse de ses perms ou enfreint le règlement ? N'attends pas une seconde et /blr ce petit garnement ! Il ne pourra plus être rank à l'avenir, à moins que tu décides de le gracier avec /unblr.\n\nS'applique aux membres staff, pas besoin de justifier sa décision même si tout abus est proscrit." },
    { id: "sys-g", name: "Sys Gestion", price: 200, requiredPerm: "owner-g",
      description: "« Hmmmm, bas staff. »\n\nLe BLR ultime : force & honneur pour que la victime se fasse UNBLR\n.ow : met quelqu'un owner ou bien affiche la liste, derank si abus" }
  ]},
  { category: "Fabulous", items: [
    { id: "owner-f", name: "Owner Fabulous", price: 125,
      description: "Le pack parfait pour arriver à ses fins et éduquer la population :\n\n/dog-add : mets les gens en laisse, bloque leur pseudo en les traînant dans les vocaux publics\n/wakeup : réveille quelqu'un en le secouant + spam mp\n/snap : spam mp pour obtenir un snap\n/tipeu : rename en Z la cible et lock son pseudo\n\nAttention : ne va pas jusqu'au harcèlement et respecte les autres membres." },
    { id: "sys-f", name: "Sys Fabulous", price: 325, requiredPerm: "owner-f",
      description: "« C'est la puissance, la puissance... »\n\nDroit de supprimer les laisses, les fistons et les tipeus des autres\n/fiston : rename Z (rename=ban), si la victime se rename elle est ban" }
  ]},
  { category: "Roles", items: [
    { id: "wl-role", name: "WL Role", price: 150, requiredPerm: "crown",
      description: "(2 étoiles, co-owner, gestions, +pic, og friende)\n\nAjoute des permissions à d'autres membres sans être limité par le BOT PROTECT du serveur.",
      note: "Requis pour Owner Role" },
    { id: "owner-role", name: "Owner Role", price: 200, requiredPerm: "crown", requiredWL: "wl-role",
      description: "(owner, ⚒️, 💎, 💶, 🔆, rôles perso fonda)\n\nAjoute des permissions à d'autres membres sans être limité par le BOT PROTECT du serveur.",
      note: "Requiert WL Role" },
    { id: "sys-role", name: "Sys Role", price: 250, requiredPerm: "crown", requiredWL: "owner-role",
      description: "(☘️, ❄️, 🫧, TOUCHE = BL)\n\nAjoute des permissions à d'autres membres sans être limité par le BOT PROTECT du serveur.",
      note: "Requiert Owner Role" },
    { id: "sys-juge", name: "Sys Juge", price: 600,
      description: "« Le jour du jugement je ne panique pas. »\n\n+unbanall : clear la liste des bannis (cooldown)\nVous êtes un /protect-user, personne ne peut vous bannir à part un sys+ (univers).\nPermet de ne pas se faire ban quand on touche un user-protect, juste avertissement." }
  ]},
  { category: "Packs", items: [
    { id: "pack-wl-v", name: "Pack WL Vocal", price: 150,
      description: "(wl mute clic droit, wl moove, wl déco)\n\nLes salons vocaux sont sous ta juridiction ! Fais régner l'ordre et mets une bonne tarte à tous les malfrats de SHIBUYA sans craindre que les BOT te freinent.\n\nAttention, il existe une limite plus haute qu'avant, afin d'éviter les raids." }
  ]},
  { category: "Bendo", items: [
    { id: "role-gardien", name: "Rôle Gardien", price: 100,
      description: "Deviens gardien de la pire prison virtuelle de France !\nAbuse de tes pouvoirs en toute impunité et extériorise la frustration que tu as pu accumuler durant ces longues années...\n\nNe gaspille pas une seconde de plus : défoule toi dès maintenant sur les déchets de notre société\n\nTO clic droit ; mute clic droit ; +tempmute ; accès tickets ban/bl ; gérer les messages ; gérer les pseudos" }
  ]},
  { category: "Personnalisé", items: [
    { id: "role-p", name: "Rôle Perso", price: 150, requiredPerm: "crown",
      description: "Personnalise ton rôle personnel, afin de l'offrir à tes e-collègues. Modifie à tout moment, le nom, le badge, ou la couleur.\n\n150 € + 30 €/mois" },
    { id: "voc-p", name: "Voc Perso", price: 150, requiredPerm: "crown",
      description: "Personnalise ton salon vocal privé dans la catégorie only owner, pour te poser entre sangs. Modifie à tout moment le nom ou bien les permissions des salons (qui peut le voir ou qui y a accès).\n\n150 € + 30 €/mois" }
  ]},
];
