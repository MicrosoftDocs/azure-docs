---
title: Deploy a cloud-based IoT remote monitoring solution on Azure | Microsoft Docs
description: In this quickstart, you deploy the Remote Monitoring Azure IoT solution accelerator, and sign in to and use the solution dashboard.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.date: 06/07/2018
ms.author: dobett

# As an IT Pro, I need to deploy a cloud-based solution to monitor my IoT devices.
---

# Quickstart: Deploy a cloud-based remote monitoring solution

This quickstart shows you how to deploy the Azure IoT Remote Monitoring solution accelerator to use as a cloud-based remote monitoring solution for your IoT devices. After you've deployed the solution, you use the solution dashboard to visualize simulated devices on a map, and respond to a pressure alert from a simulated chiller device.

The default deployment configures the Remote Monitoring solution for a company called Contoso that manages a selection of different devices in different environments. Contoso uses different types of smart devices such as chillers that send temperature, humidity, and pressure telemetry.

## Prerequisites

To complete this tutorial, you need an active Azure subscription.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Deploy the solution

When you deploy the solution accelerator to your Azure subscription, you must set some configuration options:

1. Sign in to [azureiotsolutions.com](https://www.azureiotsolutions.com/Accelerators) using your Azure account credentials.

1. Click **Try Now** on the **Remote Monitoring** tile.

    ![Choose Remote Monitoring](./media/quickstart-remote-monitoring-deploy/remotemonitoring.png)

1. On the **Create Remote Monitoring solution** page, select a **Basic** deployment. If you're deploying the solution to learn how it works or to run a demonstration, choose the **Basic** option to minimize costs.

1. Choose **.NET** as the language. The Java and .NET implementations have identical features.

1. Enter a unique **Solution name** for your Remote Monitoring solution accelerator.

1. Select the **Subscription** and **Region** you want to use to deploy the solution. Typically, you choose the region closest to you.

1. Click **Create Solution** to begin the deployment. This process takes at least five minutes to run:

    ![Remote Monitoring solution details](./media/quickstart-remote-monitoring-deploy/createform.png)

## Sign in to the solution

When the deployment to your Azure subscription is complete, you can sign in to your Remote Monitoring solution accelerator dashboard.

1. On the **Provisioned solutions** page, click your new Remote Monitoring solution:

    ![Choose new solution](./media/quickstart-remote-monitoring-deploy/choosenew.png)

1. You can view information about your Remote Monitoring solution in the panel that appears. Choose **Solution dashboard** to view your Remote Monitoring solution:

    ![Solution panel](./media/quickstart-remote-monitoring-deploy/solutionpanel.png)

1. Click **Accept** to accept the permissins request, the Remote Monitoring solution dashboard displays in your browser:

    [![Solution dashboard](./media/quickstart-remote-monitoring-deploy/solutiondashboard-inline.png)](./media/quickstart-remote-monitoring-deploy/solutiondashboard-expanded.png#lightbox)

## View your devices

The solution dashboard shows the following information about Contoso's devices:

* **Device statistics** shows summary information about alerts and the total number of devices. In the default deployment Contoso has 10 simulated devices of different types.

* **Device locations** shows where your devices are physically located. The color of the pin shows when there are alerts from the device.

* **Alerts** shows details of alerts from your devices.

* **Telemetry** shows telemetry from your devices. You can view different telemetry streams by clicking the telemetry types at the top.

* **Analytics** shows combined information about the alerts from your devices.

## Respond to an alert

As an operator at Contoso, you can monitor your devices from the solution dashboard. The **Device statistics** panel shows there have been a number of critical alerts, and the **Alerts** panel shows most of them are coming from a chiller device. For Contoso's chiller devices, an internal pressure over 250 PSI a chiller indicates the device isn't working correctly.

1. On the **Dashboard** page, in the **Alerts** panel, you can see the **Chiller pressure too high** alert. The chiller has a red pin on the map (you may need to pan and zoom on the map):

    [![Dashboard shows pressure alert and device on map](./media/quickstart-remote-monitoring-deploy/dashboardalarm-inline.png)](./media/quickstart-remote-monitoring-deploy/dashboardalarm-expanded.png#lightbox)

1. In the **Alerts** panel, click **...** in the **Explore** column next to the **Chiller pressure too high** rule . This action takes you to the **Maintenance** page where you can view the details of the rule that triggered the alert.

1. The **Chiller pressure too high** maintenance page shows details of the rule that triggered the alerts, lists when the alerts occurred and which device triggered it:

    [![Maintenance page shows list of alerts that have triggered](./media/quickstart-remote-monitoring-deploy/maintenancealarmlist-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenancealarmlist-expanded.png#lightbox)

    You've now identified the issue that triggered the alert and the associated device. As an operator, the next steps are to acknowledge the alert and fix the issue.

1. To indicate to other operators that you're now working on the alert, select it, and change the **Alert status** to **Acknowledged**:

    [![Select and acknowledge the alert](./media/quickstart-remote-monitoring-deploy/maintenanceacknowledge-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenanceacknowledge-expanded.png#lightbox)

    The value in the status column changes to **Acknowledged**.

1. To act on the chiller, scroll-down to **Related information**, select the chiller device in the **Alerted devices** list and then choose **Jobs**:

    [![Select the device and schedule an action](./media/quickstart-remote-monitoring-deploy/maintenanceschedule-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenanceschedule-expanded.png#lightbox)

    In the **Jobs** panel, choose **Run method**, then the **EmergencyValveRelease** method, add the job name **ChillerPressureRelease**, and click **Apply**. These settings create a job that executes immediately

1. To view the job status, return to the **Maintenance** page and view the list of jobs in the **Jobs** view. You may need to wait a few seconds before you can see the job has run to release the valve pressure on the chiller:

    [![The status of the jobs in the Jobs view](./media/quickstart-remote-monitoring-deploy/maintenancerunningjob-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenancerunningjob-expanded.png#lightbox)

Finally, confirm that the telemetry values from the chiller are back to normal.

1. Navigate to the **Dashboard** page.

1. To view the pressure telemetry, select **Pressure** in the telemetry panel, and confirm that the pressure for **chiller-02.0** is back to normal.

    [![Pressure back to normal](./media/quickstart-remote-monitoring-deploy/pressurenormal-inline.png)](./media/quickstart-remote-monitoring-deploy/pressurenormal-expanded.png#lightbox)

1. To close the incident, navigate to the **Maintenance** page, select the alert, and set the status to **Closed**:

    [![Select and close the alert](./media/quickstart-remote-monitoring-deploy/maintenanceclose-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenanceclose-expanded.png#lightbox)

    The value in the status column changes to **Closed**.

## Clean up resources

If you plan to move on to the tutorials, leave the Remote Monitoring solution accelerator deployed.

If you don't need the solution accelerator any longer, delete it from the [Provisioned solutions](https://www.azureiotsolutions.com/Accelerators#dashboard) page:

![Delete solution](media/quickstart-remote-monitoring-deploy/deletesolution.png)

## Next steps

In this quickstart, you've deployed the Remote Monitoring solution accelerator and completed a monitoring task using the simulated devices in the default Contoso deployment.

To learn how to update the firmware in your connected devices and organize your assets in the solution, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Explore the capabilities of the Remote Monitoring solution accelerator](iot-accelerators-remote-monitoring-explore.md)