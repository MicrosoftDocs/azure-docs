---
title: Address OWASP API threats in Azure API Management
description: Learn how to protect against common API-based threats, as identified by the OWASP top 10 API threats, using Azure API Management. 
author: mikebudzynski

ms.service: api-management
ms.topic: conceptual
ms.date: 05/09/2022
ms.author: mibudz
---

# Mitigate OWASP top 10 API threats using API Management

[Intro]

## Summary

|Threat  |Description  |Mitigations  |Reference  |
|---------|---------|---------|---------|
|[Broken object level authorization](#broken-object-level-authorization)     |     Attackers can exploit vulnerable API endpoints by manipulating the ID of an object that is sent within the request. This may lead to unauthorized access to sensitive data.    | * Improve backend API<br/>* Use API Management to enforce authorization to backend         |    [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)     |
|Row2     |         |         |         |
|Row3     |         |         |         |
|[Lack of resources and rate limiting](#lack-of-resources-and-rate-limiting)     |    Attackers can exploit a vulnerable API through concurrent API requests, leading to DDoS, making the API unresponsive or unavailable.     | * Implement throttling, quotas, caching, and other features to maintain performance<br/>* Define and enforce strict API schemas        |   [API4:2019 Lack of Resources & Rate Limiting](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa4-lack-of-resources-and-rate-limiting.md)      |
|[Broken function level authorization](#broken-function-level-authorization)     |  Attackers send legitimate API calls to APIs endpoint that they should not have access to.        |  * Filter API requests or JWT claims<br/>* Secure API endpoints using networks, subscription keys, JWT tokens, and other features.     |   [API5:2019 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md)       |
|Row6     |         |         |         |
|Row7     |         |         |         |
|[Injection](#injection)     |  Attackers can feed the API with malicious data through whatever injection vectors are available       |  * Configure WAF<br/>* Validate requests      | [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md)        |
|Row9     |         |         |         |
|Row10     |         |         |         |


## Broken object level authorization

Ensure that API objects are protected with the appropriate level of authorization to prevent data leaks and unauthorized data manipulation through weak object access identifiers – for example, an integer object identifier (which can be iterated). 

[More information about this threat](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)

### Recommendations 

* The best place to implement object level authorization is within the backend API itself. This ensures that the correct authorization decisions are made at the request (or object) level, where applicable, using logic applicable to the domain and API. It's important to consider scenarios where a given request may yield differing levels of detail in the response, depending on the requestor's permissions and authorization. 

* If this issue has been identified as a current vulnerability to an existing API that can't be changed, then API Management could be used as a fallback. A mapping could be created to check object level authorization based on the request context before the request is allowed onto the backend. Similarly, a weak object access identifier could be abstracted through API Management where it is not possible to make the change at the backend.  

* API Management can validate GraphQL requests through the [validate GraphQL request](https://docs.microsoft.com/azure/api-management/graphql-validation-policies#validate-graphql-request) policy, which can also be used to enforce object-level authorization, using the `authorize` element.  


## Broken user authentication

### Recommendations 
 
### Related information 


## Excessive data exposure 

### Recommendations 


### Related information 


## Lack of resources and rate limiting 

Mitigate probing for DDoS vulnerabilities and protect against data exfiltration by implementing server-side defensive validation of the request context (focus on parameters and derived variables) and rate limiting. 

[More information about this threat](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa4-lack-of-resources-and-rate-limiting.md)

### Recommendations 

* Use throttling (short-term) and quota limit (long-term) [policies](api-management-access-restriction-policies.md) to control the number of API calls or bandwidth.  

* Define strict request object definitions and their properties in the API definition (OpenAPI). For example, define the maximum values for paging integers, maxLength and regex for strings. Enforce those schemas with the [validate-content](validation-policies.md#validate-content) or [validate-parameters](validation-policies.md#validate-parameters) policy. 

* Enforce `max-size` of the request with the [validate-content](validation-policies.md#validate-content) policy. 

* Optimize performance with built-in [caching](api-management-howto-cache.md), thus reducing the consumption of CPU/memory/networking resources for certain operations. 

* Limit the number of parallel backend connections with the [limit-concurrency](api-management-advanced-policies.md#LimitConcurrency) policy. 

* Enforce authentication for API calls (see [Broken user authentication](#broken-user-authentication)). Revoke access for abusive users. For example, deactivate the subscription key, block the IP address, or reject requests for a certain user claim from the token. 

* Apply a [CORS](api-management-cross-domain-policies.md#CORS) rule to control which websites are allowed to load the resources served through an API. 

* Minimize the time it takes a backend service to respond. The longer the backend service takes to respond, the longer the connection is occupied in API Management, therefore reducing the performance of the service. 

* Define a timeout in the [forward-request](api-management-advanced-policies.md#ForwardRequest) policy. 

* Deploy a bot detection service in front of API Management (for example, Azure Application Gateway, Azure Front Door, Azure DDoS Protection) for an added layer of protection against DDoS. 

* When using a WAF with Application Gateway and Azure Front Door, consider using Microsoft_BotManagerRuleSet_1.0. You can select the entire rule set or individual policies as part of the WAF that you can customize. 


### Related information 
* [Advanced request throttling with API Management](api-management-sample-flexible-throttling.md)

## Broken function level authorization


Complex access control policies with different hierarchies, groups, and roles, and an unclear separation between administrative and regular functions, tend to lead to authorization flaws. By exploiting these issues, attackers gain access to other users’ resources and/or administrative functions. 

[More information about this threat](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) 

### Recommendations 
 
* API Management can be used to [filter JWT claims](api-management-access-restriction-policies.mds#ValidateJWT) at different scopes, and this may be the only option where the downstream API can't be changed. Ideally, authorization is the responsibility of the backend itself, and this is the best place for it to be implemented.

* Request filtering (for example, checking and enforcing allowed verbs) is good practice and helps reduce the attack surface area. However, developers need good governance. If the underlying product or API changes, then they need to remember to change the configuration in API Management, too. 

* For maximum network isolation, use the API Management Premium [service tier](api-management-features.md), with an [internal mode](api-management-using-with-internal-vnet.md) VNet deployment option. 

* Use a VNet or a [private endpoint](private-endpoints.md) to hide API Management endpoints from the internet. 

* By default, protect all operations with [subscription keys](api-management-subscriptions.md). 

* Define the [validate-jwt](api-management-access-restriction-policie.mds#ValidateJWT) policy at the level desired (all APIs in the API Management instance, API level, or individual operation level). Consider enforcing token claims at each level.   

* Don't define wildcard operations (i.e., "catch-all" APIs with `*` as the path) or use `*` for origin in [CORS policy](api-management-cross-domain-policies.md#CORS). 

* Don't publish APIs with [open products](api-management-howto-add-products.md#access-to-product-apis) that don't require a subscription.

### Related information 



## Mass assignment 

### Recommendations 



## Security misconfiguration 

### Recommendations 



### Related information 



## Injection

Any accessible endpoint accepting user data is potentially vulnerable to an "injection" exploit. Examples include, but aren't limited to: 

* [Command injection](https://owasp.org/www-community/attacks/Command_Injection), where a bad actor attempts to alter the API request to execute commands on the operating system hosting the API

* [SQL injection](https://owasp.org/www-community/attacks/SQL_Injection), where a bad actor attempts to alter the API request to execute commands and queries against the database an API depends on 

[More information about this threat](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md)

### Recommendations

* [Modern Web Application Firewall (WAF) policies](https://github.com/SpiderLabs/ModSecurity) cover many common injection vulnerabilities. While API Management doesn’t have a built-in WAF component, a WAF can be deployed upstream (in front) of the API Management instance - for example, you can use [Azure Application Gateway](/azure/architecture/reference-architectures/apis/protect-apis). 

    > [!IMPORTANT]
    > Ensure that a bad actor can't bypass the gateway hosting the WAF and connect directly to the API Management gateway or backend API itself. Possible mitigations include: [network ACLs](../virtual-network/network-security-groups-overview.md), using API Management policy to [restrict inbound traffic by client IP](api-management-access-restriction-policies.md#RestrictCallerIPs), removing public access where not required, and [client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) (also known as mutual TLS or mTLS). 

* Schema, request content, and parameter [validation](validation-policies.md) can all be applied using API Management, where applicable, to further constrain and validate the request before it reaches the backend API service. 

    > [!NOTE]
    > The schema supplied with the API definition must have a regular expression (regex) pattern constraint applied to vulnerable fields. Each regex should be tested to ensure that it constrains the field sufficiently to mitigate common injection attempts.

### Related information 

* [Deployment stamps pattern with Azure Front Door and API Management](/azure/architecture/patterns/deployment-stamp) 

* [Learn how to deploy Azure API Management with Azure Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md)

## Improper assets management 

### Recommendations


### Related information 

## Insufficient logging and monitoring 

Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response, allows attackers to further attack systems, maintain persistence, pivot to more systems to tamper with, and extract or destroy data. Most breach studies demonstrate the time to detect a breach is over 200 days, typically detected by external parties rather than internal processes or monitoring 

[More information about this threat](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xaa-insufficient-logging-monitoring.md) 

## Recommendations

* Monitor API traffic with Azure Monitor. 

* Log to Application Insights for debugging purposes. 

* If needed, forward custom events to Event Hubs. 

* Set alerts in Azure Monitor and Application Insights (for example, capacity metric or excessive number of requests / bandwidth transfer). 

* Use the [emit-metric policy for custom metrics](https://docs.microsoft.com/en-us/azure/api-management/api-management-advanced-policies#emit-metrics) 

* Use activity logs for tracking activity in the service. 

* Correlate transactions when Application Insights is configured in APIM, backend api, if further processing is happening, such as if data being ingested in event hub, then event hub. Use Correlation Id in App Insights in APIM to track a transaction end to end. Implement end-to-end tracing.  

[Azure Application Insights Transaction Diagnostics](https://docs.microsoft.com/en-us/azure/azure-monitor/app/transaction-diagnostics) 

[Azure Application Insights telemetry correlation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/correlation) 

[Monitoring and diagnostics guidance](https://docs.microsoft.com/en-us/azure/architecture/best-practices/monitoring) 

[Stream Azure monitoring data to event hub and external partners](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/stream-monitoring-data-event-hubs) 

[How to log events to Azure Event Hubs in Azure API Management](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-log-event-hubs) 

 Use Custom Events as needed. 

[Application Insights API for custom events and metrics](https://docs.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics) 

[Track custom operations with Azure Application Insights .NET SDK](https://docs.microsoft.com/en-us/azure/azure-monitor/app/custom-operations-tracking) 

[Correlating Application Insights data with custom data sources](https://docs.microsoft.com/en-us/azure/azure-monitor/app/custom-data-correlation) 

### Related information 


## Next steps

[TBD]
