---
title: Automatically provision devices with DPS using X.509 certificates - Azure IoT Edge | Microsoft Docs 
description: Use X.509 certificates to test automatic device provisioning for Azure IoT Edge with Device Provisioning Service
author: kgremban
manager: philmea
ms.author: kgremban
ms.reviewer: kevindaw
ms.date: 03/01/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: contperf-fy21q2
---

# Create and provision an IoT Edge device using X.509 certificates

[!INCLUDE [iot-edge-version-201806-or-202011](../../includes/iot-edge-version-201806-or-202011.md)]

With the [Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/index.yml), you can automatically provision IoT Edge devices using X.509 certificates. If you're unfamiliar with the process of auto-provisioning, review the [provisioning](../iot-dps/about-iot-dps.md#provisioning-process) overview before continuing.

This article shows you how to create a Device Provisioning Service enrollment using X.509 certificates on an IoT Edge device with the following steps:

* Generate certificates and keys.
* Create either an individual enrollment for a device, or a group enrollment for a set of devices.
* Install the IoT Edge runtime and register the device with IoT Hub.

Using X.509 certificates as an attestation mechanism is an excellent way to scale production and simplify device provisioning. Typically, X.509 certificates are arranged in a certificate chain of trust. Starting with a self-signed or trusted root certificate, each certificate in the chain signs the next lower certificate. This pattern creates a delegated chain of trust from the root certificate down through each intermediate certificate to the final "leaf" certificate installed on a device.

## Prerequisites

* An active IoT Hub.
* A physical or virtual device to be the IoT Edge device.
* The latest version of [Git](https://git-scm.com/download/) installed.
* An instance of the IoT Hub Device Provisioning Service in Azure, linked to your IoT hub.
  * If you don't have a Device Provisioning Service instance, follow the instructions in [Set up the IoT Hub DPS](../iot-dps/quick-setup-auto-provision.md).
  * After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

## Generate device identity certificates

The device identity certificate is a leaf certificate that connects through a certificate chain of trust to the top X.509 certificate authority (CA) certificate. The device identity certificate must have it common name (CN) set to the device ID that you want the device to have in your IoT hub.

Device identity certificates are only used for provisioning the IoT Edge device and authenticating the device with Azure IoT Hub. They aren't signing certificates, unlike the CA certificates that the IoT Edge device presents to modules or leaf devices for verification. For more information, see [Azure IoT Edge certificate usage detail](iot-edge-certs.md).

After you create the device identity certificate, you should have two files: a .cer or .pem file that contains the public portion of the certificate, and a .cer or .pem file with the private key of the certificate. If you plan to use group enrollment in DPS, you also need the public portion of an intermediate or root CA certificate in the same certificate chain of trust.

You need the following files to set up automatic provisioning with X.509:

* The device identity certificate and its private key certificate. The device identity certificate is uploaded to DPS if you create an individual enrollment. The private key is passed to the IoT Edge runtime.
* A full chain certificate, which should have at least the device identity and the intermediate certificates in it. The full chain certificate is passed to the IoT Edge runtime.
* An intermediate or root CA certificate from the certificate chain of trust. This certificate is uploaded to DPS if you create a group enrollment.

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
> [!NOTE]
> Currently, a limitation in libiothsm prevents the use of certificates that expire on or after January 1, 2038.

:::moniker-end

### Use test certificates (optional)

If you don't have a certificate authority available to create new identity certs and want to try out this scenario, the Azure IoT Edge git repository contains scripts that you can use to generate test certificates. These certificates are designed for development testing only, and must not be used in production.

To create test certificates, follow the steps in [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). Complete the two required sections to set up the certificate generation scripts and to create a root CA certificate. Then, follow the steps to create a device identity certificate. When you're finished, you should have the following certificate chain and key pair:

Linux:

* `<WRKDIR>/certs/iot-edge-device-identity-<name>-full-chain.cert.pem`
* `<WRKDIR>/private/iot-edge-device-identity-<name>.key.pem`

Windows:

* `<WRKDIR>\certs\iot-edge-device-identity-<name>-full-chain.cert.pem`
* `<WRKDIR>\private\iot-edge-device-identity-<name>.key.pem`

You need both these certificates on the IoT Edge device. If you're going to use individual enrollment in DPS, then you will upload the .cert.pem file. If you're going to use group enrollment in DPS, then you also need an intermediate or root CA certificate in the same certificate chain of trust to upload. If you're using demo certs, use the `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem` certificate for group enrollment.

## Create a DPS individual enrollment

Use your generated certificates and keys to create an individual enrollment in DPS for a single IoT Edge device. Individual enrollments take the public portion of a device's identity certificate and match that to the certificate on the device.

If you're looking to provision multiple IoT Edge devices, follow the steps in the next section, [Create a DPS group enrollment](#create-a-dps-group-enrollment).

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

For more information about enrollments in the Device Provisioning Service, see [How to manage device enrollments](../iot-dps/how-to-manage-enrollments.md).

   > [!TIP]
   > In the Azure CLI, you can create an [enrollment](/cli/azure/iot/dps/enrollment) or an [enrollment group](/cli/azure/iot/dps/enrollment-group) and use the **edge-enabled** flag to specify that a device, or group of devices, is an IoT Edge device.

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment** then complete the following steps to configure the enrollment:  

   * **Mechanism**: Select **X.509**.

   * **Primary Certificate .pem or .cer file**: Upload the public file from the device identity certificate. If you used the scripts to generate a test certificate, choose the following file:

      `<WRKDIR>/certs/iot-edge-device-identity-<name>.cert.pem`

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

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation. Continue to the [Install the IoT Edge runtime](#install-the-iot-edge-runtime) section to set up your IoT Edge device.

## Create a DPS group enrollment

Use your generated certificates and keys to create a group enrollment in DPS for multiple IoT Edge devices. Group enrollments use an intermediate or root CA certificate from the certificate chain of trust used to generate the individual device identity certificates.

If you're looking to provision a single IoT Edge device instead, follow the steps in the previous section, [Create a DPS individual enrollment](#create-a-dps-individual-enrollment).

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

### Verify your root certificate

When you create an enrollment group, you have the option of using a verified certificate. You can verify a certificate with DPS by proving that you have ownership of the root certificate. For more information, see [How to do proof-of-possession for X.509 CA certificates](../iot-dps/how-to-verify-certificates.md).

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Select **Certificates** from the left-hand menu.

1. Select **Add** to add a new certificate.

1. Enter a friendly name for your certificate, then browse to the .cer or .pem file that represents the public part of your X.509 certificate.

   If you're using the demo certificates, upload the `<wrkdir>/certs/azure-iot-test-only.root.ca.cert.pem` certificate.

1. Select **Save**.

1. Your certificate should now be listed on the **Certificates** page. Select it to open the certificate details.

1. Select **Generate Verification Code** then copy the generated code.

1. Whether you brought your own CA certificate or are using the demo certificates, you can use the verification tool provided in the IoT Edge repository to verify proof of possession. The verification tool uses your CA certificate to sign a new certificate that has the provided verification code as the subject name.

   * Windows:

     ```powershell
     New-CACertsVerificationCert "<verification code>"
     ```

   * Linux:

     ```bash
     ./certGen.sh create_verification_certificate <verification code>
     ```

1. In the same certificate details page in the Azure portal, upload the newly generated verification certificate.

1. Select **Verify**.

### Create enrollment group

For more information about enrollments in the Device Provisioning Service, see [How to manage device enrollments](../iot-dps/how-to-manage-enrollments.md).

1. In the [Azure portal](https://portal.azure.com), navigate to your instance of IoT Hub Device Provisioning Service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add enrollment group** then complete the following steps to configure the enrollment:

   * **Group name**: Provide a memorable name for this group enrollment.

   * **Attestation Type**: Select **Certificate**.

   * **IoT Edge device**: Select **True**. For a group enrollment, all devices must be IoT Edge devices or none of them can be.

   * **Certificate Type**: Select **CA Certificate** if you have a verified CA certificate stored with DPS, or **Intermediate Certificate** if you want to upload a new file for just this enrollment.

   * **Primary certificate**: If you chose CA certificate in the last section, choose your certificate from the dropdown list. If you chose intermediate certificate, upload the public file from a CA certificate in the certificate chain of trust that was used to generate the device identity certificates.

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

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation. Continue to the next section to set up your IoT Edge device.

## Install the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. Its components run in containers, and allow you to deploy additional containers to the device so that you can run code at the edge.

Follow the steps in [Install the Azure IoT Edge runtime](how-to-install-iot-edge.md), then return to this article to provision the device.

X.509 provisioning with DPS is only supported in IoT Edge version 1.0.9 or newer.

## Configure the device with provisioning information

Once the runtime is installed on your device, configure the device with the information it uses to connect to the Device Provisioning Service and IoT Hub.

Have the following information ready:

* The DPS **ID Scope** value. You can retrieve this value from the overview page of your DPS instance in the Azure portal.
* The device identity certificate chain file on the device.
* The device identity key file on the device.

### Linux device

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

1. Open the configuration file on the IoT Edge device.

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

1. Find the provisioning configurations section of the file. Uncomment the lines for DPS X.509 certificate provisioning, and make sure any other provisioning lines are commented out.

   The `provisioning:` line should have no preceding whitespace, and nested items should be indented by two spaces.

   ```yml
   # DPS X.509 provisioning configuration
   provisioning:
     source: "dps"
     global_endpoint: "https://global.azure-devices-provisioning.net"
     scope_id: "<SCOPE_ID>"
     attestation:
       method: "x509"
   #   registration_id: "<OPTIONAL REGISTRATION ID. LEAVE COMMENTED OUT TO REGISTER WITH CN OF identity_cert>"
       identity_cert: "<REQUIRED URI TO DEVICE IDENTITY CERTIFICATE>"
       identity_pk: "<REQUIRED URI TO DEVICE IDENTITY PRIVATE KEY>"
   #  always_reprovision_on_startup: true
   #  dynamic_reprovisioning: false
   ```

1. Update the values of `scope_id`, `identity_cert`, and `identity_pk` with your DPS and device information.

   When you add the X.509 certificate and key information to the config.yaml file, the paths should be provided as file URIs. For example:

   `file:///<path>/identity_certificate_chain.pem`
   `file:///<path>/identity_key.pem`

1. Optionally, provide the `registration_id` for the device, which needs to match the common name (CN) of the identity certificate. If you leave that line commented out, the CN will automatically be applied.

1. Optionally, use the `always_reprovision_on_startup` or `dynamic_reprovisioning` lines to configure your device's reprovisioning behavior. If a device is set to reprovision on startup, it will always attempt to provision with DPS first and then fall back to the provisioning backup if that fails. If a device is set to dynamically reprovision itself, IoT Edge will restart and reprovision if a reprovisioning event is detected. For more information, see [IoT Hub device reprovisioning concepts](../iot-dps/concepts-device-reprovision.md).

1. Save and close the config.yaml file.

1. Restart the IoT Edge runtime so that it picks up all the configuration changes that you made on the device.

   ```bash
   sudo systemctl restart iotedge
   ```

:::moniker-end
<!-- end 1.1. -->

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

1. Create a configuration file for your device based on a template file that is provided as part of the IoT Edge installation.

   ```bash
   sudo cp /etc/aziot/config.toml.edge.template /etc/aziot/config.toml
   ```

1. Open the configuration file on the IoT Edge device.

   ```bash
   sudo nano /etc/aziot/config.toml
   ```

1. Find the **Provisioning** section of the file. Uncomment the lines for DPS provisioning with X.509 certificate, and make sure any other provisioning lines are commented out.

   ```toml
   # DPS provisioning with X.509 certificate
   [provisioning]
   source = "dps"
   global_endpoint = "https://global.azure-devices-provisioning.net"
   id_scope = "<SCOPE_ID>"
   
   [provisioning.attestation]
   method = "x509"
   registration_id = "<REGISTRATION ID>"

   identity_cert = "<DEVICE IDENTITY CERTIFICATE>"

   identity_pk = "<DEVICE IDENTITY PRIVATE KEY>"
   ```

1. Update the value of `id_scope` with the scope ID you copied from your instance of DPS.

1. Provide a `registration_id` for the device, which is the ID that the device will have in IoT Hub. The registration ID must match the common name (CN) of the identity certificate.

1. Update the values of `identity_cert` and `identity_pk` with your certificate and key information.

   The identity certificate value can be provided as a file URI, or can be dynamically issued using EST or a local certificate authority. Uncomment only one line, based on the format you choose to use.

   The identity private key value can be provided as a file URI or a PKCS#11 URI. Uncomment only one line, based on the format you choose to use.

   If you use any PKCS#11 URIs, find the **PKCS#11** section in the config file and provide information about your PKCS#11 configuration.

1. Save and close the file.

1. Apply the configuration changes that you made to IoT Edge.

   ```bash
   sudo iotedge config apply
   ```

:::moniker-end
<!-- end 1.2 -->

### Windows device

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when installing IoT Edge, not PowerShell (x86).

1. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers, so use the `-DpsX509` flag to use automatic provisioning with X.509 certificate authentication.

   Replace the placeholder values for `{scope_id}`, `{identity cert chain path}`, and `{identity key path}` with the appropriate values from your DPS instance and the file paths on your device.

   Add the `-RegistrationId {registration_id}` if you want to set the device ID as something other than the CN name of the identity certificate.

   Add the `-ContainerOs Linux` parameter if you're using Linux containers on Windows.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -DpsX509 -ScopeId {scope ID} -X509IdentityCertificate {identity cert chain path} -X509IdentityPrivateKey {identity key path}
   ```

   >[!TIP]
   >The config file stores your certificate and key information as file URIs. However, the Initialize-IoTEdge command handles this formatting step for you, so you can provide the absolute path to the certificate and key files on your device.

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device.

You can verify that the individual enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

Use the following commands on your device to verify that the runtime installed and started successfully.

### Linux device

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

Check the status of the IoT Edge service.

```cmd/sh
systemctl status iotedge
```

Examine service logs.

```cmd/sh
journalctl -u iotedge --no-pager --no-full
```

List running modules.

```cmd/sh
iotedge list
```
:::moniker-end

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

Check the status of the IoT Edge service.

```cmd/sh
sudo iotedge system status
```

Examine service logs.

```cmd/sh
sudo iotedge system logs
```

List running modules.

```cmd/sh
sudo iotedge list
```
:::moniker-end

### Windows device

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
