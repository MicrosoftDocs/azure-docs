---
title: Convert Map and Filled Map Visuals to Azure Maps Visuals
titleSuffix: Microsoft Azure Maps Power BI visual
description: In this article, you will learn how to convert Map and Filled Map Visuals to an Azure Maps Visual.
author: deniseatmicrosoft
ms.author: limingchen 
ms.date: 05/23/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Convert Map and Filled Map Visuals to Azure Maps Visuals

The Azure Maps Visual is now Generally Available, providing a streamlined and intuitive experience working with your data.

## How to convert your existing Map and Filled Map Visuals

A conversion function is available in Power BI desktop to convert existing Map and Filled Map Visuals to the new Azure Maps Visual.

When opening any report with Map or Filled Map Visuals, you will see the following dialog giving you the option to upgrade to the new Azure Maps Visual:

:::image type="content" source="media/power-bi-visual/introducing-azure-map-visual.png" alt-text="Screenshot showing the option to upgrade maps to the Azure Maps Visual.":::

Please note:

- You can convert all Map and Filled Map Visuals in the current
    report at once by selecting the "Upgrade maps" button.

- You can also select and convert specific Map and Filled Map
    Visuals to Azure Maps Visuals using the Visual gallery.

- All settings associated with the original Map and Filled Map Visuals
    will be carried over to the new Azure Maps Visual, ensuring
    consistency in the migrated report.

![Bubble chart Description automatically
generated](./media/image2.png){width="5.718188976377952in"
height="3.3224146981627296in"}

- The migration function streamlines the process of converting Map and
    Filled Map Visuals to Azure Maps Visuals, providing users with an
	efficient and easy-to-use solution.

- Due to differences in supported bubble size ranges between the two
    platforms, you may notice that **some bubbles appear smaller** on
    Azure Map compared to their original size on Bing Map. This change
    occurs because Azure Map\'s bubble size parameters are more
    constrained than those of Bing Map, which means that the maximum
    possible size for bubbles is smaller on Azure Map. Bubble size
    differences can vary based on the visual dimension and the report\'s
    zoom level.
