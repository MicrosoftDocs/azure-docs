---
title: Usage and insights report | Microsoft Docs
description: Introduction to usage and insights report in the Azure Active Directory portal 
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: report-monitor
ms.date: 10/26/2022
ms.author: sarahlipsey
ms.reviewer: besiler
---

# Usage and insights report in the Azure Active Directory portal

With the Azure Active Directory (Azure AD) **Usage and insights** report, you can get an application-centric view of your sign-in data. You can find answers to the following questions:

*	What are the top used applications in my organization?
*	What applications have the most failed sign-ins? 
*	What are the top sign-in errors for each application?

## Prerequisites 

To access the data from the Usage and Insights report, you need:

* An Azure AD tenant
* An Azure AD premium (P1/P2) license to view the sign-in data
* A user in the Global Administrator, Security Administrator, Security Reader, or Report Reader roles. In addition, any user (non-admins) can access their own sign-ins. 

## Access the Usage and insights report

1. Sign in to the [Azure portal](https://portal.azure.com) using the appropriate least privileged role.
1. Go to **Azure Active Directory** > **Usage & insights**.

The **Usage & insights** report is also available from the **Enterprise applications** area of Azure AD.

## Use the report

The **Usage and insights** report shows the list of applications with one or more sign-in attempts. The report allows you to sort by the number of successful sign-ins, failed sign-ins, and the success rate. The sign-in graph per application only counts interactive user sign-ins.

Click **Load more** at the bottom of the list to view more applications on the page. You can select the date range to view all applications that have been used within the range.

![Screenshot shows Usage & insights for Application activity where you can select a range and view sign-in activity for different apps.](./media/concept-usage-insights-report/usage-and-insights-report.png)

You can also set the focus on a specific application. Select **view sign-in activity** to see the sign-in top errors and activity over time for the selected application.  

When you select a day in the application usage graph, you get a detailed list of the sign-in activities for the application.  

:::image type="content" source="./media/concept-usage-insights-report/usage-and-insights-application-report.png" alt-text="Screenshot shows Usage & insights for a specific application where you can see a graph for the sign-in activity.":::

## Next steps

* [Sign-ins report](concept-sign-ins.md)
