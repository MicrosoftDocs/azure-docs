---
title: Overview of Azure DevOps Projects | Microsoft Docs
description: Understand the value for Azure DevOps Projects
services: devops-project
documentationcenter: ''
author: mlearned
manager: douge
editor: mlearned
ms.assetid: 
ms.service: az-devops-project
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload:
ms.date: 05/03/2018
ms.author: mlearned
#Customer intent: As a developer/devops resource, I want to quickly get started with CI/CD in Azure so I can automate the deployment of my application to an Azure service.
---
# Overview of Azure DevOps Projects

 Azure DevOps Projects makes it easy to get started on Azure. It  helps you launch your favorite app on the Azure service of your choice in just a few quick steps from the Azure portal. 

 DevOps Projects sets up everything you need for developing, deploying, and monitoring your application. You can use the DevOps Projects dashboard to monitor code commits, builds, and deployments, all from a single view in the Azure portal.

## Why should I use DevOps Projects?

  DevOps Project automates the setup of an entire continuous integration (CI) and continuous delivery (CD) pipeline to Azure.  You can start with existing code or use one of the provided sample applications. Then you can quickly deploy that application to various Azure services such as Virtual Machines, App Service, Azure Kubernetes Services (AKS), Azure SQL Database, and Azure Service Fabric.  

  DevOps Projects does all the work for the initial configuration of a DevOps pipeline including everything from setting up the initial Git repository, configuring the CI/CD pipeline, creating an Application Insights resource for monitoring, and providing a single view of the entire solution with the creation of a DevOps Projects dashboard in the Azure portal.

You can use DevOps Projects to:

* Quickly deploy your application to Azure
* Automate the setup of a CI/CD pipeline
* View and understand how to properly set up a CI/CD pipeline
* Further customize the release pipelines based on your specific scenarios

## How do I use DevOps Projects?

  DevOps Projects is available from the Azure portal. You create a DevOps Projects resource just like you create any other Azure resource from the portal. DevOps Projects provides a step-by-step wizard-like experience for the various configuration options.  

You choose several configuration options as part of the initial setup. These options include:

* Using the provided sample app, or bringing your own code
* Selecting an app language
* Choosing an app framework based on language
* Selecting an Azure service (deployment target)
* Creating a new Azure DevOps organization or using an existing organization 
* Choosing your Azure subscription
* Picking the location of Azure services
* Choosing from various pricing tiers for Azure services

After you use DevOps Projects, you can also delete all of the resources from a single place from the DevOps Projects dashboard on the Azure portal.

## DevOps Projects and Azure DevOps integration

DevOps Projects is powered by Azure DevOps. DevOps Projects automates all of the work that's needed in Azure Pipelines to set up a CI/CD pipeline. It creates a Git repository in a new or existing Azure DevOps organization, and then commits a sample application or your existing code to a new Git repository.  

The automation also establishes a CI trigger for the build so that every new code commit initiates a build. DevOps Projects creates a CD trigger and deploys every new successful build to the Azure service of your choice.  

The build and release pipelines can be customized for additional scenarios. Additionally, you can clone the build and release pipelines for use in other projects.

After creating your DevOps Project, you can:

* Customize your build and release pipeline
* Use pull requests to manage your code flow and keep your quality high
* Test and build each commit before you merge your code to raise the quality bar
* Track your backlog and issues right along with your application

## How do I start using DevOps Projects?

* [Get started with DevOps Projects](https://docs.microsoft.com/azure/devops-project/azure-devops-project-github)

##  DevOps Projects videos

* [Create CI/CD with Azure DevOps Projects](https://channel9.msdn.com/Events/Connect/2017/T174/player/)
