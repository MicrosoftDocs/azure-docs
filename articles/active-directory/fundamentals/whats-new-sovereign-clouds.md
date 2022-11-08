---
title: What's new in Sovereign Clouds? Release notes - Azure Active Directory | Microsoft Docs
description: Learn what is new with Azure Active Directory Sovereign Cloud.
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 08/03/2022
ms.custom: template-concept 
---



# What's new in Azure Active Directory Sovereign Clouds?


Azure AD receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- [Azure Government](../../azure-government/documentation-government-welcome.md)

This page is updated monthly, so revisit it regularly.



## October 2022

### General Availability - Azure AD certificate-based authentication

**Type:** New feature  
**Service category:** Other   
**Product capability:** User Authentication   
 

Azure AD certificate-based authentication (CBA) enables customers to allow or require users to authenticate with X.509 certificates against their Azure Active Directory (Azure AD) for applications and browser sign-in. This feature enables customers to adopt a phishing resistant authentication and authenticate with an X.509 certificate against their Enterprise Public Key Infrastructure (PKI). For more information, see: [Overview of Azure AD certificate-based authentication (Preview)](../authentication/concept-certificate-based-authentication.md).
 
---

### General Availability - Audited BitLocker Recovery

**Type:** New feature  
**Service category:** Device Access Management    
**Product capability:** Device Lifecycle Management   
 

BitLocker keys are sensitive security items. Audited BitLocker recovery ensures that when BitLocker keys are read, an audit log is generated so that you can trace who accesses this information for given devices. For more information, see: [View or copy BitLocker keys](../devices/device-management-azure-portal.md#view-or-copy-bitlocker-keys).
 
---

### General Availability - More device properties supported for Dynamic Device groups

**Type:** Changed feature   
**Service category:** Group Management   
**Product capability:** Directory   
 

You can now create or update dynamic device groups using the following properties:

- deviceManagementAppId
- deviceTrustType
- extensionAttribute1-15
- profileType

For more information on how to use this feature, see: [Dynamic membership rule for device groups](../enterprise-users/groups-dynamic-membership.md#rules-for-devices) 
 
---

## September 2022


### General Availability - No more waiting, provision groups on demand into your SaaS applications.

**Type:** New feature  
**Service category:** Provisioning  
**Product capability:** Identity Lifecycle Management  
 

Pick a group of up to five members and provision them into your third-party applications in seconds. Get started testing, troubleshooting, and provisioning to non-Microsoft applications such as ServiceNow, ZScaler, and Adobe. For more information, see: [On-demand provisioning in Azure Active Directory](../app-provisioning/provision-on-demand.md).
 
---

### General Availability - Devices Overview 

**Type:** New feature  
**Service category:** Device Registration and Management     
**Product capability:** Device Lifecycle Management 

 

The new Device Overview in the Azure Active Directory portal provides meaningful and actionable insights about devices in your tenant.

In the devices overview, you can view the number of total devices, stale devices, noncompliant devices, and unmanaged devices. You'll also find links to Intune, Conditional Access, BitLocker keys, and basic monitoring. For more information, see: [Manage device identities by using the Azure portal](../devices/device-management-azure-portal.md).
 
---

### General Availability - Support for Linux as Device Platform in Azure AD Conditional Access

**Type:** New feature  
**Service category:** Conditional Access     
**Product capability:** User Authentication     

 

Added support for “Linux” device platform in Azure AD Conditional Access.

An admin can now require a user is on a compliant Linux device, managed by Intune, to sign-in to a selected service (for example ‘all cloud apps’ or ‘Office 365’). For more information, see: [Device platforms](../conditional-access/concept-conditional-access-conditions.md#device-platforms)
 
---

### General Availability - Cross-tenant access settings for B2B collaboration

**Type:** Changed feature  
**Service category:** B2B  
**Product capability:** B2B/B2C  

 

Cross-tenant access settings enable you to control how users in your organization collaborate with members of external Azure AD organizations. Now you’ll have granular inbound and outbound access control settings that work on a per org, user, group, and application basis. These settings also make it possible for you to trust security claims from external Azure AD organizations like multi-factor authentication (MFA), device compliance, and hybrid Azure AD joined devices. For more information, see: [Cross-tenant access with Azure AD External Identities](../external-identities/cross-tenant-access-overview.md).
 
---

### General Availability - Location Aware Authentication using GPS from Authenticator App

**Type:** New feature  
**Service category:** Conditional Access     
**Product capability:** Identity Security & Protection     

 

Admins can now enforce Conditional Access policies based off of GPS location from Authenticator. For more information, see: [Named locations](../conditional-access/location-condition.md#named-locations).
 
---

### General Availability - My Sign-ins now supports org switching and improved navigation

**Type:** Changed feature  
**Service category:** MFA      
**Product capability:** End User Experiences     

 

We've improved the My Sign-ins experience to now support organization switching. Now users who are guests in other tenants can easily switch and sign-in to manage their security info and view activity. More improvements were made to make it easier to switch from My Sign-ins directly to other end user portals such as My Account, My Apps, My Groups, and My Access. For more information, see: [Sign-in logs in Azure Active Directory - preview](../reports-monitoring/concept-all-sign-ins.md)
 
---

### General Availability - Temporary Access Pass is now available

**Type:** New feature  
**Service category:** MFA  
**Product capability:** User Authentication  

 

Temporary Access Pass (TAP) is now generally available. TAP can be used to securely register password-less methods such as Phone Sign-in, phishing resistant methods such as FIDO2, and even help Windows onboarding (AADJ and WHFB). TAP also makes recovery easier when a user has lost or forgotten their strong authentication methods and needs to sign in to register new authentication methods. For more information, see: [Configure Temporary Access Pass in Azure AD to register Passwordless authentication methods](../authentication/howto-authentication-temporary-access-pass.md).
 
---

### General Availability - Ability to force reauthentication on Intune enrollment, risky sign-ins, and risky users

**Type:** New feature      
**Service category:** Conditional Access     
**Product capability:** Identity Security & Protection     

 

In some scenarios customers may want to require a fresh authentication, every time before a user performs specific actions. Sign-in frequency Every time support requiring a user to reauthenticate during Intune device enrollment, password change for risky users and risky sign-ins.

More information: [Configure authentication session management - Azure Active Directory - Microsoft Entra | Microsoft Docs](../conditional-access/howto-conditional-access-session-lifetime.md#require-reauthentication-every-time).
 
---

### General Availability - Non-interactive risky sign-ins

**Type:** Changed feature  
**Service category:** Identity Protection     
**Product capability:** Identity Security & Protection    

 

Identity Protection now emits risk (such as unfamiliar sign-in properties) on non-interactive sign-ins. Admins can now find these non-interactive risky sign-ins using the "sign-in type" filter in the Risky sign-ins report. For more information, see: [How To: Investigate risk](../identity-protection/howto-identity-protection-investigate-risk.md).

---

 
### General Availability - Workload Identity Federation with App Registrations are available now

**Type:** New feature     
**Service category:** Other      
**Product capability:** Developer Experience      

 

Entra Workload Identity Federation allows developers to exchange tokens issued by another identity provider with Azure AD tokens, without needing secrets. It eliminates the need to store, and manage, credentials inside the code or secret stores to access Azure AD protected resources such as Azure and Microsoft Graph. By removing the secrets required to access Azure AD protected resources, workload identity federation can improve the security posture of your organization. This feature also reduces the burden of secret management and minimizes the risk of service downtime due to expired credentials.

For more information on this capability and supported scenarios, see: [Workload identity federation](../develop/workload-identity-federation.md).
 

---

### General Availability - Continuous Access Evaluation

**Type:** New feature  
**Service category:** Other      
**Product capability:** Access Control    

 

With Continuous access evaluation (CAE), critical security events and policies are evaluated in real time. This includes account disable, password reset, and location change. For more information, see: [Continuous access evaluation](../conditional-access/concept-continuous-access-evaluation.md)
 
---


###  Public Preview – Protect against by-passing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Identity Security & Protection  


We're delighted to announce a new security protection that prevents bypassing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD. When enabled for a federated domain in your Azure AD tenant, it ensures that a compromised federated account can't bypass Azure AD Multi-Factor Authentication by imitating that a multi factor authentication has already been performed by the identity provider. The protection can be enabled via new security setting, [federatedIdpMfaBehavior](/graph/api/resources/internaldomainfederation?view=graph-rest-beta#federatedidpmfabehavior-values&preserve-view=true). 

We highly recommend enabling this new protection when using Azure AD Multi-Factor Authentication as your multi factor authentication for your federated users. To learn more about the protection and how to enable it, visit [Enable protection to prevent by-passing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#enable-protection-to-prevent-by-passing-of-cloud-azure-ad-multi-factor-authentication-when-federated-with-azure-ad).
 
---


## Next steps
<!-- Add a context sentence for the following links -->
- [What's new in Azure Active Directory?](whats-new.md)
- [Archive for What's new in Azure Active Directory?](whats-new-archive.md)