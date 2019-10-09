---
title: Create a premium Azure file share
description: In this article, you learn how to create a premium Azure file share.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/05/2019
ms.author: rogarana
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Enable large fileshares

Originally, fileshares could only scale up to 5 TiB, now, with large file shares, they can scale up to 100 TiB. In order to scale up to 100 TiB, you must enable your storage account to use large fileshares. You can either enable an existing account or create a new account to use large file shares.


## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create a new storage account

Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, select **All services**. In the list of resources, type **Storage Accounts**. As you begin typing, the list filters based on your input. Select **Storage Accounts**.
1. On the **Storage Accounts** window that appears, choose **Add**.
1. Select the subscription in which to create the storage account.
1. Under the **Resource group** field, select **Create new**. Enter a name for your new resource group, as shown in the following image.

    ![Screenshot showing how to create a resource group in the portal](media/storage-files-how-to-create-large-file-share/create-large-file-share.png)

1. Next, enter a name for your storage account. The name you choose must be unique across Azure. The name also must be between 3 and 24 characters in length, and can include numbers and lowercase letters only.
1. Select a location for your storage account, or use the default location.
1. Set the replication to Locally-redundant storage.
1. Leave these fields set to their default values:

   |Field  |Value  |
   |---------|---------|
   |Deployment model     |Resource Manager         |
   |Performance     |Standard         |
   |Account kind     |StorageV2 (general-purpose v2)         |
   |Access tier     |Hot         |

1. Select **Advanced** and select **Enabled** for **Large file shares**.
1. Select **Review + Create** to review your storage account settings and create the account.
1. Select **Create**.


[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]