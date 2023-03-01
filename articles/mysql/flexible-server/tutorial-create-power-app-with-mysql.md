---
title: Create a Power app with Azure Database for MySQL Flexible Server
description: Create a Power app with Azure Database for MySQL Flexible Server
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth 
ms.date: 03/01/2023
---

# Tutorial: Create a Power app with Azure Database for MySQL Flexible Server

Excerpt

Power Apps is a low-code platform that enables you to build custom applications quickly and easily. You can create a Power App with MySQL database on Azure database for MySQL Flexible Server, to meet your business needs. You can establish a connection to your MySQL database, add data to your app, and customize it to meet your specific needs. With the Azure database for MySQL Connector, you'll have a fully functional app with your data that you can customize and share on any device.

# Run CRUD operations

The connector allows you to perform read, write, and delete operations with data stored in Azure Database for MySQL in addition to connecting to the database.

| **Operation** | **Purpose** |
| --- | --- |
| Delete row | Remove a row from a table. |
| Get row | Get a row from a table. |
| Get rows | Get rows from a table. |
| Get tables | Get tables from a database. |
| Insert row | Insert a new row into a table. |
| Update row | Update an existing row in a table. |

You may experience throttling limits if you hit the threshold of running 200 API calls per connection within 60 seconds.

# Create a connection to your MySQL database

1. Sign in to [Power Apps](https://make.powerapps.com/) and, if necessary, [switch environments](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/intro-maker-portal#choose-an-environment).
2. In left-hand navigation menu go to **Connections** and select **New connection.**
3. Select **Azure database for MySQL (preview)** to add a new connection.

4. Enter the server's name, database name, and authentication information for your MySQL database. Click "Create" to establish a connection to your database.

Note that newly created connections are shareable, so that if a Power App is shared with another user, the connection is also shared. In addition, you don't need to set up a data gateway to connect to the server, as it is required to connect to an on-premises MySQL server.

# Create a new Power App

You can create a new Power App from scratch or use Dataverse to get started quickly.

1. Create a new app from **Dataverse**.

2. Select the previously added connection. Choose a table and select **Connect**. 

3. You can see a simple app created which lists all the customers from **classicmodels.customers** table.


With your data added to your app, you can now customize it to meet your specific needs. Power Apps offers a wide range of customization options, including layout and design options, user interface controls, and formula-based Power. You can also use Power Apps' connectors to integrate with other systems, such as Microsoft SharePoint or Salesforce, to extend the functionality of your app.

## Next Steps

Learn more about Power apps and Azure database for MySQL connector. 
- [Azure Database for MySQL - Connectors documentation](https://learn.microsoft.com/connectors/azuremysql/)
- [Power Apps documentation](https://learn.microsoft.com/en-us/power-apps/)

