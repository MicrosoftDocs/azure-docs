---
title: Configure a solution template plan
description: Configure a solution template plan for your Azure application offer in Partner Center (Azure Marketplace). 
author: macerru
ms.author: macerr
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 9/14/2022
---

# Configure a solution template plan

This article applies only to solution template plans for an Azure application offer. If you are configuring a managed application plan, go to [Configure a managed application plan](azure-app-managed.md).

## Re-use technical configuration (optional)

If you’ve created more than one plan of the same type within this offer and the technical configuration is identical between them, you can reuse the technical configuration from another plan. This setting cannot be changed after this plan is published.

To re-use a technical configuration:

1. Select the **This plan reuses the technical configuration from another plan of the same type** check box.
1. In the list that appears, select the base plan you want.

> [!NOTE]
> If a plan is currently reusing or has reused the technical configuration from another plan of the same type, go to that base plan to view history of previously published packages.

## Choose who can see your plan

You can configure each plan to be visible to everyone or to only a specific audience. You grant access to a private audience using Azure subscription IDs with the option to include a description of each subscription ID you assign. You can add a maximum of 10 subscription IDs manually or up to 10,000 subscription IDs using a .CSV file. Azure subscription IDs are represented as GUIDs and letters must be lowercase.

> [!NOTE]
> If you publish a private plan, you can change its visibility to public later. However, once you publish a public plan, you cannot change its visibility to private.

On the **Availability** tab, under **Plan visibility**, do one of the following:

- To make the plan public, select the **Public** option button (also known as a _radio button_).
- To make the plan private, select the **Private** option button and then add the Azure subscription IDs manually or with a CSV file.

    > [!NOTE]
    > A private or restricted audience is different from the preview audience you defined on the **Preview** tab. A preview audience can access your offer before its published live in the marketplace. While the private audience choice only applies to a specific plan, the preview audience can view all plans (private or not) for validation purposes.

### Manually add Azure subscription IDs for a private plan

1. Under **Plan visibility**, select the **Private** option button.
1. In the **Azure Subscription ID** box that appears, enter the Azure subscription ID of the audience you want to grant access to this private plan. A minimum of one subscription ID is required.
1. (Optional) Enter a description of this audience in the **Description** box.
1. To add another subscription ID, select the **Add ID (Max 10)** link and repeat steps 2 and 3.

## Use a .CSV file to add Azure subscription IDs for a private plan

1. Under **Plan visibility**, select the **Private** option button.
1. Select the **Export Audience (csv)** link.
1. Open the .CSV file and add the Azure subscription IDs you want to grant access to the private offer to the **ID** column.
1. Optionally, enter a description for each audience in the **Description** column.
1. Add "SubscriptionId" in the **Type** column, for each row with a subscription ID.
1. Save the .CSV file.
1. On the **Availability** tab, under **Plan visibility**, select the **Import Audience (csv)** link.
1. In the dialog box that appears, select **Yes**.
1. Select the .CSV file and then select **Open**. A message appears indicating that the .CSV file was successfully imported.

### Hide your plan

If your solution template is intended to be deployed only indirectly when referenced though another solution template or managed application, select the check box under **Hide plan** to publish your solution template but hide it from customers who search and browse for it directly.

Select **Save draft** before continuing to the next section: Define the technical configuration.

## Define the technical configuration

On the **Technical configuration** tab, you’ll upload the deployment package that lets customers deploy your plan and provide a version number for the package.

### Assign a version number for the package

In the **Version** box provide the current version of the technical configuration. Increment this version each time you publish a change to this page. The version number must be in the format: integer.integer.integer. For example, `1.0.2`.

### Upload a package file

Make sure your offer is compliant with our recommended practices by using the [ARM template test toolkit](../azure-resource-manager/templates/test-toolkit.md#validate-templates-for-azure-marketplace) before uploading the package file.

Under **Package file (.zip)**, drag your package file to the gray box or select the **browse for your file(s)** link.

> [!NOTE]
> If you have an issue uploading files, make sure your local network does not block the `https://upload.xboxlive.com` service used by Partner Center.

### Previously published packages

After you publish your offer live, the **Previously published packages** sub-tab appears on the **Technical configuration** page. This tab lists all previously published versions of your technical configuration.

## View your plans

- Select **Save draft**, and then in the upper left of the page, select **Plan overview** to return to the **Plan overview** page.

After you create one or more plans, you'll see your plan name, plan ID, plan type, availability (Public or Private), current publishing status, and any available actions on the **Plan overview** tab.

The actions that are available in the **Action** column of the **Plan overview** tab vary depending on the status of your plan, and may include the following:

- If the plan status is **Draft**, the link in the **Action** column will say **Delete draft**.
- If the plan status is **Live**, the link in the **Action** column will be either **Stop distribution** or **Sync private audience**. The **Sync private audience** link will publish only the changes to your private audiences, without publishing any other updates you might have made to the offer.
- To create another plan for this offer, at the top of the **Plan overview** tab, select **+ Create new plan**. Then repeat the steps in [How to create plans for your Azure application offer](azure-app-plans.md). Otherwise, if you're done creating plans, go to the next section: Next steps.

## Next steps

- [Test and publish this offer](azure-app-test-publish.md)
- [Sell this offer](azure-app-marketing.md) through the **Co-sell with Microsoft** and/or **Resell through CSPs** programs