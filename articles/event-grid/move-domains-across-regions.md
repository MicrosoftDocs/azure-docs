---
title: Move Azure Event Grid domains to another region
description: This article shows you how to move Azure Event Grid domains from one region to another region.  
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 08/20/2020
#Customer intent: As an Azure service administrator, I want to be able to move an Azure Event Grid domain and topics in the domain from one region to another region to have it closer to customers, to meet internal policy and governance requirements, or in response to capacity planning requirements.
---

# Move Azure Event Grid domains to another region
You might want to move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to meet internal policy and governance requirements, or in response to capacity planning requirements. 

Here are the high-level steps covered in this article: 

- **Export the domain** resource to an Azure Resource Manager template. 

    > [!IMPORTANT]
    > The domain resource and topics in the domain are exported to the template. Subscriptions to domain topics aren't exported. 
- **Use the template to deploy the domain** to the target region. 
- **Create subscriptions for domain topics manually** in the target region. When you exported the domain to a template in the current region, subscriptions for domain topics aren't exported. So, create them after the domain and domain topics are created in the target region. 
- **Verify the deployment**. Send an event to a domain topic in the domain and verify the event handler associated with the subscription is invoked. 
- To **complete the move**, delete domain from the source region. 

## Prerequisites
- Ensure that the Event Grid service is available in the target region. See [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

## Prepare
To get started, export a Resource Manager template for the domain. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search bar, type **Event Grid Domains**, and select **Event Grid Domains** from the results list. 

    :::image type="content" source="./media/move-domains-across-regions/search-domains.png" alt-text="Search for and select Event Grid domains":::
3. Select the **domain** that you want to export to a Resource Manager template. 

    :::image type="content" source="./media/move-domains-across-regions/select-domain.png" alt-text="Select the domain":::   
4. On the **Event Grid Domain** page, select **Export Template** under **Settings** on the left menu, and then select **Download** on the toolbar. 

    :::image type="content" source="./media/move-domains-across-regions/export-template-download.png" alt-text="Export template -> Download" lightbox="./media/move-domains-across-regions/export-template-download.png":::   

    > [!IMPORTANT]
    > Domain and domain topics are exported. Subscriptions for domain topics aren't exported. So, you need to create subscriptions for domain topics after you move domain topics. 
5. Locate the **.zip** file that you downloaded from the portal, and unzip that file to a folder of your choice. This zip file contains template and parameters JSON files. 
1. Open the **template.json** in an editor of your choice. 
8. Update `location` for the **domain** resource to the target region or location. To obtain location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, for example, `West US` is equal to `westus`.

    ```json
    "type": "Microsoft.EventGrid/domains",
    "apiVersion": "2020-06-01",
    "name": "[parameters('domains_spegriddomain_name')]",
    "location": "westus",
    ```
1. **Save** the template. 

## Recreate 
Deploy the template to create the domain and domain topics in the target region. 

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
    1. For the **domain name**, enter a new name for the domain. 
    1. Select **Review + create**. 
    
        :::image type="content" source="./media/move-domains-across-regions/deploy-template.png" alt-text="Deploy template":::        
    1. After the validation of the template succeeds, select **Create** at the bottom of the page to deploy the resource. 
    1. After the deployment succeeds, select **Go to resource group** to navigate to the resource group page. Confirm that there's a domain in the resource group. Select the domain. Confirm that there are domain topics in the domain. 

## Discard or clean up
To complete the move, delete the domain in the source region.  

If you want to start over, delete the domain in the target region, and repeat steps in the [Prepare](#prepare) and [Recreate](#recreate) sections of this article.

To delete a domain by using the Azure portal:

1. In the search window at the top of Azure portal, type **Event Grid Domains**, and select **Event Grid Domains** from search results. 
2. Select the domain to delete, and select **Delete** from the toolbar. 
3. On the confirmation page, enter the name of the resource group, and select **Delete**.  

To delete the resource group that contains the domain by using the Azure portal:

1. In the search window at the top of Azure portal, type **Resource groups**, and select **Resource groups** from search results. 
2. Select the resource group to delete, and select **Delete** from the toolbar. 
3. On the confirmation page, enter the name of the resource group, and select **Delete**.  

## Next steps
You learned how to move an Event Grid domain from one region to another region. See the following articles for moving system topics, custom topics, and partner namespaces across regions.

- [Move system topics across regions](move-system-topics-across-regions.md). 
- [Move custom topics across regions](move-custom-topics-across-regions.md). 

To learn more about moving resources between regions and disaster recovery in Azure, see the following article: [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).