---
title: Connect to IBM DB2 Resources from Workflows
description: Learn how to access and manage IBM DB2 resources from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: haroldcampos, azla
ms.topic: how-to
ms.date: 01/26/2026
ms.custom: sfi-image-nochange
#Customer intent: As a developer who works with Azure Logic Apps, I want to access and manage IBM DB2 resources for my cloud or on-premises databases.
---

# Access and manage IBM DB2 resources from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

When your automated integration workflow needs to work with resources in your DB2 database, use the [**DB2** connector](/connectors/db2/). For example, your workflow can read, list rows, add rows, change rows, delete rows, and so on. Your workflow can include actions that return data from your database and make that output available for other actions to use in your workflow.

The DB2 connector includes a Microsoft client that communicates with remote DB2 servers across a TCP/IP network. So, you can use this connector to access cloud databases such as IBM DB2 for Windows running in Azure virtualization.

This guide shows how to connect your workflow to your DB2 database and perform various operations on that database.

## Supported platforms and versions

The DB2 connector supports the following IBM DB2 platforms and versions along with IBM DB2 compatible products that support Distributed Relational Database Architecture (DRDA) SQL Access Manager (SQLAM) versions 10 and 11:

| Platform | Version | 
|----------|---------|
| IBM DB2 for z/OS | 12, 11.1, 10.1 |
| IBM DB2 for i | 7.3, 7.2, 7.1 |
| IBM DB2 for LUW | 11, 10.5 |

## Connector technical reference

The DB2 connector supports the following database operations, which map to the corresponding actions in the connector:

| Database operation | Connector action |
|--------------------|------------------|
| List database tables | Get tables |
| Read one row using SELECT | Get row |
| Read all rows using SELECT | Get rows |
| Add one row using INSERT | Insert row |
| Edit one row using UPDATE | Update row |
| Remove one row using DELETE | Delete row |

For more information about the connector and these actions, see [DB2 connector](/connectors/db2/).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An IBM DB2 database, either cloud-based or on-premises.

- The logic app resource and workflow from where you want to access your DB2 database.

  The DB2 connector provides only actions. If you have an empty workflow, you must first [add a trigger](../logic-apps/add-trigger-action-workflow.md) that works best for your business scenario, to start the workflow.
  
  The examples in this guide use the [**Recurrence** trigger](connectors-native-recurrence.md).

  For more information, see:

  - [Create a Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)
  - [Create a Standard logic app workflow](../logic-apps/create-single-tenant-workflows-azure-portal.md)

- To access on-premises DB2 databases, you need to [install and set up the on-premises data gateway](../logic-apps/logic-apps-gateway-connection.md).

<a name="add-action"></a>

## Add a DB2 action

The following steps show how to add a DB2 action, for example, **Get tables**, to your workflow.

> [!NOTE]
>
> The steps to add any other DB2 action are similar, except for the action's parameters and values that you provide.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and workflow in the designer.

1. Follow the [general steps](../logic-apps/add-trigger-action-workflow.md#add-action) to add the **DB2** action named **Get tables**.

   The connection information pane opens so you can provide details to connect your DB2 database.

1. Follow the steps to create a connection for a [cloud-based database](#cloud-connection) or [on-premises database](#on-premises-connection), then return here to continue.

1. After you successfully create the connection, the **Get tables** action information pane appears and shows that no other information is necessary:

   :::image type="content" source="./media/connectors-create-api-db2/get-tables-action.png" alt-text="Screenshot shows the designer, workflow, and Get tables action.":::

1. Continue to [Test your workflow and view output tables](#view-output-tables).

## Set up your DB2 connection

Follow the steps based on whether you have a cloud or on-premises DB2 database. After you provide the necessary connection details, select **Create new**, and return to the previous steps.

Before you create a connection to an on-premises database, make sure that you [install and set up the on-premises data gateway](../logic-apps/logic-apps-gateway-connection.md).

<a name="cloud-connection"></a>

### [Cloud](#tab/cloud)

| Property | Required | Description |
|----------|----------|-------------|
| **Connect via on-premises gateway** | No | Applies only to on-premises connections. |
| **Connection Name** | Yes | The name for your connection, for example, *DB2-connection*. |
| **Server** | Yes | The address or alias and port number for your DB2 server, for example, *myDB2server.cloudapp.net:50000*. <br><br>**Note**: This value is a string that represents a TCP/IP address or alias, either in IPv4 or IPv6 format, followed by a colon and a TCP/IP port number. |
| **Database** | Yes | The name for your database. <br><br>**Note**: This value is a string that represents a DRDA Relational Database Name (RDBNAM): <br><br>- DB2 for z/OS accepts a 16-byte string where the database is known as an *IBM DB2 for z/OS* location. <br><br>- DB2 for i accepts an 18-byte string where the database is known as an *IBM DB2 for i* relational database. <br><br>- DB2 for LUW accepts an 8-byte string. |
| **Username** | Yes | Your user name for the database. <br><br>**Note**: This value is a string whose length is based on the specific database: <br><br>- DB2 for z/OS accepts an 8-byte string. <br><br>- DB2 for i accepts a 10-byte string. <br><br>- DB2 for Linux or UNIX accepts an 8-byte string. <br><br>- DB2 for Windows accepts a 30-byte string. |
| **Password** | Yes | Your password for the database. |

For example:

:::image type="content" source="./media/connectors-create-api-db2/create-db2-cloud-connection.png" alt-text="Screenshot shows the connection pane for cloud-based databases.":::

<a name="on-premises-connection"></a>

### [On-premises](#tab/on-premises)

| Property | Required | Description |
|----------|----------|-------------|
| **Connect via on-premises gateway** | Yes | Applies only to on-premises connections and shows the on-premises connection properties. |
| **Connection Name** | Yes | The name for your connection, for example, *DB2-connection*. | 
| **Server** | Yes | The address or alias and port number for your DB2 server, for example, *myDB2server:50000*. <br><br>**Note**: This value is a string that represents a TCP/IP address or alias, either in IPv4 or IPv6 format, followed by a colon and a TCP/IP port number. |
| **Database** | Yes | The name for your database. <br><br>**Note**: This value is a string that represents a DRDA Relational Database Name (RDBNAM): <br><br>- DB2 for z/OS accepts a 16-byte string where the database is known as an *IBM DB2 for z/OS* location. <br><br>- DB2 for i accepts an 18-byte string where the database is known as an *IBM DB2 for i* relational database. <br><br>- DB2 for LUW accepts an 8-byte string. |
| **Authentication** | Yes | The authentication type for your connection, for example, **Windows**. <br><br>**Note**: Select this value from the list, which includes **Basic** or **Windows (Kerberos)**. |
| **Username** | Yes | Your user name for the database. <br><br>**Note**: This value is a string whose length is based on the specific database: <br><br>- DB2 for z/OS accepts an 8-byte string. <br><br>- DB2 for i accepts a 10-byte string. <br><br>- DB2 for Linux or UNIX accepts an 8-byte string. <br><br>- DB2 for Windows accepts a 30-byte string. |
| **Password** | Yes | Your password for the database. |
| **Gateway** | Yes | - **Subscription**: The Azure subscription for the gateway resource. <br><br>- **Gateway**: The name for your gateway resource. <br><br>**Note**: The gateway list shows only the gateway resources available in your Azure subscription and resource group. |

For example:

:::image type="content" source="./media/connectors-create-api-db2/create-db2-on-premises-connection.png" alt-text="Screenshot shows the connection pane for on-premises databases.":::

---

<a name="view-output-tables"></a>

### Test your workflow and view output tables

To manually run your workflow, on the designer toolbar, from the **Run** list, select **Run**. After your workflow completes, you can view the output from the run.

1. If the run details page doesn't open, follow these steps based on your logic app:

   - **Consumption**: On the logic app sidebar, under **Development Tools**, select **Logic app designer**.

   - **Standard**: On the workflow sidebar, select **Run history**.

1. In the **Runs history** list, select the latest workflow run, for example:

   - **Consumption**

     :::image type="content" source="./media/connectors-create-api-db2/run-history-consumption.png" alt-text="Screenshot shows Run history list for Consumption workflow.":::

   - **Standard**

     :::image type="content" source="./media/connectors-create-api-db2/run-history-standard.png" alt-text="Screenshot shows Run history list for Standard workflow.":::

1. On the run details page, review the status for each step in your workflow. To view the inputs and outputs for each step, select that step, for example:

   :::image type="content" source="./media/connectors-create-api-db2/get-tables-run-history.png" alt-text="Screenshot shows the inputs and outputs for the Get tables action.":::

   1. To view the inputs in JSON, select **Show raw inputs**.

   1. To view the outputs in JSON, select **Show raw outputs**.

      The outputs include a list of tables, for example:

      :::image type="content" source="./media/connectors-create-api-db2/get-tables-outputs.png" alt-text="Screenshot shows the output from the Get tables action.":::

## Related content

- [Managed connectors for Azure Logic Apps](managed.md)
- [Built-in connectors for Azure Logic Apps](built-in.md)
- [What are connectors in Azure Logic Apps](introduction.md)
