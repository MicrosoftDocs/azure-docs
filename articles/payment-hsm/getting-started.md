---
title: Getting started with Azure Payment HSM
description: Information to begin using Azure Payment HSM
services: payment-hsm
author: msmbaldwin

ms.service: payment-hsm
ms.topic: article
ms.date: 01/30/2024
ms.author: mbaldwin
ms.custom: references_regions
---

# Getting started with Azure Payment HSM

This article provides steps and information necessary to get started with Azure Payment HSM.

1. First, engage with your Microsoft account manager and get your business cases approved by Azure Payment HSM Product Manager.  See [Getting started with Azure Payment HSM](getting-started.md). Ask your Microsoft account manager and Cloud Service Architect (CSA) to send a request [via email](mailto:paymentHSMRequest@microsoft.com).
2. The Azure Payment HSM comes with payShield Manager license so you can remotely manage the HSM; you must have Thales smart cards and card readers for payShield Manager before onboarding Azure payment HSM.  The minimum requirement is one compatible USB Smartcard reader with at least 5 payShield Manager Smartcards. Contact your Thales sales representative for the purchase or using existing compatible smart cards and readers. For more information, see the [Payment HSM support: Prerequisites](support-guide.md#prerequisites).

3. Provide your contact information to the Microsoft account team and the Azure Payment HSM Product Manager [via email](mailto:paymentHSMRequest@microsoft.com), so they can set up your Thales support account.
  
    A Thales Customer ID is created, so you can submit payShield 10K support issues as well as download documentation, software, and firmware from Thales portal. The customer team can use the Thales Customer ID to create individual account access to Thales support portal.

    | Email Form |
    |--|
    |Trading Name:|
    |Full Address:<br><br><br> 
    |Country:|
    |Post Code:|
    |Contact:|
    | Address Type: Civil / Military |
    | Telephone No. (with Country Code): |
    | Is it state owned/governmental: Y / N
    |Located in a Free trade zone: Y / N|
4. You must next engage with the Microsoft CSAs to plan your deployment, and to understand the networking requirements and constraints/workarounds before onboarding the service. For details, see:
    - [Azure Payment HSM deployment scenarios](deployment-scenarios.md)
    - [Solution design for Azure Payment HSM](solution-design.md)
    - [Azure Payment HSM "fastpathenabled" feature flag and tag](fastpathenabled.md)
    - [Azure Payment HSM traffic inspection](inspect-traffic.md)
5. Contact Microsoft support to get your subscription approved and receive feature registration, to access the Azure payment HSM service. See [Register the Azure Payment HSM resource providers](register-payment-hsm-resource-providers.md?tabs=azure-cli). There is no charge at this step.
6. To create payment HSMs, follow the [Tutorials](create-payment-hsm.md) and [How-To Guides](register-payment-hsm-resource-providers.md). Customer billing starts when the HSM resource is created.
7. Upgrade the payShield 10K firmware to their desired version.
8. Review the support process and scope here for Microsoft support and Thales's support: [Azure Payment HSM Service support guide ](support-guide.md).
9. Monitor your payShield 10K using standard SNMP V3 tools. payShield Monitor is another product available to provide continuous monitoring of HSMs. Contact Thales Sales rep for licensing information.

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- Learn how to [Create a payment HSM](create-payment-hsm.md)
- Read the [frequently asked questions](faq.yml)
