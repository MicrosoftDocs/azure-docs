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

With your Microsoft 365 traffic flowing through the Microsoft Entra Private Access service, you want to gain insights into the performance, experience, and availability of the Microsoft 365 apps your organization uses. The enriched Office 365 logs provide you with the information you need to gain these insights. You can integrate the logs with a Log Analytics workspace or third-party SIEM tool for further analysis. This article describes how to use the enriched Office 365 logs to gain insights into your Microsoft 365 traffic.

## Prerequisites
To use this feature, you need:

* An Azure subscription. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* An Azure AD Premium P1 or P2 tenant. 
* **Global Administrator** or **Security Administrator** access for the Azure AD tenant.
* A **Log Analytics workspace** in your Azure subscription. Learn how to [create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).

## What the logs provide

The enriched Office 365 logs provide information about Microsoft 365 workloads, so you can review network diagnostic data, performance data, and security events relevant to Microsoft 365 apps. For example, if access to Microsoft 365 is blocked for a user in your organization, you need visibility into how the user's device is connecting to your network.

These logs are a subset of the logs available in the [Microsoft 365 audit log](/microsoft-365/compliance/search-the-audit-log-in-security-and-compliance?view=0365-worldwide&preserve-view=true). The logs are enriched with additional information, such as the user's IP address, device name, and device type. The logs are also enriched with information about the Microsoft 365 app, such as the app name, app ID, and app version.

## Stream logs to a Log Analytics workspace

To store logs and query the data for further analysis, you can integrate the logs with Azure Monitor logs by sending them to a Log Analytics workspace. Once you have the integration set up, you can use Log Analytics to query the logs.

1. Sign in to the [Azure portal](https://portal.azure.com) as a **Security Administrator** or **Global Administrator**.

1. Go to **Azure Active Directory** > **Diagnostic settings**. You can also select **Export Settings** from the **Audit Logs** in Global Secure Access.

1. Select **+ Add diagnostic setting** to create a new integration or select **Edit setting** for an existing integration.

1. Enter a **Diagnostic setting name**. If you're editing an existing integration, you can't change the name.

1. Select **`EnrichedOffice365AuditLogs`**.

1. Under **Destination Details** select the **Send to Log Analytics workspace** check box. 

1. Select the appropriate **Subscription** and **Log Analytics workspace** from the menus.

1. Select the **Save** button.

## Next steps

- [Learn about Global Secure Access audit logs](how-to-access-audit-logs.md)
