---
title: Encryption of Azure IoT Hub data at rest using customer-managed keys| Microsoft Docs
description: Encryption of Azure IoT Hub data at rest using customer-managed keys
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 11/03/2022
ms.author: kgremban
ROBOTS: NOINDEX
---

# Encryption of Azure Iot Hub data at rest using customer-managed keys (preview)

IoT Hub supports encryption of data at rest using customer-managed keys (CMK), also known as Bring your own key (BYOK). Azure IoT Hub provides encryption of data at rest and in-transit as it's written in our datacenters; the data is encrypted when read and decrypted when written.

>[!NOTE]
>The customer-managed keys feature is in private preview, and is not currently accepting new customers.

By default, IoT Hub uses Microsoft-managed keys to encrypt the data. With CMK, you can get another layer of encryption on top of default encryption and can choose to encrypt data at rest with a key encryption key, managed through your [Azure Key Vault](https://azure.microsoft.com/services/key-vault/). This gives you the flexibility to create, rotate, disable, and revoke access controls. If BYOK is configured for your IoT Hub, we also provide double encryption, which offers a second layer of protection, while still allowing you to control the encryption key through your Azure Key Vault.

This capability requires the creation of a new IoT Hub (basic or standard tier). To try this capability, contact us through [Microsoft support](https://azure.microsoft.com/support/create-ticket/). Share your company name and subscription ID when contacting Microsoft support.

## Next steps

* [What is IoT Hub?](./about-iot-hub.md)

* [Learn more about Azure Key Vault](../key-vault/general/overview.md)
