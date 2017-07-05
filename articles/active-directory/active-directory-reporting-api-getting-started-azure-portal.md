---

title: Getting started with the Azure AD reporting API | Microsoft Docs
description: How to get started with the Azure Active Directory reporting API
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 8813b911-a4ec-4234-8474-2eef9afea11e
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/18/2017
ms.author: dhanyahk;markvi

---
# Getting started with the Azure Active Directory reporting API

Azure Active Directory provides you with a variety of reports. The data of these reports can be very useful to your applications, such as SIEM systems, audit, and business intelligence tools. The Azure AD reporting APIs provide programmatic access to the data through a set of REST-based APIs. You can call these APIs from a variety of programming languages and tools.

This article provides you with the information you need to get started with the Azure AD reporting APIs.
In the next section, you find more details about using the audit and sign-in APIs. For all other APIs, see the [Azure AD reports and events](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-reports-and-events-preview) article.

For frequently asked questions,read our [FAQ](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-reporting-faq). For issues, please [file a support ticket](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-troubleshooting-support-howto)

## Learning map
1. **Prepare** - Before you can test your API samples, you need to complete the [prerequisites to access the Azure AD reporting API](active-directory-reporting-api-prerequisites-azure-portal.md).
2. **Explore** - Get a first impression of the reporting APIs:
   
   * [Using the samples for the audit API](active-directory-reporting-api-audit-samples.md) 
   * [Using the samples for the sign-in activity report API](active-directory-reporting-api-sign-in-activity-samples.md)
3. **Customize** -  Create your own solution: 
   
   * [Using the audit API reference](active-directory-reporting-api-audit-reference.md) 
   * [Using the sign-in activity report API reference](active-directory-reporting-api-sign-in-activity-reference.md)

## Next Steps
If you are curious to see all of the available Azure AD Graph API endpoints by navigating to [https://graph.windows.net/tenant-name/reports/$metadata?api-version=beta](https://graph.windows.net/tenant-name/reports/$metadata?api-version=beta).

