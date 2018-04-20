---
title: Permissions in Azure AD | Microsoft docs
description: Learn about scopes and permissions in Azure Active Directory and how to use them 
services: active-directory
documentationcenter: ''
author: justhu
manager: benv
editor: ''

ms.assetid: 6c0dc122-2cd8-4d70-be5a-3943459d308e
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 04/20/2017
ms.author: justhu
ms.custom: aaddev

---

# Permissions in Azure AD
Azure Active Directory (Azure AD) makes extensive use of permissions for both OAuth and OpenID Connect (OIDC) flows. When your app receives an access token from Azure AD, it will include claims that describe the permissions (also known as scopes) which your app has in respect to a particular resource. This makes authorization easy for the resource because it only needs to check that your token contains the appropriate permission for whatever API you are calling. 

## Types of permissions
Azure AD defines two kinds of permissions: 
* **Delegated permissions** - Are used by apps that have a signed-in user present. For these apps either the user or an administrator consents to the permissions that the app requests and the app is delegated permission to act as the signed-in user when making calls to an API. Depending on the API, the user may not be able to consent to the API directly and would instead [require an administrator to provide "admin consent".](/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview#understanding-user-and-admin-consent)
* **Application permissions** - Are used by apps that run without a signed-in user present; for example, apps that run as background services or daemons. Application permissions can only be [consented by an administrator](/azure/active-directory/develop/active-directory-v2-scopes#requesting-consent-for-an-entire-tenant) because they are typically very powerful and allow access to data across user-boundaries, or data which would otherwise be restricted to administrators. 

Effective permissions are the permissions that your app will have when making requests to an API. It is important to understand the difference between the delegated and application permissions that your app is granted and its effective permissions when making calls to an API.

* For delegated permissions, the effective permissions of your app will be the least privileged intersection of the delegated permissions the app has been granted (through consent) and the privileges of the currently signed-in user. Your app can never have more privileges than the signed-in user. Within organizations, the privileges of the signed-in user may be determined by policy or by membership in one or more administrator roles. For more information about administrator roles, see [Assigning administrator roles in Azure AD](/azure/active-directory/active-directory-assign-admin-roles-azure-portal.md).

    For example, assume your app has been granted the `User.ReadWrite.All` delegated permission in Microsoft Graph. This permission nominally grants your app permission to read and update the profile of every user in an organization. If the signed-in user is a global administrator, your app will be able to update the profile of every user in the organization. However, if the signed-in user is not in an administrator role, your app will be able to update only the profile of the signed-in user. It will not be able to update the profiles of other users in the organization because the user that it has permission to act on behalf of does not have those privileges.
* For application permissions, the effective permissions of your app will be the full level of privileges implied by the permission. For example, an app that has the `User.ReadWrite.All` application permission can update the profile of every user in the organization. 

## Permission attributes
Every permission in Azure Active Directory defines a number of properties which help users, administrators, or app developers make informed decisions about what the permission grants access to. 

> [!NOTE]
> You can view the permissions which an Azure AD Application or Service Principal exposes using the Azure Portal, or PowerShell. Try this script to view the permissions exposed by Microsoft Graph.
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
| Id | This is a GUID value which uniquely identifies this permission.  | 570282fd-fa5c-430d-a7fd-fc8dc98a9dca | 
| IsEnabled | Indicates whether this scope is available for use. | true | 
| Type | Indicates whether this permission is user consentable or admin consentable. | User | 
| AdminConsentDescription | This is a description that's shown to administrators during the admin consent experiences | Allows the app to read email in user mailboxes. | 
| AdminConsentDisplayName | This is the friendly name that is shown to administrators during the admin consent experience. | Read user mail | 
| UserConsentDescription | This is a description that's shown to users during a user consent experience. |  Allows the app to read email in your mailbox. | 
| UserConsentDisplayName | This is the friendly name that is shown to users during a user consent experience. | Read your mail | 
| Value | This is the string that is used to identify the permission during OAuth 2.0 authorize flows. This may also be combined with the App ID URI string in order to form a fully qualified permission name.  | Mail.Read | 

## Types of consent
Applications in Azure AD rely on consent in order to gain access to necessary resources or APIs. There are a number of kinds of consent that your app may need to know about in order to be successful. If you are defining permissions, you will also need to understand how your users will gain access to your app or API.

* **Static user consent** - Occurs automatically during the [OAuth 2.0 authorize flow](/azure/active-directory/develop/active-directory-protocols-oauth-code.md#request-an-authorization-code) when you specify the resource that your app wants to interact with. In the static user consent scenario, your app must have already specified all the permissions it needs in the app's configuration in the Azure Portal. If the user (or administrator, as appropriate) has not granted consent for this app, then Azure AD will prompt the user to provide consent at this time. 

    Learn more about registering an Azure AD app which requests access to a static set of APIs.
* **Dynamic user consent** - Is a feature of the v2 Azure AD app model. In this scenario, your app requests a set of scopes that it needs in the [OAuth 2.0 authorize flow for v2 apps](/azure/active-directory/develop/active-directory-v2-scopes#requesting-individual-user-consent). If the user has not consented already, they will be prompted to consent at this time. [Learn more about dynamic consent](/azure/active-directory/develop/active-directory-v2-compare#incremental-and-dynamic-consent).

    > [!NOTE]
    > Dynamic consent can be convenient, but presents a big challenge for permissions that require admin consent, since the admin consent experience doesn't know about those permissions at consent time. If you require admin privileged scopes, your app must register them in the Azure Portal.
  
* **Admin consent** - Is required when your app needs access to certain high-privilege permissions. This ensures that administrators have some additional controls before authorizing apps or users to access highly privileged data from the organization. [Learn more about how to grant admin consent](/azure/active-directory/develop/active-directory-v2-scopes#using-the-admin-consent-endpoint).

## Best practices

### Resource best practices
Resources which expose APIs should define permissions that are very specific to the data or actions that they are protecting. This helps to ensure that clients do not end up with permission to access data that they do not need and that users are well informed about what data they are consenting to.

Resources should explicitly define `Read` and `ReadWrite` permissions separately in order to ensure that apps which only read data are not over-permissioned. 

Resources should mark any permissions which allow access to data across user boundaries as `Admin` permissions. 

Resources should follow the following naming pattern `Subject.Permission[.Modifier]` where `Subject` corresponds with the type of data that is available, `Permission` corresponds to the action that a user may take upon that data, and `Modifier` is used optionally to describe specializations of another permission. For example: 
* Mail.Read - Allows users to read mail. 
* Mail.ReadWrite - Allows users to read or write mail.
* Mail.ReadWrite.All - Allows an administrator or user to access all mail in the organization.

### Client best practices
Only request permission for the scopes that your app needs. Over-permissioned apps are at risk of exposing user data if they are compromised.

Do not request application permissions and delegated permissions from the same app. This can open your app up to elevation of privilege scenarios where a user may gain access to data which her own delegated permissions would not allow. 




