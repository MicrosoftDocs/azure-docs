---
title: Server variables
titleSuffix: Azure Front Door
description: This article provides a list of the server variables available in Azure Front Door rule sets.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/07/2024
ms.author: duau
---

# Azure Front Door Rule set server variables

Rule set server variables provide access to structured information about the request when you work with [Rule sets](front-door-rules-engine.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json).

When you use [Rule set match conditions](rules-match-conditions.md), server variables are available as match conditions so that you can identify requests with specific properties.

When you use [Rule set actions](front-door-rules-engine-actions.md), you can use server variables to dynamically change the request and response headers, and rewrite URLs, paths, and query strings, for example, when a new page load or when a form gets posted.

> [!NOTE]
> Server variables are available with Azure Front Door Standard and Premium tiers.

## Supported variables

| Variable name | Description |
|-|-|
| `socket_ip`      | The IP address of the direct connection to Azure Front Door edge. If the client used an HTTP proxy or a load balancer to send the request, the value of `socket_ip` is the IP address of the proxy or load balancer.<br/> To access this server variable in a match condition, use [Socket address](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#socket-address). |
| `client_ip`      | The IP address of the client that made the original request. If there was an `X-Forwarded-For` header in the request, then the client IP address is picked from the header.<br />To access this server variable in a match condition, use [Remote address](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#remote-address) and configure the *Operator* to *IP Match* or *IP Not Match*. |
| `client_port`    | The IP port of the client that made the request. <br/> To access this server variable in a match condition, use [Client port](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#client-port).|
| `hostname`       | The host name in the request from the client. <br/> To access this server variable in a match condition, use [Host name](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#host-name).|
| `geo_country`    | Indicates the requester's country/region of origin through its country/region code. <br/> To access this server variable in a match condition, use [Remote address](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#remote-address) and configure the *Operator* to *Geo Match* or *Geo Not Match*.|
| `http_method`    | The method used to make the URL request, such as `GET` or `POST`.<br/> To access this server variable in a match condition, use [Request method](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#request-method).|
| `http_version`   | The request protocol. Usually `HTTP/1.0`, `HTTP/1.1`, or `HTTP/2.0`.<br/> To access this server variable in a match condition, use [HTTP version](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#http-version).|
| `query_string`   | The list of variable/value pairs that follows the `?` in the requested URL.<br />For example, in the request `http://contoso.com:8080/article.aspx?id=123&title=fabrikam`, the `query_string` value is `id=123&title=fabrikam`.<br/> To access this server variable in a match condition, use [Query string](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#query-string).|
| `request_scheme` | The request scheme: `http` or `https`.<br/> To access this server variable in a match condition, use [Request protocol](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#request-protocol).|
| `request_uri`    | The full original request URI (with arguments).<br />For example, in the request `http://contoso.com:8080/article.aspx?id=123&title=fabrikam`, the `request_uri` value is `http://contoso.com:8080/article.aspx?id=123&title=fabrikam`.<br/> To access this server variable in a match condition, use [Request URL](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#request-url).|
| `ssl_protocol`   | The protocol of an established TLS connection.<br/> To access this server variable in a match condition, use [SSL protocol](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#ssl-protocol).|
| `server_port`    | The port of the server that accepted a request.<br/> To access this server variable in a match condition, use [Server port](rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#server-port).|
| `url_path`       | Identifies the specific resource in the host that the web client wants to access. This is the part of the request URI without the arguments or leading slash.<br />For example, in the request `http://contoso.com:8080/article.aspx?id=123&title=fabrikam`, the `url_path` value is `article.aspx`. <br /> Azure Front Door supports dynamic capture of URL path with `{url_path:seg#}` server variable, and converts URL path to lowercase or uppercase with `{url_path.tolower}` or `{url_path.toupper}`. For more information, see [Server variable format](#server-variable-format) and [Server variables](rule-set-server-variables.md). <br/> To access this server variable in a match condition, use [Request path](rules-match-conditions.md#request-path) condition. |

## Server variable format 

When you work with Rule Set actions, specify server variables by using the following formats:

* `{variable}`: Include the entire server variable. For example, if the client IP address is `111.222.333.444` then the `{client_ip}` token would evaluate to `111.222.333.444`.
* `{variable:offset}`: Include the server variable after a specific offset, until the end of the variable. The offset is zero-based. For example, if the client IP address is `111.222.333.444` then the `{client_ip:3}` token would evaluate to `.222.333.444`.
* `{variable:offset:length}`: Include the server variable after a specific offset, up to the specified length. The offset is zero-based. For example, For example, when the variable var is 'AppId=01f592979c584d0f9d679db3e66a3e5e', 
    * Offsets within range, no lengths: `{var:0}` = `AppId=01f592979c584d0f9d679db3e66a3e5e`, `{var:6}` = `01f592979c584d0f9d679db3e66a3e5e`, `{var:-8}` = `e66a3e5e`
    * Offsets out of range, no lengths: `{var:-128}` = `AppId=01f592979c584d0f9d679db3e66a3e5e`, `{var:128}` = null
    * Offsets and lengths within range: `{var:0:5}` = `AppId`, `{var:7:7}` = `1f59297`, `{var:7:-7}` = `1f592979c584d0f9d679db3e`
    * Zero lengths: `{var:0:0}` = null,  `{var:4:0}` = null 
    * Offsets within range and lengths out of range: `{var:0:100}` = `AppId=01f592979c584d0f9d679db3e66a3e5e`, `{var:5:100}` = `=01f592979c584d0f9d679db3e66a3e5e`,  `{var:0:-48}` = null,  `{var:4:-48}` = null
* `{url_path:seg#}`: Allow users to capture and use the desired URL path segment in URL Redirect, URL Rewrite, or any meaningful action. User can also capture multiple segments by using the same style as substring capture `{url_path:seg1:3}`. For example, for a source pattern `/id/12345/default` and a URL rewrite Destination `/{url_path:1}/home`, the expected URL path after rewrite is `/12345/home`. for a multiple-segment capture, when the source pattern is `/id/12345/default/location/test`, a URL rewrite destination `/{url_path:seg1:3}/home` results in `/12345/default/location/home`. Segment capture includes the location path, so if route is `/match/*`, segment 0 will be match.

    Offset corresponds to the index of the start segment, and length refers to how many segments to capture, including the one at index = offset.
    
    Assuming offset and length are positive, the following logic applies:
    * If length isn't included, capture the segment at index = offset. 
    * When length is included, capture segments from index = offset up till index = offset + length.

    The following special cases are also handled:
    * If offset is negative, count backwards from end of the path to get the starting segment.
    * If offset is a negative value greater than or equal to the number of segments, set to 0.
    * If offset is greater than the number of segments, the result is empty.
    * If length is 0, the return the single segment specified by offset
    * If length is negative, treat it as a second offset and calculate backwards from the end of the path. If the value is less than offset, it results in an empty string.
    * If length is greater than the number of segments, return what remains in the path.

*  `{url_path.tolower}`/`{url_path.toupper}`: Convert the URL path to lowercase or uppercase. For example, a destination `{url_path.tolower}` in URL rewrite/redirect for `/lowercase/ABcDXyZ/EXAMPLE` results in `/lowercase/abcdxyz/example`. A destination `{url_path.toupper}` in URL rewrite/redirect for `/ABcDXyZ/example` results in `/ABCDXYZ/EXAMPLE`.
     
## Supported rule set actions

Server variables are supported on the following Rule set actions:

* Query string caching behavior in [Route configuration override](front-door-rules-engine-actions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#RouteConfigurationOverride)
* [Modify request header](front-door-rules-engine-actions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#ModifyRequestHeader)
* [Modify response header](front-door-rules-engine-actions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#ModifyResponseHeader)
* [URL redirect](front-door-rules-engine-actions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#UrlRedirect)
* [URL rewrite](front-door-rules-engine-actions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json#UrlRewrite)

## Next steps

* Learn more about [Azure Front Door Rule set](front-door-rules-engine-actions.md).
* Learn more about [Rule set match conditions](rules-match-conditions.md).
* Learn more about [Rule set actions](front-door-rules-engine-actions.md).
