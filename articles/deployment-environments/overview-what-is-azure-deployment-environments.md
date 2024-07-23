---
title: What is Azure Deployment Environments?
titleSuffix: Azure Deployment Environments
description: Enable developer teams to spin up infrastructure for deploying apps with templates, adding governance for Azure resource types, security, and cost.
ms.service: deployment-environments
ms.custom: build-2023
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 05/30/2024

#customer intent: As a customer, I want to understand to purpose and capabilities of Azure Deployment Environments so that I can determine if the service will benefit my developers.
---

# What is Azure Deployment Environments?

Azure Deployment Environments empowers development teams to quickly and easily spin up app infrastructure with project-based templates that establish consistency and best practices while maximizing security. This on-demand access to secure environments accelerates the stages of the software development lifecycle in a compliant and cost-efficient way.

A [*deployment environment*](./concept-environments-key-concepts.md#environments) is a collection of Azure infrastructure resources defined in a template called an [*environment definition*](./concept-environments-key-concepts.md#environment-definitions). Developers can deploy infrastructure defined in the templates in subscriptions where they have access, and build their applications on the infrastructure. For example, you can define a deployment environment that includes a web app, a database, and a storage account. Your web developer can begin coding the web app without worrying about the underlying infrastructure.

Platform engineers can create and manage environment definitions. To specify which environment definitions are available to developers, platform engineers can associate environment definitions with projects, and assign permissions to developers. 

Azure Deployment Environments helps platform engineers apply the right set of policies and settings on various types of environments, control the resource configuration that developers can create, and track environments across projects. They can apply Azure governance based on the type of environment, such as sandbox, testing, staging, or production.

The following diagram shows an overview of Azure Deployment Environments capabilities. Platform engineers define infrastructure templates and configure subscriptions, identity, and permissions. Developers create environments based on the templates, and build and deploy applications on the infrastructure. Environments can support different scenarios, like on-demand environments, sandbox environments for testing, and CI/CD pipelines for continuous integration and continuous deployment.

:::image type="content" source="./media/overview-what-is-azure-deployment-environments/azure-deployment-environments-scenarios-sml.png" lightbox="./media/overview-what-is-azure-deployment-environments/azure-deployment-environments-scenarios.png" alt-text="Diagram that shows the Azure Deployment Environments scenario flow.":::

You can [learn more about the key concepts for Azure Deployment Environments](./concept-environments-key-concepts.md).

## Usage scenarios

Common scenarios for Azure Deployment Environments include:

### Environments as part of a CI/CD pipeline

Creating and managing environments across an enterprise can require significant effort. With Azure Deployment Environments, developers can incorporate different types of product lifecycle environments (such as development, testing, staging, preproduction, and production) into a continuous integration and continuous delivery (CI/CD) pipeline.

In this scenario:
- Development teams can connect their environments to CI/CD pipelines to enable DevOps scenarios.
- Central dev IT teams can centrally track costs, track security alerts, and manage environments across projects and dev centers.

### Sandbox environments for investigations

Developers often investigate different technologies or infrastructure designs. By default, all environments created with Azure Deployment Environments are in their own resource group. Project members get contributor access to those resources by default.

In this scenario:
- Developers can add and change Azure resources as they need for their development or test environments.
- Central dev IT teams can easily track costs for all the environments that are used for investigations.

### On-demand test environments
Developers can create ad hoc environments that mimic their formal development or test environments, to test a new capability before checking in the code and executing a pipeline. 

In this scenario:
- Developers can test the latest version of an application by using reusable templates to quickly create new ad hoc environments.

### Training, hands-on labs, and hackathons

A project in Azure Deployment Environments acts as a container for transient activities like workshops, hands-on labs, training, or hackathons. You can create a project to provide custom templates to each user.

In this scenario, Azure Deployment Environments provides the following benefits:
- Each user can create identical and isolated environments for training.
- You can easily delete a project and all related resources when the training is over.

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

- [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md)
- [Quickstart: Create dev center and project (Azure Resource Manager)](./quickstart-create-dev-center-project-azure-resource-manager.md)

