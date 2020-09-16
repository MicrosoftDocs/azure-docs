---
title: Quickstart - Create an Azure API Management instance
description: Create a new Azure API Management service instance by using the Azure portal.
author: vladvino

ms.service: api-management
ms.topic: quickstart
ms.custom: mvc
ms.date: 09/08/2020
ms.author: apimpm
---

# Quickstart: Create a new Azure API Management service instance by using the Azure portal

Azure API Management (APIM) helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. APIM enables you to create and manage modern API gateways for existing backend services hosted anywhere. For more information, see the [Overview](api-management-key-concepts.md).

This quickstart describes the steps for creating a new API Management instance using the Azure portal.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

:::image type="content" source="media/get-started-create-service-instance/get-started-create-service-instance-created.png" alt-text="API Management instance":::

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a new service

1. From the Azure portal menu, select **Create a resource**. You can also select **Create a resource** on the Azure **Home** page. 
   
   :::image type="content" source="media/get-started-create-service-instance/00-CreateResource-01.png" alt-text="Select Create a resource":::

   
1. On the **New** page, select **Integration** > **API Management**.

   :::image type="content" source="media/get-started-create-service-instance/00-CreateResource-02.png" alt-text="New Azure API Management instance":::
   
1. In the **API Management service** page, enter settings.

   :::image type="content" source="media/get-started-create-service-instance/get-started-create-service-instance-create-new.png" alt-text="New instance":::
   
   | Setting                 | Description   |                                                                     
   |-------------------------|-----------------------------------------------|
   | **Name**                | A unique name for your API Management service. The name can't be changed later. The service name refers to both the service and the corresponding Azure resource. <br/> The service name is used to generate a default domain name: *\<name\>.azure-api.net.* If you would like to use a custom domain name, see [Configure a custom domain](configure-custom-domain.md). |
   | **Subscription**          | The subscription under which this new service instance will be created.   |
   | **Resource group**      |  Select a new or existing resource group. A resource group is a logical container into which Azure resources are deployed and managed. |
   | **Location**          | Select a geographic region near you from the available API Management service locations. | 
   | **Organization name**   | The name of your organization. This name is used in a number of places, including the title of the developer portal and sender of notification emails. |                                                         
   | **Administrator email** | The email address to which all the notifications from **API Management** will be sent.   |  
   | **Pricing tier**        | Select **Developer** tier to evaluate the service. This tier isn't for production use. For more information about scaling the API Management tiers, see [upgrade and scale](upgrade-and-scale.md). |

3. Select **Create**.

    > [!TIP]
    > It can take between 30 and 40 minutes to create and activate an API Management service in this tier. Selecting **Pin to dashboard** makes finding a newly created service easier.

[!INCLUDE [api-management-navigate-to-instance](../../includes/api-management-navigate-to-instance.md)]

Review the properties of your service on the **Overview** page.

   :::image type="content" source="media/get-started-create-service-instance/get-started-create-service-instance-created.png" alt-text="API Management instance":::

When your API Management service instance is online, you're ready to use it. Start with the tutorial to [import and publish your first API](import-and-publish.md).

## Clean up resources

When no longer needed, you can remove the resource group and all related resources by following these steps:

1. In the Azure portal, search for and select **Resource groups**. You can also select **Resource groups** on the **Home** page. 

   :::image type="content" source="media/get-started-create-service-instance/00-DeleteResource-01.png" alt-text="Resource group navigation":::

1. On the **Resource groups** page, select your resource group.

   :::image type="content" source="media/get-started-create-service-instance/00-DeleteResource-02.png" alt-text="Select resource group":::

1. On the resource group page, select **Delete resource group**. 
   
1. Type the name of your resource group, and then select **Delete**.

   :::image type="content" source="media/get-started-create-service-instance/00-DeleteResource-03.png" alt-text="Delete resource group":::

## Next steps

> [!div class="nextstepaction"]
> [Import and publish your first API](import-and-publish.md)
