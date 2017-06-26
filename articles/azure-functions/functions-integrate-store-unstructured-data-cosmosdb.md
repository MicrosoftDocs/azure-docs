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
ms.topic: get-started-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/08/2017
ms.author: rachelap
ms.custom: mvc
---
# Store unstructured data using Azure Functions and Cosmos DB

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) is a great way to store unstructured and JSON data. Combined with Azure Functions, Cosmos DB makes storing data quick and easy with much less code than required for storing data in a relational database.

This quick start walks through how to use the Azure Portal to create an Azure Function that stores unstructured data in a Cosmos DB document. 

![Cosmos DB](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-cosmosdb.png)

## Prerequisites

To complete this tutorial:

[!INCLUDE [Previous quickstart note](../../includes/functions-quickstart-previous-topics.md)]

[!INCLUDE [functions-portal-favorite-function-apps](../../includes/functions-portal-favorite-function-apps.md)]

## Create a function

Create a new C# generic WebHook named `MyTaskList`.

1. Expand your existing functions list, and select the **+** sign to create a new function.
2. Select **GenericWebHook-CSharp** and name it `MyTaskList`

    ![Add new C# Generic WebHook Function App](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-create-new-functionapp.png)

## Add an output binding

An Azure function can have one trigger and any number of input or output bindings. For this example, you'll use an HTTP Request trigger and the Cosmos DB document as the output binding.

1. Select on the function's **Integrate** tab to view or modify the function's trigger and bindings.
2. Select the **New Output** link located at the top right of the page.

    ![Add new Cosmos DB output binding](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-integrate-tab-add-new-output-binding.png)

3. Enter the required information to create the binding. Use the table below to determine the values.

    ![Configure Cosmos DB output binding](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-integrate-tab-configure-cosmosdb-binding.png)

    | Setting      | Suggested value  | Description                                |
    | ------------ | ---------------- | ------------------------------------------ |
    | Document parameter name | mytasklist | Name that refers to the Cosmos DB object in code |
    | Database name | mytasklist | Name of database to save documents |
    | Collection name | mytasklist | Name of collection of Cosmos DB databases |
    | Would you like the Cosmos DB and collection created for you | Yes | Yes or No |
    | Cosmos DB account connection | mytasklist | Connection string pointing to Cosmos DB database |

You must also configure the connection to the Cosmos DB database.

4. Select the **New** link next to the **Cosmos DB document connection** label.
5. Fill in the fields and select the appropriate options needed to create the Cosmos DB document.

    ![Configure Cosmos DB connection](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-create-CosmosDB.png)

    | Setting      | Suggested value  | Description                                |
    | ------------ | ---------------- | ------------------------------------------ |
    | Id | Name of database | Unique ID for the Cosmos DB database  |
    | NoSQL API | Cosmos DB | Cosmos DB or MongoDB  |
    | Subscription | Azure Subscription | Azure Subscription  |
    | Resource Group | myResourceGroup |  The Azure resource group to contain the function. |
    | Location  | WestEurope | WestEurope  |

6. Select the **Ok** button. You may need to wait a few minutes while Azure creates the resources.
7. Select the **Save** button.

## Update the function code

This code sample reads the HTTP Request query strings, and assigns them as members of a `taskDocument` object. The `taskDocument` object automatically saves the data in the Cosmos DB database, and even creates the database on the first use.

Replace the function's template code with the following:

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

## Test the function and database

1. In the function tab, select the **Test** link on the right side of the portal and enter the following HTTP query strings:

  | Setting      | Suggested value  | Description                                |
  | ------------ | ---------------- | ------------------------------------------ |
  | name | Chris P. Bacon | The `name` query string parameter value. |
  | task | Make a BLT sandwich | The `task` query string parameter value. |
  | duedate | 05/12/2017 | The date the task is due |

2. Select the **Run** link.
3. Verify that the function returned an `HTTP 200 OK` Response code.

    ![Configure Cosmos DB output binding](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-test-function.png)

Confirm that an entry was made in the Cosmos DB database.

1. Find your database in the Azure portal and select it.
2. Select the **Data Explorer** option.
3. Expand the nodes until you reach the document's entries.
4. Confirm the database entry. There will be additional metadata in the database alongside your data.

    ![Verify Cosmos DB entry](./media/functions-integrate-store-unstructured-data-cosmosdb/functions-verify-cosmosdb-output.png)

If the data is in the document then you have successfully created an Azure function that stores unstructured data in a Cosmos DB database.

[!INCLUDE [Clean-up section](../../includes/clean-up-section-portal.md)]

## Next steps

For more information about Azure Functions, see the following topics:

[!INCLUDE [Getting help note](../../includes/functions-get-help.md)]
[!INCLUDE [functions-quickstart-next-steps](../../includes/functions-quickstart-next-steps.md)]


