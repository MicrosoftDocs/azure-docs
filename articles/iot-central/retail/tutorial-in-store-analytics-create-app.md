---
title: Tutorial - Create and deploy an Azure IoT in-store analytics application template | Microsoft Docs
description: This tutorial shows how to create and deploy an in-store analytics retail application in IoT Central.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.custom: [iot-storeAnalytics-checkout, iot-p0-scenario]
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2022
---

# Tutorial: Create and deploy an in-store analytics application template

For many retailers, environmental conditions are a key way to differentiate their stores from their competitors' stores. The most successful retailers make every effort to maintain pleasant conditions within their stores for the comfort of their customers.

To build an end-to-end solution, you can use the IoT Central _in-store analytics checkout_ application template. This template lets you digitally connect to and monitor a store's environment through various sensor devices. These devices generate telemetry that retailers can convert into business insights to help reduce operating costs and create a great experience for their customers.

The application template comes with a set of device templates and uses a set of simulated devices to populate the dashboard:

:::image type="content" source="media/tutorial-in-store-analytics-create-app/store-analytics-architecture-frame.png" alt-text="Diagram of the in-store analytics application architecture." border="false":::

As shown in the preceding application architecture diagram, you can use the application template to:

* **1**. Connect various IoT sensors to an IoT Central application instance.

   An IoT solution starts with a set of sensors that capture meaningful signals from within a retail store environment. The sensors are represented by the various icons at the far left of the architecture diagram.

* **2**. Monitor and manage the health of the sensor network and any gateway devices in the environment.

   Many IoT sensors can feed raw signals directly to the cloud or to a gateway device located near them. The gateway device aggregates data at the edge before it sends summary insights to an IoT Central application. The gateway device is also responsible for relaying command and control operations to the sensor devices when applicable.

* **3**. Create custom rules around the environmental conditions within a store to trigger alerts for store managers.

   The Azure IoT Central application ingests data from the various IoT sensors and gateway devices within the retail store environment and then generates a set of meaningful insights.

   Azure IoT Central also provides a tailored experience to store operators that enables them to remotely monitor and manage the infrastructure devices.

* **4**. Transform the environmental conditions within the stores into insights that the store team can use to improve the customer experience.

   You can configure an Azure IoT Central application within a solution to export raw or aggregated insights to a set of Azure platform as a service (PaaS) services. PAAS services can perform data manipulation and enrich these insights before landing them in a business application.

* **5**. Export the aggregated insights into existing or new business applications to provide useful and timely information to retail staff.

   The IoT data can be used to power different kinds of business applications deployed within a retail environment. A retail store manager or staff member can use these applications to visualize business insights and take meaningful action in real time. To learn how to build a real-time Power BI dashboard for your retail team, see [tutorial](./tutorial-in-store-analytics-customize-dashboard.md).

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> - Use the Azure IoT Central *In-store analytics - checkout* template to create a retail store application
> - Customize the application settings
> - Create and customize IoT device templates
> - Connect devices to your application
> - Add rules and actions to monitor conditions

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an in-store analytics application

Create the application by doing the following:

1. Sign in to the [Azure IoT Central](https://aka.ms/iotcentral) build site with a Microsoft personal, work, or school account. 

1. On the left pane, select **Build**, and then select the **Retail** tab.

1. Under **In-store analytics - checkout**, select **Create app**.

To learn more, see [Create an IoT Central application](../core/howto-create-iot-central-application.md).

## Walk through the application

The following sections describe the key features of the application.

### Customize the application settings

You can change several settings to customize the user experience in your application. In this section, you select a predefined application theme. Optionally, you'll learn how to create a custom theme and update the application image. A custom theme enables you to set the application browser colors, the browser icon, and the application logo that appears in the masthead.

To select a predefined application theme:

1. Select **Settings** on the masthead.

2. Select a new **Theme**.

3. Select **Save**.

Alternatively, you can create a custom theme. If you want to use a set of sample images to customize the application and complete the tutorial, download the [Contoso sample images](https://github.com/Azure-Samples/iot-central-docs-samples/tree/main/retail).

To create a custom theme:

1. On the left pane, select **Customization** > **Appearance**.

1. Select **Change**, and then select an image to upload as the masthead logo. Optionally, enter a value for **Logo alt text**.

1. Select **Change**, and then select a **Browser icon** image that will appear on browser tabs.

1. Optionally, replace the default **Browser colors** by adding HTML hexadecimal color codes:  
   a. For **Header**, enter **#008575**.  
   b. For **Accent**, enter **#A1F3EA**.

1. Select **Save**. After you save your changes, the application updates the browser colors, the logo in the masthead, and the browser icon.

To update the application image:

1. Select **Application** > **Management**. 

1. Select **Change**, and then select an image to upload as the application image. 

1. Select **Save**.

   The image appears on the application tile on the **My Apps** page of the [Azure IoT Central application manager](https://aka.ms/iotcentral) site.


### Create the device templates

By creating device templates, you and the application operators can configure and manage devices. You can build a custom template, import an existing template file, or import a template from the Azure IoT device catalog. After you create and customize a device template, use it to connect real devices to your application. 

Optionally, you can use a device template to generate simulated devices for testing.

The *In-store analytics - checkout* application template has device templates for several devices, including templates for two of the three devices you use in the application. The RuuviTag device template isn't included in the *In-store analytics - checkout* application template. 

In this section, you add a device template for RuuviTag sensors to your application. To do so:

1. On the left pane, select **Device Templates**.

1. Select **New** to create a new device template.

1. Search for and then select the **RuuviTag Multisensor** device template in the Azure IoT device catalog.

1. Select **Next: Review**.

1. Select **Create**. 

   The application adds the RuuviTag device template.

1. On the left pane, select **Device templates**. 

   The page displays all the device templates in the application template and the RuuviTag device template you just added.

:::image type="content" source="media/tutorial-in-store-analytics-create-app/device-templates-list.png" alt-text="Screenshot that shows the in-store analytics application device templates." lightbox="media/tutorial-in-store-analytics-create-app/device-templates-list.png":::

### Customize the device templates

You can customize the device templates in your application in three ways: 

* Customize the native built-in interfaces in your devices by changing the device capabilities.

   For example, with a temperature sensor, you can change details such as the display name of the temperature interface, the data type, the units of measurement, and the minimum and maximum operating ranges.

* Customize your device templates by adding cloud properties.

   Cloud properties aren't part of the built-in device capabilities. Cloud properties are custom data that your Azure IoT Central application creates, stores, and associates with your devices. Examples of cloud properties could be:
   * A calculated value
   * Metadata, such as a location that you want to associate with a set of devices

* Customize device templates by building custom views.

   Views provide a way for operators to visualize telemetry and metadata for your devices, such as device metrics and health.

In this section, you use the first two methods to customize the device template for your RuuviTag sensors.

**Customize the built-in interfaces of the RuuviTag device template**

1. On the left pane, select **Device Templates**.

1. Select **RuuviTag**.

1. Hide the left pane. The summary view of the template displays the device capabilities.

    :::image type="content" source="media/tutorial-in-store-analytics-create-app/ruuvitag-device-summary-view.png" alt-text="Screenshot that shows the in-store analytics application RuuviTag device template." lightbox="media/tutorial-in-store-analytics-create-app/ruuvitag-device-summary-view.png":::

1. Select the **RuuviTag** model in the RuuviTag device template menu.

1. In the list of capabilities, scroll for the **RelativeHumidity** telemetry type. It's the row item with the editable **Display name** value of *RelativeHumidity*.

In the following steps, you customize the **RelativeHumidity** telemetry type for the RuuviTag sensors. Optionally, you can customize some of the other telemetry types.

For the **RelativeHumidity** telemetry type, make the following changes:

1. Select the **Expand** control to expand the schema details for the row.

1. Update the **Display Name** value from **RelativeHumidity** to a custom value such as **Humidity**.

1. Change the **Semantic Type** option from **Relative humidity** to **Humidity**. 

   Optionally, set schema values for the humidity telemetry type in the expanded schema view. By setting schema values, you can create detailed validation requirements for the data that your sensors track. For example, you could set minimum and maximum operating range values for a specified interface.

1. Select **Save** to save your changes.

**Add a cloud property to a device template in your application**

Specify the following values to create a custom property to store the location of each device:

1. For **Display Name**, enter the **Location** value. 

   This value, which is a friendly name for the property, is automatically copied to the **Name**. You can use the copied value or change it.

1. For **Cloud Property**, select **Capability Type**.

1. In the **Schema** dropdown list, select **String**. 

   By specifying a string type, you can associate a location name string with any device that's based on the template. For instance, you could associate an area in a store with each device.

1. Set **Minimum Length** to **2**.

1. Set **Trim Whitespace** to **On**.

1. Select **Save** to save your custom cloud property.

1. Select **Publish**.

    Publishing a device template makes it visible to application operators. After you've published a template, use it to generate simulated devices for testing or to connect real devices to your application. If you already have devices connected to your application, publishing a customized template pushes the changes to the devices.

### Add devices

After you've created and customized the device templates, it's time to add devices.

For this tutorial, you use the following set of real and simulated devices to build the application:

- A real Rigado C500 gateway.
- Two real RuuviTag sensors.
- A simulated *Occupancy* sensor. This simulated sensor is included in the application template, so you don't need to create it. 

> [!NOTE]
> If you don't have real devices, you can still complete this tutorial by creating simulated RuuviTag sensors. The following directions include steps to create a simulated RuuviTag. You don't need to create a simulated gateway.

Complete the steps in the following two articles to connect a real Rigado gateway and RuuviTag sensors. After you're done, return to this tutorial. Because you've already created device templates in this tutorial, you don't need to create them again in the following set of directions.

- To connect a Rigado gateway, see [Connect a Rigado Cascade 500 to your Azure IoT Central application](../core/howto-connect-rigado-cascade-500.md).
- To connect RuuviTag sensors, see [Connect a RuuviTag sensor to your Azure IoT Central application](../core/howto-connect-ruuvi.md). You can also use these directions to create two simulated sensors, if needed.

### Add rules and actions

As part of using sensors in your Azure IoT Central application to monitor conditions, you can create rules to run actions when certain conditions are met. 

A rule is associated with a device template and one or more devices, and it contains conditions that must be met based on device telemetry or events. A rule also has one or more associated actions. The actions might include sending email notifications, or triggering a webhook action to send data to other services. The *In-store analytics - checkout* application template includes some predefined rules for the devices in the application.

In this section, you create a new rule that checks the maximum relative humidity level based on the RuuviTag sensor telemetry. You add an action to the rule so that if the humidity exceeds the maximum, the application sends an email notification.

To create a rule:

1. On the left pane, select **Rules**.

1. Select **New**.

1. Enter **Humidity level** as the name of the rule.

1. For **Device template**, select the RuuviTag device template. 

   The rule that you define applies to all sensors, based on that template. Optionally, you could create a filter that would apply the rule to only a defined subset of the sensors.

1. For **Telemetry**, select **RelativeHumidity**. It's the device capability that you customized in an earlier step.

1. For **Operator**, select **Is greater than**.

1. For **Value**, enter a typical upper range indoor humidity level for your environment (for example, **65**). 

   You've set a condition for your rule that occurs when relative humidity in any RuuviTag real or simulated sensor exceeds this value. You might need to adjust the value up or down depending on the normal humidity range in your environment.

To add an action to the rule:

1. Select **Email**.

1. For a friendly **Display name** for the action, enter **High humidity notification**.

1. For **To**, enter the email address that's associated with your account. 

   If you use a different email address, the one you use must be for a user who has been added to the application. The user also needs to sign in and out at least once.

1. Optionally, enter a note to include in the text of the email.

1. Select **Done** to complete the action.

1. Select **Save** to save and activate the new rule.

    Within a few minutes, the specified email account should begin to receive messages. The application sends email each time a sensor indicates that the humidity level exceeded the value in your condition.

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

In this tutorial, you learned how to:

* Use the Azure IoT Central *In-store analytics - checkout* template to create a retail store application.
* Customize the application settings.
* Create and customize IoT device templates.
* Connect devices to your application.
* Add rules and actions to monitor conditions.

Now that you've created an Azure IoT Central condition-monitoring application, here's the suggested next step:

> [!div class="nextstepaction"]
> [Customize the dashboard](./tutorial-in-store-analytics-customize-dashboard.md)
