---
title: Manage Azure Center for SAP solutions resources with Azure RBAC 
description: Use Azure role-based access control (Azure RBAC) to manage access to your SAP workloads within Azure Center for SAP solutions.
author: kalyaninamuduri 
ms.author: kanamudu 
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: conceptual
ms.date: 02/03/2023
ms.custom: template-concept 
---

# Management of Azure Center for SAP solutions resources with Azure RBAC 

[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) enables granular access management for Azure. You can use Azure RBAC to manage Virtual Instance for SAP solutions resources within Azure Center for SAP solutions. For example, you can separate duties within your team and grant only the amount of access that users need to perform their jobs.

*Users* or *user-assigned managed identities* require minimum roles or permissions to use the different capabilities in Azure Center for SAP solutions.

There are [Azure built-in roles](../../role-based-access-control/built-in-roles.md) for Azure Center for SAP solutions, or you can [create Azure custom roles](../../role-based-access-control/custom-roles.md) for more control. Azure Center for SAP solutions provides the following built-in roles to deploy and manage SAP systems on Azure: 

- The **Azure Center for SAP solutions administrator** role has the required permissions for a user to deploy infrastructure, install SAP, and manage SAP systems from Azure Center for SAP solutions. The role allows users to:
    - Deploy infrastructure for a new SAP system
    - Install SAP software
    - Register existing SAP systems as a [Virtual Instance for SAP solutions (VIS)](overview.md#what-is-a-virtual-instance-for-sap-solutions) resource.
    - View the health and status of SAP systems.
    - Perform operations such as **Start** and **Stop** on the VIS resource.
    - Do all possible actions with Azure Center for SAP solutions, including the deletion of the VIS resource.
- The **Azure Center for SAP solutions service role** is intended for use by the user-assigned managed identity. The Azure Center for SAP solutions service uses this identity to deploy and manage SAP systems. This role has permissions to support the deployment and management capabilities in Azure Center for SAP solutions.
- The **Azure Center for SAP solutions reader** role has permissions to view all VIS resources.

> [!NOTE]
> To use an existing user-assigned managed identity for deploying a new SAP system or registering an existing system, the user must also have the **Managed Identity Operator** role. This role is required to assign a user-assigned managed identity to the Virtual Instance for SAP solutions resource.

> [!NOTE]
> If you're creating a new user-assigned managed identity when you deploy a new SAP system or register an existing system, the user must also have the **Managed Identity Contributor** and **Managed Identity Operator** roles. These roles are required to create a user-assigned identity, make necessary role assignments to it and assign it to the VIS resource.

## Deploy infrastructure for new SAP system

To deploy infrastructure for a new SAP system, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |
| **Managed Identity Operator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/write` |
| `Microsoft.Workloads/Operations/read` |
| `Microsoft.Workloads/Locations/OperationStatuses/read` |
| `Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getSizingRecommendations/action` |
| `Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getSapSupportedSku/action` |
| `Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getDiskConfigurations/action` |
| `Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getAvailabilityZoneDetails/action` |
| `Microsoft.Resources/subscriptions/resourcegroups/deployments/read` |
| `Microsoft.Resources/subscriptions/resourcegroups/deployments/write` |
| `Microsoft.Network/virtualNetworks/read` |
| `Microsoft.Network/virtualNetworks/subnets/read` |
| `Microsoft.Network/virtualNetworks/subnets/write` |
| `Microsoft.Compute/sshPublicKeys/write` |
| `Microsoft.Compute/sshPublicKeys/read` |
| `Microsoft.Compute/sshPublicKeys /*/generateKeyPair/action` |
| `Microsoft.Storage/storageAccounts/read` |
| `Microsoft.Storage/storageAccounts/blobServices/read` |
| `Microsoft.Storage/storageAccounts/blobServices/containers/read` |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
| `Microsoft.Storage/storageAccounts/fileServices/read` |
| `Microsoft.Storage/storageAccounts/fileServices/shares/read` |


| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/disks/read` |
| `Microsoft.Compute/disks/write` |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/write` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/extensions/delete` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |
| `Microsoft.Compute/availabilitySets/read` |
| `Microsoft.Compute/availabilitySets/write` |
| `Microsoft.Network/loadBalancers/read` |
| `Microsoft.Network/loadBalancers/write` |
| `Microsoft.Network/loadBalancers/backendAddressPools/read` |
| `Microsoft.Network/loadBalancers/backendAddressPools/write` |
| `Microsoft.Network/loadBalancers/backendAddressPools/join/action` |
| `Microsoft.Network/loadBalancers/frontendIPConfigurations/read` |
| `Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action` |
| `Microsoft.Network/loadBalancers/frontendIPConfigurations/loadBalancerPools/read` |
| `Microsoft.Network/loadBalancers/frontendIPConfigurations/loadBalancerPools/write` |
| `Microsoft.Network/networkInterfaces/read` |
| `Microsoft.Network/networkInterfaces/write` |
| `Microsoft.Network/networkInterfaces/join/action` |
| `Microsoft.Network/networkInterfaces/ipconfigurations/read` |
| `Microsoft.Network/networkInterfaces/ipconfigurations/join/action` |
| `Microsoft.Network/privateEndpoints/read` |
| `Microsoft.Network/privateEndpoints/write` |
| `Microsoft.Network/virtualNetworks/read` |
| `Microsoft.Network/virtualNetworks/subnets/read` |
| `Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action` |
| `Microsoft.Network/virtualNetworks/subnets/join/action` |
| `Microsoft.Storage/storageAccounts/read` |
| `Microsoft.Storage/storageAccounts/write` |
| `Microsoft.Storage/storageAccounts/listAccountSas/action` |
| `Microsoft.Storage/storageAccounts/PrivateEndpointConnectionsApproval/action` |
| `Microsoft.Storage/storageAccounts/blobServices/read` |
| `Microsoft.Storage/storageAccounts/blobServices/containers/read` |
| `Microsoft.Storage/storageAccounts/fileServices/read` |
| `Microsoft.Storage/storageAccounts/fileServices/write` |
| `Microsoft.Storage/storageAccounts/fileServices/shares/read` |
| `Microsoft.Storage/storageAccounts/fileServices/shares/write` |

## Install SAP software

To install SAP software, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/write` |
| `Microsoft.Workloads/sapVirtualInstances/applicationInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/centralInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/databaseInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/read` |
| `Microsoft.Workloads/Operations/read` |
| `Microsoft.Workloads/Locations/OperationStatuses/read` |
| `Microsoft.Storage/storageAccounts/read` |
| `Microsoft.Storage/storageAccounts/blobServices/read` |
| `Microsoft.Storage/storageAccounts/blobServices/containers/read` |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
| `Microsoft.Storage/storageAccounts/fileServices/read` |
| `Microsoft.Storage/storageAccounts/fileServices/shares/read` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |
| **Reader and Data Access** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/disks/read` |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/disks/write` |
| `Microsoft.Compute/virtualMachines/write` |
| `Microsoft.Compute/virtualMachines/extensions/delete` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |
| `Microsoft.Network/loadBalancers/read` |
| `Microsoft.Network/loadBalancers/backendAddressPools/read` |
| `Microsoft.Network/loadBalancers/frontendIPConfigurations/read` |
| `Microsoft.Network/loadBalancers/frontendIPConfigurations/loadBalancerPools/read` |
| `Microsoft.Network/networkInterfaces/read` |
| `Microsoft.Network/networkInterfaces/ipconfigurations/read` |
| `Microsoft.Network/privateEndpoints/read` |
| `Microsoft.Network/virtualNetworks/read` |
| `Microsoft.Network/virtualNetworks/subnets/read` |
| `Microsoft.Storage/storageAccounts/read` |
| `Microsoft.Storage/storageAccounts/listAccountSas/action` |
| `Microsoft.Storage/storageAccounts/blobServices/containers/read` |
| `Microsoft.Storage/storageAccounts/fileServices/read` |
| `Microsoft.Storage/storageAccounts/fileServices/shares/read` |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action` |
| `Microsoft.Storage/storageAccounts/write` |
| `Microsoft.Storage/storageAccounts/listAccountSas/action` |
| `Microsoft.Storage/storageAccounts/fileServices/write` |
| `Microsoft.Storage/storageAccounts/fileServices/shares/write` |

## Register and manage existing SAP system

To register an existing SAP system and manage that system with Azure Center for SAP solutions,  a *user* or *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |
| **Managed Identity Operator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapvirtualInstances/*/read` |
| `Microsoft.Workloads/sapVirtualInstances/*/write` |
| `Microsoft.Workloads/Locations/*/read` |
| `Microsoft.Resources/subscriptions/resourceGroups/read` |
| `Microsoft.Resources/subscriptions/read` |
| `Microsoft.Compute/virtualMachines/read` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/disks/read` |
| `Microsoft.Compute/disks/write` |
| `Microsoft.Compute/virtualMachines/write` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |
| `Microsoft.Network/loadBalancers/read` |
| `Microsoft.Network/loadBalancers/backendAddressPools/read` |
| `Microsoft.Network/loadBalancers/frontendIPConfigurations/read` |
| `Microsoft.Network/loadBalancers/frontendIPConfigurations/loadBalancerPools/read` |
| `Microsoft.Network/networkInterfaces/read` |
| `Microsoft.Network/networkInterfaces/ipconfigurations/read` |
| `Microsoft.Network/virtualNetworks/read` |
| `Microsoft.Network/virtualNetworks/subnets/read` |
| `Microsoft.Resources/subscriptions/resourceGroups/write` |
| `Microsoft.Resources/subscriptions/resourceGroups/read` |
| `Microsoft.Resources/subscriptions/read` |
| `Microsoft.Resources/subscriptions/resourcegroups/deployments/*` |
| `Microsoft.Resources/tags/*` |

## View VIS resources 

To view VIS resources, a *user* or *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions reader** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/applicationInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/centralInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/databaseInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/read` |
| `Microsoft.Workloads/Operations/read` |
| `Microsoft.Workloads/Locations/OperationStatuses/read` |
| `Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getSizingRecommendations/action` |
| `Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getSapSupportedSku/action` |
| `Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getDiskConfigurations/action` |
| `Microsoft.Workloads/locations/sapVirtualInstanceMetadata/getAvailabilityZoneDetails/action` |
| `Microsoft.Insights/Metrics/Read` |
| `Microsoft.ResourceHealth/AvailabilityStatuses/read` |
| `Microsoft.Advisor/configurations/read` |
| `Microsoft.Advisor/recommendations/read` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

| Built-in permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

## Start SAP system

To start the SAP system from a VIS resource, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/start/action` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |

## Stop SAP system

To stop the SAP system from a VIS resource, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/stop/action` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |

## Start SAP Central services instance
To start the SAP Central services instance from a VIS resource, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/centralInstances/start/action` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |

## Stop SAP Central services instance
To stop the SAP Central services instance from a VIS resource, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/centralInstances/stop/action` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |

## Start SAP Application server instance
To start the SAP Application server instance from a VIS resource, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/applicationInstances/start/action` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |

## Stop SAP Application server instance
To stop the SAP Application server instance from a VIS resource, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/applicationInstances/stop/action` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |

## Start SAP HANA Database instance
To start the SAP HANA Database instance from a VIS resource, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/databaseInstances/start/action` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |

## Stop SAP HANA Database instance
To stop the SAP HANA Database instance from a VIS resource, a *user* and *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/databaseInstances/stop/action` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| **Azure Center for SAP solutions service role** |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| `Microsoft.Compute/virtualMachines/read` |
| `Microsoft.Compute/virtualMachines/extensions/read` |
| `Microsoft.Compute/virtualMachines/extensions/write` |
| `Microsoft.Compute/virtualMachines/instanceView/read` |

## View cost analysis

To view the cost analysis, a *user* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Cost Management Reader** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Consumption/*/read**`	|
| `Microsoft.CostManagement/*/read` |
| `Microsoft.Billing/billingPeriods/read` | 
| `Microsoft.Resources/subscriptions/read` |
| `Microsoft.Resources/subscriptions/resourceGroups/read` |
| `Microsoft.Billing/billingProperty/read` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

## View Quality Insights

To view Quality Insights, a *user* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions reader** |

 Minimum permissions for *users* |
| ------------------------------- |
| None, except the minimum role assignment. |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

## Set up Azure Monitor for SAP solutions

To set up Azure Monitor for SAP solutions for your SAP resources, a *user* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Contributor** |

| Minimum permissions for *users* |
| ------------------------------- |
| None, except the minimum role assignment. |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

## Delete VIS resource

To delete a VIS resource, a *user* or *user-assigned managed identity* requires the following role or permissions.

| Built-in roles for *users* | 
| ------------------------- |
| **Azure Center for SAP solutions administrator** |

| Minimum permissions for *users* |
| ------------------------------- |
| `Microsoft.Workloads/sapVirtualInstances/delete` |
| `Microsoft.Workloads/sapVirtualInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/applicationInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/centralInstances/read` |
| `Microsoft.Workloads/sapVirtualInstances/databaseInstances/read` |

| Built-in roles for *user-assigned managed identities* |
| ---------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

| Minimum permissions for *user-assigned managed identities* |
| ---------------------------------------------------------- |
| This scenario isn't applicable to *user-assigned managed identities*. |

## Next steps

- [Manage VIS resources in Azure Center for SAP solutions](manage-virtual-instance.md)
