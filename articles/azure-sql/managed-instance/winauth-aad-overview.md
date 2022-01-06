---
title: What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance?
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
ms.date: 01/31/2022
---

# What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance?

[Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) is the intelligent, scalable cloud database service that combines the broadest SQL Server database engine compatibility with the benefits of a fully managed and evergreen platform as a service. Kerberos authentication for Azure Active Directory (Azure AD) enables Windows authentication access to Azure SQL Managed Instance. Windows Authentication for managed instances empowers customers to move existing services to the cloud while maintaining a seamless user experience and provides the basis for infrastructure modernization.

## Key capabilities and scenarios

Windows Authentication for Azure AD principals on managed instances is available for devices or virtual machines (VMs) joined to Active Directory (AD), Azure AD, or hybrid Azure AD. An Azure AD hybrid user whose user identity exists both in Azure AD and AD can access a managed instance in Azure using Azure AD Kerberos.

Enabling Windows Authentication for a managed instance doesn't require customers to deploy new on-premises infrastructure or manage the overhead of setting up Domain Services.

Windows Authentication for Azure AD principals on Azure SQL Managed Instance enables two key scenarios: migrating on-premises SQL Servers to Azure with minimal changes and modernizing infrastructure.

### Lift and shift on-premises SQL Servers to Azure with minimal changes

By enabling Windows Authentication for Azure Active Directory principals, customers can migrate to Azure SQL Managed Instance without implementing changes to application authentication stacks or deploying Azure AD Domain Services. Customers can also use Windows Authentication to access a managed instance from their AD or Azure AD joined devices.

Windows Authentication for Azure Active Directory principals enables the following patterns on managed instances. These patterns are frequently used in traditional on-premises SQL Servers:


- **"Double hop" authentication** <!--- TODO: link to double hop article once it's created -->
    - Web applications use IIS identity impersonation to run queries against an instance in the security context of the end user.
    - Linked servers are used to run queries across instances in the security context of the originating user.
 
- **SharePoint, Reporting Services, Integration Services, and Analysis Services** 
    - Many on-premises SQL Server customers use applications such as SharePoint, SQL Server Reporting Services (SSRS), SQL Server Integration Services (SSIS), and SQL Server Analysis Services (SSAS). Using Windows Authentication is a recommended security best practice for these applications.
    - Azure SQL Managed Instance is certified for SharePoint 2019 and SharePoint 2016.

### Modernize infrastructure

Enabling Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance enables customers to modernize their security practices.

For example, a customer can enable a mobile analyst, using proven tools that rely on Windows Authentication, to authenticate to a managed instance using biometric credentials.

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- TODO: add link for announcement blog post
- TODO: add links to related articles in this set after titles and filenames are finalized