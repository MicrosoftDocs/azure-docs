---
title: Create a user-assigned managed identity
titleSuffix: Azure Enclave
description: Learn how to create a user-assigned managed identity in Azure Enclave to grant least-privilege access to a resource, such as a key vault for encryption at rest.
author: aserfass-msft
ms.author: aserfass
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 08/20/2026
---

# Create a user-assigned managed identity

Create a user-assigned managed identity to grant least-privilege access to a specific service, for actions such as encryption at rest.

In this article, you:

- Create a user-assigned managed identity from the service catalog or the Azure portal, and assign it a role on a key vault.

## Prerequisites

- To access Azure Enclave, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- You need a [workload](./what-workload.md) and a [workload resource group](./what-workload.md#workload-resource-group) in which to create the managed identity.

## Create from the service catalog (quick)
1. Quickly deploy a `user-assigned` or `system-assigned` managed identity from the [Common Dependencies](./deploy-common-dependencies-service-catalog.md) service catalog template. You can also create a key vault from this template if you don't already have one.
1. [Assign a role to the managed identity](#assign-a-role-to-the-managed-identity).

## Create from the portal
1. In the Azure portal, enter `Managed Identity` in the search bar at the top of the portal.
1. Select `Managed Identities`.
1. Select `Create`.
1. Enter the workload resource group (RG) where you want to store the managed identity resource.

  ![Screenshot that shows the Create User-assigned Managed Identity pane.](/entra/identity/managed-identities-azure-resources/media/how-manage-user-assigned-managed-identities/create-user-assigned-managed-identity-portal.png)

1. Confirm the `Region` and enter a name for the managed identity resource.
1. Select `Review + create` and then select `Create`.
1. Copy the managed identity name into the service catalog deployment parameter, or paste it into Notepad temporarily for use during deployment.

## Assign a role to the managed identity
1. In the Azure portal, go to the managed identity you created.
1. Select **Azure Role Assignments** in the left pane.
1. Select `+Add Role Assignment`.
1. For **Scope**, select **Key Vault**.
1. Confirm the subscription.
1. For **Resource**, enter the name of your key vault. The [Common Dependencies](./deploy-common-dependencies-service-catalog.md) template is a good quickstart for creating a key vault. You can also use the [Key Vault](./deploy-key-vault-service-catalog.md) template for more customizations.
1. The key vault must use Azure role-based access control (Azure RBAC). Then select the **Key Vault Crypto Service Encryption User** role.

## References
- [How to create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
- [Manage user-assigned identity](/azure/operator-service-manager/how-to-create-user-assigned-managed-identity)