---
title: How to integrate Azure Active Directory logs with Splunk using Azure Monitor Diagnostics  | Microsoft Docs
description: Learn how to integrate Azure Active Directory logs with Splunk using Azure Monitor Diagnostics  
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: c4b605b6-6fc0-40dc-bd49-101d03f34665
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: compliance-reports
ms.date: 05/17/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# How to integrate Azure Active Directory logs with Splunk using Azure Monitor Diagnostics  

In this article, you'll learn how to integrate Azure Active Directory logs with Splunk using Azure Monitor Diagnostics. First, you'd need to route the logs to an Azure event hub, then integrate it with Splunk.

## Prerequisites

## Tutorial 

1. Use the following [instructions](https://github.com/Microsoft/AzureMonitorAddonForSplunk) to download the Azure monitor add-on for Splunk and configure your Splunk instance.
2. Open your Splunk instance and click **Data Summary**.

![Data summary](./media/active-directory-reporting-azure-monitor-diagnostics-splunk-integration/DataSummary.png "Data summary")

3. Navigate to the **Sourcetypes** tab and select **amal: aadal:audit**

![Sourcetypes tab](./media/active-directory-reporting-azure-monitor-diagnostics-splunk-integration/sourcetypeaadal.png "Sourcetypes tab")

4. You'll see the Azure AD activity logs as shown in the following figure.

![Activity logs](./media/active-directory-reporting-azure-monitor-diagnostics-splunk-integration/activitylogs.png "Activity Logs")
