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

This article will provide help troubleshooting problems or issues with message routing. Several common scenarios will be covered, including common error codes.

## Metrics

List of metrics you can use. --> this list is in [iot-hub-metrics](iot-hub-metrics.md).
Add the new per-endpoint metrics to that list.

To set up and use metrics, see the article [Set up and use metrics sand diagnostic logs with an IoT Hub](tutorial-use-metrics-and-diags.md).  -->create include file, use twice? Or just point them to the metrics article?

## Which metrics to use when

## Scenario driven examples

I was pulling data from build in endpoint into TSI or ASA and after configuring a new message route, TSI/ASA is not getting data. {Note: I don't have any idea what this means.}

My endpoint status is dead on the portal, what can I do to debug?

My endpoint is not getting data, how do I troubleshoot?

Messages dropped, check per endpoint metrics, diag logs and get endpoint health for last known error

What messages go to fallback route? How do I use this capability? 

What services can I send data to using message routing? (should this be added? Its more for information than for debugging)  
Link to routing docs/custom endpoints
{These are covered in the routing tutorial and also one of the devguide articles, so adding it here would be super redundant. We should add the links at the bottom in a "for more information" link.}

### Route to blob is failing

TBD.

### What to do when messages are dropped due to large size of message or enrichment

-- figure out if it's dropped because the size of the message or enrichment is too large.
-- are there any other reasons we want to cover for dropped messages?
-- could this be one of those scenarios?

### monitoring and troubleshooting -- we have this in a tutorial, so let's update that one with some appropriate metrics. Would also be good to show how to troubleshoot connection problems. Any others?

#### setting up metrics
#### setting alerts in Azure Monitor
#### Enabling diagnostic logs
#### Using diagnostic logs to debug
{Note: add an article detailing the diagnostic log usage and all of the fields added. Link to it from here}

See the article [Set up and use metrics and diagnostic logs with an IoT Hub](tutorial-use-metrics-and-diags.md).    --> I think this is the classic alerts, and it needs to be updated to the azure monitor alerts.

## List of last known errors for IoT Hub

[!INCLUDE [iot-hub-include-last-known-errors](../../includes/iot-hub-include-last-known-errors.md)]

## Endpoint Status

[!INCLUDE [iot-hub-include-endpoint-health](../../includes/iot-hub-include-endpoint-health.md)]

## common error codes

If this is the diagnostics, should go there.

## Next steps
