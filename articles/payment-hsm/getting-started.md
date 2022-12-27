---
title: Getting started with Azure Payment HSM
description: Information to begin using Azure Payment HSM
services: payment-hsm
author: msmbaldwin

tags: azure-resource-manager
ms.service: payment-hsm
ms.workload: security
ms.topic: article
ms.date: 01/25/2022
ms.author: mbaldwin
ms.custom: references_regions
---

# Getting started with Azure Payment HSM

This article provides steps and information necessary to get started with Azure Payment HSM.

[!INCLUDE [Specialized service](../../includes/payment-hsm/specialized-service.md)]

## Availability

Azure Payment HSM is currently available in the following regions:

- East US
- West US
- South Central US
- Central US
- North Europe
- West Europe

## Prerequisites

Azure Payment HSM customers must have:

- Access to the Thales Customer Portal (Customer ID)
- Thales smart cards and card reader for payShield Manager

## Cost

The HSM devices will be charged based on the [Azure Payment HSM pricing page](https://azure.microsoft.com/pricing/details/payment-hsm/). All other Azure resources for networking and virtual machines will incur regular Azure costs too.

## payShield customization considerations

If you are using payShield on-premises today with a custom firmware, a porting exercise is required to update the firmware to a version compatible with the Azure deployment. Please contact your Thales account manager to request a quote.

Ensure that the following information is provided:

- Customization hardware platform (e.g., payShield 9000 or payShield 10K)
- Customization firmware number

## Support

For details on Azure Payment HSM prerequisites, support channels, and division of support responsibility between Microsoft, Thales, and the customer, see the [Azure Payment HSM service support guide](support-guide.md).

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- Learn how to [Create a payment HSM](create-payment-hsm.md)
- Read the [frequently asked questions](faq.yml)
