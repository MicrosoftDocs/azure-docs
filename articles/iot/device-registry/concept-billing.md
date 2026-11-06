---
title: Understand Azure Device Registry billing
titleSuffix: Azure Device Registry
description: Learn which Azure Device Registry resources and certificate operations are billed and how usage is metered.
author: dimatx
ms.author: dimatokar
ms.service: azure-iot
ms.topic: concept-article
ms.date: 11/06/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution architect, I want to understand which Azure Device Registry resources and operations are billed so that I can estimate usage for my solution.
---

# Understand Azure Device Registry billing

Azure Device Registry provides a centralized registry for managing IoT devices and industrial assets as Azure resources. Optional certificate management helps you manage device certificates throughout their lifecycle.

You're billed for registered assets and devices. Certificate management adds charges for certificate authorities and operations, including certificate issuance and renewal. This article explains what is billed and how usage is metered.

## Assets and devices

You're billed for the following resources registered in Azure Device Registry:

| Resource | Azure resource types |
|---|---|
| Assets | `Microsoft.DeviceRegistry/assets`, `Microsoft.DeviceRegistry/namespaces/assets` |
| Discovered assets | `Microsoft.DeviceRegistry/namespaces/discoveredAssets` |
| Devices | `Microsoft.DeviceRegistry/namespaces/devices`, `Microsoft.DeviceRegistry/namespaces/registryDevices` |
| Discovered devices | `Microsoft.DeviceRegistry/namespaces/discoveredDevices` |

Usage is metered hourly based on the number of registered resources and billed monthly.

## Certificate management

Certificate management has two billing components: certificate authorities and certificate operations.

### Certificate authorities

You're billed for each certificate authority (CA) and intermediate certificate authority (ICA). Usage is metered hourly.

Both CAs and ICAs use the `Microsoft.DeviceRegistry/namespaces/certificateAuthorities` resource type.

### Certificate operations

Certificate issuances and renewals are billed as Azure Device Registry operations. The operations meter counts the combined number of issuances and renewals.

Certificate revocations aren't billed.

## Features in preview

Jobs, groups, and software updates aren't billed while they're in preview.

## Cost estimates and pricing

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs.

For Azure Device Registry prices, see the [Azure IoT Hub pricing page](https://azure.microsoft.com/pricing/details/iot-hub/#pricing) and the [Azure IoT Operations pricing page](https://azure.microsoft.com/pricing/details/iot-operations/#pricing).
