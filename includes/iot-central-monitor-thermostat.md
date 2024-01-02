---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 10/16/2022
 ms.author: dobett
 ms.custom: include file
---

As an operator in your Azure IoT Central application, you can:

* View the telemetry sent by the two thermostat components on the **Overview** page:

    :::image type="content" source="media/iot-central-monitor-thermostat/view-telemetry.png" alt-text="Screenshot that shows the device overview page." lightbox="media/iot-central-monitor-thermostat/view-telemetry.png":::

* View the device properties on the **About** page. This page shows the properties from the device information component and the two thermostat components:

    :::image type="content" source="media/iot-central-monitor-thermostat/about-properties.png" alt-text="Screenshot that shows the device properties view." lightbox="media/iot-central-monitor-thermostat/about-properties.png":::

## Customize the device template

As a solution developer, you can customize the device template that IoT Central created automatically when the temperature controller device connected.

To add a cloud property to store the customer name associated with the device:

1. In your IoT Central application, navigate to the **Temperature Controller** device template on the **Device templates** page.

1. In the **Temperature Controller** model, select **+Add capability**.

1. Enter *Customer name* as the **Display name**, select **Cloud property** as the **capability type**, expand the entry and choose **String** as the **Schema**. Then select **Save**.

To customize how the **Get Max-Min report** commands display in your IoT Central application:

1. Navigate to the **Temperature Controller** device template on the **Device templates** page.

1. For **getMaxMinReport (thermostat1)**, replace *Get Max-Min report.* with *Get thermostat1 status report*.

1. For **getMaxMinReport (thermostat2)**, replace *Get Max-Min report.* with *Get thermostat2 status report*.

1. Select **Save**.

To customize how the **Target Temperature** writable properties display in your IoT Central application:

1. Navigate to the **Temperature Controller** device template on the **Device templates** page.

1. For **targetTemperature (thermostat1)**, replace *Target Temperature* with *Target Temperature (1)*.

1. For **targetTemperature (thermostat2)**, replace *Target Temperature* with *Target Temperature (2)*.

1. Select **Save**.

The thermostat components in the **Temperature Controller** model include the **Target Temperature** writable property, the device template includes the **Customer Name** cloud property. Create a view an operator can use to edit these properties:

1. Select **Views** and then select the **Editing device and cloud data** tile.

1. Enter _Properties_ as the form name.

1. Select the **Target Temperature (1)**,  **Target Temperature (2)**, and **Customer Name** properties. Then select **Add section**.

1. Save your changes.

:::image type="content" source="media/iot-central-monitor-thermostat/properties-view.png" alt-text="Screenshot that shows a view for updating property values." lightbox="media/iot-central-monitor-thermostat/properties-view.png":::

## Publish the device template

Before an operator can see and use the customizations you made, you must publish the device template.

From the **Thermostat** device template, select **Publish**. On the **Publish this device template to the application** panel, select **Publish**.

An operator can now use the **Properties** view to update the property values, and call commands called **Get thermostat1 status report** and **Get thermostat2 status report** on the device commands page:

* Update writable property values on the **Properties** page:

    :::image type="content" source="media/iot-central-monitor-thermostat/update-properties.png" alt-text="Screenshot that shows updating the device properties." lightbox="media/iot-central-monitor-thermostat/update-properties.png":::

* Call the commands from the **Commands** page. If you run the status report command, select a date and time for the **Since** parameter before you run it:

    :::image type="content" source="media/iot-central-monitor-thermostat/call-command.png" alt-text="Screenshot that shows calling a command." lightbox="media/iot-central-monitor-thermostat/call-command.png":::

    :::image type="content" source="media/iot-central-monitor-thermostat/command-response.png" alt-text="Screenshot that shows a command response." lightbox="media/iot-central-monitor-thermostat/command-response.png":::
