---

title: Get started with the Azure AD reporting API | Microsoft Docs
description: How to get started with the Azure Active Directory reporting API
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 8813b911-a4ec-4234-8474-2eef9afea11e
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: compliance-reports
ms.date: 05/07/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Get started with the Azure Active Directory reporting API

Azure Active Directory provides you with a variety of [reports](active-directory-reporting-azure-portal.md). The data of these reports can be very useful to your applications, such as SIEM systems, audit, and business intelligence tools. 

By using the Azure AD reporting API, you can gain programmatic access to the data through a set of REST-based APIs. You can call these APIs from a variety of programming languages and tools.

This article provides you with a roadmap for accessing the reporting data using the related API.

If you run into issues, see [how to get support for Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-troubleshooting-support-howto).


## Prerequisites

To access the reporting API, even if you are planning on accessing the API using a script, you need to:

1. Assign roles (Security Reader, Security Admin, Global Admin)
2. Register an application
3. Grant permissions
4. Gather configuration settings


 
For detailed instructions, see the [prerequisites to access the Azure Active Directory reporting API](active-directory-reporting-api-prerequisites-azure-portal.md).

## APIs with Graph Explorer

You can use the [MSGraph explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) to verify your sign-in and audit API data. Make sure to sign in to your account using both of the sign-in buttons in the Graph Explorer UI, and set **AuditLog.Read.All** and **Directory.Read.All** permissions for your tenant as shown.   

![Graph Explorer](./media/active-directory-reporting-api-getting-started-azure-portal/graph-explorer.png)

![Modify permissions UI](./media/active-directory-reporting-api-getting-started-azure-portal/modify-permissions.png)

## Recommendation 

If you are planning on retrieving reporting data without user intervention, you should consider using the Azure AD Reporting API with certificates.

For detailed instructions, see [get data using the Azure AD Reporting API with certificates](active-directory-reporting-api-with-certificates.md).


## Explore

Get a first impression of the reporting APIs:
   
   - [Using the samples for the audit API](active-directory-reporting-api-audit-samples.md) 
 
   - [Using the samples for the sign-in activity report API](active-directory-reporting-api-sign-in-activity-samples.md)


## Customize  

Create your own solution: 
   
   - [Using the audit API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/directoryaudit) 

   - [Using the sign-in activity report API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/signin)



