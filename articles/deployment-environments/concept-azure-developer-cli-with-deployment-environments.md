---
title: 
description: 
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: concept-article
ms.date: 02/24/2024

# Customer intent: As a platform admin, I want to understand what makes an ADE template AZD compatible, so that I can customize my ADE template (environment definitions).

---

# Use Azure Developer CLI templates with Azure Deployment Environments

In this article, you learn how Azure Developer CLI compatible templates differ from ADE environment definitions.

## What is the Azure Developer CLI?

The Azure Developer CLI (`azd`) is an open-source command-line tool that provides developer-friendly commands that map to key stages in your workflow, whether you're working in the terminal, your preferred local development environment (e.g. editor or integrated development environment (IDE)), or CI/CD (continuous integration/continuous deployment) pipelines. You can install `azd` locally on your machine or use it in other environments.

### AZD commands
`azd` is designed to have a minimal number of commands with a small number of parameters for ease of use. Some of the most common azd commands you'll use include:

- azd init - Initialize a new application.
- azd up - Provision Azure resources and deploy your project with a single command.
- azd provision - Provision the Azure resources for an application.
- azd deploy - Deploy the application code to Azure.
- azd pipeline - (Beta) Manage and configure your deployment pipelines.
- azd auth - Authenticate with Azure.
- azd config - Manage azd configurations (e.g. default Azure subscription, location).
- azd down - Delete Azure resources for an application.

## How does `azd` work with ADE?

`azd` works with Azure Deployment Environments (ADE) to enable you to create environments from where you’re working. 

`azd` working with ADE supports the following scenarios:
- Create an environment from code in a local folder
    - This technique works well for individual developers working with unique infrastructure and code that they want to upload to the cloud. 
    - They can use `azd` to provision an environment and to deploy their code.
    - 
- Create an environment from an `azd` compatible template
    - For use at scale, you can create multiple ADE environments from an `azd` compatible template. You can create a new `azd`-compatible template, or you can use an existing environment definition from the Azure Deployment Environments dev center catalog.
    - If you choose to use an existing environment definition, you will need to make a few changes to make it compatible with `azd`.


<!-- intro paragraph & point to: https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/ade-integration -->

## `azd` templates

The Azure Developer CLI commands are designed to work with standardized templates. Each template is a code repository that adheres to specific file and folder conventions. The templates contain the assets `azd` needs to provision an Azure Deployment Environment environment. When you run a command like `azd up`, the tool uses the template assets to execute various workflow steps, such as provisioning or deploying resources to Azure.

All azd templates include the following assets:

```txt
├── .azdo                                        [ Configures an Azure Pipeline ]
├── .devcontainer                                [ For DevContainer ]
├── .github                                      [ Configures a GitHub workflow ]
├── .vscode                                      [ VS Code workspace configurations ]
├── .azure                                       [ Stores Azure configurations and environment variables ]
└── azure.yaml                                   [ Describes the app and type of Azure resources]
```

- infra folder - Not used in azd with ADE - ADE provides the infrastructure as code files for the azd template. You don't need to include these files in your azd template.

- azure.yaml file - A configuration file that defines one or more services in your project and maps them to Azure resources for deployment. For example, you might define an API service and a web front-end service, each with attributes that map them to different Azure resources for deployment.

- .azure folder - Contains essential Azure configurations and environment variables, such as the location to deploy resources or other subscription information.

- src folder - Contains all of the deployable app source code. Some azd templates only provide infrastructure assets and leave the src directory empty for you to add your own application code.
 
Most azd templates also optionally include one or more of the following folders:

- .devcontainer folder - Allows you to set up a Dev Container environment for your application. This is a common development environment approach that is not specific to azd.

- .github folder - Holds the CI/CD workflow files for GitHub Actions, which is the default CI/CD provider for azd.

- .azdo folder - If you decide to use Azure Pipelines for CI/CD, define the workflow configuration files in this folder.

## `azd` compatible catalogs

Azure Deployment Environments catalogs consist of environment definitions: IaC templates that define the infrastructure resources that are provisioned for a deployment environment. Azure Developer CLI uses environment definitions in the catalog attached to the dev center to provision new environments. 

> [!NOTE]
> Currently, Azure Developer CLI works with ARM templates stored in the Azure Deployment Environments dev center catalog.

To properly support certain Azure Compute services, Azure Developer CLI requires more configuration settings in the IaC template. For example, you must tag app service hosts with specific information so that AZD knows how to find the hosts and deploy the app to them.

You can see a list of supported Azure services here: [Supported Azure compute services (host)](/azure/developer/azure-developer-cli/supported-languages-environments).

To get help with AZD compatibility, see [Make your project compatible with Azure Developer CLI](/azure/developer/azure-developer-cli/make-azd-compatible?pivots=azd-create). 

## Make your ADE environment definition compatible with `azd`

<!-- Convert your own app into an azd template - You can also convert an existing app into an azd template by following the Make your project compatible with azd guide. Creating your own template is often more work initially, but allows for the most control and produces a reusable solution for future development work on the app. -->



## Related content

- [Create an environment by using the Azure Developer CLI](./how-to-create-environment-with-azure-developer.md)
- [Make your project compatible with Azure Developer CLI](/azure/developer/azure-developer-cli/make-azd-compatible?pivots=azd-create)
- [Supported Azure compute services (host)](/azure/developer/azure-developer-cli/supported-languages-environments) 