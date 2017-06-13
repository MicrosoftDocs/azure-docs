---
title: Store unstructured data using Azure Functions and Cosmos DB
description: Store unstructured data using Azure Functions and Cosmos DB
services: functions
documentationcenter: functions
author: rachelappel
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, Cosmos DB, dynamic compute, serverless architecture

ms.assetid: 
ms.service: functions
ms.devlang: multiple
ms.topic: ms-hero
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/08/2017
ms.author: rachelap
ms.custom: mvc
---
# Store unstructured data using Azure Functions and Cosmos DB

Azure Cosmos DB is a great way to store unstructured and JSON data. Combined with Azure Functions, Cosmos DB makes storing data quick and easy with much less code than required for storing data in a relational database.

This tutorial walks through how to use the Azure Portal to create an Azure Function that stores unstructured data in a Cosmos DB document. 

## Prerequisites

[!INCLUDE [Previous quickstart note](../../includes/functions-quickstart-previous-topics.md)]

[!INCLUDE [functions-portal-favorite-function-apps](../../includes/functions-portal-favorite-function-apps.md)]

## Create a function

Create a new C# generic WebHook named `MyTaskList`.

1. Expand your existing functions list, and click the + sign to create a new function
1. Select GenericWebHook-CSharp and name it `MyTaskList`

![Add new C# Generic WebHook Function App](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-create-new-functionapp.png)

## Add an output binding

An Azure function can have one trigger and any number of input or output bindings. For this example, we'll use an HTTP Request trigger and the Cosmos DB document as the output binding.

1. Click on the function's *Integrate* tab to view or modify the function's trigger and bindings.
1. Choose the *New Output* link located at the top right of the page.

Note: The HTTP Request trigger is already configured, however, you must add the Cosmos DB document binding.

![Add new Cosmos DB output binding](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-integrate-tab-add-new-output-binding.png)

1. Enter the required information to create the binding. Use the table below to determine the values.

![Configure Cosmos DB output binding](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-integrate-tab-configure-cosmosdb-binding.png)

|  Field | Value  |
|---|---|
| Document parameter name | Name that refers to the Cosmos DB object in code |
| Database name | Name of database to save documents |
| Collection name | Name of grouping of Cosmos DB databases |
| Would you like the Cosmos DB and collection created for you | Yes or No |
| Cosmos DB account connection | Connection string pointing to Cosmos DB database |

You must also configure the connection to the Cosmos DB database.

1. Click the "New" link next to the *Cosmos DB document connection" label.
1. Fill in the fields and select the appropriate options needed to create the Cosmos DB document.

![Configure Cosmos DB connection](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-create-CosmosDB.png)

|  Field | Value  |
|---|---|
| Id | Unique ID for the Cosmos DB database  |
| NoSQL API | Cosmos DB or MongoDB  |
| Subscription | MSDN Subscription  |
| Resource Group  | Create a new group or select an existing one.  |
| Location  | WestEurope  |

1. Click the *Ok* button. You may need to wait a few minutes while Azure creates the resources.
1. Click the *Save* button.

## Update the function code

Replace the function's template code with the following:

Note that the code for this sample is in C# only.

```csharp
using System.Net;

public static HttpResponseMessage Run(HttpRequestMessage req, out object taskDocument, TraceWriter log)
{
    string name = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
        .Value;

    string task = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "task", true) == 0)
        .Value;

    string duedate = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "duedate", true) == 0)
        .Value;

    taskDocument = new {
        name = name,
        duedate = duedate.ToString(),
        task = task
    };

    if (name != "" && task != "") {
        return req.CreateResponse(HttpStatusCode.OK);
    }
    else {
        return req.CreateResponse(HttpStatusCode.BadRequest);
    }
}

```

This code sample reads the HTTP Request query strings, and assigns them as members of a `taskDocument` object. The `taskDocument` object automatically saves the data in the Cosmos DB database, and even creates the database on the first use.

## Test the function and database

1. In the function tab, click on the *Test* link on the right side of the portal and enter the following HTTP query strings:

| Query String | Value |
|---|---|
| name | Chris P. Bacon |
| task | Make a BLT sandwich |
| duedate | 05/12/2017 |

1. Click the *Run* link.
1. Verify that the function returned an *HTTP 200 OK* Response code.

![Configure Cosmos DB output binding](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-test-function.png)

Confirm that an entry was made in the Cosmos DB database.

1. Find your database in the Azure portal and select it.
1. Select the *Data Explorer* option.
1. Expand the nodes until you reach the document's entries.
1. Confirm the database entry. There will be additional metadata in the database alongside your data.

![Verify Cosmos DB entry](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-verify-cosmosdb-output.png)

If the data is in the document then you have successfully created an Azure function that stores unstructured data in a Cosmos DB database.

## Clean up resources

[!INCLUDE [Next steps note](../../includes/functions-quickstart-cleanup.md)]

## Next steps

For more information about Azure Functions, see the following topics:

[!INCLUDE [Getting help note](../../includes/functions-get-help.md)]

[!INCLUDE [functions-quickstart-next-steps](../../includes/functions-quickstart-next-steps.md)]