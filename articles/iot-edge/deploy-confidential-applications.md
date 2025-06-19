---
title: Confidential applications as Azure IoT Edge modules
description: Use the Open Enclave SDK and API to write confidential applications and deploy them as IoT Edge modules for confidential computing
author: PatAltimore
ms.service: azure-iot-edge
services: iot-edge
ms.topic: concept-article
ms.date: 05/08/2025
ms.author: patricka
---

# Confidential computing at the edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge supports confidential applications that run within secure enclaves on the device. Encryption provides security for data while in transit or at rest, but enclaves provide security for data and workloads while in use. IoT Edge supports Open Enclave as a standard for developing confidential applications.

Security is an important focus of the Internet of Things (IoT) because IoT devices are often out in the world rather than secured inside a private facility. This exposure puts devices at risk for tampering and forgery because they are physically accessible to bad actors. IoT Edge devices need more trust and integrity because they run sensitive workloads at the edge. Unlike common sensors and actuators, these intelligent edge devices might expose sensitive workloads that were previously run only in protected cloud or on-premises environments.

The [IoT Edge security manager](iot-edge-security-manager.md) addresses one piece of the confidential computing challenge. The security manager uses a hardware security module (HSM) to protect the identity workloads and ongoing processes of an IoT Edge device.

Another aspect of confidential computing is protecting data in use at the edge. A *trusted execution environment (TEE)* is a secure, isolated environment on a processor, sometimes referred to as an *enclave*. A *confidential application* is an application that runs in an enclave. Because of the nature of enclaves, confidential applications are protected from other apps running in the main processor or in the TEE.

## Confidential applications on IoT Edge

Confidential applications are encrypted during transit and at rest, and decrypted only to run inside a trusted execution environment. This standard holds true for confidential applications deployed as IoT Edge modules.

Developers create confidential applications and package them as IoT Edge modules. The application is encrypted before it is pushed to the container registry. The application remains encrypted throughout the IoT Edge deployment process until the module is started on the IoT Edge device. Once the confidential application is within the device's TEE, it is decrypted and can begin executing.

:::image type="content" source="./media/deploy-confidential-applications/confidential-applications-encrypted.png" alt-text="Diagram showing that confidential applications are encrypted within IoT Edge modules until deployed into the secure enclave.":::

Confidential applications on IoT Edge extend [Azure confidential computing](../confidential-computing/overview.md). Workloads that run within secure enclaves in the cloud can also be deployed to run within secure enclaves at the edge.

## Open Enclave

The [Open Enclave SDK](https://openenclave.io/sdk/) is an open-source project that lets developers create confidential applications for multiple platforms and environments. The Open Enclave SDK operates within the trusted execution environment (TEE) of a device, while the Open Enclave API acts as an interface between the TEE and the non-TEE processing environment.

Open Enclave supports multiple hardware platforms. IoT Edge support for enclaves requires the Open Portable TEE operating system (OP-TEE OS). To learn more, see [Open Enclave SDK for OP-TEE OS](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/OP-TEE/Introduction.md).

The Open Enclave repository includes samples to help developers get started. For more information, select one of the introductory articles:

* [Building Open Enclave SDK samples on Linux](https://github.com/openenclave/openenclave/blob/master/samples/BuildSamplesLinux.md)
* [Building Open Enclave SDK samples on Windows](https://github.com/openenclave/openenclave/blob/master/samples/BuildSamplesWindows.md)

## Hardware

Currently, [TrustBox by Scalys](https://scalys.com/) is the only device supported with manufacturer service agreements for deploying confidential applications as IoT Edge modules. The TrustBox is built on  The TrustBox Edge and TrustBox EdgeXL devices both come preloaded with the Open Enclave SDK and Azure IoT Edge.

For more information, see [Getting started with Open Enclave for the Scalys TrustBox](https://aka.ms/scalys-trustbox-edge-get-started).

## Develop and deploy

When you're ready to develop and deploy your confidential application, the [Microsoft Open Enclave](https://marketplace.visualstudio.com/items?itemName=ms-iot.msiot-vscode-openenclave) extension for Visual Studio Code can help. You can use either Linux or Windows as your development machine to develop modules for the TrustBox.

## Next steps

Learn how to start developing confidential applications as IoT Edge modules with the [Open Enclave extension for Visual Studio Code](https://github.com/openenclave/openenclave/tree/master/devex/vscode-extension).
