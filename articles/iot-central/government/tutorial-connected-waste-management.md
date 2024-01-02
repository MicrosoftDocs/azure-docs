---
title: Tutorial - Azure IoT connected waste management
description: This tutorial shows you how to deploy and use the connected waste management application template for IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 06/13/2023
ms.topic: tutorial
ms.service: iot-central
services: iot-central
---

# Tutorial: Deploy and walk through the connected waste management application template

The _connected waste management_ application template helps you kickstart your IoT solution development to remotely monitor to maximize efficient waste collection as part of a smart city.

:::image type="content" source="media/tutorial-connected-waste-management/concepts-connected-waste-management-architecture-1.png" alt-text="Diagram showing the architecture of the connected waste management application." border="false":::

### Devices and connectivity (1,2)

Devices such as waste bins that are used in open environments may connect through low-power wide area networks or through a third-party network operator. For these types of devices, use the [Azure IoT Central Device Bridge](../core/howto-build-iotc-device-bridge.md) to send your device data to your IoT Central application. You can also use an IP capable device gateway that connects directly to your IoT Central application.

### IoT Central

Azure IoT Central is an IoT App platform that helps you quickly build and deploy an IoT solution. You can brand, customize, and integrate your solution with third-party services.

When you connect your smart waste devices to IoT Central, the application provides:

- Device command and control.
- Monitoring and alerting.
- A user interface with built-in role-based access controls.
- Configurable dashboards.
- Extensibility options.

### Extensibility and integrations (3)

You can extend your IoT application in IoT Central and optionally:

- Transform and integrate your IoT data for advanced analytics through data export from your IoT Central application.
- Automate workflows in other systems by triggering actions using Power Automate or webhooks from IoT Central application.
- Programmatically access your IoT Central application by using the IoT Central REST APIs.

### Business applications (4)

You can use IoT data to power various business applications within a waste utility. For example, in a connected waste management solution you can optimize the dispatch of trash collections trucks. The optimization can be done based on IoT sensors data from connected waste bins. In your IoT Central connected waste management application, you can configure rules and actions and set them to create alerts in [Connected Field Service](/dynamics365/field-service/connected-field-service). Configure Power Automate in IoT Central rules to automate workflows across applications and services. Additionally, based on service activities in Connected Field Service, information can be sent back to Azure IoT Central.

You can easily configure the following integration processes with IoT Central and Connected Field Service:

- Azure IoT Central can send information about device anomalies to Connected Field Service for diagnosis.
- Connected Field Service can create cases or work orders triggered from device anomalies.
- Connected Field Service can schedule technicians for inspection to prevent the downtime incidents.
- Azure IoT Central device dashboard can be updated with relevant service and scheduling information.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use the Azure IoT Central *connected waste management* application template to create your app.
> * Explore and customize the dashboard.
> * Explore the connected waste bin device template.
> * Explore simulated devices.
> * Explore and configure rules.
> * Configure jobs.
> * Customize your application branding.

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create connected waste management application

To create your IoT Central application:

1. Navigate to the [Create IoT Central Application](https://portal.azure.com/#create/Microsoft.IoTCentral) page in the Azure portal. If prompted, sign in with your Azure account.

1. Enter the following information:

    | Field | Description |
    | ----- | ----------- |
    | Subscription | The Azure subscription you want to use. |
    | Resource group | The resource group you want to use.  You can create a new resource group or use an existing one. |
    | Resource name | A valid Azure resource name. |
    | Application URL | The URL subdomain for your application. The URL for an IoT Central application looks like `https://yoursubdomain.azureiotcentral.com`. |
    | Template | **Connected Waste Management** |
    | Region | The Azure region you want to use. |
    | Pricing plan | The pricing plan you want to use. |

1. Select **Review + create**. Then select **Create**.

[!INCLUDE [iot-central-navigate-from-portal](../../../includes/iot-central-navigate-from-portal.md)]

## Walk through the application

The following sections walk you through the key features of the application:

### Dashboard

After you deploy the application template, your default dashboard is **Wide World waste management dashboard**.

:::image type="content" source="media/tutorial-connected-waste-management/connected-waste-management-dashboard.png" alt-text="Screenshot of the connected waste management application dashboard." lightbox="media/tutorial-connected-waste-management/connected-waste-management-dashboard.png":::

As a builder, you can create and customize views on the dashboard for operators.

>[!NOTE]
>All data shown in the dashboard is based on simulated device data, which you see more of in the next section.

The dashboard consists of different tiles:

- **Wide World Waste utility image tile**: The first tile in the dashboard is an image tile of a fictitious waste utility, "Wide World Waste." You can customize the tile and put in your own image, or you can remove it.

- **Waste bin image tile**: You can use image and content tiles to create a visual representation of the device that's being monitored, along with a description.

- **Fill level KPI tile**: This tile displays a value reported by a *fill level* sensor in a waste bin. Fill level and other sensors, like *odor meter* or *weight* in a waste bin, can be remotely monitored. An operator can take an action such as dispatching a trash collection truck.

- **Waste monitoring area map**: This tile uses Azure Maps, which you can configure directly in Azure IoT Central. The map tile displays device location. Try to hover over the map and try the controls over the map, like zoom-in, zoom-out, or expand.

- **Fill, odor, weight level bar chart**: You can visualize one or multiple kinds of device telemetry data in a bar chart. You can also expand the bar chart.  

    :::image type="content" source="media/tutorial-connected-waste-management/connected-waste-management-dashboard-bar-chart.png" alt-text="Screenshot of the expanded bar chart on the connected waste management application dashboard." lightbox="media/tutorial-connected-waste-management/connected-waste-management-dashboard-bar-chart.png":::

- **Field Services**: The dashboard includes a link to "How to integrate with Dynamics 365 Field Services from your Azure IoT Central application." For example, you can use Field Services to create tickets for dispatching trash collection services.

### Customize the dashboard

You can customize the dashboard by selecting the **Edit** menu. Then you can add new tiles or configure existing ones. Here's what the dashboard looks like in editing mode:

:::image type="content" source="media/tutorial-connected-waste-management/edit-dashboard.png" alt-text="Screenshot of the connected waste management application dashboard in edit mode." lightbox="media/tutorial-connected-waste-management/edit-dashboard.png":::

You can also select **+ New** to create a new dashboard and configure from scratch. You can have multiple dashboards, and you can switch between your dashboards from the dashboard menu.

### Explore the device template

A device template in Azure IoT Central defines the capabilities of a device, which can include telemetry, properties, or commands. As a builder, you can define device templates that represent the capabilities of the devices you will connect.

The connected waste management application comes with a sample template for a connected waste bin device.

To view the device template:

1. In Azure IoT Central, from the left pane of your app, select **Device templates**.

1. In the **Device templates** list, select **Connected Waste Bin**.

1. Examine the device template capabilities. You can see that it defines sensors like **Fill level**, **Odor meter**, **Weight**, and **Location**.

    :::image type="content" source="media/tutorial-connected-waste-management/connected-waste-management-device-template-connected-bin.png" alt-text="Screenshot of the connected waste management device template." lightbox="media/tutorial-connected-waste-management/connected-waste-management-device-template-connected-bin.png":::

### Customize the device template

Try to customize the following features:

1. From the device template menu, select **Customize**.
1. Find the **Odor meter** telemetry type.
1. Update the **Display name** of **Odor meter** to **Odor level**.
1. Try to update the unit of measurement, or set **Min value** and **Max value**.
1. Select **Save**.

### Add a cloud property

To add a cloud property:

1. Navigate to the **Connected Waste Bin** device template, and select **+ Add capability**.
1. Add a new cloud property by selecting **Cloud Property** as **Capability type**. In Azure IoT Central, you can add a property that is relevant to a device but that doesn't come from the device.  For example, a cloud property might be an alerting threshold specific to installation area, asset information, or maintenance information.
1. Select **Save**.

### Views

The connected waste bin device template comes with predefined views. Explore the views, and update them if you want to. The views define how operators see the device data and input cloud properties.

:::image type="content" source="media/tutorial-connected-waste-management/connected-waste-management-device-template-views.png" alt-text="Screenshot of the connected waste management application device template views." lightbox="media/tutorial-connected-waste-management/connected-waste-management-device-template-views.png":::

### Publish

If you made any changes, remember to publish the device template.

### Create a new device template

To create a new device template, select **+ New**, and follow the steps. You can create a custom device template from scratch, or you can choose a device template from the Azure device catalog.

### Explore simulated devices

In Azure IoT Central, you can create simulated devices to test your device template and application.

The connected waste management application has two simulated devices associated with the connected waste bin device template.

### View the devices

1. From the left pane of Azure IoT Central, select **Device**.

1. Select **Connected Waste Bin** device.  

    :::image type="content" source="media/tutorial-connected-waste-management/connected-waste-management-devices-bin.png" alt-text="Screenshot of the connected waste management application devices page." lightbox="media/tutorial-connected-waste-management/connected-waste-management-devices-bin.png":::

Explore the **Device Properties** and **Device Dashboard** tabs.

> [!NOTE]
> All the tabs have been configured from the device template views.

### Add new devices

You can add new devices by selecting **+ New** on the **Devices** tab.

## Explore and configure rules

In Azure IoT Central, you can create rules to automatically monitor device telemetry, and to trigger actions when one or more conditions are met. The actions might include sending email notifications, triggering an action in Power Automate, or starting a webhook action to send data to other services.

The connected waste management application has four sample rules.

### View rules

1. From the left pane of Azure IoT Central, select **Rules**.

1. Select **Bin full alert**.

    :::image type="content" source="media/tutorial-connected-waste-management/connected-waste-management-bin-full-alert.png" alt-text="Screenshot of the connected waste management application bin full rule." lightbox="media/tutorial-connected-waste-management/connected-waste-management-bin-full-alert.png":::

1. The **Bin full alert** checks the following condition: **Fill level is greater than or equal to Bin full alert threshold**.

    The **Bin full alert threshold** is a cloud property that's defined in the connected waste bin device template.

Now create an email action.

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

[!INCLUDE [iot-central-customize-appearance](../../../includes/iot-central-customize-appearance.md)]

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources-industry](../../../includes/iot-central-clean-up-resources-industry.md)]

## Next steps

> [!div class="nextstepaction"]
> [Connected water consumption concepts](./tutorial-water-consumption-monitoring.md)
