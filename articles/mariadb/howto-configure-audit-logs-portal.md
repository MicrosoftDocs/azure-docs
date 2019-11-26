---
title: Configure and access audit logs for Azure Database for MariaDB in Azure portal
description: This article describes how to configure and access the audit logs in Azure Database for MariaDB from the Azure portal.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 06/24/2019
---

# Configure and access audit logs in the Azure portal

You can configure the [Azure Database for MariaDB audit logs](concepts-audit-logs.md) and diagnostic settings from the Azure portal.

> [!IMPORTANT]
> Audit log functionality is currently in preview.

## Prerequisites

To step through this how-to guide, you need:

- [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-portal.md)

## Configure audit logging

Enable and configure audit logging.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your Azure Database for MariaDB server.

1. Under the **Settings** section in the sidebar, select **Server parameters**.
    ![Server parameters](./media/howto-configure-audit-logs-portal/server-parameters.png)

1. Update the **audit_log_enabled** parameter to ON.
    ![Enable audit logs](./media/howto-configure-audit-logs-portal/audit-log-enabled.png)

1. Select the [event types](concepts-audit-logs.md#configure-audit-logging) to be logged by updating the **audit_log_events** parameter.
    ![Audit log events](./media/howto-configure-audit-logs-portal/audit-log-events.png)

1. Add any MariaDB users to be excluded from logging by updating the **audit_log_exclude_users** parameter. Specify users by providing their MariaDB user name.
    ![Audit log exclude users](./media/howto-configure-audit-logs-portal/audit-log-exclude-users.png)

1. Once you have changed the parameters, you can click **Save**. Or you can **Discard** your changes.
    ![Save](./media/howto-configure-audit-logs-portal/save-parameters.png)

## Set up diagnostic logs

1. Under the **Monitoring** section in the sidebar, select **Diagnostic settings**.

1. Click on "+ Add diagnostic setting"
![Add diagnostic setting](./media/howto-configure-audit-logs-portal/add-diagnostic-setting.png)

1. Provide a diagnostic setting name.

1. Specify which data sinks to send the audit logs (storage account, event hub, and/or Log Analytics workspace).

1. Select "MySqlAuditLogs" as the log type.
![Configure diagnostic setting](./media/howto-configure-audit-logs-portal/configure-diagnostic-setting.png)

1. Once you've configured the data sinks to pipe the audit logs to, you can click **Save**.
![Save diagnostic setting](./media/howto-configure-audit-logs-portal/save-diagnostic-setting.png)

1. Access the audit logs by exploring them in the data sinks you configured. It may take up to 10 minutes for the logs to appear.

## Next steps

- Learn more about [audit logs](concepts-audit-logs.md) in Azure Database for MariaDB.