---
title: Azure MFA Server upgrade | Microsoft Docs
description: Steps and guidance to upgrade the Azure Multi-Factor Authentication Server to a newer version. 
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid: 50bb8ac3-5559-4d8b-a96a-799a74978b14
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/26/2017
ms.author: kgremban
---


# Upgrading Azure Multi-Factor Authentication Server

This article walks you through the process of upgrading Azure Multi-Factor Authentication (MFA) Server v6.0 or higher. If you need to upgrade an old version of the PhoneFactor Agent please refer to [Upgrade the PhoneFactor Agent to Azure Multi-Factor Authentication Server](multi-factor-authentication-get-started-server-upgrade.md).

If you're upgrading from v6.x or older to v7.x or newer, all components will change from .NET 2.0 to .NET 4.5. All components also require Microsoft Visual C++ 2015 Redistributable Update 1 or higher. The MFA Server installer will install both the x86 and x64 versions of these components if they aren't already installed, but if the User Portal and Mobile App Web Service are installed on separate servers, you will need to install those packages before upgrading those components. You can search for the latest Microsoft Visual C++ 2015 Redistributable update on the [Microsoft Download Center](https://www.microsoft.com/en-us/download/). 

## Install the latest version of Azure MFA Server

1. Use the instructions in [Download the Azure Multi-Factor Authentication Server](multi-factor-authentication-get-started-server.md#download-the-azure-multi-factor-authentication-server) to get the latest version of the Azure MFA Server.
2. Make a backup of the MFA Server data file located at C:\Program Files\Multi-Factor Authentication Server\Data\PhoneFactor.pfdata (assuming the default install location) on your master MFA Server.
3. If you run multiple servers for high availability, you may want to change the client systems that authenticate to the MFA Server so that they stop sending authentication traffic to each MFA Server while it's upgrading. If you use a load balancer, remove each MFA Server being upgraded from the load balancer, do the upgrade, and then add the server back into the farm.
4. Run the new installer on each MFA Server. Subordinate servers should be upgraded first because they will still be able to read the old data file being replicated by the master. 

  You do not need to uninstall prior to running the installer. The installer will do an in-place upgrade. The installation path is picked up from the registry from the previous installation, so it will install in the same location (for example, C:\Program Files\Multi-Factor Authentication Server). 
  
5. If you're prompted to install a Microsoft Visual C++ 2015 Redistributable update package, accept the prompt. Both the x86 and x64 versions of the package will be installed.
5. If the Web Service SDK was previously installed, you should be prompted to install the new Web Service SDK. When you install the new Web Service SDK, make sure that the virtual directory name matches the previously-installed virtual directory (e.g. MultiFactorAuthWebServiceSdk).
6. Repeat the steps on all subordinate servers, and then upgrade the master. Promote one of the upgraded subordinates to be the master before upgrading the master server so that a master server is always online and replicating to the subordinates.

## Upgrade the User Portal

1. Make a backup of the web.config file that is in the virtual directory of the User Portal installation location (for example, C:\inetpub\wwwroot\MultiFactorAuth). If any changes were made to the default theme, make a backup of the App_Themes\Default folder as well. It is better to create a copy of the Default folder and create a new theme than to change the Default theme.
2. If the User Portal is installed on the same server(s) as the other MFA Server components, the MFA Server installation will prompt you to update the User Portal. Accept the prompt and install the User Portal update, ensuring that the virtual directory name matches the previously-installed virtual directory (e.g. MultiFactorAuth).
3. If the User Portal is installed on its own server(s), copy the MultiFactorAuthenticationUserPortalSetup64.msi file from install location of one of the MFA Servers and put it onto the User Portal web servers. Run the installer. 

  If an error occurs stating that Microsoft Visual C++ 2015 Redistributable Update 1 or higher is required, download and install the latest update package from the [Microsoft Download Center](https://www.microsoft.com/en-us/download/). Install both the x86 and x64 versions.

4. After the updated User Portal software is installed, compare the web.config file that was backed up in step 1 with the new web.config file installed by the installer. If no new attributes exist in the new web.config, you can copy your saved web.config back into the virtual directory and overwrite the new one that was installed. Another option is to copy/paste the appSettings values and the Web Service SDK URL from the backup file into the new web.config.

## Upgrade the Mobile App Web Service

1. Make a backup of the web.config file that is in the virtual directory of the Mobile App Web Service installation location (for example, C:\inetpub\wwwroot\app or C:\inetpub\wwwroot\MultiFactorAuthMobileAppWebService).
2. Copy the MultiFactorAuthenticationMobileAppWebServiceSetup64.msi file from the install location of one of the MFA Servers and put it onto the Mobile App registration web servers.
3. Run the installer. 

  If an error occurs stating that Microsoft Visual C++ 2015 Redistributable Update 1 or higher is required, download and install the latest update package from the [Microsoft Download Center](https://www.microsoft.com/en-us/download/). Install both the x86 and x64 versions.

4. After the updated Mobile App Web Service software is installed, compare the web.config file that was backed up in step 1 with the new web.config file installed by the installer. If no new attributes exist in the new web.config, you can copy your saved web.config back into the virtual directory and overwrite the new one that was installed. Another option is to copy/paste the appSettings values and the Web Service SDK URL from the backup file into the new web.config.

## Upgrade the AD FS Adapters ##

> [!WARNING] 
> Multi-factor authentication will not be available to your users during steps 4-9 below. However, if you have AD FS configured in two or more clusters, each with its own configuration database, you can remove, upgrade and restore each cluster in the farm independently of the other clusters to avoid downtime.
 
1.	If the MFA Servers are separate from the AD FS servers:
	- Save a copy of the existing MultiFactorAuthenticationAdfsAdapter.config that was registered in AD FS or export the existing configuration to a file using the following PowerShell command: `Export-AdfsAuthenticationProviderConfigurationData -Name [adapter name] -FilePath [path to config file]`. The adapter name is either "WindowsAzureMultiFactorAuthentication" or "AzureMfaServerAuthentication" depending on the version previously installed.
	- Copy the following files from the MFA Server installation location to the AD FS servers:
		- MultiFactorAuthenticationAdfsAdapterSetup64.msi
		- Register-MultiFactorAuthenticationAdfsAdapter.ps1
		- Unregister-MultiFactorAuthenticationAdfsAdapter.ps1
		- MultiFactorAuthenticationAdfsAdapter.config
	- Edit the Register-MultiFactorAuthenticationAdfsAdapter.ps1 script by adding `-ConfigurationFilePath [path]` to the end of the Register-AdfsAuthenticationProvider command, where *[path]* is the full path to the MultiFactorAuthenticationAdfsAdapter.config file or the configuration file exported in the step above. 
	- Check the attributes in the new MultiFactorAuthenticationAdfsAdapter.config to see if they match the old config file. If any attributes were added or removed in the new version, either copy the attribute values from the old configuration file to the new one, or modify the old configuration file to match.
2. Remove some AD FS servers from the farm. These servers will be updated while the others are still running.
3. Install the new AD FS adapter on each server removed from the AD FS farm. If the MFA Server is installed on each AD FS server, you can update through the MFA Server admin UX. Otherwise, update by running MultiFactorAuthenticationAdfsAdapterSetup64.msi. 

  If an error occurs stating that Microsoft Visual C++ 2015 Redistributable Update 1 or higher is required, download and install the latest update package from the [Microsoft Download Center](https://www.microsoft.com/en-us/download/). Install both the x86 and x64 versions.

4. Go to **AD FS** > **Authentication Policies** > **Edit Global MultiFactor Authentication Policy**. Uncheck **WindowsAzureMultiFactorAuthentication** or **AzureMFAServerAuthentication** (depending on the current version installed). 

  Once this step is complete, two-step verification through MFA Server will not be available in this AD FS cluster until step 9 below.

5. Unregister the older version of the AD FS adapter by running the Unregister-MultiFactorAuthenticationAdfsAdapter.ps1 PowerShell script. Ensure that the *-Name* parameter listed in the script (“WindowsAzureMultiFactorAuthentication” or "AzureMFAServerAuthentication") matches the name that was displayed in step 4. Note that this applies to all servers in the same AD FS cluster since there is a central configuration.
6. Register the new AD FS adapter by running the Register-MultiFactorAuthenticationAdfsAdapter.ps1 PowerShell script. Note that this applies to all servers in the same AD FS cluster since there is a central configuration.
7. Restart the AD FS service on each server removed from the AD FS farm.
8. Add the updated servers back to the AD FS farm and remove the other servers from the farm.
9. Go to **AD FS** > **Authentication Policies** > **Edit Global MultiFactor Authentication Policy**. Check **AzureMfaServerAuthentication**.
10. Repeat step 3 to update the servers now removed from the AD FS farm and restart the AD FS service on those servers.
11. Add those servers back into the AD FS farm.
