---
title: Create automated tasks to manage an Azure Database for MySQL - Flexible Server
description: Set up automated tasks that help you manage Azure Database for MySQL - Flexible Server by creating workflows that run on Azure Logic Apps.
author: mksuni
ms.author: sumuth
ms.date: 07/06/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Create automated tasks to manage an Azure Database for MySQL - Flexible Server
To help you manage Azure Database for MySQL - Flexible Server more easily, you can create automated management tasks  such as start server, stop server, scale server or send monthly cost reports.

You can create an automation task from a templates that are available to you in the port The following table lists the currently supported resource types and available task templates in this preview:

| Resource type | Automation task templates |
|---------------|---------------------------|
| All Azure resources | **Send monthly cost for resource** |
| Azure virtual machines | Additionally: <br><br>- **Power off Virtual Machine** <br>- **Start Virtual Machine** <br>- **Deallocate Virtual Machine** |
| Azure storage accounts | Additionally: <br><br>- **Delete old blobs** |
| Azure Cosmos DB | Additionally, <br><br>- **Send query result via email** |
