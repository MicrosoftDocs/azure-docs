---
title: Provide data feedback to Azure Maps
titleSuffix: Microsoft Azure Maps
description: Provide data feedback using Microsoft Azure Maps feedback tool.
author: eriklindeman
ms.author: eriklind
ms.date: 03/15/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps

ms.custom: mvc
---

# Provide data feedback to Azure Maps

Azure Maps is a set of mapping and geospatial APIs and a Web SDK that enables developers and organizations to build intelligent location-based experiences for applications across many different industries and use cases. While Azure Maps continually updates its underlying map data to ensure the most current and accurate map content possible, the Azure Maps feedback tool is a useful resource for customers to report issues with the map data. The feedback tool empowers both Azure Maps and Bing Maps customers to communicate map data corrections to Microsoft. All suggested map data corrections submitted via the feedback tool are carefully evaluated and promptly addressed.

## How to access the feedback tool

There are three ways to access the feedback tool.

- **Azure Maps Account**. You can access the feedback tool in your **Azure Maps Account** from a link in the **Provide Map Data Feedback** tab of the **Overview** section.

    :::image type="content" source="./media/how-to-use-feedback-tool/provide-map-data-feedback-link.png"  lightbox="./media/how-to-use-feedback-tool/provide-map-data-feedback-link.png" alt-text="A screenshot showing the 'Provide Map Data Feedback' link in the overview section of an Azure Maps Account.":::

- **Web SDK map control**. You can access the feedback tool from a link in the lower right-hand side of the map.

    :::image type="content" source="./media/how-to-use-feedback-tool/web-sdk-map-control.png"  lightbox="./media/how-to-use-feedback-tool/web-sdk-map-control.png" alt-text="A screenshot showing the link to the Azure Maps feedback tool from an Azure Maps map created using the Web SDK map control.":::

- **URL**. You can access the feedback tool directly from the [Azure Maps feedback tool] URL.

## Providing feedback

You can provide feedback on any issue you find in an Azure Maps map using the feedback tool. The following example demonstrates how to provide feedback when you encounter a road recently changed to become a two-way road.

1. Navigate to the [Azure Maps feedback tool].
1. Zoom in to the problem area on the map.

    :::image type="content" source="./media/how-to-use-feedback-tool/zoom-in-problem-area.png" lightbox="./media/how-to-use-feedback-tool/zoom-in-problem-area.png" alt-text="A screenshot showing the Azure Maps feedback tool.":::

1. Select **The map** in the **Select the problem area** drop-down list.

    :::image type="content" source="./media/how-to-use-feedback-tool/select-problem-area.png" alt-text="A screenshot showing the items in the select the problem area drop-down list, with The map highlighted.":::

1. Select **Roads** in the **Give us a little more information** drop-down list.

    :::image type="content" source="./media/how-to-use-feedback-tool/give-us-a-little-more-information.png" alt-text="A screenshot showing the items in the Give us a little more information drop-down list, with roads highlighted.":::

1. Select **Road should be two way** in the **Tell us the specific issue** drop-down list.

1. A pushpin appears with the message **Drag the pushpin to the location of the issue on the map**. Move the pushpin to the desired location.

    :::image type="content" source="./media/how-to-use-feedback-tool/drag-pushpin.png" lightbox="./media/how-to-use-feedback-tool/drag-pushpin.png" alt-text="A screenshot showing the Drag the pushpin on the map to the correct location view.":::

1. Enter relevant details about the issue in the **Tell us more about the problem** text box.

    :::image type="content" source="./media/how-to-use-feedback-tool/tell-us-more-about the-problem.png" lightbox="./media/how-to-use-feedback-tool/tell-us-more-about the-problem.png" alt-text="A screenshot showing a fictional explanation in the Tell us more about the problem text box.":::

### Using the search bar

If the map doesn't appear in the desired location when bringing up the feedback tool, you can pan the map to the desired location using your mouse. Another option is to use the search bar, just type in the desired location and select search icon :::image type="icon" source="./media/how-to-use-feedback-tool/search.png"::: or press the **Enter** key. Once done, select the **`X`** in the upper right-hand side of the search results view to return to the feedback tool.

:::image type="content" source="./media/how-to-use-feedback-tool/search-bar.png" lightbox="./media/how-to-use-feedback-tool/search-bar.png" alt-text="A screenshot showing Bing Maps search bar.":::

## Next steps

For any technical questions related to Azure Maps, see [Microsoft Q & A].

[Azure Maps feedback tool]: https://www.bing.com/maps?feedbacktype=AzureMaps&feedbackep=UrlAzureMapsMSDoc&v=2&sV=1
[Microsoft Q & A]: /answers/topics/azure-maps.html
