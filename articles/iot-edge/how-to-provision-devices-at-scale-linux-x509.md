---
title: Create and provision IoT Edge devices at scale using X.509 certificates on Linux - Azure IoT Edge | Microsoft Docs 
description: Use X.509 certificates to test provisioning devices at scale for Azure IoT Edge with device provisioning service
author: PatAltimore
ms.author: patricka
ms.date: 08/17/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: contperf-fy21q2
---

# Create and provision IoT Edge devices at scale on Linux using X.509 certificates

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article provides end-to-end instructions for autoprovisioning one or more Linux IoT Edge devices using X.509 certificates. You can automatically provision Azure IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml) (DPS). If you're unfamiliar with the process of autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before continuing.

The tasks are as follows:

1. Generate certificates and keys.
1. Create either an **individual enrollment** for a single device or a **group enrollment** for a set of devices.
1. Install the IoT Edge runtime and register the device with IoT Hub.

Using X.509 certificates as an attestation mechanism is an excellent way to scale production and simplify device provisioning. Typically, X.509 certificates are arranged in a certificate chain of trust. Starting with a self-signed or trusted root certificate, each certificate in the chain signs the next lower certificate. This pattern creates a delegated chain of trust from the root certificate down through each intermediate certificate to the final downstream device certificate installed on a device.

> [!TIP]
> If your device has a Hardware Security Module (HSM) such as a TPM 2.0, then we recommend storing the X.509 keys securely in the HSM. Learn more about how to implement the zero-touch provisioning at scale described in [this blueprint](https://azure.microsoft.com/blog/the-blueprint-to-securely-solve-the-elusive-zerotouch-provisioning-of-iot-devices-at-scale) with the [iotedge-tpm2cloud](https://aka.ms/iotedge-tpm2cloud) sample.

## Prerequisites

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

### Device requirements

A physical or virtual Linux device to be the IoT Edge device.

## Generate device identity certificates

The device identity certificate is a downstream device certificate that connects through a certificate chain of trust to the top X.509 certificate authority (CA) certificate. The device identity certificate must have its common name (CN) set to the device ID that you want the device to have in your IoT hub.

Device identity certificates are only used for provisioning the IoT Edge device and authenticating the device with Azure IoT Hub. They aren't signing certificates, unlike the CA certificates that the IoT Edge device presents to modules or downstream devices for verification. For more information, see [Azure IoT Edge certificate usage detail](iot-edge-certs.md).

After you create the device identity certificate, you should have two files: a .cer or .pem file that contains the public portion of the certificate, and a .cer or .pem file with the private key of the certificate. If you plan to use group enrollment in DPS, you also need the public portion of an intermediate or root CA certificate in the same certificate chain of trust.

You need the following files to set up automatic provisioning with X.509:

* The device identity certificate and its private key certificate. The device identity certificate is uploaded to DPS if you create an individual enrollment. The private key is passed to the IoT Edge runtime.
* A full chain certificate, which should have at least the device identity and the intermediate certificates in it. The full chain certificate is passed to the IoT Edge runtime.
* An intermediate or root CA certificate from the certificate chain of trust. This certificate is uploaded to DPS if you create a group enrollment.

### Use test certificates (optional)

If you don't have a certificate authority available to create new identity certs and want to try out this scenario, the Azure IoT Edge git repository contains scripts that you can use to generate test certificates. These certificates are designed for development testing only, and must not be used in production.

To create test certificates, follow the steps in [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). Complete the two required sections to set up the certificate generation scripts and to create a root CA certificate. Then, follow the steps to create a device identity certificate. When you're finished, you should have the following certificate chain and key pair:

* `<WRKDIR>/certs/iot-edge-device-identity-<name>-full-chain.cert.pem`
* `<WRKDIR>/private/iot-edge-device-identity-<name>.key.pem`

You need both these certificates on the IoT Edge device. If you're going to use individual enrollment in DPS, then you will upload the .cert.pem file. If you're going to use group enrollment in DPS, then you also need an intermediate or root CA certificate in the same certificate chain of trust to upload. If you're using demo certs, use the `<WRKDIR>/certs/azure-iot-test-only.root.ca.cert.pem` certificate for group enrollment.

<!-- Create a DPS enrollment using X.509 certificates H2 and content -->
[!INCLUDE [iot-edge-create-dps-enrollment-x509.md](includes/iot-edge-create-dps-enrollment-x509.md)]

<!-- Install IoT Edge on Linux H2 and content -->
[!INCLUDE [install-iot-edge-linux.md](includes/iot-edge-install-linux.md)]

## Provision the device with its cloud identity

Once the runtime is installed on your device, configure the device with the information it uses to connect to the device provisioning service and IoT Hub.

Have the following information ready:

* The DPS **ID Scope** value. You can retrieve this value from the overview page of your DPS instance in the Azure portal.
* The device identity certificate chain file on the device.
* The device identity key file on the device.

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
   id_scope = "SCOPE_ID_HERE"

   # Uncomment to send a custom payload during DPS registration
   # payload = { uri = "PATH_TO_JSON_FILE" }
   
   [provisioning.attestation]
   method = "x509"
   registration_id = "REGISTRATION_ID_HERE"

   identity_cert = "DEVICE_IDENTITY_CERTIFICATE_HERE"

   identity_pk = "DEVICE_IDENTITY_PRIVATE_KEY_HERE"

   # auto_reprovisioning_mode = Dynamic
   ```

1. Update the value of `id_scope` with the scope ID you copied from your instance of DPS.

1. Provide a `registration_id` for the device, which is the ID that the device will have in IoT Hub. The registration ID must match the common name (CN) of the identity certificate.

1. Update the values of `identity_cert` and `identity_pk` with your certificate and key information.

   The identity certificate value can be provided as a file URI, or can be dynamically issued using EST or a local certificate authority. Uncomment only one line, based on the format you choose to use.

   The identity private key value can be provided as a file URI or a PKCS#11 URI. Uncomment only one line, based on the format you choose to use.

   If you use any PKCS#11 URIs, find the **PKCS#11** section in the config file and provide information about your PKCS#11 configuration.

1. Optionally, find the auto reprovisioning mode section of the file. Use the `auto_reprovisioning_mode` parameter to configure your device's reprovisioning behavior. **Dynamic** - Reprovision when the device detects that it may have been moved from one IoT Hub to another. This is the default. **AlwaysOnStartup** - Reprovision when the device is rebooted or a crash causes the daemon(s) to restart. **OnErrorOnly** - Never trigger device reprovisioning automatically. Each mode has an implicit device reprovisioning fallback if the device is unable to connect to IoT Hub during identity provisioning due to connectivity errors. For more information, see [IoT Hub device reprovisioning concepts](../iot-dps/concepts-device-reprovision.md).

1. Optionally, uncomment the `payload` parameter to specify the path to a local JSON file. The contents of the file will be [sent to DPS as additional data](../iot-dps/how-to-send-additional-data.md#iot-edge-support) when the device registers. This is useful for [custom allocation](../iot-dps/how-to-use-custom-allocation-policies.md). For example, if you want to allocate your devices based on an IoT Plug and Play model ID without human intervention.

1. Save and close the file.

1. Apply the configuration changes that you made to IoT Edge.

   ```bash
   sudo iotedge config apply
   ```

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device.

# [Individual enrollment](#tab/individual-enrollment)

You can verify that the individual enrollment that you created in device provisioning service was used. Navigate to your device provisioning service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

# [Group enrollment](#tab/group-enrollment)

You can verify that the group enrollment that you created in device provisioning service was used. Navigate to your device provisioning service instance in the Azure portal. Open the enrollment details for the group enrollment that you created. Go to the **Registration Records** tab to view all devices registered in that group.

---

Use the following commands on your device to verify that the IoT Edge installed and started successfully.

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

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).
