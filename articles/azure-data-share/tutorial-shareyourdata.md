---
title: Tutorial - Share data with your customers and partners  
description: Tutorial - Share data with your customers and partners  
services: azure-data-share
author: joannapea

ms.service: azure-data-share
ms.topic: tutorial
ms.date: 07/14/2019
ms.author: joannapea
---
# Tutorial: Share Azure Data from Azure Blob Storage and/or Azure Data Lake Gen1/Azure Data Lake Gen2 using Azure Data Share

This tutorial will teach you how to share data from Azure Blob Storage/ADLS using Azure Data Share. 

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a Data Share.
> * Add datasets to your Data Share.
> * Enable a synchronization schedule for your Data Share. 
> * Add recipients to your Data Share. 

# Prerquisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Azure Storage account and/or Azure Data Lake account

# Create an Azure Data Share resource

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

# Create a Data Share Account

Create an Azure Data Share resource in an Azure resource group.

1. Select the **Create a resource** button (+) in the upper-left corner of the  portal.

1. Search for *Azure Data Share*.

1. Under **Azure Data Share**, at the bottom of the screen, select **Create**.

1. Fill out the basic details of your Azure Data Share resource with the following information. 

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Name | *datashareacount* | Specify a name for your Data Share account. |
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster.|
    | Resource group | *test-resource-group* | Use an existing resource group or create a new resource group. |
    | Location | *East US 2* | Select the region that best meets your needs. If possible, select a region that matches the region containing the data sets you will be sharing. 
    | | |

1. Select **New** to provision your Data Share Account. This typically takes about 1 minute or less. 

1. When the deployment is complete, select **Go to resource**.

# Create a Data Share

1. In your Data Share Account, select 'Start sharing your data'. 
    ![StartSharing](./media/1startsharing.png "Start sharing your data")

1. Select **Create**
   

1. Fill out the details for your Data Share by specifying a name for the share, a description of the type of data the share contains, and the terms of use. 

    ![EnterShareDetails](./media/2entersharedetails.png "Enter Share details") 

    
1. If you would like to offer a synchronization schedule for your Data Consumer, enable the Scheduled refresh slider shown below and select a recurrence interval. 
    ![EnableRefresh](./media/3refreshpolicy.png "Enable synchronization schedule")

1. Click **Continue**

1. To add Datasets to your Data Share, click **Add Datasets**. 


1. 


# Add recipients

# Review & Create
