---
title: Get metadata activity in Azure Data Factory | Microsoft Docs
description: Learn how you can use the SQL Server Stored Procedure Activity to invoke a stored procedure in an Azure SQL Database or Azure SQL Data Warehouse from a Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.assetid: 1c46ed69-4049-44ec-9b46-e90e964a4a8e
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/31/2017
ms.author: shlo

---
# Get metadata activity in Azure Data Factory
GetMetadata activity can be used to retrieve metadata of any data in Azure Data Factory. This activity is supported only for data factories of version 2. It can be used in the following scenarios:

- Validate the metadata information of any data
- Trigger a pipeline when data is ready/ available

The following functionality is available in the control flow:
- The output from GetMetadata Activity can be used in conditional expressions to perform validation.
- A pipeline can be triggered when condition is satisfied via Do-Until looping

The GetMetadata Activity takes a dataset as a required input, and outputs metadata information available as output. Currently, only Azure blob dataset is supported. The supported metadata fields are size, structure, and lastModified time.  

## Syntax

### Get Metadata Activity definition:
In the following example, the GetMetadata activity returns metadata about the data represented by the MyDataset. 

```json
{
	"name": "MyActivity",
	"type": "GetMetadata",
	"typeProperties": {
		"fieldList" : ["size", "lastModified", "structure"],
		"dataset": {
			"referenceName": "MyDataset",
			"type": "DatasetReference"
		}
	}
}
```
### Dataset definition:

```json
{
	"name": "MyDataset",
	"properties": {
	"type": "AzureBlob",
		"linkedService": {
			"referenceName": "StorageLinkedService",
			"type": "LinkedServiceReference"
		},
		"typeProperties": {
			"folderPath":"container/folder",
			"Filename": "file.json",
			"format":{
				"type":"JsonFormat"
				"nestedSeperator": ","
			}
		}
	}
}
```

### Output
```json
{
    "size": 1024,
    "structure": [
        {
            "name": "id",
            "type": "Int64"
        }, 
    ],
    "lastModified": "2016-07-12T00:00:00Z"
}
```

## Type properties
Currently GetMetadata activity can fetch the following types of metadata information from an Azure storage dataset.

Property | Description | Allowed Values | Required
-------- | ----------- | -------------- | --------
fieldList | Lists the types of metadata information required.  | <ul><li>size</li><li>structure</li><li>lastModified</li></ul> |	No<br/>If empty, activity returns all 3 supported metadata information. 
dataset | The reference dataset whose metadata activity is to be retrieved by the GetMetadata Activity. <br/><br/>Currently supported dataset type is Azure Blob. Two sub properties are: <ul><li><b>referenceName</b>: reference to an existing Azure Blob Dataset</li><li><b>type</b>: since the dataset is being referenced, it is of the type "DatasetReference"</li></ul> |	<ul><li>String</li><li>DatasetReference</li></ul> |	Yes

## Next steps
See other control flow activities supported by Data Factory: 

- [If condition](control-flow-if-condition.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Do Until Activity](control-flow-do-until-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)