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

1. From the left side navigation pane, click **Create a resource**. Then search for *digital twins*, and select **Digital Twins (preview)**. Click **Create** to start the deployment process.

1. In the **Digital Twins** pane, enter the following information:
   * **Resource Name**: Create a unique name for your Digital Twins.
   * **Subscription**: Choose the subscription that you want to use to create this Digital Twins instance. 
   * **Resource group**: Select or create a [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups) for the Digital Twins instance.
   * **Location**: Select the closest location to your devices.

       ![Create Digital Twins](./media/create-digital-twins-portal/create-digital-twins-param.png)

1. Review your Digital Twins information, then click **Create**. Your Digital Twins might take a few minutes to create. You can monitor the progress in the **Notifications** pane.

1. Open the **Overview** pane of your Digital Twins instance. Note the link that shows under **Management API**  
    - This URL is of the format `https://yourDigitalTwinsName.yourLocation.azuresmartspaces.net/management/swagger` and represents the Digital Twins Management APIs Swagger documentation. Click this link from the portal to learn about supported APIs. 
    - URL `https://yourDigitalTwinsName.yourDigitalTwinsName.azuresmartspaces.net/management/api/v1.0/` represents the base URL that will be used to access the APIs by any client. Copy this URL to a temporary *Notepad* file. You will need this URL in proceeding steps. 

    ![Management APIs](./media/create-digital-twins-portal/digital-twins-management-api.png)