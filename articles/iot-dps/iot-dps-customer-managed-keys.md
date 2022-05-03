---
title: Azure Device Provisioning Service data encryption at rest via customer-managed keys| Microsoft Docs
description: Encryption of data at rest with customer-managed keys for Device Provisioning Service
author: kgremban
ms.service: iot-dps
services: iot-dps
ms.topic: conceptual
ms.date: 02/24/2020
ms.author: kgremban
ROBOTS: NOINDEX
---

# Encryption of data at rest with customer-managed keys for Device Provisioning Service

## Overview

Device Provisioning Service (DPS) supports encryption of data at rest with customer-managed keys (CMK), also known as bring your own key (BYOK). DPS provides encryption of data at rest and in transit as it's written in our datacenters and decrypts it for you, as you access it. By default, DPS uses Microsoft-managed keys to encrypt the data at rest. With CMK, you can get an additional layer of encryption on top of default platform encryption by choosing to encrypt data at rest with a key-encryption-key, managed through your [Azure Key Vault](https://azure.microsoft.com/services/key-vault/). This gives you the flexibility to create, rotate, disable and revoke keys. If CMK is configured for your DPS, it implies that double encryption is enabled with two layers of protection actively protecting your data. 

This capability requires the creation of a new DPS. To try this capability, contact us through [Microsoft support](https://azure.microsoft.com/support/create-ticket/). Share your company name and subscription ID when contacting Microsoft support.


## Next steps

* [Learn more about Device Provisioning Service](./index.yml)

* [Learn more about Azure Key Vault](../key-vault/general/overview.md)