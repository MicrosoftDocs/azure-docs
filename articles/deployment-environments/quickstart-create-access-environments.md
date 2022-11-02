---
title: Create and access Environments
description: This quickstart shows you how to create and access environments in an Azure Deployment Environments Project.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2022
ms.topic: quickstart
ms.date: 10/26/2022
---

# Quickstart: Create and access Environments

This quickstart shows you how to create and access [environments](concept-environments-key-concepts.md#environments) in an existing Azure Deployment Environments Preview Project. Only users with a [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, a [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a [built-in role](../role-based-access-control/built-in-roles.md) with appropriate permissions can create environments.

In this quickstart, you do the following actions:

* Create an environment
* Access environments in a project

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- [Create and configure a dev center](quickstart-create-and-configure-devcenter.md)
- [Create and configure a project](quickstart-create-and-configure-projects.md)
- Install the Deployment Environments Azure CLI Extension
    1. [Download and install the Azure CLI](/cli/azure/install-azure-cli).
    2. Install the Deployment Environments AZ CLI extension:

    **Automated install**
    Execute the script https://aka.ms/DevCenter/Install-DevCenterCli.ps1 directly in PowerShell to install:
    ```powershell
    iex "& { $(irm https://aka.ms/DevCenter/Install-DevCenterCli.ps1 ) }"
    ```
    
    This will uninstall any existing dev center extension and install the latest version.

    **Manual install**
    
    Run the following command in the Azure CLI:
    ```azurecli
    az extension add --source https://fidalgosetup.blob.core.windows.net/cli-extensions/devcenter-0.1.0-py3-none-any.whl
    ```

>[!NOTE]
> Only users with a [Deployment Environments user](how-to-configure-deployment-environments-user.md) role or a [DevCenter Project Admin](how-to-configure-project-admin.md) role or a built-in role with appropriate permissions will be able to create environments.

## Create an Environment

Run the following steps in Azure CLI to create an Environment and configure resources. You'll be able to view the outputs as defined in the specific Azure Resource Manager (ARM) template.

1. Sign in to Azure CLI.
    ```azurecli
        az login
    ```

1. List all the Deployment Environments projects you have access to.
    ```azurecli
    az graph query -q "Resources | where type =~ 'microsoft.devcenter/projects'" -o table
    ```

1. Configure the default subscription to the subscription containing the project.
    ```azurecli
    az account set --subscription <name>
    ```

1. Configure the default resource group (RG) to the RG containing the project.
    ```azurecli
    az config set defaults.group=<name>
    ```  

1. Once you have set the defaults, list the type of environments you can create in a specific project.
    ```azurecli
    az devcenter dev environment-type list --dev-center <name> --project-name <name> -o table
    ```             

1. List the [Catalog Items](concept-environments-key-concepts.md#catalog-items) available to a specific project.
    ```azurecli
    az devcenter dev catalog-item list --dev-center <name> --project-name <name> -o table
    ```   

1. Create an environment by using a *catalog-item* ('infra-as-code' template defined in the [manifest.yaml](configure-catalog-item.md#add-a-new-catalog-item) file) from the list of available catalog items.
    ```azurecli
    az devcenter dev environment create --dev-center-name <devcenter-name> 
        --project-name <project-name> -n <name> --environment-type <environment-type-name> 
        --catalog-item-name <catalog-item-name> ---catalog-name <catalog-name> 
    ```

    If the specific *catalog-item* requires any parameters use `--parameters` and provide the parameters as a json-string or json-file, for example:  
    ```json
    $params = "{ 'name': 'firstMsi', 'location': 'northeurope' }"
    az devcenter dev environment create --dev-center-name <devcenter-name> 
        --project-name <project-name> -n <name> --environment-type <environment-type-name> 
        --catalog-item-name <catalog-item-name> --catalog-name <catalog-name> 
        --parameters $params
    ```

> [!NOTE]
> You can use `--help` to view more details about any command, accepted arguments, and examples. For example use `az devcenter dev environment create --help` to view more details about Environment creation.

## Access Environments

1. List existing environments in a specific project.
    ```azurecli
    az devcenter dev environment list --dev-center <devcenter-name> --project-name <project-name>
    ```  

1. You can view the access end points to various resources as defined in the ARM template outputs.
1. Access the specific resources using the endpoints.

## Next steps

- [Learn how to configure a catalog](how-to-configure-catalog.md).
- [Learn how to configure a catalog item](configure-catalog-item.md).
