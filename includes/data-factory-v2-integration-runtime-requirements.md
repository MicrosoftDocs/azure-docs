---
author: linda33wj
ms.service: data-factory
ms.topic: include
ms.date: 08/12/2019
ms.author: jingwang
---
<!--
    Separate the generic requirement on Self-hosted Integration Runtime set-up from connector articles.
-->
If your data store is configured in one of the following ways, you need to set up a [self-hosted integration runtime](../articles/data-factory/create-self-hosted-integration-runtime.md) to connect to the data store:

- The data store is located inside an on-premises network, inside an Azure virtual network, or inside Amazon Virtual Private Cloud.
- The data store is a managed cloud data service where the access is restricted to IPs that are whitelisted in the firewall rules.
