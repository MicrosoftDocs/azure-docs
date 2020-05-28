---
title: (DEPRECATED) Azure Container Service - FAQ
description: Answers frequently asked questions about Azure Container Service, a service that simplifies the creation, configuration, and management of a cluster of virtual machines to run Docker container apps.
services: container-service
author: mlearned
manager: gwallace

ms.service: container-service
ms.topic: conceptual
ms.date: 03/28/2017
ms.author: mlearned
ms.custom: H1Hack27Feb201
---

# (DEPRECATED) Container Service frequently asked questions

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

## Orchestrators

### Which container orchestrators do you support on Azure Container Service? 

There is support for open-source DC/OS, Docker Swarm, and Kubernetes. For more information, see the [Overview](../kubernetes/container-service-intro-kubernetes.md).
 
### Do you support Docker Swarm mode? 

Currently Swarm mode is not supported, but it is on the service roadmap. 

### Does Azure Container Service support Windows containers?  

Currently Linux containers are supported with all orchestrators. Support for Windows containers with Kubernetes is in preview.

### Do you recommend a specific orchestrator in Azure Container Service? 
Generally we do not recommend a specific orchestrator. If you have experience with one of the supported orchestrators, you can apply that experience in Azure Container Service. Data trends suggest, however, that DC/OS is production proven for Big Data and IoT workloads, Kubernetes is suited for cloud-native workloads, and Docker Swarm is known for its integration with Docker tools and easy learning curve.

Depending on your scenario, you can also build and manage custom container solutions with other Azure services. These services include [Virtual Machines](../../virtual-machines/linux/overview.md), [Service Fabric](../../service-fabric/service-fabric-overview.md), [Web Apps](../../app-service/overview.md), and [Batch](../../batch/batch-technical-overview.md).  

### What is the difference between Azure Container Service and ACS Engine? 
Azure Container Service is an SLA-backed Azure service with features in the Azure portal, Azure command-line tools, and Azure APIs. The service enables you to quickly implement and manage clusters running standard container orchestration tools with a relatively small number of configuration choices. 

[ACS Engine](https://github.com/Azure/acs-engine) is an open-source project that enables power users to customize the cluster configuration at every level. This ability to alter the configuration of both infrastructure and software means that we offer no SLA for ACS Engine. Support is handled through the open-source project on GitHub rather than through official Microsoft channels. 

For additional details please refer to our [support policy for containers](https://support.microsoft.com/en-us/help/4035670/support-policy-for-containers).

## Cluster management

### How do I create SSH keys for my cluster?

You can use standard tools on your operating system to create an SSH RSA public and private key pair for authentication against the Linux virtual machines for your cluster. For steps, see the [OS X and Linux](../../virtual-machines/linux/mac-create-ssh-keys.md) or [Windows](../../virtual-machines/linux/ssh-from-windows.md) guidance. 

If you use Azure CLI commands to deploy a container service cluster, SSH keys can be automatically generated for your cluster.

### How do I create a service principal for my Kubernetes cluster?

An Azure Active Directory service principal ID and password are also needed to create a Kubernetes cluster in Azure Container Service. For more information, see [About the service principal for a Kubernetes cluster](../../container-service/kubernetes/container-service-kubernetes-service-principal.md).

If you use [Azure CLI commands](../../container-service/dcos-swarm/container-service-create-acs-cluster-cli.md) to deploy a Kubernetes cluster, service principal credentials can be automatically generated for your cluster.

### How large a cluster can I create?
You can create a cluster with 1, 3, or 5 master nodes. You can choose up to 100 agent nodes.

> [!IMPORTANT]
> For larger clusters and depending on the VM size you choose for your nodes, you might need to increase the cores quota in your subscription. To request a quota increase, open an [online customer support request](../../azure-portal/supportability/how-to-create-azure-support-request.md) at no charge. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.
> 

### How do I increase the number of masters after a cluster is created? 
Once the cluster is created, the number of masters is fixed and cannot be changed. During the creation of the cluster, you should ideally select multiple masters for high availability.

### How do I increase the number of agents after a cluster is created? 
You can scale the number of agents in the cluster by using the Azure portal or command-line tools. See [Scale an Azure Container Service cluster](../../container-service/kubernetes/container-service-scale.md).

### What are the URLs of my masters and agents? 
The URLs of cluster resources in Azure Container Service are based on the DNS name prefix you supply and the name of the Azure region you chose for deployment. For example, the fully qualified domain name (FQDN) of the master node is of this form:

``` 
DNSnamePrefix.AzureRegion.cloudapp.azure.net
```

You can find commonly used URLs for your cluster in the Azure portal, the Azure Resource Explorer, or other Azure tools.

### How do I tell which orchestrator version is running in my cluster?

* DC/OS: See the [Mesosphere documentation](https://docs.mesosphere.com/1.7/usage/cli/command-reference/)
* Docker Swarm: Run `docker version`
* Kubernetes: Run `kubectl version`

### How do I upgrade the orchestrator after deployment?

Currently, Azure Container Service doesn't provide tools to upgrade the version of the orchestrator you deployed on your cluster. If Container Service supports a later version, you can deploy a new cluster. Another option is to use orchestrator-specific tools if they are available to upgrade a cluster in-place. For example, see [DC/OS Upgrading](http://docs.mesosphere.com/1.12/installing/production/upgrading).
 
### Where do I find the SSH connection string to my cluster?

You can find the connection string in the Azure portal, or by using Azure command-line tools. 

1. In the portal, navigate to the resource group for the cluster deployment.  

2. Click **Overview** and click the link for **Deployments** under **Essentials**. 

3. In the **Deployment history** blade, click the deployment that has a name beginning with **microsoft-acs** followed by a deployment date. Example: microsoft-acs-201701310000.  

4. On the **Summary** page, under **Outputs**, several cluster links are provided. **SSHMaster0** provides an SSH connection string to the first master in your container service cluster. 

As previously noted, you can also use Azure tools to find the FQDN of the master. Make an SSH connection to the master using the FQDN of the master and the user name you specified when creating the cluster. For example:

```bash
ssh userName@masterFQDN –A –p 22 
```

For more information, see [Connect to an Azure Container Service cluster](../../container-service/kubernetes/container-service-connect.md).

### My DNS name resolution isn't working on Windows. What should I do?

There are some known DNS issues on Windows whose fixes are still actively being phased out. Please ensure you are using the most updated acs-engine and Windows version (with [KB4074588](https://www.catalog.update.microsoft.com/Search.aspx?q=KB4074588) and [KB4089848](https://www.catalog.update.microsoft.com/Search.aspx?q=KB4089848) installed) so that your environment can benefit from this. Otherwise, please see the table below for mitigation steps:

| DNS Symptom | Workaround  |
|-------------|-------------|
|When workload container is unstable and crashes, the network namespace is cleaned up | Redeploy any affected services |
| Service VIP access is broken | Configure a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) to always keep one normal (non-privileged) pod running |
|When node on which container is running becomes unavailable, DNS queries may fail resulting in a "negative cache entry" | Run the following inside affected containers: <ul><li> `New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters' -Name MaxCacheTtl -Value 0 -Type DWord`</li><li>`New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters' -Name MaxNegativeCacheTtl -Value 0 -Type DWord`</li><li>`Restart-Service dnscache` </li></ul><br> If this still doesn't resolve the problem, then try to disable DNS caching completely: <ul><li>`Set-Service dnscache -StartupType disabled`</li><li>`Stop-Service dnscache`</li></ul> |

## Next steps

* [Learn more](../../container-service/kubernetes/container-service-intro-kubernetes.md) about Azure Container Service.
* Deploy a container service cluster using the [portal](../../container-service/dcos-swarm/container-service-deployment.md) or the [Azure CLI](../../container-service/dcos-swarm/container-service-create-acs-cluster-cli.md).

