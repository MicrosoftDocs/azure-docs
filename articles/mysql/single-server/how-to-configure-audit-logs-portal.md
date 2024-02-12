---
title: Access audit logs - Azure portal - Azure Database for MySQL
description: This article describes how to configure and access the audit logs in Azure Database for MySQL from the Azure portal.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 06/20/2022
---

# Configure and access audit logs for Azure Database for MySQL in the Azure portal

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

You can configure the [Azure Database for MySQL audit logs](concepts-audit-logs.md) and diagnostic settings from the Azure portal.

## Prerequisites

To step through this how-to guide, you need:

- [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md)

## Configure audit logging

>[!IMPORTANT]
> It is recommended to only log the event types and users required for your auditing purposes to ensure your server's performance is not heavily impacted.

Enable and configure audit logging.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your Azure Database for MySQL server.

1. Under the **Settings** section in the sidebar, select **Server parameters**.
    :::image type="content" source="./media/how-to-configure-audit-logs-portal/server-parameters.png" alt-text="Server parameters":::

1. Update the **audit_log_enabled** parameter to ON.
    :::image type="content" source="./media/how-to-configure-audit-logs-portal/audit-log-enabled.png" alt-text="Enable audit logs":::

1. Select the [event types](concepts-audit-logs.md#configure-audit-logging) to be logged by updating the **audit_log_events** parameter.
    :::image type="content" source="./media/how-to-configure-audit-logs-portal/audit-log-events.png" alt-text="Audit log events":::

1. Add any MySQL users to be included or excluded from logging by updating the **audit_log_exclude_users** and **audit_log_include_users** parameters. Specify users by providing their MySQL user name.
    :::image type="content" source="./media/how-to-configure-audit-logs-portal/audit-log-exclude-users.png" alt-text="Audit log exclude users":::

1. Once you have changed the parameters, you can click **Save**. Or you can **Discard** your changes.
    :::image type="content" source="./media/how-to-configure-audit-logs-portal/save-parameters.png" alt-text="Save":::

## Set up diagnostic logs

1. Under the **Monitoring** section in the sidebar, select **Diagnostic settings**.

1. Click on "+ Add diagnostic setting"
:::image type="content" source="./media/how-to-configure-audit-logs-portal/add-diagnostic-setting.png" alt-text="Add diagnostic setting":::

1. Provide a diagnostic setting name.

1. Specify which data sinks to send the audit logs (storage account, event hub, and/or Log Analytics workspace).

1. Select "MySqlAuditLogs" as the log type.
:::image type="content" source="./media/how-to-configure-audit-logs-portal/configure-diagnostic-setting.png" alt-text="Configure diagnostic setting":::

1. Once you've configured the data sinks to pipe the audit logs to, you can click **Save**.
:::image type="content" source="./media/how-to-configure-audit-logs-portal/save-diagnostic-setting.png" alt-text="Save diagnostic setting":::

1. Access the audit logs by exploring them in the data sinks you configured. It may take up to 10 minutes for the logs to appear.

## Next steps

- Learn more about [audit logs](concepts-audit-logs.md) in Azure Database for MySQL
- Learn how to configure audit logs in the [Azure CLI](how-to-configure-audit-logs-cli.md)