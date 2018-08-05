---
title: Understanding the Azure Active Directory application manifest | Microsoft Docs
description: Detailed coverage of the Azure Active Directory application manifest, which represents an application's identity configuration in an Azure AD tenant, and is used to facilitate OAuth authorization, consent experience, and more.
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
ms.date: 07/20/2017
ms.author: celested
ms.custom: aaddev
ms.reviewer: elisol, sureshja
---

# Azure Active Directory application manifest
Apps that integrate with Azure AD must be registered with an Azure AD tenant. This app can be configured using the app manifest (under the Azure AD blade) in the [Azure portal](https://portal.azure.com).

## Manifest Reference

>[!div class="mx-tdBreakAll"]
>[!div class="mx-tdCol2BreakAll"]
|Key  |Value Type |Example Value  |Description  |
|---------|---------|---------|---------|
|appID     |  Identifier string       |""|  The unique identifier for the application that is assigned to an app by Azure AD.|
|appRoles     |    Type of array     |<code>[{<br>&emsp;"allowedMemberTypes": [<br>&emsp;&nbsp;&nbsp;&nbsp;"User"<br>&emsp;],<br>&emsp;"description":"Read-only access to device information",<br>&emsp;"displayName":"Read Only",<br>&emsp;"id":guid,<br>&emsp;"isEnabled":true,<br>&emsp;"value":"ReadOnly"<br>}]</code>|The collection of roles that an application may declare. These roles can be assigned to users, groups, or service principals.|
|availableToOtherTenants|boolean|`true`|If this value is set to true, the application is available to other tenants. If set to false, the app is only available to the tenant it is registered in. For more information, see: [How to sign in any Azure Active Directory (AD) user using the multi-tenant application pattern](active-directory-devhowto-multi-tenant-overview.md). |
|displayName     |string         |`MyRegisteredApp`         |The display name for the application. |
|errorURL     |string         |`http://MyRegisteredAppError`         |The URL for errors encountered in an application. |
|groupMembershipClaims     |    string     |    `1`     |   A bitmask that configures the "groups" claim issued in a user or OAuth 2.0 access token that the application expects. The bitmask values are: 0: None, 1: Security groups and Azure AD roles, 2: Reserved, and 4: Reserved. Setting the bitmask to 7 will get all of the security groups, distribution groups, and Azure AD directory roles that the signed-in user is a member of. |
|optionalClaims     |  string       |     `null`    |    The [optional claims](active-directory-optional-claims.md) returned in the token by the security token service for this specific app. |
|acceptMappedClaims    |      boolean   | `true`        |    If this value is set to true,  it allows an application to use claims mapping without specifying a custom signing key.|
|homepage     |  string       |`http://MyRegistererdApp`         |    The URL to the application's home page. |
|identifierUris     |  String array       | `http://MyRegistererdApp`        |   User-defined URI(s) that uniquely identify a Web application within its Azure AD tenant, or within a verified custom domain if the application is multi-tenant. |
|keyCredentials     |   Type of array      | <code>[{<br>&nbsp;"customKeyIdentifier":null,<br>"endDate":"2018-09-13T00:00:00Z",<br>"keyId":"\<guid>",<br>"startDate":"2017-09-12T00:00:00Z",<br>"type":"AsymmetricX509Cert",<br>"usage":"Verify",<br>"value":null<br>}]</code>      |   This property holds references to application-assigned credentials, string-based shared secrets and X.509 certificates. These credentials are used when requesting access tokens (when the app is acting as a client rather that as resource). |
|knownClientApplications     |     Type of array    |    [guid]     |     The value is used for bundling consent if you have a solution that contains two parts, a client application and a custom web API application. If you enter the appID of the client application into this value, the user will only have to consent once to the client application. Azure AD will know that consenting to the client means implicitly consenting to the web API and will automatically provision service principals for both the client and web API at the same time. Both the client and the web API application must be registered in the same tenant.|
|logoutUrl     |   string      |     `http://MyRegisteredAppLogout`    |   The URL to logout of the application. |
|oauth2AllowImplicitFlow     |   boolean      |  `false`       |       Specifies whether this web application can request OAuth2.0 implicit flow tokens. The default is false. This flag is used for browser-based apps, like Javascript single page apps. |
|oauth2AllowUrlPathMatching     |   boolean      |  `false`       |   Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow path matching of the redirect URI against the application's replyUrls. The default is false. |
|oauth2Permissions     | Type of array         |      <code>[{<br>"adminConsentDescription":"Allow the application to access resources on behalf of the signed-in user.",<br>"adminConsentDisplayName":"Access resource1",<br>"id":"\<guid>",<br>"isEnabled":true,<br>"type":"User",<br>"userConsentDescription":"Allow the application to access resource1 on your behalf.",<br>"userConsentDisplayName":"Access resources",<br>"value":"user_impersonation"<br>}]  </code> |  The collection of OAuth 2.0 permission scopes that the web API (resource) application exposes to client applications. These permission scopes may be granted to client applications during consent. |
|oauth2RequiredPostResponse     | boolean        |    `false`     |      Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow POST requests, as opposed to GET requests. The default is false, which specifies that only GET requests will be allowed. 
|objectId     | Identifier string        |     ""    |    The unique identifier for the application in the directory. This ID is not the identifier used to identify the app in any protocol transaction. It is user for the referencing the object in directory queries.|
|passwordCredentials     | Type of array        |   <code>[{<br>"customKeyIdentifier":null,<br>"endDate":"2018-10-19T17:59:59.6521653Z",<br>"keyId":"\<guid>",<br>"startDate":"2016-10-19T17:59:59.6521653Z",<br>"value":null<br>}]  </code>    |    See the description for the keyCredentials property. |
|publicClient     |  boolean       |      `false`   | Specifies whether an application is a public client (such as an installed application running on a mobile device). Default is false. |
|supportsConvergence     |  boolean       |   `false`      | This property should not be edited. Accept the default value. |
|replyUrls     |  String array       |   `http://localhost`     |  This multivalue property holds the list of registered redirect_uri values that Azure AD will accept as destinations when returning tokens. |
|requiredResourceAccess     |     Type of array    |    <code>[{<br>"resourceAppId":"00000002-0000-0000-c000-000000000000",<br>"resourceAccess":[{<br>&nbsp;&nbsp;&nbsp;&nbsp;"id":"311a71cc-e848-46a1-bdf8-97ff7156d8e6",<br>&nbsp;&nbsp;&nbsp;&nbsp;"type":"Scope"<br>&nbsp;&nbsp;}]<br>}] </code>    |   Specifies resources that this application requires access to and the set of OAuth permission scopes and application roles that it needs under each of those resources. This pre-configuration of required resource access drives the consent experience.|
|resourceAppId     |    Identifier string     |  ""      |   The unique identifier for the resource that the application requires access to. This value should be equal to the appId declared on the target resource application. |
|resourceAccess     |  Type of array       | See the example value for the requiredResourceAccess property. |   The list of OAuth2.0 permission scopes and app roles that the application requires from the specified resource (contains the ID and type values of the specified resources)        |
|samlMetadataUrl    |string| `http://MyRegisteredAppSAMLMetadata` |The URL to the SAML metadata for the application.| 

## Next steps
* For more information on the relationship between an application's Application and Service Principal object(s), see [Application and service principal objects in Azure AD][AAD-APP-OBJECTS].
* See the [Azure AD developer glossary][AAD-DEVELOPER-GLOSSARY] for definitions of some of the core Azure Active Directory (AD) developer concepts.

Use the following comments section to provide feedback that helps refine and shape our content.

<!--article references -->
[AAD-APP-OBJECTS]: active-directory-application-objects.md
[AAD-DEVELOPER-GLOSSARY]: active-directory-dev-glossary.md
[AAD-GROUPS-FOR-AUTHORIZATION]: http://www.dushyantgill.com/blog/2014/12/10/authorization-cloud-applications-using-ad-groups/
[ADD-UPD-RMV-APP]:quickstart-v1-integrate-apps-with-azure-ad.md
[APPLICATION-ENTITY]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#application-entity
[APPLICATION-ENTITY-APP-ROLE]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#approle-type
[APPLICATION-ENTITY-OAUTH2-PERMISSION]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permission-type
[AZURE-PORTAL]: https://portal.azure.com
[DEV-GUIDE-TO-AUTH-WITH-ARM]: http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/
[GRAPH-API]: active-directory-graph-api.md
[IMPLICIT-GRANT]: active-directory-dev-understanding-oauth2-implicit-grant.md
[INTEGRATING-APPLICATIONS-AAD]: https://azure.microsoft.com/documentation/articles/active-directory-integrating-applications/
[O365-PERM-DETAILS]: https://msdn.microsoft.com/office/office365/HowTo/application-manifest
[O365-SERVICE-DAEMON-APPS]: https://msdn.microsoft.com/office/office365/howto/building-service-apps-in-office-365
[RBAC-CLOUD-APPS-AZUREAD]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/

