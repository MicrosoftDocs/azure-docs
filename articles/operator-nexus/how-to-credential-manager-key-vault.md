---
title: Set up customer provided Key Vault for Managed Credential rotation
description: Step by step guide on setting up a key vault for managing and rotating credentials used within Azure Operator Nexus Cluster resource.
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/5/2025
ms.custom: template-how-to, devx-track-azurecli
---

# Set up Key Vault for Managed Credential Rotation in Operator Nexus

Azure Operator Nexus utilizes secrets and certificates to manage component security across the platform. The Operator Nexus platform handles the rotation of these secrets and certificates. By default, Operator Nexus stores the credentials in a managed Key Vault. To keep the rotated credentials in their own Key Vault, the user must configure their own Key Vault to receive rotated credentials. This configuration requires the user to configure the Key Vault for the Azure Operator Nexus instance. Once created, the user needs to add a role assignment on the Customer Key Vault to allow the Operator Nexus Platform to write updated credentials, and additionally link the Customer Key Vault to the Nexus Cluster Resource.

## Prerequisites

- Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
- Get the _Subscription ID_ for the customer's subscription

> [!NOTE]
> A single Key Vault can be used for any number of clusters.

## Configure Key Vault Using Managed Identity for the Cluster

> [!NOTE]
> The managed identity functionality for Key Vault and Cluster managed identity exists with the 2024-10-01-preview API and will be available with the 2025-02-01 GA API.

See [Azure Operator Nexus Cluster support for managed identities and user provided resources](./howto-cluster-managed-identity-user-provided-resources.md)

## Configure Key Vault Using Managed Identity for Cluster Manager

> [!NOTE]
> This method is deprecated with the roll out of the 2025-02-01 GA API. A transition period is in place to support migration, but existing users should look to migrate to using the Cluster managed identity. Once a Cluster is updated to use the Secret Archive Settings and the Cluster managed identity, the Cluster Manager managed identity is ignored for credential rotation.

Beginning with the 2024-07-01 API version, managed identities in the Cluster Manager are used for write access to deliver rotated credentials to a key vault. The Cluster Manager identity can be system-assigned or [user-assigned](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities), and can be managed directly via APIs or via CLI.

For information on assigning managed identities to the Cluster Manager, see [Cluster Manager Identity](./howto-cluster-manager.md#cluster-manager-identity)

### Configure Nexus Cluster Secret Archive

Register the Customer Key Vault as the secret archive for the Nexus cluster. The key vault resource ID must be configured in the cluster and enabled to store the secrets of the cluster.

Example:

```console
# Set and enable Customer Key Vault on Nexus cluster
az networkcloud cluster update --ids /subscriptions/<subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Nexus Cluster Name> --secret-archive "{key-vault-id:<Key Vault Resource ID>,use-key-vault:true}"

# Show Customer Key Vault setting (secretArchive) on the Nexus cluster
az networkcloud cluster show --ids /subscriptions/<subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Nexus Cluster Name> --query secretArchive
```

<br/>

For more help:

```console
az networkcloud cluster update --secret-archive ?? --help
```

### Get the Principal ID for the Cluster Manager Managed Identity

Once a managed identity is configured, use the CLI to view the identity and the associated principal ID data within the cluster manager.

Example:

```console
az networkcloud clustermanager show --ids /subscriptions/<Subscription ID>/resourceGroups/<Cluster Manager Resource Group Name>/providers/Microsoft.NetworkCloud/clusterManagers/<Cluster Manager Name>
```

<br/>

System-assigned identity example:

```
    "identity": {
        "principalId": "aaaaaaaa-bbbb-cccc-1111-222222222222",
        "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
        "type": "SystemAssigned"
    },
```

<br/>

User-assigned identity example:

```
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/<subscriptionID>/resourcegroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<userAssignedIdentityName>": {
                "clientId": "00001111-aaaa-2222-bbbb-3333cccc4444",
                "principalId": "bbbbbbbb-cccc-dddd-2222-333333333333"
            }
        }
    },
```

<br/>

Refer to [_Configure Key Vault Using Managed Identity for the Cluster_](#configure-key-vault-using-managed-identity-for-the-cluster) to assign the appropriate role to the Managed Identity Principal ID.
