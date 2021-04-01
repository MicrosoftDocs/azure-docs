---
title: Archive for What's new in Azure Active Directory? | Microsoft Docs
description: The What's new release notes in the Overview section of this content set contains 6 months of activity. After 6 months, the items are removed from the main article and put into this archive article.
services: active-directory
author: ajburnle
manager: daveba

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 3/31/2021
ms.author: ajburnle
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

## September 2020

### New provisioning connectors in the Azure AD Application Gallery - September 2020

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Coda](../saas-apps/coda-provisioning-tutorial.md)
- [Cofense Recipient Sync](../saas-apps/cofense-provision-tutorial.md)
- [InVision](../saas-apps/invision-provisioning-tutorial.md)
- [myday](../saas-apps/myday-provision-tutorial.md)
- [SAP Analytics Cloud](../saas-apps/sap-analytics-cloud-provisioning-tutorial.md)
- [Webroot Security Awareness](../saas-apps/webroot-security-awareness-training-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).
 
---
### Cloud Provisioning Public Preview Refresh

**Type:** New feature  
**Service category:** Azure AD Cloud Provisioning 
**Product capability:** Identity Lifecycle Management
 
Azure AD Connect Cloud Provisioning public preview refresh features two major enhancements developed from customer feedback: 

- Attribute Mapping Experience through Azure portal

    With this feature, IT Admins can map user, group, or contact attributes from AD to Azure AD using various mapping types present today. Attribute mapping is a feature used for standardizing the values of the attributes that flow from Active Directory to Azure Active Directory. One can determine whether to directly map the attribute value as it is from AD to Azure AD or use expressions to transform the attribute values when provisioning users. [Learn more](../cloud-sync/how-to-attribute-mapping.md)

- On-demand Provisioning or Test User experience

    Once you have setup your configuration, you might want to test to see if the user transformation is working as expected before applying it to all your users in scope. With on-demand provisioning, IT Admins can enter the Distinguished Name (DN) of an AD user and see if they're getting synced as expected. On-demand provisioning provides a great way to ensure that the attribute mappings you did previously work as expected. [Learn More](../cloud-sync/how-to-on-demand-provision.md)
 
---

### Audited BitLocker Recovery in Azure AD - Public Preview

**Type:** New feature  
**Service category:** Device Access Management  
**Product capability:** Device Lifecycle Management
 
When IT admins or end users read BitLocker recovery key(s) they have access to, Azure Active Directory now generates an audit log that captures who accessed the recovery key. The same audit provides details of the device the BitLocker key was associated with.

End users can [access their recovery keys via My Account](../user-help/my-account-portal-devices-page.md#view-a-bitlocker-key). IT admins can access recovery keys via the [BitLocker recovery key API in beta](/graph/api/resources/bitlockerrecoverykey?view=graph-rest-beta&preserve-view=true) or via the Azure AD Portal. To learn more, see [View or copy BitLocker keys in the Azure AD Portal](../devices/device-management-azure-portal.md#view-or-copy-bitlocker-keys).

---

### Teams Devices Administrator built-in role

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control
 
Users with the [Teams Devices Administrator](../roles/permissions-reference.md#teams-devices-administrator) role can manage [Teams-certified devices](https://www.microsoft.com/microsoft-365/microsoft-teams/across-devices/devices) from the Teams Admin Center. 

This role allows the user to view all devices at single glance, with the ability to search and filter devices. The user can also check the details of each device including logged-in account and the make and model of the device. The user can change the settings on the device and update the software versions. This role doesn't grant permissions to check Teams activity and call quality of the device.
 
---

### Advanced query capabilities for Directory Objects

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Developer Experience
 
All the new query capabilities introduced for Directory Objects in Azure AD APIs are now available in the v1.0 endpoint and production-ready. Developers can Count, Search, Filter, and Sort Directory Objects and related links using the standard OData operators.

To learn more, see the documentation [here](https://aka.ms/BlogPostMezzoGA), and you can also send feedback with this [brief survey](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_yN8EPoGo5OpR1hgmCp1XxUMENJRkNQTk5RQkpWTE44NEk2U0RIV0VZRy4u).
 
---

### Public preview: continuous access evaluation for tenants who configured Conditional Access policies

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** Identity Security & Protection
 
Continuous access evaluation (CAE) is now available in public preview for Azure AD tenants with Conditional Access policies. With CAE, critical security events and policies are evaluated in real time. This includes account disable, password reset, and location change. To learn more, see [Continuous access evaluation](../conditional-access/concept-continuous-access-evaluation.md).

---

### Public preview: ask users requesting an access package additional questions to improve approval decisions

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
Administrators can now require that users requesting an access package answer additional questions beyond just business justification in Azure AD Entitlement management's My Access portal. The users' answers will then be shown to the approvers to help them make a more accurate access approval decision. To learn more, see [Collect additional requestor information for approval (preview)](../governance/entitlement-management-access-package-approval-policy.md#collect-additional-requestor-information-for-approval-preview).
 
---

### Public preview: Enhanced user management

**Type:** New feature  
**Service category:** User Management  
**Product capability:** User Management
 

The Azure AD portal has been updated to make it easier to find users in the All users and Deleted users pages. Changes in the preview include: 
- More visible user properties including object ID, directory sync status, creation type, and identity issuer.
- Search now allows combined search of names, emails, and object IDs.
- Enhanced filtering by user type (member, guest, and none), directory sync status, creation type, company name, and domain name.
- New sorting capabilities on properties like name, user principal name and deletion date.
- A new total users count that updates with any searches or filters.

For more information, please see [User management enhancements (preview) in Azure Active Directory](../enterprise-users/users-search-enhanced.md).

---

### New notes field for Enterprise applications

**Type:** New feature  
**Service category:** Enterprise Apps 
**Product capability:** SSO

You can add free text notes to Enterprise applications. You can add any relevant information that will help you manager applications under Enterprise applications. For more information, see [Quickstart: Configure properties for an application in your Azure Active Directory (Azure AD) tenant](../manage-apps/add-application-portal-configure.md). 

---

### New Federated Apps available in Azure AD Application gallery - September 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In September 2020 we have added following 34 new applications in our App gallery with Federation support:

[VMware Horizon - Unified Access Gateway](), [Pulse Secure PCS](../saas-apps/vmware-horizon-unified-access-gateway-tutorial.md), [Inventory360](../saas-apps/pulse-secure-pcs-tutorial.md), [Frontitude](https://services.enteksystems.de/sso/microsoft/signup), [BookWidgets](https://www.bookwidgets.com/sso/office365), [ZVD_Server](https://zaas.zenmutech.com/user/signin), [HashData for Business](https://hashdata.app/login.xhtml), [SecureLogin](https://securelogin.securelogin.nu/sso/azure/login), [CyberSolutions MAILBASEΣ/CMSS](../saas-apps/cybersolutions-mailbase-tutorial.md), [CyberSolutions CYBERMAILΣ](../saas-apps/cybersolutions-cybermail-tutorial.md), [LimbleCMMS](https://auth.limblecmms.com/), [Glint Inc](../saas-apps/glint-inc-tutorial.md), [zeroheight](../saas-apps/zeroheight-tutorial.md), [Gender Fitness](https://app.genderfitness.com/), [Coeo Portal](https://my.coeo.com/), [Grammarly](../saas-apps/grammarly-tutorial.md), [Fivetran](../saas-apps/fivetran-tutorial.md), [Kumolus](../saas-apps/kumolus-tutorial.md), [RSA Archer Suite](../saas-apps/rsa-archer-suite-tutorial.md), [TeamzSkill](../saas-apps/teamzskill-tutorial.md), [raumfürraum](../saas-apps/raumfurraum-tutorial.md), [Saviynt](../saas-apps/saviynt-tutorial.md), [BizMerlinHR](https://marketplace.bizmerlin.net/bmone/signup), [Mobile Locker](../saas-apps/mobile-locker-tutorial.md), [Zengine](../saas-apps/zengine-tutorial.md), [CloudCADI](https://app.cloudcadi.com/login), [Simfoni Analytics](https://simfonianalytics.com/accounts/microsoft/login/), [Priva Identity & Access Management](https://my.priva.com/), [Nitro Pro](https://www.gonitro.com/nps/product-details/downloads), [Eventfinity](../saas-apps/eventfinity-tutorial.md), [Fexa](../saas-apps/fexa-tutorial.md), [Secured Signing Enterprise Portal](https://www.securedsigning.com/aad/Auth/ExternalLogin/AdminPortal), [Secured Signing Enterprise Portal AAD Setup](https://www.securedsigning.com/aad/Auth/ExternalLogin/AdminPortal), [Wistec Online](https://wisteconline.com/auth/oidc), [Oracle PeopleSoft - Protected by F5 BIG-IP APM](../saas-apps/oracle-peoplesoft-protected-by-f5-big-ip-apm-tutorial.md)

You can also find the documentation of all the applications from here: https://aka.ms/AppsTutorial.

For listing your application in the Azure AD app gallery, read the details here: https://aka.ms/AzureADAppRequest.

---

### New delegation role in Azure AD entitlement management: Access package assignment manager

**Type:** New feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 
A new Access Package Assignment Manager role has been added in Azure AD entitlement management to provide granular permissions to manage assignments. You can now delegate tasks to a user in this role, who can delegate assignments management of an access package to a business owner. However, an Access Package Assignment Manager can't alter the access package policies or other properties that are set by the administrators. 

With this new role, you benefit from the least privileges needed to delegate management of assignments and maintain administrative control on all other access package configurations. To learn more, see [Entitlement management roles](../governance/entitlement-management-delegate.md#entitlement-management-roles).
 
---

### Changes to Privileged Identity Management's onboarding flow

**Type:** Changed feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
Previously, onboarding to Privileged Identity Management (PIM) required user consent and an onboarding flow in PIM's blade that included enrollment in Azure AD MFA. With the recent integration of PIM experience into the Azure AD roles and administrators blade, we are removing this experience. Any tenant with valid P2 license will be auto-onboarded to PIM.

Onboarding to PIM does not have any direct adverse effect on your tenant. You can expect the following changes:
- Additional assignment options such as active vs. eligible with start and end time when you make an assignment in either PIM or Azure AD roles and administrators blade. 
- Additional scoping mechanisms, like Administrative Units and custom roles, introduced directly into the assignment experience. 
- If you are a global administrator or privileged role administrator, you may start getting a few additional emails like the PIM weekly digest. 
- You might also see ms-pim service principal in the audit log related to role assignment. This expected change shouldn't affect your regular workflow.

 For more information, see [Start using Privileged Identity Management](../privileged-identity-management/pim-getting-started.md).

---

### Azure AD Entitlement Management: The Select pane of access package resources now shows by default the resources currently in the selected catalog

**Type:** Changed feature  
**Service category:** User Access Management  
**Product capability:** Entitlement Management
 

In the access package creation flow, under the Resource roles tab, the Select pane behavior is changing. Currently, the default behavior is to show all resources that are owned by the user and resources added to the selected catalog. 

This experience will be changed to display only the resources currently added in the catalog by default, so that users can easily pick resources from the catalog. The update will help with discoverability of the resources to add to access packages, and reduce risk of inadvertently adding resources owned by the user that aren't part of the catalog. To learn more, see [Create a new access package in Azure AD entitlement management](../governance/entitlement-management-access-package-create.md#resource-roles).
 
---

## August 2020 
 
### Updates to Azure Multi-Factor Authentication Server firewall requirements

**Type:** Plan for change  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 
Starting 1 October 2020, Azure MFA Server firewall requirements will require additional IP ranges.

If you have outbound firewall rules in your organization, update the rules so that your MFA servers can communicate with all the necessary IP ranges. The IP ranges are documented in [Azure Multi-Factor Authentication Server firewall requirements](../authentication/howto-mfaserver-deploy.md#azure-multi-factor-authentication-server-firewall-requirements).

---

### Upcoming changes to user experience in Identity Secure Score

**Type:** Plan for change  
**Service category:** Identity Protection 
**Product capability:** Identity Security & Protection

We're updating the Identity Secure Score portal to align with the changes introduced in Microsoft Secure Score’s [new release](/microsoft-365/security/mtp/microsoft-secure-score-whats-new). 

The preview version with the changes will be available at the beginning of September. The changes in the preview version include:
- “Identity Secure Score” renamed to “Secure Score for Identity” for brand alignment with Microsoft Secure Score
- Points normalized to standard scale and reported in percentages instead of points

In this preview, customers can toggle between the existing experience and the new experience. This preview will last until the end of November 2020. After the preview, the customers will automatically be directed to the new UX experience.

---

### New Restricted Guest Access Permissions in Azure AD - Public Preview

**Type:** New feature  
**Service category:** Access Control   
**Product capability:** User Management

We've updated directory level permissions for guest users. These permissions allow administrators to require additional restrictions and controls on external guest user access. Admins can now add additional restrictions for external guests' access to user and groups' profile and membership information. With this public preview feature, customers can manage external user access at scale by obfuscating group memberships, including restricting guest users from seeing memberships of the group(s) they are in.

To learn more, see [Restricted Guest Access Permissions](../enterprise-users/users-restrict-guest-permissions.md) and [Users Default Permissions](./users-default-permissions.md).
 
---

### General availability of delta queries for service principals

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Developer Experience
 
Microsoft Graph Delta Query now supports the resource type in v1.0:
- Service Principal

Now clients can track changes to those resources efficiently and provides the best solution to synchronize changes to those resources with a local data store. To learn how to configure these resources in a query, see [Use delta query to track changes in Microsoft Graph data](/graph/delta-query-overview).
 
---

### General availability of delta queries for oAuth2PermissionGrant

**Type:** New feature  
**Service category:** MS Graph  
**Product capability:** Developer Experience

Microsoft Graph Delta Query now supports the resource type in v1.0:
- OAuth2PermissionGrant

Clients can now track changes to those resources efficiently and provides the best solution to synchronize changes to those resources with a local data store. To learn how to configure these resources in a query, see [Use delta query to track changes in Microsoft Graph data](/graph/delta-query-overview).

---

### New Federated Apps available in Azure AD Application gallery - August 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In August 2020 we have added following 25 new applications in our App gallery with Federation support:

[Backup365](https://portal.backup365.io/login), [Soapbox](https://app.soapboxhq.com/create?step=auth&provider=azure-ad2-oauth2), [Alma SIS](https://almau.getalma.com/), [Enlyft Dynamics 365 Connector](http://enlyft.com/), [Serraview Space Utilization Software Solutions](../saas-apps/serraview-space-utilization-software-solutions-tutorial.md), [Uniq](https://web.uniq.app/), [Visibly](../saas-apps/visibly-tutorial.md), [Zylo](../saas-apps/zylo-tutorial.md), [Edmentum - Courseware Assessments Exact Path](https://auth.edmentum.com/elf/login), [CyberLAB](https://cyberlab.evolvesecurity.com/#/welcome), [Altamira HRM](../saas-apps/altamira-hrm-tutorial.md), [WireWheel](../saas-apps/wirewheel-tutorial.md), [Zix Compliance and Capture](https://sminstall.zixcorp.com/teams/teams.php?install_request=true&tenant_id=common), [Greenlight Enterprise Business Controls Platform](../saas-apps/greenlight-enterprise-business-controls-platform-tutorial.md), [Genetec Clearance](https://www.clearance.network/), [iSAMS](../saas-apps/isams-tutorial.md), [VeraSMART](../saas-apps/verasmart-tutorial.md), [Amiko](https://amiko.web.rivero.app/), [Twingate](https://auth.twingate.com/signup), [Funnel Leasing](https://nestiolistings.com/sso/oidc/azure/authorize/), [Scalefusion](https://scalefusion.com/users/sign_in/), [Bpanda](https://goto.bpanda.com/login), [Vivun Calendar Connect](https://app.vivun.com/dashboard/calendar/connect), [FortiGate SSL VPN](../saas-apps/fortigate-ssl-vpn-tutorial.md), [Wandera End User](https://www.wandera.com/)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest

---

### Resource Forests now available for Azure AD DS 

**Type:** New feature 
**Service category:** Azure AD Domain Services   
**Product capability:** Azure AD Domain Services
 
The capability of resource forests in Azure AD Domain Services is now generally available. You can now enable authorization without password hash synchronization to use Azure AD Domain Services, including smart-card authorization. To learn more, see [Replica sets concepts and features for Azure Active Directory Domain Services (preview)](../../active-directory-domain-services/concepts-replica-sets.md).
 
---

### Regional replica support for Azure AD DS managed domains now available

**Type:** New feature   
**Service category:** Azure AD Domain Services  
**Product capability:** Azure AD Domain Services
 
You can expand a managed domain to have more than one replica set per Azure AD tenant. Replica sets can be added to any peered virtual network in any Azure region that supports Azure AD Domain Services. Additional replica sets in different Azure regions provide geographical disaster recovery for legacy applications if an Azure region goes offline. To learn more, see [Replica sets concepts and features for Azure Active Directory Domain Services (preview)](../../active-directory-domain-services/concepts-replica-sets.md).

---

### General Availability of Azure AD My Sign-Ins

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** End User Experiences
 
Azure AD My Sign-Ins is a new feature that allows enterprise users to review their sign-in history to check for any unusual activity. Additionally, this feature allows end users to report “This wasn’t me” or “This was me” on suspicious activities. To learn more about using this feature, see [View and search your recent sign-in activity from the My Sign-Ins page](../user-help/my-account-portal-sign-ins-page.md#confirm-unusual-activity).
 
---

### SAP SuccessFactors HR driven user provisioning to Azure AD is now generally available

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
You can now integrate SAP SuccessFactors as the authoritative identity source with Azure AD and automate the end-to-end identity lifecycle using HR events like new hires and terminations to drive provisioning and de-provisioning of accounts in Azure AD. 

To learn more about how to configure SAP SuccessFactors inbound provisioning to Azure AD, refer to the tutorial [Configure SAP SuccessFactors to Active Directory user provisioning](../saas-apps/sap-successfactors-inbound-provisioning-tutorial.md).
 
---

### Custom Open ID Connect MS Graph API support for Azure AD B2C

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
Previously, Custom Open ID Connect providers could only be added or managed through the Azure portal. Now the Azure AD B2C customers can add and manage them through Microsoft Graph APIs beta version as well. To learn how to configure this resource with APIs, see [identityProvider resource type](/graph/api/resources/identityprovider?view=graph-rest-beta&preserve-view=true).
 
---

### Assign Azure AD built-in roles to cloud groups

**Type:** New feature  
**Service category:** Azure AD roles  
**Product capability:** Access Control

You can now assign Azure AD built-in roles to cloud groups with this new feature. For example, you can assign the SharePoint Administrator role to Contoso_SharePoint_Admins group. You can also use PIM to make the group an eligible member of the role, instead of granting standing access. To learn how to configure this feature, see [Use cloud groups to manage role assignments in Azure Active Directory (preview)](../roles/groups-concept.md).
 
---

### Insights Business Leader built-in role now available

**Type:** New feature  
**Service category:** Azure AD roles  
**Product capability:** Access Control
 
Users in the Insights Business Leader role can access a set of dashboards and insights via the [M365 Insights application](https://www.microsoft.com/microsoft-365/partners/workplaceanalytics). This includes full access to all dashboards and presented insights and data exploration functionality. However, users in this role don't have access to product configuration settings, which is the responsibility of the Insights Administrator role. To learn more about this role, see [Administrator role permissions in Azure Active Directory](../roles/permissions-reference.md#insights-business-leader)
 
---

### Insights Administrator built-in role now available

**Type:** New feature  
**Service category:** Azure AD roles  
**Product capability:** Access Control
 
Users in the Insights Administrator role can access the full set of administrative capabilities in the [M365 Insights application](https://www.microsoft.com/microsoft-365/partners/workplaceanalytics). A user in this role can read directory information, monitor service health, file support tickets, and access the Insights administrator settings aspects. To learn more about this role, see [Administrator role permissions in Azure Active Directory](../roles/permissions-reference.md#insights-administrator)
 
--- 

### Application Admin and Cloud Application Admin can manage extension properties of applications

**Type:** Changed feature  
**Service category:** Azure AD roles  
**Product capability:** Access Control
 
Previously, only the Global Administrator could manage the [extension property](/graph/api/application-post-extensionproperty?view=graph-rest-beta&tabs=http&preserve-view=true). We're now enabling this capability for the Application Administrator and Cloud Application Administrator as well.
 
---

### MIM 2016 SP2 hotfix 4.6.263.0 and connectors 1.1.1301.0

**Type:** Changed feature  
**Service category:** Microsoft Identity Manager  
**Product capability:** Identity Lifecycle Management

A [hotfix rollup package (build 4.6.263.0)](https://support.microsoft.com/help/4576473/hotfix-rollup-package-build-4-6-263-0-is-available-for-microsoft-ident) is available for Microsoft Identity Manager (MIM) 2016 Service Pack 2 (SP2). This rollup package contains updates for the MIM CM, MIM Synchronization Manager, and PAM components. In addition, the MIM generic connectors build 1.1.1301.0 includes updates for the Graph connector.

---

## July 2020

### As an IT Admin, I want to target client apps using Conditional Access

**Type:** Plan for change   
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection
 
With the GA release of the client apps condition in Conditional Access, new policies will now apply by default to all client applications. This includes legacy authentication clients. Existing policies will remain unchanged, but the *Configure Yes/No* toggle will be removed from existing policies to easily see which client apps  are applied to by the policy. 

When creating a new policy, make sure to exclude users and service accounts that are still using legacy authentication; if you don't, they will be blocked. [Learn more](../conditional-access/concept-conditional-access-conditions.md).
 
---

### Upcoming SCIM compliance fixes

**Type:** Plan for change  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
The Azure AD provisioning service leverages the SCIM standard for integrating with applications. Our implementation of the SCIM standard is evolving, and we expect to make changes to our behavior around how we perform PATCH operations as well as set the property "active" on a resource. [Learn more](../app-provisioning/application-provisioning-config-problem-scim-compatibility.md).
 
---

### Group owner setting on Azure Admin portal will be changed

**Type:** Plan for change  
**Service category:** Group Management  
**Product capability:** Collaboration

Owner settings on Groups general setting page can be configured to restrict owner assignment privileges to a limited group of users in the Azure Admin portal and Access Panel. We will soon have the ability to assign group owner privilege not only on these two UX portals but also enforce the policy on the backend to provide consistent behavior across endpoints, such as PowerShell and Microsoft Graph. 

We will start to disable the current setting for the customers who are not using it and will offer an option to scope users for group owner privilege in the next few months. For guidance on updating group settings, see Edit your group information using [Azure Active Directory](./active-directory-groups-settings-azure-portal.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context).

---

### Azure Active Directory Registration Service is ending support for TLS 1.0 and 1.1

**Type:** Plan for change  
**Service category:** Device Registration and Management  
**Product capability:** Platform

Transport layer security (TLS) 1.2 and update servers and clients will soon communicate with Azure Active Directory Device Registration Service. Support for TLS 1.0 and 1.1 for communication with Azure AD Device Registration service will retire:
- On August 31, 2020, in all sovereign clouds (GCC High, DoD, etc.)
- On October 30, 2020, in all commercial clouds

[Learn more](../devices/reference-device-registration-tls-1-2.md) about TLS 1.2 for the Azure AD Registration Service.

---

### Windows Hello for Business Sign Ins visible in Azure AD Sign In Logs

**Type:** Fixed  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
Windows Hello for Business allows end users to sign into Windows machines with a gesture (such as a PIN or biometric). Azure AD admins may want to differentiate Windows Hello for Business sign-ins from other Windows sign-ins as part of an organization's journey to passwordless authentication. 

Admins can now see whether a Windows authentication used Windows Hello for Business by checking the Authentication Details tab for a Windows sign-in event in the Azure AD Sign-Ins blade in the Azure portal. Windows Hello for Business authentications will include "WindowsHelloForBusiness" in the Authentication Method field. For more information on interpreting Sign-In Logs, please see the [Sign-In Logs documentation](../reports-monitoring/concept-sign-ins.md).
 
---

### Fixes to group deletion behavior and performance improvements

**Type:** Fixed  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
Previously, when a group changed from "in-scope" to "out-of-scope" and an admin clicked restart before the change was completed, the group object was not being deleted. Now the group object will be deleted from the target application when it goes out of scope (disabled, deleted, unassigned, or did not pass scoping filter). [Learn more](../app-provisioning/how-provisioning-works.md#incremental-cycles).
 
---

### Public Preview: Admins can now add custom content in the email to reviewers when creating an access review

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance
 
When a new access review is created, the reviewer receives an email requesting them to complete the access review. Many of our customers asked for the ability to add custom content to the email, such as contact information, or other additional supporting content to guide the reviewer. 

Now available in public preview, administrators can specify custom content in the email sent to reviewers by adding content in the "advanced" section of Azure AD Access Reviews. For guidance on creating access reviews, see [Create an access review of groups and applications in Azure AD access reviews](../governance/create-access-review.md).
 
---

### Authorization Code Flow for Single-page apps available

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** Developer Experience
 
Because of modern browser 3rd party cookie restrictions such as Safari ITP, SPAs will have to use the authorization code flow rather than the implicit flow to maintain SSO, and MSAL.js v 2.x will now support the authorization code flow. 

There are corresponding updates to the Azure portal so you can update your SPA to be type "spa" and use the auth code flow. See [Sign in users and get an access token in a JavaScript SPA using the auth code flow](../develop/quickstart-v2-javascript-auth-code.md) for further guidance.
 
---

### Azure AD Application Proxy now supports the Remote Desktop Services Web Client

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** Access Control

Azure AD Application Proxy now supports the Remote Desktop Services (RDS) Web Client. The RDS web client allows users to access Remote Desktop infrastructure through any HTLM5-capable browser such as Microsoft Edge, Internet Explorer 11, Google Chrome, etc. Users can interact with remote apps or desktops like they would with a local device from anywhere. By using Azure AD Application Proxy you can increase the security of your RDS deployment by enforcing pre-authentication and Conditional Access policies for all types of rich client apps. For guidance, see [Publish Remote Desktop with Azure AD Application Proxy](../manage-apps/application-proxy-integrate-with-remote-desktop-services.md).
 
---

### Next generation Azure AD B2C user flows in public preview

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
Simplified user flow experience offers feature parity with preview features and is the home for all new features. Users will be able to enable new features within the same user flow, reducing the need to create multiple versions with every new feature release. Lastly, the new, user-friendly UX simplifies the selection and creation of user flows. Try it now by [creating a user flow](../../active-directory-b2c/tutorial-create-user-flows.md). 

For more information about users flows, see [User flow versions in Azure Active Directory B2C](../../active-directory-b2c/user-flow-versions.md).

---

### New Federated Apps available in Azure AD Application gallery - July 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In July 2020 we have added following 55 new applications in our App gallery with Federation support:

[Clap Your Hands](http://www.rmit.com.ar/), [Appreiz](https://microsoftteams.appreiz.com/), [Inextor Vault](https://inexto.com/inexto-suite/inextor), [Beekast](https://my.beekast.com/), [Templafy OpenID Connect](https://app.templafy.com/), [PeterConnects receptionist](https://msteams.peterconnects.com/), [AlohaCloud](https://appfusions.alohacloud.com/auth), [Control Tower](https://bpm.tnxcorp.com/sso/microsoft), [Cocoom](https://start.cocoom.com/), [COINS Construction Cloud](https://sso.coinsconstructioncloud.com/#login/), [Medxnote MT](https://task.teamsmain.medx.im/authorization), [Reflekt](https://reflekt.konsolute.com/login), [Rever](https://app.reverscore.net/access), [MyCompanyArchive](https://login.mycompanyarchive.com/), [GReminders](https://app.greminders.com/o365-oauth), [Titanfile](../saas-apps/titanfile-tutorial.md), [Wootric](../saas-apps/wootric-tutorial.md), [SolarWinds Orion](https://support.solarwinds.com/SuccessCenter/s/orion-platform?language=en_US),  [OpenText Directory Services](../saas-apps/opentext-directory-services-tutorial.md), [Datasite](../saas-apps/datasite-tutorial.md), [BlogIn](../saas-apps/blogin-tutorial.md), [IntSights](../saas-apps/intsights-tutorial.md), [kpifire](../saas-apps/kpifire-tutorial.md), [Textline](../saas-apps/textline-tutorial.md), [Cloud Academy - SSO](../saas-apps/cloud-academy-sso-tutorial.md), [Community Spark](../saas-apps/community-spark-tutorial.md), [Chatwork](../saas-apps/chatwork-tutorial.md), [CloudSign](../saas-apps/cloudsign-tutorial.md), [C3M Cloud Control](../saas-apps/c3m-cloud-control-tutorial.md), [SmartHR](https://smarthr.jp/), [NumlyEngage™](../saas-apps/numlyengage-tutorial.md), [Michigan Data Hub Single Sign-On](../saas-apps/michigan-data-hub-single-sign-on-tutorial.md), [Egress](../saas-apps/egress-tutorial.md), [SendSafely](../saas-apps/sendsafely-tutorial.md), [Eletive](https://app.eletive.com/), [Right-Hand Cybersecurity ADI](https://right-hand.ai/), [Fyde Enterprise Authentication](https://enterprise.fyde.com/), [Verme](../saas-apps/verme-tutorial.md), [Lenses.io](../saas-apps/lensesio-tutorial.md), [Momenta](../saas-apps/momenta-tutorial.md), [Uprise](https://app.uprise.co/sign-in), [Q](https://q.moduleq.com/login), [CloudCords](../saas-apps/cloudcords-tutorial.md), [TellMe Bot](https://tellme365liteweb.azurewebsites.net/), [Inspire](https://app.inspiresoftware.com/), [Maverics Identity Orchestrator SAML Connector](https://www.strata.io/identity-fabric/), [Smartschool (School Management System)](https://smartschoolz.com/login), [Zepto - Intelligent timekeeping](https://user.zepto-ai.com/signin), [Studi.ly](https://studi.ly/), [Trackplan](http://www.trackplanfm.com/), [Skedda](../saas-apps/skedda-tutorial.md), [WhosOnLocation](../saas-apps/whos-on-location-tutorial.md), [Coggle](../saas-apps/coggle-tutorial.md), [Kemp LoadMaster](https://kemptechnologies.com/cloud-load-balancer/), [BrowserStack Single Sign-on](../saas-apps/browserstack-single-sign-on-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial

For listing your application in the Azure AD app gallery, please read the details here https://aka.ms/AzureADAppRequest

---

### View role assignments across all scopes and ability to download them to a csv file

**Type:** Changed feature  
**Service category:** Azure AD roles  
**Product capability:** Access Control
 
You can now view role assignments across all scopes for a role in the "Roles and administrators" tab in the Azure AD portal. You can also download those role assignments for each role into a CSV file. For guidance on viewing and adding role assignments, see [View and assign administrator roles in Azure Active Directory](../roles/manage-roles-portal.md).
 
---

### Azure Multi-Factor Authentication Software Development (Azure MFA SDK) Deprecation

**Type:** Deprecated  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 
The Azure Multi-Factor Authentication Software Development (Azure MFA SDK) reached the end of life on November 14th, 2018, as first announced in November 2017. Microsoft will be shutting down the SDK service effective on September 30th, 2020. Any calls made to the SDK will fail.

If your organization is using the Azure MFA SDK, you need to migrate by September 30th, 2020:
- Azure MFA SDK for MIM:  If you use the SDK with MIM, you should migrate to Azure MFA Server and activate Privileged Access Management (PAM) following these [instructions](/microsoft-identity-manager/working-with-mfaserver-for-mim).   
- Azure MFA SDK for customized apps: Consider integrating your app into Azure AD and use Conditional Access to enforce MFA. To get started, review this [page](../manage-apps/plan-an-application-integration.md). 

---

## June 2020 

### User risk condition in Conditional Access policy

**Type:** Plan for change  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection
 

User risk support in Azure AD Conditional Access policy allows you to create multiple user risk-based policies. Different minimum user risk levels can be required for different users and apps. Based on user risk, you can create policies to block access, require multi-factor authentication, secure password change, or redirect to Microsoft Cloud App Security to enforce session policy, such as additional auditing.

The user risk condition requires Azure AD Premium P2 because it uses Azure Identity Protection, which is a P2 offering. for more information about conditional access, refer to [Azure AD Conditional Access documentation](../conditional-access/index.yml).

---

### SAML SSO now supports apps that require SPNameQualifier to be set when requested

**Type:** Fixed  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 
Some SAML applications require SPNameQualifier to be returned in the assertion subject when requested. Now Azure AD responds correctly when a SPNameQualifier is requested in the request NameID policy. This also works for SP initiated sign-in, and IdP initiated sign-in will follow.  To learn more about SAML protocol in Azure Active Directory, see [Single Sign-On SAML protocol](../develop/single-sign-on-saml-protocol.md).

---

### Azure AD B2B Collaboration supports inviting MSA and Google users in Azure Government tenants

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 

Azure Government tenants using the B2B collaboration features can now invite users that have a Microsoft or Google account. To find out if your tenant can use these capabilities, follow the instructions at [How can I tell if B2B collaboration is available in my Azure US Government tenant?](../external-identities/current-limitations.md#how-can-i-tell-if-b2b-collaboration-is-available-in-my-azure-us-government-tenant)

 
---
 
### User object in MS Graph v1 now includes externalUserState and externalUserStateChangedDateTime properties

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 

The externalUserState and externalUserStateChangedDateTime properties can be used to find invited B2B guests who have not accepted their invitations yet as well as build automation such as deleting users who haven't accepted their invitations after some number of days. These properties are now available in MS Graph v1. For guidance on using these properties, refer to [User resource type](/graph/api/resources/user).
 
---

### Manage authentication sessions in Azure AD Conditional Access is now generally available

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection
 
Authentication session management capabilities allow you to configure how often your users need to provide sign-in credentials and whether they need to provide credentials after closing and reopening browsers to offer more security and flexibility in your environment.
 
Additionally, authentication session management used to only apply to the First Factor Authentication on Azure AD joined, Hybrid Azure AD joined, and Azure AD registered devices. Now authentication session management will apply to MFA as well. For more information, see [Configure authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).

---

### New Federated Apps available in Azure AD Application gallery - June 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In June 2020 we have added the following 29 new applications in our App gallery with Federation support:

[Shopify Plus](../saas-apps/shopify-plus-tutorial.md), [Ekarda](../saas-apps/ekarda-tutorial.md), [MailGates](../saas-apps/mailgates-tutorial.md), [BullseyeTDP](../saas-apps/bullseyetdp-tutorial.md), [Raketa](../saas-apps/raketa-tutorial.md), [Segment](../saas-apps/segment-tutorial.md), [Ai Auditor](https://www.mindbridge.ai/products/ai-auditor/), [Pobuca Connect](https://app.pobu.ca/), [Proto.io](../saas-apps/proto.io-tutorial.md), [Gatekeeper](https://www.gatekeeperhq.com/), [Hub Planner](../saas-apps/hub-planner-tutorial.md), [Ansira-Partner Go-to-Market Toolbox](https://ansira.com/technology/channel-engagement), [IBM Digital Business Automation on Cloud](../saas-apps/ibm-digital-business-automation-on-cloud-tutorial.md), [Kisi Physical Security](../saas-apps/kisi-physical-security-tutorial.md), [ViewpointOne](https://team.viewpoint.com/), [IntelligenceBank](../saas-apps/intelligencebank-tutorial.md), [pymetrics](../saas-apps/pymetrics-tutorial.md), [Zero](https://www.teamzero.com/), [InStation](https://instation.invillia.com/), [edX for Business SAML 2.0 Integration](../saas-apps/edx-for-business-saml-integration-tutorial.md), [MOOC Office 365](https://mooc.office365-training.com/en/), [SmartKargo](../saas-apps/smartkargo-tutorial.md), [PKIsigning platform](https://platform.pkisigning.nl/), [SiteIntel](../saas-apps/siteintel-tutorial.md), [Field iD](../saas-apps/field-id-tutorial.md), [Curricula SAML](../saas-apps/curricula-saml-tutorial.md), [Perforce Helix Core - Helix Authentication Service](../saas-apps/perforce-helix-core-tutorial.md), [MyCompliance Cloud](https://cloud.metacompliance.com/), [Smallstep SSH](https://smallstep.com/sso-ssh/)  

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial. 
For listing your application in the Azure AD app gallery, please read the details here: https://aka.ms/AzureADAppRequest.

---

### API connectors for External Identities self-service sign-up are now in public preview

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
External Identities API connectors enable you to leverage web APIs to integrate self-service sign-up with external cloud systems. This means you can now invoke web APIs as specific steps in a sign-up flow to trigger cloud-based custom workflows. For example, you can use API connectors to:

- Integrate with a custom approval workflows.
- Perform identity proofing
- Validate user input data
- Overwrite user attributes
- Run custom business logic

For more information about all of the experiences possible with API connectors, see [Use API connectors to customize and extend self-service sign-up](../external-identities/api-connectors-overview.md), or [Customize External Identities self-service sign-up with web API integrations](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/customize-external-identities-self-service-sign-up-with-web-api/ba-p/1257364#.XvNz2fImuQg.linkedin).
 
---

### Provision on-demand and get users into your apps in seconds

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
The Azure AD provisioning service currently operates on a cyclic basis. The service runs every 40 mins. The [on-demand provisioning capability](https://aka.ms/provisionondemand) allows you to pick a user and provision them in seconds. This capability allows you to quickly troubleshoot provisioning issues, without having to do a restart to force the provisioning cycle to start again. 
 
---

### New permission for using Azure AD entitlement management in Graph

**Type:** New feature  
**Service category:** Other  
**Product capability:** Entitlement Management
 
A new delegated permission EntitlementManagement.Read.All is now available for use with the Entitlement Management API in Microsoft Graph beta. To find out more about the available APIs, see [Working with the Azure AD entitlement management API](/graph/api/resources/entitlementmanagement-root?view=graph-rest-beta&preserve-view=true).

---

### Identity Protection APIs available in v1.0

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 
The riskyUsers and riskDetections Microsoft Graph APIs are now generally available. Now that they are available at the v1.0 endpoint, we invite you to use them in production. For more information, please check out the [Microsoft Graph docs](/graph/api/resources/identityprotectionroot).
 
---

### Sensitivity labels to apply policies to Microsoft 365 groups is now generally available

**Type:** New feature  
**Service category:** Group Management  
**Product capability:** Collaboration
 

You can now create sensitivity labels and use the label settings to apply policies to Microsoft 365 groups, including privacy (Public or Private) and external user access policy. You can create a label with the privacy policy to be Private, and external user access policy to not allow to add guest users. When a user applies this label to a group, the group will be private, and no guest users are allowed to be added to the group. 

Sensitivity labels are important to protect your business-critical data and enable you to manage groups at scale, in a compliant and secure fashion. For guidance on using sensitivity labels, refer to [Assign sensitivity labels to Microsoft 365 groups in Azure Active Directory (preview)](../enterprise-users/groups-assign-sensitivity-labels.md).
 
---

### Updates to support for Microsoft Identity Manager for Azure AD Premium customers

**Type:** Changed feature  
**Service category:** Microsoft Identity Manager  
**Product capability:** Identity Lifecycle Management
 
Azure Support is now available for Azure AD integration components of Microsoft Identity Manager 2016, through the end of Extended Support for Microsoft Identity Manager 2016. Read more at [Support update for Azure AD Premium customers using Microsoft Identity Manager](/microsoft-identity-manager/support-update-for-azure-active-directory-premium-customers).

---

### The use of group membership conditions in SSO claims configuration is increased

**Type:** Changed feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 
Previously, the number of groups you could use when you conditionally change claims based on group membership within any single application configuration was limited to 10. The use of group membership conditions in SSO claims configuration has now increased to a maximum of 50 groups. For more information on how to configure claims, refer to [Enterprise Applications SSO claims configuration](../develop/active-directory-saml-claims-customization.md#emitting-claims-based-on-conditions). 

---

### Enabling basic formatting on the Sign In Page Text component in Company Branding.

**Type:** Changed feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
The Company Branding functionality on the Azure AD/Microsoft 365 login experience has been updated to allow the customer to add hyperlinks and simple formatting, including bold font, underline, and italics. For guidance on using this functionality, see [Add branding to your organization's Azure Active Directory sign-in page](./customize-branding.md).

---

### Provisioning performance improvements

**Type:** Changed feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
The provisioning service has been updated to reduce the time for an [incremental cycle](../app-provisioning/how-provisioning-works.md#incremental-cycles) to complete. This means that users and groups will be provisioned into their applications faster than they were previously. All new provisioning jobs created after 6/10/2020 will automatically benefit from the performance improvements. Any applications configured for provisioning before 6/10/2020 will need to restart once after 6/10/2020 to take advantage of the performance improvements. 

---

### Announcing the deprecation of ADAL and MS Graph Parity

**Type:** Deprecated  
**Service category:** N/A  
**Product capability:** Device Lifecycle Management

Now that Microsoft Authentication Libraries (MSAL) is available, we will no longer add new features to the Azure Active Directory Authentication Libraries (ADAL) and will end security patches on June 30th, 2022. For more information on how to migrate to MSAL, refer to [Migrate applications to Microsoft Authentication Library (MSAL)](../develop/msal-migration.md).

Additionally, we have finished the work to make all Azure AD Graph functionality available through MS Graph. So, Azure AD Graph APIs will receive only bugfix and security fixes through June 30th, 2022. For more information, see [Update your applications to use Microsoft Authentication Library and Microsoft Graph API](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/update-your-applications-to-use-microsoft-authentication-library/ba-p/1257363)
 
---
## May 2020

### Retirement of properties in signIns, riskyUsers, and riskDetections APIs

**Type:** Plan for change  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection

Currently, enumerated types are used to represent the riskType property in both the riskDetections API and riskyUserHistoryItem (in preview). Enumerated types are also used for the riskEventTypes property in the signIns API. Going forward we will represent these properties as strings. 

Customers should transition to the riskEventType property in the beta riskDetections and riskyUserHistoryItem API, and to riskEventTypes_v2 property in the beta signIns API by September 9th, 2020. At that date, we will be retiring the current riskType and riskEventTypes properties. For more information, refer to [Changes to risk event properties and Identity Protection APIs on Microsoft Graph](https://developer.microsoft.com/graph/blogs/changes-to-risk-event-properties-and-identity-protection-apis-on-microsoft-graph/).

--- 

### Deprecation of riskEventTypes property in signIns v1.0 API on Microsoft Graph

**Type:** Plan for change  
**Service category:** Reporting  
**Product capability:** Identity Security & Protection

Enumerated types will switch to string types when representing risk event properties in Microsoft Graph September 2020. In addition to impacting the preview APIs, this change will also impact the in-production signIns API.

We have introduced a new riskEventsTypes_v2 (string) property to the signIns v1.0 API. We will retire the current riskEventTypes (enum) property on June 11, 2022 in accordance with our Microsoft Graph deprecation policy. Customers should transition to the riskEventTypes_v2 property in the v1.0  signIns API by June 11, 2022. For more information, refer to [Deprecation of riskEventTypes property in signIns v1.0 API on Microsoft Graph](https://developer.microsoft.com/graph/blogs/deprecation-of-riskeventtypes-property-in-signins-v1-0-api-on-microsoft-graph//).

--- 

### Upcoming changes to MFA email notifications

**Type:** Plan for change  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 

We are making the following changes to the email notifications for cloud MFA:

E-mail notifications will be sent from the following address: azure-noreply@microsoft.com and msonlineservicesteam@microsoftonline.com. We're updating the content of fraud alert emails to better indicate the required steps to unblock uses.

---

### New self-service sign up for users in federated domains who can't access Microsoft Teams because they aren't synced to Azure Active Directory.

**Type:** Plan for change  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 

Currently, users who are in domains federated in Azure AD, but who are not synced into the tenant, can't access Teams. Starting at the end of June, this new capability will enable them to do so by extending the existing email verified sign up feature. This will allow users who can sign in to a federated IdP, but who don't yet have a user object in Azure ID, to have a user object created automatically and be authenticated for Teams. Their user object will be marked as "self-service sign up." This is an extension of the existing capability to do email verified self-sign up that users in managed domains can do and can be controlled using the same flag. This change will complete rolling out during the following two months. Watch for documentation updates [here](../enterprise-users/directory-self-service-signup.md).
 
---

### Upcoming fix: The OIDC discovery document for the Azure Government cloud is being updated to reference the correct Graph endpoints.

**Type:** Plan for change  
**Service category:** Sovereign Clouds  
**Product capability:** User Authentication
 
Starting in June, the OIDC discovery document [Microsoft identity platform and OpenID Connect protocol](../develop/v2-protocols-oidc.md) on the [Azure Government cloud](../develop/authentication-national-cloud.md) endpoint (login.microsoftonline.us), will begin to return the correct [National cloud graph](/graph/deployments) endpoint (https://graph.microsoft.us or https://dod-graph.microsoft.us), based on the tenant provided.  It currently provides the incorrect Graph endpoint (graph.microsoft.com) "msgraph_host" field.  

This bug fix will be rolled out gradually over approximately 2 months.  

---

### Azure Government users will no longer be able to sign in on login.microsoftonline.com

**Type:** Plan for Change  
**Service category:** Sovereign Clouds  
**Product capability:** User Authentication
 
On 1 June 2018, the official Azure Active Directory (Azure AD) Authority for Azure Government changed from https://login-us.microsoftonline.com to https://login.microsoftonline.us. If you own an application within an Azure Government tenant, you must update your application to sign users in on the .us endpoint.

Starting May 5th, Azure AD will begin enforcing the endpoint change, blocking Azure Government users from signing into apps hosted in Azure Government tenants using the public endpoint (microsoftonline.com). Impacted apps will begin seeing an error AADSTS900439 - USGClientNotSupportedOnPublicEndpoint. 

There will be a gradual rollout of this change with enforcement expected to be complete across all apps June 2020. For more details, please see the [Azure Government blog post](https://devblogs.microsoft.com/azuregov/azure-government-aad-authority-endpoint-update/).

---

### SAML Single Logout request now sends NameID in the correct format

**Type:** Fixed  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
When a user clicks on sign-out (e.g., in the MyApps portal), Azure AD sends a SAML Single Logout message to each app that is active in the user session and has a Logout URL configured. These messages contain a NameID in a persistent format.

If the original SAML sign-in token used a different format for NameID (e.g. email/UPN), then the SAML app cannot correlate the NameID in the logout message to an existing session (as the NameIDs used in both messages are different), which caused the logout message to be discarded by the SAML app and the user to stay logged in. This fix makes the sign-out message consistent with the NameID configured for the application.

---

### Hybrid Identity Administrator role is now available with Cloud Provisioning

**Type:** New feature  
**Service category:** Azure AD Cloud Provisioning  
**Product capability:** Identity Lifecycle Management
 
IT Admins can start using the new "Hybrid Admin" role as the least privileged role for setting up Azure AD Connect Cloud Provisioning. With this new role, you no longer have to use the Global Admin role to setup and configure Cloud Provisioning. [Learn more](../roles/delegate-by-task.md#connect).
 
---

### New Federated Apps available in Azure AD Application gallery - May 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In May 2020, we have added the following 36 new applications in our App gallery with Federation support:

[Moula](https://moula.com.au/pay/merchants), [Surveypal](https://www.surveypal.com/app), [Kbot365](https://www.konverso.ai/virtual-assistant-digital-workplace/), [TackleBox](http://www.tacklebox.app/), [Powell Teams](https://powell-software.com/en/powell-teams-en/), [Talentsoft Assistant](https://msteams.talent-soft.com/), [ASC Recording Insights](https://teams.asc-recording.app/product), [GO1](https://www.go1.com/), [B-Engaged](https://b-engaged.se/), [Competella Contact Center Workgroup](http://www.competella.com/), [Asite](http://www.asite.com/), [ImageSoft Identity](https://identity.imagesoftinc.com/), [My IBISWorld](https://identity.imagesoftinc.com/), [insuite](../saas-apps/insuite-tutorial.md), [Change Process Management](../saas-apps/change-process-management-tutorial.md), [Cyara CX Assurance Platform](../saas-apps/cyara-cx-assurance-platform-tutorial.md), [Smart Global Governance](../saas-apps/smart-global-governance-tutorial.md), [Prezi](../saas-apps/prezi-tutorial.md), [Mapbox](../saas-apps/mapbox-tutorial.md), [Datava Enterprise Service Platform](../saas-apps/datava-enterprise-service-platform-tutorial.md), [Whimsical](../saas-apps/whimsical-tutorial.md), [Trelica](../saas-apps/trelica-tutorial.md), [EasySSO for Confluence](../saas-apps/easysso-for-confluence-tutorial.md), [EasySSO for BitBucket](../saas-apps/easysso-for-bitbucket-tutorial.md), [EasySSO for Bamboo](../saas-apps/easysso-for-bamboo-tutorial.md), [Torii](../saas-apps/torii-tutorial.md), [Axiad Cloud](../saas-apps/axiad-cloud-tutorial.md), [Humanage](../saas-apps/humanage-tutorial.md), [ColorTokens ZTNA](../saas-apps/colortokens-ztna-tutorial.md), [CCH Tagetik](../saas-apps/cch-tagetik-tutorial.md), [ShareVault](../saas-apps/sharevault-tutorial.md), [Vyond](../saas-apps/vyond-tutorial.md), [TextExpander](../saas-apps/textexpander-tutorial.md), [Anyone Home CRM](../saas-apps/anyone-home-crm-tutorial.md), [askSpoke](../saas-apps/askspoke-tutorial.md), [ice Contact Center](../saas-apps/ice-contact-center-tutorial.md)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial.

For listing your application in the Azure AD app gallery, please read the details here https://aka.ms/AzureADAppRequest.

---

### Report-only mode for Conditional Access is now generally available

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection

[Report-only mode for Azure AD Conditional Access](../conditional-access/concept-conditional-access-report-only.md) lets you evaluate the result of a policy without enforcing access controls. You can test report-only policies across your organization and understand their impact before enabling them, making deployment safer and easier. Over the past few months, we’ve seen strong adoption of report-only mode—over 26M users are already in scope of a report-only policy. With the announcement today, new Azure AD Conditional Access policies will be created in report-only mode by default. This means you can monitor the impact of your policies from the moment they’re created. And for those of you who use the MS Graph APIs, you can [manage report-only policies programmatically](/graph/api/resources/conditionalaccesspolicy?view=graph-rest-beta&preserve-view=true) as well. 

---

### Self-service sign up for guest users

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
With External Identities in Azure AD, you can allow people outside your organization to access your apps and resources while letting them sign in using whatever identity they prefer. When sharing an application with external users, you might not always know in advance who will need access to the application. With [self-service sign-up](../external-identities/self-service-sign-up-overview.md), you can enable guest users to sign up and gain a guest account for your line of business (LOB) apps. The sign-up flow can be created and customized to support Azure AD and social identities. You can also collect additional information about the user during sign-up.

---

 ### Conditional Access Insights and Reporting workbook is generally available

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection

The [insights and reporting workbook](../conditional-access/howto-conditional-access-insights-reporting.md) gives admins a summary view of Azure AD Conditional Access in their tenant. With the capability to select an individual policy, admins can better understand what each policy does and monitor any changes in real time. The workbook streams data stored in Azure Monitor, which you can set up in a few minutes [following these instructions](../reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md). To make the dashboard more discoverable, we’ve moved it to the new insights and reporting tab within the Azure AD Conditional Access menu.

---

### Policy details blade for Conditional Access is in public preview

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection

The new [policy details blade](../conditional-access/troubleshoot-conditional-access.md) displays the assignments, conditions, and controls satisfied during conditional access policy evaluation. You can access the blade by selecting a row in the Conditional Access or Report-only tabs of the Sign-in details.

---

### New query capabilities for Directory Objects in Microsoft Graph are in Public Preview

**Type:** New feature  
**Service category:** MS Graph
**Product capability:** Developer Experience

New capabilities are being introduced for Microsoft Graph Directory Objects APIs, enabling Count, Search, Filter, and Sort operations. This will give developers the ability to quickly query our Directory Objects without workarounds such as in-memory filtering and sorting. Find out more in this [blog post](https://aka.ms/CountFilterMSGraphAAD).

We are currently in Public Preview, looking for feedback. Please send your comments with this [brief survey](https://aka.ms/MsGraphAADSurveyDocs).

---

### Configure SAML-based single sign-on using Microsoft Graph API (Beta)

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 
Support for creating and configuring an application from the Azure AD Gallery using MS Graph APIs in Beta is now available. 
If you need to set up SAML-based single sign-on for multiple instances of an application, save time by using the Microsoft Graph APIs to [automate the configuration of SAML-based single sign-on](/graph/application-saml-sso-configure-api).
 
---

### New provisioning connectors in the Azure AD Application Gallery - May 2020

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

* [8x8](../saas-apps/8x8-provisioning-tutorial.md)
* [Juno Journey](../saas-apps/juno-journey-provisioning-tutorial.md)
* [MediusFlow](../saas-apps/mediusflow-provisioning-tutorial.md)
* [New Relic by Organization](../saas-apps/new-relic-by-organization-provisioning-tutorial.md)
* [Oracle Cloud Infrastructure Console](../saas-apps/oracle-cloud-infrastructure-console-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### SAML Token Encryption is Generally Available

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 
[SAML token encryption](../manage-apps/howto-saml-token-encryption.md) allows applications to be configured to receive encrypted SAML assertions. The feature is now generally available in all clouds.
 
---

### Group name claims in application tokens is Generally Available

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO
 
The group claims issued in a token can now be limited to just those groups assigned to the application.  This is especially important when users are members of large numbers of groups and there was a risk of exceeding token size limits. With this new capability in place, the ability to [add group names to tokens](../hybrid/how-to-connect-fed-group-claims.md) is generally available.
 
---

### Workday Writeback now supports setting work phone number attributes

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
We have enhanced the Workday Writeback provisioning app to now support writeback of work phone number and mobile number attributes. In addition to email and username, you can now configure the Workday Writeback provisioning app to flow phone number values from Azure AD to Workday. For more details on how to configure phone number writeback, refer to the [Workday Writeback](../saas-apps/workday-writeback-tutorial.md) app tutorial. 

---

### Publisher Verification (preview)

**Type:** New feature  
**Service category:** Other  
**Product capability:** Developer Experience
 
Publisher verification (preview) helps admins and end users understand the authenticity of application developers integrating with the Microsoft identity platform. For details, refer to [Publisher verification (preview)](../develop/publisher-verification-overview.md).
 
---

### Authorization Code Flow for Single-page apps

**Type:** Changed feature
**Service category:** Authentication 
**Product capability:** Developer Experience

Because of modern browser [3rd party cookie restrictions such as Safari ITP](../develop/reference-third-party-cookies-spas.md), SPAs will have to use the authorization code flow rather than the implicit flow to maintain SSO; MSAL.js v 2.x will now support the authorization code flow. There as corresponding updates to the Azure portal so you can update your SPA to be type "spa" and use the auth code flow. For guidance, refer to [Quickstart: Sign in users and get an access token in a JavaScript SPA using the auth code flow](../develop/quickstart-v2-javascript-auth-code.md).

---

### Improved Filtering for Devices is in Public Preview

**Type:** Changed Feature   
**Service category:** Device Management
**Product capability:** Device Lifecycle Management
 
Previously, the only filters you could use were "Enabled" and "Activity date." Now, you can [filter your list of devices on more properties](../devices/device-management-azure-portal.md#device-list-filtering-preview), including OS type, join type, compliance, and more. These additions should simplify locating a particular device.

---

### The new App registrations experience for Azure AD B2C is now generally available

**Type:** Changed Feature   
**Service category:** B2C - Consumer Identity Management  
**Product capability:** Identity Lifecycle Management
 
The new App registrations experience for Azure AD B2C is now generally available. 

Previously, you had to manage your B2C consumer-facing applications separately from the rest of your apps using the legacy 'Applications' experience. That meant different app creation experiences across different places in Azure.

The new experience shows all B2C app registrations and Azure AD app registrations in one place and provides a consistent way to manage them. Whether you need to manage a customer-facing app or an app that has access to Microsoft Graph to programmatically manage Azure AD B2C resources, you only need to learn one way to do things.

You can reach the new experience by navigating the Azure AD B2C service and selecting the App registrations blade. The experience is also accessible from the Azure Active Directory service.

The Azure AD B2C App registrations experience is based on the general [App Registration experience](https://developer.microsoft.com/identity/blogs/new-app-registrations-experience-is-now-generally-available/) for Azure AD tenants but is tailored for Azure AD B2C. The legacy "Applications" experience will be deprecated in the future.

For more information, visit [The New app registration experience for Azure AD B2C](../../active-directory-b2c/app-registrations-training-guide.md).

---
## April 2020

### Combined security info registration experience is now generally available

**Type:** New feature

**Service category:** Authentications (Logins)

**Product capability:** Identity Security & Protection

The combined registration experience for Multi-Factor Authentication (MFA) and Self-Service Password Reset (SSPR) is now generally available. This new registration experience enables users to register for MFA and SSPR in a single, step-by-step process. When you deploy the new experience for your organization, users can register in less time and with fewer hassles. Check out the blog post [here](https://bit.ly/3etiRyQ).

---

### Continuous Access Evaluation

**Type:** New feature

**Service category:** Authentications (Logins)

**Product capability:** Identity Security & Protection

Continuous Access Evaluation is a new security feature that enables near real-time enforcement of policies on relying parties consuming Azure AD Access Tokens when events happen in Azure AD (such as user account deletion). We are rolling this feature out first for Teams and Outlook clients. For more details, please read our [blog](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/moving-towards-real-time-policy-and-security-enforcement/ba-p/1276933) and  [documentation](../conditional-access/concept-continuous-access-evaluation.md).

---

### SMS Sign-in: Firstline Workers can sign in to Azure AD-backed applications with their phone number and no password

**Type:** New feature

**Service category:** Authentications (Logins)

**Product capability:** User Authentication

Office is launching a series of mobile-first business apps that cater to non-traditional organizations, and to employees in large organizations that don’t use email as their primary communication method. These apps target frontline employees, deskless workers, field agents, or retail employees that may not get an email address from their employer, have access to a computer, or to IT. This project will let these employees sign in to business applications by entering a phone number and roundtripping a code. For more details, please see our [admin documentation](../authentication/howto-authentication-sms-signin.md) and [end user documentation](../user-help/sms-sign-in-explainer.md).

---

### Invite internal users to use B2B collaboration

**Type:** New feature

**Service category:** B2B

**Product capability:**

We're expanding B2B invitation capability to allow existing internal accounts to be invited to use B2B collaboration credentials going forward. This is done by passing the user object to the Invite API in addition to typical parameters like the invited email address. The user's object ID, UPN, group membership, app assignment, etc. remain intact, but going forward they'll use B2B to authenticate with their home tenant credentials rather than the internal credentials they used before the invitation. For details, see the [documentation](../external-identities/invite-internal-users.md).

---

### Report-only mode for Conditional Access is now generally available

**Type:** New feature

**Service category:** Conditional Access

**Product capability:** Identity Security & Protection

[Report-only mode for Azure AD Conditional Access](../conditional-access/concept-conditional-access-report-only.md) lets you evaluate the result of a policy without enforcing access controls. You can test report-only policies across your organization and understand their impact before enabling them, making deployment safer and easier. Over the past few months, we’ve seen strong adoption of report-only mode, with over 26M users already in scope of a report-only policy. With this announcement, new Azure AD Conditional Access policies will be created in report-only mode by default. This means you can monitor the impact of your policies from the moment they’re created. And for those of you who use the MS Graph APIs, you can also [manage report-only policies programmatically](/graph/api/resources/conditionalaccesspolicy?view=graph-rest-beta&preserve-view=true). 

---

### Conditional Access insights and reporting workbook is generally available

**Type:** New feature

**Service category:** Conditional Access

**Product capability:** Identity Security & Protection

The Conditional Access [insights and reporting workbook](../conditional-access/howto-conditional-access-insights-reporting.md) gives admins a summary view of Azure AD Conditional Access in their tenant. With the capability to select an individual policy, admins can better understand what each policy does and monitor any changes in real time. The workbook streams data stored in Azure Monitor, which you can set up in a few minutes [following these instructions](../reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md). To make the dashboard more discoverable, we’ve moved it to the new insights and reporting tab within the Azure AD Conditional Access menu.

---

### Policy details blade for Conditional Access is in public preview

**Type:** New feature

**Service category:** Conditional Access

**Product capability:** Identity Security & Protection

The new [policy details blade](../conditional-access/troubleshoot-conditional-access.md) displays which assignments, conditions, and controls were satisfied during conditional access policy evaluation. You can access the blade by selecting a row in the **Conditional Access** or **Report-only** tabs of the Sign-in details.

---

### New Federated Apps available in Azure AD App gallery - April 2020

**Type:** New feature

**Service category:** Enterprise Apps

**Product capability:** 3rd Party Integration

In April 2020, we've added these 31 new apps with Federation support to the app gallery: 

[SincroPool Apps](https://www.sincropool.com/), [SmartDB](https://hibiki.dreamarts.co.jp/smartdb/trial/), [Float](../saas-apps/float-tutorial.md), [LMS365](https://lms.365.systems/), [IWT Procurement Suite](../saas-apps/iwt-procurement-suite-tutorial.md), [Lunni](https://lunni.fi/), [EasySSO for Jira](../saas-apps/easysso-for-jira-tutorial.md), [Virtual Training Academy](https://vta.c3p.ca/app/en/openid?authenticate_with=microsoft), [Meraki Dashboard](../saas-apps/meraki-dashboard-tutorial.md), [Microsoft 365 Mover](https://app.mover.io/login), [Speaker Engage](https://speakerengage.com/login.php), [Honestly](../saas-apps/honestly-tutorial.md), [Ally](../saas-apps/ally-tutorial.md), [DutyFlow](https://app.dutyflow.nl/), [AlertMedia](../saas-apps/alertmedia-tutorial.md), [gr8 People](../saas-apps/gr8-people-tutorial.md), [Pendo](../saas-apps/pendo-tutorial.md), [HighGround](../saas-apps/highground-tutorial.md), [Harmony](../saas-apps/harmony-tutorial.md), [Timetabling Solutions](../saas-apps/timetabling-solutions-tutorial.md), [SynchroNet CLICK](../saas-apps/synchronet-click-tutorial.md), [empower](https://www.made-in-office.com/en/), [Fortes Change Cloud](../saas-apps/fortes-change-cloud-tutorial.md), [Litmus](../saas-apps/litmus-tutorial.md), [GroupTalk](https://recorder.grouptalk.com/), [Frontify](../saas-apps/frontify-tutorial.md), [MongoDB Cloud](../saas-apps/mongodb-cloud-tutorial.md), [TickitLMS Learn](../saas-apps/tickitlms-learn-tutorial.md), [COCO](https://hexaware.com/partnerships-and-alliances/digital-transformation-using-microsoft-azure/), [Nitro Productivity Suite](../saas-apps/nitro-productivity-suite-tutorial.md), [Trend Micro Web Security(TMWS)](../saas-apps/trend-micro-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Microsoft Graph delta query support for oAuth2PermissionGrant available for Public Preview

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience

Delta query for oAuth2PermissionGrant is available for public preview! You can now track changes without having to continuously poll Microsoft Graph. [Learn more.](/graph/api/oAuth2PermissionGrant-delta?tabs=http&view=graph-rest-beta&preserve-view=true)

---

### Microsoft Graph delta query support for organizational contact generally available

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience

Delta query for organizational contacts is generally available! You can now track changes in production apps without having to continuously poll Microsoft Graph. Replace any existing code that continuously polls orgContact data by delta query to significantly improve performance. [Learn more.](/graph/api/orgcontact-delta?tabs=http)

---

### Microsoft Graph delta query support for application generally available

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience

Delta query for applications is generally available! You can now track changes in production apps without having to continuously poll Microsoft Graph. Replace any existing code that continuously polls application data by delta query to significantly improve performance. [Learn more.](/graph/api/application-delta)

---

### Microsoft Graph delta query support for administrative units available for Public Preview

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience
Delta query for administrative units is available for public preview! You can now track changes without having to continuously poll Microsoft Graph. [Learn more.](/graph/api/administrativeunit-delta?tabs=http&view=graph-rest-beta&preserve-view=true)

---

### Manage authentication phone numbers and more in new Microsoft Graph beta APIs

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience

These APIs are a key tool for managing your users’ authentication methods. Now you can programmatically pre-register and manage the authenticators used for MFA and self-service password reset (SSPR). This has been one of the most-requested features in the Azure AD MFA, SSPR, and Microsoft Graph spaces. The new APIs we’ve released in this wave give you the ability to:

- Read, add, update, and remove a user’s authentication phones
- Reset a user’s password
- Turn on and off SMS-sign-in

For more information, see [Azure AD authentication methods API overview](/graph/api/resources/authenticationmethods-overview?view=graph-rest-beta&preserve-view=true).

---

### Administrative Units Public Preview

**Type:** New feature

**Service category:** Azure AD roles

**Product capability:** Access Control

Administrative units allow you to grant admin permissions that are restricted to a department, region, or other segment of your organization that you define. You can use administrative units to delegate permissions to regional administrators or to set policy at a granular level. For example, a User account admin could update profile information, reset passwords, and assign licenses for users only in their administrative unit.

Using administrative units, a central administrator could:

- Create an administrative unit for decentralized management of resources
- Assign a role with administrative permissions over only Azure AD users in an administrative unit
- Populate the administrative units with users and groups as needed

For more information, see [Administrative units management in Azure Active Directory (preview)](../roles/administrative-units.md).

---

### Printer Administrator and Printer Technician built-in roles

**Type:** New feature

**Service category:** Azure AD roles

**Product capability:** Access Control

**Printer Administrator**: Users with this role can register printers and manage all aspects of all printer configurations in the Microsoft Universal Print solution, including the Universal Print Connector settings. They can consent to all delegated print permission requests. Printer Administrators also have access to print reports. 

**Printer Technician**: Users with this role can register printers and manage printer status in the Microsoft Universal Print solution. They can also read all connector information. Key tasks a Printer Technician cannot do are set user permissions on printers and sharing printers. [Learn more.](../roles/permissions-reference.md#printer-administrator)

---

### Hybrid Identity Admin built-in role

**Type:** New feature

**Service category:** Azure AD roles

**Product capability:** Access Control

Users in this role can enable, configure and manage services and settings related to enabling hybrid identity in Azure AD. This role grants the ability to configure Azure AD to one of the three supported authentication methods&#8212;Password hash synchronization (PHS), Pass-through authentication (PTA) or Federation (AD FS or 3rd party federation provider)&#8212;and to deploy related on-premises infrastructure to enable them. On-premises infrastructure includes Provisioning and PTA agents. This role grants the ability to enable Seamless Single Sign-On (S-SSO) to enable seamless authentication on non-Windows 10 devices or non-Windows Server 2016 computers. In addition, this role grants the ability to see sign-in logs and to access health and analytics for monitoring and troubleshooting purposes. [Learn more.](../roles/permissions-reference.md#hybrid-identity-administrator)

---

### Network Administrator built-in role

**Type:** New feature

**Service category:** Azure AD roles

**Product capability:** Access Control

Users with this role can review network perimeter architecture recommendations from Microsoft that are based on network telemetry from their user locations. Network performance for Microsoft 365 relies on careful enterprise customer network perimeter architecture, which is generally user location-specific. This role allows for editing of discovered user locations and configuration of network parameters for those locations to facilitate improved telemetry measurements and design recommendations. [Learn more.](../roles/permissions-reference.md#network-administrator)

---

### Bulk activity and downloads in the Azure AD admin portal experience

**Type:** New feature

**Service category:** User Management

**Product capability:** Directory

Now you can perform bulk activities on users and groups in Azure AD by uploading a CSV file in the Azure AD admin portal experience. You can create users, delete users, and invite guest users. And you can add and remove members from a group.

You can also download lists of Azure AD resources from the Azure AD admin portal experience. You can download the list of users in the directory, the list of groups in the directory, and the members of a particular group.

For more information, check out the following:

- [Create users](../enterprise-users/users-bulk-add.md) or [invite guest users](../external-identities/tutorial-bulk-invite.md)
- [Delete users](../enterprise-users/users-bulk-delete.md) or [restore deleted users](../enterprise-users/users-bulk-restore.md)
- [Download list of users](../enterprise-users/users-bulk-download.md) or [Download list of groups](../enterprise-users/groups-bulk-download.md)
- [Add (import) members](../enterprise-users/groups-bulk-import-members.md) or [remove members](../enterprise-users/groups-bulk-remove-members.md) or [Download list of members](../enterprise-users/groups-bulk-download-members.md) for a group

---

### My Staff delegated user management

**Type:** New feature

**Service category:** User Management

**Product capability:**

My Staff enables Firstline Managers, such as a store manager, to ensure that their staff members are able to access their Azure AD accounts. Instead of relying on a central helpdesk, organizations can delegate common tasks, such as resetting passwords or changing phone numbers, to a Firstline Manager. With My Staff, a user who can’t access their account can re-gain access in just a couple of clicks, with no helpdesk or IT staff required. For more information, see the [Manage your users with My Staff (preview)](../roles/my-staff-configure.md) and [Delegate user management with My Staff (preview)](../user-help/my-staff-team-manager.md).

---

### An upgraded end user experience in access reviews

**Type:** Changed feature

**Service category:** Access Reviews

**Product capability:** Identity Governance

We have updated the reviewer experience for Azure AD access reviews in the My Apps portal. At the end of April, your reviewers who are logged in to the Azure AD access reviews reviewer experience will see a banner that will allow them to try the updated experience in My Access. Please note that the updated Access reviews experience offers the same functionality as the current experience, but with an improved user interface on top of new capabilities to enable your users to be productive. [You can learn more about the updated experience here](../governance/perform-access-review.md). This public preview will last until the end of July 2020. At the end of July, reviewers who have not opted into the preview experience will be automatically directed to My Access to perform access reviews. If you wish to have your reviewers permanently switched over to the preview experience in My Access now, [please make a request here](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR5dv-S62099HtxdeKIcgO-NUOFJaRDFDWUpHRk8zQ1BWVU1MMTcyQ1FFUi4u).

---

### Workday inbound user provisioning and writeback apps now support the latest versions of Workday Web Services API

**Type:** Changed feature

**Service category:** App Provisioning

**Product capability:** 

Based on customer feedback, we have now updated the Workday inbound user provisioning and writeback apps in the enterprise app gallery to support the latest versions of the Workday Web Services (WWS) API. With this change, customers can specify the WWS API version that they would like to use in the connection string. This gives customers the ability to retrieve more HR attributes available in the releases of Workday. The Workday Writeback app now uses the recommended Change_Work_Contact_Info Workday web service to overcome the limitations of Maintain_Contact_Info.

If no version is specified in the connection string, by default, the Workday inbound provisioning apps will continue to use WWS v21.1  To switch to the latest Workday APIs for inbound user provisioning, customers need to update the connection string as documented [in the tutorial](../saas-apps/workday-inbound-tutorial.md#which-workday-apis-does-the-solution-use-to-query-and-update-workday-worker-profiles) and also update the XPATHs used for Workday attributes as documented in the [Workday attribute reference guide](../app-provisioning/workday-attribute-reference.md#xpath-values-for-workday-web-services-wws-api-v30). 

To use the new API for writeback, there are no changes required in the Workday Writeback provisioning app. On the Workday side, ensure that the Workday Integration System User (ISU) account has permissions to invoke the Change_Work_Contact business process as documented in the tutorial section, [Configure business process security policy permissions](../saas-apps/workday-inbound-tutorial.md#configuring-business-process-security-policy-permissions). 

We have updated our [tutorial guide](../saas-apps/workday-inbound-tutorial.md) to reflect the new API version support.

---

### Users with default access role are now in scope for provisioning

**Type:** Changed feature

**Service category:** App Provisioning

**Product capability:** Identity Lifecycle Management

Historically, users with the default access role have been out of scope for provisioning. We've heard feedback that customers want users with this role to be in scope for provisioning. As of April 16, 2020, all new provisioning configurations allow users with the default access role to be provisioned. Gradually we will change the behavior for existing provisioning configurations to support provisioning users with this role. [Learn more.](../app-provisioning/application-provisioning-config-problem-no-users-provisioned.md)

---

### Updated provisioning UI

**Type:** Changed feature

**Service category:** App Provisioning

**Product capability:** Identity Lifecycle Management

We've refreshed our provisioning experience to create a more focused management view. When you navigate to the provisioning blade for an enterprise application that has already been configured, you'll be able to easily monitor the progress of provisioning and manage actions such as starting, stopping, and restarting provisioning. [Learn more.](../app-provisioning/configure-automatic-user-provisioning-portal.md)

---

### Dynamic Group rule validation is now available for Public Preview

**Type:** Changed feature

**Service category:** Group Management

**Product capability:** Collaboration

Azure Active Directory (Azure AD) now provides the means to validate dynamic group rules. On the **Validate rules** tab, you can validate your dynamic rule against sample group members to confirm the rule is working as expected. When creating or updating dynamic group rules, administrators want to know whether a user or a device will be a member of the group. This helps evaluate whether a user or device meets the rule criteria and aids in troubleshooting when membership is not expected.

For more information, see [Validate a dynamic group membership rule (preview)](../enterprise-users/groups-dynamic-rule-validation.md).

---

### Identity Secure Score - Security Defaults and MFA improvement action updates

**Type:** Changed feature

**Service category:** N/A

**Product capability:** Identity Security & Protection

**Supporting security defaults for Azure AD improvement actions:** Microsoft Secure Score will be updating improvement actions to support [security defaults in Azure AD](./concept-fundamentals-security-defaults.md), which make it easier to help protect your organization with pre-configured security settings for common attacks. This will affect the following improvement actions:

- Ensure all users can complete multi-factor authentication for secure access
- Require MFA for administrative roles
- Enable policy to block legacy authentication
 
**MFA improvement action updates:** To reflect the need for businesses to ensure the upmost security while applying policies that work with their business, Microsoft Secure Score has removed three improvement actions centered around multi-factor authentication and added two.

Removed improvement actions:

- Register all users for multi-factor authentication
- Require MFA for all users
- Require MFA for Azure AD privileged roles

Added improvement actions:

- Ensure all users can complete multi-factor authentication for secure access
- Require MFA for administrative roles

These new improvement actions require registering your users or admins for multi-factor authentication (MFA) across your directory and establishing the right set of policies that fit your organizational needs. The main goal is to have flexibility while ensuring all your users and admins can authenticate with multiple factors or risk-based identity verification prompts. That can take the form of having multiple policies that apply scoped decisions, or setting security defaults (as of March 16th) that let Microsoft decide when to challenge users for MFA. [Read more about what's new in Microsoft Secure Score](/microsoft-365/security/mtp/microsoft-secure-score#whats-new).

---

## March 2020

### Unmanaged Azure Active Directory accounts in B2B update for March  2021

**Type:** Plan for change  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
**Beginning on March 31, 2021**, Microsoft will no longer support the redemption of invitations by creating unmanaged Azure Active Directory (Azure AD) accounts and tenants for B2B collaboration scenarios. In preparation for this, we encourage you to opt in to [email one-time passcode authentication](../external-identities/one-time-passcode.md).

---

### Users with the default access role will be in scope for provisioning

**Type:** Plan for change  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
Historically, users with the default access role have been out of scope for provisioning. We've heard feedback that customers want users with this role to be in scope for provisioning. We're working on deploying a change so that all new provisioning configurations will allow users with the default access role to be provisioned. Gradually, we'll change the behavior for existing provisioning configurations to support provisioning users with this role. No customer action is required. We'll post an update to our [documentation](../app-provisioning/application-provisioning-config-problem-no-users-provisioned.md) once this change is in place.

---

### Azure AD B2B collaboration will be available in Microsoft Azure operated by 21Vianet (Azure China 21Vianet) tenants

**Type:** Plan for change  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
The Azure AD B2B collaboration capabilities will be made available in Microsoft Azure operated by 21Vianet (Azure China 21Vianet) tenants, enabling users in an Azure China 21Vianet tenant to collaborate seamlessly with users in other Azure China 21Vianet tenants. [Learn more about Azure AD B2B collaboration](/azure/active-directory/b2b/).

---
 
### Azure AD B2B Collaboration invitation email redesign

**Type:** Plan for change  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
The [emails](../external-identities/invitation-email-elements.md) that are sent by the Azure AD B2B collaboration invitation service to invite users to the directory will be redesigned to make the invitation information and the user's next steps clearer.

---

### HomeRealmDiscovery policy changes will appear in the audit logs

**Type:** Fixed  
**Service category:** Audit  
**Product capability:** Monitoring & Reporting
 
We fixed a bug where changes to the [HomeRealmDiscovery policy](../manage-apps/configure-authentication-for-federated-users-portal.md) were not included in the audit logs. You will now be able to see when and how the policy was changed, and by whom. 

---

### New Federated Apps available in Azure AD App gallery - March 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In March 2020, we've added these 51 new apps with Federation support to the app gallery: 

[Cisco AnyConnect](../saas-apps/cisco-anyconnect.md), [Zoho One China](../saas-apps/zoho-one-china-tutorial.md), [PlusPlus](https://test.plusplus.app/auth/login/azuread-outlook/), [Profit.co SAML App](../saas-apps/profitco-saml-app-tutorial.md), [iPoint Service Provider](../saas-apps/ipoint-service-provider-tutorial.md), [contexxt.ai SPHERE](https://contexxt-sphere.com/login), [Wisdom By Invictus](../saas-apps/wisdom-by-invictus-tutorial.md), [Flare Digital Signage](https://spark-dev.pixelnebula.com/login), [Logz.io - Cloud Observability for Engineers](../saas-apps/logzio-cloud-observability-for-engineers-tutorial.md), [SpectrumU](../saas-apps/spectrumu-tutorial.md), [BizzContact](https://bizzcontact.app/), [Elqano SSO](../saas-apps/elqano-sso-tutorial.md), [MarketSignShare](http://www.signshare.com/), [CrossKnowledge Learning Suite](../saas-apps/crossknowledge-learning-suite-tutorial.md), [Netvision Compas](../saas-apps/netvision-compas-tutorial.md), [FCM HUB](../saas-apps/fcm-hub-tutorial.md), [RIB A/S Byggeweb Mobile](https://apps.apple.com/us/app/docia/id529058757), [GoLinks](../saas-apps/golinks-tutorial.md), [Datadog](../saas-apps/datadog-tutorial.md), [Zscaler B2B User Portal](../saas-apps/zscaler-b2b-user-portal-tutorial.md), [LIFT](../saas-apps/lift-tutorial.md), [Planview Enterprise One](../saas-apps/planview-enterprise-one-tutorial.md), [WatchTeams](https://www.devfinition.com/), [Aster](https://demo.asterapp.io/login), [Skills Workflow](../saas-apps/skills-workflow-tutorial.md), [Node Insight](https://admin.nodeinsight.com/AADLogin.aspx), [IP Platform](../saas-apps/ip-platform-tutorial.md), [InVision](../saas-apps/invision-tutorial.md), [Pipedrive](../saas-apps/pipedrive-tutorial.md), [Showcase Workshop](https://app.showcaseworkshop.com/), [Greenlight Integration Platform](../saas-apps/greenlight-integration-platform-tutorial.md), [Greenlight Compliant Access Management](../saas-apps/greenlight-compliant-access-management-tutorial.md), [Grok Learning](../saas-apps/grok-learning-tutorial.md), [Miradore Online](https://login.online.miradore.com/), [Khoros Care](../saas-apps/khoros-care-tutorial.md), [AskYourTeam](../saas-apps/askyourteam-tutorial.md), [TruNarrative](../saas-apps/trunarrative-tutorial.md), [Smartwaiver](https://www.smartwaiver.com/m/user/sw_login.php?wms_login), [Bizagi Studio for Digital Process Automation](../saas-apps/bizagi-studio-for-digital-process-automation-tutorial.md), [insuiteX](https://www.insuite.jp/), [sybo](https://www.systexsoftware.com.tw/), [Britive](../saas-apps/britive-tutorial.md), [WhosOffice](../saas-apps/whosoffice-tutorial.md), [E-days](../saas-apps/e-days-tutorial.md), [Kollective SDN](https://portal.kollective.app/login), [Witivio](https://app.witivio.com/), [Playvox](https://my.playvox.com/login), [Korn Ferry 360](../saas-apps/korn-ferry-360-tutorial.md), [Campus Café](../saas-apps/campus-cafe-tutorial.md), [Catchpoint](../saas-apps/catchpoint-tutorial.md), [Code42](../saas-apps/code42-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Azure AD B2B Collaboration available in Azure Government tenants

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C
 
The Azure AD B2B collaboration features are now available between some Azure Government tenants.  To find out if your tenant is able to use these capabilities, follow the instructions at [How can I tell if B2B collaboration is available in my Azure US Government tenant?](../external-identities/current-limitations.md#how-can-i-tell-if-b2b-collaboration-is-available-in-my-azure-us-government-tenant).

---

### Azure Monitor integration for Azure Logs is now available in Azure Government

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
Azure Monitor integration with Azure AD logs is now available in Azure Government. You can route Azure AD Logs (Audit and Sign-in Logs) to a storage account, Event Hub and Log Analytics. Please check out the [detailed documentation](../reports-monitoring/concept-activity-logs-azure-monitor.md) as well as [deployment plans for reporting and monitoring](../reports-monitoring/plan-monitoring-and-reporting.md) for Azure AD scenarios.

---

### Identity Protection Refresh in Azure Government

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection

We’re excited to share that we have now rolled out the refreshed [Azure AD Identity Protection](../identity-protection/overview-identity-protection.md) experience in the [Microsoft Azure Government portal](https://portal.azure.us/). For more information, see our [announcement blog post](https://techcommunity.microsoft.com/t5/public-sector-blog/identity-protection-refresh-in-microsoft-azure-government/ba-p/1223667).

---

### Disaster recovery: Download and store your provisioning configuration

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management
 
The Azure AD provisioning service provides a rich set of configuration capabilities. Customers need to be able to save their configuration so that they can refer to it later or roll back to a known good version. We've added the ability to download your provisioning configuration as a JSON file and upload it when you need it. [Learn more](../app-provisioning/export-import-provisioning-configuration.md).

---
 
### SSPR (self-service password reset) now requires two gates for admins in Microsoft Azure operated by 21Vianet (Azure China 21Vianet) 

**Type:** Changed feature  
**Service category:** Self-Service Password Reset  
**Product capability:** Identity Security & Protection
 
Previously in Microsoft Azure operated by 21Vianet (Azure China 21Vianet), admins using self-service password reset (SSPR) to reset their own passwords needed only one "gate" (challenge) to prove their identity. In public and other national clouds, admins generally must use two gates to prove their identity when using SSPR. But because we didn't support SMS or phone calls in Azure China 21Vianet, we allowed one-gate password reset by admins.

We're creating SSPR feature parity between Azure China 21Vianet and the public cloud. Going forward, admins must use two gates when using SSPR. SMS, phone calls, and Authenticator app notifications and codes will be supported. [Learn more](../authentication/concept-sspr-policy.md#administrator-reset-policy-differences).

---

### Password length is limited to 256 characters

**Type:** Changed feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
To ensure the reliability of the Azure AD service, user passwords are now limited in length to 256 characters. Users with passwords longer than this will be asked to change their password on subsequent login, either by contacting their admin or by using the self-service password reset feature.

This change was enabled on March 13th, 2020, at 10AM PST (18:00 UTC), and the error is AADSTS 50052, InvalidPasswordExceedsMaxLength. See the [breaking change notice](../develop/reference-breaking-changes.md#user-passwords-will-be-restricted-to-256-characters) for more details.

---

### Azure AD sign-in logs are now available for all free tenants through the Azure portal

**Type:** Changed feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
Starting now, customers who have free tenants can access the [Azure AD sign-in logs from the Azure portal](../reports-monitoring/concept-sign-ins.md) for up to 7 days. Previously, sign-in logs were available only for customers with Azure Active Directory Premium licenses. With this change, all tenants can access these logs through the portal.

> [!NOTE]
> Customers still need a premium license (Azure Active Directory Premium P1 or P2) to access the sign-in logs through Microsoft Graph API and Azure Monitor.

---

### Deprecation of Directory-wide groups option from Groups General Settings on Azure portal

**Type:** Deprecated  
**Service category:** Group Management  
**Product capability:** Collaboration

To provide a more flexible way for customers to create directory-wide groups that best meet their needs, we've replaced the **Directory-wide Groups** option from the **Groups** > **General** settings in the Azure portal with a link to [dynamic group documentation](../enterprise-users/groups-dynamic-membership.md). We've improved our documentation to include more instructions so administrators can create all-user groups that include or exclude guest users.

---

## February 2020

### Upcoming changes to custom controls

**Type:** Plan for change  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 
We're planning to replace the current custom controls preview with an approach that allows partner-provided authentication capabilities to work seamlessly with the Azure Active Directory administrator and end user experiences. Today, partner MFA solutions face the following limitations: they work only after a password has been entered; they don't serve as MFA for step-up authentication in other key scenarios; and they don't integrate with end user or administrative credential management functions. The new implementation will allow partner-provided authentication factors to work alongside built-in factors for key scenarios, including registration, usage, MFA claims, step up authentication, reporting, and logging. 

Custom controls will continue to be supported in preview alongside the new design until it reaches general availability. At that point, we'll give customers time to migrate to the new design. Because of the limitations of the current approach, we won't onboard new providers until the new design is available. We are working closely with customers and providers and will communicate the timeline as we get closer. [Learn more](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/upcoming-changes-to-custom-controls/ba-p/1144696#).

---

### Identity Secure Score - MFA improvement action updates

**Type:** Plan for change  
**Service category:** MFA  
**Product capability:** Identity Security & Protection
 
To reflect the need for businesses to ensure the upmost security while applying policies that work with their business, Microsoft Secure Score is removing three improvement actions centered around multi-factor authentication (MFA), and adding two.

The following improvement actions will be removed:

- Register all users for MFA
- Require MFA for all users
- Require MFA for Azure AD privileged roles

The following improvement actions will be added:

- Ensure all users can complete MFA for secure access
- Require MFA for administrative roles

These new improvement actions will require registering your users or admins for MFA across your directory and establishing the right set of policies that fit your organizational needs. The main goal is to have flexibility while ensuring all your users and admins can authenticate with multiple factors or risk-based identity verification prompts. This can take the form of setting security defaults that let Microsoft decide when to challenge users for MFA, or having multiple policies that apply scoped decisions. As part of these improvement action updates, Baseline protection policies will no longer be included in scoring calculations. [Read more about what's coming in Microsoft Secure Score](/microsoft-365/security/mtp/microsoft-secure-score-whats-coming).

---

### Azure AD Domain Services SKU selection

**Type:** New feature  
**Service category:** Azure AD Domain Services  
**Product capability:** Azure AD Domain Services
 
We've heard feedback that Azure AD Domain Services customers want more flexibility in selecting performance levels for their instances. Starting on February 1, 2020, we switched from a dynamic model (where Azure AD determines the performance and pricing tier based on object count) to a self-selection model. Now customers can choose a performance tier that matches their environment. This change also allows us to enable new scenarios like Resource Forests, and Premium features like daily backups. The object count is now unlimited for all SKUs, but we'll continue to offer object count suggestions for each tier.

**No immediate customer action is required.** For existing customers, the dynamic tier that was in use on February 1, 2020, determines the new default tier. There is no pricing or performance impact as the result of this change. Going forward, Azure AD DS customers will need to evaluate performance requirements as their directory size and workload characteristics change. Switching between service tiers will continue to be a no-downtime operation, and we will no longer automatically move customers to new tiers based on the growth of their directory. Furthermore, there will be no price increases, and new pricing will align with our current billing model. For more information, see the [Azure AD DS SKUs documentation](../../active-directory-domain-services/administration-concepts.md#azure-ad-ds-skus) and the [Azure AD Domain Services pricing page](https://azure.microsoft.com/pricing/details/active-directory-ds/).

---
 
### New Federated Apps available in Azure AD App gallery - February 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In February 2020, we've added these 31 new apps with Federation support to the app gallery: 

[IamIP Patent Platform](../saas-apps/iamip-patent-platform-tutorial.md),
 [Experience Cloud](../saas-apps/experience-cloud-tutorial.md),
 [NS1 SSO For Azure](../saas-apps/ns1-sso-azure-tutorial.md),
 [Barracuda Email Security Service](https://ess.barracudanetworks.com/sso/azure),
 [ABa Reporting](https://myaba.co.uk/client-access/signin/auth/msad),
 [In Case of Crisis - Online Portal](../saas-apps/in-case-of-crisis-online-portal-tutorial.md),
 [BIC Cloud Design](../saas-apps/bic-cloud-design-tutorial.md),
 [Beekeeper Azure AD Data Connector](../saas-apps/beekeeper-azure-ad-data-connector-tutorial.md),
 [Korn Ferry Assessments](https://www.kornferry.com/solutions/kf-digital/kf-assess),
 [Verkada Command](../saas-apps/verkada-command-tutorial.md),
 [Splashtop](../saas-apps/splashtop-tutorial.md),
 [Syxsense](../saas-apps/syxsense-tutorial.md),
 [EAB Navigate](../saas-apps/eab-navigate-tutorial.md),
 [New Relic (Limited Release)](../saas-apps/new-relic-limited-release-tutorial.md),
 [Thulium](https://admin.thulium.com/login/instance),
 [Ticket Manager](../saas-apps/ticketmanager-tutorial.md),
 [Template Chooser for Teams](https://links.officeatwork.com/templatechooser-download-teams),
 [Beesy](https://www.beesy.me/index.php/site/login),
 [Health Support System](../saas-apps/health-support-system-tutorial.md),
 [MURAL](https://app.mural.co/signup),
 [Hive](../saas-apps/hive-tutorial.md),
 [LavaDo](https://appsource.microsoft.com/product/web-apps/lavaloon.lavado_standard?tab=Overview),
 [Wakelet](https://wakelet.com/login),
 [Firmex VDR](../saas-apps/firmex-vdr-tutorial.md),
 [ThingLink for Teachers and Schools](https://www.thinglink.com/),
 [Coda](../saas-apps/coda-tutorial.md),
 [NearpodApp](https://nearpod.com/signup/?oc=Microsoft&utm_campaign=Microsoft&utm_medium=site&utm_source=product),
 [WEDO](../saas-apps/wedo-tutorial.md),
 [InvitePeople](https://invitepeople.com/login),
 [Reprints Desk - Article Galaxy](../saas-apps/reprints-desk-article-galaxy-tutorial.md),
 [TeamViewer](../saas-apps/teamviewer-tutorial.md)

 
For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---
 
### New provisioning connectors in the Azure AD Application Gallery - February 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Mixpanel](../saas-apps/mixpanel-provisioning-tutorial.md)
- [TeamViewer](../saas-apps/teamviewer-provisioning-tutorial.md)
- [Azure Databricks](/azure/databricks/administration-guide/users-groups/scim/aad)
- [PureCloud by Genesys](../saas-apps/purecloud-by-genesys-provisioning-tutorial.md)
- [Zapier](../saas-apps/zapier-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---
 
### Azure AD support for FIDO2 security keys in hybrid environments

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
We're announcing the public preview of Azure AD support for FIDO2 security keys in Hybrid environments. Users can now use FIDO2 security keys to sign in to their Hybrid Azure AD joined Windows 10 devices and get seamless sign-on to their on-premises and cloud resources. Support for Hybrid environments has been the top most-requested feature from our passwordless customers since we initially launched the public preview for FIDO2 support in Azure AD joined devices. Passwordless authentication using advanced technologies like biometrics and public/private key cryptography provide convenience and ease-of-use while being secure. With this public preview, you can now use modern authentication like FIDO2 security keys to access traditional Active Directory resources. For more information, go to [SSO to on-premises resources](../authentication/howto-authentication-passwordless-security-key-on-premises.md). 

To get started, visit [enable FIDO2 security keys for your tenant](../authentication/howto-authentication-passwordless-security-key.md) for step-by-step instructions. 

---
 
### The new My Account experience is now generally available

**Type:** Changed feature  
**Service category:** My Profile/Account  
**Product capability:** End User Experiences
 
My Account, the one stop shop for all end-user account management needs, is now generally available! End users can access this new site via URL, or in the header of the new My Apps experience. Learn more about all the self-service capabilities the new experience offers at [My Account Portal Overview](../user-help/my-account-portal-overview.md).

---
 
### My Account site URL updating to myaccount.microsoft.com

**Type:** Changed feature  
**Service category:** My Profile/Account  
**Product capability:** End User Experiences
 
The new My Account end user experience will be updating its URL to `https://myaccount.microsoft.com` in the next month. Find more information about the experience and all the account self-service capabilities it offers to end users at [My Account portal help](../user-help/my-account-portal-overview.md).

---

## January 2020
 
### The new My Apps portal is now generally available

**Type:** Plan for change  
**Service category:** My Apps  
**Product capability:** End User Experiences
 
Upgrade your organization to the new My Apps portal that is now generally available! Find more information on the new portal and collections at [Create collections on the My Apps portal](../manage-apps/access-panel-collections.md).

---
 
### Workspaces in Azure AD have been renamed to collections

**Type:** Changed feature  
**Service category:** My Apps   
**Product capability:** End User Experiences
 
Workspaces, the filters admins can configure to organize their users' apps, will now be referred to as collections. Find more info on how to configure them at [Create collections on the My Apps portal](../manage-apps/access-panel-collections.md).

---
 
### Azure AD B2C Phone sign-up and sign-in using custom policy (Public Preview)

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
With phone number sign-up and sign-in, developers and enterprises can allow their customers to sign up and sign in using a one-time password sent to the user's phone number via SMS. This feature also lets the customer change their phone number if they lose access to their phone. With the power of custom policies and phone sign-up and sign-in, allows developers and enterprises to communicate their brand through page customization. Find out how to [set up phone sign-up and sign-in with custom policies in Azure AD B2C](../../active-directory-b2c/phone-authentication-user-flows.md).
 
---
 
### New provisioning connectors in the Azure AD Application Gallery - January 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Promapp]( ../saas-apps/promapp-provisioning-tutorial.md)
- [Zscaler Private Access](../saas-apps/zscaler-private-access-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---
 
### New Federated Apps available in Azure AD App gallery - January 2020

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In January 2020, we've added these 33 new apps with Federation support to the app gallery: 

[JOSA](../saas-apps/josa-tutorial.md), [Fastly Edge Cloud](../saas-apps/fastly-edge-cloud-tutorial.md), [Terraform Enterprise](../saas-apps/terraform-enterprise-tutorial.md), [Spintr SSO](../saas-apps/spintr-sso-tutorial.md), [Abibot Netlogistik](https://azuremarketplace.microsoft.com/marketplace/apps/aad.abibotnetlogistik), [SkyKick](https://login.skykick.com/login?state=g6Fo2SBTd3M5Q0xBT0JMd3luS2JUTGlYN3pYTE1remJQZnR1c6N0aWTZIDhCSkwzYVQxX2ZMZjNUaWxNUHhCSXg2OHJzbllTcmYto2NpZNkgM0h6czk3ZlF6aFNJV1VNVWQzMmpHeFFDbDRIMkx5VEc&client=3Hzs97fQzhSIWUMUd32jGxQCl4H2LyTG&protocol=oauth2&audience=https://papi.skykick.com&response_type=code&redirect_uri=https://portal.skykick.com/callback&scope=openid%20profile%20offline_access), [Upshotly](../saas-apps/upshotly-tutorial.md), [LeaveBot](https://appsource.microsoft.com/en-us/product/office/WA200001175), [DataCamp](../saas-apps/datacamp-tutorial.md), [TripActions](../saas-apps/tripactions-tutorial.md), [SmartWork](https://www.intumit.com/teams-smartwork/), [Dotcom-Monitor](../saas-apps/dotcom-monitor-tutorial.md), [SSOGEN - Azure AD SSO Gateway for Oracle E-Business Suite - EBS, PeopleSoft, and JDE](../saas-apps/ssogen-tutorial.md), [Hosted MyCirqa SSO](../saas-apps/hosted-mycirqa-sso-tutorial.md), [Yuhu Property Management Platform](../saas-apps/yuhu-property-management-platform-tutorial.md), [LumApps](https://sites.lumapps.com/login), [Upwork Enterprise](../saas-apps/upwork-enterprise-tutorial.md), [Talentsoft](../saas-apps/talentsoft-tutorial.md), [SmartDB for Microsoft Teams](http://teams.smartdb.jp/login/), [PressPage](../saas-apps/presspage-tutorial.md), [ContractSafe Saml2 SSO](../saas-apps/contractsafe-saml2-sso-tutorial.md), [Maxient Conduct Manager Software](../saas-apps/maxient-conduct-manager-software-tutorial.md), [Helpshift](../saas-apps/helpshift-tutorial.md), [PortalTalk 365](https://www.portaltalk.com/), [CoreView](https://portal.coreview.com/), Squelch Cloud Office365 Connector, [PingFlow Authentication](https://app-staging.pingview.io/), [ PrinterLogic SaaS](../saas-apps/printerlogic-saas-tutorial.md), [Taskize Connect](../saas-apps/taskize-connect-tutorial.md), [Sandwai](https://app.sandwai.com/), [EZRentOut](../saas-apps/ezrentout-tutorial.md), [AssetSonar](../saas-apps/assetsonar-tutorial.md), [Akari Virtual Assistant](https://akari.io/akari-virtual-assistant/)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Two new Identity Protection detections

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 
We've added two new sign-in linked detection types to Identity Protection: Suspicious inbox manipulation rules and Impossible travel. These offline detections are discovered by Microsoft Cloud App Security (MCAS) and influence the user and sign-in risk in Identity Protection. For more information on these detections, see our [sign-in risk types](../identity-protection/concept-identity-protection-risks.md#sign-in-risk).
 
---
 
### Breaking Change: URI Fragments will not be carried through the login redirect

**Type:** Changed feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication
 
Starting on February 8, 2020, when a request is sent to login.microsoftonline.com to sign in a user, the service will append an empty fragment to the request.  This prevents a class of redirect attacks by ensuring that the browser wipes out any existing fragment in the request. No application should have a dependency on this behavior. For more information, see [Breaking changes](../develop/reference-breaking-changes.md#february-2020) in the Microsoft identity platform documentation.

---

## December 2019

### Integrate SAP SuccessFactors provisioning into Azure AD and on-premises AD (Public Preview)

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management

You can now integrate SAP SuccessFactors as an authoritative identity source in Azure AD. This integration helps you automate the end-to-end identity lifecycle, including using HR-based events, like new hires or terminations, to control provisioning of Azure AD accounts.

For more information about how to set up SAP SuccessFactors inbound provisioning to Azure AD, see the [Configure SAP SuccessFactors automatic provisioning](../saas-apps/sap-successfactors-inbound-provisioning-tutorial.md) tutorial.

---

### Support for customized emails in Azure AD B2C (Public Preview)

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C

You can now use Azure AD B2C to create customized emails when your users sign up to use your apps. By using DisplayControls (currently in preview) and a third-party email provider (such as, [SendGrid](https://sendgrid.com/), [SparkPost](https://sparkpost.com/), or a custom REST API), you can use your own email template, **From** address, and subject text, as well as support localization and custom one-time password (OTP) settings.

For more information, see [Custom email verification in Azure Active Directory B2C](../../active-directory-b2c/custom-email-sendgrid.md).

---

### Replacement of baseline policies with security defaults

**Type:** Changed feature  
**Service category:** Other  
**Product capability:** Identity Security and Protection

As part of a secure-by-default model for authentication, we're removing the existing baseline protection policies from all tenants. This removal is targeted for completion at the end of February. The replacement for these baseline protection policies is security defaults. If you've been using baseline protection policies, you must plan to move to the new security defaults policy or to Conditional Access. If you haven't used these policies, there is no action for you to take.

For more information about the new security defaults, see [What are security defaults?](./concept-fundamentals-security-defaults.md) For more information about Conditional Access policies, see [Common Conditional Access policies](../conditional-access/concept-conditional-access-policy-common.md).

---

## November 2019

### Support for the SameSite attribute and Chrome 80

**Type:** Plan for change  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication

As part of a secure-by-default model for cookies, the Chrome 80 browser is changing how it treats cookies without the `SameSite` attribute. Any cookie that doesn't specify the `SameSite` attribute will be treated as though it was set to `SameSite=Lax`, which will result in Chrome blocking certain cross-domain cookie sharing scenarios that your app may depend on. To maintain the older Chrome behavior, you can use the `SameSite=None` attribute and add an additional `Secure` attribute, so cross-site cookies can only be accessed over HTTPS connections. Chrome is scheduled to complete this change by February 4, 2020.

We recommend all our developers test their apps using this guidance:

- Set the default value for the **Use Secure Cookie** setting to **Yes**.

- Set the default value for the **SameSite** attribute to **None**.

- Add an additional `SameSite` attribute of **Secure**.

For more information, see [Upcoming SameSite Cookie Changes in ASP.NET and ASP.NET Core](https://devblogs.microsoft.com/aspnet/upcoming-samesite-cookie-changes-in-asp-net-and-asp-net-core/) and [Potential disruption to customer websites and Microsoft products and services in Chrome version 79 and later](https://support.microsoft.com/help/4522904/potential-disruption-to-microsoft-services-in-chrome-beta-version-79).

---

### New hotfix for Microsoft Identity Manager (MIM) 2016 Service Pack 2 (SP2)

**Type:** Fixed  
**Service category:** Microsoft Identity Manager  
**Product capability:** Identity Lifecycle Management

A hotfix rollup package (build 4.6.34.0) is available for Microsoft Identity Manager (MIM) 2016 Service Pack 2 (SP2). This rollup package resolves issues and adds improvements that are described in the "Issues fixed and improvements added in this update" section.

For more information and to download the hotfix package, see [Microsoft Identity Manager 2016 Service Pack 2 (build 4.6.34.0) Update Rollup is available](https://support.microsoft.com/help/4512924/microsoft-identity-manager-2016-service-pack-2-build-4-6-34-0-update-r).

---

### New AD FS app activity report to help migrate apps to Azure AD (Public Preview)

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO

Use the new Active Directory Federation Services (AD FS) app activity report, in the Azure portal, to identify which of your apps are capable of being migrated to Azure AD. The report assesses all AD FS apps for compatibility with Azure AD, checks for any issues, and gives guidance about preparing individual apps for migration.

For more information, see [Use the AD FS application activity report to migrate applications to Azure AD](../manage-apps/migrate-adfs-application-activity.md).

---

### New workflow for users to request administrator consent (Public Preview)

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Access Control

The new admin consent workflow gives admins a way to grant access to apps that require admin approval. If a user tries to access an app, but is unable to provide consent, they can now send a request for admin approval. The request is sent by email, and placed in a queue that's accessible from the Azure portal, to all the admins who have been designated as reviewers. After a reviewer takes action on a pending request, the requesting users are notified of the action.

For more information, see [Configure the admin consent workflow (preview)](../manage-apps/configure-admin-consent-workflow.md).

---

### New Azure AD App Registrations Token configuration experience for managing optional claims (Public Preview)

**Type:** New feature  
**Service category:** Other  
**Product capability:** Developer Experience

The new **Azure AD App Registrations Token configuration** blade on the Azure portal now shows app developers a dynamic list of optional claims for their apps. This new experience helps to streamline Azure AD app migrations and to minimize optional claims misconfigurations.

For more information, see [Provide optional claims to your Azure AD app](../develop/active-directory-optional-claims.md).

---

### New two-stage approval workflow in Azure AD entitlement management (Public Preview)

**Type:** New feature  
**Service category:** Other  
**Product capability:** Entitlement Management

We've introduced a new two-stage approval workflow that allows you to require two approvers to approve a user's request to an access package. For example, you can set it so the requesting user's manager must first approve, and then you can also require a resource owner to approve. If one of the approvers doesn't approve, access isn't granted.

For more information, see [Change request and approval settings for an access package in Azure AD entitlement management](../governance/entitlement-management-access-package-request-policy.md).

---

### Updates to the My Apps page along with new workspaces (Public Preview)

**Type:** New feature  
**Service category:** My Apps  
**Product capability:** 3rd Party Integration

You can now customize the way your organization's users view and access the refreshed My Apps experience. This new experience also includes the new workspaces feature, which makes it easier for your users to find and organize apps.

For more information about the new My Apps experience and creating workspaces, see [Create workspaces on the My Apps portal](../manage-apps/access-panel-collections.md).

---

### Google social ID support for Azure AD B2B collaboration (General Availability)

**Type:** New feature  
**Service category:** B2B  
**Product capability:** User Authentication

New support for using Google social IDs (Gmail accounts) in Azure AD helps to make collaboration simpler for your users and partners. There's no longer a need for your partners to create and manage a new Microsoft-specific account. Microsoft Teams now fully supports Google users on all clients and across the common and tenant-related authentication endpoints.

For more information, see [Add Google as an identity provider for B2B guest users](../external-identities/google-federation.md).

---

### Microsoft Edge Mobile Support for Conditional Access and Single Sign-on (General Availability)

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection

Azure AD for Microsoft Edge on iOS and Android now supports Azure AD Single Sign-On and Conditional Access:

- **Microsoft Edge single sign-on (SSO):** Single sign-on is now available across native clients (such as Microsoft Outlook and Microsoft Edge) for all Azure AD -connected apps.

- **Microsoft Edge conditional access:** Through application-based conditional access policies, your users must use Microsoft Intune-protected browsers, such as Microsoft Edge.

For more information about conditional access and SSO with Microsoft Edge, see the [Microsoft Edge Mobile Support for Conditional Access and Single Sign-on Now Generally Available](https://techcommunity.microsoft.com/t5/Intune-Customer-Success/Microsoft-Edge-Mobile-Support-for-Conditional-Access-and-Single/ba-p/988179) blog post. For more information about how to set up your client apps using [app-based conditional access](../conditional-access/app-based-conditional-access.md) or [device-based conditional access](../conditional-access/require-managed-devices.md), see [Manage web access using a Microsoft Intune policy-protected browser](/intune/apps/app-configuration-managed-browser).

---

### Azure AD entitlement management (General Availability)

**Type:** New feature  
**Service category:** Other  
**Product capability:** Entitlement Management

Azure AD entitlement management is a new identity governance feature, which helps organizations manage identity and access lifecycle at scale. This new feature helps by automating access request workflows, access assignments, reviews, and expiration across groups, apps, and SharePoint Online sites.

With Azure AD entitlement management, you can more efficiently manage access both for employees  and also for users outside your organization who need access to those resources.

For more information, see [What is Azure AD entitlement management?](../governance/entitlement-management-overview.md#license-requirements)

---

### Automate user account provisioning for these newly supported SaaS apps

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration  

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

[SAP Cloud Platform Identity Authentication Service](../saas-apps/sap-hana-cloud-platform-identity-authentication-tutorial.md), [RingCentral](../saas-apps/ringcentral-provisioning-tutorial.md), [SpaceIQ](../saas-apps/spaceiq-provisioning-tutorial.md), [Miro](../saas-apps/miro-provisioning-tutorial.md), [Cloudgate](../saas-apps/soloinsight-cloudgate-sso-provisioning-tutorial.md), [Infor CloudSuite](../saas-apps/infor-cloudsuite-provisioning-tutorial.md), [OfficeSpace Software](../saas-apps/officespace-software-provisioning-tutorial.md), [Priority Matrix](../saas-apps/priority-matrix-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### New Federated Apps available in Azure AD App gallery - November 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In November 2019, we've added these 21 new apps with Federation support to the app gallery:

[Airtable](../saas-apps/airtable-tutorial.md), [Hootsuite](../saas-apps/hootsuite-tutorial.md), [Blue Access for Members (BAM)](../saas-apps/blue-access-for-members-tutorial.md), [Bitly](../saas-apps/bitly-tutorial.md), [Riva](../saas-apps/riva-tutorial.md), [ResLife Portal](https://app.reslifecloud.com/hub5_signin/microsoft_azuread/?g=44BBB1F90915236A97502FF4BE2952CB&c=5&uid=0&ht=2&ref=), [NegometrixPortal Single Sign On (SSO)](../saas-apps/negometrixportal-tutorial.md), [TeamsChamp](https://login.microsoftonline.com/551f45da-b68e-4498-a7f5-a6e1efaeb41c/adminconsent?client_id=ca9bbfa4-1316-4c0f-a9ee-1248ac27f8ab&redirect_uri=https://admin.teamschamp.com/api/adminconsent&state=6883c143-cb59-42ee-a53a-bdb5faabf279), [Motus](../saas-apps/motus-tutorial.md), [MyAryaka](../saas-apps/myaryaka-tutorial.md), [BlueMail](https://loginself1.bluemail.me/), [Beedle](https://teams-web.beedle.co/#/), [Visma](../saas-apps/visma-tutorial.md), [OneDesk](../saas-apps/onedesk-tutorial.md), [Foko Retail](../saas-apps/foko-retail-tutorial.md), [Qmarkets Idea & Innovation Management](../saas-apps/qmarkets-idea-innovation-management-tutorial.md), [Netskope User Authentication](../saas-apps/netskope-user-authentication-tutorial.md), [uniFLOW Online](../saas-apps/uniflow-online-tutorial.md), [Claromentis](../saas-apps/claromentis-tutorial.md), [Jisc Student Voter Registration](../saas-apps/jisc-student-voter-registration-tutorial.md), [e4enable](https://portal.e4enable.com/)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### New and improved Azure AD application gallery

**Type:** Changed feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO

We've updated the Azure AD application gallery to make it easier for you to find pre-integrated apps that support provisioning, OpenID Connect, and SAML on your Azure Active Directory tenant.

For more information, see [Add an application to your Azure Active Directory tenant](../manage-apps/add-application-portal.md).

---

### Increased app role definition length limit from 120 to 240 characters

**Type:** Changed feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO

We've heard from customers that the length limit for the app role definition value in some apps and services is too short at 120 characters. In response, we've increased the maximum length of the role value definition to 240 characters.

For more information about using application-specific role definitions, see [Add app roles in your application and receive them in the token](../develop/howto-add-app-roles-in-azure-ad-apps.md).

---

## October 2019

### Deprecation of the identityRiskEvent API for Azure AD Identity Protection risk detections

**Type:** Plan for change
**Service category:** Identity Protection
**Product capability:** Identity Security & Protection

In response to developer feedback, Azure AD Premium P2 subscribers can now perform complex queries on Azure AD Identity Protection's risk detection data by using the new riskDetection API for Microsoft Graph. The existing [identityRiskEvent](/graph/api/resources/identityriskevent?view=graph-rest-beta&preserve-view=true) API beta version will stop returning data around **January 10, 2020**. If your organization is using the identityRiskEvent API, you should transition to the new riskDetection API.

For more information about the new riskDetection API, see the [Risk detection API reference documentation](/graph/api/resources/riskdetection).

---

### Application Proxy support for the SameSite Attribute and Chrome 80

**Type:** Plan for change
**Service category:** App Proxy
**Product capability:** Access Control

A couple of weeks prior to the Chrome 80 browser release, we plan to update how Application Proxy cookies treat the **SameSite** attribute. With the release of Chrome 80, any cookie that doesn't specify the **SameSite** attribute will be treated as though it was set to `SameSite=Lax`.

To help avoid potentially negative impacts due to this change, we're updating Application Proxy access and session cookies by:

- Setting the default value for the **Use Secure Cookie** setting to **Yes**.

- Setting the default value for the **SameSite** attribute to **None**.

    >[!NOTE]
    > Application Proxy access cookies have always been transmitted exclusively over secure channels. These changes only apply to session cookies.

For more information about the Application Proxy cookie settings, see [Cookie settings for accessing on-premises applications in Azure Active Directory](../manage-apps/application-proxy-configure-cookie-settings.md).

---

### App registrations (legacy) and app management in the Application Registration Portal (apps.dev.microsoft.com) is no longer available

**Type:** Plan for change
**Service category:** N/A
**Product capability:** Developer Experience

Users with Azure AD accounts can no longer register or manage applications using the Application Registration Portal (apps.dev.microsoft.com), or register and manage applications in the App registrations (legacy) experience in the Azure portal.

To learn more about the new App registrations experience, see the [App registrations in the Azure portal training guide](../develop/quickstart-register-app.md).

---

### Users are no longer required to re-register during migration from per-user MFA to Conditional Access-based MFA

**Type:** Fixed
**Service category:** MFA
**Product capability:** Identity Security & Protection

We've fixed a known issue whereby when users were required to re-register if they were disabled for per-user Multi-Factor Authentication (MFA) and then enabled for MFA through a Conditional Access policy.

To require users to re-register, you can select the **Required re-register MFA** option from the user's authentication methods in the Azure AD portal. For more information about migrating users from per-user MFA to Conditional Access-based MFA, see [Convert users from per-user MFA to Conditional Access based MFA](../authentication/howto-mfa-getstarted.md#convert-users-from-per-user-mfa-to-conditional-access-based-mfa).

---

### New capabilities to transform and send claims in your SAML token

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** SSO

We've added additional capabilities to help you to customize and send claims in your SAML token. These new capabilities include:

- Additional claims transformation functions, helping you to modify the value you send in the claim.

- Ability to apply multiple transformations to a single claim.

- Ability to specify the claim source, based on the user type and the group to which the user belongs.

For detailed information about these new capabilities, including how to use them, see [Customize claims issued in the SAML token for enterprise applications](../develop/active-directory-saml-claims-customization.md).

---

### New My Sign-ins page for end users in Azure AD

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** Monitoring & Reporting

We've added a new **My Sign-ins** page (https://mysignins.microsoft.com) to let your organization's users view their recent sign-in history to check for any unusual activity. This new page allows your users to see:

- If anyone is attempting to guess their password.

- If an attacker successfully signed in to their account and from what location.

- What apps the attacker tried to access.

For more information, see the [Users can now check their sign-in history for unusual activity](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Users-can-now-check-their-sign-in-history-for-unusual-activity/ba-p/916066) blog.

---

### Migration of Azure AD Domain Services (Azure AD DS) from classic to Azure Resource Manager virtual networks

**Type:** New feature
**Service category:** Azure AD Domain Services
**Product capability:** Azure AD Domain Services

To our customers who have been stuck on classic virtual networks -- we have great news for you! You can now perform a one-time migration from a classic virtual network to an existing Resource Manager virtual network. After moving to the Resource Manager virtual network, you'll be able to take advantage of the additional and upgraded features such as, fine-grained password policies, email notifications, and audit logs.

For more information, see [Preview - Migrate Azure AD Domain Services from the Classic virtual network model to Resource Manager](../../active-directory-domain-services/migrate-from-classic-vnet.md).

---

### Updates to the Azure AD B2C page contract layout

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

We've introduced some new changes to version 1.2.0 of the page contract for Azure AD B2C. In this updated version, you can now control the load order for your elements, which can also help to stop the flicker that happens when the style sheet (CSS) is loaded.

For a full list of the changes made to the page contract, see the [Version change log](../../active-directory-b2c/page-layout.md#other-pages-providerselection-claimsconsent-unifiedssd).

---

### Update to the My Apps page along with new workspaces (Public preview)

**Type:** New feature
**Service category:** My Apps
**Product capability:** Access Control

You can now customize the way your organization's users view and access the brand-new My Apps experience, including using the new workspaces feature to make it easier for them to find apps. The new workspaces functionality acts as a filter for the apps your organization's users already have access to.

For more information on rolling out the new My Apps experience and creating workspaces, see [Create workspaces on the My Apps (preview) portal](../manage-apps/access-panel-collections.md).

---

### Support for the monthly active user-based billing model (General availability)

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

Azure AD B2C now supports monthly active users (MAU) billing. MAU billing is based on the number of unique users with authentication activity during a calendar month. Existing customers can switch to this new billing method at any time.

Starting on November 1, 2019, all new customers will automatically be billed using this method. This billing method benefits customers through cost benefits and the ability to plan ahead.

For more information, see [Upgrade to monthly active users billing model](../../active-directory-b2c/billing.md#switch-to-mau-billing-pre-november-2019-azure-ad-b2c-tenants).

---

### New Federated Apps available in Azure AD App gallery - October 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In October 2019, we've added these 35 new apps with Federation support to the app gallery:

[In Case of Crisis – Mobile](../saas-apps/in-case-of-crisis-mobile-tutorial.md), [Juno Journey](../saas-apps/juno-journey-tutorial.md), [ExponentHR](../saas-apps/exponenthr-tutorial.md), [Tact](https://www.tact.ai/products/tact-assistant), [OpusCapita Cash Management](https://appsource.microsoft.com/product/web-apps/opuscapitagroupoy-1036255.opuscapita-cm), [Salestim](https://www.salestim.com/), [Learnster](../saas-apps/learnster-tutorial.md), [Dynatrace](../saas-apps/dynatrace-tutorial.md), [HunchBuzz](https://login.hunchbuzz.com/integrations/azure/process), [Freshworks](../saas-apps/freshworks-tutorial.md), [eCornell](../saas-apps/ecornell-tutorial.md), [ShipHazmat](../saas-apps/shiphazmat-tutorial.md), [Netskope Cloud Security](../saas-apps/netskope-cloud-security-tutorial.md), [Contentful](../saas-apps/contentful-tutorial.md), [Bindtuning](https://bindtuning.com/login), [HireVue Coordinate – Europe](https://www.hirevue.com/), [HireVue Coordinate - USOnly](https://www.hirevue.com/), [HireVue Coordinate - US](https://www.hirevue.com/), [WittyParrot Knowledge Box](https://wittyapi.wittyparrot.com/wittyparrot/api/provision/trail/signup), [Cloudmore](../saas-apps/cloudmore-tutorial.md), [Visit.org](../saas-apps/visitorg-tutorial.md), [Cambium Xirrus EasyPass Portal](https://login.xirrus.com/azure-signup), [Paylocity](../saas-apps/paylocity-tutorial.md), [Mail Luck!](../saas-apps/mail-luck-tutorial.md), [Teamie](https://theteamie.com/), [Velocity for Teams](https://velocity.peakup.org/teams/login), [SIGNL4](https://account.signl4.com/manage), [EAB Navigate IMPL](../saas-apps/eab-navigate-impl-tutorial.md), [ScreenMeet](https://console.screenmeet.com/), [Omega Point](https://pi.ompnt.com/), [Speaking Email for Intune (iPhone)](https://speaking.email/FAQ/98/email-access-via-microsoft-intune), [Speaking Email for Office 365 Direct (iPhone/Android)](https://speaking.email/FAQ/126/email-access-via-microsoft-office-365-direct), [ExactCare SSO](../saas-apps/exactcare-sso-tutorial.md), [iHealthHome Care Navigation System](https://ihealthnav.com/account/signin), [Qubie](https://qubie.azurewebsites.net/static/adminTab/authorize.html)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Consolidated Security menu item in the Azure AD portal

**Type:** Changed feature
**Service category:** Identity Protection
**Product capability:** Identity Security & Protection

You can now access all of the available Azure AD security features from the new **Security** menu item, and from the **Search** bar, in the Azure portal. Additionally, the new **Security** landing page, called **Security - Getting started**, will provide links to our public documentation, security guidance, and deployment guides.

The new **Security** menu includes:

- Conditional Access
- Identity Protection
- Security Center
- Identity Secure Score
- Authentication methods
- MFA
- Risk reports - Risky users, Risky sign-ins, Risk detections
- And more...

For more information, see [Security - Getting started](https://portal.azure.com/#blade/Microsoft_AAD_IAM/SecurityMenuBlade/GettingStarted).

---

### Office 365 groups expiration policy enhanced with autorenewal

**Type:** Changed feature
**Service category:** Group Management
**Product capability:** Identity Lifecycle Management

The Office 365 groups expiration policy has been enhanced to automatically renew groups that are actively in use by its members. Groups will be autorenewed based on user activity across all the Office 365 apps, including Outlook, SharePoint, and Teams.

This enhancement helps to reduce your group expiration notifications and helps to make sure that active groups continue to be available. If you already have an active expiration policy for your Office 365 groups, you don't need to do anything to turn on this new functionality.

For more information, see [Configure the expiration policy for Office 365 groups](../enterprise-users/groups-lifecycle.md).

---

### Updated Azure AD Domain Services (Azure AD DS) creation experience

**Type:** Changed feature
**Service category:** Azure AD Domain Services
**Product capability:** Azure AD Domain Services

We've updated Azure AD Domain Services (Azure AD DS) to include a new and improved creation experience, helping you to create a managed domain in just three clicks! In addition, you can now upload and deploy Azure AD DS from a template.

For more information, see [Tutorial: Create and configure an Azure Active Directory Domain Services instance](../../active-directory-domain-services/tutorial-create-instance.md).

---

## September 2019

### Plan for change: Deprecation of the Power BI content packs

**Type:** Plan for change
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

Starting on October 1, 2019, Power BI will begin to deprecate all content packs, including the Azure AD Power BI content pack. As an alternative to this content pack, you can use Azure AD Workbooks to gain insights into your Azure AD-related services. Additional workbooks are coming, including workbooks about Conditional Access policies in report-only mode, app consent-based insights, and more.

For more information about the workbooks, see [How to use Azure Monitor workbooks for Azure Active Directory reports](../reports-monitoring/howto-use-azure-monitor-workbooks.md). For more information about the deprecation of the content packs, see the [Announcing Power BI template apps general availability](https://powerbi.microsoft.com/blog/announcing-power-bi-template-apps-general-availability/) blog post.

---

### My Profile is renaming and integrating with the Microsoft Office account page

**Type:** Plan for change
**Service category:** My Profile/Account
**Product capability:** Collaboration

Starting in October, the My Profile experience will become My Account. As part of that change, everywhere that currently says, **My Profile** will change to **My Account**. On top of the naming change and some design improvements, the updated experience will offer additional integration with the Microsoft Office account page. Specifically, you'll be able to access Office installations and subscriptions from the **Overview Account** page, along with Office-related contact preferences from the **Privacy** page.

For more information about the My Profile (preview) experience, see [My Profile (preview) portal overview](../user-help/my-account-portal-overview.md).

---

### Bulk manage groups and members using CSV files in the Azure AD portal (Public Preview)

**Type:** New feature
**Service category:** Group Management
**Product capability:** Collaboration

We're pleased to announce public preview availability of the bulk group management experiences in the Azure AD portal. You can now use a CSV file and the Azure AD portal to manage groups and member lists, including:

- Adding or removing members from a group.

- Downloading the list of groups from the directory.

- Downloading the list of group members for a specific group.

For more information, see [Bulk add members](../enterprise-users/groups-bulk-import-members.md), [Bulk remove members](../enterprise-users/groups-bulk-remove-members.md), [Bulk download members list](../enterprise-users/groups-bulk-download-members.md), and [Bulk download groups list](../enterprise-users/groups-bulk-download.md).

---

### Dynamic consent is now supported through a new admin consent endpoint

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

We've created a new admin consent endpoint to support dynamic consent, which is helpful for apps that want to use the dynamic consent model on the Microsoft Identity platform.

For more information about how to use this new endpoint, see [Using the admin consent endpoint](../develop/v2-admin-consent.md).

---

### New Federated Apps available in Azure AD App gallery - September 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In September 2019, we've added these 29 new apps with Federation support to the app gallery:

[ScheduleLook](https://schedulelook.bbsonlineservices.net/), [MS Azure SSO Access for Ethidex Compliance Office&trade; - Single  sign-on](../saas-apps/ms-azure-sso-access-for-ethidex-compliance-office-tutorial.md), [iServer Portal](../saas-apps/iserver-portal-tutorial.md), [SKYSITE](../saas-apps/skysite-tutorial.md), [Concur Travel and Expense](../saas-apps/concur-travel-and-expense-tutorial.md), [WorkBoard](../saas-apps/workboard-tutorial.md), `https://apps.yeeflow.com/`, [ARC Facilities](../saas-apps/arc-facilities-tutorial.md), [Luware Stratus Team](https://stratus.emea.luware.cloud/login), [Wide Ideas](https://wideideas.online/wideideas/), [Prisma Cloud](../saas-apps/prisma-cloud-tutorial.md), [JDLT Client Hub](https://clients.jdlt.co.uk/login), [RENRAKU](../saas-apps/renraku-tutorial.md), [SealPath Secure Browser](https://protection.sealpath.com/SealPathInterceptorWopiSaas/Open/InstallSealPathEditorOneDrive), [Prisma Cloud](../saas-apps/prisma-cloud-tutorial.md), `https://app.penneo.com/`, `https://app.testhtm.com/settings/email-integration`, [Cintoo Cloud](https://aec.cintoo.com/login), [Whitesource](../saas-apps/whitesource-tutorial.md), [Hosted Heritage Online SSO](../saas-apps/hosted-heritage-online-sso-tutorial.md), [IDC](../saas-apps/idc-tutorial.md), [CakeHR](../saas-apps/cakehr-tutorial.md), [BIS](../saas-apps/bis-tutorial.md), [Coo Kai Team Build](https://ms-contacts.coo-kai.jp/), [Sonarqube](../saas-apps/sonarqube-tutorial.md), [Adobe Identity Management](../saas-apps/tutorial-list.md), [Discovery Benefits SSO](../saas-apps/discovery-benefits-sso-tutorial.md), [Amelio](https://app.amelio.co/), `https://itask.yipinapp.com/`

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### New Azure AD Global Reader role

**Type:** New feature
**Service category:** Azure AD roles
**Product capability:** Access Control

Starting on September 24, 2019, we're going to start rolling out a new Azure Active Directory (AD) role called Global Reader. This rollout will start with production and Global cloud customers (GCC), finishing up worldwide in October.

The Global Reader role is the read-only counterpart to Global Administrator. Users in this role can read settings and administrative information across Microsoft 365 services, but can't take management actions. We've created the Global Reader role to help reduce the number of Global Administrators in your organization. Because Global Administrator accounts are powerful and vulnerable to attack, we recommend that you have fewer than five Global Administrators. We recommend using the Global Reader role for planning, audits, or investigations. We also recommend using the Global Reader role in combination with other limited administrator roles, like Exchange Administrator, to help get work done without requiring the Global Administrator role.

The Global Reader role works with the new Microsoft 365 Admin Center, Exchange Admin Center, Teams Admin Center, Security Center, Compliance Center, Azure AD Admin Center, and the Device Management Admin Center.

>[!NOTE]
> At the start of public preview, the Global Reader role won't work with: SharePoint, Privileged Access Management, Customer Lockbox, sensitivity labels, Teams Lifecycle, Teams Reporting & Call Analytics, Teams IP Phone Device Management, and Teams App Catalog.

For more information, see [Administrator role permissions in Azure Active Directory](../roles/permissions-reference.md).

---

### Access an on-premises Report Server from your Power BI Mobile app using Azure Active Directory Application Proxy

**Type:** New feature
**Service category:** App Proxy
**Product capability:** Access Control

New integration between the Power BI mobile app and Azure AD Application Proxy allows you to securely sign in to the Power BI mobile app and view any of your organization's reports hosted on the on-premises Power BI Report Server.

For information about the Power BI Mobile app, including where to download the app, see the [Power BI site](https://powerbi.microsoft.com/mobile/). For more information about how to set up the Power BI mobile app with Azure AD Application Proxy, see [Enable remote access to Power BI Mobile with Azure AD Application Proxy](../manage-apps/application-proxy-integrate-with-power-bi.md).

---

### New version of the AzureADPreview PowerShell module is available

**Type:** Changed feature
**Service category:** Other
**Product capability:** Directory

New cmdlets were added to the AzureADPreview module, to help define and assign custom roles in Azure AD, including:

- `Add-AzureADMSFeatureRolloutPolicyDirectoryObject`
- `Get-AzureADMSFeatureRolloutPolicy`
- `New-AzureADMSFeatureRolloutPolicy`
- `Remove-AzureADMSFeatureRolloutPolicy`
- `Remove-AzureADMSFeatureRolloutPolicyDirectoryObject`
- `Set-AzureADMSFeatureRolloutPolicy`

---

### New version of Azure AD Connect

**Type:** Changed feature
**Service category:** Other
**Product capability:** Directory

We've released an updated version of Azure AD Connect for auto-upgrade customers. This new version includes several new features, improvements, and bug fixes. For more information about this new version, see [Azure AD Connect: Version release history](../hybrid/reference-connect-version-history.md#14250).

---

### Azure Multi-Factor Authentication (MFA) Server, version 8.0.2 is now available

**Type:** Fixed
**Service category:** MFA
**Product capability:** Identity Security & Protection

If you're an existing customer, who activated MFA Server prior to July 1, 2019, you can now download the latest version of MFA Server (version 8.0.2). In this new version, we:

- Fixed an issue so when Azure AD sync changes a user from Disabled to Enabled, an email is sent to the user.

- Fixed an issue so customers can successfully upgrade, while continuing to use the Tags functionality.

- Added the Kosovo (+383) country code.

- Added one-time bypass audit logging to the MultiFactorAuthSvc.log.

- Improved performance for the Web Service SDK.

- Fixed other minor bugs.

Starting July 1, 2019, Microsoft stopped offering MFA Server for new deployments. New customers who require multi-factor authentication should use cloud-based Azure AD Multi-Factor Authentication. For more information, see [Planning a cloud-based Azure AD Multi-Factor Authentication deployment](../authentication/howto-mfa-getstarted.md).

---

## August 2019

### Enhanced search, filtering, and sorting for groups is available in the Azure AD portal (Public Preview)

**Type:** New feature
**Service category:** Group Management
**Product capability:** Collaboration

We're pleased to announce public preview availability of the enhanced groups-related experiences in the Azure AD portal. These enhancements help you better manage groups and member lists, by providing:

- Advanced search capabilities, such as substring search on groups lists.
- Advanced filtering and sorting options on member and owner lists.
- New search capabilities for member and owner lists.
- More accurate group counts for large groups.

For more information, see [Manage groups in the Azure portal](./active-directory-groups-members-azure-portal.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context).

---

### New custom roles are available for app registration management (Public Preview)

**Type:** New feature
**Service category:** Azure AD roles
**Product capability:** Access Control

Custom roles (available with an Azure AD P1 or P2 subscription) can now help provide you with fine-grained access, by letting you create role definitions with specific permissions and then to assign those roles to specific resources. Currently, you create custom roles by using permissions for managing app registrations and then assigning the role to a specific app. For more information about custom roles, see [Custom administrator roles in Azure Active Directory (preview)](../roles/custom-overview.md).

If you need additional permissions or resources supported, which you don't currently see, you can send feedback to our [Azure feedback site](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032) and we'll add your request to our update road map.

---

### New provisioning logs can help you monitor and troubleshoot your app provisioning deployment (Public Preview)

**Type:** New feature
**Service category:** App Provisioning
**Product capability:** Identity Lifecycle Management

New provisioning logs are available to help you monitor and troubleshoot the user and group provisioning deployment. These new log files include information about:

- What groups were successfully created in [ServiceNow](../saas-apps/servicenow-provisioning-tutorial.md)
- What roles were imported from [AWS Single-Account Access](../saas-apps/amazon-web-service-tutorial.md#configure-and-test-azure-ad-sso-for-aws-single-account-access)
- What employees weren't imported from [Workday](../saas-apps/workday-inbound-tutorial.md)

For more information, see [Provisioning reports in the Azure Active Directory portal (preview)](../reports-monitoring/concept-provisioning-logs.md).

---

### New security reports for all Azure AD administrators (General Availability)

**Type:** New feature
**Service category:** Identity Protection
**Product capability:** Identity Security & Protection

By default, all Azure AD administrators will soon be able to access modern security reports within Azure AD. Until the end of September, you will be able to use the banner at the top of the modern security reports to return to the old reports.

The modern security reports will provide additional capabilities from the older versions, including:

- Advanced filtering and sorting
- Bulk actions, such as dismissing user risk
- Confirmation of compromised or safe entities
- Risk state, covering: At risk, Dismissed, Remediated, and Confirmed compromised
- New risk-related detections (available to Azure AD Premium subscribers)

For more information, see [Risky users](../identity-protection/howto-identity-protection-investigate-risk.md#risky-users), [Risky sign-ins](../identity-protection/howto-identity-protection-investigate-risk.md#risky-sign-ins), and [Risk detections](../identity-protection/howto-identity-protection-investigate-risk.md#risk-detections).

---

### User-assigned managed identity is available for Virtual Machines and Virtual Machine Scale Sets (General Availability)

**Type:** New feature
**Service category:** Managed identities for Azure resources
**Product capability:** Developer Experience

User-assigned managed identities are now generally available for Virtual Machines and Virtual Machine Scale Sets. As part of this, Azure can create an identity in the Azure AD tenant that's trusted by the subscription in use, and can be assigned to one or more Azure service instances. For more information about user-assigned managed identities, see [What is managed identities for Azure resources?](../managed-identities-azure-resources/overview.md).

---

### Users can reset their passwords using a mobile app or hardware token (General Availability)

**Type:** Changed feature
**Service category:** Self Service Password Reset
**Product capability:** User Authentication

Users who have registered a mobile app with your organization can now reset their own password by approving a notification from the Microsoft Authenticator app or by entering a code from their mobile app or hardware token.

For more information, see [How it works: Azure AD self-service password reset](../authentication/concept-sspr-howitworks.md). For more information about the user experience, see [Reset your own work or school password overview](../user-help/active-directory-passwords-reset-register.md).

---

### ADAL.NET ignores the MSAL.NET shared cache for on-behalf-of scenarios

**Type:** Fixed
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Starting with Azure AD authentication library (ADAL.NET) version 5.0.0-preview, app developers must [serialize one cache per account for web apps and web APIs](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Token-cache-serialization#custom-token-cache-serialization-in-web-applications--web-api). Otherwise, some scenarios using the [on-behalf-of flow](../develop/scenario-web-api-call-api-app-configuration.md?tabs=java) for Java, along with some specific use cases of `UserAssertion`, may result in an elevation of privilege. To avoid this vulnerability, ADAL.NET now ignores the Microsoft Authentication Library for dotnet (MSAL.NET) shared cache for on-behalf-of scenarios.

For more information about this issue, see [Azure Active Directory Authentication Library Elevation of Privilege Vulnerability](https://portal.msrc.microsoft.com/security-guidance/advisory/CVE-2019-1258).

---

### New Federated Apps available in Azure AD App gallery - August 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In August 2019, we've added these 26 new apps with Federation support to the app gallery:

[Civic Platform](../saas-apps/civic-platform-tutorial.md), [Amazon Business](../saas-apps/amazon-business-tutorial.md), [ProNovos Ops Manager](../saas-apps/pronovos-ops-manager-tutorial.md), [Cognidox](../saas-apps/cognidox-tutorial.md), [Viareport's Inativ Portal (Europe)](../saas-apps/viareports-inativ-portal-europe-tutorial.md), [Azure Databricks](https://azure.microsoft.com/services/databricks), [Robin](../saas-apps/robin-tutorial.md), [Academy Attendance](../saas-apps/academy-attendance-tutorial.md), [Priority Matrix](https://sync.appfluence.com/pmwebng/), [Cousto MySpace](https://cousto.platformers.be/account/login), [Uploadcare](https://uploadcare.com/accounts/signup/), [Carbonite Endpoint Backup](../saas-apps/carbonite-endpoint-backup-tutorial.md), [CPQSync by Cincom](../saas-apps/cpqsync-by-cincom-tutorial.md), [Chargebee](../saas-apps/chargebee-tutorial.md), [deliver.media&trade; Portal](https://portal.deliver.media), [Frontline Education](../saas-apps/frontline-education-tutorial.md), [F5](https://www.f5.com/products/security/access-policy-manager), [stashcat AD connect](https://www.stashcat.com), [Blink](../saas-apps/blink-tutorial.md), [Vocoli](../saas-apps/vocoli-tutorial.md), [ProNovos Analytics](../saas-apps/pronovos-analytics-tutorial.md), [Sigstr](../saas-apps/sigstr-tutorial.md), [Darwinbox](../saas-apps/darwinbox-tutorial.md), [Watch by Colors](../saas-apps/watch-by-colors-tutorial.md), [Harness](../saas-apps/harness-tutorial.md), [EAB Navigate Strategic Care](../saas-apps/eab-navigate-strategic-care-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### New versions of the AzureAD PowerShell and AzureADPreview PowerShell modules are available

**Type:** Changed feature
**Service category:** Other
**Product capability:** Directory

New updates to the AzureAD and AzureAD Preview PowerShell modules are available:

- A new `-Filter` parameter was added to the `Get-AzureADDirectoryRole` parameter in the AzureAD module. This parameter helps you filter on the directory roles returned by the cmdlet.
- New cmdlets were added to the AzureADPreview module, to help define and assign custom roles in Azure AD, including:

    - `Get-AzureADMSRoleAssignment`
    - `Get-AzureADMSRoleDefinition`
    - `New-AzureADMSRoleAssignment`
    - `New-AzureADMSRoleDefinition`
    - `Remove-AzureADMSRoleAssignment`
    - `Remove-AzureADMSRoleDefinition`
    - `Set-AzureADMSRoleDefinition`

---

### Improvements to the UI of the dynamic group rule builder in the Azure portal

**Type:** Changed feature
**Service category:** Group Management
**Product capability:** Collaboration

We've made some UI improvements to the dynamic group rule builder, available in the Azure portal, to help you more easily set up a new rule, or change existing rules. This design improvement allows you to create rules with up to five expressions, instead of just one. We've also updated the device property list to remove deprecated device properties.

For more information, see [Manage dynamic membership rules](../enterprise-users/groups-dynamic-membership.md).

---

### New Microsoft Graph app permission available for use with access reviews

**Type:** Changed feature
**Service category:** Access Reviews
**Product capability:** Identity Governance

We've introduced a new Microsoft Graph app permission, `AccessReview.ReadWrite.Membership`, which allows apps to automatically create and retrieve access reviews for group memberships and app assignments. This permission can be used by your scheduled jobs or as part of your automation, without requiring a logged-in user context.

For more information, see the [Example how to create Azure AD access reviews using Microsoft Graph app permissions with PowerShell blog](https://techcommunity.microsoft.com/t5/Azure-Active-Directory/Example-how-to-create-Azure-AD-access-reviews-using-Microsoft/m-p/807241).

---

### Azure AD activity logs are now available for government cloud instances in Azure Monitor

**Type:** Changed feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

We're excited to announce that Azure AD activity logs are now available for government cloud instances in Azure Monitor. You can now send Azure AD logs to your storage account or to an event hub to integrate with your SIEM tools, like [Sumologic](../reports-monitoring/howto-integrate-activity-logs-with-sumologic.md), [Splunk](../reports-monitoring/howto-integrate-activity-logs-with-splunk.md), and [ArcSight](../reports-monitoring/howto-integrate-activity-logs-with-arcsight.md).

For more information about setting up Azure Monitor, see [Azure AD activity logs in Azure Monitor](../reports-monitoring/concept-activity-logs-azure-monitor.md#cost-considerations).

---

### Update your users to the new, enhanced security info experience

**Type:** Changed feature
**Service category:**  Authentications (Logins)
**Product capability:** User Authentication

On September 25, 2019, we'll be turning off the old, non-enhanced security info experience for registering and managing user security info and only turning on the new, [enhanced version](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Cool-enhancements-to-the-Azure-AD-combined-MFA-and-password/ba-p/354271). This means that your users will no longer be able to use the old experience.

For more information about the enhanced security info experience, see our [admin documentation](../authentication/concept-registration-mfa-sspr-combined.md) and our [user documentation](../user-help/security-info-setup-signin.md).

#### To turn on this new experience, you must:

1. Sign in to the Azure portal as a Global Administrator or User Administrator.

2. Go to **Azure Active Directory > User settings > Manage settings for access panel preview features**.

3. In the **Users can use preview features for registering and managing security info - enhanced** area, select **Selected**, and then either choose a group of users or choose **All** to turn on this feature for all users in the tenant.

4. In the **Users can use preview features for registering and managing security **info**** area, select **None**.

5. Save your settings.

    After you save your settings, you'll no longer have access to the old security info experience.

>[!Important]
>If you don't complete these steps before September 25, 2019, your Azure Active Directory tenant will be automatically enabled for the enhanced experience. If you have questions, please contact us at registrationpreview@microsoft.com.

---

### Authentication requests using POST logins will be more strictly validated

**Type:** Changed feature
**Service category:** Authentications (Logins)
**Product capability:** Standards

Starting on September 2, 2019, authentication requests using the POST method will be more strictly validated against the HTTP standards. Specifically, spaces and double-quotes (") will no longer be removed from request form values. These changes aren't expected to break any existing clients, and will help to make sure that requests sent to Azure AD are reliably handled every time.

For more information, see the [Azure AD breaking changes notices](../develop/reference-breaking-changes.md#post-form-semantics-will-be-enforced-more-strictly---spaces-and-quotes-will-be-ignored).

---

## July 2019

### Plan for change: Application Proxy service update to support only TLS 1.2

**Type:** Plan for change
**Service category:** App Proxy
**Product capability:** Access Control

To help provide you with our strongest encryption, we're going to begin limiting Application Proxy service access to only TLS 1.2 protocols. This limitation will initially be rolled out to customers who are already using TLS 1.2 protocols, so you won't see the impact. Complete deprecation of the TLS 1.0 and TLS 1.1 protocols will be complete on August 31, 2019. Customers still using TLS 1.0 and TLS 1.1 will receive advanced notice to prepare for this change.

To maintain the connection to the Application Proxy service throughout this change, we recommend that you make sure your client-server and browser-server combinations are updated to use TLS 1.2. We also recommend that you make sure to include any client systems used by your employees to access apps published through the Application Proxy service.

For more information, see [Add an on-premises application for remote access through Application Proxy in Azure Active Directory](../manage-apps/application-proxy-add-on-premises-application.md).

---

### Plan for change: Design updates are coming for the Application Gallery

**Type:** Plan for change
**Service category:** Enterprise Apps
**Product capability:** SSO

New user interface changes are coming to the design of the **Add from the gallery** area of the **Add an application** blade. These changes will help you more easily find your apps that support automatic provisioning, OpenID Connect, Security Assertion Markup Language (SAML), and Password single sign-on (SSO).

---

### Plan for change: Removal of the MFA server IP address from the Office 365 IP address

**Type:** Plan for change
**Service category:** MFA
**Product capability:** Identity Security & Protection

We're removing the MFA server IP address from the [Office 365 IP Address and URL Web service](/office365/enterprise/office-365-ip-web-service). If you currently rely on these pages to update your firewall settings, you must make sure you're also including the list of IP addresses documented in the **Azure Multi-Factor Authentication Server firewall requirements** section of the [Getting started with the Azure Multi-Factor Authentication Server](../authentication/howto-mfaserver-deploy.md#azure-multi-factor-authentication-server-firewall-requirements) article.

---

### App-only tokens now require the client app to exist in the resource tenant

**Type:** Fixed
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

On July 26, 2019, we changed how we provide app-only tokens through the [client credentials grant](../azuread-dev/v1-oauth2-client-creds-grant-flow.md). Previously, apps could get tokens to call other apps, regardless of whether the client app was in the tenant. We've updated this behavior so single-tenant resources, sometimes called Web APIs, can only be called by client apps that exist in the resource tenant.

If your app isn't located in the resource tenant, you'll get an error message that says, `The service principal named <app_name> was not found in the tenant named <tenant_name>. This can happen if the application has not been installed by the administrator of the tenant.` To fix this problem, you must create the client app service principal in the tenant, using either the [admin consent endpoint](../develop/v2-permissions-and-consent.md#using-the-admin-consent-endpoint) or [through PowerShell](../develop/howto-authenticate-service-principal-powershell.md), which ensures your tenant has given the app permission to operate within the tenant.

For more information, see [What's new for authentication?](../develop/reference-breaking-changes.md#app-only-tokens-for-single-tenant-applications-are-only-issued-if-the-client-app-exists-in-the-resource-tenant).

> [!NOTE]
> Existing consent between the client and the API continues to not be required. Apps should still be doing their own authorization checks.

---

### New passwordless sign-in to Azure AD using FIDO2 security keys

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Azure AD customers can now set policies to manage FIDO2 security keys for their organization's users and groups. End users can also self-register their security keys, use the keys to sign in to their Microsoft accounts on web sites while on FIDO-capable devices, as well as sign-in to their Azure AD-joined Windows 10 devices.

For more information, see [Enable passwordless sign in for Azure AD (preview)](../authentication/concept-authentication-passwordless.md) for administrator-related information, and [Set up security info to use a security key (Preview)](../user-help/security-info-setup-security-key.md) for end-user-related information.

---

### New Federated Apps available in Azure AD App gallery - July 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In July 2019, we've added these 18 new apps with Federation support to the app gallery:

[Ungerboeck Software](../saas-apps/ungerboeck-software-tutorial.md), [Bright Pattern Omnichannel Contact Center](../saas-apps/bright-pattern-omnichannel-contact-center-tutorial.md), [Clever Nelly](../saas-apps/clever-nelly-tutorial.md), [AcquireIO](../saas-apps/acquireio-tutorial.md), [Looop](https://www.looop.co/schedule-a-demo/), [productboard](../saas-apps/productboard-tutorial.md), [MS Azure SSO Access for Ethidex Compliance Office&trade;](../saas-apps/ms-azure-sso-access-for-ethidex-compliance-office-tutorial.md), [Hype](../saas-apps/hype-tutorial.md), [Abstract](../saas-apps/abstract-tutorial.md), [Ascentis](../saas-apps/ascentis-tutorial.md), [Flipsnack](https://www.flipsnack.com/accounts/sign-in-sso.html), [Wandera](../saas-apps/wandera-tutorial.md), [TwineSocial](https://twinesocial.com/), [Kallidus](../saas-apps/kallidus-tutorial.md), [HyperAnna](../saas-apps/hyperanna-tutorial.md), [PharmID WasteWitness](https://pharmid.com/), [i2B Connect](https://www.i2b-online.com/sign-up-to-use-i2b-connect-here-sso-access/), [JFrog Artifactory](../saas-apps/jfrog-artifactory-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Automate user account provisioning for these newly supported SaaS apps

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** Monitoring & Reporting

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Dialpad](../saas-apps/dialpad-provisioning-tutorial.md)

- [Federated Directory](../saas-apps/federated-directory-provisioning-tutorial.md)

- [Figma](../saas-apps/figma-provisioning-tutorial.md)

- [Leapsome](../saas-apps/leapsome-provisioning-tutorial.md)

- [Peakon](../saas-apps/peakon-provisioning-tutorial.md)

- [Smartsheet](../saas-apps/smartsheet-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md)

---

### New Azure AD Domain Services service tag for Network Security Group

**Type:** New feature
**Service category:** Azure AD Domain Services
**Product capability:** Azure AD Domain Services

If you're tired of managing long lists of IP addresses and ranges, you can use the new **AzureActiveDirectoryDomainServices** network service tag in your Azure network security group to help secure inbound traffic to your Azure AD Domain Services virtual network subnet.

For more information about this new service tag, see [Network Security Groups for Azure AD Domain Services](../../active-directory-domain-services/network-considerations.md#network-security-groups-and-required-ports).

---

### New Security Audits for Azure AD Domain Services (Public Preview)

**Type:** New feature
**Service category:** Azure AD Domain Services
**Product capability:** Azure AD Domain Services

We're pleased to announce the release of Azure AD Domain Service Security Auditing to public preview. Security auditing helps provide you with critical insight into your authentication services by streaming security audit events to targeted resources, including Azure Storage, Azure Log Analytics workspaces, and Azure Event Hub, using the Azure AD Domain Service portal.

For more information, see [Enable Security Audits for Azure AD Domain Services (Preview)](../../active-directory-domain-services/security-audit-events.md).

---

### New Authentication methods usage & insights (Public Preview)

**Type:** New feature
**Service category:** Self Service Password Reset
**Product capability:** Monitoring & Reporting

The new Authentication methods usage & insights reports can help you to understand how features like Azure AD Multi-Factor Authentication and self-service password reset are being registered and used in your organization, including the number of registered users for each feature, how often self-service password reset is used to reset passwords, and by which method the reset happens.

For more information, see [Authentication methods usage & insights (preview)](../authentication/howto-authentication-methods-activity.md).

---

### New security reports are available for all Azure AD administrators (Public Preview)

**Type:** New feature
**Service category:** Identity Protection
**Product capability:** Identity Security & Protection

All Azure AD administrators can now select the banner at the top of existing security reports, such as the **Users flagged for risk** report, to start using the new security experience as shown in the **Risky users** and the **Risky sign-ins** reports. Over time, all of the security reports will move from the older versions to the new versions, with the new reports providing you the following additional capabilities:

- Advanced filtering and sorting

- Bulk actions, such as dismissing user risk

- Confirmation of compromised or safe entities

- Risk state, covering: At risk, Dismissed, Remediated, and Confirmed compromised

For more information, see [Risky users report](../identity-protection/howto-identity-protection-investigate-risk.md#risky-users) and [Risky sign-ins report](../identity-protection/howto-identity-protection-investigate-risk.md#risky-sign-ins).

---

### New Security Audits for Azure AD Domain Services (Public Preview)

**Type:** New feature
**Service category:** Azure AD Domain Services
**Product capability:** Azure AD Domain Services

We're pleased to announce the release of Azure AD Domain Service Security Auditing to public preview. Security auditing helps provide you with critical insight into your authentication services by streaming security audit events to targeted resources, including Azure Storage, Azure Log Analytics workspaces, and Azure Event Hub, using the Azure AD Domain Service portal.

For more information, see [Enable Security Audits for Azure AD Domain Services (Preview)](../../active-directory-domain-services/security-audit-events.md).

---

### New B2B direct federation using SAML/WS-Fed (Public Preview)

**Type:** New feature
**Service category:** B2B
**Product capability:** B2B/B2C

Direct federation helps to make it easier for you to work with partners whose IT-managed identity solution is not Azure AD, by working with identity systems that support the SAML or WS-Fed standards. After you set up a direct federation relationship with a partner, any new guest user you invite from that domain can collaborate with you using their existing organizational account, making the user experience for your guests more seamless.

For more information, see [Direct federation with AD FS and third-party providers for guest users (preview)](../external-identities/direct-federation.md).

---

### Automate user account provisioning for these newly supported SaaS apps

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** Monitoring & Reporting

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Dialpad](../saas-apps/dialpad-provisioning-tutorial.md)

- [Federated Directory](../saas-apps/federated-directory-provisioning-tutorial.md)

- [Figma](../saas-apps/figma-provisioning-tutorial.md)

- [Leapsome](../saas-apps/leapsome-provisioning-tutorial.md)

- [Peakon](../saas-apps/peakon-provisioning-tutorial.md)

- [Smartsheet](../saas-apps/smartsheet-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### New check for duplicate group names in the Azure AD portal

**Type:** New feature
**Service category:** Group Management
**Product capability:** Collaboration

Now, when you create or update a group name from the Azure AD portal, we'll perform a check to see if you are duplicating an existing group name in your resource. If we determine that the name is already in use by another group, you'll be asked to modify your name.

For more information, see [Manage groups in the Azure AD portal](./active-directory-groups-create-azure-portal.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context).

---

### Azure AD now supports static query parameters in reply (redirect) URIs

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Azure AD apps can now register and use reply (redirect) URIs with static query parameters (for example, `https://contoso.com/oauth2?idp=microsoft`) for OAuth 2.0 requests. The static query parameter is subject to string matching for reply URIs, just like any other part of the reply URI. If there's no registered string that matches the URL-decoded redirect-uri, the request is rejected. If the reply URI is found, the entire string is used to redirect the user, including the static query parameter.

Dynamic reply URIs are still forbidden because they represent a security risk and can't be used to retain state information across an authentication request. For this purpose, use the `state` parameter.

Currently, the app registration screens of the Azure portal still block query parameters. However, you can manually edit the app manifest to add and test query parameters in your app. For more information, see [What's new for authentication?](../develop/reference-breaking-changes.md#redirect-uris-can-now-contain-query-string-parameters).

---

### Activity logs (MS Graph APIs) for Azure AD are now available through PowerShell Cmdlets

**Type:** New feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

We're excited to announce that Azure AD activity logs (Audit and Sign-ins reports) are now available through the Azure AD PowerShell module. Previously, you could create your own scripts using MS Graph API endpoints, and now we've extended that capability to PowerShell cmdlets.

For more information about how to use these cmdlets, see [Azure AD PowerShell cmdlets for reporting](../reports-monitoring/reference-powershell-reporting.md).

---

### Updated filter controls for Audit and Sign-in logs in Azure AD

**Type:** Changed feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

We've updated the Audit and Sign-in log reports so you can now apply various filters without having to add them as columns on the report screens. Additionally, you can now decide how many filters you want to show on the screen. These updates all work together to make your reports easier to read and more scoped to your needs.

For more information about these updates, see [Filter audit logs](../reports-monitoring/concept-audit-logs.md#filtering-audit-logs) and [Filter sign-in activities](../reports-monitoring/concept-sign-ins.md#filter-sign-in-activities).

---

## June 2019

### New riskDetections API for Microsoft Graph (Public preview)

**Type:** New feature
**Service category:** Identity Protection
**Product capability:** Identity Security & Protection

We're pleased to announce the new riskDetections API for Microsoft Graph is now in public preview. You can use this new API to view a list of your organization's Identity Protection-related user and sign-in risk detections. You can also use this API to more efficiently query your risk detections, including details about the detection type, status, level, and more.

For more information, see the [Risk detection API reference documentation](/graph/api/resources/riskdetection?view=graph-rest-beta&preserve-view=true).

---

### New Federated Apps available in Azure AD app gallery - June 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In June 2019, we've added these 22 new apps with Federation support to the app gallery:

[Azure AD SAML Toolkit](../saas-apps/saml-toolkit-tutorial.md), [Otsuka Shokai (大塚商会)](../saas-apps/otsuka-shokai-tutorial.md), [ANAQUA](../saas-apps/anaqua-tutorial.md), [Azure VPN Client](https://portal.azure.com/), [ExpenseIn](../saas-apps/expensein-tutorial.md), [Helper Helper](../saas-apps/helper-helper-tutorial.md), [Costpoint](../saas-apps/costpoint-tutorial.md), [GlobalOne](../saas-apps/globalone-tutorial.md), [Mercedes-Benz In-Car Office](https://me.secure.mercedes-benz.com/), [Skore](https://app.justskore.it/), [Oracle Cloud Infrastructure Console](../saas-apps/oracle-cloud-tutorial.md), [CyberArk SAML Authentication](../saas-apps/cyberark-saml-authentication-tutorial.md), [Scrible Edu](https://www.scrible.com/sign-in/#/create-account), [PandaDoc](../saas-apps/pandadoc-tutorial.md), [Perceptyx](https://apexdata.azurewebsites.net/docs.microsoft.com/azure/active-directory/saas-apps/perceptyx-tutorial), [Proptimise OS](https://proptimise.co.uk/), [Vtiger CRM (SAML)](../saas-apps/vtiger-crm-saml-tutorial.md), Oracle Access Manager for Oracle Retail Merchandising, Oracle Access Manager for Oracle E-Business Suite, Oracle IDCS for E-Business Suite, Oracle IDCS for PeopleSoft, Oracle IDCS for JD Edwards

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Automate user account provisioning for these newly supported SaaS apps

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** Monitoring & Reporting

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Zoom](../saas-apps/zoom-provisioning-tutorial.md)

- [Envoy](../saas-apps/envoy-provisioning-tutorial.md)

- [Proxyclick](../saas-apps/proxyclick-provisioning-tutorial.md)

- [4me](../saas-apps/4me-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md)

---

### View the real-time progress of the Azure AD provisioning service

**Type:** Changed feature
**Service category:** App Provisioning
**Product capability:** Identity Lifecycle Management

We've updated the Azure AD provisioning experience to include a new progress bar that shows you how far you are in the user provisioning process. This updated experience also provides information about the number of users provisioned during the current cycle, as well as how many users have been provisioned to date.

For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md).

---

### Company branding now appears on sign out and error screens

**Type:** Changed feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

We've updated Azure AD so that your company branding now appears on the sign out and error screens, as well as the sign-in page. You don't have to do anything to turn on this feature, Azure AD simply uses the assets you've already set up in the **Company branding** area of the Azure portal.

For more information about setting up your company branding, see [Add branding to your organization's Azure Active Directory pages](./customize-branding.md).

---

### Azure Multi-Factor Authentication (MFA) Server is no longer available for new deployments

**Type:** Deprecated
**Service category:** MFA
**Product capability:** Identity Security & Protection

As of July 1, 2019, Microsoft will no longer offer MFA Server for new deployments. New customers who want to require multi-factor authentication in their organization must now use cloud-based Azure AD Multi-Factor Authentication. Customers who activated MFA Server prior to July 1 won't see a change. You'll still be able to download the latest version, get future updates, and generate activation credentials.

For more information, see [Getting started with the Azure Multi-Factor Authentication Server](../authentication/howto-mfaserver-deploy.md). For more information about cloud-based Azure AD Multi-Factor Authentication, see [Planning a cloud-based Azure AD Multi-Factor Authentication deployment](../authentication/howto-mfa-getstarted.md).

---

## May 2019

### Service change: Future support for only TLS 1.2 protocols on the Application Proxy service

**Type:** Plan for change
**Service category:** App Proxy
**Product capability:** Access Control

To help provide best-in-class encryption for our customers, we're limiting access to only TLS 1.2 protocols on the Application Proxy service. This change is gradually being rolled out to customers who are already only using TLS 1.2 protocols, so you shouldn't see any changes.

Deprecation of TLS 1.0 and TLS 1.1 happens on August 31, 2019, but we'll provide additional advanced notice, so you'll have time to prepare for this change. To prepare for this change make sure your client-server and browser-server combinations, including any clients your users use to access apps published through Application Proxy, are updated to use the TLS 1.2 protocol to maintain the connection to the Application Proxy service. For more information, see [Add an on-premises application for remote access through Application Proxy in Azure Active Directory](../manage-apps/application-proxy-add-on-premises-application.md#prerequisites).

---

### Use the usage and insights report to view your app-related sign-in data

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** Monitoring & Reporting

You can now use the usage and insights report, located in the **Enterprise applications** area of the Azure portal, to get an application-centric view of your sign-in data, including info about:

- Top used apps for your organization

- Apps with the most failed sign-ins

- Top sign-in errors for each app

For more information about this feature, see [Usage and insights report in the Azure Active Directory portal](../reports-monitoring/concept-usage-insights-report.md)

---

### Automate your user provisioning to cloud apps using Azure AD

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** Monitoring & Reporting

Follow these new tutorials to use the Azure AD Provisioning Service to automate the creation, deletion, and updating of user accounts for the following cloud-based apps:

- [Comeet](../saas-apps/comeet-recruiting-software-provisioning-tutorial.md)

- [DynamicSignal](../saas-apps/dynamic-signal-provisioning-tutorial.md)

- [KeeperSecurity](../saas-apps/keeper-password-manager-digitalvault-provisioning-tutorial.md)

You can also follow this new [Dropbox tutorial](../saas-apps/dropboxforbusiness-provisioning-tutorial.md), which provides info about how to provision group objects.

For more information about how to better secure your organization through automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### Identity secure score is now available in Azure AD (General availability)

**Type:** New feature
**Service category:** N/A
**Product capability:** Identity Security & Protection

You can now monitor and improve your identity security posture by using the identity secure score feature in Azure AD. The identity secure score feature uses a single dashboard to help you:

- Objectively measure your identity security posture, based on a score between 1 and 223.

- Plan for your identity security improvements

- Review the success of your security improvements

For more information about the identity security score feature, see [What is the identity secure score in Azure Active Directory?](./identity-secure-score.md).

---

### New App registrations experience is now available (General availability)

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** Developer Experience

The new [App registrations](https://aka.ms/appregistrations) experience is now in general availability. This new experience includes all the key features you're familiar with from the Azure portal and the Application Registration portal and improves upon them through:

- **Better app management.** Instead of seeing your apps across different portals, you can now see all your apps in one location.

- **Simplified app registration.** From the improved navigation experience to the revamped permission selection experience, it's now easier to register and manage your apps.

- **More detailed information.** You can find more details about your app, including quickstart guides and more.

For more information, see [Microsoft identity platform](../develop/index.yml) and the [App registrations experience is now generally available!](https://developer.microsoft.com/identity/blogs/new-app-registrations-experience-is-now-generally-available/) blog announcement.

---

### New capabilities available in the Risky Users API for Identity Protection

**Type:** New feature
**Service category:** Identity Protection
**Product capability:** Identity Security & Protection

We're pleased to announce that you can now use the Risky Users API to retrieve users' risk history, dismiss risky users, and to confirm users as compromised. This change helps you to more efficiently update the risk status of your users and understand their risk history.

For more information, see the [Risky Users API reference documentation](/graph/api/resources/riskyuser?view=graph-rest-beta&preserve-view=true).

---

### New Federated Apps available in Azure AD app gallery - May 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In May 2019, we've added these 21 new apps with Federation support to the app gallery:

[Freedcamp](../saas-apps/freedcamp-tutorial.md), [Real Links](../saas-apps/real-links-tutorial.md), [Kianda](https://app.kianda.com/sso/OpenID/AzureAD/), [Simple Sign](../saas-apps/simple-sign-tutorial.md), [Braze](../saas-apps/braze-tutorial.md), [Displayr](../saas-apps/displayr-tutorial.md), [Templafy](../saas-apps/templafy-tutorial.md), [Marketo Sales Engage](https://toutapp.com/login), [ACLP](../saas-apps/aclp-tutorial.md), [OutSystems](../saas-apps/outsystems-tutorial.md), [Meta4 Global HR](../saas-apps/meta4-global-hr-tutorial.md), [Quantum Workplace](../saas-apps/quantum-workplace-tutorial.md), [Cobalt](../saas-apps/cobalt-tutorial.md), [webMethods API Cloud](../saas-apps/webmethods-integration-cloud-tutorial.md), [RedFlag](https://pocketstop.com/redflag/), [Whatfix](../saas-apps/whatfix-tutorial.md), [Control](../saas-apps/control-tutorial.md), [JOBHUB](../saas-apps/jobhub-tutorial.md), [NEOGOV](../saas-apps/neogov-tutorial.md), [Foodee](../saas-apps/foodee-tutorial.md), [MyVR](../saas-apps/myvr-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Improved groups creation and management experiences in the Azure AD portal

**Type:** New feature
**Service category:** Group Management
**Product capability:** Collaboration

We've made improvements to the groups-related experiences in the Azure AD portal. These improvements allow administrators to better manage groups lists, members lists, and to provide additional creation options.

Improvements include:

- Basic filtering by membership type and group type.

- Addition of new columns, such as Source and Email address.

- Ability to multi-select groups, members, and owner lists for easy deletion.

- Ability to choose an email address and add owners during group creation.

For more information, see [Create a basic group and add members using Azure Active Directory](./active-directory-groups-create-azure-portal.md).

---

### Configure a naming policy for Office 365 groups in Azure AD portal (General availability)

**Type:** Changed feature
**Service category:** Group Management
**Product capability:** Collaboration

Administrators can now configure a naming policy for Office 365 groups, using the Azure AD portal. This change helps to enforce consistent naming conventions for Office 365 groups created or edited by users in your organization.

You can configure naming policy for Office 365 groups in two different ways:

- Define prefixes or suffixes, which are automatically added to a group name.

- Upload a customized set of blocked words for your organization, which are not allowed in group names (for example, "CEO, Payroll, HR").

For more information, see [Enforce a Naming Policy for Office 365 groups](../enterprise-users/groups-naming-policy.md).

---

### Microsoft Graph API endpoints are now available for Azure AD activity logs (General availability)

**Type:** Changed feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

We're happy to announce general availability of Microsoft Graph API endpoints support for Azure AD activity logs. With this release, you can now use Version 1.0 of both the Azure AD audit logs, as well as the sign-in logs APIs.

For more information, see [Azure AD audit log API overview](/graph/api/resources/azure-ad-auditlog-overview).

---

### Administrators can now use Conditional Access for the combined registration process (Public preview)

**Type:** New feature
**Service category:** Conditional Access
**Product capability:** Identity Security & Protection

Administrators can now create Conditional Access policies for use by the combined registration page. This includes applying policies to allow registration if:

- Users are on a trusted network.

- Users are a low sign-in risk.

- Users are on a managed device.

- Users agree to the organization's terms of use (TOU).

For more information about Conditional Access and password reset, you can see the [Conditional Access for the Azure AD combined MFA and password reset registration experience blog post](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Conditional-access-for-the-Azure-AD-combined-MFA-and-password/ba-p/566348). For more information about Conditional Access policies for the combined registration process, see [Conditional Access policies for combined registration](../authentication/howto-registration-mfa-sspr-combined.md#conditional-access-policies-for-combined-registration). For more information about the Azure AD terms of use feature, see [Azure Active Directory terms of use feature](../conditional-access/terms-of-use.md).

---

## April 2019

### New Azure AD threat intelligence detection is now available as part of Azure AD Identity Protection

**Type:** New feature
**Service category:** Azure AD Identity Protection
**Product capability:** Identity Security & Protection

Azure AD threat intelligence detection is now available as part of the updated Azure AD Identity Protection feature. This new functionality helps to indicate unusual user activity for a specific user or activity that's consistent with known attack patterns based on Microsoft's internal and external threat intelligence sources.

For more information about the refreshed version of Azure AD Identity Protection, see the [Four major Azure AD Identity Protection enhancements are now in public preview](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Four-major-Azure-AD-Identity-Protection-enhancements-are-now-in/ba-p/326935) blog and the [What is Azure Active Directory Identity Protection (refreshed)?](../identity-protection/overview-identity-protection.md) article. For more information about Azure AD threat intelligence detection, see the [Azure Active Directory Identity Protection risk detections](../identity-protection/concept-identity-protection-risks.md) article.

---

### Azure AD entitlement management is now available (Public preview)

**Type:** New feature
**Service category:** Identity Governance
**Product capability:** Identity Governance

Azure AD entitlement management, now in public preview, helps customers to delegate management of access packages, which defines how employees and business partners can request access, who must approve, and how long they have access. Access packages can manage membership in Azure AD and Office 365 groups, role assignments in enterprise applications, and role assignments for SharePoint Online sites. Read more about entitlement management at the [overview of Azure AD entitlement management](../governance/entitlement-management-overview.md). To learn more about the breadth of Azure AD Identity Governance features, including Privileged Identity Management, access reviews and terms of use, see [What is Azure AD Identity Governance?](../governance/identity-governance-overview.md).

---

### Configure a naming policy for Office 365 groups in Azure AD portal (Public preview)

**Type:** New feature
**Service category:** Group Management
**Product capability:** Collaboration

Administrators can now configure a naming policy for Office 365 groups, using the Azure AD portal. This change helps to enforce consistent naming conventions for Office 365 groups created or edited by users in your organization.

You can configure naming policy for Office 365 groups in two different ways:

- Define prefixes or suffixes, which are automatically added to a group name.

- Upload a customized set of blocked words for your organization, which are not allowed in group names (for example, "CEO, Payroll, HR").

For more information, see [Enforce a Naming Policy for Office 365 groups](../enterprise-users/groups-naming-policy.md).

---

### Azure AD Activity logs are now available in Azure Monitor (General availability)

**Type:** New feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

To help address your feedback about visualizations with the Azure AD Activity logs, we're introducing a new Insights feature in Log Analytics. This feature helps you gain insights about your Azure AD resources by using our interactive templates, called Workbooks. These pre-built Workbooks can provide details for apps or users, and include:

- **Sign-ins.** Provides details for apps and users, including sign-in location, the in-use operating system or browser client and version, and the number of successful or failed sign-ins.

- **Legacy authentication and Conditional Access.** Provides details for apps and users using legacy authentication, including Multi-Factor Authentication usage triggered by Conditional Access policies, apps using Conditional Access policies, and so on.

- **Sign-in failure analysis.** Helps you to determine if your sign-in errors are occurring due to a user action, policy issues, or your infrastructure.

- **Custom reports.** You can create new, or edit existing Workbooks to help customize the Insights feature for your organization.

For more information, see [How to use Azure Monitor workbooks for Azure Active Directory reports](../reports-monitoring/howto-use-azure-monitor-workbooks.md).

---

### New Federated Apps available in Azure AD app gallery - April 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In April 2019, we've added these 21 new apps with Federation support to the app gallery:

[SAP Fiori](../saas-apps/sap-fiori-tutorial.md), [HRworks Single Sign-On](../saas-apps/hrworks-single-sign-on-tutorial.md), [Percolate](../saas-apps/percolate-tutorial.md), [MobiControl](../saas-apps/mobicontrol-tutorial.md), [Citrix NetScaler](../saas-apps/citrix-netscaler-tutorial.md), [Shibumi](../saas-apps/shibumi-tutorial.md), [Benchling](../saas-apps/benchling-tutorial.md), [MileIQ](https://mileiq.onelink.me/991934284/7e980085), [PageDNA](../saas-apps/pagedna-tutorial.md), [EduBrite LMS](../saas-apps/edubrite-lms-tutorial.md), [RStudio Connect](../saas-apps/rstudio-connect-tutorial.md), [AMMS](../saas-apps/amms-tutorial.md), [Mitel Connect](../saas-apps/mitel-connect-tutorial.md), [Alibaba Cloud (Role-based SSO)](../saas-apps/alibaba-cloud-service-role-based-sso-tutorial.md), [Certent Equity Management](../saas-apps/certent-equity-management-tutorial.md), [Sectigo Certificate Manager](../saas-apps/sectigo-certificate-manager-tutorial.md), [GreenOrbit](../saas-apps/greenorbit-tutorial.md), [Workgrid](../saas-apps/workgrid-tutorial.md), [monday.com](../saas-apps/mondaycom-tutorial.md), [SurveyMonkey Enterprise](../saas-apps/surveymonkey-enterprise-tutorial.md), [Indiggo](https://indiggolead.com/)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### New access reviews frequency option and multiple role selection

**Type:** New feature
**Service category:** Access Reviews
**Product capability:** Identity Governance

New updates in Azure AD access reviews allow you to:

- Change the frequency of your access reviews to **semi-annually**, in addition to the previously existing options of weekly, monthly, quarterly, and annually.

- Select multiple Azure AD and Azure resource roles when creating a single access review. In this situation, all roles are set up with the same settings and all reviewers are notified at the same time.

For more information about how to create an access review, see [Create an access review of groups or applications in Azure AD access reviews](../governance/create-access-review.md).

---

### Azure AD Connect email alert system(s) are transitioning, sending new email sender information for some customers

**Type:** Changed feature
**Service category:** AD Sync
**Product capability:** Platform

Azure AD Connect is in the process of transitioning our email alert system(s), potentially showing some customers a new email sender. To address this, you must add `azure-noreply@microsoft.com` to your organization's allowlist or you won't be able to continue receiving important alerts from your Office 365, Azure, or your Sync services.

---

### UPN suffix changes are now successful between Federated domains in Azure AD Connect

**Type:** Fixed
**Service category:** AD Sync
**Product capability:** Platform

You can now successfully change a user's UPN suffix from one Federated domain to another Federated domain in Azure AD Connect. This fix means you should no longer experience the FederatedDomainChangeError error message during the synchronization cycle or receive a notification email stating, "Unable to update this object in Azure Active Directory, because the attribute [FederatedUser.UserPrincipalName], is not valid. Update the value in your local directory services".

For more information, see [Troubleshooting Errors during synchronization](../hybrid/tshoot-connect-sync-errors.md#federateddomainchangeerror).

---

### Increased security using the app protection-based Conditional Access policy in Azure AD (Public preview)

**Type:** New feature
**Service category:** Conditional Access
**Product capability:** Identity Security & Protection

App protection-based Conditional Access is now available by using the **Require app protection** policy. This new policy helps to increase your organization's security by helping to prevent:

- Users gaining access to apps without a Microsoft Intune license.

- Users being unable to get a Microsoft Intune app protection policy.

- Users gaining access to apps without a configured Microsoft Intune app protection policy.

For more information, see [How to Require app protection policy for cloud app access with Conditional Access](../conditional-access/app-protection-based-conditional-access.md).

---

### New support for Azure AD single sign-on and Conditional Access in Microsoft Edge (Public preview)

**Type:** New feature
**Service category:** Conditional Access
**Product capability:** Identity Security & Protection

We've enhanced our Azure AD support for Microsoft Edge, including providing new support for Azure AD single sign-on and Conditional Access. If you've previously used Microsoft Intune Managed Browser, you can now use Microsoft Edge instead.

For more information about setting up and managing your devices and apps using Conditional Access, see [Require managed devices for cloud app access with Conditional Access](../conditional-access/require-managed-devices.md) and [Require approved client apps for cloud app access with Conditional Access](../conditional-access/app-based-conditional-access.md). For more information about how to manage access using Microsoft Edge with Microsoft Intune policies, see [Manage Internet access using a Microsoft Intune policy-protected browser](/intune/app-configuration-managed-browser).

---

## March 2019

### Identity Experience Framework and custom policy support in Azure Active Directory B2C is now available (GA)

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

You can now create custom policies in Azure AD B2C, including the following tasks, which are supported at-scale and under our Azure SLA:

- Create and upload custom authentication user journeys by using custom policies.

- Describe user journeys step-by-step as exchanges between claims providers.

- Define conditional branching in user journeys.

- Transform and map claims for use in real-time decisions and communications.

- Use REST API-enabled services in your custom authentication user journeys. For example, with email providers, CRMs, and proprietary authorization systems.

- Federate with identity providers who are compliant with the OpenIDConnect protocol. For example, with multi-tenant Azure AD, social account providers, or two-factor verification providers.

For more information about creating custom policies, see [Developer notes for custom policies in Azure Active Directory B2C](../../active-directory-b2c/custom-policy-developer-notes.md) and read [Alex Simon's blog post, including case studies](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-B2C-custom-policies-to-build-your-own-identity-journeys/ba-p/382791).

---

### New Federated Apps available in Azure AD app gallery - March 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In March 2019, we've added these 14 new apps with Federation support to the app gallery:

[ISEC7 Mobile Exchange Delegate](https://www.isec7.com/english/), [MediusFlow](https://office365.cloudapp.mediusflow.com/), [ePlatform](../saas-apps/eplatform-tutorial.md), [Fulcrum](../saas-apps/fulcrum-tutorial.md), [ExcelityGlobal](../saas-apps/excelityglobal-tutorial.md), [Explanation-Based Auditing System](../saas-apps/explanation-based-auditing-system-tutorial.md), [Lean](../saas-apps/lean-tutorial.md), [Powerschool Performance Matters](../saas-apps/powerschool-performance-matters-tutorial.md), [Cinode](https://cinode.com/), [Iris Intranet](../saas-apps/iris-intranet-tutorial.md), [Empactis](../saas-apps/empactis-tutorial.md), [SmartDraw](../saas-apps/smartdraw-tutorial.md), [Confirmit Horizons](../saas-apps/confirmit-horizons-tutorial.md), [TAS](../saas-apps/tas-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### New Zscaler and Atlassian provisioning connectors in the Azure AD gallery - March 2019

**Type:** New feature
**Service category:** App Provisioning
**Product capability:** 3rd Party Integration

Automate creating, updating, and deleting user accounts for the following apps:

[Zscaler](../saas-apps/zscaler-provisioning-tutorial.md), [Zscaler Beta](../saas-apps/zscaler-beta-provisioning-tutorial.md), [Zscaler One](../saas-apps/zscaler-one-provisioning-tutorial.md), [Zscaler Two](../saas-apps/zscaler-two-provisioning-tutorial.md), [Zscaler Three](../saas-apps/zscaler-three-provisioning-tutorial.md), [Zscaler ZSCloud](../saas-apps/zscaler-zscloud-provisioning-tutorial.md), [Atlassian Cloud](../saas-apps/atlassian-cloud-provisioning-tutorial.md)

For more information about how to better secure your organization through automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### Restore and manage your deleted Office 365 groups in the Azure AD portal

**Type:** New feature
**Service category:** Group Management
**Product capability:** Collaboration

You can now view and manage your deleted Office 365 groups from the Azure AD portal. This change helps you to see which groups are available to restore, along with letting you permanently delete any groups that aren't needed by your organization.

For more information, see [Restore expired or deleted groups](../enterprise-users/groups-restore-deleted.md#view-and-manage-the-deleted-microsoft-365-groups-that-are-available-to-restore).

---

### Single sign-on is now available for Azure AD SAML-secured on-premises apps through Application Proxy (public preview)

**Type:** New feature
**Service category:** App Proxy
**Product capability:** Access Control

You can now provide a single sign-on (SSO) experience for on-premises, SAML-authenticated apps, along with remote access to these apps through Application Proxy. For more information about how to set up SAML SSO with your on-premises apps, see [SAML single sign-on for on-premises applications with Application Proxy (Preview)](../manage-apps/application-proxy-configure-single-sign-on-on-premises-apps.md).

---

### Client apps in request loops will be interrupted to improve reliability and user experience

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Client apps can incorrectly issue hundreds of the same login requests over a short period of time. These requests, whether they're successful or not, all contribute to a poor user experience and heightened workloads for the IDP, increasing latency for all users and reducing the availability of the IDP.

This update sends an `invalid_grant` error: `AADSTS50196: The server terminated an operation because it encountered a loop while processing a request` to client apps that issue duplicate requests multiple times over a short period of time, beyond the scope of normal operation. Client apps that encounter this issue should show an interactive prompt, requiring the user to sign in again. For more information about this change and about how to fix your app if it encounters this error, see [What's new for authentication?](../develop/reference-breaking-changes.md#looping-clients-will-be-interrupted).

---

### New Audit Logs user experience now available

**Type:** Changed feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

We've created a new Azure AD **Audit logs** page to help improve both readability and how you search for your information. To see the new **Audit logs** page, select **Audit logs** in the **Activity** section of Azure AD.

![New Audit logs page, with sample info](media/whats-new/audit-logs-page.png)

For more information about the new **Audit logs** page, see [Audit activity reports in the Azure Active Directory portal](../reports-monitoring/concept-audit-logs.md#audit-logs).

---

### New warnings and guidance to help prevent accidental administrator lockout from misconfigured Conditional Access policies

**Type:** Changed feature
**Service category:** Conditional Access
**Product capability:** Identity Security & Protection

To help prevent administrators from accidentally locking themselves out of their own tenants through misconfigured Conditional Access policies, we've created new warnings and updated guidance in the Azure portal. For more information about the new guidance, see [What are service dependencies in Azure Active Directory Conditional Access](../conditional-access/service-dependencies.md).

---

### Improved end-user terms of use experiences on mobile devices

**Type:** Changed feature
**Service category:** Terms of use
**Product capability:** Governance

We've updated our existing terms of use experiences to help improve how you review and consent to terms of use on a mobile device. You can now zoom in and out, go back, download the information, and select hyperlinks. For more information about the updated terms of use, see [Azure Active Directory terms of use feature](../conditional-access/terms-of-use.md#what-terms-of-use-looks-like-for-users).

---

### New Azure AD Activity logs download experience available

**Type:** Changed feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

You can now download large amounts of activity logs directly from the Azure portal. This update lets you:

- Download up to 250,000 rows.

- Get notified after the download completes.

- Customize your file name.

- Determine your output format, either JSON or CSV.

For more information about this feature, see [Quickstart: Download an audit report using the Azure portal](../reports-monitoring/quickstart-download-audit-report.md)

---

### Breaking change: Updates to condition evaluation by Exchange ActiveSync (EAS)

**Type:** Plan for change
**Service category:** Conditional Access
**Product capability:** Access Control

We're in the process of updating how Exchange ActiveSync (EAS) evaluates the following conditions:

- User location, based on country, region, or IP address

- Sign-in risk

- Device platform

If you've previously used these conditions in your Conditional Access policies, be aware that the condition behavior might change. For example, if you previously used the user location condition in a policy, you might find the policy now being skipped based on the location of your user.

---

## February 2019

### Configurable Azure AD SAML token encryption (Public preview)

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** SSO

You can now configure any supported SAML app to receive encrypted SAML tokens. When configured and used with an app, Azure AD encrypts the emitted SAML assertions using a public key obtained from a certificate stored in Azure AD.

For more information about configuring your SAML token encryption, see [Configure Azure AD SAML token encryption](../manage-apps/howto-saml-token-encryption.md).

---

### Create an access review for groups or apps using Azure AD Access Reviews

**Type:** New feature
**Service category:** Access Reviews
**Product capability:** Governance

You can now include multiple groups or apps in a single Azure AD access review for group membership or app assignment. Access reviews with multiple groups or apps are set up using the same settings and all included reviewers are notified at the same time.

For more information about how create an access review using Azure AD Access Reviews, see [Create an access review of groups or applications in Azure AD Access Reviews](../governance/create-access-review.md)

---

### New Federated Apps available in Azure AD app gallery - February 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In February 2019, we've added these 27 new apps with Federation support to the app gallery:

[Euromonitor Passport](../saas-apps/euromonitor-passport-tutorial.md), [MindTickle](../saas-apps/mindtickle-tutorial.md), [FAT FINGER](https://seeforgetest-exxon.azurewebsites.net/Account/create?Length=7), [AirStack](../saas-apps/airstack-tutorial.md), [Oracle Fusion ERP](../saas-apps/oracle-fusion-erp-tutorial.md), [IDrive](../saas-apps/idrive-tutorial.md), [Skyward Qmlativ](../saas-apps/skyward-qmlativ-tutorial.md), [Brightidea](../saas-apps/brightidea-tutorial.md), [AlertOps](../saas-apps/alertops-tutorial.md), [Soloinsight-CloudGate SSO](../saas-apps/soloinsight-cloudgate-sso-tutorial.md), Permission Click, [Brandfolder](../saas-apps/brandfolder-tutorial.md), [StoregateSmartFile](../saas-apps/smartfile-tutorial.md), [Pexip](../saas-apps/pexip-tutorial.md), [Stormboard](../saas-apps/stormboard-tutorial.md), [Seismic](../saas-apps/seismic-tutorial.md), [Share A Dream](https://www.shareadream.org/how-it-works), [Bugsnag](../saas-apps/bugsnag-tutorial.md), [webMethods Integration Cloud](../saas-apps/webmethods-integration-cloud-tutorial.md), [Knowledge Anywhere LMS](../saas-apps/knowledge-anywhere-lms-tutorial.md), [OU Campus](../saas-apps/ou-campus-tutorial.md), [Periscope Data](../saas-apps/periscope-data-tutorial.md), [Netop Portal](../saas-apps/netop-portal-tutorial.md), [smartvid.io](../saas-apps/smartvid.io-tutorial.md), [PureCloud by Genesys](../saas-apps/purecloud-by-genesys-tutorial.md), [ClickUp Productivity Platform](../saas-apps/clickup-productivity-platform-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Enhanced combined MFA/SSPR registration

**Type:** Changed feature
**Service category:** Self Service Password Reset
**Product capability:** User Authentication

In response to customer feedback, we've enhanced the combined MFA/SSPR registration preview experience, helping your users to more quickly register their security info for both MFA and SSPR.

**To turn on the enhanced experience for your users' today, follow these steps:**

1. As a global administrator or user administrator, sign in to the Azure portal and go to **Azure Active Directory > User settings > Manage settings for access panel preview features**.

2. In the **Users who can use the preview features for registering and managing security info – refresh** option, choose to turn on the features for a **Selected group of users** or for **All users**.

Over the next few weeks, we'll be removing the ability to turn on the old combined MFA/SSPR registration preview experience for tenants that don't already have it turned on.

**To see if the control will be removed for your tenant, follow these steps:**

1. As a global administrator or user administrator, sign in to the Azure portal and go to **Azure Active Directory > User settings > Manage settings for access panel preview features**.

2. If the **Users who can use the preview features for registering and managing security info** option is set to **None**, the option will be removed from your tenant.

Regardless of whether you previously turned on the old combined MFA/SSPR registration preview experience for users or not, the old experience will be turned off at a future date. Because of that, we strongly suggest that you move to the new, enhanced experience as soon as possible.

For more information about the enhanced registration experience, see the [Cool enhancements to the Azure AD combined MFA and password reset registration experience](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Cool-enhancements-to-the-Azure-AD-combined-MFA-and-password/ba-p/354271).

---

### Updated policy management experience for user flows

**Type:** Changed feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

We've updated the policy creation and management process for user flows (previously known as, built-in policies) easier. This new experience is now the default for all of your Azure AD tenants.

You can provide additional feedback and suggestions by using the smile or frown icons in the **Send us feedback** area at the top of the portal screen.

For more information about the new policy management experience, see the [Azure AD B2C now has JavaScript customization and many more new features](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-B2C-now-has-JavaScript-customization-and-many-more-new/ba-p/353595) blog.

---

### Choose specific page element versions provided by Azure AD B2C

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

You can now choose a specific version of the page elements provided by Azure AD B2C. By selecting a specific version, you can test your updates before they appear on a page and you can get predictable behavior. Additionally, you can now opt in to enforce specific page versions to allow JavaScript customizations. To turn on this feature, go to the **Properties** page in your user flows.

For more information about choosing specific versions of page elements, see the [Azure AD B2C now has JavaScript customization and many more new features](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-B2C-now-has-JavaScript-customization-and-many-more-new/ba-p/353595) blog.

---

### Configurable end-user password requirements for B2C (GA)

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

You can now set up your organization's password complexity for your end users, instead of having to use your native Azure AD password policy. From the **Properties** blade of your user flows (previously known as your built-in policies), you can choose a password complexity of **Simple** or **Strong**, or you can create a **Custom** set of requirements.

For more information about password complexity requirement configuration, see [Configure complexity requirements for passwords in Azure Active Directory B2C](../../active-directory-b2c/password-complexity.md).

---

### New default templates for custom branded authentication experiences

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

You can use our new default templates, located on the **Page layouts** blade of your user flows (previously known as built-in policies), to create a custom branded authentication experience for your users.

For more information about using the templates, see [Azure AD B2C now has JavaScript customization and many more new features](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-B2C-now-has-JavaScript-customization-and-many-more-new/ba-p/353595).

---

## January 2019

### Active Directory B2B collaboration using one-time passcode authentication (Public preview)

**Type:** New feature
**Service category:** B2B
**Product capability:** B2B/B2C

We've introduced one-time passcode authentication (OTP) for B2B guest users who can't be authenticated through other means like Azure AD, a Microsoft account (MSA), or Google federation. This new authentication method means that guest users don't have to create a new Microsoft account. Instead, while redeeming an invitation or accessing a shared resource, a guest user can request a temporary code to be sent to an email address. Using this temporary code, the guest user can continue to sign in.

For more information, see [Email one-time passcode authentication (preview)](../external-identities/one-time-passcode.md) and the blog, [Azure AD makes sharing and collaboration seamless for any user with any account](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-makes-sharing-and-collaboration-seamless-for-any-user/ba-p/325949).

### New Azure AD Application Proxy cookie settings

**Type:** New feature
**Service category:** App Proxy
**Product capability:** Access Control

We've introduced three new cookie settings, available for your apps that are published through Application Proxy:

- **Use HTTP-Only cookie.** Sets the **HTTPOnly** flag on your Application Proxy access and session cookies. Turning on this setting provides additional security benefits, such as helping to prevent copying or modifying of cookies through client-side scripting. We recommend you turn on this flag (choose **Yes**) for the added benefits.

- **Use secure cookie.** Sets the **Secure** flag on your Application Proxy access and session cookies. Turning on this setting provides additional security benefits, by making sure cookies are only transmitted over TLS secure channels, such as HTTPS. We recommend you turn on this flag (choose **Yes**) for the added benefits.

- **Use persistent cookie.** Prevents access cookies from expiring when the web browser is closed. These cookies last for the lifetime of the access token. However, the cookies are reset if the expiration time is reached or if the user manually deletes the cookie. We recommend you keep the default setting **No**, only turning on the setting for older apps that don't share cookies between processes.

For more information about the new cookies, see [Cookie settings for accessing on-premises applications in Azure Active Directory](../manage-apps/application-proxy-configure-cookie-settings.md).

---

### New Federated Apps available in Azure AD app gallery - January 2019

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In January 2019, we've added these 35 new apps with Federation support to the app gallery:

[Firstbird](../saas-apps/firstbird-tutorial.md), [Folloze](../saas-apps/folloze-tutorial.md), [Talent Palette](../saas-apps/talent-palette-tutorial.md), [Infor CloudSuite](../saas-apps/infor-cloud-suite-tutorial.md), [Cisco Umbrella](../saas-apps/cisco-umbrella-tutorial.md), [Zscaler Internet Access Administrator](../saas-apps/zscaler-internet-access-administrator-tutorial.md), [Expiration Reminder](../saas-apps/expiration-reminder-tutorial.md), [InstaVR Viewer](../saas-apps/instavr-viewer-tutorial.md), [CorpTax](../saas-apps/corptax-tutorial.md), [Verb](https://app.verb.net/login), [OpenLattice](https://openlattice.com/agora), [TheOrgWiki](https://www.theorgwiki.com/signup), [Pavaso Digital Close](../saas-apps/pavaso-digital-close-tutorial.md), [GoodPractice Toolkit](../saas-apps/goodpractice-toolkit-tutorial.md), [Cloud Service PICCO](../saas-apps/cloud-service-picco-tutorial.md), [AuditBoard](../saas-apps/auditboard-tutorial.md), [iProva](../saas-apps/iprova-tutorial.md), [Workable](../saas-apps/workable-tutorial.md), [CallPlease](https://webapp.callplease.com/create-account/create-account.html), [GTNexus SSO System](../saas-apps/gtnexus-sso-module-tutorial.md), [CBRE ServiceInsight](../saas-apps/cbre-serviceinsight-tutorial.md), [Deskradar](../saas-apps/deskradar-tutorial.md), [Coralogixv](../saas-apps/coralogix-tutorial.md), [Signagelive](../saas-apps/signagelive-tutorial.md), [ARES for Enterprise](../saas-apps/ares-for-enterprise-tutorial.md), [K2 for Office 365](https://www.k2.com/O365), [Xledger](https://www.xledger.net/), [iDiD Manager](../saas-apps/idid-manager-tutorial.md), [HighGear](../saas-apps/highgear-tutorial.md), [Visitly](../saas-apps/visitly-tutorial.md), [Korn Ferry ALP](../saas-apps/korn-ferry-alp-tutorial.md), [Acadia](../saas-apps/acadia-tutorial.md), [Adoddle cSaas Platform](../saas-apps/adoddle-csaas-platform-tutorial.md)<!-- , [CaféX Portal (Meetings)](https://docs.microsoft.com/azure/active-directory/saas-apps/cafexportal-meetings-tutorial), [MazeMap Link](https://docs.microsoft.com/azure/active-directory/saas-apps/mazemaplink-tutorial)-->

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### New Azure AD Identity Protection enhancements (Public preview)

**Type:** Changed feature
**Service category:** Identity Protection
**Product capability:** Identity Security & Protection

We're excited to announce that we've added the following enhancements to the Azure AD Identity Protection public preview offering, including:

- An updated and more integrated user interface

- Additional APIs

- Improved risk assessment through machine learning

- Product-wide alignment across risky users and risky sign-ins

For more information about the enhancements, see [What is Azure Active Directory Identity Protection (refreshed)?](../identity-protection/overview-identity-protection.md) to learn more and to share your thoughts through the in-product prompts.

---

### New App Lock feature for the Microsoft Authenticator app on iOS and Android devices

**Type:** New feature
**Service category:** Microsoft Authenticator App
**Product capability:** Identity Security & Protection

To keep your one-time passcodes, app information, and app settings more secure, you can turn on the App Lock feature in the Microsoft Authenticator app. Turning on App Lock means you'll be asked to authenticate using your PIN or biometric every time you open the Microsoft Authenticator app.

For more information, see the [Microsoft Authenticator app FAQ](../user-help/user-help-auth-app-faq.md).

---

### Enhanced Azure AD Privileged Identity Management (PIM) export capabilities

**Type:** New feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

Privileged Identity Management (PIM) administrators can now export all active and eligible role assignments for a specific resource, which includes role assignments for all child resources. Previously, it was difficult for administrators to get a complete list of role assignments for a subscription and they had to export role assignments for each specific resource.

For more information, see [View activity and audit history for Azure resource roles in PIM](../privileged-identity-management/azure-pim-resource-rbac.md).

---

## November/December 2018

### Users removed from synchronization scope no longer switch to cloud-only accounts

**Type:** Fixed
**Service category:** User Management
**Product capability:** Directory

>[!Important]
>We've heard and understand your frustration because of this fix. Therefore, we've reverted this change until such time that we can make the fix easier for you to implement in your organization.

We've fixed a bug in which the DirSyncEnabled flag of a user would be erroneously switched to **False** when the Active Directory Domain Services (AD DS) object was excluded from synchronization scope and then moved to the Recycle Bin in Azure AD on the following sync cycle. As a result of this fix, if the user is excluded from sync scope and afterwards restored from Azure AD Recycle Bin, the user account remains as synchronized from on-premises AD, as expected, and cannot be managed in the cloud since its source of authority (SoA) remains as on-premises AD.

Prior to this fix, there was an issue when the DirSyncEnabled flag was switched to False. It gave the wrong impression that these accounts were converted to cloud-only objects and that the accounts could be managed in the cloud. However, the accounts still retained their SoA as on-premises and all synchronized properties (shadow attributes) coming from on-premises AD. This condition caused multiple issues in Azure AD and other cloud workloads (like Exchange Online) that expected to treat these accounts as synchronized from AD but were now behaving like cloud-only accounts.

At this time, the only way to truly convert a synchronized-from-AD account to cloud-only account is by disabling DirSync at the tenant level, which triggers a backend operation to transfer the SoA. This type of SoA change requires (but is not limited to) cleaning all the on-premises related attributes (such as LastDirSyncTime and shadow attributes) and sending a signal to other cloud workloads to have its respective object converted to a cloud-only account too.

This fix consequently prevents direct updates on the ImmutableID attribute of a user synchronized from AD, which in some scenarios in the past were required. By design, the ImmutableID of an object in Azure AD, as the name implies, is meant to be immutable. New features implemented in Azure AD Connect Health and Azure AD Connect Synchronization client are available to address such scenarios:

- **Large-scale ImmutableID update for many users in a staged approach**

  For example, you need to do a lengthy AD DS inter-forest migration. Solution: Use Azure AD Connect to **Configure Source Anchor** and, as the user migrates, copy the existing ImmutableID values from Azure AD into the local AD DS user's ms-DS-Consistency-Guid attribute of the new forest. For more information, see [Using ms-DS-ConsistencyGuid as sourceAnchor](../hybrid/plan-connect-design-concepts.md#using-ms-ds-consistencyguid-as-sourceanchor).

- **Large-scale ImmutableID updates for many users in one shot**

  For example, while implementing Azure AD Connect you make a mistake, and now you need to change the SourceAnchor attribute. Solution: Disable DirSync at the tenant level and clear all the invalid ImmutableID values. For more information, see [Turn off directory synchronization for Office 365](/office365/enterprise/turn-off-directory-synchronization).

- **Rematch on-premises user with an existing user in Azure AD**
  For example, a user that has been re-created in AD DS generates a duplicate in Azure AD account instead of rematching it with an existing Azure AD account (orphaned object). Solution: Use Azure AD Connect Health in the Azure portal to remap the Source Anchor/ImmutableID. For more information, see [Orphaned object scenario](../hybrid/how-to-connect-health-diagnose-sync-errors.md#orphaned-object-scenario).

### Breaking Change: Updates to the audit and sign-in logs schema through Azure Monitor

**Type:** Changed feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

We're currently publishing both the Audit and Sign-in log streams through Azure Monitor, so you can seamlessly integrate the log files with your SIEM tools or with Log Analytics. Based on your feedback, and in preparation for this feature's general availability announcement, we're making the following changes to our schema. These schema changes and its related documentation updates will happen by the first week of January.

#### New fields in the Audit schema
We're adding a new **Operation Type** field, to provide the type of operation performed on the resource. For example, **Add**, **Update**, or **Delete**.

#### Changed fields in the Audit schema
The following fields are changing in the Audit schema:

|Field name|What changed|Old values|New Values|
|----------|------------|----------|----------|
|Category|This was the **Service Name** field. It's now the **Audit Categories** field. **Service Name** has been renamed to the **loggedByService** field.|<ul><li>Account Provisioning</li><li>Core Directory</li><li>Self-service Password Reset</li></ul>|<ul><li>User Management</li><li>Group Management</li><li>App Management</li></ul>|
|targetResources|Includes **TargetResourceType** at the top level.|&nbsp;|<ul><li>Policy</li><li>App</li><li>User</li><li>Group</li></ul>|
|loggedByService|Provides the name of the service that generated the audit log.|Null|<ul><li>Account Provisioning</li><li>Core Directory</li><li>Self-service password reset</li></ul>|
|Result|Provides the result of the audit logs. Previously, this was enumerated, but we now show the actual value.|<ul><li>0</li><li>1</li></ul>|<ul><li>Success</li><li>Failure</li></ul>|

#### Changed fields in the Sign-in schema
The following fields are changing in the Sign-in schema:

|Field name|What changed|Old values|New Values|
|----------|------------|----------|----------|
|appliedConditionalAccessPolicies|This was the **conditionalaccessPolicies** field. It's now the **appliedConditionalAccessPolicies** field.|No change|No change|
|conditionalAccessStatus|Provides the result of the Conditional Access Policy Status at sign-in. Previously, this was enumerated, but we now show the actual value.|<ul><li>0</li><li>1</li><li>2</li><li>3</li></ul>|<ul><li>Success</li><li>Failure</li><li>Not Applied</li><li>Disabled</li></ul>|
|appliedConditionalAccessPolicies: result|Provides the result of the individual Conditional Access Policy Status at sign-in. Previously, this was enumerated, but we now show the actual value.|<ul><li>0</li><li>1</li><li>2</li><li>3</li></ul>|<ul><li>Success</li><li>Failure</li><li>Not Applied</li><li>Disabled</li></ul>|

For more information about the schema, see [Interpret the Azure AD audit logs schema in Azure Monitor (preview)](../reports-monitoring/reference-azure-monitor-audit-log-schema.md)

---

### Identity Protection improvements to the supervised machine learning model and the risk score engine

**Type:** Changed feature
**Service category:** Identity Protection
**Product capability:** Risk Scores

Improvements to the Identity Protection-related user and sign-in risk assessment engine can help to improve user risk accuracy and coverage. Administrators may notice that user risk level is no longer directly linked to the risk level of specific detections, and that there's an increase in the number and level of risky sign-in events.

Risk detections are now evaluated by the supervised machine learning model, which calculates user risk by using additional features of the user's sign-ins and a pattern of detections. Based on this model, the administrator might find users with high risk scores, even if detections associated with that user are of low or medium risk.

---

### Administrators can reset their own password using the Microsoft Authenticator app (Public preview)

**Type:** Changed feature
**Service category:** Self Service Password Reset
**Product capability:** User Authentication

Azure AD administrators can now reset their own password using the Microsoft Authenticator app notifications or a code from any mobile authenticator app or hardware token. To reset their own password, administrators will now be able to use two of the following methods:

- Microsoft Authenticator app notification

- Other mobile authenticator app / Hardware token code

- Email

- Phone call

- Text message

For more information about using the Microsoft Authenticator app to reset passwords, see [Azure AD self-service password reset - Mobile app and SSPR (Preview)](../authentication/concept-sspr-howitworks.md#mobile-app-and-sspr)

---

### New Azure AD Cloud Device Administrator role (Public preview)

**Type:** New feature
**Service category:** Device Registration and Management
**Product capability:** Access control

Administrators can assign users to the new Cloud Device Administrator role to perform cloud device administrator tasks. Users assigned the Cloud Device Administrators role can enable, disable, and delete devices in Azure AD, along with being able to read Windows 10 BitLocker keys (if present) in the Azure portal.

For more information about roles and permissions, see [Assigning administrator roles in Azure Active Directory](../roles/permissions-reference.md)

---

### Manage your devices using the new activity timestamp in Azure AD (Public preview)

**Type:** New feature
**Service category:** Device Registration and Management
**Product capability:** Device Lifecycle Management

We realize that over time you must refresh and retire your organizations' devices in Azure AD, to avoid having stale devices in your environment. To help with this process, Azure AD now updates your devices with a new activity timestamp, helping you to manage your device lifecycle.

For more information about how to get and use this timestamp, see [How To: Manage the stale devices in Azure AD](../devices/manage-stale-devices.md)

---

### Administrators can require users to accept a terms of use on each device

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Governance

Administrators can now turn on the **Require users to consent on every device** option to require your users to accept your terms of use on every device they're using on your tenant.

For more information, see the [Per-device terms of use section of the Azure Active Directory terms of use feature](../conditional-access/terms-of-use.md#per-device-terms-of-use).

---

### Administrators can configure a terms of use to expire based on a recurring schedule

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Governance


Administrators can now turn on the **Expire consents** option to make a terms of use expire for all of your users based on your specified recurring schedule. The schedule can be annually, bi-annually, quarterly, or monthly. After the terms of use expire, users must reaccept.

For more information, see the [Add terms of use section of the Azure Active Directory terms of use feature](../conditional-access/terms-of-use.md#add-terms-of-use).

---

### Administrators can configure a terms of use to expire based on each user's schedule

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Governance

Administrators can now specify a duration that user must reaccept a terms of use. For example, administrators can specify that users must reaccept a terms of use every 90 days.

For more information, see the [Add terms of use section of the Azure Active Directory terms of use feature](../conditional-access/terms-of-use.md#add-terms-of-use).

---

### New Azure AD Privileged Identity Management (PIM) emails for Azure Active Directory roles

**Type:** New feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

Customers using Azure AD Privileged Identity Management (PIM) can now receive a weekly digest email, including the following information for the last seven days:

- Overview of the top eligible and permanent role assignments

- Number of users activating roles

- Number of users assigned to roles in PIM

- Number of users assigned to roles outside of PIM

- Number of users "made permanent" in PIM

For more information about PIM and the available email notifications, see [Email notifications in PIM](../privileged-identity-management/pim-email-notifications.md).

---

### Group-based licensing is now generally available

**Type:** Changed feature
**Service category:** Other
**Product capability:** Directory

Group-based licensing is out of public preview and is now generally available. As part of this general release, we've made this feature more scalable and have added the ability to reprocess group-based licensing assignments for a single user and the ability to use group-based licensing with Office 365 E3/A3 licenses.

For more information about group-based licensing, see [What is group-based licensing in Azure Active Directory?](./active-directory-licensing-whatis-azure-portal.md)

---

### New Federated Apps available in Azure AD app gallery - November 2018

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In November 2018, we've added these 26 new apps with Federation support to the app gallery:

[CoreStack](https://cloud.corestack.io/site/login), [HubSpot](../saas-apps/hubspot-tutorial.md), [GetThere](../saas-apps/getthere-tutorial.md), [Gra-Pe](../saas-apps/grape-tutorial.md), [eHour](https://getehour.com/try-now), [Consent2Go](../saas-apps/consent2go-tutorial.md), [Appinux](../saas-apps/appinux-tutorial.md), [DriveDollar](https://azuremarketplace.microsoft.com/marketplace/apps/savitas.drivedollar-azuread?tab=Overview), [Useall](../saas-apps/useall-tutorial.md), [Infinite Campus](../saas-apps/infinitecampus-tutorial.md), [Alaya](https://alayagood.com), [HeyBuddy](../saas-apps/heybuddy-tutorial.md), [Wrike SAML](../saas-apps/wrike-tutorial.md), [Drift](../saas-apps/drift-tutorial.md), [Zenegy for Business Central 365](https://accounting.zenegy.com/), [Everbridge Member Portal](../saas-apps/everbridge-tutorial.md), [IDEO](https://profile.ideo.com/users/sign_up), [Ivanti Service Manager (ISM)](../saas-apps/ivanti-service-manager-tutorial.md), [Peakon](../saas-apps/peakon-tutorial.md), [Allbound SSO](../saas-apps/allbound-sso-tutorial.md), [Plex Apps - Classic Test](https://test.plexonline.com/signon), [Plex Apps – Classic](https://www.plexonline.com/signon), [Plex Apps - UX Test](https://test.cloud.plex.com/sso), [Plex Apps – UX](https://cloud.plex.com/sso), [Plex Apps – IAM](https://accounts.plex.com/), [CRAFTS - Childcare Records, Attendance, & Financial Tracking System](https://getcrafts.ca/craftsregistration)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

## October 2018

### Azure AD Logs now work with Azure Log Analytics (Public preview)

**Type:** New feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

We're excited to announce that you can now forward your Azure AD logs to Azure Log Analytics! This top-requested feature helps give you even better access to analytics for your business, operations, and security, as well as a way to help monitor your infrastructure. For more information, see the [Azure Active Directory Activity logs in Azure Log Analytics now available](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-Active-Directory-Activity-logs-in-Azure-Log-Analytics-now/ba-p/274843) blog.

---

### New Federated Apps available in Azure AD app gallery - October 2018

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In October 2018, we've added these 14 new apps with Federation support to the app gallery:

[My Award Points](../saas-apps/myawardpoints-tutorial.md), [Vibe HCM](../saas-apps/vibehcm-tutorial.md), ambyint, [MyWorkDrive](../saas-apps/myworkdrive-tutorial.md), [BorrowBox](../saas-apps/borrowbox-tutorial.md), Dialpad, [ON24 Virtual Environment](../saas-apps/on24-tutorial.md), [RingCentral](../saas-apps/ringcentral-tutorial.md), [Zscaler Three](../saas-apps/zscaler-three-tutorial.md), [Phraseanet](../saas-apps/phraseanet-tutorial.md), [Appraisd](../saas-apps/appraisd-tutorial.md), [Workspot Control](../saas-apps/workspotcontrol-tutorial.md), [Shuccho Navi](../saas-apps/shucchonavi-tutorial.md), [Glassfrog](../saas-apps/glassfrog-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Azure AD Domain Services Email Notifications

**Type:** New feature
**Service category:** Azure AD Domain Services
**Product capability:** Azure AD Domain Services

Azure AD Domain Services provides alerts on the Azure portal about misconfigurations or problems with your managed domain. These alerts include step-by-step guides so you can try to fix the problems without having to contact support.

Starting in October, you'll be able to customize the notification settings for your managed domain so when new alerts occur, an email is sent to a designated group of people, eliminating the need to constantly check the portal for updates.

For more information, see [Notification settings in Azure AD Domain Services](../../active-directory-domain-services/notifications.md).

---

### Azure AD portal supports using the ForceDelete domain API to delete custom domains

**Type:** Changed feature
**Service category:** Directory Management
**Product capability:** Directory

We're pleased to announce that you can now use the ForceDelete domain API to delete your custom domain names by asynchronously renaming references, like users, groups, and apps from your custom domain name (contoso.com) back to the initial default domain name (contoso.onmicrosoft.com).

This change helps you to more quickly delete your custom domain names if your organization no longer uses the name, or if you need to use the domain name with another Azure AD.

For more information, see [Delete a custom domain name](../enterprise-users/domains-manage.md#delete-a-custom-domain-name).

---

## September 2018

### Updated administrator role permissions for dynamic groups

**Type:** Fixed
**Service category:** Group Management
**Product capability:** Collaboration

We've fixed an issue so specific administrator roles can now create and update dynamic membership rules, without needing to be the owner of the group.

The roles are:

- Global administrator

- Intune administrator

- User administrator

For more information, see [Create a dynamic group and check status](../enterprise-users/groups-create-rule.md)

---

### Simplified Single Sign-On (SSO) configuration settings for some third-party apps

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** SSO

We realize that setting up Single Sign-On (SSO) for Software as a Service (SaaS) apps can be challenging due to the unique nature of each apps configuration. We've built a simplified configuration experience to auto-populate the SSO configuration settings for the following third-party SaaS apps:

- Zendesk

- ArcGis Online

- Jamf Pro

To start using this one-click experience, go to the **Azure portal** > **SSO configuration** page for the app. For more information, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md)

---

### Azure Active Directory - Where is your data located? page

**Type:** New feature
**Service category:** Other
**Product capability:** GoLocal

Select your company's region from the **Azure Active Directory - Where is your data located** page to view which Azure datacenter houses your Azure AD data at rest for all Azure AD services. You can filter the information by specific Azure AD services for your company's region.

To access this feature and for more information, see [Azure Active Directory - Where is your data located](https://aka.ms/AADDataMap).

---

### New deployment plan available for the My Apps Access panel

**Type:** New feature
**Service category:** My Apps
**Product capability:** SSO

Check out the new deployment plan that's available for the My Apps Access panel (https://aka.ms/deploymentplans).
The My Apps Access panel provides users with a single place to find and access their apps. This portal also provides users with self-service opportunities, such as requesting access to apps and groups, or managing access to these resources on behalf of others.

For more information, see [What is the My Apps portal?](../user-help/my-apps-portal-end-user-access.md)

---

### New Troubleshooting and Support tab on the Sign-ins Logs page of the Azure portal

**Type:** New feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

The new **Troubleshooting and Support** tab on the **Sign-ins** page of the Azure portal, is intended to help admins and support engineers troubleshoot issues related to Azure AD sign-ins. This new tab provides the error code, error message, and remediation recommendations (if any) to help solve the problem. If you're unable to resolve the problem, we also give you a new way to create a support ticket using the **Copy to clipboard** experience, which populates the **Request ID** and **Date (UTC)** fields for the log file in your support ticket.

![Sign-in logs showing the new tab](media/whats-new/troubleshooting-and-support.png)

---

### Enhanced support for custom extension properties used to create dynamic membership rules

**Type:** Changed feature
**Service category:** Group Management
**Product capability:** Collaboration

With this update, you can now click the **Get custom extension properties** link from the dynamic user group rule builder, enter your unique app ID, and receive the full list of custom extension properties to use when creating a dynamic membership rule for users. This list can also be refreshed to get any new custom extension properties for that app.

For more information about using custom extension properties for dynamic membership rules, see [Extension properties and custom extension properties](../enterprise-users/groups-dynamic-membership.md#extension-properties-and-custom-extension-properties)

---

### New approved client apps for Azure AD app-based Conditional Access

**Type:** Plan for change
**Service category:** Conditional Access
**Product capability:** Identity security and protection

The following apps are on the list of [approved client apps](../conditional-access/concept-conditional-access-conditions.md#client-apps):

- Microsoft To-Do

- Microsoft Stream

For more information, see:

- [Azure AD app-based Conditional Access](../conditional-access/app-based-conditional-access.md)

---

### New support for Self-Service Password Reset from the Windows 7/8/8.1 Lock screen

**Type:** New feature
**Service category:** SSPR
**Product capability:** User Authentication

After you set up this new feature, your users will see a link to reset their password from the **Lock** screen of a device running Windows 7, Windows 8, or Windows 8.1. By clicking that link, the user is guided through the same password reset flow as through the web browser.

For more information, see [How to enable password reset from Windows 7, 8, and 8.1](../authentication/howto-sspr-windows.md)

---

### Change notice: Authorization codes will no longer be available for reuse

**Type:** Plan for change
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Starting on November 15, 2018, Azure AD will stop accepting previously used authentication codes for apps. This security change helps to bring Azure AD in line with the OAuth specification and will be enforced on both the v1 and v2 endpoints.

If your app reuses authorization codes to get tokens for multiple resources, we recommend that you use the code to get a refresh token, and then use that refresh token to acquire additional tokens for other resources. Authorization codes can only be used once, but refresh tokens can be used multiple times across multiple resources. An app that attempts to reuse an authentication code during the OAuth code flow will get an invalid_grant error.

For this and other protocols-related changes, see [the full list of what's new for authentication](../develop/reference-breaking-changes.md).

---

### New Federated Apps available in Azure AD app gallery - September 2018

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In September 2018, we've added these 16 new apps with Federation support to the app gallery:

[Uberflip](../saas-apps/uberflip-tutorial.md), [Comeet Recruiting Software](../saas-apps/comeetrecruitingsoftware-tutorial.md), [Workteam](../saas-apps/workteam-tutorial.md), [ArcGIS Enterprise](../saas-apps/arcgisenterprise-tutorial.md), [Nuclino](../saas-apps/nuclino-tutorial.md), [JDA Cloud](../saas-apps/jdacloud-tutorial.md), [Snowflake](../saas-apps/snowflake-tutorial.md), NavigoCloud, [Figma](../saas-apps/figma-tutorial.md), join.me, [ZephyrSSO](../saas-apps/zephyrsso-tutorial.md), [Silverback](../saas-apps/silverback-tutorial.md), Riverbed Xirrus EasyPass, [Rackspace SSO](../saas-apps/rackspacesso-tutorial.md), Enlyft SSO for Azure, SurveyMonkey, [Convene](../saas-apps/convene-tutorial.md), [dmarcian](../saas-apps/dmarcian-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Support for additional claims transformations methods

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** SSO

We've introduced new claim transformation methods, ToLower() and ToUpper(), which can be applied to SAML tokens from the SAML-based **Single Sign-On Configuration** page.

For more information, see [How to customize claims issued in the SAML token for enterprise applications in Azure AD](../develop/active-directory-saml-claims-customization.md)

---

### Updated SAML-based app configuration UI (preview)

**Type:** Changed feature
**Service category:** Enterprise Apps
**Product capability:** SSO

As part of our updated SAML-based app configuration UI, you'll get:

- An updated walkthrough experience for configuring your SAML-based apps.

- More visibility about what's missing or incorrect in your configuration.

- The ability to add multiple email addresses for expiration certificate notification.

- New claim transformation methods, ToLower() and ToUpper(), and more.

- A way to upload your own token signing certificate for your enterprise apps.

- A way to set the NameID Format for SAML apps, and a way to set the NameID value as Directory Extensions.

To turn on this updated view, click the **Try out our new experience** link from the top of the **Single Sign-On** page. For more information, see [Tutorial: Configure SAML-based single sign-on for an application with Azure Active Directory](../manage-apps/view-applications-portal.md).

---

## August 2018

### Changes to Azure Active Directory IP address ranges

**Type:** Plan for change
**Service category:** Other
**Product capability:** Platform

We're introducing larger IP ranges to Azure AD, which means if you've configured Azure AD IP address ranges for your firewalls, routers, or Network Security Groups, you'll need to update them. We're making this update so you won't have to change your firewall, router, or Network Security Groups IP range configurations again when Azure AD adds new endpoints.

Network traffic is moving to these new ranges over the next two months. To continue with uninterrupted service, you must add these updated values to your IP Addresses before September 10, 2018:

- 20.190.128.0/18

- 40.126.0.0/18

We strongly recommend not removing the old IP Address ranges until all of your network traffic has moved to the new ranges. For updates about the move and to learn when you can remove the old ranges, see [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2).

---

### Change notice: Authorization codes will no longer be available for reuse

**Type:** Plan for change
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Starting on November 15, 2018, Azure AD will stop accepting previously used authentication codes for apps. This security change helps to bring Azure AD in line with the OAuth specification and will be enforced on both the v1 and v2 endpoints.

If your app reuses authorization codes to get tokens for multiple resources, we recommend that you use the code to get a refresh token, and then use that refresh token to acquire additional tokens for other resources. Authorization codes can only be used once, but refresh tokens can be used multiple times across multiple resources. An app that attempts to reuse an authentication code during the OAuth code flow will get an invalid_grant error.

For this and other protocols-related changes, see [the full list of what's new for authentication](../develop/reference-breaking-changes.md).

---

### Converged security info management for self-service password (SSPR) and Multi-Factor Authentication (MFA)

**Type:** New feature
**Service category:** SSPR
**Product capability:** User Authentication

This new feature helps people manage their security info (such as, phone number, mobile app, and so on) for SSPR and MFA in a single location and experience; as compared to previously, where it was done in two different locations.

This converged experience also works for people using either SSPR or MFA. Additionally, if your organization doesn't enforce MFA or SSPR registration, people can still register any MFA or SSPR security info methods allowed by your organization from the My Apps portal.

This is an opt-in public preview. Administrators can turn on the new experience (if desired) for a selected group or for all users in a tenant. For more information about the converged experience, see the [Converged experience blog](https://cloudblogs.microsoft.com/enterprisemobility/2018/08/06/mfa-and-sspr-updates-now-in-public-preview/)

---

### New HTTP-Only cookies setting in Azure AD Application proxy apps

**Type:** New feature
**Service category:** App Proxy
**Product capability:** Access Control

There's a new setting called, **HTTP-Only Cookies** in your Application Proxy apps. This setting helps provide extra security by including the HTTPOnly flag in the HTTP response header for both Application Proxy access and session cookies, stopping access to the cookie from a client-side script and further preventing actions like copying or modifying the cookie. Although this flag hasn't been used previously, your cookies have always been encrypted and transmitted using a TLS connection to help protect against improper modifications.

This setting isn't compatible with apps using ActiveX controls, such as Remote Desktop. If you're in this situation, we recommend that you turn off this setting.

For more information about the HTTP-Only Cookies setting, see [Publish applications using Azure AD Application Proxy](../manage-apps/application-proxy-add-on-premises-application.md).

---

### Privileged Identity Management (PIM) for Azure resources supports Management Group resource types

**Type:** New feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

Just-In-Time activation and assignment settings can now be applied to Management Group resource types, just like you already do for Subscriptions, Resource Groups, and Resources (such as VMs, App Services, and more). In addition, anyone with a role that provides administrator access for a Management Group can discover and manage that resource in PIM.

For more information about PIM and Azure resources, see [Discover and manage Azure resources by using Privileged Identity Management](../privileged-identity-management/pim-resource-roles-discover-resources.md)

---

### Application access (preview) provides faster access to the Azure AD portal

**Type:** New feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

Today, when activating a role using PIM, it can take over 10 minutes for the permissions to take effect. If you choose to use Application access, which is currently in public preview, administrators can access the Azure AD portal as soon as the activation request completes.

Currently, Application access only supports the Azure AD portal experience and Azure resources. For more information about PIM and Application access, see [What is Azure AD Privileged Identity Management?](../privileged-identity-management/pim-configure.md)

---

### New Federated Apps available in Azure AD app gallery - August 2018

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In August 2018, we've added these 16 new apps with Federation support to the app gallery:

[Hornbill](../saas-apps/hornbill-tutorial.md), [Bridgeline Unbound](../saas-apps/bridgelineunbound-tutorial.md), [Sauce Labs - Mobile and Web Testing](../saas-apps/saucelabs-mobileandwebtesting-tutorial.md), [Meta Networks Connector](../saas-apps/metanetworksconnector-tutorial.md), [Way We Do](../saas-apps/waywedo-tutorial.md), [Spotinst](../saas-apps/spotinst-tutorial.md), [ProMaster (by Inlogik)](../saas-apps/promaster-tutorial.md), SchoolBooking, [4me](../saas-apps/4me-tutorial.md), [Dossier](../saas-apps/dossier-tutorial.md), [N2F - Expense reports](../saas-apps/n2f-expensereports-tutorial.md), [Comm100 Live Chat](../saas-apps/comm100livechat-tutorial.md), [SafeConnect](../saas-apps/safeconnect-tutorial.md), [ZenQMS](../saas-apps/zenqms-tutorial.md), [eLuminate](../saas-apps/eluminate-tutorial.md), [Dovetale](../saas-apps/dovetale-tutorial.md).

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Native Tableau support is now available in Azure AD Application Proxy

**Type:** Changed feature
**Service category:** App Proxy
**Product capability:** Access Control

With our update from the OpenID Connect to the OAuth 2.0 Code Grant protocol for our pre-authentication protocol, you no longer have to do any additional configuration to use Tableau with Application Proxy. This protocol change also helps Application Proxy better support more modern apps by using only HTTP redirects, which are commonly supported in JavaScript and HTML tags.

---

### New support to add Google as an identity provider for B2B guest users in Azure Active Directory (preview)

**Type:** New feature
**Service category:** B2B
**Product capability:** B2B/B2C

By setting up federation with Google in your organization, you can let invited Gmail users sign in to your shared apps and resources using their existing Google account, without having to create a personal Microsoft Account (MSAs) or an Azure AD account.

This is an opt-in public preview. For more information about Google federation, see [Add Google as an identity provider for B2B guest users](../external-identities/google-federation.md).

---

## July 2018

### Improvements to Azure Active Directory email notifications

**Type:** Changed feature
**Service category:** Other
**Product capability:** Identity lifecycle management

Azure Active Directory (Azure AD) emails now feature an updated design, as well as changes to the sender email address and sender display name, when sent from the following services:

- Azure AD Access Reviews
- Azure AD Connect Health
- Azure AD Identity Protection
- Azure AD Privileged Identity Management
- Enterprise App Expiring Certificate Notifications
- Enterprise App Provisioning Service Notifications

The email notifications will be sent from the following email address and display name:

- Email address: azure-noreply@microsoft.com
- Display name: Microsoft Azure

For an example of some of the new e-mail designs and more information, see [Email notifications in Azure AD PIM](../privileged-identity-management/pim-email-notifications.md).

---

### Azure AD Activity Logs are now available through Azure Monitor

**Type:** New feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

The Azure AD Activity Logs are now available in public preview for the Azure Monitor (Azure's platform-wide monitoring service). Azure Monitor offers you long-term retention and seamless integration, in addition to these improvements:

- Long-term retention by routing your log files to your own Azure storage account.

- Seamless SIEM integration, without requiring you to write or maintain custom scripts.

- Seamless integration with your own custom solutions, analytics tools, or incident management solutions.

For more information about these new capabilities, see our blog [Azure AD activity logs in Azure Monitor diagnostics is now in public preview](https://cloudblogs.microsoft.com/enterprisemobility/2018/07/26/azure-ad-activity-logs-in-azure-monitor-diagnostics-now-in-public-preview/) and our documentation, [Azure Active Directory activity logs in Azure Monitor (preview)](../reports-monitoring/concept-activity-logs-azure-monitor.md).

---

### Conditional Access information added to the Azure AD sign-ins report

**Type:** New feature
**Service category:** Reporting
**Product capability:** Identity Security & Protection

This update lets you see which policies are evaluated when a user signs in along with the policy outcome. In addition, the report now includes the type of client app used by the user, so you can identify legacy protocol traffic. Report entries can also now be searched for a correlation ID, which can be found in the user-facing error message and can be used to identify and troubleshoot the matching sign-in request.

---

### View legacy authentications through Sign-ins activity logs

**Type:** New feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

With the introduction of the **Client App** field in the Sign-in activity logs, customers can now see users that are using legacy authentications. Customers will be able to access this information using the Sign-ins Microsoft Graph API or through the Sign-in activity logs in Azure AD portal where you can use the **Client App** control to filter on legacy authentications. Check out the documentation for more details.

---

### New Federated Apps available in Azure AD app gallery - July 2018

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In July 2018, we've added these 16 new apps with Federation support to the app gallery:

[Innovation Hub](../saas-apps/innovationhub-tutorial.md), [Leapsome](../saas-apps/leapsome-tutorial.md), [Certain Admin SSO](../saas-apps/certainadminsso-tutorial.md), PSUC Staging, [iPass SmartConnect](../saas-apps/ipasssmartconnect-tutorial.md), [Screencast-O-Matic](../saas-apps/screencast-tutorial.md), PowerSchool Unified Classroom, [Eli Onboarding](../saas-apps/elionboarding-tutorial.md), [Bomgar Remote Support](../saas-apps/bomgarremotesupport-tutorial.md), [Nimblex](../saas-apps/nimblex-tutorial.md), [Imagineer WebVision](../saas-apps/imagineerwebvision-tutorial.md), [Insight4GRC](../saas-apps/insight4grc-tutorial.md), [SecureW2 JoinNow Connector](../saas-apps/securejoinnow-tutorial.md), [Kanbanize](../saas-apps/kanbanize-tutorial.md), [SmartLPA](../saas-apps/smartlpa-tutorial.md), [Skills Base](../saas-apps/skillsbase-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### New user provisioning SaaS app integrations - July 2018

**Type:** New feature
**Service category:** App Provisioning
**Product capability:** 3rd Party Integration

Azure AD allows you to automate the creation, maintenance, and removal of user identities in SaaS applications such as Dropbox, Salesforce, ServiceNow, and more. For July 2018, we have added user provisioning support for the following applications in the Azure AD app gallery:

- [Cisco WebEx](../saas-apps/cisco-webex-provisioning-tutorial.md)

- [Bonusly](../saas-apps/bonusly-provisioning-tutorial.md)

For a list of all applications that support user provisioning in the Azure AD gallery, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md).

---

### Connect Health for Sync - An easier way to fix orphaned and duplicate attribute sync errors

**Type:** New feature
**Service category:** AD Connect
**Product capability:** Monitoring & Reporting

Azure AD Connect Health introduces self-service remediation to help you highlight and fix sync errors. This feature troubleshoots duplicated attribute sync errors and fixes objects that are orphaned from Azure AD. This diagnosis has the following benefits:

- Narrows down duplicated attribute sync errors, providing specific fixes

- Applies a fix for dedicated Azure AD scenarios, resolving errors in a single step

- No upgrade or configuration is required to turn on and use this feature

For more information, see [Diagnose and remediate duplicated attribute sync errors](../hybrid/how-to-connect-health-diagnose-sync-errors.md)

---

### Visual updates to the Azure AD and MSA sign-in experiences

**Type:** Changed feature
**Service category:** Azure AD
**Product capability:** User Authentication

We've updated the UI for Microsoft's online services sign-in experience, such as for Office 365 and Azure. This change makes the screens less cluttered and more straightforward. For more information about this change, see the [Upcoming improvements to the Azure AD sign-in experience](https://cloudblogs.microsoft.com/enterprisemobility/2018/04/04/upcoming-improvements-to-the-azure-ad-sign-in-experience/) blog.

---

### New release of Azure AD Connect - July 2018

**Type:** Changed feature
**Service category:** App Provisioning
**Product capability:** Identity Lifecycle Management

The latest release of Azure AD Connect includes:

- Bug fixes and supportability updates

- General Availability of the Ping-Federate integration

- Updates to the latest SQL 2012 client

For more information about this update, see [Azure AD Connect: Version release history](../hybrid/reference-connect-version-history.md)

---

### Updates to the terms of use end-user UI

**Type:** Changed feature
**Service category:** Terms of use
**Product capability:** Governance

We're updating the acceptance string in the TOU end-user UI.

**Current text.** In order to access [tenantName] resources, you must accept the terms of use.<br>**New text.** In order to access [tenantName] resource, you must read the terms of use.

**Current text:** Choosing to accept means that you agree to all of the above terms of use.<br>**New text:** Please click Accept to confirm that you have read and understood the terms of use.

---

### Pass-through Authentication supports legacy protocols and applications

**Type:** Changed feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Pass-through Authentication now supports legacy protocols and apps. The following limitations are now fully supported:

- User sign-ins to legacy Office client applications, Office 2010 and Office 2013, without requiring modern authentication.

- Access to calendar sharing and free/busy information in Exchange hybrid environments on Office 2010 only.

- User sign-ins to Skype for Business client applications without requiring modern authentication.

- User sign-ins to PowerShell version 1.0.

- The Apple Device Enrollment Program (Apple DEP), using the iOS Setup Assistant.

---

### Converged security info management for self-service password reset and Multi-Factor Authentication

**Type:** New feature
**Service category:** SSPR
**Product capability:** User Authentication

This new feature lets users manage their security info (for example, phone number, email address, mobile app, and so on) for self-service password reset (SSPR) and Multi-Factor Authentication (MFA) in a single experience. Users will no longer have to register the same security info for SSPR and MFA in two different experiences. This new experience also applies to users who have either SSPR or MFA.

If an organization isn't enforcing MFA or SSPR registration, users can register their security info through the **My Apps** portal. From there, users can register any methods enabled for MFA or SSPR.

This is an opt-in public preview. Admins can turn on the new experience (if desired) for a selected group of users or all users in a tenant.

---

### Use the Microsoft Authenticator app to verify your identity when you reset your password

**Type:** Changed feature
**Service category:** SSPR
**Product capability:** User Authentication

This feature lets non-admins verify their identity while resetting a password using a notification or code from Microsoft Authenticator (or any other authenticator app). After admins turn on this self-service password reset method, users who have registered a mobile app through aka.ms/mfasetup or aka.ms/setupsecurityinfo can use their mobile app as a verification method while resetting their password.

Mobile app notification can only be turned on as part of a policy that requires two methods to reset your password.

---

## June 2018

### Change notice: Security fix to the delegated authorization flow for apps using Azure AD Activity Logs API

**Type:** Plan for change
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

Due to our stronger security enforcement, we've had to make a change to the permissions for apps that use a delegated authorization flow to access [Azure AD Activity Logs APIs](../reports-monitoring/concept-reporting-api.md). This change will occur by **June 26, 2018**.

If any of your apps use Azure AD Activity Log APIs, follow these steps to ensure the app doesn't break after the change happens.

**To update your app permissions**

1. Sign in to the Azure portal, select **Azure Active Directory**, and then select **App Registrations**.
2. Select your app that uses the Azure AD Activity Logs API, select **Settings**, select **Required permissions**, and then select the **Windows Azure Active Directory** API.
3. In the **Delegated permissions** area of the **Enable access** blade, select the box next to **Read directory** data, and then select **Save**.
4. Select **Grant permissions**, and then select **Yes**.

    >[!Note]
    >You must be a Global administrator to grant permissions to the app.

For more information, see the [Grant permissions](../reports-monitoring/howto-configure-prerequisites-for-reporting-api.md#grant-permissions) area of the Prerequisites to access the Azure AD reporting API article.

---

### Configure TLS settings to connect to Azure AD services for PCI DSS compliance

**Type:** New feature
**Service category:** N/A
**Product capability:** Platform

Transport Layer Security (TLS) is a protocol that provides privacy and data integrity between two communicating applications and is the most widely deployed security protocol used today.

The [PCI Security Standards Council](https://www.pcisecuritystandards.org/) has determined that early versions of TLS and Secure Sockets Layer (SSL) must be disabled in favor of enabling new and more secure app protocols, with compliance starting on **June 30, 2018**. This change means that if you connect to Azure AD services and require PCI DSS-compliance, you must disable TLS 1.0. Multiple versions of TLS are available, but TLS 1.2 is the latest version available for Azure Active Directory Services. We highly recommend moving directly to TLS 1.2 for both client/server and browser/server combinations.

Out-of-date browsers might not support newer TLS versions, such as TLS 1.2. To see which versions of TLS are supported by your browser, go to the [Qualys SSL Labs](https://www.ssllabs.com/) site and click **Test your browser**. We recommend you upgrade to the latest version of your web browser and preferably enable only TLS 1.2.

**To enable TLS 1.2, by browser**

- **Microsoft Edge and Internet Explorer (both are set using Internet Explorer)**

    1. Open Internet Explorer, select **Tools** > **Internet Options** > **Advanced**.
    2. In the **Security** area, select **use TLS 1.2**, and then select **OK**.
    3. Close all browser windows and restart Internet Explorer.

- **Google Chrome**

    1. Open Google Chrome, type *chrome://settings/* into the address bar, and press **Enter**.
    2. Expand the **Advanced** options, go to the **System** area, and select **Open proxy settings**.
    3. In the **Internet Properties** box, select the **Advanced** tab, go to the **Security** area, select **use TLS 1.2**, and then select **OK**.
    4. Close all browser windows and restart Google Chrome.

- **Mozilla Firefox**

    1. Open Firefox, type *about:config* into the address bar, and then press **Enter**.
    2. Search for the term, *TLS*, and then select the **security.tls.version.max** entry.
    3. Set the value to **3** to force the browser to use up to version TLS 1.2, and then select **OK**.

        >[!NOTE]
        >Firefox version 60.0 supports TLS 1.3, so you can also set the security.tls.version.max value to **4**.

    4. Close all browser windows and restart Mozilla Firefox.

---

### New Federated Apps available in Azure AD app gallery - June 2018

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In June 2018, we've added these 15 new apps with Federation support to the app gallery:

[Skytap](../saas-apps/skytap-tutorial.md), [Settling music](../saas-apps/settlingmusic-tutorial.md), [SAML 1.1 Token enabled LOB App](../saas-apps/saml-tutorial.md), [Supermood](../saas-apps/supermood-tutorial.md), [Autotask](../saas-apps/autotaskendpointbackup-tutorial.md), [Endpoint Backup](../saas-apps/autotaskendpointbackup-tutorial.md), [Skyhigh Networks](../saas-apps/skyhighnetworks-tutorial.md), Smartway2, [TonicDM](../saas-apps/tonicdm-tutorial.md), [Moconavi](../saas-apps/moconavi-tutorial.md), [Zoho One](../saas-apps/zohoone-tutorial.md), [SharePoint on-premises](../saas-apps/sharepoint-on-premises-tutorial.md), [ForeSee CX Suite](../saas-apps/foreseecxsuite-tutorial.md), [Vidyard](../saas-apps/vidyard-tutorial.md), [ChronicX](../saas-apps/chronicx-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Azure AD Password Protection is available in public preview

**Type:** New feature
**Service category:** Identity Protection
**Product capability:** User Authentication

Use Azure AD Password Protection to help eliminate easily guessed passwords from your environment. Eliminating these passwords helps to lower the risk of compromise from a password spray type of attack.

Specifically, Azure AD Password Protection helps you:

- Protect your organization's accounts in both Azure AD and Windows Server Active Directory (AD).
- Stops your users from using passwords on a list of more than 500 of the most commonly used passwords, and over 1 million character substitution variations of those passwords.
- Administer Azure AD Password Protection from a single location in the Azure AD portal, for both Azure AD and on-premises Windows Server AD.

For more information about Azure AD Password Protection, see [Eliminate bad passwords in your organization](../authentication/concept-password-ban-bad.md).

---

### New "all guests" Conditional Access policy template created during terms of use creation

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Governance

During the creation of your terms of use, a new Conditional Access policy template is also created for "all guests" and "all apps". This new policy template applies the newly created ToU, streamlining the creation and enforcement process for guests.

For more information, see [Azure Active Directory Terms of use feature](../conditional-access/terms-of-use.md).

---

### New "custom" Conditional Access policy template created during terms of use creation

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Governance

During the creation of your terms of use, a new "custom" Conditional Access policy template is also created. This new policy template lets you create the ToU and then immediately go to the Conditional Access policy creation blade, without needing to manually navigate through the portal.

For more information, see [Azure Active Directory Terms of use feature](../conditional-access/terms-of-use.md).

---

### New and comprehensive guidance about deploying Azure AD Multi-Factor Authentication

**Type:** New feature
**Service category:** Other
**Product capability:** Identity Security & Protection

We've released new step-by-step guidance about how to deploy Azure AD Multi-Factor Authentication (MFA) in your organization.

To view the MFA deployment guide, go to the [Identity Deployment Guides](./active-directory-deployment-plans.md) repo on GitHub. To provide feedback about the deployment guides, use the [Deployment Plan Feedback form](https://aka.ms/deploymentplanfeedback). If you have any questions about the deployment guides, contact us at [IDGitDeploy](mailto:idgitdeploy@microsoft.com).

---

### Azure AD delegated app management roles are in public preview

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** Access Control

Admins can now delegate app management tasks without assigning the Global Administrator role. The new roles and capabilities are:

- **New standard Azure AD admin roles:**

    - **Application Administrator.** Grants the ability to manage all aspects of all apps, including registration, SSO settings, app assignments and licensing, App proxy settings, and consent (except to Azure AD resources).

    - **Cloud Application Administrator.** Grants all of the Application Administrator abilities, except for App proxy because it doesn't provide on-premises access.

    - **Application Developer.** Grants the ability to create app registrations, even if the **allow users to register apps** option is turned off.

- **Ownership (set up per-app registration and per-enterprise app, similar to the group ownership process:**

    - **App Registration Owner.** Grants the ability to manage all aspects of owned app registration, including the app manifest and adding additional owners.

    - **Enterprise App Owner.** Grants the ability to manage many aspects of owned enterprise apps, including SSO settings, app assignments, and consent (except to Azure AD resources).

For more information about public preview, see the [Azure AD delegated application management roles are in public preview!](https://cloudblogs.microsoft.com/enterprisemobility/2018/06/13/hallelujah-azure-ad-delegated-application-management-roles-are-in-public-preview/) blog. For more information about roles and permissions, see [Assigning administrator roles in Azure Active Directory](../roles/permissions-reference.md).

---

## May 2018

### ExpressRoute support changes

**Type:** Plan for change
**Service category:** Authentications (Logins)
**Product capability:** Platform

Software as a Service offering, like Azure Active Directory (Azure AD) are designed to work best by going directly through the Internet, without requiring ExpressRoute or any other private VPN tunnels. Because of this, on **August 1, 2018**, we will stop supporting ExpressRoute for Azure AD services using Azure public peering and Azure communities in Microsoft peering. Any services impacted by this change might notice Azure AD traffic gradually shifting from ExpressRoute to the Internet.

While we're changing our support, we also know there are still situations where you might need to use a dedicated set of circuits for your authentication traffic. Because of this, Azure AD will continue to support per-tenant IP range restrictions using ExpressRoute and services already on Microsoft peering with the "Other Office 365 Online services" community. If your services are impacted, but you require ExpressRoute, you must do the following:

- **If you're on Azure public peering.** Move to Microsoft peering and sign up for the **Other Office 365 Online services (12076:5100)** community. For more info about how to move from Azure public peering to Microsoft peering, see the [Move a public peering to Microsoft peering](../../expressroute/how-to-move-peering.md) article.

- **If you're on Microsoft peering.** Sign up for the **Other Office 365 Online service (12076:5100)** community. For more info about routing requirements, see the [Support for BGP communities section](../../expressroute/expressroute-routing.md#bgp) of the ExpressRoute routing requirements article.

If you must continue to use dedicated circuits, you'll need to talk to your Microsoft Account team about how to get authorization to use the **Other Office 365 Online service (12076:5100)** community. The MS Office-managed review board will verify whether you need those circuits and make sure you understand the technical implications of keeping them. Unauthorized subscriptions trying to create route filters for Office 365 will receive an error message.

---

### Microsoft Graph APIs for administrative scenarios for TOU

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Developer Experience

We've added Microsoft Graph APIs for administration operation of Azure AD terms of use. You are able to create, update, delete the terms of use object.

---

### Add Azure AD multi-tenant endpoint as an identity provider in Azure AD B2C

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

Using custom policies, you can now add the Azure AD common endpoint as an identity provider in Azure AD B2C. This allows you to have a single point of entry for all Azure AD users that are signing into your applications. For more information, see [Azure Active Directory B2C: Allow users to sign in to a multi-tenant Azure AD identity provider using custom policies](../../active-directory-b2c/identity-provider-azure-ad-multi-tenant.md).

---

### Use Internal URLs to access apps from anywhere with our My Apps Sign-in Extension and the Azure AD Application Proxy

**Type:** New feature
**Service category:** My Apps
**Product capability:** SSO

Users can now access applications through internal URLs even when outside your corporate network by using the My Apps Secure Sign-in Extension for Azure AD. This will work with any application that you have published using Azure AD Application Proxy, on any browser that also has the Access Panel browser extension installed. The URL redirection functionality is automatically enabled once a user logs into the extension. The extension is available for download on [Microsoft Edge](https://go.microsoft.com/fwlink/?linkid=845176), [Chrome](https://go.microsoft.com/fwlink/?linkid=866367), and [Firefox](https://go.microsoft.com/fwlink/?linkid=866366).

---

### Azure Active Directory - Data in Europe for Europe customers

**Type:** New feature
**Service category:** Other
**Product capability:** GoLocal

Customers in Europe require their data to stay in Europe and not replicated outside of European datacenters for meeting privacy and European laws. This [article](./active-directory-data-storage-eu.md) provides the specific details on what identity information will be stored within Europe and also provide details on information that will be stored outside European datacenters.

---

### New user provisioning SaaS app integrations - May 2018

**Type:** New feature
**Service category:** App Provisioning
**Product capability:** 3rd Party Integration

Azure AD allows you to automate the creation, maintenance, and removal of user identities in SaaS applications such as Dropbox, Salesforce, ServiceNow, and more. For May 2018, we have added user provisioning support for the following applications in the Azure AD app gallery:

- [BlueJeans](../saas-apps/bluejeans-provisioning-tutorial.md)

- [Cornerstone OnDemand](../saas-apps/cornerstone-ondemand-provisioning-tutorial.md)

- [Zendesk](../saas-apps/zendesk-provisioning-tutorial.md)

For a list of all applications that support user provisioning in the Azure AD gallery, see [https://aka.ms/appstutorial](../saas-apps/tutorial-list.md).

---

### Azure AD access reviews of groups and app access now provides recurring reviews

**Type:** New feature
**Service category:** Access Reviews
**Product capability:** Governance

Access review of groups and apps is now generally available as part of Azure AD Premium P2.  Administrators will be able to configure access reviews of group memberships and application assignments to automatically recur at regular intervals, such as monthly or quarterly.

---

### Azure AD Activity logs (sign-ins and audit) are now available through MS Graph

**Type:** New feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

Azure AD Activity logs, which, includes Sign-ins and Audit logs, are now available through the Microsoft Graph API. We have exposed two end points through the Microsoft Graph API to access these logs. Check out our [documents](../reports-monitoring/concept-reporting-api.md) for programmatic access to Azure AD Reporting APIs to get started.

---

### Improvements to the B2B redemption experience and leave an org

**Type:** New feature
**Service category:** B2B
**Product capability:** B2B/B2C

**Just in time redemption:** Once you share a resource with a guest user using B2B API – you don't need to send out a special invitation email. In most      cases, the guest user can access the resource and will be taken through the redemption experience just in time. No more impact due to missed emails. No more asking your guest users "Did you click on that redemption link the system sent you?". This means once SPO uses the invitation manager – cloudy attachments can have the same canonical URL for all users – internal and external – in any state of redemption.

**Modern redemption experience:** No more split screen redemption landing page. Users will see a modern consent experience with the inviting organization's privacy statement, just like they do for third-party apps.

**Guest users can leave the org:** Once a user's relationship with an org is over, they can self-serve leaving the organization. No more calling the inviting org's admin to "be removed", no more raising support tickets.

---

### New Federated Apps available in Azure AD app gallery - May 2018

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In May 2018, we've added these 18 new apps with Federation support to our app gallery:

[AwardSpring](../saas-apps/awardspring-tutorial.md), Infogix Data3Sixty Govern, [Yodeck](../saas-apps/infogix-tutorial.md), [Jamf Pro](../saas-apps/jamfprosamlconnector-tutorial.md), [KnowledgeOwl](../saas-apps/knowledgeowl-tutorial.md), [Envi MMIS](../saas-apps/envimmis-tutorial.md), [LaunchDarkly](../saas-apps/launchdarkly-tutorial.md), [Adobe Captivate Prime](../saas-apps/adobecaptivateprime-tutorial.md), [Montage Online](../saas-apps/montageonline-tutorial.md), [まなびポケット](../saas-apps/manabipocket-tutorial.md), OpenReel, [Arc Publishing - SSO](../saas-apps/arc-tutorial.md), [PlanGrid](../saas-apps/plangrid-tutorial.md), [iWellnessNow](../saas-apps/iwellnessnow-tutorial.md), [Proxyclick](../saas-apps/proxyclick-tutorial.md), [Riskware](../saas-apps/riskware-tutorial.md), [Flock](../saas-apps/flock-tutorial.md), [Reviewsnap](../saas-apps/reviewsnap-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md).

For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### New step-by-step deployment guides for Azure Active Directory

**Type:** New feature
**Service category:** Other
**Product capability:** Directory

New, step-by-step guidance about how to deploy Azure Active Directory (Azure AD), including self-service password reset (SSPR), single sign-on (SSO), Conditional Access, App proxy, User provisioning, Active Directory Federation Services (ADFS) to Pass-through Authentication (PTA), and ADFS to Password hash sync (PHS).

To view the deployment guides, go to the [Identity Deployment Guides](./active-directory-deployment-plans.md) repo on GitHub. To provide feedback about the deployment guides, use the [Deployment Plan Feedback form](https://aka.ms/deploymentplanfeedback). If you have any questions about the deployment guides, contact us at [IDGitDeploy](mailto:idgitdeploy@microsoft.com).

---

### Enterprise Applications Search - Load More Apps

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** SSO

Having trouble finding your applications / service principals? We've added the ability to load more applications in your enterprise applications all applications list. By default, we show 20 applications. You can now click, **Load more** to view additional applications.

---

### The May release of AADConnect contains a public preview of the integration with PingFederate, important security updates, many bug fixes, and new great new troubleshooting tools.

**Type:** Changed feature
**Service category:** AD Connect
**Product capability:** Identity Lifecycle Management

The May release of AADConnect contains a public preview of the integration with PingFederate, important security updates, many bug fixes, and new great new troubleshooting tools. You can find the release notes [here](../hybrid/reference-connect-version-history.md).

---

### Azure AD access reviews: auto-apply

**Type:** Changed feature
**Service category:** Access Reviews
**Product capability:** Governance

Access reviews of groups and apps are now generally available as part of Azure AD Premium P2. An administrator can configure to automatically apply the reviewer's changes to that group or app as the access review completes. The administrator can also specify what happens to the user's continued access if reviewers didn't respond, remove access, keep access, or take system recommendations.

---

### ID tokens can no longer be returned using the query response_mode for new apps.

**Type:** Changed feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Apps created on or after April 25, 2018 will no longer be able to request an **id_token** using the **query** response_mode.  This brings Azure AD inline with the OIDC specifications and helps reduce your apps attack surface.  Apps created before April 25, 2018 are not blocked from using the **query** response_mode with a response_type of **id_token**.  The error returned, when requesting an id_token from Azure AD, is **AADSTS70007: 'query' is not a supported value of 'response_mode' when requesting a token**.

The **fragment** and **form_post** response_modes continue to work - when creating new application objects (for example, for App Proxy usage), ensure use of one of these response_modes before they create a new application.

---

## April 2018

### Azure AD B2C Access Token are GA

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

You can now access Web APIs secured by Azure AD B2C using access tokens. The feature is moving from public preview to GA. The UI experience to configure Azure AD B2C applications and web APIs has been improved, and other minor improvements were made.

For more information, see [Azure AD B2C: Requesting access tokens](../../active-directory-b2c/access-tokens.md).

---

### Test single sign-on configuration for SAML-based applications

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** SSO

When configuring SAML-based SSO applications, you're able to test the integration on the configuration page. If you encounter an error during sign in, you can provide the error in the testing experience and Azure AD provides you with resolution steps to solve the specific issue.

For more information, see:

- [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](../manage-apps/view-applications-portal.md)
- [How to debug SAML-based single sign-on to applications in Azure Active Directory](../manage-apps/debug-saml-sso-issues.md)

---

### Azure AD terms of use now has per user reporting

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Compliance

Administrators can now select a given ToU and see all the users that have consented to that ToU and what date/time it took place.

For more information, see the [Azure AD terms of use feature](../conditional-access/terms-of-use.md).

---

### Azure AD Connect Health: Risky IP for AD FS extranet lockout protection

**Type:** New feature
**Service category:** Other
**Product capability:** Monitoring & Reporting

Connect Health now supports the ability to detect IP addresses that exceed a threshold of failed U/P logins on an hourly or daily basis. The capabilities provided by this feature are:

- Comprehensive report showing IP address and the number of failed logins generated on an hourly/daily basis with customizable threshold.
- Email-based alerts showing when a specific IP address has exceeded the threshold of failed U/P logins on an hourly/daily basis.
- A download option to do a detailed analysis of the data

For more information, see [Risky IP Report](../hybrid/how-to-connect-health-adfs.md).

---

### Easy app config with metadata file or URL

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** SSO

On the Enterprise applications page, administrators can upload a SAML metadata file to configure SAML based sign-on for Azure AD Gallery and Non-Gallery application.

Additionally, you can use Azure AD application federation metadata URL to configure SSO with the targeted application.

For more information, see [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](../manage-apps/view-applications-portal.md).

---

### Azure AD Terms of use now generally available

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Compliance


Azure AD terms of use have moved from public preview to generally available.

For more information, see the [Azure AD terms of use feature](../conditional-access/terms-of-use.md).

---

### Allow or block invitations to B2B users from specific organizations

**Type:** New feature
**Service category:** B2B
**Product capability:** B2B/B2C


You can now specify which partner organizations you want to share and collaborate with in Azure AD B2B Collaboration. To do this, you can choose to create list of specific allow or deny domains. When a domain is blocked using these capabilities, employees can no longer send invitations to people in that domain.

This helps you to control access to your resources, while enabling a smooth experience for approved users.

This B2B Collaboration feature is available for all Azure Active Directory customers and can be used in conjunction with Azure AD Premium features like Conditional Access and identity protection for more granular control of when and how external business users sign in and gain access.

For more information, see [Allow or block invitations to B2B users from specific organizations](../external-identities/allow-deny-list.md).

---

### New federated apps available in Azure AD app gallery

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In April 2018, we've added these 13 new apps with Federation support to our app gallery:

Criterion HCM, [FiscalNote](../saas-apps/fiscalnote-tutorial.md), [Secret Server (On-Premises)](../saas-apps/secretserver-on-premises-tutorial.md), [Dynamic Signal](../saas-apps/dynamicsignal-tutorial.md), [mindWireless](../saas-apps/mindwireless-tutorial.md), [OrgChart Now](../saas-apps/orgchartnow-tutorial.md), [Ziflow](../saas-apps/ziflow-tutorial.md), [AppNeta Performance Monitor](../saas-apps/appneta-tutorial.md), [Elium](../saas-apps/elium-tutorial.md), [Fluxx Labs](../saas-apps/fluxxlabs-tutorial.md), [Cisco Cloud](../saas-apps/ciscocloud-tutorial.md), Shelf, [SafetyNet](../saas-apps/safetynet-tutorial.md)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md).

For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Grant B2B users in Azure AD access to your on-premises applications (public preview)

**Type:** New feature
**Service category:** B2B
**Product capability:** B2B/B2C

As an organization that uses Azure Active Directory (Azure AD) B2B collaboration capabilities to invite guest users from partner organizations to your Azure AD, you can now provide these B2B users access to on-premises apps. These on-premises apps can use SAML-based authentication or Integrated Windows Authentication (IWA) with Kerberos constrained delegation (KCD).

For more information, see [Grant B2B users in Azure AD access to your on-premises applications](../external-identities/hybrid-cloud-to-on-premises.md).

---

### Get SSO integration tutorials from the Azure Marketplace

**Type:** Changed feature
**Service category:** Other
**Product capability:** 3rd Party Integration

If an application that is listed in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/azure-active-directory-apps?page=1) supports SAML based single sign-on, clicking **Get it now** provides you with the integration tutorial associated with that application.

---

### Faster performance of Azure AD automatic user provisioning to SaaS applications

**Type:** Changed feature
**Service category:** App Provisioning
**Product capability:** 3rd Party Integration

Previously, customers using the Azure Active Directory user provisioning connectors for SaaS applications (for example Salesforce, ServiceNow, and Box) could experience slow performance if their Azure AD tenants contained over 100,000 combined users and groups, and they were using user and group assignments to determine which users should be provisioned.

On April 2, 2018, significant performance enhancements were deployed to the Azure AD provisioning service that greatly reduce the amount of time needed to perform initial synchronizations between Azure Active Directory and target SaaS applications.

As a result, many customers that had initial synchronizations to apps that took many days or never completed, are now completing within a matter of minutes or hours.

For more information, see [What happens during provisioning?](../..//active-directory/app-provisioning/how-provisioning-works.md)

---

### Self-service password reset from Windows 10 lock screen for hybrid Azure AD joined machines

**Type:** Changed feature
**Service category:** Self Service Password Reset
**Product capability:** User Authentication

We have updated the Windows 10 SSPR feature to include support for machines that are hybrid Azure AD joined. This feature is available in Windows 10 RS4 allows users to reset their password from the lock screen of a Windows 10 machine. Users who are enabled and registered for self-service password reset can utilize this feature.

For more information, see [Azure AD password reset from the login screen](../authentication/howto-sspr-windows.md).

---

## March 2018

### Certificate expire notification

**Type:** Fixed
**Service category:** Enterprise Apps
**Product capability:** SSO

Azure AD sends a notification when a certificate for a gallery or non-gallery application is about to expire.

Some users did not receive notifications for enterprise applications configured for SAML-based single sign-on. This issue was resolved. Azure AD sends notification for certificates expiring in 7, 30 and 60 days. You are able to see this event in the audit logs.

For more information, see:

- [Manage Certificates for federated single sign-on in Azure Active Directory](../manage-apps/manage-certificates-for-federated-single-sign-on.md)
- [Audit activity reports in the Azure Active Directory portal](../reports-monitoring/concept-audit-logs.md)

---

### Twitter and GitHub identity providers in Azure AD B2C

**Type:** New feature
**Service category:** B2C - Consumer Identity Management
**Product capability:** B2B/B2C

You can now add Twitter or GitHub as an identity provider in Azure AD B2C. Twitter is moving from public preview to GA. GitHub is being released in public preview.

For more information, see [What is Azure AD B2B collaboration?](../external-identities/what-is-b2b.md).

---

### Restrict browser access using Intune Managed Browser with Azure AD application-based Conditional Access for iOS and Android

**Type:** New feature
**Service category:** Conditional Access
**Product capability:** Identity Security & Protection

**Now in public preview!**

**Intune Managed Browser SSO:** Your employees can use single sign-on across native clients (like Microsoft Outlook) and the Intune Managed Browser for all Azure AD-connected apps.

**Intune Managed Browser Conditional Access Support:** You can now require employees to use the Intune Managed browser using application-based Conditional Access policies.

Read more about this in our [blog post](https://cloudblogs.microsoft.com/enterprisemobility/2018/03/15/the-intune-managed-browser-now-supports-azure-ad-sso-and-conditional-access/).

For more information, see:

- [Setup application-based Conditional Access](../conditional-access/app-based-conditional-access.md)

- [Configure managed browser policies](/mem/intune/apps/manage-microsoft-edge)

---

### App Proxy Cmdlets in PowerShell GA Module

**Type:** New feature
**Service category:** App Proxy
**Product capability:** Access Control

Support for Application Proxy cmdlets is now in the PowerShell GA Module! This does require you to stay updated on PowerShell modules - if you become more than a year behind, some cmdlets may stop working.

For more information, see [AzureAD](/powershell/module/Azuread/).

---

### Office 365 native clients are supported by Seamless SSO using a non-interactive protocol

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

User using Office 365 native clients (version 16.0.8730.xxxx and above) get a silent sign-on experience using Seamless SSO. This support is provided by the addition a non-interactive protocol (WS-Trust) to Azure AD.

For more information, see [How does sign-in on a native client with Seamless SSO work?](../hybrid/how-to-connect-sso-how-it-works.md#how-does-sign-in-on-a-native-client-with-seamless-sso-work)

---

### Users get a silent sign-on experience, with Seamless SSO, if an application sends sign-in requests to Azure AD's tenant endpoints

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Users get a silent sign-on experience, with Seamless SSO, if an application (for example, `https://contoso.sharepoint.com`) sends sign-in requests to Azure AD's tenant endpoints - that is, `https://login.microsoftonline.com/contoso.com/<..>` or `https://login.microsoftonline.com/<tenant_ID>/<..>` - instead of Azure AD's common endpoint (`https://login.microsoftonline.com/common/<...>`).

For more information, see [Azure Active Directory Seamless Single Sign-On](../hybrid/how-to-connect-sso.md).

---

### Need to add only one Azure AD URL, instead of two URLs previously, to users' Intranet zone settings to roll out Seamless SSO

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

To roll out Seamless SSO to your users, you need to add only one Azure AD URL to the users' Intranet zone settings by using group policy in Active Directory: `https://autologon.microsoftazuread-sso.com`. Previously, customers were required to add two URLs.

For more information, see [Azure Active Directory Seamless Single Sign-On](../hybrid/how-to-connect-sso.md).

---

### New Federated Apps available in Azure AD app gallery

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In March 2018, we've added these 15 new apps with Federation support to our app gallery:

[Boxcryptor](../saas-apps/boxcryptor-tutorial.md), [CylancePROTECT](../saas-apps/cylanceprotect-tutorial.md), Wrike, [SignalFx](../saas-apps/signalfx-tutorial.md), Assistant by FirstAgenda, [YardiOne](../saas-apps/yardione-tutorial.md), Vtiger CRM, inwink, [Amplitude](../saas-apps/amplitude-tutorial.md), [Spacio](../saas-apps/spacio-tutorial.md), [ContractWorks](../saas-apps/contractworks-tutorial.md), [Bersin](../saas-apps/bersin-tutorial.md), [Mercell](../saas-apps/mercell-tutorial.md), [Trisotech Digital Enterprise Server](../saas-apps/trisotechdigitalenterpriseserver-tutorial.md), [Qumu Cloud](../saas-apps/qumucloud-tutorial.md).

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md).

For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### PIM for Azure Resources is generally available

**Type:** New feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

If you are using Azure AD Privileged Identity Management for directory roles, you can now use PIM's time-bound access and assignment capabilities for Azure Resource roles such as Subscriptions, Resource Groups, Virtual Machines, and any other resource supported by Azure Resource Manager. Enforce Multi-Factor Authentication when activating roles Just-In-Time, and schedule activations in coordination with approved change windows. In addition, this release adds enhancements not available during public preview including an updated UI, approval workflows, and the ability to extend roles expiring soon and renew expired roles.

For more information, see [PIM for Azure resources (Preview)](../privileged-identity-management/azure-pim-resource-rbac.md)

---

### Adding Optional Claims to your apps tokens (public preview)

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Your Azure AD app can now request custom or optional claims in JWTs or SAML tokens.  These are claims about the user or tenant that are not included by default in the token, due to size or applicability constraints.  This is currently in public preview for Azure AD apps on the v1.0 and v2.0 endpoints.  See the documentation for information on what claims can be added and how to edit your application manifest to request them.

For more information, see [Optional claims in Azure AD](../develop/active-directory-optional-claims.md).

---

### Azure AD supports PKCE for more secure OAuth flows

**Type:** New feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Azure AD docs have been updated to note support for PKCE, which allows for more secure communication during the OAuth 2.0 Authorization Code grant flow.  Both S256 and plaintext code_challenges are supported on the v1.0 and v2.0 endpoints.

For more information, see [Request an authorization code](../develop/v2-oauth2-auth-code-flow.md#request-an-authorization-code).

---

### Support for provisioning all user attribute values available in the Workday Get_Workers API

**Type:** New feature
**Service category:** App Provisioning
**Product capability:** 3rd Party Integration

The public preview of inbound provisioning from Workday to Active Directory and Azure AD now supports the ability to extract and provisioning all attribute values available in the Workday Get_Workers API. This adds supports for hundreds of additional standard and custom attributes beyond the ones shipped with the initial version of the Workday inbound provisioning connector.

For more information, see: [Customizing the list of Workday user attributes](../saas-apps/workday-inbound-tutorial.md#customizing-the-list-of-workday-user-attributes)

---

### Changing group membership from dynamic to static, and vice versa

**Type:** New feature
**Service category:** Group Management
**Product capability:** Collaboration

It is possible to change how membership is managed in a group. This is useful when you want to keep the same group name and ID in the system, so any existing references to the group are still valid; creating a new group would require updating those references.
We've updated the Azure AD Admin center to support this functionality. Now, customers can convert existing groups from dynamic membership to assigned membership and vice-versa. The existing PowerShell cmdlets are also still available.

For more information, see [Dynamic membership rules for groups in Azure Active Directory](../enterprise-users/groups-dynamic-membership.md)

---

### Improved sign-out behavior with Seamless SSO

**Type:** Changed feature
**Service category:** Authentications (Logins)
**Product capability:** User Authentication

Previously, even if users explicitly signed out of an application secured by Azure AD, they would be automatically signed back in using Seamless SSO if they were trying to access an Azure AD application again within their corpnet from their domain joined devices. With this change, sign out is supported.  This allows users to choose the same or different Azure AD account to sign back in with, instead of being automatically signed in using Seamless SSO.

For more information, see [Azure Active Directory Seamless Single Sign-On](../hybrid/how-to-connect-sso.md)

---

### Application Proxy Connector Version 1.5.402.0 Released

**Type:** Changed feature
**Service category:** App Proxy
**Product capability:** Identity Security & Protection

This connector version is gradually being rolled out through November. This new connector version includes the following changes:

- The connector now sets domain level cookies instead subdomain level. This ensures a smoother SSO experience and avoids redundant authentication prompts.
- Support for chunked encoding requests
- Improved connector health monitoring
- Several bug fixes and stability improvements

For more information, see [Understand Azure AD Application Proxy connectors](../manage-apps/application-proxy-connectors.md).

---

## February 2018

### Improved navigation for managing users and groups

**Type:** Plan for change
**Service category:** Directory Management
**Product capability:** Directory

The navigation experience for managing users and groups has been streamlined. You can now navigate from the directory overview directly to the list of all users, with easier access to the list of deleted users. You can also navigate from the directory overview directly to the list of all groups, with easier access to group management settings. And also from the directory overview page, you can search for a user, group, enterprise application, or app registration.

---

### Availability of sign-ins and audit reports in Microsoft Azure operated by 21Vianet (Azure China 21Vianet)

**Type:** New feature
**Service category:** Azure Stack
**Product capability:** Monitoring & Reporting

Azure AD Activity log reports are now available in Microsoft Azure operated by 21Vianet (Azure China 21Vianet) instances. The following logs are included:

- **Sign-ins activity logs**  - Includes all the sign-ins logs associated with your tenant.

- **Self service Password Audit Logs** - Includes all the SSPR audit logs.

- **Directory Management Audit logs** - Includes all the directory management-related audit logs like User management, App Management, and others.

With these logs, you can gain insights into how your environment is doing. The provided data enables you to:

- Determine how your apps and services are utilized by your users.

- Troubleshoot issues preventing your users from getting their work done.

For more information about how to use these reports, see [Azure Active Directory reporting](../reports-monitoring/overview-reports.md).

---

### Use "Report Reader" role (non-admin role) to view Azure AD Activity Reports

**Type:** New feature
**Service category:** Reporting
**Product capability:** Monitoring & Reporting

As part of customers feedback to enable non-admin roles to have access to Azure AD activity logs, we have enabled the ability for users who are in the "Report Reader" role to access Sign-ins and Audit activity within the Azure portal as well as using the Microsoft Graph API.

For more information, how to use these reports, see [Azure Active Directory reporting](../reports-monitoring/overview-reports.md).

---

### EmployeeID claim available as user attribute and user identifier

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** SSO

You can configure **EmployeeID** as the User identifier and User attribute for member users and B2B guests in SAML-based sign-on applications from the Enterprise application UI.

For more information, see [Customizing claims issued in the SAML token for enterprise applications in Azure Active Directory](../develop/active-directory-saml-claims-customization.md).

---

### Simplified Application Management using Wildcards in Azure AD Application Proxy

**Type:** New feature
**Service category:** App Proxy
**Product capability:** User Authentication

To make application deployment easier and reduce your administrative overhead, we now support the ability to publish applications using wildcards. To publish a wildcard application, you can follow the standard application publishing flow, but use a wildcard in the internal and external URLs.

For more information, see [Wildcard applications in the Azure Active Directory application proxy](../manage-apps/application-proxy-wildcard.md)

---

### New cmdlets to support configuration of Application Proxy

**Type:** New feature
**Service category:** App Proxy
**Product capability:** Platform

The latest release of the AzureAD PowerShell Preview module contains new cmdlets that allow customers to configure Application Proxy Applications using PowerShell.

The new cmdlets are:

- Get-AzureADApplicationProxyApplication
- Get-AzureADApplicationProxyApplicationConnectorGroup
- Get-AzureADApplicationProxyConnector
- Get-AzureADApplicationProxyConnectorGroup
- Get-AzureADApplicationProxyConnectorGroupMembers
- Get-AzureADApplicationProxyConnectorMemberOf
- New-AzureADApplicationProxyApplication
- New-AzureADApplicationProxyConnectorGroup
- Remove-AzureADApplicationProxyApplication
- Remove-AzureADApplicationProxyApplicationConnectorGroup
- Remove-AzureADApplicationProxyConnectorGroup
- Set-AzureADApplicationProxyApplication
- Set-AzureADApplicationProxyApplicationConnectorGroup
- Set-AzureADApplicationProxyApplicationCustomDomainCertificate
- Set-AzureADApplicationProxyApplicationSingleSignOn
- Set-AzureADApplicationProxyConnector
- Set-AzureADApplicationProxyConnectorGroup

---

### New cmdlets to support configuration of groups

**Type:** New feature
**Service category:** App Proxy
**Product capability:** Platform

The latest release of the AzureAD PowerShell module contains cmdlets to manage groups in Azure AD. These cmdlets were previously available in the AzureADPreview module and are now added to the AzureAD module

The Group cmdlets that are now release for General Availability are:

- Get-AzureADMSGroup
- New-AzureADMSGroup
- Remove-AzureADMSGroup
- Set-AzureADMSGroup
- Get-AzureADMSGroupLifecyclePolicy
- New-AzureADMSGroupLifecyclePolicy
- Remove-AzureADMSGroupLifecyclePolicy
- Add-AzureADMSLifecyclePolicyGroup
- Remove-AzureADMSLifecyclePolicyGroup
- Reset-AzureADMSLifeCycleGroup
- Get-AzureADMSLifecyclePolicyGroup

---

### A new release of Azure AD Connect is available

**Type:** New feature
**Service category:** AD Sync
**Product capability:** Platform

Azure AD Connect is the preferred tool to synchronize data between Azure AD and on premises data sources, including Windows Server Active Directory and LDAP.

>[!Important]
>This build introduces schema and sync rule changes. The Azure AD Connect Synchronization Service triggers a Full Import and Full Synchronization steps after an upgrade. For information on how to change this behavior, see [How to defer full synchronization after upgrade](../hybrid/how-to-upgrade-previous-version.md#how-to-defer-full-synchronization-after-upgrade).

This release has the following updates and changes:

**Fixed issues**

- Fix timing window on background tasks for Partition Filtering page when switching to next page.

- Fixed a bug that caused Access violation during the ConfigDB custom action.

- Fixed a bug to recover from sql connection timeout.

- Fixed a bug where certificates with SAN wildcards fail pre-req check.

- Fixed a bug that causes miiserver.exe crash during Azure AD connector export.

- Fixed a bug where a bad password attempt logged on DC when running caused the Azure AD connect wizard to change configuration

**New features and improvements**

- Application telemetry - Administrators can switch this class of data on/off.

- Azure AD Health data - Administrators must visit the health portal to control their health settings. Once the service policy has been changed, the agents will read and enforce it.

- Added device writeback configuration actions and a progress bar for page initialization.

- Improved general diagnostics with HTML report and full data collection in a ZIP-Text / HTML Report.

- Improved reliability of auto upgrade and added additional telemetry to ensure the health of the server can be determined.

- Restrict permissions available to privileged accounts on AD Connector account. For new installations, the wizard restricts the permissions that privileged accounts have on the MSOL account after creating the MSOL account. The changes affect express installations and custom installations with Auto-Create account.

- Changed the installer to not require SA privilege on clean install of AADConnect.

- New utility to troubleshoot synchronization issues for a specific object. Currently, the utility checks for the following things:

    - UserPrincipalName mismatch between synchronized user object and the user account in Azure AD Tenant.

    - If the object is filtered from synchronization due to domain filtering

    - If the object is filtered from synchronization due to organizational unit (OU) filtering

- New utility to synchronize the current password hash stored in the on-premises Active Directory for a specific user account. The utility does not require a password change.

---

### Applications supporting Intune App Protection policies added for use with Azure AD application-based Conditional Access

**Type:** Changed feature
**Service category:** Conditional Access
**Product capability:** Identity Security & Protection

We have added more applications that support application-based Conditional Access. Now, you can get access to Office 365 and other Azure AD-connected cloud apps using these approved client apps.

The following applications will be added by the end of February:

- Microsoft Power BI

- Microsoft Launcher

- Microsoft Invoicing

For more information, see:

- [Approved client app requirement](../conditional-access/concept-conditional-access-conditions.md#client-apps)
- [Azure AD app-based Conditional Access](../conditional-access/app-based-conditional-access.md)

---

### Terms of use update to mobile experience

**Type:** Changed feature
**Service category:** Terms of use
**Product capability:** Compliance

When the terms of use are displayed, you can now click **Having trouble viewing? Click here**. Clicking this link opens the terms of use natively on your device. Regardless of the font size in the document or the screen size of device, you can zoom and read the document as needed.

---

## January 2018

### New Federated Apps available in Azure AD app gallery

**Type:** New feature
**Service category:** Enterprise Apps
**Product capability:** 3rd Party Integration

In January 2018, the following new apps with federation support were added in the app gallery:

[IBM OpenPages](../saas-apps/ibmopenpages-tutorial.md), [OneTrust Privacy Management Software](../saas-apps/onetrust-tutorial.md), [Dealpath](../saas-apps/dealpath-tutorial.md), [IriusRisk Federated Directory, and [Fidelity NetBenefits](../saas-apps/fidelitynetbenefits-tutorial.md).

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md).

For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Sign in with additional risk detected

**Type:** New feature
**Service category:** Identity Protection
**Product capability:** Identity Security & Protection

The insight you get for a detected risk detection is tied to your Azure AD subscription. With the Azure AD Premium P2 edition, you get the most detailed information about all underlying detections.

With the Azure AD Premium P1 edition, detections that are not covered by your license appear as the risk detection Sign-in with additional risk detected.

For more information, see [Azure Active Directory risk detections](../identity-protection/overview-identity-protection.md).

---

### Hide Office 365 applications from end user's access panels

**Type:** New feature
**Service category:** My Apps
**Product capability:** SSO

You can now better manage how Office 365 applications show up on your user's access panels through a new user setting. This option is helpful for reducing the number of apps in a user's access panels if you prefer to only show Office apps in the Office portal. The setting is located in the **User Settings** and is labeled, **Users can only see Office 365 apps in the Office 365 portal**.

For more information, see [Hide an application from user's experience in Azure Active Directory](../manage-apps/hide-application-from-user-portal.md).

---

### Seamless sign into apps enabled for Password SSO directly from app's URL

**Type:** New feature
**Service category:** My Apps
**Product capability:** SSO

The My Apps browser extension is now available via a convenient tool that gives you the My Apps single-sign on capability as a shortcut in your browser. After installing, user's will see a waffle icon in their browser that provides them quick access to apps. Users can now take advantage of:

- The ability to directly sign in to password-SSO based apps from the app's sign-in page
- Launch any app using the quick search feature
- Shortcuts to recently used apps from the extension
- The extension is available for Microsoft Edge, Chrome, and Firefox.

For more information, see [My Apps Secure Sign-in Extension](../user-help/my-apps-portal-end-user-access.md#download-and-install-the-my-apps-secure-sign-in-extension).

---

### Azure AD administration experience in Azure Classic Portal has been retired

**Type:** Deprecated
**Service category:** Azure AD
**Product capability:** Directory

As of January 8, 2018, the Azure AD administration experience in the Azure classic portal has been retired. This took place in conjunction with the retirement of the Azure classic portal itself. In the future, you should use the [Azure AD admin center](https://aad.portal.azure.com) for all your portal-based administration of Azure AD.

---

### The PhoneFactor web portal has been retired

**Type:** Deprecated
**Service category:** Azure AD
**Product capability:** Directory

As of January 8, 2018, the PhoneFactor web portal has been retired. This portal was used for the administration of MFA server, but those functions have been moved into the Azure portal at portal.azure.com.

The MFA configuration is located at: **Azure Active Directory \> MFA Server**

---

### Deprecate Azure AD reports

**Type:** Deprecated
**Service category:** Reporting
**Product capability:** Identity Lifecycle Management


With the general availability of the new Azure Active Directory Administration console and new APIs now available for both activity and security reports, the report APIs under "/reports" endpoint have been retired as of end of December 31, 2017.

**What's available?**

As part of the transition to the new admin console, we have made 2 new APIs available for retrieving Azure AD Activity Logs. The new set of APIs provides richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports can now be accessed through the Identity Protection risk detections API in Microsoft Graph.

For more information, see:

- [Get started with the Azure Active Directory reporting API](../reports-monitoring/concept-reporting-api.md)

- [Get started with Azure Active Directory Identity Protection and Microsoft Graph](../identity-protection/howto-identity-protection-graph-api.md)

---

## December 2017

### Terms of use in the Access Panel

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Compliance

You now can go to the Access Panel and view the terms of use that you previously accepted.

Follow these steps:

1. Go to the [MyApps portal](https://myapps.microsoft.com), and sign in.

2. In the upper-right corner, select your name, and then select **Profile** from the list.

3. On your **Profile**, select **Review terms of use**.

4. Now you can review the terms of use you accepted.

For more information, see the [Azure AD terms of use feature (preview)](../conditional-access/terms-of-use.md).

---

### New Azure AD sign-in experience

**Type:** New feature
**Service category:** Azure AD
**Product capability:** User authentication

The Azure AD and Microsoft account identity system UIs were redesigned so that they have a consistent look and feel. In addition, the Azure AD sign-in page collects the user name first, followed by the credential on a second screen.

For more information, see [The new Azure AD sign-in experience is now in public preview](https://cloudblogs.microsoft.com/enterprisemobility/2017/08/02/the-new-azure-ad-signin-experience-is-now-in-public-preview/).

---

### Fewer sign-in prompts: A new "keep me signed in" experience for Azure AD sign-in

**Type:** New feature
**Service category:** Azure AD
**Product capability:** User authentication

The **Keep me signed in** check box on the Azure AD sign-in page was replaced with a new prompt that shows up after you successfully authenticate.

If you respond **Yes** to this prompt, the service gives you a persistent refresh token. This behavior is the same as when you selected the **Keep me signed in** check box in the old experience. For federated tenants, this prompt shows after you successfully authenticate with the federated service.

For more information, see [Fewer sign-in prompts: The new "keep me signed in" experience for Azure AD is in preview](https://cloudblogs.microsoft.com/enterprisemobility/2017/09/19/fewer-login-prompts-the-new-keep-me-signed-in-experience-for-azure-ad-is-in-preview/).

---

### Add configuration to require the terms of use to be expanded prior to accepting

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Compliance

An option for administrators requires their users to expand the terms of use prior to accepting the terms.

Select either **On** or **Off** to require users to expand the terms of use. The **On** setting requires users to view the terms of use prior to accepting them.

For more information, see the [Azure AD terms of use feature (preview)](../conditional-access/terms-of-use.md).

---

### Scoped activation for eligible role assignments

**Type:** New feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

You can use scoped activation to activate eligible Azure resource role assignments with less autonomy than the original assignment defaults. An example is if you're assigned as the owner of a subscription in your tenant. With scoped activation, you can activate the owner role for up to five resources contained within the subscription (such as resource groups and virtual machines). Scoping your activation might reduce the possibility of executing unwanted changes to critical Azure resources.

For more information, see [What is Azure AD Privileged Identity Management?](../privileged-identity-management/pim-configure.md).

---

### New federated apps in the Azure AD app gallery

**Type:** New feature
**Service category:** Enterprise apps
**Product capability:** 3rd Party Integration

In December 2017, we've added these new apps with Federation support to our app gallery:

[Accredible](../saas-apps/accredible-tutorial.md), Adobe Experience Manager, [EFI Digital StoreFront](../saas-apps/efidigitalstorefront-tutorial.md), [Communifire](../saas-apps/communifire-tutorial.md)
CybSafe, [FactSet](../saas-apps/factset-tutorial.md), [IMAGE WORKS](../saas-apps/imageworks-tutorial.md), [MOBI](../saas-apps/mobi-tutorial.md), [MobileIron Azure AD integration](../saas-apps/mobileiron-tutorial.md), [Reflektive](../saas-apps/reflektive-tutorial.md), [SAML SSO for Bamboo by resolution GmbH](../saas-apps/bamboo-tutorial.md), [SAML SSO for Bitbucket by resolution GmbH](../saas-apps/bitbucket-tutorial.md), [Vodeclic](../saas-apps/vodeclic-tutorial.md), WebHR, Zenegy Azure AD Integration.

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md).

For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../develop/v2-howto-app-gallery-listing.md).

---

### Approval workflows for Azure AD directory roles

**Type:** Changed feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

Approval workflow for Azure AD directory roles is generally available.

With approval workflow, privileged-role administrators can require eligible-role members to request role activation before they can use the privileged role. Multiple users and groups can be delegated approval responsibilities. Eligible role members receive notifications when approval is finished and their role is active.

---

### Pass-through authentication: Skype for Business support

**Type:** Changed feature
**Service category:** Authentications (Logins)
**Product capability:** User authentication

Pass-through authentication now supports user sign-ins to Skype for Business client applications that support modern authentication, which includes online and hybrid topologies.

For more information, see [Skype for Business topologies supported with modern authentication](/skypeforbusiness/plan-your-deployment/modern-authentication/topologies-supported).

---

### Updates to Azure AD Privileged Identity Management for Azure RBAC (preview)

**Type:** Changed feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

With the public preview refresh of Azure AD Privileged Identity Management (PIM) for Azure role-based access control (Azure RBAC), you can now:

* Use Just Enough Administration.
* Require approval to activate resource roles.
* Schedule a future activation of a role that requires approval for both Azure AD and Azure roles.

For more information, see [Privileged Identity Management for Azure resources (preview)](../privileged-identity-management/azure-pim-resource-rbac.md).

---

## November 2017

### Access Control service retirement

**Type:** Plan for change
**Service category:** Access Control service
**Product capability:** Access Control service

Azure Active Directory Access Control (also known as the Access Control service) will be retired in late 2018. More information that includes a detailed schedule and high-level migration guidance will be provided in the next few weeks. You can leave comments on this page with any questions about the Access Control service, and a team member will answer them.

---

### Restrict browser access to the Intune Managed Browser

**Type:** Plan for change
**Service category:** Conditional Access
**Product capability:** Identity security and protection

You can restrict browser access to Office 365 and other Azure AD-connected cloud apps by using the Intune Managed Browser as an approved app.

You now can configure the following condition for application-based Conditional Access:

**Client apps:** Browser

**What is the effect of the change?**

Today, access is blocked when you use this condition. When the preview is available, all access will require the use of the managed browser application.

Look for this capability and more information in upcoming blogs and release notes.

For more information, see [Conditional Access in Azure AD](../conditional-access/overview.md).

---

### New approved client apps for Azure AD app-based Conditional Access

**Type:** Plan for change
**Service category:** Conditional Access
**Product capability:** Identity security and protection

The following apps are on the list of [approved client apps](../conditional-access/concept-conditional-access-conditions.md#client-apps):

- [Microsoft Kaizala](https://www.microsoft.com/garage/profiles/kaizala/)
- Microsoft StaffHub

For more information, see:

- [Approved client app requirement](../conditional-access/concept-conditional-access-conditions.md#client-apps)
- [Azure AD app-based Conditional Access](../conditional-access/app-based-conditional-access.md)

---

### Terms-of-use support for multiple languages

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Compliance

Administrators now can create new terms of use that contain multiple PDF documents. You can tag these PDF documents with a corresponding language. Users are shown the PDF with the matching language based on their preferences. If there is no match, the default language is shown.

---

### Real-time password writeback client status

**Type:** New feature
**Service category:** Self-service password reset
**Product capability:** User authentication

You now can review the status of your on-premises password writeback client. This option is available in the **On-premises integration** section of the [Password reset](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset) page.

If there are issues with your connection to your on-premises writeback client, you see an error message that provides you with:

- Information on why you can't connect to your on-premises writeback client.
- A link to documentation that assists you in resolving the issue.

For more information, see [on-premises integration](../authentication/concept-sspr-howitworks.md#on-premises-integration).

---

### Azure AD app-based Conditional Access

**Type:** New feature
**Service category:** Azure AD
**Product capability:** Identity security and protection

You now can restrict access to Office 365 and other Azure AD-connected cloud apps to [approved client apps](../conditional-access/concept-conditional-access-conditions.md#client-apps) that support Intune app protection policies by using [Azure AD app-based Conditional Access](../conditional-access/app-based-conditional-access.md). Intune app protection policies are used to configure and protect company data on these client applications.

By combining [app-based](../conditional-access/app-based-conditional-access.md) with [device-based](../conditional-access/require-managed-devices.md) Conditional Access policies, you have the flexibility to protect data for personal and company devices.

The following conditions and controls are now available for use with app-based Conditional Access:

**Supported platform condition**

- iOS
- Android

**Client apps condition**

- Mobile apps and desktop clients

**Access control**

- Require approved client app

For more information, see [Azure AD app-based Conditional Access](../conditional-access/app-based-conditional-access.md).

---

### Manage Azure AD devices in the Azure portal

**Type:** New feature
**Service category:** Device registration and management
**Product capability:** Identity security and protection

You now can find all your devices connected to Azure AD and the device-related activities in one place. There is a new administration experience to manage all your device identities and settings in the Azure portal. In this release, you can:

- View all your devices that are available for Conditional Access in Azure AD.
- View properties, which include your hybrid Azure AD-joined devices.
- Find BitLocker keys for your Azure AD-joined devices, manage your device with Intune, and more.
- Manage Azure AD device-related settings.

For more information, see [Manage devices by using the Azure portal](../devices/device-management-azure-portal.md).

---

### Support for macOS as a device platform for Azure AD Conditional Access

**Type:** New feature
**Service category:** Conditional Access
**Product capability:** Identity security and protection

You now can include (or exclude) macOS as a device platform condition in your Azure AD Conditional Access policy. With the addition of macOS to the supported device platforms, you can:

- **Enroll and manage macOS devices by using Intune.** Similar to other platforms like iOS and Android, a company portal application is available for macOS to do unified enrollments. You can use the new company portal app for macOS to enroll a device with Intune and register it with Azure AD.
- **Ensure macOS devices adhere to your organization's compliance policies defined in Intune.** In Intune on the Azure portal, you now can set up compliance policies for macOS devices.
- **Restrict access to applications in Azure AD to only compliant macOS devices.** Conditional Access policy authoring has macOS as a separate device platform option. Now you can author macOS-specific Conditional Access policies for the targeted application set in Azure.

For more information, see:

- [Create a device compliance policy for macOS devices with Intune](/mem/intune/protect/compliance-policy-create-mac-os)
- [Conditional Access in Azure AD](../conditional-access/overview.md)

---

### Network Policy Server extension for Azure AD Multi-Factor Authentication

**Type:** New feature
**Service category:**  Multi-factor authentication
**Product capability:** User authentication

The Network Policy Server extension for Azure AD Multi-Factor Authentication adds cloud-based Multi-Factor Authentication capabilities to your authentication infrastructure by using your existing servers. With the Network Policy Server extension, you can add phone call, text message, or phone app verification to your existing authentication flow. You don't have to install, configure, and maintain new servers.

This extension was created for organizations that want to protect virtual private network connections without deploying the Azure Multi-Factor Authentication Server. The Network Policy Server extension acts as an adapter between RADIUS and cloud-based Azure AD Multi-Factor Authentication to provide a second factor of authentication for federated or synced users.

For more information, see [Integrate your existing Network Policy Server infrastructure with Azure AD Multi-Factor Authentication](../authentication/howto-mfa-nps-extension.md).

---

### Restore or permanently remove deleted users

**Type:** New feature
**Service category:** User management
**Product capability:** Directory

In the Azure AD admin center, you can now:

- Restore a deleted user.
- Permanently delete a user.

**To try it out:**

1. In the Azure AD admin center, select [All users](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/All) in the **Manage** section.

2. From the **Show** list, select **Recently deleted users**.

3. Select one or more recently deleted users, and then either restore them or permanently delete them.

---

### New approved client apps for Azure AD app-based Conditional Access

**Type:** Changed feature
**Service category:** Conditional Access
**Product capability:** Identity security and protection

The following apps were added to the list of [approved client apps](../conditional-access/concept-conditional-access-conditions.md#client-apps):

- Microsoft Planner
- Azure Information Protection

For more information, see:

- [Approved client app requirement](../conditional-access/concept-conditional-access-conditions.md#client-apps)
- [Azure AD app-based Conditional Access](../conditional-access/app-based-conditional-access.md)

---

### Use "OR" between controls in a Conditional Access policy

**Type:** Changed feature
**Service category:** Conditional Access
**Product capability:** Identity security and protection

You now can use "OR" (require one of the selected controls) for Conditional Access controls. You can use this feature to create policies with "OR" between access controls. For example, you can use this feature to create a policy that requires a user to sign in by using Multi-Factor Authentication "OR" to be on a compliant device.

For more information, see [Controls in Azure AD Conditional Access](../conditional-access/controls.md).

---

### Aggregation of real-time risk detections

**Type:** Changed feature
**Service category:** Identity protection
**Product capability:** Identity security and protection

In Azure AD Identity Protection, all real-time risk detections that originated from the same IP address on a given day are now aggregated for each risk detection type. This change limits the volume of risk detections shown without any change in user security.

The underlying real-time detection works each time the user signs in. If you have a sign-in risk security policy set up to Multi-Factor Authentication or block access, it is still triggered during each risky sign-in.

---

## October 2017

### Deprecate Azure AD reports

**Type:** Plan for change
**Service category:** Reporting
**Product capability:** Identity Lifecycle Management

The Azure portal provides you with:

- A new Azure AD administration console.
- New APIs for activity and security reports.

Due to these new capabilities, the report APIs under the /reports endpoint were retired on December 10, 2017.

---

### Automatic sign-in field detection

**Type:** Fixed
**Service category:** My Apps
**Product capability:** Single sign-on

Azure AD supports automatic sign-in field detection for applications that render an HTML user name and password field. These steps are documented in [How to automatically capture sign-in fields for an application](../manage-apps/troubleshoot-password-based-sso.md#manually-capture-sign-in-fields-for-an-app). You can find this capability by adding a *Non-Gallery* application on the **Enterprise Applications** page in the [Azure portal](https://aad.portal.azure.com). Additionally, you can configure the **Single Sign-on** mode on this new application to **Password-based Single Sign-on**, enter a web URL, and then save the page.

Due to a service issue, this functionality was temporarily disabled. The issue was resolved, and the automatic sign-in field detection is available again.

---

### New Multi-Factor Authentication features

**Type:** New feature
**Service category:** Multi-factor authentication
**Product capability:** Identity security and protection

Multi-factor authentication (MFA) is an essential part of protecting your organization. To make credentials more adaptive and the experience more seamless, the following features were added:

- Multi-factor challenge results are directly integrated into the Azure AD sign-in report, which includes programmatic access to MFA results.
- The MFA configuration is more deeply integrated into the Azure AD configuration experience in the Azure portal.

With this public preview, MFA management and reporting are an integrated part of the core Azure AD configuration experience. Now you can manage the MFA management portal functionality within the Azure AD experience.

For more information, see [Reference for MFA reporting in the Azure portal](../authentication/howto-mfa-reporting.md).

---

### Terms of use

**Type:** New feature
**Service category:** Terms of use
**Product capability:** Compliance

You can use Azure AD terms of use to present information such as relevant disclaimers for legal or compliance requirements to users.

You can use Azure AD terms of use in the following scenarios:

- General terms of use for all users in your organization
- Specific terms of use based on a user's attributes (for example, doctors vs. nurses or domestic vs. international employees, done by dynamic groups)
- Specific terms of use for accessing high-impact business apps, like Salesforce

For more information, see [Azure AD terms of use](../conditional-access/terms-of-use.md).

---

### Enhancements to Privileged Identity Management

**Type:** New feature
**Service category:** Privileged Identity Management
**Product capability:** Privileged Identity Management

With Azure AD Privileged Identity Management, you can manage, control, and monitor access to Azure resources (preview) within your organization to:

- Subscriptions
- Resource groups
- Virtual machines

All resources within the Azure portal that use the Azure RBAC functionality can take advantage of all the security and lifecycle management capabilities that Azure AD Privileged Identity Management has to offer.

For more information, see [Privileged Identity Management for Azure resources](../privileged-identity-management/azure-pim-resource-rbac.md).

---

### Access reviews

**Type:** New feature
**Service category:** Access reviews
**Product capability:** Compliance

Organizations can use access reviews (preview) to efficiently manage group memberships and access to enterprise applications:

- You can recertify guest user access by using access reviews of their access to applications and memberships of groups. Reviewers can efficiently decide whether to allow guests continued access based on the insights provided by the access reviews.
- You can recertify employee access to applications and group memberships with access reviews.

You can collect the access review controls into programs relevant for your organization to track reviews for compliance or risk-sensitive applications.

For more information, see [Azure AD access reviews](../governance/access-reviews-overview.md).

---

### Hide third-party applications from My Apps and the Office 365 app launcher

**Type:** New feature
**Service category:** My Apps
**Product capability:** Single sign-on

You now can better manage apps that show up on your users' portals through a new **hide app** property. You can hide apps to help in cases where app tiles show up for back-end services or duplicate tiles and clutter users' app launchers. The toggle is in the **Properties** section of the third-party app and is labeled **Visible to user?** You also can hide an app programmatically through PowerShell.

For more information, see [Hide a third-party application from a user's experience in Azure AD](../manage-apps/hide-application-from-user-portal.md).


**What's available?**

 As part of the transition to the new admin console, two new APIs for retrieving Azure AD activity logs are available. The new set of APIs provides richer filtering and sorting functionality in addition to providing richer audit and sign-in activities. The data previously available through the security reports now can be accessed through the Identity Protection Risk Detections API in Microsoft Graph.


## September 2017

### Hotfix for Identity Manager

**Type:** Changed feature
**Service category:** Identity Manager
**Product capability:** Identity lifecycle management

A hotfix roll-up package (build 4.4.1642.0) is available as of September 25, 2017, for Identity Manager 2016 Service Pack 1. This roll-up package:

- Resolves issues and adds improvements.
- Is a cumulative update that replaces all Identity Manager 2016 Service Pack 1 updates up to build 4.4.1459.0 for Identity Manager 2016.
- Requires you to have Identity Manager 2016 build 4.4.1302.0.

For more information, see [Hotfix rollup package (build 4.4.1642.0) is available for Identity Manager 2016 Service Pack 1](https://support.microsoft.com/help/4021562).

---