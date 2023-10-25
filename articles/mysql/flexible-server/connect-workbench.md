---
title: 'Quickstart: Connect - MySQL Workbench - Azure Database for MySQL - Flexible Server'
description: This Quickstart provides the steps to use MySQL Workbench to connect and query data from Azure Database for MySQL - Flexible Server.
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.subservice: flexible-server
ms.custom: mvc, mode-other
ms.topic: quickstart
ms.date: 9/21/2020
---

# Use MySQL Workbench with Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This quickstart demonstrates how to connect to an Azure Database for MySQL - Flexible Server using the MySQL Workbench application.

## Prerequisites

This quickstart uses the resources created in either of these guides as a starting point:

- [Create an Azure Database for MySQL - Flexible Server using Azure portal](./quickstart-create-server-portal.md)
- [Create an Azure Database for MySQL - Flexible Server using Azure CLI](./quickstart-create-server-cli.md)

## Preparing your client workstation
- If you created your flexible server with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the VNet created with your flexible server. Refer to [Create and manage Azure Database for MySQL - Flexible Server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).
- If you created your flexible server with *Public access (allowed IP addresses)*, you can add your local IP address to the list of firewall rules on your server. Refer to [Create and manage Azure Database for MySQL - Flexible Server firewall rules using the Azure CLI](./how-to-manage-firewall-cli.md).

- Download and install MySQL Workbench on your computer from [the MySQL website](https://dev.mysql.com/downloads/workbench/).

## Get connection information

Get the connection information needed to connect to the flexible server. You need the fully qualified server name and sign in credentials.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
<!--- :::image type="content" source="./media/connect-php/1_server-overview-name-login.png" alt-text="Azure Database for MySQL - Flexible Server name":::--->

## Connect to the server using MySQL Workbench

To connect to Azure Database for MySQL - Flexible Server using MySQL Workbench:

1. Launch the MySQL Workbench application on your computer.

2. In **Setup New Connection** dialog box, enter the following information on the **Parameters** tab:

    :::image type="content" source="./media/connect-workbench/2-setup-new-connection.png" alt-text="setup new connection":::

    | **Parameters** | **Suggested value** | **Field description** |
    |---|---|---|
    |    Connection Name | Demo Connection | Specify a label for this connection. |
    | Connection Method | Standard (TCP/IP) | Standard (TCP/IP) is sufficient. |
    | Hostname | *server name* | Specify the server name value that was used when you created the Azure Database for MySQL earlier. Our example server shown is mydemoserver.mysql.database.azure.com. Use the fully qualified domain name (\*.mysql.database.azure.com) as shown in the example. Follow the steps in the previous section to get the connection information if you do not remember your server name.  |
    | Port | 3306 | Always use port 3306 when connecting to Azure Database for MySQL. |
    | Username |  *server admin login name* | Type in the server admin login username supplied when you created the Azure Database for MySQL earlier. Our example username is myadmin. Follow the steps in the previous section to get the connection information if you do not remember the username.
    | Password | your password | Select **Store in Vault...** button to save the password. |

3. Select **Test Connection** to test if all parameters are correctly configured.

4. Select **OK** to save the connection.

5. In the listing of **MySQL Connections**, select the tile corresponding to your server, and then wait for the connection to be established.

    A new SQL tab opens with a blank editor where you can type your queries.

> [!NOTE]
> Encrypted connection using TLS 1.2 is required and enforced on your Azure Database for MySQL - Flexible Server. Although typically no additional configuration with TLS/SSL certificates is required for MySQL Workbench to connect to your server, we recommend binding the TLS/SSL CA certification with MySQL Workbench. For more information, see [connect using TLS/SSL](./how-to-connect-tls-ssl.md)

## Create a table, insert data, read data, update data, delete data

1. Copy and paste the sample SQL code into a blank SQL tab to illustrate some sample data.

    This code creates an empty database named quickstartdb, and then creates a sample table named inventory. It inserts some rows, then reads the rows. It changes the data with an update statement, and reads the rows again. Finally it deletes a row, and then reads the rows again.

    ```sql
    -- Create a database
    -- DROP DATABASE IF EXISTS quickstartdb;
    CREATE DATABASE quickstartdb;
    USE quickstartdb;

    -- Create a table and insert rows
    DROP TABLE IF EXISTS inventory;
    CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);
    INSERT INTO inventory (name, quantity) VALUES ('banana', 150);
    INSERT INTO inventory (name, quantity) VALUES ('orange', 154);
    INSERT INTO inventory (name, quantity) VALUES ('apple', 100);

    -- Read
    SELECT * FROM inventory;

    -- Update
    UPDATE inventory SET quantity = 200 WHERE id = 1;
    SELECT * FROM inventory;

    -- Delete
    DELETE FROM inventory WHERE id = 2;
    SELECT * FROM inventory;
    ```

    The screenshot shows an example of the SQL code in SQL Workbench and the output after it has been run.

    :::image type="content" source="./media/connect-workbench/3-workbench-sql-tab.png" alt-text="MySQL Workbench SQL Tab to run sample SQL code":::

2. To run the sample SQL Code, select the lightening bolt icon in the toolbar of the **SQL File** tab.
3. Notice the three tabbed results in the **Result Grid** section in the middle of the page.
4. Notice the **Output** list at the bottom of the page. The status of each command is shown.

Now, you have connected to Azure Database for MySQL - Flexible Server by using MySQL Workbench, and you have queried data using the SQL language.

## Next steps
- [Encrypted connectivity using Transport Layer Security (TLS 1.2) in Azure Database for MySQL - Flexible Server](./how-to-connect-tls-ssl.md).
- Learn more about [Networking in Azure Database for MySQL - Flexible Server](./concepts-networking.md).
- [Create and manage Azure Database for MySQL - Flexible Server firewall rules using the Azure portal](./how-to-manage-firewall-portal.md).
- [Create and manage Azure Database for MySQL - Flexible Server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).
