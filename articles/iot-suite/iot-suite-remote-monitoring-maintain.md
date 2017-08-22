---
title: Maintain the Azure IoT Suite remote monitoring solution | Microsoft Docs
description: This tutorial shows you how to troubleshoot and remediate device issues in the remote monitoring solution.
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

# Troubleshoot and remediate device issues to maintain solution health

<!-- See Run Phase scenario 1 in https://microsoft.sharepoint.com/teams/Azure_IoT/_layouts/15/WopiFrame.aspx?sourcedoc=%7B1C5712E7-0B96-4274-BFF0-89E43CC58C17%7D&file=PCS%20Scenarios%20v05.docx&action=default -->

As the operator for an IoT solution that uses 100,000 devices, you are responsible for the overall health of the solution. You must:

* Ensure the health of all the devices connected to the solution.
* Troubleshoot any alarms raised by the devices.
* Provide the first level of remediation when a problem occurs.

You receive a notification that several devices in Building 4 of Contoso have triggered a high-pressure alert. You don't know the root cause of the issue yet but can get more details about the errors using the following workflow for remediation.

<!-- Is this something that is easy to simulate, or does it need to be more generic? -->

This tutorial shows you how to use the dashboard to troubleshoot and remediate these device issues.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Assess the priority of the alarm
> * Analyze and acknowledge the alarm
> * Remediate the issue

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## Assess the priority of the alarm

Typically, remediation of critical errors is done in an edge component to ensure the lowest latency. If a critical error goes undetected by edge analytics, the solution operator might need to halt a device completely. In the current scenario, the alarm in question does not require a shutdown. The remediation details accompanying the alert show you have eight hours to get the pressure readings back into normal operating ranges.

<!-- Provide detailed steps here -->

## Analyze and acknowledge the alarm

You can query for the devices reporting the alarm and see their attributes such as location, version, and OS. You see multiple devices are in an error state, but you need more information so you remotely enable a troubleshooting mode on those devices. Solving issues fast is critical in a live operational environment, and the troubleshooting mode enables you to:

* Increase the telemetry verbosity and frequency of the devices for debugging
* Revert to default behavior after a given time interval to avoid unnecessary messaging costs.

When you analyze this new data in the dashboard, you notice that:

* The ambient temperature reading of these devices is higher than expected.
* All the devices reporting errors are in building 4, floor 2.

You suspect there is a larger issue involving the HVAC system, so you share your findings with another operator through a support ticket. This operator manages the devices in building 4, including the HVAC control units.

<!-- Provide detailed steps here -->

## Remediate the issue

As the operator who manages building 4, you query the HVAC units in building 4, and select the unit on floor 2. In the device details, you see that the fan speed is set to **off**. This setting could explain the increased ambient temperature that in turn affects the pressure reading of the devices. To vent the room as quickly as possible, you issue a command to the HVAC control unit to set the fan speed to **max**. You also schedule a job for one hour from now to reduce the fan speed to **normal**. You also configure a rule to send an SMS to yourself when either the devices stop raising alarms, or in five hours, whichever happens first. You will:

* Be proactively notified if the remediation is successful.
* Have approximately three hours before the recommended escalation deadline if the pressure has not returned to normal range, which enables you to start additional remediation procedures.

<!-- Provide detailed steps here -->

## Next steps

This tutorial, showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Assess the priority of the alarm
> * Analyze and acknowledge the alarm
> * Remediate the issue

Now that you have learned how to maintain your solution, the suggested next step is to learn how to [TODO].

<!-- Next tutorials in the sequence -->