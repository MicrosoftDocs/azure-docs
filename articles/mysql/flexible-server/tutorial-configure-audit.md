---
title: 'Tutorial: Configure audit logs by using Azure Database for MySQL - Flexible Server'
description: 'This tutorial shows you how to configure audit logs by using Azure Database for MySQL - Flexible Server.'
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.topic: tutorial
author: code-sidd
ms.author: sisawant
ms.date: 10/01/2021
---

# Tutorial: Configure audit logs by using Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

You can use Azure Database for MySQL - Flexible Server to configure audit logs. Audit logs can be used to track database-level activity, including connection, administration, data definition language (DDL), and data manipulation language (DML) events. These types of logs are commonly used for compliance purposes. You ordinarily use database auditing to:
* Account for all actions that happen within a particular schema, table, or row, or that affect specific content.
* Prevent users (or others) from inappropriate actions based on their accountability.
* Investigate suspicious activity.
* Monitor and gather data about specific database activities.
 
This article discusses how to use MySQL audit logs, Log Analytics tools, or a workbook template to visualize auditing information for Azure Database for MySQL - Flexible Server.

In this tutorial, you'll learn how to:
>[!div class="checklist"]
> * Configure auditing by using the Azure portal or the Azure CLI
> * Set up diagnostics
> * View audit logs by using Log Analytics 
> * View audit logs by using workbooks  

## Prerequisites

- [Create an Azure Database for MySQL - Flexible Server instance](./quickstart-create-server-portal.md).
- [Create a Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md).

## Configure auditing by using the Azure portal 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your flexible server instance.

1. On the left pane, under **Settings**, select **Server parameters**.

    :::image type="content" source="./media/tutorial-configure-audit/server-parameters.png" alt-text="Screenshot showing the 'Server parameters' list.":::

1. For the **audit_log_enabled** parameter, select **ON**.

    :::image type="content" source="./media/tutorial-configure-audit/audit-log-enabled.png" alt-text="Screenshot showing the 'audit_log_enabled' parameter switched to 'ON'.":::

1. For the **audit_log_events** parameter, in the dropdown list, select the [event types](concepts-audit-logs.md#configure-audit-logging) to be logged.

    :::image type="content" source="./media/tutorial-configure-audit/audit-log-events.png" alt-text="Screenshot of the event options in the 'audit_log_events' dropdown list.":::

1. For the **audit_log_exclude_users** and **audit_log_include_users** parameters, specify any MySQL users to be included or excluded from logging by providing their MySQL usernames.

    :::image type="content" source="./media/tutorial-configure-audit/audit-log-exclude-users.png" alt-text="Screenshot showing the MySQL usernames to be included or excluded from logging.":::

1. Select **Save**.

    :::image type="content" source="./media/tutorial-configure-audit/save-parameters.png" alt-text="Screenshot of the 'Save' button for saving changes in the parameter values.":::


## Configure auditing by using the Azure CLI
 
Alternatively, you can enable and configure auditing for your flexible server from the Azure CLI by running the following command: 

```azurecli
# Enable audit logs
az mysql flexible-server parameter set \
--name audit_log_enabled \
--resource-group myresourcegroup \
--server-name mydemoserver \
--value ON
```


## Set up diagnostics

Audit logs are integrated with Azure Monitor diagnostics settings to allow you to pipe your logs to any of three data sinks:
* A Log Analytics workspace
* An event hub
* A storage account

>[!Note]
>You should create your data sinks before you configure the diagnostics settings. You can access the audit logs in the data sinks you've configured. It can take up to 10 minutes for the logs to appear.

1. On the left pane, under **Monitoring**, select **Diagnostic settings**.

1. On the **Diagnostics settings** pane, select **Add diagnostic setting**.

    :::image type="content" source="./media/tutorial-configure-audit/add-diagnostic-setting.png" alt-text="Screenshot of the 'Add diagnostic setting' link on the 'Diagnostic settings' pane.":::

1. In the **Name** box, enter a name for the diagnostics setting.

    :::image type="content" source="./media/tutorial-configure-audit/configure-diagnostic-setting.png" alt-text="Screenshot of the 'Diagnostics settings' pane for selecting configuration options.":::

1. Specify which destinations (Log Analytics workspace, an event hub, or a storage account) to send the audit logs to by selecting their corresponding checkboxes.

    >[!Note]
    > For this tutorial, you'll send the audit logs to a Log Analytics workspace.
    
1. Under **Log**, for the log type, select the **MySqlAuditLogs** checkbox.

1. After you've configured the data sinks to pipe the audit logs to, select **Save**.

    :::image type="content" source="./media/tutorial-configure-audit/save-diagnostic-setting.png" alt-text="Screenshot of the 'Save' button at the top of the 'Diagnostics settings' pane.":::

## View audit logs by using Log Analytics 

1. In Log Analytics, on the left pane, under **Monitoring**, select **Logs**.

1. Close the **Queries** window.  

   :::image type="content" source="./media/tutorial-configure-audit/log-query.png" alt-text="Screenshot of the Log Analytics 'Queries' pane.":::

1. In the query window, you can write the query to be executed. For example, to find a summary of audited events on a particular server, we've used the following query: 

    ```kusto
    AzureDiagnostics
        |where Category =='MySqlAuditLogs' 
        |project TimeGenerated, Resource, event_class_s, event_subclass_s, event_time_t, user_s ,ip_s , sql_text_s 
        |summarize count() by event_class_s,event_subclass_s 
        |order by event_class_s 
    ```
    
    :::image type="content" source="./media/tutorial-configure-audit/audit-query.png" alt-text="Screenshot of an example Log Analytics query seeking to find a summary of audited events on a particular server.":::

## View audit logs by using workbooks 
 
The workbook template that you use for auditing requires you to create diagnostics settings to send platform logs. 

1. In Azure Monitor, on the left pane, select **Activity log**, and then select **Diagnostics settings**. 

    :::image type="content" source="./media/tutorial-configure-audit/activity-diagnostics.png" alt-text="Screenshot showing the 'Diagnostics settings' tab on the Azure Monitor 'Activity log' pane.":::

1. On the **Diagnostic setting** pane, you can add a new setting or edit an existing one. Each setting can have no more than one of each destination type.

    :::image type="content" source="./media/tutorial-configure-audit/activity-settings-diagnostic.png" alt-text="Screenshot of the Azure Monitor 'Diagnostic setting' pane for selecting log destinations.":::

    > [!Note]
    > You can access the slow query logs in the data sinks (Log Analytics workspace, storage account, or event hub) that you've already configured. It can take up to 10 minutes for the logs to appear.

1. In the Azure portal, on the left pane, under **Monitoring** for your Azure Database for MySQL - Flexible Server instance, select **Workbooks**.
1. Select the **Auditing** workbook. 

    :::image type="content" source="./media/tutorial-configure-audit/monitor-workbooks.png" alt-text="Screenshot showing all workbooks in the workbook gallery.":::
    
In the workbook, you can view the following visualizations: 
>[!div class="checklist"]
> * Administrative Actions on the service
> * Audit Summary
> * Audit Connection Events Summary
> * Audit Connection Events
> * Table Access Summary
> * Errors Identified


:::image type="content" source="./media/tutorial-configure-audit/admin-events.png" alt-text="Screenshot of workbook template 'Administrative Actions on the service'.":::

:::image type="content" source="./media/tutorial-configure-audit/audit-summary.png" alt-text="Screenshot of workbook template 'Audit Connection Events'.":::

>[!Note]
> * You can also edit these templates and customize them according to your requirements. For more information, see the "Editing mode" section of [Azure Workbooks](../../azure-monitor/visualize/workbooks-overview.md).
> * For a quick view, you can also pin the workbooks or Log Analytics query to your dashboard. For more information, see [Create a dashboard in the Azure portal](../../azure-portal/azure-portal-dashboards.md). 

The *Administrative Actions on the service* view gives you details on activity performed on the service. It helps to determine the *what, who, and when* for any write operations (PUT, POST, DELETE) that are performed on the resources in your subscription. 

You can use other visualizations to help you understand the details of database activity. Database security has four parts: 
* **Server security**: Responsible for preventing unauthorized personnel from accessing the database.  
* **Database connection**: The administrator should check to see whether any database updates have been performed by authorized personnel.
* **Table access control**: Shows the access keys of the authorized users and what tables within the database each is authorized to handle.
* **Database access restriction**: Particularly important for those who've uploaded a database to the internet, and helps prevent outside sources from getting access to your database. 

## Next steps
- [Learn more about Azure Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md#visualizations) and their rich visualization options.
- [Learn more about audit logs](concepts-audit-logs.md).
