// ==UserScript==
// @id             iitc-plugin-highlight-portals-missing-resonators-level-8@amsdams
// @name           IITC plugin: highlight portals missing resonators level 8
// @category       Highlighter
// @version        0.1.3.20130927.121818
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL https://raw.github.com/amsdams/iitc-plugins/master/portal-highlighter-missing-resonators-level-8.user.js
// @downloadURL https://raw.github.com/amsdams/iitc-plugins/master/portal-highlighter-missing-resonators-level-8.user.js
// @description    [local-2013-09-27-121818] highlight portals missing level 8 resonators
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
window.plugin.portalHighligherPortalsMissingResonatorsLevel8 = function () {};
window.plugin.portalHighligherPortalsMissingResonatorsLevel8.RESOS_PER_PORTAL=8;
window.plugin.portalHighligherPortalsMissingResonatorsLevel8.PORTAL_FILL_COLOR='red';
window.plugin.portalHighligherPortalsMissingResonatorsLevel8.PORTAL_FILL_OPACITY=0.7;

window.plugin.portalHighligherPortalsMissingResonatorsLevel8.highlight = function (data, missing) {
  var resos = data.portal.options.details.resonatorArray.resonators,
    countMissing = 0;
  $.each(resos, function (ind, reso) {
    if(!reso || reso.level !== window.MAX_PORTAL_LEVEL) {
      countMissing++;
    }
  });
  if(countMissing === missing) {
    data.portal.setStyle({
      fillColor: window.plugin.portalHighligherPortalsMissingResonatorsLevel8.PORTAL_FILL_COLOR,
      fillOpacity: window.plugin.portalHighligherPortalsMissingResonatorsLevel8.PORTAL_FILL_OPACITY
    });
  }
}
window.plugin.portalHighligherPortalsMissingResonatorsLevel8.getHighlighter = function (missing) {
  return(function (data) {
    window.plugin.portalHighligherPortalsMissingResonatorsLevel8.highlight(data, missing);
  });
}
var setup = function () {
  for(var missing = 1; missing <=  window.plugin.portalHighligherPortalsMissingResonatorsLevel8.RESOS_PER_PORTAL; missing++) {
    window.addPortalHighlighter('Resos Missing: ' + missing + ' level '+window.MAX_PORTAL_LEVEL+' resonators ', window.plugin.portalHighligherPortalsMissingResonatorsLevel8.getHighlighter(missing));
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

