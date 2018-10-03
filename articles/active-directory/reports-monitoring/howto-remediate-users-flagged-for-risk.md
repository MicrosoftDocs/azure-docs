---

title: Users flagged for risk security report in the Azure Active Directory portal | Microsoft Docs
description: Learn about the users flagged for risk security report in the Azure Active Directory portal
services: active-directory
author: priyamohanram
manager: mtillman

ms.assetid: addd60fe-d5ac-4b8b-983c-0736c80ace02
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 05/23/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# Remediate users flagged for risk in the Azure Active Directory portal

With the security reports in the Azure Active Directory (Azure AD), you can gain insights into the probability of compromised user accounts in your environment. A user flagged for risk is an indicator for a user account that might have been compromised.

Microsoft is committed to helping keep your environments secure. As part of this commitment, Microsoft continuously monitors for activities that are unusual or consistent with known attack patterns. 


If unusual activities that may indicate unauthorized access to some of your users’ accounts were detected, you receive notifications enabling you to take action. Providing you with notifications does not mean that Microsoft’s own systems have in any way been compromised.
 

## Access the users flagged for risk report

You can review users flagged for risk through the related [report](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UsersAtRisk) in Azure Active Directory (AD). If you are not a subscriber to Azure AD, you can go through the one-time subscription process at no cost at [https://aka.ms/AccessAAD](https://aka.ms/AccessAAD). On this report, you can take various actions such as:

- Generate temporary password
- Require the user to securely reset their password the next time they sign in
- Dismiss the user risk without taking any remediation action.

For more information, see [Users flagged for risk security report in the Azure Active Directory portal](concept-user-at-risk.md).

### Azure AD subscription for Office 365 customers

Once complete, you can use your Office 365 credentials to access the Azure Admin Center. After you have activated your access to Azure AD, you are redirected to the Azure AD portal. At the basic subscription level, the amount of detail provided in the reports are limited. Additional data and analytics are available for Azure Premium subscribers.


**To access the Users flagged for risk reports in the Office 365 admin center:**

1.	In the navigation menu on the left side, click **Admin centers**. 
2.	Click **Azure AD**.
3.	Log into the **Azure Active Directory admin center**.
4.	If a banner is displayed at the top of the page that says **Check out the new portal**, click the link.
4.	In the navigation menu on the left side, click **Azure Active Directory**. 
5.	In the navigation pane, under **Security**, click **Users flagged for risk**.

Review the information displayed here. You should reset the password for any account that is listed. 

## Remediation actions

Take the following actions to help rectify the impacted accounts and secure your environment:

1.	[Validate](http://aka.ms/MFAValid) correct information for multi-factor-authentication and self-service password reset. 
2.	[Enable](http://aka.ms/MFAuth) multi-factor authentication for all users. 
3.	Using this [remediation script](http://aka.ms/remediate), for every impacted account, you can automatically perform the following steps: 

    a. Reset password to secures the account and kill active sessions.

    b. Remove mailbox delegates.

    c. Disable mail forwarding rules to external domains.

    d. Remove global mail forwarding property on mailbox.

    e. Enable MFA on the user's account.

    f. Set password complexity on the account to be high.

    g. Enable mailbox auditing.

    h. Produce Audit Log for the admin to review.

4. Investigate your Office 365 tenant and other IT infrastructure, including a review of all tenant settings, user accounts, and the per-user configuration settings for possible modification. Check for indicators of methods of persistence, as well as indicators an intruder may have leveraged an initial foothold to get VPN credentials, or access to other organizational resources. 

5.	As part of your investigation, consider whether you should or must notify government authorities, including law enforcement.

Additionally, you should:

- Read and implement this [guidance](http://aka.ms/fixaccount) on addressing unusual activities. 
- [Enable the audit pipeline](http://aka.ms/improvesecurity) to help you to analyze the activity on your tenancy. Once complete, your audit store  starts populating with all activity logs. At this point, you are also able to leverage the [Security and Compliance Center’s Search and Investigation](http://aka.ms/sccsearch). 
- Use this [script](http://aka.ms/mailboxaudit1) to enable mailbox auditing for all your accounts. 
- Review the delegate permissions and mail forwarding rules for all your mailboxes. You can use this [PowerShell script](http://aka.ms/delegateforwardrules) to perform this task. 



## Next steps

- For more information about Azure Active Directory Identity Protection, see [Azure Active Directory Identity Protection](../active-directory-identityprotection.md).

