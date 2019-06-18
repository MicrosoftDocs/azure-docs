---
title: How to troubleshoot Azure Data Catalog
description: This article describes common troubleshooting concerns for Azure Data Catalog resources. 
author: JasonWHowell
ms.author: jasonh
ms.service: data-catalog
ms.topic: troubleshooting
ms.date: 06/13/2019
---

# Troubleshooting Azure Data Catalog

This article describes common troubleshooting concerns for Azure Data Catalog resources. 

## Functionality limitations

When using Azure Data Catalog, the following functionality is limited:

- Accounts with type **Guest Role** are not supported. You cannot add guest accounts as users of Azure Data Catalog, and guest users cannot use the portal at www.azuredatacatalog.com.

- Creating Azure Data Catalog resources using Azure Resource Manager Templates or Azure PowerShell commands is not supported.

- The Azure Data Catalog resource cannot be moved between Azure Tenants.

## Azure Active Directory policy configuration

You may encounter a situation where you can sign in to the Azure Data Catalog portal, but when you attempt to sign in to the data source registration tool, you encounter an error message that prevents you from signing in. This error may occur when you are on the company network or when you're connecting from outside the company network.

The registration tool uses *forms authentication* to validate user sign-ins against Azure Active Directory. For successful sign-in, an Azure Active Directory administrator must enable forms authentication in the *global authentication policy*.

With the global authentication policy, you can enable authentication separately for intranet and extranet connections, as shown in the following image. Sign-in errors may occur if forms authentication isn't enabled for the network from which you're connecting.

 ![Azure Active Directory global authentication policy](./media/troubleshoot-policy-configuration/global-auth-policy.png)

For more information, see [Configuring authentication policies](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn486781(v=ws.11)).

## Next steps

* [Create an Azure Data Catalog](data-catalog-get-started.md)
