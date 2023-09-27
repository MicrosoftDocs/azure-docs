---
title: Azure Active Directory B2C service limits and restrictions
description: Reference for service limits and restrictions for Azure Active Directory B2C service.
services: active-directory-b2c
author: kengaderdus
ms.author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 12/29/2022
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Azure Active Directory B2C service limits and restrictions

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

This article outlines the usage constraints and other service limits for the Azure Active Directory B2C (Azure AD B2C) service. These limits are in place to protect by effectively managing threats and ensuring a high level of service quality.

> [!NOTE]
> To increase any of the service limits mentioned in this article, contact **[Support](find-help-open-support-ticket.md)**.

## User/consumption related limits

The number of users able to authenticate through an Azure AD B2C tenant is gated through request limits. The following table illustrates the request limits for your Azure AD B2C tenant.

|Category |Limit    |
|---------|---------|
|Maximum requests per IP per Azure AD B2C tenant       |6,000/5min          |
|Maximum requests per Azure AD B2C tenant     |200/sec          |

## Endpoint request usage

Azure AD B2C is compliant with [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749), [OpenID Connect (OIDC)](https://openid.net/certification/), and [SAML](http://saml.xml.org/saml-specifications) protocols. It provides user authentication and single sign-on (SSO) functionality, with the endpoints listed in the following table. 

The frequency of requests made to Azure AD B2C endpoints determines the overall token issuance capability. Azure AD B2C exposes endpoints, which consume a different number of requests. Review the [Authentication Protocols](./protocols-overview.md) article for more information on which endpoints are consumed by your application.

|Endpoint                 |Endpoint type     |Requests consumed |
|-----------------------------|---------|------------------|
|/oauth2/v2.0/authorize       |Dynamic  |Varies <sup>1</sup>|
|/oauth2/v2.0/token           |Static   |1                 |
|/openid/v2.0/userinfo        |Static   |1                 |
|/.well-known/openid-config   |Static   |1                 |
|/discovery/v2.0/keys         |Static   |1                 |
|/oauth2/v2.0/logout          |Static   |1                 |
|/samlp/sso/login             |Dynamic  |Varies <sup>1</sup>|
|/samlp/sso/logout            |Static   |1                 |

::: zone pivot="b2c-user-flow"
<sup>1</sup> The type of [User Flow](./user-flow-overview.md) determines the total number of requests consumed when using these endpoints.

::: zone-end
::: zone pivot="b2c-custom-policy"
<sup>1</sup> The configuration of your [Custom Policy](./user-flow-overview.md) determines the total number of requests consumed when using these endpoints.
::: zone-end

## Token issuance rate

::: zone pivot="b2c-user-flow"

Each type of User Flow provides a unique user experience and will consume a different number of requests.
The token issuance rate of a User Flow is dependent on the number of requests consumed by both the static and dynamic endpoints. The below table shows the number of requests consumed at a dynamic endpoint for each User Flow.

|User Flow |Requests consumed    |
|---------|---------|
|Sign up        |6  |
|Sign in        |4   |
|Password reset |4   |
|Profile edit   |4   |
|Phone Sign Up and Sign In   |6   |

When you add more features to a User Flow, such as multifactor authentication, more requests are consumed. The below table shows how many additional requests are consumed when a user interacts with one of these features.

|Feature |Additional requests consumed    |
|---------|---------|
|Microsoft Entra multifactor authentication          |2   |
|Email one-time password      |2   |
|Age gating     |2   |
|Federated identity provider  |2   |

To obtain the token issuance rate per second for your User Flow:

1. Use the tables above to add the total number of requests consumed at the dynamic endpoint.
2. Add the number of requests expected at the static endpoints based on your application type.
3. Use the formula below to calculate the token issuance rate per second.

```
Tokens/sec = 200/requests-consumed
```

::: zone-end
::: zone pivot="b2c-custom-policy"

The token issuance rate of a Custom Policy is dependent on the number of requests consumed by the static and dynamic endpoints. The below table shows the number of requests consumed at a dynamic endpoint for the [Azure AD B2C starter packs](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack).

|Starter Pack |Scenario |User journey ID |Requests consumed|
|---------|---------|---------|---------|
|LocalAccounts| Sign-in| SignUpOrSignIn |2|
|LocalAccounts SocialAndLocalAccounts | Sign-up| SignUpOrSignIn |6|
|LocalAccounts|Profile edit| ProfileEdit |2|
|LocalAccounts SocialAndLocalAccounts SocialAndLocalAccountsWithMfa| Password reset| PasswordReset| 6|
|SocialAndLocalAccounts| Federated account sign-in|SignUpOrSignIn| 4|
|SocialAndLocalAccounts| Federated account sign-up|SignUpOrSignIn| 6|
|SocialAndLocalAccountsWithMfa| Local account sign-in with MFA|SignUpOrSignIn |6|
|SocialAndLocalAccountsWithMfa| Local account sign-up with MFA|SignUpOrSignIn |10|
|SocialAndLocalAccountsWithMfa| Federated account sign-in with MFA|SignUpOrSignIn| 8|
|SocialAndLocalAccountsWithMfa| Federated account sign-up with MFA|SignUpOrSignIn |10|

To obtain the token issuance rate per second for a particular user journey:

1. Use the table above to find the number of requests consumed for your user journey.
2. Add the number of requests expected at the static endpoints based on your application type.
3. Use the formula below to calculate the token issuance rate per second.

```
Tokens/sec = 200/requests-consumed
```

## Calculate the token issuance rate of your Custom Policy

You can create your own Custom Policy to provide a unique authentication experience for your application. The number of requests consumed at the dynamic endpoint depends on which features a user traverses through your Custom Policy. The below table shows how many requests are consumed for each feature in a Custom Policy.

|Feature                                          |Requests consumed|
|-------------------------------------------------|-----------------|
|Self-asserted technical profile                  |2                |
|Phone factor technical profile                   |4                |
|Email verification (Verified.Email)              |2                |
|Display Control                                  |2                |
|Federated identity provider                      |2                |

To obtain the token issuance rate per second for your Custom Policy:

1. Use the table above to calculate the total number of requests consumed at the dynamic endpoint.
2. Add the number of requests expected at the static endpoints based on your application type.
3. Use the formula below to calculate the token issuance rate per second.

```
Tokens/sec = 200/requests-consumed
```

::: zone-end

## Best practices

You can optimize the token issuance rate by considering the following configuration options:

- Increasing access and refresh [token lifetimes](./configure-tokens.md).
- Increasing the Azure AD B2C [web session lifetime](./session-behavior.md).
- Enabling [Keep Me Signed In](./session-behavior.md#enable-keep-me-signed-in-kmsi).
- Caching the [OpenId Connect metadata](./openid-connect.md#validate-the-id-token) documents at your APIs.
- Enforcing conditional MFA using [Conditional Access](./conditional-access-identity-protection-overview.md).

## Azure AD B2C configuration limits

The following table lists the administrative configuration limits in the Azure AD B2C service.

|Category  |Limit  |
|---------|---------|
|Number of scopes per application        |1000          |
|Number of [custom attributes](user-profile-attributes.md#extension-attributes) per user <sup>1</sup>       |100         |
|Number of redirect URLs per application       |100         |
|Number of sign-out URLs per application        |1          |
|String Limit per Attribute      |250 Chars          |
|Number of B2C tenants per subscription      |20         |
|Total number of objects (user accounts and applications) per tenant (default limit)|1.25 million |
|Total number of objects (user accounts and applications) per tenant (using a verified custom domain)|5.25 million |
|Levels of [inheritance](custom-policy-overview.md#inheritance-model) in custom policies     |10         |
|Number of policies per Azure AD B2C tenant (user flows + custom policies)     |200          |
|Maximum policy file size      |1024 KB          |
|Number of API connectors per tenant     |20         |

<sup>1</sup> See also [Microsoft Entra service limits and restrictions](../active-directory/enterprise-users/directory-service-limits-restrictions.md).

## Next steps

- Learn about [Microsoft Graph's throttling guidance](/graph/throttling) 
- Learn about the [validation differences for Azure AD B2C applications](../active-directory/develop/supported-accounts-validation.md)
- Learn about [Resilience through developer best practices](../active-directory/architecture/resilience-b2c-developer-best-practices.md)
