---
title: Create custom actions and resources in Azure
description: This tutorial goes over how to create custom actions and resources in Azure Resource Manager. It also shows how to integrate them into custom workflows for Azure Resource Manager Templates, Azure CLI, Azure Policy, and Activity Log.
author: jjbfour
ms.service: managed-applications
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Create custom actions and resources in Azure

A custom provider is a contract between Azure and an endpoint. With custom providers, you can change workflows in Azure by adding new APIs into Azure Resource Manager. With these custom APIs, Resource Manager can use new deployment and management capabilities.

This tutorial shows a simple example of how to add new actions and resources to Azure and then how to integrate them.

This tutorial contains the following steps:

1. Set up Azure Functions for Azure Custom Providers
1. Author a RESTful endpoint for custom providers
1. Create and use the custom provider

## Set up Azure Functions for Azure Custom Providers

This part of the tutorial describes how to set up an Azure function app to work with custom providers. Custom providers can work with any public URL.

- [Set up Azure Functions for Azure Custom Providers](./tutorial-custom-providers-function-setup.md)

## Author a RESTful endpoint for custom providers

This part of the tutorial describes how to author a RESTful endpoint for custom providers.

- [Authoring a RESTful endpoint for custom providers](./tutorial-custom-providers-function-authoring.md)

## Create and use the custom provider

This part of the tutorial describes how to create a custom provider and use its custom actions and resources.

- [Create and utilize a Azure Custom Provider](./tutorial-custom-providers-create.md)

## Next steps

In this tutorial, you learned about custom providers and how to build one. To proceed to the next tutorial, see [Tutorial: Set up Azure Functions for Azure Custom Providers](./tutorial-custom-providers-function-setup.md).

If you are looking for references or a quickstart, here are some useful links:

- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [How to: Adding Custom Actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How to: Adding Custom Resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
