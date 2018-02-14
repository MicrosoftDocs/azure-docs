---
title: Organize your resources with Azure Management Groups - Azure | Microsoft Docs
description: Learn about the management groups and how to use them. 
author: rthorn17
manager: rithorn
editor: ''

ms.assetid: 482191ac-147e-4eb6-9655-c40c13846672
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/14/2018
ms.author: rithorn
---


# Organize your resources with Azure Management Groups 
## Management group overview

If you have multiple subscriptions, you can organize them into containers called “management groups" to help you manage access, policy, and compliance across your subscriptions. These containers give you enterprise-grade management at a large scale no matter what type of subscriptions you might have.  

The management group feature is available in a public preview. To start using management groups, login to the [Azure portal](https://portal.azure.com) and search for "Management Groups" in the "More Services" section.  

As an example, you can apply policies to a management group that limits the regions available for virtual machine (VM) creation. This policy would be applied to all management groups, subscriptions, and resources under that management group by only allowing VMs to be created in that region.   

You can build a flexible structure of management groups and subscriptions to organize your resources into a hierarchy for unified policy and access management. 
The following diagram shows an example hierarhcy that consists of management groups and subscriptions organized by departments.    

![hierarchy tree](media/management-groups/MG_overview.png)

By creating a hierhacy that is broken out by department, you are able to assign a [Azure Role-Based Access Control(RBAC)](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-what-is) role to one group and have it inherit to all the departments under that management group. This simplifies your work by only having to assign the role once.  In addition to only having to assign the role once, you also have one location to maintain the access if you need to change it later.  This reduces your workload and reduces the risk of error.  

### Important facts about management groups
- 10,000 management groups can be supported in a single directory. 
- A management group tree can support up to six levels in-depth.
    - This limit does not include the Root level or the subscription level.
- Each management group can only support one parent.
- Each management group can have multiple children. 

## Root management group for each directory

Each directory is given a single top level management group called the "Root" management group that all other managmeent groups and subscriptiosn should fold up to.  This Root managmeent group allows for global policies and RBAC assignments to be applied at the directory level. The Directory Administrator needs to elevates themselves to be the owner of this root group initially. Once the administrator is the owner of the group, they can assign any RBAC role to other directory users or groups to manage the hierarchy.  

### Important facts about the Root management group
- The root management group's name and ID are given the Azure Active Directory ID by default. The display name can be updated at any time to show different within the Azure portal. 
- All subscriptions and management groups can fold up to the one root management group within the directory.  
    - It is recommended to have all items in the directory fold up to the Root management group for global management.  
    - During the Public Preview, all subscriptions within the directory are not automatically made children of the root.   
    - During the Public Preview, new subscriptions are not automatically defaulted to the Root management group. 
- The Root management group cannot be moved or deleted, unlike other management groups. 
- All new management groups have their parent group defaulted to the root management group when created.
  
## Management Group Access

Azure Management Groups supports [Azure Role-Based Access Control(RBAC)](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-what-is) for all resource accesses and role definitions. These permissions are inherited to child resources that exist in the hierarchy.   

While any [built-in RBAC role](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-what-is#built-in-roles) can be assigned to a management group, there are four roles that are commonly used: 
- **Owner** has full access to all resources including the right to delegate access to others. 
- **Contributor** can create and manage all types of Azure resources but can't grant access to others.
- **Resource Policy Contributor** can create and manage policies in the directory on the resources.     
- **Reader** can view existing Azure resources.

>![Note] For the public preview, custom RBAC roles are not supported. 

### Assigning RBAC in the public preview 
Assignment of RBAC roles to management groups is only available via PowerShell/CloudShell, REST API, or CLI.  

The page "[Manage Role-Based Access Control with Azure PowerShell](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-manage-access-powershell)"  provides the full list of PowerShell commands that are available. 

It is important to note the management group scope when doing a policy assignment is shown here.  

```powershell
/providers/Microsoft.Management/ManagementGroups/<groupID>
``` 


# How-to guide

