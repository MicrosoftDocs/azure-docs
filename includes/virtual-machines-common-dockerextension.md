

[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses [Linux containers](http://en.wikipedia.org/wiki/LXC) rather than virtual machines as a way of isolating application data and computing on shared resources. You can use the [Azure Docker VM extension](https://github.com/Azure/azure-docker-extension/blob/master/README.md) to the [Azure Linux Agent](../articles/virtual-machines/virtual-machines-linux-agent-user-guide.md) to create a Docker VM that hosts any number of containers for your applications on Azure.

This topic describes:

+ [Docker and Linux Containers]
+ [How to use the Docker VM Extension with Azure]
+ [Virtual Machine Extensions for Linux and Windows]

To create Docker-enabled VMs right now, see:

+ [How to use the Docker VM Extension from the Azure Command-line Interface (Azure CLI)]
+ [How to use the Docker VM Extension with the Azure classic portal]
+ [How to Get Started Quickly with Docker in the Azure Marketplace]

To learn more about the extension and how it works, see the [Docker Extension User Guide](https://github.com/Azure/azure-docker-extension/blob/master/README.md).

## Docker and Linux Containers
[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses [Linux containers](http://en.wikipedia.org/wiki/LXC) rather than virtual machines as a way of isolating data and computing on shared resources and provides other services that enable you to build or assemble applications quickly and distribute them between other Docker containers.

Docker and Linux containers are not [Hypervisors](http://en.wikipedia.org/wiki/Hypervisor) such as Windows Hyper-V and [KVM](http://www.linux-kvm.org/page/Main_Page) on Linux (there are many other examples). Hypervisors virtualize the underlying operating system to enable complete operating systems (called *virtual machines*) to run inside the hypervisor as if they were an application.

Docker and other *container* approaches have radically decreased both the start-up time consumed and processing and storage overhead required by using the process and file system isolation features of the Linux kernel to expose only kernel features to an otherwise isolated container.

The following table describes at a very high level the kind of feature differences that exist between hypervisors and Linux containers. Note that some features maybe more or less desirable depending upon your own application needs.

|   Feature      | Hypervisors | Containers  |
| :------------- |-------------| ----------- |
| Process Isolation | More or less complete | If root is obtained, container host could be compromised |
| Memory on disk required | Complete OS plus apps | App requirements only |
| Time taken to start up | Substantially Longer: Boot of OS plus app loading | Substantially shorter: Only apps need to start because kernel is already running  |
| Container Automation | Varies widely depending on OS and apps | [Docker image gallery](https://registry.hub.docker.com/); others

To see a high-level discussion of containers and their advantages, see the [Docker High Level Whiteboard](http://channel9.msdn.com/Blogs/Regular-IT-Guy/Docker-High-Level-Whiteboard).

For more information about what Docker is and how it really works, see [What is Docker?](https://www.docker.com/whatisdocker/)

#### Docker and Linux Container Security Best Practices

Because containers do share access to the host computer's kernel, if malicious code is able to gain root it may also be able to gain access not only to the host computer but also the other containers. To secure your container system more strongly than the default configuration, [Docker recommends](https://docs.docker.com/articles/security/) using addition group-policy or [role-based security](http://en.wikipedia.org/wiki/Role-based_access_control) as well, such as [SELinux](http://selinuxproject.org/page/Main_Page) or [AppArmor](http://wiki.apparmor.net/index.php/Main_Page), for example, as well as reducing as much as possible the kernel capabilities that the containers are granted. In addition, there are many other documents on the Internet that describe approaches to security using containers like Docker.

## How to use the Docker VM Extension with Azure

The Docker VM Extension is a component that is installed in the VM instance that you create which itself installs the Docker engine and manages remote communication with the VM. There are two ways to install the VM Extension: You can create your VM using the management portal or you can create it from the Azure Command-line Interface (Azure CLI).

You can use the portal to add the Docker VM Extension to any compatible Linux VM (currently, the only image that supports it is the Ubuntu 14.04 LTS image more recent than July). Using the Azure CLI command line, however, you can install the Docker VM Extension and create and upload your Docker communication certificates all at the same time when you create the VM instance.

To create Docker-enabled VMs right now, see:

+ [How to use the Docker VM Extension from the Azure Command-line Interface (Azure CLI)]
+ [How to use the Docker VM Extension with the Azure classic portal]

## Virtual Machine Extensions for Linux and Windows
The [Docker VM extension for Azure](https://github.com/Azure/azure-docker-extension/blob/master/README.md) is just one of several VM extensions that provide special behaviour, and more are in development. For example, several of the [Linux VM Agent extension](../articles/virtual-machines/virtual-machines-linux-agent-user-guide.md) features allow you to modify and manage the Virtual Machine, including security features, kernel and networking features, and so on. The VMAccess extension for example lets you reset the administrator password or SSH key.

For a complete list, see [Azure VM Extensions](../articles/virtual-machines/virtual-machines-windows-extensions-features.md).

<!--Anchors-->
[How to use the Docker VM Extension from the Azure Command-line Interface (Azure CLI)]: http://azure.microsoft.com/documentation/articles/virtual-machines-docker-with-xplat-cli/
[How to use the Docker VM Extension with the Azure classic portal]: http://azure.microsoft.com/documentation/articles/virtual-machines-docker-with-portal/
[How to Get Started Quickly with Docker in the Azure Marketplace]: http://azure.microsoft.com/documentation/articles/virtual-machines-docker-ubuntu-quickstart/
[Docker and Linux Containers]: #Docker-and-Linux-Containers
[How to use the Docker VM Extension with Azure]: #How-to-use-the-Docker-VM-Extension-with-Azure
[Virtual Machine Extensions for Linux and Windows]: #Virtual-Machine-Extensions-For-Linux-and-Windows
