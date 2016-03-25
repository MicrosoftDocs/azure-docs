<properties
   pageTitle="Deploy an ASP.NET container to a remote Docker host | Microsoft Azure"
   description="Learn how to use Visual Studio Tools for Docker to publish an ASP.NET 5 web app to a Docker container running on an Azure Docker Host machine"   
   services="visual-studio-online"
   documentationCenter=".net"
   authors="tomarcher"
   manager="douge"
   editor=""/>

<tags
   ms.service="visual-studio-online"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/25/2016"
   ms.author="tarcher"/>

# Deploy an ASP.NET container to a remote Docker host

## Overview
Docker is a lightweight container engine, similar in some ways to a virtual machine, which you can use to host applications and services. Visual Studio 
supports Docker on Ubuntu, CoreOS, and Windows. This tutorial walks you through using the 
[Visual Studio 2015 Tools for Docker](http://aka.ms/DockerToolsDocs) extension to publish an ASP.NET 5 app to a Docker host on Azure. 

## 1. Prerequisites
The following is needed to complete this tutorial:

- Create an Azure Docker Host VM as described in [How to use docker-machine with Azure](./virtual-machines/virtual-machines-docker-machine.md)
- Install [Visual Studio 2015](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx)
- Install [Visual Studio 2015 Tools for Docker - Preview](https://visualstudiogallery.msdn.microsoft.com/0f5b2caa-ea00-41c8-b8a2-058c7da0b3e4)

## 2. Create an ASP.NET 5 web app

1.  Open Visual Studio 2015.
1.  From the main menu, select **File > New > Project**.
1.  In the **New Project** dialog, select the **Visual C# > Web > ASP.NET Web Application** project type.
1.  Make sure that **.NET Framework 4.5.2** is selected as the target framework.
1.  [Azure Application Insights](./application-insights/app-insights-overview.md) monitors your web app for availability, performance, and usage. 
The **Add Application Insights to Project** check box is selected by default the first time you create a web project after installing Visual Studio. 
Clear the check box if it's selected, but you don't want to try Application Insights.
1.  In the **Name** box, specify the name of the application.
1.  Tap **OK**.

    ![ASP.NET web app settings][0]

1.  In the **New ASP.NET Project** dialog, select the **Web Application** template.
1.  Uncheck the **Host in the cloud** option.
1.  Tap **Change Authentication**.

    ![ASP.NET web app template selection][1]
    
1.  In the **Change Authentication** dialog, click **No Authentication**, and then click **OK**.

    ![Specifying No Authentication for an ASP.NET web app][2]
    
1.  Tap **OK** to create the project.

## 3. Add Docker support

In the Visual Studio **Solution Explorer**, right-click the project and select **Add > Docker Support** from the context menu.

![Add Docker Support context menu][3]

Adding Docker support to an ASP.NET 5 web project results in the addition of several Docker-related
files being added to the project, including Docker-Compose files, deployment Windows PowerShell scripts,  and Docker property files. 

![Docker files added to project][4]

## 4. Point to the remote Docker host

1.  In the Visual Studio **Solution Explorer**, locate the **Properties** folder and expand it.
1.  Open the *Docker.props* file.

    ![Open the Docker.props file][5] 

1.  Change the value of **DockerMachineName** to the name of your remote Docker host. 

    ![Change Docker Machine name][6]

1.  Restart Visual Studio.

## 5. Configure the Azure Docker Host endpoint
Before deploying your application from Visual Studio to Azure, add endpoint 80 to your Docker Host Virtual Machine so you can view your application from the browser later.
This can be done either via the classic Azure portal or via Windows PowerShell: 

- **Use the classic Azure portal to configure the Azure Docker Host endpoint**

    1.  Browse to the [classic Azure Portal](https://manage.windowsazure.com/). 
    
    1.  Tap **VIRTUAL MACHINES**.
    
    1.  Select your Docker Host virtual machine.
    
    1.  Tap the **ENDPOINTS** tab.
    
    1.  Tap **ADD** (at the bottom of the page).
    
    1.  Follow the instructions to expose port 80, which is used by the deployment script by default.

- **Use Windows PowerShell to configure the Azure Docker Host endpoint**

    1. Open Windows PowerShell
    1. Enter the following command at the Windows PowerShell prompt (changing the values in angle brackets to match your environment):  

        ```PowerShell
        C:\PS>Get-AzureVM -ServiceName "<your_cloud_service_name>" -Name "<your_vm_name>" | Add-AzureEndpoint -Name "<endpoint_name>" -Protocol "tcp" -PublicPort 80 -LocalPort 80 | Update-AzureVM
        ```
## 6. Run the app

1.  From the Visual Studio toolbar, select the **Release** configuration

1.  Change the launch target to **Docker**.

1.  Tap the **Docker** icon to run the application.

![Launch application][7]

## 7. Test the app running on Azure

Once the publish process has finished, open the browser of your choice and navigate to your Docker Host Virtual Machine's IP address, specifying a port of 5000. 
You should see results similar to the following.

![View your application][8]

[0]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/create-web-app.png
[1]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/choose-template.png
[2]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/no-authentication.png
[3]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/docker-support-context-menu.png
[4]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/docker-files-added.png
[5]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/docker-props-in-solution-explorer.png
[6]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/change-docker-machine-name.png
[7]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/launch-application.png
[8]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/view-application.png