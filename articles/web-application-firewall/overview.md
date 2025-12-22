---
title: Introduction to Azure Web Application Firewall 
description: This article provides an overview of the Azure Web Application Firewall service.
services: web-application-firewall
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.date: 11/10/2025
ms.topic: overview
# Customer intent: "As a web application administrator, I want to implement a centralized web application firewall so that I can efficiently protect my web applications from common vulnerabilities and security threats."
---

# What is Azure Web Application Firewall?

Azure Web Application Firewall provides centralized protection of your web applications from common exploits and vulnerabilities. Web applications increasingly encounter malicious attacks that exploit commonly known vulnerabilities. SQL injection and cross-site scripting are among the most common attacks.

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=b23e4db1-5007-4f42-ae55-3a564a4ab7d3]

![Diagram that shows Azure Web Application Firewall blocking certain types of access to network resources.](media/overview/wafoverview.png)

Preventing such attacks in application code is challenging. It can require rigorous maintenance, patching, and monitoring at multiple layers of the application topology. A centralized web application firewall (WAF) helps make security management simpler. A WAF also gives application administrators better assurance of protection against threats and intrusions.

A WAF solution can react to a security threat faster by centrally patching a known vulnerability, instead of securing each individual web application.

> [!NOTE]
> Azure Web Application Firewall is one of the services in the category of network security for Azure. Other services in this category include [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md) and [Azure Firewall](../firewall/overview.md). Each service has its own unique features and use cases. For more information on this service category, see [What is Azure network security?](../networking/security/network-security.md).

## Supported services

Azure Web Application Firewall can be deployed with these Microsoft services:

- Azure Application Gateway
- Azure Application Gateway for Containers
- Azure Front Door
- Azure Content Delivery Network

Azure Web Application Firewall on Azure Content Delivery Network is currently in preview. Azure Web Application Firewall has features that are customized for each specific service.

## Related content

- [What is Azure Web Application Firewall on Azure Application Gateway?](./ag/ag-overview.md)
- [Azure Web Application Firewall on Azure Application Gateway for Containers?](/azure/application-gateway/for-containers/web-application-firewall)
- [Azure Web Application Firewall on Azure Front Door](./afds/afds-overview.md)
- [Azure Web Application Firewall on Azure Content Delivery Network](./cdn/cdn-overview.md)
- [Introduction to Azure Web Application Firewall](/training/modules/introduction-azure-web-application-firewall/) (training module)
- [Azure network security documentation](../networking/security/index.yml)
