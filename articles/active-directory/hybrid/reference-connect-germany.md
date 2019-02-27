---
title: Azure AD Connect in Microsoft Cloud Germany
description: Azure AD Connect will integrate your on-premises directories with Azure Active Directory. This allows you to provide a common identity for Office 365, Azure, and SaaS applications integrated with Azure AD.
keywords: introduction to Azure AD Connect, Azure AD Connect overview, what is Azure AD Connect, install active directory, Germany, Black Forest
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''

ms.assetid: 2bcb0caf-5d97-46cb-8c32-bda66cc22dad
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 07/12/2017
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect in Microsoft Cloud Germany - Public Preview
## Introduction
Azure AD Connect provides synchronization between your on-premises Active Directory and Azure Active Directory.
Currently, many of the scenarios in [Microsoft Cloud Germany](https://azure.microsoft.com/global-infrastructure/germany/
) must be done by the operator. 
When using Microsoft Cloud Germany, you must be aware of the following information:

* The following URLs must be opened on a proxy server for synchronization to occur successfully:
  
  * *.microsoftonline.de
  * *.windows.net
  * * Certificate Revocation Lists
* When you sign in to your Azure AD directory, you must use an account in the onmicrosoft.de domain.

 
## Download
You can download Azure AD Connect from the Azure AD Connect blade within the portal.  Use the instructions below to locate the Azure AD Connect blade.

### The Azure AD Connect Blade
Once you've signed in to the Azure portal:

1. Go to Browse
2. Select Azure Active Directory
3. Then select Azure AD Connect

You'll see these details:

![Azure AD Connect Blade](./media/reference-connect-germany/germany1.png)

The following table describes the features shown in the blade.

| Title | Description |
| --- | --- |
| SYNC STATUS |Let's you know whether synchronization is enabled or disabled. |
| LAST SYNC |The last time a successful sync completed. |
| FEDERATED DOMAINS |Shows the number of federated domains currently configured. |

## Installation
To install Azure AD Connect, you can use the documentation [here](how-to-connect-install-roadmap.md).

## Advanced features and Additional Information
For additional information about custom settings or advanced configurations, go to [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md). This page provides information and links to additional guidance.

