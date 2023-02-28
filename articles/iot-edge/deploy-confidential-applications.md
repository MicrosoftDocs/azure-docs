---
title: Confidential applications as Azure IoT Edge modules
description: Use the Open Enclave SDK and API to write confidential applications and deploy them as IoT Edge modules for confidential computing
author: PatAltimore
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 01/27/2021
ms.author: patricka
---

# Confidential computing at the edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge supports confidential applications that run within secure enclaves on the device. Encryption provides security for data while in transit or at rest, but enclaves provide security for data and workloads while in use. IoT Edge supports Open Enclave as a standard for developing confidential applications.

Security has always been an important focus of the Internet of Things (IoT) because often IoT devices are often out in the world rather than secured inside a private facility. This exposure puts devices at risk for tampering and forgery because they are physically accessible to bad actors. IoT Edge devices have even more need for trust and integrity because they allow for sensitive workloads to be run at the edge. Unlike common sensors and actuators, these intelligent edge devices are potentially exposing sensitive workloads that were formerly only run within protected cloud or on-premises environments.

The [IoT Edge security manager](iot-edge-security-manager.md) addresses one piece of the confidential computing challenge. The security manager uses a hardware security module (HSM) to protect the identity workloads and ongoing processes of an IoT Edge device.

Another aspect of confidential computing is protecting the data in use at the edge. A *Trusted execution environment* (TEE) is a secure, isolated environment on a processor and is sometimes referred to as an *enclave*. A *confidential application* is an application that runs in an enclave. Because of the nature of enclaves, confidential applications are protected from other apps running in the main processor or in the TEE.

## Confidential applications on IoT Edge

Confidential applications are encrypted in transit and at rest, and only decrypted to run inside a trusted execution environment. This standard holds true for confidential applications deployed as IoT Edge modules.

The developer creates the confidential application and packages it as an IoT Edge module. The application is encrypted before being pushed to the container registry. The application remains encrypted throughout the IoT Edge deployment process until the module is started on the IoT Edge device. Once the confidential application is within the device's TEE, it is decrypted and can begin executing.

:::image type="content" source="./media/deploy-confidential-applications/confidential-applications-encrypted.png" alt-text="Diagram that show confidential applications are encrypted within IoT Edge modules until deployed into the secure enclave.":::

Confidential applications on IoT Edge are a logical extension of [Azure confidential computing](../confidential-computing/overview.md). Workloads that run within secure enclaves in the cloud can also be deployed to run within secure enclaves at the edge.

## Open Enclave

The [Open Enclave SDK](https://openenclave.io/sdk/) is an open source project that helps developers create confidential applications for multiple platforms and environments. The Open Enclave SDK operates within the trusted execution environment of a device, while the Open Enclave API acts as an interface between the TEE and the non-TEE processing environment.

Open Enclave supports multiple hardware platforms. IoT Edge support for enclaves currently requires the Open Portable TEE operating system (OP-TEE OS). To learn more, see [Open Enclave SDK for OP-TEE OS](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/OP-TEE/Introduction.md).

The Open Enclave repository also includes samples to help developers get started. For more information, choose one of the introductory articles:

* [Building Open Enclave SDK samples on Linux](https://github.com/openenclave/openenclave/blob/master/samples/BuildSamplesLinux.md)
* [Building Open Enclave SDK samples on Windows](https://github.com/openenclave/openenclave/blob/master/samples/BuildSamplesWindows.md)

## Hardware

Currently, [TrustBox by Scalys](https://scalys.com/) is the only device supported with manufacturer service agreements for deploying confidential applications as IoT Edge modules. The TrustBox is built on  The TrustBox Edge and TrustBox EdgeXL devices both come pre-loaded with the Open Enclave SDK and Azure IoT Edge.

For more information, see [Getting started with Open Enclave for the Scalys TrustBox](https://aka.ms/scalys-trustbox-edge-get-started).

## Develop and deploy

When you're ready to develop and deploy your confidential application, the [Microsoft Open Enclave](https://marketplace.visualstudio.com/items?itemName=ms-iot.msiot-vscode-openenclave) extension for Visual Studio Code can help. You can use either Linux or Windows as your development machine to develop modules for the TrustBox.

## Next steps

Learn how to start developing confidential applications as IoT Edge modules with the [Open Enclave extension for Visual Studio Code](https://github.com/openenclave/openenclave/tree/master/devex/vscode-extension)
