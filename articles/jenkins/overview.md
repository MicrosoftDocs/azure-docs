---
title: Overview of Jenkins and Azure | Microsoft Docs
description: Host the Jenkins build and deploy automation server in Azure and use Azure compute and storage resources to extend your continous integration and deployment (CI/CD) pipelines.
services: jenkins
author: rloutlaw
manager: justhe
ms.service: jenkins
ms.devlang: NA
ms.topic: article
ms.workload: na
ms.date: 08/22/2017
ms.author: routlaw
ms.custom: mvc
---

# Azure and Jenkins

[Jenkins](https://jenkins.io/) is a popular open-source automation server used to set up continuous integration and delivery for your software projects. You can host your Jenkins deployment fully in Azure or extend your existing Jenkins configuration using Azure services. Jenkins plugins from Microsoft are also available to simplify continuous delivery of your application to Azure managed services.

This article is an introduction to using Azure with Jenkins, detailing the core Azure features available to Jenkins users. To get started with your own Jenkins server in Azure, see our [quickstart](install-jenkins-solution-template.md).

## Host your Jenkins servers in Azure

Host Jenkins in Azure to centralize your build automation and scale your deployment as the needs of your software projects grow. You can run Jenkins in [Azure virtual machines](/azure/virtual-machines/linux/overview) or in a Kubernetes cluster. When hosted in Azure, you can:

- Store, secure, and archive build artifacts in a common [Azure Storage](/azure/storage/common/storage-introduction) account.
- Scale out your Jenkins deployment with additional agents to meet demand and scale back usage during periods of lower activity.
- Centralize monitoring and logging from the Jenkins master and the build agents.


(add more, will want links to the different azure services in-line)

[Get started](install-jenkins-solution-template.md) with your own Jenkins server in Azure with our [solution template](http://aka.ms/azjenkins).

## Scale your build automation and continuous delivery on demand

Existing Jenkins deployments can use Azure resources to scale, secure, and simplify their configuration.

- Add additional Azure virtual machines as Agents using the [Azure VM Agents plugin](jenkins-azure-vm-agents.md)
- Consolidate storage of artifacts across your existing Jenkins deployment with Azure Storage.
- Manage access to your Jenkins configuration through Azure Active Directory.

(more as needed, it's a slightly different scenario than fully hosted and teh story needs to be more fleshed out)


## Deploy your code into Azure managed services

Use the Azure Jenkins plugins to deploy builds of your applications to Azure managed services as part of your Jenkins CI/CD pipeline. Deploying into [Azure App Service](/azure/app-service-web/) and [Azure Container Service](/azure/container-service/kubernetes/) lets you stage, test, and verify builds on-demand without managing the underlying infrastructure. Plugins are available to deploy to the following services and environments:

- [Azure Web App on Linux](/azure/app-service-web/app-service-linux-intro)
- [Azure Container Service](/azure/container-service/) orchestrated with [Kubernetes](/azure/container-service/kubernetes/).

