---
title: Quickstart Download a sign-in report using the Azure portal | Microsoft Docs
description: Learn how to download a sign-in report using the Azure portal 
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: 9131f208-1f90-4cc1-9c29-085cacd69317
ms.service: active-directory
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/13/2018
ms.author: markvi
ms.reviewer: dhanyahk

# Customer intent: As an IT administrator, I want to learn how to download a sign report from the Azure portal so that I can understand who is using my environment.
ms.collection: M365-identity-device-management
---
# Quickstart: Download a sign-in report using the Azure portal

In this quickstart, you learn how to download the sign-in data for your tenant for the past 24 hours. You can download up to 250,000 records from the Azure portal. The records are sorted by most recent so by default, you get the most recent 250,000 records. 

## Prerequisites

You need:

* An Azure Active Directory tenant, with a Premium license to view the sign-in activity report. See [Getting started with Azure Active Directory Premium](../fundamentals/active-directory-get-started-premium.md) to upgrade your Azure Active Directory edition. Note that if you did not have any activities data prior to the upgrade, it will take a couple of days for the data to show up in the reports after you upgrade to a premium license.
* A user, who is in the **Security Administrator**, **Security Reader**, **Report Reader** or **Global Administrator** role for the tenant. In addition, any user in the tenant can access their own sign-ins.

## Quickstart: Download a sign-in report

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Select **Azure Active Directory** from the left navigation pane and use the **Switch directory** button to select your active directory.
3. From the dashboard, select **Azure Active Directory** and then select **Sign-ins**. 
4. Choose **last 24 hours** in the **Date** filter drop-down and select **Apply** to view the sign-ins for the past 24 hours. 
5. Select the **Download** button, select **CSV** as the file format and specify a file name to download a CSV file containing the filtered records. 

![Reporting](./media/quickstart-download-sign-in-report/download-sign-ins.png)

## Next steps

* [Sign-in activity reports in the Azure Active Directory portal](concept-sign-ins.md)
* [Azure Active Directory reporting retention](reference-reports-data-retention.md)
* [Azure Active Directory reporting latencies](reference-reports-latencies.md)
