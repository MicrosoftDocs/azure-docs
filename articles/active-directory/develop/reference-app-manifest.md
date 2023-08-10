---
title: Understanding the Azure Active Directory app manifest
description: Detailed coverage of the Azure Active Directory app manifest, which represents an application's identity configuration in an Azure AD tenant, and is used to facilitate OAuth authorization, consent experience, and more.
services: active-directory
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: reference
ms.workload: identity
ms.date: 04/13/2023
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: sureshja
---

# Azure Active Directory app manifest

The application manifest contains a definition of all the attributes of an application object in the Microsoft identity platform. It also serves as a mechanism for updating the application object. For more info on the Application entity and its schema, see the [Graph API Application entity documentation](/graph/api/resources/application).

You can configure an app's attributes through the Azure portal or programmatically using [Microsoft Graph API](/graph/api/resources/application) or [Microsoft Graph PowerShell SDK](/powershell/module/microsoft.graph.applications/?view=graph-powershell-1.0&preserve-view=true). However, there are some scenarios where you'll need to edit the app manifest to configure an app's attribute. These scenarios include:

* If you registered the app as Azure AD multi-tenant and personal Microsoft accounts, you can't change the supported Microsoft accounts in the UI. Instead, you must use the application manifest editor to change the supported account type.
* To define permissions and roles that your app supports, you must modify the application manifest.

## Configure the app manifest

To configure the application manifest:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>. Search for and select the **Azure Active Directory** service.
1. Select **App registrations**.
1. Select the app you want to configure.
1. From the app's **Overview** page, select the **Manifest** section. A web-based manifest editor opens, allowing you to edit the manifest within the portal. Optionally, you can select **Download** to edit the manifest locally, and then use **Upload** to reapply it to your application.

## Manifest reference

This section describes the attributes found in the application manifest.

### id attribute

| Key | Value type |
| :--- | :--- |
| id | String |

The unique identifier for the app in the directory. This ID is not the identifier used to identify the app in any protocol transaction. It's used for the referencing the object in directory queries.

Example:

```json
    "id": "f7f9acfc-ae0c-4d6c-b489-0a81dc1652dd",
```

### acceptMappedClaims attribute

| Key | Value type |
| :--- | :--- |
| acceptMappedClaims | Nullable Boolean |

As documented on the [apiApplication resource type](/graph/api/resources/apiapplication#properties), this allows an application to use [claims mapping](active-directory-claims-mapping.md) without specifying a custom signing key.  Applications that receive tokens rely on the fact that the claim values are authoritatively issued by Azure AD and cannot be tampered with. However, when you modify the token contents through claims-mapping policies, these assumptions may no longer be correct. Applications must explicitly acknowledge that tokens have been modified by the creator of the claims-mapping policy to protect themselves from claims-mapping policies created by malicious actors.

> [!WARNING]
> Do not set `acceptMappedClaims` property to `true` for multi-tenant apps, which can allow malicious actors to create claims-mapping policies for your app.

Example:

```json
    "acceptMappedClaims": true,
```

### accessTokenAcceptedVersion attribute

| Key | Value type |
| :--- | :--- |
| accessTokenAcceptedVersion | Nullable Int32 |

Specifies the access token version expected by the resource. This parameter changes the version and format of the JWT produced independent of the endpoint or client used to request the access token.

The endpoint used, v1.0 or v2.0, is chosen by the client and only impacts the version of id_tokens. Resources need to explicitly configure `accesstokenAcceptedVersion` to indicate the supported access token format.

Possible values for `accesstokenAcceptedVersion` are 1, 2, or null. If the value is null, this parameter defaults to 1, which corresponds to the v1.0 endpoint.

If `signInAudience` is `AzureADandPersonalMicrosoftAccount`, the value must be `2`.

Example:

```json
    "accessTokenAcceptedVersion": 2,
```

### addIns attribute

| Key | Value type |
| :--- | :--- |
| addIns | Collection |

Defines custom behavior that a consuming service can use to call an app in specific contexts. For example, applications that can render file streams may set the `addIns` property for its "FileHandler" functionality. This parameter  will let services like Microsoft 365 call the application in the context of a document the user is working on.

Example:

```json
    "addIns": [
       {
        "id": "968A844F-7A47-430C-9163-07AE7C31D407",
        "type":" FileHandler",
        "properties": [
           {
              "key": "version",
              "value": "2"
           }
        ]
       }
    ],
```

### allowPublicClient attribute

| Key | Value type |
| :--- | :--- |
| allowPublicClient | Boolean |

Specifies the fallback application type. Azure AD infers the application type from the replyUrlsWithType by default. There are certain scenarios where Azure AD can't determine the client app type. For example, one such scenario is the [ROPC](https://tools.ietf.org/html/rfc6749#section-4.3) flow where HTTP request happens without a URL redirection). In those cases, Azure AD will interpret the application type based on the value of this property. If this value is set to true the fallback application type is set as public client, such as an installed app running on a mobile device. The default value is false which means the fallback application type is confidential client such as web app.

Example:

```json
    "allowPublicClient": false,
```

### appId attribute

| Key | Value type |
| :--- | :--- |
| appId | String |

Specifies the unique identifier for the app that is assigned to an app by Azure AD.

Example:

```json
    "appId": "601790de-b632-4f57-9523-ee7cb6ceba95",
```

### appRoles attribute

| Key | Value type |
| :--- | :--- |
| appRoles | Collection |

Specifies the collection of roles that an app may declare. These roles can be assigned to users, groups, or service principals. For more examples and info, see [Add app roles in your application and receive them in the token](howto-add-app-roles-in-azure-ad-apps.md).

Example:

```json
    "appRoles": [
        {
           "allowedMemberTypes": [
               "User"
           ],
           "description": "Read-only access to device information",
           "displayName": "Read Only",
           "id": "601790de-b632-4f57-9523-ee7cb6ceba95",
           "isEnabled": true,
           "value": "ReadOnly"
        }
    ],
```

### errorUrl attribute

| Key | Value type |
| :--- | :--- |
| errorUrl | String |

Unsupported.

### groupMembershipClaims attribute

| Key | Value type |
| :--- | :--- |
|groupMembershipClaims | String |

Configures the `groups` claim issued in a user or OAuth 2.0 access token that the app expects. To set this attribute, use one of the following valid string values:

- `"None"`
- `"SecurityGroup"` (for security groups and Azure AD roles)
- `"ApplicationGroup"` (this option includes only groups that are assigned to the application)
- `"DirectoryRole"` (gets the Azure AD directory roles the user is a member of)
- `"All"` (this will get all of the security groups, distribution groups, and Azure AD directory roles that the signed-in user is a member of).

Example:

```json
    "groupMembershipClaims": "SecurityGroup",
```

### optionalClaims attribute

| Key | Value type |
| :--- | :--- |
| optionalClaims | String |

The optional claims returned in the token by the security token service for this specific app.

At this time, apps that support both personal accounts and Azure AD (registered through the app registration portal) cannot use optional claims. However, apps registered for just Azure AD using the v2.0 endpoint can get the optional claims they requested in the manifest. For more info, see [Optional claims](active-directory-optional-claims.md).

Example:

```json
    "optionalClaims": null,
```


### identifierUris attribute

| Key | Value type |
| :--- | :--- |
| identifierUris | String Array |

User-defined URI(s) that uniquely identify a web app within its Azure AD tenant or verified customer owned domain.
When an application is used as a resource app, the identifierUri value is used to uniquely identify and access the resource.

[!INCLUDE [active-directory-identifierUri](../../../includes/active-directory-identifier-uri-patterns.md)]

Example:

```json
    "identifierUris": "https://contoso.onmicrosoft.com/fc4d2d73-d05a-4a9b-85a8-4f2b3a5f38ed",
```

### informationalUrls attribute

| Key | Value type |
| :--- | :--- |
| informationalUrls | String |

Specifies the links to the app's terms of service and privacy statement. The terms of service and privacy statement are surfaced to users through the user consent experience. For more info, see [How to: Add Terms of service and privacy statement for registered Azure AD apps](howto-add-terms-of-service-privacy-statement.md).

Example:

```json
    "informationalUrls": {
        "termsOfService": "https://MyRegisteredApp/termsofservice",
        "support": "https://MyRegisteredApp/support",
        "privacy": "https://MyRegisteredApp/privacystatement",
        "marketing": "https://MyRegisteredApp/marketing"
    },
```

### keyCredentials attribute

| Key | Value type |
| :--- | :--- |
| keyCredentials | Collection |

Holds references to app-assigned credentials, string-based shared secrets and X.509 certificates. These credentials are used when requesting access tokens (when the app is acting as a client rather that as a resource).

Example:

```json
    "keyCredentials": [
        {
           "customKeyIdentifier":null,
           "endDateTime":"2018-09-13T00:00:00Z",
           "keyId":"<guid>",
           "startDateTime":"2017-09-12T00:00:00Z",
           "type":"AsymmetricX509Cert",
           "usage":"Verify",
           "value":null
        }
    ],
```

### knownClientApplications attribute

| Key | Value type |
| :--- | :--- |
| knownClientApplications | String Array |

Used for bundling consent if you have a solution that contains two parts: a client app and a custom web API app. If you enter the appID of the client app into this value, the user will only have to consent once to the client app. Azure AD will know that consenting to the client means implicitly consenting to the web API. It will automatically provision service principals for both the client and web API at the same time. Both the client and the web API app must be registered in the same tenant.

Example:

```json
    "knownClientApplications": ["f7f9acfc-ae0c-4d6c-b489-0a81dc1652dd"],
```

### logoUrl attribute

| Key | Value type |
| :--- | :--- |
| logoUrl | String |

Read only value that points to the CDN URL to logo that was uploaded in the portal.

Example:

```json
    "logoUrl": "https://MyRegisteredAppLogo",
```

### logoutUrl attribute

| Key | Value type |
| :--- | :--- |
| logoutUrl | String |

The URL to log out of the app.

Example:

```json
    "logoutUrl": "https://MyRegisteredAppLogout",
```

### name attribute

| Key | Value type |
| :--- | :--- |
| name | String |

The display name for the app.

Example:

```json
    "name": "MyRegisteredApp",
```

### oauth2AllowImplicitFlow attribute

| Key | Value type |
| :--- | :--- |
| oauth2AllowImplicitFlow | Boolean |

Specifies whether this web app can request OAuth2.0 implicit flow access tokens. The default is false. This flag is used for browser-based apps, like JavaScript single-page apps. To learn more, enter `OAuth 2.0 implicit grant flow` in the table of contents and see the topics about implicit flow.

Example:

```json
    "oauth2AllowImplicitFlow": false,
```

### oauth2AllowIdTokenImplicitFlow attribute

| Key | Value type |
| :--- | :--- |
| oauth2AllowIdTokenImplicitFlow | Boolean |

Specifies whether this web app can request OAuth2.0 implicit flow ID tokens. The default is false. This flag is used for browser-based apps, like JavaScript single-page apps.

Example:

```json
    "oauth2AllowIdTokenImplicitFlow": false,
```

### oauth2Permissions attribute

| Key | Value type |
| :--- | :--- |
| oauth2Permissions | Collection |

Specifies the collection of OAuth 2.0 permission scopes that the web API (resource) app exposes to client apps. These permission scopes may be granted to client apps during consent.

Example:

```json
    "oauth2Permissions": [
       {
          "adminConsentDescription": "Allow the app to access resources on behalf of the signed-in user.",
          "adminConsentDisplayName": "Access resource1",
          "id": "<guid>",
          "isEnabled": true,
          "type": "User",
          "userConsentDescription": "Allow the app to access resource1 on your behalf.",
          "userConsentDisplayName": "Access resources",
          "value": "user_impersonation"
        }
    ],
```

### oauth2RequiredPostResponse attribute

| Key | Value type |
| :--- | :--- |
| oauth2RequiredPostResponse | Boolean |

Specifies whether, as part of OAuth 2.0 token requests, Azure AD will allow POST requests, as opposed to GET requests. The default is false, which specifies that only GET requests will be allowed.

Example:

```json
    "oauth2RequirePostResponse": false,
```

### parentalControlSettings attribute

| Key | Value type |
| :--- | :--- |
| parentalControlSettings | String |

- `countriesBlockedForMinors` specifies the countries/regions in which the app is blocked for minors.
- `legalAgeGroupRule` specifies the legal age group rule that applies to users of the app. Can be set to `Allow`, `RequireConsentForPrivacyServices`, `RequireConsentForMinors`, `RequireConsentForKids`, or `BlockMinors`.

Example:

```json
    "parentalControlSettings": {
        "countriesBlockedForMinors": [],
        "legalAgeGroupRule": "Allow"
    },
```

### passwordCredentials attribute

| Key | Value type |
| :--- | :--- |
| passwordCredentials | Collection |

See the description for the `keyCredentials` property.

Example:

```json
    "passwordCredentials": [
      {
        "customKeyIdentifier": null,
        "displayName": "Generated by App Service",
        "endDateTime": "2022-10-19T17:59:59.6521653Z",
        "hint": "Nsn",
        "keyId": "<guid>",
        "secretText": null,        
        "startDateTime":"2022-10-19T17:59:59.6521653Z"
      }
    ],
```

### preAuthorizedApplications attribute

| Key | Value type |
| :--- | :--- |
| preAuthorizedApplications | Collection |

Lists applications and requested permissions for implicit consent. Requires an admin to have provided consent to the application. preAuthorizedApplications do not require the user to consent to the requested permissions. Permissions listed in preAuthorizedApplications do not require user consent. However, any additional requested permissions not listed in preAuthorizedApplications require user consent.

Example:

```json
    "preAuthorizedApplications": [
       {
          "appId": "abcdefg2-000a-1111-a0e5-812ed8dd72e8",
          "permissionIds": [
             "8748f7db-21fe-4c83-8ab5-53033933c8f1"
            ]
        }
    ],
```

### publisherDomain attribute

| Key | Value type |
| :--- | :--- |
| publisherDomain | String |

The verified publisher domain for the application. Read-only.

Example:

```json
    "publisherDomain": "{tenant}.onmicrosoft.com",
```

### replyUrlsWithType attribute

| Key | Value type |
| :--- | :--- |
| replyUrlsWithType | Collection |

This multi-value property holds the list of registered redirect_uri values that Azure AD will accept as destinations when returning tokens. Each URI value should contain an associated app type value. Supported type values are:

- `Web`
- `InstalledClient`
- `Spa`

To learn more, see [replyUrl restrictions and limitations](./reply-url.md).

Example:

```json
    "replyUrlsWithType": [
       {
          "url": "https://localhost:4400/services/office365/redirectTarget.html",
          "type": "InstalledClient"
       }
    ],
```

### requiredResourceAccess attribute

| Key | Value type |
| :--- | :--- |
| requiredResourceAccess | Collection |

With dynamic consent, `requiredResourceAccess` drives the admin consent experience and the user consent experience for users who are using static consent. However, this parameter doesn't drive the user consent experience for the general case.

- `resourceAppId` is the unique identifier for the resource that the app requires access to. This value should be equal to the appId declared on the target resource app.
- `resourceAccess` is an array that lists the OAuth2.0 permission scopes and app roles that the app requires from the specified resource. Contains the `id` and `type` values of the specified resources.

Example:

```json
    "requiredResourceAccess": [
        {
            "resourceAppId": "00000002-0000-0000-c000-000000000000",
            "resourceAccess": [
                {
                    "id": "311a71cc-e848-46a1-bdf8-97ff7156d8e6",
                    "type": "Scope"
                }
            ]
        }
    ],
```

### samlMetadataUrl attribute

| Key | Value type |
| :--- | :--- |
| samlMetadataUrl | String |

The URL to the SAML metadata for the app.

Example:

```json
    "samlMetadataUrl": "https://MyRegisteredAppSAMLMetadata",
```

### signInUrl attribute

| Key | Value type |
| :--- | :--- |
| signInUrl | String |

Specifies the URL to the app's home page.

Example:

```json
    "signInUrl": "https://MyRegisteredApp",
```

### signInAudience attribute

| Key | Value type |
| :--- | :--- |
| signInAudience | String |

Specifies what Microsoft accounts are supported for the current application. Supported values are:
- `AzureADMyOrg` - Users with a Microsoft work or school account in my organization's Azure AD tenant (for example, single tenant)
- `AzureADMultipleOrgs` - Users with a Microsoft work or school account in any organization's Azure AD tenant (for example, multi-tenant)
- `AzureADandPersonalMicrosoftAccount` - Users with a personal Microsoft account, or a work or school account in any organization's Azure AD tenant
- `PersonalMicrosoftAccount` - Personal accounts that are used to sign in to services like Xbox and Skype.

Example:

```json
    "signInAudience": "AzureADandPersonalMicrosoftAccount",
```

### tags attribute

| Key | Value type |
| :--- | :--- |
| tags | String Array  |

Custom strings that can be used to categorize and identify the application.

Example:

```json
    "tags": [
       "ProductionApp"
    ],
```

## Common issues

### Manifest limits

An application manifest has multiple attributes that are referred to as collections; for example, appRoles, keyCredentials, knownClientApplications, identifierUris, redirectUris, requiredResourceAccess, and oauth2Permissions. Within the complete application manifest for any application, the total number of entries in all the collections combined has been capped at 1200. If you previously specify 100 redirect URIs in the application manifest, then you're only left with 1100 remaining entries to use across all other collections combined that make up the manifest.

> [!NOTE]
> In case you try to add more than 1200 entries in the application manifest, you may see an error **"Failed to update application xxxxxx. Error details: The size of the manifest has exceeded its limit. Please reduce the number of values and retry your request."**

### Unsupported attributes

The application manifest represents the schema of the underlying application model in Azure AD. As the underlying schema evolves, the manifest editor will be updated to reflect the new schema from time to time. As a result, you may notice new attributes showing up in the application manifest. In rare occasions, you may notice a syntactic or semantic change in the existing attributes or you may find an attribute that existed previously are not supported anymore. For example, you will see new attributes in the [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908), which are known with a different name in the App registrations (Legacy) experience.

| App registrations (Legacy)| App registrations           |
|---------------------------|-----------------------------|
| `availableToOtherTenants` | `signInAudience`            |
| `displayName`             | `name`                      |
| `errorUrl`                | -                           |
| `homepage`                | `signInUrl`                 |
| `objectId`                | `Id`                        |
| `publicClient`            | `allowPublicClient`         |
| `replyUrls`               | `replyUrlsWithType`         |

For descriptions for these attributes, see the [manifest reference](#manifest-reference) section.

When you try to upload a previously downloaded manifest, you may see one of the following errors. This error is likely because the manifest editor now supports a newer version of the schema, which doesn't match with the one you're trying to upload.

* "Failed to update xxxxxx application. Error detail: Invalid object identifier 'undefined'. []."
* "Failed to update xxxxxx application. Error detail: One or more property values specified are invalid. []."
* "Failed to update xxxxxx application. Error detail: Not allowed to set availableToOtherTenants in this api version for update. []."
* "Failed to update xxxxxx application. Error detail: Updates to 'replyUrls' property isn't allowed for this application. Use 'replyUrlsWithType' property instead. []."
* "Failed to update xxxxxx application. Error detail: A value without a type name was found and no expected type is available. When the model is specified, each value in the payload must have a type that can be either specified in the payload, explicitly by the caller or implicitly inferred from the parent value. []"

When you see one of these errors, we recommend the following actions:

1. Edit the attributes individually in the manifest editor instead of uploading a previously downloaded manifest. Use the [manifest reference](#manifest-reference) table to understand the syntax and semantics of old and new attributes so that you can successfully edit the attributes you're interested in.
1. If your workflow requires you to save the manifests in your source repository for use later, we suggest rebasing the saved manifests in your repository with the one you see in the **App registrations** experience.

## Next steps

* For more info on the relationship between an app's application and service principal object(s), see [Application and service principal objects in Azure AD](app-objects-and-service-principals.md).
* See the [Microsoft identity platform developer glossary](developer-glossary.md) for definitions of some core Microsoft identity platform developer concepts.

Use the following comments section to provide feedback that helps refine and shape our content.

<!--article references -->
[AAD-APP-OBJECTS]:app-objects-and-service-principals.md
[AAD-DEVELOPER-GLOSSARY]:developer-glossary.md
[AAD-GROUPS-FOR-AUTHORIZATION]: http://www.dushyantgill.com/blog/2014/12/10/authorization-cloud-applications-using-ad-groups/
[ADD-UPD-RMV-APP]:quickstart-v1-integrate-apps-with-azure-ad.md
[DEV-GUIDE-TO-AUTH-WITH-ARM]: http://www.dushyantgill.com/blog/2015/05/23/developers-guide-to-auth-with-azure-resource-manager-api/
[GRAPH-API]: /graph/migrate-azure-ad-graph-planning-checklist
[IMPLICIT-GRANT]:v1-oauth2-implicit-grant-flow.md
[INTEGRATING-APPLICATIONS-AAD]: ./quickstart-register-app.md
[O365-PERM-DETAILS]: /graph/permissions-reference
[RBAC-CLOUD-APPS-AZUREAD]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/
