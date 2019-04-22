---
title: Web SDK supported browsers - Azure Maps | Microsoft Docs
description: Learn about supported browsers for Azure Maps Web SDK
author: rbrundritt
ms.author: richbrun
ms.date: 03/25/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendleton
---

# Web SDK supported browsers

The Azure Maps Web SDK provides a helper function [atlas.isSupported](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas?view=azure-iot-typescript-latest#issupported-boolean-) to detect if a web browser has the minimum required WebGL features to support loading and rendering the map control.

```
if(!atlas.isSupported()) {
    alert('Your browser is not supported by Azure Maps');
} else if(!atlas.isSupported(true)) {
    alert('Your browser is supported by Azure Maps, but may have major performance caveats.');
} else {
    //Your browser is supported. Add your map code here.
}
```

## Desktop

The Azure Maps Web SDK supports the following desktop browsers.

- The current and previous version of Microsoft Edge 
- The current and previous version of Chrome 
- The current and previous version of Firefox 
- The current and previous version of Safari (Mac OS X) 

See also [Target legacy browsers](#Target-Legacy-Browsers).

## Mobile

The Azure Maps Web SDK supports the following mobile browsers.

-  Android
    * Current version of Chrome on Android 6.0+
    * Chrome WebView on Android 6.0+
- iOS
    * Mobile Safari on the current and previous major version of iOS
    * UIWebView and WKWebView on the current and previous major version of iOS
    * Current version of Chrome for iOS

> [!TIP]
> If you are embedding a map inside a mobile application using a WebView control, you may prefer using the [npm package of the Azure Maps Web SDK](https://www.npmjs.com/package/azure-maps-control) instead of referencing the CDN hosted version of the SDK. This will reduce loading time as the SDK will already be on the user's device and not need to be downloaded at runtime.

## Node.js

The following Web SDK modules are also supported in Node.js:

- Services module ([documentation](how-to-use-services-module.md) | [npm module](https://www.npmjs.com/package/azure-maps-rest))

## <a name="Target-Legacy-Browsers"></a>Target legacy browsers

If you need to target older browsers that may not support or have limited support for WebGL, it is recommended to use the Azure Maps Services in combination with an open-source map control such as [leaflet](https://leafletjs.com/). 


<iframe height="500" style="width: 100%;" scrolling="no" title="Azure Maps + Leaflet" src="//codepen.io/azuremaps/embed/GeLgyx/?height=500&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/GeLgyx/'>Azure Maps + Leaflet</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Next steps

Learn more about the Azure Maps Web SDK.

> [!div class="nextstepaction"]
> [Map control](how-to-use-map-control.md)

> [!div class="nextstepaction"]
> [Services module](how-to-use-services-module.md)
