---
title: Create and access an environment in a project
description: This quickstart shows you how to create and access an environment in an Azure Deployment Environments project.
author: anandmeg
ms.author: meghaanand
ms.service: deployment-environments
ms.custom: ignite-2022
ms.topic: quickstart
ms.date: 10/12/2022
---

# Quickstart: Create and access an environment in a project

This quickstart shows you how to create and access an [environment](concept-environments-key-concepts.md#environments) in an existing Azure Deployment Environments Preview project.

Only a user who has a [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, a [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a [built-in role](../role-based-access-control/built-in-roles.md) that has appropriate permissions can create an environment.

In this quickstart, you learn how to:

> [!div class="checklist"]
>
> - Create an environment
> - Access an environment

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- [Create and configure a dev center](quickstart-create-and-configure-devcenter.md)
- [Create and configure a project](quickstart-create-and-configure-projects.md)
- Install the Deployment Environments Azure CLI extension:

    1. [Download and install the Azure CLI](/cli/azure/install-azure-cli).
    1. Install the Deployment Environments AZ CLI extension:

       **Automated installation**
  
       In PowerShell, run the https://aka.ms/DevCenterEnvironments/Install-DevCenterEnvironmentsCli.ps1 script:

       ```powershell
       iex "& { $(irm https://aka.ms/DevCenterEnvironments/Install-DevCenterEnvironmentsCli.ps1 ) }"
       ```
  
       The script uninstalls any existing dev center extension and installs the latest version.

       **Manual installation**
  
       Run the following command in the Azure CLI:

       ```azurecli
       az extension add --source https://fidalgosetup.blob.core.windows.net/cli-extensions/devcenter-environments-0.1.0-py3-none-any.whl
       ```

## Create an environment

Complete the following steps in the Azure CLI to create an environment and configure resources. You can view the outputs as defined in the specific Azure Resource Manager template (ARM template).

1. Sign in to the Azure CLI:

    ```azurecli
        az login
    ```

1. List all the Azure Deployment Environments projects you have access to:

    ```azurecli
    az graph query -q "Resources | where type =~ 'microsoft.devcenter/projects'" -o table
    ```

1. Configure the default subscription as the subscription that contains the project:

    ```azurecli
    az account set --subscription <name>
    ```

1. Configure the default resource group as the resource group that contains the project:

    ```azurecli
    az config set defaults.group=<name>
    ```  

1. List the type of environments you can create in a specific project:

    ```azurecli
    az devcenter dev environment-type list --dev-center <name> --project-name <name> -o table
    ```

1. List the [catalog items](concept-environments-key-concepts.md#catalog-items) that are available to a specific project:

    ```azurecli
    az devcenter dev catalog-item list --dev-center <name> --project-name <name> -o table
    ```

1. Create an environment by using a *catalog-item* (infrastructure-as-code template) from the list of available catalog items:

    ```azurecli
    az devcenter dev environment create -g <resource-group-name> --dev-center-name <devcenter-name> 
        --project-name <project-name> -n <name> --environment-type <environment-type-name> 
        --catalog-item-name <catalog-item-name> ---catalog-name <catalog-name> 
    ```

    If the specific *catalog-item* requires any parameters, use `--deployment-parameters` and provide the parameters as a JSON string or a JSON file. For example:

    ```json
    $params = "{ 'name': 'firstMsi', 'location': 'northeurope' }"
    az devcenter dev environment create --dev-center-name <devcenter-name> 
        --project-name <project-name> -n <name> --environment-type <environment-type-name> 
        --catalog-item-name <catalog-item-name> ---catalog-name <catalog-name> 
        --parameters $params
    ```

> [!NOTE]
> You can use `--help` to view more details about any command, accepted arguments and examples. For example, use `az devcenter dev environment create --help` to view more details about creating an environment.

## Access an environment

To access an environment:

1. List existing environments that are available in a specific project:

    ```azurecli
    az devcenter dev environment list --dev-center <devcenter-name> --project-name <project-name>
    ```  

1. View the access endpoints to various resources as defined in the ARM template outputs.
1. Access the specific resources by using the endpoints.

## Next steps

- Learn how to [configure a catalog](how-to-configure-catalog.md).
- Learn how to [configure a catalog item](configure-catalog-item.md).
