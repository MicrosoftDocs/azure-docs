---
title: Get started with Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps
description: This article discusses how to use Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 09/29/2023
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Get started with Azure Maps Power BI visual

This article shows how to use the Microsoft Azure Maps Power BI visual.

**APPLIES TO:** ![Green check mark.](media/power-bi-visual/yes.png) Power BI service for ***consumers*** ![Green check mark.](media/power-bi-visual/yes.png) Power BI service for designers & developers ![Green check mark.](media/power-bi-visual/yes.png) Power BI Desktop ![X indicating no.](media/power-bi-visual/no.png) Requires Pro or Premium license

> [!NOTE]
> This visual can be created and viewed in both Power BI Desktop and the Power BI service. The steps and illustrations in this article are based on Power BI Desktop.

The Azure Maps Power BI visual offers a comprehensive range of data visualizations for spatial data on maps. With over 80% of business data having a location context, this visual helps you understand how location influences your business data.

:::image type="content" source="media/power-bi-visual/azure-maps-visual-hero.png" alt-text="A screenshot of Power BI desktop with the Azure Maps Power BI visual displaying business data." lightbox="media/power-bi-visual/azure-maps-visual-hero.png":::

> [!NOTE]
> Power BI ensures that no Personal Identifiable Information (PII) is sent to Azure Maps. Additionally, IP addresses are truncated in the Power BI diagnostic logs.

## What is sent to Azure?

The Azure Maps Power BI visual connects to a cloud service hosted in Azure to retrieve location data, such as map images and coordinates, for map visualization.

- Details about the focused area are sent to Azure to retrieve images needed for rendering the map canvas (also known as map tiles).
- Data in the Location, Latitude, and Longitude fields may be sent to Azure for geocoding, to retrieve map coordinates.
- Telemetry data, such as crash reports, may be collected on the health of the visual if the telemetry option in Power BI is enabled.

Apart from the scenarios previously described, no other data overlaid on the map is sent to the Azure Maps servers. All data rendering happens locally on the client.
> [!TIP]
> If you use the Azure Maps [Geographic API endpoints], your firewall may need to be updated to allow access to the Azure Maps platform through any or all of the following URLs:
>
> - `https://atlas.microsoft.com`
> - `https://us.atlas.microsoft.com`
> - `https://eu.atlas.microsoft.com`

> [!IMPORTANT]
> The selection tool within the Azure Maps Power BI visual relies on TomTom data, consequently user data may not always remain within the user’s geographical boundary.

For more information about privacy and terms of use related to the Azure Maps Power BI visual, see [Microsoft Azure Legal Information].

## Use the Azure Maps Power BI visual
<!----------------------------------------------------------------
Before you can use the Azure Maps visual in Power BI, you must select the **Use Azure Maps Visual** security option. To do this in Power BI desktop select **File** &gt; **Options and Settings** &gt; **Options** &gt; **Security**, then select the **Use Azure Maps Visual** checkbox.

:::image type="content" source="media/power-bi-visual/security-setting.png" alt-text="A screenshot of Use Azure Maps Visual checkbox in Power BI Security options page.":::
---------------------------------------------------------------->
After enabling the Azure Maps Power BI visual, select the **Azure Maps** icon from the **Visualizations** pane.

:::image type="content" source="media/power-bi-visual/azure-maps-in-visualizations-pane.png" alt-text="A screenshot of the Azure Maps visual button on the Visualizations pane in of Power BI.":::

Power BI creates an empty Azure Maps visual design canvas.

:::image type="content" source="media/power-bi-visual/visual-initial-load.png" alt-text="A screenshot of Power BI desktop with the Azure Maps visual loaded in its initial state." lightbox="media/power-bi-visual/visual-initial-load.png":::

1. To load the Azure Maps visual, you can either:
    1. Drag data fields with latitude and longitude coordinates into the **Latitude** and/or **Longitude** fields.
    1. Drag data fields with geospatial data into the **Location** field.

    :::image type="content" source="media/power-bi-visual/bubble-layer.png" alt-text="A screenshot of the Azure Maps visual displaying points as bubbles on the map after latitude and longitude fields are provided." lightbox="media/power-bi-visual/bubble-layer.png":::
1. To color the data based on categories, drag a categorical field into the **Legend** bucket of the **Fields** pane. In this example, we're using the **City** column.  

    :::image type="content" source="media/power-bi-visual/bubble-layer-with-legend-color.png" alt-text="A screenshot of the Azure Maps visual displaying points as colored bubbles on the map after legend field is provided." lightbox="media/power-bi-visual/bubble-layer-with-legend-color.png":::

1. To scale the data relatively, drag a measure into the **Size** bucket of the **Fields** pane. In this example, we're using **Avg Weekly Sales** column.  

    :::image type="content" source="media/power-bi-visual/bubble-layer-with-legend-color-and-size.png" alt-text="A screenshot of the Azure Maps visual displaying points as colored and scaled bubbles on the map that demonstrate the size field." lightbox="media/power-bi-visual/bubble-layer-with-legend-color-and-size.png":::

1. Use the options in the Format pane to customize data rendering. The following image shows the same map as before, but with bubble layers' fill transparency set to 25%, a smaller radius, and a black border.

    :::image type="content" source="media/power-bi-visual/bubble-layer-styled.png" alt-text="A screenshot of the Azure Maps visual displaying points as bubbles on the map with a custom style." lightbox="media/power-bi-visual/bubble-layer-styled.png":::

1. You can also show or hide labels in the **Format** pane. The following two images show maps with the **Show labels** setting turned on and off:  

    :::image type="content" source="media/power-bi-visual/show-labels-on.png" alt-text="A screenshot of the Azure Maps visual displaying a map with the show labels setting turned on in the style section of the format pane in Power BI." lightbox="media/power-bi-visual/show-labels-on.png":::

    :::image type="content" source="media/power-bi-visual/show-labels-off.png" alt-text="A screenshot of the Azure Maps visual displaying a map with the show labels setting turned off in the style section of the format pane in Power BI." lightbox="media/power-bi-visual/show-labels-off.png":::

## Fields pane buckets

The following data buckets are available in the **Fields** pane of the Azure Maps visual.

| Field     | Description  |
|-----------|--------------|
| Location  | Used to enter easily understandable geographical data such as country/region, state, and city.  |
| Latitude  | The field used to specify the latitude value of the data points. Latitude values should range between -90 and 90 in decimal degrees.  |
| Longitude | The field used to specify the longitude value of the data points. Longitude values should range between -180 and 180 in decimal degrees.  |
| Legend    | The field used to categorize the data and assign a unique color to each category's data points. When this bucket is filled, a **Data colors** section appears in the **Format** pane that allows adjustments to the colors. |
| Size      | The measure used for relative sizing of data points on the map.   |
| Tooltips  | Additional data fields to display in tooltips when shapes are hovered over. |

## Map settings

The **Map settings** section of the **Format** pane offers options for customizing how the map is displayed and reacts to updates.

The **Map settings** section is divided into three subsections: [style], [view] and [controls].

### Style

The following settings are available in the **Style** section:

| Setting     | Description  |
|-------------|--------------|
| Style       | The style of the map. The dropdown list contains [blank and blank accessible], [grayscale dark], [grayscale light], [high contrast dark], [high contrast light], [night], [road], [road shaded relief], [satellite] and [satellite road labels]. |
| Show labels | A toggle switch that enables you to either show or hide map labels. For more information, see list item number five in the previous section. |

### View

The following settings available in the **View** section enable the user to specify the default map view information when the **Auto zoom** setting is set to **Off**.

| Setting          | Description   |
|------------------|---------------|
| Auto zoom        | Automatically zooms the map into the data loaded through the **Fields** pane of the visual. As the data changes, the map updates its position accordingly. When **Auto zoom** is set to **Off**, the remaining settings in this section become active that enable to user to define the default map view. |
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
| Navigation   | Adds buttons to the map as another method to allow the report readers to zoom, rotate, and change the pitch of the map. See this document on [Navigating the map] for details on all the different ways users can navigate the map. |
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
| Power BI Embedded                        | Yes          |
| Power BI service embedding (PowerBI.com) | Yes          |

**Where is Azure Maps available?**

At this time, Azure Maps is currently available in all countries and regions except:

- China
- South Korea
- Azure Government (GCC + GCC High)

For coverage details for the different Azure Maps services that power this visual, see [Geographic coverage information].

**Which web browsers are supported by the Azure Maps Power BI visual?**

For a list of supported browsers, see [Azure Maps Web SDK supported browsers].

**How many data points can I visualize?**

This visual supports up to 30,000 data points.

**Can addresses or other location strings be used in this visual?**

Yes, addresses and other location strings can be used in the Azure Maps Power BI visual. For more information on addresses and other location strings, see [The location field] in the *Geocoding in Azure Maps Power BI Visual* article.

## Next steps

Learn more about the Azure Maps Power BI visual:

> [!div class="nextstepaction"]
> [Understanding layers in the Azure Maps Power BI visual]

> [!div class="nextstepaction"]
> [Manage the Azure Maps Power BI visual within your organization]

Customize the visual:

> [!div class="nextstepaction"]
> [Tips and tricks for color formatting in Power BI]

> [!div class="nextstepaction"]
> [Customize visualization titles, backgrounds, and legends]

[Geographic API endpoints]: geographic-scope.md#geographic-api-endpoint-mapping
[Azure Maps Web SDK supported browsers]: supported-browsers.md
[controls]: #controls
[Customize visualization titles, backgrounds, and legends]: /power-bi/visuals/power-bi-visualization-customize-title-background-and-legend
[Geographic coverage information]: geographic-coverage.md
[style]: #style
<!-------  Styles   ----------------------------------------->
[blank and blank accessible]: supported-map-styles.md#blank-and-blank_accessible
[grayscale dark]: supported-map-styles.md#grayscale_dark
[grayscale light]: supported-map-styles.md#grayscale_light
[high contrast dark]: supported-map-styles.md#high_contrast_dark
[high contrast light]: supported-map-styles.md#high_contrast_light
[night]: supported-map-styles.md#night
[road]: supported-map-styles.md#road
[road shaded relief]: supported-map-styles.md#road_shaded_relief
[satellite]: supported-map-styles.md#satellite
[satellite road labels]: supported-map-styles.md#satellite_road_labels

[Manage the Azure Maps Power BI visual within your organization]: power-bi-visual-manage-access.md
[Microsoft Azure Legal Information]: https://azure.microsoft.com/support/legal/
[Navigating the map]: map-accessibility.md#navigating-the-map
[Tips and tricks for color formatting in Power BI]: /power-bi/visuals/service-tips-and-tricks-for-color-formatting
[Understanding layers in the Azure Maps Power BI visual]: power-bi-visual-understanding-layers.md
[view]: #view
[The location field]: power-bi-visual-geocode.md#the-location-field
