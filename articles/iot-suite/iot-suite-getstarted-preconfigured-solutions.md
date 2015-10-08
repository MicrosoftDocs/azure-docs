<properties
	pageTitle="Microsoft Azure IoT Suite preconfigured solutions getting started tutorial | Microsoft Azure"
	description="Follow this tutorial to learn how to deploy an Azure IoT Suite preconfigured solution."
	services=""
	documentationCenter=".net"
	authors="aguilaaj"
	manager="timlt"
	editor=""/>

<tags
     ms.service="na"
     ms.devlang="na"
     ms.topic="hero-article"
     ms.tgt_pltfrm="na"
     ms.workload="tbd"
     ms.date="09/08/2015"
     ms.author="araguila"/>

# Get started with the IoT preconfigured solutions

## Introduction

Azure IoT Suite preconfigured solutions connect a number of Azure IoT services together to exemplify an end-to-end solution that satisfies an Internet of Things business scenario.

This tutorial shows how to provision a preconfigured solution, Remote Monitoring. It also shows how to view the basic features of the Remote Monitoring preconfigured solution.

In order to complete this tutorial, you’ll need the following:

-   An active Azure subscription.

    If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][].

## Provision a Remote Monitoring Preconfigured solution

1.  Log on to <https://www.azureiotsuite.com>, and click **+** to create a new solution.

2.  Select **Remote Monitoring** as your solution type.

3.  Type a **Solution Name** for your Remote monitoring preconfigured solution.

4.  Validate the **Region** and **Subscription** you wish to provision this solution in.

5.  Click **Create Solution**.

## View Remote Monitoring Solution Dashboard

1.  When the provisioning is complete and the tile for your preconfigured solution indicates **Ready**, click **Launch** to open your remote monitoring solution dashboard in a new tab.

2.  By default, the **Dashboard** is selected in the left-hand menu. This is your solution dashboard.

## View Solution Device List

1.  Click **Devices** in the left-hand menu to navigate to the device list for this solution.

2.  Upon provisioning you will see 4 simulated devices provisioned.

3.  Click an **individual device** in the device list to view the device details associated with that device.

## Send a command to a Device

1.  Click **Send Command** in the device details pane for the selected simulated device.

2.  Select **PingDevice** from the command dropdown.

3.  Click **Send Command**.

4.  See the status of the command as it appears in the Command History.

## Add a new simulated device

1.  Click the **←** (back arrow) to return to the device list.

2.  Click **+ Add A Device** in the bottom left corner to add a new device.

3.  Click **Add New** for the **Simulated Device**.

4.  Select **Let me define my own Device ID**, and add a unique Device ID name.

5.  Click **Create**.

6.  Click the **←** (back arrow) to return to the device list.

7.  See your device **Running** in the device list.

## View and Edit Solution Rules

1.  Notice the **Alarm History** table in the **Solution Dashboard.**

2.  These alarms are triggered by a rule output **AlarmTemp** specified in **Rules**.

3.  Click **Rules** in the left-hand menu to navigate to the rules for this solution.

4.  Upon provisioning you will see 1 rule already enabled.

5.  Click the **rule** in the rules list to view the associated rule properties.

6.  Click **Edit** in the rule properties pane.

7.  Change the **Threshold** to be 30 and keep all other properties the same.

8.  Click **Save and View Rules**.

9.  Return to the **Alarm History** table in the **Solution Dashboard** and notice the change in trigger as a result of the updated rule.

## Next Steps

Now that you’ve built a working preconfigured solution, you can move on to the following scenarios:

-   Guidance on customizing preconfigured solutions

-   IoT Suite overview

[Azure Free Trial]: http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F%20target=
