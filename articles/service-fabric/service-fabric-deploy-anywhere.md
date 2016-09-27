<properties
   pageTitle="Create Azure Service Fabric clusters on Windows Server and Linux | Microsoft Azure"
   description="Service Fabric clusters run on Windows Server and Linux, which means you'll be able to deploy and host Service Fabric applications anywhere you can run Windows Server or Linux."
   services="service-fabric"
   documentationCenter=".net"
   authors="Chackdan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/02/2016"
   ms.author="chackdan"/>

# Create standalone Service Fabric clusters on Windows Server or Linux
Azure Service Fabric allows the creation of Service Fabric clusters on any VMs or computers running Windows Server or Linux. This means you'll be able to deploy and run Service Fabric applications in any environment where you have a set of Windows Server or Linux computers that are interconnected, be it on-premises or with any cloud provider.

**Note**: Creating a cluster on Azure should be done either via an Azure Resource Model template or the Azure portal. Read [Create a Service Fabric cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md) or [Create a Service Fabric cluster from the Azure portal](service-fabric-cluster-creation-via-portal.md) for more information.

Service Fabric provides an install package for you to create these standalone Service Fabric clusters on-premises. A key benefit of this is that there's no vendor lock-in when you build an application using Service Fabric, since you choose where those applications run. This also increases your ability to reach out to a broader customer base, because customers can have varying requirements for the environments where they want to run your applications. For example, customers in the healthcare and financial industries may have different needs than customers in the auto or travel industries. 

## Supported operating systems
You will be able to create clusters on VMs or computers running these operating systems:

* Windows Server 2012 R2
* Windows Server 2016
* Linux

For more information on Windows Server read [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)

## Cluster creation and configuration
Service Fabric provides an install package that you can download. Once you've downloaded this package, you will need to make changes to a JSON configuration file to specify the settings for your cluster. Once the cluster settings have been edited, you run a setup script that creates the cluster spanning the machines that you specified in your cluster settings. You can also run a script to remove a cluster from a set of machines.

## Any cloud deployments vs. on-premises deployments
The process for creating a Service Fabric cluster on-premises is similar to the process of creating a cluster on any cloud of your choice with a set of VMs. The initial steps to provision the VMs will be governed by the cloud provider or on-premises environment that you are using. Once you have a set of VMs with network connectivity enabled between them, then the steps to set up the Service Fabric package, edit the cluster settings, and run the cluster creation and management scripts are identical. This ensures that your knowledge and experience of operating and managing Service Fabric clusters is transferrable when you choose to target new hosting environments.

## Benefits of creating standalone Service Fabric clusters
* Because there's no vendor lock-in, you can choose where to create your cluster.
* Service Fabric applications, once written, can be run in multiple hosting environments with minimal to no changes.
* Knowledge of building Service Fabric applications carries over from one hosting environment to another.
* Operational experience of running and managing Service Fabric clusters carries over from one environment to another.
* Broad customer reach is unbounded by hosting environment constraints.
* An extra layer of reliability and protection against widespread outages exists because you can move the services over to another deployment environment if a data center or cloud provider has a blackout.

## Advantages of Service Fabric clusters on Azure over standalone Service Fabric clusters created on-premises
Running Service Fabric clusters on Azure provides advantages over the on-premises option, so if you don't have specific needs for where you run your clusters, then we suggest that you run them on Azure. On Azure, we provide integration with other Azure features and services, which makes operations and management of the cluster easier and more reliable.

* **Azure portal:** Azure portal makes it easy to create and manage clusters.

* **Azure Resource Manager:** Use of Azure Resource Manager allows easy management of all resources used by the cluster as a unit and simplifies cost tracking and billing.
* **Service Fabric Cluster as an Azure Resource** A Service Fabric cluster is an ARM resource, so you can model it like you do other ARM resources in Azure.
* **Integration with Azure Infrastructure** Service Fabric coordinates with the underlying Azure infrastructure for OS, network and other upgrades to improve availability and reliability of your applications.  
* **Diagnostics:** On Azure, we provide integration with Azure diagnostics and Log Analytics.
* **Auto-scaling:** For clusters on Azure, we provide built-in auto-scaling functionality due to Virtual Machine scale-sets. In on-premises and other cloud environments you will have to build your own auto-scaling feature or scale manually using the APIs that Service Fabric exposes for scaling clusters.

## Next steps
Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)

Create a cluster on VMs or computers running Linux: [Service Fabric on Linux](service-fabric-linux-overview.md)
