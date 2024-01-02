---
title: Connect to Azure Cosmos DB
description: Process and create Azure Cosmos DB documents using Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: jcocchi
ms.author: jucocchi
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/23/2022
tags: connectors
ms.custom: ignite-2022
---

# Process and create Azure Cosmos DB documents using Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

From your workflow in Azure Logic Apps, you can connect to Azure Cosmos DB and work with documents by using the [Azure Cosmos DB connector](/connectors/documentdb/). This connector provides triggers and actions that your workflow can use for Azure Cosmos DB operations. For example, actions include creating or updating, reading, querying, and deleting documents.

You can connect to Azure Cosmos DB from both **Logic App (Consumption)** and **Logic App (Standard)** resource types by using the [*managed connector*](managed.md) operations. For **Logic App (Standard)**, Azure Cosmos DB also provides [*built-in*](built-in.md) operations, which are currently in preview and offer different functionality, better performance, and higher throughput. For example, if you're working with the **Logic App (Standard)** resource type, you can use the built-in trigger to respond to changes in an Azure Cosmos DB container. You can combine Azure Cosmos DB operations with other actions and triggers in your logic app workflows to enable scenarios such as event sourcing and general data processing.

## Limitations

- Currently, only stateful workflows in a **Logic App (Standard)** resource can use both the managed connector operations and built-in operations. Stateless workflows can use only built-in operations.

- The Azure Cosmos DB connector supports only Azure Cosmos DB accounts created with [Azure Cosmos DB for NoSQL](../cosmos-db/choose-api.md#coresql-api).

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure Cosmos DB account](../cosmos-db/sql/create-cosmosdb-resources-portal.md).

- A logic app workflow from which you want to access your Azure Cosmos DB account. To use the Azure Cosmos DB trigger, you need to [create your logic app using the **Logic App (Standard)** resource type](../logic-apps/create-single-tenant-workflows-azure-portal.md), and add a blank workflow.

## Add Azure Cosmos DB trigger

In Azure Logic Apps, every workflow must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met.

If you're working with the **Logic App (Standard)** resource type, the built-in trigger called **When an item is created or modified (preview)** is available and is based on the [Azure Cosmos DB change feed pattern](../cosmos-db/sql/change-feed-design-patterns.md). This trigger is unavailable for the **Logic App (Consumption)** resource type.

### [Consumption](#tab/consumption)

No Azure Cosmos DB triggers are available for the **Logic App (Consumption)** resource type.

### [Standard](#tab/standard)

To add an Azure Cosmos DB built-in trigger to a logic app workflow in single-tenant Azure Logic Apps, use the following steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. To find the trigger, use the following steps:

   1. On the designer, select **Choose an operation**.

   1. After the **Add a trigger** pane opens, under the **Choose an operation** search box, select **Built-in**.

   1. In the search box, enter `Azure Cosmos DB`. From the triggers list, select the trigger named **When an item is created or modified (preview)**.

   :::image type="content" source="./media/connectors-create-api-cosmos-db/standard-trigger-add.png" alt-text="Screenshot showing Azure portal and designer for a Standard logic app workflow with the trigger named 'When an item is created or modified (preview)' selected.":::

1. If you're prompted for connection details, [create a connection to Azure Cosmos DB now](#connect-to-azure-cosmos-db).

1. On the **Parameters** tab, provide the necessary information for the trigger.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Database Id** | Yes | <*database-name*> | The name of the database with the container that you want to monitor. This database should also have the lease container. If you don't already have a lease container, the connector will create one for you in a later step. |
   | **Monitored Container Id** | Yes | <*container-name*> | The name of the container that you want to monitor. This container should already exist in the specified database. |
   | **Lease Container Id** |  Yes | <*lease-container-name*> | The name of either an existing lease container or a new container that you want created for you. The trigger pre-fills `leases` as a common default name. |
   | **Create Lease Container** | No | **No** or **Yes** | If the lease container already exists in the specified database, select **No**. If you want the trigger to create this container, select **Yes**. If you select **Yes** and are using manual throughput dedicated for each container, make sure to open the **Add new parameter** list to select the **Lease Container Throughput** property. Enter the number of [request units (RUs)](../cosmos-db/request-units.md) that you want to provision for this container. |
   |||||

   The following image shows an example trigger:

   :::image type="content" source="./media/connectors-create-api-cosmos-db/standard-trigger-parameters.png" alt-text="Screenshot showing the designer for a Standard logic app workflow with an Azure Cosmos DB trigger and parameters configuration.":::

   > [!Note]
   > The trigger will create multiple workflow executions for each item created or modified in Azure Cosmos DB, 
   > so the dynamic content output of this trigger is always a single item.

1. Add any other actions that you want to your workflow.

1. On the designer toolbar, select **Save**.

---

## Add Azure Cosmos DB action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action. The Azure Cosmos DB connector offers actions for both the **Logic App (Consumption)** and **Logic App (Standard)** resource types. The following examples for each resource type show how to use an action that creates or updates a document.

### [Consumption](#tab/consumption)

To add an Azure Cosmos DB action to a logic app workflow in multi-tenant Azure Logic Apps, use the following steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**When an HTTP request is received** trigger](connectors-native-reqres.md#add-request-trigger).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **New step** or **Add an action**, if between steps.

1. In the designer search box, enter `Azure Cosmos DB`. Select the Azure Cosmos DB action that you want to use.

   This example uses the action named **Create or update document (V3)**.

   :::image type="content" source="./media/connectors-create-api-cosmos-db/consumption-action-add.png" alt-text="Screenshot showing the designer for a Consumption logic app workflow with the available Azure Cosmos DB actions.":::

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account now](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Azure Cosmos DB account name** | Yes | Either select **Use connection settings (<*Azure-Cosmos-DB-account-name*>)**, or manually enter the name. | The account name for your Azure Cosmos DB account. |
   | **Database ID** | Yes | <*database-ID*> | The database that you want to connect. |
   | **Container ID** | Yes | <*container-ID*> | The container that you want to query. |
   | **Document** | Yes | <*JSON-document*> | The JSON document that you want to create. This example uses the request body from the trigger output. <p><p>**Tip**: If the HTTP trigger's **Body** token doesn't appear in the dynamic content list for you to add, next to the trigger name, select **See more**. <p><p>**Note**: Make sure that the body is well-formed JSON, and at a minimum, contains the `id` property and the partition key property for your document. If a document with the specified `id` and partition key already exist, the document is updated. Otherwise, a new document is created. |
   |||||

   The following image shows an example action:

   :::image type="content" source="./media/connectors-create-api-cosmos-db/consumption-create-action.png" alt-text="Screenshot showing the designer for a Consumption logic app workflow with the Azure Cosmos DB 'Create or update documents (V3)' action and parameters configuration.":::

1. Configure any other action settings as needed.

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your workflow creates a document in the specified container.

### [Standard](#tab/standard)

To add an Azure Cosmos DB action to a logic app workflow in single-tenant Azure Logic Apps, use the following steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**When an HTTP request is received** trigger](connectors-native-reqres.md#add-request-trigger), which uses a basic schema definition to represent the item that you want to create.

   :::image type="content" source="./media/connectors-create-api-cosmos-db/standard-http-trigger.png" alt-text="Screenshot showing the Azure portal and designer for a Standard logic app workflow with the 'When a HTTP request is received' trigger and parameters configuration.":::

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **Insert a new step** (**+**) > **Add an action**.

1. On the designer, make sure that **Add an operation** is selected. In the **Add an action** pane that opens, under the **Choose an operation** search box, select **Built-in** to find the **Azure Cosmos DB** actions.

   > [!NOTE]
   > If you have a stateful workflow, *managed connector* actions are also available on the 
   > **Azure** tab, but use them only when the *built-in* actions that you want aren't available.

1. In the search box, enter `Azure Cosmos DB`. Select the Azure Cosmos DB action that you want to use.

   This example uses the action named **Create or update item (preview)**, which creates a new item or updates an existing item.

   :::image type="content" source="./media/connectors-create-api-cosmos-db/standard-action-add.png" alt-text="Screenshot showing the designer for a Standard logic app workflow and available Azure Cosmos DB actions.":::

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account now](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Database Id** | Yes | <*database-ID*> | The database that you want to connect. |
   | **Container Id** | Yes | <*container-ID*> | The container that you want to query. |
   | **Item** | Yes | <*JSON-document*> | The JSON document that you want to create. This example uses the request body from the trigger output. <p><p>**Tip**: If the HTTP trigger's **Body** token doesn't appear in the dynamic content list for you to add, next to the trigger name, select **See more**. <p><p>**Note**: Make sure that the body is well-formed JSON, and at a minimum, contains the `id` property and the partition key property for your document. If a document with the specified `id` and partition key already exist, the document is updated. Otherwise, a new document is created. | 
   | **Partition key** | No | <*partition-key*> | The partition key value for the document that you want to create. |
   |||||

   The following image shows an example action:

   :::image type="content" source="./media/connectors-create-api-cosmos-db/standard-create-action.png" alt-text="Screenshot showing the designer for a Standard logic app workflow with the Azure Cosmos DB 'Create or update item' action and parameters configuration.":::

1. Configure any other action settings as needed.

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your workflow creates a document in the specified container.

---

## Connect to Azure Cosmos DB

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

Before you can configure your [Azure Cosmos DB trigger](#add-azure-cosmos-db-trigger) or [Azure Cosmos DB action](#add-azure-cosmos-db-action), you need to connect to a database account.

### [Consumption](#tab/consumption)

In a **Logic App (Consumption)** workflow, an Azure Cosmos DB connection requires the following property values:

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection name** | Yes | <*connection-name*> | The name to use for your connection. |
| **Authentication Type** | Yes | <*connection-type*> | The authentication type that you want to use. This example uses **Access key**. <p><p>- If you select **Access Key**, provide the remaining required property values to create the connection. <p><p>- If you select **Microsoft Entra integrated**, no other property values are required, but you have to configure your connection by following the steps for [Microsoft Entra authentication and Azure Cosmos DB connector](/connectors/documentdb/#azure-ad-authentication-and-cosmos-db-connector).  |
| **Access key to your Azure Cosmos DB account** | Yes | <*access-key*> | The access key for the Azure Cosmos DB account to use for this connection. This value is either a read-write key or a read-only key. <p><p>**Note**: To find the key, go to the Azure Cosmos DB account page. In the navigation menu, under **Settings**, select **Keys**. Copy one of the available key values. |
| **Account Id** | Yes | <*acccount-ID*> | The name for the Azure Cosmos DB account to use for this connection. |
|||||

The following image shows an example connection:

:::image type="content" source="./media/connectors-create-api-cosmos-db/consumption-connection-configure.png" alt-text="Screenshot showing an example Azure Cosmos DB connection configuration for a Consumption logic app workflow.":::

> [!NOTE]
> After you create your connection, if you have a different existing Azure Cosmos DB connection that 
> you want to use instead, or if you want to create another new connection, select **Change connection** 
> in the trigger or action details editor.

### [Standard](#tab/standard)

In a **Logic App (Standard)** workflow, an Azure Cosmos DB connection requires the following property values:

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection Name** | Yes | <*connection-name*> | The name to use for your connection. |
| **Connection String** | Yes | <*connection-string*> | The Azure Cosmos DB connection string to use for your connection. <p><p>**Note**: To find the connection string, go to the Azure Cosmos DB account page. In the navigation menu, under **Settings**, select **Keys**. Copy one of the available connection string values. |
|||||

The following image shows an example connection:

:::image type="content" source="./media/connectors-create-api-cosmos-db/standard-connection-configure.png" alt-text="Screenshot showing an example Azure Cosmos DB connection configuration for a Standard logic app workflow.":::

> [!NOTE]
> After you create your connection, if you have a different existing Azure Cosmos DB connection that 
> you want to use instead, or if you want to create another new connection, select **Change connection** 
> in the trigger or action details editor.

---

## Connector reference

For reference information about the Azure Cosmos DB *managed connector* operations, such as triggers, actions, and limits, review the [connector's reference page](/connectors/documentdb/).

No corresponding reference page exists for Azure Cosmos DB *built-in* operations. Instead, review the following table for more information:

| Type | Name | Parameters |
|------|------|------------|
| Trigger | When an item is created or modified | - **Database Id**: Required. The name of the database with the monitored and lease containers. <br>- **Monitored Container Id**: Required. The name of the container being monitored. <br>- **Lease Container Id**: Required. The name of the container used to store leases. <br>- **Create Lease Container**: Required. If true, create the lease container if not already existing. <br>- **Lease Container Throughput**: Optional. The number of Request Units to assign when the lease container is created. |
| Action | Create or update item | - **Database Id**: Required. The name of the database. <br>- **Container Id**: Required. The name of the container. <br>- **Item**: Required. The item to create or update. <br>- **Partition Key**: Optional. The partition key value for the requested item. <br>- **Is Upsert**: Optional. If true, replace the item, if existing. Otherwise, create the item. |
| Action | Create or update many items in bulk | This action is optimized for high throughput scenarios and has extra processing before the action submits your items to be created in the Azure Cosmos DB container. For large numbers of items, this extra processing speeds up the total request time. For small numbers of items, this extra overhead can cause slower performance than using multiple single create item actions. <p><p>- **Database Id**: Required. The name of the database. <br>- **Container Id**: Required. The name of the container. <br>- **Items**: Required. An array of items to create or update. <br>- **Is Upsert**: Optional. If true, replace an item if existing. Otherwise, create the item. |
| Action | Read an item | - **Database Id**: Required. The name of the database. <br>- **Container Id**: Required. The name of the container. <br>- **Item Id**: Required. The `id` value for the requested item. <br>- **Partition Key**: Required. The partition key value for the requested item. |
| Action | Delete an item | - **Database Id**: Required. The name of the database. <br>- **Container Id** Required. The name of the container. <br>- **Item Id**: Required. The `id` value for the requested item. <br>- **Partition Key**: Required. The partition key value for the requested item. |
| Action | Query items | - **Database Id**: Required. The name of the database. <br>- **Container Id**: Required. The name of the container. <br>- **Sql Query**: Required. The Azure Cosmos DB SQL query text.  <br>- **Partition Key**: Optional. The partition key value for the request, if any. <br>- **Continuation Token**: Optional. The continuation token for this query given by the Azure Cosmos DB service, if any. <br>- **Max Item Count**: Optional. The maximum number of items for the query to return. |
||||

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
