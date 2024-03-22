---
author: cephalin
ms.service: app-service
ms.custom: devx-track-azurecli
ms.topic: "include"
ms.date: 05/12/2021
ms.author: cephalin
---

## Add Azure CLI extensions

Launch the Bash environment in [Azure Cloud Shell](../articles/cloud-shell/get-started.md).

:::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

Because these CLI commands are not yet part of the core CLI set, add them with the following commands:

```azurecli-interactive
az extension add --upgrade --yes --name customlocation
az extension remove --name appservice-kube
az extension add --upgrade --yes --name appservice-kube
```
