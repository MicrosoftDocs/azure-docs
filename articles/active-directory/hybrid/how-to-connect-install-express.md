---
title: 'Azure AD Connect: Get started by using express settings'
description: Learn how to download, install, and run the setup wizard for Azure AD Connect.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Get started with Azure AD Connect by using express settings

Installing Azure AD Connect by using express settings is a good option when you have a single-forest topology and use [password hash sync](how-to-connect-password-hash-synchronization.md) for authentication. Express settings is the default option to install Azure AD Connect, and it's used for the most commonly deployed scenario. It's only a few short steps to extend your on-premises directory to the cloud.

Before you start installing Azure AD Connect, [download Azure AD Connect](https://go.microsoft.com/fwlink/?LinkId=615771) and be sure to complete the prerequisite steps in [Azure AD Connect: Hardware and prerequisites](how-to-connect-install-prerequisites.md).

If the express settings installation doesn't match your topology, see [Related articles](#related-articles) for information about other scenarios.

## Express installation of Azure AD Connect

1. Sign in as Local Administrator on the server you want to install Azure AD Connect on. The server you sign in on will be the sync server.
1. Go to *AzureADConnect.msi* and double-click to open the installation file.
1. In **Welcome**, select the checkbox to agree to the licensing terms, and then select **Continue**.  
1. In **Express settings**, select **Use express settings**.

   ![Welcome to Azure AD Connect](./media/how-to-connect-install-express/express.png)

1. In **Connect to Azure AD**, enter the user name and password of the Hybrid Identity Administrator account you created earlier, and then select **Next**.

   ![Connect to Azure AD](./media/how-to-connect-install-express/connectaad.png)  

   If an error message appears or you have problems with connectivity, see [Troubleshoot connectivity problems](tshoot-connect-connectivity.md).

1. In **Connect to AD DS**, enter the user name and password for an Enterprise Admin account. You can enter the domain part in either NetBios or FQDN format, like `FABRIKAM\administrator` or `fabrikam.com\administrator`. Select **Next**. 

   ![Connect to AD DS](./media/how-to-connect-install-express/connectad.png)

1. The [**Azure AD sign-in configuration**](plan-connect-user-signin.md#azure-ad-sign-in-configuration) page appears only if you didn't complete the step to [verify your domains](../fundamentals/add-custom-domain.md) in the [prerequisites](how-to-connect-install-prerequisites.md).

   ![Unverified domains](./media/how-to-connect-install-express/unverifieddomain.png)  

   If you see this page, review each domain that's marked **Not Added** and **Not Verified**. Make sure that those domains have been verified in Azure AD. When you've verified your domains, select the **Refresh** icon.
1. In **Ready to configure**, select **Install**.

   - Optionally in **Ready to configure**, you can clear the **Start the synchronization process as soon as configuration completes** checkbox. You should clear this checkbox if you want to do additional configuration, such as add [filtering](how-to-connect-sync-configure-filtering.md). If you clear this option, the wizard configures sync but leaves the scheduler disabled. The scheduler doesn't run until you enable it manually by [rerunning the installation wizard](how-to-connect-installation-wizard.md).
   - If you leave the **Start the synchronization process as soon as configuration completes** checkbox selected, a full sync to Azure AD of all users, groups, and contacts begins immediately.
   - If you have Exchange in your on-premises instance of Windows Server Active Directory, you also have an option to enable [Exchange Hybrid deployment](/exchange/exchange-hybrid). Enable this option if you plan to have Exchange mailboxes both in the cloud and on-premises at the same time.

     ![Ready to configure Azure AD Connect](./media/how-to-connect-install-express/readytoconfigure.png)
1. When the installation is finished, select **Exit**.
1. Before you use Synchronization Service Manager or Synchronization Rule Editor, sign out, and then sign in again.

## Related articles

For more information about Azure AD Connect, see these articles:

| Topic | Link |
| --- | --- |
| Azure AD Connect overview | [Integrate your on-premises directories with Azure Active Directory](whatis-hybrid-identity.md) |
| Install by using customized settings | [Custom installation of Azure AD Connect](how-to-connect-install-custom.md) |
| Upgrade from DirSync | [Upgrade from Azure AD sync tool (DirSync)](how-to-dirsync-upgrade-get-started.md)|
| Accounts used for installation | [More about Azure AD Connect credentials and permissions](reference-connect-accounts-permissions.md) |

## Next steps

- Now that you have Azure AD Connect installed, you can [verify the installation and assign licenses](how-to-connect-post-installation.md).
- Learn more about these features, which were enabled with the installation: [Automatic upgrade](how-to-connect-install-automatic-upgrade.md), [prevent accidental deletes](how-to-connect-sync-feature-prevent-accidental-deletes.md), and [Azure AD Connect Health](how-to-connect-health-sync.md).
- Learn more about the [scheduler and how to trigger sync](how-to-connect-sync-feature-scheduler.md).
- Learn more about [integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
