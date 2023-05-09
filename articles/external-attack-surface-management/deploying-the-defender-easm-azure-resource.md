---
title: Creating a Defender EASM Azure resource
description: This article explains how to create an Microsoft Defender External Attack Surface Management (Defender EASM) Azure resource using the Azure portal.
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 07/14/2022
ms.topic: quickstart
ms.custom: references_regions
---

# Creating a Defender EASM Azure resource

This article explains how to create a Microsoft Defender External Attack Surface Management (Defender EASM) Azure resource using the Azure portal.

Creating the EASM Azure resource involves two steps:

- Create a resource group
- Create an EASM resource in the resource group

## Prerequisites

Before you create a Defender EASM resource group, we recommend that you are familiar with how to access and use the [Microsoft Azure portal](https://portal.azure.com/) and read the [Defender EASM Overview article](index.md) for key context on the product. You will need:

- A valid Azure subscription or free Defender EASM trial account. If you don’t have an [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a free Azure account before you begin.

- Your Azure account must have a contributor role assigned for you to create a resource. To get this role assigned to your account, follow the steps in the [Assign roles](../role-based-access-control/role-assignments-steps.md) documentation, or contact your administrator.


## Create a resource group

1. To create a new resource group, first select **Resource groups** in the Azure portal.

    ![Screenshot of resource groups pane highlighted from Azure home page](media/QuickStart-1.png)

2. Under Resource Groups, select **Create**:

    ![Screenshot of "create resource” highlighted in resource group list view](media/QuickStart-2.png)

3. Select or enter the following property values:

- **Subscription**: Select an Azure subscription.
- **Resource Group**: Give the resource group a name.
- **Region**: Specify an Azure location. This location is where the resource group stores metadata about the resource. For compliance reasons, you may want to specify where that metadata is stored. In general, we recommend that you specify a location where most of your resources will be. Using the same location can simplify your template. The following regions are supported: 
  -  southcentralus
  -  eastus
  -  australiaeast
  -  westus3 
  -  swedencentral
  -  eastasia
  -  japaneast
  -  westeurope
  -  northeurope
  -  switzerlandnorth

    ![Screenshot of create resource group basics tab](media/QuickStart-3.png)

4. Select **Review + Create**.

5. Review the values, and then select **Create**.

6. Select **Refresh** to view the new resource group in the list.

## Create resources in a resource group

After you create a resource group, you can create EASM resources within the group by searching for EASM within the Azure portal. 

  
1. In the search box, type **Microsoft Defender EASM**, and then press Enter.

2. Select the **Create** button to create an EASM resource.

    ![Screenshot of "create” button highlighted from Defender EASM list view](media/QuickStart-5.png)

3. Select or enter the following property values:

   - **Subscription**: Select an Azure subscription.
   - **Resource Group**: Select the Resource Group created in the earlier step, or you can create a new one as part of the process of creating this resource.
   - **Name**: give the Defender EASM workspace a name.
   - **Region**: Select an Azure location. See the supported regions above. 


    ![Screenshot of create EASM resource basics tab](media/QuickStart-6.png)

4. Select **Review + Create**.

5. Review the values, and then select **Create**.

6. Select **Refresh** to see the status of the resource creation. Once finished, you can go to the Resource to get started.

## Next steps

- [Using and managing discovery](using-and-managing-discovery.md)
- [Understanding dashboards](understanding-dashboards.md)




