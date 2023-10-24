---
title:  Custom locations for VMware vSphere
description: Learn about custom locations for VMware vSphere
ms.topic: conceptual
ms.date: 10/23/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri

#Customer intent: As an IT infrastructure admin, I want to know about the concepts behind Azure Arc.
---

# Custom locations for VMware vSphere

As an extension of the Azure location construct, a *custom location* provides a reference as a deployment target which administrators can set up and users can point to when creating an Azure resource. It abstracts the backend infrastructure details from application developers, database admin users, or other users in the organization.

## Custom location for on-premises vCenter server

Since the custom location is an Azure Resource Manager resource that supports [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview), an administrator or operator can determine which users have access to create resource instances on the compute, storage, networking, and other vCenter resources to deploy and manage VMs.

For example, an IT administrator could create a custom location **Contoso-vCenter** representing the vCenter server in your organization's data center. The operator can then assign Azure RBAC permissions to application developers on this custom location so that they can deploy virtual machines. The developers can then deploy these virtual machines without having to know details of the vCenter management server.

Custom locations create the granular [RoleBindings and ClusterRoleBindings](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) necessary for other Azure services to access the VMware resources.

## Next steps

[Connect VMware vCenter Server to Azure Arc](./quick-start-connect-vcenter-to-arc-using-script.md).
