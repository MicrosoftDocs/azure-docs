---
title: Configure virtual machine offer properties on Azure Marketplace
description: Learn how to configure virtual machine offer properties on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: emuench
ms.author: mingshen
ms.date: 10/16/2020
---

# Configure virtual machine offer properties

On the **Properties** page, you define the categories that are used to group your offer on Azure Marketplace, your application version, and the legal contracts that support your offer.

## Category

Select categories and subcategories to place your offer in the appropriate marketplace search areas. Be sure to describe how your offer supports these categories in the offer description. Select:

- At least one and up to two categories, including a primary and a secondary category (optional).
- Up to two subcategories for each primary and/or secondary category. If no subcategory is applicable to your offer, select **Not applicable**.

See the full list of categories and subcategories in [Offer Listing Best Practices](gtm-offer-listing-best-practices.md). Virtual machine offers always appear under the **Compute** category on Azure Marketplace.

## Legal

You must provide offer terms and conditions to your customers. You have two options: use your own terms and conditions, or use the Standard Contract for the Microsoft commercial marketplace.

- **Use your own terms and conditions**

   To provide your own custom terms and conditions, enter up to 10,000 characters of text in the **Terms and conditions** box. If you require a longer description, enter a single web address for your terms and conditions. It will be displayed to customers as an active link.

   Your customers must accept these terms before they can try your offer.

- **Use the Standard Contract for the Microsoft commercial marketplace**

   To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a Standard Contract for the commercial marketplace. When you offer your software under the Standard Contract, customers need to read and accept it only once, and you don't have to creating custom terms and conditions.

   Use the Standard Contract by selecting the **Use the Standard Contract for Microsoft's commercial marketplace** check box and then, in the pop-up window, select **Accept** (you might have to scroll up to view it).

   ![Screenshot showing the Legal pane in Partner Center with the "Use the Standard Contract for Microsoft's commercial marketplace" check box.](media/use-standard-contract.png)

  > [!NOTE]
  > After you publish an offer by using the Standard Contract for the commercial marketplace, you can't use your own custom terms and conditions. You can offer a solution under either the Standard Contract or your own terms and conditions.

  For more information, see [Standard Contract for the Microsoft commercial marketplace](standard-contract.md). Download the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178) PDF file (make sure your pop-up blocker is turned off).

  ## Standard Contract amendments

  Standard Contract amendments let you select the Standard Contract terms for simplicity and create the terms for your product or business. Customers need to review the amendments to the contract only if they've already reviewed and accepted the Microsoft Standard Contract. There are two types of amendments:

  * **Universal amendments**: These amendments are applied universally to the Standard Contract for all customers. They are shown to every customer of the offer in the purchase flow. Customers must accept the terms of the Standard Contract and the amendments before they can use your offer. You can provide a single universal amendment per offer. You can enter an unlimited number of characters in this box. These terms are displayed to customers in AppSource, Azure Marketplace, and/or the Azure portal during the discovery and purchase flow.

  * **Custom amendments**: These special amendments to the Standard Contract are targeted to specific customers through Azure tenant IDs. You can choose the tenant you want to target. Only customers from the tenant are presented with the custom amendment terms in the offer's purchase flow. Customers must accept the terms of the Standard Contract and the amendments before they can use your offer.

    1. Start by selecting **Add custom amendment terms (Max 10)**. You can provide up to ten custom amendment terms per offer. Do the following:

       a. Enter your own amendment terms in the **Custom amendment terms** box. You can enter an unlimited number of characters. Only customers from the tenant IDs that you specify for these custom terms will see them in the offer's purchase flow in the Azure portal.

       b. (Required) Provide **Tenant IDs**. Each custom amendment can be targeted to up to 20 tenant IDs. If you add a custom amendment, you must provide at least one tenant ID, which identifies your customer in Azure. Your customer can find this for you in Azure by selecting **Azure Active Directory** > **Properties**. The directory ID value is the tenant ID (for example, 50c464d3-4930-494c-963c-1e951d15360e). You can also find the organization's tenant ID of your customer by using their domain name web address at [What is my Microsoft Azure and Microsoft 365 tenant ID?](https://www.whatismytenantid.com/).

       c. (Optional) Provide a friendly **Description** for the tenant ID, one that helps you identify the customer that you're targeting with the amendment.

        > [!NOTE]
        > These two types of amendments are paired with each other. Customers who are targeted with custom amendments will also get the universal amendments to the Standard Contract during the purchase.

    1. Select **Save draft** before you continue.

## Next steps

- [Configure VM offer listing](azure-vm-create-listing.md)
