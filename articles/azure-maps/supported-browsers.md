---
title: Web SDK supported browsers
titleSuffix: Microsoft Azure Maps
description: Find out how to check whether the Azure Maps Web SDK supports a browser. View a list of supported browsers. Learn how to use map services with legacy browsers.
author: eriklindeman
ms.author: eriklind
ms.date: 06/22/2023
ms.topic: how-to
ms.service: azure-maps
ms.custom: devx-track-js
---

# Web SDK supported browsers

The Azure Maps Web SDK provides a helper function called [atlas.isSupported]. This function detects whether a web browser has the minimum set of WebGL features required to support loading and rendering the map control. Here's an example of how to use the function:

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

See also [Target legacy browsers] later in this article.

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
> If you're embedding a map inside a mobile application by using a WebView control, you might prefer to use the [npm package of the Azure Maps Web SDK] instead of referencing the version of the SDK that's hosted on Azure Content Delivery Network. This approach reduces loading time because the SDK is already be on the user's device and doesn't need to be downloaded at run time.

## Node.js

The following Web SDK modules are also supported in Node.js:

- Services module ([documentation] | [npm module])

## <a name="Target-Legacy-Browsers"></a>Target legacy browsers

You might want to target older browsers that don't support WebGL or that have only limited support for it. In such cases, you can use Azure Maps services together with an open-source map control like [Leaflet].

The [Render Azure Maps in Leaflet] Azure Maps sample shows how to render Azure Maps Raster Tiles in the Leaflet JS map control. This sample uses the open source [Azure Maps Leaflet plugin]. For the source code for this sample, see [Render Azure Maps in Leaflet sample source code].

<!----------------------------------------
<iframe height="500" scrolling="no" title="Azure Maps + Leaflet" src="//codepen.io/azuremaps/embed/GeLgyx/?height=500&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/GeLgyx/'>Azure Maps + Leaflet</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.</iframe>
---------------------------------------->

For more code samples using Azure Maps in Leaflet, see [Azure Maps Samples].

For a list of third-party map control plug-ins, see [Azure Maps community - Open-source projects].

## Next steps

Learn more about the Azure Maps Web SDK:

> [!div class="nextstepaction"]
> [Map control]

> [!div class="nextstepaction"]
> [Services module]

[atlas.isSupported]: /javascript/api/azure-maps-control/atlas#issupported-boolean-
[Azure Maps community - Open-source projects]: open-source-projects.md#third-party-map-control-plugins
[Azure Maps Leaflet plugin]: https://github.com/azure-samples/azure-maps-leaflet
[Azure Maps Samples]: https://samples.azuremaps.com/?search=leaflet
[documentation]: how-to-use-services-module.md
[Leaflet]: https://leafletjs.com
[Map control]: how-to-use-map-control.md
[npm module]: https://www.npmjs.com/package/azure-maps-rest
[npm package of the Azure Maps Web SDK]: https://www.npmjs.com/package/azure-maps-control
[Render Azure Maps in Leaflet sample source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Third%20Party%20Map%20Controls/Render%20Azure%20Maps%20in%20Leaflet/Render%20Azure%20Maps%20in%20Leaflet.html
[Render Azure Maps in Leaflet]: https://samples.azuremaps.com/third-party-map-controls/render-azure-maps-in-leaflet
[Services module]: how-to-use-services-module.md
[Target legacy browsers]: #Target-Legacy-Browsers
