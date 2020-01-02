---
title: Prerequisites to setup peering with Microsoft
description: Prerequisites to setup peering with Microsoft
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: conceptual
ms.date: 11/27/2019
ms.author: prmitiki
---

# Prerequisites to setup peering with Microsoft

Please ensure the prerequisites below are met before you request for a new peering or convert a legacy peering to Azure resource.

* **Microsoft Azure account:**
If you don't have a Microsoft Azure account, create a [Microsoft Azure account](https://azure.microsoft.com/free). A valid and active Microsoft Azure subscription is required to setup peering, as the peerings are modeled as resources within Azure subscriptions. It is important to note that:
    * The Azure resource types used to setup Peering are always-free Azure products, i.e., you are not charged for creating an Azure account or creating a subscription or accessing the Azure resources **PeerAsn** and **Peering** to setup Peering. This is not to be confused with Peering agreement for Direct Peering between you and Microsoft, the terms for which are explicitly discussed with our Peering team. Please contact [Microsoft Peering](mailto:peering@microsoft.com) if any questions in this regard.
    * You can use the same Azure subscription to access other Azure products or cloud services which may be free or paid. When you access a paid product you will incur charges.
    * If you are creating a new Azure account and/or subscription, you may be eligible for free Azure credit during a trial period which you may utilize to try Azure Cloud services. If interested, please visit [Microsoft Azure account](https://azure.microsoft.com/free) for more info.

* **Associate Peer ASN:**
Before requesting for Peering, first associate your ASN and contact info to your subscription. Please follow the instructions in [Associate Peer ASN to Azure Subscription](subscription-registration.md).

* **PeeringDB profile:**
Peers are expected to have a complete and up-to-date profile on [PeeringDB](https://www.peeringdb.com). We use this information in our registration system to validate the peer's details such as NOC information, technical contact information, and their presence at the peering facilities etc.

## Next steps

* [Create or modify a Direct Peering using Azure portal](howto-directpeering-arm-portal.md).
* [Convert a legacy Direct Peering to Azure resource using Azure portal](howto-legacydirect-arm-portal.md)
* [Create or modify Exchange Peering using Azure portal](howto-exchangepeering-arm-portal.md)
* [Convert a legacy Exchange Peering to Azure resource using Azure portal](howto-legacyexchange-arm-portal.md)