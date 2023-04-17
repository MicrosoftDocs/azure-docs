---
title: What is Azure Payment HSM?
description: Learn how Azure Payment HSM is an Azure service that provides cryptographic key operations for real-time, critical payment transactions
services: payment-hsm
author: msmbaldwin
tags: azure-resource-manager

ms.service: payment-hsm
ms.workload: security
ms.topic: overview
ms.date: 01/20/2022
ms.author: mbaldwin


---
# What is Azure Payment HSM?

Azure Payment HSM is a "BareMetal" service delivered using [Thales payShield 10K payment hardware security modules (HSM)](https://cpl.thalesgroup.com/encryption/hardware-security-modules/payment-hsms/payshield-10k)—physical devices that provide cryptographic key operations for real-time, critical payment transactions in the Azure cloud. Azure Payment HSM is designed specifically to help a service provider and an individual financial institution accelerate their payment system's digital transformation strategy and adopt the public cloud. It meets the most stringent security, audit compliance, low latency, and high-performance requirements by the Payment Card Industry (PCI).

Payment HSMs are provisioned and connected directly to users' virtual network, and HSMs are under users' sole administration control. HSMs can be easily provisioned as a pair of devices and configured for high availability. Users of the service utilize [Thales payShield Manager](https://cpl.thalesgroup.com/encryption/hardware-security-modules/payment-hsms/payshield-manager) for secure remote access to the HSMs as part of their Azure-based subscription. Multiple subscription options are available to satisfy a broad range of performance and multiple application requirements that can be upgraded quickly in line with end-user business growth. Azure payment HSM service offers highest performance level 2500 CPS.

Payment HSM devices are a variation of [Dedicated HSM](../dedicated-hsm/index.yml) devices, with more advanced cryptographic modules and features; for example, a payment HSM never decrypts the PIN value in transit.

The Azure Payment HSM solution uses hardware from [Thales](https://cpl.thalesgroup.com/encryption/hardware-security-modules/payment-hsms/payshield-10k) as a vendor. Customers have [full control and exclusive access](overview.md#customer-managed-hsm-in-azure) to the Payment HSM.

> [!IMPORTANT]
> Azure Payment HSM a highly specialized service. We highly recommend that you review the [Azure Payment HSM pricing page](https://azure.microsoft.com/services/payment-hsm/) and [Getting started with Azure Payment HSM](getting-started.md#support).

## Why use Azure Payment HSM?

Momentum is building as financial institutions move some or all of their payment applications to the cloud, requiring a migration from the legacy on-premises applications and HSMs to a cloud-based infrastructure that isn't generally under their direct control. Often it means a subscription service rather than perpetual ownership of physical equipment and software. Corporate initiatives for efficiency and a scaled-down physical presence are the drivers for this shift. Conversely, with cloud-native organizations, the adoption of cloud-first without any on-premises presence is their fundamental business model. Whatever the reason, end users of a cloud-based payment infrastructure expect reduced IT complexity, streamlined security compliance, and flexibility to scale their solution seamlessly as their business grows.

The cloud offers significant benefits, but challenges when migrating a legacy on-premises payment application (involving payment HSMs) to the cloud must be addressed:

- Shared responsibility and trust – what potential loss of control in some areas is acceptable?
- Latency – how can an efficient, high-performance link between the application and HSM be achieved?
- Performing everything remotely – what existing processes and procedures may need to be adapted?
- Security certifications and audit compliance – how will current stringent requirements be fulfilled?

Azure Payment HSM addresses these challenges and delivers a compelling value proposition to users of the service through the following features.

### Enhanced security and compliance

End users of the service can use Microsoft security and compliance investments to increase their security posture. Microsoft maintains PCI DSS and PCI 3DS compliant Azure data centers, including those which house Azure Payment HSM solutions. The Azure Payment HSM solution can be deployed as part of a validated PCI P2PE / PCI PIN component or solution, helping to simplify ongoing security audit compliance. Thales payShield 10K HSMs deployed in the security infrastructure are certified to FIPS 140-2 Level 3 and PCI HSM v3.

### Customer-managed HSM in Azure

The Azure Payment HSM is a part of a subscription service that offers single-tenant HSMs for the service customer to have complete administrative control and exclusive access to the HSM. The customer could be a payment service provider acting on behalf of multiple financial institutions or a financial institution that wishes to directly access the Azure Payment HSM service. Once the HSM is allocated to a customer, Microsoft has no access to customer data. Likewise, when the HSM is no longer required, customer data is zeroized and erased as soon as the HSM is released, to ensure complete privacy and security is maintained. The customer is responsible for ensuring sufficient HSM subscriptions are active to meet their requirements for backup, disaster recovery, and resilience to achieve the same performance available on their on-premises HSMs.

### Accelerate digital transformation and innovation in cloud

For existing Thales payShield customers wishing to add a cloud option, the Azure Payment HSM solution offers native access to a payment HSM in Azure for "lift and shift" while still experiencing the low latency they're accustomed to via their on-premises payShield HSMs. The solution also offers high-performance transactions for mission-critical payment applications. 

Customers can continue their digital transformation strategy by using technology innovation in the cloud. Existing Thales payShield customers can utilize their existing remote management solutions (payShield Manager and payShield TMD together with associated smart card readers and smart cards as appropriate) to work with the Azure Payment HSM service. Customers new to payShield can source the hardware accessories from Thales or one of its partners before deploying their HSM as part of the subscription service.

## Typical use cases

With benefits including low latency and the ability to quickly add more HSM capacity as required, the cloud service is a perfect fit for a broad range of use cases, including:

- Payment processing
- Card & mobile payment authorization
- PIN & EMV cryptogram validation
- 3D-Secure authentication

Payment credential issuing:

- Cards
- Mobile secure elements
- Wearables
- Connected devices
- Host card emulation (HCE) applications

Securing keys & authentication data:

- POS, mPOS & SPOC key management
- Remote key loading (for ATM & POS/mPOS devices)
- PIN generation & printing
- PIN routing

Sensitive data protection:

- Point-to-point encryption (P2PE)
- Security tokenization (for PCI DSS compliance)
- EMV payment tokenization

## Suitable for both existing and new payment HSM users

The solution provides clear benefits for both Payment HSM users with a legacy, on-premises HSM footprint, and those new payment ecosystem entrants with no legacy infrastructure to support and who may choose a cloud-native approach from the outset.

Benefits for existing on-premises HSM users:

- Requires no modifications to payment applications or HSM software to migrate existing applications to the Azure solution
- Enables more flexibility and efficiency in HSM utilization
- Simplifies HSM sharing between multiple teams, geographically dispersed
- Reduces physical HSM footprint in their legacy data centers
- Improves cash flow for new projects

Benefits for new payment participants:

- Avoids introduction of on-premises HSM infrastructure
- Lowers upfront investment via the Azure subscription model
- Offers access to latest certified hardware and software on-demand

## Supported SKUs

Azure Payment HSM supports the following SKUs:

- payShield10K_LMK1_CPS60
- payShield10K_LMK1_CPS250
- payShield10K_LMK1_CPS2500
- payShield10K_LMK2_CPS60
- payShield10K_LMK2_CPS250
- payShield10K_LMK2_CPS2500

## Glossary

| Term | Definition |
|---|---|
| 3DS | 3D Secure |
| ATM | Automated Teller Machine |
| EMV | Euro Mastercard Visa |
| FIPS | Federal Information Processing Standards |
| HCE | Host Card Emulation |
| HSM | Hardware Security Module |
| mPOS | Mobile Point of Sale |
| P2PE | Point-to-Point Encryption |
| PCI | Payment Card Industry |
| PIN | Personal Identification Number |
| POS | Point of Sale |
| SPOC | Software-based PIN Entry on Commercial off the Shelf (COTS) Solutions |
| TMD | payShield Trusted Management Device |

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
