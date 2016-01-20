<properties
	pageTitle="Get started with preconfigured solutions | Microsoft Azure"
	description="Follow this tutorial to learn how to deploy an Azure IoT Suite preconfigured solution."
	services=""
	documentationCenter=""
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="na"
     ms.devlang="na"
     ms.topic="hero-article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="12/03/2015"
     ms.author="dobett"/>

# Tutorial: Get started with the IoT preconfigured solutions

## Introduction

Azure IoT Suite [preconfigured solutions][lnk-preconfigured-solutions] combine multiple Azure IoT services to deliver end-to-end solutions that implement common IoT business scenarios.

This tutorial shows you how to provision the *remote monitoring* preconfigured solution. It also walks you through the basic features of the remote monitoring preconfigured solution.

In order to complete this tutorial, you’ll need an active Azure subscription.

> [AZURE.NOTE]  If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk_free_trial].

## Provision the remote monitoring preconfigured solution

1.  Log on to [azureiotsuite.com][lnk-azureiotsuite] using your Azure account credentials, and click **+** to create a new solution.

2.  Click **Select** on the **Remote monitoring** tile.

3.  Enter a **Solution name** for your remote monitoring preconfigured solution.

4.  Select the **Region** and **Subscription** you want to use to provision the solution.

5.  Click **Create Solution** to begin the provisioning process. This typically takes several minutes to run.

## View remote monitoring solution dashboard

1.  When the provisioning is complete and the tile for your preconfigured solution indicates **Ready**, click **Launch** to open your remote monitoring solution portal in a new tab.

    ![][img-launch-solution]

2.  By default, the solution portal shows the *solution dashboard*. You can select other views using the left-hand menu.

    ![][img-dashboard]

## View solution device list

1.  Click **Devices** in the left-hand menu to show the *device list* for this solution.

    ![][img-devicelist]

2.  You can see there are four simulated devices created by the provisioning process.

3.  Click on a device in the device list to view the device details.

    ![][img-devicedetails]

## Send a command to a device

1.  Click **Commands** in the device details pane for the selected device.

    ![][img-devicecommands]

2.  Select **PingDevice** from the command list.

3.  Click **Send Command**.

4.  You can see the status of the command in the command history.

    ![][img-pingcommand]

## Add a new simulated device

1.  Navigate back to the device list.

2.  Click **+ Add A Device** in the bottom left corner to add a new device.

    ![][img-adddevice]

3.  Click **Add New** on the **Simulated Device** tile.

    ![][img-addnew]

4.  Select **Let me define my own Device ID**, and enter a unique device ID name such as **mydevice_01**.

5.  Click **Create**.

    ![][img-definedevice]

6. In step 3 of **Add a simulated device** click **Done** to return to the device list.

7.  You can view your device **Running** in the device list.

    ![][img-runningnew]

## View and edit solution rules

1.  Return to the solution dashboard and view the **Alarm History** tile.

    ![][img-alarmhistory]

2.  The rule **AlarmTemp** triggers these alarms.

3.  Click **Rules** in the left-hand menu to view the rules for this solution.

    ![][img-rules]

4.  The preconfigured solution provisions two rules.

5.  Click the **Temperature** rule in the rules list to view the rule properties.

6.  Click **Edit** in the rule properties pane.

    ![][img-displayrule]

7.  Change the **Threshold** to 30 and keep all other properties the same.

8.  Click **Save and View Rules**.

    ![][img-editrule]

9.  Return to the **Alarm History** table in the **Solution Dashboard** and observe the change in behavior that results from the updated rule.

    ![][img-newhistory]

## Next Steps

Now that you’ve built a working preconfigured solution, you can move on to the following scenarios:

-   [Guidance on customizing preconfigured solutions][lnk-customize]
-   [Predictive maintenance preconfigured solution overview][lnk-predictive]

[img-launch-solution]: media/iot-suite-getstarted-preconfigured-solutions/launch.png
[img-dashboard]: media/iot-suite-getstarted-preconfigured-solutions/dashboard.png
[img-devicelist]: media/iot-suite-getstarted-preconfigured-solutions/devicelist.png
[img-devicedetails]: media/iot-suite-getstarted-preconfigured-solutions/devicedetails.png
[img-devicecommands]: media/iot-suite-getstarted-preconfigured-solutions/devicecommands.png
[img-pingcommand]: media/iot-suite-getstarted-preconfigured-solutions/pingcommand.png
[img-adddevice]: media/iot-suite-getstarted-preconfigured-solutions/adddevice.png
[img-addnew]: media/iot-suite-getstarted-preconfigured-solutions/addnew.png
[img-definedevice]: media/iot-suite-getstarted-preconfigured-solutions/definedevice.png
[img-runningnew]: media/iot-suite-getstarted-preconfigured-solutions/runningnew.png
[img-alarmhistory]: media/iot-suite-getstarted-preconfigured-solutions/alarmhistory.png
[img-rules]: media/iot-suite-getstarted-preconfigured-solutions/rules.png
[img-displayrule]: media/iot-suite-getstarted-preconfigured-solutions/displayrule.png
[img-editrule]: media/iot-suite-getstarted-preconfigured-solutions/editrule.png
[img-newhistory]: media/iot-suite-getstarted-preconfigured-solutions/newhistory.png

[lnk_free_trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-preconfigured-solutions]: iot-suite-what-are-preconfigured-solutions.md
[lnk-azureiotsuite]: https://www.azureiotsuite.com
[lnk-customize]: iot-suite-guidance-on-customizing-preconfigured-solutions.md
[lnk-predictive]: iot-suite-predictive-overview.md
