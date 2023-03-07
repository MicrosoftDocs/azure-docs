---
title: Manage device enrollments in the Azure portal
titleSuffix: Azure IoT Hub Device Provisioning Service
description: How to manage group and individual device enrollments for your Device Provisioning Service (DPS) in the Azure portal
author: kgremban
ms.author: kgremban
ms.date: 03/06/2023
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
manager: lizross
---

# How to manage device enrollments with Azure portal

A *device enrollment* creates a record of a single device or a group of devices that may at some point register with the Azure IoT Hub Device Provisioning Service (DPS). The enrollment record contains the initial configuration for the device(s) as part of that enrollment. Included in the configuration is either the IoT hub to which a device will be assigned, or an allocation policy that configures the IoT hub from a set of IoT hubs. This article shows you how to manage device enrollments for your provisioning service.

The Device Provisioning Service supports two types of enrollments:

* [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices.
* [Individual enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.

> [!IMPORTANT]
> If you have trouble accessing enrollments from the Azure portal, it may be because you have public network access disabled or IP filtering rules configured that block access for the Azure portal. To learn more, see [Disable public network access limitations](public-network-access.md#disable-public-network-access-limitations) and [IP filter rules limitations](iot-dps-ip-filtering.md#ip-filter-rules-limitations).

## Prerequisites

* Create an instance of Device Provisioning Service in your subscription and link it to an IoT hub. For more information see, [Quickstart: Set up the IoT Hub Device Provisionins Service](./quick-setup-auto-provision.md).

## Create an enrollment group

An enrollment group is an entry for a group of devices that share a common attestation mechanism. We recommend that you use an enrollment group for a large number of devices that share an initial configuration, or for devices that go to the same tenant. Enrollment groups support devices that use either [symmetric key](concepts-symmetric-key-attestation.md) or [X.509 certificates](concepts-x509-attestation.md) attestation.

# [Symmetric key](#tab/key)

For a walkthrough that demonstrates how to create and use enrollment groups with symmetric keys, see the [Provision devices with symmetric keys](how-to-legacy-device-symm-key.md) tutorial.

To create a symmetric key enrollment group:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. At the top of the page, select **Add enrollment group**.

1. On the **Registration + provisioning** tab of the **Add enrollment group** page, provide the following information to configure the enrollment group details:

   | Field | Description |
   | :--- | :--- |
   | **Attestation** |Select **Symmetric key**.|
   | **Symmetric key settings** |Check the **Generate symmetric keys automatically** box if you want to use randomly generated keys. Uncheck this box if you want to provide your own. |
   | **Group name** | Provide a name for the group of devices. The enrollment group name is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`).|
   | **Provisioning status** | Check the **Enable this enrollment** if you want this enrollment group to be available to provision devices. Uncheck this box if you want the group to be disabled. You can change this setting later. |
   | **Reprovision policy** | For more information, see [Reprovision policies](./concepts-device-reprovision.md#reprovision-policies)] |

   :::image type="content" source="./media/how-to-manage-enrollments/add-enrollment-group-symm-key.png" alt-text="Screenshot that shows adding an enrollment group for symmetric key attestation.":::

1. Select **Next: IoT hubs**.

1. On the **IoT hubs** tab of the **Add enrollment group** page, provide the following information to determine which IoT hubs the enrollment group can provision devices to:

   | Field | Description |
   | :---- | :---------- |
   | **Target IoT hubs** |Select one or more of your linked IoT hubs, or add a new link to an IoT hub. To learn more about linking IoT hubs to your DPS instance, see [How to link and manage IoT hubs](how-to-manage-linked-iot-hubs.md).|
   | **Allocation policy** | If you selected more than one linked IoT hub, select how you want to assign devices to the different hub. To learn more about allocation policies, see [How to use allocation policies](how-to-use-allocation-policies.md).<br><br>If you selected only one linked IoT hub, we recommend using the **Evenly weighted distribution** policy.|

   :::image type="content" source="./media/how-to-manage-enrollments/add-enrollment-group-key-linked-hub.png" alt-text="Screenshot that shows connecting IoT hubs to the new enrollment group.":::

1. Select **Next: Device settings**

1. On the **Device settings** tab of the **Add enrollment group** page, provide the following information to define how newly provisioned devices will be configured:

   | Field | Description |
   | :---- | :---------- |
   | **IoT Edge** | Check the **Enable IoT Edge on provisioned devices** if all the devices provisioned through this group will run [Azure IoT Edge](../iot-edge/about-iot-edge.md). Uncheck this box if this group is for non-IoT Edge-enabled devices only. Either all devices in a group will be IoT Edge-enabled or none can be. |
   | **Device tags** | Use this text box to provide any tags that you want to apply to the device twins of provisioned devices. |
   | **Desired properties** | Use this text box to provide any desired properties that you want to apply to the device twins of provisioned devices. |

   For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

1. Select **Next: Review + create**.

1. On the **Review + create** tab, verify all of your values then select **Create**.

# [X.509 certificate](#tab/x509)

To create a X.509 certificate enrollment group:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. At the top of the page, select **Add enrollment group**.

1. On the **Registration + provisioning** tab of the **Add enrollment group** page, provide the following information to configure the enrollment group details:

   | Field | Description |
   | :--- | :--- |
   | **Attestation** |Select **X.509 intermediate certificates** if you want to upload intermediate certificates to be used for just this enrollment group, or select **X.509 certificates uploaded to this Device Provisioning Service** if you already have uploaded intermediate certificates.|
   | **X.509 certificate settings** |Depending on the attestation method that you chose, either upload or select the primary and secondary intermediate certificates for this enrollment group. |
   | **Group name** | Provide a name for the group of devices. The enrollment group name is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`).|
   | **Provisioning status** | Check the **Enable this enrollment** if you want this enrollment group to be available to provision devices. Uncheck this box if you want the group to be disabled. You can change this setting later. |
   | **Reprovision policy** | For more information, see [Reprovision policies](./concepts-device-reprovision.md#reprovision-policies)] |

   :::image type="content" source="./media/how-to-manage-enrollments/add-enrollment-group-cert.png" alt-text="Screenshot that shows adding an enrollment group for X.509 certificate attestation.":::

1. Select **Next: IoT hubs**.

1. On the **IoT hubs** tab of the **Add enrollment group** page, provide the following information to determine which IoT hubs the enrollment group can provision devices to:

   | Field | Description |
   | :---- | :---------- |
   | **Target IoT hubs** |Select one or more of your linked IoT hubs, or add a new link to an IoT hub. To learn more about linking IoT hubs to your DPS instance, see [How to link and manage IoT hubs](how-to-manage-linked-iot-hubs.md).|
   | **Allocation policy** | If you selected more than one linked IoT hub, select how you want to assign devices to the different hub. To learn more about allocation policies, see [How to use allocation policies](how-to-use-allocation-policies.md).<br><br>If you selected only one linked IoT hub, we recommend using the **Evenly weighted distribution** policy.|

   :::image type="content" source="./media/how-to-manage-enrollments/add-enrollment-group-key-linked-hub.png" alt-text="Screenshot that shows connecting IoT hubs to the new enrollment group.":::

1. Select **Next: Device settings**

1. On the **Device settings** tab of the **Add enrollment group** page, provide the following information to define how newly provisioned devices will be configured:

   | Field | Description |
   | :---- | :---------- |
   | **IoT Edge** | Check the **Enable IoT Edge on provisioned devices** if all the devices provisioned through this group will run [Azure IoT Edge](../iot-edge/about-iot-edge.md). Uncheck this box if this group is for non-IoT Edge-enabled devices only. Either all devices in a group will be IoT Edge-enabled or none can be. |
   | **Device tags** | Use this text box to provide any tags that you want to apply to the device twins of provisioned devices. |
   | **Desired properties** | Use this text box to provide any desired properties that you want to apply to the device twins of provisioned devices. |

   For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

1. Select **Next: Review + create**.

1. On the **Review + create** tab, verify all of your values then select **Create**.

# [TPM](#tab/tpm)

Enrollment groups do not support TPM attestation.

---

## Create an enrollment group -- test

An enrollment group is an entry for a group of devices that share a common attestation mechanism. We recommend that you use an enrollment group for a large number of devices that share an initial configuration, or for devices that go to the same tenant. Enrollment groups support devices that use either [symmetric key](concepts-symmetric-key-attestation.md) or [X.509 certificates](concepts-x509-attestation.md) attestation.

For a walkthrough that demonstrates how to create and use enrollment groups with symmetric keys, see the [Provision devices with symmetric keys](how-to-legacy-device-symm-key.md) tutorial.

To create an enrollment group:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. At the top of the page, select **Add enrollment group**.
# [Symmetric key](#tab/key)
1. On the **Registration + provisioning** tab of the **Add enrollment group** page, provide the following information to configure the enrollment group details:

   | Field | Description |
   | :--- | :--- |
   | **Attestation** |Select **Symmetric key**.|
   | **Symmetric key settings** |Check the **Generate symmetric keys automatically** box if you want to use randomly generated keys. Uncheck this box if you want to provide your own. |
   | **Group name** | Provide a name for the group of devices. The enrollment group name is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`).|
   | **Provisioning status** | Check the **Enable this enrollment** if you want this enrollment group to be available to provision devices. Uncheck this box if you want the group to be disabled. You can change this setting later. |
   | **Reprovision policy** | For more information, see [Reprovision policies](./concepts-device-reprovision.md#reprovision-policies)] |

   :::image type="content" source="./media/how-to-manage-enrollments/add-enrollment-group-symm-key.png" alt-text="Screenshot that shows adding an enrollment group for symmetric key attestation.":::
# [X.509 certificate](#tab/x509)
1. On the **Registration + provisioning** tab of the **Add enrollment group** page, provide the following information to configure the enrollment group details:

   | Field | Description |
   | :--- | :--- |
   | **Attestation** |Select **X.509 intermediate certificates** if you want to upload intermediate certificates to be used for just this enrollment group, or select **X.509 certificates uploaded to this Device Provisioning Service** if you already have uploaded intermediate certificates.|
   | **X.509 certificate settings** |Depending on the attestation method that you chose, either upload or select the primary and secondary intermediate certificates for this enrollment group. |
   | **Group name** | Provide a name for the group of devices. The enrollment group name is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`).|
   | **Provisioning status** | Check the **Enable this enrollment** if you want this enrollment group to be available to provision devices. Uncheck this box if you want the group to be disabled. You can change this setting later. |
   | **Reprovision policy** | For more information, see [Reprovision policies](./concepts-device-reprovision.md#reprovision-policies)] |

   :::image type="content" source="./media/how-to-manage-enrollments/add-enrollment-group-cert.png" alt-text="Screenshot that shows adding an enrollment group for X.509 certificate attestation.":::
# [TPM](#tab/tpm)
1. Enrollment groups do not support TPM attestation. Please choose a different attestation type.
---
1. Select **Next: IoT hubs**.

1. On the **IoT hubs** tab of the **Add enrollment group** page, provide the following information to determine which IoT hubs the enrollment group can provision devices to:

   | Field | Description |
   | :---- | :---------- |
   | **Target IoT hubs** |Select one or more of your linked IoT hubs, or add a new link to an IoT hub. To learn more about linking IoT hubs to your DPS instance, see [How to link and manage IoT hubs](how-to-manage-linked-iot-hubs.md).|
   | **Allocation policy** | If you selected more than one linked IoT hub, select how you want to assign devices to the different hub. To learn more about allocation policies, see [How to use allocation policies](how-to-use-allocation-policies.md).<br><br>If you selected only one linked IoT hub, we recommend using the **Evenly weighted distribution** policy.|

   :::image type="content" source="./media/how-to-manage-enrollments/add-enrollment-group-key-linked-hub.png" alt-text="Screenshot that shows connecting IoT hubs to the new enrollment group.":::

1. Select **Next: Device settings**

1. On the **Device settings** tab of the **Add enrollment group** page, provide the following information to define how newly provisioned devices will be configured:

   | Field | Description |
   | :---- | :---------- |
   | **IoT Edge** | Check the **Enable IoT Edge on provisioned devices** if all the devices provisioned through this group will run [Azure IoT Edge](../iot-edge/about-iot-edge.md). Uncheck this box if this group is for non-IoT Edge-enabled devices only. Either all devices in a group will be IoT Edge-enabled or none can be. |
   | **Device tags** | Use this text box to provide any tags that you want to apply to the device twins of provisioned devices. |
   | **Desired properties** | Use this text box to provide any desired properties that you want to apply to the device twins of provisioned devices. |

   For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

1. Select **Next: Review + create**.

1. On the **Review + create** tab, verify all of your values then select **Create**.

## Create an individual enrollment

An individual enrollment is an entry for a single device that may be assigned to an IoT hub. Devices using [symmetric key](concepts-symmetric-key-attestation.md), [X.509 certificates](concepts-x509-attestation.md), and [TPM attestation](concepts-tpm-attestation.md) are supported.

# [Symmetric key](#tab/key)

>[!TIP]
>For more detailed instructions on how to create and use individual enrollments with symmetric keys, see [Quickstart:Provision a simulated symmetric key device](quick-create-simulated-device-symm-key.md#create-a-device-enrollment).

To create a symmetric key individual enrollment:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. At the top of the page, select **Add individual enrollment**.

1. In the **Add Enrollment** page, enter the following information.

    | Field | Description |
    | :--- | :--- |
    | **Mechanism** | Select *Symmetric Key* |
    | **Auto Generate Keys** |Check this box. |
    | **Registration ID** | Type in a unique registration ID.|
    | **IoT Hub Device ID** |  This ID will represent your device. It must follow the rules for a device ID. For more information, see [Device identity properties](../iot-hub/iot-hub-devguide-identity-registry.md). If the device ID is left unspecified, then the registration ID will be used.|
    | **Select how you want to assign devices to hubs** |Select *Static configuration* so that you can assign to a specific IoT hub. To learn more about allocation policies, see [How to use allocation policies](how-to-use-allocation-policies.md).|
    | **Select the IoT hubs this group can be assigned to** |Select one of your linked IoT hubs. To learn more about linking IoT hubs to your DPS instance, see [How to link and manage IoT hubs](how-to-manage-linked-iot-hubs.md).|

    :::image type="content" source="./media/how-to-manage-enrollments/add-individual-enrollment-symm-key.png" alt-text="Add individual enrollment for symmetric key attestation.":::

1. Select **Save**.

# [X.509 certificate](#tab/x509)

>[!TIP]
>For more detailed instructions on how to create and use individual enrollments with X.509 certificates, see [Quickstart:Provision a X.509 certificate device](quick-create-simulated-device-x509.md#create-a-device-enrollment).

To create a X.509 certificate individual enrollment:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. At the top of the page, select **Add individual enrollment**.

1. In the **Add Enrollment** page, enter the following information.

    | Field | Description |
    | :--- | :--- |
    | **Mechanism** | Select *X.509* |
    | **Primary Certificate .pem or .cer file** | Upload a certificate from which you may generate leaf certificates. If choosing .cer file, only base-64 encoded certificate is accepted. |
    | **IoT Hub Device ID** |  This ID will represent your device. It must follow the rules for a device ID. For more information, see [Device identity properties](../iot-hub/iot-hub-devguide-identity-registry. The device ID must be the subject name on the device certificate that you upload for the enrollment. That subject name must conform to the rules for a device ID.|
    | **Select how you want to assign devices to hubs** |Select *Static configuration* so that you can assign to a specific IoT hub. To learn more about allocation policies, see [How to use allocation policies](how-to-use-allocation-policies.md).|
    | **Select the IoT hubs this group can be assigned to** |Select one of your linked IoT hubs. To learn more about linking IoT hubs to your DPS instance, see [How to link and manage IoT hubs](how-to-manage-linked-iot-hubs.md).|

    :::image type="content" source="./media/how-to-manage-enrollments/add-individual-enrollment-cert.png" alt-text="Add individual enrollment for X.509 certificate attestation.":::

1. Select **Save**.

# [TPM](#tab/tpm)

>[!TIP]
>For more detailed instructions on how to create and use individual enrollments using TPM attestation, see one of the [Provision a simulated TPM device](quick-create-simulated-device-tpm.md#create-a-device-enrollment-entry) samples.

To create a TPM individual enrollment:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. At the top of the page, select **Add individual enrollment**.

1. In the **Add Enrollment** page, enter the following information.

    | Field | Description |
    | :--- | :--- |
    | **Mechanism** | Select *TPM* |
    | **Endorsement Key** | The unique endorsement key of the TPM device. |
    | **Registration ID** | Type in a unique registration ID.|
    | **IoT Hub Device ID** |  This ID will represent your device. It must follow the rules for a device ID. For more information, see [Device identity properties](../iot-hub/iot-hub-devguide-identity-registry. If the device ID is left unspecified, then the registration ID will be used.|
    | **Select how you want to assign devices to hubs** |Select *Static configuration* so that you can assign to a specific IoT hub. To learn more about allocation policies, see [How to use allocation policies](how-to-use-allocation-policies.md).|
    | **Select the IoT hubs this group can be assigned to** |Select one of your linked IoT hubs. To learn more about linking IoT hubs to your DPS instance, see [How to link and manage IoT hubs](how-to-manage-linked-iot-hubs.md).|

    :::image type="content" source="./media/how-to-manage-enrollments/add-individual-enrollment-tpm.png" alt-text="Add individual enrollment for TPM attestation.":::

1. Select **Save**.

## Update an enrollment entry

To update an existing enrollment entry:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. Select the enrollment entry that you wish to modify.

1. On the enrollment entry details page, you can update all items, except the security type and credentials.

1. Once completed, select **Save**.

## Remove a device enrollment

To remove an enrollment entry:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. Select the enrollment entry you want to remove.

1. At the top of the page, select **Delete**.

1. When prompted to confirm, select **Yes**.

1. Once the action is completed, you'll see that your entry has been removed from the list of device enrollments.

> [!NOTE]
> Deleting an enrollment group doesn't delete the registration records for devices in the group. DPS uses the registration records to determine whether the maximum number of registrations has been reached for the DPS instance. Orphaned registration records still count against this quota. For the current maximum number of registrations supported for a DPS instance, see [Quotas and limits](about-iot-dps.md#quotas-and-limits).
>
>You may want to delete the registration records for the enrollment group before deleting the enrollment group itself. You can see and manage the registration records for an enrollment group manually on the **Registration Records** tab for the group in Azure portal. You can retrieve and manage the registration records programmatically using the [Device Registration State REST APIs](/rest/api/iot-dps/service/device-registration-state) or equivalent APIs in the [DPS service SDKs](libraries-sdks.md), or using the [az iot dps enrollment-group registration Azure CLI commands](/cli/azure/iot/dps/enrollment-group/registration).
