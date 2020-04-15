---
title: Troubleshooting message routing
description: How to perform basic troubleshooting for several scenarios
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: robinsh
---

# Troubleshooting message routing

This article will provide help troubleshooting problems or issues with message routing. Several common scenarios will be covered, including common error codes.

## Metrics

List of metrics you can use. --> this list is in [iot-hub-metrics](iot-hub-metrics.md).
Add the new per-endpoint metrics to that list.

To set up and use metrics, see the article [Set up and use metrics sand diagnostic logs with an IoT Hub](tutorial-use-metrics-and-diags).  (create include file, use twice)? Or just point them to the metrics article?

## Which metrics to use when

## Scenario driven examples

### What to do when messages are dropped due to large size of message or enrichment

-- figure out if it's dropped because the size of the message or enrichment is too large.
-- are there any other reasons we want to cover for dropped messages?
-- could this be one of those scenarios?

### monitoring and troubleshooting -- we have this in a tutorial, so let's update that one with some appropriate metrics. Would also be good to show how to troubleshoot connection problems. Any others?

#### setting up metrics
#### setting alerts in Azure Monitor
#### Enabling diagnostic logs
#### Using diagnostic logs to debug

See the article [Set up and use metrics and diagnostic logs with an IoT Hub](tutorial-use-metrics-and-diags).    (I think this is the classic alerts, and it needs to be updated to the azure monitor alerts.)

### Route to blob is failing

TBD.

## common error codes

TBD.

## Next steps
