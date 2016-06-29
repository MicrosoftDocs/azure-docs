<properties
	pageTitle="Azure AD Connect: Getting Started using express settings | Microsoft Azure"
	description="Learn how to download, install and run the setup wizard for Azure AD Connect."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="06/27/2016"
	ms.author="billmath;andkjell"/>

# Getting started with Azure AD Connect using express settings
Azure AD Connect **Express Settings** is used when you have a single-forest topology and [password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) for authentication. **Express Settings** is the default option and is used for the most commonly deployed scenario. You are only a few short clicks away to extend your on-premises directory to the cloud.

Before you start installing Azure AD Connect, make sure to [download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkId=615771) and complete the pre-requisite steps in [Azure AD Connect: Hardware and prerequisites](active-directory-aadconnect-prerequisites.md).

If express settings does not match your topology, see [related documentation](#related-documentation) for other scenarios.

## Express installation of Azure AD Connect
You can see these steps in action in the [videos](#videos) section.

1. Sign in as a local administrator to the server you wish to install Azure AD Connect on. You should do this on the server you wish to be the sync server.
2. Navigate to and double-click on **AzureADConnect.msi**.
3. On the Welcome screen, select the box agreeing to the licensing terms and click **Continue**.  
4. On the Express settings screen, click **Use express settings**.  
![Welcome to Azure AD Connect](./media/active-directory-aadconnect-get-started-express/express.png)
5. On the Connect to Azure AD screen, enter the username and password of a global administrator for your Azure AD. Click **Next**.  
![Connect to Azure AD](./media/active-directory-aadconnect-get-started-express/connectaad.png)
If you receive an error and have problems with connectivity, please see [Troubleshoot connectivity problems](active-directory-aadconnect-troubleshoot-connectivity.md).
6. On the Connect to AD DS screen, enter the username and password for an enterprise admin account. You can enter the domain part in either NetBios or FQDN format, i.e. FABRIKAM\administrator or fabrikam.com\administrator. Click **Next**.  
![Connect to AD DS](./media/active-directory-aadconnect-get-started-express/connectad.png)
7. The [**Azure AD sign-in configuration**](active-directory-aadconnect-user-signin.md#azure-ad-sign-in-configuration) page will only show if you did not complete [verify your domains](active-directory-add-domain.md) in the [prerequisites](active-directory-aadconnect-prerequisites.md).
![Unverified domains](./media/active-directory-aadconnect-get-started-express/unverifieddomain.png)  
If you see this page, then review every domain marked **Not Added** and **Not Verified**. Make sure those you use have been verified in Azure AD. Click on the Refresh symbol when you have verified your domains.
8. On the Ready to configure screen, click **Install**.
	- Optionally on the Ready to configure page, you can unselect the **Start the synchronization process as soon as configuration completes** checkbox. You should unselect this checkbox if you want to do additional configuration, such as [filtering](active-directory-aadconnectsync-configure-filtering.md). If you unselect this option, the wizard configures sync but leaves the scheduler disabled. It will not run until you enable it manually by [re-running the installation wizard](active-directory-aadconnectsync-installation-wizard.md).
	- If you have Exchange in your on-premises Active Directory, then you also have an option to enable [**Exchange Hybrid deployment**](https://technet.microsoft.com/library/jj200581.aspx). Enable this option if you plan to have Exchange mailboxes both in the cloud and on-premises at the same time.
![Ready to configure Azure AD Connect](./media/active-directory-aadconnect-get-started-express/readytoconfigure.png)
9. When the installation completes, click **Exit**.
10. After the installation has completed, sign off and sign in again before you use Synchronization Service Manager or Synchronization Rule Editor.

## Videos

For a video on using the express installation, see:

>[AZURE.VIDEO azure-active-directory-connect-express-settings]

## Next steps
Now that you have Azure AD Connect installed you can [verify the installation and assign licenses](active-directory-aadconnect-whats-next.md).

Learn more about these features, which were enabled with the installation: [Automatic upgrade](active-directory-aadconnect-feature-automatic-upgrade.md), [Prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md), and [Azure AD Connect Health](active-directory-aadconnect-health-sync.md).

Learn more about these common topics: [scheduler and how to trigger sync](active-directory-aadconnectsync-feature-scheduler.md).

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).

## Related documentation

Topic |  
--------- | ---------
Azure AD Connect overview | [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
Install using customized settings | [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md)
Upgrade from DirSync | [Upgrade from Azure AD sync tool (DirSync)](active-directory-aadconnect-dirsync-upgrade-get-started.md)
Accounts used for installation | [More about Azure AD Connect accounts and permissions](active-directory-aadconnect-accounts-permissions.md)
