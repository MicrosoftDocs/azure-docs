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

1. Fill out the basic cluster details with the following information.

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster.|
    | Resource group | *test-resource-group* | Use an existing resource group or create a new resource group. |
    | Location | *West US* | Select *West US* for this quickstart. For a production system, select the region that best meets your needs.
    | | |

1. Select **Review + create** to review your cluster details, and **Create** to provision the cluster. Provisioning typically takes about 10 minutes.

1. When the deployment is complete, select **Go to resource**.

    ![Go to resource](media/create-cluster-database-portal/notification-resource.png)

# Add datasets

# Add recipients

# Review & Create
