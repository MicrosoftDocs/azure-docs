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
ms.date: 10/06/2020
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
## October 2020

### Azure AD On-Premises Hybrid Agents Impacted by Azure TLS Certificate Changes

**Type:** Plan for change  
**Service category:** N/A  
**Product capability:** Platform

Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). This update is due to the current CA certificates not complying with one of the CA/Browser Forum Baseline requirements. This change will impact Azure AD hybrid agents installed on-premises that have hardened environments with a fixed list of root certificates and will need to be updated to trust the new certificate issuers.

This change will result in disruption of service if you don't take action immediately. These agents include [Application Proxy connectors](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AppProxy) for remote access to on-premises, [Passthrough Authentication](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AzureADConnect) agents that allow your users to sign in to applications using the same passwords, and [Cloud Provisioning Preview](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AzureADConnect) agents that perform AD to Azure AD sync. 

If you have an environment with firewall rules set to allow outbound calls to only specific Certificate Revocation List (CRL) download, you will need to allow the following CRL and OCSP URLs. For full details on the change and the CRL and OCSP URLs to enable access to, see  [Azure TLS certificate changes](../../security/fundamentals/tls-certificate-changes.md).

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

- Attribute Mapping Experience through Azure Portal

    With this feature, IT Admins can map user, group, or contact attributes from AD to Azure AD using various mapping types present today. Attribute mapping is a feature used for standardizing the values of the attributes that flow from Active Directory to Azure Active Directory. One can determine whether to directly map the attribute value as it is from AD to Azure AD or use expressions to transform the attribute values when provisioning users. [Learn more](../cloud-provisioning/how-to-attribute-mapping.md)

- On-demand Provisioning or Test User experience

    Once you have setup your configuration, you might want to test to see if the user transformation is working as expected before applying it to all your users in scope. With on-demand provisioning, IT Admins can enter the Distinguished Name (DN) of an AD user and see if they are getting synced as expected. On-demand provisioning provides a great way to ensure that the attribute mappings you did previously work as expected. [Learn More](../cloud-provisioning/how-to-on-demand-provision.md)
 
---

### Audited BitLocker Recovery in Azure AD - Public Preview

**Type:** New feature  
**Service category:** Device Access Management  
**Product capability:** Device Lifecycle Management
 
When IT admins or end users read BitLocker recovery key(s) they have access to, Azure Active Directory now generates an audit log that captures who accessed the recovery key. The same audit provides details of the device the BitLocker key was associated with.

End users can [access their recovery keys via My Account](../user-help/my-account-portal-devices-page.md#view-a-bitlocker-key). IT admins can access recovery keys via the [BitLocker recovery key API in beta](/graph/api/resources/bitlockerrecoverykey?view=graph-rest-beta) or via the Azure AD Portal. To learn more, see [View or copy BitLocker keys in the Azure AD Portal](../devices/device-management-azure-portal.md#view-or-copy-bitlocker-keys).

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
 
Previously, onboarding to Privileged Identity Management (PIM) required user consent and an onboarding flow in PIM's blade that included enrollment in Azure MFA. With the recent integration of PIM experience into the Azure AD roles and administrators blade, we are removing this experience. Any tenant with valid P2 license will be auto-onboarded to PIM.

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

We're updating the Identity Secure Score portal to align with the changes introduced in Microsoft Secure Score’s [new release](/microsoft-365/security/mtp/microsoft-secure-score-whats-new?view=o365-worldwide). 

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
 
Previously, Custom Open ID Connect providers could only be added or managed through the Azure portal. Now the Azure AD B2C customers can add and manage them through Microsoft Graph APIs beta version as well. To learn how to configure this resource with APIs, see [identityProvider resource type](/graph/api/resources/identityprovider?view=graph-rest-beta).
 
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
 
Previously, only the Global Administrator could manage the [extension property](/graph/api/application-post-extensionproperty?view=graph-rest-beta&tabs=http). We're now enabling this capability for the Application Administrator and Cloud Application Administrator as well.
 
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

For more information about users flows, see [User flow versions in Azure Active Directory B2C](../../active-directory-b2c/user-flow-versions.md#:~:text=    User flow  ,account. Usi ...  1 more rows ).

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

### New provisioning connectors in the Azure AD Application Gallery - July 2020

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration

You can now automate creating, updating, and deleting user accounts for the newly integrated app [LinkedIn Learning](../saas-apps/linkedin-learning-provisioning-tutorial.md).

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

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
 

The externalUserState and externalUserStateChangedDateTime properties can be used to find invited B2B guests who have not accepted their invitations yet as well as build automation such as deleting users who haven't accepted their invitations after some number of days. These properties are now available in MS Graph v1. For guidance on using these properties, refer to [User resource type](/graph/api/resources/user?view=graph-rest-1.0).
 
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
 
A new delegated permission EntitlementManagement.Read.All is now available for use with the Entitlement Management API in Microsoft Graph beta. To find out more about the available APIs, see [Working with the Azure AD entitlement management API](/graph/api/resources/entitlementmanagement-root?view=graph-rest-beta).

---

### Identity Protection APIs available in v1.0

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection
 
The riskyUsers and riskDetections Microsoft Graph APIs are now generally available. Now that they are available at the v1.0 endpoint, we invite you to use them in production. For more information, please check out the [Microsoft Graph docs](/graph/api/resources/identityprotectionroot?view=graph-rest-1.0).
 
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
 
IT Admins can start using the new "Hybrid Admin" role as the least privileged role for setting up Azure ADConnect Cloud Provisioning. With this new role, you no longer have to use the Global Admin role to setup and configure Cloud Provisioning. [Learn more](../roles/delegate-by-task.md#connect).
 
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

[Report-only mode for Azure AD Conditional Access](../conditional-access/concept-conditional-access-report-only.md) lets you evaluate the result of a policy without enforcing access controls. You can test report-only policies across your organization and understand their impact before enabling them, making deployment safer and easier. Over the past few months, we’ve seen strong adoption of report-only mode—over 26M users are already in scope of a report-only policy. With the announcement today, new Azure AD Conditional Access policies will be created in report-only mode by default. This means you can monitor the impact of your policies from the moment they’re created. And for those of you who use the MS Graph APIs, you can [manage report-only policies programmatically](/graph/api/resources/conditionalaccesspolicy?view=graph-rest-beta) as well. 

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
* [Oracle Cloud Infrastructure Console](../saas-apps/oracle-cloud-infratstructure-console-provisioning-tutorial.md)

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

[Report-only mode for Azure AD Conditional Access](../conditional-access/concept-conditional-access-report-only.md) lets you evaluate the result of a policy without enforcing access controls. You can test report-only policies across your organization and understand their impact before enabling them, making deployment safer and easier. Over the past few months, we’ve seen strong adoption of report-only mode, with over 26M users already in scope of a report-only policy. With this announcement, new Azure AD Conditional Access policies will be created in report-only mode by default. This means you can monitor the impact of your policies from the moment they’re created. And for those of you who use the MS Graph APIs, you can also [manage report-only policies programmatically](/graph/api/resources/conditionalaccesspolicy?view=graph-rest-beta). 

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

[SincroPool Apps](https://www.sincropool.com/), [SmartDB](https://hibiki.dreamarts.co.jp/smartdb/trial/), [Float](../saas-apps/float-tutorial.md), [LMS365](https://lms.365.systems/), [IWT Procurement Suite](../saas-apps/iwt-procurement-suite-tutorial.md), [Lunni](https://lunni.fi/), [EasySSO for Jira](../saas-apps/easysso-for-jira-tutorial.md), [Virtual Training Academy](https://vta.c3p.ca/app/en/openid?authenticate_with=microsoft), [Meraki Dashboard](../saas-apps/meraki-dashboard-tutorial.md), [Microsoft 365 Mover](https://app.mover.io/login), [Speaker Engage](https://speakerengage.com/login.php), [Honestly](../saas-apps/honestly-tutorial.md), [Ally](../saas-apps/ally-tutorial.md), [DutyFlow](https://app.dutyflow.nl/), [AlertMedia](../saas-apps/alertmedia-tutorial.md), [gr8 People](../saas-apps/gr8-people-tutorial.md), [Pendo](../saas-apps/pendo-tutorial.md), [HighGround](../saas-apps/highground-tutorial.md), [Harmony](../saas-apps/harmony-tutorial.md), [Timetabling Solutions](../saas-apps/timetabling-solutions-tutorial.md), [SynchroNet CLICK](../saas-apps/synchronet-click-tutorial.md), [empower](https://www.made-in-office.com/en/), [Fortes Change Cloud](../saas-apps/fortes-change-cloud-tutorial.md), [Litmus](../saas-apps/litmus-tutorial.md), [GroupTalk](https://recorder.grouptalk.com/), [Frontify](../saas-apps/frontify-tutorial.md), [MongoDB Cloud](../saas-apps/mongodb-cloud-tutorial.md), [TickitLMS Learn](../saas-apps/tickitlms-learn-tutorial.md), [COCO](https://hexaware.com/partnerships-and-alliances/digital-transformation-using-microsoft-azure/), [Nitro Productivity Suite](../saas-apps/nitro-productivity-suite-tutorial.md) , [Trend Micro Web Security(TMWS)](https://review.docs.microsoft.com/azure/active-directory/saas-apps/trend-micro-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](../saas-apps/tutorial-list.md). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](../azuread-dev/howto-app-gallery-listing.md).

---

### Microsoft Graph delta query support for oAuth2PermissionGrant available for Public Preview

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience

Delta query for oAuth2PermissionGrant is available for public preview! You can now track changes without having to continuously poll Microsoft Graph. [Learn more.](/graph/api/oAuth2PermissionGrant-delta?tabs=http&view=graph-rest-beta)

---

### Microsoft Graph delta query support for organizational contact generally available

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience

Delta query for organizational contacts is generally available! You can now track changes in production apps without having to continuously poll Microsoft Graph. Replace any existing code that continuously polls orgContact data by delta query to significantly improve performance. [Learn more.](/graph/api/orgcontact-delta?tabs=http&view=graph-rest-1.0)

---

### Microsoft Graph delta query support for application generally available

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience

Delta query for applications is generally available! You can now track changes in production apps without having to continuously poll Microsoft Graph. Replace any existing code that continuously polls application data by delta query to significantly improve performance. [Learn more.](/graph/api/application-delta?view=graph-rest-1.0)

---

### Microsoft Graph delta query support for administrative units available for Public Preview

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience
Delta query for administrative units is available for public preview! You can now track changes without having to continuously poll Microsoft Graph. [Learn more.](/graph/api/administrativeunit-delta?tabs=http&view=graph-rest-beta)

---

### Manage authentication phone numbers and more in new Microsoft Graph beta APIs

**Type:** New feature

**Service category:** MS Graph

**Product capability:** Developer Experience

These APIs are a key tool for managing your users’ authentication methods. Now you can programmatically pre-register and manage the authenticators used for MFA and self-service password reset (SSPR). This has been one of the most-requested features in the Azure MFA, SSPR, and Microsoft Graph spaces. The new APIs we’ve released in this wave give you the ability to:

- Read, add, update, and remove a user’s authentication phones
- Reset a user’s password
- Turn on and off SMS-sign-in

For more information, see [Azure AD authentication methods API overview](/graph/api/resources/authenticationmethods-overview?view=graph-rest-beta).

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

For more information, see [Administrative units management in Azure Active Directory (preview)](../users-groups-roles/directory-administrative-units.md).

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

My Staff enables Firstline Managers, such as a store manager, to ensure that their staff members are able to access their Azure AD accounts. Instead of relying on a central helpdesk, organizations can delegate common tasks, such as resetting passwords or changing phone numbers, to a Firstline Manager. With My Staff, a user who can’t access their account can re-gain access in just a couple of clicks, with no helpdesk or IT staff required. For more information, see the [Manage your users with My Staff (preview)](../users-groups-roles/my-staff-configure.md) and [Delegate user management with My Staff (preview)](../user-help/my-staff-team-manager.md).

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

These new improvement actions require registering your users or admins for multi-factor authentication (MFA) across your directory and establishing the right set of policies that fit your organizational needs. The main goal is to have flexibility while ensuring all your users and admins can authenticate with multiple factors or risk-based identity verification prompts. That can take the form of having multiple policies that apply scoped decisions, or setting security defaults (as of March 16th) that let Microsoft decide when to challenge users for MFA. [Read more about what's new in Microsoft Secure Score](/microsoft-365/security/mtp/microsoft-secure-score?view=o365-worldwide#whats-new).

---
