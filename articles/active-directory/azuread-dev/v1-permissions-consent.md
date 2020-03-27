---
title: Permissions in Azure Active Directory | Microsoft docs
description: Learn about permissions in Azure Active Directory and how to use them.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: azuread-dev
ms.workload: identity
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: ryanwi
ms.reviewer: jesakowi
ms.custom: aaddev
ROBOTS: NOINDEX
---

# Permissions and consent in the Azure Active Directory v1.0 endpoint

[!INCLUDE [active-directory-azuread-dev](../../../includes/active-directory-azuread-dev.md)]

Azure Active Directory (Azure AD) makes extensive use of permissions for both OAuth and OpenID Connect (OIDC) flows. When your app receives an access token from Azure AD, the access token will include claims that describe the permissions that your app has in respect to a particular resource.

*Permissions*, also known as *scopes*, make authorization easy for the resource because the resource only needs to check that the token contains the appropriate permission for whatever API the app is calling.

## Types of permissions

Azure AD defines two kinds of permissions:

* **Delegated permissions** - Are used by apps that have a signed-in user present. For these apps, either the user or an administrator consents to the permissions that the app requests and the app is delegated permission to act as the signed-in user when making calls to an API. Depending on the API, the user may not be able to consent to the API directly and would instead [require an administrator to provide "admin consent"](/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview).
* **Application permissions** - Are used by apps that run without a signed-in user present; for example, apps that run as background services or daemons. Application permissions can only be [consented to by administrators](/azure/active-directory/develop/active-directory-v2-scopes#requesting-consent-for-an-entire-tenant) because they are typically powerful and allow access to data across user-boundaries, or data that would otherwise be restricted to administrators. Users who are defined as owners of the resource application (i.e. the API which publishes the permissions) are also allowed to grant application permissions for the APIs they own.

Effective permissions are the permissions that your app will have when making requests to an API. 

* For delegated permissions, the effective permissions of your app will be the least privileged intersection of the delegated permissions the app has been granted (through consent) and the privileges of the currently signed-in user. Your app can never have more privileges than the signed-in user. Within organizations, the privileges of the signed-in user may be determined by policy or by membership in one or more administrator roles. To learn which administrator roles can consent to delegated permissions, see [Administrator role permissions in Azure AD](../users-groups-roles/directory-assign-admin-roles.md).
    For example, assume your app has been granted the `User.ReadWrite.All` delegated permission in Microsoft Graph. This permission nominally grants your app permission to read and update the profile of every user in an organization. If the signed-in user is a global administrator, your app will be able to update the profile of every user in the organization. However, if the signed-in user is not in an administrator role, your app will be able to update only the profile of the signed-in user. It will not be able to update the profiles of other users in the organization because the user that it has permission to act on behalf of does not have those privileges.
* For application permissions, the effective permissions of your app are the full level of privileges implied by the permission. For example, an app that has the `User.ReadWrite.All` application permission can update the profile of every user in the organization.

## Permission attributes
Permissions in Azure AD have a number of properties that help users, administrators, or app developers make informed decisions about what the permission grants access to.

> [!NOTE]
> You can view the permissions that an Azure AD Application or Service Principal exposes using the Azure portal, or PowerShell. Try this script to view the permissions exposed by Microsoft Graph.
> ```powershell
> Connect-AzureAD
> 
> # Get OAuth2 Permissions/delegated permissions
> (Get-AzureADServicePrincipal -filter "DisplayName eq 'Microsoft Graph'").OAuth2Permissions
> 
> # Get App roles/application permissions
> (Get-AzureADServicePrincipal -filter "DisplayName eq 'Microsoft Graph'").AppRoles
> ```

| Property name | Description | Example |
| --- | --- | --- |
| `ID` | Is a GUID value that uniquely identifies this permission. | 570282fd-fa5c-430d-a7fd-fc8dc98a9dca |
| `IsEnabled` | Indicates whether this permission is available for use. | true |
| `Type` | Indicates whether this permission requires user consent or admin consent. | User |
| `AdminConsentDescription` | Is a description that's shown to administrators during the admin consent experiences | Allows the app to read email in user mailboxes. |
| `AdminConsentDisplayName` | Is the friendly name that's shown to administrators during the admin consent experience. | Read user mail |
| `UserConsentDescription` | Is a description that's shown to users during a user consent experience. |  Allows the app to read email in your mailbox. |
| `UserConsentDisplayName` | Is the friendly name that's shown to users during a user consent experience. | Read your mail |
| `Value` | Is the string that's used to identify the permission during OAuth 2.0 authorize flows. `Value` may also be combined with the App ID URI string in order to form a fully qualified permission name. | `Mail.Read` |

## Types of consent

Applications in Azure AD rely on consent in order to gain access to necessary resources or APIs. There are a number of kinds of consent that your app may need to know about in order to be successful. If you are defining permissions, you will also need to understand how your users will gain access to your app or API.

* **Static user consent** - Occurs automatically during the [OAuth 2.0 authorize flow](v1-protocols-oauth-code.md#request-an-authorization-code) when you specify the resource that your app wants to interact with. In the static user consent scenario, your app must have already specified all the permissions it needs in the app's configuration in the Azure portal. If the user (or administrator, as appropriate) has not granted consent for this app, then Azure AD will prompt the user to provide consent at this time. 

    Learn more about registering an Azure AD app that requests access to a static set of APIs.
* **Dynamic user consent** - Is a feature of the v2 Azure AD app model. In this scenario, your app requests a set of permissions that it needs in the [OAuth 2.0 authorize flow for v2 apps](/azure/active-directory/develop/active-directory-v2-scopes#requesting-individual-user-consent). If the user has not consented already, they will be prompted to consent at this time. [Learn more about dynamic consent](/azure/active-directory/develop/active-directory-v2-compare#incremental-and-dynamic-consent).

    > [!IMPORTANT]
    > Dynamic consent can be convenient, but presents a big challenge for permissions that require admin consent, since the admin consent experience doesn't know about those permissions at consent time. If you require admin privileged permissions or if your app uses dynamic consent, you must register all of the permissions in the Azure portal (not just the subset of permissions that require admin consent). This enables tenant admins to consent on behalf of all their users.
  
* **Admin consent** - Is required when your app needs access to certain high-privilege permissions. Admin consent ensures that administrators have some additional controls before authorizing apps or users to access highly privileged data from the organization. [Learn more about how to grant admin consent](/azure/active-directory/develop/active-directory-v2-scopes#using-the-admin-consent-endpoint).

## Best practices

### Client best practices

- Only request for permissions that your app needs. Apps with too many permissions are at risk of exposing user data if they are compromised.
- Choose between delegated permissions and application permissions based on the scenario that your app supports.
    - Always use delegated permissions if the call is being made on behalf of a user.
    - Only use application permissions if the app is non-interactive and not making calls on behalf of any specific user. Application permissions are highly privileged and should only be used when absolutely necessary.
- When using an app based on the v2.0 endpoint, always set the static permissions (those specified in your application registration) to be the superset of the dynamic permissions you request at runtime (those specified in code and sent as query parameters in your authorize request) so that scenarios like admin consent works correctly.

### Resource/API best practices

- Resources that expose APIs should define permissions that are specific to the data or actions that they are protecting. Following this best practice helps to ensure that clients do not end up with permission to access data that they do not need and that users are well informed about what data they are consenting to.
- Resources should explicitly define `Read` and `ReadWrite` permissions separately.
- Resources should mark any permissions that allow access to data across user boundaries as `Admin` permissions.
- Resources should follow the naming pattern `Subject.Permission[.Modifier]`, where:
  - `Subject` corresponds with the type of data that is available
  - `Permission` corresponds to the action that a user may take upon that data
  - `Modifier` is used optionally to describe specializations of another permission
    
    For example:
  - Mail.Read - Allows users to read mail.
  - Mail.ReadWrite - Allows users to read or write mail.
  - Mail.ReadWrite.All - Allows an administrator or user to access all mail in the organization.
