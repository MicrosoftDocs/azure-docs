---
title: 'Azure AD Connect: Next steps and how to manage Azure AD Connect | Microsoft Docs'
description: Learn how to extend the default configuration and operational tasks for Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: curtand

ms.assetid: c18bee36-aebf-4281-b8fc-3fe14116f1a5
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.component: hybrid
ms.author: billmath

---
# Next steps and how to manage Azure AD Connect
Use the operational procedures in this article to customize Azure Active Directory (Azure AD) Connect to meet your organization's needs and requirements.  

## Add additional sync admins
By default, only the user who did the installation and local admins are able to manage the installed sync engine. For additional people to be able to access and manage the sync engine, locate the group named ADSyncAdmins on the local server and add them to this group.

## Assign licenses to Azure AD Premium and Enterprise Mobility Suite users
Now that your users have been synchronized to the cloud, you need to assign them a license so they can get going with cloud apps such as Office 365.

### To assign an Azure AD Premium or Enterprise Mobility Suite License

1. Sign in to the Azure portal as an admin.
2. On the left, select **Active Directory**.
3. On the **Active Directory** page, double-click the directory that has the users you want to set up.
4. At the top of the directory page, select **Licenses**.
5. On the **Licenses** page, select **Active Directory Premium** or **Enterprise Mobility Suite**, and then click **Assign**.
6. In the dialog box, select the users you want to assign licenses to, and then click the check mark icon to save the changes.

## Verify the scheduled synchronization task
Use the Azure portal to check the status of a synchronization.

### To verify the scheduled synchronization task
1. Sign in to the Azure portal as an admin.
2. On the left, select **Active Directory**.
3. On the **Active Directory** page, double-click the directory that has the users you want to set up.
4. At the top of the directory page, select **Directory Integration**.
5. Under **integration with local active directory**, note the last sync time.

<center>![Directory sync time](./media/how-to-connect-post-installation/verify.png)</center>

## Start a scheduled synchronization task
If you need to run a synchronization task, you can do this by running through the Azure AD Connect wizard again.  You need to provide your Azure AD credentials.  In the wizard, select the **Customize synchronization options** task, and click **Next** to move through the wizard. At the end, ensure that the **Start the synchronization process as soon as the initial configuration completes** box is selected.

<center>![Start synchronization](./media/how-to-connect-post-installation/startsynch.png)</center>

For more information on the Azure AD Connect sync Scheduler, see [Azure AD Connect Scheduler](how-to-connect-sync-feature-scheduler.md).

## Additional tasks available in Azure AD Connect
After your initial installation of Azure AD Connect, you can always start the wizard again from the Azure AD Connect start page or desktop shortcut.  You will notice that going through the wizard again provides some new options in the form of additional tasks.  

The following table provides a summary of these tasks and a brief description of each task.

![List of additional tasks](./media/how-to-connect-post-installation/addtasks.png)

| Additional task | Description |
| --- | --- |
| **View the selected scenario** |View your current Azure AD Connect solution.  This includes general settings, synchronized directories, and sync settings. |
| **Customize synchronization options** |Change the current configuration like adding additional Active Directory forests to the configuration, or enabling sync options such as user, group, device, or password write-back. |
| **Enable Staging Mode** |Stage information that is not immediately synchronized and is not exported to Azure AD or on-premises Active Directory.  With this feature, you can preview the synchronizations before they occur. |

## Next steps
Learn more about [integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
