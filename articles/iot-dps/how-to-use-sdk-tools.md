---
title: Use tools provided in the Azure IoT Hub Device Provisioning Service SDKs to simplify development
description: This document reviews the tools provided in Azure IoT Hub Device Provisioning Service SDKs for development
author: yzhong94
ms.author: yizhon
ms.date: 04/09/2018
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
manager: arjmands
---

# How to use tools provided in the SDKs to simplify development for provisioning
The IoT Hub Device Provisioning Service simplifies the provisioning process with zero-touch, just-in-time [auto-provisioning](concepts-auto-provisioning.md) in a secure and scalable manner.  Security attestation in the form of X.509 certificate or Trusted Platform Module (TPM) is required.  Microsoft is also partnering with [other security hardware partners](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/) to improve confidence in securing IoT deployment. Understanding the hardware security requirement can be quite challenging for developers. A set of Azure IoT Provisioning Service SDKs are provided so that developers can use a convenience layer for writing clients that talk to the provisioning service. The SDKs also provide samples for common scenarios as well as a set of tools to simplify security attestation in development.

## Trusted Platform Module (TPM) simulator
[TPM](https://docs.microsoft.com/azure/iot-dps/concepts-security) can refer to a standard for securely storing keys to authenticate the platform, or it can refer to the I/O interface used to interact with the modules implementing the standard. TPMs can exist as discrete hardware, integrated hardware, firmware-based, or software-based.  In production, TPM is located on the device, either as discrete hardware, integrated hardware, or firmware-based. In the testing phase, a software-based TPM simulator is provided to developers.  This simulator is only available for developing on Windows platform for now.

Steps for using the TPM simulator are:
1. [Prepare the development environment](https://docs.microsoft.com/azure/iot-dps/quick-enroll-device-x509-java) and clone the GitHub repository:
   ```
   git clone https://github.com/Azure/azure-iot-sdk-java.git
   ```
2. Navigate to the TPM simulator folder under ```azure-iot-sdk-java/provisioning/provisioning-tool/tpm-simulator/```.
3. Run Simulator.exe prior to running any client application for provisioning device.
4. Let the simulator run in the background throughout the provisioning process to obtain registration ID and Endorsement Key.  Both values are only valid for one instance of the run.

## X.509 certificate generator
[X.509 certificates](https://docs.microsoft.com/azure/iot-dps/concepts-security#x509-certificates) can be used as an attestation mechanism to scale production and simplify device provisioning.  There are [several ways](https://docs.microsoft.com/azure/iot-hub/iot-hub-x509ca-overview#how-to-get-an-x509-ca-certificate) to obtain an X.509 certificate:
* For production environment, we recommend purchasing an X.509 CA certificate from a public root certificate authority.
* For testing environment, you can generate an X.509 root certificate or X.509 certificate chain using:
    * OpenSSL: You can use scripts for certificate generation:
        * [Node.js](https://github.com/Azure/azure-iot-sdk-node/tree/master/provisioning/tools)
        * [PowerShell or Bash](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md)
        
    * Device Identity Composition Engine (DICE) Emulator: DICE can be used for cryptographic device identity and attestation based on TLS protocol and X.509 client certificates.  [Learn](https://www.microsoft.com/research/publication/device-identity-dice-riot-keys-certificates/) more about device identity with DICE.

### Using X.509 certificate generator with DICE emulator
The SDKs provide an X.509 certificate generator with DICE emulator, located in the [Java SDK](https://github.com/Azure/azure-iot-sdk-java/tree/master/provisioning/provisioning-tools/provisioning-x509-cert-generator).  This generator works cross-platform.  The generated certificate can be used for development in other languages.

Currently, while the DICE Emulator outputs a root certificate, an intermediate certificate, a leaf certificate, and associated private key.  However, the root certificate or intermediate certificate cannot be used to sign a separate leaf certificate.  If you intend to test group enrollment scenario where one signing certificate is used to sign the leaf certificates of multiple devices, you can use OpenSSL to produce a chain of certificates.

To generate X.509 certificate using this generator:
1. [Prepare the development environment](https://docs.microsoft.com/azure/iot-dps/quick-enroll-device-x509-java) and clone the GitHub repository:
   ```
   git clone https://github.com/Azure/azure-iot-sdk-java.git
   ```
2. Change the root to azure-iot-sdk-java.
3. Run ```mvn install -DskipTests=true``` to download all required packages and compile the SDK
4. Navigate to the root for X.509 Certificate Generator in ```azure-iot-sdk-java/provisioning/provisioning-tools/provisioning-x509-cert-generator```.
5. Build with ```mvn clean install```
6. Run the tool using the following commands:
   ```
   cd target
   java -jar ./provisioning-x509-cert-generator-{version}-with-deps.jar
   ```
7. When prompted, you may optionally enter a _Common Name_ for your certificates.
8. The tool locally generates a **Client Cert**, the **Client Cert Private Key**, **Intermediate Cert**, and the **Root Cert**.

**Client Cert** is the leaf certificate on the device.  **Client Cert** and the associated **Client Cert Private Key** are needed in device client. Depending on what language you choose, the mechanism to put this in the client application may be different.  For more information, see the [Quickstarts](https://docs.microsoft.com/azure/iot-dps/quick-create-simulated-device-x509) on create simulated device using X.509 for more information.

The root certificate or intermediate can be used to create an enrollment group or individual enrollment [programmatically](https://docs.microsoft.com/azure/iot-dps/how-to-manage-enrollments-sdks) or using the [portal](https://docs.microsoft.com/azure/iot-dps/how-to-manage-enrollments).

## Next steps
* Develop using the [Azure IoT SDK]( https://github.com/Azure/azure-iot-sdks) for Azure IoT Hub and Azure IoT Hub Device Provisioning Service
