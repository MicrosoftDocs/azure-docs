---
title: Usage and insights report | Microsoft Docs
description: Introduction to usage and insights report in the Azure Active Directory portal 
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: amycolannino
editor: ''

ms.assetid: 3fba300d-18fc-4355-9924-d8662f563a1f
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: markvi
ms.reviewer: besiler
---

# Usage and insights report in the Azure Active Directory portal

With the usage and insights report, you can get an application-centric view of your sign-in data. You can find answers to the following questions:

*	What are the top used applications in my organization?
*	What applications have the most failed sign-ins? 
*	What are the top sign-in errors for each application?

## Prerequisites 

To access the data from the usage and insights report, you need:

* An Azure AD tenant
* An Azure AD premium (P1/P2) license to view the sign-in data
* A user in the global administrator, security administrator, security reader, or report reader roles. In addition, any user (non-admins) can access their own sign-ins. 

## Access the usage and insights report

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Select the right directory, then select **Azure Active Directory** and choose **Enterprise applications**.
3. From the **Activity** section, select **Usage & insights** to open the report. 

![Screenshot shows Usage & insights selected from the Activity section.](./media/concept-usage-insights-report/main-menu.png)
                                     

## Use the report

The usage and insights report shows the list of applications with one or more sign-in attempts, and allows you to sort by the number of successful sign-ins, failed sign-ins, and the success rate. The sign-in graph per application only counts interactive user sign-ins.

Clicking **Load more** at the bottom of the list allows you to view additional applications on the page. You can select the date range to view all applications that have been used within the range.

![Screenshot shows Usage & insights for Application activity where you can select a range and view sign-in activity for different apps.](./media/concept-usage-insights-report/usage-and-insights-report.png)

You can also set the focus on a specific application. Select **view sign-in activity** to see the sign-in activity over time for the application as well as the top errors.  

When you select a day in the application usage graph, you get a detailed list of the sign-in activities for the application.  

:::image type="content" source="./media/concept-usage-insights-report/usage-and-insights-application-report.png" alt-text="Screenshot shows Usage & insights for a specific application where you can see a graph for the sign-in activity.":::

## Next steps

* [Sign-ins report](concept-sign-ins.md)
