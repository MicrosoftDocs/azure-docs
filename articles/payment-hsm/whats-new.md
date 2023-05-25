---
title: What's new for Azure Payment HSM
description: Recent updates for Azure Payment HSM
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: tutorial
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.date: 05/25/2023
---

# What's new for Azure Payment HSM

Here's what's new with Azure Payment HSM. New features and improvements are also announced on the [Azure updates Key Vault channel](https://azure.microsoft.com/updates/?category=security&query=payment%20hsm).

## May 2023

Azure Payment HSM now supports two host IP network interfaces from payShield 10K. By using two host network interfaces, customers can now have a maximum of 128 concurrent connections.

It's important to note that there are no changes to the payment HSM resource creation process, as the two host network interfaces are created by default when the PHSM is set up. Additionally, customers can only create these host network interfaces within the same VNET, but they do have the option to use either static or dynamic IP addresses for the host interfaces.

For more information, see:
- [Create a payment HSM with the host and management port in the same virtual network using Azure CLI or PowerShell](create-payment-hsm.md)
- [Create a payment HSM with the host and management port in the same virtual network using an ARM template](quickstart-template.md)
- [Create a payment HSM with the host and management port in different virtual networks using Azure CLI or PowerShell](create-different-vnet-arm.md)
- [Create a payment HSM with the host and management port in different virtual networks using an ARM template](create-different-vnet-arm.md)
- [Create HSM resource with host and management port with IP addresses in different virtual networks using ARM template](create-different-ip-addresses.md)

## Next steps

If you have questions, contact us through [support](https://azure.microsoft.com/support/options/).
