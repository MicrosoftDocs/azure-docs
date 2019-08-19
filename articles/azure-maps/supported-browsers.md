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

The Azure Maps Web SDK provides a helper function called [atlas.isSupported](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas?view=azure-iot-typescript-latest#issupported-boolean-). This function detects whether a web browser has the minimum set of WebGL features required to support loading and rendering the map control. Here's an example of how to use the function:

```
if(!atlas.isSupported()) {
    alert('Your browser is not supported by Azure Maps');
} else if(!atlas.isSupported(true)) {
    alert('Your browser is supported by Azure Maps, but may have major performance caveats.');
} else {
    // Your browser is supported. Add your map code here.
}
```

## Desktop

The Azure Maps Web SDK supports the following desktop browsers:

- Microsoft Edge (current and previous version)
- Google Chrome (current and previous version)
- Mozilla Firefox  (current and previous version)
- Apple Safari (Mac OS X) (current and previous version)

See also [Target legacy browsers](#Target-Legacy-Browsers) later in this article.

## Mobile

The Azure Maps Web SDK supports the following mobile browsers:

- Android
  - Current version of Chrome on Android 6.0 and later
  - Chrome WebView on Android 6.0 and later
- iOS
  - Mobile Safari on the current and previous major version of iOS
  - UIWebView and WKWebView on the current and previous major version of iOS
  - Current version of Chrome for iOS

> [!TIP]
> If you're embedding a map inside a mobile application by using a WebView control, you might prefer to use the [npm package of the Azure Maps Web SDK](https://www.npmjs.com/package/azure-maps-control) instead of referencing the version of the SDK that's hosted on Azure Content Delivery Network. This approach reduces loading time because the SDK is already be on the user's device and doesn't need to be downloaded at run time.

## Node.js

The following Web SDK modules are also supported in Node.js:

- Services module ([documentation](how-to-use-services-module.md) | [npm module](https://www.npmjs.com/package/azure-maps-rest))

## <a name="Target-Legacy-Browsers"></a>Target legacy browsers

You might want to target older browsers that don't support WebGL or that have only limited support for it. In such cases, we recommend that you use Azure Maps services together with an open-source map control like [Leaflet](https://leafletjs.com/). Here's an example:

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Azure Maps + Leaflet" src="//codepen.io/azuremaps/embed/GeLgyx/?height=500&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/GeLgyx/'>Azure Maps + Leaflet</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Next steps

Learn more about the Azure Maps Web SDK:

> [!div class="nextstepaction"]
> [Map control](how-to-use-map-control.md)

> [!div class="nextstepaction"]
> [Services module](how-to-use-services-module.md)
