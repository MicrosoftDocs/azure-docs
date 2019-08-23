---
title: Migrate an Azure API Management API to b2clogin.com - Azure Active Directory B2C
description: Learn how support access tokens issued by both b2clogin.com and login.microsoftonline.com for a staged migration to b2clogin.com.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/28/2019
ms.author: marsma
ms.subservice: B2C
---

# Migrate an Azure API Management API to b2clogin.com

> [!WARNING]
> This article is WIP, please DO NOT review.

If you previously protected an API in Azure API Management with Azure AD B2C using the `login.microsoftonline.com` issuer endpoint, you should migrate the API to support tokens issued by [b2clogin.com](b2clogin.md). During the migration, you might wish to support both endpoints to continue supporting clients with tokens issued by the legacy `login.microsoftonline.com` endpoint.

> [!NOTE]
> This article is intended for Azure AD B2C customers with currently deployed APIs and applications that reference `login.microsoftonline.com` and who want to migrate to the recommended `b2clogin.com` endpoint. If you're setting up a new application with secured access to an Azure API Management API, use [b2clogin.com](b2clogin.md) as directed.

To enable support for multiple token issuer domains, use the `<choose>` element in your API Management policy to enable a branching flow within the policy. To inform the API which condition to validate, modify the `Authorization` header.

For example, this policy enables branching support handling tokens issued by two issuer endpoints, `login.microsoftonline.com` and `b2clogin.com`, with a fall-through that accepts `login.microsoftonline.com`-issued tokens.

```xml
<policies>
    <inbound>
        <choose>
            <when condition="@(context.Request.Headers.GetValueOrDefault("Domain", "") == "b2clogin.com")">
                <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
                    <openid-config url="https://testapimanagement.b2clogin.com/testapimanagement.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1A_signup_signin" />
                    <required-claims>
                        <claim name="aud">
                            <value>40000000-0000-0000-0000-000000000000</value>
                        </claim>
                        <claim name="iss">
                            <value>https://testapimanagement.b2clogin.com/80000000-0000-0000-0000-000000000000/v2.0/</value>
                        </claim>
                    </required-claims>
                </validate-jwt>
            </when>
            <when condition="@(context.Request.Headers.GetValueOrDefault("Domain", "") == "microsoftonline.com")">
                <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
                    <openid-config url="https://login.microsoftonline.com/testapimanagement.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1A_signup_signin" />
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
                    <openid-config url="https://login.microsoftonline.com/tfp/testapimanagement.onmicrosoft.com/B2C_1A_signup_signin/v2.0/.well-known/openid-configuration" />
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

### Validate Azure API Management in multiple config URLs case

**[TODO: EXPLANATION HERE]**

Example request:

**[TODO: IMAGE HERE]**

## Next steps

**[TODO: NEXT LOGICAL DESTINATION HERE]**