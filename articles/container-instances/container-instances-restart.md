---
title: Restart containers in Azure Container Instances
description: Learn how to restart containers in your Azure Container Instances container groups.
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 07/30/2018
ms.author: marsma
---

# Restart containers in Azure Container Instances

Stuff.

The examples presented in this article use the Azure CLI. You must have Azure CLI version 2.0.21 or greater [installed locally][azure-cli-install], or use the CLI in the [Azure Cloud Shell](../cloud-shell/overview.md).

## Next steps

### Persist task output

For details on how to persist the output of your containers that run to completion, see [Mounting an Azure file share with Azure Container Instances](container-instances-mounting-azure-files-volume.md).

<!-- LINKS - External -->
[aci-wordcount-image]: https://hub.docker.com/r/microsoft/aci-wordcount/

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container?view=azure-cli-latest#az_container_create
[az-container-logs]: /cli/azure/container?view=azure-cli-latest#az_container_logs
[az-container-show]: /cli/azure/container?view=azure-cli-latest#az_container_show
[azure-cli-install]: /cli/azure/install-azure-cli
