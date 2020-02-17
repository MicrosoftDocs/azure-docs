---
title: IP firewall for Azure Cosmos accounts
description: Learn how to secure Azure Cosmos DB data by using IP access control policies for firewall support.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: govindk

---

# IP firewall in Azure Cosmos DB

To secure data stored in your account, Azure Cosmos DB supports a secret based authorization model that utilizes a strong Hash-based Message Authentication Code (HMAC). Additionally, Azure Cosmos DB supports IP-based access controls for inbound firewall support. This model is similar to the firewall rules of a traditional database system and provides an additional level of security to your account. With firewalls, you can configure your Azure Cosmos account to be accessible only from an approved set of machines and/or cloud services. Access to data stored in your Azure Cosmos database from these approved sets of machines and services will still require the caller to present a valid authorization token.

## <a id="ip-access-control-overview"></a>IP access control overview

By default, your Azure Cosmos account is accessible from internet, as long as the request is accompanied by a valid authorization token. To configure IP policy-based access control, the user must provide the set of IP addresses or IP address ranges in CIDR (Classless Inter-Domain Routing) form to be included as the allowed list of client IPs to access a given Azure Cosmos account. Once this configuration is applied, any requests originating from machines outside this allowed list receive 403 (Forbidden) response. When using IP firewall, it is recommended to allow Azure portal to access your account. Access is required to allow use of data explorer as well as to retrieve metrics for your account that show up on the Azure portal. When using data explorer, in addition to allowing Azure portal to access your account, you also need to update your firewall settings to add your current IP address to the firewall rules. Note that firewall changes may take up to 15min to propagate. 

You can combine IP-based firewall with subnet and VNET access control. By combining them, you can limit access to any source that has a public IP and/or from a specific subnet within VNET. To learn more about using subnet and VNET-based access control see [Access Azure Cosmos DB resources from virtual networks](vnet-service-endpoint.md).

To summarize, authorization token is always required to access an Azure Cosmos account. If IP firewall and VNET Access Control List (ACLs) are not set up, the Azure Cosmos account can be accessed with the authorization token. After the IP firewall or VNET ACLs or both are set up on the Azure Cosmos account, only requests originating from the sources you have specified (and with the authorization token) get valid responses. 

## Next steps

Next you can configure IP firewall or VNET service endpoint for your account by using the following docs:

* [How to configure IP firewall for your Azure Cosmos account](how-to-configure-firewall.md)
* [Access Azure Cosmos DB resources from virtual networks](vnet-service-endpoint.md)
* [How to configure virtual network service endpoint for your Azure Cosmos account](how-to-configure-vnet-service-endpoint.md)




