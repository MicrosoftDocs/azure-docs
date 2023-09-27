---
title: 'Microsoft Entra Connect: Features in preview'
description: This topic describes in more detail features which are in preview in Microsoft Entra Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: c75cd8cf-3eff-4619-bbca-66276757cc07
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/27/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# More details about features in preview
This topic describes how to use features currently in preview.

<a name='azure-ad-connect-sync-v2-endpoint-api'></a>

## Microsoft Entra Connect Sync V2 endpoint API

We've deployed a new endpoint (API) for Microsoft Entra Connect that improves the performance of the synchronization service operations to Microsoft Entra ID. By utilizing the new V2 endpoint, you'll experience noticeable performance gains on export and import to Microsoft Entra ID. This new endpoint also supports syncing groups with up to 250k members. Using this endpoint also allows you to write back Microsoft 365 unified groups, with no maximum membership limit, to your on-premises Active Directory, when group writeback is enabled. For more information see [Microsoft Entra Connect Sync V2 endpoint API](how-to-connect-sync-endpoint-api-v2.md).

## User writeback
> [!IMPORTANT]
> The user writeback preview feature was removed in the August 2015 update to Microsoft Entra Connect. If you have enabled it, then you should disable this feature.
>
>

## Next steps
Continue your [Custom installation of Microsoft Entra Connect](how-to-connect-install-custom.md).

Learn more about [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
