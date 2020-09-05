---
title: Configure audit logs - Azure portal - Azure Database for MySQL - Flexible Server
description: This article describes how to configure and access the audit logs in Azure Database for MySQL Flexible Server from the Azure portal.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: how-to
ms.date: 9/21/2020
---

# Configure and access audit logs for Azure Database for MySQL - Flexible Server using the Azure portal

> [!IMPORTANT]
> Azure Database for MySQL Flexible Server is currently in public preview

You can configure the Azure Database for MySQL Flexible Server [audit logs](concepts-audit-logs.md) and diagnostic settings from the Azure portal.

## Prerequisites
The steps in this article require that you have [flexible server](quickstart-create-server-portal.md).

## Configure audit logging

>[!IMPORTANT]
> It is recommended to only log the event types and users required for your auditing purposes to ensure your server's performance is not heavily impacted.

Enable and configure audit logging.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your flexible server.

1. Under the **Settings** section in the sidebar, select **Server parameters**.
    <!--![Server parameters](./media/howto-configure-audit-logs-portal/server-parameters.png)-->

1. Update the **audit_log_enabled** parameter to ON.
    <!-- ![Enable audit logs](./media/howto-configure-audit-logs-portal/audit-log-enabled.png)-->

1. Select the [event types](concepts-audit-logs.md#configure-audit-logging) to be logged by updating the **audit_log_events** parameter.
    <!-- ![Audit log events](./media/howto-configure-audit-logs-portal/audit-log-events.png)-->

1. Add any MySQL users to be excluded from logging by updating the **audit_log_exclude_users** parameter. Specify users by providing their MySQL user name.
    <!--![Audit log exclude users](./media/howto-configure-audit-logs-portal/audit-log-exclude-users.png)-->

1. Once you have changed the parameters, you can click **Save**. Or you can **Discard** your changes.
    <!--![Save](./media/howto-configure-audit-logs-portal/save-parameters.png)-->

## Set up diagnostics

Audit logs are integrated with Azure Monitor diagnostic settings to allow you to pipe your logs to Azure Monitor logs, Event Hubs, or Azure Storage.

1. Under the **Monitoring** section in the sidebar, select **Diagnostic settings**.

1. Click on "+ Add diagnostic setting"
    <!-- ![Add diagnostic setting](./media/howto-configure-audit-logs-portal/add-diagnostic-setting.png)-->

1. Provide a diagnostic setting name.

1. Specify which destinations to send the audit logs (storage account, event hub, and/or Log Analytics workspace).

1. Select **MySqlAuditLogs** as the log type.
    <!-- ![Configure diagnostic setting](./media/howto-configure-audit-logs-portal/configure-diagnostic-setting.png) -->

1. Once you've configured the data sinks to pipe the audit logs to, you can click **Save**.
    <!-- ![Save diagnostic setting](./media/howto-configure-audit-logs-portal/save-diagnostic-setting.png)-->

1. Access the audit logs by exploring them in the data sinks you configured. It may take up to 10 minutes for the logs to appear.

If you piped your audit logs to Azure Monitor Logs (Log Analytics), refer to some [sample queries](concepts-audit-logs.md#analyze-logs-in-azure-monitor-logs) you can use for analysis.  

## Next steps

- Learn more about [audit logs](concepts-audit-logs.md)
- Learn about [slow query logs](concepts-slow-query-logs.md)
<!-- - Learn how to configure audit logs in the [Azure CLI](howto-configure-audit-logs-cli.md)-->