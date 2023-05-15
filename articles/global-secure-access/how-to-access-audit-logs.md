---
title: How to access Global Secure Access audit logs
description: Learn how to access Global Secure Access audit logs.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 05/15/2023
ms.service: network-access
ms.custom: 
---

# How to access the Global Secure Access audit logs

The Azure Active Directory (Azure AD) audit log is a valuable source of information when researching or troubleshooting changes to your Azure AD environment. Changes related to Global Secure Access are captured in the audit logs in several categories, such as filtering policy, forwarding profiles, branch management, and more. This article describes how to use the audit log to track changes to your Global Secure Access environment.

## Prerequisites

To access the audit log for your tenant, you must have one of the following roles: 

- Reports Reader
- Security Reader
- Security Administrator
- Global Reader
- Global Administrator

Audit logs are available in [all editions of Azure AD](../active-directory/reports-monitoring/concept-audit-logs.md). Storage and integration with analysis and monitoring tools may require additional licenses and roles.

## Access the audit logs

There are several ways to view the audit logs. For more information on the options and recommendations for when to use each option, see [How to access activity logs](/azure/active-directory/reports-monitoring/howto-access-activity-logs).

### Access audit logs from the Entra Identity admin center

You can access the audit logs from **Global Secure Access** and from **Identity Monitoring and health**.

**From Global Secure Access:**
1. Sign in to the [Microsoft Entra Identity admin center](https://entra.microsoft.com/#home) using one of the required roles.
1. Go to **Global Secure Access** > **Audit logs**. The filters are prepopulated with the categories and activities related to Global Secure Access.

**From Identity Monitoring and health:**
1. Go to **Identity Monitoring and health** > **Audit logs**.
1. Select the **Date** range you want to query.
1. Open the **Service** filter, select **Global Secure Access**, and select the **Apply** button.
1. Open the **Category** filter, select at least one of the available options, and select the **Apply** button.

## Save audit logs

Audit log data is only kept for 30 days by default, which may not be long enough for every organization. You may also want to integrate your logs with other services for enhanced monitoring and analysis. The following options are described in more detail in [How to access activity logs](/azure/active-directory/reports-monitoring/howto-access-activity-logs).

- Stream activity logs to an event hub to integrate with other tools, like Azure Monitor or Splunk.
- Export activity logs for storage and queries.
- Monitor activity in real-time with Microsoft Sentinel.

## Next steps
- [Manage admin access](how-to-manage-admin-access.md)
