---
title: Update containers in Azure Container Instances
description: Learn how to update running containers in your Azure Container Instances container groups.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 08/01/2018
ms.author: danlep
---

# Update containers in Azure Container Instances

During normal operation of your container instances, you may find it necessary to update the containers in a container group. For example, you might wish to update the image version, change a DNS name, update environment variables, or refresh the state of a container whose application has crashed.

## Update a container group

Update the containers in a container group by redeploying an existing group with at least one modified property. When you update a container group, all running containers in the group are restarted in-place.

Redeploy an existing container group by issuing the create command (or use the Azure portal) and specify the name of an existing group. Modify at least one valid property of the group when you issue the create command to trigger the redeployment. Not all container group properties are valid for redeployment. See [Properties that require delete](#properties-that-require-container-delete) for a list of unsupported properties.

The following Azure CLI example updates a container group with a new DNS name label. Because the DNS name label property of the group is modified, the container group is redeployed, and its containers restarted.

Initial deployment with DNS name label *myapplication-staging*:

```azurecli-interactive
# Create container group
az container create --resource-group myResourceGroup --name mycontainer \
    --image nginx:alpine --dns-name-label myapplication-staging
```

Update the container group with a new DNS name label, *myapplication*:

```azurecli-interactive
# Update container group (restarts container)
az container create --resource-group myResourceGroup --name mycontainer \
    --image nginx:alpine --dns-name-label myapplication
```

## Update benefits

The primary benefit of updating an existing container group is faster deployment. When you redeploy an existing container group, its container image layers are pulled from those cached by the previous deployment. Instead of pulling all image layers fresh from the registry as is done with new deployments, only modified layers (if any) are pulled.

Applications based on larger container images like Windows Server Core can see significant improvement in deployment speed when you update instead of delete and deploy new.

## Limitations

Not all properties of a container group support updates. To change some properties of a container group, you must first delete, then redeploy the group. For details, see [Properties that require container delete](#properties-that-require-container-delete).

All containers in a container group are restarted when you update the container group. You can't perform an update or in-place restart of a specific container in a multi-container group.

The IP address of a container won't typically change between updates, but it's not guaranteed to remain the same. As long as the container group is deployed to the same underlying host, the container group retains its IP address. Although rare, and while Azure Container Instances makes every effort to redeploy to the same host, there are some Azure-internal events that can cause redeployment to a different host. To mitigate this issue, always use a DNS name label for your container instances.

Terminated or deleted container groups can't be updated. Once a container group has stopped (is in the *Terminated* state) or has been deleted, the group is deployed as new.

## Properties that require container delete

As mentioned earlier, not all container group properties can be updated. For example, to change the ports or restart policy of a container, you must first delete the container group, then create it again.

These properties require container group deletion prior to redeployment:

* OS type
* CPU
* Memory
* Restart policy
* Ports

When you delete a container group and recreate it, it's not "redeployed," but created new. All image layers are pulled fresh from the registry, not from those cached by a previous deployment. The IP address of the container might also change due to being deployed to a different underlying host.

## Next steps

Mentioned several times in this article is the **container group**. Every container in Azure Container Instances is deployed in a container group, and container groups can contain more than one container.

[Container groups in Azure Container Instances](container-instances-container-groups.md)

[Deploy a multi-container group](container-instances-multi-container-group.md)

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container?view=azure-cli-latest#az-container-create
[az-container-logs]: /cli/azure/container?view=azure-cli-latest#az-container-logs
[az-container-show]: /cli/azure/container?view=azure-cli-latest#az-container-show
[azure-cli-install]: /cli/azure/install-azure-cli
