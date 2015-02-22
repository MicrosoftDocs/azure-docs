<properties
  pageTitle="Linux and Open-Source Computing on Azure"
  description="This topic contains a list of Linux and Open-Source Computing on Azure, including basic Linux usage, some fundamental concepts about running or uploading Linux images on Azure, and other content about specific technologies and optimizations."
  documentationCenter=""
  authors="squillace"
  manager="timlt"
  editor="tysonn"/>

<tags
  ms.service="virtual-machines"
  ms.devlang="NA"
  ms.topic="article"
  ms.tgt_pltfrm="vm-linux"
  ms.workload="infrastructure-services"
  ms.date="02/17/2015"
  ms.author="rasquill"/>


<!--The next line, with one pound sign at the beginning, is the page title-->
# Linux and Open-Source Computing on Azure

This document attempts to list in one place all the topics written by Microsoft and its partners about running Linux-based Virtual Machines as well as other open-source compute environments and applications on Microsoft Azure. As both Azure and the open-source computing world are fast-moving targets, it is almost certain that this document is out of date, *despite* the fact that we shall do our best to continually add newer topics and remove out-of-date ones. If we've missed one, please let us know in the comments, or submit a pull request to our [Github repo](https://github.com/Azure/azure-content/).

The sections are broken down as follows. (Links may occur in more than one section, as topics can be about more than one concept, distro, or technology.)

- [Distros](#distros) &mdash; Topics to do with a specific distro.
- [The Basics](#basics) &mdash; A lot of the basic things to do that you either know or need to know.
- [Community Images and Repositories](#images) &mdash; Other places for very useful information, repositories, and binaries.
- [Languages and Platforms](#langsandplats)
- [Samples and Scripts](#samples)
- [Auth and Encryption](#security) &mdash; Important security-related topics, not necessarily specific to Azure.
- [Devops, Management, and Optimization](#devops) &mdash; A big category, changing rapidly.
- [Support, Troubleshooting, and "It Just Doesn't Work"](#supportdebug) &mdash; Really.

In addition, there are several topics that describe various Linux options, image repositories, case studies, and how-to topics to upload your own custom images: 

- [Azure Marketplace](http://azure.microsoft.com/en-us/marketplace/virtual-machines/)
- [MSOpenTech VM Depot](https://vmdepot.msopentech.com/List/Index)
- [Events and Demonstrations: Microsoft Openness CEE](http://www.opennessatcee.com/)
- [How to: Uploading your own Distro Image](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-vhd/) (and also instructions using an [Azure-Endorsed Distribution](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-endorsed-distributions/))
- [Notes: General Linux Requirements to Run in Azure](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-vhd-generic/)
- [Notes: General Introduction for Linux on Azure](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-introduction/)


### <a id='distros'>Distros</a>

There are tons of Linux distributions, usually broken down by the package management systems: Some are dpgk-based, like Debian and Ubuntu, and others are rpm-based, like CentOS, SUSE, and RedHat. Some companies provide distro images as formal partners of Microsoft and are endorsed. Others are provided by the community. The distros in this section have formal articles about them, even if they were only used in examples of other technologies.


#### [Ubuntu](http://azure.microsoft.com/en-us/marketplace/partners/Canonical/)

Ubuntu is a very popular and Azure-endorsed Linux distribution based on dkpg and apt-get package management.

1. [How to: Upload your own Ubuntu Image](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-vhd-ubuntu/)
2. [How to: Ubuntu LAMP Stack](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-install-lamp-stack/)
2. [Images: LAPP Stack](http://azure.microsoft.com/en-us/marketplace/partners/bitnami/lappstack54310ubuntu1404/)
3. [How to: MySQL Clusters](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-mysql-cluster/)
4. [How to: Node.js and Cassandra](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-nodejs-running-cassandra/)
5. [How to: IPython Notebook](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-python-ipython-notebook/)
6. [Geeking out: Running ASP.NET 5 on Linux using Docker Containers](http://blogs.msdn.com/b/webdev/archive/2015/01/14/running-asp-net-5-applications-in-linux-containers-with-docker.aspx)
7. [Images: Redis Server](http://azure.microsoft.com/en-us/marketplace/partners/cognosys/redisserver269ubuntu1204lts/)
8. [Images: Minecraft Server](http://azure.microsoft.com/en-us/marketplace/partners/bitnami/craftbukkitminecraft179r030ubuntu1210/)
9. [Images: Moodle](http://azure.microsoft.com/en-us/marketplace/partners/bitnami/moodle270ubuntu1404/)
11. [Images: Mono as a Service](http://azure.microsoft.com/en-us/marketplace/partners/aegis/monoasaserviceubuntu1204/)

#### [Debian](https://vmdepot.msopentech.com/List/Index?sort=Featured&search=Debian)

Debian is an important distribution for the Linux and open-source world based on dpgk and apt-get package management. The MSOpenTech VM Depot has several images to use.

#### CentOS

The CentOS Linux distribution is a stable, predictable, manageable and reproduceable platform derived from the sources of Red Hat Enterprise Linux (RHEL).

1. [MSOpenTech VM Depot](https://vmdepot.msopentech.com/List/Index?sort=Featured&search=centos)
2. [Image Gallery](http://azure.microsoft.com/en-in/marketplace/partners/OpenLogic/)
3. [How to: Prepare a Custom CentOS-Based VM for Azure](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-vhd-centos/)
4. [Blog: How to Deploy a CentOS VM Image from OpenLogic](http://azure.microsoft.com/blog/2013/01/11/deploying-openlogic-centos-images-on-windows-azure-virtual-machines/)
6. [How to: Install Apache Qpid Proton-C for AMQP and Service Bus](http://msdn.microsoft.com/en-us/library/azure/dn235560.aspx)
7. [Images: Apache 2.2.15 on OpenLogic CentOS 6.3](http://azure.microsoft.com/en-us/marketplace/partners/cognosys/apache2215onopenlogiccentos63/)
8. [Images: Drupal 7.2, LAMP Server on OpenLogic CentOS 6.3](http://azure.microsoft.com/en-us/marketplace/partners/cognosys/drupal720lampserveronopenlogiccentos63/)

#### SUSE Enterprise Linux and OpenSUSE

9. [MSOpenTech VM Depot](https://vmdepot.msopentech.com/List/Index?sort=Featured&search=OpenSUSE)
11. [How to: Install and Run MySQL](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-mysql-use-opensuse/)
12. [How To: Prep a Custom SLES or openSUSE VM](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-vhd-suse/)  
13. [[SUSE forum] How to: Move to a New Patch Server](https://forums.suse.com/showthread.php?5622-New-Update-Infrastructure)
14. [Images: SUSE Linux Enterprise Server for SAP Cloud Appliance  Library](http://azure.microsoft.com/en-us/marketplace/partners/suse/suselinuxenterpriseserver11sp3forsapcloudappliance/)

#### CoreOS

CoreOS is a small, optimized distro for pure compute scale with a high degree of control for customization.

10. [Image Gallery](http://azure.microsoft.com/en-in/marketplace/partners/coreos/)  
11. [How to: Use CoreOS on Azure](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-coreos-how-to/)
12. [Blog: TechEd Europe -- Windows Docker Client and Linux Containers](http://azure.microsoft.com/blog/2014/10/28/new-docker-coreos-topics-linux-on-azure/)
13. [Blog: Azure's getting bigger, faster, and more open](http://azure.microsoft.com/blog/2014/10/20/azures-getting-bigger-faster-and-more-open/)
14. [Github: Quickstart for Deploying CoreOS on Azure](https://github.com/timfpark/coreos-azure)
15. [Github: Deploying Java app with Spring Boot, MongoDB, and CoreOS](https://github.com/chanezon/azure-linux/tree/master/coreos/cloud-init)

#### [Oracle Linux](http://azure.microsoft.com/en-us/marketplace/?term=Oracle+Linux)
  2. [Prepare an Oracle Linux Virtual Machine for Azure](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-vhd-oracle/)

#### FreeBSD

12. [MSOpenTech VM Depot](https://vmdepot.msopentech.com/List/Index?sort=Date&search=FreeBSD)
13. [Blog: Running FreeBSD in Azure](http://azure.microsoft.com/blog/2014/05/22/running-freebsd-in-azure/)
14. [Blog: Easy Deploy FreeBSD](http://msopentech.com/blog/2014/10/24/easy-deploy-freebsd-microsoft-azure-vm-depot/)
15. [Blog: Deploying a Customized FreeBSD Image](http://msopentech.com/blog/2014/05/14/deploy-customize-freebsd-virtual-machine-image-microsoft-azure/)
17. [How to: Install the Azure Linux Agent](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-agent-user-guide/)
18. [Marketplace: Kaspersky AV for Linux File Server](http://azure.microsoft.com/en-us/marketplace/partners/kaspersky-lab/kav-for-lfs-kav-for-lfs/)

### <a id='basics'>The Basics</a>

1. [The Basics: Azure Command-Line Interface (cli)](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/)
4. [The Basics: Certificate Use and Management](http://msdn.microsoft.com/en-us/library/azure/gg981929.aspx)
5. [The Basics: Selecting Linux Usernames](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-usernames/)
6. [The Basics: Log on to a Linux VM Using the Azure Portal](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-how-to-log-on/)
7. [The Basics: SSH](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-ssh-key/)
8. [The Basics: How to Reset a Password or SSH Properties for Linux](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-vmaccess-reset-password-or-ssh/)
9. [The Basics: Using Root](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-root-privileges/)
10. [The Basics: Attaching a Data Disk to a Linux VM](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-how-to-attach-disk/)
11. [The Basics: Detaching a Data Disk from a Linux VM](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-how-to-detach-disk/)
12. [Blogging the Basics: Optimizing Storage, Disks, and Performance with Linux and Azure](http://blogs.msdn.com/b/igorpag/archive/2014/10/23/azure-storage-secrets-and-linux-i-o-optimizations.aspx)
13. [The Basics: RAID](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-configure-raid/)
14. [The Basics: Capturing a Linux VM to Make a Template](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-capture-image/)
15. [The Basics: The Azure Linux Agent](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-agent-user-guide/)
16. [The Basics: Azure VM Extensions and Features](http://msdn.microsoft.com/en-us/library/azure/dn606311.aspx)
17. [The Basics: Injecting Custom Data into a VM to use with Cloud-init](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-how-to-inject-custom-data/)
18. [Blogging the Basics: Building Highly Available Linux on Azure in 12 Steps](http://blogs.technet.com/b/keithmayer/archive/2014/10/03/quick-start-guide-building-highly-available-linux-servers-in-the-cloud-on-microsoft-azure.aspx)
19. [Blogging the Basics: Automate Provisioning Linux on Azure with xplat, node.js, jhawk](http://blogs.technet.com/b/keithmayer/archive/2014/11/24/step-by-step-automated-provisioning-for-linux-in-the-cloud-with-microsoft-azure-xplat-cli-json-and-node-js-part-1.aspx)
20. [The Basics: The Azure Docker VM Extension](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-docker-vm-extension/)
23. [Azure Service Management REST API](https://msdn.microsoft.com/en-us/library/azure/ee460799.aspx) reference

### <a id='images'>Community Images and Repositories</a>
3. [MSOpenTech VM Depot](https://vmdepot.msopentech.com/List/Index) &mdash; for community provided virtual machine images.
4. [Github](https://github.com/Azure/) &mdash; for the xplat-cli, and many other tools and projects.
5. [Docker Hub Registry](https://registry.hub.docker.com/) &mdash; the registry for Docker container images.


### <a id='langsandplats'>Languages and Platforms</a>
#### [Azure Java Dev Center](http://azure.microsoft.com/en-us/develop/java/)

1. [Images](https://vmdepot.msopentech.com/List/Index?sort=Featured&search=java)
2. [How to: Use Service Bus from Java with AMQP 1.0](http://msdn.microsoft.com/en-us/library/azure/jj841073.aspx)
3. [How to: Set up Tomcat7 on Linux Using the Azure Portal](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-setup-tomcat7-linux/)
4. [Video: Azure Java SDK for Service Management](http://channel9.msdn.com/Shows/Cloud+Cover/Episode-157-The-Java-SDK-for-Azure-Management-with-Brady-Gaster)
5. [Blog: Getting Started with Azure Management Libraries for Java](http://azure.microsoft.com/blog/2014/09/15/getting-started-with-the-azure-java-management-libraries/)
5. [Github repo: Azure Toolkit for Eclipse with Java](https://github.com/MSOpenTech/WindowsAzureToolkitForEclipseWithJava)
6. [Reference: Azure Toolkit for Eclipse with Java](http://msdn.microsoft.com/library/azure/hh694271.aspx)
7. [Github repo: MS Open Tech Tools plugin for IntelliJ IDEA and Android Studio](https://github.com/MSOpenTech/msopentech-tools-for-intellij)
7. [Blog: MSOpenTech Contributes to the OpenJDK](http://msopentech.com/blog/2014/10/21/ms-open-techs-first-contribution-openjdk/)
8. [Images: WebSphere](http://azure.microsoft.com/en-us/marketplace/partners/msopentech/was-8-5-was-8-5-5-3/)
9. [Images: WebLogic](http://azure.microsoft.com/en-us/marketplace/?term=weblogic)
10. [Images: JDK6 on Windows](http://azure.microsoft.com/en-us/marketplace/partners/msopentech/jdk6onwindowsserver2012/)
11. [Images: JDK7 on Windows](http://azure.microsoft.com/en-us/marketplace/partners/msopentech/jdk7onwindowsserver2012/)
12. [Images: JDK8 on Windows](http://azure.microsoft.com/en-us/marketplace/partners/msopentech/jdk8onwindowsserver2012r2/)

#### JVM Languages

1. [Scala: Running Play Framework Applications in Azure Cloud Services](http://msopentech.com/blog/2014/09/25/tutorial-running-play-framework-applications-microsoft-azure-cloud-services-2/)

#### SDK Types, Installations, Upgrades
4. [Azure Service Management SDK: Java](http://dl.windowsazure.com/javadoc/)
5. [Azure Service Management SDK: Go](https://github.com/MSOpenTech/azure-sdk-for-go)
5. [Azure Service Management SDK: Ruby](https://github.com/MSOpenTech/azure-sdk-for-ruby)
- [How to: Install Ruby on Rails](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-ruby-rails-web-app-linux/)
- [How to: Install Ruby on Rails with Capistrano, Nginx, Unicorn, and PostgreSQL](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/)
6. [Azure Service Management SDK: Python](https://github.com/Azure/azure-sdk-for-python)
- [How to: Django Hello World Web Application (Mac-Linux)](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-python-django-web-app-linux/)
7. [Azure Service Management SDK: Node.js](https://github.com/MSOpenTech/azure-sdk-for-node)
8. [Azure Service Management SDK: PHP](https://github.com/MSOpenTech/azure-sdk-for-php)
- [How to: Install the LAMP Stack on an Azure VM](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-install-lamp-stack/)
- [Video: Install a LAMP Stack on an Azure VM](http://channel9.msdn.com/Shows/Azure-Friday/LAMP-stack-on-Azure-VMs-with-Guy-Bowerman)
9. [Azure Service Management SDK: .NET](https://github.com/Azure/azure-sdk-for-net)
10. [Blog: Mono, ASP.NET 5, Linux, and Docker](http://blogs.msdn.com/b/webdev/archive/2015/01/14/running-asp-net-5-applications-in-linux-containers-with-docker.aspx)

### <a id='samples'>Samples and Scripts</a>

1. [Patrick Chanezon's Azure Linux Github repository](https://github.com/chanezon/azure-linux)
3. [Video: How to Move On-Premises USB data on Linux to Azure using **usbip**](http://channel9.msdn.com/Blogs/Open/On-premises-USB-devices-on-Linux-on-Azure-via-usbip)
4. [Video: Accessing Linux-based GUI on Azure in the Browser with fernapp](http://channel9.msdn.com/Blogs/Open/Accessing-Linux-based-GUI-on-Azure-over-browser-with-fernapp)
5. [Video: Shared Storage on Linux Using Azure Files Preview -- Part 1](http://channel9.msdn.com/Blogs/Open/Shared-storage-on-Linux-via-Azure-Files-Preview-Part-1)
6. [Video: Embracing Linux Devices on Azure using Service Bus and Web Sites](http://channel9.msdn.com/Blogs/Open/Embracing-Linux-devices-on-Azure-via-Service-Bus-and-Web-Sites)
7. [Video: Connecting a Native Linux-based memcached application to Windows Azure](http://channel9.msdn.com/Blogs/Open/Connecting-a-Linux-based-native-memcache-application-to-Windows-Azure)
8. [Video: Load Balancing Highly Available Linux Services on Azure: OpenLDAP and MySQL](http://channel9.msdn.com/Blogs/Open/Load-balancing-highly-available-Linux-services-on-Windows-Azure-OpenLDAP-and-MySQL)


### <a id='data'>Data</a>

This section contains information about several different storage approaches and technologies, including NoSQL, Relational, and Big Data.

#### Nosql

1. [Blog: 8 Open-source NoSql Databases for Azure](http://openness.microsoft.com/blog/2014/11/03/open-source-nosql-databases-microsoft-azure/)
2. Couchdb
- [Slideshare (MSOpenTech): Experiences with CouchDb on Azure](http://www.slideshare.net/brianbenz/experiences-using-couchdb-inside-microsofts-azure-team)
- [Blog: Running CouchDB-as-a-Service with node.js, CORS, and Grunt](http://msopentech.com/blog/2013/12/19/tutorial-building-multi-tier-windows-azure-web-application-use-cloudants-couchdb-service-node-js-cors-grunt-2/)
3. MongoDB
- [How to: Create a Node.js Application on Azure with MongoDB using the MongoLab Add-On](http://azure.microsoft.com/en-us/documentation/articles/store-mongolab-web-sites-nodejs-store-data-mongodb/)
4. Cassandra
- [How to: Running Cassandra with Linux on Azure and Accessing it from Node.js](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-nodejs-running-cassandra/)
5. Redis
- [Blog: Redis on Windows in the Azure Redis Cache Service](http://msopentech.com/blog/2014/05/12/redis-on-windows/)
- [Blog: Announcing ASP.NET Session State Provider for Redis Preview Release](http://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx)
6. RavenHQ
- [Blog: RavenHQ Now Available in the Azure Marketplace](http://azure.microsoft.com/blog/2014/08/12/ravenhq-now-available-in-the-azure-store/)

#### Big Data
2. Hadoop/Cloudera  
	- [Blog: Installing Hadoop on Azure Linux VMs](http://blogs.msdn.com/b/benjguin/archive/2013/04/05/how-to-install-hadoop-on-windows-azure-linux-virtual-machines.aspx)
	- [How to: Get Started with Hadoop and Hive using HDInsight](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-get-started/)  
3. [Azure HDInsight](http://azure.microsoft.com/en-us/services/hdinsight/) -- a fully managed Hadoop service on Azure.

#### Relational Data
2. MySQL
- [How to: Install and Run MySQL](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-mysql-use-opensuse/)
- [How to: Optimize Performance of MySQL on Azure](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-optimize-mysql-perf/)
- [How to: MySQL Clusters](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-mysql-cluster/)
- [How to: Create a MySQL Database using the Marketplace](http://azure.microsoft.com/en-us/documentation/articles/store-php-create-mysql-database/)
- [How to: Django and MySQL on Azure Websites with Python and Visual Studio](http://azure.microsoft.com/en-us/documentation/articles/web-sites-python-ptvs-django-mysql/)
- [How to: PHP and MySQL on Azure Websites with WebMatrix](http://azure.microsoft.com/en-us/documentation/articles/web-sites-php-mysql-use-webmatrix/)
7. MariaDB
- [How to: Create a Multi-Master cluster of MariaDbs](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-mariadb-cluster/)
7. PostgreSQL
- [How to: Install Ruby on Rails with Capistrano, Nginx, Unicorn, and PostgreSQL](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/)


### <a id='security'>Auth and Encryption</a>

Authentication and encryption are critical topics in software development, and there are many, many topics on the web that describe how to learn and use proper security techniques for both. We describe some of the basic usage to get up and running quickly with Linux and opensource workloads, as well pointing to tools to use to reset or remove remote security features on Azure.

4. [The Basics: Certificate Use and Management](http://msdn.microsoft.com/en-us/library/azure/gg981929.aspx)
7. [The Basics: SSH](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-ssh-key/)
8. [The Basics: How to Reset a Password or SSH Properties for Linux](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-vmaccess-reset-password-or-ssh/)
9. [The Basics: Using Root](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-root-privileges/)

### <a id='devops'>Devops, Management, and Optimization</a>

This section starts with a blog entry containing a series of videos on [Video: Azure Virtual Machines : Using Chef, Puppet and Docker for managing Linux VMs](http://azure.microsoft.com/blog/2014/12/15/azure-virtual-machines-using-chef-puppet-and-docker-for-managing-linux-vms/). However, the world of devops, management, and optimization is quite expansive and changing very quickly, so you should consider the list below a starting point.

1. Docker
	- [Docker VM Extension for Linux on Azure](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-docker-vm-extension/)
	- [Using the Docker VM Extension from the Azure Cross-Platform Command-line Interface (xplat-cli)](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-docker-with-xplat-cli/)
	- [Using the Docker VM Extension from the Azure Preview Portal](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-docker-with-portal/)
	- [Getting Started Quickly with Docker in the Azure Marketplace](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-docker-ubuntu-quickstart/)
2. [Fleet with CoreOS](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-coreos-how-to/)
3. Deis
	- [GitHub repo:
Installing Deis on a CoreOS cluster on Azure](https://github.com/chanezon/azure-linux/tree/master/coreos/deis)
4. Kubernetes
	- [Kubernetes Visualizer](http://azure.microsoft.com/blog/2014/08/28/hackathon-with-kubernetes-on-azure)
5. Jenkins and Hudson
	- [Blog: Jenkins Slave Plug-in for Azure](http://msopentech.com/blog/2014/09/23/announcing-jenkins-slave-plugin-azure/)
	- [GitHub repo: Jenkins Storage Plug-in for Azure](https://github.com/jenkinsci/windows-azure-storage-plugin)
	- [Third Party: Hudson Slave Plug-in for Azure](http://wiki.hudson-ci.org/display/HUDSON/Azure+Slave+Plugin)
	- [Third Party: Hudson Storage Plug-in for Azure](https://github.com/hudson3-plugins/windows-azure-storage-plugin)
10. Chef
	- [Chef and Virtual Machines](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-windows-install-chef-client/)
	- [Video: What is Chef and How does it Work?](https://msopentech.com/blog/2014/03/31/using-chef-to-manage-azure-resources/)

12. Azure Automation
	- [Video: How to Use Azure Automation with Linux VMs](http://channel9.msdn.com/Shows/Azure-Friday/Azure-Automation-104-managing-Linux-and-creating-Modules-with-Joe-Levy)
13. Powershell DSC for Linux
    - [Blog: How to do Powershell DSC for Linux](http://blogs.technet.com/b/privatecloud/archive/2014/05/19/powershell-dsc-for-linux-step-by-step.aspx)
    - [Github: Docker Client DSC](https://github.com/anweiss/DockerClientDSC)
13. [Ubuntu Juju](https://juju.ubuntu.com/docs/config-azure.html)
14. [Packer plugin for Azure](https://github.com/msopentech/packer-azure)

### <a id='supportdebug'>Support, Troubleshooting, and "It Just Doesn't Work"</a>

1. Microsoft support documentation
	- [Support: Support for Linux Images on Microsoft Azure](http://support2.microsoft.com/kb/2941892)


<!--Anchors-->
[Distros]: #distros
[The Basics]: #basics
[Community Images and Repositories]: #images
[Languages and Platforms]: #langsandplats
[Samples and Scripts]: #samples
[Auth and Encryption]: #security
[Devops, Management, and Optimization]: #devops
[Support, Troubleshooting, and "It Just Doesn't Work"]: #supportdebug
