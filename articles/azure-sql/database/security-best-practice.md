---
title: Playbook for addressing common security requirements 
titleSuffix: Azure SQL Database & Azure SQL Managed Instance
description: This article provides common security requirements and best practices in Azure SQL Database and Azure SQL Managed Instance
ms.service: sql-database
ms.subservice: security
ms.custom: sqldbrb=2
author: VanMSFT
ms.author: vanto
ms.topic: article
ms.date: 02/20/2020
ms.reviewer: ""
---

# Playbook for addressing common security requirements with Azure SQL Database and Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This article provides best practices on how to solve common security requirements. Not all requirements are applicable to all environments, and you should consult your database and security team on which features to implement.

## Solving common security requirements

This document provides guidance on how to solve common security requirements for new or existing applications using Azure SQL Database and Azure SQL Managed Instance. It's organized by high-level security areas. For addressing specific threats, refer to the [Common security threats and potential mitigations](#common-security-threats-and-potential-mitigations) section. Although some of the presented recommendations are applicable when migrating applications from on-premises to Azure, migration scenarios are not the focus of this document.

### Azure SQL Database deployment offers covered in this guide

- [Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-single-index): [single databases](single-database-overview.md) and [elastic pools](elastic-pool-overview.md) in [servers](logical-servers.md)
- [Azure SQL Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-index)

### Deployment offers not covered in this guide

- Azure SQL Data Warehouse
- Azure SQL VMs (IaaS)
- SQL Server

### Audience

The intended audiences for this guide are customers facing questions on how to secure Azure SQL Database. The roles interested in this best practice article include, but not limited to:

- Security Architects
- Security Managers
- Compliance Officers
- Privacy Officers
- Security Engineers

### <a id="using"></a> Using this guide

This document is intended as a companion to our existing [Azure SQL Database security](security-overview.md) documentation.

Unless otherwise stated, we recommend you follow all best practices listed in each section to achieve the respective goal or requirement. To meet specific security compliance standards or best practices, important regulatory compliance controls are listed under the Requirements or Goals section wherever applicable. These are the security standards and regulations that are referenced in this paper:

- [FedRAMP](https://www.fedramp.gov/documents/): AC-04, AC-06
- [SOC](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome.html): CM-3, SDL-3
- [ISO/IEC 27001](https://www.iso27001security.com/html/27001.html): Access Control, Cryptography
- [Microsoft Operational Security Assurance (OSA) practices](https://www.microsoft.com/securityengineering/osa/practices): Practice #1-6 and #9
- [NIST Special Publication 800-53 Security Controls](https://nvd.nist.gov/800-53): AC-5, AC-6
- [PCI DSS](https://www.pcisecuritystandards.org/document_library): 6.3.2, 6.4.2

We plan on continuing to update the recommendations and best practices listed here. Provide input or any corrections for this document using the **Feedback** link at the bottom of this article.

## Authentication

Authentication is the process of proving the user is who they claim to be. Azure SQL Database and SQL Managed Instance support two types of authentication:

- SQL authentication
- Azure Active Directory authentication

> [!NOTE]
> Azure Active Directory authentication may not be supported for all tools and 3rd party applications.

### Central management for identities

Central identity management offers the following benefits:

- Manage group accounts and control user permissions without duplicating logins across servers, databases and managed instances.
- Simplified and flexible permission management.
- Management of applications at scale.

**How to implement**:

- Use Azure Active Directory (Azure AD) authentication for centralized identity management.

**Best practices**:

- Create an Azure AD tenant and [create users](../../active-directory/fundamentals/add-users-azure-active-directory.md) to represent human users and create [service principals](../../active-directory/develop/app-objects-and-service-principals.md) to represent apps, services, and automation tools. Service principals are equivalent to service accounts in Windows and Linux.

- Assign access rights to resources to Azure AD principals via group assignment: Create Azure AD groups, grant access to groups, and add individual members to the groups. In your database, create contained database users that map your Azure AD groups. To assign permissions inside the database, put the users that are associated with your Azure AD groups in database roles with the appropriate permissions.
  - See the articles, [Configure and manage Azure Active Directory authentication with SQL](authentication-aad-configure.md) and [Use Azure AD for authentication with SQL](authentication-aad-overview.md).
  > [!NOTE]
  > In SQL Managed Instance, you can also create logins that map to Azure AD principals in the master database. See [CREATE LOGIN (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current).

- Using Azure AD groups simplifies permission management and both the group owner, and the resource owner can add/remove members to/from the group.

- Create a separate group for Azure AD administrators for each server or managed instance.

  - See the article, [Provision an Azure Active Directory administrator for your server](authentication-aad-configure.md#provision-azure-ad-admin-sql-database).

- Monitor Azure AD group membership changes using Azure AD audit activity reports.

- For a managed instance, a separate step is required to create an Azure AD admin.
  - See the article, [Provision an Azure Active Directory administrator for your managed instance](authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance).

> [!NOTE]
>
> - Azure AD authentication is recorded in Azure SQL audit logs, but not in Azure AD sign-in logs.
> - RBAC permissions granted in Azure do not apply to Azure SQL Database or SQL Managed Instance  permissions. Such permissions must be created/mapped manually using existing SQL permissions.
> - On the client-side, Azure AD authentication needs access to the internet or via User Defined Route (UDR) to a virtual network.
> - The Azure AD access token is cached on the client side and its lifetime depends on token configuration. See the article, [Configurable token lifetimes in Azure Active Directory](../../active-directory/develop/active-directory-configurable-token-lifetimes.md)
> - For guidance on troubleshooting Azure AD Authentication issues, see the following blog: [Troubleshooting Azure AD](https://techcommunity.microsoft.com/t5/azure-sql-database/troubleshooting-problems-related-to-azure-ad-authentication-with/ba-p/1062991).

### Azure Multi-Factor Authentication

> Mentioned in: OSA Practice #2, ISO Access Control (AC)

Azure Multi-Factor Authentication helps provides additional security by requiring more than one form of authentication.

**How to implement**:

- [Enable Multi-Factor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md) in Azure AD using Conditional Access and use interactive authentication.

- The alternative is to enable Multi-Factor Authentication for the entire Azure AD or AD domain.

**Best practices**:

- Activate Conditional Access in Azure AD (requires Premium subscription).
  - See the article, [Conditional Access in Azure AD](../../active-directory/conditional-access/overview.md).  

- Create Azure AD group(s) and enable Multi-Factor Authentication policy for selected groups using Azure AD Conditional Access.
  - See the article, [Plan Conditional Access Deployment](../../active-directory/conditional-access/plan-conditional-access.md).

- Multi-Factor Authentication can be enabled for the entire Azure AD or for the whole Active Directory federated with Azure AD.

- Use Azure AD Interactive authentication mode for Azure SQL Database and Azure SQL Managed Instance where a password is requested interactively, followed by Multi-Factor Authentication:
  - Use Universal Authentication in SSMS. See the article, [Using Multi-factor Azure AD authentication with Azure SQL Database, SQL Managed Instance, Azure Synapse (SSMS support for Multi-Factor Authentication)](authentication-mfa-ssms-overview.md).
  - Use Interactive Authentication supported in SQL Server Data Tools (SSDT). See the article, [Azure Active Directory support in SQL Server Data Tools (SSDT)](https://docs.microsoft.com/sql/ssdt/azure-active-directory?view=azuresqldb-current).
  - Use other SQL tools supporting Multi-Factor Authentication.
    - SSMS Wizard support for export/extract/deploy database  
    - [sqlpackage.exe](https://docs.microsoft.com/sql/tools/sqlpackage): option ‘/ua’
    - [sqlcmd Utility](https://docs.microsoft.com/sql/tools/sqlcmd-utility): option -G (interactive)
    - [bcp Utility](https://docs.microsoft.com/sql/tools/bcp-utility): option -G (interactive)

- Implement your applications to connect to Azure SQL Database or Azure SQL Managed Instance using interactive authentication with Multi-Factor Authentication support.
  - See the article, [Connect to Azure SQL Database with Azure Multi-Factor Authentication](active-directory-interactive-connect-azure-sql-db.md).
  > [!NOTE]
  > This authentication mode requires user-based identities. In cases where a trusted identity model is used that is bypassing individual Azure AD user authentication (e.g. using managed identity for Azure resources), Multi-Factor Authentication does not apply.

### Minimize the use of password-based authentication for users

> Mentioned in: OSA Practice #4, ISO Access Control (AC)

Password-based authentication methods are a weaker form of authentication. Credentials can be compromised or mistakenly given away.

**How to implement**:

- Use an Azure AD integrated authentication that eliminates the use of passwords.

**Best practices**:

- Use single sign-on authentication using Windows credentials. Federate the on-premises AD domain with Azure AD and use Integrated Windows authentication (for domain-joined machines with Azure AD).
  - See the article, [SSMS support for Azure AD Integrated authentication](authentication-aad-configure.md#active-directory-integrated-authentication).

### Minimize the use of password-based authentication for applications

> Mentioned in: OSA Practice #4, ISO Access Control (AC)

**How to implement**:

- Enable Azure Managed Identity. You can also use integrated or certificate-based authentication.

**Best practices**:

- Use [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).
  - [System-assigned managed identity](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql.md)
  - [User-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md)
  - [Use Azure SQL Database from Azure App Service with managed identity (without code changes)](https://github.com/Azure-Samples/app-service-msi-entityframework-dotnet)

- Use cert-based authentication for an application.
  - See this [code sample](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/security/azure-active-directory-auth/token).

- Use Azure AD authentication for integrated federated domain and domain-joined machine (see section above).
  - See the [sample application for integrated authentication](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/security/azure-active-directory-auth/integrated).

### Protect passwords and secrets

For cases when passwords aren't avoidable, make sure they're secured.

**How to implement**:

- Use Azure Key Vault to store passwords and secrets. Whenever applicable, use Multi-Factor Authentication for Azure SQL Database with Azure AD users.

**Best practices**:

- If avoiding passwords or secrets aren't possible, store user passwords and application secrets in Azure Key Vault and manage access through Key Vault access policies.

- Various app development frameworks may also offer framework-specific mechanisms for protecting secrets in the app. For example: [ASP.NET core app](https://docs.microsoft.com/aspnet/core/security/app-secrets?view=aspnetcore-2.1&tabs=windows).

### Use SQL authentication for legacy applications

SQL authentication refers to the authentication of a user when connecting to Azure SQL Database or SQL Managed Instance using username and password. A login will need to be created in each server or managed instance, and a user created in each database.

**How to implement**:

- Use SQL authentication.

**Best practices**:

- As a server or instance admin, create logins and users. Unless using contained database users with passwords, all passwords are stored in master database.
  - See the article, [Controlling and granting database access to SQL Database, SQL Managed Instance and Azure Synapse Analytics](logins-create-manage.md).

## Access management

Access management (also called Authorization) is the process of controlling and managing authorized users' access and privileges to Azure SQL Database or SQL Managed Instance.

### Implement principle of least privilege

> Mentioned in: FedRamp controls AC-06, NIST: AC-6, OSA Practice #3

The principle of least privilege states that users shouldn't have more privileges than needed to complete their tasks. For more information, see the article [Just enough administration](https://docs.microsoft.com/powershell/scripting/learn/remoting/jea/overview).

**How to implement**:

Assign only the necessary [permissions](https://docs.microsoft.com/sql/relational-databases/security/permissions-database-engine) to complete the required tasks:

- In SQL Databases:
  - Use granular permissions and user-defined database roles (or server-roles in Managed Instance):
    1. Create the required roles
       - [CREATE ROLE](https://docs.microsoft.com/sql/t-sql/statements/create-role-transact-sql)
       - [CREATE SERVER ROLE](https://docs.microsoft.com/sql/t-sql/statements/create-server-role-transact-sql)
    1. Create required users
       - [CREATE USER](https://docs.microsoft.com/sql/t-sql/statements/create-user-transact-sql)
    1. Add users as members to roles
       - [ALTER ROLE](https://docs.microsoft.com/sql/t-sql/statements/alter-role-transact-sql)
       - [ALTER SERVER ROLE](https://docs.microsoft.com/sql/t-sql/statements/alter-server-role-transact-sql)
    1. Then assign permissions to roles.
       - [GRANT](https://docs.microsoft.com/sql/t-sql/statements/grant-transact-sql)
  - Make sure to not assign users to unnecessary roles.

- In Azure Resource Manager:
  - Use built-in roles if available or custom RBAC roles and assign the necessary permissions.
    - [Built-in roles for Azure](../../role-based-access-control/built-in-roles.md)
    - [Custom roles for Azure resources](../../role-based-access-control/custom-roles.md)

**Best practices**:

The following best practices are optional but will result in better manageability and supportability of your security strategy:

- If possible, start with the least possible set of permissions and start adding permissions one by one if there's a real necessity (and justification) – as opposed to the opposite approach: taking permissions away step by step.

- Refrain from assigning permissions to individual users. Use roles (database or server roles) consistently instead. Roles helps greatly with reporting and troubleshooting permissions. (Azure RBAC only supports permission assignment via roles.)

- Create and use custom roles with the exact permissions needed. Typical roles that are used in practice:
  - Security deployment
  - Administrator
  - Developer
  - Support personnel
  - Auditor
  - Automated processes
  - End user
  
- Use built-in roles only when the permissions of the roles match exactly the needed permissions for the user. You can assign users to multiple roles.

- Remember that permissions in the database engine can be applied within the following scopes (the smaller the scope, the smaller the impact of the granted permissions):
  - Server (special roles in master database) in Azure
  - Database
  - Schema
    - It is a best practice to use schemas to grant permissions inside a database. (also see: [Schema-design: Recommendations for Schema design with security in mind](http://andreas-wolter.com/en/schema-design-for-sql-server-recommendations-for-schema-design-with-security-in-mind/))
  - Object (table, view, procedure, etc.)

  > [!NOTE]
  > It is not recommended to apply permissions on the object level because this level adds unnecessary complexity to the overall implementation. If you decide to use object-level permissions, those should be clearly documented. The same applies to column-level-permissions, which are even less recommendable for the same reasons. Also be aware that by default a table-level [DENY](https://docs.microsoft.com/sql/t-sql/statements/deny-object-permissions-transact-sql) does not override a column-level GRANT. This would require the [common criteria compliance Server Configuration](https://docs.microsoft.com/sql/database-engine/configure-windows/common-criteria-compliance-enabled-server-configuration-option) to be activated.

- Perform regular checks using [Vulnerability Assessment (VA)](https://docs.microsoft.com/sql/relational-databases/security/sql-vulnerability-assessment) to test for too many permissions.

### Implement Separation of Duties

> Mentioned in: FedRamp: AC-04, NIST: AC-5, ISO: A.6.1.2, PCI 6.4.2, SOC: CM-3, SDL-3

Separation of Duties, also called Segregation of Duties describes the requirement to split sensitive tasks into multiple tasks that are assigned to different users. Separation of Duties helps prevent data breaches.

**How to implement**:

- Identify the required level of Separation of Duties. Examples:
  - Between Development/Test and Production environments
  - Security-wise sensitive tasks vs Database Administrator (DBA) management level tasks vs developer tasks.
    - Examples: Auditor, creation of security policy for Role-level Security (RLS), Implementing SQL Database objects with DDL-permissions.

- Identify a comprehensive hierarchy of users (and automated processes) that access the system.

- Create roles according to the needed user-groups and assign permissions to roles.
  - For management-level tasks in Azure portal or via PowerShell-automation use RBAC roles. Either find a built-in role matching the requirement, or create a custom RBAC role using the available permissions
  - Create Server roles for server-wide tasks (creating new logins, databases) in a managed instance.
  - Create Database Roles for database-level tasks.

- For certain sensitive tasks, consider creating special stored procedures signed by a certificate to execute the tasks on behalf of the users. One important advantage of digitally signed stored procedures is that if the procedure is changed, the permissions that were granted to the previous version of the procedure are immediately removed.
  - Example: [Tutorial: Signing Stored Procedures with a Certificate](https://docs.microsoft.com/sql/relational-databases/tutorial-signing-stored-procedures-with-a-certificate)

- Implement Transparent Data Encryption (TDE) with customer-managed keys in Azure Key Vault to enable Separation of Duties between data owner and security owner.
  - See the article, [Configure customer-managed keys for Azure Storage encryption from the Azure portal](../../storage/common/storage-encryption-keys-portal.md).

- To ensure that a DBA can't see data that is considered highly sensitive and can still do DBA tasks, you can use Always Encrypted with role separation.
  - See the articles, [Overview of Key Management for Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/overview-of-key-management-for-always-encrypted), [Key Provisioning with Role Separation](https://docs.microsoft.com/sql/relational-databases/security/encryption/configure-always-encrypted-keys-using-powershell#KeyProvisionWithRoles), and [Column Master Key Rotation with Role Separation](https://docs.microsoft.com/sql/relational-databases/security/encryption/rotate-always-encrypted-keys-using-powershell#column-master-key-rotation-with-role-separation).

- In cases where the use of Always Encrypted isn't feasible, or at least not without major costs and efforts that may even render the system near unusable, compromises can be made and mitigated through the use of compensating controls such as:
  - Human intervention in processes.
  - Audit trails – for more information on Auditing, see, [Audit critical security events](#audit-critical-security-events).

**Best practices**:

- Make sure that different accounts are used for Development/Test and Production environments. Different accounts help to comply with separation of Test and Production systems.

- Refrain from assigning permissions to individual users. Use roles (database or server roles) consistently instead. Having roles helps greatly with reporting and troubleshooting permissions.

- Use built-in roles when the permissions match exactly the needed permissions – if the union of all permissions from multiple built-in roles leads to a 100% match, you can assign multiple roles concurrently as well.

- Create and use user-defined roles when built-in roles grant too many permissions or insufficient permissions.

- Role assignments can also be done temporarily, also known as Dynamic Separation of Duties (DSD), either within SQL Agent Job steps in T-SQL or using Azure PIM for RBAC roles.

- Make sure that DBAs don't have access to the encryption keys or key stores, and that Security Administrators with access to the keys have no access to the database in turn. The use of [Extensible Key Management (EKM)](https://docs.microsoft.com/sql/relational-databases/security/encryption/extensible-key-management-ekm) can make this separation easier to achieve. [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) can be used to implement EKM.

- Always make sure to have an Audit trail for security-related actions.

- You can retrieve the definition of the built-in RBAC roles to see the permissions used and create a custom role based on excerpts and cumulations of these via PowerShell.

- Because any member of the db_owner database role can change security settings like Transparent Data Encryption (TDE), or change the SLO, this membership should be granted with care. However, there are many tasks that require db_owner privileges. Task like changing any database setting such as changing DB options. Auditing plays a key role in any solution.

- It is not possible to restrict permissions of a db_owner, and therefore prevent an administrative account from viewing user data. If there's highly sensitive data in a database, Always Encrypted can be used to safely prevent db_owners or any other DBA from viewing it.

> [!NOTE]
> Achieving Separation of Duties (SoD) is challenging for security-related or troubleshooting tasks. Other areas like development and end-user roles are easier to segregate. Most compliance related controls allow the use of alternate control functions such as Auditing when other solutions aren't practical.

For the readers that want to dive deeper into SoD, we recommend the following resources:

- For Azure SQL Database and SQL Managed Instance:  
  - [Controlling and granting database access](logins-create-manage.md)
  - [Engine Separation of Duties for the Application Developer](https://docs.microsoft.com/previous-versions/sql/sql-server-2008/cc974525(v=sql.100))
  - [Separation of Duties](https://www.microsoft.com/download/details.aspx?id=39269)
  - [Signing Stored Procedures](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/signing-stored-procedures-in-sql-server)

- For Azure Resource Management:
  - [Built-in roles for Azure](../../role-based-access-control/built-in-roles.md)
  - [Custom roles for Azure resources](../../role-based-access-control/custom-roles.md)
  - [Using Azure AD Privileged Identity Management for elevated access](https://www.microsoft.com/itshowcase/using-azure-ad-privileged-identity-management-for-elevated-access)

### Perform regular code reviews

> Mentioned in: PCI: 6.3.2, SOC: SDL-3

Separation of Duties is not limited to the data in a database, but includes application code. Malicious code can potentially circumvent security controls. Before deploying custom code to production, it is essential to review what's being deployed.

**How to implement**:

- Use a database tool like Azure Data Studio that supports source control.

- Implement a segregated code deployment process.

- Before committing to main branch, a person (other than the author of the code itself) has to inspect the code for potential elevation of privileges risks as well as malicious data modifications to protect against fraud and rogue access. This can be done using source control mechanisms.

**Best practices**:

- Standardization: It helps to implement a standard procedure that is to be followed for any code updates.

- Vulnerability Assessment contains rules that check for excessive permissions, the use of old encryption algorithms, and other security problems within a database schema.

- Further checks can be done in a QA or test environment using Advanced Threat Protection that scans for code that is vulnerable to SQL-injection.

- Examples of what to look out for:
  - Creation of a user or changing security settings from within an automated SQL-code-update deployment.
  - A stored procedure, which, depending on the parameters provided, updates a monetary value in a cell in a non-conforming way.

- Make sure the person conducting the review is an individual other than the originating code author and knowledgeable in code-reviews and secure coding.

- Be sure to know all sources of code-changes. Code can be in T-SQL Scripts. It can be ad-hoc commands to be executed or be deployed in forms of Views, Functions, Triggers, and Stored Procedures. It can be part of SQL Agent Job definitions (Steps). It can also be executed from within SSIS packages, Azure Data Factory, and other services.

## Data protection

Data protection is a set of capabilities for safeguarding important information from compromise by encryption or obfuscation.

> [!NOTE]
> Microsoft attests to Azure SQL Database and SQL Managed Instance as being FIPS 140-2 Level 1 compliant. This is done after verifying the strict use of FIPS 140-2 Level 1 acceptable algorithms and FIPS 140-2 Level 1 validated instances of those algorithms including consistency with required key lengths, key management, key generation, and key storage. This attestation is meant to allow our customers to respond to the need or requirement for the use of FIPS 140-2 Level 1 validated instances in the processing of data or delivery of systems or applications. We define the terms "FIPS 140-2 Level 1 compliant" and "FIPS 140-2 Level 1 compliance" used in the above statement to demonstrate their intended applicability to U.S. and Canadian government use of the different term "FIPS 140-2 Level 1 validated."

### Encrypt data in transit

> Mentioned in: OSA Practice #6, ISO Control Family: Cryptography

Protects your data while data moves between your client and server. Refer to [Network Security](#network-security).

### Encrypt data at rest

> Mentioned in: OSA Practice #6, ISO Control Family: Cryptography

Encryption at rest is the cryptographic protection of data when it is persisted in database, log, and backup files.

**How to implement**:

- [Transparent Database Encryption (TDE)](transparent-data-encryption-tde-overview.md) with service managed keys are enabled by default for any databases created after 2017 in Azure SQL Database and SQL Managed Instance.
- In a managed instance, if the database is created from a restore operation using an on-premises server, the TDE setting of the original database will be honored. If the original database doesn't have TDE enabled, we recommend that TDE be manually turned on for the managed instance.

**Best practices**:

- Don't store data that requires encryption-at-rest in the master database. The master database can't be encrypted with TDE.

- Use customer-managed keys in Azure Key Vault if you need increased transparency and granular control over the TDE protection. Azure Key Vault allows the ability to revoke permissions at any time to render the database inaccessible. You can centrally manage TDE protectors along with other keys, or rotate the TDE protector at your own schedule using Azure Key Vault.

- If you're using customer-managed keys in Azure Key Vault, follow the articles, [Guidelines for configuring TDE with Azure Key Vault](transparent-data-encryption-byok-overview.md#recommendations-when-configuring-akv) and [How to configure Geo-DR with Azure Key Vault](transparent-data-encryption-byok-overview.md#geo-dr-and-customer-managed-tde).

### Protect sensitive data in use from high-privileged, unauthorized users

Data in use is the data stored in memory of the database system during the execution of SQL queries. If your database stores sensitive data, your organization may be required to ensure that high-privileged users are prevented from viewing sensitive data in your database. High-privilege users, such as Microsoft operators or DBAs in your organization should be able to manage the database, but prevented from viewing and potentially exfiltrating sensitive data from the memory of the SQL process or by querying the database.

The policies that determine which data is sensitive and whether the sensitive data must be encrypted in memory and not accessible to administrators in plaintext, are specific to your organization and compliance regulations you need to adhere to. Please see the related requirement: [Identify and tag sensitive data](#identify-and-tag-sensitive-data).

**How to implement**:

- Use [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine) to ensure sensitive data isn't exposed in plaintext in Azure SQL Database or SQL Managed Instance, even in memory/in use. Always Encrypted protects the data from Database Administrators (DBAs) and cloud admins (or bad actors who can impersonate high-privileged but unauthorized users) and gives you more control over who can access your data.

**Best practices**:

- Always Encrypted isn't a substitute to encrypt data at rest (TDE) or in transit (SSL/TLS). Always Encrypted shouldn't be used for non-sensitive data to minimize performance and functionality impact. Using Always Encrypted in conjunction with TDE and Transport Layer Security (TLS) is recommended for comprehensive protection of data at-rest, in-transit, and in-use.

- Assess the impact of encrypting the identified sensitive data columns before you deploy Always Encrypted in a production database. In general, Always Encrypted reduces the functionality of queries on encrypted columns and has other limitations, listed in [Always Encrypted - Feature Details](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine#feature-details). Therefore, you may need to rearchitect your application to re-implement the functionality, a query does not support, on the client side or/and refactor your database schema, including the definitions of stored procedures, functions, views and triggers. Existing applications may not work with encrypted columns if they do not adhere to the restrictions and limitations of Always Encrypted. While the ecosystem of Microsoft tools, products and services supporting Always Encrypted is growing, a number of them do not work with encrypted columns. Encrypting a column may also impact query performance, depending on the characteristics of your workload.

- Manage Always Encrypted keys with role separation if you're using Always Encrypted to protect data from malicious DBAs. With role separation, a security admin creates the physical keys. The DBA creates the column master key and column encryption key metadata objects describing the physical keys in the database. During this process, the security admin doesn't need access to the database, and the DBA doesn't need access to the physical keys in plaintext.
  - See the article, [Managing Keys with Role Separation](https://docs.microsoft.com/sql/relational-databases/security/encryption/overview-of-key-management-for-always-encrypted#managing-keys-with-role-separation) for details.

- Store your column master keys in Azure Key Vault for ease of management. Avoid using Windows Certificate Store (and in general, distributed key store solutions, as opposed central key management solutions) that make key management hard.

- Think carefully through the tradeoffs of using multiple keys (column master key or column encryption keys). Keep the number of keys small to reduce key management cost. One column master key and one column encryption key per database is typically sufficient in steady-state environments (not in the middle of a key rotation). You may need additional keys if you have different user groups, each using different keys and accessing different data.  

- Rotate column master keys per your compliance requirements. If you also need to rotate column encryption keys, consider using online encryption to minimize application downtime.
  - See the article, [Performance and Availability Considerations](https://docs.microsoft.com/sql/relational-databases/security/encryption/configure-column-encryption-using-powershell#performance-and-availability-considerations).

- Use deterministic encryption if computations (equality) on data need to be supported. Otherwise, use randomized encryption. Avoid using deterministic encryption for low-entropy data sets, or data sets with publicly known distribution.

- If you're concerned about third parties accessing your data legally without your consent, ensure that all application and tools that have access to the keys and data in plaintext run outside of Microsoft Azure Cloud. Without access to the keys, the third party will have no way of decrypting the data unless they bypass the encryption.

- Always Encrypted doesn't easily support granting temporary access to the keys (and the protected data). For example, if you need to share the keys with a DBA to allow the DBA to do some cleansing operations on sensitive and encrypted data. The only way to reliability revoke the access to the data from the DBA will be to rotate both the column encryption keys and the column master keys protecting the data, which is an expensive operation.

- To access the plaintext values in encrypted columns, a user needs to have access to the Column Master Key (CMK) that protects columns, which is configured in the key store holding the CMK. The user also needs to have the **VIEW ANY COLUMN MASTER KEY DEFINITION** and **VIEW ANY COLUMN ENCRYPTION KEY DEFINITION** database permissions.

### Control access of application users to sensitive data through encryption

Encryption can be used as a way to ensure that only specific application users who have access to cryptographic keys can view or update the data.

**How to implement**:

- Use Cell-level Encryption (CLE). See the article, [Encrypt a Column of Data](https://docs.microsoft.com/sql/relational-databases/security/encryption/encrypt-a-column-of-data) for details.
- Use Always Encrypted, but be aware of its limitation. The limitations are listed below.

**Best practices**

When using CLE:

- Control access to keys through SQL permissions and roles.

- Use AES (AES 256 recommended) for data encryption. Algorithms, such RC4, DES and TripleDES, are deprecated and shouldn't be used because of known vulnerabilities.

- Protect symmetric keys with asymmetric keys/certificates (not passwords) to avoid using 3DES.

- Be careful when migrating a database using Cell-Level Encryption via export/import (bacpac files).
  - See the article, [Recommendations for using Cell Level Encryption in Azure SQL Database](https://blogs.msdn.microsoft.com/sqlsecurity/2015/05/12/recommendations-for-using-cell-level-encryption-in-azure-sql-database/) on how to prevent losing keys when migrating data, and for other best practice guidance.

Keep in mind that Always Encrypted is primarily designed to protect sensitive data in use from high-privilege users of Azure SQL Database (cloud operators, DBAs) - see [Protect sensitive data in use from high-privileged, unauthorized users](#protect-sensitive-data-in-use-from-high-privileged-unauthorized-users). Be aware of the following challenges when using Always Encrypted to protect data from application users:

- By default, all Microsoft client drivers supporting Always Encrypted maintain a global (one per application) cache of column encryption keys. Once a client driver acquires a plaintext column encryption key by contacting a key store holding a column master key, the plaintext column encryption key is cached. This makes isolating data from users of a multi-user application challenging. If your application impersonates end users when interacting with a key store (such as Azure Key Vault), after a user's query populates the cache with a column encryption key, a subsequent query that requires the same key but is triggered by another user will use the cached key. The driver won't call the key store and it won't check if the second user has a permission to access the column encryption key. As a result, the user can see the encrypted data even if the user doesn't have access to the keys. To achieve the isolation of users within a multi-user application, you can disable column encryption key caching. Disabling caching will cause additional performance overheads, as the driver will need to contact the key store for each data encryption or decryption operation.

### Protect data against unauthorized viewing by application users while preserving data format

Another technique for preventing unauthorized users from viewing data is to obfuscate or mask the data while preserving data types and formats to ensure that user applications can continue handle and display the data.

**How to implement**:

- Use [Dynamic Data Masking](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking) to obfuscate table columns.

> [!NOTE]
> Always Encrypted does not work with Dynamic Data Masking. It is not possible to encrypt and mask the same column, which implies that you need to prioritize protecting data in use vs. masking the data for your app users via Dynamic Data Masking.

**Best practices**:

> [!NOTE]
> Dynamic Data Masking cannot be used to protect data from high-privilege users. Masking policies do not apply to users with administrative access like db_owner.

- Don't permit app users to run ad-hoc queries (as they may be able to work around Dynamic Data Masking).  
  - See the article, [Bypassing masking using inference or brute-force techniques](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking#security-note-bypassing-masking-using-inference-or-brute-force-techniques) for details.  

- Use a proper access control policy (via SQL permissions, roles, RLS) to limit user permissions to make updates in the masked columns. Creating a mask on a column doesn't prevent updates to that column. Users that receive masked data when querying the masked column, can update the data if they have write-permissions.

- Dynamic Data Masking doesn't preserve the statistical properties of the masked values. This may impact query results (for example, queries containing filtering predicates or joins on the masked data).

## Network security

Network security refers to access controls and best practices to secure your data in transit to Azure SQL Database.

### Configure my client to connect securely to SQL Database/SQL Managed Instance

Best practices on how to prevent client machines and applications with well-known vulnerabilities (for example, using older TLS protocols and cipher suites) from connecting to Azure SQL Database and SQL Managed Instance.

**How to implement**:

- Ensure that client machines connecting to Azure SQL Database and SQL Managed Instance are using  [Transport Layer Security (TLS)](security-overview.md#transport-layer-security-encryption-in-transit).

**Best practices**:

- Configure all your apps and tools to connect to SQL Database with encryption enabled
  - Encrypt = On, TrustServerCertificate = Off (or equivalent with non-Microsoft drivers).

- If your app uses a driver that doesn't support TLS or supports an older version of TLS, replace the driver, if possible. If not possible, carefully evaluate the security risks.

- Reduce attack vectors via vulnerabilities in SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1 by disabling them on client machines connecting to Azure SQL Database per [Transport Layer Security (TLS) registry settings](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings#tls-10).

- Check cipher suites available on the client: [Cipher Suites in TLS/SSL (Schannel SSP)](https://docs.microsoft.com/windows/desktop/SecAuthN/cipher-suites-in-schannel). Specifically, disable 3DES per [Configuring TLS Cipher Suite Order](https://docs.microsoft.com/windows-server/security/tls/manage-tls#configuring-tls-cipher-suite-order).

- For Azure SQL Database and SQL Managed Instance, encryption is enforced for both Proxy and Redirect connection types. For Azure SQL Managed Instance, use the **Proxy** connection type (default) as this enforces encryption from the server side. The **Redirect** connection type currently doesn't support encryption enforcement and is only available on private IP connections.

- For more information, see [Azure SQL Database Connectivity Architecture - Connection policy](connectivity-architecture.md#connection-policy).

### Minimize attack surface

Minimize the number of features that can be attacked by a malicious user. Implement network access controls for Azure SQL Database.

> Mentioned in: OSA Practice #5

**How to implement**:

In SQL Database:

- Set Allow Access to Azure services to OFF at the server-level
- Use VNet Service endpoints and VNet Firewall Rules.
- Use Private Link (preview).

In SQL Managed Instance:

- Follow the guidelines in [Network requirements](../managed-instance/connectivity-architecture-overview.md#network-requirements).

**Best practices**:

- Restricting access to Azure SQL Database and SQL Managed Instance by connecting on a private endpoint (for example, using a private data path):
  - A managed instance can be isolated inside a virtual network to prevent external access. Applications and tools that are in the same or peered virtual network in the same region could access it directly. Applications and tools that are in different region could use virtual-network-to-virtual-network connection or ExpressRoute circuit peering to establish connection. Customer should use Network Security Groups (NSG) to restrict access over port 1433 only to resources that require access to a managed instance.
  - For a SQL Database, use the [Private Link](../../private-link/private-endpoint-overview.md) feature that provides a dedicated private IP for the server inside your virtual network. You can also use [Virtual network service endpoints with virtual network firewall rules](vnet-service-endpoint-rule-overview.md) to restrict access to your servers.
  - Mobile users should use point-to-site VPN connections to connect over the data path.
  - Users connected to their on-premises network should use site-to-site VPN connection or ExpressRoute to connect over the data path.

- You can access Azure SQL Database and SQL Managed Instance by connecting to a public endpoint (for example, using a public data path). The following best practices should be considered:
  - For a server in SQL Database, use [IP firewall rules](firewall-configure.md) to restrict access to only authorized IP addresses.
  - For SQL Managed Instance, use Network Security Groups (NSG) to restrict access over port 3342 only to required resources. For more information, see [Use a managed instance securely with public endpoints](../managed-instance/public-endpoint-overview.md).

> [!NOTE]
> The SQL Managed Instance public endpoint is not enabled by default and it and must be explicitly enabled. If company policy disallows the use of public endpoints, use [Azure Policy](../../governance/policy/overview.md) to prevent enabling public endpoints in the first place.

- Set up Azure Networking components:
  - Follow [Azure best practices for network security](../../security/fundamentals/network-best-practices.md).
  - Plan Virtual Network configuration per best practices outlined in [Azure Virtual Network frequently asked questions (FAQ)](../../virtual-network/virtual-networks-faq.md) and plan.
  - Segment a virtual network into multiple subnets and assign resources for similar role to the same subnet (for example, front-end vs back-end resources).
  - Use [Network Security Groups (NSGs)](../../virtual-network/security-overview.md) to control traffic between subnets inside the Azure virtual network boundary.
  - Enable [Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) for your subscription to monitor inbound and outbound network traffic.

### Configure Power BI for secure connections to SQL Database/SQL Managed Instance

**Best practices**:

- For Power BI Desktop, use private data path whenever possible.

- Ensure that Power BI Desktop is connecting using TLS1.2 by setting the registry key on the client machine as per [Transport Layer Security (TLS)](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings) registry settings.

- Restrict data access for specific users via [Row-level security (RLS) with Power BI](https://docs.microsoft.com/power-bi/service-admin-rls).

- For Power BI Service, use the [on-premises data gateway](https://docs.microsoft.com/power-bi/service-gateway-onprem), keeping in mind [Limitations and Considerations](https://docs.microsoft.com/power-bi/service-gateway-deployment-guidance#installation-considerations-for-the-on-premises-data-gateway).

### Configure App Service for secure connections to SQL Database/SQL Managed Instance

**Best practices**:

- For a simple Web App, connecting over public endpoint requires setting **Allow Azure Services** to ON.

- [Integrate your app with an Azure Virtual Network](../../app-service/web-sites-integrate-with-vnet.md) for private data path connectivity to a managed instance. Optionally, you can also deploy a Web App with [App Service Environments (ASE)](../../app-service/environment/intro.md).

- For Web App with ASE or virtual network Integrated Web App connecting to a database in SQL Database, you can use [virtual network service endpoints and virtual network firewall rules](vnet-service-endpoint-rule-overview.md) to limit access from a specific virtual network and subnet. Then set **Allow Azure Services** to OFF. You can also connect ASE to a managed instance in SQL Managed Instance over a private data path.  

- Ensure that your Web App is configured per the article, [Best practices for securing platform as a service (PaaS) web and mobile applications using Azure App Service](../../security/fundamentals/paas-applications-using-app-services.md).

- Install [Web Application Firewall (WAF)](../../web-application-firewall/ag/ag-overview.md) to protect your web app from common exploits and vulnerabilities.

### Configure Azure virtual machine hosting for secure connections to SQL Database/SQL Managed Instance

**Best practices**:

- Use a combination of Allow and Deny rules on the NSGs of Azure virtual machines to control which regions can be accessed from the VM.

- Ensure that your VM is configured per the article, [Security best practices for IaaS workloads in Azure](../../security/fundamentals/iaas.md).

- Ensure that all VMs are associated with a specific virtual network and subnet.

- Evaluate if you need the default route 0.0.0.0/Internet per the guidance at [about forced tunneling](../../vpn-gateway/vpn-gateway-forced-tunneling-rm.md#about-forced-tunneling).
  - If yes – for example, front-end subnet - then keep the default route.
  - If no – for example, middle tier or back-end subnet – then enable force tunneling so no traffic goes over Internet to reach on-premises (a.k.a cross-premises).

- Implement [optional default routes](../../virtual-network/virtual-networks-udr-overview.md#optional-default-routes) if you're using peering or connecting to on-premises.

- Implement [User Defined Routes](../../virtual-network/virtual-networks-udr-overview.md#user-defined) if you need to send all traffic in the virtual network to a Network Virtual Appliance for packet inspection.

- Use [virtual network service endpoints](vnet-service-endpoint-rule-overview.md) for secure access to PaaS services like Azure Storage via the Azure backbone network.

### Protect against Distributed Denial of Service (DDoS) attacks

Distributed Denial of Service (DDoS) attacks are attempts by a malicious user to send a flood of network traffic to Azure SQL Database with the aim of overwhelming the Azure infrastructure and causing it to reject valid logins and workload.

> Mentioned in: OSA Practice #9

**How to implement**:

DDoS protection is automatically enabled as part of the Azure Platform. It includes always-on traffic monitoring and real-time mitigation of network-level attacks on public endpoints.

- Use [Azure DDoS Protection](../../virtual-network/ddos-protection-overview.md) to monitor public IP addresses associated to resources deployed in virtual networks.

- Use [Advanced Threat Protection for Azure SQL Database](threat-detection-overview.md) to detect Denial of Service (DoS) attacks against databases.

**Best practices**:

- Follow the practices described in [Minimize Attack Surface](#minimize-attack-surface) helps minimize DDoS attack threats.

- The Advanced Threat Protection **Brute force SQL credentials** alert helps to detect brute force attacks. In some cases, the alert can even distinguish penetration testing workloads.

- For Azure VM hosting applications connecting to SQL Database:
  - Follow recommendation to Restrict access through Internet-facing endpoints in Azure Security Center.
  - Use virtual machine scale sets to run multiple instances of your application on Azure VMs.
  - Disable RDP and SSH from Internet to prevent brute force attack.

## Monitoring, Logging, and Auditing

This section refers to capabilities to help you detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. It also describes best practices to configure database auditing to track and capture database events.

### Protect databases against attacks

Advanced threat protection enables you to detect and respond to potential threats as they occur by providing security alerts on anomalous activities.

**How to implement**:

- Use [Advanced Threat Protection for SQL](threat-detection-overview.md#alerts) to detect unusual and potentially harmful attempts to access or exploit databases, including:
  - SQL injection attack.
  - Credentials theft/leak.
  - Privilege abuse.
  - Data exfiltration.

**Best practices**:

- Configure [Advanced Data Security (ADS)](advanced-data-security.md#getting-started-with-ads) for a specific server or a managed instance. You can also configure ADS for all servers and managed instances in a subscription by switching to [Azure Security Center Standard tier](../../security-center/security-center-pricing.md).

- For a full investigation experience, it's recommended to enable [SQL Database Auditing](../../azure-sql/database/auditing-overview.md). With auditing, you can track database events and write them to an audit log in an Azure Storage account or Azure Log Analytics workspace.

### Audit critical security events

Tracking of database events helps you understand database activity. You can gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations. It also enables and facilitates adherence to compliance standards.

**How to implement**:

- Enable [SQL Database Auditing](../../azure-sql/database/auditing-overview.md) or [Managed Instance Auditing](../managed-instance/auditing-configure.md) to track database events and write them to an audit log in your Azure Storage account, Log Analytics workspace (preview), or Event Hubs (preview).

- Audit logs can be written to an Azure Storage account, to a Log Analytics workspace for consumption by Azure Monitor logs, or to event hub for consumption using event hub. You can configure any combination of these options, and audit logs will be written to each.

**Best practices**:

- By configuring [SQL Database Auditing](../../azure-sql/database/auditing-overview.md) on your server or [Managed Instance Auditing](../managed-instance/auditing-configure.md) to audit events, all existing and newly created databases on that server will be audited.
- By default auditing policy includes all actions (queries, stored procedures and successful and failed logins) against the databases, which may result in high volume of audit logs. It's recommended for customers to [configure auditing for different types of actions and action groups using PowerShell](../../sql-database/sql-database-auditing.md#manage-auditing). Configuring this will help control the number of audited actions, and minimize the risk of event loss. Custom audit configurations allow customers to capture only the audit data that is needed.
- Audit logs can be consumed directly in the [Azure portal](https://portal.azure.com/), or from the storage location that was configured.

> [!NOTE]
> Enabling auditing to Log Analytics will incur cost based on ingestion rates. Please be aware of the associated cost with using this [option](https://azure.microsoft.com/pricing/details/monitor/), or consider storing the audit logs in an Azure storage account.

**Further resources**:

- [SQL Database Auditing](../../azure-sql/database/auditing-overview.md)
- [SQL Server Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine)

### Secure audit logs

Restrict access to the storage account to support Separation of Duties and to separate DBA from Auditors.

**How to implement**:

- When saving Audit logs to Azure Storage, make sure that access to the Storage Account is restricted to the minimal security principles. Control who has access to the storage account.
- For more information, see [Authorizing access to Azure Storage](../../storage/common/storage-auth.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

**Best practices**:

- Controlling Access to the Audit Target is a key concept in separating DBA from Auditors.

- When auditing access to sensitive data, consider securing the data with data encryption to avoid information leakage to the Auditor. For more information, see the section [Protect sensitive data in use from high-privileged, unauthorized users](#protect-sensitive-data-in-use-from-high-privileged-unauthorized-users).

## Security Management

This section describes the different aspects and best practices for managing your databases security posture. It includes best practices for ensuring your databases are configured to meet security standards, for discovering and for classifying and tracking access to potentially sensitive data in your databases.

### Ensure that the databases are configured to meet security best practices

Proactively improve your database security by discovering and remediating potential database vulnerabilities.

**How to implement**:

- Enable [SQL Vulnerability Assessment](https://docs.microsoft.com/sql/relational-databases/security/sql-vulnerability-assessment) (VA) to scan your database for security issues, and to automatically run periodically on your databases.

**Best practices**:

- Initially, run VA on your databases and iterate by remediating failing checks that oppose security best practices. Set up baselines for acceptable configurations until the scan comes out _clean_, or all checks has passed.  

- Configure periodic recurring scans to run once a week and configure the relevant person to receive summary emails.

- Review the VA summary following each weekly scan. For any vulnerabilities found, evaluate the drift from the previous scan result and determine if the check should be resolved. Review if there's a legitimate reason for the change in configuration.

- Resolve checks and update baselines where relevant. Create ticket items for resolving actions and track these until they're resolved.

**Further resources**:

- [SQL Vulnerability Assessment](https://docs.microsoft.com/sql/relational-databases/security/sql-vulnerability-assessment)
- [SQL Vulnerability Assessment service helps you identify database vulnerabilities](sql-vulnerability-assessment.md)

### Identify and tag sensitive data

Discover columns that potentially contain sensitive data. What is considered sensitive data heavily depends on the customer, compliance regulation, etc., and needs to be evaluated by the users in charge of that data. Classify the columns to use advanced sensitivity-based auditing and protection scenarios.

**How to implement**:

- Use [SQL Data Discovery and Classification](data-discovery-and-classification-overview.md) to discover, classify, label, and protect the sensitive data in your databases.
  - View the classification recommendations that are created by the automated discovery in the SQL Data Discovery and Classification dashboard. Accept the relevant classifications, such that your sensitive data is persistently tagged with classification labels.
  - Manually add classifications for any additional sensitive data fields that were not discovered by the automated mechanism.
- For more information, see [SQL Data Discovery and Classification](https://docs.microsoft.com/sql/relational-databases/security/sql-data-discovery-and-classification).

**Best practices**:

- Monitor the classification dashboard on a regular basis for an accurate assessment of the database’s classification state. A report on the database classification state can be exported or printed to share for compliance and auditing purposes.

- Continuously monitor the status of recommended sensitive data in SQL Vulnerability Assessment. Track the sensitive data discovery rule and identify any drift in the recommended columns for classification.  

- Use classification in a way that is tailored to the specific needs of your organization. Customize your Information Protection policy (sensitivity labels, information types, discovery logic) in the [SQL Information Protection](../../security-center/security-center-info-protection-policy.md) policy in Azure Security Center.

### Track access to sensitive data

Monitor who accesses sensitive data and capture queries on sensitive data in audit logs.

**How to implement**:

- Use SQL Audit and Data Classification in combination.
  - In your [SQL Database Audit](../../azure-sql/database/auditing-overview.md) log, you can track access specifically to sensitive data. You can also view information such as the data that was accessed, as well as its sensitivity label. For more information, see [Data Discovery and Classification](data-discovery-and-classification-overview.md) and [Auditing access to sensitive data](data-discovery-and-classification-overview.md#audit-sensitive-data).

**Best practices**:

- See best practices for the Auditing and Data Classification sections:
  - [Audit critical security events](#audit-critical-security-events)
  - [Identify and tag sensitive data](#identify-and-tag-sensitive-data)

### Visualize security and compliance status

Use a unified infrastructure security management system that strengthens the security posture of your data centers (including databases in SQL Database). View a list of recommendations concerning the security of your databases and compliance status.

**How to implement**:

- Monitor SQL-related security recommendations and active threats in [Azure Security Center](https://azure.microsoft.com/documentation/services/security-center/).

## Common security threats and potential mitigations

This section helps you find security measures to protect against certain attack vectors. It's expected that most mitigations can be achieved by following one or more of the security guidelines above.

### Security threat: Data exfiltration

Data exfiltration is the unauthorized copying, transfer, or retrieval of data from a computer or server. See a definition for [data exfiltration](https://en.wikipedia.org/wiki/Data_exfiltration) on Wikipedia.

Connecting to server over a public endpoint presents a data exfiltration risk as it requires customers open their firewalls to public IPs.  

**Scenario 1**: An application on an Azure VM connects to a database in Azure SQL Database. A rogue actor gets access to the VM and compromises it. In this scenario, data exfiltration means that an external entity using the rogue VM connects to the database, copies personal data, and stores it in a blob storage or a different SQL Database in a different subscription.

**Scenario 2**: A Rouge DBA. This scenario is often raised by security sensitive customers from regulated industries. In this scenario, a high privilege user might copy data from Azure SQL Database to another subscription not controlled by the data owner.

**Potential mitigations**:

Today, Azure SQL Database and SQL Managed Instance offers the following techniques for mitigating data exfiltration threats:

- Use a combination of Allow and Deny rules on the NSGs of Azure VMs to control which regions can be accessed from the VM.
- If using a server in SQL Database, set the following options:
  - Allow Azure Services to OFF.
  - Only allow traffic from the subnet containing your Azure VM by setting up a VNet Firewall rule.
  - Use [Private Link](../../private-link/private-endpoint-overview.md)
- For SQL Managed Instance, using private IP access by default addresses the first data exfiltration concern of a rogue VM. Turn on the subnet delegation feature on a subnet to automatically set the most restrictive policy on a SQL Managed Instance subnet.
- The Rogue DBA concern is more exposed with SQL Managed Instance as it has a larger surface area and networking requirements are visible to customers. The best mitigation for this is applying all of the practices in this security guide to prevent the Rogue DBA scenario in the first place (not only for data exfiltration). Always Encrypted is one method to protect sensitive data by encrypting it and keeping the key inaccessible for the DBA.

## Security aspects of business continuity and availability

Most security standards address data availability in terms of operational continuity, achieved by implementing redundancy and fail-over capabilities to avoid single points of failure. For disaster scenarios, it's a common practice to keep backups of Data and Log files. The following section provides a high-level overview of the capabilities that are built-into Azure. It also provides additional options that can be configured to meet specific needs:

- Azure offers built-in high-availability: [High-availability with SQL Database and SQL Managed Instance](high-availability-sla.md)

- The Business Critical tier includes failover groups, multi-availability zones, full and differential log backups, and point-in-time-restore backups enabled by default:  
  - [High-availability - Zone redundant configuration](high-availability-sla.md#zone-redundant-configuration)
  - [Automated backups](automated-backups-overview.md)
  - [Recover a database using automated database backups - Point-in-time restore](recovery-using-backups.md#point-in-time-restore)

- Additional business continuity features such as auto-failover groups across different Azure geos can be configured as described here: [Overview of business continuity](business-continuity-high-availability-disaster-recover-hadr-overview.md)

## Next steps

- See [An overview of Azure SQL Database security capabilities](security-overview.md)
