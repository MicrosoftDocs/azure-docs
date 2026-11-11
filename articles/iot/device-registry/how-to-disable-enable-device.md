---
title: Disable or enable a device in Azure Device Registry
titleSuffix: Azure IoT Hub
description: Disable or enable a device in Azure Device Registry so you can pause or resume device activity in Azure IoT Hub deployments.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: how-to
ai-usage: ai-generated
ms.date: 11/09/2026
#Customer intent: As an IoT Hub administrator, I want to disable or enable a device in Azure Device Registry so I can control when a device can participate in production operations.
---

# Disable or enable a device in Azure Device Registry

Disable a device in Azure Device Registry (ADR) to block its access to Azure IoT Hub without deleting its registry resource. A disabled device can't send messages or reprovision. Enable the device again when you're ready to allow it to reconnect.

Disabling a device might interrupt active operations, data collection, or dependent workflows. Before you enable a device, confirm that its configuration, security settings, and operational readiness meet your production requirements.

## Prerequisites

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing IoT Hub Gen2 deployment linked to a Device Registry namespace. For setup steps, see [Get started with Azure Device Registry for Azure IoT Hub](get-started-azure-device-registry.md).
- At least one device in your Device Registry namespace.
- The [Azure Device Registry Contributor](/azure/role-based-access-control/built-in-roles/internet-of-things#azure-device-registry-contributor) role on the Device Registry namespace.

# [Azure portal](#tab/portal)

## Disable a device

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Device Registry**.

1. Select **Devices**.

    :::image type="content" source="../media/how-to-disable-enable-device/devices-list.png" alt-text="Screenshot showing the list of devices in Azure Device Registry.":::

1. Select the IoT Hub device that you want to disable. Check that it belongs to the ADR namespace you intend to manage.

1. On the device page, select **edit** next to **Device status**.

    :::image type="content" source="../media/how-to-disable-enable-device/select-device.png" alt-text="Screenshot showing the edit link next to Device status.":::

1. For **Device status**, select **Disable**.

    :::image type="content" source="../media/how-to-disable-enable-device/disable-device.png" alt-text="Screenshot showing Disable selected and the Save button.":::

1. Select **Save**.

1. Wait for the **Disable device** notification to report success. Select **Refresh** on the device page and verify that **Device status** shows **Disabled**. If the operation fails, review the error in the notification before retrying.

## Enable a device

Before you enable the device, confirm that its configuration and security settings are ready for it to reconnect.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Device Registry**.

1. Select **Devices**.

1. Select the disabled IoT Hub device that you want to enable. Check that it belongs to the ADR namespace you intend to manage.

1. On the device page, select **edit** next to **Device status**.

1. For **Device status**, select **Enable**.

1. Select **Save**.

1. Wait for the **Enable device** notification to report success. Select **Refresh** on the device page and verify that **Device status** shows **Enabled**. If the operation fails, review the error in the notification before retrying.

# [Azure CLI](#tab/cli)

## Azure CLI prerequisites

The following examples use Bash syntax and Azure CLI 2.73.0 or later with stable version `1.0.0` of the `azure-iot` extension. [Install Azure CLI](/cli/azure/install-azure-cli), if necessary, then install or update the extension:

```azurecli
az extension add --name azure-iot --version 1.0.0 --upgrade
```

Sign in and select the subscription that contains your ADR namespace:

```azurecli
az login
az account set --subscription "<subscription-id>"
```

## Set variables

Set the resource group and ADR namespace names:

```azurecli
RG_NAME="<resource-group>"
NS_NAME="<adr-namespace>"
```

List the registry devices in the namespace:

```azurecli
az iot adr ns device list \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --query "[].{Name:name,ExternalDeviceId:properties.externalDeviceId,State:properties.enablementState}" \
  -o table
```

Set `DEVICE_NAME` to the **Name** of the device you want to manage. This name is the ADR resource name, which can differ from the external device ID used by IoT Hub.

```azurecli
DEVICE_NAME="<registry-device-name>"
```

## Disable a device

Run this command to disable a device in Device Registry when you need to pause device activity.

```azurecli
az iot adr ns device update \
  -n "$DEVICE_NAME" \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --enablement-state Disabled
```

## Enable a device

Run this command to enable a device in Device Registry after you verify that it's ready to return to service.

```azurecli
az iot adr ns device update \
  -n "$DEVICE_NAME" \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --enablement-state Enabled
```

## Verify device status

The update command waits for the operation to complete unless you specify `--no-wait`. After either change, use [az iot adr ns device show](/cli/azure/iot/adr/ns/device#az-iot-adr-ns-device-show) to check both the enablement state and the operation's provisioning state:

```azurecli
az iot adr ns device show \
  -n "$DEVICE_NAME" \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --query "{Name:name,EnablementState:properties.enablementState,ProvisioningState:properties.provisioningState}" \
  -o json
```

Verify that `EnablementState` is `Disabled` or `Enabled`, as requested, and that `ProvisioningState` is `Succeeded`. An enablement value alone doesn't confirm that the operation completed. If the update reports an error or the provisioning state is `Failed` or `Canceled`, resolve the reported error before retrying. If the state is `Accepted`, the operation is still in progress.

---

## Related content

- [Integration with Azure Device Registry](../../iot-hub/iot-hub-device-registry-overview.md)
- [Get started with Azure Device Registry for Azure IoT Hub](get-started-azure-device-registry.md)
- [Certificate revocation and policy management](../concepts-certificate-policy-management.md)
- [Key concepts for certificate management](../iot-certificate-management-concepts.md)
