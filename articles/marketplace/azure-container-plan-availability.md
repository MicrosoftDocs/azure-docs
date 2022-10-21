---
title: Set plan pricing and availability for an Azure Container offer in Microsoft AppSource.
description: Set plan pricing and availability for an Azure Container offer in Microsoft AppSource.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: AarathiN
ms.author: aarathin
ms.date: 6/20/2022
---

# Set plan pricing and availability for an Azure Container offer

On this page, you can configure:

- Markets where this plan is available. Every plan must be available in at least one market.

- Pricing options.

- Whether to make the plan visible to everyone or only to specific customers via private audience.

> [!NOTE]
> Some of the features listed in this document may only be available to you if you are publishing Azure Container offers for Kubernetes applications. This is configured in the offer setup page.

## Markets

Every plan must be available in at least one market. Most markets are selected by default. To edit the list, select Edit markets and select or clear check boxes for each market location where this plan should (or shouldn't) be available for purchase. Users in selected markets can still deploy the offer to all Azure regions selected in the [Plan setup](azure-container-plan-setup.md#azure-regions) section.

Choose *Select only Microsoft Tax Remitted* to select only countries/regions in which Microsoft remits sales and use tax on your behalf. Publishing to China is limited to plans that are either Free or Bring-your-own-license (BYOL).

If you've already set prices for your plan in US dollar (USD) currency and add another market location, the price for the new market is calculated according to current exchange rates. Always review the price for each market before you publish. Review your pricing by selecting Export prices (xlsx) after you save your changes.

When you remove a market, customers from that market who are using active deployments won't be able to create new deployments or scale up their existing deployments. Existing deployments aren't affected.

Select *Save* to continue.

## Pricing

For the License model, select *Custom price* to configure pricing for this plan, or *Bring your own license* (BYOL) to let customers use this plan with their existing license.

> [!NOTE]
> To ensure the prices are correct before you publish them, export the pricing spreadsheet and review them in each market. Before you export pricing data, first select *Save draft* to save pricing changes.
> When selecting a pricing option, Microsoft does the currency conversion for the pricing options selected.

For a custom priced plan, Microsoft will charge the customer for their hourly usage and bill them monthly. This is our Pay-as-you-go plan, where customers are only billed for the hours that they've used. When you select this plan, you can choose one of the following pricing options:

- Free: Set the hourly price at 0 and your container offer is sold as equivalent to a free offer.
- Per core: Your Azure Container offer is listed with pricing based on the critical CPU cores used. You provide the price for one CPU core and we’ll increment the pricing based on the size of the hardware used by your application for the critical cores you’ve tagged in your application as the ones that should generate usage.
- Per every core in cluster: Your Azure Container offer is listed with pricing based on the total number of CPU cores in the cluster. You provide the price for one CPU core and we’ll increment the pricing based on the size of the hardware in the cluster.

## Plan visibility

You can design each plan to be visible to everyone or only to a preselected private audience:

- Public: Your plan can be seen by everyone.

- Private: Make your plan visible only to a preselected audience. After it's published as a private plan, you can update the private audience or change it to public. After you make a plan public, it must remain public. It can't be changed back to a private plan. If the plan is private, you can specify the private audience that will have access to this plan using Azure tenant IDs. Optionally, include a *Description* of each Azure tenant ID that you assign. Add up to 10 tenant IDs manually or import a CSV spreadsheet if more than 10 IDs are required. For a published offer, select *Sync private audience* for the changes to the private audience to take effect automatically without needing to republish the offer.

> [!NOTE]
> A private audience is different from the preview audience that you defined on the *Preview audience* pane. A preview audience can access and view all private and public plans for validation purposes before it's published live to Azure Marketplace. A private audience can only access the specific plans that they are authorized to have access to once the offer is live.

### Hide a plan

A hidden plan is not visible on Azure Marketplace and can only be deployed through another Solution Template, Managed Application, Azure CLI or Azure PowerShell. Hiding a plan is useful when trying to limit exposure to customers that would normally be searching or browsing for it directly via Azure Marketplace. By selecting this checkbox, any payload associated to your plan will be hidden from Azure Marketplace storefront.

> [!NOTE]
> A hidden plan is different from a private plan. When a plan is publicly available but hidden, it is still available for any Azure customer to deploy via Solution Template, Managed Application, Azure CLI or Azure PowerShell. However, a plan can be both hidden and private in which case only the customers configured in the private audience can deploy via these methods. If you wish to make the plan available to a limited set of customers, then set the plan to *Private*.

> [!IMPORTANT]
> Hidden plans don't generate preview links. However, you can test them by following the steps outlined in [Frequently asked questions](/azure/marketplace/azure-vm-faq#how-do-i-test-a-hidden-preview-image-).

## Set plan availability

If you are publishing Container image offers as a listing only offer through Microsoft as specified in your [Plan Setup](azure-container-plan-setup.md) page, this will be the only section available to you.

Use this tab to set the availability of your Azure Container plan. To hide your published offer so customers can't search, browse, or purchase it in the marketplace, select the **Hide plan** check box.

This field is commonly used when:

- The offer is only to be used only indirectly when referenced though another application.
- The offer should not be purchased individually.
- The plan was used for initial testing and is no longer relevant.
- The plan was used for temporary or seasonal offers and should no longer be offered.

Select **Save draft** before continuing to the next tab in the **Plan overview** left-nav menu, **Technical configuration**.

## Next steps

- [Set plan technical configuration for a container image-based offer](azure-container-plan-technical-configuration.md)
- [Set plan technical configuration for a Kubernetes application-based offer](azure-container-plan-technical-configuration-kubernetes.md)