---
title: What is OPC Vault - Azure | Microsoft Docs
description: This article provides an overview of OPC Vault. It can configure, register, and manage certificate lifecycle for OPC UA applications in the cloud.
author: dominicbetts
ms.author: dobett
ms.date: 11/26/2018
ms.topic: overview
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# What is OPC Vault?

> [!IMPORTANT]
> While we update this article, see [Azure Industrial IoT](https://azure.github.io/Industrial-IoT/) for the most up to date content.

OPC Vault is a microservice that can configure, register, and manage certificate lifecycle for OPC UA server and client applications in the cloud. This article describes the OPC Vault's simple use cases.

## Certificate management
​
For example, ​a manufacturing company needs to connect their OPC UA server machine to their newly built client application. When the manufacturer makes the initial access of the server machine, an error message is immediately shown on the OPC UA server application to indicate that the client application is not secure. This mechanism is built in the OPC UA server machine to prevent any unauthorized application access, which prevents vicious hacking on the shop floor.​

## Application security management
A security professional uses OPC Vault microservice to easily enable OPC UA server to communicate with any client application, because OPC Vault has all the functions for certificate registry, storage, and lifecycle management. ​Now the OPC UA server is securely connected, it can communicate to the newly built client application

## The complete OPC Vault architecture
The following diagram illustrates the complete OPC Vault architecture.

![OPC Vault architecture](media/overview-opc-vault-architecture/opc-vault.png)

## Next steps

Now that you have learned about OPC Vault and its uses, here is the suggested next step:

[OPC Vault architecture](overview-opc-vault-architecture.md)