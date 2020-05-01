---
title: Troubleshooting message routing
description: How to perform basic troubleshooting for several scenarios
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/25/2020
ms.author: robinsh
---

# Troubleshooting message routing

This article provides help troubleshooting problems or issues with message routing. Several common scenarios are be covered, including common error codes.

## Metrics

For detailed information showing all of the available metrics for IoT Hub, see [iot-hub-metrics](iot-hub-metrics.md).

To set up and use metrics, see the article [Set up and use metrics and diagnostic logs with an IoT Hub](tutorial-use-metrics-and-diags.md).

## Which metrics to use when

Can we provide some guidance here, like metrics used the most? 

## Scenario driven examples

I was pulling data from build in endpoint into TSI or ASA and after configuring a new message route, TSI/ASA is not getting data. {Note: I don't have any idea what this means. -rs}

My endpoint status is dead on the portal, what can I do to debug?

My endpoint is not getting data, how do I troubleshoot?

Messages dropped, check per endpoint metrics, diag logs and get endpoint health for last known error

What messages go to fallback route? How do I use this capability?

What services can I send data to using message routing? (should this be added? It's more for information than for debugging) 

Link to routing docs/custom endpoints
{These are covered in the routing tutorial and also one of the devguide articles, so adding it here would be super redundant. We should add the links at the bottom in a "for more information" link.}

### Route to blob fails

TBD.

### What to do when messages are dropped due to large size of message or enrichment

Figure out if it's dropped because the size of the message or enrichment is too large.
Are there any other reasons we want to cover for dropped messages?

<!-- I put in some anchors so you can link directly to this spot that shows each table -->
<!-- I don't ordinarily use anchors, but seems like a good solution here.-->

## List of last known errors for IoT Hub Routing

<a id="last-known-errors"></a>
[!INCLUDE [iot-hub-include-last-known-errors](../../includes/iot-hub-include-last-known-errors.md)]

## Endpoint health
<a id="endpoint-health"></a>
[!INCLUDE [iot-hub-include-endpoint-health](../../includes/iot-hub-include-endpoint-health.md)]

## Diagnostic logs details

The following are the values used in the diagnostics logs.

### Common error codes output

<a id="diagnostics-error-codes"></a>
[!INCLUDE [iot-hub-diagnostics-error-codes](../../includes/iot-hub-diagnostics-error-codes.md)]

### Operation Names

<a id="diganotics-operation-names"></a>
[!INCLUDE [iot-hub-diagnostics-operation-names](../../includes/iot-hub-diagnostics-operation-names.md)]

## Next steps

<!--combine into one last, as these are all in the same tutorial -->
* Monitoring and troubleshooting (tutorial)
  * Setting up metrics
  * Setting alerts in Azure Monitor
  * Enabling diagnostic logs
* Using diagnostic logs to debug

Update the alerts in the article [Set up and use metrics and diagnostic logs with an IoT Hub](tutorial-use-metrics-and-diags.md) so they use the Azure Monitor alerts instead of the old classic alerts.

