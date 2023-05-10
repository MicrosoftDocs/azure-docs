---
title: What's new? Release notes
description: Learn what is new with Azure Active Directory; such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: owinfreyATL
manager: amycolannino
featureFlags:
 - clicktale
ms.assetid: 06a149f7-4aa1-4fb9-a8ec-ac2633b031fb
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 01/26/2023
ms.author: owinfrey
ms.reviewer: dhanyahk
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# What's new in Azure Active Directory?

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://learn.microsoft.com/api/search/rss?search=%22Release+notes+-+Azure+Active+Directory%22&locale=en-us` into your ![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png) feed reader.

Azure AD receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

This page updates monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [Archive for What's new in Azure Active Directory](whats-new-archive.md).


## April 2023

### Public Preview - Custom attributes for Azure Active Directory Domain Services

**Type:** New feature   
**Service category:** Azure Active Directory Domain Services                     
**Product capability:** Azure Active Directory Domain Services            

Azure Active Directory Domain Services will now support synchronizing custom attributes from Azure AD for on-premises accounts. For more information, see: [Custom attributes for Azure Active Directory Domain Services](/azure/active-directory-domain-services/concepts-custom-attributes).

---

### General Availability - Enablement of combined security information registration for MFA and  self-service password reset (SSPR)

**Type:** New feature   
**Service category:** MFA                     
**Product capability:** Identity Security & Protection            

Last year we announced the combined registration user experience for MFA and  self-service password reset (SSPR) was rolling out as the default experience for all organizations. We're happy to announce that the combined security information registration experience is now fully rolled out. This change doesn't affect tenants located in the China region. For more information, see: [Combined security information registration for Azure Active Directory overview](../authentication/concept-registration-mfa-sspr-combined.md).

---

### General Availability - System preferred MFA method

**Type:** Changed feature   
**Service category:** Authentications (Logins)                       
**Product capability:** Identity Security & Protection            

Currently, organizations and users rely on a range of authentication methods, each offering varying degrees of security. While Multifactor Authentication (MFA) is crucial, some MFA methods are more secure than others. Despite having access to more secure MFA options, users frequently choose less secure methods for various reasons.

To address this challenge, we're introducing a new system-preferred authentication method for MFA. When users sign in, the system will determine and display the most secure MFA method that the user has registered. This prompts users to switch from the default method to the most secure option. While users may still choose a different MFA method, they'll always be prompted to use the most secure method first for every session that requires MFA. For more information, see: [System-preferred multifactor authentication - Authentication methods policy](../authentication/concept-system-preferred-multifactor-authentication.md).

---

### General Availability - PIM alert: Alert on active-permanent role assignments in Azure or assignments made outside of PIM

**Type:** Fixed     
**Service category:** Privileged Identity Management                     
**Product capability:** Privileged Identity Management            

[Alert on Azure subscription role assignments made outside of Privileged Identity Management (PIM)](../privileged-identity-management/pim-resource-roles-configure-alerts.md) provides an alert in PIM for Azure subscription assignments made outside of PIM. An owner or User Access Administrator can take a quick remediation action to remove those assignments. 

---

### Public Preview - Enhanced Create User and Invite User Experiences

**Type:** Changed feature   
**Service category:** User Management                     
**Product capability:** User Management            

Admins can now define more properties when creating and inviting a user in the Entra admin portal. These improvements bring our UX to parity with our [Create User APIS](/graph/api/user-post-users). Additionally, admins can now add users to a group or administrative unit, and assign roles.  For more information, see: [Add or delete users using Azure Active Directory](../fundamentals/add-users-azure-active-directory.md).

---

### Public Preview - Azure AD Conditional Access protected actions

**Type:** Changed feature   
**Service category:** RBAC                    
**Product capability:** Access Control            

The protected actions public preview introduces the ability to apply Conditional Access to select permissions. When a user performs a protected action, they must satisfy Conditional Access policy requirements. For more information, see: [What are protected actions in Azure AD? (preview)](../roles/protected-actions-overview.md).

---

### Public Preview - Token Protection for Sign-in Sessions

**Type:** New feature   
**Service category:** Conditional Access                  
**Product capability:** User Authentication          

Token Protection for sign-in sessions is our first release on a road-map to combat attacks involving token theft and replay. It provides conditional access enforcement of token proof-of-possession for supported clients and services that ensure that access to specified resources is only from a device to which the user has signed in. For more information, see: [Conditional Access: Token protection (preview)](../conditional-access/concept-token-protection.md).

---

### General Availability- New limits on number and size of group secrets starting June 2023

**Type:** Plan for change  
**Service category:** Group Management                   
**Product capability:** Directory            

Starting in June 2023, the secrets stored on a single group can't exceed 48 individual secrets, or have a total size greater than 10KB across all secrets on a single group. Groups with more than 10KB of secrets will immediately stop working in June 2023. In June, groups exceeding 48 secrets are unable to increase the number of secrets they have, though they may still update or delete those secrets. We highly recommend reducing to fewer than 48 secrets by January 2024.

Group secrets are typically created when a group is assigned credentials to an app using Password-based single sign-on. To reduce the number of secrets assigned to a group, we recommend creating additional groups, and splitting up group assignments to your Password-based SSO applications across those new groups. For more information, see: [Add password-based single sign-on to an application](../manage-apps/configure-password-single-sign-on-non-gallery-applications.md).

---

### Public Preview - Authenticator Lite in Outlook

**Type:** New feature   
**Service category:** Microsoft Authenticator App                     
**Product capability:** User Authentication           

Authenticator Lite is an additional surface for AAD users to complete multifactor authentication using push notifications on their Android or iOS device. With Authenticator Lite, users can satisfy a multifactor authentication requirement from the convenience of a familiar app. Authenticator Lite is currently enabled in the Outlook mobile app. Users may receive a notification in their Outlook mobile app to approve or deny, or use the Outlook app to generate an OATH verification code that can be entered during sign-in. The *'Microsoft managed'* setting for this feature will be set to enabled on May 26th, 2023. This will enable the feature for all users in tenants where the feature is set to Microsoft managed. If you wish to change the state of this feature, please do so before May 26th, 2023. For more information, see: [How to enable Microsoft Authenticator Lite for Outlook mobile (preview)](../authentication/how-to-mfa-authenticator-lite.md).

---

### General Availability - Updated look and feel for Per-user MFA

**Type:** Plan for change   
**Service category:** MFA                       
**Product capability:** Identity Security & Protection             

As part of ongoing service improvements, we are making updates to the per-user MFA admin configuration experience to align with the look and feel of Azure. This change does not include any changes to the core functionality and will only include visual improvements.  For more information, see: [Enable per-user Azure AD Multi-Factor Authentication to secure sign-in events](../authentication/howto-mfa-userstates.md).

---

### General Availability - Additional terms of use audit logs will be turned off

**Type:**  Fixed     
**Service category:** Terms of Use                  
**Product capability:** AuthZ/Access Delegation          

Due to a technical issue, we have recently started to emit additional audit logs for terms of use. The additional audit logs will be turned off by the first of May and are tagged with the core directory service and the agreement category. If you have built a dependency on the additional audit logs, you must switch to the regular audit logs tagged with the terms of use service.

---

### General Availability - New Federated Apps available in Azure AD Application gallery - April 2023



**Type:** New feature   
**Service category:** Enterprise Apps                
**Product capability:** 3rd Party Integration          

In April 2023 we've added the following 10 new applications in our App gallery with Federation support:    

[iTel Alert](https://www.itelalert.nl/), [goFLUENT](../saas-apps/gofluent-tutorial.md), [StructureFlow](https://app.structureflow.co/), [StructureFlow AU](https://au.structureflow.co/), [StructureFlow CA](https://ca.structureflow.co/), [StructureFlow EU](https://eu.structureflow.co/), [StructureFlow USA](https://us.structureflow.co/), [Predict360 SSO](../saas-apps/predict360-sso-tutorial.md), [Cegid Cloud](https://www.cegid.com/fr/nos-produits/), [HashiCorp Cloud Platform (HCP)](../saas-apps/hashicorp-cloud-platform-hcp-tutorial.md), [O'Reilly learning platform](../saas-apps/oreilly-learning-platform-tutorial.md), [LeftClick Web Services – RoomGuide](https://www.leftclick.cloud/digital_signage), [LeftClick Web Services – Sharepoint](https://www.leftclick.cloud/digital_signage), [LeftClick Web Services – Presence](https://www.leftclick.cloud/presence), [LeftClick Web Services - Single Sign-On](https://www.leftclick.cloud/presence), [InterPrice Technologies](http://www.interpricetech.com/), [WiggleDesk SSO](https://wiggledesk.com/), [Application Experience with Mist](https://www.mist.com/), [Connect Plans 360](https://connectplans360.com.au/), [Proactis Rego Source-to-Contract](../saas-apps/proactis-rego-source-to-contract-tutorial.md), [Danomics](https://www.danomics.com/), [Fountain](../saas-apps/fountain-tutorial.md), [Theom](../saas-apps/theom-tutorial.md), [DDC Web](../saas-apps/ddc-web-tutorial.md), [Dozuki](../saas-apps/dozuki-tutorial.md).


You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial.

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest

---

### Public Preview - New provisioning connectors in the Azure AD Application Gallery - April 2023

**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration    
      

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Alvao](../saas-apps/alvao-provisioning-tutorial.md)
- [Better Stack](../saas-apps/better-stack-provisioning-tutorial.md)
- [BIS](../saas-apps/bis-provisioning-tutorial.md)
- [Connecter](../saas-apps/connecter-provisioning-tutorial.md)
- [Howspace](../saas-apps/howspace-provisioning-tutorial.md)
- [Kno2fy](../saas-apps/kno2fy-provisioning-tutorial.md)
- [Netsparker Enterprise](../saas-apps/netsparker-enterprise-provisioning-tutorial.md)
- [uniFLOW Online](../saas-apps/uniflow-online-provisioning-tutorial.md)


For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

### Public Preview - New PIM Azure resource picker

**Type:** Changed feature   
**Service category:** Privileged Identity Management                     
**Product capability:** End User Experiences            

With this new experience, PIM now automatically manages any type of resource in a tenant, so discovery and activation is no longer required. With the new resource picker, users can directly choose the scope they want to manage from the Management Group down to the resources themselves, making it faster and easier to locate the resources they need to administer. For more information, see: [Assign Azure resource roles in Privileged Identity Management](../privileged-identity-management/pim-resource-roles-assign-roles.md).

---

### General availability - Self Service Password Reset (SSPR) now supports PIM eligible users and indirect group role assignment

**Type:** Changed feature   
**Service category:** Self Service Password Reset                     
**Product capability:** Identity Security & Protection          

Self Service Password Reset (SSPR) can now PIM eligible users, and evaluate group-based memberships, along with direct memberships when checking if a user is in a particular administrator role. This capability provides more accurate SSPR policy enforcement by validating if users are in scope for the default SSPR admin policy or your organizations SSPR user policy.


For more information, see: 

- [Administrator reset policy differences](../authentication/concept-sspr-policy.md#administrator-reset-policy-differences).
- [Create a role-assignable group in Azure Active Directory](../roles/groups-create-eligible.md)

---


## March 2023


### Public Preview - New provisioning connectors in the Azure AD Application Gallery - March 2023

**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration    
      

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Acunetix 360](../saas-apps/acunetix-360-provisioning-tutorial.md)
- [Akamai Enterprise Application Access](../saas-apps/akamai-enterprise-application-access-provisioning-tutorial.md)
- [Ardoq](../saas-apps/ardoq-provisioning-tutorial.md)
- [Torii](../saas-apps/torii-provisioning-tutorial.md)


For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

### General Availability - Workload identity Federation for Managed Identities

**Type:** New feature   
**Service category:** Managed identities for Azure resources                     
**Product capability:** Developer Experience             

Workload Identity Federation enables developers to use managed identities for their software workloads running anywhere and access Azure resources without needing secrets. Key scenarios include:
- Accessing Azure resources from Kubernetes pods running in any cloud or on-premises
- GitHub workflows to deploy to Azure, no secrets necessary
- Accessing Azure resources from other cloud platforms that support OIDC, such as Google Cloud Platform.

For more information, see: 
- [Workload identity federation](../workload-identities/workload-identity-federation.md).
- [Configure a user-assigned managed identity to trust an external identity provider (preview)](../workload-identities/workload-identity-federation-create-trust-user-assigned-managed-identity.md)
- [Use Azure AD workload identity with Azure Kubernetes Service (AKS)](../../aks/workload-identity-overview.md)

---

### Public Preview - New My Groups Experience

**Type:** Changed feature   
**Service category:** Group Management                   
**Product capability:** End User Experiences          

A new and improved My Groups experience is now available at `https://www.myaccount.microsoft.com/groups`. My Groups enables end users to easily manage groups, such as finding groups to join, managing groups they own, and managing existing group memberships. Based on customer feedback, the new My Groups support sorting and filtering on lists of groups and group members, a full list of group members in large groups, and an actionable overview page for membership requests.
This experience replaces the existing My Groups experience at `https://www.mygroups.microsoft.com` in May.  


For more information, see: [Update your Groups info in the My Apps portal](https://support.microsoft.com/account-billing/update-your-groups-info-in-the-my-apps-portal-bc0ca998-6d3a-42ac-acb8-e900fb1174a4).

---

### Public preview - Customize tokens with Custom Claims Providers

**Type:** New feature   
**Service category:** Authentications (Logins)                      
**Product capability:** Extensibility             

A custom claims provider lets you call an API and map custom claims into the token during the authentication flow. The API call is made after the user has completed all their authentication challenges, and a token is about to be issued to the app. For more information, see: [Custom authentication extensions (preview)](../develop/custom-claims-provider-overview.md).

---

### General Availability - Converged Authentication Methods

**Type:** New feature   
**Service category:** MFA                     
**Product capability:** User Authentication             

The Converged Authentication Methods Policy enables you to manage all authentication methods used for MFA and SSPR in one policy, migrate off the legacy MFA and SSPR policies, and target authentication methods to groups of users instead of enabling them for all users in your tenant. For more information, see: [Manage authentication methods](../authentication/concept-authentication-methods-manage.md).

---

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

### General Availability - Number Matching for Microsoft Authenticator notifications

**Type:** Plan for Change  
**Service category:** Microsoft Authenticator App                      
**Product capability:** User Authentication             

Microsoft Authenticator app’s number matching feature has been Generally Available since Nov 2022! If you haven't already used the rollout controls (via Azure portal Admin UX and MSGraph APIs) to smoothly deploy number matching for users of Microsoft Authenticator push notifications, we highly encourage you to do so. We previously announced that we'll remove the admin controls and enforce the number match experience tenant-wide for all users of Microsoft Authenticator push notifications starting February 27, 2023. After listening to customers, we'll extend the availability of the rollout controls for a few more weeks. Organizations can continue to use the existing rollout controls until May 8, 2023, to deploy number matching in their organizations. Microsoft services will start enforcing the number matching experience for all users of Microsoft Authenticator push notifications after May 8, 2023. We'll also remove the rollout controls for number matching after that date.

If customers don’t enable number match for all Microsoft Authenticator push notifications prior to May 8, 2023, Authenticator users may experience inconsistent sign-ins while the services are rolling out this change. To ensure consistent behavior for all users, we highly recommend you enable number match for Microsoft Authenticator push notifications in advance.

For more information, see: [How to use number matching in multifactor authentication (MFA) notifications - Authentication methods policy](../authentication/how-to-mfa-number-match.md)

---

### Public Preview - IPv6 coming to Azure AD

**Type:** Plan for Change     
**Service category:** Identity Protection                     
**Product capability:** Platform             

Earlier, we announced our plan to bring IPv6 support to Microsoft Azure Active Directory (Azure AD), enabling our customers to reach the Azure AD services over IPv4, IPv6 or dual stack endpoints. This is just a reminder that we have started introducing IPv6 support into Azure AD services in a phased approach in late March 2023.  
 
If you utilize Conditional Access or Identity Protection, and have IPv6 enabled on any of your devices, you likely must take action to avoid impacting your users. For most customers, IPv4 won't completely disappear from their digital landscape, so we aren't planning to require IPv6 or to deprioritize IPv4 in any Azure AD features or services. We'll continue to share additional guidance on IPv6 enablement in Azure AD at this link: [IPv6 support in Azure Active Directory](/troubleshoot/azure/active-directory/azure-ad-ipv6-support).

---

### General Availability - Microsoft cloud settings for Azure AD B2B

**Type:** New feature  
**Service category:** B2B              
**Product capability:** B2B/B2C       

Microsoft cloud settings let you collaborate with organizations from different Microsoft Azure clouds. With Microsoft cloud settings, you can establish mutual B2B collaboration between the following clouds:

- Microsoft Azure commercial and Microsoft Azure Government
- Microsoft Azure commercial and Microsoft Azure China 21Vianet

For more information about Microsoft cloud settings for B2B collaboration, see [Microsoft cloud settings](../external-identities/cross-tenant-access-overview.md#microsoft-cloud-settings).

---

### Modernizing Terms of Use Experiences

**Type:** Plan for Change  
**Service category:** Terms of use                  
**Product capability:** AuthZ/Access Delegation        

Starting July 2023, we're modernizing the following Terms of Use end user experiences with an updated PDF viewer, and moving the experiences from https://account.activedirectory.windowsazure.com to https://myaccount.microsoft.com:
- View previously accepted terms of use.
- Accept or decline terms of use as part of the sign-in flow.

No functionalities will be removed. The new PDF viewer adds functionality and the limited visual changes in the end-user experiences will be communicated in a future update. If your organization has allow-listed only certain domains, you must ensure your allowlist includes the domains ‘myaccount.microsoft.com’ and ‘*.myaccount.microsoft.com’ for Terms of Use to continue working as expected.

---

## February 2023

### General Availability - Expanding Privileged Identity Management Role Activation across the Azure portal

**Type:** New feature   
**Service category:** Privileged Identity Management                    
**Product capability:** Privileged Identity Management           

Privileged Identity Management (PIM) role activation has been expanded to the Billing and AD extensions in the Azure portal. Shortcuts have been added to Subscriptions (billing) and Access Control (AD) to allow users to activate PIM roles directly from these blades. From the Subscriptions blade, select **View eligible subscriptions** in the horizontal command menu to check your eligible, active, and expired assignments. From there, you can activate an eligible assignment in the same pane. In Access control (IAM) for a resource, you can now select **View my access** to see your currently active and eligible role assignments and activate directly. By integrating PIM capabilities into different Azure portal blades, this new feature allows users to gain temporary access to view or edit subscriptions and resources more easily.


For more information Microsoft cloud settings, see: [Activate my Azure resource roles in Privileged Identity Management](../privileged-identity-management/pim-resource-roles-activate-your-roles.md).

---

### General Availability - Follow Azure AD best practices with recommendations

**Type:** New feature   
**Service category:** Reporting                  
**Product capability:** Monitoring & Reporting            

Azure AD recommendations help you improve your tenant posture by surfacing opportunities to implement best practices. On a daily basis, Azure AD analyzes the configuration of your tenant. During this analysis, Azure AD compares the data of a recommendation with the actual configuration of your tenant. If a recommendation is flagged as applicable to your tenant, the recommendation appears in the Recommendations section of the Azure AD Overview. 

This release includes our first 3 recommendations:

- Convert from per-user MFA to Conditional Access MFA
- Migration applications from AD FS to Azure AD
- Minimize MFA prompts from known devices


For more information, see: 

- [What are Azure Active Directory recommendations?](../reports-monitoring/overview-recommendations.md)
- [Use the Azure AD recommendations API to implement Azure AD best practices for your tenant](/graph/api/resources/recommendations-api-overview)

---

### Public Preview - Azure AD PIM + Conditional Access integration

**Type:** New feature   
**Service category:** Privileged Identity Management                    
**Product capability:** Privileged Identity Management               

Now you can require users who are eligible for a role to satisfy Conditional Access policy requirements for activation: use specific authentication method enforced through Authentication Strengths, activate from Intune compliant device, comply with Terms of Use, and use 3rd party MFA and satisfy location requirements.

For more information, see: [Configure Azure AD role settings in Privileged Identity Management](../privileged-identity-management/pim-how-to-change-default-settings.md).


---

### General Availability - More information on why a sign-in was flagged as "unfamiliar"

**Type:** Changed feature   
**Service category:** Identity Protection                    
**Product capability:** Identity Security & Protection           

Unfamiliar sign-in properties risk detection now provides risk reasons as to which properties are unfamiliar for customers to better investigate that risk. 

Identity Protection now surfaces the unfamiliar properties in the Azure portal on UX and in API as *Additional Info* with a user-friendly description explaining that *the following properties are unfamiliar for this sign-in of the given user*. 

There's no additional work to enable this feature, the unfamiliar properties are shown by default. For more information, see: [Sign-in risk](../identity-protection/concept-identity-protection-risks.md#sign-in-risk).


---

### General Availability - New Federated Apps available in Azure AD Application gallery - February 2023



**Type:** New feature   
**Service category:** Enterprise Apps                
**Product capability:** 3rd Party Integration          

In February 2023 we've added the following 10 new applications in our App gallery with Federation support:    

[PROCAS](https://accounting.procas.com/), [Tanium Cloud SSO](../saas-apps/tanium-cloud-sso-tutorial.md), [LeanDNA](../saas-apps/leandna-tutorial.md), [CalendarAnything LWC](https://silverlinecrm.com/calendaranything/), [courses.work](../saas-apps/courseswork-tutorial.md), [Udemy Business SAML](../saas-apps/udemy-business-saml-tutorial.md), [Canva](../saas-apps/canva-tutorial.md), [Kno2fy](../saas-apps/kno2fy-tutorial.md), [IT-Conductor](../saas-apps/it-conductor-tutorial.md), [ナレッジワーク(Knowledge Work)](../saas-apps/knowledge-work-tutorial.md), [Valotalive Digital Signage Microsoft 365 integration](https://store.valotalive.com/#main), [Priority Matrix HIPAA](https://hipaa.prioritymatrix.com/), [Priority Matrix Government](https://hipaa.prioritymatrix.com/), [Beable](../saas-apps/beable-tutorial.md), [Grain](https://grain.com/app?dialog=integrations&integration=microsoft+teams), [DojoNavi](../saas-apps/dojonavi-tutorial.md), [Global Validity Access Manager](https://myaccessmanager.com/), [FieldEquip](https://app.fieldequip.com/), [Peoplevine](https://control.peoplevine.com/), [Respondent](../saas-apps/respondent-tutorial.md), [WebTMA](../saas-apps/webtma-tutorial.md), [ClearIP](https://clearip.com/login), [Pennylane](../saas-apps/pennylane-tutorial.md), [VsimpleSSO](https://app.vsimple.com/login), [Compliance Genie](../saas-apps/compliance-genie-tutorial.md), [Dataminr Corporate](https://dmcorp.okta.com/), [Talon](../saas-apps/talon-tutorial.md). 


You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial.

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest

---

### Public Preview - New provisioning connectors in the Azure AD Application Gallery - February 2023

**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration    
      

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Atmos](../saas-apps/atmos-provisioning-tutorial.md)


For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

## January 2023

### Public Preview - Cross-tenant synchronization

**Type:** New feature   
**Service category:** Provisioning               
**Product capability:** Collaboration          

Cross-tenant synchronization allows you to set up a scalable and automated solution for users to access applications across tenants in your organization. It builds upon the Azure AD B2B functionality and automates creating, updating, and deleting B2B users. For more information, see: [What is cross-tenant synchronization? (preview)](../multi-tenant-organizations/cross-tenant-synchronization-overview.md).


---

### Public Preview - Devices option Self-Help Capability for Pending Devices



**Type:** New feature   
**Service category:** Device Access Management                
**Product capability:** End User Experiences          

In the **All Devices** options under the registered column, you can now select any pending devices you have, and it opens a context pane to help troubleshoot why the device may be pending. You can also offer feedback on if the summarized information is helpful or not. For more information, see: [Pending devices in Azure Active Directory](/troubleshoot/azure/active-directory/pending-devices).


---

### General Availability - Apple Watch companion app removed from Authenticator for iOS



**Type:**  Deprecated      
**Service category:** Identity Protection                
**Product capability:** Identity Security & Protection          

In the January 2023 release of Authenticator for iOS, there's no companion app for watchOS due to it being incompatible with Authenticator security features, meaning you aren't able to install or use Authenticator on Apple Watch. This change only impacts Apple Watch, so you can still use Authenticator on your other devices. For more information, see: [Common questions about the Microsoft Authenticator app](https://support.microsoft.com/account-billing/common-questions-about-the-microsoft-authenticator-app-12d283d1-bcef-4875-9ae5-ac360e2945dd).


---

### General Availability - New Federated Apps available in Azure AD Application gallery - January 2023



**Type:** New feature   
**Service category:** Enterprise Apps                
**Product capability:** 3rd Party Integration          

In January 2023 we've added the following 10 new applications in our App gallery with Federation support:

[MINT TMS](../saas-apps/mint-tms-tutorial.md),  [Exterro Legal GRC Software Platform](../saas-apps/exterro-legal-grc-software-platform-tutorial.md), [SIX.ONE Identity Access Manager](https://portal.six.one/), [Lusha](../saas-apps/lusha-tutorial.md), [Descartes](../saas-apps/descartes-tutorial.md), [Travel Management System](https://tms.billetkontoret.dk/), [Pinpoint (SAML)](../saas-apps/pinpoint-tutorial.md), [my.sdworx.com](../saas-apps/mysdworxcom-tutorial.md), [itopia Labs](https://labs.itopia.com/), [Better Stack](https://betteruptime.com/users/sign-up).

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial.

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest


---

### Public Preview - New provisioning connectors in the Azure AD Application Gallery - January 2023



**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration         

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [SurveyMonkey Enterprise](../saas-apps/surveymonkey-enterprise-provisioning-tutorial.md)


For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

### Public Preview - Azure AD cloud sync new user experience


**Type:** Changed feature   
**Service category:** Azure AD Connect Cloud Sync                  
**Product capability:** Identity Governance         

Try out the new guided experience for syncing objects from AD to Azure AD using Azure AD Cloud Sync in Azure portal. With this new experience, Hybrid Identity Administrators can easily determine which sync engine to use for their scenarios and learn more about the various options they have with our sync solutions. With a rich set of tutorials and videos, customers are able to learn everything about Azure AD cloud sync in one single place. 

This experience helps administrators walk through the different steps involved in setting up a cloud sync configuration and an intuitive experience to help them easily manage it. Admins can also get insights into their sync configuration by using the "Insights" option, which integrates with Azure Monitor and Workbooks. 

For more information, see:

- [Create a new configuration for Azure AD Connect cloud sync](../cloud-sync/how-to-configure.md)
- [Attribute mapping in Azure AD Connect cloud sync](../cloud-sync/how-to-attribute-mapping.md)
- [Azure AD cloud sync insights workbook](../cloud-sync/how-to-cloud-sync-workbook.md)

---

### Public Preview - Support for Directory Extensions using Azure AD cloud sync



**Type:** New feature   
**Service category:** Provisioning               
**Product capability:** Azure AD Connect Cloud Sync         

Hybrid IT Admins now can sync both Active Directory and Azure AD Directory Extensions using Azure AD Cloud Sync. This new capability adds the ability to dynamically discover the schema for both Active Directory and Azure AD, allowing customers to map the needed attributes using Cloud Sync's attribute mapping experience. 

For more information on how to enable this feature, see: [Cloud Sync directory extensions and custom attribute mapping](../cloud-sync/custom-attribute-mapping.md)


---

## December 2022

### Public Preview - Windows 10+ Troubleshooter for Diagnostic Logs



**Type:** New feature   
**Service category:** Audit             
**Product capability:** Monitoring & Reporting       

This feature analyzes uploaded client-side logs, also known as diagnostic logs, from a Windows 10+ device that is having an issue(s) and suggests remediation steps to resolve the issue(s). Admins can work with end user to collect client-side logs, and then upload them to this troubleshooter in the Entra Portal. For more information, see: [Troubleshooting Windows devices in Azure AD](../devices/troubleshoot-device-windows-joined.md).


---

### General Availability - Multiple Password-less Phone Sign-ins for iOS Devices



**Type:** New feature   
**Service category:** Authentications (Logins)            
**Product capability:** User Authentication     

End users can now enable password-less phone sign-in for multiple accounts in the Authenticator App on any supported iOS device. Consultants, students, and others with multiple accounts in Azure AD can add each account to Microsoft Authenticator and use password-less phone sign-in for all of them from the same iOS device. The Azure AD accounts can be in the same tenant or different tenants. Guest accounts aren't supported for multiple account sign-ins from one device.


End users aren't required to enable the optional telemetry setting in the Authenticator App. For more information, see: [Enable passwordless sign-in with Microsoft Authenticator](../authentication/howto-authentication-passwordless-phone.md).


---

### Public Preview(refresh) - Updates to Conditional Access templates 



**Type:** Changed feature   
**Service category:** Conditional Access             
**Product capability:** Identity Security & Protection        

Conditional Access templates provide a convenient method to deploy new policies aligned with Microsoft recommendations. In total, there are 14 Conditional Access policy templates, filtered by five different scenarios; secure foundation, zero trust, remote work, protect administrators, and emerging threats.  
 
In this Public Preview refresh, we've enhanced the user experience with an updated design and added four new improvements: 
 
- Admins can create a Conditional Access policy by importing a JSON file.
- Admins can duplicate existing policy.
- Admins can view more detailed policy information.
- Admins can query templates programmatically via MSGraph API.


For more information, see: [Conditional Access templates (Preview)](../conditional-access/concept-conditional-access-policy-common.md).

---

### Public Preview - Admins can restrict their users from creating tenants



**Type:** New feature   
**Service category:** User Access Management             
**Product capability:** User Management       

The ability for users to create tenants from the Manage Tenant overview has been present in Azure AD since almost the beginning of the Azure portal. This new capability in the User Settings option allows admins to restrict their users from being able to create new tenants. There's also a new [Tenant Creator](../roles/permissions-reference.md#tenant-creator) role to allow specific users to create tenants. For more information, see [Default user permissions](../fundamentals/users-default-permissions.md#restrict-member-users-default-permissions).


---

### General availability - Consolidated App launcher (My Apps) settings and new preview settings



**Type:** New feature   
**Service category:** My Apps            
**Product capability:** End User Experiences      

We have consolidated relevant app launcher settings in a new App launchers section in the Azure and Entra portals. The entry point can be found under Enterprise applications, where Collections used to be. You can find the Collections option by selecting App launchers. In addition, we've added a new App launchers Settings option. This option has some settings you may already be familiar with like the Microsoft 365 settings. The new Settings options also have controls for previews. As an admin, you can choose to try out new app launcher features while they are in preview. Enabling a preview feature means that the feature turns on for your organization. This enabled feature reflects in the My Apps portal, and other app launchers for all of your users. To learn more about the preview settings, see: [End-user experiences for applications](../manage-apps/end-user-experiences.md).


---

### Public preview - Converged Authentication Methods Policy



**Type:** New feature   
**Service category:** MFA          
**Product capability:** User Authentication     

The Converged Authentication Methods Policy enables you to manage all authentication methods used for MFA and SSPR in one policy. You can migrate off the legacy MFA and SSPR policies, and target authentication methods to groups of users instead of enabling them for all users in the tenant. For more information, see: [Manage authentication methods for Azure AD](../authentication/concept-authentication-methods-manage.md).


---

### General Availability - Administrative unit support for devices



**Type:** New feature   
**Service category:** Directory Management             
**Product capability:** AuthZ/Access Delegation       

You can now use administrative units to delegate management of specified devices in your tenant by adding devices to an administrative unit. You're also able to assign built-in, and custom device management roles, scoped to that administrative unit. For more information, see: [Device management](../roles/administrative-units.md#device-management).


---

### Public Preview - Frontline workers using shared devices can now use Microsoft Edge and Yammer apps on Android



**Type:** New feature   
**Service category:** N/A          
**Product capability:** SSO       

Companies often provide mobile devices to frontline workers that need are shared between shifts. Microsoft’s shared device mode allows frontline workers to easily authenticate by automatically signing users in and out of all the apps that have enabled this feature. In addition to Microsoft Teams and Managed Home Screen being generally available, we're excited to announce that Microsoft Edge and Yammer apps on Android are now in Public Preview.

For more information on deploying frontline solutions, see: [frontline deployment documentation](https://aka.ms/frontlinewhitepaper).


For more information on shared-device mode, see: [Azure Active Directory Shared Device Mode documentation](../develop/msal-android-shared-devices.md#microsoft-applications-that-support-shared-device-mode).


For steps to set up shared device mode with Intune, see: [Intune setup blog](https://techcommunity.microsoft.com/t5/intune-customer-success/enroll-android-enterprise-dedicated-devices-into-azure-ad-shared/ba-p/1820093). 


---

### Public preview - New provisioning connectors in the Azure AD Application Gallery - December 2022



**Type:** New feature   
**Service category:** App Provisioning             
**Product capability:** 3rd Party Integration     

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [GHAE](../saas-apps/ghae-provisioning-tutorial.md)


For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

### General Availability - On-premises application provisioning



**Type:** Changed feature   
**Service category:** Provisioning            
**Product capability:** Outbound to On-premises Applications        

Azure AD supports provisioning users into applications hosted on-premises or in a virtual machine, without having to open up any firewalls. If your application supports [SCIM](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010), or you've built a SCIM gateway to connect to your legacy application, you can use the Azure AD Provisioning agent to [directly connect](../app-provisioning/on-premises-scim-provisioning.md) with your application and automate provisioning and deprovisioning. If you have legacy applications that don't support SCIM and rely on an [LDAP](../app-provisioning/on-premises-ldap-connector-configure.md) user store, or a [SQL](../app-provisioning/tutorial-ecma-sql-connector.md) database, Azure AD can support those as well.


---

### General Availability - New Federated Apps available in Azure AD Application gallery - December 2022



**Type:** New feature   
**Service category:** Enterprise Apps              
**Product capability:** 3rd Party Integration         

In December 2022 we've added the following 44 new applications in our App gallery with Federation support:

[Bionexo IDM](https://login.bionexo.com/), [SMART Meeting Pro](https://www.smarttech.com/en/business/software/meeting-pro), [Venafi Control Plane – Datacenter](../saas-apps/venafi-control-plane-tutorial.md), [HighQ](../saas-apps/highq-tutorial.md), [Drawboard PDF](https://pdf.drawboard.com/), [ETU Skillsims](../saas-apps/etu-skillsims-tutorial.md), [TencentCloud IDaaS](../saas-apps/tencent-cloud-idaas-tutorial.md), [TeamHeadquarters Email Agent OAuth](https://thq.entry.com/), [Verizon MDM](https://verizonmdm.vzw.com/), [QRadar SOAR](../saas-apps/qradar-soar-tutorial.md), [Tripwire Enterprise](../saas-apps/tripwire-enterprise-tutorial.md), [Cisco Unified Communications Manager](../saas-apps/cisco-unified-communications-manager-tutorial.md), [Howspace](https://login.in.howspace.com/), [Flipsnack SAML](../saas-apps/flipsnack-saml-tutorial.md), [Albert](http://www.albertinvent.com/), [Altinget.no](https://www.altinget.no/), [Coveo Hosted Services](../saas-apps/coveo-hosted-services-tutorial.md), [Cybozu(cybozu.com)](../saas-apps/cybozu-tutorial.md), [BombBomb](https://app.bombbomb.com/app), [VMware Identity Service](../saas-apps/vmware-identity-service-tutorial.md), [HexaSync](https://app-az.hexasync.com/login), [Trifecta Teams](https://app.trifectateams.net/), [VerosoftDesign](https://verosoft-design.vercel.app/), [Mazepay](https://app.mazepay.com/), [Wistia](../saas-apps/wistia-tutorial.md), [Begin.AI](https://app.begin.ai/), [WebCE](../saas-apps/webce-tutorial.md), [Dream Broker Studio](https://dreambroker.com/studio/login/), [PKSHA Chatbot](../saas-apps/pksha-chatbot-tutorial.md), [PGM-BCP](https://ups-pgm-bcp.4gfactor.com/azure/), [ChartDesk SSO](../saas-apps/chartdesk-sso-tutorial.md), [Elsevier SP](../saas-apps/elsevier-sp-tutorial.md), [GreenCommerce IdentityServer](https://identity.jem-id.nl/Account/Login), [Fullview](https://app.fullview.io/sign-in), [Aqua Platform](../saas-apps/aqua-platform-tutorial.md), [SpedTrack](../saas-apps/spedtrack-tutorial.md), [Pinpoint](https://pinpoint.ddiworld.com/psg2?sso=true), [Darzin Outlook Add-in](https://outlook.darzin.com/graph-login.html), [Simply Stakeholders Outlook Add-in](https://outlook.simplystakeholders.com/graph-login.html), [tesma](../saas-apps/tesma-tutorial.md), [Parkable](../saas-apps/parkable-tutorial.md), [Unite Us](../saas-apps/unite-us-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest

---

### ADAL End of Support Announcement

**Type:** N/A      
**Service category:** Other               
**Product capability:** Developer Experience         

As part of our ongoing initiative to improve the developer experience, service reliability, and security of customer applications, we'll end support for the Azure Active Directory Authentication Library (ADAL). The final deadline to migrate your applications to Azure Active Directory Authentication Library (MSAL) has been extended to **June 30, 2023**. 

### Why are we doing this?

As we consolidate and evolve the Microsoft Identity platform, we're also investing in making significant improvements to the developer experience and service features that make it possible to build secure, robust and resilient applications. To make these features available to our customers, we needed to update the architecture of our software development kits. As a result of this change, we’ve decided that the path forward requires us to sunset Azure Active Directory Authentication Library. This allows us to focus on developer experience investments with Azure Active Directory Authentication Library. 

### What happens?

We recognize that changing libraries isn't an easy task, and can't be accomplished quickly. We're committed to helping customers plan their migrations to Microsoft Authentication Library and execute them with minimal disruption.

- In June 2020, we [announced the 2-year end of support timeline for ADAL](https://devblogs.microsoft.com/microsoft365dev/end-of-support-timelines-for-azure-ad-authentication-library-adal-and-azure-ad-graph/). 
- In December 2022, we’ve decided to extend the Azure Active Directory Authentication Library end of support to June 2023. 
- Through the next six months (January 2023 – June 2023) we continue informing customers about the upcoming end of support along with providing guidance on migration. 
- On June 2023 we'll officially sunset Azure Active Directory Authentication Library, removing library documentation and archiving all GitHub repositories related to the project. 

### How to find out which applications in my tenant are using Azure Active Directory Authentication Library?

Refer to our post on [Microsoft Q&A](/answers/questions/360928/information-how-to-find-apps-using-adal-in-your-te.html) for details on identifying Azure Active Directory Authentication Library apps with the help of [Azure Workbooks](../../azure-monitor/visualize/workbooks-overview.md). 
### If I’m using Azure Active Directory Authentication Library, what can I expect after the deadline? 

- There will be no new releases (security or otherwise) to the library after June 2023. 
- We won't accept any incident reports or support requests for Azure Active Directory Authentication Library. Azure Active Directory Authentication Library to Microsoft Authentication Library migration support would continue.   
- The underpinning services continue working and applications that depend on Azure Active Directory Authentication Library should continue working. Applications, and the resources they access, are at increased security and reliability risk due to not having the latest updates, service configuration, and enhancements made available through the Microsoft Identity platform. 

### What features can I only access with Microsoft Authentication Library?
 
The number of features and capabilities that we're adding to Microsoft Authentication Library libraries are growing weekly. Some of them include: 
- Support for Microsoft accounts (MSA) 
- Support for Azure AD B2C accounts 
- Handling throttling 
- Proactive token refresh and token revocation based on policy or critical events for Microsoft Graph and other APIs that support [Continuous Access Evaluation (CAE)](../develop/app-resilience-continuous-access-evaluation.md)
- Auth broker support with device-based conditional access policies 
- Azure AD hardware-based certificate authentication (CBA) on mobile  
- System browsers on mobile devices 
And more. For an up-to-date list, refer to our [migration guide](../develop/msal-migration.md#how-to-migrate-to-msal). 

### How to migrate? 

To make the migration process easier, we published a [comprehensive guide](../develop/msal-migration.md#how-to-migrate-to-msal) that documents the migration paths across different platforms and programming languages. 

In addition to the Azure Active Directory Authentication Library to Microsoft Authentication Library update, we recommend migrating from Azure AD Graph API to Microsoft Graph. This change enables you to take advantage of the latest additions and enhancements, such as CAE, across the Microsoft service offering through a single, unified endpoint. You can read more in our [Migrate your apps from Azure AD Graph to Microsoft Graph](/graph/migrate-azure-ad-graph-overview) guide. You can post any questions to [Microsoft Q&A](/answers/topics/azure-active-directory.html) or [Stack Overflow](https://stackoverflow.com/questions/tagged/msal).

---

## November 2022

### General Availability - Use Web Sign-in on Windows for password-less recovery with Temporary Access Pass



**Type:** Changed feature   
**Service category:** N/A          
**Product capability:** User Authentication     

The Temporary Access Pass can now be used to recover Azure AD-joined PCs when the EnableWebSignIn policy is enabled on the device. This is useful for when your users don't know, or have, a password. For more information, see: [Authentication/EnableWebSignIn](/windows/client-management/mdm/policy-csp-authentication#authentication-enablewebsignin).


---

### Public Preview - Workload Identity Federation for Managed Identities



**Type:** New feature   
**Service category:** Managed identities for Azure resources         
**Product capability:** Developer Experience       

Developers can now use managed identities for their software workloads running anywhere, and for accessing Azure resources, without needing secrets. Key scenarios include:

- Accessing Azure resources from Kubernetes pods running on-premises or in any cloud.
- GitHub workflows to deploy to Azure, no secrets necessary.
- Accessing Azure resources from other cloud platforms that support OIDC, such as Google Cloud.

For more information, see: 
- [Configure a user-assigned managed identity to trust an external identity provider (preview)](../develop/workload-identity-federation-create-trust-user-assigned-managed-identity.md)
- [Workload identity federation](../develop/workload-identity-federation.md)
- [Use an Azure AD workload identity (preview) on Azure Kubernetes Service (AKS)](../../aks/workload-identity-overview.md)


---

### General Availability - Authenticator on iOS is FIPS 140 compliant



**Type:** New feature   
**Service category:** Microsoft Authenticator App              
**Product capability:** User Authentication     

Authenticator version 6.6.8 and higher on iOS will be FIPS 140 compliant for all Azure AD authentications using push multi-factor authentications (MFA), Password-less Phone Sign-In (PSI), and time-based one-time pass-codes (TOTP). No changes in configuration are required in the Authenticator app or Azure portal to enable this capability. For more information, see: [FIPS 140 compliant for Azure AD authentication](../authentication/concept-authentication-authenticator-app.md#fips-140-compliant-for-azure-ad-authentication).


---

### General Availability - New Federated Apps available in Azure AD Application gallery - November 2022



**Type:** New feature   
**Service category:** Enterprise Apps                 
**Product capability:** 3rd Party Integration        

In November 2022, we've added the following 22 new applications in our App gallery with Federation support

[Adstream](../saas-apps/adstream-tutorial.md), [Databook](../saas-apps/databook-tutorial.md), [Ecospend IAM](https://ecospend.com/), [Digital Pigeon](../saas-apps/digital-pigeon-tutorial.md), [Drawboard Projects](../saas-apps/drawboard-projects-tutorial.md), [Vellum](https://www.vellum.ink/request-demo), [Veracity](https://aie-veracity.com/connect/azure), [Microsoft OneNote to Bloomberg Note Sync](https://www.bloomberg.com/professional/support/software-updates/), [DX NetOps Portal](../saas-apps/dx-netops-portal-tutorial.md), [itslearning Outlook integration](https://itslearning.com/global/), [Tranxfer](../saas-apps/tranxfer-tutorial.md), [Occupop](https://app.occupop.com/), [Nialli Workspace](https://ws.nialli.com/), [Tideways](https://app.tideways.io/login), [SOWELL](https://manager.sowellapp.com/#/?sso=true), [Prewise Learning](https://prewiselearning.com/), [CAPTOR for Intune](https://www.inkscreen.com/microsoft), [wayCloud Platform](https://app.way-cloud.de/login), [Nura Space Meeting Room](https://play.google.com/store/apps/details?id=com.meetingroom.prod), [Flexopus Exchange Integration](https://help.flexopus.com/de/microsoft-graph-integration), [Ren Systems](https://app.rensystems.com/login), [Nudge Security](https://www.nudgesecurity.io/login)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest


---

### General Availability - New provisioning connectors in the Azure AD Application Gallery - November 2022



**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration        

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Keepabl](../saas-apps/keepabl-provisioning-tutorial.md)
- [Uber](../saas-apps/uber-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

### Public Preview - Dynamic Group pause functionality 



**Type:** New feature   
**Service category:** Group Management           
**Product capability:** Directory     

Admins can now pause, and resume, the processing of individual dynamic groups in the Entra Admin Center. For more information, see: [Create or update a dynamic group in Azure Active Directory](../enterprise-users/groups-create-rule.md).


---

### Public Preview - Enabling extended customization capabilities for sign-in and sign-up pages in Company Branding capabilities.



**Type:** New feature   
**Service category:** Authentications (Logins)          
**Product capability:** User Authentication     

Update the Azure AD and Microsoft 365 sign-in experience with new company branding capabilities. You can apply your company’s brand guidance to authentication experiences with pre-defined templates. For more information, see: [Configure your company branding](../fundamentals/customize-branding.md).


---

### Public Preview - Enabling customization capabilities for the Self-Service Password Reset (SSPR) hyperlinks, footer hyperlinks and browser icons in Company Branding.



**Type:** New feature   
**Service category:** Directory Management             
**Product capability:** Directory       

Update the company branding functionality on the Azure AD/Microsoft 365 sign-in experience to allow customizing Self Service Password Reset (SSPR) hyperlinks, footer hyperlinks and browser icon. For more information, see: [Configure your company branding](../fundamentals/customize-branding.md).


---

### General Availability - Soft Delete for Administrative Units



**Type:** New feature   
**Service category:** Directory Management           
**Product capability:** Directory      

Administrative Units now support soft deletion. Admins can now list, view properties of, or restore deleted Administrative Units using the Microsoft Graph. This functionality restores all configuration for the Administrative Unit when restored from soft delete, including memberships, admin roles, processing rules, and processing rules state.

This functionality greatly enhances recoverability and resilience when using Administrative Units. Now, when an Administrative Unit is accidentally deleted, you can restore it quickly to the same state it was at time of deletion. This removes uncertainty around configuration and makes restoration quick and easy. For more information, see: [List deletedItems (directory objects)](/graph/api/directory-deleteditems-list).


---

### Public Preview - IPv6 coming to Azure AD



**Type:** Plan for change      
**Service category:** Identity Protection            
**Product capability:** Platform     

With the growing adoption and support of IPv6 across enterprise networks, service providers, and devices, many customers are wondering if their users can continue to access their services and applications from IPv6 clients and networks. Today, we’re excited to announce our plan to bring IPv6 support to Microsoft Azure Active Directory (Azure AD). This allows customers to reach the Azure AD services over both IPv4 and IPv6 network protocols (dual stack).
For most customers, IPv4 won't completely disappear from their digital landscape, so we aren't planning to require IPv6 or to de-prioritize IPv4 in any Azure Active Directory features or services.
We'll begin introducing IPv6 support into Azure AD services in a phased approach, beginning March 31, 2023.
We have guidance that is specifically for Azure AD customers who use IPv6 addresses and also use Named Locations in their Conditional Access policies.

Customers who use named locations to identify specific network boundaries in their organization need to:
1. Conduct an audit of existing named locations to anticipate potential risk.
1. Work with your network partner to identify egress IPv6 addresses in use in your environment.
1. Review and update existing named locations to include the identified IPv6 ranges.

Customers who use Conditional Access location based policies to restrict and secure access to their apps from specific networks need to:
1. Conduct an audit of existing Conditional Access policies to identify use of named locations as a condition to anticipate potential risk.
1. Review and update existing Conditional Access location based policies to ensure they continue to meet your organization’s security requirements.

We continue to share additional guidance on IPv6 enablement in Azure AD at this link: https://aka.ms/azureadipv6.


---

