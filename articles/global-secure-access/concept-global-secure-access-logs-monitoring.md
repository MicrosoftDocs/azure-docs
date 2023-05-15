---
title: Global Secure Access logs and monitoring
description: Learn about the available Global Secure Access logs and monitoring options.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: conceptual
ms.date: 05/15/2023
ms.service: network-access
ms.custom: 
---

# Global Secure Access logs and monitoring

As an IT administrator, you need to monitor the performance, experience, and availability of the traffic flowing through your networks. Within the Global Secure Access logs there are many data points that you can review to gain insights into your network traffic. This article describes the logs and dashboards that are available to you and some common monitoring scenarios.

## Prerequisites

Audit logs are available for all services that you have licensed. Streaming logs to a Log Analytics workspace requires an Azure AD Premium P1 or P2 tenant. You also need **Global Administrator** or **Security Administrator** to set up Diagnostic settings to configure log streaming.

## Network traffic dashboard

The Global Secure Access network traffic dashboard provides you with visualizations of the traffic flowing through the Microsoft Entra Private Access and Microsoft Entra Internet Access services. The dashboard provides a summary of the data related to network deployment, product deployment, and product insights. Within these categories you can see the number of users, devices, and applications seen in the last 24 hours. You can also see device activity and cross-tenant access.

For more information, see [Global Secure Access network traffic dashboard](concept-traffic-dashboard.md).

## Audit logs

The Azure Active Directory (Azure AD) audit log is a valuable source of information when researching or troubleshooting changes to your Azure AD environment. Changes related to Global Secure Access are captured in the audit logs in several categories, such as filtering policy, forwarding profiles, branch management, and more.

For more information, see [Global Secure Access audit logs](how-to-access-audit-logs.md).

## Enriched Office 365 logs

The *Enriched Office 365 logs* provide you with the information you need to gain insights into the performance, experience, and availability of the Microsoft 365 apps your organization uses. You can integrate the logs with a Log Analytics workspace or third-party SIEM tool for further analysis.

For more information, see [Enriched Office 365 logs](how-to-view-enriched-logs.md).

## Sign-in logs

Reviewing and analyzing sign-in logs is a common task for IT administrators. These logs are the starting point for troubleshooting sign-in issues for users. You can review sign-in activity to determine if there are any risky sign-ins or sign-ins from unfamiliar locations. When source IP restoration is enabled for Global Secure Access, you can review the IP addresses of sign-ins.

For more information, see [Source IP restoration](overview-what-is-global-secure-access.md).

## Next steps

- [Learn how to access, store, and analyze Azure AD activity logs](../active-directory/reports-monitoring/howto-access-activity-logs.md)
- [Troubleshoot sign-in errors](../active-directory/reports-monitoring/howto-troubleshoot-sign-in-errors.md)