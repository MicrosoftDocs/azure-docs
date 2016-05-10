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
	ms.date="03/26/2016"
	ms.author="rasquill"/>



# Linux and open-source computing on Azure

This document attempts to list in one place all the classic deployment model topics written by Microsoft and its partners about running Linux-based Virtual Machines as well as other open-source compute environments and applications on Microsoft Azure. 

As both Azure and the open-source computing world are fast-moving targets, it is almost certain that this document is out of date, *despite* the fact that we shall do our best to continually add newer topics and remove out-of-date ones. If we've missed one, please let us know in the comments, or submit a pull request to our [GitHub repo](https://github.com/Azure/azure-content/).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]


## General notes
The sections are broken down on the right of this page. (Links may occur in more than one section, as topics can be about more than one concept, distro, or technology.) In addition, there are several topics that describe various Linux options, image repositories, case studies, and how-to topics to upload your own custom images:

- [Azure Marketplace](https://azure.microsoft.com/marketplace/virtual-machines/)
- [MSOpenTech VM Depot](https://vmdepot.msopentech.com/List/Index)
- [Events and Demonstrations: Microsoft Openness CEE](http://www.opennessatcee.com/)
- [How to: Uploading your own Distro Image](virtual-machines-linux-classic-create-upload-vhd.md) (and also instructions using an [Azure-Endorsed Distribution](virtual-machines-linux-endorsed-distros.md))
- [Notes: General Linux Requirements to Run in Azure](virtual-machines-linux-create-upload-generic.md)
- [Notes: General Introduction for Linux on Azure](virtual-machines-linux-intro-on-azure.md)

## Distros

There are tons of Linux distributions, usually broken down by the package management systems: Some are dpkg-based, like Debian and Ubuntu, and others are rpm-based, like CentOS, SUSE, and RedHat. Some companies provide distro images as formal partners of Microsoft and are endorsed. Others are provided by the community. The distros in this section have formal articles about them, even if they were only used in examples of other technologies.

### [Ubuntu](https://azure.microsoft.com/marketplace/partners/Canonical/)

Ubuntu is a very popular and Azure-endorsed Linux distribution based on dpkg and apt-get package management.

3. [How to: MySQL Clusters](virtual-machines-linux-classic-mysql-cluster.md)
4. [How to: Node.js and Cassandra](virtual-machines-linux-classic-cassandra-nodejs.md)
6. [Geeking out: Running ASP.NET 5 on Linux using Docker Containers](http://blogs.msdn.com/b/webdev/archive/2015/01/14/running-asp-net-5-applications-in-linux-containers-with-docker.aspx)

### CentOS

The CentOS Linux distribution is a stable, predictable, manageable and reproduceable platform derived from the sources of Red Hat Enterprise Linux (RHEL).

4. [Blog: How to Deploy a CentOS VM Image from OpenLogic](https://azure.microsoft.com/blog/2013/01/11/deploying-openlogic-centos-images-on-windows-azure-virtual-machines/)
6. [How to: Install Apache Qpid Proton-C for AMQP and Service Bus](../service-bus/service-bus-amqp-apache.md/)

### SUSE Linux Enterprise Server and openSUSE

11. [How to: Install and Run MySQL](virtual-machines-linux-classic-mysql-on-opensuse.md)
13. [[SUSE forum] How to: Move to a New Patch Server](https://forums.suse.com/showthread.php?5622-New-Update-Infrastructure)
14. [Images: SUSE Linux Enterprise Server for SAP Cloud Appliance  Library](https://azure.microsoft.com/marketplace/partners/suse/suselinuxenterpriseserver11sp3forsapcloudappliance/)

### CoreOS

CoreOS is a small, optimized distro for pure compute scale with a high degree of control for customization.

10. [Image Gallery](https://azure.microsoft.com/marketplace/partners/coreos/)  
11. [How to: Use CoreOS on Azure](virtual-machines-linux-classic-coreos-howto.md)
12. [How to: Get Started with Fleet and Docker on CoreOS on Azure](virtual-machines-linux-classic-coreos-fleet-get-started.md)


### FreeBSD

12. [MSOpenTech VM Depot](https://vmdepot.msopentech.com/List/Index?sort=Date&search=FreeBSD)
13. [Blog: Running FreeBSD in Azure](https://azure.microsoft.com/blog/2014/05/22/running-freebsd-in-azure/)
14. [Blog: Easy Deploy FreeBSD](http://msopentech.com/blog/2014/10/24/easy-deploy-freebsd-microsoft-azure-vm-depot/)
15. [Blog: Deploying a Customized FreeBSD Image](http://msopentech.com/blog/2014/05/14/deploy-customize-freebsd-virtual-machine-image-microsoft-azure/)
18. [Marketplace: Kaspersky AV for Linux File Server](https://azure.microsoft.com/marketplace/partners/kaspersky-lab/kav-for-lfs-kav-for-lfs/)

## The basics

1. [The basics: Azure Command-Line Interface (Azure CLI)](../xplat-cli-install.md)
5. [The basics: Selecting Linux Usernames](virtual-machines-linux-usernames.md)
6. [The basics: Log on to a Linux VM Using the Azure classic portal](virtual-machines-linux-classic-log-on.md)
7. [The basics: SSH](virtual-machines-linux-ssh-from-linux.md)
8. [The basics: How to Reset a Password or SSH Properties for Linux](virtual-machines-linux-classic-reset-access.md)
9. [The basics: Using Root](virtual-machines-linux-use-root-privileges.md)
10. [The basics: Attaching a Data Disk to a Linux VM](virtual-machines-linux-classic-attach-disk.md)
11. [The basics: Detaching a Data Disk from a Linux VM](virtual-machines-linux-classic-detach-disk.md)
12. [Blogging the basics: Optimizing Storage, Disks, and Performance with Linux and Azure](http://blogs.msdn.com/b/igorpag/archive/2014/10/23/azure-storage-secrets-and-linux-i-o-optimizations.aspx)
13. [The basics: RAID](virtual-machines-linux-configure-raid.md)
14. [The basics: Capturing a Linux VM to Make a Template](virtual-machines-linux-classic-capture-image.md)
15. [The basics: The Azure Linux Agent](virtual-machines-linux-agent-user-guide.md)
16. [The basics: Azure VM Extensions and Features](virtual-machines-windows-extensions-features.md)
17. [The basics: Injecting Custom Data into a VM to use with Cloud-init](virtual-machines-windows-classic-inject-custom-data.md)
18. [Blogging the basics: Building Highly Available Linux on Azure in 12 Steps](http://blogs.technet.com/b/keithmayer/archive/2014/10/03/quick-start-guide-building-highly-available-linux-servers-in-the-cloud-on-microsoft-azure.aspx)
19. [Blogging the basics: Automate Provisioning Linux on Azure with Azure CLI, node.js, jhawk](http://blogs.technet.com/b/keithmayer/archive/2014/11/24/step-by-step-automated-provisioning-for-linux-in-the-cloud-with-microsoft-azure-xplat-cli-json-and-node-js-part-1.aspx)
23. [Azure Service Management REST API](https://msdn.microsoft.com/library/azure/ee460799.aspx) reference
24. [GlusterFS on Azure](http://dastouri.azurewebsites.net/gluster-on-azure-part-1/)

## Community images and repositories
4. [GitHub](https://github.com/Azure/) &mdash; for the Azure CLI, and many other tools and projects.
5. [Docker Hub Registry](https://registry.hub.docker.com/) &mdash; the registry for Docker container images.

## Data

This section contains information about several different storage approaches and technologies, including NoSQL, Relational, and Big Data.

### NoSQL

1. [Blog: 8 Open-source NoSql Databases for Azure](http://openness.microsoft.com/blog/2014/11/03/open-source-nosql-databases-microsoft-azure/)
2. Couchdb
    - [Slideshare (MSOpenTech): Experiences with CouchDb on Azure](http://www.slideshare.net/brianbenz/experiences-using-couchdb-inside-microsofts-azure-team)
    - [Blog: Running CouchDB-as-a-Service with node.js, CORS, and Grunt](http://msopentech.com/blog/2013/12/19/tutorial-building-multi-tier-windows-azure-web-application-use-cloudants-couchdb-service-node-js-cors-grunt-2/)
4. Cassandra
    - [How to: Running Cassandra with Linux on Azure and Accessing it from Node.js](virtual-machines-linux-classic-cassandra-nodejs.md)
5. Redis
    - [Blog: Redis on Windows in the Azure Redis Cache Service](http://msopentech.com/blog/2014/05/12/redis-on-windows/)
    - [Blog: Announcing ASP.NET Session State Provider for Redis Preview Release](http://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx)
6. RavenHQ
    - [Blog: RavenHQ Now Available in the Azure Marketplace](https://azure.microsoft.com/blog/2014/08/12/ravenhq-now-available-in-the-azure-store/)

### Big Data
2. Hadoop/Cloudera  
	- [Blog: Installing Hadoop on Azure Linux VMs](http://blogs.msdn.com/b/benjguin/archive/2013/04/05/how-to-install-hadoop-on-windows-azure-linux-virtual-machines.aspx)
3. [Azure HDInsight](https://azure.microsoft.com/documentation/learning-paths/hdinsight-self-guided-hadoop-training/) -- a fully managed Hadoop service on Azure.

### Relational database
2. MySQL
    - [How to: Install and Run MySQL](virtual-machines-linux-classic-mysql-on-opensuse.md)
    - [How to: Optimize Performance of MySQL on Azure](virtual-machines-linux-classic-optimize-mysql.md)
    - [How to: MySQL Clusters](virtual-machines-linux-classic-mysql-cluster.md)
    - [MySQL High Availability Architecture in Microsoft Azure](http://download.microsoft.com/download/6/1/C/61C0E37C-F252-4B33-9557-42B90BA3E472/MySQL_HADR_solution_in_Azure.pdf)
7. MariaDB
    - [How to: Create a Multi-Master cluster of MariaDbs](virtual-machines-linux-classic-mariadb-mysql-cluster.md)
8. [Installing Postgres with corosync, pg_bouncer using ILB](https://github.com/chgeuer/postgres-azure)


## Auth and encryption

Authentication and encryption are critical topics in software development, and there are many, many topics on the web that describe how to learn and use proper security techniques for both. We describe some of the basic usage to get up and running quickly with Linux and opensource workloads, as well pointing to tools to use to reset or remove remote security features on Azure. These are basic procedures, and we will be adding more complex scenarios soon.

4. [The basics: Certificate Use and Management](http://msdn.microsoft.com/library/azure/gg981929.aspx)
7. [The basics: SSH](virtual-machines-linux-ssh-from-linux.md)
8. [The basics: How to Reset a Password or SSH Properties for Linux](virtual-machines-linux-classic-reset-access.md)
9. [The basics: Using Root](virtual-machines-linux-use-root-privileges.md)

## Linux high performance computing (HPC)

Run HPC workloads on Linux VM clusters built with open-source tools or with Microsoft HPC Pack.

1.	[Quickstart template: Spin up a SLURM cluster](https://azure.microsoft.com/documentation/templates/slurm/)
 (and [blog post](http://blogs.technet.com/b/windowshpc/archive/2015/06/06/deploy-a-slurm-cluster-on-azure.aspx))
3.	[Quickstart template: Create an HPC cluster with Linux compute nodes](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-linux-cn/)
4.	[Tutorial: Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md)
5.	[Tutorial: Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](virtual-machines-linux-classic-hpcpack-cluster-namd.md)
6.	[Tutorial: Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md)


## Devops, management, and optimization

This section starts with a blog entry containing a series of videos on [Video: Azure Virtual Machines : Using Chef, Puppet and Docker for managing Linux VMs](https://azure.microsoft.com/blog/2014/12/15/azure-virtual-machines-using-chef-puppet-and-docker-for-managing-linux-vms/). However, the world of devops, management, and optimization is quite expansive and changing very quickly, so you should consider the list below a starting point.

1. Docker
	- [Using the Docker VM Extension from the Azure Command-line Interface (Azure CLI)](virtual-machines-linux-classic-cli-use-docker.md)
	- [Using the Docker VM Extension from the Azure portal](virtual-machines-linux-classic-portal-use-docker.md)
    - [Getting Started Quickly with Docker in the Azure Marketplace](virtual-machines-linux-classic-docker-quickstart.md)
	- [How to use docker-machine on Azure](virtual-machines-linux-classic-docker-machine.md)

2. [Fleet with CoreOS](virtual-machines-linux-classic-coreos-howto.md)
4. Kubernetes
	- [Complete guide to automated Kubernetes cluster deployment with CoreOS and Weave](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos/azure/README.md#kubernetes-on-azure-with-coreos-and-weave)
	- [Kubernetes Visualizer](https://azure.microsoft.com/blog/2014/08/28/hackathon-with-kubernetes-on-azure/)
5. Jenkins and Hudson
	- [Blog: Jenkins Slave Plug-in for Azure](http://msopentech.com/blog/2014/09/23/announcing-jenkins-slave-plugin-azure/)
	- [GitHub repo: Jenkins Storage Plug-in for Azure](https://github.com/jenkinsci/windows-azure-storage-plugin)
	- [Third Party: Hudson Slave Plug-in for Azure](http://wiki.hudson-ci.org/display/HUDSON/Azure+Slave+Plugin)
	- [Third Party: Hudson Storage Plug-in for Azure](https://github.com/hudson3-plugins/windows-azure-storage-plugin)
10. Chef
	- [Video: What is Chef and How does it Work?](https://msopentech.com/blog/2014/03/31/using-chef-to-manage-azure-resources/)

12. Azure Automation
	- [Video: How to Use Azure Automation with Linux VMs](http://channel9.msdn.com/Shows/Azure-Friday/Azure-Automation-104-managing-Linux-and-creating-Modules-with-Joe-Levy)
13. Powershell DSC for Linux
    - [Blog: How to do Powershell DSC for Linux](http://blogs.technet.com/b/privatecloud/archive/2014/05/19/powershell-dsc-for-linux-step-by-step.aspx)
    - [GitHub: Docker Client DSC](https://github.com/anweiss/DockerClientDSC)
13. [Ubuntu Juju](https://juju.ubuntu.com/docs/config-azure.html)
14. [Packer plugin for Azure](https://github.com/msopentech/packer-azure)

## Support, troubleshooting, and "it just doesn't work"

1. Microsoft support documentation
	- [Support: Support for Linux Images on Microsoft Azure](http://support2.microsoft.com/kb/2941892)
2. [Troubleshoot classic deployment issues with creating a new Linux virtual machine in Azure](virtual-machines-linux-classic-troubleshoot-deployment-new-vm.md)
3. [Troubleshoot classic deployment issues with restarting or resizing an existing Linux Virtual Machine in Azure](virtual-machines-linux-classic-restart-resize-error-troubleshooting.md)


