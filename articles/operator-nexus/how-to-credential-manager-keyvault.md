---
title: Setting up Key Vault for managed credential rotation in Operator Nexus
description: Step by step guide on setting up a key vault for managing and rotating credentials
author: ghugo
ms.author: gagehugo
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/24/2024
ms.custom: template-how-to
---

# Setting up Key Vault for managed credential rotation in Operator Nexus

If a user wants rotated credentials to be stored in their own key vault, the key vault needs to be configured for the Nexus cluster.  The user adds a role assignment to the customer key vault to allow the credential manager to write updated credentials and associates the key vault as a secret archive for each cluster.

## Prerequisites

1. Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
1. Get the `Subscription ID` for the customer's subscription

> [!NOTE]
> A single Key Vault can be used for any number of clusters.

## Writing credential updates to a Customer Key Vault on Nexus Cluster

1. Ensure that the *Microsoft.NetworkCloud* resource provider is registered with the customer subscription.

```
az provider register --namespace 'Microsoft.NetworkCloud' --subscription <Subscription ID>
```

1. Assign the *Operator Nexus Key Vault Writer Service Role* to the Nexus User RP App Name & Management App Name. 

  - Ensure that *Azure role-based access control* is selected as the permission model for the key vault on the *Access configuration* blade.  Then from the *Access control (IAM) blade, select to add a role assignment.  See the tables below for details role assignment details. For AT&T, use the **_Production_** App Names.

   **_Built-in Role_**

   | Role Name                                              | Role Definition ID                   |
   |:-------------------------------------------------------|:-------------------------------------|
   | Operator Nexus Key Vault Writer Service Role (Preview) | 44f0a1a8-6fea-4b35-980a-8ff50c487c97 |

   **_User RP_**

   | Environment | App Name            | App ID                               |
   |:------------|:--------------------|:-------------------------------------|
   | Production  | AFOI-NC-RP-PME-PROD | 05cf5e27-931d-47ad-826d-cb9028d8bd7a |

   **_Management Service_**

   | Environment | App Name              | App ID                               |
   |:------------|:----------------------|:-------------------------------------|
   | Production  | AFOI-NC-MGMT-PME-PROD | 3365d4ea-bb16-4bc9-86dd-f2c8cf6f1f56 |

   > [!NOTE]
   > Searching by App ID will not work, just the App Name.

Example:
```
az role assignment create --assignee 05cf5e27-931d-47ad-826d-cb9028d8bd7a --role 44f0a1a8-6fea-4b35-980a-8ff50c487c97 --scope /subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.KeyVault/vaults/<Key Vault Name>

az role assignment create --assignee 3365d4ea-bb16-4bc9-86dd-f2c8cf6f1f56 --role 44f0a1a8-6fea-4b35-980a-8ff50c487c97 --scope /subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.KeyVault/vaults/<Key Vault Name>
```

1. User associates the customer key vault as a secret archive for the Nexus cluster.  The key vault resource ID must be configured in the cluster and enabled for secrets archive to store the secrets of the cluster.

Example:
```
# Set and enable customer key vault on Nexus cluster
az networkcloud cluster update --ids /subscriptions/<subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Nexus Cluster Name> --secret-archive "{key-vault-id:<Key Vault Resource ID>,use-key-vault:true}"

# Show customer key vault setting (secretArchive) on the Nexus cluster
az networkcloud cluster show --ids /subscriptions/<subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Nexus Cluster Name> --query secretArchive
```

For more help:
```
az networkcloud cluster update --secret-archive ?? --help
```
