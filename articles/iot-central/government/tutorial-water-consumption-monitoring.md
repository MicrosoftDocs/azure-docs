---
title: Tutorial - Azure IoT water consumption monitoring | Microsoft Docs
description: This tutorial shows you how to deploy and use the water consumption monitoring application template for IoT Central.
author: miriambrus
ms.author: miriamb
ms.date: 08/02/2021
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: abjork
---

# Tutorial:  Deploy and walk through the water consumption monitoring application

Use the IoT Central *water consumption monitoring* application template and the guidance in this article to develop an end-to-end water consumption monitoring solution.

![Water consumption monitoring architecture](./media/tutorial-waterconsumptionmonitoring/concepts-waterconsumptionmonitoring-architecture1.png)

### Devices and connectivity

Water management solutions use smart water devices such as flow meters, water quality monitors, smart valves, leak detectors.

Devices in smart water solutions may connect through low-power wide area networks (LPWAN) or through a third-party network operator. For these types of devices, use the [Azure IoT Central Device Bridge](../core/howto-build-iotc-device-bridge.md) to send your device data to your IoT application in Azure IoT Central. You can also use device gateways that are IP capable and that can connect directly to IoT Central.

### IoT Central

Azure IoT Central is an IoT App platform that helps you quickly build and deploy an IoT solution. You can brand, customize, and integrate your solution with third-party services.

When you connect your smart water devices to IoT Central, the application provides device command and control, monitoring and alerting, a user interface with built-in RBAC, configurable dashboards, and extensibility options.

### Extensibility and integrations

You can extend your IoT application in IoT Central and optionally:

* Transform and integrate your IoT data for advanced analytics, for example training machine learning models, through continuous data export from IoT Central application.
* Automate workflows in other systems by triggering actions using Power Automate or webhooks from IoT Central application.
* Programmatically access your IoT application in IoT Central through IoT Central APIs.

### Business applications

You can use IoT data to power various business applications within a water utility. In your [IoT Central water consumption monitoring application](tutorial-water-consumption-monitoring.md) you can configure rules and actions, and set them to create alerts in [Connected Field Service](/dynamics365/field-service/connected-field-service). Configure Power Automate in IoT Central rules to automate workflows across applications and services. Additionally, based on service activities in Connected Field Service, information can be sent back to Azure IoT Central.

In this tutorial, you learn how to:

> [!div class="checklist"]

> * Use the Azure IoT Central water consumption monitoring template to create your water consumption monitoring application.
> * Explore and customize the dashboard.
> * Explore device templates.
> * Explore simulated devices.
> * Explore and configure rules.
> * Configure jobs.
> * Customize your application branding by using white labeling.

## Prerequisites

* There are no specific prerequisites required to deploy this app.
* You can use the free pricing plan or use an Azure subscription.

## Create water consumption monitoring application

Create the application using following steps:

1. Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. Select **Build** from the left-hand navigation bar and then select the **Government** tab:
    :::image type="content" source="media/tutorial-waterconsumptionmonitoring/iot-central-government-tab-overview1.png" alt-text="Application template":::

1. Select **Create app** under **Water consumption monitoring**.

To learn more, see [Create an IoT Central application](../core/howto-create-iot-central-application.md).

## Walk through the application

The following sections walk you through the key features of the application:

### Dashboard

After you create the application, the sample **Wide World water consumption dashboard** opens.
  
:::image type="content" source="media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-dashboard-full.png" alt-text="Water consumption monitoring dashboard.":::


You can create and customize views on the dashboard for operators.

> [!NOTE]
> All data displayed on the dashboard is based on simulated device data, which you will explore in the next section.
  
The dashboard consists of different kinds of tiles:

* **Wide World Water Utility image tile**: The first tile in the dashboard is an image tile of the fictitious water utility Wide World Water. You can customize the tile by inserting your own image or removing it.
* **Average water flow KPI tile**: The KPI tile is configured to display as an example *the average in the last 30 minutes*. You can customize the KPI tile and set it to a different type and time range.
* **Device command tiles**: These tiles include the **Close valve**, **Open valve**, and **Set valve position** tiles. Selecting the commands takes you to the simulated device command page. In Azure IoT Central, a *command* is a *device capability* type. We'll explore this concept later in the [Device template](../government/tutorial-water-consumption-monitoring.md#explore-the-device-template) section of this tutorial.

* **Water distribution area map**: The map uses Azure Maps, which you can configure directly in Azure IoT Central. The map tile displays the device [location](../core/howto-use-location-data.md). Hover over the map and try the controls over the map, like *zoom in*, *zoom out*, or *expand*.

    :::image type="content" source="media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-dashboard-map.png" alt-text="Water consumption monitoring dashboard map":::

* **Average water flow line chart** and **Environmental condition line chart**: You can visualize one or multiple device telemetries plotted as a line chart over a desired time range.
* **Average valve pressure heatmap chart**: You can choose the heatmap visualization type of device telemetry data you want to see distributed over a time range with a color index.
* **Reset alert thresholds content tile**: You can include call-to-action content tiles and embed a link to an action page. In this case, the reset alert threshold takes you to the application **Jobs**, where you can run updates to device properties. You'll explore this option later in the [Configure jobs](../government/tutorial-water-consumption-monitoring.md#configure-jobs) section of this tutorial.
* **Property tiles**: The dashboard displays **Valve operational info**, **Flow alert thresholds**, and **Maintenance info** tiles.

### Customize the dashboard

You can customize views in the dashboard for operators.

1. Select **Edit** to customize the **Wide World water consumption dashboard**. You can customize the dashboard by selecting the **Edit** menu. After the dashboard is in **edit** mode, you can add new tiles or you can configure it.

    :::image type="content" source="media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-edit-dashboard.png" alt-text="Edit dashboard":::

To learn more, see [Create and customize dashboards](../core/howto-manage-dashboards.md).

## Explore the device template

 In Azure IoT Central, a device template defines the capabilities of a device. Device capabilities include telemetry sent by device sensors, device properties, and commands the device can execute. You can define one or more device templates in Azure IoT Central that represent the capability of the devices that you'll connect.

The water consumption monitoring application comes with two reference device templates that represent a *flow meter* and a *smart valve* device.

To view the device template:

1. Select **Device templates** on the left pane of your application in Azure IoT Central. In the **Device templates** list, you'll see two device templates, **Smart Valve** and **Flow meter**.

   ![Device template](./media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-device-template.png)

1. Select the **Flow meter** device template, and familiarize yourself with the device capabilities.

     ![Device template Flow meter](./media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-device-template-flow-meter.png)

### Customize the device template

To customize the device template:

1. Go to **Customize** on the **Device templates** menu.
1. Find the `Temperature` telemetry type.
1. Update the **Display Name** of `Temperature` to `Reported temperature`.
1. Update the unit of measurement, or set the **Min value** and **Max value**.
1. Select **Save** to save any changes.

    ![Customize the device template.](./media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-device-template-customize.png)

### Add a cloud property

1. Go to **Cloud Properties** on the **Device templates** menu.
1. Add a new cloud property by selecting **+ Add Cloud Property**.
    In Azure IoT Central, you can add a property that's relevant to the device. As an example, a cloud property could be an alerting threshold specific to an installation area, asset information, or other maintenance information.
1. Select **Save** to save any changes.

To learn more, see [Cloud properties](../core/concepts-device-templates.md#cloud-properties).


### Views

The water consumption monitor device template comes with predefined views. The views define how operators see the device data, and set the values of cloud properties.

  ![Device template views](./media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-device-template-views.png)

To learn more, see [Views](../core/concepts-device-templates.md#views).

### Publish the device template

Navigate to device templates page and select **Publish** to save any changes made to the device template.

To learn more, see [How to publish templates](../core/howto-set-up-template.md#publish-a-device-template).

### Create a new device template

Select **+ New** to create a new device template and follow the creation process.
You can create a custom device template from scratch, or you can choose a device template from the Azure Device Catalog.

To learn more, see [How to add device templates](../core/howto-set-up-template.md).

## Explore simulated devices

In Azure IoT Central, you can create simulated devices to test your device template and application. The water consumption monitoring application has two simulated devices mapped to the **Flow meter** and **Smart Valve** device templates.

### View the devices

1. Select **Devices** > **All devices** on the left pane.

    :::image type="content" source="media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-devices.png" alt-text="All devices pane":::

1. Select **Smart Valve 1**.

    :::image type="content" source="media/tutorial-waterconsumptionmonitoring/water-consumption-monitor-device-1.png" alt-text="Smart Valve 1":::

1. On the **Commands** tab, you can see the three device commands (**Close valve**, **Open valve**, and **Set valve position**) that are capabilities defined in the **Smart Valve** device template.

1. Explore the **Device Properties** tab and the **Device Dashboard** tab.

> [!NOTE]
> The views you see on this page are configured using the **Device Template > Views** page. 

### Add new devices

Add new devices by selecting **+ New** on the **Devices** tab.

To learn more, see [Manage devices](../core/howto-manage-devices-individually.md).

## Explore rules

In Azure IoT Central, you can create rules to automatically monitor device telemetry and trigger actions when one or more conditions are met. The actions might include sending email notifications or triggering a Microsoft Power Automate action or a webhook action to send data to other services.

The water consumption monitoring application you created has three preconfigured rules.

### View rules

1. Select **Rules** on the left pane.

    :::image type="content" source="media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-rules.png" alt-text="Rules pane":::

1. Select **High water flow alert**, which is one of the preconfigured rules in the application.

    :::image type="content" source="media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-high-flow-alert.png" alt-text="High pH alert":::

    The `High water flow alert` rule is configured to check against the condition `Flow` is `greater than` the `Max flow threshold`. Flow threshold is a cloud property defined in the **Smart Valve** device template. The value of `Max flow threshold` is set per device instance.

Next, you can create an email action.

To add an action to the rule:

1. Select **+ Email**.
1. Enter **High flow alert** as the friendly **Display name** for the action.
1. Enter the email address associated with your Azure IoT Central account in **To**.
1. Optionally, enter a note to include in the text of the email.
1. Select **Done** to complete the action.
1. Select **Save** to save the new rule.
1. Enable the rule.

Within a few minutes, you'll receive an email after the configured condition is met.

> [!NOTE]
> The application sends an email each time a condition is met. Select **Disable** to disable the rule to stop receiving email from the automated rule.
  
To create a new rule:

To create a new rule, select **+ New** on the **Rules** tab on the left pane.

## Configure jobs

In Azure IoT Central, jobs allow you to trigger device or cloud property updates on multiple devices. In addition to properties, you can also use jobs to trigger device commands on multiple devices. Azure IoT Central automates the workflow for you.

1. Select **Jobs** on the left pane.
1. Select **+ New**, and configure one or more jobs.

To learn more, see [How to run a job](../core/howto-manage-devices-in-bulk.md).

## Customize your application

As a administrator, you can change several settings to customize the user experience in your application.

1. Select **Administration** > **Customize your application**.
1. To choose an image to upload as the **Application logo**, select the **Change** button.
1. To choose a **Browser icon** image that will appear on browser tabs, select the **Change** button.
1. You can also replace the default **Browser colors** by adding HTML hexadecimal color codes. For more information about **HEX Value** color notation, see [HTML Colors](https://www.w3schools.com/html/html_colors.asp).

   ![Selections for application logo, browser icon, and browser colors](./media/tutorial-waterconsumptionmonitoring/water-consumption-monitoring-customize-your-application.png)

1. You can also change application images by selecting **Administration** > **Application settings**. To choose an image to upload as the application image, select the **Select image** button.


## Clean up resources

If you're not going to continue to use this application, delete it.

1. Select **Administration** on the left pane of your Azure IoT Central application.
1. Select **Application settings**, and then select **Delete** at the bottom of the page.

## Next steps
 
The suggested next step is to learn about [Water quality monitoring](./tutorial-water-quality-monitoring.md).