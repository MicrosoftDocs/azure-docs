<properties 
	pageTitle="How to Use Docker Quickly with Ubuntu-Docker VM Image" 
	description="Describes and demonstrates how to be using Docker on Ubuntu Server in minutes directly from the Azure Image Gallery" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="squillace" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="vm-linux" 
	ms.workload="infrastructure" 
	ms.date="02/02/2015" 
	ms.author="rasquill"/>

<!--The next line, with one pound sign at the beginning, is the page title--> 
# How to Get Started Quickly with Docker in the Azure Marketplace 

The fastest way to get started using [Docker] is to go to the Azure Marketplace and create a VM using the **Docker on Ubuntu Server** image template created by [Canonical] in conjunction with [MSOpenTech]. This creates an Ubuntu Server VM and automatically installs the [Docker VM Extension](virtual-machines-docker-vm-extension.md) along with the **latest** Docker engine pre-installed and running on on Azure.  

You can immediately connect to the VM using SSH and begin doing work with Docker directly without doing anything else. 

> [AZURE.NOTE]The VM created by the Azure Marketplace template does not host the Docker remote API for management by a remote docker client. To enable controlling the Docker Host on this VM remotely, see either [Running Docker with HTTPS](https://docs.docker.com/articles/https/) or follow the steps in [Using the Docker VM Extension from the Azure Portal](virtual-machines-docker-with-portal.md) or [Using the Docker VM Extension from the azure-cli](virtual-machines-docker-with-xplat-cli.md). If you're feeling especially geeky, you can build the [Windows Docker Client](https://github.com/ahmetalpbalkan/Docker.DotNet) from GitHub and try that as well (or just grab it from [nuget](https://www.nuget.org/packages/Docker.DotNet/)). 

In this topic:

- [Log on to the Portal]
- [Create a VM with the Docker Image from Canonical and MSOpenTech]
- [Connect with SSH and Have Fun]

## <a id='logon'>Log on to the Portal</a>

This part is easy, unless you don't have an Azure account. [Get a free one easily, too](http://azure.microsoft.com/pricing/free-trial/)!

## <a id='createvm'>Create a VM with the Docker Image from Canonical and MSOpenTech</a>

1. Now that you're logged on, click **New** in the lower left-hand corner to create a new VM image. You might see the proper image in the banner immediately:

> ![Choose the Docker Ubuntu image in the banner](./media/virtual-machines-docker-ubuntu-quickstart/CreateNewDockerBanner.png)

2. But if not, search for it in the Image Gallery: 

> ![Locate the image in the Image Gallery](./media/virtual-machines-docker-ubuntu-quickstart/DockerOnUbuntuServerMSOpenTech.png)

3. Provide either the username and password for the instance, or a **.pem** file to enable SSH using a certificate. (The below graphic shows specifying a username and password combination.) Then press **Create** at the bottom.

> ![Configure the vm instance](./media/virtual-machines-docker-ubuntu-quickstart/CreateVMDockerUbuntuPwd.png)

4. And wait until it's running. It shouldn't take too long at all.

> ![Docker image running in portal](./media/virtual-machines-docker-ubuntu-quickstart/DockerUbuntuRunning.png)

## <a id='havingfun'>Connect with SSH and Have Fun</a>

Now the fun starts. You can immediately connect to the VM using SSH:

> ![Connecting with SSH](./media/virtual-machines-docker-ubuntu-quickstart/SSHToDockerUbuntu.png)

and start issuing Docker commands, remembering that on this Azure VM the default configuration requires **`sudo`**:

> ![Pulling images](./media/virtual-machines-docker-ubuntu-quickstart/DockerPullSmallImages.png)

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

You're going to want to start using [Docker]! 

<!--Anchors-->
[Log on to the Portal]: #logon
[Create a VM with the Docker Image from Canonical and MSOpenTech]: #createvm
[Connect with SSH and Have Fun]: #havingfun
[Next steps]: #next-steps


[Docker]: https://www.docker.com/
[BusyBox]: http://en.wikipedia.org/wiki/BusyBox
[Docker scratch image]: https://docs.docker.com/articles/baseimages/#creating-a-simple-base-image-using-scratch
[Canonical]: http://www.canonical.com/
[MSOpenTech]: http://msopentech.com/

