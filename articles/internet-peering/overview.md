---
title: Set up peering with Microsoft
description: Overview of peering
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: overview
ms.date: 11/27/2019
ms.author: prmitiki
---

# Internet Peering overview

Peering is the interconnection between Microsoft’s global network (AS8075) and your network for the purpose of exchanging internet traffic from/to Microsoft online services and Microsoft Azure Services. Carriers or Service Providers can request to connect with Microsoft at any of our Edge locations. Each request is reviewed by Microsoft Azure Networking to ensure that it adheres to our Peering policy. You can set up a peering with Microsoft network in two ways:

* **Direct Peering:**

    Peering is established over direct physical connections between Microsoft network at a Microsoft Edge and your network. BGP sessions are configured across these connections per our routing policy and using pre-negotiated agreement. This is also referred as PNI.

* **Exchange Peering:**

    This refers to standard public peering connections at Internet Exchanges (IX). The physical connections between Microsoft network and your network are through switch fabric operated by the IX. BGP sessions are configured using IP space provided by the IX.

## Benefits of peering with Microsoft
* Lower your transit costs by delivering Microsoft traffic using peering with Microsoft.
* Improve performance for your customers by reducing network hops and latency to Microsoft Edge network.
* Protect customer traffic against failures in your network or transit provider's network, by peering with Microsoft at redundant locations.
* Learn performance metrics about your peering connections and utilize insights to troubleshoot your network.

## Benefits of using Azure

You may request for Peering with Microsoft using Azure PowerShell or portal. Peering set up in this manner is managed as an Azure resource and provides the following benefits:
* Simplified and automatable steps to set up and manage peering with Microsoft.
* Quick and easy way to view and manage all your peerings in one place.
* Track status and bandwidth data for all your connections.
* You can use the same subscription to access your Azure Cloud Services.

If you already have established peerings with Microsoft, they are referred to as **legacy peerings**. You may choose to manage such peerings as Azure resource to take advantage of the above benefits. To submit a new peering request, or convert legacy peering to Azure resource, follow the links in the **Next steps** section below.

## Peering policy
Microsoft has a selective, but generally open peering policy. Peers are selected based upon performance, capability, and where there is mutual benefit, and are subject to certain technical, commercial and legal requirements. For details, see [Peering policy](https://peering.azurewebsites.net/peering).

## FAQ
For frequently asked questions about Peering, see [Peering - FAQ](faqs.md).

## Next steps

* To learn about steps to set up Direct Peering with Microsoft, follow [Direct Peering walkthrough](workflows-direct.md)
* To learn about steps to set up Exchange Peering with Microsoft, follow [Exchange Peering walkthrough](workflows-exchange.md)
* Learn about some of the other Azure key [networking capabilities](https://docs.microsoft.com/azure/networking/networking-overview).
