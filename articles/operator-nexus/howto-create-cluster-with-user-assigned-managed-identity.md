---
title: "Azure Operator Nexus: Create Cluster Resource with a Managed Identity"
description: Create Clusters using the User Assigned Managed Identity to access the Log Analytics Workspace.
author: troy0820 
ms.author: troyconnor
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/08/2025
ms.custom: template-how-to
---


# Create a Cluster Resource with a Managed Identity

To create a cluster without a service principal user name and password, you can now create a cluster with a user-assigned managed identity or a system-assigned managed identity that has permissions over the Log Analytics Workspace.  This will be used when validating the hardware during hardware validation and when installing the extensions that utilize the Log Analytics Workspace.

## Prerequisites

* Install the latest version of the
   [appropriate CLI extensions](./howto-install-cli-extensions.md)
* A Log Analytics Workspace 
* A user-assigned managed identity resource with permissions over the log analytics workspace of [Log Analytics Contributor](/azure/role-based-access-control/built-in-roles/analytics#log-analytics-contributor).

> [!NOTE]
> This functionality exists with the 2024-10-01-preview API and will be available with the 2025-02-01 GA API offered by Azure Operator Nexus 


### Create and configure Log Analytics Workspace and User Assigned Managed Identity

1. Create a Log Analytics Workspace [Create a Log Analytics Workspace](/azure/azure-monitor/logs/quick-create-workspace).
1. Assign the "Log Analytics Contributor" role to users and managed identities which need access to the Log Analytics Workspace.
   1. See [Assign an Azure role for access to the analytics Workspace](/azure/azure-monitor/logs/manage-access?tabs=portal#azure-rbac). The role must also be assigned to either a user-assigned managed identity or the cluster's own system-assigned managed identity.
   1. For more information on managed identities, see [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).
   1. If using the Cluster's system assigned identity, the system assigned identity needs to be added to the cluster before it can be granted access.
   1. When assigning a role to the cluster's system-assigned identity, make sure you select the resource with the type "Cluster (Operator Nexus)."

### Configure the cluster to use a user-assigned managed identity for Log Analytics Workspace access

```azurecli-interactive
az networkcloud cluster create --name "<cluster-name>" \
  --resource-group "<cluster-resource-group>" \
  --mi-user-assigned "<user-assigned-identity-resource-id>" \
  --analytics-output-settings identity-type="UserAssignedIdentity" \
  identity-resource-id="<user-assigned-identity-resource-id>" \
  ...
  --subscription "<subscription>"
```

### View the principal ID for the user-assigned managed identity

The identity resource ID can be found by selecting "JSON view" on the identity resource; the ID is at the top of the panel that appears. The container URL can be found on the Settings -> Properties tab of the container resource.

The CLI can also be used to view the identity and the associated principal ID data within the cluster.

Example:

```console
az networkcloud cluster show --ids /subscriptions/<Subscription ID>/resourceGroups/<Cluster Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Cluster Name>
```

User-assigned identity example:

```json
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

### Create and configure Log Analytics Workspace and System Assigned Managed Identity

> [!NOTE]
> The system-assigned managed identity that is created during cluster creation does not exist until the cluster is created.  This system-assigned managed identity will need to have permissions over the scope of the Log Analytics Workspace with the role of Log Analytics Contributor before we can update the cluster to utilize this identity. This update must occur before the Cluster can be deployed.

```azurecli-interactive
az networkcloud cluster update --name "<cluster-name>" \
  --resource-group "<cluster-resource-group>" \
  --mi-system-assigned "<system-assigned-identity-resource-id>" \
  --analytics-output-settings identity-type="SystemAssignedIdentity" \
  identity-resource-id="<user-assigned-identity-resource-id>" \
  ...
  --subscription "<subscription>"
```

### View the principal ID for the system-assigned managed identity

The identity resource ID can be found by selecting "JSON view" on the identity resource; the ID is at the top of the panel that appears. The container URL can be found on the Settings -> Properties tab of the container resource.

The CLI can also be used to view the identity and the associated principal ID data within the cluster.

Example:

```console
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


