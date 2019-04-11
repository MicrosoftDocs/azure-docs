---
title: How to configure the Azure Active Directory policy for Azure Data Catalog
description: You may encounter a situation where you can sign in to the Azure Data Catalog portal, but when you attempt to sign in to the data source registration tool, you encounter an error message.
author: markingmyname
ms.author: maghan
ms.service: data-catalog
ms.topic: conceptual
ms.date: 04/06/2019
---

# Azure Active Directory policy configuration

You may encounter a situation where you can sign in to the Azure Data Catalog portal, but when you attempt to sign in to the data source registration tool, you encounter an error message that prevents you from signing in. This error may occur when you are on the company network or when you're connecting from outside the company network.

## Registration tool

The registration tool uses *forms authentication* to validate user sign-ins against Azure Active Directory. For successful sign-in, an Azure Active Directory administrator must enable forms authentication in the *global authentication policy*.

With the global authentication policy, you can enable authentication separately for intranet and extranet connections, as shown in the following image. Sign-in errors may occur if forms authentication isn't enabled for the network from which you're connecting.

 ![Azure Active Directory global authentication policy](./media/troubleshoot-policy-configuration/global-auth-policy.png)

For more information, see [Configuring authentication policies](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn486781(v=ws.11)).

## Next steps

* [Create an Azure Data Catalog](data-catalog-get-started.md)