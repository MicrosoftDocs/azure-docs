---
title: HTTP response codes - Azure Application Gateway
description: 'Learn how to troubleshoot Application Gateway HTTP response codes'
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: troubleshooting
ms.date: 05/03/2023
ms.author: greglin
---

# HTTP response codes in Application Gateway

This article gives reasons on why Azure Application Gateway returns specific HTTP response codes. Common causes and troubleshooting steps are provided to help you determine the root cause of error HTTP Response code. HTTP response codes can be returned to a client request whether or not a connection was initiated to a backend target.

## 3XX response codes (redirection)

300-399 responses are presented when a client request matches an application gateway rule that has redirects configured. Redirects can be configured on a rule as-is or via a path map rule. For more information about redirects, see [Application Gateway redirect overview](redirect-overview.md).

#### 301 Permanent Redirect

HTTP 301 responses are presented when a redirection rule is specified with the **Permanent** value.

#### 302 Found

HTTP 302 responses are presented when a redirection rule is specified with the **Found** value.

#### 303 See Other

HTTP 302 responses are presented when a redirection rule is specified with the **See Other** value.

#### 307 Temporary Redirect

HTTP 307 responses are presented when a redirection rule is specified with the **Temporary** value.


## 4XX response codes (client error)

400-499 response codes indicate an issue that is initiated from the client. These issues can range from the client initiating requests to an unmatched hostname, request timeout, unauthenticated request, malicious request, and more.

#### 400 – Bad Request

HTTP 400 response codes are commonly observed when:
- Non-HTTP / HTTPS traffic is initiated to an application gateway with an HTTP or HTTPS listener.
- HTTP traffic is initiated to a listener with HTTPS, with no redirection configured.
- Mutual authentication is configured and unable to properly negotiate.
- The request is not compliant to RFC. 

Some common reasons for the request to be non-compliant to RFC are: 

| Category | Examples |
| ---------- | ---------- | 
| Invalid Host in request line  | Host containing two colons (example.com:**8090:8080**) |
| Missing Host Header | Request doesn't have Host Header |
| Presence of malformed or illegal character | Reserved characters are **&,!.** Workaround is to percent code it like %& |
| Invalid HTTP version | Get /content.css HTTP/**0.3** |
| Header field name and URI contains non-ASCII Character | GET /**«úü¡»¿**.doc HTTP/1.1  |
| Missing Content Length header for POST request | Self Explanatory |
| Invalid HTTP Method | **GET123** /index.html HTTP/1.1 |
| Duplicate Headers | Authorization:\<base64 encoded content\>,Authorization: \<base64 encoded content\> |
| Invalid value in Content-Length | Content-Length: **abc**,Content-Length: **-10**|

For cases when mutual authentication is configured, several scenarios can lead to an HTTP 400 response being returned the client, such as:
- Client certificate isn't presented, but mutual authentication is enabled.
- DN validation is enabled and the DN of the client certificate doesn't match the DN of the specified certificate chain.
- Client certificate chain doesn't match certificate chain configured in the defined SSL Policy.
- Client certificate is expired.
- OCSP Client Revocation check is enabled and the certificate is revoked.
- OCSP Client Revocation check is enabled, but unable to be contacted.
- OCSP Client Revocation check is enabled, but OCSP responder isn't provided in the certificate.

For more information about troubleshooting mutual authentication, see [Error code troubleshooting](mutual-authentication-troubleshooting.md#solution-2).

#### 401 – Unauthorized

An HTTP 401 unauthorized response can be returned when the backend pool is configured with [NTLM](/windows/win32/secauthn/microsoft-ntlm?redirectedfrom=MSDN) authentication.
There are several ways to resolve this:
- Allow anonymous access on backend pool.
- Configure the probe to send the request to another "fake" site that doesn't require NTLM.
- Not recommended, as this will not tell us if the actual site behind the application gateway is active or not.
- Configure application gateway to allow 401 responses as valid for the probes: [Probe matching conditions](/azure/application-gateway/application-gateway-probe-overview).

#### 403 – Forbidden

HTTP 403 Forbidden is presented when customers are utilizing WAF skus and have WAF configured in Prevention mode.  If enabled WAF rulesets or custom deny WAF rules match the characteristics of an inbound request, the client is presented a 403 forbidden response.

#### 404 – Page not found

An HTTP 404 response can be returned if a request is sent to an application gateway that is:
- Using a [v2 sku](overview-v2.md).
- Without a hostname match defined in any [multi-site listeners](multiple-site-overview.md).
- Not configured with a [basic listener](application-gateway-components.md#types-of-listeners).

#### 408 – Request Timeout

An HTTP 408 response can be observed when client requests to the frontend listener of application gateway don't respond back within 60 seconds.  This error can be observed due to traffic congestion between on-premises networks and Azure, when virtual appliance inspects the traffic traffic, or the client itself becomes overwhelmed.

#### 499 – Client closed the connection

An HTTP 499 response is presented if a client request that is sent to application gateways using v2 sku is closed before the server finished responding. This error can be observed in 2 scenarios. First scenario is when a large response is returned to the client and the client may have closed or refreshed their application before the server finished sending the large response. Second scenario is the timeout on the client side is low and does not wait long enough to receive the response from server. In this case it is better to increase the timeout on the client. In application gateways using v1 sku, an HTTP 0 response code may be raised for the client closing the connection before the server has finished responding as well.


## 5XX response codes (server error)

500-599 response codes indicate a problem has occurred with application gateway or the backend server while performing the request.

#### 500 – Internal Server Error

Azure Application Gateway shouldn't exhibit 500 response codes. Open a support request if you see this code, because this issue is an internal error to the service. For information on how to open a support case, see [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

#### 502 – Bad Gateway

HTTP 502 errors can have several root causes, for example:
- NSG, UDR, or custom DNS is blocking access to backend pool members.
- Backend VMs or instances of [virtual machine scale sets](../virtual-machine-scale-sets/overview.md) aren't responding to the default health probe.
- Invalid or improper configuration of custom health probes.
- Azure Application Gateway's [backend pool isn't configured or empty](application-gateway-troubleshooting-502.md#empty-backendaddresspool).
- None of the VMs or instances in [virtual machine scale set are healthy](application-gateway-troubleshooting-502.md#unhealthy-instances-in-backendaddresspool).
- [Request time-out or connectivity issues](application-gateway-troubleshooting-502.md#request-time-out) with user requests.

For information about scenarios where 502 errors occur, and how to troubleshoot them, see [Troubleshoot Bad Gateway errors](application-gateway-troubleshooting-502.md).

#### 504 – Gateway timeout

Azure application Gateway V2 SKU sent HTTP 504 errors if the backend response time exceeds the time-out value which is configured in the Backend Setting.

## Next steps

If the information in this article doesn't help to resolve the issue, [submit a support ticket](https://azure.microsoft.com/support/options/).
