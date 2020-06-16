---
title: Create a new SaaS offer for the Microsoft commercial marketplace 
description: How to create a new Software as a Service (SaaS) offer for listing or selling in Microsoft AppSource, Azure Marketplace, or through the Cloud Solution Provider (CSP) program using the Microsoft commercial marketplace program in Microsoft Partner Center. 
author: dannyevers 
ms.author: mingshen-ms
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 06/25/2020
---

# Create a SaaS offer in the commercial marketplace

As a commercial marketplace publisher, you can create a software as a service (SaaS) offer so potential customers can buy your SaaS-based technical solution. This article explains the process to create and publish a SaaS offer to the Microsoft commercial marketplace.

## Before you begin
If you haven’t already done so, read [Plan a SaaS offer](plan-saas-offer.md). It will help you understand the technical requirements for your SaaS app, and the information and assets you’ll need when you create your offer.

> [!IMPORTANT]
> Unless you plan to publish a simple listing (**Contact me** call-to-action) in the commercial marketplace, your SaaS application must meet technical requirements around authentication. For detailed information, see [Plan a SaaS offer](plan-saas-offer.md).

## Create a new SaaS offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
1. In the left-navigation menu, select **Commercial Marketplace** > **Overview**.
1. On the **Overview** tab, select **+ New offer** > **Software as a Service**.

   :::image type="content" source="partner-center-portal/media/new-offer-saas.png" alt-text="Illustrates the left-navigation menu and the New offer list.":::

1. In the **New offer** dialog box, enter an **Offer ID**. This ID is visible in the URL of the commercial marketplace listing and Azure Resource Manager templates, if applicable.
   + Each offer in your account must have a unique offer ID.
   + Use only lowercase letters and numbers. It can include hyphens and underscores, but no spaces, and is limited to 50 characters. For example, if you enter **test-offer-1** in this box, the offer web address will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.
   + The offer ID can't be changed after you select **Create**.

1. Enter an **Offer alias**. This is the name used for the offer in Partner Center.

   + This name isn't visible in the commercial marketplace and it’s different from the offer name and other values shown to customers.
   + The offer alias can't be changed after you select 
  **Create**.
1. To generate the offer and continue, select **Create**.

## Configure your SaaS offer setup details

On the **Offer setup** tab, under **Setup details**, you’ll choose whether to sell your offer through Microsoft or manage your transactions independently. For more information on these options, see [Plan a SaaS offer](plan-saas-offer.md#publishing-options-and-requirements) and [Determine your publishing option](determine-your-listing-type.md).

1. To sell through Microsoft and have us host transactions for you, select **Yes**. Continue to [Enable a test drive](#enable-a-test-drive).

1. To list your offer through the commercial marketplace and process transactions independently, select **No**, and then do one of the following:
   + To provide a free subscription for your offer, select **Get it now (Free)**. Then in the **Offer URL** box that appears, enter the URL (beginning with *http* or *https*) where customers can get a trial through [one-click authentication by using Azure Active Directory (Azure AD)](marketplace-saas-applications-technical-publishing-guide.md#using-azure-active-directory-to-enable-trials). For example, `https://contoso.com/saas-app`.
   + To provide a 30-day free trial, select **Free trial**, and then in the **Trial URL** box that appears, enter the URL (beginning with *http* or *https*) where customers can access your free trial through [one-click authentication by using Azure Active Directory (Azure AD)](marketplace-saas-applications-technical-publishing-guide.md#using-azure-active-directory-to-enable-trials). For example, `https://contoso.com/trial/saas-app`.<br>
     > [!NOTE]
     > Offer listing free trials are created, managed, and configured by your service and do not have subscriptions managed by Microsoft.
   + To have potential customers contact you to purchase your offer, select **Contact me**.

### Enable a test drive
A test drive is a great way to showcase your offer to potential customers by giving them the option to "try before they buy". Offering a test drive results in an increased conversion rate and generates highly qualified leads. To Learn more about test drives, see [Learn about test drive for your offer](partner-center-portal/test-drive.md).

For more information about test drive, see these resources:
   + [Marketing best practices](/cloud-partner-portal/test-drive/marketing-and-best-practices.md)
   + [Technical best practices](https://github.com/Azure/AzureTestDrive/wiki/Test-Drive-Best-Practices)
   + [Test drives overview](https://assetsprod.microsoft.com/mpn/azure-marketplace-appsource-test-drives.pdf) PDF (make sure your pop-up blocker is off)

**To enable a test drive for a fixed period**
1.	Under **Test drive**, select the **Enable a test drive** check box. 
1.	Select the test drive type from the list that appears.

### Configure lead management
Connect your Customer Relationship Management (CRM) system with your commercial marketplace offer so you can receive customer contact information when a customer expresses interest or deploys your product. You can modify this connection at any time during or after you create the offer. For detailed guidance, see [Lead management for commercial marketplace](lead-management-for-cloud-marketplace.md).

**To configure the connection details in Partner Center**
1.	Under **Customer leads**, select the **Connect** link.
1.	In the **Connection details** dialog box, select a lead destination from the list.
1.	Complete the fields that appear.
1.	To validate the configuration you provided, select the **Validate** link.
1.	To close the dialog box, select **OK**.

### Add URLs to related Office add-ins

1. If the **Related add-ins** section is shown, do one of the following:

   - To specify an AppSource URL for Office add-ins that utilize your SaaS offer, select **Yes**. Then select **+ Add another AppSource URL**, and enter the URL in the box.
   - If you don't have add-ins to link, then select **No**.

1. Select **Save draft** before continuing to the next tab, **Properties**.

## Configure your SaaS offer properties

On the **Properties** tab, you'll define the following:

- Categories and industries used to group your offer on the marketplaces.
- Your app version. Customers will see this on the details page of the offer's listing.
- The legal contracts that support your offer.

### Select a category for your offer

- Under **Category**, select at least one and up to two categories for grouping your offer into the appropriate marketplace search areas.

### Select Industries (optional)

Under **Industries**, you can select up to two industries and up to two sub-industries (also called verticals) for each industry. These industries are used to display your offer when customers filter their search on industries and sub-industries in the storefront.

> [!NOTE]
> If your offer isn't industry-specific, leave this section blank.

**To select industries and sub-industries**

1. Under **Industries**, select the **+ Industries** link.
1. Select an industry from the **Industry** list.
1. Select at least one and a maximum of two verticals from the **Sub-industries** list.<br>
   > [!TIP]
   > Use the Ctrl key to select multiple sub-industries.
1. To add another industry and vertical, select **+ Industries** and then repeat steps 1 through 3.

### Specify an app version (optional)

The app version is used in the AppSource marketplace to identify the version number of your offer.

- To add a version number, enter it in the **App version** box.

### Provide terms and conditions

Under **Legal**, provide terms and conditions for your offer. You have two options:

- [Use the Standard Contract with optional amendments](#use-the-standard-contract-with-optional-amendments)
- [Use your own terms and conditions](#use-your-own-terms-and-conditions)

To learn about the standard contract and optional amendments, see [Standard Contract for Microsoft commercial marketplace](standard-contract.md). You can download the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178) PDF (make sure your pop-up blocker is off).

#### Use the Standard Contract with optional amendments

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a standard contract you can use for your offers in the commercial marketplace. When you offer your software under the standard contract, customers only need to read and accept it one time, and you don't have to create custom terms and conditions.

**To use the Standard contract**

1. Select the **Use the Standard Contract for Microsoft's commercial marketplace** checkbox.<br><br>
   ![Illustrates the Use the Standard Contract for Microsoft's commercial marketplace check box.](partner-center-portal/media/use-standard-contract.png)
1. In the **Confirmation** dialog box, select **Accept**. You may have to scroll up to see it.
1. Select **Save draft** before continuing.

   > [!NOTE]
   > After you publish an offer using the Standard Contract for the commercial marketplace, you can't use your own custom terms and conditions. Either offer your solution under the standard contract or under your own terms and conditions.

##### Standard contract amendments

There are two kinds of amendments available: *universal* and *custom*.

**To add universal amendment terms**

- In the **Universal amendment terms to the standard contract for Microsoft's commercial marketplace** box, enter your universal amendment terms.

   > [!NOTE]
   > You can enter an unlimited number of characters in this box. These terms are displayed to customers in AppSource, Azure Marketplace, and/or Azure portal during the discovery and purchase flow.

**To add one or more custom amendments**

1. Under **Custom amendments terms to the Standard Contract for Microsoft's commercial marketplace**, select the **Add custom amendment term (Max 10)** link.
1. In the **Custom amendment terms** box, enter your amendment terms.
1. In the **Tenant ID** box, enter a tenant ID. 
   > [!TIP]
   > A tenant ID identifies your customer in Azure. You can ask your customer for this ID and they can find it by going to [**https://portal.azure.com**](https://portal.azure.com) > **All services** > **Azure Active Directory**. The directory ID value is the tenant ID (for example, `50c464d3-4930-494c-963c-1e951d15360e`). You can also look up the organization's tenant ID of your customer by using their domain name URL at [What is my Microsoft Azure and Office 365 tenant ID?](https://www.whatismytenantid.com/).
1. In the **Description** box, optionally enter a friendly description for the tenant ID. This description helps you identify the customer you're targeting with the amendment.
1. To add another tenant ID, select the **Add a customer's tenant ID** link and repeat steps 3 and 4.<br>
   > [!NOTE]
   > You can add up to 20 tenant IDs.
1. To add another amendment term, repeat steps 1 through 5.
   > [!NOTE]
   > You can provide up to ten custom amendment terms per offer. Only customers associated with the tenant IDs you specify for these custom terms will see them in the offer's purchase flow in the Azure portal.
1. Select **Save draft** before continuing.

#### Use your own terms and conditions

You can choose to provide your own terms and conditions, instead of the standard contract. Customers must accept these terms before they can try your offer.

**To use your own custom terms and conditions**

1. Under **Legal**, make sure the **Use the Standard Contract for Microsoft's commercial marketplace** check box is cleared.
2. In the **Terms and conditions** box, enter up to 10,000 characters of text.

   > [!NOTE]
   > If you require a longer description, enter a single web address that points to where your terms and conditions can be found. It will be displayed to customers as an active link.

1. Select **Save draft** before continuing to the next tab, **Offer listing**.
 
## Next steps
- [Configure your SaaS offer listing details](create-new-saas-offer-listing.md)