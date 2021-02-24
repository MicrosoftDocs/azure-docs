---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 02/24/2021
ms.author: danlep
---
## Login to registry

Before pulling or pushing container images, you must log in to the registry. To do so, use the [az acr login][az-acr-login] command in the [Azure CLI][azure-cli]. Specify only the registry name when logging in with the Azure CLI. Don't use the login server name, which includes a domain suffix like `azurecr.io`.

You must also have Docker installed locally. Docker provides packages that configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

```azurecli
az acr login --name <registry-name>
```

Example:

```azurecli
az acr login --name myregistry
```

[azure-cli]: /cli/azure/install-azure-cli
[az-group-create]: /cli/azure/group#az_group_create
[az-acr-login]: /cli/azure/acr#az_acr_login
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows