---
title: Connect Azure Database for MySQL Flexible Server with Power BI 
description: This topic shows how to build Power BI reports from data on your Azure Database for MySQL Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth
ms.date: 09/01/2022
---

# Import data from Azure Database for MySQL Flexible Server in Power BI 

>[!NOTE]
> This article applies to Power BI Desktop only. Currently Power Query online is not supported. 

If you have business data stored in Azure database for MySQL Flexible Server then with Power BI Desktop you can visually explore your data through a free-form drag-and-drop canvas, a broad range of modern data visualizations, and an easy-to-use report authoring experiences. You can import directly from the tables or import from a SELECT query. 

## Prerequisites

1. Install [Power BI desktop](https://aka.ms/pbidesktopstore).
2. If you are trying to connect with MySQL database for the first time in Power BI, you need to install the Oracle [MySQL Connector/NET](https://dev.mysql.com/downloads/connector/net/) package.
3. Skip the steps below if MySQL server has SSL disabled. If SSL is enabled then follow the steps below to install the certificate. 
   - Dowload the [SSL public certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem). 
   - Install the SSL certificate in Trusted Root certification authorities store by following these steps: 
      - Start "certmgr.msc" Management Console on your Windows system.
      - Right-click Trusted Root Certification Authorities and select Import. 
      - Follow the prompts in the wizard to import the root certificate (for example, DigiCertGlobalRootCA.crt.pem) and click OK.
    
## Get MySQL server information

Get the connection information needed to connect to the Azure Database for MySQL Flexible Server. You need the fully qualified server name and sign in credentials.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
5. Go to **Databases** page to find the database you want to connect to. Power BI desktop supports addind a connection to a single database and hence providing a database name is rquired for importing data. 

## Connect to MySQL database from Power Query Desktop

To make the connection, take the following steps:
 
1. Select the **MySQL database** option in the connector selection.

:::image type="content" source="./media/connect-with-powerbi-desktop/add-mysql-connection.png" alt-text="add-mysql-connection.png":::

3. In the **MySQL database** dialog, provide the name of the server and database. 

  :::image type="content" source="./media/connect-with-powerbi-desktop/sign-in.png" alt-text="sign-in.png":::

3. Select the **Database** authentication type and input your MySQL credentials in the **User name** and **Password** boxes. Make sure to select the level to apply your credentials to.

  :::image type="content" source="./media/connect-with-powerbi-desktop/enter-credentials.png" alt-text="enter-credentials.png"::: 

4. Once you're done, select **OK**.

5. In **Navigator**, select the data you require, then either load or transform the data.

   :::image type="content" source="./media/connect-with-powerbi-desktop/navigator.png" alt-text="navigator.png"::: 
   
## Connect to MySQL database from Power Query Online

To make the connection, take the following steps:

1. Select the **MySQL database** option in the connector selection.
 
2. In the **MySQL database** dialog, provide the name of the server and database.  

    :::image type="content" source="./media/connect-with-powerbi-desktop/mysql-advanced-options.png" alt-text="mysql-advanced-options.png"::: 

3. If necessary, include the name of your on-premises data gateway.

4. Select the **Basic** authentication kind and input your MySQL credentials in the **Username** and **Password** boxes.

5. If your connection isn't encrypted, clear **Use Encrypted Connection**.

5. Select **Next** to connect to the database.

6. In **Navigator**, select the data you require, then select **Transform data** to transform the data in Power Query Editor.

## Connect using advanced options

Power Query Desktop provides a set of advanced options that you can add to your query if needed.

The following table lists all of the advanced options you can set in Power Query Desktop.

| Advanced option	| Description |
| --------------- | ----------- |
| Command timeout in minutes | If your connection lasts longer than 10 minutes (the default timeout), you can enter another value in minutes to keep the connection open longer. This option is only available in Power Query Desktop. |
| SQL statement | For information, go to [Import data from a database using native database query](https://docs.microsoft.com/power-query/native-database-query). |
| Include relationship columns | If checked, includes columns that might have relationships to other tables. If this box is cleared, you won’t see those columns. |
| Navigate using full hierarchy | If checked, the navigator displays the complete hierarchy of tables in the database you're connecting to. If cleared, the navigator displays only the tables whose columns and rows contain data. |
| | |

Once you've selected the advanced options you require, select **OK** in Power Query Desktop to connect to your MySQL database.
