---
title: What is Azure Deployment Environments?
description: 'Azure Deployment Environments is an Azure service that enables developers to deploy on-demand environments using self-service, project-specific templates pre-configured by dev infra teams for any stage of development, to establish consistency and best practices while maximizing security, compliance, and cost efficiency.'
titleSuffix: Azure Deployment Environments
ms.service: deployment-environments
ms.topic: overview
ms.author: meghaanand
author: anandmeg
ms.date: 07/29/2022
---

# What is Azure Deployment Environments?

Azure Deployment Environments is an Azure service that enables enterprises to provide development teams with self-service management of environments in Azure, while adhering to enterprise security guidelines. Development teams can create [Environments](./concept-environments-key-concepts.md#environments) from a curated list of Azure Resource Manager (ARM) templates. An environment is a pre-configured collection of Azure resources deployed in predefined subscriptions, where Azure governance is applied based on the [type of environment](./concept-environments-key-concepts.md#environment-types), such as sandbox, testing, staging or production.

With Azure Deployment Environments, DevOps can quickly and easily spin-up app infrastructure with project-based templates that establish consistency and best practices while maximizing security, compliance, and cost efficiency. 

Azure Deployment Environments provide self-serve capability to developers by enabling them to deploy on-demand environments easily to test the latest versions of their applications. Developments teams can deploy environments from a catalog of project-specific templates pre-configured by their dev infra/IT teams for different stages of development. This helps accelerate the software development lifecycle.

:::image type="content" source="./media/overview-what-is-azure-deployment-environments/azure-deployment-environments-scenarios-sml.png" lightbox="./media/overview-what-is-azure-deployment-environments/azure-deployment-environments-scenarios.png" alt-text="Diagram that shows the Azure Deployment Environments scenario flow.":::

## Usage scenarios

Azure Deployment Environments enables usage [scenarios](./concept-environments-scenarios.md) for both DevOps teams and developers.

Some common use cases:

- Quickly create on-demand Azure environments by using reusable ARM templates.
- Easily provision various types of environments to seamlessly integrate your deployment pipeline
- Create pre-provisioned environments for trainings and demos.

### Developer scenarios

Azure Deployment Environments provide the following capabilities to developers working with [environments](./concept-environments-key-concepts.md#environments):

- Choose from a curated list of Azure Resource Manager (ARM) templates, which are configured, and authorized by the team lead or central IT.
- Quickly and easily create PaaS and IaaS environments by following a few simple steps.
- Spin-up an empty resource group (sandbox) by using a Resource Manager template to explore Azure.
- Deploy a pre-configured environment directly from where you work.

### DevOps scenarios

Azure Deployment Environments enable central IT to ensure the right set of policies and settings are applied on different types of environments, control the resource configuration that the developers can create, and centrally track environments across different projects by doing the following tasks:  

- Provide self-service, project-based curated set of reusable 'infra as code' templates.
- Pre-configure which subscriptions to use based on the environment type when creating resources.
- Securely enable developers to self-serve Azure infrastructure without granting them access to a specific subscription.
- Track costs and security alerts per environment.

## Benefits

Azure Deployment Environments provide the following benefits to creating, configuring, and managing environments in the cloud.

## Standardization and collaboration

Capture and share 'infra as code' templates in source control within your team or organization, to easily create on-demand environments. Promote collaboration through inner-sourcing of templates through source control repositories.

## Worry-free self-service

Enable your development teams to quickly and easily create PaaS resources by using a set of pre-configured templates. You can also track costs on these resources to stay within your budget.

## Integrate with your existing toolchain

Use the API to provision environments directly from your preferred continuous integration (CI) tool, integrated development environment (IDE), or automated release pipeline. You can also use the comprehensive command-line tool.

## Next steps
Start using Azure Deployment Environments:

- Learn about the [key concepts for Azure Deployment Environments](./concept-environments-key-concepts.md).
- [Azure Deployment Environments scenarios](./concept-environments-scenarios.md).
- [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md).
- [Quickstart: Create and configure project](./quickstart-create-and-configure-projects.md).
