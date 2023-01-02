---
title: Create a Power BI visual offer in Partner Center for Microsoft AppSource
description: Learn how to create a Power BI visual offer in Partner Center.
author: trkeya
ms.author: trkeya
ms.reviewer: pooja.surnis
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 08/09/2022
---

# Create a Power BI visual offer

This article describes how to use Partner Center to submit a Power BI visual offer to [Microsoft AppSource](https://appsource.microsoft.com) for others to discover and use.

## Before you begin

Before you can publish a Power BI visual offer, you must have a commercial marketplace account in Partner Center and ensure your account is enrolled in the commercial marketplace program. See [Create a commercial marketplace account in Partner Center](create-account.md) and [Verify your account information when you enroll in a new Partner Center program](/partner-center/verification-responses#checking-your-verification-status).

Review [Plan a Power BI visual offer](marketplace-power-bi-visual.md). It will explain the technical requirements for this offer and list the information and assets you’ll need when you create it.

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).

1. On the Home page, select the **Marketplace offers** tile.

    [ ![Illustrates the Marketplace offers tile on the Partner Center Home page.](./media/workspaces/partner-center-home.png) ](./media/workspaces/partner-center-home.png#lightbox)

1. On the Marketplace offers page, select **+ New offer** > **Power BI visual**.

    [ ![Shows the left pane menu options and the 'New offer' button.](media/power-bi-visual/new-offer-power-bi-visual-workspaces.png) ](media/power-bi-visual/new-offer-power-bi-visual-workspaces.png#lightbox)

> [!IMPORTANT]
> After an offer is published, any edits you make to it in Partner Center appear in AppSource only after you republish the offer. Be sure to always republish an offer after changing it.

## New offer

1. Enter an **Offer ID**. This is a unique identifier for each offer in your account.

    - This ID is visible to customers in the web address for the offer and in Azure Resource Manager templates, if applicable.
    - Use only lowercase letters and numbers. The ID can include hyphens and underscores, but no spaces, and is limited to 50 characters. For example, if your Publisher ID is `testpublisherid` and you enter **test-offer-1**, the offer web address will be `https://appsource.microsoft.com/product/dynamics-365/testpublisherid.test-offer-1`.
    - The Offer ID can't be changed after you select **Create**.
    - The Offer ID should be unique within the list of all other Power BI visual offers in Partner Center.

1. Enter an **Offer alias**. This is the name used for the offer in Partner Center.

    - This name isn't used in AppSource. It is different from the offer name and other values shown to customers.

1. Associate the new offer with a _publisher_. A publisher represents an account for your organization. You may have a need to create the offer under a particular publisher. If you don’t, you can simply accept the publisher account you’re signed in to.

    > [!NOTE]
    > The selected publisher must be enrolled in the [**Commercial Marketplace program**](marketplace-faq-publisher-guide.yml#how-do-i-sign-up-to-be-a-publisher-in-the-microsoft-commercial-marketplace-) and cannot be modified after the offer is created.

1. Select **Create** to generate the offer. Partner Center opens the **Offer setup** page.

## Setup details

1. On the **Offer setup** page, under **Setup details** select one of the radio buttons:

    - **Managing license and selling with Microsoft** to enable your offer to be transactable in [Microsoft AppSource](https://appsource.microsoft.com/) and get license management. This is a one-time setting, and you can’t change it after your offer is published.
        > [!NOTE]
        > This capability is currently in Public Preview.
    - **My offer requires purchase of a service or offers additional in-app purchase** to manage licenses and transactions independently.
    - **My offer does not require purchase of a service and does not offer in app purchases** to provide a free offer.

1. Under **Power BI certification** (optional), read the description carefully and if you want to request [Power BI certification](/power-bi/developer/visuals/power-bi-custom-visuals-certified), select the check box. [Certified](/power-bi/developer/visuals/power-bi-custom-visuals-certified) Power BI visuals meet certain specified code requirements that the Microsoft Power BI team has tested and approved. We recommend that you submit and publish your Power BI visual *before* you request certification, because the certification process takes extra time that could delay publishing of your offer.

## Customer leads

When a customer expresses interest or deploys your product, you’ll receive a lead in the [Referrals workspace](https://partner.microsoft.com/dashboard/referrals/v2/leads) in Partner Center.

You can also connect the product to your customer relationship management (CRM) system to handle leads there.

> [!NOTE]
> Connecting to a CRM system is optional.

To connect your offer to your CRM:

1. In Partner Center, go to the **Offer setup** tab.
1. Under **Customer leads**, select the **Connect** link.
1. In the **Connection details** dialog box, select a lead destination.
1. Complete the fields that appear. For detailed steps, see the following articles:

    - [Configure your offer to send leads to the Azure table](./partner-center-portal/commercial-marketplace-lead-management-instructions-azure-table.md#configure-your-offer-to-send-leads-to-the-azure-table)
    - [Configure your offer to send leads to Dynamics 365 Customer Engagement](./partner-center-portal/commercial-marketplace-lead-management-instructions-dynamics.md#configure-your-offer-to-send-leads-to-dynamics-365-customer-engagement) (formerly Dynamics CRM Online)
    - [Configure your offer to send leads to HTTPS endpoint](./partner-center-portal/commercial-marketplace-lead-management-instructions-https.md#configure-your-offer-to-send-leads-to-the-https-endpoint)
    - [Configure your offer to send leads to Marketo](./partner-center-portal/commercial-marketplace-lead-management-instructions-marketo.md#configure-your-offer-to-send-leads-to-marketo)
    - [Configure your offer to send leads to Salesforce](./partner-center-portal/commercial-marketplace-lead-management-instructions-salesforce.md#configure-your-offer-to-send-leads-to-salesforce)

1. To validate the configuration you provided, select the **Validate link**.
1. After you’ve configured and validated the connection details, select **Connect**.

    For more information, see [Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

1. Select **Save draft** before continuing to the next tab in the left-nav menu: **Properties**.

## Next steps

- [**Offer Properties**](power-bi-visual-properties.md)
