---
title: Built-in RBAC Roles 
description: Learn about the built-in RBAC roles for Azure IoT Operations and how to use them to control access to resources.
author: dominicbetts
ms.author: dobett
ms.topic: reference
ms.date: 07/29/2025

#CustomerIntent: As an IT administrator, I want to configure Azure RBAC built-in roles on resources in my Azure IoT Operations instance to control access to them.
---

# Built-in RBAC roles for IoT Operations

Azure IoT Operations (AIO) offers two built-in roles designed to simplify and secure access management for AIO resources: Azure IoT Operations Administrator and Azure IoT Operations Onboarding. If your scenario requires more granular access, you can [create a custom RBAC role](../reference/custom-rbac.md).

> [!IMPORTANT]
> The built-in roles for AIO streamline access management for AIO resources, but don't automatically grant permissions for all required Azure dependencies. AIO relies on several Azure services, such as Azure Key Vault, Azure Storage, Azure Arc, and others. Always review and assign the necessary additional roles to ensure users have end-to-end access for successful AIO deployment and operation.

## Azure IoT Operations Administrator role

The Azure IoT Operations Administrator role provides comprehensive permissions to manage and operate all Azure IoT Operations components. Assign this role to users who need full access to use AIO resources. To support deployment and ongoing management of AIO, users require additional permissions. If a user only needs to use AIO, you can assign the Administrator role alone.

When assigning this built-in role, you need to ensure that the following roles are also assigned to the user:

- Azure Edge Hardware Center Administrator role: This role grants access to manage and take action as an edge order administrator. It is used for ordering and managing Azure Stack Edge devices. 
- [Azure Arc Enabled Kubernetes Cluster User role:](/azure/role-based-access-control/built-in-roles/containers#azure-arc-enabled-kubernetes-cluster-user-role) This role is used to manage Azure Arc-enabled Kubernetes clusters by providing permission to write deployments, manage subscriptions, and handle connected clusters and extensions. 
- [Key Vault Administrator role:](/azure/role-based-access-control/built-in-roles/security#key-vault-administrator) This role allows the user to manage all aspects of Azure Key Vaults, including creating, maintaining, viewing, and deleting keys, certificates, and secrets. 
- [Kubernetes Extension Contributor role:](/azure/role-based-access-control/built-in-roles/containers#kubernetes-extension-contributor) This role allows users to manage Kubernetes extensions, including creating, updating, and deleting extensions. 
- [Managed Identity Contributor role:](/azure/role-based-access-control/built-in-roles/identity#managed-identity-contributor) This role allows the user to manage managed identities, including creating, updating, and deleting user-assigned managed identities.
- [Monitoring Contributor role:](/azure/role-based-access-control/built-in-roles/monitor#monitoring-contributor) This role allows the user to read all monitoring data and update monitoring settings.
- Resource Group Contributor role: This role grants permissions to manage resources within a resource group, including creating, updating, and deleting resources.
- Secrets Store Extension Owner role: This role allows the user to manage the Secrets Store extension, which synchronizes secrets from Azure Key Vault to Kubernetes clusters.
- [Storage Account Contributor role:](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor) This role allows the user to manage storage accounts, including creating, updating, and deleting storage accounts, as well as managing access keys and other settings.

## Azure IoT Operations Onboarding role

AIO Onboarding is a specialized role that provides the necessary permissions to deploy Azure IoT Operations components.

When assigning this built-in role, you need to ensure that the following roles are also assigned to the user:

- [Azure Resource Bridge Deployment role:](/azure/role-based-access-control/built-in-roles/hybrid-multicloud#azure-resource-bridge-deployment-role) This role is used to manage the deployment of the Azure Resource Bridge. It includes permissions to read, write, and delete various resources related to the Resource Bridge, such as appliances, locations, and telemetry configurations. 
- [Kubernetes Cluster – Azure Arc Onboarding role:](/azure/role-based-access-control/built-in-roles/containers#kubernetes-cluster---azure-arc-onboarding) This role is used for onboarding Kubernetes clusters to Azure Arc.
-  [Storage Account Contributor role:](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor) This role allows the user to manage storage accounts, including creating, updating, and deleting storage accounts, as well as managing access keys and other settings.
- Resource Group Contributor role: This role grants permissions to manage resources within a resource group, including creating, updating, and deleting resources.
- [Azure Arc Enabled Kubernetes Cluster User role:](/azure/role-based-access-control/built-in-roles/containers#azure-arc-enabled-kubernetes-cluster-user-role) This role is used to manage Azure Arc-enabled Kubernetes clusters by providing permission to write deployments, manage subscriptions, and handle connected clusters and extensions.


