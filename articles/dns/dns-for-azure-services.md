---
title: Using Azure DNS with other Azure services | Microsoft Docs
description: Understanding how to use Azure DNS to resolve name for other Azure services
services: dns
documentationcenter: na
author: georgewallace
manager: timlt
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
ms.author: gwallace
---
# How Azure DNS works with other Azure services

Azure DNS is a hosted DNS management and name resolution service. This allows you to create public DNS names for the other applications and services you have deployed in Azure. Creating a name for an Azure service in your custom domain is as simple as adding a record of the correct type for your service.

* For dynamically allocated IP addresses, you must create a DNS CNAME record that maps to the DNS name that Azure created for your service. DNS standards prevent you from using a CNAME record for the zone apex.
* For statically allocated IP addresses, you can create a DNS A record using any name, including a *naked domain* name at the zone apex.

The following table outlines the supported record types that can be used for various Azure services. As you can see from this table, Azure DNS only supports DNS records for Internet-facing network resources. Azure DNS cannot be used for name resolution of internal, private addresses.

| Azure Service | Network Interface | Description |
| --- | --- | --- |
| Application Gateway |Front-end Public IP |You can create a DNS A or CNAME record. |
| Load Balancer |Front-end Public IP |You can create a DNS A or CNAME record. Load Balancer can have an IPv6 Public IP address that is dynamically assigned. Therefore, you must create a CNAME record for an IPv6 address. |
| Traffic Manager |Public name |You can only create a CNAME that maps to the trafficmanager.net name assigned to your Traffic Manager profile. For more information, see [How Traffic Manager works](../traffic-manager/traffic-manager-overview.md#traffic-manager-example). |
| Cloud Service |Public IP |For statically allocated IP addresses, you can create a DNS A record. For dynamically allocated IP addresses, you must create a CNAME record that maps to the *cloudapp.net* name. This rule applies to VMs created in the classic portal because they are deployed as a cloud service. For more information, see [Configure a custom domain name in Cloud Services](../cloud-services/cloud-services-custom-domain-name-portal.md). |
| App Service |External IP |For external IP addresses, you can create a DNS A record. Otherwise, you must create a CNAME record that maps to the azurewebsites.net name. For more information, see [Map a custom domain name to an Azure app](../app-service-web/web-sites-custom-domain-name.md) |
| Resource Manager VMs |Public IP |Resource Manager VMs can have Public IP addresses. A VM with a Public IP address may also be behind a load balancer. You can create a DNS A or CNAME record for the Public address. This custom name can be used to bypass the VIP on the load balancer. |
| Classic VMs |Public IP |Classic VMs created using PowerShell or CLI can be configured with a dynamic or static (reserved) virtual address. You can create a DNS CNAME or A record, respectively. |
