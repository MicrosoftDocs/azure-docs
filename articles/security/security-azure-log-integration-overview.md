---
title: Integrate logs from Azure resources into your SIEM systems | Microsoft Docs
description: Learn about Azure log integration, its key capabilities, and how it works.
services: security
documentationcenter: na
author: TomShinder
manager: MBaldwin
editor: TerryLanfear

ms.assetid: 9c1346e1-baf8-4975-b2f2-42ae05b2dc0a
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/29/2017
ms.author: TomSh

---
# Introduction to Microsoft Azure log integration
Learn about Azure log integration, its key capabilities, and how it works.

## Overview

Azure log integration is a free solution that enables you to integrate raw logs from your Azure resources into your on-premises Security Information and Event Management (SIEM) systems. Azure log integration collects Windows Azure Diagnostics *(WAD)*  from your Windows virtual machines, [Azure Activity Logs](/monitoring-and-diagnostics/monitoring-overview-activity-logs.md), [Azure Security Center alerts](/security-center/security-center-intro.md) and [Azure Diagnostic logs](/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) from azure resources. This integration provides a unified dashboard for all your assets, on-premises or in the cloud, so that you can aggregate, correlate, analyze, and alert for security events.

>[!NOTE]
At this time the only supported clouds are Azure commercial and Azure government. Other clouds are not supported at this time.

![Azure log integration][1]

## What logs can I integrate?
Azure produces extensive logging for every Azure service. These logs are categorized by these main types:

* **Control/management logs**, which gives visibility into the [Azure Resource Manager](/azure-resource-manager/resource-group-overview.md) CREATE, UPDATE, and DELETE operations. Azure Activity Logs is an example of this type of log.
* **Data plane logs**, which gives visibility into the events raised as part of the usage of an Azure resource. Examples of this type of log are the Windows event System, Security, and Application logs in a virtual machine as well as the Diagnostics Logs configured through Azure Monitor
* **Processed events**, which gives analyzed event/alert processed on your behalf.Examples of this type is Azure Security Center Alerts where Azure Security Center has processed and analyzed your subscription and provides very concise security alerts

Azure log integration currently supports integration of Azure Activity Logs, Windows Event log from Windows virtual machine in your Azure subscription, Azure Security Center alerts, Azure Diagnostic logs as well as Azure Active Directory audit logs.

The following table explains the Log category and SIEM integration detail

| Log type  |Log analytics supporting JSON (Splunk, ELK)| ArcSight  | QRadar  |   
|---|---|---|---|
|  AAD Audit logs |  yes | Requires the creation of a FlexConnector JSON parser file. Please refer to the ArcSight documentation for more information  |  You must create a Log Source Extension. Please refer to the QRadar documentation for more information. |  
| Activity Logs  | Yes  |  FlexConnector JSON parser file available in the download center along with Azure log integration download |  [QRadar DSM](https://www.ibm.com/support/knowledgecenter/SSKMKU/com.ibm.dsm.doc/c_dsm_guide_microsoft_azure_overview.html)(send over Syslog) |  
| ASC Alerts  | Yes  |  Requires the creation of a FlexConnector JSON parser file. Please refer to the ArcSight documentation for more information. | [QRadar DSM](https://www.ibm.com/support/knowledgecenter/SSKMKU/com.ibm.dsm.doc/c_dsm_guide_microsoft_azure_overview.html) (send over Syslog)   |   
| Diagnostics Logs (resource logs) | Yes | Needs end user to create FlexConnector JSON parser file. Please refer to ArcSight documentation on how to do that. | You must create a Log Source Extension. Please refer to the QRadar documentation for more information |
| VM logs | Yes via Forwarded events and not thru JSON | Yes via Forwarded events | Yes via Forwarded events |

>[!NOTE>
While Azure Log Integration is a free solution there will be Azure storage costs resulting from the log file information storage.

If you run into any issues during the installation and configuration, please open a [support request](/azure-supportability/how-to-create-azure-support-request.md), select **Log Integration** as the service for which you are requesting support.

## Next steps
In this document, you were introduced to Azure log integration. To learn more about Azure log integration and the types of logs supported, see the following:

* [Microsoft Azure Log Integration for Azure logs](https://www.microsoft.com/download/details.aspx?id=53324) – Download Center for details, system requirements, and install instructions on Azure log integration.
* [Get started with Azure log integration](security-azure-log-integration-get-started.md) - This tutorial walks you through installation of Azure log integration and integrating logs from Azure WAD storage, Azure Activity Logs, Azure Security Center alerts and Azure Active Directory audit logs.
* [Integrate Diagnostics Logs](https://blogs.msdn.microsoft.com/azuresecurity/2016/09/25/integrate-azure-logs-streamed-to-event-hubs-to-siem/) – This blog post provides the steps for integrating diagnostics logs using Azure log integration
* [Partner configuration steps](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/) – This blog post shows you how to configure Azure log integration to work with partner solutions Splunk, HP ArcSight, and IBM QRadar.
* [Activity and ASC alerts over syslog to QRadar](https://blogs.msdn.microsoft.com/azuresecurity/2016/09/24/integrate-azure-logs-to-qradar/) – This blog post provides the steps to send Activity and Azure Security Center alerts over syslog to QRadar
* [Azure log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md) - This FAQ answers questions about Azure log integration.
* [Integrating Security Center alerts with Azure log Integration](../security-center/security-center-integrating-alerts-with-log-integration.md) – This document shows you how to sync Security Center alerts, along with virtual machine security events collected by Azure Diagnostics and Azure Audit Logs, with your log analytics or SIEM solution.

<!--Image references-->
[1]: ./media/security-azure-log-integration-overview/azure-log-integration.png
