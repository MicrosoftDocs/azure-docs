---
title: Automate Azure IoT Suite remote monitoring | Microsoft Docs
description: This tutorial shows you how to use rules and actions to automate the remote monitoring solution.
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

# Detect issues using threshold based rules

<!-- See Run Phase scenario 2 in https://microsoft.sharepoint.com/teams/Azure_IoT/_layouts/15/WopiFrame.aspx?sourcedoc=%7B1C5712E7-0B96-4274-BFF0-89E43CC58C17%7D&file=PCS%20Scenarios%20v05.docx&action=default -->

Contoso has previously encountered issues with some of the HVAC fans. The operations team has decided to add more fans in the facilities that have previously reported summer temperatures higher than 80 degrees. A failure in the chilling systems can be catastrophic with high temperatures. To complete this project, you need to accomplish the following tasks:

* Provision the addition fans in the solution.
* Configure the solution to control the fans.

This tutorial shows you how to create rules and actions in the remote monitoring preconfigured solution dashboard. You use rules and actions to automate your solution.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * View the rules in your solution
> * Edit an existing rule
> * Provision new devices
> * Create a new rule
> * Delete a rule

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## View the rules in your solution

<!-- Review the existing fan rules? -->

## Edit an existing rule

<!-- Tweak one of the existing fan rules? -->

## Provision new devices

The new fans are delivered directly to the factories and received by the local operations crew. To simplify the provisioning process, the fan manufacturer has already flashed the fans with the correct firmware. When the local operator boots the fan and connects it to the network, the fan is:

* Automatically provisioned into the solution.
* Ready to send data.

<!-- Provision new fan devices - is this an opportunity to mention DPS? -->

## Create a new rule

Because this is a pilot operation, you want to track the new fans in detail. You use the tag **extra** to identify each of the recently purchased fans. You can use the tag to query and uniquely categorize the new fans for remediation and analysis. You can also choose to visualize only the **extra** devices in the dashboard. You create the following rules for the new fans:

* The same rules that the existing fans have such as anomaly detection for fan speed.
* A rule that switches on these fans between 9AM and 9PM. Nights are cooler and you don't to waste energy running the fans all the time.

At this point, all fans are operationally active and you are ready for the summer season.

<!-- Add steps to create the new rules -->

## Delete a rule

<!-- For completeness, point out how to delete (and/or disable?) a rule -->

## Next steps

This tutorial showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * View the rules in your solution
> * Edit an existing rule
> * Provision new devices
> * Create a new rule
> * Delete a rule

Now that you have learned how to monitor your devices, the suggested next step is to learn how to [Maintain your solution](./iot-suite-remote-monitoring-maintain.md).

<!-- Next tutorials in the sequence -->