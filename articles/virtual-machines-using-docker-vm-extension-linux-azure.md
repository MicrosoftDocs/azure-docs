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

### Installing azure-cli on Linux
On Linux, the azure-cli installation requires the [node package manager (npm)](http://en.wikipedia.org/wiki/Npm_%28software%29), which requires node, so you're going to use your favorite package manager to install nodejs, depending upon your platform choice. If you have npm installed, to obtain Docker you type:

```
npm install -g azure-cli
```

which will install the azure-cli package globally. To confirm the installation, type `azure` at the command prompt and after a short moment you should see the azure-cli ASCII art, which lists the basic commands available to you. If the installation worked correctly, you should be able to type `azure help vm` and see that one of the listed commands is "docker".

> [WACOM.NOTE] If you are using an Ubuntu 14.04 LTS installation, that image has a slightly different node installation that may require some extra work. One suggestion that seems to work well is located [here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server) in the **How To Install Using a PPA** section, which describes how to install the most recent version of nodejs directly and seems to work well on an Ubuntu 14.04 LTS distribution. 

### Installing azure-cli on Mac


### Installing azure-cli on Windows
lskdjflskj

### Using the azure-cli with Docker
To use Docker you must install a version of node with npm

## Virtual Machine Extensions for Linux and Windows
mention how docker is just one of several extensions, with more coming all the time.

## Container and Container Management Resources for Azure
more stuff about not just docker, but container **management** on azure.
