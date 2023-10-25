---
title: 'Share outside your org (Azure portal) - Azure Data Share quickstart'
description: Learn how to share data with customers and partners using Azure Data Share in this quickstart.
author: sidontha 
ms.author: sidontha
ms.service: data-share
ms.topic: quickstart
ms.date: 11/30/2022
ms.custom: mode-ui
---
# Quickstart: Share data using Azure Data Share in the Azure portal

In this quickstart, you'll learn how to set up a new Azure Data Share to share data from storage account using the Azure portal.

## Prerequisites

* Azure Subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* Your recipient's Azure sign in e-mail address (using their e-mail alias won't work).
* If the source Azure data store is in a different Azure subscription than the one you'll use to create Data Share resource, register the [Microsoft.DataShare resource provider](concepts-roles-permissions.md#resource-provider-registration) in the subscription where the Azure data store is located. 

### Share from a storage account

* An Azure Storage account: If you don't already have one, you can create an [Azure Storage account](../storage/common/storage-account-create.md)
* Permission to write to the storage account, which is present in *Microsoft.Storage/storageAccounts/write*. This permission exists in the **Contributor** role.
* Permission to add role assignment to the storage account, which is present in *Microsoft.Authorization/role assignments/write*. This permission exists in the **Owner** role. 

## Create a Data Share Account

Create an Azure Data Share resource in an Azure resource group.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select the **Create a resource** button (+) in the upper-left corner of the portal.

1. Search for *Data Share*.

1. Select **Data Share** and Select **Create**.

1. Fill out the basic details of your Azure Data Share resource with the following information. 

   **Setting** | **Suggested value** | **Field description**
   |---|---|---|
   | Subscription | Your subscription | Select the Azure subscription that you want to use for your data share account.|
   | Resource group | *test-resource-group* | Use an existing resource group or create a new resource group. |
   | Location | *East US 2* | Select a region for your data share account.
   | Name | *datashareaccount* | Specify a name for your data share account. |

1. Select **Review + create**, then **Create** to create your data share account. Creating a new data share account typically takes about 2 minutes or less.

1. When the deployment is complete, select **Go to resource**.

## Create a Share

1. Navigate to your Data Share Overview page.

   ![Share your data](./media/share-receive-data.png "Share your data") 

1. Select **Start sharing your data**.

1. Select **Create**.

1. Fill out the details for your share. Specify a name, share type, description of share contents, and terms of use (optional). 

   ![EnterShareDetails](./media/enter-share-details.png "Enter Share details") 

1. Select **Continue**.

1. To add Datasets to your share, select **Add Datasets**. 

   ![Add Datasets to your share](./media/datasets.png "Datasets")

1. Select the dataset type that you would like to add. You'll see a different list of dataset types depending on the share type (snapshot or in-place) you've selected in the previous step. 

   ![AddDatasets](./media/add-datasets.png "Add Datasets")    

1. Navigate to the object you would like to share and select 'Add Datasets'. 

   ![SelectDatasets](./media/select-datasets.png "Select Datasets")    

1. In the Recipients tab, enter in the email addresses of your Data Consumer by selecting '+ Add Recipient'.

   ![AddRecipients](./media/add-recipient.png "Add recipients") 

1. Select **Continue**.

1. If you have selected snapshot share type, you can configure snapshot schedule to provide updates of your data to your data consumer. 

   ![EnableSnapshots](./media/enable-snapshots.png "Enable snapshots") 

1. Select a start time and recurrence interval. 

1. Select **Continue**.

1. In the Review + Create tab, review your Package Contents, Settings, Recipients, and Synchronization Settings. Select **Create**.

Your Azure Data Share has now been created and the recipient of your Data Share is now ready to accept your invitation.

## Clean up resources

When the resource is no longer needed, go to the Data Share Overview page, and select **Delete** to remove it.

## Next steps

In this quickstart, you learned how to create an Azure Data Share. To learn about how a Data Consumer can accept and receive a data share, continue to the [accept and receive data](subscribe-to-data-share.md) tutorial. 
