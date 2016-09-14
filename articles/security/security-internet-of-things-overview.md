<properties
   pageTitle="Internet of Things security overview | Microsoft Azure"
   description=" Azure internet of things (IoT) services offer a broad range of capabilities. This article helps you understand how to secure your IoT solutions in Azure. "
   services="security"
   documentationCenter="na"
   authors="TomShinder"
   manager="MBaldwin"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/09/2016"
   ms.author="terrylan"/>

# Internet of Things security overview

Azure internet of things (IoT) services offer a broad range of capabilities. These enterprise grade services enable you to:

- Collect data from devices
- Analyze data streams in-motion
- Store and query large data sets
- Visualize both real-time and historical data
- Integrate with back-office systems

To deliver these capabilities, Azure IoT Suite packages together multiple Azure services with custom extensions as preconfigured solutions. These preconfigured solutions are base implementations of common IoT solution patterns that help to reduce the time you take to deliver your IoT solutions. Using the IoT software development kits, you can customize and extend these solutions to meet your own requirements. You can also use these solutions as examples or templates when you are developing new IoT solutions.

The Azure IoT suite is a powerful solution for your IoT needs. However, it’s of upmost importance that your IoT solutions are designed with security in mind from the start. Because of the sheer number of IoT devices, any security incident can quickly become a widespread event with significant consequences.

To help you understand how to secure your IoT solutions, we have the following information.

## Security architecture

When designing a system, it is important to understand the potential threats to that system, and add appropriate defenses accordingly, as the system is designed and architected. It is particularly important to design the product from the start with security in mind because understanding how an attacker might be able to compromise a system helps make sure appropriate mitigations are in place from the beginning.

You can learn about IoT security architecture by reading [Internet of Things Security Architecture](../iot-suite/iot-security-architecture.md).

This article discusses the following topics:

- [Security Starts with a Threat Model](../iot-suite/iot-security-architecture.md#security-starts-with-a-threat-model)
- [Security in IoT](../iot-suite/iot-security-architecture.md#security-in-iot)
- [Threat Modeling the Azure IoT Reference Architecture](../iot-suite/iot-security-architecture.md#threat-modeling-the-azure-iot-reference-architecture)

## Security from the ground up

The IoT poses unique security, privacy, and compliance challenges to businesses worldwide. Unlike traditional cyber technology where these issues revolve around software and how it is implemented, IoT concerns what happens when the cyber and the physical worlds converge. Protecting IoT solutions requires ensuring secure provisioning of devices, secure connectivity between these devices and the cloud, and secure data protection in the cloud during processing and storage. Working against such functionality, however, are resource-constrained devices, geographic distribution of deployments, and a large number of devices within a solution.

You can learn how to handle security in these areas by reading [Internet of Things security from the ground up](../iot-suite/securing-iot-ground-up.md).

The article discusses the following topics:

- [Secure infrastructure from the ground up](../iot-suite/securing-iot-ground-up.md#secure-infrastructure-from-the-ground-up)
- [Microsoft Azure – secure IoT infrastructure for your business](../iot-suite/securing-iot-ground-up.md#microsoft-azure---secure-iot-infrastructure-for-your-business)

## Best Practices

Securing an IoT infrastructure requires a rigorous security-in-depth strategy. Starting from securing data in the cloud, to protecting data integrity while in transit over the public internet, and providing the ability to securely provision devices, each layer builds greater security assurance in the overall infrastructure.

You can learn about Internet of Things security best practices by reading [Internet of Things security best practices](../iot-suite/iot-security-best-practices.md).

The article discusses the following topics:

- [IoT hardware manufacturer/integrator](../iot-suite/iot-security-best-practices.md#iot-hardware-manufacturerintegrator)
- [IoT solution developer](../iot-suite/iot-security-best-practices.md#iot-solution-developer)
- [IoT solution deployer](../iot-suite/iot-security-best-practices.md#iot-solution-deployer)
- [IoT solution operator](../iot-suite/iot-security-best-practices.md#iot-solution-operator)
