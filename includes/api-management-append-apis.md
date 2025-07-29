---
author: vladvino
ms.service: azure-api-management
ms.topic: include
ms.date: 03/27/2025
ms.author: vlvinogr
---
## Append other APIs

You can compose an API out of APIs that are exposed by different services, including:

* An OpenAPI specification
* A SOAP API
* A GraphQL API
* A Web App that's hosted in Azure App Service
* Azure Functions
* Azure Logic Apps
* Azure Service Fabric

>[!NOTE] 
> When you import an API, the operations are appended to your current API.

To append an API to an existing API: 

1. Go to your Azure API Management instance in the Azure portal:

    :::image type="content" source="./media/api-management-append-apis/service-page-1.png" alt-text="Screenshot that shows the API Management services page." lightbox="./media/api-management-append-apis/service-page-1.png":::

1. Select **APIs** on the **Overview** page or select **APIs** > **APIs** in the menu on the left.

    :::image type="content" source="./media/api-management-append-apis/api-select-1.png" alt-text="Screenshot that shows the APIs selection on the Overview page." lightbox="./media/api-management-append-apis/api-select-1.png":::

1. Select the ellipsis (**...**) next to the API that you want to append another API to.

1. Select **Import** from the drop-down menu:

    :::image type="content" source="./media/api-management-append-apis/append-02.png" alt-text="Screenshot that shows the Import command." lightbox="./media/api-management-append-apis/append-02.png":::

1. Select a service from which to import an API.
