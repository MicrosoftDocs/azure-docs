---
title: What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance? (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn about Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.devlang: 
ms.topic: overview
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: mathoma, bonova, urmilano, wiassaf, kendralittle
ms.date: 03/01/2022
---

# What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance? (Preview)

[Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) is the intelligent, scalable cloud database service that combines the broadest SQL Server database engine compatibility with the benefits of a fully managed and evergreen platform as a service. Kerberos authentication for Azure Active Directory (Azure AD) enables Windows Authentication access to Azure SQL Managed Instance. Windows Authentication for managed instances empowers customers to move existing services to the cloud while maintaining a seamless user experience and provides the basis for infrastructure modernization.

## Key capabilities and scenarios

As customers modernize their infrastructure, application, and data tiers, they also modernize their identity management capabilities by shifting to Azure AD. Azure SQL offers multiple [Azure AD Authentication](/azure/azure-sql/database/authentication-aad-overview) options:

- 'Azure Active Directory - Password' offers authentication with Azure AD credentials
- 'Azure Active Directory - Universal with MFA' adds multi-factor authentication
- 'Azure Active Directory – Integrated' uses federation providers like [Active Directory Federation Services](/windows-server/identity/active-directory-federation-services) (ADFS) to enable Single Sign-On experiences

However, some legacy apps can't change their authentication to Azure AD: legacy application code may longer be available, there may be a dependency on legacy drivers, clients may not be able to be changed, and so on. Windows Authentication for Azure AD principals removes this migration blocker and provides support for a broader range of customer applications.

Windows Authentication for Azure AD principals on managed instances is available for devices or virtual machines (VMs) joined to Active Directory (AD), Azure AD, or hybrid Azure AD. An Azure AD hybrid user whose user identity exists both in Azure AD and AD can access a managed instance in Azure using Azure AD Kerberos.

Enabling Windows Authentication for a managed instance doesn't require customers to deploy new on-premises infrastructure or manage the overhead of setting up Domain Services.

Windows Authentication for Azure AD principals on Azure SQL Managed Instance enables two key scenarios: migrating on-premises SQL Servers to Azure with minimal changes and modernizing security infrastructure.

### Lift and shift on-premises SQL Servers to Azure with minimal changes

By enabling Windows Authentication for Azure Active Directory principals, customers can migrate to Azure SQL Managed Instance without implementing changes to application authentication stacks or deploying Azure AD Domain Services. Customers can also use Windows Authentication to access a managed instance from their AD or Azure AD joined devices.

Windows Authentication for Azure Active Directory principals also enables the following patterns on managed instances. These patterns are frequently used in traditional on-premises SQL Servers:


- **"Double hop" authentication**: Web applications use IIS identity impersonation to run queries against an instance in the security context of the end user.
- **Traces using extended events and SQL Server Profiler** can be launched using Windows authentication, providing ease of use for database administrators and developers accustomed to this workflow. Learn how to [run a trace against Azure SQL Managed Instance using Windows Authentication for Azure Active Directory principals](winauth-azuread-run-trace-managed-instance.md).

### Modernize security infrastructure

Enabling Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance equips customers to modernize their security practices.

For example, a customer can enable a mobile analyst, using proven tools that rely on Windows Authentication, to authenticate to a managed instance using biometric credentials. This can be accomplished even if the mobile analyst works from a laptop that is joined to Azure AD.

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- [How Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory and Kerberos (Preview)](winauth-implementation-aad-kerberos.md)
- [How to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)](winauth-azuread-setup.md)