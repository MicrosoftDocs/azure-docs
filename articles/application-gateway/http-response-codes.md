---
title: HTTP response codes - Azure Application Gateway
description: 'Learn how to troubleshoot Application Gateway HTTP response codes'
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: troubleshooting
ms.date: 04/19/2022
ms.author: greglin
ms.custom: devx-track-azurepowershell
---

# HTTP response codes in Application Gateway

This article lists some HTTP response codes that can be returned by Azure Application Gateway. Common causes and troubleshooting steps are provided to help you determine the root cause. HTTP response codes can be returned to a client request whether or not a connection was initiated to a backend target.

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

For cases when mutual authentication is configured, several scenarios can lead to an HTTP 400 response being returned the client, such as:
- Client certificate isn't presented, but mutual authentication is enabled.
- DN validation is enabled and the DN of the client certificate doesn't match the DN of the specified certificate chain.
- Client certificate chain doesn't match certificate chain configured in the defined SSL Policy.
- Client certificate is expired.
- OCSP Client Revocation check is enabled and the certificate is revoked.
- OCSP Client Revocation check is enabled, but unable to be contacted.
- OCSP Client Revocation check is enabled, but OCSP responder isn't provided in the certificate.

For more information about troubleshooting mutual authentication, see [Error code troubleshooting](mutual-authentication-troubleshooting.md#solution-2).

#### 403 – Forbidden

HTTP 403 Forbidden is presented when customers are utilizing WAF skus and have WAF configured in Prevention mode.  If enabled WAF rulesets or custom deny WAF rules match the characteristics of an inbound request, the client will be presented a 403 forbidden response.

#### 404 – Page not found

An HTTP 404 response can be returned if a request is sent to an application gateway that is:
- Using a [v2 sku](overview-v2.md).
- Without a hostname match defined in any [multi-site listeners](multiple-site-overview.md).
- Not configured with a [basic listener](application-gateway-components.md#types-of-listeners).

#### 408 – Request Timeout

An HTTP 408 response can be observed when client requests to the frontend listener of application gateway do not respond back within 60 seconds.  This error can be observed due to traffic congestion between on-premises networks and Azure, when traffic is inspected by virtual appliances, or the client itself becomes overwhelmed.

#### 499 – Client closed the connection

An HTTP 499 response is presented if a client request that is sent to application gateways using v2 sku is closed before the server finished responding. This error can be observed when a large response is returned to the client, but the client may have closed or refreshed their browser/application before the server had a chance to finish responding. In application gateways using v1 sku, an HTTP 0 response code may be raised for the client closing the connection before the server has finished responding as well.


## 5XX response codes (server error)

500-599 response codes indicate a problem has occurred with application gateway or the backend server while performing the request.

#### 500 – Internal Server Error

Azure Application Gateway shouldn't exhibit 500 response codes. Please open a support request if you see this code, because this issue is an internal error to the service. For information on how to open a support case, see [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

#### 502 – Bad Gateway

HTTP 502 errors can have several root causes, for example:
- NSG, UDR, or custom DNS is blocking access to backend pool members.
- Backend VMs or instances of [virtual machine scale sets](../virtual-machine-scale-sets/overview.md) aren't responding to the default health probe.
- Invalid or improper configuration of custom health probes.
- Azure Application Gateway's [backend pool isn't configured or empty](application-gateway-troubleshooting-502.md#empty-backendaddresspool).
- None of the VMs or instances in [virtual machine scale set are healthy](application-gateway-troubleshooting-502.md#unhealthy-instances-in-backendaddresspool).
- [Request time-out or connectivity issues](application-gateway-troubleshooting-502.md#request-time-out) with user requests.

For information about scenarios where 502 errors occur, and how to troubleshoot them, see [Troubleshoot Bad Gateway errors](application-gateway-troubleshooting-502.md).

#### 504 – Request timeout

HTTP 504 errors are presented if a request is sent to application gateways using v2 sku, and the backend response time exceeds the time-out value associated to the listener's rule. This value is defined in the HTTP setting.

## Next steps

If the information in this article doesn't help to resolve the issue, [submit a support ticket](https://azure.microsoft.com/support/options/).
