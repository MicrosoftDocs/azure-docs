---
title: 'Quickstart: Define an Azure Container Apps sandbox group using Bicep (preview)'
description: Define a sandbox group as code with Bicep, set resource defaults, attach a managed identity, connect a virtual network, and grant data-plane access.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 08/21/2026
# customer intent: As a developer, I want to define an Azure Container Apps sandbox group with Bicep so that I can deploy sandbox infrastructure consistently as code.
---

# Quickstart: Define an Azure Container Apps sandbox group using Bicep (preview)

In this quickstart, you define an Azure Container Apps sandbox group as infrastructure as code with Bicep and deploy it with a single command.

> [!IMPORTANT]
> Azure Container Apps Sandboxes are currently in preview. Sandboxes created during preview might not be compatible with future releases and might need to be recreated.

## Prerequisites

- An Azure subscription with permission to create resource groups.
- Azure CLI (`az`) installed and signed in with `az login`.
- The Bicep CLI, which ships with the Azure CLI (`az bicep install` if it isn't already present).

## What you can define

The `Microsoft.App/sandboxGroups` resource is the declarative definition of a sandbox group. A sandbox group contains your sandboxes, snapshots, disk images, connections, and egress policies. In a single template, you can:

- Set default **CPU, memory, and disk** for every sandbox in the group, plus a **maximum sandbox count** and a **default timeout**.
- Attach a **managed identity** (system- or user-assigned) for gateway connections and registries.
- Connect the group to a **virtual network (VNet) subnet** with a child `vnetConnections` resource. No managed environment is required.
- Grant **data-plane access** with the Container Apps SandboxGroup Data Owner role.

## Core objects

| Object | Purpose |
| --- | --- |
| `Microsoft.App/sandboxGroups` | The group that holds sandboxes, snapshots, disk images, connections, and egress policies. |
| `properties.defaultCpu` / `defaultMemory` / `defaultDisk` | Default resource allocation for sandboxes created in the group. |
| `properties.maxSandboxCount` | Upper bound on the number of sandboxes in the group. |
| `properties.defaultTimeoutSeconds` | Default sandbox timeout, in seconds. |
| `identity` | Managed identity for gateway connections and registries. |
| `Microsoft.App/sandboxGroups/vnetConnections` | Child resource that links the group to a delegated subnet. |

## Example 1: Minimal sandbox group

The simplest possible setup is a sandbox group in a region that uses service defaults for CPU, memory, disk, and limits.

```bicep
resource sandboxGroup 'Microsoft.App/sandboxGroups@2026-02-01-preview' = {
  name: 'my-sandbox-group'
  location: 'westus2'
}
```

## Example 2: Resource defaults and tags

Set the defaults that every new sandbox inherits, cap the group size, and add tags for organization.

```bicep
resource sandboxGroup 'Microsoft.App/sandboxGroups@2026-02-01-preview' = {
  name: 'my-sandbox-group'
  location: 'westus2'
  tags: {
    environment: 'production'
    team: 'platform'
  }
  properties: {
    defaultCpu: '1'
    defaultMemory: '1Gi'
    defaultDisk: '10Gi'
    maxSandboxCount: 50
    defaultTimeoutSeconds: 3600
  }
}
```

## Example 3: System-assigned managed identity

A system-assigned identity is created and destroyed with the group. Use it for gateway connections and registry access without managing credentials.

```bicep
resource sandboxGroup 'Microsoft.App/sandboxGroups@2026-02-01-preview' = {
  name: 'my-sandbox-group'
  location: 'westus2'
  identity: {
    type: 'SystemAssigned'
  }
}
```

## Example 4: User-assigned managed identity

A user-assigned identity is a standalone resource you can share across groups and preassign roles to before the group exists.

```bicep
resource uami 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'sbg-identity'
  location: 'westus2'
}

resource sandboxGroup 'Microsoft.App/sandboxGroups@2026-02-01-preview' = {
  name: 'my-sandbox-group'
  location: 'westus2'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${uami.id}': {}
    }
  }
}
```

## Example 5: Sandbox group with a VNet connection

Connect a group to your own network with a child `vnetConnections` resource. The subnet must be delegated to `Microsoft.App/environments`. No managed environment is required.


```bicep
@description('Region for all resources.')
param location string = 'westus2'

resource vnet 'Microsoft.Network/virtualNetworks@2024-05-01' = {
  name: 'sbg-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'sandbox-subnet'
        properties: {
          addressPrefix: '10.0.0.0/23'
          delegations: [
            {
              name: 'sandboxDelegation'
              properties: {
                serviceName: 'Microsoft.App/environments'
              }
            }
          ]
        }
      }
    ]
  }
}

resource sandboxGroup 'Microsoft.App/sandboxGroups@2026-02-01-preview' = {
  name: 'my-sandbox-group'
  location: location
}

resource vnetConnection 'Microsoft.App/sandboxGroups/vnetConnections@2026-02-01-preview' = {
  parent: sandboxGroup
  name: 'default'
  location: location
  properties: {
    subnetId: vnet.properties.subnets[0].id
  }
}
```

> [!NOTE]
> You can't change the VNet connection's subnet after creation. Size the subnet for peak sandbox concurrency before you deploy.

## Deploy the template

Save any example as `main.bicep`, and then deploy it into a resource group.

```azurecli
az group create --name my-rg --location westus2

az deployment group create --resource-group my-rg --template-file main.bicep
```

## Grant data-plane access

Deploying the group creates the resource. To call the sandbox data-plane APIs, such as creating sandboxes, running commands, and taking snapshots, an identity needs the **Container Apps SandboxGroup Data Owner** role on the group.

```bicep
@description('Object ID of the identity that calls the sandbox APIs.')
param principalId string

var dataOwnerRoleId = 'c24cf47c-5077-412d-a19c-45202126392c'

resource dataOwner 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(sandboxGroup.id, principalId, dataOwnerRoleId)
  scope: sandboxGroup
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', dataOwnerRoleId)
    principalId: principalId
    principalType: 'ServicePrincipal' // or 'User', 'Group'
  }
}
```


## Next steps

> [!div class="nextstepaction"]
> [Snapshots and state management for Azure Container Apps Sandboxes](sandboxes-snapshots-state-management.md)

- [Configure egress policies and network controls](sandboxes-egress-policies.md)
- [Azure Container Apps Sandboxes overview](sandboxes-overview.md)
