---
title: Setup Peering with Microsoft
description: Overview of Peering
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: overview
ms.date: 11/27/2019
ms.author: prmitiki
---

# Peering Overview

Peering is the interconnection between Microsoft’s global network (AS8075) and your network for the purpose of exchanging internet traffic from/to Microsoft online services and Microsoft Azure Services. Carriers or Service Providers can request to connect with Microsoft at any of our Edge locations. Each request is reviewed by Microsoft Azure Networking to ensure that it adheres to our Peering Policy. 

## Peering Setup
You can setup a peering with Microsoft network in two ways:

### 1. Direct Peering
The peering is established over direct physical connections between Microsoft network at a Microsoft Edge and your network. BGP sessions are configured across these connections per our routing policy and using pre-negotiated agreement. This is also referred as PNI.

### 2. Exchange Peering
This refers to standard public peering connections at Internet Exchanges (IX). The physical connections between Microsoft network and your network are through switch fabric operated by the IX. BGP sessions are configured using IP space provided by the IX.

## Peering Policy
Microsoft has a selective, but generally open peering policy. Peers are selected based upon performance, capability, and where there is mutual benefit, and are subject to certain technical, commercial and legal requirements. For details, see [Peering Policy](https://peering.azurewebsites.net/peering).

## Benefits of Peering with Microsoft
* Lower your transit costs by delivering Microsoft traffic using peering with Microsoft.
* Improve performance for your customers by reducing network hops and latency to Microsoft Edge network.
* Protect customer traffic against failures in your network or transit provider's network, by peering with Microsoft at redundant locations.
* Learn performance metrics about your peering connections and utilize insights to troubleshoot your network.

## Use Azure for Peering setup

You may request for Peering with Microsoft using Azure PowerShell or Azure Portal. Peering setup in this manner is managed as an Azure resource and provides the following benefits:
* Simplified and automatable steps to setup and manage peering with Microsoft.
* Quick and easy way to view and manage all your peerings in one place.
* Track status and bandwidth data for all your connections.
* You can use the same subscription to access your Azure Cloud Services.

If you already have established peerings with Microsoft, they are referred to as **legacy peerings**. You may choose to manage such peerings as Azure resource to take advantage of the above benefits. To submit a new peering request, or convert legacy peering to Azure resource, follow the links in the **Next steps** section below.


## FAQ
For frequently asked questions about Peering, see [Peering - FAQ](peering-faqs.md).

## Next steps

* Learn about [Peering Policy](https://peering.azurewebsites.net/peering).
* Steps to setup peering with Microsoft.
    * [Direct Peering Walkthrough](peering-workflows-direct.md)
    * [Exchange Peering Walkthrough](peering-workflows-exchange.md)
* Request a Peering connection.
    * [Create or modify a Direct Peering using Portal](peering-howto-directpeering-arm-portal.md)
    * [Convert a legacy Direct Peering to Azure Resource using Portal](peering-howto-legacydirect-arm-portal.md)
    * [Create or modify Exchange Peering using Portal](peering-howto-exchangepeering-arm-portal.md)
    * [Convert a legacy Exchange Peering to Azure Resource using Portal](peering-howto-legacyexchange-arm-portal.md)
* Learn about some of the other Azure key [networking capabilities](https://docs.microsoft.com/en-us/azure/networking/networking-overview).
