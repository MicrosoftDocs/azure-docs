---
title: Standard Contract for Microsoft commercial marketplace
description: Standard Contract for Azure Marketplace and AppSource in Partner Center
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 05/20/2020
ms.author: dsindona
---

# Standard Contract for Microsoft commercial marketplace

Microsoft offers a Standard Contract for Microsoft commercial marketplace. This helps to simplify the procurement process for customers,  reduce legal complexity for software vendors, and facilitate transactions in the marketplace. Rather than crafting custom terms and conditions, as a commercial marketplace publisher, you can choose to offer your software under the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178), which customers only need to vet and accept one time.

The terms and conditions for an offer are defined when creating the offer in Partner Center. You can select to use the Standard Contract for the Microsoft commercial marketplace instead of providing your own custom terms and conditions.

>[!Note]
>Once you publish an offer using the Standard contract for the Microsoft commercial marketplace, you are not able to use your own custom terms and conditions. It is an "or" scenario. You either offer your solution under the Standard Contract *or* your own terms and conditions. If you would like to modify the terms of the Standard Contract you can do so through Standard Contract Amendments.

## Standard Contract Amendments

Standard Contract Amendments allow publishers to select the Standard Contract for simplicity, and with customized terms for their product or business. Customers only need to review the amendments to the contract, if they have already reviewed and accepted the Microsoft Standard Contract.

There are two kinds of amendments available for commercial marketplace publishers:

* Universal Amendments: These amendments are applied universally to the Standard Contract for all customers. Universal amendments are shown to every customer of the offer in the purchase flow. Customers must accept the terms of the Standard Contract and the amendment before they can use your offer.

* Custom Amendments: These amendments are special amendments to the Standard Contract that are targeted to specific customers only via Azure tenant IDs. Publishers can choose the tenant they want to target. Only customers from the tenant will be presented with the custom amendment terms in the offer's purchase flow.  Customers must accept the terms of the Standard Contract and the amendment(s) before they can use your offer.

>[!Note]
>These two types of amendments stack on top of each other. Customers targeted with custom amendments will also get the universal amendment to the Standard Contract during purchase.

You can leverage the Standard Contract for the Microsoft commercial marketplace for the following offer types:  Azure Applications (Solution Templates and Managed Applications), Virtual Machines, and SaaS.

## Customer experience

During the discovery experience in Azure Marketplace or AppSource, customers will be able to see the terms associated with the offer as the Standard Contract for the Microsoft commercial marketplace and any universal amendments.

![The Azure portal customer discovery experience.](media/marketplace-publishers-guide/azure-discovery-process.png)

During the purchase process in the Azure portal, customers will be able to see the terms associated with the offer as the Standard Contract for the Microsoft commercial marketplace and any universal and/or tenant-specific amendments.

![The Azure portal customer purchase experience.](media/marketplace-publishers-guide/azure-purchase-process.png)

## API

Customers may use Get-AzureRmMarketplaceTerms to retrieve the terms of an offer and accept it. The Standard Contract and associated amendments will be returned in the output of the cmdlet.
