---
title: Azure Active Directory Identity Protection playbook | Microsoft Docs
description: Learn how Azure AD Identity Protection enables you to limit the ability of an attacker to exploit a compromised identity or device and to secure an identity or a device that was previously suspected or known to be compromised.
services: active-directory
keywords: azure active directory identity protection, cloud discovery, managing applications, security, risk, risk level, vulnerability, security policy
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: daveba

ms.assetid: 60836abf-f0e9-459d-b344-8e06b8341d25
ms.service: active-directory
ms.subservice: identity-protection
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2018
ms.author: joflore
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Azure Active Directory Identity Protection playbook

This playbook helps you to:

* Populate data in the Identity Protection environment by simulating risk events and vulnerabilities
* Set up risk-based Conditional Access policies and test the impact of these policies


## Simulating Risk Events

This section provides you with steps for simulating the following risk event types:

* Sign-ins from anonymous IP addresses (easy)
* Sign-ins from unfamiliar locations (moderate)
* Impossible travel to atypical locations (difficult)

Other risk events cannot be simulated in a secure manner.

### Sign-ins from anonymous IP addresses

For more information about this risk event, see [Sign-ins from anonymous IP addresses](../reports-monitoring/concept-risk-events.md#sign-ins-from-anonymous-ip-addresses). 

Completing the following procedure requires you to use:

- The [Tor Browser](https://www.torproject.org/projects/torbrowser.html.en) to simulate anonymous IP addresses. You might need to use a virtual machine if your organization restricts using the Tor browser.
- A test account that is not yet registered for multi-factor authentication.

**To simulate a sign-in from an anonymous IP, perform the following steps**:

1. Using the [Tor Browser](https://www.torproject.org/projects/torbrowser.html.en), navigate to [https://myapps.microsoft.com](https://myapps.microsoft.com).   
2. Enter the credentials of the account you want to appear in the **Sign-ins from anonymous IP addresses** report.

The sign-in shows up on the Identity Protection dashboard within 10 - 15 minutes. 

### Sign-ins from unfamiliar locations

For more information about this risk event, see [Sign-ins from unfamiliar locations](../reports-monitoring/concept-risk-events.md#sign-in-from-unfamiliar-locations). 

To simulate unfamiliar locations, you have to sign in from a location and device your test account has not signed in from before.

The procedure below uses a newly created:

- VPN connection, to simulate new location.

- Virtual machine, to simulate a new device.

Completing the following procedure requires you to use a user account that has:

- At least a 30-day sign-in history.
- Multi-factor authentication enabled.


**To simulate a sign-in from an unfamiliar location, perform the following steps**:

1. When signing in with your test account, fail the MFA challenge by not passing the MFA challenge.
2. Using your new VPN, navigate to [https://myapps.microsoft.com](https://myapps.microsoft.com) and enter the credentials of your test account.
   

The sign-in shows up on the Identity Protection dashboard within 10 - 15 minutes.

### Impossible travel to atypical location

For more information about this risk event, see [Impossible travel to atypical location](../reports-monitoring/concept-risk-events.md#impossible-travel-to-atypical-locations). 

Simulating the impossible travel condition is difficult because the algorithm uses machine learning to weed out false-positives such as impossible travel from familiar devices, or sign-ins from VPNs that are used by other users in the directory. Additionally, the algorithm requires a sign-in history of 14 days and 10 logins of the user before it begins generating risk events. Because of the complex machine learning models and above rules, there is a chance that the following steps will not lead to a risk event. You might want to replicate these steps for multiple Azure AD accounts to publish this risk event.


**To simulate an impossible travel to atypical location, perform the following steps**:

1. Using your standard browser, navigate to [https://myapps.microsoft.com](https://myapps.microsoft.com).  
2. Enter the credentials of the account you want to generate an impossible travel risk event for.
3. Change your user agent. You can change user agent in Internet Explorer from Developer Tools, or change your user agent in Firefox or Chrome using a user-agent switcher add-on.
4. Change your IP address. You can change your IP address by using a VPN, a Tor add-on, or spinning up a new machine in Azure in a different data center.
5. Sign-in to [https://myapps.microsoft.com](https://myapps.microsoft.com) using the same credentials as before and within a few minutes after the previous sign-in.

The sign-in shows up in the Identity Protection dashboard within 2-4 hours.

## Simulating vulnerabilities
Vulnerabilities are weaknesses in an Azure AD environment that can be exploited by a bad actor. Currently 3 types of vulnerabilities are surfaced in Azure AD Identity Protection that leverage other features of Azure AD. These Vulnerabilities will be displayed on the Identity Protection dashboard automatically once these features are set up.

* Azure AD [Multi-Factor Authentication](../authentication/multi-factor-authentication.md)
* Azure AD [Cloud Discovery](https://docs.microsoft.com/cloud-app-security/).
* Azure AD [Privileged Identity Management](../privileged-identity-management/pim-configure.md). 


## Testing security policies

This section provides you with steps for testing the user risk and the sign-in risk security policy.


### User risk security policy

For more information, see [How to configure the user risk policy](howto-user-risk-policy.md).

![User risk](./media/playbook/02.png "Playbook")


**To test a user risk security policy, perform the following steps**:

1. Sign-in to [https://portal.azure.com](https://portal.azure.com) with global administrator credentials for your tenant.
2. Navigate to **Identity Protection**. 
3. On the **Azure AD Identity Protection** page, click **User risk policy**.
4. In the **Assignments** section, select the desired users (and groups) and user risk level.

    ![User risk](./media/playbook/03.png "Playbook")

5. In the Controls section, select the desired Access control (e.g. Require password change).
5. As **Enforce Policy**, select **Off**.
6. Elevate the user risk of a test account by, for example, simulating one of the risk events a few times.
7. Wait a few minutes, and then verify that user level for your user is Medium. If not, simulate more risk events for the user.
8. As **Enforce Policy**, select **On**.
9. You can now test user risk-based Conditional Access by signing in using a user with an elevated risk level.
    
    

### Sign-in risk security policy

For more information, see [How to configure the sign-in risk policy](howto-sign-in-risk-policy.md).

![Sign-in risk](./media/playbook/01.png "Playbook")


**To test a sign in risk policy, perform the following steps:**

1. Sign-in to [https://portal.azure.com](https://portal.azure.com) with global administrator credentials for your tenant.

2. Navigate to **Azure AD Identity Protection**.

3. On the main **Azure AD Identity Protection** page, click **Sign-in risk policy**. 

4. In the **Assignments** section, select the desired users (and groups) and sign-in risk level.

    ![Sign-in risk](./media/playbook/04.png "Playbook")


5. In the **Controls** section, select the desired Access control (for example, **Require multi-factor authentication**). 

6. As **Enforce Policy**, select **On**.

7. Click **Save**.

8. You can now test Sign-in Risk-based Conditional Access by signing in using a risky session (for example, by using the Tor browser). 

 




## See also

- [Azure Active Directory Identity Protection](../active-directory-identityprotection.md)

