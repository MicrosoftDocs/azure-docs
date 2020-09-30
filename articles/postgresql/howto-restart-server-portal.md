---
title: Restart server - Azure portal - Azure Database for PostgreSQL - Single Server
description: This article describes how you can restart an Azure Database for PostgreSQL - Single Server using the Azure portal.
author: ajlam
ms.author: andrela
ms.service: postgresql
ms.topic: how-to
ms.date: 5/6/2019
---

# Restart Azure Database for PostgreSQL - Single Server using the Azure portal
This topic describes how you can restart an Azure Database for PostgreSQL server. You may need to restart your server for maintenance reasons, which causes a short outage as the server performs the operation.

The server restart will be blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.
 
The time required to complete a restart depends on the PostgreSQL recovery process. To decrease the restart time, we recommend you minimize the amount of activity occurring on the server prior to the restart.

## Prerequisites
To complete this how-to guide, you need:
- An [Azure Database for PostgreSQL server](quickstart-create-server-database-portal.md)

## Perform server restart

The following steps restart the PostgreSQL server:

1. In the [Azure portal](https://portal.azure.com/), select your Azure Database for PostgreSQL server.

2. In the toolbar of the server's **Overview** page, click **Restart**.

   :::image type="content" source="./media/howto-restart-server-portal/2-server.png" alt-text="Azure Database for PostgreSQL - Overview - Restart button":::

3. Click **Yes** to confirm restarting the server.

   :::image type="content" source="./media/howto-restart-server-portal/3-restart-confirm.png" alt-text="Azure Database for PostgreSQL - Restart confirm":::

4. Observe that the server status changes to "Restarting".

   :::image type="content" source="./media/howto-restart-server-portal/4-restarting-status.png" alt-text="Azure Database for PostgreSQL - Restart status":::

5. Confirm server restart is successful.

   :::image type="content" source="./media/howto-restart-server-portal/5-restart-success.png" alt-text="Azure Database for PostgreSQL - Restart success":::

## Next steps

Learn about [how to set parameters in Azure Database for PostgreSQL](howto-configure-server-parameters-using-portal.md)