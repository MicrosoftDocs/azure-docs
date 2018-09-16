---
title: Try a cloud-based IoT remote monitoring solution on Azure | Microsoft Docs
description: In this quickstart, you deploy the Remote Monitoring Azure IoT solution accelerator, and sign in to and use the solution dashboard.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: quickstart
ms.custom: mvc
ms.date: 07/12/2018
ms.author: dobett

# As an IT Pro, I want to try out a cloud-based solution to understand how I can monitor my IoT devices.
---

# Quickstart: Try a cloud-based remote monitoring solution

This quickstart shows you how to deploy the Azure IoT Remote Monitoring solution accelerator to run a cloud-based remote monitoring simulation. After you've deployed the solution accelerator, you use the solution **Dashboard** page to visualize simulated devices on a map, and the **Maintenance** page respond to a pressure alert from a simulated chiller device. You can use this solution accelerator as the starting point for your own implementation or as a learning tool.

The initial deployment configures the Remote Monitoring solution accelerator for a company called Contoso. Contoso manages a selection of different device types, such as chillers, deployed in different physical environments. A chiller device sends temperature, humidity, and pressure telemetry to the Remote Monitoring solution accelerator.

To complete this quickstart, you need an active Azure subscription.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Deploy the solution

When you deploy the solution accelerator to your Azure subscription, you must set some configuration options.

Sign in to [azureiotsolutions.com](https://www.azureiotsolutions.com/Accelerators) using your Azure account credentials.

Click **Try Now** on the **Remote Monitoring** tile.

![Choose Remote Monitoring](./media/quickstart-remote-monitoring-deploy/remotemonitoring.png)

On the **Create Remote Monitoring solution** page, select a **Basic** deployment. If you're deploying the solution accelerator to learn how it works or to run a demonstration, choose the **Basic** option to minimize costs.

Choose **.NET** as the language. The Java and .NET implementations have identical features.

Enter a unique **Solution name** for your Remote Monitoring solution accelerator. For this quickstart, we're calling ours **contoso-rm2**.

Select the **Subscription** and **Region** you want to use to deploy the solution accelerator. Typically, you choose the region closest to you. For this quickstart, we're using **Visual Studio Enterprise** and **West Europe**. You must be a [global administrator or user](iot-accelerators-permissions.md) in the subscription.

Click **Create Solution** to begin the deployment. This process takes at least five minutes to run:

![Remote Monitoring solution details](./media/quickstart-remote-monitoring-deploy/createform.png)

## Sign in to the solution

When the deployment to your Azure subscription is complete, you see a green checkmark and **Ready** on the solution tile. You can now sign in to your Remote Monitoring solution accelerator dashboard.

On the **Provisioned solutions** page, click your new Remote Monitoring solution accelerator:

![Choose new solution](./media/quickstart-remote-monitoring-deploy/choosenew.png)

You can view information about your Remote Monitoring solution accelerator in the panel that appears. Choose **Solution dashboard** to view your Remote Monitoring solution accelerator:

![Solution panel](./media/quickstart-remote-monitoring-deploy/solutionpanel.png)

Click **Accept** to accept the permissions request, the Remote Monitoring solution dashboard displays in your browser:

[![Solution dashboard](./media/quickstart-remote-monitoring-deploy/solutiondashboard-inline.png)](./media/quickstart-remote-monitoring-deploy/solutiondashboard-expanded.png#lightbox)

## View your devices

The solution dashboard shows the following information about Contoso's simulated devices:

* **Device statistics** shows summary information about alerts and the total number of devices. In the default deployment, Contoso has 10 simulated devices of different types.

* **Device locations** shows where your devices are physically located. The color of the pin shows when there are alerts from the device.

* **Alerts** shows details of alerts from your devices.

* **Telemetry** shows telemetry from your devices. You can view different telemetry streams by clicking the telemetry types at the top.

* **Analytics** shows combined information about the alerts from your devices.

## Respond to an alert

As an operator at Contoso, you can monitor your devices from the solution dashboard. The **Device statistics** panel shows there have been a number of critical alerts, and the **Alerts** panel shows most of them are coming from a chiller device. For Contoso's chiller devices, an internal pressure over 250 PSI indicates the device isn't working correctly.

### Identify the issue

On the **Dashboard** page, in the **Alerts** panel, you can see the **Chiller pressure too high** alert. The chiller has a red pin on the map (you may need to pan and zoom on the map):

[![Dashboard shows pressure alert and device on map](./media/quickstart-remote-monitoring-deploy/dashboardalarm-inline.png)](./media/quickstart-remote-monitoring-deploy/dashboardalarm-expanded.png#lightbox)

In the **Alerts** panel, click **...** in the **Explore** column next to the **Chiller pressure too high** rule. This action takes you to the **Maintenance** page where you can view the details of the rule that triggered the alert.

The **Chiller pressure too high** maintenance page shows details of the rule that triggered the alerts. The page also lists when the alerts occurred and which device triggered them:

[![Maintenance page shows list of alerts that have triggered](./media/quickstart-remote-monitoring-deploy/maintenancealarmlist-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenancealarmlist-expanded.png#lightbox)

You've now identified the issue that triggered the alert and the associated device. As an operator, the next steps are to acknowledge the alert and fix the issue.

### Fix the issue

To indicate to other operators that you're now working on the alert, select it, and change the **Alert status** to **Acknowledged**:

[![Select and acknowledge the alert](./media/quickstart-remote-monitoring-deploy/maintenanceacknowledge-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenanceacknowledge-expanded.png#lightbox)

The value in the status column changes to **Acknowledged**.

To act on the chiller, scroll-down to **Related information**, select the chiller device in the **Alerted devices** list, and then choose **Jobs**:

[![Select the device and schedule an action](./media/quickstart-remote-monitoring-deploy/maintenanceschedule-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenanceschedule-expanded.png#lightbox)

In the **Jobs** panel, choose **Run method** and then the **EmergencyValveRelease** method. Add the job name **ChillerPressureRelease**, and click **Apply**. These settings create a job that executes immediately.

To view the job status, return to the **Maintenance** page and view the list of jobs in the **Jobs** view. You may need to wait a few seconds before you can see the job has run to release the valve pressure on the chiller:

[![The status of the jobs in the Jobs view](./media/quickstart-remote-monitoring-deploy/maintenancerunningjob-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenancerunningjob-expanded.png#lightbox)

### Check the pressure is back to normal

To view the pressure telemetry for the chiller, navigate to the **Dashboard** page, select **Pressure** in the telemetry panel, and confirm that the pressure for **chiller-02.0** is back to normal:

[![Pressure back to normal](./media/quickstart-remote-monitoring-deploy/pressurenormal-inline.png)](./media/quickstart-remote-monitoring-deploy/pressurenormal-expanded.png#lightbox)

To close the incident, navigate to the **Maintenance** page, select the alert, and set the status to **Closed**:

[![Select and close the alert](./media/quickstart-remote-monitoring-deploy/maintenanceclose-inline.png)](./media/quickstart-remote-monitoring-deploy/maintenanceclose-expanded.png#lightbox)

The value in the status column changes to **Closed**.

## Clean up resources

If you plan to move on to the tutorials, leave the Remote Monitoring solution accelerator deployed.

If you no longer need the solution accelerator, delete it from the [Provisioned solutions](https://www.azureiotsolutions.com/Accelerators#dashboard) page, by selecting it, and then clicking **Delete Solution**:

![Delete solution](media/quickstart-remote-monitoring-deploy/deletesolution.png)

## Next steps

In this quickstart, you've deployed the Remote Monitoring solution accelerator and completed a monitoring task using the simulated devices in the default Contoso deployment.

To learn more about the solution accelerator using simulated devices, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Monitor your IoT devices](iot-accelerators-remote-monitoring-monitor.md)