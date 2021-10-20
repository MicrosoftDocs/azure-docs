---
title: Manage device enrollments for Azure IoT Hub Device Provisioning Service in the Azure portal 
description: How to manage device enrollments for your Device Provisioning Service (DPS) in the Azure portal
author: anastasia-ms
ms.author: v-stharr
ms.date: 10/19/2021
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
manager: lizross
---

# How to manage device enrollments with Azure portal

A *device enrollment* creates a record of a single device or a group of devices that may at some point register with the Azure IoT Hub Device Provisioning Service (DPS). The enrollment record contains the initial configuration for the device(s) as part of that enrollment. Included in the configuration is either the IoT hub to which a device will be assigned, or an allocation policy that configures the hub from a set of hubs. This article shows you how to manage device enrollments for your provisioning service.

## Create a device enrollment

The Azure IoT Device Provisioning Service supports two types of enrollments:

* [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices.
* [Individual enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.

### Create an enrollment group

 An enrollment group is an entry for a group of devices that share a common attestation mechanism. We recommend that you use an enrollment group for a large number of devices that share an initial configuration, or for devices that go to the same tenant. Devices that use either [symmetric key](concepts-symmetric-key-attestation.md) or [X.509 certificates](concepts-x509-attestation.md) attestation are supported.

For step-by-step instructions on how to create and use enrollment groups with symmetric keys, see the [Provision devices with symmetric keys](how-to-legacy-device-symm-key.md) tutorial.

To create an enrollment group for a group of devices using certificates:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select the Device Provisioning Service to which you want to enroll your device.

4. In the **Settings** menu, select **Manage enrollments**.

5. At the top of the page, select **+ Add enrollment group**.

6. In the **Add Enrollment Group** page, enter the following information.

    # [Certificate Attestation](#tab/cert)
    
    | Field | Description |
    | :--- | :--- |
    | **Group name** | The name of the group of devices.|
    | **Attestation Type** |Select **Certificate**.|
    | **Certificate Type** | Select **CA Certificate** or **Intermediate** based on which certificate signed your device certificates.|
    | **Primary Certificate**| If you're signing your device certificates with a CA certificate, then the root CA certificate must have [proof of possession](how-to-verify-certificates.md) completed. If you're signing your device certificates with an intermediate certificate, an upload button will be available to allow you to upload your intermediate certificate. The certificate that signed the intermediate must also have [proof of possession](how-to-verify-certificates.md) completed.

    # [Symmetric Key Attestation](#tab/symmkey)

    | Field | Description |
    | :--- | :--- |
    | **Group name** | The name of the group of devices.|
    | **Attestation Type** |Select **Symmetric Key**.|

7. Leave the rest of the fields at their default values.

8. Select **Save**.

### Create an individual enrollment

An individual enrollment is an entry for a single device that may be assigned to an IoT hub. Devices using [symmetric key](concepts-symmetric-key-attestation.md), [X.509 certificates](concepts-x509-attestation.md), and [TPM attestation](concepts-tpm-attestation.md) are supported.

To create an individual enrollment:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select the Device Provisioning Service to which you want to enroll your device.

4. In the **Settings** menu, select **Manage enrollments**.

5. At the top of the page, select **+ Add individual enrollment**.

6. In the **Add Enrollment** page, enter the following information.

    | Field | Description |
    | :--- | :--- |
    | **Mechanism** | Select that attestation mechanism for the device. |
    | **Attestation settings** | For step-by-step instructions on creating and using individual enrollments with symmetric keys or X.509 certificates, see [Quickstart:Provision a simulated symmetric key device](quick-create-simulated-device-symm-key.md#create-a-device-enrollment) or [Quickstart:Provision a X.509 certificate device](quick-create-simulated-device-x509.md#create-a-device-enrollment).<br><br>For step-by-step instructions on creating and using individual enrollments using TPM attestation, see one of the [Provision a simulated TPM device](quick-create-simulated-device-tpm.md#create-a-device-enrollment-entry) samples.|
    | **IoT Hub Device ID** |  This ID will represent your device. It must follow the rules for a device ID. For more information, see [Device identity properties](../iot-hub/iot-hub-devguide-identity-registry.md#device-identity-properties).<br><br>When using X.509 certificates, this text must be the subject name on the device certificate you upload for the enrollment. That subject name must conform to the rules for a device ID.|

## Update an enrollment entry

To update an existing enrollment entry:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select the Device Provisioning Service to which you want to enroll your device.

4. In the **Settings** menu, select **Manage enrollments**.

5. Select the enrollment entry that you wish to modify.

6. On the enrollment entry details page, you can all items, except the security type and credentials.

7. Once completed, select **Save**.

    ![Update enrollment in the portal](./media/how-to-manage-enrollments/update-enrollment.png)

## Remove a device enrollment

To remove an enrollment entry:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select the Device Provisioning Service to which you want to enroll your device.

4. In the **Settings** menu, select **Manage enrollments**.

5. Select the enrollment entry you want to remove. 

6. At the top of the page, select **Delete**.

7. When prompted to confirm, select **Yes**. 

8. Once the action is completed, you'll see your entry removed from the list of device enrollments.
 
    ![Remove enrollment in the portal](./media/how-to-manage-enrollments/remove-enrollment.png)