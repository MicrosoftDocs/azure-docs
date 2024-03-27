---
title: Relocation guidance in Azure Event Hubs
description: Learn how to relocate Azure Event Hubs to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/24/2024
ms.service: event-hubs
ms.topic: concept
ms.custom:
  - subject-relocation
---

# Relocate Azure Event Hubs to another region


This article shows you how to to copy an Event Hubs namespace and configuration settings to another region. 

If you have other resources in the Azure resource group that contains the Event Hubs namespace, you may want to export the template at the resource group level so that all related resources can be moved to the new region in one step.  To learn how to export a **resource group** to the template, see [Move resources across regions(from resource group)](/azure/resource-mover/move-region-within-resource-group).

 
## Prerequisites

- Ensure that the services and features that your account uses are supported in the target region.

- If you have **capture feature** enabled for event hubs in the namespace, move [Azure Storage or Azure Data Lake Store Gen 2](../storage/common/storage-account-move.md) accounts before moving the Event Hubs namespace. You can also move the resource group that contains both Storage and Event Hubs namespaces to the other region by following steps similar to the ones described in this article. 

- If the Event Hubs namespace is in an **Event Hubs cluster**, [move the dedicated cluster](../event-hubs/move-cluster-across-regions.md) to the **target region** before you go through steps in this article. You can also use the [quickstart template on GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-cluster-namespace-eventhub/) to create an Event Hubs cluster. In the template, remove the namespace portion of the JSON to create only the cluster. 

- Identify all resources dependencies. Depending on how you've deployed Event Hub, the following services *may* need deployment in the target region:

    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Azure Private Link Service](./relocation-private-link.md)
    - [Virtual Network](./relocation-virtual-network.md)
    - Event Hub Namespace
    - [Event Hub Cluster](./relocation-event-hub-cluster.md)
    - [Storage Account](./relocation-storage-account.md)
        >[!TIP]
        >When Capture is enabled, you can either relocate a Storage Account from the source or use an existing one in the target region.

- Identify all dependent resources. Event Hub is a messaging system that lets applications publish and subscribe for messages.  Consider whether or not your application at target requires messaging support for the same set of dependent services that it had at the source target.

## Prepare

To get started, export a Resource Manager template. This template contains settings that describe your Event Hubs namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** and then select your Event Hubs namespace.
3. On the **Event Hubs Namespace** page, select **Export template** under **Automation** in the left menu. 
4. Choose **Download** in the **Export template** page.

    ![Screenshot showing where to download Resource Manager template](../event-hubs/media/move-across-regions/download-template.png)
5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that include the template and scripts to deploy the template.


## Redeploy

Deploy the template to create an Event Hubs namespace in the target region. 


1. In the Azure portal, select **Create a resource**.
2. In **Search the Marketplace**, type **template deployment**, and select **Template deployment (deploy using custom templates)**.
5. Select **Build your own template in the editor**.
6. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.
1. Update the value of the `location` property to point to the new region. To obtain location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, for example, `West US` is equal to `westus`.
1. Select **Save** to save the template. 
1. On the **Custom deployment** page, follow these steps: 
    1. Select an Azure **subscription**. 
    2. Select an existing **resource group** or create one. If the source namespace was in an Event Hubs cluster, select the resource group that contains cluster in the target region. 
    3. Select the target **location** or region. If you selected an existing resource group, this setting is read-only. 
    4. In the **SETTINGS** section, do the following steps:    
        1. Enter the new **namespace name**. 

            ![Deploy Resource Manager template](../event-hubs//media/move-across-regions/deploy-template.png)
        2. If your source namespace was in an **Event Hubs cluster**, enter names of **resource group** and **Event Hubs cluster** as part of **external ID**. 

              ```
              /subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<CLUSTER'S RESOURCE GROUP>/providers/Microsoft.EventHub/clusters/<CLUSTER NAME>
              ```   
        3. If event hub in your namespace uses a Storage account for capturing events, specify the resource group name and the storage account for `StorageAccounts_<original storage account name>_external` field. 
            
            ```
            /subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/<STORAGE'S RESOURCE GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>
            ```    
    5. Select **Review + create** at the bottom of the page. 
    1. On the **Review + create** page, review settings, and then select **Create**.   

## Discard or clean up
After the deployment, if you want to start over, you can delete the **target Event Hubs namespace**, and repeat the steps described in the [Prepare](#prepare) and [Move](#redeploy) sections of this article.

To commit the changes and complete the move of an Event Hubs namespace, delete the **Event Hubs namespace** in the original region. Make sure that you processed all the events in the namespace before deleting the namespace. 

To delete an Event Hubs namespace (source or target) by using the Azure portal:

1. In the search window at the top of Azure portal, type **Event Hubs**, and select **Event Hubs** from search results. You see the Event Hubs namespaces in a list.
2. Select the target namespace to delete, and select **Delete** from the toolbar. 

    ![Screenshot showing Delete namespace - button](../event-hubs//media/move-across-regions/delete-namespace-button.png)
3. On the **Delete Namespace** page, confirm the deletion by typing the **namespace name**, and then select **Delete**. 

## Next steps

In this how-to, you learned how to move an Event Hubs namespace from one region to another. 

See the [Relocate Event Hubs to another region](relocation-event-hub-cluster.md) article for instructions on moving an Event Hubs cluster from one region to another region. 

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
