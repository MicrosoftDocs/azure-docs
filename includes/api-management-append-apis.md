---
author: vladvino
ms.service: api-management
ms.topic: include
ms.date: 04/16/2021
ms.author: vlvinogr
---
## Append other APIs

You can compose an API of APIs exposed by different services, including:
* An OpenAPI specification
* A SOAP API
* A GraphQL API
* A Web App hosted in Azure App Service
* Azure Function App
* Azure Logic Apps
* Azure Service Fabric

Append a different API to your existing API using the following steps. 

>[!NOTE] 
> When you import another API, the operations are appended to your current API.

1. Go to your Azure API Management instance in the Azure portal.

    :::image type="content" source="./media/api-management-append-apis/service-page-1.png" alt-text="Go to Azure API Mgmt instance":::

1. Select **APIs** on the **Overview** page or from the menu on the left.

    :::image type="content" source="./media/api-management-append-apis/api-select-1.png" alt-text="Select APIs":::

1. Click **...** next to the API that you want to append another API to.
1. Select **Import** from the drop-down menu.

    :::image type="content" source="./media/api-management-append-apis/append-02.png" alt-text="Select import":::

1. Select a service from which to import an API.

    :::image type="content" source="./media/api-management-append-apis/select-to-import.png" alt-text="Select service":::
