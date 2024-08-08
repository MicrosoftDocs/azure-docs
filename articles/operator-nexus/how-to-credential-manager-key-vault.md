---
title: Set up customer provided Key Vault for Managed Credential rotation
description: Step by step guide on setting up a key vault for managing and rotating credentials used within Azure Operator Nexus Cluster resource.
author: ghugo
ms.author: gagehugo
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/24/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Set up Key Vault for Managed Credential Rotation in Operator Nexus

Azure Operator Nexus utilizes secrets and certificates to manage component security across the platform. The Operator Nexus platform handles the rotation of these secrets and certificates. By default, Operator Nexus stores the credentials in a managed Key Vault. To keep the rotated credentials in their own Key Vault, the user has to set up the Key Vault for the Azure Operator Nexus instance. Once created, the user needs to add a role assignment on the Customer Key Vault to allow the Operator Nexus Platform to write updated credentials, and additionally link the Customer Key Vault to the Nexus Cluster Resource.

## Prerequisites

- Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
- Get the *Subscription ID* for the customer's subscription

> [!NOTE]
> A single Key Vault can be used for any number of clusters.

## Configure Managed Identity for Cluster Manager

Beginning with the 2024-06-01-public-preview API, managed identities are used in the Cluster Manager for write access to rotated credentials to a key vault. The Cluster Manager identity can be system-assigned or [user-assigned](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities), and can be managed directly via APIs or via CLI.

These examples describe how to configure a managed identity for a Cluster Manager.

- Create or update Cluster Manager with system-assigned identity
```
        az networkcloud clustermanager create --name "clusterManagerName" --location "location" \
        --analytics-workspace-id "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
        --fabric-controller-id "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/fabricControllerName" \
        --managed-resource-group-configuration name="my-managed-rg" --tags key1="myvalue1" key2="myvalue2" --resource-group "resourceGroupName" --mi-system-assigned
```

- Create or update Cluster Manager with user-assigned identity
```
        az networkcloud clustermanager create --name <Cluster Manager Name> --location <Location> \
        --analytics-workspace-id "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
        --fabric-controller-id "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/fabricControllerName" \
        --managed-resource-group-configuration name="my-managed-rg" --tags key1="myvalue1" key2="myvalue2" \
        --resource-group <Resource Group Name> --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAI
```

- Add system assigned identity to Cluster Manager
```
        az networkcloud clustermanager update --name <Cluster Manager Name> --resource-group <Resource Group Name> --mi-system-assigned
```

- Add user assigned identity to Cluster Manager
```
        az networkcloud clustermanager update --name <Cluster Manager Name> --resource-group <Resource Group Name> \
        --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAI"
```

## Get the Principal ID for the Managed Identity

Once a managed identity is configured, use the CLI to view the identity and the associated principal ID data within the cluster manager.

Example:

```console
az networkcloud clustermanager show --ids /subscriptions/<Subscription ID>/resourceGroups/<Cluster Manager Resource Group Name>/providers/Microsoft.NetworkCloud/clusterManagers/<Cluster Manager Name>
```

System-assigned identity example:
```
    "identity": {
        "principalId": "2cb564c1-b4e5-4c71-bbc1-6ae259aa5f87",
        "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
        "type": "SystemAssigned"
    },
```

User-assigned identity example:
```
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/<subscriptionID>/resourcegroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<userAssignedIdentityName>": {
                "clientId": "e67dd610-99cf-4853-9fa0-d236b214e984",
                "principalId": "8e6d23d6-bb6b-4cf3-a00f-4cd640ab1a24"
            }
        }
    },
```

## Using App IDs for Key Vault Access

> [!IMPORTANT]
> Use of App IDs for Customer Key Vault access is deprecated and support will be removed in a future version. It is recommended to use managed identity principals.

Instead of managed identities, the following application IDs grant access to the Key Vault.

- Ensure that the *Microsoft.NetworkCloud* resource provider is registered with the customer subscription.

```console
az provider register --namespace 'Microsoft.NetworkCloud' --subscription <Subscription ID>
```

- When assigned role access to the key vault, use the following App IDs as principal IDs.

| Environment | App Name              | App ID                               |
|:------------|:----------------------|:-------------------------------------|
| Production  | AFOI-NC-RP-PME-PROD   | 05cf5e27-931d-47ad-826d-cb9028d8bd7a |
| Production  | AFOI-NC-MGMT-PME-PROD | 3365d4ea-bb16-4bc9-86dd-f2c8cf6f1f56 |

## Writing Credential Updates to a Customer Key Vault on Nexus Cluster

- Assign the *Operator Nexus Key Vault Writer Service Role*. Ensure that *Azure role-based access control* is selected as the permission model for the key vault on the *Access configuration* view. Then from the *Access Control* view, select to add a role assignment.

| Role Name                                              | Role Definition ID                   |
|:-------------------------------------------------------|:-------------------------------------|
| Operator Nexus Key Vault Writer Service Role (Preview) | 44f0a1a8-6fea-4b35-980a-8ff50c487c97 |

Example:

```console
az role assignment create --assignee <Managed Identity Principal Id> --role 44f0a1a8-6fea-4b35-980a-8ff50c487c97 --scope /subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.KeyVault/vaults/<Key Vault Name>
```

- User associates the Customer Key Vault with the Operator Nexus cluster. The key vault resource ID must be configured in the cluster and enabled to store the secrets of the cluster.

Example:

```console
# Set and enable Customer Key Vault on Nexus cluster
az networkcloud cluster update --ids /subscriptions/<subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Nexus Cluster Name> --secret-archive "{key-vault-id:<Key Vault Resource ID>,use-key-vault:true}"

# Show Customer Key Vault setting (secretArchive) on the Nexus cluster
az networkcloud cluster show --ids /subscriptions/<subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Nexus Cluster Name> --query secretArchive
```

For more help:

```console
az networkcloud cluster update --secret-archive ?? --help
```
