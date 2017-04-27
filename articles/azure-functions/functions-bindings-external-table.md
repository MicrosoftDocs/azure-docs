---
title: Azure Functions External Table binding (Preview) | Microsoft Docs
description: Using External Table bindings in Azure Functions
services: functions
documentationcenter: ''
author: alexkarcher-msft
manager: erikre
editor: ''

ms.assetid:
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 04/12/2017
ms.author: alkarche

---
# Azure Functions External Table binding (Preview)
This article shows how to manipulate tabular data on SaaS providers (e.g. Sharepoint, Dynamics) within your function utilizing built-in bindings. Azure functions supports input, and output bindings for external table.

This binding creates new API connections to SaaS providers, or uses existing API connections from your Function App's resource group.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Supported Table connections

|Connector|Trigger|Input|Output|
|:-----|:---:|:---:|:---:|
|[DB2](https://docs.microsoft.com/azure/connectors/connectors-create-api-db2)||x|x
|[Dynamics 365 for Operations](https://ax.help.dynamics.com/wiki/install-and-configure-dynamics-365-for-operations-warehousing/)||x|x
|[Dynamics 365](https://docs.microsoft.com/azure/connectors/connectors-create-api-crmonline)||x|x
|[Dynamics NAV](https://msdn.microsoft.com/library/gg481835.aspx)||x|x
|[Google Sheets](https://docs.microsoft.com/azure/connectors/connectors-create-api-googledrive)||x|x
|[Informix](https://docs.microsoft.com/azure/connectors/connectors-create-api-informix)||x|x
|[Dynamics 365 for Financials](https://docs.microsoft.com/azure/connectors/connectors-create-api-crmonline)||x|x
|[MySQL](https://docs.microsoft.com/azure/store-php-create-mysql-database)||x|x
|[Oracle Database](https://docs.microsoft.com/azure/connectors/connectors-create-api-oracledatabase)||x|x
|[Common Data Service](https://docs.microsoft.com/common-data-service/entity-reference/introduction)||x|x
|[Salesforce](https://docs.microsoft.com/azure/connectors/connectors-create-api-salesforce)||x|x
|[SharePoint](https://docs.microsoft.com/azure/connectors/connectors-create-api-sharepointonline)||x|x
|[SQL Server](https://docs.microsoft.com/azure/connectors/connectors-create-api-sqlazure)||x|x
|[Teradata](http://www.teradata.com/products-and-services/azure/products/)||x|x
|UserVoice||x|x
|Zendesk||x|x


> [!NOTE]
> External Table connections can also be used in [Azure Logic Apps](https://docs.microsoft.com/azure/connectors/apis-list)

## Usage

For simplicity the example uses a manual trigger. The trigger’s input value is not used.
The example assumes that the connector provides a Contact table with Id, LastName and FirstName columns. The code lists the Contact entities in the table and logs the first and last names.


## Input + Output sample
Suppose you have the following function.json, that defines a [Storage queue trigger](functions-bindings-storage-queue.md),
an external file input, and an external file output:

```json
{
  "bindings": [
    {
      "type": "manualTrigger",
      "direction": "in",
      "name": "input"
    },
    {
      "type": "apiHubTable",
      "direction": "in",
      "name": "table",
      "connection": "ConnectionAppSettingsKey",
      "dataSetName": "default",
      "tableName": "Contact",
      "entityId": "",
    }
  ],
  "disabled": false
}
```
`entityId` must be empty for table bindings.

`ConnectionAppSettingsKey` identifies the app setting that stores the connection string.

A tabular connector provides data sets, and each data set contains tables. The name of the default data set is “default”. These concepts are identified by dataSetName and tableName and are specific to each connector:


|Connector|Dataset|Table|
|:-----|:---|:---| 
|**SharePoint**|Site|SharePoint List
|**SQL**| 	Database| 	Table 
|**Google Sheet**| 	Spreadsheet| 	Worksheet 
|**Excel**| 	Excel file| 	Sheet 


<!--
See the language-specific sample that copies the input file to the output file.

* [C#](#incsharp)
* [Node.js](#innodejs)

-->
<a name="incsharp"></a>

### Usage in C# #

```cs
#r "Microsoft.Azure.ApiHub.Sdk"
#r "Newtonsoft.Json"

using System;
using Microsoft.Azure.ApiHub;

public class Contact
{
    public string Id { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
}

public static async Task Run(string input, ITable<Contact> table, TraceWriter log)
{
    ContinuationToken continuationToken = null;
    do
    {
        var contactsSegment = await table.ListEntitiesAsync(
            continuationToken: continuationToken);

        foreach (var contact in contactsSegment.Items)
        {
            log.Info(string.Format("{0} {1}", contact.FirstName, contact.LastName));
        }

        continuationToken = contactsSegment.ContinuationToken;
    }
    while (continuationToken != null);
}
```

<!--
<a name="innodejs"></a>

### Usage in Node.js

```javascript
module.exports = function(context) {
    context.log('Node.js Queue trigger function processed', context.bindings.myQueueItem);
    context.bindings.myOutputFile = context.bindings.myInputFile;
    context.done();
};
```
-->

## Data Source Settings

### SQL Server

The script to create and populate the Contact table is below. dataSetName is “default”.

```sql
CREATE TABLE Contact
(
	Id int NOT NULL,
	LastName varchar(20) NOT NULL,
	FirstName varchar(20) NOT NULL,
    CONSTRAINT PK_Contact_Id PRIMARY KEY (Id)
)
GO
INSERT INTO Contact(Id, LastName, FirstName)
     VALUES (1, 'Bitt', 'Prad') 
GO
INSERT INTO Contact(Id, LastName, FirstName)
     VALUES (2, 'Glooney', 'Ceorge') 
GO
```

### Google Sheets
In Google docs create a spreadsheet with a worksheet named `Contact`. The connector cannot use the spreadsheet display name. The internal name (in bold) needs to be used as dataSetName, for example: https://docs.google.com/spreadsheets/d/**1UIz545JF_cx6Chm_5HpSPVOenU4DZh4bDxbFgJOSMz0**
Add the column names `Id`, `LastName`, `FirstName` to the first row, the populate with data on subsequent rows.

### Salesforce
dataSetName is “default”.

## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]
