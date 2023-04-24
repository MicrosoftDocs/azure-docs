---
title: Create an Azure Data Factory
description: Learn how to create a data factory using UI from the Azure portal.
author: jonburchel
ms.service: data-factory
ms.subservice: tutorials
ms.topic: quickstart
ms.date: 10/24/2022
ms.author: xupzhou
---

# Quickstart: Create a data factory by using the Azure portal

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This quickstart describes how to use either the [Azure Data Factory Studio](https://adf.azure.com) or the [Azure portal UI](https://portal.azure.com) to create a data factory.

> [!NOTE]
> If you are new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md) before trying this quickstart. 

## Prerequisites

### Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### Azure roles

To learn about the Azure role requirements to create a data factory, refer to [Azure Roles requirements](quickstart-create-data-factory-dot-net.md?#azure-roles).

## Create a data factory

A quick creation experience provided in the Azure Data Factory Studio to enable users to create a data factory within seconds. More advanced creation options are available in Azure portal.

### Quick creation in the Azure Data Factory Studio

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
1. Go to the [Azure Data Factory Studio](https://adf.azure.com) and choose the **Create a new data factory** radio button.
1. You can use the default values to create directly, or enter a unique name and choose a preferred location and subscription to use when creating the new data factory.
   
   :::image type="content" source="media/quickstart-create-data-factory/create-with-azure-data-factory-studio.png" alt-text="Shows a screenshot of the Azure Data Factory Studio page to create a new data factory.":::

1. After creation, you can directly enter the homepage of the Azure Data Factory Studio.

   :::image type="content" source="media/quickstart-create-data-factory/azure-data-factory-studio-home-page.png" alt-text="Shows a screenshot of the Azure Data Factory Studio home page.":::

### Advanced creation in the Azure portal

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
1. Go to the [Azure portal data factories page](https://portal.azure.com). 
1. After landing on the data factories page of the Azure portal, click **Create**.

   :::image type="content" source="media/quickstart-create-data-factory/data-factory-create-from-portal.png" alt-text="Shows a screenshot of the Azure portal data factories Create button.":::

1. For **Resource Group**, take one of the following steps:
   1. Select an existing resource group from the drop-down list.
   1. Select **Create new**, and enter the name of a new resource group.
   
      To learn about resource groups, see [Use resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md). 

1. For **Region**, select the location for the data factory.

   The list shows only locations that Data Factory supports, and where your Azure Data Factory meta data will be stored. The associated data stores (like Azure Storage and Azure SQL Database) and computes (like Azure HDInsight) that Data Factory uses can run in other regions.
 
1. For **Name**, enter **ADFTutorialDataFactory**.
   
   The name of the Azure data factory must be *globally unique*. If you see the following error, change the name of the data factory (for example, **&lt;yourname&gt;ADFTutorialDataFactory**) and try creating again. For naming rules for Data Factory artifacts, see the [Data Factory - naming rules](naming-rules.md) article.

   :::image type="content" source="./media/doc-common-process/name-not-available-error.png" alt-text="New data factory error message for duplicate name.":::

1. For **Version**, select **V2**.

1. Select **Review + create**, and select **Create** after the validation is passed. After the creation is complete, select **Go to resource** to navigate to the **Data Factory** page. 

1. Select **Launch Studio** to open Azure Data Factory Studio to start the Azure Data Factory user interface (UI) application on a separate browser tab.
   
   :::image type="content" source="./media/quickstart-create-data-factory/azure-data-factory-launch-studio.png" alt-text="Home page for the Azure Data Factory, with the Open Azure Data Factory Studio tile highlighted.":::
   
   > [!NOTE]
   > If you see that the web browser is stuck at "Authorizing", clear the **Block third-party cookies and site data** check box. Or keep it selected, create an exception for **login.microsoftonline.com**, and then try to open the app again.

## Next steps
Learn how to use Azure Data Factory to copy data from one location to another with the [Hello World - How to copy data](quickstart-hello-world-copy-data-tool.md) tutorial.
Lean how to create a data flow with Azure Data Factory[data-flow-create.md].
