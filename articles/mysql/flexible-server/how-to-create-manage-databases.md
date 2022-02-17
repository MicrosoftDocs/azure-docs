---
title: How to create databases for Azure Database for MySQL
description: This article describes how to create and manage databases on Azure Database for MySQL server.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: how-to
ms.date: 02/17/2022
---

# Create and manage databases for Azure Database for MySQL

This article contains information about creating, listing, and deleting MySQL databases on Azure Database for Flexible Server. 

## Prerequisites
Before completing the tasks, you must have
- Created an Azure Database for MySQL Flexible server using [Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md) <br/> or [Azure CLI](./quickstart-create-mysql-server-database-using-azure-cli.md) if you do not have one.
- Login to Azure portal](https://portal.azure.com).


## List your databases
To list all your databases on MySQL flexible server:
- Login to Azure portal](https://portal.azure.com).
- Open the **Overview** page of your MySQL flexible server.
- Select **Databases** from the settings on left navigation menu. 

<!--:::image type="content" source="./databases-view-mysql-flexible-server.png" alt-text="Screenshot showing how to list all the databases on Azure Database for MySQL flexible server":::-->

## Create a database
To create a database on MySQL flexible server:

- Select **Databases** from the settings on left navigation menu. 
- Click on **Add** to create a database. Provide the database name, charset and collation settings for this database.
- Click on  **Save** to complete the task. 

<!--:::image type="content" source="./create-database-azure-mysql-flexible-server.png" alt-text="Screenshot showing how to create a database on Azure Database for MySQL flexible server"::: -->

## Delete a database
To delete a database on MySQL flexible server:

- Select **Databases** from the settings on left navigation menu. 
- Click on **testdatabase1** to select the database. You can select multiple databases to delete at the same time. 
- Click on  **Delete** to complete the task. 

<!--:::image type="content" source="./delete-database-on-mysql-flexible-server.png" alt-text="Screenshot showing how to delete a database on Azure Database for MySQL flexible server"::: -->

## Next steps

Learn how to [manage users](../howto-create-users.md)
