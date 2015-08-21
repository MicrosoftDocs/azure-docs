<properties
   pageTitle="Hosting Web Apps in Docker | Microsoft Azure"
   description="Learn how to use Visual Studio to host a web app in a Docker container."
   services="visual-studio-online"
   documentationCenter="na"
   authors="kempb"
   manager="douge"
   editor="tglee" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="08/20/2015"
   ms.author="kempb" />

# Hosting Web Apps in Docker

[Docker](https://www.docker.com/whatisdocker/) is a lightweight container engine, similar in some ways to a virtual machine, which you can use to host applications and services. Visual Studio supports Docker on Ubuntu, CoreOS, and Windows.

This example shows you how to use the Visual Studio 2015 Tools for Docker extension to publish an ASP.NET 5 app to an Ubuntu Linux virtual machine (referred to here as a Docker host) on Azure with the Docker extension installed, along with an ASP.NET 5 web application. The same experience can be used to publish to a Windows container.

You can publish the app to a new Docker host hosted on Azure, or to an on-premise server, Hyper-V, or Boot2Docker host by using the **Custom Host** setting. After publishing your app to a Docker host, you can use Docker command-line tools to interact with the container your app has been published to.

## Create and publish a new Docker container

In these procedures, you'll create a new ASP.NET 5 web application project, create container host, then build and run the web app project in the Docker container. To get started, download and install the [Visual Studio 2015 Tools for Docker](https://aka.ms/DockerToolsForVS).

### Add an ASP.NET 5 web application project

1. Create a new ASP.NET web application project. On the main menu, choose **File**, **New Project**. Under **C#**, **Web**, choose **ASP.NET Web Application**.

1. In the list of **ASP.NET 5 Preview Templates**, choose **Web Site**.

1. Since the web app will be hosted/run in Docker, clear the **Host in the cloud** checkbox if it's selected and then choose the **OK** button.

  ![][0]

  This is the point where you'd typically add code to the web app to make it do something useful, but for this example, let's just leave it at its default settings. (Note that you can also choose to use existing ASP.NET 5 web apps.)

### Publish the project

1. On the ASP.NET project's context menu, choose **Publish**.

1. In the **Select a publish target** section of the **Publish Web** dialog box, choose the **Docker Containers** button.

    If you don't see a Docker Containers option, make sure you have installed the Visual Studio 2015 Tools for Docker and that you selected an ASP.NET 5 Web Site template in the previous procedure.

    ![][1]

    The **Select Docker Virtual Machine** dialog box appears. This lets you specify the Docker host in which you want to publish the project. You can create a new Docker host or choose an existing VM hosted on Azure or elsewhere. Later in this example, we'll create a new Azure Docker host.

1. If you're already logged into an Azure account, skip to step 5. If you're not logged into an account, choose the **Add an account** button.

    ![][2]

1. In the **Sign in to Visual Studio** dialog box, enter the email account for your Azure subscription and then choose the **Continue** button.

1. Choose the **New** button to create a new Azure Docker VM and then choose the **OK** button.

    ![][3]

    Note that you also have the choice of using an existing Docker host. To do this, choose it in the **Existing Azure Docker Virtual Machines** dropdown list rather than choose the **New** button. This list doesn't show only container hosts, it lists all of the VMs in your Azure tenant.

    As an alternative, you can choose to publish to a custom Docker host. See **Provide a custom Docker host** later in this topic for more information.

1. Enter the following information in the **Create a virtual machine on Microsoft Azure** dialog box. When you're done, choose the **OK** button. This creates a Linux virtual machine with a configured Docker extension.

    ![][4]

    Note that you also now have the option of creating a Windows Container HOST using Windows Server 2016 Technical Preview 3 (TP3).

    ![][8]

    |Property Name|Setting|
    |---|---|
    |Location|Change this setting to the region closest to your locale.|
    |DNS Name|Enter a unique name for the virtual machine. If the name is accepted by Azure, a green circle with a white checkmark appears to the right. If the name isn't accepted, a red circle with a white x appears. In that case, enter a new unique name.|
    |Image|Choose an OS image to use in the Docker host, if any. For this example, choose an Ubuntu Server image. (Note that a Windows Server image is now available in the list of available images.)|
    |Username|Enter a unique user name for the virtual machine.|
    |Passwords|Enter a password for the user and then confirm it.|
    |Certificates directory |This specifies the folder where your Docker certificates are stored. While you can create a new folder or point to an existing folder, it's recommended that you use the default certificates folder (C:\\Users\\[*username*]\\.docker). Otherwise, the Auth options can't be automatically retrieved if you reuse the same host on another project or system.|

1. Choose the ellipsis (...) button next to the **Certificates directory** entry and then either create new folder for Docker certificates, or navigate to an existing Docker certificates folder.

    If the Docker certificates needed for the VM aren't found, an exclamation icon appears next to the entry, letting you know that the required certificates weren't found, and that continuing will delete and then recreate any existing certificates.

1. Choose the **OK** button to begin creating the VM. You'll get a message that the virtual machine is being created in Azure.

    Visual Studio creates an Azure Resource Manager (ARM) template file, parameters file, and a PowerShell script so you can execute the commands again in the future.

    ![][7]

    Visual Studio outputs the progress of the operation to the **Output** window. Visual Studio calls a PowerShell script to deploy the VM. The script uses Azure PowerShell cmdlets to deploy Azure Resource Group. Later, another PowerShell script uses issues Docker commands to publish, just as you would if you were creating the Docker host manually.

    Provisioning the Docker host can take a while, so check the status in the Output window to see when the job completes.

1. After the Docker host is fully provisioned in Azure, you can check your account on the Azure portal. You should be able to see the new virtual machine under the **Virtual Machine** category on the Azure portal.

1. Once the Docker host is ready, go back and publish the web app project. On the context menu for the web application project's node in **Solution Explorer**, choose **Publish**. Visual Studio creates a publish file based on the VM you created.

1. On the **Connection** tab in the **Publish Web** dialog box, choose the **Validate Connection** box to make sure the Docker host is ready. If the connection is good, choose the **Publish** button to publish the web app.

    The first time you publish an app to a Docker host, it will take time to download any of the base images that are referenced in your Docker file (such as **FROM** *imagename*).

    Note that the Docker file is specific to the operating system. If you choose to republish to a different OS, you'll need to rename the Docker file so that Visual Studio can create a new default based on the target OS. For instance, if you first publish to a Linux container and later decide to publish to Windows, you should rename the Docker file to a unique name, such as DockerLinux. Then, when you republish to Windows, Visual studio will recreate the default Docker file for Windows. Later, when you republish either one, just select the appropriate Docker file for the OS.

## Provide a custom Docker host

The previous procedure had you create a Docker virtual machine hosted on Azure. However, if you already have an existing Docker host elsewhere, you can choose to publish to it instead of Azure.

### How to provide a custom Docker host

1. In the **Select Docker Virtual Machine** dialog box, select the **Custom Docker Host** check box.

    ![][5]

1. Choose the **OK** button.

1. In the **Publish Web** dialog box, add values to the settings in the **CustomDockerHost** section, such as: the server URL, image name, Dockerfile location, and host and container port numbers.

    In the **Docker Advanced Options** section, you can view or change the Auth and Run options as well as the Docker command line.

    ![][6]

1. After you've entered all the required values, choose the **Validate Connection** button to ensure the connection to the Docker host works properly.

1. If the connection works properly, you can choose the **Next** button to see a list of the components that will be published, or you can choose the **Publish** button to immediately publish the project.

## Test the Docker host

Now that the project has been published to a Docker host on Azure, you can test it by checking its settings. Because the Docker command line tools install with the Visual Studio extension, you can issue commands to Docker directly from a Windows command prompt.

The procedure below is for communicating with a Docker host that's been deployed to Azure.

### How to test the Docker host

1. Open a Windows command prompt.

1. Assign the Docker host and verify to environment variables. To do this, enter the following commands in the command prompt. (Substitute the name of your Docker host for *NameofAzureVM*.)

    ```
    Set DOCKER_HOST=tcp://<NameofAzureVM>.cloudapp.net:2376
    Set DOCKER_TLS_VERIFY=1
    ```

    Invoking these commands prevents you from having to add `–H (Host) tcp://<NameofAzureVM>.cloudapp.net:2376` and `--TLSVERIFY` to every command you issue.

1. Now you can issue commands like these to test whether the Docker host is present and functioning. 

    |Command line|Description|
    |---|---|
    |`docker info`|Get Docker version info.|
    |`docker ps`|Get a list of running containers.|
    |`docker ps –a`|Get a list of containers, including ones that are stopped.|
    |`docker logs <Docker container name>`|Get a log for the specified container.|
    |`docker images`|Get a list of images.|

    For a full list of Docker commands, just enter the command `docker` in the command prompt. For more information, see [Docker Command Line](https://docs.docker.com/reference/commandline/cli/).

## Next steps

Now that you have a Docker host, you can issue Docker commands to it. To learn more about Docker, see the [Docker documentation](https://docs.docker.com/) and the [Docker online tutorial](https://www.docker.com/tryit/).

To learn about using the Docker VM extension for Linux on Azure, see [The Docker Virtual Machine Extension for Linux on Azure](virtual-machines-docker-vm-extension.md).

For issues with using Docker in Visual Studio, see [Troubleshooting Docker Client Errors on Windows Using Visual Studio](vs-azure-tools-docker-troubleshooting-docker-errors.md).

[0]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796678.png
[1]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796679.png
[2]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796680.png
[3]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796681.png
[4]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796682.png
[5]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796683.png
[6]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796684.png
[7]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796685.png
[8]: ./media/vs-azure-tools-docker-hosting-web-apps-in-docker/IC796686.png
