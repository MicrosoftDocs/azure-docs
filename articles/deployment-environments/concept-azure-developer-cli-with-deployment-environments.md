---
title: Use Azure Developer CLI with Azure Deployment Environments
description: Understand ADE and `azd` work together to provision application infrastructure and deploy application code to the new infrastructure.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: concept-article
ms.date: 02/24/2024

# Customer intent: As a platform engineer, I want to understand ADE and `azd` work together to provision application infrastructure and deploy application code to the new infrastructure.

---

# Use Azure Developer CLI with Azure Deployment Environments

In this article, you learn about Azure Developer CLI (`azd`) and how it works with Azure Deployment Environments (ADE) to provision application infrastructure and deploy application code to the new infrastructure.

The Azure Developer CLI (`azd`) is an open-source command-line tool that provides developer-friendly commands that map to key stages in your workflow. You can install `azd` locally on your machine or use it in other environments.

With ADE, you can create environments from an environment definition in a catalog attached to your dev center. By adding `azd`, you can deploy your application code to the new infrastructure.

## How does `azd` work with ADE?

`azd` works with ADE to enable you to create environments from where you’re working. 

With ADE and `azd`, individual developers working with unique infrastructure and code that they want to upload to the cloud can create an environment from a local folder. They can use `azd` to provision an environment and deploy their code seamlessly.

At scale, using ADE and `azd` together enables you to provide a way for developers to create app infrastructure and code. Your team can create multiple ADE environments from the same `azd` compatible environment definition, and provision code to the cloud in a consistent way.

## Understand `azd` templates

The Azure Developer CLI commands are designed to work with standardized templates. Each template is a code repository that adheres to specific file and folder conventions. The templates contain the assets `azd` needs to provision an Azure Deployment Environment environment. When you run a command like `azd up`, the tool uses the template assets to execute various workflow steps, such as provisioning or deploying resources to Azure.

The following is a typical template structure:

```txt
├── infra                                        [ Contains infrastructure as code files ]
├── .azdo                                        [ Configures an Azure Pipeline ]
├── .devcontainer                                [ For DevContainer ]
├── .github                                      [ Configures a GitHub workflow ]
├── .vscode                                      [ VS Code workspace configurations ]
├── .azure                                       [ Stores Azure configurations and environment variables ]
├── src                                          [ Contains all of the deployable app source code ]
└── azure.yaml                                   [ Describes the app and type of Azure resources]
```

All `azd` templates include the following assets:

- *infra folder* - The infra folder is not used in `azd` with ADE. It contains all of the Bicep or Terraform infrastructure as code files for the azd template. ADE provides the infrastructure as code files for the `azd` template. You don't need to include these files in your `azd` template.

- *azure.yaml file* - A configuration file that defines one or more services in your project and maps them to Azure resources for deployment. For example, you might define an API service and a web front-end service, each with attributes that map them to different Azure resources for deployment.

- *.azure folder* - Contains essential Azure configurations and environment variables, such as the location to deploy resources or other subscription information.

- *src folder* - Contains all of the deployable app source code. Some `azd` templates only provide infrastructure assets and leave the src directory empty for you to add your own application code.
 
Most `azd` templates also optionally include one or more of the following folders:

- *.devcontainer folder* - Allows you to set up a Dev Container environment for your application. This is a common development environment approach that isn't specific to azd.

- *.github folder* - Holds the CI/CD workflow files for GitHub Actions, which is the default CI/CD provider for azd.

- *.azdo folder* - If you decide to use Azure Pipelines for CI/CD, define the workflow configuration files in this folder.

## `azd` compatible catalogs

Azure Deployment Environments catalogs consist of environment definitions: IaC templates that define the infrastructure resources that are provisioned for a deployment environment. Azure Developer CLI uses environment definitions in the catalog attached to the dev center to provision new environments. 

> [!NOTE]
> Currently, Azure Developer CLI works with ARM templates stored in the Azure Deployment Environments dev center catalog.

To properly support certain Azure Compute services, Azure Developer CLI requires more configuration settings in the IaC template. For example, you must tag app service hosts with specific information so that `azd` knows how to find the hosts and deploy the app to them.

You can see a list of supported Azure services here: [Supported Azure compute services (host)](/azure/developer/azure-developer-cli/supported-languages-environments#supported-azure-compute-services-host).

## Make your ADE catalog compatible with `azd`

To enable your development teams to us `azd` with ADE, you need to create an environment definition in your catalog that is compatible with `azd`. You can create a new `azd`compatible environment definition, or you can use an existing environment definition from the Azure Deployment Environments dev center catalog. If you choose to use an existing environment definition, you need to make a few changes to make it compatible with `azd`.

Changes include:
- If you're modifying an existing `azd` template, remove the `infra` folder. ADE uses the following files to create the infrastructure:
    - ARM template (azuredeploy.json.)
    - Configuration file that defines parameters (environment.yaml or manifest.yaml)
- Tag resources in *azure.yaml* with specific information so that `azd` knows how to find the hosts and deploy the app to them.
    - Learn about [Tagging resources for Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration?branch=main#tagging-resources-for-azure-deployment-environments).
    - Learn about [Azure Developer CLI's azure.yaml schema](/azure/developer/azure-developer-cli/azd-schema).
- Configure dev center settings like environment variables, `azd` environment configuration, `azd` project configuration, and user configuration.
    - Learn about [Configuring dev center settings](/azure/developer/azure-developer-cli/ade-integration?branch=main#configure-dev-center-settings).

To learn more about how to make your ADE environment definition compatible with `azd`, see [Make your project compatible with Azure Developer CLI](/azure/developer/azure-developer-cli/ade-integration).

## Enable `azd` support in ADE

To enable `azd` support with ADE, you need to set the `platform.type` to devcenter. This configuration allows `azd` to leverage new dev center components for remote environment state and provisioning, and means that  the infra folder in your templates will effectively be ignored. Instead, `azd` will use one of the infrastructure templates defined in your dev center catalog for resource provisioning.

To enable `azd` support, run the following command:
    
   ```bash
    azd config set platform.type devcenter
   ```
### Explore `azd` commands

When the dev center feature is enabled, the default behavior of some common azd commands changes to work with these remote environments. For more information, see [Work with Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration?branch=main#work-with-azure-deployment-evironments).


## Related content

- [Add and configure an environment definition](./configure-environment-definition.md)
- [Create an environment by using the Azure Developer CLI](./how-to-create-environment-with-azure-developer.md)
- [Make your project compatible with Azure Developer CLI](/azure/developer/azure-developer-cli/make-azd-compatible?pivots=azd-create)
