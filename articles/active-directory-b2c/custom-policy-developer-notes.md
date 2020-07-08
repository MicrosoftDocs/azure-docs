---
title: Developer notes for custom policies
titleSuffix: Azure AD B2C
description: Notes for developers on configuring and maintaining Azure AD B2C with custom policies.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 05/19/2020
ms.author: mimart
ms.subservice: B2C
---

# Developer notes for custom policies in Azure Active Directory B2C

Custom policy configuration in Azure Active Directory B2C is now generally available. This method of configuration is targeted at advanced identity developers building complex identity solutions. Custom policies make the power of the Identity Experience Framework available in Azure AD B2C tenants.
Advanced identity developers using custom policies should plan to invest some time completing walk-throughs and reading reference documents.

While most of the custom policy options available are now generally available, there are underlying capabilities, such as technical profile types and content definition APIs that are at different stages in the software lifecycle. Many more are coming. The table below specifies the level of availability at a more granular level.

## Features that are generally available

- Author and upload custom authentication user journeys by using custom policies.
    - Describe user journeys step-by-step as exchanges between claims providers.
    - Define conditional branching in user journeys.
- Interoperate with REST API-enabled services in your custom authentication user journeys.
- Federate with identity providers that are compliant with the OpenIDConnect protocol.
- Federate with identity providers that adhere to the SAML 2.0 protocol.

## Responsibilities of custom policy feature-set developers

Manual policy configuration grants lower-level access to the underlying platform of Azure AD B2C and results in the creation of a unique, trust framework. The many possible permutations of custom identity providers, trust relationships, integrations with external services, and step-by-step workflows require a methodical approach to design and configuration.

Developers consuming the custom policy feature set should adhere to the following guidelines:

- Become familiar with the configuration language of the custom policies and key/secrets management. For more information, see [TrustFrameworkPolicy](trustframeworkpolicy.md).
- Take ownership of scenarios and custom integrations. Document your work and inform your live site organization.
- Perform methodical scenario testing.
- Follow software development and staging best practices with a minimum of one development and testing environment and one production environment.
- Stay informed about new developments from the identity providers and services you integrate with. For example, keep track of changes in secrets and of scheduled and unscheduled changes to the service.
- Set up active monitoring, and monitor the responsiveness of production environments. For more information about integrating with Application Insights, see [Azure Active Directory B2C: Collecting Logs](analytics-with-application-insights.md).
- Keep contact email addresses current in the Azure subscription, and stay responsive to the Microsoft live-site team emails.
- Take timely action when advised to do so by the Microsoft live-site team.

## Terms for features in public preview

- We encourage you to use the public preview features for evaluation purposes only.
- Service level agreements (SLAs) do not apply to the public preview features.
- Support requests for public preview features can be filed through regular support channels.

## Features by stage and known issues

Custom policy/Identity Experience Framework capabilities are under constant and rapid development. The following table is an index of features and component availability.


### Protocols and authorization flows

| Feature | Development | Preview | GA | Notes |
|-------- | :-----------: | :-------: | :--: | ----- |
| [OAuth2 authorization code](authorization-code-flow.md) |  |  | X |  |
| OAuth2 authorization code with PKCE |  |  | X | Mobile applications only  |
| [OAuth2 implicit flow](implicit-flow-single-page-application.md) |  |  | X |  |
| [OAuth2 resource owner password credentials](ropc-custom.md) |  | X |  |  |
| [OIDC Connect](openid-connect.md) |  |  | X |  |
| [SAML2](connect-with-saml-service-providers.md)  |  |  |X  | POST and Redirect bindings. |
| OAuth1 |  |  |  | Not supported. |
| WSFED | X |  |  |  |

### Identify providers federation 

| Feature | Development | Preview | GA | Notes |
|-------- | :-----------: | :-------: | :--: | ----- |
| [OpenID Connect](openid-connect-technical-profile.md) |  |  | X | For example, Google+.  |
| [OAuth2](oauth2-technical-profile.md) |  |  | X | For example, Facebook.  |
| [OAuth1](oauth1-technical-profile.md) |  | X |  | For example, Twitter. |
| [SAML2](saml-identity-provider-technical-profile.md) |  |   | X | For example, Salesforce, ADFS. |
| WSFED| X |  |  |  |


### REST API integration

| Feature | Development | Preview | GA | Notes |
|-------- | :-----------: | :-------: | :--: | ----- |
| [REST API with basic auth](secure-rest-api.md#http-basic-authentication) |  |  | X |  |
| [REST API with client certificate auth](secure-rest-api.md#https-client-certificate-authentication) |  |  | X |  |
| [REST API with OAuth2 bearer auth](secure-rest-api.md#oauth2-bearer-authentication) |  | X |  |  |

### Component support

| Feature | Development | Preview | GA | Notes |
| ------- | :-----------: | :-------: | :--: | ----- |
| [Phone factor authentication](phone-factor-technical-profile.md) |  |  | X |  |
| [Azure MFA authentication](multi-factor-auth-technical-profile.md) |  | X |  |  |
| [One-time password](one-time-password-technical-profile.md) |  | X |  |  |
| [Azure Active Directory](active-directory-technical-profile.md) as local directory |  |  | X |  |
| Azure email subsystem for email verification |  |  | X |  |
| [Third party email service providers](custom-email-mailjet.md) |  |X  |  |  |
| [Multi-language support](localization.md)|  |  | X |  |
| [Predicate validations](predicates.md) |  |  | X | For example, password complexity. |
| [Display controls](display-controls.md) |  |X  |  |  |


### Page layout versions

| Feature | Development | Preview | GA | Notes |
| ------- | :-----------: | :-------: | :--: | ----- |
| [2.0.0](page-layout.md#200) |  | X |  |  |
| [1.2.0](page-layout.md#120) |  | X |  |  |
| [1.1.0](page-layout.md#110) |  |  | X |  |
| [1.0.0](page-layout.md#100) |  |  | X |  |
| [JavaScript support](javascript-samples.md) |  | X |  |  |

### App-IEF integration

| Feature | Development | Preview | GA | Notes |
| ------- | :-----------: | :-------: | :--: | ----- |
| Query string parameter `domain_hint` |  |  | X | Available as claim, can be passed to IDP. |
| Query string parameter `login_hint` |  |  | X | Available as claim, can be passed to IDP. |
| Insert JSON into user journey via `client_assertion` | X |  |  | Will be deprecated. |
| Insert JSON into user journey as `id_token_hint` |  | X |  | Go-forward approach to pass JSON. |
| [Pass identity provider token to the application](idp-pass-through-custom.md) |  | X |  | For example, from Facebook to app. |

### Session Management

| Feature | Development | Preview | GA | Notes |
| ------- | :-----------: | :-------: | :--: | ----- |
| [Default SSO session provider](custom-policy-reference-sso.md#defaultssosessionprovider) |  |  | X |  |
| [External login session provider](custom-policy-reference-sso.md#externalloginssosessionprovider) |  |  | X |  |
| [SAML SSO session provider](custom-policy-reference-sso.md#samlssosessionprovider) |  |  | X |  |
| [OAuthSSOSessionProvider](custom-policy-reference-sso.md#oauthssosessionprovider)  |  | X |  |  |
| [Single sign-out](session-overview.md#sign-out)  |  | X |  |  |

### Security

| Feature | Development | Preview | GA | Notes |
|-------- | :-----------: | :-------: | :--: | ----- |
| Policy Keys- Generate, Manual, Upload |  |  | X |  |
| Policy Keys- RSA/Cert, Secrets |  |  | X |  |


### Developer interface

| Feature | Development | Preview | GA | Notes |
| ------- | :-----------: | :-------: | :--: | ----- |
| Azure Portal-IEF UX |  |  | X |  |
| Policy upload |  |  | X |  |
| [Application Insights user journey logs](troubleshoot-with-application-insights.md) |  | X |  | Used for troubleshooting during development.  |
| [Application Insights event logs](application-insights-technical-profile.md) |  | X |  | Used to monitor user flows in production. |


## Next steps

- Check the [Microsoft Graph operations available for Azure AD B2C](microsoft-graph-operations.md)
- Learn more about [custom policies and the differences with user flows](custom-policy-overview.md).
