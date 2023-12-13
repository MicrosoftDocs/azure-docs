---
title: Securing PaaS Databases in Azure | Microsoft Docs
description: "Learn about Azure SQL Database and Azure Synapse Analytics security best practices for securing your PaaS web and mobile applications. "
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin

ms.assetid:
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/31/2023
ms.author: terrylan

---
# Best practices for securing PaaS databases in Azure

In this article, we discuss a collection of [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview) and [Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) security best practices for securing your platform-as-a-service (PaaS) web and mobile applications. These best practices are derived from our experience with Azure and the experiences of customers like yourself.

Azure SQL Database and Azure Synapse Analytics provide a relational database service for your internet-based applications. Let's look at services that help protect your applications and data when using Azure SQL Database and Azure Synapse Analytics in a PaaS deployment:

- Microsoft Entra authentication (instead of SQL Server authentication)
- Azure SQL firewall
- Transparent Data Encryption (TDE)

## Use a centralized identity repository

Azure SQL Database can be configured to use one of two types of authentication:

- **SQL authentication** uses a username and password. When you created the server for your database, you specified a "server admin" login with a username and password. Using these credentials, you can authenticate to any database on that server as the database owner.

- **Microsoft Entra authentication** uses identities managed by Microsoft Entra ID and is supported for managed and integrated domains. To use Microsoft Entra authentication, you must create another server admin called the "Microsoft Entra admin," which is allowed to administer Microsoft Entra users and groups. This admin can also perform all operations that a regular server admin can.

[Microsoft Entra authentication](../../active-directory/develop/authentication-vs-authorization.md) is a mechanism of connecting to Azure SQL Database and Azure Synapse Analytics by using identities in Microsoft Entra ID. Microsoft Entra ID provides an alternative to SQL Server authentication so you can stop the proliferation of user identities across database servers. Microsoft Entra authentication enables you to centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage database users and simplifies permission management.  

<a name='benefits-of-using-azure-ad-instead-of-sql-authentication'></a>

### Benefits of using Microsoft Entra ID instead of SQL authentication

- Allows password rotation in a single place.
- Manages database permissions using external Microsoft Entra groups.
- Eliminates storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Microsoft Entra ID.
- Uses contained database users to authenticate identities at the database level.
- Supports token-based authentication for applications connecting to SQL Database.
- Supports domain federation with Active Directory Federation Services (ADFS) or native user/password authentication for a local Microsoft Entra ID without domain synchronization.
- Supports connections from SQL Server Management Studio that use Active Directory Universal Authentication, which includes [Multi-Factor Authentication (MFA)](../../active-directory/authentication/concept-mfa-howitworks.md). MFA includes strong authentication with a range of easy verification options. Verification options are phone call, text message, smart cards with pin, or mobile app notification. For more information, see [Universal Authentication with SQL Database and Azure Synapse Analytics](/azure/azure-sql/database/authentication-mfa-ssms-overview).

To learn more about Microsoft Entra authentication, see:

- [Use Microsoft Entra authentication for authentication with SQL Database, Managed Instance, or Azure Synapse Analytics](/azure/azure-sql/database/authentication-aad-overview)
- [Authentication to Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-authentication.md)
- [Token-based authentication support for Azure SQL Database using Microsoft Entra authentication](/azure/azure-sql/database/authentication-aad-overview)

> [!NOTE]
> To ensure that Microsoft Entra ID is a good fit for your environment, see [Microsoft Entra features and limitations](/azure/azure-sql/database/authentication-aad-overview#azure-ad-features-and-limitations).

## Restrict access based on IP address

You can create firewall rules that specify ranges of acceptable IP addresses. These rules can be targeted at both the server and database levels. We recommend using database-level firewall rules whenever possible to enhance security and to make your database more portable. Server-level firewall rules are best used for administrators and when you have many databases that have the same access requirements but you don't want to spend time configuring each database individually.

SQL Database default source IP address restrictions allow access from any Azure address, including other subscriptions and tenants. You can restrict this to only allow your IP addresses to access the instance. Even with your SQL firewall and IP address restrictions, strong authentication is still needed. See the recommendations made earlier in this article.

To learn more about Azure SQL Firewall and IP restrictions, see:

- [Azure SQL Database and Azure Synapse Analytics access control](/azure/azure-sql/database/logins-create-manage)
- [Azure SQL Database and Azure Synapse Analytics firewall rules](/azure/azure-sql/database/firewall-configure)

## Encrypt data at rest

[Transparent Data Encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption) is enabled by default. TDE transparently encrypts SQL Server, Azure SQL Database, and Azure Synapse Analytics data and log files. TDE protects against a compromise of direct access to the files or their backup. This enables you to encrypt data at rest without changing existing applications. TDE should always stay enabled; however, this will not stop an attacker using the normal access path. TDE provides the ability to comply with many laws, regulations, and guidelines established in various industries.

Azure SQL manages key related issues for TDE. As with TDE, on-premises special care must be taken to ensure recoverability and when moving databases. In more sophisticated scenarios, the keys can be explicitly managed in Azure Key Vault through extensible key management. See [Enable TDE on SQL Server Using EKM](/sql/relational-databases/security/encryption/enable-tde-on-sql-server-using-ekm). This also allows for Bring Your Own Key (BYOK) through Azure Key Vaults BYOK capability.

Azure SQL provides encryption for columns through [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine). This allows only authorized applications access to sensitive columns. Using this kind of encryption limits SQL queries for encrypted columns to equality-based values.

Application level encryption should also be used for selective data. Data sovereignty concerns can sometimes be mitigated by encrypting data with a key that is kept in the correct country/region. This prevents even accidental data transfer from causing an issue since it is impossible to decrypt the data without the key, assuming a strong algorithm is used (such as AES 256).

You can use additional precautions to help secure the database, such as designing a secure system, encrypting confidential assets, and building a firewall around the database servers.

## Next steps

This article introduced you to a collection of SQL Database and Azure Synapse Analytics security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](paas-deployments.md)
- [Securing PaaS web and mobile applications using Azure App Services](paas-applications-using-app-services.md)
