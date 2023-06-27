---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 05/22/2023
 ms.author: dobett
 ms.custom: include file
---

## Set up a data export

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
    | Audit logs | Logs of user-initiated updates to entities in the application. To learn more, see [Use audit logs to track activity in your IoT Central application](../articles/iot-central/core/howto-use-audit-logs.md) | [Audit log message format](#audit-log-format) |

1. Optionally, add filters to reduce the amount of data exported. There are different types of filter available for each data export type:
    <a name="DataExportFilters"></a>

    | Type of data | Available filters|
    |--------------|------------------|
    |Telemetry|<ul><li>Filter by device name, device ID, device template, and if the device is simulated</li><li>Filter stream to only contain telemetry that meets the filter conditions</li><li>Filter stream to only contain telemetry from devices with properties matching the filter conditions</li><li>Filter stream to only contain telemetry that has *message properties* meeting the filter condition. *Message properties* (also known as *application properties*) are sent in a bag of key-value pairs on each telemetry message. To create a message property filter, enter the message property key you're looking for, and specify a condition. Only telemetry messages with properties that match the specified filter condition are exported. [Learn more about application properties from IoT Hub docs](../articles/iot-hub/iot-hub-devguide-messages-construct.md) </li></ul>|
    |Property changes|<ul><li>Filter by device name, device ID, device template, and if the device is simulated</li><li>Filter stream to only contain property changes that meet the filter conditions</li></ul>|
    |Device connectivity|<ul><li>Filter by device name, device ID, device template, organizations, and if the device is simulated</li><li>Filter stream to only contain changes from devices with properties matching the filter conditions</li></ul>|
    |Device lifecycle|<ul><li>Filter by device name, device ID, device template, and if the device is provisioned, enabled, or simulated</li><li>Filter stream to only contain changes from devices with properties matching the filter conditions</li></ul>|
    |Device template lifecycle|<ul><li>Filter by device template</li></ul>|
    |Audit logs|N/A|

1. Optionally, enrich exported messages with extra key-value pair metadata. The following enrichments are available for the telemetry, property changes, device connectivity, and device lifecycle data export types:
<a name="DataExportEnrichmnents"></a>
    - **Custom string**: Adds a custom static string to each message. Enter any key, and enter any string value.
    - **Property**, which adds to each message:
       - Device metadata such as device name, device template name, enabled, organizations, provisioned, and simulated.
       - The current device reported property or cloud property value to each message. If the exported message is from a device that doesn't have the specified property, the exported message doesn't get the enrichment.

Configure the export destination:

1. Select **+ Destination** to add a destination that you've already created or select **Create a new one**.

1. To transform your data before it's exported, select **+ Transform**. To learn more, see [Transform data inside your IoT Central application for export](../articles/iot-central/core/howto-transform-data-internally.md).

1. Select **+ Destination** to add up to five destinations to a single export.

1. When you've finished setting up your export, select **Save**. After a few minutes, your data appears in your destinations.

## Monitor your export

In IoT Central, the **Data export** page lets you check the status of your exports. You can also use [Azure Monitor](../articles/azure-monitor/overview.md) to see how much data you're exporting and any export errors. You can access export and device health metrics in charts in the Azure portal by using, the REST API, queries in PowerShell, or the Azure CLI. Currently, you can monitor the following data export metrics in Azure Monitor:

- Number of messages incoming to export before filters are applied.
- Number of messages that pass through filters.
- Number of messages successfully exported to destinations.
- Number of errors found.

To learn more, see [Monitor application health](../articles/iot-central/core/howto-manage-iot-central-from-portal.md#monitor-application-health).

## Data formats

The following sections describe the formats of the exported data:

### Telemetry format

Each exported message contains a normalized form of the full message the device sent in the message body. The message is in JSON format and encoded as UTF-8. Information in each message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `telemetry`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template assigned to the device.
- `enqueuedTime`: The time at which IoT Central received this message.
- `enrichments`: Any enrichments set up on the export.
- `module`: The IoT Edge module that sent this message. This field only appears if the message came from an IoT Edge module.
- `component`: The component that sent this message. This field only appears if the capabilities sent in the message were modeled as a component in the device template
- `messageProperties`: Other properties that the device sent with the message. These properties are sometimes referred to as *application properties*. [Learn more from IoT Hub docs](../articles/iot-hub/iot-hub-devguide-messages-construct.md).