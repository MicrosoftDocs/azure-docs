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
ms.date: 08/26/2022
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Common considerations for multi-tenant user management

There are many considerations that are relevant to more than one collaboration pattern. 

## Directory object considerations

You can use the console to manually create an invitation for a guest user account. When you do, the user object is created with a user type of *Guest*. Using other techniques to create invitations enable you to set the user type to something other than a Guest account. For example, when using the API you can configure whether the account is a member account or a guest account.  

* Some of the [limits on Guest functionality can be removed](../external-identities/user-properties.md#guest-user-permissions).

* [You can convert Guest accounts to a user type of Member.](../external-identities/user-properties.md#can-azure-ad-b2b-users-be-added-as-members-instead-of-guests)

> **IMPORTANT** 
> If you convert from a guest account to a user account, there might be issues with how Exchange Online handles B2B accounts. You can’t mail-enable accounts invited as guest members. To get a guest member account mail-enabled, the best approach is to:
>* Invite the cross-org users as guest accounts.
>* Show the accounts in the GAL.
>* Set the UserType to Member.

Using this approach, the accounts show up as MailUser in Exchange Online.

### Issues with using mail-contact objects instead of external users or members

You can represent users from another tenant using a traditional GAL synchronization. If a GAL synchronization is done rather than using Azure AD B2B collaboration, a mail-contact object is created. 

* A mail-contact object and a mail-enabled guest user (member or guest) can't coexist in the same tenant with the same email address at the same time. 

* If a mail-contact object exists for the same mail address as the invited guest user, the guest user will be created, but is NOT mail enabled. 

* If the mail-enabled guest user exists with the same mail, an attempt to create a mail-contact object will throw an exception at creation time.

The following are the results of various mail-contact objects and guest user states.

| Existing state| Provisioning scenario| Effective result |
| - |-|-|
| None| Invite B2B Member| Non-mail enabled member user. See Important note above |
| None| Invite B2B Guest| Mail-enable guest user |
| Mail-contact object exists| Invite B2B Member| Error – Conflict of Proxy Addresses |
| Mail-contact object exists| Invite B2B Guest| Mail-contact and Non-Mail enabled guest user. See Important note above |
| Mail-enabled B2B Guest user| Create mail-contact object| Error |
| Mail-enabled B2B Member user exists| Create mail-contact| Error |


**Microsoft does not recommend traditional GAL synchronization**. Instead, use Azure AD B2B collaboration to create:

* External guest users that you enable to show in the GAL

* Create external member users, which show in the GAL by default, but aren't mail-enabled.

Some organizations use the mail-contact object to show users in the GAL. This approach integrates a GAL without providing other permissions as mail-contacts aren't security principals. 

A better approach to achieve this goal is to:
* Invite guest users
* Unhide them from the GAL
* Disable them by [blocking them from sign in](/powershell/module/azuread/set-azureaduser).

A mail-contact object can't be converted to a user object. Therefore, any properties associated with a mail-contact object can't be transferred. For example, group memberships and other resource access aren't transferred.  

Using a mail-contact object to represent a user presents the following challenges.

* **Office 365 Groups** – Office 365 groups support policies governing the types of users allowed to be members of groups and interact with content associated with groups. For example, a group may not allow guest accounts to join. These policies can't govern mail-contact objects.

* **Azure AD Self-service group management (SSGM)** – Mail-contact objects aren't eligible to be members in groups using the SSGM feature. More tools may be needed to manage groups with recipients represented as contacts instead of user objects.

* **Azure AD Identity Governance - Access Reviews** – The access reviews feature can be used to review and attest to membership of Office 365 group. Access reviews are based on user objects. Members represented by mail-contact objects are out of scope of access reviews.

* **Azure AD Identity Governance - Entitlement Management (EM)** – When EM is used to enable self-service access requests for external users via the company’s EM portal, a user object is created at the time of request. Mail-contact objects aren't supported. 

## Azure AD conditional access considerations

The state of the user, device, or network in the user’s home tenant isn't conveyed to the resource tenant. Therefore, a guest user account might not satisfy conditional access (CA) policies that use the following controls.

* **Require multi-factor authentication** – Guest users will be required to register/respond to MFA in the resource tenant, even if MFA was satisfied in the home tenant, resulting in multiple MFA challenges. Also, if they need to reset their MFA proofs they might not be aware of the multiple MFA proof registrations across tenants. The lack of awareness might require the user to contact an administrator in the home tenant, resource tenant, or both.

* **Require device to be marked as compliant**– Device identity isn't registered in the resource tenant, so the guest user will be blocked from accessing resources that require this control.

* **Require Hybrid Azure AD Joined device** - Device identity isn't registered in the resource tenant (or on-premises Active Directory connected to resource tenant), so the guest user will be blocked from accessing resources that require this control.

* **Require approved client app or Require app protection policy** – External guest users can’t apply resource tenant Intune Mobile App Management (MAM) policy because it also requires device registration. Resource tenant Conditional Access (CA) policy using this control doesn’t allow home tenant MAM protection to satisfy the policy. External Guest users should be excluded from every MAM-based CA policy. 

Additionally, while the following CA conditions can be used, be aware of the possible ramifications.

* **Sign-in risk and user risk** – The sign in risk and user risk are determined in part by user behavior in their home tenant. The data and risk score is stored in the home tenant.  
‎If resource tenant policies block a guest user, a resource tenant admin might not be able to enable access. For more information, see [Identity Protection and B2B users](../identity-protection/concept-identity-protection-b2b.md).

* **Locations** – The named location definitions that are defined in the resource tenant are used to determine the scope of the policy. Trusted locations managed in the home tenant aren't evaluated in the scope of the policy. In some scenarios, organizations might want to share trusted locations across tenants. To share trusted locations, the locations must be defined in each tenant where the resources and conditional access policies are defined.

## Other access control considerations

More considerations when configuring access control.

* Define [access control policies](../external-identities/authentication-conditional-access.md) to control access to resources.
* Design CA policies with guest users in mind. 
* Create policies specifically for guest users. 
* If your organization is using the [All Users] condition in your existing CA policy, this policy will affect guest users because [Guest] users are in scope of [All Users].
* Create dedicated CA policies for [Guest] accounts. 

For information on hardening dynamic groups that utilize the [All Users] expression, see [Dynamic groups and Azure AD B2B collaboration](../external-identities/use-dynamic-groups.md).

### Require User Assignment

If an application has the [User assignment required?] property set to [No], guest users can access the application. Application admins must understand access control impacts, especially if the application contains sensitive information. For more information, see [How to restrict your Azure AD app to a set of users](../develop/howto-restrict-your-app-to-a-set-of-users.md). 

### Terms and Conditions

[Azure AD terms of use](../conditional-access/terms-of-use.md) provides a simple method that organizations can use to present information to end users. You can use terms of use to require guest users to approve terms of use before accessing your resources.

### Licensing considerations for guest users with Azure AD Premium features

Azure AD External Identities (guest user) pricing is based on monthly active users (MAU). The number of active users is the count of unique users with authentication activity within a calendar month. MAU billing helps you reduce costs by offering a free tier and flexible, predictable pricing. In addition, the first 50,000 MAUs per month are free for both Premium P1 and Premium P2 features. Premium features include Conditional Access Policies and Azure AD Multi-Factor Authentication for guest users.

For more information, see [MAU billing model for Azure AD External Identities](../external-identities/external-identities-pricing.md).

## Office 365 considerations

The following information addresses Office 365 in the context of this paper’s scenarios. Detailed information is available at [Office 365 inter-tenant collaboration](/office365/enterprise/office-365-inter-tenant-collaboration).

### Microsoft Exchange Online

Exchange online limits certain functionality for guest users. The limits may be lessened by creating external members instead of external guests. However, none of the following are supported for external users at this time. 

* A guest user can be assigned an Exchange Online license. However, they're prevented from being issued a token for Exchange Online. The results are that they aren't able to access the resource.

   * Guest users can't use shared or delegated Exchange Online mailboxes in the resource tenant.

   * A guest user can be assigned to a shared mailbox, but can't access it.

* Guest users need to be unhidden in order to be included in the GAL. By default, they're hidden.

   * Hidden guest users are created at invite time. The creation is independent of whether the user has redeemed their invitation. So, if all guest users are unhidden, the list includes user objects of guest users who haven't redeemed an invitation. Based on your scenario, you may or may not want the objects listed.

   * Guest users may be unhidden using [Exchange Online PowerShell](/powershell/exchange/exchange-online-powershell-v2?view=exchange-ps&preserve-view=true) only. You may execute the [Set-MailUser](/powershell/module/exchange/set-mailuser?view=exchange-ps&preserve-view=true) PowerShell cmdlet to set the HiddenFromAddressListsEnabled property to a value of $false.  
‎  
`‎Set-MailUser [GuestUserUPN] -HiddenFromAddressListsEnabled:$false`
‎  
‎Where [GuestUserUPN] is the calculated UserPrincipalName. Example:  
‎  
`‎Set-MailUser guestuser1_contoso.com#EXT#@fabricam.onmicrosoft.com -HiddenFromAddressListsEnabled:$false`

* Updates to Exchange-specific properties, such as the PrimarySmtpAddress, ExternalEmailAddress, EmailAddresses, and MailTip, can only be set using [Exchange Online PowerShell](/powershell/exchange/exchange-online-powershell-v2?view=exchange-ps&preserve-view=true). The Exchange Online Admin Center doesn't allow you to modify the attributes using the GUI. 

As shown above, you can use the [Set-MailUser](/powershell/module/exchange/set-mailuser?view=exchange-ps&preserve-view=true) PowerShell cmdlet for mail-specific properties. More user properties you can modify with the [Set-User](/powershell/module/exchange/set-user?view=exchange-ps&preserve-view=true) PowerShell cmdlet. Most of the properties can also be modified using the Azure AD Graph APIs.

### Microsoft SharePoint Online

SharePoint Online has its own service-specific permissions depending on if the user is a member of guest in the Azure Active Directory tenant. 

For more information, see [Office 365 external sharing and Azure Active Directory B2B collaboration](../external-identities/o365-external-user.md).

After enabling external sharing in SharePoint Online, the ability to search for guest users in the SharePoint Online people picker is OFF by default. This setting prohibits guest users from being discoverable when they're hidden from the Exchange Online GAL. You can enable guest users to become visible in two ways (not mutually exclusive):

* You can enable the ability to search for guest users in a few ways:
   * Modify the setting 'ShowPeoplePickerSuggestionsForGuestUsers' at the tenant and site collection level. 
   * Set the feature using the [Set-SPOTenant](/powershell/module/sharepoint-online/Set-SPOTenant?view=sharepoint-ps&preserve-view=true) and [Set-SPOSite](/powershell/module/sharepoint-online/set-sposite?view=sharepoint-ps&preserve-view=true) [SharePoint Online PowerShell](/powershell/sharepoint/sharepoint-online/connect-sharepoint-online?view=sharepoint-ps&preserve-view=true) cmdlets.  
‎

* Guest users that are visible in the Exchange Online GAL are also visible in the SharePoint Online people picker. The accounts are visible regardless of the setting for 'ShowPeoplePickerSuggestionsForGuestUsers'.

### Microsoft Teams

Microsoft Teams has features to limit access and based on user type. Changes to user type might affect content access and features available. 

* The “tenant switching” mechanism for Microsoft Teams might require users to manually switch the context of their Teams client when working in Teams outside their home tenant.

* You can enable Teams users from another entire external domain to find, call, chat, and set up meetings with your users with Teams Federation. For more information, see [Manage external access in Microsoft Teams](/microsoftteams/manage-external-access). 

 

### Licensing considerations for guest users in Teams

When using Azure B2B with Office 365 workloads, there are some key considerations. There are instances in which guest accounts don't have the same experience as a member account. 

**Microsoft groups**. See [Adding guests to office 365 Groups](https://support.office.com/article/adding-guests-to-office-365-groups-bfc7a840-868f-4fd6-a390-f347bf51aff6) to better understand the guest account experience in Microsoft Groups. 

**Microsoft Teams**. See [Team owner, member, and guest capabilities in Teams](https://support.office.com/article/team-owner-member-and-guest-capabilities-in-teams-d03fdf5b-1a6e-48e4-8e07-b13e1350ec7b?ui=en-US&rs=en-US&ad=US) to better understand the guest account experience in Microsoft Teams. 

You can enable a full fidelity experience in Teams by using B2B External Members. Office 365 recently clarified its licensing policy for Multi-tenant organizations.

* Users that are licensed in their home tenant may access resources in another tenant within the same legal entity. The access is granted using **External Members** setting with no extra licensing fees. The setting applies for SharePoint, OneDrive for Business, Teams, and Groups. 

   * Engineering work is underway to automatically check the license status of a user in their home tenant and enable them to participate as a Member with no extra license assignment or configuration. However, for customers who wish to use External Members now, there's a licensing workaround that requires the Account Executive to work with the Microsoft Business Desk. 

   * From now until the engineered licensing solution is enabled, customers can utilize a *Teams Trial license*. The license can be assigned to each user in their foreign tenant. The license has a one-year duration and enables all of the workloads listed above.

   * For customers that wish to convert B2B Guests into B2B Members there are several known issues with Microsoft Teams such as the inability to create new channels and the ability to add applications to an existing Team. 

* **Identity Governance** features (Entitlement Management, Access Reviews) may require other licenses for guest users or external members. Work with the Account Team or Business Desk to get right answer for your organization.

**Other products** (like Dynamics CRM) may require licensing in every tenant in which a user is represented. Work with your account team to get the right answer for your organization.

## Next steps
[Multi-tenant user management introduction](multi-tenant-user-management-introduction.md)

[Multi-tenant end user management scenarios](multi-tenant-user-management-scenarios.md)

[Multi-tenant common solutions](multi-tenant-common-solutions.md)
