---
title: Security best practices playbook for Azure SQL Database | Microsoft Docs
description: This topic provides general guidance for security best practices in Azure SQL Database.
ms.service: sql-database
ms.subservice: security
author: VanMSFT
ms.author: vanto
ms.topic: article
ms.date: 10/07/2019
ms.reviewer: ""
---

# Azure SQL Database security best practices playbook

## Overview

This document provides guidance on how to solve common security requirements for new or existing applications using Azure SQL Database. It is organized by high-level security areas. For addressing specific threats, refer to the **Common Security Threats and Potential Mitigations - NEED LINK** section. Although some of the presented recommendations are applicable when migrating applications from on-premises to Azure, migration scenarios are not the focus of this document and will be addressed separately.

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

To make this document as relevant and helpful as possible, we plan on continuing to update the recommendations and best practices listed here. Therefore, we need the help of all the practitioners, architects, and solution specialists working directly with our customers to provide feedback on the content as well as up-to-date information about the latest security threats, customer requirements, and possible solutions. Please contact us at: dpsqlsecpm@microsoft.com if you would like to provide input into this document.

## Security, Privacy and Compliance: A Brief Overview 

Azure offers advanced security and compliance products and services that fall into four categories and apply to all Azure services, including Azure SQL Database.

- [**Security**](https://azure.microsoft.com/overview/security/): Azure provides multi-layered security across physical datacenters, infrastructure, and operations with cyber security experts actively monitoring to protect customer assets and data. The guidelines in the following sections provide insight into how organizations can use the built-in controls and services across identity, data, networking, key vault, etc. to develop a security strategy that is tailored to their needs to keep data secure incl. from Azure cloud operators.  

- [**Privacy**](https://azure.microsoft.com/overview/trusted-cloud/privacy/): GDPR is applied globally across Microsoft to ensure strict data handling practices are used across all services. Furthermore, privacy is built into services as part of the Microsoft Security Development Lifecycle which is practiced by all services. Solutions like Compliance Manager and eDiscovery can help accelerate the time it takes enterprises to discover their data assets and track how well they are adhering to ISO and GDPR controls.  

- **Transparency**: Microsoft provides visibility into what we do with customer data, how we protect it, and how our customers are in control. Organizations can obtain copies of all audit reports validated by third parties at the [Service Trust Portal](https://servicetrust.microsoft.com/). 

- [**Compliance**](https://azure.microsoft.com/overview/trusted-cloud/compliance/): Azure has the most comprehensive compliance coverage in the industry, covering more than 70 global regulations and laws, such as FedRAMP, PCI, SOC, and GDPR to name a few. The Azure Trust Center provides a [comprehensive list of offerings from compliance standards to certifications](https://www.microsoft.com/trustcenter/compliance/complianceofferings) for all Azure services including Azure SQL Database. Please note that there is no difference between Azure SQL Database and Azure SQL Database managed instance as far as compliance certifications are concerned. In fact, the Azure Trust Center only lists Azure SQL Database since that is the common service name for all SQL offer types incl. singletons, managed instance, and hyperscale.

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
    > In managed instance, you can also create logins that map to Azure AD principals in the master database. See [CREATE LOGIN (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current).

- Using Azure AD groups simplifies permission management and both the group owner, and the resource owner can add/remove members to/from the group. 

- Create a separate group for Azure AD administrator for SQL DB servers .

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
  - Use Interactive Authentication supported in SQL Server Data Tools (SSDT). See the article, [Azure Active Directory support in SQL Server Data Tools (SSDT)](/sql/ssdt/azure-active-directory?view=azuresqldb-current).
  - Use other SQL tools supporting MFA.
    - [DacFx support](sql-database-ssms-mfa-authentication.md)  
    - SSMS Wizard support for Export/Extract/Deploy database  
    - [sqlpackage.exe](/sql/tools/sqlpackage): option ‘/ua’ 
    - [sqlcmd Utility](/sql/tools/sqlcmd-utility): option -G (interactive)
    - [bcp Utility](/sql/tools/bcp-utility): option -G (interactive) 

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

- Various app development frameworks may also offer framework-specific mechanisms for protecting secrets in the app. For example: [ASP.NET core app](/aspnet/core/security/app-secrets?view=aspnetcore-2.1&tabs=windows).

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

## Access Management

### Implement principle of least privilege

> [!NOTE]
> Mentioned in: FedRamp controls AC-06, NIST: AC-6, OSA Practice #3 

**How to implement**:

Assign only the necessary permissions to complete the required tasks by doing the following:

- In SQL Data Plane: 
    - Use granular permissions and user-defined database roles (or server-roles in MI): 
        1. Create the required roles
            - [CREATE ROLE](/sql/t-sql/statements/create-role-transact-sql)
            - [CREATE SERVER ROLE](/sql/t-sql/statements/create-server-role-transact-sql)
        1. Create required users
            - [CREATE USER](/sql/t-sql/statements/create-user-transact-sql)
        1. Add users as members to roles 
            - [ALTER ROLE](/sql/t-sql/statements/alter-role-transact-sql)
            - [ALTER SERVER ROLE](/sql/t-sql/statements/alter-server-role-transact-sql)
        1. Then assign permissions to roles. 
            - [GRANT](/sql/t-sql/statements/grant-transact-sql) 
    - Make sure to not assign users to unnecessary roles.

- In Azure ARM:
    - Use builtin-roles if the permissions just fit or custom RBAC roles to assign just the necessary permissions 
           - [Built-in roles for Azure](../role-based-access-control/built-in-roles.md) 
           - [Custom roles for Azure resources](../role-based-access-control/custom-roles.md) 
- Further resources: 
    - [Permissions (Database Engine)](/sql/relational-databases/security/permissions-database-engine)
    - [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md)
    - [Just Enough Administration](/powershell/scripting/learn/remoting/jea/overview) 
    - [Privileged Account Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations)

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

It is not recommended to apply permissions on the object level because this level adds unnecessary complexity to the overall implementation. If you decide to use object-level permissions, those should be clearly documented. The same applies to column-level-permissions, which are even less recommendable for the same reasons, plus the fact that the standard rules for [DENY](/sql/t-sql/statements/deny-object-permissions-transact-sql) do not apply for columns.

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
    - Example: [Tutorial: Signing Stored Procedures with a Certificate](/sql/relational-databases/tutorial-signing-stored-procedures-with-a-certificate) 

- In cases when it is not feasible at least not without major costs and efforts that may render the system near unusable, compromises can be made and mitigated through the use of compensating controls such as: 
    - Human intervention in processes 
    - Audit trails – for more details on Auditing see, **Audit critical security events - NEED LINK**

Additional resources: 

- For Azure SQL Database:  
    - [Controlling and granting database access to SQL Database and SQL Data Warehouse](sql-database-manage-logins.md)
    - [Engine Separation of Duties for the Application Developer](https://docs.microsoft.com/en-us/previous-versions/sql/sql-server-2008/cc974525(v=sql.100)) 
    - Separation of Duties in SQL Server 2014 
    - Signing Stored Procedures in SQL Server **NEED LINK**

- For Azure Resource Management:
    - [Built-in roles for Azure](../role-based-access-control/built-in-roles.md) 
    - [Custom roles for Azure resources](../role-based-access-control/custom-roles.md)
    - [Using Azure AD Privileged Identity Management for elevated access](https://www.microsoft.com/en-us/itshowcase/using-azure-ad-privileged-identity-management-for-elevated-access)

**Best practices on achieving SoD through permissions**:

- Make sure that different accounts are used for Development/Test and Production environments. This helps to comply with separation of Test & Production systems 

- Refrain from assigning permissions to individual users. Use roles (database or server roles) consistently instead. This helps greatly with reporting and troubleshooting permissions 

- Use built-in roles when the permissions match exactly the needed permissions – if the union of all permissions from multiple built-in roles leads to a 100% match, you can assign multiple roles concurrently as well. 

- Create and use custom roles when built-in roles grant too many permissions or insufficient permissions. 

- Role assignments can also be done temporarily, aka Dynamic Separation of Duties (DSD), either within SQL Agent Job steps in T-SQL or using Azure PIM for RBAC roles. 

- Make sure that DBAs do not have access to the encryption keys or key stores and Security Administrators with access to the keys have no access to the database in turn. 

- Always make sure to have an Audit trail for security-related actions. 

- You can retrieve the definition of the built-in RBAC roles to see the permissions used and create a custom role based on excerpts and cumulations of these via Powershell 

- Since any member of the db_owner database role can change security settings like TDE, or change the SLO, this membership should be granted with care. On the other hand, many tasks, like for example changing any database setting such as changing DB options require db_owner privileges. Therefore, Auditing does play a key role in any solution. 

**How to implement SoD through encryption**:

- Implement Transparent Data Encryption (TDE) with customer-managed keys in Azure Key Vault (AKV) to enable Separation of Duties between data owner and security owner. 
    - See the article, [Configure customer-managed keys for Azure Storage encryption from the Azure portal](../storage/common/storage-encryption-keys-portal.md). 

- To ensure that a DBA cannot see data that is considered highly sensitive and still can perform DBA tasks, you can use Always Encrypted with role separation. 
    - See the articles, [Overview of Key Management for Always Encrypted](/sql/relational-databases/security/encryption/overview-of-key-management-for-always-encrypted), [Key Provisioning with Role Separation](/sql/relational-databases/security/encryption/configure-always-encrypted-keys-using-powershell#KeyProvisionWithRole), and [Column Master Key Rotation with Role Separation](/sql/relational-databases/security/encryption/rotate-always-encrypted-keys-using-powershell#column-master-key-rotation-with-role-separation). 

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
    - [SQL Vulnerability Assessment](/sql/relational-databases/security/sql-vulnerability-assessment)
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


