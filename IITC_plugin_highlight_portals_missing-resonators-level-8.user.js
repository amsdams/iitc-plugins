// ==UserScript==
// @id             iitc-plugin-highlight-portals-missing-resonators-level-8@amsdams
// @name           IITC plugin: highlight portals missing resonators level 8
// @category       Highlighter
// @version        0.0.0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/amsdams/iitc-plugins/raw/master/IITC_plugin_highlight_portals_missing-resonators-level-8.meta.js
// @downloadURL    https://github.com/amsdams/iitc-plugins/raw/master/IITC_plugin_highlight_portals_missing-resonators-level-8.user.js
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
  window.plugin.portalHighligherPortalsMissingResonatorsLevel8 = function () {};
  window.plugin.portalHighligherPortalsMissingResonatorsLevel8.highlight = function (data, missing) {
    var d = data.portal.options.details,
      r = d.resonatorArray.resonators,
      countMissing = 0,
      opacity = 0.7,
      color = 'red';
    $.each(r, function (ind, reso) {
    
      if (!reso) {
    	  countMissing++;
      } else
      
      if (reso.level !== 8) {
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
  window.plugin.portalHighligherPortalsMissingResonatorsLevel8.getHighlighter = function (missing) {
    return (function (data) {
      window.plugin.portalHighligherPortalsMissingResonatorsLevel8.highlight(data, missing);
    });
  }
  var setup = function () {
    for (var missing = 1; missing < 9; missing++) {
      window.addPortalHighlighter('Resos Missing: ' + missing + ' level 8 resonators ', window.plugin.portalHighligherPortalsMissingResonatorsLevel8.getHighlighter(missing));
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