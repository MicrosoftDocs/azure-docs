---
title: Azure Monitor
description: Azure Monitor
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 10/29/2021
ms.custom: references_regions, devx-track-azurecli

---

# Monitor Azure Managed Instance for Apache Cassandra using Azure Monitor

Azure Managed Instance for Apache Cassandra provides metrics and diagnostic logging using [Azure Monitor](../azure-monitor/overview.md). 

## Azure Metrics

You can visualize metrics for Azure Managed Instance for Apache Cassandra, by navigating to your cluster resource, and selecting the metrics tab. You can then choose from the available metrics and aggregations.

:::image type="content" source="./media/azure-monitor/metrics.png" alt-text="Visualize metrics":::

## Diagnostic settings in Azure

Diagnostic settings in Azure are used to collect resource logs. Azure resource Logs are emitted by a resource and provide rich, frequent data about the operation of that resource. These logs are captured per request and they are also referred to as "data plane logs". Some examples of the data plane operations include delete, insert, and readFeed. The content of these logs varies by resource type.

Platform metrics and the Activity logs are collected automatically, whereas you must create a diagnostic setting to collect resource logs or forward them outside of Azure Monitor. You can turn on diagnostic settings for Azure Managed Instance for Apache Cassandra cluster resources and send resource logs to the following sources:
- Log Analytics workspaces
  - Data sent to Log Analytics can be written into **Azure Diagnostics (legacy)** or **Resource-specific (preview)** tables 
- Event Hub
- Storage Account
  
> [!NOTE]
> We recommend creating the diagnostic setting in resource-specific mode.

## <a id="create-setting-portal"></a> Create diagnostic settings via the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Managed Instance for Apache Cassandra cluster resource. 

    :::image type="content" source="./media/azure-monitor/cluster.png" alt-text="Select cluster":::
 
1. Open the **Diagnostic settings** pane under the **Monitoring section**, and then select **Add diagnostic setting** option.

    :::image type="content" source="./media/azure-monitor/settings.png" alt-text="Add diagnostic settings":::


1. In the **Diagnostic settings** pane, choose a name for your setting, and select **Categories details**. The **CassandraAudit** category records audit and CQL operations. The **CassandraLogs** category records Cassandra server operations. Then send your Logs to your preferred destination. If you're sending Logs to a **Log Analytics Workspace**, make sure to select **Resource specific** as the Destination table. 

    :::image type="content" source="./media/azure-monitor/preferred-categories.png" alt-text="Select category":::

   > [!WARNING]
   > If you're sending Logs to a Log Analytics Workspace, it can take up to **20 minutes** for logs to first appear. Until then, the resource specific tables (shown below under Azure Managed Instance for Apache Cassandra) will not be visible.  


1. Once diagnostic logging is set up and data is flowing, you can go to the **logs** tab and query the available diagnostic logs using Azure Data Explorer. Take a look at [this article](../azure-monitor/logs/log-query-overview.md) for more information on Azure Monitor and the Kusto query language. 

    :::image type="content" source="./media/azure-monitor/query.png" alt-text="Query logs":::

## <a id="create-setting-cli"></a> Create diagnostic setting via Azure CLI
Use the [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create) command to create a diagnostic setting with the Azure CLI. See the documentation for this command for descriptions of its parameters.

```azurecli-interactive
    logs='[{"category":"CassandraAudit","enabled":true,"retentionPolicy":{"enabled":true,"days":3}},{"category":"CassandraLogs","enabled":true,"retentionPolicy":{"enabled":true,"days":3}}]'
    resourceId='/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.DocumentDB/cassandraClusters/{CLUSTER_NAME}'
    workspace='/subscriptions/{SUBSCRIPTION_ID}/resourcegroups/{RESOURCE_GROUP}/providers/microsoft.operationalinsights/workspaces/{WORKSPACE_NAME}'

    az monitor diagnostic-settings create  --name tvk-doagnostic-logs-cassandra --resource $resourceId --logs  $logs --workspace $workspace --export-to-resource-specific true
```

## <a id="create-diagnostic-setting"></a> Create diagnostic setting via REST API
Use the [Azure Monitor REST API](/rest/api/monitor/diagnosticsettings/createorupdate) for creating a diagnostic setting via the interactive console.
> [!Note]
> We recommend setting the **logAnalyticsDestinationType** property to **Dedicated** for enabling resource specific tables.

### Request

   ```HTTP
   PUT
   https://management.azure.com/{resource-id}/providers/microsoft.insights/diagnosticSettings/service?api-version={api-version}
   ```

### Headers

   |Parameters/Headers  | Value/Description  |
   |---------|---------|
   |name     |  The name of your Diagnostic setting.      |
   |resourceUri     |   subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.DocumentDb/databaseAccounts/{ACCOUNT_NAME}/providers/microsoft.insights/diagnosticSettings/{DIAGNOSTIC_SETTING_NAME}      |
   |api-version     |    2017-05-01-preview     |
   |Content-Type     |    application/json     |

### Body

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

>[!NOTE]
> This article contains references to a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

By default, audit logging creates a record for every login attempt and CQL query. The result can be rather overwhelming and increase overhead. To manage this, you could use whitelist to selectively include or exclude specific audit records.

### Cassandra 3.11
In Cassandra 3.11, you can use the audit whitelist feature to set what operations *don't* create an audit record. The audit whitelist feature is enabled by default in Cassandra 3.11. To learn how to configure your whitelist, see [Role-based whitelist management](https://github.com/Ericsson/ecaudit/blob/release/c2.2/doc/role_whitelist_management.md). 

Examples:

* To filter out all **select and modification** operations for the user **bob** from the audit log, execute the following statements:

  ```
  cassandra@cqlsh> ALTER ROLE bob WITH OPTIONS = { 'GRANT AUDIT WHITELIST FOR SELECT' : 'data' };
  cassandra@cqlsh> ALTER ROLE bob WITH OPTIONS = { 'GRANT AUDIT WHITELIST FOR MODIFY' : 'data' };
  ```
  
* To filter out all **select** operations on the **decisions** table in the **design** keyspace for user **jim** from the audit log, execute the following statement:

  ```
  cassandra@cqlsh> ALTER ROLE jim WITH OPTIONS = { 'GRANT AUDIT WHITELIST FOR SELECT' : 'data/design/decisions' };
  ```

* To revoke the whitelist for user **bob** on all the user's **select** operations, execute the following statement:

  ```
  cassandra@cqlsh> ALTER ROLE bob WITH OPTIONS = { 'REVOKE AUDIT WHITELIST FOR SELECT' : 'data' };
  ```

* To view current whitelists, execute the following statement:

  ```
  cassandra@cqlsh> LIST ROLES;
  ```

### Cassandra 4 and later
In Cassandra 4 and later, you can configure your whitelist in the Cassandra configuration. For detailed guidance on updating the Cassandra configuration, please refer to [Update Cassandra Configuration](create-cluster-portal.md#update-cassandra-configuration). The available options are as follows (Reference: [Cassandra Audit Logging Documentation](https://cassandra.apache.org/doc/stable/cassandra/operating/audit_logging.html)):
```
audit_logging_options:
    included_keyspaces: <Comma separated list of keyspaces to be included in audit log, default - includes all keyspaces>
    excluded_keyspaces: <Comma separated list of keyspaces to be excluded from audit log, default - excludes no keyspace except system, system_schema and system_virtual_schema>
    included_categories: <Comma separated list of Audit Log Categories to be included in audit log, default - includes all categories>
    excluded_categories: <Comma separated list of Audit Log Categories to be excluded from audit log, default - excludes no category>
    included_users: <Comma separated list of users to be included in audit log, default - includes all users>
    excluded_users: <Comma separated list of users to be excluded from audit log, default - excludes no user>
```

List of available categories are: QUERY, DML, DDL, DCL, OTHER, AUTH, ERROR, PREPARE

Here's an example configuration:
```
audit_logging_options:
    included_keyspaces: keyspace1,keyspace2
    included_categories: AUTH,ERROR,DCL,DDL
```

By default, the configuration sets `included_categories` to `AUTH,ERROR,DCL,DDL`.

## Next steps

* For detailed information about how to create a diagnostic setting by using the Azure portal, CLI, or PowerShell, see [create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md) article.
