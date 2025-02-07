---
title: Mitigate OWASP API security top 10 in Azure API Management
description: Learn how to protect against common API-based vulnerabilities, as identified by the OWASP API Security Top 10 threats, using Azure API Management. 
author: mikebudzynski
ms.service: azure-api-management
ms.topic: conceptual
ms.date: 10/29/2024
ms.author: mibudz
---

# Recommendations to mitigate OWASP API Security Top 10 threats using API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

> [!NOTE]
> This article has been updated to reflect the latest OWASP API Security Top 10 list for 2023.

The Open Web Application Security Project ([OWASP](https://owasp.org/about/)) Foundation works to improve software security through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences.

The OWASP [API Security Project](https://owasp.org/www-project-api-security/) focuses on strategies and solutions to understand and mitigate the unique *vulnerabilities and security risks of APIs*. In this article, we discuss the latest recommendations to mitigate the top 10 API threats identified by OWASP in their *2023* list using Azure API Management.

Even though API Management provides comprehensive controls for API security, other Microsoft services provide complementary functionality to detect or protect against OWASP API threats:

- [Defender for APIs](/azure/defender-for-cloud/defender-for-apis-introduction), a capability of [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) [that integrates natively with API Management](/azure/api-management/protect-with-defender-for-apis), provides API security insights, recommendations, and threat detection. [Learn how to protect against OWASP API threats with Defender for APIs](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/protect-against-owasp-api-top-10-security-risks-using-defender/ba-p/4093913).
- [Azure API Center](/azure/api-center/overview) centralizes management and governance of the organization-wide API inventory.
- [Azure Front Door](/azure/frontdoor/front-door-overview), [Azure Application Gateway](/azure/application-gateway/overview), and [Azure Web Application Firewall](/azure/web-application-firewall/overview) provide protection against traditional web application threats and bots.
- [Azure DDoS Protection](/azure/ddos-protection/ddos-protection-overview) helps detect and mitigate DDoS attacks.
- Azure networking services allow for restricting public access to APIs, thus reducing the attack surface.
- [Azure Monitor](/azure/azure-monitor/overview) and [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) provide actionable metrics and logs for investigating threats.
- [Azure Key Vault](/azure/key-vault/general/overview) allows for secure storage of certificates and secrets used in API Management.
- [Microsoft Entra](/entra/fundamentals/what-is-entra) provides advanced methods of identity management and authentication and authorization of requests in API Management.

## Broken object level authorization 

API objects that aren't protected with the appropriate level of authorization may be vulnerable to data leaks and unauthorized data manipulation through weak object access identifiers. For example, an attacker could exploit an integer object identifier, which can be iterated. 

More information about this threat: [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md)

### Recommendations 

* The best place to implement object level authorization is within the backend API itself. At the backend, the correct authorization decisions can be made at the request (or object) level, where applicable, using logic applicable to the domain and API. Consider scenarios where a given request may yield differing levels of detail in the response, depending on the requestor's permissions and authorization. 

* If a current vulnerable API can't be changed at the backend, then API Management could be used as a fallback. For example:
   
   * Use a custom policy to implement object-level authorization, if it's not implemented in the backend.
   * Implement a custom policy to map identifiers from request to backend and from backend to client, so that internal identifiers aren't exposed. 

    In these cases, the custom policy could be a [policy expression](api-management-policy-expressions.md) with a look-up (for example, a dictionary) or integration with another service through the [send-request](send-request-policy.md) policy.

* For GraphQL scenarios, enforce object-level authorization through the [validate-graphql-request](validate-graphql-request-policy.md) policy, using the `authorize` element.  

## Broken authentication 

The authentication mechanism for a site or API is especially vulnerable because it's open to anonymous users. Assets and endpoints required for authentication, including forgotten password or reset password flows, should be protected to prevent exploitation.

More information about this threat: [API2:2023 Broken Authentication](https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/)

### Recommendations

- Use Microsoft Entra to implement [API authentication](/azure/api-management/authentication-authorization-overview). Microsoft Entra automatically provides protected, resilient, and geographically distributed login endpoints. Use the [validate-azure-ad-token](validate-azure-ad-token-policy.md) policy to validate Microsoft Entra tokens in incoming API requests.
- Where authentication is required, API Management supports [validation of OAuth 2 tokens](/azure/api-management/authentication-authorization-overview), [basic authentication](/azure/api-management/authentication-basic-policy), [client certificates](/azure/api-management/api-management-howto-mutual-certificates-for-clients), and API keys.
    - Ensure proper configuration of authentication methods. For example, set `require-expiration-time` and `require-signed-tokens` to `true` when validating OAuth2 tokens using the [validate-jwt](/azure/api-management/validate-jwt-policy) policy.
- [Rate limiting](/azure/api-management/api-management-sample-flexible-throttling) can be utilized to reduce the effectiveness of brute force attacks.
- [Client IP filtering](/azure/api-management/ip-filter-policy) can be used to reduce the attack surface area. Network security groups can be applied to virtual networks [integrated with API Management](/azure/api-management/virtual-network-concepts).
- If possible, authenticate to backends from API Management through secure protocols and [managed identity](/azure/api-management/api-management-howto-use-managed-service-identity) or [credential manager](/azure/api-management/credentials-overview) to authenticate to backends.
- Ensure tokens or keys are passed in headers and not URLs for inbound requests to API Management and outbound requests to backends.
- Use Microsoft Entra to [secure access](/azure/api-management/api-management-howto-aad) to the API Management developer portal.

## Broken object property level authorization

Good API interface design is deceptively challenging. Often, particularly with legacy APIs that have evolved over time, the request and response interfaces contain more data fields than the consuming applications require, enabling data injection attacks. Attackers may also discover undocumented interfaces. These vulnerabilities could yield sensitive data to the attacker.

More information about this threat: [API3:2023 Broken Object Property Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)


### Recommendations

- The best approach to mitigating this vulnerability is to ensure that the external interfaces defined at the backend API are designed carefully and, ideally, independently of the data persistence. They should contain only the fields required by consumers of the API. APIs should be reviewed frequently, and legacy fields deprecated, then removed.
- In API Management, use [revisions](/azure/api-management/api-management-revisions) to gracefully control nonbreaking changes, for example, the addition of a field to an interface, and [versions](/azure/api-management/api-management-versions) to implement breaking changes. You should also version backend interfaces, which typically have a different lifecycle than consumer-facing APIs.
- Decouple external API interfaces from the internal data implementation. Avoid binding API contracts directly to data contracts in backend services.
- If it's not possible to alter the backend interface design and excessive data is a concern, use API Management [transformation policies](/azure/api-management/api-management-policies#transformation) to rewrite response payloads and mask or filter data. [Content validation](/azure/api-management/validate-content-policy) in API Management can be used with an XML or JSON schema to block responses with undocumented properties or improper values. For example, [remove unneeded JSON properties](/azure/api-management/policies/filter-response-content) from a response body. Blocking requests with undocumented properties mitigates attacks, while blocking responses with undocumented properties makes it harder to reverse-engineer potential attack vectors. The [validate-content](/azure/api-management/validate-content-policy) policy also supports blocking responses exceeding a specified size.
- Use the [validate-status-code](/azure/api-management/validate-status-code-policy) policy to block responses with errors undefined in the API schema.
- Use the [validate-headers](/azure/api-management/validate-headers-policy) policy to block responses with headers that aren't defined in the schema or don't comply to their definition in the schema. Remove unwanted headers with the [set-header](/azure/api-management/set-header-policy) policy.
- For GraphQL scenarios, use the [validate-graphql-request](/azure/api-management/validate-graphql-request-policy) policy to validate GraphQL requests, authorize access to specific query paths, and limit response size.

## Unrestricted resource consumption

APIs require resources to run, like memory or CPU, and may include downstream integrations that represent an operating cost (for example, pay-per-request services). Applying limits can help protect APIs from excessive resource consumption.

More information about this threat: [API4:2023 Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)

### Recommendations

- Use [rate-limit-by-key](/azure/api-management/rate-limit-by-key-policy) or [rate-limit](/azure/api-management/rate-limit-policy) policies to apply throttling on shorter time windows. Apply stricter rate-limiting policies on sensitive endpoints, like password reset, sign-in, or sign-up operations, or endpoints that consume significant resources.
- Use [quota-by-key](/azure/api-management/quota-by-key-policy) or [quota-limit](/azure/api-management/quota-policy) policies to control the allowed number of API calls or bandwidth for longer time frames.
- Optimize performance with [built-in caching](/azure/api-management/api-management-howto-cache), thus reducing the consumption of CPU, memory, and networking resources for certain operations.
- Apply validation policies.
    - Use the `max-size` attribute in the [validate-content](/azure/api-management/validate-content-policy) policy to enforce maximum size of requests and responses
    - Define schemas and properties, such as string length or maximum array size, in the API specification. Use [validate-content](validate-content-policy.md), [validate-parameters](validate-parameters-policy.md), and [validate-headers](validate-headers-policy.md) policies to enforce those schemas for requests and responses.
    - Use the [validate-graphql-request](/azure/api-management/validate-graphql-request-policy) policy for GraphQL APIs and configure `max-depth` and `max-size` parameters.
    - Configure alerts in Azure Monitor for excessive consumption of data by users.
- For generative AI APIs:
    - Use [semantic caching](/azure/api-management/azure-openai-enable-semantic-caching) to reduce load on the backends.
    - Use [token limiting](genai-gateway-capabilities.md#token-limit-policy) to control consumption and costs.
    - Emit [token consumption metrics](genai-gateway-capabilities.md#emit-token-metric-policy) to monitor token utilization and configure alerts.
- Minimize the time it takes a backend service to respond. The longer the backend service takes to respond, the longer the connection is occupied in API Management, therefore reducing the number of requests that can be served in a given time frame.
    - Define `timeout` in the [forward-request](/azure/api-management/forward-request-policy) policy and strive for the shortest acceptable value.
    - Limit the number of parallel backend connections with the [limit-concurrency](/azure/api-management/limit-concurrency-policy) policy.
- Apply a [CORS](/azure/api-management/cors-policy) policy to control the websites that are allowed to load the resources served through the API. To avoid overly permissive configurations, don't use wildcard values (`*`) in the CORS policy.
- While Azure has both platform-level protection and [enhanced protection](/azure/ddos-protection/ddos-protection-overview) against distributed denial of service (DDoS) attacks, application (layer 7) protection for APIs can be improved by deploying a bot protection service in front of API Management - for example, [Azure Application Gateway](/azure/api-management/api-management-howto-integrate-internal-vnet-appgateway), [Azure Front Door](/azure/api-management/front-door-api-management), or [Azure DDoS Protection](/azure/ddos-protection/). When using a web application firewall (WAF) policy with Azure Application Gateway or Azure Front Door, consider using [Microsoft_BotManagerRuleSet_1.0](/azure/web-application-firewall/afds/afds-overview#bot-protection-rule-set).
 
## Broken function level authorization

Complex access control policies with different hierarchies, groups, and roles, and an unclear separation between administrative and regular functions, lead to authorization flaws. By exploiting these issues, attackers gain access to other users' resources or administrative functions.

More information about this threat: [API5:2023 Broken function level authorization](https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/)

### Recommendations

- By default, protect all API endpoints in API Management with [subscription keys](/azure/api-management/api-management-subscriptions) or all-APIs-level authorization policy. If applicable, define other authorization policies for specific APIs or API operations.
- Validate OAuth tokens using policies.
    - Use [validate-azure-ad-token](/azure/api-management/validate-azure-ad-token-policy) policy to validate Microsoft Entra tokens. Specify all required claims and, if applicable, specify authorized applications.
    - For validating tokens not issued by Microsoft Entra, define a [validate-jwt](/azure/api-management/validate-jwt-policy) policy and enforce required token claims. If possible, require expiration time.
    - If possible, use encrypted tokens or list specific applications for access.
    - Monitor and review requests rejected due to lack of authorization.
- Use an Azure virtual network or Private Link to hide API endpoints from the internet. Learn more about [virtual network options](/azure/api-management/virtual-network-concepts) with API Management.
- Don't define [wildcard API operations](/azure/api-management/add-api-manually#add-and-test-a-wildcard-operation) (that is, "catch-all" APIs with `* `as the path). Ensure that API Management only serves requests for explicitly defined endpoints, and requests to undefined endpoints are rejected.
- Don't publish APIs with [open products](/azure/api-management/api-management-howto-add-products#access-to-product-apis) that don't require a subscription.
- If client IPs are known, use an [ip-filter](ip-filter-policy.md) policy to allow traffic only from authorized IP addresses.
- Use the [validate-client-certificate](validate-client-certificate-policy.md) policy to enforce that a certificate presented by a client to an API Management instance matches specified validation rules and claims.

## Unrestricted access to sensitive business flows

APIs can expose a wide range of functionality to the consuming application. It's important for API authors to understand the business flows the API provides and the associated sensitivity. There's a greater risk to the business if APIs exposing sensitive flows don't implement appropriate protections.

More information about this threat: [API6:2023 Unrestricted Access to Sensitive Business Flows](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)

### Recommendations

- Reduce or block access based on client fingerprints. For example, use the [return-response](return-response-policy.md) policy with the [choose](choose-policy.md) policy to block traffic from headless browsers based on the User-Agent header or consistency of other headers.
- Use [validate-parameters](validate-parameters-policy.md) policy to enforce that request headers match the API specification.
- Use [ip-filter](ip-filter-policy.md) policy to allow requests only from known IP addresses or deny access from specific IPs.
- Use private networking features to limit external connectivity to internal APIs.
- Use [rate-limit-by-key](rate-limit-by-key-policy.md) policy to limit spikes in API consumption based on user identity, IP address, or another value.
- Front API Management with Azure Application Gateway or Azure DDoS Protection service to detect and block bot traffic.

## Server side request forgery 

A server side request forgery vulnerability could occur when the API fetches a downstream resource based on the value of a URL which has been passed by the API caller without appropriate validation checks.

More information about this threat: [API7:2023 Server Side Request Forgery](https://owasp.org/API-Security/editions/2023/en/0xa7-server-side-request-forgery/)

### Recommendations
- If possible, don't use URLs provided in the client payloads, for example, as parameters for backend URLs, [send-request](send-request-policy.md) policy, or [rewrite-url](rewrite-uri-policy.md) policy.
- If API Management or backend services use URLs provided in request payload for business logic, define and enforce a limited list of hostnames, ports, media types, or other attributes with policies in API Management, such as the [choose](/azure/api-management/choose-policy) policy and policy expressions.
- Define the `timeout` attribute in the [forward-request](forward-request-policy.md) and [send-request](send-request-policy.md) policies.
- Validate and sanitize request and response data with validation policies. If needed, use the [set-body](set-body-policy.md) policy to process the response and avoid returning raw data.
- Use private networking to restrict connectivity. For example, if the API doesn't need to be public, restrict connectivity from the internet to reduce the attack surface.

## Security misconfiguration

Attackers may attempt to exploit security misconfiguration vulnerabilities such as:

- Missing security hardening
- Unnecessarily enabled features
- Network connections unnecessarily open to the internet
- Use of weak protocols or ciphers

More information about this threat: [API8:2023 Security misconfiguration](https://owasp.org/API-Security/editions/2023/en/0xa8-security-misconfiguration/)

### Recommendations

- Correctly configure [gateway TLS](/azure/api-management/api-management-howto-manage-protocols-ciphers). Don't use vulnerable protocols (for example, TLS 1.0, 1.1) or ciphers.
- Configure APIs to accept encrypted traffic only, for example through HTTPS or WSS protocols. You can audit and enforce this setting using [Azure Policy](/azure/api-management/policy-reference).
- Consider deploying API Management behind a [private endpoint](/azure/api-management/private-endpoint) or attached to a [virtual network deployed in internal mode](/azure/api-management/api-management-using-with-internal-vnet). In internal networks, access can be controlled from within the private network (via firewall or network security groups) and from the internet (via a reverse proxy).
- Use Azure API Management policies:
    - Always inherit parent policies through the `<base>` tag.
    - When using OAuth 2.0, configure and test the [validate-jwt](/azure/api-management/validate-jwt-policy) policy to check the existence and validity of the token before it reaches the backend. Automatically check the token expiration time, token signature, and issuer. Enforce claims, audiences, token expiration, and token signature through policy settings. If you use Microsoft Entra, the [validate-azure-ad-token](validate-azure-ad-token-policy.md) policy provides a more comprehensive and easier way to validate security tokens.
    - Configure the [CORS](/azure/api-management/cors-policy) policy and don't use wildcard `*` for any configuration option. Instead, explicitly list allowed values.
    - Set [validation policies](/azure/api-management/api-management-policies#content-validation) in production environments to validate JSON and XML schemas, headers, query parameters, and status codes, and to enforce the maximum size for request or response.
    - If API Management is outside a network boundary, client IP validation is still possible using the [restrict caller IPs](/azure/api-management/ip-filter-policy) policy. Ensure that it uses an allowlist, not a blocklist.
    - If client certificates are used between caller and API Management, use the [validate-client-certificate](/azure/api-management/validate-client-certificate-policy) policy. Ensure that the `validate-revocation`, `validate-trust`, `validate-not-before`, and `validate-not-after` attributes are all set to `true`.
- Client certificates (mutual TLS) can also be applied between API Management and the backend. The backend should:
    - Have authorization credentials configured
    - Validate the certificate chain where applicable
    - Validate the certificate name where applicable
    - For GraphQL scenarios, use the [validate-graphQL-request](/azure/api-management/validate-graphql-request-policy) policy. Ensure that the `authorization` element and `max-size` and `max-depth` attributes are set.
- Don't store secrets in policy files or in source control. Always use API Management [named values](/azure/api-management/api-management-howto-properties) or fetch the secrets at runtime using custom policy expressions. Named values should be [integrated with Azure Key Vault](/azure/api-management/api-management-howto-properties#key-vault-secrets) or encrypted within API Management by marking them "secret". Never store secrets in plain-text named values.
- Publish APIs through [products](/azure/api-management/api-management-howto-add-products), which require subscriptions. Don't use [open products](/azure/api-management/api-management-howto-add-products#access-to-product-apis) that don't require a subscription.
- Ensure that your APIs require subscription keys, even if all products are configured to require subscription keys. [Learn more](/azure/api-management/api-management-subscriptions#how-api-management-handles-requests-with-or-without-subscription-keys)
- Require subscription approval for all products and carefully review all subscription requests.
- Use Key Vault integration to manage all certificates. This centralizes certificate management and can help to ease operations management tasks such as certificate renewal or revocation. Use managed identity to authenticate to key vaults.
- When using the [self-hosted-gateway](/azure/api-management/self-hosted-gateway-overview), ensure that there's a process in place to update the image to the latest version periodically.
- Represent backend services as [backend entities](/azure/api-management/backends). Configure authorization credentials, certificate chain validation, and certificate name validation where applicable.
- Where possible, use credential manager or managed identity to authenticate against backend services.
- When using the [developer portal](/azure/api-management/api-management-howto-developer-portal):
    - If you choose to [self-host](/azure/api-management/developer-portal-self-host) the developer portal, ensure there's a process in place to periodically update the self-hosted portal to the latest version. Updates for the default managed version are automatic.
    - Use [Microsoft Entra ID](/azure/api-management/api-management-howto-aad) or [Azure Active Directory B2C](/azure/api-management/api-management-howto-aad-b2c) for user sign-up and sign-in. Disable the default username and password authentication, which is less secure.
    - Assign [user groups](/azure/api-management/api-management-howto-create-groups#-associate-a-group-with-a-product) to products, to control the visibility of APIs in the portal.
- Use [Azure Policy](/azure/api-management/security-controls-policy) to enforce API Management resource-level configuration and role-based access control (RBAC) permissions to control resource access. Grant minimum required privileges to every user.
- Use a [DevOps process](/azure/api-management/devops-api-development-templates) and infrastructure-as-code approach outside of a development environment to ensure consistency of API Management content and configuration changes and to minimize human errors.
- Don't use any deprecated features.

## Improper inventory management 

Vulnerabilities related to improper assets management include:

- Lack of proper API documentation or ownership information
- Excessive numbers of older API versions, which may be missing security fixes

More information about this threat: [API9:2023 Improper inventory management](https://owasp.org/API-Security/editions/2023/en/0xa9-improper-inventory-management/)

### Recommendations
- Use a well-defined [OpenAPI specification](https://swagger.io/specification/) as the source for importing REST APIs. The specification allows encapsulation of the API definition, including self-documenting metadata.
- Use API interfaces with precise paths, data schemas, headers, query parameters, and status codes. Avoid [wildcard operations](/azure/api-management/add-api-manually#add-and-test-a-wildcard-operation). Provide descriptions for each API and operation and include contact and license information.
- Avoid endpoints that don't directly contribute to the business objective. They unnecessarily increase the attack surface area and make it harder to evolve the API.
- Use [revisions](/azure/api-management/api-management-revisions) and [versions](/azure/api-management/api-management-versions) in API Management to manage API changes. Have a strong backend versioning strategy and commit to a maximum number of supported API versions (for example, 2 or 3 prior versions). Plan to quickly deprecate and ultimately remove older, often less secure, API versions. Ensure security controls are implemented across all available API versions.
- Separate environments (such as development, test, and production) with different API Management services. Ensure that each API Management service connects to its dependencies in the same environment. For example, in the test environment, the test API Management resource should connect to a test Azure Key Vault resource and the test versions of backend services. Use [DevOps automation and infrastructure-as-code practices](/azure/api-management/devops-api-development-templates) to help maintain consistency and accuracy between environments and reduce human errors.
- Isolate administrative permissions to APIs and related resources using [workspaces](/azure/api-management/workspaces-overview).
- Use tags to organize APIs and products and group them for publishing.
- Publish APIs for consumption through a [developer portal](/azure/api-management/api-management-howto-developer-portal). Make sure the API documentation is up to date.
- Discover undocumented or unmanaged APIs and expose them through API Management for better control.
- Use [Azure API Center](/azure/api-center/overview) to maintain a comprehensive, centralized inventory of APIs, versions, and deployments, even if APIs aren't managed in Azure API Management.

## Unsafe consumption of APIs

Resources obtained through downstream integrations tend to be more highly trusted than API input from the caller or end user. If the appropriate sanitization and security standards are not applied, the API could be vulnerable, even if the integration is provided through a trusted service.

More information about this threat: [API10:2023 Unsafe Consumption of APIs](https://owasp.org/API-Security/editions/2023/en/0xaa-unsafe-consumption-of-apis/)

### Recommendations

- Consider using API Management to act as a façade for downstream dependencies that the backend APIs integrate with.
- If downstream dependencies are fronted with API Management or if downstream dependencies are consumed with a [send-request](send-request-policy.md) policy in API Management, use the recommendations from other sections of this documentation to ensure their safe and controlled consumption, including:
    - Ensure secure transport is enabled and [enforce TLS/SSL configuration](/azure/api-management/api-management-howto-manage-protocols-ciphers)
    - If possible, authenticate with credential manager or managed identity
    - Control consumption with rate-limit-by-key and quota-limit-by-key policies
    - Log or block responses that are incompliant with the API specification using the validate-content and validate-header policies
    - Transform responses with the set-body policy, for example to remove unnecessary or sensitive information
    - Configure timeouts and limit concurrency 

## Related content

Learn more about:

* [Authentication and authorization in API Management](authentication-authorization-overview.md)
* [Security baseline for API Management](/security/benchmark/azure/baselines/api-management-security-baseline)
* [Security controls by Azure Policy](security-controls-policy.md)
* [Building a comprehensive API security strategy](https://aka.ms/API-Security-EBook)
* [Landing zone accelerator for API Management](/azure/cloud-adoption-framework/scenarios/app-platform/api-management/landing-zone-accelerator)
* [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)
