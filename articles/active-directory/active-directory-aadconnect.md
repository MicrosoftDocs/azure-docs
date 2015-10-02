<properties 
	pageTitle="Integrating your on-premises identities with Azure Active Directory." 
	description="This is the Azure AD Connect that describes what it is and why you would use it." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="09/09/2015" 
	ms.author="billmath"/>

# Integrating your on-premises identities with Azure Active Directory



Today, users want to be able to access applications both on-premises and in the cloud.  They want to be able to do this from any device, be it a laptop, smart phone, or tablet.  In order for this to occur, you and your organization need to be able to provide a way for users to access these apps, however moving entirely to the cloud is not always an option.  

<center>![What is Azure AD Connect](./media/active-directory-aadconnect/arch.png)</center>

With the introduction of Azure Active Directory Connect, providing access to these apps and moving to the cloud has never been easier.  Azure AD Connect provides the following benefits:

- Your users can sign on with a common identity both in the cloud and on-premises.  They don't need to remember multiple passwords or accounts and administrators don't have to worry about the additional overhead multiple accounts can bring.
- A single tool and guided experience for connecting your on-premises directories with Azure Active Directory. Once installed the wizard deploys and configures all components required to get your directory integration up and running including sync services, password sync or AD FS, and prerequisites such as the Azure AD PowerShell module.



<center>![What is Azure AD Connect](./media/active-directory-aadconnect/azuread.png)</center>




## Why use Azure AD Connect 

Integrating your on-premises directories with Azure AD makes your users more productive by providing a common identity for accessing both cloud and on-premises resources.  With this integration users and organizations can take advantage of the following:
	
* Organizations can provide users with a common hybrid identity across on-premises or cloud-based services leveraging Windows Server Active Directory and then connecting to Azure Active Directory. 
* Administrators can provide conditional access based on application resource, device and user identity, network location and multi-factor authentication.
* Users can leverage their common identity through accounts in Azure AD to Office 365, Intune, SaaS apps and third-party applications.  
* Developers can build applications that leverage the common identity model, integrating applications into Active Directory on-premises or Azure for cloud-based applications

Azure AD Connect makes this integration easy and simplifies the management of your on-premises and cloud identity infrastructure.



----------------------------------------------------------------------------------------------------------
## Download Azure AD Connect

To get started using Azure AD Connect you can download the latest version using the following:  [Download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkId=615771) 

----------------------------------------------------------------------------------------------------------

## How Azure AD Connect works


Azure Active Directory Connect is made up of three primary parts.  They are the synchronization services, the optional Active Directory Federation Services piece, and the monitoring piece which is done using [Azure AD Connect Health](active-directory-aadconnect-health.md).


<center>![Azure AD Connect Stack](./media/active-directory-aadconnect-how-it-works/AADConnectStack2.png)
</center>

- Synchronization - This part is made up of the the components and functionality previously released as Dirsync and AAD Sync.  This is the part that is responsible for creating users and groups.  It is also responsible for making sure that the information on users and groups in your on-premises environment, matches the cloud.
- AD FS - This is an optional part of Azure AD Connect and can be used to setup a hybrid environment using an on-premises AD FS infrastructure.  This part can be used by organizations to address complex deployments that include such things as domain join SSO, enforcement of AD login policy and smart card or 3rd party MFA.  For additional information on configuring SSO see [DirSync with Single-Sign On](https://msdn.microsoft.com/library/azure/dn441213.aspx).
- Health Monitoring - For complex deployments using AD FS, Azure AD Connect Health can provide robust monitoring of your federation servers and provide a central location in the Azure portal to view this activity.  For additional information see [Azure Active Directory Connect Health](active-directory-aadconnect-health.md).


### Azure AD Connect supporting components

The following is a list of per-requisites and supporting components that Azure AD Connect will install on the server that you set Azure AD Connect up on.  This list is for a basic Express installation.  If you choose to use a different SQL Server on the Install synchronization services page then, the SQL Server 2012 components listed below are not installed. 

- Azure AD Connect Azure AD Connector
- Microsoft SQL Server 2012 Command Line Utilities
- Microsoft SQL Server 2012 Native Client
- Microsoft SQL Server 2012 Express LocalDB
- Azure Active Directory Module for Windows PowerShell
- Microsoft Online Services Sign-In Assistant for IT Professionals
- Microsoft Visual C++ 2013 Redistribution Package






## Getting started with Azure AD Connect



The following documentation will help you get started with Azure Active Directory Connect.  This documentation deals with using the express installation for Azure AD Connect.  For information on a Custom installation see [Custom installation for Azure AD Connect](active-directory-aadconnect-get-started-custom.md).  For information on upgrading from DirSync to Azure AD Connect see [Upgrading DirSync to Azure Active Directory Connect.](active-directory-aadconnect-dirsync-upgrade-get-started.md)


### Before you install Azure AD Connect
Before you install Azure AD Connect with Express Settings, there are a few things that you will need. 


 
- An Azure subscription or an [Azure trial subscription](http://azure.microsoft.com/pricing/free-trial/) - This is only required for accessing the Azure portal and not for using Azure AD Connect.  If you are using PowerShell or Office 365 you do not need an Azure subscription to use Azure AD Connect.
- An Azure AD Global Administrator account for the Azure AD tenant you wish to integrate with
- Azure AD Connect must be installed on Windows Server 2008 or later.  This server may be a domain controller or a member server.
- The AD schema version and forest level must be Windows Server 2003 or later. The domain controllers can run any version as long as the schema and forest level requirements are met.
- If Active Directory Federation Services is being deployed, the servers where AD FS will be installed must be Windows Server 2012 R2 or later.
- Azure AD Connect requires a SQL Server database to store identity data. By default a SQL  Server 2012 Express LocalDB (a light version of SQL Server Express) is installed and the service account for the service is created on the local machine. SQL Server Express has a 10GB size limit that enables you to manage approximately 100.000 objects.
- If you need to manager a higher volume of directory objects, you need to point the installation process to a different version of SQL Server. 
Azure AD Connect supports all flavors of Microsoft SQL Server from SQL Server 2008 (with SP4) to SQL Server 2014.
- An Enterprise Administrator account for your local Active Directory
- If you are using an outbound proxy, the following setting in the **C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config** file must be added in order to complete the installation. 
<code>
		
		<system.net>
    		<defaultProxy>
      		<proxy
        	usesystemdefault="true"
        	proxyaddress="http://<PROXYIP>:80"
        	bypassonlocal="true"
     		 />
    		</defaultProxy>
  		</system.net>
</code>
This text must be entered at the bottom of the file.  In this code, &lt;PROXYIP&gt; represents the actual proxy IP address.

- Optional:  A test user account to verify synchronization. 

#### Hardware requirements for Azure AD Connect
The table below shows the minimum requirements for the Azure AD Connect computer.

| Number of objects in Active Directory | CPU | Memory | Hard drive size |
| ------------------------------------- | --- | ------ | --------------- |
| Fewer than 10,000 | 1.6 GHz | 4 GB | 70 GB |
| 10,000–50,000 | 1.6 GHz | 4 GB | 70 GB |
| 50,000–100,000 | 1.6 GHz | 16 GB | 100 GB |
| For 100,000 or more objects the full version of SQL Server is required|  |  |  |
| 100,000–300,000 | 1.6 GHz | 32 GB | 300 GB |
| 300,000–600,000 | 1.6 GHz | 32 GB | 450 GB |
| More than 600,000 | 1.6 GHz | 32 GB | 500 GB |




For Custom options such as multiple forests or federated sign on, find out about additional requirements [here.](active-directory-aadconnect-get-started-custom.md)


### Express installation of Azure AD Connect
Selecting Express Settings is the default option and is one of the most common scenarios. When doing this, Azure AD Connect deploys sync with the password hash sync option. This is for a single forest only and allows your users to use their on-premises password to sign-in to the cloud. Using the Express Settings will automatically kick off a synchronization once the installation is complete (though you can choose not to do this). With this option there are only a few short clicks to extending your on-premises directory to the cloud.

<center>![Welcome to Azure AD Connect](./media/active-directory-aadconnect-get-started/welcome.png)</center>

#### To install Azure AD Connect using express settings
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





For a video on using the express installation check out the following:

<center>[AZURE.VIDEO azure-active-directory-connect-express-settings]</center>



### Verifying the installation

After you have successfully installed Azure AD Connect you can verify that synchronization is occurring by signing in to the Azure portal and checking the last sync time. 

1.  Sign in to the Azure portal.
2.  On the left select Active Directory.
3.  Double-click on the directory you just used to setup Azure AD Connect.
4.  At the top, select Directory Integration.  Note the last sync time.

<center>![Express Installation](./media/active-directory-aadconnect-get-started/verify.png)</center>

## Managing Azure AD Connect 



The following are advanced operational topics that allow you to customize Azure Active Directory Connect to meet your organization's needs and requirements.  

### Assigning licenses to Azure AD Premium and Enterprise Mobility users

Now that your users have been synchronized to the cloud, you will need to assign them a license so they can get going with cloud apps such as Office 365. 

#### To assign an Azure AD Premium or Enterprise Mobility Suite License
--------------------------------------------------------------------------------
1. Sign-in to the Azure Portal as an Administrator.
2. On the left, select **Active Directory**.
3. On the Active Directory page, double-click on the directory that has the users you wish to enable.
4. At the top of the directory page, select **Licenses**.
5. On the Licenses page, select Active Directory Premium or Enterprise Mobility Suite, and then click **Assign**.
6. In the dialog box, select the users you want to assign licenses to, and then click the check mark icon to save the changes.


### Verifying the scheduled synchronization task
If you want to check on the status of a synchronization you can do this by checking in the Azure portal.

#### To verify the scheduled synchronization task
--------------------------------------------------------------------------------

1. Sign-in to the Azure Portal as an Administrator.
2. On the left, select **Active Directory**.
3. On the Active Directory page, double-click on the directory that has the users you wish to enable.
4. At the top of the directory page, select **Directory Integration**.
5. Under integration with local active directory note the last sync time.

<center>![Cloud](./media/active-directory-aadconnect-whats-next/verify.png)</center>

### Starting a scheduled synchronization task
If you need to run a synchronization task you can do this by running through the Azure AD Connect wizard again.  You will need to provide your Azure AD credentials.  In the wizard, select the **Customize synchronization options** task and click next through the wizard. At the end, ensure that the **Start the synchronization process as soon as the initial configuration completes** box is checked.

<center>![Cloud](./media/active-directory-aadconnect-whats-next/startsynch.png)</center>




### Additional tasks available in Azure AD Connect
After your initial installation of Azure AD Connect, you can always start the wizard again from the Azure AD Connect start page or desktop shortcut.  You will notice that going through the wizard again provides some new options in the form of Additional tasks.  

The following table provides a summary of these tasks and a brief description on each of them.

<center>![Join Rule](./media/active-directory-aadconnect-whats-next/addtasks.png)
</center>

Additional Task | Description 
------------- | ------------- |
View the selected scenario  |Allows you to view your current Azure AD Connect solution.  This includes general settings, synchronized directories, synch settings, etc.
Customize Synchronization options | Allows you to change the current configuration including adding additional Active Directory forests to the configuration or enabling sync options such as user, group, device or password write-back.
Enable Staging Mode |  This allows you to stage information that will later be synchronized but nothing will be exported to Azure AD or Active Directory.  This allows you to preview the synchronizations before they occur.


 
### Additional Documentation
For additional documentation on working with Azure AD Connect see the following;

- [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md) 
- [Changing the Azure AD Connect default configuration](active-directory-aadconnect-whats-next-change-default-config.md)
- [Using the Azure AD Connect Synchronization Rules Editor](active-directory-aadconnect-whats-next-synch-rules-editor.md)
- [Using declarative provisioning](active-directory-aadconnect-whats-next-declarative-prov.md)

Also, some of the documentation that was created for Azure AD Sync is still relevant and applies to Azure AD Connect.  Although every effort is being made to bring this documentation over to Azure.com, some of this documentation still resides in the MSDN scoped library.  For additional documentation see [Azure AD Connect on MSDN](active-directory-aadconnect.md) and [Azure AD Sync on MSDN](https://msdn.microsoft.com/library/azure/dn790204.aspx).


**Additional Resources**



Ignite 2015 presentation on extending your on-premises directories to the cloud.

[AZURE.VIDEO microsoft-ignite-2015-extending-on-premises-directories-to-the-cloud-made-easy-with-azure-active-directory-connect]

[Multi-forest Directory Sync with Single Sign-On Scenario](https://msdn.microsoft.com/library/azure/dn510976.aspx) - Integrate multiple directories with Azure AD.

[Azure AD Connect Health](active-directory-aadconnect-health.md) - Monitor the health of your on-premises AD FS infrastructure.

[Azure AD Connect FAQ](active-directory-aadconnect-faq.md) - Frequently asked questions around Azure AD Connect.






 
