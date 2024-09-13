---
title: Connect to Oracle Database
description: Insert and manage records in Oracle Database using a workflow in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 06/12/2024
---

# Connect to Oracle Database from Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

In Azure Logic Apps, you can insert or manage data in your Oracle Database from within your workflow. You can use the Oracle Database connector to access an on-premises Oracle Database or an Azure virtual machine with Oracle Database installed.

For example, you can perform the following tasks with the connector:

* Add a new customer to a customer database.
* Update an order in an order database.
* Get a row of data, insert a new row, or delete an existing row.

## Supported versions

* Oracle 9 and later
* Oracle Data Access Client (ODAC) 11.2 and later

## Prerequisites

* [Download and install the on-premises data gateway](/data-integration/gateway/service-gateway-install).

  This gateway acts as a bridge and provides a secure data transfer between on-premises data and your app or client. You can use the same gateway installation with multiple services and data sources, which means you might only need to install the gateway once.

* Install your Oracle client on the computer where you installed the on-premises data gateway. Otherwise, an error occurs when you try to create or use the connection.

* [Create an Azure gateway resource for your gateway installation](../logic-apps/logic-apps-gateway-connection.md).

* The logic app workflow where you want to connect to your Oracle database. This connector provides only actions, not triggers. You can use any trigger that you want to start your workflow. To create the logic app and add a trigger, see the following documentation:

  * [Create an example Consumption workflow in multitenant Azure Logic Apps](../logic-apps/quickstart-create-example-consumption-workflow.md).
  * [Create an example Standard workflow in single tenant Azure Logic apps](../logic-apps/create-single-tenant-workflows-azure-portal.md)
  * [Add a trigger to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md#add-trigger)

* For the **Get row** action used in this example, you need to know the identifier for the table to access.

  If you don't know this information, contact your Oracle Database administrator, or get the output from the following statement: **`select * from <table-name>`**.

## Known issues and limitations

This connector doesn't support the following items:

* Any table with composite keys
* Nested object types in tables
* Database functions with nonscalar values

For more information, see the [connector's reference documentation](/connectors/oracle/).

## Connector technical reference

For available connector operations, see the [connector's reference documentation](/connectors/oracle/).

## Add an action

1. [Follow these generic steps to add the **Oracle Database** action that you want](../logic-apps/create-workflow-with-trigger-or-action.md).

   This example continues with the [**Get row** action](/connectors/oracle/#get-row).

1. In the connection box, provide the required [connection information](/connectors/oracle/#default).

1. For the **Gateway** property, select the Azure subscription and Azure gateway resource to use.

1. After the connection is complete, from the **Table name** list, select a table.

1. For the **Row Id** property, enter the row ID that you want in your table.

   In the following example, job data is returned from a Human Resources database:

   :::image type="content" source="media/connectors-create-api-oracledatabase/table-rowid.png" alt-text="Screenshot shows Get row action with table name and row ID." lightbox="media/connectors-create-api-oracledatabase/table-rowid.png":::

1. Add any other actions to continue building your workflow.

1. When you're done, save your workflow.

## Common errors

#### **Error**: Cannot reach the Gateway

**Cause**: The on-premises data gateway can't connect to the cloud.

**Mitigation**: Make sure your gateway is running on the on-premises computer where you installed the gateway and has internet connectivity. Avoid installing the gateway on a computer that might be turned off or go to sleep. You can also try restarting the on-premises data gateway service (PBIEgwService).

#### **Error**: The provider being used is deprecated: 'System.Data.OracleClient requires Oracle client software version 8.1.7 or greater.' To install the official provider, see [https://go.microsoft.com/fwlink/p/?LinkID=272376](/power-bi/connect-data/desktop-connect-oracle-database).

**Cause**: The Oracle client SDK isn't installed on the computer where the on-premises data gateway is running.

**Resolution**: Download and install the Oracle client SDK on the same computer as the on-premises data gateway.

#### **Error**: Table '[Tablename]' does not define any key columns

**Cause**: The table doesn't have a primary key.

**Resolution**: The Oracle Database connector requires that you use a table with a primary key column.

## Related content

* [Managed connectors for Azure Logic Apps](managed.md)
* [Built-in connectors for Azure Logic Apps](built-in.md)
