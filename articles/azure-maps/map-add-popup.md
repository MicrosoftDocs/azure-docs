---
title: Add a popup to a point on a map |Microsoft Azure Maps
description: In this article, you will learn how to add a popup to a point using the Microsoft Azure Maps Web SDK.
author: jingjing-z
ms.author: jinzh
ms.date: 02/27/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a popup to the map

This article shows you how to add a popup to a point on a map.

## Understand the code

The following code adds a point feature, that has `name` and `description` properties, to the map using a symbol layer. An instance of the [Popup class](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest) is created but not displayed. Mouse events are added to the symbol layer to trigger opening and closing the popup. When the marker symbol is hovered, the popup's `position` property is updated with position of the marker, and the `content` option is updated with some HTML that wraps the  `name` and `description` properties of the point feature being hovered. The popup is then displayed on the map using its `open` function.

```javascript
//Define an HTML template for a custom popup content laypout.
var popupTemplate = '<div class="customInfobox"><div class="name">{name}</div>{description}</div>';

//Create a data source and add it to the map.
var dataSource = new atlas.source.DataSource();
map.sources.add(dataSource);

dataSource.add(new atlas.data.Feature(new atlas.data.Point([-122.1333, 47.63]), {
  name: 'Microsoft Building 41', 
  description: '15571 NE 31st St, Redmond, WA 98052'
}));

//Create a layer to render point data.
var symbolLayer = new atlas.layer.SymbolLayer(dataSource);

//Add the polygon and line the symbol layer to the map.
map.layers.add(symbolLayer);

//Create a popup but leave it closed so we can update it and display it later.
popup = new atlas.Popup({
  pixelOffset: [0, -18],
  closeButton: false
});

//Add a hover event to the symbol layer.
map.events.add('mouseover', symbolLayer, function (e) {
  //Make sure that the point exists.
  if (e.shapes && e.shapes.length > 0) {
    var content, coordinate;
    var properties = e.shapes[0].getProperties();
    content = popupTemplate.replace(/{name}/g, properties.name).replace(/{description}/g, properties.description);
    coordinate = e.shapes[0].getCoordinates();

    popup.setOptions({
      //Update the content of the popup.
      content: content,

      //Update the popup's position with the symbol's coordinate.
      position: coordinate

    });
    //Open the popup.
    popup.open(map);
  }
});

map.events.add('mouseleave', symbolLayer, function (){
  popup.close();
});
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Add a pop up using Azure Maps' src='//codepen.io/azuremaps/embed/MPRPvz/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/MPRPvz/'>Add a pop up using Azure Maps</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Reusing a popup with multiple points

When you have a large number of points and only want to show one popup at a time, the best approach is to create one popup and reuse. By reusing the popup, the number of DOM elements created by the application is greatly reduced which can provide better performance. The following sample creates 3-point features. If you click on any of them, a popup will be displayed with the content for that point feature.

<br/>

<iframe height='500' scrolling='no' title='Reusing Popup with Multiple Pins' src='//codepen.io/azuremaps/embed/rQbjvK/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/rQbjvK/'>Reusing Popup with Multiple Pins</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Customizing a popup

By default the popup has a white background, a pointer arrow on the bottom, and a close button in the top-right corner. The following sample changes the background color to black using the `fillColor` option of the popup. The close button is removed by setting the `CloseButton` option to false. The HTML content of the popup uses padded of 10 pixels from the edges of the popup. The text is made white, so it shows up nicely on the black background.  

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Customized Popup" src="//codepen.io/azuremaps/embed/ymKgdg/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/ymKgdg/'>Customized Popup</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add popup templates to the map

Popup templates make it easy to create data driven layouts for popups. The sample below demonstrate the use of various popup templates to generate formatted content using properties of features.

### Points with defined templates

The **String template** displays the placeholders of the defined feature properties. The properties of the feature don't have to be assigned a value of type String. For example, `value1` holds an integer. These values are passed to the content property of the `popupTemplate` and are displayed on a white background, with a close button in the top-right corner. A pointer arrow on the bottom appears on medium and small screen sizes.

The **PropertyInfo template** displays defined properties that are assigned with variables. This popup template shows the content in a table format, with a close button in the top-right corner. A pointer arrow on the bottom appears on medium and small screen sizes.

A template may also display content of multiple templates. In the point sample with a **Multiple content template**, a String template with placeholders renders values on a white background. Below the String template, a PropertyInfo template renders a full width image inside a table. There is only one case in which a String template can be used to render images. And that's, if the String template has an image tag in it. And, the value being passed to the image tag is a URL to an image.

### Points without a defined template

The sample below displays three points without a defined template. In each case, the popup templates display properties of the feature per default settings. When the title and description are the only assigned properties, the popup template shows a white background, a close button in the top-right corner. When the title and properties other than the description are assigned, the popup template shows a title and a table. The table renders the properties and the values of the properties. Even when falling back to the default settings, the popup template can still be manipulated. For example, users can turn off hyperlink detection.

<br/>

<iframe height='500' scrolling='no' title='PopupTemplates' src='//codepen.io/azuremaps/embed/dyovrzL/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/dyovrzL/'>PopupTemplates</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Reuse popup template

If you only want to show one popup template at a time, for multiple points, then the best approach is to create one popup template and reuse it. By reusing the popup template, the number of DOM elements created by the application is reduced which then improves the performance. The following sample uses the same popup template for three points. If you click on any of them, a popup will be displayed with the content for that point feature.

<br/>

<iframe height='500' scrolling='no' title='ReusePopupTemplate' src='//codepen.io/azuremaps/embed/WNvjxGw/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WNvjxGw/'>ReusePopupTemplate</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Popup events

Popups can be opened, closed, and dragged. The popup class provides events to help developers react to these events. The following sample highlights which events fire when the user opens, closes, or drags the popup. 

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Popup events" src="//codepen.io/azuremaps/embed/BXrpvB/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/BXrpvB/'>Popup events</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [PopupOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popupoptions?view=azure-iot-typescript-latest)

See the following great articles for full code samples:

> [!div class="nextstepaction"]
> [Add a symbol layer](./map-add-pin.md)

> [!div class="nextstepaction"]
> [Add an HTML marker](./map-add-custom-html.md)

> [!div class="nextstepaction"]
> [Add a line layer](map-add-line-layer.md)

> [!div class="nextstepaction"]
> [Add a polygon layer](map-add-shape.md)
