---
title: Azure API Management policy reference - log-to-eventhub | Microsoft Docs
description: Reference for the log-to-eventhub policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Log to event hub

The `log-to-eventhub` policy sends messages in the specified format to an event hub defined by a [Logger](/rest/api/apimanagement/current-ga/logger) entity. As its name implies, the policy is used for saving selected request or response context information for online or offline analysis.  

> [!NOTE]
> For a step-by-step guide on configuring an event hub and logging events, see [How to log API Management events with Azure Event Hubs](./api-management-howto-log-event-hubs.md).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<log-to-eventhub logger-id="id of the logger entity" partition-id="index of the partition where messages are sent" partition-key="value used for partition assignment">
  Expression returning a string to be logged
</log-to-eventhub>
```

## Attributes

| Attribute     | Description                                                               | Required                                                             | Default |
| ------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----|
| logger-id     | The ID of the Logger registered with your API Management service. Policy expressions aren't allowed.         | Yes                                                 | N/A |
| partition-id  | Specifies the index of the partition where messages are sent. Policy expressions aren't allowed.            | Optional. Do not use if `partition-key` is used. | N/A |
| partition-key | Specifies the value used for partition assignment when messages are sent. Policy expressions are allowed. | Optional. Do not use if `partition-id` is used.  | N/A |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

* The policy is not affected by Application Insights sampling. All invocations of the policy will be logged.
* The maximum supported message size that can be sent to an event hub from this policy is 200 kilobytes (KB). A larger message will be automatically truncated to 200 KB before transfer to an event hub.

## Example

Any string can be used as the value to be logged in Event Hubs. In this example the date and time, deployment service name, request ID, IP address, and operation name for all inbound calls are logged to the event hub Logger registered with the `contoso-logger` ID.

```xml
<policies>
  <inbound>
    <log-to-eventhub logger-id ='contoso-logger'>
      @( string.Join(",", DateTime.UtcNow, context.Deployment.ServiceName, context.RequestId, context.Request.IpAddress, context.Operation.Name) )
    </log-to-eventhub>
  </inbound>
  <outbound>
  </outbound>
</policies>
```

## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]