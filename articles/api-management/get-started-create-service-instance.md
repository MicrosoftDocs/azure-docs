---
title: Quickstart - Create Azure API Management instance - Portal
description: Use this quickstart to create a new Azure API Management instance by using the Azure portal.
author: dlepow
ms.service: api-management
ms.topic: quickstart
ms.custom: mvc, mode-portal, devdivchpfy22
ms.date: 12/11/2023
ms.author: danlep
---

# Quickstart: Create a new Azure API Management instance by using the Azure portal

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This quickstart describes the steps for creating a new API Management instance using the Azure portal. After creating an instance, you can use the Azure portal for common management tasks such as importing APIs in your API Management instance.

[!INCLUDE [api-management-quickstart-intro](../../includes/api-management-quickstart-intro.md)]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a new instance

1. From the Azure portal menu, select **Create a resource**. You can also select **Create a resource** on the Azure **Home** page.
   
   :::image type="content" source="media/get-started-create-service-instance/create-resource.png" alt-text="Select Create a resource.":::

   
1. On the **Create a resource** page, select **Integration** > **API Management**.

   :::image type="content" source="media/get-started-create-service-instance/create-resource-page.png" alt-text="Screenshot of creating a     new Azure API Management instance.":::
   
1. On the **Create API Management** page, on the **Basics** tab, enter settings.

   :::image type="content" source="media/get-started-create-service-instance/create-api-management-instance-1.png" alt-text="Create API Management instance.":::
   
   | Setting                 | Description   |                                                                     
   |-------------------------|-----------------------------------------------|
   | **Subscription**          | The subscription under which this new service instance will be created.   |
   | **Resource group**      |  Select a new or existing resource group. A resource group is a logical container into which Azure resources are deployed and managed. |
   | **Region**          | Select a geographic region near you from the available API Management service locations. | 
   | **Resource name**                | A unique name for your API Management instance. The name can't be changed later. The service name refers to both the service and the corresponding Azure resource. <br/><br/> The service name is used to generate a default domain name: *\<name\>.azure-api.net.* If you would like to configure a custom domain name later, see [Configure a custom domain](configure-custom-domain.md). |
   | **Organization name**   | The name of your organization. This name is used in many places, including the title of the developer portal and sender of notification emails. |                                                         
   | **Administrator email** | The email address to which all the notifications from **API Management** will be sent.   |  
   | **Pricing tier**        | Select **Developer** tier to evaluate the service. This tier isn't for production use. For more information about scaling the API Management tiers, see [upgrade and scale](upgrade-and-scale.md). |

1. Select **Review + create**.

    > [!TIP]
    > It can take 30 to 40 minutes to create and activate an API Management service in this tier. To quickly find a newly created service, select **Pin to dashboard**.

[!INCLUDE [api-management-navigate-to-instance](../../includes/api-management-navigate-to-instance.md)]

Review the properties of your service on the **Overview** page.

   :::image type="content" source="media/get-started-create-service-instance/get-started-create-service-instance-created-1.png" alt-text="API Management instance.":::

When your API Management service instance is online, you're ready to use it. Start with the tutorial to [import and publish your first API](import-and-publish.md).

## Clean up resources

When no longer needed, you can remove the resource group and all the related resources by following these steps:

1. In the Azure portal, search for and select **Resource groups**. You can also select **Resource groups** on the **Home** page. 

   :::image type="content" source="media/get-started-create-service-instance/resource-groups.png" alt-text="Resource group navigation.":::

1. On the **Resource groups** page, select your resource group.

   :::image type="content" source="media/get-started-create-service-instance/resource-group-page.png" alt-text="Select your resource group.":::

1. On the resource group page, select **Delete resource group**.
   
1. Type the name of your resource group, and then select **Delete**.

   :::image type="content" source="media/get-started-create-service-instance/delete-resource-group.png" alt-text="Delete resource group.":::

## Next steps

> [!div class="nextstepaction"]
> [Import and publish your first API](import-and-publish.md)
