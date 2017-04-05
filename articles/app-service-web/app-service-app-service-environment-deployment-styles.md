---
title: App Service Environment Deployment Styles
description: Learn about the different ways you can deploy an App Service Environment.
keywords: azure app service, app service environment
services: app-service
documentationcenter: ''
author: ahmedelnably
ms.author: aelnably
ms.date: 04/03/2017
editor: ''

ms.assetid: b998ba61-ab75-496b-b697-0f9ce96167e8
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
---

# App Service Environment Deployment Styles


## Overview

## Basic Deployments
### Basic App Service Environment Deployment
put the basic deployment here, VNET + VIP
* Insert architecture diagram - slide 2 in deck
* Insert UX steps to create that

### Accessing On-Premise Artifact
Add the site to site or Express Route VPN
* Insert architecture diagram - slide 2 in deck
* Insert extra UX steps to create that

### Talk about ports/inbound/outbound limitations 
Add references to the different articles talking about the ports and inbound/outbound limitations

### Talk about inbound connections for ILB App Service Environment
* Insert architecture diagram - slide 6 in deck
* Refer to articles about creating ILB ASE

## Going to the next level
### App Service Environment with a WAF
Talk about adding a WAF to your VNET
* Insert architecture diagram - slide 7 in deck
* Insert extra UX steps to create a WAF

### 2 Tier Applications using Single App Service Environment
Talk about using one ASE to implement 2 Tier applications
* Insert architecture diagram - slide 8 in deck

### 2 Tier Applications using multiple App Service Environments
Talk about using 2 (one External, one ILB) ASEs to implement 2 tier apps
* Insert architecture diagram - slide 9 in deck

### Geo distributed 2 tier apps using App Service Environments
Talk about using 3 ( two External, one ILB) ASEs to implement 2 tier apps
* Insert architecture diagram - slide 10 in deck

### VNet Integration with Azure App Service
Talk about using Point to Site VPN to connect an ILB ASE to App Service Workers
* Insert architecture diagram - slide 11 in deck
* Insert extra UX steps to create a WAF

### ILB ASE + WAF
* Insert architecture diagram - slide 12 in deck
* Insert extra UX steps to configure a WAF with ILB ASE

### 2 Tier Apps using ILB ASE & WAF
* Insert architecture diagram - slide 13 in deck
* Insert extra UX steps to configure a WAF with ILB ASE

### Geo distributed 2 tier Apps using ILB ASE & WAF
* Insert architecture diagram - slide 13 in deck
* Insert extra UX steps to configure Traffic manager, WAF with ILB ASE

## Next steps
* [Introduction to App Service Environment](app-service-app-service-environment-intro.md)
* [Implementing a Layered Security Architecture with App Service Environments](app-service-app-service-environment-layered-security.md)
* [Securely Connecting to Backend Resources from an App Service Environment](app-service-app-service-environment-securely-connecting-to-backend-resources.md)
* [Network Architecture Overview of App Service Environments](app-service-app-service-environment-network-architecture-overview.md)
* [Configuring a Web Application Firewall (WAF) for App Service Environment](app-service-app-service-environment-web-application-firewall.md)
* [How To Control Inbound Traffic to an App Service Environment](app-service-app-service-environment-control-inbound-traffic.md)