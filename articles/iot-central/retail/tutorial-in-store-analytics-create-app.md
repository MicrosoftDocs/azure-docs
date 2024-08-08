---
title: Tutorial - Deploy an Azure IoT in-store analytics app
description: This tutorial shows how to create and deploy an in-store analytics retail application in IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 03/27/2024
services: iot-central
ms.service: iot-central
ms.topic: tutorial
ms.custom: [iot-storeAnalytics-checkout, iot-p0-scenario]

# Customer intent: Learn how to create and deploy an in-store analytics retail application in IoT Central.
---

# Tutorial: Create and deploy an in-store analytics application template

To build the end-to-end solution, you use the IoT Central _in-store analytics checkout_ application template. This template lets you connect to and monitor a store's environment through various sensor devices. These devices generate telemetry that you can convert into business insights to help reduce operating costs and create a great experience for your customers.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use the Azure IoT Central *In-store analytics - checkout* template to create a retail store application
> * Customize the application settings
> * Create and customize IoT device templates
> * Connect devices to your application
> * Add rules and actions to monitor conditions

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, you need to install the [dmr-client](https://www.nuget.org/packages/Microsoft.IoT.ModelsRepository.CommandLine) command-line tool on your local machine:

```console
dotnet tool install --global Microsoft.IoT.ModelsRepository.CommandLine --version 1.0.0-beta.9
```

## Application architecture

For many retailers, environmental conditions are a key way to differentiate their stores from their competitors' stores. The most successful retailers make every effort to maintain pleasant conditions within their stores for the comfort of their customers.

The application template comes with a set of device templates and uses a set of simulated devices to populate the dashboard:

:::image type="content" source="media/tutorial-in-store-analytics-create-app/store-analytics-architecture-frame.png" alt-text="Diagram of the in-store analytics application architecture." border="false":::

As shown in the previous application architecture diagram, you can use the application template to:

* **(1)** Connect various IoT sensors to an IoT Central application instance.

   An IoT solution starts with a set of sensors that capture meaningful signals from within a retail store environment. The various icons at the far left of the architecture diagram represent the sensors.

* **(2)** Monitor and manage the health of the sensor network and any gateway devices in the environment.

   Many IoT sensors can feed raw signals directly to the cloud or to a gateway device located near them. The gateway device aggregates data at the edge before it sends summary insights to an IoT Central application. The gateway device is also responsible for relaying command and control operations to the sensor devices when applicable.

* **(3)** Create custom rules that use environmental conditions within a store to trigger alerts for store managers.

   The Azure IoT Central application ingests data from the various IoT sensors and gateway devices within the retail store environment and then generates a set of meaningful insights.

   Azure IoT Central also provides a tailored experience for store operators that lets them remotely monitor and manage the infrastructure devices.

* **(4)** Transform the environmental conditions within the stores into insights that the store team can use to improve the customer experience.

   You can configure an Azure IoT Central application within a solution to export raw or aggregated insights to a set of Azure platform as a service (PaaS) services. PaaS services can perform data manipulation and enrich these insights before landing them in a business application.

* **(5)** Export the aggregated insights into existing or new business applications to provide useful and timely information to retail staff.

   The IoT data can power different kinds of business applications deployed within a retail environment. A retail store manager or staff member can use these applications to visualize business insights and take meaningful action in real time. You learn how to build a real-time Power BI dashboard in the [Export data from Azure IoT Central and visualize insights in Power BI](tutorial-in-store-analytics-export-data-visualize-insights.md) tutorial.

## Create an in-store analytics application

To create your IoT Central application:

1. Navigate to the [Create IoT Central Application](https://portal.azure.com/#create/Microsoft.IoTCentral) page in the Azure portal. If prompted, sign in with your Azure account.

1. Enter the following information:

    | Field | Description |
    | ----- | ----------- |
    | Subscription | The Azure subscription you want to use. |
    | Resource group | The resource group you want to use. You can create a new resource group or use an existing one. |
    | Resource name | A valid Azure resource name. |
    | Application URL | The URL subdomain for your application. The URL for an IoT Central application looks like `https://yoursubdomain.azureiotcentral.com`. |
    | Template | **In-store Analytics - Checkout** |
    | Region | The Azure region you want to use. |
    | Pricing plan | The pricing plan you want to use. |

1. Select **Review + create**. Then select **Create**.

[!INCLUDE [iot-central-navigate-from-portal](../../../includes/iot-central-navigate-from-portal.md)]

## Walk through the application

The following sections describe the key features of the application.

### Customize the application settings

You can change several settings to customize the user experience in your application. A custom theme enables you to set the application browser colors, the browser icon, and the application logo that appears in the masthead.

To create a custom theme, use the sample images to customize the application. Download the four [Contoso sample images](https://github.com/Azure-Samples/iot-central-docs-samples/tree/main/retail) from GitHub.

To create a custom theme:

1. On the left pane, select **Customization > Appearance**.

1. To change the masthead logo, select **Change**, and then select the _contoso_wht_mast.png_ image to upload. Optionally, enter a value for **Logo alt text**.

1. To change the browser icon, select **Change**, and then select the _contoso_favicon.png_ image to appear on browser tabs.

1. Replace the default **Browser colors** by adding HTML hexadecimal color codes:

    * For **Header**, enter _#008575_.  
    * For **Accent**, enter _#A1F3EA_.

1. Select **Save**. After you save your changes, the application updates the browser colors, the logo in the masthead, and the browser icon.

To update the application image that appears on the application tile on the **My Apps** page of the [Azure IoT Central My apps](https://apps.azureiotcentral.com/myapps) site:

1. Select **Application > Management**.

1. Select **Change**, and then select the _contoso_main_lg.png_ image to upload as the application image.

1. Select **Save**.

### Create the device templates

Device templates let you configure and manage devices. You can build a custom template, import an existing template file, or import a template from the list of featured device templates. After you create and customize a device template, use it to connect real devices to your application.

Optionally, you can use a device template to generate simulated devices for testing.

The _In-store analytics - checkout_ application template has several preinstalled device templates. The RuuviTag device template isn't included in the _In-store analytics - checkout_ application template.

In this section, you add a device template for RuuviTag sensors to your application. To do so:

1. To download a copy of the RuuviTag device template from the model repository, run the following command:

    ```bash
    dmr-client export --dtmi "dtmi:rigado:RuuviTag;2" --repo https://raw.githubusercontent.com/Azure/iot-plugandplay-models/main > ruuvitag.json
    ```

1. On the left pane, select **Device Templates**.

1. Select **+ New** to create a new device template.

1. Select the **IoT device** tile and then select **Next: Customize**.

1. On the **Customize** page, enter *RuuviTag* as the device template name.

1. Select **Next: Review**.

1. Select **Create**.

1. Select the **Import a model** tile. Then browse for and import the *ruuvitag.json* file that you downloaded previously.

1. After the import completes, select **Publish** to publish the device template.

1. On the left pane, select **Device templates**.

    The page displays all the device templates in the application template and the RuuviTag device template you just added.

:::image type="content" source="media/tutorial-in-store-analytics-create-app/device-templates-list.png" alt-text="Screenshot that shows the in-store analytics application device templates." lightbox="media/tutorial-in-store-analytics-create-app/device-templates-list.png":::

### Customize the device templates

You can customize the device templates in your application in three ways:

* Customize the native built-in interfaces in your devices by changing the device capabilities.

    For example, with a temperature sensor, you can change details such as the display name and the units of measurement.

* Customize your device templates by adding cloud properties.

    Cloud properties are custom data that your Azure IoT Central application creates, stores, and associates with your devices. Examples of cloud properties include:

    * A calculated value.
    * Metadata, such as a location that you want to associate with a set of devices.

* Customize device templates by building custom views.

    Views provide a way for operators to visualize telemetry and metadata for your devices, such as device metrics and health.

In this section, you use the first two methods to customize the device template for your RuuviTag sensors.

To customize the built-in interfaces of the RuuviTag device template:

1. On the left pane, select **Device Templates**.

1. Select **RuuviTag**.

1. Hide the left pane. The summary view of the template displays the device capabilities.

    :::image type="content" source="media/tutorial-in-store-analytics-create-app/ruuvitag-device-summary-view.png" alt-text="Screenshot that shows the in-store analytics application RuuviTag device template." lightbox="media/tutorial-in-store-analytics-create-app/ruuvitag-device-summary-view.png":::

1. Select the **RuuviTag** model in the RuuviTag device template menu.

1. In the list of capabilities, scroll for the **RelativeHumidity** telemetry type. It's the row item with the editable **Display name** value of *RelativeHumidity*.

In the following steps, you customize the **RelativeHumidity** telemetry type for the RuuviTag sensors. Optionally, you can customize some of the other telemetry types.

For the **RelativeHumidity** telemetry type, make the following changes:

1. Update the **Display Name** value from **RelativeHumidity** to a custom value such as **Humidity**.

1. Change the **Semantic Type** option from **Relative humidity** to **Humidity**.

    Optionally, set schema values for the humidity telemetry type in the expanded schema view. By setting schema values, you can create detailed validation requirements for the data that your sensors track. For example, you could set minimum and maximum operating range values for a specified interface.

1. Select **Save** to save your changes.

To add a cloud property to a device template in your application:

1. Select **Add capability**.

1. For **Display Name**, enter _Location_.

    This value, which is a friendly name for the property, is automatically copied to the **Name**. You can use the copied value or change it.

1. For **Capability Type**, select **Cloud Property**.

1. Select **Expand**.

1. In the **Schema** dropdown list, select **String**.

    This option lets you associate a location name with any device based on the template. For example, you could associate a named area in a store with each device.

1. Set **Minimum Length** to **2**.

1. Set **Trim Whitespace** to **On**.

1. Select **Save** to save your custom cloud property.

1. Select **Publish**.

    Publishing a device template makes the updates visible to application operators. After you publish a template, use it to generate simulated devices for testing or to connect real devices to your application. If you already have devices connected to your application, publishing a customized template pushes the changes to the devices.

### Add devices

After you create and customize the device templates, it's time to add devices. For this tutorial, you use the following set of simulated devices to build the application:

* A _Rigado C500 gateway_.
* Two _RuuviTag_ sensors.
* An _Occupancy_ sensor. This simulated sensor is included in the application template, so you don't need to create it.

To add a simulated Rigado Cascade 500 gateway device to your application:

1. On the left pane, select **Devices**.

1. Select **C500** in the list of available device templates and then select **New**.

1. Enter _C500 gateway_ as the device name and _gateway-001_ as the device ID.

1. Make sure that **C500** is the selected device template and then set **Simulate this device?** to **Yes**.

1. Select **Create**. Your application now contains a simulated Rigado Cascade 500 gateway device.

To add a simulated RuuviTag sensor device to your application:

1. On the left pane, select **Devices**.

1. Select **RuuviTag** in the list of available device templates and then select **New**.

1. Enter _RuuviTag 001_ as the device name and _ruuvitag-001_ as the device ID.

1. Make sure that **RuuviTag** is the selected device template and then set **Simulate this device?** to **Yes**.

1. Select **Create**. Your application now contains a simulated RuuviTag sensor device.

Repeat the previous steps to add a second simulated RuuviTag sensor device to your application. Enter _RuuviTag 002_ as the device name and _ruuvitag-002_ as the device ID.

To connect the two RuuviTag sensor and Occupancy devices to the gateway device:

1. On the left pane, select **Devices**.

1. In the list of devices, select **RuuviTag 001**, **RuuviTag 002**, and **Occupancy**. Then in the command bar, select **Attach to gateway**.

1. In the **Attach to gateway** pane, select **C500** as the device template, and **C500 - gateway** as the device. Then select **Attach**.

If you navigate to the **C500 - gateway** device and select the **Downstream Devices** tab, you now see three devices attached to the gateway.

### Add rules and actions

As part of using sensors in your Azure IoT Central application to monitor conditions, you can create rules to run actions when certain conditions are met.

A rule is associated with a device template and one or more devices, and it contains conditions that must be met based on device telemetry or events. A rule also has one or more associated actions. The actions might include sending email notifications, or triggering a webhook action to send data to other services. The _In-store analytics - checkout_ application template includes some predefined rules for the devices in the application.

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

    This condition applies when the relative humidity in any RuuviTag sensor exceeds the value. You might need to adjust the value up or down depending on the normal humidity range in your environment.

To add an action to the rule:

1. Select **Email**.

1. For a friendly **Display name** for the action, enter **High humidity notification**.

1. For **To**, enter the email address associated with your account.

    If you use a different email address, the one you use must be for a user who has been added to the application. The user also needs to sign in and out at least once.

1. Optionally, enter a note to include in the text of the email.

1. Select **Done** to complete the action.

1. Select **Save** to save and activate the new rule.

    Within a few minutes, the specified email account should begin to receive messages. The application sends email each time a sensor indicates that the humidity level exceeded the value in your condition.

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next step

> [!div class="nextstepaction"]
> [Customize the dashboard](./tutorial-in-store-analytics-customize-dashboard.md)
