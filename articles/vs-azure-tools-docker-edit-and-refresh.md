<properties
   pageTitle="Modify a live ASP.NET 5 Web Application running in a local Docker container using Edit and Refresh | Microsoft Azure"
   description="Learn how to modify an app that is running in a local Docker container and refresh the container via Edit and Refresh"
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
   ms.date="02/17/2016"
   ms.author="tarcher" />

# Modify a live ASP.NET 5 Web Application running in a local Docker container using Edit and Refresh

## Overview
The Visual Studio Tools for Docker provides a convenient way to develop and test your application locally in a Docker container without having to restart the container each time you make a code change. This article will illustrate how to use the "Edit and Refresh" feature to start an ASP.NET 5 Web app in a local Docker container, make any necessary changes, and then refresh the browser to see those changes. 

## Prerequisites
The following tools need to be installed.

- [Visual Studio 2015 Update 1](https://go.microsoft.com/fwlink/?LinkId=691979)
- [Microsoft ASP .NET and Web Tools 2015 RC](https://go.microsoft.com/fwlink/?LinkId=627627)
- [Docker Toolbox](https://www.docker.com/products/overview#/docker_toolbox)
- [Visual Studio 2015 Tools for Docker](https://aka.ms/DockerToolsForVS)

> [AZURE.NOTE] If you have a previous version of the Visual Studio 2015 Tools for Docker installed, you'll need to uninstall it from the Control Panel prior to installing the latest version.

## Configuring and testing the Docker client 
This section will guide you through making sure that the default instance of Docker machine is configured and running. 

1. Create a default docker host instance by issuing the following command at a command prompt.

		docker-machine create --driver virtualbox default
 
1. Verify the default instance is configured and running by issuing the following command at the command prompt. (You should see an instance named `default' running.

		docker-machine ls 
		
	![][0]
 
1. Set default as the current host by issuing the following command at the command prompt.

		docker-machine env default

1. Issue the following command to configure your shell.

		FOR /f "tokens=*" %i IN ('docker-machine env default') DO %i

1. The following command should display an empty response of active containers running.

		docker ps

	![][1]
 
> [AZURE.NOTE] Each time you reboot your development machine, you’ll need to restart your local docker host. To do this, issue the following command at a command prompt: `docker-machine start default`

## Editing an app running in a local Docker container
Visual Studio 2015 Tools for Docker enables ASP .NET 5 Web app developers to test and run their application in a Docker container, make changes to the application in Visual Studio and refresh the browser to see changes applied to the app running inside of the container. 

1. From the Visual Studio menu, select **File > New > Project**. 

1. Under the **Templates** section of the **New Project** dialog box, select **Visual C# > Web**.

1. Select **ASP.NET Web Application**.

1. Give your new application a name (or take the default).

1. Tap **OK**.  

1. Under **ASP.NET 5 Templates**, select **ASP.NET Web Application**.

1. Tap **OK**.

1. From the Visual Studio Solution Explorer, right-click the project and select **Add > Docker Support**.

	![][2]
 
1. The following files are created under the project node:

	![][3]

1. Set the Solution Configuration to `Debug` and press **&lt;F5>** to start testing your application locally.

1. Once the container image has been built and is running in a Docker container, a PowerShell console will try to launch the Web app in your default browser. If you are using the Microsoft Edge browser, see the [Troubleshooting](#troubleshooting) section.

1. Return to Visual Studio and open `Views\Home\Index.cshtml`. 

1. Append the following HTML content to the end of the file and save the changes

		<div>
			<h1>Hello from Docker Container!</h1>
		</div>

1.	Switch back to your browser and refresh it.

1.	Scroll to the end of the home page and you should see changes have been applied! Note that it can take a few seconds for the site to recompile, so if you are not seeing your changes reflected immediately, simply refresh the browser again.

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

	Verify the default docker host is running. See the [Configuring the Docker client](#configuring-the-docker-client) section.

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

[0]: ./media/vs-azure-tools-docker-edit-and-refresh/docker-machine-ls.png
[1]: ./media/vs-azure-tools-docker-edit-and-refresh/docker-ps.png
[2]: ./media/vs-azure-tools-docker-edit-and-refresh/add-docker-support.png
[3]: ./media/vs-azure-tools-docker-edit-and-refresh/docker-files-added.png
