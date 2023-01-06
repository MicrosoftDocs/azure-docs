---
title: How to register resources
titleSuffix: Azure Network Function Manager
description: Learn how to register resources and create user-assigned managed identities
author: polarapfel
ms.service: network-function-manager
ms.topic: how-to
ms.date: 11/02/2021
ms.author: tobiaw
ms.custom: ignite-fall-2021
---

# How to register resources and create user-assigned managed identities

This article helps you understand the requirements to create device resources, create managed application resources, and user-assigned managed identity for deploying network functions.

## <a name="permissions"></a>Resource provider registration and permissions

Azure Network Function Manager resources are within Microsoft.HybridNetwork resource provider. Register the subscription ID with Microsoft.HybridNetwork resource provider. For more information on how to register, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

### Device resource accounts

The accounts you use to create the Network Function Manager device resource must be assigned to a custom role that is assigned the necessary actions from the following table. For more information, see [Custom roles](../role-based-access-control/custom-roles.md).

| Name | Action|
|---|---|
| Microsoft.DataBoxEdge/dataBoxEdgeDevices/read|Required to read the Azure Stack Edge resource on which network functions will be deployed. |
|Microsoft.DataBoxEdge/dataBoxEdgeDevices/getExtendedInformation/action |Required to read the properties section of Azure Stack edge resource. |
|Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/write |Required to create the Network Function Manager device resource on Azure Stack Edge resource.|
| Microsoft.HybridNetwork/devices/* | Required to create, update, delete the Network Function Manager device resource. |

### Managed applications resource accounts

The accounts you use to create the Azure managed applications resource must be assigned to a [custom role](../role-based-access-control/custom-roles.md) that is assigned the necessary actions from the following table: 

|Name |Action |
|---|---|
|[Managed Application Contributor Role](../role-based-access-control/built-in-roles.md#managed-application-contributor-role)|Required to create Managed app resources.|

## <a name="managed-identity"></a>Managed identity

Network function partners that offer their Azure managed applications with Network Function Manager provide an experience that allows you to a deploy a managed application that is attached to an existing Network Function Manager device resource. When you deploy the partner-managed application in the Azure portal, you are required to provide an Azure user-assigned managed Identity resource that has access to the Network Function Manager device resource. The user-assigned managed identity allows the managed application resource provider and the publisher of the network function appropriate permissions to Network Function Manager device resource that is deployed outside the managed resource group. For more information, see [Manage a user-assigned managed identity in the Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

To create a user-assigned managed identity for deploying network functions:

1. Create user-assigned managed identity and assign it to a custom role with permissions for Microsoft.HybridNetwork/devices/join/action. For more information, see [Manage a user-assigned managed identity in the Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

1. Provide this managed identity when creating a partner’s managed application in the Azure portal. For more information, see [Assign a managed identity access to a resource using the Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md).

## Next steps

For more information, see the [Network Function Manager FAQ](faq.md).
