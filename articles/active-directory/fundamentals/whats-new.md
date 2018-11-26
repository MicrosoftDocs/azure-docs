---
title: What's new? Release notes for Azure AD | Microsoft Docs
description: Learn what is new with Azure Active Directory (Azure AD), such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: active-directory
author: eross-msft
manager: mtillman
featureFlags:
 - clicktale
 
ms.assetid: 06a149f7-4aa1-4fb9-a8ec-ac2633b031fb
ms.service: active-directory
ms.component: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: lizross
ms.reviewer: dhanyahk
---

# What's new in Azure Active Directory?

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22release+notes+for+azure+AD%22&locale=en-us` into your ![RSS icon](./media/whats-new/feed-icon-16x16.png) feed reader.

Azure AD receives improvements on an ongoing basis. To stay up-to-date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality
- Plans for changes

This page is updated monthly, so revisit it regularly. If you're looking for items that are older than 6 months, you can find them in the [Archive for What's new in Azure Active Directory](whats-new-archive.md).

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

[My Award Points](https://docs.microsoft.com/azure/active-directory/saas-apps/myawardpoints-tutorial), [Vibe HCM](https://docs.microsoft.com/azure/active-directory/saas-apps/vibehcm-tutorial), ambyint, [MyWorkDrive](https://docs.microsoft.com/azure/active-directory/saas-apps/myworkdrive-tutorial), [BorrowBox](https://docs.microsoft.com/azure/active-directory/saas-apps/borrowbox-tutorial), Dialpad, [ON24 Virtual Environment](https://docs.microsoft.com/azure/active-directory/saas-apps/on24-tutorial), [RingCentral](https://docs.microsoft.com/azure/active-directory/saas-apps/ringcentral-tutorial), [Zscaler Three](https://docs.microsoft.com/azure/active-directory/saas-apps/zscaler-three-tutorial), [Phraseanet](https://docs.microsoft.com/azure/active-directory/saas-apps/phraseanet-tutorial), [Appraisd](https://docs.microsoft.com/azure/active-directory/saas-apps/appraisd-tutorial), [Workspot Control](https://docs.microsoft.com/azure/active-directory/saas-apps/workspotcontrol-tutorial), [Shuccho Navi](https://docs.microsoft.com/azure/active-directory/saas-apps/shucchonavi-tutorial), [Glassfrog](https://docs.microsoft.com/azure/active-directory/saas-apps/glassfrog-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---

### Azure AD Domain Services Email Notifications

**Type:** New feature  
**Service category:** Azure AD Domain Services  
**Product capability:** Azure AD Domain Services

Azure AD Domain Services provides alerts on the Azure portal about misconfigurations or problems with your managed domain. These alerts include step-by-step guides so you can try to fix the problems without having to contact support.

Starting in October, you'll be able to customize the notification settings for your managed domain so when new alerts occur, an email is sent to a designated group of people, eliminating the need to constantly check the portal for updates.

For more information, see [Notification settings in Azure AD Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-notifications).

---

### Azure AD portal supports using the ForceDelete domain API to delete custom domains 

**Type:** Changed feature  
**Service category:** Directory Management  
**Product capability:** Directory

We're pleased to announce that you can now use the ForceDelete domain API to delete your custom domain names by asynchronously renaming references, like users, groups, and apps from your custom domain name (contoso.com) back to the initial default domain name (contoso.onmicrosoft.com).

This change helps you to more quickly delete your custom domain names if your organization no longer uses the name, or if you need to use the domain name with another Azure AD.

For more information, see [Delete a custom domain name](https://docs.microsoft.com/azure/active-directory/users-groups-roles/domains-manage#delete-a-custom-domain-name).

---

## September 2018
 
### Updated administrator role permissions for dynamic groups

**Type:** Fixed  
**Service category:** Group Management  
**Product capability:** Collaboration

We've fixed an issue so specific administrator roles can now create and update dynamic membership rules, without needing to be the owner of the group.

The roles are:

- Global administrator or Company Writer

- Intune Service Administrator

- User Account Administrator

For more information, see [Create a dynamic group and check status](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-create-rule)

---

### Simplified Single Sign-On (SSO) configuration settings for some third-party apps

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO

We realize that setting up Single Sign-On (SSO) for Software as a Service (SaaS) apps can be challenging due to the unique nature of each apps configuration. We've built a simplified configuration experience to auto-populate the SSO configuration settings for the following third-party SaaS apps:

- Zendesk

- ArcGis Online

- Jamf Pro

To start using this one-click experience, go to the **Azure portal** > **SSO configuration** page for the app. For more information, see [SaaS application integration with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list)

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

For more information, see [What is the My Apps portal?](https://docs.microsoft.com/azure/active-directory/user-help/active-directory-saas-access-panel-introduction)

---

### New Troubleshooting and Support tab on the Sign-ins Logs page of the Azure portal

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting

The new **Troubleshooting and Support** tab on the **Sign-ins** page of the Azure portal, is intended to help admins and support engineers troubleshoot issues related to Azure AD sign-ins. This new tab provides the error code, error message, and remediation recommendations (if any) to help solve the problem. If you're unable to resolve the problem, we also give you a new way to create a support ticket using the **Copy to clipboard** experience, which populates the **Request ID** and **Date (UTC)** fields for the log file in your support ticket.  

![Sign-in logs with the new tab](media/whats-new/troubleshooting-and-support.png)

---

### Enhanced support for custom extension properties used to create dynamic membership rules

**Type:** Changed feature  
**Service category:** Group Management  
**Product capability:** Collaboration

With this update, you can now click the **Get custom extension properties** link from the dynamic user group rule builder, enter your unique app ID, and receive the full list of custom extension properties to use when creating a dynamic membership rule for users. This list can also be refreshed to get any new custom extension properties for that app.

For more information about using custom extension properties for dynamic membership rules, see [Extension properties and custom extension properties](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-dynamic-membership#extension-properties-and-custom-extension-properties)

---

### New approved client apps for Azure AD app-based conditional access

**Type:** Plan for change  
**Service category:** Conditional access  
**Product capability:** Identity security and protection

The following apps are on the list of [approved client apps](https://docs.microsoft.com/azure/active-directory/conditional-access/technical-reference#approved-client-app-requirement):

- Microsoft To-Do

- Microsoft Stream

For more information, see:

- [Azure AD app-based conditional access](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-conditional-access)

---

### New support for Self-Service Password Reset from the Windows 7/8/8.1 Lock screen

**Type:** New feature  
**Service category:** SSPR  
**Product capability:** User Authentication

After you set up this new feature, your users will see a link to reset their password from the **Lock** screen of a device running Windows 7, Windows 8, or Windows 8.1. By clicking that link, the user is guided through the same password reset flow as through the web browser.

For more information, see [How to enable password reset from Windows 7, 8, and 8.1](https://aka.ms/ssprforwindows78)

---

### Change notice: Authorization codes will no longer be available for reuse 

**Type:** Plan for change  
**Service category:** Authentications (Logins)  
**Product capability:** User Authentication

Starting on November 15, 2018, Azure AD will stop accepting previously used authentication codes for apps. This security change helps to bring Azure AD in line with the OAuth specification and will be enforced on both the v1 and v2 endpoints.

If your app reuses authorization codes to get tokens for multiple resources, we recommend that you use the code to get a refresh token, and then use that refresh token to acquire additional tokens for other resources. Authorization codes can only be used once, but refresh tokens can be used multiple times across multiple resources. An app that attempts to reuse an authentication code during the OAuth code flow will get an invalid_grant error.

For this and other protocols-related changes, see [the full list of what's new for authentication](https://docs.microsoft.com/azure/active-directory/develop/reference-breaking-changes).

---

### New Federated Apps available in Azure AD app gallery - September 2018

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In September 2018, we've added these 16 new apps with Federation support to the app gallery:

[Uberflip](https://docs.microsoft.com/azure/active-directory/saas-apps/uberflip-tutorial), [Comeet Recruiting Software](https://docs.microsoft.com/azure/active-directory/saas-apps/comeetrecruitingsoftware-tutorial), [Workteam](https://docs.microsoft.com/azure/active-directory/saas-apps/workteam-tutorial), [ArcGIS Enterprise](https://docs.microsoft.com/azure/active-directory/saas-apps/arcgisenterprise-tutorial), [Nuclino](https://docs.microsoft.com/azure/active-directory/saas-apps/nuclino-tutorial), [JDA Cloud](https://docs.microsoft.com/azure/active-directory/saas-apps/jdacloud-tutorial), [Snowflake](https://docs.microsoft.com/azure/active-directory/saas-apps/snowflake-tutorial), NavigoCloud, [Figma](https://docs.microsoft.com/azure/active-directory/saas-apps/figma-tutorial), join.me, [ZephyrSSO](https://docs.microsoft.com/azure/active-directory/saas-apps/zephyrsso-tutorial), [Silverback](https://docs.microsoft.com/azure/active-directory/saas-apps/silverback-tutorial), Riverbed Xirrus EasyPass, [Rackspace SSO](https://docs.microsoft.com/azure/active-directory/saas-apps/rackspacesso-tutorial), Enlyft SSO for Azure, SurveyMonkey, [Convene](https://docs.microsoft.com/azure/active-directory/saas-apps/convene-tutorial), [dmarcian](https://docs.microsoft.com/azure/active-directory/saas-apps/dmarcian-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---

### Support for additional claims transformations methods

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** SSO

We've introduced new claim transformation methods, ToLower() and ToUpper(), which can be applied to SAML tokens from the SAML-based **Single Sign-On Configuration** page.

For more information, see [How to customize claims issued in the SAML token for enterprise applications in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization)

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

To turn on this updated view, click the **Try out our new experience** link from the top of the **Single Sign-On** page. For more information, see [Tutorial: Configure SAML-based single sign-on for an application with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/configure-single-sign-on-portal).

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

For this and other protocols-related changes, see [the full list of what's new for authentication](https://docs.microsoft.com/azure/active-directory/develop/reference-breaking-changes).
 
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

There's a new setting called, **HTTP-Only Cookies** in your Application Proxy apps. This setting helps provide extra security by including the HTTPOnly flag in the HTTP response header for both Application Proxy access and session cookies, stopping access to the cookie from a client-side script and further preventing actions like copying or modifying the cookie. Although this flag hasn't been used previously, your cookies have always been encrypted and transmitted using an SSL connection to help protect against improper modifications.

This setting isn't compatible with apps using ActiveX controls, such as Remote Desktop. If you're in this situation, we recommend that you turn off this setting.

For more information about the HTTP-Only Cookies setting, see [Publish applications using Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-publish-azure-portal).

---

### Privileged Identity Management (PIM) for Azure resources supports Management Group resource types

**Type:** New feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
Just-In-Time activation and assignment settings can now be applied to Management Group resource types, just like you already do for Subscriptions, Resource Groups, and Resources (such as VMs, App Services, and more). In addition, anyone with a role that provides administrator access for a Management Group can discover and manage that resource in PIM.

For more information about PIM and Azure resources, see [Discover and manage Azure resources by using Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-resource-roles-discover-resources)
 
---

### Application access (preview) provides faster access to the Azure AD portal

**Type:** New feature  
**Service category:** Privileged Identity Management  
**Product capability:** Privileged Identity Management
 
Today, when activating a role using PIM, it can take over 10 minutes for the permissions to take effect. If you choose to use Application access, which is currently in public preview, administrators can access the Azure AD portal as soon as the activation request completes.

Currently, Application access only supports the Azure AD portal experience and Azure resources. For more information about PIM and Application access, see [What is Azure AD Privileged Identity Management?](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure)
 
---

### New Federated Apps available in Azure AD app gallery - August 2018

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In August 2018, we've added these 16 new apps with Federation support to the app gallery:

[Hornbill](https://docs.microsoft.com/azure/active-directory/saas-apps/hornbill-tutorial), [Bridgeline Unbound](https://docs.microsoft.com/azure/active-directory/saas-apps/bridgelineunbound-tutorial), [Sauce Labs - Mobile and Web Testing](https://docs.microsoft.com/azure/active-directory/saas-apps/saucelabs-mobileandwebtesting-tutorial), [Meta Networks Connector](https://docs.microsoft.com/azure/active-directory/saas-apps/metanetworksconnector-tutorial), [Way We Do](https://docs.microsoft.com/azure/active-directory/saas-apps/waywedo-tutorial), [Spotinst](https://docs.microsoft.com/azure/active-directory/saas-apps/spotinst-tutorial), [ProMaster (by Inlogik)](https://docs.microsoft.com/azure/active-directory/saas-apps/promaster-tutorial), SchoolBooking, [4me](https://docs.microsoft.com/azure/active-directory/saas-apps/4me-tutorial), [Dossier](https://docs.microsoft.com/azure/active-directory/saas-apps/DOSSIER-tutorial), [N2F - Expense reports](https://docs.microsoft.com/azure/active-directory/saas-apps/n2f-expensereports-tutorial), [Comm100 Live Chat](https://docs.microsoft.com/azure/active-directory/saas-apps/comm100livechat-tutorial), [SafeConnect](https://docs.microsoft.com/azure/active-directory/saas-apps/safeconnect-tutorial), [ZenQMS](https://docs.microsoft.com/azure/active-directory/saas-apps/zenqms-tutorial), [eLuminate](https://docs.microsoft.com/azure/active-directory/saas-apps/eluminate-tutorial), [Dovetale](https://docs.microsoft.com/azure/active-directory/saas-apps/dovetale-tutorial).

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---

### Native Tableau support is now available in Azure AD Application Proxy

**Type:** Changed feature  
**Service category:** App Proxy  
**Product capability:** Access Control

With our update from the OpenID Connect to the OAuth 2.0 Code Grant protocol for our pre-authentication protocol, you no longer have to do any additional configuration to use Tableau with Application Proxy. This protocol change also helps Application Proxy better support more modern apps by using only HTTP redirects, which are commonly supported in JavaScript and HTML tags.

For more information about our native support for Tableau, see [Azure AD Application Proxy now with native Tableau support](https://blogs.technet.microsoft.com/applicationproxyblog/2018/08/14/azure-ad-application-proxy-now-with-native-tableau-support).

---

### New support to add Google as an identity provider for B2B guest users in Azure Active Directory (preview)

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C

By setting up federation with Google in your organization, you can let invited Gmail users sign in to your shared apps and resources using their existing Google account, without having to create a personal Microsoft Account (MSAs) or an Azure AD account.

This is an opt-in public preview. For more information about Google federation, see [Add Google as an identity provider for B2B guest users](https://docs.microsoft.com/azure/active-directory/b2b/google-federation).

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
 
For an example of some of the new e-mail designs and more information, see [Email notifications in Azure AD PIM](https://go.microsoft.com/fwlink/?linkid=2005832).

---

### Azure AD Activity Logs are now available through Azure Monitor

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting

The Azure AD Activity Logs are now available in public preview for the Azure Monitor (Azure's platform-wide monitoring service). Azure Monitor offers you long-term retention and seamless integration, in addition to these improvements:

- Long-term retention by routing your log files to your own Azure storage account.

- Seamless SIEM integration, without requiring you to write or maintain custom scripts.

- Seamless integration with your own custom solutions, analytics tools, or incident management solutions.

For more information about these new capabilities, see our blog [Azure AD activity logs in Azure Monitor diagnostics is now in public preview](https://cloudblogs.microsoft.com/enterprisemobility/2018/07/26/azure-ad-activity-logs-in-azure-monitor-diagnostics-now-in-public-preview/) and our documentation, [Azure Active Directory activity logs in Azure Monitor (preview)](https://docs.microsoft.com/azure/active-directory/reporting-azure-monitor-diagnostics-overview).

---

### Conditional access information added to the Azure AD sign-ins report

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Identity Security & Protection
 
This update lets you see which policies are evaluated when a user signs in along with the policy outcome. In addition, the report now includes the type of client app used by the user, so you can identify legacy protocol traffic. Report entries can also now be searched for a correlation ID, which can be found in the user-facing error message and can be used to identify and troubleshoot the matching sign-in request.

---

### View legacy authentications through Sign-ins activity logs

**Type:** New feature  
**Service category:** Reporting  
**Product capability:** Monitoring & Reporting
 
With the introduction of the **Client App** field in the Sign-in activity logs, customers can now see users that are using legacy authentications. Customers will be able to access this information using the Sign-ins MS Graph API or through the Sign-in activity logs in Azure AD portal where you can use the **Client App** control to filter on legacy authentications. Check out the documentation for more details.

---

### New Federated Apps available in Azure AD app gallery - July 2018

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In July 2018, we've added these 16 new apps with Federation support to the app gallery:

[Innovation Hub](https://docs.microsoft.com/azure/active-directory/saas-apps/innovationhub-tutorial), [Leapsome](https://docs.microsoft.com/azure/active-directory/saas-apps/leapsome-tutorial), [Certain Admin SSO](https://docs.microsoft.com/azure/active-directory/saas-apps/certainadminsso-tutorial), PSUC Staging, [iPass SmartConnect](https://docs.microsoft.com/azure/active-directory/saas-apps/ipasssmartconnect-tutorial), [Screencast-O-Matic](https://docs.microsoft.com/azure/active-directory/saas-apps/screencast-tutorial), PowerSchool Unified Classroom, [Eli Onboarding](https://docs.microsoft.com/azure/active-directory/saas-apps/elionboarding-tutorial), [Bomgar Remote Support](https://docs.microsoft.com/azure/active-directory/saas-apps/bomgarremotesupport-tutorial), [Nimblex](https://docs.microsoft.com/azure/active-directory/saas-apps/nimblex-tutorial), [Imagineer WebVision](https://docs.microsoft.com/azure/active-directory/saas-apps/imagineerwebvision-tutorial), [Insight4GRC](https://docs.microsoft.com/azure/active-directory/saas-apps/insight4grc-tutorial), [SecureW2 JoinNow Connector](https://docs.microsoft.com/azure/active-directory/saas-apps/securejoinnow-tutorial), [Kanbanize](https://review.docs.microsoft.com/azure/active-directory/saas-apps/kanbanize-tutorial), [SmartLPA](https://review.docs.microsoft.com/azure/active-directory/saas-apps/smartlpa-tutorial), [Skills Base](https://docs.microsoft.com/azure/active-directory/saas-apps/skillsbase-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://aka.ms/azureadapprequest).

---
 
### New user provisioning SaaS app integrations - July 2018

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
Azure AD allows you to automate the creation, maintenance, and removal of user identities in SaaS applications such as Dropbox, Salesforce, ServiceNow, and more. For July 2018, we have added user provisioning support for the following applications in the Azure AD app gallery:

- [Cisco Spark](https://docs.microsoft.com/azure/active-directory/saas-apps/cisco-spark-provisioning-tutorial)

- [Cisco WebEx](https://docs.microsoft.com/azure/active-directory/saas-apps/cisco-webex-provisioning-tutorial)

- [Bonusly](https://docs.microsoft.com/azure/active-directory/saas-apps/bonusly-provisioning-tutorial)

For a list of all applications that support user provisioning in the Azure AD gallery, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial).

---

### Connect Health for Sync - An easier way to fix orphaned and duplicate attribute sync errors

**Type:** New feature  
**Service category:** AD Connect  
**Product capability:** Monitoring & Reporting
 
Azure AD Connect Health introduces self-service remediation to help you highlight and fix sync errors. This feature troubleshoots duplicated attribute sync errors and fixes objects that are orphaned from Azure AD. This diagnosis has the following benefits:

- Narrows down duplicated attribute sync errors, providing specific fixes

- Applies a fix for dedicated Azure AD scenarios, resolving errors in a single step

- No upgrade or configuration is required to turn on and use this feature

For more information, see [Diagnose and remediate duplicated attribute sync errors](https://docs.microsoft.com/azure/active-directory/connect-health/active-directory-aadconnect-health-diagnose-sync-errors)

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

For more information about this update, see [Azure AD Connect: Version release history](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-version-history)

---

### Updates to the Terms of Use (ToU) end-user UI

**Type:** Changed feature  
**Service category:** Terms of Use  
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

Due to our stronger security enforcement, we’ve had to make a change to the permissions for apps that use a delegated authorization flow to access [Azure AD Activity Logs APIs](https://aka.ms/aadreportsapi). This change will occur by **June 26, 2018**.

If any of your apps use Azure AD Activity Log APIs, follow these steps to ensure the app doesn’t break after the change happens.

**To update your app permissions**

1. Sign in to the Azure portal, select **Azure Active Directory**, and then select **App Registrations**.
2. Select your app that uses the Azure AD Activity Logs API, select **Settings**, select **Required permissions**, and then select the **Windows Azure Active Directory** API.
3. In the **Delegated permissions** area of the **Enable access** blade, select the box next to **Read directory** data, and then select **Save**.
4. Select **Grant permissions**, and then select **Yes**.
    
    >[!Note]
    >You must be a Global administrator to grant permissions to the app.

For more information, see the [Grant permissions](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-api-prerequisites-azure-portal#grant-permissions) area of the Prerequisites to access the Azure AD reporting API article.

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

[Skytap](https://docs.microsoft.com/azure/active-directory/active-directory-saas-skytap-tutorial), [Settling music](https://docs.microsoft.com/azure/active-directory/active-directory-saas-settlingmusic-tutorial), [SAML 1.1 Token enabled LOB App](https://docs.microsoft.com/azure/active-directory/active-directory-saas-saml-tutorial), [Supermood](https://docs.microsoft.com/azure/active-directory/active-directory-saas-supermood-tutorial), [Autotask](https://docs.microsoft.com/azure/active-directory/active-directory-saas-autotaskendpointbackup-tutorial), [Endpoint Backup](https://docs.microsoft.com/azure/active-directory/active-directory-saas-autotaskendpointbackup-tutorial), [Skyhigh Networks](https://docs.microsoft.com/azure/active-directory/active-directory-saas-skyhighnetworks-tutorial), Smartway2, [TonicDM](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tonicdm-tutorial), [Moconavi](https://docs.microsoft.com/azure/active-directory/active-directory-saas-moconavi-tutorial), [Zoho One](https://docs.microsoft.com/azure/active-directory/active-directory-saas-zohoone-tutorial), [SharePoint on-premises](https://docs.microsoft.com/azure/active-directory/active-directory-saas-sharepoint-on-premises-tutorial), [ForeSee CX Suite](https://docs.microsoft.com/azure/active-directory/active-directory-saas-foreseecxsuite-tutorial), [Vidyard](https://docs.microsoft.com/azure/active-directory/active-directory-saas-vidyard-tutorial), [ChronicX](https://docs.microsoft.com/azure/active-directory/active-directory-saas-chronicx-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial). For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://docs.microsoft.com/azure/active-directory/develop/active-directory-app-gallery-listing). 

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

For more information about Azure AD Password Protection, see [Eliminate bad passwords in your organization](https://aka.ms/aadpasswordprotectiondocs).

---

### New "all guests" conditional access policy template created during Terms of Use (ToU) creation

**Type:** New feature  
**Service category:** Terms of Use  
**Product capability:** Governance

During the creation of your Terms of Use (ToU), a new conditional access policy template is also created for "all guests" and "all apps". This new policy template applies the newly created ToU, streamlining the creation and enforcement process for guests.

For more information, see [Azure Active Directory Terms of use feature](https://docs.microsoft.com/azure/active-directory/active-directory-tou).

---

### New "custom" conditional access policy template created during Terms of Use (ToU) creation

**Type:** New feature  
**Service category:** Terms of Use  
**Product capability:** Governance

During the creation of your Terms of Use (ToU), a new “custom” conditional access policy template is also created. This new policy template lets you create the ToU and then immediately go to the conditional access policy creation blade, without needing to manually navigate through the portal.

For more information, see [Azure Active Directory Terms of use feature](https://docs.microsoft.com/azure/active-directory/active-directory-tou).

---

### New and comprehensive guidance about deploying Azure Multi-Factor Authentication

**Type:** New feature  
**Service category:** Other  
**Product capability:** Identity Security & Protection
 
We've released new step-by-step guidance about how to deploy Azure Multi-Factor Authentication (MFA) in your organization.

To view the MFA deployment guide, go to the [Identity Deployment Guides](https://aka.ms/DeploymentPlans) repo on GitHub. To provide feedback about the deployment guides, use the [Deployment Plan Feedback form](https://aka.ms/deploymentplanfeedback). If you have any questions about the deployment guides, contact us at [IDGitDeploy](mailto:idgitdeploy@microsoft.com).

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

For more information about public preview, see the [Azure AD delegated application management roles are in public preview!](https://cloudblogs.microsoft.com/enterprisemobility/2018/06/13/hallelujah-azure-ad-delegated-application-management-roles-are-in-public-preview/) blog. For more information about roles and permissions, see [Assigning administrator roles in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-assign-admin-roles-azure-portal).

---

## May 2018

### ExpressRoute support changes

**Type:** Plan for change  
**Service category:** Authentications (Logins)  
**Product capability:** Platform  

Software as a Service offering, like Azure Active Directory (Azure AD) are designed to work best by going directly through the Internet, without requiring ExpressRoute or any other private VPN tunnels. Because of this, on **August 1, 2018**, we will stop supporting ExpressRoute for Azure AD services using Azure public peering and Azure communities in Microsoft peering. Any services impacted by this change might notice Azure AD traffic gradually shifting from ExpressRoute to the Internet.

While we're changing our support, we also know there are still situations where you might need to use a dedicated set of circuits for your authentication traffic. Because of this, Azure AD will continue to support per-tenant IP range restrictions using ExpressRoute and services already on Microsoft peering with the "Other Office 365 Online services" community. If your services are impacted, but you require ExpressRoute, you must do the following:

- **If you're on Azure public peering.** Move to Microsoft peering and sign up for the **Other Office 365 Online services (12076:5100)** community. For more info about how to move from Azure public peering to Microsoft peering, see the [Move a public peering to Microsoft peering](https://docs.microsoft.com/azure/expressroute/how-to-move-peering) article.

- **If you're on Microsoft peering.** Sign up for the **Other Office 365 Online service (12076:5100)** community. For more info about routing requirements, see the [Support for BGP communities section](https://docs.microsoft.com/azure/expressroute/expressroute-routing#bgp) of the ExpressRoute routing requirements article.

If you must continue to use dedicated circuits, you'll need to talk to your Microsoft Account team about how to get authorization to use the **Other Office 365 Online service (12076:5100)** community. The MS Office-managed review board will verify whether you need those circuits and make sure you understand the technical implications of keeping them. Unauthorized subscriptions trying to create route filters for Office 365 will receive an error message. 
 
---

### Microsoft Graph APIs for administrative scenarios for TOU

**Type:** New feature  
**Service category:** Terms of Use  
**Product capability:** Developer Experience
 
We've added Microsoft Graph APIs for administration operation of Azure AD Terms of Use. You are able to create, update, delete the Terms of Use object.

---

### Add Azure AD multi-tenant endpoint as an identity provider in Azure AD B2C

**Type:** New feature  
**Service category:** B2C - Consumer Identity Management  
**Product capability:** B2B/B2C
 
Using custom policies, you can now add the Azure AD common endpoint as an identity provider in Azure AD B2C. This allows you to have a single point of entry for all Azure AD users that are signing into your applications. For more information, see [Azure Active Directory B2C: Allow users to sign in to a multi-tenant Azure AD identity provider using custom policies](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-commonaad-custom).

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

Customers in Europe require their data to stay in Europe and not replicated outside of European datacenters for meeting privacy and European laws. This [article](https://go.microsoft.com/fwlink/?linkid=872328) provides the specific details on what identity information will be stored within Europe and also provide details on information that will be stored outside European datacenters. 

---
 
### New user provisioning SaaS app integrations - May 2018

**Type:** New feature  
**Service category:** App Provisioning  
**Product capability:** 3rd Party Integration
 
Azure AD allows you to automate the creation, maintenance, and removal of user identities in SaaS applications such as Dropbox, Salesforce, ServiceNow, and more. For May 2018, we have added user provisioning support for the following applications in the Azure AD app gallery:

- [BlueJeans](https://docs.microsoft.com/azure/active-directory/active-directory-saas-bluejeans-provisioning-tutorial)

- [Cornerstone OnDemand](https://docs.microsoft.com/azure/active-directory/active-directory-saas-cornerstone-ondemand-provisioning-tutorial)

- [Zendesk](https://docs.microsoft.com/azure/active-directory/active-directory-saas-zendesk-provisioning-tutorial)

For a list of all applications that support user provisioning in the Azure AD gallery, see [https://aka.ms/appstutorial](https://aka.ms/appstutorial).

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
 
Azure AD Activity logs, which, includes Sign-ins and Audit logs, are now available through MS Graph. We have exposed two end points through MS Graph to access these logs. Check out our [documents](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-api-getting-started-azure-portal) for programmatic access to Azure AD Reporting APIs to get started. 

---
 
### Improvements to the B2B redemption experience and leave an org

**Type:** New feature  
**Service category:** B2B  
**Product capability:** B2B/B2C

**Just in time redemption:** Once you share a resource with a guest user using B2B API – you don’t need to send out a special invitation email. In most      cases, the guest user can access the resource and will be taken through the redemption experience just in time. No more impact due to missed emails. No more asking your guest users “Did you click on that redemption link the system sent you?”. This means once SPO uses the invitation manager – cloudy attachments can have the same canonical URL for all users – internal and external – in any state of redemption.

**Modern redemption experience:** No more split screen redemption landing page. Users will see a modern consent experience with the inviting organization's privacy statement, just like they do for third-party apps.

**Guest users can leave the org:** Once a user’s relationship with an org is over, they can self-serve leaving the organization. No more calling the inviting org’s admin to “be removed”, no more raising support tickets.

---

### New Federated Apps available in Azure AD app gallery - May 2018

**Type:** New feature  
**Service category:** Enterprise Apps  
**Product capability:** 3rd Party Integration
 
In May 2018, we've added these 18 new apps with Federation support to our app gallery:

[AwardSpring](https://docs.microsoft.com/azure/active-directory/active-directory-saas-awardspring-tutorial), Infogix Data3Sixty Govern, [Yodeck](https://docs.microsoft.com/azure/active-directory/active-directory-saas-infogix-tutorial), [Jamf Pro](https://docs.microsoft.com/azure/active-directory/active-directory-saas-jamfprosamlconnector-tutorial), [KnowledgeOwl](https://docs.microsoft.com/azure/active-directory/active-directory-saas-knowledgeowl-tutorial), [Envi MMIS](https://docs.microsoft.com/azure/active-directory/active-directory-saas-envimmis-tutorial), [LaunchDarkly](https://docs.microsoft.com/azure/active-directory/active-directory-saas-launchdarkly-tutorial), [Adobe Captivate Prime](https://docs.microsoft.com/azure/active-directory/active-directory-saas-adobecaptivateprime-tutorial), [Montage Online](https://docs.microsoft.com/azure/active-directory/active-directory-saas-montageonline-tutorial), [まなびポケット](https://docs.microsoft.com/azure/active-directory/active-directory-saas-manabipocket-tutorial), OpenReel, [Arc Publishing - SSO](https://docs.microsoft.com/azure/active-directory/active-directory-saas-arc-tutorial), [PlanGrid](https://docs.microsoft.com/azure/active-directory/active-directory-saas-plangrid-tutorial), [iWellnessNow](https://docs.microsoft.com/azure/active-directory/active-directory-saas-iwellnessnow-tutorial), [Proxyclick](https://docs.microsoft.com/azure/active-directory/active-directory-saas-proxyclick-tutorial), [Riskware](https://docs.microsoft.com/azure/active-directory/active-directory-saas-riskware-tutorial), [Flock](https://docs.microsoft.com/azure/active-directory/active-directory-saas-flock-tutorial), [Reviewsnap](https://docs.microsoft.com/azure/active-directory/active-directory-saas-reviewsnap-tutorial)

For more information about the apps, see [SaaS application integration with Azure Active Directory](https://aka.ms/appstutorial).

For more information about listing your application in the Azure AD app gallery, see [List your application in the Azure Active Directory application gallery](https://docs.microsoft.com/azure/active-directory/develop/active-directory-app-gallery-listing).

---
 
### New step-by-step deployment guides for Azure Active Directory

**Type:** New feature  
**Service category:** Other  
**Product capability:** Directory
 
New, step-by-step guidance about how to deploy Azure Active Directory (Azure AD), including self-service password reset (SSPR), single sign-on (SSO), conditional access (CA), App proxy, User provisioning, Active Directory Federation Services (ADFS) to Pass-through Authentication (PTA), and ADFS to Password hash sync (PHS).

To view the deployment guides, go to the [Identity Deployment Guides](https://aka.ms/DeploymentPlans) repo on GitHub. To provide feedback about the deployment guides, use the [Deployment Plan Feedback form](https://aka.ms/deploymentplanfeedback). If you have any questions about the deployment guides, contact us at [IDGitDeploy](mailto:idgitdeploy@microsoft.com).

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
 
The May release of AADConnect contains a public preview of the integration with PingFederate, important security updates, many bug fixes, and new great new troubleshooting tools. You can find the release notes [here](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-version-history#118190).

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
 
Apps created on or after April 25, 2018 will no longer be able to request an **id_token** using the **query** response_mode.  This brings Azure AD inline with the OIDC specifications and helps reduce your apps attack surface.  Apps created before April 25, 2018 are not blocked from using the **query** response_mode with a response_type of **id_token**.  The error returned, when requesting an id_token from AAD, is **AADSTS70007: ‘query’ is not a supported value of ‘response_mode’ when requesting a token**.

The **fragment** and **form_post** response_modes continue to work - when creating new application objects (for example, for App Proxy usage), ensure use of one of these response_modes before they create a new application.  

---