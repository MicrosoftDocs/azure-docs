---
title: Overview of DevOps Starter for Azure | Microsoft Docs
description: Understand the value for DevOps Starter
services: devops-project
documentationcenter: ''
author: georgewallace
manager: gwallace
editor: mlearned
ms.assetid: 
ms.service: az-devops-project
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload:
ms.date: 03/24/2020
ms.author: gwallace
#Customer intent: As a developer/devops resource, I want to quickly get started with CI/CD in Azure so I can automate the deployment of my application to an Azure service.
---
# Overview of DevOps Starter

>[!IMPORTANT] 
>DevOps Starter will be retired on March 31, 2023. [Learn more](/azure/devops-project/retirement-and-migration).

 DevOps Starter makes it easy to get started on Azure using either GitHub actions or Azure DevOps. It  helps you launch your favorite app on the Azure service of your choice in just a few quick steps from the Azure portal. 

 DevOps Starter sets up everything you need for developing, deploying, and monitoring your application. You can use the DevOps Starter dashboard to monitor code commits, builds, and deployments, all from a single view in the Azure portal.

## Advantages of using DevOps Starter

  DevOps starter supports the following two CI/CD providers, to automate your deployments
  * [GitHub Actions](https://github.com/features/actions)
  * [Azure DevOps](https://azure.microsoft.com/services/devops)

  DevOps Starter automates the setup of an entire continuous integration (CI) and continuous delivery (CD) for your application to Azure.  You can start with existing code or use one of the provided sample applications. Then you can quickly deploy that application to various Azure services such as Virtual Machines, App Service, Azure Kubernetes Services (AKS), Azure SQL Database, and Azure Service Fabric.  

  DevOps Starter does all the work for the initial configuration of a DevOps pipeline including everything from setting up the initial Git repository, configuring the CI/CD pipeline, creating an Application Insights resource for monitoring, and providing a single view of the entire solution with the creation of a DevOps Starter dashboard in the Azure portal.

You can use DevOps Starter to:

* Quickly deploy your application to Azure
* Automate the setup of a CI/CD workflow or pipeline
* View and understand how to properly set up a CI/CD workflow or pipeline
* Further customize the release pipelines based on your specific scenarios

## How to use DevOps Starter?

  DevOps Starter is available from the Azure portal. You create a DevOps Starter resource just like you create any other Azure resource from the portal. DevOps Projects provides a step-by-step wizard-like experience for the various configuration options.  

You choose several configuration options as part of the initial setup. These options include:

* Selecting your favoring CI/CD provider
* Using the provided sample app, or bringing your own code(only for Azure DevOps)
* Selecting an app language
* Choosing an app framework based on language
* Selecting an Azure service (deployment target)
* Select your GitHub or Azure DevOps organization
* Choosing your Azure subscription
* Picking the location of Azure services
* Choosing from various pricing tiers for Azure services

After creating your DevOps Starter, you can:

* Customize your GitHub workflow or Azure DevOps Pipeline
* Use pull requests to manage your code flow and keep your quality high
* Test and build each commit before you merge your code to raise the quality bar

After you use DevOps Starter, you can also delete all of the resources from a single place from the DevOps Starter dashboard on the Azure portal.

## DevOps Starter and GitHub integration

DevOps Starter now supports GitHub actions as a CI/CD provider. It automates all of the work that's needed in GitHub to set up a CI/CD workflow using GitHub Actions. It creates a GitHub repository in an existing GitHub organization, and then commits a sample application to the new GitHub repository.  

The automation also establishes a trigger for the workflow so that every new code commit initiates a build and deploy job within the workflow. The application is deployed to the Azure service of your choice. The GitHub workflow can be customized for additional scenarios. 

## DevOps Starter and Azure DevOps integration

DevOps Starter using Azure DevOps automates all of the work that's needed in Azure Pipelines to set up a CI/CD pipeline. It creates a Git repository in a new or existing Azure DevOps organization, and then commits a sample application or your existing code to a new Git repository.  

The automation also establishes a CI trigger for the build so that every new code commit initiates a build. DevOps Starter creates a CD trigger and deploys every new successful build to the Azure service of your choice.  

The build and release pipelines can be customized for additional scenarios. Additionally, you can clone the build and release pipelines for use in other projects.

## Getting started with DevOps Starter

* [Get started with DevOps Starter](./azure-devops-project-github.md)

##  DevOps Starter videos

* [Create CI/CD with Azure DevOps Starter](https://www.youtube.com/watch?v=NuYDAs3kNV8)
