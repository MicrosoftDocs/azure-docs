---
title: Azure Virtual Desktop Remote Desktop client Intune Configuration Manager - Azure
description: How to set up the Azure Virtual Desktop client with InTune or Configuration Manager. (placeholder)
author: Heidilohr
ms.topic: how-to
ms.date: 03/22/2023
ms.author: helohr
manager: femila
---
# Install the Remote Desktop client on a per-user basis

Intro text briefly explaining what this feature is and why it's important.

## Prerequisites

Intro text.

- Requirements
- you must fulfill
- before performing this setup
- go here

## Install the Remote Desktop client

You can install the Remote Desktop client on either a per-system or per-user basis. Installing it on a per-system basis installs the client on the virtual machines of all users by default, and updates are controlled by the admin. Per-user installation gives users the choice of whether they want to install the client themselves and also gives them control over when to apply updates.

<!---Why would users want to install it on a per-user basis instead of a per-system basis?--->

To install the client on a per-user basis:

#### InTune (#tabs/intune)

Create a new folder containing the Remote Desktop client and an install.bat batch file with the following content 

```batch
cd "%~dp0"

msiexec /i RemoteDesktop_x64.msi /qn ALLUSERS=2 MSIINSTALLPERUSER=1
```
<!--create the folder where?--->

Note: The RemoteDesktop_x64.msi installer name should match the MSI contained in the folder.  

Use the Microsoft Win32 Content Prep Tool to convert the folder into an .intunewin file ready to deploy to your clients.  

In the Microsoft Intune admin center, go to Apps > All apps and select Add. 

Select Windows app (Win32) as the app type. Upload the .intunewin file prepared earlier, and complete the desired App information such as Description and Publisher.

<!---upload it where?-->

In the Program tab, select the install.bat file as the installer, and use the MSI product code for the Uninstall command.  

For Install behaviour, ensure that User is selected. 

<!---image--->

In the Detection rules tab, use the MSI product code for detection and complete the wizard with any further required configuration.  

You can now deploy this app to users or devices, and the Remote Desktop client should be installed per-user on the system.  

<!--How do I deploy it? Why?-->

#### Configuration Manager (#tabs/configmanager)

Create a new folder in your package share containing the Remote Desktop client  and an install.bat batch file with the following content 

<!--What is a package share? Where is it?--->

```batch
msiexec /i RemoteDesktop_x64.msi /qn ALLUSERS=2 MSIINSTALLPERUSER=1 
```

Note: The RemoteDesktop_x64.msi installer name should match the MSI contained in the folder.  

In Configuration Manager, go to Software Library > Application Management > Applications  

Create a new application, and set the settings to Manually specify the application information 

<!--image-->

Complete the General Information and Software Center settings with those appropriate for your organization.  

In the Deployment Types tab, click Add to create a new deployment type.  

Select Script Installer as the type, and select Next.  

Provide the content location to the folder created previously, then enter the install.bat file as the installation program. Use the MSI product ID as the uninstall program.

<!--image-->

Use the same MSI product ID for the detection method  

<!--image-->

In the User Experience step, ensure the installation behaviour is configured as Install for user. This is required for the per-user app install to occur correctly.  

Now complete the wizard with additional desired settings, distribute and deploy the application to your user or computer collections.

<!---Which setting? How do you distribute/deploy?--->

---

## Next steps