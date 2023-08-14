---
title: Common considerations for multi-tenant user management in Azure Active Directory
description: Learn about the common design considerations for user access across Azure Active Directory tenants with guest accounts 
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 04/19/2023
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---
# Common considerations for multi-tenant user management

This article is the third in a series of articles that provide guidance for configuring and providing user lifecycle management in Azure Active Directory (Azure AD) multi-tenant environments. The following articles in the series provide more information as described.

- [Multi-tenant user management introduction](multi-tenant-user-management-introduction.md) is the first in the series of articles that provide guidance for configuring and providing user lifecycle management in Azure Active Directory (Azure AD) multi-tenant environments.
- [Multi-tenant user management scenarios](multi-tenant-user-management-scenarios.md) describes three scenarios for which you can use multi-tenant user management features: end user-initiated, scripted, and automated.
- [Common solutions for multi-tenant user management](multi-tenant-common-solutions.md) when single tenancy doesn't work for your scenario, this article provides guidance for these challenges:  automatic user lifecycle management and resource allocation across tenants, sharing on-premises apps across tenants.

The guidance helps to you achieve a consistent state of user lifecycle management. Lifecycle management includes provisioning, managing, and deprovisioning users across tenants using the available Azure tools that include [Azure AD B2B collaboration](../external-identities/what-is-b2b.md) (B2B) and [cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-overview.md).

Synchronization requirements are unique to your organization's specific needs. As you design a solution to meet your organization's requirements, the following considerations in this article will help you identify your best options.

- Cross-tenant synchronization
- Directory object
- Azure AD Conditional Access
- Additional access control
- Office 365

## Cross-tenant synchronization

[Cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-overview.md) can address collaboration and access challenges of multi-tenant organizations. The following table shows common synchronization use cases. You can use both cross-tenant synchronization and customer development to satisfy use cases when considerations are relevant to more than one collaboration pattern.

| Use case | Cross-tenant sync | Custom development |
| - | - | - |
| User lifecycle management | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) |
| File sharing and app access | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) |
| Support sync to/from sovereign clouds |  | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) |
| Control sync from resource tenant |  | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) |
| Sync Group objects |  | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) |
| Sync Manager links |  | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) |
| Attribute level Source of Authority |  | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) |
| Azure AD write-back to AD |  | ![Checkmark icon](media/multi-tenant-user-management-scenarios/checkmark.svg) |

## Directory object considerations

### Inviting an external user with UPN versus SMTP Address

Azure AD B2B expects that a user's **UserPrincipalName** (UPN) is the primary SMTP (Email) address for sending invitations. When the user's UPN is the same as their primary SMTP address, B2B works as expected. However, if the UPN is different than the external user's primary SMTP address, it may fail to resolve when a user accepts an invitation, which may be a challenge if you don't know the user's real UPN. You need to discover and use the UPN when sending invitations for B2B.

The [Microsoft Exchange Online](#microsoft-exchange-online) section of this article explains how to change the default primary SMTP on external users. This technique is useful if you want all email and notifications for an external to flow to the real primary SMTP address as opposed to the UPN. It may be a requirement if the UPN isn't route-able for mail flow.

### Converting an external user's UserType

When you use the console to manually create an invitation for an external user account, it creates the user object with a guest user type. Using other techniques to create invitations enable you to set the user type to something other than an external guest account. For example, when using the API, you can configure whether the account is an external member account or an external guest account.

- Some of the [limits on guest functionality can be removed](../external-identities/user-properties.md#guest-user-permissions).
- You can [convert guest accounts to member user type.](../external-identities/user-properties.md#can-azure-ad-b2b-users-be-added-as-members-instead-of-guests)

If you convert from an external guest user to an external member user account, there might be issues with how Exchange Online handles B2B accounts. You can't mail-enable accounts that you invited as external member users. To mail-enable an external member account, use the following best approach.

- Invite the cross-org users as external guest user accounts.
- Show the accounts in the GAL.
- Set the UserType to Member.

When you use this approach, the accounts show up as MailUser objects in Exchange Online and across Office 365. Also, note there's a timing challenge. Make sure the user is visible in the GAL by checking both Azure AD user ShowInAddressList property aligns with the Exchange Online PowerShell HiddenFromAddressListsEnabled property (that are reverse of each other). The [Microsoft Exchange Online](#microsoft-exchange-online) section of this article provides more information on changing visibility.

It's possible to convert a member user to a guest user, which is useful for internal users that you want to restrict to guest-level permissions. Internal guest users are users that aren't employees of your organization but for whom you manage their users and credentials. It may allow you to avoid licensing the internal guest user.

### Issues with using mail contact objects instead of external users or members

You can represent users from another tenant using a traditional GAL synchronization. If you perform a GAL synchronization rather than using Azure AD B2B collaboration, it creates a mail contact object.

- A mail contact object and a mail-enabled external member or guest user can't coexist in the same tenant with the same email address at the same time.
- If a mail contact object exists for the same mail address as the invited external user, it creates the external user but isn't mail-enabled.
- If the mail-enabled external user exists with the same mail, an attempt to create a mail contact object throws an exception at creation time.

> [!NOTE]
> Using mail contacts requires Active Directory Directory Services (AD DS) or Exchange Online PowerShell. Microsoft Graph doesn't provide an API call for managing contacts.

The following table displays the results of mail contact objects and external user states.

| Existing state | Provisioning scenario | Effective result |
| - | - | - |
| None | Invite B2B Member | Non-mail-enabled member user. See important note above. |
| None | Invite B2B Guest | Mail-enable external user. |
| Mail contact object exists | Invite B2B Member | Error. Conflict of Proxy Addresses. |
| Mail contact object exists | Invite B2B Guest | Mail-contact and Non-Mail enabled external user. See important note above. |
| Mail-enabled external guest user | Create mail contact object | Error |
| Mail-enabled external member user exists | Create mail-contact | Error |

Microsoft recommends using Azure AD B2B collaboration (instead of traditional GAL synchronization) to create:

- External users that you enable to show in the GAL.
- External member users that show in the GAL by default but aren't mail-enabled.

You can choose to use the mail contact object to show users in the GAL. This approach integrates a GAL without providing other permissions because mail contacts aren't security principals.

Follow this recommended approach to achieve the goal:

- Invite guest users.
- Unhide them from the GAL.
- Disable them by [blocking them from sign-in](/powershell/module/azuread/set-azureaduser).

A mail contact object can't convert to a user object. Therefore, properties associated with a mail contact object can't transfer (such as group memberships and other resource access). Using a mail contact object to represent a user comes with the following challenges.

- **Office 365 Groups.** Office 365 Groups support policies governing the types of users allowed to be members of groups and interact with content associated with groups. For example, a group may not allow guest users to join. These policies can't govern mail contact objects.
- **Azure AD Self-service group management (SSGM).** Mail contact objects aren't eligible to be members in groups using the SSGM feature. You may need more tools to manage groups with recipients represented as contacts instead of user objects.
- **Azure AD Identity Governance, Access Reviews.** You can use the access reviews feature to review and attest to membership of Office 365 group. Access reviews are based on user objects. Members represented by mail contact objects are out of scope for access reviews.
- **Azure AD Identity Governance, Entitlement Management (EM).** When you use EM to enable self-service access requests for external users in the company's EM portal, it creates a user object the time of request. It doesn't support mail contact objects.

## Azure AD Conditional Access considerations

The state of the user, device, or network in the user's home tenant doesn't convey to the resource tenant. Therefore, an external user might not satisfy Conditional Access policies that use the following controls.

Where allowed, you can override this behavior with [Cross-Tenant Access Settings (CTAS)](../external-identities/cross-tenant-access-overview.md) that honor MFA and device compliance from the home tenant.

- **Require multi-factor authentication.** Without CTAS configured, an external user must register/respond to MFA in the resource tenant (even if MFA was satisfied in the home tenant), which results in multiple MFA challenges. If they need to reset their MFA proofs, they might not be aware of the multiple MFA proof registrations across tenants. The lack of awareness might require the user to contact an administrator in the home tenant, resource tenant, or both.
- **Require device to be marked as compliant.** Without CTAS configured, device identity isn't registered in the resource tenant, so the external user can't access resources that require this control.
- **Require Hybrid Azure AD Joined device.** Without CTAS configured, device identity isn't registered in the resource tenant (or on-premises Active Directory connected to resource tenant), so the external user can't access resources that require this control.
- **Require approved client app or Require app protection policy.** Without CTAS configured, external users can't apply the resource tenant Intune Mobile App Management (MAM) policy because it also requires device registration. Resource tenant Conditional Access policy, using this control, doesn't allow home tenant MAM protection to satisfy the policy. Exclude external users from every MAM-based Conditional Access policy.

Additionally, while you can use the following Conditional Access conditions, be aware of the possible ramifications.

- **Sign-in risk and user risk.** User behavior in their home tenant determines, in part, the sign-in risk and user risk. The home tenant stores the data and risk score. If resource tenant policies block an external user, a resource tenant admin might not be able to enable access. [Identity Protection and B2B users](../identity-protection/concept-identity-protection-b2b.md) explains how Identity Protection detects compromised credentials for Azure AD users.
- **Locations.** The named location definitions in the resource tenant determine the scope of the policy. The scope of the policy doesn't evaluate trusted locations managed in the home tenant. If your organization wants to share trusted locations across tenants, define the locations in each tenant where you define the resources and Conditional Access policies.

## Other access control considerations

The following are considerations for configuring access control.

- Define [access control policies](../external-identities/authentication-conditional-access.md) to control access to resources.
- Design Conditional Access policies with external users in mind.
- Create policies specifically for external users.
- If your organization is using the [**all users** dynamic group](../external-identities/use-dynamic-groups.md) condition in your existing Conditional Access policy, this policy affects external users because they are in scope of **all users**.
- Create dedicated Conditional Access policies for external accounts.

### Require user assignment

If an application has the **User assignment required?** property set to **No**, external users can access the application. Application admins must understand access control impacts, especially if the application contains sensitive information. [Restrict your Azure AD app to a set of users in an Azure AD tenant](../develop/howto-restrict-your-app-to-a-set-of-users.md) explains how registered applications in an Azure Active Directory (Azure AD) tenant are, by default, available to all users of the tenant who successfully authenticate.

### Terms and conditions

[Azure AD terms of use](../conditional-access/terms-of-use.md) provides a simple method that organizations can use to present information to end users. You can use terms of use to require external users to approve terms of use before accessing your resources.

### Licensing considerations for guest users with Azure AD Premium features

Azure AD External Identities pricing is based on monthly active users (MAU). The number of active users is the count of unique users with authentication activity within a calendar month. [Billing model for Azure AD External Identities](../external-identities/external-identities-pricing.md) describes how pricing is based on monthly active users (MAU), which is the count of unique users with authentication activity within a calendar month.

## Office 365 considerations

The following information addresses Office 365 in the context of this paper's scenarios. Detailed information is available at [Microsoft 365 inter-tenant collaboration 365 inter-tenant collaboration](/office365/enterprise/office-365-inter-tenant-collaboration) describes options that include using a central location for files and conversations, sharing calendars, using IM, audio/video calls for communication, and securing access to resources and applications.

### Microsoft Exchange Online

Exchange online limits certain functionality for external users. You can lessen the limits by creating external member users instead of external guest users. Support for external users has the following limitations.

- You can assign an Exchange Online license to an external user. However, you can't issue to them a token for Exchange Online. The results are that they can't access the resource.
    - External users can't use shared or delegated Exchange Online mailboxes in the resource tenant.
    - You can assign an external user to a shared mailbox but they can't access it.
- You need to unhide external users to include them in the GAL. By default, they're hidden.
    - Hidden external users are created at invite time. The creation is independent of whether the user has redeemed their invitation. So, if all external users are unhidden, the list includes user objects of external users who haven't redeemed an invitation. Based on your scenario, you may or may not want the objects listed.
    - External users may be unhidden using [Exchange Online PowerShell](/powershell/exchange/exchange-online-powershell-v2). You can execute the [Set-MailUser](/powershell/module/exchange/set-mailuser) PowerShell cmdlet to set the **HiddenFromAddressListsEnabled** property to a value of **\$false**.
 
For example:

```Set-MailUser [ExternalUserUPN] -HiddenFromAddressListsEnabled:\$false\```

Where **ExternalUserUPN** is the calculated **UserPrincipalName.**

For example:

```Set-MailUser externaluser1_contoso.com#EXT#@fabricam.onmicrosoft.com\ -HiddenFromAddressListsEnabled:\$false```

- External users may be unhidden using [Azure AD PowerShell](/powershell/module/azuread). You can execute the [Set-AzureADUser](/powershell/module/azuread/set-azureaduser) PowerShell cmdlet to set the **ShowInAddressList** property to a value of **\$true.** 
    
For example:

```Set-AzureADUser -ObjectId [ExternalUserUPN] -ShowInAddressList:\$true\```

Where **ExternalUserUPN** is the calculated **UserPrincipalName.**

For example:

```Set-AzureADUser -ObjectId externaluser1_contoso.com#EXT#@fabricam.onmicrosoft.com\ -ShowInAddressList:\$true```

- There's a timing delay when you update attributes and must perform additional automation afterwards, which is a result of the backend sync that occurs between Azure AD and Exchange Online. Make sure the user is visible in the GAL by checking that the Azure AD user property **ShowInAddressList** aligns with the Exchange Online PowerShell property **HiddenFromAddressListsEnabled** (that are reverse of each other) before continuing  operations.
- You can only set updates to Exchange-specific properties (such as the **PrimarySmtpAddress**, **ExternalEmailAddress**, **EmailAddresses**, and **MailTip**) using [Exchange Online PowerShell](/powershell/exchange/exchange-online-powershell-v2). The Exchange Online Admin Center doesn't allow you to modify the attributes using the GUI.

As shown above, you can use the [Set-MailUser](/powershell/module/exchange/set-mailuser) PowerShell cmdlet for mail-specific properties. There are user properties that you can modify with the [Set-User](/powershell/module/exchange/set-user) PowerShell cmdlet. You can modify most properties with the Azure AD Graph APIs.

One of the most useful features of **Set-MailUser** is the ability to manipulate the **EmailAddresses** property. This multi-valued attribute may contain multiple proxy addresses for the external user (such as SMTP, X500, SIP). By default, an external user has the primary SMTP address stamped correlating to the **UserPrincipalName** (UPN). If you want to change the primary SMTP and/or add SMTP addresses, you can set this property. You can't use the Exchange Admin Center; you must use Exchange Online PowerShell. [Add or remove email addresses for a mailbox in Exchange Online](/exchange/recipients-in-exchange-online/manage-user-mailboxes/add-or-remove-email-addresses) shows different ways to modify a multivalued property such as **EmailAddresses.**

### Microsoft SharePoint Online

SharePoint Online has its own service-specific permissions depending on whether the user (internal or external) is of type member or guest in the Azure Active Directory tenant. [Office 365 external sharing and Azure Active Directory B2B collaboration](../external-identities/o365-external-user.md) describes how you can enable integration with SharePoint and OneDrive to share files, folders, list items, document libraries, and sites with people outside your organization, while using Azure B2B for authentication and management.

After you enable external sharing in SharePoint Online, the ability to search for guest users in the SharePoint Online people picker is **OFF** by default. This setting prohibits guest users from being discoverable when they're hidden from the Exchange Online GAL. You can enable guest users to become visible in two ways (not mutually exclusive):

- You can enable the ability to search for guest users in these ways:
    - Modify the **ShowPeoplePickerSuggestionsForGuestUsers** setting at the tenant and site collection level.
    - Set the feature using the [Set-SPOTenant](/powershell/module/sharepoint-online/Set-SPOTenant) and [Set-SPOSite](/powershell/module/sharepoint-online/set-sposite) [SharePoint Online PowerShell](/powershell/sharepoint/sharepoint-online/connect-sharepoint-online) cmdlets.
- Guest users that are visible in the Exchange Online GAL are also visible in the SharePoint Online people picker. The accounts are visible regardless of the setting for **ShowPeoplePickerSuggestionsForGuestUsers**.

### Microsoft Teams

Microsoft Teams has features to limit access and based on user type. Changes to user type can affect content access and features available. Microsoft Teams will require users to change their context using the tenant switching mechanism of their Teams client when working in Teams outside their home tenant.

The tenant switching mechanism for Microsoft Teams might require users to manually switch the context of their Teams client when working in Teams outside their home tenant.

You can enable Teams users from another entire external domain to find, call, chat, and set up meetings with your users with Teams Federation. [Manage external meetings and chat with people and organizations using Microsoft identities](/microsoftteams/manage-external-access) describes how you can allow users in your organization to chat and meet with people outside the organization who are using Microsoft as an identity provider.

### Licensing considerations for guest users in Teams

When you use Azure B2B with Office 365 workloads, key considerations include instances in which guest users (internal or external) don't have the same experience as member users.

- **Microsoft Groups.** [Adding guests to Office 365 Groups](https://support.office.com/article/adding-guests-to-office-365-groups-bfc7a840-868f-4fd6-a390-f347bf51aff6) describes how guest access in Microsoft 365 Groups lets you and your team collaborate with people from outside your organization by granting them access to group conversations, files, calendar invitations, and the group notebook.
- **Microsoft Teams.** [Team owner, member, and guest capabilities in Teams](https://support.office.com/article/team-owner-member-and-guest-capabilities-in-teams-d03fdf5b-1a6e-48e4-8e07-b13e1350ec7b) describes the guest account experience in Microsoft Teams. You can enable a full fidelity experience in Teams by using external member users. Office 365 recently clarified its licensing policy for multi-tenant organizations. Users licensed in their home tenant may access resources in another tenant within the same legal entity. You can grant access using the external members setting with no extra licensing fees. The setting applies for SharePoint, OneDrive for Business, Teams, and Groups.
- **Identity Governance features.** Entitlement Management and access reviews may require other licenses for external users.
- **Other products.** Products such as Dynamics CRM may require licensing in every tenant in which a user is represented.

## Next steps

- [Multi-tenant user management introduction](multi-tenant-user-management-introduction.md) is the first in the series of articles that provide guidance for configuring and providing user lifecycle management in Azure Active Directory (Azure AD) multi-tenant environments.
- [Multi-tenant user management scenarios](multi-tenant-user-management-scenarios.md) describes three scenarios for which you can use multi-tenant user management features: end user-initiated, scripted, and automated.
- [Common solutions for multi-tenant user management](multi-tenant-common-solutions.md) when single tenancy doesn't work for your scenario, this article provides guidance for these challenges:  automatic user lifecycle management and resource allocation across tenants, sharing on-premises apps across tenants.
