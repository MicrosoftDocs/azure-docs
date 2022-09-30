---
title: What is Azure Deployment Environments?
description: 'Azure Deployment Environments enables developer teams to quickly spin up app infrastructure with project-based templates, minimizing set-up time while maximizing security, compliance, and cost efficiency.'
titleSuffix: Azure Deployment Environments
ms.service: deployment-environments
ms.topic: overview
ms.author: meghaanand
author: anandmeg
ms.date: 10/12/2022
---

# What is Azure Deployment Environments Preview?

Azure Deployment Environments Preview enables your development teams to deploy their own secure, cloud environments on-demand based on IT-approved templates.  This on-demand access to secure environments accelerates the different stages of the software development lifecycle in a compliant and cost-efficient manner.

An Azure Deployment Environment is a pre-configured collection of Azure resources deployed in predefined subscriptions, where Azure governance is applied based on the type of environment, such as sandbox, testing, staging, or production.

:::image type="content" source="./media/overview-what-is-azure-deployment-environments/azure-deployment-environments-scenarios-sml.png" lightbox="./media/overview-what-is-azure-deployment-environments/azure-deployment-environments-scenarios.png" alt-text="Diagram that shows the Azure Deployment Environments scenario flow.":::

With Azure Deployment Environments, your Dev Infra Admin can enforce enterprise security policies through environment templates, which are predefined infrastructure-as-code Azure Resource Manager (ARM) templates. This will enable your developers to quickly and easily spin-up app infrastructure with project-based templates that establish consistency and best practices while maximizing security, compliance, and cost efficiency.

Learn more about the [key concepts for Azure Deployment Environments](./concept-environments-key-concepts.md).

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Usage scenarios

Azure Deployment Environments enables usage [scenarios](./concept-environments-scenarios.md) for both DevOps teams and developers.

Some common use cases:

- Quickly create on-demand Azure environments by using reusable ARM templates.
- Easily provision various types of environments to seamlessly integrate your deployment pipeline.
- Create environments as part of CI/CD workflow, consistent with development teams.
- Create pre-provisioned environments for trainings and demos.

### Developer scenarios

Developers have self-service experience when working with [environments](./concept-environments-key-concepts.md#environments):

>[!NOTE]
> Developers will have a CLI based experience to create and manage Environments for Azure Deployment Environments Preview.

- Deploy a pre-configured environment for any stage of your development cycle.
- Spin up a sandbox environment to explore Azure.
- Create PaaS and IaaS environments quickly and easily by following a few simple steps.
- Deploy an environment easily and quickly right from where you work.

### Dev Infra scenarios

Azure Deployment Environments enable your Dev Infra Admin to ensure that the right set of policies and settings are applied on different types of environments, control the resource configuration that the developers can create, and centrally track environments across different projects by doing the following tasks:  

- Provide project-based curated set of reusable 'infra as code' templates.
- Define specific Azure deployment configurations per project and per environment type.
- Provide self-service experience without giving control over subscription.
- Track cost and compliance with organization IT policies.

Azure Deployment Environments Preview will support two custom roles:

- **Dev center Project Admin**, who can create environments and manage the environment types for a Project.
- **Deployment Environments User**, who can create environments as per appropriate access. 


## Benefits

Azure Deployment Environments provide the following benefits to creating, configuring, and managing environments in the cloud.

- **Standardization and collaboration**:
Capture and share 'infra as code' templates in source control within your team or organization, to easily create on-demand environments. Promote collaboration through inner-sourcing of templates through source control repositories.

- **Compliance and governance**:
Dev Infra Teams can curate environment templates to enforce enterprise security policies and map Projects to Azure subscriptions, identities, and permissions by environment types.

- **Project-based configurations**:
Create and organize environment definitions linked to dev projects, rather than an unorganized list of templates or a traditional IaC setup.

- **Worry-free self-service**:
Enable your development teams to quickly and easily create PaaS resources by using a set of pre-configured templates. You can also track costs on these resources to stay within your budget.

- **Integrate with your existing toolchain**:
Use the API to provision environments directly from your preferred continuous integration (CI) tool, integrated development environment (IDE), or automated release pipeline. You can also use the comprehensive command-line tool.

## Next steps
Start using Azure Deployment Environments:

- Learn about the [key concepts for Azure Deployment Environments](./concept-environments-key-concepts.md).
- [Azure Deployment Environments scenarios](./concept-environments-scenarios.md).
- [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md).
- [Quickstart: Create and configure project](./quickstart-create-and-configure-projects.md).
