<properties 
	pageTitle="Getting started with the Azure Multi-Factor Authentication Server" 
	description="This is the Azure Multi-factor authentication page that describes how to get started with Azure MFA Server." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2015" 
	ms.author="billmath"/>

# Getting started with the Azure Multi-Factor Authentication Server




<center>![Cloud](./media/multi-factor-authentication-get-started-server/server.png)</center>

Now that we have determined whether to use on-premises multi-factor authentication, lets get going.  This page covers a new installation of the server and getting it setup with on-premises Active Directory.  If you already have the Phonefactor server installed and are looking for how to do this see Upgrading to the Azure Multi-Factor Server or if you are looking for information on installing just the web service see Deploying the Azure Multi-Factor Authentication Server Mobile App Web Service.



## Download the Azure Multi-Factor Authentication Server

There are two different ways that you can download the Azure Multi-Factor Authentication Server. The first, is by signing into the Azure portal and the second way is directly from [https://pfweb.phonefactor.net](https://pfweb.phonefactor.net). 


### To download the Azure Multi-Factor Authentication server from the Azure portal
--------------------------------------------------------------------------------

1. Sign in to the Azure Portal as an Administrator.
2. On the left, select Active Directory.
3. On the Active Directory page, at the top click **Multi-Factor Auth Providers**
4. At the bottom click **Manage**
5. Click **Downloads**
6. Above **Generate Activation Credentials**, click **Download**
7. Save the download.

### To download the Azure Multi-Factor Authentication server directly
--------------------------------------------------------------------------------

1. Sign in to the [https://pfweb.phonefactor.net](https://pfweb.phonefactor.net).
2. Click **Downloads**
<center>![Cloud](./media/multi-factor-authentication-get-started-server/download2.png)</center>
3. Above **Generate Activation Credentials**, click **Download** - Leave this page up because you will be coming back to it.
4. Save the download.



## Install and Configure the Azure Multi-Factor Authentication Server
Now that you have downloaded the server you can install it and configure it.  Be sure that the server you are installing it on meets the following requirements:



Azure Multi-Factor Authentication Server Requirements|Description|
:------------- | :------------- | 
Hardware|<li>200 MB of hard disk space</li><li>x32 or x64 capable processor</li><li>1 GB or greater RAM</li>
Software|<li>Windows Server 2003 or greater if the host is a server OS</li><li>Windows Vista or greater if the host is a client OS</li><li>Microsoft .NET 2.0 Framework</li><li>IIS 6.0 or greater if installing the user portal or web service SDK</li>

### Azure Multi-Factor Authentication Server firewall requirements
--------------------------------------------------------------------------------
Each MFA server must be able to communicate on port 443 outbound to the following:

- https://pfd.phonefactor.net
- https://pfd2.phonefactor.net
- https://css.phonefactor.net

If outbound firewalls are restricted on port 443, the following IP address ranges will need to be opened:

IP Subnet|Netmask|IP Range
:------------- | :------------- | :------------- |
134.170.116.0/25|255.255.255.128|134.170.116.1 – 134.170.116.126
134.170.165.0/25|255.255.255.128|134.170.165.1 – 134.170.165.126
70.37.154.128/25|255.255.255.128|70.37.154.129 – 70.37.154.254

If you are not using Azure Multi-Factor Authentication Event Confirmation features and if users are not authenticating with the Multi-Factor Auth mobile apps from devices on the corporate network the IP ranges can be reduced to the following:


IP Subnet|Netmask|IP Range
:------------- | :------------- | :------------- |
134.170.116.72/29|255.255.255.248|134.170.116.72 – 134.170.116.79
134.170.165.72/29|255.255.255.248|134.170.165.72 – 134.170.165.79
70.37.154.200/29|255.255.255.248|70.37.154.201 – 70.37.154.206


### To install and configure the Azure Multi-Factor Authentication server
--------------------------------------------------------------------------------


1. Double-click on the executable. This will begin the installation.
2. On the Select Installation Folder screen, make sure that the folder is correct and click Next.
3. Once the installation complete, click Finish.  This will launch the configuration wizard.
4. On the configuration wizard welcome screen, place a check in **Skip using the Authentication Configuration Wizard** and click **Next**.  This will close the wizard and start the server.
<center>![Cloud](./media/multi-factor-authentication-get-started-server/skip2.png)</center>

5. Back on the page that we downloaded the server from, click the **Generate Activation Credentials** button.  Copy this information into the Azure MFA Server in the boxes provided and click **Activate**.


The above steps show an express setup with the configuration wizard.  You can re-run the authentication wizard by selecting it from the Tools menu on the server.



##Import users from Active Directory

Now that the server is installed and configured you can quickly import users into the Azure MFA Server. 

### To import users from Active Directory
--------------------------------------------------------------------------------


1. In the Azure MFA Server, on the left, select **Users**.
2. At the bottom, select **Import from Active Directory**.
3. Now you can either search for individual users or search the AD directory for OUs with users in them.  In this case, we will specify the users OU.
4. Highlight all of the users on the right and click **Import**.  You should receive a pop-up telling you that you were successful.  Close the import window.

<center>![Cloud](./media/multi-factor-authentication-get-started-server/import2.png)</center>
