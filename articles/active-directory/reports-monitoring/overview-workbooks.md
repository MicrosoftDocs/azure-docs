---

title: What are Azure Active Directory workbooks?
description: Learn about Azure Active Directory workbooks.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: overview
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/01/2022
ms.author: sarahlipsey
ms.reviewer: tspring  
ms.collection: M365-identity-device-management

# Customer intent: As an Azure AD administrator, I want a visualization tool that I can customize for my tenant.

---

# What are Azure Active Directory workbooks?

As an IT admin, you need may need see your Azure Active Directory (Azure AD) tenant data as a visual representation that enables you to understand how your identity management environment is doing. This article gives you an overview of how you can use Azure Monitor workbooks for Azure AD to analyze your Azure AD tenant data.

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

Using the access capabilities provided by the Azure portal, you can review the information that is tracked in your activity logs. This option is helpful if you need to do a quick investigation of an event with a limited scope. For example, a user had trouble signing in during a period of a few hours. In this scenario, reviewing the recent records of this user in the sign-in logs can help to shed light on this issue. 

For one-off investigations with a limited scope, the Azure portal is often the easiest way to find the data you need. However, there are also business problems requiring a more complex analysis of the data in your activity logs. One common example for a scenario that requires a trend analysis is related to blocking legacy authentication in your Azure AD tenant. 

Azure AD supports several of the most widely used authentication and authorization protocols including legacy authentication. Legacy authentication refers to basic authentication, a widely used industry-standard method for collecting user name and password information. Examples of applications that commonly or only use legacy authentication are:

- Microsoft Office 2013 or older.
- Apps using mail protocols like POP, IMAP, and SMTP AUTH.


Typically, legacy authentication clients can't enforce any type of second factor authentication. However, multi-factor authentication (MFA) is a common requirement in many environments to provide a high level of protection.   

How can you determine whether it's safe to block legacy authentication in an environment? Answering this question requires an analysis of the sign-ins in your environment for a certain timeframe. Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences.