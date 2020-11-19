---
title: Move Azure Event Grid partner namespaces to another region
description: This article shows you how to move Azure Event Grid partner namespaces from one region to another region.  
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 08/20/2020
#Customer intent: As an Azure service administrator, I want to be able to move an Azure Event Grid partner namespace from one region to another region to have it closer to customers, to meet internal policy and governance requirements, or in response to capacity planning requirements. 
---

# Move Azure Event Grid partner namespaces to another region
You might want to move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to meet internal policy and governance requirements, or in response to capacity planning requirements. 

Here are the high-level steps covered in this article: 

- **Export the partner namespace** resource to an Azure Resource Manager template. Delete definitions for event channel resources in the template. An event channel may have a reference to the Azure Resource Manager ID of the partner topic, which is owned by a customer. So, they can't be created by using the template in the target region.  
- **Use the template to deploy the partner namespace** to the target region. Then, create event channels in the new partner namespace in the target region. 
- To **complete the move**, delete the partner namespace from the source region. 

    > [!NOTE]
    > - Exporting **partner topics** to an Azure Resource Manager template isn't supported because customers can't create a partner topic directly. 
    > - **Partner registrations** are global resources (not tied to any specific region), so moving them from one region to another region isn't applicable. 

## Prerequisites
- Ensure that the Event Grid service is available in the target region. See [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

## Prepare
To get started, export a Resource Manager template for the partner namespace. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search bar at the top, type **Event Grid partner namespaces**, and select **Event Grid Partner Namespaces** from the results list. 
3. Select the **partner namespace** that you want to export to a Resource Manager template. 
4. On the **Event Grid Partner Namespace** page, select **Export Template** under **Settings** on the left menu, and then select **Download** on the toolbar. 

    :::image type="content" source="./media/move-partner-namespaces-across-regions/download-template.png" alt-text="Export template -> Download" lightbox="./media/move-partner-namespaces-across-regions/download-template.png":::   
5. Locate the **.zip** file that you downloaded from the portal, and unzip that file to a folder of your choice. This zip file contains template and parameters JSON files. 
1. Open the **template.json** in an editor of your choice. 
8. Update `location` for the **topic** resource to the target region or location. To obtain location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, for example, `West US` is equal to `westus`.

    ```json
    {
        "type": "Microsoft.EventGrid/partnerNamespaces",
        "apiVersion": "2020-04-01-preview",
        "name": "[parameters('partnerNamespace_name')]",
        "location": "westus",
        "properties": {
            "partnerRegistrationFullyQualifiedId": "[parameters('partnerRegistrations_ContosoCorpAccount1_externalid')]"
        }
    }
    ``` 
1. **Save** the template. 

## Recreate 
Deploy the template to create a partner namespace in the target region. 

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
    1. For **Location**, select the target region. If you selected an existing resource group, this setting is read-only. 
    1. For the **partner namespace name**, enter a name for the new partner namespace. 
    1. For the partner registration's external ID, enter the resource ID of the partner registration in the following format: `/subscriptions/<Azure subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/partnerRegistrations/<Partner registration name>`.
    1. Select the **I agree to the terms and conditions stated above** checkbox.     
    1. Select **Review + create** to start the deployment process. 
    1. On the **Review + create** page, review settings, and select **Create**. 

## Discard or clean up
To complete the move, delete the partner namespace in the source region.  

If you want to start over, delete the partner namespace in the target region, and repeat steps in the [Prepare](#prepare) and [Recreate](#recreate) sections of this article.

To delete a partner namespace by using the Azure portal:

1. In the search window at the top of Azure portal, type **Event Grid Partner Namespaces**, and select **Event Grid Partner Namespaces** from search results. 
2. Select the partner namespace to delete, and select **Delete** from the toolbar. 
3. **Confirm** the deletion to delete the partner namespace. 

## Next steps
You learned how to move an Event Grid partner namespace from one region to another region. See the following articles for moving system topics, custom topics, and domains across regions.

- [Move system topics across regions](move-system-topics-across-regions.md). 
- [Move custom topics across regions](move-custom-topics-across-regions.md). 
- [Move domains across regions](move-domains-across-regions.md).

To learn more about moving resources between regions and disaster recovery in Azure, see the following article: [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).