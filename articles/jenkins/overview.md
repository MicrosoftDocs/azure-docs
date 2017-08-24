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

[Jenkins](https://jenkins.io/) is a popular open-source automation server used to set up continuous integration and delivery for your software projects. You can host your Jenkins deployment fully in Azure or extend your existing Jenkins configuration using Azure services. Jenkins plugins from Microsoft are also available to simplify continuous integration and delivery of your application to Azure managed services.

This article is an introduction to using Azure with Jenkins, detailing the core Azure features available to Jenkins users. To get started with your own Jenkins server in Azure, see our [quickstart](install-jenkins-solution-template.md).

## Host your Jenkins servers in Azure

Host Jenkins in Azure to centralize your build automation and scale your deployment as the needs of your software projects grow. You can deploy Jenkins in Azure using:
 
- [The Jenkins solution template](install-jenkins-solution-template.md) in Azure Marketplace.
- [Azure virtual machines](/azure/virtual-machines/linux/overview). See our [tutorial](/azure/virtual-machines/linux/tutorial-jenkins-github-docker-cicd) to create a Jenkins instance on a VM.
- On a Kubernetes cluster running in [Azure Container Service](/azure/container-service/kubernetes/container-service-kubernetes-walkthrough), see our [how-to](/azure/container-service/kubernetes/container-service-kubernetes-jenkin).

Once deployed on Azure, you can monitor, manage, and automate your Jenkins deployment using Azure features such as [Log Analtyics](/azure/log-analytics/log-analytics-overview), [Operations Management Suite](/azure/operations-management-suite/operations-management-suite-overview), and the [Azure CLI] (/cli/azure/overview).

## Scale your build automation on demand

As the number of builds and complexity of your Jenkins usage grows, running builds on agents is the recommended practice for scaling your deployment. Run these build agents in Azure on:

- Azure virtual machines by using the [Azure VM Agents plugin](jenkins-azure-vm-agents.md). See our [tutorial](/azure/jenkins/jenkins-azure-vm-agents) for more details.
- Containers using the [Azure Container] plugin. The plugin will run your builds in a container running on an [Azure Container Service] instance. The plugin also supports [Azure Container Instances](/azure/container-instances) to run these containers without having to manage the underlying compute resources.

Once configured with an [Azure service principal](/azure/azure-resource-manager/resource-group-overview), Jenkins jobs and pipelines can:

- Securely store and archive build artifacts in [Azure Storage](/azure/storage/common/storage-introduction) using the [Azure Storage plugin](https://plugins.jenkins.io/windows-azure-storage). Review the [Jenkins storage how-to](/azure/storage/common/storage-java-jenkins-continuous-integration-solution) to learn more.
- Manage and configure Azure resources with the [Azure CLI](/azure/jenkins/execute-cli-jenkins-pipeline).

## Deploy your code into Azure managed services

Use the Azure Jenkins plugins to deploy your applications to Azure managed services as part of your Jenkins CI/CD pipelines. Deploying into [Azure App Service](/azure/app-service-web/) and [Azure Container Service](/azure/container-service/kubernetes/) lets you stage, test, and release updates without managing infrastructure.

 Plugins are available to deploy to the following services and environments:

- [Azure Web App](/azure/app-service-web/app-service-web-overview)
- [Azure Web App on Linux](/azure/app-service-web/app-service-linux-intro)
