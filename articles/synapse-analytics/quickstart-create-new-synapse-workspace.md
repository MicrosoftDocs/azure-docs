---
title: Quickstart create a new Synapse Analytics workspace 
description: Create a new Azure Synapse Analytics workspace by following the steps in this guide. 
services: sql-data-warehouse #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: malvenko 
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: quickstart
ms.subservice: design #Required will update once these are established.
ms.date: 10/10/2019
ms.author: josels
ms.reviewer: jrasnick
#Customer intent: As an IT Pro, data engineer, or data scientist, I want to provision a new Synapse Analytics workspace so that I can explore, analyze, and get insights from my data.
---

<!---Recommended: Removal all the comments in this template before you sign-off or merge to master.--->

# Quickstart: Create a new Synapse Analytics workspace 

This quickstart describes the steps to create a Synapse Analytics workspace by using the Azure portal.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Azure Data Lake Storage Gen2 storage account](../storage/blobs/data-lake-storage-quickstart-create-account.md)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/)

## Create a Synapse Analytics workspace using the Azure portal

Include a sentence or two to explain only what is needed to complete the procedure.

1. Click on **Create a resource** from the left navigation menu (top-left part of the Azure portal page).
1. Click on **Analytics** from the list of categories, then click on **Synapse Analytics workspace**
1. Fill out the **Synapse workspace** form with the following information:

    | Setting | Suggested value | Description |
    | :------ | :-------------- | :---------- |
    | **Subscription** | Your subscription | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
    | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
    | **Workspace name** | mysampleworkspace | Specifies the name of the workspace, which will also be used for connection endpoints.|
    | **Region** | West US2 | Specifies the location of the workspace.|
    | **Data Lake Storage Gen2** | Account: `storage account name` </br> File system: `root file system to use` | Specifies the ADLS Gen2 storage account name to use as primary storage and the file system to use.|
    ||||

    The storage account can be selected from: 
    - A list of ADLS Gen2 accounts available in your subscription
    - Entered manually using the account name
    
    > [!IMPORTANT]
    > The Synapse workspace needs to be able to read and write to the selected ADLS Gen2 account. 
    >
    > Below the ADLS Gen2 selection fields, you will see a note that indicates if we can automatically configure the permissions to the workspace managed identity on the selected storage account and filesystem. 
    >
    > If the permissions cannot be configured automatically, the workspace managed identity needs to be granted **Blob Storage Data Contributor** permissions on the storage account and filesystem. Learn more. 
    > 
</br>
<!---   ![Browser](media/contribute-how-to-mvc-quickstart/browser.png) --->
   <!---Use screenshots but be judicious to maintain a reasonable length. Make sure screenshots align to the [current standards](contribute-mvc-screen-shots.md).
   If users access your product/service via a web browser the first screenshot should always include the full browser window in Chrome or Safari. This is to show users that the portal is browser-based - OS and browser agnostic.--->

4. (Optional) Modify any of the **Security + networking defaults** tab:

    | Setting | Suggested value | Description |
    | :------ | :-------------- | :---------- |
    | **Workspace managed identity** | enabled | Automatically grants CONTROL permission (inherits all permissions) to the workspace MSI to all SQL pools created in the workspace. This setting is necessary to run scheduled pipelines that read from or write to the SQL pool. |    
    | **Allow connections from all IP addresses** | Enabled | Allows you to connect to the workspace and resources without manually whitelisting each. This setting can be changed at any time after provisioning the workspace. |
    | **SQL administrator account** | sqladmin | Username for the SQL administrator account used to connect to the workspace's SQL server. |
    | **SQL administrator password** | *complex password* | Specifies the password for the SQL administrator account. This password can be reset at any point in time after provisioning the workspace. |
    ||||

4. (Optional) Add any tags in the **Tags** tab.
5. The **Summary** tab will run the necessary validations to ensure that the workspace can be successfully created:



## Next steps

<!--
Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](tutorial-facilities-app.md)
--->

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->
Once the deployment completes successfully, you will have created your new Synapse Analytics workspace. 

Next, you can create SQL pools or Apache Spark pools to start analyzing and exploring your data. 