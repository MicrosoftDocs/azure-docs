---
title: Azure Device Provisioning Service data encryption at rest via customer-managed keys| Microsoft Docs
description: Encryption of data at rest with customer-managed keys for Device Provisioning Service
author: chrissie926
manager: nberdy
ms.service: iot-dps
services: iot-dps
ms.topic: conceptual
ms.date: 02/24/2020
ms.author: menchi
---

# Encryption of data at rest with customer-managed keys for Device Provisioning Service

## Overview

Device Provisioning Service (DPS) supports encryption of data at rest with customer-managed keys (CMK), also known as Bring your own key (BYOK). DPS provides encryption of data at rest and in transit. By default, DPS uses Microsoft-managed keys to encrypt the data. With CMK support, customers now have the choice of encrypting the data at rest with a key encryption key, managed by the customers, using the [Azure Key Vault](https://azure.microsoft.com/services/key-vault/).

This capability requires the creation of a new DPS, in one of the following regions: East US, West US 2, or South Central US. To try this capability, contact us through [Microsoft support](https://azure.microsoft.com/support/create-ticket/). Share your company name and subscription ID when contacting Microsoft support.

## Next steps

* [Learn more about Device Provisioning Service](https://docs.microsoft.com/azure/iot-dps/)

* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)