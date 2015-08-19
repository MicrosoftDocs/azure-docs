
<properties 
    pageTitle="Configure Active Directory for Azure RemoteApp" 
    description="Learn how to set up Active Directory to work with Azure RemoteApp." 
    services="remoteapp" 
	documentationCenter="" 
    authors="lizap" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="08/03/2015" 
    ms.author="elizapo" />



# Configuring Active Directory for Azure RemoteApp


For a hybrid collection of Azure RemoteApp, you need to set up an Active Directory domain infrastructure on-premises and an Azure Active Directory tenant with Directory Integration (and optionally single sign-on). Additionally, you need to create some Active Directory objects in the on-premises directory. Use the following information to configure the on-premises Active Directory and Azure AD, and then integrate the two.

## Configure your on-premises Active Directory
Start by configuring your on-premises Active Directory. You need to identify the UPN domain suffix to use, and then create Active Directory objects for RemoteApp. 

Haven’t added Active Directory Domain Services to your Windows Server 2012 R2 environment yet? Check out [these instructions](https://technet.microsoft.com/library/cc731053.aspx) for information on how to do just that.
### Examine and configure the UPN domain suffix
If your forest is not configured with a UPN suffix that matches the Azure AD domain that you will use for RemoteApp, you need to add it. Determine if the necessary suffix is configured:


1. Launch Active Directory Users and Computers.
2.	Expand the domain name, and then click **Users**.
3.	Right-click **Administrator**, and then click **Properties**.
4.	On the **Account** tab, look at the UPN names configured for this domain in the **User logon name** field.
5.	If you do not see a suffix that matches the domain name that you want to use for your RemoteApp collection, do the following:
	1.	Launch Active Directory Domains and Trusts.
	2.	Right-click **Active Directory Domains and Trusts**, and then click **Properties**.
	3.	Review the list of suffixes.
	4.	Type the FQDN of the domain name in the box, and click **Add**, then **OK**. Example: contoso.com. 

		DO NOT include the "@" in the suffix here.

From now on, when you create new users, you can select the new suffix from User logon name. Additionally, you can change the suffix for existing users on the Account tab in the properties of the users.

For more information see [Add User Principal Name Suffixes](http://technet.microsoft.com/library/cc772007.aspx).

### Create objects for RemoteApp in Active Directory
RemoteApp needs two objects in your on-premises Active Directory:


- A service account to provide access to domain resources for RemoteApp programs by joining RDSH end points to the on-premises domain.
- An Organizational Unit (OU) to contain RemoteApp machine objects. Use of the OU is recommended (but not required) to isolate the accounts and policies you will use with RemoteApp.

Use the following information to create each of these objects.

#### Create the service account:


1. Launch Active Directory Users and Computers.
2.	Right-click **Users**, and then click **New > User**.
3.	Enter a user name and password for the RemoteApp service account.

	**Note:** You will need this account information when you create your RemoteApp collection.

#### Create a new Organizational Unit (OU)


1. In Active Directory Users and Computers, right-click your domain. Click **New > Organizational Unit**.
2. Add the service account you created for RemoteApp to this new OU.

	To do this, find the service account you created. Right-click it, and then click **Move**. Select the new OU, and then click **OK**.


1. Grant the RemoteApp service account the authority to add and delete computers to this 
OU:
	1. From the Active Directory Users and Computers snap-in, click **View > Advanced Features**. This adds the **Security** tab to the Properties information.
	2. Right-click the RemoteApp service OU, and then click **Properties**.
	3. On the **Security** tab, click **Add**. Select the RemoteApp service account user object, and then click **OK**.
	4. Click **Advanced**.
	5. On the **Permissions** tab, select the RemoteApp service account, and then click **Edit**.
	6. Select **This object and all descendant objects** in the **Applies to** field.
	7. In the **Permissions** field, select **Allow** next to the Create Computer Objects and Delete Computer Objects, and then click **OK**. 
	8. Click **OK** on the remaining two windows.


## Configure Azure Active Directory
Now that the on-premises Active Directory is set up, move to Azure AD. You need to create a custom domain that matches the UPN domain suffix for your on-premises domain and set up directory integration. The hybrid collection supports only Azure Active Directory accounts that have been synced (using a tool like DirSync) from a Windows Server Active Directory deployment; specifically, either synced with the Password Synchronization option or synced with Active Directory Federation Services (AD FS) federation configured. 

Use the following information to configure Azure Active Directory


- [Add your domain](http://technet.microsoft.com/library/hh969247.aspx) – Use this information to add a domain that matches the UPN domain suffix of your on-premises Active Directory domain.
- [Directory integration](http://technet.microsoft.com/library/jj573653.aspx) – Use this information to choose a directory integration option – either [DirSync with Password Synchronization](http://technet.microsoft.com/library/dn441214.aspx) or [DirSync with federation](http://technet.microsoft.com/library/dn441213.aspx).

You can also configure [Multi-Factor Authentication (MFA)](http://technet.microsoft.com/library/dn249466.aspx).

## Trouble configuring your directory synchronization?

If you are having trouble configuring directory synchronization, check the following:

- You are using the latest version of Azure Directory Sync tool 
-	In the management portal, under **Active Directory->Default Directory->Domains**, you already added your custom domain (e.g mydomain.com) and made it the primary one.
-	Under **Active Directory->Default Directory->Users**, you add a new user under that domain (e.g. myAzureSyncUser@mydomain.com).
-	On your domain in Active Directory, you added a new domain user and made him a member of Enterprise Admins  (e.g. myDomainSyncUser@mydomain.com).

Now start the Azure Directory Sync tool, and use **myAzureSyncUser@mydomain.com** credentials for the first prompt (Microsoft Azure Active Directory Administrator Credentials) and use **myDomainSyncUser@mydomain.com** for the second prompt.
 