---
title: Move an Azure Event Hubs dedicated cluster to another region | Microsoft Docs
description: This article shows you how to move an Azure Event Hubs dedicated cluster from the current region to another region. 
ms.topic: how-to
ms.date: 03/09/2022
---

# Move an Azure Event Hubs dedicated cluster to another region
This article shows you how to export an Azure Resource Manager template for an existing Event Hubs dedicated cluster and then use the template to create a cluster with same configuration settings in another region. 

If you have other resources such as namespaces and event hubs in the Azure resource group that contains the Event Hubs cluster, you may want to export the template at the resource group level so that all related resources can be moved to the new region in one step. The steps in this article show you how to export an **Event Hubs cluster** to the template. The steps for exporting a **resource group** to the template are similar. 

## Prerequisites
Ensure that the dedicated cluster can be created in the target region. The easiest way to find out is to use the Azure portal to try to [create an Event Hubs dedicated cluster](event-hubs-dedicated-cluster-create-portal.md). You see the list of regions that are supported at that point of time for creating the cluster. 

## Prepare
To get started, export a Resource Manager template. This template contains settings that describe your Event Hubs dedicated cluster.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** and then select your Event Hubs dedicated cluster.
3. On the **Event Hubs Cluster** page, select **Export template** in the **Automation** section on the left menu. 
4. Choose **Download** in the **Export template** page.

    :::image type="content" source="./media/move-cluster-across-regions/download-template.png" alt-text="Download Resource Manager template" lightbox="./media/move-cluster-across-regions/download-template.png":::
5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that include the template and scripts to deploy the template.


## Move

Deploy the template to create an Event Hubs dedicated cluster in the target region. 


1. In the Azure portal, select **Create a resource**.
2. In **Search the Marketplace**, type **template deployment**, and select **Template deployment (deploy using custom templates)**.
1. On the **Template deplyment** page, select **Create**. 
1. Select **Build your own template in the editor**.
1. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.
1. Update the value of the `location` property to point to the new region. To obtain location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, for example, `West US` is equal to `westus`.
1. Select **Save** to save the template. 
1. On the **Custom deployment** page, follow these steps: 
    1. Select an Azure **subscription**. 
    2. Select an existing **resource group** or create one. 
    3. Select the target **location** or region. If you selected an existing resource group, this setting is read-only. 
    4. In the **SETTINGS** section, do the following steps:    
        1. Enter the new **cluster name**. 

            :::image type="content" source="./media/move-cluster-across-regions/deploy-template.png" alt-text="Deploy Resource Manager template":::
    5. Select **Review + create** at the bottom of the page. 
    1. On the **Review + create** page, review settings, and then select **Create**.  

## Discard or clean up
After the deployment, if you want to start over, you can delete the **target Event Hubs dedicated cluster**, and repeat the steps described in the [Prepare](#prepare) and [Move](#move) sections of this article.

To commit the changes and complete the move of an Event Hubs cluster, delete the **Event Hubs cluster** in the original region. 

To delete an Event Hubs cluster (source or target) by using the Azure portal:

1. In the search window at the top of Azure portal, type **Event Hubs Clusters**, and select **Event Hubs Clusters** from search results. You see the Event Hubs cluster in a list.
2. Select the cluster to delete, and select **Delete** from the toolbar. 
3. On the **Delete Cluster** page, confirm the deletion by typing the **cluster name**, and then select **Delete**. 

## Next steps
In this tutorial, you learned how to move an Event Hubs dedicated cluster from one region to another. 

See the [Move Event Hubs namespaces across regions](move-across-regions.md) article for instructions on moving a namespace from one region to another region. 

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
