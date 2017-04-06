---
title: Azure Container Service - FAQ | Microsoft Docs
description: Answers frequently asked questions about Azure Container Service, a service that simplifies the creation, configuration, and management of a cluster of virtual machines to run Docker container apps.
services: container-service
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Mesos, Azure, Kubernetes

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/21/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017

---
# Container Service frequently asked questions


## Orchestrators

### Which container orchestrators do you support on Azure Container Service? 

There is support for open-source DC/OS, Docker Swarm, and Kubernetes. For more information, see the [Overview](container-service-intro.md).
 
### Do you support Docker Swarm mode? 

Currently Swarm mode is not supported, but it is on the service roadmap. 

### Does Azure Container Service support Windows containers?  

Currently Linux containers are supported with all orchestrators. Support for Windows containers with Kubernetes is in preview.

### Do you recommend a specific orchestrator in Azure Container Service? 
Generally we do not recommend a specific orchestrator. If you have experience with one of the supported orchestrators, you can apply that experience in Azure Container Service. Data trends suggest, however, that DC/OS is production proven for Big Data and IoT workloads, Kubernetes is suited for cloud-native workloads, and Docker Swarm is known for its integration with Docker tools and easy learning curve.

Depending on your scenario, you can also build and manage custom container solutions with other Azure services. These services include [Virtual Machines](../virtual-machines/virtual-machines-linux-azure-overview.md), [Service Fabric](../service-fabric/service-fabric-overview.md), [Web Apps](../app-service-web/app-service-web-overview.md), and [Batch](../batch/batch-technical-overview.md).  

### What is the difference between Azure Container Service and ACS Engine? 
Azure Container Service is an SLA-backed Azure service with features in the Azure portal, Azure command-line tools, and Azure APIs. The service enables you to quickly implement and manage clusters running standard container orchestration tools with a relatively small number of configuration choices. 

[ACS Engine](http://github.com/Azure/acs-engine) is an open-source project that enables power users to customize the cluster configuration at every level. This ability to alter the configuration of both infrastructure and software means that we offer no SLA for ACS Engine. Support is handled through the open-source project on GitHub rather than through official Microsoft channels. 

## Cluster management

### How do I create SSH keys for my cluster?

You can use standard tools on your operating system to create an SSH RSA public and private key pair for authentication against the Linux virtual machines for your cluster. For steps, see the [OS X and Linux](../virtual-machines/virtual-machines-linux-mac-create-ssh-keys.md) or [Windows](../virtual-machines/virtual-machines-linux-ssh-from-windows.md) guidance. 

If you use [Azure CLI 2.0 commands](container-service-create-acs-cluster-cli.md) to deploy a container service cluster, SSH keys can be automatically generated for your cluster.

### How do I create a service principal for my Kubernetes cluster?

An Azure Active Directory service principal ID and password are also needed to create a Kubernetes cluster in Azure Container Service. For more information, see [About the service principal for a Kubernetes cluster](container-service-kubernetes-service-principal.md).


If you use [Azure CLI 2.0 commands](container-service-create-acs-cluster-cli.md) to deploy a Kubernetes cluster, service principal credentials can be automatically generated for your cluster.


### How do I increase the number of masters after a cluster is created? 
Once the cluster is created, the number of masters is fixed and cannot be changed. During the creation of the cluster, you should ideally select multiple masters for high availability.


### How do I increase the number of agents after a cluster is created? 
You can scale the number of agents in the cluster by using the Azure portal or command-line tools. See [Scale an Azure Container Service cluster](container-service-scale.md).


### What are the URLs of my masters and agents? 
The URLs of cluster resources in Azure Container Service are based on the DNS name prefix you supply and the name of the Azure region you chose for deployment. For example, the fully qualified domain name (FQDN) of the master node is of this form:

``` 
DNSnamePrefix.AzureRegion.cloudapp.azure.net
```

You can find commonly used URLs for your cluster in the Azure portal, the Azure Resource Explorer, or other Azure tools.

### How do I upgrade the orchestrator after deployment?

Currently, Azure Container Service doesn't provide tools to upgrade the version of the orchestrator you deployed on your cluster. If Container Service supports a later version, you can deploy a new cluster. Another option is to use orchestrator-specific tools if they are available to upgrade a cluster in-place. For example, see [DC/OS Upgrading](https://dcos.io/docs/1.8/administration/upgrading/).
 
### Where do I find the SSH connection string to my cluster?

You can find the connection string in the Azure portal, or by using Azure command-line tools. 

1. In the portal, navigate to the resource group for the cluster deployment.  

2. Click **Overview** and click the link for **Deployments** under **Essentials**. 

3. In the **Deployment history** blade, click the deployment that has a name beginning with **microsoft-acs** followed by a deployment date. Example: microsoft-acs-201701310000.  

4. On the **Summary** page, under **Outputs**, several cluster links are <provided></provided>. **SSHMaster0** provides an SSH connection string to the first master in your container service cluster. 

As previously noted, you can also use Azure tools to find the FQDN of the master. Make an SSH connection to the master using the FQDN of the master and the user name you specified when creating the cluster. For example:

```bash
ssh userName@masterFQDN –A –p 22 
```

For more information, see [Connect to an Azure Container Service cluster](container-service-connect.md).




## Next steps

* [Learn more](container-service-intro.md) about Azure Container Service.
* Deploy a container service cluster using the [portal](container-service-deployment.md) or [Azure CLI 2.0](container-service-create-acs-cluster-cli.md).