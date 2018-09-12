---
title: Manage server admins in Azure Analysis Services | Microsoft Docs
description: Learn how to manage server admins for an Analysis Services server in Azure.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 06/20/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Manage server administrators
Server administrators must be a valid user or security group in the Azure Active Directory (Azure AD) for the tenant in which the server resides. You can use **Analysis Services Admins** for your server in Azure portal, or Server Properties in SSMS to manage server administrators. 

> [!NOTE]
> Security groups must have the `MailEnabled` property set to `True`.

## To add server administrators by using Azure portal
1. In the portal, for your server, click **Analysis Services Admins**.
2. In **\<servername> - Analysis Services Admins**, click **Add**.
3. In **Add Server Administrators**, select user accounts from your Azure AD or invite external users by email address.

    ![Server Admins in Azure portal](./media/analysis-services-server-admins/aas-manage-users-admins.png)

## To add server administrators by using SSMS
1. Right-click the server > **Properties**.
2. In **Analysis Server Properties**, click **Security**.
3. Click **Add**, and then enter the email address for a user or group in your Azure AD.
   
    ![Add server administrators in SSMS](./media/analysis-services-server-admins/aas-manage-users-ssms.png)

## Next steps 
[Authentication and user permissions](analysis-services-manage-users.md)  
[Manage database roles and users](analysis-services-database-users.md)  
[Role-Based Access Control](../role-based-access-control/overview.md)  

