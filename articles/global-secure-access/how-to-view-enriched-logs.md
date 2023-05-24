---
title: How to use enriched Office 365 logs
description: Learn how to use enriched Office 365 logs for Global Secure Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 05/15/2023
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
* To archive logs, you need an **[Azure storage account](../storage/common/storage-account-create.md)** that you have `ListKeys` permissions for

## What the logs provide

The *enriched Office 365 logs* provide information about Microsoft 365 workloads, so you can review network diagnostic data, performance data, and security events relevant to Microsoft 365 apps. For example, if access to Microsoft 365 is blocked for a user in your organization, you need visibility into how the user's device is connecting to your network.

These logs are a subset of the logs available in the [Microsoft 365 audit log](/microsoft-365/compliance/search-the-audit-log-in-security-and-compliance?view=0365-worldwide&preserve-view=true). The logs are enriched with additional information, such as the user's IP address, device name, and device type. The logs are also enriched with information about the Microsoft 365 app, such as the app name, app ID, and app version.

## How to export the logs

Before you can stream logs to a SIEM tool, you need to create an Azure event hub and event hub namespace. For more information, see [Set up an Event Hubs namespace and an event hub](../event-hubs/event-hubs-create.md).

Once the event hub is created, you configure Diagnostic settings to select the logs you want to route to the event hub. The logs are then routed through the event hub to your SIEM tool of choice. Learn how to [stream your activity logs to an event hub](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md).

If you need long-term storage for your logs and you don't plan on querying them often, you can archive the logs to an Azure storage account. Learn how to [archive your activity logs to a storage account](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md).

At this time, streaming logs directly to a Log Analytics workspace is not available. You can stream the logs to an event hub and then ingest the logs into a Log Analytics workspace using Logic Apps.

**To stream activity logs to an event hub**:

1. Navigate to the [Azure portal](https://portal.azure.com) using one of the required roles.
1. Go to **Azure AD** > **Diagnostic settings**.
1. Choose the logs you want to stream, select the **Stream to an event hub** option, and complete the fields.
    - [Set up an Event Hubs namespace and an event hub](../event-hubs/event-hubs-create.md)

Your independent security vendor should provide you with instructions on how to ingest data from Azure Event Hubs into their tool.

**To archive activity logs to a storage account**:

1. Navigate to the [Azure portal](https://portal.azure.com) using one of the required roles.
1. Create a storage account.
1. Go to **Azure AD** > **Diagnostic settings**.
1. Choose the logs you want to stream, select the **Archive to a storage account** option, and complete the fields.
    - [Review the data retention policies](../active-directory/reports-monitoring/reference-reports-data-retention.md)

## Next steps

- [Learn about Global Secure Access audit logs](how-to-access-audit-logs.md)
