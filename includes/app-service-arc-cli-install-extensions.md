---
author: cephalin
ms.service: app-service
ms.custom: devx-track-azurecli
ms.topic: "include"
ms.date: 05/12/2021
ms.author: cephalin
---

## Add Azure CLI extensions

Launch the Bash environment in [Azure Cloud Shell](../articles/cloud-shell/quickstart.md).

[![Launch Cloud Shell in a new window](./media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

Because these CLI commands are not yet part of the core CLI set, add them with the following commands:

```azurecli-interactive
az extension add --upgrade --yes --name customlocation
az extension remove --name appservice-kube
az extension add --upgrade --yes --name appservice-kube
```
