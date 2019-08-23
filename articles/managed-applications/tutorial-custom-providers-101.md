---
title: Create custom actions and resources in Azure
description: This tutorial will go over how to create custom actions and resources in Azure Resource Manager and how to integrate them into custom workflows for Azure Resource Manager Templates, Azure CLI, Azure Policy, and Activity Log.
author: jjbfour
ms.service: managed-applications
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Create custom actions and resources in Azure

Custom providers allow you to customize workflows on Azure. A custom provider is a contract between Azure and an `endpoint`. It allows the addition of new custom APIs into the Azure Resource Manager to enable new deployment and management capabilities. This tutorial will go through a simple example of how to add new actions and resources to Azure and how to integrate them.

This tutorial is broken into the following steps:

- Setup Azure Functions for Azure Custom Providers
- Authoring a RESTful endpoint for custom providers
- Creating and utilizing the custom provider

## Setup Azure Functions for Azure Custom Providers

This part of the tutorial will go into detail about how to setup an Azure Function to work with custom providers. Custom providers can work with any public URL.

- [Setup Azure Functions for Azure Custom Providers](./tutorial-custom-providers-function-setup.md)

## Authoring a RESTful endpoint for custom providers

This part of the tutorial will go into detail about authoring a RESTful endpoint for custom providers.

- [Authoring a RESTful endpoint for custom providers](./tutorial-custom-providers-function-authoring.md)

## Creating and utilizing the custom provider

This part of the tutorial will go into detail about how to create a custom provider and use its custom actions and resources.

- [Create and utilize a Azure Custom Provider](./tutorial-custom-providers-create.md)

## Next steps

In this article, we learned about custom providers and how to build one. To Proceed with the next step of the tutorial:

- [Tutorial: Setup Azure Functions for Azure Custom Providers](./tutorial-custom-providers-function-setup.md)

If you are looking for references or a quickstart, here are some useful links:

- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [How To: Adding Custom Actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How To: Adding Custom Resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
