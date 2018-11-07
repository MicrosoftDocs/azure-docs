---
title: How-to configure IP firewall for your Cosmos account
description: Learn how to use IP access control policies for firewall support on Azure Cosmos DB database accounts.
author: kanshiG

ms.service: cosmos-db
ms.date: 11/06/2018
ms.author: govindk

---

# IP firewall for Cosmos accounts

To secure data stored in your Cosmos account, Azure Cosmos DB supports a secret based [authorization model]() that utilizes a strong Hash-based Message Authentication Code (HMAC). Additionally, Cosmos DB supports IP-based access controls for inbound firewall support. This model is similar to the firewall rules of a traditional database system and provides an additional level of security to your Cosmos account. With firewalls, you can configure your Cosmos account to be accessible only from an approved set of machines and/or cloud services. Access to data stored in your Cosmos database from these approved sets of machines and services will still require the caller to present a valid authorization token.

By default, your Cosmos account is accessible from internet, as long as the request is accompanied by a valid authorization token. To configure IP policy-based access control, the user must provide the set of IP addresses or IP address ranges in CIDR (Classless Inter-Domain Routing) form to be included as the allowed list of client IPs to access a given Cosmos account. Once this configuration is applied, any requests originating from machines outside this allowed list receive 404 (Not found) response. When using IP firewall, it is recommended to allow Azure portal to access your Cosmos account. Access is required to allow use of data explorer as well as to retrieve metrics for your account which show up on the Azure portal.

You can combine IP based firewall with subnet and VNET access control. This allows you to limit access to any source which has a public IP and/or from a specific subnet within VNET. To learn more about using subnet and VNET based access control see [VNET and subnet access control for your Cosmos account]().

To summarize, authentication code is always required to access a Cosmos account. If IP firewall and VNET Access Control List (ACLs) are not setup, the Cosmos account can be accessed with the authentication code. After the IP firewall or VNET ACLs or both are setup on the Cosmos account, only requests originating from the sources you have specified (and with the authentication code) get valid responses. 

## Next steps

Next you can configure IP firewall or VNET service endpoint for your account by using the following docs:

* [How to configure IP firewall for your Cosmos account](how-to-configure-firewall.md)
* VNET and subnet access control for your Cosmos account




