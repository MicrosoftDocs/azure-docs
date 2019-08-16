---
title: Plan an Azure Active Directory Access Panel Deployment
description: Guidance on deploying Azure AD Access Panel functionality
services: active-directory
author: barbaraselden
manager: CelesteDG
ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/16/2019
ms.author: baselden
ms.reviewer: mimart
ms.collection: M365-identity-device-management
---

# Plan an Azure Active Directory Access Panel Deployment

The Azure Active Directory Access Panel is a web-based portal that enables you to lower support costs, increase productivity and security, and reduce user frustration. The system includes detailed reporting that tracks when users access the system, and notifies administrators to misuse or abuse.

The Azure Active Directory Access Panel enables users to:

* Discover and access all their company’s Azure Active Directory connected resources, such as applications

* Request access to new apps and groups or manage access to these resources for others

* Manage self-service password resets and multi-factor authentication settings

* Manage their devices

It also allows administrators to manage:

* terms of service

* organizations

* access reviews


## Benefits of Azure Active Directory Access Panel integration

The Microsoft Azure Active Directory (Azure AD) access panel benefits businesses in the following ways:

**Provides intuitive user experience**: Enabling the access panel provides users with the ability to have single launch pad for all their Azure single-sign on connected applications. As capabilities like group management and self-service password reset are added, users continue to have a unified portal to find these settings. The intuitive experience will allow users to get back to work faster and be more productive, while reducing their frustration.

**Increases productivity**: All user applications in the Access Panel have single sign-on (SSO) enabled. Enabling single sign-on across enterprise applications and Office 365 provides a superior sign in experience for existing users, reducing or eliminating additional sign in prompts. The Access Panel enables self-service and dynamic membership, and improves the overall security of your identity system by ensuring the right people manage access to the applications. The access panel serves as a coherent landing page for a user to quickly find resources and continue work tasks.

**Manages cost**: Enabling the access panel with Azure Active Directory may allow divestment of on-premise infrastructures. It reduces support costs by enabling users to have a consistent portal to find all their apps, request access to resources, and manage their account.

**Increases flexibility and security**: The access panel lets you access the security and flexibility that a cloud platform provides. Administrators can easily change settings to applications and resources and accommodate new security requirements without affecting users.

**Enables robust auditing and usage tracking**: Auditing and usage tracking for all end-user capabilities let you know when users are using their resources and ensures you to assess security.

### Licensing considerations

The Access Panel is free and requires no licenses to use at a basic all users. However, the number of objects in your directory and the features you wish to deploy may require additional licenses. Common Azure AD scenarios include the following security features that do have licensing requirements.

* [Azure Multi-Factor Authentication (MFA)](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-how-it-works)

* [Group based membership](https://docs.microsoft.com/azure/active-directory/active-directory-manage-groups)

* [Self-service password requirement](https://docs.microsoft.com/azure/active-directory/authentication/quickstart-sspr)

* [Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection)

[See the full licensing guide for Azure Active Directory](https://azure.microsoft.com/pricing/details/active-directory/)

### Prerequisites for deploying the Azure AD Access Panel

The following must be in place before the beginning of this project.

* [Application SSO integration](https://docs.microsoft.com/azure/active-directory/manage-apps/plan-sso-deployment)

* [Azure AD user and group infrastructure](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups)

## Plan the Azure AD Access Panel deployment

The following table outlines the key use cases for an access panel deployment:

| Area| Description |
| - | - |
| Access| Access panel portal is accessible from corporate and personal devices within the corporate network. |
|Access | Access panel portal is accessible to corporate devices outside of the corporate network. |
| Auditing| Usage data is downloaded into corporate systems at least every 29 days. |
| Governance| Lifecycle of user assignments to Azure AD connected applications and groups are defined and monitored. |
| Security| Access to resources is controlled via user and group assignments. Only authorized users can manage resource access. |
| Performance| Access assignment propagation timelines are documented and monitored. |
| User Experience| Users are aware of the access panel capabilities and how to use them.|
| User Experience| Users can self-manage their access to applications and groups.|
| User Experience| Users can manage their accounts. |
| User Experience| Users are aware of browser compatibility. |
| Support| Users can find support for access panel issues. |

### Best practices for deploying the Azure AD Access Panel

The functionality of the access panel can be enabled gradually. We recommend the following order of deployment:

1. My Apps
   * App launcher
   * Self-service app management
   * Microsoft Office 365 integration

1. Self-service app discovery

   * Self-service password reset
   * Multi-factor authentication settings
   * Device management
   * Terms of use
   * Manage organizations

1. My Groups
   * Self-service group management
1. Access reviews
   * Access review management

Starting with My Apps introduces users to the portal as a common place for accessing resources. The addition of self-service application discovery builds on the My Apps experience. My Groups and access reviews build on the self-service capabilities.

### Plan configurations for the Azure AD Access Panel

The following table lists several important access panel configurations and the typical values you might use:

| Configuration| Typical values |
| - | - |
| Determine the pilot group(s)| Identify the Azure AD security group to be used and ensure all pilot members are a part of the group. |
| Determine the group or groups to be enabled for production.| Identify the Azure AD security group(s), or AD groups synced to Azure AD, to be used. Ensure all pilot members are a part of the group. |
| Allow users to use single sign on to what types of applications| Federated SSO, OAuth, Password SSO, App Proxy |
| Allow users to use self-service password reset| Yes |
| Allow users to use multi-factor authentication| Yes |
| Allow users to use self-service group management for what types of groups| Security groups, O365 groups |
| Allow users to use self-service app management| Yes |
| Allow users to use access reviews| Yes |

### Plan consent strategy

Users or administrators must consent to any application’s terms of use and privacy policies. If possible given your business rules, we advise using Administrator consent, which gives users a better experience.

To use administrator consent, you must be a global administrator of the tenant, and the applications must be:

* Registered in your tenant, or

* Registered in another Azure AD tenant and previously consented by at least one end user.

For more information, see [Configure the way end-users consent to an application in Azure Active Directory](configure-user-consent.md).

### Engage the right stakeholders

When technology projects fail, they typically do so becuase of mismatched expectations on impact, outcomes, and responsibilities. To avoid these pitfalls, [ensure that you're engaging the right stakeholders](../fundamentals/active-directory-deployment-plans.md) and that stakeholder roles in the project are well understood.

### Plan communications

Communication is critical to the success of any new service. Proactively inform your users how and when their experience will change, and how to gain support if needed.

While the access panel doesn't typically create user issues, it's important to prepare. Create guides and a list of all resources for your support personnel before your launch.

#### Communications templates

Microsoft provides [customizable templates for emails and other communications](https://aka.ms/APTemplates) for Access panel. You can adapt these assets for use in other communications channels as appropriate for your corporate culture.

## Plan your SSO configuration

When a user signs in to an application, they go through an authentication process and are required to prove who they are. Without single sign-on, a password stored at the application, and the user is required to know this password. With single sign-on (SSO) users’ credentials are passed to the application so they do not need to reenter passwords for each application.

To launch applications in My Apps, single sign-on (SSO) must be enabled for the applications.

Azure AD supports three different ways to enable [single sign-on to applications](what-is-single-sign-on.md):

* **Federated single sign-on** 
    * enables an application to redirect to Azure AD for user authentication instead of prompting for a password. 
    * Is supported for applications using protocols such as SAML 2.0, WS-Federation, or OpenID Connect, and is the richest mode of single sign-on.

* **Password-based single sign-on** 
    * enables secure application password storage and replay using a web browser extension or mobile app. 
    * leverages the existing sign in process provided by the application but enables an administrator to manage the passwords. User is not required to know the password.

* **Existing single sign-on** 
    * enables Azure AD to leverage any existing single sign-on that has been configured for the application
    * enables these applications to be linked to the Office 365 or Azure AD access panel portals 
    * enables additional reporting in Azure AD when the applications are launched there. 
    * Includes using Azure Application Proxy and the linked single sign-on mode.

Learn how to configure an application’s SSO mode here: [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

For the best experience with the My Apps page, we recommend starting with the integration of cloud applications available for federated SSO. Federated SSO allows users to have a consistent one-click experience across their app launching surfaces and tends to be more robust in configuration control.

Use Federated SSO with Azure AD (OpenID Connect / SAML) when an application supports it, instead of password-based SSO and ADFS.

For more information on how to deploy and configure you SaaS applications, see the [SaaS SSO deployment plan](https://aka.ms/deploymentplans/sso).

#### Plan to deploy the My Apps browser extension

If password-based SSO applications are made available to end users, they need to install the My Apps secure sign in extension to sign in. The extension executes a script that transmits the password into the application’s sign in form. Users will be prompted to install the extension when they first launch the password-based SSO application. More information about the extension can found in our documentation on [installing the access panel browser extension](https://docs.microsoft.com/azure/active-directory/application-access-panel-extension-problem-installing?/?WT.mc_id=DMC_AAD_Manage_Apps_Troubleshooting_Nav).

If you must integrate password-based SSO applications,, you should define a mechanism to deploy the extension at scale with [supported browsers](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction). Options include:

* [Group Policy for Internet Explorer ](https://azure.microsoft.com/documentation/articles/active-directory-saas-ie-group-policy/)

* [System Center Configuration Manager (SCCM) for Internet Explorer ](https://docs.microsoft.com/sccm/core/clients/deploy/deploy-clients-to-windows-computers)

* [User driven download and configuration for Chrome, Firefox, Microsoft Edge, or IE ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction)

Learn more: [How to configure password single sign on](https://docs.microsoft.com/azure/active-directory/application-config-sso-how-to-configure-password-sso-non-gallery).

Users not using password-based SSO applications also benefit from the extension. These benefits include the ability to launch any app from its search bar, finding access to recently used applications, and having a link to the My Apps page.

Here’s what the user will see when launching a password-based SSO application for the first time:

![Screenshot of My Apps browser extension install screen ](media/access-panel-deployment-plan/ap-dp-sign-in.png)

#### Plan for mobile access

A browser protected with Intune policy (Microsoft Edge or Intune Managed Browser) will be necessary for mobile users launching password-based SSO applications. A policy-protected browser enables the transfer of the password saved for the application. Microsoft Edge or the managed browser provides a set of web data protection features. You can also use Microsoft Edge for enterprise scenarios on iOS and Android devices. Microsoft Edge supports the same management scenarios as the Intune Managed Browser and improves the end-user experience. Learn more: [Manage web access using a Microsoft Intune policy-protected browser](https://docs.microsoft.com/intune/app-configuration-managed-browser)

## Plan your My Apps Deployment

The foundation of the access panel is the application launcher My Apps, which users access at [https://myapps.microsoft.com](https://myapps.microsoft.com/). The My Apps pages give users a single place to start their work and get to their necessary applications. Here, users find a list of all the applications they have single sign-on access to. 

![A screenshot of the apps panel](media/access-panel-deployment-plan/ap-dp-app-launcher.png)

The same applications will be shown in the Office 365 app launcher when users are using the Office 365 portal.

Plan the order in which you'll add applications to the My Apps launcher, and whether you'll roll them out gradually or all at once. To do so, create an application inventory listing the type of authentication and any existing single sign-on (SSO) integrations for each application.

#### Add applications to the My Apps panel

Any Azure AD SSO-enabled application can be added to the My Apps launcher. Other applications are added by using the Linked SSO option. You can configure an application tile that links to the URL of your existing web application. Linked SSO allows you to start directing users to the My Apps portal without having to migrate all the applications to Azure Active Directory SSO. You can gradually move to Azure AD SSO-configured applications without disrupting the users' experience.

#### Plan whether to use My Apps or an existing portal

Your users may already have an application or other portalother than My Apps. If so, decide whether to support both portals, or if you will only use one.

If an existing portal is already being used as a starting point for users, you can integrate My Apps functionality by using “user access URLs.” User access URLs function as direct links to the applications available in the My Apps portal. These URLs can be embedded within any existing website. When a user clicks the link, it launches the application from the My Apps portal.

You can find the User access URL property in the Properties area of the application in the Azure portal.

![A screenshot of the apps panel](media/access-panel-deployment-plan/ap-dp-user-access-url.png)


## Plan self-service application discovery and access

Once a core set of applications are deployed to a user’s My Apps page, we recommend enabling self-service app management features. Self-service app discovery enables:
* users to find new apps they may add to their My Apps. 
* users to add optional apps that you may not know they need during setup.

Approval workflows are available for explicit approval to access applications. Users who are approvers will receive notifications within the My Apps portal when there are pending request for access to the application.

## Plan self-service group membership 

You can enable users to create and manage their own security groups or Office 365 groups in Azure Active Directory (Azure AD). The owner of the group can
approve or deny membership requests and delegate control of group membership. Self-service group management features aren't available for mail-enabled security groups or distribution lists.

To plan for self-service group membership, determine if you'll allow all users in your organization to create and manage groups, or only a subset of users. If a subset of users, you'll need to set up a group to which those people are added. See [Set up self-service group management in Azure active Directory](https://docs.microsoft.com/azure/active-directory/users-groups-roles/groups-self-service-management) for details on enabling these scenarios.

## Plan reporting and auditing

Azure AD provides [reports that offer technical and business insights](https://azure.microsoft.com/documentation/articles/active-directory-view-access-usage-reports/). Work with your business and technical application owners to assume ownership of and consume these reports on a regular basis. The table below provides some examples of typical reporting scenarios.

|   | Manage Risk| Increase Productivity| Governance & Compliance |
|  - |- | - | - |
| Report types|  Application permissions and usage.| Account provisioning activity| Review who is accessing the applications |
| Potential actions| Audit access; revoke permissions| Remediate any provisioning errors| Revoke access |

Azure AD keeps most auditing data for 30 days. The data is available via Azure Admin Portal or API for you to download into your analysis systems.

#### Auditing

Audit logs for application access are available for 30 days. If security auditing within your enterprise requires longer retention, the logs need to be exported into a Security Information Event and Management (SIEM) tool such as Splunk or ArcSight.

For auditing, reporting, and disaster recovery backups, document the required frequency of download, the target system is, and who is responsible for managing each backup. You may not need separate auditing and reporting backups. Your disaster recovery backup should be a separate entity.

## Deploy applications to users’ My Apps panel

After an application has been configured for SSO, groups are assigned access. Users in the assigned groups will have access and will see the application in their My Apps and the Office 365 app launcher

See [Assign users and groups to an application in Active Directory](methods-for-assigning-users-and-groups.md).

If during testing or deployment you want to add the groups, but not yet allow the applications to show in My Apps, see [Hide an application from user’s experience in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-hide-third-party-app).

### Deploy Microsoft Office 365 applications to My Apps

For Office 365 applications, users receive a copy of Office based on licenses assigned to them. A prerequisite for access to Office applications is assigning users to the correct licenses tied to the Office applications. When you assign a user the license they'll automatically see the applications associated with the license in their My Apps page and in the O365 app launcher.

If you want to hide a set of Office applications from users, there's an option to hide apps from the My Apps portal, while still allowing access from the O365 portal. Find these settings in the User settings portion of the application. Learn more: [Hide an application from user’s experience in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-hide-third-party-app).

![A screenshot of configuring how to hide applications](media/access-panel-deployment-plan/ap-dp-o365-portal.png)

### Deploy application self-service capabilities

Self-service application access allows users to self-discover and request access to any applications. Users are given the freedom to get access to the apps they need without going through an IT-group each time to request access. When a user requests access and is approved either automatically or manually by an app owner, they're added to a group on the back end. Reporting is enabled on who has requested, approved, or removed access, and gives you control over managing the roles assigned.

You can delegate approval of application access requests to business approvers. The business approver can set the app-access passwords right from the business approver’s My Apps page.

Learn more: [How to use self-service application access](https://docs.microsoft.com/azure/active-directory/application-access-panel-self-service-applications-how-to)

![A screenshot of configuring self-service application management](media/access-panel-deployment-plan/ap-dp-salesforce.png)

## Validate your deployment

Ensure your access panel deployment is thoroughly tested and a rollback plan is in place.

The following tests should be conducted with both corporate-owned devices and personal devices. These test cases should also reflect your business use cases. Following are a few cases based on the sample business requirements in this document, and on typical technical scenarios. Add others specific to your needs.

#### Application SSO access test case examples:


| Business case| Expected result |
| - | -|
| User signs in into the My Apps portal| User can sign in and see their applications |
| User launches a federated SSO application| User is automatically signed into the application |
| User launches a password SSO application for the first time| User needs to install the My Apps extension |
| User launches a password SSO application a subsequent time| User is automatically signed into the application |
| User launches an app from O365 Portal| User is automatically signed into the application |
| User launches an app from the Managed Browser| User is automatically signed into the application |


#### Application self-service capabilities test case examples


| Business case| Expected result |
| - | - |
| User can manage membership to the application| User can add/remove members who have access to the app |
| User can edit the application| User can edit the application’s description and credentials for password SSO applications |

### Rollback steps

It’s important to plan what to do in case your deployment doesn’t go as planned. If SSO configuration fails during deployment, you must understand how to [troubleshoot SSO issues](https://docs.microsoft.com/azure/active-directory/hybrid/tshoot-connect-sso) and reduce impact to your users. In extreme circumstances, you may need to [rollback SSO](../manage-apps/plan-sso-deployment).


## Manage your implementation

Microsoft recommends using the least privileged role to accomplish a required task within Azure Active Directory. Microsoft recommends [review the different roles that are available](https://docs.microsoft.com/azure/active-directory/active-directory-assign-admin-roles-azure-portal) and choosing the right one to solve your needs for each persona for this application. Some roles may need to be applied temporarily and removed after the deployment has been completed.

| Personas| Roles| Azure AD role  |
| - | -| -|
| Help Desk Admin| Tier 1 Support| None |
| Identity Admin| Configure and Debug when issues impact Azure AD| Global Admin |
| Application Admin| User attestation in application, configuration on users with permissions| None |
| Infrastructure Admins| Cert Rollover Owner| Global Admin |
| Business Owner/Stakeholder| User attestation in application, configuration on users with permissions| None |

We recommend using [Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-configure) to manage your roles to provide additional auditing, control, and access review for users with directory permissions.

### Troubleshooting Access Panel issues

Create troubleshooting guides for your support organization with common scenarios and pointing to Microsoft documentation on their resolutions. You may want to create guides that break support into the tiers used by your organization.

See the below troubleshooting guides for reference:

[Applications not appearing](https://docs.microsoft.com/azure/active-directory/manage-apps/access-panel-troubleshoot-application-not-appearing)

[Unexpected applications appearing](https://docs.microsoft.com/azure/active-directory/manage-apps/access-panel-troubleshoot-unexpected-application)

[User cannot sign in to the access panel](https://docs.microsoft.com/azure/active-directory/manage-apps/access-panel-troubleshoot-web-sign-in-problem)

[Problems using self-service application access](https://docs.microsoft.com/azure/active-directory/manage-apps/access-panel-troubleshoot-self-service-access)

[Issues with the browser extension](https://docs.microsoft.com/azure/active-directory/manage-apps/manage-access-panel-browser-extension)

## Next Steps

[Plan a deployment of Azure Active Directory Multi-factor authentication](https://aka.ms/deploymentplans/mfa)
