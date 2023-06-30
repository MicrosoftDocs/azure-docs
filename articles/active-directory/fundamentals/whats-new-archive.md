---
title: Archive for What's new in Azure Active Directory?
description: The What's new release notes in the Overview section of this content set contain six months of activity. After six months, the items are removed from the main article and put into this archive article.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 1/31/2022
ms.author: owinfrey
ms.reviewer: dhanyahk
ms.custom: it-pro, seo-update-azuread-jan, has-adal-ref
ms.collection: M365-identity-device-management
---

# Archive for What's new in Azure Active Directory?

The primary [What's new in Azure Active Directory? release notes](whats-new.md) article contains updates for the last six months, while this article contains all the older information.

The What's new in Azure Active Directory? release notes provide information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

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


## October 2022

### General Availability - Upgrade Azure AD Provisioning agent to the latest version (version number: 1.1.977.0)



**Type:** Plan for change     
**Service category:** Provisioning         
**Product capability:** Azure AD Connect Cloud Sync        

Microsoft stops support for Azure AD provisioning agent with versions 1.1.818.0 and below starting Feb 1,2023. If you're using Azure AD cloud sync, make sure you have the latest version of the agent. You can view info about the agent release history [here](../app-provisioning/provisioning-agent-release-version-history.md). You can download the latest version [here](https://download.msappproxy.net/Subscription/d3c8b69d-6bf7-42be-a529-3fe9c2e70c90/Connector/provisioningAgentInstaller)

You can find out which version of the agent you're using as follows:

1. Going to the domain server that you have the agent installed
1. Right-click on the Microsoft Azure AD Connect Provisioning Agent app
1. Select on “Details” tab and you can find the version number there

> [!NOTE]
> Azure Active Directory (AD) Connect follows the [Modern Lifecycle Policy](/lifecycle/policies/modern). Changes for products and services under the Modern Lifecycle Policy may be more frequent and require customers to be alert for forthcoming modifications to their product or service.
Product governed by the Modern Policy follow a [continuous support and servicing model](/lifecycle/overview/product-end-of-support-overview). Customers must take the latest update to remain supported. For products and services governed by the Modern Lifecycle Policy, Microsoft's policy is to provide a minimum 30 days' notification when customers are required to take action in order to avoid significant degradation to the normal use of the product or service.

---

### General Availability - Add multiple domains to the same SAML/Ws-Fed based identity provider configuration for your external users



**Type:** New feature   
**Service category:** B2B        
**Product capability:** B2B/B2C   

An IT admin can now add multiple domains to a single SAML/WS-Fed identity provider configuration to invite users from multiple domains to authenticate from the same identity provider endpoint. For more information, see: [Federation with SAML/WS-Fed identity providers for guest users](../external-identities/direct-federation.md).


---

### General Availability - Limits on the number of configured API permissions for an application registration enforced starting in October 2022



**Type:** Plan for change   
**Service category:** Other     
**Product capability:** Developer Experience   

In the end of October, the total number of required permissions for any single application registration must not exceed 400 permissions across all APIs. Applications exceeding the limit are unable to increase the number of permissions configured for. The existing limit on the number of distinct APIs for permissions required remains unchanged and may not exceed 50 APIs.

In the Azure portal, the required permissions list is under API Permissions within specific applications in the application registration menu. When using Microsoft Graph or Microsoft Graph PowerShell, the required permissions list is in the requiredResourceAccess property of an [application](/graph/api/resources/application) entity. For more information, see: [Validation differences by supported account types (signInAudience)](../develop/supported-accounts-validation.md).


---

### Public Preview - Conditional access Authentication strengths 



**Type:** New feature  
**Service category:** Conditional Access   
**Product capability:** User Authentication  

We're announcing Public preview of Authentication strength, a Conditional Access control that allows administrators to specify which authentication methods can be used to access a resource.  For more information, see: [Conditional Access authentication strength (preview)](../authentication/concept-authentication-strengths.md). You can use custom authentication strengths to restrict access by requiring specific FIDO2 keys using the Authenticator Attestation GUIDs (AAGUIDs), and apply this through conditional access policies. For more information, see: [FIDO2 security key advanced options](../authentication/concept-authentication-strengths.md#fido2-security-key-advanced-options).

---

### Public Preview - Conditional access authentication strengths for external identities


**Type:** New feature  
**Service category:** B2B     
**Product capability:** B2B/B2C   

You can now require your business partner (B2B) guests across all Microsoft clouds to use specific authentication methods to access your resources with **Conditional Access Authentication Strength policies**. For more information, see: [Conditional Access: Require an authentication strength for external users](../conditional-access/howto-conditional-access-policy-authentication-strength-external.md).

---


### Generally Availability - Windows Hello for Business, Cloud Kerberos Trust deployment



**Type:** New feature  
**Service category:** Authentications (Logins)     
**Product capability:** User Authentication   

We're excited to announce the general availability of hybrid cloud Kerberos trust, a new Windows Hello for Business deployment model to enable a password-less sign-in experience. With this new model, we’ve made Windows Hello for Business easier to deploy than the existing key trust and certificate trust deployment models by removing the need for maintaining complicated public key infrastructure (PKI), and Azure Active Directory (AD) Connect synchronization wait times. For more information, see: [Hybrid Cloud Kerberos Trust Deployment](/windows/security/identity-protection/hello-for-business/hello-hybrid-cloud-kerberos-trust).

---

### General Availability - Device-based conditional access on Linux Desktops



**Type:** New feature  
**Service category:** Conditional Access     
**Product capability:** SSO  

This feature empowers users on Linux clients to register their devices with Azure AD, enroll into Intune management, and satisfy device-based Conditional Access policies when accessing their corporate resources.

- Users can register their Linux devices with Azure AD
- Users can enroll in Mobile Device Management (Intune), which can be used to provide compliance decisions based upon policy definitions to allow device based conditional access on Linux Desktops 
- If compliant, users can use Microsoft Edge Browser to enable Single-Sign on to M365/Azure resources and satisfy device-based Conditional Access policies.


For more information, see: 
[Azure AD registered devices](../devices/concept-azure-ad-register.md).
[Plan your Azure Active Directory device deployment](../devices/plan-device-deployment.md)

---

### General Availability - Deprecation of Azure Active Directory Multi-Factor Authentication.



**Type:** Deprecated   
**Service category:** MFA     
**Product capability:** Identity Security & Protection  

Beginning September 30, 2024, Azure Active Directory Multi-Factor Authentication Server deployments will no longer service multi-factor authentication (MFA) requests, which could cause authentications to fail for your organization. To ensure uninterrupted authentication services, and to remain in a supported state, organizations should migrate their users’ authentication data to the cloud-based Azure Active Directory Multi-Factor Authentication service using the latest Migration Utility included in the most recent Azure Active Directory Multi-Factor Authentication Server update. For more information, see: [Migrate from MFA Server to Azure AD Multi-Factor Authentication](../authentication/how-to-migrate-mfa-server-to-azure-mfa.md).

---

### Public Preview - Lifecycle Workflows is now available



**Type:** New feature  
**Service category:** Lifecycle Workflows     
**Product capability:** Identity Governance   


We're excited to announce the public preview of Lifecycle Workflows, a new Identity Governance capability that allows customers to extend the user provisioning process, and adds enterprise grade user lifecycle management capabilities, in Azure AD to modernize your identity lifecycle management process. With Lifecycle Workflows, you can:

- Confidently configure and deploy custom workflows to onboard and offboard cloud employees at scale replacing your manual processes.
- Automate out-of-the-box actions critical to required Joiner and Leaver scenarios and get rich reporting insights.
- Extend workflows via Logic Apps integrations with custom tasks extensions for more complex scenarios.

For more information, see: [What are Lifecycle Workflows? (Public Preview)](../governance/what-are-lifecycle-workflows.md).

---

### Public Preview - User-to-Group Affiliation recommendation for group Access Reviews



**Type:** New feature  
**Service category:** Access Reviews     
**Product capability:** Identity Governance   

This feature provides Machine Learning based recommendations to the reviewers of Azure AD Access Reviews to make the review experience easier and more accurate. The recommendation detects user affiliation with other users within the group, and applies the scoring mechanism we built by computing the user’s average distance with other users in the group. For more information, see: [Review recommendations for Access reviews](../governance/review-recommendations-access-reviews.md).

---

### General Availability - Group assignment for SuccessFactors Writeback application



**Type:** New feature  
**Service category:** Provisioning  
**Product capability:** Outbound to SaaS Applications   

When configuring writeback of attributes from Azure AD to SAP SuccessFactors Employee Central, you can now specify the scope of users using Azure AD group assignment. For more information, see: [Tutorial: Configure attribute write-back from Azure AD to SAP SuccessFactors](../saas-apps/sap-successfactors-writeback-tutorial.md).

---

### General Availability - Number Matching for Microsoft Authenticator notifications



**Type:** New feature  
**Service category:** Microsoft Authenticator App      
**Product capability:** User Authentication   

To prevent accidental notification approvals, admins can now require users to enter the number displayed on the sign-in screen when approving an MFA notification in the Microsoft Authenticator app. We've also refreshed the Azure portal admin UX and Microsoft Graph APIs to make it easier for customers to manage Authenticator app feature roll-outs. As part of this update we have also added the highly requested ability for admins to exclude user groups from each feature. 

The number matching feature greatly up-levels the security posture of the Microsoft Authenticator app and protects organizations from MFA fatigue attacks. We highly encourage our customers to adopt this feature applying the rollout controls we have built. Number Matching will begin to be enabled for all users of the Microsoft Authenticator app starting February 27 2023.


For more information, see: [How to use number matching in multifactor authentication (MFA) notifications - Authentication methods policy](../authentication/how-to-mfa-number-match.md).

---

### General Availability - Additional context in Microsoft Authenticator notifications



**Type:** New feature  
**Service category:** Microsoft Authenticator App      
**Product capability:** User Authentication 

Reduce accidental approvals by showing users additional context in Microsoft Authenticator app notifications. Customers can enhance notifications with the following steps:

- Application Context: This feature shows users which application they're signing into.
- Geographic Location Context: This feature shows users their sign-in location based on the IP address of the device they're signing into. 

The feature is available for both MFA and Password-less Phone Sign-in notifications and greatly increases the security posture of the Microsoft Authenticator app. We've also refreshed the Azure portal Admin UX and Microsoft Graph APIs to make it easier for customers to manage Authenticator app feature roll-outs. As part of this update, we've also added the highly requested ability for admins to exclude user groups from certain features. 

We highly encourage our customers to adopt these critical security features to reduce accidental approvals of Authenticator notifications by end users.


For more information, see: [How to use additional context in Microsoft Authenticator notifications - Authentication methods policy](../authentication/how-to-mfa-additional-context.md).

---

### New Federated Apps available in Azure AD Application gallery - October 2022



**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration 



In October 2022 we've added the following 15 new applications in our App gallery with Federation support:

[Unifii](https://www.unifii.com.au/), [WaitWell Staff App](https://waitwell.ca/), [AuthParency](https://login.authparency.com/microsoftidentity/account/signin), [Oncospark Code Interceptor](https://ci.oncospark.com/), [Thread Legal Case Management](https://login.microsoftonline.com/common/adminconsent?client_id=e676edf2-72f3-4781-a25f-0f33100f9f49&redirect_uri=https://app.thread.legal/consent/result/1), [e2open CM-Global](../saas-apps/e2open-cm-tutorial.md), [OpenText XM Fax and XM SendSecure](../saas-apps/opentext-fax-tutorial.md),  [Contentkalender](../saas-apps/contentkalender-tutorial.md), [Evovia](../saas-apps/evovia-tutorial.md), [Parmonic](https://go.parmonic.com/), [mailto.wiki](https://marketplace.atlassian.com/apps/1223249/), [JobDiva Azure SSO](https://www.jobssos.com/index_azad.jsp?SSO=AZURE&ID=1), [Mapiq](../saas-apps/mapiq-tutorial.md), [IVM Smarthub](../saas-apps/ivm-smarthub-tutorial.md), [Span.zone – SSO and Read-only](https://span.zone/), [RecruiterPal](https://recruiterpal.com/en/try-for-free), [Broker groupe Achat Solutions](../saas-apps/broker-groupe-tutorial.md), [Philips SpeechLive](https://www.speechexec.com/login), [Crayon](../saas-apps/crayon-tutorial.md), [Cytric](../saas-apps/cytric-tutorial.md), [Notate](https://notateapp.com/), [ControlDocumentario](https://controldocumentario.com/Login.aspx), [Intuiflow](https://login.intuiflow.net/login), [Valence Security Platform](../saas-apps/valence-tutorial.md), [Skybreathe® Analytics](../saas-apps/skybreathe-analytics-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest



---

### Public preview - New provisioning connectors in the Azure AD Application Gallery - October 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration  

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [LawVu](../saas-apps/lawvu-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).



---

## September 2022 

### General Availability - SSPR writeback is now available for disconnected forests using Azure AD Connect cloud sync



**Type:** New feature  
**Service category:** Azure AD Connect Cloud Sync   
**Product capability:** Identity Lifecycle Management 

Azure AD Connect Cloud Sync Password writeback now provides customers the ability to synchronize Azure AD password changes made in the cloud to an on-premises directory in real time. This can be accomplished using the lightweight Azure AD cloud provisioning agent. For more information, see: [Tutorial: Enable cloud sync self-service password reset writeback to an on-premises environment](../authentication/tutorial-enable-cloud-sync-sspr-writeback.md).

---

### General Availability - Device-based conditional access on Linux Desktops



**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** SSO 



This feature empowers users on Linux clients to register their devices with Azure AD, enroll into Intune management, and satisfy device-based Conditional Access policies when accessing their corporate resources.

- Users can register their Linux devices with Azure AD.
- Users can enroll in Mobile Device Management (Intune), which can be used to provide compliance decisions based upon policy definitions to allow device based conditional access on Linux Desktops.
- If compliant, users can use Microsoft Edge Browser to enable Single-Sign on to M365/Azure resources and satisfy device-based Conditional Access policies.

For more information, see:

- [Azure AD registered devices](../devices/concept-azure-ad-register.md)
- [Plan your Azure Active Directory device deployment](../devices/plan-device-deployment.md)

---

### General Availability - Azure AD SCIM Validator



**Type:** New feature  
**Service category:** Provisioning  
**Product capability:** Outbound to SaaS Applications 



Independent Software Vendors(ISVs) and developers can self-test their SCIM endpoints for compatibility: We have made it easier for ISVs to validate that their endpoints are compatible with the SCIM-based Azure AD provisioning services. This is now in general availability (GA) status.

For more information, see: [Tutorial: Validate a SCIM endpoint](../app-provisioning/scim-validator-tutorial.md)

---

### General Availability - prevent accidental deletions



**Type:** New feature  
**Service category:** Provisioning  
**Product capability:** Outbound to SaaS Applications 



Accidental deletion of users in any system could be disastrous. We’re excited to announce the general availability of the accidental deletions prevention capability as part of the Azure AD provisioning service. When the number of deletions to be processed in a single provisioning cycle spikes above a customer defined threshold the following will happen. The Azure AD provisioning service pauses, provide you with visibility into the potential deletions, and allow you to accept or reject the deletions. This functionality has historically been available for Azure AD Connect, and Azure AD Connect Cloud Sync. It's now available across the various provisioning flows, including both HR-driven provisioning and application provisioning.

For more information, see: [Enable accidental deletions prevention in the Azure AD provisioning service](../app-provisioning/accidental-deletions.md)

---

### General Availability - Identity Protection Anonymous and Malicious IP for ADFS on-premises logins



**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection



Identity protection expands its Anonymous and Malicious IP detections to protect ADFS sign-ins. This automatically applies to all customers who have AD Connect Health deployed and enabled, and show up as the existing "Anonymous IP" or "Malicious IP" detections with a token issuer type of "AD Federation Services".

For more information, see: [What is risk?](../identity-protection/concept-identity-protection-risks.md)

---


### New Federated Apps available in Azure AD Application gallery - September 2022



**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration 



In September 2022 we've added the following 15 new applications in our App gallery with Federation support:

[RocketReach SSO](../saas-apps/rocketreach-sso-tutorial.md), [Arena EU](../saas-apps/arena-eu-tutorial.md), [Zola](../saas-apps/zola-tutorial.md), [FourKites SAML2.0 SSO for Tracking](../saas-apps/fourkites-tutorial.md), [Syniverse Customer Portal](../saas-apps/syniverse-customer-portal-tutorial.md), [Rimo](https://rimo.app/), [Q Ware CMMS](https://qware.app/), Mapiq (OIDC), [NICE Cxone](../saas-apps/nice-cxone-tutorial.md), [dominKnow|ONE](../saas-apps/dominknowone-tutorial.md), [Waynbo for Azure AD](https://webportal-eu.waynbo.com/Login), [innDex](https://web.inndex.co.uk/azure/authorize), [Profiler Software](https://www.profiler.net.au/), [Trotto go links](https://trot.to/_/auth/login), [AsignetSSOIntegration](../saas-apps/asignet-sso-tutorial.md).

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, read the details here: https://aka.ms/AzureADAppRequest



---

## August 2022 

### General Availability - Ability to force reauthentication on Intune enrollment, risky sign-ins, and risky users



**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection



Customers can now require a fresh authentication each time a user performs a certain action. Forced reauthentication supports requiring a user to reauthenticate during Intune device enrollment, password change for risky users, and risky sign-ins.

For more information, see: [Configure authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md#require-reauthentication-every-time)

---

### General Availability - Multi-Stage Access Reviews

**Type:** Changed feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance  

Customers can now meet their complex audit and recertification requirements through multiple stages of reviews. For more information, see: [Create a multi-stage access review](../governance/create-access-review.md#create-a-multi-stage-access-review).



---

### Public Preview - External user leave settings

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** B2B/B2C 

Currently, users can self-service leave for an organization without the visibility of their IT administrators. Some organizations may want more control over this self-service process.

With this feature, IT administrators can now allow or restrict external identities to leave an organization by Microsoft provided self-service controls via Azure Active Directory in the Microsoft Entra portal. In order to restrict users to leave an organization, customers need to include "Global privacy contact" and "Privacy statement URL" under tenant properties.
 
A new policy API is available for the administrators to control tenant wide policy:
[externalIdentitiesPolicy resource type](/graph/api/resources/externalidentitiespolicy?view=graph-rest-beta&preserve-view=true)

 For more information, see:

- [Leave an organization as an external user](../external-identities/leave-the-organization.md)
- [Configure external collaboration settings](../external-identities/external-collaboration-settings-configure.md)



---

### Public Preview - Restrict self-service BitLocker for devices

**Type:** New feature  
**Service category:** Device Registration and Management  
**Product capability:** Access Control

In some situations, you may want to restrict the ability for end users to self-service BitLocker keys. With this new functionality, you can now turn off self-service of BitLocker keys, so that only specific individuals with right privileges can recover a BitLocker key.

For more information, see: [Block users from viewing their BitLocker keys (preview)](../devices/device-management-azure-portal.md#configure-device-settings)


---

### Public Preview- Identity Protection Alerts in Microsoft 365 Defender

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection 

Identity Protection risk detections (alerts) are now also available in Microsoft 365 Defender to provide a unified investigation experience for security professionals. For more information, see: [Investigate alerts in Microsoft 365 Defender](/microsoft-365/security/defender/investigate-alerts?view=o365-worldwide#alert-sources&preserve-view=true)




---

### New Federated Apps available in Azure AD Application gallery - August 2022

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration 

In August 2022, we've added the following 40 new applications in our App gallery with Federation support

[Albourne Castle](https://village.albourne.com/castle), [Adra by Trintech](../saas-apps/adra-by-trintech-tutorial.md), [workhub](../saas-apps/workhub-tutorial.md), [4DX](../saas-apps/4dx-tutorial.md), [Ecospend IAM V1](https://iamapi.sb.ecospend.com/account/login), [TigerGraph](../saas-apps/tigergraph-tutorial.md), [Sketch](../saas-apps/sketch-tutorial.md), [Lattice](../saas-apps/lattice-tutorial.md), [snapADDY Single Sign On](https://app.snapaddy.com/login), [RELAYTO Content Experience Platform](https://relayto.com/signin), [oVice](https://tour.ovice.in/login), [Arena](../saas-apps/arena-tutorial.md), [QReserve](../saas-apps/qreserve-tutorial.md), [Curator](../saas-apps/curator-tutorial.md), [NetMotion Mobility](../saas-apps/netmotion-mobility-tutorial.md), [HackNotice](../saas-apps/hacknotice-tutorial.md), [ERA_EHS_CORE](../saas-apps/era-ehs-core-tutorial.md), [AnyClip Teams Connector](https://videomanager.anyclip.com/login), [Wiz SSO](../saas-apps/wiz-sso-tutorial.md), [Tango Reserve by AgilQuest (EU Instance)](../saas-apps/tango-reserve-tutorial.md), [valid8Me](../saas-apps/valid8me-tutorial.md), [Ahrtemis](../saas-apps/ahrtemis-tutorial.md), [KPMG Leasing Tool](../saas-apps/kpmg-tool-tutorial.md) [Mist Cloud Admin SSO](../saas-apps/mist-cloud-admin-tutorial.md), [Work-Happy](https://live.work-happy.com/?azure=true), [Ediwin SaaS EDI](../saas-apps/ediwin-saas-edi-tutorial.md), [LUSID](../saas-apps/lusid-tutorial.md), [Next Gen Math](https://nextgenmath.com/), [Total ID](https://www.tokyo-shoseki.co.jp/ict/), [Cheetah For Benelux](../saas-apps/cheetah-for-benelux-tutorial.md), [Live Center Australia](https://au.livecenter.com/), [Shop Floor Insight](https://www.dmsiworks.com/apps/shop-floor-insight), [Warehouse Insight](https://www.dmsiworks.com/apps/warehouse-insight), [myAOS](../saas-apps/myaos-tutorial.md), [Hero](https://admin.linc-ed.com/), [FigBytes](../saas-apps/figbytes-tutorial.md), [VerosoftDesign](https://verosoft-design.vercel.app/), [ViewpointOne - UK](https://identity-uk.team.viewpoint.com/), [EyeRate Reviews](https://azure-login.eyeratereviews.com/), [Lytx DriveCam](../saas-apps/lytx-drivecam-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, please read the details here https://aka.ms/AzureADAppRequest 





---
### Public preview - New provisioning connectors in the Azure AD Application Gallery - August 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration  

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Ideagen Cloud](../saas-apps/ideagen-cloud-provisioning-tutorial.md)
- [Lucid (All Products)](../saas-apps/lucid-all-products-provisioning-tutorial.md)
- [Palo Alto Networks Cloud Identity Engine - Cloud Authentication Service](../saas-apps/palo-alto-networks-cloud-identity-engine-provisioning-tutorial.md)
- [SuccessFactors Writeback](../saas-apps/sap-successfactors-writeback-tutorial.md)
- [Tableau Cloud](../saas-apps/tableau-online-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).



---
### General Availability - Workload Identity Federation with App Registrations are available now

**Type:** New feature  
**Service category:** Other  
**Product capability:** Developer Experience 

Entra Workload Identity Federation allows developers to exchange tokens issued by another identity provider with Azure AD tokens, without needing secrets. It eliminates the need to store, and manage, credentials inside the code or secret stores to access Azure AD protected resources such as Azure and Microsoft Graph. By removing the secrets required to access Azure AD protected resources, workload identity federation can improve the security posture of your organization. This feature also reduces the burden of secret management and minimizes the risk of service downtime due to expired credentials. 

For more information on this capability and supported scenarios, see [Workload identity federation](../develop/workload-identity-federation.md).


---

### Public Preview - Entitlement management automatic assignment policies

**Type:** Changed feature  
**Service category:** Entitlement Management  
**Product capability:** Identity Governance 

In Azure AD entitlement management, a new form of access package assignment policy is being added. The automatic assignment policy includes a filter rule, similar to a dynamic group, that specifies the users in the tenant who should have assignments. When users come into scope of matching that filter rule criteria, an assignment is automatically created, and when they no longer match, the assignment is removed.

 For more information, see: [Configure an automatic assignment policy for an access package in Azure AD entitlement management (Preview)](../governance/entitlement-management-access-package-auto-assignment-policy.md).



---

## July 2022
 
### Public Preview - ADFS to Azure AD: SAML App Multi-Instancing

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO  

Users can now configure multiple instances of the same application within an Azure AD tenant. It's now supported for both IdP, and Service Provider (SP), initiated single sign-on requests. Multiple application accounts can now have a separate service principal to handle instance-specific claims mapping and roles assignment. For more information, see:

- [Configure SAML app multi-instancing for an application - Microsoft Entra](../develop/reference-app-multi-instancing.md)
- [Customize app SAML token claims - Microsoft Entra](../develop/active-directory-saml-claims-customization.md)



---

### Public Preview - ADFS to Azure AD: Apply RegEx Replace to groups claim content

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO  

 

Administrators up until recently has the capability to transform claims using many transformations, however using regular expression for claims transformation wasn't exposed to customers. With this public preview release, administrators can now configure and use regular expressions for claims transformation using portal UX. 
For more information, see:[Customize app SAML token claims - Microsoft Entra](../develop/active-directory-saml-claims-customization.md).
 

---
 


### Public Preview - Azure AD Domain Services - Trusts for User Forests

**Type:** New feature  
**Service category:** Azure AD Domain Services  
**Product capability:** Azure AD Domain Services  
 

You can now create trusts on both user and resource forests. On-premises AD DS users can't authenticate to resources in the Azure AD DS resource forest until you create an outbound trust to your on-premises AD DS. An outbound trust requires network connectivity to your on-premises virtual network on which you have installed Azure AD Domain Service. On a user forest, trusts can be created for on-premises AD forests that aren't synchronized to Azure AD DS.

To learn more about trusts and how to deploy your own, visit [How trust relationships work for forests in Active Directory](../../active-directory-domain-services/concepts-forest-trust.md).
 
 

---
 


### New Federated Apps available in Azure AD Application gallery - July 2022

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration  
 

In July 2022 we've added the following 28 new applications in our App gallery with Federation support:

[Lunni Ticket Service](https://ticket.lunni.io/login), [Spring Health](https://benefits.springhealth.com/care), [Sorbet](https://lite.sorbetapp.com/login), [Planview ID](../saas-apps/planview-id-tutorial.md), [Karbonalpha](https://saas.karbonalpha.com/settings/api), [Headspace](../saas-apps/headspace-tutorial.md), [SeekOut](../saas-apps/seekout-tutorial.md), [Stackby](../saas-apps/stackby-tutorial.md), [Infrascale Cloud Backup](../saas-apps/infrascale-cloud-backup-tutorial.md), [Keystone](../saas-apps/keystone-tutorial.md), [LMS・教育管理システム Leaf](../saas-apps/lms-and-education-management-system-leaf-tutorial.md), [ZDiscovery](../saas-apps/zdiscovery-tutorial.md), [ラインズeライブラリアドバンス (Lines eLibrary Advance)](../saas-apps/lines-elibrary-advance-tutorial.md), [Rootly](../saas-apps/rootly-tutorial.md), [Articulate 360](../saas-apps/articulate360-tutorial.md), [Rise.com](../saas-apps/risecom-tutorial.md), [SevOne Network Monitoring System (NMS)](../saas-apps/sevone-network-monitoring-system-tutorial.md), [PGM](https://ups-pgm.4gfactor.com/azure/), [TouchRight Software](https://app.touchrightsoftware.com/), [Tendium](../saas-apps/tendium-tutorial.md), [Training Platform](../saas-apps/training-platform-tutorial.md), [Znapio](https://app.znapio.com/), [Preset](../saas-apps/preset-tutorial.md), [itslearning MS Teams sync](https://itslearning.com/global/), [Veza](../saas-apps/veza-tutorial.md),

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, please read the details here https://aka.ms/AzureADAppRequest


 
---
 


### General Availability - No more waiting, provision groups on demand into your SaaS applications.

**Type:** New feature  
**Service category:** Provisioning  
**Product capability:** Identity Lifecycle Management  
 

Pick a group of up to five members and provision them into your third-party applications in seconds. Get started testing, troubleshooting, and provisioning to non-Microsoft applications such as ServiceNow, ZScaler, and Adobe. For more information, see: [On-demand provisioning in Azure Active Directory](../app-provisioning/provision-on-demand.md).
 

---
 

###  General Availability – Protect against by-passing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Identity Security & Protection  
 

We're delighted to announce a new security protection that prevents bypassing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD. When enabled for a federated domain in your Azure AD tenant, it ensures that a compromised federated account can't bypass Azure AD Multi-Factor Authentication by imitating that a multi factor authentication has already been performed by the identity provider. The protection can be enabled via new security setting, [federatedIdpMfaBehavior](/graph/api/resources/internaldomainfederation?view=graph-rest-beta#federatedidpmfabehavior-values&preserve-view=true).

 
We highly recommend enabling this new protection when using Azure AD Multi-Factor Authentication as your multi factor authentication for your federated users. To learn more about the protection and how to enable it, visit [Enable protection to prevent by-passing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#enable-protection-to-prevent-by-passing-of-cloud-azure-ad-multi-factor-authentication-when-federated-with-azure-ad). 
 

---
 

### Public preview - New provisioning connectors in the Azure AD Application Gallery - July 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration  
 

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Tableau Cloud](../saas-apps/tableau-online-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 

---
 

### General Availability - Tenant-based service outage notifications

**Type:** New feature  
**Service category:** Other  
**Product capability:** Platform  
 

Azure Service Health supports service outage notifications to Tenant Admins for Azure Active Directory issues. These outages will also appear on the Azure portal Overview page with appropriate links to Azure Service Health. Outage events will be able to be seen by built-in Tenant Administrator Roles. We'll continue to send outage notifications to subscriptions within a tenant for transition. More information is available at: [What are Service Health notifications in Azure Active Directory?](../reports-monitoring/overview-service-health-notifications.md).

 

---
 


### Public Preview - Multiple Passwordless Phone sign-in Accounts for iOS devices

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication  
 

End users can now enable passwordless phone sign-in for multiple accounts in the Authenticator App on any supported iOS device. Consultants, students, and others with multiple accounts in Azure AD can add each account to Microsoft Authenticator and use passwordless phone sign-in for all of them from the same iOS device. The Azure AD accounts can be in either the same, or different, tenants. Guest accounts aren't supported for multiple account sign-ins from one device.


Note that end users are encouraged to enable the optional telemetry setting in the Authenticator App, if not done so already.  For more information, see:  [Enable passwordless sign-in with Microsoft Authenticator](../authentication/howto-authentication-passwordless-phone.md)

 

---
 
 

### Public Preview - Azure AD Domain Services - Fine Grain Permissions

**Type:** Changed feature  
**Service category:** Azure AD Domain Services  
**Product capability:** Azure AD Domain Services  

 

Previously to set up and administer your AAD-DS instance you needed top level permissions of Azure Contributor and Azure AD Global Administrator. Now for both initial creation, and ongoing administration, you can utilize more fine grain permissions for enhanced security and control. The prerequisites now minimally require:

- You need [Application Administrator](../roles/permissions-reference.md#application-administrator) and [Groups Administrator](../roles/permissions-reference.md#groups-administrator) Azure AD roles in your tenant to enable Azure AD DS.
- You need [Domain Services Contributor](../../role-based-access-control/built-in-roles.md#domain-services-contributor) Azure role to create the required Azure AD DS resources.
 

Check out these resources to learn more:

- [Tutorial - Create an Azure Active Directory Domain Services managed domain](../../active-directory-domain-services/tutorial-create-instance.md#prerequisites)
- [Least privileged roles by task](../roles/delegate-by-task.md#domain-services)
- [Azure built-in roles - Azure RBAC](../../role-based-access-control/built-in-roles.md#domain-services-contributor)

 

---
 

### General Availability- Azure AD Connect update release with new functionality and bug fixes

**Type:** Changed feature  
**Service category:** Provisioning  
**Product capability:** Identity Lifecycle Management  

 

A new Azure AD Connect release fixes several bugs and includes new functionality. This release is also available for auto upgrade for eligible servers. For more information, see: [Azure AD Connect: Version release history](../hybrid/reference-connect-version-history.md#21150).

---
 

### General Availability - Cross-tenant access settings for B2B collaboration

**Type:** Changed feature  
**Service category:** B2B  
**Product capability:** B2B/B2C  

 

Cross-tenant access settings enable you to control how users in your organization collaborate with members of external Azure AD organizations. Now you’ll have granular inbound and outbound access control settings that work on a per org, user, group, and application basis. These settings also make it possible for you to trust security claims from external Azure AD organizations like multi-factor authentication (MFA), device compliance, and hybrid Azure AD joined devices. For more information, see: [Cross-tenant access with Azure AD External Identities](../external-identities/cross-tenant-access-overview.md).
 

---
 

### General Availability- Expression builder with Application Provisioning

**Type:** Changed feature  
**Service category:** Provisioning  
**Product capability:** Outbound to SaaS Applications  
 

Accidental deletion of users in your apps or in your on-premises directory could be disastrous. We’re excited to announce the general availability of the accidental deletions prevention capability. When a provisioning job would cause a spike in deletions, it will first pause and provide you visibility into the potential deletions. You can then accept or reject the deletions and have time to update the job’s scope if necessary. For more information, see [Understand how expression builder in Application Provisioning works](../app-provisioning/expression-builder.md).
 

---
 


### Public Preview - Improved app discovery view for My Apps portal

**Type:** Changed feature  
**Service category:** My Apps  
**Product capability:** End User Experiences  
 

An improved app discovery view for My Apps is in public preview. The preview shows users more apps in the same space and allows them to scroll between collections. It doesn't currently support drag-and-drop and list view. Users can opt into the preview by selecting Try the preview and opt out by selecting Return to previous view. To learn more about My Apps, see [My Apps portal overview](../manage-apps/myapps-overview.md).


 

---
 


### Public Preview - New Azure portal All Devices list

**Type:** Changed feature  
**Service category:** Device Registration and Management  
**Product capability:** End User Experiences  

 

We're enhancing the All Devices list in the Azure portal to make it easier to filter and manage your devices. Improvements include:

All Devices List:

- Infinite scrolling
- More devices properties can be filtered on
- Columns can be reordered via drag and drop
- Select all devices

For more information, see: [Manage devices in Azure AD using the Azure portal](../devices/device-management-azure-portal.md#view-and-filter-your-devices-preview).


 

---
 


### Public Preview - ADFS to Azure AD: Persistent NameID for IDP-initiated Apps

**Type:** Changed feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO  
 

Previously the only way to have persistent NameID value was to ​configure user attribute with an empty value. Admins can now explicitly configure the NameID value to be persistent ​along with the corresponding format.

For more information, see: [Customize app SAML token claims - Microsoft identity platform](../develop/active-directory-saml-claims-customization.md#attributes).
 

---
 


### Public Preview - ADFS to Azure Active Directory: Customize attrname-format​

**Type:** Changed feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO  
 

With this new parity update, customers can now integrate non-gallery applications such as Socure DevHub with Azure AD to have SSO via SAML.

For more information, see [Claims mapping policy - Microsoft Entra](../develop/reference-claims-mapping-policy-type.md#claim-schema-entry-elements).
 

---

## June 2022
 

### Public preview - New provisioning connectors in the Azure AD Application Gallery - June 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration  
 

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Whimsical](../saas-apps/whimsical-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 

---
 

### Public Preview - Roles are being assigned outside of Privileged Identity Management

**Type:** New feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management  
 
Customers can be alerted on assignments made outside PIM either directly on the Azure portal or also via email. For the current public preview, the assignments are being tracked at the subscription level. For more information, see [Configure security alerts for Azure roles in Privileged Identity Management](../privileged-identity-management/pim-resource-roles-configure-alerts.md#alerts).
 
---


### General Availability - Temporary Access Pass is now available

**Type:** New feature  
**Service category:** MFA  
**Product capability:** User Authentication  

 

Temporary Access Pass (TAP) is now generally available. TAP can be used to securely register password-less methods such as Phone Sign-in, phishing resistant methods such as FIDO2, and even help Windows onboarding (AADJ and WHFB). TAP also makes recovery easier when a user has lost or forgotten their strong authentication methods and needs to sign in to register new authentication methods. For more information, see: [Configure Temporary Access Pass in Azure AD to register Passwordless authentication methods](../authentication/howto-authentication-temporary-access-pass.md).
 

---
 


### Public Preview of Dynamic Group support for MemberOf

**Type:** New feature  
**Service category:** Group Management  
**Product capability:** Directory  

 

Create "nested" groups with Azure AD Dynamic Groups! This feature enables you to build dynamic Azure AD Security Groups and Microsoft 365 groups based on other groups! For example, you can now create Dynamic-Group-A with members of Group-X and Group-Y. For more information, see: [Steps to create a memberOf dynamic group](../enterprise-users/groups-dynamic-rule-member-of.md#steps-to-create-a-memberof-dynamic-group).
 

---
 


### New Federated Apps available in Azure AD Application gallery - June 2022

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration  

 

In June 2022 we've added the following 22 new applications in our App gallery with Federation support:

[Leadcamp Mailer](https://app.leadcamp.io/sign-in), [PULCE](https://ups.pulce.tech/index.php), [Hive Learning](../saas-apps/hive-learning-tutorial.md), [Planview LeanKit](../saas-apps/planview-leankit-tutorial.md), [Javelo](../saas-apps/javelo-tutorial.md), [きょうしつでビスケット,Agile Provisioning](https://online.viscuit.com/v1/all/?server=7), [xCarrier®](../saas-apps/xcarrier-tutorial.md), [Skillcast](../saas-apps/skillcast-tutorial.md), [JTRA](https://www.jingtengtech.com/r/#/register?id=1), [InnerSpace inTELLO](https://intello.innerspace.io/), [Seculio](../saas-apps/seculio-tutorial.md), [XplicitTrust Partner Console](https://console.xplicittrust.com/#/partner/auth), [Veracity Single-Sign On](https://www.veracity.com/), [Guardium Data Protection](../saas-apps/guardium-data-protection-tutorial.md), [IntellicureEHR v7](https://www.intellicure.com/wound-care-software/ehr/), [BMIS - Battery Management Information System](../saas-apps/battery-management-information-system-tutorial.md), [Finbiosoft Cloud](https://account.finbiosoft.com/), [Standard for Success K-12](../saas-apps/standard-for-success-tutorial.md), [E2open LSP](../saas-apps/e2open-lsp-tutorial.md), [TVU Service](../saas-apps/tvu-service-tutorial.md), [S4 - Digitsec](../saas-apps/s4-digitsec-tutorial.md).

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, see the details here https://aka.ms/AzureADAppRequest



 

---
 
 

### General Availability – Protect against by-passing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Identity Security & Protection  

 

We're delighted to announce a new security protection that prevents bypassing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD. When enabled for a federated domain in your Azure AD tenant, it ensures that a compromised federated account can't bypass Azure AD Multi-Factor Authentication by imitating that a multi factor authentication has already been performed by the identity provider. The protection can be enabled via new security setting, [federatedIdpMfaBehavior](/graph/api/resources/internaldomainfederation?view=graph-rest-1.0#federatedidpmfabehavior-values&preserve-view=true). 

We highly recommend enabling this new protection when using Azure AD Multi-Factor Authentication as your multi factor authentication for your federated users. To learn more about the protection and how to enable it, visit [Enable protection to prevent by-passing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#enable-protection-to-prevent-by-passing-of-cloud-azure-ad-multi-factor-authentication-when-federated-with-azure-ad). 
 

---
 


### Public Preview - New Azure portal All Users list and User Profile UI

**Type:** Changed feature  
**Service category:** User Management  
**Product capability:** User Management  
 

We're enhancing the All Users list and User Profile in the Azure portal to make it easier to find and manage your users. Improvements include: 


All Users List:
- Infinite scrolling (yes, no 'Load more')
- More user properties can be added as columns and filtered on
- Columns can be reordered via drag and drop
- Default columns shown and their order can be managed via the column picker 
- The ability to copy and share the current view


User Profile:
- A new Overview page that surfaces insights (that is, group memberships, account enabled, MFA capable, risky user, etc.)
- A new monitoring tab
- More user properties can be viewed and edited in the properties tab

 For more information, see: [User management enhancements in Azure Active Directory](../enterprise-users/users-search-enhanced.md).

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

For more information on how to use this feature, see: [Dynamic membership rule for device groups](../enterprise-users/groups-dynamic-membership.md#rules-for-devices).
 

---
 

 


## May 2022
 
### General Availability: Tenant-based service outage notifications

**Type:** Plan for change  
**Service category:** Other  
**Product capability:** Platform  

 
Azure Service Health will soon support service outage notifications to Tenant Admins for Azure Active Directory issues soon. These outages will also appear on the Azure portal overview page with appropriate links to Azure Service Health. Outage events will be able to be seen by built-in Tenant Administrator Roles. We'll continue to send outage notifications to subscriptions within a tenant for transition. More information will be available when this capability is released. The expected release is for June 2022.
 
---



### New Federated Apps available in Azure AD Application gallery - May 2022

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration  
 


In May 2022 we've added the following 25 new applications in our App gallery with Federation support:

[UserZoom](../saas-apps/userzoom-tutorial.md), [AMX Mobile](https://www.amxsolutions.co.uk/), [i-Sight](../saas-apps/isight-tutorial.md), Method InSight, [Chronus SAML](../saas-apps/chronus-saml-tutorial.md), [Attendant Console for Microsoft Teams](https://attendant.anywhere365.io/), [Skopenow](../saas-apps/skopenow-tutorial.md), [Fidelity PlanViewer](../saas-apps/fidelity-planviewer-tutorial.md), [Lyve Cloud](../saas-apps/lyve-cloud-tutorial.md), [Framer](../saas-apps/framer-tutorial.md), [Authomize](../saas-apps/authomize-tutorial.md), [gamba!](../saas-apps/gamba-tutorial.md), [Datto File Protection Single Sign On](../saas-apps/datto-file-protection-tutorial.md), [LONEALERT](https://portal.lonealert.co.uk/auth/azure/saml/signin), [Payfactors](https://pf.payfactors.com/client/auth/login), [deBroome Brand Portal](../saas-apps/debroome-brand-portal-tutorial.md), [TeamSlide](../saas-apps/teamslide-tutorial.md), [Sensera Systems](https://sitecloud.senserasystems.com/), [YEAP](https://prismaonline.propay.be/logon/login.aspx), [Monaca Education](https://monaca.education/ja/signup), [Personify Inc](https://personifyinc.com/login), [Phenom TXM](../saas-apps/phenom-txm-tutorial.md), [Forcepoint Cloud Security Gateway - User Authentication](../saas-apps/forcepoint-cloud-security-gateway-tutorial.md), [GoalQuest](../saas-apps/goalquest-tutorial.md), [OpenForms](https://login.openforms.com/Login).

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, please read the details here https://aka.ms/AzureADAppRequest



 

---
 

### General Availability – My Apps users can make apps from URLs (add sites)

**Type:** New feature  
**Service category:** My Apps  
**Product capability:** End User Experiences  
 

When editing a collection using the My Apps portal, users can now add their own sites, in addition to adding apps that have been assigned to them by an admin. To add a site, users must provide a name and URL. For more information on how to use this feature, see: [Customize app collections in the My Apps portal](https://support.microsoft.com/account-billing/customize-app-collections-in-the-my-apps-portal-2dae6b8a-d8b0-4a16-9a5d-71ed4d6a6c1d).
 

---
 

### Public preview - New provisioning connectors in the Azure AD Application Gallery - May 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration  
 

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Alinto Protect](../saas-apps/alinto-protect-provisioning-tutorial.md)
- [Blinq](../saas-apps/blinq-provisioning-tutorial.md)
- [Cerby](../saas-apps/cerby-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 

---
 

### Public Preview: Confirm safe and compromised in sign-ins API beta

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection  
 

The sign-ins Microsoft Graph API now supports confirming safe and compromised on risky sign-ins. This public preview functionality is available at the beta endpoint. For more information, please check out the Microsoft Graph documentation: [signIn: confirmSafe - Microsoft Graph beta](/graph/api/signin-confirmsafe?view=graph-rest-beta&preserve-view=true)
 

---
 

### Public Preview of Microsoft cloud settings for Azure AD B2B

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C  

 

Microsoft cloud settings let you collaborate with organizations from different Microsoft Azure clouds. With Microsoft cloud settings, you can establish mutual B2B collaboration between the following clouds:

-Microsoft Azure global cloud and Microsoft Azure Government
-Microsoft Azure global cloud and Microsoft Azure China 21Vianet

To learn more about Microsoft cloud settings for B2B collaboration, see: [Cross-tenant access overview - Azure AD](../external-identities/cross-tenant-access-overview.md#microsoft-cloud-settings).
 

---
 

### General Availability of SAML and WS-Fed federation in External Identities

**Type:** Changed feature  
**Service category:** B2B  
**Product capability:** B2B/B2C  

 

When setting up federation with a partner's IdP, new guest users from that domain can use their own IdP-managed organizational account to sign in to your Azure AD tenant and start collaborating with you. There's no need for the guest user to create a separate Azure AD account. To learn more about federating with SAML or WS-Fed identity providers in External Identities, see: [Federation with a SAML/WS-Fed identity provider (IdP) for B2B - Azure AD](../external-identities/direct-federation.md).
 

---
 

### Public Preview - Create Group in Administrative Unit

**Type:** Changed feature  
**Service category:** Directory Management  
**Product capability:** Access Control  

 

Groups Administrators assigned over the scope of an administrative unit can now create groups within the administrative unit.  This enables scoped group administrators to create groups that they can manage directly, without needing to elevate to Global Administrator or Privileged Role Administrator. For more information, see: [Administrative units in Azure Active Directory](../roles/administrative-units.md).
 

---
 

### Public Preview - Dynamic administrative unit support for onPremisesDistinguishedName property

**Type:** Changed feature  
**Service category:** Directory Management  
**Product capability:** AuthZ/Access Delegation  

 

The public preview of dynamic administrative units now supports the **onPremisesDistinguishedName** property for users. This makes it possible to create dynamic rules that incorporate the organizational unit of the user from on-premises AD. For more information, see: [Manage users or devices for an administrative unit with dynamic membership rules (Preview)](../roles/admin-units-members-dynamic.md).
 

---
 

### General Availability - Improvements to Azure AD Smart Lockout

**Type:** Changed feature  
**Service category:** Other  
**Product capability:** User Management  

 

Smart Lockout now synchronizes the lockout state across Azure AD data centers, so the total number of failed sign-in attempts allowed before an account is locked out will match the configured lockout threshold. For more information, see: [Protect user accounts from attacks with Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md).
 

---
 

## April 2022


### General Availability - Entitlement management separation of duties checks for incompatible access packages

**Type:** Changed feature
**Service category:** Other 
**Product capability:** Identity Governance  

In Azure AD entitlement management, an administrator can now configure the incompatible access packages and groups of an access package in the Azure portal.  This prevents a user who already has one of those incompatible access rights from being able to request further access. For more information, see: [Configure separation of duties checks for an access package in Azure AD entitlement management](../governance/entitlement-management-access-package-incompatible.md).


---

### General Availability - Microsoft Defender for Endpoint Signal in Identity Protection

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection  
 

Identity Protection now integrates a signal from Microsoft Defender for Endpoint (MDE) that will protect against PRT theft detection. To learn more, see: [What is risk? Azure AD Identity Protection](../identity-protection/concept-identity-protection-risks.md).
 

---

### General Availability - Entitlement management 3 stages of approval

**Type:** Changed feature  
**Service category:** Other  
**Product capability:** Entitlement Management  

 

This update extends the Azure AD entitlement management access package policy to allow a third approval stage.  This will be able to be configured via the Azure portal or Microsoft Graph. For more information, see: [Change approval and requestor information settings for an access package in Azure AD entitlement management](../governance/entitlement-management-access-package-approval-policy.md).
 

---

### General Availability - Improvements to Azure AD Smart Lockout

**Type:** Changed feature  
**Service category:** Identity Protection  
**Product capability:** User Management  

 

With a recent improvement, Smart Lockout now synchronizes the lockout state across Azure AD data centers, so the total number of failed sign-in attempts allowed before an account is locked out will match the configured lockout threshold. For more information, see: [Protect user accounts from attacks with Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md).
 

---


### Public Preview - Integration of Microsoft 365 App Certification details into Azure Active Directory UX and Consent Experiences

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** AuthZ/Access Delegation  


Microsoft 365 Certification status for an app is now available in Azure AD consent UX, and custom app consent policies. The status will later be displayed in several other Identity-owned interfaces such as enterprise apps. For more information, see: [Understanding Azure AD application consent experiences](../develop/application-consent-experience.md).

---


### Public preview - Use Azure AD access reviews to review access of B2B direct connect users in Teams shared channels

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance

Use Azure AD access reviews to review access of B2B direct connect users in Teams shared channels. For more information, see: [Include B2B direct connect users and teams accessing Teams Shared Channels in access reviews (preview)](../governance/create-access-review.md#include-b2b-direct-connect-users-and-teams-accessing-teams-shared-channels-in-access-reviews).

---

### Public Preview - New MS Graph APIs to configure federated settings when federated with Azure AD

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Identity Security & Protection  


We're announcing the public preview of following MS Graph APIs and PowerShell cmdlets for configuring federated settings when federated with Azure AD:

|Action  |MS Graph API  |PowerShell cmdlet  |
|---------|---------|---------|
|Get federation settings for a federated domain        | [Get internalDomainFederation](/graph/api/internaldomainfederation-get?view=graph-rest-beta&preserve-view=true)           | [Get-MgDomainFederationConfiguration](/powershell/module/microsoft.graph.identity.directorymanagement/get-mgdomainfederationconfiguration?view=graph-powershell-beta&preserve-view=true)        |
|Create federation settings for a federated domain     | [Create internalDomainFederation](/graph/api/domain-post-federationconfiguration?view=graph-rest-beta&preserve-view=true)        | [New-MgDomainFederationConfiguration](/powershell/module/microsoft.graph.identity.directorymanagement/new-mgdomainfederationconfiguration?view=graph-powershell-beta&preserve-view=true)        |
|Remove federation settings for a federated domain     | [Delete internalDomainFederation](/graph/api/internaldomainfederation-delete?view=graph-rest-beta&preserve-view=true)        | [Remove-MgDomainFederationConfiguration](/powershell/module/microsoft.graph.identity.directorymanagement/remove-mgdomainfederationconfiguration?view=graph-powershell-beta&preserve-view=true)     |
|Update federation settings for a federated domain     | [Update internalDomainFederation](/graph/api/internaldomainfederation-update?view=graph-rest-beta&preserve-view=true)        | [Update-MgDomainFederationConfiguration](/powershell/module/microsoft.graph.identity.directorymanagement/update-mgdomainfederationconfiguration?view=graph-powershell-beta&preserve-view=true)     |


If using older MSOnline cmdlets ([Get-MsolDomainFederationSettings](/powershell/module/msonline/get-msoldomainfederationsettings?view=azureadps-1.0&preserve-view=true) and [Set-MsolDomainFederationSettings](/powershell/module/msonline/set-msoldomainfederationsettings?view=azureadps-1.0&preserve-view=true)), we highly recommend transitioning to the latest MS Graph APIs and PowerShell cmdlets. 

For more information, see [internalDomainFederation resource type - Microsoft Graph beta](/graph/api/resources/internaldomainfederation?view=graph-rest-beta&preserve-view=true).

---

### Public Preview – Ability to force reauthentication on Intune enrollment, risky sign-ins, and risky users

**Type:** New feature  
**Service category:** RBAC role  
**Product capability:** AuthZ/Access Delegation  


Added functionality to session controls allowing admins to reauthenticate a user on every sign-in if a user or particular sign-in event is deemed risky, or when enrolling a device in Intune. For more information, see [Configure authentication session management with conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).

---

###  Public Preview – Protect against by-passing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Identity Security & Protection  


We're delighted to announce a new security protection that prevents bypassing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD. When enabled for a federated domain in your Azure AD tenant, it ensures that a compromised federated account can't bypass Azure AD Multi-Factor Authentication by imitating that a multi factor authentication has already been performed by the identity provider. The protection can be enabled via new security setting, [federatedIdpMfaBehavior](/graph/api/resources/internaldomainfederation?view=graph-rest-beta#federatedidpmfabehavior-values&preserve-view=true). 

We highly recommend enabling this new protection when using Azure AD Multi-Factor Authentication as your multi factor authentication for your federated users. To learn more about the protection and how to enable it, visit [Enable protection to prevent by-passing of cloud Azure AD Multi-Factor Authentication when federated with Azure AD](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#enable-protection-to-prevent-by-passing-of-cloud-azure-ad-multi-factor-authentication-when-federated-with-azure-ad).

---

### New Federated Apps available in Azure AD Application gallery - April 2022

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Third Party Integration

In April 2022 we added the following 24 new applications in our App gallery with Federation support:
[X-1FBO](https://www.x1fbo.com/), [select Armor](https://app.clickarmor.ca/), [Smint.io Portals for SharePoint](https://www.smint.io/portals-for-sharepoint/), [Pluto](../saas-apps/pluto-tutorial.md), [ADEM](../saas-apps/adem-tutorial.md), [Smart360](../saas-apps/smart360-tutorial.md), [MessageWatcher SSO](https://messagewatcher.com/), [Beatrust](../saas-apps/beatrust-tutorial.md), [AeyeScan](https://aeyescan.com/azure_sso), [ABa Customer](https://abacustomer.com/), [Twilio Sendgrid](../saas-apps/twilio-sendgrid-tutorial.md), [Vault Platform](../saas-apps/vault-platform-tutorial.md), [Speexx](../saas-apps/speexx-tutorial.md), [Clicksign](https://app.clicksign.com/signin), [Per Angusta](../saas-apps/per-angusta-tutorial.md), [EruditAI](https://dashboard.erudit.ai/login), [MetaMoJi ClassRoom](https://business.metamoji.com/), [Numici](https://app.numici.com/), [MCB.CLOUD](https://identity.mcb.cloud/Identity/Account/Manage), [DepositLink](https://depositlink.com/external-login), [Last9](https://last9.io/), [ParkHere Corporate](../saas-apps/parkhere-corporate-tutorial.md), [Keepabl](../saas-apps/keepabl-tutorial.md), [Swit](../saas-apps/swit-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial.

For listing your application in the Azure AD app gallery, please read the details here https://aka.ms/AzureADAppRequest

---

### General Availability - Customer data storage for Japan customers in Japanese data centers

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** GoLocal  

From April 15, 2022, Microsoft began storing Azure AD’s Customer Data for new tenants with a Japan billing address within the Japanese data centers.  For more information, see: [Customer data storage for Japan customers in Azure Active Directory](active-directory-data-storage-japan.md).

---


### Public Preview - New provisioning connectors in the Azure AD Application Gallery - April 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Third Party Integration  

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:
- [Adobe Identity Management (OIDC)](../saas-apps/adobe-identity-management-provisioning-oidc-tutorial.md)
- [embed signage](../saas-apps/embed-signage-provisioning-tutorial.md)
- [KnowBe4 Security Awareness Training](../saas-apps/knowbe4-security-awareness-training-provisioning-tutorial.md)
- [NordPass](../saas-apps/nordpass-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md)

---



## March 2022
 

### Tenant enablement of combined security information registration for Azure Active Directory

**Type:** Plan for change  
**Service category:** MFA  
**Product capability:** Identity Security & Protection  

 

We announced in April 2020 General Availability of our new combined registration experience, enabling users to register security information for multi-factor authentication and self-service password reset at the same time, which was available for existing customers to opt in. We're happy to announce the combined security information registration experience will be enabled to all non-enabled customers after September 30, 2022. This change doesn't impact tenants created after August 15, 2020, or tenants located in the China region. For more information, see: [Combined security information registration for Azure Active Directory overview](../authentication/concept-registration-mfa-sspr-combined.md).
 

---
 

### Public preview - New provisioning connectors in the Azure AD Application Gallery - March 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Third Party Integration  

 

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [AlexisHR](../saas-apps/alexishr-provisioning-tutorial.md)
- [embed signage](../saas-apps/embed-signage-provisioning-tutorial.md)
- [Joyn FSM](../saas-apps/joyn-fsm-provisioning-tutorial.md)
- [KPN Grip](../saas-apps/kpn-grip-provisioning-tutorial.md)
- [MURAL Identity](../saas-apps/mural-identity-provisioning-tutorial.md)
- [Palo Alto Networks SCIM Connector](../saas-apps/palo-alto-networks-scim-connector-provisioning-tutorial.md)
- [Tap App Security](../saas-apps/tap-app-security-provisioning-tutorial.md)
- [Yellowbox](../saas-apps/yellowbox-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 

---
 

### Public preview - Azure AD Recommendations

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting  

 

Azure AD Recommendations is now in public preview. This feature provides personalized insights with actionable guidance to help you identify opportunities to implement Azure AD best practices, and optimize the state of your tenant. For more information, see: [What is Azure Active Directory recommendations](../reports-monitoring/overview-recommendations.md)
 

---
 

### Public Preview: Dynamic administrative unit membership for users and devices

**Type:** New feature  
**Service category:** RBAC role  
**Product capability:** Access Control  
 

Administrative units now support dynamic membership rules for user and device members. Instead of manually assigning users and devices to administrative units, tenant admins can set up a query for the administrative unit. The membership will be automatically maintained by Azure AD. For more information, see:[Administrative units in Azure Active Directory](../roles/administrative-units.md).
 

---
 

### Public Preview: Devices in Administrative Units

**Type:** New feature  
**Service category:** RBAC role  
**Product capability:** AuthZ/Access Delegation  
 

Devices can now be added as members of administrative units. This enables scoped delegation of device permissions to a specific set of devices in the tenant. Built-in and custom roles are also supported. For more information, see: [Administrative units in Azure Active Directory](../roles/administrative-units.md).
 

---
 

### New Federated Apps available in Azure AD Application gallery - March 2022

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Third Party Integration  

 
In March 2022 we've added the following 29 new applications in our App gallery with Federation support:

[Informatica Platform](../saas-apps/informatica-platform-tutorial.md), [Buttonwood Central SSO](../saas-apps/buttonwood-central-sso-tutorial.md), [Blockbax](../saas-apps/blockbax-tutorial.md), [Datto Workplace Single Sign On](../saas-apps/datto-workplace-tutorial.md), [Atlas by Workland](https://atlas.workland.com/), [Simply.Coach](https://app.simply.coach/signup), [Benevity](https://benevity.com/), [Engage Absence Management](https://engage.honeydew-health.com/users/sign_in), [LitLingo App Authentication](https://www.litlingo.com/litlingo-deployment-guide), [ADP EMEA French HR Portal mon.adp.com](../saas-apps/adp-emea-french-hr-portal-tutorial.md), [Ready Room](https://app.readyroom.net/), [Axway CSOS](../saas-apps/axway-csos-tutorial.md), [Alloy](https://alloyapp.io/), [U.S. Bank Prepaid](../saas-apps/us-bank-prepaid-tutorial.md), [EdApp](https://admin.edapp.com/login), [GoSimplo](https://app.gosimplo.com/External/Microsoft/Signup), [Snow Atlas SSO](https://www.snowsoftware.io/), [Abacus.AI](https://alloyapp.io/), [Culture Shift](../saas-apps/culture-shift-tutorial.md), [StaySafe Hub](https://hub.staysafeapp.net/login), [OpenLearning](../saas-apps/openlearning-tutorial.md), [Draup, Inc](https://draup.com/platformlogin/), [Air](../saas-apps/air-tutorial.md), [Regulatory Lab](https://clientidentification.com/), [SafetyLine](https://slmonitor.com/login), [Zest](../saas-apps/zest-tutorial.md), [iGrafx Platform](../saas-apps/igrafx-platform-tutorial.md), [Tracker Software Technologies](../saas-apps/tracker-software-technologies-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, please read the details here https://aka.ms/AzureADAppRequest

---
 

### Public Preview - New APIs for fetching transitive role assignments and role permissions

**Type:** New feature  
**Service category:** RBAC role  
**Product capability:** Access Control  
 

1. **transitiveRoleAssignments** - Last year the ability to assign Azure AD roles to groups was created. Originally it took four calls to fetch all direct, and transitive, role assignments of a user. This new API call allows it all to be done via one API call. For more information, see:
[List transitiveRoleAssignment - Microsoft Graph beta](/graph/api/rbacapplication-list-transitiveroleassignments).

2. **unifiedRbacResourceAction** - Developers can use this API to list all role permissions and their descriptions in Azure AD. This API can be thought of as a dictionary that can help build custom roles without relying on UX. For more information, see:
[List resourceActions - Microsoft Graph beta](/graph/api/unifiedrbacresourcenamespace-list-resourceactions).

 

---

## February 2022
 

---
 

### General Availability - France digital accessibility requirement

**Type:** Plan for change  
**Service category:** Other  
**Product capability:** End User Experiences  
 

This change provides users who are signing into Azure Active Directory on iOS, Android, and Web UI flavors information about the accessibility of Microsoft's online services via a link on the sign-in page. This ensures that the France digital accessibility compliance requirements are met. The change will only be available for French language experiences.[Learn more](https://www.microsoft.com/fr-fr/accessibility/accessibilite/accessibility-statement)
 

---
 

### General Availability - Downloadable access review history report

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance  
 

With Azure Active Directory (Azure AD) Access Reviews, you can create a downloadable review history to help your organization gain more insight. The report pulls the decisions that were taken by reviewers when a report is created. These reports can be constructed to include specific access reviews, for a specific time frame, and can be filtered to include different review types and review results.[Learn more](../governance/access-reviews-downloadable-review-history.md)
 

---

---
 

### Public Preview of Identity Protection for Workload Identities

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection  
 

Azure AD Identity Protection is extending its core capabilities of detecting, investigating, and remediating identity-based risk to workload identities. This allows organizations to better protect their applications, service principals, and managed identities. We're also extending Conditional Access so you can block at-risk workload identities. [Learn more](../identity-protection/concept-workload-identity-risk.md)
 

---
 

### Public Preview - Cross-tenant access settings for B2B collaboration

**Type:** New feature  
**Service category:** B2B  
**Product capability:** Collaboration  

 

Cross-tenant access settings enable you to control how users in your organization collaborate with members of external Azure AD organizations. Now you’ll have granular inbound and outbound access control settings that work on a per org, user, group, and application basis. These settings also make it possible for you to trust security claims from external Azure AD organizations like multi-factor authentication (MFA), device compliance, and hybrid Azure AD joined devices. [Learn more](../external-identities/cross-tenant-access-overview.md)
 

---
 

### Public preview - Create Azure AD access reviews with multiple stages of reviewers

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance  
 

Use multi-stage reviews to create Azure AD access reviews in sequential stages, each with its own set of reviewers and configurations. Supports multiple stages of reviewers to satisfy scenarios such as: independent groups of reviewers reaching quorum, escalations to other reviewers, and reducing burden by allowing for later stage reviewers to see a filtered-down list. For public preview, multi-stage reviews are only supported on reviews of groups and applications. [Learn more](../governance/create-access-review.md)
 

---
 

### New Federated Apps available in Azure AD Application gallery - February 2022

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Third Party Integration  
 

In February 2022 we added the following 20 new applications in our App gallery with Federation support:

[Embark](../saas-apps/embark-tutorial.md),  [FENCE-Mobile RemoteManager SSO](../saas-apps/fence-mobile-remotemanager-sso-tutorial.md), [カオナビ](../saas-apps/kao-navi-tutorial.md), [Adobe Identity Management (OIDC)](../saas-apps/adobe-identity-management-tutorial.md), [AppRemo](../saas-apps/appremo-tutorial.md), [Live Center](https://livecenter.norkon.net/Login), [Offishall](https://app.offishall.io/), [MoveWORK Flow](https://www.movework-flow.fm/login), [Cirros SL](https://www.cirros.net/), [ePMX Procurement Software](https://azure.epmxweb.com/admin/index.php?), [Vanta O365](https://app.vanta.com/connections), [Hubble](../saas-apps/hubble-tutorial.md), [Medigold Gateway](https://gateway.medigoldcore.com), [クラウドログ](../saas-apps/crowd-log-tutorial.md),[Amazing People Schools](../saas-apps/amazing-people-schools-tutorial.md), [Salus](https://salus.com/login), [XplicitTrust Network Access](https://console.xplicittrust.com/#/dashboard), [Spike Email - Mail & Team Chat](https://spikenow.com/web/), [AltheaSuite](https://planmanager.altheasuite.com/), [Balsamiq Wireframes](../saas-apps/balsamiq-wireframes-tutorial.md).

You can also find the documentation of all the applications from here: [https://aka.ms/AppsTutorial](../saas-apps/tutorial-list.md),

For listing your application in the Azure AD app gallery, please read the details here: [https://aka.ms/AzureADAppRequest](../manage-apps/v2-howto-app-gallery-listing.md)

 

---
 

### Two new MDA detections in Identity Protection

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection  
 

Identity Protection has added two new detections from Microsoft Defender for Cloud Apps, (formerly MCAS). The Mass Access to Sensitive Files detection detects anomalous user activity, and the Unusual Addition of Credentials to an OAuth app detects suspicious service principal activity.[Learn more](../identity-protection/concept-identity-protection-risks.md)
 

---
 

### Public preview - New provisioning connectors in the Azure AD Application Gallery - February 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration  
 

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [BullseyeTDP](../saas-apps/bullseyetdp-provisioning-tutorial.md)
- [GitHub Enterprise Managed User (OIDC)](../saas-apps/github-enterprise-managed-user-oidc-provisioning-tutorial.md)
- [Gong](../saas-apps/gong-provisioning-tutorial.md)
- [LanSchool Air](../saas-apps/lanschool-air-provisioning-tutorial.md)
- [ProdPad](../saas-apps/prodpad-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 

---
 

### General Availability - Privileged Identity Management (PIM) role activation for SharePoint Online enhancements

**Type:** Changed feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management  
 

We've improved the Privileged Identity management (PIM) time to role activation for SharePoint Online.  Now, when activating a role in PIM for SharePoint Online, you should be able to use your permissions right away in SharePoint Online.  This change will roll out in stages, so you might not yet see these improvements in your organization. [Learn more](../privileged-identity-management/pim-how-to-activate-role.md) 
 

---

## January 2022

### Public preview - Custom security attributes

**Type:** New feature  
**Service category:** Directory Management  
**Product capability:** Directory  
 
Enables you to define business-specific attributes that you can assign to Azure AD objects. These attributes can be used to store information, categorize objects, or enforce fine-grained access control. Custom security attributes can be used with Azure attribute-based access control. [Learn more](custom-security-attributes-overview.md).
 
---

### Public preview - Filter groups in tokens using a substring match

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO  
 
In the past, Azure AD only permitted groups to be filtered based on whether they were assigned to an application. Now, you can also use Azure AD to filter the groups included in the token. You can filter with the substring match on the display name or onPremisesSAMAccountName attributes of the group object on the token. Only groups that the user is a member of will be included in the token. This token will be recognized whether it's on the ObjectID or the on premises SAMAccountName or security identifier (SID). This feature can be used together with the setting to include only groups assigned to the application if desired to further filter the list.[Learn more](../hybrid/how-to-connect-fed-group-claims.md)

---

### General availability - Continuous Access Evaluation

**Type:** New feature  
**Service category:** Other  
**Product capability:** Access Control   
 
With Continuous access evaluation (CAE), critical security events and policies are evaluated in real time. This includes account disable, password reset, and location change. [Learn more](../conditional-access/concept-continuous-access-evaluation.md). 
 
---

### General Availability - User management enhancements are now available

**Type:** New feature  
**Service category:** User Management  
**Product capability:** User Management  
 
The Azure portal has been updated to make it easier to find users in the All users and Deleted users pages. Changes in the preview include:

- More visible user properties including object ID, directory sync status, creation type, and identity issuer.
- **Search now** allows substring search and combined search of names, emails, and object IDs.
- Enhanced filtering by user type (member, guest, and none), directory sync status, creation type, company name, and domain name.
- New sorting capabilities on properties like name, user principal name, creation time, and deletion date.
- A new total users count that updates with any searches or filters.

For more information, go to [User management enhancements (preview) in Azure Active Directory](../enterprise-users/users-search-enhanced.md).

---

### General Availability - My Apps customization of default Apps view

**Type:** New feature  
**Service category:** My Apps  
**Product capability:** End User Experiences  

Customization of the default My Apps view in now in general availability. For more information on My Apps, you can go to [Sign in and start apps from the My Apps portal](https://support.microsoft.com/en-us/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).
 
---

### General Availability - Audited BitLocker Recovery

**Type:** New feature  
**Service category:** Device Access Management  
**Product capability:** Device Lifecycle Management  
 
BitLocker keys are sensitive security items. Audited BitLocker recovery ensures that when BitLocker keys are read, an audit log is generated so that you can trace who accesses this information for given devices. [Learn more](../devices/device-management-azure-portal.md#view-or-copy-bitlocker-keys).

---

### General Availability - Download a list of devices

**Type:** New feature  
**Service category:** Device Registration and Management  
**Product capability:** Device Lifecycle Management 

Download a list of your organization's devices to a .csv file for easier reporting and management. [Learn more](../devices/device-management-azure-portal.md#download-devices).
 
---

### New provisioning connectors in the Azure AD Application Gallery - January 2022

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration  
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Autodesk SSO](../saas-apps/autodesk-sso-provisioning-tutorial.md)
- [frankli.io](../saas-apps/frankli-io-provisioning-tutorial.md)
- [Plandisc](../saas-apps/plandisc-provisioning-tutorial.md)
- [Swit](../saas-apps/swit-provisioning-tutorial.md)
- [TerraTrue](../saas-apps/terratrue-provisioning-tutorial.md)
- [TimeClock 365 SAML](../saas-apps/timeclock-365-saml-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, go to [Automate user provisioning to SaaS applications with Azure AD](../manage-apps/user-provisioning.md).

---

### New Federated Apps available in Azure AD Application gallery - January 2022

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration  

In January 2022, we've added the following 47 new applications in our App gallery with Federation support:

[Jooto](../saas-apps/jooto-tutorial.md), [Proprli](https://app.proprli.com/), [Pace Scheduler](https://www.pacescheduler.com/accounts/login/), [DRTrack](../saas-apps/drtrack-tutorial.md), [Dining Sidekick](../saas-apps/dining-sidekick-tutorial.md), [Cryotos](https://app.cryotos.com/oauth2/authorization/azure-client), [Emergency Management Systems](https://secure.emsystems.com.au/), [Manifestly Checklists](../saas-apps/manifestly-checklists-tutorial.md), [eLearnPOSH](../saas-apps/elearnposh-tutorial.md), [Scuba Analytics](../saas-apps/scuba-analytics-tutorial.md), [Athena Systems sign-in Platform](../saas-apps/athena-systems-login-platform-tutorial.md), [TimeTrack](../saas-apps/timetrack-tutorial.md), [MiHCM](../saas-apps/mihcm-tutorial.md), [Health Note](https://www.healthnote.com/), [Active Directory SSO for DoubleYou](../saas-apps/active-directory-sso-for-doubleyou-tutorial.md), [Emplifi platform](../saas-apps/emplifi-platform-tutorial.md), [Flexera One](../saas-apps/flexera-one-tutorial.md), [Hypothesis](https://web.hypothes.is/help/authorizing-hypothesis-from-the-azure-ad-app-gallery/), [Recurly](../saas-apps/recurly-tutorial.md), [XpressDox AU Cloud](https://au.xpressdox.com/Authentication/Login.aspx), [Zoom for Intune](https://zoom.us/), [UPWARD AGENT](https://app.upward.jp/login/), [Linux Foundation ID](https://openprofile.dev/), [Asset Planner](../saas-apps/asset-planner-tutorial.md), [Kiho](https://v3.kiho.fi/index/sso), [chezie](https://app.chezie.co/), [Excelity HCM](../saas-apps/excelity-hcm-tutorial.md), [yuccaHR](https://app.yuccahr.com/), [Blue Ocean Brain](../saas-apps/blue-ocean-brain-tutorial.md), [EchoSpan](../saas-apps/echospan-tutorial.md), [Archie](../saas-apps/archie-tutorial.md), [Equifax Workforce Solutions](../saas-apps/equifax-workforce-solutions-tutorial.md), [Palantir Foundry](../saas-apps/palantir-foundry-tutorial.md), [ATP SpotLight and ChronicX](../saas-apps/atp-spotlight-and-chronicx-tutorial.md), [DigiSign](https://app.digisign.org/selfcare/sso), [mConnect](https://mconnect.skooler.com/), [BrightHR](https://login.brighthr.com/), [Mural Identity](../saas-apps/mural-identity-tutorial.md), [CloudClarity](https://portal.cloudclarity.app/dashboard), [Twic](../saas-apps/twic-tutorial.md), [Eduhouse Online](https://app.eduhouse.fi/palvelu/kirjaudu/microsoft), [Bealink](../saas-apps/bealink-tutorial.md), [Time Intelligence Bot](https://teams.microsoft.com/), [SentinelOne](https://sentinelone.com/)

You can also find the documentation of all the applications from: https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, read the details in: https://aka.ms/AzureADAppRequest

---

### Azure Ad access reviews reviewer recommendations now account for non-interactive sign-in information

**Type:** Changed feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance  

Azure AD access reviews reviewer recommendations now account for non-interactive sign-in information, improving upon original recommendations based on interactive last sign-ins only. Reviewers can now make more accurate decisions based on the last sign-in activity of the users they're reviewing. To learn more about how to create access reviews, go to [Create an access review of groups and applications in Azure AD](../governance/create-access-review.md).
 
---

### Risk reason for offline Azure AD Threat Intelligence risk detection

**Type:** Changed feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection  
 
The offline Azure AD Threat Intelligence risk detection can now have a risk reason that will help customers with the risk investigation. If a risk reason is available, it will show up as **Additional Info** in the risk details of that risk event. The information can be found in the Risk detections report. It will also be available through the additionalInfo property of the riskDetections API. [Learn more](../identity-protection/howto-identity-protection-investigate-risk.md).
 
---


## December 2021

### Tenant enablement of combined security information registration for Azure Active Directory

**Type:** Plan for change  
**Service category:** MFA  
**Product capability:** Identity Security & Protection  
 
We previously announced in April 2020, a new combined registration experience enabling users to register authentication methods for SSPR and multi-factor authentication at the same time was generally available for existing customer to opt in. Any Azure AD tenants created after August 2020 automatically have the default experience set to combined registration. Starting in 2022 Microsoft will be enabling the multi-factor authentication and SSPR combined registration experience for existing customers. [Learn more](../authentication/concept-registration-mfa-sspr-combined.md).
 
---

### Public Preview - Number Matching now available to reduce accidental notification approvals

**Type:** New feature  
**Service category:** Microsoft Authenticator App  
**Product capability:** User Authentication  
 
To prevent accidental notification approvals, admins can now  require users to enter the number displayed on the sign-in screen when approving a multi-factor authentication notification in the Authenticator app. This feature adds an extra security measure to the Microsoft Authenticator app. [Learn more](../authentication/how-to-mfa-number-match.md).
 
---

### Pre-authentication error events removed from Azure AD Sign-in Logs

**Type:** Deprecated  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting  
 
We're no longer publishing sign-in logs with the following error codes because these events are pre-authentication events that occur before our service has authenticated a user. Because these events happen before authentication, our service isn't always able to correctly identify the user. If a user continues on to authenticate, the user sign-in will show up in your tenant Sign-in logs. These logs are no longer visible in the Azure portal UX, and querying these error codes in the Graph API will no longer return results.

|Error code | Failure reason|
| --- | --- |
|50058| Session information isn't sufficient for single-sign-on.|
|16000| Either multiple user identities are available for the current request or selected account isn't supported for the scenario.|
|500581| Rendering JavaScript. Fetching sessions for single-sign-on on V2 with prompt=none requires JavaScript to verify if any MSA accounts are signed in.|
|81012| The user trying to sign in to Azure AD is different from the user signed into the device.|

---



## November 2021

### Tenant enablement of combined security information registration for Azure Active Directory

**Type:** Plan for change  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 
We previously announced in April 2020, a new combined registration experience enabling users to register authentication methods for SSPR and multi-factor authentication at the same time was generally available for existing customer to opt in. Any Azure AD tenants created after August 2020 automatically have the default experience set to combined registration. Starting 2022, Microsoft will be enabling the MFA/SSPR combined registration experience for existing customers. [Learn more](../authentication/concept-registration-mfa-sspr-combined.md).
 
---

### Windows users will see prompts more often when switching user accounts

**Type:** Fixed  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
A problematic interaction between Windows and a local Active Directory Federation Services (ADFS) instance can result in users attempting to sign into another account, but be silently signed into their existing account instead, with no warning. For federated IdPs such as ADFS, that support the [prompt=login](/windows-server/identity/ad-fs/operations/ad-fs-prompt-login) pattern, Azure AD will now trigger a fresh sign-in at ADFS when a user is directed to ADFS with a sign-in hint. This ensures that the user is signed into the account they requested, rather than being silently signed into the account they're already signed in with. 

For more information, see the [change notice](../develop/reference-breaking-changes.md). 
 
---

### Public preview - Conditional Access Overview Dashboard

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Monitoring & Reporting
 
The new Conditional Access overview dashboard enables all tenants to see insights about the impact of their Conditional Access policies without requiring an Azure Monitor subscription. This built-in dashboard provides tutorials to deploy policies, a summary of the policies in your tenant, a snapshot of your policy coverage, and security recommendations. [Learn more](../conditional-access/overview.md).
 
---

### Public preview - SSPR writeback is now available for disconnected forests using Azure AD Connect cloud sync

**Type:** New feature  
**Service category:** Azure AD Connect Cloud Sync  
**Product capability:** Identity Lifecycle Management
 
The Public Preview feature for Azure AD Connect Cloud Sync Password writeback provides customers the capability to write back a user's password changes in the cloud to the on-premises directory in real time using the lightweight Azure AD cloud provisioning agent.[Learn more](../authentication/tutorial-enable-cloud-sync-sspr-writeback.md).

---

### Public preview - Conditional Access for workload identities

**Type:** New feature  
**Service category:** Conditional Access for workload identities  
**Product capability:** Identity Security & Protection
 
Previously, Conditional Access policies applied only to users when they access apps and services like SharePoint online or the Azure portal. This preview adds support for Conditional Access policies applied to service principals owned by the organization. You can block service principals from accessing resources from outside trusted-named locations or Azure Virtual Networks. [Learn more](../conditional-access/workload-identity.md).

---

### Public preview - Extra attributes available as claims

**Type:** Changed feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 
Several user attributes have been added to the list of attributes available to map to claims to bring attributes available in claims more in line with what is available on the user object in Microsoft Graph. New attributes include mobilePhone and ProxyAddresses. [Learn more](../develop/reference-claims-mapping-policy-type.md).
 
---

### Public preview - "Session Lifetime Policies Applied" property in the sign-in logs

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** Identity Security & Protection
 
We have recently added other property to the sign-in logs called "Session Lifetime Policies Applied". This property will list all the session lifetime policies that applied to the sign-in for example, Sign-in frequency, Remember multi-factor authentication and Configurable token lifetime. [Learn more](../reports-monitoring/concept-sign-ins.md#authentication-details).
 
---

### Public preview - Enriched reviews on access packages in entitlement management

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
Entitlement Management's enriched review experience allows even more flexibility on access packages reviews. Admins can now choose what happens to access if the reviewers don't respond, provide helper information to reviewers, or decide whether a justification is necessary. [Learn more](../governance/entitlement-management-access-reviews-create.md).
 
---

### General availability - randomString and redact provisioning functions

**Type:** New feature  
**Service category:** Provisioning  
**Product capability:** Outbound to SaaS Applications
 

The Azure AD Provisioning service now supports two new functions, randomString() and Redact(): 
- randomString - generate a string based on the length and characters you would like to include or exclude in your string.
- redact - remove the value of the attribute from the audit and provisioning logs. [Learn more](../app-provisioning/functions-for-customizing-application-data.md#randomstring).

---

### General availability - Now access review creators can select users and groups to receive notification on completion of reviews

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
Now access review creators can select users and groups to receive notification on completion of reviews. [Learn more](../governance/create-access-review.md).
 
---
 
### General availability - Azure AD users can now view and report suspicious sign-ins and manage their accounts within Microsoft Authenticator

**Type:** New feature  
**Service category:** Microsoft Authenticator App  
**Product capability:** Identity Security & Protection
 
This feature allows Azure AD users to manage their work or school accounts within the Microsoft Authenticator app. The management features will allow users to view sign-in history and sign-in activity. Users can also report any suspicious or unfamiliar activity, change their Azure AD account passwords, and update the account's security information.

For more information on how to use this feature visit [View and search your recent sign-in activity from the My Sign-ins page](../user-help/my-account-portal-sign-ins-page.md).

---

### General availability - New Microsoft Authenticator app icon

**Type:** New feature  
**Service category:** Microsoft Authenticator App  
**Product capability:** Identity Security & Protection
 
New updates have been made to the Microsoft Authenticator app icon. To learn more about these updates, see the [Microsoft Authenticator app](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/microsoft-authenticator-app-easier-ways-to-add-or-manage/ba-p/2464408) blog post.

---

### General availability - Azure AD single sign-on and device-based Conditional Access support in Firefox on Windows 10/11

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** SSO
 
We now support native single sign-on (SSO) support and device-based Conditional Access to Firefox browser on Windows 10 and Windows Server 2019 starting in Firefox version 91. [Learn more](../conditional-access/require-managed-devices.md#prerequisites).
 
---

### New provisioning connectors in the Azure AD Application Gallery - November 2021

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Appaegis Isolation Access Cloud](../saas-apps/appaegis-isolation-access-cloud-provisioning-tutorial.md)
- [BenQ IAM](../saas-apps/benq-iam-provisioning-tutorial.md)
- [BIC Cloud Design](../saas-apps/bic-cloud-design-provisioning-tutorial.md)
- [Chaos](../saas-apps/chaos-provisioning-tutorial.md)
- [directprint.io](../saas-apps/directprint-io-provisioning-tutorial.md)
- [Documo](../saas-apps/documo-provisioning-tutorial.md)
- [Facebook Work Accounts](../saas-apps/facebook-work-accounts-provisioning-tutorial.md)
- [introDus Pre and Onboarding Platform](../saas-apps/introdus-pre-and-onboarding-platform-provisioning-tutorial.md)
- [Kisi Physical Security](../saas-apps/kisi-physical-security-provisioning-tutorial.md)
- [Klaxoon](../saas-apps/klaxoon-provisioning-tutorial.md)
- [Klaxoon SAML](../saas-apps/klaxoon-saml-provisioning-tutorial.md)
- [MX3 Diagnostics](../saas-apps/mx3-diagnostics-connector-provisioning-tutorial.md)
- [Netpresenter](../saas-apps/netpresenter-provisioning-tutorial.md)
- [Peripass](../saas-apps/peripass-provisioning-tutorial.md)
- [Real Links](../saas-apps/real-links-provisioning-tutorial.md)
- [Sentry](../saas-apps/sentry-provisioning-tutorial.md)
- [Teamgo](../saas-apps/teamgo-provisioning-tutorial.md)
- [Zero](../saas-apps/zero-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../manage-apps/user-provisioning.md).
 
---

### New Federated Apps available in Azure AD Application gallery - November 2021

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In November 2021, we have added following 32 new applications in our App gallery with Federation support:

[Tide - Connector](https://gallery.ctinsuretech-tide.com/), [Virtual Risk Manager - USA](../saas-apps/virtual-risk-manager-usa-tutorial.md), [Xorlia Policy Management](https://app.xoralia.com/), [WorkPatterns](https://app.workpatterns.com/oauth2/login?data_source_type=office_365_account_calendar_workspace_sync&utm_source=azure_sso), [GHAE](../saas-apps/ghae-tutorial.md), [Nodetrax Project](../saas-apps/nodetrax-project-tutorial.md), [Touchstone Benchmarking](https://app.touchstonebenchmarking.com/), [SURFsecureID - Azure AD Multi-Factor Authentication](../saas-apps/surfsecureid-azure-mfa-tutorial.md), [AiDEA](https://truebluecorp.com/en/prodotti/aidea-en/),[R and D Tax Credit Services: 10-wk Implementation](../saas-apps/r-and-d-tax-credit-services-tutorial.md), [Mapiq Essentials](../saas-apps/mapiq-essentials-tutorial.md), [Celtra Authentication Service](https://auth.celtra.com/login), [Snackmagic](../saas-apps/snackmagic-tutorial.md), [FileOrbis](../saas-apps/fileorbis-tutorial.md), [ClarivateWOS](../saas-apps/clarivatewos-tutorial.md), [ZoneVu](https://zonevu.ubiterra.com/onboarding/index), [V-Client](../saas-apps/v-client-tutorial.md), [Netpresenter Next](https://www.netpresenter.com/), [UserTesting](../saas-apps/usertesting-tutorial.md), [InfinityQS ProFicient on Demand](../saas-apps/infinityqs-proficient-on-demand-tutorial.md), [Feedonomics](https://auth.feedonomics.com/), [Customer Voice](https://cx.pobuca.com/), [Zanders Inside](https://home.zandersinside.com/), [Connecter](https://teamwork.connecterapp.com/azure_login), [Paychex Flex](https://login.flex.paychex.com/azfed-app/v1/azure/federation/admin), [InsightSquared](https://us2.insightsquared.com/#/boards/office365.com/settings/userconnection), [Fabrikam Enterprise Managed User (OIDC)](https://github.com/login), [PROXESS for Office365](https://www.proxess.de/office365), [Coverity Static Application Security Testing](../saas-apps/coverity-static-application-security-testing-tutorial.md)

You can also find the documentation of all the applications [here](../saas-apps/tutorial-list.md).

For listing your application in the Azure AD app gallery, read the details [here](../manage-apps/v2-howto-app-gallery-listing.md).

---

### Updated "switch organizations" user experience in My Account.

**Type:** Changed feature  
**Service category:** My Profile/Account  
**Product capability:** End User Experiences
 
Updated "switch organizations" user interface in My Account. This visually improves the UI and provides the end-user with clear instructions. Added a manage organizations link to blade per customer feedback. [Learn more](https://support.microsoft.com/account-billing/switch-organizations-in-your-work-or-school-account-portals-c54c32c9-2f62-4fad-8c23-2825ed49d146).
 
---

## October 2021
 
### Limits on the number of configured API permissions for an application registration will be enforced starting in October 2021

**Type:** Plan for change  
**Service category:** Other  
**Product capability:** Developer Experience
 
Sometimes, application developers configure their apps to require more permissions than it's possible to grant. To prevent this from happening, a limit on the total number of required permissions that can be configured for an app registration will be enforced.

The total number of required permissions for any single application registration mustn't exceed 400 permissions, across all APIs. The change to enforce this limit will begin rolling out mid-October 2021. Applications exceeding the limit can't increase the number of permissions they're configured for. The existing limit on the number of distinct APIs for which permissions are required remains unchanged and may not exceed 50 APIs.

In the Azure portal, the required permissions are listed under API permissions for the application you wish to configure. Using Microsoft Graph or Microsoft Graph PowerShell, the required permissions are listed in the requiredResourceAccess property of an [application](/graph/api/resources/application) entity. [Learn more](../enterprise-users/directory-service-limits-restrictions.md).
 
---

### Email one-time passcode on by default change beginning rollout in November 2021

**Type:** Plan for change  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Previously, we announced that starting October 31, 2021, Microsoft Azure Active Directory [email one-time passcode](../external-identities/one-time-passcode.md) authentication will become the default method for inviting accounts and tenants for B2B collaboration scenarios. However, because of deployment schedules, we'll begin rolling out on November 1, 2021. Most of the tenants will see the change rolled out in January 2022 to minimize disruptions during the holidays and deployment lock downs. After this change, Microsoft will no longer allow redemption of invitations using Azure Active Directory accounts that are unmanaged. [Learn more](../external-identities/one-time-passcode.md#frequently-asked-questions).
 
---

### Conditional Access Guest Access Blocking Screen

**Type:** Fixed  
**Service category:** Conditional Access  
**Product capability:** End User Experiences
 
If there's no trust relation between a home and resource tenant, a guest user would have previously been asked to re-register their device, which would break the previous registration. However, the user would end up in a registration loop because only home tenant device registration is supported. In this specific scenario, instead of this loop, we've created a new conditional access blocking page. The page tells the end user that they can't get access to conditional access protected resources as a guest user. [Learn more](../external-identities/b2b-quickstart-add-guest-users-portal.md#prerequisites).
 
---

### 50105 Errors will now result in a UX error message instead of an error response to the application

**Type:** Fixed  
**Service category:** Authentications (Logins)  
**Product capability:** Developer Experience
 
Azure AD has fixed a bug in an error response that occurs when a user isn't assigned to an app that requires a user assignment. Previously, Azure AD would return error 50105 with the OIDC error code "interaction_required" even during interactive authentication. This would cause well-coded applications to loop indefinitely, as they do interactive authentication and receive an error telling them to do interactive authentication, which they would then do.  

The bug has been fixed, so that during non-interactive auth an "interaction_required" error will still be returned. Also, during interactive authentication an error page will be directly displayed to the user.  

For greater details, see the change notices for [Azure AD protocols](../develop/reference-breaking-changes.md#error-50105-has-been-fixed-to-not-return-interaction_required-during-interactive-authentication). 

---

### Public preview - New claims transformation capabilities

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 
The following new capabilities have been added to the claims transformations available for manipulating claims in tokens issued from Azure AD:
 
- Join() on NameID. Used to be restricted to joining an email format address with a verified domain. Now Join() can be used on the NameID claim in the same way as any other claim, so NameID transforms can be used to create Windows account style NameIDs or any other string. For now if the result is an email address, the Azure AD will still validate that the domain is one that is verified in the tenant.
- Substring(). A new transformation in the claims configuration UI allows extraction of defined position substrings such as five characters starting at character three - substring(3,5)
- Claims transformations. These transformations can now be performed on Multi-valued attributes, and can emit multi-valued claims. Microsoft Graph can now be used to read/write multi-valued directory schema extension attributes. [Learn more](../develop/active-directory-saml-claims-customization.md).

---

### Public Preview – Flagged Sign-ins  

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
Flagged sign-ins are a feature that will increase the signal to noise ratio for user sign-ins where users need help. The functionality is intended to empower users to raise awareness about sign-in errors they want help with. Also to help admins and help desk workers find the right sign-in events quickly and efficiently. [Learn more](../reports-monitoring/overview-flagged-sign-ins.md).

---

### Public preview - Device overview

**Type:** New feature  
**Service category:** Device Registration and Management  
**Product capability:** Device Lifecycle Management
 
The new Device Overview feature provides actionable insights about devices in your tenant. [Learn more](../devices/device-management-azure-portal.md).
 
---

### Public preview - Azure Active Directory workload identity federation

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Developer Experience
 
Azure AD workload identity federation is a new capability that's in public preview. It frees developers from handling application secrets or certificates. This includes secrets in scenarios such as using GitHub Actions and building applications on Kubernetes. Rather than creating an application secret and using that to get tokens for that application, developers can instead use tokens provided by the respective platforms such as GitHub and Kubernetes without having to manage any secrets manually.[Learn more](../develop/workload-identity-federation.md).

---

### Public Preview - Updates to Sign-in Diagnostic

**Type:** Changed feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
With this update, the diagnostic covers more scenarios and is made more easily available to admins.

New scenarios covered when using the Sign-in Diagnostic:
- Pass Through Authentication sign-in failures
- Seamless Single-Sign On sign-in failures
 
Other changes include:
- Flagged Sign-ins will automatically appear for investigation when using the Sign-in Diagnostic from Diagnose and Solve.
- Sign-in Diagnostic is now available from the Enterprise Apps Diagnose and Solve blade.
- The Sign-in Diagnostic is now available in the Basic Info tab of the Sign-in Log event view for all sign-in events. [Learn more](../reports-monitoring/concept-sign-in-diagnostics-scenarios.md#supported-scenarios).

---

### General Availability - Privileged Role Administrators can now create Azure AD access reviews on role-assignable groups

**Type:** Fixed  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
Privileged Role Administrators can now create Azure AD access reviews on Azure AD role-assignable groups, in addition to Azure AD roles. [Learn more](../governance/deploy-access-reviews.md#who-will-create-and-manage-access-reviews).
 
---

### General Availability - Azure AD single sign-on and device-based Conditional Access support in Firefox on Windows 10/11

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** SSO
 
We now support native single sign-on (SSO) support and device-based Conditional Access to Firefox browser on Windows 10 and Windows Server 2019 starting in Firefox version 91. [Learn more](../conditional-access/require-managed-devices.md#prerequisites).
 
---

### General Availability - New app indicator in My Apps

**Type:** New feature  
**Service category:** My Apps  
**Product capability:** End User Experiences
 
Apps that have been recently assigned to the user show up with a "new" indicator. When the app is launched or the page is refreshed, this indicator disappears. [Learn more](/azure/active-directory/user-help/my-apps-portal-end-user-access).
 
---

### General availability - Custom domain support in Azure AD B2C

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
Azure AD B2C customers can now enable custom domains so their end-users are redirected to a custom URL domain for authentication. This is done via integration with Azure Front Door's custom domains capability. [Learn more](../../active-directory-b2c/custom-domain.md?pivots=b2c-user-flow).
 
---

### General availability - Edge Administrator built-in role

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 

Users in this role can create and manage the enterprise site list required for Internet Explorer mode on Microsoft Edge. This role grants permissions to create, edit, and publish the site list and additionally allows access to manage support tickets. [Learn more](/deployedge/edge-ie-mode-cloud-site-list-mgmt)
 
---

### General availability - Windows 365 Administrator built-in role

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
Users with this role have global permissions on Windows 365 resources, when the service is present. Additionally, this role contains the ability to manage users and devices to associate a policy, and create and manage groups. [Learn more](../roles/permissions-reference.md)
 
---

### New Federated Apps available in Azure AD Application gallery - October 2021

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In October 2021 we've added the following 10 new applications in our App gallery with Federation support:

[Adaptive Shield](../saas-apps/adaptive-shield-tutorial.md), [SocialChorus Search](https://socialchorus.com/), [Hiretual-SSO](../saas-apps/hiretual-tutorial.md), [TeamSticker by Communitio](../saas-apps/teamsticker-by-communitio-tutorial.md), [embed signage](../saas-apps/embed-signage-tutorial.md), [JoinedUp](../saas-apps/joinedup-tutorial.md), [VECOS Releezme Locker management system](../saas-apps/vecos-releezme-locker-management-system-tutorial.md), [Altoura](../saas-apps/altoura-tutorial.md), [Dagster Cloud](../saas-apps/dagster-cloud-tutorial.md), [Qualaroo](../saas-apps/qualaroo-tutorial.md)

You can also find the documentation of all the applications here: https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the following article: https://aka.ms/AzureADAppRequest

---

### Continuous Access Evaluation migration with Conditional Access

**Type:** Changed feature  
**Service category:** Conditional Access  
**Product capability:** User Authentication
 
A new user experience is available for our CAE tenants. Tenants will now access CAE as part of Conditional Access. Any tenants that were previously using CAE for some (but not all) user accounts under the old UX or had previously disabled the old CAE UX will now be required to undergo a one time migration experience.[Learn more](../conditional-access/concept-continuous-access-evaluation.md#migration).
 
---

###  Improved group list blade

**Type:** Changed feature  
**Service category:** Group Management  
**Product capability:** Directory
 
The new group list blade offers more sort and filtering capabilities, infinite scrolling, and better performance. [Learn more](../enterprise-users/groups-members-owners-search.md).
 
---

### General availability - Google deprecation of Gmail sign-in support on embedded webviews on September 30, 2021

**Type:** Changed feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Google has deprecated Gmail sign-ins on Microsoft Teams mobile and custom apps that run Gmail authentications on embedded webviews on Sept. 30th, 2021.

If you would like to request an extension, impacted customers with affected OAuth client ID(s) should have received an email from Google Developers with the following information regarding a one-time policy enforcement extension, which must be completed by Jan 31, 2022.

To continue allowing your Gmail users to sign in and redeem, we strongly recommend that you refer to [Embedded vs System Web](../develop/msal-net-web-browsers.md#embedded-vs-system-web-ui) UI in the MSAL.NET documentation and modify your apps to use the system browser for sign-in. All MSAL SDKs use the system web-view by default. 

As a workaround, we're deploying the device sign-in flow by October 8. Between today and until then, it's likely that it may not be rolled out to all regions yet (in which case, end-users will be met with an error screen until it gets deployed to your region.) 

For more details on the device sign-in flow and details on requesting extension to Google, see [Add Google as an identity provider for B2B guest users](../external-identities/google-federation.md#deprecation-of-web-view-sign-in-support).
 
---

### Identity Governance Administrator can create and manage Azure AD access reviews of groups and applications

**Type:** Changed feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
Identity Governance Administrator can create and manage Azure AD access reviews of groups and applications. [Learn more](../governance/deploy-access-reviews.md#who-will-create-and-manage-access-reviews).
 
---




## September 2021

### Limits on the number of configured API permissions for an application registration will be enforced starting in October 2021

**Type:** Plan for change  
**Service category:** Other  
**Product capability:** Developer Experience
 
Occasionally, application developers configure their apps to require more permissions than it's possible to grant. To prevent this from happening, we're enforcing a limit on the total number of required permissions that can be configured for an app registration.

The total number of required permissions for any single application registration must not exceed 400 permissions, across all APIs. The change to enforce this limit will begin rolling out no sooner than mid-October 2021. Applications exceeding the limit can't increase the number of permissions they're configured for. The existing limit on the number of distinct APIs for which permissions are required remains unchanged and can't exceed 50 APIs.

In the Azure portal, the required permissions are listed under Azure Active Directory > Application registrations > (select an application) > API permissions. Using Microsoft Graph or Microsoft Graph PowerShell, the required permissions are listed in the requiredResourceAccess property of an application entity. [Learn more](../enterprise-users/directory-service-limits-restrictions.md).

---

###  My Apps performance improvements

**Type:** Fixed  
**Service category:** My Apps  
**Product capability:** End User Experiences
 
The load time of My Apps has been improved. Users going to myapps.microsoft.com load My Apps directly, rather than being redirected through another service. [Learn more](../user-help/my-apps-portal-end-user-access.md).

---

### Single Page Apps using the `spa` redirect URI type must use a CORS enabled browser for auth

**Type:** Known issue  
**Service category:** Authentications (Logins)  
**Product capability:** Developer Experience
 
The modern Edge browser is now included in the requirement to provide an `Origin` header when redeeming a [single page app authorization code](../develop/v2-oauth2-auth-code-flow.md#redirect-uris-for-single-page-apps-spas). A compatibility fix accidentally exempted the modern Edge browser from CORS controls, and that bug is being fixed during October. A subset of applications depended on CORS being disabled in the browser, which has the side effect of removing the `Origin` header from traffic. This is an unsupported configuration for using Azure AD, and these apps that depended on disabling CORS can no longer use modern Edge as a security workaround.  All modern browsers must now include the `Origin` header per HTTP spec, to ensure CORS is enforced. [Learn more](../develop/reference-breaking-changes.md#the-device-code-flow-ux-will-now-include-an-app-confirmation-prompt). 

---

### General availability - On the My Apps portal, users can choose to view their apps in a list

**Type:** New feature  
**Service category:** My Apps  
**Product capability:** End User Experiences
 
By default, My Apps displays apps in a grid view. Users can now toggle their My Apps view to display apps in a list. [Learn more](../user-help/my-apps-portal-end-user-access.md).
 
---

### General availability - New and enhanced device-related audit logs

**Type:** New feature  
**Service category:** Audit  
**Product capability:** Device Lifecycle Management
 
Admins can now see various new and improved device-related audit logs. The new audit logs include the create and delete passwordless credentials (Phone sign-in, FIDO2 key, and Windows Hello for Business), register/unregister device and pre-create/delete pre-create device. Additionally, there have been minor improvements to existing device-related audit logs that include adding more device details. [Learn more](../reports-monitoring/concept-audit-logs.md).

---

### General availability - Azure AD users can now view and report suspicious sign-ins and manage their accounts within Microsoft Authenticator

**Type:** New feature  
**Service category:** Microsoft Authenticator App  
**Product capability:** Identity Security & Protection
 
This feature allows Azure AD users to manage their work or school accounts within the Microsoft Authenticator app. The management features will allow users to view sign-in history and sign-in activity. They can report any suspicious or unfamiliar activity based on the sign-in history and activity if necessary. Users also can change their Azure AD account passwords and update the account's security information. [Learn more](../user-help/my-account-portal-sign-ins-page.md).
 
---

### General availability - New MS Graph APIs for role management

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
New APIs for role management to MS Graph v1.0 endpoint are generally available. Instead of old [directory roles](/graph/api/resources/directoryrole?view=graph-rest-1.0&preserve-view=true), use [unifiedRoleDefinition](/graph/api/resources/unifiedroledefinition?view=graph-rest-1.0&preserve-view=true) and [unifiedRoleAssignment](/graph/api/resources/unifiedroleassignment?view=graph-rest-1.0&preserve-view=true).
 
---

### General availability - Access Packages can expire after number of hours

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management

It's now possible in entitlement management to configure an access package that will expire in a matter of hours in addition to the previous support for days or specific dates. [Learn more](../governance/entitlement-management-access-package-create.md#lifecycle).
 
---

### New provisioning connectors in the Azure AD Application Gallery - September 2021

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [BLDNG APP](../saas-apps/bldng-app-provisioning-tutorial.md)
- [Cato Networks](../saas-apps/cato-networks-provisioning-tutorial.md)
- [Rouse Sales](../saas-apps/rouse-sales-provisioning-tutorial.md)
- [SchoolStream ASA](../saas-apps/schoolstream-asa-provisioning-tutorial.md)
- [Taskize Connect](../saas-apps/taskize-connect-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../manage-apps/user-provisioning.md).
 
---

### New Federated Apps available in Azure AD Application gallery - September 2021

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In September 2021, we have added following 44 new applications in our App gallery with Federation support

[Studybugs](https://studybugs.com/signin), [Yello](https://yello.co/yello-for-microsoft-teams/), [LawVu](../saas-apps/lawvu-tutorial.md), [Formate eVo Mail](https://www.document-genetics.co.uk/formate-evo-erp-output-management), [Revenue Grid](https://app.revenuegrid.com/login), [Orbit for Office 365](https://azuremarketplace.microsoft.com/marketplace/apps/aad.orbitforoffice365?tab=overview), [Upmarket](https://app.upmarket.ai/), [Alinto Protect](https://protect.alinto.net/), [Cloud Concinnity](https://cloudconcinnity.com/), [Matlantis](https://matlantis.com/), [ModelGen for Visio (MG4V)](https://crecy.com.au/model-gen/), [NetRef: Classroom Management](https://oauth.net-ref.com/microsoft/sso), [VergeSense](../saas-apps/vergesense-tutorial.md), [SafetyCulture](../saas-apps/safety-culture-tutorial.md), [Secutraq](https://secutraq.net/login), [Active and Thriving](../saas-apps/active-and-thriving-tutorial.md), [Inova](https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=1bacdba3-7a3b-410b-8753-5cc0b8125f81&response_type=code&redirect_uri=https:%2f%2fbroker.partneringplace.com%2fpartner-companion%2f&code_challenge_method=S256&code_challenge=YZabcdefghijklmanopqrstuvwxyz0123456789._-~&scope=1bacdba3-7a3b-410b-8753-5cc0b8125f81/.default), [TerraTrue](../saas-apps/terratrue-tutorial.md), [Beyond Identity Admin Console](../saas-apps/beyond-identity-admin-console-tutorial.md), [Visult](https://visult.app), [ENGAGE TAG](https://app.engagetag.com/), [Appaegis Isolation Access Cloud](../saas-apps/appaegis-isolation-access-cloud-tutorial.md), [CrowdStrike Falcon Platform](../saas-apps/crowdstrike-falcon-platform-tutorial.md), [MY Emergency Control](https://my-emergency.co.uk/app/auth/login), [AlexisHR](../saas-apps/alexishr-tutorial.md), [Teachme Biz](../saas-apps/teachme-biz-tutorial.md), [Zero Networks](../saas-apps/zero-networks-tutorial.md), [Mavim iMprove](https://improve.mavimcloud.com/), [Azumuta](https://app.azumuta.com/login?microsoft=true), [Frankli](https://beta.frankli.io/login), [Amazon Managed Grafana](../saas-apps/amazon-managed-grafana-tutorial.md), [Productive](../saas-apps/productive-tutorial.md), [Create!Webフロー](../saas-apps/createweb-tutorial.md), [Evercate](https://evercate.com/), [Ezra Coaching](../saas-apps/ezra-coaching-tutorial.md), [Baldwin Safety and Compliance](../saas-apps/baldwin-safety-&-compliance-tutorial.md), [Nulab Pass (Backlog,Cacoo,Typetalk)](../saas-apps/nulab-pass-tutorial.md), [Metatask](../saas-apps/metatask-tutorial.md), [Contrast Security](../saas-apps/contrast-security-tutorial.md), [Animaker](../saas-apps/animaker-tutorial.md), [Traction Guest](../saas-apps/traction-guest-tutorial.md), [True Office Learning - LIO](../saas-apps/true-office-learning-lio-tutorial.md), [Qiita Team](../saas-apps/qiita-team-tutorial.md)

You can also find the documentation of all the applications here: https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here: https://aka.ms/AzureADAppRequest

---

###  Gmail users signing in on Microsoft Teams mobile and desktop clients will sign in with device sign-in flow starting September 30, 2021

**Type:** Changed feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Starting on September 30 2021, Azure AD B2B guests and Azure AD B2C customers signing in with their self-service signed up or redeemed Gmail accounts will have an extra sign-in step. Users will now be prompted to enter a code in a separate browser window to finish signing in on Microsoft Teams mobile and desktop clients. If you haven't already done so, make sure to modify your apps to use the system browser for sign-in. See [Embedded vs System Web UI in the MSAL.NET](../develop/msal-net-web-browsers.md#embedded-vs-system-web-ui) documentation for more information. All MSAL SDKs use the system web-view by default. 

As the device sign-in flow will start September 30, 2021, it may not be available in your region immediately. If it's not available yet, your end-users will be met with the error screen shown in the doc until it gets deployed to your region.) For more details on the device sign-in flow and details on requesting extension to Google, see [Add Google as an identity provider for B2B guest users](../external-identities/google-federation.md#deprecation-of-web-view-sign-in-support).
 
---

### Improved Conditional Access Messaging for Non-compliant Device

**Type:** Changed feature  
**Service category:** Conditional Access  
**Product capability:** End User Experiences
 
The text and design on the Conditional Access blocking screen shown to users when their device is marked as non-compliant has been updated. Users will be blocked until they take the necessary actions to meet their company's device compliance policies. Additionally, we have streamlined the flow for a user to open their device management portal. These improvements apply to all conditional access supported OS platforms. [Learn more](https://support.microsoft.com/account-billing/troubleshooting-the-you-can-t-get-there-from-here-error-message-479a9c42-d9d1-4e44-9e90-24bbad96c251) 

---


## August 2021

### New major version of AADConnect available

**Type:** Fixed  
**Service category:** AD Connect  
**Product capability:** Identity Lifecycle Management
 
We've released a new major version of Azure Active Directory Connect. This version contains several updates of foundational components to the latest versions and is recommended for all customers using Azure AD Connect. [Learn more](../hybrid/whatis-azure-ad-connect-v2.md).
 
---

### Public Preview - Azure AD single sign-on and device-based Conditional Access support in Firefox on Windows 10

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** SSO
 

We now support native single sign-on (SSO) support and device-based Conditional Access to the Firefox browser on Windows 10 and Windows Server 2019. Support is available in Firefox version 91. [Learn more](../conditional-access/require-managed-devices.md#prerequisites).
 
---

### Public preview - beta MS Graph APIs for Azure AD access reviews returns list of contacted reviewer names

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 

We've released beta MS Graph API for Azure AD access reviews. The API has methods to return a list of contacted reviewer names in addition to the reviewer type. [Learn more](/graph/api/resources/accessreviewinstance).
 
---

### General Availability - "Register or join devices" user action in Conditional Access

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection
 

The "Register or join devices" user action is generally available in Conditional access. This user action allows you to control multi-factor authentication policies for Azure Active Directory (AD) device registration. Currently, this user action only allows you to enable multi-factor authentication as a control when users register or join devices to Azure AD. Other controls that are dependent on or not applicable to Azure AD device registration continue to be disabled with this user action. [Learn more](../conditional-access/concept-conditional-access-cloud-apps.md#user-actions).

---

### General Availability - customers can scope reviews of privileged roles to eligible or permanent assignments

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
Administrators can now create access reviews of only permanent or eligible assignments to privileged Azure AD or Azure resource roles. [Learn more](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md).
 
--- 

### General availability - assign roles to Azure Active Directory (AD) groups

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 

Assigning roles to Azure AD groups is now generally available. This feature can simplify the management of role assignments in Azure AD for Global Administrators and Privileged Role Administrators. [Learn more](../roles/groups-concept.md). 
 
---

### New Federated Apps available in Azure AD Application gallery - Aug 2021

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In August 2021, we have added following 46 new applications in our App gallery with Federation support:

[Siriux Customer Dashboard](https://portal.siriux.tech/login), [STRUXI](https://struxi.app/), [Autodesk Construction Cloud - Meetings](https://acc.autodesk.com/), [Eccentex AppBase for Azure](../saas-apps/eccentex-appbase-for-azure-tutorial.md), [Bookado](https://adminportal.bookado.io/), [FilingRamp](https://app.filingramp.com/login), [BenQ IAM](../saas-apps/benq-iam-tutorial.md), [Rhombus Systems](../saas-apps/rhombus-systems-tutorial.md), [CorporateExperience](../saas-apps/corporateexperience-tutorial.md), [TutorOcean](../saas-apps/tutorocean-tutorial.md), [Bookado Device](https://adminportal.bookado.io/), [HiFives-AD-SSO](https://app.hifives.in/login/azure), [Darzin](https://au.darzin.com/), [Simply Stakeholders](https://au.simplystakeholders.com/), [KACTUS HCM - Smart People](https://kactusspc.digitalware.co/), [Five9 UC Adapter for Microsoft Teams V2](https://uc.five9.net/?vendor=msteams), [Automation Center](https://automationcenter.cognizantgoc.com/portal/boot/signon), [Cirrus Identity Bridge for Azure AD](../saas-apps/cirrus-identity-bridge-for-azure-ad-tutorial.md), [ShiftWizard SAML](../saas-apps/shiftwizard-saml-tutorial.md), [Safesend Returns](https://www.safesendwebsites.com/), [Brushup](../saas-apps/brushup-tutorial.md), [directprint.io Cloud Print Administration](../saas-apps/directprint-io-cloud-print-administration-tutorial.md), [plain-x](https://app.plain-x.com/#/login),[X-point Cloud](../saas-apps/x-point-cloud-tutorial.md), [SmartHub INFER](../saas-apps/smarthub-infer-tutorial.md), [Fresh Relevance](../saas-apps/fresh-relevance-tutorial.md), [FluentPro G.A. Suite](https://gas.fluentpro.com/Account/SSOLogin?provider=Microsoft), [Clockwork Recruiting](../saas-apps/clockwork-recruiting-tutorial.md), [WalkMe SAML2.0](../saas-apps/walkme-saml-tutorial.md), [Sideways 6](https://app.sideways6.com/account/login?ReturnUrl=/), [Kronos Workforce Dimensions](../saas-apps/kronos-workforce-dimensions-tutorial.md), [SysTrack Cloud Edition](https://cloud.lakesidesoftware.com/Cloud/Account/Login), [mailworx Dynamics CRM Connector](https://www.mailworx.info/), [Palo Alto Networks Cloud Identity Engine - Cloud Authentication Service](../saas-apps/palo-alto-networks-cloud-identity-engine---cloud-authentication-service-tutorial.md), [Peripass](https://accounts.peripass.app/v1/sso/challenge), [JobDiva](https://www.jobssos.com/index_azad.jsp?SSO=AZURE&ID=1), [Sanebox For Office365](https://sanebox.com/login), [Tulip](../saas-apps/tulip-tutorial.md), [HP Wolf Security](https://www.hpwolf.com/), [Genesys Engage cloud Email](https://login.microsoftonline.com/common/oauth2/authorize?prompt=consent&accessType=offline&state=07e035a7-6fb0-4411-afd9-efa46c9602f9&resource=https://graph.microsoft.com/&response_type=code&redirect_uri=https://iwd.api01-westus2.dev.genazure.com/iwd/v3/emails/oauth2/microsoft/callback&client_id=36cd21ab-862f-47c8-abb6-79facad09dda), [Meta Wiki](https://meta.dunkel.eu/), [Palo Alto Networks Cloud Identity Engine Directory Sync](https://directory-sync.us.paloaltonetworks.com/directory?instance=L2qoLVONpBHgdJp1M5K9S08Z7NBXlpi54pW1y3DDu2gQqdwKbyUGA11EgeaDfZ1dGwn397S8eP7EwQW3uyE4XL), [Valarea](https://www.valarea.com/en/download), [LanSchool Air](../saas-apps/lanschool-air-tutorial.md), [Catalyst](https://www.catalyst.org/sso-login/), [Webcargo](../saas-apps/webcargo-tutorial.md)

You can also find the documentation of all the applications here: https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here: https://aka.ms/AzureADAppRequest

---

### New provisioning connectors in the Azure AD Application Gallery - August 2021

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Chatwork](../saas-apps/chatwork-provisioning-tutorial.md)
- [Freshservice](../saas-apps/freshservice-provisioning-tutorial.md)
- [InviteDesk](../saas-apps/invitedesk-provisioning-tutorial.md)
- [Maptician](../saas-apps/maptician-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see Automate user provisioning to SaaS applications with Azure AD.
 
---

### Multifactor fraud report – new audit event

**Type:** Changed feature  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 

To help administrators understand that their users are blocked for multi-factor authentication as a result of fraud report, we've added a new audit event. This audit event is tracked when the user reports fraud. The audit log is available in addition to the existing information in the sign-in logs about fraud report. To learn how to get the audit report, see [multi-factor authentication Fraud alert](../authentication/howto-mfa-mfasettings.md#report-suspicious-activity).

---

### Improved Low-Risk Detections

**Type:** Changed feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection

To improve the quality of low risk alerts that Identity Protection issues, we've modified the algorithm to issue fewer low risk Risky sign-ins. Organizations may see a significant reduction in low risk sign-in in their environment. [Learn more](../identity-protection/concept-identity-protection-risks.md).
 
---

### Non-interactive risky sign-ins

**Type:** Changed feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 
Identity Protection now emits risky sign-ins on non-interactive sign-ins. Admins can find these risky sign-ins using the **sign-in type** filter in the risky sign-ins report. [Learn more](../identity-protection/howto-identity-protection-investigate-risk.md).
 
---

### Change from User Administrator to Identity Governance Administrator in Entitlement Management 

**Type:** Changed feature  
**Service category:** Roles  
**Product capability:** Identity Governance
 
The permissions assignments to manage access packages and other resources in Entitlement Management are moving from the User Administrator role to the Identity Governance administrator role. 

Users that have been assigned the User administrator role can longer create catalogs or manage access packages in a catalog they don't own. If users in your organization have been assigned the User administrator role to configure catalogs, access packages, or policies in entitlement management, they'll need a new assignment. You should instead assign these users the Identity Governance administrator role. [Learn more](../governance/entitlement-management-delegate.md)

---

### Microsoft Azure Active Directory connector is deprecated

**Type:** Deprecated  
**Service category:** Microsoft Identity Manager  
**Product capability:** Identity Lifecycle Management
 
The Microsoft Azure Active Directory Connector for FIM is at feature freeze and deprecated. The solution of using FIM and the Azure AD Connector has been replaced. Existing deployments should migrate to [Azure AD Connect](../hybrid/whatis-hybrid-identity.md), Azure AD Connect Sync, or the [Microsoft Graph Connector](/microsoft-identity-manager/microsoft-identity-manager-2016-connector-graph), as the internal interfaces used by the Azure AD Connector for FIM are being removed from Azure AD. [Learn more](/microsoft-identity-manager/microsoft-identity-manager-2016-deprecated-features).

---

### Retirement of older Azure AD Connect versions

**Type:** Deprecated  
**Service category:** AD Connect  
**Product capability:** User Management
 
Starting August 31 2022, all V1 versions of Azure AD Connect will be retired. If you haven't already done so, you need to update your server to Azure AD Connect V2.0. You need to make sure you're running a recent version of Azure AD Connect to receive an optimal support experience.

If you run a retired version of Azure AD Connect, it may unexpectedly stop working. You may also not have the latest security fixes, performance improvements, troubleshooting, and diagnostic tools and service enhancements. Also, if you require support we can't provide you with the level of service your organization needs.

See [Azure Active Directory Connect V2.0](../hybrid/whatis-azure-ad-connect-v2.md), what has changed in V2.0 and how this change impacts you.

---

### Retirement of support for installing MIM on Windows Server 2008 R2 or SQL Server 2008 R2

**Type:** Deprecated  
**Service category:** Microsoft Identity Manager  
**Product capability:** Identity Lifecycle Management
 
Deploying MIM Sync, Service, Portal or CM on Windows Server 2008 R2, or using SQL Server 2008 R2 as the underlying database, is deprecated as these platforms are no longer in mainstream support. Installing MIM Sync and other components on Windows Server 2016 or later, and with SQL Server 2016 or later, is recommended.

Deploying MIM for Privileged Access Management with a Windows Server 2012 R2 domain controller in the PRIV forest is deprecated. Use Windows Server 2016 or later Active Directory, with Windows Server 2016 functional level, for your PRIV forest domain. The Windows Server 2012 R2 functional level is still permitted for a CORP forest's domain. [Learn more](/microsoft-identity-manager/microsoft-identity-manager-2016-supported-platforms).

---

## July 2021

### New Google sign-in integration for Azure AD B2C and B2B self-service sign-up and invited external users will stop working starting July 12, 2021

**Type:** Plan for change  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Previously we announced that [the exception for Embedded WebViews for Gmail authentication will expire in the second half of 2021](https://www.yammer.com/cepartners/threads/1188371962232832).

On July 7, 2021, we learned from Google that some of these restrictions will apply starting **July 12, 2021**. Azure AD B2B and B2C customers who set up a new Google ID sign-in in their custom or line of business applications to invite external users or enable self-service sign-up will have the restrictions applied immediately. As a result, end-users will be met with an error screen that blocks their Gmail sign-in if the authentication is not moved to a system webview. See the docs linked below for details. 

Most apps use system web-view by default, and will not be impacted by this change. This only applies to customers using embedded webviews (the non-default setting.) We advise customers to move their application's authentication to system browsers instead, prior to creating any new Google integrations. To learn how to move to system browsers for Gmail authentications, read the Embedded vs System Web UI section in the [Using web browsers (MSAL.NET)](../develop/msal-net-web-browsers.md#embedded-vs-system-web-ui) documentation. All MSAL SDKs use the system web-view by default. [Learn more](../external-identities/google-federation.md#deprecation-of-web-view-sign-in-support).

---

### Google sign-in on embedded web-views expiring September 30, 2021

**Type:** Plan for change  
**Service category:** B2B  
**Product capability:** B2B/B2C
 

About two months ago we announced that the exception for Embedded WebViews for Gmail authentication will expire in the second half of 2021. 

Recently, Google has specified the date to be **September 30, 2021**. 

Rolling out globally beginning September 30, 2021, Azure AD B2B guests signing in with their Gmail accounts will now be prompted to enter a code in a separate browser window to finish signing in on Microsoft Teams mobile and desktop clients. This applies to invited guests and guests who signed up using Self-Service Sign-Up. 

Azure AD B2C customers who have set up embedded webview Gmail authentications in their custom/line of business apps or have existing Google integrations, will no longer can let their users sign in with Gmail accounts. To mitigate this, make sure to modify your apps to use the system browser for sign-in. For more information, read the Embedded vs System Web UI section in the [Using web browsers (MSAL.NET)](../develop/msal-net-web-browsers.md#embedded-vs-system-web-ui) documentation. All MSAL SDKs use the system web-view by default. 

As the device sign-in flow will start rolling out on September 30, 2021, it's likely that it may not be rolled out to your region yet (in which case, your end-users will be met with the error screen shown in the documentation until it gets deployed to your region.) 

For details on known impacted scenarios and what experience your users can expect, read [Add Google as an identity provider for B2B guest users](../external-identities/google-federation.md#deprecation-of-web-view-sign-in-support).

---

### Bug fixes in My Apps

**Type:** Fixed  
**Service category:** My Apps  
**Product capability:** End User Experiences
 
- Previously, the presence of the banner recommending the use of collections caused content to scroll behind the header. This issue has been resolved. 
- Previously, there was another issue when adding apps to a collection, the order of apps in All Apps collection would get randomly reordered. This issue has also been resolved. 

For more information on My Apps, read [Sign in and start apps from the My Apps portal](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

---

### Public preview -  Application authentication method policies

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Developer Experience
 
Application authentication method policies in MS Graph which allow IT admins to enforce lifetime on application password secret credential or block the use of secrets altogether. Policies can be enforced for an entire tenant as a default configuration and it can be scoped to specific applications or service principals. [Learn more](/graph/api/resources/policy-overview).
 
---

### Public preview -  Authentication Methods registration campaign to download Microsoft Authenticator

**Type:** New feature  
**Service category:** Microsoft Authenticator App  
**Product capability:** User Authentication
 
The Authenticator registration campaign helps admins to move their organizations to a more secure posture by prompting users to adopt the Microsoft Authenticator app. Prior to this feature, there was no way for an admin to push their users to set up the Authenticator app. 

The registration campaign comes with the ability for an admin to scope users and groups by including and excluding them from the registration campaign to ensure a smooth adoption across the organization. [Learn more](../authentication/how-to-mfa-registration-campaign.md)
 
---

### Public preview -  Separation of duties check 

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
In Azure AD entitlement management, an administrator can define that an access package is incompatible with another access package or with a group. Users who have the incompatible memberships will be then unable to request more access. [Learn more](../governance/entitlement-management-access-package-request-policy.md#prevent-requests-from-users-with-incompatible-access).
 
---

### Public preview -  Identity Protection logs in Log Analytics, Storage Accounts, and Event Hubs

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 
You can now send the risky users and risk detections logs to Azure Monitor, Storage Accounts, or Log Analytics using the Diagnostic Settings in the Azure AD blade. [Learn more](../identity-protection/howto-export-risk-data.md).
 
---

### Public preview -  Application Proxy API addition for backend SSL certificate validation

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** Access Control
 
The onPremisesPublishing resource type now includes the property, "isBackendCertificateValidationEnabled" which indicates whether backend SSL certificate validation is enabled for the application. For all new Application Proxy apps, the property will be set to true by default. For all existing apps, the property will be set to false. For more information, read the [onPremisesPublishing resource type](/graph/api/resources/onpremisespublishing?view=graph-rest-beta&preserve-view=true) api.
 
---

### General availability - Improved Authenticator setup experience for add Azure AD account in Microsoft Authenticator app by directly signing into the app.

**Type:** New feature  
**Service category:** Microsoft Authenticator App  
**Product capability:** User Authentication
 
Users can now use their existing authentication methods to directly sign into the Microsoft Authenticator app to set up their credential. Users don't need to scan a QR Code anymore and can use a Temporary Access Pass (TAP) or Password + SMS (or other authentication method) to configure their account in the Authenticator app.

This improves the user credential provisioning process for the Microsoft Authenticator app and gives the end user a self-service method to provision the app. [Learn more](https://support.microsoft.com/account-billing/add-your-work-or-school-account-to-the-microsoft-authenticator-app-43a73ab5-b4e8-446d-9e54-2a4cb8e4e93c#sign-in-with-your-credentials).
 
---

### General availability - Set manager as reviewer in Azure AD entitlement management access packages

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
Access packages in Azure AD entitlement management now support setting the user's manager as the reviewer for regularly occurring access reviews. [Learn more](../governance/entitlement-management-access-reviews-create.md).

---

### General availability - Enable external users to self-service sign up in Azure Active Directory using MSA accounts

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Users can now enable external users to self-service sign up in Azure Active Directory using Microsoft accounts. [Learn more](../external-identities/microsoft-account.md).
 
---
 
### General availability - External Identities Self-Service Sign-Up with Email One-time Passcode

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 

Now users can enable external users to self-service sign up in Azure Active Directory using their email and one-time passcode. [Learn more](../external-identities/one-time-passcode.md).
 
---

### General availability - Anomalous token

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 
Anomalous token detection is now available in Identity Protection. This feature can detect that there are abnormal characteristics in the token such as time active and authentication from unfamiliar IP address. [Learn more](../identity-protection/concept-identity-protection-risks.md#sign-in-risk).
 
---

### General availability - Register or join devices in Conditional Access

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection
 
The Register or join devices user action in Conditional access is now in general availability. This user action allows you to control multifactor authentication (MFA) policies for Azure AD device registration. 

Currently, this user action only allows you to enable multifactor authentication as a control when users register or join devices to Azure AD. Other controls that are dependent on or not applicable to Azure AD device registration continue to be disabled with this user action. [Learn more](../conditional-access/concept-conditional-access-cloud-apps.md#user-actions). 

---

### New provisioning connectors in the Azure AD Application Gallery - July 2021

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Clebex](../saas-apps/clebex-provisioning-tutorial.md)
- [Exium](../saas-apps/exium-provisioning-tutorial.md)
- [SoSafe](../saas-apps/sosafe-provisioning-tutorial.md)
- [Talentech](../saas-apps/talentech-provisioning-tutorial.md)
- [Thrive LXP](../saas-apps/thrive-lxp-provisioning-tutorial.md)
- [Vonage](../saas-apps/vonage-provisioning-tutorial.md)
- [Zip](../saas-apps/zip-provisioning-tutorial.md)
- [TimeClock 365](../saas-apps/timeclock-365-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, read [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### Changes to security and Microsoft 365 group settings in Azure portal

**Type:** Changed feature  
**Service category:** Group Management  
**Product capability:** Directory
 

In the past, users could create security groups  and Microsoft 365 groups in the Azure portal. Now users will have the ability to create  groups across Azure portals, PowerShell, and API. Customers are required to verify and update the new settings have been configured for their organization. [Learn More](../enterprise-users/groups-self-service-management.md#group-settings).
 
---

### "All Apps" collection has been renamed to "Apps"

**Type:** Changed feature  
**Service category:** My Apps  
**Product capability:** End User Experiences
 
In the My Apps portal, the collection that was called "All Apps" has been renamed to be called "Apps". As the product evolves, "Apps" is a more fitting name for this default collection. [Learn more](../manage-apps/my-apps-deployment-plan.md#plan-the-user-experience).
 
---

