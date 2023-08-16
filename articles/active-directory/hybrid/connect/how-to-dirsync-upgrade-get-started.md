---
title: 'Azure AD Connect: Upgrade from DirSync'
description: Learn how to upgrade from DirSync to Azure AD Connect. This article describes the steps for upgrading from DirSync to Azure AD Connect.
services: active-directory
author: billmath
manager: amycolannino
editor: ''

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure AD Connect: Upgrade from DirSync

Azure AD Connect is the successor of DirSync. In this article, learn how to upgrade to Azure AD Connect from DirSync. The steps described in this article don't work for upgrading from a different version of Azure AD Connect or from Azure Active Directory (Azure AD) Sync.

DirSync and Azure AD Sync aren't supported and no longer work. If you're still using DirSync or Azure AD Sync, you *must* upgrade to Azure AD Connect to resume your sync process.

Before you start installing Azure AD Connect, make sure you [download Azure AD Connect](https://go.microsoft.com/fwlink/?LinkId=615771) and complete the prerequisite steps described in [Azure AD Connect: Hardware and prerequisites](how-to-connect-install-prerequisites.md). Pay special attention to the following requirements for Azure AD Connect because they're different from DirSync:

- **Required versions of .NET and PowerShell**: Newer versions that what are required for DirSync must be on the server for Azure AD Connect.
- **Proxy server configuration**: If you use a proxy server to reach the internet, this setting must be configured before you upgrade. DirSync always used the proxy server that was configured for the user who installed it, but Azure AD Connect uses machine settings instead.
- **URLs required to be open in the proxy server**: For basic scenarios that were also supported by DirSync, the requirements are the same. If you want to use any of the new features in Azure AD Connect, some new URLs must be opened.

> [!WARNING]
> After you have enabled your new Azure AD Connect server to start syncing changes to Azure AD, you must not roll back to using DirSync or Azure AD Sync. Downgrading from Azure AD Connect to legacy clients, including DirSync and Azure AD Sync, is not supported and can lead to issues like data loss in Azure AD.

If you aren't upgrading from DirSync, see related documentation for other scenarios.

## Upgrade from DirSync

Depending on your current DirSync deployment, you have different options for the upgrade. If the expected upgrade time is less than three hours, then we recommend that you do an in-place upgrade. If the expected upgrade time is more than three hours, then we recommend that you do a parallel deployment on a separate server. We estimate that if you have 50,000 or more objects, it takes more than three hours to do the upgrade.

The upgrade scenarios are summarized in the following table:

| Expected upgrade time | Number of objects | Upgrade option to use |
|----|----|----|
| Less than three hours | Fewer than 50,000 | [In-place upgrade](#in-place-upgrade) |
| More than three hours | 50,000 or more | [Parallel deployment](#parallel-deployment) |

> [!NOTE]
> When you plan to upgrade from DirSync to Azure AD Connect, do not uninstall DirSync yourself before the upgrade. Azure AD Connect will read and migrate the configuration from DirSync and uninstall it after it inspects the server.

- **In-place upgrade**. The wizard displays the expected time to complete the upgrade. This estimate is based on the assumption that it takes three hours to complete an upgrade for a database with 50,000 objects (users, contacts, and groups). If the number of objects in your database is fewer than 50,000, then Azure AD Connect recommends an in-place upgrade. If you decide to continue, your current settings are automatically applied during upgrade and your server automatically resumes active sync.

   If you want to do a configuration migration *and* do a parallel deployment, you can override the in-place upgrade recommendation. For example, you might use the upgrade as an opportunity to refresh the hardware and operating system. For more information, see [Parallel deployment](#parallel-deployment).
- **Parallel deployment**. If you have 50,000 or more objects, then we recommend a parallel deployment. This type of deployment avoids any operational delays for your users. The Azure AD Connect installation attempts to estimate the downtime for the upgrade, but if you've upgraded DirSync in the past, your own experience is likely to be the best guide for how long the upgrade will take.

### DirSync configurations supported for upgrade

The following configuration changes are supported for upgrading from DirSync:

- Domain and organization unit (OU) filtering
- Alternate ID (UPN)
- Password sync and Exchange hybrid settings
- Your forest, domain, and Azure AD settings
- Filtering based on user attributes

The following change can't be upgraded. If you have this configuration, the upgrade is blocked:

- Unsupported DirSync changes, for example, removed attributes and using a custom extension DLL

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/analysisblocked.png" alt-text="Screenshot that shows that the upgrade is blocked because of DirSync configurations.":::

   In unsupported upgrade scenarios, we recommend that you install a new Azure AD Connect server in [staging mode](how-to-connect-sync-staging-server.md) and verify the old DirSync and new Azure AD Connect configurations. Reapply any changes by using custom configuration as described in [Azure AD Connect Sync custom configuration](how-to-connect-sync-whatis.md).

The passwords that DirSync uses for the service accounts can't be retrieved and they aren't migrated. These passwords are reset during the upgrade.

### High-level steps for upgrading from DirSync to Azure AD Connect

1. Welcome to Azure AD Connect
1. Analysis of current DirSync configuration
1. Collect the Azure AD Hybrid Identity Administrator account password
1. Collect credentials for an Enterprise Admins account (used only during installation of Azure AD Connect)
1. Installation of Azure AD Connect:
   1. Uninstall DirSync (or temporarily disable it)
   1. Install Azure AD Connect
   1. Optionally begin sync

More steps are required when:

- You're currently using the full version of SQL Server, whether local or remote.
- You have 50,000 or more objects in scope for synchronization.

## In-place upgrade

To do an in-place upgrade:

1. Open the Azure AD Connect installer (an MSI file).
1. Review and agree to the license terms and privacy notice.

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/welcome.png" alt-text="Screenshot that shows the Welcome to Azure AD Connect page.":::

1. Select **Next** to begin analysis of your existing DirSync installation.

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/analyze.png" alt-text="Screenshot that shows Azure AD Connect when it's analyzing an existing DirSync installation.":::

1. When the analysis is finished, recommendations for how to proceed are shown.

   - If you use SQL Server Express and have fewer than 50,000 objects, this page is shown:

     :::image type="content" source="media/how-to-dirsync-upgrade-get-started/analysisready.png" alt-text="Screenshot that shows the analysis completed and you're ready to upgrade from DirSync.":::

   - If you use a full version of SQL Server for DirSync, this page is shown:

     :::image type="content" source="media/how-to-dirsync-upgrade-get-started/analysisreadyfullsql.png" alt-text="Screenshot that shows the existing SQL database server that's being used.":::

     Information about the existing SQL Server database server being the one that DirSync is using is shown. Make adjustments if needed. Select **Next** to continue the installation.

   - If you have 50,000 or more objects, this page is shown:

     :::image type="content" source="media/how-to-dirsync-upgrade-get-started/analysisrecommendparallel.png" alt-text="Screenshot that shows the page you see when you have 50,000 or more objects to upgrade.":::

     To proceed with an in-place upgrade, select the **Continue upgrading DirSync on this computer** checkbox.

     To do a [parallel deployment](#parallel-deployment), export the DirSync configuration settings and move the configuration to the new server.

1. Enter the password for the account you currently use to connect to Azure AD. This must be the account that DirSync uses.

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/connecttoazuread.png" alt-text="Screenshot that shows where you enter your Azure AD credentials.":::

   If an error message appears or if you have problems with connectivity, see [Troubleshoot connectivity problems](tshoot-connect-connectivity.md).

1. Enter an Enterprise Admins account for Active Directory Domain Services (AD DS).

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/connecttoadds.png" alt-text="Screenshot that shows where you enter your AD DS credentials.":::

1. You're now ready to configure. When you select **Upgrade**, DirSync is uninstalled and Azure AD Connect is configured and begins syncing.

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/readytoconfigure.png" alt-text="Screenshot that shows the Ready to configure page.":::

1. When installation is finished, sign out of Windows and then sign in again before you use Synchronization Service Manager or Synchronization Rule Editor, or before you try to make any other configuration changes.

## Parallel deployment

To use parallel deployment to upgrade, complete the following tasks.

### Export the DirSync configuration

**Parallel deployment with 50,000 or more objects**

If you have 50,000 or more objects, the Azure AD Connect installation wizard recommends a parallel deployment.

A page similar to the following example appears:

:::image type="content" source="media/how-to-dirsync-upgrade-get-started/analysisrecommendparallel.png" alt-text="Screenshot that shows that the analysis is complete and the Export settings button.":::

If you want to proceed with parallel deployment, complete the following steps:

- Select **Export settings**. When you install Azure AD Connect on a separate server, these settings are migrated from your current DirSync instance to your new Azure AD Connect installation.

After your settings are successfully exported, you can exit the Azure AD Connect wizard on the DirSync server. Continue with the next step to install Azure AD Connect on a separate server.

**Parallel deployment with fewer than 50,000 objects**

If you have fewer than 50,000 objects, but you still want to do a parallel deployment:

1. Run the Azure AD Connect installer.

1. In **Welcome to Azure AD Connect**, exit the installation wizard by selecting the "X" in the top-right corner of the window.

1. Open a Command Prompt window.

1. In the installation location of Azure AD Connect (the default is *C:\Program Files\Microsoft Azure Active Directory Connect*), run the following command:

   `AzureADConnect.exe /ForceExport`

1. Select **Export settings**. When you install Azure AD Connect on a separate server, these settings are migrated from your current DirSync instance to your new Azure AD Connect installation.

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/forceexport.png" alt-text="Screenshot that shows the Export settings option for migrating your settings to the new Azure AD Connect installation.":::

After your settings are successfully exported, you can exit the Azure AD Connect wizard on the DirSync server. Continue with the next step to install Azure AD Connect on a separate server.

### Install Azure AD Connect on a separate server

When you install Azure AD Connect on a new server, the assumption is that you want to perform a clean install of Azure AD Connect. To use the DirSync configuration, there are some extra steps to take:

1. Run the Azure AD Connect installer.

1. In **Welcome to Azure AD Connect**, exit the installation wizard by selecting the "X" in the top-right corner of the window.

1. Open a Command Prompt window.

1. In the installation location of Azure AD Connect (the default is *C:\Program Files\Microsoft Azure Active Directory Connect*), run the following command:

   `AzureADConnect.exe /migrate`

   The Azure AD Connect installation wizard starts and the following page appears:

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/importsettings.png" alt-text="Screenshot that shows where to import the settings file when you upgrade.":::

1. Select the settings file that you exported from your DirSync installation.

1. Configure any advanced options, including:

   - A custom installation location for Azure AD Connect.
   - An existing instance of SQL Server (by default, Azure AD Connect installs SQL Server 2019 Express). Don't use the same database instance your DirSync server uses.
   - A service account that's used to connect to SQL Server. (If your SQL Server database is remote, this account must be a domain service account.)
  
   The following figure shows other options that are on this page:

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/advancedsettings.png" alt-text="Screenshot that shows the advance configuration options for upgrading from DirSync.":::

1. Select **Next**.

1. In **Ready to configure**, leave the **Start the synchronization process as soon as the configuration completes** option selected. The server is now in [staging mode](how-to-connect-sync-staging-server.md), so changes aren't exported to Azure AD.

1. Select **Install**.

1. When installation is finished, sign out of Windows and then sign in again before you use Synchronization Service Manager or Synchronization Rule Editor, or before try to make any other configuration changes.

> [!NOTE]
> At this point, sync between on-premises Windows Server Active Directory (Windows Server AD) and Azure AD begins, but no changes are exported to Azure AD. Only one sync tool at a time can actively export changes. This state is called [staging mode](how-to-connect-sync-staging-server.md).

### Verify that Azure AD Connect is ready to begin sync

To verify that Azure AD Connect is ready to take over from DirSync, on the Start menu, select **Azure AD Connect** > **Synchronization Service Manager**.

In the application, go to the **Operations** tab. On this tab, confirm that the following operations show successful completion:

- **Full Import** on the Windows Server AD connector
- **Full Import** on the Azure AD connector
- **Full Synchronization** on the Windows Server AD connector
- **Full Synchronization** on the Azure AD connector

:::image type="content" source="media/how-to-dirsync-upgrade-get-started/importsynccompleted.png" alt-text="Screenshot that shows import and sync completed in Connector Operations.":::

Review the results from these operations, and ensure that there are no errors.

If you want to see and inspect the changes that are about to be exported to Azure AD, review how to [verify the configuration in staging mode](how-to-connect-sync-staging-server.md). Make required configuration changes until you don't see anything unexpected.

You're ready to switch from DirSync to Azure AD when you've completed these steps and are confident with the results.

### Uninstall DirSync (old server)

Next, uninstall DirSync:

1. In **Programs and features**, find and select **Windows Azure Active Directory sync tool**.
1. In the command bar, select **Uninstall**.

Uninstalling might take up to 15 minutes to complete.

If you prefer to uninstall DirSync later, you can temporarily shut down the server or disable the service. Using this method allows you to re-enable the service if something goes wrong.

With DirSync uninstalled or disabled, you don't have an active server exporting to Azure AD. The next step to enable Azure AD Connect must be completed before any changes in your on-premises instance of Windows Server AD will continue to be synced to Azure AD.

### Enable Azure AD Connect (new server)

After installation, reopen Azure AD connect to make more configuration changes. Open Azure AD Connect from the Start menu or from the shortcut on the desktop. *Make sure that you don't run the installation MSI file again*.

1. In **Additional tasks**, select **Configure staging mode**.
1. In **Configure staging mode**, turn off staging by clearing the **Enabled staging mode** checkbox.

   :::image type="content" source="media/how-to-dirsync-upgrade-get-started/configurestaging.png" alt-text="Screenshot that shows the option to enable staging mode.":::

1. Select **Next**.
1. On the confirmation page, select **Install**.

Azure AD Connect is now your active server. Ensure that you don't switch back to using your existing DirSync server.

## Next steps

- Now that you have Azure AD Connect installed, you can [verify the installation and assign licenses](how-to-connect-post-installation.md).
- Learn more about these Azure AD Connect features: [Automatic upgrade](how-to-connect-install-automatic-upgrade.md), [prevent accidental deletes](how-to-connect-sync-feature-prevent-accidental-deletes.md), and [Azure AD Connect Health](how-to-connect-health-sync.md).
- Learn about the [scheduler and how to trigger sync](how-to-connect-sync-feature-scheduler.md).
- Learn more about [integrating your on-premises identities with Azure Active Directory](../whatis-hybrid-identity.md).