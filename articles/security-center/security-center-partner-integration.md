---
title: Partner Integration in Azure Security Center | Microsoft Docs
description: This document explains how Azure Security Center integrates with partners to enhance overall security of your Azure resources.
services: security-center
documentationcenter: na
author: YuriDio
manager: swadhwa
editor: ''

ms.assetid: 6af354da-f27a-467a-8b7e-6cbcf70fdbcb
ms.service: security-center
ms.topic: hero-article
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/28/2016
ms.author: yurid

---
# Partner Integration in Azure Security Center
This document explains how Azure Security Center integrates with partners to enhance overall security and provide an integrated experience in Azure, while taking advantage of the Azure Marketplace for partner certification and billing.

## Why deploy partner’s solutions from Security Center?

The four main reasons to leverage the partner integration in Security Center are:

- **Ease of deployment**: Deploying a partner solution by following the Security Center recommendation is much easier. The deployment process can be fully automated using a default configuration and network topology, or customers can choose a semi-automated option to allow more flexibility and customization of the configuration.
- **Integrated Detections**: Security events from partner solutions are automatically collected, aggregated and displayed as part of Security Center alerts and incidents. These events are also fused with detections from other sources to provide advanced threat detection capabilities.
- **Unified Health Monitoring and Management**: Integrated health events allow customers to monitor all partner solutions at a glance. Basic management is available with easy access to advanced configuration using the partner solution.
- **Export to SIEM**: Customers can now export all Security Center and partners’ alerts in CEF format to on-premise SIEM systems using Microsoft Azure Log Integration (preview)


## What partners are integrated with Security Center?
Security Center currently integrates with the following partners:

- Endpoint Protection (Trend Micro), 
- Web Application Firewall (Barracuda, F5, Imperva and soon Microsoft WAF and Fortinet), 
- Next Generation Firewall (Check Point, Barracuda and soon Fortinet and Cisco) solutions. 
- Vulnerability Assessment (Qualys - preview) solutions. 

Over time, Security Center will expand the number of partners within these existing categories and add new categories. 

## How to deploy a partner solution?

Partner’s solutions that were already deployed in Security Center can be easily accessed from the Partner solution tile in the main Security Center dashboard:

![Partner Integration](./media/security-center-partner-integration/security-center-partner-integration-fig1.png)

To deploy a new partner solution based on a Security Center recommendation, execute the following steps:

> [!NOTE]
> The steps in the following example  assume you have a workload you’d like to protect with a web application firewall.

1. On the Security Center dashboard, click **Recommendations** tile.
2. On the **Recommendations** blade, click **Add web application firewall**.
3. Click the application name under the **Add a web application firewall** blade.
4. On the **Add a Web Application Firewall** blade, click **Create New**.
5. The **Create a new Web Application Firewall** blade shows a list of the current partners that are offering web application firewall capability.
6. Select the appropriate partner solution and follow the steps (which may vary according to the partner).

The overall deployment experience at this point can vary according to the partner. For more information about managing partner solutions in Security Center, read [Monitoring partner solutions](security-center-partner-solutions.md) with Azure Security Center.

## See also
In this document, you learned how to integrate partner's solution in Azure Security Center. To learn more about Security Center, see the following:

* [Azure Security Center Planning and Operations Guide](security-center-planning-and-operations-guide.md)
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)
* [Security Alerts by Type in Azure Security Center](security-center-alerts-type.md)
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance.
