---
title: 'Microsoft Entra Connect: Get started by using express settings'
description: Learn how to download, install, and run the setup wizard for Microsoft Entra Connect.
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
# Get started with Microsoft Entra Connect by using express settings

If you have a single-forest topology and use [password hash sync](how-to-connect-password-hash-synchronization.md) for authentication, express settings is a good option to use when you install Microsoft Entra Connect. Express settings is the default option to install Microsoft Entra Connect, and it's used for the most commonly deployed scenario. It's only a few short steps to extend your on-premises directory to the cloud.

Before you start installing Microsoft Entra Connect, [download Microsoft Entra Connect](https://go.microsoft.com/fwlink/?LinkId=615771), and be sure to complete the prerequisite steps in [Microsoft Entra Connect: Hardware and prerequisites](how-to-connect-install-prerequisites.md).

If the express settings installation doesn't match your topology, see [Related articles](#related-articles) for information about other scenarios.

<a name='express-installation-of-azure-ad-connect'></a>

## Express installation of Microsoft Entra Connect

1. Sign in as Local Administrator on the server you want to install Microsoft Entra Connect on.

   The server you sign in on will be the sync server.
1. Go to *AzureADConnect.msi* and double-click to open the installation file.
1. In **Welcome**, select the checkbox to agree to the licensing terms, and then select **Continue**.
1. In **Express settings**, select **Use express settings**.

   :::image type="content" source="media/how-to-connect-install-express/express.png" alt-text="Screenshot that shows the welcome page in the Microsoft Entra Connect installation wizard.":::

1. In **Connect to Microsoft Entra ID**, enter the username and password of the Hybrid Identity Administrator account, and then select **Next**.

   :::image type="content" source="media/how-to-connect-install-express/connectaad.png" alt-text="Screenshot that shows the Connect to Microsoft Entra ID page in the installation wizard.":::

   If an error message appears or if you have problems with connectivity, see [Troubleshoot connectivity problems](tshoot-connect-connectivity.md).

1. In **Connect to AD DS**, enter the username and password for an Enterprise Admin account. You can enter the domain part in either NetBIOS or FQDN format, like `FABRIKAM\administrator` or `fabrikam.com\administrator`. Select **Next**.

   :::image type="content" source="media/how-to-connect-install-express/connectad.png" alt-text="Screenshot that shows the Connect to AD DS page in the installation wizard.":::

1. The [Microsoft Entra sign-in configuration](plan-connect-user-signin.md#azure-ad-sign-in-configuration) page appears only if you didn't complete the step to [verify your domains](../../fundamentals/add-custom-domain.md) in the [prerequisites](how-to-connect-install-prerequisites.md).

   :::image type="content" source="media/how-to-connect-install-express/unverifieddomain.png" alt-text="Screenshot that shows examples of unverified domains in the installation wizard.":::

   If you see this page, review each domain that's marked **Not Added** or **Not Verified**. Make sure that those domains have been verified in Microsoft Entra ID. When you've verified your domains, select the **Refresh** icon.
1. In **Ready to configure**, select **Install**.

   - Optionally in **Ready to configure**, you can clear the **Start the synchronization process as soon as configuration completes** checkbox. You should clear this checkbox if you want to do more configuration, such as to add [filtering](how-to-connect-sync-configure-filtering.md). If you clear this option, the wizard configures sync but leaves the scheduler disabled. The scheduler doesn't run until you enable it manually by [rerunning the installation wizard](how-to-connect-installation-wizard.md).
   - If you leave the **Start the synchronization process when configuration completes** checkbox selected, a full sync of all users, groups, and contacts to Microsoft Entra ID begins immediately.
   - If you have Exchange in your instance of Windows Server Active Directory, you also have the option to enable [Exchange Hybrid deployment](/exchange/exchange-hybrid). Enable this option if you plan to have Exchange mailboxes both in the cloud and on-premises at the same time.

      :::image type="content" source="media/how-to-connect-install-express/readytoconfigure.png" alt-text="Screenshot that shows the Ready to configure Microsoft Entra Connect page in the wizard.":::
  
1. When the installation is finished, select **Exit**.
1. Before you use Synchronization Service Manager or Synchronization Rule Editor, sign out, and then sign in again.

## Related articles

For more information about Microsoft Entra Connect, see these articles:

| Topic | Link |
| --- | --- |
| Microsoft Entra Connect overview | [Integrate your on-premises directories with Microsoft Entra ID](../whatis-hybrid-identity.md) |
| Install by using customized settings | [Custom installation of Microsoft Entra Connect](how-to-connect-install-custom.md) |
| Upgrade from DirSync | [Upgrade from Azure AD Sync tool (DirSync)](how-to-dirsync-upgrade-get-started.md)|
| Accounts used for installation | [More about Microsoft Entra Connect credentials and permissions](reference-connect-accounts-permissions.md) |

## Next steps

- Now that you have Microsoft Entra Connect installed, you can [verify the installation and assign licenses](how-to-connect-post-installation.md).
- Learn more about these features, which were enabled with the installation: [Automatic upgrade](how-to-connect-install-automatic-upgrade.md), [prevent accidental deletes](how-to-connect-sync-feature-prevent-accidental-deletes.md), and [Microsoft Entra Connect Health](how-to-connect-health-sync.md).
- Learn more about the [scheduler and how to trigger sync](how-to-connect-sync-feature-scheduler.md).
- Learn more about [integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
