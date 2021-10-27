---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 10/20/2021
 ms.author: dobett
 ms.custom: include file
---

Now that you have a destination to export your data to, set up data export in your IoT Central application:

1. Sign in to your IoT Central application.

1. In the left pane, select **Data export**.

    > [!Tip]
    > If you don't see **Data export** in the left pane, then you don't have permissions to configure data export in your app. Talk to an administrator to set up data export.

1. Select **+ New export**.

1. Enter a display name for your new export, and make sure the data export is **Enabled**.

1. Choose the type of data to export. The following table lists the supported data export types:

    | Data type | Description | Data format |
    | :------------- | :---------- | :----------- |
    |  Telemetry | Export telemetry messages from devices in near-real time. Each exported message contains the full contents of the original device message, normalized.   |  [Telemetry message format](#telemetry-format)   |
    | Property changes | Export changes to device and cloud properties in near-real time. For read-only device properties, changes to the reported values are exported. For read-write properties, both reported and desired values are exported. | [Property change message format](#property-changes-format) |
    | Device connectivity | Export device connected and disconnected events. | [Device connectivity message format](#device-connectivity-changes-format) |
    | Device lifecycle | Export device registered, deleted, provisioned, enabled, disabled, displayNameChanged, and deviceTemplateChanged events. | [Device lifecycle changes message format](#device-lifecycle-changes-format) |
    | Device template lifecycle | Export published device template changes including created, updated, and deleted. | [Device template lifecycle changes message format](#device-template-lifecycle-changes-format) |

1. Optionally, add filters to reduce the amount of data exported. There are different types of filter available for each data export type:
    <a name="DataExportFilters"></a>

    | Type of data | Available filters|
    |--------------|------------------|
    |Telemetry|<ul><li>Filter by device name, device ID, device template, and if the device is simulated</li><li>Filter stream to only contain telemetry that meets the filter conditions</li><li>Filter stream to only contain telemetry from devices with properties matching the filter conditions</li><li>Filter stream to only contain telemetry that has *message properties* meeting the filter condition. *Message properties* (also known as *application properties*) are sent in a bag of key-value pairs on each telemetry message optionally sent by devices that use the device SDKs. To create a message property filter, enter the message property key you're looking for, and specify a condition. Only telemetry messages with properties that match the specified filter condition are exported. [Learn more about application properties from IoT Hub docs](../articles/iot-hub/iot-hub-devguide-messages-construct.md) </li></ul>|
    |Property changes|<ul><li>Filter by device name, device ID, device template, and if the device is simulated</li><li>Filter stream to only contain property changes that meet the filter conditions</li></ul>|
    |Device connectivity|<ul><li>Filter by device name, device ID, device template, organizations, and if the device is simulated</li><li>Filter stream to only contain changes from devices with properties matching the filter conditions</li></ul>|
    |Device lifecycle|<ul><li>Filter by device name, device ID, device template, and if the device is provisioned, enabled, or simulated</li><li>Filter stream to only contain changes from devices with properties matching the filter conditions</li></ul>|
    |Device template lifecycle|<ul><li>Filter by device template</li></ul>|

1. Optionally, enrich exported messages with extra key-value pair metadata. The following enrichments are available for the telemetry, property changes, device connectivity, and device lifecycle data export types:
<a name="DataExportEnrichmnents"></a>
    - **Custom string**: Adds a custom static string to each message. Enter any key, and enter any string value.
    - **Property**, which adds to each message:
       - Device metadata such as device name, device template name, enabled, organizations, provisioned, and simulated.
       - The current device reported property or cloud property value to each message. If the exported message is from a device that doesn't have the specified property, the exported message doesn't get the enrichment.
