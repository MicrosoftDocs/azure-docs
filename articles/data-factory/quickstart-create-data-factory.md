---
title: Create an Azure Data Factory
description: Learn how to create a data factory using Azure Data Factory Studio or the Azure portal.
author: whhender
ms.topic: quickstart
ms.subservice: authoring
ms.date: 04/23/2025
ms.author: whhender
ms.reviewer: xupzhou

#customer intent: As a new data factory customer, I want to create a data factory instance so I can test its functions for my organization, or get started using it.

---

# Quickstart: Create a data factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This quickstart describes how to use either [Azure Data Factory Studio](https://adf.azure.com) or the [Azure portal UI](https://portal.azure.com) to create a data factory.

If you're new to Azure Data Factory, see the [introduction to the service](introduction.md) before you try this quickstart.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- Make sure that you have the required Azure roles to create a data factory. For more information, see [Roles and permissions for Azure Data Factory](concepts-roles-permissions.md).

## Create a data factory in Azure Data Factory Studio

Using Azure Data Factory Studio, you can create a data factory in seconds:

1. Open the Microsoft Edge or Google Chrome web browser. Currently, the Data Factory UI is supported only in these browsers.

1. Go to [Azure Data Factory Studio](https://adf.azure.com) and select the **Create a new data factory** option.

1. You can use the default values for the new data factory. Or you can choose a unique name, a preferred location, and a specific subscription. When you finish with these details, select **Create**.

   :::image type="content" source="media/quickstart-create-data-factory/create-with-azure-data-factory-studio.png" alt-text="Screenshot that shows the Azure Data Factory Studio page for creating a data factory.":::

1. After you create your data factory, you're taken to the home page of Azure Data Factory Studio where you can [get started](#related-content) using your data factory.

   :::image type="content" source="media/quickstart-create-data-factory/azure-data-factory-studio-home-page.png" alt-text="Screenshot that shows the Azure Data Factory Studio page for a created data factory.":::

## Create a data factory in the Azure portal

When you use the Azure portal to create a data factory, the creation options are more advanced:

1. Open the Microsoft Edge or Google Chrome web browser. Currently, the Data Factory UI is supported only in these browsers.

1. Go to the [page for data factories in the Azure portal](https://portal.azure.com/#browse/Microsoft.DataFactory%2FdataFactories).

1. Select **Create**.

   :::image type="content" source="media/quickstart-create-data-factory/data-factory-create-from-portal.png" alt-text="Screenshot of the Create button on the Azure portal page for data factories.":::

1. For **Resource group**, take one of the following steps:
   - Select an existing resource group from the dropdown list.
   - Select **Create new**, and then enter the name of a new resource group.

   To learn about resource groups, see [What is a resource group?](../azure-resource-manager/management/overview.md#resource-groups).

1. For **Region**, select a location for the data factory.

   The list shows only locations that Data Factory supports. This region is where your Data Factory metadata is stored. The associated data stores (like Azure Storage and Azure SQL Database) and computes (like Azure HDInsight) that Data Factory uses can run in other regions.

1. For **Name**, the name of the data factory must be *globally unique*. If you see an error that your name is already taken, change the name of the data factory (for example, to **\<yourname\>ADFTutorialDataFactory**) and try creating it again. To learn more about naming rules for Data Factory artifacts, see [Data Factory naming rules](naming-rules.md).

   :::image type="content" source="./media/doc-common-process/name-not-available-error.png" alt-text="Screenshot that shows an error for a new data factory that indicates a duplicate name.":::

1. For **Version**, select **V2**.

1. Select **Review + create**. After your configuration passes validation, select **Create**.

1. After the creation is complete, select **Go to resource**.

1. On the page for your data factory, select **Launch Studio** to open Azure Data Factory Studio. From here, you can [get started](#related-content) using your data factory.

   :::image type="content" source="./media/quickstart-create-data-factory/azure-data-factory-launch-studio.png" alt-text="Screenshot of the home page for a data factory in the Azure portal, with the button for opening Azure Data Factory Studio highlighted.":::

   > [!NOTE]
   > If the web browser is stuck at **Authorizing**, clear the **Block third-party cookies and site data** checkbox. Or keep it selected, create an exception for **login.microsoftonline.com**, and then try to open the app again.

## Related content

- Learn how to [use Azure Data Factory to copy data from one location to another](quickstart-hello-world-copy-data-tool.md).
- Learn how to [create a data flow by using Azure Data Factory](data-flow-create.md).
- Check our [list of top tutorials](data-factory-tutorials.md) to get started with other Azure Data Factory topics.
