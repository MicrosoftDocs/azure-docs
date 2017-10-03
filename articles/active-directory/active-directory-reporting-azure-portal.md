---

title: Azure Active Directory reporting | Microsoft Docs
description: Provides a general overview of Azure Active Directory reporting.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 6141a333-38db-478a-927e-526f1e7614f4
ms.service: active-directory
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/13/2017
ms.author: markvi
ms.reviewer: dhanyahk  
---
# Azure Active Directory reporting

With Azure Active Directory reporting, you can gain insights into how your environment is doing.  
The provided data enables you to:

- Determine how your apps and services are utilized by your users
- Detect potential risks affecting the health of your environment
- Troubleshoot issues preventing your users from getting their work done  

The reporting architecture relies on two main pillars:

- Security reports
- Activity reports

![Reporting](./media/active-directory-reporting-azure-portal/01.png)



## Security reports

The security reports in Azure Active Directory help you to protect your organization's identities.  
There are two types of security reports in Azure Active Directory:

- **Users flagged for risk** - From the [users flagged for risk security report](active-directory-reporting-security-user-at-risk.md), you get an overview of user accounts that might have been compromised.

- **Risky sign-ins** - With the [risky sign-in security report](active-directory-reporting-security-risky-sign-ins.md), you get an indicator for sign-in attempts that might have been performed by someone who is not the legitimate owner of a user account. 

**What Azure AD license do you need to access a security report?**  
All editions of Azure Active Directory provide you with users flagged for risk and risky sign-ins reports.  
However, the level of report granularity varies between the editions: 

- In the **Azure Active Directory Free and Basic editions**, you already get a list of users flagged for risk and risky sign-ins. 

- The **Azure Active Directory Premium 1** edition extends this model by also enabling you to examine some of the underlying risk events that have been detected for each report. 

- The **Azure Active Directory Premium 2** edition provides you with the most detailed information about the underlying risk events and it also enables you to configure security policies that automatically respond to configured risk levels.


## Activity reports

There are two types of activity reports in Azure Active Directory:

- **Audit logs** - The [audit logs activity report](active-directory-reporting-activity-audit-logs.md) provides you with access to the history of every task performed in your tenant.

- **Sign-ins** -  With the [sign-ins activity report](active-directory-reporting-activity-sign-ins.md), you can determine, who has performed the tasks reported by the audit logs report.



The **audit logs report** provides you with records of system activities for compliance.
Amongst others, the provided data enables you to address common scenarios such as:

- Someone in my tenant got access to an admin group. Who gave them access? 

- I want to know the list of users signing into a specific app since I recently onboarded the app and want to know if it’s doing well

- I want to know how many password resets are happening in my tenant


**What Azure AD license do you need to access the audit logs report?**  
The audit logs report is available for features for which you have licenses. If you have a license for a specific feature, you also have access to the audit log information for it.

For more details, see **Comparing generally available features of the Free, Basic, and Premium editions** in [Azure Active Directory features and capabilities](https://www.microsoft.com/cloud-platform/azure-active-directory-features).   



The **sign-ins activity report** enables to to find answers to questions such as:

- What is the sign-in pattern of a user?
- How many users have users signed in over a week?
- What’s the status of these sign-ins?


**What Azure AD license do you need to access the sign-ins activity report?**  
To access the sign-ins activity report, your tenant must have an Azure AD Premium license associated with it.


## Programmatic access

In addition to the user interface, Azure Active Directory reporting also provides you with [programmatic access](active-directory-reporting-api-getting-started-azure-portal.md) to the reporting data. The data of these reports can be very useful to your applications, such as SIEM systems, audit, and business intelligence tools. The Azure AD reporting APIs provide programmatic access to the data through a set of REST-based APIs. You can call these APIs from a variety of programming languages and tools. 


## Next steps

If you want to know more about the various report types in Azure Active Directory, see:

- [Users flagged for risk report](active-directory-reporting-security-user-at-risk.md)
- [Risky sign-ins report](active-directory-reporting-security-risky-sign-ins.md)
- [Audit logs report](active-directory-reporting-activity-audit-logs.md)
- [Sign-ins logs report](active-directory-reporting-activity-sign-ins.md)

If you want to know more about accessing the the reporting data using the reporting API, see: 

- [Getting started with the Azure Active Directory reporting API](active-directory-reporting-api-getting-started-azure-portal.md)


<!--Image references-->
[1]: ./media/active-directory-reporting-azure-portal/ic195031.png