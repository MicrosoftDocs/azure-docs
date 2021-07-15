---
title: How to create plans for your Managed Service offer on Azure Marketplace
description: Learn how to create plans for your Managed Service offer on Azure Marketplace using Microsoft Partner Center.
author: Microsoft-BradleyWright
ms.author: brwrigh
ms.reviewer: anbene
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 12/23/2020
---

# How to create plans for your Managed Service offer

Managed Service offers sold through the Microsoft commercial marketplace must have at least one plan. You can create a variety of plans with different options within the same offer. These plans (sometimes referred to as SKUs) can differ in terms of version, monetization, or tiers of service. For detailed guidance on plans, see [Plans and pricing for commercial marketplace offers](./plans-pricing.md).

## Create a plan

1. On the **Plan overview** tab of your offer in Partner Center, select **+ Create new plan**.
2. In the dialog box that appears, under **Plan ID**, enter a unique plan ID. Use up to 50 lowercase alphanumeric characters, dashes, or underscores. You cannot modify the plan ID after you select **Create**. This ID will be visible to your customers.
3. In the **Plan name** box, enter a unique name for this plan. Use a maximum of 50 characters. This name will be visible to your customers.
4. Select **Create**.

## Define the plan listing

On the **Plan listing** tab, define the plan name and description as you want them to appear in the commercial marketplace.

1. The **Plan name** box displays the name you provided earlier for this plan. You can change it at any time. This name will appear in the commercial marketplace as the title of your offer's plan.
2. In the **Plan summary** box, provide a short description of your plan, which may be used in marketplace search results.
3. In the **Plan description** box, explain what makes this plan unique and different from other plans within your offer.
4. Select **Save draft** before continuing to the next tab.

## Define pricing and availability

The only pricing model available for Managed Service offers is **Bring your own license (BYOL)**. This means that you bill your customers directly for costs related to this offer, and Microsoft doesn’t charge you any fees.

You can configure each plan to be visible to everyone (public) or to only a specific audience (private).

> [!NOTE]
> Private plans are not supported with subscriptions established through a reseller of the Cloud Solution Provider (CSP) program.

> [!IMPORTANT]
> Once a plan has been published as public, you can't change it to private. To control which customers can accept your offer and delegate resources, use a private plan. With a public plan, you can't restrict availability to certain customers or even to a certain number of customers (although you can stop selling the plan completely if you choose to do so). You can remove access to a delegation after a customer accepts an offer only if you included an Authorization with the Role Definition set to Managed Services Registration Assignment Delete Role when you published the offer. You can also reach out to the customer and ask them to remove your access.

## Make your plan public

1. Under **Plan visibility**, select **Public**.
2. Select **Save draft**. To return to the Plan overview tab, select **Plan overview** in the upper left.
3. To create another plan for this offer, select **+ Create new plan** in the **Plan overview** tab.

## Make your plan private

You grant access to a private plan using Azure subscription IDs. You can add a maximum of 10 subscription IDs manually or up to 10,000 subscription IDs using a .CSV file.

To add up to 10 subscription IDs manually:

1. Under **Plan visibility**, select **Private**.
2. Enter the Azure subscription ID of the audience you want to grant access to.
3. Optionally, enter a description of this audience in the **Description** box.
4. To add another ID, select **Add ID (Max 10)**.
5. When you’re done adding IDs, select **Save draft**.

To add up to 10,000 subscription IDs with a .CSV file:

1. Under **Plan visibility**, select **Private**.
2. Select the **Export Audience (csv)** link. This will download a .CSV file.
3. Open the .CSV file. In the **Id** column, enter the Azure subscription IDs you want to grant access to.
4. In the **Description** column, you have the option to add a description for each entry.
5. In the **Type** column, add **SubscriptionId** to each row that has an ID.
6. Save the file as a .CSV file.
7. In Partner Center, select the **Import Audience (csv)** link.
8. In the **Confirm** dialog box, select **Yes**, then upload the .CSV file.
9. Select **Save draft**.

## Technical configuration

This section creates a manifest with authorization information for managing customer resources. This information is required in order to enable [Azure delegated resource management](../lighthouse/concepts/architecture.md).

Review [Creating an ARM Template](../lighthouse/how-to/onboard-customer.md#create-an-azure-resource-manager-template) to understand how to create a template for your plan. This template is used to configure the authorization information for the plan.

> [!NOTE]
> The specifications provided in the template will apply to every customer who activates the plan. If you want to limit access to a specific customer, you'll need to publish a private plan for their exclusive use.

### Manifest

1. Under **Manifest**, provide a **Version** for the manifest. Use the format **n.n.n** (for example, 1.2.5).
2. Under **Package file (.zip)**, drag your compressed fie containing the ARM template as well as the properties file(if required) to the gray box or select browse for your file link to choose a file from your computer. The file will be validated after upload.
    - For templates created using the Azure portal the package file must contain only the **template json** file.
    - For templates created manually, the package file must contain both a **template json** and a **properties json**.  

>[!Tip]
>The ARM template can be created using the [Azure portal](../lighthouse/how-to/onboard-customer.md#create-your-template-in-the-azure-portal).

>[!Note]
>You can download or remove the file before the plan is published. Once published, the file can be downloaded but not removed/replaced.

If you publish a new version of your offer and need to create an updated manifest, select **+ New manifest**. Be sure to increase the version number from the previous manifest version.

Once you've completed all sections for your plan, you can select **+ Create new plan** to create additional plans. When you’re done, select **Save draft** before continuing.

### Troubleshooting

The package file is validated upon upload. If there is an issue with package validation try check the following tips and try again

- The package file contains the required **.json** files.
- The ARM template is configured correctly. For help in troubleshooting the template refer to [Onboarding a Lighthouse customer](../lighthouse/how-to/onboard-customer.md#troubleshooting)

## Next steps

[Review and publish](review-publish-offer.md)
