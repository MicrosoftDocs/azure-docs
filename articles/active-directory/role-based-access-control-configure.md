---
title: Role-Based Access Control in the Azure portal | Microsoft Docs
description: Get started in access management with Role-Based Access Control in the Azure Portal. Use role assignments to assign permissions to your resources.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: ''

ms.assetid: 8078f366-a2c4-4fbb-a44b-fc39fd89df81
ms.service: active-directory
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/27/2017
ms.author: kgremban

---
# Use Role-Based Access Control to manage access to your Azure subscription resources
> [!div class="op_single_selector"]
> * [Manage access by user or group](role-based-access-control-manage-assignments.md)
> * [Manage access by resource](role-based-access-control-configure.md)

Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can grant only the amount of access that users need to perform their jobs. This article helps you get up and running with RBAC in the Azure portal. If you want more details about how RBAC helps you manage access, see [What is Role-Based Access Control](role-based-access-control-what-is.md).

Within each subscription, you can grant up to 2000 role assignments. 

## View access
You can see who has access to a resource, resource group, or subscription from its main blade in the [Azure portal](https://portal.azure.com). For example, we want to see who has access to one of our resource groups:

1. Select **Resource groups** in the navigation bar on the left.  
    ![Resource groups - icon](./media/role-based-access-control-configure/resourcegroups_icon.png)
2. Select the name of the resource group from the **Resource groups** blade.
3. Select **Access control (IAM)** from the left menu.  
4. The Access control blade lists all users, groups, and applications that have been granted access to the resource group.  
   
    ![Users blade - inherited vs assigned access screenshot](./media/role-based-access-control-configure/view-access.png)

Notice that some users were **Assigned** access while others **Inherited** it. Access is either assigned specifically to the resource group or inherited from an assignment to the parent subscription.

> [!NOTE]
> Classic subscription admins and co-admins are considered owners of the subscription in the new RBAC model.

## Add Access
You grant access from within the resource, resource group, or subscription that is the scope of the role assignment.

1. Select **Add** on the Access control blade.  
2. Select the role that you wish to assign from the **Select a role** blade.
3. Select the user, group, or application in your directory that you wish to grant access to. You can search the directory with display names, email addresses, and object identifiers.  
   
    ![Add users blade - search screenshot](./media/role-based-access-control-configure/grant-access2.png)
4. Select **OK** to create the assignment. The **Adding user** popup tracks the progress.  
    ![Adding user progress bar - screenshot](./media/role-based-access-control-configure/addinguser_popup.png)

After successfully adding a role assignment, it will appear on the **Users** blade.

## Remove Access
1. Use the check boxes on the Access control blade to select one or more role assignments.
2. Select **Remove**.  
3. A box will pop up asking you to confirm the action. Select **Yes** to remove the role assignments.

Inherited assignments cannot be removed. If you need to remove an inherited assignment, you need to do it at the scope where the role assignment was created. In the **Scope** column, next to **Inherited** there is a link that takes you to the resources where this role was assigned. Go to the resource listed there to remove the role assignment.

![Users blade - inherited access disables remove button screenshot](./media/role-based-access-control-configure/remove-access2.png)

## Other tools to manage access
You can assign roles and manage access with Azure RBAC commands in tools other than the Azure portal.  Follow the links to learn more about the prerequisites and get started with the Azure RBAC commands.

* [Azure PowerShell](role-based-access-control-manage-access-powershell.md)
* [Azure Command-Line Interface](role-based-access-control-manage-access-azure-cli.md)
* [REST API](role-based-access-control-manage-access-rest.md)

## Next Steps
* [Create an access change history report](role-based-access-control-access-change-history-report.md)
* See the [RBAC built-in roles](role-based-access-built-in-roles.md)
* Define your own [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md)

