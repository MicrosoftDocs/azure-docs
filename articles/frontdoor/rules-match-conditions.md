---
title: Configure Azure Front Door rules match conditions
description: This article provides a list of the various match conditions available with Azure Front Door rules. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 12/05/2022
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Rules match conditions

::: zone pivot="front-door-standard-premium"

In Azure Front Door [Rule sets](front-door-rules-engine.md), a rule consists of none or some match conditions and an action. This article provides detailed descriptions of match conditions you can use in Azure Front Door rule sets.

::: zone-end

::: zone pivot="front-door-classic"

In Azure Front Door (classic) [Rules engines](front-door-rules-engine.md), a rule consists of none or some match conditions and an action. This article provides detailed descriptions of match conditions you can use in Azure Front Door (classic) Rules engines.

::: zone-end

The first part of a rule is a match condition or set of match conditions. A rule can consist of up to 10 match conditions. A match condition identifies specific types of requests for which defined actions are done. If you use multiple match conditions, the match conditions are grouped together by using AND logic. For all match conditions that support multiple values, OR logic is used.

You can use a match condition to:

::: zone pivot="front-door-standard-premium"

* Filter requests based on a specific IP address, port, or country/region.
* Filter requests by header information.
* Filter requests from mobile devices or desktop devices.
* Filter requests from request file name and file extension.
* Filter requests by hostname, SSL protocol, request URL, protocol, path, query string, post args, and other values.

::: zone-end

::: zone pivot="front-door-classic"

* Filter requests based on a specific IP address, or country/region.
* Filter requests by header information.
* Filter requests from mobile devices or desktop devices.
* Filter requests from request file name and file extension.
* Filter requests by request URL, protocol, path, query string, post arguments, and other values.

::: zone-end

::: zone pivot="front-door-standard-premium"

::: zone-end

## Device type

Use the **device type** match condition to identify requests that have been made from a mobile device or desktop device.

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | <ul><li>In the Azure portal: `Equal`, `Not Equal`</li><li>In ARM templates: `Equal`; use the `negateCondition` property to specify _Not Equal_</li></ul> |
| Value | `Mobile`, `Desktop` |

### Example

In this example, we match all requests that have been detected as coming from a mobile device.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/device-type.png" alt-text="Portal screenshot showing device type match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "IsDevice",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "Mobile"
    ],
    "typeName": "DeliveryRuleIsDeviceConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "IsDevice",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "Mobile"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleIsDeviceConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'IsDevice'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'Mobile'
    ]
    typeName: 'DeliveryRuleIsDeviceConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'IsDevice'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'Mobile'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleIsDeviceConditionParameters'
  }
}
```

::: zone-end

---

::: zone pivot="front-door-standard-premium"
## HTTP version

Use the **HTTP version** match condition to identify requests that have been made by using a specific version of the HTTP protocol.

> [!NOTE]
> The **HTTP version** match condition is only available on Azure Front Door Standard/Premium.

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | <ul><li>In the Azure portal: `Equal`, `Not Equal`</li><li>In ARM templates: `Equal`; use the `negateCondition` property to specify _Not Equal_</li></ul> |
| Value | `2.0`, `1.1`, `1.0`, `0.9` |

### Example

In this example, we match all requests that have been sent by using the HTTP 2.0 protocol.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/http-version.png" alt-text="Portal screenshot showing HTTP version match condition.":::

# [JSON](#tab/json)

```json
{
  "name": "HttpVersion",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "2.0"
    ],
    "typeName": "DeliveryRuleHttpVersionConditionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'HttpVersion'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      '2.0'
    ]
    typeName: 'DeliveryRuleHttpVersionConditionParameters'
  }
}
```

---

## Request cookies

Use the **request cookies** match condition to identify requests that have included a specific cookie.

> [!NOTE]
> The **request cookies** match condition is only available on Azure Front Door Standard/Premium.

### Properties

| Property | Supported values |
|-------|------------------|
| Cookie name | A string value representing the name of the cookie. |
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | One or more string or integer values representing the value of the request header to match. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all requests that have included a cookie named `deploymentStampId` with a value of `1`.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/cookies.png" alt-text="Portal screenshot showing request cookies match condition.":::

# [JSON](#tab/json)

```json
{
  "name": "Cookies",
  "parameters": {
    "selector": "deploymentStampId",
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "1"
    ],
    "transforms": [],
    "typeName": "DeliveryRuleCookiesConditionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'Cookies'
  parameters: {
    selector: 'deploymentStampId'
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      '1'
    ]
    typeName: 'DeliveryRuleCookiesConditionParameters'
  }
}
```

---
::: zone-end

## Post args

Use the **post args** match condition to identify requests based on the arguments provided within a POST request's body. A single match condition matches a single argument from the POST request's body. You can specify multiple values to match, which will be combined using OR logic.

> [!NOTE]
> The **post args** match condition works with the `application/x-www-form-urlencoded` content type.

### Properties

| Property | Supported values |
|-|-|
| Post args | A string value representing the name of the POST argument. |
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | One or more string or integer values representing the value of the POST argument to match. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all POST requests where a `customerName` argument is provided in the request body, and where the value of `customerName` begins with the letter `J` or `K`. We use a case transform to convert the input values to uppercase so that values beginning with `J`, `j`, `K`, and `k` are all matched.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/post-args.png" alt-text="Portal screenshot showing post args match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "PostArgs",
  "parameters": {
    "selector": "customerName",
    "operator": "BeginsWith",
    "negateCondition": false,
    "matchValues": [
        "J",
        "K"
    ],
    "transforms": [
        "Uppercase"
    ],
    "typeName": "DeliveryRulePostArgsConditionParameters"
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "PostArgs",
  "parameters": {
    "selector": "customerName",
    "operator": "BeginsWith",
    "negateCondition": false,
    "matchValues": [
        "J",
        "K"
    ],
    "transforms": [
        "Uppercase"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRulePostArgsConditionParameters"
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'PostArgs'
  parameters: {
    selector: 'customerName'
    operator: 'BeginsWith'
    negateCondition: false
    matchValues: [
      'J'
      'K'
    ]
    transforms: [
      'Uppercase'
    ]
    typeName: 'DeliveryRulePostArgsConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'PostArgs'
  parameters: {
    selector: 'customerName'
    operator: 'BeginsWith'
    negateCondition: false
    matchValues: [
      'J'
      'K'
    ]
    transforms: [
      'Uppercase'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRulePostArgsConditionParameters'
  }
}
```

::: zone-end

---

## Query string

Use the **query string** match condition to identify requests that contain a specific query string. You can specify multiple values to match, which will be combined using OR logic.

> [!NOTE]
> The entire query string is matched as a single string, without the leading `?`.

### Properties

| Property | Supported values |
|-|-|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **query string** match condition. |
| Query string | One or more string or integer values representing the value of the query string to match. Don't include the `?` at the start of the query string. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all requests where the query string contains the string `language=en-US`. We want the match condition to be case-sensitive, so we don't transform the case.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/query-string.png" alt-text="Portal screenshot showing query string match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "QueryString",
  "parameters": {
    "operator": "Contains",
    "negateCondition": false,
    "matchValues": [
      "language=en-US"
    ],
    "typeName": "DeliveryRuleQueryStringConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "QueryString",
  "parameters": {
    "operator": "Contains",
    "negateCondition": false,
    "matchValues": [
      "language=en-US"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleQueryStringConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'QueryString'
  parameters: {
    operator: 'Contains'
    negateCondition: false
    matchValues: [
      'language=en-US'
    ]
    typeName: 'DeliveryRuleQueryStringConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'QueryString'
  parameters: {
    operator: 'Contains'
    negateCondition: false
    matchValues: [
      'language=en-US'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleQueryStringConditionParameters'
  }
}
```

::: zone-end

---

## Remote address

The **remote address** match condition identifies requests based on the requester's location or IP address. You can specify multiple values to match, which will be combined using OR logic.

* Use CIDR notation when specifying IP address blocks. The syntax for an IP address block is the base IP address followed by a forward slash and the prefix size. For example:
    * **IPv4 example**: `5.5.5.64/26` matches any requests that arrive from addresses 5.5.5.64 through 5.5.5.127.
    * **IPv6 example**: `1:2:3:/48` matches any requests that arrive from addresses 1:2:3:0:0:0:0:0 through 1:2:3: ffff:ffff:ffff:ffff:ffff.
* When you specify multiple IP addresses and IP address blocks, 'OR' logic is applied.
    * **IPv4 example**: if you add two IP addresses `1.2.3.4` and `10.20.30.40`, the condition is matched for any requests that arrive from either address 1.2.3.4 or 10.20.30.40.
    * **IPv6 example**: if you add two IP addresses `1:2:3:4:5:6:7:8` and `10:20:30:40:50:60:70:80`, the condition is matched for any requests that arrive from either address 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.
* The remote address represents the original client IP that is either from the network connection or typically the X-Forwarded-For request header if the user is behind a proxy. Use the [socket address](#socket-address) match condition (available in Standard/Premium), if you need to match based on the TCP request's IP address.

### Properties

| Property | Supported values |
|-|-|
| Operator | <ul><li>In the Azure portal: `Geo Match`, `Geo Not Match`, `IP Match`, or `IP Not Match`</li><li>In ARM templates: `GeoMatch`, `IPMatch`; use the `negateCondition` property to specify _Geo Not Match_ or _IP Not Match_</li></ul> |
| Value | <ul><li>For the `IP Match` or `IP Not Match` operators: specify one or more IP address ranges. If multiple IP address ranges are specified, they're evaluated using OR logic.</li><li>For the `Geo Match` or `Geo Not Match` operators: specify one or more locations using their country code.</li></ul> |

### Example

In this example, we match all requests where the request hasn't originated from the United States.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/remote-address.png" alt-text="Portal screenshot showing remote address match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "RemoteAddress",
  "parameters": {
    "operator": "GeoMatch",
    "negateCondition": true,
    "matchValues": [
      "US"
    ],
    "typeName": "DeliveryRuleRemoteAddressConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "RemoteAddress",
  "parameters": {
    "operator": "GeoMatch",
    "negateCondition": true,
    "matchValues": [
      "US"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleRemoteAddressConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'RemoteAddress'
  parameters: {
    operator: 'GeoMatch'
    negateCondition: true
    matchValues: [
      'US'
    ]
    typeName: 'DeliveryRuleRemoteAddressConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'RemoteAddress'
  parameters: {
    operator: 'GeoMatch'
    negateCondition: true
    matchValues: [
      'US'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRemoteAddressConditionParameters'
  }
}
```

::: zone-end

---

## Request body

The **request body** match condition identifies requests based on specific text that appears in the body of the request. You can specify multiple values to match, which will be combined using OR logic.

> [!NOTE]
> If a request body exceeds 64KB in size, only the first 64KB will be considered for the **request body** match condition.

### Properties

| Property | Supported values |
|-|-|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **request body** match condition. |
| Value | One or more string or integer values representing the value of the request body text to match. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all requests where the request body contains the string `ERROR`. We transform the request body to uppercase before evaluating the match, so `error` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/request-body.png" alt-text="Portal screenshot showing request body match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "RequestBody",
  "parameters": {
    "operator": "Contains",
    "negateCondition": false,
    "matchValues": [
      "ERROR"
    ],
    "transforms": [
      "Uppercase"
    ],
    "typeName": "DeliveryRuleRequestBodyConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "RequestBody",
  "parameters": {
    "operator": "Contains",
    "negateCondition": false,
    "matchValues": [
      "ERROR"
    ],
    "transforms": [
      "Uppercase"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestBodyConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'RequestBody'
  parameters: {
    operator: 'Contains'
    negateCondition: false
    matchValues: [
      'ERROR'
    ]
    transforms: [
      'Uppercase'
    ]
    typeName: 'DeliveryRuleRequestBodyConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'RequestBody'
  parameters: {
    operator: 'Contains'
    negateCondition: false
    matchValues: [
      'ERROR'
    ]
    transforms: [
      'Uppercase'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestBodyConditionParameters'
  }
}
```

::: zone-end

---

## Request file name

The **request file name** match condition identifies requests that include the specified file name in the request URL. You can specify multiple values to match, which will be combined using OR logic.

### Properties

| Property | Supported values |
|-|-|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **request file name** match condition. |
| Value | One or more string or integer values representing the value of the request file name to match. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all requests where the request file name is `media.mp4`. We transform the file name to lowercase before evaluating the match, so `MEDIA.MP4` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/request-file-name.png" alt-text="Portal screenshot showing request file name match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "UrlFileName",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "media.mp4"
    ],
    "transforms": [
      "Lowercase"
    ],
    "typeName": "DeliveryRuleUrlFilenameConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "UrlFileName",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "media.mp4"
    ],
    "transforms": [
      "Lowercase"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlFilenameConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'UrlFileName'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'media.mp4'
    ]
    transforms: [
      'Lowercase'
    ]
    typeName: 'DeliveryRuleUrlFilenameConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'UrlFileName'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'media.mp4'
    ]
    transforms: [
      'Lowercase'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlFilenameConditionParameters'
  }
}
```

::: zone-end

---

## Request file extension

The **request file extension** match condition identifies requests that include the specified file extension in the file name in the request URL. You can specify multiple values to match, which will be combined using OR logic.

> [!NOTE]
> Don't include a leading period. For example, use `html` instead of `.html`.

### Properties

| Property | Supported values |
|-|-|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **request file extension** match condition. |
| Value | One or more string or integer values representing the value of the request file extension to match. Don't include a leading period. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all requests where the request file extension is `pdf` or `docx`. We transform the request file extension to lowercase before evaluating the match, so `PDF`, `DocX`, and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/request-file-extension.png" alt-text="Portal screenshot showing request file extension match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "UrlFileExtension",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "pdf",
      "docx"
    ],
    "transforms": [
      "Lowercase"
    ],
    "typeName": "DeliveryRuleUrlFileExtensionMatchConditionParameters"
  }
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "UrlFileExtension",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "pdf",
      "docx"
    ],
    "transforms": [
      "Lowercase"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlFileExtensionMatchConditionParameters"
  }
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'UrlFileExtension'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'pdf'
      'docx'
    ]
    transforms: [
      'Lowercase'
    ]
    typeName: 'DeliveryRuleUrlFileExtensionMatchConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'UrlFileExtension'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'pdf'
      'docx'
    ]
    transforms: [
      'Lowercase'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlFileExtensionMatchConditionParameters'
  }
}
```

::: zone-end


---

## Request header

The **request header** match condition identifies requests that include a specific header in the request. You can use this match condition to check if a header exists or to check if the header matches a specified value. You can specify multiple values to match, which will be combined using OR logic.

### Properties

| Property | Supported values |
|-|-|
| Header name | A string value representing the name of the POST argument. |
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | One or more string or integer values representing the value of the request header to match. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all requests where the request contains a header named `MyCustomHeader`, regardless of its value.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/request-header.png" alt-text="Portal screenshot showing request header match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "RequestHeader",
  "parameters": {
    "selector": "MyCustomHeader",
    "operator": "Any",
    "negateCondition": false,
    "typeName": "DeliveryRuleRequestHeaderConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "RequestHeader",
  "parameters": {
    "selector": "MyCustomHeader",
    "operator": "Any",
    "negateCondition": false,
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestHeaderConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'RequestHeader'
  parameters: {
    selector: 'MyCustomHeader',
    operator: 'Any'
    negateCondition: false
    typeName: 'DeliveryRuleRequestHeaderConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'RequestHeader'
  parameters: {
    selector: 'MyCustomHeader',
    operator: 'Any'
    negateCondition: false
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestHeaderConditionParameters'
  }
}
```

::: zone-end

---

## Request method

The **request method** match condition identifies requests that use the specified HTTP request method. You can specify multiple values to match, which will be combined using OR logic.

### Properties

| Property | Supported values |
|-|-|
| Operator | <ul><li>In the Azure portal: `Equal`, `Not Equal`</li><li>In ARM templates: `Equal`; use the `negateCondition` property to specify _Not Equal_</li></ul> |
| Request method | One or more HTTP methods from: `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`, `TRACE`. If multiple values are specified, they're evaluated using OR logic. |

### Example

In this example, we match all requests where the request uses the `DELETE` method.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/request-method.png" alt-text="Portal screenshot showing request method match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "RequestMethod",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "DELETE"
    ],
    "typeName": "DeliveryRuleRequestMethodConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "RequestMethod",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "DELETE"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestMethodConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'RequestMethod'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'DELETE'
    ]
    typeName: 'DeliveryRuleRequestMethodConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'RequestMethod'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'DELETE'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestMethodConditionParameters'
  }
}
```

::: zone-end

---

## Request path

The **request path** match condition identifies requests that include the specified path in the request URL. You can specify multiple values to match, which will be combined using OR logic.

> [!NOTE]
> The path is the part of the URL after the hostname and a slash. For example, in the URL `https://www.contoso.com/files/secure/file1.pdf`, the path is `files/secure/file1.pdf`.

### Properties

::: zone pivot="front-door-standard-premium"

| Property | Supported values |
|-|-|
| Operator | <ul><li>All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **request path** match condition.</li><li>**Wildcard**: Matches when the request path matches a wildcard expression. A wildcard expression can include the `*` character to match zero or more characters within the path. For example, the wildcard expression `files/customer*/file.pdf` matches the paths `files/customer1/file.pdf`, `files/customer109/file.pdf`, and `files/customer/file.pdf`, but does not match `files/customer2/anotherfile.pdf`.<ul><li>In the Azure portal: `Wildcards`, `Not Wildcards`</li><li>In ARM templates: `Wildcard`; use the `negateCondition` property to specify _Not Wildcards_</li></ul></li></ul> |
| Value | One or more string or integer values representing the value of the request path to match. If you specify a leading slash, it's ignored. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

::: zone-end

::: zone pivot="front-door-classic"

| Property | Supported values |
|-|-|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **request path** match condition. |
| Value | One or more string or integer values representing the value of the request path to match. If you specify a leading slash, it's ignored. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

::: zone-end

### Example

In this example, we match all requests where the request file path begins with `files/secure/`. We transform the request file extension to lowercase before evaluating the match, so requests to `files/SECURE/` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/request-path.png" alt-text="Portal screenshot showing request path match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "UrlPath",
  "parameters": {
    "operator": "BeginsWith",
    "negateCondition": false,
    "matchValues": [
      "files/secure/"
    ],
    "transforms": [
      "Lowercase"
    ],
    "typeName": "DeliveryRuleUrlPathMatchConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "UrlPath",
  "parameters": {
    "operator": "BeginsWith",
    "negateCondition": false,
    "matchValues": [
      "files/secure/"
    ],
    "transforms": [
      "Lowercase"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlPathMatchConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'UrlPath'
  parameters: {
    operator: 'BeginsWith'
    negateCondition: false
    matchValues: [
      'files/secure/'
    ]
    transforms: [
      'Lowercase'
    ]
    typeName: 'DeliveryRuleUrlPathMatchConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'UrlPath'
  parameters: {
    operator: 'BeginsWith'
    negateCondition: false
    matchValues: [
      'files/secure/'
    ]
    transforms: [
      'Lowercase'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlPathMatchConditionParameters'
  }
}
```

::: zone-end

---

## Request protocol

The **request protocol** match condition identifies requests that use the specified protocol (HTTP or HTTPS).

> [!NOTE]
> *Protocol* is sometimes also called *scheme*.

### Properties

| Property | Supported values |
|-|-|
| Operator | <ul><li>In the Azure portal: `Equal`, `Not Equal`</li><li>In ARM templates: `Equal`; use the `negateCondition` property to specify _Not Equal_</li></ul> |
| Request method | `HTTP`, `HTTPS` |

### Example

In this example, we match all requests where the request uses the `HTTP` protocol.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/request-protocol.png" alt-text="Portal screenshot showing request protocol match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "RequestScheme",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "HTTP"
    ],
    "typeName": "DeliveryRuleRequestSchemeConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "RequestScheme",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "HTTP"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestSchemeConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'RequestScheme'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'HTTP'
    ]
    typeName: 'DeliveryRuleRequestSchemeConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'RequestScheme'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'HTTP'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestSchemeConditionParameters'
  }
}
```

::: zone-end

---

## Request URL

Identifies requests that match the specified URL. The entire URL is evaluated, including the protocol and query string, but not the fragment. You can specify multiple values to match, which will be combined using OR logic.

> [!TIP]
> When you use this rule condition, be sure to include the protocol and a trailing forward slash `/`. For example, use `https://www.contoso.com/` instead of just `www.contoso.com`.

### Properties

| Property | Supported values |
|-|-|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **request URL** match condition. |
| Value | One or more string or integer values representing the value of the request URL to match. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all requests where the request URL begins with `https://api.contoso.com/customers/123`. We transform the request file extension to lowercase before evaluating the match, so requests to `https://api.contoso.com/Customers/123` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/request-url.png" alt-text="Portal screenshot showing request URL match condition.":::

# [JSON](#tab/json)

::: zone pivot="front-door-standard-premium"

```json
{
  "name": "RequestUri",
  "parameters": {
    "operator": "BeginsWith",
    "negateCondition": false,
    "matchValues": [
      "https://api.contoso.com/customers/123"
    ],
    "transforms": [
      "Lowercase"
    ],
    "typeName": "DeliveryRuleRequestUriConditionParameters"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "name": "RequestUri",
  "parameters": {
    "operator": "BeginsWith",
    "negateCondition": false,
    "matchValues": [
      "https://api.contoso.com/customers/123"
    ],
    "transforms": [
      "Lowercase"
    ],
    "@odata.type": "#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestUriConditionParameters"
  }
}
```

::: zone-end

# [Bicep](#tab/bicep)

::: zone pivot="front-door-standard-premium"

```bicep
{
  name: 'RequestUri'
  parameters: {
    operator: 'BeginsWith'
    negateCondition: false
    matchValues: [
      'https://api.contoso.com/customers/123'
    ]
    transforms: [
      'Lowercase'
    ]
    typeName: 'DeliveryRuleRequestUriConditionParameters'
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```bicep
{
  name: 'RequestUri'
  parameters: {
    operator: 'BeginsWith'
    negateCondition: false
    matchValues: [
      'https://api.contoso.com/customers/123'
    ]
    transforms: [
      'Lowercase'
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestUriConditionParameters'
  }
}
```

::: zone-end

---

::: zone pivot="front-door-standard-premium"

## Host name

The **host name** match condition identifies requests based on the specified hostname in the request from the client. The match condition uses the `Host` header value to evaluate the hostname. You can specify multiple values to match, which will be combined using OR logic. 

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **host name** match condition. |
| Value | One or more string values representing the value of request hostname to match. If multiple values are specified, they're evaluated using OR logic. |
| Case transform | Any case transform from the [standard string transforms list](#string-transform-list). |

### Example

In this example, we match all requests with a `Host` header that ends with `contoso.com`.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/host-name.png" alt-text="Portal screenshot showing host name match condition.":::

# [JSON](#tab/json)

```json
{
  "name": "HostName",
  "parameters": {
    "operator": "EndsWith",
    "negateCondition": false,
    "matchValues": [
      "contoso.com"
    ],
    "transforms": [],
    "typeName": "DeliveryRuleHostNameConditionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'HostName'
  parameters: {
    operator: 'EndsWith'
    negateCondition: false
    matchValues: [
      'contoso.com'
    ]
    transforms: []
    typeName: 'DeliveryRuleHostNameConditionParameters'
  }
}
```

---

## SSL protocol

The **SSL protocol** match condition identifies requests based on the SSL protocol of an established TLS connection. You can specify multiple values to match, which will be combined using OR logic.

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | <ul><li>In the Azure portal: `Equal`, `Not Equal`</li><li>In ARM templates: `Equal`; use the `negateCondition` property to specify _Not Equal_</li></ul> |
| SSL protocol | <ul><li>In the Azure portal: `1.0`, `1.1`, `1.2`</li><li>In ARM templates: `TLSv1`, `TLSv1.1`, `TLSv1.2`</li></ul> |

### Example

In this example, we match all requests that use the TLS 1.2 protocol.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/ssl-protocol.png" alt-text="Portal screenshot showing SSL protocol match condition.":::

# [JSON](#tab/json)

```json
{
  "name": "SslProtocol",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "TLSv1.2"
    ],
    "typeName": "DeliveryRuleSslProtocolConditionParameters"
  }
},
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'SslProtocol'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'TLSv1.2'
    ]
    typeName: 'DeliveryRuleSslProtocolConditionParameters'
  }
}
```

---

## Socket address

The **socket address** match condition identifies requests based on the IP address of the direct connection to Azure Front Door edge. You can specify multiple values to match, which will be combined using OR logic.

> [!NOTE]
> If the client used an HTTP proxy or a load balancer to send the request, the socket address is the IP address of the proxy or load balancer.
>
> Use the [remote address](#remote-address) match condition if you need to match based on the client's original IP address. 

* Use CIDR notation when specifying IP address blocks. This means that the syntax for an IP address block is the base IP address followed by a forward slash and the prefix size. For example:
    * **IPv4 example**: `5.5.5.64/26` matches any requests that arrive from addresses 5.5.5.64 through 5.5.5.127.
    * **IPv6 example**: `1:2:3:/48` matches any requests that arrive from addresses 1:2:3:0:0:0:0:0 through 1:2:3: ffff:ffff:ffff:ffff:ffff.
* When you specify multiple IP addresses and IP address blocks, 'OR' logic is applied.
    * **IPv4 example**: if you add two IP addresses `1.2.3.4` and `10.20.30.40`, the condition is matched for any requests that arrive from either address 1.2.3.4 or 10.20.30.40.
    * **IPv6 example**: if you add two IP addresses `1:2:3:4:5:6:7:8` and `10:20:30:40:50:60:70:80`, the condition is matched for any requests that arrive from either address 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | <ul><li>In the Azure portal: `IP Match`, `Not IP Match`</li><li>In ARM templates: `IPMatch`; use the `negateCondition` property to specify _Not IP Match_</li></ul> |
| Value | Specify one or more IP address ranges. If multiple IP address ranges are specified, they're evaluated using OR logic. |

### Example

In this example, we match all requests from IP addresses in the range 5.5.5.64/26.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/socket-address.png" alt-text="Portal screenshot showing socket address match condition.":::

# [JSON](#tab/json)

```json
{
  "name": "SocketAddr",
  "parameters": {
    "operator": "IPMatch",
    "negateCondition": false,
    "matchValues": [
      "5.5.5.64/26"
    ],
    "typeName": "DeliveryRuleSocketAddrConditionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'SocketAddr'
  parameters: {
    operator: 'IPMatch'
    negateCondition: false
    matchValues: [
      '5.5.5.64/26'
    ]
    typeName: 'DeliveryRuleSocketAddrConditionParameters'
  }
}
```

---

## Client port

The **client port** match condition identifies requests based on the TCP port of the client that made the request. You can specify multiple values to match, which will be combined using OR logic. 

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **client port** match condition. |
| Value | One or more port numbers, expressed as integers. If multiple values are specified, they're evaluated using OR logic. |

### Example

In this example, we match all requests with a client port of 1234.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/client-port.png" alt-text="Portal screenshot showing client port match condition.":::

# [JSON](#tab/json)

```json
{
  "name": "ClientPort",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "1111"
    ],
    "typeName": "DeliveryRuleClientPortConditionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'ClientPort'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      '1111'
    ]
    typeName: 'DeliveryRuleClientPortConditionParameters'
  }
}
```

---

## Server port

The **server port** match condition identifies requests based on the TCP port of the Azure Front Door server that accepted the request. The port must be 80 or 443. You can specify multiple values to match, which will be combined using OR logic. 

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | All operators from the [standard operator list](#operator-list) are supported. However, the **Any** match condition matches every request, and the **Not Any** match condition doesn't match any request, when used with the **server port** match condition. |
| Value | A port number, which must be either 80 or 443. If multiple values are specified, they're evaluated using OR logic. |

### Example

In this example, we match all requests with a server port of 443.

# [Portal](#tab/portal)

:::image type="content" source="./media/rules-match-conditions/server-port.png" alt-text="Portal screenshot showing server port match condition.":::

# [JSON](#tab/json)

```json
{
  "name": "ServerPort",
  "parameters": {
    "operator": "Equal",
    "negateCondition": false,
    "matchValues": [
      "443"
    ],
    "typeName": "DeliveryRuleServerPortConditionParameters"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  name: 'ServerPort'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      '443'
    ]
    typeName: 'DeliveryRuleServerPortConditionParameters'
  }
}
```

---

::: zone-end

## Operator list

For rules that accept values from the standard operator list, the following operators are valid:

::: zone pivot="front-door-classic"

| Operator                   | Description                                                                                                                    | ARM template support                                            |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| Any                        | Matches when there's any value, regardless of what it is.                                                                     | `operator`: `Any`                                               |
| Equal                      | Matches when the value exactly matches the specified string.                                                                   | `operator`: `Equal`                                             |
| Contains                   | Matches when the value contains the specified string.                                                                          | `operator`: `Contains`                                          |
| Less Than                  | Matches when the length of the value is less than the specified integer.                                                       | `operator`: `LessThan`                                          |
| Greater Than               | Matches when the length of the value is greater than the specified integer.                                                    | `operator`: `GreaterThan`                                       |
| Less Than or Equal         | Matches when the length of the value is less than or equal to the specified integer.                                           | `operator`: `LessThanOrEqual`                                   |
| Greater Than or Equal      | Matches when the length of the value is greater than or equal to the specified integer.                                        | `operator`: `GreaterThanOrEqual`                                |
| Begins With                | Matches when the value begins with the specified string.                                                                       | `operator`: `BeginsWith`                                        |
| Ends With                  | Matches when the value ends with the specified string.                                                                         | `operator`: `EndsWith`                                          |
| Not Any                    | Matches when there's no value.                                                                                                | `operator`: `Any` and `negateCondition` : `true`                |
| Not Equal                  | Matches when the value doesn't match the specified string.                                                                    | `operator`: `Equal` and `negateCondition` : `true`              |
| Not Contains               | Matches when the value doesn't contain the specified string.                                                                  | `operator`: `Contains` and `negateCondition` : `true`           |
| Not Less Than              | Matches when the length of the value isn't less than the specified integer.                                                   | `operator`: `LessThan` and `negateCondition` : `true`           |
| Not Greater Than           | Matches when the length of the value isn't greater than the specified integer.                                                | `operator`: `GreaterThan` and `negateCondition` : `true`        |
| Not Less Than or Equal     | Matches when the length of the value isn't less than or equal to the specified integer.                                       | `operator`: `LessThanOrEqual` and `negateCondition` : `true`    |
| Not Greater Than or Equals | Matches when the length of the value isn't greater than or equal to the specified integer.                                    | `operator`: `GreaterThanOrEqual` and `negateCondition` : `true` |
| Not Begins With            | Matches when the value doesn't begin with the specified string.                                                               | `operator`: `BeginsWith` and `negateCondition` : `true`         |
| Not Ends With              | Matches when the value doesn't end with the specified string.                                                                 | `operator`: `EndsWith` and `negateCondition` : `true`           |

::: zone-end

::: zone pivot="front-door-standard-premium"

| Operator                   | Description                                                                                                                    | ARM template support                                            |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| Any                        | Matches when there's any value, regardless of what it is.                                                                     | `operator`: `Any`                                               |
| Equal                      | Matches when the value exactly matches the specified string.                                                                   | `operator`: `Equal`                                             |
| Contains                   | Matches when the value contains the specified string.                                                                          | `operator`: `Contains`                                          |
| Less Than                  | Matches when the length of the value is less than the specified integer.                                                       | `operator`: `LessThan`                                          |
| Greater Than               | Matches when the length of the value is greater than the specified integer.                                                    | `operator`: `GreaterThan`                                       |
| Less Than or Equal         | Matches when the length of the value is less than or equal to the specified integer.                                           | `operator`: `LessThanOrEqual`                                   |
| Greater Than or Equal      | Matches when the length of the value is greater than or equal to the specified integer.                                        | `operator`: `GreaterThanOrEqual`                                |
| Begins With                | Matches when the value begins with the specified string.                                                                       | `operator`: `BeginsWith`                                        |
| Ends With                  | Matches when the value ends with the specified string.                                                                         | `operator`: `EndsWith`                                          |
| RegEx                      | Matches when the value matches the specified regular expression. [See below for further details.](#regular-expressions)        | `operator`: `RegEx`                                             |
| Not Any                    | Matches when there's no value.                                                                                                | `operator`: `Any` and `negateCondition` : `true`                |
| Not Equal                  | Matches when the value doesn't match the specified string.                                                                    | `operator`: `Equal` and `negateCondition` : `true`              |
| Not Contains               | Matches when the value doesn't contain the specified string.                                                                  | `operator`: `Contains` and `negateCondition` : `true`           |
| Not Less Than              | Matches when the length of the value isn't less than the specified integer.                                                   | `operator`: `LessThan` and `negateCondition` : `true`           |
| Not Greater Than           | Matches when the length of the value isn't greater than the specified integer.                                                | `operator`: `GreaterThan` and `negateCondition` : `true`        |
| Not Less Than or Equal     | Matches when the length of the value isn't less than or equal to the specified integer.                                       | `operator`: `LessThanOrEqual` and `negateCondition` : `true`    |
| Not Greater Than or Equals | Matches when the length of the value isn't greater than or equal to the specified integer.                                    | `operator`: `GreaterThanOrEqual` and `negateCondition` : `true` |
| Not Begins With            | Matches when the value doesn't begin with the specified string.                                                               | `operator`: `BeginsWith` and `negateCondition` : `true`         |
| Not Ends With              | Matches when the value doesn't end with the specified string.                                                                 | `operator`: `EndsWith` and `negateCondition` : `true`           |
| Not RegEx                  | Matches when the value doesn't match the specified regular expression. [See below for further details.](#regular-expressions) | `operator`: `RegEx` and `negateCondition` : `true`              |

::: zone-end

> [!TIP]
> For numeric operators like *Less than* and *Greater than or equals*, the comparison used is based on length. The value in the match condition should be an integer that specifies the length you want to compare.

### Regular expressions

Regular expressions don't support the following operations:

* Backreferences and capturing subexpressions.
* Arbitrary zero-width assertions.
* Subroutine references and recursive patterns.
* Conditional patterns.
* Backtracking control verbs.
* The `\C` single-byte directive.
* The `\R` newline match directive.
* The `\K` start of match reset directive.
* Callouts and embedded code.
* Atomic grouping and possessive quantifiers.

## String transform list

For rules that can transform strings, the following transforms are valid:

| Transform | Description | ARM template support |
|-|-|-|
| To lowercase | Converts the string to the lowercase representation. | `Lowercase` |
| To uppercase | Converts the string to the uppercase representation. | `Uppercase` |
| Trim | Trims leading and trailing whitespace from the string. | `Trim` |
| Remove nulls | Removes null values from the string. | `RemoveNulls` |
| URL encode | URL-encodes the string. | `UrlEncode` |
| URL decode | URL-decodes the string. | `UrlDecode` |

## Next steps

::: zone pivot="front-door-classic"

* Learn more about Azure Front Door (classic) [Rules Engine](front-door-rules-engine.md)
* Learn how to [configure your first Rules Engine](front-door-tutorial-rules-engine.md). 
* Learn more about [Rules actions](front-door-rules-engine-actions.md)

::: zone-end

::: zone pivot="front-door-standard-premium"

* Learn more about Azure Front Door [Rule Set](front-door-rules-engine.md).
* Learn how to [configure your first Rule Set](standard-premium/how-to-configure-rule-set.md).
* Learn more about [Rule actions](front-door-rules-engine-actions.md).

::: zone-end
