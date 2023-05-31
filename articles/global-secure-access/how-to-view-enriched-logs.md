---
title: How to use enriched Office 365 logs
description: Learn how to use enriched Office 365 logs for Global Secure Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 05/31/2023
ms.service: network-access
ms.custom: 
---

# How to use the Global Secure Access enriched Office 365 logs

With your Microsoft 365 traffic flowing through the Microsoft Entra Private Access service, you want to gain insights into the performance, experience, and availability of the Microsoft 365 apps your organization uses. The *enriched Office 365 logs* provide you with the information you need to gain these insights. You can integrate the logs with a third-party security information and event management (SIEM) tool for further analysis. This article describes how to use the *enriched Office 365 logs* to gain insights into your Microsoft 365 traffic.

## Prerequisites
To use this feature, you need the following roles, subscriptions, and resources:

* An Azure subscription. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* An Azure AD Premium P1 or P2 tenant. 
* **Global Administrator** or **Security Administrator** access for the Azure AD tenant.
* To integrate with SIEM tools, you need an **Azure Event Hubs namespace**
* To archive logs, you need an **[Azure storage account](../storage/common/storage-account-create.md)** that you have `ListKeys` permissions for.

## What the logs provide

The *enriched Office 365 logs* provide information about Microsoft 365 workloads, so you can review network diagnostic data, performance data, and security events relevant to Microsoft 365 apps. For example, if access to Microsoft 365 is blocked for a user in your organization, you need visibility into how the user's device is connecting to your network.

These logs provide:
- Improved latency and predictability
- Additional information added to original logs
- Accurate IP address

These logs are a subset of the logs available in the [Microsoft 365 audit log](/microsoft-365/compliance/search-the-audit-log-in-security-and-compliance?view=0365-worldwide&preserve-view=true). The logs are enriched with additional information, such as the user's IP address, device name, and device type. The enriched logs also contain information about the Microsoft 365 app, such as the app name, app ID, and app version.

## How to export the logs

To view the enriched Office 365 logs, you must export or stream the log to an endpoint, such as a SIEM tool. Before you can stream logs to a SIEM tool, you need to create an Azure event hub and event hub namespace. For more information, see [Set up an Event Hubs namespace and an event hub](../event-hubs/event-hubs-create.md).

Once the event hub is created, you configure Diagnostic settings to select the logs you want to route to the event hub. The logs are then routed through the event hub to your SIEM tool of choice. Learn how to [stream your activity logs to an event hub](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md).

If you need long-term storage for your logs and you don't plan on querying them often, you can archive the logs to an Azure storage account. Learn how to [archive your activity logs to a storage account](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md).

> [!NOTE]
> At this time, streaming logs directly to a Log Analytics workspace is not available. You can stream the logs to an event hub and then ingest the logs into a Log Analytics workspace using Logic Apps.

1. Navigate to the [Microsoft Entra ID admin center](https://portal.azure.com) using one of the required roles.
1. Go to **Microsoft Entra ID** > **Monitoring and health** > **Diagnostic settings**.
1. Select **Add Diagnostic setting**.
1. Give your diagnostic setting a name.
1. Select `EnrichedOffice365AuditLogs`.
1. Select either **Stream to an event hub** or **Archive to a storage account** option, and complete the fields that appear.
    - To archive to a storage account, provide the number of days to retain the logs and select the appropriate subscription and storage account.
    - To stream to an event hub, select the subscription and event hub details. Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool.

For more information on how to stream logs to an event hub or archive logs to a storage account, see the following articles:

- [Set up an Event Hubs namespace and an event hub](../event-hubs/event-hubs-create.md)
- [Review the data retention policies](../active-directory/reports-monitoring/reference-reports-data-retention.md)  

## Next steps

- [Explore the Global Secure Access logs and monitoring options](concept-global-secure-access-logs-monitoring.md)
- [Learn about Global Secure Access audit logs](how-to-access-audit-logs.md)
