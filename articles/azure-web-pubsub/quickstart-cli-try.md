---
title: Quickstart - Connect and play with the Azure Web PubSub instance
description: Quickstart showing how to play with the instance from the Azure CLI
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 11/08/2021
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Connect to the Azure Web PubSub instance from CLI

This quickstart shows you how to connect to the Azure Web PubSub instance and publish messages to the connected clients using the [Azure CLI](/cli/azure).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

## Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

## Play with the instance

[!INCLUDE [Try the Web PubSub instance](includes/cli-awps-client.md)]

## Next steps

This quickstart provides you a basic idea of how to connect to the Web PubSub service and how to publish messages to the connected clients.

In real-world applications, you can use SDKs in various languages build your own application. We also provide Function extensions for you to build serverless applications easily.

[!INCLUDE [next step](includes/include-next-step.md)]
