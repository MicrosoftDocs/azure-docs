---
title: Create an Azure Data Factory
description: Learn how to create a data factory using UI from the Azure portal.
author: jonburchel
ms.service: data-factory
ms.subservice: tutorials
ms.topic: quickstart
ms.date: 07/09/2022
ms.author: jburchel
---

# Quickstart: Create a data factory by using the Azure portal

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This quickstart describes how to use the Azure portal UI to create a data factory.

> [!NOTE]
> If you are new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md) before doing this quickstart. 

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

### Video 
Watching this video helps you understand the Data Factory UI: 
>[!VIDEO https://docs.microsoft.com/Shows/Azure-Friday/Visually-build-pipelines-for-Azure-Data-Factory-v2/Player]

## Create a data factory

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
1. Go to the [Azure portal](https://portal.azure.com). 
1. From the Azure portal menu, select **Create a resource**.
1. Select **Integration**, and then select **Data Factory**. 
   
   :::image type="content" source="./media/doc-common-process/new-azure-data-factory-menu.png" alt-text="Data Factory selection in the New pane.":::

1. On the **Create Data Factory** page, under **Basics** tab, select your Azure **Subscription** in which you want to create the data factory.
1. For **Resource Group**, take one of the following steps:

    a. Select an existing resource group from the drop-down list.

    b. Select **Create new**, and enter the name of a new resource group.
    
    To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md). 

1. For **Region**, select the location for the data factory.

   The list shows only locations that Data Factory supports, and where your Azure Data Factory meta data will be stored. The associated data stores (like Azure Storage and Azure SQL Database) and computes (like Azure HDInsight) that Data Factory uses can run in other regions.
 
1. For **Name**, enter **ADFTutorialDataFactory**.
   The name of the Azure data factory must be *globally unique*. If you see the following error, change the name of the data factory (for example, **&lt;yourname&gt;ADFTutorialDataFactory**) and try creating again. For naming rules for Data Factory artifacts, see the [Data Factory - naming rules](naming-rules.md) article.

    :::image type="content" source="./media/doc-common-process/name-not-available-error.png" alt-text="New data factory error message for duplicate name.":::

1. For **Version**, select **V2**.

1. Select **Next: Git configuration**, and then select **Configure Git later** check box.

1. Select **Review + create**, and select **Create** after the validation is passed. After the creation is complete, select **Go to resource** to navigate to the **Data Factory** page. 

1. Select **Open** on the **Open Azure Data Factory Studio** tile to start the Azure Data Factory user interface (UI) application on a separate browser tab.
   
    :::image type="content" source="./media/doc-common-process/data-factory-home-page.png" alt-text="Home page for the Azure Data Factory, with the Open Azure Data Factory Studio tile.":::
   
   > [!NOTE]
   > If you see that the web browser is stuck at "Authorizing", clear the **Block third-party cookies and site data** check box. Or keep it selected, create an exception for **login.microsoftonline.com**, and then try to open the app again.

## Next steps
- Learn how to use Azure Data Factory to copy data from one location to another with the [Hello World - How to copy data](tutorial-copy-data-portal.md) tutorial.
- Learn how to use Azure Data Factory to transform data with the [Hello World - How to transform data]() tutorial.
