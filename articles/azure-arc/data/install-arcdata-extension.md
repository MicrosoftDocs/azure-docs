---
title: Install `arcdata` extension
description: Install the `arcdata` extension for Azure (`az`) CLI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Install `arcdata` Azure CLI extension

> [!IMPORTANT]
> If you are updating to a new release, please be sure to also update to the latest version of Azure CLI and the `arcdata` extension.


## Install latest Azure CLI 

To get the latest Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).


## Add `arcdata` extension

To add the extension, run the following command: 

```azurecli
az extension add --name arcdata 
```

[Learn more about Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

## Update `arcdata` extension

If you already have the extension, you can update it with the following command:

```azurecli
az extension update --name arcdata
```

## Related content

[Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md)
