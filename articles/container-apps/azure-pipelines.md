---
title: Publish revisions with Azure Pipelines in Azure Container Apps
description: Learn to automatically create new revisions in Azure Container Apps using a Azure DevOps pipeline
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 11/09/2022
ms.author: cshoe
---

# Deploy to Azure Container Apps from Azure Pipelines

Azure Container Apps allows you to use GitHub Actions to publish [revisions](revisions.md) to your container app. As commits are pushed to your GitHub repository, a GitHub Actions workflow is triggered which updates the [container](containers.md) image in the container registry. Once the container is updated in the registry, Azure Container Apps creates a new revision based on the updated container image.

:::image type="content" source="media/github-actions/azure-container-apps-github-actions.png" alt-text="Changes to a GitHub repo trigger an action to create a new revision.":::

The GitHub Actions workflow is triggered by commits to a specific branch in your repository. When creating the workflow, you decide which branch triggers the action.

This article shows you how to create your own workflow that you can fully customize. To generate a starter GitHub Actions workflow with Azure CLI, see [Generate GitHub Actions workflow with Azure CLI](github-actions-cli.md).
