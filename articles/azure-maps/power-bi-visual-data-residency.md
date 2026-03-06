---
title: Azure Maps Power BI visual Data Residency
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article covers the Azure Maps Power BI visual Data Residency.
author: deniseatmicrosoft
ms.author: limingchen 
ms.date: 03/22/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Azure Maps Power BI visual Data Residency

Azure Maps Power BI visual data residency
The Azure Maps Power BI visual uses a user’s Power BI tenant location to route requests to the appropriate Azure Maps geographic endpoint. This ensures that customer data is processed and stored within the expected geographic boundary, helping customers meet regional data residency requirements.
For example:

1. If a user’s Power BI tenant is located in Europe, the visual calls the Europe Azure Maps endpoint (eu.atlas.microsoft.com), ensuring data does not leave the European region.
2. If a user’s tenant is located in the United States, the United States endpoint (us.atlas.microsoft.com) is used.
3. If a user’s tenant is located in Korea, the visual routes requests to the Korea endpoint.
4. If a user’s tenant is located in Brazil, the visual routes requests to the Brazil endpoint.

The Azure Maps Power BI visual does not require additional configuration from report authors or viewers to enable this behavior.


## Tenant location

To discover your tenant's location in Power BI:

1. Open the Help menu drop-down list by selecting the `?`

    :::image type="content" source="media/power-bi-visual/help-menu.png" alt-text="Screenshot showing the help menu in Power BI.":::

1. Select **About Power BI**
1. Once the **About Power BI** dialog box opens, notice the **your data is stored in** followed by the Tenant location, which is, in this example, Ireland.

    :::image type="content" source="media/power-bi-visual/about-power-bi.png" alt-text="Screenshot showing the About Power BI dialog box.":::

The previous example would use the `eu.atlas.microsoft.com` endpoint.

> [!NOTE]
> The region used for [Power BI premium capacity] is currently not taken into consideration when determining which Azure Maps geographic endpoints are called.

## Next steps

Learn more about specifying a geographic scope and why it matters.

> [!div class="nextstepaction"]
> [Azure Maps service geographic scope]

[Azure Maps service geographic scope]: geographic-scope.md
[Power BI Premium Capacity]: /power-bi/enterprise/service-premium-capacity-manage
