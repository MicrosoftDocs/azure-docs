---
title: Manage device enrollments in the Azure portal
titleSuffix: Azure IoT Hub Device Provisioning Service
description: How to manage group and individual device enrollments for your Device Provisioning Service (DPS) in the Azure portal.
author: kgremban
ms.author: kgremban
ms.date: 03/09/2023
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

* Create an instance of Device Provisioning Service in your subscription and link it to an IoT hub. For more information, see [Quickstart: Set up the IoT Hub Device Provisioning Service](./quick-setup-auto-provision.md).

## Create an enrollment group

An enrollment group is an entry for a group of devices that share a common attestation mechanism. We recommend that you use an enrollment group for a large number of devices that share an initial configuration, or for devices that go to the same tenant. Enrollment groups support devices that use either [symmetric key](concepts-symmetric-key-attestation.md) or [X.509 certificates](concepts-x509-attestation.md) attestation.

# [Symmetric key](#tab/key)

For a walkthrough that demonstrates how to create and use enrollment groups with symmetric keys, see the [Provision devices using symmetric key enrollment groups](how-to-legacy-device-symm-key.md) tutorial.

To create a symmetric key enrollment group:

<!-- INCLUDE -->
[!INCLUDE [iot-dps-enrollment-group-key.md](../../includes/iot-dps-enrollment-group-key.md)]

# [X.509 certificate](#tab/x509)

For a walkthrough that demonstrates how to create and use enrollment groups with X.509 certificates, see the [Provision multiple X.509 devices using enrollment groups](how-to-legacy-device-symm-key.md) tutorial.

To create an X.509 certificate enrollment group:

<!-- INCLUDE -->
[!INCLUDE [iot-dps-enrollment-group-x509.md](../../includes/iot-dps-enrollment-group-x509.md)]

# [TPM](#tab/tpm)

Enrollment groups do not support TPM attestation.

---

## Create an individual enrollment

An individual enrollment is an entry for a single device that may be assigned to an IoT hub. Devices using [symmetric key](concepts-symmetric-key-attestation.md), [X.509 certificates](concepts-x509-attestation.md), and [TPM attestation](concepts-tpm-attestation.md) are supported.

# [Symmetric key](#tab/key)

For a walkthrough of how to create and use individual enrollments with symmetric keys, see [Quickstart: Provision a symmetric key device](quick-create-simulated-device-symm-key.md#create-a-device-enrollment).

To create a symmetric key individual enrollment:

<!-- INCLUDE -->
[!INCLUDE [iot-dps-individual-enrollment-key.md](../../includes/iot-dps-individual-enrollment-key.md)]

# [X.509 certificate](#tab/x509)

For a walkthrough of how to create and use individual enrollments with X.509 certificates, see [Quickstart:Provision an X.509 certificate device](quick-create-simulated-device-x509.md#create-a-device-enrollment).

To create a X.509 certificate individual enrollment:

<!-- INCLUDE -->
[!INCLUDE [iot-dps-individual-enrollment-x509.md](../../includes/iot-dps-individual-enrollment-x509.md)]

# [TPM](#tab/tpm)

For a walkthrough of how to create and use individual enrollments using TPM attestation, see [Quickstart: Provision a simulated TPM device](quick-create-simulated-device-tpm.md#create-a-device-enrollment-entry) samples. If you don't have the endorsement key and registration ID for your device, use the quickstart to try these steps on a simulated device.

To create a TPM individual enrollment:

<!-- INCLUDE -->
[!INCLUDE [iot-dps-individual-enrollment-tpm.md](../../includes/iot-dps-individual-enrollment-tpm.md)]

---

## Update an enrollment entry

To update an existing enrollment entry:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. Select either the **Enrollment groups** or **Individual enrollments** tab, depending on whether you want to update an enrollment group or an individual enrollment.

1. Select the name of the enrollment entry that you wish to modify.

1. On the enrollment entry details page, you can update all items, except the security type and credentials.

1. Once completed, select **Save**.

## Remove a device enrollment

To remove an enrollment entry:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. Select either the **Enrollment groups** or **Individual enrollments** tab, depending on whether you want to remove an enrollment group or an individual enrollment.

1. Select the enrollment entry you want to remove.

1. At the top of the page, select **Delete**.

1. When prompted to confirm, select **Yes**.

1. Once the action is completed, you'll see that your entry has been removed from the list of device enrollments.

> [!NOTE]
> Deleting an enrollment group doesn't delete the registration records for devices in the group. DPS uses the registration records to determine whether the maximum number of registrations has been reached for the DPS instance. Orphaned registration records still count against this quota. For the current maximum number of registrations supported for a DPS instance, see [Quotas and limits](about-iot-dps.md#quotas-and-limits).
>
>You may want to delete the registration records for the enrollment group before deleting the enrollment group itself. You can see and manage the registration records for an enrollment group manually on the **Registration Records** tab for the group in Azure portal. You can retrieve and manage the registration records programmatically using the [Device Registration State REST APIs](/rest/api/iot-dps/service/device-registration-state) or equivalent APIs in the [DPS service SDKs](libraries-sdks.md), or using the [az iot dps enrollment-group registration Azure CLI commands](/cli/azure/iot/dps/enrollment-group/registration).

## Next steps

* Learn more about [How to link and manage IoT hubs](./how-to-manage-linked-iot-hubs.md).
* Understand [How to use allocation policies to provision devices across multiple IoT hubs](./how-to-use-allocation-policies.md).