---
title: Migrate an Azure API Management API to b2clogin.com - Azure Active Directory B2C
description: Learn how support access tokens issued by both b2clogin.com and login.microsoftonline.com for a staged migration to b2clogin.com.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/01/2019
ms.author: marsma
ms.subservice: B2C
---

# Migrate an Azure API Management API to b2clogin.com

If you have an API in Azure API Management secured with Azure AD B2C by accepting tokens issued by the legacy `login.microsoftonline.com` issuer endpoint, you should migrate the API and your applications to support tokens issued by [b2clogin.com](b2clogin.md).

By adding support for accepting tokens issued by both b2clogin.com and login.microsoftonline.com to your Azure API Management (APIM) policy, you can migrate your client applications in a staged manner before removing support for login.microsoftonline.com-issued tokens from the API.

> [!NOTE]
> This article is intended for Azure AD B2C customers with currently deployed APIs and applications that reference `login.microsoftonline.com` and who want to migrate to the recommended `b2clogin.com` endpoint. If you're setting up a new application with secured access to an Azure API Management API, use [b2clogin.com](b2clogin.md) as directed.

## Add b2clogin.com support to inbound policy

If you've [secured your API with Azure AD B2C](secure-api-management.md), you have a inbound policy in APIM that specifies the token issuer endpoint and the claims to be validated. If you deployed prior to the release of the b2clogin.com endpoint, the `<inbound>` element of your policy might look similar to the following XML snippet:

```XML
<!-- BEFORE: Validate claims in tokens issued by login.microsoftonline.com ONLY -->
<inbound>
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
        <openid-config url="https://login.microsoftonline.com/contosob2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1A_signup_signin" />
        <required-claims>
            <claim name="aud">
                <value>40000000-0000-0000-0000-000000000000</value>
            </claim>
            <claim name="iss">
                <value>https://login.microsoftonline.com/80000000-0000-0000-0000-000000000000/v2.0/</value>
            </claim>
        </required-claims>
    </validate-jwt>
    <base />
</inbound>
```

### Add branching to inbound policy

To enable support for multiple token issuer endpoints, add the [`<choose>`](../api-management/api-management-advanced-policies.md#choose) element to your inbound policy in Azure API Management to enable a branching flow within the policy. To inform the API which condition to branch on, evaluate the `Domain` header in the request, and then verify the claims appropriate for each endpoint.

This example XML snippet shows a policy that enables branching to support tokens issued by two issuer endpoints, `login.microsoftonline.com` and `b2clogin.com`. Also included is a fall-through condition that accepts `login.microsoftonline.com`-issued tokens.

```xml
<!-- AFTER: Validate claims in tokens issued by b2clogin.com AND login.microsoftonline.com -->
<policies>
    <inbound>
        <choose>
            <when condition="@(context.Request.Headers.GetValueOrDefault("Domain", "") == "b2clogin.com")">
                <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
                    <openid-config url="https://contosob2c.b2clogin.com/contosob2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1A_signup_signin" />
                    <required-claims>
                        <claim name="aud">
                            <value>40000000-0000-0000-0000-000000000000</value>
                        </claim>
                        <claim name="iss">
                            <value>https://contosob2c.b2clogin.com/80000000-0000-0000-0000-000000000000/v2.0/</value>
                        </claim>
                    </required-claims>
                </validate-jwt>
            </when>
            <when condition="@(context.Request.Headers.GetValueOrDefault("Domain", "") == "microsoftonline.com")">
                <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
                    <openid-config url="https://login.microsoftonline.com/contosob2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1A_signup_signin" />
                    <required-claims>
                        <claim name="aud">
                            <value>40000000-0000-0000-0000-000000000000</value>
                        </claim>
                        <claim name="iss">
                            <value>https://login.microsoftonline.com/80000000-0000-0000-0000-000000000000/v2.0/</value>
                        </claim>
                    </required-claims>
                </validate-jwt>
            </when>
            <otherwise>
                <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
                    <openid-config url="https://login.microsoftonline.com/tfp/contosob2c.onmicrosoft.com/B2C_1A_signup_signin/v2.0/.well-known/openid-configuration" />
                    <required-claims>
                        <claim name="aud">
                            <value>40000000-0000-0000-0000-000000000000</value>
                        </claim>
                    </required-claims>
                </validate-jwt>
            </otherwise>
        </choose>
        <base />
    </inbound>
    <backend> <base /> </backend>
    <outbound> <base /> </outbound>
    <on-error> <base /> </on-error>
</policies>
```

## Next steps

For details on editing your Azure API Management policies to add the branching support shown in the previous sections, see [How to set or edit Azure API Management policies](../api-management/set-edit-policies.md).
