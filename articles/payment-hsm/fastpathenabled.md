---
title: Azure Payment HSM fastpathenabled tag
description: The fastpathenabled tag, as it relates to Azure Payment HSM and affiliated subscriptions and virtual networks
services: payment-hsm
author: msmbaldwin

tags: azure-resource-manager
ms.service: payment-hsm
ms.workload: security
ms.topic: article
ms.date: 03/25/2023
ms.author: mbaldwin

---

# Fastpathenabled

Within the context of Azure Payment HSM, "Fastpathenabled" is used in two related but distinct ways:

- "FastPathEnabled" (capitalized) is a an Azure Feature Exposure Control (AFEC) flag. It must be applied to **every** subscription ID that wants to connect to a payment HSM.
- "fastpathenabled" (lowercased) is a virtual network tag. It must be added to **every** virtual network and NAT gateway (when applicable) that interacts with a payment HSM.

### Subscriptions

The "FastPathEnabled" feature flag must be added/registered to all subscriptions IDs that connect to a payment HSM. If you have multiple subscriptions IDs that require access to a payment HSM, include them all when contacting [Mirosoft support](support-guide.md#microsoft-support) (after you [Register the resource providers and features](register-payment-hsm-resource-providers.md)).

> [!WARNING]
Applying the "FastPathEnabled" feature flag to a subscription that already has resources has **no** effect on existing resources. You must register those resources by following the stpes in [Register the resource providers and features](register-payment-hsm-resource-providers.md).

### Virtual networks

The "fastpathenabled" tag must be enabled on every virtual networks that the payment HSM uses, peered or otherwise. For instance, to peer a virtual network of a payment HSM with a virtual network of a VM, you must first add the "fastpathenabled" tag to the latter.

Unfortunately, adding the "fastpathenabled" tag through the Azure portal is insufficient—it must be done from the commandline. To do so, follow the steps outlined in [How to peer Azure Payment HSM virtual networks](peer-vnets.md?tabs=azure-cli).

### Virtual Network NAT scenario

For an Virtual Network NAT scenario, you must add the "fastpathenabled" tag with a value of `True` when creating the NAT gateway (not after the NAT gateway is created).

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- See common [Deployment scenarios](deployment-scenarios.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- Learn how to [Create a payment HSM](create-payment-hsm.md)
- Read the [frequently asked questions](faq.yml)
