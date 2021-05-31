---
title: Azure Web PubSub service FAQ
description: Get answers to frequently asked questions about Azure Web PubSub service.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: overview 
ms.date: 04/26/2021
---

# Azure Web PubSub service FAQ

This is the FAQ of Azure Web PubSub service. 

## Is Azure Web PubSub service ready for production use?

The Azure Web PubSub service is in public preview state and not committed SLA. 

##  Where does my data reside?

Azure Web PubSub service works as a data processor service. It won't store any customer content, and data residency is included by design. If you use Azure Web PubSub service together with other Azure services, like Azure Storage for diagnostics, see [this white paper](https://azure.microsoft.com/resources/achieving-compliant-data-residency-and-security-with-azure/) for guidance about how to keep data residency in Azure regions.