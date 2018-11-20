---
title: Restart Azure Database for PostgreSQL server using Azure portal
description: This article describes how you can restart an Azure Database for PostgreSQL server using the Azure Portal.
services: postgresql
author: ajlam
ms.author: andrela
editor: jasonwhowell
manager: kfile
ms.service: postgresql
ms.topic: article
ms.date: 11/16/2018
---

# Restart Azure Database for PostgreSQL server using Azure portal
This topic describes how you can restart a Azure Database for PostgreSQL server. You may need to restart your server for maintenance reasons, which causes a short outage as the server performs the operation.

The server restart will be blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.
 
The time required to complete a restart depends on the PostgreSQL recovery process. To decrease the restart time, we recommend you minimize the amount of activity occurring on the server prior to the restart.

## Prerequisites
To complete this how-to guide, you need:
- An [Azure Database for PostgreSQL server and database](quickstart-create-server-database-portal.md)

## Perform server restart

The following steps restart the PostgreSQL server:

1. In the Azure portal, select your Azure Database for PostgreSQL server.

2. In the toolbar of the server's **Overview** page, click **Restart**.

   ![Azure Database for PostgreSQL - Overview - Restart button](./media/howto-restart-server-portal/2-server.png)

3. Click **Yes** to confirm restarting the server.

   ![Azure Database for PostgreSQL - Restart confirm ](./media/howto-restart-server-portal/3-restart-confirm.png)

4. Observe that the server status changes to "Restarting".

   ![Azure Database for PostgreSQL - Restart status ](./media/howto-restart-server-portal/4-restarting-status.png)

5. Confirm server restart is successful.

   ![Azure Database for PostgreSQL - Restart success ](./media/howto-restart-server-portal/5-restart-success.png)

## Next steps

[Quickstart: Create Azure Database for PostgreSQL server using Azure portal](./quickstart-create-server-database-portal.md)