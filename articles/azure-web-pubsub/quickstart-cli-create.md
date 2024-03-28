---
title: Quickstart - Create a Web PubSub instance with the Azure CLI
description: Quickstart showing how to create a Web PubSub instance with the Azure CLI
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: quickstart
ms.date: 11/08/2021
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Create a Web PubSub instance with the Azure CLI

The [Azure CLI](/cli/azure) is a set of commands used to create and manage Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation. This quickstart shows you the options to create Azure Web PubSub instance with the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

[!INCLUDE [Create a resource group](includes/cli-rg-creation.md)]

## Create a Web PubSub instance

[!INCLUDE [Create a Web PubSub instance](includes/cli-awps-creation.md)]

## Try the newly created instance

> [!div class="nextstepaction"]
> [Try the newly created instance using CLI](./quickstart-cli-try.md#play-with-the-instance)

> [!div class="nextstepaction"]
> [Try the newly created instance from the browser](./quickstart-live-demo.md#try-the-instance-with-an-online-demo)

## Clean up resources

[!INCLUDE [Clean up resource](includes/cli-delete-resources.md)]

## Next steps

In real-world applications, you can use SDKs in various languages build your own application. We also provide Function extensions for you to build serverless applications easily.

[!INCLUDE [next step](includes/include-next-step.md)]
