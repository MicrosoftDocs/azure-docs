---
title: Using Azure DNS with other Azure services | Microsoft Docs
description: Understanding how to use Azure DNS to resolve name for other Azure services
services: dns
documentationcenter: na
author: vhorne
manager: jeconnoc
editor: ''
tags: azure dns

ms.assetid: e9b5eb94-7984-4640-9930-564bb9e82b78
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom: H1Hack27Feb2017
ms.workload: infrastructure-services
ms.date: 09/21/2016
ms.author: victorh
---
# How Azure DNS works with other Azure services

Azure DNS is a hosted DNS management and name resolution service. This allows you to create public DNS names for the other applications and services you have deployed in Azure. Creating a name for an Azure service in your custom domain is as simple as adding a record of the correct type for your service.

* For dynamically allocated IP addresses, you can create a DNS CNAME record that maps to the DNS name that Azure created for your service. DNS standards prevent you from using a CNAME record for the zone apex, but you can use an alias record instead. For more information, see [Tutorial: Configure an alias record to refer to an Azure Public IP address](tutorial-alias-pip.md).
* For statically allocated IP addresses, you can create a DNS A record using any name, including a *naked domain* name at the zone apex.

The following table outlines the supported record types that can be used for various Azure services. As you can see from this table, Azure DNS only supports DNS records for Internet-facing network resources. Azure DNS cannot be used for name resolution of internal, private addresses.

| Azure Service | Network Interface | Description |
| --- | --- | --- |
| Application Gateway |[Front-end Public IP](dns-custom-domain.md#public-ip-address) |You can create a DNS A or CNAME record. |
| Load Balancer |[Front-end Public IP](dns-custom-domain.md#public-ip-address)  |You can create a DNS A or CNAME record. Load Balancer can have an IPv6 Public IP address that is dynamically assigned. Therefore, you must create a CNAME record for an IPv6 address. |
| Traffic Manager |Public name |You can create an alias record that maps to the trafficmanager.net name assigned to your Traffic Manager profile. For more information, see [Tutorial: Configure an alias record to support apex domain names with Traffic Manager](tutorial-alias-tm.md). |
| Cloud Service |[Public IP](dns-custom-domain.md#public-ip-address) |For statically allocated IP addresses, you can create a DNS A record. For dynamically allocated IP addresses, you must create a CNAME record that maps to the *cloudapp.net* name.|
| App Service | [External IP](dns-custom-domain.md#app-service-web-apps) |For external IP addresses, you can create a DNS A record. Otherwise, you must create a CNAME record that maps to the azurewebsites.net name. For more information, see [Map a custom domain name to an Azure app](../app-service/app-service-web-tutorial-custom-domain.md) |
| Resource Manager VMs |[Public IP](dns-custom-domain.md#public-ip-address) |Resource Manager VMs can have Public IP addresses. A VM with a Public IP address may also be behind a load balancer. You can create a DNS A, CNAME, or alias record for the Public address. This custom name can be used to bypass the VIP on the load balancer. |
| Classic VMs |[Public IP](dns-custom-domain.md#public-ip-address) |Classic VMs created using PowerShell or CLI can be configured with a dynamic or static (reserved) virtual address. You can create a DNS CNAME or A record, respectively. |
