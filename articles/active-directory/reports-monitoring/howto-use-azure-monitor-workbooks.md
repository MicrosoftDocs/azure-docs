---
title: Azure Monitor workbooks for reports | Microsoft Docs
description: Learn how to use Azure Monitor workbooks for Azure Active Directory reports.
services: active-directory
author: billmath
manager: amycolannino

ms.assetid: 4066725c-c430-42b8-a75b-fe2360699b82
ms.service: active-directory
ms.devlang:
ms.topic: how-to
ms.tgt_pltfrm:
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/26/2022
ms.author: billmath
ms.reviewer: sarbar
---
# How to use Azure Monitor workbooks for Azure Active Directory reports

As an IT admin, you need powerful tools to turn the data about your Azure AD tenant into a visual representation that enables you to understand how your identity management environment is doing. Azure Monitor workbooks are an example for such a tool. 

This article gives you an overview of how you can use Azure Monitor workbooks for Azure Active Directory reports to analyze your Azure AD tenant. 


## What it is

Azure AD tracks all activities in your Azure AD in the activity logs. The data in your Azure AD logs enables you to assess how your Azure AD is doing. The Azure Active Directory portal gives you access to three activity logs:

- **[Sign-ins](concept-sign-ins.md)** – Information about sign-ins and how your resources are used by your users.
- **[Audit](concept-audit-logs.md)** – Information about changes applied to your tenant such as users and group management or updates applied to your tenant’s resources.
- **[Provisioning](concept-provisioning-logs.md)** – Activities performed by the provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday.


Using the access capabilities provided by the Azure portal, you can review the information that is tracked in your activity logs. This option is helpful if you need to do a quick investigation of an event with a limited scope. For example, a user had trouble signing in during a period of a few hours. In this scenario, reviewing the recent records of this user in the sign-in logs can help to shed light on this issue. 

For one-off investigations with a limited scope, the Azure portal is often the easiest way to find the data you need. However, there are also business problems requiring a more complex analysis of the data in your activity logs. This is, for example, true if you're watching for trends in signals of interest. One common example for a scenario that requires a trend analysis is related to blocking legacy authentication in your Azure AD tenant. 

Azure AD supports several of the most widely used authentication and authorization protocols including legacy authentication. Legacy authentication refers to basic authentication, a widely used industry-standard method for collecting user name and password information. Examples of applications that commonly or only use legacy authentication are:

- Microsoft Office 2013 or older.
- Apps using mail protocols like POP, IMAP, and SMTP AUTH.


Typically, legacy authentication clients can't enforce any type of second factor authentication. However, multi-factor authentication (MFA) is a common requirement in many environments to provide a high level of protection.   

How can you determine whether it is safe to block legacy authentication in an environment? Answering this question requires an analysis of the sign-ins in your environment for a certain timeframe. This is a scenario where Azure Monitor workbooks can help you.

Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences.

With Azure Monitor workbooks, you can:

- Query data from multiple sources in Azure
- Visualize data for reporting and analysis
- Combine multiple elements into a single interactive experience

For more information, see [Azure Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md).


## How does it help me?

Common scenarios for using workbooks include:

- Get shareable, at-a-glance summary reports about your Azure AD tenant, and build your own custom reports.

- Find and diagnose sign-in failures, and get a trending view of your organization's sign-in health.

- Monitor Azure AD logs for sign-ins, tenant administrator actions, provisioning, and risk together in a flexible, customizable format.

- Watch trends in your tenant’s usage of Azure AD features such as conditional access, self-service password reset, and more.

- Know who's using legacy authentications to sign in to your environment.

- Understand the effect of your conditional access policies on your users' sign-in experience.




## Who should use it?

Typical personas for workbooks are:

- **Reporting admin** - Someone who is responsible for creating reports on top of the available data and workbook templates

- **Tenant admins** - People who use the available reports to get insight and take action.

- **Workbook template builder** - Someone who “graduates” from the role of reporting admin by turning a workbook into a template for others with similar needs to use as a basis for creating their own workbooks.



## How to use it

When working with workbooks, you can either start with an empty workbook, or use an existing template. Workbook templates enable you to quickly get started using workbooks without needing to build from scratch. 

There are:

- **Public templates** published to a [gallery](../../azure-monitor/visualize/workbooks-overview.md#the-gallery) that serve as a good starting point when you are just getting started with workbooks.
- **Private templates** when you start building your own workbooks and want to save one as a template to serve as the foundation for multiple workbooks in your tenant.



## Prerequisites

To use Monitor workbooks, you need:

- An Azure Active Directory tenant with a premium (P1 or P2) license. Learn how to [get a premium license](../fundamentals/active-directory-get-started-premium.md).

- A [Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md).

- [Access](../../azure-monitor/logs/manage-access.md#azure-rbac) to the log analytics workspace
- Following roles in Azure Active Directory (if you are accessing Log Analytics through Azure Active Directory portal)
    - Security administrator
    - Security reader
    - Report reader
    - Global administrator

## Roles

To access workbooks in Azure Active Directory, you must have access to the underlying [Log Analytics workspace](../../azure-monitor/logs/manage-access.md#azure-rbac) and be assigned to one of the following roles:


- Global Reader

- Reports Reader

- Security Reader

- Application Administrator 

- Cloud Application Administrator

- Company Administrator

- Security Administrator





## Workbook access 

To access workbooks:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Azure Active Directory** > **Monitoring** > **Workbooks**. 

1. Select a report or template, or on the toolbar select **Open**. 

![Find the Azure Monitor workbooks in Azure AD](./media/howto-use-azure-monitor-workbooks/azure-monitor-workbooks-in-azure-ad.png)



## Next steps

* [Create interactive reports by using Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md).
* [Create custom Azure Monitor queries using Azure PowerShell](../governance/entitlement-management-logs-and-reporting.md).
