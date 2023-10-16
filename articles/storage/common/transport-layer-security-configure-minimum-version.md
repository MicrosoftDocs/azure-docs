---
title: Enforce a minimum required version of Transport Layer Security (TLS) for incoming requests
titleSuffix: Azure Storage
description: Configure a storage account to require a minimum version of Transport Layer Security (TLS) for clients making requests against Azure Storage.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: how-to
ms.date: 12/30/2022
ms.author: akashdubey
ms.reviewer: fryu
ms.subservice: storage-common-concepts
ms.custom: devx-track-azurepowershell, devx-track-azurecli, engagement-fy23
ms.devlang: azurecli
---

# Enforce a minimum required version of Transport Layer Security (TLS) for requests to a storage account

Communication between a client application and an Azure Storage account is encrypted using Transport Layer Security (TLS). TLS is a standard cryptographic protocol that ensures privacy and data integrity between clients and services over the Internet. For more information about TLS, see [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security).

Azure Storage currently supports three versions of the TLS protocol: 1.0, 1.1, and 1.2. Azure Storage uses TLS 1.2 on public HTTPS endpoints, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility.

Azure Storage accounts permit clients to send and receive data with the oldest version of TLS, TLS 1.0, and above. To enforce stricter security measures, you can configure your storage account to require that clients send and receive data with a newer version of TLS. If a storage account requires a minimum version of TLS, then any requests made with an older version will fail.

This article describes how to use a DRAG (Detection-Remediation-Audit-Governance) framework to continuously manage secure TLS for your storage accounts.

For information about how to specify a particular version of TLS when sending a request from a client application, see [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md).

> [!NOTE]
> The cipher suite used when clients send data to and receive data from a storage account is dependent on the TLS version used. It is not possible to configure a storage account to block the use of specific ciphers, other than by requiring a minimum TLS version. If you require the ability to allow only specific cipher suites when connecting to your storage account, consider using Azure Application Gateway. For more information about using Application Gateway for this purpose, see [Configure TLS policy versions and cipher suites on Azure Application Gateway](../../application-gateway/application-gateway-configure-ssl-policy-powershell.md).

## Detect the TLS version used by client applications

When you enforce a minimum TLS version for your storage account, you risk rejecting requests from clients that are sending data with an older version of TLS. To understand how configuring the minimum TLS version may affect client applications, Microsoft recommends that you enable logging for your Azure Storage account and analyze the logs after an interval of time to detect what versions of TLS client applications are using.

To log requests to your Azure Storage account and determine the TLS version used by the client, you can use Azure Storage logging in Azure Monitor. For more information, see [Monitor Azure Storage](../blobs/monitor-blob-storage.md).

Azure Storage logging in Azure Monitor supports using log queries to analyze log data. To query logs, you can use an Azure Log Analytics workspace. To learn more about log queries, see [Tutorial: Get started with Log Analytics queries](../../azure-monitor/logs/log-analytics-tutorial.md).

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the Monitoring section, select **Diagnostic settings**.
1. Select the Azure Storage service for which you want to log requests. For example, choose **Blob** to log requests to Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose which types of requests to log. You can log read, write, and delete requests. For example, choosing **StorageRead** and **StorageWrite** will log read and write requests to the selected service.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media/transport-layer-security-configure-minimum-version/create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests":::

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md).

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs](../blobs/monitor-blob-storage-reference.md#resource-logs).

### Query logged requests by TLS version

Azure Storage logs in Azure Monitor include the TLS version used to send a request to a storage account. Use the **TlsVersion** property to check the TLS version of a logged request.

To determine how many requests were made against Blob storage with different versions of TLS over the past seven days, open your Log Analytics workspace. Next, paste the following query into a new log query and run it. Remember to replace the placeholder values in brackets with your own values:

```kusto
StorageBlobLogs
| where TimeGenerated > ago(7d) and AccountName == "<account-name>"
| summarize count() by TlsVersion
```

The results show the count of the number of requests made with each version of TLS:

:::image type="content" source="media/transport-layer-security-configure-minimum-version/log-analytics-query-version.png" alt-text="Screenshot showing results of log analytics query to return TLS version":::

### Query logged requests by caller IP address and user agent header

Azure Storage logs in Azure Monitor also include the caller IP address and user agent header to help you to evaluate which client applications accessed the storage account. You can analyze these values to decide whether client applications must be updated to use a newer version of TLS, or whether it's acceptable to fail a client's request if it is not sent with the minimum TLS version.

To determine which clients made requests with a version of TLS older than TLS 1.2 over the past seven days, paste the following query into a new log query and run it. Remember to replace the placeholder values in brackets with your own values:

```kusto
StorageBlobLogs
| where TimeGenerated > ago(7d) and AccountName == "<account-name>" and TlsVersion != "TLS 1.2"
| project TlsVersion, CallerIpAddress, UserAgentHeader
```

## Remediate security risks with a minimum version of TLS

When you are confident that traffic from clients using older versions of TLS is minimal, or that it's acceptable to fail requests made with an older version of TLS, then you can begin enforcement of a minimum TLS version on your storage account. Requiring that clients use a minimum version of TLS to make requests against a storage account is part of a strategy to minimize security risks to your data.

> [!IMPORTANT]
> If you are using a service that connects to Azure Storage, make sure that that service is using the appropriate version of TLS to send requests to Azure Storage before you set the required minimum version for a storage account.

### Configure the minimum TLS version for a storage account

To configure the minimum TLS version for a storage account, set the **MinimumTlsVersion** version for the account. This property is available for all storage accounts that are created with the Azure Resource Manager deployment model. For more information about the Azure Resource Manager deployment model, see [Storage account overview](storage-account-overview.md).

The default value of the **MinimumTlsVersion** property is different depending on how you set it. When you create a storage account with the Azure portal, the minimum TLS version is set to 1.2 by default. When you create a storage account with PowerShell, Azure CLI, or an Azure Resource Manager template, the **MinimumTlsVersion** property is not set by default and does not return a value until you explicitly set it.

When the **MinimumTlsVersion** property is not set, its value may be displayed as either **null** or an empty string, depending on the context. The storage account will permit requests sent with TLS version 1.0 or greater if the property is not set.

# [Portal](#tab/portal)

When you create a storage account with the Azure portal, the minimum TLS version is set to 1.2 by default.

To configure the minimum TLS version for an existing storage account with the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Settings**, select **Configuration**.
1. Under **Minimum TLS version**, use the drop-down to select the minimum version of TLS required to access data in this storage account.

    :::image type="content" source="media/transport-layer-security-configure-minimum-version/configure-minimum-version-portal.png" alt-text="Screenshot showing how to configure minimum version of TLS in the Azure portal." lightbox="media/transport-layer-security-configure-minimum-version/configure-minimum-version-portal.png":::

# [PowerShell](#tab/powershell)

To configure the minimum TLS version for a storage account with PowerShell, install [Azure PowerShell version 4.4.0](https://www.powershellgallery.com/packages/Az/4.4.0) or later. Next, configure the **MinimumTLSVersion** property for a new or existing storage account. Valid values for **MinimumTlsVersion** are `TLS1_0`, `TLS1_1`, and `TLS1_2`.

The following example creates a storage account and sets the **MinimumTLSVersion** to TLS 1.1, then updates the account and sets the **MinimumTLSVersion** to TLS 1.2. The example also retrieves the property value in each case. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$location = "<location>"

# Create a storage account with MinimumTlsVersion set to TLS 1.1.
New-AzStorageAccount -ResourceGroupName $rgName `
    -Name $accountName `
    -Location $location `
    -SkuName Standard_GRS `
    -AllowBlobPublicAccess $false `
    -MinimumTlsVersion TLS1_1

# Read the MinimumTlsVersion property.
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).MinimumTlsVersion

# Update the MinimumTlsVersion version for the storage account to TLS 1.2.
Set-AzStorageAccount -ResourceGroupName $rgName `
    -Name $accountName `
    -MinimumTlsVersion TLS1_2

# Read the MinimumTlsVersion property.
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).MinimumTlsVersion
```

# [Azure CLI](#tab/azure-cli)

To configure the minimum TLS version for a storage account with Azure CLI, install Azure CLI version 2.9.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **minimumTlsVersion** property for a new or existing storage account. Valid values for **minimumTlsVersion** are `TLS1_0`, `TLS1_1`, and `TLS1_2`.

The following example creates a storage account and sets the **minimumTLSVersion** to TLS 1.1. It then updates the account and sets the **minimumTLSVersion** property to TLS 1.2. The example also retrieves the property value in each case. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --kind StorageV2 \
    --location <location> \
    --allow-blob-public-access false \
    --min-tls-version TLS1_1

az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query minimumTlsVersion \
    --output tsv

az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --min-tls-version TLS1_2

az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query minimumTlsVersion \
    --output tsv
```

# [Template](#tab/template)

To configure the minimum TLS version for a storage account with a template, create a template with the **MinimumTLSVersion** property set to `TLS1_0`, `TLS1_1`, or `TLS1_2`. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose **Create a resource**.
1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
1. Choose **Template deployment (deploy using custom templates)**, choose **Create**, and then choose **Build your own template in the editor**.
1. In the template editor, paste in the following JSON to create a new account and set the minimum TLS version to TLS 1.2. Remember to replace the placeholders in angle brackets with your own values.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {
            "storageAccountName": "[concat(uniqueString(subscription().subscriptionId), 'tls')]"
        },
        "resources": [
            {
            "name": "[variables('storageAccountName')]",
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-06-01",
            "location": "<location>",
            "properties": {
                "minimumTlsVersion": "TLS1_2"
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
1. Specify resource group parameter, then choose the **Review + create** button to deploy the template and create a storage account with the **MinimumTLSVersion** property configured.

---

> [!NOTE]
> After you update the minimum TLS version for the storage account, it may take up to 30 seconds before the change is fully propagated.

Configuring the minimum TLS version requires version 2019-04-01 or later of the Azure Storage resource provider. For more information, see [Azure Storage Resource Provider REST API](/rest/api/storagerp/).

### Check the minimum required TLS version for multiple accounts

To check the minimum required TLS version across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the minimum TLS version for each account:

```kusto
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend minimumTlsVersion = parse_json(properties).minimumTlsVersion
| project subscriptionId, resourceGroup, name, minimumTlsVersion
```

### Test the minimum TLS version from a client

To test that the minimum required TLS version for a storage account forbids calls made with an older version, you can configure a client to use an older version of TLS. For more information about configuring a client to use a specific version of TLS, see [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md).

When a client accesses a storage account using a TLS version that does not meet the minimum TLS version configured for the account, Azure Storage returns error code 400 error (Bad Request) and a message indicating that the TLS version that was used is not permitted for making requests against this storage account.

> [!NOTE]
> When you configure a minimum TLS version for a storage account, that minimum version is enforced at the application layer. Tools that attempt to determine TLS support at the protocol layer may return TLS versions in addition to the minimum required version when run directly against the storage account endpoint.

## Use Azure Policy to audit for compliance

If you have a large number of storage accounts, you may want to perform an audit to make sure that all accounts are configured for the minimum version of TLS that your organization requires. To audit a set of storage accounts for their compliance, use Azure Policy. Azure Policy is a service that you can use to create, assign, and manage policies that apply rules to Azure resources. Azure Policy helps you to keep those resources compliant with your corporate standards and service level agreements. For more information, see [Overview of Azure Policy](../../governance/policy/overview.md).

### Create a policy with an Audit effect

Azure Policy supports effects that determine what happens when a policy rule is evaluated against a resource. The Audit effect creates a warning when a resource is not in compliance, but does not stop the request. For more information about effects, see [Understand Azure Policy effects](../../governance/policy/concepts/effects.md).

To create a policy with an Audit effect for the minimum TLS version with the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
1. Under the **Authoring** section, select **Definitions**.
1. Select **Add policy definition** to create a new policy definition.
1. For the **Definition location** field, select the **More** button to specify where the audit policy resource is located.
1. Specify a name for the policy. You can optionally specify a description and category.
1. Under **Policy rule**, add the following policy definition to the **policyRule** section.

    ```json
    {
      "policyRule": {
        "if": {
          "allOf": [
            {
              "field": "type",
              "equals": "Microsoft.Storage/storageAccounts"
            },
            {
                "anyOf": [
                  {
                    "field": "Microsoft.Storage/storageAccounts/minimumTlsVersion",
                    "notEquals": "TLS1_2"
                  },
                  {
                    "field": "Microsoft.Storage/storageAccounts/minimumTlsVersion",
                    "exists": "false"
                  }
                ]
            }
          ]
        },
        "then": {
          "effect": "audit"
        }
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

    :::image type="content" source="media/transport-layer-security-configure-minimum-version/compliance-report-policy-portal.png" alt-text="Screenshot showing compliance report for audit policy for minimum TLS version":::

## Use Azure Policy to enforce the minimum TLS version

Azure Policy supports cloud governance by ensuring that Azure resources adhere to requirements and standards. To enforce a minimum TLS version requirement for the storage accounts in your organization, you can create a policy that prevents the creation of a new storage account that sets the minimum TLS requirement to an older version of TLS than that which is dictated by the policy. This policy will also prevent all configuration changes to an existing account if the minimum TLS version setting for that account is not compliant with the policy.

The enforcement policy uses the Deny effect to prevent a request that would create or modify a storage account so that the minimum TLS version no longer adheres to your organization's standards. For more information about effects, see [Understand Azure Policy effects](../../governance/policy/concepts/effects.md).

To create a policy with a Deny effect for a minimum TLS version that is less than TLS 1.2, follow the same steps described in [Use Azure Policy to audit for compliance](#use-azure-policy-to-audit-for-compliance), but provide the following JSON in the **policyRule** section of the policy definition:

```json
{
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.Storage/storageAccounts"
        },
        {
            "anyOf": [
              {
                "field": "Microsoft.Storage/storageAccounts/minimumTlsVersion",
                "notEquals": "TLS1_2"
              },
              {
                "field": "Microsoft.Storage/storageAccounts/minimumTlsVersion",
                "exists": "false"
              }
            ]
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  }
}
```

After you create the policy with the Deny effect and assign it to a scope, a user cannot create a storage account with a minimum TLS version that is older than 1.2. Nor can a user make any configuration changes to an existing storage account that currently requires a minimum TLS version that is older than 1.2. Attempting to do so results in an error. The required minimum TLS version for the storage account must be set to 1.2 to proceed with account creation or configuration.

The following image shows the error that occurs if you try to create a storage account with the minimum TLS version set to TLS 1.0 (the default for a new account) when a policy with a Deny effect requires that the minimum TLS version is set to TLS 1.2.

:::image type="content" source="media/transport-layer-security-configure-minimum-version/deny-policy-error.png" alt-text="Screenshot showing the error that occurs when creating a storage account in violation of policy":::

## Permissions necessary to require a minimum version of TLS

To set the **MinimumTlsVersion** property for the storage account, a user must have permissions to create and manage storage accounts. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.Storage/storageAccounts/write** or **Microsoft.Storage/storageAccounts/\*** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

These roles do not provide access to data in a storage account via Microsoft Entra ID. However, they include the **Microsoft.Storage/storageAccounts/listkeys/action**, which grants access to the account access keys. With this permission, a user can use the account access keys to access all data in a storage account.

Role assignments must be scoped to the level of the storage account or higher to permit a user to require a minimum version of TLS for the storage account. For more information about role scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create a storage account or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create and manage storage accounts. For more information, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

## Network considerations

When a client sends a request to storage account, the client establishes a connection with the public endpoint of the storage account first, before processing any requests. The minimum TLS version setting is checked after the connection is established. If the request uses an earlier version of TLS than that specified by the setting, the connection will continue to succeed, but the request will eventually fail. For more information about public endpoints for Azure Storage, see [Resource URI syntax](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#resource-uri-syntax).

## Next steps

- [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md)
- [Security recommendations for Blob storage](../blobs/security-recommendations.md)
