<properties
   pageTitle="Troubleshooting Docker Client Errors on Windows Using Visual Studio | Microsoft Azure"
   description="Troubleshoot problems you encounter when using Visual Studio to create and deploy web apps to Docker on Windows by using Visual Studio."
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="04/18/2016"
   ms.author="tarcher" />

# Troubleshooting Visual Studio Docker Development

## Overview
When working with Visual Studio Tools for Docker Preview, you may encounter some problems due to the preview nature. The following are some common issues and resolutions.

##Troubleshooting 

- **Running the app causes PowerShell to open, display an error, and then close. The browser page doesn’t open.**

	This could be an error during `docker-compose-up`. To view the error, perform the following steps:

	1. Open the `Properties\launchSettings.json` file
	
	1. Locate the Docker entry.
	
	1. Locate the line that begins as follows:

			"commandLineArgs": "-ExecutionPolicy RemoteSigned …”
	
	1. Add the `-noexit` parameter so that the line now resembles the following. This will keep PowerShell open so that you can view the error.

			"commandLineArgs": "-noexit -ExecutionPolicy RemoteSigned …”

- **Build : Failed to build the image, Error checking TLS connection: Host is not running**

	Verify the default docker host is running. See the article, [Configure the Docker client](./vs-azure-tools-docker-setup.md).

- **Unable to find volume mapping**

	By default, VirtualBox shares `C:\Users` as `c:/Users`. If the project is not under `c:\Users`, manually add it to the VirtualBox [Shared folders](https://www.virtualbox.org/manual/ch04.html#sharedfolders).

- **Using Microsoft Edge as the default browser**

	If you are using the Microsoft Edge browser, the site might not open as Edge considers the IP address to be unsecured. To remedy this, perform the following steps:
	1. From the Windows Run box, type `Internet Options`.
	2. Tap **Internet Options** when it appears. 
	2. Tap the **Security** tab.
	3. Select the **Local Intranet** zone.
	4. Tap **Sites**. 
	5. Add your virtual machine's IP (in this case, the Docker Host) in the list. 
	6. Refresh the page in Edge, and you should see the site up and running. 
	7. For more information on this issue, visit Scott Hanselman's blog post, [Microsoft Edge can't see or open VirtualBox-hosted local web sites](http://www.hanselman.com/blog/FixedMicrosoftEdgeCantSeeOrOpenVirtualBoxhostedLocalWebSites.aspx). 