---
title: Archive for What's new in Azure Sovereign Clouds?
description: The What's new in sovereign cloud release notes in the Overview section of this content set contain six months of activity. After six months, the items are removed from the main article and put into this archive article for the next two years.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: overview
ms.date: 05/31/2023
ms.author: owinfrey
ms.collection: M365-identity-device-management
---

# Archive for What's new in Azure Sovereign Clouds?

The primary [What's new in sovereign clouds release notes](whats-new-sovereign-clouds.md) article contains updates for the last six months, while this article contains older information up to two years.


---

## December 2022

### General Availability - Risk-based Conditional Access for workload identities

**Type:** New feature  
**Service category:** Conditional Access          
**Product capability:** Identity Security & Protection     

Customers can now bring one of the most powerful forms of access control in the industry to workload identities. Conditional Access supports risk-based policies for workload identities. Organizations can block sign-in attempts when Identity Protection detects compromised apps or services. For more information, see: [Create a risk-based Conditional Access policy](../conditional-access/workload-identity.md#create-a-risk-based-conditional-access-policy).

---

### General Availability - API to recover accidentally deleted Service Principals

**Type:** New feature  
**Service category:** Enterprise Apps        
**Product capability:** Identity Lifecycle Management     

Restore a recently deleted application, group, servicePrincipal, administrative unit, or user object from deleted items. If an item was accidentally deleted, you can fully restore the item. This isn't applicable to security groups, which are deleted permanently. A recently deleted item remains available for up to 30 days. After 30 days, the item is permanently deleted. For more information, see: [servicePrincipal resource type](/graph/api/resources/serviceprincipal).

---

### General Availability - Using Staged rollout to test Cert Based Authentication (CBA)

**Type:** New feature  
**Service category:** Authentications (Logins)     
**Product capability:** Identity Security & Protection   

We're excited to announce the general availability of hybrid cloud Kerberos trust, a new Windows Hello for Business deployment model to enable a password-less sign-in experience. With this new model, we’ve made Windows Hello for Business easier to deploy than the existing key trust and certificate trust deployment models by removing the need for maintaining complicated public key infrastructure (PKI), and Azure Active Directory (AD) Connect synchronization wait times. For more information, see: [Migrate to cloud authentication using Staged Rollout](../hybrid/connect/how-to-connect-staged-rollout.md).

---

## November 2022

### General Availability - Windows Hello for Business, cloud Kerberos trust deployment



**Type:** New feature  
**Service category:** Authentications (Logins)     
**Product capability:** User Authentication   

We're excited to announce the general availability of hybrid cloud Kerberos trust, a new Windows Hello for Business deployment model to enable a password-less sign-in experience. With this new model, we’ve made Windows Hello for Business easier to deploy than the existing key trust and certificate trust deployment models by removing the need for maintaining complicated public key infrastructure (PKI), and Azure Active Directory (AD) Connect synchronization wait times. For more information, see: [Hybrid Cloud Kerberos Trust Deployment](/windows/security/identity-protection/hello-for-business/hello-hybrid-cloud-kerberos-trust).

---

### General Availability - Expression builder with Application Provisioning

**Type:** Changed feature  
**Service category:** Provisioning  
**Product capability:** Outbound to SaaS Applications  
 

Accidental deletion of users in your apps or in your on-premises directory could be disastrous. We’re excited to announce the general availability of the accidental deletions prevention capability. When a provisioning job would cause a spike in deletions, it will first pause and provide you with visibility into the potential deletions. You can then accept or reject the deletions and have time to update the job’s scope if necessary. For more information, see [Understand how expression builder in Application Provisioning works](../app-provisioning/expression-builder.md).
 

---

### General Availability - SSPR writeback is now available for disconnected forests using Azure AD Connect cloud sync



**Type:** New feature
**Service category:** Azure AD Connect cloud sync
**Product capability:** Identity Lifecycle Management

Password writeback in Azure AD Connect cloud sync now provides customers the ability to synchronize Azure AD password changes made in the cloud to an on-premises directory in real time. This can be accomplished using the lightweight Azure AD cloud provisioning agent. For more information, see: [Tutorial: Enable cloud sync self-service password reset writeback to an on-premises environment](../authentication/tutorial-enable-cloud-sync-sspr-writeback.md).

---

### General Availability - Prevent accidental deletions



**Type:** New feature  
**Service category:** Provisioning  
**Product capability:** Outbound to SaaS Applications 



Accidental deletion of users in any system could be disastrous. We’re excited to announce the general availability of the accidental deletions prevention capability as part of the Azure AD provisioning service. When the number of deletions to be processed in a single provisioning cycle spikes above a customer defined threshold, the Azure AD provisioning service pauses, provide you with visibility into the potential deletions, and allow you to accept or reject the deletions. This functionality has historically been available for Azure AD Connect, and Azure AD Connect cloud sync. It's now available across the various provisioning flows, including both HR-driven provisioning and application provisioning.

For more information, see: [Enable accidental deletions prevention in the Azure AD provisioning service](../app-provisioning/accidental-deletions.md)

---

### General Availability - Create group in administrative unit

**Type:** New feature  
**Service category:** RBAC       
**Product capability:** AuthZ/Access Delegation    
 

Groups Administrators and other roles scoped to an administrative unit can now create groups within the administrative unit.  Previously, creating a new group in administrative unit required a two-step process to first create the group, then add the group to the administrative unit.  The second step required a Privileged Role Administrator or Global Administrator.  Now, groups can be directly created in an administrative unit by anyone with appropriate roles scoped to the administrative unit, and this no longer requires a higher privilege admin role. For more information, see: [Add users, groups, or devices to an administrative unit](../roles/admin-units-members-add.md).
 
---

### General Availability - Number matching for Microsoft Authenticator notifications



**Type:** New feature  
**Service category:** Microsoft Authenticator App      
**Product capability:** User Authentication   

To prevent accidental notification approvals, admins can now require users to enter the number displayed on the sign-in screen when approving an MFA notification in the Microsoft Authenticator app. We've also refreshed the Azure portal admin UX and Microsoft Graph APIs to make it easier for customers to manage Authenticator app feature roll-outs. As part of this update we have also added the highly requested ability for admins to exclude user groups from each feature. 

The number matching feature greatly up-levels the security posture of the Microsoft Authenticator app and protects organizations from MFA fatigue attacks. We highly encourage our customers to adopt this feature applying the rollout controls we have built. Number Matching will begin to be enabled for all users of the Microsoft Authenticator app starting 27th of February 2023.


For more information, see: [How to use number matching in multifactor authentication (MFA) notifications - Authentication methods policy](../authentication/how-to-mfa-number-match.md).

---

### General Availability - Additional context in Microsoft Authenticator notifications



**Type:** New feature  
**Service category:** Microsoft Authenticator App      
**Product capability:** User Authentication 

Reduce accidental approvals by showing users additional context in Microsoft Authenticator app notifications. Customers can enhance notifications with the following:

- Application Context: This feature will show users which application they're signing into.
- Geographic Location Context: This feature will show users their sign-in location based on the IP address of the device they're signing into. 

The feature is available for both MFA and Password-less Phone Sign-in notifications and greatly increases the security posture of the Microsoft Authenticator app. We've also refreshed the Azure portal Admin UX and Microsoft Graph APIs to make it easier for customers to manage Authenticator app feature roll-outs. As part of this update, we've also added the highly requested ability for admins to exclude user groups from certain features. 

We highly encourage our customers to adopt these critical security features to reduce accidental approvals of Authenticator notifications by end users.


For more information, see: [How to use additional context in Microsoft Authenticator notifications - Authentication methods policy](../authentication/how-to-mfa-additional-context.md).

---



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
 

BitLocker keys are sensitive security items. Audited BitLocker recovery ensures that when BitLocker keys are read, an audit log is generated so that you can trace who accesses this information for given devices. For more information, see: [View or copy BitLocker keys](../devices/manage-device-identities.md#view-or-copy-bitlocker-keys).
 
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

 

The new Device Overview in the Azure portal provides meaningful and actionable insights about devices in your tenant.

In the devices overview, you can view the number of total devices, stale devices, noncompliant devices, and unmanaged devices. You'll also find links to Intune, Conditional Access, BitLocker keys, and basic monitoring. For more information, see: [Manage device identities by using the Azure portal](../devices/manage-device-identities.md).
 
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

More information: [Configure authentication session management](../conditional-access/howto-conditional-access-session-lifetime.md#require-reauthentication-every-time).
 
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

For more information on this capability and supported scenarios, see: [Workload identity federation](../workload-identities/workload-identity-federation.md).
 

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
