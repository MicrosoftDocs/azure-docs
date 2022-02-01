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
---

# Getting started with Azure Payment HSM

To get started with Azure Payment HSM (preview), please contact your Microsoft sales representative and request access [via email](mailto:paymentHSMRequest@microsoft.com). Upon approval, you will be provided with onboarding instructions.

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

There is no service-level agreement (SLA) for this public preview.  Use of this service for production workloads is not supported

The HSM base firmware installed in public preview is Thales payShield10K base software version 1.4a 1.8.3.

Microsoft will provide support for hardware issues, networking issues, and provisioning issues. Support tickets can be created from the Azure portal. Select **Dedicated HSM** as the Service Type, and mention "payment HSM" in the summary field, with a severity case of B or C.

Support through engineering escalation is only available during business hours: Monday - Friday, 9 AM - 5 PM PST.

Thales only provides application-level support,  such as client software, HSM configuration, and backup.

Customers are responsible for applying payShield security patches and upgrading payShield firmware for their provisioned HSMs. Thales payShield10K versions prior to 1.4a 1.8.3. are not supported

Microsoft will apply payShield security patches to unallocated HSMs.

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)


