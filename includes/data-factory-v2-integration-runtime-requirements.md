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
If your data store is configured in one of the following ways, you need to set up a [Self-hosted Integration Runtime](../articles/data-factory/create-self-hosted-integration-runtime.md) in order to connect to this data store:

- The data store is located inside an on-premises network, inside Azure Virtual Network, or inside Amazon Virtual Private Cloud.
- The data store is a managed cloud data service where the access is restricted to IPs whitelisted in the firewall rules.
