---
title: How to manage linked IoT hubs with Device Provisioning Service (DPS)
description: This article shows how to link and manage IoT hubs with the Device Provisioning Service (DPS).
author: kgremban
ms.author: kgremban
ms.date: 01/18/2023
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
ms.custom: mvc, devx-track-azurecli
---

# How to link and manage IoT hubs

Azure IoT Hub Device Provisioning Service (DPS) can provision devices across one or more IoT hubs. Before DPS can provision devices to an IoT hub, it must be linked to your DPS instance. Once linked, an IoT hub can be used in an allocation policy. Allocation policies determine how devices are assigned to IoT hubs by DPS. This article provides instruction on how to link IoT hubs and manage them in your DPS instance.

## Linked IoT hubs and allocation policies

DPS can only provision devices to IoT hubs that have been linked to it. Linking an IoT hub to a DPS instance gives the service read/write permissions to the IoT hub's device registry. With these permissions, DPS can register a device ID and set the initial configuration in the device twin. Linked IoT hubs may be in any Azure region. You may link hubs in other subscriptions to your DPS instance.

After an IoT hub is linked to DPS, it's eligible to participate in allocation. Whether and how it will participate in allocation depends on settings in the enrollment that a device provisions through and settings on the linked IoT hub itself.

The following settings control how DPS uses linked IoT hubs:

* **Connection string**: Sets the IoT Hub connection string that DPS uses to connect to the linked IoT hub. The connection string is based on one of the IoT hub's shared access policies. DPS needs the following permissions on the IoT hub: *RegistryWrite* and *ServiceConnect*. The connection string must be for a shared access policy that has these permissions. To learn more about IoT Hub shared access policies, see  [IoT Hub access control and permissions](../iot-hub/iot-hub-dev-guide-sas.md#access-control-and-permissions).

* **Allocation weight**: Determines the likelihood of an IoT hub being selected when DPS hashes device assignment across a set of IoT hubs. The value can be between one and 1000. The default is one (or **null**). Higher values increase the IoT hub's probability of being selected.

* **Apply allocation policy**: Sets whether the IoT hub participates in allocation policy. The default is **Yes** (true). If set to **No** (false), devices won't be assigned to the IoT hub. The IoT hub can still be selected on an enrollment, but it won't participate in allocation. You can use this setting to temporarily or permanently remove an IoT hub from participating in allocation; for example, if it's approaching the allowed number of devices.

To learn about DPS allocation policies and how linked IoT hubs participate in them, see [Manage allocation policies](how-to-use-allocation-policies.md).

## Add a linked IoT hub

When you link an IoT hub to your DPS instance, it becomes available to participate in allocation. You can add IoT hubs that are inside or outside of your subscription. When you link an IoT hub, it may or may not be available for allocations in existing enrollments:

* For enrollments that don't explicitly set the IoT hubs to apply allocation policy to, a newly linked IoT hub immediately begins participating in allocation.

* For enrollments that do explicitly set the IoT hubs to apply allocation policy to, you'll need to manually or programmatically add the new IoT hub to the enrollment settings for it to participate in allocation.

### Limitations

* There are some limitations when working with linked IoT hubs and private endpoints. For more information, see [Private endpoint limitations](virtual-network-support.md#private-endpoint-limitations).

* The linked IoT Hub must have [Connect using shared access policies](../iot-hub/iot-hub-dev-guide-azure-ad-rbac.md#azure-ad-access-and-shared-access-policies) set to **Allow**.

### Use the Azure portal to link an IoT hub

In the Azure portal, you can link an IoT hub either from the left menu of your DPS instance or from the enrollment when creating or updating an enrollment. In both cases, the IoT hub is scoped to the DPS instance (not just the enrollment).

To link an IoT hub to your DPS instance in the Azure portal:

1. On the left menu of your DPS instance, select **Linked IoT hubs**.

1. At the top of the page, select **+ Add**.

1. On the **Add link to IoT hub** page, select the subscription that contains the IoT hub and then choose the name of the IoT hub from the **IoT hub** list.

1. After you select the IoT hub, choose an access policy that DPS will use to connect to the IoT hub. The **Access Policy** list shows all shared access policies defined on the selected IoT Hub that have both *RegistryWrite* and *ServiceConnect* permissions defined. The default is the *iothubowner* policy. Select the policy you want to use.  

1. Select **Save**.

When you're creating or updating an enrollment, you can use the **Link a new IoT hub** button on the enrollment. You'll be presented with the same page and choices as above. After you save the linked hub, it will be available on your DPS instance and can be selected from your enrollment.

> [!NOTE]
>
> In the Azure portal, you can't set the *Allocation weight* and *Apply allocation policy* settings when you add a linked IoT hub. Instead, You can update these settings after the IoT hub is linked. To learn more, see [Update a linked IoT hub](#update-a-linked-iot-hub).

### Use the Azure CLI to link an IoT hub

Use the [az iot dps linked-hub create](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-create) Azure CLI command to link an IoT hub to your DPS instance.

For example, the following command links an IoT hub named *MyExampleHub* using a connection string for its *iothubowner* shared access policy. This command leaves the *Allocation weight* and *Apply allocation policy* settings at their defaults, but you can specify values for these settings if you want to.

```azurecli
az iot dps linked-hub create --dps-name MyExampleDps --resource-group MyResourceGroup --connection-string "HostName=MyExampleHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XNBhoasdfhqRlgGnasdfhivtshcwh4bJwe7c0RIGuWsirW0=" --location westus
```

DPS also supports linking IoT Hubs using the [Create or Update DPS resource](/rest/api/iot-dps/iot-dps-resource/create-or-update?tabs=HTTP) REST API, [Resource Manager templates](/azure/templates/microsoft.devices/provisioningservices?pivots=deployment-language-arm-template), and the [DPS Management SDKs](libraries-sdks.md#management-sdks).

## Update a linked IoT hub

You can update the settings on a linked IoT hub to change its allocation weight, whether it can have allocation policies applied to it, and the connection string that DPS uses to connect to it. When you update the settings for an IoT hub, the changes take effect immediately, whether the IoT hub is specified on an enrollment or used by default.

### Use the Azure portal to update a linked IoT hub

In the Azure portal, you can update the *Allocation weight* and *Apply allocation policy* settings.

To update the settings for a linked IoT hub using the Azure portal:

1. On the left menu of your DPS instance, select **Linked IoT hubs**, then select the IoT hub from the list.

1. On the **Linked IoT hub details** page:

    :::image type="content" source="media/how-to-manage-linked-iot-hubs/set-linked-iot-hub-properties.png" alt-text="Screenshot that shows the linked IoT hub details page.":::.

    * Use the **Allocation weight** slider or text box to choose a weight between one and 1000. The default is one.

    * Set the **Apply allocation policy** switch to specify whether the linked IoT hub should be included in allocation.

1. Save your settings.

> [!NOTE]
>
> You can't update the connection string that DPS uses to connect to the IoT hub from the Azure portal. Instead, you can use the Azure CLI to update the connection string, or you can delete the linked IoT hub from your DPS instance and relink it. To learn more, see [Update keys for linked IoT hubs](#update-keys-for-linked-iot-hubs).

### Use the Azure CLI to update a linked IoT hub

With the Azure CLI, you can update the *Allocation weight*, *Apply allocation policy*, and *Connection string* settings.

Use the [az iot dps linked-hub update](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-update) command to update the allocation weight or apply allocation policies settings. For example, the following command sets the allocation weight and apply allocation policy for a linked IoT hub:

```azurecli
az iot dps linked-hub update --dps-name MyExampleDps --resource-group MyResourceGroup --linked-hub MyExampleHub --allocation-weight 2 --apply-allocation-policy true
```

Use the [az iot dps update](/cli/azure/iot/dps#az-iot-dps-update) command to update the connection string for a linked IoT hub. You can use the `--set` parameter along with the connection string for the IoT hub shared access policy you want to use. For details, see [Update keys for linked IoT hubs](#update-keys-for-linked-iot-hubs).

DPS also supports updating linked IoT Hubs using the [Create or Update DPS resource](/rest/api/iot-dps/iot-dps-resource/create-or-update?tabs=HTTP) REST API, [Resource Manager templates](/azure/templates/microsoft.devices/provisioningservices?pivots=deployment-language-arm-template), and the [DPS Management SDKs](libraries-sdks.md#management-sdks).

## Delete a linked IoT hub

When you delete a linked IoT hub from your DPS instance, it will no longer be available to set in future enrollments. However, it may or may not be removed from allocations in existing enrollments:

* For enrollments that don't explicitly set the IoT hubs to apply allocation policy to, a deleted linked IoT hub is no longer available for allocation.

* For enrollments that do explicitly set the IoT hubs to apply allocation policy to, you'll need to manually or programmatically remove the IoT hub from the enrollment settings for it to be removed from participation in allocation. Failure to do so may result in an error when a device tries to provision through the enrollment.

### Use the Azure portal to delete a linked IoT hub

To delete a linked IoT hub from your DPS instance in the Azure portal:

1. On the left menu of your DPS instance, select **Linked IoT hubs**.

1. From the list of IoT hubs, select the check box next to the IoT hub or IoT hubs you want to delete. Then select **Delete** at the top of the page and confirm your choice when prompted.

### Use the Azure CLI to delete a linked IoT hub

Use the [az iot dps linked-hub delete](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-delete) command to remove a linked IoT hub from the DPS instance. For example, the following command removes the IoT hub named MyExampleHub:

```azurecli
az iot dps linked-hub delete --dps-name MyExampleDps --resource-group MyResourceGroup --linked-hub MyExampleHub
```

DPS also supports deleting linked IoT Hubs from the DPS instance using the [Create or Update DPS resource](/rest/api/iot-dps/iot-dps-resource/create-or-update?tabs=HTTP) REST API, [Resource Manager templates](/azure/templates/microsoft.devices/provisioningservices?pivots=deployment-language-arm-template), and the [DPS Management SDKs](libraries-sdks.md#management-sdks).

## Update keys for linked IoT hubs

It may become necessary to either rotate or update the symmetric keys for an IoT hub that's been linked to DPS. In this case, you'll also need to update the connection string setting in DPS for the linked IoT hub. Note that provisioning to an IoT hub will fail during the interim between updating a key on the IoT hub and updating your DPS instance with the new connections string based on that key. For this reason, we recommend [using the Azuer CLI to update your keys](#use-the-azure-cli-to-update-keys) because you can update the connnection string on the linked hub direcctly. With the Azure portal, you have to delete the IoT hub from your DPS instance and then relink it in order to update the connection string.

### Use the Azure portal to update keys

You can't update the connection string setting for a linked IoT Hub when using Azure portal. Instead, you need to delete the linked IoT hub from your DPS instance and then re-add it.

To update symmetric keys for a linked IoT hub in the Azure portal:

1. On the left menu of your DPS instance in the Azure portal, select the IoT hub that you want to update the key(s) for.

1. On the **Linked IoT hub details** page, note down the values for *Allocation weight* and *Apply allocation policy*, you'll need these values when you relink the IoT hub to your DPS instance later. Then, select **Manage Resource** to go to the IoT hub.

1. On the left menu of the IoT hub, under **Security settings**, select **Shared access policies**.

1. On **Shared access policies**, under **Manage shared access policies**, select the policy that your DPS instance uses to connect to the linked IoT hub.

1. At the top of the page, select **Regenerate primary key**, **Regenerate secondary key**, or **Swap keys**, and confirm your choice when prompted.

1. Navigate back to your DPS instance.

1. Follow the steps in [Delete an IoT hub](#use-the-azure-portal-to-delete-a-linked-iot-hub) to delete the IoT hub from your DPS instance.

1. Follow the steps in [Link an IoT hub](#use-the-azure-portal-to-link-an-iot-hub) to relink the IoT hub to your DPS instance with the new connection string for the policy.

1. If you need to restore the allocation weight and apply allocation policy settings, follow the steps in [Update a linked IoT hub](#use-the-azure-portal-to-update-a-linked-iot-hub) using the values you saved in step 2.

### Use the Azure CLI to update keys

To update symmetric keys for a linked IoT hub with Azure CLS:

1. Use the [az iot hub policy renew-key](/cli/azure/iot/hub/policy#az-iot-hub-policy-renew-key) command to swap or regenerate the symmetric keys for the shared access policy on the IoT hub. For example, the following command renews the primary key for the *iothubowner* shared access policy on an IoT hub:

    ```azurecli
    az iot hub policy renew-key --hub-name MyExampleHub --name owner --rk primary
    ```

1. Use the [az iot hub connection-string show](/cli/azure/iot/hub/policy#az-iot-hub-az-iot-hub-connection-string-show) command to get the new connection string for the shared access policy. For example, the following command gets the primary connection string for the *iothubowner* shared access policy that the primary key was regenerated for in the previous command:

    ```azurecli
    az iot hub connection-string show --hub-name MyExampleHub --policy-name owner --key-type primary
    ```

1. Use the [az iot dps linked-hub list](/cli/azure/iot/dps/linked-hub#az-iot-dps-linked-hub-show) command to find the position of the IoT hub in the collection of linked IoT hubs for your DPS instance. For example, the following command gets the primary connection string for the *owner* shared access policy that the primary key was regenerated for in the previous command:

    ```azurecli
    az iot dps linked-hub list --dos-name MyExampleDps
    ```

    The output will show the position of the linked IoT hub you want to update the connection string for in the table of linked IoT hubs maintained by your DPS instance. In this case, it's the first IoT hub in the list, *MyExampleHub*.

    ```json
    [
    {
        "allocationWeight": null,
        "applyAllocationPolicy": null,
        "connectionString": "HostName=MyExampleHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=****",
        "location": "centralus",
        "name": "MyExampleHub.azure-devices.net"
    },
    {
        "allocationWeight": null,
        "applyAllocationPolicy": null,
        "connectionString": "HostName=MyExampleHub-2.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=****",
        "location": "centralus",
        "name": "NyExampleHub-2.azure-devices.net"
    }
    ]
    ```

1. Use the [az iot dps update](/cli/azure/iot/dps#az-iot-dps-update) command to update the connection string for the linked IoT hub. You use the `--set` parameter and the position of the linked IoT hub in the `properties.iotHubs[]` table to target the IoT hub. For example, the following command updates the connection string for *MyExampleHub* returned first in the previous command:

    ```azurecli
    az iot dps update --name MyExampleDps --set properties.iotHubs[0].connectionString="HostName=MyExampleHub-2.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=NewTokenValue"
    ```

## Next steps

* To learn more about allocation policies, see [Manage allocation policies](how-to-use-allocation-policies.md).
