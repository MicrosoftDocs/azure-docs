---
title: CI/CD with Azure Container Service and Swarm | Microsoft Docs
description: Use Azure Container Service with Docker Swarm, an Azure Container Registry, and Visual Studio Team Services to deliver continuously a multi-container .NET Core application
services: container-service
documentationcenter: ' '
author: jcorioland
manager: pierlag
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Swarm, Azure, Visual Studio Team Services, DevOps


ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/01/2016
ms.author: jucoriol

---
# Full CI/CD pipeline to deploy a multi-container application on Azure Container Service with Docker Swarm using Visual Studio Team Services

One of the biggest challenge when developping modern applications in the cloud is to be able to deliver these applications continuously. In this documentation you will learn how to implement a full CI/CD pipeline using Azure Container Service with Docker Swarm, an Azure Container Registry and Visual Studio Team Services Build & Release Management.

This article is based on a simple application, available on [GitHub](https://github.com/jcorioland/MyShop/tree/acs-docs), and developped with ASP.NET Core. The application is composed by 4 different services, three web APIs and one web front:

![MyShop sample application](./media/container-service-docker-swarm-setup-ci-cd/myshop-application.png)

The objectives of this article are to explain how it is possible to deliver this application continuously in a Docker Swarm cluster, using Visual Studio Team Services. The figure below details this continuous delivery pipeline:

![MyShop sample application](./media/container-service-docker-swarm-setup-ci-cd/full-ci-cd-pipeline.png)

1. Code changes are committed to the source code repository (here GitHub) 
2. GitHub triggers a build in Visual Studio Team Services 
3. Visual Studio Team Services gets the latest version of the sources and build all the images that compose my application 
4. Visual Studio Team Services pushes each image in the Azure Container Registry 
5. Visual Studio Team Services triggers a new release 
6. The release runs some commands using SSH on the ACS cluster master node 
7. Docker Swarm on ACS pull the latest version of the image 
8. The new version of the application is deployed using docker-compose 

Prerequisites to the exercises in this document:

- [Create a Swarm cluster in Azure Container Service](container-service-deployment.md)
- [Connect with the Swarm cluster in Azure Container Service](container-service-connect.md)
- [Create an Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal)
- [Have a Visual Studio Team Services account and team project created](https://www.visualstudio.com/en-us/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services)

## Configure your Visual Studio Team Services account 

### Create and configure a Visual Studio Team Services Linux Build agent

### Install the Docker Integration from Visual Studio Team Services marketplace

### Connect Visual Studio Team Services and GitHub

### Connect Visual Studio Team Services to Azure Container Service and Azure Container Registry

## Create the build definition

## Create the release definition

## Wrap up and next steps