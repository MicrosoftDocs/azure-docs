---
title: Registry best practices
description: Learn how to use your Azure container registry effectively by following these best practices.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Best practices for Azure Container Registry

By following these best practices, you can help maximize the performance and cost-effective use of your private registry in Azure to store and deploy container images and other artifacts.

For background on registry concepts, see [About registries, repositories, and images](container-registry-concepts.md). See also [Recommendations for tagging and versioning container images](container-registry-image-tag-version.md) for strategies to tag and version images in your registry. 

## Network-close deployment

Create your container registry in the same Azure region in which you deploy containers. Placing your registry in a region that is network-close to your container hosts can help lower both latency and cost.

Network-close deployment is one of the primary reasons for using a private container registry. Docker images have an efficient [layering construct](https://docs.docker.com/engine/userguide/storagedriver/imagesandcontainers/) that allows for incremental deployments. However, new nodes need to pull all layers required for a given image. This initial `docker pull` can quickly add up to multiple gigabytes. Having a private registry close to your deployment minimizes the network latency.
Additionally, all public clouds, Azure included, implement network egress fees. Pulling images from one datacenter to another adds network egress fees, in addition to the latency.

## Geo-replicate multi-region deployments

Use Azure Container Registry's [geo-replication](container-registry-geo-replication.md) feature if you're deploying containers to multiple regions. Whether you're serving global customers from local data centers or your development team is in different locations, you can simplify registry management and minimize latency by geo-replicating your registry. You can also configure regional [webhooks](container-registry-webhook.md) to notify you of events in specific replicas such as when images are pushed.

Geo-replication is available with [Premium](container-registry-skus.md) registries. To learn how to use geo-replication, see the three-part tutorial, [Geo-replication in Azure Container Registry](container-registry-tutorial-prepare-registry.md).

## Maximize pull performance

In addition to placing images close to your deployments, characteristics of your images themselves can impact pull performance.

* **Image size** - Minimize the sizes of your images by removing unnecessary [layers](container-registry-concepts.md#manifest) or reducing the size of layers. One way to reduce image size is to use the [multi-stage Docker build](https://docs.docker.com/develop/develop-images/multistage-build/) approach to include only the necessary runtime components. 

  Also check whether your image can include a lighter base OS image. And if you use a deployment environment such as Azure Container Instances that caches certain base images, check whether you can swap an image layer for one of the cached images. 
* **Number of layers** - Balance the number of layers used. If you have too few, you don’t benefit from layer reuse and caching on the host. Too many, and your deployment environment spends more time pulling and decompressing. Five to 10 layers is optimal.

Also choose a [service tier](container-registry-skus.md) of Azure Container Registry that meets your performance needs. The Premium tier provides the greatest bandwidth and highest rate of concurrent read and write operations when you have high-volume deployments.

## Repository namespaces

By using repository namespaces, you can allow sharing a single registry across multiple groups within your organization. Registries can be shared across deployments and teams. Azure Container Registry supports nested namespaces, enabling group isolation. However, the registry manages all repositories independently, not as a hierarchy.

For example, consider the following container image tags. Images that are used corporate-wide, like `aspnetcore`, are placed in the root namespace, while container images owned by the Products and Marketing groups each use their own namespaces.

- *contoso.azurecr.io/aspnetcore:2.0*
- *contoso.azurecr.io/products/widget/web:1*
- *contoso.azurecr.io/products/bettermousetrap/refundapi:12.3*
- *contoso.azurecr.io/marketing/2017-fall/concertpromotions/campaign:218.42*

## Dedicated resource group

Because container registries are resources that are used across multiple container hosts, a registry should reside in its own resource group.

Although you might experiment with a specific host type, such as [Azure Container Instances](../container-instances/container-instances-overview.md), you'll likely want to delete the container instance when you're done. However, you might also want to keep the collection of images you pushed to Azure Container Registry. By placing your registry in its own resource group, you minimize the risk of accidentally deleting the collection of images in the registry when you delete the container instance resource group.

## Authentication and authorization

When authenticating with an Azure container registry, there are two primary scenarios: individual authentication, and service (or "headless") authentication. The following table provides a brief overview of these scenarios, and the recommended method of authentication for each.

| Type | Example scenario | Recommended method |
|---|---|---|
| Individual identity | A developer pulling images to or pushing images from their development machine. | [az acr login](/cli/azure/acr#az-acr-login) |
| Headless/service identity | Build and deployment pipelines where the user isn't directly involved. | [Service principal](container-registry-authentication.md#service-principal) |

For in-depth information about these and other Azure Container Registry authentication scenarios, see [Authenticate with an Azure container registry](container-registry-authentication.md).

Azure Container Registry supports security practices in your organization to distribute duties and privileges to different identities. Using [role-based access control](container-registry-roles.md), assign appropriate permissions to different users, service principals, or other identities that perform different registry operations. For example, assign push permissions to a service principal used in a build pipeline and assign pull permissions to a different identity used for deployment. Create [tokens](container-registry-repository-scoped-permissions.md) for fine-grained, time-limited access to specific repositories.

## Manage registry size      

The storage constraints of each [container registry service tier][container-registry-skus] are intended to align with a typical scenario: **Basic** for getting started, **Standard** for most production applications, and **Premium** for hyper-scale performance and [geo-replication][container-registry-geo-replication]. Throughout the life of your registry, you should manage its size by periodically deleting unused content.

Use the Azure CLI command [az acr show-usage][az-acr-show-usage] to display the current consumption of storage and other resources in your registry:

```azurecli
az acr show-usage --resource-group myResourceGroup --name myregistry --output table
```

Sample output:

```
NAME                        LIMIT         CURRENT VALUE    UNIT
--------------------------  ------------  ---------------  ------
Size                        536870912000  215629144        Bytes
Webhooks                    500           1                Count
Geo-replications            -1            3                Count
IPRules                     100           1                Count
VNetRules                   100           0                Count
PrivateEndpointConnections  10            0                Count
```

You can also find the current storage usage in the **Overview** of your registry in the Azure portal:

![Registry usage information in the Azure portal][registry-overview-quotas]

> [!NOTE]
> In a [geo-replicated](container-registry-geo-replication.md) registry, storage usage is shown for the home region. Multiply by the number of replications for total registry storage consumed.

### Delete image data

Azure Container Registry supports several methods for deleting image data from your container registry. You can delete images by tag or manifest digest, or delete a whole repository.

For details on deleting image data from your registry, including untagged (sometimes called "dangling" or "orphaned") images, see [Delete container images in Azure Container Registry](container-registry-delete.md). You can also set a [retention policy](container-registry-retention-policy.md) for untagged manifests.

## Next steps

Azure Container Registry is available in several tiers (also called SKUs) that provide different capabilities. For details on the available service tiers, see [Azure Container Registry service tiers](container-registry-skus.md).

For recommendations to improve the security posture of your container registries, see [Azure Security Baseline for Azure Container Registry](security-baseline.md).

<!-- IMAGES -->
[delete-repository-portal]: ./media/container-registry-best-practices/delete-repository-portal.png
[registry-overview-quotas]: ./media/container-registry-best-practices/registry-overview-quotas.png

<!-- LINKS - Internal -->
[az-acr-repository-delete]: /cli/azure/acr/repository#az_acr_repository_delete
[az-acr-show-usage]: /cli/azure/acr#az_acr_show_usage
[azure-cli]: /cli/azure
[container-registry-geo-replication]: container-registry-geo-replication.md
[container-registry-skus]: container-registry-skus.md