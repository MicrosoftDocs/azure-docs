---
title: Azure Deployment Environments key concepts
description: Learn the key concepts behind Azure Deployment Environments.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.topic: conceptual
ms.author: meghaanand
author: anandmeg
ms.date: 10/12/2022
---

# Key concepts for new Azure Deployment Environments Preview users

Learn about the key concepts and components of Azure Deployment Environments Preview. This knowledge can help you to more effectively deploy environments for your scenarios.

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Dev centers

A dev center is a collection of projects that require similar settings. Dev centers enable dev infrastructure managers to manage the infrastructure-as-code templates made available to the projects using Catalogs, and configure the different types of environments, various development teams can create, using Environment Types.

## Projects

A project is the point of access for the development team members. When you associate a project with a dev center, all the settings at the dev center level will be automatically applied to the project. Each project can be associated with only one dev center. Dev infra admins can configure different types of environments made available for the project by specifying the environment types appropriate for the specific development team.

## Environments

Environment is a collection of Azure resources on which your application is deployed. For example, to deploy a web application, you might create an environment consisting of an [App Service](../app-service/overview.md), [Key Vault](../key-vault/general/basic-concepts.md), [Cosmos DB](../cosmos-db/introduction.md) and a [Storage account](../storage/common/storage-account-overview.md). An environment could consist of both Azure PaaS and IaaS resources such as AKS Cluster, App Service, VMs, databases, etc.

## Identities

[Managed Identities](../active-directory/managed-identities-azure-resources/overview.md) are used in Azure Deployment Environments to provide elevation-of-privilege capabilities. Identities will help provide self-serve capabilities to your development teams without them needing any access to the target subscriptions in which the Azure resources are created. The managed identity attached to the dev center needs to be granted appropriate access to connect to the Catalogs and should be granted 'Owner' access to the target deployment subscriptions configured at the project level. Azure Deployment Environments service will use the specific deployment identity to perform the deployment on behalf of the developer.

## Dev center environment types

You can use environment types to define the type of environments the development teams can create, for example, dev, test, sandbox, pre-production, or production. Azure Deployment Environments provides the flexibility to name the environment types as per the nomenclature used in your enterprise. When you create an environment type, you'll be able to configure and apply different settings for different environment types based on specific needs of the development teams.

## Project environment types 

Project Environment Types are a subset of the environment types configured per dev center and help you pre-configure the different types of environments specific development teams can create. You'll be able to configure the target subscription in which Azure resources are created per project per environment type. Project environment types will allow you to automatically apply the right set of policies on different environments and help abstract the Azure governance related concepts from your development teams. The service also provides the flexibility to pre-configure the [managed identity](concept-environments-key-concepts.md#identities) that will be used to perform the deployment and the access levels the development teams will get after a specific environment is created.

## Catalogs

Catalogs help you provide a set of curated infra-as-code templates for your development teams to create Environments. You can attach either a [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/about-repositories) or an [Azure DevOps Services repository](/azure/devops/repos/get-started/what-is-repos) as a Catalog. Deployment Environments will scan through the specified folder of the repository to find [Catalog Items](#catalog-items), and make them available for use by all the Projects associated with the dev center.

## Catalog Items

A Catalog Item is a combination of an infra-as-code template and a manifest file. The environment definition will be defined in the template and the manifest will be used to provide metadata about the template. The Catalog Items that you provide in the Catalog will be used by your development teams to create environments in Azure.

> [!NOTE]
> During public preview, Azure Deployments Environments uses Azure Resource Manager (ARM) templates.

## Azure Resource Manager (ARM) templates

[Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/overview.md) help you implement the infrastructure as code for your Azure solutions by defining the infrastructure and configuration for your project, the resources to deploy, and the properties of those resources.

[Understand the structure and syntax of Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md) describes the structure of an Azure Resource Manager template, the different sections of a template, and the properties that are available in those sections.

## Next steps

[Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md)
