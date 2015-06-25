<properties 
	pageTitle="Getting Started with Azure AD Connect" 
	description="Learn how to download, install and run the setup wizard for Azure AD Connect." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/28/2015" 
	ms.author="billmath"/>

# Getting started with Azure AD Connect

<div class="dev-center-tutorial-selector sublanding">
<a href="../active-directory-aadconnect/" title="What is It">What is It</a>
<a href="../active-directory-aadconnect-how-it-works/" title="How it Works">How it Works</a>
<a href="../active-directory-aadconnect-get-started/" title="Getting Started" class="current">Getting Started</a>
<a href="../active-directory-aadconnect-whats-next/" title="What's Next">What's Next</a>
<a href="../active-directory-aadconnect-learn-more/" title="Learn More">Learn More</a>
</div>


The following documentation will help you get started with Azure Active Directory Connect.  This documentation deals with using the express installation for Azure AD Connect.  For information on a Custom installation see [Custom installation for Azure AD Connect](active-directory-aadconnect-get-started-custom.md).  For information on upgrading from DirSync to Azure AD Connect see [Upgrading DirSync to Azure Active Directory Connect.](active-directory-aadconnect-dirsync-upgrade-get-started.md)


## Download Azure AD Connect



To get started using Azure AD Connect you can download the latest version using the following:  [Download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkID=615771) 

## Before you install Azure AD Connect
Before you install Azure AD Connect with Express Settings, there are a few things that you will need. 


 
- An Azure subscription or an [Azure trial subscription](http://azure.microsoft.com/pricing/free-trial/) - This is only required for accessing the Azure portal and not for using Azure AD Connect.  If you are using PowerShell or Office 365 you do not need an Azure subscription to use Azure AD Connect.
- An Azure AD Global Administrator account for the Azure AD tenant you wish to integrate with
- An AD Domain Controller or member server with Windows Server 2008 or later
- An Enterprise Administrator account for your local Active Directory
- Optional:  A test user account to verify synchronization. 


For Custom options such as multiple forests or federated sign on, find out about additional requirements [here.](active-directory-aadconnect-get-started-custom.md)


## Express installation of Azure AD Connect
Selecting Express Settings is the default option and is one of the most common scenarios. When doing this, Azure AD Connect deploys sync with the password hash sync option. This is for a single forest only and allows your users to use their on-premises password to sign-in to the cloud. Using the Express Settings will automatically kick off a synchronization once the installation is complete (though you can choose not to do this). With this option there are only a few short clicks to extending your on-premises directory to the cloud.

<center>![Welcome to Azure AD Connect](./media/active-directory-aadconnect-get-started/welcome.png)</center>

### To install Azure AD Connect using express settings
--------------------------------------------------------------------------------------------

1. Login to the server you wish to install Azure AD Connect on as an Enterprise Administrator.  This should be the server you wish to be the sync server.
2. Navigate to and double-click on AzureADConnect.msi
3. On the Welcome screen, select the box agreeing to the licensing terms and click **Continue**.
4. On the Express settings screen, click **Use express settings**.
<center>![Welcome to Azure AD Connect](./media/active-directory-aadconnect-get-started/express.png)</center>
6. On the Connect to Azure AD screen, enter the username and password of an Azure global administrator for your Azure AD.  Click **Next**.
8. On the Connect to AD DS screen enter the username and password for an enterprise admin account.  Click **Next**.
<center>![Welcome to Azure AD Connect](./media/active-directory-aadconnect-get-started/install4.png)</center>
9. On the Ready to configure screen, click **Install**.
	- Optionally on the Ready to Configure page, you can un-check the “**Start the synchronization process as soon as configuration completes**” checkbox.  If you do this, the wizard will configure sync but will leave the task disabled so it will not run until you enable it manually in the Task Scheduler.  Once the task is enabled, synchronization will run every three hours.
	- Also optionally you can choose to configure sync services for **Exchange Hybrid deployment** by checking the corresponding checkbox.  If you don’t plan to have Exchange mailboxes both in the cloud and on premises, you do not need this.

<center>![Welcome to Azure AD Connect](./media/active-directory-aadconnect-get-started/readyinstall.png)</center>
8. Once the installation completes, click **Exit**.


<br>
<br>

For a video on using the express installation check out the following:

<center>[AZURE.VIDEO azure-active-directory-connect-express-settings]</center>



## Verifying the installation

After you have successfully installed Azure AD Connect you can verify that synchronization is occurring by signing in to the Azure portal and checking the last sync time. 

1.  Sign in to the Azure portal.
2.  On the left select Active Directory.
3.  Double-click on the directory you just used to setup Azure AD Connect.
4.  At the top, select Directory Integration.  Note the last sync time.

<center>![Express Installation](./media/active-directory-aadconnect-get-started/verify.png)</center>

## What to do next
Now that you have Azure AD Connect installed you can use the link [here](active-directory-aadconnect-whats-next.md) to get going with post installation tasks such as  assigning your users Azure AD Premium or Enterprise Mobility licenses or configuring additional options.

**Additional Resources**

[Directory Integration Tools Comparison](active-directory-aadconnect-get-started-tools-comparison.md)

 