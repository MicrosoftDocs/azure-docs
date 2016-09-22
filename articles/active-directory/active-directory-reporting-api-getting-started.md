<properties
    pageTitle="Getting started with the Azure AD reporting API | Microsoft Azure"
    description="How to get started with the Azure Active Directory reporting API"
    services="active-directory"
    documentationCenter=""
    authors="dhanyahk"
    manager="femila"
    editor=""/>

<tags
    ms.service="active-directory"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
    ms.date="09/21/2016"
    ms.author="dhanyahk;markvi"/>

# Getting started with the Azure Active Directory reporting API

*This topic is part of the [Azure Active Directory Reporting Guide](active-directory-reporting-guide.md).*

Azure Active Directory provides a variety of activity, security and audit reports. This data can be consumed through the Azure classic portal. For more details, see [Azure Active Directory reporting - preview](active-directory-reporting-azure-portal.md).  

The data of these reports can also be very useful to your applications, such as SIEM systems, audit, and business intelligence tools. The [Azure AD Reporting APIs](https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-reports-and-events-preview) provide programmatic access to the data through a set of REST-based APIs. You can call these APIs from a variety of programming languages and tools.

This article provides you with the information you need to get started with the Azure AD sign-in and audit APIs.

For questions, issues or feedback, please contact [AAD Reporting Help](mailto:aadreportinghelp@microsoft.com).


##Learning map

1. **Prepare** - Before you can test your API samples, you need to complete the [prerequisites to access the Azure AD reporting API](active-directory-reporting-api-prerequisites.md).

2. **Explore** - Get a first impression of the reporting APIs:

  - [Using the samples for the audit API](active-directory-reporting-api-audit-samples.md) 
  - [Using the samples for the sign-in activity report API](active-directory-reporting-api-sign-in-activity-samples.md)

3. **Customize** -  Create your own solution: 

  - [Using the audit API reference](active-directory-reporting-api-audit-reference.md) 
  - [Using the sign-in activity report API reference](active-directory-reporting-api-sign-in-activity-reference.md)





## Next Steps
- Curious about which security, audit, and activity reports are available? Check out [Azure AD Security, Audit, and Activity Reports](active-directory-view-access-usage-reports.md). You can also see all of the available Azure AD Graph API endpoints by navigating to [https://graph.windows.net/tenant-name/reports/$metadata?api-version=beta](https://graph.windows.net/tenant-name/reports/$metadata?api-version=beta), which are documented in the [Azure AD Reports and Events (Preview)](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-reports-and-events-preview) article.
- See [Azure AD Audit Report Events](active-directory-reporting-audit-events.md) for more details on the Audit Report
- See [Azure AD Reports and Events (Preview)](https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-reports-and-events-preview) for more details on the Azure AD Graph API REST service.
