---
title: 'Microsoft Entra Connect: Sync service instances'
description: This page documents special considerations for Microsoft Entra instances.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: f340ea11-8ff5-4ae6-b09d-e939c76355a3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect: Special considerations for instances
Microsoft Entra Connect is most commonly used with the world-wide instance of Microsoft Entra ID and Microsoft 365. But there are also other instances and these have different requirements for URLs and other special considerations.

## Microsoft Cloud Germany
The [Microsoft Cloud Germany](https://www.microsoft.com/de-de/microsoft-cloud) is a sovereign cloud operated by a German data trustee.

| URLs to open in proxy server |
| --- |
| \*.microsoftonline.de |
| \*.windows.net |
| +Certificate Revocation Lists |

When you sign in to your Microsoft Entra tenant, you must use an account in the onmicrosoft.de domain.

Features currently not present in the Microsoft Cloud Germany:

* **Password writeback** is available for preview with Microsoft Entra Connect version 1.1.570.0 and after.
* Other Microsoft Entra ID P1 or P2 services are not available.

## Microsoft Azure Government
The [Microsoft Azure Government cloud](https://azure.microsoft.com/features/gov/) is a cloud for US government.

This cloud has been supported by earlier releases of DirSync. From build 1.1.180 of Microsoft Entra Connect, the next generation of the cloud is supported. This generation is using US-only based endpoints and has a different list of URLs to open in your proxy server.

| URLs to open in proxy server |
| --- |
| \*.microsoftonline.com |
| \*.microsoftonline.us |
| \*.windows.net (Required for automatic Azure Government tenant detection) |
| \*.gov.us.microsoftonline.com |
| +Certificate Revocation Lists |

> [!NOTE]
> As of Microsoft Entra Connect version 1.1.647.0, setting the AzureInstance value in the registry is no longer required provided that *.windows.net is open on your proxy server(s). However, for customers that do not allow Internet connectivity from their Microsoft Entra Connect server(s), the following manual configuration can be used.

### Manual Configuration

The following manual configuration steps are used to ensure Microsoft Entra Connect uses Azure Government synchronization endpoints.

1. Start the Microsoft Entra Connect installation.
2. When you see the first page where you are supposed to accept the EULA, do not continue but leave the installation wizard running.
3. Start regedit and change the registry key `HKLM\SOFTWARE\Microsoft\Azure AD Connect\AzureInstance` to the value `4`.
4. Go back to the Microsoft Entra Connect installation wizard, accept the EULA, and continue. During installation, make sure to use the **custom configuration** installation path (and not Express installation), then continue the installation as usual.

## Next steps
Learn more about [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
