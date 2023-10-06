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
ms.date: 05/31/2023
ms.author: owinfrey
ms.reviewer: dhanyahk
ms.custom: it-pro, has-azure-ad-ps-ref
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


## September 2023

### Public Preview - Device-bound passkeys as an authentication method

**Type:**  Changed feature            
**Service category:**  Authentications (Logins)                                
**Product capability:**  User Authentication                        

Beginning January 2024, Microsoft Entra ID will support [device-bound passkeys](https://passkeys.dev/docs/reference/terms/#device-bound-passkey) stored on computers and mobile devices as an authentication method in preview, in addition to the existing support for FIDO2 security keys. This enables your users to perform phishing-resistant authentication using the devices that they already have.  


We'll expand the existing FIDO2 authentication methods policy and end user registration experience to support this preview release. If your organization requires or prefers FIDO2 authentication using physical security keys only, then please enforce key restrictions to only allow security key models that you accept in your FIDO2 policy. Otherwise, the new preview capabilities enable your users to register for device-bound passkeys stored on Windows, macOS, iOS, and Android. Learn more about FIDO2 key restrictions [here](../authentication/howto-authentication-passwordless-security-key.md).

---

### General Availability - Recovery of deleted application and service principals is now available

**Type:**  New feature            
**Service category:**  Enterprise Apps                                
**Product capability:**  Identity Lifecycle Management                        

With this release, you can now recover applications along with their original service principals, eliminating the need for extensive reconfiguration and code changes ([Learn more](../manage-apps/delete-recover-faq.yml)). It significantly improves the application recovery story and addresses a long-standing customer need. This change is beneficial to you on:

- **Faster Recovery**: You can now recover their systems in a fraction of the time it used to take, reducing downtime and minimizing disruptions.
- **Cost Savings**: With quicker recovery, you can save on operational costs associated with extended outages and labor-intensive recovery efforts.
- **Preserved Data**: Previously lost data, such as SMAL configurations, is now retained, ensuring a smoother transition back to normal operations.
- **Improved User Experience**: Faster recovery times translate to improved user experience and customer satisfaction, as applications are back up and running swiftly.

---

### Public Preview - New provisioning connectors in the Azure AD Application Gallery - September 2023

**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration    
      

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Datadog](../saas-apps/datadog-provisioning-tutorial.md)
- [Litmos](../saas-apps/litmos-provisioning-tutorial.md)
- [Postman](../saas-apps/postman-provisioning-tutorial.md)
- [Recnice](../saas-apps/recnice-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### General Availability - Web Sign-In for Windows

**Type:** Changed feature              
**Service category:** Authentications (Logins)                                 
**Product capability:** User Authentication    

We're thrilled to announce that as part of the Windows 11 September moment, we're releasing a new Web Sign-In experience that will expand the number of supported scenarios and greatly improve security, reliability, performance, and overall end-to-end experience for our users.

Web Sign-In (WSI) is a credential provider on the Windows lock/sign-in screen for AADJ joined devices that provide a web experience used for authentication and returns an auth token back to the operating system to allow the user to unlock/sign-in to the machine.

Web Sign-In was initially intended to be used for a wide range of auth credential scenarios; however, it was only previously released for limited scenarios such as: [Simplified EDU Web Sign-In](/education/windows/federated-sign-in?tabs=intune) and recovery flows via [Temporary Access Password (TAP)](../authentication/howto-authentication-temporary-access-pass.md).

The underlying provider for Web Sign-In has been re-written from the ground up with security and improved performance in mind. This release moves the Web Sign-in infrastructure from the Cloud Host Experience (CHX) WebApp to a newly written Login Web Host (LWH) for the September moment. This release provides better security and reliability to support previous EDU & TAP experiences and new workflows enabling using various Auth Methods to unlock/login to the desktop.                    

---

### General Availability - Support for Microsoft admin portals in Conditional Access

**Type:** New feature             
**Service category:** Conditional Access                                   
**Product capability:** Identity Security & Protection    

When a Conditional Access policy targets the Microsoft Admin Portals cloud app, the policy is enforced for tokens issued to application IDs of the following Microsoft administrative portals:

- Azure portal
- Exchange admin center
- Microsoft 365 admin center
- Microsoft 365 Defender portal
- Microsoft Entra admin center
- Microsoft Intune admin center
- Microsoft Purview compliance portal                   

For more information, see: [Microsoft Admin Portals (preview)](../conditional-access/concept-conditional-access-cloud-apps.md#microsoft-admin-portals-preview).

---

## August 2023

### General Availability - Tenant Restrictions V2

**Type:** New feature         
**Service category:** Authentications (Logins)                              
**Product capability:** Identity Security & Protection                    

**Tenant Restrictions V2 (TRv2)** is now generally available for authentication plane via proxy.  

TRv2 allows organizations to enable safe and productive cross-company collaboration while containing data exfiltration risk. With TRv2, you can control what external tenants your users can access from your devices or network using externally issued identities and provide granular access control on a per org, user, group, and application basis.    

TRv2 uses the cross-tenant access policy, and offers both authentication and data plane protection. It enforces policies during user authentication, and on data plane access with Exchange Online, SharePoint Online, Teams, and MSGraph.  While the data plane support with Windows GPO and Global Secure Access is still in public preview, authentication plane support with proxy is now generally available. 

Visit https://aka.ms/tenant-restrictions-enforcement for more information on tenant restriction V2 and Global Secure Access client-side tagging for TRv2 at [Universal tenant restrictions](/azure/global-secure-access/how-to-universal-tenant-restrictions).   

---

### Public Preview - Cross-tenant access settings supports custom RBAC roles and protected actions

**Type:** New feature         
**Service category:** B2B                               
**Product capability:** B2B/B2C                    

Cross-tenant access settings can be managed with custom roles defined by your organization. This enables you to define your own finely-scoped roles to manage cross-tenant access settings instead of using one of the built-in roles for management. [Learn more about creating your own custom roles](../external-identities/cross-tenant-access-overview.md#custom-roles-for-managing-cross-tenant-access-settings).

You can also now protect privileged actions inside of cross-tenant access settings using Conditional Access. For example, you can require MFA before allowing changes to default settings for B2B collaboration. Learn more about [Protected actions](../roles/protected-actions-overview.md).

---

### General Availability - Additional settings in Entitlement Management auto-assignment policy
 
**Type:** Changed feature    
**Service category**: Entitlement Management    
**Product capability:** Entitlement Management    

In the Entra ID Governance entitlement management auto-assignment policy, there are three new settings. This allows a customer to select to not have the policy create assignments, not remove assignments, and to delay assignment removal.

---

### Public Preview - Setting for guest losing access

**Type:** Changed feature          
**Service category:** Entitlement Management                             
**Product capability:** Entitlement Management                    

An administrator can configure that when a guest brought in through entitlement management has lost their last access package assignment, they're deleted after a specified number of days. For more information, see: [Govern access for external users in entitlement management](../governance/entitlement-management-external-users.md).

---

### Public Preview - Real-Time Strict Location Enforcement

**Type:** New feature         
**Service category:** Continuous Access Evaluation                              
**Product capability:** Access Control                    

Strictly enforce Conditional Access policies in real-time using Continuous Access Evaluation.  Enable services like Microsoft Graph, Exchange Online, and SharePoint Online to block access requests from disallowed locations as part of a layered defense against token replay and other unauthorized access. For more information, see blog: [Public Preview: Strictly Enforce Location Policies with Continuous Access Evaluation](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/public-preview-strictly-enforce-location-policies-with/ba-p/3773133) and documentation:
[Strictly enforce location policies using continuous access evaluation (preview)](../conditional-access/concept-continuous-access-evaluation-strict-enforcement.md).

---

### Public Preview - New provisioning connectors in the Azure AD Application Gallery - August 2023

**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration    
      

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Airbase](../saas-apps/airbase-provisioning-tutorial.md)
- [Airtable](../saas-apps/airtable-provisioning-tutorial.md)
- [Cleanmail Swiss](../saas-apps/cleanmail-swiss-provisioning-tutorial.md)
- [Informacast](../saas-apps/informacast-provisioning-tutorial.md)
- [Kintone](../saas-apps/kintone-provisioning-tutorial.md)
- [O'reilly learning platform](../saas-apps/oreilly-learning-platform-provisioning-tutorial.md)
- [Tailscale](../saas-apps/tailscale-provisioning-tutorial.md)
- [Tanium SSO](../saas-apps/tanium-sso-provisioning-tutorial.md)
- [Vbrick Rev Cloud](../saas-apps/vbrick-rev-cloud-provisioning-tutorial.md)
- [Xledger](../saas-apps/xledger-provisioning-tutorial.md)


For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

### General Availability - Continuous Access Evaluation for Workload Identities available in Public and Gov clouds

**Type:** New feature         
**Service category:** Continuous Access Evaluation                              
**Product capability:** Identity Security & Protection                    

Real-time enforcement of risk events, revocation events, and Conditional Access location policies is now generally available for workload identities.
Service principals on line of business (LOB) applications are now protected on access requests to Microsoft Graph. For more information, see: [Continuous access evaluation for workload identities (preview)](../conditional-access/concept-continuous-access-evaluation-workload.md).

---

## July 2023

### General Availability: Azure Active Directory (Azure AD) is being renamed.

**Type:** Changed feature       
**Service category:**  N/A                          
**Product capability:** End User Experiences                

**No action is required from you, but you may need to update some of your own documentation.**

Azure AD is being renamed to Microsoft Entra ID. The name change rolls out across all Microsoft products and experiences throughout the second half of 2023. 

Capabilities, licensing, and usage of the product isn't changing. To make the transition seamless for you, the pricing, terms, service level agreements, URLs, APIs, PowerShell cmdlets, Microsoft Authentication Library (MSAL) and developer tooling remain the same.   

Learn more and get renaming details: [New name for Azure Active Directory](../fundamentals/new-name.md).

---

### General Availability - Include/exclude My Apps in Conditional Access policies

**Type:** Fixed       
**Service category:** Conditional Access                            
**Product capability:** End User Experiences                  

My Apps can now be targeted in Conditional Access policies. This solves a top customer blocker. The functionality is available in all clouds. GA also brings a new app launcher, which improves app launch performance for both SAML and other app types. 

Learn More about setting up Conditional Access policies here: [Azure AD Conditional Access documentation](../conditional-access/index.yml).

---

### General Availability - Conditional Access for Protected Actions

**Type:** New feature         
**Service category:** Conditional Access                            
**Product capability:** Identity Security & Protection                    

Protected actions are high-risk operations, such as altering access policies or changing trust settings, that can significantly impact an organization's security. To add an extra layer of protection, Conditional Access for Protected Actions lets organizations define specific conditions for users to perform these sensitive tasks. For more information, see: [What are protected actions in Azure AD?](../roles/protected-actions-overview.md).

---

### General Availability - Access Reviews for Inactive Users

**Type:** New feature         
**Service category:** Access Reviews                            
**Product capability:** Identity Governance                      

This new feature, part of the Microsoft Entra ID Governance SKU, allows admins to review and address stale accounts that haven’t been active for a specified period. Admins can set a specific duration to determine inactive accounts that weren't used for either interactive or non-interactive sign-in activities. As part of the review process, stale accounts can automatically be removed. For more information, see: [Microsoft Entra ID Governance Introduces Two New Features in Access Reviews](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-id-governance-introduces-two-new-features-in/ba-p/2466930).

---

### General Availability - Automatic assignments to access packages in Microsoft Entra ID Governance

**Type:** Changed feature       
**Service category:** Entitlement Management                          
**Product capability:** Entitlement Management                

Microsoft Entra ID Governance includes the ability for a customer to configure an assignment policy in an entitlement management access package that includes an attribute-based rule, similar to dynamic groups, of the users who should be assigned access. For more information, see: [Configure an automatic assignment policy for an access package in entitlement management](../governance/entitlement-management-access-package-auto-assignment-policy.md).

---

### General Availability - Custom Extensions in Entitlement Management 

**Type:** New feature       
**Service category:** Entitlement Management                          
**Product capability:** Entitlement Management                

Custom extensions in Entitlement Management are now generally available, and allow you to extend the access lifecycle with your organization-specific processes and business logic when access is requested or about to expire. With custom extensions you can create tickets for manual access provisioning in disconnected systems, send custom notifications to additional stakeholders, or automate additional access-related configuration in your business applications such as assigning the correct sales region in Salesforce. You can also leverage custom extensions to embed external governance, risk, and compliance (GRC) checks in the access request.

For more information, see:

- [Microsoft Entra ID Governance Entitlement Management New Generally Available Capabilities](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-id-governance-entitlement-management-new/ba-p/2466929)
- [Trigger Logic Apps with custom extensions in entitlement management](../governance/entitlement-management-logic-apps-integration.md)

---

### General Availability - Conditional Access templates

**Type:** Plan for change         
**Service category:** Conditional Access                             
**Product capability:** Identity Security & Protection                  

Conditional Access templates are predefined set of conditions and controls that provide a convenient method to deploy new policies aligned with Microsoft recommendations. Customers are assured that their policies reflect modern best practices for securing corporate assets, promoting secure, optimal access for their hybrid workforce. For more information, see: [Conditional Access templates](../conditional-access/concept-conditional-access-policy-common.md).

---

### General Availability - Lifecycle Workflows

**Type:** New feature       
**Service category:** Lifecycle Workflows                            
**Product capability:** Identity Governance                  

User identity lifecycle is a critical part of an organization’s security posture, and when managed correctly, can have a positive impact on their users’ productivity for Joiners, Movers, and Leavers. The ongoing digital transformation is accelerating the need for good identity lifecycle management. However, IT and security teams face enormous challenges managing the complex, time-consuming, and error-prone manual processes necessary to execute the required onboarding and offboarding tasks for hundreds of employees at once. This is an ever present and complex issue IT admins continue to face with digital transformation across security, governance, and compliance.

Lifecycle Workflows, one of our newest Microsoft Entra ID Governance capabilities is now generally available to help organizations further optimize their user identity lifecycle. For more information, see: [Lifecycle Workflows is now generally available!](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/lifecycle-workflows-is-now-generally-available/ba-p/2466931)

---

### General Availability - Enabling extended customization capabilities for sign-in and sign-up pages in Company Branding capabilities.

**Type:** New feature       
**Service category:** User Experience and Management                            
**Product capability:** User Authentication                

Update the Microsoft Entra ID and Microsoft 365 sign in experience with new Company Branding capabilities. You can apply your company’s brand guidance to authentication experiences with predefined templates. For more information, see: [Company Branding](../fundamentals/how-to-customize-branding.md) 

---

### General Availability - Enabling customization capabilities for the Self-Service Password Reset (SSPR) hyperlinks, footer hyperlinks and browser icons in Company Branding.

**Type:** Changed feature       
**Service category:** User Experience and Management                            
**Product capability:** End User Experiences                  

Update the Company Branding functionality on the Microsoft Entra ID/Microsoft 365 sign in experience to allow customizing Self Service Password Reset (SSPR) hyperlinks, footer hyperlinks, and a browser icon. For more information, see: [Company Branding](../fundamentals/how-to-customize-branding.md) 

---

### General Availability - User-to-Group Affiliation recommendation for group Access Reviews

**Type:** New feature       
**Service category:** Access Reviews                            
**Product capability:** Identity Governance                  

This feature provides Machine Learning based recommendations to the reviewers of Azure AD Access Reviews to make the review experience easier and more accurate. The recommendation leverages machine learning based scoring mechanism and compares users’ relative affiliation with other users in the group, based on the organization’s reporting structure. For more information, see:  [Review recommendations for Access reviews](../governance/review-recommendations-access-reviews.md) and [Introducing Machine Learning based recommendations in Azure AD Access reviews](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/introducing-machine-learning-based-recommendations-in-azure-ad/ba-p/2466923)

---

### Public Preview - Inactive guest insights

**Type:** New feature       
**Service category:** Reporting                            
**Product capability:** Identity Governance                  

Monitor guest accounts at scale with intelligent insights into inactive guest users in your organization. Customize the inactivity threshold depending on your organization’s needs, narrow down the scope of guest users you want to monitor and identify the guest users that may be inactive. For more information, see: [Monitor and clean up stale guest accounts using access reviews](../enterprise-users/clean-up-stale-guest-accounts.md).

---

### Public Preview - Just-in-time application access with PIM for Groups

**Type:** New feature       
**Service category:** Privileged Identity Management                            
**Product capability:** Privileged Identity Management                  

You can minimize the number of persistent administrators in applications such as [AWS](../saas-apps/aws-single-sign-on-provisioning-tutorial.md#just-in-time-jit-application-access-with-pim-for-groups-preview)/[GCP](../saas-apps/g-suite-provisioning-tutorial.md#just-in-time-jit-application-access-with-pim-for-groups-preview) and get JIT access to groups in AWS and GCP. While PIM for Groups is publicly available, we’ve released a public preview that integrates PIM with provisioning and reduces the activation delay from 40+ minutes to 1 – 2 minutes.

---

### Public Preview - Graph beta API for PIM security alerts on Azure AD roles

**Type:** New feature       
**Service category:** Privileged Identity Management                            
**Product capability:** Privileged Identity Management                 

Announcing API support (beta) for managing PIM security alerts for Azure AD roles. [Azure Privileged Identity Management (PIM)](../privileged-identity-management/index.yml) generates alerts when there's suspicious or unsafe activity in your organization in Azure Active Directory (Azure AD), part of Microsoft Entra. You can now manage these alerts using REST APIs. These alerts can also be [managed through the Azure portal](../privileged-identity-management/pim-resource-roles-configure-alerts.md). For more information, see:  [unifiedRoleManagementAlert resource type](/graph/api/resources/unifiedrolemanagementalert).

---

### General Availability - Reset Password on Azure Mobile App

**Type:** New feature       
**Service category:** Other                            
**Product capability:** End User Experiences                

The Azure mobile app has been enhanced to empower admins with specific permissions to conveniently reset their users' passwords. Self Service Password Reset will not be supported at this time. However, users can still more efficiently control and streamline their own sign-in and auth methods. The mobile app can be downloaded for each platform here:

- Android: https://aka.ms/AzureAndroidWhatsNew
- IOS: https://aka.ms/ReferAzureIOSWhatsNew

---

### Public Preview - API-driven inbound user provisioning 

**Type:** New feature       
**Service category:** Provisioning                              
**Product capability:** Inbound to Azure AD                  

With API-driven inbound provisioning, Microsoft Entra ID provisioning service now supports integration with any system of record. Customers and partners can use any automation tool of their choice to retrieve workforce data from any system of record for provisioning into Entra ID and connected on-premises Active Directory domains. The IT admin has full control on how the data is processed and transformed with attribute mappings. Once the workforce data is available in Entra ID, the IT admin can configure appropriate joiner-mover-leaver business processes using Entra ID Governance Lifecycle Workflows. For more information, see: [API-driven inbound provisioning concepts (Public preview)](../app-provisioning/inbound-provisioning-api-concepts.md).

---

### Public Preview - Dynamic Groups based on EmployeeHireDate User attribute

**Type:** New feature       
**Service category:** Group Management                                
**Product capability:** Directory                    

This feature enables admins to create dynamic group rules based on the user objects' employeeHireDate attribute. For more information, see: [Properties of type string](../enterprise-users/groups-dynamic-membership.md#properties-of-type-string).

---

### General Availability - Enhanced Create User and Invite User Experiences

**Type:** Changed feature       
**Service category:** User Management                                  
**Product capability:** User Management                      

We have increased the number of properties admins are able to define when creating and inviting a user in the Entra admin portal, bringing our UX to parity with our Create User APIs. Additionally, admins can now add users to a group or administrative unit, and assign roles. For more information, see: [Add or delete users using Azure Active Directory](./add-users.md).

---

### General Availability - All Users and User Profile

**Type:** Changed feature       
**Service category:** User Management                                  
**Product capability:** User Management                   

The All Users list now features an infinite scroll, and admins can now modify more properties in the User Profile. For more information, see: [How to create, invite, and delete users](../fundamentals/how-to-create-delete-users.md).

---

### Public Preview - Windows MAM

**Type:** New feature       
**Service category:** Conditional Access                                
**Product capability:** Identity Security & Protection                    

“*When will you have MAM for Windows?*” is one of our most frequently asked customer questions. We’re happy to report that the answer is: “Now!” We’re excited to offer this new and long-awaited MAM Conditional Access capability in Public Preview for Microsoft Edge for Business on Windows.

Using MAM Conditional Access, Microsoft Edge for Business provides users with secure access to organizational data on personal Windows devices with a customizable user experience. We’ve combined the familiar security features of app protection policies (APP), Windows Defender client threat defense, and Conditional Access, all anchored to Azure AD identity to ensure un-managed devices are healthy and protected before granting data access. This can help businesses to improve their security posture and protect sensitive data from unauthorized access, without requiring full mobile device enrollment.

The new capability extends the benefits of app layer management to the Windows platform via Microsoft Edge for Business. Admins are empowered to configure the user experience and protect organizational data within Microsoft Edge for Business on un-managed Windows devices.

For more information, see: [Require an app protection policy on Windows devices (preview)](../conditional-access/how-to-app-protection-policy-windows.md).

---

### General Availability - New Federated Apps available in Azure AD Application gallery - July 2023

**Type:** New feature   
**Service category:** Enterprise Apps                
**Product capability:** 3rd Party Integration          

In July 2023 we've added the following 10 new applications in our App gallery with Federation support:    

[Gainsight SAML](../saas-apps/gainsight-saml-tutorial.md), [Dataddo](https://www.dataddo.com/), [Puzzel](https://www.puzzel.com/), [Worthix App](../saas-apps/worthix-app-tutorial.md), [iOps360 IdConnect](https://iops360.com/iops360-id-connect-azuread-single-sign-on/), [Airbase](../saas-apps/airbase-tutorial.md), [Couchbase Capella - SSO](../saas-apps/couchbase-capella-sso-tutorial.md), [SSO for Jama Connect®](../saas-apps/sso-for-jama-connect-tutorial.md), [mediment (メディメント)](https://mediment.jp/), [Netskope Cloud Exchange Administration Console](../saas-apps/netskope-cloud-exchange-administration-console-tutorial.md), [Uber](../saas-apps/uber-tutorial.md), [Plenda](https://app.plenda.nl/), [Deem Mobile](../saas-apps/deem-mobile-tutorial.md), [40SEAS](https://www.40seas.com/), [Vivantio](https://www.vivantio.com/), [AppTweak](https://www.apptweak.com/), [Vbrick Rev Cloud](../saas-apps/vbrick-rev-cloud-tutorial.md), [OptiTurn](../saas-apps/optiturn-tutorial.md), [Application Experience with Mist](https://www.mist.com/), [クラウド勤怠管理システムKING OF TIME](../saas-apps/cloud-attendance-management-system-king-of-time-tutorial.md), [Connect1](../saas-apps/connect1-tutorial.md), [DB Education Portal for Schools](../saas-apps/db-education-portal-for-schools-tutorial.md), [SURFconext](../saas-apps/surfconext-tutorial.md), [Chengliye Smart SMS Platform](../saas-apps/chengliye-smart-sms-platform-tutorial.md), [CivicEye SSO](../saas-apps/civic-eye-sso-tutorial.md), [Colloquial](../saas-apps/colloquial-tutorial.md), [BigPanda](../saas-apps/bigpanda-tutorial.md), [Foreman](https://foreman.mn/)

You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial.

For listing your application in the Azure AD app gallery, read the details here https://aka.ms/AzureADAppRequest

---

### Public Preview - New provisioning connectors in the Azure AD Application Gallery - July 2023

**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration    
      

We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Albert](../saas-apps/albert-provisioning-tutorial.md)
- [Rhombus Systems](../saas-apps/rhombus-systems-provisioning-tutorial.md)
- [Axiad Cloud](../saas-apps/axiad-cloud-provisioning-tutorial.md)
- [Dagster Cloud](../saas-apps/dagster-cloud-provisioning-tutorial.md)
- [WATS](../saas-apps/wats-provisioning-tutorial.md)
- [Funnel Leasing](../saas-apps/funnel-leasing-provisioning-tutorial.md)


For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

### General Availability - Microsoft Authentication Library for .NET 4.55.0

**Type:** New feature       
**Service category:** Other                                    
**Product capability:** User Authentication                     

Earlier this month we announced the release of [MSAL.NET 4.55.0](https://www.nuget.org/packages/Microsoft.Identity.Client/4.55.0), the latest version of the [Microsoft Authentication Library for the .NET platform](/entra/msal/dotnet/). The new version introduces support for user-assigned [managed identity](/entra/msal/dotnet/advanced/managed-identity) being specified through object IDs, CIAM authorities in the `WithTenantId` API, better error messages when dealing with cache serialization, and improved logging when using the [Windows authentication broker](/entra/msal/dotnet/acquiring-tokens/desktop-mobile/wam).

---

### General Availability - Microsoft Authentication Library for Python 1.23.0

**Type:** New feature       
**Service category:** Other                                    
**Product capability:** User Authentication                  

Earlier this month, the Microsoft Authentication Library team announced the release of [MSAL for Python version 1.23.0](https://pypi.org/project/msal/1.23.0/). The new version of the library adds support for better caching when using client credentials, eliminating the need to request new tokens repeatedly when cached tokens exist.

To learn more about MSAL for Python, see: [Microsoft Authentication Library (MSAL) for Python](/entra/msal/python/).

---

## June 2023

### Public Preview - New provisioning connectors in the Azure AD Application Gallery - June 2023

**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration    
      
We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Headspace](../saas-apps/headspace-provisioning-tutorial.md)
- [Humbol](../saas-apps/humbol-provisioning-tutorial.md)
- [LUSID](../saas-apps/lusid-provisioning-tutorial.md)
- [Markit Procurement Service](../saas-apps/markit-procurement-service-provisioning-tutorial.md)
- [Moqups](../saas-apps/moqups-provisioning-tutorial.md)
- [Notion](../saas-apps/notion-provisioning-tutorial.md)
- [OpenForms](../saas-apps/openforms-provisioning-tutorial.md)
- [SafeGuard Cyber](../saas-apps/safeguard-cyber-provisioning-tutorial.md)
- [Uni-tel A/S](../saas-apps/uni-tel-as-provisioning-tutorial.md)
- [Vault Platform](../saas-apps/vault-platform-provisioning-tutorial.md)
- [V-Client](../saas-apps/v-client-provisioning-tutorial.md)
- [Veritas Enterprise Vault.cloud SSO-SCIM](../saas-apps/veritas-provisioning-tutorial.md)

For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).

---

### General Availability - Include/exclude Entitlement Management in Conditional Access policies

**Type:** New feature       
**Service category:** Entitlement Management                          
**Product capability:** Entitlement Management                

The Entitlement Management service can now be targeted in the Conditional Access policy for inclusion or exclusion of applications. To target the Entitlement Management service, select “Azure AD Identity Governance - Entitlement Management” in the cloud apps picker. The Entitlement Management app includes the entitlement management part of My Access, the Entitlement Management part of the Entra and Azure portals, and the Entitlement Management part of MS Graph. For more information, see:  [Review your Conditional Access policies](../governance/entitlement-management-external-users.md#review-your-conditional-access-policies).

---

### General Availability - Azure Active Directory User and Group capabilities on Azure Mobile are now available

**Type:** New feature       
**Service category:** Azure Mobile App                             
**Product capability:** End User Experiences                  

The Azure Mobile app now includes a section for Azure Active Directory. Within Azure Active Directory on mobile, user can search for and view more details about user and groups. Additionally, permitted users can invite guest users to their active tenant, assign group memberships and ownerships for users, and view user sign-in logs. For more information, see: [Get the Azure mobile app](https://azure.microsoft.com/get-started/azure-portal/mobile-app/).

---

### Plan for change - Modernizing Terms of Use Experiences

**Type:** Plan for change         
**Service category:** Terms of Use                               
**Product capability:** AuthZ/Access Delegation                   

Recently we announced the modernization of terms of use end-user experiences as part of ongoing service improvements. As previously communicated the end user experiences will be updated with a new PDF viewer and are moving from https://account.activedirectory.windowsazure.com to https://myaccount.microsoft.com. 

Starting today the modernized experience for viewing previously accepted terms of use is available via https://myaccount.microsoft.com/termsofuse/myacceptances. We encourage you to check out the modernized experience, which follows the same updated design pattern as the upcoming modernization of accepting or declining terms of use as part of the sign-in flow. We would appreciate your [feedback](https://forms.microsoft.com/r/NV0msbrqtF) before we begin to modernize the sign-in flow.

---

### General Availability - Privileged Identity Management for Groups

**Type:** New feature       
**Service category:** Privileged Identity Management                               
**Product capability:** Privileged Identity Management                 

Privileged Identity Management for Groups is now generally available. With this feature, you have the ability to grant users just-in-time membership in a group, which in turn provides access to Azure Active Directory roles, Azure roles, Azure SQL, Azure Key Vault, Intune, other application roles, and third-party applications. Through one activation, you can conveniently assign a combination of permissions across different applications and RBAC systems.

PIM for Groups offers can also be used for just-in-time ownership. As the owner of the group, you can manage group properties, including membership. For more information, see: [Privileged Identity Management (PIM) for Groups](../privileged-identity-management/concept-pim-for-groups.md).

---

### General Availability - Privileged Identity Management and Conditional Access integration 

**Type:** New feature       
**Service category:** Privileged Identity Management                               
**Product capability:** Privileged Identity Management                    

The Privileged Identity Management (PIM) integration with Conditional Access authentication context is generally available. You can require users to meet various requirements during role activation such as:

- Have specific authentication method through [Authentication Strengths](../authentication/concept-authentication-strengths.md)
- Activate from a compliant device 
- Validate location based on GPS
- Not have certain level of sign-in risk identified with Identity Protection
- Meet other requirements defined in Conditional Access policies

The integration is available for all providers: PIM for Azure AD roles, PIM for Azure resources, PIM for groups. For more information, see:
- [Configure Azure AD role settings in Privileged Identity Management](../privileged-identity-management/pim-how-to-change-default-settings.md)
- [Configure Azure resource role settings in Privileged Identity Management](../privileged-identity-management/pim-resource-roles-configure-role-settings.md)
- [Configure PIM for Groups settings](../privileged-identity-management/groups-role-settings.md)

---

### General Availability - Updated look and feel for Per-user MFA

**Type:** Plan for change    
**Service category:** MFA                       
**Product capability:** Identity Security & Protection              

As part of ongoing service improvements, we're making updates to the per-user MFA admin configuration experience to align with the look and feel of Azure. This change doesn't include any changes to the core functionality and will only include visual improvements. For more information, see: [Enable per-user Azure AD Multi-Factor Authentication to secure sign-in events](../authentication/howto-mfa-userstates.md).

---

### General Availability - Converged Authentication Methods in US Gov cloud

**Type:** New feature   
**Service category:** MFA                      
**Product capability:** User Authentication              

The Converged Authentication Methods Policy enables you to manage all authentication methods used for MFA and SSPR in one policy, migrate off the legacy MFA and SSPR policies, and target authentication methods to groups of users instead of enabling them for all users in the tenant. Customers should migrate management of authentication methods off the legacy MFA and SSPR policies before September 30, 2024. For more information, see: [Manage authentication methods for Azure AD](../authentication/concept-authentication-methods-manage.md).

---

### General Availability - Support for Directory Extensions using Azure AD Cloud Sync

**Type:** New feature   
**Service category:** Provisioning                        
**Product capability:** Azure Active Directory Connect Cloud Sync                

Hybrid IT Admins can now sync both Active Directory and Azure AD Directory Extensions using Azure AD Cloud Sync. This new capability adds the ability to dynamically discover the schema for both Active Directory and Azure Active Directory, thereby, allowing customers to map the needed attributes using Cloud Sync's attribute mapping experience. For more information, see: [Cloud Sync directory extensions and custom attribute mapping](../hybrid/cloud-sync/custom-attribute-mapping.md).

---

### Public Preview - Restricted Management Administrative Units

**Type:** New feature   
**Service category:** Directory Management                        
**Product capability:** Access Control               

Restricted Management Administrative Units allow you to restrict modification of users, security groups, and device in Azure AD so that only designated administrators can make changes.  Global Administrators and other tenant-level administrators can't modify the users, security groups, or devices that are added to a restricted management admin unit. For more information, see: [Restricted management administrative units in Azure Active Directory (Preview)](../roles/admin-units-restricted-management.md).

---

### General Availability - Report suspicious activity integrated with Identity Protection

**Type:** Changed feature   
**Service category:** Identity Protection                        
**Product capability:** Identity Security & Protection              

Report suspicious activity is an updated implementation of the MFA fraud alert, where users can report a voice or phone app MFA prompt as suspicious. If enabled, users reporting prompts have their user risk set to high, enabling admins to use Identity Protection risk based policies or risk detection APIs to take remediation actions.  Report suspicious activity operates in parallel with the legacy MFA fraud alert at this time. For more information, see: [Configure Azure AD Multi-Factor Authentication settings](../authentication/howto-mfa-mfasettings.md).

---

## May 2023

### General Availability - Conditional Access authentication strength for members, external users and FIDO2 restrictions

**Type:** New feature   
**Service category:** Conditional Access                      
**Product capability:** Identity Security & Protection              

Authentication strength is a Conditional Access control that allows administrators to specify which combination of authentication methods can be used to access a resource. For example, they can make only phishing-resistant authentication methods available to access a sensitive resource. Likewise, to access a nonsensitive resource, they can allow less secure multifactor authentication (MFA) combinations such as password + SMS.

Authentication strength is now in General Availability for members and external users from any Microsoft cloud and FIDO2 restrictions. For more information, see: [Conditional Access authentication strength](../authentication/concept-authentication-strengths.md).

---

### General Availability - SAML/Ws-Fed based identity provider authentication for Azure Active Directory B2B users in US Sec and US Nat clouds

**Type:** New feature   
**Service category:** B2B                        
**Product capability:** B2B/B2C             

SAML/Ws-Fed based identity providers for authentication in Azure AD B2B are generally available in US Sec, US Nat and China clouds. For more information, see: [Federation with SAML/WS-Fed identity providers for guest users](../external-identities/direct-federation.md).

---

### Generally Availability - Cross-tenant synchronization

**Type:** New feature   
**Service category:** Provisioning                          
**Product capability:** Identity Lifecycle Management              

Cross-tenant synchronization allows you to set up a scalable and automated solution for users to access applications across tenants in your organization. It builds upon the Azure Active Directory B2B functionality and automates creating, updating, and deleting B2B users within tenants in your organization. For more information, see: [What is cross-tenant synchronization?](../multi-tenant-organizations/cross-tenant-synchronization-overview.md).

---

### Public Preview(Refresh) - Custom Extensions in Entitlement Management

**Type:** New feature   
**Service category:** Entitlement management                          
**Product capability:** Identity Governance                

Last year we announced the [public preview of custom extensions in Entitlement Management](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/run-custom-workflows-in-azure-ad-entitlement-management/ba-p/2466938) allowing you to automate complex processes when access is requested or about to expire. We have recently expanded the public preview to allow for the access package assignment request to be paused while your external process is running. In addition, the external process can now provide feedback to Entitlement Management to either surface additional information to end users in MyAccess or even stop the access request. This expands the scenarios of custom extension from notifications to additional stakeholders or the generation of tickets to advanced scenarios such as external governance, risk and compliance checks. In the course of this update, we have also improved the audit logs, token security and the payload sent to the Logic App. To learn more about the preview refresh, see:

-  [Trigger Logic Apps with custom extensions in entitlement management (Preview)](../governance/entitlement-management-logic-apps-integration.md)
- [accessPackageAssignmentRequest: resume](/graph/api/accesspackageassignmentrequest-resume)
- [accessPackageAssignmentWorkflowExtension resource type](/graph/api/resources/accesspackageassignmentworkflowextension)
- [accessPackageAssignmentRequestWorkflowExtension resource type](/graph/api/resources/accesspackageassignmentrequestworkflowextension)

---

### General Availability - Managed Identity in Microsoft Authentication Library for .NET

**Type:** New feature   
**Service category:** Authentications (Logins)                            
**Product capability:** User Authentication               

The latest version of MSAL.NET graduates the Managed Identity APIs into the General Availability mode of support, which means that developers can integrate them safely in production workloads.

Managed identities are a part of the Azure infrastructure, simplifying how developers handle credentials and secrets to access cloud resources. With Managed Identities, developers don't need to manually handle credential retrieval and security. Instead, they can rely on an automatically managed set of identities to connect to resources that support Azure Active Directory authentication. You can learn more in [What are managed identities for Azure resources?](../managed-identities-azure-resources/overview.md)

With MSAL.NET 4.54.0, the Managed Identity APIs are now stable. There are a few changes that we added that make them easier to use and integrate that might require tweaking your code if you’ve used our [experimental implementation](https://den.dev/blog/managed-identity-msal-net/):

- When using Managed Identity APIs, developers need to specify the identity type when creating an [ManagedIdentityApplication](/dotnet/api/microsoft.identity.client.managedidentityapplication).
- When acquiring tokens with Managed Identity APIs and using the default HTTP client, MSAL retries the request for certain exception codes.
- We added a new [MsalManagedIdentityException](/dotnet/api/microsoft.identity.client.msalmanagedidentityexception) class that represents any Managed Identity-related exceptions. It includes general exception information, including the Azure source from which the exception originates.
- MSAL will now proactively refresh tokens acquired with Managed Identity.

To get started with Managed Identity in MSAL.NET, you can use the [Microsoft.Identity.Client](/dotnet/api/microsoft.identity.client) package together with the [ManagedIdentityApplicationBuilder](/dotnet/api/microsoft.identity.client.managedidentityapplicationbuilder) class.

---

### Public Preview - New My Groups Experience

**Type:** Changed feature   
**Service category:** Group Management                          
**Product capability:** End User Experiences              

A new and improved My Groups experience is now available at [myaccount.microsoft.com/groups](https://myaccount.microsoft.com/groups). This experience replaces the existing My Groups experience at mygroups.microsoft.com in May.   For more information, see: [Update your Groups info in the My Apps portal](https://support.microsoft.com/account-billing/update-your-groups-info-in-the-my-apps-portal-bc0ca998-6d3a-42ac-acb8-e900fb1174a4).

---

### General Availability - Admins can restrict their users from creating tenants

**Type:** New feature   
**Service category:** User Access Management                           
**Product capability:** User Management               

The ability for users to create tenants from the Manage Tenant overview has been present in Azure AD since almost the beginning of the Azure portal.  This new capability in the User Settings pane allows admins to restrict their users from being able to create new tenants. There's also a new [Tenant Creator](../roles/permissions-reference.md#tenant-creator) role to allow specific users to create tenants. For more information, see [Default user permissions](../fundamentals/users-default-permissions.md#restrict-member-users-default-permissions).

---

### General Availability - Devices Self-Help Capability for Pending Devices



**Type:** New feature   
**Service category:** Device Access Management                
**Product capability:** End User Experiences          

In the **All Devices** view under the Registered column, you can now select any pending devices you have, and it opens a context pane to help troubleshoot why a device may be pending. You can also offer feedback on if the summarized information is helpful or not. For more information, see: [Pending devices in Azure Active Directory](/troubleshoot/azure/active-directory/pending-devices).


---

### General Availability - Admins can now restrict users from self-service accessing their BitLocker keys



**Type:** New feature   
**Service category:** Device Access Management                
**Product capability:** User Management            

Admins can now restrict their users from self-service accessing their BitLocker keys through the Devices Settings page. Turning on this capability hides the BitLocker key(s) of all non-admin users. This helps to control BitLocker access management at the admin level. For more information, see: [Restrict member users' default permissions](users-default-permissions.md#restrict-member-users-default-permissions).


---

### Public Preview - New provisioning connectors in the Azure AD Application Gallery - May 2023

**Type:** New feature   
**Service category:** App Provisioning               
**Product capability:** 3rd Party Integration    
      
We've added the following new applications in our App gallery with Provisioning support. You can now automate creating, updating, and deleting of user accounts for these newly integrated apps:

- [Sign In Enterprise Host Provisioning](../saas-apps/sign-in-enterprise-host-provisioning-tutorial.md)


For more information about how to better secure your organization by using automated user account provisioning, see: [Automate user provisioning to SaaS applications with Azure AD](../app-provisioning/user-provisioning.md).


---

### General Availability -  Microsoft Entra Permissions Management Azure Active Directory Insights

**Type:** New feature   
**Service category:** Other                               
**Product capability:** Permissions Management                 

The Azure Active Directory Insights tab in Microsoft Entra Permissions Management provides a view of all permanent role assignments assigned to Global Administrators, and a curated list of highly privileged roles. Administrators can then use the report to take further action within the Azure Active Directory console. For more information, see [View privileged role assignments in your organization (Preview)](../cloud-infrastructure-entitlement-management/product-privileged-role-insights.md).

---

### Public Preview - In portal guide to configure multi-factor authentication

**Type:** New feature   
**Service category:** MFA                           
**Product capability:** Identity Security & Protection              

The in portal guide to configure multi-factor authentication helps you get started with Azure Active Directory's MFA capabilities. You can find this guide under the Tutorials tab in the Azure AD Overview. For more information, see: [Configure multi-factor authentication using the portal guide](../authentication/multi-factor-authentication-wizard.md).

---

### General Availability - Authenticator Lite (In Outlook)

**Type:** New feature   
**Service category:** Microsoft Authenticator App                           
**Product capability:** User Authentication                

Authenticator Lite (in Outlook) is an authentication solution for users that haven't yet downloaded the Microsoft Authenticator app. Users are prompted in Outlook on their mobile device to register for multi-factor authentication. After they enter their password at sign-in, they'll have the option to send a push notification to their Android or iOS device.

Due to the security enhancement this feature provides users, the Microsoft managed value of this feature will be changed from ‘*disabled*’ to ‘*enabled*’ on June 9. We’ve made some changes to the feature configuration, so if you made an update before GA, May 17, please validate that the feature is in the correct state for your tenant prior to June 9. If you don't wish for this feature to be enabled on June 9, move the state to ‘*disabled*’, or set users to include and exclude groups.  


For more information, see: [How to enable Microsoft Authenticator Lite for Outlook mobile (preview)](../authentication/how-to-mfa-authenticator-lite.md).

---

### General Availability - PowerShell and Web Services connector support through the Azure AD provisioning agent

**Type:** New feature   
**Service category:** Provisioning                          
**Product capability:** Outbound to On-premises Applications               

The Azure AD on-premises application provisioning feature now supports both the [PowerShell](../app-provisioning/on-premises-powershell-connector.md) and [web services](../app-provisioning/on-premises-web-services-connector.md) connectors. you can now provision users into a flat file using the PowerShell connector or an app such as SAP ECC using the web services connector. For more information, see: [Provisioning users into applications using PowerShell](../app-provisioning/on-premises-powershell-connector.md).

---

### General Availability - Verified threat actor IP sign-in detection

**Type:** New feature   
**Service category:** Identity Protection                          
**Product capability:** Identity Security & Protection               

Identity Protection has added a new detection, using the Microsoft Threat Intelligence database, to detect sign-ins performed from IP addresses of known nation state and cyber-crime actors and allow customers to block these sign-ins by using risk-based Conditional Access policies. For more information, see: [Sign-in risk](../identity-protection/concept-identity-protection-risks.md).

---

### General Availability - Conditional Access Granular control for external user types 

**Type:** New feature   
**Service category:** Conditional Access                            
**Product capability:** Identity Security & Protection               

When configuring a Conditional Access policy, customers now have granular control over the types of external users they want to apply the policy to. External users are categorized based on how they authenticate (internally or externally) and their relationship to your organization (guest or member). For more information, see: [Assigning Conditional Access policies to external user types](../external-identities/authentication-conditional-access.md#assigning-conditional-access-policies-to-external-user-types).

---

### General Availability - New Federated Apps available in Azure AD Application gallery - May 2023


**Type:** New feature   
**Service category:** Enterprise Apps                
**Product capability:** 3rd Party Integration          

In May 2023 we added the following 51 new applications in our App gallery with Federation support




[INEXTRACK](https://inexto.com/inexto-suite/inextrack), [Valotalive Digital Signage Microsoft 365 integration](https://valota.live/apps/microsoft-excel/), [Tailscale](http://tailscale.com/), [MANTL](https://console.mantl.com/), [ServusConnect](../saas-apps/servusconnect-tutorial.md), [Jigx MS Graph Demonstrator](https://www.jigx.com/), [Delivery Solutions](../saas-apps/delivery-solutions-tutorial.md), [Radiant IOT Portal](../saas-apps/radiant-iot-portal-tutorial.md), [Cosgrid Networks](../saas-apps/cosgrid-networks-tutorial.md), [voya SSO](https://app.voya.ai/), [Redocly](../saas-apps/redocly-tutorial.md), [Glaass Pro](https://glaass.net/pro/), [TalentLyftOIDC](https://www.talentlyft.com/en), [Cisco Expressway](../saas-apps/cisco-expressway-tutorial.md), [IBM TRIRIGA on Cloud](../saas-apps/ibm-tririga-on-cloud-tutorial.md), [Avionte Bold SAML Federated SSO](../saas-apps/avionte-bold-saml-federated-sso-tutorial.md), [InspectNTrack](http://www.inspecttrack.com/), [CAREERSHIP](../saas-apps/careership-tutorial.md), [Cisco Unity Connection](../saas-apps/cisco-unity-connection-tutorial.md), [HSC-Buddy](https://hsc-buddy.com/), [teamecho](https://app.teamecho.at/), [AskFora](https://askfora.com/), [Enterprise Bot](https://www.enterprisebot.ai/),[CMD+CTRL Base Camp](../saas-apps/cmd-ctrl-base-camp-tutorial.md), [Debitia Collections](https://www.debitia.com/), [EnergyManager](https://energymanager.no/), [Visual Workforce](https://prod.visualworkforce.com/), [Uplifter](https://uplifter.ai/), [AI2](https://tmti.net/services/), [TES Cloud](https://www.tes.ca/),[VEDA Cloud](../saas-apps/veda-cloud-tutorial.md), [SOC SST](../saas-apps/soc-sst-tutorial.md), [Alchemer](../saas-apps/alchemer-tutorial.md), [Cleanmail Swiss](https://www.alinto.com/fr/antispam-professionnel-cleanmail/), [WOX](https://woxday.com/), [WATS](https://wats.com/), [Data Quality Assistant](https://appsource.microsoft.com/en-GB/product/office/WA200004441?exp=kyyw&tab=Overview), [Softdrive](https://www.softdrive.co/), [Fluence Portal](https://portal.fluence.app/), [Humbol](https://www.humbol.app/en/product/), [Document360](../saas-apps/document360-tutorial.md), [Engage by Local Measure](https://www.localmeasure.com/),[Gate Property Management Software](https://gatesoftware.nl/), [Locus](../saas-apps/locus-tutorial.md), [Banyan Infrastructure](https://app.banyaninfrastructure.com/), [Proactis Rego Invoice Capture](../saas-apps/proactis-rego-invoice-capture-tutorial.md), [SecureTransport](../saas-apps/securetransport-tutorial.md), [Recnice](https://recnice.com/)

 
You can also find the documentation of all the applications from here https://aka.ms/AppsTutorial,

For listing your application in the Azure AD app gallery, please read the details here https://aka.ms/AzureADAppRequest

---

### General Availability - My Security-info now shows Microsoft Authenticator type

**Type:** Changed feature   
**Service category:** MFA                        
**Product capability:** Identity Security & Protection               

We have improved My Sign-ins and My Security-Info to give you more clarity on the types of Microsoft Authenticator or other Authenticator apps a user has registered. Users will now see Microsoft Authenticator registrations with additional information showing the app as being registered as Push-based MFA or Password-less phone sign-in (PSI) and for other Authenticator apps (Software OATH) we now indicate they're registered as a Time-based One-time password method.  For more information, see: [Set up the Microsoft Authenticator app as your verification method](https://support.microsoft.com/account-billing/set-up-the-microsoft-authenticator-app-as-your-verification-method-33452159-6af9-438f-8f82-63ce94cf3d29).

---

### General Availability - SAML/Ws-Fed based identity provider authentication for Azure Active Directory B2B users in US Sec and US Nat clouds

**Type:** New feature   
**Service category:** B2B                        
**Product capability:** B2B/B2C             

SAML/Ws-Fed based identity providers for authentication in Azure AD B2B are generally available in US Sec, US Nat and China clouds. For more information, see: [Federation with SAML/WS-Fed identity providers for guest users](../external-identities/direct-federation.md).

---

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

We have increased the number of properties that admins are able to define when creating and inviting a user in the Entra admin portal. This brings our UX to parity with our Create User APIs. Additionally, admins can now add users to a group or administrative unit, and assign roles. For more information, see:  [How to create, invite, and delete users](../fundamentals/how-to-create-delete-users.md).

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

Token Protection for sign-in sessions is our first release on a road-map to combat attacks involving token theft and replay. It provides Conditional Access enforcement of token proof-of-possession for supported clients and services that ensure that access to specified resources is only from a device to which the user has signed in. For more information, see: [Conditional Access: Token protection (preview)](../conditional-access/concept-token-protection.md).

---

### General Availability- New limits on number and size of group secrets starting June 2023

**Type:** Plan for change  
**Service category:** Group Management                   
**Product capability:** Directory            

Starting in June 2023, the secrets stored on a single group can't exceed 48 individual secrets, or have a total size greater than 10 KB across all secrets on a single group. Groups with more than 10 KB of secrets will immediately stop working in June 2023. In June, groups exceeding 48 secrets are unable to increase the number of secrets they have, though they may still update or delete those secrets. We highly recommend reducing to fewer than 48 secrets by January 2024.

Group secrets are typically created when a group is assigned credentials to an app using Password-based single sign-on. To reduce the number of secrets assigned to a group, we recommend creating additional groups, and splitting up group assignments to your Password-based SSO applications across those new groups. For more information, see: [Add password-based single sign-on to an application](../manage-apps/configure-password-single-sign-on-non-gallery-applications.md).

---

### Public Preview - Authenticator Lite in Outlook

**Type:** New feature   
**Service category:** Microsoft Authenticator App                     
**Product capability:** User Authentication           

Authenticator Lite is an additional surface for Azure Active Directory users to complete multifactor authentication using push notifications on their Android or iOS device. With Authenticator Lite, users can satisfy a multifactor authentication requirement from the convenience of a familiar app. Authenticator Lite is currently enabled in the Outlook mobile app. Users may receive a notification in their Outlook mobile app to approve or deny, or use the Outlook app to generate an OATH verification code that can be entered during sign-in. The *'Microsoft managed'* setting for this feature will be set to be enabled on May 26, 2023. This enables the feature for all users in tenants where the feature is set to Microsoft managed. If you wish to change the state of this feature, please do so before May 26, 2023. For more information, see: [How to enable Microsoft Authenticator Lite for Outlook mobile (preview)](../authentication/how-to-mfa-authenticator-lite.md).

---

### General Availability - Updated look and feel for Per-user MFA

**Type:** Plan for change   
**Service category:** MFA                       
**Product capability:** Identity Security & Protection             

As part of ongoing service improvements, we're making updates to the per-user MFA admin configuration experience to align with the look and feel of Azure. This change doesn't include any changes to the core functionality and will only include visual improvements.  For more information, see: [Enable per-user Azure AD Multi-Factor Authentication to secure sign-in events](../authentication/howto-mfa-userstates.md).

---

### General Availability - Additional terms of use audit logs will be turned off

**Type:**  Fixed     
**Service category:** Terms of Use                  
**Product capability:** AuthZ/Access Delegation          

Due to a technical issue, we have recently started to emit additional audit logs for terms of use. The additional audit logs will be turned off by May 1 and are tagged with the core directory service and the agreement category. If you have built a dependency on the additional audit logs, you must switch to the regular audit logs tagged with the terms of use service.

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

Self Service Password Reset (SSPR) can now check for PIM eligible users, and evaluate group-based memberships, along with direct memberships when checking if a user is in a particular administrator role. This capability provides more accurate SSPR policy enforcement by validating if users are in scope for the default SSPR admin policy or your organizations SSPR user policy.


For more information, see: 

- [Administrator reset policy differences](../authentication/concept-sspr-policy.md#administrator-reset-policy-differences).
- [Create a role-assignable group in Azure Active Directory](../roles/groups-create-eligible.md)

---
