---
title: Overview of Azure Service Fabric Mesh
description: An overview of Azure Service Fabric Mesh. With Service Fabric Mesh, you can deploy and scale your application without worrying about the infrastructure needs of your application.
services: Azure Service Fabric Mesh
keywords: 
author: thraka
ms.author: adegeo
ms.date: 04/11/2018
ms.topic: overview
ms.service: service-fabric-mesh
manager: timlt
#Customer intent: As a developer, I want to know what Service Fabric Mesh is so that I can choose to try it.
---

# What is Service Fabric Mesh?

Service Fabric Mesh is a server-less application platform hosted and managed by Microsoft Azure. With Service Fabric Mesh, you can deploy and scale your containerized application without worrying about infrastructure needs. Service Fabric Mesh automatically allocates the infrastructure needed by your application and also handles infrastructure failures. Also, Service Fabric Mesh handles service discovery, data-partitioning, frictionless upgrades, and other features needed by highly available hyper-scalable applications.

<!--
NEW DIAGRAM NEEDED
![Diagram of Service Fabric Mesh for Azure](./media/service-fabric-mesh-overview/diagram.png)
-->

## Focus on your app

With Service Fabric Mesh, you only need to specify the limits of the resources your application needs. Azure will handle all of the infrastructure setup required to host your application. All applications and services you create are deployed with either a Linux or Windows Docker container. 

If you have a monolithic application, you can easily host the entire application in a single container hosted on Service Fabric Mesh. This makes porting an application to the cloud even though it may not have been designed with the cloud in mind. As time permits, you can break up the monolithic app into smaller, self contained services. 

Azure pre-provisions popular container base-images (such as Ubuntu or Windows Server) for quick deployment. Or, you can provide your own container images with [Azure Container Registry](). And, because all applications on Service Fabric Mesh are deployed through containers, you're not restricted to any single coding framework or language.

## Get started

If you don't already have an Azure account, [create a free account](https://azure.microsoft.com/free/) before you begin.

1. Install or upgrade to the latest version of the Azure CLI, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).
2. Log in to Azure with the CLI.
   
   ```azurecli
   az login
   ```

3. Set the subscription to work with.

   ```azurecli
   az account set --subscription <your-subscription-guid>
   ```

4. Test the Service Fabric Mesh extension with `az sbz -h`
   
   ```azurecli
   > az sbz -h
   
   Group
       az sbz: (PREVIEW) Manage Azure SeaBreeze Resources.
   
   Subgroups:
       app           : Manage SeaBreeze applications.
       codepackage   : Manage SeaBreeze service replica code packages.
       deployment    : Manage SeaBreeze deployments.
       network       : Manage networks.
       service       : Manage SeaBreeze services.
       servicereplica: Manage SeaBreeze service replicas.
       volume        : Manage volumes.
   
   ```

## Next steps

Use the [Deploy a container](service-fabric-mesh-quickstart-deploy-container.md) quickstart to quickly test Service Fabric Mesh.

Create a new sample ASP.NET Core application [Deploy a container](service-fabric-mesh-quickstart-deploy-container.md) quickstart to quickly test Service Fabric Mesh.