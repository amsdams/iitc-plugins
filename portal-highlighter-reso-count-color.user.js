// ==UserScript==
// @id             iitc-plugin-highlight-portals-count-resonators-by-level@amsdams
// @name           IITC plugin: highlight portals count resonators by level
// @category       Highlighter
// @version        0.0.1.20131026.164441
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL https://raw.github.com/amsdams/iitc-plugins/master/portal-highlighter-reso-count-color.user.js
// @downloadURL https://raw.github.com/amsdams/iitc-plugins/master/portal-highlighter-reso-count-color.user.js
// @description    [local-2013-10-26-164441] highlight portals count level 8 resonators
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
// use own namespace for plugin
window.plugin.portalHighligherResoCountColor = function () {};
window.plugin.portalHighligherResoCountColor.RESOS_PER_PORTAL = 8;

window.plugin.portalHighligherResoCountColor.PORTAL_FILL_OPACITY = 0.7;
window.plugin.portalHighligherResoCountColor.highlight = function (data, resoLevel) {
  var resos = data.portal.options.details.resonatorArray.resonators,
    resoLevelCount = 0;
  $.each(resos, function (ind, reso) {
    if(reso && reso.level == resoLevel) {
      resoLevelCount++;
    }
  });
  // if(resoLevelCount === resoLevel) {
  data.portal.setStyle({
    fillColor: window.COLORS_LVL[resoLevelCount],
    fillOpacity: window.plugin.portalHighligherResoCountColor.PORTAL_FILL_OPACITY
  });
  // }
}
window.plugin.portalHighligherResoCountColor.getHighlighter = function (resoLevel) {
  return(function (data) {
    window.plugin.portalHighligherResoCountColor.highlight(data, resoLevel);
  });
}
var setup = function () {
  for(var resoLevel = 1; resoLevel <= window.plugin.portalHighligherResoCountColor.RESOS_PER_PORTAL; resoLevel++) {
    window.addPortalHighlighter('Color with R' + resoLevel, window.plugin.portalHighligherResoCountColor.getHighlighter(resoLevel));
  }
}
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

