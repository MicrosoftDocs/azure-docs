---
title: Restart server - Azure portal - Azure Database for MySQL
description: This article describes how you can restart an Azure Database for MySQL server using the Azure portal.
ms.service: mysql
ms.subservice: single-server
author: savjani
ms.author: pariks
ms.topic: how-to
ms.date: 06/20/2022
---

# Restart Azure Database for MySQL server using Azure portal

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This topic describes how you can restart an Azure Database for MySQL server. You may need to restart your server for maintenance reasons, which causes a short outage as the server performs the operation.

The server restart will be blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.

The time required to complete a restart depends on the MySQL recovery process. To decrease the restart time, we recommend you minimize the amount of activity occurring on the server prior to the restart.

## Prerequisites
To complete this how-to guide, you need:
- An [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md)

>[!NOTE]
>If the user restarting the server is part of [custom role](../../role-based-access-control/custom-roles.md) the user should have write privilege on the server.


## Perform server restart

The following steps restart the MySQL server:

1. In the Azure portal, select your Azure Database for MySQL server.

2. In the toolbar of the server's **Overview** page, click **Restart**.

   :::image type="content" source="./media/how-to-restart-server-portal/2-server.png" alt-text="Azure Database for MySQL - Overview - Restart button":::

3. Click **Yes** to confirm restarting the server.

   :::image type="content" source="./media/how-to-restart-server-portal/3-restart-confirm.png" alt-text="Azure Database for MySQL - Restart confirm":::

4. Observe that the server status changes to "Restarting".

   :::image type="content" source="./media/how-to-restart-server-portal/4-restarting-status.png" alt-text="Azure Database for MySQL - Restart status":::

5. Confirm server restart is successful.

   :::image type="content" source="./media/how-to-restart-server-portal/5-restart-success.png" alt-text="Azure Database for MySQL - Restart success":::

## Next steps

[Quickstart: Create Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)
