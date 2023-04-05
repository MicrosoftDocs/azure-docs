---
title: Use Azure AD directory extension attributes in claims
description: Describes how to use directory extension attributes for sending user data to applications in token claims.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev
ms.workload: identity
ms.topic: how-to
ms.date: 01/06/2023
ms.author: davidmu
ms.reviewer: ludwignick, rahulnagraj, alamaral
---
# Using directory extension attributes in claims

Directory extension attributes, also called Azure AD extensions, provide a way to store additional data in Azure Active Directory on user objects and other directory objects such as groups, tenant details, service principals. Only extension attributes on user objects can be used for emitting claims to applications. This article describes how to use directory extension attributes for sending user data to applications in token claims.

> [!NOTE]
> Microsoft Graph provides three other extension mechanisms to customize Graph objects. These are the extension attributes 1-15, open extensions, and schema extensions. See the [Microsoft Graph documentation](/graph/extensibility-overview) for details. Data stored on Microsoft Graph objects using open and schema extensions are not available as sources for claims in tokens.

Directory extension attributes are always associated with an application in the tenant and are referenced by the application's *appId* in their name.

The identifier for a directory extension attribute is of the form *extension_xxxxxxxxx_AttributeName*.  Where *xxxxxxxxx* is the *appId* of the application the extension was defined for, with only characters 0-9 and A-Z.

## Registering and using directory extensions
Directory extension attributes can be registered and populated in one of two ways:

- By configuring Azure AD Connect to create them and to sync data into them from on-premises AD. See [Azure AD Connect Sync Directory Extensions](../hybrid/how-to-connect-sync-feature-directory-extensions.md).
- By using Microsoft Graph to register, set the values of, and read from [directory extensions](/graph/extensibility-overview#directory-azure-ad-extensions). [PowerShell cmdlets](/powershell/azure/active-directory/using-extension-attributes-sample) are also available.

### Emitting claims with data from directory extension attributes created with Azure AD Connect
Directory extension attributes created and synced using Azure AD Connect are always associated with the application ID used by Azure AD Connect. These attributes can be used as a source for claims both by configuring them as claims in the **Enterprise Applications** configuration in the Portal UI for SAML applications registered using the Gallery or the non-Gallery application configuration experience under **Enterprise Applications**, and via a claims-mapping policy for applications registered via the Application registration experience.  Once a directory extension attribute created via AD Connect is in the directory, it will show in the SAML SSO claims configuration UI.

### Emitting claims with data from directory extension attributes created for an application using Graph or PowerShell
If a directory extension attribute is registered for an application using Microsoft Graph or PowerShell (via an applications initial setup or provisioning step for instance), the same application can be configured in Azure Active Directory to receive data in that attribute from a user object in a claim when the user signs in.  The application can be configured to receive data in directory extensions that are registered on that same application using [optional claims](active-directory-optional-claims.md#configuring-directory-extension-optional-claims).  These can be set in the application manifest.  This enables a multi-tenant application to register directory extension attributes for its own use. When the application is provisioned into a tenant the associated directory extensions become available to be set on users in that tenant, and to be consumed.  Once it's configured in the tenant and consent granted, it can be used to store and retrieve data via graph and to map to claims in tokens the Microsoft identity platform emits to applications.

Directory extension attributes can be registered and populated for any application.

If an application needs to send claims with data from an extension attribute registered on a different application, a [claims mapping policy](active-directory-claims-mapping.md) must be used to map the extension attribute to the claim.  A common pattern for managing directory extension attributes is to create an application specifically to be the point of registration for all the directory extensions you need.  It doesn't have to be a real application and this technique means that all the extensions have the same appID in their name.

For example, here is a claims-mapping policy to emit a single claim from a directory extension attribute in an OAuth/OIDC token:

```json
{
    "ClaimsMappingPolicy": {
        "Version": 1,
        "IncludeBasicClaimSet": "false",
        "ClaimsSchema": [{
                "Source": "User",
                "ExtensionID": "extension_xxxxxxx_test",
                "JWTClaimType": "http://schemas.contoso.com/identity/claims/exampleclaim"
            },
        ]
    }
}
```

Where *xxxxxxx* is the appID (or Client ID) of the application that the extension was registered with.

> [!WARNING]
> When you define a claims mapping policy for a directory extension attribute, use the `ExtensionID` property instead of the `ID` property within the body of the `ClaimsSchema` array, as shown in the example above.

> [!TIP]
> Case consistency is important when setting directory extension attributes on objects. Extension attribute names aren't cases sensitive when being set up, but they are case sensitive when being read from the directory by the token service.  If an extension attribute is set on a user object with the name "LegacyId" and on another user object with the name "legacyid", when the attribute is mapped to a claim using the name "LegacyId" the data will be successfully retrieved and the claim included in the token for the first user but not the second.

## Next steps
- Learn how to [add custom or additional claims to the SAML 2.0 and JSON Web Tokens (JWT) tokens](active-directory-optional-claims.md).
- Learn how to [customize claims emitted in tokens for a specific app](active-directory-claims-mapping.md).
