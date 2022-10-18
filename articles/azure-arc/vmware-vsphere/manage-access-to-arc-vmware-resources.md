---
title: Manage access to VMware resources through Azure Role-Based Access Control
description: Learn how to manage access to your on-premises VMware resources through Azure Role-Based Access Control (RBAC). 
ms.topic: how-to
ms.date: 11/08/2021

#Customer intent: As a VI admin, I want to manage access to my vCenter resources in Azure so that I can keep environments secure
---

# Manage access to VMware resources through Azure Role-Based Access Control

Once your VMware vCenter resources have been enabled in Azure, the final step in setting up a self-service experience for your teams is to provide them access.  This article describes how to use built-in roles to manage granular access to VMware resources through Azure and allow your teams to deploy and manage VMs.

## Arc-enabled VMware vSphere built-in roles

There are three built-in roles to meet your access control requirements. You can apply these roles to a whole subscription, resource group, or a single resource.

- **Azure Arc VMware Administrator** role - is used by administrators

- **Azure Arc VMware Private Cloud User** role - is used by anyone who needs to deploy and manage VMs

- **Azure Arc VMware VM Contributor** role - is used by anyone who needs to deploy and manage VMs

### Azure Arc VMware Administrator role

The **Azure Arc VMware Administrator** role is a built-in role that provides permissions to perform all possible operations for the `Microsoft.ConnectedVMwarevSphere` resource provider. Assign this role to users or groups that are administrators managing Azure Arc enabled VMware vSphere deployment.

### Azure Arc VMware Private Cloud User role

The **Azure Arc VMware Private Cloud User** role is a built-in role that provides permissions to use the VMware vSphere resources made accessible through Azure. Assign this role to any users or groups that need to deploy, update, or delete VMs.

We recommend assigning this role at the individual resource pool (or host or cluster), virtual network, or template that you want the user to deploy VMs using.

### Azure Arc VMware VM Contributor

The **Azure Arc VMware VM Contributor** role is a built-in role that provides permissions to conduct all VMware virtual machine operations. Assign this role to any users or groups that need to deploy, update, or delete VMs.

We recommend assigning this role at the subscription or resource group you want the user to deploy VMs using:

## Assigning the roles to users/groups

1. Go to the [Azure portal](https://portal.azure.com).

2. Search and navigate to the subscription, resource group, or the resource at which scope you want to provide this role.

3. To find the Arc-enabled VMware vSphere resources like resource pools, clusters, hosts, datastores, networks, or virtual machine templates:
     1. navigate to the resource group and select the **Show hidden types** checkbox.
     2. search for *"VMware"*.

4. Click on **Access control (IAM)** in the table of contents on the left.

5. Click on **Add role assignments** on the **Grant access to this resource**.

6. Select the custom role you want to assign (one of **Azure Arc VMware Administrator**, **Azure Arc VMware Private Cloud User**, or **Azure Arc VMware VM Contributor**).

7. Search for the Azure Active Directory (Azure AD) user or group to which you want to assign this role.

8. Select the Azure AD user or group name. Repeat this for each user or group to which you want to grant this permission.

9. Repeat the above steps for each scope and role.

## Next steps

[Create a VM using Azure Arc-enabled vSphere](quick-start-create-a-vm.md)
