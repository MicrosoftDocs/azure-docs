---
title: Azure API Management policy reference - validate-azure-ad-token | Microsoft Docs
description: Reference for the validate-azure-ad-token policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Validate Microsoft Entra token

The `validate-azure-ad-token` policy enforces the existence and validity of a JSON web token (JWT) that was provided by the Microsoft Entra service for a specified set of principals in the directory. The JWT can be extracted from a specified HTTP header, query parameter, or value provided using a policy expression or context variable.

> [!NOTE]
> To validate a JWT that was provided by another identity provider, API Management also provides the generic [`validate-jwt`](validate-jwt-policy.md) policy. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<validate-azure-ad-token
    tenant-id="tenant ID or URL (for example, "contoso.onmicrosoft.com") of the Azure Active Directory service"
    header-name="name of HTTP header containing the token (alternatively, use query-parameter-name or token-value attribute to specify token)"
    query-parameter-name="name of query parameter used to pass the token (alternative, use header-name or token-value attribute to specify token)"
    token-value="expression returning the token as a string (alternatively, use header-name or query-parameter attribute to specify token)"
    failed-validation-httpcode="HTTP status code to return on failure"
    failed-validation-error-message="error message to return on failure"
    output-token-variable-name="name of a variable to receive a JWT object representing successfully validated token">
    <client-application-ids>
        <application-id>Client application ID from Azure Active Directory</application-id>
        <!-- If there are multiple client application IDs, then add additional application-id elements -->
    </client-application-ids>
    <backend-application-ids>
        <application-id>Backend application ID from Azure Active Directory</application-id>
        <!-- If there are multiple backend application IDs, then add additional application-id elements -->
    </backend-application-ids>
    <audiences>
        <audience>audience string</audience>
        <!-- if there are multiple possible audiences, then add additional audience elements -->
    </audiences>
    <required-claims>
        <claim name="name of the claim as it appears in the token" match="all|any" separator="separator character in a multi-valued claim">
            <value>claim value as it is expected to appear in the token</value>
            <!-- if there is more than one allowed value, then add additional value elements -->
        </claim>
        <!-- if there are multiple possible allowed values, then add additional value elements -->
    </required-claims>
</validate-azure-ad-token>
```

## Attributes

| Attribute                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| tenant-id | Tenant ID or URL  of the Microsoft Entra service. Policy expressons are allowed.| Yes | N/A |
| header-name                     | The name of the HTTP header holding the token. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                       | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | `Authorization`                                                                               |
| query-parameter-name            | The name of the query parameter holding the token. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| token-value                     | Expression returning a string containing the token. You must not return `Bearer` as part of the token value. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                          | One of `header-name`, `query-parameter-name` or `token-value` must be specified. | N/A                                                                               |
| failed-validation-httpcode      | HTTP status code to return if the JWT doesn't pass validation. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                        | No                                                                               | 401                                                                               |
| failed-validation-error-message | Error message to return in the HTTP response body if the JWT doesn't pass validation. This message must have any special characters properly escaped. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                | No                                                                               | Default error message depends on validation issue, for example "JWT not present." |
| output-token-variable-name      | String. Name of context variable that will receive token value as an object of type [`Jwt`](api-management-policy-expressions.md) upon successful token validation. Policy expressions aren't allowed.                                                                                                                                                                                                                                                                                     | No                                                                               | N/A                                                                               |

## Elements

| Element             | Description                                                                                                                                                                                                                                                                                                                                           | Required |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| audiences           | Contains a list of acceptable audience claims that can be present on the token. If multiple audience values are present, then each value is tried until either all are exhausted (in which case validation fails) or until one succeeds. At least one audience must be specified. Policy expressions are allowed.                                                                    | No       |
| backend-application-ids | Contains a list of acceptable backend application IDs.  This is only required in advanced cases for the configuration of options and can generally be removed. Policy expressions aren't allowed. | No |
| client-application-ids | Contains a list of acceptable client application IDs.  If multiple application-id elements are present, then each value is tried until either all are exhausted (in which case validation fails) or until one succeeds.  At least one application-id must be specified. Policy expressions aren't allowed. | Yes |
| required-claims     | Contains a list of `claim` elements for claim values expected to be present on the token for it to be considered valid. When the `match` attribute is set to `all`, every claim value in the policy must be present in the token for validation to succeed. When the `match` attribute is set to `any`, at least one claim must be present in the token for validation to succeed. Policy expressions are allowed. | No       |

### claim attributes

| Attribute                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Required                                                                         | Default                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| name | Name of the claim as it is expected to appear in the token. Policy expressions are allowed.| Yes | N/A |
| match                           | The `match` attribute on the `claim` element specifies whether every claim value in the policy must be present in the token for validation to succeed. Possible values are:<br /><br /> - `all` - every claim value in the policy must be present in the token for validation to succeed.<br /><br /> - `any` - at least one claim value must be present in the token for validation to succeed.<br/><br/>Policy expressions are allowed.                                                     | No                                                                               | all                                                                               |
| separator                       | String. Specifies a separator (for example, ",") to be used for extracting a set of values from a multi-valued claim. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                         | No                                                                               | N/A                                                                               |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

* You can use access restriction policies in different scopes for different purposes. For example, you can secure the whole API with Microsoft Entra authentication by applying the `validate-azure-ad-token` policy on the API level, or you can apply it on the API operation level and use `claims` for more granular control.
* When using a custom header (`header-name`), the header value cannot be prefixed with `Bearer ` and should be removed.

## Examples

### Simple token validation

The following policy is the minimal form of the `validate-azure-ad-token` policy.  It expects the JWT to be provided in the default `Authorization` header using the `Bearer` scheme. In this example, the Microsoft Entra tenant ID and client application ID are provided using named values.

```xml
<validate-azure-ad-token tenant-id="{{aad-tenant-id}}">
    <client-application-ids>
        <application-id>{{aad-client-application-id}}</application-id>
    </client-application-ids>
</validate-azure-ad-token>
```

### Validate that audience and claim are correct

The following policy checks that the audience is the hostname of the API Management instance and that the `ctry` claim is `US`. The hostname is provided using a policy expression, and the Microsoft Entra tenant ID and client application ID are provided using named values. The decoded JWT is provided in the `jwt` variable after validation.

For more details on optional claims, read [Provide optional claims to your app](../active-directory/develop/active-directory-optional-claims.md).  

```xml
<validate-azure-ad-token tenant-id="{{aad-tenant-id}}" output-token-variable-name="jwt">
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

* [API Management access restriction policies](api-management-access-restriction-policies.md)


[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
