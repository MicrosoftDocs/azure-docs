---
title: include file
description: include file
services: cdn
author: SyntaxC4
ms.service: azure-cdn
ms.topic: include
ms.date: 05/24/2018
ms.author: cfowler
ms.custom: include file
---

## Create a new CDN profile

A CDN profile is a container for CDN endpoints and specifies a pricing tier.

1. In the Azure portal, in the upper left, select **Create a resource**. 
    
    The **New** pane appears.
   
2. Select **Web + Mobile**, then select **CDN**.
   
    ![Select CDN resource](./media/cdn-create-profile/cdn-new-resource.png)

    The **CDN profile** pane appears.

3. For the CDN profile settings, use the values specified in the following table:
   
    | Setting  | Value |
    | -------- | ----- |
    | **Name** | Enter *my-cdn-profile-123* for your profile name. This name must be globally unique; if it is already in use, you may enter a different name. |
    | **Subscription** | Select an Azure subscription from the drop-down list. |
    | **Resource group** | Select **Create new** and enter *my-resource-group-123* for your resource group name. If it is already in use, you may enter a different name or you can select **Use existing** and select **my-resource-group-123** from the drop-down list. | 
    | **Resource group location** | Select **Central US** from the drop-down list. |
    | **Pricing tier** | Select **Standard Verizon** from the drop-down list. |
    | **Create a new CDN endpoint now** | Leave unselected. |  
   
    ![New CDN profile](./media/cdn-create-profile/cdn-new-profile.png)

4. Select **Pin to dashboard** to save the profile to your dashboard after it is created.
    
5. Select **Create** to create the profile. 

    For **Azure CDN Standard from Microsoft** profiles only, profile completion usually completes in two hours. 

