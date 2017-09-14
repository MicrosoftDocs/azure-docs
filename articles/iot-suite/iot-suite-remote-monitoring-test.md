---
title: Device simulation in remote monitoring solution - Azure | Microsoft Docs
description: This tutorial shows you how to use the device simulator with the remote monitoring preconfigured solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 08/09/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Test your solution with simulated devices

Contoso wants to test a new smart lightbulb device. To perform the tests, you create a new simulated device with the following characteristics:

*Properties*

| Name                     | Values                      |
| ------------------------ | --------------------------- |
| Color                    | White, Red, Blue            |
| Brightness               | 0 to 100                    |
| Estimated remaining life | Countdown from 10,000 hours |

*Telemetry*

| Name   | Values      |
| ------ | ----------- |
| Status | 1=On, 0=Off |

*Methods*

| Name        |
| ----------- |
| Turn on-off |

*Behavior*

| Name                     | Values |
| ------------------------ | -------|
| Initial color            | White  |
| Initial brightness       | 75     |
| Initial remaining life   | 10,000 |
| Initial telemetry status | 1      |
| Always on                | 1      |

This tutorial shows you how to use the device simulator with the remote monitoring preconfigured solution:

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Create a new device type
> * Simulate custom device behavior
> * Add a new device type to the dashboard

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

<!-- Dominic please this use as your reference https://github.com/Azure/device-simulation-dotnet/wiki/Device-Models -->

## Understand the device simulation service

<!-- Provide detailed steps here -->

## Create a new device type

<!-- Provide detailed steps here -->

Modify an existing one and provide a new ligthbulb device twin model.

## Simulate custom device behavior

<!-- Provide detailed steps here -->

Modify an existing one and provide a new lightbulb behavior function.

## Add a new device type to the dashboard

<!-- Provide detailed steps here -->

How to modify the UX so it pulls the information about the new device type. I believe today is hardcoded so we may have to do this post MVP.

## Next steps

This tutorial, showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Create a new device type
> * Simulate custom device behavior
> * Add a new device type to the dashboard

Now that you have learned how to use the device simulation service, the suggested next step is to learn how to [connect a physical device to your remote monitoring solution](iot-suite-connecting-devices-node.md).

<!-- Next tutorials in the sequence -->