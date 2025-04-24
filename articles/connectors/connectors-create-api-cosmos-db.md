---
title: Connect to Azure Cosmos DB from Workflows
description: Access, create, or process documents in Azure Cosmos DB using workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: jcocchi
ms.author: jucocchi
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 04/15/2025
---

# Access, create, or process documents in Azure Cosmos DB with workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

From a workflow in Azure Logic Apps, you can connect to Azure Cosmos DB and work with documents by using the **Azure Cosmos DB** connector. For example, you can use connector operations to create, update, read, query, or delete documents.

You can connect to Azure Cosmos DB from both Consumption and Standard logic app workflows by using the [*managed connector* operations](/connectors/documentdb/), which are hosted, managed, and run in global, multitenant Azure. For Standard workflows, Azure Cosmos DB also provides [*built-in* operations](/azure/logic-apps/connectors/built-in/reference/azurecosmosdb/) that run alongside the runtime for single-tenant Azure Logic Apps. Built-in operations offer better performance, higher throughput, and sometimes different functionality. For example, in a Standard workflow, you can use the built-in trigger to monitor an Azure Cosmos DB container for new or updated items. You can combine Azure Cosmos DB operations with others in a workflow to support scenarios like event sourcing and general data processing.

## Limitations

- Currently, only stateful workflows in a Standard workflow can use both the managed connector operations and built-in operations. Stateless workflows can use only the built-in operations.

- The Azure Cosmos DB connector supports only Azure Cosmos DB accounts created with [Azure Cosmos DB for NoSQL](/azure/cosmos-db/choose-api#coresql-api).

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure Cosmos DB account](/azure/cosmos-db/sql/create-cosmosdb-resources-portal).

- A logic app workflow from where you want to access an Azure Cosmos DB account. To use the Azure Cosmos DB built-in trigger, you need to start with a blank workflow.

## Connector technical reference

- For reference information about the Azure Cosmos DB *managed connector* operations, such as triggers, actions, and limits, see the [managed connector's reference page](/connectors/documentdb/).

- For reference information about the Azure Cosmos DB *built-in* operations, such as triggers, actions, and limits, see the [built-in operations reference page](/azure/logic-apps/connectors/built-in/reference/azurecosmosdb/).

## Add Azure Cosmos DB trigger

In Azure Logic Apps, every workflow must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met.

If you're working with a Standard workflow, the built-in trigger named **When an item is created or modified** is available and is based on the [Azure Cosmos DB change feed design pattern](/azure/cosmos-db/sql/change-feed-design-patterns). This trigger is unavailable for Consumption workflows.

### [Consumption](#tab/consumption)

No Azure Cosmos DB triggers are available for Consumption workflows. Instead, add a trigger that works for your scenario.

### [Standard](#tab/standard)

To add an Azure Cosmos DB built-in trigger to a Standard workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open the Standard workflow in the designer.

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

   The following example shows the **When an item is created or modified** trigger:

   :::image type="content" source="media/connectors-create-api-cosmos-db/trigger-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard workflow, and trigger named When an item is created or modified.":::

1. To add any other available parameters, open the **Advanced parameters** list.

1. Configure any other parameters or settings as needed.

1. Add any other actions that you want to the workflow.

1. On the designer toolbar, select **Save**.

---

## Add Azure Cosmos DB action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in a workflow that follows a trigger or another action. The Azure Cosmos DB connector offers actions for both Consumption and Standard workflows. The following examples show how to use an action that creates or updates a document.

### [Consumption](#tab/consumption)

To add an Azure Cosmos DB action to a Consumption workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Consumption workflow in the designer.

1. If the workflow is blank, add any trigger that you want.

   This example starts with the [**When a HTTP request is received** trigger](connectors-native-reqres.md#add-request-trigger).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, follow [these general steps to add the **Azure Cosmos DB** action that you want](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=consumption#add-action).

   This example uses the action named **Create or update document (V3)**.

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account now](#connect-to-azure-cosmos-db).

1. In the action information pane, on the **Parameters** tab, provide the following necessary information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Azure Cosmos DB account name** | Yes | <*Cosmos-DB-account-name*> | The account name for the Azure Cosmos DB account. |
   | **Database ID** | Yes | <*Cosmos-DB-database-name*> | The database to connect. |
   | **Collection ID** | Yes | <*Cosmost-DB-container-name*> | The container to query. |
   | **Document** | Yes | <*JSON-document*> | The JSON document to create. This example uses the request body from the trigger output. <br><br>**Tip**: If the HTTP trigger's **Body** token doesn't appear in the dynamic content list for you to add, next to the trigger name, select **See more**. <br><br>**Note**: Make sure that the body is well-formed JSON, and at a minimum, contains the **`id`** property and the partition key property for your document. If a document with the specified **`id`** and partition key exists, the document is updated. Otherwise, a new document is created. |

   For example:

   :::image type="content" source="media/connectors-create-api-cosmos-db/action-consumption.png" alt-text="Screenshot shows Azure portal, designer for Consumption workflow, and action named Create or update document (V3).":::

1. To add any other available parameters, open the **Advanced parameters** list.

1. Configure any other parameters or settings as needed.

1. On the designer toolbar, select **Save**.

1. Test the workflow to confirm that the action creates a document in the specified container.

### [Standard](#tab/standard)

To add an Azure Cosmos DB built-in action to a Standard workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard workflow in the designer.

1. If the workflow is blank, add any trigger that you want.

   This example starts with the [**When a HTTP request is received** trigger](connectors-native-reqres.md#add-request-trigger), which uses a basic schema definition to represent the item that you want to create:

   :::image type="content" source="./media/connectors-create-api-cosmos-db/http-trigger-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard workflow, and trigger named When a HTTP request is received.":::

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
   | **Item** | Yes | <*JSON-document*> | The JSON document to create. This example uses the **id** output from the Request trigger. <br><br>**Note**: If you use the **body** trigger output, make sure that the body content is well-formed JSON, and at a minimum, contains the **`id`** attribute and the **`partitionKey`** attribute for your document. If a document with these attributes exists, the document is updated. Otherwise, a new document is created. |

   The following example shows the action named **Create or update item**, which includes the **Item** and **Partition Key** parameter values from the output for the trigger named **When a HTTP request is received**:

   :::image type="content" source="media/connectors-create-api-cosmos-db/create-action-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard workflow, and Azure Cosmos DB built-in action named Create or update item.":::

1. Configure any other parameters or settings as needed.

1. On the designer toolbar, select **Save**.

1. Test the workflow to confirm that the action creates a document in the specified container.

---

## Connect to Azure Cosmos DB

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

Before you can configure an [Azure Cosmos DB trigger](#add-azure-cosmos-db-trigger) or [Azure Cosmos DB action](#add-azure-cosmos-db-action), you need to connect to a database account.

### [Consumption](#tab/consumption)

For a Consumption workflow, an Azure Cosmos DB connection requires the following information:

| Parameter | Required | Value | Description |
|-----------|----------|-------|-------------|
| **Connection Name** | Yes | <*connection-name*> | The name to use for the connection. |
| **Authentication Type** | Yes | <*connection-type*> | The authentication type to use. This example uses **Access key**. <br><br>- If you select **Access Key**, provide the remaining required property values to create the connection. <br><br>- If you select **Microsoft Entra ID Integrated**, no other property values are required, but you have to configure the connection by following the steps for [Microsoft Entra authentication and Azure Cosmos DB connector](/connectors/documentdb/#azure-ad-authentication-and-cosmos-db-connector). <br><br>- To set up a managed identity, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity?tabs=consumption). |
| **Account ID** | Yes | <*account-ID*> | The name for the Azure Cosmos DB account to use for this connection. |
| **Access Key To Your Azure Cosmos DB Account** | Yes | <*access-key*> | The access key for the Azure Cosmos DB account to use for this connection. This value is either a read-write key or a read-only key. <br><br>**Note**: To find the key, go to the Azure Cosmos DB account page. In the account menu, under **Settings**, select **Keys**. Copy one of the available key values. |

> [!NOTE]
>
> After you create the connection, if you have a different Azure Cosmos DB connection
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
> After you create the connection, if you have a different Azure Cosmos DB connection
> that you want to use instead, or if you want to create a new connection, select
> **Change connection** in the **Parameters** tab on the trigger or action information pane.

---

## Best practices for Azure Cosmos DB built-in operations

### Get iterable results from the Query items action

The **Query items** built-in action in a Standard workflow has many dynamic content outputs available for use in subsequent actions. To get the query result items or item metadata as an iterable object, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard workflow in the designer.

1. If the workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, follow [these general steps to add the **Azure Cosmos DB** action named **Query items**](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action).

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account](#connect-to-azure-cosmos-db).

1. In the action information pane, on the **Parameters** tab, provide the following necessary information:

   | Parameters | Required | Value | Description |
   |------------|----------|-------|-------------|
   | **Database Id** | Yes | <*database-ID*> | The database to connect. |
   | **Container Id** | Yes | <*container-ID*> | The container to query. |
   | **SQL Query** | Yes | <*sql-query*> | The SQL query for the request. |

   The following example shows the **Query items** action:

   :::image type="content" source="media/connectors-create-api-cosmos-db/query-action-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard workflow, and Azure Cosmos DB built-in action named Query items.":::

1. Configure any other parameters or settings as needed.

1. Under the **Query items** action, follow [these general steps to add an action that you want to run on all the returned query items](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action).

   This example uses the Azure Cosmos DB built-in action named **Delete an item**.

1. In the **Delete an item** action, you can access outputs from the **Query items** action by following these steps:

   1. Select inside any input field to show the available options.

   1. Select the lightning icon to open the dynamic content list.
   
   1. From the **Query items** section in the list, select the output you want, or select **See more** for more outputs.

      For example, you can select **Response Items Item** to populate the **Item Id** field with IDs from the query results.

      After you select the **Response Items Item**, the **For each** action is automatically added to iterate through all the query results. The **For each** loop contains the **Delete an item** action.

      :::image type="content" source="media/connectors-create-api-cosmos-db/delete-item-standard.png" alt-text="Screenshot shows Azure portal, designer for Standard workflow, and Azure Cosmos DB built-in action named Delete an item.":::

  1. Add any other actions that you want to the loop.

1. On the designer toolbar, select **Save**.

1. Test the workflow to confirm that the actions return the output that you expect.

## Related content

* [Managed connectors for Azure Logic Apps](managed.md)
* [Built-in connectors for Azure Logic Apps](built-in.md)
* [What are connectors in Azure Logic Apps](introduction.md)
