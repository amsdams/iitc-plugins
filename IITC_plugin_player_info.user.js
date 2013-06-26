// ==UserScript==
// @id             iitc-plugin-player-info@superd
// @name           IITC plugin: player info
// @category       Highlighter
// @version        0.1.0.20130612.162306
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://secure.jonatkins.com/iitc/release/plugins/player-info.meta.js
// @downloadURL    https://secure.jonatkins.com/iitc/release/plugins/player-info.user.js
// @description    [jonatkins-2013-06-12-162306] Uses the fill red of the portals, if portal has nick
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

function wrapper() {
  /* ensure plugin framework is there, even if iitc is not yet loaded*/
  if (typeof window.plugin !== 'function')
    window.plugin = function () {};
  /* PLUGIN START */
  /* use own namespace for plugin*/
  window.plugin.playerInfo = function () {};
  window.plugin.playerInfo.init = function () {
    $(window).delegate('.nickname', 'click', function () {
      var nik = $(this).text();
      window.plugin.playerInfo.ownerPrompt(nik);
    });
  };
  var dialogId = 'player-info',
    dialogClass = 'ui-dialog-' + dialogId,
    hiLighterName = 'Player Info';
  window.plugin.playerInfo.ownerPrompt = function (nik) {
    var
    playerPortals = $('<li><a href="#" data-nickname="' + nik + '" data-action="portals" >Hilight Portals</a></li>'),
      playerInfoMenu = $('<ul>');
      var levels = {
        1: 'Level 1',
        2: 'Level 2',
        3: 'Level 3',
        4: 'Level 4',
        5: 'Level 5',
        6: 'Level 6',
        7: 'Level 7',
        8: 'Level 8'
      };
      $.each(levels, function (ind, level) {
        playerResonators = $('<li><a href="#" data-nickname="' + nik + '" data-action="resos" data-level="' + ind + '">Hilight ' + level + '</a></li>');
        playerInfoMenu.append(playerResonators);
      });
      var mods = {
        RES_SHIELD: 'Shield',
        MULTIHACK: 'Multi-hack',
        FORCE_AMP: 'Force Amp',
        HEATSINK: 'Heat Sink',
        TURRET: 'Turret',
        LINK_AMPLIFIER: 'Link Amp'
      };
      $.each(mods, function (ind, mod) {
        playerMods = $('<li><a href="#" data-nickname="' + nik + '" data-action="mods" data-type="' + ind + '">Hilight ' + mod + '</a></li>');
        playerInfoMenu.append(playerMods);
      });
   
   
    playerInfoMenu.append(playerPortals);
    /* ui dialog */
    dialog({
      html: '<div id="' + dialogId + '">' + playerInfoMenu.clone().wrap('<div>').parent().html() + '</div>',
      dialogClass: dialogClass,
      title: hiLighterName + ' | ' + nik,
      draggable: true,
      id: dialogId
    });
    $('#' + dialogId + ' a').click(function (event) {
      event.preventDefault();
      var menuItem = $(this),
        action = menuItem.attr('data-action'),
        nik = menuItem.attr('data-nickname');
      switch (action) {
      case "portals":
        console.log('hilighting: ' + action);
        window.plugin.playerInfo.resetPortals();
        window.plugin.playerInfo.highlightPortals(nik);
        break;
      case "resos":
        console.log('hilighting: ' + action);
        window.plugin.playerInfo.resetPortals();
        window.plugin.playerInfo.highlightResos(nik, menuItem.attr('data-level'));
        break;
      case "mods":
        console.log('hilighting: ' + action);
        window.plugin.playerInfo.resetPortals();
        window.plugin.playerInfo.highlightMods(nik, menuItem.attr('data-type'));
        break;
      default:
        console.log('unknown menu item clicked: ' + action);
      }
    });
  };
  window.plugin.playerInfo.highlightPortals = function (nik) {
    $.each(window.portals, function (ind, portal) {
      var details = portal.options.details;
      if (getPlayerName(details.captured.capturingPlayerId) == nik) {
        portal.setStyle({
          fillColor: 'red',
          fillOpacity: 1
        });
      }
      window.COLOR_SELECTED_PORTAL = '#f0f';
    });
  };
  window.plugin.playerInfo.highlightResos = function (nik, level) {
    $.each(window.portals, function (ind, portal) {
      var resos = portal.options.details.resonatorArray.resonators,
        hasReso = false;
      //console.log('s r' + JSON.stringify(portal.options.details));
      $.each(resos, function (ind, reso) {
        if (reso) {
          hasReso = getPlayerName(reso.ownerGuid) == nik && reso.level == level;
        }
        if (hasReso && reso) {
          portal.setStyle({
            fillColor: window.COLORS_LVL[level],
            fillOpacity: 1
          });
          return;
        }
      });
    });
    window.COLOR_SELECTED_PORTAL = '#f0f';
  };
  window.plugin.playerInfo.highlightMods = function (nik, type) {
    $.each(window.portals, function (ind, portal) {
	      var mods = portal.options.details.portalV2.linkedModArray,
	        hasMods = false;
	      $.each(mods, function (ind, mod) {
	        if (mod) {
	        	hasMods = getPlayerName(mod.installingUser) == nik && mod.type == type;
	        }
	        if (hasMods && mod) {
	          portal.setStyle({
	            fillColor: window.COLORS_MOD[mod.rarity],
	            fillOpacity: 1
	          });
	          return;
	        }
	      });
	    });
	    window.COLOR_SELECTED_PORTAL = '#f0f';
  };
  window.plugin.playerInfo.resetPortals = function () {
    $.each(window.portals, function (ind, portal) {
      var details = portal.options.details,
        team = getTeam(details);
      portal.setStyle({
        fillColor: window.COLORS[team],
        fillOpacity: 0.8
      });
    });
  };
  var setup = function () {
    window.plugin.playerInfo.init();
  };
  /* PLUGIN END */
  if (window.iitcLoaded && typeof setup === 'function') {
    setup();
  } else {
    if (window.bootPlugins)
      window.bootPlugins.push(setup);
    else
      window.bootPlugins = [setup];
  }
} /* wrapper end */
/* inject code into site context */
var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + wrapper + ')();'));
(document.body || document.head || document.documentElement)
  .appendChild(script);
