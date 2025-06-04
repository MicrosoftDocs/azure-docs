---
title: DNS resolution in Application Gateway
description: This article explains how Virtual Network DNS servers impact DNS resolution for Azure Application Gateway.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 06/04/2025
ms.author: mbender 
---

# Understanding DNS resolution in Application Gateway
An Application Gateway is a dedicated deployment within your Virtual Network. The DNS resolution for instances of your application gateway resource, which handles incoming traffic, is also affected by your virtual network configurations. This article will discuss the Domain Name System (DNS) configurations and their impact on name resolution.

# Need for name resolution
Application Gateway performs DNS resolution for the Fully Qualified Domain Names (FQDN) of

  1)**Customer-provided FQDNs**, such as
* Domain name-based backend server
* Key vault endpoint for listener certificate
* Custom error page URL
* Online Certificate Status Protocol (OCSP) verification URL

  2)**Management FQDNs** that are utilized for various Azure infrastructure endpoints, forming a complete Application Gateway resource. For example, communication with management endpoints enable flow of Logs and Metrics. Thus, it is important for application gateways to internally communicate with other Azure services' endpoints having suffixes like `.windows.net` and `.azure.net`. 
