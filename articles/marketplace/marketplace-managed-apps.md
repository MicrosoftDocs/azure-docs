---
title: Azure applications managed application offer publishing guide - Azure Marketplace
description: This article describes the requirements for publishing a managed application in Azure Marketplace.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/22/2020
ms.author: dsindona

---

# Publishing guide for Azure managed applications

An Azure *managed application* offer is one way to publish an Azure application in Azure Marketplace. Managed applications are transact offers that are deployed and billed through Azure Marketplace. The call to action that a user sees is *Get It Now*.

This article explains the requirements for the managed application offer type.

Use the managed application offer type under the following conditions:

- You're deploying a subscription-based solution for your customer by using either a virtual machine (VM) or an entire infrastructure as a service (IaaS)-based solution.
- You or your customer requires the solution to be managed by a partner.

>[!NOTE]
>For example, a partner can be a systems integrator or a managed service provider (MSP).  

## Managed application offer requirements

|Requirements |Details  |
|---------|---------|
|An Azure subscription | Managed applications must be deployed to a customer's subscription, but they can be managed by a third party. |
|Billing and metering    |  The resources are provided in a customer's Azure subscription. VMs that use the pay-as-you-go payment model are transacted with the customer via Microsoft and billed via the customer's Azure subscription. <br><br> For bring-your-own-license VMs, Microsoft bills any infrastructure costs that are incurred in the customer subscription, but you transact software licensing fees with the customer directly.        |
|An Azure-compatible virtual hard disk (VHD)    |   VMs must be built on Windows or Linux.<br><br>For more information about creating a Linux VHD, see [Linux distributions endorsed on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).<br><br>For more information about creating a Windows VHD, see [create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md). |

---

> [!NOTE]
> Managed applications must be deployable through Azure Marketplace. If customer communication is a concern, reach out to interested customers after you've enabled lead sharing.  

> [!Note]
> A Cloud Solution Provider (CSP) partner channel opt-in is now available. For more information about marketing your offer through the Microsoft CSP partner channels, see [Cloud Solution Providers](./cloud-solution-providers.md).

## Next steps

If you haven't already done so, learn how to [Grow your cloud business with Azure Marketplace](https://azuremarketplace.microsoft.com/sell).

To register for and start working in Partner Center:

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- See [Create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md) for more information.
