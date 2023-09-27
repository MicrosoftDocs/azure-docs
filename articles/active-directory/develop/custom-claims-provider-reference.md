---
title: Custom claims provider reference
titleSuffix: Microsoft identity platform
description: Reference documentation for custom claims providers
services: active-directory
author: jassuri
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: reference
ms.date: 03/06/2023
ms.author: davidmu
ms.reviewer: jassuri
ms.custom: aaddev 
#Customer intent: As a developer, I want to learn about custom authentication extensions so that I can augment tokens with claims from an external identity system or role management system.
---

# Custom claims providers

In this reference article, you can learn about the REST API schema and claims mapping policy structure for custom claim provider events.

## Token issuance start event

The custom claims provider token issuance event allows you to enrich or customize application tokens with information from external systems. This information that can't be stored as part of the user profile in Microsoft Entra directory.

### Component overview

To set up and, integrate a custom extension with your application requires multiple components to be connected. The following diagram shows a high level view of the configuration points, and relationships that are created to implement a custom extension.

:::image type="content" border="false" source="media/custom-extension-get-started/token-issuance-start-config.png" alt-text="Screenshot that shows the components to configure in Microsoft Entra ID to set up and integrate a custom claims provider." lightbox="media/custom-extension-get-started/token-issuance-start-config.png":::

- You should have a **REST API endpoint** publicly available. In this diagram, it represented by Azure Function. The REST API generates and returns custom claims to the custom extension. It's associated with a Microsoft Entra application registration.
- You require to configure a **custom extension** in Microsoft Entra ID, which is configured to connect to your API.
- You require an **application** that receives the customized tokens. For example <https://jwt.ms> a Microsoft-owned web application that displays the decoded contents of a token.
- The application, such as the <https://jwt.ms> must be registered into Microsoft Entra ID using **app registration**.
- You must create an association between your application and your custom extension.
- You can optionally secure the Azure Function with an authentication provider, in this article we use your Microsoft Entra ID.

### REST API

Your REST API endpoint is responsible for interfacing with downstream services. For example, databases, other REST APIs, LDAP directories, or any other stores that contain the attributes you'd like to add to the token configuration.

The REST API returns an HTTP response to Microsoft Entra ID containing the attributes. Attributes that return by your REST API aren't automatically added into a token. Instead, an application's claims mapping policy must be configured for any attribute to be included in the token. In Microsoft Entra ID, a claims mapping policy modifies the claims emitted in tokens issued for specific applications.

### REST API schema

To develop your own REST API for the token issuance start event, use the following REST API data contract. The schema describes the contract to design the request and response handler.

Your custom extension in Microsoft Entra ID makes an HTTP call to your REST API with a JSON payload. The JSON payload contains user profile data, authentication context attributes, and information about the application the user wants to sign-in. The JSON attributes can be used to perform extra logic by your API. The request to your API is in the following format:

```http
POST https://your-api.com/endpoint

{
    "type": "microsoft.graph.authenticationEvent.tokenIssuanceStart",
    "source": "/tenants/<Your tenant GUID>/applications/<Your Test Application App Id>",
    "data": {
        "@odata.type": "microsoft.graph.onTokenIssuanceStartCalloutData",
        "tenantId": "<Your tenant GUID>",
        "authenticationEventListenerId": "<GUID>",
        "customAuthenticationExtensionId": "<Your custom extension ID>",
        "authenticationContext": {
            "correlationId": "<GUID>",
            "client": {
                "ip": "30.51.176.110",
                "locale": "en-us",
                "market": "en-us"
            },
            "protocol": "OAUTH2.0",
            "clientServicePrincipal": {
                "id": "<Your Test Applications servicePrincipal objectId>",
                "appId": "<Your Test Application App Id>",
                "appDisplayName": "My Test application",
                "displayName": "My Test application"
            },
            "resourceServicePrincipal": {
                "id": "<Your Test Applications servicePrincipal objectId>",
                "appId": "<Your Test Application App Id>",
                "appDisplayName": "My Test application",
                "displayName": "My Test application"
            },
            "user": {
                "createdDateTime": "2016-03-01T15:23:40Z",
                "displayName": "Bob",
                "givenName": "Bob Smith",
                "id": "90847c2a-e29d-4d2f-9f54-c5b4d3f26471",
                "mail": "bob@contoso.com",
                "preferredLanguage": "en-us",
                "surname": "Smith",
                "userPrincipalName": "bob@contoso.com",
                "userType": "Member"
            }
        }
    }
}
```

The REST API response format which Azure expects is in the following format, where the claims `DateOfBirth` and `CustomRoles` are returned to Azure:

```json
{
    "data": {
        "@odata.type": "microsoft.graph.onTokenIssuanceStartResponseData",
        "actions": [
            {
                "@odata.type": "microsoft.graph.tokenIssuanceStart.provideClaimsForToken",
                "claims": {
                    "DateOfBirth": "01/01/2000",
                    "CustomRoles": [
                        "Writer",
                        "Editor"
                    ]
                }
            }
        ]
    }
}
```

When a B2B user from Fabrikam organization authenticates to Contoso's organization, the request payload sent to the REST API has the `user` element in the following format:

```json
"user": {
    "companyName": "Fabrikam",
    "createdDateTime": "2022-07-15T00:00:00Z",
    "displayName": "John Wright",
    "id": "12345678-0000-0000-0000-000000000000",
    "mail": "johnwright@fabrikam.com",
    "preferredDataLocation": "EUR",
    "userPrincipalName": "johnwright_fabrikam.com#EXT#@contoso.onmicrosoft.com",
    "userType": "Guest"
}
```

### Supported data types

The following table shows the data types supported by Custom claims providers for the token issuance start event:

| Data type    | Supported |
|--------------|-----------|
| String       | True      |
| String array | True      |
| Boolean      | False     |
| JSON         | False     |

### Claims mapping policy

In Microsoft Entra ID, a claims mapping policy modifies the claims emitted in tokens issued for specific applications. It includes claims from your custom claims provider, and issuing them into the token.

```json
{
    "ClaimsMappingPolicy": {
        "Version": 1,
        "IncludeBasicClaimSet": "true",
        "ClaimsSchema": [{
            "Source": "CustomClaimsProvider",
            "ID": "dateOfBirth",
            "JwtClaimType": "birthdate"
        },
        {
            "Source": "CustomClaimsProvider",
            "ID": "customRoles",
            "JwtClaimType": "my_roles"
        },
        {
            "Source": "CustomClaimsProvider",
            "ID": "correlationId",
            "JwtClaimType": "correlation_Id"
        },
        {
            "Source": "CustomClaimsProvider",
            "ID": "apiVersion",
            "JwtClaimType": "apiVersion"
        },
        {
            "Value": "tokenaug_V2",
            "JwtClaimType": "policy_version"
        }]
    }
}
```

The `ClaimsSchema` element contains the list of claims to be mapped with the following attributes:

- **Source** describes the source of the attribute, the `CustomClaimsProvider`. Note, the last element contains a fixed value with the policy version, for testing purposes. Thus, the `source` attribute is omitted.

- **ID** is the name of the claims at it returns from the Azure Function you created.

    > [!IMPORTANT]
    > The ID attribute's value is case sensitive. Make sure you type the claim name exactly as it returned by the Azure Function.
- **JwtClaimType** is an optional name of claim in the emitted token for OpenID Connect app. It allows you to provide a different name that returns in the JWT token. For example, if the API response has an `ID` value of `dateOfBirth`, it can be emitted as `birthdate` in the token.

Once you create your claims mapping policy, the next step is to upload it to your Microsoft Entra tenant. Use the following [claimsMappingPolicy](/graph/api/claimsmappingpolicy-post-claimsmappingpolicies) Graph API in your tenant.

> [!IMPORTANT]
> The **definition** element should be an array with a single string value. The string should be the stringified and escaped version of your claims mapping policy. You can use tools like [https://jsontostring.com/](https://jsontostring.com/) to stringify your claims mapping policy.

## Next steps

- To learn how to [create and register a custom extension and API endpoint](custom-extension-get-started.md).
- To learn how to customize the claims emitted in tokens for a specific application in their tenant using PowerShell, see [How to: Customize claims emitted in tokens for a specific app in a tenant](./saml-claims-customization.md)
- To learn how to customize claims issued in the SAML token through the Azure portal, see [How to: Customize claims issued in the SAML token for enterprise applications](./saml-claims-customization.md)
- To learn more about extension attributes, see [Using directory extension attributes in claims](./schema-extensions.md).
