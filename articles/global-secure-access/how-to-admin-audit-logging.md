---
title: How to use admin audit logging
description: Learn how to use admin audit logging for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/17/2023
ms.service: network-access
ms.custom: 
---

# Learn how to use admin audit logging for Global Secure Access

The Azure Active Directory (Azure AD) audit log is a valuable source of information when troubleshooting why and how Global Secure Access changes happened in your environment.

Audit log data is only kept for 30 days by default, which may not be long enough for every organization. Organizations can store data for longer periods by changing diagnostic settings in Azure AD to:
- Send data to a Log Analytics workspace
- Archive data to a storage account
- Stream data to Event Hubs
- Send data to a partner solution

Find these options in the **Microsoft Entra Identity admin center** > **Diagnostic settings** > **Edit** setting. If you don't have a diagnostic setting, follow the instructions in the article [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md) to create one. 

## Use the audit log
To use audit logging:
1. Sign in to the Microsoft Entra Identity admin center as a *Conditional Access Administrator*, *Security Administrator*, or *Global Administrator*.
1. Browse to **Microsoft Entra Identity** and then **Audit logs**.
1. Select the **Date** range you want to query.
1. From the **Service** filter, select **Global Secure Access** and select the **Apply** button.
1. The audit logs display all activities, by default. Open the **Activity** filter to narrow down the activities. 

## Next steps
- [Manage admin access](how-to-manage-admin-access.md)
