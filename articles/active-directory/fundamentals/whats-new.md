---
title: What's new? Release notes - Azure Active Directory | Microsoft Docs
description: Learn what is new with Azure Active Directory; such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
author: ajburnle
manager: karenhoran
featureFlags:
 - clicktale
ms.assetid: 06a149f7-4aa1-4fb9-a8ec-ac2633b031fb
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 12/06/2021
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

## November 2021

### Tenant enablement of combined security information registration for Azure Active Directory

**Type:** Plan for change  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 
We previously announced in April 2020, a new combined registration experience enabling users to register authentication methods for SSPR and multi-factor authentication (MFA) at the same time was generally available for existing customer to opt-in. Any Azure AD tenants created after August 2020 automatically have the default experience set to combined registration. Starting 2022, Microsoft will be enabling the MFA/SSPR combined registration experience for existing customers. [Learn more](../authentication/concept-registration-mfa-sspr-combined.md).
 
---

### Windows users will see prompts more often when switching user accounts

**Type:** Fixed  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
A problematic interaction between Windows and a local Active Directory Federation Services (ADFS) instance can result in users attempting to sign into another account, but be silently signed into their existing account instead, with no warning. For federated IdPs such as ADFS, that support the [prompt=login](/windows-server/identity/ad-fs/operations/ad-fs-prompt-login) pattern, Azure AD will now trigger a fresh login at ADFS when a user is directed to ADFS with a login hint. This ensures that the user is signed into the account they requested, rather than being silently signed into the account they're already signed in with. 

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
 
The Public Preview feature for Azure AD Connect Cloud Sync Password writeback provides customers the capability to writeback a user’s password changes in the cloud to the on-premises directory in real time using the lightweight Azure AD cloud provisioning agent.[Learn more](../authentication/tutorial-enable-cloud-sync-sspr-writeback.md).

---

### Public preview - Conditional Access for workload identities

**Type:** New feature  
**Service category:** Conditional Access for workload identities  
**Product capability:** Identity Security & Protection
 
Previously, Conditional Access policies applied only to users when they access apps and services like SharePoint online or the Azure portal. This preview adds support for Conditional Access policies applied to service principals owned by the organization. You can block service principals from accessing resources from outside trusted named locations or Azure Virtual Networks. [Learn more](../conditional-access/workload-identity.md).

---

### Public preview - Additional attributes available as claims

**Type:** Changed feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 
Several user attributes have been added to the list of attributes available to map to claims to bring attributes available in claims more in line with what is available on the user object in Microsoft Graph. New attributes include mobilePhone and ProxyAddresses. [Learn more](../develop/reference-claims-mapping-policy-type.md#table-3-valid-id-values-per-source).
 
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
 
Entitlement Management’s enriched review experience allows even more flexibility on access packages reviews. Admins can now choose what happens to access if the reviewers don't respond, provide helper information to reviewers, or decide whether a justification is necessary. [Learn more](../governance/entitlement-management-access-reviews-create.md).
 
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

### General availability - Azure AD single Sign on and device-based Conditional Access support in Firefox on Windows 10/11

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
 
In November 2021, we have added following 32 new applications in our App gallery with Federation support

[Tide - Connector](https://gallery.ctinsuretech-tide.com/), [Virtual Risk Manager - USA](../saas-apps/virtual-risk-manager-usa-tutorial.md), [Xorlia Policy Management](https://app.xoralia.com/), [WorkPatterns](https://app.workpatterns.com/oauth2/login?data_source_type=office_365_account_calendar_workspace_sync&utm_source=azure_sso), [GHAE](../saas-apps/ghae-tutorial.md), [Nodetrax Project](../saas-apps/nodetrax-project-tutorial.md), [Touchstone Benchmarking](https://app.touchstonebenchmarking.com/), [SURFsecureID - Azure MFA](../saas-apps/surfsecureid-azure-mfa-tutorial.md), [AiDEA](https://truebluecorp.com/en/prodotti/aidea-en/),[R and D Tax Credit Services: 10-wk Implementation](../saas-apps/r-and-d-tax-credit-services-tutorial.md), [Mapiq Essentials](../saas-apps/mapiq-essentials-tutorial.md), [Celtra Authentication Service](https://auth.celtra.com/login), [Compete HR](https://app.competewith.com/auth/login), [Snackmagic](../saas-apps/snackmagic-tutorial.md), [FileOrbis](../saas-apps/fileorbis-tutorial.md), [ClarivateWOS](../saas-apps/clarivatewos-tutorial.md), [RewardCo Engagement Cloud](https://cloud.live.rewardco.com/oauth/login), [ZoneVu](https://zonevu.ubiterra.com/onboarding/index), [V-Client](../saas-apps/v-client-tutorial.md), [Netpresenter Next](https://www.netpresenter.com/), [UserTesting](../saas-apps/usertesting-tutorial.md), [InfinityQS ProFicient on Demand](../saas-apps/infinityqs-proficient-on-demand-tutorial.md), [Feedonomics](https://auth.feedonomics.com/), [Customer Voice](https://cx.pobuca.com/), [Zanders Inside](https://home.zandersinside.com/), [Connecter](https://teamwork.connecterapp.com/azure_login), [Paychex Flex](https://login.flex.paychex.com/azfed-app/v1/azure/federation/admin), [InsightSquared](https://us2.insightsquared.com/#/boards/office365.com/settings/userconnection), [Kiteline Health](https://my.kitelinehealth.com/), [Fabrikam Enterprise Managed User (OIDC)](https://github.com/login), [PROXESS for Office365](https://www.proxess.de/office365), [Coverity Static Application Security Testing](../saas-apps/coverity-static-application-security-testing-tutorial.md)

You can also find the documentation of all the applications [here](../saas-apps/tutorial-list.md).

For listing your application in the Azure AD app gallery, read the details [here](../develop/v2-howto-app-gallery-listing.md).

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

The total number of required permissions for any single application registration mustn't exceed 400 permissions, across all APIs. The change to enforce this limit will begin rolling out mid-October 2021. Applications exceeding the limit can't increase the number of permissions they are configured for. The existing limit on the number of distinct APIs for which permissions are required remains unchanged and may not exceed 50 APIs.

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
 
If there's no trust relation between a home and resource tenant, a guest user would have previously been asked to re-register their device, which would break the previous registration. However, the user would end up in a registration loop because only home tenant device registration is supported. In this specific scenario, instead of this loop, we have created a new conditional access blocking page. The page tells the end user that they can't get access to conditional access protected resources as a guest user. [Learn more](../external-identities/b2b-quickstart-add-guest-users-portal.md#prerequisites).
 
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
 
Flagged sign-ins is a feature that will increase the signal to noise ratio for user sign-ins where users need help. The functionality is intended to empower users to raise awareness about sign-in errors they want help with. Also to help admins and help desk workers find the right sign-in events quickly and efficiently. [Learn more](../reports-monitoring/overview-flagged-sign-ins.md).

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

### General Availability - Azure AD single Sign on and device-based Conditional Access support in Firefox on Windows 10/11

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

As a workaround, we are deploying the device login flow by October 8. Between today and until then, it is likely that it may not be rolled out to all regions yet (in which case, end-users will be met with an error screen until it gets deployed to your region.) 

For more details on the device login flow and details on requesting extension to Google, see [Add Google as an identity provider for B2B guest users](../external-identities/google-federation.md#deprecation-of-web-view-sign-in-support).
 
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
 
The modern Edge browser is now included in the requirement to provide an `Origin` header when redeeming a [single page app authorization code](../develop/v2-oauth2-auth-code-flow.md#redirect-uri-setup-required-for-single-page-apps). A compatibility fix accidentally exempted the modern Edge browser from CORS controls, and that bug is being fixed during October. A subset of applications depended on CORS being disabled in the browser, which has the side effect of removing the `Origin` header from traffic. This is an unsupported configuration for using Azure AD, and these apps that depended on disabling CORS can no longer use modern Edge as a security workaround.  All modern browsers must now include the `Origin` header per HTTP spec, to ensure CORS is enforced. [Learn more](../develop/reference-breaking-changes.md#the-device-code-flow-ux-will-now-include-an-app-confirmation-prompt). 

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

[Studybugs](https://studybugs.com/signin), [Yello](https://yello.co/yello-for-microsoft-teams/), [LawVu](../saas-apps/lawvu-tutorial.md), [Formate eVo Mail](https://www.document-genetics.co.uk/formate-evo-erp-output-management), [Revenue Grid](https://app.revenuegrid.com/login), [Orbit for Office 365](https://azuremarketplace.microsoft.com/marketplace/apps/aad.orbitforoffice365?tab=overview), [Upmarket](https://app.upmarket.ai/), [Alinto Protect](https://protect.alinto.net/), [Cloud Concinnity](https://cloudconcinnity.com/), [Matlantis](https://matlantis.com/), [ModelGen for Visio (MG4V)](https://crecy.com.au/model-gen/), [NetRef: Classroom Management](https://oauth.net-ref.com/microsoft/sso), [VergeSense](../saas-apps/vergesense-tutorial.md), [iAuditor](../saas-apps/iauditor-tutorial.md), [Secutraq](https://secutraq.net/login), [Active and Thriving](../saas-apps/active-and-thriving-tutorial.md), [Inova](https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=1bacdba3-7a3b-410b-8753-5cc0b8125f81&response_type=code&redirect_uri=https:%2f%2fbroker.partneringplace.com%2fpartner-companion%2f&code_challenge_method=S256&code_challenge=YZabcdefghijklmanopqrstuvwxyz0123456789._-~&scope=1bacdba3-7a3b-410b-8753-5cc0b8125f81/.default), [TerraTrue](../saas-apps/terratrue-tutorial.md), [Facebook Work Accounts](../saas-apps/facebook-work-accounts-tutorial.md), [Beyond Identity Admin Console](../saas-apps/beyond-identity-admin-console-tutorial.md), [Visult](https://app.visult.io/), [ENGAGE TAG](https://app.engagetag.com/), [Appaegis Isolation Access Cloud](../saas-apps/appaegis-isolation-access-cloud-tutorial.md), [CrowdStrike Falcon Platform](../saas-apps/crowdstrike-falcon-platform-tutorial.md), [MY Emergency Control](https://my-emergency.co.uk/app/auth/login), [AlexisHR](../saas-apps/alexishr-tutorial.md), [Teachme Biz](../saas-apps/teachme-biz-tutorial.md), [Zero Networks](../saas-apps/zero-networks-tutorial.md), [Mavim iMprove](https://improve.mavimcloud.com/), [Azumuta](https://app.azumuta.com/login?microsoft=true), [Frankli](https://beta.frankli.io/login), [Amazon Managed Grafana](../saas-apps/amazon-managed-grafana-tutorial.md), [Productive](../saas-apps/productive-tutorial.md), [Create!Webフロー](../saas-apps/createweb-tutorial.md), [Evercate](https://evercate.com/us/sign-up/), [Ezra Coaching](../saas-apps/ezra-coaching-tutorial.md), [Baldwin Safety and Compliance](../saas-apps/baldwin-safety-&-compliance-tutorial.md), [Nulab Pass (Backlog,Cacoo,Typetalk)](../saas-apps/nulab-pass-tutorial.md), [Metatask](../saas-apps/metatask-tutorial.md), [Contrast Security](../saas-apps/contrast-security-tutorial.md), [Animaker](../saas-apps/animaker-tutorial.md), [Traction Guest](../saas-apps/traction-guest-tutorial.md), [True Office Learning - LIO](../saas-apps/true-office-learning-lio-tutorial.md), [Qiita Team](../saas-apps/qiita-team-tutorial.md)

You can also find the documentation of all the applications here: https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here: https://aka.ms/AzureADAppRequest

---

###  Gmail users signing in on Microsoft Teams mobile and desktop clients will sign in with device login flow starting September 30, 2021

**Type:** Changed feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Starting on September 30 2021, Azure AD B2B guests and Azure AD B2C customers signing in with their self-service signed up or redeemed Gmail accounts will have an extra login step. Users will now be prompted to enter a code in a separate browser window to finish signing in on Microsoft Teams mobile and desktop clients. If you haven't already done so, make sure to modify your apps to use the system browser for sign-in. See [Embedded vs System Web UI in the MSAL.NET](../develop/msal-net-web-browsers.md#embedded-vs-system-web-ui) documentation for more information. All MSAL SDKs use the system web-view by default. 

As the device login flow will start September 30, 2021, it's may not be available in your region immediately. If it's not available yet, your end-users will be met with the error screen shown in the doc until it gets deployed to your region.) For more details on the device login flow and details on requesting extension to Google, see [Add Google as an identity provider for B2B guest users](../external-identities/google-federation.md#deprecation-of-web-view-sign-in-support).
 
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

### Public Preview - Azure AD single Sign on and device-based Conditional Access support in Firefox on Windows 10

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
 

The "Register or join devices" user action is generally available in Conditional access. This user action allows you to control multi-factor authentication (MFA) policies for Azure Active Directory (AD) device registration. Currently, this user action only allows you to enable multi-factor authentication (MFA) as a control when users register or join devices to Azure AD. Other controls that are dependent on or not applicable to Azure AD device registration continue to be disabled with this user action. [Learn more](../conditional-access/concept-conditional-access-cloud-apps.md#user-actions).

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

[Siriux Customer Dashboard](https://portal.siriux.tech/login), [STRUXI](https://struxi.app/), [Autodesk Construction Cloud - Meetings](https://acc.autodesk.com/), [Eccentex AppBase for Azure](../saas-apps/eccentex-appbase-for-azure-tutorial.md), [Bookado](https://adminportal.bookado.io/), [FilingRamp](https://app.filingramp.com/login), [BenQ IAM](../saas-apps/benq-iam-tutorial.md), [Rhombus Systems](../saas-apps/rhombus-systems-tutorial.md), [CorporateExperience](../saas-apps/corporateexperience-tutorial.md), [TutorOcean](../saas-apps/tutorocean-tutorial.md), [Bookado Device](https://adminportal.bookado.io/), [HiFives-AD-SSO](https://app.hifives.in/login/azure), [Darzin](https://au.darzin.com/), [Simply Stakeholders](https://au.simplystakeholders.com/), [KACTUS HCM - Smart People](https://kactusspc.digitalware.co/), [Five9 UC Adapter for Microsoft Teams V2](https://uc.five9.net/?vendor=msteams), [Automation Center](https://automationcenter.cognizantgoc.com/portal/boot/signon), [Cirrus Identity Bridge for Azure AD](../saas-apps/cirrus-identity-bridge-for-azure-ad-tutorial.md), [ShiftWizard SAML](../saas-apps/shiftwizard-saml-tutorial.md), [Safesend Returns](https://www.safesendwebsites.com/), [Brushup](../saas-apps/brushup-tutorial.md), [directprint.io Cloud Print Administration](../saas-apps/directprint-io-cloud-print-administration-tutorial.md), [plain-x](https://app.plain-x.com/#/login),[X-point Cloud](../saas-apps/x-point-cloud-tutorial.md), [SmartHub INFER](../saas-apps/smarthub-infer-tutorial.md), [Fresh Relevance](../saas-apps/fresh-relevance-tutorial.md), [FluentPro G.A. Suite](https://gas.fluentpro.com/Account/SSOLogin?provider=Microsoft), [Clockwork Recruiting](../saas-apps/clockwork-recruiting-tutorial.md), [WalkMe SAML2.0](../saas-apps/walkme-saml-tutorial.md), [Sideways 6](https://app.sideways6.com/account/login?ReturnUrl=/), [Kronos Workforce Dimensions](../saas-apps/kronos-workforce-dimensions-tutorial.md), [SysTrack Cloud Edition](https://cloud.lakesidesoftware.com/Cloud/Account/Login), [mailworx Dynamics CRM Connector](https://www.mailworx.info/), [Palo Alto Networks Cloud Identity Engine - Cloud Authentication Service](../saas-apps/palo-alto-networks-cloud-identity-engine---cloud-authentication-service-tutorial.md), [Peripass](https://accounts.peripass.app/v1/sso/challenge), [JobDiva](https://www.jobssos.com/index_azad.jsp?SSO=AZURE&ID=1), [Sanebox For Office365](https://sanebox.com/login), [Tulip](../saas-apps/tulip-tutorial.md), [HP Wolf Security](https://bec-pocda37b439.bromium-online.com/gui/), [Genesys Engage cloud Email](https://login.microsoftonline.com/common/oauth2/authorize?prompt=consent&accessType=offline&state=07e035a7-6fb0-4411-afd9-efa46c9602f9&resource=https://graph.microsoft.com/&response_type=code&redirect_uri=https://iwd.api01-westus2.dev.genazure.com/iwd/v3/emails/oauth2/microsoft/callback&client_id=36cd21ab-862f-47c8-abb6-79facad09dda), [Meta Wiki](https://meta.dunkel.eu/), [Palo Alto Networks Cloud Identity Engine Directory Sync](https://directory-sync.us.paloaltonetworks.com/directory?instance=L2qoLVONpBHgdJp1M5K9S08Z7NBXlpi54pW1y3DDu2gQqdwKbyUGA11EgeaDfZ1dGwn397S8eP7EwQW3uyE4XL), [Valarea](https://www.valarea.com/en/download), [LanSchool Air](../saas-apps/lanschool-air-tutorial.md), [Catalyst](https://www.catalyst.org/sso-login/), [Webcargo](../saas-apps/webcargo-tutorial.md)

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

### Multi-factor (MFA) fraud report – new audit event

**Type:** Changed feature  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 

To help administrators understand that their users are blocked for multi-factor authentication (MFA) as a result of fraud report, we have added a new audit event. This audit event is tracked when the user reports fraud. The audit log is available in addition to the existing information in the sign-in logs about fraud report. To learn how to get the audit report, see [multifactor authentication Fraud alert](../authentication/howto-mfa-mfasettings.md#fraud-alert).

---

### Improved Low-Risk Detections

**Type:** Changed feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection

To improve the quality of low risk alerts that Identity Protection issues, we've modified the algorithm to issue fewer low risk Risky Sign-Ins. Organizations may see a significant reduction in low risk sign-in in their environment. [Learn more](../identity-protection/concept-identity-protection-risks.md).
 
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

Users that have been assigned the User administrator role can longer create catalogs or manage access packages in a catalog they don't own. If users in your organization have been assigned the User administrator role to configure catalogs, access packages, or policies in entitlement management, they will need a new assignment. You should instead assign these users the Identity Governance administrator role. [Learn more](../governance/entitlement-management-delegate.md)

---

### Windows Azure Active Directory connector is deprecated

**Type:** Deprecated  
**Service category:** Microsoft Identity Manager  
**Product capability:** Identity Lifecycle Management
 
The Windows Azure AD Connector for FIM is at feature freeze and deprecated. The solution of using FIM and the Azure AD Connector has been replaced. Existing deployments should migrate to [Azure AD Connect](../hybrid/whatis-hybrid-identity.md), Azure AD Connect Sync, or the [Microsoft Graph Connector](/microsoft-identity-manager/microsoft-identity-manager-2016-connector-graph), as the internal interfaces used by the Azure AD Connector for FIM are being removed from Azure AD. [Learn more](/microsoft-identity-manager/microsoft-identity-manager-2016-deprecated-features).

---

### Retirement of older Azure AD Connect versions

**Type:** Deprecated  
**Service category:** AD Connect  
**Product capability:** User Management
 
Starting August 31 2022, all V1 versions of Azure AD Connect will be retired. If you haven't already done so, you need to update your server to Azure AD Connect V2.0. You need to make sure you're running a recent version of Azure AD Connect to receive an optimal support experience.

If you run a retired version of Azure AD Connect it may unexpectedly stop working. You may also not have the latest security fixes, performance improvements, troubleshooting, and diagnostic tools and service enhancements. Also, if you require support we can't provide you with the level of service your organization needs.

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

As the device login flow will start rolling out on September 30, 2021, it is likely that it may not be rolled out to your region yet (in which case, your end-users will be met with the error screen shown in the documentation until it gets deployed to your region.) 

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
 
In Azure AD entitlement management, an administrator can define that an access package is incompatible with another access package or with a group. Users who have the incompatible memberships will be then unable to request more access. [Learn more](../governance/entitlement-management-access-package-request-policy.md#prevent-requests-from-users-with-incompatible-access-preview).
 
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

### General availability - Enable external users to self-service sign-up in AAD using MSA accounts

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
Users can now enable external users to self-service sign-up in Azure Active Directory using Microsoft accounts. [Learn more](../external-identities/microsoft-account.md).
 
---
 
### General availability - External Identities Self-Service Sign-Up with Email One-time Passcode

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 

Now users can enable external users to self-service sign-up in Azure Active Directory using their email and one-time passcode. [Learn more](../external-identities/one-time-passcode.md).
 
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
 
The Register or join devices user action in Conditional access is now in general availability. This user action allows you to control multi-factor authentication (MFA) policies for Azure AD device registration. 

Currently, this user action only allows you to enable multi-factor authentication (MFA) as a control when users register or join devices to Azure AD. Other controls that are dependent on or not applicable to Azure AD device registration continue to be disabled with this user action. [Learn more](../conditional-access/concept-conditional-access-cloud-apps.md#user-actions). 

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
 
## June 2021

### Context panes to display risk details in Identity Protection Reports

**Type:** Plan for change  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 
For the Risky users, Risky sign-ins, and Risk detections reports in Identity Protection, the risk details of a selected entry will be shown in a context pane appearing from the right of the page July 2021. The change only impacts the user interface and won't affect any existing functionalities. To learn more about the functionality of these features, refer to [How To: Investigate risk](../identity-protection/howto-identity-protection-investigate-risk.md).
 
---

### Public preview -  create Azure AD access reviews of Service Principals that are assigned to privileged roles

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
 You can use Azure AD access reviews to review service principal's access to privileged Azure AD and Azure resource roles. [Learn more](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md#create-access-reviews).
 
---

### Public preview -  group owners in Azure AD can create and manage Azure AD access reviews for their groups

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
Now group owners in Azure AD can create and manage Azure AD access reviews on their groups. This ability can be enabled by tenant administrators through Azure AD access review settings and is disabled by default. [Learn more](../governance/create-access-review.md#allow-group-owners-to-create-and-manage-access-reviews-of-their-groups-preview).
 
---

### Public preview -  customers can scope access reviews of privileged roles to just users with eligible or active access

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
When admins create access reviews of assignments to privileged roles, they can scope the reviews to only eligibly assigned users or only actively assigned users. [Learn more](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md).
 
---

### Public preview -  Microsoft Graph APIs for Mobility (MDM/MAM) management policies

**Type:** New feature  
**Service category:** Other  
**Product capability:** Device Lifecycle Management
 
Microsoft Graph support for the Mobility (MDM/MAM) configuration in Azure AD is in public preview. Administrators can configure user scope and URLs for MDM applications like Intune using Microsoft Graph v1.0. For more information, see [mobilityManagementPolicy resource type](/graph/api/resources/mobilitymanagementpolicy?view=graph-rest-beta&preserve-view=true)

---

### General availability - Custom questions in access package request flow in Azure Active Directory entitlement management

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
Azure AD entitlement management now supports the creation of custom questions in the access package request flow. This feature allows you to configure custom questions in the access package policy. These questions are shown to requestors who can input their answers as part of the access request process. These answers will be displayed to approvers, giving them helpful information that empowers them to make better decisions on the access request. [Learn more](../governance/entitlement-management-access-package-create.md).

---

### General availability - Multi-geo SharePoint sites as resources in Entitlement Management Access Packages

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
Access  packages in Entitlement Management now support multi-geo SharePoint sites for customers who use the multi-geo capabilities in SharePoint Online. [Learn more](../governance/entitlement-management-catalog-create.md#add-a-multi-geo-sharepoint-site).
 
---

### General availability - Knowledge Admin and Knowledge Manager built-in roles

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
Two new roles, Knowledge Administrator and Knowledge Manager are now in general availability.

- Users in the Knowledge Administrator role have full access to all Organizational knowledge settings in the Microsoft 365 admin center. They  can create and manage content, like topics and acronyms. Additionally, these users can create content centers, monitor service health, and create service requests. [Learn more](../roles/permissions-reference.md#knowledge-administrator)
- Users in the Knowledge Manager role can create and manage content and are primarily responsible for the quality and structure of knowledge. They have full rights to topic management actions to confirm a topic, approve edits, or delete a topic. This role can also manage taxonomies as part of the term store management tool and create content centers. [Learn more](../roles/permissions-reference.md#knowledge-manager).

---

### General availability - Cloud App Security Administrator built-in role

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
 Users with this role have full permissions in Cloud App Security. They can add administrators, add Microsoft Cloud App Security (MCAS) policies and settings, upload logs, and do governance actions. [Learn more](../roles/permissions-reference.md#cloud-app-security-administrator).
 
---

### General availability - Windows Update Deployment Administrator

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 

 Users in this role can create and manage all aspects of Windows Update deployments through the Windows Update for Business deployment service. The deployment service enables users to define settings for when and how updates are deployed. Also, users can specify which updates are offered to groups of devices in their tenant. It also allows users to monitor the update progress. [Learn more](../roles/permissions-reference.md#windows-update-deployment-administrator).
 
---

### General availability - multi-camera support for Windows Hello

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
Now with the Windows 10 21H1 update, Windows Hello supports multiple cameras. The update includes defaults to use the external camera when both built-in and outside cameras are present. [Learn more](https://techcommunity.microsoft.com/t5/windows-it-pro-blog/it-tools-to-support-windows-10-version-21h1/ba-p/2365103).

---
 
### General availability - Access Reviews MS Graph APIs now in v1.0

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
Azure Active Directory access reviews MS Graph APIs are now in v1.0 support fully configurable access reviews features. [Learn more](/graph/api/resources/accessreviewsv2-overview?view=graph-rest-1.0&preserve-view=true).
 
---

### New provisioning connectors in the Azure AD Application Gallery - June 2021

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [askSpoke](../saas-apps/askspoke-provisioning-tutorial.md)
- [Cloud Academy - SSO](../saas-apps/cloud-academy-sso-provisioning-tutorial.md)
- [CheckProof](../saas-apps/checkproof-provisioning-tutorial.md)
- [GoLinks](../saas-apps/golinks-provisioning-tutorial.md)
- [Holmes Cloud](../saas-apps/holmes-cloud-provisioning-tutorial.md)
- [H5mag](../saas-apps/h5mag-provisioning-tutorial.md)
- [LimbleCMMS](../saas-apps/limblecmms-provisioning-tutorial.md)
- [LogMeIn](../saas-apps/logmein-provisioning-tutorial.md)
- [SECURE DELIVER](../saas-apps/secure-deliver-provisioning-tutorial.md)
- [Sigma Computing](../saas-apps/sigma-computing-provisioning-tutorial.md)
- [Smallstep SSH](../saas-apps/smallstep-ssh-provisioning-tutorial.md)
- [Tribeloo](../saas-apps/tribeloo-provisioning-tutorial.md)
- [Twingate](../saas-apps/twingate-provisioning-tutorial.md)

For more information, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 
---

### New Federated Apps available in Azure AD Application gallery - June 2021

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In June 2021, we have added following 42 new applications in our App gallery with Federation support

[Taksel](https://help.ubuntu.com/community/Tasksel), [IDrive360](../saas-apps/idrive360-tutorial.md), [VIDA](../saas-apps/vida-tutorial.md), [ProProfs Classroom](../saas-apps/proprofs-classroom-tutorial.md), [WAN-Sign](../saas-apps/wan-sign-tutorial.md), [Citrix Cloud SAML SSO](../saas-apps/citrix-cloud-saml-sso-tutorial.md), [Fabric](../saas-apps/fabric-tutorial.md), [DssAD](https://cloudlicensing.deepseedsolutions.com/), [RICOH Creative Collaboration RICC](https://www.ricoh-europe.com/products/software-apps/collaboration-board-software/ricc/), [Styleflow](../saas-apps/styleflow-tutorial.md), [Chaos](https://accounts.chaosgroup.com/corporate_login), [Traced Connector](https://control.traced.app/signup), [Squarespace](https://account.squarespace.com/org/azure), [MX3 Diagnostics Connector](https://mx3www.playground.dynuddns.com/signin-oidc), [Ten Spot](https://tenspot.co/api/v1/sso/azure/login/), [Finvari](../saas-apps/finvari-tutorial.md), [Mobile4ERP](https://play.google.com/store/apps/details?id=com.negevsoft.mobile4erp), [WalkMe US OpenID Connect](https://www.walkme.com/), [Neustar UltraDNS](../saas-apps/neustar-ultradns-tutorial.md), [cloudtamer.io](../saas-apps/cloudtamer-io-tutorial.md), [A Cloud Guru](../saas-apps/a-cloud-guru-tutorial.md), [PetroVue](../saas-apps/petrovue-tutorial.md), [Postman](../saas-apps/postman-tutorial.md), [ReadCube Papers](../saas-apps/readcube-papers-tutorial.md), [Peklostroj](https://app.peklostroj.cz/), [SynCloud](https://onboard.syncloud.io/), [Polymerhq.io](https://www.polymerhq.io/), [Bonos](../saas-apps/bonos-tutorial.md), [Astra Schedule](../saas-apps/astra-schedule-tutorial.md), [Draup](../saas-apps/draup-inc-tutorial.md), [Inc](../saas-apps/draup-inc-tutorial.md), [Applied Mental Health](../saas-apps/applied-mental-health-tutorial.md), [iHASCO Training](../saas-apps/ihasco-training-tutorial.md), [Nexsure](../saas-apps/nexsure-tutorial.md), [XEOX](https://login.xeox.com/), [Plandisc](https://create.plandisc.com/account/logon), [foundU](../saas-apps/foundu-tutorial.md), [Standard for Success Accreditation](../saas-apps/standard-for-success-accreditation-tutorial.md), [Penji Teams](https://web.penjiapp.com/), [CheckPoint Infinity Portal](../saas-apps/checkpoint-infinity-portal-tutorial.md), [Teamgo](../saas-apps/teamgo-tutorial.md), [Hopsworks.ai](../saas-apps/hopsworks-ai-tutorial.md), [HoloMeeting 2](https://backend2.holomeeting.io/)

You can also find the documentation of all the applications here: https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here: https://aka.ms/AzureADAppRequest
 
---

### Device code flow now includes an app verification prompt

**Type:** Changed feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
The [device code flow](../develop/v2-oauth2-device-code.md) has been updated to include one extra user prompt. While signing in, the user will see a prompt asking them to validate the app they're signing into.  The prompt ensures that they aren't subject to a phishing attack. [Learn more](../develop/reference-breaking-changes.md#the-device-code-flow-ux-will-now-include-an-app-confirmation-prompt).
 
---

### User last sign-in date and time is now available on Azure portal

**Type:** Changed feature  
**Service category:** User Management  
**Product capability:** User Management
 
You can now view your users' last sign-in date and time stamp on the Azure portal. The information is available for each user on the user profile page. This information helps you identify inactive users and effectively manage risky events. [Learn more](./active-directory-users-profile-azure-portal.md?context=%2fazure%2factive-directory%2fenterprise-users%2fcontext%2fugr-context).
 
---

### MIM BHOLD Suite impact of end of support for Microsoft Silverlight

**Type:** Changed feature  
**Service category:** Microsoft Identity Manager  
**Product capability:** Identity Governance
 
Microsoft Silverlight will reach its end of support on October 12, 2021. This change only impacts customers using the Microsoft BHOLD Suite, and doesn't impact other Microsoft Identity Manager scenarios. For more information, see [Silverlight End of Support](https://support.microsoft.com/windows/silverlight-end-of-support-0a3be3c7-bead-e203-2dfd-74f0a64f1788).  

Users who haven't installed Microsoft Silverlight in their browser can't use the BHOLD Suite modules which require Silverlight. This includes the BHOLD Model Generator, BHOLD FIM Self-service integration, and BHOLD Analytics.  Customers with an existing BHOLD deployment of one or more of those modules should plan to uninstall those modules from their BHOLD server computers by October 2021. Also, they should plan to uninstall Silverlight from any user computers that were previously interacting with that BHOLD deployment.
 
---

### My* experiences: End of support for Internet Explorer 11

**Type:** Deprecated  
**Service category:** My Apps  
**Product capability:** End User Experiences
 

Microsoft 365 and other apps are ending support for Internet Explorer 11 on August 21, 2021, and this includes the My* experiences. The My*s accessed via Internet Explorer won't receive bug fixes or any updates, which may lead to issues. These dates are being driven by the Edge team and may be subject to change. [Learn more](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge/).
 
---

### Planned deprecation - Malware linked IP address detection in Identity Protection

**Type:** Deprecated  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 
Starting October 1, 2021, Azure AD Identity Protection will no longer generate the "Malware linked IP address" detection. No action is required and customers will remain protected by the other detections provided by Identity Protection. To learn more about protection policies, refer to [Identity Protection policies](../identity-protection/concept-identity-protection-policies.md).
 
---