---
title: Secure external access to Microsoft Teams, SharePoint, and OneDrive with Azure Active Directory 
description: Secure access to Microsoft 365 services as a part of your external access security plan
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/02/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Secure external access to Microsoft Teams, SharePoint, and OneDrive with Azure Active Directory 

Use this article to determine and configure your organization's external collaboration using Microsoft Teams, OneDrive for Business, and SharePoint. A common challenge is balancing security and ease of collaboration for end users and external users. If an approved collaboration method is perceieved as restrictive and onerous, end user evade the approved method. End users might email unsecured content, or set up external processes and applications, such as a personal DropBox or OneDrive. 

## External Identities settings and Azure Active Directory

Sharing in Microsoft 365 is partially governed by the **Exernal Identities, External collaboration** settings in Azure Active Directory (Azure AD). If external sharing is disabled or restricted in Azure AD, it overrides sharing settings configured in Microsoft 365. An exception is if Azure AD B2B integration isn't enabled. You can configure SharePoint and OneDrive to support ad-hoc sharing via one-time password (OTP). The following screenshot shows the External Identities, External collaboration settings dialog. 

   ![Screenshot of options and entries under External Identities, External collaboration settings.](media/secure-external-access/9-external-collaboration-settings.png)

Learn more:

* [Azure Active Directory admin center](https://aad.portal.azure.com/)
* [External Identities in Azure AD](../external-identities/external-identities-overview.md)

### Guest user access

Guest users are invited to have access to resources. 

1. Go to the Azure Active Directory admin center.
2. Select **All Services**.
3. Under **Categories**, select **Identity**.
4. From the list, select **External Identities**.
5. Select **External collaboration settings**.
6. Find the **Guest user access** option. 

To prevent guest-user access to other guest-user details, and to prevent enumeration of group membership, select **Guest users have limited access to properties and memberships of directory objects**.

### Guest invite settings

Guest invite settings determine who invites guests and how guests are invited. The settings are enabled if the B2B integration is enabled. It's recommended that administrators and users, in the Guest Inviter role, can invite. This setting allows setup of controlled collaboration processes. For example:

* Team owner submits a ticket requesting assignment to the Guest Inviter role:
  * Responsible for guest invitations
  * Agrees to not add users to SharePoint
  * Performs regular access reviews
  * Revokes access as needed

* The IT team:
  * After training is complete, grants the Guest Inviter role
  * To enable access reviews, assigns Azure AD P2 license to the Microsoft 365 group owner
  * Creates a Microsoft 365 group access review
  * Confirms access reviews occur
  * Removes users added to SharePoint

1. Select **Email one-time passcodes for guests**. 
2. For **Enable guest self-service sign up via user flows**, select **Yes**. 

### Collaboration restrictions

For the Collaboration restrictions option, the organization's business requirements dictate the choice of invitation.

* **Allow invitations to be sent to any domain** - any user can be invited
* **Deny invitations to the specified domains** - any user outside those domains can be invited
* **Allow invitations only to the specified domains** - any user outside those domains cannot be invited 

## External users and guest users in Teams

Teams differentiates between external users (outside your organization) and guest users (guest accounts). You can manage collaboration setting in the [Teams Admin portal](https://admin.teams.microsoft.com/company-wide-settings/external-communications) under Org-wide settings. Authorized account credentials are required to sign in to the Teams Admin portal.

* **External Access** - Teams allows external access by default. The organization can communicate with all external domains 
  * Use External Access setting to restrict or allow domains
* **Guest Access** - manage guest acess in Teams

Learn more: [Use guest access and external access to collaborate with people outside your organization](/microsoftteams/communicate-with-users-from-other-organizations). 

> [!NOTE]
> The External Identities collaboration feaure in Azure AD controls permissions. You can increase restrictions in Teams, but restrictions can't be lower than Azure AD settings.

Learn more:

* [Manage external meetings and chat in Microsoft Teams](/microsoftteams/manage-external-access)
* [Microsoft 365 identity models and Azure AD](/microsoft-365/enterprise/about-microsoft-365-identity)
* [Identity models and authentication for Microsoft Teams](/microsoftteams/identify-models-authentication)
* [Sensitivity labels for Microsoft Teams](/microsoftteams/sensitivity-labels)

## Govern access in SharePoint and OneDrive

SharePoint administrators can find organization-wide settings in the SharePoint admin center. It's recommended that your organization-wide settings are the minimum security levels. Increase security on some sites, as needed. For example, for a high-risk project, restrict users to certain domains, and disable members from inviting guests.

Learn more: 
* [SharePoint admin center](https://microsoft-admin.sharepoint.com) - access permissions are required
* [Get started with the SharePoint admin center](/sharepoint/get-started-new-admin-center)
* [External sharing overview](/sharepoint/external-sharing-overview)

### Integrating SharePoint and OneDrive with Azure AD B2B

As a part of your strategy to govern external collaboration, it's recommended you enable SharePoint and OneDrive integration with Azure AD B2B. Azure AD B2B has guest-user authentication and management. With SharePoint and OneDrive integration, use one-time passcodes for external sharing of files, folders, list items, document libraries, and sites. 

Learn more: 
* [Email one-time passcode authentication](../external-identities/one-time-passcode.md)
* [SharePoint and OneDrive integration with Azure AD B2B](/sharepoint/sharepoint-azureb2b-integration)
* [B2B collaboration overview](../external-identities/what-is-b2b.md)

> [!NOTE]
> If you enable Azure AD B2B integration, then SharePoint and OneDrive sharing is subject to the Azure AD organizational relationships settings, such as **Members can invite** and **Guests can invite**.

### Sharing policies in SharePoint and OneDrive

In the Azure AD admin center, you can use the External Sharing settings for SharePoint and OneDrive to help configure sharing policies. OneDrive restrictions can't be more permissive than SharePoint settings.

Learn more: [External sharing overview](https://learn.microsoft.com/en-us/sharepoint/external-sharing-overview)

   ![Screenshot of external sharing settings for SharePoint and OneDrive](media/secure-external-access/9-sharepoint-settings.png)

#### External sharing settings recommendations

Use the guidance in this section when configuring external sharing. 

* **Anyone** - Not recommended. If enabled, regardless of integration status, no Azure policies are applied for this link type. 
  * Don't enable this functionality for governed collaboration
  * Use it for restrictions on individual sites
* **New and existing guests** - Recommended if integration is enabled.
  * With Azure AD B2B integration enabled, new and existing guests will have an Azure AD B2B guest account that can be managed with Azure AD policies.

   * **Without Azure AD B2B integration** enabled, new guests will not have an Azure AD B2B account created, and they cannot be managed from Azure AD. Whether existing guests have an Azure AD B2B account depends on how the guest was created.

* **Existing guests**. Recommended if you do not have integration enabled.

   * With this enabled, users can only share with other users already in your directory.

* **Only people in your organization**. Not recommended when you need to collaborate with external users.

   * Regardless of integration status, users will only be able to share with users in your organization. 

* **Limit external sharing by domain**. By default SharePoint allows external access, which means that sharing is allowed with all external domains. If you want to restrict or allow specific domains just for SharePoint, you can do so here.

* **Allow only users in specific security groups to share externally**.  This setting restricts who can share content in SharePoint and OneDrive, while the setting in Azure AD applies to all applications. Restricting who can share can be useful if you want to require your users to take a training about sharing securely, then at completion add them to an approved sharing security group. If this setting is selected, and users do not have a way to gain access to being an “approved sharer,” they may instead find unapproved ways to share. 

* **Allow guests to share items they don’t own**. We recommend leaving this disabled.

* **People who use a verification code must reauthenticate after this many days (default is 30)**. We recommend enabling this setting.

### Access controls

Access controls setting will affect all users in your organization. Given that you may not be able to control whether external users have compliant devices, we will not address those controls here. 

* **Idle session sign-out**. We recommend that you enable this control, which allows you to warn and sign-out users on unmanaged devices after a period of inactivity. You can configure the period of inactivity and the warning. 

* **Network location**. Setting this control means you can allow access only form IP addresses that your organization owns. In external collaboration scenarios, set this only if all of your external partners will access resources only form within your network, or via your VPN.

### File and folder links

In the SharePoint admin center, you can also set how file and folder links are shared. You can also configure these setting for each site. 

 ![Screenshot of file and folder link settings](media/secure-external-access/9-file-folder-links.png)

If you have enabled the integration with Azure AD B2B, sharing of files and folders with those outside of the organization will result in a B2B user being created when files and folder are shared.

We recommend setting the default link type to **Only people in your organization**, and default permissions to **Edit**. Doing so ensures that items are shared thoughtfully. You can then customize this setting for per-site default that meet specific collaboration needs.

### Anyone links

We do not recommend enabling anyone links. If you do, we recommend setting an expiration, and consider restricting them to view permissions. If you choose View only permissions for files or folders, users will not be able to change Anyone links to include edit privileges.

To learn more about governing external access to SharePoint see the following:

* [SharePoint external sharing overview](/sharepoint/external-sharing-overview)

* [SharePoint and OneDrive integration with Azure AD B2B](/sharepoint/sharepoint-azureb2b-integration-preview)

#### Next steps

See the following articles on securing external access to resources. We recommend you take the actions in the listed order.

1. [Determine your security posture for external access](1-secure-access-posture.md)

2. [Discover your current state](2-secure-access-current-state.md)

3. [Create a governance plan](3-secure-access-plan.md)

4. [Use groups for security](4-secure-access-groups.md)

5. [Transition to Azure AD B2B](5-secure-access-b2b.md)

6. [Secure access with Entitlement Management](6-secure-access-entitlement-managment.md)

7. [Secure access with Conditional Access policies](7-secure-access-conditional-access.md)

8. [Secure access with Sensitivity labels](8-secure-access-sensitivity-labels.md)

9. [Secure access to Microsoft Teams, OneDrive, and SharePoint](9-secure-access-teams-sharepoint.md) (You are here.)
