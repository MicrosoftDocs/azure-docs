---
title: include file
description: include file
services: cdn
author: SyntaxC4
ms.service: cdn
ms.topic: include
ms.date: 04/13/2018
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

    Use the settings specified in the table following the image.
   
    ![New CDN profile](./media/cdn-create-profile/cdn-new-profile.png)

    | Setting  | Value |
    | -------- | ----- |
    | **Name** | Enter *my-cdn-profile-123* for your profile name. This name must be globally unique; if it is already in use, you may enter a different one. |
    | **Subscription** | Select an Azure subscription from the drop-down list.|
    | **Resource group** | Select **Create new** and enter *my-resource-group-123* for your resource group name. This name must be globally unique; if it is already in use, you may enter a different one. | 
    | **Resource group location** | Select **Central US** from the drop-down list. |
    | **Pricing tier** | Select **Standard Verizon** from the drop-down list. |
    | **Create a new CDN endpoint now** | Leave unselected. |  
   
3. Select **Pin to dashboard** to save the profile to your dashboard after it is created.
    
4. Select **Create** to create the profile. 

