<properties
	pageTitle="Azure AD Connect sync: Synchronization Service Manager UI | Microsoft Azure"
	description="Describes the Synchronization Service Manager UI."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/01/2016"
	ms.author="andkjell"/>


# Azure AD Connect sync: Synchronization Service Manager, Connectors
> [AZURE.SELECTOR]
- [Operations](active-directory-aadconnectsync-service-manager-ui-operations.md)
- [Connectors](active-directory-aadconnectsync-service-manager-ui-connectors.md)
- [Metaverse Designer](active-directory-aadconnectsync-service-manager-ui-mvdesigner.md)
- [Metaverse Search](active-directory-aadconnectsync-service-manager-ui-mvsearch.md)

The Connectors tab is used to manage all systems the sync engine is connected to.

![Sync Service Manager](./media/active-directory-aadconnectsync-service-manager-ui/connectors.png)

## Connector actions

| Action | Comment |
| --- | --- |
| Create | Do not use. For connecting to additional AD forests, use the installation wizard. |
| Properties | Used for domain and OU filtering. |
| Delete | Used to either delete the data in the connector space or to delete connection to a forest. |
| Configure Run Profiles | With the exception of domain filtering, nothing to configure here. |
| Run | Used to start a one-off run of a profile. |
| Stop | Stops a Connector currently running a profile. |
| Export Connector | Do not use. |
| Import Connector | Do not use. |
| Update Connector | Do not use. |
| Refresh Schema | Refreshes the cached schema. It is preferred to use the option in the installation wizard instead since that will also update sync rules.
| Search Connector Space | Used to find objects and to [Follow an object and its data through the system](#follow-an-object-and-its-data-through-the-system). |


## Follow an object and its data through the system
When you are troubleshooting a problem with data

### Connector Space Object Properties
When you open a cs object, there are several tabs at the top. The **Import** tab shows the data which is staged after an import.
![Sync Service Manager](./media/active-directory-aadconnectsync-service-manager-ui/csimport.png)
The **Old Value** shows what currently is stored in the system and the **New Value**

## Next steps
Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
