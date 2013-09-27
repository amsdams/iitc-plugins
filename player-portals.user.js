// ==UserScript==
// @id             iitc-plugin-player-portals@amsdams
// @name           IITC plugin: player portals
// @category       Info
// @version        0.1.1.20130926.81348
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL https://raw.github.com/amsdams/iitc-plugins/master/player-portals.user.js
// @downloadURL https://raw.github.com/amsdams/iitc-plugins/master/player-portals.user.js
// @description    [local-2013-09-26-081348] highlights portals with mods, resonators from player
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


  // PLUGIN START ////////////////////////////////////////////////////////
window.plugin.playerInfo = function () {};
window.plugin.playerInfo.init = function () {
  $(document).on('click', '.nickname', function () {
    var nik = $(this).text();
    window.plugin.playerInfo.ownerPrompt(nik);
  });
};
window.plugin.playerInfo.mods = {
  RES_SHIELD: 'Shield',
  MULTIHACK: 'Multi-hack',
  FORCE_AMP: 'Force Amp',
  HEATSINK: 'Heat Sink',
  TURRET: 'Turret',
  LINK_AMPLIFIER: 'Link Amp'
};
window.plugin.playerInfo.levels = {
  1: 'Level 1',
  2: 'Level 2',
  3: 'Level 3',
  4: 'Level 4',
  5: 'Level 5',
  6: 'Level 6',
  7: 'Level 7',
  8: 'Level 8'
};
window.plugin.playerInfo.dialogId = 'player-info';
window.plugin.playerInfo.dialogClass = 'ui-dialog-' + window.plugin.playerInfo.dialogId;
window.plugin.playerInfo.hiLighterName = 'Player Info';
window.plugin.playerInfo.ownerPrompt = function (nik) {
  var playerPortals = $('<li><a href="#" data-nickname="' + nik + '" data-action="portals" >Captured Portals <span class="count"></span></a></li>'),
    playerInfoMenu = $('<ul>'),
    playerInfoMenuHeader = $('<h3>Hilight</h3>'),
    playerInfoMenuContainer = $('<div>');
  $.each(window.plugin.playerInfo.levels, function (ind, level) {
    var playerResonators = $('<li><a href="#" data-nickname="' + nik + '" data-action="resos" data-level="' + ind + '">Deployed Reso ' + level + ' <span class="count"></span></a></li>');
    playerInfoMenu.append(playerResonators);
  });
  $.each(window.plugin.playerInfo.mods, function (ind, mod) {
    var playerMods = $('<li><a href="#" data-nickname="' + nik + '" data-action="mods" data-type="' + ind + '">Deployed Mod ' + mod + ' <span class="count"></span></a></li>');
    playerInfoMenu.append(playerMods);
  });
  playerInfoMenu.append(playerPortals);
  playerInfoMenuContainer.append(playerInfoMenuHeader);
  playerInfoMenuContainer.append(playerInfoMenu);
  /* ui dialog */
  dialog({
    html: '<div id="' + window.plugin.playerInfo.dialogId + '">' + playerInfoMenuContainer.clone().wrap('<div>').parent().html() + '</div>',
    dialogClass: window.plugin.playerInfo.dialogClass,
    title: window.plugin.playerInfo.hiLighterName + ' | ' + nik,
    draggable: true,
    id: window.plugin.playerInfo.dialogId
  });
  $(document).on('click', '#' + window.plugin.playerInfo.dialogId + ' a', function (event) {
    event.preventDefault();
    var menuItem = $(this),
      action = menuItem.attr('data-action'),
      nik = menuItem.attr('data-nickname');
    switch(action) {
    case "portals":
      window.plugin.playerInfo.resetPortals();
      window.plugin.playerInfo.highlightPortals(nik);
      break;
    case "resos":
      window.plugin.playerInfo.resetPortals();
      window.plugin.playerInfo.highlightResos(nik, menuItem.attr('data-level'));
      break;
    case "mods":
      window.plugin.playerInfo.resetPortals();
      window.plugin.playerInfo.highlightMods(nik, menuItem.attr('data-type'));
      break;
    default:
      //console.log('unknown menu item clicked: ' + action);
    }
  });
};
window.plugin.playerInfo.highlightPortals = function (nik) {
  var count = 0;
  $.each(window.portals, function (ind, portal) {
    var details = portal.options.details;
    if(getPlayerName(details.captured.capturingPlayerId) === nik) {
      count++;
      portal.setStyle({
        fillColor: 'red',
        fillOpacity: 0.7
      });
    }
    window.COLOR_SELECTED_PORTAL = '#f0f';
  });
  $('a[data-nickname=' + nik + '][data-action=portals]').find('.count').text(count);
};
window.plugin.playerInfo.highlightResos = function (nik, level) {
  var count = 0;
  $.each(window.portals, function (ind, portal) {
    var resos = portal.options.details.resonatorArray.resonators;
    $.each(resos, function (ind, reso) {
      if(reso && getPlayerName(reso.ownerGuid) === nik && reso.level === parseInt(level)) {
        count++;
        portal.setStyle({
          fillColor: window.COLORS_LVL[level],
          fillOpacity: 0.7
        });
        /*return;*/
      }
    });
  });
  window.COLOR_SELECTED_PORTAL = '#f0f';
  $('a[data-nickname=' + nik + '][data-action=resos][data-level=' + level + ']').find('.count').text(count);
};
window.plugin.playerInfo.highlightMods = function (nik, type) {
  var count = 0;
  $.each(window.portals, function (ind, portal) {
    var mods = portal.options.details.portalV2.linkedModArray;
    $.each(mods, function (ind, mod) {
      if(mod && getPlayerName(mod.installingUser) === nik && mod.type === type) {
        count++;
        portal.setStyle({
          fillColor: window.COLORS_MOD[mod.rarity],
          fillOpacity: 0.7
        });
        /*return;*/
      }
    });
  });
  window.COLOR_SELECTED_PORTAL = '#f0f';
  $('a[data-nickname=' + nik + '][data-action=mods][data-type=' + type + ']').find('.count').text(count);
};
window.plugin.playerInfo.resetPortals = function () {
  $.each(window.portals, function (ind, portal) {
    var details = portal.options.details,
      team = getTeam(details);
    portal.setStyle({
      fillColor: window.COLORS[team],
      fillOpacity: 0.5
    });
  });
};
var setup = function () {
  window.plugin.playerInfo.init();
};
 // PLUGIN END //////////////////////////////////////////////////////////

if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

