---
title: Overview of Azure DevOps Project | Microsoft Docs
description: Understand the value for the Azure DevOps Project
services: devops-project
documentationcenter: ''
author: mlearned
manager: douge
editor: mlearned
ms.assetid: 
ms.service: devops-project
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload:
ms.date: 05/03/2018
ms.author: mlearned
#Customer intent: As a developer/devops resource, I want to quickly get started with CI/CD in Azure so I can automate the deployment of my application to an Azure service.
---
# Overview of Azure DevOps Project

The Azure DevOps Project makes it easy to get started on Azure. The DevOps Project resource helps you launch your favorite app type on the Azure service of your choice in just a few quick steps from the Azure portal. 
The DevOps Project sets up everything you need for developing, deploying, and monitoring your application.
The DevOps Project dashboard lets you monitor code commits, builds, and deployments, all from a single view in the Azure portal.

## Why should I use the Azure DevOps Project?

The Azure DevOps Project automates the setup of an entire Continuous Integration (CI) and Continuous Delivery (CD) pipeline to Azure.  You can start with your existing code or use one of the provided sample applications, and then quickly deploy that application to various Azure services such as Virtual Machines, App Service, Azure Container Service, Azure SQL Database, and Azure Service Fabric.  

The Azure DevOps Project does all the work for the initial configuration of a DevOps pipeline including everything from setting up the initial Git repository, configuring the CI/CD pipeline, creating an Application Insights resource for monitoring, and providing a single view of the entire solution with the creation of an Azure DevOps Project dashboard on the Azure portal.

You can use the Azure DevOps Project to:

* Quickly deploy your application to Azure
* Automate the setup of an Azure CI/CD pipeline
* Use the DevOps Project as a template to view and understand how to properly set up CI/CD to Azure with Azure DevOps
* Get started with CI/CD pipeline to Azure, and then further customize the release pipeline based on your specific scenarios

## How do I use the Azure DevOps Project?

The Azure DevOps Project is available from the Azure portal.  You create an Azure DevOps Project resource just like any other Azure resource from the portal.  The DevOps Project provides a step by step wizard-like experience for the various configuration options.  

You choose several configuration options as part of the initial setup.  These options include:

* Use the provided sample app, or bring your own code
* Select an App language
* Choose an App framework based on language
* Select an Azure service (deployment target)
* Azure DevOps organization (new or existing)
* Choose your Azure subscription
* Pick the location of Azure services
* Choose from various pricing tiers for Azure services

After you use the Azure DevOps Project, you can also delete all of the resources from a single place from the Azure DevOps Project dashboard on the Azure portal.

## Azure DevOps Project and Azure DevOps integration

DevOps Projects are powered by Azure DevOps.  The DevOps Project automates all of the work needed in Azure DevOps to set up CI/CD to Azure.  A Git repository is created in a new or existing Azure DevOps organization.  The DevOps Project commits a sample application or your existing code to a new Git repository.  The automation also establishes a CI trigger for the build so that every new code commit will initiate a build.  The DevOps Project also creates a CD trigger and will deploy every new successful build to the Azure service of your choice.  The build and release pipelines can be customized for additional scenarios.  You can also clone the build and release pipelines for use in other projects.

After creating your DevOps Project, you can:

* Customize your build and release pipeline
* Use pull requests to manage your code flow and keep your quality high
* Test and build each commit before you merge your code to raise the quality bar
* Track your Project backlog and issues right along with your application

## How do I start using the Azure DevOps Project?

* [Get Started with the Azure DevOps Project](https://docs.microsoft.com/azure/devops-project/azure-devops-project-github)

## Azure DevOps Project videos

* [Create CI/CD with the Azure DevOps Project](https://channel9.msdn.com/Events/Connect/2017/T174/player/)
