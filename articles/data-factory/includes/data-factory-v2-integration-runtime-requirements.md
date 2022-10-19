---
author: jianleishen
ms.service: data-factory
ms.topic: include
ms.date: 09/29/2021
ms.author: jianleishen
---
<!--
    Separate the generic requirement on Self-hosted Integration Runtime setup from connector articles.
-->
If your data store is located inside an on-premises network, an Azure virtual network, or Amazon Virtual Private Cloud, you need to configure a [self-hosted integration runtime](../create-self-hosted-integration-runtime.md) to connect to it.

If your data store is a managed cloud data service, you can use the Azure Integration Runtime. If the access is restricted to IPs that are approved in the firewall rules, you can add [Azure Integration Runtime IPs](../azure-integration-runtime-ip-addresses.md) to the allow list. 

You can also use the [managed virtual network integration runtime](../tutorial-managed-virtual-network-on-premise-sql-server.md) feature in Azure Data Factory to access the on-premises network without installing and configuring a self-hosted integration runtime.

For more information about the network security mechanisms and options supported by Data Factory, see [Data access strategies](../data-access-strategies.md).
