---
title: Azure Peering Service customer walkthrough
description: Learn how to activate and optimize your prefixes with Azure Peering Service.
author: halkazwini
ms.author: halkazwini
ms.service: azure-peering-service
ms.topic: how-to
ms.date: 03/03/2025
# Customer intent: As a network administrator, I want to activate and optimize prefixes with an Internet Service Provider using Azure Peering Service, so that I can ensure efficient routing and improve network performance.
---

# Azure Peering Service customer walkthrough

This article explains the steps to optimize your prefixes with an Internet Service Provider (ISP) or Internet Exchange Provider (IXP) that is a Peering Service partner.

See [Peering Service partners](location-partners.md) for a complete list of Peering Service providers. 

## Activate the prefix

If you already received a Peering Service prefix key from your Peering Service provider, then you can activate your prefixes for optimized routing with Peering Service. Prefix activation, alignment to the right OC partner, and appropriate interconnect location are requirements for optimized routing (to ensure cold potato routing).

To activate the prefix, follow these steps:

1. In the search box at the top of the portal, enter *peering service*. Select **Peering Services** in the search results. 

    :::image type="content" source="./media/peering-services-portal-search.png" alt-text="Screenshot shows how to search for Peering Service in the Azure portal." lightbox="./media/peering-services-portal-search.png":::

1. Select **+ Create** to create a new Peering Service connection.

1. In the **Basics** tab, enter or select your subscription, resource group, and Peering Service connection name.

1. In the **Configuration** tab, provide details on the location, provider, and primary and backup interconnect locations. If the backup location is set to **None**, the traffic fails over to the internet.

    > [!NOTE]
    > The prefix key should be the same as the one obtained from your Peering Service provider. 

    :::image type="content" source="./media/customer-walkthrough/peering-service-configuration.png" alt-text="Screenshot shows the Configuration tab of creating a Peering Service connection in the Azure portal."::: 

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Frequently asked questions (FAQ)

**Q.** Will Microsoft readvertise my prefixes to the Internet?

**A.** No.

**Q.** My Peering Service prefix failed validation. How should I proceed?

**A.** Review the [Peering Service prefix requirements](./peering-service-prefix-requirements.md) and follow the troubleshooting steps described.
