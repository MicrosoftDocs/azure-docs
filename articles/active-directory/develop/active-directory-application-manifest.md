---
title: Understanding the Azure Active Directory Application Manifest | Microsoft Docs
description: Detailed coverage of the Azure Active Directory application manifest, which represents an application's identity configuration in an Azure AD tenant, and is used to facilitate OAuth authorization, consent experience, and more.
services: active-directory
documentationcenter: ''
author: sureshja
manager: mbaldwin
editor: ''

ms.assetid: 4804f3d4-0ff1-4280-b663-f8f10d54d184
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/20/2017
ms.author: sureshja
ms.custom: aaddev
ms.reviewer: elisol

---
# Azure Active Directory application manifest
Applications that integrate with Azure Active Directory (AD) must be registered with an Azure AD tenant, providing a persistent identity configuration for the application. This configuration is consulted at runtime, enabling scenarios that allow an application to outsource and broker authentication/authorization through Azure AD. For more information about the Azure AD application model, see the [Adding, Updating, and Removing an Application][ADD-UPD-RMV-APP] article.
> [!NOTE]
> You can update the application manifest using the inline editor or you can download and upload it as a JSON file.

**Manifest Reference**

|Key  |Value Type |Example Value  |Description  |
|---------|---------|---------|---------|
|appID     |  Guid string       | 2b167942-d47b-4609-906d-e274a43c04af        |  The unique identifier for the application.       |
|appRoles     |    array     |         |     The collection of roles that an application may declare. These roles can be assigned to users, groups or service principals.    |
|availableToOtherTenants     |  boolean       |     true    |     If this value is set to true, the application is shared with other tenants; otherwise, false.    |
|displayName     |string         |MyRegisteredApp         |The display name for the application. 
|errorURL     |string         |http://MyRegisteredAppError         |The URL for errors encountered in an application.
|groupMembershipClaims     |    string     |         |   A bitmask that configures the "groups" claim issued in a user or OAuth 2.0 access token that the application expects. The bitmask values are: 0: None, 1: Security groups and Azure AD roles, 2: Reserved, and 4: Reserved. Setting the bitmask to 7 will get all of the security groups, distribution groups, and Azure AD directory roles that the signed-in user is a member of.      |
|optionalClaims     |  string       |         |    The optional claims returned in the token by the security token service for this specific app.     |
|acceptMappedClaims     |         |         |         |
|homepage     |  string       |http://MyRegistererdApp         |    The URL to the application's home page.     |
|identifierUris     |  array       |         |   User-defined URI(s) that uniquely identify a Web application within its Azure AD tenant, or within a verified custom domain if the application is multi-tenant.      |
|keyCredentials     |   array      |         |   The collection of key credentials associated with the application      |
|knownClientApplications     |     array    |         |     Client applications that are tied to this resource application. Consent to any of the known client applications will result in implicit consent to the resource application through a combined consent dialog (showing the OAuth permission scopes required by the client and the resource).    |
|logoutUrl     |   string      |     http://MyRegisteredAppLogout    |   The URL to logout of the application.      |
|oauth2AllowImplicitFlow     |   boolean      |         |       Specifies whether this web application can request OAuth2.0 implicit flow tokens. The default is false.  |
|oauth2AllowUrlPathMatching     |   boolean      |         |   Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow path matching of the redirect URI against the application's replyUrls. The default is false.      |
|oauth2Permissions     | array         |         |  The collection of OAuth 2.0 permission scopes that the web API (resource) application exposes to client applications. These permission scopes may be granted to client applications during consent. |
|oauth2RequiredPostResponse     | boolean        |         |      Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow POST requests, as opposed to GET requests. The default is false, which specifies that only GET requests will be allowed.   
|objectId     | Guid string        |         |    The unique identifier for the application (inherited from the directory object).     |
|passwordCredentials     | array        |         |    The collection of password credentioals associated with the application     |
|publicClient     |  boolean       |         | Specifies whether an application is a public client (such as an installed application running on a mobile device). Default is false.        |
|supportsConvergence     |  string       |         |  Specifies resources that this application requires access to and the set of OAuth permission scopes and application roles that it needs under each of those resources.       |
|requiredResourceAccess     |     array    |         |   Specifies resources that this application requires access to and the set of OAuth permission scopes and application roles that it needs under each of those resources. This pre-configuration of required resource access drives the consent experience.|
|resourceAppId     |    Guid string     |         |   The unique identifier for the resource that the application requires access to. This should be equal to the appId declared on the target resource application.      |
|resourceAccess     |  array       |         |   The list of OAuth2.0 permission scopes and app roles that the application requires from the specified resource.       |
|samlMetadataUrl     |    string     |         |  The URL to the SAML metadata for the application.       | 

## Next steps
* For more details on the relationship between an application's Application and Service Principal object(s), see [Application and service principal objects in Azure AD][AAD-APP-OBJECTS].
* See the [Azure AD developer glossary][AAD-DEVELOPER-GLOSSARY] for definitions of some of the core Azure Active Directory (AD) developer concepts.

Please use the comments section below to provide feedback and help us refine and shape our content.

<!--article references -->
[AAD-APP-OBJECTS]: active-directory-application-objects.md
[AAD-DEVELOPER-GLOSSARY]: active-directory-dev-glossary.md
[AAD-GROUPS-FOR-AUTHORIZATION]: http://www.dushyantgill.com/blog/2014/12/10/authorization-cloud-applications-using-ad-groups/
[ADD-UPD-RMV-APP]: active-directory-integrating-applications.md
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

