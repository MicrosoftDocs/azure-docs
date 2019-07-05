---
title: Integrate logs from Azure resources with your SIEM systems | Microsoft Docs
description: Learn about Azure Log Integration, its key capabilities, and how it works.
services: security
documentationcenter: na
author: TomShinder
manager: barbkess
editor: TerryLanfear

ms.assetid: 9c1346e1-baf8-4975-b2f2-42ae05b2dc0a
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/28/2019
ms.author: TomSh
ms.custom: azlog

---
# Introduction to Azure Log Integration

>[!IMPORTANT]
> The Azure Log integration feature will be deprecated by 06/15/2019. AzLog downloads were disabled on Jun 27, 2018. For guidance on what to do moving forward review the post [Use Azure monitor to integrate with SIEM tools](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/) 

Azure Log Integration was made available to simplify the task of integrating Azure logs with your on-premises Security Information and Event Management (SIEM) system.

 The recommended method for integrating Azure logs is to use your SIEM vendor's connectors. Azure Monitor provides the ability to stream the logs into event hubs, and SIEM vendors can write connectors to further integrate logs from the event hub into the SIEM.  For a description of how this works, follow the instructions in [Monitor stream monitoring for data event hubs](../azure-monitor/platform/stream-monitoring-data-event-hubs.md). The article also lists the SIEMs for which direct Azure connectors are already available.  

> [!IMPORTANT]
> If your primary interest is collecting virtual machine logs, most SIEM vendors include this option in their solution. Using the SIEM vendor's connector is always the preferred alternative.

The documentation on the Azure Log Integration feature is still being maintained until the feature is deprecated.

Read further to learn more about the Azure Log Integration feature:

Azure Log Integration collects Windows events from Windows Event Viewer logs, [Azure activity logs](../azure-monitor/platform/activity-logs-overview.md), [Azure Security Center alerts](../security-center/security-center-intro.md), and [Azure Diagnostics logs](../azure-monitor/platform/diagnostic-logs-overview.md) from Azure resources. Integration helps your SIEM solution provide a unified dashboard for all your assets, whether on-premises or in the cloud. You can use a dashboard to receive, aggregate, correlate, and analyze alerts for security events.

> [!NOTE]
> Currently, Azure Log Integration supports only Azure commercial and Azure Government clouds. Other clouds are not supported.

![The Azure Log Integration process][1]

## What logs can I integrate?

Azure produces extensive logging for each Azure service. The logs represent three log types:

* **Control/management logs**: Provide visibility into the [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) CREATE, UPDATE, and DELETE operations. An Azure activity log is an example of this type of log.
* **Data plane logs**: Provide visibility into events that are raised when you use an Azure resource. An example of this type of log is the Windows Event Viewer's **System**, **Security**, and **Application** channels in a Windows virtual machine. Another example is Azure Diagnostics logging, which you configure through Azure Monitor.
* **Processed events**: Provide analyzed event and alert information that are processed for you. An example of this type of event is Azure Security Center alerts. Azure Security Center processes and analyzes your subscription to provide alerts that are relevant to your current security posture.

Azure Log Integration supports ArcSight, QRadar, and Splunk. Check with your SIEM vendor to assess whether the vendor has a native connector. Don't use Azure Log Integration if a native connector is available.

If no other options are available, consider using Azure Log Integration. The following table includes our recommendations:

|SIEM | Customer already uses the Azure log integrator | Customer is investigating SIEM integration options|
|---------|--------------------------|-------------------------------------------|
|**Splunk** | Begin migrating to the [Azure Monitor add-on for Splunk](https://splunkbase.splunk.com/app/3534/). | Use the [Splunk connector](https://splunkbase.splunk.com/app/3534/). |
|**QRadar** | Migrate to or begin using the QRadar connector that's documented in the last section of [Stream Azure monitoring data to an event hub for consumption by an external tool](../azure-monitor/platform/stream-monitoring-data-event-hubs.md). | Use the QRadar connector that's documented in the last section of [Stream Azure monitoring data to an event hub for consumption by an external tool](../azure-monitor/platform/stream-monitoring-data-event-hubs.md). |
|**ArcSight** | Continue to use the Azure log integrator until a connector is available, and then migrate to the connector-based solution.  | Consider using Azure Monitor logs as an alternative. Don't onboard to Azure Log Integration unless you are willing to go through the migration process when the connector becomes available. |

> [!NOTE]
> Although Azure Log Integration is a free solution, there are Azure storage costs associated with log file information storage.

If you need assistance, you can create a [support request](../azure-supportability/how-to-create-azure-support-request.md). For the service, select **Log Integration**.

## Next steps

This article introduced you to Azure Log Integration. To learn more about Azure Log Integration and the types of logs that are supported, see the following articles:

* [Get started with Azure Log Integration](security-azure-log-integration-get-started.md). This tutorial walks you through the installation of Azure Log Integration. It also describes how to integrate logs from Windows Azure Diagnostics (WAD) storage, Azure activity logs, Azure Security Center alerts, and Azure Active Directory audit logs.
* [Azure Log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md). This FAQ answers common questions about Azure Log Integration.
* Learn more about how to [stream Azure monitoring data to an event hub for consumption by an external tool](../azure-monitor/platform/stream-monitoring-data-event-hubs.md).

<!--Image references-->
[1]: ./media/security-azure-log-integration-overview/azure-log-integration.png
