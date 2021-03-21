---
title: Configure Azure Front Door Standard/Premium rule set match conditions
description: This article provides a list of the various match conditions available with Azure Front Door Standard/Premium rule set. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 02/18/2021
ms.author: yuajia
---

# Azure Front Door Standard/Premium (Preview) Rule Set match conditions

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

In Azure Front Door Standard/Premium [Rule Set](concept-rule-set.md), a rule consists of zero or more match conditions and an action. This article provides detailed descriptions of the match conditions you can use in Azure Front Door Standard/Premium Rule Set.

The first part of a rule is a match condition or set of match conditions. A rule can consist of up to 10 match conditions. A match condition identifies specific types of requests for which defined actions are done. If you use multiple match conditions, the match conditions are grouped together by using AND logic. For all match conditions that support multiple values, OR logic is used.

You can use a match condition to:

* Filter requests based on a specific IP address, country, or region.
* Filter requests by header information.
* Filter requests from mobile devices or desktop devices.
* Filter requests from request file name and file extension.
* Filter requests from request URL, protocol, path, query string, post args, etc.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Match conditions

- [Device type](#IsDevice) - Identifies requests that have been made from a mobile device or desktop device.
- [Post args](#PostArgs) - Identifies requests based on the arguments provided within a POST body.
- [Query string](#QueryString) - Identifies requests that contain a specific query string.
- [Remote address](#RemoteAddress) - Identifies requests based on the requester's location or IP address.
- [Request body](#RequestBody) - Identifies requests based on specific text that appears in the body of the request.
- [Request file name](#UrlFileName) - Identifies requests that include the specified file name in the request URL.
- [Request file extension](#UrlFileExtension) - Identifies requests that include the specified file extension in the file name in the request URL.
- [Request header](#RequestHeader) - Identifies requests that include a specific header in the request.
- [Request method](#RequestMethod) - Identifies requests that use the specified HTTP request method.
- [Request path](#UrlPath) - Identifies requests that include the specified path in the request URL.
- [Request protocol](#RequestScheme) - Identifies requests that use the specified protocol (HTTP or HTTPS).
- [Request URL](#RequestUrl) - Identifies requests that match the specified URL. The entire URL is evaluated.

## <a name="IsDevice"></a> Device type

Use the **device type** match condition to identify requests that have been made from a mobile device or desktop device.  

### Properties

| Property | Supported values |
|-------|------------------|
| Operator | `Equal`, `Not Equal` |
| Value | `Mobile`, `Desktop` |

### Example

In this example, we match all requests that have been detected as coming from a mobile device.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/device-type.png" alt-text="Device type match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name="PostArgs"></a> Post args

Use the **post args** match condition to identify requests based on the arguments provided within a POST body. A single match condition matches a single argument from the POST body. You can specify multiple values for this condition, and they are evaluated using OR logic.

<!-- TODO Does this only work with certain content types? -->

### Properties

| Property | Supported values |
|-|-|
| Post args | A string value representing the name of the POST argument. |
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | A string or integer value representing the value of the POST argument. If multiple values are provided, they are combined using OR logic. |
| Case transform | `Lowercase`, `Uppercase` |

### Example

In this example, we match all POST requests where a `customerName` argument is provided in the request body, and where the value of `customerName` begins with the letter `J` or 'K'. We use a case transform to convert the input values to uppercase so that values beginning with `J`, `j`, `K`, and `k` are all matched.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/post-args.png" alt-text="Post args match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---


## <a name="QueryString"></a> Query string

Use the **query string** match condition to identify requests that contain a specific query string. The entire query string is matched as a single string. You can specify multiple values to match, and these are combined using OR logic.

### Properties

| Property | Supported values |
|-|-|
| Operator | Any operator from the [standard operator list](#operator-list). |
| Query string | A set of values representing the possible query string values to match. If multiple values are provided, they are combined using OR logic. |
| Case transform | `Lowercase`, `Uppercase` |

### Example

In this example, we match all requests where the query string contains the string `language=en-US`. We want the match condition to be case-sensitive, so we don't perform any case transforms.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/query-string.png" alt-text="Query string match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name="RemoteAddress"></a> Remote address

<!-- TODO how are unknown addresses handled? -->

The **remote address** match condition identifies requests based on the requester's location or IP address.

* Use CIDR notation when specifying IP address blocks. This means that the syntax for an IP address block is the base IP address followed by a forward slash and the prefix size. For example:
    * **IPv4 example**: *5.5.5.64/26* matches any requests that arrive from addresses 5.5.5.64 through 5.5.5.127.
    * **IPv6 example**: *1:2:3:/48* matches any requests that arrive from addresses 1:2:3:0:0:0:0:0 through 1:2:3: ffff:ffff:ffff:ffff:ffff.
* When you specify multiple IP addresses and IP address blocks, 'OR' logic is applied.
    * **IPv4 example**: if you add two IP addresses *1.2.3.4* and *10.20.30.40*, the condition is matched if any requests that arrive from either address 1.2.3.4 or 10.20.30.40.
    * **IPv6 example**:  if you add two IP addresses *1:2:3:4:5:6:7:8* and *10:20:30:40:50:60:70:80*, the condition is matched if any requests that arrive from either address 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.

### Properties

| Property | Supported values |
|-|-|
| Operator | `Geo Match`, `Geo Not Match`, `IP Match`, or `IP Not Match` |
| Value | <ul><li>For the `IP Match` or `IP Not Match` operators, specify one or more IP address ranges. These will be combined using OR logic.</li><li>For the `Geo Match` or `Geo Not Match` operators, specify one or more locations using their country code.</li></ul> |

### Example

In this example, we match all requests where the request has not originated from the United States.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/remote-address.png" alt-text="Remote address match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name="RequestBody"></a> Request body

The **request body** match condition identifies requests based on specific text that appears in the body of the request.

<!-- TODO any requirements for body max length, encoding, etc? -->

### Properties

| Property | Supported values |
|-|-|
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | A string or integer value representing the value of the request body. If multiple values are provided, they are combined using OR logic. |
| Case transform | `Lowercase`, `Uppercase` |

### Example

In this example, we match all requests where the request body contains the string `ERROR`. We transform the request body to uppercase before performing the match, so `error` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/request-body.png" alt-text="Request body match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name="UrlFileName"></a> Request file name

The **request file name** match condition identifies requests that include the specified file name in the request URL.

### Properties

| Property | Supported values |
|-|-|
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | A string or integer value representing the value of the request file name. If multiple values are provided, they are combined using OR logic. |
| Case transform | `Lowercase`, `Uppercase` |

### Example

In this example, we match all requests where the request file name is `media.mp4`. We transform the file name to lowercase before performing the match, so `MEDIA.MP4` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/request-file-name.png" alt-text="Request file name match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name="UrlFileExtension"></a> Request file extension

The **request file extension** match condition identifies requests that include the specified file extension in the file name in the request URL.

### Properties

| Property | Supported values |
|-|-|
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | A string or integer value representing the value of the request file extension. Don't include a leading period; for example, use `html` instead of `.html`. If multiple values are provided, they are combined using OR logic. |
| Case transform | `Lowercase`, `Uppercase` |

### Example

In this example, we match all requests where the request file extension is `.pdf` or `.docx`. We transform the request file extension to lowercase before performing the match, so `.PDF`, `.DocX` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/request-file-extension.png" alt-text="Request file extension match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name="RequestHeader"></a> Request header

The **request header** match condition identifies requests that include a specific header in the request. You can use this match condition to check if a header exists regardless of its value, or to check if the header matches a specified value.

### Properties

| Property | Supported values |
|-|-|
| Header name | A string value representing the name of the POST argument. |
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | A string or integer value representing the value of the request header. If multiple values are provided, they are combined using OR logic. |
| Case transform | `Lowercase`, `Uppercase` |

### Example

In this example, we match all requests where the request contains a header named `MyCustomHeader`, regardless of its value.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/request-header.png" alt-text="Request header match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name="RequestMethod"></a> Request method

The **request method** match condition identifies requests that use the specified HTTP request method.

<!-- TODO check rules about combining this match condition with actions - I got this error when I tried to use it with the 'URL redirect' action: "Error: The delivery policy rule is not valid because the rule has a RequestMethod Condition and UrlRedirect Action, which would cause infinite redirects." -->

> [!NOTE]
> Only the GET request method can generate cached content in Azure Front Door. All other request methods are proxied through the network.

<!-- TODO check why the above is here - it's useful info but I'm not sure it belongs here; maybe on the caching page instead -->

### Properties

| Property | Supported values |
|-|-|
| Operator | `Equal`, `NotEqual` |
| Request method | One or more HTTP methods from: `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`, `TRACE`. If multiple values are provided, they are combined using OR logic. |

### Example

In this example, we match all requests where the request uses the `DELETE` method.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/request-method.png" alt-text="Request method match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

```bicep
{
  name: 'RequestMethod'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'DELETE
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestMethodConditionParameters'
  }
}
```

---

## <a name="UrlPath"></a> Request path

The **request path** match condition identifies requests that include the specified path in the request URL. The path is the part of the URL after the hostname. For example, in the URL `https://www.contoso.com/files/secure/file1.pdf`, the path is `files/secure/file1.pdf`.

> [!TIP]
> Make sure not to include a slash at the start of the path. For example, use `files/secure` instead of `/files/secure`.

### Properties

| Property | Supported values |
|-|-|
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | A string or integer value representing the value of the request path. If multiple values are provided, they are combined using OR logic. |
| Case transform | `Lowercase`, `Uppercase` |

### Example

In this example, we match all requests where the request file path begins with `files/secure/`. We transform the request file extension to lowercase before performing the match, so requests to `files/SECURE/` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/request-path.png" alt-text="Request path match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name="RequestScheme"></a> Request protocol

The **request protocol** match condition identifies requests that use the specified protocol (HTTP or HTTPS).

> [!NOTE]
> *Protocol* is sometimes also called *scheme*.

### Properties

| Property | Supported values |
|-|-|
| Operator | `Equal`, `NotEqual` |
| Request method | `HTTP`, `HTTPS` |

### Example

In this example, we match all requests where the request uses the `HTTP` protocol.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/request-protocol.png" alt-text="Request protocol match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

```bicep
{
  name: 'RequestScheme'
  parameters: {
    operator: 'Equal'
    negateCondition: false
    matchValues: [
      'HTTP
    ]
    '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestSchemeConditionParameters'
  }
}
```

---

## <a name="RequestUrl"></a> Request URL

Identifies requests that match the specified URL. The entire URL is evaluated.

> [!TIP]
> When you use this rule condition, be sure to include the protocol. For example, use `https://www.contoso.com` instead of just `www.contoso.com`.

### Properties

| Property | Supported values |
|-|-|
| Operator | Any operator from the [standard operator list](#operator-list). |
| Value | A string or integer value representing the value of the request URL. If multiple values are provided, they are combined using OR logic. |
| Case transform | `Lowercase`, `Uppercase` |

### Example

In this example, we match all requests where the request URL begins with `https://api.contoso.com/customers/123`. We transform the request file extension to lowercase before performing the match, so requests to `https://api.contoso.com/Customers/123` and other case variations will also trigger this match condition.

# [Portal](#tab/portal)

:::image type="content" source="../media/concept-rule-set-match-conditions/request-url.png" alt-text="Request URL match condition":::

# [JSON](#tab/json)

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

# [Bicep](#tab/bicep)

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

---

## <a name = "operator-list"></a> Operator list

For rules that accept values from the standard operator list, the following operators are valid:

* Any
* Equals
* Contains
* Begins with
* Ends with
* Less than
* Less than or equals
* Greater than
* Greater than or equals
* Not any
* Not contains
* Not begins with
* Not ends with
* Not less than
* Not less than or equals
* Not greater than
* Not greater than or equals
* Regular Expression

For numeric operators like *Less than* and *Greater than or equals*, the comparison used is based on length. The value in the match condition should be an integer that equals the length you want to compare.

## Regular Expression

Regex doesn't support the following operations:

* Backreferences and capturing subexpressions
* Arbitrary zero-width assertions
* Subroutine references and recursive patterns
* Conditional patterns
* Backtracking control verbs
* The \C single-byte directive
* The \R newline match directive
* The \K start of match reset directive
* Callouts and embedded code
* Atomic grouping and possessive quantifiers

## Next steps

* Learn more about [Rule Set](concept-rule-set.md).
* Learn how to [configure your first Rules Set](how-to-configure-rule-set.md).
* Learn more about [Rule Set actions](concept-rule-set-actions.md).
