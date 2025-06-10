---
title: Create IoT Edge devices at scale using X.509 certificates on Linux
titleSuffix: Azure IoT Edge
description: Use X.509 certificates to test provisioning devices at scale for Azure IoT Edge with device provisioning service
author: PatAltimore
ms.author: patricka
ms.date: 06/09/2025
ms.topic: how-to
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
---

# Create and provision IoT Edge devices at scale on Linux using X.509 certificates

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article gives step-by-step instructions for autoprovisioning one or more Linux IoT Edge devices using X.509 certificates. Automatically provision Azure IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml) (DPS). If you aren't familiar with autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before you continue.

Here are the steps to provision IoT Edge devices using X.509 certificates:

1. Generate certificates and keys.
1. Create an **individual enrollment** for a single device or a **group enrollment** for a set of devices.
1. Install the IoT Edge runtime and register the device with IoT Hub.

X.509 certificates let you scale production and simplify device provisioning. Typically, X.509 certificates are arranged in a certificate chain of trust. The chain starts with a self-signed or trusted root certificate, and each certificate in the chain signs the next lower certificate. This pattern creates a delegated chain of trust from the root certificate through each intermediate certificate to the final downstream device certificate installed on a device.

> [!TIP]
> If your device has a Hardware Security Module (HSM) like a TPM 2.0, store the X.509 keys securely in the HSM. Learn how to implement zero-touch provisioning at scale in [this blueprint](https://azure.microsoft.com/blog/the-blueprint-to-securely-solve-the-elusive-zerotouch-provisioning-of-iot-devices-at-scale) with the [iotedge-tpm2cloud](https://aka.ms/iotedge-tpm2cloud) sample.

## Prerequisites

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

### Device requirements

Use a physical or virtual Linux device as the IoT Edge device.

## Generate device identity certificates

The device identity certificate is a downstream device certificate that connects through a certificate chain of trust to the top X.509 certificate authority (CA) certificate. The device identity certificate must have its common name (CN) set to the device ID that you want the device to have in your IoT hub.

Device identity certificates are only used for provisioning the IoT Edge device and authenticating the device with Azure IoT Hub. These certificates aren't signing certificates. CA certificates that the IoT Edge device presents to modules or downstream devices are used for verification. For more information, see [Azure IoT Edge certificate usage detail](iot-edge-certs.md).

After you create the device identity certificate, you have two files: a `.cer` or `.pem` file with the public portion of the certificate, and a `.cer` or `.pem` file with the private key. If you use group enrollment in DPS, you also need the public portion of an intermediate or root CA certificate in the same certificate chain of trust.

You need these files to set up automatic provisioning with X.509:

* The device identity certificate and its private key certificate. The device identity certificate is uploaded to DPS if you create an individual enrollment. The private key is passed to the IoT Edge runtime.
* A full chain certificate with at least the device identity and the intermediate certificates. The full chain certificate is passed to the IoT Edge runtime.
* An intermediate or root CA certificate from the certificate chain of trust. This certificate is uploaded to DPS if you create a group enrollment.

### Use test certificates (optional)

If you don't have a certificate authority to create new identity certificates and want to try this scenario, use the scripts in the Azure IoT Edge git repository to generate test certificates. Use these certificates for development testing only. Don't use them in production.

To create test certificates, follow the steps in [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). Complete the two required sections to set up the certificate generation scripts and create a root CA certificate. Then, follow the steps to create a device identity certificate. When you finish, you have the following certificate chain and key pair:

* `<WRKDIR>/certs/iot-edge-device-identity-<name>-full-chain.cert.pem`
* `<WRKDIR>/private/iot-edge-device-identity-<name>.key.pem`

You need both certificates on the IoT Edge device. If you use individual enrollment in DPS, upload the `.cert.pem` file. If you use group enrollment in DPS, also upload an intermediate or root CA certificate in the same certificate chain of trust. If you use demo certificates, use the `<WRKDIR>/certs/azure-iot-test-only.root.ca.cert.pem` certificate for group enrollment.

<!-- Create a DPS enrollment using X.509 certificates H2 and content -->
[!INCLUDE [iot-edge-create-dps-enrollment-x509.md](includes/iot-edge-create-dps-enrollment-x509.md)]

<!-- Install IoT Edge on Linux H2 and content -->
[!INCLUDE [install-iot-edge-linux.md](includes/iot-edge-install-linux.md)]

## Provision the device with its cloud identity

After you install the runtime on your device, set up the device with the information it uses to connect to the device provisioning service and IoT Hub.

Make sure you have the following information:

* The DPS **ID Scope** value. Get this value from the overview page of your DPS instance in the Azure portal.
* The device identity certificate chain file on the device.
* The device identity key file on the device.

Create a configuration file for your device based on the template file that's included with the IoT Edge installation.

# [Ubuntu / Debian / RHEL](#tab/ubuntu+debian+rhel)

```bash
sudo cp /etc/aziot/config.toml.edge.template /etc/aziot/config.toml
```

Open the configuration file on your IoT Edge device.

```bash
sudo nano /etc/aziot/config.toml
```

Find the **Provisioning** section of the file. Uncomment the lines for DPS provisioning with X.509 certificate, and make sure all other provisioning lines are commented out.

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

identity_cert = "DEVICE_IDENTITY_CERTIFICATE_HERE" # For example, "file:///var/aziot/device-id.pem"
identity_pk = "DEVICE_IDENTITY_PRIVATE_KEY_HERE"   # For example, "file:///var/aziot/device-id.key"

# auto_reprovisioning_mode = Dynamic
```

# [Ubuntu Core snaps](#tab/snaps)

If you use a snap installation of IoT Edge, the template file is at `/snap/azure-iot-edge/current/etc/aziot/config.toml.edge.template`. Copy the template file to your home directory and name it `config.toml`. For example:

```bash
cp /snap/azure-iot-edge/current/etc/aziot/config.toml.edge.template ~/config.toml
```

Open the configuration file in your home directory on your IoT Edge device.

```bash
nano ~/config.toml
```

Find the **Provisioning** section of the file. Uncomment the lines for DPS provisioning with X.509 certificate, and make sure any other provisioning lines are commented out. Use the path to the shared directory that's accessible to both *azure-iot-edge* and *azure-iot-identity* snaps for the certificate files. For example, `/var/snap/azure-iot-identity/current/shared/`.

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

identity_cert = "DEVICE_IDENTITY_CERTIFICATE_HERE" # For example, "file:///var/snap/azure-iot-identity/current/shared/device-id.pem"
identity_pk = "DEVICE_IDENTITY_PRIVATE_KEY_HERE"   # For example, "file:///var/snap/azure-iot-identity/current/shared/device-id.key"


# auto_reprovisioning_mode = Dynamic
```

---

1. Update the value of `id_scope` with the scope ID you copied from your DPS instance.

1. Enter a `registration_id` for the device, which is the ID the device has in IoT Hub. The registration ID must match the common name (CN) of the identity certificate.

1. Update the values of `identity_cert` and `identity_pk` with your certificate and key information.

   You can provide the identity certificate value as a file URI, or it can be dynamically issued using EST or a local certificate authority. Uncomment only one line, based on the format you use.

   You can provide the identity private key value as a file URI or a PKCS#11 URI. Uncomment only one line, based on the format you use.

   If you use any PKCS#11 URIs, find the **PKCS#11** section in the config file and enter your PKCS#11 configuration information.

   For more information about certificates, see [Manage IoT Edge certificates](how-to-manage-device-certificates.md).

   For more information about provisioning configuration settings, see [Configure IoT Edge device settings](configure-device.md#provisioning).

1. Optionally, find the auto reprovisioning mode section of the file. Use the `auto_reprovisioning_mode` parameter to configure your device's reprovisioning behavior. **Dynamic** - Reprovision when the device detects that it can have been moved from one IoT Hub to another. This is the default. **AlwaysOnStartup** - Reprovision when the device is rebooted or a crash causes the daemons to restart. **OnErrorOnly** - Never trigger device reprovisioning automatically. Each mode has an implicit device reprovisioning fallback if the device can't connect to IoT Hub during identity provisioning because of connectivity errors. For more information, see [IoT Hub device reprovisioning concepts](../iot-dps/concepts-device-reprovision.md).

1. Optionally, uncomment the `payload` parameter to specify the path to a local JSON file. The contents of the file are [sent to DPS as additional data](../iot-dps/how-to-send-additional-data.md#iot-edge-support) when the device registers. This is useful for [custom allocation](../iot-dps/how-to-use-custom-allocation-policies.md). For example, if you want to allocate your devices based on an IoT Plug and Play model ID without human intervention.

1. Save and close the file.

Apply the configuration changes you made to IoT Edge.

# [Ubuntu / Debian / RHEL](#tab/ubuntu+debian+rhel)
```bash
sudo iotedge config apply
```

# [Ubuntu Core snaps](#tab/snaps)

```bash
sudo snap set azure-iot-edge raw-config="$(cat ~/config.toml)"
```

---

## Verify successful installation

If the runtime starts successfully, go to your IoT Hub and start deploying IoT Edge modules to your device.

# [Individual enrollment](#tab/individual-enrollment)

Check that the individual enrollment you created in device provisioning service is used. Go to your device provisioning service instance in the Azure portal. Open the enrollment details for the individual enrollment you created. The status of the enrollment is **assigned**, and the device ID is listed.

# [Group enrollment](#tab/group-enrollment)

Check that the group enrollment you created in device provisioning service is used. Go to your device provisioning service instance in the Azure portal. Open the enrollment details for the group enrollment you created. Go to the **Registration Records** tab to view all devices registered in that group.

---

Run these commands on your device to check that IoT Edge is installed and running.

Check the status of the IoT Edge service.

```cmd/sh
sudo iotedge system status
```

View service logs.

```cmd/sh
sudo iotedge system logs
```

List running modules.

```cmd/sh
sudo iotedge list
```

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags when you provision a new device. Use these values to target individual devices or groups of devices with automatic device management. Learn how to [deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).
