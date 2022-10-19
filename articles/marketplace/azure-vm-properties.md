---
title: Configure virtual machine offer properties on Azure Marketplace
description: Configure virtual machine offer properties on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
msreviewer: amhindma
ms.date: 11/10/2021
---

# Configure virtual machine offer properties

On the **Properties** page (select from the left-nav menu in Partner Center), you define the categories used to group your virtual machine (VM) offer on Azure Marketplace and the legal contracts that support your offer.

## Select a category

Select categories and subcategories to place your offer in the appropriate Azure Marketplace search areas. Be sure to describe later in the offer description how your offer supports these categories.

- Select a Primary category.
- To add a second optional category (Secondary), select the **+Categories** link.
- Select up to two subcategories for the Primary and/or Secondary category. Use Ctrl+click to select a second subcategory. If no subcategory is applicable to your offer, then **Not applicable** is automatically selected.

See the full list of categories and subcategories in [Categories and subcategories in the commercial marketplace](categories.md). Virtual machine offers always appear under the **Compute** category on Azure Marketplace.

## Provide terms and conditions

Under **Legal**, provide terms and conditions for your offer. You have two options:

- [Use the standard contract with optional amendments](#use-the-standard-contract)
- [Use your own terms and conditions](#use-your-own-terms-and-conditions)

To learn about the standard contract and optional amendments, see [Standard Contract for the Microsoft commercial marketplace](standard-contract.md). You can download the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178) PDF (make sure your pop-up blocker is off).

### Use the standard contract

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a standard contract you can use for your offers in the commercial marketplace. When you offer your software under the standard contract, customers only need to read and accept it one time, and you don't have to create custom terms and conditions. To learn more about the customer experience during the discovery and purchase process, see [Standard Contract for Microsoft commercial marketplace](standard-contract.md#customer-experience).

1. Select the **Use the Standard Contract for Microsoft's commercial marketplace** check box.

1. In the **Confirmation** dialog box, select **Accept**. Depending on the size of your screen, you may have to scroll up to see it.
1. Select **Save draft** before continuing.

   > [!NOTE]
   > After you publish an offer using the Standard Contract for the commercial marketplace, you can't use your own custom terms and conditions. Either offer your solution under the standard contract with optional amendments or under your own terms and conditions.

#### Add amendments to the standard contract (optional)

There are two kinds of amendments available: *universal* and *custom*.

##### Add universal amendment terms

In the **Universal amendment terms to the standard contract for Microsoft's commercial marketplace** box, enter your universal amendment terms. You can enter an unlimited number of characters in this box. These terms are displayed to customers in AppSource, Azure Marketplace, and/or Azure portal during the discovery and purchase flow.

##### Add one or more custom amendments

Custom amendments are special amendments to the Standard Contract that are targeted to specific customers using Azure tenant IDs. Only customers from the tenant will be presented with the custom amendment terms when they purchase the offer.

> [!NOTE]
> Customers targeted with custom amendments will also get the universal amendment (if any) to the Standard Contract during purchase.

1. Under **Custom amendments terms to the Standard Contract for Microsoft's commercial marketplace**, select the **Add custom amendment term (Max 10)** link.
2. Enter your **Custom amendment terms** in the box.
3. Enter the **Tenant ID** in the box.

   > [!TIP]
   > A tenant ID identifies your customer in Azure. You can ask your customer for this ID and they can find it by going to [**https://portal.azure.com**](https://portal.azure.com) > **Azure Active Directory** > **Properties**. The directory ID value is the tenant ID (for example, `50c464d3-4930-494c-963c-1e951d15360e`). You can also look up the organization's tenant ID of your customer by using their domain name URL at [What is my Microsoft Azure and Office 365 tenant ID?](https://www.whatismytenantid.com/).

4. Optionally, enter a friendly **Description** for the tenant ID. This description helps you identify the customer you're targeting with the amendment.
5. To add another tenant ID, select the **Add a customer's tenant ID (Max 10)** link and repeat steps 3 and 4. You can add up to 10 tenant IDs.
6. To add another amendment term, repeat steps 1 through 5. You can provide up to 10 custom amendment terms per offer.
7. Select **Save draft** before continuing.

### Use your own terms and conditions

You may provide your own terms and conditions instead of using the standard contract. Customers must accept these terms before they can try your offer.

1. Under **Legal**, clear the **Use the Standard Contract for Microsoft's commercial marketplace** check box.
1. In the **Terms and conditions** box, enter up to 10,000 characters of text.

   > [!NOTE]
   > If you require a longer description, enter a single web address that points to where your terms and conditions can be found. It will be displayed to customers as an active link.

1. Select **Save draft** before continuing to the next tab in the left-nav menu, **Offer listing**.

## Next steps

- [Configure VM offer listing](azure-vm-offer-listing.md)
