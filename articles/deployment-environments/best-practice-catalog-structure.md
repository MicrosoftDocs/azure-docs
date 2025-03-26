---
title: Best practices for structuring an Azure Deployment Environments catalog
description: Get guidelines for structuring an Azure Deployment Environments catalog to help ensure efficient caching.
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.topic: best-practice 
ms.date: 03/20/2025

# Customer intent: As a platform engineer, I want to structure my catalog so that Azure Deployment Environments can find and cache  environment definitions efficiently.

---

# Best practices for Azure Deployment Environments catalogs

This article describes best practices for structuring an Azure Deployment Environments catalog.

## Structure the catalog for efficient caching

Platform engineers should structure catalogs in a way that makes it easier and quicker for Azure Deployment Environments to find and cache environment definitions. By organizing the repository into a specific structure, you can better target files for caching and improve the overall performance of the deployment process. To ensure optimal results, platform engineers need to understand these guidelines and structure their repositories accordingly.

When you attach a catalog to a dev center, Deployment Environments scans the catalog for an environment.yaml or a manifest.yaml file. When it locates the file, Azure Deployment Environments assumes the files in that folder and subfolders form an environment definition. Azure Deployment Environments caches only the required files, not the entire repository. 

The following diagram shows the recommended structure for a repo. Each template resides within a single folder.

:::image type="content" source="media/best-practice-catalog-structure/deployment-environments-catalog-structure.png" alt-text="Diagram that shows the recommended folder structure for an Azure Deployment Environments catalog." lightbox="media/best-practice-catalog-structure/deployment-environments-catalog-structure.png":::

## Linked environment definitions

In a linked environment definitions scenario, multiple .json files can point to a single template. Azure Deployment Environments checks linked environment definitions sequentially and retrieves the linked files and  environment definitions from the repository. For best performance, these interactions should be minimized. 

## Update environment definitions and sync changes

Over time, environment definitions need updates. You make those updates in your Git repository. You must then manually sync the catalog to update the changes to Azure Deployment Environments. 

## Files outside of the recommended structure

In the following example, the Azuredeploy.json file is above the environment.yaml (or manifest.yaml) file in the folder structure. This structure isn't valid. Environment definitions can't reference content outside of the catalog item folder.

:::image type="content" source="media/best-practice-catalog-structure/deployment-environments-catalog-structure-not-supported.png" alt-text="Diagram that shows an unsupported structure for an Azure Deployment Environments catalog." lightbox="media/best-practice-catalog-structure/deployment-environments-catalog-structure-not-supported.png":::

## Related content

- [Add and configure a catalog from GitHub or Azure DevOps in Azure Deployment Environments](/azure/deployment-environments/how-to-configure-catalog?tabs=DevOpsRepoMSI)
- [Add and configure an environment definition in Azure Deployment Environments](/azure/deployment-environments/configure-environment-definition)