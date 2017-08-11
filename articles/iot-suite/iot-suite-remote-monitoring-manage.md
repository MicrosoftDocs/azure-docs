---
title: Manage devices with Azure IoT Suite remote monitoring | Microsoft Docs
description: This tutorial shows you how to manage devices connected to the remote monitoring solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.date: 08/09/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Provision and de-provision devices

<!-- See Run Phase scenario 3 in https://microsoft.sharepoint.com/teams/Azure_IoT/_layouts/15/WopiFrame.aspx?sourcedoc=%7B1C5712E7-0B96-4274-BFF0-89E43CC58C17%7D&file=PCS%20Scenarios%20v05.docx&action=default -->

Contoso has decided to purchase a new generation of more efficient chillers. The first phase is a pilot to replace some chillers in specific locations. You can use the pilot to identify improvements for the next phases. To accomplish the rollout, you have identified the following workflow:

1. Identify the chillers to be replaced.
1. Provision the new chillers.
1. Monitor the status of the new chillers.
1. De-provision the old chillers.

This tutorial shows you how to manage the devices connected to your solution from the solution dashboard.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Create and use a query to identify specific devices.
> * Provision new devices.
> * Monitor a selection of devices.
> * Shutdown and de-provision a device.

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## Create and use a query to identify specific devices

You create a query to identify the chillers to be replaced using a regular expression on their serial number. Devices with a serial number that starts with **2010** are the models older than 2011. You save the query, so you identify the devices again.

<!-- Add steps to create, save, and execute a suitbal query against the simulated devices -->

## Provision new devices

You have worked with the chiller manufacturer to ensure that the devices come with the appropriate firmware version and provisioning capabilities. This firmware enables the chillers to automatically provision to the right solution and send the appropriate telemetry data. Devices are shipped and delivered to the various facilities ready for provisioning.

When devices are in the factories, you coordinate with the local operators to perform the provisioning during the different maintenance windows. Device provisioning starts when they are booted by a local operator. The devices automatically connect to the appropriate IoT Hub and start sending telemetry as soon as the maintenance window closes.

<!-- For the tutorial, we need to use simulated devices here. Can they use DPS? -->

## Monitor a selection of devices

When the new chillers start sending data, you can use the dashboard to ensure everything looks correct. In your dashboard, you can select to visualize the old and new chillers. If you see any outliers, you can debug the issue further.

<!-- Steps to visualize -->

## Shutdown and de-provision a device

When the new chillers are working correctly, you use the dashboard to shut down the old chillers. When you receive a confirmation that the shutdown is complete, you can arrange for the physical disconnection of the old devices. You can see that all old chillers now show up as **de-provisioned** in the device grid. You run a query to select all the **de-provisioned** devices and remove them from the device grid.

<!-- Again, working with simulated devices for the actual steps -->

This tutorial showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Create and use a query to identify specific devices.
> * Provision new devices.
> * Monitor a selection of devices.
> * Shutdown and de-provision a device.

Now that you have learned how to manage your devices, the suggested next steps are to learn how to:

* [Automate your solution with rules](./iot-suite-remote-monitoring-automate.md).
* [Maintain your solution](./iot-suite-remote-monitoring-maintain.md).

<!-- Next tutorials in the sequence -->