---
title: 'Azure AD Connect: Features in preview | Microsoft Docs'
description: This topic describes in more detail features which are in preview in Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''

ms.assetid: c75cd8cf-3eff-4619-bbca-66276757cc07
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/15/2020
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# More details about features in preview
This topic describes how to use features currently in preview.

## Azure AD Connect sync V2 endpoint API (public preview) 

We have deployed a new endpoint (API) for Azure AD Connect that improves the performance of the synchronization service operations to Azure Active Directory. By utilizing the new V2 endpoint, you will experience noticeable performance gains on export and import to Azure AD. This new endpoint also supports syncing groups with up to 250k members. Using this endpoint also allows you to write back O365 unified groups, with no maximum membership limit, to your on-premises Active Directory, when group writeback is enabled.   For more information see [Azure AD Connect sync V2 endpoint API (public preview)](how-to-connect-sync-endpoint-api-v2.md).

## User writeback
> [!IMPORTANT]
> The user writeback preview feature was removed in the August 2015 update to Azure AD Connect. If you have enabled it, then you should disable this feature.
>
>

## Next steps
Continue your [Custom installation of Azure AD Connect](how-to-connect-install-custom.md).

Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
