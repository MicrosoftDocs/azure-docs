---
title: Configure Azure Front Door Standard/Premium rule set actions
description: This article provides a list of the various actions you can do with Azure Front Door rule set. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 03/31/2021
ms.author: yuajia
---

# Azure Front Door Standard/Premium (Preview) Rule Set actions

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

An Azure Front Door Standard/Premium [Rule Set](concept-rule-set.md) consist of rules with a combination of match conditions and actions. This article provides a detailed description of the actions you can use in Azure Front Door Standard/Premium Rule Set. The action defines the behavior that gets applied to a request type that a match condition(s) identifies. In an Azure Front Door (Standard/Premium) Rule Set, a rule can contain up to five actions.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The following actions are available to use in Azure Front Door rule set.  

## <a name="CacheExpiration"></a> Cache expiration

Use the **cache expiration** action to overwrite the time to live (TTL) value of the endpoint for requests that the rules match conditions specify.

> [!NOTE]
> Origins may specify not to cache specific responses using the `Cache-Control` header with a value of `no-cache`, `private`, or `no-store`. In these circumstances, Front Door will never cache the content and this action will have no effect.

### Properties

| Property | Supported values |
|-------|------------------|
| Cache behavior | <ul><li>**Bypass cache:** The content should not be cached. In ARM templates, set the `cacheBehavior` property to `BypassCache`.</li><li>**Override:** The TTL value returned from your origin is overwritten with the value specified in the action. This behavior will only be applied if the response is cacheable. In ARM templates, set the `cacheBehavior` property to `Override`.</li><li>**Set if missing:** If no TTL value gets returned from your origin, the rule sets the TTL to the value specified in the action. This behavior will only be applied if the response is cacheable. In ARM templates, set the `cacheBehavior` property to `SetIfMissing`.</li></ul> |
| Cache duration | When _Cache behavior_ is set to `Override` or `Set if missing`, these fields must specify the cache duration to use. The maximum duration is 366 days.<ul><li>In the Azure portal: specify the days, hours, minutes, and seconds.</li><li>In ARM templates: specify the duration in the format `d.hh:mm:ss`. |

### Example

In this example, we override the cache expiration to 6 hours, for matched requests that don't specify a cache duration already.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-actions/cache-expiration.png" alt-text="Portal screenshot showing cache expiration action.":::

# [JSON](#tab/json)

```json
{
  "name": "CacheExpiration",
  "parameters": {
    "cacheBehavior": "SetIfMissing",
    "cacheType": "All",
    "cacheDuration": "0.06:00:00",
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleCacheExpirationActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'CacheExpiration'
  parameters: {
    cacheBehavior: 'SetIfMissing'
    cacheType: All
    cacheDuration: '0.06:00:00'
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleCacheExpirationActionParameters'
  }
}
```

---

## <a name="CacheKeyQueryString"></a> Cache key query string

Use the **cache key query string** action to modify the cache key based on query strings. The cache key is the way that Front Door identifies unique requests to cache.

### Properties

| Property | Supported values |
|-------|------------------|
| Behavior | <ul><li>**Include:** Query strings specified in the parameters get included when the cache key gets generated. In ARM templates, set the `queryStringBehavior` property to `Include`.</li><li>**Cache every unique URL:** Each unique URL has its own cache key. In ARM templates, use the `queryStringBehavior` of `IncludeAll`.</li><li>**Exclude:** Query strings specified in the parameters get excluded when the cache key gets generated. In ARM templates, set the `queryStringBehavior` property to `Exclude`.</li><li>**Ignore query strings:** Query strings aren't considered when the cache key gets generated. In ARM templates, set the `queryStringBehavior` property to `ExcludeAll`.</li></ul>  |
| Parameters | The list of query string parameter names, separated by commas. |

### Example

In this example, we modify the cache key to include a query string parameter named `customerId`.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-actions/cache-key-query-string.png" alt-text="Portal screenshot showing cache key query string action.":::

# [JSON](#tab/json)

```json
{
  "name": "CacheKeyQueryString",
  "parameters": {
    "queryStringBehavior": "Include",
    "queryParameters": "customerId",
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleCacheKeyQueryStringBehaviorActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'CacheKeyQueryString'
  parameters: {
    queryStringBehavior: 'Include'
    queryParameters: 'customerId'
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleCacheKeyQueryStringBehaviorActionParameters'
  }
}
```

---

## <a name="ModifyRequestHeader"></a> Modify request header

Use the **modify request header** action to modify the headers in the request when it is sent to your origin.

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | <ul><li>**Append:** The specified header gets added to the request with the specified value. If the header is already present, the value is appended to the existing header value using string concatenation. No delimiters are added. In ARM templates, use the `headerAction` of `Append`.</li><li>**Overwrite:** The specified header gets added to the request with the specified value. If the header is already present, the specified value overwrites the existing value. In ARM templates, use the `headerAction` of `Overwrite`.</li><li>**Delete:** If the header specified in the rule is present, the header gets deleted from the request. In ARM templates, use the `headerAction` of `Delete`.</li></ul> |
| Header name | The name of the header to modify. |
| Header value | The value to append or overwrite. |

### Example

In this example, we append the value `AdditionalValue` to the `MyRequestHeader` request header. If the origin set the response header to a value of `ValueSetByClient`, then after this action is applied, the request header would have a value of `ValueSetByClientAdditionalValue`.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-actions/modify-request-header.png" alt-text="Portal screenshot showing modify request header action.":::

# [JSON](#tab/json)

```json
{
  "name": "ModifyRequestHeader",
  "parameters": {
    "headerAction": "Append",
    "headerName": "MyRequestHeader",
    "value": "AdditionalValue",
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleHeaderActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'ModifyRequestHeader'
  parameters: {
    headerAction: 'Append'
    headerName: 'MyRequestHeader'
    value: 'AdditionalValue'
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleHeaderActionParameters'
  }
}
```

---

## <a name="ModifyResponseHeader"></a> Modify response header

Use the **modify response header** action to modify headers that are present in responses before they are returned to your clients.

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | <ul><li>**Append:** The specified header gets added to the response with the specified value. If the header is already present, the value is appended to the existing header value using string concatenation. No delimiters are added. In ARM templates, use the `headerAction` of `Append`.</li><li>**Overwrite:** The specified header gets added to the response with the specified value. If the header is already present, the specified value overwrites the existing value. In ARM templates, use the `headerAction` of `Overwrite`.</li><li>**Delete:** If the header specified in the rule is present, the header gets deleted from the response.  In ARM templates, use the `headerAction` of `Delete`.</li></ul> |
| Header name | The name of the header to modify. |
| Header value | The value to append or overwrite. |

### Example

In this example, we delete the header with the name `X-Powered-By` from the responses before they are returned to the client.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-actions/modify-response-header.png" alt-text="Portal screenshot showing modify response header action.":::

# [JSON](#tab/json)

```json
{
  "name": "ModifyResponseHeader",
  "parameters": {
    "headerAction": "Delete",
    "headerName": "X-Powered-By",
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleHeaderActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'ModifyResponseHeader'
  parameters: {
    headerAction: 'Delete'
    headerName: 'X-Powered-By'
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleHeaderActionParameters'
  }
}
```

---

## <a name="UrlRedirect"></a> URL redirect

Use the **URL redirect** action to redirect clients to a new URL. Clients are sent a redirection response from Front Door.

### Properties

| Property | Supported values |
|----------|------------------|
| Redirect type | The response type to return to the requestor. <ul><li>In the Azure portal: Found (302), Moved (301), Temporary Redirect (307), Permanent Redirect (308).</li><li>In ARM templates: `Found`, `Moved`, `TemporaryRedirect`, `PermanentRedirect`</li></ul> |
| Redirect protocol | <ul><li>In the Azure portal: `Match Request`, `HTTP`, `HTTPS`</li><li>In ARM templates: `MatchRequest`, `Http`, `Https`</li></ul> |
| Destination host | The host name you want the request to be redirected to. Leave blank to preserve the incoming host. |
| Destination path | The path to use in the redirect. Include the leading `/`. Leave blank to preserve the incoming path. |
| Query string | The query string used in the redirect. Don't include the leading `?`. Leave blank to preserve the incoming query string. |
| Destination fragment | The fragment to use in the redirect. Leave blank to preserve the incoming fragment. |

### Example

In this example, we redirect the request to `https://contoso.com/exampleredirection?clientIp={client_ip}`, while preserving the fragment. An HTTP Temporary Redirect (307) is used. The IP address of the client is used in place of the `{client_ip}` token within the URL by using the `client_ip` [server variable](#server-variables).

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-actions/url-redirect.png" alt-text="Portal screenshot showing URL redirect action.":::

# [JSON](#tab/json)

```json
{
  "name": "UrlRedirect",
  "parameters": {
    "redirectType": "TemporaryRedirect",
    "destinationProtocol": "Https",
    "customHostname": "contoso.com",
    "customPath": "/exampleredirection",
    "customQueryString": "clientIp={client_ip}",
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlRedirectActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'UrlRedirect'
  parameters: {
    redirectType: 'TemporaryRedirect'
    destinationProtocol: 'Https'
    customHostname: 'contoso.com'
    customPath: '/exampleredirection'
    customQueryString: 'clientIp={client_ip}'
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlRedirectActionParameters'
  }
}
```

---

## <a name="UrlRewrite"></a> URL rewrite

Use the **URL rewrite** action to rewrite the path of a request that's en route to your origin.

### Properties

| Property | Supported values |
|----------|------------------|
| Source pattern | Define the source pattern in the URL path to replace. Currently, source pattern uses a prefix-based match. To match all URL paths, use a forward slash (`/`) as the source pattern value. |
| Destination | Define the destination path to use in the rewrite. The destination path overwrites the source pattern. |
| Preserve unmatched path | If set to _Yes_, the remaining path after the source pattern is appended to the new destination path. |

### Example

In this example, we rewrite all requests to the path `/redirection`, and don't preserve the remainder of the path.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-actions/url-rewrite.png" alt-text="Portal screenshot showing URL rewrite action.":::

# [JSON](#tab/json)

```json
{
  "name": "UrlRewrite",
  "parameters": {
    "sourcePattern": "/",
    "destination": "/redirection",
    "preserveUnmatchedPath": false,
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlRewriteActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'UrlRewrite'
  parameters: {
    sourcePattern: '/'
    destination: '/redirection'
    preserveUnmatchedPath: false
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlRewriteActionParameters'
  }
}
```

---

## <a name="OriginGroupOverride"></a> Origin group override

Use the **Origin group override** action to change the origin group that the request should be routed to.

### Properties

| Property | Supported values |
|----------|------------------|
| Origin group | The origin group that the request should be routed to. This overrides the configuration specified in the Front Door endpoint route. |

### Example

In this example, we route all matched requests to an origin group named `SecondOriginGroup`, regardless of the configuration in the Front Door endpoint route.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-actions/origin-group-override.png" alt-text="Portal screenshot showing origin group override action.":::

# [JSON](#tab/json)

```json
{
  "name": "OriginGroupOverride",
  "parameters": {
    "originGroup": {
      "id": "/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.Cdn/profiles/<profile-name>/originGroups/SecondOriginGroup"
    },
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleOriginGroupOverrideActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'OriginGroupOverride'
  parameters: {
    originGroup: {
      id: '/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.Cdn/profiles/<profile-name>/originGroups/SecondOriginGroup'
    }
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleOriginGroupOverrideActionParameters'
  }
}
```

---

## Server variables

Rule Set server variables provide access to structured information about the request. You can use server variables to dynamically change the request/response headers or URL rewrite paths/query strings, for example, when a new page load or when a form is posted.

### Supported variables

| Variable name    | Description                                                                                                                                                                                                                                                                               |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `socket_ip`      | The IP address of the direct connection to Azure Front Door edge. If the client used an HTTP proxy or a load balancer to send the request, the value of `socket_ip` is the IP address of the proxy or load balancer.                                                                      |
| `client_ip`      | The IP address of the client that made the original request. If there was an `X-Forwarded-For` header in the request, then the client IP address is picked from the header.                                                                                                               |
| `client_port`    | The IP port of the client that made the request.                                                                                                                                                                                                                                          |
| `hostname`       | The host name in the request from the client.                                                                                                                                                                                                                                             |
| `geo_country`    | Indicates the requester's country/region of origin through its country/region code.                                                                                                                                                                                                       |
| `http_method`    | The method used to make the URL request, such as `GET` or `POST`.                                                                                                                                                                                                                         |
| `http_version`   | The request protocol. Usually `HTTP/1.0`, `HTTP/1.1`, or `HTTP/2.0`.                                                                                                                                                                                                                      |
| `query_string`   | The list of variable/value pairs that follows the "?" in the requested URL.<br />For example, in the request `http://contoso.com:8080/article.aspx?id=123&title=fabrikam`, the `query_string` value will be `id=123&title=fabrikam`.                                                      |
| `request_scheme` | The request scheme: `http` or `https`.                                                                                                                                                                                                                                                    |
| `request_uri`    | The full original request URI (with arguments).<br />For example, in the request `http://contoso.com:8080/article.aspx?id=123&title=fabrikam`, the `request_uri` value will be `/article.aspx?id=123&title=fabrikam`.                                                                     |
| `ssl_protocol`   | The protocol of an established TLS connection.                                                                                                                                                                                                                                            |
| `server_port`    | The port of the server that accepted a request.                                                                                                                                                                                                                                           |
| `url_path`       | Identifies the specific resource in the host that the web client wants to access. This is the part of the request URI without the arguments.<br />For example, in the request `http://contoso.com:8080/article.aspx?id=123&title=fabrikam`, the `uri_path` value will be `/article.aspx`. |

### Server variable format    

Server variables can be specified using the following formats:

* `{variable}`: Include the entire server variable. For example, if the client IP address is `111.222.333.444` then the `{client_ip}` token would evaluate to `111.222.333.444`.
* `{variable:offset}`: Include the server variable after a specific offset, until the end of the variable. The offset is zero-based. For example, if the client IP address is `111.222.333.444` then the `{client_ip:3}` token would evaluate to `.222.333.444`.
* `{variable:offset:length}`: Include the server variable after a specific offset, up to the specified length. The offset is zero-based. For example, if the client IP address is `111.222.333.444` then the `{client_ip:4:3}` token would evaluate to `222`.

### Supported actions

Server variables are supported on the following actions:

* Cache key query string
* Modify request header
* Modify response header
* URL redirect
* URL rewrite

## Next steps

* Learn more about [Azure Front Door Standard/Premium Rule Set](concept-rule-set.md).
* Learn more about [Rule Set match conditions](concept-rule-set-match-conditions.md).
