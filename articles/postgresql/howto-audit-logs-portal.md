---
title: Configure audit logging using the Azure portal in Azure Database for PostgreSQL - Single Server
description: How to configure and access pgAudit audit logs using the Azure portal in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/10/2019
---

# How to configure audit logging using the Azure portal in Azure Database for PostgreSQL - Single Server

Audit logging can cause a high volume of logs to be generated on your server. These logs are by default sent to server logs storage using standard Postgres logging. This storage space is auxiliary to your server and not charged as part of the server storage you provision. This storage space is capped at 1 GB. 

If you want to use audit logging, we recommend that you turn off logging. Instead, you can direct the logs to Azure M 

### Preload pgaudit files
Load the pgAudit extension into the shared preload files.

1. In the Azure portal, select your Azure Database for PostgreSQL server.
2. In the server's navigation bar, select **Server Parameters**.
3. Use the search bar to find the `shared_preload_libraries` parameter.
4. Select **pgaudit** in the drop down.
5. **Save** your change. 
6. [Restart](howto-restart-server-portal.md) the server to apply this change. A restart is required because shared_preload_libraries is a static parameter.

### Install the extension on your Postgres server
Connect to your server (using a client like psql) and install the pgAudit extension with the following:
`CREATE EXTENSION pgaudit;`

>[!TIP]
> If you see an error, confirm that you restarted your server after adding pgaudit to shared_preload_libraries.