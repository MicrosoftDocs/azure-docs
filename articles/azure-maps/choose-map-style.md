---
title: Change the style of the Azure Maps Web Map Control
description: "Learn how to change a map's style and options. See how to add a style picker control to a map in Azure Maps so that users can switch between different styles."
author: sinnypan
ms.author: sipa
ms.date: 04/26/2020
ms.topic: conceptual
ms.service: azure-maps
ms.custom: devx-track-js
---

# Change the style of the map

The map control supports several different map [style options](/javascript/api/azure-maps-control/atlas.styleoptions) and [base map styles](supported-map-styles.md). All styles can be set when the map control is being initialized. Or, you can set styles by using the map control's `setStyle` function. This article shows you how to use these style options to customize the map's appearance. Also, you'll learn how to implement the style picker control in your map. The style picker control allows the user to toggle between different base styles.

## Set map style options

Style options can be set during web control initialization. Or, you can update style options by calling the map control's `setStyle` function. To see all available style options, see [style options](/javascript/api/azure-maps-control/atlas.styleoptions).

```javascript
//Set the style options when creating the map.
var map = new atlas.Map('map', {
    renderWorldCopies: false,
    showBuildingModels: false,
    showLogo: true,
    showFeedbackLink: true,
    style: 'road'

    //Additional map options.
};

//Update the style options at anytime using `setStyle` function.
map.setStyle({
    renderWorldCopies: true,
    showBuildingModels: true,
    showLogo: false,
    showFeedbackLink: false
});
```

The following tool shows how the different style options change how the map is rendered. To see the 3D buildings, zoom in close to a major city.

<br/>

<iframe height="700" scrolling="no" title="Map style options" src="https://codepen.io/azuremaps/embed/eYNMjPb?height=700&theme-id=0&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/eYNMjPb'>Map style options</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Set a base map style

You can also initialize the map control with one of the [base map styles](supported-map-styles.md) that are available in the Web SDK. You can then use the `setStyle` function to update the base style with a different map style.

### Set a base map style on initialization

Base styles of the map control can be set during initialization. In the following code, the `style` option of the map control is set to the [`grayscale_dark` base map style](supported-map-styles.md#grayscale_dark).  

```javascript
var map = new atlas.Map('map', {
    style: 'grayscale_dark',

    //Additional map options
);
```

<br/>

<iframe height='500' scrolling='no' title='Setting the style on map load' src='//codepen.io/azuremaps/embed/WKOQRq/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true'>See the Pen <a href='https://codepen.io/azuremaps/pen/WKOQRq/'>Setting the style on map load</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Update the base map style

The base map style can be updated by using the `setStyle` function and setting the `style` option to either change to a different base map style or add additional style options.

```javascript
map.setStyle({ style: 'satellite' });
```

In the following code, after a map instance is loaded, the map style is updated from `grayscale_dark` to `satellite` using the [setStyle](/javascript/api/azure-maps-control/atlas.map#setstyle-styleoptions-) function.

<br/>

<iframe height='500' scrolling='no' title='Updating the style' src='//codepen.io/azuremaps/embed/yqXYzY/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true'>See the Pen <a href='https://codepen.io/azuremaps/pen/yqXYzY/'>Updating the style</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add the style picker control

The style picker control provides an easy to use button with flyout panel that can be used by the end user to switch between base styles.

The style picker has two different layout options: `icon` and `list`. Also, the style picker allows you to choose two different style picker control `style` options: `light` and `dark`. In this example, the style picker uses the `icon` layout and displays a select list of base map styles in the form of icons. The style control picker includes the following base set of styles: `["road", "grayscale_light", "grayscale_dark", "night", "road_shaded_relief"]`. For more information on style picker control options, see [Style Control Options](/javascript/api/azure-maps-control/atlas.stylecontroloptions).

The image below shows the style picker control displayed in `icon` layout.

:::image type="content" source="./media/choose-map-style/style-picker-icon-layout.png" alt-text="Style picker icon layout":::

The image below shows the style picker control displayed in `list` layout.

:::image type="content" source="./media/choose-map-style/style-picker-list-layout.png" alt-text="Style picker list layout":::

> [!IMPORTANT]
> By default the style picker control lists all the styles available under the S0 pricing tier of Azure Maps. If you want to reduce the number of styles in this list, pass an array of the styles you want to appear in the list into the `mapStyle` option of the style picker. If you are using Gen 1 (S1) or Gen 2 pricing tier and want to show all available styles, set the `mapStyles` option of the style picker to `"all"`.

The following code shows you how to override the default `mapStyles` base style list. In this example, we're setting the `mapStyles` option to list which base styles we want to be displayed by the style picker control.

<br/>

<iframe height='500' scrolling='no' title='Adding the style picker' src='//codepen.io/azuremaps/embed/OwgyvG/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true'>See the Pen <a href='https://codepen.io/azuremaps/pen/OwgyvG/'>Adding the style picker</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

To learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](/javascript/api/azure-maps-control/atlas.map)

> [!div class="nextstepaction"]
> [StyleOptions](/javascript/api/azure-maps-control/atlas.styleoptions)

> [!div class="nextstepaction"]
> [StyleControl](/javascript/api/azure-maps-control/atlas.control.stylecontrol)

> [!div class="nextstepaction"]
> [StyleControlOptions](/javascript/api/azure-maps-control/atlas.stylecontroloptions)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add map controls](map-add-controls.md)

> [!div class="nextstepaction"]
> [Add a symbol layer](map-add-pin.md)

> [!div class="nextstepaction"]
> [Add a bubble layer](map-add-bubble-layer.md)
