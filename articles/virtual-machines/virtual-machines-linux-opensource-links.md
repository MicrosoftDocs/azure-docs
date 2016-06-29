<properties
	pageTitle="Linux and Open-Source Computing on Azure | Microsoft Azure"
	description="Lists Linux and Open-Source Computing articles on Azure, including basic Linux usage, some fundamental concepts about running or uploading Linux images on Azure, and other content about specific technologies and optimizations."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="squillace"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.devlang="NA"
	ms.topic="article"
	ms.tgt_pltfrm="vm-linux"
	ms.workload="infrastructure-services"
	ms.date="06/27/2016"
	ms.author="rasquill"/>



# Linux and open-source computing on Azure

Find all the documentation you need to create and manage Linux-based virtual machines in the classic deployment model.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

## Get Started
- [Introduction for Linux on Azure](virtual-machines-linux-intro-on-azure.md)
- [Frequently asked question about Azure Virtual Machines created with the classic deployment model](virtual-machines-linux-classic-faq.md)
- [About images for virtual machines](virtual-machines-linux-classic-about-images.md)
- [Uploading your own Distro Image](virtual-machines-linux-classic-create-upload-vhd.md) (and also instructions using an [Azure-Endorsed Distribution](virtual-machines-linux-endorsed-distros.md))
- [Log on to a Linux VM Using the Azure classic portal](virtual-machines-linux-classic-log-on.md)

## Set up

- [Install Azure Command-Line Interface (Azure CLI)](../xplat-cli-install.md)


## Tutorials

- [Install the LAMP Stack on a Linux virtual machine in Azure](virtual-machines-linux-install-lamp-stack.md)
- [Ruby on Rails Web application on an Azure VM](virtual-machines-linux-classic-ruby-rails-web-app.md)
- [How to: Install Apache Qpid Proton-C for AMQP and Service Bus](../service-bus/service-bus-amqp-apache.md)

### Databases
- [Optimize Performance of MySQL on Azure](virtual-machines-linux-classic-optimize-mysql.md)
- [MySQL Clusters](virtual-machines-linux-classic-mysql-cluster.md)
- [Running Cassandra with Linux on Azure and Accessing it from Node.js](virtual-machines-linux-classic-cassandra-nodejs.md)
- [Create a Multi-Master cluster of MariaDbs](virtual-machines-linux-classic-mariadb-mysql-cluster.md)

### HPC
- [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md)
- [Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](virtual-machines-linux-classic-hpcpack-cluster-namd.md)
- [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md)

### Docker
- [Using the Docker VM Extension from the Azure Command-line Interface (Azure CLI)](virtual-machines-linux-classic-cli-use-docker.md)
- [Using the Docker VM Extension from the Azure portal](virtual-machines-linux-classic-portal-use-docker.md)
- [How to use docker-machine on Azure](virtual-machines-linux-docker-machine.md)

### Ubuntu
- [How to: MySQL Clusters](virtual-machines-linux-classic-mysql-cluster.md)
- [How to: Node.js and Cassandra](virtual-machines-linux-classic-cassandra-nodejs.md)

### OpenSUSE
- [How to: Install and Run MySQL](virtual-machines-linux-classic-mysql-on-opensuse.md)

### CoreOS
- [How to: Use CoreOS on Azure](https://coreos.com/os/docs/latest/booting-on-azure.html)


## Planning
- [Azure infrastructure services implementation guidelines](virtual-machines-linux-infrastructure-service-guidelines.md)
- [Selecting Linux Usernames](virtual-machines-linux-usernames.md)
- [How to configure an availability set for virtual machines in the classic deployment model](virtual-machines-linux-classic-configure-availability.md)
- [How to Schedule Planned Maintenance on Azure VMs](virtual-machines-linux-planned-maintenance-schedule.md)
- [Manage the availability of virtual machines](virtual-machines-linux-manage-availability.md)
- [Planned maintenance for Linux virtual machines in Azure](virtual-machines-linux-planned-maintenance.md)


## Deployment
- [Create a custom virtual machine running Linux](virtual-machines-linux-classic-createportal.md)
- [The basics: Capturing a Linux VM to Make a Template](virtual-machines-linux-classic-capture-image.md)
- [Information for Non-Endorsed Distributions](virtual-machines-linux-create-upload-generic.md)


## Management

- [SSH](virtual-machines-linux-ssh-from-linux.md)
- [How to Reset a Password or SSH Properties for Linux](virtual-machines-linux-classic-reset-access.md)
- [Using Root](virtual-machines-linux-use-root-privileges.md)


## Azure Resources

- [The Azure Linux Agent](virtual-machines-linux-agent-user-guide.md)
- [Azure VM Extensions and Features](virtual-machines-windows-extensions-features.md)
- [Injecting Custom Data into a VM to use with Cloud-init](virtual-machines-windows-classic-inject-custom-data.md)


## Storage

- [Attaching a Data Disk to a Linux VM](virtual-machines-linux-classic-attach-disk.md)
- [Detaching a Data Disk from a Linux VM](virtual-machines-linux-classic-detach-disk.md)
- [RAID](virtual-machines-linux-configure-raid.md)


## Networking
- [How to set up endpoints on a classic virtual machine in Azure](virtual-machines-linux-classic-setup-endpoints.md)


## Troubleshooting
- [Troubleshoot Secure Shell (SSH) connections to a Linux-based Azure virtual machine](virtual-machines-linux-troubleshoot-ssh-connection.md)
- [Troubleshoot classic deployment issues with creating a new Linux virtual machine in Azure](virtual-machines-linux-classic-troubleshoot-deployment-new-vm.md)  
- [Troubleshoot classic deployment issues with restarting or resizing an existing Linux Virtual Machine in Azure](virtual-machines-linux-classic-restart-resize-error-troubleshooting.md) 


## Reference

- [Azure CLI commands in Azure Service Management (asm) mode](../virtual-machines-command-line-tools.md)
- [Azure Service Management REST API](https://msdn.microsoft.com/library/azure/ee460799.aspx)




## General Links
The following links are for Microsoft blogs, Technet pages, and external sites rather than Azure.com documentation as above. As both Azure and the open-source computing world are fast-moving targets, it is almost certain that the following links are out of date, *despite* the fact that we shall do our best to continually add newer topics and remove out-of-date ones. If we've missed one, please let us know in the comments, or submit a pull request to our [GitHub repo](https://github.com/Azure/azure-content/).

- [Running ASP.NET 5 on Linux using Docker Containers](http://blogs.msdn.com/b/webdev/archive/2015/01/14/running-asp-net-5-applications-in-linux-containers-with-docker.aspx)
- [How to Deploy a CentOS VM Image from OpenLogic](https://azure.microsoft.com/blog/2013/01/11/deploying-openlogic-centos-images-on-windows-azure-virtual-machines/)
- [SUSE Update Infrastructure](https://forums.suse.com/showthread.php?5622-New-Update-Infrastructure)
- [SUSE Linux Enterprise Server for SAP Cloud Appliance  Library](https://azure.microsoft.com/marketplace/partners/suse/suselinuxenterpriseserver11sp3forsapcloudappliance/)
- [Building Highly Available Linux on Azure in 12 Steps](http://blogs.technet.com/b/keithmayer/archive/2014/10/03/quick-start-guide-building-highly-available-linux-servers-in-the-cloud-on-microsoft-azure.aspx)
- [Automate Provisioning Linux on Azure with Azure CLI, node.js, jhawk](http://blogs.technet.com/b/keithmayer/archive/2014/11/24/step-by-step-automated-provisioning-for-linux-in-the-cloud-with-microsoft-azure-xplat-cli-json-and-node-js-part-1.aspx)
- [GlusterFS on Azure](http://dastouri.azurewebsites.net/gluster-on-azure-part-1/)

### FreeBSD
- [Running FreeBSD in Azure](https://azure.microsoft.com/blog/2014/05/22/running-freebsd-in-azure/)
- [Easy Deploy FreeBSD](http://msopentech.com/blog/2014/10/24/easy-deploy-freebsd-microsoft-azure-vm-depot/)
- [Deploying a Customized FreeBSD Image](http://msopentech.com/blog/2014/05/14/deploy-customize-freebsd-virtual-machine-image-microsoft-azure/)
- [Kaspersky AV for Linux File Server](https://azure.microsoft.com/marketplace/partners/kaspersky-lab/kav-for-lfs-kav-for-lfs/)

### NoSQL

- [8 Open-source NoSql Databases for Azure](http://openness.microsoft.com/blog/2014/11/03/open-source-nosql-databases-microsoft-azure/)
- [Slideshare (MSOpenTech): Experiences with CouchDb on Azure](http://www.slideshare.net/brianbenz/experiences-using-couchdb-inside-microsofts-azure-team)
- [Running CouchDB-as-a-Service with node.js, CORS, and Grunt](http://msopentech.com/blog/2013/12/19/tutorial-building-multi-tier-windows-azure-web-application-use-cloudants-couchdb-service-node-js-cors-grunt-2/)

- [Redis on Windows in the Azure Redis Cache Service](http://msopentech.com/blog/2014/05/12/redis-on-windows/)
- [Announcing ASP.NET Session State Provider for Redis Preview Release](http://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx)

- [Blog: RavenHQ Now Available in the Azure Marketplace](https://azure.microsoft.com/blog/2014/08/12/ravenhq-now-available-in-the-azure-store/)

### Big Data
- [Installing Hadoop on Azure Linux VMs](http://blogs.msdn.com/b/benjguin/archive/2013/04/05/how-to-install-hadoop-on-windows-azure-linux-virtual-machines.aspx)
- [Azure HDInsight](https://azure.microsoft.com/documentation/learning-paths/hdinsight-self-guided-hadoop-training/)

### Relational database
- [MySQL High Availability Architecture in Microsoft Azure](http://download.microsoft.com/download/6/1/C/61C0E37C-F252-4B33-9557-42B90BA3E472/MySQL_HADR_solution_in_Azure.pdf)
- [Installing Postgres with corosync, pg_bouncer using ILB](https://github.com/chgeuer/postgres-azure)

### Linux high performance computing (HPC)

- [Quickstart template: Spin up a SLURM cluster](https://github.com/Azure/azure-quickstart-templates/tree/master/slurm)
 (and [blog post](http://blogs.technet.com/b/windowshpc/archive/2015/06/06/deploy-a-slurm-cluster-on-azure.aspx))
- [Quickstart template: Create an HPC cluster with Linux compute nodes](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-linux-cn/)

### Devops, management, and optimization

As the world of devops, management, and optimization is quite expansive and changing very quickly, you should consider the list below a starting point.

- [Video: Azure Virtual Machines : Using Chef, Puppet and Docker for managing Linux VMs](https://azure.microsoft.com/blog/2014/12/15/azure-virtual-machines-using-chef-puppet-and-docker-for-managing-linux-vms/)

- [Complete guide to automated Kubernetes cluster deployment with CoreOS and Weave](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos/azure/README.md#kubernetes-on-azure-with-coreos-and-weave)
- [Kubernetes Visualizer](https://azure.microsoft.com/blog/2014/08/28/hackathon-with-kubernetes-on-azure/)

- [Jenkins Slave Plug-in for Azure](http://msopentech.com/blog/2014/09/23/announcing-jenkins-slave-plugin-azure/)
- [GitHub repo: Jenkins Storage Plug-in for Azure](https://github.com/jenkinsci/windows-azure-storage-plugin)

- [Third Party: Hudson Slave Plug-in for Azure](http://wiki.hudson-ci.org/display/HUDSON/Azure+Slave+Plugin)
- [Third Party: Hudson Storage Plug-in for Azure](https://github.com/hudson3-plugins/windows-azure-storage-plugin)

- [Video: What is Chef and How does it Work?](https://msopentech.com/blog/2014/03/31/using-chef-to-manage-azure-resources/)

- [Video: How to Use Azure Automation with Linux VMs](http://channel9.msdn.com/Shows/Azure-Friday/Azure-Automation-104-managing-Linux-and-creating-Modules-with-Joe-Levy)

- [Blog: How to do Powershell DSC for Linux](http://blogs.technet.com/b/privatecloud/archive/2014/05/19/powershell-dsc-for-linux-step-by-step.aspx)
- [GitHub: Docker Client DSC](https://github.com/anweiss/DockerClientDSC)

- [Packer plugin for Azure](https://github.com/msopentech/packer-azure)
