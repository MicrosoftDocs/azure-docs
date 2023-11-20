---
title: Developer notes for user flows and custom policies
titleSuffix: Azure AD B2C
description: Notes for developers on configuring and maintaining Azure AD B2C with user flows and custom policies.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 10/05/2023
ms.custom: project-no-code
ms.author: kengaderdus
ms.subservice: B2C
---

# Developer notes for Azure Active Directory B2C

Azure Active Directory B2C [user flows and custom policies](user-flow-overview.md) are generally available. Azure AD B2C capabilities are under continual development, so although most features are generally available, some features are at different stages in the software release cycle. This article discusses cumulative improvements in Azure AD B2C and specifies feature availability.

## Terms for features in public preview

- We encourage you to use public preview features for evaluation purposes only.

- [Service level agreements (SLAs)](https://azure.microsoft.com/support/legal/sla/active-directory-b2c) don't apply to public preview features.

- Support requests for public preview features can be submitted through regular support channels.

## User flows

|Feature  |User flow  |Custom policy  |Notes  |
|---------|:---------:|:---------:|---------|
| [Sign-up and sign-in](add-sign-up-and-sign-in-policy.md) with email and password. | GA | GA| |
| [Sign-up and sign-in](add-sign-up-and-sign-in-policy.md) with username and password.| GA | GA | |
| [Profile editing flow](add-profile-editing-policy.md) | GA | GA | |
| [Self-Service password reset](add-password-reset-policy.md) | GA| GA| |
| [Force password reset](force-password-reset.md) | GA | NA | |
| [Phone sign-up and sign-in](phone-authentication-user-flows.md) | GA | GA | |
| [Conditional Access and Identity Protection](conditional-access-user-flow.md) | GA | GA | Not available for SAML applications |
| [Smart lockout](threat-management.md) | GA | GA | |

## OAuth 2.0 application authorization flows

The following table summarizes the OAuth 2.0 and OpenId Connect application authentication flows that can be  integrated with Azure AD B2C.

|Feature  |User flow  |Custom policy  |Notes  |
|---------|:---------:|:---------:|---------|
[Authorization code](authorization-code-flow.md) | GA | GA | Allows users to sign in to web applications. The web application receives an authorization code. The authorization code is redeemed to acquire a token to call web APIs.|
[Authorization code with PKCE](authorization-code-flow.md)| GA | GA | Allows users to sign in to mobile and single-page applications. The application receives an authorization code using proof key for code exchange (PKCE). The authorization code is redeemed to acquire a token to call web APIs.  |
[Client credentials flow](client-credentials-grant-flow.md)| Preview | Preview | Allows access web-hosted resources by using the identity of an application. Commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user. |
[Device authorization grant](https://tools.ietf.org/html/rfc8628)| NA | NA | Allows users to sign in to input-constrained devices such as a smart TV, IoT device, or printer.  |
[Implicit flow](implicit-flow-single-page-application.md) | GA | GA |  Allows users to sign in to single-page applications. The app gets tokens directly without performing a back-end server credential exchange.|
[On-behalf-of](../active-directory/develop/v2-oauth2-on-behalf-of-flow.md)| NA | NA | An application invokes a service or web API, which in turn needs to call another service or web API. <br />  <br /> For the middle-tier service to make authenticated requests to the downstream service, pass a *client credential* token in the authorization header. Optionally, you can include a custom header with the Azure AD B2C user's token.  |
[OpenId Connect](openid-connect.md) | GA | GA | OpenID Connect introduces the concept of an ID token, which is a security token that allows the client to verify the identity of the user. |
[OpenId Connect hybrid flow](openid-connect.md) | GA | GA | Allows a web application retrieve the ID token on the authorize request along with an authorization code.  |
[Resource owner password credentials (ROPC)](add-ropc-policy.md) | GA | GA | Allows a mobile application to sign in the user by directly handling their password. |
| [Sign-out](session-behavior.md#sign-out)| GA | GA | |
| [Single sign-out](session-behavior.md#sign-out)  | NA | Preview | |

### OAuth 2.0 options

|Feature  |User flow  |Custom policy  |Notes  |
|---------|:---------:|:---------:|---------|
| [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider) | GA | GA | Query string parameter `domain_hint`. |
| [Prepopulate the sign-in name](direct-signin.md#prepopulate-the-sign-in-name) | GA | GA | Query string parameter `login_hint`. |
| Insert JSON into user journey via `client_assertion`| NA| Deprecated |  |
| Insert JSON into user journey as [id_token_hint](id-token-hint.md) | NA | GA | |
| [Pass identity provider token to the application](idp-pass-through-user-flow.md)| Preview| Preview| For example, from Facebook to app. |
| [Keep me signed in (KMSI)](session-behavior.md#enable-keep-me-signed-in-kmsi)| GA| GA| |

## SAML2 application authentication flows

The following table summarizes the Security Assertion Markup Language (SAML) application authentication flows that can be  integrated with Azure AD B2C.

|Feature  |User flow  |Custom policy  |Notes  |
|---------|:---------:|:---------:|---------|
[SP initiated](saml-service-provider.md) | NA | GA | POST and Redirect bindings. |
[IDP initiated](saml-service-provider-options.md#configure-idp-initiated-flow) | NA | GA | Where the initiating identity provider is Azure AD B2C.  |

## User experience customization

|Feature  |User flow  |Custom policy  |Notes  |
|---------|:---------:|:---------:|---------|
| [Multi-language support](localization.md)| GA | GA | |
| [Custom domains](custom-domain.md)| GA | GA | |
| [Custom email verification](custom-email-mailjet.md) | NA | GA| |
| [Customize the user interface with built-in templates](customize-ui.md) | GA| GA| |
| [Customize the user interface with custom templates](customize-ui-with-html.md) | GA| GA| By using HTML templates. |
| [Page layout version](page-layout.md) | GA | GA | |
| [JavaScript](javascript-and-page-layout.md) | GA | GA | |
| [Embedded sign-in experience](embedded-login.md) | NA |  Preview| By using the inline frame element `<iframe>`. |
| [Password complexity](password-complexity.md) | GA | GA | |
| [Disable email verification](disable-email-verification.md) | GA|  GA| Not recommended for production environments. Disabling email verification in the sign-up process may lead to spam. |




## Identity providers

|Feature  |User flow  |Custom policy  |Notes  |
|---------|:---------:|:---------:|---------|
|[AD FS](identity-provider-adfs.md) | NA | GA | |
|[Amazon](identity-provider-amazon.md) | GA | GA | |
|[Apple](identity-provider-apple-id.md) | GA | GA | |
|[Microsoft Entra ID (Single-tenant)](identity-provider-azure-ad-single-tenant.md) | GA | GA | |
|[Microsoft Entra ID (Multi-tenant)](identity-provider-azure-ad-multi-tenant.md) | NA  | GA | |
|[Azure AD B2C](identity-provider-azure-ad-b2c.md) | GA | GA | |
|[eBay](identity-provider-ebay.md) | NA | Preview | |
|[Facebook](identity-provider-facebook.md) | GA | GA | |
|[GitHub](identity-provider-github.md) | Preview | GA | |
|[Google](identity-provider-google.md) | GA | GA | |
|[ID.me](identity-provider-id-me.md) | GA | GA | |
|[LinkedIn](identity-provider-linkedin.md) | GA | GA | |
|[Microsoft Account](identity-provider-microsoft-account.md) | GA | GA | |
|[QQ](identity-provider-qq.md) | Preview | GA | |
|[Salesforce](identity-provider-salesforce.md) | GA | GA | |
|[Salesforce (SAML protocol)](identity-provider-salesforce-saml.md) | NA | GA | |
|[Twitter](identity-provider-twitter.md) | GA | GA | |
|[WeChat](identity-provider-wechat.md) | Preview | GA | |
|[Weibo](identity-provider-weibo.md) | Preview | GA | |

## Generic identity providers

|Feature  |User flow  |Custom policy  |Notes  |
|---------|:---------:|:---------:|---------|
|[OAuth2](oauth2-technical-profile.md) | NA | GA | For example, [Google](identity-provider-google.md), [GitHub](identity-provider-github.md), and [Facebook](identity-provider-facebook.md).|
|[OAuth1](oauth1-technical-profile.md) | NA | GA | For example, [Twitter](identity-provider-twitter.md). |
|[OpenID Connect](openid-connect-technical-profile.md) | GA | GA | For example, [Microsoft Entra ID](identity-provider-azure-ad-single-tenant.md).  |
|[SAML2](identity-provider-generic-saml.md) | NA | GA | For example, [Salesforce](identity-provider-salesforce-saml.md) and [AD-FS](identity-provider-adfs.md). |
| WSFED | NA | NA | |

### API connectors

|Feature  |User flow  |Custom policy  |Notes  |
|---------|:---------:|:---------:|---------|
|[After federating with an identity provider during sign-up](api-connectors-overview.md?pivots=b2c-user-flow#after-federating-with-an-identity-provider-during-sign-up) | GA | GA | |
|[Before creating the user](api-connectors-overview.md?pivots=b2c-user-flow#before-creating-the-user) | GA | GA | |
|[Before including application claims in token](api-connectors-overview.md?pivots=b2c-user-flow#before-sending-the-token-preview)| Preview | GA | |
|[Secure with basic authentication](secure-rest-api.md#http-basic-authentication) | GA | GA | |
|[Secure with client certificate authentication](secure-rest-api.md#https-client-certificate-authentication) | GA | GA | |
|[Secure with OAuth2 bearer authentication](secure-rest-api.md#oauth2-bearer-authentication) | NA | GA | |
|[Secure API key authentication](secure-rest-api.md#api-key-authentication) | NA | GA | |


## Custom policy features

### Session management

| Feature |  Custom policy | Notes |
| ------- | :--: | ----- |
| [Default SSO session provider](custom-policy-reference-sso.md#defaultssosessionprovider) | GA |  |
| [External login session provider](custom-policy-reference-sso.md#externalloginssosessionprovider) | GA |  |
| [SAML SSO session provider](custom-policy-reference-sso.md#samlssosessionprovider) | GA |  |
| [OAuth SSO Session Provider](custom-policy-reference-sso.md#oauthssosessionprovider)  | GA|  |


### Components

| Feature | Custom policy | Notes |
| ------- | :--: | ----- |
| [MFA using time-based one-time password (TOTP) with authenticator apps](multi-factor-authentication.md#verification-methods) | GA |  Users can use any authenticator app that supports TOTP verification, such as the [Microsoft Authenticator app](https://www.microsoft.com/security/mobile-authenticator-app).|
| [Phone factor authentication](phone-factor-technical-profile.md) | GA |  |
| [Microsoft Entra multifactor authentication authentication](multi-factor-auth-technical-profile.md) | GA |  |
| [One-time password](one-time-password-technical-profile.md) | GA |  |
| [Microsoft Entra ID](active-directory-technical-profile.md) as local directory | GA |  |
| [Predicate validations](predicates.md) | GA | For example, password complexity. |
| [Display controls](display-controls.md) | GA |  |
| [Sub journeys](subjourneys.md) | GA | |

### Developer interface

| Feature | Custom policy | Notes |
| ------- | :--: | ----- |
| Azure portal | GA |   |
| [Application Insights user journey logs](troubleshoot-with-application-insights.md) | Preview | Used for troubleshooting during development.  |
| [Application Insights event logs](analytics-with-application-insights.md) | Preview | Used to monitor user flows in production. |

## Other features 

| Feature | Status | Notes |
| ------- | :--: | ----- |
| [Go-Local add-on](data-residency.md#go-local-add-on) | GA | Azure AD B2C's [Go-Local add-on](data-residency.md#go-local-add-on) enables you to create Azure AD B2C tenant within the country/region you choose when you [create your Azure AD B2C](tutorial-create-tenant.md).  |

## Responsibilities of custom policy feature-set developers

Manual policy configuration grants lower-level access to the underlying platform of Azure AD B2C and results in the creation of a unique, trust framework. The many possible permutations of custom identity providers, trust relationships, integrations with external services, and step-by-step workflows require a methodical approach to design and configuration.

Developers consuming the custom policy feature set should adhere to the following guidelines:

- Become familiar with the configuration language of the custom policies and key/secrets management. For more information, see [TrustFrameworkPolicy](trustframeworkpolicy.md).
- Take ownership of scenarios and custom integrations. Document your work and inform your live site organization.
- Perform methodical scenario testing.
- Follow software development and staging best practices. A minimum of one development and testing environment is recommended.
- Stay informed about new developments from the identity providers and services you integrate with. For example, keep track of changes in secrets and of scheduled and unscheduled changes to the service.
- Set up active monitoring, and monitor the responsiveness of production environments. For more information about integrating with Application Insights, see [Azure Active Directory B2C: Collecting Logs](analytics-with-application-insights.md).
- Keep contact email addresses current in the Azure subscription, and stay responsive to the Microsoft live-site team emails.
- Take timely action when advised to do so by the Microsoft live-site team.

## Next steps

- Check the [Microsoft Graph operations available for Azure AD B2C](microsoft-graph-operations.md).
- Learn more about [custom policies and the differences with user flows](custom-policy-overview.md).
