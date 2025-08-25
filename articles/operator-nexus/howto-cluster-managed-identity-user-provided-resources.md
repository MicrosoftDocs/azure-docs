---
title: "Azure Operator Nexus Cluster Support for managed identities and user provided resources"
description: Azure Operator Nexus Cluster support for managed identities and user provided resources.
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 6/10/2025
ms.custom: template-how-to
---

# Azure Operator Nexus Cluster support for managed identities and user provided resources

To improve the security of the Operator Nexus platform, managed identities are now supported for Operator Nexus Clusters. Managed identities provide a secure way for applications to access other Azure resources and eliminate the need for users to manage credentials. Additionally, Operator Nexus now has a user provided resource model. In addition to improved security, this shift provides a consistent user experience across the platform.

Managed identities are used with the following user resources provided on Operator Nexus Clusters:

- Storage Accounts used for the output of Bare Metal run-\* commands.
- Key Vaults used for credential rotation.
- Log Analytics Workspaces (LAW) used to capture some metrics.

To learn more about managed identities in Azure, see [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview). Operator Nexus Clusters support multiple User Assigned Managed Identities (UAMI) or one system assigned managed identity (SAMI). A combination of one or more UAMIs and a SAMI is also supported.

While a user can choose to use either managed identity type, UAMIs are recommended. They allow users to preconfigure resources with the appropriate access to the UAMI in advance of Operator Nexus Cluster creation or updating. The same UAMI can be used for all resources, or if users want fine grained access, they can define UAMIs for each resource.

For information on using the API to update Cluster managed identities, see [Update Cluster Identities](#update-cluster-identities-via-apis). 

## Prerequisites

- [Install Azure CLI](https://aka.ms/azcli).
- Install the latest version of the [appropriate Azure CLI extensions](./howto-install-cli-extensions.md).
- Storage Account managed identity support requires the 2024-07-01 or later version of the NetworkCloud API. 
- Key Vault and Log Analytics Workspace managed identity support requires the 2025-02-01 or later version of the NetworkCloud API.

## Operator Nexus Clusters with User Assigned Managed Identities (UAMI)

It's a best practice to first define all of the user provided resources (Storage Account, LAW, and Key Vault), the managed identities associated with those resources and then assign the managed identity the appropriate access to the resource. If these steps aren't done before Cluster creation, the steps need to be completed before Cluster deployment.

The impacts of not configuring these resources for a new Cluster are as follows:

- _Storage Account:_ Cluster creation fails as there's a check to ensure that `commandOutputSettings` exists on the Cluster input.
- _LAW:_ Cluster deployment fails as the LAW (Log Analytics Workplace) is required to install software extensions during deployment.
- _Key Vault:_ Credential rotations fail as there's a check to ensure write access to the user provided Key Vault before performing credential rotation.

Updating the Cluster can be done at any time. Changing the LAW settings causes a brief disruption in sending metrics to the LAW as the extensions which use the LAW needs to be reinstalled.

The following steps should be followed for using UAMIs with Nexus Clusters and associated resources.

1. [Create the UAMI or UAMIs](#create-the-uami-or-uamis)
1. [Create the resources and assign the UAMI to the resources](#create-the-resources-and-assign-the-uami-to-the-resources)
1. [Create or update the Cluster to use User Assigned Managed Identities and user provided resources](#create-or-update-the-nexus-cluster-to-use-user-assigned-managed-identities-and-user-provided-resources)
1. Deploy the Cluster (if new)

### Create the UAMI or UAMIs

1. Create the UAMI or UAMIs for the resources in question. For more information on creating the managed identities, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

### Create the resources and assign the UAMI to the resources

#### Storage Accounts setup

1. Create a storage account, or identify an existing storage account that you want to use. See [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).
1. Create a blob storage container in the storage account. See [Create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).
1. Assign the `Storage Blob Data Contributor` role to users and the UAMI which need access to the run-\* command output. See [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal).
1. To limit access to the Storage Account to a select set of IP or virtual networks, see [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security?tabs=azure-portal).
   1. The IPs for all users executing run-\* commands need to be added to the Storage Account's `Virtual Networks` and/or `Firewall` lists.
   1. Ensure `Allow Azure services on the trusted services list to access this storage account.` under `Exceptions` is selected.

#### Log Analytics Workspaces setup

1. Create a Log Analytics Workspace (LAW), or identify an existing LAW that you want to use. See [Create a Log Analytics Workspace](/azure/azure-monitor/logs/quick-create-workspace).
1. Assign the `Log Analytics Contributor` role to the UAMI for the log analytics workspace. See [Manage access to Log Analytics workspaces](/azure/azure-monitor/logs/manage-access?tabs=portal).

#### Key Vault setup

1. Create a Key Vault, or identify an existing Key Vault that you want to use. See [Create a Key Vault](/azure/key-vault/general/quick-create-cli).
1. Enable the Key Vault for Role Based Access Control (RBAC). See [Enable Azure RBAC permissions on Key Vault](/azure/key-vault/general/rbac-guide?tabs=azure-cli#enable-azure-rbac-permissions-on-key-vault).
1. Assign the `Operator Nexus Key Vault Writer Service Role (Preview)` role to the UAMI for the Key Vault. See [Assign role](/azure/key-vault/general/rbac-guide?tabs=azure-cli#assign-role).
   1. The role definition ID for the Operator Nexus Key Vault Writer Service Role is `44f0a1a8-6fea-4b35-980a-8ff50c487c97`. This format is required if using the Azure command line to do the role assignment.
1. When using a UAMI to access a Key Vault, access to that identity must be provisioned for the Nexus platform. Specifically, `Microsoft.ManagedIdentity/userAssignedIdentities/assign/action` permission needs to be added to the User-assigned identity for the `AFOI-NC-MGMT-PME-PROD` Microsoft Entra ID. It's a known limitation of the platform that will be addressed in the future.
   1. Open the Azure portal and locate the User-assigned identity in question.
   1. Under **Access control (IAM)**, select **Add role assignment**.
   1. Select **Role**: Managed Identity Operator. (See the permissions that the role provides [managed-identity-operator](/azure/role-based-access-control/built-in-roles/identity#managed-identity-operator)).
   1. Assign access to: **User, group, or service principal**.
   1. Select **Member**: AFOI-NC-MGMT-PME-PROD application.
   1. Review and assign.
1. To limit access to the Key Vault to a select set of IP or virtual networks, see [Configure Azure Key Vault firewalls and virtual networks](/azure/key-vault/general/network-security?WT.mc_id=Portal-Microsoft_Azure_KeyVault).
   1. The IPs for all users requiring access to the Key Vault need to be added to the Key Vault's `Virtual Networks` and/or `Firewall` lists.
   1. Ensure the `Allow trusted Microsoft services to bypass this firewall.` under `Exceptions` is selected.

### Create or update the Nexus Cluster to use User Assigned Managed Identities and user provided resources

#### Define the UAMI(S) on the Cluster

When creating or updating a Cluster with a user assigned managed identity, use the `--mi-user-assigned` parameter along with the resource ID of the UAMI. If you wish to specify multiple UAMIs, list the UAMIs' resources IDs with a space between them. Each UAMI that's used for a Key Vault, LAW, or Storage Account must be provided in this list.

When creating the Cluster, you specify the UAMIs in `--mi-user-assigned` and also define the resource settings. Updating the Cluster to set or change a UAMI should also include the resource settings changes to associate the UAMI to the resource.

#### Storage Account settings

The `--command-output-settings` data construct is used to define the Storage Account where run command output is written. It consists of the following fields:

- `container-url`: The URL of the storage account container that is to be used by the specified identities.
- `identity-resource-id`: The user assigned managed identity resource ID to use. Mutually exclusive with a system assigned identity type.
- `identity-type`: The type of managed identity that is being selected. Use `UserAssignedIdentity`.

#### Log Analytics Workspace settings

The `--analytics-output-settings` data construct is used to define the LAW where metrics are sent. It consists of the following fields:

- `analytics-workspace-id`: The resource ID of the analytics workspace that is to be used by the specified identity.
- `identity-resource-id`: The user assigned managed identity resource ID to use. Mutually exclusive with a system assigned identity type
- `identity-type`: The type of managed identity that is being selected. Use `UserAssignedIdentity`.

#### Key Vault settings

The `--secret-archive-settings` data construct is used to define the Key Vault where rotated credentials are written. It consists of the following fields:

- `identity-resource-id`: The user assigned managed identity resource ID to use.
- `identity-type`: The type of managed identity that is being selected. Use `UserAssignedIdentity`.
- `vault-uri`: The URI for the key vault used as the secret archive.

#### Cluster create command examples

_Example 1:_ This example is an abbreviated Cluster create command which uses one UAMI across the Storage Account, LAW, and Key Vault.

```azurecli-interactive
az networkcloud cluster create --name "clusterName" -g "resourceGroupName" \

    ...

    --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI" \
    --command-output-settings identity-type="UserAssignedIdentity" \
      identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI" \
      container-url="https://myaccount.blob.core.windows.net/mycontainer" \
    --analytics-output-settings analytics-workspace-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
      identity-type="UserAssignedIdentity" \
      identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI" \
    --secret-archive-settings vault-uri="https://mykv.vault.azure.net/" \
      identity-type="UserAssignedIdentity" \
      identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI"
```

_Example 2:_ This example is an abbreviated Cluster create command which uses two UAMIs. The Storage Account and LAW use the first UAMI and the Key Vault uses the second.

```azurecli-interactive
az networkcloud cluster create --name "clusterName" -g "resourceGroupName" \

    ...

    --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myFirstUAMI" "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/mySecondUAMI" \
    --command-output-settings identity-type="UserAssignedIdentity" \
      identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myFirstUAMI" \
      container-url="https://myaccount.blob.core.windows.net/mycontainer" \
    --analytics-output-settings analytics-workspace-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
      identity-type="UserAssignedIdentity" \
      identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myFirstUAMI" \
    --secret-archive-settings vault-uri="https://mykv.vault.azure.net/" \
      identity-type="UserAssignedIdentity" \
      identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/mySecondUAMI"
```

#### Cluster update examples

Updating a Cluster is done as a single step. Update the cluster to include the UAMI in the `--mi-user-assigned` field and the corresponding `--identity-resource-id` for the Storage Account, LAW, or Key Vault.

If there are multiple UAMIs in use, the full list of UAMIs must be specified in the `--mi-user-assigned` field when updating. If a SAMI is in use on the Cluster and you're adding a UAMI, you must include `--mi-system-assigned` in the update command. Failure to include existing managed identities causes them to be removed.

For LAW and Key Vault, transitioning from the existing data constructs to the new constructs that use managed identities can be done via a Cluster Update.

_Example 1:_ Add a UAMI to a Cluster and assign the UAMI (`myUAMI`) to the secret archive settings (Key Vault). If this Cluster had a SAMI defined, the SAMI would be removed.

```azurecli-interactive
az networkcloud cluster update --name "clusterName" --resource-group "resourceGroupName" \
   --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI" \
   --secret-archive-settings identity-type="UserAssignedIdentity" \
     identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI" \
     vault-uri="https://keyvaultname.vault.azure.net/"
```

_Example 2:_ Add UAMI `mySecondUAMI` to a Cluster that already has `myFirstUAMI`, which is retained, and update the Cluster to assign `mySecondUAMI` to the command output settings (Storage Account).

```azurecli-interactive
az networkcloud cluster update --name "clusterName" --resource-group "resourceGroupName" \
   --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myFirstUAMI" "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/mySecondUAMI" \
  --command-output-settings identity-type="UserAssignedIdentity" \
    identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/mySecondUAMI" \
    container-url="https://myaccount.blob.core.windows.net/mycontainer"
```

_Example 3:_ Update a Cluster that already has a SAMI and add a UAMI and assign the UAMI to the log analytics output settings (LAW). The SAMI is retained. 

> [!CAUTION]
> Changing the LAW settings causes a brief disruption in sending metrics to the LAW as the extensions which use the LAW might need to be reinstalled.

```azurecli-interactive
az networkcloud cluster update --name "clusterName" --resource-group "resourceGroupName" \
   --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI" \
   --mi-system-assigned \
   --analytics-output-settings analytics-workspace-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
     identity-type="UserAssignedIdentity" \
     identity-resource-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI"
```

### View the principal ID for the User Assigned Managed Identity

The identity resource ID can be found by selecting "JSON view" on the identity resource; the ID is at the top of the panel that appears. The container URL can be found on the Settings -> Properties tab of the container resource.

The CLI can also be used to view the identity and the associated principal ID data within the cluster.

_Example:_

```azurecli-interactive
az networkcloud cluster show --ids /subscriptions/<Subscription ID>/resourceGroups/<Cluster Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Cluster Name>
```

_Output:_

```json
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/subscriptionID/resourcegroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<userAssignedIdentityName>": {
                "clientId": "00001111-aaaa-2222-bbbb-3333cccc4444",
                "principalId": "bbbbbbbb-cccc-dddd-2222-333333333333"
            }
        }
    },
```

## Operator Nexus Clusters with a System Assigned Managed Identity

Using a System Assigned Managed Identity (SAMI) follows a slightly different pattern from UAMIs. While the user provided resources (Storage Account, LAW and Key Vault) should be included in the Cluster creation command or template, the SAMI doesn't exist until the Cluster is created. After Cluster creation, users need to query the Cluster to get the SAMI, assign the correct privileges to the SAMI for each resource before deploying the Cluster.

For a new Cluster, these steps need to be completed before Cluster deployment. The impacts of not configuring these resources by deployment time for a new Cluster are as follows:

- _Storage Account:_ Cluster creation fails as there's a check to ensure that `commandOutputSettings` exists on the Cluster input.
- _LAW:_ Cluster deployment fails as the LAW is required to install software extensions during deployment.
- _Key Vault:_ Credential rotations fail as there's a check to ensure write access to the user provided Key Vault before performing credential rotation.

Updating the Cluster can be done at any time. Changing the LAW settings causes a brief disruption in sending metrics to the LAW as the extensions which use the LAW need to be reinstalled.

The following steps should be followed for using UAMIs with Nexus Clusters and associated resources.

_Cluster Creation_

1. [Create the user provided resources](#create-the-user-provided-resources)
1. [Create the Cluster with a SAMI and specify the resources that use the SAMI](#create-the-cluster-with-a-sami-and-user-provided-resources)
1. [Query the Cluster to get the SAMI](#query-the-cluster-to-get-the-sami)
1. [Update the resources and assign the SAMI to the resources](#update-the-resources-and-assign-the-sami-to-the-resources)
1. Deploy the Cluster

_Cluster Update_

1. [Create the user provided resources](#create-the-user-provided-resources)
1. [Update the Cluster to add a SAMI](#update-the-cluster-to-add-a-sami)
1. [Query the Cluster to get the SAMI](#query-the-cluster-to-get-the-sami)
1. [Update the resources and assign the SAMI to the resources](#update-the-resources-and-assign-the-sami-to-the-resources)
1. [Update the Cluster with the user provided resources information](#update-the-cluster-with-the-user-provided-resources-information)

### Create the user provided resources

This section provides external links for the user resource setup that needs to occur before Cluster creation. 

#### Storage Accounts setup

1. Create a storage account, or identify an existing storage account that you want to use. See [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).
1. Create a blob storage container in the storage account. See [Create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

#### Log Analytics Workspaces setup

1. Create a Log Analytics Workspace (LAW), or identify an existing LAW that you want to use. See [Create a Log Analytics Workspace](/azure/azure-monitor/logs/quick-create-workspace).

#### Key Vault setup

1. Create a Key Vault, or identify an existing Key Vault that you want to use. See [Create a Key Vault](/azure/key-vault/general/quick-create-cli).

### Create the Cluster with a SAMI and user provided resources

When creating a Cluster with a system assigned managed identity, use the `--mi-system-assigned` parameter. The Cluster creation process generates the SAMI information. The user provided resources are also defined at the time of Cluster creation.

#### Storage Account settings

The `--command-output-settings` data construct is used to define the Storage Account where run command output is written. It consists of the following fields:

- `container-url`: The URL of the storage account container that is to be used by the specified identities.
- `identity-resource-id`: Not required when using a SAMI
- `identity-type`: The type of managed identity that is being selected. Use `SystemAssignedIdentity`.

#### Log Analytics Workspace settings

The `--analytics-output-settings` data construct is used to define the LAW where metrics are sent. It consists of the following fields:

- `analytics-workspace-id`: The resource ID of the analytics workspace that is to be used by the specified identity.
- `identity-resource-id`: Not required when using a SAMI
- `identity-type`: The type of managed identity that is being selected. Use `SystemAssignedIdentity`.

#### Key Vault settings

The `--secret-archive-settings` data construct is used to define the Key Vault where rotated credentials are written. It consists of the following fields:

- `identity-resource-id`: Not required when using a SAMI
- `identity-type`: The type of managed identity that is being selected. Use `SystemAssignedIdentity`.
- `vault-uri`: The URI for the key vault used as the secret archive.

#### Cluster create command examples

_Example:_ This example is an abbreviated Cluster create command which specifies a SAMI and uses the SAMI for each of the user provided resources.

```azurecli-interactive
az networkcloud cluster create --name "clusterName" -g "resourceGroupName" \

    ...

   --mi-system-assigned \
   --command-output-settings identity-type="SystemAssignedIdentity" \
    container-url="https://myaccount.blob.core.windows.net/mycontainer"
   --analytics-output-settings analytics-workspace-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
    identity-type="SystemAssignedIdentity" \
   --secret-archive-settings identity-type="SystemAssignedIdentity" \
     vault-uri="https://keyvaultname.vault.azure.net/"
```

### Update the Cluster to add a SAMI

When updating a Cluster with a system assigned managed identity, use the `--mi-system-assigned` parameter. The Cluster update process generates the SAMI information. The user provided resources are updated later to use the SAMI once the appropriate role assignments are made.

> [!IMPORTANT]
> When updating a Cluster with a UAMI or UAMIs in use, you must include the existing UAMIs in the `--mi-user-assigned` identity list when adding a SAMI or updating. If a SAMI is in use on the Cluster and you're adding a UAMI, you must include `--mi-system-assigned` in the update command. Failure to do so causes the respective managed identities to be removed.

These examples are for updating an existing Cluster to add a SAMI.

_Example 1:_ This example updates a Cluster to add a SAMI. Any UAMIs defined on the Cluster are removed.

```azurecli-interactive
az networkcloud cluster update --name "clusterName" -g "resourceGroupName" \
    --mi-system-assigned
```

_Example 2:_ This example updates a Cluster to add a SAMI and keeps the existing UAMI, `myUAMI`.

```azurecli-interactive
az networkcloud cluster update --name "clusterName" -g "resourceGroupName" \
    --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAMI" \
    --mi-system-assigned
```

### Query the Cluster to get the SAMI

The identity resource ID can be found by selecting "JSON view" on the identity resource in the Azure portal.

The CLI can also be used to view the identity and the associated principal ID data within the cluster.

Note the `principalId` of the identity which is used when granting access to the resources.

_Example_:

```azurecli-interactive
az networkcloud cluster show --ids /subscriptions/<Subscription ID>/resourceGroups/<Cluster Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Cluster Name>
```

System-assigned identity example:

```json
    "identity": {
        "principalId": "aaaaaaaa-bbbb-cccc-1111-222222222222",
        "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
        "type": "SystemAssigned"
    },
```

### Update the resources and assign the SAMI to the resources

These updates are applicable post Cluster creation or update to ensure that the SAMI has the appropriate role assignments and the resources are configured properly for Operator Nexus usage.

#### Storage Accounts setup

1. Assign the `Storage Blob Data Contributor` role to users and the SAMI which need access to the run-\* command output. See [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal).
1. To limit access to the Storage Account to a select set of IP or virtual networks, see [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security?tabs=azure-portal).
   1. The IPs for all users executing run-\* commands need to be added to the Storage Account's `Virtual Networks` and/or `Firewall` lists.
   1. Ensure `Allow Azure services on the trusted services list to access this storage account.` under `Exceptions` is selected.

#### Log Analytics Workspaces setup

1. Assign the `Log Analytics Contributor` role to the SAMI for the log analytics workspace. See [Manage access to Log Analytics workspaces](/azure/azure-monitor/logs/manage-access?tabs=portal).

#### Key Vault setup

1. Enable the Key Vault for Role Based Access Control (RBAC). See [Enable Azure RBAC permissions on Key Vault](/azure/key-vault/general/rbac-guide?tabs=azure-cli#enable-azure-rbac-permissions-on-key-vault).
1. Assign the `Operator Nexus Key Vault Writer Service Role (Preview)` role to the SAMI for the Key Vault. See [Assign role](/azure/key-vault/general/rbac-guide?tabs=azure-cli#assign-role).
   1. The role definition ID for the Operator Nexus Key Vault Writer Service Role is `44f0a1a8-6fea-4b35-980a-8ff50c487c97`. This format is required if using the Azure command line to do the role assignment.
1. To limit access to the Key Vault to a select set of IP or virtual networks, see [Configure Azure Key Vault firewalls and virtual networks](/azure/key-vault/general/network-security?WT.mc_id=Portal-Microsoft_Azure_KeyVault).
   1. The IPs for all users requiring access to the Key Vault need to be added to the Key Vault's `Virtual Networks` and/or `Firewall` lists.
   1. Ensure the `Allow trusted Microsoft services to bypass this firewall.` under `Exceptions` is selected.

### Update the Cluster with the user provided resources information

This step is only required after updating a Cluster to add a SAMI and should be performed after updating the resources to assign the SAMI the appropriate role or roles. 

#### Storage Account settings

The `--command-output-settings` data construct is used to define the Storage Account where run command output is written. It consists of the following fields:

- `container-url`: The URL of the storage account container that is to be used by the specified identities.
- `identity-resource-id`: Not required when using a SAMI
- `identity-type`: The type of managed identity that is being selected. Use `SystemAssignedIdentity`.

#### Log Analytics Workspace settings

The `--analytics-output-settings` data construct is used to define the LAW where metrics are sent. It consists of the following fields:

- `analytics-workspace-id`: The resource ID of the analytics workspace that is to be used by the specified identity.
- `identity-resource-id`: Not required when using a SAMI
- `identity-type`: The type of managed identity that is being selected. Use `SystemAssignedIdentity`.

#### Key Vault settings

The `--secret-archive-settings` data construct is used to define the Key Vault where rotated credentials are written. It consists of the following fields:

- `identity-resource-id`: Not required when using a SAMI
- `identity-type`: The type of managed identity that is being selected. Use `SystemAssignedIdentity`.
- `vault-uri`: The URI for the key vault used as the secret archive.

#### Cluster update examples

Updating a Cluster follows the same pattern as create. If you need to change the UAMI for a resource, you must include it in both the `--mi-user-assigned` field and corresponding `--identity-resource-id` for the Storage Account, LAW or Key Vault. If there are multiple UAMIs in use, the full list of UAMIs must be specified in the `--mi-user-assigned` field when updating.

For LAW and Key Vault, transitioning from the existing data constructs to the new constructs that use UAMI can be done via a Cluster Update.

_Example 1:_ Add or update the command output settings (Storage Account) for a Cluster.

```azurecli-interactive
az networkcloud cluster update --name "clusterName" --resource-group "resourceGroupName" \
   --command-output-settings identity-type="SystemAssignedIdentity" \
    container-url="https://myaccount.blob.core.windows.net/mycontainer"
```

_Example 2:_ Add or update the log analytics output settings (LAW) for a Cluster.

> [!CAUTION]
> Changing the LAW settings causes a brief disruption in sending metrics to the LAW as the extensions which use the LAW need to be reinstalled.

```azurecli-interactive
az networkcloud cluster update --name "clusterName" --resource-group "resourceGroupName" \
   --analytics-output-settings analytics-workspace-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
    identity-type="SystemAssignedIdentity" \
```

_Example 3:_ Add or update the secret archive settings (Key Vault) for a Cluster.

```azurecli-interactive
az networkcloud cluster update --name "clusterName" --resource-group "resourceGroupName" \
   --secret-archive-settings identity-type="SystemAssignedIdentity" \
     vault-uri="https://keyvaultname.vault.azure.net/"
```

_Example 4:_ This example combines all three resources using a SAMI into one update.

```azurecli-interactive
az networkcloud cluster update --name "clusterName" --resource-group "resourceGroupName" \
   --command-output-settings identity-type="SystemAssignedIdentity" \
     container-url="https://myaccount.blob.core.windows.net/mycontainer"
   --analytics-output-settings analytics-workspace-id="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
     identity-type="SystemAssignedIdentity" \
   --secret-archive-settings identity-type="SystemAssignedIdentity" \
     vault-uri="https://keyvaultname.vault.azure.net/"
```

## Update Cluster identities via APIs

Cluster managed identities can be assigned via CLI. The unassignment of the identities can be done via API calls.
Note, `<APIVersion>` is the API version 2024-07-01 or newer.

- To remove all managed identities, execute:

  ```azurecli
  az rest --method PATCH --url /subscriptions/$SUB_ID/resourceGroups/$CLUSTER_RG/providers/Microsoft.NetworkCloud/clusters/$CLUSTER_NAME?api-version=<APIVersion> --body "{\"identity\":{\"type\":\"None\"}}"
  ```

- If both User-assigned and System-assigned managed identities were added, the User-assigned can be removed by updating the `type` to `SystemAssigned`:

  ```azurecli
  az rest --method PATCH --url /subscriptions/$SUB_ID/resourceGroups/$CLUSTER_RG/providers/Microsoft.NetworkCloud/clusters/$CLUSTER_NAME?api-version=<APIVersion> --body @~/uai-body.json
  ```

  The request body (uai-body.json) example:

  ```azurecli
  {
    "identity": {
        "type": "SystemAssigned"
    }
  }
  ```

- If both User-assigned and System-assigned managed identities were added, the System-assigned can be removed by updating the `type` to `UserAssigned`:

  ```azurecli
  az rest --method PATCH --url /subscriptions/$SUB_ID/resourceGroups/$CLUSTER_RG/providers/Microsoft.NetworkCloud/clusters/$CLUSTER_NAME?api-version=<APIVersion> --body @~/uai-body.json
  ```

  The request body (uai-body.json) example:

  ```azurecli
  {
    "identity": {
        "type": "UserAssigned",
  	    "userAssignedIdentities": {
  		    "/subscriptions/$SUB_ID/resourceGroups/$UAI_RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$UAI_NAME": {}
  	    }
    }
  }
  ```

- If multiple User-assigned managed identities were added, one of them can be removed by executing:

  ```azurecli
  az rest --method PATCH --url /subscriptions/$SUB_ID/resourceGroups/$CLUSTER_RG/providers/Microsoft.NetworkCloud/clusters/$CLUSTER_NAME?api-version=<APIVersion> --body @~/uai-body.json
  ```

  The request body (uai-body.json) example:

  ```azurecli
  {
    "identity": {
        "type": "UserAssigned",
  	    "userAssignedIdentities": {
  		    "/subscriptions/$SUB_ID/resourceGroups/$UAI_RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$UAI_NAME": null
  	    }
    }
  }
  ```

## Field deprecations and replacements

This section is a reference for the deprecated resource fields and their replacements. All fields are found on the Cluster resource except for the Cluster Manager managed identity used for the deprecated key vault method. This list also assumes that an associated managed identity is defined on the Cluster that corresponds with the managed identity for the resource.

`identity-resource-id` is only required when using a UAMI. It shouldn't be specified if using a SAMI for the resource.

### Storage Account

_**Deprecated Fields:**_ N/A

_**Replacing Fields:**_

```azurecli
command-output-settings:
  container-url
  identity-type
  identity-resource-id
```

_**Notes:**_ Deprecated Fields is N/A because the Cluster Manager storage account gets created automatically today and doesn't require user input.

### Key Vault

_**Deprecated Fields:**_

```azurecli
cluster-secret-archive:
  use-key-vault
  key-vault-id
```

Cluster Manager managed identity

_**Replacing Fields:**_

```azurecli
secret-archive-settings:
  vault-uri
  identity-type
  identity-resource-id
```

_**Notes:**_ `vault-uri` in `secret-archive-settings` is the URI for the Key Vault being specified versus the Azure Resource Manager (ARM) resource ID that is specified for `key-vault-id`. The same managed identity that was specified for the Cluster Manager can be used on the Cluster.

### Log Analytics Workspace

_**Deprecated Fields:**_ `analytics-workspace-id`

_**Replacing Fields:**_

```azurecli
analytics-output-settings:
  analytics-workspace-id
  identity-type
  identity-resource-id
```

_**Notes:**_ The input format (LAW ARM resource ID) is the same between the deprecated `analytics-workspace-id` field and the `analytics-workspace-id` within `analytics-output-settings`.
