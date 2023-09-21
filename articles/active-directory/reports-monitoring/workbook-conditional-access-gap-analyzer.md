---

title: Conditional Access gap analyzer workbook in  Microsoft Entra ID
description: Learn how to use the Conditional Access gap analyzer workbook.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/01/2022
ms.author: sarahlipsey
ms.reviewer: sarbar 

ms.collection: M365-identity-device-management
---

# Conditional Access gap analyzer workbook

In Microsoft Entra ID, you can protect access to your resources by configuring Conditional Access policies.
As an IT administrator, you want to ensure that your Conditional Access policies work as expected to ensure that your resources are properly protected. With the Conditional Access gap analyzer workbook, you can detect gaps in your Conditional Access implementation.  

This article provides you with an overview of this workbook.


## Description

![Workbook category](./media/workbook-conditional-access-gap-analyzer/workbook-category.png)

As an IT administrator, you want to make sure that only the right people can access your resources. Microsoft Entra Conditional Access helps you to accomplish this goal.  

The Conditional Access gap analyzer workbook helps you to verify that your Conditional Access policies work as expected.

**This workbook:**

- Highlights user sign-ins that have no Conditional Access policies applied to them. 
- Allows you to ensure that there are no users, applications, or locations that have been unintentionally excluded from Conditional Access policies.  

 

## Sections


The workbook has four sections:  

- Users signing in using legacy authentication 

- Number of sign-ins by applications that aren't impacted by Conditional Access policies 

- High risk sign-in events bypassing Conditional Access policies 

- Number of sign-ins by location that weren't affected by Conditional Access policies 


![Conditional Access coverage by location](./media/workbook-conditional-access-gap-analyzer/conditianal-access-by-location.png)

Each of these trends offers a breakdown of sign-ins to the user level, so that you can see which users per scenario are bypassing Conditional Access. 

## Filters

This workbook supports setting a time range filter.

![Time range filter](./media/workbook-conditional-access-gap-analyzer/time-range.png)



## Best practices

Use this workbook to ensure that your tenant is configured to the following Conditional Access best practices:  

- Block all legacy authentication sign-ins 

- Apply at least one Conditional Access Policy to every application 

- Block all high risk sign-ins  

- Block sign-ins from untrusted locations  

 





## Next steps

- [How to use Microsoft Entra workbooks](howto-use-azure-monitor-workbooks.md)
