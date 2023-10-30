---
title: Azure Analysis Services authentication and user permissions| Microsoft Docs
description: This article describes how Azure Analysis Services uses Microsoft Entra ID for identity management and user authentication.
author: minewiskan
ms.service: analysis-services
ms.topic: conceptual
ms.date: 02/02/2022
ms.author: owend
ms.reviewer: minewiskan

---
# Authentication and user permissions

Azure Analysis Services uses Microsoft Entra ID for identity management and user authentication. Any user creating, managing, or connecting to an Azure Analysis Services server must have a valid user identity in an [Microsoft Entra tenant](../active-directory/fundamentals/active-directory-whatis.md) in the same subscription.

Azure Analysis Services supports [Microsoft Entra B2B collaboration](../active-directory/external-identities/what-is-b2b.md). With B2B, users from outside an organization can be invited as guest users in a Microsoft Entra directory. Guests can be from another Microsoft Entra tenant directory or any valid email address. Once invited and the user accepts the invitation sent by email from Azure, the user identity is added to the tenant directory. Those identities can be added to security groups or as members of a server administrator or database role.

![Azure Analysis Services authentication architecture](./media/analysis-services-manage-users/aas-manage-users-arch.png)

## Authentication

All client applications and tools use one or more of the Analysis Services [client libraries](/analysis-services/client-libraries?view=azure-analysis-services-current&preserve-view=true) (AMO, MSOLAP, ADOMD) to connect to a server. 

All three client libraries support both Microsoft Entra interactive flow, and non-interactive authentication methods. The two non-interactive methods, Active Directory Password and Active Directory Integrated Authentication methods can be used in applications utilizing AMOMD and MSOLAP. These two methods never result in pop-up dialog boxes for sign in.

Client applications like Excel and Power BI Desktop, and tools like SSMS and Analysis Services projects extension for Visual Studio install the latest versions of the client libraries with regular updates. Power BI Desktop, SSMS, and Analysis Services projects extension are updated monthly. Excel is [updated with Microsoft 365](https://support.microsoft.com/office/when-do-i-get-the-newest-features-for-microsoft-365-da36192c-58b9-4bc9-8d51-bb6eed468516). Microsoft 365 updates are less frequent, and some organizations use the deferred channel, meaning updates are deferred up to three months.

Depending on the client application or tools you use, the type of authentication and how you sign in may be different. Each application may support different features for connecting to cloud services like Azure Analysis Services.

Power BI Desktop, Visual Studio, and SSMS support Active Directory Universal Authentication, an interactive method that also supports Microsoft Entra multifactor authentication (MFA). Microsoft Entra multifactor authentication helps safeguard access to data and applications while providing a simple sign in process. It delivers strong authentication with several verification options (phone call, text message, smart cards with pin, or mobile app notification). Interactive MFA with Microsoft Entra ID can result in a pop-up dialog box for validation. **Universal Authentication is recommended**.

If signing in to Azure by using a Windows account, and Universal Authentication is not selected or available (Excel), [Active Directory Federation Services (AD FS)](/windows-server/identity/ad-fs/deployment/how-to-connect-fed-azure-adfs) is required. With Federation, Microsoft Entra ID and Microsoft 365 users are authenticated using on-premises credentials and can access Azure resources.

### SQL Server Management Studio (SSMS)

Azure Analysis Services servers support connections from [SSMS V17.1](/sql/ssms/download-sql-server-management-studio-ssms) and higher by using Windows Authentication, Active Directory Password Authentication, and Active Directory Universal Authentication. In general, it's recommended you use Active Directory Universal Authentication because:

*  Supports interactive and non-interactive authentication methods.

*  Supports Azure B2B guest users invited into the Azure AS tenant. When connecting to a server, guest users must select Active Directory Universal Authentication when connecting to the server.

*  Supports multifactor authentication (MFA). Microsoft Entra multifactor authentication helps safeguard access to data and applications with a range of verification options: phone call, text message, smart cards with pin, or mobile app notification. Interactive MFA with Microsoft Entra ID can result in a pop-up dialog box for validation.

### Visual Studio

Visual Studio connects to Azure Analysis Services by using Active Directory Universal Authentication with MFA support. Users are prompted to sign in to Azure on the first deployment. Users must sign in to Azure with an account with server administrator permissions on the server they are deploying to. When signing in to Azure the first time, a token is assigned. The token is cached in-memory for future reconnects.

### Power BI Desktop

Power BI Desktop connects to Azure Analysis Services using Active Directory Universal Authentication with MFA support. Users are prompted to sign in to Azure on the first connection. Users must sign in to Azure with an account that is included in a server administrator or database role.

### Excel

Excel users can connect to a server by using a Windows account, an organization ID (email address), or an external email address. External email identities must exist in the Microsoft Entra ID as a guest user.

## User permissions

**Server administrators** are specific to an Azure Analysis Services server instance. They connect with tools like Azure portal, SSMS, and Visual Studio to perform tasks like configuring settings and managing user roles. By default, the user that creates the server is automatically added as an Analysis Services server administrator. Other administrators can be added by using Azure portal or SSMS. Server administrators must have an account in the Microsoft Entra tenant in the same subscription. To learn more, see [Manage server administrators](analysis-services-server-admins.md). 

**Database users** connect to model databases by using client applications like Excel or Power BI. Users must be added to database roles. Database roles define administrator, process, or read permissions for a database. It's important to understand database users in a role with administrator permissions is different than server administrators. However, by default, server administrators are also database administrators. To learn more, see [Manage database roles and users](analysis-services-database-users.md).

**Azure resource owners**. Resource owners manage resources for an Azure subscription. Resource owners can add Microsoft Entra user identities to Owner or Contributor Roles within a subscription by using **Access control** in Azure portal, or with Azure Resource Manager templates. 

![Access control in Azure portal](./media/analysis-services-manage-users/aas-manage-users-rbac.png)

Roles at this level apply to users or accounts that need to perform tasks that can be completed in the portal or by using Azure Resource Manager templates. To learn more, see [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). 

## Database roles

 Roles defined for a tabular model are database roles. That is, the roles contain members consisting of Microsoft Entra users and security groups that have specific permissions that define the action those members can take on a model database. A database role is created as a separate object in the database, and applies only to the database in which that role is created.   
  
 By default, when you create a new tabular model project, the model project does not have any roles. Roles can be defined by using the Role Manager dialog box in Visual Studio. When roles are defined during model project design, they are applied only to the model workspace database. When the model is deployed, the same roles are applied to the deployed model. After a model has been deployed, server and database administrators can manage roles and members by using SSMS. To learn more, see [Manage database roles and users](analysis-services-database-users.md).
  
## Considerations and limitations

* Azure Analysis Services does not support the use of One-Time Password for B2B users
  
## Next steps

[Manage access to resources with Microsoft Entra groups](../active-directory/fundamentals/active-directory-manage-groups.md)   
[Manage database roles and users](analysis-services-database-users.md)  
[Manage server administrators](analysis-services-server-admins.md)  
[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)
