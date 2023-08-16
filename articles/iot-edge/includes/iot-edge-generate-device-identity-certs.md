---
ms.topic: include
ms.date: 07/18/2023
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

## Generate device identity certificates

Manual provisioning with X.509 certificates requires IoT Edge version 1.0.10 or newer.

When you provision an IoT Edge device with X.509 certificates, you use what's called a *device identity certificate*. This certificate is only used for provisioning an IoT Edge device and authenticating the device with Azure IoT Hub. It's a leaf certificate that doesn't sign other certificates. The device identity certificate is separate from the certificate authority (CA) certificates that the IoT Edge device presents to modules or downstream devices for verification.

For X.509 certificate authentication, each device's authentication information is provided in the form of *thumbprints* taken from your device identity certificates. These thumbprints are given to IoT Hub at the time of device registration so that the service can recognize the device when it connects.

For more information about how the CA certificates are used in IoT Edge devices, see [Understand how Azure IoT Edge uses certificates](../iot-edge-certs.md).

You need the following files for manual provisioning with X.509:

* Two of device identity certificates with their matching private key certificates in .cer or .pem formats.

  One set of certificate/key files is provided to the IoT Edge runtime. When you create device identity certificates, set the certificate common name (CN) with the device ID that you want the device to have in your IoT hub.

* Thumbprints taken from both device identity certificates.

  Thumbprint values are 40-hex characters for SHA-1 hashes or 64-hex characters for SHA-256 hashes. Both thumbprints are provided to IoT Hub at the time of device registration.

If you don't have certificates available, you can [Create demo certificates to test IoT Edge device features](../how-to-create-test-certificates.md). Follow the instructions in that article to set up certificate creation scripts, create a root CA certificate, and then create two IoT Edge device identity certificates.

One way to retrieve the thumbprint from a certificate is with the following openssl command:

```cmd
openssl x509 -in <certificate filename>.pem -text -fingerprint
```

The thumbprint is included in the output of this command. For example:

```cmd
SHA1 Fingerprint=D2:68:D9:04:9F:1A:4D:6A:FD:84:77:68:7B:C6:33:C0:32:37:51:12
```
