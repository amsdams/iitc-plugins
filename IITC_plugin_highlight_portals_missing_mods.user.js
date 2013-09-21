// ==UserScript==
// @id             iitc-plugin-highlight-portals-missing-mods@amsdams
// @name           IITC plugin: highlight portals missing mods
// @category       Highlighter
// @version        0.0.0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/amsdams/iitc-plugins/raw/master/IITC_plugin_highlight_portals_missing_mods.meta.js
// @downloadURL    https://github.com/amsdams/iitc-plugins/raw/master/IITC_plugin_highlight_portals_missing_mods.user.js
// @description    [jonatkins-2013-09-02-041054] Uses the fill color of the portals to highlight portals team can upgrade
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

function wrapper() {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function () {};
  // PLUGIN START ////////////////////////////////////////////////////////
  // use own namespace for plugin
  window.plugin.portalHighligherPortalsMissingMods = function () {};
  window.plugin.portalHighligherPortalsMissingMods.highlight = function (data, missing) {
    var d = data.portal.options.details,
      mods = d.portalV2.linkedModArray,
      countMissing = 0,
      opacity = 0.7,
      color = 'red';
    /*if (d.portalV2.descriptiveText.TITLE == 'Monumental Entrance') {
      console.warn(JSON.stringify(d));
    }*/
    $.each(mods, function (ind, mod) {
      if (!mod) {
        countMissing++;
      }
    });
    if (countMissing === missing) {
      data.portal.setStyle({
        fillColor: color,
        fillOpacity: opacity
      });
    } else {
      //reset 
      data.portal.setStyle({
        color: window.COLORS[getTeam(data.portal.options.details)],
        fillOpacity: 0.5
      });
    }
  }
  window.plugin.portalHighligherPortalsMissingMods.getHighlighter = function (missing) {
    return (function (data) {
      window.plugin.portalHighligherPortalsMissingMods.highlight(data, missing);
    });
  }
  var setup = function () {
    for (var missing = 1; missing < 5; missing++) {
      window.addPortalHighlighter('Mods Missing: ' + missing + ' mods ', window.plugin.portalHighligherPortalsMissingMods.getHighlighter(missing));
    }
  }
  // PLUGIN END //////////////////////////////////////////////////////////
  if (window.iitcLoaded && typeof setup === 'function') {
    setup();
  } else {
    if (window.bootPlugins)
      window.bootPlugins.push(setup);
    else
      window.bootPlugins = [setup];
  }
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + wrapper + ')();'));
(document.body || document.head || document.documentElement).appendChild(script);