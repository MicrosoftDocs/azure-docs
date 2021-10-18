---
title: Connect to Azure Cosmos DB 
description: Process and create Azure Cosmos DB documents using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/18/2021
tags: connectors
---

# Process and create Azure Cosmos DB documents using Azure Logic Apps

Using Azure Logic Apps with the Azure Cosmos DB connector allows you to connect to Azure Cosmos DB and work with documents from an automated workflow. The connector has a trigger for responding to changes in an Azure Cosmos DB container as well as several actions for creating, reading, querying and deleting documents. You can combine these with other actions and triggers in your logic apps workflows to enable many scenarios such as event sourcing and general data processing.

You can connect to Azure Cosmos DB from both **Logic App (Consumption)** and **Logic App (Standard)** resource types using the managed connector operations. With **Logic App (Standard)**, Azure Cosmos DB also provides built-in connector operations, currently in preview, which offer different functionality, better performance, and higher throughput.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure Cosmos DB account.](../cosmos-db/sql/create-cosmosdb-resources-portal.md)

- A logic app workflow from which you want to access your Azure Cosmos DB account. If you want to use the Azure Cosmos DB trigger, you need to create your logic app with the standard resource type and create a [blank logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

## Add Azure Cosmos DB trigger

In Azure Logic Apps, every workflow must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met.

This connector offers one trigger called **When an item is created or modified (preview)** which is based off of the [Azure Cosmos DB change feed](../cosmos-db/sql/change-feed-design-patterns.md). It is only available in workflows with the Logic Apps Standard resource type. The trigger is not available for workflows with the Logic Apps Consumption resource type.

###[Consumption](#tab/consumption)

There is no Azure Cosmos DB trigger available for the Logic Apps Consumption resource type.

###[Standard](#tab/standard)

To add an Azure Cosmos DB trigger to a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. In the designer search box, enter `Azure Cosmos DB` as your filter. From the triggers list, select the trigger named **When an item is created or modified (preview)**.

:::image type="content" source="./media/connectors-create-api-cosmosdb/standard-trigger-add.png" alt-text="Screenshot showing Azure portal and workflow designer with a Standard logic app and the trigger named 'When an item is created or modified (preview)' selected.":::

1. If you're prompted for connection details, [create your Azure Cosmos DB connection now](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the trigger on the **Parameters** tab. 
    1. For **Database Id** enter the name of the database with the container you want to monitor, and optionally the lease container. If you don't already have a lease container the connector will create one for you in a step below.

    1. For **Monitored Container Id** enter the name of the container you want to monitor. This container should already exist in the database provided.

    1. For **Lease Container Id** enter the name of the lease container. This can either be an existing container, or the name of a container you would like the connector to create for you. The value 'leases' is common and is pre-filled for you.

    1. For **Create Lease Container** enter 'No' if the lease container already exists in the database provided. Enter 'Yes' if you would like the connector to create this container for you.

    1. If you entered 'Yes' to **Create Lease Container**, select 'Add new parameter', then select 'Lease Container Throughput'. Enter the number of [RUs](../cosmos-db/request-units.md) you would like to provision for this container.

    :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-trigger-parameters.png" alt-text="Screenshot showing the workflow designer for a Standard logic app workflow with an Azure Cosmos DB trigger and parameters configuration.":::

1. Continue creating your workflow by adding one or more actions.

1. On the designer toolbar, select **Save** to save your changes.

---

## Add Azure Cosmos DB action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action.

### [Consumption](#tab/consumption)

To add an Azure Cosmos DB action to a logic app workflow in multi-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**When a HTTP request is received** trigger](connectors-native-reqres.md#).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **New step** or **Add an action**, if between steps.

1. In the designer search box, enter `Azure Cosmos DB`. Select the Azure Cosmos DB action that you want to use.

   This example uses the action named **Create or update document (V3)**.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/consumption-action-add.png" alt-text="Screenshot of Consumption logic app in designer, showing list of available Azure Cosmos DB actions.":::

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

    1. For **Azure Cosmos DB account name** select the account from your connection settings. Or, enter the value manually.

    1. For **Database ID** enter the database you want to connect to.

    1. For **Container ID** enter the container you want to query.

    1. For **Document** enter the JSON document you want to create. For this example, we are using the request body from the output of the trigger. Ensure the body is well-formed JSON and that it contains a minimum of the 'id' property as well as the partition key property for your container. If a document with the specified 'id' and partition key already exists, it will be updated, otherwise a new document will be created.

       :::image type="content" source="./media/connectors-create-api-cosmosdb/consumption-create-action.png" alt-text="Screenshot of Consumption logic app in designer, showing configuration of the Azure Cosmos DB 'Create or update documents (V3)' action.":::

    1. Configure other action settings as needed.

1. Test your logic app to make sure your workflow creates a document in the specified container.

### [Standard](#tab/standard)

To add an Azure Cosmos DB action to a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**When a HTTP request is received** trigger](connectors-native-reqres.md#) with a simple schema defined that represents the document you want to create.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-http-trigger.png" alt-text="Screenshot showing the Azure portal and workflow designer with the configuration of an http trigger for a Standard logic app workflow.":::

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **Insert a new step** (**+**) > **Add an action**.

1. On the designer, make sure that **Add an operation** is selected. In the **Add an action** pane that opens, under the **Choose an operation** search box, select **Built-in** to find the **Azure Cosmos DB** actions. There are also *managed* actions available in the **Azure** tab, but these should only be used if the action you are looking for is not offered as *built-in*.

1. In the search box, enter `Azure Cosmos DB`. Select the Azure Cosmos DB action that you want to use.

   This example uses the action named **Create or update item (preview)**, which creates a new item or updates an existing item if it already exists.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-action-add.png" alt-text="Screenshot showing the Azure portal and workflow designer with a Standard logic app workflow and the available Azure Cosmos DB actions.":::

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

    1. For **Database Id** enter the database you want to connect to.

    1. For **Container Id** enter the container you want to query.

    1. For **Item** enter the JSON document you want to create. For this example, we are using the request body from the output of the trigger. Ensure the body is well-formed JSON and that it contains a minimum of the `id` property as well as the partition key property for your container. If a document with the specified `id` and partition key already exists, it will be updated, otherwise a new document will be created.

    > Tip: If the HTTP trigger body doesn't show up as dynamic content to add, select "see more" and it should appear in the list.

    1. For **Partition key** enter the partition key value for the document you want to create.

    > Important: This doesn't show as a required property on the UI, but is actually a required property for the workflow to succeed. To find this property, select **Add new parameter** and select **Partition key** from the drop down.

     :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-create-action.png" alt-text="Screenshot of Standard logic app in designer, showing configuration of the Azure Cosmos DB "Create or update item" action.":::

    1. Configure other action settings as needed

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your workflow creates a document in the specified container.

---

## Connect to Azure Cosmos DB

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

### [Consumption](#tab/consumption)

Before you can configure your [Azure Cosmos DB trigger](#add-azure-cosmos-db-trigger) or [Azure Cosmos DB action](#add-azure-cosmos-db-action), you need to connect to a database account. A connection requires the following properties:

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection name** | Yes | <*connection name*> | The name to use for your connection. |
| **Authentication type** | Yes | <*type of connection*> | If you select "Access Key" continue filling out the remaining required items to create a connection. If you select "Azure AD Integrated" there are no additional fields, but you will have to configure your connection using [these steps](/connectors/documentdb/#azure-ad-authentication-and-cosmos-db-connector).  |
| **Access key** | Yes | <*access key*> | Enter the access key of the Azure Cosmos DB account you would like to use for this connection, either a read-write key or a read-only key. <p>**Note**: To find the key, go to the Azure Cosmos DB account's page. In the navigation menu, under **Settings**, select **Keys**. Copy one of the available values. |
| **Account Id** | Yes | <*acccount id*> | Enter the name of the Azure Cosmos DB account you would like to use for this connection. |

To create an Azure Cosmos DB connection from a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. For **Connection name**, enter a name for your connection.

1. For **Authentication type**, select the authentication type that you want to use. This example uses "Access Key".

1. For **Access key**, enter the Azure Cosmos DB key you would like to use.

1. For **Account Id**, enter the name of the Azure Cosmos DB account you would like to use.

1. Select **Create** to establish your connection.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/consumption-connection-configure.png" alt-text="Screenshot that shows the workflow designer with a Consumption logic app workflow and configuration to add a new connection for the Azure Cosmos DB step.":::

> [!NOTE]
> After you create your connection, if you have a different existing Azure Cosmos DB connection 
> that you want to use instead or if you want to create another new connection, select **Change connection** in the trigger or action details editor.

### [Standard](#tab/standard)

Before you can configure your [Azure Cosmos DB trigger](#add-azure-cosmos-db-trigger) or [Azure Cosmos DB action](#add-azure-cosmos-db-action), you need to connect to a database account. A connection requires the following properties:

| Property | Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection name** | Yes | <*connection name*> | The name to use for your connection. |
| **Connection String** | Yes | <*connection string*> | Enter the Azure Cosmos DB connection string you want to use for your connection. <p>**Note**: To find the connection string, go to the Azure Cosmos DB account's page. In the navigation menu, under **Settings**, select **Keys**. Copy one of the available connection string values. |

To create an Azure Cosmos DB connection from a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. For **Connection name**, enter a name for your connection.

1. For **Connection String**, enter the connection string for the Azure Cosmos DB account that you want to use.

1. Select **Create** to establish your connection.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-connection-configure.png" alt-text="Screenshot that shows the workflow designer with a Standard logic app workflow and a prompt to add a new connection for the Azure Cosmos DB step.":::

> [!NOTE]
> After you create your connection, if you have a different existing Azure Cosmos DB connection 
> that you want to use instead or if you want to create another new connection, select **Change connection** in the trigger or action details editor.

---

## Connector reference

For reference information about the *managed* operations for this connector, such as triggers, actions, and limits, review the [connector's reference page](/connectors/documentdb/).

There is no corresponding reference page for the *built-in* operations, refer to the table below for a list.

|Type |Name |Parameters |
|-----|-----|-----------|
|Trigger |When an item is created or modified |*Database Id* Required. The name of the database with the monitored and lease containers. <br> *Monitored Container Id* Required. The name of the container being monitored. <br> *Lease Container Id* Required. The name of the container used to store leases. <br> Required. *Create Lease Container* If true, the lease container is created when it doesn’t already exist. <br> *Lease Container Throughput* Optional. The number of Request Units to assign when the lease container is created. |
|Action |Create or update item |*Database Id* Required. The name of the database. <br> *Container Id* Required. The name of the container. <br> *Item* Required. The item to be created or updated. <br> *Partition key* Required. The partition key value for the requested item. <br> *Is Upsert* Optional. If true, the item will be replaced if exists, else it will be created. |
|Action |Create or update many items in bulk |*Database Id* Required. The name of the database. <br> *Container Id* Required. The name of the container. <br> *Item* Required. The item to be created or updated. <br> *Is Upsert* Optional. If true, an item will be replaced if exists, else it will be created. |
|Action |Read an item |*Database Id* Required. The name of the database. <br> *Container Id* Required. The name of the container. <br> *Item id* Required. The `id` value for the requested item.  <br> *Partition key* Required. The partition key value for the requested item. |
|Action |Delete an item |*Database Id* Required. The name of the database. <br> *Container Id* Required. The name of the container. <br> *Item id* Required. The `id` value for the requested item.  <br> *Partition key* Required. The partition key value for the requested item. |

> Note: The `Create or update many items in bulk` action should only be used in high throughput scenarios because it requires extra processing before submitting your items to be created in the container. For large amounts of items this extra processing speeds up the total request time, but for small amounts of items this extra overhead can cause slower performance than the single create action.

## Best practices for Azure Cosmos DB built-in operations

### Get iterable results from the Query items action by using expressions

The output type of the Query items action for the built-in operation on Logic Apps (Standard) is a non-iterable object. To get the query results as an iterable object for processing use the following steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **Insert a new step** (**+**) > **Add an action**.

1. On the designer, make sure that **Add an operation** is selected. In the **Add an action** pane that opens, under the **Choose an operation** search box, select **Built-in** to find the **Azure Cosmos DB** actions.

1. In the search box, enter `Azure Cosmos DB`. Select the **Query items (preview)** action.

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

    1. For **Database Id** enter the database you want to connect to.

    1. For **Container Id** enter the container you want to query.

    1. For **SQL Query** enter the SQL query for your request.

       :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-query-action.png" alt-text="Screenshot of Standard logic app in designer, showing configuration of the Azure Cosmos DB Query items action.":::

    1. Configure other action settings as needed.

1. Under the action, select **Insert a new step** (**+**) > **Add an action**, then search for and add the **For each** action.

1. For **Select an output from previous step** toggle to the **Expression** tab and search for **Referencing functions** > **outputs(actionName)**.

1. Enter `'Query_items'` as a parameter to the **outputs** function followed by `?['body']?['item']?['results']` to access the array of query results. Together, this should look like `outputs('Query_items')?['body']?['item']?['results']`.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-query-configure.png" alt-text="Screenshot showing the Azure portal and workflow designer with a Standard logic app workflow and a for each action to process Azure Cosmos DB query results.":::

1. Add an action of your choice inside the for each loop and build the rest of your workflow.

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your workflow returns the output you expect.

## Check the operation status code to verify action success

The Azure Cosmos DB built-in operations for Logic Apps (Standard) allow you to read and respond to the various status codes that could be returned. This means for every action you should have a step that checks the status code returned from the body and reacts according to your needs. The status code returned by the action is different from the status code of the operation itself. An example workflow with the **Read an item** action and status code check of the read operation is as follows:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**When a HTTP request is received** trigger](connectors-native-reqres.md#) with a simple schema defined that represents the document you want to read.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-http-trigger.png" alt-text="Screenshot showing the Azure portal and workflow designer with the configuration of an http trigger for a Standard logic app workflow.":::

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **Insert a new step** (**+**) > **Add an action**.

1. On the designer, make sure that **Add an operation** is selected. In the **Add an action** pane that opens, under the **Choose an operation** search box, select **Built-in** to find the **Azure Cosmos DB** actions.

1. In the search box, enter `Azure Cosmos DB`. Select the **Query items (preview)** action.

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

    1. For **Database Id** enter the database you want to connect to.

    1. For **Container Id** enter the container you want to query.

    1. For **Item Id** enter the `id` value of the document you want to read.

    1. For **Partition key** enter the partition key value of the document you want to read.

       :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-read-configure.png" alt-text="Screenshot of Standard logic app in designer, showing configuration of the Azure Cosmos DB Read an item action.":::

    1. Configure other action settings as needed.

1. Under the action, select **Insert a new step** (**+**) > **Add an action**, then search for and add the **Condition** action.

1. For the first **Choose a value** box, toggle to the **Expression** tab and search for **Referencing functions** > **outputs(actionName)**.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-condition-configure.png" alt-text="Screenshot showing the Azure portal and workflow designer with a Standard logic app workflow and a condition configuration.":::

1. Enter `'Read_an_item'` as a parameter to the **outputs** function followed by `?['body']?['statusCode']` to the status code from the read operation. Together, this should look like `outputs('Read_an_item')?['body']?['statusCode']`.

> Note: The `Status code` available in the **Dynamic Content** tab represents the status of the action. In this case, we are interested in the status of the operation itself, which is nested in the body of the response object.

1. For the middle condition drop down and the second **Chose a value** box, enter values that are appropriate for your workflow. In this example, we will check for equality to `OK`.

> Note: Status codes are represented in their text form, not as numbers.

1. Add actions of your choice inside the true and false paths and build the rest of your workflow.

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your workflow returns the output you expect.

## Next steps

[Connectors overview for Azure Logic Apps](apis-list.md)
