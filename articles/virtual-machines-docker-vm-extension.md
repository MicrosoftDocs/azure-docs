<!--<properties title="Using the Docker Virtual Machines Extension for Linux on Azure" pageTitle="Using the Docker VM Extension for Linux on Azure" description="Describes Docker and the Azure Virtual Machines extensions, and shows how to programmatically create Virtual Machines on Azure that are docker hosts from the command line using the azure-cli command interface." metaKeywords="linux, virtual machines, vm, azure, docker, linux containers,  lxc, virtualization" services="virtual-machines, compute" solutions="dev-test" documentationCenter="Infrastructure" authors="rasquill" videoId="" scriptId="" />-->

# How to Use the Docker Virtual Machine Extension for Linux on Azure
[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses [Linux containers](http://en.wikipedia.org/wiki/LXC) rather than virtual machines as a way of isolating data and computing on shared resources. You can use the Docker VM extension to the [Azure Linux Agent](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-agent-user-guide/) to create a Docker VM that hosts any number of containers for your applications on Azure.

This topic follows this [MS Open Tech blog announcement](http://msopentech.com/blog/2014/08/15/getting_started_docker_on_microsoft_azure/) and describes:

+ [Docker and Linux Containers]
+ [How to use the Docker VM Extension with Azure]
+ [Virtual Machine Extensions for Linux and Windows] 
+ [Container and Container Management Resources for Azure]

## Docker and Linux Containers
[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses [Linux containers](http://en.wikipedia.org/wiki/LXC) rather than virtual machines as a way of isolating data and computing on shared resources and provides other services that enable you build or assemble applications quickly and distribute them between other Docker containers.

Docker and Linux containers are not [Hypervisors](http://en.wikipedia.org/wiki/Hypervisor) such as Windows Hyper-V and [KVM](http://www.linux-kvm.org/page/Main_Page) on Linux (there are many other examples). Hypervisors virtualize the underlying operating system to enable complete operating systems to run inside the hypervisor as if they were an application. 

The hypervisor approach provides important security advantages because the "guest" virtual machine does not have any access to the "host" operating system; instead, it may only use the resources of the hypervisor. The disadvantages, however, include larger processing and storage overhead as well as a relatively slower start-up time for new virtual machines because -- among other things -- they replicate the guest operating systems completely. 

#### Docker and Linux Containers

Docker and other *container* approaches have radically decreased both the start-up time consumed and processing and storage overhead required by using the process and file system isolation features of the Linux kernel to expose only kernel features to an otherwise isolated container. From inside the container, the file system and kernel features appear to the application as if it were the only application running. 

In addition, Docker provides several container management features that enable you to load various container images from the community as well as build and load your own, which is For completely information about what Docker is and how it really works, see [What is Docker?](https://www.docker.com/whatisdocker/).

Like most technologies, there substantial upsides and some disadvantages. Because containers do share access to the host computer's kernel, if malicious code is able to gain root it may also be able to gain access not only to the host computer but also the other containers. To secure your container system more strongly, [Docker recommends](https://docs.docker.com/articles/security/) using addition group-policy or [role-based security](http://en.wikipedia.org/wiki/Role-based_access_control) as well, such as [SELinux](http://selinuxproject.org/page/Main_Page) or [AppArmor](http://wiki.apparmor.net/index.php/Main_Page), for example, as well as reducing as much as possible the kernel capabilities that the containers are granted. In addition, there are many other documents on the Internet that describe approaches to security using containers like Docker.

## How to use the Docker VM Extension with Azure
To use the Docker VM extension with Azure, you must install a version of the [azure-cli](https://github.com/Azure/azure-sdk-tools-xplat) higher than 0.8.6 (as of this writing the current version is 0.8.7). You can install the azure-cli on Windows, Mac, and Linux. The complete process to use Docker on Azure is simple:

+ Install the azure-cli command line tools and its dependencies on the computer from which you want to control Azure
+ Use the azure-cli Docker commands to create a VM Docker host in Azure
+ Use the local Docker commands to manage your Docker containers in your Docker VM in Azure.

> [WACOM.NOTE] The azure-cli (command line interface) is currently the only way to create a Docker-controlled VM on Azure to host Docker containers. The general installation document is [here](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#install); the sections below offer some extra suggestions to installing smoothly on various operating systems. 

### Install the azure-cli on Linux
On Linux, the azure-cli installation requires the [node package manager (npm)](http://en.wikipedia.org/wiki/Npm_%28software%29), which requires nodejs, so you're going to use your favorite package manager to install nodejs, depending upon your platform choice. If you have npm installed, to obtain the azure-cli package you type:

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

You have installed the azure-cli prompt on your computer, connected it to your Azure account, and have installed Docker. To create a new Docker host VM in Azure requires a Linux VM image that has the [Azure Linux VM Agent](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-agent-user-guide/) installed. Currently, the only images that have this installed already are either

+ an Ubuntu image from the image gallery or 

+ a custom Linux image that you have created with the Azure Linux VM Agent installed and configured; see [Azure Linux VM Agent](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-agent-user-guide/) for more information about how to build your own custom linux VM with the Azure VM Agent.

With the azure-cli command prompt locate the most recent Ubuntu image in the VM gallery to use by typing

`azure vm image list | grep Ubuntu-14_04`

and be ready to copy the name of one of the most recent images listed. At the command prompt, type

```
azure vm docker create -e 22 -l "West US" <vm-cloudservice name> "b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_10-amd64-server-20140729-alpha2-en-us-30GB" <username> <password>
``` 

where:

+ *<vm-cloudservice name>* is the name of the VM that will become the Docker container host computer in Azure

+  *<username>* is the username of the default root user of the VM

+ *<password>* is the password of the *username* account that meets the standards of complexity for Azure 
 
> [WACOM.NOTE] Currently, a password must be at least 8 characters, contain one lower case and one upper case character, a number, and a special character such as !@#$%^&+=. No, the period at the end of the preceding sentence is NOT a special character.

If the command was successful, you should see something like the following, depending on the precise arguments and options you used:

![](./media/virtual-machines-docker/dockercreateresults.png)

> [WACOM.NOTE] As mentioned before, creating a virtual machine can take a few minutes, but after it has been provisioned the Docker daemon starts and you can connect to the Docker container host.

To test the Docker VM you have created in Azure, type

`docker --tls -H tcp://<vm-name-you-used>.cloudapp.net:4243 info`

where *<vm-name-you-used>* is the name of the virtual machine that you used in your call to `azure vm docker create`. Again, depending upon the specific arguments and options you specified, you should see something like the following response, which indicates that your Docker Host VM is up and running in Azure and waiting for your commands.

![](./media/virtual-machines-docker/connectingtodockerhost.png)

## A Note about Docker Host VM Authentication
In addition to creating the Docker VM, the `azure vm docker create`  command also automatically creates the necessary certificates to allow your Docker client computer to connect to the host using HTTPS, and the certificates are stored on both the client and host machines, as appropriate. On subsequent runs, the existing certificates are reused and shared with the new host.

By default, certificates are placed in `~/.docker`, and Docker will be configured to run on port **4243**. If you would like to use a different port or directory, then you may use one of the following `azure vm docker create` command line options to configure your Docker container host VM to use a different port or different certificates for connecting clients:

`-dp, --docker-port [port]        Port to use for docker [4243]`

`-dc, --docker-cert-dir [dir]     Directory containing docker certs`

The Docker daemon on the host is configured to listen for, and authenticate, client connections on the specified port using the certificates generated above. The client machine must have these certificates to gain access to the Docker host. Conversely, a networked host running without these certificates will be vulnerable to anyone that can to connect to the machine.

## Virtual Machine Extensions for Linux and Windows
The Docker VM extension for Azure is just one of several VM extension that provide special behavior, and more are in development. For a complete list, see [Azure VM Extensions](http://msdn.microsoft.com/en-us/library/azure/dn606311.aspx).

<!--Anchors-->
[Docker and Linux Containers]: #Docker-and-Linux-Containers
[How to use the Docker VM Extension with Azure]: #How-to-use-the-Docker-VM-Extension-with-Azure
[Virtual Machine Extensions for Linux and Windows]: #Virtual-Machine-Extensions-For-Linux-and-Windows
[Container and Container Management Resources for Azure]: #Container-and-Container-Management-Resources-for-Azure