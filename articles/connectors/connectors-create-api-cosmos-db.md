---
title: Connect to Azure Cosmos DB from workflows
description: Access, create, and process documents in Azure Cosmos DB from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: jcocchi
ms.author: jucocchi
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 04/08/2025
---

# Process and create Azure Cosmos DB documents using Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

From your workflow in Azure Logic Apps, you can connect to Azure Cosmos DB and work with documents by using the [Azure Cosmos DB connector](/connectors/documentdb/). This connector provides triggers and actions that your workflow can use for operations in Azure Cosmos DB. For example, you can create or update, read, query, and delete documents.

You can connect to Azure Cosmos DB from both Consumption and Standard logic app workflows by using the [*managed connector*](managed.md) operations, which run in global, multitenant Azure. For Standard workflows, Azure Cosmos DB also provides [*built-in* operations](/azure/logic-apps/connectors/built-in/reference/azurecosmosdb/), which are currently in preview, run alongside the runtime in Azure Logic Apps, and offer different functionality, better performance, and higher throughput. For example, if you're working with a Standard workflow, you can use the built-in trigger to respond to changes in an Azure Cosmos DB container. You can combine Azure Cosmos DB operations with other actions and triggers in your logic app workflows to enable scenarios such as event sourcing and general data processing.

## Limitations

- Currently, only stateful workflows in a Standard workflow can use both the managed connector operations and built-in operations. Stateless workflows can use only the built-in operations.

- The Azure Cosmos DB connector supports only Azure Cosmos DB accounts created with [Azure Cosmos DB for NoSQL](/azure/cosmos-db/choose-api#coresql-api).

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure Cosmos DB account](/azure/cosmos-db/sql/create-cosmosdb-resources-portal).

- A logic app workflow from which you want to access your Azure Cosmos DB account. To use the Azure Cosmos DB built-in trigger, you need to start with a blank workflow.

## Connector technical reference

- For reference information about the Azure Cosmos DB *managed connector* operations, such as triggers, actions, and limits, see the [managed connector's reference page](/connectors/documentdb/).

- For reference information about the Azure Cosmos DB *built-in* operations, such as triggers, actions, and limits, see the [built-in operations reference page](/azure/logic-apps/connectors/built-in/reference/azurecosmosdb/).

## Add Azure Cosmos DB trigger

In Azure Logic Apps, every workflow must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met.

If you're working with a Standard workflow, the built-in trigger named **When an item is created or modified** is available and is based on the [Azure Cosmos DB change feed pattern](/azure/cosmos-db/sql/change-feed-design-patterns). This trigger is unavailable for Consumption workflows.

### [Consumption](#tab/consumption)

No Azure Cosmos DB triggers are available for Consumption workflows.

### [Standard](#tab/standard)

To add an Azure Cosmos DB built-in trigger to a Standard logic app workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. Follow [these general steps to add the trigger named **When an item is created or modified**](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-trigger).

1. If you're prompted for connection details, [create a connection to Azure Cosmos DB now](#connect-to-azure-cosmos-db).

1. On the trigger information pane, on the **Parameters** tab, provide the following necessary information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Database Id** | Yes | <*database-name*> | The name of the database with the container to monitor. This database should also have the lease container. If you don't have a lease container, the connector creates one for you in a later step. |
   | **Monitored Container Id** | Yes | <*container-name*> | The name of the container to monitor. This container should exist in the specified database. |
   | **Lease Container Id** |  Yes | <*lease-container-name*> | The name of either an existing container or a new container to create. The trigger automatically populates with **`leases`** as the default name. |
   | **Create Lease Container** | No | **No** or **Yes** | If the lease container exists in the specified database, select **No**. To create this container, select **Yes**. If you select **Yes** and are using manual throughput dedicated for each container, make sure to open the **Advanced parameters** list to select the **Lease Container Throughput** parameter. Enter the number of [request units (RUs)](/azure/cosmos-db/request-units) to provision for this container. |

   > [!NOTE]
   >
   > The trigger creates a workflow run for each item created or modified in Azure Cosmos DB, 
   > so the dynamic content output of this trigger is always a single item.

1. To add any other available parameters, open the **Advanced parameters** list.

1. Configure any other parameters or settings as needed.

1. Add any other actions that you want to your workflow.

1. On the designer toolbar, select **Save**.

---

## Add Azure Cosmos DB action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action. The Azure Cosmos DB connector offers actions for both Consumption and Standard workflows. The following examples show how to use an action that creates or updates a document.

### [Consumption](#tab/consumption)

To add an Azure Cosmos DB action, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Consumption workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**When an HTTP request is received** trigger](connectors-native-reqres.md#add-request-trigger).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, follow [these general steps to add the **Azure Cosmos DB** action that you want](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=consumption#add-action).

   This example uses the action named **Create or update document (V3)**.

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account now](#connect-to-azure-cosmos-db).

1. In the action information pane, on the **Parameters** tab, provide the following necessary information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Azure Cosmos DB account name** | Yes | Select either **Use connection settings (<*Azure-Cosmos-DB-account-name*>)**, or manually enter the name. | The account name for the Azure Cosmos DB account. |
   | **Database ID** | Yes | <*database-ID*> | The database to connect. |
   | **Collection ID** | Yes | <*collection-ID*> | The collection to query. |
   | **Document** | Yes | <*JSON-document*> | The JSON document to create. This example uses the request body from the trigger output. <br><br>**Tip**: If the HTTP trigger's **Body** token doesn't appear in the dynamic content list for you to add, next to the trigger name, select **See more**. <br><br>**Note**: Make sure that the body is well-formed JSON, and at a minimum, contains the **`id`** property and the partition key property for your document. If a document with the specified **`id`** and partition key exists, the document is updated. Otherwise, a new document is created. |

1. To add any other available parameters, open the **Advanced parameters** list.

1. Configure any other parameters or settings as needed.

1. On the designer toolbar, select **Save**.

1. Test your workflow to confirm that the action creates a document in the specified container.

### [Standard](#tab/standard)

To add a Azure Cosmos DB built-in action to Standard workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**When an HTTP request is received** trigger](connectors-native-reqres.md#add-request-trigger), which uses a basic schema definition to represent the item that you want to create.

1. Under the trigger or action where you want to add the Azure Cosmos DB action, follow [these general steps to add the **Azure Cosmos DB** action that you want](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action).

   > [!NOTE]
   >
   > If you have a stateful workflow, *managed connector* actions are also available,
   > but use them only when the *built-in* actions that you want aren't available.

   This example uses the action named **Create or update item**, which creates a new item or updates an existing item.

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account now](#connect-to-azure-cosmos-db).

1. In the action information pane, on the **Parameters** tab, provide the following necessary information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Database Id** | Yes | <*database-ID*> | The database to connect. |
   | **Container Id** | Yes | <*container-ID*> | The container to query. |
   | **Item** | Yes | <*JSON-document*> | The JSON document to create. This example uses the request body from the trigger output. <br><br>**Tip**: If the HTTP trigger's **Body** token doesn't appear in the dynamic content list for you to add, next to the trigger name, select **See more**. <br><br>**Note**: Make sure that the body is well-formed JSON, and at a minimum, contains the **`id`** property and the partition key property for your document. If a document with the specified **`id`** and partition key exists, the document is updated. Otherwise, a new document is created. |

1. Configure any other parameters or settings as needed.

1. On the designer toolbar, select **Save**.

1. Test your workflow to confirm that the action creates a document in the specified container.

---

## Connect to Azure Cosmos DB

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

Before you can configure your [Azure Cosmos DB trigger](#add-azure-cosmos-db-trigger) or [Azure Cosmos DB action](#add-azure-cosmos-db-action), you need to connect to a database account.

### [Consumption](#tab/consumption)

For a Consumption workflow, an Azure Cosmos DB connection requires the following information:

| Parameter | Required | Value | Description |
|-----------|----------|-------|-------------|
| **Connection Name** | Yes | <*connection-name*> | The name to use for the connection. |
| **Authentication Type** | Yes | <*connection-type*> | The authentication type to use. This example uses **Access key**. <br><br>- If you select **Access Key**, provide the remaining required property values to create the connection. <br><br>- If you select **Microsoft Entra ID Integrated**, no other property values are required, but you have to configure your connection by following the steps for [Microsoft Entra authentication and Azure Cosmos DB connector](/connectors/documentdb/#azure-ad-authentication-and-cosmos-db-connector). <br><br>- To set up and use a managed identity, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity?tabs=consumption). |
| **Account ID** | Yes | <*account-ID*> | The name for the Azure Cosmos DB account to use for this connection. |
| **Access Key To Your Azure Cosmos DB Account** | Yes | <*access-key*> | The access key for the Azure Cosmos DB account to use for this connection. This value is either a read-write key or a read-only key. <br><br>**Note**: To find the key, go to the Azure Cosmos DB account page. In the account menu, under **Settings**, select **Keys**. Copy one of the available key values. |

> [!NOTE]
>
> After you create your connection, if you have a different Azure Cosmos DB connection
> that you want to use instead, or if you want to create a new connection, select
> **Change connection** in the **Parameters** tab on the trigger or action information pane.

### [Standard](#tab/standard)

For a Standard workflow, an Azure Cosmos DB connection (built-in) requires the following information:

| Parameter | Required | Value | Description |
|-----------|----------|-------|-------------|
| **Connection Name** | Yes | <*connection-name*> | The name to use for the connection. |
| **Connection String** | Yes | <*connection-string*> | The Azure Cosmos DB connection string to use for the connection. <br><br>**Note**: To find the connection string, go to the Azure Cosmos DB account page. In the account menu, under **Settings**, select **Keys**. Copy one of the available connection string values. |

> [!NOTE]
>
> After you create your connection, if you have a different Azure Cosmos DB connection
> that you want to use instead, or if you want to create a new connection, select
> **Change connection** in the **Parameters** tab on the trigger or action information pane.

---

## Best practices for Azure Cosmos DB built-in operations

### Get iterable results from the Query items action

The built-in **Query items** action in a **Logic App (Standard)** workflow has many dynamic content outputs available for use in subsequent actions. To get the query result items or item metadata as an iterable object, use the following steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **Insert a new step** (**+**) > **Add an action**.

1. On the designer, make sure that **Add an operation** is selected. In the **Add an action** pane that opens, under the **Choose an operation** search box, select **Built-in** to find the **Azure Cosmos DB** actions.

1. In the search box, enter `Azure Cosmos DB`. Select the **Query items (preview)** action.

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

   | Properties | Required | Value | Description |
   |------------|----------|-------|-------------|
   | **Database Id** | Yes | <*database-ID*> | The database that you want to connect. |
   | **Container Id** | Yes | <*container-ID*> | The container that you want to query. |
   | **SQL Query** | Yes | <*sql-query*> | The SQL query for your request. |
   |||||

   The following image shows an example action:

   :::image type="content" source="./media/connectors-create-api-cosmos-db/standard-query-action.png" alt-text="Screenshot showing the designer for a Standard logic app workflow with the Azure Cosmos DB 'Query items' action and parameters configuration.":::

1. Configure any other action settings as needed.

1. Under the action, select **Insert a new step** (**+**) > **Add an action**. In the **Add an action** pane that opens, select the action that you want to run on all of the query result items.

This example uses the Azure Cosmos DB built-in action named **Delete an item (preview)**.

1. In the action that you previously added, you can access data from the query action output. Click inside any of the input fields in that action so that the dynamic content list appears. Select any of the available response items or select **See more** for more options.

This example uses the **Response Item Id** in the **Item Id** field to populate IDs based on the query results.

   :::image type="content" source="./media/connectors-create-api-cosmos-db/standard-query-output.png" alt-text="Screenshot showing the designer for a Standard logic app workflow with the Azure Cosmos DB **Query items** action dynamic content outputs.":::

1. After you select a response item, the **For each** action is automatically added to iterate through all the query results. The **For each** loop contains the action that you previously added. You can add any other actions that you want to the loop.

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your workflow returns the output that you expect.

## Next steps

* [Managed connectors for Azure Logic Apps](managed.md)
* [Built-in connectors for Azure Logic Apps](built-in.md)
* [What are connectors in Azure Logic Apps](introduction.md)
