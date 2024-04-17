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

Azure role-based access control (Azure RBAC) is an authorization system built on [Azure Resource Manager](../azure-resource-manager/management/overview.md) that provides fine-grained access management of Azure resources.

The Azure RBAC model allows users to set permissions on different scope levels: management group, subscription, resource group, or individual resources.  Azure RBAC for key vault also allows users to have separate permissions on individual keys, secrets, and certificates

For more information, see [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).

#### Built-in roles

Azure Operator Nexus provides the following built-in roles.

| Role                                               | Description                                                                                                                                               |
|----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Operator Nexus Keyset Administrator Role (Preview) | Manage interactive access to Azure Operator Nexus Compute resources by adding, removing, and updating baremetal machine (BMM) and baseboard management (BMC) keysets. |
|                                                    |                                                                                                                                                           |