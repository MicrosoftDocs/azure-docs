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
If your data store is located inside an on-premises network, an Azure virtual network, or Amazon Virtual Private Cloud, you need to configure a [self-hosted integration runtime](../articles/data-factory/create-self-hosted-integration-runtime.md) to connect to it.

Alternatively, if your data store is a managed cloud data service, you can use Azure integration runtime. If the access is restricted to IPs that are approved in the firewall rules, you can add [Azure Integration Runtime IPs](../articles/data-factory/azure-integration-runtime-ip-addresses.md) into the allow list. 

For more information about the network security mechanisms and options supported by Data Factory, see [Data access strategies](../articles/data-factory/data-access-strategies.md).
