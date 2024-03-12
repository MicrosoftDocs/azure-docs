---
title: Monitor Azure Managed Instance for Apache Cassandra by using Azure Monitor
description: Learn how to use Azure Monitor to view metrics and diagnostic logs from Azure Managed Instance for Apache Cassandra.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 10/29/2021
ms.custom: references_regions, devx-track-azurecli

---

# Monitor Azure Managed Instance for Apache Cassandra by using Azure Monitor

Azure Managed Instance for Apache Cassandra provides metrics and diagnostic logging through [Azure Monitor](../azure-monitor/overview.md).

## Azure Managed Instance for Apache Cassandra metrics

You can visualize metrics for Azure Managed Instance for Apache Cassandra in the Azure portal by going to your cluster resource and selecting **Metrics**. You can then choose from the available metrics and aggregations.

:::image type="content" source="./media/azure-monitor/metrics.png" alt-text="Screenshot that shows the Metrics pane in the Azure portal.":::

## Diagnostic settings in Azure

Azure Monitor uses diagnostic settings to collect resource logs, which are also called *data plane logs*. An Azure resource emits resource logs to provide rich, frequent data about its operations. Azure Monitor captures these logs per request. Examples of data plane operations include delete, insert, and readFeed. The content of these logs varies by resource type.

Platform metrics and activity logs are collected automatically, whereas you must create a diagnostic setting to collect resource logs or to forward them outside Azure Monitor. You can turn on diagnostic settings for Azure Managed Instance for Apache Cassandra cluster resources and send resource logs to the following sources:

- Log Analytics workspace. Data sent to Log Analytics workspaces is written into **Azure Diagnostics (legacy)** or **Resource-specific (preview)** tables.
- Event hub.
- Storage account.
  
> [!NOTE]
> We recommend creating the diagnostic setting in resource-specific mode.

### <a id="create-setting-portal"></a> Create diagnostic settings via the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Managed Instance for Apache Cassandra cluster resource.

    :::image type="content" source="./media/azure-monitor/cluster.png" alt-text="Screenshot that shows selecting a cluster from a list of resources.":::

1. Select **Diagnostic settings** in the **Monitoring** section, and then select **Add diagnostic setting**.

    :::image type="content" source="./media/azure-monitor/settings.png" alt-text="Screenshot that shows the pane for diagnostic settings and the button for adding a diagnostic setting.":::

1. On the **Diagnostic setting** pane, choose a name for your setting.

   Then, under **Category details**, select your categories. The **CassandraLogs** category records Cassandra server operations. The **CassandraAudit** category records audit and Cassandra Query Language (CQL) operations.

   Under **Destination details**, choose your preferred destination for your logs. If you're sending logs to a Log Analytics workspace, be sure to select **Resource specific** as the destination table.

    :::image type="content" source="./media/azure-monitor/preferred-categories.png" alt-text="Screenshot that shows selections for a diagnostic setting.":::

   > [!NOTE]
   > If you're sending logs to a Log Analytics workspace, they can take up to 20 minutes to appear. Until then, the resource-specific tables (shown under **Azure Managed Instance for Apache Cassandra**) aren't visible.  

1. After you set up diagnostic logging and data is flowing, you can select **Logs** and query the available diagnostic logs by using Azure Data Explorer. For more information on Azure Monitor and Kusto Query Language, see [Log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

    :::image type="content" source="./media/azure-monitor/query.png" alt-text="Screenshot that shows query logs.":::

### <a id="create-setting-cli"></a> Create a diagnostic setting via the Azure CLI

To create a diagnostic setting by using the Azure CLI, use the [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create) command:

```azurecli-interactive
    logs='[{"category":"CassandraAudit","enabled":true,"retentionPolicy":{"enabled":true,"days":3}},{"category":"CassandraLogs","enabled":true,"retentionPolicy":{"enabled":true,"days":3}}]'
    resourceId='/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.DocumentDB/cassandraClusters/{CLUSTER_NAME}'
    workspace='/subscriptions/{SUBSCRIPTION_ID}/resourcegroups/{RESOURCE_GROUP}/providers/microsoft.operationalinsights/workspaces/{WORKSPACE_NAME}'

    az monitor diagnostic-settings create  --name tvk-diagnostic-logs-cassandra --resource $resourceId --logs  $logs --workspace $workspace --export-to-resource-specific true
```

### <a id="create-diagnostic-setting"></a> Create a diagnostic setting via the REST API

Use the [Azure Monitor REST API](/rest/api/monitor/diagnosticsettings/createorupdate) for creating a diagnostic setting via the interactive console.

> [!NOTE]
> We recommend setting the `logAnalyticsDestinationType` property to `Dedicated` for enabling resource-specific tables.

#### Request

```HTTP
PUT
https://management.azure.com/{resource-id}/providers/microsoft.insights/diagnosticSettings/service?api-version={api-version}
```

#### Headers

|Parameters/Headers  | Value/Description  |
|---------|---------|
|`name`     |  The name of your diagnostic setting      |
|`resourceUri`     |   `subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.DocumentDb/databaseAccounts/{ACCOUNT_NAME}/providers/microsoft.insights/diagnosticSettings/{DIAGNOSTIC_SETTING_NAME}`      |
|`api-version`     |    `2017-05-01-preview`     |
|`Content-Type`     |    `application/json`     |

#### Body

```json
{
    "id": "/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.DocumentDb/databaseAccounts/{ACCOUNT_NAME}/providers/microsoft.insights/diagnosticSettings/{DIAGNOSTIC_SETTING_NAME}",
    "type": "Microsoft.Insights/diagnosticSettings",
    "name": "name",
    "location": null,
    "kind": null,
    "tags": null,
    "properties": {
        "storageAccountId": null,
        "serviceBusRuleId": null,
        "workspaceId": "/subscriptions/{SUBSCRIPTION_ID}/resourcegroups/{RESOURCE_GROUP}/providers/microsoft.operationalinsights/workspaces/{WORKSPACE_NAME}",
        "eventHubAuthorizationRuleId": null,
        "eventHubName": null,
        "logs": [
            {
                "category": "CassandraAudit",
                "categoryGroup": null,
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            },
            {
                "category": "CassandraLogs",
                "categoryGroup": null,
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            }
        ],
        "logAnalyticsDestinationType": "Dedicated"
    },
    "identity": null
}
```

## Audit whitelist

> [!NOTE]
> This article contains references to the term *whitelist*, which Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

By default, audit logging creates a record for every login attempt and CQL query. The result can be overwhelming and increase overhead. To manage this situation, you can use a whitelist to selectively include or exclude specific audit records.

### Cassandra 3.11

In Cassandra 3.11, you can use the audit whitelist feature to set what operations *don't* create an audit record. The audit whitelist feature is enabled by default in Cassandra 3.11. To learn how to configure your whitelist, see [Role-based whitelist management](https://github.com/Ericsson/ecaudit/blob/release/c2.2/doc/role_whitelist_management.md).

Examples:

- To filter out all `SELECT` and `MODIFY` operations for the user `bob` from the audit log, execute the following statements:

  ```
  cassandra@cqlsh> ALTER ROLE bob WITH OPTIONS = { 'GRANT AUDIT WHITELIST FOR SELECT' : 'data' };
  cassandra@cqlsh> ALTER ROLE bob WITH OPTIONS = { 'GRANT AUDIT WHITELIST FOR MODIFY' : 'data' };
  ```
  
- To filter out all `SELECT` operations on the `decisions` table in the `design` keyspace for user `jim` from the audit log, execute the following statement:

  ```
  cassandra@cqlsh> ALTER ROLE jim WITH OPTIONS = { 'GRANT AUDIT WHITELIST FOR SELECT' : 'data/design/decisions' };
  ```

- To revoke the whitelist for user `bob` on all the user's `SELECT` operations, execute the following statement:

  ```
  cassandra@cqlsh> ALTER ROLE bob WITH OPTIONS = { 'REVOKE AUDIT WHITELIST FOR SELECT' : 'data' };
  ```

- To view current whitelists, execute the following statement:

  ```
  cassandra@cqlsh> LIST ROLES;
  ```

### Cassandra 4 and later

In Cassandra 4 and later, you can configure your whitelist in the Cassandra configuration. For detailed guidance, see [Update Cassandra configuration](create-cluster-portal.md#update-cassandra-configuration). The available options are as follows (reference: [Cassandra documentation for audit logging](https://cassandra.apache.org/doc/stable/cassandra/operating/audit_logging.html)):

```
audit_logging_options:
    included_keyspaces: <Comma separated list of keyspaces to be included in audit log, default - includes all keyspaces>
    excluded_keyspaces: <Comma separated list of keyspaces to be excluded from audit log, default - excludes no keyspace except system, system_schema and system_virtual_schema>
    included_categories: <Comma separated list of Audit Log Categories to be included in audit log, default - includes all categories>
    excluded_categories: <Comma separated list of Audit Log Categories to be excluded from audit log, default - excludes no category>
    included_users: <Comma separated list of users to be included in audit log, default - includes all users>
    excluded_users: <Comma separated list of users to be excluded from audit log, default - excludes no user>
```

The available categories are: `QUERY`, `DML`, `DDL`, `DCL`, `OTHER`, `AUTH`, `ERROR`, `PREPARE`.

Here's an example configuration:

```
audit_logging_options:
    included_keyspaces: keyspace1,keyspace2
    included_categories: AUTH,ERROR,DCL,DDL
```

By default, the configuration sets `included_categories` to `AUTH,ERROR,DCL,DDL`.

## Next steps

- For detailed information about how to create a diagnostic setting by using the Azure portal, the Azure CLI, or PowerShell, see [Diagnostic settings in Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md).
