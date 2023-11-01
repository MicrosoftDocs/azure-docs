---
title: What is a connected registry
description: Overview and scenarios of the connected registry feature of Azure Container Registry
ms.author: jeburke
ms.service: container-registry
ms.topic: overview
ms.date: 10/25/2022
ms.custom: references_regions, ignite-fall-2021
---

# What is a connected registry? 

In this article, you learn about the *connected registry* feature of [Azure Container Registry](container-registry-intro.md). A connected registry is an on-premises or remote replica that synchronizes container images and other OCI artifacts with your cloud-based Azure container registry. Use a connected registry to help speed up access to registry artifacts on-premises and to build advanced scenarios, for example using [nested IoT Edge](../iot-edge/tutorial-nested-iot-edge.md).

> [!NOTE]
> The connected registry is a preview feature of the **Premium** container registry service tier, and subject to [limitations](#limitations). For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md).

## Available regions

* Canada Central
* East Asia
* East US
* North Europe
* Norway East
* Southeast Asia
* West Central US
* West Europe

## Scenarios

A cloud-based Azure container registry provides [features](container-registry-intro.md#key-features) including geo-replication, integrated security, Azure-managed storage, and integration with Azure development and deployment pipelines. At the same time, customers are extending their cloud investments to their on-premises and field solutions.

To run with the required performance and reliability in on-premises or remote environments, container workloads need container images and related artifacts to be available nearby. The connected registry provides a performant, on-premises registry solution that regularly synchronizes content with a cloud-based Azure container registry.

Scenarios for a connected registry include:

* Connected factories
* Point-of-sale retail locations
* Shipping, oil-drilling, mining, and other occasionally connected environments

## How does the connected registry work?

The following image shows a typical deployment model for the connected registry.

:::image type="content" source="media/intro-connected-registry/connected-registry-overview.png" alt-text="Diagram of connected registry overview":::

### Deployment

Each connected registry is a resource you manage using a cloud-based Azure container registry. The top parent in the connected registry hierarchy is an Azure container registry in an Azure cloud.

Use Azure tools to install the connected registry on a server or device on your premises, or an environment that supports container workloads on-premises such as [Azure IoT Edge](../iot-edge/tutorial-nested-iot-edge.md).

The connected registry's *activation status* indicates whether it's deployed on-premises.

* **Active** - The connected registry is currently deployed on-premises. It can't be deployed again until it is deactivated. 
* **Inactive** - The connected registry is not deployed on-premises. It can be deployed at this time.  
 
### Content synchronization

The connected registry regularly accesses the cloud registry to synchronize container images and OCI artifacts. 

It can also be configured to synchronize a subset of the repositories from the cloud registry or to synchronize only during certain intervals to reduce traffic between the cloud and the premises.

### Modes

A connected registry can work in one of two modes: *ReadWrite* or *ReadOnly*

- **ReadWrite mode** - The default mode allows clients to pull and push artifacts (read and write) to the connected registry. Artifacts that are pushed to the connected registry will be synchronized with the cloud registry. 
        
  The ReadWrite mode is useful when a local development environment is in place. The images are pushed to the local connected registry and from there synchronized to the cloud.

- **ReadOnly mode** - When the connected registry is in ReadOnly mode, clients can only pull (read) artifacts. This configuration is used for nested IoT Edge scenarios, or other scenarios where clients need to pull a container image to operate.

### Registry hierarchy

Each connected registry must be connected to a parent. The top parent is the cloud registry. For hierarchical scenarios such as [nested IoT Edge](overview-connected-registry-and-iot-edge.md), you can nest connected registries in either mode. The parent connected to the cloud registry can operate in either mode. 

Child registries must be compatible with their parent capabilities. Thus, both ReadWrite and ReadOnly mode connected registries can be children of a connected registry operating in ReadWrite mode, but only a ReadOnly mode registry can be a child of a connected registry operating in ReadOnly mode.  

## Client access

On-premises clients use standard tools such as the Docker CLI to push or pull content from a connected registry. To manage client access, you create Azure container registry [tokens][repository-scoped-permissions] for access to each connected registry. You can scope the client tokens for pull or push access to one or more repositories in the registry.

Each connected registry also needs to regularly communicate with its parent registry. For this purpose, the registry is issued a synchronization token (*sync token*) by the cloud registry. This token is used to authenticate with its parent registry for synchronization and management operations.

For more information, see [Manage access to a connected registry][overview-connected-registry-access].

## Limitations

- Number of tokens and scope maps is [limited](container-registry-skus.md) to 20,000 each for a single container registry. This indirectly limits the number of connected registries for a cloud registry, because every connected registry needs a sync and client token.
- Number of repository permissions in a scope map is limited to 500.
- Number of clients for the connected registry is currently limited to 20.
- [Image locking](container-registry-image-lock.md) through repository/manifest/tag metadata is not currently supported for connected registries.
- [Repository delete](container-registry-delete.md) is not supported on the connected registry using ReadOnly mode.
- [Resource logs](monitor-service-reference.md#resource-logs) for connected registries are currently not supported.
- Connected registry is coupled with the registry's home region data endpoint. Automatic migration for [geo-replication](container-registry-geo-replication.md) is not supported.
- Deletion of a connected registry needs manual removal of the containers on-premises as well as removal of the respective scope map or tokens in the cloud.
- Connected registry sync limitations are as follows:
  - For continuous sync:
    - `minMessageTtl` is 1 day
    - `maxMessageTtl` is 90 days
  - For occasionally connected scenarios, where you want to specify sync window:
    - `minSyncWindow` is 1 hr
    - `maxSyncWindow` is 7 days

## Next steps

In this overview, you learned about the connected registry and some basic concepts. Continue to the one of the following articles to learn about specific scenarios where connected registry can be utilized.

> [!div class="nextstepaction"]
> [Overview: Connected registry access][overview-connected-registry-access]
> 
> [!div class="nextstepaction"]
> [Overview: Connected registry and IoT Edge][overview-connected-registry-and-iot-edge]

<!-- LINKS - internal -->
[overview-connected-registry-access]:overview-connected-registry-access.md
[overview-connected-registry-and-iot-edge]:overview-connected-registry-and-iot-edge.md
[repository-scoped-permissions]: container-registry-repository-scoped-permissions.md
