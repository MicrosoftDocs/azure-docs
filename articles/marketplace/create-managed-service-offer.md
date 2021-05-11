---
title: How to create a Managed Service offer in the Microsoft commercial marketplace 
description: Learn how to create a new Managed Service offer for Azure Marketplace using the commercial marketplace program in Microsoft Partner Center. 
author: Microsoft-BradleyWright
ms.author: brwrigh
ms.reviewer: anbene
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 12/23/2020
---

# How to create a Managed Service offer for the commercial marketplace

This article explains how to create a Managed Service offer for the Microsoft commercial marketplace using Partner Center.

To publish a Managed Service offer, you must have earned a Gold or Silver Microsoft Competency in Cloud Platform. If you haven’t already done so, read [Plan a Managed Service offer for the commercial marketplace](./plan-managed-service-offer.md). It will help you prepare the assets you need when you create the offer in Partner Center.

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
2. In the left-navigation menu, select **Commercial Marketplace** > **Overview**.
3. On the Overview tab, select **+ New offer** > **Managed Service**.

:::image type="content" source="./media/new-offer-managed-service.png" alt-text="Illustrates the left-navigation menu.":::

4. In the **New offer** dialog box, enter an **Offer ID**. This is a unique identifier for each offer in your account. This ID is visible in the URL of the commercial marketplace listing and Azure Resource Manager templates, if applicable. For example, if you enter test-offer-1 in this box, the offer web address will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.

    * Each offer in your account must have a unique offer ID.
    * Use only lowercase letters and numbers. It can include hyphens and underscores, but no spaces, and is limited to 50 characters.
    * The Offer ID can't be changed after you select **Create**.

5. Enter an **Offer alias**. This is the name used for the offer in Partner Center. It isn't visible in the online stores and is different from the offer name shown to customers.
6. To generate the offer and continue, select **Create**.

## Configure lead management

Connect your customer relationship management (CRM) system with your commercial marketplace offer so you can receive customer contact information when a customer expresses interest in your consulting service. You can modify this connection at any time during or after you create the offer. For detailed guidance, see [Customer leads from your commercial marketplace offer](./partner-center-portal/commercial-marketplace-get-customer-leads.md).

To configure the lead management in Partner Center:

1. In Partner Center, go to the **Offer setup** tab.
2. Under **Customer leads**, select the **Connect** link.
3. In the **Connection details** dialog box, select a lead destination from the list.
4. Complete the fields that appear. For detailed steps, see the following articles:

    * [Configure your offer to send leads to the Azure table](./partner-center-portal/commercial-marketplace-lead-management-instructions-azure-table.md#configure-your-offer-to-send-leads-to-the-azure-table)
    * [Configure your offer to send leads to Dynamics 365 Customer Engagement](./partner-center-portal/commercial-marketplace-lead-management-instructions-dynamics.md#configure-your-offer-to-send-leads-to-dynamics-365-customer-engagement) (formerly Dynamics CRM Online)
    * [Configure your offer to send leads to HTTPS endpoint](./partner-center-portal/commercial-marketplace-lead-management-instructions-https.md#configure-your-offer-to-send-leads-to-the-https-endpoint)
    * [Configure your offer to send leads to Marketo](./partner-center-portal/commercial-marketplace-lead-management-instructions-marketo.md#configure-your-offer-to-send-leads-to-marketo)
    * [Configure your offer to send leads to Salesforce](./partner-center-portal/commercial-marketplace-lead-management-instructions-salesforce.md#configure-your-offer-to-send-leads-to-salesforce)

5. To validate the configuration you provided, select the **Validate link**.
6. When you’ve configured the connection details, select **Connect**.
7. Select **Save draft**.

After you submit your offer for publication in Partner Center, we'll validate the connection and send you a test lead. While you preview the offer before it goes live, test your lead connection by trying to purchase the offer yourself in the preview environment.

> [!TIP]
> Make sure the connection to the lead destination stays updated so you don't lose any leads.

## Configure offer properties

On the Properties page of your offer in Partner Center, you’ll define the categories applicable to your offer, and legal contracts. This information ensures your Managed Service is displayed correctly on the online store and offered to the right set of customers.

### Select a category

Under **Categories**, select at least one and up to five categories for grouping your offer into the appropriate commercial marketplace search areas.

### Provide terms and conditions

Under **Legal**, provide your terms and conditions for this offer. Customers will be required to accept them before using the offer. You can also provide the URL where your terms and conditions can be found.

Select **Save draft** before continuing.

## Next step

* [Configure your Managed Service offer listing](./create-managed-service-offer-listing.md)