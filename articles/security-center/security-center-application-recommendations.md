---
title: Protecting your applications in Azure Security Center  | Microsoft Docs
description: This document addresses recommendations in Azure Security Center that help you protect your Azure applications and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: b5fc7a9e-24b1-415f-b3b5-62a53f5dd424
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/01/2016
ms.author: terrylan

---
# Protecting your applications in Azure Security Center
Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls.  Recommendations apply to Azure resource types: virtual machines (VMs), networking, SQL, and applications.

This article addresses recommendations that apply to applications.  Application recommendations center around deployment of a web application firewall.  Use the table below as a reference to help you understand the available application recommendations and what each one does if you apply it.

## Available application recommendations
| Recommendation | Description |
| --- | --- |
| [Add a web application firewall](security-center-add-web-application-firewall.md) |Recommends that you deploy a web application firewall (WAF) for web endpoints. A WAF recommendation is shown for any public facing IP (either Instance Level IP or Load Balanced IP) that has an associated network security group with open inbound web ports (80,443).</br></br>Security Center recommends that you provision a WAF to help defend against attacks targeting your web applications on virtual machines and on App Service Environment. An App Service Environment (ASE) is a [Premium](https://azure.microsoft.com/pricing/details/app-service/) service plan option of Azure App Service that provides a fully isolated and dedicated environment for securely running Azure App Service apps. To learn more about ASE, see the [App Service Environment Documentation](../app-service/app-service-app-service-environments-readme.md).</br></br>You can protect multiple web applications in Security Center by adding these applications to your existing WAF deployments. |
| [Finalize application protection](security-center-add-web-application-firewall.md#finalize-application-protection) |To complete the configuration of a WAF, traffic must be rerouted to the WAF appliance. Following this recommendation completes the necessary setup changes. |

## See also
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Protecting your virtual machines in Azure Security Center](security-center-virtual-machine-recommendations.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)
* [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
