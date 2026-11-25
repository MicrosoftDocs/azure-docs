---
title: Best practices for securing PaaS databases in Azure
description: "Learn about Azure SQL Database and Azure Synapse Analytics security best practices for securing your PaaS web and mobile applications."
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 04/16/2025
ms.author: mbaldwin
ai-usage: ai-assisted
---
# Best practices for securing PaaS databases in Azure

This article provides a collection of [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview) and [Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) security best practices for securing your platform as a service (PaaS) web and mobile applications. Microsoft derived these best practices from experience with Azure and Azure customers.

Azure SQL Database and Azure Synapse Analytics provide a relational database service for your internet-based applications. Review services that help protect your applications and data when you use Azure SQL Database and Azure Synapse Analytics in a PaaS deployment:

- Microsoft Entra authentication (instead of SQL Server authentication)
- Azure SQL firewall
- Transparent Data Encryption (TDE)

## Use a centralized identity repository

You can configure Azure SQL Database to use one of two types of authentication:

- **SQL authentication** uses a username and password. When you create the server for your database, you specify a `server admin` authentication with a username and password. Use these credentials to authenticate to any database on that server as the database owner.

- **Microsoft Entra authentication** uses identities managed by Microsoft Entra ID and supports managed and integrated domains. To use Microsoft Entra authentication, you must create another server admin called the `Microsoft Entra admin`, which can administer Microsoft Entra users and groups. This admin can also perform all operations that a regular server admin can.

[Microsoft Entra authentication](/entra/identity-platform/authentication-vs-authorization) is a mechanism for connecting to Azure SQL Database and Azure Synapse Analytics by using identities in Microsoft Entra ID. Microsoft Entra ID provides an alternative to SQL Server authentication so you can stop the proliferation of user identities across database servers. Microsoft Entra authentication enables you to centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage database users and simplifies permission management.

<a name='benefits-of-using-azure-ad-instead-of-sql-authentication'></a>

### Benefits of Microsoft Entra ID instead of SQL authentication

- Allows password rotation in a single place.
- You can manage database permissions by using external Microsoft Entra groups.
- Eliminates storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Microsoft Entra ID.
- Uses contained database users to authenticate identities at the database level.
- Supports token-based authentication for applications connecting to SQL Database.
- Supports domain federation with Active Directory Federation Services (ADFS) or native user/password authentication for a local Microsoft Entra ID without domain synchronization.
- It supports connections from SQL Server Management Studio that use Active Directory Universal Authentication, which includes [multifactor authentication (MFA)](/entra/identity/authentication/concept-mfa-howitworks). MFA includes strong authentication with a range of easy verification options. Verification options are phone call, text message, smart cards with PIN, or mobile app notification. For more information, see [Universal Authentication with SQL Database and Azure Synapse Analytics](/azure/azure-sql/database/authentication-mfa-ssms-overview).

For more information about Microsoft Entra authentication, see:

- [Use Microsoft Entra authentication for authentication with SQL Database, Managed Instance, or Azure Synapse Analytics](/azure/azure-sql/database/authentication-aad-overview)
- [Authentication to Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-authentication.md)
- [Token-based authentication support for Azure SQL Database by using Microsoft Entra authentication](/azure/azure-sql/database/authentication-aad-overview)

> [!NOTE]
> To ensure that Microsoft Entra ID is a good fit for your environment, see [Microsoft Entra features and limitations](/azure/azure-sql/database/authentication-aad-overview#azure-ad-features-and-limitations).

## Restrict access based on IP address

You can create firewall rules that specify ranges of acceptable IP addresses. You can target these rules at both the server and database levels. Use database-level firewall rules whenever possible to enhance security and to make your database more portable. Use server-level firewall rules for administrators and for many databases with the same access requirements when you don't want to spend time configuring each database individually.

SQL Database default source IP address restrictions allow access from any Azure address, including other subscriptions and tenants. You can restrict this to only allow your IP addresses to access the instance. Even with your SQL firewall and IP address restrictions, strong authentication is still needed. See the recommendations made earlier in this article.

For more information about Azure SQL firewall and IP restrictions, see:

- [Azure SQL Database and Azure Synapse Analytics access control](/azure/azure-sql/database/logins-create-manage)
- [Azure SQL Database and Azure Synapse Analytics firewall rules](/azure/azure-sql/database/firewall-configure)

## Encrypt data at rest

[Transparent Data Encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption) is enabled by default. TDE transparently encrypts SQL Server, Azure SQL Database, and Azure Synapse Analytics data and log files. TDE protects against a compromise of direct access to the files or their backup. This feature enables you to encrypt data at rest without changing existing applications. Keep TDE enabled. However, TDE doesn't stop an attacker that uses the normal access path. TDE helps you comply with many laws, regulations, and guidelines established in various industries.

Azure SQL manages key-related problems for TDE. As with TDE on-premises, take special care to ensure recoverability and support database moves. In more sophisticated scenarios, you can explicitly manage the keys in Azure Key Vault through extensible key management. See [Enable TDE on SQL Server Using EKM](/sql/relational-databases/security/encryption/enable-tde-on-sql-server-using-ekm). This capability also supports bring your own key (BYOK) through the Azure Key Vault BYOK capability.

Azure SQL provides encryption for columns through [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine). This feature allows only authorized applications to access sensitive columns. This kind of encryption limits SQL queries for encrypted columns to equality-based values.

Use application-level encryption for selective data. You can sometimes mitigate data sovereignty concerns by encrypting data with a key that's kept in the correct country/region. This approach prevents even accidental data transfer from causing a problem because it's impossible to decrypt the data without the key, assuming a strong algorithm such as AES-256 is used.

You can use more precautions to help secure the database, such as designing a secure system, encrypting confidential assets, and building a firewall around the database servers.

## Next steps

This article introduced you to a collection of SQL Database and Azure Synapse Analytics security best practices for securing your PaaS web and mobile applications. To learn more about securing your PaaS deployments, see:

- [Securing PaaS deployments](paas-deployments.md)
- [Securing PaaS web and mobile applications by using Azure App Service](paas-applications-using-app-services.md)
