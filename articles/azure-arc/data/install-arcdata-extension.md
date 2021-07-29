---
title: Install `arcdata` extension
description: Install the `arcdata` extension for Azure (az) cli
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Install `arcdata` Azure CLI extension

> [!IMPORTANT]
> If you are updating to a new monthly release, please be sure to also update to the latest version of Azure CLI and the Azure CLI extension.


## Install latest Azure CLI 

To get the latest Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).


## Add the `arcdata` extension

To add the extension, run the following command: 

```azurecli
az extension add --name arcdata 
```

[Learn more about Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

## Next steps

[Create the Azure Arc data controller](create-data-controller.md)
