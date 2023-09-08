---
title: Configure optional claims
description: Learn how to configure optional claims in tokens issued by Microsoft identity platform.
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 06/07/2023
ms.author: davidmu
ms.custom: aaddev, curation-claims
ms.reviewer: ludwignick
---

# Configure optional claims

You can configure optional claims for your application through the Azure portal or application manifest.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**.
1. Choose the application for which you want to configure optional claims based on your scenario and desired outcome.
1. Under **Manage**, select **Token configuration**.
   - The UI option **Token configuration** blade isn't available for apps registered in an Azure AD B2C tenant, which can be configured by modifying the application manifest. For more information, see  [Add claims and customize user input using custom policies in Azure Active Directory B2C](../../active-directory-b2c/configure-user-input.md)  

Configure claims using the manifest:

1. Select **Add optional claim**.
1. Select the token type you want to configure.
1. Select the optional claims to add.
1. Select **Add**.
1. Under **Manage**, select **Manifest**. A web-based manifest editor opens, allowing you to edit the manifest. Optionally, you can select **Download** and edit the manifest locally, and then use **Upload** to reapply it to your application.

    The following application manifest entry adds the `auth_time`, `ipaddr`, and `upn` optional claims to ID, access, and SAML tokens.

    ```json
    "optionalClaims": {
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
                "essential": false
            },
            {
                "name": "extension_ab603c56068041afb2f6832e2a17e237_skypeId",
                "source": "user",
                "essential": false
            }
        ]
    }
    ```

1. When finished, select **Save**. Now the specified optional claims are included in the tokens for your application.

The `optionalClaims` object declares the optional claims requested by an application. An application can configure optional claims that are returned in ID tokens, access tokens, and SAML 2 tokens. The application can configure a different set of optional claims to be returned in each token type.

| Name | Type | Description |
|------|------|-------------|
| `idToken` | Collection | The optional claims returned in the JWT ID token. |
| `accessToken` | Collection | The optional claims returned in the JWT access token. |
| `saml2Token` | Collection | The optional claims returned in the SAML token. |

If supported by a specific claim, you can also modify the behavior of the optional claim using the `additionalProperties` field.

| Name | Type | Description |
|------|------|-------------|
| `name` | Edm.String | The name of the optional claim. |
| `source` | Edm.String | The source (directory object) of the claim. There are predefined claims and user-defined claims from extension properties. If the source value is null, the claim is a predefined optional claim. If the source value is user, the value in the name property is the extension property from the user object. |
| `essential` | Edm.Boolean | If the value is true, the claim specified by the client is necessary to ensure a smooth authorization experience for the specific task requested by the end user. The default value is false. |
| `additionalProperties` | Collection (Edm.String) | Other properties of the claim. If a property exists in this collection, it modifies the behavior of the optional claim specified in the name property. |

## Configure directory extension optional claims

In addition to the standard optional claims set, you can also configure tokens to include Microsoft Graph extensions. For more information, see [Add custom data to resources using extensions](/graph/extensibility-overview).

> [!IMPORTANT]
> Access tokens are **always** generated using the manifest of the resource, not the client. In the request `...scope=https://graph.microsoft.com/user.read...`, the resource is the Microsoft Graph API.  The access token is created using the Microsoft Graph API manifest, not the client's manifest.  Changing the manifest for your application never causes tokens for the Microsoft Graph API to look different. To validate that your `accessToken` changes are in effect, request a token for your application, not another app.

Optional claims support extension attributes and directory extensions. This feature is useful for attaching more user information that your app can use. For example, other identifiers or important configuration options that the user has set. If your application manifest requests a custom extension and an MSA user logs in to your app, these extensions aren't returned.

### Directory extension formatting

When configuring directory extension optional claims using the application manifest, use the full name of the extension (in the format: `extension_<appid>_<attributename>`). The `<appid>` is the stripped version of the appId (or Client ID) of the application requesting the claim.

Within the JWT, these claims are emitted with the following name format:  `extn.<attributename>`. Within the SAML tokens, these claims are emitted with the following URI format: `http://schemas.microsoft.com/identity/claims/extn.<attributename>`

## Configure groups optional claims

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

This section covers the configuration options under optional claims for changing the group attributes used in group claims from the default group objectID to attributes synced from on-premises Windows Active Directory. You can configure groups optional claims for your application through the Azure portal or application manifest. Group optional claims are only emitted in the JWT for user principals. Service principals aren't included in group optional claims emitted in the JWT.

> [!IMPORTANT]
> The number of groups emitted in a token are limited to 150 for SAML assertions and 200 for JWT, including nested groups. For more information about group limits and important caveats for group claims from on-premises attributes, see [Configure group claims for applications](../hybrid/how-to-connect-fed-group-claims.md).

Complete the following steps to configure groups optional claims using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. After you've authenticated, choose your tenant by selecting it from the top-right corner of the page.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**.
1. Select the application you want to configure optional claims for in the list.
1. Under **Manage**, select **Token configuration**.
1. Select **Add groups claim**.
1. Select the group types to return (**Security groups**, or **Directory roles**, **All groups**, and/or **Groups assigned to the application**): 
    - The **Groups assigned to the application** option includes only groups assigned to the application. The **Groups assigned to the application** option is recommended for large organizations due to the group number limit in token. To change the groups assigned to the application, select the application from the **Enterprise applications** list.  Select **Users and groups** and then **Add user/group**. Select the group(s) you want to add to the application from **Users and groups**.
    - The **All Groups** option includes **SecurityGroup**, **DirectoryRole**, and **DistributionList**, but not **Groups assigned to the application**. 
1. Optional: select the specific token type properties to modify the groups claim value to contain on premises group attributes or to change the claim type to a role.
1. Select **Save**.

Complete the following steps to configure groups optional claims through the application manifest:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. After you've authenticated, choose your Azure AD tenant by selecting it from the top-right corner of the page.
1. Search for and select **Azure Active Directory**.
1. Select the application you want to configure optional claims for in the list.
1. Under **Manage**, select **Manifest**.
1. Add the following entry using the manifest editor:

   The valid values are:

   - "All" (this option includes SecurityGroup, DirectoryRole, and DistributionList)
   - "SecurityGroup"
   - "DirectoryRole"
   - "ApplicationGroup" (this option includes only groups that are assigned to the application)

   For example:

    ```json
    "groupMembershipClaims": "SecurityGroup"
    ```

   By default group object IDs are emitted in the group claim value. To modify the claim value to contain on premises group attributes, or to change the claim type to role, use the `optionalClaims` configuration as follows:

1. Set group name configuration optional claims.

   If you want groups in the token to contain the on premises group attributes in the optional claims section, specify which token type optional claim should be applied to. You also specify the name of optional claim requested and any other properties desired.  
   
   Multiple token types can be listed:

   - idToken for the OIDC ID token
   - accessToken for the OAuth access token
   - Saml2Token for SAML tokens.

   The Saml2Token type applies to both SAML1.1 and SAML2.0 format tokens.

   For each relevant token type, modify the groups claim to use the `optionalClaims` section in the manifest. The `optionalClaims` schema is as follows:

    ```json
    {
        "name": "groups",
        "source": null,
        "essential": false,
        "additionalProperties": []
    }
    ```

   | Optional claims schema | Value |
   |------------------------|-------|
   | `name` | Must be `groups` |
   | `source` | Not used. Omit or specify null. |
   | `essential` | Not used. Omit or specify false. |
   | `additionalProperties` | List of other properties. Valid options are `sam_account_name`, `dns_domain_and_sam_account_name`, `netbios_domain_and_sam_account_name`, `emit_as_roles` and `cloud_displayname`. |

   In `additionalProperties` only one of `sam_account_name`, `dns_domain_and_sam_account_name`, `netbios_domain_and_sam_account_name` are required.  If more than one is present, the first is used and any others ignored. You can also add `cloud_displayname` to emit display name of the cloud group. This option works only when `groupMembershipClaims` is set to `ApplicationGroup`.

   Some applications require group information about the user in the role claim. To change the claim type from a group claim to a role claim, add `emit_as_roles` to `additionalProperties`.  The group values are emitted in the role claim.

   If `emit_as_roles` is used, any application roles configured that the user is assigned aren't in the role claim.

The following examples show the manifest configuration for group claims:

Emit groups as group names in OAuth access tokens in `dnsDomainName\sAMAccountName` format.

```json
"optionalClaims": {
    "accessToken": [
        {
            "name": "groups",
            "additionalProperties": [
                "dns_domain_and_sam_account_name"
            ]
        }
    ]
}
```

Emit group names to be returned in `netbiosDomain\sAMAccountName` format as the roles claim in SAML and OIDC ID tokens.

```json
"optionalClaims": {
    "saml2Token": [
        {
            "name": "groups",
            "additionalProperties": [
                "netbios_domain_and_sam_account_name",
                "emit_as_roles"
            ]
        }
    ],
    "idToken": [
        {
            "name": "groups",
            "additionalProperties": [
                "netbios_domain_and_sam_account_name",
                "emit_as_roles"
            ]
        }
    ]
}
```

Emit group names in the format of `sam_account_name` for on-premises synced groups and `cloud_display` name for cloud groups in SAML and OIDC ID tokens for the groups assigned to the application.

```json
"groupMembershipClaims": "ApplicationGroup",
"optionalClaims": {
    "saml2Token": [
        {
            "name": "groups",
            "additionalProperties": [
                "sam_account_name",
                "cloud_displayname"
            ]
        }
    ],
    "idToken": [
        {
            "name": "groups",
            "additionalProperties": [
                "sam_account_name",
                "cloud_displayname"
            ]
        }
    ]
}
```

## Optional claims example

There are multiple options available for updating the properties on an application's identity configuration to enable and configure optional claims:

- You can use the Azure portal
- You can use the manifest.
- It's also possible to write an application that uses the [Microsoft Graph API](/graph/use-the-api) to update your application. The [OptionalClaims](/graph/api/resources/optionalclaims) type in the Microsoft Graph API reference guide can help you with configuring the optional claims.

In the following example, the Azure portal and manifest are used to add optional claims to the access, ID, and SAML tokens intended for your application. Different optional claims are added to each type of token that the application can receive:

- The ID tokens contain the UPN for federated users in the full form (`<upn>_<homedomain>#EXT#@<resourcedomain>`).
- The access tokens that other clients request for this application includes the `auth_time` claim.
- The SAML tokens contain the `skypeId` directory schema extension (in this example, the app ID for this app is `ab603c56068041afb2f6832e2a17e237`). The SAML token exposes the Skype ID as `extension_ab603c56068041afb2f6832e2a17e237_skypeId`.

Configure claims in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. After you've authenticated, choose your tenant by selecting it from the top-right corner of the page.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**.
1. Find the application you want to configure optional claims for in the list and select it.
1. Under **Manage**, select **Token configuration**.
1. Select **Add optional claim**, select the **ID** token type, select **upn** from the list of claims, and then select **Add**.
1. Select **Add optional claim**, select the **Access** token type, select **auth_time** from the list of claims, then select **Add**.
1. From the Token Configuration overview screen, select the pencil icon next to **upn**, select the **Externally authenticated** toggle, and then select **Save**.
1. Select **Add optional claim**, select the **SAML** token type, select **extn.skypeID** from the list of claims (only applicable if you've created an Azure AD user object called skypeID), and then select **Add**.

Configure claims in the manifest:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. After you've authenticated, choose your tenant by selecting it from the top-right corner of the page.
1. Search for and select **Azure Active Directory**.
1. Find the application you want to configure optional claims for in the list and select it.
1. Under **Manage**, select **Manifest** to open the inline manifest editor.
1. You can directly edit the manifest using this editor. The manifest follows the schema for the [Application entity](./reference-app-manifest.md), and automatically formats the manifest once saved. New elements are added to the `optionalClaims` property.

    ```json
    "optionalClaims": {
        "idToken": [
            {
                "name": "upn",
                "essential": false,
                "additionalProperties": [
                    "include_externally_authenticated_upn"
                ]
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

1. When you're finished updating the manifest, select **Save** to save the manifest.

## See also

- [Access tokens](access-tokens.md)
- [Application manifest](reference-app-manifest.md)
- [ID tokens](id-tokens.md)
- [Optional claims reference](optional-claims-reference.md)

## Next steps

- Learn more about the [tokens and claims](security-tokens.md) in the Microsoft identity platform.
