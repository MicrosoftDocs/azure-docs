---
title: Security Alerts in Azure Security Center | Microsoft Docs
description: This topic explains what are security alerts and the different types available in Azure Security Center.
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
* [Integration with Azure Security Products](security-center-alerts-integration.md)

## What are alert incidents?

A security incident is a collection of related alerts, instead of listing each alert individually. Security Center uses [Cloud Smart Alert Correlation](security-center-alerts-cloud-smart.md) to correlate different alerts and low fidelity signals into security incidents.

Using incidents, Security Center provides you with a single view of an attack campaign and all of the related alerts. This view enables you to quickly understand what actions the attacker took and what resources were impacted. For more information, see [Cloud Smart Alert Correlation](security-center-alerts-cloud-smart.md).


## Alert severities <a name="alert-severities"> </a>

-	**High**: There is a high probability that your resource is compromised. 
You should look into it right away. Security Center has high confidence in both the malicious intent and in the findings used to issue the alert. For example, an alert that detects the execution of a known malicious tool such as Mimikatz, a common tool used for credential theft. 
-	**Medium**: This is probably a suspicious activity that may indicate that a resource is compromised.
Security Center’s confidence in the analytic or finding is medium and the confidence of the malicious intent is medium to high. These would usually be machine learning or anomaly-based detections. For example, a sign-in attempt from an anomalous location.
-	**Low**: This might be a benign positive or a blocked attack. 
    - Security Center is not confident enough that the intent is malicious and the activity may be innocent. For example, log clear is an action that may happen when an attacker tries to hide their tracks, but in many cases is a routine operation performed by admins.
    - Security Center doesn’t usually tell you when attacks were blocked, unless it’s an interesting case that we suggest you look into. 
-	**Informational**: You will only see informational alerts when you drill down into a security incident, or if you use the REST API with a specific alert ID. An incident is typically made up of a number of alerts, some of which may appear on their own to be only informational, but in the context of the other alerts may be worthy of a closer look.  

> [!NOTE]
> If you are using the **2015-06-01-preview** API version, then there are differences in which alarm severity types are applied to which scenarios, from what is listed above.  

## Understand alert details <a name="alert-details"> </a>

he definition for each column is given below:

* **Description**: A brief explanation of the alert.
* **Count**: A list of all alerts of this specific type that were detected on a specific day.
* **Detected by**: The service that was responsible for triggering the alert.
* **Environment**: The environment where the alert occurred.
* **Date**: The date that the event occurred.
* **State**: The current state for that alert. There are two types of states:
  * **Active**: The security alert has been detected.
  * **Dismissed**: The security alert has been dismissed by the user. This status is typically used for alerts that were investigated and either mitigated or found not to be an actual attack.
* **Severity**: The severity level, which can be high, medium, or low.

> [!NOTE]
> Security alerts generated by Security Center will also appear under Azure Activity Log. For more information about how to access Azure Activity Log, read [View activity logs to audit actions on resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit).


## Get started with alerts

See the following topics, to understand more about the resources monitored by ASC, and for guidelines on how to respond to the alerts presented by ASC.

* To see which platforms and features are protected by ASC, see [Platforms and features supported by Azure Security Center](security-center-os-coverage.md).  
* To understand what are security incidents and how ASC responds to them, see [How to handle Security Incidents in Azure Security Center](security-center-incident.md). 
* To learn how to manage the alerts you receive, see [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md).
* For information on to how validate that Security Center is properly configured and to stimulate a test alert, see [Alerts Validation in Azure Security Center](security-center-alert-validation.md).  


## Upgrade to Standard for advanced detections

To set up advanced detections, upgrade to Azure Security Center Standard. 

1. From the Security Center menu, select **Security Policy**.
2. For the subscriptions you would like to move to Standard tier, click **Edit settings**. 
3. From the Settings page, select **Pricing Tier**. 
   A free trial is available for a month. To learn more see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/). 

## Next steps

In this article, you learned what are security alerts and the different types of alerts available in Security Center. For more information, see the following topics:

* [Azure Security Center planning and operations guide](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)
* [Azure Security Center FAQ](https://docs.microsoft.com/azure/security-center/security-center-faq): Find frequently asked questions about using the service.

