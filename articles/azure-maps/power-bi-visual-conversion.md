---
title: Convert Map and Filled map visuals to an Azure Maps visual 
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article covers how to convert Map and Filled map visuals to an Azure Maps visual.
author: deniseatmicrosoft
ms.author: limingchen 
ms.date: 01/23/2025
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Convert Map and Filled map visuals to an Azure Maps visual

The Azure Maps visual is now Generally Available, providing a streamlined and intuitive experience for working with your data.

> [!IMPORTANT]
> The **Bing Maps** visual is scheduled for deprecation, although the timeline hasn't yet been determined. Any Bing Maps visuals that are already included in your reports remain available.
>
> To ensure a smooth transition, upgrade to Azure Maps unless one of the following applies:
>
> * You have team members who need to access the report in China, Korea, or within government cloud environments.
> * You're physically located in China or Korea, regardless of your home tenant's location.
> * You're part of a government cloud, irrespective of your home tenant's location.
>
> We're actively working to expand Azure Maps support to currently unsupported regions. **If you and all report users are located within a supported region, we encourage you to begin using Azure Maps now**. This article provides guidance on how to transition to Azure Maps. For a list of supported regions, see [Azure Maps service geographic scope](geographic-scope.md).

## How to convert your existing Map and Filled map visuals

A conversion function is available in Power BI desktop to convert any existing Map and Filled map visuals to the new Azure Maps visual.

When opening a report with Map and Filled map visuals, you see the following dialog giving you the option to upgrade to the new Azure Maps visual:

:::image type="content" source="media/power-bi-visual/introducing-azure-map-visual.png" alt-text="Screenshot showing the option to upgrade maps to the Azure Maps visual.":::

When selecting the **Upgrade maps** button, all Map and Filled map visuals in the current report are converted. You can also convert a specific Map or Filled Map Visual to an Azure Maps visual in the Visual gallery.

All settings associated with the original visuals are carried over to the new Azure Maps visual, ensuring consistency in the migrated report.

:::image type="content" source="media/power-bi-visual/new-azure-maps-visual.gif" alt-text="Screenshot showing the Bubble chart Description automatically generated.":::

> [!NOTE]
> Due to differences in supported bubble size ranges between the two platforms, you may notice that some bubbles appear smaller on the converted Azure Maps visual compared to their original size in the Maps visual. This is because the maximum bubble size in Azure Maps is smaller than the maximum bubble size in Bing Maps. Bubble size differences can vary based on the visual dimension and the report's zoom level.

The migration function streamlines the process of converting Map and Filled map visuals to Azure Maps visuals, providing users with an efficient and easy-to-use solution.

## Next steps

> [!div class="nextstepaction"]
> [Get started with Azure Maps Power BI visual](power-bi-visual-get-started.md)
