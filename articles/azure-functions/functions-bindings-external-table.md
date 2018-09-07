---
title: External Table binding for Azure Functions (experimental)
description: Using External Table bindings in Azure Functions
services: functions
author: alexkarcher-msft
manager: jeconnoc

ms.assetid:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 04/12/2017
ms.author: alkarche

---
# External Table binding for Azure Functions (experimental)

This article explains how to work with tabular data on SaaS providers, such as Sharepoint and Dynamics, in Azure Functions. Azure Functions supports input and output bindings for external tables.

> [!IMPORTANT]
> The External Table binding is experimental and might never reach Generally Available (GA) status. It is included only in Azure Functions 1.x, and there are no plans to add it to Azure Functions 2.x. For scenarios that require access to data in SaaS providers, consider using [logic apps that call into functions](functions-twitter-email.md).

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## API connections

Table bindings leverage external API connections to authenticate with third-party SaaS providers. 

When assigning a binding you can either create a new API connection or use an existing API connection within the same resource group.

### Available API connections (tables)

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
> External Table connections can also be used in [Azure Logic Apps](https://docs.microsoft.com/azure/connectors/apis-list).

## Creating an API connection: step by step

1. In the Azure portal page for your function app, select the plus sign (**+**) to create a function.

1. In the **Scenario** box, select **Experimental**.

1. Select **External table**.

1. Select a language.

2. Under **External Table connection**, select an existing connection or select **new**.

1. For a new connection, configure the settings, and select **Authorize**.

1. Select **Create** to create the function.

1. Select **Integrate > External Table**.

1. Configure the connection to use your target table. These settings will vary between SaaS providers. Examples are included in the following section.

## Example

This example connects to a table named "Contact" with Id, LastName, and FirstName columns. The code lists the Contact entities in the table and logs the first and last names.

Here's the *function.json* file:

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

Here's the C# script code:

```cs
#r "Microsoft.Azure.ApiHub.Sdk"
#r "Newtonsoft.Json"

using System;
using Microsoft.Azure.ApiHub;

//Variable name must match column type
//Variable type is dynamically bound to the incoming data
public class Contact
{
    public string Id { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
}

public static async Task Run(string input, ITable<Contact> table, TraceWriter log)
{
    //Iterate over every value in the source table
    ContinuationToken continuationToken = null;
    do
    {   
        //retrieve table values
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

### SQL Server data source

To create a table in SQL Server to use with this example, here's a script. `dataSetName` is “default.”

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

### Google Sheets data source

To create a table to use with this example in Google Docs, create a spreadsheet with a worksheet named `Contact`. The connector cannot use the spreadsheet display name. The internal name (in bold) needs to be used as dataSetName, for example: `docs.google.com/spreadsheets/d/`**`1UIz545JF_cx6Chm_5HpSPVOenU4DZh4bDxbFgJOSMz0`**
Add the column names `Id`, `LastName`, `FirstName` to the first row, then populate data on subsequent rows.

### Salesforce

To use this example with Salesforce, `dataSetName` is “default.”

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `apiHubTable`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the event item in function code. | 
|**connection**| Identifies the app setting that stores the API connection string. The app setting is created automatically when you add an API connection in the integrate UI.|
|**dataSetName**|The name of the dataset that contains the table to read.|
|**tableName**|The name of the table|
|**entityId**|Must be empty for table bindings.

A tabular connector provides data sets, and each data set contains tables. The name of the default data set is “default.” The titles for a dataset and a table in various SaaS providers are listed below:

|Connector|Dataset|Table|
|:-----|:---|:---| 
|**SharePoint**|Site|SharePoint List
|**SQL**|Database|Table 
|**Google Sheet**|Spreadsheet|Worksheet 
|**Excel**|Excel file|Sheet 

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
