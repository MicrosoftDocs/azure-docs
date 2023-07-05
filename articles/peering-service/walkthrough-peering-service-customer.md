---
title: Microsoft Azure Peering Service customer walkthrough
description: Learn about MAPS and how to onboard.
services: peering-service
author: jsaraco
ms.service: peering-service
ms.topic: how-to
ms.date: 06/09/2023
ms.author: jsaraco
ms.custom: template-how-to
---

# Microsoft Azure Peering Service customer walkthrough

This section explains the steps to optimize your prefixes with an Internet Service Provider (ISP) or Internet Exchange Provider (IXP) who is a Microsoft Azure Peering Service (MAPS) partner.

The complete list of Peering Service providers can be found here: [Peering Service partners](./location-partners.md)

## Activate the prefix

If you have received a peering service prefix key from your Peering Service provider, then you can activate your prefixes for optimized routing with Peering Service. Prefix activation, alignment to the right OC partner, and appropriate interconnect location are requirements for optimized routing (to ensure cold potato routing).

In this section, you activate the prefix:

1. In the search box at the top of the portal, enter *peering service*. Select **Peering Services** in the search results. 

    :::image type="content" source="./media/customer-walkthrough/peering-service-portal-search.png" alt-text="Screenshot shows how to search for Peering Service in the Azure portal.":::

1. Select **+ Create** to create a new Peering Service connection.

    :::image type="content" source="./media/customer-walkthrough/peering-service-list.png" alt-text="Screenshot shows the list of existing Peering Service connections in the Azure portal.":::

1. In the **Basics** tab, enter or select your subscription, resource group, and Peering Service connection name.

    :::image type="content" source="./media/customer-walkthrough/peering-service-basics.png" alt-text="Screenshot shows the Basics tab of creating a Peering Service connection in the Azure portal.":::

1. In the **Configuration** tab, provide details on the location, provider and primary and backup interconnect locations. If the backup location is set to **None**, the traffic will fail over to the internet.

    > [!NOTE]
    > - The prefix key should be the same as the one obtained from your Peering Service provider. 

    :::image type="content" source="./media/customer-walkthrough/peering-service-configuration.png" alt-text="Screenshot shows the Configuration tab of creating a Peering Service connection in the Azure portal."::: 

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## FAQs:

**Q.** Will Microsoft re-advertise your prefixes to the Internet?

**A.** No.

**Q.** My peering service prefix has failed validation. How should I proceed?

**A.** Review the [Peering Service Prefix Requirements](./peering-service-prefix-requirements.md) and follow the troubleshooting steps described.