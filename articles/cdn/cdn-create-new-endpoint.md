---
title: Quickstart - Create an Azure CDN profile and endpoint | Microsoft Docs
description: This quickstart shows how to enable Azure CDN by creating a new CDN profile and CDN endpoint.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 4ca51224-5423-419b-98cf-89860ef516d2
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 05/24/2018
ms.author: magattus
ms.custom: mvc

---
# Quickstart: Create an Azure CDN profile and endpoint
In this quickstart, you enable Azure Content Delivery Network (CDN) by creating a new CDN profile and CDN endpoint. After you have created a profile and an endpoint, you can start delivering content to your customers.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites
For the purposes of this quickstart, you must have created a storage account named *mystorageacct123*, which you use for the origin hostname. For more information, see [Integrate an Azure storage account with Azure CDN](cdn-create-a-storage-account-with-cdn.md).

## Log in to the Azure portal
Log in to the [Azure portal](https://portal.azure.com) with your Azure account.

[!INCLUDE [cdn-create-profile](../../includes/cdn-create-profile.md)]

## Create a new CDN endpoint

After you've created a CDN profile, you can use it to create an endpoint.

1. In the Azure portal, select in your dashboard the CDN profile that you created. If you can't find it, select **All services**, then select **CDN profiles**. In the **CDN profiles** page, select the profile that you want to use. 
   
    The CDN profile page appears.

2. Select **Endpoint**.
   
    ![CDN profile](./media/cdn-create-new-endpoint/cdn-select-endpoint.png)
   
    The **Add an endpoint** pane appears.

3. For the endpoint settings, use the values specified in the following table:

    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter *my-endpoint-123* for your endpoint hostname. This name must be globally unique; if it is already in use, you may enter a different name. This name is used to access your cached resources at the domain _&lt;endpoint name&gt;_.azureedge.net.|
    | **Origin type** | Select **Storage**. | 
    | **Origin hostname** | Enter *mystorageacct123.blob.core.windows.net* for your hostname. This name must be globally unique; if it is already in use, you may enter a different name. |
    | **Origin path** | Leave blank. |
    | **Origin host header** | Leave the default generated value. |  
    | **Protocol** | Leave the default **HTTP** and **HTTPS** options selected. |
    | **Origin port** | Leave the default port values. | 
    | **Optimized for** | Leave the default selection, **General web delivery**. |

    ![Add endpoint pane](./media/cdn-create-new-endpoint/cdn-add-endpoint.png)

3. Select **Add** to create the new endpoint.
   
   After the endpoint is created, it appears in the list of endpoints for the profile.
    
   ![CDN endpoint](./media/cdn-create-new-endpoint/cdn-endpoint-success.png)
    
   Because it takes time for the registration to propagate, the endpoint isn't immediately available for use: 
   - For **Azure CDN Standard from Microsoft** profiles, propagation usually completes in 10 minutes. 
   - For **Azure CDN Standard from Akamai** profiles, propagation usually completes within one minute. 
   - For **Azure CDN Standard from Verizon** and **Azure CDN Premium from Verizon** profiles, propagation usually completes within 90 minutes. 

## Clean up resources
In the preceding steps, you created a CDN profile and an endpoint in a resource group. Save these resources if you want to go to [Next steps](#next-steps) and learn how to add a custom domain to your endpoint. However, if you don't expect to use these resources in the future, you can delete them by deleting the resource group, thus avoiding additional charges:

1. From the left-hand menu in the Azure portal, select **Resource groups** and then select **my-resource-group-123**.

2. On the **Resource group** page, select **Delete resource group**, enter *my-resource-group-123* in the text box, then select **Delete**.

    This action will delete the resource group, profile, and endpoint that you created in this quickstart.

## Next steps
To learn about adding a custom domain to your CDN endpoint, see the following tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Add a custom domain to your Azure CDN endpoint](cdn-map-content-to-custom-domain.md)


