---
title: Azure Payment HSM "fastpathenabled" feature flag and tag
description: The "fastpathenabled" feature flag and tag, as it relates to Azure Payment HSM and affiliated subscriptions and virtual networks
services: payment-hsm
author: cynthiatreger
ms.service: payment-hsm
ms.workload: security
ms.topic: article
ms.date: 03/25/2023
ms.author: ctreger

---

# Fastpathenabled

Azure Payment HSM uses the term "Fastpathenabled" in two related but distinct ways:

- "FastPathEnabled" is an Azure Feature Exposure Control (AFEC) flag. It must be applied to **every** subscription ID that wants to access to Azure Payment HSM.
- "fastpathenabled" (always lowercased) is a virtual network tag. It must be added to the virtual network hosting the payment HSM's delegated subnet, as well as to **every** peered VNet requiring connectivity to the payment HSM.

Adding the “FastPathEnabled” feature flag and enabling the “fastpathenabled” tag don't cause any downtime.

### Subscriptions

The "FastPathEnabled" feature flag must be added/registered to all subscriptions IDs that need access to Azure Payment HSM.  To apply the "FastPathEnabled" feature flag, see [Register the resource providers and features](register-payment-hsm-resource-providers.md).

> [!IMPORTANT]
> After registering the "FastPathEnabled" feature flag, you **must** contact the [Azure Payment HSM support team](support-guide.md#microsoft-support) team to have your registration approved. In your message to Microsoft support, include the subscription IDs of **every** subscription that needs access to Azure Payment HSM.

### Virtual networks

The "fastpathenabled" tag must be added to every virtual network connecting to the payment HSM's delegated subnet. In a Hub and Spoke topology, the "fastpathenabled" tag must be added to both the central Hub VNet and the peered Spoke VNet containing the payment HSM.

The "fastpathenabled" tag isn't required on nondirectly peered VNets reaching the Payment HSM's VNet via a Central hub.

> [!WARNING]
> Adding the "fastpathenabled" tag through the Azure portal is insufficient—it must be done from the commandline. To do so, follow the steps outlined in [How to peer Azure Payment HSM virtual networks](peer-vnets.md?tabs=azure-cli).

### Virtual Network NAT scenario

For a Virtual Network NAT scenario, you must add the "fastpathenabled" tag with a value of `True` when creating the NAT gateway (not after the NAT gateway is created).

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- [Register the resource providers and features](register-payment-hsm-resource-providers.md)
- [How to peer Azure Payment HSM virtual networks](peer-vnets.md?tabs=azure-cli)
- [Get started with Azure Payment HSM](getting-started.md)
- [Create a payment HSM](create-payment-hsm.md)
- Read the [frequently asked questions](faq.yml)
