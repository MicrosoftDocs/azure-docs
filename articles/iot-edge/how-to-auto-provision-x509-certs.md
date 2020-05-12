---
title: Automatically provision devices with DPS using X.509 certificates - Azure IoT Edge | Microsoft Docs 
description: Use X.509 certificates to test automatic device provisioning for Azure IoT Edge with Device Provisioning Service
author: kgremban
manager: philmea
ms.author: kgremban
ms.reviewer: kevindaw
ms.date: 04/09/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision an IoT Edge device using X.509 certificates

With the [Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/index.yml), you can automatically provision IoT Edge devices using X.509 certificates. If you're unfamiliar with the process of auto-provisioning, review the [auto-provisioning concepts](../iot-dps/concepts-auto-provisioning.md) before continuing.

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

### Use test certificates

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
   > In the Azure CLI, you can create an [enrollment](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/dps/enrollment) or an [enrollment group](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/dps/enrollment-group) and use the **edge-enabled** flag to specify that a device, or group of devices, is an IoT Edge device.

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

X.509 provisioning with DPS is only supported in IoT Edge version 1.0.9 or newer.

You'll need the following information when provisioning your device:

* The DPS **ID Scope** value. You can retrieve this value from the overview page of your DPS instance in the Azure portal.
* The device identity certificate chain file on the device.
* The device identity key file on the device.
* An optional registration ID (pulled from the common name in the device identity certificate if not supplied).

### Linux device

Use the following link to install the Azure IoT Edge runtime on your device, using the commands appropriate for your device's architecture. When you get to the section on configuring the security daemon, configure the IoT Edge runtime for X.509 automatic, not manual, provisioning. You should have all the information and certificate files that you need after completing the previous sections of this article.

[Install the Azure IoT Edge runtime on Linux](how-to-install-iot-edge-linux.md)

When you add the X.509 certificate and key information to the config.yaml file, the paths should be provided as file URIs. For example:

* `file:///<path>/identity_certificate_chain.pem`
* `file:///<path>/identity_key.pem`

The section in the configuration file for X.509 automatic provisioning looks like this:

```yaml
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
```

Replace the placeholder values for `scope_id`, `identity_cert`, `identity_pk` with the scope ID from your DPS instance, and the URIs to the cert chain and key file locations on your device. Provide a `registration_id` for the device if you want, or leave this line commented out to register the device with the CN name of the identity certificate.

Always restart the security daemon after updating the config.yaml file.

```bash
sudo systemctl restart iotedge
```

### Windows device

Install the IoT Edge runtime on the device for which you generated the identity certificate chain and identity key. You'll configure the IoT Edge runtime for automatic, not manual, provisioning.

For more detailed information about installing IoT Edge on Windows, including prerequisites and instructions for tasks like managing containers and updating IoT Edge, see [Install the Azure IoT Edge runtime on Windows](how-to-install-iot-edge-windows.md).

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when installing IoT Edge, not PowerShell (x86).

1. The **Deploy-IoTEdge** command checks that your Windows machine is on a supported version, turns on the containers feature, and then downloads the moby runtime and the IoT Edge runtime. The command defaults to using Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge
   ```

1. At this point, IoT Core devices may restart automatically. Other Windows 10 or Windows Server devices may prompt you to restart. If so, restart your device now. Once your device is ready, run PowerShell as an administrator again.

1. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning unless you use the `-Dps` flag to use automatic provisioning.

   Replace the placeholder values for `{scope_id}`, `{identity cert chain path}`, and `{identity key path}` with the appropriate values from your DPS instance and the file paths on your device. If you want to specify the registration ID, include `-RegistrationId {registration_id}` as well, replacing the placeholder as appropriate.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -Dps -ScopeId {scope ID} -X509IdentityCertificate {identity cert chain path} -X509IdentityPrivateKey {identity key path}
   ```

   >[!TIP]
   >The config.yaml file stores your certificate and key information as file URIs. However, the Initialize-IoTEdge command handles this formatting step for you, so you can provide the absolute path to the certificate and key files on your device.

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device.

You can verify that the individual enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

Use the following commands on your device to verify that the runtime installed and started successfully.

### Linux device

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
