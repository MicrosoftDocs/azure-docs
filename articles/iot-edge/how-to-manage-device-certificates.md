---
title: Manage device certificates - Azure IoT Edge | Microsoft Docs
description: Create test certificates, install, and manage them on an Azure IoT Edge device to prepare for production deployment. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 06/02/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---
# Manage certificates on an IoT Edge device

All IoT Edge devices use certificates to create secure connections between the runtime and any modules running on the device. IoT Edge devices functioning as gateways use these same certificates to connect to their downstream devices, too.

## Install production certificates

When you first install IoT Edge and provision your device, the device is set up with temporary certificates so that you can test the service.
These temporary certificates expire in 90 days, or can be reset by restarting your machine.
Once you move into a production scenario, or you want to create a gateway device, you need to provide your own certificates.
This article demonstrates the steps to install certificates on your IoT Edge devices.

To learn more about the different types of certificates and their roles, see [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

>[!NOTE]
>The term "root CA" used throughout this article refers to the topmost authority public certificate of the certificate chain for your IoT solution. You do not need to use the certificate root of a syndicated certificate authority, or the root of your organization's certificate authority. In many cases, it is actually an intermediate CA public certificate.

### Prerequisites

* An IoT Edge device, running either on [Windows](how-to-install-iot-edge-windows.md) or [Linux](how-to-install-iot-edge-linux.md).
* Have a root certificate authority (CA) certificate, either self-signed or purchased from a trusted commercial certificate authority like Baltimore, Verisign, DigiCert, or GlobalSign.

If you don't have a root certificate authority yet, but want to try out IoT Edge features that require production certificates (like gateway scenarios) you can [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md).

### Create production certificates

You should use your own certificate authority to create the following files:

* Root CA
* Device CA certificate
* Device CA private key

In this article, what we refer to as the *root CA* is not the topmost certificate authority for an organization. It's the topmost certificate authority for the IoT Edge scenario, which the IoT Edge hub module, user modules, and any downstream devices use to establish trust between each other.

To see an example of these certificates, review the scripts that create demo certificates in [Managing test CA certificates for samples and tutorials](https://github.com/Azure/iotedge/tree/master/tools/CACertificates).

### Install certificates on the device

Install your certificate chain on the IoT Edge device and configure the IoT Edge runtime to reference the new certificates.

For example, if you used the sample scripts to [Create demo certificates](how-to-create-test-certificates.md), copy the following files onto your IoT-Edge device:

* Device CA certificate: `<WRKDIR>\certs\iot-edge-device-MyEdgeDeviceCA-full-chain.cert.pem`
* Device CA private key: `<WRKDIR>\private\iot-edge-device-MyEdgeDeviceCA.key.pem`
* Root CA: `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`

1. Copy the three certificate and key files onto your IoT Edge device.

   You can use a service like [Azure Key Vault](https://docs.microsoft.com/azure/key-vault) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files.  If you generated the certificates on the IoT Edge device itself, you can skip this step and use the path to the working directory.

1. Open the IoT Edge security daemon config file.

   * Windows: `C:\ProgramData\iotedge\config.yaml`
   * Linux: `/etc/iotedge/config.yaml`

1. Set the **certificate** properties in config.yaml to the file URI path to the certificate and key files on the IoT Edge device. Remove the `#` character before the certificate properties to uncomment the four lines. Make sure the **certificates:** line has no preceding whitespace and that nested items are indented by two spaces. For example:

   * Windows:

      ```yaml
      certificates:
        device_ca_cert: "file:///C:/<path>/<device CA cert>"
        device_ca_pk: "file:///C:/<path>/<device CA key>"
        trusted_ca_certs: "file:///C:/<path>/<root CA cert>"
      ```

   * Linux:

      ```yaml
      certificates:
        device_ca_cert: "file:///<path>/<device CA cert>"
        device_ca_pk: "file:///<path>/<device CA key>"
        trusted_ca_certs: "file:///<path>/<root CA cert>"
      ```

1. On Linux devices, make sure that the user **iotedge** has read permissions for the directory holding the certificates.

1. If you've used any other certificates for IoT Edge on the device before, delete the files in the following two directories before starting or restarting IoT Edge:

   * Windows: `C:\ProgramData\iotedge\hsm\certs` and `C:\ProgramData\iotedge\hsm\cert_keys`

   * Linux: `/var/lib/iotedge/hsm/certs` and `/var/lib/iotedge/hsm/cert_keys`

## Customize certificate lifetime

IoT Edge automatically generates certificates on the device in several cases, including:

* If you don't provide your own production certificates when you install and provision IoT Edge, the IoT Edge security manager automatically generates a **device CA certificate**. This self-signed certificate is only meant for development and testing scenarios, not production. This certificate expires after 90 days.
* The IoT Edge security manager also generates a **workload CA certificate** signed by the device CA certificate

For more information about the function of the different certificates on an IoT Edge device, see [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

For these two automatically generated certificates, you have the option of setting the **auto_generated_ca_lifetime_days** flag in config.yaml to configure the number of days for the lifetime of the certificates.

>[!NOTE]
>There is a third auto-generated certificate that the IoT Edge security manager creates, the **IoT Edge hub server certificate**. This certificate always has a 90 day, but is automatically renewed before expiring. The **auto_generated_ca_lifetime_days** value doesn't affect this certificate.

To configure the certificate expiration to something other than the default 90 days, add the value in days to the **certificates** section of the config.yaml file.

```yaml
certificates:
  device_ca_cert: "<ADD URI TO DEVICE CA CERTIFICATE HERE>"
  device_ca_pk: "<ADD URI TO DEVICE CA PRIVATE KEY HERE>"
  trusted_ca_certs: "<ADD URI TO TRUSTED CA CERTIFICATES HERE>"
  auto_generated_ca_lifetime_days: <value>
```

If you provided your own device CA certificates, then this value still applies to the workload CA certificate, provided the lifetime value you set is shorter than the lifetime of the device CA certificate.

After you specify the flag in the config.yaml file, take the following steps:

1. Delete the contents of the `hsm` folder.

   Windows: `C:\ProgramData\iotedge\hsm\certs and C:\ProgramData\iotedge\hsm\cert_keys`
   Linux: `/var/lib/iotedge/hsm/certs and /var/lib/iotedge/hsm/cert_keys`

1. Restart the IoT Edge service.

   Windows:

   ```powershell
   Restart-Service iotedge
   ```

   Linux:

   ```bash
   sudo systemctl restart iotedge
   ```

1. Confirm the lifetime setting.

   Windows:

   ```powershell
   iotedge check --verbose
   ```

   Linux:

   ```bash
   sudo iotedge check --verbose
   ```

   Check the output of the **production readiness: certificates** check, which lists the number of days until the automatically generated device CA certificates expire.

## Next steps

Installing certificates on an IoT Edge device is a necessary step before deploying your solution in production. Learn more about how to [Prepare to deploy your IoT Edge solution in production](production-checklist.md).
