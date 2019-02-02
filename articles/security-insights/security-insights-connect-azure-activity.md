---
title: Collecting data in Azure Security Insights | Microsoft Docs
description: Learn how to collect data in Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: c3df8afb-90d7-459c-a188-c55ba99e7b92
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/4/2019
ms.author: rkarlin

---
# Collecting data from Azure Activity log

You can stream logs from [Azure Activity log](.../azure-monitor/platform/activity-logs-overview.md) into Security Insights with a single click.


## Prerequisites

- User with global administrator or security administrator permissions


## Connect to Azure AD Information Protection

If you already have Azure AD Information Protection, make sure it is [enabled on your network](../information-protection/activate-service.md).
If Azure AD Information Protection is deployed and getting data, the alert data can easily be streamed into Azure Security Insights.


1. In Azure Security Insights, select **Data collection** and then click the **Azure Activity log** tile.

2. In the Azure Activity log pane, select the subscriptions you want to stream into Security Insights. 

3. Click **Connect**.

 

## Next steps
In this document, you learned how to connect Azure Activity log to Security Insights. To learn more about Security Insights, see the following articles:
