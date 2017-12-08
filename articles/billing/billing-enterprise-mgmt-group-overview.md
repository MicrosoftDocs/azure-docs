---
title: Organize your resources with Azure Management Groups - Azure | Microsoft Docs
description: Learn about the management groups and how to use them. 
author: rthorn17
manager: rithorn
editor: ''

ms.assetid: 482191ac-147e-4eb6-9655-c40c13846672
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/07/2017
ms.author: rithorn
---


# Organize your resources with Azure Management Groups 

If you have multiple subscriptions, you can organize them into containers called “management groups" to help you manage access, policy, and compliance across your subscriptions. As an example, you can apply policies to a management group that limit which resource types can be created. These policies inherit to all the resources contained under that management group. 

>![NOTE] This feature in a Private Preview. More information will be released soon on the public preview of Azure Management Groups

Management groups, along with your subscriptions, can be organized into a hierarchy. The structure shown is a sample representation of a management group hierarchy that can exist:

![hierarchy tree](media/billing-enterprise-mgmt-groups/mg-hierarchy.png)

A hierarchy tree can be created to support any number of scenarios that might be needed for your environment. An example scenario that is common for users with multiple subscriptions is the assignment of user accesses.  Linking subscriptions together under a management group and assigning access to the group makes those accesses inherit to all the child resources (Subscriptions, Resource Groups, Resources). 

### Important facts about management groups
- 10,000 management groups can be supported in a directory 
- A hierarchy tree can support up to six levels in depth 
- Each management group can only support one parent
- Each management group can have multiple children 
- Each directory has a root management group by default
    - This root management group cannot be moved or deleted

# API commands 
Management group functions are only available through an API.  Users can create, search, update, delete, and link other groups/ subscriptions to a management group through the API.  


## Create a management group
## Update a management group
## Delete a management group
## Search for a management group
## Link subscriptions or other management groups together 


## Policy management
Resource Manager enables you to create customized policies for managing your resources. With management groups, polices can be assigned at any level in the hierarchy and the resources inherit those policies.  [Learn more](https://go.microsoft.com/fwlink/?linkid=858942)

> [!Note]
> Policy is not enforced across directories. 


