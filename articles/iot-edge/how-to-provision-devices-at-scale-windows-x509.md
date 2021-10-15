---
title: Create and provision IoT Edge devices at scale using X.509 certificates on Windows - Azure IoT Edge | Microsoft Docs 
description: Use X.509 certificates to test provisioning devices at scale for Azure IoT Edge with Device Provisioning Service
author: v-tcassi
ms.author: v-tcassi
ms.date: 08/12/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: contperf-fy21q2
monikerRange: "=iotedge-2018-06"
---

# Create and provision IoT Edge devices at scale on Windows using X.509 certificates

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

This article provides end-to-end instructions for auto-provisioning one or more Windows IoT Edge devices using X.509 certificates. You can automatically provision Azure IoT Edge devices with the [Azure IoT Hub Device Provisioning Service](../iot-dps/index.yml) (DPS). If you're unfamiliar with the process of auto-provisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before continuing.

The tasks are as follows:

1. Generate certificates and keys.
1. Create either an **individual enrollment** for a single device or a **group enrollment** for a set of devices.
1. Install the IoT Edge runtime and register the device with IoT Hub.

Using X.509 certificates as an attestation mechanism is an excellent way to scale production and simplify device provisioning. Typically, X.509 certificates are arranged in a certificate chain of trust. Starting with a self-signed or trusted root certificate, each certificate in the chain signs the next lower certificate. This pattern creates a delegated chain of trust from the root certificate down through each intermediate certificate to the final "leaf" certificate installed on a device.

## Prerequisites

* An active IoT Hub.
* A physical or virtual Windows device to be the IoT Edge device.
* The latest version of [Git](https://git-scm.com/download/) installed.
* An instance of the IoT Hub Device Provisioning Service in Azure, linked to your IoT hub.
  * If you don't have a Device Provisioning Service instance, you can follow the instructions in the [Create a new IoT Hub Device Provisioning Service](../iot-dps/quick-setup-auto-provision.md#create-a-new-iot-hub-device-provisioning-service) and [Link the IoT hub and your Device Provisioning Service](../iot-dps/quick-setup-auto-provision.md#link-the-iot-hub-and-your-device-provisioning-service) sections of the IoT Hub Device Provisioning Service quickstart.
  * After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

## Generate device identity certificates

The device identity certificate is a leaf certificate that connects through a certificate chain of trust to the top X.509 certificate authority (CA) certificate. The device identity certificate must have its common name (CN) set to the device ID that you want the device to have in your IoT hub.

Device identity certificates are only used for provisioning the IoT Edge device and authenticating the device with Azure IoT Hub. They aren't signing certificates, unlike the CA certificates that the IoT Edge device presents to modules or leaf devices for verification. For more information, see [Azure IoT Edge certificate usage detail](iot-edge-certs.md).

After you create the device identity certificate, you should have two files: a .cer or .pem file that contains the public portion of the certificate, and a .cer or .pem file with the private key of the certificate. If you plan to use group enrollment in DPS, you also need the public portion of an intermediate or root CA certificate in the same certificate chain of trust.

You need the following files to set up automatic provisioning with X.509:

* The device identity certificate and its private key certificate. The device identity certificate is uploaded to DPS if you create an individual enrollment. The private key is passed to the IoT Edge runtime.
* A full chain certificate, which should have at least the device identity and the intermediate certificates in it. The full chain certificate is passed to the IoT Edge runtime.
* An intermediate or root CA certificate from the certificate chain of trust. This certificate is uploaded to DPS if you create a group enrollment.

> [!NOTE]
> Currently, a limitation in libiothsm prevents the use of certificates that expire on or after January 1, 2038.

### Use test certificates (optional)

If you don't have a certificate authority available to create new identity certs and want to try out this scenario, the Azure IoT Edge git repository contains scripts that you can use to generate test certificates. These certificates are designed for development testing only, and must not be used in production.

To create test certificates, follow the steps in [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). Complete the two required sections to set up the certificate generation scripts and to create a root CA certificate. Then, follow the steps to create a device identity certificate. When you're finished, you should have the following certificate chain and key pair:

* `<WRKDIR>\certs\iot-edge-device-identity-<name>-full-chain.cert.pem`
* `<WRKDIR>\private\iot-edge-device-identity-<name>.key.pem`

You need both these certificates on the IoT Edge device. If you're going to use individual enrollment in DPS, then you will upload the .cert.pem file. If you're going to use group enrollment in DPS, then you also need an intermediate or root CA certificate in the same certificate chain of trust to upload. If you're using demo certs, use the `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem` certificate for group enrollment.

## Create a DPS enrollment

Use your generated certificates and keys to create an enrollment in DPS for one or more IoT Edge devices.

If you are looking to provision a single IoT Edge device, create an **individual enrollment**. If you need multiple devices provisioned, follow the steps for creating a DPS **group enrollment**.

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

For more information about enrollments in the Device Provisioning Service, see [How to manage device enrollments](../iot-dps/how-to-manage-enrollments.md).

# [Individual enrollment](#tab/individual-enrollment)

### Create a DPS individual enrollment

Individual enrollments take the public portion of a device's identity certificate and match that to the certificate on the device.

> [!TIP]
> The steps in this article are for the Azure portal, but you can also create individual enrollments using the Azure CLI. For more information, see [az iot dps enrollment](/cli/azure/iot/dps/enrollment). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for an IoT Edge device.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment** then complete the following steps to configure the enrollment:  

   * **Mechanism**: Select **X.509**.

   * **Primary Certificate .pem or .cer file**: Upload the public file from the device identity certificate. If you used the scripts to generate a test certificate, choose the following file:

      `<WRKDIR>\certs\iot-edge-device-identity-<name>.cert.pem`

   * **IoT Hub Device ID**: Provide an ID for your device if you'd like. You can use device IDs to target an individual device for module deployment. If you don't provide a device ID, the common name (CN) in the X.509 certificate is used.

   * **IoT Edge device**: Select **True** to declare that the enrollment is for an IoT Edge device.

   * **Select the IoT hubs this device can be assigned to**: Choose the linked IoT hub that you want to connect your device to. You can choose multiple hubs, and the device will be assigned to one of them according to the selected allocation policy.

   * **Initial Device Twin State**: Add a tag value to be added to the device twin if you'd like. You can use tags to target groups of devices for automatic deployment. For example:

      ```json
      {
         "tags": {
            "environment": "test"
         },
         "properties": {
            "desired": {}
         }
      }
      ```

1. Select **Save**.

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation.

# [Group enrollment](#tab/group-enrollment)

### Create a DPS group enrollment

Group enrollments use an intermediate or root CA certificate from the certificate chain of trust used to generate the individual device identity certificates.

#### Verify your root certificate

When you create an enrollment group, you have the option of using a verified certificate. You can verify a certificate with DPS by proving that you have ownership of the root certificate. For more information, see [How to do proof-of-possession for X.509 CA certificates](../iot-dps/how-to-verify-certificates.md).

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Select **Certificates** from the left-hand menu.

1. Select **Add** to add a new certificate.

1. Enter a friendly name for your certificate, then browse to the .cer or .pem file that represents the public part of your X.509 certificate.

   If you're using the demo certificates, upload the `<wrkdir>\certs\azure-iot-test-only.root.ca.cert.pem` certificate.

1. Select **Save**.

1. Your certificate should now be listed on the **Certificates** page. Select it to open the certificate details.

1. Select **Generate Verification Code** then copy the generated code.

1. Whether you brought your own CA certificate or are using the demo certificates, you can use the verification tool provided in the IoT Edge repository to verify proof of possession. The verification tool uses your CA certificate to sign a new certificate that has the provided verification code as the subject name.

   ```powershell
   New-CACertsVerificationCert "<verification code>"
   ```

1. In the same certificate details page in the Azure portal, upload the newly generated verification certificate.

1. Select **Verify**.

#### Create enrollment group

For more information about enrollments in the Device Provisioning Service, see [How to manage device enrollments](../iot-dps/how-to-manage-enrollments.md).

> [!TIP]
> The steps in this article are for the Azure portal, but you can also create group enrollments using the Azure CLI. For more information, see [az iot dps enrollment-group](/cli/azure/iot/dps/enrollment-group). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for IoT Edge devices. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add enrollment group** then complete the following steps to configure the enrollment:

   * **Group name**: Provide a memorable name for this group enrollment.

   * **Attestation Type**: Select **Certificate**.

   * **IoT Edge device**: Select **True**. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

   * **Certificate Type**: Select **CA Certificate**.

   * **Primary certificate**: Choose your certificate from the dropdown list.

   * **Select the IoT hubs this device can be assigned to**: Choose the linked IoT hub that you want to connect your device to. You can choose multiple hubs, and the device will be assigned to one of them according to the selected allocation policy.

   * **Initial Device Twin State**: Add a tag value to be added to the device twin if you'd like. You can use tags to target groups of devices for automatic deployment. For example:

      ```json
      {
         "tags": {
            "environment": "test"
         },
         "properties": {
            "desired": {}
         }
      }
      ```

1. Select **Save**.

Now that an enrollment exists for these devices, the IoT Edge runtime can automatically provision the devices during installation.

---

You're ready to continue to the next section.

## Install the IoT Edge runtime

In this section, you prepare your Windows virtual machine or physical device for IoT Edge. Then, you will install IoT Edge.

There is one step you need to complete on your device before it is ready to install the IoT Edge runtime. Your device needs a container engine installed.

### Install a container engine

Azure IoT Edge relies on an OCI-compatible container runtime like [Moby](https://github.com/moby/moby), a Moby-based engine that is included in the installation script. There are no additional steps to install the engine.

### Install IoT Edge

The IoT Edge security daemon provides and maintains security standards on the IoT Edge device. The daemon starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The steps in this section represent the typical process to install the latest version on a device that has internet connectivity. If you need to install a specific version, like a pre-release version, or need to install while offline, follow the Offline or specific version installation steps.

1. Run PowerShell as an administrator.

   Use an AMD64 session of PowerShell, not PowerShell(x86). If you're unsure which session type you're using, run the following command:

   ```powershell
   (Get-Process -Id $PID).StartInfo.EnvironmentVariables["PROCESSOR_ARCHITECTURE"]
   ```

2. Run the [Deploy-IoTEdge](reference-windows-scripts.md#deploy-iotedge) command, which performs the following tasks:

   * Checks that your Windows machine is on a supported version.
   * Turns on the containers feature.
   * Downloads the moby engine and the IoT Edge runtime.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge
   ```

3. Restart your device if prompted.

When you install IoT Edge on a device, you can use additional parameters to modify the process including:

* Direct traffic to go through a proxy server
* Point the installer to a local directory for offline installation.

For more information about these additional parameters, see [PowerShell scripts for IoT Edge with Windows containers](reference-windows-scripts.md).

## Configure the device with provisioning information

Once the runtime is installed on your device, configure the device with the information it uses to connect to the Device Provisioning Service and IoT Hub.

Have the following information ready:

* The DPS **ID Scope** value. You can retrieve this value from the overview page of your DPS instance in the Azure portal.
* The device identity certificate chain file on the device.
* The device identity key file on the device.

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when installing IoT Edge, not PowerShell (x86).

1. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers, so use the `-DpsX509` flag to use automatic provisioning with X.509 certificate authentication.

   Replace the placeholder values for `{scope_id}`, `{identity cert chain path}`, and `{identity key path}` with the appropriate values from your DPS instance and the file paths on your device.

   Add the `-RegistrationId {registration_id}` parameter if you want to set the device ID as something other than the CN name of the identity certificate.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -DpsX509 -ScopeId {scope ID} -X509IdentityCertificate {identity cert chain path} -X509IdentityPrivateKey {identity key path}
   ```

   >[!TIP]
   >The config file stores your certificate and key information as file URIs. However, the Initialize-IoTEdge command handles this formatting step for you, so you can provide the absolute path to the certificate and key files on your device.

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device.

# [Individual enrollment](#tab/individual-enrollment)

You can verify that the individual enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

# [Group enrollment](#tab/group-enrollment)

You can verify that the group enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the group enrollment that you created. Go to the **Registration Records** tab to view all devices registered in that group.

---

Use the following commands on your device to verify that the IoT Edge installed and started successfully.

Check the status of the IoT Edge service.

```powershell
Get-Service iotedge
```

Examine service logs.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

List running modules.

```powershell
iotedge list
```

## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).
