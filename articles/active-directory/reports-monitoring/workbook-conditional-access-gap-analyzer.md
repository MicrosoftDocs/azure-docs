---

title: Find user activity reports in Azure portal | Microsoft Docs
description: Learn where the Azure Active Directory user activity reports are in the Azure portal.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: karenho
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/13/2018
ms.author: markvi
ms.reviewer: dhanyahk 

ms.collection: M365-identity-device-management
---

# Conditional access gap analyzer workbook





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


![Workbook category](./media/workbook-conditional-access-gap-analyzer/workbook-category.png)



## Filters

This workbook supports setting a time range filter.

![Time range filter](./media/workbook-conditional-access-gap-analyzer/time-range.png)



## Best practice

You should use this workbook to ensure that your tenant is configured to the following Conditional Access best practices:  

- Block all legacy authentication sign-ins 

- Apply at least one Conditional Access Policy to every application 

- Block all high risk sign-ins  

- Block sign-ins from untrusted locations  

 





## Next steps

- [How to use Azure AD workbooks](howto-use-azure-monitor-workbooks.md)
