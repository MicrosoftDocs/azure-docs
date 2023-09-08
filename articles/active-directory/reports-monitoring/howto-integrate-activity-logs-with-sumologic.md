---
title: Stream logs to SumoLogic using Azure Monitor 
description: Learn how to integrate Azure Active Directory logs with SumoLogic using Azure Monitor.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 10/31/2022
ms.author: sarahlipsey
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---

# Integrate Azure Active Directory logs with SumoLogic using Azure Monitor

In this article, you learn how to integrate Azure Active Directory (Azure AD) logs with SumoLogic using Azure Monitor. You first route the logs to an Azure event hub, and then you integrate the event hub with SumoLogic.

## Prerequisites

To use this feature, you need:
* An Azure event hub that contains Azure AD activity logs. Learn how to [stream your activity logs to an event hub](./tutorial-azure-monitor-stream-logs-to-event-hub.md). 
* A SumoLogic single sign-on enabled subscription.

## Steps to integrate Azure AD logs with SumoLogic 

1. First, [stream the Azure AD logs to an Azure event hub](./tutorial-azure-monitor-stream-logs-to-event-hub.md).
2. Configure your SumoLogic instance to [collect logs for Azure Active Directory](https://help.sumologic.com/docs/integrations/microsoft-azure/active-directory-azure#collecting-logs-for-azure-active-directory).
3. [Install the Azure AD SumoLogic app](https://help.sumologic.com/docs/integrations/microsoft-azure/active-directory-azure#viewing-azure-active-directory-dashboards) to use the pre-configured dashboards that provide real-time analysis of your environment.

   ![Dashboard](./media/howto-integrate-activity-logs-with-sumologic/overview-dashboard.png)

## Next steps

* [Interpret audit logs schema in Azure Monitor](./overview-reports.md)
* [Interpret sign-in logs schema in Azure Monitor](reference-azure-monitor-sign-ins-log-schema.md)