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

Azure Operator Nexus utilizes secrets and certificates to manage component security across the platform. The Operator Nexus platform handles the rotation of these secrets and certificates. By default, Operator Nexus stores the credentials in a managed Key Vault. To keep the rotated credentials in their own Key Vault, the user must configure their own Key Vault to receive rotated credentials. This configuration requires the user to set up the Key Vault for the Azure Operator Nexus instance. Once created, the user needs to add a role assignment on the Customer Key Vault to allow the Operator Nexus Platform to write updated credentials, and additionally link the Customer Key Vault to the Nexus Cluster Resource.

## Prerequisites

- Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
- Get the *Subscription ID* for the customer's subscription

> [!NOTE]
> A single Key Vault can be used for any number of clusters.

## Configure Key Vault Using Managed Identity for Cluster Manager

Beginning with the 2024-06-01-public-preview API version, managed identities in the Cluster Manager are used for write access to deliver rotated credentials to a key vault. The Cluster Manager identity may be system-assigned or [user-assigned](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities), and can be managed directly via APIs or via CLI.

These examples describe how to configure a managed identity for a Cluster Manager.

- Create or update Cluster Manager with system-assigned identity
```
        az networkcloud clustermanager create --name "clusterManagerName" --location "location" \
        --analytics-workspace-id "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
        --fabric-controller-id "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/fabricControllerName" \
        --managed-resource-group-configuration name="my-managed-rg" --tags key1="myvalue1" key2="myvalue2" --resource-group "resourceGroupName" --mi-system-assigned
```
<br/>

- Create or update Cluster Manager with user-assigned identity
```
        az networkcloud clustermanager create --name <Cluster Manager Name> --location <Location> \
        --analytics-workspace-id "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/microsoft.operationalInsights/workspaces/logAnalyticsWorkspaceName" \
        --fabric-controller-id "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/fabricControllerName" \
        --managed-resource-group-configuration name="my-managed-rg" --tags key1="myvalue1" key2="myvalue2" \
        --resource-group <Resource Group Name> --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAI"
```
<br/>

- Add system-assigned identity to Cluster Manager
```
        az networkcloud clustermanager update --name <Cluster Manager Name> --resource-group <Resource Group Name> --mi-system-assigned
```
<br/>

- Add user-assigned identity to Cluster Manager
```
        az networkcloud clustermanager update --name <Cluster Manager Name> --resource-group <Resource Group Name> \
        --mi-user-assigned "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUAI"
```

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

Refer to [_Grant Managed Identity Access to a Key Vault for Credential Rotation_](#grant-managed-identity-access-to-a-key-vault-for-credential-rotation) to assign the appropriate role to the Managed Identity Principal ID.

## Configure Key Vault Using Managed Identity for Cluster

> [!IMPORTANT]
> Please note that this method for configuring a key vault for credential rotation is in preview. **This method can only be used with key vaults that do not have firewall enabled.** If your environment requires the key vault firewall be enabled, use the existing [Cluster Manager]() identity method.

Beginning with the 2024-10-01-preview API, managed identities in the Nexus Cluster resource can be used instead of Cluster Manager. The Cluster managed identity may be system-assigned or [user-assigned](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities), and can be managed directly via APIs or via CLI.

> [!NOTE]
> If Nexus Cluster managed identity is configured for the key vault, then these settings will supersede settings configured in [_Configure Key Vault Using Managed Identity for Cluster Manager_](#configure-key-vault-using-managed-identity-for-cluster-manager)

### Configure Nexus Cluster Secret Archive Settings

The Nexus Cluster _secret-archive-settings_ specify the Azure Key Vault URI where rotated credentials are stored and the managed identity which is used to access it.

These examples describe how to configure a managed identity for a Nexus Cluster and configure it as part of _secret-archive-settings_.

> [!NOTE]
> Secret archive settings specify the Key Vault URI, not the Key Vault resource ID, and the managed identity specified must be configured for the Nexus Cluster.

- Create Nexus Cluster with system-assigned identity to access Key Vault for rotated credentials.
```azurecli-interactive
az networkcloud cluster create --name "<cluster-name>" \
  --resource-group "<cluster-resource-group>" \
  ...
  --mi-system-assigned \
  --secret-archive-settings identity-type="SystemAssignedIdentity" vault-uri="https://<key vault name>.vault.azure.net/"
  ...
  --subscription "<subscription>"
```
<br/>

- Create Nexus Cluster with user-assigned identity to access Key Vault for rotated credentials.
```azurecli-interactive
az networkcloud cluster create --name "<cluster-name>" \
  --resource-group "<cluster-resource-group>" \
  ...
  --mi-user-assigned "<user-assigned-identity-resource-id>" \
  --secret-archive-settings identity-type="UserAssignedIdentity" identity-resource-id="<user-assigned-identity-resource-id>" vault-uri="https://<key vault name>.vault.azure.net/"
  ...
  --subscription "<subscription>"
```
<br/>

- Update existing Nexus Cluster with system-assigned identity to access Key Vault for rotated credentials.
```azurecli-interactive
az networkcloud cluster update --ids <cluster-resource-id> \
  --mi-system-assigned \
  --secret-archive-settings identity-type="SystemAssignedIdentity" vault-uri="https://<key vault name>.vault.azure.net/"
```
<br/>

- Update existing Nexus Cluster with user-assigned identity
```azurecli-interactive
az networkcloud cluster update --ids <cluster-resource-id> \
  --mi-user-assigned "<user-assigned-identity-resource-id>" \
  --secret-archive-settings identity-type="UserAssignedIdentity" identity-resource-id="<user-assigned-identity-resource-id>" vault-uri="https://<key vault name>.vault.azure.net/"
```
<br/>

For more help:

```azurecli-interactive
az networkcloud cluster update --secret-archive-settings '??' --help
```
<br/>

### Get the Principal ID for the Cluster Managed Identity

Once a managed identity is configured for the Nexus Cluster, use the CLI to view the identity and get the _principalId_ for the managed identity specified in the secret archive settings.

Example:

```console
az networkcloud cluster show --ids <cluster-resource-id>
```
<br/>

System-assigned identity example:
```
    "identity": {
        "principalId": "2cb564c1-b4e5-4c71-bbc1-6ae259aa5f87",
        "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
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
                "clientId": "e67dd610-99cf-4853-9fa0-d236b214e984",
                "principalId": "8e6d23d6-bb6b-4cf3-a00f-4cd640ab1a24"
            }
        }
    },
```
<br/>

Refer to [_Grant Managed Identity Access to a Key Vault for Credential Rotation_](#grant-managed-identity-access-to-a-key-vault-for-credential-rotation) to assign the appropriate role to the Managed Identity Principal ID.

## Grant Managed Identity Access to a Key Vault for Credential Rotation

> [!NOTE]
> A user-assigned managed identity may be created and assigned access to the key vault before the Nexus Cluster is created and prior to deployment.  A system-assigned identity must be granted access to the key vault after cluster creation but before deployment.

- Assign the *Operator Nexus Key Vault Writer Service Role*. Ensure that *Azure role-based access control* is selected as the permission model for the key vault on the *Access configuration* view. Then from the *Access Control* view, select to add a role assignment.

| Role Name                                              | Role Definition ID                   |
|:-------------------------------------------------------|:-------------------------------------|
| Operator Nexus Key Vault Writer Service Role (Preview) | 44f0a1a8-6fea-4b35-980a-8ff50c487c97 |

<br/>
Example:

```console
az role assignment create --assignee <Managed Identity Principal Id> --role 44f0a1a8-6fea-4b35-980a-8ff50c487c97 --scope /subscriptions/<Subscription ID>/resourceGroups/<Resource Group Name>/providers/Microsoft.KeyVault/vaults/<Key Vault Name>
```
<br/>

If using a user-assigned managed identity, proceed to [add permission to user-assigned identity](#add-a-permission-to-user-assigned-identity)

## Add a permission to User-assigned identity

When using a user-assigned managed identity to access a Key Vault, a customer is required to provision access to that identity for the Nexus platform.
Specifically, `Microsoft.ManagedIdentity/userAssignedIdentities/assign/action` permission needs to be added to the User-assigned identity for `AFOI-NC-MGMT-PME-PROD` Microsoft Entra ID. It's a known limitation of the platform that will be addressed in the future.

1. Open the Azure portal and locate the User-assigned identity in question.
2. Under **Access control (IAM)**, click **Add role assignment**.
3. Select **Role**: Managed Identity Operator. (See the permissions that the role provides [managed-identity-operator](/azure/role-based-access-control/built-in-roles/identity#managed-identity-operator)).
4. Assign access to: **User, group, or service principal**.
5. Select **Member**: AFOI-NC-MGMT-PME-PROD application.
6. Review and assign.
