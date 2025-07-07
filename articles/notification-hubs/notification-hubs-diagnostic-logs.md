---
title: Azure Notification Hubs resource logs
description: Learn about the operational and diagnostics logs that are available for Azure Notification Hubs, and how to enable diagnostic settings.
author: sethmanheim
ms.author: sethm
ms.service: azure-notification-hubs
ms.topic: article
ms.date: 03/12/2024
---

# Enable resource logs for Notification Hubs

When you start using your Azure Notification Hubs namespace, you might want to monitor how and when your namespace is created, deleted, or accessed. This article provides an overview of all the operational and diagnostics logs that are available.

Azure Notification Hubs currently supports activity and operational logs, which capture *management operations* that are performed on the Azure Notification Hubs namespace.

## Resource logs schema

All logs are stored in JavaScript Object Notation (JSON) format in the following two locations:

- **AzureActivity**: Displays logs from operations and actions that are conducted against your namespace in the Azure portal or through Azure Resource Manager template deployments.
- **AzureDiagnostics**: Displays logs from operations and actions that are conducted against your namespace by using the API, or through management clients on the language SDK.

For a list of elements that are included in diagnostic log strings, see [Azure Monitor Logs tables](monitor-notification-hubs-reference.md#azure-monitor-logs-tables).

Here's an example of an operational log JSON string:

```json
{
    "operationName": "Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/action",
    "resourceId": "/SUBSCRIPTIONS/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/RESOURCEGROUPS/SAMPLES/PROVIDERS/MICROSOFT.NOTIFICATIONHUBS/NAMESPACES/SAMPLE-NS",
    "time": "1/1/2021 5:16:32 AM +00:00",
    "category": "OperationalLogs",
    "resultType": "Succeeded",
    "resultDescription": "Gets Hub Authorization Rules",
    "correlationId": "aaaa0000-bb11-2222-33cc-444444dddddd",
    "callerIdentity": "{ \"identityType\": \"Portal\", \"identity\": \"\" }"
}
```

The `callerIdentity` field can be empty, or a JSON string with one of the following formats.

For calls originating from the Azure portal the `identity` field is empty. The log can be correlated to activity logs to determine the logged in user.

```json
{
    "identityType": "Portal",
    "identity": ""
}
```

For calls made through Azure Resource Manager the `identity` field contains the username of the logged in user.

```json
{
   "identityType": "Username",
   "identity": "test@foo.com"
}
```

For calls to the Notification Hubs REST API the `identity` field contains the name of the access policy used to generate the SharedAccessSignature token.

```json
{
   "identityType": "KeyName",
   "identity": "SharedAccessRootKey2"
}
```

## Events and operations captured in operational logs

Operational logs capture all management operations that are performed on the Azure Notification Hubs namespace. Data operations aren't captured, because of the high volume of data operations that are conducted on notification hubs.

For a list of the management operations that are captured in operational logs, see [Microsoft.NotificationHubs resource provider operations](/azure/role-based-access-control/permissions/integration#microsoftnotificationhubs).

### Enable operational logs

Operational logs are disabled by default. To enable logs, do the following:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Notification Hubs namespace and then, under **Monitoring**, select  **Diagnostic settings**.

   ![The "Diagnostic settings" link](./media/notification-hubs-diagnostic-logs/image-1.png)

1. In the **Diagnostics settings** pane, select **Add diagnostic setting**.

   ![The "Add diagnostic setting" link](./media/notification-hubs-diagnostic-logs/image-2.png)

1. Configure the diagnostics settings by doing the following:

   a. In the **Name** box, enter a name for the diagnostics settings.  

   b. Select one of the following three destinations for your diagnostics logs:  
   - If you select **Send to Log Analytics workspace**, you need to specify which instance of Log Analytics the diagnostics will be sent to.
   - If you select **Archive to a storage account**, you need to configure the storage account where the diagnostics logs will be stored.  
   - If you select **Stream to an event hub**, you need to configure the event hub that you want to stream the diagnostics logs to.

   c. Select the **OperationalLogs** check box.

    ![The "Diagnostics settings" pane](./media/notification-hubs-diagnostic-logs/image-3.png)

1. Select **Save**.

The new settings take effect in about 10 minutes. The logs are displayed in the configured archival target, in the **Diagnostics logs** pane.

## Related content

To learn more about configuring diagnostics settings, see:
* [Overview of Azure diagnostics logs](/azure/azure-monitor/essentials/platform-logs-overview).

To learn more about Azure Notification Hubs, see:
* [What is Azure Notification Hubs?](notification-hubs-push-notification-overview.md)
