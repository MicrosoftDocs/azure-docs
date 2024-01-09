---
title: "Best practices for structuring an Azure Deployment Environments catalog"
description: "This article provides guidelines for structuring an Azure Deployment Environments catalog for efficient caching."
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.topic: best-practice 
ms.date: 11/27/2023

#customer intent: As a platform engineer, I want to structure my catalog so that Azure Deployment Environments can find and cache  environment definitions efficiently.

---

# Best practices for Azure Deployment Environment catalogs

This article describes the best practice guidelines for structuring an Azure Deployment Environments catalog.

## Structure the catalog for efficient caching
As a platform engineer, you should structure your catalog in a way that makes it easier and quicker for Azure Deployment Environments to find and cache environment definitions efficiently. By organizing the repository into a specific structure, you can better target files for caching and improve the overall performance of the deployment process. It's essential for platform engineers to understand these guidelines and structure their repositories accordingly to ensure optimal results.

When you attach a catalog to a dev center, Deployment Environments scans the catalog for an environment.yaml file. On locating the file, ADE assumes the files in that folder and subfolders form an environment definition. ADE caches only the required files, not the entire repository. 

The following diagram shows the recommended structure for a repo. Each template resides within a single folder.

:::image type="content" source="media/best-practice-catalog-structure/deployment-environments-catalog-structure.png" alt-text="Diagram that shows the recommended folder structure for an Azure Deployment Environments catalog." lightbox="media/best-practice-catalog-structure/deployment-environments-catalog-structure.png":::

## Linked environment definitions
In a linked environment definitions scenario, multiple .json files can point to a single ARM template. ADE checks linked  environment definitions sequentially and retrieves the linked files and  environment definitions from the repository. For best performance, these interactions should be minimized. 

## Update  environment definitions and sync changes
Over time, environment definitions need updates. You make those updates in your Git repository, and then you must manually sync the catalog up to update the changes to ADE. 

## Files outside recommended structure
In the following example, the Azuredeploy.json file is above the environment.yaml file in the folder structure. This structure is not valid Azure Deployment Environments catalogs. Environment definitions cannot reference content outside of the catalog item folder.

:::image type="content" source="media/best-practice-catalog-structure/deployment-environments-catalog-structure-not-supported.png" alt-text="Diagram that shows a nonsupported structure for an Azure Deployment Environments catalog, with a json file in a folder above the environment.yaml file." lightbox="media/best-practice-catalog-structure/deployment-environments-catalog-structure-not-supported.png":::

## Related content
- [Add and configure a catalog from GitHub or Azure DevOps in Azure Deployment Environments](/azure/deployment-environments/how-to-configure-catalog?tabs=DevOpsRepoMSI)
- [Add and configure an environment definition in Azure Deployment Environments](/azure/deployment-environments/configure-environment-definition)