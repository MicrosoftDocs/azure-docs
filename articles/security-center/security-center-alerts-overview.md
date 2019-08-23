---
title: Security alerts in Azure Security Center | Microsoft Docs
description: This topic explains what security alerts are, and the different types available in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''
ms.assetid: 1b71e8ad-3bd8-4475-b735-79ca9963b823
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 8/20/2019
ms.author: v-mohabe
---
# Security alerts in Azure Security Center

In Azure Security Center, there are a variety of alerts for the many different resource types. Security Center generates alerts for resources deployed on Azure, and also for resources deployed on on-premises and hybrid cloud environments. 

## What are security alerts?

Alerts are the notifications that Security Center generates when it detects threats on your resources. It prioritizes and lists the alerts, along with the information needed for you to quickly investigate the problem. Security Center also provides recommendations for how you can remediate an attack.

## How does Security Center detect threats?

To detect real threats and reduce false positives, Security Center collects, analyzes, and integrates log data from your Azure resources and the network. It also works with connected partner solutions, like firewall and endpoint protection solutions. Security Center analyzes this information, often correlating information from multiple sources, to identify threats.

Security Center monitors the resources in whatever environment they might be. To learn more about detecting and responding to threats, see [How Security Center detects and responds to threats](security-center-detection-capabilities.md#asc-detects).

## Security alert types

The following topics guide you through the different alerts, according to resource types:

* [IaaS VMs and servers alerts](security-center-alerts-iaas.md)
* [Native compute alerts](security-center-alerts-compute.md)
* [Data services alerts](security-center-alerts-data-services.md)

The following topics explain how Security Center uses the different telemetry that it collects from integrating with the Azure infrastructure, in order to apply additional protection layers for resources deployed on Azure:

* [Service layer alerts](security-center-alerts-service-layer.md)
* [Integration with Azure security products](security-center-alerts-integration.md)

## What are security incidents?

A security incident is a collection of related alerts, instead of listing each alert individually. Security Center uses [Cloud Smart Alert Correlation](security-center-alerts-cloud-smart.md) to correlate different alerts and low fidelity signals into security incidents.

Using incidents, Security Center provides you with a single view of an attack campaign and all of the related alerts. This view enables you to quickly understand what actions the attacker took, and what resources were affected. For more information, see [Cloud smart alert correlation](security-center-alerts-cloud-smart.md).

## Get started with alerts

Here are articles that help you understand more about the resources monitored by Security Center, and provide guidelines on how to respond to the alerts presented.

* [Platforms and features supported by Azure Security Center](security-center-os-coverage.md)  
* [How to handle Security Incidents in Azure Security Center](security-center-incident.md) 
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md)
* [Alerts Validation in Azure Security Center](security-center-alert-validation.md)  


## Upgrade to Standard for advanced detections

To set up advanced detections, upgrade to Azure Security Center Standard. 

1. From the **Security Center** menu, select **Security Policy**.
2. For the subscriptions you'd like to move to Standard tier, select **Edit settings**. 
3. From the Settings page, select **Pricing Tier**. 
   A free trial is available for a month. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/). 

## Next steps

In this article, you learned about the different types of alerts available in Security Center. For more information, see:

* [Azure Security Center planning and operations guide](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)
* [Azure Security Center FAQ](https://docs.microsoft.com/azure/security-center/security-center-faq)

