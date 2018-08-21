---
title: Azure DNS alias records overview
description: Overview of support for alias records in Microsoft Azure DNS.
services: dns
author: vhorne
ms.service: dns
ms.topic: article
ms.date: 9/24/2018
ms.author: victorh
---

# Overview of Azure DNS alias records

Azure DNS alias records are a custom record type that allow you to reference other Azure resources from within your DNS zone for both forward and reverse lookups. For example, can create an alias record that references an Azure Public IP address instead of creating an A record. Since your alias record points to the service instance (an Azure Public IP address), the alias record set seamlessly updates itself during DNS resolution. It points to the service instance, which has the actual IP address associated with it.

Other Azure services benefit from this Azure DNS integration too. For example, Azure Traffic Mangager uses CNAMEs to direct your traffic to the Traffic Manager profile. However, since you can't create a CNAME for a domain apex (for example, contoso.com) it was not possible to redirect direct contoso.comtraffic to Taffic Manager. You can use an alias record to solve this problem. For example, you create 
