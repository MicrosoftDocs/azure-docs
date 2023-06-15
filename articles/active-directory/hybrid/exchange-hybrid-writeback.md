---
title: 'Exchange hybrid writeback with sync'
description: This article describes the Exchange hybrid writeback feature with sync clients.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/15/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Exchange hybrid writeback 
A hybrid deployment offers organizations the ability to extend the feature-rich experience and administrative control they have with their existing on-premises Microsoft Exchange organization to the cloud. A hybrid deployment provides the seamless look and feel of a single Exchange organization between an on-premises Exchange organization and Exchange Online. 

To accomplish this scenario and allow your on-premises users to take full advantage of Exchange online, attributes from the cloud, must be written back to your on-premises users.  Both cloud sync or connect sync can write back the attributes.

 :::image type="content" source="cloud-sync/media/exchange-hybrid/exchange-hybrid.png" alt-text="Conceptual image of exchange hybrid scenario." lightbox="cloud-sync/media/exchange-hybrid/exchange-hybrid.png":::

## Cloud sync (Public Preview)
You can enable this scenario using cloud sync by ensuring you're using the latest provisioning agent and following the documentation.  For more information, see [Exchange hybrid writeback with cloud sync](cloud-sync/exchange-hybrid.md)

## Connect sync
You can enable the connect sync scenario through the installer.  By selecting custom install, you can choose Exchange hybrid writeback.  For more information, see [custom install for connect sync](connect/how-to-connect-install-custom.md)


## Next steps
- [Exchange hybrid writeback with cloud sync](cloud-sync/exchange-hybrid.md)
- [Common scenarios](common-scenarios.md)
- [Tools for synchronization](sync-tools.md)
- [Choosing the right sync tool](https://setup.microsoft.com/azure/add-or-sync-users-to-azure-ad)
- [Prerequisites](prerequisites.md)