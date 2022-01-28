---
title: Getting started with Azure Payment HSM
description: Information to begin using Azure Payment HSM
services: payment-hsm
author: msmbaldwin

tags: azure-resource-manager
ms.service: payment-hsm
ms.workload: security
ms.topic: concepts
ms.date: 01/25/2022
ms.author: mbaldwin
---

# Getting started with Azure Payment HSM

To get started with Azure Payment PSH (preview), request access [via email](mailto:paymentHSMRequest@microsoft.com). Upon approval, you will be provided with onboarding instructions 

## Availability

The Azure Public Preview is currently available in **East US** and **North Europe**.

## Prerequisites 

Azure Payment HSM customers must have the following:

- Access to the Thales Customer Portal (Customer ID)
- Thales smart cards and card reader for payShield Manager

## Cost

The HSM devices will be charged based on the service pricing page. All other Azure resources for networking and virtual machines will incur regular Azure costs too.

## payShield customization considerations

If you are using payShield on-prem today with a custom firmware a porting exercise is required to update the firmware to a version compatible with the Azure deployment. Please contact your Thales account manager to request a quote.
Please ensure that the following information is provided:
- Customization hardware platform (e.g., payShield 9000 or payShield 10K)
- Customization firmware number

## Support

Microsoft will provide support for hardware issues, networking issues and provisioning through standard support. Support ticket can be created from Azure portal use Service Type -> Dedicated HSM (under Security category) and mention "Payment HSM" in the summary field.  All support cases in public preview will be severity 3 only.

:::image type="content" source="./media/support.png" alt-text="Screenshot of filing a support ticket for Payment HSM":::
 
For application-level support (client software, HSM configuration, backup etc.), contact Thales support.

Customers are responsible for applying payShield security patches and upgrading payShield firmware for the allocated HSMs.

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)


