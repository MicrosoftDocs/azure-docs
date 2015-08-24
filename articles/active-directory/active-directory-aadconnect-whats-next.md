<properties 
	pageTitle="Managing Azure AD Connect" 
	description="Learn how to extend the default configuration and operational tasks for Azure AD Connect." 
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
	ms.topic="article" 
	ms.date="08/24/2015" 
	ms.author="billmath"/>

# Managing Azure AD Connect 



The following are advanced operational topics that allow you to customize Azure Active Directory Connect to meet your organization's needs and requirements.  

## Assigning licenses to Azure AD Premium and Enterprise Mobility users

Now that your users have been synchronized to the cloud, you will need to assign them a license so they can get going with cloud apps such as Office 365. 

### To assign an Azure AD Premium or Enterprise Mobility Suite License
--------------------------------------------------------------------------------
1. Sign-in to the Azure Portal as an Administrator.
2. On the left, select **Active Directory**.
3. On the Active Directory page, double-click on the directory that has the users you wish to enable.
4. At the top of the directory page, select **Licenses**.
5. On the Licenses page, select Active Directory Premium or Enterprise Mobility Suite, and then click **Assign**.
6. In the dialog box, select the users you want to assign licenses to, and then click the check mark icon to save the changes.


## Verifying the scheduled synchronization task
If you want to check on the status of a synchronization you can do this by checking in the Azure portal.

### To verify the scheduled synchronization task
--------------------------------------------------------------------------------

1. Sign-in to the Azure Portal as an Administrator.
2. On the left, select **Active Directory**.
3. On the Active Directory page, double-click on the directory that has the users you wish to enable.
4. At the top of the directory page, select **Directory Integration**.
5. Under integration with local active directory note the last sync time.

<center>![Cloud](./media/active-directory-aadconnect-whats-next/verify.png)</center>

## Starting a scheduled synchronization task
If you need to run a synchronization task you can do this by running through the Azure AD Connect wizard again.  You will need to provide your Azure AD credentials.  In the wizard, select the **Customize synchronization options** task and click next through the wizard. At the end, ensure that the **Start the synchronization process as soon as the initial configuration completes** box is checked.

<center>![Cloud](./media/active-directory-aadconnect-whats-next/startsynch.png)</center>




## Additional tasks available in Azure AD Connect
After your initial installation of Azure AD Connect, you can always start the wizard again from the Azure AD Connect start page or desktop shortcut.  You will notice that going through the wizard again provides some new options in the form of Additional tasks.  

The following table provides a summary of these tasks and a brief description on each of them.

![Join Rule](./media/active-directory-aadconnect-whats-next/addtasks.png)


Additional Task | Description 
------------- | ------------- |
View the selected scenario  |Allows you to view your current Azure AD Connect solution.  This includes general settings, synchronized directories, synch settings, etc.
Customize Synchronization options | Allows you to change the current configuration including adding additional Active Directory forests to the configuration or enabling sync options such as user, group, device or password write-back.
Enable Staging Mode |  This allows you to stage information that will later be synchronized but nothing will be exported to Azure AD or Active Directory.  This allows you to preview the synchronizations before they occur.


 






## Additional Documentation
For additional documentation on working with Azure AD Connect see the following;

- [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
- [Changing the Azure AD Connect default configuration](active-directory-aadconnect-whats-next-change-default-config.md)
- [Using the Azure AD Connect Synchronization Rules Editor](active-directory-aadconnect-whats-next-synch-rules-editor.md)
- [Using declarative provisioning](active-directory-aadconnect-whats-next-declarative-prov.md)

Also, some of the documentation that was created for Azure AD Sync is still relevant and applies to Azure AD Connect.  Although every effort is being made to bring this documentation over to Azure.com, some of this documentation still resides in the MSDN scoped library.  For additional documentation see [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx) and [Azure AD Sync on MSDN](https://msdn.microsoft.com/library/azure/dn790204.aspx).


 
