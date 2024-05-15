---
title: Set up customer provided Key Vault for Managed Credential rotation
description: Step by step guide on setting up a key vault for managing and rotating credentials used within Azure Operator Nexus Cluster resource.
author: ghugo
ms.author: gagehugo
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/24/2024
ms.custom: template-how-to
---

# Set up Key Vault for Managed Credential Rotation in Operator Nexus

Azure Operator Nexus utilizes secrets and certificates to manage component security across the platform. The Operator Nexus platform handles the rotation of these secrets and certificates. By default, Operator Nexus stores the credentials in a managed Key Vault. To keep the rotated credentials in their own Key Vault, the user has to set up the Key Vault for the Azure Operator Nexus instance. Once created, the user needs to add a role assignment on the Customer Key Vault to allow the Operator Nexus Platform to write updated credentials, and additionally link the Customer Key Vault to the Nexus Cluster Resource.

## Prerequisites

- Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
- Get the *Subscription ID* for the customer's subscription

> [!NOTE]
> A single Key Vault can be used for any number of clusters.

## Writing Credential Updates to a Customer Key Vault on Nexus Cluster

- Ensure that the *Microsoft.NetworkCloud* resource provider is registered with the customer subscription.

```console
az provider register --namespace 'Microsoft.NetworkCloud' --subscription <Subscription ID>
```

- Assign the *Operator Nexus Key Vault Writer Service Role*. Ensure that *Azure role-based access control* is selected as the permission model for the key vault on the *Access configuration* view. Then from the *Access control (IAM)* view, select to add a role assignment.

| Role Name                                              | Role Definition ID                   |
|:-------------------------------------------------------|:-------------------------------------|
| Operator Nexus Key Vault Writer Service Role (Preview) | 44f0a1a8-6fea-4b35-980a-8ff50c487c97 |

| Environment | App Name              | App ID                               |
|:------------|:----------------------|:-------------------------------------|
| Production  | AFOI-NC-RP-PME-PROD   | 05cf5e27-931d-47ad-826d-cb9028d8bd7a |
| Production  | AFOI-NC-MGMT-PME-PROD | 3365d4ea-bb16-4bc9-86dd-f2c8cf6f1f56 |

Example:

```console
az role assignment create --assignee 05cf5e27-931d-47ad-826d-cb9028d8bd7a --role 44f0a1a8-6fea-4b35-980a-8ff50c487c97 --scope /subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.KeyVault/vaults/<Key Vault Name>

az role assignment create --assignee 3365d4ea-bb16-4bc9-86dd-f2c8cf6f1f56 --role 44f0a1a8-6fea-4b35-980a-8ff50c487c97 --scope /subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.KeyVault/vaults/<Key Vault Name>
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
