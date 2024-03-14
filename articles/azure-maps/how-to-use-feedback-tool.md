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

Available since 2018, Azure Maps has been providing fresh map data, easy-to-use REST APIs, and powerful SDKs to support enterprise customers with various business use cases. The real world is constantly changing, and it’s crucial to have factual digital representations. The Azure Maps feedback tool exists to empower customers of both Bing and Azure Maps to communicate issues, which are shared with our data providers and their map editors. They can quickly evaluate and incorporate feedback into our mapping products.  

## Providing feedback

You can provide feedback on any issue you find in an Azure Maps map using the feedback tool. The following example demonstrates how to provide feedback when you encounter a road recently changed to become a two-way road.

1. Navigate to the [Azure Maps feedback tool]. You can access the feedback tool in your **Azure Maps Account** from a link in the **Provide Map Data Feedback** tab of the **Overview** section.

    :::image type="content" source="./media/how-to-use-feedback-tool/provide-map-data-feedback-link.png"  lightbox="./media/how-to-use-feedback-tool/provide-map-data-feedback-link.png" alt-text="A screenshot showing the Provide Map Data Feedback link in the overview setion of an Azure Maps Account.":::

1. Zoom in to the problem area on the map.

    :::image type="content" source="./media/how-to-use-feedback-tool/zoom-in-problem-area.png" lightbox="./media/how-to-use-feedback-tool/zoom-in-problem-area.png" alt-text="A screenshot showing the Azure Maps feedback tool.":::

1. Select **The map** in the **Select the problem area** drop-down list.

    :::image type="content" source="./media/how-to-use-feedback-tool/select-problem-area.png" alt-text="A screenshot showing the items in the select the problem area drop-down list, with The map highlighted.":::

1. Select **Roads** in the **Give us a little more information** drop-down list.

    :::image type="content" source="./media/how-to-use-feedback-tool/give-us-a-little-more-information.png" alt-text="A screenshot showing the items in the Give us a little more information drop-down list, with roads highlighted.":::

1. Select **Road should be two way** in the **Tell us the specific issue** drop-down list.
1. Enter relevant details about the issue in the **Tell us more about the problem** text box.

    :::image type="content" source="./media/how-to-use-feedback-tool/tell-us-more-about the-problem.png" lightbox="./media/how-to-use-feedback-tool/tell-us-more-about the-problem.png" alt-text="A screenshot showing a fictional explanation in the Tell us more about the problem text box.":::

## Next steps

For any technical questions related to Azure Maps, see [Microsoft Q & A].

[Azure Maps feedback tool]: https://www.bing.com/maps?feedbacktype=AzureMaps&feedbackep=UrlAzureMapsMSDoc&v=2&sV=1
[Microsoft Q & A]: /answers/topics/azure-maps.html
