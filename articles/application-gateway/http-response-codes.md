---
title: HTTP response codes - Azure Application Gateway
description: 'Learn how to troubleshoot Application Gateway HTTP response codes'
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: troubleshooting
ms.date: 05/26/2025
ms.author: mbender
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

400-499 response codes indicate an issue that is initiated from the client. These issues can range from the client initiating requests to an unmatched hostname, request time-out, unauthenticated request, malicious request, and more.

Application Gateway collects metrics that capture the distribution of 4xx/5xx status codes has a logging mechanism that captures information such as the URI client IP address with the response code. Metrics and logging enable further troubleshooting.  Clients can also receive 4xx response from other proxies between the client device and Application Gateway. For example, CDN (Content Delivery Network) and other authentication providers. See the following articles for more information.

[Metrics supported by Application Gateway V2 SKU](application-gateway-metrics.md#metrics-supported-by-application-gateway-v2-sku)
[Diagnostic logs](application-gateway-diagnostics.md#diagnostic-logging)

#### 400 – Bad Request

HTTP 400 response codes are commonly observed when:
- Non-HTTP / HTTPS traffic is initiated to an application gateway with an HTTP or HTTPS listener.
- HTTP traffic is initiated to a listener with HTTPS, with no redirection configured.
- Mutual authentication is configured and unable to properly negotiate.
- The request isn't compliant to RFC. 

Some common reasons for the request to be non-compliant to RFC are: 

| Category | Examples |
| ---------- | ---------- | 
| Invalid Host in request line  | Host containing two colons (example.com:**8090:8080**) |
| Missing Host Header | Request doesn't have Host Header |
| Presence of malformed or illegal character | Reserved characters are **&,!.** The workaround is to code it as a percentage. For example: %& |
| Invalid HTTP version | Get /content.css HTTP/**0.3** |
| Header field name and URI contain non-ASCII Character | GET /**«úü¡»¿**.doc HTTP/1.1  |
| Missing Content Length header for POST request | Self Explanatory |
| Invalid HTTP Method | **GET123** /index.html HTTP/1.1 |
| Duplicate Headers | Authorization:\<base64 encoded content\>, Authorization: \<base64 encoded content\> |
| Invalid value in Content-Length | Content-Length: **abc**,Content-Length: **-10**|

For cases when mutual authentication is configured, several scenarios can lead to an HTTP 400 response being returned the client, such as:
- Mutual authentication is enabled but the Client certificate wasn't presented. 
- DN (Distinguished Name) validation is enabled and the DN of the client certificate doesn't match the DN of the specified certificate chain.
- Client certificate chain doesn't match certificate chain configured in the defined SSL Policy.
- Client certificate is expired.
- OCSP (Online Certificate Status Protocol) Client Revocation check is enabled and the certificate is revoked.
- OCSP (Online Certificate Status Protocol) Client Revocation check is enabled, but unable to be contacted.
- OCSP (Online Certificate Status Protocol) Client Revocation check is enabled, but OCSP responder isn't provided in the certificate.

For more information about troubleshooting mutual authentication, see [Error code troubleshooting](mutual-authentication-troubleshooting.md#solution-2).

#### 401 – Unauthorized

An HTTP 401 unauthorized response is returned to the client if the client isn't authorized to access the resource. There are several reasons for 401 to be returned. The following are a few reasons with potential fixes.
 - If the client has access, it might have an outdated browser cache. Clear the browser cache and try accessing the application again.

An HTTP 401 unauthorized response can be returned to AppGW probe request if the backend pool is configured with [NTLM](/windows/win32/secauthn/microsoft-ntlm?redirectedfrom=MSDN) authentication. In this scenario, the backend is marked as healthy. There are several ways to resolve this issue:
- Allow anonymous access on backend pool.
- Configure the probe to send the request to another "fake" site that doesn't require NTLM.
- Not recommended, as this won't tell us if the actual site behind the application gateway is active or not.
- Configure application gateway to allow 401 responses as valid for the probes: [Probe matching conditions](/azure/application-gateway/application-gateway-probe-overview).

#### 403 – Forbidden

HTTP 403 Forbidden is presented when customers are utilizing WAF (Web Application Firewall) skus and have WAF configured in Prevention mode.  If enabled WAF rulesets or custom deny WAF rules match the characteristics of an inbound request, the client is presented a 403 forbidden response.

Other reasons for clients receiving 403 responses include:
- You're using App Service as backend and it's configured to allow access only from Application Gateway. This can return a 403 error by App Services. This typically happens due to redirects/href links that point directly to App Services instead of pointing at the Application Gateway's IP address. 
- If you're accessing a storage blog and the Application Gateway and storage endpoint is in different region, then a 403 error is returned if the Application Gateway's public IP address isn't allow-listed. See [Grant access from an internet IP range](/azure/storage/common/storage-network-security?tabs=azure-portal#grant-access-from-an-internet-ip-range).

#### 404 – Page not found

An HTTP 404 response is generated when a request is made to Application Gateway (V2 SKUs) with a hostname that doesn’t corresponds to any of the configured Multi-site listeners, and there is no Basic listener present. Learn more about [types of listeners](application-gateway-components.md#types-of-listeners).

#### 408 – Request Time-out

An HTTP 408 response can be observed when client requests to the frontend listener of application gateway don't respond back within 60 seconds.  This error can be observed due to traffic congestion between on-premises networks and Azure, when virtual appliance inspects the traffic, or the client itself becomes overwhelmed.

#### 413 – Request Entity Too Large

An HTTP 413 response can be observed when using [Azure Web Application Firewall on Application Gateway](../web-application-firewall/ag/ag-overview.md) and the client request size exceeds the maximum request body size limit. The maximum request body size field controls overall request size limit excluding any file uploads. The default value for request body size is 128 KB. For more information, see [Web Application Firewall request size limits](../web-application-firewall/ag/application-gateway-waf-request-size-limits.md).

#### 499 – Client closed the connection

An HTTP 499 response is presented if a client request that is sent to application gateways using v2 sku is closed before the server finished responding. This error can be observed in 2 scenarios. The first scenario is when a large response is returned to the client and the client might have closed or refreshed the application before the server finished sending a large response. The second scenario is when the time-out on the client side is low and doesn't wait long enough to receive the response from server. In this case it's better to increase the time-out on the client. In application gateways using v1 sku, an HTTP 0 response code may be raised for the client closing the connection before the server has finished responding as well.


## 5XX response codes (server error)

500-599 response codes indicate a problem has occurred with application gateway or the backend server while performing the request.

#### 500 – Internal Server Error

Azure Application Gateway shouldn't exhibit 500 response codes. Open a support request if you see this code, because this issue is an internal error to the service. For information on how to open a support case, see [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

#### 502 – Bad Gateway

HTTP 502 errors can have several root causes, for example:
- NSG (Network security group), UDR (user-defined route), or custom DNS is blocking access to backend pool members.
- Backend VMs or instances of [virtual machine scale sets](/azure/virtual-machine-scale-sets/overview) aren't responding to the default health probe.
- Invalid or improper configuration of custom health probes.
- Azure Application Gateway's [backend pool isn't configured or empty](application-gateway-troubleshooting-502.md#empty-backendaddresspool).
- None of the VMs or instances in [virtual machine scale set are healthy](application-gateway-troubleshooting-502.md#unhealthy-instances-in-backendaddresspool).
- [Request time-out or connectivity issues](application-gateway-troubleshooting-502.md#request-time-out) with user requests-Azure application Gateway V1 SKU sent HTTP 502 errors if the backend response time exceeds the time-out value that is configured in the Backend Setting.

For information about scenarios where 502 errors occur, and how to troubleshoot them, see [Troubleshoot Bad Gateway errors](application-gateway-troubleshooting-502.md).

#### 504 – Gateway time-out

Azure application Gateway V2 SKU sent HTTP 504 errors if the backend response time exceeds the time-out value that is configured in the Backend Setting.

IIS (Internet Information Services web server)

If your backend server is IIS, see [Default Limits for Web Sites](/iis/configuration/system.applicationhost/sites/sitedefaults/limits#configuration) to set the time-out value. Refer to the `connectionTimeout` attribute for details. Ensure the connection time-out in IIS matches or does not exceed the timeout set in the backend setting.

Nginx

If the backend server is Nginx or Nginx Ingress Controller, and if it has upstream servers, ensure the value of `nginx:proxy_read_timeout` matches or does not exceed with the time-out set in the backend setting.

## Troubleshooting Scenarios

### "ERRORINFO_INVALID_HEADER" error in Access logs

**Issue**: The [Access log](monitor-application-gateway-reference.md#access-log-category) displays an "ERRORINFO_INVALID_HEADER" error for a request, despite the backend response code (serverStatus) being 200. In other cases, the backend server could return 500.

**Cause**: The client sends a header containing CR LF characters.

**Solution**: Replace the CR LF characters with SP (whitespace) and resend the request to Application Gateway.


## Next steps

If the information in this article doesn't help to resolve the issue, [submit a support ticket](https://azure.microsoft.com/support/options/).
