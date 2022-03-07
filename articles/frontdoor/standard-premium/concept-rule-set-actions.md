---
title: Configure Azure Front Door Standard/Premium rule set actions
description: This article provides a list of the various actions you can do with Azure Front Door rule set. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 03/03/2022
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

Azure Front Door Standard/Premium supports server variables on actions. Please refer to more details in the server variables section of this document. <!-- TODO link -->

The following actions are available to use in Azure Front Door rule set.

## <a name="RouteConfigurationOverride"></a> Route configuration override

Use the **route configuration override** action to override the origin group or the caching configuration to use for the request. You can choose to override or honor the origin group configurations specified in the route. However, whenever you override the route configuration, you must configure caching. Otherwise, caching will be disabled for the request.

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
| Origin group | The origin group that the request should be routed to. This overrides the configuration specified in the Front Door endpoint route. |
| Forwarding protocol | The protocol for Front Door to use when forwarding the request to the origin. Supported values are HTTP only, HTTPS only, Match incoming request. This overrides the configuration specified in the Front Door endpoint route. |

When **Caching** is set to **Enabled**, set the following properties:

| Property | Supported values |
|-------|------------------|
| Query string caching behavior | <ul><li>**Include specified query string:** Query strings specified in the parameters get included when the cache key gets generated. In ARM templates, set the `queryStringBehavior` property to `Include`.</li><li>**Use query string:** Each unique URL has its own cache key. In ARM templates, use the `queryStringBehavior` of `IncludeAll`.</li><li>**Ignore query strings:** Query strings aren't considered when the cache key gets generated. In ARM templates, set the `queryStringBehavior` property to `ExcludeAll`.</li><li>**Ignore specified query string:** Query strings specified in the parameters get excluded when the cache key gets generated. In ARM templates, set the `queryStringBehavior` property to `Exclude`.</li> |
| Query parameters | The list of query string parameter names, separated by commas. This property is only set when *Query string caching behavior* is set to *Ignore Specified Query Strings* or *Include Specified Query Strings*. |
| Compression | <ul><li>**Enabled:** Front Door dynamically compresses content at the edge, resulting in a smaller and faster response. For more information, see [File compression](concept-caching.md#file-compression).</li><li>**Disabled.** Front Door does not perform compression.</li></ul> |
| Cache behavior | <ul><li>**Honor origin:** Front Door will always honor origin response header directive. If the origin directive is missing, Front Door will cache contents anywhere from 1 to 3 days. In ARM templates, set the `cacheBehavior` property to `TODO`.</li><li>**Override always:** The TTL value returned from your origin is overwritten with the value specified in the action. This behavior will only be applied if the response is cacheable. In ARM templates, set the `cacheBehavior` property to `Override`.</li><li>**Override if origin missing:** If no TTL value gets returned from your origin, the rule sets the TTL to the value specified in the action. This behavior will only be applied if the response is cacheable. In ARM templates, set the `cacheBehavior` property to `SetIfMissing`.</li></ul> |
| Cache duration | When _Cache behavior_ is set to `Override always` or `Override if origin missing`, these fields must specify the cache duration to use. The maximum duration is 366 days. This property is only set when *Cache behavior* is set to *Override always* or *Override if origin missing*.<ul><li>In the Azure portal: specify the days, hours, minutes, and seconds.</li><li>In ARM templates: specify the duration in the format `d.hh:mm:ss`. |

### Examples

In this example, we route all matched requests to an origin group named `SecondOriginGroup`, regardless of the configuration in the Front Door endpoint route. <!-- TODO these examples probably need updating -->

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
    "typeName": "DeliveryRuleOriginGroupOverrideActionParameters"
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
    typeName: 'DeliveryRuleOriginGroupOverrideActionParameters'
  }
}
```

---

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
    "typeName": "DeliveryRuleCacheKeyQueryStringBehaviorActionParameters"
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
    typeName: 'DeliveryRuleCacheKeyQueryStringBehaviorActionParameters'
  }
}
```

---

In this example, this rule actions will override the origin group from the one configured in the route to origingroup2 and use Matching incoming request while going back to origin. Caching is enabled for the associated route with ignoring query string and compression enabled. The cache behavior is configured to honor the settings from the origin. <!-- TODO update example -->

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
    "typeName": "DeliveryRuleCacheExpirationActionParameters"
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
    typeName: 'DeliveryRuleCacheExpirationActionParameters'
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

:::image type="content" source="../media/concept-rule-set-actions/url-rewrite.png" alt-text="Portal screenshot showing URL rewrite action.":::

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

## Next steps

* Learn more about [Azure Front Door Standard/Premium Rule Set](concept-rule-set.md).
* Learn more about [Rule Set match conditions](../rules-match-conditions.md?toc=%2fazure%2ffrontdoor%2fstandard-premium%2ftoc.json).
