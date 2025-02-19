---
title: Regenerate access keys
titleSuffix: Azure IoT Hub
description: Use the Azure portal, Azure CLI, or REST API to renew shared access policy keys for your IoT hub instance and devices.
author: kgremban

ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: azurecli
ms.topic: how-to
ms.date: 11/05/2024
ms.custom: devx-track-azurecli
---

# Regenerate shared access policy keys

Shared access signatures are one way to grant permissions at the service or device level. This article describes the process to regenerate those keys when you need to renew them in your applications. For more information, see [Control access to IoT Hub with shared access signatures](./authenticate-authorize-sas.md).

## Regenerate service keys

Every IoT hub comes with a set of default shared access policies that grant permissions to service-facing endpoints, device-facing endpoints, or the identity registry. You can also create your own policies. For more information, see [IoT hub-level shared access policies](./authenticate-authorize-sas.md#iot-hub-level-shared-access-policies).

## [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub instance.
1. In the IoT hub menu, select **Security settings** > **Shared access policies**.
1. Select the policy for which you want to regenerate keys.
1. In the policy details page, select either **Regenerate primary key** or **Regenerate secondary key**.

   :::image type="content" source="./media/regenerate-keys/regenerate-service-key.png" alt-text="Screenshot that shows the regenerate key options on a policy details page in the Azure portal.":::

1. Select **Yes** to confirm that you want to regenerate the key.

## [Azure CLI](#tab/cli)

Log in to your Azure account.

```azurecli
az login
```

Use the [az iot hub policy renew-key](/cli/azure/iot/hub/policy#az-iot-hub-policy-renew-key) command to regenerate the selected key for the selected policy.

```azurecli
az iot hub policy renew-key --hub-name <IOT_HUB_NAME> --name <POLICY_NAME> --renew key {primary, secondary, swap}
```

---

## Regenerate device keys

When you register a device to use SAS token authentication, that device gets two symmetric keys.

## [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub instance.
1. In the IoT hub menu, select **Device management** > **Devices**.
1. Select the device for which you want to regenerate keys.
1. Select **Manage keys**.
1. Choose either **Regenerate primary key** or **Regenerate secondary key** from the drop-down menu.

   :::image type="content" source="./media/regenerate-keys/regenerate-device-key.png" alt-text="Screenshot that shows the regenerate key options on a device details page in the Azure portal.":::

1. Select **Proceed** to confirm that you want to regenerate the key.

## [Azure CLI](#tab/cli)

Log in to your Azure account.

```azurecli
az login
```

Use the [az iot hub device-identity renew-key](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-renew-key) command to regenerate the selected symmetric key for the selected device.

```azurecli
az iot hub device-identity renew-key --device-id <DEVICE_NAME> --hub-name <IOT_HUB_NAME> --key-type {both, primary, secondary, swap}
```
