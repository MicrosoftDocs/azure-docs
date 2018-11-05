---
 title: include file
 description: include file
 services: digital-twins
 author: dsk-2015
 ms.service: digital-twins
 ms.topic: include
 ms.date: 09/17/2018
 ms.author: dkshir
 ms.custom: include file
---

1. Sign in to the [Azure portal](http://portal.azure.com).

1. From the pane on the left, select **Create a resource**. Search for *digital twins*, and select **Digital Twins (preview)**. Select **Create** to start the deployment process.

    ![Create Digital Twins](./media/create-digital-twins-portal/create-digital-twins.png)

1. In the **Digital Twins** pane, enter the following information:
   * **Resource Name**: Create a unique name for your Digital Twins instance.
   * **Subscription**: Choose the subscription that you want to use to create this Digital Twins instance. 
   * **Resource group**: Select or create a [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups) for the Digital Twins instance.
   * **Location**: Select the closest location to your devices.

    ![Create Digital Twins](./media/create-digital-twins-portal/create-digital-twins-param.png)

1. Review your Digital Twins information. Then select **Create**. Your Digital Twins instance might take a few minutes to create. Monitor the progress in the **Notifications** pane.

1. Open the **Overview** pane of your Digital Twins instance. Note the link that shows under **Management API**.

    a. The **Management API** URL is formatted as https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/swagger. This URL takes you to the Azure Digital Twins REST API documentation that applies to your instance. To learn how to read and use this API documentation, read [How to use Azure Digital Twins Swagger](../articles/digital-twins/how-to-use-swagger.md).

    b. Modify the **Management API** URL to the format https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/api/v1.0/. Your application uses the modified URL as the base URL to access your instance. Copy this modified URL to a temporary file. You need this information in the preceding section.

    ![Management APIs](./media/create-digital-twins-portal/digital-twins-management-api.png)