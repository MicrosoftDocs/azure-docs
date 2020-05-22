---
title: Securing PaaS Databases in Azure | Microsoft Docs
description: "Learn about Azure SQL Database and SQL Data Warehouse security best practices for securing your PaaS web and mobile applications. "
services: security
documentationcenter: na
author: techlake
manager: barbkess
editor: ''

ms.assetid:
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/28/2018
ms.author: terrylan

---
# Best practices for securing PaaS databases in Azure

In this article, we discuss a collection of [Azure SQL Database](../../azure-sql/database/sql-database-paas-overview.md) and [SQL Data Warehouse](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) security best practices for securing your platform-as-a-service (PaaS) web and mobile applications. These best practices are derived from our experience with Azure and the experiences of customers like yourself.

Azure SQL Database and SQL Data Warehouse provide a relational database service for your internet-based applications. Let’s look at services that help protect your applications and data when using Azure SQL Database and SQL Data Warehouse in a PaaS deployment:

- Azure Active Directory authentication (instead of SQL Server authentication)
- Azure SQL firewall
- Transparent Data Encryption (TDE)

## Use a centralized identity repository

Azure SQL Database can be configured to use one of two types of authentication:

- **SQL authentication** uses a username and password. When you created the server for your database, you specified a "server admin" login with a username and password. Using these credentials, you can authenticate to any database on that server as the database owner.

- **Azure Active Directory authentication** uses identities managed by Azure Active Directory and is supported for managed and integrated domains. To use Azure Active Directory Authentication, you must create another server admin called the "Azure AD admin," which is allowed to administer Azure AD users and groups. This admin can also perform all operations that a regular server admin can.

[Azure Active Directory authentication](../../active-directory/develop/authentication-scenarios.md) is a mechanism of connecting to Azure SQL Database and SQL Data Warehouse by using identities in Azure Active Directory (AD). Azure AD provides an alternative to SQL Server authentication so you can stop the proliferation of user identities across database servers. Azure AD authentication enables you to centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage database users and simplifies permission management.  

### Benefits of using Azure AD instead of SQL authentication

- Allows password rotation in a single place.
- Manages database permissions using external Azure AD groups.
- Eliminates storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure AD.
- Uses contained database users to authenticate identities at the database level.
- Supports token-based authentication for applications connecting to SQL Database.
- Supports domain federation with Active Directory Federation Services (ADFS) or native user/password authentication for a local Azure AD without domain synchronization.
- Supports connections from SQL Server Management Studio that use Active Directory Universal Authentication, which includes [Multi-Factor Authentication (MFA)](/azure/active-directory/authentication/multi-factor-authentication). MFA includes strong authentication with a range of easy verification options — phone call, text message, smart cards with pin, or mobile app notification. For more information, see [Universal Authentication with SQL Database and SQL Data Warehouse](../../azure-sql/database/authentication-mfa-ssms-overview.md).

To learn more about Azure AD authentication, see:

- [Use Azure Active Directory Authentication for authentication with SQL Database, Managed Instance, or SQL Data Warehouse](../../azure-sql/database/authentication-aad-overview.md)
- [Authentication to Azure SQL Data Warehouse](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-authentication.md)
- [Token-based authentication support for Azure SQL Database using Azure AD authentication](../../azure-sql/database/authentication-aad-overview.md)

> [!NOTE]
> To ensure that Azure Active Directory is a good fit for your environment, see [Azure AD features and limitations](../../azure-sql/database/authentication-aad-overview.md#azure-ad-features-and-limitations).

## Restrict access based on IP address

You can create firewall rules that specify ranges of acceptable IP addresses. These rules can be targeted at both the server and database levels. We recommend using database-level firewall rules whenever possible to enhance security and to make your database more portable. Server-level firewall rules are best used for administrators and when you have many databases that have the same access requirements but you don't want to spend time configuring each database individually.

SQL Database default source IP address restrictions allow access from any Azure address, including other subscriptions and tenants. You can restrict this to only allow your IP addresses to access the instance. Even with your SQL firewall and IP address restrictions, strong authentication is still needed. See the recommendations made earlier in this article.

To learn more about Azure SQL Firewall and IP restrictions, see:

- [Azure SQL Database and SQL Data Warehouse access control](../../azure-sql/database/logins-create-manage.md)
- [Azure SQL Database and SQL Data Warehouse firewall rules](../../azure-sql/database/firewall-configure.md)

## Encrypt data at rest

[Transparent Data Encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption) is enabled by default. TDE transparently encrypts SQL Server, Azure SQL Database, and Azure SQL Data Warehouse data and log files. TDE protects against a compromise of direct access to the files or their backup. This enables you to encrypt data at rest without changing existing applications. TDE should always stay enabled; however, this will not stop an attacker using the normal access path. TDE provides the ability to comply with many laws, regulations, and guidelines established in various industries.

Azure SQL manages key related issues for TDE. As with TDE, on-premises special care must be taken to ensure recoverability and when moving databases. In more sophisticated scenarios, the keys can be explicitly managed in Azure Key Vault through extensible key management. See [Enable TDE on SQL Server Using EKM](/sql/relational-databases/security/encryption/enable-tde-on-sql-server-using-ekm). This also allows for Bring Your Own Key (BYOK) through Azure Key Vaults BYOK capability.

Azure SQL provides encryption for columns through [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine). This allows only authorized applications access to sensitive columns. Using this kind of encryption limits SQL queries for encrypted columns to equality-based values.

Application level encryption should also be used for selective data. Data sovereignty concerns can sometimes be mitigated by encrypting data with a key that is kept in the correct country/region. This prevents even accidental data transfer from causing an issue since it is impossible to decrypt the data without the key, assuming a strong algorithm is used (such as AES 256).

You can use additional precautions to help secure the database, such as designing a secure system, encrypting confidential assets, and building a firewall around the database servers.

## Next steps

This article introduced you to a collection of SQL Database and SQL Data Warehouse security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](paas-deployments.md)
- [Securing PaaS web and mobile applications using Azure App Services](paas-applications-using-app-services.md)
