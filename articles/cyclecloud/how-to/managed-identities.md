---
title: Using Managed Identities
description: Learn how to use Managed Identities with Azure CycleCloud. Assign roles to cluster VMs with Managed Identity.
author: rokeptne
ms.date: 07/01/2025
ms.author: rokeptne
---

# Using managed identities

Use Microsoft Entra managed identities to give Azure CycleCloud permission to manage clusters in your subscription. This approach serves as an alternative to using a [service principal](service-principals.md). Assign managed identities to CycleCloud VMs to provide access to Azure resources like Storage, Key Vault, or Azure Container Registries.

## CycleCloud VM permissions with managed identity

CycleCloud automates many calls to the Azure Resource Manager to manage HPC clusters. This automation needs certain permissions for CycleCloud. You can give CycleCloud this access by setting up a Service Principal or by assigning a [Managed Identity](/azure/active-directory/managed-identities-azure-resources/overview) to the CycleCloud VM.

We recommend using either a [System-Assigned](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#system-assigned-managed-identity) or [User-Assigned Managed Identity](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) to grant these permissions instead of a Service Principal.

When you install Azure CycleCloud on an Azure VM and assign a Managed Identity to the VM, the **Add Subscription** dialog works a little differently. The dialog enables and preselects the **Managed Identity** authentication option. It also fills in the **Subscription ID** with the subscription for the host VM.

::: moniker range="=cyclecloud-7"
![Add Subscription Managed Identities](../images/version-7/create-account-managed-identity.png)
:::

::: moniker range=">=cyclecloud-8"
![Add Subscription Managed Identities](../images/version-8/add-subscription-managed-identity-8.7.png)
:::

You can still enter the standard set of credentials by selecting the **App Registration** authentication option. When you select this option, the standard fields appear in the form. You can also use a different **Subscription ID**; the provided value is just for convenience.

When you use a System Assigned Managed Identity, leave the ClientID field blank. But when you use CycleCloud with a User-Assigned Managed Identity, set the ClientID to the ClientID of the specific Managed Identity you want for cluster orchestration.

### Storage locker access

In addition to using a managed identity for cluster orchestration on the CycleCloud VM, you can configure CycleCloud to assign a user-assigned managed identity to clusters for storage account and locker access from cluster nodes. This approach uses the user-assigned managed identity instead of SAS tokens derived from the storage account's shared access key.

To configure clusters to use a user-assigned managed identity rather than the shared access key, create a dedicated user-assigned managed identity with **Storage Blob Data Reader** access at the storage account scope. First, create the storage account and user-assigned managed identity in your Azure subscription. Then, in the **Storage Locker Configuration** section of the **Add Subscription** dialog, select the new managed identity from the **Locker Identity** dropdown and the storage account from the **Storage Account** dropdown.

### Create a custom role and managed identity for CycleCloud

The simplest option that provides sufficient access rights is to assign the `Contributor` and `Storage Blob Data Contributor` roles for the subscription to the CycleCloud VM as a system-assigned managed identity. However, the `Contributor` role has a higher privilege level than CycleCloud requires. You can create and assign a [custom role](/azure/role-based-access-control/custom-roles) to the VM. Similarly, assign the `Storage Blob Data Contributor` role at the storage account scope rather than subscription scope if you already created the storage account.

This role covers all CycleCloud features:

:::code language="json" source="../includes/custom-role.json":::

Make sure to replace `<SubscriptionId>` with your subscription ID. You scope this role to a subscription, but you can scope it to a single resource group if you prefer. The name must be unique to the tenant.

> [!IMPORTANT]
> To use a custom role, you need a Microsoft Entra ID P1 license. For more information about licenses, see [Microsoft Entra plans and pricing](https://azure.microsoft.com/pricing/details/active-directory/).

#### Optional permissions

If you're scoping CycleCloud to use a single resource group for each cluster, you can remove the following permissions from `actions`:

```json
          "Microsoft.Resources/subscriptions/resourceGroups/write",
          "Microsoft.Resources/subscriptions/resourceGroups/delete",
```

If you're not using CycleCloud to assign managed identities to the VMs it creates within clusters, you can remove the following permissions from `actions`:

```json
          "Microsoft.Authorization/*/read",
          "Microsoft.Authorization/roleAssignments/*",
          "Microsoft.Authorization/roleDefinitions/*",
```

> [!WARNING]
> Future versions of CycleCloud require the ability to assign managed identities to VMs. We don't recommend removing these permissions.

#### Creating the role

You can create a role from the role definitions by using the [Azure CLI](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli). Use this role to create a role definition within the Azure tenant. When the role exists in the tenant, assign the role to an identity with the proper scope.

The following example shows the basic flow using the Azure CLI.

``` azurecli-interactive
# Create a custom role definition
az role definition create --role-definition role.json
# Create user identity
az identity create --name <name>
# Assign the custom role to the identity with proper scope
az role assignment create --role <CycleCloudRole> --assignee-object-id <identity-id> --scope <subscription>
```

Now the custom role is assigned and scoped to the identity. You can use it with a VM.

## Assigning roles to cluster VMs with managed identity

Cluster nodes often need access to Azure resources. For example, many clusters require access to Azure Storage, Key Vault, or Azure Container Registries to run their workload. We strongly recommend using a [User-Assigned Managed Identity](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) to provide access credentials instead of passing secrets or credentials to the node through cluster configuration.

You can configure user-assigned managed identities on the cluster VMs by using the `Azure.Identities` node property. Set the `Azure.Identities` property to a comma-separated list of managed identity resource ID strings:

``` ini
[cluster sample]
...
    [[node defaults]]
    ...
    Azure.Identities = $ManagedServiceIdentity
...

[parameters Required Settings]
...
  [[parameter ManagedServiceIdentity]]
  ParameterType = Azure.ManagedIdentity
  Label = MSI Identity
  Description = The resource ID of the Managed Service Identity to apply to the nodes
...
```

