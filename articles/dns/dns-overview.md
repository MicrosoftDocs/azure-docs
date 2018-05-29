---
title: What is Azure DNS?
description: Overview of DNS hosting service on Microsoft Azure. Host your domain on Microsoft Azure.
author: KumudD
manager: jeconnoc

ms.service: dns
ms.topic: overview
ms.date: 5/29/2018
ms.author: kumud
#Customer intent: As an administrator, I want to learn about Azure DNS so I can determine if I can host my name resolution service in Azure.
---

# What is Azure DNS?

The Domain Name System (DNS) translates (or resolves) a website or service name to its IP address. Azure DNS is a hosting service for DNS domains, providing name resolution using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records using the same credentials, APIs, tools, and billing as your other Azure services.



![DNS overview](./media/dns-overview/scenario.png)

You can't use Azure DNS to buy a domain name. If you want to buy a domain name, use a third-party domain name registrar. The registrar typically charges a small annual fee. Your domains can then be hosted in Azure DNS for record management. See [Delegate a Domain to Azure DNS](dns-domain-delegation.md) for details.

The following features are included with Azure DNS:

## Reliability and performance

DNS domains in Azure DNS are hosted on Azure's global network of DNS name servers. Azure DNS uses Anycast networking so that each DNS query is answered by the closest available DNS server. This provides both fast performance and high availability for your domain.

## Azure Portal integration

The Azure DNS service can manage DNS records for your Azure services, and can provide DNS for your external resources as well. Azure DNS is integrated in the Azure portal and uses the same credentials, billing, and support contract as your other Azure services.

## Security

The Azure DNS service is based on Azure Resource Manager. So, you get Resource Manager features such as role-based access control, audit logs, and resource locking. Your domains and records can be managed via the Azure portal, Azure PowerShell cmdlets, and the cross-platform Azure CLI. Applications requiring automatic DNS management can integrate with the service via the REST API and SDKs.


## Private domains

Azure DNS also supports private DNS domains. For more information, see [Using Azure DNS for private domains](private-dns-overview.md).

## Billing

DNS billing is based on the number of DNS zones hosted in Azure and by the number of DNS queries. To learn more about pricing, see [Azure DNS Pricing](https://azure.microsoft.com/pricing/details/dns/).

## Next steps

* Learn about DNS zones and records: [DNS zones and records overview](dns-zones-records.md).

* Learn how to create a zone in Azure DNS: [Create a DNS zone](./dns-getstarted-create-dnszone-portal.md).

* For frequently asked questions about Azure DNS, see the [Azure DNS FAQ](dns-faq.md).

