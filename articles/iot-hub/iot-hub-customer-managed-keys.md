---
title: Azure IoT Hub data encryption at rest via customer-managed keys| Microsoft Docs
description: Encryption of data at rest with customer-managed keys for IoT Hub
author: ash2017
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/17/2020
ms.author: asrastog
---

# Encryption of data at rest with customer-managed keys for IoT Hub

IoT Hub supports encryption of data at rest with customer-managed keys (CMK), also known as Bring your own key (BYOK). Azure IoT Hub provides encryption of data at rest and in-transit as it's written in our datacenters and decrypts it for you as you access it. By default, IoT Hub uses Microsoft-managed keys to encrypt the data at rest. With CMK, you can get another layer of encryption on top of default encryption and can choose to encrypt data at rest with a key encryption key, managed through your [Azure Key Vault](https://azure.microsoft.com/services/key-vault/). This gives you the flexibility to create, rotate, disable, and revoke access controls. If BYOK is configured for your IoT Hub, we also provide double encryption, which offers a second layer of protection, while allowing you to control the encryption key through your Azure Key Vault.

This capability requires the creation of a new IoT Hub (basic or standard tier). To try this capability, contact us through [Microsoft support](https://azure.microsoft.com/support/create-ticket/). Share your company name and subscription ID when contacting Microsoft support.


## Next steps

* [Learn more about IoT Hub](./about-iot-hub.md)

* [Learn more about Azure Key Vault](../key-vault/general/overview.md)