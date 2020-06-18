---
title: Obtain the connection string from the Azure portal
description: Obtain the connection string from the Azure portal
keywords: sql connection,connection string
services: sql-database
author: dalechen
manager: craigg
ms.service: sql-database
ms.custom: develop apps
ms.topic: include
ms.date: 07/13/2018
ms.author: ninarn
---

### Obtain the connection string from the Azure portal
Use the [Azure portal](https://portal.azure.com/) to obtain the connection string that's necessary for your client program to interact with Azure SQL Database.

1. Select **All services** > **SQL databases**.

2. Enter the name of your database into the filter text box near the upper left of the **SQL databases** blade.

3. Select the row for your database.

4. After the blade appears for your database, for visual convenience select the **Minimize** buttons to collapse the blades you used for browsing and database filtering.

5. On the blade for your database, select **Show database connection strings**.

6. Copy the appropriate connection string. i.e. If you intend to use the ADO.NET connection library, copy the appropriate string from the **ADO.NET** tab.

    ![Copy the ADO connection string for your database][20-CopyAdoConnectionString]

7. Edit the connection string as needed. i.e. Insert your password into the connection string, or remove "@&lt;servername&gt;" from the username if the username or server name are too long.

8. In one format or another, paste the connection string information into your client program code.

For more information, see [Connection strings and configuration files](https://msdn.microsoft.com/library/ms254494.aspx).

<!-- Image references. -->



[20-CopyAdoConnectionString]: ./media/sql-database-include-connection-string-20-portalshots/connqry-connstr-b.png


<!--
These three includes/ files are a sequenced set, but you can pick and choose:

includes/sql-database-include-connection-string-20-portalshots.md
includes/sql-database-include-connection-string-30-compare.md
includes/sql-database-include-connection-string-40-config.md
-->
