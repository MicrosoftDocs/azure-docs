---
title: Tutorial - Azure IoT connected waste management | Microsoft Docs
description: This tutorial shows you how to deploy and use the connected waste management application template for IoT Central.
author: miriambrus
ms.author: miriamb
ms.date: 08/02/2021
ms.topic: tutorial
ms.service: iot-central
services: iot-central
---
# Tutorial: Deploy and walk through the connected waste management application template

Use the IoT Central *connected waste management* application template and the guidance in this article to develop an end-to-end connected waste management solution.

:::image type="content" source="media/tutorial-connectedwastemanagement/concepts-connected-waste-management-architecture-1.png" alt-text="Connected waste management architecture.":::

### Devices and connectivity

Devices such as waste bins that are used in open environments may connect through low-power wide area networks (LPWAN) or through a third-party network operator. For these types of devices, use the [Azure IoT Central Device Bridge](../core/howto-build-iotc-device-bridge.md) to send your device data to your IoT application in Azure IoT Central. You can also use device gateways that are IP capable and that can connect directly to IoT Central.

### IoT Central

Azure IoT Central is an IoT App platform that helps you quickly build and deploy an IoT solution. You can brand, customize, and integrate your solution with third-party services.

When you connect your smart waste devices to IoT Central, the application provides device command and control, monitoring and alerting, a user interface with built-in RBAC, configurable dashboards, and extensibility options.

### Extensibility and integrations

You can extend your IoT application in IoT Central and optionally:

* Transform and integrate your IoT data for advanced analytics, for example training machine learning models, through continuous data export from IoT Central application.
* Automate workflows in other systems by triggering actions using Power Automate or webhooks from IoT Central application.
* Programatically access your IoT application in IoT Central through IoT Central APIs.

### Business applications

You can use IoT data to power various business applications within a waste utility. For example, in a connected waste management solution you can optimize the dispatch of trash collections trucks. The optimization can be done based on IoT sensors data from connected waste bins. In your [IoT Central connected waste management application](./tutorial-connected-waste-management.md) you can configure rules and actions, and set them to create alerts in [Connected Field Service](/dynamics365/field-service/connected-field-service). Configure Power Automate in IoT Central rules to automate workflows across applications and services. Additionally, based on service activities in Connected Field Service, information can be sent back to Azure IoT Central.

You can easily configure the following integration processes with IoT Central and Connected Field Service:

* Azure IoT Central can send information about device anomalies to Connected Field Service for diagnosis.
* Connected Field Service can create cases or work orders triggered from device anomalies.
* Connected Field Service can schedule technicians for inspection to prevent the downtime incidents.
* Azure IoT Central device dashboard can be updated with relevant service and scheduling information.

In this tutorial, you learn how to:

> [!div class="checklist"]

> * Use the Azure IoT Central *Connected waste management* template to create your app.
> * Explore and customize the dashboard. 
> * Explore the connected waste bin device template.
> * Explore simulated devices.
> * Explore and configure rules.
> * Configure jobs.
> * Customize your application branding.

## Prerequisites

* There are no specific prerequisites required to deploy this app.
* You can use the free pricing plan or use an Azure subscription.

## Create connected waste management application

1. Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. Select **Build** from the left-hand navigation bar and then select the **Government** tab:
    :::image type="content" source="media/tutorial-connectedwastemanagement/iot-central-government-tab-overview.png" alt-text="Connected waste management template":::

1. Select **Create app** under **Connected waste management**.

To learn more, see [Create an IoT Central application](../core/howto-create-iot-central-application.md).

## Walk through the application

The following sections walk you through the key features of the application:

### Dashboard 

After you deploy the application template, your default dashboard is **Wide World waste management dashboard**.

:::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-dashboard-1.png" alt-text="Screenshot of Wide World waste management dashboard.":::


As a builder, you can create and customize views on the dashboard for operators. First, let's explore the dashboard. 

>[!NOTE]
>All data shown in the dashboard is based on simulated device data, which you'll see  more of in the next section. 

The dashboard consists of different tiles:

* **Wide World Waste utility image tile**: The first tile in the dashboard is an image tile of a fictitious waste utility, "Wide World Waste." You can customize the tile and put in your own image, or you can remove it. 

* **Waste bin image tile**: You can use image and content tiles to create a visual representation of the device that's being monitored, along with a description. 

* **Fill level KPI tile**: This tile displays a value reported by a *fill level* sensor in a waste bin. Fill level and other sensors, like *odor meter* or *weight* in a waste bin, can be remotely monitored. An operator can take action, like dispatching a trash collection truck. 

* **Waste monitoring area map**: This tile uses Azure Maps, which you can configure directly in Azure IoT Central. The map tile displays device [location](../core/howto-use-location-data.md). Try to hover over the map and try the controls over the map, like zoom-in, zoom-out, or expand.

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-dashboard-map.png" alt-text="Screenshot of Connected Waste Management Template Dashboard map.":::



* **Fill, odor, weight level bar chart**: You can visualize one or multiple kinds of device telemetry data in a bar chart. You can also expand the bar chart.  

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-dashboard-bar-chart.png" alt-text="Screenshot of Connected Waste Management Template Dashboard bar chart..":::


* **Field Services**: The dashboard includes a link to how to integrate with Dynamics 365 Field Services from your Azure IoT Central application. For example, you can use Field Services to create tickets for dispatching trash collection services. 

### Customize the dashboard 

You can customize the dashboard by selecting the **Edit** menu. Then you can add new tiles or configure existing ones. Here's what the dashboard looks like in editing mode: 

:::image type="content" source="media/tutorial-connectedwastemanagement/edit-dashboard.png" alt-text="Screenshot of Connected Waste Management Template Dashboard in editing mode.":::


You can also select **+ New** to create a new dashboard and configure from scratch. You can have multiple dashboards, and you can switch between your dashboards from the dashboard menu. 

### Explore the device template

A device template in Azure IoT Central defines the capabilities of a device, which can include telemetry, properties, or commands. As a builder, you can define device templates that represent the capabilities of the devices you will connect. 

The Connected waste management application comes with a sample template for a connected waste bin device.

To view the device template:

1. In Azure IoT Central, from the left pane of your app, select **Device templates**. 

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-device-template.png" alt-text="Screenshot showing the list of device templates in the application.":::


1. In the **Device templates** list, select **Connected Waste Bin**.

1. Examine the device template capabilities. You can see that it defines sensors like **Fill level**, **Odor meter**, **Weight**, and **Location**.

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-device-template-connected-bin.png" alt-text="Screenshot showing the details of the Connected Waste Bin device template..":::


### Customize the device template

Try to customize the following:

1. From the device template menu, select **Customize**.
1. Find the **Odor meter** telemetry type.
1. Update the **Display name** of **Odor meter** to **Odor level**.
1. Try to update the unit of measurement, or set **Min value** and **Max value**.
1. Select **Save**. 

### Add a cloud property 

Here's how:

1. From the device template menu, select **Cloud property**.
1. Select **+ Add Cloud Property**. In Azure IoT Central, you can add a property that is relevant to the device but isn't expected to be sent by a device. For example, a cloud property might be an alerting threshold specific to installation area, asset information, or maintenance information. 
1. Select **Save**. 
 
### Views 

The connected waste bin device template comes with predefined views. Explore the views, and update them if you want to. The views define how operators see the device data and input cloud properties. 

:::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-device-template-views.png" alt-text="Screenshot of Connected Waste Management Template Device templates views..":::


### Publish 

If you made any changes, remember to publish the device template. 

### Create a new device template 

To create a new device template, select **+ New**, and follow the steps. You can create a custom device template from scratch, or you can choose a device template from the Azure device catalog. 

### Explore simulated devices

In Azure IoT Central, you can create simulated devices to test your device template and application. 

The Connected waste management application has two simulated devices associated with the connected waste bin device template. 

### View the devices

1. From the left pane of Azure IoT Central, select **Device**. 

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-devices.png" alt-text="Screenshot of Connected Waste Management Template devices.":::


1. Select **Connected Waste Bin** device.  

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-devices-bin-1.png" alt-text="Screenshot of Connected Waste Management Template Device Properties.":::


1. Go to the **Cloud Properties** tab. Update the value of **Bin full alert threshold** from **95** to **100**. 

Explore the **Device Properties** and **Device Dashboard** tabs. 

> [!NOTE]
> All the tabs have been configured from the device template views.

### Add new devices

You can add new devices by selecting **+ New** on the **Devices** tab. 

## Explore and configure rules

In Azure IoT Central, you can create rules to automatically monitor device telemetry, and to trigger actions when one or more conditions are met. The actions might include sending email notifications, triggering an action in Power Automate, or starting a webhook action to send data to other services.

The Connected waste management application has four sample rules.

### View rules

1. From the left pane of Azure IoT Central, select **Rules**.

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-rules.png" alt-text="Screenshot of Connected Waste Management Template Rules.":::


1. Select **Bin full alert**.

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-bin-full-alert.png" alt-text="Screenshot of Bin full alert.":::


 1. The **Bin full alert** checks the following condition: **Fill level is greater than or equal to Bin full alert threshold**.

    The **Bin full alert threshold** is a cloud property that's defined in the connected waste bin device template. 

Now let's create an email action.

### Create an email action

In the **Actions** list of the rule, you can configure an email action:
1. Select **+ Email**. 
1. For **Display name**, enter **High pH alert**.
1. For **To**, enter the email address associated with your Azure IoT Central account. 
1. Optionally, enter a note to include in the text of the email.
1. Select **Done** > **Save**. 

You'll now receive an email when the configured condition is met.

>[!NOTE]
>The application sends email each time a condition is met. Disable the rule to stop receiving email from the automated rule. 
  
To create a new rule, from the left pane of **Rules**, select **+New**.

## Configure jobs

In Azure IoT Central, jobs allow you to trigger device or cloud properties updates on multiple devices. You can also use jobs to trigger device commands on multiple devices. Azure IoT Central automates the workflow for you. 

1. From the left pane of Azure IoT Central, select **Jobs**. 
1. Select **+New**, and configure one or more jobs. 

## Customize your application 

As a builder, you can change several settings to customize the user experience in your application.

### Change the application theme

Here's how:
1. Go to **Administration** > **Customize your application**.
1. Select **Change** to choose an image to upload for the **Application logo**.
1. Select **Change** to choose an image to upload for the **Browser icon** (an image that will appear on browser tabs).
1. You can also replace the default browser colors by adding HTML hexadecimal color codes. Use the **Header** and **Accent** fields for this purpose.

    :::image type="content" source="media/tutorial-connectedwastemanagement/connected-waste-management-customize-your-application.png" alt-text="Screenshot of Connected Wast Management Template Customize your application.":::


1. You can also change application images. Select **Administration** > **Application settings** > **Select image** to choose an image to upload as the application image.
1. Finally, you can also change the theme by selecting **Settings** on the masthead of the application.

## Clean up resources

If you're not going to continue to use this application, delete your application with the following steps:

1. From the left pane of your Azure IoT Central app, select **Administration**.
1. Select **Application settings** > **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Connected water consumption concepts](./tutorial-water-consumption-monitoring.md)
