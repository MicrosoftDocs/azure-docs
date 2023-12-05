---
title: Connect Azure Database for MySQL - Flexible Server with Power BI 
description: This topic shows how to build Power BI reports from data on your Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth
ms.date: 05/23/2023
---

# Import data from Azure Database for MySQL - Flexible Server in Power BI 

> [!NOTE]
> This article applies to Power BI Desktop only. Currently Power Query online or Power BI Service is **not supported**. 

With Power BI Desktop you can visually explore your data through a free-form drag-and-drop canvas, a broad range of modern data visualizations, and an easy-to-use report authoring experiences. You can import directly from the tables or import from a SELECT query. In this quickstart you will learn how to connect with Azure Database for MySQL - Flexible Server with Power BI Desktop. 

## Prerequisites

1. Install [Power BI desktop](https://aka.ms/pbidesktopstore).
2. If you connect with MySQL database for the first time in Power BI, you need to install the Oracle [MySQL Connector/NET](https://dev.mysql.com/downloads/connector/net/) package.
3. Skip the steps below if MySQL server has SSL disabled. If SSL is enabled, then follow the steps below to install the certificate. 
   1. Download the [SSL public certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem). 
   2. Install the SSL certificate in Trusted Root certification authorities store by following these steps: 
      1. Start **certmgr.msc** Management Console on your Windows system.
      2. Right-click **Trusted Root Certification Authorities** and select **Import**. 
      3. Follow the prompts in the wizard to import the root certificate (for example, DigiCertGlobalRootCA.crt.pem) and click OK.
    
## Connect with Power BI desktop from Azure portal 

Get the connection information needed to connect to the Azure Database for MySQL flexible server. You need the fully qualified server name and sign in credentials.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you've created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, Select **Power BI** setting from the left-hand menu.

   :::image type="content" source="./media/connect-with-powerbi-desktop/use-azure-db-for-mysql-with-power-bi-desktop.png" alt-text="Screenshot of viewing Power BI in Azure portal to connect to the database.":::
   
5. Select a database from the drop down, for example *contactsdb* and then select **Get started**. 
6. Download the Power BI desktop file *contactsdb.pbids*. 

   :::image type="content" source="./media/connect-with-powerbi-desktop/download-powerbi-desktop-file-for-database.png" alt-text="Screenshot of downloading Power BI file for the database.":::
   
7. Open the file in Power BI desktop.
8. Switch to **Database** tab to provide the username and password for your database server. **Note Windows authentication is not supported for Azure database for MySQL Flexible Server.**
   
   :::image type="content" source="./media/connect-with-powerbi-desktop/enter-credentials.png" alt-text="Screenshot of entering credentials to connect with MySQL database."::: 
  
9. In **Navigator**, select the data you require, then either load or transform the data.

   :::image type="content" source="./media/connect-with-powerbi-desktop/navigator.png" alt-text="Screenshot of navigator to view MySQL tables."::: 

## Connect to MySQL database from Power BI Desktop

You can connect to Azure database for MySQL Flexible server with Power BI desktop directly without the use of Azure portal. 

### Get the MySQL connection information 

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you've created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
5. Go to **Databases** page to find the database you want to connect to. Power BI desktop supports adding a connection to a single database and hence providing a database name is required for importing data. 

### Add MySQL connection in Power BI desktop

1. Select the **MySQL database** option in the connector selection.

   :::image type="content" source="./media/connect-with-powerbi-desktop/add-mysql-connection.png" alt-text="Screenshot of adding a mysql connection in Power BI.":::

2. In the **MySQL database** dialog, provide the name of the server and database. 

   :::image type="content" source="./media/connect-with-powerbi-desktop/signin.png" alt-text="Screeshot of Signing in to Power BI.":::

3. Select the **Database** authentication type and input your MySQL credentials in the **User name** and **Password** boxes. Make sure to select the level to apply your credentials to.

   :::image type="content" source="./media/connect-with-powerbi-desktop/enter-credentials.png" alt-text="Screenshot of entering credentials to connect with MySQL database."::: 

4. Once you're done, select **OK**.

5. In **Navigator**, select the data you require, then either load or transform the data.

   :::image type="content" source="./media/connect-with-powerbi-desktop/navigator.png" alt-text="Screenshot of navigator to view MySQL tables."::: 
   
## Connect to MySQL database from Power Query Online
A data gateway is required to use MySQL with Power BI query online. See [how to deploy a data gateway for MySQL](/power-bi/connect-data/service-gateway-deployment-guidance). Once data gateway is setup, take the following steps to add a new connection:

1. Select the **MySQL database** option in the connector selection.
 
2. In the **MySQL database** dialog, provide the name of the server and database.  

    :::image type="content" source="./media/connect-with-powerbi-desktop/power-query-service-signin.png" alt-text="Screenshot of MySQL connection with power query online."::: 

3. Select the **Basic** authentication kind and input your MySQL credentials in the **Username** and **Password** boxes.

4. If your connection isn't encrypted, clear **Use Encrypted Connection**.

5. Select **Next** to connect to the database.

6. In **Navigator**, select the data you require, then select **Transform data** to transform the data in Power Query Editor.

## Connect using advanced options

Power Query Desktop provides a set of advanced options that you can add to your query if needed. The following table lists all of the advanced options you can set in Power Query Desktop.

| Advanced option	| Description |
| --------------- | ----------- |
| Command timeout in minutes | If your connection lasts longer than 10 minutes (the default timeout), you can enter another value in minutes to keep the connection open longer. This option is only available in Power Query Desktop. |
| SQL statement | For information, go to [Import data from a database using native database query](/power-query/native-database-query). |
| Include relationship columns | If checked, includes columns that might have relationships to other tables. If this box is cleared, you cannot see those columns. |
| Navigate using full hierarchy | If checked, the navigator displays the complete hierarchy of tables in the database you're connecting to. If cleared, the navigator displays only the tables whose columns and rows contain data. |

Once you've selected the advanced options you require, select **OK** in Power Query Desktop to connect to your MySQL database.

## Next steps
[Build visuals with Power BI Desktop](/power-bi/fundamentals/desktop-what-is-desktop)
