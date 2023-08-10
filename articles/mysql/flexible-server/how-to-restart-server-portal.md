---
title: Restart server - Azure portal - Azure Database for MySQL - Flexible Server
description: This article describes how you can restart an Azure Database for MySQL - Flexible Server using the Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: code-sidd 
ms.author: sisawant
ms.date: 10/26/2020
---

# Restart Azure Database for MySQL - Flexible Server using Azure portal

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This topic describes how you can restart an Azure Database for MySQL - Flexible Server. You may need to restart your server for maintenance reasons, which causes a short outage as the server performs the operation.

The server restart will be blocked if the service is busy. For example, the service may be processing a previously requested operation such as scaling vCores.

The time required to complete a restart depends on the MySQL recovery process. To decrease the restart time, we recommend you minimize the amount of activity occurring on the server prior to the restart.

## Prerequisites

To complete this how-to guide, you need:
- An [Azure Database for MySQL - Flexible Server](quickstart-create-server-portal.md)

>[!Note]
>If the user restarting the server is part of [custom role](../../role-based-access-control/custom-roles.md) the user should have write privilege on the server.

## Perform server restart

The following steps restart the MySQL server:

1. In the Azure portal, select your Azure Database for MySQL - Flexible Server.

2. In the toolbar of the server's **Overview** page, click **Restart**.

   :::image type="content" source="./media/how-to-restart-server-portal/2-server.png" alt-text="Azure Database for MySQL - Overview - Restart button":::

3. Click **Yes** to confirm restarting the server.

   :::image type="content" source="./media/how-to-restart-server-portal/3-restart-confirm.png" alt-text="Azure Database for MySQL - Restart confirm":::

4. Observe that the server status changes to "Restarting".

   :::image type="content" source="./media/how-to-restart-server-portal/4-restarting-status.png" alt-text="Azure Database for MySQL - Restart status":::

5. Confirm server restart is successful.

   :::image type="content" source="./media/how-to-restart-server-portal/5-restart-success.png" alt-text="Azure Database for MySQL - Restart success":::

## Next steps

[Quickstart: Create Azure Database for MySQL - Flexible Server using Azure portal](quickstart-create-server-portal.md)
