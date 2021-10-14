---
title: Connect to Azure Cosmos DB 
description: Process and create Azure Cosmos DB documents using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/14/2021
tags: connectors
---

# Process and create Azure Cosmos DB documents using Azure Logic Apps

Using Azure Logic Apps with the Azure Cosmos DB connector allows you to connect to Azure Cosmos DB and work with documents from an automated workflow. The connector has a trigger for responding to changes in an Azure Cosmos DB container as well as several actions for creating, reading, querying and deleting documents. You can combine these with other actions and triggers in your logic apps workflows to enable many scenarios such as event sourcing and general data processing.

You can connect to Azure Cosmos DB from both **Logic App (Consumption)** and **Logic App (Standard)** resource types using the managed connector operations. With **Logic App (Standard)**, Azure Cosmos DB also provides built-in connector operations, currently in preview, which offer different functionality, better performance, and higher throughput.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure Cosmos DB account.](../cosmos-db/sql/create-cosmosdb-resources-portal.md)

- A logic app workflow from which you want to access your Azure Cosmos DB account. If you want to use the Azure Cosmos DB trigger, you need to create your logic app with the standard resource type and create a [blank logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits, review the [connector's reference page](/connectors/documentdb/).

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

## Add Azure Cosmos DB action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is a step in your workflow that follows a trigger or another action.

### [Consumption](#tab/consumption)

To add an Azure Cosmos DB action to a logic app workflow in multi-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **New step** or **Add an action**, if between steps.

1. In the designer search box, enter `Azure Cosmos DB`. Select the Azure Cosmos DB action that you want to use.

   This example uses the action named **Query documents V5**.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/consumption-action-add.png" alt-text="Screenshot of Consumption logic app in designer, showing list of available Azure Cosmos DB actions.":::

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

    1. For **Azure Cosmos DB account name** select the account from your connection settings. Or, enter the value manually.

    1. For **Database ID** enter the database you want to connect to.

    1. For **Container ID** enter the container you want to query.

    1. For **SQL Syntax Query** enter the SQL query for your request.

       :::image type="content" source="./media/connectors-create-api-cosmosdb/consumption-query-action.png" alt-text="Screenshot of Consumption logic app in designer, showing configuration of the Azure Cosmos DB Query documents V5 action.":::

    1. Configure other action settings as needed.

### [Standard](#tab/standard)

To add an Azure Cosmos DB action to a logic app workflow in single-tenant Azure Logic Apps, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your workflow in the designer.

1. If your workflow is blank, add any trigger that you want.

   This example starts with the [**Recurrence** trigger](connectors-native-recurrence.md).

1. Under the trigger or action where you want to add the Azure Cosmos DB action, select **Insert a new step** (**+**) > **Add an action**.

1. On the designer, make sure that **Add an operation** is selected. In the **Add an action** pane that opens, under the **Choose an operation** search box, select **Built-in** to find the **Azure Cosmos DB** actions. There are also *managed* actions available in the **Azure** tab, but these should only be used if the action you are looking for is not offered as *built-in*.

1. In the search box, enter `Azure Cosmos DB`. Select the Azure Cosmos DB action that you want to use.

   This example uses the action named **Query items (preview)**, which queries for items in a container.

   :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-action-add.png" alt-text="Screenshot showing the Azure portal and workflow designer with a Standard logic app workflow and the available Azure Cosmos DB actions.":::

1. If you're prompted for connection details, [create a connection to your Azure Cosmos DB account](#connect-to-azure-cosmos-db).

1. Provide the necessary information for the action.

    1. For **Database Id** enter the database you want to connect to.

    1. For **Container Id** enter the container you want to query.

    1. For **SQL Query** enter the SQL query for your request.

       :::image type="content" source="./media/connectors-create-api-cosmosdb/standard-query-action.png" alt-text="Screenshot of Standard logic app in designer, showing configuration of the Azure Cosmos DB Query items action.":::

    1. Configure other action settings as needed.

1. On the designer toolbar, select **Save**.

1. Test your logic app to make sure your workflow returns the output you expect.

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

## Best practices for Azure Cosmos DB operations

### Error handling

## Next steps

[Connectors overview for Azure Logic Apps](apis-list.md)
