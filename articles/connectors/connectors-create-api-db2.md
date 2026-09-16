---
title: Connect to IBM DB2 Resources from Workflows
description: Learn how to access and manage IBM DB2 resources from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: haroldcampos, azla
ms.topic: how-to
ms.date: 09/13/2026
ms.custom: sfi-image-nochange
#Customer intent: As a developer who works with Azure Logic Apps, I want to access and manage IBM DB2 resources for my cloud or on-premises databases.
---

# Connect to IBM DB2 resources from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

When your automated integration workflow needs to work with resources in your DB2 database, use a DB2 connector to perform operations on your database. For example, your workflow can list tables or rows, add rows, update rows, delete rows, run queries, and execute stored procedures. These actions can return data from your database for other actions in your workflow to use.

Azure Logic Apps provides the following DB2 connector versions:

- **Managed connector**: Available for Consumption and Standard workflows. For an on-premises DB2 server, this connector requires the on-premises data gateway.
- **Built-in connector**: Available only for Standard workflows. This connector runs in-process with the Azure Logic Apps runtime and connects directly to DB2 over TCP/IP without the on-premises data gateway.

Both versions communicate with remote DB2 servers across a TCP/IP network. You can use either version to access cloud databases such as IBM DB2 for Windows running in Azure virtualization. 

> [!IMPORTANT]
>
> For mission-critical systems that use Standard workflows, use the built-in connector. The built-in connector avoids the extra gateway dependency and provides the performance and throughput benefits of running in-process with the Azure Logic Apps runtime. Use the managed connector when you need its specific operations or when you use a Consumption workflow.

This guide describes the operations and connection setup for both connector versions.

## Supported platforms and versions

The DB2 connector supports the following IBM DB2 platforms and versions along with IBM DB2 compatible products that support Distributed Relational Database Architecture (DRDA) SQL Access Manager (SQLAM) versions 10 and 11:

| Platform | Version | 
| --- | --- |
| IBM DB2 for z/OS | 12, 11.1, 10.1 |
| IBM DB2 for i | 7.4, 7.3, 7.2, 7.1
| IBM DB2 for LUW | 11.5, 11.1, 10.5 |

## Connector technical reference

The DB2 connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connection version |
| --- | --- | --- |
| **Consumption** | Multitenant Azure Logic Apps | Managed connector, which appears in the connector gallery under the **Shared** filter. This connector provides only actions, not triggers. For an on-premises DB2 server, the managed connector requires the on-premises data gateway. <br><br>For more information, see the following documentation: <br><br>- [DB2 managed connector reference](/connectors/db2/) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Standard** | Workflow Service Plan, App Service Environment v3 (ASE v3 with Windows plans only), and Hybrid deployment on Azure Arc-enabled Kubernetes | Managed connector, which appears in the connector gallery under the **Shared** filter, and built-in connector, which appears in the connector gallery under the **Built-in** filter and is [service provider-based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). Both versions provide only actions, not triggers. For mission-critical workloads, use the built-in connector, which runs in-process with the Azure Logic Apps runtime and connects directly to DB2 over TCP/IP without the on-premises data gateway. <br><br>For more information, see the following documentation: <br><br>- [DB2 managed connector reference](/connectors/db2/) <br>- [DB2 built-in connector reference](/azure/logic-apps/connectors/built-in/reference/db2/) <br>- [Built-in connectors in Azure Logic Apps](built-in.md) |

### Managed connector operations

The DB2 managed connector supports the following database operations, which map to the corresponding actions in the connector:

| Database operation | Connector action |
| --- | --- |
| List database tables | Get tables |
| Read one row using SELECT | Get row |
| Read all rows using SELECT | Get rows |
| Add one row using INSERT | Insert row |
| Edit one row using UPDATE | Update row |
| Remove one row using DELETE | Delete row |

For more information about the managed connector and these actions, see [DB2 managed connector reference](/connectors/db2/).

### Built-in connector operations

The DB2 built-in connector supports the following actions:

| Action | Description |
| --- | --- |
| **DB2 tables** | Return tables in a DB2 schema. |
| **Delete row** | Delete one or more rows. |
| **Execute a stored procedure** | Run a stored procedure and return the output. |
| **Execute non-query** | Run a SQL statement that doesn't return a result set. |
| **Execute query** | Run a SQL query and return the result set. |
| **Insert row** | Insert a row into a DB2 table. |
| **Update rows** | Update one or more rows in a DB2 table. |

For more information about the built-in connector and these actions, see [DB2 built-in connector reference](/azure/logic-apps/connectors/built-in/reference/db2/).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An IBM DB2 database, either cloud-based or on-premises.

- The logic app resource and workflow from where you want to access your DB2 database.

  The DB2 connector provides only actions. If you have an empty workflow, you must first [add a trigger](../logic-apps/add-trigger-action-workflow.md) that works best for your scenario.

  The examples in this guide use the [**Recurrence** trigger](connectors-native-recurrence.md).

  For more information, see:

  - [Create a Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)
  - [Create a Standard logic app workflow](../logic-apps/create-single-tenant-workflows-azure-portal.md)

- Connection requirements depend on the connector version:

   - **Managed connector**: To connect to an on-premises DB2 database, first [install and set up the on-premises data gateway](../logic-apps/logic-apps-gateway-connection.md). The gateway isn't required when the DB2 server is publicly available or accessible in Azure.

   - **Built-in connector**: The on-premises data gateway isn't required. The Standard logic app hosting environment needs network access to the DB2 server and port.

<a name="add-action"></a>

## Add a DB2 managed connector action

The following example uses the DB2 managed connector and shows how to add the **Get tables** action. To use the built-in connector with a Standard workflow, select **Built-in** in the connector gallery, and then select a [DB2 built-in action](#built-in-connector-operations), such as **DB2 tables**.

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

## Set up a connection for the DB2 managed connector

Follow the steps based on whether you have a cloud or on-premises DB2 database. After you provide the necessary connection details, select **Create new**, and return to the previous steps.

Before you create a managed connector connection to an on-premises database, make sure that you [install and set up the on-premises data gateway](../logic-apps/logic-apps-gateway-connection.md). This gateway requirement doesn't apply to the built-in connector.

<a name="cloud-connection"></a>

### [Cloud](#tab/cloud)

| Property | Required | Description |
| --- | --- | --- |
| **Connect via on-premises gateway** | No | Applies only to on-premises connections. |
| **Connection Name** | Yes | The name for your connection, for example, *DB2-connection*. |
| **Server** | Yes | The address or alias and port number for your DB2 server, for example, *myDB2server.example.com:50000*. <br><br>**Note**: This value is a string that represents a TCP/IP address or alias, either in IPv4 or IPv6 format, followed by a colon and a TCP/IP port number. |
| **Database** | Yes | The name for your database. <br><br>**Note**: This value is a string that represents a DRDA Relational Database Name (RDBNAM): <br><br>- DB2 for z/OS accepts a 16-byte string where the database is known as an *IBM DB2 for z/OS* location. <br><br>- DB2 for i accepts an 18-byte string where the database is known as an *IBM DB2 for i* relational database. <br><br>- DB2 for LUW accepts an 8-byte string. |
| **Username** | Yes | Your user name for the database. <br><br>**Note**: This value is a string whose length is based on the specific database: <br><br>- DB2 for z/OS accepts an 8-byte string. <br><br>- DB2 for i accepts a 10-byte string. <br><br>- DB2 for Linux or UNIX accepts an 8-byte string. <br><br>- DB2 for Windows accepts a 30-byte string. |
| **Password** | Yes | Your password for the database. |

For example:

:::image type="content" source="./media/connectors-create-api-db2/create-db2-cloud-connection.png" alt-text="Screenshot shows the connection pane for cloud-based databases.":::

<a name="on-premises-connection"></a>

### [On-premises](#tab/on-premises)

| Property | Required | Description |
| --- | --- | --- |
| **Connect via on-premises gateway** | Yes | Applies only to on-premises connections. This option also shows more properties for the on-premises connection. |
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

## Set up a connection for the DB2 built-in connector

For mission-critical Standard workflows, use the built-in connector. The built-in connector connects directly from the Azure Logic Apps runtime to your DB2 server over TCP/IP and doesn't use the on-premises data gateway. Ensure that the Standard logic app hosting environment has network access to the DB2 server and port.

In the workflow designer, select **Built-in**, select the DB2 action that you want, and create a connection. Provide the following information as applicable to your DB2 environment:

| Property | Description |
| --- | --- |
| **Connection Name** | The name for the connection. |
| **Server Name** | The DB2 server name. |
| **Port Number** | The database port number on the DB2 server. |
| **Database** | The database name on the DB2 server. |
| **User Name** | The user name for accessing the DB2 server. |
| **Password** | The password for the DB2 user name. |
| **Package Collection** | The package collection. Defaults to the user name if empty. |
| **Default Schema** | The default schema for schema calls, defaults to user name if empty. |
| **Host CCSID** | The host coded character set identifier (CCSID) for the DB2 database, defaults to 1208 if empty. |
| **PC Code Page** | The PC code page for the DB2 connection, defaults to 1208 if empty. |
| **Additional Connection String Keywords** | Optional connection string keywords, separated by semicolons. |
| **Connection String** | The DB2 connection string which if not empty then the rest of the properties are ignored. |

<a name="view-output-tables"></a>

## Test your workflow and view output tables

The following example shows output from the managed connector's **Get tables** action. You can test a workflow that uses a built-in connector action in the same way. To manually run your workflow, on the designer toolbar, from the **Run** list, select **Run**. After your workflow finishes, you can view the output from the run.

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
