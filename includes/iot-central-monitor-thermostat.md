---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 03/12/2020
 ms.author: dobett
 ms.custom: include file
---

As an operator in your Azure IoT Central application, you can:

* View the telemetry sent by the device on the **Overview** page:

    :::image type="content" source="media/iot-central-monitor-thermostat/view-telemetry.png" alt-text="View device telemetry":::

* View the device properties on the **About** page:

    :::image type="content" source="media/iot-central-monitor-thermostat/about-properties.png" alt-text="View device properties":::

## Customize the device template

As a solution developer, you can customize the device template that IoT Central created automatically when the thermostat device connected.

To add a cloud property to store the customer name associated with the device:

1. In your IoT Central application, navigate to the **Thermostat** device template on the **Device templates** page.

1. In the **Thermostat** device template, select **Cloud properties**.

1. Select **Add cloud property**. Enter *Customer name* as the **Display name** and choose **String** as the **Schema**. Then select **Save**.

To customize how the **Get Max-Min report** command displays in your IoT Central application, select **Customize** in the device template. Replace **Get Max-Min report.** with *Get status report*. Then select **Save**.

The **Thermostat** model includes the **Target Temperature** writeable property, the device template includes the **Customer Name** cloud property. Create a view an operator can use to edit these properties:

1. Select **Views** and then select the **Editing device and cloud data** tile.

1. Enter _Properties_ as the form name.

1. Select the **Target Temperature** and **Customer Name** properties. Then select **Add section**.

1. Save your changes.

:::image type="content" source="media/iot-central-monitor-thermostat/properties-view.png" alt-text="View for updating property values":::

## Publish the device template

Before an operator can see and use the customizations you made, you must publish the device template.

From the **Thermostat** device template, select **Publish**. On the **Publish this device template to the application** panel, select **Publish**.

An operator can now use the **Properties** view to update the property values, and call a command called **Get status report** on the device commands page:

* Update writeable property values on the **Properties** page:

    :::image type="content" source="media/iot-central-monitor-thermostat/update-properties.png" alt-text="Update the device properties":::

* Call the commands from the **Commands** page:

    :::image type="content" source="media/iot-central-monitor-thermostat/call-command.png" alt-text="Call the command":::

    :::image type="content" source="media/iot-central-monitor-thermostat/command-response.png" alt-text="View the command response":::
