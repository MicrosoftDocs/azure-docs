<properties
   pageTitle="Azure Container Service Introduction | Microsoft Azure"
   description="Azure Container Service (ACS) provides a way to simplify the creation, configuration, and management of a cluster of virtual machines that are preconfigured to run containerized applications."
   services="container-service"
   documentationCenter=""
   authors="rgardler"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>
   
<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/16/2016"
   ms.author="rogardle"/>

# Azure Container Service introduction

Azure Container Service (ACS) provides a way to simplify the creation,
configuration, and management of a cluster of virtual machines that are
preconfigured to run containerized applications. Using an optimized
configuration of popular open-source scheduling and orchestration tools,
ACS enables you to use your existing skills or draw upon a large and
growing body of community expertise to deploy and manage container-based
applications on Microsoft Azure.

<br />
![ACS provides a means to manage containerize applications on multiple hosts on Azure.](./media/acs-intro/acs-cluster.png)
<br /><br />

ACS leverages the Docker container format to ensure that your
application containers are fully portable. It also supports your
choice of Marathon and Apache Mesos or Docker Swarm to ensure that
these applications can be scaled to thousands, even tens of thousands
of containers.

The Azure Container Service enables you to take advantage of the
enterprise grade features of Azure while still maintaining application
portability, including at the orchestration layers.

Using Azure Container Service
-----------------------------

Our goal with the Azure Container Service is to provide a container
hosting environment, using open source tools and technologies, which
are popular among our customers today. To this end, we expose the
standard API endpoints for your chosen orchestrator. Using these
endpoints you can leverage any software that is capable of talking to
those endpoints. For example, in the case of the Docker Swarm endpoint
you might choose to use Docker CLI, while for Apache Mesos you may
choose to use the DCOS CLI.

Creating a Docker Cluster Using Azure Container Service
-------------------------------------------------------

To begin using Azure Container Service, an ACS cluster will be deployed using an Azure Resource Manager template. This deployment can be configured with different size and availability options, and will be configured with either Apache Mesos or Docker Swarm. Azure Resource Manager Templates can be deployed through the Azure portal, using the Azure CLI, or with PowerShell. The templates can also be modified to include additional or advanced Azure configuration. For more information on deploying and ACS cluster, see [Deploy an Azure container Service Cluster](./container-service-deployment.md).

Deploying an Application
------------------------

During preview we provide a choice of either Docker Swarm or Apache
Mesos (with DCOS Marathon and DCOS Chronos frameworks)
for orchestration. 

### Using Apache Mesos

Apache Mesos is an open source project housed at the Apache Software
Foundation. It lists some of the [biggest names in
IT](http://mesos.apache.org/documentation/latest/powered-by-mesos/) as
users and contributors.

![ACS configured for Swarm showing agents and masters.](media/acs-intro/acs-mesos.png)

Mesos packs an impressive feature set.

-   Scalability to 10,000s of nodes

-   Fault-tolerant replicated master and slaves using ZooKeeper

-   Support for Docker formatted containers

-   Native isolation between tasks with Linux Containers

-   Multi-resource scheduling (memory, CPU, disk, and ports)

-   Java, Python and C++ APIs for developing new parallel applications

-   Web UI for viewing cluster state

Mesos has support for a large number of
[frameworks](http://mesos.apache.org/documentation/latest/frameworks/)
that can be used for scheduling workloads on the Azure Container
Service. By default, ACS includes the Marathon and Chronos frameworks.

#### Using Marathon and Chronos

Marathon is a cluster-wide init and control system for services in
cgroups or, in the case of ACS, Docker format containers. It is an
ideal partner to Chronos, a fault tolerant job scheduler for Mesos
which handles dependencies and time based schedules.

Marathon and Chronos provide a Web UI from which you can deploy your
applications. You will access this at an URL that looks something like
`http://DNS\_PREFIX.REGION.cloudapp.azure.com`
where DNS\_PREFIX and REGION are both defined at deployment time. Of
course, you can also provide your own DNS name. For more information on running a container using the Marathon web UI, see [Container management through the web UI](./container-service-mesos-marathon-ui.md).

You can also use the REST APIs for communicating with Marathon and
Chronos. There are a number of client libraries available for each tool,
covering a variety of languages and, of course, you can use the HTTP
protocol in any language. In addition, many popular DevOps tools provide
support for these schedulers. This provides maximum flexibility for your
operations team when working with an ACS cluster. For more information on running a container using the Marathon REST API, see [Container management with the REST API](./container-service-mesos-marathon-rest.md).

### Using Docker Swarm

Docker Swarm provides native clustering for Docker. Because Docker Swarm
serves the standard Docker API, any tool that already communicates with
a Docker daemon can use Swarm to transparently scale to multiple hosts
on Azure Container Service. 

![ACS configured to use Apache Mesos, showing jumpbox, agents and masters.](media/acs-intro/acs-swarm.png)

Supported tools for managing containers on a Swarm cluster include, but are not limited
to, the following:

-   Dokku

-   Docker CLI and Docker Compose

-   Krane

-   Jenkins

Videos
------
AzureCon Announcement:

> [AZURE.VIDEO azurecon-2015-deep-dive-on-the-azure-container-service-with-mesos]  

Getting Started with ACS:  

> [AZURE.VIDEO connect-2015-getting-started-developing-with-docker-and-azure-container-service]
