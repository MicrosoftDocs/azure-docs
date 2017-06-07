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
ms.date: 06/01/2017
ms.author: TomSh
ms.custom: azlog


---
# Introduction to Microsoft Azure log integration
Learn about Azure log integration, its key capabilities, and how it works.

## Overview

Azure log integration is a free solution that enables you to integrate raw logs from your Azure resources into your on-premises Security Information and Event Management (SIEM) systems.

Azure log integration collects Windows events from Windows Event Viewer Channels, [Azure Activity Logs](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md), [Azure Security Center alerts](../security-center/security-center-intro.md) and [Azure Diagnostic logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) from Azure resources. This integration helps your SIEM solution provide a unified dashboard for all your assets, on-premises or in the cloud, so that you can aggregate, correlate, analyze, and alert for security events.

>[!NOTE]
At this time the only supported clouds are Azure commercial and Azure government. Other clouds are not supported at this time.

![Azure log integration][1]

## What logs can I integrate?
Azure produces extensive logging for every Azure service. These logs represent three types of logs:

* **Control/management logs** provide visibility into the [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) CREATE, UPDATE, and DELETE operations. Azure Activity Logs is an example of this type of log.
* **Data plane logs** provide visibility into the events raised as part of the usage of an Azure resource. An example of this type of log is the Windows Event Viewer's **System**, **Security**, and **Application** channels in a Windows virtual machine. Another example is  Diagnostics Logging configured through Azure Monitor
* **Processed events** provide analyzed event and alert information processed on your behalf. An example of this type of event is Azure Security Center Alerts, where Azure Security Center has processed and analyzed your subscription to provide alerts relevant to your current security posture.

Azure log integration currently supports integration of Azure Activity Logs, Windows Event logs from Windows virtual machines in your Azure subscription, Azure Security Center alerts, Azure Diagnostic logs, and Azure Active Directory audit logs.

>[!NOTE]
While Azure Log Integration is a free solution there will be Azure storage costs resulting from the log file information storage.

The following table explains the Log category and SIEM integration detail

| Log type  |Log analytics supporting JSON (Splunk, ELK)| ArcSight  | QRadar  |   
|---|---|---|---|
|  AAD Audit logs |  Yes | Requires the creation of a FlexConnector JSON parser file. Please refer to the ArcSight documentation for more information  |  You must create a Log Source Extension. Please refer to the QRadar documentation for more information. |  
| Activity Logs  | Yes  |  FlexConnector JSON parser file available in the download center along with Azure log integration download |  [QRadar DSM](https://www.ibm.com/support/knowledgecenter/SSKMKU/com.ibm.dsm.doc/c_dsm_guide_microsoft_azure_overview.html)(send over Syslog) |  
| ASC Alerts  | Yes  |  Requires the creation of a FlexConnector JSON parser file. Please refer to the ArcSight documentation for more information. | [QRadar DSM](https://www.ibm.com/support/knowledgecenter/SSKMKU/com.ibm.dsm.doc/c_dsm_guide_microsoft_azure_overview.html) (send over Syslog)   |   
| Diagnostics Logs (resource logs) | Yes | Needs end user to create FlexConnector JSON parser file. Please refer to ArcSight documentation on how to do that. | You must create a Log Source Extension. Please refer to the QRadar documentation for more information |
| VM logs | Yes via Forwarded events and not thru JSON | Yes via Forwarded events | Yes via Forwarded events |

For additional information on supported log types please visit the [FAQ](security-azure-log-integration-faq.md)


Community assistance is available through the [Azure Log Integration MSDN Forum](https://social.msdn.microsoft.com/Forums/office/home?forum=AzureLogIntegration). The forum provides the AzLog community the ability support each other with questions, answers, tips, and tricks on how to get the most out of Azure Log Integration. In addition, the Azure Log Integration team monitors this forum and will help whenever we can.

You can also open a [support request](../azure-supportability/how-to-create-azure-support-request.md). To do this, select **Log Integration** as the service for which you are requesting support.

## Next steps
In this document, you were introduced to Azure log integration. To learn more about Azure log integration and the types of logs supported, see the following:

* [Microsoft Azure Log Integration](https://www.microsoft.com/download/details.aspx?id=53324) – Download Center for details, system requirements, and install instructions on Azure log integration.
* [Get started with Azure log integration](security-azure-log-integration-get-started.md) - This tutorial walks you through installation of Azure log integration and integrating logs from Azure WAD storage, Azure Activity Logs, Azure Security Center alerts and Azure Active Directory audit logs.
* [Partner configuration steps](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/) – This blog post shows you how to configure Azure log integration to work with partner solutions Splunk, HP ArcSight, and IBM QRadar.
* [Activity and ASC alerts over syslog to QRadar](https://blogs.msdn.microsoft.com/azuresecurity/2016/09/24/integrate-azure-logs-to-qradar/) – This blog post provides the steps to send Activity and Azure Security Center alerts over syslog to QRadar
* [Azure log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md) - This FAQ answers questions about Azure log integration.
* [Integrating Security Center alerts with Azure log Integration](../security-center/security-center-integrating-alerts-with-log-integration.md) – This document shows you how to sync Azure Security Center alerts with Azure Log Integration.

<!--Image references-->
[1]: ./media/security-azure-log-integration-overview/azure-log-integration.png
