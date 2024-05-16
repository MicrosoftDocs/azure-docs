---
title: What is Azure Deployment Environments?
titleSuffix: Azure Deployment Environments
description: Enable developer teams to spin up infrastructure for deploying apps with templates, adding governance for Azure resource types, security, and cost.
ms.service: deployment-environments
ms.custom: build-2023
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/28/2024

#customer intent: As a customer, I want to understand to purpose and capabilities of Azure Deployment Environments so that I can determine if the service will benefit my developers.
---

# What is Azure Deployment Environments?

Azure Deployment Environments empowers development teams to quickly and easily spin up app infrastructure with project-based templates that establish consistency and best practices while maximizing security. This on-demand access to secure environments accelerates the stages of the software development lifecycle in a compliant and cost-efficient way.

A [*deployment environment*](./concept-environments-key-concepts.md#environments) is a collection of Azure infrastructure resources defined in a template called an [*environment definition*](./concept-environments-key-concepts.md#environment-definitions). Developers can deploy infrastructure defined in the templates in subscriptions where they have access, and build their applications on the infrastructure. For example, you can define a deployment environment that includes a web app, a database, and a storage account. Your web developer can begin coding the web app without worrying about the underlying infrastructure.

Platform engineers can create and manage environment definitions. To specify which environment definitions are available to developers, platform engineers can associate environment definitions with projects, and assign permissions to developers. They can also apply Azure governance based on the type of environment, such as sandbox, testing, staging, or production.

The following diagram shows an overview of Azure Deployment Environments capabilities. Platform engineers define infrastructure templates and configure subscriptions, identity, and permissions. Developers create environments based on the templates, and build and deploy applications on the infrastructure. Environments can support different scenarios, like on-demand environments, sandbox environments for testing, and CI/CD pipelines for continuous integration and continuous deployment.

:::image type="content" source="./media/overview-what-is-azure-deployment-environments/azure-deployment-environments-scenarios-sml.png" lightbox="./media/overview-what-is-azure-deployment-environments/azure-deployment-environments-scenarios.png" alt-text="Diagram that shows the Azure Deployment Environments scenario flow.":::

You can [learn more about the key concepts for Azure Deployment Environments](./concept-environments-key-concepts.md).

## Usage scenarios

Common [scenarios](./concept-environments-scenarios.md) for Azure Deployment Environments include:

### Platform engineering scenarios

Azure Deployment Environments helps platform engineers apply the right set of policies and settings on various types of environments, control the resource configuration that developers can create, and track environments across projects. They perform the following tasks:  

- Provide a project-based, curated set of reusable IaC templates.
- Define specific Azure deployment configurations per project and per environment type.
- Provide a self-service experience without giving control over subscriptions.
- Track costs and ensure compliance with enterprise governance policies.

### Developer scenarios

Developers can create environments whenever they need them, and develop their applications on the infrastructure. They can use Azure Deployment Environments to do the following tasks:

- Deploy a preconfigured environment for any stage of the development cycle.
- Spin up a sandbox environment to explore Azure.
- Create and manage environments through the [developer portal](./quickstart-create-access-environments.md), with the [Azure CLI](./how-to-create-access-environments.md) or with the [Azure Developer CLI](./how-to-create-environment-with-azure-developer.md).

## Benefits

Azure Deployment Environments provides the following benefits to creating, configuring, and managing environments in the cloud:

- **Standardization and collaboration**:
Capture and share IaC templates in source control within your team or organization, to easily create on-demand environments. Promote collaboration through inner-sourcing of templates from source control repositories.

- **Compliance and governance**:
Platform engineering teams can curate environment definitions to enforce enterprise security policies and map projects to Azure subscriptions, identities, and permissions by environment types.

- **Project-based configurations**:
Organize environment definitions by the type of application that development teams are working on, rather than using an unorganized list of templates or a traditional IaC setup.

- **Worry-free self-service**:
Enable your development teams to quickly and easily create app infrastructure (PaaS, serverless, and more) resources by using a set of preconfigured templates. You can also track costs on these resources to stay within your budget.

- **Integration with your existing toolchain**:
Use APIs to provision environments directly from your preferred CI tool, integrated development environment (IDE), or automated release pipeline. You can also use the comprehensive command-line tool.

## Components shared with Microsoft Dev Box

[Microsoft Dev Box](../dev-box/overview-what-is-microsoft-dev-box.md) and Azure Deployment Environments are complementary services that share certain architectural components. Dev Box provides developers with a cloud-based development workstation, called a dev box, which is configured with the tools they need for their work. Dev centers and projects are common to both services, and they help organize resources in an enterprise.

When configuring Deployment Environments, you might see Dev Box resources and components. You might even see informational messages regarding Dev Box features. If you're not configuring any Dev Box features, you can safely ignore these messages.

## Related content

- [Azure Deployment Environments scenarios](./concept-environments-scenarios.md)
- [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md)
- [Quickstart: Create dev center and project (Azure Resource Manager)](./quickstart-create-dev-center-project-azure-resource-manager.md)

