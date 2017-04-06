---
title: Connectors in the Azure AD Synchronization Service Manager UI | Microsoft Docs'
description: Understand the Connectors tab in the Synchronization Service Manager for Azure AD Connect.
services: active-directory
documentationcenter: ''
author: andkjell
manager: femila
editor: ''

ms.assetid: 60f1d979-8e6d-4460-aaab-747fffedfc1e
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/02/2017
ms.author: billmath
ms.custom: H1Hack27Feb2017
---
# Using connectors with the Azure AD Connect Sync Service Manager

![Sync Service Manager](./media/active-directory-aadconnectsync-service-manager-ui/connectors.png)

The Connectors tab is used to manage all systems the sync engine is connected to.

## Connector actions
| Action | Comment |
| --- | --- |
| Create |Do not use. For connecting to additional AD forests, use the installation wizard. |
| Properties |Used for domain and OU filtering. |
| [Delete](#delete) |Used to either delete the data in the connector space or to delete connection to a forest. |
| [Configure Run Profiles](#configure-run-profiles) |Except for domain filtering, nothing to configure here. You can use this action to see already configured run profiles. |
| Run |Used to start a one-off run of a profile. |
| Stop |Stops a Connector currently running a profile. |
| Export Connector |Do not use. |
| Import Connector |Do not use. |
| Update Connector |Do not use. |
| Refresh Schema |Refreshes the cached schema. It is preferred to use the option in the installation wizard instead, since that also updates sync rules. |
| [Search Connector Space](#search-connector-space) |Used to find objects and to [Follow an object and its data through the system](#follow-an-object-and-its-data-through-the-system). |

### Delete
The delete action is used for two different things.  
![Sync Service Manager](./media/active-directory-aadconnectsync-service-manager-ui/connectordelete.png)

The option **Delete connector space only** removes all data, but keep the configuration.

The option **Delete Connector and connector space** removes the data and the configuration. This option is used when you do not want to connect to a forest anymore.

Both options sync all objects and update the metaverse objects. This action is a long running operation.

### Configure Run Profiles
This option allows you to see the run profiles configured for a Connector.

![Sync Service Manager](./media/active-directory-aadconnectsync-service-manager-ui/configurerunprofiles.png)

### Search Connector Space
The search connector space action is useful to find objects and troubleshoot data issues.

![Sync Service Manager](./media/active-directory-aadconnectsync-service-manager-ui/cssearch.png)

Start by selecting a **scope**. You can search based on data (RDN, DN, Anchor, Sub-Tree), or state of the object (all other options).  
![Sync Service Manager](./media/active-directory-aadconnectsync-service-manager-ui/cssearchscope.png)  
If you for example do a Sub-Tree search, you get all objects in one OU.  
![Sync Service Manager](./media/active-directory-aadconnectsync-service-manager-ui/cssearchsubtree.png)  
From this grid you can select an object, select **properties**, and [follow it](active-directory-aadconnectsync-troubleshoot-object-not-syncing.md) from the source connector space, through the metaverse, and to the target connector space.

## Next steps
Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
