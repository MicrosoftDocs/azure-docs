---
title: Prevent object replication across Azure Active Directory tenants
titleSuffix: Azure Storage
description: Prevent cross-tenant object replication
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 04/06/2023
ms.author: normesta
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Prevent object replication across Azure Active Directory tenants

Object replication asynchronously copies block blobs from a container in one storage account to a container in another storage account. When you configure an object replication policy, you specify the source account and container and the destination account and container. After the policy is configured, Azure Storage automatically copies the results of create, update, and delete operations on a source object to the destination object. For more information about object replication in Azure Storage, see [Object replication for block blobs](object-replication-overview.md).

By default, an authorized user is permitted to configure an object replication policy where the source account is in one Azure Active Directory (Azure AD) tenant and the destination account is in a different tenant. If your security policies require that you restrict object replication to storage accounts that reside within the same tenant only, you can disallow the creation of policies where the source and destination accounts are in different tenants. By default, cross-tenant object replication is enabled for a storage account unless you explicitly disallow it.

This article describes how to remediate cross-tenant object replication for your storage accounts. It also describes how to create policies to enforce a prohibition on cross-tenant object replication for new and existing storage accounts.

For more information on how to configure object replication policies, including cross-tenant policies, see [Configure object replication for block blobs](object-replication-configure.md).

## Remediate cross-tenant object replication

To prevent object replication across Azure AD tenants, set the **AllowCrossTenantReplication** property for the storage account to **false**. If a storage account does not currently participate in any cross-tenant object replication policies, then setting the **AllowCrossTenantReplication** property to *false* prevents future configuration of cross-tenant object replication policies with this storage account as the source or destination. However, if a storage account currently participates in one or more cross-tenant object replication policies, then setting the **AllowCrossTenantReplication** property to *false* is not permitted until you delete the existing cross-tenant policies.

Cross-tenant policies are permitted by default for a storage account. However, the **AllowCrossTenantReplication** property is not set by default for a new or existing storage account and does not return a value until you explicitly set it. The storage account can participate in object replication policies across tenants when the property value is either **null** or **true**. Setting the **AllowCrossTenantReplication** property does not incur any downtime on the storage account.

### Remediate cross-tenant replication for a new account

To disallow cross-tenant replication for a new storage account, use the Azure portal, PowerShell, or Azure CLI.

#### [Portal](#tab/portal)

To disallow cross-tenant object replication for a new storage account, follow these steps:

1. In the Azure portal, navigate to the **Storage accounts** page, and select **Create**.
1. Fill out the **Basics** tab for the new storage account.
1. On the **Advanced** tab, in the **Blob storage** section, locate the **Allow cross-tenant replication** setting, and uncheck the box.

    :::image type="content" source="media/object-replication-prevent-cross-tenant-policies/disallow-cross-tenant-object-replication-portal-create-account.png" alt-text="Screenshot showing how to disallow cross-tenant object replication for a new storage account":::

1. Complete the process of creating the account.

#### [PowerShell](#tab/azure-powershell)

To disallow cross-tenant object replication for a new storage account, call the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command, and include the `AllowCrossTenantReplication` parameter with a value of *$false*.

```azurepowershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$location = "<location>"

# Create a storage account and disallow cross-tenant replication.
New-AzStorageAccount -ResourceGroupName $rgName `
    -Name $accountName `
    -Location $location `
    -SkuName Standard_LRS `
    -AllowBlobPublicAccess $false `
    -AllowCrossTenantReplication $false

# Read the property for the new storage account
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).AllowCrossTenantReplication
```

#### [Azure CLI](#tab/azure-cli)

To disallow cross-tenant object replication for a new storage account, call the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command, and include the `allow-cross-tenant-replication` parameter with a value of *false*.

```azurecli
# Create a storage account with cross-tenant replication disallowed.
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --location <location> \
    --sku Standard_LRS \
    --allow-blob-public-access false \
    --allow-cross-tenant-replication false

# Read the property for the new storage account
az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query allowCrossTenantReplication \
    --output tsv
```

---

### Remediate cross-tenant replication for an existing account

To disallow cross-tenant replication for an existing storage account, use the Azure portal, PowerShell, or Azure CLI.

#### [Azure portal](#tab/portal)

To disallow cross-tenant object replication for an existing storage account that is not currently participating in any cross-tenant policies, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Data management**, select **Object replication**.
1. Select **Advanced settings**.
1. Uncheck **Allow cross-tenant replication**. By default, this box is checked, because cross-tenant object replication is permitted for a storage account unless you explicitly disallow it.

    :::image type="content" source="media/object-replication-prevent-cross-tenant-policies/disallow-cross-tenant-object-replication-portal-update-account.png" alt-text="Screenshot showing how to disallow cross-tenant object replication for an existing storage account":::

1. Select **OK** to save your changes.

If the storage account is currently participating in one or more cross-tenant replication policies, you will not be able to disallow cross-tenant object replication until you delete those policies. In this scenario, the setting is unavailable in the Azure portal, as shown in the following image.

:::image type="content" source="media/object-replication-prevent-cross-tenant-policies/cross-tenant-object-replication-policies-in-effect-portal.png" alt-text="Screenshot":::

#### [PowerShell](#tab/azure-powershell)

To disallow cross-tenant object replication for an existing storage account that is not currently participating in any cross-tenant policies, first install the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage)\, version 3.7.0 or later. Next, configure the **AllowCrossTenantReplication** property for the storage account.

The following example shows how to disallow cross-tenant object replication for an existing storage account with PowerShell. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"

Set-AzStorageAccount -ResourceGroupName $rgName `
    -AccountName $accountName `
    -AllowCrossTenantReplication $false
```

If the storage account is currently participating in one or more cross-tenant replication policies, you will not be able to disallow cross-tenant object replication until you delete those policies. PowerShell provides an error indicating that the operation failed due to existing cross-tenant replication policies.

#### [Azure CLI](#tab/azure-cli)

To disallow cross-tenant object replication for an existing storage account that is not currently participating in any cross-tenant policies, first install Azure CLI version 2.24.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **allowCrossTenantReplication** property for a new or existing storage account.

The following example shows how to disallow cross-tenant object replication for an existing storage account with Azure CLI. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --allow-cross-tenant-replication false
```

If the storage account is currently participating in one or more cross-tenant replication policies, you will not be able to disallow cross-tenant object replication until you delete those policies. Azure CLI provides an error indicating that the operation failed due to existing cross-tenant replication policies.

---

After you disallow cross-tenant replication, attempting to configure a cross-tenant policy with the storage account as the source or destination fails. Azure Storage returns an error indicating that cross-tenant object replication is not permitted for the storage account.

When cross-tenant object replication is disallowed for a storage account, then any new object replication policies that you create with that account must include the full Azure Resource Manager IDs for the source and destination account. Azure Storage requires the full resource ID to verify whether the source and destination accounts reside within the same tenant. For more information, see [Specify full resource IDs for the source and destination accounts](object-replication-overview.md#specify-full-resource-ids-for-the-source-and-destination-accounts).

The **AllowCrossTenantReplication** property is supported for storage accounts that use the Azure Resource Manager deployment model only. For information about which storage accounts use the Azure Resource Manager deployment model, see [Types of storage accounts](../common/storage-account-overview.md#types-of-storage-accounts).

## Permissions for allowing or disallowing cross-tenant replication

To set the **AllowCrossTenantReplication** property for a storage account, a user must have permissions to create and manage storage accounts. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.Storage/storageAccounts/write** or **Microsoft.Storage/storageAccounts/\*** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

These roles do not provide access to data in a storage account via Azure Active Directory (Azure AD). However, they include the **Microsoft.Storage/storageAccounts/listkeys/action**, which grants access to the account access keys. With this permission, a user can use the account access keys to access all data in a storage account.

Role assignments must be scoped to the level of the storage account or higher to permit a user to allow or disallow cross-tenant object replication for the storage account. For more information about role scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create a storage account or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create and manage storage accounts. For more information, see [Azure roles, Azure AD roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

## Use Azure Policy to audit for compliance

If you have a large number of storage accounts, you may want to perform an audit to make sure that those accounts are configured to prevent cross-tenant object replication. To audit a set of storage accounts for their compliance, use Azure Policy. Azure Policy is a service that you can use to create, assign, and manage policies that apply rules to Azure resources. Azure Policy helps you to keep those resources compliant with your corporate standards and service level agreements. For more information, see [Overview of Azure Policy](../../governance/policy/overview.md).

### Create a policy with an Audit effect

Azure Policy supports effects that determine what happens when a policy rule is evaluated against a resource. The Audit effect creates a warning when a resource is not in compliance, but does not stop the request. For more information about effects, see [Understand Azure Policy effects](../../governance/policy/concepts/effects.md).

To create a policy with an Audit effect for the cross-tenant object replication setting for a storage account with the Azure portal, follow these steps:

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
              "field":"Microsoft.Storage/storageAccounts/allowCrossTenantReplication",
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

After you've assigned the policy, you can view the compliance report. The compliance report for an audit policy provides information on which storage accounts are still permitting cross-tenant object replication policies. For more information, see [Get policy compliance data](../../governance/policy/how-to/get-compliance-data.md).

It may take several minutes for the compliance report to become available after the policy assignment is created.

To view the compliance report in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the Azure Policy service.
1. Select **Compliance**.
1. Filter the results for the name of the policy assignment that you created in the previous step. The report shows resources that are not in compliance with the policy.
1. You can drill down into the report for additional details, including a list of storage accounts that are not in compliance.

    :::image type="content" source="media/object-replication-prevent-cross-tenant-policies/compliance-report-cross-tenant-audit-effect-policy.png" alt-text="Screenshot showing compliance report for audit policy for blob cross-tenant object replication":::

## Use Azure Policy to enforce same-tenant replication policies

Azure Policy supports cloud governance by ensuring that Azure resources adhere to requirements and standards. To ensure that storage accounts in your organization disallow cross-tenant replication, you can create a policy that prevents the creation of a new storage account that allows cross-tenant object replication policies. The enforcement policy uses the Deny effect to prevent a request that would create or modify a storage account to allow cross-tenant object replication. The Deny policy will also prevent all configuration changes to an existing account if the cross-tenant object replication setting for that account is not compliant with the policy. For more information about the Deny effect, see [Understand Azure Policy effects](../../governance/policy/concepts/effects.md).

To create a policy with a Deny effect for cross-tenant object replication, follow the same steps described in [Use Azure Policy to audit for compliance](#use-azure-policy-to-audit-for-compliance), but provide the following JSON in the **policyRule** section of the policy definition:

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
          "field":"Microsoft.Storage/storageAccounts/allowCrossTenantReplication",
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

After you create the policy with the Deny effect and assign it to a scope, a user cannot create a storage account that allows cross-tenant object replication. Nor can a user make any configuration changes to an existing storage account that currently allows cross-tenant object replication. Attempting to do so results in an error. The **AllowCrossTenantReplication** property for the storage account must be set to **false** to proceed with account creation or configuration updates, in compliance with the policy.

The following image shows the error that occurs if you try to create a storage account that allows cross-tenant object replication (the default for a new account) when a policy with a Deny effect requires that cross-tenant object replication is disallowed.

:::image type="content" source="media/object-replication-prevent-cross-tenant-policies/disallow-cross-tenant-replication-deny-policy-error-portal.png" alt-text="Screenshot showing the error that occurs when creating a storage account in violation of policy":::

## See also

- [Object replication for block blobs](object-replication-overview.md)
- [Configure object replication for block blobs](object-replication-configure.md)
- [Security recommendations for Blob storage](security-recommendations.md)
