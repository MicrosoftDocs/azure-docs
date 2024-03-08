---
title: Enable Azure Peering Service Voice on a Direct peering - Azure portal
description: Learn how to enable Azure Peering Service for voice on a Direct peering using the Azure portal.
services: internet-peering
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 08/01/2023
---

# Enable Azure Peering Service Voice on a Direct peering by using the Azure portal

This article shows you how to enable Azure Peering Service for voice on a Direct peering using the Azure portal. Fore more information, see [Peering Service](../peering-service/about.md).

## Prerequisites

- Review the [Prerequisites to set up peering with Microsoft](prerequisites.md) before you begin configuration.
- Choose a peering resource in your subscription for which you want to enable Peering Service. If you don't have one, either [convert a legacy Direct peering](howto-legacy-direct-portal.md) or [create a new Direct peering](howto-direct-portal.md):

## Enable Azure Peering Service Voice

1. In the search box at the top of the portal, enter *peering*. Select **Peering** in the search results.

    :::image type="content" source="./media/howto-peering-service-voice-portal/internet-peering-portal-search.png" alt-text="Screenshot shows how to search for Internet peering in the Azure portal.":::

1. In the **Peerings** page, select the peering resource that you want to convert to Azure Peering Service Voice configuration. If you have many peerings, you can filter by subscription, location, or resource group to find the peering resources that you want to convert to Azure Peering Service Voice configuration.

    :::image type="content" source="./media/howto-peering-service-voice-portal/peerings-filters.png" alt-text="Screenshot shows how to apply filters to find a peering the Azure portal.":::

1. Select **Connections**, and then confirm that the **Connection State** of your peering resource is **Active**. You can't convert to Azure Peering Service Voice if the connection state is **PendingApproval**.

    :::image type="content" source="./media/howto-peering-service-voice-portal/peering-connections.png" alt-text="Screenshot shows the connection state of the peering resource in the Azure portal.":::

1. Select **Configuration**, and then select **AS8075 (with Voice)** for **Microsoft network**. Select **Save** after you make your selection.

    :::image type="content" source="./media/howto-peering-service-voice-portal/peering-configuration.png" alt-text="Screenshot shows how to change Microsoft network from the Configuration page of the peering resource in the Azure portal.":::

1. You'll receive an automatic email notification to let you know that your request to change peer type has been received. Once your request is reviewed and approved by the product team, you'll receive another notification. If you have pre-configured BGP and BFD prior to requesting the conversion, the configuration change will automatically run over the next 48 hours. A final notification is sent when the configuration is completed.  

## Considerations

- When conversions are requested on multiple connections at once (for example, two connections contained in the same peering resource), one link is converted at a time to avoid customer impact. 

- If the existing peering session has IP addresses assigned by Microsoft, then BGP and BFD must be configured according to the instructions prior to requesting the change to Azure Peering Service Voice. 

    - If the existing peering sessions have IP addresses assigned by the peer, then you need to take action during the conversion to change to Microsoft assigned IP addresses once they're assigned. The conversion to Azure Peering Service Voice will be delayed if the peer doesn't configure BGP and BFD in a timely manner.

- The peer receives notifications at each stage of the conversion process, including submission of the request, approval, assignment of new IP addresses, and completion of the conversion.

## Next steps

- For frequently asked questions, see the [Peering Service FAQ](faqs.md#peering-service).
- To learn how to convert a legacy Exchange peering, see [Convert a legacy Exchange peering to an Azure resource](howto-legacy-exchange-portal.md).