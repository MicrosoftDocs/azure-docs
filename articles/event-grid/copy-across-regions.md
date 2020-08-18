---
title: Copy an Azure Event Grid system topic to another region | Microsoft Docs
description: This article shows you how to move an Azure Event Grid system topic from the current region to another region. 
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 08/13/2020
#Customer intent: As an Azure service administrator, I want to be able to copy an Azure event source and its associated system topic from one region to another region to have it closer to customers. 
---

# Copy an Azure Event Grid system topic to another region
This article shows you how to copy an Azure Event Grid system topic from one region to another region. You might copy your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to meet internal policy and governance requirements, or in response to capacity planning requirements. 

> [!NOTE]
> Currently, you can only copy system topics and partner topics from one region to another region. Copying custom topics and domains across regions isn't supported yet. 

In this article, you learn how to copy a system topic from one region to another region. First, you export a template for the resource group that contains both the Azure resource and the system topic. Then, you use the template to deploy these resources to the target region. You can also export a template for just the system topic, but you need to remember to copy the Azure resource (for example: Azure Storage account) to the other region before copying the system topic. 

## Prerequisites
- Complete the [Quickstart: Route Blob storage events to web endpoint with the Azure portal](blob-event-quickstart-portal.md) in the source region. This step is **optional**. Do it to test steps in this article. Keep the storage account in a separate resource group from the App Service and App Service plan. 
- Ensure that the Event Grid service is available in the target region. See [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).
- For any preview features, ensure that your subscription is whitelisted for the target region.

## Prepare
To get started, export a Resource Manager template for the resource group that contains the system event source (for example: Azure Storage account) and its associated system topic. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups** on the left menu, and select the resource group that contains the event source for which the system topic was created. In the following example, it's the **Azure Storage** account. The resource group contains the storage account and its associated system topic. 

    :::image type="content" source="./media/copy-across-regions/resource-group-page.png" alt-text="Resource group page":::        
3. On the left menu, select **Export template** under **Settings**, and then, select **Download** on the toolbar. 

    :::image type="content" source="./media/copy-across-regions/export-template-menu.png" alt-text="Stroage account - Export template page":::        
5. Locate the **.zip** file that you downloaded from the portal, and unzip that file to a folder of your choice. This zip file contains template and parameters JSON files. 
6. Sensitive information isn't exported to the template. In this example, URL for the Webhook isn't exported to the template. So, do the following steps:
    1. Open the **template.json** in an editor of your choice. 
    1. Search for **WebHook**. 
    1. In the **Properties** section, add a comma (`,`) character at the end of the last line. In this example, it's `"preferredBatchSizeInKilobytes": 64`. 
    1. Add the `endpointUrl` property with the value set to your Webhook URL as shown in the following example. 

        ```json
        {
            "type": "Microsoft.EventGrid/systemTopics/eventSubscriptions",
            "apiVersion": "2020-04-01-preview",
            "name": "[concat(parameters('systemTopics_spcontosostorage_systopic_name'), '/spcontosostorage-eventsubscription')]",
            "dependsOn": [
                "[resourceId('Microsoft.EventGrid/systemTopics', parameters('systemTopics_spcontosostorage_systopic_name'))]"
            ],
            "properties": {
                "destination": {
                    "properties": {
                        "maxEventsPerBatch": 1,
                        "preferredBatchSizeInKilobytes": 64,
                        "endpointUrl": "https://mysite.azurewebsites.net/api/updates"
                    },
                    "endpointType": "WebHook"
                },
                "filter": {
                    "includedEventTypes": [
                        "Microsoft.Storage.BlobCreated",
                        "Microsoft.Storage.BlobDeleted"
                    ]
                },
                "labels": [],
                "eventDeliverySchema": "EventGridSchema",
                "retryPolicy": {
                    "maxDeliveryAttempts": 30,
                    "eventTimeToLiveInMinutes": 1440
                }
            }
        }    
        ```

## Recreate 
Deploy the template to create a storage account and a system topic for the storage account in the new region. 

1. In the Azure portal, select **Create a resource**.
2. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
3. Select **Template deployment**.
4. Select **Create**.
5. Select **Build your own template in the editor**.
6. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.
7. Select **Save** to save the template. 
8. On the **Custom deployment** page, follow these steps: 
    1. Select an Azure **subscription**. 
    2. Select an existing **resource group** or create one. 
    3. Select the target **location** or region. If you selected an existing resource group, this setting is read-only.
    4. In the **SETTINGS** section, do the following steps:    
        1. For the **storage account name**, enter a name for the storage account to be created in the target region. 
        1. For the **system topic name**, enter a name for the system topic that will be associated with the storage account. 

            :::image type="content" source="./media/copy-across-regions/deploy-template.png" alt-text="Deploy Resource Manager template":::
    5. Select the **I agree to the terms and conditions stated above** checkbox.     
    6. Now, select **Select Purchase** to start the deployment process. 

## Verify
In this example, upload a file to a container in the Azure Blob storage, and verify that the webhook has received the event. 

## Discard or clean up
After the deployment, if you want to start over, delete the resource group in the target region, and repeat steps in the [Prepare](#prepare) and [Recreate](#recreate) sections of this article.

If you want to use the event source and the system topic only from the new region, delete the resource group in the source region. 

To delete a resource group (source or target) by using the Azure portal:

1. In the search window at the top of Azure portal, type **Resource groups**, and select **Resource groups** from search results. 
2. Select the resource group to delete, and select **Delete** from the toolbar. 

    :::image type="content" source="./media/copy-across-regions/delete-resource-group-button.png" alt-text="Delete resource group":::
3. On the confirmation page, enter the name of the resource group, and select **Delete**.  

## Next steps
You learned how to copy an Azure event source and its associated system topic from one region to another region. To learn more about moving resources between regions and disaster recovery in Azure, see the following article: [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
