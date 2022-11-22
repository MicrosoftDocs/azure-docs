---
title: Connect to Azure Data Factory 
description: This article describes how to connect Azure Data Factory and Microsoft Purview to track data lineage.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/01/2021
---
# How to connect Azure Data Factory and Microsoft Purview

This document explains the steps required for connecting an Azure Data Factory account with a Microsoft Purview account to track data lineage. The document also gets into the details of the coverage scope and supported lineage patterns.

## View existing Data Factory connections

Multiple Azure Data Factories can connect to a single Microsoft Purview to push lineage information. The current limit allows you to connect up to 10 Data Factory accounts at a time from the Microsoft Purview management center. To show the list of Data Factory accounts connected to your Microsoft Purview account, do the following:

1. Select **Management** on the left navigation pane.
2. Under **Lineage connections**, select **Data Factory**.
3. The Data Factory connection list appears.

    :::image type="content" source="./media/how-to-link-azure-data-factory/data-factory-connection.png" alt-text="Screen shot showing a data factory connection list." lightbox="./media/how-to-link-azure-data-factory/data-factory-connection.png":::

4. Notice the various values for connection **Status**:

    - **Connected**: The data factory is connected to the Microsoft Purview account.
    - **Disconnected**: The data factory has access to the catalog, but it's connected to another catalog. As a result, data lineage won't be reported to the catalog automatically.
    - **CannotAccess**: The current user doesn't have access to the data factory, so the connection status is unknown.

>[!Note]
>To view the Data Factory connections, you need to be assigned the following role. Role inheritance from management group is not supported.
>**Collection admins** role on the root collection.

## Create new Data Factory connection

>[!Note]
>To add or remove the Data Factory connections, you need to be assigned the following role. Role inheritance from management group is not supported.
>**Collection admins** role on the root collection.
>
> Also, it requires the users to be the data factory's "Owner" or "Contributor".
>
> Your data factory needs to have system assigned managed identity enabled.

Follow the steps below to connect an existing data factory to your Microsoft Purview account. You can also [connect Data Factory to Microsoft Purview account from ADF](../data-factory/connect-data-factory-to-azure-purview.md).

1. Select **Management** on the left navigation pane.
2. Under **Lineage connections**, select **Data Factory**.
3. On the **Data Factory connection** page, select **New**.

4. Select your Data Factory account from the list and select **OK**. You can also filter by subscription name to limit your list.

    Some Data Factory instances might be disabled if the data factory is already connected to the current Microsoft Purview account, or the data factory doesn't have a managed identity.

    A warning message will be displayed if any of the selected Data Factories are already connected to other Microsoft Purview account. By selecting OK, the Data Factory connection with the other Microsoft Purview account will be disconnected. No additional confirmations are required.

    :::image type="content" source="./media/how-to-link-azure-data-factory/warning-for-disconnect-factory.png" alt-text="Screenshot showing warning to disconnect Azure Data Factory.":::

>[!Note]
>We support adding up to 10 Azure Data Factory accounts at once. If you want to add more than 10 data factory accounts, do so in multiple batches.

### How authentication works

Data factory's managed identity is used to authenticate lineage push operations from data factory to Microsoft Purview. When connecting data factory to Microsoft Purview on UI, it adds the role assignment automatically.

Grant the data factory's managed identity **Data Curator** role on Microsoft Purview **root collection**. Learn more about [Access control in Microsoft Purview](../purview/catalog-permissions.md) and [Add roles and restrict access through collections](../purview/how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

### Remove data factory connections

To remove a data factory connection, do the following:

1. On the **Data Factory connection** page, select the **Remove** button next to one or more data factory connections.
2. Select **Confirm** in the popup to delete the selected data factory connections.

    :::image type="content" source="./media/how-to-link-azure-data-factory/remove-data-factory-connection.png" alt-text="Screenshot showing how to select data factories to remove connection." lightbox="./media/how-to-link-azure-data-factory/remove-data-factory-connection.png":::

## Supported Azure Data Factory activities

Microsoft Purview captures runtime lineage from the following Azure Data Factory activities:

- [Copy Data](../data-factory/copy-activity-overview.md)
- [Data Flow](../data-factory/concepts-data-flow-overview.md)
- [Execute SSIS Package](../data-factory/how-to-invoke-ssis-package-ssis-activity.md)

> [!IMPORTANT]
> Microsoft Purview drops lineage if the source or destination uses an unsupported data storage system.

The integration between Data Factory and Microsoft Purview supports only a subset of the data systems that Data Factory supports, as described in the following sections.

[!INCLUDE[data-factory-supported-lineage-capabilities](includes/data-factory-common-supported-capabilities.md)]

### Execute SSIS Package support

Refer to [supported data stores](how-to-lineage-sql-server-integration-services.md#supported-data-stores).

## Access secured Microsoft Purview account
      
If your Microsoft Purview account is protected by firewall, learn how to let Data Factory [access a secured Microsoft Purview account](../data-factory/how-to-access-secured-purview-account.md) through Microsoft Purview private endpoints.

## Bring Data Factory lineage into Microsoft Purview

For an end to end walkthrough, follow the [Tutorial: Push Data Factory lineage data to Microsoft Purview](../data-factory/turorial-push-lineage-to-purview.md).

## Supported lineage patterns

There are several patterns of lineage that Microsoft Purview supports. The generated lineage data is based on the type of source and sink used in the Data Factory activities. Although Data Factory supports over 80 source and sinks, Microsoft Purview supports only a subset, as listed in [Supported Azure Data Factory activities](#supported-azure-data-factory-activities).

To configure Data Factory to send lineage information, see [Get started with lineage](catalog-lineage-user-guide.md#get-started-with-lineage).

Some other ways of finding information in the lineage view, include the following:

- In the **Lineage** tab, hover on shapes to preview additional information about the asset in the tooltip.
- Select the node or edge to see the asset type it belongs or to switch assets.
- Columns of a dataset are displayed in the left side of the **Lineage** tab. For more information about column-level lineage, see [Dataset column lineage](catalog-lineage-user-guide.md#dataset-column-lineage).

### Data lineage for 1:1 operations

The most common pattern for capturing data lineage, is moving data from a single input dataset to a single output dataset, with a process in between.

An example of this pattern would be the following:

- 1 source/input: *Customer* (SQL Table)
- 1 sink/output: *Customer1.csv* (Azure Blob)
- 1 process: *CopyCustomerInfo1\#Customer1.csv* (Data Factory Copy activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-copy-lineage.png" alt-text="Screenshot showing the lineage for a one to one Data Factory Copy operation.":::

### Data movement with 1:1 lineage and wildcard support

Another common scenario for capturing lineage, is using a wildcard to copy files from a single input dataset to a single output dataset. The wildcard allows the copy activity to match multiple files for copying using a common portion of the file name. Microsoft Purview captures file-level lineage for each individual file copied by the corresponding copy activity.

An example of this pattern would be the following:

* Source/input: *CustomerCall\*.csv* (ADLS Gen2 path)
* Sink/output: *CustomerCall\*.csv* (Azure blob file)
* 1 process: *CopyGen2ToBlob\#CustomerCall.csv* (Data Factory Copy activity)  

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-copy-lineage-wildcard.png" alt-text="Screenshot showing lineage for a one to one Copy operation with wildcard support." lightbox="./media/how-to-link-azure-data-factory/adf-copy-lineage-wildcard.png":::

### Data movement with n:1 lineage

You can use Data Flow activities to perform data operations like merge, join, and so on. More than one source dataset can be used to produce a target dataset. In this example, Microsoft Purview captures file-level lineage for individual input files to a SQL table that is part of a Data Flow activity.

An example of this pattern would be the following:

* 2 sources/inputs: *Customer.csv*, *Sales.parquet* (ADLS Gen2 Path)
* 1 sink/output: *Company data* (Azure SQL table)
* 1 process: *DataFlowBlobsToSQL* (Data Factory Data Flow activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-data-flow-lineage.png" alt-text="Screenshot showing the lineage for an n to one A D F Data Flow operation." lightbox="./media/how-to-link-azure-data-factory/adf-data-flow-lineage.png":::

### Lineage for resource sets

A resource set is a logical object in the catalog that represents many partition files in the underlying storage. For more information, see [Understanding Resource sets](concept-resource-sets.md). When Microsoft Purview captures lineage from the Azure Data Factory, it applies the rules to normalize the individual partition files and create a single logical object.

In the following example, an Azure Data Lake Gen2 resource set is produced from an Azure Blob:

* 1 source/input: *Employee\_management.csv* (Azure Blob)
* 1 sink/output: *Employee\_management.csv* (Azure Data Lake Gen 2)
* 1 process: *CopyBlobToAdlsGen2\_RS* (Data Factory Copy activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-resource-set-lineage.png" alt-text="Screenshot showing the lineage for a resource set." lightbox="./media/how-to-link-azure-data-factory/adf-resource-set-lineage.png":::

## Next steps

[Tutorial: Push Data Factory lineage data to Microsoft Purview](../data-factory/turorial-push-lineage-to-purview.md)

[Catalog lineage user guide](catalog-lineage-user-guide.md)

[Link to Azure Data Share for lineage](how-to-link-azure-data-share.md)
