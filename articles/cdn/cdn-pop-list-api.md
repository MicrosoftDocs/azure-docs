---
title: Retrieve the current Verizon POP list for Azure CDN| Microsoft Docs
description: Learn how to retrieve the current Verizon POP list by using the REST API.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/22/2018
ms.author: kumud
ms.custom: 

---
# Retrieve the current Verizon POP list for Azure CDN

You can use the REST API to retrieve the set of IPs for Verizon’s point of presence (POP) servers. These POP servers  make requests to origin servers that are associated with Azure Content Delivery Network (CDN) endpoints on a Verizon profile (**Azure CDN Standard from Verizon** or **Azure CDN Premium from Verizon**). Note that this set of IPs is different from the IPs that a client would see when making requests to the POPs. 

For the syntax of the REST API operation for retrieving the POP list, see [Edge Nodes - List](https://docs.microsoft.com/rest/api/cdn/edgenodes/edgenodes_list).

## Typical use case

For security purposes, you can use this IP list to enforce that requests to your origin server are made only from a valid Verizon POP. For example, if someone discovered the hostname or IP address for a CDN endpoint's origin server, one could make requests directly to the origin server, therefore bypassing the scaling and security capabilities provided by Azure CDN. By setting the IPs in the returned list as the only allowed IPs on an origin server, this scenario can be prevented. To ensure they you have the latest POP list, retrieve it at least once a day. 

## Next steps

For information about the REST API, see [Azure CDN REST API](https://docs.microsoft.com/rest/api/cdn/).
