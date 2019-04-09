---
title: Manage Azure Analysis Services | Microsoft Docs
description: Learn how to manage an Analysis Services server in Azure.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 12/06/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Manage Analysis Services
Once you've created an Analysis Services server in Azure, there may be some administration and management tasks you need to perform right away or sometime down the road. For example, run processing to the refresh data, control who can access the models on your server, or monitor your server's health. Some management tasks can only be performed in Azure portal, others in SQL Server Management Studio (SSMS), and some tasks can be done in either.

## Azure portal
[Azure portal](https://portal.azure.com/) is where you can create and delete servers, monitor server resources, change size, and manage who has access to your servers.  If you're having some problems, you can also submit a support request.

![Get server name in Azure](./media/analysis-services-manage/aas-manage-portal.png)

## SQL Server Management Studio
Connecting to your server in Azure is just like connecting to a server instance in your own organization. From SSMS, you can perform many of the same tasks such as process data or create a processing script, manage roles, and use PowerShell.
  
![SQL Server Management Studio](./media/analysis-services-manage/aas-manage-ssms.png)

### Download and install SSMS
To get all the latest features, and the smoothest experience when connecting to your Azure Analysis Services server, be sure you're using the latest version of SSMS. 

[Download SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms).


### To connect with SSMS
 When using SSMS, before connecting to your server the first time, make sure your username is included in the Analysis Services Admins group. To learn more, see [Server administrators and database users](#server-administrators-and-database-users) later in this article.

1. Before you connect, you need to get the server name. In **Azure portal** > server > **Overview** > **Server name**, copy the server name.
   
    ![Get server name in Azure](./media/analysis-services-deploy/aas-deploy-get-server-name.png)
2. In SSMS > **Object Explorer**, click **Connect** > **Analysis Services**.
3. In the **Connect to Server** dialog box, paste in the server name, then in **Authentication**, choose one of the following authentication types:   
    > [!NOTE]
    > Authentication type, **Active Directory - Universal with MFA support**, is recommended.

    > [!NOTE]
    > If you sign in with a Microsoft Account, Live ID, Yahoo, Gmail, etc., leave the password field blank. You are prompted for a password after clicking Connect.

    **Windows Authentication** to use your Windows domain\username and password credentials.

    **Active Directory Password Authentication** to use an organizational account. For example, when connecting from a non-domain joined computer.

    **Active Directory - Universal with MFA support** to use [non-interactive or multi-factor authentication](../sql-database/sql-database-ssms-mfa-authentication.md). 
   
    ![Connect in SSMS](./media/analysis-services-manage/aas-manage-connect-ssms.png)

## Server administrators and database users
In Azure Analysis Services, there are two types of users, server administrators and database users. Both types of users must be in your Azure Active Directory and must be specified by organizational email address or UPN. To learn more, see [Authentication and user permissions](analysis-services-manage-users.md).


## Troubleshooting connection problems
When connecting using SSMS, if you run into problems, you may need to clear the login cache. Nothing is cached to disc. To clear the cache, close and restart the connect process. 

## Next steps
If you haven't already deployed a tabular model to your new server, now is a good time. To learn more, see [Deploy to Azure Analysis Services](analysis-services-deploy.md).

If you've deployed a model to your server, you're ready to connect to it using a client or browser. To learn more, see [Get data from Azure Analysis Services server](analysis-services-connect.md).

