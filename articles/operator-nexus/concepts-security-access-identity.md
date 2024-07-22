---
title: Azure Operator Nexus access and identity
description: Learn about access and identity in Azure Operator Nexus.
ms.topic: conceptual
ms.date: 03/25/2024
author: graymark
ms.author: graymark
ms.service: azure-operator-nexus
---
# Provide access to Azure Operator Nexus Resources with an Azure role-based access control

Azure role-based access control (Azure RBAC) is an authorization system built
on [Azure Resource Manager](../azure-resource-manager/management/overview.md) that
provides fine-grained access management of Azure resources.

The Azure RBAC model allows users to set permissions on different scope levels: management
group, subscription, resource group, or individual resources.  Azure RBAC for key
vault also allows users to have separate permissions on individual keys, secrets,
and certificates.

For more information, see [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).

## Operator Nexus built-in roles

Azure Operator Nexus provides the following built-in roles.

[Operator Nexus Compute Contributor Role (Preview)](#operator-nexus-compute-contributor-role-preview)

[Operator Nexus Keyset Administrator Role (Preview)](#operator-nexus-keyset-administrator-role-preview)

> [!NOTE]
> Preview roles are subject to change.

---

### Operator Nexus Compute Contributor Role (Preview)

The user with this role can have full access to manage and configure Nexus resources,
including creating, modifying, and deleting resources related to Nexus infrastructure.

| Actions                                                             | Description                                                                                                                                                              |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Microsoft.Authorization/*/read                                      | Read roles and role assignments                                                                                                                                          |
| Microsoft.ExtendedLocation/customLocations/deploy/action            | Deploy permissions to a Custom Location resource                                                                                                                         |
| Microsoft.ExtendedLocation/customLocations/read                     | Gets a Custom Location resource                                                                                                                                         |
| Microsoft.HybridCompute/machines/extensions/read                    | Reads any Azure Arc extensions                                                                                                                                           |
| Microsoft.HybridCompute/machines/read                               | Read any Azure Arc machines                                                                                                                                              |
| Microsoft.Insights/alertRules/*                                     | Create and manage a classic metric alert                                                                                                                                 |
| Microsoft.Kubernetes/connectedClusters/read                         | Read connectedClusters                                                                                                                                                   |
| Microsoft.KubernetesConfiguration/extensions/read                   | Gets extension instance resource                                                                                                                                         |
| Microsoft.ManagedNetworkFabric/networkFabricControllers/join/action | Join action for Network Fabric Controller resource.                                                                                                                      |
| Microsoft.ManagedNetworkFabric/networkFabrics/join/action           | Join action for Network Fabric resource.                                                                                                                                 |
| Microsoft.ManagedNetworkFabric/networkRacks/join/action             | Join action for Network Rack resource.                                                                                                                                   |
| Microsoft.NetworkCloud/bareMetalMachines/cordon/action              | Cordon the provided bare metal machine's Kubernetes node                                                                                                                 |
| Microsoft.NetworkCloud/bareMetalMachines/delete                     | Delete the provided bare metal machine. All customer initiated requests will be rejected as the life cycle of this resource is managed by the system.                    |
| Microsoft.NetworkCloud/bareMetalMachines/powerOff/action            | Power off the provided bare metal machine                                                                                                                                |
| Microsoft.NetworkCloud/bareMetalMachines/read                       | Get properties of the provided bare metal machine                                                                                                                        |
| Microsoft.NetworkCloud/bareMetalMachines/reimage/action             | Reimage the provided bare metal machine                                                                                                                                  |
| Microsoft.NetworkCloud/bareMetalMachines/replace/action             | Replace the provided bare metal machine                                                                                                                                  |
| Microsoft.NetworkCloud/bareMetalMachines/restart/action             | Restart the provided bare metal machine                                                                                                                                  |
| Microsoft.NetworkCloud/bareMetalMachines/runDataExtracts/action     | Run one or more data extractions on the provided bare metal machine.                                                                                                     |
| Microsoft.NetworkCloud/bareMetalMachines/runReadCommands/action     | Run one or more read-only commands on the provided bare metal machine.                                                                                                   |
| Microsoft.NetworkCloud/bareMetalMachines/start/action               | Start the provided bare metal machine                                                                                                                                    |
| Microsoft.NetworkCloud/bareMetalMachines/uncordon/action            | Uncordon the provided bare metal machine's Kubernetes node                                                                                                               |
| Microsoft.NetworkCloud/bareMetalMachines/write                      | Create a new bare metal machine or update the properties of the existing one. All customer initiated requests will be rejected while life cycling the resource.          |
| Microsoft.NetworkCloud/clusterManagers/delete                       | Delete the provided cluster manager                                                                                                                                      |
| Microsoft.NetworkCloud/clusterManagers/read                         | Get the properties of the provided cluster manager                                                                                                                       |
| Microsoft.NetworkCloud/clusterManagers/write                        | Create a new cluster manager or update properties of the cluster manager if it exists                                                                                    |
| Microsoft.NetworkCloud/clusters/bareMetalMachineKeySets/read        | Get bare metal machine key set of the provided cluster                                                                                                                   |
| Microsoft.NetworkCloud/clusters/bmcKeySets/read                     | Get baseboard management controller key set of the provided cluster                                                                                                      |
| Microsoft.NetworkCloud/clusters/continueUpdateVersion/action        | Trigger the continuation of an update for a cluster with a matching update strategy that has paused after completing a segment of the update                             |
| Microsoft.NetworkCloud/clusters/delete                              | Delete the provided cluster                                                                                                                                              |
| Microsoft.NetworkCloud/clusters/deploy/action                       | Deploy the cluster using the rack configuration provided during creation                                                                                                 |
| Microsoft.NetworkCloud/clusters/metricsConfigurations/delete        | Delete the metrics configuration of the provided cluster                                                                                                                 |
| Microsoft.NetworkCloud/clusters/metricsConfigurations/read          | Get metrics configuration of the provided cluster                                                                                                                        |
| Microsoft.NetworkCloud/clusters/metricsConfigurations/write         | Create new or update the existing metrics configuration of the provided cluster                                                                                          |
| Microsoft.NetworkCloud/clusters/read                                | Get properties of the provided cluster                                                                                                                                   |
| Microsoft.NetworkCloud/clusters/scanRuntime/action                  | Triggers the execution of a runtime protection scan to detect and remediate detected issues, in accordance with the cluster configuration                                |
| Microsoft.NetworkCloud/clusters/updateVersion/action                | Update the version of the provided cluster to one of the available supported versions                                                                                    |
| Microsoft.NetworkCloud/clusters/write                               | Create a new cluster or update the properties of the cluster if it exists                                                                                                |
| Microsoft.NetworkCloud/locations/operationStatuses/read             | Read operation status                                                                                                                                                    |
| Microsoft.NetworkCloud/operations/read                              | Read operation                                                                                                                                                           |
| Microsoft.NetworkCloud/rackSkus/read                                | Get the properties of the provided rack SKU                                                                                                                              |
| Microsoft.NetworkCloud/racks/delete                                 | Delete the provided rack. All customer initiated requests will be rejected as the life cycle of this resource is managed by the system                                   |
| Microsoft.NetworkCloud/racks/join/action                            | Join a Nexus rack                                                                                                                                                        |
| Microsoft.NetworkCloud/racks/read                                   | Get properties of the provided rack                                                                                                                                      |
| Microsoft.NetworkCloud/racks/write                                  | Create a new rack or update properties of the existing one. All customer initiated requests will be rejected as the life cycle of this resource is managed by the system |
| Microsoft.NetworkCloud/register/action                              | Register the subscription for Microsoft.NetworkCloud                                                                                                                     |
| Microsoft.NetworkCloud/registeredSubscriptions/read                 | Read registered subscriptions                                                                                                                                            |
| Microsoft.NetworkCloud/storageAppliances/read                       | Get properties of the provided storage appliance                                                                                                                         |
| Microsoft.NetworkCloud/unregister/action                            | Unregister the subscription for Microsoft.NetworkCloud                                                                                                                   |
| Microsoft.Resources/deployments/*                                   | Create and manage a deployment                                                                                                                                           |
| Microsoft.Resources/subscriptions/resourceGroups/read               | Gets or lists resource groups                                                                                                                                            |

> [!NOTE]
> In some instances, it may be necessary to assign additional actions to the user.
> One solution would be to create a custom role with the below actions to be assigned to
> the user in conjunction with the Operator Nexus Compute Contributor role.

#### Ancillary Operator Nexus Compute Contributor Actions

| Actions                                                             | Description                                                                                                         |
|---------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Microsoft.OperationalInsights/workspaces/write                      | Creates a new workspace or links to an existing workspace by providing the customer id from the existing workspace. |
| Microsoft.OperationalInsights/workspaces/read                       | Gets an existing workspace                                                                                          |
| Microsoft.Resources/subscriptions/resourcegroups/write              | Creates or updates a resource group.                                                                                |

### Operator Nexus Keyset Administrator Role (Preview)

Manage interactive access to Azure Operator Nexus Compute resources by adding, removing,
and updating baremetal machine (BMM) and baseboard management (BMC) keysets.        |

| Actions                                                        | Description                                                                                        |
|----------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Microsoft.ExtendedLocation/customLocations/deploy/action       | Deploy permissions to a Custom Location resource                                                   |
| Microsoft.NetworkCloud/clusters/bareMetalMachineKeySets/delete | Delete a bare metal machine key set of the provided cluster                                        |
| Microsoft.NetworkCloud/clusters/bareMetalMachineKeySets/read   | Get bare metal machine key set of the provided cluster                                             |
| Microsoft.NetworkCloud/clusters/bareMetalMachineKeySets/write  | Create a new or update an existing bare metal machine key set of the provided cluster              |
| Microsoft.NetworkCloud/clusters/bmcKeySets/read                | Get baseboard management controller key set of the provided cluster                                |
| Microsoft.NetworkCloud/clusters/bmcKeySets/write               | Create a new or update an existing baseboard management controller key set of the provided cluster |
| Microsoft.NetworkCloud/clusters/bmcKeySets/delete              | Delete a baseboard management controller key set of the provided cluster
