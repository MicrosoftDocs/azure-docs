---
title: Set up and manage self-service access to VMware resources through Azure RBAC
description: Learn how to manage access to your on-premises VMware resources through Azure Role-Based Access Control (RBAC). 
ms.topic: how-to
ms.date: 08/21/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
# Customer intent: As a VI admin, I want to manage access to my vCenter resources in Azure so that I can keep environments secure
---

# Set up and manage self-service access to VMware resources

Once your VMware vSphere resources are enabled in Azure, the final step in setting up a self-service experience for your teams is to provide them with access. This article describes how to use built-in roles to manage granular access to VMware resources through Azure Role-based Access Control (RBAC) and allow your teams to deploy and manage VMs.

## Prerequisites

- Your vCenter must be connected to Azure Arc.
- Your vCenter resources such as Resourcepools/clusters/hosts, networks, templates, and datastores must be Arc-enabled.
- You must have User Access Administrator or Owner role at the scope (resource group/subscription) to assign roles to other users.


## Provide access to use Arc-enabled vSphere resources

To provision VMware VMs and change their size, add disks, change network interfaces, or delete them, your users need to have permissions on the compute, network, storage, and to the VM template resources that they will use. These permissions are provided by the built-in **Azure Arc VMware Private Cloud User** role. 

You must assign this role on individual resource pool (or cluster or host), network, datastore, and template that a user or a group needs to access.   

1. Go to the [**VMware vCenters (preview)** list in Arc center](https://portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/vCenter).

2. Search and select your vCenter. 

3. Navigate to the **Resourcepools/clusters/hosts** in **vCenter inventory** section in the table of contents.

3. Find and select resourcepool (or cluster or host). This will take you to the Arc resource representing the resourcepool.

4. Select **Access control (IAM)** in the table of contents.

5. Select **Add role assignments** on the **Grant access to this resource**.

6. Select **Azure Arc VMware Private Cloud User** role and select **Next**.

7. Select **Select members** and search for the Azure Active Directory (Azure AD) user or group that you want to provide access.

8. Select the Azure AD user or group name. Repeat this for each user or group to which you want to grant this permission.

9. Select **Review + assign** to complete the role assignment. 

10. Repeat steps 3-9 for each datastore, network, and VM template that you want to provide access to. 

If you have organized your vSphere resources into a resource group, you can provide the same role at the resource group scope. 

Your users now have access to VMware vSphere cloud resources. However, your users will also need to have permissions on the subscription/resource group where they would like to deploy and manage VMs. 

## Provide access to subscription or resource group where VMs will be deployed

In addition to having access to VMware vSphere resources through the **Azure Arc VMware Private Cloud User**, your users must have permissions on the subscription and resource group where they deploy and manage VMs. 

The **Azure Arc VMware VM Contributor** role is a built-in role that provides permissions to conduct all VMware virtual machine operations. 

1. Go to the [Azure portal](https://portal.azure.com/).

2. Search and navigate to the subscription or resource group to which you want to provide access. 

3. Select **Access control (IAM)** in the table of contents on the left.

4. Select **Add role assignments** on the **Grant access to this resource**.

5. Select **Azure Arc VMware VM Contributor** role and select **Next**.

6. Select the option **Select members**, and search for the Azure Active Directory (Azure AD) user or group that you want to provide access.

8. Select the Azure AD user or group name. Repeat this for each user or group to which you want to grant this permission.

9. Select on **Review + assign** to complete the role assignment. 


## Next steps

[Create a VM using Azure Arc-enabled vSphere](quick-start-create-a-vm.md).
