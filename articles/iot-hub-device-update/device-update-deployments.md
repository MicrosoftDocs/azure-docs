---
title: Understand Device Update for Azure IoT Hub deployments | Microsoft Docs
description: Understand how updates are deployed.
author: vimeht
ms.author: vimeht
ms.date: 12/07/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Update deployments

A deployment is how updates are delivered to one or more devices. Deployments are always associated with a device group. A deployment can be initiated from the API or the UI. 
A device group can only have one active deployment associated with it at any given time. A deployment can be scheduled to begin in the future or start immediately.

## Dynamic deployments

Deployments in Device Update for IoT Hub are dynamic in nature. Dynamic deployments empower users to move towards a set-and-forget management model by automatically deploying updates to applicable, newly provisioned devices. Any devices that are provisioned or change their group membership after a deployment is initiated will automatically receive the update deployment as long as the deployment remains active.

## Deployment lifecycle

Due to their dynamic nature, deployments remain active and in-progress until they are explicitly canceled. A deployment is considered inactive and superseded if a new deployment is created targeting the same device group. A deployment can be retried for devices that might fail. Once a deployment is canceled, it cannot be reactivated.

## Next steps

[Deploy an update](./deploy-update.md)
