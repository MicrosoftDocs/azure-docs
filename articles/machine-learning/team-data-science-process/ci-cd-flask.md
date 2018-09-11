---
title: "DevOps for Artificial Intelligence (AI) applications: Creating continous integration pipeline on Azure using Docker, Kubernetes & Python Flask application"
description: "DevOps for Artificial Intelligence (AI) applications: Creating continous integration pipeline on Azure using Docker and Kubernetes"
services: machine-learning, team-data-science-process
documentationcenter: ''
author: jainr
manager: deguhath
editor: cgronlun

ms.assetid: b8fbef77-3e80-4911-8e84-23dbf42c9bee
ms.service: machine-learning
ms.component: team-data-science-process
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2018
ms.author: jainr
---
# DevOps for Artificial Intelligence (AI) applications: Creating continuous integration pipeline on Azure using Docker and Kubernetes
For an AI application, there are frequently two streams of work, Data Scientists building machine learning models and App developers building the application and exposing it to end users to consume. In this article, we demonstrate how to implement a Continuous Integration (CI)/Continous Delivery (CD) pipeline for an AI application. AI application is a combination of application code embedded with a pretrained machine learning (ML) model. For this article, we are fetching a pretrained model from a private Azure blob storage account, it could be an AWS S3 account as well. We will use a simple python flask web application for the article.

> [!NOTE]
> This is one of several ways CI/CD can be performed. There are alternatives to the tooling and other pre-requisites mentioned below. As we develop additional content, we will publish those.
>
>

## GitHub repository with document and code
You can download the source code from [GitHub](https://github.com/Azure/DevOps-For-AI-Apps). A [detailed tutorial](https://github.com/Azure/DevOps-For-AI-Apps/blob/master/Tutorial.md) is also available.

## Pre-requisites
The following are the pre-requisites for following the CI/CD pipeline described below:
* [Azure DevOps Organization](https://docs.microsoft.com/azure/devops/organizations/accounts/create-organization-msa-or-work-student)
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
* [Azure Container Service (AKS) cluster running Kubernetes](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-tutorial-kubernetes-deploy-cluster)
* [Azure Container Registy (ACR) account](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-portal)
* [Install Kubectl to run commands against Kubernetes cluster.](https://kubernetes.io/docs/tasks/tools/install-kubectl/) We will need this to fetch configuration from ACS cluster. 
* Fork the repository to your GitHub account.

## Description of the CI/CD pipeline
The pipeline kicks off for each new commit, run the test suite, if the test passes takes the latest build, packages it in a Docker container. The container is then deployed using Azure container service (ACS) and images are securely stored in Azure container registry (ACR). ACS is running Kubernetes for managing container cluster but you can choose Docker Swarm or Mesos.

The application securely pulls the latest model from an Azure Storage account and packages that as part of the application. The deployed application has the app code and ML model packaged as single container. This decouples the app developers and data scientists, to make sure that their production app is always running the latest code with latest ML model.

The pipeline architecture is given below. 

![Architecture](./media/ci-cd-flask/Architecture.PNG?raw=true)

## Steps of the CI/CD pipeline
1. Developer work on the IDE of their choice on the application code.
2. They commit the code to source control of their choice (Azure DevOps has good support for various source controls)
3. Separately, the data scientist work on developing their model.
4. Once happy, they publish the model to a model repository, in this case we are using a blob storage account. This could be easily replaced with Azure ML Workbench's Model management service through their REST APIs.
5. A build is kicked off in Azure DevOps based on the commit in GitHub.
6. Azure DevOps Build pipeline pulls the latest model from Blob container and creates a container.
7. Azure DevOps pushes the image to private image repository in Azure Container Registry
8. On a set schedule (nightly), release pipeline is kicked off.
9. Latest image from ACR is pulled and deployed across Kubernetes cluster on ACS.
10. Users request for the app goes through DNS server.
11. DNS server passes the request to load balancer and sends the response back to user.

## Next steps
* Refer to the [tutorial](https://github.com/Azure/DevOps-For-AI-Apps/blob/master/Tutorial.md) to follow the details and implement your own CI/CD pipeline for your application.

## References
* [Team Data Science Process (TDSP)](https://aka.ms/tdsp)
* [Azure Machine Learning (AML)](https://docs.microsoft.com/azure/machine-learning/service/)
* [Visual Studio Team Services (VSTS)](https://www.visualstudio.com/vso/)
* [Azure Kubernetes Services (AKS)](https://docs.microsoft.com/azure/aks/intro-kubernetes)
