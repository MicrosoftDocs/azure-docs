---
title: Global Secure Access (preview) logs and monitoring
description: Learn about the available Global Secure Access (preview) logs and monitoring options.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: conceptual
ms.date: 06/11/2023
ms.service: network-access
ms.custom: 
---

# Global Secure Access (preview) logs and monitoring

As an IT administrator, you need to monitor the performance, experience, and availability of the traffic flowing through your networks. Within the Global Secure Access (preview) logs there are many data points that you can review to gain insights into your network traffic. This article describes the logs and dashboards that are available to you and some common monitoring scenarios.

## Network traffic dashboard

The Global Secure Access network traffic dashboard provides you with visualizations of the traffic flowing through the Microsoft Entra Private Access and Microsoft Entra Internet Access services, which include Microsoft 365 and Private Access traffic. The dashboard provides a summary of the data related to product deployment and insights. Within these categories you can see the number of users, devices, and applications seen in the last 24 hours. You can also see device activity and cross-tenant access.

For more information, see [Global Secure Access network traffic dashboard](concept-traffic-dashboard.md).

## Audit logs

The Microsoft Entra ID audit log is a valuable source of information when researching or troubleshooting changes to your Microsoft Entra ID environment. Changes related to Global Secure Access are captured in the audit logs in several categories, such as filtering policy, forwarding profiles, remote network management, and more.

For more information, see [Global Secure Access audit logs](how-to-access-audit-logs.md).

## Traffic logs

The Global Secure Access traffic logs provide a summary of the network connections and transactions that are occurring in your environment. These logs look at *who* accessed *what* traffic from *where* to *where* and with what *result*. The traffic logs provide a snapshot of all connections in your environment and breaks that down into traffic that applies to your traffic forwarding profiles. The logs details provide the traffic type destination, source IP, and more.

For more information, see [Global Secure Access traffic logs](how-to-view-traffic-logs.md).

## Enriched Office 365 logs

The *Enriched Office 365 logs* provide you with the information you need to gain insights into the performance, experience, and availability of the Microsoft 365 apps your organization uses. You can integrate the logs with a Log Analytics workspace or third-party SIEM tool for further analysis.

Customers use existing *Office Audit logs* for monitoring, detection, investigation, and analytics. We understand the importance of these logs and have partnered with Microsoft 365 to include SharePoint logs. These enriched logs include details like client information and original public IP details that can be used for troubleshooting security scenarios.

For more information, see [Enriched Office 365 logs](how-to-view-enriched-logs.md).

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [Learn how to access, store, and analyze Azure AD activity logs](/azure/active-directory/reports-monitoring/howto-access-activity-logs)
