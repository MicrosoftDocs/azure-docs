---
title: Security Alerts in Azure Security Center | Microsoft Docs
description: This article explains the different types of security alerts in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''

ms.assetid: 
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 6/25/2019
ms.author: monhaber

---
# Security Alerts in Azure Security Center

This article presents the different types of security alerts available in Azure Security Center (ASC). There are a variety of alerts for the many different resource types. ASC generates alerts for both resources deployed on Azure, and resources deployed on on-premises and hybrid cloud environments. 

## What are security alerts?

Alerts are the notifications that Security Center generates when it detects threats on your resources. It prioritizes and lists the alerts along with the information needed for you to quickly investigate the problem. Security Center also provides recommendations for how you can remediate an attack.

## How does Security Center detect threats?

To detect real threats and reduce false positives, Security Center collects, analyzes, and integrates log data from your Azure resources, the network, and connected partner solutions, like firewall and endpoint protection solutions. Security Center analyzes this information, often correlating information from multiple sources, to identify threats.

ASC monitors the resources whether deployed on Azure or deployed on other on-premises and hybrid cloud environments. To learn more on detecting and responding to threats, see [How Security Center detects and responds to threats](security-center-detection-capabilities.md#asc-detects).

## Security alert types

The following topics guide you through the different ASC alerts according to resource types:

* [IaaS VMs & Servers alerts](security-center-alerts-iaas.md)
* [Native compute alerts](security-center-alerts-compute.md)
* [Data services alerts](security-center-alerts-data-services.md)

The following topics explain how Security Center leverages the different telemetry that it collects from integrating with the Azure infrastructure in order to apply additional protection layers for resources deployed on Azure:

* [Service layer alerts](security-center-alerts-service-layer.md)
* [Integration with Azure Security Products](security-center-alerts-integration)
* [Cloud Smart Alert Correlation](security-center-alerts-cloud-smart.md)
* [UEBA for Azure resources and users](security-center-ueba-mcas)

## Get started with alerts

See the following topics, to understand more about the resources monitored by ASC, and for guidelines on how to respond to the alerts presented by ASC.

* To see which platforms and features are protected by ASC, see [Platforms and features supported by Azure Security Center](security-center-os-coverage.md).  
* To understand what are security incidents and how ASC responds to them, see [How to handle Security Incidents in Azure Security Center](security-center-incident.md). 
* To learn how to manage the alerts you receive, see [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md).
* For information on to how validate Security Center is properly configured and to stimulate a test alert, see [Alerts Validation in Azure Security Center](security-center-alert-validation.md).  


## Upgrade to Standard for advanced detections

To set up advanced detections, upgrade to Azure Security Center Standard. 

1. From the Security Center menu, select **Security Policy**.
2. For the subscriptions you would like to move to Standard tier, click **Edit settings**. 
3. From the Settings page, select **Pricing Tier**. 
   A free trial is available for a month. To learn more see the [pricing page](https://azure.microsoft.com/en-us/pricing/details/security-center/). 

## Next steps

In this article, you learned about the different types of security alerts in Security Center. For more information, see the following topics:

* [Azure Security Center planning and operations guide](https://docs.microsoft.com/en-us/azure/security-center/security-center-planning-and-operations-guide)
* [Azure Security Center FAQ](https://docs.microsoft.com/en-us/azure/security-center/security-center-faq): Find frequently asked questions about using the service.

