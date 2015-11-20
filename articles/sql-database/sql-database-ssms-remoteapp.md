<properties 
	pageTitle="Use SQL Server Management Studio in RemoteApp for Security and Performance when connecting to SQL Database" 
	description="Use this tutorial to learn how to use SQL Server Management Studio in RemoteApp for Security and Performance when connecting to SQL Database" 
	services="sql-database" 
	documentationCenter="" 
	authors="adhurwit" 
	manager=""
	tags=""//>

<tags 
	ms.service="sql-database" 
	ms.workload="data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/20/2015" 
	ms.author="adhurwit"/>

# Use SQL Server Management Studio in RemoteApp for Security and Performance when connecting to SQL Database #

## Introduction  
This tutorial is going to show you how you can use SQL Server Management Studio (SSMS) in RemoteApp to connect to SQL Database. It walks you through the process of setting up SQL Server Management Studio in RemoteApp, explains the benefits, and shows security features that you can use in Azure Active Directory. 

**Estimated time to complete:** 45 minutes

## SSMS in RemoteApp

RemoteApp is an RDS service in Azure that delivers applications. You can learn more about it here: [What is RemoteApp?](../remoteapp-whatis.md)

SSMS running in RemoteApp gives you the same experience as running SSMS locally. 

![Screenshot showing SSMS running in RemoteApp][1]



## Benefits

There are many benefits to using SSMS in RemoteApp, including:

- Port 1433 on Azure SQL Server does not have to be exposed externally (outside of Azure)
- No need to keep adding and removing IP addresses in the Azure SQL Server firewall 
- All RemoteApp connections occur over HTTPS
- It is multi-user and can scale
- There is a performance gain from having SSMS in the same region as the SQL Database
- You can audit use of RemoteApp with the Premium edition of Azure Active Directory which has user activity reports
- You can enable multi-factor authentication (MFA)



## Create the RemoteApp collection

Here are the steps to create your RemoteApp collection with SSMS:


### 1. Create a new Windows VM from Image
Use the "Windows Server Remote Desktop Session Host Windows Server 2012 R2" Image from the Gallery to make your new VM. 


### 2. Install SSMS from SQL Express

Go onto the new VM and navigate to this download page: 
[Microsoft® SQL Server® 2014 Express](https://www.microsoft.com/en-us/download/details.aspx?id=42299)

There is an option to only download SSMS. After download, go into the install directory and run Setup to install SSMS. 


### 3. Run Validate script and Sysprep

On the desktop of the VM is a PowerShell script called Validate. Run this by double-clicking. It will verify that the VM is ready to be used for remote hosting of applications. When verification is complete, it will ask to run sysprep - choose to run it. 

When sysprep completes, it will shut down the VM. 

To learn more about creating a RemoteApp image, see: [How to create a RemoteApp template image in Azure](http://blogs.msdn.com/b/rds/archive/2015/03/17/how-to-create-a-remoteapp-template-image-in-azure.aspx)


### 4. Capture Image

When the VM has stopped running, find it in the current portal and Capture it. 

To learn more about capturing an image, see [Capture an image of an Azure Windows virtual machine created with the classic deployment model](../virtual-machines-capture-image-windows-server.md)


### 5. Add to RemoteApp Template Images

In the RemoteApp section of the current portal, go to the Template Images tab and click Add. In the pop-up box, select "Import an image from your Virtual Machines library" and then choose the Image that you just created. 



### 6. Create cloud collection

In the current portal, create a new RemoteApp Cloud Collection. Choose the Template Image that you just imported with SSMS installed on it. 

![Create new cloud collection][2]


### 7. Publish SSMS

On the Publishing tab of your new cloud collection, select Publish an application from the Start Menu and then choose SSMS from the list. 


### 8. Add users

On the User Access tab you can select the users that will have access to this RemoteApp collection which only includes SSMS. 


### 9. Install the RemoteApp client application

You can download and install a RemoteApp client here: [Download | Azure RemoteApp](https://www.remoteapp.windowsazure.com/en/clients.aspx)



## Configure Azure SQL Server

The only configuration needed is to ensure that Azure Services is enabled for the firewall. If you use this solution, then you do not need to add any IP addresses to open the firewall. The network traffic that is allowed to the SQL Server is from other Azure services. 


![Azure Allow][4]



## Multi-Factor Authentication (MFA)

MFA can be enabled for this application specifically. Go to the Applications tab of your Azure Active Directory. You will find an entry for Microsoft Azure RemoteApp. If you click that application and then configure, you will see the page below where you can enable MFA for this application. 

![Enable MFA][3]



## Audit user activity with Azure Active Directory Premium

If you do not have Azure AD Premium, then you have to turn it on in the Licenses section of your directory. With Premium enabled, you can assign users to the Premium level. 

When you go to a user in your Azure Active Directory, you can then go to the Activity tab to see login information to RemoteApp. 



## Summary

After completing all the above steps, you will be able to run the RemoteApp client and log-in with an assigned user. You will be presented with SSMS as one of your applications, and you can run it as you would if it were installed on your computer with access to Azure SQL Server. 

For more information on how to make the connection to SQL Database, see [Connect with SQL Server Management Studio (SSMS)](https://azure.microsoft.com/en-us/documentation/articles/sql-database-connect-to-database/)


That's everything for now. Enjoy!



<!--Image references-->
[1]: ./media/sql-database-ssms-remoteapp/ssms.png
[2]: ./media/sql-database-ssms-remoteapp/newcloudcollection.png
[3]: ./media/sql-database-ssms-remoteapp/mfa.png
[4]: ./media/sql-database-ssms-remoteapp/allowazure.png


