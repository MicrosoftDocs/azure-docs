---
 title: include file
 description: include file
 services: frontdoor
 author: duongau
 ms.service: frontdoor
 ms.topic: include
 ms.date: 06/19/2023
 ms.author: duau
 ms.custom: include file
---

* In addition to the following limits, there are [composite limit on the number of routing rules, front-end domains, protocols, and paths](../articles/frontdoor/front-door-routing-limits.md).

| Resource | Classic tier limit |
| --- | --- |
| Azure Front Door resources per subscription | 100 |
| Front-end hosts, which include custom domains per resource | 500 |
| Routing rules per resource | 500 |
| Rules per Rule set | 25 |
| Back-end pools per resource | 50<sup>1</sup> |
| Back ends per back-end pool | 100 |
| Path patterns to match for a routing rule | 25 |
| URLs in a single cache purge call | 100 |
| Maximum bandwidth* | 75 Gbps |
| Maximum requests per second per profile* | 100,000 |
| Custom web application firewall rules per policy | 100 |
| Web application firewall policy per subscription | 100 |
| Web application firewall match conditions per custom rule | 10 |
| Web application firewall IP address ranges per custom rule | 600 |
| Web application firewall string match values per match condition | 10 |
| Web application firewall string match value length | 256 |
| Web application firewall POST body parameter name length | 256 |
| Web application firewall HTTP header name length | 256 |
| Web application firewall cookie name length | 256 |
| Web application firewall exclusion limit | 100 |
| Web application firewall HTTP request body size inspected | 128 KB |
| Web application firewall custom response body length | 32 KB |

*If the traffic isn't globally distributed and concentrated in one or more regions, or if a higher quota limited is need, create an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

<sup>1</sup>To request a limit increase, create an [Azure Support request][azure-support]. Free subscriptions including [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/) and [Azure for Students](https://azure.microsoft.com/offers/ms-azr-0170p/) aren't eligible for limit or quota increases. If you have a free subscription, you can [upgrade](../articles/cost-management-billing/manage/upgrade-azure-subscription.md) to a Pay-As-You-Go subscription.<br />

<!-- LINKS - External -->
[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest

### Azure Front Door Standard and Premium service limits

* Maximum of **500** total Standard and Premium profiles per subscription.
* In addition to the following limits, there are [composite limit on the number of routes, domains, protocols, and paths](../articles/frontdoor/front-door-routing-limits.md).

> [!NOTE]
> Resources with * are new limits for Azure Front Door Standard and Premium.

| Resource | Standard tier limit | Premium tier limit |
| --- | --- | --- |
| Maximum profiles per subscription | 500 | 500 |
| Maximum endpoint per profile | 10 | 25 |
| Maximum custom domain per profile	| 100 | 500 |
| Maximum origin groups per profile | 100 | 200 |
| Maximum origins per origin group* | 50 | 50 |
| Maximum origins per profile | 100 | 200 |
| Maximum origin timeout | 16 - 240 secs | 16 - 240 secs |
| Maximum routes per profile | 100 | 200 | 
| Maximum rule set per profile | 100 | 200 |
| Maximum rules per route | 100 | 100 |
| Maximum rules per rule set* | 100 | 100 |
| Maximum bandwidth* | 75 Gbps | 75 Gbps |
| Maximum requests per second per profile* | 100,000 | 100,000 |
| Path patterns to match for a routing rule | 25 | 50 |
| URLs in a single cache purge call | 100 | 100 |
| Maximum security policy per profile* | 100 | 200 |
| Maximum associations per security policy* | 110 | 225 |
| Maximum secrets per profile* | 100 | 500 |
| Web Application Firewall (WAF) policy per subscription | 100 | 100 |
| WAF custom rules per policy | 100 | 100 |
| WAF match conditions per custom rule | 10 | 10 |
| WAF custom regex rules per policy | 5 | 5 |
| WAF IP address ranges per match conditions | 600 | 600 |
| WAF string match values per match condition | 10 | 10 |
| WAF string match value length | 256 | 256 |
| WAF POST body parameter name length | 256 | 256 |
| WAF HTTP header name length | 256 | 256 |
| WAF cookie name length | 256 | 256|
| WAF exclusion per policy | 100 | 100 |
| WAF HTTP request body size inspected | 128 KB | 128 KB |
| WAF custom response body length | 32 KB | 32 KB |

*If the traffic isn't globally distributed and concentrated in one or more regions, or if a higher quota limited is need, create an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

#### Timeout values

##### From Client to Front Door

* Front Door has an idle TCP connection timeout of 61 seconds.

##### Front Door to application back-end

* After the HTTP request gets forwarded to the back end, Azure Front Door waits for 60 seconds (Standard and Premium) or 30 seconds (classic) for the first packet from the back end. Then it returns a 503 error to the client, or 504 for a cached request. You can configure this value using the *originResponseTimeoutSeconds* field in Azure Front Door Standard and Premium API, or the sendRecvTimeoutSeconds field in the Azure Front Door (classic) API.

* After the back end receives the first packet, if the origin pauses for any reason in the middle of the response body beyond the originResponseTimeoutSeconds or sendRecvTimeoutSeconds, the response will be canceled.

* Front Door takes advantage of HTTP keep-alive to keep connections open for reuse from previous requests. These connections have an idle timeout of 90 seconds. Azure Front Door would disconnect idle connections after reaching the 90-second idle timeout. This timeout value can't be configured.

#### Upload and download data limit

|  | With chunked transfer encoding (CTE) | Without HTTP chunking |
| ---- | ------- | ------- |
| **Download** | There's no limit on the download size. | There's no limit on the download size. |
| **Upload** |    There's no limit as long as each CTE upload is less than 2 GB. | The size can't be larger than 2 GB. |

#### Other limits
* Maximum URL size - 8,192 bytes - Specifies maximum length of the raw URL (scheme + hostname + port + path + query string of the URL)
* Maximum Query String size - 4,096 bytes - Specifies the maximum length of the query string, in bytes.
* Maximum HTTP response header size from health probe URL - 4,096 bytes - Specified the maximum length of all the response headers of health probes. 
* Maximum rules engine action header value character: 640 characters.
* Maximum rules engine condition header value character: 256 characters.
* Maximum ETag header size: 128 bytes
* Maximum endpoint name for Standard and Premium: 46 characters.

For more information about limits that apply to Rules Engine configurations, see [rules engine terminology](../articles/frontdoor/front-door-rules-engine.md#terminology)
