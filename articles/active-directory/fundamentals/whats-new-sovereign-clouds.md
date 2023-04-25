---
title: What's new in Sovereign Clouds? Release notes
description: Learn what is new with Azure Active Directory Sovereign Cloud.
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 01/31/2023
ms.custom: template-concept 
---



# What's new in Azure Active Directory Sovereign Clouds?


Azure AD receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- [Azure Government](../../azure-government/documentation-government-welcome.md)

This page updates monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [Archive for What's new in Sovereign Clouds](whats-new-archive.md).

## March 2023 

### General Availability - Provisioning Insights Workbook

**Type:** New feature   
**Service category:** Provisioning                     
**Product capability:** Monitoring & Reporting            

This new workbook makes it easier to investigate and gain insights into your provisioning workflows in a given tenant. This includes HR-driven provisioning, cloud sync, app provisioning, and cross-tenant sync.

Some key questions this workbook can help answer are:

- How many identities have been synced in a given time range?
- How many create, delete, update, or other operations were performed?
- How many operations were successful, skipped, or failed?
- What specific identities failed? And what step did they fail on?
- For any given user, what tenants / applications were they provisioned or deprovisioned to?

For more information, see: [Provisioning insights workbook](../app-provisioning/provisioning-workbook.md).

---

### General Availability - Follow Azure Active Directory best practices with recommendations

**Type:** New feature   
**Service category:** Reporting                       
**Product capability:** Monitoring & Reporting            

Azure Active Directory recommendations help you improve your tenant posture by surfacing opportunities to implement best practices. On a daily basis, Azure AD analyzes the configuration of your tenant. During this analysis, Azure Active Directory compares the data of a recommendation with the actual configuration of your tenant. If a recommendation is flagged as applicable to your tenant, the recommendation appears in the Recommendations section of the Azure Active Directory Overview. 

This release includes our first three recommendations:

- Convert from per-user MFA to Conditional Access MFA
- Migration applications from AD FS to Azure Active Directory
- Minimize MFA prompts from known devices.

We're developing more recommendations, so stay tuned!

For more information, see: 

- [What are Azure Active Directory recommendations?](../reports-monitoring/overview-recommendations.md).
- [Use the Azure AD recommendations API to implement Azure AD best practices for your tenant](/graph/api/resources/recommendations-api-overview)

---

### General Availability - Improvements to Azure Active Directory Smart Lockout

**Type:** Changed feature   
**Service category:** Other                          
**Product capability:** User Management             

With a recent improvement, Smart Lockout now synchronizes the lockout state across Azure Active Directory data centers, so the total number of failed sign-in attempts allowed before an account is locked will match the configured lockout threshold.

For more information, see: [Protect user accounts from attacks with Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md).

---

### General Availability- MFA events from ADFS and NPS adapter available in Sign-in logs

**Type:** Changed feature   
**Service category:** MFA                            
**Product capability:** Identity Security & Protection              

Customers with Cloud MFA activity from ADFS adapter, or NPS Extension, can now see these events in the Sign-in logs, rather than the legacy multi-factor authentication activity report.  Not all attributes in the sign-in logs are populated for these events due to limited data from the on-premises components. Customers with ADFS using AD Health Connect and customers using NPS with the latest NPS extension installed will have a richer set of data in the events.

For more information, see: [Protect user accounts from attacks with Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md).

---

## February 2023

### General Availability - Filter and transform group names in token claims configuration using regular expression

**Type:** New feature  
**Service category:** Enterprise Apps             
**Product capability:** SSO          

Filter and transform group names in token claims configuration using regular expression. Many application configurations on ADFS and other IdPs rely on the ability to create authorization claims based on the content of Group Names using regular expression functions in the claim rules.  Azure AD now has the capability to use a regular expression match and replace function to create claim content based on Group **onpremisesSAMAccount** names. This functionality will allow those applications to be moved to Azure AD for authentication using the same group management patterns. For more information, see: [Configure group claims for applications by using Azure Active Directory](../hybrid/how-to-connect-fed-group-claims.md).

---

### General Availability - Filter groups in tokens using a substring match

**Type:** New feature  
**Service category:** Enterprise Apps             
**Product capability:** SSO          

Azure AD now has the capability to filter the groups included in the token using substring match on the display name or **onPremisesSAMAccountName** attributes of the group object.  Only Groups the user is a member of will be included in the token. This was a blocker for some of our customers to migrate their apps from ADFS to Azure AD. This feature will unblock those challenges. 

For more information, see: 
- [Group Filter](../develop/reference-claims-mapping-policy-type.md#group-filter).
- [Configure group claims for applications by using Azure Active Directory](../hybrid/how-to-connect-fed-group-claims.md).



---

### General Availability - New SSO claims transformation features

**Type:** New feature  
**Service category:** Enterprise Apps             
**Product capability:** SSO        

Azure AD now supports claims transformations on multi-valued attributes and can emit multi-valued claims. More functions to allow match and string operations on claims processing to enable apps to be migrated from other IdPs to Azure AD. This includes:  Match on Empty(), NotEmpty(), Prefix(), Suffix(), and extract substring operators. For more information, see: [Claims mapping policy type](../develop/reference-claims-mapping-policy-type.md).

---

### General Availability - New Detection for Service Principal Behavior Anomalies

**Type:** New feature  
**Service category:** Access Reviews            
**Product capability:** Identity Security & Protection       

Post-authentication anomalous activity detection for workload identities. This detection focuses specifically on detection of post authenticated anomalous behavior performed by a workload identity (service principal). Post-authentication behavior will be assessed for anomalies based on an action and/or sequence of actions occurring for the account. Based on the scoring of anomalies identified, the offline detection may score the account as low, medium, or high risk. The risk allocation from the offline detection will be available within the Risky workload identities reporting blade. A new detection type identified as Anomalous service principal activity will appear in filter options. For more information, see: [Securing workload identities](../identity-protection/concept-workload-identity-risk.md).

---

### General Availability - Microsoft cloud settings for Azure AD B2B

**Type:** New feature  
**Service category:** B2B              
**Product capability:** B2B/B2C       

Microsoft cloud settings let you collaborate with organizations from different Microsoft Azure clouds. With Microsoft cloud settings, you can establish mutual B2B collaboration between the following clouds:

- Microsoft Azure commercial and Microsoft Azure Government
- Microsoft Azure commercial and Microsoft Azure China 21Vianet

For more information about Microsoft cloud settings for B2B collaboration, see: [Microsoft cloud settings](../external-identities/cross-tenant-access-overview.md#microsoft-cloud-settings).

---

### Public Preview - Support for Directory Extensions using Azure AD cloud sync

**Type:** New feature   
**Service category:** Provisioning               
**Product capability:** Azure AD Connect Cloud Sync         

Hybrid IT Admins now can sync both Active Directory and Azure AD Directory Extensions using Azure AD Cloud Sync. This new capability adds the ability to dynamically discover the schema for both Active Directory and Azure AD, allowing customers to map the needed attributes using Cloud Sync's attribute mapping experience. 

For more information on how to enable this feature, see: [Cloud Sync directory extensions and custom attribute mapping](../cloud-sync/custom-attribute-mapping.md)


---

### General Availability - On-premises application provisioning

**Type:** Changed feature   
**Service category:** Provisioning            
**Product capability:** Outbound to On-premises Applications        

Azure AD supports provisioning users into applications hosted on-premises or in a virtual machine, without having to open up any firewalls. If your application supports [SCIM](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010), or you've built a SCIM gateway to connect to your legacy application, you can use the Azure AD Provisioning agent to [directly connect](../app-provisioning/on-premises-scim-provisioning.md) with your application and automate provisioning and deprovisioning. If you have legacy applications that don't support SCIM and rely on an [LDAP](../app-provisioning/on-premises-ldap-connector-configure.md) user store, or a [SQL](../app-provisioning/tutorial-ecma-sql-connector.md) database, Azure AD can support those as well.

---

## January 2023

### General Availability - Azure AD Domain Services: Deeper Insights

**Type:** New feature  
**Service category:** Azure AD Domain Services             
**Product capability:** Azure AD Domain Services        

Now within the Azure portal you have access to view key data for your Azure AD-DS Domain Controllers such as: LDAP Searches/sec, Total Query Received/sec, DNS Total Response Sent/sec, LDAP Successful Binds/sec, memory usage, processor time, Kerberos Authentications, and NTLM Authentications. For more information, see: [Check fleet metrics of Azure Active Directory Domain Services](../../active-directory-domain-services/fleet-metrics.md).

---

### General Availability - Add multiple domains to the same SAML/Ws-Fed based identity provider configuration for your external users

**Type:** New feature   
**Service category:** B2B        
**Product capability:** B2B/B2C   

An IT admin can now add multiple domains to a single SAML/WS-Fed identity provider configuration to invite users from multiple domains to authenticate from the same identity provider endpoint. For more information, see: [Federation with SAML/WS-Fed identity providers for guest users](../external-identities/direct-federation.md).

---

### General Availability - New risk in Identity Protection: Anomalous user activity

**Type:** New feature  
**Service category:** Conditional Access          
**Product capability:** Identity Security & Protection     

This risk detection baselines normal administrative user behavior in Azure AD, and spots anomalous patterns of behavior like suspicious changes to the directory. The detection is triggered against the administrator making the change or the object that was changed. For more information, see: [User-linked detections](../identity-protection/concept-identity-protection-risks.md#user-linked-detections).

---

### General Availability - Administrative unit support for devices

**Type:** New feature   
**Service category:** Directory Management             
**Product capability:** AuthZ/Access Delegation       

You can now use administrative units to delegate management of specified devices in your tenant by adding devices to an administrative unit, and assigning built-in and custom device management roles scoped to that administrative unit. For more information, see: [Device management](../roles/administrative-units.md#device-management).

---

### General Availability - Azure AD Terms of Use (ToU) API

**Type:** New feature  
**Service category:** Conditional Access          
**Product capability:** Identity Security & Protection     

Represents a tenant's customizable terms of use agreement that is created, and managed, with Azure Active Directory (Azure AD). You can use the following methods to create and manage the [Azure Active Directory Terms of Use feature](/graph/api/resources/agreement?#json-representation) according to your scenario. For more information, see: [agreement resource type](/graph/api/resources/agreement).

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

We're excited to announce the general availability of hybrid cloud Kerberos trust, a new Windows Hello for Business deployment model to enable a password-less sign-in experience. With this new model, we’ve made Windows Hello for Business easier to deploy than the existing key trust and certificate trust deployment models by removing the need for maintaining complicated public key infrastructure (PKI), and Azure Active Directory (AD) Connect synchronization wait times. For more information, see: [Migrate to cloud authentication using Staged Rollout](../hybrid/how-to-connect-staged-rollout.md).

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

### General Availability - SSPR writeback is now available for disconnected forests using Azure AD Connect Cloud sync



**Type:** New feature  
**Service category:** Azure AD Connect Cloud Sync   
**Product capability:** Identity Lifecycle Management 

Azure AD Connect Cloud Sync Password writeback now provides customers the ability to synchronize Azure AD password changes made in the cloud to an on-premises directory in real time. This can be accomplished using the lightweight Azure AD cloud provisioning agent. For more information, see: [Tutorial: Enable cloud sync self-service password reset writeback to an on-premises environment](../authentication/tutorial-enable-cloud-sync-sspr-writeback.md).

---

### General Availability - Prevent accidental deletions



**Type:** New feature  
**Service category:** Provisioning  
**Product capability:** Outbound to SaaS Applications 



Accidental deletion of users in any system could be disastrous. We’re excited to announce the general availability of the accidental deletions prevention capability as part of the Azure AD provisioning service. When the number of deletions to be processed in a single provisioning cycle spikes above a customer defined threshold, the Azure AD provisioning service will pause, provide you with visibility into the potential deletions, and allow you to accept or reject the deletions. This functionality has historically been available for Azure AD Connect, and Azure AD Connect Cloud Sync. It's now available across the various provisioning flows, including both HR-driven provisioning and application provisioning.

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

## Next steps
<!-- Add a context sentence for the following links -->
- [What's new in Azure Active Directory?](whats-new.md)
- [Archive for What's new in Azure Active Directory?](whats-new-archive.md)
