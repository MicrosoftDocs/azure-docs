<!--<properties title="Using the Docker Virtual Machines Extension for Linux on Azure" pageTitle="Using the Docker VM Extension for Linux on Azure" description="Describes Docker and the Azure Virtual Machines extensions, and shows how to programmatically create Virtual Machines on Azure that are docker hosts from the command line using the azure-cli command interface." metaKeywords="linux, virtual machines, vm, azure, docker, linux containers,  lxc, virtualization" services="virtual-machines, compute" solutions="dev-test" documentationCenter="Infrastructure" authors="rasquill" videoId="" scriptId="" />-->

# Using the Docker Virtual Machine Extension for Linux on Azure
[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses [Linux containers](http://en.wikipedia.org/wiki/LXC) rather than virtual machines as a way of isolating data and computing on shared resources. You can use the Docker VM extension to the [Azure Linux Agent](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-agent-user-guide/) to create a Docker VM that hosts any number of containers for your applications on Azure.

This topic follows this [MS Open Tech blog announcement](http://msopentech.com/blog/2014/08/15/getting_started_docker_on_microsoft_azure/) and describes:

+ [Docker and Linux Containers]
+ [How to use the Docker VM Extension with Azure]
+ [Virtual Machine Extensions for Linux and Windows] 
+ [Container and Container Management Resources for Azure]

## Docker and Linux Containers
[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses [Linux containers](http://en.wikipedia.org/wiki/LXC) rather than virtual machines as a way of isolating data and computing on shared resources and provides other services that enable you build or assemble applications quickly and distribute them between other Docker containers.

Docker and Linux containers are not [Hypervisors](http://en.wikipedia.org/wiki/Hypervisor) such as Windows Hyper-V and [KVM](http://www.linux-kvm.org/page/Main_Page) on Linux (there are many other examples). Hypervisors virtualize the underlying operating system to enable complete operating systems to run inside the hypervisor as if they were an application. 

This approach provides important security advantages because the "guest" virtual machine does not have any access to the "host" operating system; instead, it may only use the resources of the hypervisor. The disadvantages, however, include larger processing and storage overhead as well as a relatively slower start-up time for new virtual machines because -- among other things -- they replicate the guest operating systems completely. 

#### Docker and Linux Containers

Docker and other *container* approaches have radically decreased both the start-up time consumed and processing and storage overhead required by using the process and file system isolation features of the Linux kernel to expose only kernel features to an otherwise isolated container. From inside the container, the file system and kernel features appear to the application as if it were the only application running. 

In addition, Docker provides several container management features that enable you to load various container images from the community as well as build and load your own. For completely information about what Docker is and how it really works, see [What is Docker?](https://www.docker.com/whatisdocker/).

## How to use the Docker VM Extension with Azure
To use the Docker VM extension with Azure, you must install a version of the [azure-cli](https://github.com/Azure/azure-sdk-tools-xplat) higher than 0.8.6 (as of this writing the current version is 0.8.7). You can install the azure-cli on Windows, Mac, and Linux. The complete process to use Docker on Azure is simple:

+ Install the azure-cli command line tools and its dependencies on the computer from which you want to control Azure
+ Use the azure-cli Docker commands to create a VM Docker host in Azure
+ Use the local Docker commands to manage your Docker containers in your Docker VM in Azure.

> [WACOM.NOTE] The azure-cli (command line interface) is currently the only way to create a Docker-controlled VM on Azure to host Docker containers. The general installation document is [here](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#install); the sections below offer some extra suggestions to installing smoothly on various operating systems. 

### Install the azure-cli on Linux
On Linux, the azure-cli installation requires the [node package manager (npm)](http://en.wikipedia.org/wiki/Npm_%28software%29), which requires nodejs, so you're going to use your favorite package manager to install nodejs, depending upon your platform choice. If you have npm installed, to obtain Docker you type:

```
npm install -g azure-cli
```

which will install the azure-cli package globally. To confirm the installation, type `azure` at the command prompt and after a short moment you should see the azure-cli ASCII art, which lists the basic commands available to you. If the installation worked correctly, you should be able to type `azure help vm` and see that one of the listed commands is "docker".

> [WACOM.NOTE] If you are using an Ubuntu 14.04 LTS installation, that image has a slightly different node installation that may require some extra work. One suggestion that seems to work well is located [here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server) in the **How To Install Using a PPA** section, which describes how to install the most recent version of nodejs directly and seems to work well on an Ubuntu 14.04 LTS distribution. 

Alternatively, like most Linux components, you can clone the source, compile it, and install it locally as well. The instructions for that 

### Install the azure-cli on Mac
On a Mac, the easiest way of installing the azure-cli is also to use npm with the same command: `npm install -g azure-cli`. However, you may also use the [Mac installer](http://go.microsoft.com/fwlink/?linkid=252249&clcid=0x409). As with Linux and Windows, you can then type `azure` at the associated command prompt and confirm that the azure-cli is installed.

### Install the azure-cli on Windows
On Windows, the easiest way of installing the azure-cli is to go to [http://nodejs.org/](http://nodejs.org/) and install nodejs and then open the node command prompt and type `npm install -g azure-cli`. As with Linux and Mac, you can then type `azure` at the associated command prompt and confirm that the azure-cli is installed.

### Connect the azure-cli to to your Azure Account
Before you can use the azure-cli you must associate your Azure account credentials with the azure-cli on your platform. The section [How to connect to your Azure subscription](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#configure) explains how to download and import your **.publishsettings** file or associate your azure-cli command-line with an organizational id. The steps for both methods of authentication and authorization are described in the above document. 

> [WACOM.NOTE] There are some differences in behavior when using one or the other methods of authorization, so do be sure to read the document above to understand the different functionality. 

### Install Docker and use the Docker VM Extension for Azure
You now have a computer with the azure-cli installed and connected to your Azure account. Follow the [Docker installation instructions](https://docs.docker.com/installation/#installation) to install Docker locally on your computer. 

+ For most operating systems and distributions, this means typing `apt-get install docker.io`. Confirm that the Docker version is at 1.0 or greater.
+ For Microsoft Windows, install Docker using the [Docker Windows Setup application](https://docs.docker.com/installation/windows/). Because Docker relies on certain Linux kernel features, this setup application must install a VM and linux environment for Docker to run properly on Windows, so you may want to review the [installation details first](https://github.com/boot2docker/windows-installer/releases).

You have installed the azure-cli prompt on your computer, connected it to your Azure account, and have installed Docker. To create a new Docker host VM in Azure requires the following items:

1. A Linux VM image that has the [Azure Linux VM Agent](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-agent-user-guide/) installed. Currently, the only images that have this installed already are either an Ubuntu image from the image gallery or a custom Linux image that you have created with the Azure Linux VM Agent installed and configured.
2. 

## Virtual Machine Extensions for Linux and Windows
mention how docker is just one of several extensions, with more coming all the time.

## Container and Container Management Resources for Azure
more stuff about not just docker, but container **management** on azure.
