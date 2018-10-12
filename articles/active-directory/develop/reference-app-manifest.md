---
title: Understanding the Azure Active Directory app manifest | Microsoft Docs
description: Detailed coverage of the Azure Active Directory app manifest, which represents an application's identity configuration in an Azure AD tenant, and is used to facilitate OAuth authorization, consent experience, and more.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''
ms.assetid: 4804f3d4-0ff1-4280-b663-f8f10d54d184
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/24/2018
ms.author: celested
ms.custom: aaddev
ms.reviewer: sureshja
---

# Azure Active Directory app manifest

Apps that integrate with Azure Active Directory (Azure AD) must be registered with an Azure AD tenant. You can configure the app in the [Azure portal](https://portal.azure.com) by selecting **App registrations** under **Azure Active Directory**, choosing the app you want to configure, and then selecting **Manifest**.

## Manifest reference

> [!NOTE]
> If you can't see the **Example value** column after the **Description**, maximize your browser window and scroll/swipe until you see the **Example value** column.

>[!div class="mx-tdBreakAll"]
>[!div class="mx-tdCol2BreakAll"]

| Key  | Value type | Description  | Example value |
|---------|---------|---------|---------|
| `accessTokenAcceptedVersion` | Nullable Int32 | Specifies the accepted access token version for the current API resource. Possible values are 1, 2, null. Defaults to null which will be treated as 2. | `2` |
| `allowPublicClient` | boolean | Specifies the fallback application type. Azure AD infers the application type from the replyUrlsWithType by default. There are certain scenarios where Azure AD cannot determine the client app type (e.g. [ROPC](https://tools.ietf.org/html/rfc6749#section-4.3) flow where HTTP request happens without a URL redirection). In those cases Azure AD will interpret the application type based on the value of this property. If this value is set to true the fallback application type is set as public client, such as an installed app running on a mobile device. The default value is false which means the fallback application type is confidential client such as web app. | `false` |
| `appId` | Identifier string | Specifies the unique identifier for the app that is assigned to an app by Azure AD. | `"601790de-b632-4f57-9523-ee7cb6ceba95"` |
| `appRoles` | Type of array | Specifies the collection of roles that an app may declare. These roles can be assigned to users, groups, or service principals. For more examples and info, see [Add app roles in your application and receive them in the token](howto-add-app-roles-in-azure-ad-apps.md) | <code>[<br>&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;"allowedMemberTypes": [<br>&emsp;&nbsp;&nbsp;&nbsp;"User"<br>&nbsp;&nbsp;&nbsp;],<br>&nbsp;&nbsp;&nbsp;"description":"Read-only access to device information",<br>&nbsp;&nbsp;&nbsp;"displayName":"Read Only",<br>&nbsp;&nbsp;&nbsp;"id":guid,<br>&nbsp;&nbsp;&nbsp;"isEnabled":true,<br>&nbsp;&nbsp;&nbsp;"value":"ReadOnly"<br>&nbsp;&nbsp;}<br>]</code>  |
| `groupMembershipClaims` | string | A bitmask that configures the `groups` claim issued in a user or OAuth 2.0 access token that the app expects. The bitmask values are:<br>0: None<br>1: Security groups and Azure AD roles<br>2: Reserved<br>4: Reserved<br>Setting the bitmask to 7 will get all of the security groups, distribution groups, and Azure AD directory roles that the signed-in user is a member of. | `1` |
| `optionalClaims` | string | The optional claims returned in the token by the security token service for this specific app.<br>At this time, apps that support both personal accounts and Azure AD (registered through the app registration portal) cannot use optional claims. However, apps registered for just Azure AD using the v2.0 endpoint can get the optional claims they requested in the manifest. For more info, see [optional claims](active-directory-optional-claims.md). | `null` |
| `id` | Identifier string | The unique identifier for the app in the directory. This ID is not the identifier used to identify the app in any protocol transaction. It's used for the referencing the object in directory queries. | `"f7f9acfc-ae0c-4d6c-b489-0a81dc1652dd"` |
| `identifierUris` | String array | User-defined URI(s) that uniquely identify a Web app within its Azure AD tenant, or within a verified custom domain if the app is multi-tenant. | <code>[<br>&nbsp;&nbsp;"https://MyRegistererdApp"<br>]</code> |
| `informationalUrls` | string | Specifies the links to the app's terms of service and privacy statement. The terms of service and privacy statement are surfaced to users through the user consent experience. For more info, see [How to: Add Terms of service and privacy statement for registered Azure AD apps](howto-add-terms-of-service-privacy-statement.md). | <code>{<br>&nbsp;&nbsp;&nbsp;"marketing":"https://MyRegisteredApp/marketing",<br>&nbsp;&nbsp;&nbsp;"privacy":"https://MyRegisteredApp/privacystatement",<br>&nbsp;&nbsp;&nbsp;"support":"https://MyRegisteredApp/support",<br>&nbsp;&nbsp;&nbsp;"termsOfService":"https://MyRegisteredApp/termsofservice"<br>}</code> |
| `keyCredentials` | Type of array | Holds references to app-assigned credentials, string-based shared secrets and X.509 certificates. These credentials are used when requesting access tokens (when the app is acting as a client rather that as resource). | <code>[<br>&nbsp;{<br>&nbsp;&nbsp;&nbsp;"customKeyIdentifier":null,<br>&nbsp;&nbsp;&nbsp;"endDate":"2018-09-13T00:00:00Z",<br>&nbsp;&nbsp;&nbsp;"keyId":"\<guid>",<br>&nbsp;&nbsp;&nbsp;"startDate":"2017-09-12T00:00:00Z",<br>&nbsp;&nbsp;&nbsp;"type":"AsymmetricX509Cert",<br>&nbsp;&nbsp;&nbsp;"usage":"Verify",<br>&nbsp;&nbsp;&nbsp;"value":null<br>&nbsp;&nbsp;}<br>]</code> |
| `knownClientApplications` | Type of array | Used for bundling consent if you have a solution that contains two parts: a client app and a custom web API app. If you enter the appID of the client app into this value, the user will only have to consent once to the client app. Azure AD will know that consenting to the client means implicitly consenting to the web API and will automatically provision service principals for both the client and web API at the same time. Both the client and the web API app must be registered in the same tenant. | `[GUID]` |
| `logoUrl` | string | Read only value that points to the CDN URL to logo that was uploaded in the portal. | `https://MyRegisteredAppLogo` |
| `logoutUrl` | string | The URL to log out of the app. | `https://MyRegisteredAppLogout` |
| `name` | string | The display name for the app. | `MyRegisteredApp` |
| `oauth2AllowImplicitFlow` | boolean | Specifies whether this web app can request OAuth2.0 implicit flow access tokens. The default is false. This flag is used for browser-based apps, like Javascript single-page apps. To learn more, enter `OAuth 2.0 implicit grant flow` in the table of contents and see the topics about implicit flow. | `false` |
| `oauth2AllowIdTokenImplicitFlow` | boolean | Specifies whether this web app can request OAuth2.0 implicit flow ID tokens. The default is false. This flag is used for browser-based apps, like Javascript single-page apps. | `false` |
| `oauth2Permissions` | Type of array | Specifies the collection of OAuth 2.0 permission scopes that the web API (resource) app exposes to client apps. These permission scopes may be granted to client apps during consent. | <code>[<br>&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;"adminConsentDescription":"Allow the app to access resources on behalf of the signed-in user.",<br>&nbsp;&nbsp;&nbsp;"adminConsentDisplayName":"Access resource1",<br>&nbsp;&nbsp;&nbsp;"id":"\<guid>",<br>&nbsp;&nbsp;&nbsp;"isEnabled":true,<br>&nbsp;&nbsp;&nbsp;"type":"User",<br>&nbsp;&nbsp;&nbsp;"userConsentDescription":"Allow the app to access resource1 on your behalf.",<br>&nbsp;&nbsp;&nbsp;"userConsentDisplayName":"Access resources",<br>&nbsp;&nbsp;&nbsp;"value":"u| Specifies the collection of OAuth 2.0 permission scopes that the web API (resource) app exposes to client apps. These permission scopes may be granted to client apps during consent. ser_impersonation"<br>&nbsp;&nbsp;}<br>]</code> |
| `oauth2RequiredPostResponse` | boolean | Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow POST requests, as opposed to GET requests. The default is false, which specifies that only GET requests will be allowed. | `false` |
| `parentalControlSettings` | string | `countriesBlockedForMinors` specifies the countries in which the app is blocked for minors.<br>`legalAgeGroupRule` specifies the legal age group rule that applies to users of the app. Can be set to `Allow`, `RequireConsentForPrivacyServices`, `RequireConsentForMinors`, `RequireConsentForKids`, or `BlockMinors`.  | <code>{<br>&nbsp;&nbsp;&nbsp;"countriesBlockedForMinors":[],<br>&nbsp;&nbsp;&nbsp;"legalAgeGroupRule":"Allow"<br>} </code> |
| `passwordCredentials` | Type of array | See the description for the `keyCredentials` property. | <code>[<br>&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;"customKeyIdentifier":null,<br>&nbsp;&nbsp;&nbsp;"endDate":"2018-10-19T17:59:59.6521653Z",<br>&nbsp;&nbsp;&nbsp;"keyId":"\<guid>",<br>&nbsp;&nbsp;&nbsp;"startDate":"2016-10-19T17:59:59.6521653Z",<br>&nbsp;&nbsp;&nbsp;"value":null<br>&nbsp;&nbsp;&nbsp;}<br>] </code> |
| `preAuthorizedApplications` | Type of array | Lists applications and requested permissions for implicit consent. Requires an admin to have provided consent to the application. preAuthorizedApplications do not require the user to consent to the requested permissions. Permissions listed in preAuthorizedApplications do not require user consent. However, any additional requested permissions not listed in preAuthorizedApplications require user consent. | <code>[<br>&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;"appId": "abcdefg2-000a-1111-a0e5-812ed8dd72e8",<br>&nbsp;&nbsp;&nbsp;&nbsp;"permissionIds": [<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"8748f7db-21fe-4c83-8ab5-53033933c8f1"<br>&nbsp;&nbsp;&nbsp;&nbsp;]<br>&nbsp;&nbsp;}<br>]</code> |
| `replyUrlsWithType` | String array | This multi-value property holds the list of registered redirect_uri values that Azure AD will accept as destinations when returning tokens. Each uri value should contain an associated app type value. Supported type values are: `Web`, `InstalledClient`. | <code>"replyUrlsWithType":&nbsp;[<br>&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"url":&nbsp;"https://localhost:4400/services/office365/redirectTarget.html",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type":&nbsp;"InstalledClient"&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;}<br>]</code> |
| `requiredResourceAccess` | Type of array | With dynamic consent, `requiredResourceAccess` drives the admin consent experience and the user consent experience for users who are using static consent. However, this does not drive the user consent experience for the general case.<br>`resourceAppId` is the unique identifier for the resource that the app requires access to. This value should be equal to the appId declared on the target resource app.<br>`resourceAccess` is an array that lists the OAuth2.0 permission scopes and app roles that the app requires from the specified resource. Contains the `id` and `type` values of the specified resources. | <code>[<br>&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;"resourceAppId":"00000002-0000-0000-c000-000000000000",<br>&nbsp;&nbsp;&nbsp;&nbsp;"resourceAccess":[<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id":"311a71cc-e848-46a1-bdf8-97ff7156d8e6",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type":"Scope"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;&nbsp;]<br>&nbsp;&nbsp;}<br>] </code> |
| `samlMetadataUrl` | string | The URL to the SAML metadata for the app. | `https://MyRegisteredAppSAMLMetadata` |
| `signInUrl` | string | Specifies the URL to the app's home page. | `https://MyRegisteredApp` |
| `signInAudience` | string | Specifies what microsoft accounts are supported for the current application. Supported values are:<ul><li>**AzureADMyOrg** - Users with a Microsoft work or school account in my organization’s Azure AD tenant (i.e. single tenant)</li><li>**AzureADMultipleOrgs** - Users with a Microsoft work or school account in any organization’s Azure AD tenant (i.e. multi-tenant)</li> <li>**AzureADandPersonalMicrosoftAccount** - Users with a personal Microsoft account, or a work or school account in any organization’s Azure AD tenant</li></ul> | `AzureADandPersonalMicrosoftAccount` |
| `tags` | String array | Custom strings that can be used to categorize and identify the application. | <code>[<br>&nbsp;&nbsp;"ProductionApp"<br>]</code> |

## Next steps

* For more info on the relationship between an app's Application and Service Principal object(s), see [Application and service principal objects in Azure AD](app-objects-and-service-principals.md).
* See the [Azure AD developer glossary](developer-glossary.md) for definitions of some of the core Azure Active Directory (AD) developer concepts.

Use the following comments section to provide feedback that helps refine and shape our content.

<!--article references -->
[AAD-APP-OBJECTS]:app-objects-and-service-principals.md
[AAD-DEVELOPER-GLOSSARY]:developer-glossary.md
[AAD-GROUPS-FOR-AUTHORIZATION]: http://www.dushyantgill.com/blog/2014/12/10/authorization-cloud-applications-using-ad-groups/
[ADD-UPD-RMV-APP]:quickstart-v1-integrate-apps-with-azure-ad.md
[APPLICATION-ENTITY]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#application-entity
[APPLICATION-ENTITY-APP-ROLE]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#approle-type
[APPLICATION-ENTITY-OAUTH2-PERMISSION]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permission-type
[AZURE-PORTAL]: https://portal.azure.com
[DEV-GUIDE-TO-AUTH-WITH-ARM]: http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/
[GRAPH-API]: active-directory-graph-api.md
[IMPLICIT-GRANT]:v1-oauth2-implicit-grant-flow.md
[INTEGRATING-APPLICATIONS-AAD]: https://azure.microsoft.com/documentation/articles/active-directory-integrating-applications/
[O365-PERM-DETAILS]: https://msdn.microsoft.com/office/office365/HowTo/application-manifest
[O365-SERVICE-DAEMON-APPS]: https://msdn.microsoft.com/office/office365/howto/building-service-apps-in-office-365
[RBAC-CLOUD-APPS-AZUREAD]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/
