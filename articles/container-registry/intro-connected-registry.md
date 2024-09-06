---
title: What is a Connected Registry?
description: Overview and scenarios of the Connected Registry feature of Azure Container Registry, including its benefits and use cases.
ms.author: jeburke
ms.service: container-registry
ms.topic: overview
ms.date: 10/31/2023
ms.custom: references_regions
#customer intent: As a reader, I want to understand the overview and scenarios of the Connected registry feature of Azure Container Registry so that I can utilize it effectively.
---

# What is a Connected Registry? 

In this article, you learn about the *Connected registry* feature of [Azure Container Registry](container-registry-intro.md). A Connected registry is an on-premises or remote replica that synchronizes container images with your cloud-based Azure container registry. Use a Connected registry to help speed-up access to registry artifacts on-premises or remote.

## Billing and Support

The Connected registry is a preview feature of the **Premium** container registry service tier, and subject to [limitations](#limitations). For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md).

>[!IMPORTANT]
> Please note that there are **Important upcoming changes** to the Connected registry Deployment Model Support and Billing starting from September 30th, 2024. For any inquiries or assistance with the transition, please reach out to the customer support team.

### Billing
- The Connected registry incurs no charges until it reaches general availability (GA).
- Post-GA, a monthly fee of $10 will apply for each Connected registry deployed.
- This fee represents Microsoft's commitment to deliver high-quality services and product support.
- The fee is applied to the Azure subscription associated with the parent registry.

### Support
- Microsoft will end support for the Connected registry deployment on IoT Edge devices on September 30, 2024.
- After September 30, 2024, Connected registry will solely support Arc-enabled Kubernetes clusters as the deployment model.
- Microsoft advises users to begin planning their transition to Arc-enabled Kubernetes clusters as the deployment model.

## Available regions

Connected registry is available in the following continents and regions:

```
| Continent     | Available Regions |
|---------------|-------------------|
| Australia     | Australia East    |
| Asia          | East Asia         |
|               | Japan East        |
|               | Japan West        |
|               | Southeast Asia    |
| Europe        | North Europe      |
|               | Norway East       |
|               | West Europe       |
| North America | Canada Central    |
|               | Central US        |
|               | East US           |
|               | South Central US  |
|               | West Central US   |
|               | West US 3         |
| South America | Brazil South      |
```

## Scenarios

A cloud-based Azure container registry provides [features](container-registry-intro.md#key-features) including geo-replication, integrated security, Azure-managed storage, and integration with Azure development and deployment pipelines. At the same time, customers are extending their cloud investments to their on-premises and field solutions.

To run with the required performance and reliability in on-premises or remote environments, container workloads need container images and related artifacts to be available nearby. The Connected registry provides a performant, on-premises registry solution that regularly synchronizes content with a cloud-based Azure container registry.

Scenarios for a Connected registry include:

* Connected factories
* Point-of-sale retail locations
* Shipping, oil-drilling, mining, and other occasionally connected environments
* Improve scalability of multiple deployments
* Customize persistent storage volumes for container workloads
* Secure delivery, tracking, and auto management of updates

## How does the Connected registry work?

The Connected registry is deployed on a server or device on-premises, or an environment that supports container workloads on-premises such as Azure IoT Edge and Azure Arc-enabled Kubernetes. The Connected registry synchronizes container images and other OCI artifacts with a cloud-based Azure container registry.

The following image shows a typical deployment model for the Connected registry using IoT Edge. 

:::image type="content" source="media/intro-connected-registry/connected-registry-edge.png" alt-text="Diagram of Connected registry overview using IoT Edge":::

The following image shows a typical deployment model for the Connected registry using Azure Arc-enabled Kubernetes. 

:::image type="content" source="media/intro-connected-registry/connected-registry-azure-arc.png" alt-text="Diagram of Connected registry overview using Arc-enabled Kubernetes":::

### Deployment

Each Connected registry is a resource you manage to use a cloud-based Azure container registry. The top parent in the Connected registry hierarchy is an Azure container registry in an Azure cloud.

Use Azure tools to install the Connected registry on a server or device on your premises, or an environment that supports container workloads on-premises such as [Azure IoT Edge](../iot-edge/tutorial-nested-iot-edge.md). 

Enable Connected registry-Arc extension to the Arc-enabled K8s cluster, and securing the connection with TLS with default configurations for Read only and continuous sync window. The Connected registry can be deployed on the Arc-enabled K8s cluster and synchronize the images from ACR to Connected registry on-perm can be used to pull images from Connected registry.

The Connected registry's *activation status* indicates whether it's deployed on-premises.

* **Active** - The Connected registry is currently deployed on-premises. It can't be deployed again until it's deactivated. 
* **Inactive** - The Connected registry is not deployed on-premises. It can be deployed at this time.  
 
### Content synchronization

The Connected registry regularly accesses the cloud registry to synchronize container images and OCI artifacts. 

It can also be configured to synchronize a subset of the repositories from the cloud registry or to synchronize only during certain intervals to reduce traffic between the cloud and the premises.

### Modes

A Connected registry can work in one of two modes: *ReadWrite* or *ReadOnly*

- **ReadWrite mode** - The default mode allows clients to pull and push artifacts (read and write) to the Connected registry. Artifacts that are pushed to the Connected registry will be synchronized with the cloud registry. 
        
  The ReadWrite mode is useful when a local development environment is in place. The images are pushed to the local Connected registry and from there synchronized to the cloud.

- **ReadOnly mode** - When the Connected registry is in ReadOnly mode, clients can only pull (read) artifacts. This configuration is used for nested IoT Edge scenarios, or other scenarios where clients need to pull a container image to operate.

### Registry hierarchy

Each Connected registry must be connected to a parent. The top parent is the cloud registry. For hierarchical scenarios such as [nested IoT Edge][overview-connected-registry-and-iot-edge] and Azure Arc-enabled Kubernetes, you can nest connected registries in either mode. The parent connected to the cloud registry can operate in either mode. 

Child registries must be compatible with their parent capabilities. Thus, both ReadWrite and ReadOnly mode connected registries can be children of a Connected registry operating in ReadWrite mode, but only a ReadOnly mode registry can be a child of a Connected registry operating in ReadOnly mode.  

## Client access

On-premises clients use standard tools such as the Docker CLI to push or pull content from a Connected registry. To manage client access, you create Azure container registry [tokens][repository-scoped-permissions] for access to each Connected registry. You can scope the client tokens for pull or push access to one or more repositories in the registry.

Each Connected registry also needs to regularly communicate with its parent registry. For this purpose, the registry is issued a synchronization token (*sync token*) by the cloud registry. This token is used to authenticate with its parent registry for synchronization and management operations.

For more information, see [Manage access to a connected registry][overview-connected-registry-access].

## Limitations

- Number of tokens and scope maps is [limited](container-registry-skus.md) to 20,000 each for a single container registry. This indirectly limits the number of connected registries for a cloud registry, because every Connected registry needs a sync and client token.
- Number of repository permissions in a scope map is limited to 500.
- Number of clients for the Connected registry is currently limited to 20.
- [Image locking](container-registry-image-lock.md) through repository/manifest/tag metadata isn't currently supported for connected registries.
- [Repository delete](container-registry-delete.md) isn't supported on the Connected registry using ReadOnly mode.
- [Resource logs](monitor-service-reference.md#resource-logs) for connected registries are currently not supported.
- Connected registry is coupled with the registry's home region data endpoint. Automatic migration for [geo-replication](container-registry-geo-replication.md) isn't supported.
- Deletion of a Connected registry needs manual removal of the containers on-premises and removal of the respective scope map or tokens in the cloud.
- Connected registry sync limitations are as follows:
  - For continuous sync:
    - `minMessageTtl` is one day
    - `maxMessageTtl` is 90 days
  - For occasionally connected scenarios, where you want to specify sync window:
    - `minSyncWindow` is 1 hr
    - `maxSyncWindow` is seven days

## Conclusion

In this overview, you learned about the Connected registry and some basic concepts. Continue to the one of the following articles to learn about specific scenarios where Connected registry can be utilized.

> [!div class="nextstepaction"]
<!-- LINKS - internal -->
[overview-connected-registry-access]:overview-connected-registry-access.md
[overview-connected-registry-and-iot-edge]:overview-connected-registry-and-iot-edge.md
[repository-scoped-permissions]: container-registry-repository-scoped-permissions.md
