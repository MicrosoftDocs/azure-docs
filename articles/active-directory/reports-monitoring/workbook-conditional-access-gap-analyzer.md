---

title: Conditional access gap analyzer workbook in  Azure AD | Microsoft Docs
description: Learn how to use the conditional access gap analyzer workbook.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: billmath
ms.reviewer: sarbar 

ms.collection: M365-identity-device-management
---

# Conditional access gap analyzer workbook

In Azure AD, you can protect access to your resources by configuring conditional access policies.
As an IT administrator, you want to ensure that your conditional access policies work as expected to ensure that your resources are properly protected. With the conditional access gap analyzer workbook, you can detect gaps in your conditional access implementation.  

This article provides you with an overview of this workbook.


## Description

![Workbook category](./media/workbook-conditional-access-gap-analyzer/workbook-category.png)

As an IT administrator, you want to make sure that only the right people can access your resources. Azure AD conditional access helps you to accomplish this goal.  

The conditional access gap analyzer workbook helps you to verify that your conditional access policies work as expected.

**This workbook:**

- Highlights user sign-ins that have no conditional access policies applied to them. 
- Allows you to ensure that there are no users, applications, or locations that have been unintentionally excluded from conditional access policies.  

 

## Sections


The workbook has four sections:  

- Users signing in using legacy authentication 

- Number of sign-ins by applications that are not impacted by conditional access policies 

- High risk sign-in events bypassing conditional access policies 

- Number of sign-ins by location that were not affected by conditional access policies 


![Conditional access coverage by location](./media/workbook-conditional-access-gap-analyzer/conditianal-access-by-location.png)

Each of these trends offers a breakdown of sign-ins to the user level, so that you can see which users per scenario are bypassing conditional access. 

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

- [How to use Azure AD workbooks](howto-use-azure-monitor-workbooks.md)
