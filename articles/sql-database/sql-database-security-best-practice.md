---
title: Security best practices playbook for Azure SQL Database | Microsoft Docs
description: This topic provides general guidance for security best practices in Azure SQL Database.
ms.service: sql-database
ms.subservice: security
author: VanMSFT
ms.author: vanto
ms.topic: article
ms.date: 10/11/2019
ms.reviewer: ""
---

# Azure SQL Database security best practices playbook

## Overview

This document provides guidance on how to solve common security requirements for new or existing applications using Azure SQL Database. It is organized by high-level security areas. For addressing specific threats, refer to the [Common security threats and potential mitigations](#common-security-threats-and-potential-mitigations) section. Although some of the presented recommendations are applicable when migrating applications from on-premises to Azure, migration scenarios are not the focus of this document and will be addressed separately.

### Azure SQL Database deployment offers covered in this guide

- Azure SQL Database
- Azure SQL Database managed instance

### SQL deployment offers not covered in this guide

- Azure SQL Data Warehouse
- Azure SQL VMs (IaaS)
- SQL Server on-premises

### Audience

The intended audience for this guide consists of technical sellers, solution architects, customer support helping customers secure their data in Azure SQL Database. **The document can also be shared with customers under NDA.** We may also decide to release the document publicly in the future.

### Using this guide

Unless otherwise stated, we recommend you follow all best practices listed in each section to achieve the respective goal or requirement. To meet specific security compliance standards or best practices, important regulatory compliance controls are listed under the Requirements or Goals section wherever applicable. These are the security standards and regulations that are referenced in this paper:

- [FedRAMP](https://www.fedramp.gov/documents/): AC-04, AC-06
- [SOC](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome.html): CM-3, SDL-3
- [ISO/IEC 27001](https://www.iso27001security.com/html/27001.html): Access Control, Cryptography
- [Microsoft Operational Security Assurance (OSA) practices](https://www.microsoft.com/en-us/securityengineering/osa/practices): Practice #1-6 and #9
- [NIST Special Publication 800-53 Security Controls](https://nvd.nist.gov/800-53): AC-5, AC-6
- [PCI DSS](https://www.pcisecuritystandards.org/document_library): 6.3.2, 6.4.2

### Feedback

To make this document as relevant and helpful as possible, we plan on continuing to update the recommendations and best practices listed here. Therefore, we need the help of all the practitioners, architects, and solution specialists working directly with our customers to provide feedback on the content as well as up-to-date information about the latest security threats, customer requirements, and possible solutions. Contact us at <dpsqlsecpm@microsoft.com> if you would like to provide input into this document.

## Security, Privacy, and Compliance: A Brief Overview 

Azure offers advanced security and compliance products and services that fall into four categories and apply to all Azure services, including Azure SQL Database.

- [**Security**](https://azure.microsoft.com/overview/security/): Azure provides multi-layered security across physical datacenters, infrastructure, and operations with cyber security experts actively monitoring to protect customer assets and data. The guidelines in the following sections provide insight into how organizations can use the built-in controls and services across identity, data, networking, key vault, etc. to develop a security strategy that is tailored to their needs to keep data secure incl. from Azure cloud operators.  

- [**Privacy**](https://azure.microsoft.com/overview/trusted-cloud/privacy/): GDPR is applied globally across Microsoft to ensure strict data handling practices are used across all services. Furthermore, privacy is built into services as part of the Microsoft Security Development Lifecycle, which is practiced by all services. Solutions like Compliance Manager and eDiscovery can help accelerate the time it takes enterprises to discover their data assets and track how well they are adhering to ISO and GDPR controls.  

- **Transparency**: Microsoft provides visibility into what we do with customer data, how we protect it, and how our customers are in control. Organizations can obtain copies of all audit reports validated by third parties at the [Service Trust Portal](https://servicetrust.microsoft.com/). 

- [**Compliance**](https://azure.microsoft.com/overview/trusted-cloud/compliance/): Azure has the most comprehensive compliance coverage in the industry, covering more than 70 global regulations and laws, such as FedRAMP, PCI, SOC, and GDPR to name a few. The Azure Trust Center provides a [comprehensive list of offerings from compliance standards to certifications](https://www.microsoft.com/trustcenter/compliance/complianceofferings) for all Azure services including Azure SQL Database. Note that there is no difference between Azure SQL Database and Azure SQL Database managed instance as far as compliance certifications are concerned. In fact, the Azure Trust Center only lists Azure SQL Database since that is the common service name for all SQL offer types incl. singletons, managed instance, and hyperscale.

## Implementation Guidelines by Security Area

## Authentication

### Central management for identities

**How to implement**: 

Use Azure Active Directory (Azure AD) for centralized identity management:

- Manage group accounts and control user permissions without duplicating logins across Azure SQL logical servers and databases
- Simplify permission management 
- Flexible configuration 
- Manage applications at scale 

**Best practices**:

- Create an Azure AD tenant and [create users](../active-directory/fundamentals/add-users-azure-active-directory.md) to represent human users and create [service principals](../active-directory/develop/app-objects-and-service-principals.md) to represent apps, services, and automation tools. Service principals are equivalent to service accounts in Windows and Linux. 

- Assign access rights to resources to Azure AD principals via group assignment: Create Azure AD groups, grant access to groups, and add individual members to the groups. In your database, create contained database users that map your Azure AD groups. 
  - See: [Configure and manage Azure Active Directory authentication with SQL](sql-database-aad-authentication-configure.md) as well as [Use Azure AD for authentication with SQL](sql-database-aad-authentication.md).
  > [!NOTE]
  > In managed instance, you can also create logins that map to Azure AD principals in the master database. See [CREATE LOGIN (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current).

- Using Azure AD groups simplifies permission management and both the group owner, and the resource owner can add/remove members to/from the group. 

- Create a separate group for Azure AD administrator for SQL DB servers.

  - See the article, [Provision an Azure Active Directory administrator for your Azure SQL Database server](sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-azure-sql-database-server).

- Monitor Azure AD group membership changes using Azure Active Directory audit activity reports. 

- For managed instance, a separate step is required to create Azure AD admin. 
  - See the article, [Provision an Azure Active Directory administrator for your managed instance](sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-managed-instance). 

> [!NOTE]
> - Azure AD authentication is recorded in Azure SQL audit logs, but not in Azure AD sign-in logs.
> - RBAC permissions granted in Azure do not apply to Azure SQL DB permissions. Such permissions must be created/mapped manually in SQL DB using existing SQL permissions.
> - On the client-side Azure AD authentication needs access to the internet or via UDR to a VNet.
> - The Azure AD access token is cached on the client side and its lifetime depends on token configuration. See the article, [Configurable token lifetimes in Azure Active Directory (Preview)](../active-directory/develop/active-directory-configurable-token-lifetimes.md)

### Multi-Factor Authentication (MFA)

> [!NOTE]
> Mentioned in: OSA Practice #2, ISO Access Control (AC)

**How to implement**:

- Enable MFA in Azure AD using Conditional Access and use interactive authentication. 

- The alternative is to enable MFA for the entire Azure AD or AD domain.

**Best practices**:

- Activate Conditional Access in Azure AD (requires Premium subscription). 
  - See the article, [Conditional Access in Azure AD](../active-directory/conditional-access/overview.md).  

- Create Azure AD group(s) and enable MFA policy for selected groups using Azure AD Conditional Access. 
  - See the article, [Plan Conditional Access Deployment](../active-directory/conditional-access/plan-conditional-access.md). 

- Alternatively, MFA can be enabled for the entire Azure AD or for the whole Active Directory federated with Azure AD. 

- Use Azure AD Interactive authentication mode for SQL DB where a password is requested interactively, followed by MFA authentication:      
  - Use Universal Authentication in SSMS. See the article, [Using Multi-factor AAD authentication with Azure SQL Database and Azure SQL Data Warehouse (SSMS support for MFA)](sql-database-ssms-mfa-authentication.md).
  - Use Interactive Authentication supported in SQL Server Data Tools (SSDT). See the article, [Azure Active Directory support in SQL Server Data Tools (SSDT)](https://docs.microsoft.com/sql/ssdt/azure-active-directory?view=azuresqldb-current).
  - Use other SQL tools supporting MFA.
    - [DacFx support](sql-database-ssms-mfa-authentication.md)  
    - SSMS Wizard support for Export/Extract/Deploy database  
    - [sqlpackage.exe](https://docs.microsoft.com/sql/tools/sqlpackage): option ‘/ua’ 
    - [sqlcmd Utility](https://docs.microsoft.com/sql/tools/sqlcmd-utility): option -G (interactive)
    - [bcp Utility](https://docs.microsoft.com/sql/tools/bcp-utility): option -G (interactive) 

- Implement your applications to connect to Azure SQL Database using interactive authentication with MFA support. 
  - See the article, [Connect to Azure SQL Database with Azure Multi-Factor Authentication](active-directory-interactive-connect-azure-sql-db.md). 
  > [!NOTE]
  > This authentication mode requires user-based identities. In cases where a trusted identity model is used that is bypassing individual Azure AD user authentication (e.g. using managed identity for Azure resources), MFA does not apply.

### Minimize the use of password-based authentication for users

> [!NOTE]
> Mentioned in: OSA Practice #4, ISO Access Control (AC)

**How to implement**:

- Use an Azure AD integrated authentication that eliminates the use of passwords.

**Best practices**:

- Use single sign-on authentication using Windows credentials. Federate the on premises AD domain with Azure AD and use Integrated Windows authentication (for domain-joined machines with Azure AD).
  - See the articles, [SSMS support for Azure AD Integrated authentication](sql-database-aad-authentication-configure.md#active-directory-integrated-authentication) and [application sample for integrated authentication](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/security/azure-active-directory-auth/integrated) for enabling access SQL DB without any SQL tools.

### Minimize the use of password-based authentication for applications 

> [!NOTE]
> Mentioned in: OSA Practice #4, ISO Access Control (AC)

**How to implement**:

- Enable Azure Managed Identity. Alternatively use integrated or certificate-based authentication. 

**Best practices**:

- Use [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).
  - [System-assigned managed identity](../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-sql.md) 
  - [User-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md)
  - [Use Azure SQL Database from app service with managed identity (without code changes)](https://azure.microsoft.com/resources/samples/app-service-msi-entityframework-dotnet/)

- Use cert-based authentication for an application. 
  - See this [code sample](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/security/azure-active-directory-auth/token). 

- Use Azure AD authentication for integrated federated domain and domain-joined machine (see section above).

### Protect passwords and secrets

**How to implement**:

- Use Azure Key Vault to store passwords and secrets. Whenever applicable, use MFA for SQL DB with Azure AD users.

**Best practices**:

- If avoiding passwords or secrets is not possible, store user passwords and application secrets in Azure Key Vault and manage access through AIM/RBAC/PIM. 

- Various app development frameworks may also offer framework-specific mechanisms for protecting secrets in the app. For example: [ASP.NET core app](https://docs.microsoft.com/aspnet/core/security/app-secrets?view=aspnetcore-2.1&tabs=windows).

### Support legacy scenarios, tools, and applications not enabled for Azure AD authentication 

**How to implement**:

- Use SQL authentication.

**Best practices**:

- As a server admin, create logins and users. Unless using contained database users with passwords, all passwords are stored in master database.
  - See the article, [Controlling and granting database access to SQL Database and SQL Data Warehouse](sql-database-manage-logins.md).

- Follow password management best practices:
  - Provide a complex password, composed of Latin upper and lowercase letters, digits (0-9) and non-alphanumeric characters (like $, !, #, or %).
  - Use longer passphrases instead of shorter randomly selected characters.
  - Enforce manual password change at least every 90 days.

## Access management

### Implement principle of least privilege

> [!NOTE]
> Mentioned in: FedRamp controls AC-06, NIST: AC-6, OSA Practice #3 

**How to implement**:

Assign only the necessary permissions to complete the required tasks by doing the following:

- In SQL Data Plane: 
    - Use granular permissions and user-defined database roles (or server-roles in MI): 
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

- In Azure ARM:
  - Use builtin-roles if the permissions just fit or custom RBAC roles to assign just the necessary permissions 
    - [Built-in roles for Azure](../role-based-access-control/built-in-roles.md) 
    - [Custom roles for Azure resources](../role-based-access-control/custom-roles.md) 
- Further resources: 
  - [Permissions (Database Engine)](https://docs.microsoft.com/sql/relational-databases/security/permissions-database-engine)
  - [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md)
  - [Just Enough Administration](https://docs.microsoft.com/powershell/scripting/learn/remoting/jea/overview) 
  - [Privileged Account Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

**Best practices**:

The following best practices are optional but will result in better manageability and supportability of your security strategy: 

- If possible, start with the least possible set of permissions and start adding permissions one by one if there is a real necessity (and justification) – as opposed to the opposite approach: taking permissions away step by step. 

- Refrain from assigning permissions to individual users. Use roles (database or server roles) consistently instead. This helps greatly with reporting and troubleshooting permissions. (Azure RBAC only supports permission assignment via roles.) 

- Use built-in roles when the permissions match exactly the needed permissions – if the union of all permissions from multiple built-in roles leads to a 100% match, you can assign multiple roles concurrently as well. 

- Create and use custom roles when built-in roles grant too many permissions or insufficient permissions. Typical Roles that are used in practice: 
  - Security deployment 
  - Administrator 
  - Developer 
  - Support personnel 
  - Auditor 
  - Automated processes 
  - End user 

- Remember that permissions in SQL Server can be applied on the following scopes. The smaller the scope, the smaller the impact of the granted permissions: 
  - Logical server (special roles in master database) 
  - Database 
  - Schema (Schema-design for SQL Server: recommendations for Schema design with security in mind). 
  - Object (table, view, procedure, etc.) 

It is not recommended to apply permissions on the object level because this level adds unnecessary complexity to the overall implementation. If you decide to use object-level permissions, those should be clearly documented. The same applies to column-level-permissions, which are even less recommendable for the same reasons, plus the fact that the standard rules for [DENY](https://docs.microsoft.com/sql/t-sql/statements/deny-object-permissions-transact-sql) do not apply for columns.

### Implement Separation of Duties

> [!NOTE]
> Mentioned in: FedRamp: AC-04, NIST: AC-5, ISO: A.6.1.2, PCI 6.4.2, SOC: CM-3, SDL-3

Achieving Separation of Duties (SoD) is challenging for security-related or troubleshooting tasks with the current SQL permission model and may be impractical. Other areas like development and end-user roles are easier to segregate. 

The main issue is the necessity to grant db_owner or higher permissions for many tasks. Therefore, everything demonstrated herein must be carefully examined under the context of the customer requirements and compliance. 

Most compliance rulesets allow the use of alternate control functions such as Auditing when other solutions are not practical. 

If meeting a specific requirement is the goal, it is up to the auditors to advise on the specific compromises to be made in favor of keeping a system manageable, especially if the reasons are well explained, and you are pushing the boundary of what is doable with current technologies. _This is not an official statement, therefore do not quote this._

**How to implement SoD through permissions**:

- Identify the required level of Separation of Duties. Examples: 
  - Between Development/Test and Production environments 
  - Security-wise sensitive tasks vs DBA management level tasks vs developer tasks. 
    - Examples: Auditor, creation of security policy for Role-level Security (RLS), Implementing SQL Database objects with DDL-permissions.

- Identify a comprehensive hierarchy of users (and automated processes) that access the system.

- Create roles according to the needed user-groups and assign permissions to roles. 
  - For management-level tasks in Azure portal or via PowerShell-automation use RBAC roles. Either find a built-in role matching the requirement, or create a custom RBAC role using the available permissions 
  - Create Server roles for server-wide tasks (creating new logins, databases) in Azure SQL Database managed instance. 
  - Create Database Roles for database-level tasks.

- For certain sensitive tasks consider creating special stored procedures signed by a certificate to execute the tasks on behalf of the users. 
  - Example: [Tutorial: Signing Stored Procedures with a Certificate](https://docs.microsoft.com/sql/relational-databases/tutorial-signing-stored-procedures-with-a-certificate) 

- In cases when it is not feasible at least not without major costs and efforts that may render the system near unusable, compromises can be made and mitigated through the use of compensating controls such as: 
  - Human intervention in processes. 
  - Audit trails – for more information on Auditing, see, [Audit critical security events](#audit-critical-security-events).

Additional resources: 

- For Azure SQL Database:  
  - [Controlling and granting database access to SQL Database and SQL Data Warehouse](sql-database-manage-logins.md)
  - [Engine Separation of Duties for the Application Developer](https://docs.microsoft.com/en-us/previous-versions/sql/sql-server-2008/cc974525(v=sql.100)) 
  - [Separation of Duties in SQL Server 2014](https://www.microsoft.com/en-us/download/details.aspx?id=39269)
  - [Signing Stored Procedures in SQL Server](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/signing-stored-procedures-in-sql-server)

- For Azure Resource Management:
  - [Built-in roles for Azure](../role-based-access-control/built-in-roles.md) 
  - [Custom roles for Azure resources](../role-based-access-control/custom-roles.md)
  - [Using Azure AD Privileged Identity Management for elevated access](https://www.microsoft.com/en-us/itshowcase/using-azure-ad-privileged-identity-management-for-elevated-access)

**Best practices on achieving SoD through permissions**:

- Make sure that different accounts are used for Development/Test and Production environments. This helps to comply with separation of Test & Production systems 

- Refrain from assigning permissions to individual users. Use roles (database or server roles) consistently instead. This helps greatly with reporting and troubleshooting permissions 

- Use built-in roles when the permissions match exactly the needed permissions – if the union of all permissions from multiple built-in roles leads to a 100% match, you can assign multiple roles concurrently as well. 

- Create and use custom roles when built-in roles grant too many permissions or insufficient permissions. 

- Role assignments can also be done temporarily, also known as Dynamic Separation of Duties (DSD), either within SQL Agent Job steps in T-SQL or using Azure PIM for RBAC roles. 

- Make sure that DBAs do not have access to the encryption keys or key stores and Security Administrators with access to the keys have no access to the database in turn. 

- Always make sure to have an Audit trail for security-related actions. 

- You can retrieve the definition of the built-in RBAC roles to see the permissions used and create a custom role based on excerpts and cumulations of these via Powershell 

- Since any member of the db_owner database role can change security settings like TDE, or change the SLO, this membership should be granted with care. On the other hand, many tasks, like changing any database setting such as changing DB options require db_owner privileges. Therefore, Auditing does play a key role in any solution. 

**How to implement SoD through encryption**:

- Implement Transparent Data Encryption (TDE) with customer-managed keys in Azure Key Vault (AKV) to enable Separation of Duties between data owner and security owner. 
  - See the article, [Configure customer-managed keys for Azure Storage encryption from the Azure portal](../storage/common/storage-encryption-keys-portal.md). 

- To ensure that a DBA cannot see data that is considered highly sensitive and still can perform DBA tasks, you can use Always Encrypted with role separation. 
  - See the articles, [Overview of Key Management for Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/overview-of-key-management-for-always-encrypted), [Key Provisioning with Role Separation](https://docs.microsoft.com/sql/relational-databases/security/encryption/configure-always-encrypted-keys-using-powershell#KeyProvisionWithRole), and [Column Master Key Rotation with Role Separation](https://docs.microsoft.com/sql/relational-databases/security/encryption/rotate-always-encrypted-keys-using-powershell#column-master-key-rotation-with-role-separation). 

**Best practices on achieving SoD through encryption**:

It is not possible to keep a db_owner from viewing user data with permissions only. If there is highly sensitive data in a database, Always Encrypted can be used to safely prevent db_owners or any other DBA from viewing it.

### Avoid over-provisioning of permissions, unused logins, and roles

**How to implement**:

- Perform regular checks using Vulnerability Assessment (VA) to test for too many permissions. 

- Perform regular checks using VA to test for empty roles. 

- Audit changes to Permissions and role membership as well as impersonation attempts 

**Best practices**:

- Create baselines to avoid negative results in succeeding scans when the issue in question does not apply to your system. 

- Additional resources: 
  - [SQL Vulnerability Assessment](https://docs.microsoft.com/sql/relational-databases/security/sql-vulnerability-assessment)
  - [SQL Vulnerability Assessment service helps you identify database vulnerabilities](sql-vulnerability-assessment.md)
  - [Get started with SQL database auditing](sql-database-auditing.md)

### Perform regular code reviews

> [!NOTE]
> Mentioned in: PCI: 6.3.2, SOC: SDL-3 

**How to implement**:

- Use a database tool like Azure Data Studio that supports source control. 

- Implement a segregated code deployment process.

- Before committing to main branch, a person (other than the author of the code itself) has to inspect the code for potential elevation of privileges risks as well as malicious data modifications to protect against fraud and rogue access. This can be done using source control mechanisms.

**Best practices**:

- Standardization: It helps to implement a standard procedure that is to be followed for any code updates. 

- Vulnerability Assessment contains rules that check for excessive permissions, the use of old encryption algorithms and other security problems within a database schema. 

- Further checks can be done in a QA environment using Advanced Threat Protection that scans for code that is vulnerable to SQL-injection.

- Examples of what to look out for: 
  - Creation of a user or changing security settings from within an automated SQL-code-update deployment. 
  - A stored procedure, which, depending on the parameters provided, updates a monetary value in a cell in a non-conforming way. 

- Make sure the person conducting the review is an individual other than the originating code author and knowledgeable in code-reviews and secure coding.

- Be sure to know all sources of code-changes: Code can reside in T-SQL Scripts; it can be ad-hoc commands to be executed or be deployed in form of Views, Functions, Triggers, and Stored Procedures. It can also be part of SQL Agent Job definitions (Steps), be executed from within SSIS packages, Azure Data Factory, and other services.

## Data protection

### Encrypt data in transit, applications, and your database

> [!NOTE]
> Mentioned in: OSA Practice #6, ISO Control Family: Cryptography 

**How to implement**:

- Refer to the [Network Security](#network-security) section. 

**Best practices**:

- Refer to the [Network Security](#network-security) section. 

### Encrypt data at rest

> [!NOTE]
> Mentioned in: OSA Practice #6, ISO Control Family: Cryptography 

**How to implement**:

- Use [Transparent Database Encryption (TDE)](transparent-data-encryption-azure-sql.md). 

**Best practices**:

- Turn on TDE in all databases unless data is non-sensitive and there are no compliance requirements. TDE is enabled by default for all databases created after 2017, but needs to be manually turned on for Azure SQL managed instance and for older databases in Azure SQL Database. 

- Do not store data that require encryption-at-rest in the master database. The master data cannot be encrypted with TDE.

- Use customer-managed keys in Azure Key Vault (AKV) if you need increased transparency and granular control over the TDE protection. AKV allows the ability to revoke permissions at any time to render the database inaccessible. You can centrally manage TDE protectors along with other keys, or rotate the TDE protector at your own schedule using AKV. 

- If you are using customer-managed keys in Azure Key Vault, comply with [Guidelines for configuring TDE with Azure Key Vault](transparent-data-encryption-byok-azure-sql.md) and How to configure Geo-DR with Azure Key Vault.

### Protect sensitive data in use from high-privileged, unauthorized users

**How to implement**:

- Use [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine). 

**Best practices**:

- Use Always Encrypted to ensure sensitive data is not exposed in plaintext in Azure SQL Database, even in memory/in use. This protects the data from Database Administrators (DBAs) and cloud admins (or bad actors who can impersonate high-privileged but unauthorized users) and gives you more control over who can access your data. 

- Always Encrypted is not a substitute to encrypt data at rest (TDE) or in transit (SSL/TLS), and should not be used for non-sensitive data in order to minimize performance and functionality impact. Using Always Encrypted in conjunction with TDE and TLS is recommended for comprehensive protection of data at-rest, in-transit, and in-use. 

- Manage Always Encrypted keys with role separation if you are using AE to protect data from malicious DBAs. With role separation, a security admin creates the physical keys, and a DBA creates column master key and column encryption key metadata objects, describing the physical keys, in the database. During this process, the security admin does not need access to the database, and the DBA does not need access to the physical keys in plaintext. 
  - See the article, [Managing Keys with Role Separation](https://docs.microsoft.com/sql/relational-databases/security/encryption/overview-of-key-management-for-always-encrypted#managing-keys-with-role-separation) for details. 

- Store your column master keys (CMKs) in Azure Key Vault for ease of management. Avoid using Windows Certificate Store (and in general, distributed key store solutions, as opposed central key management solutions) that make key management hard. 

- Think carefully through the tradeoffs of using multiple keys (CEKs/CMKs). Keep the number of CEKs/CMKs small to reduce key management cost. One CMK and one CEK per database is sufficient in steady-state environments (not in the middle of a key rotation), unless you have different user groups, each using different keys and accessing different data.  

- Rotate CMKs per your compliance requirements. If you also need to rotate CEKs, consider using online encryption to minimize application downtime. 
  - See the article, [Performance and Availability Considerations](https://docs.microsoft.com/sql/relational-databases/security/encryption/configure-column-encryption-using-powershell#performance-and-availability-considerations). 

- Use deterministic encryption if computations (equality) on data need to be supported. Otherwise, use randomized encryption. Avoid using deterministic encryption for low-entropy data sets, or data sets with publicly known distribution. 

- In general, Always Encrypted is designed as a solution for protecting data inside the database system from admins (or bad actors impersonating admins) of the database system. It is not designed as a solution for protecting data inside applications from (low-privilege) application users or for achieving the isolation in multi-tenant applications. 

- Always Encrypted does not easily support granting temporary access to the keys (and the protected data). For example, if you need to share the keys with a DBA, to allow the DBA to perform some cleansing operations on sensitive and encrypted data, the only way to reliability revoke the access to the data from the DBA will be to rotate both the CEKs and the CMKs protecting the data, which is the expensive operation. 

- To access the plaintext values in encrypted columns, a user needs to have access to the CMK, protecting the columns, which is configured in the key store holding the CMK. In addition, the user needs to have the VIEW ANY COLUMN MASTER KEY DEFINITION and VIEW ANY COLUMN ENCRYPTION KEY DEFINITION database permissions.

### Control access of application users to sensitive data through encryption 

**How to implement**:

- Use Cell-level Encryption (CLE). See the article, [Encrypt a Column of Data](https://docs.microsoft.com/sql/relational-databases/security/encryption/encrypt-a-column-of-data) for details. 

**Best practices**:

- Control access to keys through SQL permissions and roles. 

- Use AES (AES 256 recommended) for data encryption.  

- Protect symmetric keys with asymmetric keys/certificates (not passwords) to avoid using 3DES. 

- Be careful when migrating a database using CLE via export/import (bacpac files). 
  - See the article, [Recommendations for using Cell Level Encryption in Azure SQL Database](https://blogs.msdn.microsoft.com/sqlsecurity/2015/05/12/recommendations-for-using-cell-level-encryption-in-azure-sql-database/) on how to prevent loosing keys when migrating data, and for other best practice guidance.

### Protect data against unauthorized viewing by application users while preserving data format

**How to implement**:

- Use [Dynamic Data Masking](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking) (DDM) to obfuscate table columns.

> [!NOTE]
> Always Encrypted does not work with Dynamic Data Masking. It is not possible to encrypt and mask the same column, which implies that you need to prioritize protecting data in use vs. masking the data for your app users (via DDM).

**Best practices**:

> [!NOTE]
> DDM cannot be used to protect data from high-privilege users. Masking policies do not apply to users with administrative access like db_owner.

- Do not permit app users to run ad-hoc queries (as they may be able to work around DDM).  
  - See the article, [Bypassing masking using inference or brute-force techniques](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking#security-note-bypassing-masking-using-inference-or-brute-force-techniques) for details.  

- Use a proper access control policy (via SQL permissions, roles, RLS) to limit user permissions to make updates in the masked columns. Creating a mask on a column does not prevent updates to that column. Therefore, although users receive masked data when querying the masked column, the same users can update the data if they have write-permissions.    

-  DDM does not preserve the statistical properties of the masked values, which may impact query results (for example, queries containing filtering predicates or joins on the masked data).

## Network security

### Configure my client to connect securely to Azure SQL Database 

**How to implement**:

- Ensure that client machines connecting to SQL Server are using  [Transport Layer Security (TLS)](sql-database-security-overview.md#transport-layer-security-tls-encryption-in-transit).

**Best practices**:

- Configure all your apps and tools to connect to SQL DB with encryption enabled 
  - Encrypt = On, TrustServerCertificate = Off (or equivalent with non-Microsoft drivers). 

- If your app uses a driver that does not support TLS or supports an older version of TLS, replace the driver, if possible. If not possible, carefully evaluate the security risks. 

- Reduce attack vectors via vulnerabilities in SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1 by disabling them on client machines connecting to SQL Server per [Transport Layer Security (TLS) registry settings](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings#tls-10). 

- Check cipher suites available on the client per [Cipher Suites in TLS/SSL (Schannel SSP)](https://docs.microsoft.com/windows/desktop/SecAuthN/cipher-suites-in-schannel) and specifically disable 3DES per [Configuring TLS Cipher Suite Order](https://docs.microsoft.com/windows-server/security/tls/manage-tls#configuring-tls-cipher-suite-order). 

- If using Azure SQL Database managed instance, use the **Proxy** connection type (default) as this enforces encryption from the server side. The **Redirect** connection type currently does not support encryption enforcement and is only available on private IP connections. 
  - For more information, see [Azure SQL Connectivity Architecture - Connection policy](sql-database-connectivity-architecture.md#connection-policy).
  - There are future plans to have encryption enforced for both **Proxy** and **Redirect** connection types. 

### Minimize Attack Surface

> [!NOTE]
> Mentioned in: OSA Practice #5

**How to implement**:

- Use VNet Service endpoints and VNet Firewall Rules.

- For managed instance, follow our documentation on [Network requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements). 

**Best practices**:

- Restricting access to Azure SQL Database and Azure SQL Database managed instance by connecting on a private endpoint (for example, using a private data path): 
  - Single databases users should utilize [VNet Service endpoints with VNet Firewall Rules](sql-database-vnet-service-endpoint-rule-overview.md) to restrict access to customer owned virtual networks if possible.
  - Azure SQL Database managed instance can be isolated inside a virtual network to prevent external access. Applications and tools that reside in the same or peered virtual network in the same region could access it directly. Applications and tools that are in different region could utilize VNet-to-VNet connection or Express route circuit peering to establish connection. Customer should use Network Security Groups (NSG) to restrict access over port 1433 only to resources that require access to managed instance 
  - The Azure SQL team is working on a [Private Link](sql-database-private-endpoint-overview.md) feature that would provide a dedicated private IP for Logical server inside a customer’s virtual network. You can also use a proxy as described in this [blog post](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/Using-a-TCP-proxy-to-connect-to-SQL-Database-over-VPN/ba-p/390962). 
  - Mobile users should utilize point-to-site VPN connections to connect over the data path.
  - Users connected to their on-premises network should utilize site-to-site VPN connection or Express Route to connect over the data path.

- You can access Azure SQL Database and Azure SQL Database managed instance by connecting on a public endpoint (for example, using a public data path). The following best practices should be considered: 
  - For a single database (logical server), use [IP firewall rules](sql-database-firewall-configure.md) to restrict access to only authorized IP addresses.
  - For a managed instance, use Network Security Groups (NSG) to restrict access over port 3342 only to required resources. For more information, see [Use an Azure SQL Database managed instance securely with public endpoints](sql-database-managed-instance-public-endpoint-securely.md). 

> [!NOTE]
> For a managed instance public endpoint is not enabled by default, and must be explicitly enabled. If company policy disallows the use of public endpoints, use [Azure Policy](../governance/policy/overview.md) to prevent enabling public endpoints in the first place.

- Set up Azure Networking components: 
  - Follow [Azure best practices for network security](../security/fundamentals/network-best-practices.md).
  - Plan Virtual Network (VNet) configuration per best practices outlined in [Azure Virtual Network frequently asked questions (FAQ)](../virtual-network/virtual-networks-faq.md) and plan. 
  - Segment a VNet into multiple subnets and assign resources for similar role to the same subnet (for example, front-end vs back-end resources).
  - Use [Network Security Groups (NSGs)](../virtual-network/security-overview.md) to control traffic between subnets inside the Azure VNet boundary.
  - Enable [Azure Network Watcher](../network-watcher/network-watcher-monitoring-overview.md) for your subscription to monitor inbound and outbound network traffic.

### For Power BI connecting to SQL Database and Azure SQL Database managed instance

**Best practices**:

- For Power BI Desktop, use private data path whenever possible. 

- Ensure that Power BI Desktop is connecting using TLS1.2 by setting the registry key on the client machine as per [Transport Layer Security (TLS)](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings) registry settings. 

- Restrict data access for specific users via [Row-level security (RLS) with Power BI](https://docs.microsoft.com/power-bi/service-admin-rls). 

- For Power BI Service, use the [on-premises data gateway](https://docs.microsoft.com/power-bi/service-gateway-onprem), keeping in mind [Limitations and Considerations](https://docs.microsoft.com/power-bi/service-gateway-onprem#limitations-and-considerations).

### For App Service connecting to SQL Database & MI

**Best practices**:

- For a simple Web App, connecting over public endpoint requires setting **Allow Azure Services** to ON. 

- [Integrate your app with an Azure Virtual Network](../app-service/web-sites-integrate-with-vnet.md) for private data path connectivity to managed instance. Optionally, you can also deploy a Web App with [App Service Environments (ASE)](../app-service/environment/intro.md). 

- For Web App with ASE or VNet Integrated Web App connecting to Single Database, you can use [VNet Service endpoints and VNet Firewall Rules](sql-database-vnet-service-endpoint-rule-overview.md) to limit access from a specific VNet and subnet, and then set **Allow Azure Services** to OFF. You can also connect ASE to a managed instance over a private data path.  

- Ensure that your Web App is configured per the article, [Best practices for securing PaaS web and mobile applications using Azure App Service](../security/security-paas-applications-using-app-services.md). 

- Install [Web Application Firewall (WAF)](../application-gateway/waf-overview.md) to protect your web app from common exploits and vulnerabilities.

### For Azure VM hosting applications connecting to Azure SQL Database or Azure SQL Database managed instance

**Best practices**:

- Use a combination of Allow and Deny rules on the NSGs of Azure VMs to control which regions can be accessed from the VM.

- Ensure that your VM is configured per the article, [Security best practices for IaaS workloads in Azure](../security/azure-security-iaas.md).

- Ensure that all VMs are associated with a specific VNet and subnet. 

- Evaluate if you need the default route 0.0.0.0/Internet per the guidance at [about forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md#about-forced-tunneling). 
  - If yes – for example, front-end subnet - then keep the default route.
  - If no – for example, middle tier or back-end subnet – then enable force tunneling so no traffic goes over Internet to reach on-premises (a.k.a cross-premises). 

- Implement [optional default routes](../virtual-network/virtual-networks-udr-overview.md#optional-default-routes) if you are using peering or connecting to on-premises. 

- Implement [User Defined Routes](../virtual-network/virtual-networks-udr-overview.md#user-defined) if you need to send all traffic in the VNet to a Network Virtual Appliance for packet inspection. 

- Use [VNet Service endpoints](sql-database-vnet-service-endpoint-rule-overview.md) for secure access to PaaS services like Azure Storage via the Azure backbone network. 

### Protect against Distributed Denial of Service (DDoS) attacks

> [!NOTE]
> Mentioned in: OSA Practice #9

**How to implement**:

DDoS protection is automatically enabled as part of the Azure Platform. It includes always-on traffic monitoring and real-time mitigation of network-level attacks on public endpoints. 

- Use [Azure DDoS Protection](../virtual-network/ddos-protection-overview.md) to monitor public IP addresses associated to resources deployed in virtual networks.

- Use [Advanced Threat Protection for Azure SQL Database](sql-database-threat-detection-overview.md) to detect Denial of Service (DoS) attacks against databases.

**Best practices**:

- Follow the practices described in [Minimize Attack Surface](#minimize-attack-surface) helps minimize DDoS attack threats. 

- The Advanced Threat Protection **Brute force SQL credentials** alert helps to detect brute force attacks. In some cases, the alert can even distinguish penetration testing workloads. 

- For Azure VM hosting applications connecting to SQL Database: 
  - Follow recommendation to Restrict access through Internet-facing endpoints in Azure Security Center. 
  - Use virtual machine scale sets to run multiple instances of your application on Azure VMs. 
  - Disable RDP and SSH from Internet to prevent brute force attack. 

## Monitoring, Logging, and Auditing  

### Protect databases against attacks 

**How to implement**:

- Use [Advanced Threat Protection for SQL](sql-database-threat-detection-overview.md#advanced-threat-protection-alerts) to detect unusual and potentially harmful attempts to access or exploit databases, including:
  - SQL injection attack.
  - Credentials theft/leak.
  - Privilege abuse.
  - Data exfiltration.

**Best practices**:

- Configure [Advanced Data Security](sql-database-advanced-data-security.md#getting-started-with-ads) for Azure SQL Database for a specific logical server or managed instance or for all SQL servers in a subscription by switching to [Azure Security Center Standard tier](../security-center/security-center-pricing.md). 

- For a full investigation experience, it is recommended to enable [SQL Database Auditing](sql-database-auditing.md) to track database events and write them to an audit log in Azure storage account or Azure Log Analytics workspace. 

### Audit critical security events

**How to implement**:

- Enable [SQL Database Auditing](sql-database-auditing.md) to track database events and write them to an audit log in your Azure storage account, Log Analytics workspace, or Event Hubs. 

- Audit logs can be written to an Azure storage account, to a Log Analytics workspace for consumption by Azure Monitor logs, or to event hub for consumption using event hub. You can configure any combination of these options, and audit logs will be written to each. 

**Best practices**:

- By configuring [SQL Database Auditing](sql-database-auditing.md) on your database server to audit events, all existing and newly created databases on that server will be audited.

- Auditing all database and server events may result in performance hit or event loss. The recommendations are for customers to customize which events will be audited based on their regulatory and compliance requirements using [PowerShell cmdlets](sql-database-auditing.md#subheading-7) or the [REST API](sql-database-auditing.md#subheading-9). These events should include but shouldn’t be limited to: 
  - Configuration of Audit
  - Access to sensitive data

- Audit logs can be consumed directly in the [Azure portal](https://portal.azure.com/), or from the storage location that was configured. 

> [!NOTE]
> Enabling auditing to Log Analytics will incur cost based on ingestion rates. Please be aware of the associated cost with using this [option](https://azure.microsoft.com/pricing/details/monitor/), or consider storing the audit logs in an Azure storage account. 

**Further resources**:

- [SQL Database Auditing](sql-database-auditing.md)
- [SQL Server Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine) 

### Secure audit logs

**How to implement**:

- When saving Audit logs to Azure Storage make sure that access to the Storage Account is restricted to the minimal security principles by using controlling access to the storage account.

- For more information, see [Authorizing access to Azure Storage](../storage/common/storage-auth.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

**Best practices**:

- Controlling Access to the Audit Target is a key concept in separating DBA from Auditors. 

- When auditing access to sensitive data, consider securing the data with data encryption to avoid information leakage to the Auditor. For more information, see the section [Protect sensitive data in use from high-privileged, unauthorized users](#protect-sensitive-data-in-use-from-high-privileged-unauthorized-users).

## Security Management

### Ensure that the database(s) are configured to meet security best practices 

**How to implement**:

- Enable [SQL Vulnerability Assessment](https://docs.microsoft.com/sql/relational-databases/security/sql-vulnerability-assessment) (VA) to scan your database for security issues, and to automatically run periodically on your databases.

**Best practices**:

- Initially, run VA on your databases and iterate by remediating failing checks that oppose security best practices, and setting up baselines for acceptable configurations until the scan comes out ‘clean’ (all checks pass).  

- Configure periodic recurring scans to run once a week and configure the relevant person to receive summary emails. 

- Review the VA summary following each weekly scan. For any vulnerabilities found, evaluate the drift from the previous scan result and determine if the check should be resolved, or if there is a legitimate reason for the change in configuration.   

- Resolve checks and update baselines where relevant, or create ticket items for resolving actions and track these until they are resolved. 

**Further resources**:

- [SQL Vulnerability Assessment](https://docs.microsoft.com/sql/relational-databases/security/sql-vulnerability-assessment) 
- [SQL Vulnerability Assessment service helps you identify database vulnerabilities](sql-vulnerability-assessment.md)

### Identify and tag sensitive data 

**How to implement**:

- Use [SQL Data Discovery and Classification](sql-database-data-discovery-and-classification.md) to discover, classify, label, and protect the sensitive data in your databases. 
  - View the classification recommendations that are created by the automated discovery in the SQL Data Discovery and Classification dashboard, and accept the relevant classifications, such that your sensitive data is persistently tagged with classification labels. 
  - Manually add classifications for any additional sensitive data fields that were not discovered by the automated mechanism. 
- For more information, see [SQL Data Discovery & Classification](https://docs.microsoft.com/sql/relational-databases/security/sql-data-discovery-and-classification).

**Best practices**:

- Monitor the classification dashboard on a regular basis for an accurate assessment of the database’s classification state. A report on the database classification state can be exported or printed to share for compliance and auditing purposes.

- Continuously monitor the status of recommended sensitive data in SQL Vulnerability Assessment, by tracking the sensitive data discovery rule and identifying any drift in the recommended columns for classification.  

- Use classification in a way that is tailored to the specific needs of your organization. Customize your Information Protection policy (sensitivity labels, information types, discovery logic) in the [SQL Information Protection](../security-center/security-center-info-protection-policy.md) policy in Azure Security Center. 

### Track access to sensitive data 

**How to implement**:

- Use SQL Audit and Data Classification in combination. 
  - In your [SQL Database Audit](sql-database-auditing.md) log, you can track access specifically to sensitive data, and view information such as the data that was accessed as well as its sensitivity label ([Auditing access to sensitive data](sql-database-data-discovery-and-classification.md#subheading-3). 

**Best practices**:

- See best practices for the Auditing and Data Classification sections: 
  - [Audit critical security events](#audit-critical-security-events) 
  - [Identify and tag sensitive data](#identify-and-tag-sensitive-data) 

### Visualize security and compliance status 

**How to implement**:

- Monitor SQL-related security recommendations and active threats in [Azure Security Center](https://azure.microsoft.com/documentation/services/security-center/).

## Common security threats and potential mitigations

This section helps you find security measures to protect against certain attack vectors. It is expected that most mitigations can be achieved by following one or more of the security guidelines above.

### Security threat: Data exfiltration

Data exfiltration is the unauthorized copying, transfer, or retrieval of data from a computer or server. See a definition for [data exfiltration](https://en.wikipedia.org/wiki/Data_exfiltration) on Wikipedia.

For most customers connecting to Azure SQL Database over a public endpoint presents a data exfiltration risk as it requires them to open their firewalls to public IPs.  

**Scenario 1**: A SQL Database is connected to an Azure VM. A rogue actor gets access to the VM and compromises it. In this scenario, data exfiltration means that an external entity using the rogue VM connects to SQL Database, copies Personal Identifiable information (PII) data and stores it in blob storage or a different SQL Database in a different subscription.

**Scenario 2**: A Rouge DBA. This scenario is often raised by security sensitive customers from regulated industries. In this scenario, a high privilege user might copy data from Azure SQL Database to another subscription not controlled by the data owner.

**Potential mitigations**:

- Today, we offer the following techniques for mitigating data exfiltration threats: 
  - Use a combination of Allow and Deny rules on the NSGs of Azure VMs to control which regions can be accessed from the VM. 
  - If using Azure SQL Database, set the following:
    - Allow Azure Services to OFF.
    - Only allow traffic from the subnet containing your Azure VM by setting up a VNet Firewall rule.
- Use [Private Link](sql-database-private-endpoint-overview.md)
  - For managed instance, using private IP access by default addresses the first data exfiltration concern of a rogue VM. 
  - The Rogue DBA concern is more exposed with managed instance as MI has a larger surface area and networking requirements are visible to customers. The best mitigation for this is applying all of the practices in this security guide to prevent the Rogue DBA scenario in the first place (not only for data exfiltration). Always Encrypted is one method to protect sensitive data by encrypting it and keeping the key inaccessible for the DBA.

**Future mitigation implementations**:

- In the short term, we are working on a subnet delegation feature that will allow us to automatically set the most restrictive policy on a managed instance subnet. 
- In the future, we will provide data/system traffic separation so high privileged users will not be in a position to exfiltrate data. 

## Security aspects of business continuity and availability

Most security standards address data availability in terms of operational continuity, achieved by implementing redundancy and fail-over capabilities to avoid single points of failure. For disaster scenarios, it is a common practice to keep backups of Data and Log files. The following section provides a high-level overview of the capabilities that are built-into Azure, as well as additional options that can be configured to meet specific needs: 

- Azure offers built-in high-availability: [High-availability and Azure SQL Database](sql-database-high-availability.md) 

- The Business Critical tier includes failover groups, multi-availability zones, full and differential log backups, and point-in-time-restore backups enabled by default:  
  - [High-availability and Azure SQL Database - Zone redundant configuration](sql-database-high-availability.md#zone-redundant-configuration)
  - [Automated backups](sql-database-automated-backups.md)
  - [Recover an Azure SQL database using automated database backups - Point-in-time restore](sql-database-recovery-using-backups.md#point-in-time-restore)

- Additional business continuity features such as auto-failover groups across different Azure geos can be configured as described here: [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md)

## Feedback

> [!IMPORTANT]
> **Please provide feedback to the SQL Security Team: <dpsqlsecpm@microsoft.com>**