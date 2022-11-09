---
title: Configure and use Deployment Environments Azure CLI extension
titleSuffix: Azure Deployment Environments
description: Learn how to setup and use Deployment Environments Azure CLI extension to configure the Azure Deployment environments service.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/26/2022
ms.topic: how-to
---

# Configure Azure Deployment Environments service using Azure CLI

This article shows you how to use the Deployment Environments Azure CLI extension to configure an Azure Deployment Environments Preview service. In Azure Deployment Environments Preview, you'll use Deployment Environments Azure CLI extension to create [environments](./concept-environments-key-concepts.md#environments).

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Setup

1. Install the Deployment Environments Azure CLI Extension:
    - [Download and install the Azure CLI](/cli/azure/install-azure-cli).
    - Install the Deployment Environments AZ CLI extension:

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
1. Sign in to Azure CLI.
    ```azurecli
    az login
    ```

1. Set the default subscription to the subscription where you'll be creating your specific Deployment Environment resources.
    ```azurecli
    az account set --subscription {subscriptionId}
    ```

## Commands

**Create a new resource group**

```azurecli
az group create -l <region-name> -n <resource-group-name>
```

Optionally, set defaults (which means there is no need to pass the argument into each command):

```azurecli
az configure --defaults group=<resource-group-name>
```

**Get help for a command**

```azurecli
az devcenter admin <command> --help
```
```azurecli
az devcenter dev <command> --help
```

### Dev centers

**Create a dev center with User Assigned identity**

```azurecli
az devcenter admin devcenter create --identity-type "UserAssigned" --user-assigned-identity
    "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/identityGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testidentity1" --location <location-name> -g <resource-group-name> - <name>
```

**Create a dev center with System Assigned identity**

```azurecli
az devcenter admin devcenter create --location <location-name> -g <resource-group-name> -n <name> \
    --identity-type "SystemAssigned"
```

**List dev centers (in the selected subscription if resource group is not specified or configured in defaults)**

```azurecli
az devcenter admin devcenter list --output table
```

**List dev centers (in the specified resource group)**

```azurecli
az devcenter admin devcenter list -g <resource-group-name>
```

**Get a specific dev center**

```azurecli
az devcenter admin devcenter show -g <resource-group-name> --name <name>
```

**Delete a dev center**

```azurecli
az devcenter admin devcenter delete -g <resource-group-name> --name <name>
```

**Force delete a dev center**

```azurecli
az devcenter admin devcenter delete -g <resource-group-name> --name <name> --yes
```

### Environment Types

**Create an Environment Type**

```azurecli
az devcenter admin environment-type create --dev-center-name <devcenter-name> -g <resource-group-name> --name <name>
```

**List environment types by dev center**

```azurecli
az devcenter admin environment-type list --dev-center-name <devcenter-name> --resource-group <resource-group-name>
```

**List environment types by project**

```azurecli
az devcenter admin environment-type list --project-name <devcenter-name> --resource-group <resource-group-name>
```

**Delete an environment type**

```azurecli
az devcenter admin environment-type delete --dev-center-name <devcenter-name> --name "{environmentTypeName}" \
    --resource-group <resource-group-name>
```

**List environment types by dev center and project for developers**

```azurecli
az devcenter dev environment list --dev-center <devcenter-name> --project-name <project-name>
```

### Project Environment Types

**Create project environment types**

```azurecli
az devcenter admin project-environment-type create --description "Developer/Testing environment" --dev-center-name \
    <devcenter-name> --name "{environmentTypeName}" --resource-group <resource-group-name> \
    --deployment-target-id "/subscriptions/00000000-0000-0000-0000-000000000000" \
    --status Enabled --type SystemAssigned
```

**List project environment types by dev center**

```azurecli
az devcenter admin project-environment-type list --dev-center-name <devcenter-name> \
    --resource-group <resource-group-name>
```

**List project environment types by project**

```azurecli
az devcenter admin project-environment-type list --project-name <project-name> --resource-group <resource-group-name>
```

**Delete project environment types**

```azurecli
az devcenter admin project-environment-type delete --project-name <project-name> \
    --environment-type-name "{environmentTypeName}" --resource-group <resource-group-name>
```

**List allowed project environment types**

```azurecli
az devcenter admin project-allowed-environment-type list --project-name <project-name> \
    --resource-group <resource-group-name>
```

### Catalogs

**Create a catalog with a GitHub repository**

```azurecli
az devcenter admin catalog create --git-hub secret-identifier="https://<key-vault-name>.azure-int.net/secrets/<secret-name>" uri=<git-clone-uri> branch=<git-branch> -g <resource-group-name> --name <name> --dev-center-name <devcenter-name>
```

**Create a catalog with a Azure DevOps repository**

```azurecli
az devcenter admin catalog create --ado-git secret-identifier="https://<key-vault-name>.azure-int.net/secrets/<secret-name>" uri=<git-clone-uri> branch=<git-branch> -g <resource-group-name> --name <name> --dev-center-name <devcenter-name>
```

**Sync a catalog**

```azurecli
az devcenter admin catalog sync  --name <name> --dev-center-name <devcenter-name> -g <resource-group-name>
```

**List catalogs in a dev center**

```azurecli
az devcenter admin catalog list -g <resource-group-name> --dev-center-name <devcenter-name>
```

**Delete a catalog**

```azurecli
az devcenter admin catalog delete -g <resource-group-name> --dev-center-name <devcenter-name> -n <name>
```

### Catalog items

**List catalog items available in a project**

```azurecli
az devcenter dev catalog-item list --dev-center-name <devcenter-name> --project-name <name>
```

### Project

**Create a project**

```azurecli
az devcenter admin project create -g <resource-group-name> -n <project-name> --dev-center-id <devcenter-resource-id>
```

**List projects (in the selected subscription if resource group is not specified or configured in defaults)**

```azurecli
az graph query -q "Resources | where type =~ 'microsoft.devcenter/projects' | project id, name"
```

**List projects (in the specified resource group)**

```azurecli
az devcenter admin project list -g <resource-group-name>
```

**Delete a project**

```azurecli
az devcenter admin project delete -g <resource-group-name> --name <project-name>
```

### Environments

**Create an environment**

```azurecli
az devcenter dev environment create -g <resource-group-name> --dev-center-name <devcenter-name> \
    --project-name <project-name> -n <name> --environment-type <environment-type-name> \
    --catalog-item-name <catalog-item-name> ---catalog-name <catalog-name> \
    --parameters <deployment-parameters-json-string>
```

**Deploy an environment**

```azurecli
az devcenter environment deploy-action --action-id "deploy" --dev-center <devcenter-name> \
    -g <resource-group-name> --project-name <project-name> -n <name> --parameters <parameters-json-string>
```

**List environments in a project**

```azurecli
az devcenter dev environment list --dev-center <devcenter-name> --project-name <project-name>
```

**Delete an environment**

```azurecli
az devcenter environment delete --dev-center <devcenter-name>  --project-name <project-name> -n <name> --user-id "me"
```
