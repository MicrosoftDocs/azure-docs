---
title:  Azure Container Instances Spot containers
description: Learn more about Spot container groups
ms.topic: conceptual
ms.author: atsenthi
author: athinanthny
ms.service: container-instances
services: container-instances
ms.date: 05/14/2023
---

# Azure Container Instances Spot containers (preview)
This article introduces the concept of Azure Container Instances (ACI) Spot containers, which allows you to run interruptible workloads in containerized form on unused Azure capacity. By utilizing Spot containers, you can enjoy up to a 70% discount compared to regular-priority ACI containers.

Spot containers offer the best of both worlds by combining the simplicity of ACI with the cost-effectiveness of Spot VMs. This enables customers to easily and affordably scale their containerized interruptible workloads. It's important to note that Spot containers may be preempted at any time, particularly when Azure has limited surplus capacity. Customers are billed based on per-second memory and core usage.

This feature is designed for customers who need to run interruptible workloads with no strict availability requirements. Azure Container Instances Spot Containers support both Linux and Windows containers, providing flexibility for different operating system environments.

This article provides background about the feature, limitations, and resources. To see the availability of Spot containers in Azure regions, see [Resource and region availability](container-instances-region-availability.md).

> [!NOTE]
> Spot containers with Azure Container Instances is in preview and is not recommended for production scenarios.



## Azure Container Instances Spot containers overview

### Lift and shift applications

ACI Spot containers are a cost-effective option for running containerized applications or parallelizable offline workloads including image rendering, Genomic processing, Monte Carlo simulations, etc. Customers can lift and shift their containerized Linux or Windows applications without needing to adopt specialized programming models to achieve the benefits of standard ACI containers along with low cost.

## Eviction policies

For Spot containers, customers can't choose eviction types or policies like Spot VMs. If an eviction occurs, the container groups hosting the customer workloads are automatically restarted without requiring any action from the customer.

## Unsupported features

ACI Spot containers preview release includes these limitations such as

* **Public IP Endpoint**: ACI Spot container groups won't be assigned a public IP endpoint. This means that the container    groups can't be accessed directly from the internet.
* **Deployment Behind Virtual Network**: Spot container groups can't be deployed behind a virtual network. 
* **Confidential SKU Support**: ACI Spot containers don't support the Confidential SKU, which means that you can't use the  Confidential Computing capabilities provided by Azure.
* **Availability Zone Pinning**: ACI Spot containers don't support the ability to pin Availability Zones per container group deployment. 

## Next steps 

* For a deployment example with the Azure portal, see [Deploy a Spot container with Azure Container Instances using the Azure portal](container-instances-tutorial-deploy-spot-containers-portal.md)
* For a deployment example with the Azure CLI, see [Deploy a Spot container with Azure Container Instances using the Azure CLI](container-instances-tutorial-deploy-spot-containers-cli.md)
