---
author: linda33wj
ms.service: data-factory
ms.topic: include
ms.date: 07/13/2020
ms.author: jingwang
---
<!--
    Separate the generic requirement on Self-hosted Integration Runtime set-up from connector articles.
-->
If your data store is located inside an on-premises network, an Azure virtual network, or Amazon Virtual Private Cloud, you need to set up a [self-hosted integration runtime](../articles/data-factory/create-self-hosted-integration-runtime.md) to connect to it.

If your data store is a managed cloud data service, where the access is restricted to IPs that are whitelisted in the firewall rules, you can use Azure integration runtime and add [its IPs](../articles/data-factory/azure-integration-runtime-ip-addresses.md) into the allow list. 

See [Data access strategies](../articles/data-factory/data-access-strategies.md) for information about the network security mechanisms supported by Data Factory to access data stores in general.
