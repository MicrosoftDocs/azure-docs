---
title: Troubleshooting Conditional Access policy changes - Azure Active Directory
description: Diagnose changes to Conditional Access policy with the Azure AD audit logs.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: troubleshooting
ms.date: 10/16/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, martinco

ms.collection: M365-identity-device-management
---
# Troubleshooting Conditional Access policy changes

The Azure Active Directory (Azure AD) audit log is a valuable source of information when troubleshooting why and how Conditional Access policy changes happened in your environment.

Audit log data is only kept for 30 days by default, which may not be long enough for every organization. Organizations can store data for longer periods by changing diagnostic settings in Azure AD to: 

- Send data to a Log Analytics workspace
- Archive data to a storage account
- Stream data to an Event Hub
- Send data to a partner solution
 
Find these options in the **Azure portal** > **Azure Active Directory**, **Diagnostic settings** > **Edit setting**. If you don't have a diagnostic setting, follow the instructions in the article [Create diagnostic settings to send platform logs and metrics to different destinations](../../azure-monitor/essentials/diagnostic-settings.md) to create one. 

## Use the audit log

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Audit logs**.
1. Select the **Date** range you want to query in.
1. Select **Activity** and choose one of the following
   1. **Add conditional access policy** - This activity lists newly created policies
   1. **Update conditional access policy** - This activity lists changed policies
   1. **Delete conditional access policy** - This activity lists deleted policies

## Use Log Analytics

Log Analytics allows organizations to query data using built in queries or custom created Kusto queries, for more information, see [Get started with log queries in Azure Monitor](../../azure-monitor/logs/get-started-queries.md).

Once enabled find access to Log Analytics in the **Azure portal** > **Azure AD** > **Log Analytics**. The table of most interest to Conditional Access administrators is **AuditLogs**.

```kusto
AuditLogs 
| where OperationName == "Update conditional access policy"
```

## Next steps

- [What is Azure Active Directory monitoring?](../reports-monitoring/overview-monitoring.md)
- [Install and use the log analytics views for Azure Active Directory](../reports-monitoring/howto-install-use-log-analytics-views.md)
- [Conditional Access: Programmatic access](howto-conditional-access-apis.md)
