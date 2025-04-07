---
title: What is Azure Public DNS?
description: Overview of DNS hosting service on Microsoft Azure. Host your domain on Microsoft Azure.
author: greg-lindsay
ms.service: azure-dns
ms.topic: overview
ms.date: 08/09/2024
ms.author: greglin
#Customer intent: As an administrator, I want to evaluate Azure Public DNS so I can determine if I want to use it instead of my current DNS service.
---

# What is Azure Public DNS?

Azure Public DNS is a hosting service for DNS domains that provides name resolution by using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and billing as your other Azure services.

You can't use Azure Public DNS to buy a domain name. For an annual fee, you can buy a domain name by using [App Service domains](../app-service/manage-custom-dns-buy-domain.md#buy-and-map-an-app-service-domain) or a third-party domain name registrar. Your domains then can be hosted in Azure Public DNS for record management. For more information, see [Delegate a domain to Azure DNS](dns-domain-delegation.md).

The following features are included with Azure Public DNS.

## Reliability and performance

DNS domains in Azure Public DNS are hosted on Azure's global network of DNS name servers. Azure Public DNS uses anycast networking. Each DNS query is answered by the closest available DNS server to provide fast performance and high availability for your domain.

## Security

 Azure Public DNS is based on Azure Resource Manager, which provides features such as:

* [Azure role-based access control (Azure RBAC)](../azure-resource-manager/management/overview.md) to control who has access to specific actions for your organization.
* [Activity logs](../azure-resource-manager/management/overview.md) to monitor how a user in your organization modified a resource or to find an error when troubleshooting.
* [Resource locking](../azure-resource-manager/management/lock-resources.md) to lock a subscription, resource group, or resource. Locking prevents other users in your organization from accidentally deleting or modifying critical resources.

For more information, see [How to protect DNS zones and records](dns-protect-zones-recordsets.md). 

## DNSSEC

Azure Public DNS supports DNSSEC. For more information, see [DNSSEC overview](dnssec.md).

## Ease of use

 Azure Public DNS can manage DNS records for your Azure services and provide DNS for your external resources as well. Azure Public DNS is integrated in the Azure portal and uses the same credentials, support contract, and billing as your other Azure services. 

DNS billing is based on the number of DNS zones hosted in Azure and on the number of DNS queries received. To learn more about pricing, see [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/).

Your domains and records can be managed by using the Azure portal, Azure PowerShell cmdlets, and the cross-platform Azure CLI. Applications that require automated DNS management can integrate with the service by using the REST API and SDKs.

## Customizable virtual networks with private domains

Azure Public DNS also supports private DNS domains. This feature allows you to use your own custom domain names in your private virtual networks rather than the Azure-provided names available today.

For more information, see [Use Azure DNS for private domains](private-dns-overview.md).

## Alias records

Azure Public DNS supports alias record sets. You can use an alias record set to refer to an Azure resource, such as an Azure public IP address, an Azure Traffic Manager profile, or an Azure Content Delivery Network (CDN) endpoint. If the IP address of the underlying resource changes, the alias record set seamlessly updates itself during DNS resolution. The alias record set points to the service instance, and the service instance is associated with an IP address.

Also, you can now point your apex or naked domain to a Traffic Manager profile or CDN endpoint using an alias record. An example is contoso.com.

For more information, see [Overview of Azure DNS alias records](dns-alias.md).

## Next steps

* To learn about DNS zones and records, see [DNS zones and records overview](dns-zones-records.md).
* To learn how to create a zone in Azure Public DNS, see [Create a DNS zone](./dns-getstarted-portal.md).
* For frequently asked questions about Azure DNS, see the [Azure DNS FAQ](dns-faq.yml).
* [Learn module: Introduction to Azure DNS](/training/modules/intro-to-azure-dns).
