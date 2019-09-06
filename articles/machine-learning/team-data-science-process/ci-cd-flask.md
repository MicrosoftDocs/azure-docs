---
title: Create a CI/CD pipeline with Azure Pipelines - Team Data Science Process
description: "Create a continuous integration and continuous delivery pipeline for Artificial Intelligence (AI) applications using Docker and Kubernetes."
services: machine-learning
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 09/06/2019
ms.author: tdsp
ms.custom: seodec18, previous-author=jainr, previous-ms.author=jainr
---
# Create a CI/CD pipeline for AI apps using Azure Pipelines, Docker, Kubernetes, and Python Flask

An Artificial Intelligence (AI) application is application code embedded with a pretrained machine learning (ML) model. There are always two streams of work for an AI application: Data scientists build machine learning models, and app developers build the app and expose it to end users to consume. This article describes how to implement a continuous integration and continuous delivery (CI/CD) pipeline for an AI app. The sample app and tutorial use a simple Python Flask web application, and fetch a pretrained model from a private Azure blob storage account. You could also use an AWS S3 account.

## Source code, tutorial, and prerequisites

You can download the [source code](https://github.com/Azure/DevOps-For-AI-Apps) and a [detailed tutorial](https://github.com/Azure/DevOps-For-AI-Apps/blob/master/Tutorial.md) from GitHub. Follow the tutorial to implement your own CI/CD pipeline for your application.

To use the code and tutorial, you need the following prerequisites: 

- The [source code repository](https://github.com/Azure/DevOps-For-AI-Apps) forked to your GitHub account.
- An [Azure DevOps Organization](/azure/devops/organizations/accounts/create-organization-msa-or-work-student)
- [Azure CLI](/cli/azure/install-azure-cli)
- An [Azure Container Service for Kubernetes (AKS) cluster](/azure/container-service/kubernetes/container-service-tutorial-kubernetes-deploy-cluster)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to run commands and fetch configuration from the AKS cluster. 
- An [Azure Container Registry (ACR) account](/azure/container-registry/container-registry-get-started-portal)

## CI/CD pipeline overview

The build pipeline kicks off for each new commit and runs the test suite. If the test passes, the pipeline packages the latest build in a Docker container, and securely stores images in ACR. The release pipeline deploys the container using AKS. 

The pipeline securely pulls the latest ML model from a blob storage account and packages it with the app code as a single container. This decoupling of the app code and ML model ensures that the production app is always running the latest code with the latest ML model.

## CI/CD pipeline steps

The following diagram and steps describe the CI/CD pipeline architecture:

![CI/CD pipeline architecture](./media/ci-cd-flask/architecture.png)

1. Developers work on the application code in the IDE of their choice.
2. Developers commit the code to Azure Repos, GitHub, or other source control provider of their choice. 
3. Separately, data scientists work on developing their ML model.
4. Data scientists publish the finished model to a model repository, in this case a blob storage account. 
5. Azure Pipelines kicks off a build based on the commit in Azure Repos or GitHub.
6. The Azure Pipelines Build pipeline pulls the latest ML model from the blob container and creates a container.
7. Azure Pipelines pushes the image to the private image repository in ACR.
8. The Release pipeline kicks off on a nightly schedule.
9. Azure Pipelines pulls the latest image from ACR and deploys it across the Kubernetes cluster on AKS.
10. User requests for the app go through the DNS server.
11. The DNS server passes the requests to the load balancer and sends the responses back to the users.

## Next steps

- [Team Data Science Process (TDSP)](/azure/machine-learning/team-data-science-process/)
- [Azure Machine Learning (AML)](/azure/machine-learning/)
- [Azure DevOps](https://azure.microsoft.com/services/devops/)
- [Azure Kubernetes Services (AKS)](/azure/aks/intro-kubernetes)
