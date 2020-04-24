---
title: Azure IoT Hub data encryption at rest via customer-managed keys| Microsoft Docs
description: Encryption of data at rest with customer-managed keys for IoT Hub
author: ash2017
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/08/2020
ms.author: asrastog
---

# Encryption of data at rest with customer-managed keys for IoT Hub

IoT Hub supports encryption of data at rest with customer-managed keys (CMK), also known as Bring your own key (BYOK), support for Azure IoT Hub. Azure IoT Hub provides encryption of data at rest and in transit. By default, IoT Hub uses Microsoft-managed keys to encrypt the data. With CMK support, customers now have the choice of encrypting the data at rest with a key encryption key, managed by the customers, using the [Azure Key Vault](https://azure.microsoft.com/services/key-vault/).

This capability requires the creation of a new IoT Hub (basic or standard tier), in one of the following regions: East US, West US 2, South Central US or US Gov. To try this capability, contact us through [Microsoft support](https://azure.microsoft.com/support/create-ticket/). Share your company name and subscription ID when contacting Microsoft support.

## Next steps

* [Learn more about IoT Hub](https://docs.microsoft.com/azure/iot-hub/about-iot-hub)

* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)
