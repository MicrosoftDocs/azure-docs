<properties 
   pageTitle="Overview of security in Data Lake Store | Microsoft Azure" 
   description="Understand how Azure Data Lake Store is a secure big data store" 
   services="data-lake-store" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="08/02/2016"
   ms.author="nitinme"/>

# Security in Azure Data Lake Store

Large number of enterprises are leveraging Big Data analytics to gain business insights to make smart decisions. These organizations can have complex and regulated environment, with increasing number of diverse users. It is therefore vital for enterprises to make sure critical business data is stored securely with right level of access granted to relevant users. Azure Data Lake Store is designed with these security requirements in mind. In this article, you will learn about the security capabilities of Azure Data Lake Store (ADLS) such as:

* Authentication
* Authorization
* Network isolation
* Data protection
* Auditing

 
## Authentication and identity management

Authentication is the process by which users prove their identity when interacting with Data Lake Store , or any services connecting to Data Lake Store. For Identity management and authentication, Data Lake Store uses [Azure Active Directory](../active-directory/active-directory-whatis.md) (AAD), a comprehensive identity and access management cloud solution that simplifies the management of users and groups.

Today every Azure subscription can be associated with an Azure Active Directory. Only users and service identities defined in this directory can access your Data Lake Store using the Azure Portal, command line tools, or client applications built using the Data Lake Store SDK. Key advantages of using Azure Active Directory as a centralized access control mechanism are:

* It simplifies identity life cycle management. Identity of a user or a service (service principal identity) can be quickly created and revoked by simply deleting or disabling the account in the directory.

* It supports [multi-factor authentication](../multi-factor-authentication/multi-factor-authentication.md) which provides additional layer of security for user sign-ins and transactions.

* It allows for users to authenticate from any client using standard open protocol such as OAuth and OpenID.

* It enables federation with enterprise directory services and cloud identity providers.

## Authorization and access control

Once a user is authenticated by AAD to access Azure Data Lake Store, authorization controls access permissions for the Data Lake Store. Data Lake Store separates authorization for account-related and data-related activities in the following manner. 

* [Role-based access control](../active-directory/role-based-access-control-what-is.md) (RBAC) provided by Azure for account management
* POSIX ACL for accessing data in the store.

### Using RBAC for account management

There are four basic roles defined by default. These allow different operations on a Data Lake Store account via portal, PowerShell cmdlets, and REST APIs. The **Owner** and **Contributor** role allow a variety of administration functions on the account. For users who only interact with data, you can add them to the **Reader** role.

![RBAC roles](./media/data-lake-store-security-overview/rbac-roles.png "RBAC roles")

Note that while the purpose of assigning these roles is for account management, depending on a specific role, it may also have implication on data access permissions. For operations that user can perform on the file system, you will need to use Access Control Lists (ACLs). Below is a summary of management rights and data access rights for these roles.

| Roles                    | Management rights               | Data access rights | Explanation |
|--------------------------|---------------------------------|--------------------|-------------|
| No role assigned         | None                            | Governed by ACL    | In such cases, users cannot use the Azure Portal or the Azure PowerShell Cmdlets to browse Data Lake Store. Such users will have to rely solely on command line tools. |
| Owner  | All  | All  | Owner is a superuser, thus the Owner role lets you manage everything and has full access to data | 
| Reader   | Read-only  | Governed by ACL    | Reader can view everything regarding account management, such as which user is assigned to which role, but can't make any changes   |
| Contributor              | All except add and remove roles | Governed by ACL    | Contributor can manage other aspects of an account such as creating/managing alerts, deployment, etc. A contributor cannot add or remove roles |
| User access administrator | Add and remove roles            | Governed by ACL    | User access administrator lets you manage user access to accounts. |

For instructions, see [Assign users or security groups to Azure Data Lake Store accounts](data-lake-store-secure-data.md#assign-users-or-security-groups-to-azure-data-lake-store-accounts).

### Using ACLs for operations on file systems

Azure Data Lake Store is a hierarchical file system like HDFS and supports [POSIX ACLs](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsPermissionsGuide.html#ACLs_Access_Control_Lists) - allowing read (r), write (w), and execute (x) access rights to resources granted to owner, owing group and other users/groups. In the Data Lake Store Public Preview (current release), ACLs can be enabled on the root folder, sub-folders, as well as individual files. The ACLs you apply to the root folder will also applicable to all the child folders/files as well.

It is a recommended practice to define ACLs for many users by using [security groups](../active-directory/active-directory-accessmanagement-manage-groups.md). Group the users into a security group, then assign the ACLs for the file and folder to that security group. This is useful when providing custom access since there is a limit where you can only add a maximum of nine entries as part of custom access. See [Assign users or security group as ACLs to the Azure Data Lake Store file system](data-lake-store-secure-data.md#filepermissions) for more information on securing data stored in Data Lake Store using AAD security groups.

![List standard and custom access](./media/data-lake-store-security-overview/adl.acl.2.png "List standard and custom access")

## Network isolation

Azure Data Lake Store enables you to further lock down access to your data store at network level. You can enable firewall and define an IP address range for your trusted clients. Once enabled, only clients that have the IP addresses within defined range can connect to the store.

![Firewall settings and IP access](./media/data-lake-store-security-overview/firewall-ip-access.png "Firewall settings and IP address")

## Data protection

Organizations want to ensure that their business critical data is secured throughout its life cycle. For data in transit, Data Lake Store uses industry-standard TLS (Transport Layer Security protocol) to secure data between client and Data Lake Security. 

Data protection for data at rest will also be available in the future releases.

## Auditing and diagnostic logs

You can use auditing or diagnostic logs depending on whether you are looking for logs for management-related activities or data-related activities.

*  Management-related activities use the Azure Resource Manager APIs and are surfaced in the Azure Portal via audit logs.
*  Data-related activities use the WebHDFS APIs and are surfaced in the Azure Portal via diagnostic logs.

### Auditing logs

To comply with regulations, organizations might require adequate audit trails if they need to dig into an incident. Data Lake Store has built-in monitoring and auditing where it logs all account management activities.

For account management audit trails, you can view and choose the columns of interest to log, and also export audit logs to Azure storage.

![Audit logs](./media/data-lake-store-security-overview/audit-logs.png "Audit logs")

### Diagnostic logs

You can enable the data access audit trails from the Azure portal (**Diagnostic Settings**) and provide an Azure Blob storage account where the logs will be stored.

![Diagnostic logs](./media/data-lake-store-security-overview/diagnostic-logs.png "Diagnostic logs")

Once you have enabled diagnostic settings, you can watch the logs in the **Diagnostic Logs** tab.

For more information on working with diagnostic logs with Azure Data Lake Store, see [Access diagnostic logs for Data Lake Store](data-lake-store-diagnostic-logs.md).

## Summary

Enterprise customers demand a data analytics cloud platform that is secure and easy to use. Azure Data Lake Store has been designed to address these requirements with identity management and authentication via Azure Active Direction integration, ALCs based authorization, network isolation, data encryption in transit and at rest (coming in the future), and auditing. 

If you want to see new features included in Data Lake Store, send us your feedback at [Uservoice forum](https://feedback.azure.com/forums/327234-data-lake).

## See also

- [Overview of Azure Data Lake Store](data-lake-store-overview.md)
- [Get Started with Data Lake Store](data-lake-store-get-started-portal.md)
- [Secure data in Data Lake Store](data-lake-store-secure-data.md)

