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
ms.date: 01/26/2018
ms.author: rithorn
---


# Organize your resources with Azure Management Groups 

If you have multiple subscriptions, you can organize them into containers called “management groups" to help you manage access, policy, and compliance across your subscriptions. These containers give you enterprise grade management at scale no matter what type of subscriptions you might have.  

As an example, you can apply policies to a management group that limit the regions available for virtual machine (VM) creation. This policy would be applied to all management groups, subscriptions, and resources under that management group by only allowing VMs to be created in that region.   

>![NOTE] This feature will be introducted as a Public Preview in February 2018. If you would like to learn more about this feature, contact ManagementGroups@Microsoft.com. 

Azure Customers can build a flexible structure of management groups and subscriptions to organize their resources into a hierarchy for unified policy and access management. 
The structure shown is a sample of a management group hierarchy that can exist:

![hierarchy tree](media/management-groups/mg_overview.png)

Change is always constant and customers have the need to always be updating their hierarchy. To help with these frequent changes, you are able to easily re-parent management groups and subscriptions to change the hierarchy. You will be able to move whole branches or just individual resources around in the hierarchy to keep it updated. 

For example, another common scenario for customers is the repetitive work needed to apply resource accesses to each subscription they manage. With management groups, the customer can simplify their process by only needing to apply an RBAC role for a person to one management group that has all the subscriptions under it. With the access control assigned on the management group, it allows for a single location of management for the RBAC role and its inheritance to all the child resources.    

### Important facts about management groups
- 10,000 management groups can be supported in a single directory 
- A hierarchy tree can support up to six levels in depth 
- Each management group can only support one parent
- Each management group can have multiple children 
- To remove a management group, no children can be linked to the management group


## Root management group for each directory

Each directory is given one "Root" management group that allows for global policies to be applied. The Directory Administrator needs to escalate themselves to be the owner of this root group initially. Once the administrator is the owner of the group, they can assign any RBAC roles to other people so that they can manage the hierarchy.  

### Important facts about the Root management Group
- The root management group is given the Directory ID as the name by default. The display name can be updated at any time to show different within the Azure portal.  
- All resources, including subscriptions and management groups, fold up to the one root management group within the directory.  
    - A subscription or management group's parent is defaulted to the root management group. 
- This root management group is special in that it cannot be moved or deleted unlike other management groups. 
- All new management groups and subscriptions have their parent group defaulted to the root management group when created.    
- For any directory that existed before February 2018, the root group does not exist unless two actions happen. They are: 
    - The Directory Administrator goes to the Azure Management Group page within the Azure portal and "Enables Management Groups."
    - When any subscription owner creates a new management group, the backend process runs to create the root management group. The Subscription Owner that did create the new management group does not have any access to the root group by default in this process.   

## Management Group Access

Azure Management Groups supports [Azure Role-Based Access Control(RBAC)](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-what-is) for all resource accesses and role definitions. These permissions are inherited to child resources that exist in the hierarchy.   

While any [built-in RBAC role](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-what-is#built-in-roles) can be assigned to a management group, there are four roles that are commonly used: 
- **Owner** has full access to all resources including the right to delegate access to others. 
- **Contributor** can create and manage all types of Azure resources but can't grant access to others.
- **Resource Policy Contributor** can create and manage policies in the directory on the resources.     
- **Reader** can view existing Azure resources.

>![Note] For the Public Preview, Custom RBAC Roles are not supported. 