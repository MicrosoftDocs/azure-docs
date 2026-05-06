---
title: Disable or Enable a Device in Azure Device Registry
titleSuffix: Azure IoT Hub
description: Disable or enable a device in Azure Device Registry so you can pause or resume device activity in Azure IoT Hub preview deployments.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: how-to
ai-usage: ai-generated
ms.date: 04/14/2026
#Customer intent: As an IoT Hub administrator, I want to disable or enable a device in Azure Device Registry so I can control when a device can participate in production operations.
---

# Disable or enable a device in Azure Device Registry (preview)

Use Azure Device Registry to disable a device when you need to stop device activity without deleting the device resource. Enable the device again when you're ready to return it to service.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

Disabling a device might interrupt active operations, data collection, or dependent workflows. Before you enable a device, confirm that its configuration, security settings, and operational readiness meet your production requirements.

## Prerequisites

Before you begin, make sure that you have the required resources and permissions.

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/).
- An existing IoT Hub Gen2 deployment linked to a Device Registry namespace. For setup steps, see [Deploy Azure IoT Hub with ADR integration and certificate management](iot-hub-device-registry-setup.md).
- At least one device in your Device Registry namespace.
- The [Azure Device Registry Contributor](../role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-contributor) role on the Device Registry namespace.

# [Azure portal](#tab/portal)

## Disable a device

Use these steps to disable a device in the Azure portal when you need to stop device activity without deleting the device resource.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Device Registry**.

1. Select **Devices**.

    :::image type="content" source="./media/how-to-disable-enable-device/devices-list.png" alt-text="Screenshot showing the list of devices in Azure Device Registry.":::

1. Select the device that you want to disable.

1. On the device page, select **edit** next to **Device status**.

    :::image type="content" source="./media/how-to-disable-enable-device/select-device.png" alt-text="Screenshot showing the edit button next to device status.":::

1. In **Edit status**, select **Disable**.

    :::image type="content" source="./media/how-to-disable-enable-device/disable-device.png" alt-text="Screenshot showing the dialog to disable the device.":::

1. Select **Save**.

1. Refresh the device page and verify that **Device status** shows **Disabled**.

## Enable a device

Use these steps to enable a device after you verify that it's ready to return to service. If you previously revoked its certificate during recovery, verify its credential state is valid before you begin.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Device Registry**.

1. Select **Devices**.

1. Select the disabled device that you want to enable.

1. On the device page, select **edit** next to **Device status**.

1. In **Edit status**, select **Enable**.

1. Select **Save**.

1. Refresh the device page and verify that **Device status** shows **Enabled**.

# [Azure CLI](#tab/cli)

## Azure CLI prerequisites

Prepare Azure CLI so the Device Registry device status commands run against the correct subscription, resource group, and namespace.

- [Azure CLI](/cli/azure/install-azure-cli) installed.
- The `azure-iot` extension. Install it by running:

  ```azurecli
  az extension add --name azure-iot
  ```

- Sign in to Azure by running `az login`.

## Set variables

Define reusable variables before you run the disable, enable, and verification commands.

```azurecli
RG_NAME="<resource-group>"
NS_NAME="<adr-namespace>"
DEVICE_ID="<device-id>"
```

## Disable a device

Run this preview command to disable a device in Device Registry when you need to pause device activity.

```azurecli
az iot adr ns device update \
  -n "$DEVICE_ID" \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --enabled false
```

## Enable a device

Run this preview command to enable a device in Device Registry after you verify that it's ready to return to service.

```azurecli
az iot adr ns device update \
  -n "$DEVICE_ID" \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --enabled true
```

## Verify device status

Run this command after either status change so you can confirm the current device state in Device Registry.

```azurecli
az iot adr ns device show \
  -n "$DEVICE_ID" \
  --ns "$NS_NAME" \
  -g "$RG_NAME"
```

Verify that the returned device status matches the change that you made.

---

## Related content

- [Integration with Azure Device Registry (preview)](iot-hub-device-registry-overview.md)
- [Deploy Azure IoT Hub with ADR integration and certificate management](iot-hub-device-registry-setup.md)
- [Revoke certificates and delete policies in Azure Device Registry](how-to-revoke-certificate-delete-policy.md)
- [Key concepts for certificate management (preview)](iot-hub-certificate-management-concepts.md)
