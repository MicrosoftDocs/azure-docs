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
ms.date: 05/23/2019
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

### Automate user account provisioning for these newly-supported SaaS apps

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** Monitoring & Reporting

You can now automate creating, updating, and deleting user accounts for these newly-integrated apps:

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

We've updated Azure AD so that your company branding now appears on the sign out and error screens, as well as the sign-in page. You don't have to do anything to turn this feature on, Azure AD simply uses the assets you've already set up in the **Company branding** area of the Azure portal.

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

### New Azure AD threat intelligence detection is now available in refreshed Azure AD Identity Protection

**Type:** New feature  
**Service category:** Azure AD Identity Protection  
**Product capability:** Identity Security & Protection

Azure AD threat intelligence detection is now available in the refreshed Azure AD Identity Protection. This new functionality helps to indicate user activity that’s unusual for a specific user or that’s consistent with known attack patterns based on Microsoft’s internal and external threat intelligence.

For more information about the refreshed version of Azure AD Identity Protection, see the [Four major Azure AD Identity Protection enhancements are now in public preview](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Four-major-Azure-AD-Identity-Protection-enhancements-are-now-in/ba-p/326935) blog and the [What is Azure Active Directory Identity Protection (refreshed)?](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-v2) article. For more information about Azure AD threat intelligence detection, see the [Azure Active Directory Identity Protection risk events](https://docs.microsoft.com/azure/active-directory/identity-protection/risk-events-reference#azure-ad-threat-intelligence) article.

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

For more details about this feature, see [Quickstart: Download an audit report using the Azure portal](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-download-audit-report)

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

## February 2019

### Configurable Azure AD SAML token encryption (Public preview) 

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO

You can now configure any supported SAML app to receive encrypted SAML tokens. When configured and used with an app, Azure AD encrypts the emitted SAML assertions using a public key obtained from a certificate stored in Azure AD.

For more information about configuring your SAML token encryption, see [Configure Azure AD SAML token encryption](https://docs.microsoft.com/azure/active-directory/manage-apps/howto-saml-token-encryption).

---

### Create an access review for groups or apps using Azure AD Access Reviews

**Type:** New feature  
**Service category:** Access Reviews  
**Product capability:** Governance

You can now include multiple groups or apps in a single Azure AD access review for group membership or app assignment. Access reviews with multiple groups or apps are set up using the same settings and all included reviewers are notified at the same time.

For more information about how create an access review using Azure AD Access Reviews, see [Create an access review of groups or applications in Azure AD Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/create-access-review)

---

### New Federated Apps available in Azure AD app gallery - February 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In February 2019, we've added these 27 new apps with Federation support to the app gallery:

[Euromonitor Passport](https://docs.microsoft.com/azure/active-directory/saas-apps/euromonitor-passport-tutorial), [MindTickle](https://docs.microsoft.com/azure/active-directory/saas-apps/mindtickle-tutorial), [FAT FINGER](https://seeforgetest-exxon.azurewebsites.net/Account/create?Length=7), [AirStack](https://docs.microsoft.com/azure/active-directory/saas-apps/airstack-tutorial), [Oracle Fusion ERP](https://docs.microsoft.com/azure/active-directory/saas-apps/oracle-fusion-erp-tutorial), [IDrive](https://docs.microsoft.com/azure/active-directory/saas-apps/idrive-tutorial), [Skyward Qmlativ](https://docs.microsoft.com/azure/active-directory/saas-apps/skyward-qmlativ-tutorial), [Brightidea](https://docs.microsoft.com/azure/active-directory/saas-apps/brightidea-tutorial), [AlertOps](https://docs.microsoft.com/azure/active-directory/saas-apps/alertops-tutorial), [Soloinsight-CloudGate SSO](https://docs.microsoft.com/azure/active-directory/saas-apps/soloinsight-cloudgate-sso-tutorial), Permission Click, [Brandfolder](https://docs.microsoft.com/azure/active-directory/saas-apps/brandfolder-tutorial), [StoregateSmartFile](https://docs.microsoft.com/azure/active-directory/saas-apps/smartfile-tutorial), [Pexip](https://docs.microsoft.com/azure/active-directory/saas-apps/pexip-tutorial), [Stormboard](https://docs.microsoft.com/azure/active-directory/saas-apps/stormboard-tutorial), [Seismic](https://docs.microsoft.com/azure/active-directory/saas-apps/seismic-tutorial), [Share A Dream](https://www.shareadream.org/how-it-works), [Bugsnag](https://docs.microsoft.com/azure/active-directory/saas-apps/bugsnag-tutorial), [webMethods Integration Cloud](https://docs.microsoft.com/azure/active-directory/saas-apps/webmethods-integration-cloud-tutorial), [Knowledge Anywhere LMS](https://docs.microsoft.com/azure/active-directory/saas-apps/knowledge-anywhere-lms-tutorial), [OU Campus](https://docs.microsoft.com/azure/active-directory/saas-apps/ou-campus-tutorial), [Periscope Data](https://docs.microsoft.com/azure/active-directory/saas-apps/periscope-data-tutorial), [Netop Portal](https://docs.microsoft.com/azure/active-directory/saas-apps/netop-portal-tutorial), [smartvid.io](https://docs.microsoft.com/azure/active-directory/saas-apps/smartvid.io-tutorial), [PureCloud by Genesys](https://docs.microsoft.com/azure/active-directory/saas-apps/purecloud-by-genesys-tutorial), [ClickUp Productivity Platform](https://docs.microsoft.com/azure/active-directory/saas-apps/clickup-productivity-platform-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---

### Enhanced combined MFA/SSPR registration

**Type:** Changed feature  
**Service category:** Self Service Password Reset  
**Product capability:** User Authentication

In response to customer feedback, we’ve enhanced the combined MFA/SSPR registration preview experience, helping your users to more quickly register their security info for both MFA and SSPR. 

**To turn on the enhanced experience for your users' today, follow these steps:**

1. As a global administrator or user administrator, sign in to the Azure portal and go to **Azure Active Directory > User settings > Manage settings for access panel preview features**. 

2. In the **Users who can use the preview features for registering and managing security info – refresh** option, choose to turn on the features for a **Selected group of users** or for **All users**.

Over the next few weeks, we’ll be removing the ability to turn on the old combined MFA/SSPR registration preview experience for tenants that don’t already have it turned on.

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

For more information about password complexity requirement configuration, see [Configure complexity requirements for passwords in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-password-complexity).

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

For more information, see [Email one-time passcode authentication (preview)](https://docs.microsoft.com/azure/active-directory/b2b/one-time-passcode) and the blog, [Azure AD makes sharing and collaboration seamless for any user with any account](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-makes-sharing-and-collaboration-seamless-for-any-user/ba-p/325949).

### New Azure AD Application Proxy cookie settings

**Type:** New feature  
**Service category:** App Proxy  
**Product capability:** Access Control

We've introduced three new cookie settings, available for your apps that are published through Application Proxy:

- **Use HTTP-Only cookie.** Sets the **HTTPOnly** flag on your Application Proxy access and session cookies. Turning on this setting provides additional security benefits, such as helping to prevent copying or modifying of cookies through client-side scripting. We recommend you turn on this flag (choose **Yes**) for the added benefits.

- **Use secure cookie.** Sets the **Secure** flag on your Application Proxy access and session cookies. Turning on this setting provides additional security benefits, by making sure cookies are only transmitted over TLS secure channels, such as HTTPS. We recommend you turn on this flag (choose **Yes**) for the added benefits.

- **Use persistent cookie.** Prevents access cookies from expiring when the web browser is closed. These cookies last for the lifetime of the access token. However, the cookies are reset if the expiration time is reached or if the user manually deletes the cookie. We recommend you keep the default setting **No**, only turning on the setting for older apps that don't share cookies between processes.

For more information about the new cookies, see [Cookie settings for accessing on-premises applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-cookie-settings).

---

### New Federated Apps available in Azure AD app gallery - January 2019

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In January 2019, we've added these 35 new apps with Federation support to the app gallery:

[Firstbird](https://docs.microsoft.com/azure/active-directory/saas-apps/firstbird-tutorial), [Folloze](https://docs.microsoft.com/azure/active-directory/saas-apps/folloze-tutorial), [Talent Palette](https://docs.microsoft.com/azure/active-directory/saas-apps/talent-palette-tutorial), [Infor CloudSuite](https://docs.microsoft.com/azure/active-directory/saas-apps/infor-cloud-suite-tutorial), [Cisco Umbrella](https://docs.microsoft.com/azure/active-directory/saas-apps/cisco-umbrella-tutorial), [Zscaler Internet Access Administrator](https://docs.microsoft.com/azure/active-directory/saas-apps/zscaler-internet-access-administrator-tutorial), [Expiration Reminder](https://docs.microsoft.com/azure/active-directory/saas-apps/expiration-reminder-tutorial), [InstaVR Viewer](https://docs.microsoft.com/azure/active-directory/saas-apps/instavr-viewer-tutorial), [CorpTax](https://docs.microsoft.com/azure/active-directory/saas-apps/corptax-tutorial), [Verb](https://app.verb.net/login), [OpenLattice](https://openlattice.com/agora), [TheOrgWiki](https://www.theorgwiki.com/signup), [Pavaso Digital Close](https://docs.microsoft.com/azure/active-directory/saas-apps/pavaso-digital-close-tutorial), [GoodPractice Toolkit](https://docs.microsoft.com/azure/active-directory/saas-apps/goodpractice-toolkit-tutorial), [Cloud Service PICCO](https://docs.microsoft.com/azure/active-directory/saas-apps/cloud-service-picco-tutorial), [AuditBoard](https://docs.microsoft.com/azure/active-directory/saas-apps/auditboard-tutorial), [iProva](https://docs.microsoft.com/azure/active-directory/saas-apps/iprova-tutorial), [Workable](https://docs.microsoft.com/azure/active-directory/saas-apps/workable-tutorial), [CallPlease](https://webapp.callplease.com/create-account/create-account.html), [GTNexus SSO System](https://docs.microsoft.com/azure/active-directory/saas-apps/gtnexus-sso-module-tutorial), [CBRE ServiceInsight](https://docs.microsoft.com/azure/active-directory/saas-apps/cbre-serviceinsight-tutorial), [Deskradar](https://docs.microsoft.com/azure/active-directory/saas-apps/deskradar-tutorial), [Coralogixv](https://docs.microsoft.com/azure/active-directory/saas-apps/coralogix-tutorial), [Signagelive](https://docs.microsoft.com/azure/active-directory/saas-apps/signagelive-tutorial), [ARES for Enterprise](https://docs.microsoft.com/azure/active-directory/saas-apps/ares-for-enterprise-tutorial), [K2 for Office 365](https://www.k2.com/O365), [Xledger](https://www.xledger.net/), [iDiD Manager](https://docs.microsoft.com/azure/active-directory/saas-apps/idid-manager-tutorial), [HighGear](https://docs.microsoft.com/azure/active-directory/saas-apps/highgear-tutorial), [Visitly](https://docs.microsoft.com/azure/active-directory/saas-apps/visitly-tutorial), [Korn Ferry ALP](https://docs.microsoft.com/azure/active-directory/saas-apps/korn-ferry-alp-tutorial), [Acadia](https://docs.microsoft.com/azure/active-directory/saas-apps/acadia-tutorial), [Adoddle cSaas Platform](https://docs.microsoft.com/azure/active-directory/saas-apps/adoddle-csaas-platform-tutorial)<!-- , [CaféX Portal (Meetings)](https://docs.microsoft.com/azure/active-directory/saas-apps/cafexportal-meetings-tutorial), [MazeMap Link](https://docs.microsoft.com/azure/active-directory/saas-apps/mazemaplink-tutorial)-->  

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

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

For more information about the enhancements, see [What is Azure Active Directory Identity Protection (refreshed)?](https://aka.ms/IdentityProtectionDocs) to learn more and to share your thoughts through the in-product prompts.

---

### New App Lock feature for the Microsoft Authenticator app on iOS and Android devices

**Type:** New feature  
**Service category:** Microsoft Authenticator App  
**Product capability:** Identity Security & Protection

To keep your one-time passcodes, app information, and app settings more secure, you can turn on the App Lock feature in the Microsoft Authenticator app. Turning on App Lock means you’ll be asked to authenticate using your PIN or biometric every time you open the Microsoft Authenticator app.

For more information, see the [Microsoft Authenticator app FAQ](https://docs.microsoft.com/azure/active-directory/user-help/microsoft-authenticator-app-faq).

---

### Enhanced Azure AD Privileged Identity Management (PIM) export capabilities

**Type:** New feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management

Privileged Identity Management (PIM) administrators can now export all active and eligible role assignments for a specific resource, which includes role assignments for all child resources. Previously, it was difficult for administrators to get a complete list of role assignments for a subscription and they had to export role assignments for each specific resource.

For more information, see [View activity and audit history for Azure resource roles in PIM](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/azure-pim-resource-rbac).

---
