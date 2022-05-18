---
title: Create Dynamics 365 apps on Dataverse and Power Apps plans on Microsoft AppSource (Azure Marketplace).
description: Configure Dynamics 365 apps on Dataverse and Power Apps offer plans if you chose to enable your offer for third-party app management.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: vamahtan
ms.author: vamahtan
ms.date: 12/03/2021
---

# Create Dynamics 365 apps on Dataverse and Power Apps plans

If you enabled app license management for your offer, the **Plans overview** tab appears as shown in the following screenshot. Otherwise, go to [Set up Dynamics 365 apps on Dataverse and Power Apps offer technical configuration](dynamics-365-customer-engage-technical-configuration.md).

[ ![Screenshot of the Plan overview tab for a Dynamics 365 apps on Dataverse and Power Apps offer that's been enabled for third-party app licensing.](./media/third-party-license/plan-tab-d365-workspaces.png) ](./media/third-party-license/plan-tab-d365-workspaces.png#lightbox)

You need to define at least one plan, if your offer has app license management enabled. You can create a variety of plans with different options for the same offer. These plans (sometimes referred to as SKUs) can differ in terms of monetization or tiers of service. Later, you will map the Service IDs of these plans in your solution package to enable a runtime license check by the Dynamics platform against these plans. You will map the Service ID of each plan in your solution package. This enables the Dynamics platform to run a license check against these plans.

## Create a plan

1. In the left-nav, select **Plan overview**.
1. Near the top of the **Plan overview** page, select **+ Create new plan**.
1. In the dialog box that appears, in the **Plan ID** box, enter a unique plan ID. Use up to 50 lowercase alphanumeric characters, dashes, or underscores. You cannot modify the plan ID after you select **Create**.
1. In the **Plan name** box, enter a unique name for this plan. Use a maximum of 200 characters.
1. Select **Create**.

## Define the plan listing

On the **Plan listing** tab, you can define the plan name and description as you want them to appear in the commercial marketplace. This information will be shown on the Microsoft AppSource listing page.

1. In the **Plan name** box, the name you provided earlier for this plan appears here. You can change it at any time. This name will appear in the commercial marketplace as the title of your offer's software plan.
1. In the **Plan description** box, explain what makes this software plan unique and any differences from other plans within your offer. This description may contain up to 3,000 characters.
1. Select **Save draft**, and then in the breadcrumb at the top of the page, select **Plans**.

    [ ![Screenshot shows the Plan overview link on the Plan listing page of an offer in Partner Center.](./media/third-party-license/bronze-plan-workspaces.png) ](./media/third-party-license/bronze-plan-workspaces.png#lightbox)

1. To create another plan for this offer, at the top of the **Plan overview** page, select **+ Create new plan**. Then repeat the steps in the [Create a plan](#create-a-plan) section. Otherwise, if you're done creating plans, go to the next section: Copy the Service IDs.

## Copy the Service IDs

You need to copy the Service ID of each plan you created so you can map them to your solution package in the next section: Add Service IDs to your solution package.

- For each plan you created, copy the Service ID to a safe place. You’ll add them to your solution package in the next step. The service ID is listed on the **Plan overview** page in the form of `ISV name.offer name.plan ID`. For example, Fabrikam.F365.bronze.

    [ ![Screenshot of the Plan overview page. The service ID for the plan is highlighted.](./media/third-party-license/service-id-workspaces.png) ](./media/third-party-license/service-id-workspaces.png#lightbox)

## Add Service IDs to your solution package

1. Add the Service IDs you copied in the previous step to your solution package. To learn how, see [Add licensing information to your solution](/powerapps/developer/data-platform/appendix-add-license-information-to-your-solution) and [Create an AppSource package for your app](/powerapps/developer/data-platform/create-package-app-appsource).
1. After you create the CRM package .zip file, upload it to Azure Blob Storage. You will need to provide the SAS URL of the Azure Blob Storage account that contains the uploaded CRM package .zip file.

## Next steps

- Go to [Set up Dynamics 365 apps on Dataverse and Power Apps offer technical configuration](dynamics-365-customer-engage-technical-configuration.md) to upload the solution package to your offer.
