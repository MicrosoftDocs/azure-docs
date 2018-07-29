---
title: Restart containers in Azure Container Instances
description: Learn how to restart containers in your Azure Container Instances container groups.
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 08/01/2018
ms.author: marsma
---

# Restart containers in Azure Container Instances

During normal operation of your container instances, you may find it necessary to restart the containers in a container group. For example, you might wish to change a DNS name, update environment variables, or refresh the state of a container whose application has crashed.

Although Azure Container Instances doesn't provide a native "restart" command, redeploying an existing container group effectively restarts all containers in the group.

## Restart a container

Restart the containers in a container group by redeploying an existing group with at least one modified property. Redeploy an existing container group by issuing the create command (or use the Azure portal) and specify the name an existing group. **Modify at least one property** of the group when you issue the create command to trigger the redeployment.

Not all container group properties support redeployment. See [Properties that require delete](#properties-that-require-delete) for a list of unsupported properties.

The following Azure CLI example redeploys a container group with a new DNS name label. Because the DNS name label property of the group, the containers are restarted.

Initial deployment with DNS name label *myapplication-staging*:

```azurecli-interactive
az container create --resource-group myResourceGroup --name mycontainer \
    --image nginx:alpine --dns-name-label myapplication-staging
```

Redeployment with a new DNS name label, *myapplication*:

```azurecli-interactive
# Redeploy container group (restarts container)
az container create --resource-group myResourceGroup --name mycontainer \
    --image nginx:alpine --dns-name-label myapplication
```

## Container restart benefits

Container image layers are pulled from cache when you redeploy a container group. This can greatly speed the redeployment of a container if the container's image is large. For example, when you redeploy a Windows Server Core-based container image, the container starts in seconds instead of minutes.

## Container restart limitations

Not all properties of a container group support redeployment. To change some properties of a container group, you must first delete, then redeploy the group. For details, see [Properties that require container delete](#properties-that-require-container-delete).

All containers within a container group are restarted when you redeploy the container group. You can't selectively restart a container in a multi-container group.

The IP address of a container shouldn't change between deployments. As long as the container group is deployed to the same underlying host, the container group retains its IP address. Although rare, and while Azure Container Instances makes every effort to redeploy to the same host, there are some Azure-internal events that can cause redeployment to a different host. To mitigate this issue, always use a DNS name label for your container instances.

Terminated or deleted container groups can't be redeployed (restarted). Once a container group has stopped (is in the *Terminated* state) or has been deleted, the group is deployed as new.

## Properties that require container delete

As mentioned earlier, not all container group properties support redeployment of a container group. For example, to change the ports or restart policy of a container, you must first delete the container group, then create it again.

These properties require container group delete before redeployment:

* OS type
* CPU
* Memory
* Restart policy
* Ports

When you delete a container group and re-create it, it's not "redeployed," but created new. All image layers are pulled fresh from the registry, not the cache. The IP address of the container might also change due to being deployed to a different underlying host.

## Next steps

Mentioned several times in this article is the **container group**. Every container in Azure Container Instances is deployed in a container group, and container groups can contain more than one container.

[Container groups in Azure Container Instances](container-instances-container-groups.md)

[Deploy a multi-container group](container-instances-multi-container-group.md)

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container?view=azure-cli-latest#az_container_create
[az-container-logs]: /cli/azure/container?view=azure-cli-latest#az_container_logs
[az-container-show]: /cli/azure/container?view=azure-cli-latest#az_container_show
[azure-cli-install]: /cli/azure/install-azure-cli
