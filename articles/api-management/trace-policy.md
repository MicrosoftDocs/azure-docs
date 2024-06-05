---
title: Azure API Management policy reference - trace | Microsoft Docs
description: Reference for the trace policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 03/18/2024
ms.author: danlep
---

# Trace

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `trace` policy adds a custom trace into the request tracing output in the test console, Application Insights telemetries, and/or resource logs.

-   The policy adds a custom trace to the [request tracing](./api-management-howto-api-inspector.md) output in the test console when tracing is triggered.
-   The policy creates a [Trace](../azure-monitor/app/data-model-complete.md#trace) telemetry in Application Insights, when [Application Insights integration](./api-management-howto-app-insights.md) is enabled and the `severity` specified in the policy is equal to or greater than the `verbosity` specified in the [diagnostic setting](./diagnostic-logs-reference.md).
-   The policy adds a property in the log entry when [resource logs](./api-management-howto-use-azure-monitor.md#resource-logs) are enabled and the severity level specified in the policy is at or higher than the verbosity level specified in the [diagnostic setting](./diagnostic-logs-reference.md).
-   The policy is not affected by Application Insights sampling. All invocations of the policy will be logged.

[!INCLUDE [api-management-tracing-alert](../../includes/api-management-tracing-alert.md)]

[!INCLUDE [api-management-availability-tracing-v2-tiers](../../includes/api-management-availability-tracing-v2-tiers.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<trace source="arbitrary string literal" severity="verbose | information | error">
    <message>String literal or expressions</message>
    <metadata name="string literal or expressions" value="string literal or expressions"/>
</trace>
```

## Attributes

| Attribute | Description                                                                                                               | Required | Default |
| --------- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| source    | String literal meaningful to the trace viewer and specifying the source of the message. Policy expressions aren't allowed.                                   | Yes      | N/A     |
| severity  | Specifies the severity level of the trace. Allowed values are `verbose`, `information`, `error` (from lowest to highest). Policy expressions aren't allowed. | No       | `verbose` |

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| message  | A string or expression to be logged. Policy expressions are allowed.                                                                                                                 | Yes      |
| metadata | Adds a custom property to the Application Insights [Trace](../azure-monitor/app/data-model-complete.md#trace) telemetry. | No       |

### metadata attributes

| Attribute | Description                                                                                                               | Required | Default |
| --------- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| name      | Name of the property.                                                                                                     | Yes      | N/A     |
| value     | Value of the property.                                                                                                    | Yes      | N/A     |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted

## Example

```xml
<trace source="PetStore API" severity="verbose">
    <message>@((string)context.Variables["clientConnectionID"])</message>
    <metadata name="Operation Name" value="New-Order"/>
</trace>
```

## Related policies

* [Logging](api-management-policies.md#logging)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
