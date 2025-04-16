---
title: Azure API Management policy reference - validate-azure-ad-token | Microsoft Docs
description: Reference for the validate-azure-ad-token policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 01/29/2025
ms.author: danlep
---

# Validate Microsoft Entra token

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `validate-azure-ad-token` policy enforces the existence and validity of a JSON web token (JWT) that was provided by the Microsoft Entra (formerly called Azure Active Directory) service for a specified set of principals in the directory. The JWT can be extracted from a specified HTTP header, query parameter, or value provided using a policy expression or context variable.

> [!NOTE]
> Use the generic [`validate-jwt`](validate-jwt-policy.md) policy to validate a JWT that was provided by an identity provider other than Microsoft Entra. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<validate-azure-ad-token
    tenant-id="tenant ID or URL (for example, "https://contoso.onmicrosoft.com") of the Microsoft Entra ID tenant"
    header-name="name of HTTP header containing the token (alternatively, use query-parameter-name or token-value attribute to specify token)"
    query-parameter-name="name of query parameter used to pass the token (alternative, use header-name or token-value attribute to specify token)"
    token-value="expression returning the token as a string (alternatively, use header-name or query-parameter attribute to specify token)"
    failed-validation-httpcode="HTTP status code to return on failure"
    failed-validation-error-message="error message to return on failure"
    output-token-variable-name="name of a variable to receive a JWT object representing successfully validated token">
    <backend-application-ids>
        <application-id>Backend application ID from Microsoft Entra</application-id>
        <!-- If there are multiple backend application IDs, then add additional application-id elements -->
    </backend-application-ids>
    <client-application-ids>
        <application-id>Client application ID from Microsoft Entra</application-id>
        <!-- If there are multiple client application IDs, then add additional application-id elements -->
    </client-application-ids>
    <audiences>
        <audience>audience string</audience>
        <!-- if there are multiple possible audiences, then add additional audience elements -->
    </audiences>
    <required-claims>
        <claim name="name of the claim as it appears in the token" match="all | any" separator="separator character in a multi-valued claim">
            <value>claim value as it is expected to appear in the token</value>
            <!-- if there is more than one allowed value, then add additional value elements -->
        </claim>
    </required-claims>
    <decryption-keys>
        <key certificate-id="mycertificate"/>
        <!-- if there are multiple keys, then add additional key elements -->
    </decryption-keys>
</validate-azure-ad-token>
```

## Attributes

| Attribute                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| tenant-id | Tenant ID or URL of the Microsoft Entra ID tenant, or one of the following well-known tenants:<br/><br/> - `organizations` or `https://login.microsoftonline.com/organizations` - to allow tokens from accounts in any organizational directory (any Microsoft Entra directory)<br/>- `common` or `https://login.microsoftonline.com/common` - to allow tokens from accounts in any organizational directory (any Microsoft Entra directory) and from personal Microsoft accounts (for example, Skype, XBox)<br/><br/>Policy expressions are allowed.| Yes | N/A |
| header-name                     | The name of the HTTP header holding the token. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                       | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | `Authorization`                                                                               |
| query-parameter-name            | The name of the query parameter holding the token. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| token-value                     | Expression returning a string containing the token. You must not return `Bearer` as part of the token value. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                          | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| failed-validation-httpcode      | HTTP status code to return if the JWT doesn't pass validation. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                        | No                                                                               | 401                                                                               |
| failed-validation-error-message | Error message to return in the HTTP response body if the JWT doesn't pass validation. This message must have any special characters properly escaped. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                | No                                                                               | Default error message depends on validation issue, for example "JWT not present." |
| output-token-variable-name      | String. Name of context variable that will receive token value as an object of type [`Jwt`](api-management-policy-expressions.md) upon successful token validation. Policy expressions aren't allowed.                                                                                                                                                                                                                                                                                     | No                                                                               | N/A                                                                               |

## Elements

| Element             | Description                                                                                                                                                                                                                                                                                                                                           | Required |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| backend-application-ids | Contains a list of acceptable backend application IDs.  This is only required in advanced cases for the configuration of options and can generally be removed. Policy expressions aren't allowed. | No |
| client-application-ids | Contains a list of acceptable client application IDs. If multiple `application-id` elements are present, then each value is tried until either all are exhausted (in which case validation fails) or until one succeeds. If a client application ID isn't provided, one or more `audience` claims should be specified. Policy expressions aren't allowed. | No |
| audiences           | Contains a list of acceptable audience claims that can be present on the token. If multiple `audience` values are present, then each value is tried until either all are exhausted (in which case validation fails) or until one succeeds. Policy expressions are allowed.                                                                    | No       |
| required-claims     | Contains a list of `claim` elements for claim values expected to be present on the token for it to be considered valid. When the `match` attribute is set to `all`, every claim value in the policy must be present in the token for validation to succeed. When the `match` attribute is set to `any`, at least one claim must be present in the token for validation to succeed. Policy expressions are allowed. | No       |
| decryption-keys     | A list of [`key`](#key-attributes) subelements, used to decrypt a token signed with an asymmetric key. If multiple keys are present, then each key is tried until either all keys are exhausted (in which case validation fails) or a key succeeds.<br/><br/>Specify the public key using a `certificate-id` attribute with value set to the identifier of a certificate uploaded to API Management.         | No       |

### claim attributes

| Attribute                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| name | Name of the claim as it is expected to appear in the token. Policy expressions are allowed.| Yes | N/A |
| match                           | The `match` attribute on the `claim` element specifies whether every claim value in the policy must be present in the token for validation to succeed. Possible values are:<br /><br /> - `all` - every claim value in the policy must be present in the token for validation to succeed.<br /><br /> - `any` - at least one claim value must be present in the token for validation to succeed.<br/><br/>Policy expressions are allowed.                                                     | No                                                                               | all                                                                               |
| separator                       | String. Specifies a separator (for example, ",") to be used for extracting a set of values from a multi-valued claim. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                         | No                                                                               | N/A                                                                               |

### key attributes
| Attribute                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| certificate-id  | Identifier of a certificate entity [uploaded](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-certificate-entity#Add) to API Management, used to specify the public key to verify a token signed with an asymmetric key.   | Yes | N/A |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

* You can use access restriction policies in different scopes for different purposes. For example, you can secure the whole API with Microsoft Entra authentication by applying the `validate-azure-ad-token` policy on the API level, or you can apply it on the API operation level and use `claims` for more granular control.
* [Microsoft Entra ID for customers (preview)](/entra/external-id/customers/concept-supported-features-customers) is not supported.

## Examples

### Simple token validation

The following policy is the minimal form of the `validate-azure-ad-token` policy. It expects the JWT to be provided in the default `Authorization` header using the `Bearer` scheme. In this example, the Microsoft Entra tenant ID and client application ID are provided using named values.

```xml
<validate-azure-ad-token tenant-id="{{aad-tenant-id}}">
    <client-application-ids>
        <application-id>{{aad-client-application-id}}</application-id>
    </client-application-ids>
</validate-azure-ad-token>
```

### Token validation using decryption key

This example shows how to use the `validate-azure-ad-token` policy to validate a token that is decrypted using a decryption key. The Microsoft Entra tenant ID and client application ID are provided using named values. The key is specified using the ID of an uploaded certificate (in PFX format) that contains the public key.

```xml
<validate-azure-ad-token tenant-id="{{aad-tenant-id}}">
    <client-application-ids>
        <application-id>{{aad-client-application-id}}</application-id>
    </client-application-ids>
    <decryption-keys>
        <key certificate-id="mycertificate"/>
    </decryption-keys>
</validate-azure-ad-token>
```

### Validate that audience and claim are correct

The following policy checks that the audience is the hostname of the API Management instance and that the `ctry` claim is `US`. The Microsoft tenant ID is the well-known `organizations` tenant, which allows tokens from accounts in any organizational directory. The hostname is provided using a policy expression, and the client application ID is provided using a named value. The decoded JWT is provided in the `jwt` variable after validation.

For more details on optional claims, read [Provide optional claims to your app](../active-directory/develop/active-directory-optional-claims.md).  

```xml
<validate-azure-ad-token tenant-id="organizations" output-token-variable-name="jwt">
    <client-application-ids>
        <application-id>{{aad-client-application-id}}</application-id>
    </client-application-ids>
    <audiences>
        <audience>@(context.Request.OriginalUrl.Host)</audience>
    </audiences>
    <required-claims>
        <claim name="ctry" match="any">
            <value>US</value>
        </claim>
    </required-claims>
</validate-azure-ad-token>
```

## Related policies 

* [Authentication and authorization](api-management-policies.md#authentication-and-authorization)


[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
