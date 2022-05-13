---
title: Address OWASP API threats in Azure API Management
description: Learn how to protect against common API-based threats, as identified by the OWASP top 10 API threats, using Azure API Management. 
author: mikebudzynski

ms.service: api-management
ms.topic: conceptual
ms.date: 05/12/2022
ms.author: mibudz
---

# Recommendations to mitigate OWASP top 10 API threats using API Management

The Open Web Application Security Project ([OWASP](https://owasp.org/about/)) is a nonprofit foundation that works to improve software security. Through community-led open-source software projects, hundreds of chapters worldwide, tens of thousands of members, and leading educational and training conferences, the OWASP Foundation is the source for developers and technologists to secure the web.

The OWASP [API Security Project](https://owasp.org/www-project-api-security/) focuses on strategies and solutions to understand and mitigate the unique vulnerabilities and security risks of APIs. In this article, we'll discuss recommendations to use Azure API Management to mitigate the top 10 risks identified by OWASP.


## Broken object level authorization 

Ensure that API objects are protected with the appropriate level of authorization to prevent data leaks and unauthorized data manipulation through weak object access identifiers – for example, an integer object identifier (which can be iterated). 

More information about this threat: [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)

### Recommendations 

* The best place to implement object level authorization is within the backend API itself. This ensures that the correct authorization decisions are made at the request (or object) level, where applicable, using logic applicable to the domain and API. It's important to consider scenarios where a given request may yield differing levels of detail in the response, depending on the requestor's permissions and authorization. 

* If this issue has been identified as a current vulnerability to an existing API that can't be changed at the backend, then API Management could be used as a fallback. For example:
    
    * Customers can use a custom policy to implement object-level authorization, if it's not implemented in the backend.

    * Customers can implement a custom policy to map identifiers from request to backend and from backend to client, so that internal identifiers aren't exposed. 

        In both cases, the custom policy could be a [policy expression](api-management-policy-expressions.md) with a look-up (for example, a dictionary) or integration with another service through the [`send-request`](api-management-advanced-policies.md#SendRequest) policy.

* API Management can validate GraphQL requests through the [validate GraphQL request](graphql-validation-policies.md#validate-graphql-request) policy, which can also be used to enforce object-level authorization, using the `authorize` element.  

### More information
 * [Using external services from the Azure API Management service](api-management-sample-send-request.md)
## Broken user authentication

More information about this threat: [API2:2019 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa2-broken-user-authentication.md)

### Recommendations 
 
### Related information 


## Excessive data exposure 

More information about this threat: [API3:2019 Excessive Data Exposure](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md) 

### Recommendations 



### Related information 


## Lack of resources and rate limiting 


More information about this threat: [API4:2019 Lack of resources and rate limiting](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa4-lack-of-resources-and-rate-limiting.md)

### Recommendations 

### Related information 

## Broken function level authorization

More information about this threat: [API5:2019 Broken function level authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) 

### Recommendations 
 

### Related information 



## Mass assignment


More information about this threat: [API6:2019 Mass assignment](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa6-mass-assignment.md)

### Recommendations 



## Security misconfiguration 

A security misconfiguration vulnerability occurs when the attackers attempt to exploit vulnerabilities such as:

* Missing security hardening
* Unnecessary enabled features
* Network connections unnecessarily open to the internet
* Use of weak protocols or ciphers
* Other settings or endpoints that may allow unauthorized access to the system

More information about this threat: [API7:2019 Security misconfiguration](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa7-security-misconfiguration.md) 

### Recommendations 

* Correctly configure [gateway TLS](api-management-howto-manage-protocols-ciphers.MD).  Don't use vulnerable protocols (for example, TLS 1.0, 1.1) or ciphers. 

* Configure APIs to accept encrypted traffic only, for example through HTTPS or WSS protocols. 

* Consider deploying API Management behind a [private endpoint](private-endpoint.md) or [virtual network attached and deployed in internal mode](api-management-using-with-internal-vnet.md). In internal networks, access can be controlled from within the private network (via firewall or network security groups) and from the internet (via a reverse proxy). 

* Use Azure API Management policies: 

    * Always inherit the base policy through the `<base>` tag.	 

    * When using OAuth, configure and test the [validate-jwt](api-management-access-restriction-policies.md#ValidateJWT) policy to check the existence and validity of the JWT token before it reaches the backend.  

        * Policy configuration allows for automatic checking of the token expiration, token signature, and issuer.  

        * Enforce claims, audiences, token expiration, and token signature through more policy configuration. 

    * Configure the [CORS](api-management-cross-domain-policies.md#CORS) policy and don't use wildcard `*` for any element. Instead, explicitly list allowed values. 

    * Set [validation policies](validation-policies.md) to `prevent` in production environments to validate JSON and XML schemas, headers, query parameters, and status codes, and to enforce the maximum size for request or response. 

    * If API Management is outside a network boundary, client IP validation is still possible using the [ip-filter](api-management-access-restriction-policies.md#RestrictCallerIPs)policy. Ensure this is an allowlist, not a blocklist. 

    * If client certificates are utilized between caller and API Management use the [validate-client-certificate](api-management-access-restriction-policies.md#validate-client-certificate) policy. Ensure that the `validate-revocation`, `validate-trust`, `validate-not-before`, and `validate-not-after` attributes are all set to `true`. 

        Client certificate (mutual TLS) can also be applied between API Management and the backend. The backend should:

        * Have authorization credentials configured.		 

        * Validate the certificate chain where applicable. 

        * Validate the certificate name where applicable. 

* For Graph QL scenarios use the [validate-graphql-request](graphql-validation-policies.md#validate-graphql-request) policy. Ensure that the `authorization` element and `max-size` and `max-depth` attributes are set. 

* Don't store secrets in policy files, or source control. Always use API Management [named values](api-management-howto-properties.md) or fetch the secrets at runtime using custom policy expressions.	 

    * Named values can be [integrated with Key Vault](api-management-howto-properties.md#key-vault-secrets) 

    * Named values can also be encrypted within API Management by marking them "secret". Don't store secrets in named values unless the values are marked as "secret". 

* Publish APIs through [products](api-management-howto-add-products.md), which require subscriptions. Don't use open products without subscription. 

* Use Key Vault integration to manage all certificates – this centralizes certificate management and can help to ease operations management tasks such as certificate renewal or revocation. 

* When using the [self-hosted-gateway](self-hosted-gateway-overview.md), ensure there's a process in place to update the image to the latest version periodically. 

* Represent backend services as [backend entities](backends.md). Configure authorization credentials, certificate chain validation, and certificate name validation where applicable. 

* When using the [developer portal](api-management-howto-developer-portal.md): 

    * If you choose to self-host the developer portal, ensure there's a process in place to periodically update the self-hosted developer portal to the latest version. Updates for the default managed version are automatic. 

    * Use [Azure Active Directory (Azure AD)](api-management-howto-aad.md) or [Azure Active Directory B2C](api-management-howto-aad-b2c.md) for user sign-up and sign-in. Disable the default username and password authentication, which is less secure. 

    * Assign [user groups](api-management-howto-create-groups.md#-associate-a-group-with-a-product) to products, to control the visibility of APIs in the portal.  

* Use [Azure Policy](security-controls-policy.md) to enforce API Management resource level configuration and role-based access control (RBAC) permissions to control resource access. Grant minimum required privileges to every user. 

* Use a [DevOps process](devops-api-development-templates.md) and infrastructure-as-code approach outside of a development environment to ensure API Management content and configuration changes are consistent and human errors are minimized.  

* Don't use any deprecated features.

## Injection

Any accessible endpoint accepting user data is potentially vulnerable to an "injection" exploit. Examples include, but aren't limited to: 

* [Command injection](https://owasp.org/www-community/attacks/Command_Injection), where a bad actor attempts to alter the API request to execute commands on the operating system hosting the API

* [SQL injection](https://owasp.org/www-community/attacks/SQL_Injection), where a bad actor attempts to alter the API request to execute commands and queries against the database an API depends on 

More information about this threat: [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md)

### Recommendations

* [Modern Web Application Firewall (WAF) policies](https://github.com/SpiderLabs/ModSecurity) cover many common injection vulnerabilities. While API Management doesn’t have a built-in WAF component, a WAF can be deployed upstream (in front) of the API Management instance. For example, you can use [Azure Application Gateway](/azure/architecture/reference-architectures/apis/protect-apis). 

    > [!IMPORTANT]
    > Ensure that a bad actor can't bypass the gateway hosting the WAF and connect directly to the API Management gateway or backend API itself. Possible mitigations include: [network ACLs](../virtual-network/network-security-groups-overview.md), using API Management policy to [restrict inbound traffic by client IP](api-management-access-restriction-policies.md#RestrictCallerIPs), removing public access where not required, and [client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) (also known as mutual TLS or mTLS). 

* Schema, request content, and parameter [validation](validation-policies.md) can all be applied using API Management, where applicable, to further constrain and validate the request before it reaches the backend API service. 

    The schema supplied with the API definition should have a regular expression (regex) pattern constraint applied to vulnerable fields. Each regex should be tested to ensure that it constrains the field sufficiently to mitigate common injection attempts.

### Related information 

* [Deployment stamps pattern with Azure Front Door and API Management](/azure/architecture/patterns/deployment-stamp) 

* [Learn how to deploy Azure API Management with Azure Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md)

## Improper assets management

Vulnerabilities related to improper assets management include:

* An API lacks proper documentation or ownership information

* An API has excessive numbers of older versions, which may be missing security fixes

More information about this threat: [API9:2019 Improper assets management](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa9-improper-assets-management.md)

### Recommendations

* Use a well-defined [OpenAPI specification](https://swagger.io/specification/) as the source for importing REST APIs. The specification allows encapsulation of the API definition including self-documenting metadata. 

* Use well-defined API interfaces with precise paths, data schemas, headers, query parameters, and status codes. Avoid [wildcard operations](add-api-manually.md#add-and-test-a-wildcard-operation). Provide descriptions for each API and operation and include contact and license information.  

* Avoid endpoints that don’t directly contribute to the business objective. They unnecessarily increase the attack surface area and make it harder to evolve the API. 

Use the [revisions](api-management-revisions.md) and [versions](api-management-versions.md) in API Management to govern and control your API endpoints. Have a strong backend versioning strategy and commit to the maximum number of supported API versions (for example, 2 or 3 prior versions). Plan to quickly deprecate and ultimately remove older, often less secure, API versions. 

* Use an API Management instance per environment (such as development, test, and production). Ensure that each API Management instance connects to the dependencies for the same environment. For example, in staging the “stage” API Management resource should connect to a staging Azure Key Vault resource and the “stage” versions of backend services. Using [DevOps automation and infrastructure-as-code practices](devops-api-development-templates.md) helps maintain consistency and accuracy between environments and reduce human errors. 

* Use tags to organize APIs and products and group them for publishing. 

* Publish APIs for consumption through the built-in [developer portal](api-management-howto-developer-portal.md). Make sure the API documentation is up-to-date. 

* Discover undocumented or unmanaged APIs and expose them through API Management for better control. 

### Related information 

## Insufficient logging and monitoring 

More information about this threat: [API10:2019  Insufficient logging and monitoring](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xaa-insufficient-logging-monitoring.md) 

### Recommendations



### Related information 

## Next steps

* [Security baseline for API Management](/security/benchmark/azure/baselines/api-management-security-baseline)
* [Landing zone accelerator for API Management](/azure/cloud-adoption-framework/scenarios/app-platform/api-management/landing-zone-accelerator)
