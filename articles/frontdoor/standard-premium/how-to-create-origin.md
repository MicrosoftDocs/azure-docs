---
title: Set up an Azure Front Door Standard/Premium (Preview) Origin
description: This article shows how to configure an origin with Endpoint Manager.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: qixwang 
---

# Set up an Azure Front Door Standard/Premium (Preview) Origin

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

This article will show you how to create an Azure Front Door Standard/Premium origin in an existing origin group. 

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Before you can create an Azure Front Door Standard/Premium origin, you must have created at least one origin group.

## Create a new Azure Front Door Standard/Premium Origin

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door Standard/Premium profile.

1. Select **Origin Group**. Then select **+ Add** to create a new origin group.
   
    :::image type="content" source="../media/how-to-create-origin/select-add-origin.png" alt-text="Screenshot of origin group landing page.":::

1. On the **Add an origin group** page, enter a unique **Name** for the new origin group.

1. Then select **+ Add an Origin** to add a new origin to this origin group. 

    :::image type="content" source="../media/how-to-create-origin/add-origin-view.png" alt-text="Screenshot of add an origin page.":::
  
    | Setting | Value |
    | --- | --- |
    | Name | Enter a unique name for the new Azure Front Door origin. |   
    | Origin Type | The type of resource you want to add. Azure Front Door Standard/Premium supports autodiscovery of your app origin from app service, cloud service, or storage. If you want a different resource in Azure or a non-Azure backend, select **Custom host**. |
    | Host Name  | If you didn't select **Custom host** for origin host type, select your backend by choosing the origin host name in the dropdown. |
    | Origin Host Header | Enter the host header value being sent to the backend for each request. For more information, see [Origin host header](concept-origin.md#hostheader). |
    | HTTP Port | Enter the value for the port that the origin supports for HTTP protocol. |
    | HTTPS Port | Enter the value for the port that the origin supports for HTTPS protocol. |
    | Priority | Assign priorities to your different origin when you want to use a primary service origin for all traffic. Also, provide backups if the primary or the backup origin is unavailable. For more information, see [Priority](concept-origin.md#priority). |
    | Weight | Assign weights to your different origins to distribute traffic across a set of origins, either evenly or according to weight coefficients. For more information, see [Weights](concept-origin.md#weighted). |
    | Status | Select this option to enable origin. |
    | Rule | Select Rule Sets that will be applied to this Route. For more information about how to configure Rules, see [Configure a Rule Set for Azure Front Door](how-to-configure-rule-set.md) | 

    > [!IMPORTANT]
    > During configuration, APIs don't validate if the origin is inaccessible from Front Door environments. Make sure that Front Door can reach your origin.

1. Select **Add** to create the new origin. The created origin should appear in the origin list with the group.
  
    :::image type="content" source="../media/how-to-create-origin/origin-list-view.png" alt-text="Screenshot of origin in list view.":::

1. Select **Add** to add the origin group to current endpoint. The origin group should appear within the Origin group panel.

## Clean up resources
To delete an Origin group when you no longer needed it, click the **...** and then select **Delete** from the drop-down.

:::image type="content" source="../media/how-to-create-origin/delete-origin-group.png" alt-text="Screenshot of how to delete an origin group.":::

To delete an origin when you no longer need it, click the **...** and then select **Delete** from the drop-down. 

:::image type="content" source="../media/how-to-create-origin/delete-origin-view.png" alt-text="Screenshot of how to delete an origin.":::

## Next steps

To learn about custom domains, see [adding a custom domain](how-to-add-custom-domain.md) to your Azure Front Door Standard/Premium endpoint.
