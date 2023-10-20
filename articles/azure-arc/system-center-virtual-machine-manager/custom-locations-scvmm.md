---
title: Custom locations for Arc-enabled SCVMM
description: Learn about Custom locations. 
ms.topic: Concepts
ms.date: 10/20/2023
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.services: azure-arc
ms.subservice: azure-arc-scvmm

#Customer intent: As an IT infrastructure admin, I want to know about the concepts behind Azure Arc
---

# Custom locations for Arc-enabled SCVMM

As an extension of the Azure location construct, a *custom location* provides a reference as deployment target which administrators can set up, and users can point to, when creating an Azure resource. It abstracts the backend infrastructure details from application developers, database admin users, or other users in the organization.
Since the custom location is an Azure Resource Manager resource that supports [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md), an administrator or operator can determine which users have access to create resource instances on the compute, storage, networking, and other SCVMM resources to deploy and manage VMs.
For example, an IT administrator could create a custom location **Contoso-vmm** representing the SCVMM management server in your organization's Data Center. The operator can then assign Azure RBAC permissions to application developers on this custom location so that they can deploy virtual machines. The developers can then deploy these virtual machines without having to know details of the SCVMM management server.
Custom locations create the granular [RoleBindings and ClusterRoleBindings](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) necessary for other Azure services to access the SCVMM resources.

## Next steps
[Connect your SCVMM Server to Azure Arc](../azure-arc/system-center-virtual-machine-manager/quickstart-connect-system-center-virtual-machine-manager-to-arc.md)

