---
title: Add a marker layer to an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: In this article, you learn how to use the marker layer in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 01/07/2026
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Add a marker layer

The **Marker layer** in the Azure Maps visual enables the display of predefined markers or custom icons as points on the map at the specified locations.

:::image type="content" source="./media/power-bi-visual/marker-layer-no-legend.png" lightbox="./media/power-bi-visual/marker-layer-no-legend.png" alt-text="Screenshot of a map displaying default markers using the marker layer, all markers are blue.":::

This article describes how to add and configure a marker layer to an Azure Maps Power BI visual.

## Prerequisites

- [Get started with Azure Maps Power BI visual].
- Understanding of [Layers in the Azure Maps Power BI visual].

## Add the marker layer

The Marker layer in the Azure Maps visual allows you to plot individual locations as points on the map, using either simple circle markers or custom icon imagery.

1. Add the Azure Maps visual to the report canvas.

   :::image type="content" source="./media/power-bi-visual/marker-layer/azure-maps-in-visualizations-pane.png" alt-text="Screenshot showing the visualizations option in Power BI with the Azure Maps icon highlighted.":::

1. Drag your location data from the **Data** pane into **Latitude**/**Longitude** or **Location** fields in the **Build visual** tab of the **Visualizations** pane.

   :::image type="content" source="./media/power-bi-visual/marker-layer/add-data.png" alt-text="Screenshot showing an example of how to add data from the data pane to the location field in the visualization pane.":::

1. In the **Format visual** tab of the **Visualizations** pane, toggle the **Marker layer** to **On**.

   :::image type="content" source="./media/power-bi-visual/marker-layer/marker-layer-toggle.png" alt-text="Screenshot showing marker layer toggle switch in the visualization pane.":::

1. (Optional) Add a field to Legend to categorize markers and to Size to scale markers by a measure.
1. Use the Marker type, Size, Color, and Border settings in the Marker  section to adjust the appearance of your markers. For information on **Marker** settings, see [Marker style customization](#marker-style-customization).

## Marker types

The **Marker type** settings determine how locations are represented within the marker layer of the Azure Maps visual. Two marker types are available: **Icon** and **Image**. Icon markers use a predefined set of built‑in icons, while image markers allow you to specify a custom SVG image sourced from a valid image URL, or [pasted SVG content](#create-image-by-pasting-svg-content). By default, all locations are displayed as circular icon markers, but you can switch to any available icon or replace the default icon with a custom image as needed.

:::image type="content" source="./media/power-bi-visual/marker-layer/marker-type.png" alt-text="A screenshot of the Power BI Format visual pane showing the Markers section expanded with a Shape subsection displaying a Marker type dropdown menu with two options: Icon (currently selected) and Image.":::

### Change icon

To switch to another built‑in icon:

1. In the **Format visual** tab of the **Visualizations** pane, select **> Markers**.
1. In the Markers section, select **> Shape**.
1. In the Shape section, select **Icon**.

The available icons will appear.

:::image type="content" source="./media/power-bi-visual/marker-layer/marker-icon.png" alt-text="Screenshot showing available marker icons in the visualization pane.":::

### Change image

To use an image as a marker, you can add a link to any valid Scalable Vector Graphics (SVG) file. SVG is a web‑friendly vector format that uses mathematical shapes—points, lines, and curves—instead of pixels like JPEG and PNG files. Because vectors scale without losing clarity, SVGs are an excellent choice for map markers.

You can either [Enter a single image for all markers](#single-image-for-all-markers) or [Bind an image per row by using conditional formatting](#using-conditional-formatting).

#### Single image for all markers

To enter a single image for all markers:

1. In the **Format visual** tab of the **Visualizations** pane, select **> Markers**.
1. In the Markers section, select **> Shape**.
1. In the Shape section, select **Marker type**.
1. In the **Marker type** drop-down list, select **Image**.
1. Enter the URL to the .svg file.

#### Using conditional formatting

Select the fx (conditional formatting) button and choose the field that contains the image URL, data URI, or SVG for each data point.

To bind an image per row by using conditional formatting:

1. In the **Format visual** tab of the **Visualizations** pane, select **> Markers**.
1. In the Markers section, select **> Shape**.
1. In the Shape section, select **Marker type**.
1. In the **Marker type** drop-down list, select **Image**.
1. Select the fx (conditional formatting) button and choose the field that contains the image URL, data URI, or SVG for each data point.

#### Create image by pasting SVG content

You can also paste the contents of the svg file directly into the **Enter a URL** textbox:

1. In the **Format visual** tab of the **Visualizations** pane, select **> Markers**.
1. In the Markers section, select **> Shape**.
1. In the Shape section, select **Marker type**.
1. In the **Marker type** drop-down list, select **Image**.
1. Copy/Paste the contents of the svg file directly into the **Enter a URL** textbox.
1. (Optional) As an example, you can copy/paste the following svg into your **Enter a URL** textbox:

    ```xml
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>9GAG</title><path d="m17.279 21.008 5.193-2.995V5.992l-5.193-2.996C14.423 1.348 12.048 0 12 0c-.048 0-2.423 1.348-5.279 2.996L1.528 5.992v2.354l5.193 2.996c2.856 1.648 5.232 2.996 5.28 2.996.048 0 1.469-.797 3.157-1.772a229.633 229.633 0 0 1 3.097-1.772c.016 0 .027 1.096.027 2.437l-.002 2.436-3.076 1.772c-1.692.975-3.115 1.783-3.163 1.795-.048.013-1.471-.776-3.162-1.752-1.69-.976-3.113-1.775-3.161-1.775-.155 0-4.036 2.274-4.011 2.35.031.093 10.136 5.937 10.276 5.943.057.002 2.44-1.344 5.296-2.992ZM9.847 8.391c-1.118-.65-2.033-1.2-2.033-1.222 0-.071 4.06-2.376 4.186-2.376.125 0 4.186 2.305 4.186 2.376 0 .063-4.047 2.375-4.184 2.39-.068.007-1.037-.519-2.155-1.168Z"/></svg>
    ```

## Marker layer settings

The **Marker Layer** settings in the Azure Maps visual let you fine‑tune layer‑level behavior, including zoom‑level visibility and marker options such as pitch and rotation alignment, as well as the layer's position relative to other map layers. This section provides tables for each setting with detailed information about every available property. For information on **Marker** settings, see [Marker style customization](#marker-style-customization) in the next section.

:::image type="content" source="./media/power-bi-visual/marker-layer/marker-layer-settings.png" alt-text="A screenshot of the Power BI Format visual pane displaying the Marker layer section with three expandable subsections: Zoom settings showing Maximum value of 22 and Minimum value of 0, Options settings displaying dropdown menus for Pitch alignment set to Viewport, Rotation alignment set to Viewport, and Layer position set to Below labels, and a collapsed Markers section at the bottom.":::

### Zoom

| Setting  | Description                                             |
|----------|---------------------------------------------------------|
| Maximum  |  Markers are visible up to the specified maximum zoom level; when the map is zoomed in past this threshold, the marker layer will no longer be displayed. <br><br>**Valid values**: 0-22<br>**Default**: 22 |
| Minimum  | Markers remain visible until the map is zoomed out beyond the specified minimum zoom level. Once the map exceeds that threshold, the marker layer is automatically hidden. Use this setting to prevent markers from appearing when the map is viewed from a very distant zoom level. <br><br>**Valid values**: 0-22<br>**Default**: 0 |

### Options

| Setting             | Description                                 |
|---------------------|---------------------------------------------|
| Pitch alignment     | Controls how markers behave when the map is tilted:<br><ul> <li>**Align to viewport:** Markers remain upright relative to the screen, even when the map is tilted.</li> <li>**Align to map:** Markers tilt together with the map, matching its orientation.</li></ul> <br>**Default**:Viewport<br><br>**Tip:** Use *Align to viewport* to keep icons readable when users pitch the map. |
| Rotation alignment  | Controls how markers behave when the map is rotated: <br><br><ul><li>**Align to viewport**: Markers maintain their upright orientation relative to the screen, regardless of the map's rotation.</li><li>**Align to map**: Markers rotate together with the map, preserving their orientation relative to the underlying geography.</li></ul><br>**Default**:Viewport<br><br>**Tip:** Use *Align to viewport* if you want icons to always face *up* on the screen. |
| Layer position      | Specifies where this layer appears in the map's drawing order:<br><ul><li>**Above labels:** Renders the layer on top of all map labels.</li><li>**Below labels:** Places the layer beneath map labels but above roads.</li><li>**Below roads:** Positions the layer underneath both roads and labels.</li></ul><br>**Default**: Below labels<br><br>For more information, see [Layer positions](power-bi-visual-understanding-layers.md#layer-positions).  |

## Marker style customization

The **Markers** settings in the Azure Maps visual control how markers appear on the map. Available in the **Format visual** pane, these options let you customize marker shape, size, borders, legends, and category labels to improve readability and presentation.

### Apply settings to

The **Apply settings to** setting controls which markers the style settings apply to. Selecting **All** updates every marker in the layer. If a **Legend** field is configured, you can select a legend category to apply or override settings for that series only. If no legend is present, individual data points (such as each coordinate pair) are listed instead. This option is available when the **Marker layer** is *enabled*.

:::image type="content" source="./media/power-bi-visual/marker-layer/apply-settings-to.png" lightbox="./media/power-bi-visual/marker-layer/apply-settings-to.png" alt-text="Screenshot of the Apply settings to section in the Power BI Format visual pane, showing a Categories dropdown menu with the text 7 Victoria St W... displayed, indicating that marker style settings can be applied to specific legend categories or individual data points.":::

### Shape

The **Shape** section in the Marker layer defines how markers are sized, scaled, and oriented on the map. These properties control both static and data‑driven behavior, allowing you to adjust marker size and scale, set minimum and maximum values, apply range‑based scaling, and specify rotation. The table below describes each shape property and explains how it affects marker appearance in the Azure Maps visual.

| Setting            | Description                       |
|--------------------|-----------------------------------|
| Size               | Controls the size of each marker. This setting applies a fixed size to all selected markers. If a field is assigned to the Size bucket, marker size is determined by that field and this setting is hidden.<br/><br/>**Default**: 8 px |
| Scale              | Controls the scale of the image marker relative to its original size. This setting is hidden when a field is assigned to the **Size** bucket.   |
| Minimum / Maximum  | Defines the lower and upper bounds for marker size when a field is assigned to the **Size** bucket. These values control how small or large markers can appear relative to one another. This setting is available only when size is data‑driven. When no field is assigned, marker size is controlled by a single Scale slider instead.   |
| Rotation           | Specifies the rotation angle of markers in degrees. The default value is 0°, which displays markers with no rotation. The **Conditional formatting** button is hidden when no field is assigned to the **Legend** bucket.<br/><br/>**Default**: 0° |
| Range scaling      | Defines how image marker size is scaled when size is driven by a field. This setting is visible only when a field is assigned to the **Size** bucket and the **Marker type** is set to **Icon**.<br><ul><li>**Magnitude**: Marker size scales by value magnitude. Negative values are automatically converted to positive values.</li><li>**DataRange**: Marker size scales from the minimum to the maximum data value, with no anchoring to zero.</li><li>**Automatic**: Marker size scales automatically using one of the following methods:<ul><li>**Magnitude**: For data containing only positive or only negative values.</li><li>**DataRange**: For data containing both positive and negative values.</li></ul></li></ul> |
| Minimum            | Sets the minimum image size used for data‑driven scaling. Available only when a field is assigned to the **Size** bucket.<br/><br/>**Default**: 8 px |
| Maximum            | Sets the minimum image size used for data‑driven scaling. Available only when a field is assigned to the **Size** bucket.<br/><br/>**Default**: 40 px |

:::image type="content" source="./media/power-bi-visual/marker-layer/size.png" lightbox="./media/power-bi-visual/marker-layer/size.png" alt-text="A screenshot of a map section showing three triangular warning markers with green fill colors and yellow-gold borders demonstrating the border styling options available for icon markers in the Azure Maps Power BI visual.":::

### Color

The **Color** section is enabled only when **Icon** is selected as the **Marker type**. It allows you to set the icon's fill color and transparency.

| Setting       | Description  |
|---------------|--------------|
| Color         | Specifies the fill color of the image. The **Conditional formatting** button becomes available when a field is added to the **Legend** bucket. |
| Transparency  | Controls the transparency of the image's fill color (0% = fully opaque, 100% = no fill color).<br><br>**Default**: 0% |

:::image type="content" source="./media/power-bi-visual/marker-layer/color.png" lightbox="./media/power-bi-visual/marker-layer/color.png" alt-text="A screenshot showing the marker color settings in the Azure Maps Power BI visual.":::

### Border

The **Border** section in the Marker layer, enabled only when the **Marker type** is set to **Icon**, defines the appearance of marker outlines on the map. These properties let you adjust border visibility and styling by enabling high‑contrast outlines, matching the border to the fill color, or customizing the border color, transparency, and width. The table below describes each border property and explains how it affects marker display in the Azure Maps visual.

| Setting           | Description                         |
|-------------------|-------------------------------------|
| High contrast     | Makes the image border color automatically contrast with the fill color, improving visibility for users with low vision or in high‑contrast viewing conditions.<br/>**Default**: off  |
| Match fill color  | Makes the border the same color as the image fill so they blend together.<br/>**Default**: off |
| Color             | Sets the stroke color of the image border. |
| Transparency      | Defines the opacity level of the image's border stroke, from fully opaque to fully transparent.<br/>**Default**: 0% |
| Width             | Sets the stroke width of the image border.<br/>**Default**: 2 px |

#### Border settings

:::image type="content" source="./media/power-bi-visual/marker-layer/border.png" lightbox="./media/power-bi-visual/marker-layer/border.png" alt-text="A screenshot showing the marker border settings in the Azure Maps Power BI visual.":::

#### Rotation settings

:::image type="content" source="./media/power-bi-visual/marker-layer/rotation.png" lightbox="./media/power-bi-visual/marker-layer/rotation.png" alt-text="A screenshot showing the marker rotation settings in the Azure Maps Power BI visual.":::

### Legend

By default, all markers use the same fill color. When a field is assigned to the Legend bucket and Marker type is set to Icon, markers are colored based on their legend values.

:::image type="content" source="./media/power-bi-visual/marker-layer/legend.png" lightbox="./media/power-bi-visual/marker-layer/legend.png" alt-text="A screenshot showing the marker legend settings in the Azure Maps Power BI visual.":::

### Category labels

When the **Marker** layer is visible on the map, **Category Labels** settings appear in the **Format visual** pane. These settings let you customize the font, size, and color of category labels, as well as their background color and transparency.

:::image type="content" source="./media/power-bi-visual/marker-layer/category-labels.png" lightbox="./media/power-bi-visual/marker-layer/category-labels.png" alt-text="A screenshot showing the marker Category labels settings in the Azure Maps Power BI visual.":::

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a cluster bubble layer](power-bi-visual-cluster-bubbles.md)

> [!div class="nextstepaction"]
> [Add a 3D column layer](power-bi-visual-add-3d-column-layer.md)

Add more context to the map:

> [!div class="nextstepaction"]
> [Add a reference layer](power-bi-visual-add-reference-layer.md)

> [!div class="nextstepaction"]
> [Add a tile layer](power-bi-visual-add-tile-layer.md)

Customize the visual:

> [!div class="nextstepaction"]
> [Tips and tricks for color formatting in Power BI](/power-bi/visuals/service-tips-and-tricks-for-color-formatting)

> [!div class="nextstepaction"]
> [Customize visualization titles, backgrounds, and legends](/power-bi/visuals/power-bi-visualization-customize-title-background-and-legend)

[Get started with Azure Maps Power BI visual]: power-bi-visual-get-started.md
[Layers in the Azure Maps Power BI visual]: power-bi-visual-understanding-layers.md
