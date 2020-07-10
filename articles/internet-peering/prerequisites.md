---
title: Prerequisites to set up peering with Microsoft
titleSuffix: Azure
description: Prerequisites to set up peering with Microsoft
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: conceptual
ms.date: 11/27/2019
ms.author: prmitiki
---

# Prerequisites to set up peering with Microsoft

Ensure the prerequisites below are met before you request for a new peering or convert a legacy peering to Azure resource.

## Azure related prerequisites
* **Microsoft Azure account:**
If you don't have a Microsoft Azure account, create a [Microsoft Azure account](https://azure.microsoft.com/free). A valid and active Microsoft Azure subscription is required to set up peering, as the peerings are modeled as resources within Azure subscriptions. It is important to note that:
    * The Azure resource types used to set up peering are always-free Azure products, i.e., you are not charged for creating an Azure account or creating a subscription or accessing the Azure resources **PeerAsn** and **Peering** to set up peering. This is not to be confused with peering agreement for Direct peering between you and Microsoft, the terms for which are explicitly discussed with our peering team. Contact [Microsoft peering](mailto:peering@microsoft.com) if any questions in this regard.
    * You can use the same Azure subscription to access other Azure products or cloud services which may be free or paid. When you access a paid product you will incur charges.
    * If you are creating a new Azure account and/or subscription, you may be eligible for free Azure credit during a trial period which you may utilize to try Azure Cloud services. If interested, visit [Microsoft Azure account](https://azure.microsoft.com/free) for more info.

* **Associate Peer ASN:**
Before requesting for peering, first associate your ASN and contact info to your subscription. Follow the instructions in [Associate Peer ASN to Azure Subscription](howto-subscription-association-powershell.md).

## Other prerequisites
* **PeeringDB profile:**
Peers are expected to have a complete and up-to-date profile on [PeeringDB](https://www.peeringdb.com). We use this information in our registration system to validate the peer's details such as NOC information, technical contact information, and their presence at the peering facilities etc.

## Next steps

* [Create or modify a Direct peering using the portal](howto-direct-portal.md).
* [Convert a legacy Direct peering to Azure resource using the portal](howto-legacy-direct-portal.md)
* [Create or modify Exchange peering using the portal](howto-exchange-portal.md)
* [Convert a legacy Exchange peering to Azure resource using the portal](howto-legacy-exchange-portal.md)