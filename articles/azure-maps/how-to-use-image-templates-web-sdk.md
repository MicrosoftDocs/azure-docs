---
title: Image templates in the Azure Maps Web SDK | Microsoft Azure Maps
description: Learn how to add image icons and pattern-filled polygons to maps by using the Azure Maps Web SDK. View available image and fill pattern templates.
author: sinnypan
ms.author: sipa
ms.date: 8/6/2019
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
ms.custom:
---

# How to use image templates

Images can be used with HTML markers and various layers within the Azure Maps web SDK:

- Symbol layers can render points on the map with an image icon. Symbols can also be rendered along a lines path.
- Polygon layers can be rendered with a fill pattern image.
- HTML markers can render points using images and other HTML elements.

In order to ensure good performance with layers, load the images into the map image sprite resource before rendering. The [IconOptions](/javascript/api/azure-maps-control/atlas.iconoptions), of the SymbolLayer, preloads a couple of marker images in a handful of colors into the map image sprite, by default. These marker images and more are available as SVG templates. They can be used to create images with custom scales, or used as a customer primary and secondary color. In total there are 42 image templates provided: 27 symbol icons and 15 polygon fill patterns.

Image templates can be added to the map image sprite resources by using the `map.imageSprite.createFromTemplate` function. This function allows up to five parameters to be passed in;

```javascript
createFromTemplate(id: string, templateName: string, color?: string, secondaryColor?: string, scale?: number): Promise<void>
```

The `id` is a unique identifier you create. The `id` is assigned to the image when it's added to the maps image sprite. Use this identifier in the layers to specifying which image resource to render. The `templateName` specifies which image template to use. The `color` option sets the primary color of the image and the `secondaryColor` options sets the secondary color of the image. The `scale` option scales the image template before applying it to the image sprite. When the image is applied to the image sprite, it's converted into a PNG. To ensure crisp rendering, it's better to scale up the image template before adding it to the sprite, than to scale it up in a layer.

This function asynchronously loads the image into the image sprite. Thus, it returns a Promise that you can wait for this function to complete.

The following code shows how to create an image from one of the built-in templates, and use it with a symbol layer.

```javascript
map.imageSprite.createFromTemplate('myTemplatedIcon', 'marker-flat', 'teal', '#fff').then(function () {

   //Add a symbol layer that uses the custom created icon.
   map.layers.add(new atlas.layer.SymbolLayer(datasource, null, {
      iconOptions: {
         image: 'myTemplatedIcon'
      }
   }));
});
```

## Use an image template with a symbol layer

Once an image template is loaded into the map image sprite, it can be rendered as a symbol in a symbol layer by referencing the image resource ID in the `image` option of the `iconOptions`.

The [Symbol layer with built-in icon template] sample demonstrates how to do this by rendering a symbol layer using the `marker-flat` image template with a teal primary color and a white secondary color, as shown in the following screenshot.

:::image type="content" source="./media/how-to-use-image-templates-web-sdk/symbol-layer-with-built-in-icon-template.png" alt-text="Screenshot showing a map displaying a symbol layer using the marker-flat image template with a teal primary color and a white secondary color.":::

For the source code for this sample, see [Symbol layer with built-in icon template sample code].

<!-----------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/VoQMPp/?height=500&theme-id=0&default-tab=js,result&editable=true]
----------------------------------------------------->

## Use an image template along a lines path

Once an image template is loaded into the map image sprite, it can be rendered along the path of a line by adding a LineString to a data source and using a symbol layer with a `lineSpacing`option and by referencing the ID of the image resource in the `image` option of th `iconOptions`.

The [Line layer with built-in icon template] demonstrates how to do this. As show in the following screenshot, it renders a red line on the map and uses a symbol layer using the `car` image template with a dodger blue primary color and a white secondary color. For the source code for this sample, see [Line layer with built-in icon template sample code].

:::image type="content" source="./media/how-to-use-image-templates-web-sdk/line-layer-with-built-in-icon-template.png" alt-text="Screenshot showing a map displaying a line layer marking the route with car icons along the route.":::

<!-----------------------------------------------------
<br/>

> [!VIDEO //codepen.io/azuremaps/embed/KOQvJe/?height=500&theme-id=0&default-tab=js,result&editable=true]
----------------------------------------------------->

> [!TIP]
> If the image template points up, set the `rotation` icon option of the symbol layer to 90 if you want it to point in the same direction as the line.

## Use an image template with a polygon layer

Once an image template is loaded into the map image sprite, it can be rendered as a fill pattern in a polygon layer by referencing the image resource ID in the `fillPattern` option of the layer.

The [Fill polygon with built-in icon template] sample demonstrates how to render a polygon layer using the `dot` image template with a red primary color and a transparent secondary color, as shown in the following screenshot. For the source code for this sample, see [Fill polygon with built-in icon template sample code].

:::image type="content" source="./media/how-to-use-image-templates-web-sdk/fill-polygon-with-built-in-icon-template.png" alt-text="Screenshot showing a map displaying a polygon layer using the dot image template with a red primary color and a transparent secondary color.":::

<!-----------------------------------------------------
<br/>

> [!VIDEO //codepen.io/azuremaps/embed/WVMEmz/?height=500&theme-id=0&default-tab=js,result&editable=true]
----------------------------------------------------->

> [!TIP]
> Setting the secondary color of fill patterns makes it easier to see the underlying map will still providing the primary pattern.

## Use an image template with an HTML marker

An image template can be retrieved using the `altas.getImageTemplate` function and used as the content of an HTML marker. The template can be passed into the `htmlContent` option of the marker, and then customized using the `color`, `secondaryColor`, and `text` options.

The [HTML Marker with built-in icon template] sample demonstrates this using the `marker-arrow` template with a red primary color, a pink secondary color, and a text value of "00", as shown in the following screenshot. For the source code for this sample, see [HTML Marker with built-in icon template sample code].

:::image type="content" source="./media/how-to-use-image-templates-web-sdk/html-marker-with-built-in-icon-template.png" alt-text="Screenshot showing a map displaying the marker-arrow template with a red primary color, a pink secondary color, and a text value of 00 inside the red arrow.":::

<!-----------------------------------------------------
<br/>

> [!VIDEO //codepen.io/azuremaps/embed/EqQvzq/?height=500&theme-id=0&default-tab=js,result&editable=true]
----------------------------------------------------->

> [!TIP]
> Image templates can be used outside of the map too. The getImageTemplate funciton returns an SVG string that has placeholders; `{color}`, `{secondaryColor}`, `{scale}`, `{text}`. Replace these placeholder values to create a valid SVG string. You can then either add the SVG string directly to the HTML DOM or convert it into a data URI and insert it into an image tag. For example:
>
> ```JavaScript
> //Retrieve an SVG template and replace the placeholder values.
> var svg = atlas.getImageTemplate('marker').replace(/{color}/, 'red').replace(/{secondaryColor}/, 'white').replace(/{text}/, '').replace(/{scale}/, 1);
>
> //Convert to data URI for use in image tags.
> var dataUri = 'data:image/svg+xml;base64,' + btoa(svg);
> ```

## Create custom reusable templates

If your application uses the same icon within different modules or if you're creating a module that adds more image templates, you can easily add and retrieve these icons from the Azure Maps web SDK. Use the following static functions on the `atlas` namespace.

| Name | Return Type | Description |
|------|-------------|-------------|
| `addImageTemplate(templateName: string, template: string, override: boolean)` | | Adds a custom SVG image template to the atlas namespace. |
|  `getImageTemplate(templateName: string, scale?: number)`| string | Retrieves an SVG template by name. |
| `getAllImageTemplateNames()` | string[] |  Retrieves an SVG template by name. |

SVG image templates support the following placeholder values:

| Placeholder | Description        |
|-------------|--------------------|
| `{color}`   | The primary color. |
| `{secondaryColor}` | The secondary color. |
| `{scale}` | The SVG image is converted to an png image when added to the map image sprite. This placeholder can be used to scale a template before it's converted to ensure it renders clearly. |
| `{text}` | The location to render text when used with an HTML Marker. |

The [Add custom icon template to atlas namespace] sample demonstrates how to take an SVG template, and add it to the Azure Maps web SDK as a reusable icon template, as shown in the following screenshot. For the source code for this sample, see [Add custom icon template to atlas namespace sample code].

:::image type="content" source="./media/how-to-use-image-templates-web-sdk/add-custom-icon-template-to-atlas-namespace.png" alt-text="Screenshot showing a map displaying a polygon layer in the shape of a big green triangle with multiple images of blue anchors inside.":::

<!-----------------------------------------------------
<br/>

> [!VIDEO //codepen.io/azuremaps/embed/NQyvEX/?height=500&theme-id=0&default-tab=js,result&editable=true]
---------------------------------------------->

## List of image templates

This table lists all image templates currently available within the Azure Maps web SDK. The template name is above each image. By default, the primary color is blue and the secondary color is white. To make the secondary color easier to see on a white background, the following images have the secondary color set to black.

**Symbol icon templates**

:::row:::
   :::column span="":::
      marker
   :::column-end:::
   :::column span="":::
      marker-thick
   :::column-end:::
   :::column span="":::
      marker-circle
   :::column-end:::
   :::column span="":::
      marker-flat
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![marker icon](./media/image-templates/marker.png)
   :::column-end:::
   :::column span="":::
      ![marker-thick icon](./media/image-templates/marker-thick.png)
   :::column-end:::
   :::column span="":::
      ![marker-circle icon](./media/image-templates/marker-circle.png)
   :::column-end:::
   :::column span="":::
      ![marker-flat icon](./media/image-templates/marker-flat.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      marker-square
   :::column-end:::
   :::column span="":::
      marker-square-cluster
   :::column-end:::
   :::column span="":::
      marker-arrow
   :::column-end:::
   :::column span="":::
      marker-ball-pin
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![marker-square icon](./media/image-templates/marker-square.png)
   :::column-end:::
   :::column span="":::
      ![marker-square-cluster icon](./media/image-templates/marker-square-cluster.png)
   :::column-end:::
   :::column span="":::
      ![marker-arrow icon](./media/image-templates/marker-arrow.png)
   :::column-end:::
   :::column span="":::
      ![marker-ball-pin icon](./media/image-templates/marker-ball-pin.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      marker-square-rounded
   :::column-end:::
   :::column span="":::
      marker-square-rounded-cluster
   :::column-end:::
   :::column span="":::
      flag
   :::column-end:::
   :::column span="":::
      flag-triangle
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![marker-square-rounded icon](./media/image-templates/marker-square-rounded.png)
   :::column-end:::
   :::column span="":::
      ![marker-square-rounded-cluster icon](./media/image-templates/marker-square-rounded-cluster.png)
   :::column-end:::
   :::column span="":::
      ![flag icon](./media/image-templates/flag.png)
   :::column-end:::
   :::column span="":::
      ![flag-triangle icon](./media/image-templates/flag-triangle.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      triangle
   :::column-end:::
   :::column span="":::
      triangle-thick
   :::column-end:::
   :::column span="":::
      triangle-arrow-up
   :::column-end:::
   :::column span="":::
      triangle-arrow-left
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![triangle icon](./media/image-templates/triangle.png)
   :::column-end:::
   :::column span="":::
      ![triangle-thick icon](./media/image-templates/triangle-thick.png)
   :::column-end:::
   :::column span="":::
      ![triangle-arrow-up icon](./media/image-templates/triangle-arrow-up.png)
   :::column-end:::
   :::column span="":::
      ![triangle-arrow-left icon](./media/image-templates/triangle-arrow-left.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      hexagon
   :::column-end:::
   :::column span="":::
      hexagon-thick
   :::column-end:::
   :::column span="":::
      hexagon-rounded
   :::column-end:::
   :::column span="":::
      hexagon-rounded-thick
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![hexagon icon](./media/image-templates/hexagon.png)
   :::column-end:::
   :::column span="":::
      ![hexagon-thick icon](./media/image-templates/hexagon-thick.png)
   :::column-end:::
   :::column span="":::
      ![hexagon-rounded icon](./media/image-templates/hexagon-rounded.png)
   :::column-end:::
   :::column span="":::
      ![hexagon-rounded-thick icon](./media/image-templates/hexagon-rounded-thick.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      pin
   :::column-end:::
   :::column span="":::
      pin-round
   :::column-end:::
   :::column span="":::
      rounded-square
   :::column-end:::
   :::column span="":::
      rounded-square-thick
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![pin icon](./media/image-templates/pin.png)
   :::column-end:::
   :::column span="":::
      ![pin-round icon](./media/image-templates/pin-round.png)
   :::column-end:::
   :::column span="":::
      ![rounded-square icon](./media/image-templates/rounded-square.png)
   :::column-end:::
   :::column span="":::
      ![rounded-square-thick icon](./media/image-templates/rounded-square-thick.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      arrow-up
   :::column-end:::
   :::column span="":::
      arrow-up-thin
   :::column-end:::
   :::column span="":::
      car
   :::column-end:::
   :::column span="":::
      &nbsp;
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![arrow-up icon](./media/image-templates/arrow-up.png)
   :::column-end:::
   :::column span="":::
      ![arrow-up-thin icon](./media/image-templates/arrow-up-thin.png)
   :::column-end:::
   :::column span="":::
      ![car icon](./media/image-templates/car.png)
   :::column-end:::
   :::column span="":::
      &nbsp;
   :::column-end:::
:::row-end:::

**Polygon fill pattern templates**

:::row:::
   :::column span="":::
      checker
   :::column-end:::
   :::column span="":::
      checker-rotated
   :::column-end:::
   :::column span="":::
      circles
   :::column-end:::
   :::column span="":::
      circles-spaced
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![checker icon](./media/image-templates/checker.png)
   :::column-end:::
   :::column span="":::
      ![checker-rotated icon](./media/image-templates/checker-rotated.png)
   :::column-end:::
   :::column span="":::
      ![circles icon](./media/image-templates/circles.png)
   :::column-end:::
   :::column span="":::
      ![circles-spaced icon](./media/image-templates/circles-spaced.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      diagonal-lines-up
   :::column-end:::
   :::column span="":::
      diagonal-lines-down
   :::column-end:::
   :::column span="":::
      diagonal-stripes-up
   :::column-end:::
   :::column span="":::
      diagonal-stripes-down
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![diagonal-lines-up icon](./media/image-templates/diagonal-lines-up.png)
   :::column-end:::
   :::column span="":::
      ![diagonal-lines-down icon](./media/image-templates/diagonal-lines-down.png)
   :::column-end:::
   :::column span="":::
      ![diagonal-stripes-up icon](./media/image-templates/diagonal-stripes-up.png)
   :::column-end:::
   :::column span="":::
      ![diagonal-stripes-down icon](./media/image-templates/diagonal-stripes-down.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      grid-lines
   :::column-end:::
   :::column span="":::
      rotated-grid-lines
   :::column-end:::
   :::column span="":::
      rotated-grid-stripes
   :::column-end:::
   :::column span="":::
      x-fill
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![grid-lines icon](./media/image-templates/grid-lines.png)
   :::column-end:::
   :::column span="":::
      ![rotated-grid-lines icon](./media/image-templates/rotated-grid-lines.png)
   :::column-end:::
   :::column span="":::
      ![rotated-grid-stripes icon](./media/image-templates/rotated-grid-stripes.png)
   :::column-end:::
   :::column span="":::
      ![x-fill icon](./media/image-templates/x-fill.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      zig-zag
   :::column-end:::
   :::column span="":::
      zig-zag-vertical
   :::column-end:::
   :::column span="":::
      dots
   :::column-end:::
   :::column span="":::
      &nbsp;
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![zig-zag icon](./media/image-templates/zig-zag.png)
   :::column-end:::
   :::column span="":::
      ![zig-zag-vertical icon](./media/image-templates/zig-zag-vertical.png)
   :::column-end:::
   :::column span="":::
      ![dots icon](./media/image-templates/dots.png)
   :::column-end:::
   :::column span="":::
      &nbsp;
   :::column-end:::
:::row-end:::
<br>

**Preloaded image icons**

The map preloads a set of icons into the maps image sprite using the `marker`, `pin`, and `pin-round` templates. These icon names and their color values are listed in the following table.

| icon name | color | secondaryColor |
|-----------|-------|----------------|
| `marker-black` | `#231f20` | `#ffffff` |
| `marker-blue` | `#1a73aa` | `#ffffff` |
| `marker-darkblue` | `#003963` | `#ffffff` |
| `marker-red` | `#ef4c4c` | `#ffffff` |
| `marker-yellow` | `#f2c851` | `#ffffff` |
| `pin-blue` | `#2072b8` | `#ffffff` |
| `pin-darkblue` | `#003963` | `#ffffff` |
| `pin-red` | `#ef4c4c` | `#ffffff` |
| `pin-round-blue` | `#2072b8` | `#ffffff` |
| `pin-round-darkblue` | `#003963` | `#ffffff` |
| `pin-round-red` | `#ef4c4c` | `#ffffff` |

## Try it now tool

With the following tool, you can render the different built-in image templates in various ways and customize the primary and secondary colors and scale.

<br/>

<!-----
> [!VIDEO //codepen.io/azuremaps/embed/NQyaaO/?height=500&theme-id=0&default-tab=result]
---->

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [ImageSpriteManager](/javascript/api/azure-maps-control/atlas.imagespritemanager)

> [!div class="nextstepaction"]
> [atlas namespace](/javascript/api/azure-maps-control/atlas#functions)

See the following articles for more code samples where image templates can be used:

> [!div class="nextstepaction"]
> [Add a symbol layer](map-add-pin.md)

> [!div class="nextstepaction"]
> [Add a line layer](map-add-line-layer.md)

> [!div class="nextstepaction"]
> [Add a polygon layer](map-add-shape.md)

> [!div class="nextstepaction"]
> [Add HTML Makers](map-add-bubble-layer.md)

[Azure Maps Samples]: https://samples.azuremaps.com
[Symbol layer with built-in icon template]: https://samples.azuremaps.com/symbol-layer/symbol-layer-with-built-in-icon-template
[Line layer with built-in icon template]: https://samples.azuremaps.com/line-layer/line-layer-with-built-in-icon-template
[Fill polygon with built-in icon template]: https://samples.azuremaps.com/polygons/fill-polygon-with-built-in-icon-template
[HTML Marker with built-in icon template]: https://samples.azuremaps.com/html-markers/html-marker-with-built-in-icon-template
[Add custom icon template to atlas namespace]: https://samples.azuremaps.com/map/add-custom-icon-template-to-atlas-namespace

[Symbol layer with built-in icon template sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Symbol%20Layer/Symbol%20layer%20with%20built-in%20icon%20template/Symbol%20layer%20with%20built-in%20icon%20template.html
[Line layer with built-in icon template sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Line%20Layer/Line%20layer%20with%20built-in%20icon%20template/Line%20layer%20with%20built-in%20icon%20template.html
[Fill polygon with built-in icon template sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Polygons/Fill%20polygon%20with%20built-in%20icon%20template/Fill%20polygon%20with%20built-in%20icon%20template.html
[HTML Marker with built-in icon template sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/HTML%20Markers/HTML%20Marker%20with%20built-in%20icon%20template/HTML%20Marker%20with%20built-in%20icon%20template.html
[Add custom icon template to atlas namespace sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Map/Add%20custom%20icon%20template%20to%20atlas%20namespace/Add%20custom%20icon%20template%20to%20atlas%20namespace.html
