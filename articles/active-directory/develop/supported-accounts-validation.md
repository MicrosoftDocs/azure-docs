---
# required metadata
title: Validation differences by supported account types - Microsoft identity platform | Azure
description: Learn about the validation differences of various properties for different supported account types when registering your app with the Microsoft identity platform.
author: SureshJa
ms.author: sureshja
manager: CelesteDG
ms.date: 10/12/2019
ms.topic: conceptual
ms.subservice: develop
ms.custom: aaddev 
ms.service: active-directory
ms.reviewer: lenalepa, manrath
---

# Validation differences by supported account types (signInAudience)

When registering an application with the Microsoft identity platform for developers, you are asked to select which account types your application supports. In the application object and manifest, this property is `signInAudience`.

The options include the following:

- *AzureADMyOrg*: Only accounts in the organizational directory where the app is registered (single-tenant)
- *AzureADMultipleOrgs*: Accounts in any organizational directory (multi-tenant)
- *AzureADandPersonalMicrosoftAccount*: Accounts in any organizational directory (multi-tenant) and personal Microsoft accounts (for example, Skype, Xbox, and Outlook.com)

For registered applications, you can find the value for Supported account types on the **Authentication** section of an application. You can also find it under the `signInAudience` property in the **Manifest**.

The value you select for this property has implications on other app object properties. As a result, if you change this property you may need to change other properties first.

See the following table for the validation differences of various properties for different supported account types.

| Property | `AzureADMyOrg` | `AzureADMultipleOrgs` | `AzureADandPersonalMicrosoftAccount` and `PersonalMicrosoftAccount` |
|--------------|---------------|----------------|----------------|
| Application ID URI (`identifierURIs`)  | Must be unique in the tenant <br><br> urn:// schemes are supported <br><br> Wildcards are not supported <br><br> Query strings and fragments are supported <br><br> Maximum length of 255 characters <br><br> No limit* on number of identifierURIs  | Must be globally unique <br><br> urn:// schemes are supported <br><br> Wildcards are not supported <br><br> Query strings and fragments are supported <br><br> Maximum length of 255 characters <br><br> No limit* on number of identifierURIs | Must be globally unique <br><br> urn:// schemes are not supported <br><br> Wildcards, fragments and query strings are not supported <br><br> Maximum length of 120 characters <br><br> Maximum of 50 identifierURIs |
| Certificates (`keyCredentials`) | Symmetric signing key | Symmetric signing key | Encryption and asymmetric signing key | 
| Client secrets (`passwordCredentials`) | No limit* | No limit* | If liveSDK is enabled: Maximum of 2 client secrets | 
| Redirect URIs (`replyURLs`) | See [Redirect URI/reply URL restrictions and limitations](reply-url.md) for more info. | | | 
| API permissions (`requiredResourceAccess`) | No limit* | No limit* | Maximum of 30 permissions per resource allowed (e.g. Microsoft Graph) | 
| Scopes defined by this API (`oauth2Permissions`) | Maximum scope name length of 120 characters <br><br> No limit* on the number of scopes defined | Maximum scope name length of 120 characters <br><br> No limit* on the number of scopes defined |  Maximum scope name length of 40 characters <br><br> Maximum of 100 scopes defined | 
| Authorized client applications (`preautorizedApplications`) | No limit* | No limit* | Total maximum of 500 <br><br> Maximum of 100 client apps defined <br><br> Maximum of 30 scopes defined per client | 
| appRoles | Supported <br> No limit* | Supported <br> No limit* | Not supported | 
| Logout URL | http://localhost is allowed <br><br> Maximum length of 255 characters | http://localhost is allowed <br><br> Maximum length of 255 characters | <br><br> https://localhost is allowed, http://localhost fails for MSA <br><br> Maximum length of 255 characters <br><br> HTTP scheme is not allowed <br><br> Wildcards are not supported | 

*There is a global limit of about 1000 items across all the collection properties on the app object

## Next steps

- Learn about [Application registration](app-objects-and-service-principals.md)
- Learn about the [Application manifest](reference-app-manifest.md)
