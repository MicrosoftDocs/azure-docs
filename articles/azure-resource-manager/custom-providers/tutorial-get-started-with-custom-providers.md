---
title: Create custom actions and resources
description: This tutorial goes over how to create custom actions and resources in Azure Resource Manager. It also shows how custom workflows interoperate with Azure Resource Manager Templates, Azure CLI, Azure Policy, and Azure Activity Log.
author: jjbfour
ms.topic: tutorial
ms.custom: devx-track-arm-template, devx-track-azurecli
ms.date: 06/19/2019
ms.author: jobreen
---

# Create custom actions and resources in Azure

A custom resource provider is a contract between Azure and an endpoint. With custom resource providers, you can change workflows in Azure by adding new APIs into Azure Resource Manager. With these custom APIs, Resource Manager can use new deployment and management capabilities.

This tutorial goes through a simple example of how to add new actions and resources to Azure and how to integrate them.

## Set up Azure Functions for Azure Custom Resource Providers

Part one of this tutorial describes how to set up an Azure function app to work with custom resource providers:

- [Set up Azure Functions for Azure Custom Resource Providers](./tutorial-custom-providers-function-setup.md)

Custom resource providers can work with any public URL.

## Author a RESTful endpoint for custom resource providers

Part two of this tutorial describes how to author a RESTful endpoint for custom resource providers:

- [Authoring a RESTful endpoint for custom resource providers](./tutorial-custom-providers-function-authoring.md)

## Create and use a custom resource provider

Part three of this tutorial describes how to create a custom resource provider and use its custom actions and resources:

- [Create and use a custom resource provider](./tutorial-custom-providers-create.md)

## Next steps

In this tutorial, you learned about custom resource providers and how to build one. To continue to the next tutorial, see [Tutorial: Set up Azure Functions for Azure Custom Resource Providers](./tutorial-custom-providers-function-setup.md).

If you're looking for references or a quickstart, here are some useful links:

- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [How to: Adding custom actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How to: Adding custom resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
