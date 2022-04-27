---
title: include file
description: include file
services: data-factory
author: jianleishen
ms.author: jianleishen
ms.service: data-factory
ms.topic: include
ms.custom: include file
ms.date: 06/27/2019
---

## Prerequisites

### Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Azure roles

To create Data Factory instances, the user account that you use to sign in to Azure must be a member of the *contributor* or *owner* role, or an *administrator* of the Azure subscription. To view the permissions that you have in the subscription, go to the [Azure portal](https://portal.azure.com), select your username in the upper-right corner, select "**...**" icon for more options, and then select **My permissions**. If you have access to multiple subscriptions, select the appropriate subscription.

To create and manage child resources for Data Factory - including datasets, linked services, pipelines, triggers, and integration runtimes - the following requirements are applicable:

- To create and manage child resources in the Azure portal, you must belong to the **Data Factory Contributor** role at the resource group level or above.
- To create and manage child resources with PowerShell or the SDK, the **contributor** role at the resource level or above is sufficient.

For sample instructions about how to add a user to a role, see the [Add roles](../../cost-management-billing/manage/add-change-subscription-administrator.md) article.

For more info, see the following articles:

- [Data Factory Contributor role](../../role-based-access-control/built-in-roles.md#data-factory-contributor)
- [Roles and permissions for Azure Data Factory](../concepts-roles-permissions.md)

### Azure Storage account

You use a general-purpose Azure Storage account (specifically Blob storage) as both *source* and *destination* data stores in this quickstart. If you don't have a general-purpose Azure Storage account, see [Create a storage account](../../storage/common/storage-account-create.md) to create one. 

#### Get the storage account name

You need the name of your Azure Storage account for this quickstart. The following procedure provides steps to get the name of your storage account: 

1. In a web browser, go to the [Azure portal](https://portal.azure.com) and sign in using your Azure username and password.
2. From the Azure portal menu, select **All services**, then select **Storage** > **Storage accounts**. You can also search for and select *Storage accounts* from any page.
3. In the **Storage accounts** page, filter for your storage account (if needed), and then select your storage account. 

You can also search for and select *Storage accounts* from any page.

#### Create a blob container

In this section, you create a blob container named **adftutorial** in Azure Blob storage.

1. From the storage account page, select **Overview** > **Containers**.
2. On the *\<Account name>* - **Containers** page's toolbar, select **Container**.
3. In the **New container** dialog box, enter **adftutorial** for the name, and then select **OK**. The *\<Account name>* - **Containers** page is updated to include **adftutorial** in the list of containers.

   :::image type="content" source="media/data-factory-quickstart-prerequisites/list-of-containers.png" alt-text="List of containers":::


#### Add an input folder and file for the blob container

In this section, you create a folder named **input** in the container you created, and then upload a sample file to the input folder. Before you begin, open a text editor such as **Notepad**, and create a file named **emp.txt** with the following content:

```emp.txt
John, Doe
Jane, Doe
```

Save the file in the **C:\ADFv2QuickStartPSH** folder. (If the folder doesn't already exist, create it.) Then return to the Azure portal and follow these steps:

1. In the *\<Account name>* - **Containers** page where you left off, select **adftutorial** from the updated list of containers.

   1. If you closed the window or went to another page, sign in to the [Azure portal](https://portal.azure.com) again.
   1. From the Azure portal menu, select **All services**, then select **Storage** > **Storage accounts**. You can also search for and select *Storage accounts* from any page.
   1. Select your storage account, and then select **Containers** > **adftutorial**.

2. On the **adftutorial** container page's toolbar, select **Upload**.
3. In the **Upload blob** page, select the **Files** box, and then browse to and select the **emp.txt** file.
4. Expand the **Advanced** heading. The page now displays as shown:

   :::image type="content" source="media/data-factory-quickstart-prerequisites/upload-blob-advanced.png" alt-text="Select Advanced link":::

5. In the **Upload to folder** box, enter **input**.
6. Select the **Upload** button. You should see the **emp.txt** file and the status of the upload in the list.
7. Select the **Close** icon (an **X**) to close the **Upload blob** page.

Keep the **adftutorial** container page open. You use it to verify the output at the end of this quickstart.