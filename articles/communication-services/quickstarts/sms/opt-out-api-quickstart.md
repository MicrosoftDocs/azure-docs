---
title: Send OptOut API requests with API (HMAC)
description: Learn how to send OptOut API requests with API (HMAC).
services: azure-communication-services
author: besh2014
product manager: dbasantes
ms.service: azure-communication-services
ms.author: dbasantes
ms.subservice: sms
ms.date: 12/04/2024
ms.topic: quickstart
zone_pivot_groups: acs-js-csharp-java
---

# Send OptOut API requests with API (HMAC)

This article describes how to enable opt-out management for your Azure Communication Services resource using hash message authentication code (HMAC) based authentication.

## Quickstart: Send OptOut API requests with API (HMAC)
Sending an Opt-out API request is similar to SMS as described in the [Azure Communication Services Postman Tutorial](../../tutorials/postman-tutorial.md) with the difference of endpoints for OptOut Actions (Add, Remove, or Check) and body. The request body has the same structure for all actions, while the response content slightly differs.

### Endpoints

| Action | Endpoint |
|--------|----------|
| Add    | `{{endpoint}}/sms/optouts:add?api-version=2024-12-10-preview` |
| Remove | `{{endpoint}}/sms/optouts:remove?api-version=2024-12-10-preview` |
| Check  | `{{endpoint}}/sms/optouts:check?api-version=2024-12-10-preview` |

Here are some examples in different languages.

### Sample request

#### Request headers

| Header                | Value                                                           |
|-----------------------|-----------------------------------------------------------------|
| Content-Type          | application/json                                                |
| x-ms-date             | Thu, 10 Aug 2023 12:39:55 GMT                                   |
| x-ms-content-sha256   | JKUqoPANwVA55u/NOCsS0Awa4cYrKKNtBwUqoaqrob0=                    |
| Authorization         | HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=IMbd3tE3nOgEkeUQGng6oQew5aEcrZJQqHkyq8qsbLg= |

#### Request body

```json
{
    "from": "+15551234567",
    "recipients": [
        {
            "to": "+15550112233"
        },
        {
            "to": "+15550112234"
        }
    ]
}
```

### Sample response
In general, response contents are the same for all actions and contain the success or failure `HttpStatusCode` per recipient. The only difference is that the `Check` action, which also returns the `isOptedOut` flag.

#### Response status
- 200 Ok

#### Add OptOut action response body

```json
{
    "value": [
        {
            "to": "+15550112233",
            "httpStatusCode": 200
        },
        {
            "to": "+15550112234",
            "httpStatusCode": 200
        }
    ]
}
```

#### Remove OptOut action response body
```json
{
    "value": [
        {
            "to": "+15550112233",
            "httpStatusCode": 200
        },
        {
            "to": "+15550112234",
            "httpStatusCode": 200
        }
    ]
}
```

#### Check OptOut action response body
```json
{
    "value": [
        {
            "to": "+15550112233",
            "httpStatusCode": 200,
            "isOptedOut": true
        },
        {
            "to": "+15550112234",
            "httpStatusCode": 200,
            "isOptedOut": false
        }
    ]
}
```

## Sample code

::: zone pivot="programming-language-csharp"
[!INCLUDE [Use Opt-out API with .NET SDK](./includes/sms-opt-out-api-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Use Opt-out API with JavaScript SDK](./includes/sms-opt-out-api-javascript.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Use Opt-out API with Java SDK](./includes/sms-opt-out-api-java.md)]
::: zone-end


## Next steps

In this quickstart, you learned how to send opt-out requests.

> [!div class="nextstepaction"]
> [Send an SMS message](./send.md)

> [!div class="nextstepaction"]
> [Receive and reply to SMS](./receive-sms.md)

> [!div class="nextstepaction"]
> [Enable SMS analytics](../../concepts/analytics/insights/sms-insights.md)

> [!div class="nextstepaction"]
> [Phone number types](../../concepts/telephony/plan-solution.md)

> [!div class="nextstepaction"]
> [Look up operator information for a phone number](../telephony/number-lookup.md)

