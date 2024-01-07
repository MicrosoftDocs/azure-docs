---

title: What are Azure Active Directory reports? | Microsoft Docs
description: Provides a general overview of Azure Active Directory reports.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: overview
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/01/2022
ms.author: sarahlipsey
ms.reviewer: sarbar  

# Customer intent: As an Azure AD administrator, I want to understand what Azure AD reports are available and how I can use them to gain insights into my environment. 
ms.collection: M365-identity-device-management
---

# What are Azure Active Directory reports?

Azure Active Directory (Azure AD) reports provide a comprehensive view of activity in your environment. The provided data enables you to:

- Determine how your apps and services are utilized by your users
- Detect potential risks affecting the health of your environment
- Troubleshoot issues preventing your users from getting their work done  

## Activity reports

Activity reports help you understand the behavior of users in your organization. There are two types of activity reports in Azure AD:

- **Audit logs** - The [audit logs activity report](concept-audit-logs.md) provides you with access to the history of every task performed in your tenant.

- **Sign-ins** -  With the [sign-ins activity report](concept-sign-ins.md), you can determine, who has performed the tasks reported by the audit logs report.



> [!VIDEO https://www.youtube.com/embed/ACVpH6C_NL8]

### Audit logs report 

The [audit logs report](concept-audit-logs.md) provides you with records of system activities for compliance. This data enables you to address common scenarios such as:

- Someone in my tenant got access to an admin group. Who gave them access? 

- I want to know the list of users signing into a specific app since I recently onboarded the app and want to know if it’s doing well

- I want to know how many password resets are happening in my tenant


#### What Azure AD license do you need to access the audit logs report?  

The audit logs report is available for features for which you have licenses. If you have a license for a specific feature, you also have access to the audit log information for it. A detailed feature comparison as per [different types of licenses](../fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses) can be seen on the [Azure Active Directory pricing page](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing). For more information, see [Azure Active Directory features and capabilities](../fundamentals/active-directory-whatis.md#which-features-work-in-azure-ad).

### Sign-ins report

The [sign-ins report](concept-sign-ins.md) enables you to find answers to questions such as:

- What is the sign-in pattern of a user?
- How many users have users signed in over a week?
- What’s the status of these sign-ins?

#### What Azure AD license do you need to access the sign-ins activity report?  

To access the sign-ins activity report, your tenant must have an Azure AD Premium license associated with it.

## Programmatic access

In addition to the user interface, Azure AD also provides you with [programmatic access](concept-reporting-api.md) to the reports data, through a set of REST-based APIs. You can call these APIs from various programming languages and tools. 

## Next steps

- [Risky sign-ins report](../identity-protection/overview-identity-protection.md)
- [Audit logs report](concept-audit-logs.md)
- [Sign-ins logs report](concept-sign-ins.md)
