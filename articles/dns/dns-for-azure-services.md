---
title: Use Azure DNS with other Azure services
description: In this learning path, get started on how to use Azure DNS to resolve names for other Azure services
services: dns
documentationcenter: na
author: rohinkoul
manager: kumudD
tags: azure dns

ms.assetid: e9b5eb94-7984-4640-9930-564bb9e82b78
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom: H1Hack27Feb2017
ms.workload: infrastructure-services
ms.date: 09/21/2016
ms.author: rohink
---
# How Azure DNS works with other Azure services

Azure DNS is a hosted DNS management and name resolution service. You can use it to create public DNS names for other applications and services that you deploy in Azure. Creating a name for an Azure service in your custom domain is simple. You just add a record of the correct type for your service.

* For dynamically allocated IP addresses, you can create a DNS CNAME record that maps to the DNS name that Azure created for your service. DNS standards prevent you from using a CNAME record for the zone apex. You can use an alias record instead. For more information, see [Tutorial: Configure an alias record to refer to an Azure Public IP address](tutorial-alias-pip.md).
* For statically allocated IP addresses, you can create a DNS A record by using any name, which includes a *naked domain* name at the zone apex.

The following table outlines the supported record types you can use for various Azure services. As the table shows, Azure DNS supports only DNS records for Internet-facing network resources. Azure DNS can't be used for name resolution of internal, private addresses.

| Azure service | Network interface | Description |
| --- | --- | --- |
| Azure Application Gateway |[Front-end public IP](dns-custom-domain.md#public-ip-address) |You can create a DNS A or CNAME record. |
| Azure Load Balancer |[Front-end public IP](dns-custom-domain.md#public-ip-address) |You can create a DNS A or CNAME record. Load Balancer can have an IPv6 public IP address that's dynamically assigned. Create a CNAME record for an IPv6 address. |
| Azure Traffic Manager |Public name |You can create an alias record that maps to the trafficmanager.net name assigned to your Traffic Manager profile. For more information, see [Tutorial: Configure an alias record to support apex domain names with Traffic Manager](tutorial-alias-tm.md). |
| Azure Cloud Services |[Public IP](dns-custom-domain.md#public-ip-address) |For statically allocated IP addresses, you can create a DNS A record. For dynamically allocated IP addresses, you must create a CNAME record that maps to the *cloudapp.net* name.|
| Azure App Service | [External IP](dns-custom-domain.md#app-service-web-apps) |For external IP addresses, you can create a DNS A record. Otherwise, you must create a CNAME record that maps to the azurewebsites.net name. For more information, see [Map a custom domain name to an Azure app](../app-service/app-service-web-tutorial-custom-domain.md). |
| Azure Resource Manager VMs |[Public IP](dns-custom-domain.md#public-ip-address) |Resource Manager VMs can have public IP addresses. A VM with a public IP address also can be behind a load balancer. You can create a DNS A, CNAME, or alias record for the public address. You can use this custom name to bypass the VIP on the load balancer. |
| Classic VMs |[Public IP](dns-custom-domain.md#public-ip-address) |Classic VMs created by using PowerShell or CLI can be configured with a dynamic or static (reserved) virtual address. You can create a DNS CNAME or an A record, respectively. |
