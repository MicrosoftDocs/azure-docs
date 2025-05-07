---
title: Azure DNS overview
description: An overview of services provided by Azure DNS.
author: greg-lindsay
ms.service: azure-dns
ms.topic: overview
ms.date: 08/12/2024
ms.author: greglin
#Customer intent: As an administrator, I want to evaluate Azure DNS so I can determine if I want to use it instead of my current DNS service.
---

# Azure DNS overview

The Domain Name System (DNS) is responsible for translating (resolving) a service name to an IP address. Azure DNS provides DNS hosting, resolution, and load balancing for your applications using the Microsoft Azure infrastructure. 

Azure DNS supports both internet-facing DNS domains and private DNS zones, and provides the following services:
- **[Azure Public DNS](public-dns-overview.md)** is a hosting service for DNS domains. By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and billing as your other Azure services.

- **[Azure Private DNS](private-dns-overview.md)** is a DNS service for your virtual networks. Azure Private DNS manages and resolves domain names in the virtual network without the need to configure a custom DNS solution. 

- **[Azure DNS Private Resolver](dns-private-resolver-overview.md)** is a service that enables you to query Azure DNS private zones from an on-premises environment and vice versa without deploying VM based DNS servers.

- **[Azure Traffic Manager](/azure/traffic-manager/traffic-manager-overview)** is a DNS-based traffic load balancer. This service allows you to distribute traffic to your public facing applications across the global Azure regions.

Azure DNS enables multiple scenarios, including:

* [Host and resolve public domains](/azure/dns/dns-delegate-domain-azure-dns)
* [Manage DNS resolution in your virtual networks](/azure/dns/private-dns-privatednszone)
* [Enable autoregistration for VMs](/azure/dns/private-dns-autoregistration)
* [Enable name resolution between Azure and your on-premises resources](/azure/dns/private-resolver-hybrid-dns)
* [Secure hybrid networking](/azure/architecture/networking/architecture/azure-dns-private-resolver#use-dns-private-resolver)
* [Monitor DNS metrics and alerts](/azure/dns/dns-alerts-metrics)
* [Integrate with your other Azure services](/azure/dns/dns-for-azure-services)
* [Perform Private Link and DNS integration at scale](/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale)
* Protect your [public](/azure/dns/dns-protect-zones-recordsets) and [private](/azure/dns/dns-protect-private-zones-recordsets) DNS zones and records
* Enable automatic [fault tolerance](/azure/dns/private-resolver-reliability) and [failover](/azure/dns/tutorial-dns-private-resolver-failover) for DNS resolution
* [Load-balance your applications](/azure/traffic-manager/traffic-manager-how-it-works)
* Increase application [availability](/azure/traffic-manager/traffic-manager-monitoring) and [performance](/azure/traffic-manager/traffic-manager-configure-performance-routing-method)
* [Monitor your application traffic patterns](/azure/traffic-manager/traffic-manager-traffic-view-overview)

## Next steps

* To learn about Public DNS zones and records, see [DNS zones and records overview](dns-zones-records.md).
* To learn about Private DNS zones, see [What is an Azure Private DNS zone](private-dns-privatednszone.md).
* To learn about private resolver endpoints and rulesets, see [Azure DNS Private Resolver endpoints and rulesets](private-resolver-endpoints-rulesets.md).
* For frequently asked questions about Azure DNS, see [Azure DNS FAQ](dns-faq.yml).
* For frequently asked questions about Azure Private DNS, see [Azure Private DNS FAQ](dns-faq-private.yml).
* For frequently asked questions about Traffic Manager, see [Traffic Manager routing methods](/azure/traffic-manager/traffic-manager-faqs)
* Also see [Learn module: Introduction to Azure DNS](/training/modules/intro-to-azure-dns).
