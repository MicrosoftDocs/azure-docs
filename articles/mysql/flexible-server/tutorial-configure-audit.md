---
title: 'Tutorial: Auditing for Azure Database for MySQL – Flexible Server'
description: 'Tutorial: Auditing for Azure Database for MySQL – Flexible Server'
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.topic: tutorial
ms.date: 10/01/2021
---

# Tutorial: Auditing for Azure Database for MySQL – Flexible Server
[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL Flexible Server provides users with the ability to configure audit logs. Audit logs can be used to track database-level activity including connection, admin, DDL, and DML events. These types of logs are commonly used for compliance purposes. Database Auditing is typically used to:
* Accounting for all the actions that are happening within particular schema, table, or row, or affecting specific content
* Prevent users (or others) from inappropriate actions based on their accountability
* Investigate suspicious activity
* Monitor and gather data about specific database activities
 
In this tutorial you will learn how can you use MySQL Audit logs, Log Analytics tool or Workbooks template to visualize the auditing information for Azure Database for MySQL – Flexible Server. 

## Prerequisites
- You would need to create an Instance of Azure Database for MySQL – Flexible Server. For step-by-step procedure, please refer to [Create Instance of Azure Database for MySQL - Flexible Server](./quickstart-create-server-portal.md)
- You would need to create Log Analytics Workspace created. For step-by-step procedure, please refer to [Create Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md)

In this tutorial you will learn how to:
>[!div class="checklist"]
> * Configure Auditing from Portal or using Azure CLI
> * Set up diagnostics
> * View audit logs using Log Analytics 
> * View audit logs using workbooks 

## Configure auditing from portal 


1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your flexible server.

1. Under the **Settings** section in the sidebar, select **Server parameters**.
    :::image type="content" source="./media/tutorial-configure-audit/server-parameters.png" alt-text="Server parameters":::

1. Update the **audit_log_enabled** parameter to ON.
    :::image type="content" source="./media/tutorial-configure-audit/audit-log-enabled.png" alt-text="Enable audit logs":::

1. Select the [event types](concepts-audit-logs.md#configure-audit-logging) to be logged by updating the **audit_log_events** parameter.
    :::image type="content" source="./media/tutorial-configure-audit/audit-log-events.png" alt-text="Audit log events":::

1. Add any MySQL users to be included or excluded from logging by updating the **audit_log_exclude_users** and **audit_log_include_users** parameters. Specify users by providing their MySQL user name.
    :::image type="content" source="./media/tutorial-configure-audit/audit-log-exclude-users.png" alt-text="Audit log exclude users":::

1. Once you have changed the parameters, you can click **Save**. Or you can **Discard** your changes.
    :::image type="content" source="./media/tutorial-configure-audit/save-parameters.png" alt-text="Save":::



## Configure auditing  From Azure CLI
 
In case you wish to do the above using Azure CLI, you can enable and configure auditing for your server using CLI 

```azurecli
# Enable audit logs
az mysql flexible-server parameter set \
--name audit_log_enabled \
--resource-group myresourcegroup \
--server-name mydemoserver \
--value ON
```


## Set up diagnostics

Audit logs are integrated with Azure Monitor diagnostic settings to allow you to pipe your logs to Azure Monitor logs, Event Hubs, or Azure Storage.

1. Under the **Monitoring** section in the sidebar, select **Diagnostic settings**.

1. Click on "+ Add diagnostic setting"
    :::image type="content" source="./media/tutorial-configure-audit/add-diagnostic-setting.png" alt-text="Add diagnostic setting":::

1. Provide a diagnostic setting name.

1. Specify which destinations to send the audit logs (Log Analytics workspace, storage account and/or event hub).
    >[!Note]
    > For the scope of the tutorial we would need to send the slow query logs to Log Analytics workspace
    
1. Select **MySqlAuditLogs** as the log type.
    :::image type="content" source="./media/tutorial-configure-audit/configure-diagnostic-setting.png" alt-text="Configure diagnostic setting":::

1. Once you've configured the data sinks to pipe the audit logs to, you can click **Save**.
    :::image type="content" source="./media/tutorial-configure-audit/save-diagnostic-setting.png" alt-text="Save diagnostic setting":::

    >[!Note]
    >You should create data sinks (Log Analytics workspace, storage account or event hub) before you configure diagnostic settings. 
    >You can access the slow query logs in the data sinks you configured (Log Analytics workspace, storage account or event hub).It can take up to 10 minutes for the logs to appear.

## View audit logs using Log Analytics 

Navigate to **Logs** under the **Monitoring** section. Close the **Queries** window.  

:::image type="content" source="./media/tutorial-configure-audit/log-query.png" alt-text="Screenshot of Log analytics":::

On the query window, you can write the query to be executed.  Here we have used query to find the Summarize audited events on a particular server

```kusto
AzureDiagnostics
    |where Category =='MySqlAuditLogs' 
    |project TimeGenerated, Resource, event_class_s, event_subclass_s, event_time_t, user_s ,ip_s , sql_text_s 
    |summarize count() by event_class_s,event_subclass_s 
    |order by event_class_s 
```
  
:::image type="content" source="./media/tutorial-configure-audit/audit-query.png" alt-text="Screenshot of Log analytics Query":::

## View audit logs using workbooks 
 
The workbook template that we use for auditing requires us to create diagnostic settings to send platform logs. 

1.	For sending platform logs, click Activity log in the Azure Monitor menu and then **Diagnostic settings**. 

    :::image type="content" source="./media/tutorial-configure-audit/activity-diagnostics.png" alt-text="Screenshot of diagnostics Settings":::

2.	Add a new setting or Edit setting to edit an existing one. Each setting can have no more than one of each of the destination types.

    :::image type="content" source="./media/tutorial-configure-audit/activity-settings-diagnostic.png" alt-text="Screenshot of diagnostic Settings Selection":::

    >[!Note]
    >You can access the slow query logs in the data sinks you configured (Log Analytics workspace, storage account, event hub).It can take up to 10 minutes for the logs to appear.

3.	On the Azure portal, Navigate to **Monitoring** blade for Azure Database for MySQL – Flexible Server and select **Workbooks**.
4.	You should be able to see the templates. Select **Auditing** 

    :::image type="content" source="./media/tutorial-configure-audit/monitor-workbooks.png" alt-text="Screenshot of workbook template":::
    
You will be able to see the following Visualization 
>[!div class="checklist"]
> * Administrative Actions on the service
> * Audit Summary
> * Audit Connection Events Summary
> * Audit Connection Events
> * Table Access Summary
> * Errors Identified


:::image type="content" source="./media/tutorial-configure-audit/admin-events.png" alt-text="Screenshot of workbook template admin events":::

:::image type="content" source="./media/tutorial-configure-audit/audit-summary.png" alt-text="Screenshot of workbook template audit summary events":::

>[!Note]
> * You can also edit these templates and customize as per your requirement. For more information, see [Azure Monitor Workbooks Overview - Azure Monitor](../../azure-monitor/visualize/workbooks-overview.md#editing-mode)
> * For quick view you can also ping the workbooks or Log Analytics query to your Dashboard. For more details refer, [Create a dashboard in the Azure portal - Azure portal](../../azure-portal/azure-portal-dashboards.md) 

Administrative Actions on the service give you details on activity performed on the service. It helps to determine what, who, and when for any write operations (PUT, POST, DELETE) taken on the resources in your subscription. 

Other visualizations will help you get details of database activity. Database security is composed of four parts. These are the server security, database connection, table access control and restricting database access. The server security is the one responsible in preventing unauthorized personnel from accessing the database. In terms of database connections, the administrator should also check whether the updates done on the database are done by authorized personnel. Restricting database access is important especially for those who have their database uploaded in the internet. This will help prevent any outside source from entering or getting access to your database. 

## Next steps
- [Get started Azure Monitor Workbooks](../../azure-monitor/visualize/workbooks-overview.md#visualizations) and learning more about workbooks many rich visualizations options.
- Learn more about [audit logs](concepts-audit-logs.md)