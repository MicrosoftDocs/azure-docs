---
title: Change the style of the Azure Maps Web Map Control
description: "Learn how to change a map's style and options. See how to add a style picker control to a map in Azure Maps so that users can switch between different styles."
author: sinnypan
ms.author: sipa
ms.date: 04/26/2020
ms.topic: conceptual
ms.service: azure-maps
ms.custom:
---

# Change the style of the map

The map control supports several different map [style options] and [base map styles]. All styles can be set when the map control is being initialized. Or, you can set styles by using the map control's `setStyle` function. This article shows you how to use these style options to customize the map's appearance and how to implement the style picker control in your map. The style picker control allows the user to toggle between different base styles.

## Set map style options

Style options can be set during web control initialization. Or, you can update style options by calling the map control's `setStyle` function. To see all available style options, see [style options].

```javascript
//Set the style options when creating the map.
var map = new atlas.Map('map', {
    renderWorldCopies: false,
    showLogo: true,
    showFeedbackLink: true,
    style: 'road'

    //Additional map options.
};

//Update the style options at anytime using `setStyle` function.
map.setStyle({
    renderWorldCopies: true,
    showLogo: false,
    showFeedbackLink: false
});
```

For a fully functional sample that shows how the different styles affect how the map is rendered, see [Map style options] in the [Azure Maps Samples]. For the source code for this sample, see [Map style options source code].

<!-----------------------------------------------------------------------------------------------
<br/>
> [!VIDEO https://codepen.io/azuremaps/embed/eYNMjPb?height=700&theme-id=0&default-tab=result]
----------------------------------------------------------------------------------------------->
## Set a base map style

You can also initialize the map control with one of the [base map styles] that are available in the Web SDK. You can then use the `setStyle` function to update the base style with a different map style.

### Set a base map style on initialization

Base styles of the map control can be set during initialization. In the following code, the `style` option of the map control is set to the
[grayscale_dark] base map style.  

```javascript
var map = new atlas.Map('map', {
    style: 'grayscale_dark',

    //Additional map options
);
```

:::image type="content" source="./media/choose-map-style/set-base-map-style-on-initialization.png" alt-text="Screenshot showing the grayscale dark style being set during the map load process.":::

<!-----------------------------------------------------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/WKOQRq/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
----------------------------------------------------------------------------------------------->

### Update the base map style

The base map style can be updated by using the `setStyle` function and setting the `style` option to either change to a different base map style or add more style options.

In the following code, after a map instance is loaded, the map style is updated from `grayscale_dark` to `satellite` using the [setStyle] function.

```javascript
map.setStyle({ style: 'satellite' });
```

:::image type="content" source="./media/choose-map-style/update-base-map-style.png" alt-text="Screenshot showing the satellite style, set after the map load process.":::

<!-----------------------------------------------------------------------------------------------
<br/>

> [!VIDEO //codepen.io/azuremaps/embed/yqXYzY/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
----------------------------------------------------------------------------------------------->

## Add the style picker control

The style picker control provides an easy to use button with flyout panel that can be used by the end user to switch between base styles.

The style picker has two different layout options: `icon` and `list`. Also, the style picker allows you to choose two different style picker control `style` options: `light` and `dark`. In this example, the style picker uses the `icon` layout and displays a select list of base map styles in the form of icons. The style control picker includes the following base set of styles: `["road", "grayscale_light", "grayscale_dark", "night", "road_shaded_relief"]`. For more information on style picker control options, see [Style Control Options].

The following image shows the style picker control displayed in `icon` layout.

:::image type="content" source="./media/choose-map-style/style-picker-icon-layout.png" alt-text="Style picker icon layout":::

The following image shows the style picker control displayed in `list` layout.

:::image type="content" source="./media/choose-map-style/style-picker-list-layout.png" alt-text="Style picker list layout":::

> [!IMPORTANT]
> By default the style picker control lists all the styles available under the Gen1 (S0) pricing tier of Azure Maps. If you want to reduce the number of styles in this list, pass an array of the styles you want to appear in the list into the `mapStyle` option of the style picker. If you are using Gen1 (S1) or Gen2 pricing tier and want to show all available styles, set the `mapStyles` option of the style picker to `"all"`.
>
> **Azure Maps Gen1 pricing tier retirement**
>
> Gen1 pricing tier is now deprecated and will be retired on 9/15/26. Gen2 pricing tier replaces Gen1 (both S0 and S1) pricing tier. If your Azure Maps account has Gen1 pricing tier selected, you can switch to Gen2 pricing tier before it’s retired, otherwise it will automatically be updated. For more information, see [Manage the pricing tier of your Azure Maps account].

The following code shows you how to override the default `mapStyles` base style list. In this example, we're setting the `mapStyles` option to list the base styles to display in the style picker control.

```javascript
/*Add the Style Control to the map*/
map.controls.add(new atlas.control.StyleControl({
  mapStyles: ['road', 'grayscale_dark', 'night', 'road_shaded_relief', 'satellite', 'satellite_road_labels'],
  layout: 'list'
}), {
  position: 'top-right'
});  
```

:::image type="content" source="./media/choose-map-style/Add-style-picker-control.png" alt-text="Screenshot showing a map with the Style picker control with the layout property set to list.":::

<!-----------------------------------------------------------------------------------------------
<br/>

> [!VIDEO //codepen.io/azuremaps/embed/OwgyvG/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
----------------------------------------------------------------------------------------------->

## Next steps

To learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map]

> [!div class="nextstepaction"]
> [StyleOptions]

> [!div class="nextstepaction"]
> [StyleControl]

> [!div class="nextstepaction"]
> [StyleControlOptions]

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add map controls]

> [!div class="nextstepaction"]
> [Add a symbol layer]

> [!div class="nextstepaction"]
> [Add a bubble layer]

[style options]: /javascript/api/azure-maps-control/atlas.styleoptions
[base map styles]: supported-map-styles.md

[Add a bubble layer]: map-add-bubble-layer.md
[Add a symbol layer]: map-add-pin.md
[Add map controls]: map-add-controls.md
[Azure Maps Samples]: https://samples.azuremaps.com
[grayscale_dark]: supported-map-styles.md#grayscale_dark
[Manage the pricing tier of your Azure Maps account]: how-to-manage-pricing-tier.md
[Map style options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Map/Map%20style%20options/Map%20style%20options.html
[Map style options]: https://samples.azuremaps.com/map/map-style-options
[Map]: /javascript/api/azure-maps-control/atlas.map
[setStyle]: /javascript/api/azure-maps-control/atlas.map#azure-maps-control-atlas-map-setstyle
[Style Control Options]: /javascript/api/azure-maps-control/atlas.stylecontroloptions
[StyleControl]: /javascript/api/azure-maps-control/atlas.control.stylecontrol
[StyleControlOptions]: /javascript/api/azure-maps-control/atlas.stylecontroloptions
[StyleOptions]: /javascript/api/azure-maps-control/atlas.styleoptions
