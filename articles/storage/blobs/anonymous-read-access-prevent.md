---
title: Remediate anonymous public read access to blob data (Azure Resource Manager deployments)
titleSuffix: Azure Storage
description: Learn how to analyze anonymous requests against a storage account and how to prevent anonymous access for the entire storage account or for an individual container.
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: how-to
ms.date: 11/02/2022
ms.author: jammart
ms.reviewer: fryu
ms.subservice: blobs
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Remediate anonymous public read access to blob data (Azure Resource Manager deployments)

Azure Blob Storage supports optional anonymous public read access to containers and blobs. However, anonymous access may present a security risk. We recommend that you disable anonymous access at the level of the storage account for optimal security. Disallowing public access helps to prevent data breaches caused by undesired anonymous access.

By default, public access to your blob data is always prohibited. However, the default configuration for a storage account permits a user with appropriate permissions to configure public access to containers and blobs in a storage account. You can disallow all public access to a storage account, regardless of the public access setting for an individual container, by setting the **AllowBlobPublicAccess** property on the storage account to **False**.

After you disallow public blob access for the storage account, Azure Storage rejects all anonymous requests to that account. Disallowing public access to a storage account prevents users from subsequently configuring public access for containers in that account. Any containers that have already been configured for public access will no longer accept anonymous requests.

> [!WARNING]
> When a container is configured for public access, any client can read data in that container. Public access presents a potential security risk, so if your scenario does not require it, we recommend that you disallow it for the storage account.

## Remediation for Azure Resource Manager versus classic storage accounts

This article describes how to use a DRAG (Detection-Remediation-Audit-Governance) framework to continuously manage public access for storage accounts that are using the Azure Resource Manager deployment model. All general-purpose v2 storage accounts, premium block blob storage accounts, premium file share accounts, and Blob Storage accounts use the Azure Resource Manager deployment model. Some older general-purpose v1 accounts and premium page blob accounts may use the classic deployment model.

If your storage account is using the classic deployment model, we recommend that you migrate to the Azure Resource Manager deployment model as soon as possible. Azure Storage accounts that use the classic deployment model will be retired on August 31, 2024. For more information, see [Azure classic storage accounts will be retired on 31 August 2024](https://azure.microsoft.com/updates/classic-azure-storage-accounts-will-be-retired-on-31-august-2024/).

If you cannot migrate your classic storage accounts at this time, then you should remediate public access to those accounts now. To learn how to remediate public access for classic storage accounts, see [Remediate public access for classic storage accounts](#remediate-public-access-for-classic-storage-accounts). For more information about Azure deployment models, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md).

## About anonymous public read access

Anonymous public access to your data is always prohibited by default. There are two separate settings that affect public access:

1. **Allow public access for the storage account.** By default, a storage account allows a user with the appropriate permissions to enable public access to a container. Blob data is not available for public access unless the user takes the additional step to explicitly configure the container's public access setting.
1. **Configure the container's public access setting.** By default, a container's public access setting is disabled, meaning that authorization is required for every request to the container or its data. A user with the appropriate permissions can modify a container's public access setting to enable anonymous access only if anonymous access is allowed for the storage account.

The following table summarizes how both settings together affect public access for a container.

|  | Public access level for the container is set to Private (default setting) | Public access level for the container is set to Container | Public access level for the container is set to Blob |
|--|--|--|--|
| **Public access is disallowed for the storage account** | **Recommended.** No public access to any container in the storage account. | No public access to any container in the storage account. The storage account setting overrides the container setting. | No public access to any container in the storage account. The storage account setting overrides the container setting. |
| **Public access is allowed for the storage account (default setting)** | No public access to this container (default configuration). | **Not recommended.** Public access is permitted to this container and its blobs. | **Not recommended.** Public access is permitted to blobs in this container, but not to the container itself. |

When anonymous public access is permitted for a storage account and configured for a specific container, then a request to read a blob in that container that is passed without an *Authorization* header is accepted by the service, and the blob's data is returned in the response.

## Detect anonymous requests from client applications

When you disallow public read access for a storage account, you risk rejecting requests to containers and blobs that are currently configured for public access. Disallowing public access for a storage account overrides the public access settings for individual containers in that storage account. When public access is disallowed for the storage account, any future anonymous requests to that account will fail.

To understand how disallowing public access may affect client applications, we recommend that you enable logging and metrics for that account and analyze patterns of anonymous requests over an interval of time. Use metrics to determine the number of anonymous requests to the storage account, and use logs to determine which containers are being accessed anonymously.

### Monitor anonymous requests with Metrics Explorer

To track anonymous requests to a storage account, use Azure Metrics Explorer in the Azure portal. For more information about Metrics Explorer, see [Getting started with Azure Metrics Explorer](../../azure-monitor/essentials/metrics-getting-started.md).

Follow these steps to create a metric that tracks anonymous requests:

1. Navigate to your storage account in the Azure portal. Under the **Monitoring** section, select **Metrics**.
1. Select **Add metric**. In the **Metric** dialog, specify the following values:
    1. Leave the Scope field set to the name of the storage account.
    1. Set the **Metric Namespace** to *Blob*. This metric will report requests against Blob storage only.
    1. Set the **Metric** field to *Transactions*.
    1. Set the **Aggregation** field to *Sum*.

    The new metric will display the sum of the number of transactions against Blob storage over a given interval of time. The resulting metric appears as shown in the following image:

    :::image type="content" source="media/anonymous-read-access-prevent/configure-metric-blob-transactions.png" alt-text="Screenshot showing how to configure metric to sum blob transactions":::

1. Next, select the **Add filter** button to create a filter on the metric for anonymous requests.
1. In the **Filter** dialog, specify the following values:
    1. Set the **Property** value to *Authentication*.
    1. Set the **Operator** field to the equal sign (=).
    1. Set the **Values** field to *Anonymous* by selecting it from the dropdown or typing it in.
1. In the upper-right corner, select the time interval over which you want to view the metric. You can also indicate how granular the aggregation of requests should be, by specifying intervals anywhere from 1 minute to 1 month.

After you have configured the metric, anonymous requests will begin to appear on the graph. The following image shows anonymous requests aggregated over the past thirty minutes.

:::image type="content" source="media/anonymous-read-access-prevent/metric-anonymous-blob-requests.png" alt-text="Screenshot showing aggregated anonymous requests against Blob storage":::

You can also configure an alert rule to notify you when a certain number of anonymous requests are made against your storage account. For more information, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/alerts/alerts-metric.md).

### Analyze logs to identify containers receiving anonymous requests

Azure Storage logs capture details about requests made against the storage account, including how a request was authorized. You can analyze the logs to determine which containers are receiving anonymous requests.

To log requests to your Azure Storage account in order to evaluate anonymous requests, you can use Azure Storage logging in Azure Monitor (preview). For more information, see [Monitor Azure Storage](./monitor-blob-storage.md).

Azure Storage logging in Azure Monitor supports using log queries to analyze log data. To query logs, you can use an Azure Log Analytics workspace. To learn more about log queries, see [Tutorial: Get started with Log Analytics queries](../../azure-monitor/logs/log-analytics-tutorial.md).

> [!NOTE]
> The preview of Azure Storage logging in Azure Monitor is supported only in the Azure public cloud. Government clouds do not support logging for Azure Storage with Azure Monitor.

#### Create a diagnostic setting in the Azure portal

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the Monitoring section, select **Diagnostic settings (preview)**.
1. Select **Blob** to log requests made against Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose which types of requests to log. All anonymous requests will be read requests, so select **StorageRead** to capture anonymous requests.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media/anonymous-read-access-prevent/create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests":::

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md).

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs (preview)](./monitor-blob-storage-reference.md#resource-logs-preview).

#### Query logs for anonymous requests

Azure Storage logs in Azure Monitor include the type of authorization that was used to make a request to a storage account. In your log query, filter on the **AuthenticationType** property to view anonymous requests.

To retrieve logs for the last 7 days for anonymous requests against Blob storage, open your Log Analytics workspace. Next, paste the following query into a new log query and run it:

```kusto
StorageBlobLogs
| where TimeGenerated > ago(7d) and AuthenticationType == "Anonymous"
| project TimeGenerated, AccountName, AuthenticationType, Uri
```

You can also configure an alert rule based on this query to notify you about anonymous requests. For more information, see [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/alerts/alerts-log.md).

## Remediate anonymous public access for the storage account

After you have evaluated anonymous requests to containers and blobs in your storage account, you can take action to remediate public access for the whole account by setting the account's **AllowBlobPublicAccess** property to **False**.

The public access setting for a storage account overrides the individual settings for containers in that account. When you disallow public access for a storage account, any containers that are configured to permit public access are no longer accessible anonymously. If you've disallowed public access for the account, you do not also need to disable public access for individual containers.

> [!IMPORTANT]
> If your scenario requires that certain containers need to be available for public access, then you should move those containers and their blobs into separate storage accounts that are reserved for public access. You can then disallow public access for any other storage accounts.

### Permissions for disallowing public access

To set the **AllowBlobPublicAccess** property for the storage account, a user must have permissions to create and manage storage accounts. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.Storage/storageAccounts/write** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

Role assignments must be scoped to the level of the storage account or higher to permit a user to disallow public access for the storage account. For more information about role scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those administrative users who require the ability to create a storage account or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

These roles do not provide access to data in a storage account via Azure Active Directory (Azure AD). However, they include the **Microsoft.Storage/storageAccounts/listkeys/action**, which grants access to the account access keys. With this permission, a user can use the account access keys to access all data in a storage account.

The **Microsoft.Storage/storageAccounts/listkeys/action** itself grants data access via the account keys, but does not grant a user the ability to change the **AllowBlobPublicAccess** property for a storage account. For users who need to access data in your storage account but should not have the ability to change the storage account's configuration, consider assigning roles such as [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor), [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader), or [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create storage accounts and manage account configuration. For more information, see [Classic subscription administrator roles, Azure roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

### Set the storage account's AllowBlobPublicAccess property to False

To disallow public access for a storage account, set the account's **AllowBlobPublicAccess** property to **False**. This property is available for all storage accounts that are created with the Azure Resource Manager deployment model. For more information, see [Storage account overview](../common/storage-account-overview.md).

The **AllowBlobPublicAccess** property is not set for a storage account by default and does not return a value until you explicitly set it. The storage account permits public access when the property value is either **null** or **true**.

> [!IMPORTANT]
> Disallowing public access for a storage account overrides the public access settings for all containers in that storage account. When public access is disallowed for the storage account, any future anonymous requests to that account will fail. Before changing this setting, be sure to understand the impact on client applications that may be accessing data in your storage account anonymously by following the steps outlined in [Detect anonymous requests from client applications](#detect-anonymous-requests-from-client-applications).

# [Azure portal](#tab/portal)

To disallow public access for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate the **Configuration** setting under **Settings**.
1. Set **Blob public access** to **Disabled**.

    :::image type="content" source="media/anonymous-read-access-configure/blob-public-access-portal.png" alt-text="Screenshot showing how to disallow blob public access for account":::

# [PowerShell](#tab/powershell)

To disallow public access for a storage account with PowerShell, install [Azure PowerShell version 4.4.0](https://www.powershellgallery.com/packages/Az/4.4.0) or later. Next, configure the **AllowBlobPublicAccess** property for a new or existing storage account.

The following example creates a storage account and explicitly sets the **AllowBlobPublicAccess** property to **false**. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$location = "<location>"

# Create a storage account with AllowBlobPublicAccess set to false.
New-AzStorageAccount -ResourceGroupName $rgName `
    -Name $accountName `
    -Location $location `
    -SkuName Standard_GRS `
    -AllowBlobPublicAccess $false

# Read the AllowBlobPublicAccess property for the newly created storage account.
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).AllowBlobPublicAccess
```

# [Azure CLI](#tab/azure-cli)

To disallow public access for a storage account with Azure CLI, install Azure CLI version 2.9.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **allowBlobPublicAccess** property for a new or existing storage account.

The following example creates a storage account and explicitly sets the **allowBlobPublicAccess** property to **false**. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --kind StorageV2 \
    --location <location> \
    --allow-blob-public-access false

az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query allowBlobPublicAccess \
    --output tsv
```

# [Template](#tab/template)

To disallow public access for a storage account with a template, create a template with the **AllowBlobPublicAccess** property set to **false**. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose **Create a resource**.
1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
1. Choose **Template deployment (deploy using custom templates) (preview)**, choose **Create**, and then choose **Build your own template in the editor**.
1. In the template editor, paste in the following JSON to create a new account and set the **AllowBlobPublicAccess** property to **false**. Remember to replace the placeholders in angle brackets with your own values.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {
            "storageAccountName": "[concat(uniqueString(subscription().subscriptionId), 'template')]"
        },
        "resources": [
            {
            "name": "[variables('storageAccountName')]",
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-06-01",
            "location": "<location>",
            "properties": {
                "allowBlobPublicAccess": false
            },
            "dependsOn": [],
            "sku": {
              "name": "Standard_GRS"
            },
            "kind": "StorageV2",
            "tags": {}
            }
        ]
    }
    ```

1. Save the template.
1. Specify resource group parameter, then choose the **Review + create** button to deploy the template and create a storage account with the **allowBlobPublicAccess** property configured.

---

> [!NOTE]
> Disallowing public access for a storage account does not affect any static websites hosted in that storage account. The **$web** container is always publicly accessible.
>
> After you update the public access setting for the storage account, it may take up to 30 seconds before the change is fully propagated.

### Verify that public access to a blob is not permitted

To verify that public access to a specific blob is disallowed, you can attempt to download the blob via its URL. If the download succeeds, then the blob is still publicly available. If the blob is not publicly accessible because public access has been disallowed for the storage account, then you will see an error message indicating that public access is not permitted on this storage account.

The following example shows how to use PowerShell to attempt to download a blob via its URL. Remember to replace the placeholder values in brackets with your own values:

```powershell
$url = "<absolute-url-to-blob>"
$downloadTo = "<file-path-for-download>"
Invoke-WebRequest -Uri $url -OutFile $downloadTo -ErrorAction Stop
```

### Verify that modifying the container's public access setting is not permitted

To verify that a container's public access setting cannot be modified after public access is disallowed for the storage account, you can attempt to modify the setting. Changing the container's public access setting will fail if public access is disallowed for the storage account.

The following example shows how to use PowerShell to attempt to change a container's public access setting. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container-name>"

$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

Set-AzStorageContainerAcl -Context $ctx -Container $containerName -Permission Blob
```

### Verify that creating a container with public access enabled is not permitted

If public access is disallowed for the storage account, then you will not be able to create a new container with public access enabled. To verify, you can attempt to create a container with public access enabled.

The following example shows how to use PowerShell to attempt to create a container with public access enabled. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container-name>"

$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

New-AzStorageContainer -Name $containerName -Permission Blob -Context $ctx
```

### Check the public access setting for multiple accounts

To check the public access setting across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md).

The **AllowBlobPublicAccess** property is not set for a storage account by default and does not return a value until you explicitly set it. The storage account permits public access when the property value is either **null** or **true**.

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays public access setting for each account:

```kusto
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend allowBlobPublicAccess = parse_json(properties).allowBlobPublicAccess
| project subscriptionId, resourceGroup, name, allowBlobPublicAccess
```

The following image shows the results of a query across a subscription. Note that for storage accounts where the **AllowBlobPublicAccess** property has been explicitly set, it appears in the results as **true** or **false**. If the **AllowBlobPublicAccess** property has not been set for a storage account, it appears as blank (or null) in the query results.

:::image type="content" source="media/anonymous-read-access-prevent/check-public-access-setting-accounts.png" alt-text="Screenshot showing query results for public access setting across storage accounts":::

## Use Azure Policy to audit for compliance

If you have a large number of storage accounts, you may want to perform an audit to make sure that those accounts are configured to prevent public access. To audit a set of storage accounts for their compliance, use Azure Policy. Azure Policy is a service that you can use to create, assign, and manage policies that apply rules to Azure resources. Azure Policy helps you to keep those resources compliant with your corporate standards and service level agreements. For more information, see [Overview of Azure Policy](../../governance/policy/overview.md).

### Create a policy with an Audit effect

Azure Policy supports effects that determine what happens when a policy rule is evaluated against a resource. The Audit effect creates a warning when a resource is not in compliance, but does not stop the request. For more information about effects, see [Understand Azure Policy effects](../../governance/policy/concepts/effects.md).

To create a policy with an Audit effect for the public access setting for a storage account with the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
1. Under the **Authoring** section, select **Definitions**.
1. Select **Add policy definition** to create a new policy definition.
1. For the **Definition location** field, select the **More** button to specify where the audit policy resource is located.
1. Specify a name for the policy. You can optionally specify a description and category.
1. Under **Policy rule**, add the following policy definition to the **policyRule** section.

    ```json
    {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Storage/storageAccounts"
          },
          {
            "not": {
              "field":"Microsoft.Storage/storageAccounts/allowBlobPublicAccess",
              "equals": "false"
            }
          }
        ]
      },
      "then": {
        "effect": "audit"
      }
    }
    ```

1. Save the policy.

### Assign the policy

Next, assign the policy to a resource. The scope of the policy corresponds to that resource and any resources beneath it. For more information on policy assignment, see [Azure Policy assignment structure](../../governance/policy/concepts/assignment-structure.md).

To assign the policy with the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
1. Under the **Authoring** section, select **Assignments**.
1. Select **Assign policy** to create a new policy assignment.
1. For the **Scope** field, select the scope of the policy assignment.
1. For the **Policy definition** field, select the **More** button, then select the policy you defined in the previous section from the list.
1. Provide a name for the policy assignment. The description is optional.
1. Leave **Policy enforcement** set to *Enabled*. This setting has no effect on the audit policy.
1. Select **Review + create** to create the assignment.

### View compliance report

After you've assigned the policy, you can view the compliance report. The compliance report for an audit policy provides information on which storage accounts are not in compliance with the policy. For more information, see [Get policy compliance data](../../governance/policy/how-to/get-compliance-data.md).

It may take several minutes for the compliance report to become available after the policy assignment is created.

To view the compliance report in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
1. Select **Compliance**.
1. Filter the results for the name of the policy assignment that you created in the previous step. The report shows how many resources are not in compliance with the policy.
1. You can drill down into the report for additional details, including a list of storage accounts that are not in compliance.

    :::image type="content" source="media/anonymous-read-access-prevent/compliance-report-policy-portal.png" alt-text="Screenshot showing compliance report for audit policy for blob public access":::

## Use Azure Policy to enforce authorized access

Azure Policy supports cloud governance by ensuring that Azure resources adhere to requirements and standards. To ensure that storage accounts in your organization permit only authorized requests, you can create a policy that prevents the creation of a new storage account with a public access setting that allows anonymous requests. This policy will also prevent all configuration changes to an existing account if the public access setting for that account is not compliant with the policy.

The enforcement policy uses the Deny effect to prevent a request that would create or modify a storage account to allow public access. For more information about effects, see [Understand Azure Policy effects](../../governance/policy/concepts/effects.md).

To create a policy with a Deny effect for a public access setting that allows anonymous requests, follow the same steps described in [Use Azure Policy to audit for compliance](#use-azure-policy-to-audit-for-compliance), but provide the following JSON in the **policyRule** section of the policy definition:

```json
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Storage/storageAccounts"
      },
      {
        "not": {
          "field":"Microsoft.Storage/storageAccounts/allowBlobPublicAccess",
          "equals": "false"
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
```

After you create the policy with the Deny effect and assign it to a scope, a user cannot create a storage account that allows public access. Nor can a user make any configuration changes to an existing storage account that currently allows public access. Attempting to do so results in an error. The public access setting for the storage account must be set to **false** to proceed with account creation or configuration.

The following image shows the error that occurs if you try to create a storage account that allows public access (the default for a new account) when a policy with a Deny effect requires that public access is disallowed.

:::image type="content" source="media/anonymous-read-access-prevent/deny-policy-error.png" alt-text="Screenshot showing the error that occurs when creating a storage account in violation of policy":::

## Known issues

After anonymous public access is disallowed for a storage account, clients that use the anonymous bearer challenge will find that Azure Storage returns a 403 error (Forbidden) rather than a 401 error (Unauthorized). We recommend that you make all containers private to mitigate this issue.

## Next steps

- [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md)
- [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md)
