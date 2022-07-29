---
title: What is Azure Deployment Environments?
description: 'Azure Load Testing is a fully managed load-testing service for generating high-scale loads and identifying performance bottlenecks. Quickly create a load test based on a URL or by using existing JMeter scripts.'
ms.service: deployment-environments
ms.topic: overview
ms.author: meghaanand
author: anandmeg
ms.date: 07/29/2022
---

# What is Azure Deployment Environments?

Azure Deployment Environments is an Azure service that enables enterprises to provide development teams with self-service management of environments in Azure, while adhering to enterprise security guidelines. Development teams can create [Environments](./concept-environments-key-concepts.md#environments) from a curated list of Azure Resource Manager(ARM) templates. An environment is a pre-configured collection of Azure resources deployed in predefined subscriptions, where Azure governance is applied based on the [type of environment](./concept-environments-key-concepts.md#environment-types), such as sandbox, testing, staging or production.

Azure Deployment Environments provide self-serve capability to developers enabling them to deploy on-demand environments quickly. Development teams will be able to easily test the latest versions of their applications.

:::image type="content" source="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture.svg" lightbox="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture.svg" alt-text="Diagram that shows the Azure Load Testing architecture.":::

## Usage scenarios

Azure Deployment Environments enables usage [scenarios](./concept-environments-scenarios.md) for both devOps teams and developers.

Some common use cases:

- Quickly create on-demand Azure environments by using reusable ARM templates.
- Easily provision various types of environments to seamlessly integrate your deployment pipeline
- Create pre-provisioned environments for trainings and demos.

### Developer scenarios

Azure Deployment Environments provide the following capabilities to developers working with [environments](./concept-environments-key-concepts.md#environments):

- Choose from a curated list of Azure Resource Manager(ARM) templates, which are configured, and authorized by the team lead or central IT.
- Quickly and easily create PaaS and IaaS environments by following a few simple steps.
- Spin up an empty resource group (sandbox) by using a Resource Manager template to explore Azure.

### DevOps scenarios

Azure Deployment Environments enable central IT to ensure the right set of policies and settings are applied on different types of environments, control the resource configuration that the developers can create, and centrally track environments across different projects by doing the following tasks:  

- Provide a curated set of 'infra as code' templates to use for creating environments.
- Pre-configure which subscriptions the resources will be created based on different types of environment.
- Securely enable developers to self-serve Azure infrastructure without granting access them to a specific subscription.
- Track costs and security alerts per environment.

## Benefits

Azure Deployment Environments provide the following benefits to creating, configuring, and managing environments in the cloud.

## Standardization and collaboration

Capture and share 'infra as code' templates within your team or organization, all in source-control, to easily create on-demand environments. Promote collaboration through inner-sourcing of templates through source control repositories.

## Worry-free self-service

Enable your development teams to quickly and easily create PaaS resources by using a set of pre-configured templates. You can also track costs on these resources to stay within your budget.

## Integrate with your existing toolchain
Use the API to provision environments directly from your preferred continuous integration (CI) tool, integrated development environment (IDE), or automated release pipeline. You can also use the comprehensive command-line tool.

## Next steps
Start using Azure Deployment Environments:

- Learn about the [key concepts for Azure Deployment Environments](./concept-environments-key-concepts.md).
- [Azure Deployment Environments scenarios](./concept-environments-scenarios.md).
- [Tutorial: Create and configure a dev center](./tutorial-create-and-configure-devcenter.md).
- [Tutorial: Create and configure project](./tutorial-create-and-configure-projects.md).
