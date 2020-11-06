---
title: Configure a managed application plan
description: Learn how to configure a managed application plan for your Azure application offer in Partner Center. 
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 11/06/2020
---

# Configure a managed application plan

This article applies only to managed application plans for an Azure application offer. If you’re configuring a solution template plan, go to [Configure a solution template plan](create-new-azure-apps-offer-solution.md).

## Define markets, pricing, and availability

Every plan must be available in at least one market. On the **Pricing and availability** tab, you can configure the markets this plan will be available in, the price, and whether to make the plan visible to everyone or only to specific customers (also called a private plan).

1. Under **Markets**, select the **Edit markets** link.
1. In the dialog box that appears, select the market locations where you want to make your plan available. You must select a minimum of one and maximum of 141 markets.

    > [!NOTE]
    > This dialog box includes a search box and an option to filter on only "Tax Remitted" countries, in which Microsoft remits sales and use tax on your behalf.

1. Select **Save**, to close the dialog box.

## Define pricing

In the **Price** box, provide the per-month price for this plan. This price is in addition to any Azure infrastructure or usage-based costs incurred by the resources deployed by this solution.

In addition to the per-month price, you can also set prices for consumption of non-standard units using [metered billing](partner-center-portal/azure-app-metered-billing.md). You may set the per-month price to zero and charge exclusively using metered billing if you like.

Prices are set in USD (USD = United States Dollar) are converted into the local currency of all selected markets using the current exchange rates when saved. Validate these prices before publishing by exporting the pricing spreadsheet and reviewing the price in each market. If you would like to set custom prices in an individual market, modify and import the pricing spreadsheet.

### Add a custom meter dimension (optional)

1. Under **Marketplace Metering Service dimensions**, select the **Add a Custom Meter Dimension (Max 18)** link.
1. In the **ID** box, enter the immutable identifier reference while emitting usage events.
1. In the **Display Name** box, enter the display name associated with the dimension. For example, "text messages sent".
1. In the **Unit of Measure** box, enter the description of the billing unit. For example, "per text message" or "per 100 emails".
1. In the **Price per unit in USD** box, enter the price for one unit of the dimension.
1. In the **Monthly quantity included in base** box, enter the quantity (as an integer) of the dimension that's included each month for customers who pay the recurring monthly fee. To set an unlimited quantity, select the check box instead.
1. To add another custom meter dimension, repeat steps 1 through 7.

### Set custom prices (optional)

Prices set in USD (USD = United States Dollar) are converted into the local currency of all selected markets using the current exchange rates when saved. Validate these prices before publishing by exporting the pricing spreadsheet and reviewing the price in each market. If you would like to set custom prices in an individual market, modify and import the pricing spreadsheet.

Review your prices carefully before publishing, as there are some restrictions on what can change after a plan is published.

> [!NOTE]
> After a price for a market in your plan is published, it can't be changed later.

To set custom prices in an individual market, export, modify, and then import the pricing spreadsheet. You're responsible for validating this pricing and owning these settings. For detailed information, see [Custom prices](plans-pricing.md#custom-prices).

1. You must first save your pricing changes to enable export of pricing data. Near the bottom of the **Pricing and availability** tab, select **Save draft**.
1. Under **Pricing**, select the **Export pricing data** link.
1. Open the exportedPrice.xlsx file in Microsoft Excel.
1. In the spreadsheet, make the updates you want to your pricing information and then save the file.

   You may need to enable editing in Excel before you can update the file.

1. On the **Pricing and availability** tab, under **Pricing**, select the **Import pricing data** link.
1. In the dialog box that appears, click **Yes**.
1. Select the exportedPrice.xlsx file you updated, and then click **Open**.

## Choose who can see your plan

You can configure each plan to be visible to everyone or to only a specific audience. You grant access to a private audience using Azure subscription IDs with the option to include a description of each subscription ID you assign. You can add a maximum of 10 subscription IDs manually or up to 10,000 subscription IDs using a .CSV file. Azure subscription IDs are represented as GUIDs and letters must be lowercase.

> [!NOTE]
> If you publish a private plan, you can change its visibility to public later. However, once you publish a public plan, you cannot change its visibility to private.

Under **Plan visibility**, do one of the following:

- To make the plan public, select the **Public** option button (also known as a _radio button_).
- To make the plan private, select the **Private** option button and then add the Azure subscription IDs manually or with a CSV file.

> [!NOTE]
> A private or restricted audience is different from the preview audience you defined on the **Preview** tab. A preview audience can access your offer before its published live in the marketplace. While the private audience choice only applies to a specific plan, the preview audience can view all plans (private or not) for validation purposes.

### Manually add Azure subscription IDs for a private plan

1. Under **Plan visibility**, select the **Private** option button.
1. In the **Azure Subscription ID** box that appears, enter the Azure subscription ID of the audience you want to grant access to this private plan. A minimum of one subscription ID is required.
1. (Optional) Enter a description of this audience in the **Description** box.
1. To add another subscription ID, select the **Add ID (Max 10)** link and repeat steps 2 and 3.

### Use a .CSV file to add Azure subscription IDs for a private plan

1. Under **Plan visibility**, select the **Private** option button.
1. Select the **Export Audience (csv)** link.
1. Open the .CSV file and add the Azure subscription IDs you want to grant access to the private offer to the **ID** column.
1. Optionally, enter a description for each audience in the **Description** column.
1. Add "SubscriptionId" in the **Type** column, for each row with a subscription ID.
1. Save the .CSV file.
1. On the **Availability** tab, under **Plan visibility**, select the **Import Audience (csv)** link.
1. In the dialog box that appears, select **Yes**.
1. Select the .CSV file and then select **Open**. A message appears indicating that the .CSV file was successfully imported.

## Define the technical configuration

On the **Technical configuration** tab, you’ll upload the deployment package that lets customers deploy your plan and provide a version number for the package. You’ll also provide other technical information.

> [!NOTE]
> This tab won’t be visible if you chose to re-use packages from another plan on the **Plan setup** tab. If so, go to [View your plans](#view-your-plans).

### Assign a version number for the package

In the **Version** box provide the current version of the technical configuration. Increment this version each time you publish a change to this page. The version number must be in the format: integer.integer.integer. For example, `1.0.2`.

### Upload a package file

Under **Package file (.zip)**, drag your package file to the gray box or select the **browse for your file(s)** link.

> [!NOTE]
> If you have an issue uploading files, make sure your local network does not block the `https://upload.xboxlive.com` service used by Partner Center.

#### Previously published packages

The **Previously published packages** sub-tab enables you to view all published versions of your technical configuration.

### Enable just-in-time (JIT) access (optional)

To enable JIT access for this plan, select the **Enable just-in-time (JIT) access** check box. To require that consumers of your managed application grant your account permanent access, leave this option unchecked. To learn more about this option, see [Just in time (JIT) access](plan-azure-app-managed-app.md#just-in-time-jit-access).

### Select a deployment mode

Select either the **Complete** or **Incremental** deployment mode.

- In **Complete** mode, a redeployment of the application by the customer will result in removal of resources in the managed resource group if the resources are not defined in the `mainTemplate.json`.
- In **Incremental** mode, a redeployment of the application leaves existing resources unchanged.

To learn more about deployment modes, see [Azure Resource Manager deployment modes](/azure/azure-resource-manager/deployment-modes.md).

### Provide a notification endpoint URL

In the **Notification Endpoint URL** box, provide an HTTPS Webhook endpoint to receive notifications about all CRUD operations on managed application instances of this plan version.

### Customize allowed customer actions (optional)

1. To specify which actions customers can perform on the managed resources in addition to the "`*/read`" actions that is available by default, select the **Customize allowed customer actions** box.
1. In the boxes that appear, provide the additional control actions and allowed data actions you want to enable your customer to perform, separated by semicolons. For example, to permit consumers to restart virtual machines, add `Microsoft.Compute/virtualMachines/restart/action` to the **Allowed control actions** box.

### Choose who can manage the application

Indicate who should have management access to this managed application in each selected Azure region: _Public Azure_ and _Azure Government Cloud_. You will use Azure AD identities to identify the users, groups, or applications that you want to grant permission to the managed resource group. For more information, see [Plan an Azure managed application for an Azure Application offer](plan-azure-application-offer.md).

Complete the following steps for Public Azure and Azure Government Cloud, as applicable.

1. In the **Azure Active Directory Tenant ID** box, enter the Azure AD Tenant ID (also known as directory ID) containing the identities of the users, groups, or applications you want to grant permissions to.
1. In the **Principal ID** box, provide the Azure AD object ID of the user, group, or application that you want to be granted permission to the managed resource group. Identify the user by their Principal ID, which can be found at the [Azure Active Directory users blade](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers) on the Azure portal.
1. From the **Role definition** list, select an Azure AD built-in role. The role you select describes the permissions the principal will have on the resources in the customer subscription.
1. To add another authorization, select the **Add authorization (max 100)** link, and repeat steps 1 through 3.

### Policy settings (optional)

You can configure a maximum of five policies, and only one instance of each Policies option. Some policies require additional parameters.

1. Under **Policy settings**, select the **+ Add policy (max 5)** link.
1. In the **Name** box, enter the policy assignment name (limited to 50 characters).
1. From the **Policies** list box, select the Azure policy that will be applied to resources created by the managed application in the customer subscription.
1. In the **Policy parameters** box, provide the parameter on which the auditing and diagnostic settings policies should be applied.
1. From the **Policy SKU** list box, select the policy SKU type.

    > [!NOTE]
    > The _Standard policy_ SKU is required for audit policies.

## View your plans

- Select **Save draft**, and then in the upper left of the page, select **Plan overview** to return to the **Plan overview** page.

After you create one or more plans, you'll see your plan name, plan ID, plan type, availability (Public or Private), current publishing status, and any available actions on the **Plan overview** tab.

The actions that are available in the **Action** column of the **Plan overview** tab vary depending on the status of your plan, and may include the following:

- If the plan status is **Draft**, the link in the **Action** column will say **Delete draft**.
- If the plan status is **Live**, the link in the **Action** column will be either **Stop selling plan** or **Sync private audience**. The **Sync private audience** link will publish only the changes to your private audiences, without publishing any other updates you might have made to the offer.
- To create another plan for this offer, at the top of the **Plan overview** tab, select **+ Create new plan**. Then repeat the steps in [How to create plans for your Azure application offer](create-new-azure-apps-offer-plans.md). Otherwise, if you're done creating plans, go to the next section: Next steps.

## Next steps

- [How to test and publish your Azure Application offer](create-new-azure-apps-offer-test-publish.md).
- Learn [How to market your Azure Application offer](create-new-azure-apps-offer-marketing.md) through the Co-sell with Microsoft and Resell through CSPs programs.
