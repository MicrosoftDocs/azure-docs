<properties
	pageTitle="Sign-in experiences with Azure AD Identity Protection| Microsoft Azure"
	description="Provides an overview of the user experience when Identity Protection has mitigated or remediated a user or when multi-factor authentication is required by a policy."
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
	ms.date="05/17/2016"
	ms.author="markvi"/>

# Sign-in experiences with Azure AD Identity Protection

With Azure Active Directory Identity Protection, you can:

- require users to register for multi-factor authentication

- handle risky sign-ins and compromised users

The response of the system to these issues has an impact on a user's sign-in experience because just directly signing-in by providing a user name and a password won't be possible anymore. Additional steps are required to get a user safely back into business.

This topic gives you an overview of a user's sign-in experience for all cases that can occur.

**Multi-factor authentication**

- Multi-factor authentication registration



**Sign-in at risk**

- Risky sign-in recovery

- Risky sign-in blocked

- Multi-factor authentication registration during a risky sign-in
 

**User at risk**

- Compromised account recovery

- Compromised account blocked




## Multi-factor authentication registration

The best user experience for both, the compromised account recovery flow and the risky sign-in flow, is when the user can self-recover. If users are registered for multi-factor authentication, they already have a phone number associated with their account that can be used to pass security challenges. No help desk or administrator involvement is needed to recover from account compromise. Thus, it’s highly recommended to get your users registered for multi-factor authentication. 

Administrators can:

- set a policy that requires users to set up their accounts for additional security verification. 
- allow skipping multi-factor authentication registration for up to 30 days, in case they want to give users a grace period before registering.

**The multi-factor authentication registration has three steps:**

1. In the first step, the user gets a notification about the requirement to set the account up for multi-factor authentication. 
<br><br>
![Remediation](./media/active-directory-identityprotection-flows/140.png "Remediation")
<br>


2. To set multi-factor authentication up, you need to let the system know how you want to be contacted.
<br><br>
![Remediation](./media/active-directory-identityprotection-flows/141.png "Remediation")
<br>
 
3. The system submits a challenge to you and you need to respond.
<br><br>
![Remediation](./media/active-directory-identityprotection-flows/142.png "Remediation")
<br>

 



## Risky sign-in recovery

When an administrator has configured a policy for sign-in risks, the affected users are notified when they try to sign-in. 

**The risky sign-in flow has two steps:** 

1. The user is informed that something unusual was detected about their sign-in, such as signing in from a new location, device, or app. 
<br><br>
![Remediation](./media/active-directory-identityprotection-flows/120.png "Remediation")
<br>

2. The user is required to prove their identity by solving a security challenge. If the user is registered for multi-factor authentication they need to round-trip a security code to their phone number. Since this is a just a risky sign in and not a compromised account, the user won’t have to change the password in this flow. 
<br><br>
![Remediation](./media/active-directory-identityprotection-flows/121.png "Remediation")
<br>



 
## Risky sign-in blocked
Administrators can also choose to set a Sign-In Risk policy to block users upon sign-in depending on the risk level. To get unblocked, end users must contact an administrator or help desk, or they can try signing in from a familiar location or device. Self-recovering by solving multi-factor authentication is not an option in this case.
<br><br>
![Remediation](./media/active-directory-identityprotection-flows/200.png "Remediation")
<br>



## Multi-factor authentication registration during a risky sign-in

It is important that users register for multi-factor authentication so that they are prepared and able to pass security challenges. If a user isn’t registered for multi-factor authentication but the policy requires them to be, they could be asked to register during a risky sign-in. This means, an attacker could end up being asked to add a phone number instead of the good user. 

To avoid this situation, require users to register for multi-factor authentication as soon as possible, so that a phone number is already associated with their account in case they ever get compromised. Alternatively, administrators can completely block compromised users who aren’t registered for multi-factor authentication.

**The multi-factor authentication registration during a risky sign-in has two steps:** 

1. The user is notified that the account is at risk. 
<br><br>
![Remediation](./media/active-directory-identityprotection-flows/150.png "Remediation")
<br>

2. The multi-factor authentication registration process is initiated.
<br><br>
![Remediation](./media/active-directory-identityprotection-flows/151.png "Remediation")
<br> 

For the next steps, see [Multi-factor authentication registration](#multi-factor-authentication-registration)




## Compromised account recovery

When a user risk security policy has been configured, users who meet the user risk level specified in the policy (and are therefore assumed compromised) must go through the user compromise recovery flow before they can sign-in. 

**The user compromise recovery flow has three steps:**

1. The user is informed that their account security is at risk because of suspicious activity or leaked credentials.

<br>
![Remediation](./media/active-directory-identityprotection-flows/101.png "Remediation")
<br> 

2.	The user is required to prove their identity by solving a security challenge. If the user is registered for multi-factor authentication they can self-recover from being compromised. They will need to round-trip a security code to their phone number. 

<br>
![Remediation](./media/active-directory-identityprotection-flows/110.png "Remediation")
<br>


3.	Finally, the user is forced to change their password since someone else may have had access to their account. 
Screenshots of this experience are below.
 
<br>
![Remediation](./media/active-directory-identityprotection-flows/111.png "Remediation")
<br>



## Compromised account blocked 

To get a user that was blocked by a user risk security policy unblocked, the user must contact an administrator or help desk. Self-recovering by solving multi-factor authentication is not an option in this case.

<br>
![Remediation](./media/active-directory-identityprotection-flows/104.png "Remediation")
<br>



 
## Reset password

If compromised users are blocked from signing in, an administrator can generate a temporary password for them. The users will have to change their password during a next sign-in.

<br>
![Remediation](./media/active-directory-identityprotection-flows/160.png "Remediation")
<br> 


 




 

## See also

- [Azure Active Directory Identity Protection](active-directory-identityprotection.md) 