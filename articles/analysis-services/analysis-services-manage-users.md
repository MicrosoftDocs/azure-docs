---
title: Manage users in Azure Analysis Services | Microsoft Docs
description: Learn how to manage users on an Analysis Services server in Azure.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''
tags: ''

ms.assetid: 
ms.service: analysis-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 04/18/2016
ms.author: owend

---
# Manage users in Azure Analysis Services
In Azure Analysis Services, there are two types of users, server administrators and database users. 

## Server administrators
You can use **Analysis Services Admins** in the control blade for your server in Azure portal, or Server Properties in SSMS to manage server administrators. Analysis Services Admins are database server administrators with rights for common database administration tasks such as adding and removing databases and managing users. By default, the user that creates the server in Azure portal is automatically added as an Analysis Services Admin.

![Server Admins in Azure portal](./media/analysis-services-manage-users/aas-manage-users-admins.png)

You should also know:

* Windows Live ID is not a supported identity type for Azure Analysis Services.  
* Analysis Services Admins must be valid Azure Active Directory users.
* If creating an Azure Analysis Services server via Azure Resource Manager templates, Analysis Services Admins takes a JSON array of users that should be added as admins.

Analysis Services Admins can be different from Azure resource administrators, which can manage resources for Azure subscriptions. This maintains compatibility with existing XMLA and TMSL manage behaviors in Analysis Services and to allow you to segregate duties between Azure resource management and Analysis Services database management. To view all roles and access types for your Azure Analysis Services resource, use Access control (IAM) on the control blade.

### To add administrators using Azure portal
1. In the control blade for your server, click **Analysis Services Admins**.
2. In the **\<servername> - Analysis Services Admins** blade, click **Add**.
3. In the **Add Server Administrators** blade, select the users accounts to add.

## Database users
Database users must be added to database roles. Roles define users and groups that have the same permissions for a database. By default, tabular model databases have a default Users role with Read permissions. To learn more, see [Roles in tabular models](https://msdn.microsoft.com/library/hh213165.aspx).

Azure Analysis Services model database users *must be in your Azure Active Directory*. Usernames specified must be by organizational email address or UPN. This is different from on-premises tabular model databases, which support users by Windows domain usernames. 

You can create database roles, add users and groups to roles, and configure row-level security in SQL Server Data Tools (SSDT) or in SQL Server Management Studio (SSMS). You can also add or remove users to roles by using [Analysis Services PowerShell cmdlets](https://msdn.microsoft.com/library/hh758425.aspx) or by using [Tabular Model Scripting Language](https://msdn.microsoft.com/library/mt614797.aspx) (TMSL).

**Sample TMSL script**

In this sample, a user and a group are added to the Users role for the SalesBI database.

```
{
  "createOrReplace": {
    "object": {
      "database": "SalesBI",
      "role": "Users"
    },
    "role": {
      "name": "Users",
      "description": "All allowed users to query the model",
      "modelPermission": "read",
      "members": [
        {
          "memberName": "user1@contoso.com",
          "identityProvider": "AzureAD"
        },
        {
          "memberName": "group1@contoso.com",
          "identityProvider": "AzureAD"
        }
      ]
    }
  }
}
```

## Role-Based Access Control (RBAC)

Subscription administrators can use **Access control** in the control blade to configure roles. This is not the same as server admins or database users, which as described above are configured at the server or database level. 

![Access control in Azure portal](./media/analysis-services-manage-users/aas-manage-users-rbac.png)

Roles apply to users or accounts that need to perform tasks that can be completed in the portal or by using Azure Resource Manager templates. To learn more, see [Role-Based Access Control](../active-directory/role-based-access-control-what-is.md).

## Next steps
If you haven't already deployed a tabular model to your server, now is a good time. To learn more, see [Deploy to Azure Analysis Services](analysis-services-deploy.md).

If you've deployed a model to your server, you're ready to connect to it using a client or browser. To learn more, see [Get data from Azure Analysis Services server](analysis-services-connect.md).

