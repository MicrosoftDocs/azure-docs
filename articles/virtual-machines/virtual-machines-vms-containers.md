<properties 
	title="Virtual Machines and Containers in Azure" 
	pageTitle="Virtual Machines and Containers in Azure" 
	description="Describes Virtual Machines, Docker and Linux ontainers, and their usage in groups of each in Azure, including the benefits of each and scenarios in which each approach works very well." 
	services="virtual-machines" 
	solutions="infrastructure" 
	documentationCenter="virtual-machines" 
	authors="squillace" 
	manager="timlt" 
/>
	

<tags 
	ms.service="virtual-machines" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="infrastructure" 
	ms.workload="infrastructure" 
	ms.date="07/02/2015" 
	ms.author="rasquill" 
/>

<!--The next line, with one pound sign at the beginning, is the page title--> 
# Virtual Machines and Containers in Azure

Azure offers you great cloud solutions, built on virtual machines&mdash;based on the emulation of physical computer hardware&mdash;to enable agile movement of software deployments and dramatically better resource consolidation than physical hardware. In the past few years, largely thanks to  the [Docker](https://www.docker.com) approach to containers and the docker ecosystem, Linux container technology has dramatically expanded the ways you can develop and manage distributed software. Application code in a container is isolated from the host Azure VM as well as other containers on the same VM, which gives you more development and deployment agility at the application level&mdash;in addition to the agility that Azure VMs already give you.

**But that's old news.** The *new* news is that Azure offers you even more Docker goodness:

- [Many](virtual-machines-docker-with-xplat-cli.md) [different](virtual-machines-docker-with-portal.md) [ways](virtual-machines-docker-ubuntu-quickstart.md) to [create Docker hosts](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu) for containers to suit your situation
- [Azure Resource Manager](resource-group-overview.md) and [resource group templates](resource-group-authoring-templates.md) to simplify deploying and updating complex distributed applications
- integration with a large array of both proprietary and open-source configuration management tools

And because you can programmatically create VMs and Linux containers on Azure, you can also use VM and container *orchestration* tools to create groups of Virtual Machines (VMs) and to deploy applications inside both Linux containers and soon [Windows Server Containers](https://msdn.microsoft.com/virtualization/windowscontainers/about/about_overview). 

This article not only discusses these concepts at a high level, it also contains tons of links to more information, tutorials, and products related to container and cluster usage on Azure. If you know all this, and just want the links, they're [right here](#tools-for-working-with-containers).

## The difference between virtual machines and containers

Virtual machines run inside an isolated hardware virtualization environment provided by a [hypervisor](http://en.wikipedia.org/wiki/Hypervisor). In Azure, the [Virtual Machines](http://azure.microsoft.com/services/virtual-machines/) service handles all that for you: You just create Virtual Machines by choosing the operating system and configuring it to run the way you want&mdash;or by uploading your own custom VM image. Virtual Machines are a time-tested, "battle-hardened" technology, and there are many tools available to manage operating systems and to configure the applications you install and run. Anything running in a virtual machine is hidden from the host operating system and, from the point of view of an application or user running inside a virtual machine, the virtual machine appears to be an autonomous physical computer.

[Linux containers](http://en.wikipedia.org/wiki/LXC)&mdash;which includes those created and hosted using docker tools, and there are other approaches&mdash;do not require or use a hypervisor to provide isolation. Instead, the container host uses the process and file system isolation features of the Linux kernel to expose to the container (and its application) only certain kernel features and its own isolated file system (at a minimum). From the point of view of an application running inside a container, the container appears to be a unique operating system instance. A contained application cannot see processes or any other resources outside of its container. 

Because in this isolation and execution model the kernel of the Docker host computer is shared, and because the disk requirements of the container now do not include an entire operating system, both the start-up time of the container and the required disk storage overhead are much, much smaller. 

It's pretty cool.

[Windows Server Containers](https://msdn.microsoft.com/virtualization/windowscontainers/about/about_overview) provide the same advantages as Linux containers for applications that run on Windows. Windows Server Containers support the docker image format and the docker API. As a result, an application using Windows Server Containers can be developed, published, retrieved, and deployed using similar commands to those on Mac and Linux. That's in addition to having [new docker support in Microsoft Visual Studio](https://visualstudiogallery.msdn.microsoft.com/6f638067-027d-4817-bcc7-aa94163338f0). The larger [container ecosystem](https://msdn.microsoft.com/virtualization/windowscontainers/about/container_ecosystem) will give everyone tools to do the work they need to do with containers.

That's pretty cool, too.

### Is this too good to be true?

Well, yes&mdash;and no. Containers, like any other technology, do not magically wipe away all the hard work required by distributed applications. Yet, at the same time containers do really change:

- how fast application code can be developed and shared widely
- how fast and with what confidence it can be tested
- how fast and with what confidence it can be deployed

That said, remember containers execute on a container host&mdash;an operating system, and in Azure that means an Azure Virtual Machine. Even if you already love the idea of containers, you're still going to need a VM infrastructure hosting the containers, but the benefits are that containers do not care on which VM they are running (although whether the container wants a Linux or Windows execution environment will be important, for example). 

## What are containers good for?

They're great for many things, but they encourage&mdash;as do [Azure Cloud Services](http://azure.microsoft.com/services/cloud-services/) and [Azure Service Fabric](service-fabric-overview.md)&mdash;the creation of single-service, [microservice]-oriented distributed applications, in which application design is based on more small, composable parts rather than on larger, more strongly coupled components. 

This is especially true in public cloud environments like Azure, in which you rent VMs when and where you want them. Not only do you get isolation and rapid deployment and orchestration tools, but you can make more efficient application infrastructure decisions. 

For example, you might currently have a deployment consisting of 9 Azure VMs of a large size for a highly-available, distributed application. If the components of this application can be deployed in containers, you might be able to use only 4 VMs and deploy your application components inside 20 containers for redundancy and load balancing. 

This is just an example, of course, but if you can do this in your scenario, you can adjust to usage spikes with more containers rather than more Azure VMs, and use the remaining overall CPU load much more efficiently than before.

In addition, there are many scenarios that do not lend themselves to a microservices approach; you will know best whether microservices and containers will help you. 

### Container benefits for developers

In general, it's easy to see that container technology is a step forward, but there are more specific benefits as well. Let's take the example of Docker containers. This topic will not dive deeply into Docker right now (read [What is Docker?](https://www.docker.com/whatisdocker/) for that story, or [wikipedia](http://wikipedia.org/wiki/Docker_%28software%29)), but Docker and its ecosystem offer tremendous benefits to both developers and IT professionals.

Developers take to Docker containers quickly, because above all it makes using Linux containers easy:

- They can use simple, incremental commands to create a fixed image that is easy to deploy and can automate building those images using a dockerfile
- They can share those images easily using simple, [git](https://git-scm.com/)-style push and pull commands to [public](https://registry.hub.docker.com/) or [private docker registries](virtual-machines-docker-registry-on-azure-blob-storage.md) 
- They can think of isolated application components instead of computers
- They can use a large number of tools that understand docker containers and different base images

### Container benefits for operations and IT professionals

IT and operations professionals also benefit from the combination of containers and virtual machines. 

- contained services are isolated from VM host execution environment
- contained code is verifiably identical
- contained services can be started, stopped, and moved quickly between development, test, and production environments

Features like these&mdash;and there are more&mdash;excite established businesses, where professional information technology organizations have the job of fitting resources&mdash;including pure processing power&mdash;to the tasks required to not only stay in business, but increase customer satisfaction and reach. Small businesses, ISVs, and startups have exactly the same requirement, but they might describe it differently. 

## What are virtual machines good for?

Virtual machines provide the backbone of cloud computing, and that doesn't change. If virtual machines start more slowly, have a larger disk footprint, and do not map directly to a microservices architecture, they do have very important benefits: 

1. By default, they have much more robust default security protections for host computer
2. They support any major OS and application configurations
3. They have longstanding tool ecosystems for command and control
4. They provide the execution environment to host containers

The last item is important, because a contained application still requires a specific operating system and CPU type, depending upon the calls the application will make. It's important to remember that you install containers on VMs because they contain the applications you want to deploy; containers are not replacements for VMs or operating systems.

## High-level feature comparison of VMs and containers

The following table describes at a very high level the kind of feature differences that&mdash;without much extra work&mdash;exist between VMs and Linux containers. Note that some features maybe more or less desirable depending upon your own application needs, and that as with all software, extra work provides increased feature support, especially in the area of security.

|   Feature      | VMs | Containers  |
| :------------- |-------------| ----------- |
| "Default" security support | to a greater degree | to a slightly lesser degree |
| Memory on disk required | Complete OS plus apps | App requirements only |
| Time taken to start up | Substantially Longer: Boot of OS plus app loading | Substantially shorter: Only apps need to start because kernel is already running  |
| Portability | Portable With Proper Preparation | Portable within image format; typically smaller | 
| Image Automation | Varies widely depending on OS and apps | [Docker registry](https://registry.hub.docker.com/); others

## Creating and managing groups of VMs and containers

At this point, any architect, developer, or IT operations specialist might be thinking, "I can automate ALL of this; this really IS Data-Center-As-A-Service!". 

You're right, it can be, and there are any number of systems, many of which you may already use, that can either manage groups of Azure VMs and inject custom code using scripts, often with the [CustomScriptingExtension for Windows](https://msdn.microsoft.com/library/azure/dn781373.aspx) or the [CustomScriptingExtension for Linux](http://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/). You can&mdash;and perhaps already have&mdash;automated your Azure deployments using PowerShell or Azure CLI scripts [like this](virtual-machines-create-multi-vm-deployment-xplat-cli.md). 

These abilities are often then migrated to tools like [Puppet](https://puppetlabs.com/) and [Chef](https://www.chef.io/) to automate the creation of and configuration for VMs at scale. (There are links to using these tools with Azure [here](#tools-for-working-with-containers).) 

### Azure resource group templates

More recently, Azure released the [Azure resource management](virtual-machines-azurerm-versus-azuresm.md) REST API, and updated PowerShell and Azure CLI tools to use it easily. You can deploy, modify, or redeploy entire application topologies using [Azure Resource Manager templates](../resource-group-authoring-templates.md) with the Azure resource management API using:

- the [Azure preview portal using templates](https://github.com/Azure/azure-quickstart-templates)&mdash;hint, use the "DeployToAzure" button
- the [Azure CLI](virtual-machines-deploy-rmtemplates-azure-cli.md)
- the [Azure PowerShell modules](virtual-machines-deploy-rmtemplates-azure-cli.md)


### Deployment and management of entire groups of Azure VMs and containers

There are several popular systems that can deploy entire groups of VMs and install Docker (or other Linux container host systems) on them as an automatable group. For direct links, see the [containers and tools](#containers-and-vm-technologies) section, below. There are several systems that do this to a greater or lesser extent, and this list is not exhaustive. Depending upon your skill set and scenarios, they may or may not be useful. 

Docker has its own set of VM-creation tools ([docker-machine](virtual-machines-docker-machine.md)) and a load-balancing, docker-container cluster management tool ([swarm](virtual-machines-docker-swarm.md)). In addition, the [Azure Docker VM Extension](https://github.com/Azure/azure-docker-extension/blob/master/README.md) comes with default support for [`docker-compose`](https://docs.docker.com/compose/), which can deploy configured application containers across multiple containers.

In addition, you can try out [Mesosphere's Data Center Operating System (DCOS)](http://docs.mesosphere.com/install/azurecluster/). DCOS is based on the open-source [mesos](http://mesos.apache.org/) "distributed systems kernel" that enables you to treat your datacenter as one addressable service. DCOS has built-in packages for several important systems such as [Spark](http://spark.apache.org/) and [Kafka](http://kafka.apache.org/) (and others) as well as built-in services such as [Marathon](https://mesosphere.github.io/marathon/) (a container control system) and [Chronos](https://mesosphere.github.io/chronos/) (a distributed scheduler). Mesos was derived from lessons learned at Twitter, AirBnb, and other web-scale businesses.

Also, [kubernetes](http://azure.microsoft.com/blog/2014/08/28/hackathon-with-kubernetes-on-azure) is an open-source system for VM and container group management derived from lessons learned at Google. You can even use [kubernetes with weave to provide networking support](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos/azure/README.md#kubernetes-on-azure-with-coreos-and-weave).

[Deis](http://deis.io/overview/) is an open source "Platform-as-a-Service" (PaaS) that makes it easy to deploy and manage applications on your own servers. Deis builds upon Docker and CoreOS to provide a lightweight PaaS with a Heroku-inspired workflow. You can easily [create a 3-Node Azure VM group and install Deis](virtual-machines-deis-cluster.md) on Azure and then [install a Hello World Go application](virtual-machines-deis-cluster.md#deploy-and-scale-a-hello-world-application). 

[CoreOS](virtual-machines-linux-coreos-how-to.md), a Linux distribution with an optimized footprint, Docker support, and their own container system called [rkt](https://github.com/coreos/rkt), also has a container group management tool called [fleet](virtual-machines-linux-coreos-fleet-get-started.md). 

Ubuntu, another very popular Linux distribution, supports Docker very well, but also supports [Linux (LXC-style) clusters](https://help.ubuntu.com/lts/serverguide/lxc.html). 

## Tools for working with Azure VMs and containers

Working with containers and Azure VMs uses tools. This section provides a list of only some of the most useful or important concepts and tools about containers, groups, and the larger configuration and orchestration tools used with them. 

> [AZURE.NOTE] This area is changing amazingly rapidly, and while we will do our best to keep this topic and its links up to date, it might well be an impossible task. Make sure you search on interesting subjects to keep up to date!

### Containers and VM technologies

Some Linux container technologies:

- [Docker](https://www.docker.com)
- [LXC](https://linuxcontainers.org/)
- [CoreOS and rkt](https://github.com/coreos/rkt)
- [Open Container Project](http://opencontainers.org/)
- [RancherOS](http://rancher.com/rancher-os/)

Windows Server Container links:

- [Windows Server Containers](https://msdn.microsoft.com/virtualization/windowscontainers/about/about_overview)

Visual Studio Docker links:

- [Visual Studio 2015 RC Tools for Docker - Preview](https://visualstudiogallery.msdn.microsoft.com/6f638067-027d-4817-bcc7-aa94163338f0)

Docker tools:

- [Docker daemon](https://docs.docker.com/installation/#installation)
- Docker clients
	- [Windows Docker Client on Chocolatey](https://chocolatey.org/packages/docker)
	- [Docker installation instructions](https://docs.docker.com/installation/#installation)


Docker on Microsoft Azure:

- [Docker VM Extension for Linux on Azure](virtual-machines-docker-vm-extension.md)
- [Azure Docker VM Extension User Guide](https://github.com/Azure/azure-docker-extension/blob/master/README.md)
- [Using the Docker VM Extension from the Azure Command-line Interface (Azure CLI)](virtual-machines-docker-with-xplat-cli.md)
- [Using the Docker VM Extension from the Azure Preview Portal](virtual-machines-docker-with-portal.md)
- [Getting Started Quickly with Docker in the Azure Marketplace](virtual-machines-docker-ubuntu-quickstart.md)
- [How to use docker-machine on Azure](virtual-machines-docker-machine.md)
- [How to use docker with swarm on Azure](virtual-machines-docker-swarm.md)
- [Get Started with Docker and Compose on Azure](virtual-machines-docker-compose-quickstart.md)
- [Using an Azure resource group template to create a Docker host on Azure quickly](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu)
- [The built-in support for `compose`](https://github.com/Azure/azure-docker-extension#11-public-configuration-keys) for contained applications
- [Implement a Docker private registry on Azure](virtual-machines-docker-registry-on-azure-blob-storage.md)

Linux distributions and Azure examples:

- [CoreOS](virtual-machines-linux-coreos-how-to.md)

Configuration, cluster management, and container orchestration:

- [Fleet on CoreOS](virtual-machines-linux-coreos-fleet-get-started.md)

-	Deis
	- [Create a 3-Node Azure VM group, install Deis, and start a Hello World Go application](virtual-machines-deis-cluster.md)
	
-	Kubernetes
	- [Complete guide to automated Kubernetes cluster deployment with CoreOS and Weave](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos/azure/README.md#kubernetes-on-azure-with-coreos-and-weave)
	- [Kubernetes Visualizer](http://azure.microsoft.com/blog/2014/08/28/hackathon-with-kubernetes-on-azure)
	
-	[Mesos](http://mesos.apache.org/)
	-	[Mesosphere's Data Center Operating System (DCOS)](http://beta-docs.mesosphere.com/install/azurecluster/)
	
-	[Jenkins](https://jenkins-ci.org/) and [Hudson](http://hudson-ci.org/)
	- [Blog: Jenkins Slave Plug-in for Azure](http://msopentech.com/blog/2014/09/23/announcing-jenkins-slave-plugin-azure/)
	- [GitHub repo: Jenkins Storage Plug-in for Azure](https://github.com/jenkinsci/windows-azure-storage-plugin)
	- [Third Party: Hudson Slave Plug-in for Azure](http://wiki.hudson-ci.org/display/HUDSON/Azure+Slave+Plugin)
	- [Third Party: Hudson Storage Plug-in for Azure](https://github.com/hudson3-plugins/windows-azure-storage-plugin)
	
-	[Chef](https://docs.chef.io/index.html)
	- [Chef and Virtual Machines](virtual-machines-windows-install-chef-client.md)
	- [Video: What is Chef and How does it Work?](https://msopentech.com/blog/2014/03/31/using-chef-to-manage-azure-resources/)

-	[Azure Automation](http://azure.microsoft.com/services/automation/)
	- [Video: How to Use Azure Automation with Linux VMs](http://channel9.msdn.com/Shows/Azure-Friday/Azure-Automation-104-managing-Linux-and-creating-Modules-with-Joe-Levy)
	
-	Powershell DSC for Linux
    - [Blog: How to do Powershell DSC for Linux](http://blogs.technet.com/b/privatecloud/archive/2014/05/19/powershell-dsc-for-linux-step-by-step.aspx)
    - [GitHub: Docker Client DSC](https://github.com/anweiss/DockerClientDSC)

## Next steps

Check out [Docker](https://www.docker.com) and [Windows Server Containers](https://msdn.microsoft.com/virtualization/windowscontainers/about/about_overview).

<!--Anchors-->
[microservices]: http://martinfowler.com/articles/microservices.html
[microservice]: http://martinfowler.com/articles/microservices.html
<!--Image references-->
