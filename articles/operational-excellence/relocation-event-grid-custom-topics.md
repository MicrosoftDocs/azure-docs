---
title: Relocate Azure Event Grid custom topics to another region
description: This article shows you how to move Azure Event Grid custom topics to another region.  
author: anaharris-ms
ms.author: anaharris
ms.date: 05/14/2024
ms.service: azure-event-grid
ms.topic: how-to
ms.custom:
  - subject-relocation
#Customer intent: As an Azure service administrator, I want to be able to move Event Grid custom topics from one region to another region to have it closer to customers, to meet internal policy and governance requirements, or in response to capacity planning requirements. 
---

# Relocate Azure Event Grid custom topics to another region

[!INCLUDE [relocate-reasons](./includes/service-relocation-reason-include.md)]


This article describes how to relocate your Azure Event Grid resources to another Azure region. 

The high-level steps are: 

- **Export the custom topic** resource to an Azure Resource Manager template. 

    > [!IMPORTANT]
    > Only the custom topic is exported to the template. Any subscriptions for the topic aren't exported.
- **Use the template to deploy the custom topic** to the target region. 
- **Create subscriptions manually** in the target region. When you exported the custom topic to a template in the current region, only the topic is exported. Subscriptions aren't included in the template, so create them manually after the custom topic is created in the target region. 
- **Verify the deployment**. Verify that the custom topic is created in the target region. 
- To **complete the move**, delete custom topic from the source region. 

## Prerequisites

- Complete the [Quickstart: Route custom events to web endpoint](../event-grid/custom-event-quickstart-portal.md) in the source region. Do this step so that you can test steps in this article. 
- Ensure that the Event Grid service is available in the target region. See [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

## Prepare

To get started, export a Resource Manager template for the custom topic. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search bar, type **Event Grid topics**, and select **Event Grid Topics** from the results list. 

    :::image type="content" source="media/relocation/event-grid/move-custom-topics-across-regions/search-topics.png" alt-text="Screenshot of search for and select Event Grid topics page.":::
3. Select the **topic** that you want to export to a Resource Manager template. 

    :::image type="content" source="media/relocation/event-grid/move-custom-topics-across-regions/select-custom-topic.png" alt-text="Screenshot of select the custom topic page.":::   
4. On the **Event Grid Topic** page, select **Export Template** under **Settings** on the left menu, and then select **Download** on the toolbar. 

    :::image type="content" source="media/relocation/event-grid/move-custom-topics-across-regions/export-template-download.png" lightbox="media/relocation/event-grid/move-custom-topics-across-regions/export-template-download.png" alt-text="Screenshot of export template -> Download.":::


    > [!IMPORTANT]
    > Only the topic is exported to the template. Subscriptions for the topic aren't exported. So, you need to create subscriptions for the topic after you move the topic to the target region. 
5. Locate the **.zip** file you downloaded from the portal, and unzip that file to a folder of your choice. This zip file contains template and parameters JSON files. 
1. Open the **template.json** in an editor of your choice. 
8. Update `location` for the **topic** resource to the target region or location. To obtain location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, for example, `West US` is equal to `westus`.

    ```json
    "type": "Microsoft.EventGrid/topics",
    "apiVersion": "2020-06-01",
    "name": "[parameters('topics_mytopic0130_name')]",
    "location": "westus"
    ```
1. **Save** the template. 

## Redeploy

Deploy the template to create a custom topic in the target region. 

1. In the Azure portal, select **Create a resource**.
2. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
3. Select **Template deployment**.
4. Select **Create**.
5. Select **Build your own template in the editor**.
6. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.
7. Select **Save** to save the template. 
8. On the **Custom deployment** page, follow these steps: 
    1. Select an Azure **subscription**. 
    1. Select an existing **resource group** in the target region or create one. 
    1. For **Region**, select the target region. If you selected an existing resource group, this setting is read-only. 
    1. For the **topic name**, enter a new name for the topic. 
    1. Select **Review + create** at the bottom of the page. 
    
        :::image type="content" source="media/relocation/event-grid/move-custom-topics-across-regions/deploy-template.png" alt-text="Screenshot of custom deployment page.":::
    1. On the **Review + create** page, review settings, and select **Create**. 

## Verify

1. After the deployment succeeds, select **Go to resource**. 

    :::image type="content" source="media/relocation/event-grid/move-custom-topics-across-regions/navigate-custom-topic.png" alt-text="Screenshot of go to resource page.":::
1. Confirm that you see the **Event Grid Topic** page for the custom topic.   
1. Follow steps in the [Route custom events to a web endpoint](../event-grid/custom-event-quickstart-portal.md#send-an-event-to-your-topic) to send events to the topic. Verify that the webhook event handler is invoked. 

## Discard or clean up

To complete the move, delete the custom topic in the source region.  

If you want to start over, delete the topic in the target region, and repeat steps in the [Prepare](#prepare) and [Recreate](#redeploy) sections of this article.

To delete a custom topic by using the Azure portal:

1. In the search window at the top of Azure portal, type **Event Grid Topics**, and select **Event Grid Topics** from search results. 
2. Select the topic to delete, and select **Delete** from the toolbar. 
3. On the confirmation page, enter the name of the resource group, and select **Delete**.  

To delete the resource group that contains the custom topic by using the Azure portal:

1. In the search window at the top of Azure portal, type **Resource groups**, and select **Resource groups** from search results. 
2. Select the resource group to delete, and select **Delete** from the toolbar. 
3. On the confirmation page, enter the name of the resource group, and select **Delete**.  

## Related content

- [Relocate system topics across regions](relocation-event-grid-system-topics.md). 
- [Relocate domains across regions](relocation-event-grid-domains.md). 
- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).