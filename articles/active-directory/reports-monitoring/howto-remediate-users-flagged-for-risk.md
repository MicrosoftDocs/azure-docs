---

title: Users flagged for risk security report in the Azure Active Directory portal | Microsoft Docs
description: Learn about the users flagged for risk security report in the Azure Active Directory portal
services: active-directory
author: MarkusVi
manager: daveba

ms.assetid: addd60fe-d5ac-4b8b-983c-0736c80ace02
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/13/2018
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---
# Remediate users flagged for risk in the Azure Active Directory portal

With the security reports in the Azure Active Directory (Azure AD), you can gauge the probability of compromised user accounts in your environment. A user flagged for risk is an indicator for a user account that might have been compromised.

Microsoft is committed to helping keep your environments secure. As part of this commitment, Microsoft continuously monitors for activities that are unusual or consistent with known attack patterns. 

If unusual activities that may indicate unauthorized access to some of your users’ accounts are detected, you receive notifications enabling you to take action. This does not mean that Microsoft’s own systems have been compromised.

## Access the users flagged for risk report

You can review users flagged for risk through the [users at risk report](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RiskyUsers) in the Azure portal. If you don't have Azure AD, you can sign up for free at [https://aka.ms/AccessAAD](https://aka.ms/AccessAAD). 

From the users flagged for risk report, you can take the following actions for each user:

- Generate temporary password
- Require the user to securely reset their password the next time they sign in
- Dismiss the user risk without taking any remediation action.

For more information, see [Users flagged for risk security report](concept-user-at-risk.md).

### Azure AD subscription for Office 365 customers

You can also use your Office 365 credentials to access the **Azure Admin Center**. After you have activated your access to Azure AD, you are redirected to the Azure AD portal. At the basic subscription level, the amount of detail provided in the reports are limited. Additional data and analytics are available for Azure Premium subscribers.

To access the **Users flagged for risk** reports in the Microsoft 365 admin center:

1.	From the navigation menu on the left side, select **Admin centers**. 
2.	Select **Azure AD**.
3.	Log into the **Azure Active Directory admin center**.
4.	If a banner is displayed at the top of the page that says **Check out the new portal**, select the link.
4.	In the navigation menu on the left side, select **Azure Active Directory**. 
5.	In the navigation pane, select **Users flagged for risk** from the **Security** section.

## Remediation actions

Take the following actions to help rectify the impacted accounts and secure your environment:

1.	[Validate correct information](https://aka.ms/MFAValid) for multi-factor authentication and self-service password reset. 
2.	[Enable multi-factor authentication](https://aka.ms/MFAuth) for all users. 
3.	Use this [remediation script](https://aka.ms/remediate) for every impacted account, to automatically perform the following steps: 

    a. Reset password to secure the account and kill active sessions.

    b. Remove mailbox delegates.

    c. Disable mail forwarding rules to external domains.

    d. Remove global mail forwarding property on mailbox.

    e. Enable MFA on the user's account.

    f. Set password complexity on the account to be high.

    g. Enable mailbox auditing.

    h. Produce an audit log for the administrator to review.

4. Investigate your Office 365 tenant and other IT infrastructure, including a review of all tenant settings, user accounts, and the per-user configuration settings for possible modification. Check for indicators of methods of persistence, as well as indicators an intruder may have leveraged an initial foothold to get VPN credentials, or access to other organizational resources. 

5.	As part of your investigation, consider whether you should notify government authorities, including law enforcement.

Additionally, you should:

- Read and implement this [guidance on addressing unusual activities](https://aka.ms/fixaccount). 
- [Enable the audit pipeline](https://aka.ms/improvesecurity) to help you to analyze the activity in your tenant. Once complete, your audit store starts populating with activity logs. At this point, you can also leverage the [Security and Compliance Center’s search and investigation resource](https://aka.ms/sccsearch). 
- Use this [script to enable mailbox auditing](https://aka.ms/mailboxaudit1) for all your accounts. 
- Review the delegate permissions and mail forwarding rules for all your mailboxes. You can use this [PowerShell script](https://aka.ms/delegateforwardrules) to perform this task. 

## Next steps

* [Azure Active Directory Identity Protection](../active-directory-identityprotection.md)
* [Users flagged for risk](concept-user-at-risk.md)
