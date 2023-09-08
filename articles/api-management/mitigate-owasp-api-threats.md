---
title: Mitigate OWASP API security top 10 in Azure API Management
description: Learn how to protect against common API-based vulnerabilities, as identified by the OWASP API Security Top 10 threats, using Azure API Management. 
author: mikebudzynski
ms.service: api-management
ms.topic: conceptual
ms.date: 04/13/2023
ms.author: mibudz
---

# Recommendations to mitigate OWASP API Security Top 10 threats using API Management

The Open Web Application Security Project ([OWASP](https://owasp.org/about/)) Foundation works to improve software security through its community-led open source software projects, hundreds of chapters worldwide, tens of thousands of members, and by hosting local and global conferences.

The OWASP [API Security Project](https://owasp.org/www-project-api-security/) focuses on strategies and solutions to understand and mitigate the unique *vulnerabilities and security risks of APIs*. In this article, we'll discuss recommendations to use Azure API Management to mitigate the top 10 API threats identified by OWASP.

> [!NOTE]
> In addition to following the recommendations in this article, you can enable [Defender for APIs](/azure/defender-for-cloud/defender-for-apis-introduction) (preview), a capability of [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction), for API security insights, recommendations, and threat detection. [Learn more about using Defender for APIs with API Management](protect-with-defender-for-apis.md)

## Broken object level authorization 

API objects that aren't protected with the appropriate level of authorization may be vulnerable to data leaks and unauthorized data manipulation through weak object access identifiers. For example, an attacker could exploit an integer object identifier, which can be iterated. 

More information about this threat: [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md)

### Recommendations 

* The best place to implement object level authorization is within the backend API itself. At the backend, the correct authorization decisions can be made at the request (or object) level, where applicable, using logic applicable to the domain and API. Consider scenarios where a given request may yield differing levels of detail in the response, depending on the requestor's permissions and authorization. 

* If a current vulnerable API can't be changed at the backend, then API Management could be used as a fallback. For example:
    
    * Use a custom policy to implement object-level authorization, if it's not implemented in the backend.

    * Implement a custom policy to map identifiers from request to backend and from backend to client, so that internal identifiers aren't exposed. 

        In these cases, the custom policy could be a [policy expression](api-management-policy-expressions.md) with a look-up (for example, a dictionary) or integration with another service through the [send request](send-request-policy.md) policy.

* For GraphQL scenarios, enforce object-level authorization through the [validate GraphQL request](validate-graphql-request-policy.md) policy, using the `authorize` element.  

## Broken user authentication

Authentication mechanisms are often implemented incorrectly or missing, allowing attackers to exploit implementation flaws to access data. 

More information about this threat: [API2:2019 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa2-broken-user-authentication.md)

### Recommendations 

Use API Management for user authentication and authorization: 

* **Authentication** -  API Management supports the following [authentication methods](api-management-authentication-policies.md): 

    * [Basic authentication](authentication-basic-policy.md) policy - Username and password credentials.

    * [Subscription key](api-management-subscriptions.md) - A subscription key provides a similar level of security as basic authentication and may not be sufficient alone. If the subscription key is compromised, an attacker may get unlimited access to the system. 

    * [Client certificate](authentication-certificate-policy.md) policy - Using client certificates is more secure than basic credentials or subscription key, but it doesn't allow the flexibility provided by token-based authorization protocols such as OAuth 2.0. 

* **Authorization** - API Management supports a [validate JWT](validate-jwt-policy.md) policy to check the validity of an incoming OAuth 2.0 JWT access token based on information obtained from the OAuth identity provider's metadata endpoint. Configure the policy to check relevant token claims, audience, and expiration time. Learn more about protecting an API using [OAuth 2.0 authorization and Azure Active Directory](api-management-howto-protect-backend-with-aad.md). 

More recommendations:

* Use [access restriction policies](api-management-access-restriction-policies.md) in API Management to increase security. For example, [call rate limiting](rate-limit-policy.md) slows down bad actors using brute force attacks to compromise credentials. 

* APIs should use TLS/SSL (transport security) to protect the credentials or tokens. Credentials and tokens should be sent in request headers and not as query parameters. 

* In the API Management [developer portal](api-management-howto-developer-portal.md), configure [Azure Active Directory](api-management-howto-aad.md) or [Azure Active Directory B2C](api-management-howto-aad-b2c.md) as the identity provider to increase the account security. The developer portal uses CAPTCHA to mitigate brute force attacks. 

### Related information 

* [Authentication vs. authorization](../active-directory/develop/authentication-vs-authorization.md) 

## Excessive data exposure 

Good API interface design is deceptively challenging. Often, particularly with legacy APIs that have evolved over time, the request and response interfaces contain more data fields than the consuming applications require.  

A bad actor could attempt to access the API directly (perhaps by replaying a valid request), or sniff the traffic between server and API. Analysis of the API actions and the data available could yield sensitive data to the attacker, which isn't surfaced to, or used by, the frontend application. 

More information about this threat: [API3:2019 Excessive Data Exposure](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa3-excessive-data-exposure.md) 

### Recommendations 

* The best approach to mitigating this vulnerability is to ensure that the external interfaces defined at the backend API are designed carefully and, ideally, independently of the data persistence. They should contain only the fields required by consumers of the API. APIs should be reviewed frequently, and legacy fields deprecated, then removed. 

    In API Management, use:
    * [Revisions](api-management-revisions.md) to gracefully control nonbreaking changes, for example, the addition of a field to an interface. You may use revisions along with a versioning implementation at the backend.

    * [Versions](api-management-versions.md) for breaking changes, for example, the removal of a field from an interface. 

* If it's not possible to alter the backend interface design and excessive data is a concern, use API Management [transformation policies](transform-api.md) to rewrite response payloads and mask or filter data. For example, [remove unneeded JSON properties](./policies/filter-response-content.md) from a response body. 

* [Response content validation](validate-content-policy.md) in API Management can be used with an XML or JSON schema to block responses with undocumented properties or improper values. The policy also supports blocking responses exceeding a specified size. 

* Use the [validate status code](validate-status-code-policy.md) policy to block responses with errors undefined in the API schema. 

* Use the [validate headers](validate-headers-policy.md) policy to block responses with headers that aren't defined in the schema or don't comply to their definition in the schema. Remove unwanted headers with the [set header](set-header-policy.md) policy. 

* For GraphQL scenarios, use the [validate GraphQL request](validate-graphql-request-policy.md) policy to validate GraphQL requests, authorize access to specific query paths, and limit response size.

## Lack of resources and rate limiting 

Lack of rate limiting may lead to data exfiltration or successful DDoS attacks on backend services, causing an outage for all consumers. 

More information about this threat: [API4:2019 Lack of resources and rate limiting](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting.md)

### Recommendations 

* Use [rate limit](rate-limit-policy.md) (short-term) and [quota limit](quota-policy.md) (long-term) policies to control the allowed number of API calls or bandwidth per consumer. 

* Define strict request object definitions and their properties in the OpenAPI definition. For example, define the max value for paging integers, maxLength and regular expression (regex) for strings. Enforce those schemas with the [validate content](validate-content-policy.md) and [validate parameters](validate-parameters-policy.md) policies in API Management. 

* Enforce maximum size of the request with the [validate content](validate-content-policy.md) policy. 

* Optimize performance with [built-in caching](api-management-howto-cache.md), thus reducing the consumption of CPU, memory, and networking resources for certain operations. 

* Enforce authentication for API calls (see [Broken user authentication](#broken-user-authentication)). Revoke access for abusive users. For example, deactivate the subscription key, block the IP address with the [restrict caller IPs](ip-filter-policy.md) policy, or reject requests for a certain user claim from a [JWT token](validate-jwt-policy.md). 

* Apply a [CORS](cors-policy.md) policy to control the websites that are allowed to load the resources served through the API. To avoid overly permissive configurations, don’t use wildcard values (`*`) in the CORS policy. 

* Minimize the time it takes a backend service to respond. The longer the backend service takes to respond, the longer the connection is occupied in API Management, therefore reducing the number of requests that can be served in a given timeframe. 

    * Define `timeout` in the [forward request](forward-request-policy.md) policy. 

    * Use the [validate GraphQL request](validate-graphql-request-policy.md) policy for GraphQL APIs and configure `max-depth` and `max-size` parameters. 

    * Limit the number of parallel backend connections with the [limit concurrency](limit-concurrency-policy.md) policy. 

* While API Management can protect backend services from DDoS attacks, it may be vulnerable to those attacks itself. Deploy a bot protection service in front of API Management (for example, [Azure Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md), [Azure Front Door](front-door-api-management.md), or [Azure DDoS Protection](protect-with-ddos-protection.md)) to better protect against DDoS attacks. When using a WAF with Azure Application Gateway or Azure Front Door, consider using [Microsoft_BotManagerRuleSet_1.0](../web-application-firewall/afds/afds-overview.md#bot-protection-rule-set). 

## Broken function level authorization

Complex access control policies with different hierarchies, groups, and roles, and an unclear separation between administrative and regular functions lead to authorization flaws. By exploiting these issues, attackers gain access to other users’ resources or administrative functions. 

More information about this threat: [API5:2019 Broken function level authorization](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa5-broken-function-level-authorization.md) 

### Recommendations 
 
* By default, protect all API endpoints in API Management with [subscription keys](api-management-subscriptions.md). 

* Define a [validate JWT](validate-jwt-policy.md) policy and enforce required token claims. If certain operations require stricter claims enforcement, define extra `validate-jwt` policies for those operations only. 

* Use an Azure virtual network or Private Link to hide API endpoints from the internet. Learn more about [virtual network options](virtual-network-concepts.md) with API Management.

* Don't define [wildcard API operations](add-api-manually.md#add-and-test-a-wildcard-operation) (that is, "catch-all" APIs with `*` as the path). Ensure that API Management only serves requests for explicitly defined endpoints, and requests to undefined endpoints are rejected. 

* Don't publish APIs with [open products](api-management-howto-add-products.md#access-to-product-apis) that don't require a subscription. 

## Mass assignment

If an API offers more fields than the client requires for a given action, an attacker may inject excessive properties to perform unauthorized operations on data. Attackers may discover undocumented properties by inspecting the format of requests and responses or other APIs, or guessing them. This vulnerability is especially applicable if you don’t use strongly typed programming languages. 

More information about this threat: [API6:2019 Mass assignment](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md)

### Recommendations 

* External API interfaces should be decoupled from the internal data implementation. Avoid binding API contracts directly to data contracts in backend services. Review the API design frequently, and deprecate and remove legacy properties using [versioning](api-management-versions.md) in API Management. 

* Precisely define XML and JSON contracts in the API schema and use [validate content](validate-content-policy.md) and [validate parameters](validate-parameters-policy.md) policies to block requests and responses with undocumented properties. Blocking requests with undocumented properties mitigates attacks, while blocking responses with undocumented properties makes it harder to reverse-engineer potential attack vectors. 

* If the backend interface can't be changed, use [transformation policies](transform-api.md) to rewrite request and response payloads and decouple the API contracts from backend contracts. For example, mask or filter data or [remove unneeded JSON properties](./policies/filter-response-content.md). 

## Security misconfiguration 

Attackers may attempt to exploit security misconfiguration vulnerabilities such as:

* Missing security hardening
* Unnecessary enabled features
* Network connections unnecessarily open to the internet
* Use of weak protocols or ciphers
* Other settings or endpoints that may allow unauthorized access to the system

More information about this threat: [API7:2019 Security misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa7-security-misconfiguration.md) 

### Recommendations 

* Correctly configure [gateway TLS](api-management-howto-manage-protocols-ciphers.MD). Don't use vulnerable protocols (for example, TLS 1.0, 1.1) or ciphers. 

* Configure APIs to accept encrypted traffic only, for example through HTTPS or WSS protocols. 

* Consider deploying API Management behind a [private endpoint](private-endpoint.md) or attached to a [virtual network deployed in internal mode](api-management-using-with-internal-vnet.md). In internal networks, access can be controlled from within the private network (via firewall or network security groups) and from the internet (via a reverse proxy). 

* Use Azure API Management policies: 

    * Always inherit parent policies through the `<base>` tag.	 

    * When using OAuth 2.0, configure and test the [validate JWT](validate-jwt-policy.md) policy to check the existence and validity of the JWT token before it reaches the backend. Automatically check the token expiration time, token signature, and issuer. Enforce claims, audiences, token expiration, and token signature through policy settings. 

    * Configure the [CORS](cors-policy.md) policy and don't use wildcard `*` for any configuration option. Instead, explicitly list allowed values. 

    * Set [validation policies](validation-policies.md) to `prevent` in production environments to validate JSON and XML schemas, headers, query parameters, and status codes, and to enforce the maximum size for request or response. 

    * If API Management is outside a network boundary, client IP validation is still possible using the [restrict caller IPs](ip-filter-policy.md) policy. Ensure that it uses an allowlist, not a blocklist. 

    * If client certificates are used between caller and API Management, use the [validate client certificate](validate-client-certificate-policy.md) policy. Ensure that the `validate-revocation`, `validate-trust`, `validate-not-before`, and `validate-not-after` attributes are all set to `true`. 

        * Client certificates (mutual TLS) can also be applied between API Management and the backend. The backend should:

            * Have authorization credentials configured		 

            * Validate the certificate chain where applicable 

            * Validate the certificate name where applicable 

* For GraphQL scenarios, use the [validate GraphQL request](validate-graphql-request-policy.md) policy. Ensure that the `authorization` element and `max-size` and `max-depth` attributes are set. 

* Don't store secrets in policy files or in source control. Always use API Management [named values](api-management-howto-properties.md) or fetch the secrets at runtime using custom policy expressions.	 

    * Named values should be [integrated with Key Vault](api-management-howto-properties.md#key-vault-secrets) or encrypted within API Management by marking them "secret". Never store secrets in plain-text named values.

* Publish APIs through [products](api-management-howto-add-products.md), which require subscriptions. Don't use [open products](api-management-howto-add-products.md#access-to-product-apis) that don't require a subscription.

* Use Key Vault integration to manage all certificates – this centralizes certificate management and can help to ease operations management tasks such as certificate renewal or revocation. 

* When using the [self-hosted-gateway](self-hosted-gateway-overview.md), ensure that there's a process in place to update the image to the latest version periodically. 

* Represent backend services as [backend entities](backends.md). Configure authorization credentials, certificate chain validation, and certificate name validation where applicable. 

* When using the [developer portal](api-management-howto-developer-portal.md): 

    * If you choose to [self-host](developer-portal-self-host.md) the developer portal, ensure there's a process in place to periodically update the self-hosted portal to the latest version. Updates for the default managed version are automatic. 

    * Use [Azure Active Directory (Azure AD)](api-management-howto-aad.md) or [Azure Active Directory B2C](api-management-howto-aad-b2c.md) for user sign-up and sign-in. Disable the default username and password authentication, which is less secure. 

    * Assign [user groups](api-management-howto-create-groups.md#-associate-a-group-with-a-product) to products, to control the visibility of APIs in the portal.  

* Use [Azure Policy](security-controls-policy.md) to enforce API Management resource-level configuration and role-based access control (RBAC) permissions to control resource access. Grant minimum required privileges to every user. 

* Use a [DevOps process](devops-api-development-templates.md) and infrastructure-as-code approach outside of a development environment to ensure consistency of API Management content and configuration changes and to minimize human errors.  

* Don't use any deprecated features.

## Injection

Any endpoint accepting user data is potentially vulnerable to an injection exploit. Examples include, but aren't limited to: 

* [Command injection](https://owasp.org/www-community/attacks/Command_Injection), where a bad actor attempts to alter the API request to execute commands on the operating system hosting the API

* [SQL injection](https://owasp.org/www-community/attacks/SQL_Injection), where a bad actor attempts to alter the API request to execute commands and queries against the database an API depends on 

More information about this threat: [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md)

### Recommendations

* [Modern Web Application Firewall (WAF) policies](https://github.com/SpiderLabs/ModSecurity) cover many common injection vulnerabilities. While API Management doesn’t have a built-in WAF component, deploying a WAF upstream (in front) of the API Management instance is strongly recommended. For example, use [Azure Application Gateway](/azure/architecture/reference-architectures/apis/protect-apis) or [Azure Front Door](front-door-api-management.md). 

    > [!IMPORTANT]
    > Ensure that a bad actor can't bypass the gateway hosting the WAF and connect directly to the API Management gateway or backend API itself. Possible mitigations include: [network ACLs](../virtual-network/network-security-groups-overview.md), using API Management policy to [restrict inbound traffic by client IP](ip-filter-policy.md), removing public access where not required, and [client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) (also known as mutual TLS or mTLS). 

* Use schema and parameter [validation](validation-policies.md) policies, where applicable, to further constrain and validate the request before it reaches the backend API service. 

    The schema supplied with the API definition should have a regex pattern constraint applied to vulnerable fields. Each regex should be tested to ensure that it constrains the field sufficiently to mitigate common injection attempts.

### Related information 

* [Deployment stamps pattern with Azure Front Door and API Management](/azure/architecture/patterns/deployment-stamp) 

* [Deploy Azure API Management with Azure Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md)

## Improper assets management

Vulnerabilities related to improper assets management include:

* Lack of proper API documentation or ownership information

* Excessive numbers of older API versions, which may be missing security fixes

More information about this threat: [API9:2019 Improper assets management](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa9-improper-assets-management.md)

### Recommendations

* Use a well-defined [OpenAPI specification](https://swagger.io/specification/) as the source for importing REST APIs. The specification allows encapsulation of the API definition, including self-documenting metadata. 

    * Use API interfaces with precise paths, data schemas, headers, query parameters, and status codes. Avoid [wildcard operations](add-api-manually.md#add-and-test-a-wildcard-operation). Provide descriptions for each API and operation and include contact and license information.  

    * Avoid endpoints that don’t directly contribute to the business objective. They unnecessarily increase the attack surface area and make it harder to evolve the API. 

* Use [revisions](api-management-revisions.md) and [versions](api-management-versions.md) in API Management to govern and control the API endpoints. Have a strong backend versioning strategy and commit to a maximum number of supported API versions (for example, 2 or 3 prior versions). Plan to quickly deprecate and ultimately remove older, often less secure, API versions. 

* Use an API Management instance per environment (such as development, test, and production). Ensure that each API Management instance connects to its dependencies in the same environment. For example, in the test environment, the test API Management resource should connect to a test Azure Key Vault resource and the test versions of backend services. Use [DevOps automation and infrastructure-as-code practices](devops-api-development-templates.md) to help maintain consistency and accuracy between environments and reduce human errors. 

* Use tags to organize APIs and products and group them for publishing. 

* Publish APIs for consumption through the built-in [developer portal](api-management-howto-developer-portal.md). Make sure the API documentation is up-to-date. 

* Discover undocumented or unmanaged APIs and expose them through API Management for better control. 

## Insufficient logging and monitoring 

Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response, allows attackers to further attack systems, maintain persistence, pivot to more systems to tamper with, and extract or destroy data. Most breach studies demonstrate that the time to detect a breach is over 200 days, typically detected by external parties rather than internal processes or monitoring. 

More information about this threat: [API10:2019  Insufficient logging and monitoring](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md) 

### Recommendations

* Understand [observability options](observability.md) in Azure API Management and [best practices](/azure/architecture/best-practices/monitoring) for monitoring in Azure. 

* Monitor API traffic with [Azure Monitor](api-management-howto-use-azure-monitor.md). 

* Log to [Application Insights](api-management-howto-app-insights.md) for debugging purposes. Correlate [transactions in Application Insights](../azure-monitor/app/transaction-diagnostics.md) between API Management and the backend API to [trace them end-to-end](../azure-monitor/app/correlation.md). 

* If needed, forward custom events to [Event Hubs](api-management-howto-log-event-hubs.md). 

* Set alerts in Azure Monitor and Application Insights - for example, for the [capacity metric](api-management-howto-autoscale.md) or for excessive requests or bandwidth transfer. 

* Use the [emit-metric](emit-metric-policy.md) policy for custom metrics. 

* Use the Azure Activity log for tracking activity in the service. 

* Use custom events in [Azure Application Insights](../azure-monitor/app/api-custom-events-metrics.md) and [Azure Monitor](../azure-monitor/app/custom-data-correlation.md) as needed. 

* Configure [OpenTelemetry](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md#introduction-to-opentelemetry) for [self-hosted gateways](self-hosted-gateway-overview.md) on Kubernetes. 

## Next steps

Learn more about:

* [Authentication and authorization in API Management](authentication-authorization-overview.md)
* [Security baseline for API Management](/security/benchmark/azure/baselines/api-management-security-baseline)
* [Security controls by Azure policy](security-controls-policy.md)
* [Landing zone accelerator for API Management](/azure/cloud-adoption-framework/scenarios/app-platform/api-management/landing-zone-accelerator)
* [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)
