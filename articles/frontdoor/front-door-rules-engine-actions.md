---
title: Rule set actions
titleSuffix: Azure Front Door
description: This article provides a list of various actions you can do with Azure Front Door rule sets.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/01/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Rule set actions

::: zone pivot="front-door-standard-premium"

An Azure Front Door [rule set](front-door-rules-engine.md) consist of rules with a combination of match conditions and actions. This article provides a detailed description of actions you can use in a rule set. An action defines the behavior that gets applied to a request type that a match condition(s) identifies. In a rule set, a rule can have up to five actions. Front Door also supports [server variable](rule-set-server-variables.md) in a rule set action.

The following actions are available for use in a rule set: 

## <a name="RouteConfigurationOverride"></a> Route configuration override

The **route configuration override** action is used to override the origin group or the caching configuration for the request. You can choose to override or honor the origin group configurations specified in the route. However, when you override the route configuration, you must configure caching. Otherwise, caching gets disabled for the request.

You can also override how files get cached for specific requests, including:

- Override the caching behavior specified by the origin.
- How query string parameters are used to generate the request's cache key.
- The time to live (TTL) value to control how long contents stay in cache.

### Properties

| Property | Supported values |
|----------|------------------|
| Override origin group | <ul><li>**Yes:** Override the origin group used for the request.</li> <li>**No:** Use the origin group specified in the route.</li></ul> |
| Caching | <ul><li>**Enabled:** Force caching to be enabled for the request.</li><li>**Disabled:** Force caching to be disabled for the request.</li></ul> |

When **Override origin group** is set to **Yes**, set the following properties:

| Property | Supported values |
|----------|------------------|
| Origin group | The origin group that the request should be routed to. This setting overrides the configuration specified in the Front Door endpoint route. |
| Forwarding protocol | The protocol for Front Door to use when forwarding the request to the origin. Supported values are HTTP only, HTTPS only, Match incoming request. This setting overrides the configuration specified in the Front Door endpoint route. |

When **Caching** is set to **Enabled**, set the following properties:

| Property | Supported values |
|-------|------------------|
| Query string caching behavior | <ul><li>**Ignore Query String:** Query strings aren't considered when the cache key gets generated. In ARM templates, set the `queryStringCachingBehavior` property to `IgnoreQueryString`.</li><li>**Use query string:** Each unique URL has its own cache key. In ARM templates, use the `queryStringCachingBehavior` of `UseQueryString`.</li><li>**Ignore specified query string:** Query strings specified in the parameters get excluded when the cache key gets generated. In ARM templates, set the `queryStringCachingBehavior` property to `IgnoreSpecifiedQueryStrings`.</li><li>**Include specified query string:** Query strings specified in the parameters get included when the cache key gets generated. In ARM templates, set the `queryStringCachingBehavior` property to `IncludeSpecifiedQueryStrings`.</li></ul> |
| Query parameters | The list of query string parameter names, separated by commas. This property is only set when *Query string caching behavior* is set to *Ignore Specified Query Strings* or *Include Specified Query Strings*. |
| Compression | <ul><li>**Enabled:** Front Door dynamically compresses content at the edge, resulting in a smaller and faster response. For more information, see [File compression](front-door-caching.md#file-compression). In ARM templates, set the `isCompressionEnabled` property to `Enabled`.</li><li>**Disabled.** Front Door doesn't perform compression. In ARM templates, set the `isCompressionEnabled` property to `Disabled`.</li></ul> |
| Cache behavior | <ul><li>**Honor origin:** Front Door always honors origin response header directive. If the origin directive is missing, Front Door caches contents anywhere from 1 to 3 days. In ARM templates, set the `cacheBehavior` property to `HonorOrigin`.</li><li>**Override always:** The TTL value returned from your origin is overwritten with the value specified in the action. This behavior only gets applied if the response is cacheable. In ARM templates, set the `cacheBehavior` property to `OverrideAlways`.</li><li>**Override if origin missing:** If no TTL value gets returned from your origin, the rule sets the TTL to the value specified in the action. This behavior only gets applied if the response is cacheable. In ARM templates, set the `cacheBehavior` property to `OverrideIfOriginMissing`.</li></ul> |
| Cache duration | When _Cache behavior_ is set to `Override always` or `Override if origin missing`, these fields must specify the cache duration to use. The maximum duration is 366 days. For a value of 0 seconds, the CDN caches the content, but must revalidate each request with the origin server. This property is only set when *Cache behavior* is set to *Override always* or *Override if origin missing*.<ul><li>In the Azure portal: specify the days, hours, minutes, and seconds.</li><li>In ARM templates: use the `cacheDuration` to specify the duration in the format `d.hh:mm:ss`. |

### Examples

In this example, we route all matched requests to an origin group named `MyOriginGroup`, regardless of the configuration in the Front Door endpoint route.

# [Portal](#tab/portal)

:::image type="content" source="media/front-door-rules-engine-actions/origin-group-override.png" alt-text="Portal screenshot showing origin group override action.":::

# [JSON](#tab/json)

```json
{
  "name": "RouteConfigurationOverride",
  "parameters": {
    "originGroupOverride": {
      "originGroup": {
        "id": "/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.Cdn/profiles/<profile-name>/originGroups/MyOriginGroup"
      },
      "forwardingProtocol": "MatchRequest"
    },
    "cacheConfiguration": null,
    "typeName": "DeliveryRuleRouteConfigurationOverrideActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'RouteConfigurationOverride'
  parameters: {
    originGroupOverride: {
      originGroup: {
        id: '/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.Cdn/profiles/<profile-name>/originGroups/MyOriginGroup'
      }
      forwardingProtocol: 'MatchRequest'
    }
    cacheConfiguration: null
    typeName: 'DeliveryRuleRouteConfigurationOverrideActionParameters'
  }
}
```

---

In this example, we set the cache key to include a query string parameter named `customerId`. Compression is enabled, and the origin's caching policies are honored.

# [Portal](#tab/portal)

:::image type="content" source="media/front-door-rules-engine-actions/cache-key-query-string.png" alt-text="Portal screenshot showing cache key query string action.":::

# [JSON](#tab/json)

```json
{
  "name": "RouteConfigurationOverride",
  "parameters": {
    "cacheConfiguration": {
      "queryStringCachingBehavior": "IncludeSpecifiedQueryStrings",
      "queryParameters": "customerId",
      "isCompressionEnabled": "Enabled",
      "cacheBehavior": "HonorOrigin",
      "cacheDuration": null
    },
    "originGroupOverride": null,
    "typeName": "DeliveryRuleRouteConfigurationOverrideActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'RouteConfigurationOverride'
  parameters: {
    cacheConfiguration: {
      queryStringCachingBehavior: 'IncludeSpecifiedQueryStrings'
      queryParameters: 'customerId'
      isCompressionEnabled: 'Enabled'
      cacheBehavior: 'HonorOrigin'
      cacheDuration: null
    }
    originGroupOverride: null
    typeName: 'DeliveryRuleRouteConfigurationOverrideActionParameters'
  }
}
```

---

In this example, we override the cache expiration to 6 hours for matched requests that don't specify a cache duration already. Front Door ignores the query string when it determines the cache key, and compression is enabled.

# [Portal](#tab/portal)

:::image type="content" source="media/front-door-rules-engine-actions/cache-expiration.png" alt-text="Portal screenshot showing cache expiration action.":::

# [JSON](#tab/json)

```json
{
  "name": "RouteConfigurationOverride",
  "parameters": {
    "cacheConfiguration": {
      "queryStringCachingBehavior": "IgnoreQueryString",
      "cacheBehavior": "OverrideIfOriginMissing",
      "cacheDuration": "0.06:00:00",
    },
    "originGroupOverride": null,
    "typeName": "DeliveryRuleRouteConfigurationOverrideActionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'RouteConfigurationOverride'
  parameters: {
    cacheConfiguration: {
      queryStringCachingBehavior: 'IgnoreQueryString'
      cacheBehavior: 'OverrideIfOriginMissing'
      cacheDuration: '0.06:00:00'
    }
    originGroupOverride: null
    typeName: 'DeliveryRuleRouteConfigurationOverrideActionParameters'
  }
}
```

---

## <a name="ModifyRequestHeader"></a> Modify request header

Use the **modify request header** action to modify the headers in the request when it's sent to your origin.

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | <ul><li>**Append:** The specified header gets added to the request with the specified value. If the header is already present, the value is appended to the existing header value using string concatenation. No delimiters are added. In ARM templates, use the `headerAction` of `Append`.</li><li>**Overwrite:** The specified header gets added to the request with the specified value. If the header is already present, the specified value overwrites the existing value. In ARM templates, use the `headerAction` of `Overwrite`.</li><li>**Delete:** If the header specified in the rule is present, the header gets deleted from the request. In ARM templates, use the `headerAction` of `Delete`.</li></ul> |
| Header name | The name of the header to modify. |
| Header value | The value to append or overwrite. |

### Example

In this example, we append the value `AdditionalValue` to the `MyRequestHeader` request header. If the origin set the response header to a value of `ValueSetByClient`, then after this action is applied, the request header would have a value of `ValueSetByClientAdditionalValue`.

# [Portal](#tab/portal)

:::image type="content" source="media/front-door-rules-engine-actions/modify-request-header.png" alt-text="Portal screenshot showing modify request header action.":::

# [JSON](#tab/json)

```json
{
  "name": "ModifyRequestHeader",
  "parameters": {
    "headerAction": "Append",
    "headerName": "MyRequestHeader",
    "value": "AdditionalValue",
    "typeName": "DeliveryRuleHeaderActionParameters"
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
    typeName: 'DeliveryRuleHeaderActionParameters'
  }
}
```

---

## <a name="ModifyResponseHeader"></a> Modify response header

Use the **modify response header** action to modify headers that are present in responses before they're returned to your clients.

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | <ul><li>**Append:** The specified header gets added to the response with the specified value. If the header is already present, the value is appended to the existing header value using string concatenation. No delimiters are added. In ARM templates, use the `headerAction` of `Append`.</li><li>**Overwrite:** The specified header gets added to the response with the specified value. If the header is already present, the specified value overwrites the existing value. In ARM templates, use the `headerAction` of `Overwrite`.</li><li>**Delete:** If the header specified in the rule is present, the header gets deleted from the response.  In ARM templates, use the `headerAction` of `Delete`.</li></ul> |
| Header name | The name of the header to modify. |
| Header value | The value to append or overwrite. |

### Example

In this example, we delete the header with the name `X-Powered-By` from the responses before they're returned to the client.

# [Portal](#tab/portal)

:::image type="content" source="media/front-door-rules-engine-actions/modify-response-header.png" alt-text="Portal screenshot showing modify response header action.":::

# [JSON](#tab/json)

```json
{
  "name": "ModifyResponseHeader",
  "parameters": {
    "headerAction": "Delete",
    "headerName": "X-Powered-By",
    "typeName": "DeliveryRuleHeaderActionParameters"
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
    typeName: 'DeliveryRuleHeaderActionParameters'
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

In this example, we redirect the request to `https://contoso.com/exampleredirection?clientIp={client_ip}`, while preserving the fragment. An HTTP Temporary Redirect (307) is used. The IP address of the client is used in place of the `{client_ip}` token within the URL by using the `client_ip` [server variable](rule-set-server-variables.md).

# [Portal](#tab/portal)

:::image type="content" source="media/front-door-rules-engine-actions/url-redirect.png" alt-text="Portal screenshot showing URL redirect action.":::

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
    "typeName": "DeliveryRuleUrlRedirectActionParameters"
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
    typeName: 'DeliveryRuleUrlRedirectActionParameters'
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

:::image type="content" source="media/front-door-rules-engine-actions/url-rewrite.png" alt-text="Portal screenshot showing URL rewrite action.":::

# [JSON](#tab/json)

```json
{
  "name": "UrlRewrite",
  "parameters": {
    "sourcePattern": "/",
    "destination": "/redirection",
    "preserveUnmatchedPath": false,
    "typeName": "DeliveryRuleUrlRewriteActionParameters"
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
    typeName: 'DeliveryRuleUrlRewriteActionParameters'
  }
}
```

---

::: zone-end

::: zone pivot="front-door-classic"

In Azure Front Door (classic), a [Rules engine](front-door-rules-engine.md) can consist up to 25 rules containing matching conditions and associated actions. This article provides a detailed description of each action you can define in a rule.

An action defines the behavior that gets applied to the request type that matches the condition or set of match conditions. In the Rules engine configuration, a rule can have up to 10 matching conditions and 5 actions. You can only have one *Override Routing Configuration* action in a single rule.

The following actions are available to use in Rules engine configuration.  

## Modify request header

Use these actions to modify headers that are present in requests sent to your backend.

### Required fields

| Action | HTTP header name | Value |
| ------ | ---------------- | ----- |
| Append | When this option gets selected and the rule matches, the header specified in **Header name** gets added to the request with the specified value. If the header is already present, the value is appended to the existing value. | String |
| Overwrite | When this option is selected and the rule matches, the header specified in **Header name** gets added to the request with the specified value. If the header is already present, the specified value overwrites the existing value. | String |
| Delete | When this option gets selected with matching rules and the header specified in the rule is present, the header gets deleted from the request. | String |

## Modify response header

Use these actions to modify headers that are present in responses returned to your clients.

### Required fields

| Action | HTTP Header name | Value |
-------|------------------|------
| Append | When this option gets selected and the rule matches, the header specified in **Header name** gets added to the response by using the specified **Value**. If the header is already present, **Value** is appended to the existing value. | String |
| Overwrite | When this option is selected and the rule matches, the header specified in **Header name** is added to the response by using the specified **Value**. If the header is already present, **Value** overwrites the existing value. | String |
| Delete | When this option gets selected with matching rules and the header specified in the rule is present, the header gets deleted from the response. | String |

## Route configuration overrides 

### Route Type: Redirect

Use these actions to redirect clients to a new URL. 

#### Required fields

| Field | Description |
| ----- | ----------- |
| Redirect type | Redirect is a way to send users/clients from one URL to another. A redirect type sets the status code used by clients to understand the purpose of the redirect. <br><br/>You can select the following redirect status codes: Found (302), Moved (301), Temporary redirect (307), and Permanent redirect (308). |
| Redirect protocol | Retain the protocol as per the incoming request, or define a new protocol for the redirection. For example, select 'HTTPS' for HTTP to HTTPS redirection. |
| Destination host | Set this value to change the hostname in the URL for the redirection or otherwise retain the hostname from the incoming request. |
| Destination path | Either retain the path as per the incoming request, or update the path in the URL for the redirection. |  
| Query string | Set this value to replace any existing query string from the incoming request URL or otherwise retain the original set of query strings. |
| Destination fragment | The destination fragment is the portion of URL after '#', normally used by browsers to land on a specific section on a page. Set this value to add a fragment to the redirect URL. |

### Route Type: Forward

Use these actions to forward clients to a new URL. These actions also contain sub actions for URL rewrites and caching. 

| Field | Description |
| ----- | ----------- |
| Backend pool | Select the backend pool to override and serve the requests, you see all your preconfigured backend pools currently in your Front Door profile. |
| Forwarding protocol | Protocol to use for forwarding request to backend or match the protocol from incoming request. |
| URL rewrite | Path to use when constructing the request for URL rewrite to forward to the backend. |
| Caching | Enable caching for this routing rule. When enabled, Azure Front Door caches your static content. |

#### URL rewrite

Use this setting to configure an optional **Custom Forwarding Path** to use when constructing the request to forward to the backend.

| Field | Description |
| ----- | ----------- |
| Custom forwarding path | Define a path for which requests get forwarded to. |

#### Caching

Use these settings to control how files get cached for requests that contain query strings. Whether to cache your content based on all parameters or on selected parameters. You can use these settings to overwrite the time to live (TTL) value to control how long contents stay in cache. To force caching as an action, set the caching field to "Enabled." When you force caching, the following options appear: 

| Cache behavior |  Description |
| -------------- | ------------ |
| Ignore Query String | Once the asset is cached, all ensuing requests ignore the query strings until the cached asset expires. |
| Use Query String | Each request with a unique URL, including the query string, is treated as a unique asset with its own cache. |
| Ignore Specified Query Strings | Request URL query strings listed in "Query parameters" setting are ignored for caching. |
| Include Specified Query Strings | Request URL query strings listed in "Query parameters" setting are used for caching. |

| Other fields |  Description 
------------------|---------------
| Dynamic compression | Front Door can dynamically compress content on the edge, resulting in a smaller and faster response. |
| Query parameters | A comma-separated list of allowed or disallowed parameters to use as a basis for caching.
| Use default cache duration | Set to use Azure Front Door default caching duration or define a caching duration that ignores the origin response directive. | 

::: zone-end

## Next steps

- Learn how to configure your first [Rule set](front-door-tutorial-rules-engine.md). 
- Learn more about [Rule set match conditions](front-door-rules-engine-match-conditions.md).
- Learn more about [Azure Front Door Rule sets](front-door-rules-engine.md).
