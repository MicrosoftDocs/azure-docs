---
title: Azure Front Door - Best practices
description: This page provides information about how to configure Azure Front Door based on Microsoft's best practices
services: frontdoor
documentationcenter: ''
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/10/2022
ms.author: jodowns
---

# Best practices for Front Door

## General best practices

### Don't combine Traffic Manager and Front Door

TODO

### Use the latest API version and SDK version

TODO

## TLS best practices

### Use end-to-end TLS, even for Azure origins

TODO

### Use HTTP to HTTPS redirection

TODO

### Use managed TLS certificates

TODO

### Use 'Latest' version for customer-managed certificates

TODO

## Domain names

### Use the same domain name on Front Door and your origin

Avoid host header rewrites.

## Web application firewall (WAF)

### Enable the WAF

TODO

### Enable managed rules

TODO

## Health probes

### Select good health probe endpoints

Point health probes to something that tells you whether the origin is healthy and ready to accept traffic.

### Disable health probes when there’s only one origin

TODO

## Next steps

TODO
