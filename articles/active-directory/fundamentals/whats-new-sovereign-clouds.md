---
title: What's new in Sovereign Clouds? Release notes
description: Learn what is new with Azure Active Directory Sovereign Cloud.
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 05/31/2023
ms.custom: template-concept 
---



# What's new in Azure Active Directory Sovereign Clouds?


Azure AD receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- [Azure Government](../../azure-government/documentation-government-welcome.md)

This page updates monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [Archive for What's new in Sovereign Clouds](whats-new-archive.md).

## June 2023 

### General Availability - Apply RegEx Replace to groups claim content 



**Type:** New feature   
**Service category:** Enterprise Apps                  
**Product capability:** SSO             

Today, when group claims are added to tokens Azure Active Directory attempts to include all of the groups the user is a member of.  In larger organizations where users are members of hundreds of groups this can often exceed the limits of what can go in the token.  This feature enables more customers to connect their apps to Azure Active Directory by making connections easier and more robust through automation of the application’s creation process. This specifically allows the set of groups included in the token to be limited to only those that are assigned to the application. For more information, see: [Regex-based claims transformation](../develop/saml-claims-customization.md#regex-based-claims-transformation).

---

### General Availability - Azure Active Directory SSO integration with Cisco Unified Communications Manager



**Type:** New feature   
**Service category:** Enterprise Apps                  
**Product capability:** Platform              

Cisco Unified Communications Manager (Unified CM) provides reliable, secure, scalable, and manageable call control and session management. When you integrate Cisco Unified Communications Manager with Azure Active Directory, you can:

- Control in Azure Active Directory who has access to Cisco Unified Communications Manager.
- Enable your users to be automatically signed-in to Cisco Unified Communications Manager with their Azure AD accounts.
- Manage your accounts in one central location - the Azure portal.


For more information, see: [Azure Active Directory SSO integration with Cisco Unified Communications Manager](../saas-apps/cisco-unified-communications-manager-tutorial.md).

---

### General Availability - Number Matching for Microsoft Authenticator notifications

**Type:** Plan for Change  
**Service category:** Microsoft Authenticator App                      
**Product capability:** User Authentication             

Microsoft Authenticator app’s number matching feature has been Generally Available since Nov 2022! If you haven't already used the rollout controls (via Azure portal Admin UX and MSGraph APIs) to smoothly deploy number matching for users of Microsoft Authenticator push notifications, we highly encourage you to do so. We previously announced that we'll remove the admin controls and enforce the number match experience tenant-wide for all users of Microsoft Authenticator push notifications starting February 27, 2023. After listening to customers, we'll extend the availability of the rollout controls for a few more weeks. Organizations can continue to use the existing rollout controls until May 8, 2023, to deploy number matching in their organizations. Microsoft services will start enforcing the number matching experience for all users of Microsoft Authenticator push notifications after May 8, 2023. We'll also remove the rollout controls for number matching after that date.

If customers don’t enable number match for all Microsoft Authenticator push notifications prior to May 8, 2023, Authenticator users may experience inconsistent sign-ins while the services are rolling out this change. To ensure consistent behavior for all users, we highly recommend you enable number match for Microsoft Authenticator push notifications in advance.

For more information, see: [How to use number matching in multifactor authentication (MFA) notifications - Authentication methods policy](../authentication/how-to-mfa-number-match.md)

---

## May 2023

### General Availability - Admins can now restrict users from self-service accessing their BitLocker keys



**Type:** New feature   
**Service category:** Device Access Management                
**Product capability:** User Management            

Admins can now restrict their users from self-service accessing their BitLocker keys through the Devices Settings page. Turning on this capability hides the BitLocker key(s) of all non-admin users. This helps to control BitLocker access management at the admin level. For more information, see: [Restrict member users' default permissions](users-default-permissions.md#restrict-member-users-default-permissions).

---

### General Availability - Admins can restrict their users from creating tenants

**Type:** New feature   
**Service category:** User Access Management                           
**Product capability:** User Management               

The ability for users to create tenants from the Manage Tenant overview has been present in Azure AD since almost the beginning of the Azure portal.  This new capability in the User Settings pane allows admins to restrict their users from being able to create new tenants. There's also a new [Tenant Creator](../roles/permissions-reference.md#tenant-creator) role to allow specific users to create tenants. For more information, see [Default user permissions](../fundamentals/users-default-permissions.md#restrict-member-users-default-permissions).

---

### General Availability - My Apps new app discovery view

**Type:** Changed feature   
**Service category:** My Apps                              
**Product capability:** End User Experiences                 

My Apps has been updated to a new app discovery view that is more accessible and responsive. With the new app discovery view, users can:

- Customize their view by choosing between different layouts
- Launch apps faster
- Drag and drop apps to reorder and move
- Add sites directly from the home screen

For more information, see [My Apps portal overview](../manage-apps/myapps-overview.md).

---

### General Availability - Number Matching for Microsoft Authenticator notifications

**Type:** Plan for Change  
**Service category:** Microsoft Authenticator App                      
**Product capability:** User Authentication             

Microsoft Authenticator app’s number matching feature has been Generally Available since Nov 2022! If you haven't already used the rollout controls (via Azure portal Admin UX and MSGraph APIs) to smoothly deploy number matching for users of Microsoft Authenticator push notifications, we highly encourage you to do so. We previously announced that we'll remove the admin controls and enforce the number match experience tenant-wide for all users of Microsoft Authenticator push notifications starting February 27, 2023. After listening to customers, we'll extend the availability of the rollout controls for a few more weeks. Organizations can continue to use the existing rollout controls until May 8, 2023, to deploy number matching in their organizations. Microsoft services will start enforcing the number matching experience for all users of Microsoft Authenticator push notifications after May 8, 2023. We'll also remove the rollout controls for number matching after that date.

If customers don’t enable number match for all Microsoft Authenticator push notifications prior to May 8, 2023, Authenticator users may experience inconsistent sign-ins while the services are rolling out this change. To ensure consistent behavior for all users, we highly recommend you enable number match for Microsoft Authenticator push notifications in advance.

For more information, see: [How to use number matching in multifactor authentication (MFA) notifications - Authentication methods policy](../authentication/how-to-mfa-number-match.md)

---

### General Availability - System preferred MFA method

**Type:** Changed feature   
**Service category:** Authentications (Logins)                       
**Product capability:** Identity Security & Protection            

Currently, organizations and users rely on a range of authentication methods, each offering varying degrees of security. While Multifactor Authentication (MFA) is crucial, some MFA methods are more secure than others. Despite having access to more secure MFA options, users frequently choose less secure methods for various reasons.

To address this challenge, we're introducing a new system-preferred authentication method for MFA. When users sign in, the system will determine and display the most secure MFA method that the user has registered. This prompts users to switch from the default method to the most secure option. While users may still choose a different MFA method, they'll always be prompted to use the most secure method first for every session that requires MFA. For more information, see: [System-preferred multifactor authentication - Authentication methods policy](../authentication/concept-system-preferred-multifactor-authentication.md).

---

### General Availability - Azure Active Directory Identity Protection Leaked credentials detection B2C and AlternateLoginID support

**Type:** Changed feature   
**Service category:** Identity Protection                              
**Product capability:** Identity Security & Protection                   

Azure Active Directory Identity Protection "Leaked Credentials" detection is now enabled in Azure Active Directory B2C. In addition, the detection now fully supports leaked credential matching based on AlternateLoginID, providing customers with more robust and comprehensive protection.

---


## April 2023

### General Availability - Azure Active Directory Domain Services: Trusts for User Forests

**Type:** New feature   
**Service category:** Azure Active Directory Domain Services                          
**Product capability:** Azure Active Directory Domain Services            

You can now create trusts on both user and resource forests. On-premises Active Directory DS users can't authenticate to resources in the Azure Active Directory DS resource forest until you create an outbound trust to your on-premises Active Directory DS. An outbound trust requires network connectivity to your on-premises virtual network to which you have installed Azure AD Domain Service. On a user forest, trusts can be created for on-premises Active Directory forests that aren't synchronized to Azure Active Directory DS.

For more information, see: [How trust relationships work for forests in Active Directory](/azure/active-directory-domain-services/concepts-forest-trust).

---

### General Availability - Azure AD SCIM Validator Tool

**Type:** New feature   
**Service category:** Provisioning                             
**Product capability:** Developer Experience               

Azure Active Directory SCIM validator will enable you to test your server for compatibility with the Azure Active Directory SCIM client. For more information, see: [Tutorial: Validate a SCIM endpoint](../app-provisioning/scim-validator-tutorial.md).

---

### General Availability - Enablement of combined security information registration for MFA and  self-service password reset (SSPR)

**Type:** New feature   
**Service category:** MFA                     
**Product capability:** Identity Security & Protection            

Last year we announced the combined registration user experience for MFA and  self-service password reset (SSPR) was rolling out as the default experience for all organizations. We're happy to announce that the combined security information registration experience is now fully rolled out. This change doesn't affect tenants located in the China region. For more information, see: [Combined security information registration for Azure Active Directory overview](../authentication/concept-registration-mfa-sspr-combined.md).

---

### General Availability - Devices settings Self-Help Capability for Pending Devices

**Type:** New feature   
**Service category:** Device Registration and Management                              
**Product capability:** End User Experiences                 

In the **All Devices** settings under the Registered column, you can now select any pending devices you have, and it opens a context pane to help troubleshoot why a device may be pending. You can also offer feedback on if the summarized information is helpful or not. For more information, see [Pending devices in Azure Active Directory](/troubleshoot/azure/active-directory/pending-devices).

---

### General availability - Consolidated App launcher (My Apps) settings and new preview settings

**Type:** New feature   
**Service category:** My Apps            
**Product capability:** End User Experiences      

We have consolidated relevant app launcher settings in a new App launchers section in the Azure and Microsoft Entra admin centers. The entry point can be found under Enterprise applications, where Collections used to be. You can find the Collections option by selecting App launchers. In addition, we've added a new App launchers Settings option. This option has some settings you may already be familiar with like the Microsoft 365 settings. The new Settings options also have controls for previews. As an admin, you can choose to try out new app launcher features while they are in preview. Enabling a preview feature means that the feature turns on for your organization. This enabled feature reflects in the My Apps portal, and other app launchers for all of your users. To learn more about the preview settings, see: [End-user experiences for applications](../manage-apps/end-user-experiences.md).


---

### General Availability - RBAC: Delegated app registration management using custom roles

**Type:** New feature   
**Service category:** RBAC                          
**Product capability:** Access Control               

Custom roles give you fine-grained control over what access your admins have. This release of custom roles includes the ability to delegate management of app registrations and enterprise apps. For more information, see: [Overview of role-based access control in Azure Active Directory](../roles/custom-overview.md).

---


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

Filter and transform group names in token claims configuration using regular expression. Many application configurations on ADFS and other IdPs rely on the ability to create authorization claims based on the content of Group Names using regular expression functions in the claim rules.  Azure AD now has the capability to use a regular expression match and replace function to create claim content based on Group **onpremisesSAMAccount** names. This functionality allows those applications to be moved to Azure AD for authentication using the same group management patterns. For more information, see: [Configure group claims for applications by using Azure Active Directory](../hybrid/connect/how-to-connect-fed-group-claims.md).

---

### General Availability - Filter groups in tokens using a substring match

**Type:** New feature  
**Service category:** Enterprise Apps             
**Product capability:** SSO          

Azure AD now has the capability to filter the groups included in the token using substring match on the display name or **onPremisesSAMAccountName** attributes of the group object.  Only Groups the user is a member of will be included in the token. This was a blocker for some of our customers to migrate their apps from ADFS to Azure AD. This feature unblocks those challenges. 

For more information, see: 
- [Group Filter](../develop/reference-claims-mapping-policy-type.md#group-filter).
- [Configure group claims for applications by using Azure Active Directory](../hybrid/connect/how-to-connect-fed-group-claims.md).



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

Post-authentication anomalous activity detection for workload identities. This detection focuses specifically on detection of post authenticated anomalous behavior performed by a workload identity (service principal). Post-authentication behavior is assessed for anomalies based on an action and/or sequence of actions occurring for the account. Based on the scoring of anomalies identified, the offline detection may score the account as low, medium, or high risk. The risk allocation from the offline detection will be available within the Risky workload identities reporting settings. A new detection type identified as Anomalous service principal activity appears in filter options. For more information, see: [Securing workload identities](../identity-protection/concept-workload-identity-risk.md).

---

### General Availability - Microsoft cloud settings for Azure AD B2B

**Type:** New feature  
**Service category:** B2B              
**Product capability:** B2B/B2C       

Microsoft cloud settings let you collaborate with organizations from different Microsoft Azure clouds. With Microsoft cloud settings, you can establish mutual B2B collaboration between the following clouds:

- Microsoft Azure commercial and Microsoft Azure Government
- Microsoft Azure commercial and Microsoft Azure operated by 21Vianet

For more information about Microsoft cloud settings for B2B collaboration, see: [Microsoft cloud settings](../external-identities/cross-tenant-access-overview.md#microsoft-cloud-settings).

---

### Public Preview - Support for Directory Extensions using Azure AD cloud sync

**Type:** New feature   
**Service category:** Provisioning               
**Product capability:** Azure AD Connect Cloud Sync         

Hybrid IT Admins now can sync both Active Directory and Azure AD Directory Extensions using Azure AD Cloud Sync. This new capability adds the ability to dynamically discover the schema for both Active Directory and Azure AD, allowing customers to map the needed attributes using Cloud Sync's attribute mapping experience. 

For more information on how to enable this feature, see: [Cloud Sync directory extensions and custom attribute mapping](../hybrid/cloud-sync/custom-attribute-mapping.md)


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

This risk detection baselines normal administrative user behavior in Azure AD, and spots anomalous patterns of behavior like suspicious changes to the directory. The detection is triggered against the administrator making the change or the object that was changed. For more information, see: [User-linked detections](../identity-protection/concept-identity-protection-risks.md).

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


## Next steps
<!-- Add a context sentence for the following links -->
- [What's new in Azure Active Directory?](whats-new.md)
- [Archive for What's new in Azure Active Directory?](whats-new-archive.md)
