---
title: include file
description: include file
services: cdn
author: SyntaxC4
ms.service: azure-cdn
ms.topic: include
ms.date: 04/06/2022
ms.author: cfowler
ms.custom: include file
---

## Create a new CDN profile

A CDN profile is a container for CDN endpoints and specifies a pricing tier.

1. In the Azure portal, select **Create a resource** (on the upper left). The **Create a resource** portal appears.
   
1. Search for and select **Front Door and CDN profiles**, then select **Create**:
    
    :::image type="content" source="./media/cdn-create-profile/cdn-new-resource.png" alt-text="Create CDN resource.":::

    The **Compare offerings** pane appears.

1. Select **Explore other offerings** then select **Azure CDN Standard from Microsoft (classic)**. Select **Continue**.

    :::image type="content" source="./media/cdn-create-profile/compare-offerings.png" alt-text="Select CDN Resource. Select Explore Other Options and Azure CDN Standard from Microsoft(Classic.).":::

1. In the **Basics** tab, enter the following values:
   
    | Setting  | Value |
    | -------- | ----- |
    | **Subscription** | Select an Azure subscription from the drop-down list. |
    | **Resource group** | Select **Create new** and enter *CDNQuickstart-rg* for your resource group name, or select **Use existing** and choose *CDNQuickstart-rg* if you have the group already. | 
    | **Resource group region** | If a new resource group is created, select a location near you from the drop-down list.|
    | **Name** | Enter your profile name, for example, *cdn-profile-123*. |
    | **Region** | Leave as default. |
    | **Pricing tier** | Select an Azure CDN option from the drop-down list. (Deployment time for the Microsoft tier takes about 10 minutes and the Verizon tiers take about 30 minutes.) |
    | **Create a new CDN endpoint now** | Leave unselected. |  
   
    :::image type="content" source="./media/cdn-create-profile/cdn-new-profile.png" alt-text="Input variables in Basics tab.":::

1. Select **Review + Create** then **Create** to create the profile.

