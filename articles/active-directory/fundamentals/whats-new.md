---
title: What's new? Release notes - Azure Active Directory | Microsoft Docs
description: Learn what is new with Azure Active Directory, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: active-directory
author: eross-msft
manager: daveba
featureFlags:
 - clicktale
 
ms.assetid: 06a149f7-4aa1-4fb9-a8ec-ac2633b031fb
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 07/31/2019
ms.author: lizross
ms.reviewer: dhanyahk
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# What's new in Azure Active Directory?

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22release+notes+for+azure+AD%22&locale=en-us` into your ![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png) feed reader.

Azure AD receives improvements on an ongoing basis. To stay up-to-date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

This page is updated monthly, so revisit it regularly. If you're looking for items that are older than six months, you can find them in the [Archive for What's new in Azure Active Directory](whats-new-archive.md).

---

## August 2019

### Plan for change: Deprecation of the Power BI content packs

**Type:** Plan for change  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting

Starting on October 1, 2019, Power BI will begin to deprecate all content packs, including the Azure AD Power BI content pack. As an alternative to this content pack, you can use Azure AD Workbooks to gain insights into your Azure AD-related services. Additional workbooks are coming, including workbooks about Conditional Access policies in report-only mode, app consent-based insights, and more.

For more information about the workbooks, see [How to use Azure Monitor workbooks for Azure Active Directory reports](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-use-azure-monitor-workbooks). For more information about the deprecation of the content packs, see the [Announcing Power BI template apps general availability](https://powerbi.microsoft.com/blog/announcing-power-bi-template-apps-general-availability/) blog post.

---

### Improved search, filtering, and sorting for groups is available in the Azure AD portal (Public Preview)

**Type:** New feature  
**Service category:** Group Management  
**Product capability:** Collaboration

We're pleased to announce public preview availability of the enhanced groups-related experiences in the Azure AD portal. These enhancements help you better manage groups and member lists, by providing:

- Advanced search capabilities, such as substring search on groups lists.
- Advanced filtering and sorting options on member and owner lists.
- New search capabilities for member and owner lists.
- More accurate group counts for large groups.

For more information, see [Manage groups in the Azure portal (Preview)](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-members-owners-search).

---

### New custom roles are available for app registration management (Public Preview)

**Type:** New feature  
**Service category:** RBAC  
**Product capability:** Access Control

Custom roles (available with an Azure AD P1 or P2 subscription) can now help provide you with fine-grained access, by letting you create role definitions with specific permissions and then to assign those roles to specific resources. Currently, you create custom roles by using permissions for managing app registrations and then assigning the role to a specific app. For more information about custom roles, see [Custom administrator roles in Azure Active Directory (preview)](https://docs.microsoft.com/azure/active-directory/users-groups-roles/roles-custom-overview).

If you need additional permissions or resources supported, which you don’t currently see, you can send feedback to our [Azure feedback site](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032) and we’ll add your request to our update road map.

---

### New provisioning logs can help you monitor and troubleshoot your app provisioning deployment (Public Preview)

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management

New provisioning logs are available to help you monitor and troubleshoot the user and group provisioning deployment. These new log files include information about:

- What groups were successfully created in [ServiceNow](https://docs.microsoft.com/azure/active-directory/saas-apps/servicenow-provisioning-tutorial)
- What roles were imported from [Amazon Web Services (AWS)](https://docs.microsoft.com/azure/active-directory/saas-apps/amazon-web-service-tutorial#configure-and-test-azure-ad-single-sign-on)
- What employees weren't imported from [Workday](https://docs.microsoft.com/azure/active-directory/saas-apps/workday-inbound-tutorial)

For more information, see [Provisioning reports in the Azure Active Directory portal (preview)](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs).

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

For more information, see [Risky users](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-investigate-risk#risky-users-report), [Risky sign-ins](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-investigate-risk#risky-sign-ins-report), and [Risk detections](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-investigate-risk#risk-detections-report).

---

### User-assigned managed identity is available for Virtual Machines and Virtual Machine Scale Sets (General Availability)

**Type:** New feature  
**Service category:** Managed identities for Azure resources  
**Product capability:** Developer Experience

User-assigned managed identities are now generally available for Virtual Machines and Virtual Machine Scale Sets. As part of this, Azure can create an identity in the Azure AD tenant that's trusted by the subscription in use, and can be assigned to one or more Azure service instances. For more information about user-assigned managed identities, see [What is managed identities for Azure resources?](https://aka.ms/azuremanagedidentity).

---

### Users can reset their passwords using a mobile app or hardware token (General Availability)

**Type:** Changed feature  
**Service category:** Self Service Password Reset  
**Product capability:** User Authentication

Users who have registered a mobile app with your organization can now reset their own password by approving a notification from the Microsoft Authenticator app or by entering a code from their mobile app or hardware token.

For more information, see [How it works: Azure AD self-service password reset](https://aka.ms/authappsspr). For more information about the user experience, see [Reset your own work or school password overview](https://docs.microsoft.com/azure/active-directory/user-help/user-help-password-reset-overview).

---

### ADAL.NET ignores the MSAL.NET shared cache for on-behalf-of scenarios

**Type:** Fixed  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication

Starting with Azure AD authentication library (ADAL.NET) version 5.0.0-preview, app developers must [serialize one cache per account for web apps and web APIs](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Token-cache-serialization#custom-token-cache-serialization-in-web-applications--web-api). Otherwise, some scenarios using the [on-behalf-of flow](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-api-call-api-app-configuration#on-behalf-of-flow), along with some specific use cases of `UserAssertion`, may result in an elevation of privilege. To avoid this vulnerability, ADAL.NET now ignores the Microsoft authentication library for dotnet (MSAL.NET) shared cache for on-behalf-of scenarios.

For more information about this issue, see [Azure Active Directory Authentication Library Elevation of Privilege Vulnerability](https://portal.msrc.microsoft.com/security-guidance/advisory/CVE-2019-1258).

---

### New Federated Apps available in Azure AD App gallery - August 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In August 2019, we've added these 26 new apps with Federation support to the app gallery:

[Civic Platform](https://docs.microsoft.com/azure/active-directory/saas-apps/civic-platform-tutorial), [Amazon Business](https://docs.microsoft.com/azure/active-directory/saas-apps/amazon-business-tutorial), [ProNovos Ops Manager](https://docs.microsoft.com/azure/active-directory/saas-apps/pronovos-ops-manager-tutorial), [Cognidox](https://docs.microsoft.com/azure/active-directory/saas-apps/cognidox-tutorial), [Viareport's Inativ Portal (Europe)](https://docs.microsoft.com/azure/active-directory/saas-apps/viareports-inativ-portal-europe-tutorial), [Azure Databricks](https://azure.microsoft.com/services/databricks), [Robin](https://docs.microsoft.com/azure/active-directory/saas-apps/robin-tutorial), [Academy Attendance](https://docs.microsoft.com/azure/active-directory/saas-apps/academy-attendance-tutorial), [Priority Matrix](https://sync.appfluence.com/pmwebng/), [Cousto MySpace](https://cousto.platformers.be/account/login), [Uploadcare](https://uploadcare.com/accounts/signup/), [Carbonite Endpoint Backup](https://docs.microsoft.com/azure/active-directory/saas-apps/carbonite-endpoint-backup-tutorial), [CPQSync by Cincom](https://docs.microsoft.com/azure/active-directory/saas-apps/cpqsync-by-cincom-tutorial), [Chargebee](https://docs.microsoft.com/azure/active-directory/saas-apps/chargebee-tutorial), [deliver.media™ Portal](https://portal.deliver.media), [Frontline Education](https://docs.microsoft.com/azure/active-directory/saas-apps/frontline-education-tutorial), [F5](https://www.f5.com/products/security/access-policy-manager), [stashcat AD connect](https://www.stashcat.com), [Blink](https://docs.microsoft.com/azure/active-directory/saas-apps/blink-tutorial), [Vocoli](https://docs.microsoft.com/azure/active-directory/saas-apps/vocoli-tutorial), [ProNovos Analytics](https://docs.microsoft.com/azure/active-directory/saas-apps/pronovos-analytics-tutorial), [Sigstr](https://docs.microsoft.com/azure/active-directory/saas-apps/sigstr-tutorial), [Darwinbox](https://docs.microsoft.com/azure/active-directory/saas-apps/darwinbox-tutorial), [Watch by Colors](https://docs.microsoft.com/azure/active-directory/saas-apps/watch-by-colors-tutorial), [Harness](https://docs.microsoft.com/azure/active-directory/saas-apps/harness-tutorial), [EAB Navigate Strategic Care](https://docs.microsoft.com/azure/active-directory/saas-apps/eab-navigate-strategic-care-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

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

For more information, see [Manage dynamic membership rules](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-update-rule).

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

We're excited to announce that Azure AD activity logs are now available for government cloud instances in Azure Monitor. You can now send Azure AD logs to your storage account or to an event hub to integrate with your SIEM tools, like [Sumologic](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-sumologic), [Splunk](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-splunk), and [ArcSight](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-arcsight). 

For more information about setting up Azure Monitor, see [Azure AD activity logs in Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-activity-logs-azure-monitor#cost-considerations).

---

### Update your users to the new, enhanced security info experience

**Type:** Changed feature  
**Service category:**  Authentications (Logins)   
**Product capability:** User Authentication

On September 25, 2019, we'll be turning off the old, non-enhanced security info experience for registering and managing user security info and only turning on the new, [enhanced version](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Cool-enhancements-to-the-Azure-AD-combined-MFA-and-password/ba-p/354271). This means that your users will no longer be able to use the old experience.

For more information about the enhanced security info experience, see our [admin documentation](https://aka.ms/securityinfodocs) and our [user documentation](https://aka.ms/securityinfoguide).

#### To turn on this new experience, you must:

1. Sign in to the Azure portal as a Global Administrator or User Administrator.

2. Go to **Azure Active Directory > User settings > Manage settings for access panel preview features**.

3. In the **Users can use preview features for registering and managing security info - enhanced** area, select **Selected**, and then either choose a group of users or choose **All** to turn this feature on for all users in the tenant.

4. In the **Users can use preview features for registering and managing security **info**** area, select **None**.

5. Save your settings.

    After you save your settings you'll no longer have access to the old security info experience.

>[!Important]
>If you don't complete these steps before September 25, 2019, your Azure Active Directory tenant will be automatically enabled for the enhanced experience. If you have questions, please contact us at registrationpreview@microsoft.com.

---

### Authentication requests using POST logins will be more strictly validated

**Type:** Changed feature  
**Service category:** Authentications (Logins)  
**Product capability:** Standards

Starting on September 2, 2019, authentication requests using the POST method will be more strictly validated against the HTTP standards. Specifically, spaces and double-quotes (") will no longer be removed from request form values. These changes aren't expected to break any existing clients, and will help to make sure that requests sent to Azure AD are reliably handled every time.

For more information, see the [Azure AD breaking changes notices](https://docs.microsoft.com/azure/active-directory/develop/reference-breaking-changes#post-form-semantics-will-be-enforced-more-strictly---spaces-and-quotes-will-be-ignored).

---

## July 2019

### Plan for change: Application Proxy service update to support only TLS 1.2

**Type:** Plan for change  
**Service category:** App Proxy  
**Product capability:** Access Control

To help provide you with our strongest encryption, we're going to begin limiting Application Proxy service access to only TLS 1.2 protocols. This limitation will initially be rolled out to customers who are already using TLS 1.2 protocols, so you won't see the impact. Complete deprecation of the TLS 1.0 and TLS 1.1 protocols will be complete on August 31, 2019. Customers still using TLS 1.0 and TLS 1.1 will receive advanced notice to prepare for this change.

To maintain the connection to the Application Proxy service throughout this change, we recommend that you make sure your client-server and browser-server combinations are updated to use TLS 1.2. We also recommend that you make sure to include any client systems used by your employees to access apps published through the Application Proxy service.

For more information, see [Add an on-premises application for remote access through Application Proxy in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application).

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

We're removing the MFA server IP address from the [Office 365 IP Address and URL Web service](https://docs.microsoft.com/office365/enterprise/office-365-ip-web-service). If you currently rely on these pages to update your firewall settings, you must make sure you're also including the list of IP addresses documented in the **Azure Multi-Factor Authentication Server firewall requirements** section of the [Getting started with the Azure Multi-Factor Authentication Server](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfaserver-deploy#azure-multi-factor-authentication-server-firewall-requirements) article.

---

### App-only tokens now require the client app to exist in the resource tenant

**Type:** Fixed  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication

On July 26, 2019, we changed how we provide app-only tokens through the [client credentials grant](https://docs.microsoft.com/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow). Previously, apps could get tokens to call other apps, regardless of whether the client app was in the tenant. We've updated this behavior so single-tenant resources, sometimes called Web APIs, can only be called by client apps that exist in the resource tenant.

If your app isn't located in the resource tenant, you'll get an error message that says, `The service principal named <app_name> was not found in the tenant named <tenant_name>. This can happen if the application has not been installed by the administrator of the tenant.` To fix this problem, you must create the client app service principal in the tenant, using either the [admin consent endpoint](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#using-the-admin-consent-endpoint) or [through PowerShell](https://docs.microsoft.com/azure/active-directory/develop/howto-authenticate-service-principal-powershell), which ensures your tenant has given the app permission to operate within the tenant.

For more information, see [What's new for authentication?](https://docs.microsoft.com/azure/active-directory/develop/reference-breaking-changes#app-only-tokens-for-single-tenant-applications-are-only-issued-if-the-client-app-exists-in-the-resource-tenant).

> [!NOTE]
> Existing consent between the client and the API continues to not be required. Apps should still be doing their own authorization checks.

---

### New passwordless sign-in to Azure AD using FIDO2 security keys

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication

Azure AD customers can now set policies to manage FIDO2 security keys for their organization's users and groups. End-users can also self-register their security keys, use the keys to sign in to their Microsoft accounts on web sites while on FIDO-capable devices, as well as sign in to their Azure AD-joined Windows 10 devices.

For more information, see [Enable passwordless sign in for Azure AD (preview)](/azure/active-directory/authentication/concept-authentication-passwordless) for administrator-related information, and [Set up security info to use a security key (Preview)](https://docs.microsoft.com/azure/active-directory/user-help/security-info-setup-security-key) for end-user-related information.

---

### New Federated Apps available in Azure AD App gallery - July 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In July 2019, we've added these 18 new apps with Federation support to the app gallery:

[Ungerboeck Software](https://docs.microsoft.com/azure/active-directory/saas-apps/ungerboeck-software-tutorial), [Bright Pattern Omnichannel Contact Center](https://docs.microsoft.com/azure/active-directory/saas-apps/bright-pattern-omnichannel-contact-center-tutorial), [Clever Nelly](https://docs.microsoft.com/azure/active-directory/saas-apps/clever-nelly-tutorial), [AcquireIO](https://docs.microsoft.com/azure/active-directory/saas-apps/acquireio-tutorial), [Looop](https://www.looop.co/schedule-a-demo/), [productboard](https://docs.microsoft.com/azure/active-directory/saas-apps/productboard-tutorial), [MS Azure SSO Access for Ethidex Compliance Office™](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on#password-based-sso), [Hype](https://docs.microsoft.com/azure/active-directory/saas-apps/hype-tutorial), [Abstract](https://docs.microsoft.com/azure/active-directory/saas-apps/abstract-tutorial), [Ascentis](https://docs.microsoft.com/azure/active-directory/saas-apps/ascentis-tutorial), [Flipsnack](https://www.flipsnack.com/accounts/sign-in-sso.html), [Wandera](https://docs.microsoft.com/azure/active-directory/saas-apps/wandera-tutorial), [TwineSocial](https://twinesocial.com/), [Kallidus](https://docs.microsoft.com/azure/active-directory/saas-apps/kallidus-tutorial), [HyperAnna](https://docs.microsoft.com/azure/active-directory/saas-apps/hyperanna-tutorial), [PharmID WasteWitness](https://www.pharmid.com/), [i2B Connect](https://www.i2b-online.com/sign-up-to-use-i2b-connect-here-sso-access/), [JFrog Artifactory](https://docs.microsoft.com/azure/active-directory/saas-apps/jfrog-artifactory-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---

### Automate user account provisioning for these newly supported SaaS apps

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Monitoring & Reporting

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Dialpad](https://docs.microsoft.com/azure/active-directory/saas-apps/dialpad-provisioning-tutorial)

- [Federated Directory](https://docs.microsoft.com/azure/active-directory/saas-apps/federated-directory-provisioning-tutorial)

- [Figma](https://docs.microsoft.com/azure/active-directory/saas-apps/figma-provisioning-tutorial)

- [Leapsome](https://docs.microsoft.com/azure/active-directory/saas-apps/leapsome-provisioning-tutorial)

- [Peakon](https://docs.microsoft.com/azure/active-directory/saas-apps/peakon-provisioning-tutorial)

- [Smartsheet](https://docs.microsoft.com/azure/active-directory/saas-apps/smartsheet-provisioning-tutorial)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning)

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

For more information, see [Enable Security Audits for Azure AD Domain Services (Preview)](https://docs.microsoft.com/azure/active-directory-domain-services/security-audit-events).

---

### New Authentication methods usage & insights (Public Preview)

**Type:** New feature  
**Service category:** Self Service Password Reset  
**Product capability:** Monitoring & Reporting

The new Authentication methods usage & insights reports can help you to understand how features like Azure Multi-Factor Authentication and self-service password reset are being registered and used in your organization, including the number of registered users for each feature, how often self-service password reset is used to reset passwords, and by which method the reset happens.

For more information, see [Authentication methods usage & insights (preview)](https://docs.microsoft.com/azure/active-directory/authentication/howto-authentication-methods-usage-insights).

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

For more information, see [Risky users report](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-investigate-risk#risky-users-report) and [Risky sign-ins report](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-investigate-risk#risky-sign-ins-report).

---

### New Security Audits for Azure AD Domain Services (Public Preview)

**Type:** New feature  
**Service category:** Azure AD Domain Services  
**Product capability:** Azure AD Domain Services

We're pleased to announce the release of Azure AD Domain Service Security Auditing to public preview. Security auditing helps provide you with critical insight into your authentication services by streaming security audit events to targeted resources, including Azure Storage, Azure Log Analytics workspaces, and Azure Event Hub, using the Azure AD Domain Service portal.

For more information, see [Enable Security Audits for Azure AD Domain Services (Preview)](https://docs.microsoft.com/azure/active-directory-domain-services/security-audit-events).

---

### New B2B direct federation using SAML/WS-Fed (Public Preview)

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C

Direct federation helps to make it easier for you to work with partners whose IT-managed identity solution is not Azure AD, by working with identity systems that support the SAML or WS-Fed standards. After you set up a direct federation relationship with a partner, any new guest user you invite from that domain can collaborate with you using their existing organizational account, making the user experience for your guests more seamless.

For more information, see [Direct federation with AD FS and third-party providers for guest users (preview)](https://docs.microsoft.com/azure/active-directory/b2b/direct-federation).

---

### Automate user account provisioning for these newly supported SaaS apps

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Monitoring & Reporting

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Dialpad](https://docs.microsoft.com/azure/active-directory/saas-apps/dialpad-provisioning-tutorial)

- [Federated Directory](https://docs.microsoft.com/azure/active-directory/saas-apps/federated-directory-provisioning-tutorial)

- [Figma](https://docs.microsoft.com/azure/active-directory/saas-apps/figma-provisioning-tutorial)

- [Leapsome](https://docs.microsoft.com/azure/active-directory/saas-apps/leapsome-provisioning-tutorial)

- [Peakon](https://docs.microsoft.com/azure/active-directory/saas-apps/peakon-provisioning-tutorial)

- [Smartsheet](https://docs.microsoft.com/azure/active-directory/saas-apps/smartsheet-provisioning-tutorial)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).

---

### New check for duplicate group names in the Azure AD portal

**Type:** New feature  
**Service category:** Group Management  
**Product capability:** Collaboration

Now, when you create or update a group name from the Azure AD portal, we'll perform a check to see if you are duplicating an existing group name in your resource. If we determine that the name is already in use by another group, you'll be asked to modify your name.

For more information, see [Manage groups in the Azure AD portal](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal?context=azure/active-directory/users-groups-roles/context/ugr-context).

---

### Azure AD now supports static query parameters in reply (redirect) URIs

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication

Azure AD apps can now register and use reply (redirect) URIs with static query parameters (for example, `https://contoso.com/oauth2?idp=microsoft`) for OAuth 2.0 requests. The static query parameter is subject to string matching for reply URIs, just like any other part of the reply URI. If there's no registered string that matches the URL-decoded redirect-uri, the request is rejected. If the reply URI is found, the entire string is used to redirect the user, including the static query parameter.

Dynamic reply URIs are still forbidden because they represent a security risk and can't be used to retain state information across an authentication request. For this purpose, use the `state` parameter.

Currently, the app registration screens of the Azure portal still block query parameters. However, you can manually edit the app manifest to add and test query parameters in your app. For more information, see [What's new for authentication?](https://docs.microsoft.com/azure/active-directory/develop/reference-breaking-changes#redirect-uris-can-now-contain-query-string-parameters).

---

### Activity logs (MS Graph APIs) for Azure AD are now available through PowerShell Cmdlets

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting

We're excited to announce that Azure AD activity logs (Audit and Sign-ins reports) are now available through the Azure AD PowerShell module. Previously, you could create your own scripts using MS Graph API endpoints, and now we've extended that capability to PowerShell cmdlets.

For more information about how to use these cmdlets, see [Azure AD PowerShell cmdlets for reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/reference-powershell-reporting).

---

### Updated filter controls for Audit and Sign-in logs in Azure AD

**Type:** Changed feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting

We've updated the Audit and Sign-in log reports so you can now apply various filters without having to add them as columns on the report screens. Additionally, you can now decide how many filters you want to show on the screen. These updates all work together to make your reports easier to read and more scoped to your needs.

For more information about these updates, see [Filter audit logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-audit-logs#filtering-audit-logs) and [Filter sign-in activities](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-sign-ins#filter-sign-in-activities).

---

## June 2019

### New riskDetections API for Microsoft Graph (Public preview)

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection

We're pleased to announce the new riskDetections API for Microsoft Graph is now in public preview. You can use this new API to view a list of your organization's Identity Protection-related user and sign-in risk detections. You can also use this API to more efficiently query your risk detections, including details about the detection type, status, level, and more.

For more information, see the [Risk detection API reference documentation](https://docs.microsoft.com/graph/api/resources/riskdetection?view=graph-rest-beta).

---

### New Federated Apps available in Azure AD app gallery - June 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In June 2019, we've added these 22 new apps with Federation support to the app gallery:

[Azure AD SAML Toolkit](https://docs.microsoft.com/azure/active-directory/saas-apps/saml-toolkit-tutorial), [Otsuka Shokai (大塚商会)](https://docs.microsoft.com/azure/active-directory/saas-apps/otsuka-shokai-tutorial), [ANAQUA](https://docs.microsoft.com/azure/active-directory/saas-apps/anaqua-tutorial), [Azure VPN Client](https://portal.azure.com/), [ExpenseIn](https://docs.microsoft.com/azure/active-directory/saas-apps/expensein-tutorial), [Helper Helper](https://docs.microsoft.com/azure/active-directory/saas-apps/helper-helper-tutorial), [Costpoint](https://docs.microsoft.com/azure/active-directory/saas-apps/costpoint-tutorial), [GlobalOne](https://docs.microsoft.com/azure/active-directory/saas-apps/globalone-tutorial), [Mercedes-Benz In-Car Office](https://me.secure.mercedes-benz.com/), [Skore](https://app.justskore.it/), [Oracle Cloud Infrastructure Console](https://docs.microsoft.com/azure/active-directory/saas-apps/oracle-cloud-tutorial), [CyberArk SAML Authentication](https://docs.microsoft.com/azure/active-directory/saas-apps/cyberark-saml-authentication-tutorial), [Scrible Edu](https://www.scrible.com/sign-in/#/create-account), [PandaDoc](https://docs.microsoft.com/azure/active-directory/saas-apps/pandadoc-tutorial), [Perceptyx](https://apexdata.azurewebsites.net/docs.microsoft.com/azure/active-directory/saas-apps/perceptyx-tutorial), [Proptimise OS](https://proptimise.co.uk/software/), [Vtiger CRM (SAML)](https://docs.microsoft.com/azure/active-directory/saas-apps/vtiger-crm-saml-tutorial), Oracle Access Manager for Oracle Retail Merchandising, Oracle Access Manager for Oracle E-Business Suite, Oracle IDCS for E-Business Suite, Oracle IDCS for PeopleSoft, Oracle IDCS for JD Edwards

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---

### Automate user account provisioning for these newly supported SaaS apps

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Monitoring & Reporting

You can now automate creating, updating, and deleting user accounts for these newly integrated apps:

- [Zoom](https://docs.microsoft.com/azure/active-directory/saas-apps/zoom-provisioning-tutorial)

- [Envoy](https://docs.microsoft.com/azure/active-directory/saas-apps/envoy-provisioning-tutorial)

- [Proxyclick](https://docs.microsoft.com/azure/active-directory/saas-apps/proxyclick-provisioning-tutorial)

- [4me](https://docs.microsoft.com/azure/active-directory/saas-apps/4me-provisioning-tutorial)

For more information about how to better secure your organization by using automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning)

---

### View the real-time progress of the Azure AD provisioning service

**Type:** Changed feature  
**Service category:** App Provisioning  
**Product capability:** Identity Lifecycle Management

We've updated the Azure AD provisioning experience to include a new progress bar that shows you how far you are in the user provisioning process. This updated experience also provides information about the number of users provisioned during the current cycle, as well as how many users have been provisioned to date.

For more information, see [Check the status of user provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-when-will-provisioning-finish-specific-user).

---

### Company branding now appears on sign out and error screens

**Type:** Changed feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication

We've updated Azure AD so that your company branding now appears on the sign out and error screens, as well as the sign-in page. You don't have to do anything to turn on this feature, Azure AD simply uses the assets you've already set up in the **Company branding** area of the Azure portal.

For more information about setting up your company branding, see [Add branding to your organization's Azure Active Directory pages](https://docs.microsoft.com/azure/active-directory/fundamentals/customize-branding).

---

### Azure Multi-Factor Authentication (MFA) Server is no longer available for new deployments

**Type:** Deprecated  
**Service category:** MFA  
**Product capability:** Identity Security & Protection

As of July 1, 2019, Microsoft will no longer offer MFA Server for new deployments. New customers who want to require multi-factor authentication in their organization must now use cloud-based Azure Multi-Factor Authentication. Customers who activated MFA Server prior to July 1 won't see a change. You'll still be able to download the latest version, get future updates, and generate activation credentials.

For more information, see [Getting started with the Azure Multi-Factor Authentication Server](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfaserver-deploy). For more information about cloud-based Azure Multi-Factor Authentication, see [Planning a cloud-based Azure Multi-Factor Authentication deployment](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted).

---

## May 2019

### Service change: Future support for only TLS 1.2 protocols on the Application Proxy service

**Type:** Plan for change  
**Service category:** App Proxy  
**Product capability:** Access Control

To help provide best-in-class encryption for our customers, we're limiting access to only TLS 1.2 protocols on the Application Proxy service. This change is gradually being rolled out to customers who are already only using TLS 1.2 protocols, so you shouldn't see any changes.

Deprecation of TLS 1.0 and TLS 1.1 happens on August 31, 2019, but we'll provide additional advanced notice, so you'll have time to prepare for this change. To prepare for this change make sure your client-server and browser-server combinations, including any clients your users use to access apps published through Application Proxy, are updated to use the TLS 1.2 protocol to maintain the connection to the Application Proxy service. For more information, see [Add an on-premises application for remote access through Application Proxy in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-add-on-premises-application#before-you-begin).

---

### Use the usage and insights report to view your app-related sign-in data

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Monitoring & Reporting

You can now use the usage and insights report, located in the **Enterprise applications** area of the Azure portal, to get an application-centric view of your sign-in data, including info about:

- Top used apps for your organization

- Apps with the most failed sign-ins

- Top sign-in errors for each app

For more information about this feature, see [Usage and insights report in the Azure Active Directory portal](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-usage-insights-report)

---

### Automate your user provisioning to cloud apps using Azure AD

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Monitoring & Reporting

Follow these new tutorials to use the Azure AD Provisioning Service to automate the creation, deletion, and updating of user accounts for the following cloud-based apps:

- [Comeet](https://docs.microsoft.com/azure/active-directory/saas-apps/comeet-recruiting-software-provisioning-tutorial)

- [DynamicSignal](https://docs.microsoft.com/azure/active-directory/saas-apps/dynamic-signal-provisioning-tutorial)

- [KeeperSecurity](https://docs.microsoft.com/azure/active-directory/saas-apps/keeper-password-manager-digitalvault-provisioning-tutorial)

You can also follow this new [Dropbox tutorial](https://docs.microsoft.com/azure/active-directory/saas-apps/dropboxforbusiness-provisioning-tutorial), which provides info about how to provision group objects.

For more information about how to better secure your organization through automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).

---

### Identity secure score is now available in Azure AD (General availability)

**Type:** New feature  
**Service category:** N/A  
**Product capability:** Identity Security & Protection

You can now monitor and improve your identity security posture by using the identity secure score feature in Azure AD. The identity secure score feature uses a single dashboard to help you:

- Objectively measure your identity security posture, based on a score between 1 and 223.

- Plan for your identity security improvements

- Review the success of your security improvements

For more information about the identity security score feature, see [What is the identity secure score in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/fundamentals/identity-secure-score).

---

### New App registrations experience is now available (General availability)

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** Developer Experience

The new [App registrations](https://aka.ms/appregistrations) experience is now in general availability. This new experience includes all the key features you’re familiar with from the Azure portal and the Application Registration portal and improves upon them through:

- **Better app management.** Instead of seeing your apps across different portals, you can now see all your apps in one location.

- **Simplified app registration.** From the improved navigation experience to the revamped permission selection experience, it’s now easier to register and manage your apps.

- **More detailed information.** You can find more details about your app, including quickstart guides and more.

For more information, see [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/) and the [App registrations experience is now generally available!](https://developer.microsoft.com/identity/blogs/new-app-registrations-experience-is-now-generally-available/) blog announcement.

---

### New capabilities available in the Risky Users API for Identity Protection

**Type:** New feature  
**Service category:** Identity Protection  
**Product capability:** Identity Security & Protection

We're pleased to announce that you can now use the Risky Users API to retrieve users' risk history, dismiss risky users, and to confirm users as compromised. This change helps you to more efficiently update the risk status of your users and understand their risk history.

For more information, see the [Risky Users API reference documentation](https://docs.microsoft.com/graph/api/resources/riskyuser?view=graph-rest-beta).

---

### New Federated Apps available in Azure AD app gallery - May 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In May 2019, we've added these 21 new apps with Federation support to the app gallery:

[Freedcamp](https://docs.microsoft.com/azure/active-directory/saas-apps/freedcamp-tutorial), [Real Links](https://docs.microsoft.com/azure/active-directory/saas-apps/real-links-tutorial), [Kianda](https://app.kianda.com/sso/OpenID/AzureAD/), [Simple Sign](https://docs.microsoft.com/azure/active-directory/saas-apps/simple-sign-tutorial), [Braze](https://docs.microsoft.com/azure/active-directory/saas-apps/braze-tutorial), [Displayr](https://docs.microsoft.com/azure/active-directory/saas-apps/displayr-tutorial), [Templafy](https://docs.microsoft.com/azure/active-directory/saas-apps/templafy-tutorial), [Marketo Sales Engage](https://toutapp.com/login), [ACLP](https://docs.microsoft.com/azure/active-directory/saas-apps/aclp-tutorial), [OutSystems](https://docs.microsoft.com/azure/active-directory/saas-apps/outsystems-tutorial), [Meta4 Global HR](https://docs.microsoft.com/azure/active-directory/saas-apps/meta4-global-hr-tutorial), [Quantum Workplace](https://docs.microsoft.com/azure/active-directory/saas-apps/quantum-workplace-tutorial), [Cobalt](https://docs.microsoft.com/azure/active-directory/saas-apps/cobalt-tutorial), [webMethods API Cloud](https://docs.microsoft.com/azure/active-directory/saas-apps/webmethods-integration-cloud-tutorial), [RedFlag](https://pocketstop.com/redflag/), [Whatfix](https://docs.microsoft.com/azure/active-directory/saas-apps/whatfix-tutorial), [Control](https://docs.microsoft.com/azure/active-directory/saas-apps/control-tutorial), [JOBHUB](https://docs.microsoft.com/azure/active-directory/saas-apps/jobhub-tutorial), [NEOGOV](https://docs.microsoft.com/azure/active-directory/saas-apps/neogov-tutorial), [Foodee](https://docs.microsoft.com/azure/active-directory/saas-apps/foodee-tutorial), [MyVR](https://docs.microsoft.com/azure/active-directory/saas-apps/myvr-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

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

For more information, see [Create a basic group and add members using Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).

---

### Configure a naming policy for Office 365 groups in Azure AD portal (General availability)

**Type:** Changed feature  
**Service category:** Group Management  
**Product capability:** Collaboration

Administrators can now configure a naming policy for Office 365 groups, using the Azure AD portal. This change helps to enforce consistent naming conventions for Office 365 groups created or edited by users in your organization.

You can configure naming policy for Office 365 groups in two different ways:

- Define prefixes or suffixes, which are automatically added to a group name.

- Upload a customized set of blocked words for your organization, which are not allowed in group names (for example, “CEO, Payroll, HR”).

For more information, see [Enforce a Naming Policy for Office 365 groups](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-naming-policy).

---

### Microsoft Graph API endpoints are now available for Azure AD activity logs (General availability)

**Type:** Changed feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting

We're happy to announce general availability of Microsoft Graph API endpoints support for Azure AD activity logs. With this release, you can now use Version 1.0 of both the Azure AD audit logs, as well as the sign-in logs APIs.

For more information, see [Azure AD audit log API overview](https://docs.microsoft.com/graph/api/resources/azure-ad-auditlog-overview?view=graph-rest-1.0).

---

### Administrators can now use Conditional Access for the combined registration process (Public preview)

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection  

Administrators can now create Conditional Access policies for use by the combined registration page. This includes applying policies to allow registration if:

- Users are on a trusted network.

- Users are a low sign-in risk.

- Users are on a managed device.

- Users agree to the organization’s terms of use (TOU).

For more information about Conditional Access and password reset, you can see the [Conditional Access for the Azure AD combined MFA and password reset registration experience blog post](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Conditional-access-for-the-Azure-AD-combined-MFA-and-password/ba-p/566348). For more information about Conditional Access policies for the combined registration process, see [Conditional Access policies for combined registration](https://docs.microsoft.com/azure/active-directory/authentication/howto-registration-mfa-sspr-combined#conditional-access-policies-for-combined-registration). For more information about the Azure AD terms of use feature, see [Azure Active Directory terms of use feature](https://docs.microsoft.com/azure/active-directory/conditional-access/terms-of-use).

---

## April 2019

### New Azure AD threat intelligence detection is now available as part of Azure AD Identity Protection

**Type:** New feature  
**Service category:** Azure AD Identity Protection  
**Product capability:** Identity Security & Protection

Azure AD threat intelligence detection is now available as part of the updated Azure AD Identity Protection feature. This new functionality helps to indicate unusual user activity for a specific user or activity that’s consistent with known attack patterns based on Microsoft’s internal and external threat intelligence sources.

For more information about the refreshed version of Azure AD Identity Protection, see the [Four major Azure AD Identity Protection enhancements are now in public preview](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Four-major-Azure-AD-Identity-Protection-enhancements-are-now-in/ba-p/326935) blog and the [What is Azure Active Directory Identity Protection (refreshed)?](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-v2) article. For more information about Azure AD threat intelligence detection, see the [Azure Active Directory Identity Protection risk detections](https://docs.microsoft.com/azure/active-directory/identity-protection/risk-events-reference#azure-ad-threat-intelligence) article.

---

### Azure AD entitlement management is now available (Public preview)

**Type:** New feature  
**Service category:** Identity Governance  
**Product capability:** Identity Governance

Azure AD entitlement management, now in public preview, helps customers to delegate management of access packages, which defines how employees and business partners can request access, who must approve, and how long they have access. Access packages can manage membership in Azure AD and Office 365 groups, role assignments in enterprise applications, and role assignments for SharePoint Online sites. Read more about entitlement management at the [overview of Azure AD entitlement management](https://docs.microsoft.com/azure/active-directory/governance/entitlement-management-overview). To learn more about the breadth of Azure AD Identity Governance features, including Privileged Identity Management, access reviews and terms of use, see [What is Azure AD Identity Governance?](../governance/identity-governance-overview.md).

---

### Configure a naming policy for Office 365 groups in Azure AD portal (Public preview)

**Type:** New feature  
**Service category:** Group Management  
**Product capability:** Collaboration

Administrators can now configure a naming policy for Office 365 groups, using the Azure AD portal. This change helps to enforce consistent naming conventions for Office 365 groups created or edited by users in your organization.

You can configure naming policy for Office 365 groups in two different ways:

- Define prefixes or suffixes, which are automatically added to a group name.

- Upload a customized set of blocked words for your organization, which are not allowed in group names (for example, “CEO, Payroll, HR”).

For more information, see [Enforce a Naming Policy for Office 365 groups](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-naming-policy).

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

For more information, see [How to use Azure Monitor workbooks for Azure Active Directory reports](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-use-azure-monitor-workbooks).

---

### New Federated Apps available in Azure AD app gallery - April 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In April 2019, we've added these 21 new apps with Federation support to the app gallery:

[SAP Fiori](https://docs.microsoft.com/azure/active-directory/saas-apps/sap-fiori-tutorial), [HRworks Single Sign-On](https://docs.microsoft.com/azure/active-directory/saas-apps/hrworks-single-sign-on-tutorial), [Percolate](https://docs.microsoft.com/azure/active-directory/saas-apps/percolate-tutorial), [MobiControl](https://docs.microsoft.com/azure/active-directory/saas-apps/mobicontrol-tutorial), [Citrix NetScaler](https://docs.microsoft.com/azure/active-directory/saas-apps/citrix-netscaler-tutorial), [Shibumi](https://docs.microsoft.com/azure/active-directory/saas-apps/shibumi-tutorial), [Benchling](https://docs.microsoft.com/azure/active-directory/saas-apps/benchling-tutorial), [MileIQ](https://mileiq.onelink.me/991934284/7e980085), [PageDNA](https://docs.microsoft.com/azure/active-directory/saas-apps/pagedna-tutorial), [EduBrite LMS](https://docs.microsoft.com/azure/active-directory/saas-apps/edubrite-lms-tutorial), [RStudio Connect](https://docs.microsoft.com/azure/active-directory/saas-apps/rstudio-connect-tutorial), [AMMS](https://docs.microsoft.com/azure/active-directory/saas-apps/amms-tutorial), [Mitel Connect](https://docs.microsoft.com/azure/active-directory/saas-apps/mitel-connect-tutorial), [Alibaba Cloud (Role-based SSO)](https://docs.microsoft.com/azure/active-directory/saas-apps/alibaba-cloud-service-role-based-sso-tutorial), [Certent Equity Management](https://docs.microsoft.com/azure/active-directory/saas-apps/certent-equity-management-tutorial), [Sectigo Certificate Manager](https://docs.microsoft.com/azure/active-directory/saas-apps/sectigo-certificate-manager-tutorial), [GreenOrbit](https://docs.microsoft.com/azure/active-directory/saas-apps/greenorbit-tutorial), [Workgrid](https://docs.microsoft.com/azure/active-directory/saas-apps/workgrid-tutorial), [monday.com](https://docs.microsoft.com/azure/active-directory/saas-apps/mondaycom-tutorial), [SurveyMonkey Enterprise](https://docs.microsoft.com/azure/active-directory/saas-apps/surveymonkey-enterprise-tutorial), [Indiggo](https://indiggolead.com/)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---

### New access reviews frequency option and multiple role selection

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Identity Governance

New updates in Azure AD access reviews allow you to:

- Change the frequency of your access reviews to **semi-annually**, in addition to the previously existing options of weekly, monthly, quarterly, and annually.

- Select multiple Azure AD and Azure resource roles when creating a single access review. In this situation, all roles are set up with the same settings and all reviewers are notified at the same time.

For more information about how to create an access review, see [Create an access review of groups or applications in Azure AD access reviews](https://docs.microsoft.com/azure/active-directory/governance/create-access-review).

---

### Azure AD Connect email alert system(s) are transitioning, sending new email sender information for some customers

**Type:** Changed feature  
**Service category:** AD Sync  
**Product capability:** Platform

Azure AD Connect is in the process of transitioning our email alert system(s), potentially showing some customers a new email sender. To address this, you must add `azure-noreply@microsoft.com` to your organization's allow list or you won't be able to continue receiving important alerts from your Office 365, Azure, or your Sync services.

---

### UPN suffix changes are now successful between Federated domains in Azure AD Connect

**Type:** Fixed  
**Service category:** AD Sync  
**Product capability:** Platform

You can now successfully change a user's UPN suffix from one Federated domain to another Federated domain in Azure AD Connect. This fix means you should no longer experience the FederatedDomainChangeError error message during the synchronization cycle or receive a notification email stating, "Unable to update this object in Azure Active Directory, because the attribute [FederatedUser.UserPrincipalName], is not valid. Update the value in your local directory services".

For more information, see [Troubleshooting Errors during synchronization](https://docs.microsoft.com/azure/active-directory/hybrid/tshoot-connect-sync-errors#federateddomainchangeerror).

---

### Increased security using the app protection-based Conditional Access policy in Azure AD (Public preview)

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection

App protection-based Conditional Access is now available by using the **Require app protection** policy. This new policy helps to increase your organization's security by helping to prevent:

- Users gaining access to apps without a Microsoft Intune license.

- Users being unable to get a Microsoft Intune app protection policy.

- Users gaining access to apps without a configured Microsoft Intune app protection policy.

For more information, see [How to Require app protection policy for cloud app access with Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/app-protection-based-conditional-access).

---

### New support for Azure AD single sign-on and Conditional Access in Microsoft Edge (Public preview)

**Type:** New feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection

We've enhanced our Azure AD support for Microsoft Edge, including providing new support for Azure AD single sign-on and Conditional Access. If you've previously used Microsoft Intune Managed Browser, you can now use Microsoft Edge instead.

For more information about setting up and managing your devices and apps using Conditional Access, see [Require managed devices for cloud app access with Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/require-managed-devices) and [Require approved client apps for cloud app access with Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-conditional-access). For more information about how to manage access using Microsoft Edge with Microsoft Intune policies, see [Manage Internet access using a Microsoft Intune policy-protected browser](https://docs.microsoft.com/intune/app-configuration-managed-browser).

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

For more information about creating custom policies, see [Developer notes for custom policies in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-developer-notes-custom) and read [Alex Simon’s blog post, including case studies](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-B2C-custom-policies-to-build-your-own-identity-journeys/ba-p/382791).

---

### New Federated Apps available in Azure AD app gallery - March 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration

In March 2019, we've added these 14 new apps with Federation support to the app gallery:

[ISEC7 Mobile Exchange Delegate](https://www.isec7.com/english/), [MediusFlow](https://office365.cloudapp.mediusflow.com/), [ePlatform](https://docs.microsoft.com/azure/active-directory/saas-apps/eplatform-tutorial), [Fulcrum](https://docs.microsoft.com/azure/active-directory/saas-apps/fulcrum-tutorial), [ExcelityGlobal](https://docs.microsoft.com/azure/active-directory/saas-apps/excelityglobal-tutorial), [Explanation-Based Auditing System](https://docs.microsoft.com/azure/active-directory/saas-apps/explanation-based-auditing-system-tutorial), [Lean](https://docs.microsoft.com/azure/active-directory/saas-apps/lean-tutorial), [Powerschool Performance Matters](https://docs.microsoft.com/azure/active-directory/saas-apps/powerschool-performance-matters-tutorial), [Cinode](https://cinode.com/), [Iris Intranet](https://docs.microsoft.com/azure/active-directory/saas-apps/iris-intranet-tutorial), [Empactis](https://docs.microsoft.com/azure/active-directory/saas-apps/empactis-tutorial), [SmartDraw](https://docs.microsoft.com/azure/active-directory/saas-apps/smartdraw-tutorial), [Confirmit Horizons](https://docs.microsoft.com/azure/active-directory/saas-apps/confirmit-horizons-tutorial), [TAS](https://docs.microsoft.com/azure/active-directory/saas-apps/tas-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---

### New Zscaler and Atlassian provisioning connectors in the Azure AD gallery - March 2019

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration

Automate creating, updating, and deleting user accounts for the following apps:

[Zscaler](https://aka.ms/ZscalerProvisioning), [Zscaler Beta](https://aka.ms/ZscalerBetaProvisioning), [Zscaler One](https://aka.ms/ZscalerOneProvisioning), [Zscaler Two](https://aka.ms/ZscalerTwoProvisioning), [Zscaler Three](https://aka.ms/ZscalerThreeProvisioning), [Zscaler ZSCloud](https://aka.ms/ZscalerZSCloudProvisioning), [Atlassian Cloud](https://aka.ms/atlassianCloudProvisioning)

For more information about how to better secure your organization through automated user account provisioning, see [Automate user provisioning to SaaS applications with Azure AD](https://aka.ms/ProvisioningDocumentation).

---

### Restore and manage your deleted Office 365 groups in the Azure AD portal

**Type:** New feature  
**Service category:** Group Management  
**Product capability:** Collaboration

You can now view and manage your deleted Office 365 groups from the Azure AD portal. This change helps you to see which groups are available to restore, along with letting you permanently delete any groups that aren’t needed by your organization.

For more information, see [Restore expired or deleted groups](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-restore-deleted#view-and-manage-the-deleted-office-365-groups-that-are-available-to-restore).

---

### Single sign-on is now available for Azure AD SAML-secured on-premises apps through Application Proxy (public preview)

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** Access Control

You can now provide a single sign-on (SSO) experience for on-premises, SAML-authenticated apps, along with remote access to these apps through Application Proxy. For more information about how to set up SAML SSO with your on-premises apps, see [SAML single sign-on for on-premises applications with Application Proxy (Preview)](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-single-sign-on-on-premises-apps).

---

### Client apps in request loops will be interrupted to improve reliability and user experience

**Type:** New feature  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication

Client apps can incorrectly issue hundreds of the same login requests over a short period of time. These requests, whether they're successful or not, all contribute to a poor user experience and heightened workloads for the IDP, increasing latency for all users and reducing the availability of the IDP.

This update sends an `invalid_grant` error: `AADSTS50196: The server terminated an operation because it encountered a loop while processing a request` to client apps that issue duplicate requests multiple times over a short period of time, beyond the scope of normal operation. Client apps that encounter this issue should show an interactive prompt, requiring the user to sign in again. For more information about this change and about how to fix your app if it encounters this error, see [What's new for authentication?](https://docs.microsoft.com/azure/active-directory/develop/reference-breaking-changes#looping-clients-will-be-interrupted).

---

### New Audit Logs user experience now available

**Type:** Changed feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting

We've created a new Azure AD **Audit logs** page to help improve both readability and how you search for your information. To see the new **Audit logs** page, select **Audit logs** in the **Activity** section of Azure AD.

![New Audit logs page, with sample info](media/whats-new/audit-logs-page.png)

For more information about the new **Audit logs** page, see [Audit activity reports in the Azure Active Directory portal](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-audit-logs#audit-logs).

---

### New warnings and guidance to help prevent accidental administrator lockout from misconfigured Conditional Access policies

**Type:** Changed feature  
**Service category:** Conditional Access  
**Product capability:** Identity Security & Protection

To help prevent administrators from accidentally locking themselves out of their own tenants through misconfigured Conditional Access policies, we've created new warnings and updated guidance in the Azure portal. For more information about the new guidance, see [What are service dependencies in Azure Active Directory Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/service-dependencies).

---

### Improved end-user terms of use experiences on mobile devices

**Type:** Changed feature  
**Service category:** Terms of use  
**Product capability:** Governance

We've updated our existing terms of use experiences to help improve how you review and consent to terms of use on a mobile device. You can now zoom in and out, go back, download the information, and select hyperlinks. For more information about the updated terms of use, see [Azure Active Directory terms of use feature](https://docs.microsoft.com/azure/active-directory/conditional-access/terms-of-use#what-terms-of-use-looks-like-for-users).

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

For more information about this feature, see [Quickstart: Download an audit report using the Azure portal](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-download-audit-report)

---

### Breaking change: Updates to condition evaluation by Exchange ActiveSync (EAS)

**Type:** Plan for change  
**Service category:** Conditional Access  
**Product capability:** Access Control

We’re in the process of updating how Exchange ActiveSync (EAS) evaluates the following conditions:

- User location, based on country, region, or IP address

- Sign-in risk

- Device platform

If you’ve previously used these conditions in your Conditional Access policies, be aware that the condition behavior might change. For example, if you previously used the user location condition in a policy, you might find the policy now being skipped based on the location of your user.

---
