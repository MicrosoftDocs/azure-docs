---
title: Transform data using U-SQL script - Azure | Microsoft Docs
description: Learn how to process or transform data by running U-SQL scripts on Azure Data Lake Analytics compute service.
services: data-factory
documentationcenter: ''
ms.assetid: e17c1255-62c2-4e2e-bb60-d25274903e80
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 10/01/2017
author: nabhishek
ms.author: abnarain
manager: craigg
robots: noindex
---
# Transform data by running U-SQL scripts on Azure Data Lake Analytics 
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-usql-activity.md)
> * [Version 2 (current version)](../transform-data-using-data-lake-analytics.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [U-SQL Activity in V2](../transform-data-using-data-lake-analytics.md).

A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs a specific processing operation. This article describes the **Data Lake Analytics U-SQL Activity** that runs a **U-SQL** script on an **Azure Data Lake Analytics** compute linked service. 

Create an Azure Data Lake Analytics account before creating a pipeline with a Data Lake Analytics U-SQL Activity. To learn about Azure Data Lake Analytics, see [Get started with Azure Data Lake Analytics](../../data-lake-analytics/data-lake-analytics-get-started-portal.md).

Review the [Build your first pipeline tutorial](data-factory-build-your-first-pipeline.md) for detailed steps to create a data factory, linked services, datasets, and a pipeline. Use JSON snippets with Data Factory Editor or Visual Studio or Azure PowerShell to create Data Factory entities.

## Supported authentication types
U-SQL activity supports below authentication types against Data Lake Analytics:
* Service principal authentication
* User credential (OAuth) authentication 

We recommend that you use service principal authentication, especially for a scheduled U-SQL execution. Token expiration behavior can occur with user credential authentication. For configuration details, see the [Linked service properties](#azure-data-lake-analytics-linked-service) section.

## Azure Data Lake Analytics Linked Service
You create an **Azure Data Lake Analytics** linked service to link an Azure Data Lake Analytics compute service to an Azure data factory. The Data Lake Analytics U-SQL activity in the pipeline refers to this linked service. 

The following table provides descriptions for the generic properties used in the JSON definition. You can further choose between service principal and user credential authentication.

| Property | Description | Required |
| --- | --- | --- |
| **type** |The type property should be set to: **AzureDataLakeAnalytics**. |Yes |
| **accountName** |Azure Data Lake Analytics Account Name. |Yes |
| **dataLakeAnalyticsUri** |Azure Data Lake Analytics URI. |No |
| **subscriptionId** |Azure subscription id |No (If not specified, subscription of the data factory is used). |
| **resourceGroupName** |Azure resource group name |No (If not specified, resource group of the data factory is used). |

### Service principal authentication (recommended)
To use service principal authentication, register an application entity in Azure Active Directory (Azure AD) and grant it the access to Data Lake Store. For detailed steps, see [Service-to-service authentication](../../data-lake-store/data-lake-store-authenticate-using-active-directory.md). Make note of the following values, which you use to define the linked service:
* Application ID
* Application key 
* Tenant ID

Use service principal authentication by specifying the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| **servicePrincipalId** | Specify the application's client ID. | Yes |
| **servicePrincipalKey** | Specify the application's key. | Yes |
| **tenant** | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Yes |

**Example: Service principal authentication**
```json
{
    "name": "AzureDataLakeAnalyticsLinkedService",
    "properties": {
        "type": "AzureDataLakeAnalytics",
        "typeProperties": {
            "accountName": "adftestaccount",
            "dataLakeAnalyticsUri": "azuredatalakeanalytics.net",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "subscriptionId": "<optional, subscription id of ADLA>",
            "resourceGroupName": "<optional, resource group name of ADLA>"
        }
    }
}
```

### User credential authentication
Alternatively, you can use user credential authentication for Data Lake Analytics by specifying the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| **authorization** | Click the **Authorize** button in the Data Factory Editor and enter your credential that assigns the autogenerated authorization URL to this property. | Yes |
| **sessionId** | OAuth session ID from the OAuth authorization session. Each session ID is unique and can be used only once. This setting is automatically generated when you use the Data Factory Editor. | Yes |

**Example: User credential authentication**
```json
{
    "name": "AzureDataLakeAnalyticsLinkedService",
    "properties": {
        "type": "AzureDataLakeAnalytics",
        "typeProperties": {
            "accountName": "adftestaccount",
            "dataLakeAnalyticsUri": "azuredatalakeanalytics.net",
            "authorization": "<authcode>",
            "sessionId": "<session ID>", 
            "subscriptionId": "<optional, subscription id of ADLA>",
            "resourceGroupName": "<optional, resource group name of ADLA>"
        }
    }
}
```

#### Token expiration
The authorization code you generated by using the **Authorize** button expires after sometime. See the following table for the expiration times for different types of user accounts. You may see the following error message when the authentication **token expires**: Credential operation error: invalid_grant - AADSTS70002: Error validating credentials. AADSTS70008: The provided access grant is expired or revoked. Trace ID: d18629e8-af88-43c5-88e3-d8419eb1fca1 Correlation ID: fac30a0c-6be6-4e02-8d69-a776d2ffefd7 Timestamp: 2015-12-15 21:09:31Z

| User type | Expires after |
|:--- |:--- |
| User accounts NOT managed by Azure Active Directory (@hotmail.com, @live.com, etc.) |12 hours |
| Users accounts managed by Azure Active Directory (AAD) |14 days after the last slice run. <br/><br/>90 days, if a slice based on OAuth-based linked service runs at least once every 14 days. |

To avoid/resolve this error, reauthorize using the **Authorize** button when the **token expires** and redeploy the linked service. You can also generate values for **sessionId** and **authorization** properties programmatically using code as follows:

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

See [AzureDataLakeStoreLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice.aspx), [AzureDataLakeAnalyticsLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice.aspx), and [AuthorizationSessionGetResponse Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.authorizationsessiongetresponse.aspx) topics for details about the Data Factory classes used in the code. Add a reference to: Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll for the WindowsFormsWebAuthenticationDialog class. 

## Data Lake Analytics U-SQL Activity
The following JSON snippet defines a pipeline with a Data Lake Analytics U-SQL Activity. The activity definition has a reference to the Azure Data Lake Analytics linked service you created earlier.   

```json
{
    "name": "ComputeEventsByRegionPipeline",
    "properties": {
        "description": "This is a pipeline to compute events for en-gb locale and date less than 2012/02/19.",
        "activities": 
        [
            {
                "type": "DataLakeAnalyticsU-SQL",
                "typeProperties": {
                    "scriptPath": "scripts\\kona\\SearchLogProcessing.txt",
                    "scriptLinkedService": "StorageLinkedService",
                    "degreeOfParallelism": 3,
                    "priority": 100,
                    "parameters": {
                        "in": "/datalake/input/SearchLog.tsv",
                        "out": "/datalake/output/Result.tsv"
                    }
                },
                "inputs": [
                    {
                        "name": "DataLakeTable"
                    }
                ],
                "outputs": 
                [
                    {
                        "name": "EventsByRegionTable"
                    }
                ],
                "policy": {
                    "timeout": "06:00:00",
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "retry": 1
                },
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1
                },
                "name": "EventsByRegion",
                "linkedServiceName": "AzureDataLakeAnalyticsLinkedService"
            }
        ],
        "start": "2015-08-08T00:00:00Z",
        "end": "2015-08-08T01:00:00Z",
        "isPaused": false
    }
}
```

The following table describes names and descriptions of properties that are specific to this activity. 

| Property            | Description                              | Required                                 |
| :------------------ | :--------------------------------------- | :--------------------------------------- |
| type                | The type property must be set to **DataLakeAnalyticsU-SQL**. | Yes                                      |
| linkedServiceName   | Reference to the Azure Data Lake Analytics registered as a linked service in Data Factory | Yes                                      |
| scriptPath          | Path to folder that contains the U-SQL script. Name of the file is case-sensitive. | No (if you use script)                   |
| scriptLinkedService | Linked service that links the storage that contains the script to the data factory | No (if you use script)                   |
| script              | Specify inline script instead of specifying scriptPath and scriptLinkedService. For example: `"script": "CREATE DATABASE test"`. | No (if you use scriptPath and scriptLinkedService) |
| degreeOfParallelism | The maximum number of nodes simultaneously used to run the job. | No                                       |
| priority            | Determines which jobs out of all that are queued should be selected to run first. The lower the number, the higher the priority. | No                                       |
| parameters          | Parameters for the U-SQL script          | No                                       |
| runtimeVersion      | Runtime version of the U-SQL engine to use | No                                       |
| compilationMode     | <p>Compilation mode of U-SQL. Must be one of these values:</p> <ul><li>**Semantic:** Only perform semantic checks and necessary sanity checks.</li><li>**Full:** Perform the full compilation, including syntax check, optimization, code generation, etc.</li><li>**SingleBox:** Perform the full compilation, with TargetType setting to SingleBox.</li></ul><p>If you don't specify a value for this property, the server determines the optimal compilation mode. </p> | No                                       |

See [SearchLogProcessing.txt Script Definition](#sample-u-sql-script) for the script definition. 

## Sample input and output datasets
### Input dataset
In this example, the input data resides in an Azure Data Lake Store (SearchLog.tsv file in the datalake/input folder). 

```json
{
    "name": "DataLakeTable",
    "properties": {
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
        "availability": {
            "frequency": "Day",
            "interval": 1
        }
    }
}    
```

### Output dataset
In this example, the output data produced by the U-SQL script is stored in an Azure Data Lake Store (datalake/output folder). 

```json
{
    "name": "EventsByRegionTable",
    "properties": {
        "type": "AzureDataLakeStore",
        "linkedServiceName": "AzureDataLakeStoreLinkedService",
        "typeProperties": {
            "folderPath": "datalake/output/"
        },
        "availability": {
            "frequency": "Day",
            "interval": 1
        }
    }
}
```

### Sample Data Lake Store Linked Service
Here is the definition of the sample Azure Data Lake Store linked service used by the input/output datasets. 

```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
        }
    }
}
```

See [Move data to and from Azure Data Lake Store](data-factory-azure-datalake-connector.md) article for descriptions of JSON properties. 

## Sample U-SQL Script

```
@searchlog =
    EXTRACT UserId          int,
            Start           DateTime,
            Region          string,
            Query           string,
            Duration        int?,
            Urls            string,
            ClickedUrls     string
    FROM @in
    USING Extractors.Tsv(nullEscape:"#NULL#");

@rs1 =
    SELECT Start, Region, Duration
    FROM @searchlog
WHERE Region == "en-gb";

@rs1 =
    SELECT Start, Region, Duration
    FROM @rs1
    WHERE Start <= DateTime.Parse("2012/02/19");

OUTPUT @rs1   
    TO @out
      USING Outputters.Tsv(quoting:false, dateTimeFormat:null);
```

The values for **\@in** and **\@out** parameters in the U-SQL script are passed dynamically by ADF using the ‘parameters’ section. See the ‘parameters’ section in the pipeline definition.

You can specify other properties such as degreeOfParallelism and priority as well in your pipeline definition for the jobs that run on the Azure Data Lake Analytics service.

## Dynamic parameters
In the sample pipeline definition, in and out parameters are assigned with hard-coded values. 

```json
"parameters": {
    "in": "/datalake/input/SearchLog.tsv",
    "out": "/datalake/output/Result.tsv"
}
```

It is possible to use dynamic parameters instead. For example: 

```json
"parameters": {
    "in": "$$Text.Format('/datalake/input/{0:yyyy-MM-dd HH:mm:ss}.tsv', SliceStart)",
    "out": "$$Text.Format('/datalake/output/{0:yyyy-MM-dd HH:mm:ss}.tsv', SliceStart)"
}
```

In this case, input files are still picked up from the /datalake/input folder and output files are generated in the /datalake/output folder. The file names are dynamic based on the slice start time.  


