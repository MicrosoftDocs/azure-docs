---
title: "Tutorial: Publish Azure Static Web Apps using an ARM Template"
description: Create and deploy an ARM Template for Static Web Apps
services: static-web-apps
author: petender
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 04/18/2021
ms.author: petender

---

# Tutorial: Publish Azure Static Web Apps using an ARM Template

This article demonstrates how to deploy [Azure Static Web Apps](./overview.md) using an [ARM Template](../azure-resource-manager/templates/overview.md).

In this tutorial, you learn to:

> [!div class="checklist"]
> - Create an ARM Template for Azure Static Web Apps
> - Deploy the ARM Template to create an Azure Static Web App instance

## Prerequisites

- **Active Azure account:** If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- **GitHub Account:** If you don't have one, you can [create a GitHub Account for free](https://github.com) 
- **Github Personal Access Token (PAT):** Used by Static Web Apps to interact with a GitHub repo and GitHub Actions pipeline for publishing your static site content. More details on [GitHub PAT](https://docs.github.com/github/authenticating-to-github/creating-a-personal-access-token).
- **Editor for ARM Templates:** Reviewing and editing templates requires a JSON editor. Visual Studio Code with the Resource Manager Tools extension is well suited for editing ARM Templates. For instructions on how to install and configure Visual Studio Code, see [Quickstart: Create ARM templates with Visual Studio Code](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md).


## Create a GitHub personal access token

One of the required parameters in the ARM template is `repositoryToken`, which allows the ARM deployment process to interact with the GitHub repo holding the static site source code. 

1. From your GitHub Account Profile (in the upper right corner), select **Settings**.

1. Select **Developer Settings**.

1. Select **Personal Access Tokens**.

1. Select **Generate New Token**.

1. Provide a name for this token in the _Note_ field, for example *myfirstswadeployment*.

1. Specify the following *scopes*: **repo, workflow, write:packages**

1. As your token is created the details are shown on screen.

> [!IMPORTANT]
> Make sure you copy this token and store it somewhere safe. Consider storing this token in [Azure KeyVault](../azure-resource-manager/templates/template-tutorial-use-key-vault.md) and access it in your ARM Template. 
## Create a GitHub Repo for your static content
Follow these steps to create a new GitHub Repo with a sample "index.html" Static Web App

1. Log on to [Github](https://github.com) using your GitHub account credentials

1. **Create a new Repository** with a name "myfirstswadeployment"

1. Define your GitHub repo as **Public**

1. **Select** to add a Readme file

1. Once the repo is created, click **Add File** / **Create New file**

1. Provide **index.html** as file name

1. Copy the following snippet of code in the **Edit new file** pane

```html
<!doctype html>
<html>
  <head>
    <title>This is the title of the webpage!</title>
  </head>
  <body>
    <p>This is an example paragraph. Anything in the <strong>body</strong> tag will appear on the page, just like this <strong>p</strong> tag and its contents.</p>
  </body>
</html>
```
1. Scroll down and **Click Commit New File** to save the file and its content to the repo.

## Create the sample ARM Template for Static Web Apps
Now all the prerequisites are in place, let's move over to the actual ARM deployment template file. 

Following the best practices of ARM deployments, you will create 

- an **azuredeploy.json** main template file, 
- and an **azuredeploy.parameters.json** to hold the specific parameters for the deployment

1. Create a new folder on your local machine to save the ARM Templates to.

1. Copy this sample ARM template snippet into a **new file on your local machine**, named **"azuredeploy.json"**

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "type": "string"
        },
        "location": {
            "type": "string"
        },
        "sku": {
            "type": "string"
        },
        "skucode": {
            "type": "string"
        },
        "repositoryUrl": {
            "type": "string"
        },
        "branch": {
            "type": "string"
        },
        "repositoryToken": {
            "type": "securestring"
        },
        "appLocation": {
            "type": "string"
        },
        "apiLocation": {
            "type": "string"
        },
        "appArtifactLocation": {
            "type": "string"
        },
        "resourceTags": {
            "type": "object"
        }
    },
    "resources": [
        {
            "apiVersion": "2019-12-01-preview",
            "name": "[parameters('name')]",
            "type": "Microsoft.Web/staticSites",
            "location": "[parameters('location')]",
            "tags": "[parameters('resourceTags')]",
            "properties": {
                "repositoryUrl": "[parameters('repositoryUrl')]",
                "branch": "[parameters('branch')]",
                "repositoryToken": "[parameters('repositoryToken')]",
                "buildProperties": {
                    "appLocation": "[parameters('appLocation')]",
                    "apiLocation": "[parameters('apiLocation')]",
                    "appArtifactLocation": "[parameters('appArtifactLocation')]"
                }
            },
            "sku": {
                "Tier": "[parameters('sku')]",
                "Name": "[parameters('skuCode')]"
            }
        }
    ]
}
```

1. Copy this sample ARM parameter template snippet into a **new file on your local machine**, named **"azuredeploy.parameters.json"**. Save it in the same folder as the previous ARM template file.

1. Update the following parameters:

- **repositoryUrl**: provide the URL to your Static Web Apps GitHub repo
- **repositoryToken**: provide the GitHub PAT token 


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "value": "myfirstswadeployment"
        },
        "location": {
          "type": "string",
          "defaultValue": "Central US"
        },   
        "sku": {
            "value": "Free"
        },
        "skucode": {
            "value": "Free"
        },
        "repositoryUrl": {
            "value": "https://github.com/<updatewithyourgithubname>/<updatewithyourreponame>"
        },
        "branch": {
            "value": "main"
        },
        "repositoryToken": {
            "value": "<updatewithyourGitHubPAT>" 
        },
        "appLocation": {
            "value": "/"
        },
        "apiLocation": {
            "value": ""
        },
        "appArtifactLocation": {
            "value": "public"
        },
        "resourceTags": {
            "value": {
                "Environment": "Development",
                "Project": "Testing SWA with ARM",
                "ApplicationName": "myfirstswadeployment"
            }
        }
    }
}
```

1. Make sure you save the updates before running the deployment in the next step.

## Running the deployment

You need either Azure PowerShell or Azure CLI to deploy the template. For the installation instructions, see:

- [Install Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps)
- [Install Azure CLI on Windows OS](https://docs.microsoft.com/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux OS](https://docs.microsoft.com/cli/azure/install-azure-cli-linux)
- [Install Azure CLI on MacOS](https://docs.microsoft.com/cli/azure/install-azure-cli-macos)

### Sign in to Azure

To start working with Azure PowerShell/Azure CLI to deploy a template, sign in with your Azure credentials.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

---

If you have multiple Azure subscriptions, select the subscription you want to use. Replace `<SUBSCRIPTION-ID-OR-SUBSCRIPTION-NAME>` with your subscription information:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzContext <SUBSCRIPTION-ID-OR-SUBSCRIPTION-NAME>
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az account set --subscription <SUBSCRIPTION-ID-OR-SUBSCRIPTION-NAME>
```

---

## Create a resource group

When you deploy a template, you specify a resource group that will contain the resources. Before running the deployment command, create the resource group with either Azure CLI or Azure PowerShell. Select the tabs in the following code section to choose between Azure PowerShell and Azure CLI. The CLI examples in this article are written for the Bash shell.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$resourceGroupName = "myfirstswadeployRG"

New-AzResourceGroup `
  -Name $resourceGroupName `
  -Location "Central US"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
resourceGroupName="myfirstswadeployRG"

az group create \
  --name $resourceGroupName \
  --location "Central US"
```

---

## Deploy template

Use one of these deployment options to deploy the template.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$templateFile = Read-Host -Prompt "Enter the template file path and file name"
$templateparameterFile = Read-Host -Prompt "Enter the template parameter file path and file name"

New-AzResourceGroupDeployment `
  -Name DeployLocalTemplate `
  -ResourceGroupName $resourceGroupName `
  -TemplateFile $templateFile `
  -TemplateParameterFile $templateparameterfile `
  -verbose
```

To learn more about deploying templates using Azure PowerShell, see [Deploy resources with ARM templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md).

# [Azure CLI](#tab/azure-cli)

```azurecli

az deployment group create \
  --name DeployLocalTemplate \
  --resource-group $resourceGroupName \
  --template-file <PATH-TO-AZUREDEPLOY.JSON> \
  --parameters <PATH-TO-AZUREDEPLOY.PARAMETERS.JSON> \
  --verbose
```

To learn more about deploying templates using the Azure CLI, see [Deploy resources with ARM templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

---

## Clean up resources

Clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

> [!div class="nextstepaction"]
> [Configure your static web app](./configuration.md)
