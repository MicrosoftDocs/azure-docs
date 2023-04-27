---
title: Get started with Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: In this article, you'll learn how to use Azure Maps Power BI visual.
author: eriklindeman
ms.author: eriklind
ms.date: 11/29/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Get started with Azure Maps Power BI visual (Preview)

**APPLIES TO:** ![Green check mark.](media/power-bi-visual/yes.png) Power BI service for ***consumers*** ![Green check mark.](media/power-bi-visual/yes.png) Power BI service for designers & developers ![Green check mark.](media/power-bi-visual/yes.png) Power BI Desktop ![X indicating no.](media/power-bi-visual/no.png) Requires Pro or Premium license

This article shows how to use the Microsoft Azure Maps Power BI visual.

> [!NOTE]
> This visual can be created and viewed in both Power BI Desktop and the Power BI service. The steps and illustrations in this article are from Power BI Desktop.

The Azure Maps Power BI visual provides a rich set of data visualizations for spatial data on top of a map. It's estimated that over 80% of business data has a location context. The Azure Maps Power BI visual can be used to gain insights into how this location context relates to and influences your business data.

:::image type="content" source="media/power-bi-visual/azure-maps-visual-hero.png" alt-text="A screenshot of Power BI desktop with the Azure Maps Power BI visual displaying business data." lightbox="media/power-bi-visual/azure-maps-visual-hero.png":::

## What is sent to Azure?

The Azure Maps Power BI visual connects to cloud service hosted in Azure to retrieve location data such as map images and coordinates that are used to create the map visualization.

- Details about the area the map is focused on are sent to Azure to retrieve images needed to render the map canvas (also known as map tiles).
- Data in the Location, Latitude, and Longitude buckets may be sent to Azure to retrieve map coordinates (a process called geocoding).
- Telemetry data may be collected on the health of the visual (for example, crash reports), if the telemetry option in Power BI is enabled.

Other than the scenarios described above, no other data overlaid on the map is sent to the Azure Maps servers. All rendering of data happens locally within the client.

You, or your administrator, may need to update your firewall to allow access to the Azure Maps platform that uses the following URL.

> `https://atlas.microsoft.com`

To learn more, about privacy and terms of use related to the Azure Maps Power BI visual see [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal/).

## Azure Maps Power BI visual behavior and requirements

There are a few considerations and requirements for the Azure Maps Power BI visual:

- The Azure Maps Power BI visual must be enabled in Power BI Desktop. To enable Azure Maps Power BI visual, select **File** &gt; **Options and Settings** &gt; **Options** &gt; **Preview features**, then select the **Azure Maps Visual** checkbox. If the Azure Maps visual isn't available after enabling this setting, it's likely that a tenant admin switch in the Admin Portal needs to be enabled.
- The data set must have fields that contain **latitude** and **longitude** information.

## Use the Azure Maps Power BI visual

Once the Azure Maps Power BI visual is enabled, select the **Azure Maps** icon from the **Visualizations** pane.

:::image type="content" source="media/power-bi-visual/azure-maps-in-visualizations-pane.png" alt-text="A screenshot the Azure Maps visual button on the Visualizations pane in of Power BI.":::

Power BI creates an empty Azure Maps visual design canvas. While in preview, another disclaimer is displayed.

:::image type="content" source="media/power-bi-visual/visual-initial-load.png" alt-text="A screenshot of Power BI desktop with the Azure Maps visual loaded in its initial state." lightbox="media/power-bi-visual/visual-initial-load.png":::

Take the following steps to load the Azure Maps visual:

1. In the **Fields** pane, drag data fields that contain latitude and longitude coordinate information into the **Latitude** and/or **Longitude** buckets. This is the minimal data needed to load the Azure Maps visual.

    :::image type="content" source="media/power-bi-visual/bubble-layer.png" alt-text="A screenshot of the Azure Maps visual displaying points as bubbles on the map after latitude and longitude fields are provided." lightbox="media/power-bi-visual/bubble-layer.png":::

2. To color the data based on categorization, drag a categorical field into the **Legend** bucket of the **Fields** pane. In this example, we're using the **AdminDistrict** column (also known as state or province).  

    :::image type="content" source="media/power-bi-visual/bubble-layer-with-legend-color.png" alt-text="A screenshot of the Azure Maps visual displaying points as colored bubbles on the map after legend field is provided." lightbox="media/power-bi-visual/bubble-layer-with-legend-color.png":::

    > [!NOTE]
    > The built-in legend control for Power BI does not currently appear in this preview.

3. To scale the data relatively, drag a measure into the **Size** bucket of the **Fields** pane. In this example, we're using **Sales** column.  

    :::image type="content" source="media/power-bi-visual/bubble-layer-with-legend-color-and-size.png" alt-text="A screenshot of the Azure Maps visual displaying points as colored and scaled bubbles on the map demonstrating the size field." lightbox="media/power-bi-visual/bubble-layer-with-legend-color-and-size.png":::

4. Use the options in the **Format** pane to customize how data is rendered. The following image is the same map as above, but with the bubble layers fill transparency option set to 50% and the high-contrast outline option enabled.  

    :::image type="content" source="media/power-bi-visual/bubble-layer-styled.png" alt-text="A screenshot of the Azure Maps visual displaying points as bubbles on the map with a custom style." lightbox="media/power-bi-visual/bubble-layer-styled.png":::

5. You can also show or hide labels in the **Format** pane. The following two images show maps with the **Show labels** setting turned on and off:  

    :::image type="content" source="media/power-bi-visual/show-labels-on.png" alt-text="A screenshot of the Azure Maps visual displaying a map with the show labels setting turned on in the style section of the format pane in Power BI." lightbox="media/power-bi-visual/show-labels-on.png":::

    :::image type="content" source="media/power-bi-visual/show-labels-off.png" alt-text="A screenshot of the Azure Maps visual displaying a map with the show labels setting turned off in the style section of the format pane in Power BI." lightbox="media/power-bi-visual/show-labels-off.png":::

## Fields pane buckets

The following data buckets are available in the **Fields** pane of the Azure Maps visual.

| Field     | Description  |
|-----------|--------------|
| Latitude  | The field used to specify the latitude value of the data points. Latitude values should be between -90 and 90 in decimal degrees format.  |
| Longitude | The field used to specify the longitude value of the data points. Longitude values should be between -180 and 180 in decimal degrees format.  |
| Legend    | The field used to categorize the data and assign a unique color for data points in each category. When this bucket is filled, a **Data colors** section will appear in the **Format** pane that allows adjustments to the colors. |
| Size      | The measure used for relative sizing of data points on the map.   |
| Tooltips  | Other data fields to display in tooltips when shapes are hovered. |

## Map settings

The **Map settings** section of the **Format** pane provide options for customizing how the map is displayed and reacts to updates.

The **Map settings** section is divided into three subsections: [style](#style), [view](#view) and [controls](#controls).

### Style

The following settings are available in the **Style** section:

| Setting     | Description  |
|-------------|--------------|
| Style       | The style of the map. The dropdown list contains [greyscale light][gs-light], [greyscale dark][gs-dark], [night][night], [road shaded relief][RSR], [satellite][satellite] and [satellite road labels][satellite RL]. |
| Show labels | A toggle switch that enables you to either show or hide map labels. For more information, see list item number five in the previous section. |

### View

The following settings available in the **View** section enable the user to specify the default map view information when the **Auto zoom** setting is set to **Off**.

| Setting          | Description   |
|------------------|---------------|
| Auto zoom        | Automatically zooms the map into the data loaded through the **Fields** pane of the visual. As the data changes, the map will update its position accordingly. When **Auto zoom** is set to **Off**, the remaining settings in this section become active that enable to user to define the default map view. |
| Zoom             | The default zoom level of the map. Can be a number between 0 and 22. |
| Center latitude  | The default latitude of the center of the map. |
| Center longitude | The default longitude of the center of the map. |
| Heading          | The default orientation of the map in degrees, where 0 is north, 90 is east, 180 is south, and 270 is west. Can be any number between 0 and 360. |
| Pitch            | The default tilt of the map in degrees between 0 and 60, where 0 is looking straight down at the map. |

### Controls

The following settings are available in the **Controls** section:

| Setting      | Description  |
|--------------|--------------|
| World wrap   | Allows the user to pan the map horizontally infinitely. |
| Style picker | Adds a button to the map that allows the report readers to change the style of the map. |
| Navigation   | Adds buttons to the map as another method to allow the report readers to zoom, rotate, and change the pitch of the map. See this document on [Navigating the map](map-accessibility.md#navigating-the-map) for details on all the different ways users can navigate the map. |
| Selection    | Adds a button that allows the user to choose between different modes to select data on the map; circle, rectangle, polygon (lasso), or travel time or distance. To complete drawing a polygon; select the first point, or double-click on the last point on the map, or press the `c` key. |
| Geocoding culture | The default, **Auto**, refers to the Western Address System. The only other option, **JA**, refers to the Japanese address system. In the western address system, you begin with the address details and then proceed to the larger categories such as city, state and postal code. In the Japanese address system, the larger categories are listed first and finish with the address details. |

## Considerations and Limitations

The Azure Maps Power BI visual is available in the following services and applications:

| Service/App                              | Availability |
|------------------------------------------|--------------|
| Power BI Desktop                         | Yes          |
| Power BI service (app.powerbi.com)       | Yes          |
| Power BI mobile applications             | Yes          |
| Power BI publish to web                  | No           |
| Power BI Embedded                        | No           |
| Power BI service embedding (PowerBI.com) | Yes          |

**Where is Azure Maps available?**

At this time, Azure Maps is currently available in all countries and regions except:

- China
- South Korea
- Azure Government (GCC + GCC High)

For coverage details for the different Azure Maps services that power this visual, see the [Geographic coverage information](geographic-coverage.md) document.

**Which web browsers are supported by the Azure Maps Power BI visual?**

See this documentation for information on [Azure Maps Web SDK supported browsers](supported-browsers.md).

**How many data points can I visualize?**

This visual supports up to 30,000 data points.

**Can addresses or other location strings be used in this visual?**

The initial preview of this visual only supports latitude and longitude values in decimal degrees. A future update will add support for addresses and other location strings.

## Next steps

Learn more about the Azure Maps Power BI visual:

> [!div class="nextstepaction"]
> [Understanding layers in the Azure Maps Power BI visual](power-bi-visual-understanding-layers.md)

> [!div class="nextstepaction"]
> [Manage the Azure Maps Power BI visual within your organization](power-bi-visual-manage-access.md)

Customize the visual:

> [!div class="nextstepaction"]
> [Tips and tricks for color formatting in Power BI](/power-bi/visuals/service-tips-and-tricks-for-color-formatting)

> [!div class="nextstepaction"]
> [Customize visualization titles, backgrounds, and legends](/power-bi/visuals/power-bi-visualization-customize-title-background-and-legend)

[gs-light]: supported-map-styles.md#grayscale_light
[gs-dark]: supported-map-styles.md#grayscale_dark
[night]:supported-map-styles.md#night
[RSR]: supported-map-styles.md#road_shaded_relief
[satellite]: supported-map-styles.md#satellite
[satellite RL]: supported-map-styles.md#satellite_road_labels
