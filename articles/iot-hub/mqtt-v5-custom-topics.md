---
title: Configure custom topic groups for Azure IoT Hub with the MQTT v5 connection profile
titleSuffix: Azure IoT Hub
description: Configure custom topic groups and topic templates for Azure IoT Hub with the MQTT v5 connection profile and verify the saved configuration.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 10/26/2026
---

# Configure custom topic groups for Azure IoT Hub with the MQTT v5 connection profile

Custom topics let devices publish telemetry to application-defined topic names.
For example, a connected vehicle can publish regular telemetry and faults to
separate topics.

In this article, you configure a custom topic group and its topic templates on
the Azure IoT Hub you created with the MQTT v5 connection profile. IoT Hub
routing delivers accepted messages to downstream destinations.

The preview supports device publishing to custom topics through the
unified Azure IoT SDKs. Receive the data through IoT Hub routing at a supported
destination. Custom-topic subscriptions aren't part of this preview workflow.

## Prerequisites

- Complete [hub setup](mqtt-v5-cloud-setup.md).
- Identify the device identities that will publish.
- Decide which downstream applications need each message category.
- A development environment configured for the unified Azure IoT SDK for .NET
  or C. See [Develop with unified Azure IoT SDKs](develop-unified-iot-sdks.md).
- For CLI commands, complete the
  [preview CLI setup](mqtt-v5-cloud-setup.md?tabs=cli#create-azure-iot-hub-with-the-mqtt-v5-connection-profile) and use the same CLI session.

## Understand custom topic groups, topic templates, and topics

Use these terms to distinguish hub configuration from device publishing:

| Term | Meaning | Example |
| --- | --- | --- |
| Custom topic group | A configuration container that holds topic templates. | `fleet` |
| Topic template | A pattern configured within a custom topic group. It can contain wildcards and the `{deviceId}` variable. | `fleet/vehicles/{deviceId}/#` |
| Topic | The concrete name a device publishes to. | `fleet/vehicles/vehicle-001/telemetry` |

Devices publish to topics, not to custom topic groups or topic templates.

## Preview limits and topic template rules

The following limits apply when creating or updating custom topic groups
through any management method:

| Constraint | Preview behavior |
| --- | --- |
| Custom topic groups | Maximum **1 per hub**. Update the existing group instead of creating a second group. |
| Topic templates | Maximum **10 in the custom topic group**. |
| Segments per topic template | Maximum **15**. |
| Rejected prefixes | Templates starting with `ih`, `+`, or `#` are rejected. |
| Template variables | Only **`{deviceId}`** is supported, with that exact casing. Other variables are rejected. |

The prefix restriction doesn't prohibit wildcards elsewhere in a template.
Wildcards must still follow MQTT topic-filter syntax. For example:

| Topic template | Result |
| --- | --- |
| `fleet/vehicles/{deviceId}/#` | Valid. The template starts with a literal prefix and uses the supported variable. |
| `ih/telemetry` | Rejected. The template starts with `ih`. |
| `+/telemetry` | Rejected. The template starts with `+`. |
| `#` | Rejected. The template starts with `#`. |
| `fleet/{siteId}/telemetry` | Rejected. `{siteId}` isn't a supported variable. |
| `fleet/{deviceID}/telemetry` | Rejected. The supported variable is `{deviceId}`, not `{deviceID}`. |

## Design a topic hierarchy

The following names illustrate a fleet application:

```text
fleet/vehicles/vehicle-001/telemetry
fleet/vehicles/vehicle-001/faults
```

Use stable topic levels for the application, device, and message category.
Keep rapidly changing values, such as temperature or location, in the payload
rather than in the topic name.

| Decision | Guidance |
| --- | --- |
| Device segment | Use the identity assigned to the device in the solution. Don't assume its Device Provisioning Service (DPS) registration ID and assigned hub device ID are interchangeable. |
| Message category | Separate observations and faults if consumers need to treat them differently. |
| Application properties | Use metadata for filtering that shouldn't require decoding the payload. |
| Sensitive data | Don't place credentials or personal information in topic names. Topics can appear in diagnostics. |

### Publisher identity and preview access control

Use `{deviceId}` to include the hub device identity in a topic template. This
feature helps you organize the topic hierarchy, but it doesn't configure a per-device
role or access policy.

> [!IMPORTANT]
> This preview doesn't support topic-level role-based access control (RBAC) for devices.
> Including `{deviceId}` in a topic template doesn't enable
> topic-level RBAC. Don't treat a device ID in a topic name as proof of the
> publishing device's identity. Use the service-provided `connectionDeviceId`
> message metadata to identify the publisher.

Topic templates define the publishing patterns configured on the hub. This
configuration is separate from assigning different topic permissions to
individual devices or device groups, which isn't supported in this preview.

## Separate allowed topics from routes

There are two different configurations:

- **Allowed-topic configuration** defines the custom topic patterns configured
  for publishing on the hub. It doesn't assign per-device roles or permissions.
- **Routing configuration** selects accepted messages and sends them to destinations.

Creating a route doesn't grant a device permission to publish to a topic.
Allowing a topic doesn't create a downstream destination or route.

For each message category:

1. Define the topic pattern and the message category it represents.
1. Configure the topic templates in a custom topic group on the hub.
1. Review overlapping patterns so that a broad pattern doesn't include
   unintended topic names.
1. Record one concrete publishing topic for the test device that matches the
   intended template.
1. Configure the downstream delivery path before starting the device.

Avoid substituting a wildcard topic filter for the concrete topic in a publish.
A device publishes to a concrete name; matching patterns belong in configuration.

## Configure a custom topic group

A custom topic group holds the topic templates configured for publishing.
Choose the Azure portal, CLI, or ARM REST alternative for your management workflow.

### [Azure portal](#tab/portal)

1. Open your IoT hub with the MQTT v5 connection profile in the
   [Azure portal](https://portal.azure.com).
1. Under **Hub settings**, select **Custom topics**.
1. Check whether a custom topic group already exists. If it does, select its
   name to modify its topic templates instead of creating a second group.
   Retain any templates that existing devices still need.
1. If no group exists, select **Add topic** to open **Create custom topic group**.
   Enter `fleet` in **Topic group name**.
1. In **Topic template**, enter `fleet/vehicles/{deviceId}/telemetry`.
   Select **Add topic** within the pane to add
   `fleet/vehicles/{deviceId}/faults`. Keep the total within the preview limit
   of 10 templates.
1. Select **Save**.
1. After the update completes, reopen the group and verify that the intended
   templates are saved.

Keep `{deviceId}` exactly as shown in the templates. It represents the
authenticated hub device identity. A device assigned the ID `vehicle-001`
publishes to a concrete topic such as `fleet/vehicles/vehicle-001/telemetry`,
not to a literal `{deviceId}` or a wildcard.

To update an existing group later, select its name, modify the topic templates,
and select **Save**. Retain any templates that existing devices still need,
then reopen the group to verify the changes.

### [Azure CLI](#tab/cli)

Create the hub first, then configure the custom topic group; don't try to pass topic
templates to `az iot hub create`.

1. Check whether a custom topic group is already configured:

   ```azurecli
   az iot hub topic-group list --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --output json
   ```

   If a group exists, skip creation and follow
   [Update an existing custom topic group](#update-an-existing-custom-topic-group).
   Don't create a second group. The examples use group ID `fleet`; if your
   existing group has a different ID, use that ID in every `--topic-group-id`
   argument below.

1. If no group exists, create the `fleet` custom topic group with a
   topic template containing `{deviceId}`:

   ```azurecli
   az iot hub topic-group create --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --topic-group-id fleet --topic-templates "fleet/vehicles/{deviceId}/#" --output none
   ```

   Keep the `{deviceId}` placeholder exactly as shown in the configured
   template. It represents the authenticated hub device identity. For an assigned
   device ID of `vehicle-001`, concrete publishing topics include
   `fleet/vehicles/vehicle-001/telemetry` and
   `fleet/vehicles/vehicle-001/faults`. Don't publish a literal `{deviceId}`
   or a wildcard.

1. Check the hub update and inspect the saved group:

   ```azurecli
   az iot hub show --name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "{state:properties.state,provisioningState:properties.provisioningState}" --output json
   ```

   ```azurecli
   az iot hub topic-group show --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --topic-group-id fleet --output json
   ```

   Continue only when the hub is `Active`, provisioning is `Succeeded`, and
   the group contains the intended template. A failed update must be resolved
   before testing device publishing.

#### Update an existing custom topic group

To replace the wildcard with two explicit message categories, update the
existing group. Use its group ID instead of `fleet` if it differs:

```azurecli
az iot hub topic-group update --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --topic-group-id fleet --topic-templates "fleet/vehicles/{deviceId}/telemetry" "fleet/vehicles/{deviceId}/faults" --output none
```

`update` replaces that group's template list; include every template you want
to retain, up to the preview maximum of 10. Repeat the state and group checks
above after a change. Also list the routes to confirm that the expected
delivery configuration is still present:

```azurecli
az iot hub message-route list --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "[].{name:name,condition:condition}" --output json
```

### [ARM REST](#tab/arm)

ARM represents custom topic groups in `properties.mqttV5Settings.topicGroups`
on the hub resource, using API version `2026-10-01-preview`.

The following fragment belongs inside the hub's `properties` object. It is
not a complete resource request or a standalone deployment template.

```json
{
  "mqttV5Settings": {
    "topicGroups": [
      {
        "topicGroupId": "fleet",
        "topicTemplates": [
          "fleet/vehicles/{deviceId}/#"
        ]
      }
    ]
  }
}
```

- **At hub creation:** include `mqttV5Settings` in the hub resource's
  `properties` in your ARM template. ARM can configure the group at creation,
  unlike the native CLI creation command.
- **After creating your MQTT v5 hub:** follow
  [Apply configuration changes to your MQTT v5 hub through ARM REST](mqtt-v5-route-messages.md#apply-configuration-changes-to-your-mqtt-v5-hub-through-arm-rest).
  If a group already exists, edit that entry and retain its `topicGroupId`;
  don't append a second group. Otherwise, add the single group shown above.
  Include the full template list you want to retain, up to 10 templates, and
  preserve routing and other hub settings. Don't send the fragment above as
  the PUT body.

Keep `{deviceId}` in the configured template with exactly this casing. The
device publishes to a concrete topic using its assigned hub device ID, such
as `fleet/vehicles/vehicle-001/telemetry`, not to the template itself.

After the update reaches `Active` and `Succeeded`, read the saved groups:

```azurecli
az rest --method get --uri "https://management.azure.com<HUB_RESOURCE_ID>?api-version=2026-10-01-preview" --query properties.mqttV5Settings.topicGroups --output json
```

Check that the intended group and templates are present. Read back routing
configuration as well; a topic change must not remove the delivery path.

---

## Verify the configuration

Reopen the group in the portal or read it back by using the CLI or ARM REST commands
in this article. Confirm that:

- The configuration update completed successfully.
- The topic group contains all intended topic templates.
- Any templates needed by existing devices remain in the group.
- The saved configuration meets the preview limits and topic template rules.

## Next steps

- [Configure routes and downstream delivery](mqtt-v5-route-messages.md).
- [Configure a device and publish messages](mqtt-v5-device-setup.md).
- [Choose payloads and develop with the SDKs](develop-unified-iot-sdks.md).
- [Monitor routing and troubleshoot delivery](mqtt-v5-monitor-troubleshoot.md).
