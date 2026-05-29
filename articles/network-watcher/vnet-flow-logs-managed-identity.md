---
title: Managed Identity for Virtual Network Flow Logs
titleSuffix: Azure Network Watcher
description: Learn how managed identity simplifies authentication for virtual network flow logs by eliminating manual credential management and enabling secure access to Azure resources.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date: 11/18/2025

# Customer intent: As an Azure administrator, I want to enable managed identity for virtual network flow logs so that I can securely authenticate and manage resources without storing or rotating credentials.
---

# Managed identity for virtual network flow logs

Managed identities enable secure and credential-free access to Azure services by providing an automatically managed identity in Microsoft Entra ID. These identities can be used to authenticate to services that support Microsoft Entra authentication, without the need to manage credentials in code. For more information, see [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

Virtual network flow logs can *use user-assigned managed identities* to securely authenticate to the storage account where flow logs are stored. This approach eliminates the need to embed credentials in scripts or configuration files, reducing the risk of credential leakage and simplifying operational management.

## Benefits of using managed identity with virtual network flow logs

Using managed identities with virtual network flow logs offers several advantages:

- Administrators can securely grant access to the storage account using role-based access control (RBAC).
- Identity management is centralized through Microsoft Entra ID.
- Beneficial in large-scale environments where flow logs are enabled across multiple virtual networks.

### Integration with traffic analytics

Traffic analytics benefits from user-assigned managed identities by enabling secure ingestion of flow logs into the Log Analytics workspace without the need to manage credentials. This approach:

- Streamlines access control for automated deployments.
- Aligns with Zero Trust principles.
- Enhances overall security posture.

## Prerequisites

- A virtual network with flow logs enabled. For more information, see [Create virtual network flow logs](vnet-flow-logs-manage.md?tabs=powershell#create-a-flow-log).

- An Azure storage account. For more information, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-powershell).

- A Log Analytics workspace for traffic analytics. For more information, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-powershell).

- A user-assigned managed identity. For more information, see [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-powershell).

- *Storage Blob Data Contributor* role assigned to the managed identity. For more information, see [Grant a managed identity access to a resource](/entra/identity/managed-identities-azure-resources/grant-managed-identity-resource-access-powershell).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

## Use a user-assigned managed identity with virtual network flow logs

To create a new virtual network flow log using a user-assigned managed identity, use the [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog) cmdlet with the parameter `-UserAssignedIdentityId`.


```azurepowershell-interactive
New-AzNetworkWatcherFlowLog -Enabled $true -Name <FLOW LOG NAME> -NetworkWatcherName NetworkWatcher_{REGION} -ResourceGroupName NetworkWatcherRG  -StorageId <STORAGE ID> -TargetResourceId <VNET ID> -UserAssignedIdentityId <USER ASSIGNED MANAGED IDENTITY ID>
```

To associate or dissociate a user-assigned managed identity to an existing virtual network flow log, use the [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog) cmdlet with the parameter `-UserAssignedIdentityId`.

```azurepowershell-interactive
# Associate a user-assigned managed identity to an existing flow log
Set-AzNetworkWatcherFlowLog -Enabled $true -Name <FLOW LOG NAME> -NetworkWatcherName NetworkWatcher_<REGION> -ResourceGroupName NetworkWatcherRG  -StorageId <STORAGE ID> -TargetResourceId <VNET ID> -UserAssignedIdentityId <USER ASSIGNED MANAGED IDENTITY ID>
```

```azurepowershell-interactive
# Dissociate a user-assigned managed identity from an existing flow log
Set-AzNetworkWatcherFlowLog -Enabled $true -Name <FLOW LOG NAME> -NetworkWatcherName NetworkWatcher_<REGION> -ResourceGroupName NetworkWatcherRG  -StorageId <STORAGE ID> -TargetResourceId <VNET ID> -UserAssignedIdentityId {None}
```

## Related content

- [Tutorial: Log network traffic to and from a virtual network using the Azure portal](vnet-flow-logs-tutorial.md)
- [Create, change, enable, disable, or delete virtual network flow logs](vnet-flow-logs-manage.md)
- [Traffic analytics overview](traffic-analytics.md)

