---
title: Secure your Internet of Things (IoT) in Azure | Microsoft Docs
description: " Azure internet of things (IoT) services offer a broad range of capabilities. This article helps you understand how to secure your IoT solutions in Azure. "
services: security
documentationcenter: na
author: TomShinder
manager: barbkess
editor: TomSh

ms.assetid: 1473c8dd-8669-48fb-86db-b3c50e2eaf59
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/21/2017
ms.author: terrylan

---
# Internet of Things security overview
Azure internet of things (IoT) services offer a broad range of capabilities. These enterprise grade services enable you to:

* Collect data from devices
* Analyze data streams in-motion
* Store and query large data sets
* Visualize both real-time and historical data
* Integrate with back-office systems

To deliver these capabilities, Azure IoT solution accelerators package together multiple Azure services with custom extensions as preconfigured solutions. These preconfigured solutions are base implementations of common IoT solution patterns that help to reduce the time you take to deliver your IoT solutions. Using the IoT software development kits, you can customize and extend these solutions to meet your own requirements. You can also use these solutions as examples or templates when you are developing new IoT solutions.

The Azure IoT solution accelerators are powerful solutions for your IoT needs. However, it’s of upmost importance that your IoT solutions are designed with security in mind from the start. Because of the sheer number of IoT devices, any security incident can quickly become a widespread event with significant consequences.

To help you understand how to secure your IoT solutions, we have the following information.

## Security architecture
When designing a system, it is important to understand the potential threats to that system, and add appropriate defenses accordingly, as the system is designed and architected. It is important to design the product from the start with security in mind because understanding how an attacker might be able to compromise a system helps make sure appropriate mitigations are in place from the beginning.

You can learn about IoT security architecture by reading [Internet of Things Security Architecture](/azure/iot-fundamentals/iot-security-architecture).

This article discusses the following topics:

* [Security Starts with a Threat Model](/azure/iot-fundamentals/iot-security-architecture#security-starts-with-a-threat-model)
* [Security in IoT](/azure/iot-fundamentals/iot-security-architecture#security-in-iot)
* [Threat Modeling the Azure IoT Reference Architecture](/azure/iot-fundamentals/iot-security-architecture)

## Security from the ground up
The IoT poses unique security, privacy, and compliance challenges to businesses worldwide. Unlike traditional cyber technology where these issues revolve around software and how it is implemented, IoT concerns what happens when the cyber and the physical worlds converge. Protecting IoT solutions requires ensuring secure provisioning of devices, secure connectivity between these devices and the cloud, and secure data protection in the cloud during processing and storage. Working against such functionality, however, are resource-constrained devices, geographic distribution of deployments, and many devices within a solution.

You can learn how to handle security in these areas by reading [Internet of Things security from the ground up](/azure/iot-fundamentals/iot-security-ground-up).

The article discusses the following topics:

* [Secure infrastructure from the ground up](/azure/iot-fundamentals/iot-security-ground-up#secure-infrastructure-from-the-ground-up)
* [Microsoft Azure – secure IoT infrastructure for your business](/azure/iot-fundamentals/iot-security-ground-up#microsoft-azure---secure-iot-infrastructure-for-your-business)

## Best Practices
Securing an IoT infrastructure requires a rigorous security-in-depth strategy. From securing data in the cloud, protecting data integrity while in transit over the public internet, to securely provisioning devices, each layer builds greater security assurance in the overall infrastructure.

You can learn about Internet of Things security best practices by reading [Internet of Things security best practices](/azure/iot-fundamentals/iot-security-best-practices).

The article discusses the following topics:

* [IoT hardware manufacturer/integrator](/azure/iot-fundamentals/iot-security-best-practices#iot-hardware-manufacturerintegrator)
* [IoT solution developer](/azure/iot-fundamentals/iot-security-best-practices#iot-solution-developer)
* [IoT solution deployer](/azure/iot-fundamentals/iot-security-best-practices#iot-solution-deployer)
* [IoT solution operator](/azure/iot-fundamentals/iot-security-best-practices#iot-solution-operator)
