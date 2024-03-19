---
title: Power BI Azure Maps Visual Data Residency
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article covers the Power BI Azure Maps Visual Data Residency.
author: deniseatmicrosoft
ms.author: limingchen 
ms.date: 03/22/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Power BI Azure Maps Visual Data Residency

The Azure Maps visual can get a users' tenant location and use it to call the correct Azure Maps geographic endpoints. For instance, if a user's tenant is located in Europe, Power BI calls the Azure Maps' `eu` endpoint `eu.atlas.microsoft.com`, ensuring that their data doesn't leave the Europe boundary. Similarly if users' tenant is in the US, `us.atlas.microsoft.com` is called and users' data doesn't leave the US boundary. For the rest of world, the Azure Maps visual calls `atlas.microsoft.com` redirecting them to the nearest region to fulfill their requests.

## Tenent location

To discover your tenant's location in Power BI:

1. Open the Help menu drop-down list by selecting the `?`

    :::image type="content" source="media/power-bi-visual/help-menu.png" alt-text="Screenshot showing the help menu in Power BI.":::

1. Select **About Power BI**
1. Once the **About Power BI** dialog box opens, you will see **your data is stored in** followed by the tenent location, which is, in this example, Ireland.

    :::image type="content" source="media/power-bi-visual/about-power-bi.png" alt-text="Screenshot showing the About Power BI diloag box.":::

The previous example would use the `eu.atlas.microsoft.com` endpoint.

## Next steps

Learn more about specifying a geographic scope and why it matters.

> [!div class="nextstepaction"]
> [Azure Maps service geographic scope](geographic-scope.md)
