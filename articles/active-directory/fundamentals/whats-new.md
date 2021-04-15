---
title: What's new? Release notes - Azure Active Directory | Microsoft Docs
description: Learn what is new with Azure Active Directory; such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: active-directory
author: ajburnle
manager: daveba
featureFlags:
 - clicktale
 
ms.assetid: 06a149f7-4aa1-4fb9-a8ec-ac2633b031fb
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 3/31/2021
ms.author: ajburnle
ms.reviewer: dhanyahk
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# What's new in Azure Active Directory?

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Release+notes+-+Azure+Active+Directory%22&locale=en-us` into your ![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png) feed reader.

Azure AD receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [Archive for What's new in Azure Active Directory](whats-new-archive.md).

---

## March 2021

### Guidance on how to enable support for TLS 1.2 in your environment, in preparation for upcoming Azure AD TLS 1.0/1.1 deprecation

**Type:** Plan for change  
**Service category:** N/A  
**Product capability:** Standards

Azure Active Directory will deprecate the following protocols in Azure Active Directory worldwide regions starting June 30, 2021:


- TLS 1.0
- TLS 1.1
- 3DES cipher suite (TLS_RSA_WITH_3DES_EDE_CBC_SHA)

Affected environments include:

- Azure Commercial Cloud
- Office 365 GCC and WW

For additional guidance, refer to [Enable support for TLS 1.2 in your environment for Azure AD TLS 1.1 and 1.0 deprecation](https://docs.microsoft.com/troubleshoot/azure/active-directory/enable-support-tls-environment).

---

### Public Preview - Azure AD Entitlement management now supports multi-geo SharePoint Online

**Type:** New feature  
**Service category:** Other  
**Product capability:** Entitlement Management
 
For organizations using multi-geo SharePoint Online, you can now include sites from specific multi-geo environments to your Entitlement management access packages. [Learn more](../governance/entitlement-management-catalog-create.md#add-a-multi-geo-sharepoint-site-preview).

---

### Public Preview - Restore deleted apps from App registrations

**Type:** New feature  
**Service category:** Other  
**Product capability:** Developer Experience
 
Customers can now view, restore, and permanently remove deleted app registrations from the Azure portal. This applies only to applications associated to a directory, not applications from a personal Microsoft account. [Learn more](../develop/quickstart-restore-app.md).
 
---

### Public preview - New "User action" in Conditional Access for registering or joining devices

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection
 
 A new user action called "Register or join devices" in Conditional access is available. This user action allows you to control Multi-factor authentication (MFA) policies for Azure AD device registration. 

Currently, this user action only allows you to enable MFA as a control when users register or join devices to Azure AD. Other controls that are dependent on or not applicable to Azure AD device registration are disabled with this user action. [Learn more](../conditional-access/concept-conditional-access-cloud-apps.md#user-actions). 
 
---

### Public Preview - Optimize connector groups to use the closest Application Proxy cloud service

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** Access Control
 
With this new capability, connector groups can be assigned to the closest regional Application Proxy service an application is hosted in. This can improve app performance in scenarios where apps are hosted in regions other than the home tenant’s region. [Learn more](../manage-apps/application-proxy-network-topology.md#optimize-connector-groups-to-use-closest-application-proxy-cloud-service-preview). 
 
---

### Public Preview - External Identities Self-Service Sign-up in AAD using Email One-Time Passcode accounts

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C

External users will now be able to use Email One-Time Passcode accounts to sign up in to Azure AD 1st party and LOB apps. [Learn more](../external-identities/one-time-passcode.md).

---

### Public Preview - Availability of AD FS Sign-Ins in Azure AD

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** Monitoring & Reporting
 
AD FS sign-in activity can now be integrated with Azure AD activity reporting, providing a unified view of hybrid identity infrastructure. Using the Azure AD Sign-Ins report, Log Analytics, and Azure Monitor Workbooks, it's possible to perform in-depth analysis for both AAD and AD FS sign-in scenarios such as AD FS account lockouts, bad password attempts, and spikes of unexpected sign-in attempts.

To learn more, visit [AD FS sign-ins in Azure AD with Connect Health](../hybrid/how-to-connect-health-ad-fs-sign-in.md).

---

### General availability - Staged rollout to cloud authentication

**Type:** New feature  
**Service category:** AD Connect  
**Product capability:** User Authentication
 
Staged rollout to cloud authentication is now generally available. The staged rollout feature allows you to selectively test groups of users with cloud authentication methods, such as Passthrough Authentication (PTA) or Password Hash Sync (PHS). Meanwhile, all other users in the federated domains continue to use federation services, such as AD FS or any other federation services to authenticate users. [Learn more](../hybrid/how-to-connect-staged-rollout.md).

---

### General Availability - User Type attribute can now be updated in the Azure admin portal

**Type:** New feature  
**Service category:** User Experience and Management  
**Product capability:** User Management
 
Customers can now update the user type of Azure AD users when they update their user profile information from the Azure admin portal. The user type can be updated from Microsoft Graph also. To learn more, see [Add or update user profile information](active-directory-users-profile-azure-portal.md).
 
---

### General Availability - Replica Sets for Azure Active Directory Domain Services

**Type:** New feature  
**Service category:** Azure AD Domain Services  
**Product capability:** Azure AD Domain Services
 
The capability of replica sets in Azure AD DS is now generally available. [Learn more](https://docs.microsoft.com/azure/active-directory-domain-services/concepts-replica-sets).
 
---

### General availability - Collaborate with your partners using Email One-Time Passcode in the Azure Government cloud

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Organizations in the Microsoft Azure Government cloud can now enable their guests to redeem invitations with Email One-Time Passcode. This ensures that any guest users with no Azure AD, Microsoft, or Gmail accounts in the Azure Government cloud can still collaborate with their partners by requesting and entering a temporary code to sign in to shared resources. [Learn more](../external-identities/one-time-passcode.md#note-for-azure-us-government-customers).

---

### New Federated Apps available in Azure AD Application gallery - March 2021

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In March 2021 we have added following 37 new applications in our App gallery with Federation support:

[Bambuser Live Video Shopping](https://lcx.bambuser.com/), [DeepDyve Inc](https://www.deepdyve.com/azure-sso), [Moqups](../saas-apps/moqups-tutorial.md), [RICOH Spaces Mobile](https://ricohspaces.app/welcome), [Flipgrid](https://auth.flipgrid.com/), [hCaptcha Enterprise](../saas-apps/hcaptcha-enterprise-tutorial.md), [SchoolStream ASA](https://jsd.schoolstreamk12.com/ASA/ASAlogin.aspx), [TransPerfect GlobalLink Dashboard](../saas-apps/transperfect-globallink-dashboard-tutorial.md), [SimplificaCI](https://app.simplificaci.com.br/), [Thrive LXP](../saas-apps/thrive-lxp-tutorial.md), [Lexonis TalentScape](../saas-apps/lexonis-talentscape-tutorial.md), [Exium](../saas-apps/exium-tutorial.md), [Sapient](../saas-apps/sapient-tutorial.md), [TrueChoice](../saas-apps/truechoice-tutorial.md), [RICOH Spaces](https://ricohspaces.app/welcome), [Saba Cloud](../saas-apps/learning-at-work-tutorial.md), [Acunetix 360](../saas-apps/acunetix-360-tutorial.md), [Exceed.ai](../saas-apps/exceed-ai-tutorial.md), [GitHub Enterprise Managed User](../saas-apps/github-enterprise-managed-user-tutorial.md), [Enterprise Vault.cloud for Outlook](https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=id_token&scope=openid%20profile%20User.Read&client_id=7176efe5-e954-4aed-b5c8-f5c85a980d3a&nonce=4b9e1981-1bcb-4938-a283-86f6931dc8cb), [Smartlook](../saas-apps/smartlook-tutorial.md), [Accenture Academy](../saas-apps/accenture-academy-tutorial.md), [Onshape](../saas-apps/onshape-tutorial.md), [Tradeshift](../saas-apps/tradeshift-tutorial.md), [JuriBlox](../saas-apps/juriblox-tutorial.md), [SecurityStudio](../saas-apps/securitystudio-tutorial.md), [ClicData](https://app.clicdata.com/), [Evergreen](../saas-apps/evergreen-tutorial.md), [Patchdeck](https://patchdeck.com/ad_auth/authenticate/), [FAX.PLUS](../saas-apps/fax.plus-tutorial.md), [ValidSign](../saas-apps/validsign-tutorial.md), [AWS Single Sign-on](../saas-apps/aws-single-sign-on-tutorial.md), [Nura Space](https://dashboard.nuraspace.com/login), [Broadcom DX SaaS](../saas-apps/broadcom-dx-saas-tutorial.md), [Interplay Learning](https://skilledtrades.interplaylearning.com/#login), [SendPro Enterprise](../saas-apps/sendpro-enterprise-tutorial.md), [FortiSASE SIA](../saas-apps/fortisase-sia-tutorial.md)

You can also find the documentation of all the applications here: https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here: https://aka.ms/AzureADAppRequest

---

### New provisioning connectors in the Azure AD Application Gallery - March 2021

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [AWS Single Sign-on](../saas-apps/aws-single-sign-on-provisioning-tutorial.md)
- [Bpanda](../saas-apps/bpanda-provisioning-tutorial.md)
- [Britive](../saas-apps/britive-provisioning-tutorial.md)
- [GitHub Enterprise Managed User](../saas-apps/github-enterprise-managed-user-provisioning-tutorial.md)
- [Grammarly](../saas-apps/grammarly-provisioning-tutorial.md)
- [LogicGate](../saas-apps/logicgate-provisioning-tutorial.md)
- [SecureLogin](../saas-apps/secure-login-provisioning-tutorial.md)
- [TravelPerk](../saas-apps/travelperk-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 
---

### Introducing MS Graph API for Company Branding

**Type:** Changed feature  
**Service category:** MS Graph  
**Product capability:** B2B/B2C

[MS Graph API for the Company Branding](https://docs.microsoft.com/graph/api/resources/organizationalbrandingproperties)  is available for the Azure AD or Microsoft 365 login experience to allow the management of the branding parameters programmatically.

---

### General availability - Header-based authentication SSO with Application Proxy

**Type:** Changed feature  
**Service category:** App Proxy  
**Product capability:** Access Control
 
Azure AD Application Proxy native support for header-based authentication is now in general availability. With this feature, you can configure the user attributes required as HTTP headers for the application without additional components needed to deploy. [Learn more](../manage-apps/application-proxy-configure-single-sign-on-with-headers.md).

---

### Two-way SMS for MFA Server is no longer supported

**Type:** Deprecated  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 

Two-way SMS for MFA Server was originally deprecated in 2018, and will not be supported after February 24, 2021. Administrators should enable another method for users who still use two-way SMS.

Email notifications and Azure Portal Service Health notifications were sent to affected admins on December 8, 2020 and January 28, 2021. The alerts went to the Owner, Co-Owner, Admin, and Service Admin RBAC roles tied to the subscriptions. [Learn more](../authentication/how-to-authentication-two-way-sms-unsupported.md).
 
---
 
## February 2021

### Email one-time passcode authentication on by default starting October 2021

**Type:** Plan for change  
**Service category:** B2B  
**Product capability:** B2B/B2C
 

Starting October 31, 2021, Microsoft Azure Active Directory [email one-time passcode authentication](../external-identities/one-time-passcode.md) will become the default method for inviting accounts and tenants for B2B collaboration scenarios. At this time, Microsoft will no longer allow the redemption of invitations using unmanaged Azure Active Directory accounts. 

---

### Unrequested but consented permissions will no longer be added to tokens if they would trigger Conditional Access

**Type:** Plan for change  
**Service category:** Authentications (Logins)  
**Product capability:** Platform
 
Currently, applications using [dynamic permissions](../develop/v2-permissions-and-consent.md#requesting-individual-user-consent) are given all of the permissions they're consented to access. This includes applications that are unrequested and even if they trigger conditional access. For example, this can cause an app requesting only `user.read` that also has consent for `files.read`, to be forced to pass the Conditional Access assigned for the `files.read` permission. 

To reduce the number of unnecessary Conditional Access prompts, Azure AD is changing the way that unrequested scopes are provided to applications. Apps will only trigger conditional access for permission they explicitly request. For more information, read [What's new in authentication](../develop/reference-breaking-changes.md#conditional-access-will-only-trigger-for-explicitly-requested-scopes).
 
---
 
### Public Preview - Use a Temporary Access Pass to register Passwordless credentials

**Type:** New feature  
**Service category:** MFA  
**Product capability:** Identity Security & Protection

Temporary Access Pass is a time-limited passcode that serves as strong credentials and allows onboarding of Passwordless credentials and recovery when a user has lost or forgotten their strong authentication factor (for example, FIDO2 security key or Microsoft Authenticator) app and needs to sign in to register new strong authentication methods. [Learn more](../authentication/howto-authentication-temporary-access-pass.md).

---

### Public preview - Keep me signed in (KMSI) in next generation of user flows

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C

The next generation of B2C user flows now supports the [keep me signed in (KMSI)](../../active-directory-b2c/session-behavior.md?pivots=b2c-custom-policy#enable-keep-me-signed-in-kmsi) functionality that allows customers to extend the session lifetime for the users of their web and native applications by using a persistent cookie.  feature keeps the session active even when the user closes and reopens the browser, and is revoked when the user signs out.

---

### Public preview - External Identities Self-Service Sign-up in AAD using MSA accounts

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
External users will can now use Microsoft Accounts to sign in to Azure AD first party and LOB apps. [Learn more](../external-identities/self-service-sign-up-overview.md).

---

### Public Preview - Reset redemption status for a guest user

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Customers can now reinvite existing external guest users to reset their redemption status, which allows the guest user account to remain without them losing any access. [Learn more](../external-identities/reset-redemption-status.md).
 
---

### Public Preview - /synchronization (provisioning) APIs now support application permissions

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
Customers can now use application.readwrite.ownedby as an application permission to call the synchronization APIs. Note this is only supported for provisioning from Azure AD out into third-party applications (for example, AWS, Data Bricks, etc.). It is currently not supported for HR-provisioning (Workday / Successfactors) or Cloud Sync (AD to Azure AD). [Learn more](/graph/api/resources/provisioningobjectsummary?view=graph-rest-beta&preserve-view=true).
 
---

### General Availability - Authentication Policy Administrator built-in role

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
Users with this role can configure the authentication methods policy, tenant-wide MFA settings, and password protection policy. This role grants permission to manage Password Protection settings: smart lockout configurations and updating the custom banned passwords list. [Learn more](../roles/permissions-reference.md#authentication-policy-administrator).

---

### General availability - User collections on My Apps are available now!

**Type:** New feature  
**Service category:** My Apps  
**Product capability:** End User Experiences
 
Users can now create their own groupings of apps on the My Apps app launcher. They can also reorder and hide collections shared with them by their administrator. [Learn more](../user-help/my-apps-portal-user-collections.md).

---

### General availability - Autofill in Authenticator

**Type:** New feature  
**Service category:** Microsoft Authenticator App  
**Product capability:** Identity Security & Protection
 
Microsoft Authenticator provides multi-factor authentication (MFA) and account management capabilities, and now also will autofill passwords on sites and apps users visit on their mobile (iOS and Android). 

To use autofill on Authenticator, users need to add their personal Microsoft account to Authenticator and use it to sync their passwords. Work or school accounts cannot be used to sync passwords at this time. [Learn more](../user-help/user-help-auth-app-faq.md#autofill-for-it-admins).

---

### General availability - Invite internal users to B2B collaboration

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Customers can now invite internal guests to use B2B collaboration instead of sending an invitation to an existing internal account. This allows customers to keep that user's object ID, UPN, group memberships, and app assignments. [Learn more](../external-identities/invite-internal-users.md).

---

### General Availability - Domain Name Administrator built-in role

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
Users with this role can manage (read, add, verify, update, and delete) domain names. They can also read directory information about users, groups, and applications, as these objects have domain dependencies. 

For on-premises environments, users with this role can configure domain names for federation so that associated users are always authenticated on-premises. These users can then sign into Azure AD-based services with their on-premises passwords via single sign-on. Federation settings need to be synced via Azure AD Connect, so users also have permissions to manage Azure AD Connect. [Learn more](../roles/permissions-reference.md#domain-name-administrator).
 
---

### New Federated Apps available in Azure AD Application gallery - February 2021

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In February 2021 we have added following 37 new applications in our App gallery with Federation support:

[Loop Messenger Extension](https://loopworks.com/loop-flow-messenger/), [Silverfort Azure AD Adapter](http://www.silverfort.com/), [Interplay Learning](https://skilledtrades.interplaylearning.com/#login), [Nura Space](https://dashboard.nuraspace.com/login), [Yooz EU](https://eu1.getyooz.com/?kc_idp_hint=microsoft), [UXPressia](https://uxpressia.com/users/sign-in), [introDus Pre- and Onboarding Platform](http://app.introdus.dk/login), [Happybot](https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=34353e1e-dfe5-4d2f-bb09-2a5e376270c8&response_type=code&redirect_uri=https://api.happyteams.io/microsoft/integrate&response_mode=query&scope=offline_access%20User.Read%20User.Read.All), [LeaksID](https://app.leaksid.com/), [ShiftWizard](http://www.shiftwizard.com/), [PingFlow SSO](https://app.pingview.io/), [Swiftlane](https://admin.swiftlane.com/login), [Quasydoc SSO](https://www.quasydoc.eu/login), [Fenwick Gold Account](https://businesscentral.dynamics.com/), [SeamlessDesk](https://www.seamlessdesk.com/login), [Learnsoft LMS & TMS](http://www.learnsoft.com/), [P-TH+](https://p-th.jp/), [myViewBoard](https://api.myviewboard.com/auth/microsoft/), [Tartabit IoT Bridge](https://bridge-us.tartabit.com/), [AKASHI](../saas-apps/akashi-tutorial.md), [Rewatch](../saas-apps/rewatch-tutorial.md), [Zuddl](../saas-apps/zuddl-tutorial.md), [Parkalot - Car park management](../saas-apps/parkalot-car-park-management-tutorial.md), [HSB ThoughtSpot](../saas-apps/hsb-thoughtspot-tutorial.md), [IBMid](../saas-apps/ibmid-tutorial.md), [SharingCloud](../saas-apps/sharingcloud-tutorial.md), [PoolParty Semantic Suite](../saas-apps/poolparty-semantic-suite-tutorial.md), [GlobeSmart](../saas-apps/globesmart-tutorial.md), [Samsung Knox and Business Services](../saas-apps/samsung-knox-and-business-services-tutorial.md), [Penji](../saas-apps/penji-tutorial.md), [Kendis- Scaling Agile Platform](../saas-apps/kendis-scaling-agile-platform-tutorial.md), [Maptician](../saas-apps/maptician-tutorial.md), [Olfeo SAAS](../saas-apps/olfeo-saas-tutorial.md), [Sigma Computing](../saas-apps/sigma-computing-tutorial.md), [CloudKnox Permissions Management Platform](../saas-apps/cloudknox-permissions-management-platform-tutorial.md), [Klaxoon SAML](../saas-apps/klaxoon-saml-tutorial.md), [Enablon](../saas-apps/enablon-tutorial.md)

You can also find the documentation of all the applications here: https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here: https://aka.ms/AzureADAppRequest

--- 

### New provisioning connectors in the Azure AD Application Gallery - February 2021

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Atea](../saas-apps/atea-provisioning-tutorial.md)
- [Getabstract](../saas-apps/getabstract-provisioning-tutorial.md)
- [HelloID](../saas-apps/helloid-provisioning-tutorial.md)
- [Hoxhunt](../saas-apps/hoxhunt-provisioning-tutorial.md)
- [Iris Intranet](../saas-apps/iris-intranet-provisioning-tutorial.md)
- [Preciate](../saas-apps/preciate-provisioning-tutorial.md)

For more information, read [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### General Availability - 10 Azure Active Directory roles now renamed

**Type:** Changed feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
10 Azure AD built-in roles have been renamed so that they're aligned across the [Microsoft 365 admin center](/microsoft-365/admin/microsoft-365-admin-center-preview), [Azure AD portal](https://portal.azure.com/), and [Microsoft Graph](https://developer.microsoft.com/graph/). To learn more about the new roles, refer to [Administrator role permissions in Azure Active Directory](../roles/permissions-reference.md#all-roles).

![Table showing role names in MS Graph API and the Azure portal, and the proposed final name across API, Azure portal, and Mac.](media/whats-new/roles-table-rbac.png)

---

### New Company Branding in MFA/SSPR Combined Registration

**Type:** Changed feature  
**Service category:** User Experience and Management  
**Product capability:** End User Experiences
 
In the past, company logos weren't used on Azure Active Directory sign-in pages. Company branding is now located to the top left of MFA/SSPR Combined Registration. Company branding is also included on My Sign-Ins and the Security Info page. [Learn more](../fundamentals/customize-branding.md).

---

### General Availability - Second level manager can be set as alternate approver

**Type:** Changed feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
An extra option when you select approvers is now available in Entitlement Management. If you select "Manager as approver" for the First Approver, you will have another option, "Second level manager as alternate approver", available to choose in the alternate approver field. If you select this option, you need to add a fallback approver to forward the request to in case the system can't find the second level manager. [Learn more](../governance/entitlement-management-access-package-approval-policy.md#alternate-approvers).
 
---

### Authentication Methods Activity Dashboard

**Type:** Changed feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 

The refreshed Authentication Methods Activity dashboard gives admins an overview of authentication method registration and usage activity in their tenant. The report summarizes the number of users registered for each method, and also which methods are used during sign-in and password reset. [Learn more](../authentication/howto-authentication-methods-activity.md).
 
---

### Refresh and session token lifetimes configurability in Configurable Token Lifetime (CTL) are retired

**Type:** Deprecated  
**Service category:** Other  
**Product capability:** User Authentication
 
Refresh and session token lifetimes configurability in CTL are retired. Azure Active Directory no longer honors refresh and session token configuration in existing policies. [Learn more](../develop/active-directory-configurable-token-lifetimes.md#token-lifetime-policies-for-refresh-tokens-and-session-tokens).
 
---
 
## January 2021

### Secret token will be a mandatory field when configuring provisioning

**Type:** Plan for change  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management

In the past, the secret token field could be kept empty when setting up provisioning on the custom / BYOA application. This function was intended to solely be used for testing. We'll update the UI to make the field required. 

Customers can work around this requirement for testing purposes by using a feature flag in the browser URL. [Learn more](../app-provisioning/use-scim-to-provision-users-and-groups.md#authorization-to-provisioning-connectors-in-the-application-gallery).
 
---

### Public Preview - Customize and configure Android shared devices for frontline workers at scale

**Type:** New feature  
**Service category:** Device Registration and Management  
**Product capability:** Identity Security & Protection
 
Azure AD and Microsoft Endpoint Manager teams have combined to bring the capability to customize, scale, and secure your frontline worker devices.

The following preview capabilities will allow you to:
- Provision Android shared devices at scale with Microsoft Endpoint Manager
- Secure your access for shift workers using device-based conditional access
- Customize sign-in experiences for the shift workers with Managed Home Screen

To learn more, refer to [Customize and configure shared devices for frontline workers at scale](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/customize-and-configure-shared-devices-for-firstline-workers-at/ba-p/1751708).

---

### Public preview - Provisioning logs can now be downloaded as a CSV or JSON

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management

Customers can download the provisioning logs as a CSV or JSON file through the UI and via graph API. To learn more, refer to [Provisioning reports in the Azure Active Directory portal](../reports-monitoring/concept-provisioning-logs.md).

---

### Public preview - Assign cloud groups to Azure AD custom roles and admin unit scoped roles

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
Customers can assign a cloud group to Azure AD custom roles or an admin unit scoped role. To learn how to use this feature, refer to [Use cloud groups to manage role assignments in Azure Active Directory](../roles/groups-concept.md).

---

### General Availability - Azure AD Connect cloud sync (previously known as cloud provisioning)

**Type:** New feature  
**Service category:** Azure AD Connect cloud sync  
**Product capability:** Identity Lifecycle Management
 
Azure AD Connect cloud sync is now generally available to all customers.

Azure AD Connect cloud moves the heavy lifting of transform logic to the cloud, reducing your on-premises footprint. Additionally, multiple light-weight agent deployments are available for higher sync availability. [Learn more](https://aka.ms/cloudsyncGA).
 
---
### General Availability - Attack Simulation Administrator and Attack Payload Author built-in roles

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
Two new roles in Role-Based Access Control are available to assign to users, Attack simulation Administrator and Attack Payload author. 

Users in the [Attack Simulation Administrator](../roles/permissions-reference.md#attack-simulation-administrator) role have access for all simulations in the tenant and can:
- create and manage all aspects of attack simulation creation
- launch/scheduling of a simulation
-  review simulation results. 

Users in the [Attack Payload Author](../roles/permissions-reference.md#attack-payload-author) role can create attack payloads but not actually launch or schedule them. Attack payloads are then available to all administrators in the tenant who can use them to create a simulation.

---

### General Availability - Usage Summary Reports Reader built-in role

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
Users with the Usage Summary Reports Reader role can access tenant level aggregated data and associated insights in Microsoft 365 Admin Center for Usage and Productivity Score. However, they can't access any user level details or insights. 

In the Microsoft 365 Admin Center for the two reports, we differentiate between tenant level aggregated data and user level details. This role adds an extra layer of protection to individual user identifiable data. [Learn more](../roles/permissions-reference.md#usage-summary-reports-reader).

---

### General availability - Require App protection policy grant in Azure AD Conditional Access

**Type:** New Feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection
 
Azure AD Conditional Access grant for "Require App Protection policy" is now GA. 

The policy provides the following capabilities:
- Allows access only when using a mobile application that supports Intune App protection
- Allows access only when a user has an Intune app protection policy delivered to the mobile application

Learn more on how to set up a conditional access policy for app protection [here](../conditional-access/app-protection-based-conditional-access.md).
 
---

### General availability - Email One-Time Passcode

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Email OTP enables organizations around the world to collaborate with anyone by sending a link or invitation via email. Invited users can verify their identity with the one-time passcode sent to their email to access their partner's resources. [Learn more](../external-identities/one-time-passcode.md). 
 
---

 ### New provisioning connectors in the Azure AD Application Gallery - January 2021

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:
- [Fortes Change Cloud](../saas-apps/fortes-change-cloud-provisioning-tutorial.md)
- [Gtmhub](../saas-apps/gtmhub-provisioning-tutorial.md)
- [monday.com](../saas-apps/mondaycom-provisioning-tutorial.md)
- [Splashtop](../saas-apps/splashtop-provisioning-tutorial.md)
- [Templafy OpenID Connect](../saas-apps/templafy-openid-connect-provisioning-tutorial.md)
- [WEDO](../saas-apps/wedo-provisioning-tutorial.md)

For more information, see [What is automated SaaS app user provisioning in Azure AD?](../app-provisioning/user-provisioning.md)

---

### New Federated Apps available in Azure AD Application gallery - January 2021

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In January 2021 we have added following 29 new applications in our App gallery with Federation support:

[mySCView](https://dev.myscview.com/), [Talentech](https://talentech.com/contact/), [Bipsync](https://www.bipsync.com/), [OroTimesheet](https://app.orotimesheet.com/login.php), [Mio](https://app.m.io/auth/install/microsoft?scopetype=hub), [Sovelto Easy](https://login.soveltoeasy.fi/), [Supportbench](https://account.supportbench.net/agent/login/),[Bienvenue Formation](https://formation.bienvenue.pro/login), [AIDA Healthcare SSO](https://aidaforparents.com/login/organizations), [International SOS Assistance Products](../saas-apps/international-sos-assistance-products-tutorial.md), [NAVEX One](../saas-apps/navex-one-tutorial.md), [LabLog](../saas-apps/lablog-tutorial.md), [Oktopost SAML](../saas-apps/oktopost-saml-tutorial.md), [EPHOTO DAM](../saas-apps/ephoto-dam-tutorial.md), [Notion](../saas-apps/notion-tutorial.md), [Syndio](../saas-apps/syndio-tutorial.md), [Yello Enterprise](../saas-apps/yello-enterprise-tutorial.md), [Timeclock 365 SAML](../saas-apps/timeclock-365-saml-tutorial.md), [Nalco E-data](https://www.ecolab.com/), [Vacancy Filler](https://app.vacancy-filler.co.uk/VFMVC/Account/Login), [Synerise AI Growth Ecosystem](../saas-apps/synerise-ai-growth-ecosystem-tutorial.md), [Imperva Data Security](../saas-apps/imperva-data-security-tutorial.md), [Illusive Networks](../saas-apps/illusive-networks-tutorial.md), [Proware](../saas-apps/proware-tutorial.md), [Splan Visitor](../saas-apps/splan-visitor-tutorial.md), [Aruba User Experience Insight](../saas-apps/aruba-user-experience-insight-tutorial.md), [Contentsquare SSO](../saas-apps/contentsquare-sso-tutorial.md), [Perimeter 81](../saas-apps/perimeter-81-tutorial.md), [Burp Suite Enterprise Edition](../saas-apps/burp-suite-enterprise-edition-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest 

---

### Public preview - Second level manager can be set as alternate approver

**Type:** Changed feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
An extra option when you select approvers is now available in Entitlement Management. If you select "Manager as approver" for the First Approver, you will have another option, "Second level manager as alternate approver", available to choose in the alternate approver field. If you select this option, you need to add a fallback approver to forward the request to in case the system can't find the second level manager. [Learn more](../governance/entitlement-management-access-package-approval-policy.md#alternate-approvers)
 
---

### General availability - Navigate to Teams directly from My Access portal

**Type:** Changed feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
You can now launch Teams directly from the My Access portal. 

To do so, sign-in to My Access (https://myaccess.microsoft.com/), navigate to "Access packages", then go to the "Active" tab to see all of the access packages you already have access to. When you expand the selected access package and hover on Teams, you can launch it by clicking on the "Open" button. [Learn more](../governance/entitlement-management-request-access.md).
 
---

### Improved Logging & End-User Prompts for Risky Guest Users

**Type:** Changed feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 

The Logging and End-User Prompts for Risky Guest Users have been updated. Learn more in [Identity Protection and B2B users](../identity-protection/concept-identity-protection-b2b.md).
 
---
 
## December 2020

### Public preview - Azure AD B2C Phone Sign-up and Sign-in using Built-in Policy

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
B2C Phone Sign-up and Sign-in using Built-in Policy enable IT administrators and developers of organizations to allow their end-users to sign in and sign up using a phone number in user flows. Read [Set up phone sign-up and sign-in for user flows (preview)](../../active-directory-b2c/phone-authentication-user-flows.md) to learn more.

---

### General Availability - Security Defaults now enabled for all new tenants by default

**Type:** New feature  
**Service category:** Other  
**Product capability:** Identity Security & Protection
 
To protect user accounts, all new tenants created on or after November 12, 2020, will come with Security Defaults enabled. Security Defaults enforces multiple policies including:
- Requires all users and admins to register for MFA using the Microsoft Authenticator App
- Requires critical admin roles to use MFA every single time they sign-in. All other users will be prompted for MFA whenever necessary. 
- Legacy authentication will be blocked tenant wide. 

For more information, read [What are security defaults?](../fundamentals/concept-fundamentals-security-defaults.md)

---

### General availability - Support for groups with up to 250K members in AADConnect

**Type:** Changed feature  
**Service category:** AD Connect  
**Product capability:** Identity Lifecycle Management
 
Microsoft has deployed a new endpoint (API) for Azure AD Connect that improves the performance of the synchronization service operations to Azure Active Directory. When you use the new [V2 endpoint](../hybrid/how-to-connect-sync-endpoint-api-v2.md), you'll experience noticeable performance gains on export and import to Azure AD. This new endpoint supports the following scenarios:

- Syncing groups with up to 250k members
- Performance gains on export and import to Azure AD

---

### General availability - Entitlement Management available for tenants in Azure China cloud

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 

The capabilities of Entitlement Management are now available for all tenants in the Azure China cloud. For information, visit our [Identity governance documentation](https://docs.azure.cn/zh-cn/active-directory/governance/) site.

---

### New provisioning connectors in the Azure AD Application Gallery - December 2020

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Bizagi Studio for Digital Process Automation](../saas-apps/bizagi-studio-for-digital-process-automation-provisioning-tutorial.md)
- [CybSafe](../saas-apps/cybsafe-provisioning-tutorial.md)
- [GroupTalk](../saas-apps/grouptalk-provisioning-tutorial.md)
- [PaperCut Cloud Print Management](../saas-apps/papercut-cloud-print-management-provisioning-tutorial.md)
- [Parsable](../saas-apps/parsable-provisioning-tutorial.md)
- [Shopify Plus](../saas-apps/shopify-plus-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 
---

### New Federated Apps available in Azure AD Application gallery - December 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In December 2020 we have added following 18 new applications in our App gallery with Federation support:

[AwareGo](../saas-apps/awarego-tutorial.md), [HowNow SSO](https://gethownow.com/), [ZyLAB ONE Legal Hold](https://www.zylab.com/en/product/legal-hold), [Guider](http://www.guider-ai.com/), [Softcrisis](https://www.softcrisis.se/sv/), [Pims 365](http://www.omega365.com/pims), [InformaCast](../saas-apps/informacast-tutorial.md), [RetrieverMediaDatabase](../saas-apps/retrievermediadatabase-tutorial.md), [vonage](../saas-apps/vonage-tutorial.md), [Count Me In - Operations Dashboard](../saas-apps/count-me-in-operations-dashboard-tutorial.md), [ProProfs Knowledge Base](../saas-apps/proprofs-knowledge-base-tutorial.md), [RightCrowd Workforce Management](../saas-apps/rightcrowd-workforce-management-tutorial.md), [JLL TRIRIGA](../saas-apps/jll-tririga-tutorial.md), [Shutterstock](../saas-apps/shutterstock-tutorial.md), [FortiWeb Web Application Firewall](../saas-apps/linkedin-talent-solutions-tutorial.md), [LinkedIn Talent Solutions](../saas-apps/linkedin-talent-solutions-tutorial.md), [Equinix Federation App](../saas-apps/equinix-federation-app-tutorial.md), [KFAdvance](../saas-apps/kfadvance-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest

---

### Navigate to Teams directly from My Access portal

**Type:** Changed feature  
**Service category:** User Access Management 
**Product capability:** Entitlement Management

You can now launch Teams directly from My Access portal. To do so, sign-in to [My Access](https://myaccess.microsoft.com/), navigate to **Access packages**, then go to the **Active** Tab to see all access packages you already have access to. When you expand the access package and hover on Teams, you can launch it by clicking on the **Open** button. 

To learn more about using the My Access portal, go to [Request access to an access package in Azure AD entitlement management](../governance/entitlement-management-request-access.md#sign-in-to-the-my-access-portal).

---

### Public preview - Second level manager can be set as alternate approver

**Type:** Changed feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management

An extra option is now available in the approval process in Entitlement Management. If you select Manager as approver for the First Approver, you'll have another option, Second level manager as alternate approver, available to choose in the alternate approver field. When you select this option, you need to add a fallback approver to forward the request to in case the system can't find the second level manager.

For more information, go to [Change approval settings for an access package in Azure AD entitlement management](../governance/entitlement-management-access-package-approval-policy.md#alternate-approvers).

--- 

## November 2020

### Azure Active Directory TLS 1.0, TLS 1.1, and 3DES deprecation

**Type:** Plan for change  
**Service category:** All Azure AD applications  
**Product capability:** Standards

Azure Active Directory will deprecate the following protocols in Azure Active Directory worldwide regions starting June 30, 2021:

- TLS 1.0
- TLS 1.1
- 3DES cipher suite (TLS_RSA_WITH_3DES_EDE_CBC_SHA)

Affected environments are:
- Azure Commercial Cloud
- Office 365 GCC and WW

Related announcement 
All client-server and browser-server combinations should use TLS 1.2 and modern cipher suites to maintain a secure connection to Azure Active Directory for Azure, Office 365, and Microsoft 365 services. This is change is related to [Azure Active Directory TLS 1.0 & 1.1, and 3DES Cipher Suite Deprecation in US Gov Cloud](whats-new.md#azure-active-directory-tls-10-tls-11-and-3des-deprecation-in-us-gov-cloud).

For guidance to remove deprecating protocols dependencies, please refer to [Enable support for TLS 1.2 in your environment for Azure AD TLS 1.1 and 1.0 deprecation](https://docs.microsoft.com/troubleshoot/azure/active-directory/enable-support-tls-environment).

---

### New Federated Apps available in Azure AD Application gallery - November 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In November 2020 we have added following 52 new applications in our App gallery with Federation support:

[Travel & Expense Management](https://app.expenseonce.com/Account/Login), [Tribeloo](../saas-apps/tribeloo-tutorial.md), [Itslearning File Picker](https://pmteam.itslearning.com/), [Crises Control](../saas-apps/crises-control-tutorial.md), [CourtAlert](https://www.courtalert.com/), [StealthMail](https://stealthmail.com/), [Edmentum - Study Island](https://app.studyisland.com/cfw/login/), [Virtual Risk Manager](../saas-apps/virtual-risk-manager-tutorial.md), [TIMU](../saas-apps/timu-tutorial.md), [Looker Analytics Platform](../saas-apps/looker-analytics-platform-tutorial.md), [Talview - Recruit](https://recruit.talview.com/login), Real Time Translator, [Klaxoon](https://access.klaxoon.com/login), [Podbean](../saas-apps/podbean-tutorial.md), [zcal](https://zcal.co/signup), [expensemanager](https://api.expense-manager.com/), [Netsparker Enterprise](../saas-apps/netsparker-enterprise-tutorial.md), [En-trak Tenant Experience Platform](https://portal.en-trak.app/), [Appian](../saas-apps/appian-tutorial.md), [Panorays](../saas-apps/panorays-tutorial.md), [Builterra](https://portal.builterra.com/), [EVA Check-in](https://my.evacheckin.com/organization), [HowNow WebApp SSO](../saas-apps/hownow-webapp-sso-tutorial.md), [Coupa Risk Assess](../saas-apps/coupa-risk-assess-tutorial.md), [Lucid (All Products)](../saas-apps/lucid-tutorial.md), [GoBright](https://portal.brightbooking.eu/), [SailPoint IdentityNow](../saas-apps/sailpoint-identitynow-tutorial.md),[Resource Central](../saas-apps/resource-central-tutorial.md), [UiPathStudioO365App](https://www.uipath.com/product/platform), [Jedox](../saas-apps/jedox-tutorial.md), [Cequence Application Security](../saas-apps/cequence-application-security-tutorial.md), [PerimeterX](../saas-apps/perimeterx-tutorial.md), [TrendMiner](../saas-apps/trendminer-tutorial.md), [Lexion](../saas-apps/lexion-tutorial.md), [WorkWare](../saas-apps/workware-tutorial.md), [ProdPad](../saas-apps/prodpad-tutorial.md), [AWS ClientVPN](../saas-apps/aws-clientvpn-tutorial.md), [AppSec Flow SSO](../saas-apps/appsec-flow-sso-tutorial.md), [Luum](../saas-apps/luum-tutorial.md), [Freight Measure](https://www.gpcsl.com/freight.html), [Terraform Cloud](../saas-apps/terraform-cloud-tutorial.md), [Nature Research](../saas-apps/nature-research-tutorial.md), [Play Digital Signage](https://login.playsignage.com/login), [RemotePC](../saas-apps/remotepc-tutorial.md), [Prolorus](../saas-apps/prolorus-tutorial.md), [Hirebridge ATS](../saas-apps/hirebridge-ats-tutorial.md), [Teamgage](https://www.teamgage.com/Account/ExternalLoginAzure), [Roadmunk](../saas-apps/roadmunk-tutorial.md), [Sunrise Software Relations CRM](https://cloud.relations-crm.com/), [Procaire](../saas-apps/procaire-tutorial.md), [Mentor® by eDriving: Business](https://www.edriving.com/), [Gradle Enterprise](https://gradle.com/)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest

---

### Public preview - Custom roles for enterprise apps

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
 [Custom RBAC roles for delegated enterprise application management](../roles/custom-available-permissions.md) is now in public preview. These new permissions build on the custom roles for app registration management, which allows fine-grained control over what access your admins have. Over time, additional permissions to delegate management of Azure AD will be released.

Some common delegation scenarios:
- assignment of user and groups that can access SAML based single sign-on applications
- the creation of Azure AD Gallery applications
- update and read of basic SAML Configurations for SAML based single sign-on applications
- management of signing certificates for SAML based single sign-on applications
- update of expiring sign in certificates notification email addresses for SAML based single sign-on applications
- update of the SAML token signature and sign-in algorithm for SAML based single sign-on applications
- create, delete, and update of user attributes and claims for SAML-based single sign-on applications
- ability to turn on, off, and restart provisioning jobs
- updates to attribute mapping
- ability to read provisioning settings associated with the object
- ability to read provisioning settings associated with your service principal
- ability to authorize application access for provisioning

---

### Public preview - Azure AD Application Proxy natively supports single sign-on access to applications that use headers for authentication

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** Access Control
 
Azure Active Directory (Azure AD) Application Proxy natively supports single sign-on access to applications that use headers for authentication. You can configure header values required by your application in Azure AD. The header values will be sent down to the application via Application Proxy. To learn more, see [Header-based single sign-on for on-premises apps with Azure AD App Proxy](../manage-apps/application-proxy-configure-single-sign-on-with-headers.md)
 
---

### General Availability - Azure AD B2C Phone Sign-up and Sign-in using Custom Policy

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C

With phone number sign-up and sign-in, developers and enterprises can allow their customers to sign up and sign in using a one-time password sent to the user's phone number via SMS. This feature also lets the customer change their phone number if they lose access to their phone. With the power of custom policies, allow developers and enterprises to communicate their brand through page customization. Find out how to [set up phone sign-up and sign-in with custom policies in Azure AD B2C](../../active-directory-b2c/phone-authentication-user-flows.md).
 
---

### New provisioning connectors in the Azure AD Application Gallery - November 2020

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Adobe Identity Management](../saas-apps/adobe-identity-management-provisioning-tutorial.md)
- [Blogin](../saas-apps/blogin-provisioning-tutorial.md)
- [Clarizen One](../saas-apps/clarizen-one-provisioning-tutorial.md)
- [Contentful](../saas-apps/contentful-provisioning-tutorial.md)
- [GitHub AE](../saas-apps/github-ae-provisioning-tutorial.md)
- [Playvox](../saas-apps/playvox-provisioning-tutorial.md)
- [PrinterLogic SaaS](../saas-apps/printer-logic-saas-provisioning-tutorial.md)
- [Tic - Tac Mobile](../saas-apps/tic-tac-mobile-provisioning-tutorial.md)
- [Visibly](../saas-apps/visibly-provisioning-tutorial.md)

For more information, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 
---

### Public Preview - Email Sign-In with ProxyAddresses now deployable via Staged Rollout

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
Tenant administrators can now use Staged Rollout to deploy Email Sign-In with ProxyAddresses to specific Azure AD groups. This can help while trying out the feature before deploying it to the entire tenant via the Home Realm Discovery policy. Instructions for deploying Email Sign-In with ProxyAddresses via Staged Rollout are in the [documentation](../authentication/howto-authentication-use-email-signin.md).
 
---

### Limited Preview - Sign-in Diagnostic

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
With the initial preview release of the Sign-in Diagnostic, admins can now review user sign-ins. Admins can receive contextual, specific, and relevant details and guidance on what happened during a sign-in and how to fix problems. The diagnostic is available in both the Azure AD level, and Conditional Access Diagnose and Solve blades. The diagnostic scenarios covered in this release are Conditional Access, Multi-Factor Authentication, and successful sign-in.

For more information, see [What is sign-in diagnostic in Azure AD?](../reports-monitoring/overview-sign-in-diagnostics.md).
 
---

### Improved Unfamiliar Sign-in Properties

**Type:** Changed feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection

  Unfamiliar sign-in properties detections has been updated. Customers may notice more high-risk unfamiliar sign-in properties detections. For more information, see [What is risk?](../identity-protection/concept-identity-protection-risks.md)
 
---

### Public Preview refresh of Cloud Provisioning agent now available (Version: 1.1.281.0)

**Type:** Changed feature  
**Service category:** Azure AD Cloud Provisioning  
**Product capability:** Identity Lifecycle Management
 
Cloud provisioning agent has been released in public preview and is now available through the portal. This release contains several improvements including, support for GMSA for your domains, which provides better security, improved initial sync cycles, and support for large groups. Check out the release version [history](../app-provisioning/provisioning-agent-release-version-history.md) for more details. 
 
---

### BitLocker recovery key API endpoint now under /informationProtection

**Type:** Changed feature  
**Service category:** Device Access Management  
**Product capability:** Device Lifecycle Management
 
Previously, you could recover BitLocker keys via the /bitlocker endpoint. We'll eventually be deprecating this endpoint, and customers should begin consuming the API that now falls under /informationProtection. 

See [BitLocker recovery API](/graph/api/resources/bitlockerrecoverykey?view=graph-rest-beta&preserve-view=true) for updates to the documentation to reflect these changes.

---

### General Availability of Application Proxy support for Remote Desktop Services HTML5 Web Client

**Type:** Changed feature  
**Service category:** App Proxy  
**Product capability:** Access Control
 
Azure AD Application Proxy support for Remote Desktop Services (RDS) Web Client is now in General Availability. The RDS web client allows users to access Remote Desktop infrastructure through any HTLM5-capable browser such as Microsoft Edge, Internet Explorer 11, Google Chrome, and so on. Users can interact with remote apps or desktops like they would with a local device from anywhere. 

By using Azure AD Application Proxy, you can increase the security of your RDS deployment by enforcing pre-authentication and Conditional Access policies for all types of rich client apps. To learn more, see [Publish Remote Desktop with Azure AD Application Proxy](../manage-apps/application-proxy-integrate-with-remote-desktop-services.md)
 
---

### New enhanced Dynamic Group service is in Public Preview

**Type:** Changed feature  
**Service category:** Group Management  
**Product capability:** Collaboration
 
Enhanced dynamic group service is now in Public Preview. New customers that create dynamic groups in their tenants will be using the new service. The time required to create a dynamic group will be proportional to the size of the group that is being created instead of the size of the tenant. This update will improve performance for large tenants significantly when customers create smaller groups. 

The new service also aims to complete member addition and removal because of attribute changes within a few minutes. Also, single processing failures won't block tenant processing. To learn more about creating dynamic groups, see our [documentation](../enterprise-users/groups-create-rule.md).
 
---
## October 2020

### Azure AD On-Premises Hybrid Agents Impacted by Azure TLS Certificate Changes

**Type:** Plan for change  
**Service category:** N/A  
**Product capability:** Platform

Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). This update is due to the current CA certificates not complying with one of the CA/Browser Forum Baseline requirements. This change will impact Azure AD hybrid agents installed on-premises that have hardened environments with a fixed list of root certificates and will need to be updated to trust the new certificate issuers.

This change will result in disruption of service if you don't take action immediately. These agents include [Application Proxy connectors](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AppProxy) for remote access to on-premises, [Passthrough Authentication](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AzureADConnect) agents that allow your users to sign in to applications using the same passwords, and [Cloud Provisioning Preview](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AzureADConnect) agents that perform AD to Azure AD sync. 

If you have an environment with firewall rules set to allow outbound calls to only specific Certificate Revocation List (CRL) download, you will need to allow the following CRL and OCSP URLs. For full details on the change and the CRL and OCSP URLs to enable access to, see  [Azure TLS certificate changes](../../security/fundamentals/tls-certificate-changes.md).

---

### Provisioning events will be removed from audit logs and published solely to provisioning logs

**Type:** Plan for change  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
Activity by the SCIM [provisioning service](../app-provisioning/user-provisioning.md) is logged in both the audit logs and provisioning logs. This includes activity such as the creation of a user in ServiceNow, group in GSuite, or import of a role from AWS. In the future, these events will only be published in the provisioning logs. This change is being implemented to avoid duplicate events across logs, and additional costs incurred by customers consuming the logs in log analytics. 

We'll provide an update when a date is completed. This deprecation isn't planned for the calendar year 2020. 

> [!NOTE]
> This does not impact any events in the audit logs outside of the synchronization events emitted by the provisioning service. Events such as the creation of an application, conditional access policy, a user in the directory, etc. will continue to be emitted in the audit logs. [Learn more](../reports-monitoring/concept-provisioning-logs.md?context=azure%2factive-directory%2fapp-provisioning%2fcontext%2fapp-provisioning-context).
 

---

### Azure AD On-Premises Hybrid Agents Impacted by Azure Transport Layer Security (TLS) Certificate Changes

**Type:** Plan for change  
**Service category:** N/A  
**Product capability:** Platform
 
Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). There will be an update because of the current CA certificates not following one of the CA/Browser Forum Baseline requirements. This change will impact Azure AD hybrid agents installed on-premises that have hardened environments with a fixed list of root certificates. These agents will need to be updated to trust the new certificate issuers.

This change will result in disruption of service if you don't take action immediately. These agents include: 
- [Application Proxy connectors](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AppProxy) for remote access to on-premises 
- [Passthrough Authentication](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AzureADConnect) agents that allow your users to sign in to applications using the same passwords
- [Cloud Provisioning Preview](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AzureADConnect) agents that do AD to Azure AD sync. 

If you have an environment with firewall rules set to allow outbound calls to only specific Certificate Revocation List (CRL) download, you'll need to allow CRL and OCSP URLs. For full details on the change and the CRL and OCSP URLs to enable access to, see  [Azure TLS certificate changes](../../security/fundamentals/tls-certificate-changes.md).
 
---

### Azure Active Directory TLS 1.0, TLS 1.1, and 3DES Deprecation in US Gov Cloud

**Type:** Plan for change  
**Service category:** All Azure AD applications  
**Product capability:** Standards
 
Azure Active Directory will deprecate the following protocols starting March 31, 2021:
- TLS 1.0
- TLS 1.1
- 3DES cipher suite (TLS_RSA_WITH_3DES_EDE_CBC_SHA)

All client-server and browser-server combinations should use TLS 1.2 and modern cipher suites to maintain a secure connection to Azure Active Directory for Azure, Office 365, and Microsoft 365 services.

Affected environments are:
- Azure US Gov
- [Office 365 GCC High & DoD](/microsoft-365/compliance/tls-1-2-in-office-365-gcc)

For guidance to remove deprecating protocols dependencies, please refer to [Enable support for TLS 1.2 in your environment for Azure AD TLS 1.1 and 1.0 deprecation](https://docs.microsoft.com/troubleshoot/azure/active-directory/enable-support-tls-environment).
 
---

### Assign applications to roles on administrative unit and object scope

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
This feature enables the ability to assign an application (SPN) to an administrator role on the administrative unit scope. To learn more, refer to [Assign scoped roles to an administrative unit](../roles/admin-units-assign-roles.md).

---

### Now you can disable and delete guest users when they're denied access to a resource

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
Disable and delete is an advanced control in Azure AD Access Reviews to help organizations better manage external guests in Groups and Apps. If guests are denied in an access review, **disable and delete** will automatically block them from signing in for 30 days. After 30 days, then they'll be removed from the tenant altogether.

For more information about this feature, see [Disable and delete external identities with Azure AD Access Reviews](../governance/access-reviews-external-users.md#disable-and-delete-external-identities-with-azure-ad-access-reviews).
 
---

### Access Review creators can add custom messages in emails to reviewers

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
In Azure AD access reviews, administrators creating reviews can now write a custom message to the reviewers. Reviewers will see the message in the email they receive that prompts them to complete the review. To learn more about using this feature, see step 14 of the [Create one or more access reviews](../governance/create-access-review.md#create-one-or-more-access-reviews) section.

---

### New provisioning connectors in the Azure AD Application Gallery - October 2020

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Apple Business Manager](../saas-apps/apple-business-manager-provision-tutorial.md)
- [Apple School Manager](../saas-apps/apple-school-manager-provision-tutorial.md)
- [Code42](../saas-apps/code42-provisioning-tutorial.md)
- [AlertMedia](../saas-apps/alertmedia-provisioning-tutorial.md)
- [OpenText Directory Services](../saas-apps/open-text-directory-services-provisioning-tutorial.md)
- [Cinode](../saas-apps/cinode-provisioning-tutorial.md)
- [Global Relay Identity Sync](../saas-apps/global-relay-identity-sync-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 
---

### Integration assistant for Azure AD B2C

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
The Integration Assistant (preview) experience is now available for Azure AD B2C App registrations. This experience helps guide you in configuring your application for common scenarios.. Learn more about [Microsoft identity platform best practices and recommendations](../develop/identity-platform-integration-checklist.md).
 
---

### View role template ID in Azure portal UI

**Type:** New feature  
**Service category:** Azure roles  
**Product capability:** Access Control
 

You can now view the template ID of each Azure AD role in the Azure portal. In Azure AD, select  **description** of the selected role. 

It's recommended that customers use role template IDs in their PowerShell script and code, instead of the display name. Role template ID is supported for use to [directoryRoles](/graph/api/resources/directoryrole) and [roleDefinition](/graph/api/resources/unifiedroledefinition?view=graph-rest-beta&preserve-view=true) objects. For more information on role template IDs, see [Azure AD built-in roles](../roles/permissions-reference.md).

---

### API connectors for Azure AD B2C sign-up user flows is now in public preview

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 

API connectors are now available for use with Azure Active Directory B2C. API connectors enable you to use web APIs to customize your sign-up user flows and integrate with external cloud systems. You can you can use API connectors to:

- Integrate with custom approval workflows
- Validate user input data
- Overwrite user attributes 
- Run custom business logic 

 Visit the [Use API connectors to customize and extend sign-up](../../active-directory-b2c/api-connectors-overview.md) documentation to learn more.

---

### State property for connected organizations in entitlement management

**Type:** New feature  
**Service category:** Directory Management 
**Product capability:** Entitlement Management
 

 All connected organizations will now have an additional property called "State". The state will control how the connected organization will be used in policies that refer to "all configured connected organizations". The value will be either "configured" (meaning the organization is in the scope of policies that use the "all" clause) or "proposed" (meaning that the organization isn't in scope).  

Manually created connected organizations will have a default setting of "configured". Meanwhile, automatically created ones (created via policies that allow any user from the internet to request access) will default to "proposed."  Any connected organizations created before September 9 2020 will be set to "configured." Admins can update this property as needed. [Learn more](../governance/entitlement-management-organization.md#managing-a-connected-organization-programmatically).
 

---

### Azure Active Directory External Identities now has premium advanced security settings for B2C

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
Risk-based Conditional Access and risk detection features of Identity Protection are now available in [Azure AD B2C](../..//active-directory-b2c/conditional-access-identity-protection-overview.md). With these advanced security features, customers can now:
- Leverage intelligent insights to assess risk with B2C apps and end user accounts. Detections include atypical travel, anonymous IP addresses, malware-linked IP addresses, and Azure AD threat intelligence. Portal and API-based reports are also available.
- Automatically address risks by configuring adaptive authentication policies for B2C users. App developers and administrators can mitigate real-time risk by requiring multi-factor authentication (MFA) or blocking access depending on the user risk level detected, with additional controls available based on location, group, and app.
- Integrate with Azure AD B2C user flows and custom policies. Conditions can be triggered from built-in user flows in Azure AD B2C or can be incorporated into B2C custom policies. As with other aspects of the B2C user flow, end user experience messaging can be customized. Customization is according to the organization’s voice, brand, and mitigation alternatives.
 
---

### New Federated Apps available in Azure AD Application gallery - October 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In October 2020 we have added following 27 new applications in our App gallery with Federation support:

[Sentry](../saas-apps/sentry-tutorial.md), [Bumblebee - Productivity Superapp](https://app.yellowmessenger.com/user/login), [ABBYY FlexiCapture Cloud](../saas-apps/abbyy-flexicapture-cloud-tutorial.md), [EAComposer](../saas-apps/eacomposer-tutorial.md), [Genesys Cloud Integration for Azure](https://apps.mypurecloud.com/msteams-integration/), [Zone Technologies Portal](https://portail.zonetechnologie.com/signin), [Beautiful.ai](../saas-apps/beautiful.ai-tutorial.md), [Datawiza Access Broker](https://console.datawiza.com/), [ZOKRI](https://app.zokri.com/), [CheckProof](../saas-apps/checkproof-tutorial.md), [Ecochallenge.org](https://events.ecochallenge.org/users/login), [atSpoke](http://atspoke.com/login), [Appointment Reminder](https://app.appointmentreminder.co.nz/account/login), [Cloud.Market](https://cloud.market/), [TravelPerk](../saas-apps/travelperk-tutorial.md), [Greetly](https://app.greetly.com/), [OrgVitality SSO](../saas-apps/orgvitality-sso-tutorial.md), [Web Cargo Air](../saas-apps/web-cargo-air-tutorial.md), [Loop Flow CRM](../saas-apps/loop-flow-crm-tutorial.md), [Starmind](../saas-apps/starmind-tutorial.md), [Workstem](https://hrm.workstem.com/login), [Retail Zipline](../saas-apps/retail-zipline-tutorial.md), [Hoxhunt](../saas-apps/hoxhunt-tutorial.md), [MEVISIO](../saas-apps/mevisio-tutorial.md), [Samsara](../saas-apps/samsara-tutorial.md), [Nimbus](../saas-apps/nimbus-tutorial.md), [Pulse Secure virtual Traffic Manager](../saas-apps/pulse-secure-virtual-traffic-manager-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest

---

### Provisioning logs can now be streamed to log analytics

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 

Publish your provisioning logs to log analytics in order to:
- Store provisioning logs for more than 30 days
- Define custom alerts and notifications
- Build dashboards to visualize the logs
- Execute complex queries to analyze the logs 

To learn how to use the feature, see [Understand how provisioning integrates with Azure Monitor logs](../app-provisioning/application-provisioning-log-analytics.md).
 
---

### Provisioning logs can now be viewed by application owners

**Type:** Changed feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
You can now allow application owners to monitor activity by the provisioning service and troubleshoot issues without providing them a privileged role or making IT a bottleneck. [Learn more](../reports-monitoring/concept-provisioning-logs.md).
 
---

### Renaming 10 Azure Active Directory roles

**Type:** Changed feature  
**Service category:** Azure roles  
**Product capability:** Access Control
 
Some Azure Active Directory (AD) built-in roles have names that differ from those that appear in Microsoft 365 admin center, the Azure AD portal, and Microsoft Graph. This inconsistency can cause problems in automated processes. With this update, we're renaming 10 role names to make them consistent. The following table has the new role names:

![Table showing role names in MS Graph API and the Azure portal, and the proposed new role name in M365 Admin Center, Azure portal, and API.](media/whats-new/azure-role.png)

---

### Azure AD B2C support for auth code flow for SPAs using MSAL JS 2.x

**Type:** Changed feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
MSAL.js version 2.x now includes support for the authorization code flow for single-page web apps (SPAs). Azure AD B2C will now support the use of the SPA app type on the Azure portal and the use of MSAL.js  authorization code flow with PKCE for single-page apps. This will allow SPAs using Azure AD B2C to maintain SSO with newer browsers and abide by newer authentication protocol recommendations. Get started with the [Register a single-page application (SPA) in Azure Active Directory B2C](../../active-directory-b2c/tutorial-register-spa.md) tutorial.

---

### Updates to Remember Multi-Factor Authentication (MFA) on a trusted device setting

**Type:** Changed feature  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 

We've recently updated the [remember Multi-Factor Authentication (MFA)](../authentication/howto-mfa-mfasettings.md#remember-multi-factor-authentication) on a trusted device feature to extend authentication for up to 365 days. Azure Active Directory (Azure AD) Premium licenses, can also use the [Conditional Access – Sign-in Frequency policy](../conditional-access/howto-conditional-access-session-lifetime.md#user-sign-in-frequency) that provides more flexibility for reauthentication settings.

For the optimal user experience, we recommend using Conditional Access sign-in frequency to extend session lifetimes on trusted devices, locations, or low-risk sessions as an alternative to the remember MFA on a trusted device setting. To get started, review our [latest guidance on optimizing the reauthentication experience](../authentication/concepts-azure-multi-factor-authentication-prompts-session-lifetime.md).

---
