---
title: Resilience through developer best practices using Azure AD B2C
description: Resilience through developer best practices in Customer Identity and Access Management using Azure AD B2C
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals 
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.date: 12/01/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Resilience through developer best practices

In this article, we share some learnings that are based on our experience from working with large customers. You may consider these recommendations in the design and implementation of your services.

![Image shows developer experience components](media/resilience-b2c-developer-best-practices/developer-best-practices-architecture.png)

## Use the Microsoft Authentication Library (MSAL)

The [Microsoft Authentication Library (MSAL)](../develop/msal-overview.md) and the [Microsoft identity web authentication library for ASP.NET](../develop/reference-v2-libraries.md) simplify acquiring, managing, caching, and refreshing the tokens an application requires. These libraries are optimized specifically to support Microsoft Identity including features that improve application resiliency.

Developers should adopt latest releases of MSAL and stay up to date. See [how to increase resilience of authentication and authorization](resilience-app-development-overview.md) in your applications. Where possible, avoid implementing your own authentication stack and use well-established libraries.

## Optimize directory reads and writes

The Microsoft Azure AD B2C directory service supports billions of authentications a day. It's designed for a high rate of reads per second. Optimize your writes to minimize dependencies and increase resilience.

### How to optimize directory reads and writes

- **Avoid write functions to the directory on sign-in**: Never execute a write on sign-in without a precondition (if clause) in your custom policies. One use case that requires a write on a sign-in is [just-in-time migration of user passwords](https://github.com/azure-ad-b2c/user-migration/tree/master/seamless-account-migration). Avoid any scenario that requires a write on every sign-in. [Preconditions](../../active-directory-b2c/userjourneys.md) in a user journey will look like this:

  ```xml
  <Precondition Type="ClaimEquals" ExecuteActionsIf="true"> 
  <Value>requiresMigration</Value>
  ...
  <Precondition/>
  ```

- **Understand throttling**: The directory implements both application and tenant level throttling rules. There are further rate limits for Read/GET, Write/POST, Update/PUT, and Delete/DELETE operations and each operation have different limits.

  - A write at the time of sign-in will fall under a POST for new users or PUT for existing users.
  - A custom policy that creates or updates a user on every sign-in, can potentially hit an application level PUT or POST rate limit. The same limits apply when updating directory objects via Azure AD or Microsoft Graph. Similarly, examine the reads to keep the number of reads on every sign-in to the minimum.
  - Estimate peak load to predict the rate of directory writes and avoid throttling. Peak traffic estimates should include estimates for actions such as sign-up, sign-in, and Multi-factor authentication (MFA). Be sure to test both the Azure AD B2C system and your application for peak traffic. It's possible that Azure AD B2C can handle the load without throttling, when your downstream applications or services won't.
  - Understand and plan your migration timeline. When planning to migrate users to Azure AD B2C using Microsoft Graph, consider the application and tenant limits to calculate the time needed to complete the migration of users. If you split your user creation job or script using two applications, you can use the per application limit. It would still need to remain below the per tenant threshold.
  - Understand the effects of your migration job on other applications. Consider the live traffic served by other relying applications to make sure you don't cause throttling at the tenant level and resource starvation for your live application. For more information, see the [Microsoft Graph throttling guidance](/graph/throttling).
  - Use a [load test sample](https://github.com/azure-ad-b2c/load-tests) to simulate sign-up and sign-in. 
  - Learn more about [Azure Active Directory B2C service limits and restrictions](../../active-directory-b2c/service-limits.md?pivots=b2c-custom-policy).
  
## Extend token lifetimes

In an unlikely event, when the Azure AD B2C authentication service is unable to complete new sign-ups and sign-ins, you can still provide mitigation for users who are signed in. With [configuration](../../active-directory-b2c/configure-tokens.md), you can allow users that are already signed in to continue using the application without any perceived disruption until the user signs out from the application or the [session](../../active-directory-b2c/session-behavior.md) times out due to inactivity.

Your business requirements and desired end-user experience will dictate your frequency of token refresh for both web and Single-page applications (SPAs).

### How to extend token lifetimes

- **Web applications**: For web applications where the authentication token is validated at the beginning of sign-in, the application depends on the session cookie to continue to extend the session validity. Enable users to remain signed in by implementing rolling session times that will continue to renew sessions based on user activity. If there's a long-term token issuance outage, these session times can be further increased as a onetime configuration on the application. Keep the lifetime of the session to the maximum allowed.
- **SPAs**: A SPA may depend on access tokens to make calls to the APIs. A SPA traditionally uses the implicit flow that doesn't result in a refresh token. The SPA can use a hidden `iframe` to perform new token requests against the authorization endpoint if the browser still has an active session with the Azure AD B2C. For SPAs, there are a few options available to allow the user to continue to use the application.
  - Extend the access token's validity duration to meet your business requirements.
  - Build your application to use an API gateway as the authentication proxy. In this configuration, the SPA loads without any authentication and the API calls are made to the API gateway. The API gateway sends the user through a sign-in process using an [authorization code grant](https://oauth.net/2/grant-types/authorization-code/) based on a policy and authenticates the user. Then the authentication session between the API gateway and the client is maintained using an authentication cookie. The API gateway services the APIs using the token that is obtained by the API gateway (or some other direct authentication method such as certificates, client credentials, or API keys).
  - [Migrate your SPA from implicit grant](https://developer.microsoft.com/identity/blogs/msal-js-2-0-supports-authorization-code-flow-is-now-generally-available/) to [authorization code grant flow](../../active-directory-b2c/implicit-flow-single-page-application.md) with Proof Key for Code Exchange (PKCE) and Cross-origin Resource Sharing (CORS) support. Migrate your application from MSAL.js 1.x to MSAL.js 2.x to realize the resiliency of Web applications.
  - For mobile applications, it's recommended to extend both the refresh and access token lifetimes.
- **Backend or microservice applications**: Because backend (daemon) applications are non-interactive and aren't in a user context, the prospect of token theft is greatly diminished. Recommendation is to strike a balance between security and lifetime and set a long token lifetime.

## Configure Single sign-on

With [Single sign-on (SSO)](../manage-apps/what-is-single-sign-on.md), users sign in once with a single account and get access to multiple applications. The application can be a web, mobile, or a Single page application (SPA), regardless of platform or domain name. When the user initially signs in to an application, Azure AD B2C persists a [cookie-based session](../../active-directory-b2c/session-behavior.md).

Upon subsequent authentication requests, Azure AD B2C reads and validates the cookie-based session and issues an access token without prompting the user to sign in again. If SSO is configured with a limited scope at a policy or an application, later access to other policies and applications will require fresh authentication.

### How to configure SSO

[Configure SSO](../hybrid/how-to-connect-sso-quick-start.md) to be tenant-wide (default) to allow multiple applications and user flows in your tenant to share the same user session. Tenant-wide configuration provides most resiliency to fresh authentication.  

## Safe deployment practices

The most common disrupters of service are the code and configuration changes. Adoption of Continuous Integration and Continuous Delivery (CICD) processes and tools help with rapid deployment at a large scale and reduces human errors during testing and deployment into production. Adopt CICD for error reduction, efficiency, and consistency. [Azure Pipelines](/azure/devops/pipelines/apps/cd/azure/cicd-data-overview) is an example of CICD.

## Protect from bots

Protect your applications against known vulnerabilities such as Distributed Denial of Service (DDoS) attacks, SQL injections, cross-site scripting, remote code execution, and many others as documented in [OWASP Top 10](https://owasp.org/www-project-top-ten/). Deployment of a Web Application Firewall (WAF) can defend against common exploits and vulnerabilities.

- Use Azure [WAF](../../web-application-firewall/overview.md), which provides centralized protection against attacks.
- Use WAF with Azure AD [Identity Protection and Conditional Access to provide multi-layer protection](../../active-directory-b2c/conditional-access-identity-protection-overview.md) when using Azure AD B2C.
- Build resistance to bot-driven [sign-ups by integrating with a CAPTCHA system](https://github.com/azure-ad-b2c/samples/tree/master/policies/captcha-integration).

## Secrets rotation

Azure AD B2C uses secrets for applications, APIs, policies, and encryption. The secrets secure authentication, external interactions, and storage. The National Institute of Standards and Technology (NIST) calls the time span during which a specific key is authorized for use by legitimate entities a cryptoperiod. Choose the right length of [cryptoperiod](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final) to meet your business needs. Developers need to manually set the expiration and rotate secrets well in advance of their expiration.

### How to implement secret rotation

- Use [managed identities](../managed-identities-azure-resources/overview.md) for supported resources to authenticate to any service that supports Azure AD authentication. When you use managed identities, you can manage resources automatically, including rotation of credentials.
- Take an inventory of all the [keys and certificates configured](../../active-directory-b2c/policy-keys-overview.md) in Azure AD B2C. This list is likely to include keys used in custom policies, [APIs](../../active-directory-b2c/secure-rest-api.md), signing ID token, and certificates for SAML.
- Using CICD, rotate secrets that are about to expire within two months from the anticipated peak season. The recommended maximum cryptoperiod of private keys associated to a certificate is one year.
- Proactively monitor and rotate the API access credentials such as passwords, and certificates.

## Test REST APIs

In the context of resiliency, testing of REST APIs needs to include verification of – HTTP codes, response payload, headers, and performance. Testing shouldn't include only happy path tests, but also check whether the API handles problem scenarios gracefully.

### How to test APIs

We recommend your test plan to include [comprehensive API tests](../../active-directory-b2c/best-practices.md#testing). If you're planning for an upcoming surge because of promotion or holiday traffic, you need to revise your load testing with the new estimates. Conduct load testing of your APIs and Content Delivery Network (CDN) in a developer environment and not in production.

## Next steps

- [Resilience resources for Azure AD B2C developers](resilience-b2c.md)
  - [Resilient end-user experience](resilient-end-user-experience.md)
  - [Resilient interfaces with external processes](resilient-external-processes.md)
  - [Resilience through monitoring and analytics](resilience-with-monitoring-alerting.md)
- [Build resilience in your authentication infrastructure](resilience-in-infrastructure.md)
- [Increase resilience of authentication and authorization in your applications](resilience-app-development-overview.md)
