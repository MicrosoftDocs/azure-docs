---
title: Copy data to/from Azure Blob Storage
description: 'Learn how to copy blob data in Azure Data Factory. Use our sample: How to copy data to and from Azure Blob Storage and Azure SQL Database.'
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
robots: noindex
---
# Copy data to or from Azure Blob Storage using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-azure-blob-connector.md)
> * [Version 2 (current version)](../connector-azure-blob-storage.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Azure Blob Storage connector in V2](../connector-azure-blob-storage.md).


This article explains how to use the Copy Activity in Azure Data Factory to copy data to and from Azure Blob Storage. It builds on the [Data Movement Activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity.

## Overview
You can copy data from any supported source data store to Azure Blob Storage or from Azure Blob Storage to any supported sink data store. The following table provides a list of data stores supported as sources or sinks by the copy activity. For example, you can move data **from** a SQL Server database or a database in Azure SQL Database **to** an Azure blob storage. And, you can copy data **from** Azure blob storage **to** Azure Synapse Analytics or an Azure Cosmos DB collection.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Supported scenarios
You can copy data **from Azure Blob Storage** to the following data stores:

[!INCLUDE [data-factory-supported-sink](includes/data-factory-supported-sinks.md)]

You can copy data from the following data stores **to Azure Blob Storage**:

[!INCLUDE [data-factory-supported-sources](includes/data-factory-supported-sources.md)]

> [!IMPORTANT]
> Copy Activity supports copying data from/to both general-purpose Azure Storage accounts and Hot/Cool Blob storage. The activity supports **reading from block, append, or page blobs**, but supports **writing to only block blobs**. Azure Premium Storage is not supported as a sink because it is backed by page blobs.
>
> Copy Activity does not delete data from the source after the data is successfully copied to the destination. If you need to delete source data after a successful copy, create a [custom activity](data-factory-use-custom-activities.md) to delete the data and use the activity in the pipeline. For an example, see the [Delete blob or folder sample on GitHub](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/DeleteBlobFileFolderCustomActivity).

## Get started
You can create a pipeline with a copy activity that moves data to/from an Azure Blob Storage by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. This article has a [walkthrough](#walkthrough-use-copy-wizard-to-copy-data-tofrom-blob-storage) for creating a pipeline to copy data from an Azure Blob Storage location  to another Azure Blob Storage location. For a tutorial on creating a pipeline to copy data from an Azure Blob Storage to Azure SQL Database, see [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md).

You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create a **data factory**. A data factory may contain one or more pipelines.
2. Create **linked services** to link input and output data stores to your data factory. For example, if you are copying data from an Azure blob storage to Azure SQL Database, you create two linked services to link your Azure storage account and Azure SQL Database to your data factory. For linked service properties that are specific to Azure Blob Storage, see [linked service properties](#linked-service-properties) section.
2. Create **datasets** to represent input and output data for the copy operation. In the example mentioned in the last step, you create a dataset to specify the blob container and folder that contains the input data. And, you create another dataset to specify the SQL table in Azure SQL Database that holds the data copied from the blob storage. For dataset properties that are specific to Azure Blob Storage, see [dataset properties](#dataset-properties) section.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output. In the example mentioned earlier, you use BlobSource as a source and SqlSink as a sink for the copy activity. Similarly, if you are copying from Azure SQL Database to Azure Blob Storage, you use SqlSource and BlobSink in the copy activity. For copy activity properties that are specific to Azure Blob Storage, see [copy activity properties](#copy-activity-properties) section. For details on how to use a data store as a source or a sink, click the link in the previous section for your data store.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format.  For samples with JSON definitions for Data Factory entities that are used to copy data to/from an Azure Blob Storage, see [JSON examples](#json-examples-for-copying-data-to-and-from-blob-storage) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to Azure Blob Storage.

## Linked service properties
There are two types of linked services you can use to link an Azure Storage to an Azure data factory. They are: **AzureStorage** linked service and **AzureStorageSas** linked service. The Azure Storage linked service provides the data factory with global access to the Azure Storage. Whereas, The Azure Storage SAS (Shared Access Signature) linked service provides the data factory with restricted/time-bound access to the Azure Storage. There are no other differences between these two linked services. Choose the linked service that suits your needs. The following sections provide more details on these two linked services.

[!INCLUDE [data-factory-azure-storage-linked-services](includes/data-factory-azure-storage-linked-services.md)]

## Dataset properties
To specify a dataset to represent input or output data in an Azure Blob Storage, you set the type property of the dataset to: **AzureBlob**. Set the **linkedServiceName** property of the dataset to the name of the Azure Storage or Azure Storage SAS linked service.  The type properties of the dataset specify the **blob container** and the **folder** in the blob storage.

For a full list of JSON sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

Data factory supports the following CLS-compliant .NET based type values for providing type information in "structure" for schema-on-read data sources like Azure blob: Int16, Int32, Int64, Single, Double, Decimal, Byte[], Bool, String, Guid, Datetime, Datetimeoffset, Timespan. Data Factory automatically performs type conversions when moving data from a source data store to a sink data store.

The **typeProperties** section is different for each type of dataset and provides information about the location, format etc., of the data in the data store. The typeProperties section for dataset of type **AzureBlob** dataset has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Path to the container and folder in the blob storage. Example: myblobcontainer\myblobfolder\ |Yes |
| fileName |Name of the blob. fileName is optional and case-sensitive.<br/><br/>If you specify a filename, the activity (including Copy) works on the specific Blob.<br/><br/>When fileName is not specified, Copy includes all Blobs in the folderPath for input dataset.<br/><br/>When **fileName** is not specified for an output dataset and **preserveHierarchy** is not specified in activity sink, the name of the generated file would be in the following this format: `Data.<Guid>.txt` (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. See the [Using partitionedBy property section](#using-partitionedby-property) for details and examples. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

### Using partitionedBy property
As mentioned in the previous section, you can specify a dynamic folderPath and filename for time series data with the **partitionedBy** property, [Data Factory functions, and the system variables](data-factory-functions-variables.md).

For more information on time series datasets, scheduling, and slices, see [Creating Datasets](data-factory-create-datasets.md) and [Scheduling & Execution](data-factory-scheduling-and-execution.md) articles.

#### Sample 1

```json
"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
"partitionedBy":
[
    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
],
```

In this example, {Slice} is replaced with the value of Data Factory system variable SliceStart in the format (YYYYMMDDHH) specified. The SliceStart refers to start time of the slice. The folderPath is different for each slice. For example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104

#### Sample 2

```json
"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
"fileName": "{Hour}.csv",
"partitionedBy":
[
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
    { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } }
],
```

In this example, year, month, day, and time of SliceStart are extracted into separate variables that are used by folderPath and fileName properties.

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output datasets, and policies are available for all types of activities. Whereas, properties available in the **typeProperties** section of the activity vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks. If you are moving data from an Azure Blob Storage, you set the source type in the copy activity to **BlobSource**. Similarly, if you are moving data to an Azure Blob Storage, you set the sink type in the copy activity to **BlobSink**. This section provides a list of properties supported by BlobSource and BlobSink.

**BlobSource** supports the following properties in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True (default value), False |No |

**BlobSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Defines the copy behavior when the source is BlobSource or FileSystem. |<b>PreserveHierarchy</b>: preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/><b>FlattenHierarchy</b>: all files from the source folder are in the first level of target folder. The target files have auto generated name. <br/><br/><b>MergeFiles</b>: merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. |No |

**BlobSource** also supports these two properties for backward compatibility.

* **treatEmptyAsNull**: Specifies whether to treat null or empty string as null value.
* **skipHeaderLineCount** - Specifies how many lines need be skipped. It is applicable only when input dataset is using TextFormat.

Similarly, **BlobSink** supports the following property for backward compatibility.

* **blobWriterAddHeader**: Specifies whether to add a header of column definitions while writing to an output dataset.

Datasets now support the following properties that implement the same functionality: **treatEmptyAsNull**, **skipLineCount**, **firstRowAsHeader**.

The following table provides guidance on using the new dataset properties in place of these blob source/sink properties.

| Copy Activity property | Dataset property |
|:--- |:--- |
| skipHeaderLineCount on BlobSource |skipLineCount and firstRowAsHeader. Lines are skipped first and then the first row is read as a header. |
| treatEmptyAsNull on BlobSource |treatEmptyAsNull on input dataset |
| blobWriterAddHeader on BlobSink |firstRowAsHeader on output dataset |

See [Specifying TextFormat](data-factory-supported-file-and-compression-formats.md#text-format) section for detailed information on these properties.

### recursive and copyBehavior examples
This section describes the resulting behavior of the Copy operation for different combinations of recursive and copyBehavior values.

| recursive | copyBehavior | Resulting behavior |
| --- | --- | --- |
| true |preserveHierarchy |For a source folder Folder1 with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the same structure as the source<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5. |
| true |flattenHierarchy |For a source folder Folder1 with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File5 |
| true |mergeFiles |For a source folder Folder1 with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target Folder1 is created with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 + File3 + File4 + File 5 contents are merged into one file with auto-generated file name |
| false |preserveHierarchy |For a source folder Folder1 with the following structure: <br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/><br/><br/>Subfolder1 with File3, File4, and File5 are not picked up. |
| false |flattenHierarchy |For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;auto-generated name for File2<br/><br/><br/>Subfolder1 with File3, File4, and File5 are not picked up. |
| false |mergeFiles |For a source folder Folder1 with the following structure:<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File2<br/>&nbsp;&nbsp;&nbsp;&nbsp;Subfolder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File3<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File4<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File5<br/><br/>the target folder Folder1 is created with the following structure<br/><br/>Folder1<br/>&nbsp;&nbsp;&nbsp;&nbsp;File1 + File2 contents are merged into one file with auto-generated file name. auto-generated name for File1<br/><br/>Subfolder1 with File3, File4, and File5 are not picked up. |

## Walkthrough: Use Copy Wizard to copy data to/from Blob Storage
Let's look at how to quickly copy data to/from an Azure blob storage. In this walkthrough, both source and destination data stores of type: Azure Blob Storage. The pipeline in this walkthrough copies data from a folder to another folder in the same blob container. This walkthrough is intentionally simple to show you settings or properties when using Blob Storage as a source or sink.

### Prerequisites
1. Create a general-purpose **Azure Storage Account** if you don't have one already. You use the blob storage as both **source** and **destination** data store in this walkthrough. if you don't have an Azure storage account, see the [Create a storage account](../../storage/common/storage-account-create.md) article for steps to create one.
2. Create a blob container named **adfblobconnector** in the storage account.
4. Create a folder named **input** in the **adfblobconnector** container.
5. Create a file named **emp.txt** with the following content and upload it to the **input** folder by using tools such as [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
    ```json
    John, Doe
    Jane, Doe
    ```

### Create the data factory
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **Create a resource** from the top-left corner, click **Intelligence + analytics**, and click **Data Factory**.
3. In the **New data factory** pane:  
    1. Enter **ADFBlobConnectorDF** for the **name**. The name of the Azure data factory must be globally unique. If you receive the error: `*Data factory name "ADFBlobConnectorDF" is not available`, change the name of the data factory (for example, yournameADFBlobConnectorDF) and try creating again. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
    2. Select your Azure **subscription**.
    3. For Resource Group, select **Use existing** to select an existing resource group (or) select **Create new** to enter a name for a resource group.
    4. Select a **location** for the data factory.
    5. Select **Pin to dashboard** check box at the bottom of the blade.
    6. Click **Create**.
3. After the creation is complete, you see the **Data Factory** blade as shown in the following image:
    :::image type="content" source="./media/data-factory-azure-blob-connector/data-factory-home-page.png" alt-text="Data factory home page":::

### Copy Wizard
1. On the Data Factory home page, click the **Copy data** tile to launch **Copy Data Wizard** in a separate tab.  

    > [!NOTE]
    > If you see that the web browser is stuck at "Authorizing...", disable/uncheck **Block third-party cookies and site data** setting (or) keep it enabled and create an exception for **login.microsoftonline.com** and then try launching the wizard again.
2. In the **Properties** page:
    1. Enter **CopyPipeline** for **Task name**. The task name is the name of the pipeline in your data factory.
    2. Enter a **description** for the task (optional).
    3. For **Task cadence or Task schedule**, keep the **Run regularly on schedule** option. If you want to run this task only once instead of run repeatedly on a schedule, select **Run once now**. If you select, **Run once now** option, a [one-time pipeline](data-factory-create-pipelines.md#onetime-pipeline) is created.
    4. Keep the settings for **Recurring pattern**. This task runs daily between the start and end times you specify in the next step.
    5. Change the **Start date time** to **04/21/2017**.
    6. Change the **End date time** to **04/25/2017**. You may want to type the date instead of browsing through the calendar.
    8. Click **Next**.
        :::image type="content" source="./media/data-factory-azure-blob-connector/copy-tool-properties-page.png" alt-text="Copy Tool - Properties page":::
3. On the **Source data store** page, click **Azure Blob Storage** tile. You use this page to specify the source data store for the copy task. You can use an existing data store linked service (or) specify a new data store. To use an existing linked service, you would select **FROM EXISTING LINKED SERVICES** and select the right linked service.
    :::image type="content" source="./media/data-factory-azure-blob-connector/copy-tool-source-data-store-page.png" alt-text="Copy Tool - Source data store page":::
4. On the **Specify the Azure Blob storage account** page:
    1. Keep the auto-generated name for **Connection name**. The connection name is the name of the linked service of type: Azure Storage.
    2. Confirm that **From Azure subscriptions** option is selected for **Account selection method**.
    3. Select your Azure subscription or keep **Select all** for **Azure subscription**.
    4. Select an **Azure storage account** from the list of Azure storage accounts available in the selected subscription. You can also choose to enter storage account settings manually by selecting **Enter manually** option for the **Account selection method**.
    5. Click **Next**.  
        :::image type="content" source="./media/data-factory-azure-blob-connector/copy-tool-specify-azure-blob-storage-account.png" alt-text="Copy Tool - Specify the Azure Blob storage account":::
5. On **Choose the input file or folder** page:
    1. Double-click **adfblobcontainer**.
    2. Select **input**, and click **Choose**. In this walkthrough, you select the input folder. You could also select the emp.txt file in the folder instead.
        :::image type="content" source="./media/data-factory-azure-blob-connector/copy-tool-choose-input-file-or-folder.png" alt-text="Copy Tool - Choose the input file or folder 1":::
6. On the **Choose the input file or folder** page:
    1. Confirm that the **file or folder** is set to **adfblobconnector/input**. If the files are in sub folders, for example, 2017/04/01, 2017/04/02, and so on, enter adfblobconnector/input/{year}/{month}/{day} for file or folder. When you press TAB out of the text box, you see three drop-down lists to select formats for year (yyyy), month (MM), and day (dd).
    2. Do not set **Copy file recursively**. Select this option to recursively traverse through folders for files to be copied to the destination.
    3. Do not the **binary copy** option. Select this option to perform a binary copy of source file to the destination. Do not select for this walkthrough so that you can see more options in the next pages.
    4. Confirm that the **Compression type** is set to **None**. Select a value for this option if your source files are compressed in one of the supported formats.
    5. Click **Next**.
    :::image type="content" source="./media/data-factory-azure-blob-connector/chose-input-file-folder.png" alt-text="Copy Tool - Choose the input file or folder 2":::
7. On the **File format settings** page, you see the delimiters and the schema that is auto-detected by the wizard by parsing the file.
    1. Confirm the following options:  
        a. The **file format** is set to **Text format**. You can see all the supported formats in the drop-down list. For example: JSON, Avro, ORC, Parquet.
        b. The **column delimiter** is set to `Comma (,)`. You can see the other column delimiters supported by Data Factory in the drop-down list. You can also specify a custom delimiter.
        c. The **row delimiter** is set to `Carriage Return + Line feed (\r\n)`. You can see the other row delimiters supported by Data Factory in the drop-down list. You can also specify a custom delimiter.
        d. The **skip line count** is set to **0**. If you want a few lines to be skipped at the top of the file, enter the number here.
        e. The **first data row contains column names** is not set. If the source files contain column names in the first row, select this option.
        f. The **treat empty column value as null** option is set.
    2. Expand **Advanced settings** to see advanced option available.
    3. At the bottom of the page, see the **preview** of data from the emp.txt file.
    4. Click **SCHEMA** tab at the bottom to see the schema that the copy wizard inferred by looking at the data in the source file.
    5. Click **Next** after you review the delimiters and preview data.
    :::image type="content" source="./media/data-factory-azure-blob-connector/copy-tool-file-format-settings.png" alt-text="Copy Tool - File format settings":::
8. On the **Destination data store page**, select **Azure Blob Storage**, and click **Next**. You are using the Azure Blob Storage as both the source and destination data stores in this walkthrough.  
    :::image type="content" source="media/data-factory-azure-blob-connector/select-destination-data-store.png" alt-text="Copy Tool - select destination data store":::
9. On **Specify the Azure Blob storage account** page:  
    1. Enter **AzureStorageLinkedService** for the **Connection name** field.
    2. Confirm that **From Azure subscriptions** option is selected for **Account selection method**.
    3. Select your Azure **subscription**.
    4. Select your Azure storage account.
    5. Click **Next**.
10. On the **Choose the output file or folder** page:  
    1. specify **Folder path** as **adfblobconnector/output/{year}/{month}/{day}**. Enter **TAB**.
    1. For the **year**, select **yyyy**.
    1. For the **month**, confirm that it is set to **MM**.
    1. For the **day**, confirm that it is set to **dd**.
    1. Confirm that the **compression type** is set to **None**.
    1. Confirm that the **copy behavior** is set to **Merge files**. If the output file with the same name already exists, the new content is added to the same file at the end.
    1. Click **Next**.
       :::image type="content" source="media/data-factory-azure-blob-connector/choose-the-output-file-or-folder.png" alt-text="Copy Tool - Choose output file or folder":::
11. On the **File format settings** page, review the settings, and click **Next**. One of the additional options here is to add a header to the output file. If you select that option, a header row is added with names of the columns from the schema of the source. You can rename the default column names when viewing the schema for the source. For example, you could change the first column to First Name and second column to Last Name. Then, the output file is generated with a header with these names as column names.
    :::image type="content" source="media/data-factory-azure-blob-connector/file-format-destination.png" alt-text="Copy Tool - File format settings for destination":::
12. On the **Performance settings** page, confirm that **cloud units** and **parallel copies** are set to **Auto**, and click Next. For details about these settings, see [Copy activity performance and tuning guide](data-factory-copy-activity-performance.md#parallel-copy).
    :::image type="content" source="media/data-factory-azure-blob-connector/copy-performance-settings.png" alt-text="Copy Tool - Performance settings":::
14. On the **Summary** page, review all settings (task properties, settings for source and destination, and copy settings), and click **Next**.
    :::image type="content" source="media/data-factory-azure-blob-connector/copy-tool-summary-page.png" alt-text="Copy Tool - Summary page":::
15. Review information in the **Summary** page, and click **Finish**. The wizard creates two linked services, two datasets (input and output), and one pipeline in the data factory (from where you launched the Copy Wizard).
    :::image type="content" source="media/data-factory-azure-blob-connector/copy-tool-deployment-page.png" alt-text="Copy Tool - Deployment page":::

### Monitor the pipeline (copy task)

1. Click the link `Click here to monitor copy pipeline` on the **Deployment** page.
2. You should see the **Monitor and Manage application** in a separate tab.
    :::image type="content" source="media/data-factory-azure-blob-connector/monitor-manage-app.png" alt-text="Monitor and Manage App":::
3. Change the **start** time at the top to `04/19/2017` and **end** time to `04/27/2017`, and then click **Apply**.
4. You should see five activity windows in the **ACTIVITY WINDOWS** list. The **WindowStart** times should cover all days from pipeline start to pipeline end times.
5. Click **Refresh** button for the **ACTIVITY WINDOWS** list a few times until you see the status of all the activity windows is set to Ready.
6. Now, verify that the output files are generated in the output folder of adfblobconnector container. You should see the following folder structure in the output folder:

    ```output
    2017/04/21
    2017/04/22
    2017/04/23
    2017/04/24
    2017/04/25
    ```

    For detailed information about monitoring and managing data factories, see [Monitor and manage Data Factory pipeline](data-factory-monitor-manage-app.md) article.

### Data Factory entities
Now, switch back to the tab with the Data Factory home page. Notice that there are two linked services, two datasets, and one pipeline in your data factory now.

:::image type="content" source="media/data-factory-azure-blob-connector/data-factory-home-page-with-numbers.png" alt-text="Data Factory home page with entities":::

Click **Author and deploy** to launch Data Factory Editor.

:::image type="content" source="media/data-factory-azure-blob-connector/data-factory-editor.png" alt-text="Data Factory Editor":::

You should see the following Data Factory entities in your data factory:

- Two linked services. One for the source and the other one for the destination. Both the linked services refer to the same Azure Storage account in this walkthrough.
- Two datasets. An input dataset and an output dataset. In this walkthrough, both use the same blob container but refer to different folders (input and output).
- A pipeline. The pipeline contains a copy activity that uses a blob source and a blob sink to copy data from an Azure blob location to another Azure blob location.

The following sections provide more information about these entities.

#### Linked services
You should see two linked services. One for the source and the other one for the destination. In this walkthrough, both definitions look the same except for the names. The **type** of the linked service is set to **AzureStorage**. Most important property of the linked service definition is the **connectionString**, which is used by Data Factory to connect to your Azure Storage account at runtime. Ignore the hubName property in the definition.

##### Source blob storage linked service
```json
{
    "name": "Source-BlobStorage-z4y",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=mystorageaccount;AccountKey=**********"
        }
    }
}
```

##### Destination blob storage linked service

```json
{
    "name": "Destination-BlobStorage-z4y",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=mystorageaccount;AccountKey=**********"
        }
    }
}
```

For more information about Azure Storage linked service, see [Linked service properties](#linked-service-properties) section.

#### Datasets
There are two datasets: an input dataset and an output dataset. The type of the dataset is set to **AzureBlob** for both.

The input dataset points to the **input** folder of the **adfblobconnector** blob container. The **external** property is set to **true** for this dataset as the data is not produced by the pipeline with the copy activity that takes this dataset as an input.

The output dataset points to the **output** folder of the same blob container. The output dataset also uses the year, month, and day of the **SliceStart** system variable to dynamically evaluate the path for the output file. For a list of functions and system variables supported by Data Factory, see [Data Factory functions and system variables](data-factory-functions-variables.md). The **external** property is set to **false** (default value) because this dataset is produced by the pipeline.

For more information about properties supported by Azure Blob dataset, see [Dataset properties](#dataset-properties) section.

##### Input dataset

```json
{
    "name": "InputDataset-z4y",
    "properties": {
        "structure": [
            { "name": "Prop_0", "type": "String" },
            { "name": "Prop_1", "type": "String" }
        ],
        "type": "AzureBlob",
        "linkedServiceName": "Source-BlobStorage-z4y",
        "typeProperties": {
            "folderPath": "adfblobconnector/input/",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ","
            }
        },
        "availability": {
            "frequency": "Day",
            "interval": 1
        },
        "external": true,
        "policy": {}
    }
}
```

##### Output dataset

```json
{
    "name": "OutputDataset-z4y",
    "properties": {
        "structure": [
            { "name": "Prop_0", "type": "String" },
            { "name": "Prop_1", "type": "String" }
        ],
        "type": "AzureBlob",
        "linkedServiceName": "Destination-BlobStorage-z4y",
        "typeProperties": {
            "folderPath": "adfblobconnector/output/{year}/{month}/{day}",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ","
            },
            "partitionedBy": [
                { "name": "year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
                { "name": "month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
                { "name": "day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } }
            ]
        },
        "availability": {
            "frequency": "Day",
            "interval": 1
        },
        "external": false,
        "policy": {}
    }
}
```

#### Pipeline
The pipeline has just one activity. The **type** of the activity is set to **Copy**. In the type properties for the activity, there are two sections, one for source and the other one for sink. The source type is set to **BlobSource** as the activity is copying data from a blob storage. The sink type is set to **BlobSink** as the activity copying data to a blob storage. The copy activity takes InputDataset-z4y as the input and OutputDataset-z4y as the output.

For more information about properties supported by BlobSource and BlobSink, see [Copy activity properties](#copy-activity-properties) section.

```json
{
    "name": "CopyPipeline",
    "properties": {
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "BlobSource",
                        "recursive": false
                    },
                    "sink": {
                        "type": "BlobSink",
                        "copyBehavior": "MergeFiles",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "InputDataset-z4y"
                    }
                ],
                "outputs": [
                    {
                        "name": "OutputDataset-z4y"
                    }
                ],
                "policy": {
                    "timeout": "1.00:00:00",
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "style": "StartOfInterval",
                    "retry": 3,
                    "longRetry": 0,
                    "longRetryInterval": "00:00:00"
                },
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1
                },
                "name": "Activity-0-Blob path_ adfblobconnector_input_->OutputDataset-z4y"
            }
        ],
        "start": "2017-04-21T22:34:00Z",
        "end": "2017-04-25T05:00:00Z",
        "isPaused": false,
        "pipelineMode": "Scheduled"
    }
}
```

## JSON examples for copying data to and from Blob Storage
The following examples provide sample JSON definitions that you can use to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data to and from Azure Blob Storage and Azure SQL Database. However, data can be copied **directly** from any of sources to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.

### JSON Example: Copy data from Blob Storage to SQL Database
The following sample shows:

1. A linked service of type [AzureSqlDatabase](data-factory-azure-sql-connector.md#linked-service-properties).
2. A linked service of type [AzureStorage](#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureSqlTable](data-factory-azure-sql-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [BlobSource](#copy-activity-properties) and [SqlSink](data-factory-azure-sql-connector.md#copy-activity-properties).

The sample copies time-series data from an Azure blob to an Azure SQL table hourly. The JSON properties used in these samples are described in sections following the samples.

**Azure SQL linked service:**

```json
{
  "name": "AzureSqlLinkedService",
  "properties": {
    "type": "AzureSqlDatabase",
    "typeProperties": {
      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
    }
  }
}
```
**Azure Storage linked service:**

```json
{
  "name": "StorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```
Azure Data Factory supports two types of Azure Storage linked services: **AzureStorage** and **AzureStorageSas**. For the first one, you specify the connection string that includes the account key and for the later one, you specify the Shared Access Signature (SAS) Uri. See [Linked Services](#linked-service-properties) section for details.

**Azure Blob input dataset:**

Data is picked up from a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day part of the start time and file name uses the hour part of the start time. "external": "true" setting informs Data Factory that the table is external to the data factory and is not produced by an activity in the data factory.

```json
{
  "name": "AzureBlobInput",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/",
      "fileName": "{Hour}.csv",
      "partitionedBy": [
        { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
        { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
        { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
        { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "HH" } }
      ],
      "format": {
        "type": "TextFormat",
        "columnDelimiter": ",",
        "rowDelimiter": "\n"
      }
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    },
    "policy": {
      "externalData": {
        "retryInterval": "00:01:00",
        "retryTimeout": "00:10:00",
        "maximumRetry": 3
      }
    }
  }
}
```
**Azure SQL output dataset:**

The sample copies data to a table named "MyTable" in Azure SQL Database. Create the table in your SQL database with the same number of columns as you expect the Blob CSV file to contain. New rows are added to the table every hour.

```json
{
  "name": "AzureSqlOutput",
  "properties": {
    "type": "AzureSqlTable",
    "linkedServiceName": "AzureSqlLinkedService",
    "typeProperties": {
      "tableName": "MyOutputTable"
    },
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```
**A copy activity in a pipeline with Blob source and SQL sink:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **SqlSink**.

```json
{
  "name":"SamplePipeline",
  "properties":{
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
    "description":"pipeline with copy activity",
    "activities":[
      {
        "name": "AzureBlobtoSQL",
        "description": "Copy Activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureBlobInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureSqlOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "SqlSink"
          }
        },
        "scheduler": {
          "frequency": "Hour",
          "interval": 1
        },
        "policy": {
          "concurrency": 1,
          "executionPriorityOrder": "OldestFirst",
          "retry": 0,
          "timeout": "01:00:00"
        }
      }
    ]
  }
}
```
### JSON Example: Copy data from Azure SQL to Azure Blob
The following sample shows:

1. A linked service of type [AzureSqlDatabase](data-factory-azure-sql-connector.md#linked-service-properties).
2. A linked service of type [AzureStorage](#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [AzureSqlTable](data-factory-azure-sql-connector.md#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy activity that uses [SqlSource](data-factory-azure-sql-connector.md#copy-activity-properties) and [BlobSink](#copy-activity-properties).

The sample copies time-series data from an Azure SQL table to an Azure blob hourly. The JSON properties used in these samples are described in sections following the samples.

**Azure SQL linked service:**

```json
{
  "name": "AzureSqlLinkedService",
  "properties": {
    "type": "AzureSqlDatabase",
    "typeProperties": {
      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
    }
  }
}
```
**Azure Storage linked service:**

```json
{
  "name": "StorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```
Azure Data Factory supports two types of Azure Storage linked services: **AzureStorage** and **AzureStorageSas**. For the first one, you specify the connection string that includes the account key and for the later one, you specify the Shared Access Signature (SAS) Uri. See [Linked Services](#linked-service-properties) section for details.

**Azure SQL input dataset:**

The sample assumes you have created a table "MyTable" in Azure SQL and it contains a column called "timestampcolumn" for time series data.

Setting "external": "true" informs Data Factory service that the table is external to the data factory and is not produced by an activity in the data factory.

```json
{
  "name": "AzureSqlInput",
  "properties": {
    "type": "AzureSqlTable",
    "linkedServiceName": "AzureSqlLinkedService",
    "typeProperties": {
      "tableName": "MyTable"
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    },
    "policy": {
      "externalData": {
        "retryInterval": "00:01:00",
        "retryTimeout": "00:10:00",
        "maximumRetry": 3
      }
    }
  }
}
```

**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

```json
{
  "name": "AzureBlobOutput",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}/",
      "partitionedBy": [
        {
          "name": "Year",
          "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
        { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
        { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
        { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "HH" } }
      ],
      "format": {
        "type": "TextFormat",
        "columnDelimiter": "\t",
        "rowDelimiter": "\n"
      }
    },
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

**A copy activity in a pipeline with SQL source and Blob sink:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **SqlSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **SqlReaderQuery** property selects the data in the past hour to copy.

```json
{
    "name":"SamplePipeline",
    "properties":{
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
        "description":"pipeline for copy activity",
        "activities":[
            {
                "name": "AzureSQLtoBlob",
                "description": "copy activity",
                "type": "Copy",
                "inputs": [
                    {
                        "name": "AzureSQLInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutput"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "SqlSource",
                        "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "policy": {
                    "concurrency": 1,
                    "executionPriorityOrder": "OldestFirst",
                    "retry": 0,
                    "timeout": "01:00:00"
                }
            }
        ]
    }
}
```

> [!NOTE]
> To map columns from source dataset to columns from sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
