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
ms.date: 02/15/2018
ms.author: TomSh
ms.custom: azlog

---
# Introduction to Microsoft Azure log integration

Azure log integration enables you to integrate raw logs from your Azure resources with your on-premises Security Information and Event Management (SIEM) systems in the event that a connector to [Azure Monitor](../monitoring-and-diagnostics/monitoring-get-started.md) is not yet available from your SIEM vendor.

The preferred method for integrating Azure logs is by using your SIEM vendor’s Azure Monitor connector and following these [instructions](../monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs.md). However, if your SIEM vendor doesn’t provide a connector to Azure Monitor, you may be able to use Azure Log Integration as a temporary solution (if your SIEM is supported by Azure Log Integration) until such a connector is available.

>[!IMPORTANT]
>If your primary interest is in collecting virtual machine logs, most SIEM vendors include this in their solution. Using the SIEM vendor's connector should always be the preferred alternative.

Azure log integration collects Windows events from Windows Event Viewer logs, [Azure Activity Logs](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md), [Azure Security Center alerts](../security-center/security-center-intro.md), and [Azure Diagnostic logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) from Azure resources. This integration helps your SIEM solution provide a unified dashboard for all your assets, on-premises or in the cloud, so that you can aggregate, correlate, analyze, and alert for security events.

>[!NOTE]
At this time, the only supported clouds are Azure commercial and Azure Government. Other clouds are not supported.

![Azure log integration][1]

## What logs can I integrate?

Azure produces extensive logging for every Azure service. These logs represent three types of logs:

* **Control/management logs** provide visibility into the [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) CREATE, UPDATE, and DELETE operations. Azure Activity Logs is an example of this type of log.
* **Data plane logs** provide visibility into the events raised as part of the usage of an Azure resource. An example of this type of log is the Windows Event Viewer's **System**, **Security**, and **Application** channels in a Windows virtual machine. Another example is  Diagnostics Logging configured through Azure Monitor
* **Processed events** provide analyzed event and alert information processed on your behalf. An example of this type of event is Azure Security Center Alerts, where Azure Security Center has processed and analyzed your subscription to provide alerts relevant to your current security posture.

Azure Log Integration supports ArcSight, QRadar, and Splunk. In all circumstances, check with your SIEM vendor to assess whether they have a native connector. You should not use Azure Log Integration when native connectors are available.

If there are no other options available, Azure Log Integration may be considered. The following table includes our recommendations.

|**SIEM** | **Customer already using log integrator** | **Customer investigating SIEM integration options**|
|---------|--------------------------|-------------------------------------------|
|**SPLUNK** | Begin migrating to the [Azure monitor add-on for Splunk](https://splunkbase.splunk.com/app/3534/) | Use [SPLUNK connector](https://splunkbase.splunk.com/app/3534/) |
|**IBM QRADAR** | Migrate to or begin using the QRadar connector documented at the end of http://aka.ms/azmoneventhub | Use the QRadar connector documented at the end of http://aka.ms/azmoneventhub  |
|**ARCSIGHT** | Continue to use the Log Integrator until a connector is available, then migrate to the connector-based solution.  | Consider Azure Log Analytics as an alternative. Do not onboard to Azure Log Integration unless you are willing to go through the migration process when the connector becomes available. |

>[!NOTE]
>While Azure Log Integration is a free solution, there are Azure storage costs resulting from the log file information storage.

If you need assistance you can open a [support request](../azure-supportability/how-to-create-azure-support-request.md). To do this, select **Log Integration** as the service for which you are requesting support.

## Next steps

In this document, you were introduced to Azure log integration. To learn more about Azure log integration and the types of logs supported, see the following:

* [Get started with Azure log integration](security-azure-log-integration-get-started.md) - This tutorial walks you through installation of Azure log integration and integrating logs from Azure WAD storage, Azure Activity Logs, Azure Security Center alerts and Azure Active Directory audit logs.
* [Azure log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md) - This FAQ answers questions about Azure log integration.
* [Stream Azure monitoring data to an event hub for consumption by an external tool](../monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs.md)

<!--Image references-->
[1]: ./media/security-azure-log-integration-overview/azure-log-integration.png
