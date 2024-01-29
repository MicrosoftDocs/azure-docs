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
# Azure Payment HSM onboarding - high-level process

Here are the steps for on-boarding to Azure Payment HSM:

1. First, engage with your Microsoft account manager and get your business cases approved by Azure Payment HSM Product Manager.  See [Getting started with Azure Payment HSM](getting-started.md). Ask your Microsoft account manager and CSA to send a request via email.
  
2. The Azure Payment HSM comes with payShield Manager license so you canremotely manage the HSM; you must have Thales smart cards and card readers for payShield Manager before onboarding Azure payment HSM.  The minimum requirement is one compatible USB Smartcard reader with at least 5 payShield Manager Smartcards. Contact your Thales sales representative for the purchase or using existing compatible smart cards and readers. For more details, refer to the [Payment HSM frequently asked questions](faq.md).
    
    Compatible smart cards and smart card readers are required to access payShield Manager, and can be ordered directly from Thales: 

  - **Item**: 971-000135-001-000 
  - **Description**: PS10-RMGT-KIT2 - payShield Manager Starter Kit - for software V1.4A (1.8.3) and above 
  - **Items Included**: 2 Thales Card Readers, 30 PayShield Manager Smartcards Compatible smart cards have a blue band and are labeled "payShield Manager Card".      
    
    These are the only smart cards compatible with the ciphers used to enable over-network use. 
  
3. Provide your contact information to the Microsoft account team and the Azure Payment HSM Product Manager [via email](mailto:paymentHSMRequest@microsoft.com). They will set up your Thale's support account.
  
    A Thales Customer ID will be created, so you can submit payShield 10K support issues as well as download documentation, software and firmware from Thales portal. The Thales Customer ID can be used by customer team to create individual account access to Thale support portal.
  
    [email form placeholder]
  
4. You must next engage with the Microsoft CSAs to plan your deployment, and to understand the networking requirements and constraints/workarounds before onboarding the service. For details, see:
  - [Azure Payment HSM deployment scenarios](deployment-scenarios.md)
  - [Solution design for Azure Payment HSM](solution-design.md)
  - [Azure Payment HSM "fastpathenabled" feature flag and tag](fastpathenabled.md)
  - [Azure Payment HSM traffic inspection](inspect-traffic.md)
  
5. Contact Microsoft support to get your subscription approved and receive feature registeration, to access the Azure payment HSM service. See [Register the Azure Payment HSM resource providers](register-payment-hsm-resource-providers.md?tabs=azure-cli). You will not be charged at this step.
6. Follow the Tutorials and How-To Guides to create payment HSMs. Customer billing will start when the HSM resource is created. 
7. Upgrade the payShield 10K firmware to their desired version.
8. Review the support process and scope here for Microsoft support and Thales’s support: [Azure Payment HSM Service support guide ](support.md).

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
