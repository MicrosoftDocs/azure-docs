<properties
	pageTitle="Azure Active Directory Identity Protection notifications| Microsoft Azure"
	description="Learn how notifications support your investigation activities."
	services="active-directory"
	keywords="azure active directory identity protection, cloud app discovery, managing applications, security, risk, risk level, vulnerability, security policy"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/16/2016"
	ms.author="markvi"/>

#Azure Active Directory Identity Protection notifications 


Azure AD Identity Protection sends two types of automated notification emails to help you manage user risk and risk events:

- User compromised alert email

- Weekly digest email

## User compromised alert email

A user compromised email alert is generated when Azure AD Identity Protection identifies an account as compromised. The email includes a link to the Users flagged for risk report in the Identity Protection dashboard. We recommend that you immediately investigate notifications of compromised.


## Weekly digest email

The weekly digest email contains a summary of new risk events.<br>
It includes:

- Users at risk
- Suspicious activities
- Detected vulnerabilities
- Links to the related reports in Identity Protection


<br>
![Remediation](./media/active-directory-identityprotection-notifications/400.png "Remediation")
<br> 

You can switch sending a weekly digest email off.
<br><br>
![User risks](./media/active-directory-identityprotection-notifications/62.png "User risks")
<br>
 

**To open the related configuration dialog**:

1. On the **Azure AD Identity Protection** blade, click **Settings**.
<br><br>
![User risk policy](./media/active-directory-identityprotection-notifications/401.png "User risk policy")
<br>

2. In the **General** section, click **Notifications**.
<br><br>
![User risk policy](./media/active-directory-identityprotection-notifications/405.png "User risk policy")
<br>




## See also

- [Azure Active Directory Identity Protection](active-directory-identityprotection.md) 

