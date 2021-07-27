---
title: Move Azure Event Grid system topics to another region
description: This article shows you how to move Azure Event Grid system topics from one region to another region.  
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 08/28/2020
#Customer intent: As an Azure service administrator, I want to be able to move an Azure event source and its associated system topic from one region to another region to have it closer to customers, to meet internal policy and governance requirements, or in response to capacity planning requirements. 
---

# Move Azure Event Grid system topics to another region
You might want to move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to meet internal policy and governance requirements, or in response to capacity planning requirements. 

Here are the high-level steps covered in this article: 

- **Export the resource group** that contains the Azure Storage account and its associated system topic to a Resource Manager template. You can also export a template only for the system topic. If you go this route, remember to move the Azure event source (in this example, an Azure Storage account) to the other region before moving the system topic. Then, in the exported template for the system topic, update the external ID for the storage account in the target region. 
- **Modify the template** to add the `endpointUrl` property to point to a webhook that subscribes to the system topic. When the system topic is exported, its subscription (in this case, it's a webhook) is also exported to the template, but the `endpointUrl` property isn't included. So, you need to update it to point to the endpoint that subscribes to the topic. Also, update the value of the `location` property to the new location or region. For other types of event handlers, you need to the update only the location. 
- **Use the template to deploy resources** to the target region. You'll specify names for the storage account and the system topic to be created in the target region. 
- **Verify the deployment**. Verify that the webhook is invoked when you upload a file to the blob storage in the target region. 
- To **complete the move**, delete resources (event source and system topic) from the source region. 

## Prerequisites
- Complete the [Quickstart: Route Blob storage events to web endpoint with the Azure portal](blob-event-quickstart-portal.md) in the source region. This step is **optional**. Do it to test steps in this article. Keep the storage account in a separate resource group from the App Service and App Service plan. 
- Ensure that the Event Grid service is available in the target region. See [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

## Prepare
To get started, export a Resource Manager template for the resource group that contains the system event source (Azure Storage account) and its associated system topic. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups** on the left menu. Then, select the resource group that contains the event source for which the system topic was created. In the following example, it's the **Azure Storage** account. The resource group contains the storage account and its associated system topic. 

    :::image type="content" source="./media/move-system-topics-across-regions/resource-group-page.png" alt-text="Resource group page":::        
3. On the left menu, select **Export template** under **Settings**, and then, select **Download** on the toolbar. 

    :::image type="content" source="./media/move-system-topics-across-regions/export-template-menu.png" alt-text="Stroage account - Export template page":::        
5. Locate the **.zip** file that you downloaded from the portal, and unzip that file to a folder of your choice. This zip file contains template and parameters JSON files. 
1. Open the **template.json** in an editor of your choice. 
1. URL for the Webhook isn't exported to the template. So, do the following steps:
    1. In the template file, search for **WebHook**. 
    1. In the **Properties** section, add a comma (`,`) character at the end of the last line. In this example, it's `"preferredBatchSizeInKilobytes": 64`. 
    1. Add the `endpointUrl` property with the value set to your Webhook URL as shown in the following example. 

        ```json
        "destination": {
            "properties": {
                "maxEventsPerBatch": 1,
                "preferredBatchSizeInKilobytes": 64,
                "endpointUrl": "https://mysite.azurewebsites.net/api/updates"
            },
            "endpointType": "WebHook"
        }
        ```

        > [!NOTE]
        > For other types of event handlers, all properties are exported to the template. You only need to update the `location` property to the target region as shown in the next step. 
7. Update `location` for the **storage account** resource to the target region or location. To obtain location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, for example, `West US` is equal to `westus`.

    ```json
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2019-06-01",
    "name": "[parameters('storageAccounts_spegridstorage080420_name')]",
    "location": "westus",
    ```
8. Repeat the step to update `location` for the **system topic** resource in the template. 

    ```json
    "type": "Microsoft.EventGrid/systemTopics",
    "apiVersion": "2020-04-01-preview",
    "name": "[parameters('systemTopics_spegridsystopic080420_name')]",
    "location": "westus",
    ```
1. **Save** the template. 

## Recreate 
Deploy the template to create a storage account and a system topic for the storage account in the target region. 

1. In the Azure portal, select **Create a resource**.
2. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
3. Select **Template deployment**.
4. Select **Create**.
5. Select **Build your own template in the editor**.
6. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.
7. Select **Save** to save the template. 
8. On the **Custom deployment** page, follow these steps. 
    1. Select an Azure **subscription**. 
    1. Select an existing **resource group** in the target region or create one. 
    1. For **Region**, select the target region. If you selected an existing resource group, this setting is read-only.
    1. For the **system topic name**, enter a name for the system topic that will be associated with the storage account.  
    1. For the **storage account name**, enter a name for the storage account to be created in the target region. 

        :::image type="content" source="./media/move-system-topics-across-regions/deploy-template.png" alt-text="Deploy Resource Manager template":::
    5. Select **Review + create** at the bottom of the page. 
    1. On the **Review + create** page, review settings, and select **Create**. 

## Verify
1. After the deployment succeeds, select **Goto resource group**. 
1. On the **Resource group** page, verify that the event source (in this example, Azure Storage account) and the system topic are created. 
1. Upload a file to a container in the Azure Blob storage, and verify that the webhook has received the event. For more information, see [Send an event to your endpoint](blob-event-quickstart-portal.md#send-an-event-to-your-endpoint).

## Discard or clean up
To complete the move, delete the resource group that contains the storage account and its associated system topic in the source region.  

If you want to start over, delete the resource group in the target region, and repeat steps in the [Prepare](#prepare) and [Recreate](#recreate) sections of this article.

To delete a resource group (source or target) by using the Azure portal:

1. In the search window at the top of Azure portal, type **Resource groups**, and select **Resource groups** from search results. 
2. Select the resource group to delete, and select **Delete** from the toolbar. 

    :::image type="content" source="./media/move-system-topics-across-regions/delete-resource-group-button.png" alt-text="Delete resource group":::
3. On the confirmation page, enter the name of the resource group, and select **Delete**.  

## Next steps
You learned how to move an Azure event source and its associated system topic from one region to another region. See the following articles for moving custom topics, domains, and partner namespaces across regions.

- [Move custom topics across regions](move-custom-topics-across-regions.md). 
- [Move domains across regions](move-domains-across-regions.md). 

To learn more about moving resources between regions and disaster recovery in Azure, see the following article: [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).
