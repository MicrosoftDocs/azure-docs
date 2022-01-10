---
title: How Windows Authentication for Azure SQL Managed Instance is implemented with Azure AD and Kerberos (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn how Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory (Azure AD) and Kerberos.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: mathoma, bonova, urmilano, wiassaf, kendralittle
ms.date: 01/31/2022
---

# How Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory and Kerberos (Preview)

[Windows Authentication for Azure AD principals on Azure SQL Managed Instance](winauth-azuread-overview.md) enables customers to move existing services to the cloud while maintaining a seamless user experience and provides the basis for security infrastructure modernization. To enable Windows Authentication for Azure Active Directory (Azure AD) principals, you will turn your Azure AD tenant into an independent Kerberos realm and create an incoming trust in the customer domain. This configuration allows users in the customer domain to access resources in your Azure AD tenant. It will not allow users in the Azure AD tenant to access resources in the customer domain.

## How Azure AD provides Kerberos authentication

To create an independent Kerberos realm for an Azure AD tenant, customers install the Azure AD Hybrid Authentication Management PowerShell module on any Windows server and run a cmdlet to create an Azure AD Kerberos object in their cloud and Active Directory. Trust created in this way enables existing Windows clients to access Azure AD with Kerberos.

Windows 10 21H1 clients and above have been enlightened for interactive mode and do not need configuration for interactive login flows to work. Clients running previous versions of Windows can be configured to use Kerberos Key Distribution Center (KDC) proxy servers to use Kerberos authentication.

Kerberos authentication in Azure AD enables:

- Traditional on-premises applications to move to the cloud without changing their fundamental authentication scheme.

- Applications to trust Azure AD directly. There is no need for traditional Active Directory (AD).


*TODO: Insert the diagram from the Word doc here. Does the diagram apply to both authentication flows? Or is the diagram specific to the incoming trust-based flow? If the latter, it should go into the 'incoming trust-based flow section.*

## How Azure SQL Managed Instance works with Azure AD and Kerberos

Customers use the Azure portal to enable a system assigned service principal on each managed instance. The service principal allows managed instance users to authenticate using the Kerberos protocol.

## Next steps

Learn more about enabling Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- TODO: add link for announcement blog post
- TODO: add links for related articles in this set after titles and filenames are finalized