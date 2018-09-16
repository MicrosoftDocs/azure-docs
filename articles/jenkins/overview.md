---
title: Overview of Jenkins and Azure
description: Host the Jenkins build and deploy automation server in Azure and use Azure compute and storage resources to extend your continous integration and deployment (CI/CD) pipelines.
ms.service: jenkins
keywords: jenkins, azure, devops, overview
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: overview
ms.date: 07/25/2018
---

# Azure and Jenkins

[Jenkins](https://jenkins.io/) is a popular open-source automation server used to set up continuous integration and delivery (CI/CD) for your software projects. You can host your Jenkins deployment in Azure or extend your existing Jenkins configuration using Azure resources. Jenkins plugins are also available to simplify CI/CD of your applications to Azure.

This article is an introduction to using Azure with Jenkins, detailing the core Azure features available to Jenkins users. For more information about getting started with your own Jenkins server in Azure, see [Create a Jenkins server on Azure](install-jenkins-solution-template.md).

## Host your Jenkins servers in Azure

Host Jenkins in Azure to centralize your build automation and scale your deployment as the needs of your software projects grow. You can deploy Jenkins in Azure using:
 
- [The Jenkins solution template](install-jenkins-solution-template.md) in Azure Marketplace.
- [Azure virtual machines](/azure/virtual-machines/linux/overview). See our [tutorial](/azure/virtual-machines/linux/tutorial-jenkins-github-docker-cicd) to create a Jenkins instance on a VM.
- On a Kubernetes cluster running in [Azure Container Service](/azure/container-service/kubernetes/container-service-kubernetes-walkthrough), see our [how-to](/azure/container-service/kubernetes/container-service-kubernetes-jenkins).

Monitor and manage your Azure Jenkins deployment using [Log Analytics](/azure/log-analytics/log-analytics-overview) and the [Azure CLI](/cli/azure).

## Scale your build automation on demand

Add build agents to your existing Jenkins deployment to scale your Jenkins build capacity as the number of builds and complexity of your jobs and pipelines increase. You can run these build agents on Azure virtual machines by using the [Azure VM Agents plugin](jenkins-azure-vm-agents.md). See our [tutorial](/azure/jenkins/jenkins-azure-vm-agents) for more details.

Once configured with an [Azure service principal](/azure/azure-resource-manager/resource-group-overview), Jenkins jobs and pipelines can use this credential to:

- Securely store and archive build artifacts in [Azure Storage](/azure/storage/common/storage-introduction) using the [Azure Storage plugin](https://plugins.jenkins.io/windows-azure-storage). Review the [Jenkins storage how-to](/azure/storage/common/storage-java-jenkins-continuous-integration-solution) to learn more.
- Manage and configure Azure resources with the [Azure CLI](/azure/jenkins/execute-cli-jenkins-pipeline).

## Deploy your code into Azure services

Use Jenkins plugins to deploy your applications to Azure as part of your Jenkins CI/CD pipelines. Deploying into [Azure App Service](/azure/app-service/) and [Azure Container Service](/azure/container-service/kubernetes/) lets you stage, test, and release updates to your applications without managing the underlying infrastructure.

 Plug-ins are available to deploy to the following services and environments:

- [Azure Web App on Linux](/azure/app-service/containers/app-service-linux-intro). See the [tutorial](java-deploy-webapp-tutorial.md) to get started.
- [Azure Web App](/azure/app-service/app-service-web-overview). See the [how-to](deploy-Jenkins-app-service-plugin.md) to get started.