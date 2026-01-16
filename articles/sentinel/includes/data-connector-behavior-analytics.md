---
title: Enable UEBA from supported data connectors in Microsoft Defender portal
ms.date: 12/17/2025
ms.topic: include
---

<!-- docutune:disable -->

To enable UEBA from supported data connectors in Microsoft Defender portal:

1. From the Microsoft Defender portal navigation menu, select **Microsoft Sentinel > Configuration > Data connectors**.
1. Select a UEBA supported data connector that supports UEBA. For more information about UEBA supported data connectors and tables, see [Microsoft Sentinel UEBA reference](./../ueba-reference.md#ueba-data-sources). 
1. From the data connector pane, select **Open connector page**.
1. On the **Connector details** page, select **Advanced options**.
1. Under **Configure UEBA**, toggle on the tables you want to enable for UEBA.

    :::image type="content" source="../media/enable-entity-behavior-analytics/entity-behavior-analytics-data-connector.png" alt-text="Screenshot of UEBA configuration in data connector." lightbox="../media/enable-entity-behavior-analytics/entity-behavior-analytics-data-connector.png":::