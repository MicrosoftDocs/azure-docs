---
title: How to use the connector for ONVIF
description: Use the operations experience web UI to discover and configure assets and devices to use media streams from ONVIF compliant cameras.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 12/11/2025

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can discover and use media streams from an ONVIF compliant camera.
---

# Configure the connector for ONVIF

In Azure IoT Operations, the connector for ONVIF enables you to discover and use an [ONVIF conformant](https://www.onvif.org/profiles-add-ons-specifications/) camera that's connected to your Azure IoT Operations cluster.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The connector connects ONVIF cameras to your Azure IoT Operations instance and registers them in the Azure Device Registry. The connector then automatically discovers:

- The capabilities, such as pan-tilt-zoom (PTZ), of the ONVIF device.
- The media endpoints exposed by the ONVIF device.
- Details of the media streams such as framerate, resolution, and encoding.

After the camera is registered, examples of management operations include:

- Retrieving and updating the configuration of the camera to adjust the output image configuration.
- Controlling the camera pan, tilt, and zoom (PTZ).

The [media connector](howto-use-media-connector.md) can access the media sources exposed by these cameras.

Together, the media connector, connector for ONVIF, Azure IoT Operations, and companion services enable you to use Azure IoT Operations to implement use cases such as:

- Wait and dwell time tracking to track the time spent in line by customers.
- Order accuracy to track that the correct orders are packed by comparing items to POS receipt.
- Defect detection and quality assurance by cameras to detect any defects in products on the assembly line.
- Safety monitoring such as collision detection, safety zone detection, and personal safety equipment detection.

This article describes how to use the operations experience web UI and Azure CLI to:

- Add a device that has an ONVIF endpoint for a compliant camera.
- View the assets and devices discovered at the ONVIF endpoint.
- Create a device that represents the media endpoints exposed by the ONVIF camera.
- Create an asset that captures snapshots from the media endpoint and publishes them to the MQTT broker.

The connector for ONVIF supports the following authentication methods:
  - Username/password authentication
  - Anonymous access for testing purposes

To establish a TLS connection to the ONVIF camera, you can configure a certificate trust list for the connector.

## Prerequisites

[!INCLUDE [enable-resource-sync-rules](../includes/enable-resource-sync-rules.md)]

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

An ONVIF compliant camera that you can reach from your Azure IoT Operations cluster.

## ONVIF compliance

ONVIF has several categories for compliance, such as discovery, device, media, imaging, analytics, events, and pan-tilt-zoom (PTZ) services. To learn more, see [ONVIF - Profiles, Add-ons, and Specifications](https://www.onvif.org/profiles-add-ons-specifications/).

The connector for ONVIF in Azure IoT Operations focuses on support for camera devices that implement the following profiles:

- [Profile S for basic video streaming](https://www.onvif.org/profiles/profile-s/)
- [Profile T for advanced video streaming](https://www.onvif.org/profiles/profile-t/)

The connector enables support for the following capabilities:

- Discovery of device information and capabilities.
- Monitoring events from devices.
- Discovery of the media URIs exposed by a device. The connector for ONVIF makes these URIs available to the media connector.
- Imaging control such as filters and receiving motion and tampering events.
- Controlling device PTZ.

## Deploy the connector for ONVIF

[!INCLUDE [deploy-connectors-simple](../includes/deploy-connectors-simple.md)]

## Create a device with an ONVIF endpoint

To add a device that includes an ONVIF endpoint for a compliant camera:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** from the left navigation pane:

    :::image type="content" source="media/howto-use-onvif-connector/list-devices.png" alt-text="Screenshot that shows the list of devices in the operations experience." lightbox="media/howto-use-onvif-connector/list-devices.png":::

1. Select **Create new**. On the **Device details** page, enter a name for the device such as `my-onvif-camera`. To define the inbound endpoint, select **New** on the **Microsoft.Onvif** tile. Enter the details for your ONVIF camera, such as:

    :::image type="content" source="media/howto-use-onvif-connector/add-onvif-endpoint.png" alt-text="Screenshot that shows how to add an ONVIF endpoint to a device." lightbox="media/howto-use-onvif-connector/add-onvif-endpoint.png":::

    Select **Save** to add the endpoint to the device. The **Device details** page now shows the ONVIF endpoint.

1. On the **Device details** page, select **Next**.

1. On the **Add custom property** page, you can optionally update or add custom properties to the device. Select **Next** when you're done.

1. The **Summary** page shows the details of the device. Review the details, and then select **Create** to create the device. After a few minutes, the **Devices** page shows the new device.

    :::image type="content" source="media/howto-use-onvif-connector/device-created.png" alt-text="Screenshot that shows the device created in the operations experience." lightbox="media/howto-use-onvif-connector/device-created.png":::

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns device create -n onvif-connector-cli -g {your resource group name} --instance {your instance name}

az iot ops ns device endpoint inbound add onvif --device onvif-connector-cli -g {your resource group name} -i {your instance name}  --name onvif-connector-cli-0 --endpoint-address http://myonvifcam:2020/onvif/device_service
```

To learn more, see [az iot ops ns device](/cli/azure/iot/ops/ns/device).

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create a device with an inbound endpoint for the connector for ONVIF. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource device 'Microsoft.DeviceRegistry/namespaces/devices@2025-10-01' = {
  name: 'onvif-connector'
  parent: namespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    endpoints: {
      outbound: {
        assigned: {}
      }
      inbound: {
        'onvif-connector-0': {
          endpointType: 'Microsoft.Onvif'
          address: 'http://myonvifcam:2020/onvif/device_service'
        }
      }
    }
  }
}
```

---

### Configure a device to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

To use the `Username password` authentication mode, complete the following steps:

# [Operations experience](#tab/portal)

[!INCLUDE [connector-username-password-portal](../includes/connector-username-password-portal.md)]

# [Azure CLI](#tab/cli)

[!INCLUDE [connector-username-password-cli](../includes/connector-username-password-cli.md)]

# [Bicep](#tab/bicep)

[!INCLUDE [connector-username-password-bicep](../includes/connector-username-password-bicep.md)]

---

### Other security options

To manage the trusted certificates list for the connector for ONVIF, see [Manage certificates for external communications](../secure-iot-ops/howto-manage-certificates.md#manage-certificates-for-external-communications).

When you create the inbound endpoint in the operations experience, you can also select the following options on the **Advanced** tab:

| Option | Type | Description |
| ------ | ---- | ----------- |
| **Accept invalid hostnames** | Yes/No | Accept invalid hostnames in certificates for the ONVIF connection, defaults to **No** |
| **Accept invalid certificates** | Yes/No | Accept invalid certificates for the ONVIF connection, defaults to **No** |
| **Fallback to username token auth** | Yes/No | Fall back to **UsernameToken** authentication if digest authentication fails for the ONVIF connection, defaults to **No** |

> [!TIP]
> For more information about how to use the Azure CLI to configure these settings, see the [az iot ops ns device endpoint inbound add](/cli/azure/iot/ops/ns/device/endpoint/inbound/add) command reference.

## View the discovered assets and devices

After you create a device with an ONVIF endpoint, the connector for ONVIF automatically discovers the ONVIF assets and media devices that are available at the endpoint. To view the discovered assets and devices in the operations experience web UI, select **Discovery** from the left navigation pane:

:::image type="content" source="media/howto-use-onvif-connector/discovered-assets.png" alt-text="Screenshot that shows the list of discovered devices and assets in the operations experience." lightbox="media/howto-use-onvif-connector/discovered-assets.png":::

- Choose **Import and create asset** from the discovered ONVIF asset to create an asset that represents the capabilities of the ONVIF compliant camera. For example, you can create an asset that captures events from the ONVIF camera or enables you to control the ONVIF camera. For more information, see the section [Create an ONVIF asset for event management and control](#create-an-onvif-asset-for-event-management-and-control).

- Choose **Import and create device** from the discovered ONVIF device to create a device that connects to the media endpoints exposed by the ONVIF compliant camera. After you create the media device, you can create media assets that capture snapshots or video streams from the media endpoints. For more information, see the section [Create a device with media endpoints](#create-a-device-with-media-endpoints).

## Create a device with media endpoints

To create a device with media endpoints from the discovered device, follow these steps:

1. In the operations experience web UI, select **Discovery** from the left navigation pane. Then select **Discovered devices**.

1. Select the discovered media device, such as `my-onvif-camera`. Then select **Import and create device**.

1. The **Device details** page shows all the discovered media inbound endpoints. Enter a name for the device, such as `my-onvif-camera-media`, and select an **Authentication method** for each endpoint:

    :::image type="content" source="media/howto-use-onvif-connector/create-media-device.png" alt-text="Screenshot that shows how to create a media device from the discovered ONVIF device." lightbox="media/howto-use-onvif-connector/create-media-device.png":::

    > [!TIP]
    > You can remove an inbound endpoint that you don't need by selecting it and then selecting **Remove inbound endpoint**.

    Then select **Next**.

1. On the **Add custom property** page, you can see the discovered properties. You can optionally update, remove, or add custom properties to the device. Select **Next** when you're done.

1. On the **Summary** page, review the details of the device. Select **Create** to create the device. After a few minutes, the **Devices** page shows the new media device.

    :::image type="content" source="media/howto-use-onvif-connector/media-device-created.png" alt-text="Screenshot that shows the media device created in the operations experience." lightbox="media/howto-use-onvif-connector/media-device-created.png":::

## Create a media asset to capture snapshots

You can now use the discovered media device to create an asset that captures snapshots from the camera and publishes them to the MQTT broker. To create the media asset, follow these steps:

1. In the operations experience web UI, select **Assets** from the left navigation pane. Then select **Create asset**.

1. On the **Asset details page**, enter a name for the asset, such as `my-onvif-camera-media-asset`. Then select the discovered endpoint you want to use to capture snapshots.

    :::image type="content" source="media/howto-use-onvif-connector/create-media-asset.png" alt-text="Screenshot that shows how to create a media asset from the media device." lightbox="media/howto-use-onvif-connector/create-media-asset.png":::

    Update any custom properties for the media asset and then select **Next**.

1. On the **Streams** page, select **Add stream**. Use the following settings to configure an example stream that publishes snapshots to the MQTT broker:

    - **Stream name**: `myassetvideo`
    - **Destination**: `MQTT`
    - **Topic**: `myassetvideo`
    - **Task type**: `snapshot-to-mqtt`
    
    > [!TIP]
    > The topic you choose here is automatically nested under `azure-iot-operations/data/<asset-name>/` when the connector for ONVIF publishes the snapshots to the MQTT broker.

    Leave the other settings as default. Then select **Add**. The stream is added to the asset configuration:

    :::image type="content" source="media/howto-use-onvif-connector/add-stream-to-asset.png" alt-text="Screenshot that shows how to add a stream to the media asset." lightbox="media/howto-use-onvif-connector/add-stream-to-asset.png":::

1. Select **Next** to go to the **Review** page. Review the details of the asset, and then select **Create** to create the asset. After a few minutes, the **Assets** page shows the new asset.

    :::image type="content" source="media/howto-use-onvif-connector/media-asset-created.png" alt-text="Screenshot that shows the media asset created in the operations experience." lightbox="media/howto-use-onvif-connector/media-asset-created.png":::

The media asset is now configured to capture snapshots from the ONVIF compliant camera and publish them to the MQTT broker.

## Create an ONVIF asset for event management and control

ONVIF compliant cameras can generate events such as motion detection and respond to control commands such as pan, tilt, and zoom. You can create an ONVIF asset from the discovered ONVIF device that captures these events and enables you to control the camera.

After you add an ONVIF device in the operations experience, a discovered ONVIF asset is created automatically:

:::image type="content" source="media/howto-use-onvif-connector/discovered-onvif-asset.png" alt-text="Screenshot that shows the ONVIF asset discovered from the ONVIF device." lightbox="media/howto-use-onvif-connector/discovered-onvif-asset.png":::

To create an ONVIF asset for event management and control:

1. Select the discovered asset and then select **Import and create asset**.

1. On the **Asset details** page, enter a name and description for the asset. The device inbound endpoint is already selected for you and the custom properties are prepopulated from the discovered asset:

    :::image type="content" source="media/howto-use-onvif-connector/discovered-onvif-asset-detail.png" alt-text="Screenshot that shows the detailed ONVIF asset discovered from the ONVIF device." lightbox="media/howto-use-onvif-connector/discovered-onvif-asset-detail.png":::

    Select **Next** to continue.

1. On the **Event groups** page, select the event group to review the discovered events. You can remove any events that you don't want to use:

    :::image type="content" source="media/howto-use-onvif-connector/manage-event-groups.png" alt-text="Screenshot that shows the manage event groups page for the ONVIF asset." lightbox="media/howto-use-onvif-connector/manage-event-groups.png":::

1. For each event you keep, configure the MQTT topic it publishes to:

    :::image type="content" source="media/howto-use-onvif-connector/event-group-detail.png" alt-text="Screenshot that shows how to configure an event group." lightbox="media/howto-use-onvif-connector/event-group-detail.png":::

    Select **Next** to continue.

1. On the **Management groups** page, configure the actions, such as pan, tilt, and zoom, that you want to use to control the ONVIF camera.

    :::image type="content" source="media/howto-use-onvif-connector/manage-management-groups.png" alt-text="Screenshot that shows the manage management groups page for the ONVIF asset." lightbox="media/howto-use-onvif-connector/manage-management-groups.png":::

    For more information about configuring management groups, see [Manage and control the camera](#manage-and-control-the-camera).

    Select **Next** to continue.

1. Review the summary of the ONVIF asset configuration and then select **Create** to create the asset. After a few minutes, the **Assets** page shows the new asset.

## Manage and control the camera

To interact with the ONVIF camera, you can publish MQTT messages that the connector for ONVIF subscribes to. The message format is based on the [ONVIF network interface specifications](https://www.onvif.org/profiles/specifications/).

The [Azure IoT Operations connector for ONVIF PTZ Demo](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/aio-onvif-connector-ptz-demo) sample application shows how to use the connector for ONVIF to:

- Use the media asset definition to retrieve a profile token from the camera's media service.
- Use the profile token when you use the camera's PTZ capabilities control its position and orientation.

The sample application uses the Azure IoT Operations MQTT broker to send commands to interact with the connector for ONVIF. To learn more, see [Publish and subscribe MQTT messages using MQTT broker](../manage-mqtt-broker/overview-broker.md).
