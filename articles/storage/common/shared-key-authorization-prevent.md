---
title: Prevent authorization with Shared Key
titleSuffix: Azure Storage
description: To require clients to use Microsoft Entra ID to authorize requests, you can disallow requests to the storage account that are authorized with Shared Key.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/06/2023
ms.author: akashdubey
ms.reviewer: nachakra
ms.custom: devx-track-azurecli, engagement-fy23
ms.devlang: azurecli
---

# Prevent Shared Key authorization for an Azure Storage account

Every secure request to an Azure Storage account must be authorized. By default, requests can be authorized with either Microsoft Entra credentials, or by using the account access key for Shared Key authorization. Of these two types of authorization, Microsoft Entra ID provides superior security and ease of use over Shared Key, and is recommended by Microsoft. To require clients to use Microsoft Entra ID to authorize requests, you can disallow requests to the storage account that are authorized with Shared Key.

When you disallow Shared Key authorization for a storage account, Azure Storage rejects all subsequent requests to that account that are authorized with the account access keys. Only secured requests that are authorized with Microsoft Entra ID will succeed. For more information about using Microsoft Entra ID, see [Authorize access to data in Azure Storage](authorize-data-access.md).

The **AllowSharedKeyAccess** property of a storage account is not set by default and does not return a value until you explicitly set it. The storage account permits requests that are authorized with Shared Key when the property value is **null** or when it is **true**.

This article describes how to use a DRAG (Detection-Remediation-Audit-Governance) framework to continuously manage Shared Key authorization for your storage account.

## Prerequisites

Before disallowing Shared Key access on any of your storage accounts:

- [Understand how disallowing Shared Key affects SAS tokens](#understand-how-disallowing-shared-key-affects-sas-tokens)
- [Consider compatibility with other Azure tools and services](#consider-compatibility-with-other-azure-tools-and-services)
- Consider the need to [disallow Shared Key authorization to use Microsoft Entra Conditional Access](#disallow-shared-key-authorization-to-use-azure-ad-conditional-access)
- [Transition Azure Files workloads](#transition-azure-files-workloads)

### Understand how disallowing Shared Key affects SAS tokens

When Shared Key access is disallowed for the storage account, Azure Storage handles SAS tokens based on the type of SAS and the service that is targeted by the request. The following table shows how each type of SAS is authorized and how Azure Storage will handle that SAS when the **AllowSharedKeyAccess** property for the storage account is **false**.

| Type of SAS | Type of authorization | Behavior when AllowSharedKeyAccess is false |
|-|-|-|
| User delegation SAS (Blob storage only) | Microsoft Entra ID | Request is permitted. Microsoft recommends using a user delegation SAS when possible for superior security. |
| Service SAS | Shared Key | Request is denied for all Azure Storage services. |
| Account SAS | Shared Key | Request is denied for all Azure Storage services. |

Azure metrics and logging in Azure Monitor do not distinguish between different types of shared access signatures. The **SAS** filter in Azure Metrics Explorer and the **SAS** field in Azure Storage logging in Azure Monitor both report requests that are authorized with any type of SAS. However, different types of shared access signatures are authorized differently, and behave differently when Shared Key access is disallowed:

- A service SAS token or an account SAS token is authorized with Shared Key and will not be permitted on a request to Blob storage when the **AllowSharedKeyAccess** property is set to **false**.
- A user delegation SAS is authorized with Microsoft Entra ID and will be permitted on a request to Blob storage when the **AllowSharedKeyAccess** property is set to **false**.

When you are evaluating traffic to your storage account, keep in mind that metrics and logs as described in [Detect the type of authorization used by client applications](#detect-the-type-of-authorization-used-by-client-applications) may include requests made with a user delegation SAS.

For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).

### Consider compatibility with other Azure tools and services

A number of Azure services use Shared Key authorization to communicate with Azure Storage. If you disallow Shared Key authorization for a storage account, these services will not be able to access data in that account, and your applications may be adversely affected.

Some Azure tools offer the option to use Microsoft Entra authorization to access Azure Storage. The following table lists some popular Azure tools and notes whether they can use Microsoft Entra ID to authorize requests to Azure Storage.

| Azure tool | Microsoft Entra authorization to Azure Storage |
|-|-|
| Azure portal | Supported. For information about authorizing with your Microsoft Entra account from the Azure portal, see [Choose how to authorize access to blob data in the Azure portal](../blobs/authorize-data-operations-portal.md). |
| AzCopy | Supported for Blob Storage. For information about authorizing AzCopy operations, see [Choose how you'll provide authorization credentials](storage-use-azcopy-v10.md#choose-how-youll-provide-authorization-credentials) in the AzCopy documentation. |
| Azure Storage Explorer | Supported for Blob Storage, Queue Storage, Table Storage, and Azure Data Lake Storage Gen2. Microsoft Entra ID access to File storage is not supported. Make sure to select the correct Microsoft Entra tenant. For more information, see [Get started with Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows#sign-in-to-azure) |
| Azure PowerShell | Supported. For information about how to authorize PowerShell commands for blob or queue operations with Microsoft Entra ID, see [Run PowerShell commands with Microsoft Entra credentials to access blob data](../blobs/authorize-data-operations-powershell.md) or [Run PowerShell commands with Microsoft Entra credentials to access queue data](../queues/authorize-data-operations-powershell.md). |
| Azure CLI | Supported. For information about how to authorize Azure CLI commands with Microsoft Entra ID for access to blob and queue data, see [Run Azure CLI commands with Microsoft Entra credentials to access blob or queue data](../blobs/authorize-data-operations-cli.md). |
| Azure IoT Hub | Supported. For more information, see [IoT Hub support for virtual networks](../../iot-hub/virtual-network-support.md). |
| Azure Cloud Shell | Azure Cloud Shell is an integrated shell in the Azure portal. Azure Cloud Shell hosts files for persistence in an Azure file share in a storage account. These files will become inaccessible if Shared Key authorization is disallowed for that storage account. For more information, see [Persist files in Azure Cloud Shell](../../cloud-shell/persisting-shell-storage.md). <br /><br /> To run commands in Azure Cloud Shell to manage storage accounts for which Shared Key access is disallowed, first make sure that you have been granted the necessary permissions to these accounts via Azure RBAC. For more information, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md). |

<a name='disallow-shared-key-authorization-to-use-azure-ad-conditional-access'></a>

### Disallow Shared Key authorization to use Microsoft Entra Conditional Access

To protect an Azure Storage account with Microsoft Entra [Conditional Access](../../active-directory/conditional-access/overview.md) policies, you must disallow Shared Key authorization for the storage account.

### Transition Azure Files workloads

Azure Storage supports Microsoft Entra authorization for requests to Blob Storage, Queue Storage, and Table Storage only. If you disallow authorization with Shared Key for a storage account, requests to Azure Files that use Shared Key authorization will fail. The Azure portal always uses Shared Key authorization to access data in Azure Files, so if you disallow authorization with Shared Key for the storage account, you will not be able to access Azure Files data in the Azure portal.

Microsoft recommends that you either migrate any Azure Files data to a separate storage account before you disallow access to an account via Shared Key, or do not apply this setting to storage accounts that support Azure Files workloads.

## Identify storage accounts that allow Shared Key access

There are two ways to identify storage accounts that allow Shared Key access:

- [Check the Shared Key access setting for multiple accounts](#check-the-shared-key-access-setting-for-multiple-accounts)
- [Configure the Azure Policy for Shared Key access in audit mode](#configure-the-azure-policy-for-shared-key-access-in-audit-mode)

### Check the Shared Key access setting for multiple accounts

To check the Shared Key access setting across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the Shared Key access setting for each account:

```kusto
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend allowSharedKeyAccess = parse_json(properties).allowSharedKeyAccess
| project subscriptionId, resourceGroup, name, allowSharedKeyAccess
```

### Configure the Azure Policy for Shared Key access in audit mode

Azure Policy **Storage accounts should prevent shared key access** prevents users with appropriate permissions from configuring new or existing storage accounts to permit Shared Key authorization. Configure this policy in audit mode to identify storage accounts where Shared Key authorization is allowed. After you have changed applications to use Microsoft Entra rather than Shared Key for authorization, you can [update the policy to prevent allowing Shared Key access](#update-the-azure-policy-to-prevent-allowing-shared-key-access).

For more information about the built-in policy, see **Storage accounts should prevent shared key access** in [List of built-in policy definitions](../../governance/policy/samples/built-in-policies.md#storage).

#### Assign the built-in policy for a resource scope

Follow these steps to assign the built-in policy for the appropriate scope in the Azure portal:

1. In the Azure portal, search for *Policy* to display the Azure Policy dashboard.
1. In the **Authoring** section, select **Assignments**.
1. Choose **Assign policy**.
1. On the **Basics** tab of the **Assign policy** page, in the **Scope** section, specify the scope for the policy assignment. Select the **More** button (**...**) to choose the subscription and optional resource group.
1. For the **Policy definition** field, select the **More** button (**...**), and enter *shared key access* in the **Search** field. Select the policy definition named **Storage accounts should prevent shared key access**.

    :::image type="content" source="media/shared-key-authorization-prevent/policy-definition-select-portal.png" alt-text="Screenshot showing how to select the built-in policy to prevent allowing Shared Key access for your storage accounts" lightbox="media/shared-key-authorization-prevent/policy-definition-select-portal.png":::

1. Select **Review + create**.

1. On the **Review + create** tab, review the policy assignment then select **Create** to assign the policy definition to the specified scope.

#### Monitor compliance with the policy

To monitor your storage accounts for compliance with the Shared Key access policy, follow these steps:

1. On the Azure Policy dashboard under **Authoring**, select **Assignments**.
1. Locate and select the policy assignment you created in the previous section.
1. Select the **View compliance** tab.
1. Any storage accounts within the scope of the policy assignment that do not meet the policy requirements appear in the compliance report.

    :::image type="content" source="media/shared-key-authorization-prevent/policy-compliance-report-portal.png" alt-text="Screenshot showing how to view the compliance report for the Shared Key access built-in policy." lightbox="media/shared-key-authorization-prevent/policy-compliance-report-portal.png":::

To get more information about why a storage account is non-compliant, select **Details** under **Compliance reason**.

## Detect the type of authorization used by client applications

To understand how disallowing Shared Key authorization may affect client applications before you make this change, enable logging and metrics for the storage account. You can then analyze patterns of requests to your account over a period of time to determine how requests are being authorized.

Use metrics to determine how many requests the storage account is receiving that are authorized with Shared Key or a shared access signature (SAS). Use logs to determine which clients are sending those requests.

A SAS may be authorized with either Shared Key or Microsoft Entra ID. For more information about interpreting requests made with a shared access signature, see [Understand how disallowing Shared Key affects SAS tokens](#understand-how-disallowing-shared-key-affects-sas-tokens).

### Determine the number and frequency of requests authorized with Shared Key

To track how requests to a storage account are being authorized, use Azure Metrics Explorer in the Azure portal. For more information about Metrics Explorer, see [Getting started with Azure Metrics Explorer](../../azure-monitor/essentials/metrics-getting-started.md).

Follow these steps to create a metric that tracks requests made with Shared Key or SAS:

1. Navigate to your storage account in the Azure portal. Under the **Monitoring** section, select **Metrics**.
1. The new metric box should appear:

    :::image type="content" source="media/shared-key-authorization-prevent/metric-new-metric-portal.png" alt-text="Screenshot showing the new metric dialog." lightbox="media/shared-key-authorization-prevent/metric-new-metric-portal.png":::

   If it doesn't, select **Add metric**.

1. In the **Metric** dialog, specify the following values:
    1. Leave the **Scope** field set to the name of the storage account.
    1. Set the **Metric Namespace** to *Account*. This metric will report on all requests against the storage account.
    1. Set the **Metric** field to *Transactions*.
    1. Set the **Aggregation** field to *Sum*.

    The new metric will display the sum of the number of transactions against the storage account over a given interval of time. The resulting metric appears as shown in the following image:

    :::image type="content" source="media/shared-key-authorization-prevent/configure-metric-account-transactions.png" alt-text="Screenshot showing how to configure a metric to summarize transactions made with Shared Key or SAS." lightbox="media/shared-key-authorization-prevent/configure-metric-account-transactions.png":::

1. Next, select the **Add filter** button to create a filter on the metric for type of authorization.
1. In the **Filter** dialog, specify the following values:
    1. Set the **Property** value to *Authentication*.
    1. Set the **Operator** field to the equal sign (=).
    1. In the **Values** field, select *Account Key* and *SAS*.
1. In the upper-right corner, select the time range for which you want to view the metric. You can also indicate how granular the aggregation of requests should be, by specifying intervals anywhere from 1 minute to 1 month. For example, set the **Time range** to 30 days and the **Time granularity** to 1 day to see requests aggregated by day over the past 30 days.

After you have configured the metric, requests to your storage account will begin to appear on the graph. The following image shows requests that were authorized with Shared Key or made with a SAS token. Requests are aggregated per day over the past thirty days.

:::image type="content" source="media/shared-key-authorization-prevent/metric-shared-key-requests.png" alt-text="Screenshot showing aggregated requests authorized with Shared Key." lightbox="media/shared-key-authorization-prevent/metric-shared-key-requests.png":::

You can also configure an alert rule to notify you when a certain number of requests that are authorized with Shared Key are made against your storage account. For more information, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/alerts/alerts-metric.md).

### Analyze logs to identify clients that are authorizing requests with Shared Key or SAS

Azure Storage logs capture details about requests made against the storage account, including how a request was authorized. You can analyze the logs to determine which clients are authorizing requests with Shared Key or a SAS token.

To log requests to your Azure Storage account in order to evaluate how they are authorized, you can use Azure Storage logging in Azure Monitor. For more information, see [Monitor Azure Storage](../blobs/monitor-blob-storage.md).

Azure Storage logging in Azure Monitor supports using log queries to analyze log data. To query logs, you can use an Azure Log Analytics workspace. To learn more about log queries, see [Tutorial: Get started with Log Analytics queries](../../azure-monitor/logs/log-analytics-tutorial.md).

#### Create a diagnostic setting in the Azure portal

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account, or use an existing Log Analytics workspace. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the Monitoring section, select **Diagnostic settings**.
1. Select the Azure Storage service for which you want to log requests. For example, choose **Blob** to log requests to Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose **StorageRead**, **StorageWrite**, and **StorageDelete** to log all data requests to the selected service.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media/shared-key-authorization-prevent/create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests." lightbox="media/shared-key-authorization-prevent/create-diagnostic-setting-logs.png":::

You can create a diagnostic setting for each type of Azure Storage resource in your storage account.

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md).

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs](../blobs/monitor-blob-storage-reference.md#resource-logs).

#### Query logs for requests made with Shared Key or SAS

Azure Storage logs in Azure Monitor include the type of authorization that was used to make a request to a storage account. To retrieve logs for requests made in the last seven days that were authorized with Shared Key or SAS, open your Log Analytics workspace. Next, paste the following query into a new log query and run it. This query displays the ten IP addresses that most frequently sent requests that were authorized with Shared Key or SAS:

```kusto
StorageBlobLogs
| where AuthenticationType in ("AccountKey", "SAS") and TimeGenerated > ago(7d)
| summarize count() by CallerIpAddress, UserAgentHeader, AccountName
| top 10 by count_ desc
```

You can also configure an alert rule based on this query to notify you about requests authorized with Shared Key or SAS. For more information, see [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/alerts/alerts-log.md).

## Remediate authorization via Shared Key

After you have analyzed how requests to your storage account are being authorized, you can take action to prevent access via Shared Key. But first, you need to update any applications that are using Shared Key authorization to use Microsoft Entra ID instead. You can monitor logs and metrics as described in [Detect the type of authorization used by client applications](#detect-the-type-of-authorization-used-by-client-applications) to track the transition. For more information about using Microsoft Entra ID to access data in a storage account, see [Authorize access to data in Azure Storage](authorize-data-access.md).

When you are confident that you can safely reject requests that are authorized with Shared Key, you can set the **AllowSharedKeyAccess** property for the storage account to **false**.

> [!WARNING]
> If any clients are currently accessing data in your storage account with Shared Key, then Microsoft recommends that you migrate those clients to Microsoft Entra ID before disallowing Shared Key access to the storage account.

### Permissions for allowing or disallowing Shared Key access

To set the **AllowSharedKeyAccess** property for the storage account, a user must have permissions to create and manage storage accounts. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.Storage/storageAccounts/write** or **Microsoft.Storage/storageAccounts/\*** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

These roles do not provide access to data in a storage account via Microsoft Entra ID. However, they include the **Microsoft.Storage/storageAccounts/listkeys/action**, which grants access to the account access keys. With this permission, a user can use the account access keys to access all data in a storage account.

Role assignments must be scoped to the level of the storage account or higher to permit a user to allow or disallow Shared Key access for the storage account. For more information about role scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create a storage account or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create and manage storage accounts. For more information, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

### Disable Shared Key authorization

Using an account that has the necessary permissions, disable Shared Key authorization in the Azure portal, with PowerShell or using the Azure CLI.

# [Azure portal](#tab/portal)

To disallow Shared Key authorization for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate the **Configuration** setting under **Settings**.
1. Set **Allow storage account key access** to **Disabled**.

    :::image type="content" source="media/shared-key-authorization-prevent/shared-key-access-portal.png" alt-text="Screenshot showing how to disallow Shared Key access for a storage account." lightbox="media/shared-key-authorization-prevent/shared-key-access-portal.png":::

# [PowerShell](#tab/azure-powershell)

To disallow Shared Key authorization for a storage account with PowerShell, install the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage), version 3.4.0 or later. Next, configure the **AllowSharedKeyAccess** property for a new or existing storage account.

The following example shows how to disallow access with Shared Key for an existing storage account with PowerShell. Remember to replace the placeholder values in brackets with your own values:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -AllowSharedKeyAccess $false
```

# [Azure CLI](#tab/azure-cli)

To disallow Shared Key authorization for a storage account with Azure CLI, install Azure CLI version 2.20.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **allowSharedKeyAccess** property for a new or existing storage account.

The following example shows how to disallow access with Shared Key for an existing storage account with Azure CLI. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --allow-shared-key-access false
```

---

After you disallow Shared Key authorization, making a request to the storage account with Shared Key authorization will fail with error code 403 (Forbidden). Azure Storage returns an error indicating that key-based authorization is not permitted on the storage account.

The **AllowSharedKeyAccess** property is supported for storage accounts that use the Azure Resource Manager deployment model only. For information about which storage accounts use the Azure Resource Manager deployment model, see [Types of storage accounts](storage-account-overview.md#types-of-storage-accounts).

## Verify that Shared Key access is not allowed

To verify that Shared Key authorization is no longer permitted, you can attempt to call a data operation with the account access key. The following example attempts to create a container using the access key. This call will fail when Shared Key authorization is disallowed for the storage account. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage container create \
    --account-name <storage-account> \
    --name sample-container \
    --account-key <key> \
    --auth-mode key
```

> [!NOTE]
> Anonymous requests are not authorized and will proceed if you have configured the storage account and container for anonymous read access. For more information, see [Configure anonymous read access for containers and blobs](../blobs/anonymous-read-access-configure.md).

## Monitor the Azure Policy for compliance

After disallowing Shared Key access on the desired storage accounts, continue to [monitor the policy you created earlier](#monitor-compliance-with-the-policy) for ongoing compliance. Based on the monitoring results, take the appropriate action as needed, including changing the scope of the policy, disallowing Shared Key access on more accounts or allowing it for accounts where more time is needed for remediation.

## Update the Azure Policy to prevent allowing Shared Key access

To begin enforcing [the Azure Policy assignment you previously created](#configure-the-azure-policy-for-shared-key-access-in-audit-mode) for policy **Storage accounts should prevent shared key access**, change the **Effect** of the policy assignment to **Deny** to prevent authorized users from allowing Shared Key access on storage accounts. To change the effect of the policy, perform the following steps:

1. On the Azure Policy dashboard, locate and select the policy assignment [you previously created](#configure-the-azure-policy-for-shared-key-access-in-audit-mode).

1. Select **Edit assignment**.
1. Go to the **Parameters** tab.
1. Uncheck the **Only show parameters that need input or review** checkbox.
1. In the **Effect** drop-down change **Audit** to **Deny**, then select **Review + save**.
1. On the **Review + save** tab, review your changes, then select **Save**.

> [!NOTE]
> It might take up to 30 minutes for your policy change to take effect.

## Next steps

- [Authorize access to data in Azure Storage](./authorize-data-access.md)
- [Authorize access to blobs and queues using Microsoft Entra ID](authorize-data-access.md)
- [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key)
