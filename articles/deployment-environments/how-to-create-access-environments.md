---
title: Create and access an environment by using the Azure CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create and access an environment in an Azure Deployment Environments project by using the Azure CLI.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: devx-track-azurecli, build-2023
ms.topic: how-to
ms.date: 12/07/2023
---

# Create and access an environment by using the Azure CLI

This guide explains how to create and access an [environment](concept-environments-key-concepts.md#environments) in an existing Azure Deployment Environments project by using the Azure CLI.

## Prerequisites

- [Install the Azure CLI extension for Azure Deployment Environments](how-to-install-devcenter-cli-extension.md)
- [Create and configure a dev center by using the Azure CLI](how-to-create-configure-dev-center.md)
- [Create and configure a project by using the Azure CLI](how-to-create-configure-projects.md)

## Create an environment

Creating an environment automatically creates the required resources and a resource group to store them. The resource group name follows the pattern `{projectName}-{environmentName}`. You can view the resource group in the Azure portal.

Complete the following steps in the Azure CLI to create an environment and configure resources. You can view the outputs as defined in the specific Azure Resource Manager template (ARM template).

[!INCLUDE [note-deployment-environments-user](includes/note-deployment-environments-user.md)]

1. Sign in to the Azure CLI:

    ```azurecli
    az login
    ```

1. Install the Azure Dev Center extension for the CLI.

   ```azurecli
   az extension add --name devcenter --upgrade
   ```

1. List all the Azure Deployment Environments projects you have access to:

   ```azurecli
   az graph query -q "Resources | where type =~ 'microsoft.devcenter/projects'" -o table
   ```

1. Configure the default subscription as the subscription that contains the project:

   ```azurecli
   az account set --subscription <subscriptionName>
   ```

1. Configure the default resource group as the resource group that contains the project:

   ```azurecli
   az config set defaults.group=<resourceGroupName>
   ```

1. List the type of environments you can create in a specific project:

   ```azurecli
   az devcenter dev environment-type list --dev-center <devcenterName> --project-name <projectName> -o table
   ```

1. List the [environment definitions](concept-environments-key-concepts.md#environment-definitions) that are available to a specific project:

   ```azurecli
   az devcenter dev environment-definition list --dev-center <devcenterName> --project-name <projectName> -o table
   ```

1. Create an environment by using an *environment-definition* (an infrastructure as code template defined in the [environment.yaml](configure-environment-definition.md#add-a-new-environment-definition) file) from the list of available environment definitions:

   ```azurecli
   az devcenter dev environment create --dev-center-name <devcenterName>
       --project-name <projectName> --environment-name <environmentName> --environment-type <environmentType>
       --environment-definition-name <environmentDefinitionName> --catalog-name <catalogName>
   ```

    If the specific *environment-definition* requires any parameters, use `--parameters` and provide the parameters as a JSON string or a JSON file. For example:

   ```json
   $params = "{ 'name': 'firstMsi', 'location': 'northeurope' }"
   az devcenter dev environment create --dev-center-name <devcenterName>
       --project-name <projectName> --environment-name <environmentName> --environment-type <environmentType>
       --environment-definition-name <environmentDefinitionName> --catalog-name <catalogName>
       --parameters $params
   ```

> [!NOTE]
> You can use `--help` to view more details about any command, accepted arguments, and examples. For example, use `az devcenter dev environment create --help` to view more details about creating an environment.

### Troubleshoot a permissions error

You must have the [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, the [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a [built-in role](../role-based-access-control/built-in-roles.md) that has the required permissions to create an environment.

If you don't have the correct permissions, the environment isn't created. An error message like the following example might appear:

```output
(EnvironmentNotFound) The environment resource was not found.
Code: EnvironmentNotFound
Message: The environment resource was not found.
```

To resolve the issue, assign the correct permissions: [Give access to the development team](quickstart-create-and-configure-devcenter.md#give-access-to-the-development-team).

## Access an environment

To access an environment:

1. List existing environments that are available in a specific project:

   ```azurecli
    az devcenter dev environment list --dev-center <devcenterName> --project-name <projectName>
   ```

1. View the access endpoints to various resources as defined in the ARM template outputs.
1. Access the specific resources by using the endpoints.
 
### Deploy an environment

```azurecli
az devcenter dev environment deploy-action --action-id "deploy" --dev-center-name <devcenterName> \
    -g <resourceGroupName> --project-name <projectName> --environment-name <environmentName> --parameters <parametersJsonString>
```

### Delete an environment

```azurecli
az devcenter dev environment delete --dev-center-name <devcenterName>  --project-name <projectName> --environment-name <environmentName> --user-id "me"
```

## Related content

- [Add and configure a catalog from GitHub or Azure DevOps](how-to-configure-catalog.md)
- [Add and configure an environment definition](configure-environment-definition.md)
