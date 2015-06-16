<properties title="Virtual Machines, Containers, and Clusters in Azure" pageTitle="Virtual Machines, Containers, and Clusters in Azure" description="Describes Virtual Machines, Docker and Linux ontainers, and their usage in clusters in Azure, including the benefits of each and scenarios in which each approach works very well." services="virtual-machines" solutions="infrastructure" documentationCenter="virtual-machines" authors="squillace" videoId="" scriptId="" manager="timlt" />

<tags ms.service="virtual-machines" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="infrastructure" ms.workload="infrastructure" ms.date="06/07/2015" ms.author="rasquill" />

<!--The next line, with one pound sign at the beginning, is the page title--> 
# Virtual Machines, Containers, and Clusters in Azure

Azure already offers you great [hypervisor](http://en.wikipedia.org/wiki/Hypervisor) technology -- an emulation of physical computer hardware -- to enable agile movement of software deployments and increased usage of hardware resources. In the past few years, Linux container technology -- especially [Docker](https://www.docker.com) and its ecosystem -- has dramatically expanding the agility with which you can develop, deploy, test, and repair distributed software, especially in public cloud systems like Microsoft Azure. 

**But that's old news.** The *new* news is that Azure offers you:
- a choice of Docker container implementation models
- Azure Resource Manager templates to describe complex solutions for deployment or updating
- integration with multiple Windows, Linux, and open-source configuration management tools

And because you can programmatically create VMs and Docker containers on Azure, you can also use *orchestration* tools -- also called continuous integration or continous deployment tools -- to create a combination of Virtual Machines (VMs), Linux containers (of which the most well known are [Docker](https://www.docker.com) containers), and soon [Windows Server Containers](https://msdn.microsoft.com/virtualization/windowscontainers/about/about_overview) to move your businesses forward and make your users happier. 

This article not only discusses these concepts at a high level, it also contains tons of links to more information, tutorials, and products related to container and cluster usage on Azure. If you know all this, and just want the links, they're [right here](#tools-for-working-with-containers).

## The difference between virtual machines and containers

Virtual machines run inside an isolated hardware emulation environment provided by a hypervisor. In Azure, you do not have to manage any hypervisor; you just create Virtual Machines by choosing the operating system configure it to run the way you want. It is a complete operating system, isolated from other VMs by Windows Server Hyper-V, the hypervisor used by Azure. Virtual Machines are a time-tested, "battle-hardened" technology, and there are many tools available to manage the operating system and to configure applications you install and run. 

[Docker](https://www.docker.com/) and other [Linux container](http://en.wikipedia.org/wiki/LXC) technologies (and there are many others) do not require or use a hypervisor to provide isolation. Instead, the container host uses the process and file system isolation features of the Linux kernel to expose to the container (and its application) only certain kernel features and its own isolated file system (at a minimum). From the point of view of an application running inside a container, the container appears to be a unique operating system instance. The contained applications cannot see processes or any other resources outside of its container. Because in this isolation and execution model the kernel of the Docker host computer is shared, and because the disk usage of the container now does not include an entire operating system, both the start-up time of the container and the required disk storage overhead are much, much smaller. It's pretty cool.

[Windows Server Containers](https://msdn.microsoft.com/virtualization/windowscontainers/about/about_overview) provide the same advantages as Linux containers for applications that run on Windows. Windows Server Containers support the docker image format and the docker remote API. As a result, an application using Windows Server Containers can be developed, published, retrieved, and deployed using the exact same commands as developers on Mac and Linux and have a much reduced disk footprint and start-up time compared to VMs. Those are two pretty cool things.

### Is this too good to be true?

Well, yes -- and no. Containers, like any other technology, are not going to magically wipe away all the hard work required by distributed applications. Yet, at the same time containers do really change:

- how fast a service can be developed and shared widely
- how fast and with what confidence it can be tested
- how fast and with what confidence it can be deployed

That said, remember that underneath containers there is still a container host -- an operating system, and in a public cloud that means running in a hypervisor. Even if you already love the idea of containers, you're still going to need a VM infrastructure hosting the containers, but the benefits are that containers do not care on which VM they are running (although whether the container wants a Linux or Windows environment will be important).

## What are containers good for?

They're great for many things, but especially for creating single-service, [microservice]-oriented distributed applications. This is especially true in public cloud environments, in which you rent VMs when and where you want them. For example, instead of needing to create 9 VMs of a large size to create a highly-available, distributed application, you might now only use 4 VMs but create your application with 20 containers. You can adjust to usage spikes with more containers rather than more VMs, using the remaining overall CPU load much more efficiently than before.

In general, it's easy to see that this is a step forward, but there are more specific benefits as well. Let's take the example of Docker containers. We won't go deeply into Docker right now (read [What is Docker?](https://www.docker.com/whatisdocker/) for that story, or [wikipedia](http://wikipedia.org/wiki/Docker_%28software%29)), but **Docker** and its ecosystem offers tremendous benefits to both developers and IT professionals.

### Benefits for developers

Developers take to Docker containers quickly, because above all it makes using Linux containers easy:

- They can use simple, incremental commands to create a fixed image that is easy to deploy and can automate building those images using a dockerfile
- They can share those images easily using simple, [git](https://git-scm.com/)-style push and pull commands to public or private docker registries. 
- They can think of isolated application components instead of computers.
- They can use a large number of tools that understand docker containers and images

Another benefit of Docker containers in particular is the emphasis on one primary process per container, which matches fairly nicely the [microservices] architectural approach that many distributed applications are using, especially on public cloud platforms. Of course, there are many other ways of implementing a microservice-style  architecture, including [zure Cloud Services](http://azure.microsoft.com/services/cloud-services/) as well as [Azure Service Fabric](http://azure.microsoft.com/campaigns/service-fabric/).

### Benefits for operations and IT professionals

IT and operations professionals also benefit from the combination of containers and virtual machines. 

- contained services are isolated from VM host execution environment
- contained code is verifiably identical
- contained services can be started, stopped, and moved quickly between development, test, and production environments

Features like these -- and there are more -- excite established businesses, where professional information technology organizations have the job of fitting the resources -- including pure processing power -- to the tasks required to not only stay in business, but increase customer satisfaction and reach. Small businesses, ISVs, and startups have exactly the same requirement, but they might describe it differently. 


### Benefits of virtual machines

If virtual machines start more slowly, make it a bit harder to optimize CPU usage, and do not easily help develop microservices, they do have very important benefits: 

1. By default, they have much more robust security protections for host computer
2. They support any major OS and application configurations
3. They have longstanding tool ecosystems for command and control

In addition, there are always good scenarios for using operating systems directly on "bare metal" -- that is, using a native operating system installation. 


## High-level feature comparison of VMs and containers

The following table describes at a very high level the kind of feature differences that -- without much extra work -- exist between hypervisors and Linux containers. Note that some features maybe more or less desirable depending upon your own application needs, and that as with all software, extra work provides increased feature support.

|   Feature      | Hypervisors | Containers  | Who Really Likes It |
| :------------- |-------------| ----------- | ------------------- |
| Process Isolation | More or less complete | If root is obtained, container host could be compromised | IT/Ops specialists |
| Memory on disk required | Complete OS plus apps | App requirements only | IT/Ops specialists, devs |
| Time taken to start up | Substantially Longer: Boot of OS plus app loading | Substantially shorter: Only apps need to start because kernel is already running  | IT Ops and devs and test |
| Container Automation | Varies widely depending on OS and apps | [Docker image gallery](https://registry.hub.docker.com/); others | devs and ops specialists |
| Portability | Portable With Proper Preparation | Portable within image format; typically smaller | IT/Ops specialists, devs, test |
| Fixed app image | can be | typically is | IT/Ops specialists, devs, test |
| encourages microservice architecture approaches | to a lesser degree | to a much greater degree | IT/ops specialists and dev, test |
| "Default" security support | to a greater degree | to a slightly lesser degree | IT/Ops, CIO |


## Creating and orchestrating clusters of VMs and containers

At this point, any architect, developer, or IT operations ninja will be thinking, "I can automate ALL of this; this really IS Data-Center-As-A-Service (DCAAS?)". 

You're right, it can be, and there are any number of systems, some of which you may already use, that can either manage VM clusters and inject custom code -- using scripts, usually with the [CustomScriptingExtension for Windows](https://msdn.microsoft.com/library/azure/dn781373.aspx) or the [CustomScriptingExtension for Linux](http://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/). You can -- and perhaps already have -- automated your Azure deployments using PowerShell or Azure CLI scripts [like this](virtual-machines-create-multi-vm-deployment-xplat-cli.md). 

These abilities are often then migrated to tools like [Puppet](https://puppetlabs.com/) and [Chef](https://www.chef.io/) to automate the creation of and configuration for VMs at scale. (There are links to using these tools with Azure [here](#tools-for-working-with-containers).) 

### Azure resource group templates

More recently, Azure released the [Azure resource management](virtual-machines-azurerm-versus-azuresm.md) REST API, and updated PowerShell and Azure CLI tools to use it easily. You can deploy, modify, or redeploy entire application topologies using [Azure Resource Manager templates](https://msdn.microsoft.com/library/azure/dn835138.aspx) with the Azure resource management API using:

- the [Azure preview portal using templates](https://github.com/Azure/azure-quickstart-templates) -- hint, use the "DeployToAzure" button
- the [Azure CLI](virtual-machines-deploy-rmtemplates-azure-cli.md)
- the [Azure PowerShell modules](virtual-machines-deploy-rmtemplates-azure-cli.md)


### Cluster deployment and management

There are several popular systems that can deploy entire VM clusters and enable Docker on them as an automatable group. For direct links, see the [containers and tools](#containers-and-vm-technologies) section, below. There are several systems that do this to a greater or lesser extent, and this list is not exhaustive. Depending upon your skill set and scenarios, they may or may not be useful. 

Docker has its own set of VM-creation tools ([docker-machine](virtual-machines-docker-machine.md)) and load-balancing, docker-container cluster management tool ([swarm](virtual-machines-docker-swarm.md)). 

[CoreOS]([CoreOS](virtual-machines-linux-coreos-how-to.md)), a Linux distribution with an optimized footprint, Docker support, and their own container system called [rkt](https://github.com/coreos/rkt), also has a cluster management tool called [fleet](virtual-machines-linux-coreos-fleet-get-started.md). 

Ubuntu, another very popular Linux distribution, supports Docker very well, but also supports Linux (LXC-style) clusters, as well as having their own container system. 

Think about trying out [mesosphere's Data Center Operating System (DCOS)](http://beta-docs.mesosphere.com/install/azurecluster/).

Also, [kubernetes](http://azure.microsoft.com/blog/2014/08/28/hackathon-with-kubernetes-on-azure) is an open-source system for VM and container cluster management derived from lessons learned at Google that runs locally or on other cloud platorms like Microsoft Azure. You can even use [kubernetes with weave to provide networking support](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos/azure/README.md#kubernetes-on-azure-with-coreos-and-weave).

## Security issues for containers, clusters, and orchestration systems

New technologies are often so useful, so interesting, that security considerations are often discussed as a footnote or later, after issues have arisen during early deployments. 

As mentioned above, all technologies are tools. Just as not every computing workload belongs in a public cloud, not every application should be built using containers. If you've read through the [high-level feature comparison of VMs and containers](#high-level-feature-comparison-of-VMs-and-containers) section, above, then you'll see reasons you might investigate whether using a container approach is really what you want to do in your specific scenario. 

For example, start-up speed is very useful, especially in a multitenant or untrusted-code scenarios. Another customer? Just throw up another container and run their code; it happens very, very quickly compared with the minutes a new VM might take to start up.

However, without extra configuration and extra steps taken, hosted code with ill-intent might attempt to probe the shared kernel for vulnerabilities. This is much, much harder to do in hypervisors, as the kernel is an emulated kernel, which provides an extra level of protection. 

There are very good mitigations to support this scenario using containers, and Docker has collaborated with the Center for Internet Security to [publish an article on Docker Security Best Practices](https://blog.docker.com/2015/05/understanding-docker-security-and-best-practices/). In addition, there are many important scenarios for using both VMs and containers specifically when code either is or might be insecure, some of which are discussed [here](http://jpetazzo.github.io/2015/05/27/docker-images-vulnerabilities/). 

## Tools for working with containers

Working with containers and automating clusters uses tools. This section provides a list of only some of the most useful or important concepts and tools about containers, clusters, and the larger configuration and orchestration tools used with them. 

> [AZURE.NOTE] This area is changing amazingly rapidly, and while we will do our best to keep this topic and its links up to date, it might well be an impossible task. Make sure you search on interesting subjects to keep up to date!

### Containers and VM technologies

Some Linux container technologies:

- [Docker](https://www.docker.com)
- [LXC](https://linuxcontainers.org/)
- [Ubuntu Core Snappy](http://developer.ubuntu.com/en/snappy/)
- [CoreOS and rkt](https://github.com/coreos/rkt)

Windows Server Container links:

- [Windows Server Containers](https://msdn.microsoft.com/virtualization/windowscontainers/about/about_overview)

Docker tools:

- [Docker daemon](https://docs.docker.com/installation/#installation)
- [Docker client master binariess](https://master.dockerproject.org/)
	- [Windows Docker Client on Chocolatey](https://chocolatey.org/packages/docker)
	- [Docker installation instructions](https://docs.docker.com/installation/#installation)
- [Docker private registry on Azure](http://azure.microsoft.com/blog/2014/11/11/deploying-your-own-private-docker-registry-on-azure/)

Docker on Microsoft Azure:

- [Docker VM Extension for Linux on Azure](virtual-machines-docker-vm-extension.md)
- [Using the Docker VM Extension from the Azure Command-line Interface (Azure CLI)](virtual-machines-docker-with-xplat-cli.md)
- [Using the Docker VM Extension from the Azure Preview Portal](virtual-machines-docker-with-portal.md)
- [Getting Started Quickly with Docker in the Azure Marketplace](virtual-machines-docker-ubuntu-quickstart.md)
- [How to use docker-machine on Azure](virtual-machines-docker-machine.md)
- [How to use docker with swarm on Azure](virtual-machines-docker-swarm.md)
- [Get Started with Docker and Compose on Azure](virtual-machines-docker-compose-quickstart.md)

Linux distributions and Azure examples:

- [CoreOS](virtual-machines-linux-coreos-how-to.md)

Configuration, cluster management, and container orchestration:

- [Fleet on CoreOS](virtual-machines-linux-coreos-fleet-get-started.md)

-	Deis
	- [GitHub repo: Installing Deis on a CoreOS cluster on Azure](https://github.com/chanezon/azure-linux/tree/master/coreos/deis)
	
-	Kubernetes
	- [Complete guide to automated Kubernetes cluster deployment with CoreOS and Weave](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos/azure/README.md#kubernetes-on-azure-with-coreos-and-weave)
	- [Kubernetes Visualizer](http://azure.microsoft.com/blog/2014/08/28/hackathon-with-kubernetes-on-azure)
	
-	[Mesos](http://mesos.apache.org/)
	-	[mesosphere's Data Center Operating System (DCOS)](http://beta-docs.mesosphere.com/install/azurecluster/)
	
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
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png


