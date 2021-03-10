---
title: How to configure your SaaS offer properties in Microsoft Partner Center
description: Learn how to configure the properties for your software as a service (SaaS) Microsoft commercial marketplace offer in Partner Center. 
author: mingshen-ms
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 09/02/2020
---

# How to configure your SaaS offer properties

This article describes how to configure the properties for a software as a service (SaaS) offer in the Microsoft commercial marketplace.

On the **Properties** tab, you'll define the categories and industries applicable to your offer, your app version, and legal contracts. Be sure to provide complete and accurate details about your offer on this page, so that it's displayed appropriately and offered to the right set of customers.

## Select a category for your offer

Under **Category**, select at least one and up to two categories for grouping your offer into the appropriate marketplace search areas. Based on the categories you choose, we determine which online stores to list your offer on: either Azure Marketplace, Microsoft AppSource, or both.

## Select Industries (optional)

Under **Industries**, you can select up to two industries and up to two sub-industries (also called verticals) for each industry. These industries are used to display your offer when customers filter their search on industries and sub-industries in the online store.

> [!NOTE]
> If your offer isn't industry-specific, leave this section blank.

1. Under **Industries**, select the **+ Industries** link.
1. Select an industry from the **Industry** list.
1. Select at least one and a maximum of two verticals from the **Sub-industries** list. Use the Ctrl key to select multiple sub-industries.
1. To add another industry and vertical, select **+ Industries** and then repeat Steps 1 through 3.

## Specify an app version (optional)

 In the **App version** box, enter a version number. The app version is used in the AppSource marketplace to identify the version number of your offer.

## Provide terms and conditions

Under **Legal**, provide terms and conditions for your offer. You have two options:

- [Use the standard contract with optional amendments](#use-the-standard-contract)
- [Use your own terms and conditions](#use-your-own-terms-and-conditions)

To learn about the standard contract and optional amendments, see [Standard Contract for the Microsoft commercial marketplace](standard-contract.md). You can download the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178) PDF (make sure your pop-up blocker is off).

### Use the standard contract

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a standard contract you can use for your offers in the commercial marketplace. When you offer your software under the standard contract, customers only need to read and accept it one time, and you don't have to create custom terms and conditions.

1. Select the **Use the Standard Contract for Microsoft's commercial marketplace** checkbox.

   ![Illustrates the Use the Standard Contract for Microsoft's commercial marketplace check box.](partner-center-portal/media/use-standard-contract.png)
1. In the **Confirmation** dialog box, select **Accept**. You may have to scroll up to see it.
1. Select **Save draft** before continuing.

   > [!NOTE]
   > After you publish an offer using the Standard Contract for the commercial marketplace, you can't use your own custom terms and conditions. Either offer your solution under the standard contract with optional amendments or under your own terms and conditions.

### Add amendments to the standard contract (optional)

There are two kinds of amendments available: *universal* and *custom*.

#### Add universal amendment terms

In the **Universal amendment terms to the standard contract for Microsoft's commercial marketplace** box, enter your universal amendment terms. You can enter an unlimited number of characters in this box. These terms are displayed to customers in AppSource, Azure Marketplace, and/or Azure portal during the discovery and purchase flow.

#### Add one or more custom amendments

1. Under **Custom amendments terms to the Standard Contract for Microsoft's commercial marketplace**, select the **Add custom amendment term (Max 10)** link.
1. In the **Custom amendment terms** box, enter your amendment terms.
1. In the **Tenant ID** box, enter a tenant ID. Only customers associated with the tenant IDs you specify for these custom terms will see them in the offer's purchase flow in the Azure portal.
   > [!TIP]
   > A tenant ID identifies your customer in Azure. You can ask your customer for this ID and they can find it by going to [**https://portal.azure.com**](https://portal.azure.com) > **Azure Active Directory** > **Properties**. The directory ID value is the tenant ID (for example, `50c464d3-4930-494c-963c-1e951d15360e`). You can also look up the organization's tenant ID of your customer by using their domain name URL at [What is my Microsoft Azure and Office 365 tenant ID?](https://www.whatismytenantid.com/).
1. In the **Description** box, optionally enter a friendly description for the tenant ID. This description helps you identify the customer you're targeting with the amendment.
1. To add another tenant ID, select the **Add a customer's tenant ID** link and repeat steps 3 and 4. You can add up to 20 tenant IDs.
1. To add another amendment term, repeat steps 1 through 5. You can provide up to ten custom amendment terms per offer. 
2. Select **Save draft** before continuing.

### Use your own terms and conditions

You can choose to provide your own terms and conditions, instead of the standard contract. Customers must accept these terms before they can try your offer.

1. Under **Legal**, make sure the **Use the Standard Contract for Microsoft's commercial marketplace** check box is cleared.
1. In the **Terms and conditions** box, enter up to 10,000 characters of text.
1. Select **Save draft** before continuing to the next tab, **Offer listing**.

## Next steps

- [How to configure your SaaS offer listing details](create-new-saas-offer-listing.md)
