---
title: 'Azure AD Connect: Upgrade from a previous version | Microsoft Docs'
description: Explains the different methods to upgrade to the latest release of Azure Active Directory Connect, including in-place upgrade and swing migration.
services: active-directory
documentationcenter: ''
author: AndKjell
manager: femila
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Identity
ms.date: 11/01/2016
ms.author: billmath

---
# Azure AD Connect: Upgrade from a previous version to the latest
This topic describes the different methods you can use to upgrade your Azure AD Connect installation to the latest release. We recommend that you keep yourself current with the releases of Azure AD Connect. The steps described in [swing migration](#swing-migration) are also used when you make a substantial configuration change.

If you want to upgrade from DirSync, see [Upgrade from Azure AD sync tool (DirSync)](connect/active-directory-aadconnect-dirsync-upgrade-get-started.md) instead.

There are a few different strategies to upgrade Azure AD Connect.

| Method | Description |
| --- | --- |
| [Automatic upgrade](active-directory-aadconnect-feature-automatic-upgrade.md) |For customers with an express installation, this is the easiest method. |
| [In-place upgrade](#in-place-upgrade) |If you have a single server, upgrade the installation in-place on the same server. |
| [Swing migration](#swing-migration) |With two servers, you can prepare one of the servers with the new release or configuration and change active server when you are ready. |

For required permissions, see [permissions required for upgrade](connect/active-directory-aadconnect-accounts-permissions.md#upgrade).

## In-place upgrade
An in-place upgrade works for moving from Azure AD Sync or Azure AD Connect. It will not work for DirSync or for a solution with FIM + Azure AD Connector.

This method is preferred when you have a single server and less than about 100,000 objects. If there are any changes to the out-of-box sync rules, a full import and full synchronization occur after the upgrade. This ensures that the new configuration is applied to all existing objects in the system. This might take a few hours depending on the number of objects in scope of the sync engine. The normal delta synchronization scheduler, by default every 30 minutes, is suspended but password synchronization continues. You might consider to do the in-place upgrade during a weekend. If there are no changes to the out-of-box configuration with the new Azure AD Connect release, then a normal delta import/sync will start instead.  
![In-Place Upgrade](./media/active-directory-aadconnect-upgrade-previous-version/inplaceupgrade.png)

If you have made changes to out-of-box synchronization rules, these will be set back to default configuration on upgrade. To make sure your configuration is kept between upgrades, make sure the changes are made as described in [Best practices for changing the default configuration](active-directory-aadconnectsync-best-practices-changing-default-configuration.md).

## Swing migration
If you have a complex deployment or very many objects, it might be impractical to do an in-place upgrade on the live system. This could for some customers take multiple days and during this time no delta changes will be processed. This method is also used when you plan to make substantial changes to your configuration and you want to try them out before these are pushed to the cloud.

The recommended method for these scenarios is to use a swing migration. You need (at least) two servers, one active and one staging server. The active server (solid blue lines in the picture below) is responsible for the active production load. The staging server (dashed purple lines in the picture below) is prepared with the new release or configuration and when fully ready, this server is made active. The previous active server, now with the old version or configuration installed, is made the staging server and upgraded.

The two servers can use different versions. For example, the active server you plan to decommission can use Azure AD Sync and the new staging server can use Azure AD Connect. If you use swing migration to develop a new configuration it is a good idea to have the same versions on the two servers.  
![Staging server](./media/active-directory-aadconnect-upgrade-previous-version/stagingserver1.png)

Note: It has been noted that some customers prefer to have three or four servers for this scenario. When the staging server is upgraded, you do not have a backup server in case of a [disaster recovery](active-directory-aadconnectsync-operations.md#disaster-recovery). With three or four servers, one set of primary/standby servers with the new version can be prepared, ensuring there are always a staging server ready to take over.

These steps also works to move from Azure AD Sync or a solution with FIM + Azure AD Connector. These steps do not work for DirSync, but the same swing migration (also called parallel deployment) method with steps for DirSync can be found in [Upgrade Azure Active Directory sync (DirSync)](connect/active-directory-aadconnect-dirsync-upgrade-get-started.md).

### Swing migration steps
1. If you use Azure AD Connect on both servers and plan to only do a configuration change, make sure your active server and staging server are both using the same version. That makes it easier to compare differences later. If you are upgrading from Azure AD Sync, then these servers have different versions. If you are upgrading from an older Azure AD Connect version, it is a good idea to start with the two servers using the same version, but it is not required.
2. If you have made some custom configuration and your staging server does not have it, follow the steps under [Move custom configuration from active to staging server](#move-custom-configuration-from-active-to-staging-server).
3. If you are upgrading from an earlier release of Azure AD Connect, upgrade the staging server to the latest version. If you are moving from Azure AD Sync, then install Azure AD Connect on your staging server.
4. Let the sync engine run full import and full synchronization on your staging server.
5. Verify that the new configuration did not cause any unexpected changes using the steps under **Verify** in [Verify the configuration of a server](active-directory-aadconnectsync-operations.md#verify-the-configuration-of-a-server). If something is not as expected, correct, run import and sync, and verify until the data looks good. These steps can be found in the linked topic.
6. Switch the staging server to be the active server. This is the final step **switch active server** in [Verify the configuration of a server](active-directory-aadconnectsync-operations.md#verify-the-configuration-of-a-server).
7. If you are upgrading Azure AD Connect, upgrade the server now in staging mode to the latest release. Follow the same steps as before to get the data and configuration upgraded. If you upgraded from Azure AD Sync, you can now turn off and decommission your old server.

### Move custom configuration from active to staging server
If you have made configuration changes to the active server, you need to make sure the same changes are applied to the staging server.

The custom sync rules you have created can be moved with PowerShell. Other changes must be applied the same way on both systems and cannot be migrated.

Thing you must make sure is configured the same way on both servers:

* Connection to the same forests.
* Any Domain and OU filtering.
* The same optional features, such as password sync and password writeback.

**Move synchronization rules**  
To move a custom synchronization rule, do the following:

1. Open **Synchronization Rules Editor** on your active server.
2. Select your custom rule. Click **Export**. This brings up a notepad window. Save the temporary file with a PS1 extension. This makes it a PowerShell script. Copy the ps1 file to the staging server.  
   ![Sync Rule Export](./media/active-directory-aadconnect-upgrade-previous-version/exportrule.png)
3. The Connector GUID is different on the staging server and must be changed. To get the GUID, start **Synchronization Rules Editor**, select one of the out-of-box rules representing the same connected system, and click **Export**. Replace the GUID in your PS1 file with the GUID from the staging server.
4. In a PowerShell prompt, run the PS1 file. This will create the custom synchronization rule on the staging server.
5. If you have multiple custom rules, repeat for all custom rules.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).

