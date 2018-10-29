---
title: 'Azure AD Connect: Sync service instances | Microsoft Docs'
description: This page documents special considerations for Azure AD instances.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''

ms.assetid: f340ea11-8ff5-4ae6-b09d-e939c76355a3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/18/2018
ms.component: hybrid
ms.author: billmath

---
# Azure AD Connect: Special considerations for instances
Azure AD Connect is most commonly used with the world-wide instance of Azure AD and Office 365. But there are also other instances and these have different requirements for URLs and other special considerations.

## Microsoft Cloud Germany
The [Microsoft Cloud Germany](http://www.microsoft.de/cloud-deutschland) is a sovereign cloud operated by a German data trustee.

| URLs to open in proxy server |
| --- |
| \*.microsoftonline.de |
| \*.windows.net |
| +Certificate Revocation Lists |

When you sign in to your Azure AD tenant, you must use an account in the onmicrosoft.de domain.

Features currently not present in the Microsoft Cloud Germany:

* **Password writeback** is available for preview with Azure AD Connect version 1.1.570.0 and after.
* Other Azure AD Premium services are not available.

## Microsoft Azure Government cloud
The [Microsoft Azure Government cloud](https://azure.microsoft.com/features/gov/) is a cloud for US government.

This cloud has been supported by earlier releases of DirSync. From build 1.1.180 of Azure AD Connect, the next generation of the cloud is supported. This generation is using US-only based endpoints and have a different list of URLs to open in your proxy server.

| URLs to open in proxy server |
| --- |
| \*.microsoftonline.com |
| \*.microsoftonline.us |
| \*.windows.net (Required for automatic Azure AD government tenant detection) |
| \*.gov.us.microsoftonline.com |
| +Certificate Revocation Lists |

> [!NOTE]
> As of AAD Connect version 1.1.647.0, setting the AzureInstance value in the registry is no longer required provided that *.windows.net is open on your proxy server(s).

Features currently not present in the Microsoft Azure Government cloud:

* **Password writeback**  is available for preview with Azure AD Connect version 1.1.570.0 and after.
* Other Azure AD Premium services are not available.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
