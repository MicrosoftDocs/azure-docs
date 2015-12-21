<properties
   pageTitle="Deploy Anywhere with Azure Service Fabric on Windows Server and Linux | Microsoft Azure"
   description="Service Fabric clusters will run on Windows Server and Linux, which means you'll be able to deploy and host Service Fabric applications anywhere you can run Windows Server and Linux."
   services="service-fabric"
   documentationCenter=".net"
   authors="kunalds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/19/2015"
   ms.author="kunalds"/>

# "Deploy Anywhere" on Windows Server or Linux with Service Fabric
With the addition of "Deploy Anywhere," Azure Service Fabric will allow the creation of Service Fabric clusters on any VMs or computers running Windows Server or Linux. This means you'll be able to deploy and run Service Fabric applications in any environment where you have a set of Windows Server or Linux computers that are interconnected, be it on-premises or with a cloud provider.

 Service Fabric provides a setup package for you to create Service Fabric clusters. A key benefit of the Deploy Anywhere feature is that there's no vendor lock-in when you build an application using Service Fabric, since you choose where those applications run. This feature also increases your potential to reach out to a broader customer base, because customers can have varying requirements for the environments where they want to run your applications. For example, customers in the healthcare and financial industries may have different needs than customers in the auto or travel industries.

The technical preview of this feature is expected to be released in Q1 2016.

## Supported operating systems
You will be able to create clusters on VMs or computers running these operating systems:
* Windows Server 2012 R2
* Windows Server 2016
* Linux

## Supported programming languages
You will be able to write Service Fabric applications with these programming languages:
* C#
* Java

## Cluster creation and configuration
Service Fabric will provide a setup package that you will download from Microsoft Download Center. Once you've downloaded this package, you will need to make changes to a configuration file to specify the settings for your cluster. Once the cluster settings have been edited, you will run a setup script that will create the cluster spanning the machines that you specified in your cluster settings.

The exact details of the setup process will be shared when we release the preview of this functionality in Q1 2016.

## Cloud deployments vs. on-premises deployments
The process for creating a Service Fabric cluster on-premises will be similar to the process of creating a cluster on any cloud of your choice with a set of VMs. The initial steps to provision the VMs will be governed by the cloud or on-premises environment that you are using. Once you have a set of VMs with network connectivity enabled between them, then the steps to set up the Service Fabric package, edit the cluster settings, and run the cluster creation and management scripts will be similar. This ensures that your knowledge and experience of operating and managing Service Fabric clusters are transferrable when you choose to target new hosting environments.

## Benefits of the Deploy Anywhere feature
* Because there's no vendor lock-in, you can choose where the applications run .
* Service Fabric applications, once written, can be run in multiple hosting environments with minimal to no changes.
* Knowledge of building Service Fabric applications carries over from one hosting platform to others.
* Operational experience of running Service Fabric clusters carries over from one deployment environment to others.
* Broad customer reach is unbounded by hosting environment constraints.
* An extra layer of reliability and protection against widespread outages exists because you can move the services over to another deployment environment if a data center or cloud provider has a blackout.

## Advantages of Service Fabric managed clusters on Azure over Service Fabric clusters created and managed using Deploy Anywhere
Running Service Fabric clusters on Azure provides a few advantages over using the Deploy Anywhere option, so if you don't have specific needs for where you run your clusters, then we suggest that you run them on Azure. On Azure, we provide integration with other Azure features and services, which makes operations and management of the cluster easier:

* **Azure portal:** Azure portal makes it easy to create and manage clusters.
* **Azure Resource Manager:** Use of Azure Resource Manager allows easy management of all resources used by the cluster as a unit and simplifies cost tracking and billing.
* **Diagnostics:** On Azure, we provide  integration with Azure Diagnostics and Operational Insights.
* **Auto-scaling:** For clusters on Azure, we provide built-in auto-scaling functionality. In other environments using the Deploy Anywhere feature, you will have to build your own auto-scaling feature or scale manually using the APIs that Service Fabric exposes for scaling clusters.
