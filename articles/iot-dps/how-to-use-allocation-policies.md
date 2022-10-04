---
title: How to use allocation policies with Device Provisioning Service (DPS)
description: This article shows how to use the Device Provisioning Service (DPS) allocation policies to  automatically provision device  across one or more IoT hubs.
author: kgremban
ms.author: kgremban
ms.date: 09/19/2022
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
ms.custom: mvc
---

# How to use allocation policies to provision devices across IoT hubs

Azure IoT Hub Device Provisioning Service (DPS) supports several built-in allocation policies that determine how it assigns devices across one or more IoT hubs. DPS also includes support for custom allocation policies, which let you create and use your own allocation policies when your IoT scenario requires functionality not provided by the built-in policies.

This article helps you understand how to use and manage DPS allocation policies.

## Understand allocation policies

Allocation policies determine how DPS assigns devices to IoT hubs. Before an IoT hub can be used in an allocation policy, it must be linked to the DPS instance. Once an IoT hub is linked to DPS it can be specified to participate in allocation on the enrollment. 

DPS supports four allocation policies:

* **Evenly weighted distribution**: IoT hubs have devices provisioned to them based on their allocation weight setting. By default all linked IoT hubs have the same allocation weight setting, which means that IoT hubs are equally likely to have a device provisioned to them. However, you can adjust the allocation weight setting on a linked IoT hub to increase or decrease its likelihood of being assigned to provisioning devices. Evenly weighted distribution is the default allocation policy setting for DPS. If you're provisioning devices to only one IoT hub, you can keep this setting.

    >[!NOTE]
    > It may be desirable to use only one IoT Hub until a specific number of devices is reached. In that scenario, it's important to note that, once a new IoT Hub is added, a new device has the potential to be provisioned to any one of the IoT Hubs. If you wish to balance all devices, registered and unregistered, then you'll need to re-provision all devices.

* **Lowest latency**: devices are provisioned to the IoT hub with the lowest latency to the device. If multiple IoT hubs would provide the lowest latency, then DPS hashes devices across those hubs.

* **Static configuration (via enrollment list only)**: devices are provisioned to a single IoT hub, which must be specified on the enrollment.

* **Custom (Use Azure Function)**: A [custom allocation policy](how-to-use-custom-allocation-policies.md) gives you more control over how devices are assigned to an IoT hub. This is accomplished by using custom code in an Azure Function to assign devices to an IoT hub. The device provisioning service calls your Azure Function code providing all relevant information about the device and the enrollment to your code. Your function code returns the IoT hub information used to provisioning the device.

There are two settings on a linked IoT hub that determine how it participates in allocation:

* **Allocation weight** sets the weight that the IoT hub will have when participating in allocation policies that involve provisioning among multiple IoT hubs. It can be a value between one and 1000. The default is one.

  * When using the *Evenly weighted distribution* allocation policy, IoT hubs with higher allocation weight values have a greater likelihood of being selected compared to those with lower weight values.

  * When using the *Lowest latency* allocation policy, the allocation weight setting will affect the probability of an IoT hub being selected when more than one IoT hub satisfies the lowest latency requirement.
  
  * When using a *Custom* allocation policy, whether and how the allocation weight setting is used will depend on the webhook logic.

* **Apply allocation policy** specifies whether the IoT hub participates in allocation policy. If set to **Yes/true**, the IoT hub can have devices assigned to it; if **No/false**, devices won't be assigned to the IoT hub. Regardless of the setting's value, the IoT hub can still be selected on an enrollment, it just won't participate in allocation. You can use this setting to temporarily or permanently remove an IoT hub from participating in allocation; for example, if it is approaching the allowed number of devices.

The allocation policy can be set on the DPS instance and, optionally, on an enrollment.

* The DPS instance setting serves as the default allocation policy for enrollments. Only *Evenly weighted distribution*, *Lowest latency*, and *Static configuration* can be specified for the DPS instance. If *Static configuration* is specified, a linked IoT hub *must* be specified any enrollments that default to the DPS instance allocation policy setting.

* The Enrollment allocation policy setting supports all four allocation policies.

  * For *Evenly weighted distribution*, *Lowest latency*, and *Custom* allocation policies, the enrollment *may* specify which linked IoT hubs should be used. For these policies, if no IoT hubs are selected in the enrollment, then all of the linked IoT hubs in the DPS instance will be used.

  * For *Static configuration*, the enrollment *must* specify a single IoT hub from the list of linked IoT hubs.

For simple IoT solution topologies, for example, those that involve assigning devices among the same set of one or more IoT hubs using the same allocation policy, managing allocation at the service-level may be sufficient. For more complicated topologies, for example, multi-tenant scenarios where each customer is assigned a dedicated set of IoT hubs, managing allocation policy at the enrollment-level is preferred.

## Set allocation policy on the DPS instance

The DPS instance allocation policy is used if no allocation policy is set on an enrollment. By default, DPS instances are created with the *Evenly weighted distribution* (hashed) policy. If desired, you can set a different allocation policy for your DPS instance.

### Use Azure CLI to set allocation policy on the DPS instance

Use the [az iot dps update](/cli/azure/iot/dps#az-iot-dps-update) Azure CLI command to set the allocation policy on the DPS instance. You use `--set properties.allocationPolicy` to specify the policy. For example, the following command sets the allocation policy to *Evenly weighted distribution* (the default):

```azurecli
az iot dps update --name MyExampleDps --set properties.allocationPolicy=hashed
```

### Use Azure portal to set allocation policy on the DPS instance

To set the allocation policy for the DPS instance in Azure portal:

1. On the left menu of your DPS instance, select **Manage allocation policy**.

2. Select the button for the allocation policy you want to set: **Lowest latency**, **Evenly weighted distribution**, or **Static configuration**. (Custom allocation isn't supported at the service level.)

3. Select **Save**.

DPS also supports setting the service-level allocation policy using the [az iot dps policy](/cli/azure/iot/dps/policy) Azure CLI command, the [Create or Update DPS resource](/rest/api/iot-dps/iot-dps-resource/create-or-update?tabs=HTTP) REST API, [Resource Manager templates](/azure/templates/microsoft.devices/provisioningservices?pivots=deployment-language-arm-template), and the [DPS Management SDKs](libraries-sdks.md#management-sdks).

## Manage allocation policy and linked IoT hubs on enrollments

The allocation policy and selected IoT hub settings on enrollments provide the most flexible support for IoT solution topologies.

By default, individual enrollments and enrollment groups inherit the allocation policy set on the DPS instance. For *Lowest latency* and *Evenly weighted distribution*, the allocation policy is applied across all of the IoT hubs linked to the DPS instance. For the *Static configuration* policy, you must specify an IoT hub when you create the enrollment.

For both individual enrollments and enrollment groups, you can specify an allocation policy and the linked IoT hubs to apply it to when you create or update an enrollment.

## Use Azure CLI to manage allocation policy and IoT hubs on an enrollment

Use the [az iot dps enrollment create](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-create), [az iot dps enrollment update](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-update), [az iot dps enrollment-group create](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-group-create), [az iot dps enrollment-group update](/cli/azure/iot/dps/enrollment#az-iot-dps-enrollment-group-update)  Azure CLI commands to create or update individual enrollments or enrollment groups.

For example, the following command creates a symmetric key enrollment group that defaults to the allocation policy set on the DPS instance and uses all the IoT hubs linked to the DPS instance:

```azurecli
az iot dps enrollment-group create --dps-name MyExampleDps --enrollment-id MyEnrollmentGroup 
```

The following command updates the same enrollment group to use the *Lowest latency* allocation policy with IoT hubs named *MyExampleHub* and *MyExampleHub-2*:

```azurecli
az iot dps enrollment-group update --dps-name MyExampleDps --enrollment-id MyEnrollmentGroup --allocation-policy geolatency --iot-hubs "MyExampleHub.azure-devices.net MyExampleHub-2.azure-devices.net"
```

For more examples, see the linked commands.

## Use Azure portal to manage allocation policy and IoT hubs on an enrollment

1. On the left menu of your DPS instance, select **Manage enrollments**.

1. On the **Manage enrollments** page:

    * To create a new enrollment, select either **+ Add enrollment group** or **+ Add individual enrollment** at the top of the page.

    * To update an existing enrollment, select it from the list under either the **Enrollment Groups** or **Individual Enrollments** tab.

1. On the **Add Enrollment** page (on create) or the **Enrollment details** page (on update), you can select the allocation policy you want applied to the enrollment and select the IoT hubs that should be used:

    :::image type="content" source="media/how-to-use-allocation-policies/select-enrollment-policy-and-hubs.png" alt-text="Screenshot that shows the allocation policy and selected hubs settings on Add Enrollment page.":::.

    * Select the allocation policy you want to apply from the drop-down. For custom allocation, you'll also need to specify a custom allocation policy webhook in Azure Functions. For details, see the [Use custom allocation policies](tutorial-custom-allocation-policies.md) tutorial.

    * Select the IoT hubs that devices can be assigned to. If you've selected the *Static configuration* allocation policy, you'll be limited to selecting a single linked IoT hub. For all other allocation policies, all of the linked IoT hubs will be selected by default, but you can modify this selection using the drop-down. To have the enrollment automatically use linked IoT hubs as they are added to (or deleted from) the DPS instance, unselect all IoT hubs.

    * Optionally, you can select the **Link a new IoT hub** button to link a new IoT hub to the DPS instance and add it to the list of IoT hubs. For details about managing

1. Set any other properties needed for the enrollment and then save your settings.

DPS also supports setting allocation policy and selected IoT hubs on the enrollment using the [Create or Update individual enrollment](/rest/api/iot-dps/service/individual-enrollment/create-or-update) and [Create or Update enrollment group](/rest/api/iot-dps/service/enrollment-group/create-or-update) REST APIs, and the [DPS service SDKs](libraries-sdks.md#service-sdks).

> [!NOTE]
>
> Note the following behavior when creating enrollments:
>
> * With Azure CLI and the DPS service SDKs, you can create enrollments with no allocation policy. In this case, DPS uses the service-level policy when a device provisions through the enrollment. Changing the service-level setting will change how devices are provisioned through the enrollment.
>
> * With Azure portal, the service-level allocation policy is used to pre-populate the allocation policy setting for the enrollment. You can either keep this setting or change it, but when you save the enrollment this setting becomes the enrollment-level setting. Subsequently changing the service-level allocation policy will have no effect on how devices are provisioned through the enrollment.
>
> * For the *Equally weighted distribution*, *Lowest latency* and *Custom* allocation policies you can configure the enrollment to always use the service-level setting for linked IoT hubs:
>
>   * With Azure CLI and the DPS service SDKs, create the enrollment without specifying any IoT hubs.
>
>   * With Azure portal, the enrollment is pre-populated with all of the linked IoT hubs on the DPS instance selected; unselect all the linked IoT hubs before you save the enrollment.
>
>   If no IoT hubs are selected at the enrollment-level, then whenever a linked IoT hub is added to the DPS instance, it will participate in allocation; and vice versa for a linked IoT hub that is removed from the instance. Otherwise, for existing enrollments, the selected IoT hubs setting must be manually or programmatically updated for a newly added linked IoT hub to be added or a deleted IoT hub to be removed from participation.

## Limitations

Note the following limitations with DPS allocation policies:

* Adding or removing a linked IoT hub from the DPS service, selecting or unselecting an IoT hub on an enrollment, or changing the allocation policy on the DPS service or on an enrollment takes effect on future allocations. Such changes have no effect on devices already assigned to an IoT hub. If you want the changes to be retroactive, you must reprovision devices that are already assigned.

* When using private endpoints, the DPS instance and a linked IoT hub can't be in different clouds. For example, [Azure Government and global Azure](../azure-government/documentation-government-welcome.md).

* Currently, [custom allocation policies](tutorial-custom-allocation-policies.md) won't work if the Azure function is locked down to a VNET and private endpoints.

* The *Lowest latency* allocation policy isn't reliable in a virtual network environment.

## Next steps

* For an end-to-end example using the lowest latency allocation policy, see the [Provision for geolatency](how-to-provision-multitenant.md) tutorial.

* To learn more about custom allocation policies, see the [Use custom allocation policies](tutorial-custom-allocation-policies.md) tutorial.