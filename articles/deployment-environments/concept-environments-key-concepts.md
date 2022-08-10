---
title: Azure Deployment Environments key concepts
description: Learn the key concepts behind Azure Deployment Environments.
ms.service: deployment-environments
ms.topic: conceptual
ms.author: meghaanand
author: anandmeg
ms.date: 07/29/2022
---

# Key concepts for new Azure Deployment Environments users

Learn about the key concepts and components of Azure Deployment Environments preview. This can help you to more effectively deploy environments for your scenarios.

## Dev centers

A dev center is a collection of projects that require similar settings. It allows you to manage multiple projects together and apply 'infra as code' templates across different projects.

## Projects

A project is the point of access to [Environments](#environments) for the development team members. When you associate a project with a dev center, all the settings at the dev center level will be automatically applied to the project. A project can be associated with only one dev center and provides the infrastructure for project-specific environment templates to create and access environments.

## Environments

Environment is a collection of Azure resources on which your application is deployed. For example, to deploy a web application, you might create an environment consisting of an [App Service](../app-service/overview.md), [Key Vault](../key-vault/general/basic-concepts.md), [Cosmos DB](../cosmos-db/introduction.md) and a [Storage account](../storage/common/storage-account-overview.md). An environment could consist of both Azure PaaS and IaaS resources such as AKS Cluster, App Service, VMs, databases, etc.

## Identities

[Managed Identities](../active-directory/managed-identities-azure-resources/overview.md) are used in Azure Deployment Environments to provide elevation-of-privilege capabilities. Identities will help provide self-serve capabilities to your development teams without them needing any access to the target subscriptions in which the Azure resources are created. The managed identity attached to the dev center needs to be granted appropriate access to the target subscriptions and Azure Deployment Environments will use that identity to perform the deployment on behalf of the developer.

## Environment types

You can use Environment types to define the type of environments the development teams can create, for example, Dev, Test, SandBox, Pre-Production, Production, etc. Azure Deployment Environments provides the flexibility to name the Environment Types as per the nomenclature used in your enterprise. When you create an Environment Type, you'll be able to apply different settings to different Environment Types in a certain Project.

## Mappings

Mappings will help you pre-configure the target subscription in which Azure resources will be created per Project, per Environment type. You'll be able to provide different subscriptions for different environment types in a given Project. Mappings will allow you to automatically apply the right set of policies on different environments and abstract the Azure related concepts from your development teams.

## Catalogs

Catalogs help you provide a set of curated 'infra-as-code' templates for your development teams to create Environments. You can attach either a [GitHub repository or an [Azure DevOps Services repository](/devops/repos/get-started/what-is-repos) as a Catalog. Deployment Environments will scan through the specified folder of the repository to find [Catalog Items](#catalog-items), and make them available for use by all the Projects associated with the dev center.

## Catalog Items

A Catalog Item is a combination of an 'infra-as-code' template (Azure Resource Manager(ARM) template) and a manifest file. The environment definition will be defined in the ARM template and the manifest will be used to provide metadata about the template. The Catalog Items that you provide in the Catalog will be used by your development teams to create environments in Azure.

[Azure Resource Manager(ARM) templates](../azure-resource-manager/templates/overview.md) help you implement the infrastructure as code for your Azure solutions by defining the infrastructure and configuration for your project, the resources to deploy, and the properties of those resources.

[Understand the structure and syntax of Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md) describes the structure of an Azure Resource Manager template, the different sections of a template, and the properties that are available in those sections.

## Next steps

[Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md)