---
title: Connect to IBM Informix database
description: Automate tasks and workflows that manage resources stored in IBM Informix by using Azure Logic Apps 
services: logic-apps
ms.suite: integration
author: gplarsen
ms.author: plarsen
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 09/26/2016
tags: connectors
---

# Manage IBM Informix database resources by using Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the [Informix connector](/connectors/informix/), you can create automated tasks and workflows that manage resources in an IBM Informix database. This connector includes a Microsoft client that communicates with remote Informix server computers across a TCP/IP network, including cloud-based databases, such as IBM Informix for Windows running in Azure virtualization and on-premises databases by using the on-premises data gateway. You can connect to these Informix platforms and versions if they are configured to support Distributed Relational Database Architecture (DRDA) client connections:

* IBM Informix 12.1
* IBM Informix 11.7

This topic shows you how to use the connector in a logic app to process database operations.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* For on-premises databases, you need to download and install the [on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) on a local computer and [create an Azure data gateway resource in the Azure portal](../logic-apps/logic-apps-gateway-connection.md).

* The logic app where you need access to your Informix database. This connector provides only actions, so your logic app must already start with a trigger, for example, the [Recurrence trigger](../connectors/connectors-native-recurrence.md). 

## Add an Informix action

1. In the [Azure portal](https://portal.azure.com), open your logic app in the Logic App Designer, if not already open.

1. Under the step where you want to add the Informix action, select **New step**.

   To add an action between existing steps, move your mouse over the connecting arrow. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. In the search box, enter `informix` as your filter. From actions list, select the action that you want.

   ![Select the Informix action to run](./media/connectors-create-api-informix/select-informix-connector-action.png)

   For example, the connector provides these actions, which run the corresponding database operations:

   * Get tables - List database tables by using a `CALL` statement
   * Get rows - Read all rows by using a `SELECT *` statement
   * Get row - Read a row by using a `SELECT WHERE` statement
   * Add a row by using an `INSERT` statement
   * Edit a row by using an `UPDATE` statement
   * Delete a row by using a `DELETE` statement

1. If you didn't already create a connection, you're prompted to provide connection details for your Informix database. Follow the steps to create connections for [cloud databases](#cloud-connection) or [on-premises databases](#on-premises-connection).

1. After you create your connection, provide the information for your selected action:

   | Action | Description | Properties and descriptions |
   |--------|-------------|-----------------------------|
   | **Get tables** | List database tables by running an Informix CALL statement. | None |
   | **Get rows** | Fetch all the rows in the specified table by running an Informix `SELECT *` statement. | **Table name**: The name for the Informix table that you want <p><p>To add other properties to this action, select them from the **Add new parameter** list. For more information, see the [connector's reference topic](/connectors/informix/). |
   | **Get row** | Fetch a row from the specified table by running an Informix `SELECT WHERE` statement. | - **Table name**: The name for the Informix table that you want <br>- **Row ID**: The unique ID for the row, for example, `9999` |
   | **Insert row** | Add a row to the specified Informix table by running an Informix `INSERT` statement. | - **Table name**: The name for the Informix table that you want <br>- **item**: The row with the items to add |
   | **Update row** | Change a row in the specified Informix table by running an Informix `UPDATE` statement. | - **Table name**: The name for the Informix table that you want <br>- **Row ID**: The unique ID for the row to update, for example, `9999` <br>- **Row**: The row with the updated values, for example, `102` |
   | **Delete row** | Remove a row from the specified Informix table by running an Informix `DELETE` statement. | - **Table name**: The name for the Informix table that you want <br>- **Row ID**: The unique ID for the row to delete, for example, `9999` |
   ||||

<a name="cloud-connection"></a>

## Connect to Informix

1. For **Gateways**, select the **Connect via on-premises data gateway** checkbox only when your logic app connects to an on-premises database.

1. Provide this information for the connection and then when you're done, select **Create**.

   | Property | JSON property | Required | Value | Description |
   |----------|---------------|----------|---------------|-------------|
   | Connection name | `name` | Yes | `hisdemo2` | The name to use for the connection to your Informix database |
   | Server | `server` | Yes | `hisdemo2.cloudapp.net:9089` | The TCP/IP address or alias that is in either IPv4 or IPv6 format, followed (colon-delimited) by a TCP/IP port number. |
   | Database | `database` | Yes | `nwind` | The DRDA Relational Database Name (RDBNAM) or Informix database name (dbname), which is a 128-byte string |
   | | `authentication` | No | Either Basic or Windows (kerberos) | The authentication type that's required by your Informix database. This property appears only if **Connect via on-premises data gateway** appears selected. |
   | Username | `username` | No | <*database-user-name*> | Accepts a string value. |
   | Password | `password` | No | <*database-password*> | Accepts a string value. |
   | `gateway` | No | The name for the Azure on-premises data gateway resource that you created in the Azure portal. This property appears only if **Connect via on-premises data gateway** appears selected. |
   ||||||

   ![](./media/connectors-create-api-informix/InformixconnectorCloudConnection.png)

1. In the **Informix - Get tables** configuration pane, select **checkbox** to enable **Connect via on-premises data gateway**. Notice that the settings change from cloud to on-premises.

   * Type value for **Server**, in the form of address or alias colon port number. For example, type `ibmserver01:9089`.
   * Type value for **Database**. For example, type `nwind`.
   * Select value for **Authentication**. For example, select **Basic**.
   * Type value for **Username**. For example, type `informix`.
   * Type value for **Password**. For example, type `Password1`.
   * Select value for **Gateway**. For example, select **datagateway01**.

1. Select **Create**, and then select **Save**. 

   ![](./media/connectors-create-api-informix/InformixconnectorOnPremisesDataGatewayConnection.png)


## View outputs

After your logic app runs, you can view the outputs from that run.

1. From your logic app's menu, select **Overview**. On the overview pane, under **Summary**, select the most recent run.

1. Under **Logic app run**, select **Run Details**.

1. From the **Action** list, select the action that you want to view, for example, **Get_tables**.

   If successful, the action's **Status** property is marked as **Succeeded**.

1. To view the inputs, select the **Inputs** link. To view the outputs, select the **Outputs** link, for example:

   * **Get tables** shows a list of tables:

     ![](./media/connectors-create-api-informix/InformixconnectorGetTablesLogicAppRunOutputs.png)

   * **Get_rows** shows a list of rows:

     ![](./media/connectors-create-api-informix/InformixconnectorGetRowsOutputs.png)

   * **Get_row** shows the specified row:

     ![](./media/connectors-create-api-informix/InformixconnectorGetRowOutputs.png)

   * **Insert_row** shows the new row:

     ![](./media/connectors-create-api-informix/InformixconnectorInsertRowOutputs.png)

   * **Update_row** shows the updated row:

     ![](./media/connectors-create-api-informix/InformixconnectorUpdateRowOutputs.png)

   * **Delete_row** shows the deleted row:

     ![](./media/connectors-create-api-informix/InformixconnectorDeleteRowOutputs.png)

## Connector-specific details

For technical details about triggers, actions, and limits, which are described by the connector's Swagger description, review the [connector's reference page](/connectors/informix/).

## Next steps

* Learn about other [Logic Apps connectors](apis-list.md)
