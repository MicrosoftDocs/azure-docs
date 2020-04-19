---
title: Store unstructured data using Azure Cosmos DB and Functions 
description: Store unstructured data using Azure Functions and Cosmos DB

ms.topic: quickstart
ms.date: 04/14/2020
ms.custom: mvc
---
# Store unstructured data using Azure Functions and Azure Cosmos DB

[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) is a great way to store unstructured and JSON data. Combined with Azure Functions, Cosmos DB makes storing data quick and easy with much less code than required for storing data in a relational database.

> [!NOTE]
> At this time, the Azure Cosmos DB trigger, input bindings, and output bindings work with SQL API and Graph API accounts only.

In Azure Functions, input and output bindings provide a declarative way to connect to external service data from your function. In this article, learn how to update an existing function to add an output binding that stores unstructured data in an Azure Cosmos DB document.

## Prerequisites

To complete this tutorial:

[!INCLUDE [Previous quickstart note](../../includes/functions-quickstart-previous-topics.md)]

## Create an Azure Cosmos DB account

You must have an Azure Cosmos DB account that uses the SQL API before you create the output binding.

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## Add an output binding

1. In the Azure portal, navigate to and select the function app you created previously.

1. Select **Functions**, and then select the HttpTrigger function.

    :::image type="content" source="./media/functions-integrate-store-unstructured-data-cosmosdb/functions-select-http-function.png" alt-text="Select your Http function in the Azure portal." border="true":::

1. Select **Integration** and **+ Add output**.

     :::image type="content" source="./media/functions-integrate-store-unstructured-data-cosmosdb/functions-add-output-binding.png" alt-text="Add an Azure Cosmos DB output binding." border="true":::

1. Use the **Create Output** settings as specified in the table:

     :::image type="content" source="./media/functions-integrate-store-unstructured-data-cosmosdb/functions-configure-cosmosdb-binding.png" alt-text="Configure Azure Cosmos DB output binding." border="true":::

    | Setting      | Suggested value  | Description                                |
    | ------------ | ---------------- | ------------------------------------------ |
    | **Binding Type** | Azure Cosmos DB | Name of the binding type to select to create the output binding to Azure Cosmos DB. |
    | **Document parameter name** | taskDocument | Name that refers to the Cosmos DB object in code. |
    | **Database name** | taskDatabase | Name of database to save documents. |
    | **Collection name** | taskCollection | Name of the database collection. |
    | **If true, creates the Cosmos DB database and collection** | Yes | The collection doesn't already exist, so create it. |
    | **Cosmos DB account connection** | New setting | Select **New**, then choose **Azure Cosmos DB Account** and the **Database account** you created earlier, and then select **OK**. Creates an application setting for your account connection. This setting is used by the binding to connection to the database. |

1. Select **OK** to create the binding.

## Update the function code

Replace the existing function code with the following code, in your chosen language:

# [C#](#tab/csharp)

Replace the existing C# function with the following code:

```csharp
#r "Newtonsoft.Json"

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

public static IActionResult Run(HttpRequest req, out object taskDocument, ILogger log)
{
    string name = req.Query["name"];
    string task = req.Query["task"];
    string duedate = req.Query["duedate"];

    // We need both name and task parameters.
    if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(task))
    {
        taskDocument = new
        {
            name,
            duedate,
            task
        };

        return (ActionResult)new OkResult();
    }
    else
    {
        taskDocument = null;
        return (ActionResult)new BadRequestResult();
    }
}
```

# [JavaScript](#tab/javascript)

Replace the existing JavaScript function with the following code:

```js
module.exports = async function (context, req) {

    // We need both name and task parameters.
    if (req.query.name && req.query.task) {

        // Set the output binding data from the query object.
        context.bindings.taskDocument = req.query;

        // Success.
        context.res = {
            status: 200
        };
    }
    else {
        context.res = {
            status: 400,
            body: "The query options 'name' and 'task' are required."
        };
    }
};
```
---

This code sample reads the HTTP Request query strings and assigns them to fields in the `taskDocument` object. The `taskDocument` binding sends the object data from this binding parameter to be stored in the bound document database. The database is created the first time the function runs.

## Test the function and database

1. Select **Test**. Under **Query**, select **+ Add parameter** and add the following parameters to the query string:

    + `name`
    + `task`
    + `duedate`

    :::image type="content" source="./media/functions-integrate-store-unstructured-data-cosmosdb/functions-test-function.png" alt-text="Test the function." border="true":::


1. Select **Run** and verify that a 200 status is returned.

    :::image type="content" source="./media/functions-integrate-store-unstructured-data-cosmosdb/functions-test-function-output.png" alt-text="Test the function." border="true":::


1. In the Azure portal, search for and select **Azure Cosmos DB**.

    :::image type="content" source="./media/functions-integrate-store-unstructured-data-cosmosdb/functions-search-cosmos-db.png" alt-text="Search for the Cosmos DB service." border="true":::

1. Choose your Azure Cosmos DB account, then select  **Data Explorer**.

1. Expand the **TaskCollection** nodes, select the new document, and confirm that the document contains your query string values, along with some additional metadata.

    :::image type="content" source="./media/functions-integrate-store-unstructured-data-cosmosdb/functions-data-explorer-check-document.png" alt-text="Verify the string values in your document." border="true":::

You've successfully added a binding to your HTTP trigger to store unstructured data in an Azure Cosmos DB.

[!INCLUDE [Clean-up section](../../includes/clean-up-section-portal.md)]

## Next steps

For more information about binding to a Cosmos DB database, see [Azure Functions Cosmos DB bindings](functions-bindings-cosmosdb.md).

[!INCLUDE [functions-quickstart-next-steps](../../includes/functions-quickstart-next-steps-2.md)]
