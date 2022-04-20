---
title: Address OWASP API threats in Azure API Management
description: Learn how to protect against common API-based threats, as identified by the OWASP top 10 API threats, using Azure API Management. 
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 04/19/2022
ms.author: danlep
---

# Mitigate OWASP top 10 API threats using API Management

[Intro]

## Summary

|Threat  |Description  |Mitigations  |Reference  |
|---------|---------|---------|---------|
|Row1     |         |         |         |
|Row2     |         |         |         |
|Row3     |         |         |         |
|Row4     |         |         |         |
|Row5     |         |         |         |
|Row6     |         |         |         |
|Row7     |         |         |         |
|[Injection](#injection)     |  Attackers can feed the API with malicious data through whatever injection vectors are available       |  * Configure WAF<br/>* Validate requests      | [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md)        |
|Row9     |         |         |         |
|Row10     |         |         |         |


## Broken object level authorization 

## Broken user authentication 

## Excessive data exposure 

## Lack of resources and rate limiting 

## Broken function level authorization 


## Mass assignment 


## Security misconfiguration 

## Injection

Any accessible endpoint accepting user data is potentially vulnerable to an "injection" exploit. Examples include, but aren't limited to: 

* [Command injection](https://owasp.org/www-community/attacks/Command_Injection), where a bad actor attempts to alter the API request to execute commands on the operating system hosting the API

* [SQL injection](https://owasp.org/www-community/attacks/SQL_Injection), where a bad actor attempts to alter the API request to execute commands and queries against the database an API depends on. 

[More information about this threat](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md)

### Recommendations

* [Modern Web Application Firewall (WAF) policies]( https://github.com/SpiderLabs/ModSecurity) cover many common injection vulnerabilities. While API Management doesn’t have a built-in WAF component, a WAF can be deployed upstream (in front) of the API Management instance.  

    A WAF may be added at the [network edge](../web-application-firewall/afds/afds-overview.md), for external parties connecting to externally facing APIs. Alternatively, include a WAF locally as a component of a Layer 7 capable firewall upstream of the APIs, or as a component of an upstream [reverse proxy also acting as a gateway](../web-application-firewall/ag/application-gateway-waf-faq.yml).  

    > [!IMPORTANT]
    > Ensure that a bad actor can't bypass the gateway hosting the WAF and connect directly to the API Management gateway or backend API itself. Possible mitigations include: [network ACLs](../virtual-network/network-security-groups-overview.md), using API Management policy to [restrict inbound traffic by client IP](api-management-access-restriction-policies.md#RestrictCallerIPs), removing public access where not required, and [client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) (also known as mutual TLS or mTLS). 

* Schema, request content, and parameter [validation](validation-policies.md) can all be applied using API Management, where applicable, to further constrain and validate the request before it reaches the backend API service. 

    > [!NOTE]
    > The schema supplied with the API definition must have a regular expression (regex) pattern constraint applied to vulnerable fields. Each regex should be tested to ensure that it constrains the field sufficiently to mitigate common injection attempts.

### Related information 

* [API Management validation policies](validation-policies.md)

## Improper assets management 

## Insufficient logging and monitoring 



## Next steps

[TBD]
