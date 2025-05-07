---
title: Key concepts and roles
titleSuffix: Azure Deployment Environments
description: Learn the key concepts, role definitions, features, and terminology for Azure Deployment Environments.
ms.service: azure-deployment-environments
ms.custom: build-2023
ms.topic: concept-article
ms.author: rosemalcolm
author: RoseHJM
ms.date: 05/30/2024

#customer intent: As a platform engineer, I want to understand the key concepts and roles in Azure Deployment Environments so that I can effectively deploy environments for my scenarios.
---

# Key concepts for Azure Deployment Environments

In this article, you learn about the key concepts and components of Azure Deployment Environments. This knowledge helps you more effectively deploy environments for your scenarios.

As you learn about Deployment Environments, you might encounter components of [Microsoft Dev Box](../dev-box/overview-what-is-microsoft-dev-box.md), a complementary service that shares certain architectural components. Dev Box provides developers with a cloud-based development workstation, called a dev box, which is configured with the tools they need for their work.  

This diagram shows the key components of Deployment Environments and how they relate to each other. You can learn more about each component in the following sections.

:::image type="content" source="media/concept-environments-key-concepts/deployment-environments-architecture-new.png" alt-text="Diagram showing the key components of Deployment Environments.":::

## Dev centers

A dev center is a collection of [Projects](#projects) that require similar settings. Dev centers enable platform engineers to:

- Use catalogs to manage infrastructure as code (IaC) templates that are available to the projects.
- Use environment types to configure the types of environments that development teams can create.
 
[Microsoft Dev Box](../dev-box/concept-dev-box-concepts.md#dev-center) also uses dev centers to organize resources. An organization can use the same dev center for both services.

## Projects

In Deployment Environments, a project represents a team or business function within the organization. When you associate a project with a dev center, all the settings for the dev center are automatically applied to the project. 

Each project can be associated with only one dev center. Platform engineers can configure environments for a project by specifying which environment types are appropriate for the development team. To make environment definitions available for a specific development team, Project Admins can attach a catalog to a project.

To enable developers to create their own deployment environments, you must [provide access for developers to projects](how-to-configure-deployment-environments-user.md) by assigning the Deployment Environments User role.

You can configure projects for Deployment Environments and projects for [Microsoft Dev Box](../dev-box/concept-dev-box-concepts.md#project) resources in the same dev center.

## Environments

An environment is a collection of Azure resources on which your application is deployed. For example, to deploy a web application, you might create an environment that consists of [Azure App Service](../app-service/overview.md), [Azure Key Vault](/azure/key-vault/general/basic-concepts), [Azure Cosmos DB](/azure/cosmos-db/introduction), and a [storage account](../storage/common/storage-account-overview.md). An environment could consist of both Azure platform as a service (PaaS) and infrastructure as a service (IaaS) resources such as an Azure Kubernetes Service (AKS) cluster, virtual machines, and databases.

## Identities

In Azure Deployment Environments, you use [managed identities](../active-directory/managed-identities-azure-resources/overview.md) to provide elevation-of-privilege capabilities. Identities can help you provide self-serve capabilities to your development teams without giving them access to the target subscriptions in which the Azure resources are created. 

The managed identity attached to the dev center or project needs to be granted appropriate access to connect to the catalogs. You should grant Contributor and User Access Administrator access to the target deployment subscriptions that are configured at the project level. The Azure Deployment Environments service uses the specific managed identity to perform the deployment on behalf of the developer.

## Dev center environment types

You can define the types of environments that development teams can create: for example, dev, test, sandbox, preproduction, or production. Azure Deployment Environments provides the flexibility to name the environment types according to the nomenclature that your enterprise uses. You can configure settings for various environment types based on the specific needs of the development teams.

## Project environment types 

Project environment types are a subset of the environment types that you configure for the dev center. They help you preconfigure the types of environments that specific development teams can create. You can configure the target subscription in which Azure resources are created per project and per environment type. 

Project environment types allow you to automatically apply the right set of policies on environments and help abstract the Azure governance-related concepts from your development teams. The service also provides the flexibility to preconfigure:

- The [managed identity](concept-environments-key-concepts.md#identities) that is used to perform the deployment.
- The access levels that the development teams will get after a specific environment is created.

## Catalogs

Catalogs help you provide a set of curated IaC templates for your development teams to create environments. You can attach a catalog to a dev center make environment definitions available to all the projects associated with the dev center. You can also attach a catalog to a project to provide environment definitions to that specific project.

Microsoft provides a [*quick start* catalog](https://github.com/microsoft/devcenter-catalog) that contains a set of sample environment definitions. You can attach the quick start catalog to a dev center or project to make these environment definitions available to developers. You can modify the sample environment definitions to suit your needs. 

Alternately, you can attach your own catalog. You can attach either a [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/about-repositories) or an [Azure DevOps Services repository](/azure/devops/repos/get-started/what-is-repos) as a catalog. 

Deployment environments scan the specified folder of the repository to find [environment definitions](#environment-definitions). Those environment definitions are available to all the projects associated with the dev center.

## Environment definitions

An environment definition is a combination of an IaC template and an environment file that acts as a manifest. The template defines the environment, and the environment file provides metadata about the template. Your development teams use the items that you provide in the catalog to create environments in Azure.

## Built-in roles

Azure Deployment Environments supports three [built-in roles](../role-based-access-control/built-in-roles.md):

- **Dev Center Project Admin**: Creates environments and manages the environment types for a project.
- **Deployment Environments User**: Creates environments based on appropriate access.
- **Deployment Environments Reader**: Reads environments that other users created. 

## Resources shared with Microsoft Dev Box

Azure Deployment Environments and Microsoft Dev Box are complementary services that share certain architectural components. Dev centers and projects are common to both services, and they help organize resources in an enterprise. You can configure projects for Deployment Environments and projects for Dev Box resources in the same dev center. 

To learn more about the components common to Deployment Environments and Dev Box, see [Components common to Microsoft Dev Box and Azure Deployment Environments](/azure/dev-box/concept-common-components).

## Related content

- [What is Azure Deployment Environments?](overview-what-is-azure-deployment-environments.md)
- [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md)
- [What is Microsoft Dev Box?](../dev-box/overview-what-is-microsoft-dev-box.md)
