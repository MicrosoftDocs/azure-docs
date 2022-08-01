---
title: Using Application Gateway WAF to protect your application
description: How to add Web Application Firewall protection for apps published with Azure Active Directory Application Proxy.
services: active-directory
author: erjosito
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 07/22/2022
ms.author: erjosito
ms.reviewer: ashishj
---


# Using Application Gateway WAF to protect your application

When using Azure Active Directory (Azure AD) Application Proxy to expose applications deployed on-premises, on sealed Azure Virtual Networks, or in other public clouds, you can integrate a Web Application Firewall (WAF) in the data flow in order to protect your application from malicious attacks.

## What is Azure Web Application Firewall?

Azure Web Application Firewall (WAF) on Azure Application Gateway provides centralized protection of your web applications from common exploits and vulnerabilities. Web applications are increasingly targeted by malicious attacks that exploit commonly known vulnerabilities. SQL injection and cross-site scripting are among the most common attacks. For more information about Azure WAF on Application Gateway, see [What is Azure Web Application Firewall on Azure Application Gateway?][waf-overview].

## Deployment steps


This article guides you through the steps to securely expose a web application on the Internet, by integrating the Azure AD Application Proxy with Azure WAF on Application Gateway. In this guide we'll be using the Azure portal. The reference architecture for this deployment is represented below.   



1. [Add an application for remote access through Application Proxy in Azure Active Directory][appproxy-create], ideally with the connectors in an Azure VNet (not strictly required, but it will improve latency)
1. [Create an Azure Application Gateway with WAF enabled][waf-create] in prevention mode
1. Configure Azure Application Gateway to send traffic to your internal application
  1.1. Create frontend
  1.1. Create backend
  1.1. Create rule
1. Configure your AAD application to use an FQDN that the connector will resolve to the private IP address of Application Gateway

## Verification

You can send an attack like for example `https://api-appgw.fabrikam.one/api/sqlquery?query=x%22%20or%201%3D1%20--`. `x%22%20or%201%3D1%20--` is the HTTP-encoded representation for `x" or 1=1 --`, a basic SQL injection signature, and Azure WAF will drop that request.

## Next steps

Configure custom WAF rules?

[waf-overview]: /azure/web-application-firewall/ag/ag-overview
[waf-create]: /azure/web-application-firewall/ag/application-gateway-web-application-firewall-portal
[appproxy-create]: /azure/active-directory/app-proxy/application-proxy-add-on-premises-application
