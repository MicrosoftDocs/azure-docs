---
title: Azure applications managed application offer publishing guide | Azure Marketplace
description: This article describes the requirements to publish a managed application in the Azure Marketplace.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/22/2020
ms.author: dsindona

---

# Azure Applications: Managed application offer publishing requirements

This article explains the requirements for the managed application offer type, which is one way to publish an Azure application offer in the Azure Marketplace. Managed applications are transact offers that are deployed and billed through the Azure Marketplace. The call to action that a user sees is "Get It Now."

Use the managed application offer type when the following conditions are required:

- You deploy a subscription-based solution for your customer using either a VM or an entire IaaS-based solution.
- You or your customer require that the solution is managed by a partner.

>[!NOTE]
>For example, a partner may be an SI or managed service provider (MSP).  

## Managed Application Offer

|Requirements |Details  |
|---------|---------|
|Deployed to a customer's Azure subscription | Managed Apps must be deployed in the customer's subscription and can be managed by a third party. |
|Billing and metering    |  The resources will be provisioned in the customer's Azure subscription. Pay-as-you-go (PAYGO) virtual machines will be transacted with the customer via Microsoft, billed via the customer's Azure subscription (PAYGO). <br> In the case of bring-your-own-license, while Microsoft will bill infrastructure costs incurred in the customer subscription, you will transact your software licensing fees to the customer directly.        |
|Azure-compatible virtual hard disk (VHD)    |   VMs must be built on Windows or Linux.<ul> <ul> <li>For more information about creating a Linux VHD, see [Linux distributions endorsed on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).</li> <li>For more information about creating a Windows VHD, see [create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md).</li> </ul> |

>[!NOTE]
> Managed apps must be deployable through the Marketplace. If customer communication is a concern, then you should reach out to interested customers after you have enabled lead sharing.  

>[!Note]
>Cloud Solution Providers (CSP) partner channel opt-in is now available. For more information on marketing your offer through the Microsoft CSP partner channels, see [Cloud Solution Providers](./cloud-solution-providers.md).

## Next steps

- If you haven't already done so, [learn](https://azuremarketplace.microsoft.com/sell) about the Azure Marketplace.
- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- [Create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md) for more information.
