---
title: Data encryption in Device Update for Azure IoT Hub
description: Understand how Device Update for IoT Hub encrypts data.
author: eshashah
ms.author: eshashah
ms.date: 09/22/2023
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Data encryption for Device Update for IoT Hub


Device Update for IoT Hub provides data protection through encryption at rest and in-transit as it's written in the datastores; the data is encrypted when read and decrypted when written.
Data in a new Device Update account is encrypted with Microsoft-managed keys by default. 


Device Update also supports use of your own encryption keys. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.

You must use one of the following Azure key stores to store your customer-managed keys:
- Azure Key Vault
- Azure Key Vault Managed Hardware Security Module (HSM)

You can either create your own keys and store them in the key vault or managed HSM, or you can use the Azure Key Vault APIs to generate keys. The CMK is then used for all the instances in the Device Update account.

> [!NOTE]
> This capability requires the creation of a new Device Update Account and Instance – Standard SKU. This is not available for the free SKU of Device update.
