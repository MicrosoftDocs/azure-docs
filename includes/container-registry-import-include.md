---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 02/24/2021
ms.author: danlep
---
## Import image to registry

Use the [az acr import][az-acr-import] command in the [Azure CLI][azure-cli] to import the image from Docker Hub to your registry. 

Substitute the name of the source repo and tag in Docker Hub, your Docker Hub [account](https://docs.docker.com/docker-hub/download-rate-limit/#how-do-i-authenticate-pull-requests) credentials, your registry name, and optionally a different name and tag of the image in the target registry:

```azurecli
az acr import \
   --name myregistry \
   --source docker.io/library/repo:tag \
   --image myprivateimage:mytag \
   --username <Docker Hub username> \
   --password <Docker Hub password>  
```

[azure-cli]: /cli/azure/install-azure-cli
[az-acr-import]: /cli/azure/acr#az-acr-import
[docker-account]: (https://docs.docker.com/docker-id/)