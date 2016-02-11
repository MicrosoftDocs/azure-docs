<properties
   pageTitle=""
   description=""
   services="container-service"
   documentationCenter=""
   authors="rgardler"
   manager="nepeters"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>
   
<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="home-page"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="12/02/2015"
   ms.author="rogardle"/>
   
# Application Management through the UI
   
Mesos provides an environment for deploying and scaling clustered workload while abstracting the underlying hardware. On top of Mesos, a framework manages scheduling and executing compute workload. While frameworks are available for many popular workloads, this document will detail creating and scaling container deployments with Marathon. Before working through these examples, you will need a Mesos cluster configured in ACS and have remote connectivity to this cluster. For more information in these items see the following articles.

- [Deploying an Azure Container Service Cluster](./contianer-service-deployment.md) 
- [Connecting to an ACS Cluster](./container-service-connect.md)

## Exploring the Mesos UI

![Create deployment](media/ui1.png)

## Exploring the Marathon UI

![Create deployment](media/ui2.png)

## Deploying a Docker Container

![Create deployment](media/ui3.png)

![Create deployment](media/ui4.png)

![Create deployment](media/ui5.png)

## Scaling out a Docker Container
