---
title: Trusted applications as IoT Edge modules | Microsoft Docs
description: Use the Open Enclave SDK and API to write trusted applications and deploy them as IoT Edge modules for confidential computing
author: kgremban
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 09/02/2020
ms.author: kgremban
---

# Use Open Enclave to build trusted applications for IoT Edge

Trusted applications on IoT Edge allow you to secure data while in use, in addition to in transit or at rest. Azure IoT Edge supports Open Enclave as a standard for developing trusted applications.

<!--
Terms

Trusted Execution Environment (TEE) aka "enclaves" -- 
Confidential Computing -- securing compute workloads within an enclave
Trusted Application (TA) -- an application the executes in an enclave
Rich Execution Environment -- non-TEE space
Open Enclave API -- offers the interface between TEE and REE
-->

## Confidential computing

Security has always been an important focus of the Internet of Things (IoT) because often IoT devices are often out in the world rather than secured inside a private facility. This exposure puts devices at risk for tampering and forgery because they are physically accessible to bad actors. IoT Edge devices have even more need for trust and integrity because they allow for sensitive workloads to be run at the edge. Unlike common sensors and actuators, these intelligent edge devices are potentially exposing sensitive workloads that were formally only run within cloud or on-premises environments.

The [IoT Edge security manager](iot-edge-security-manager.md) addresses one piece of the confidential computing challenge. The security manager uses a hardware security module (HSM) to protect the identity workloads and ongoing processes of an IoT Edge device.

Another aspect of confidential computing is protecting the data in use at the edge. A *Trusted execution environment* (TEE) is a secure, isolated environment on a processor and is sometimes referred to as an *enclave*. A *trusted application* is an application that runs in an enclave. Because of the nature of enclaves, trusted applications are protected from other apps running in the main processor or in the TEE.

IoT Edge supports Open Enclave as a solution for developing trusted applications that run at the edge.

## Open Enclave

The [Open Enclave SDK](https://openenclave.io/sdk/) is an open source project that helps developers create trusted applications for multiple platforms and environments. The Open Enclave SDK operates within the trusted execution environment of a device, while the Open Enclave API acts as an interface between the TEE and the non-TEE processing environment.

<!--
TODO: Something about Open Enclave + IoT Edge on device? Maybe Eustace's diagram?
-->

## Hardware

Currently, [TrustBox by Scalys](https://scalys.com/trustbox-industrial/) is the only device supported for deploying trusted applications as IoT Edge modules. The TrustBox Edge and TrustBox EdgeXL devices both come pre-loaded with the Open Enclave SDK and Azure IoT Edge.

## Develop and deploy

When you're ready to develop and deploy your trusted application, the [Microsoft Open Enclave](https://marketplace.visualstudio.com/items?itemName=ms-iot.msiot-vscode-openenclave) extension for Visual Studio Code can help. You can use either Linux or Windows as your development machine to develop modules for the TrustBox.

<!--
The extension says it can develop IoT Edge modules for Scalys Grapeboard, not TrustBox? Is that an issue?
-->

## Samples

