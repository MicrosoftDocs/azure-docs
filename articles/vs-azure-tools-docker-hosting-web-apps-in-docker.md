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
   ms.date="03/26/2016"
   ms.author="tarcher"/>

# Deploy an ASP.NET container to a remote Docker host

## Overview
Docker is a lightweight container engine, similar in some ways to a virtual machine, which you can use to host applications and services. Visual Studio 
supports Docker on Ubuntu, CoreOS, and Windows. This tutorial walks you through using the 
[Visual Studio 2015 Tools for Docker](http://aka.ms/DockerToolsForVS) extension to publish an ASP.NET 5 app to a Docker host on Azure. 

## 1. Prerequisites
The following is needed to complete this tutorial:

- Create an Azure Docker Host VM as described in [How to use docker-machine with Azure](./virtual-machines/virtual-machines-linux-classic-docker-machine.md)
- Install [Visual Studio 2015](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx)
- Install [Visual Studio 2015 Tools for Docker - Preview](http://aka.ms/DockerToolsForVS)

## 2. Create an ASP.NET 5 web app
The following steps will guide you through creating a basic ASP.NET 5 app that will be used in this tutorial.

[AZURE.INCLUDE [create-aspnet5-app](../includes/create-aspnet5-app.md)]

## 3. Add Docker support

[AZURE.INCLUDE [create-aspnet5-app](../includes/vs-azure-tools-docker-add-docker-support.md)]

## 4. Point to the remote Docker host

1.  In the Visual Studio **Solution Explorer**, locate the **Properties** folder and expand it.
1.  Open the *Docker.props* file.

    ![Open the Docker.props file][0] 

1.  Change the value of **DockerMachineName** to the name of your remote Docker host. If you do not know the name of your remote Docker host, 
run ```docker-machine ls``` at the Windows PowerShell prompt. Use the value listed under the **Name** column for the desired host. 

    ![Change Docker Machine name][1]

1.  Restart Visual Studio.

## 5. Configure the Azure Docker Host endpoint
Before deploying your app from Visual Studio to Azure, add endpoint 80 to your Docker Host Virtual Machine so you can view your app from the browser later.
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

## 6. Build and run the app
When deploying to remote hosts, the volume mapping feature used for Edit & Refresh development will not function. 
Therefore, you'll need to use the *release configuration* when building your app to avoid the volume mapping configuration.  
Follow these steps to run your app.

1.  From the Visual Studio toolbar, select the **Release** configuration

1.  Change the launch target to **Docker**.

1.  Tap the **Docker** icon to build and run the app.

![Launch app][2]

You should see results similar to the following.

![View your app][3]

[0]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/docker-props-in-solution-explorer.png
[1]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/change-docker-machine-name.png
[2]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/launch-application.png
[3]:./media/vs-azure-tools-docker-hosting-web-apps-in-docker/view-application.png