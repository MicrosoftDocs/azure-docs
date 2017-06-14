---
title: Authentication and user permissions in Azure Analysis Services | Microsoft Docs
description: Learn about authentication and user permissions in Azure Analysis Services.
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
ms.date: 06/14/2016
ms.author: owend

---
# Authentication and user permissions
Azure Analysis Services uses Azure Active Directory (Azure AD) for identity management and user authentication. Any user creating, managing, or connecting to an Azure Analysis Services server must have a user account in an Azure AD tenant in the same subscription.

Azure Analysis Services also supports [Azure AD B2B collaboration](../active-directory/active-directory-b2b-what-is-azure-ad-b2b.md). With B2B, users from outside an organization can be invited as guest users in an Azure AD tenant. Guests can be from another Azure AD tenant or any valid email address, including Microsoft accounts. Once invited and added to the tenant directory, they can then be added to security groups or as members to a server or model database role.

![Azure Analysis Services authentication architecture](./media/analysis-services-manage-users/aas-manage-users-arch.png)

## Authentication
All client applications and tools use one or more of the Analysis Services [client libraries](analysis-services-data-providers.md) (AMO, MSOLAP, ADOMD) to connect to a server. Client applications like Excel and Power BI Desktop, and tools like SSMS and SSDT install the latest versions of the libraries when updated to the latest release. SSMS and SSDT are updated monthly. Excel, however, is [updated with Office 365](https://support.office.com/en-us/article/When-do-I-get-the-newest-features-in-Office-2016-for-Office-365-da36192c-58b9-4bc9-8d51-bb6eed468516). Some organizations use the deferred channel, meaning updates are deferred up to three months.

 Depending on client application or tool you use, the type of authentication and how you sign in may be different. This is because each application may support different features for connecting to cloud services like Azure Analysis Services. 


### SQL Server Management Studio (SSMS)
Azure Analysis Services servers support connections from [SSMS V17.1](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) and higher by using Windows Authentication, Active Directory Password Authentication, and Active Directory Universal Authentication. In general, it's recommended you use Active Directory Universal Authentication because:

*  Supports the two non-interactive authentication methods: Active Directory Password Authentication and Active Directory Integrated Authentication. Non-interactive Active Directory Password and Active Directory Integrated Authentication methods can be used in applications utilizing AMOMD and MSOLAP. These two methods never result in pop-up dialog boxes.

*  Supports Azure B2B guest users invited into the Azure AS tenant. When connecting to a server, guest users must select Active Directory Universal Authentication when connecting to the server.

*  Supports Multi-Factor Authentication (MFA). Azure MFA helps safeguard access to data and applications with a range of verification options: phone call, text message, smart cards with pin, or mobile app notification. Interactive MFA with Azure AD can result in a pop-up dialog box for validation.

### SQL Server Data Tools (SSDT)
Azure Analysis Services servers support connections from [SSMS V17.1](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) and higher. Users will be prompted to log in to Azure on the first deployment. Users must log in to Azure with an account with server administrator permissions on the server they are deploying to. Multi-Factor Authentication (MFA) is not supported when connecting to and deploying model projects from SSDT.

### Client applications


## User permissions - administrators and users
In Azure Analysis Services, **Server administrators** connect to a server by using tools like Azure portal, SSMS, and SSDT to perform tasks such as adding and removing databases, and managing user roles. By default, the user that creates the server is automatically added as an Analysis Services server administrator. Other administrators can be added by using Azure portal or SSMS. To learn more, see [Manage server administrators](analysis-servies-server-admins.md).

**Database users** connect to model databases by using client applications like Excel or Power BI. Users must be added to database roles. Those roles define administrator, process, or read permissions for a database. It's important to understand database users in a role with administrator permissions is different than server administrators. However, by default, server administrators are also database administrators. To learn more, see [Manage database roles and users](analysis-services-database-users.md).

In addition to database users and server administrators, that are specific to an Analysis Services server, there are also **Azure resource administrators**. Resource administrators manage resources for an Azure subscription. They can add Azure AD user identities to Owner or Contributor Roles within a subscription by using Access control in Azure portal. 

![Access control in Azure portal](./media/analysis-services-manage-users/aas-manage-users-rbac.png)

Roles at this level apply to users or accounts that need to perform tasks that can be completed in the portal or by using Azure Resource Manager templates. To learn more, see [Role-Based Access Control](../active-directory/role-based-access-control-what-is.md). 

By having seperate resource administrators and server administrators,  existing XMLA and TMSL manage behaviors in Analysis Services allow you to segregate duties between Azure resource management and Analysis Services database management. 


## Database roles

 Roles defined for a tabular model are database roles. That is, the roles contain members consisting of users or groups that have specific permissions that define the action those members can take on the model database. A database role is created as a separate object in the database, and applies only to the database in which that role is created.   
  
 By default, when you create a new tabular model project, the model project does not have any roles. Roles can be defined by using the Role Manager dialog box in SSDT. When roles are defined during model project design, they are applied only to the model workspace database. When the model is deployed, the same roles are applied to the deployed model. After a model has been deployed, server and database administrators can manage roles and members by using SSMS.  
  
###  <a name="bkmk_permissions"></a> Permissions  
Each role has a single permission (except for the combined Read and Process permission). By default, a new role in SSDT will have the None permission. That is, once members are added to the role with the None permission, they cannot modify the database, run a process operation, query data, or see the database unless a different permission is granted.  
  
A group or user can be a member of any number of roles, each role with a different permission. When a user is a member of multiple roles, the permissions defined for each role are cumulative. For example, if a user is a member of a role with the Read permission, and also a member of a role with None permission, that user will have Read permissions.  
  
By using Role Manager in SSDT, each role can have one the following permissions:  
  
|Permissions|Description|Row filters using DAX|  
|-----------------|-----------------|----------------------------|  
|None|Members cannot make any modifications to the model database schema and cannot query data.|Row filters do not apply. No data is visible to users in this role|  
|Read|Members are allowed to query data (based on row filters) but cannot see the model database in SSMS, cannot make any changes to the model database schema, and the user cannot process the model.|Row filters can be applied. Only data specified in the row filter DAX formula is visible to users.|  
|Read and Process|Members are allowed to query data (based on row-level filters) and run process operations by running a script or package that contains a process command, but cannot make any changes to the database. Cannot view the model database in SSMS.|Row filters can be applied. Only data specified in the row filter DAX formula can be queried.|  
|Process|Members can run process operations by running a script or package that contains a process command. Cannot modify the model database schema. Cannot query data. Cannot query the model database in SSMS.|Row filters do not apply. No data can be queried in this role|  
|Administrator|Members can make modifications to the model schema and can query all data in the model designer, reporting client, and SSMS.|Row filters do not apply. All data can be queried in this role.|  
  
###  <a name="bkmk_rowfliters"></a> Row filters  
Row filters define which rows in a table can be queried by members of a particular role. Row filters are defined for each table in a model by using DAX formulas.  
  
Row filters can be defined only for roles with Read and Read and Process permissions. By default, if a row filter is not defined for a particular table, members of a role that has Read or Read and Process permission can query all rows in the table unless cross-filtering applies from another table.  
  
Once a row filter is defined for a table, a DAX formula, which must evaluate to a TRUE/FALSE value, defines the rows that can be queried by members of that particular role. Rows not included in the DAX formula cannot be queried. For example, for members of the Sales role, the Customers table with the following row filters expression, *=Customers [Country] = “USA”*, members of the Sales role, will only be able to see customers in the USA.  
  
Row filters apply to the specified rows as well as related rows. When a table has multiple relationships, filters apply security for the relationship that is active. Row filters will be intersected with other row filers defined for related tables, for example:  
  
|Table|DAX expression|  
|-----------|--------------------|  
|Region|=Region[Country]=”USA”|  
|ProductCategory|=ProductCategory[Name]=”Bicycles”|  
|Transactions|=Transactions[Year]=2016|  
  
 The net effect of these permissions on the Transactions table is that members will be allowed to query rows of data where the customer is in the USA, and the product category is bicycles, and the year is 2016. Users would not be able to query any transactions outside of the USA, or any transactions that are not bicycles, or any transactions not in 2016 unless they are a member of another role that grants these permissions.  
  
 You can use the filter, *=FALSE()*, to deny access to all rows for an entire table.  
  
### Dynamic security  
 Dynamic security provides a way to define row level security based on the user name of the user currently logged on or the CustomData property returned from a connection string. In order to implement dynamic security, you must include in your model a table with login (Windows user name) values for users as well as a field that can be used to define a particular permission; for example, a dimEmployees table with a login ID (domain\username) as well as a department value for each employee.  
  
 To implement dynamic security, you can use the following functions as part of a DAX formula to return the user name of the user currently logged on, or the CustomData property in a connection string:  
  
|Function|Description|  
|--------------|-----------------|  
|[USERNAME Function (DAX)](http://msdn.microsoft.com/en-us/22dddc4b-1648-4c89-8c93-f1151162b93f)|Returns the domain\ username of the user currently logged on.|  
|[CUSTOMDATA Function (DAX)](http://msdn.microsoft.com/en-us/58235ad8-226c-43cc-8a69-5a52ac19dd4e)|Returns the CustomData property in a connection string.|  
  
 You can use the LOOKUPVALUE function to return values for a column in which the Windows user name is the same as the user name returned by the USERNAME function or a string returned by the CustomData function. Queries can then be restricted where the values returned by LOOKUPVALUE match values in the same or related table.  
  
 For example, using this formula:  
  
 `='dimDepartmentGroup'[DepartmentGroupId]=LOOKUPVALUE('dimEmployees'[DepartmentGroupId], 'dimEmployees'[LoginId], USERNAME(), 'dimEmployees'[LoginId], 'dimDepartmentGroup'[DepartmentGroupId])`  
  
 The LOOKUPVALUE function returns values for the dimEmployees[DepartmentId] column where the dimEmployees[LoginId] is the same as the LoginID of the user currently logged on, returned by USERNAME, and values for dimEmployees[DepartmentId] are the same as values for dimDepartmentGroup[DepartmentId]. The values in DepartmentId returned by LOOKUPVALUE are then used to restrict the rows queried in the dimDepartment table, and any tables related by DepartmentId. Only rows where DepartmentId are also in the values for the DepartmentId returned by LOOKUPVALUE function are returned.  
  
 **dimEmployees**  
  
|LastName|FirstName|LoginID|DepartmentName|DepartmentId|  
|--------------|---------------|-------------|--------------------|------------------|  
|Brown|Kevin|Adventure-works\kevin0|Marketing|7|  
|Bradley|David|Adventure-works\david0|Marketing|7|  
|Dobney|JoLynn|Adventure-works\JoLynn0|Production|4|  
|Baretto DeMattos|Paula|Adventure-works\Paula0|Human Resources|2|  
  
 **dimDepartment**  
  
|DepartmentId|DepartmentName|  
|------------------|--------------------|  
|1|Corporate|  
|2|Executive General and Administration|  
|3|Inventory Management|  
|4|Manufacturing|  
|5|Quality Assurance|  
|6|Research and Development|  
|7|Sales and Marketing|  
  
###  <a name="bkmk_testroles"></a> Testing roles  
 When creating a model project in SSDT, you can use the Analyze in Excel feature to test the efficacy of the roles you have defined.

## Next steps
[Manage server administrators](analysis-servies-server-admins.md)  
[Manage database roles and users](analysis-services-database-users.md)  
[Role-Based Access Control](../active-directory/role-based-access-control-what-is.md)  