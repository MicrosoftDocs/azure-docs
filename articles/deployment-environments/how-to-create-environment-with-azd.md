---
title: Create and access an environment by using the Azure Developer CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create an environment in an Azure Deployment Environments project by using the Azure Developer CLI.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2023
ms.topic: how-to
ms.date: 10/26/2023
---

# Create and access an environment by using the Azure Developer CLI

In this article, you'll install the Azure Developer CLI and use it to create an environment in an Azure Deployment Environments project.

Azure Developer CLI `azd` is an open-source tool that accelerates the time it takes for you to get your application from local development environment to Azure. azd provides best practice, developer-friendly commands that map to key stages in your workflow, whether you’re working in the terminal, your editor or integrated development environment (IDE), or CI/CD (continuous integration/continuous deployment).

:::image type="content" source="media/how-to-create-environment-with-azd/workflow.png" alt-text="alt text":::

## Prerequisites

Verify you have completed the following prerequisites to work with Azure Deployment Environments using `azd`:

* [Installed `azd` locally](/azure/developer/azure-developer-cli/install-azd) or have access to `azd` via Cloud Shell
* [Created and configured a dev center](/azure/deployment-environments/quickstart-create-and-configure-devcenter) with a project, environment types, and an AZD template catalog.

## Enable Azure Deployment Environment support

You can configure `azd` to provision and deploy resources to your deployment environments using standard commands such as `azd up` or `azd provision`. To enable support for Azure Deployment Environments, run the following command:

```bash
azd config set platform.type devcenter
```

When `platform.type` is set to `devcenter`, all `azd` remote environment state and provisioning will leverage new dev center components. This configuration also means that the `infra` folder in your local templates will effectively be ignored. Instead, `azd` will use one of the infrastructure templates defined in your dev center catalog for resource provisioning.

## Clone the repo

##  