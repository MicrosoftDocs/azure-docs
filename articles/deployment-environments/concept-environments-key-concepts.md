---
title: Azure Deployment Environments concepts
description: An overview of key concepts in Azure Deployment Environments.
ms.service: deployment-environments
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/06/2022
---
# Azure Deployment Environments concepts

The following list contains key concepts and definitions in Azure Deployment Environments.

## DevCenters

A DevCenter helps you to manage a group of projects together by applying similar settings and providing the 'infra as code' templates across different projects.

## Projects

Project is the infrastructure that encompasses Environments and development team members. You can associate Project(s) to a specific DevCenter and automatically all the settings at the DevCenter level will be applied to the Project.

## Environments

Environment is a collection of Azure resources on which your application is deployed. For example, to deploy a web application, you might create an environment consisting of an App Service, KeyVault, Cosmos DB and a Storage Account. An environment could consist of both Azure PaaS and IaaS resources such as AKS Cluster, App Service, VMs, databases, etc.

## Identities

<!-- [Managed Identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) --> are used in Deployment Environments to provide elevation-of-privilege capabilities. Identities will help provide self-serve capabilities to your development teams without them needing any access to the target subscriptions in which Azure resources are created. The managed identity attached to the DevCenter needs to be granted appropriate access to the target subscriptions and Deployment Environments will use that identity to perform the deployment on behalf of the developer.

## Environment Types

You can use 'Environment Types' to define the type of environments the development teams can create. Examples are Dev, Test, SandBox, Pre-Production, Production, etc. Deployment Environments provides the flexibility to name the Environment Types as per the nomenclature used in your enterprise. Once you create an Environment Type, you'll be able to apply different settings for each.

## Mappings

Mappings will help you pre-configure the target subscription in which Azure resources will be created per Project per Environment Type. You'll be able to provide different subscriptions for different Environment Types in a given Project. Mappings will allow you to automatically apply the right set of policies on different Environments and abstracts the Azure related concepts from your development teams.

## Catalogs

Catalog helps you to provide a set of curated 'infra-as-code' templates for your development teams to create Environments. You can attach either a GitHub Repository or Azure DevOps Services repository as a Catalog. Deployment Environments will scan through the respective folder of the repository to find Catalog Items, 'infra-as-code' template and their respective manifest, and make them available to use by all the Projects associated with the DevCenter.

## Catalog Items

A Catalog Item is a combination of 'infra-as-code' template (ARM templates during preview) and a manifest file. The environment definition will be defined in the ARM template and manifest will be used to provide metadata about the template. The Catalog Items that you provide in the Catalog will be used by your development teams to spin-up environments in Azure. <!-- [Learn more about Catalog Items](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-a-catalog-item.md) -->

<!--

## Azure Resource Manager templates

[Azure Resource Manager(ARM) templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview) helps you to define the infrastructure/configuration of your Azure solution and repeatedly deploy it in a consistent state.

[Understand the structure and syntax of Azure Resource Manager templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/syntax) describes the structure of an Azure Resource Manager template and the properties that are available in the different sections of a template.


## Next steps

[Tutorial: Set up and Configure a DevCenter](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/tutorial-create-and-configure-devcenter.md)
-->