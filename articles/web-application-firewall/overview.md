---
title: Introduction to Azure Web Application Firewall 
description: This article provides an overview of Azure Web Application Firewall (WAF)
services: web-application-firewall
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.date: 01/14/2025
ms.topic: overview
# Customer intent: "As a web application administrator, I want to implement a centralized web application firewall, so that I can efficiently protect my web applications from common vulnerabilities and security threats."
---

# What is Azure Web Application Firewall?

Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and vulnerabilities. Web applications increasingly encounter malicious attacks that exploit commonly known vulnerabilities. SQL injection and cross-site scripting are among the most common attacks.

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=b23e4db1-5007-4f42-ae55-3a564a4ab7d3]

![WAF overview](media/overview/wafoverview.png)

Preventing such attacks in application code is challenging. It can require rigorous maintenance, patching, and monitoring at multiple layers of the application topology. A centralized web application firewall helps make security management simpler. A WAF also gives application administrators better assurance of protection against threats and intrusions.

A WAF solution can  react to a security threat faster by centrally patching a known vulnerability, instead of securing each individual web application.

> [!NOTE]
> Azure Web Application Firewall is one of the services that make up the Network Security category in Azure. Other services in this category include [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md) and [Azure Firewall](../firewall/overview.md). Each service has its own unique features and use cases. For more information on this service category, see [Network Security](../networking/security/network-security.md).

## Supported service

WAF can be deployed with Azure Application Gateway, Application Gateway for Containers, Azure Front Door, and Azure Content Delivery Network (CDN) service from Microsoft. WAF on Azure CDN and Application Gateway for Containers are currently in public preview. WAF has features that are customized for each specific service. For more information about WAF features for each service, see the overview for each service.

## Next steps

- For more information about Web Application Firewall on Application Gateway, see [Web Application Firewall on Azure Application Gateway](./ag/ag-overview.md).
- For more information about Web Application Firewall on Azure Front Door Service, see [Web Application Firewall on Azure Front Door Service](./afds/afds-overview.md).
- For more information about Web Application Firewall on Azure CDN Service, see [Web Application Firewall on Azure CDN Service](./cdn/cdn-overview.md)
- To learn more about Web Application Firewall, see [Learn module: Introduction to Azure Web Application Firewall](/training/modules/introduction-azure-web-application-firewall/).
- [Learn more about Azure network security](../networking/security/index.yml)
