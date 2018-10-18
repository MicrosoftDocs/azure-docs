---
title: Learn how to provide optional claims to your Azure AD application | Microsoft Docs
description: A guide for adding custom or additional claims to the SAML 2.0 and JSON Web Tokens (JWT) tokens issued by Azure Active Directory. 
documentationcenter: na
author: CelesteDG
services: active-directory
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/05/2018
ms.author: celested
ms.reviewer: hirsin
ms.custom: aaddev
---

# How to: Provide optional claims to your Azure AD app (Public Preview)

This feature is used by application developers to specify which claims they want in tokens sent to their application. You can use optional claims to:
- Select additional claims to include in tokens for your application.
- Change the behavior of certain claims that Azure AD returns in tokens.
- Add and access custom claims for your application. 

> [!Note]
> This capability currently is in public preview. Be prepared to revert or remove any changes. The feature is available in any Azure AD subscription during public preview. However, when the feature becomes generally available, some aspects of the feature might require an Azure AD premium subscription.

For the list of standard claims and how they are used in tokens, see the [basics of tokens issued by Azure AD](v1-id-and-access-tokens.md). 

One of the goals of the [v2.0 Azure AD endpoint](active-directory-appmodel-v2-overview.md) is smaller token sizes to ensure optimal performance by clients.  As a result, several claims formerly included in the access and ID tokens are no longer present in v2.0 tokens and must be asked for specifically on a per-application basis.

  

**Table 1: Applicability**

| Account Type | V1.0 Endpoint | V2.0 Endpoint  |
|--------------|---------------|----------------|
| Personal Microsoft account  | N/A - RPS Tickets are used instead | Support coming |
| Azure AD account          | Supported                          | Supported with caveats      |

> [!Important]
> At this time, apps that support both personal accounts and Azure AD (registered through the [app registration portal](https://apps.dev.microsoft.com)) cannot use optional claims.  However, apps registered for just Azure AD using the v2.0 endpoint can get the optional claims they requested in the manifest.

## Standard optional claims set
The set of optional claims available by default for applications to use are listed below.  To add custom optional claims for your application, see [Directory Extensions](active-directory-optional-claims.md#Configuring-custom-claims-via-directory-extensions), below.  Note that when adding claims to the **access token**, this will apply to access tokens requested *for* the application (a web API), not those *by* the application.  This ensures that no matter the client accessing your API, the right data is present in the access token they use to authenticate against your API.

> [!Note]
>The majority of these claims can be included in JWTs for v1.0 and v2.0 tokens, but not SAML tokens, except where noted in the Token Type column.  Additionally, while optional claims are only supported for AAD users currently, MSA support is being added.  When MSA has optional claims support on the v2.0 endpoint, the User Type column will denote if a claim is available for an AAD or MSA user.  

**Table 2: Standard optional claim set**

| Name                        | Description   | Token Type | User Type | Notes  |
|-----------------------------|----------------|------------|-----------|--------|
| `auth_time`                | Time when the user last authenticated.  See OpenID Connect spec.| JWT        |           |  |
| `tenant_region_scope`      | Region of the resource tenant | JWT        |           | |
| `signin_state`             | Sign in state claim   | JWT        |           | 6 return values, as flags:<br> "dvc_mngd": Device is managed<br> "dvc_cmp": Device is compliant<br> "dvc_dmjd": Device is domain joined<br> "dvc_mngd_app": Device is managed via MDM<br> "inknownntwk": Device is inside a known network.<br> "kmsi": Keep Me Signed In was used. <br> |
| `controls`                 | Multivalue claim containing the session controls enforced by Conditional Access policies.  | JWT        |           | 3 values:<br> "app_res": The app needs to enforce more granular restrictions. <br> "ca_enf": Conditional Access enforcement was deferred and is still required. <br> "no_cookie": This token is insufficient to exchange for a cookie in the browser. <br>  |
| `home_oid`                 | For guest users, the object ID of the user in the user’s home tenant.| JWT        |           | |
| `sid`                      | Session ID, used for per-session user signout. | JWT        |           |         |
| `platf`                    | Device platform    | JWT        |           | Restricted to managed devices that can verify device type.|
| `verified_primary_email`   | Sourced from the user’s PrimaryAuthoritativeEmail      | JWT        |           |         |
| `verified_secondary_email` | Sourced from the user’s SecondaryAuthoritativeEmail   | JWT        |           |        |
| `enfpolids`                | Enforced policy IDs. A list of the policy IDs that were evaluated for the current user.  | JWT |  |  |
| `vnet`                     | VNET specifier information.    | JWT        |           |      |
| `fwd`                      | IP address.| JWT    |   | Adds the original IPv4 address of the requesting client (when inside a VNET) |
| `ctry`                     | User’s country | JWT |           | Azure AD returns the `ctry` optional claim if it's present and the value of the claim is a standard two-letter country code, such as FR, JP, SZ, and so on. |
| `tenant_ctry`              | Resource tenant’s country | JWT | | |
| `xms_pdl`		     | Preferred data location   | JWT | | For Multi-Geo tenants, this is the 3-letter code showing which geographic region the user is in.  For more details, see the [Azure AD Connect documentation about preferred data location](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-feature-preferreddatalocation). <br> For example: `APC` for Asia Pacific. |
| `xms_pl`                   | User preferred language  | JWT ||The user’s preferred language, if set.  Sourced from their home tenant, in guest access scenarios.  Formatted LL-CC (“en-us”). |
| `xms_tpl`                  | Tenant preferred language| JWT | | The resource tenant’s preferred language, if set.  Formatted LL (“en”). |
| `ztdid`                    | Zero-touch Deployment ID | JWT | | The device identity used for [Windows AutoPilot](https://docs.microsoft.com/windows/deployment/windows-autopilot/windows-10-autopilot) |
| `acct`   		     | Users account status in tenant.   | JWT, SAML | | If the user is a member of the tenant, the value is `0`.  If they are a guest, the value is `1`.  |
| `upn`                      | UserPrincipalName claim.  | JWT, SAML  |           | Although this claim is automatically included, you can specify it as an optional claim to attach additional properties to modify its behavior in the guest user case.  <br> Additional properties: <br> `include_externally_authenticated_upn` <br> `include_externally_authenticated_upn_without_hash` |

### v2.0 optional claims

These claims are always included in v1.0 tokens, but not included in v2.0 tokens unless requested.  These claims are only applicable for  JWTs (ID tokens and Access Tokens).  

**Table 3: V2.0-only optional claims**

| JWT Claim     | Name                            | Description                                                                                                                    | Notes |
|---------------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------|-------|
| `ipaddr`      | IP Address                      | The IP address the client logged in from.                                                                                      |       |
| `onprem_sid`  | On-Premises Security Identifier |                                                                                                                                |       |
| `pwd_exp`     | Password Expiration Time        | The datetime at which the password expires.                                                                                    |       |
| `pwd_url`     | Change Password URL             | A URL that the user can visit to change their password.                                                                        |       |
| `in_corp`     | Inside Corporate Network        | Signals if the client is logging in from the corporate network. If they are not, the claim is not included                     |       |
| `nickname`    | Nickname                        | An additional name for the user, separate from first or last name.                                                             |       |                                                                                                                |       |
| `family_name` | Last Name                       | Provides the last name, surname, or family name of the user as defined in the Azure AD user object. <br>"family_name":"Miller" |       |
| `given_name`  | First name                      | Provides the first or "given" name of the user, as set on the Azure AD user object.<br>"given_name": "Frank"                   |       |

### Additional properties of optional claims

Some optional claims can be configured to change the way the claim is returned.  These additional properties are mostly used to help migration of on-premises applications with different data expectations (for example, `include_externally_authenticated_upn_without_hash` helps with clients that cannot handle hashmarks (`#`) in the UPN)

**Table 4: Values for configuring standard optional claims**

| Property name                                     | Additional Property name                                                                                                             | Description |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|-------------|
| `upn`                                                 |                                                                                                                                      |  Can be used for both SAML and JWT responses.            |
| | `include_externally_authenticated_upn`              | Includes the guest UPN as stored in the resource tenant.  For example, `foo_hometenant.com#EXT#@resourcetenant.com`                            |             
| | `include_externally_authenticated_upn_without_hash` | Same as above, except that the hashmarks (`#`) are replaced with underscores (`_`) , for example `foo_hometenant.com_EXT_@resourcetenant.com` |             

> [!Note]
>Specifying the upn optional claim without an additional property does not change any behavior – in order to see a new claim issued in the token, at least one of the additional properties must be added. 

#### Additional properties example

```json
 "optionalClaims": 
   {
       "idToken": [ 
             { 
                "name": "upn", 
	     	"essential": false,
                "additionalProperties": [ "include_externally_authenticated_upn"]  
              }
        ]
}
```

This OptionalClaims object causes the ID token returned to the client to include another upn with the additional home tenant and resource tenant information.  This will only change the `upn` claim in the token if the user is a guest in the tenant (that uses a different IDP for authentication). 

## Configuring optional claims

You can configure optional claims for your application by modifying the application manifest (See example below). For more information, see the [Understanding the Azure AD application manifest article](reference-app-manifest.md).

**Sample schema:**

```json
"optionalClaims":  
   {
       "idToken": [
             { 
                   "name": "auth_time", 
                   "essential": false
              }
        ],
 "accessToken": [ 
             {
                    "name": "ipaddr", 
                    "essential": false
              }
        ],
"saml2Token": [ 
              { 
                    "name": "upn", 
                    "essential": true
               },
               { 
                    "name": "extension_ab603c56068041afb2f6832e2a17e237_skypeId",
                    "source": "user", 
                    "essential": true
               }
       ]
   }
```

### OptionalClaims Type

Declares the optional claims requested by an application. An application can configure optional claims to be returned in each of three types of tokens (ID token, access token, SAML 2 token) it can receive from the security token service. The application can configure a different set of optional claims to be returned in each token type. The OptionalClaims property of the Application entity is an OptionalClaims object.

**Table 5: OptionalClaims Type Properties**

| Name        | Type                       | Description                                           |
|-------------|----------------------------|-------------------------------------------------------|
| `idToken`     | Collection (OptionalClaim) | The optional claims returned in the JWT ID token.     |
| `accessToken` | Collection (OptionalClaim) | The optional claims returned in the JWT access token. |
| `saml2Token`  | Collection (OptionalClaim) | The optional claims returned in the SAML token.       |

### OptionalClaim Type

Contains an optional claim associated with an application or a service principal. The idToken, accessToken, and saml2Token properties of the [OptionalClaims](https://msdn.microsoft.com/library/azure/ad/graph/api/entity-and-complex-type-reference#optionalclaims-type) type is a collection of OptionalClaim.
If supported by a specific claim, you can also modify the behavior of the OptionalClaim using the AdditionalProperties field.

**Table 6: OptionalClaim Type Properties**

| Name                 | Type                    | Description                                                                                                                                                                                                                                                                                                   |
|----------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`                 | Edm.String              | The name of the optional claim.                                                                                                                                                                                                                                                                               |
| `source`               | Edm.String              | The source (directory object) of the claim. There are predefined claims and user-defined claims from extension properties. If the source value is null, the claim is a predefined optional claim. If the source value is user, the value in the name property is the extension property from the user object. |
| `essential`            | Edm.Boolean             | If the value is true, the claim specified by the client is necessary to ensure a smooth authorization experience for the specific task requested by the end user. The default value is false.                                                                                                                 |
| `additionalProperties` | Collection (Edm.String) | Additional properties of the claim. If a property exists in this collection, it modifies the behavior of the optional claim specified in the name property.                                                                                                                                                   |
## Configuring custom claims via directory extensions

In addition to the standard optional claims set, tokens can also be configured to include directory schema extensions (see the [Directory schema extensions article](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-directory-schema-extensions) for more information).  This feature is useful for attaching additional user information that your app can use – for example, an additional identifier or important configuration option that the user has set. 

> [!Note]
> Directory schema extensions are an AAD-only feature, so if your application manifest requests a custom extension and an MSA user logs into your app, these extensions will not be returned. 

### Values for configuring additional optional claims

For extension attributes, use the full name of the extension (in the format: `extension_<appid>_<attributename>`) in the application manifest. The `<appid>` must match the id of the application requesting the claim. 

Within the JWT, these claims will be emitted with the following name format:  `extn.<attributename>`.

Within the SAML tokens, these claims will be emitted with the following URI format: `http://schemas.microsoft.com/identity/claims/extn.<attributename>`

## Optional claims example

In this section, you can walk through a scenario to see how you can use the optional claims feature for your application.
There are multiple options available for updating the properties on an application’s identity configuration to enable and configure optional claims:
-	You can modify the application manifest. The example below will use this method to perform the configuration. Read the [Understanding the Azure AD application manifest document](https://docs.microsoft.com/azure/active-directory/develop/active-directory-application-manifest) first for an introduction to the manifest.
-	It's also possible to write an application that uses the [Graph API](https://docs.microsoft.com/azure/active-directory/develop/active-directory-graph-api) to update your application. The [Entity and complex type reference](https://msdn.microsoft.com/library/azure/ad/graph/api/entity-and-complex-type-reference#optionalclaims-type) in the Graph API reference guide can help you with configuring the optional claims.

**Example:** 
In the example below, you will modify an application’s manifest to add claims to access, ID, and SAML tokens intended for the application.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. After you've authenticated, choose your Azure AD tenant by selecting it from the top right corner of the page.
1. Select **Azure AD extension** from the left navigation panel and click on **App Registrations**.
1. Find the application you want to configure optional claims for in the list and click on it.
1. From the application page, click **Manifest** to open the inline manifest editor. 
1. You can directly edit the manifest using this editor. The manifest follows the schema for the [Application entity](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#application-entity), and auto-formats the manifest once saved. New elements will be added to the `OptionalClaims` property.

      ```json
      "optionalClaims": 
      {
            "idToken": [ 
                  { 
                        "name": "upn", 
                        "essential": false, 
                        "additionalProperties": [ "include_externally_authenticated_upn"]  
                  }
            ],
      "accessToken": [ 
                  {
                        "name": "auth_time", 
                        "essential": false
                  }
            ],
      "saml2Token": [ 
                  { 
                        "name": "extension_ab603c56068041afb2f6832e2a17e237_skypeId",
                        "source": "user", 
                        "essential": true
                  }
            ]
      }
      ```
      In this case, different optional claims were added to each type of token that the application can receive. The ID tokens will now contain the UPN for federated users in the full form (`<upn>_<homedomain>#EXT#@<resourcedomain>`). The access tokens that other clients request for this application will now include the auth_time claim. The SAML tokens will now contain the skypeId directory schema extension (in this example, the app ID for this app is ab603c56068041afb2f6832e2a17e237).  The SAML tokens will expose the Skype ID as `extension_skypeId`.

1. When you're finished updating the manifest, click **Save** to save the manifest

## Next steps

Learn more about the standard claims provided by Azure AD.

- [ID tokens](id-tokens.md)
- [Access tokens](access-tokens.md)
