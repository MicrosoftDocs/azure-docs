---
title: Copy data to and from Azure Data Lake Storage Gen1 
description: Learn how to copy data to and from Data Lake Store by using Azure Data Factory
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
ms.custom: devx-track-csharp, subject-rbac-steps
robots: noindex
---
# Copy data to and from Data Lake Storage Gen1 by using Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-azure-datalake-connector.md)
> * [Version 2 (current version)](../connector-azure-data-lake-store.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Azure Data Lake Storage Gen1 connector in V2](../connector-azure-data-lake-store.md).

This article explains how to use Copy Activity in Azure Data Factory to move data to and from Azure Data Lake Storage Gen1 (previously known as Azure Data Lake Store). It builds on the [Data movement activities](data-factory-data-movement-activities.md) article, an overview of data movement with Copy Activity.

## Supported scenarios
You can copy data **from Azure Data Lake Store** to the following data stores:

[!INCLUDE [data-factory-supported-sinks](includes/data-factory-supported-sinks.md)]

You can copy data from the following data stores **to Azure Data Lake Store**:

[!INCLUDE [data-factory-supported-sources](includes/data-factory-supported-sources.md)]

> [!NOTE]
> Create a Data Lake Store account before creating a pipeline with Copy Activity. For more information, see [Get started with Azure Data Lake Store](../../data-lake-store/data-lake-store-get-started-portal.md).

## Supported authentication types
The Data Lake Store connector supports these authentication types:
* Service principal authentication
* User credential (OAuth) authentication

We recommend that you use service principal authentication, especially for a scheduled data copy. Token expiration behavior can occur with user credential authentication. For configuration details, see the [Linked service properties](#linked-service-properties) section.

## Get started
You can create a pipeline with a copy activity that moves data to/from an Azure Data Lake Store by using different tools/APIs.

The easiest way to create a pipeline to copy data is to use the **Copy Wizard**. For a tutorial on creating a pipeline by using the Copy Wizard, see [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md).

You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create a **data factory**. A data factory may contain one or more pipelines.
2. Create **linked services** to link input and output data stores to your data factory. For example, if you are copying data from an Azure blob storage to an Azure Data Lake Store, you create two linked services to link your Azure storage account and Azure Data Lake store to your data factory. For linked service properties that are specific to Azure Data Lake Store, see [linked service properties](#linked-service-properties) section.
2. Create **datasets** to represent input and output data for the copy operation. In the example mentioned in the last step, you create a dataset to specify the blob container and folder that contains the input data. And, you create another dataset to specify the folder and file path in the Data Lake store that holds the data copied from the blob storage. For dataset properties that are specific to Azure Data Lake Store, see [dataset properties](#dataset-properties) section.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output. In the example mentioned earlier, you use BlobSource as a source and AzureDataLakeStoreSink as a sink for the copy activity. Similarly, if you are copying from Azure Data Lake Store to Azure Blob Storage, you use AzureDataLakeStoreSource and BlobSink in the copy activity. For copy activity properties that are specific to Azure Data Lake Store, see [copy activity properties](#copy-activity-properties) section. For details on how to use a data store as a source or a sink, click the link in the previous section for your data store.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format. For samples with JSON definitions for Data Factory entities that are used to copy data to/from an Azure Data Lake Store, see [JSON examples](#json-examples-for-copying-data-to-and-from-data-lake-store) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to Data Lake Store.

## Linked service properties
A linked service links a data store to a data factory. You create a linked service of type **AzureDataLakeStore** to link your Data Lake Store data to your data factory. The following table describes JSON elements specific to Data Lake Store linked services. You can choose between service principal and user credential authentication.

| Property | Description | Required |
|:--- |:--- |:--- |
| **type** | The type property must be set to **AzureDataLakeStore**. | Yes |
| **dataLakeStoreUri** | Information about the Azure Data Lake Store account. This information takes one of the following formats: `https://[accountname].azuredatalakestore.net/webhdfs/v1` or `adl://[accountname].azuredatalakestore.net/`. | Yes |
| **subscriptionId** | Azure subscription ID to which the Data Lake Store account belongs. | Required for sink |
| **resourceGroupName** | Azure resource group name to which the Data Lake Store account belongs. | Required for sink |

### Service principal authentication (recommended)
To use service principal authentication, register an application entity in Azure Active Directory (Azure AD) and grant it the access to Data Lake Store. For detailed steps, see [Service-to-service authentication](../../data-lake-store/data-lake-store-service-to-service-authenticate-using-active-directory.md). Make note of the following values, which you use to define the linked service:
* Application ID
* Application key
* Tenant ID

> [!IMPORTANT]
> Make sure you grant the service principal proper permission in Azure Data Lake Store:
>- **To use Data Lake Store as source**, grant at least **Read + Execute** data access permission to list and copy the contents of a folder, or **Read** permission to copy a single file. No requirement on account level access control.
>- **To use Data Lake Store as sink**, grant at least **Write + Execute** data access permission to create child items in the folder. And if you use Azure IR to empower copy (both source and sink are in cloud), in order to let Data Factory detect Data Lake Store's region, grant at least **Reader** role in account access control (IAM). If you want to avoid this IAM role, [specify executionLocation](data-factory-data-movement-activities.md#global) with the location of your Data Lake Store in copy activity.
>- If you **use Copy Wizard to author pipelines**, grant at least **Reader** role in account access control (IAM). Also, grant at least **Read + Execute** permission to your Data Lake Store root ("/") and its children. Otherwise you might see the message "The credentials provided are invalid."

Use service principal authentication by specifying the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| **servicePrincipalId** | Specify the application's client ID. | Yes |
| **servicePrincipalKey** | Specify the application's key. | Yes |
| **tenant** | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Yes |

**Example: Service principal authentication**
```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
        }
    }
}
```

### User credential authentication
Alternatively, you can use user credential authentication to copy from or to Data Lake Store by specifying the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| **authorization** | Click the **Authorize** button in the Data Factory Editor and enter your credential that assigns the autogenerated authorization URL to this property. | Yes |
| **sessionId** | OAuth session ID from the OAuth authorization session. Each session ID is unique and can be used only once. This setting is automatically generated when you use the Data Factory Editor. | Yes |

> [!IMPORTANT]
> Make sure you grant the user proper permission in Azure Data Lake Store:
>- **To use Data Lake Store as source**, grant at least **Read + Execute** data access permission to list and copy the contents of a folder, or **Read** permission to copy a single file. No requirement on account level access control.
>- **To use Data Lake Store as sink**, grant at least **Write + Execute** data access permission to create child items in the folder. And if you use Azure IR to empower copy (both source and sink are in cloud), in order to let Data Factory detect Data Lake Store's region, grant at least **Reader** role in account access control (IAM). If you want to avoid this IAM role, [specify executionLocation](data-factory-data-movement-activities.md#global) with the location of your Data Lake Store in copy activity.
>- If you **use Copy Wizard to author pipelines**, grant at least **Reader** role in account access control (IAM). Also, grant at least **Read + Execute** permission to your Data Lake Store root ("/") and its children. Otherwise you might see the message "The credentials provided are invalid."

**Example: User credential authentication**
```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "sessionId": "<session ID>",
            "authorization": "<authorization URL>",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
        }
    }
}
```

#### Token expiration
The authorization code that you generate by using the **Authorize** button expires after a certain amount of time. The following message means that the authentication token has expired:

Credential operation error: invalid_grant - AADSTS70002: Error validating credentials. AADSTS70008: The provided access grant is expired or revoked. Trace ID: d18629e8-af88-43c5-88e3-d8419eb1fca1 Correlation ID: fac30a0c-6be6-4e02-8d69-a776d2ffefd7 Timestamp: 2015-12-15 21-09-31Z.

The following table shows the expiration times of different types of user accounts:

| User type | Expires after |
|:--- |:--- |
| User accounts *not* managed by Azure Active Directory (for example, @hotmail.com or @live.com) |12 hours |
| Users accounts managed by Azure Active Directory |14 days after the last slice run <br/><br/>90 days, if a slice based on an OAuth-based linked service runs at least once every 14 days |

If you change your password before the token expiration time, the token expires immediately. You will see the message mentioned earlier in this section.

You can reauthorize the account by using the **Authorize** button when the token expires to redeploy the linked service. You can also generate values for the **sessionId** and **authorization** properties programmatically by using the following code:


```csharp
if (linkedService.Properties.TypeProperties is AzureDataLakeStoreLinkedService ||
    linkedService.Properties.TypeProperties is AzureDataLakeAnalyticsLinkedService)
{
    AuthorizationSessionGetResponse authorizationSession = this.Client.OAuth.Get(this.ResourceGroupName, this.DataFactoryName, linkedService.Properties.Type);

    WindowsFormsWebAuthenticationDialog authenticationDialog = new WindowsFormsWebAuthenticationDialog(null);
    string authorization = authenticationDialog.AuthenticateAAD(authorizationSession.AuthorizationSession.Endpoint, new Uri("urn:ietf:wg:oauth:2.0:oob"));

    AzureDataLakeStoreLinkedService azureDataLakeStoreProperties = linkedService.Properties.TypeProperties as AzureDataLakeStoreLinkedService;
    if (azureDataLakeStoreProperties != null)
    {
        azureDataLakeStoreProperties.SessionId = authorizationSession.AuthorizationSession.SessionId;
        azureDataLakeStoreProperties.Authorization = authorization;
    }

    AzureDataLakeAnalyticsLinkedService azureDataLakeAnalyticsProperties = linkedService.Properties.TypeProperties as AzureDataLakeAnalyticsLinkedService;
    if (azureDataLakeAnalyticsProperties != null)
    {
        azureDataLakeAnalyticsProperties.SessionId = authorizationSession.AuthorizationSession.SessionId;
        azureDataLakeAnalyticsProperties.Authorization = authorization;
    }
}
```
For details about the Data Factory classes used in the code, see the [AzureDataLakeStoreLinkedService Class](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice), [AzureDataLakeAnalyticsLinkedService Class](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice), and [AuthorizationSessionGetResponse Class](/dotnet/api/microsoft.azure.management.datafactories.models.authorizationsessiongetresponse) topics. Add a reference to version `2.9.10826.1824` of `Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll` for the `WindowsFormsWebAuthenticationDialog` class used in the code.

## Troubleshooting tips

**Symptom:** When copying data **into** Azure Data Lake Store, if your copy activity fail with the following error:

  ```
  Failed to detect the region for Azure Data Lake account {your account name}. Please make sure that the Resource Group name: {resource group name} and subscription ID: {subscription ID} of this Azure Data Lake Store resource are correct.
  ```

**Root cause:** There are 2 possible reasons:

1. The `resourceGroupName` and/or `subscriptionId` specified in Azure Data Lake Store linked service is incorrect;
2. The user or the service principal doesn't have the needed permission.

**Resolution:**

1. Make sure the `subscriptionId` and `resourceGroupName` you specify in the linked service `typeProperties` are indeed the ones that your data lake account belongs to.

1. Grant, at a minimun, the **Reader** role to the user or service principal on the data lake account.

    For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

1. If you don't want to grant the **Reader** role to the user or service principal, an alternative is to [explicitly specify an execution location](data-factory-data-movement-activities.md#global) in copy activity with the location of your Data Lake Store. Example:

    ```json
    {
      "name": "CopyToADLS",
      "type": "Copy",
      ......
      "typeProperties": {
        "source": {
          "type": "<source type>"
        },
        "sink": {
          "type": "AzureDataLakeStoreSink"
        },
        "exeuctionLocation": "West US"
      }
    }
    ```

## Dataset properties
To specify a dataset to represent input data in a Data Lake Store, you set the **type** property of the dataset to **AzureDataLakeStore**. Set the **linkedServiceName** property of the dataset to the name of the Data Lake Store linked service. For a full list of JSON sections and properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections of a dataset in JSON, such as **structure**, **availability**, and **policy**, are similar for all dataset types (Azure SQL database, Azure blob, and Azure table, for example). The **typeProperties** section is different for each type of dataset and provides information such as location and format of the data in the data store.

The **typeProperties** section for a dataset of type **AzureDataLakeStore** contains the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| **folderPath** |Path to the container and folder in Data Lake Store. |Yes |
| **fileName** |Name of the file in Azure Data Lake Store. The **fileName** property is optional and case-sensitive. <br/><br/>If you specify **fileName**, the activity (including Copy) works on the specific file.<br/><br/>When **fileName** is not specified, Copy includes all files in **folderPath** in the input dataset.<br/><br/>When **fileName** is not specified for an output dataset and **preserveHierarchy** is not specified in activity sink, the name of the generated file is in the format `Data._Guid_.txt`. For example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt. |No |
| **partitionedBy** |The **partitionedBy** property is optional. You can use it to specify a dynamic path and file name for time-series data. For example, **folderPath** can be parameterized for every hour of data. For details and examples, see The partitionedBy property. |No |
| **format** | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, and **ParquetFormat**. Set the **type** property under **format** to one of these values. For more information, see the [Text format](data-factory-supported-file-and-compression-formats.md#text-format), [JSON format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro format](data-factory-supported-file-and-compression-formats.md#avro-format), [ORC format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections in the [File and compression formats supported by Azure Data Factory](data-factory-supported-file-and-compression-formats.md) article. <br><br> If you want to copy files "as-is" between file-based stores (binary copy), skip the `format` section in both input and output dataset definitions. |No |
| **compression** | Specify the type and level of compression for the data. Supported types are **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are **Optimal** and **Fastest**. For more information, see [File and compression formats supported by Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

### The partitionedBy property
You can specify dynamic **folderPath** and **fileName** properties for time-series data with the **partitionedBy** property, Data Factory functions, and system variables. For details, see the [Azure Data Factory - functions and system variables](data-factory-functions-variables.md) article.


In the following example, `{Slice}` is replaced with the value of the Data Factory system variable `SliceStart` in the format specified (`yyyyMMddHH`). The name `SliceStart` refers to the start time of the slice. The `folderPath` property is different for each slice, as in `wikidatagateway/wikisampledataout/2014100103` or `wikidatagateway/wikisampledataout/2014100104`.

```JSON
"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
"partitionedBy":
[
    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
],
```

In the following example, the year, month, day, and time of `SliceStart` are extracted into separate variables that are used by the `folderPath` and `fileName` properties:
```JSON
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
For more details on time-series datasets, scheduling, and slices, see the [Datasets in Azure Data Factory](data-factory-create-datasets.md) and [Data Factory scheduling and execution](data-factory-scheduling-and-execution.md) articles.


## Copy activity properties
For a full list of sections and properties available for defining activities, see the [Creating pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

The properties available in the **typeProperties** section of an activity vary with each activity type. For a copy activity, they vary depending on the types of sources and sinks.

**AzureDataLakeStoreSource** supports the following property in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| **recursive** |Indicates whether the data is read recursively from the subfolders or only from the specified folder. |True (default value), False |No |

**AzureDataLakeStoreSink** supports the following properties in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| **copyBehavior** |Specifies the copy behavior. |<b>PreserveHierarchy</b>: Preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/><b>FlattenHierarchy</b>: All files from the source folder are created in the first level of the target folder. The target files are created with autogenerated names.<br/><br/><b>MergeFiles</b>: Merges all files from the source folder to one file. If the file or blob name is specified, the merged file name is the specified name. Otherwise, the file name is autogenerated. |No |

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

## Supported file and compression formats
For details, see the [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md) article.

## JSON examples for copying data to and from Data Lake Store
The following examples provide sample JSON definitions. You can use these sample definitions to create a pipeline by using [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). The examples show how to copy data to and from Data Lake Store and Azure Blob storage. However, data can be copied _directly_ from any of the sources to any of the supported sinks. For more information, see the section "Supported data stores and formats" in the [Move data by using Copy Activity](data-factory-data-movement-activities.md) article.

### Example: Copy data from Azure Blob Storage to Azure Data Lake Store
The example code in this section shows:

* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
* A linked service of type [AzureDataLakeStore](#linked-service-properties).
* An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
* An output [dataset](data-factory-create-datasets.md) of type [AzureDataLakeStore](#dataset-properties).
* A [pipeline](data-factory-create-pipelines.md) with a copy activity that uses [BlobSource](data-factory-azure-blob-connector.md#copy-activity-properties) and [AzureDataLakeStoreSink](#copy-activity-properties).

The examples show how time-series data from Azure Blob Storage is copied to Data Lake Store every hour.

**Azure Storage linked service**

```JSON
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

**Azure Data Lake Store linked service**

```JSON
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
        }
    }
}
```

> [!NOTE]
> For configuration details, see the [Linked service properties](#linked-service-properties) section.
>

**Azure blob input dataset**

In the following example, data is picked up from a new blob every hour (`"frequency": "Hour", "interval": 1`). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses the year, month, and day portion of the start time. The file name uses the hour portion of the start time. The `"external": true` setting informs the Data Factory service that the table is external to the data factory and is not produced by an activity in the data factory.

```JSON
{
  "name": "AzureBlobInput",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}",
      "partitionedBy": [
        {
          "name": "Year",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "yyyy"
          }
        },
        {
          "name": "Month",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "MM"
          }
        },
        {
          "name": "Day",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "dd"
          }
        },
        {
          "name": "Hour",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "HH"
          }
        }
      ]
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

**Azure Data Lake Store output dataset**

The following example copies data to Data Lake Store. New data is copied to Data Lake Store every hour.

```JSON
{
    "name": "AzureDataLakeStoreOutput",
    "properties": {
        "type": "AzureDataLakeStore",
        "linkedServiceName": "AzureDataLakeStoreLinkedService",
        "typeProperties": {
            "folderPath": "datalake/output/"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

**Copy activity in a pipeline with a blob source and a Data Lake Store sink**

In the following example, the pipeline contains a copy activity that is configured to use the input and output datasets. The copy activity is scheduled to run every hour. In the pipeline JSON definition, the `source` type is set to `BlobSource`, and the `sink` type is set to `AzureDataLakeStoreSink`.

```json
{
    "name":"SamplePipeline",
    "properties":
    {
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
        "description":"pipeline with copy activity",
        "activities":
        [
            {
                "name": "AzureBlobtoDataLake",
                "description": "Copy Activity",
                "type": "Copy",
                "inputs": [
                    {
                        "name": "AzureBlobInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureDataLakeStoreOutput"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "BlobSource"
                    },
                    "sink": {
                        "type": "AzureDataLakeStoreSink"
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

### Example: Copy data from Azure Data Lake Store to an Azure blob
The example code in this section shows:

* A linked service of type [AzureDataLakeStore](#linked-service-properties).
* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
* An input [dataset](data-factory-create-datasets.md) of type [AzureDataLakeStore](#dataset-properties).
* An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
* A [pipeline](data-factory-create-pipelines.md) with a copy activity that uses [AzureDataLakeStoreSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The code copies time-series data from Data Lake Store to an Azure blob every hour.

**Azure Data Lake Store linked service**

```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>"
        }
    }
}
```

> [!NOTE]
> For configuration details, see the [Linked service properties](#linked-service-properties) section.
>

**Azure Storage linked service**

```JSON
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
**Azure Data Lake input dataset**

In this example, setting `"external"` to `true` informs the Data Factory service that the table is external to the data factory and is not produced by an activity in the data factory.

```json
{
    "name": "AzureDataLakeStoreInput",
    "properties":
    {
        "type": "AzureDataLakeStore",
        "linkedServiceName": "AzureDataLakeStoreLinkedService",
        "typeProperties": {
            "folderPath": "datalake/input/",
            "fileName": "SearchLog.tsv",
            "format": {
                "type": "TextFormat",
                "rowDelimiter": "\n",
                "columnDelimiter": "\t"
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
**Azure blob output dataset**

In the following example, data is written to a new blob every hour (`"frequency": "Hour", "interval": 1`). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses the year, month, day, and hours portion of the start time.

```JSON
{
  "name": "AzureBlobOutput",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
      "partitionedBy": [
        {
          "name": "Year",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "yyyy"
          }
        },
        {
          "name": "Month",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "MM"
          }
        },
        {
          "name": "Day",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "dd"
          }
        },
        {
          "name": "Hour",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "HH"
          }
        }
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

**A copy activity in a pipeline with an Azure Data Lake Store source and a blob sink**

In the following example, the pipeline contains a copy activity that is configured to use the input and output datasets. The copy activity is scheduled to run every hour. In the pipeline JSON definition, the `source` type is set to `AzureDataLakeStoreSource`, and the `sink` type is set to `BlobSink`.

```json
{
    "name":"SamplePipeline",
    "properties":{
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
        "description":"pipeline for copy activity",
        "activities":[
            {
                "name": "AzureDakeLaketoBlob",
                "description": "copy activity",
                "type": "Copy",
                "inputs": [
                    {
                        "name": "AzureDataLakeStoreInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutput"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "AzureDataLakeStoreSource",
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

In the copy activity definition, you can also map columns from the source dataset to columns in the sink dataset. For details, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Performance and tuning
To learn about the factors that affect Copy Activity performance and how to optimize it, see the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) article.