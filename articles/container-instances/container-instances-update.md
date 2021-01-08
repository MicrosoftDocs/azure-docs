---
title: Update container group
description: Learn how to update running containers in your Azure Container Instances container groups.
ms.topic: article
ms.date: 04/17/2020
---

# Update containers in Azure Container Instances

During normal operation of your container instances, you may find it necessary to update the running containers in a [container group](./container-instances-container-groups.md). For example, you might wish to update a property such as an image version, a DNS name, or an environment variable, or refresh a property in a container whose application has crashed.

Update the containers in a running container group by redeploying an existing group with at least one modified property. When you update a container group, all running containers in the group are restarted in-place, usually on the same underlying container host.

> [!NOTE]
> Terminated or deleted container groups can't be updated. Once a container group has terminated (is in either a Succeeded or Failed state) or has been deleted, the group must be deployed as new. See other [limitations](#limitations).

## Update a container group

To update an existing container group:

* Issue the create command (or use the Azure portal) and specify the name of an existing group 
* Modify or add at least one property of the group that supports update when you redeploy. Certain properties [don't support updates](#properties-that-require-container-delete).
* Set other properties with the values you provided previously. If you don't set a value for a property, it reverts to its default value.

> [!TIP]
> A [YAML file](./container-instances-container-groups.md#deployment) helps maintain a container group's deployment configuration, and provides a starting point to deploy an updated group. If you used a different method to create the group, you can export the configuration to YAML by using [az container export][az-container-export], 

### Example

The following Azure CLI example updates a container group with a new DNS name label. Because the DNS name label property of the group is one that can be updated, the container group is redeployed, and its containers restarted.

Initial deployment with DNS name label *myapplication-staging*:

```azurecli-interactive
# Create container group
az container create --resource-group myResourceGroup --name mycontainer \
    --image nginx:alpine --dns-name-label myapplication-staging
```

Update the container group with a new DNS name label, *myapplication*, and set the remaining properties with the values used previously:

```azurecli-interactive
# Update DNS name label (restarts container), leave other properties unchanged
az container create --resource-group myResourceGroup --name mycontainer \
    --image nginx:alpine --dns-name-label myapplication
```

## Update benefits

The primary benefit of updating an existing container group is faster deployment. When you redeploy an existing container group, its container image layers are pulled from those cached by the previous deployment. Instead of pulling all image layers fresh from the registry as is done with new deployments, only modified layers (if any) are pulled.

Applications based on larger container images like Windows Server Core can see significant improvement in deployment speed when you update instead of delete and deploy new.

## Limitations

* Not all properties of a container group support updates. To change some properties of a container group, you must first delete, then redeploy the group. See [Properties that require container delete](#properties-that-require-container-delete).
* All containers in a container group are restarted when you update the container group. You can't perform an update or in-place restart of a specific container in a multi-container group.
* The IP address of a container group is typically retained between updates, but isn't guaranteed to remain the same. As long as the container group is deployed to the same underlying host, the container group retains its IP address. Although rare, there are some Azure-internal events that can cause redeployment to a different host. To mitigate this issue, we recommend using a DNS name label for your container instances.
* Terminated or deleted container groups can't be updated. Once a container group is stopped (is in the *Terminated* state) or deleted, the group is deployed as new.

## Properties that require container delete

Not all container group properties can be updated. For example, to change the restart policy of a container, you must first delete the container group, then create it again.

Changes to these properties require container group deletion prior to redeployment:

* OS type
* CPU, memory, or GPU resources
* Restart policy
* Network profile

When you delete a container group and recreate it, it's not "redeployed," but created new. All image layers are pulled fresh from the registry, not from those cached by a previous deployment. The IP address of the container might also change due to being deployed to a different underlying host.

## Next steps

Mentioned several times in this article is the **container group**. Every container in Azure Container Instances is deployed in a container group, and container groups can contain more than one container.

[Container groups in Azure Container Instances](./container-instances-container-groups.md)

[Deploy a multi-container group](container-instances-multi-container-group.md)

[Manually stop or start containers in Azure Container Instances](container-instances-stop-start.md)

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container?view=azure-cli-latest#az-container-create
[azure-cli-install]: /cli/azure/install-azure-cli
[az-container-export]: /cli/azure/container#az-container-export
