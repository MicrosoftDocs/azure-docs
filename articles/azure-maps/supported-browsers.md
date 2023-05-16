---
title: Web SDK supported browsers | Microsoft Azure Maps
description: Find out how to check whether the Azure Maps Web SDK supports a browser. View a list of supported browsers. Learn how to use map services with legacy browsers.
author: eriklindeman
ms.author: eriklind
ms.date: 03/25/2019
ms.topic: conceptual
ms.service: azure-maps
---

# Web SDK supported browsers

The Azure Maps Web SDK provides a helper function called [atlas.isSupported](/javascript/api/azure-maps-control/atlas#issupported-boolean-). This function detects whether a web browser has the minimum set of WebGL features required to support loading and rendering the map control. Here's an example of how to use the function:

```JavaScript
if (!atlas.isSupported()) {
    alert('Your browser is not supported by Azure Maps');
} else if (!atlas.isSupported(true)) {
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
- Apple Safari (macOS X) (current and previous version)

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

You might want to target older browsers that don't support WebGL or that have only limited support for it. In such cases, we recommend that you use Azure Maps services together with an open-source map control like [Leaflet](https://leafletjs.com/). Here's an example that makes use of the open source [Azure Maps Leaflet plugin](https://github.com/azure-samples/azure-maps-leaflet).

<br/>

<iframe height="500" scrolling="no" title="Azure Maps + Leaflet" src="//codepen.io/azuremaps/embed/GeLgyx/?height=500&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/GeLgyx/'>Azure Maps + Leaflet</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

For code samples using Azure Maps in Leaflet, see [Azure Maps Samples](https://samples.azuremaps.com/?search=leaflet).

For a list of third-party map control plug-ins, see [Azure Maps community - Open-source projects](open-source-projects.md#third-part-map-control-plugins).

## Next steps

Learn more about the Azure Maps Web SDK:

[Map control](how-to-use-map-control.md)

[Services module](how-to-use-services-module.md)
