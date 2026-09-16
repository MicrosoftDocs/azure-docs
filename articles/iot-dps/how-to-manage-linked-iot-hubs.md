---
title: How to manage linked IoT hubs with Device Provisioning Service (DPS)
description: This article shows how to link and manage IoT hubs with the Device Provisioning Service (DPS).
author: sethmanheim
ms.author: sethm
ms.date: 08/23/2024
ms.topic: how-to
ms.service: azure-iot-hub
services: iot-dps
ms.subservice: azure-iot-hub-dps
ms.custom:
  - mvc
  - devx-track-azurecli
  - sfi-image-nochange
  - sfi-ropc-nochange
---

# How to link and manage IoT hubs

Azure IoT Hub Device Provisioning Service (DPS) can provision devices across one or more IoT hubs. Before DPS can provision devices to an IoT hub, it must be able to write to the IoT hub device registry. This article provides instruction on how to link IoT hubs and manage them in your DPS instance. Once linked, an IoT hub can be used in an allocation policy. Allocation policies determine how devices are assigned to IoT hubs by DPS.

## Linked IoT hub settings

The Device Provisioning Service can only provision devices to IoT hubs that have been linked to it. Linking an IoT hub to a DPS instance gives the DPS instance read/write permissions to the IoT hub's device registry. With these permissions, DPS can register a device ID and set the initial configuration in the device twin. Linked IoT hubs may be in any Azure region. You may link hubs in other subscriptions to your DPS instance.

After an IoT hub is linked to DPS, it's eligible to participate in allocation. Whether and how it participates in allocation depends on settings in the enrollment that a device provisions through and settings on the linked IoT hub itself.

The following settings control how DPS uses linked IoT hubs:

* **Connection string**: Sets the IoT Hub connection string that DPS uses to connect to the linked IoT hub. The connection string is based on one of the IoT hub's shared access policies. DPS needs the following permissions on the IoT hub: *RegistryWrite* and *ServiceConnect*. The connection string must be for a shared access policy that has these permissions. To learn more about IoT Hub shared access policies, see  [IoT Hub access control and permissions](../iot-hub/authenticate-authorize-sas.md#access-control-and-permissions).

* **Authentication type**: Controls how DPS authenticates to the linked IoT hub. Supported values are `KeyBased` (connection string), `SystemAssigned` (system-assigned managed identity), and `UserAssigned` (user-assigned managed identity). See [Link an IoT hub by using managed identity](#link-an-iot-hub-by-using-managed-identity-preview).

* **Hostname type**: Sets which IoT Hub endpoint DPS uses when provisioning devices. Use `classic` for the standard endpoint or `device` for the TLS 1.3-capable device endpoint. See [Use TLS 1.3 endpoints for linked hubs](#use-tls-13-endpoints-for-linked-hubs-preview).

* **Allocation weight**: Determines the likelihood of an IoT hub being selected when DPS hashes device assignment across a set of IoT hubs. The value can be between one and 1000. The default is one (or **null**). Higher values increase the IoT hub's probability of being selected.

* **Apply allocation policy**: Sets whether the IoT hub participates in allocation policy. The default is **Yes** (true). If set to **No** (false), devices aren't assigned to the IoT hub. The IoT hub can still be selected on an enrollment, but it won't participate in allocation. You can use this setting to temporarily or permanently remove an IoT hub from participating in allocation; for example, if it's approaching the allowed number of devices.

To learn about DPS allocation policies and how linked IoT hubs participate in them, see [Manage allocation policies](how-to-use-allocation-policies.md).

## Limitations

* There are some limitations when working with linked IoT hubs and private endpoints. For more information, see [Private endpoint limitations](virtual-network-support.md#private-endpoint-limitations).

* The linked IoT Hub must have [Connect using shared access policies](../iot-hub/iot-hub-dev-guide-azure-ad-rbac.md#azure-ad-access-and-shared-access-policies) set to **Allow**.

## Add a linked IoT hub

You can add IoT hubs that are inside or outside of your subscription. When you link an IoT hub, it might or might not be available for allocations in existing enrollments:

* For enrollments that don't explicitly set the IoT hubs to apply allocation policy to, a newly linked IoT hub immediately begins participating in allocation.

* For enrollments that do explicitly set the IoT hubs to apply allocation policy to, you'll need to manually or programmatically add the new IoT hub to the enrollment settings for it to participate in allocation.

### [Azure portal](#tab/portal)

In the Azure portal, you can link an IoT hub either from the left menu of your DPS instance or from the enrollment when creating or updating an enrollment. In both cases, the IoT hub is scoped to the DPS instance (not just the enrollment).

To link an IoT hub to your DPS instance in the Azure portal:

1. On the left menu of your DPS instance, select **Linked IoT hubs**.

1. At the top of the page, select **+ Add**.

1. On the **Add link to IoT hub** page, select the subscription that contains the IoT hub and then choose the name of the IoT hub from the **IoT hub** list.

1. After you select the IoT hub, choose an access policy that DPS will use to connect to the IoT hub. The **Access Policy** list shows all shared access policies defined on the selected IoT Hub that have both *RegistryWrite* and *ServiceConnect* permissions defined. The default is the *iothubowner* policy. Select the policy you want to use.  

1. Select **Save**.

> [!NOTE]
>
> In the Azure portal, you can't set the *Allocation weight* and *Apply allocation policy* settings when you add a linked IoT hub. Instead, update these settings after the IoT hub is linked.

### [Azure CLI](#tab/cli)

Use the [az iot dps linked-hub create](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-create) Azure CLI command to link an IoT hub to your DPS instance.

For example, the following command links an IoT hub by using a connection string for its *iothubowner* shared access policy:

```azurecli
az iot dps linked-hub create --dps-name MyExampleDps --resource-group MyResourceGroup --connection-string "HostName=MyExampleHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XNBhoasdfhqRlgGnasdfhivtshcwh4bJwe7c0RIGuWsirW0=" --location westus
```

To link by using managed identity or to specify a TLS 1.3 endpoint, see [Link an IoT hub by using managed identity](#link-an-iot-hub-by-using-managed-identity-preview) and [Use TLS 1.3 endpoints for linked hubs](#use-tls-13-endpoints-for-linked-hubs-preview).

---

DPS also supports linking IoT Hubs using the [Create or Update DPS resource](/rest/api/iot-dps/iot-dps-resource/create-or-update?tabs=HTTP) REST API, [Resource Manager templates](/azure/templates/microsoft.devices/provisioningservices?pivots=deployment-language-arm-template), and the [DPS Management SDKs](libraries-sdks.md#management-sdks).

## Link an IoT hub by using managed identity (preview)

Instead of a shared access key connection string, you can link an IoT hub to DPS by using a managed identity. DPS supports system-assigned and user-assigned managed identities.

### Prerequisites

- You must enable the managed identity on your DPS instance before linking.
- The managed identity must have the **IoT Hub Data Contributor** role (or a custom role with `RegistryWrite` and `ServiceConnect` permissions) on the target IoT hub.

To assign a system-assigned identity to your DPS instance:

```azurecli
az iot dps identity assign --name <dps-name> --resource-group <resource-group> --system
```

To assign a user-assigned identity:

```azurecli
az identity create --name <identity-name> --resource-group <resource-group>
UAMI_ID=$(az identity show --name <identity-name> --resource-group <resource-group> --query id --output tsv)
az iot dps identity assign --name <dps-name> --resource-group <resource-group> --user $UAMI_ID
```

### Link by using system-assigned managed identity

```azurecli
az iot dps linked-hub create \
  --dps-name <dps-name> \
  --resource-group <resource-group> \
  --hub-name <hub-name> \
  --authentication-type SystemAssigned
```

### Link using user-assigned managed identity

```azurecli
az iot dps linked-hub create \
  --dps-name <dps-name> \
  --resource-group <resource-group> \
  --hub-name <hub-name> \
  --authentication-type UserAssigned \
  --user-assigned-identity <identity-resource-id>
```

> [!NOTE]
> The `--hostname-type service` option isn't supported for DPS linked-hub operations.

## Use TLS 1.3 endpoints for linked hubs (preview)

When you link an IoT hub to DPS, you can choose which endpoint DPS uses when provisioning devices. By default, new links use the TLS 1.3-capable device endpoint.

| Hostname type | Endpoint used by DPS |
|---------------|----------------------|
| `classic` | `<hub>.azure-devices.net` |
| `device` (default for new links) | `<hub>.device.azure-devices.net` |

To specify the endpoint type when linking:

```azurecli
# Link using the TLS 1.3 device endpoint (default)
az iot dps linked-hub create \
  --dps-name <dps-name> \
  --resource-group <resource-group> \
  --hub-name <hub-name> \
  --hostname-type device

# Link using the classic endpoint
az iot dps linked-hub create \
  --dps-name <dps-name> \
  --resource-group <resource-group> \
  --hub-name <hub-name> \
  --hostname-type classic
```

### Migrate a linked hub to the TLS 1.3 endpoint

The `az iot dps linked-hub update` command doesn't support changing `--hostname-type` on an existing link; it's rejected as an unrecognized argument. To move a linked hub to a different endpoint, create a new link with the desired `--hostname-type`, then delete the old link by its full hostname.

```azurecli
# Create a new link that uses the TLS 1.3 device endpoint
az iot dps linked-hub create \
  --dps-name <dps-name> \
  --resource-group <resource-group> \
  --hub-name <hub-name> \
  --hostname-type device

# Delete the old link by its full hostname (for example, the classic endpoint)
az iot dps linked-hub delete \
  --dps-name <dps-name> \
  --resource-group <resource-group> \
  --linked-hub <hub-name>.azure-devices.net
```

> [!IMPORTANT]
> If an allocation policy distributes devices across multiple linked hubs that use different endpoint types, ensure all devices support the endpoints they might be assigned to. Devices provisioned to a TLS 1.3 endpoint must support SNI and the required cipher suites. For more information, see [TLS 1.3 support](../iot-hub/iot-hub-tls-support.md#tls-13-support-preview).

## Update a linked IoT hub

You can update the settings on a linked IoT hub to change its allocation weight, whether it can have allocation policies applied to it, and the connection string that DPS uses to connect to it. When you update the settings for an IoT hub, the changes take effect immediately, whether the IoT hub is specified on an enrollment or used by default.

### [Azure portal](#tab/portal)

In the Azure portal, you can update the *Allocation weight* and *Apply allocation policy* settings.

To update the settings for a linked IoT hub using the Azure portal:

1. On the left menu of your DPS instance, select **Linked IoT hubs**, then select the IoT hub from the list.

1. On the **Linked IoT hub details** page:

    :::image type="content" source="media/how-to-manage-linked-iot-hubs/set-linked-iot-hub-properties.png" alt-text="Screenshot that shows the linked IoT hub details page.":::

    * Use the **Allocation weight** slider or text box to choose a weight between one and 1000. The default is one.

    * Set the **Apply allocation policy** switch to specify whether the linked IoT hub should be included in allocation.

1. Save your settings.

> [!NOTE]
>
> You can't update the connection string that DPS uses to connect to the IoT hub from the Azure portal. Instead, use the Azure CLI to update the connection string, or delete the linked IoT hub from your DPS instance and relink it. To learn more, see the [Update keys for linked IoT hubs](#update-keys-for-linked-iot-hubs) section.

### [Azure CLI](#tab/cli)

With the Azure CLI, you can update the *Allocation weight*, *Apply allocation policy*, and *Connection string* settings.

Use the [az iot dps linked-hub update](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-update) command to update the allocation weight or apply allocation policies settings. For example, the following command sets the allocation weight and apply allocation policy for a linked IoT hub:

```azurecli
az iot dps linked-hub update --dps-name MyExampleDps --resource-group MyResourceGroup --linked-hub MyExampleHub --allocation-weight 2 --apply-allocation-policy true
```

You can also change how DPS authenticates to the linked hub. Use `--authentication-type` to switch between a managed identity and a key-based connection string:

```azurecli
az iot dps linked-hub update --dps-name MyExampleDps --resource-group MyResourceGroup --hub-name MyExampleHub --authentication-type SystemAssigned
```

`--authentication-type` also accepts `UserAssigned` (with `--user-assigned-identity`) and `KeyBased`, which switches the link back to a shared access key connection string.

Use the [az iot dps update](/cli/azure/iot/dps#az-iot-dps-update) command to update the connection string for a linked IoT hub. You can use the `--set` parameter along with the connection string for the IoT hub shared access policy you want to use. For details, see [Update keys for linked IoT hubs](#update-keys-for-linked-iot-hubs).

---

DPS also supports updating linked IoT Hubs using the [Create or Update DPS resource](/rest/api/iot-dps/iot-dps-resource/create-or-update?tabs=HTTP) REST API, [Resource Manager templates](/azure/templates/microsoft.devices/provisioningservices?pivots=deployment-language-arm-template), and the [DPS Management SDKs](libraries-sdks.md#management-sdks).

## Delete a linked IoT hub

When you delete a linked IoT hub from your DPS instance, it will no longer be available to set in future enrollments. However, it might or might not be removed from allocations in existing enrollments:

* For enrollments that don't explicitly set the IoT hubs to apply allocation policy to, a deleted linked IoT hub is no longer available for allocation.

* For enrollments that do explicitly set the IoT hubs to apply allocation policy to, you'll need to manually or programmatically remove the IoT hub from the enrollment settings for it to be removed from participation in allocation. Failure to do so might result in an error when a device tries to provision through the enrollment.

### [Azure portal](#tab/portal)

To delete a linked IoT hub from your DPS instance in the Azure portal:

1. On the left menu of your DPS instance, select **Linked IoT hubs**.

1. From the list of IoT hubs, select the check box next to the IoT hub or IoT hubs you want to delete. Then select **Delete** at the top of the page and confirm your choice when prompted.

### [Azure CLI](#tab/cli)

Use the [az iot dps linked-hub delete](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-delete) command to remove a linked IoT hub from the DPS instance. For example, the following command removes the IoT hub named MyExampleHub:

```azurecli
az iot dps linked-hub delete --dps-name MyExampleDps --resource-group MyResourceGroup --linked-hub MyExampleHub.device.azure-devices.net
```

---

DPS also supports deleting linked IoT Hubs from the DPS instance using the [Create or Update DPS resource](/rest/api/iot-dps/iot-dps-resource/create-or-update?tabs=HTTP) REST API, [Resource Manager templates](/azure/templates/microsoft.devices/provisioningservices?pivots=deployment-language-arm-template), and the [DPS Management SDKs](libraries-sdks.md#management-sdks).

## Update keys for linked IoT hubs

It may become necessary to either rotate or update the symmetric keys for an IoT hub that's been linked to DPS. In this case, you'll also need to update the connection string setting in DPS for the linked IoT hub.

Provisioning to an IoT hub will fail during the interim between updating a key on the IoT hub and updating your DPS instance with the new connections string based on that key. For this reason, we recommend using the Azure CLI to update your keys because you can update the connection string on the linked hub directly. With the Azure portal, you have to delete the IoT hub from your DPS instance and then relink it in order to update the connection string.

### [Azure portal](#tab/portal)

You can't update the connection string setting for a linked IoT Hub when using Azure portal. Instead, you need to delete the linked IoT hub from your DPS instance and then readd it.

To update symmetric keys for a linked IoT hub in the Azure portal:

1. On the left menu of your DPS instance in the Azure portal, select the IoT hub that you want to update one or more keys for.

1. On the **Linked IoT hub details** page, note down the values for *Allocation weight* and *Apply allocation policy*. You need these values when you relink the IoT hub to your DPS instance later. Then, select **Manage Resource** to go to the IoT hub.

1. On the left menu of the IoT hub, under **Security settings**, select **Shared access policies**.

1. On **Shared access policies**, under **Manage shared access policies**, select the policy that your DPS instance uses to connect to the linked IoT hub.

1. At the top of the page, select **Regenerate primary key**, **Regenerate secondary key**, or **Swap keys**, and confirm your choice when prompted.

1. Navigate back to your DPS instance.

1. Follow the steps in the [Delete a linked IoT hub](#delete-a-linked-iot-hub) section to delete the IoT hub from your DPS instance.

1. Follow the steps in the [Add a linked IoT hub](#add-a-linked-iot-hub) section to relink the IoT hub to your DPS instance with the new connection string for the policy.

1. If you need to restore the allocation weight and apply allocation policy settings, follow the steps in the [Update a linked IoT hub](#update-a-linked-iot-hub) section using the values you saved in step 2.

### [Azure CLI](#tab/cli)

To update symmetric keys for a linked IoT hub with Azure CLS:

1. Use the [az iot hub policy renew-key](/cli/azure/iot/hub/policy#az-iot-hub-policy-renew-key) command to swap or regenerate the symmetric keys for the shared access policy on the IoT hub. For example, the following command renews the primary key for the *iothubowner* shared access policy on an IoT hub:

    ```azurecli
    az iot hub policy renew-key --hub-name MyExampleHub --name owner --rk primary
    ```

1. Use the [az iot dps linked-hub update](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-update) command with `--authentication-type KeyBased` to refresh the stored key for the linked IoT hub. The CLI fetches the refreshed key while preserving the linked endpoint hostname and existing policy, so you don't need to build a new connection string or target the hub by its array index. Identify the hub by its full hostname:

    ```azurecli
    az iot dps linked-hub update --dps-name <dps-name> --resource-group <resource-group> --linked-hub <full-hostname> --authentication-type KeyBased
    ```

---

## Next steps

* To learn more about allocation policies, see [Manage allocation policies](how-to-use-allocation-policies.md).
