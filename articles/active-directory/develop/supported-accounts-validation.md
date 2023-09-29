---
title: Validation differences by supported account types
description: Learn about the validation differences of various properties for different supported account types when registering your app with the Microsoft identity platform.
author: cilwerner
ms.author: cwerner
manager: CelesteDG
ms.date: 03/24/2023
ms.topic: reference
ms.subservice: develop
ms.custom: aaddev, engagement-fy23
ms.service: active-directory
ms.reviewer: manrath, sureshja
---

# Validation differences by supported account types (signInAudience)

When registering an application with the Microsoft identity platform for developers, you're asked to select which account types your application supports. You can refer to the **Help me choose** link under **Supported account types** during the registration process. The value you select for this property has implications on other app object properties.

After the application has been registered, you can check or change the account type that the application supports at any time. Under the **Manage** pane of your application, search for **Manifest** and find the `signInAudience` value. The different account types, and the corresponding `signInAudience` are shown in the following table:

| Supported account types (Register an application) | `signInAudience` (Manifest) |
|---------------------------------------------------|-----------------------------|
| Accounts in this organizational directory only (Single tenant) | `AzureADMyOrg` |
| Accounts in any organizational directory (Any Microsoft Entra directory - Multitenant) | `AzureADMultipleOrgs` |
| Accounts in any organizational directory (Any Microsoft Entra directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox) | `AzureADandPersonalMicrosoftAccount` |
| Personal Microsoft accounts only | `PersonalMicrosoftAccount` |

If you change this property you may need to change other properties first. 

## Validation differences

See the following table for the validation differences of various properties for different supported account types.

| Property | `AzureADMyOrg`  | `AzureADMultipleOrgs` | `AzureADandPersonalMicrosoftAccount` and `PersonalMicrosoftAccount`  |
| -------- | --------------- | --------------------- | -------------------------------------------------------------------- |
| Application ID URI (`identifierURIs`)    | Must be unique in the tenant <br><br> `urn://` schemes are supported <br><br> Wildcards aren't supported <br><br> Query strings and fragments are supported <br><br> Maximum length of 255 characters <br><br> No limit\* on number of identifierURIs                                           | Must be globally unique <br><br> `urn://` schemes are supported <br><br> Wildcards aren't supported <br><br> Query strings and fragments are supported <br><br> Maximum length of 255 characters <br><br> No limit\* on number of identifierURIs                                                                                        | Must be globally unique <br><br> `urn://` schemes aren't supported <br><br> Wildcards, fragments, and query strings aren't supported <br><br> Maximum length of 120 characters <br><br> Maximum of 50 identifierURIs |
| National clouds                             | Supported                 | Supported                | Not supported                          |
| Certificates (`keyCredentials`)             | Symmetric signing key     | Symmetric signing key    | Encryption and asymmetric signing key  |
| Client secrets (`passwordCredentials`)      | No limit\*                | No limit\*               | If liveSDK is enabled: Maximum of two client secrets  |
| Redirect URIs (`replyURLs`)                 | See [Redirect URI/reply URL restrictions and limitations](reply-url.md) for more info.  |  |   |
| API permissions (`requiredResourceAccess`)  | No more than 50 total APIs (resource apps), with no more than 10 APIs from other tenants. No more than 400 permissions total across all APIs.  | No more than 50 total APIs (resource apps), with no more than 10 APIs from other tenants. No more than 400 permissions total across all APIs. | No more than 50 total APIs (resource apps), with no more than 10 APIs from other tenants. No more than 200 permissions total across all APIs. Maximum of 30 permissions per resource (for example, Microsoft Graph).   |
| Scopes defined by this API (`oauth2Permissions`)             | Maximum scope name length of 120 characters <br><br> No limit\* on the number of scopes defined       | Maximum scope name length of 120 characters <br><br> No limit\* on the number of scopes defined    | Maximum scope name length of 40 characters <br><br> Maximum of 100 scopes defined     |
| Authorized client applications (`preAuthorizedApplications`) | No limit\*  | No limit\*    | Total maximum of 500 <br><br> Maximum of 100 client apps defined <br><br> Maximum of 30 scopes defined per client  |
| appRoles      | Supported <br> No limit\*   | Supported <br> No limit\* | Not supported |
| Front-channel logout URL      | `https://localhost` is allowed <br><br> `http` scheme isn't allowed <br><br> Maximum length of 255 characters  | `https://localhost` is allowed <br><br> `http` scheme isn't allowed <br><br> Maximum length of 255 characters  | `https://localhost` is allowed, `http://localhost` fails <br><br> `http` scheme isn't allowed <br><br> Maximum length of 255 characters <br><br> Wildcards aren't supported                                            |
| Display name    | Maximum length of 120 characters  | Maximum length of 120 characters  | Maximum length of 90 characters  |
| Tags            | Individual tag size must be between 1 and 256 characters (inclusive) <br><br> No whitespaces or duplicate tags allowed <br><br> No limit\* on number of tags  | Individual tag size must be between 1 and 256 characters (inclusive) <br><br> No whitespaces or duplicate tags allowed <br><br> No limit\* on number of tags  | Individual tag size must be between 1 and 256 characters (inclusive) <br><br> No whitespaces or duplicate tags allowed <br><br> No limit\* on number of tags   |

\* There's a global limit of about 1000 items across all the collection properties on the app object.

## Next steps

For more information about application registrations and their JSON manifest, see:

- [Application registration](app-objects-and-service-principals.md)
- [Application manifest](reference-app-manifest.md)
