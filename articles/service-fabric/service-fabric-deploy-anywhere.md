<properties
   pageTitle="Deploy Anywhere with Service Fabric(Windows Server and Linux) | Microsoft Azure"
   description="Service Fabric clusters will run on Windows Server and Linux enabling Service Fabric applications to be deployed and hosted anywhere you can run Windows Server and Linux."
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
Service Fabric will allow the creation of Service Fabric clusters on any VMs or machines running Windows Server or Linux. This enables Service Fabric applications to be deployed and run in any environment, be it on-premises or any cloud provider where you have a set of Windows Server or Linux machines that are interconnected. Service Fabric will provide a setup package for you to create Service Fabric clusters. A key benefit of the "Deploy Anywhere" feature is that there is no vendor lock-in when you build an application using Service Fabric since you choose where those applications run. This also increases your potential to reach out to a broader set of customer base since different customers can have varying requirements for the environments where they want to run your applications, for example Healthcare and Financial industry customers may have different needs than an Automaker or a Travel business. The technical preview of this feature is expected to be released in Q1 2016.

## Supported Operating Systems
You will be able to create clusters on VMs or machines running these operating systems:
* Windows Server 2012 R2
* Windows Server 2016
* Linux

## Supported programming languages
You will be able to write Service Fabric applications with any of these programming languages:
* C#
* Java

## Cluster creation and configuration
Service Fabric will provide a setup package that you will download from Microsoft Download Center. Once you have downloaded this package you will need to make changes to a configuration file to specify the settings for your cluster. Once the cluster settings have been edited you will run a setup script that will create the cluster spanning across the machines that you specified in your cluster settings. The exact details of the setup process will be shared when we release the preview of this functionality in Q1 2016. 

## Cloud Deployments vs. On-premises Deployments
The process for creating a Service Fabric cluster on-premises will be similar to the process of creating a cluster on any cloud of your choice where you have a set of VMs. The intial steps to provision the VMs will be goverened by the cloud or on-premises environment that you are using but once you have a set of VMs with network connectivity enabled between them then the next steps to setup the Service Fabric package, edit the cluster settings and running the cluster creation and management scripts will be similar. This ensures that your knowledge and experience of operating and managing Service Fabric clusters is transferrable when you choose to target new hosting environments. 

## Benefits of Deploy Anywhere feature
* No vendor lock-in.
* Service Fabric Applications once written can be run in multiple hosting environments with minimal to no changes.
* Knowledge of building Service Fabric applications carries over from one hosting platform to others.
* Operational experience of running Service Fabric clusters carries over from one deployment environment to others.
* Broad customer reach unbounded by hosting environment constraints.
* Extra layer of reliability and protection against widespread outages by moving the services over to another deployment environment if a data center or cloud provide has a blackout.

## Differences in Deploy Anywhere and Azure hosted Service Fabric clusters
Running Service Fabric clusters using the Azure Hosted Service provides a few benefits over using the Deploy Anywhere option so if you don't have specific needs with regards to where you run your clusters then we suggest that you run them as Azure hosted clusters. On Azure we provide integration with other Azure features and services which makes operations and management of the cluster easier:

* Azure Portal: Azure Portal makes it easy to create and manage clusters.
* Azure Resource Manager: Use of ARM allows easy management of all resources used by the cluser as a unit and simplies cost tracking and billing. 
* Diagnostics: On Azure we provide you integration with WAD (Windows Azure Diagnostics) and Operational Insights for diagnostics.
* Auto-scaling: For Azure hosted clusters we will provide built-in auto-scaling functionality. In other environments using Deploy Anywhere feature you will have to build your own auto-scaling feature or scale manually using the APIs that Service Fabric exposes for scaling clusters.
