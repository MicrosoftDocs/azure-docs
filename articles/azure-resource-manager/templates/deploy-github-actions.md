---
title: Deploy Resource Manager templates by using GitHub Actions
description: Describes how to deploy Azure Resource Manager templates by using GitHub Actions.
ms.topic: conceptual
ms.date: 05/05/2020
---

# Deploy Azure Resource Manager templates by using GitHub Actions

[GitHub Actions](https://help.github.com/en/actions) enables you to create custom software development life-cycle workflows directly in your GitHub repository where your Azure Resource Manager (ARM) templates are stored. A [workflow](https://help.github.com/actions/reference/workflow-syntax-for-github-actions) is defined by a YAML file. Workflows have one or more jobs with each job containing a set of steps that perform individual tasks. Steps can run commands or use an action. You can create your own actions or use actions shared by the [GitHub community](https://github.com/marketplace?type=actions) and customize them as needed. This article shows how to use [Azure CLI Action](https://github.com/marketplace/actions/azure-cli-action) to deploy Resource Manager templates.

Azure CLI Action has two dependent actions:

- **[Checkout](https://github.com/marketplace/actions/checkout)**: Check out your repository so the workflow can access any specified Resource Manager template.
- **[Azure Login](https://github.com/marketplace/actions/azure-login)**: Log in with your Azure credentials

A basic workflow for deploying a Resource Manager template can have three steps:

1. Check out a template file.
2. Sign in to Azure.
3. Deploy a Resource Manager template

## Prerequisites

You need a GitHub repository to store your Resource Manager templates and your workflow files. To create one, see [Creating a new repository](https://help.github.com/en/enterprise/2.14/user/articles/creating-a-new-repository).

## Configure deployment credentials

The Azure login action uses a service principal to authenticate against Azure. The principal of a CI/CD workflow typically needs the built-in contributor right in order to deploy Azure resources.

The following Azure CLI script shows how to generate an Azure Service Principal with Contributor permissions on an Azure resource group. This resource group is where the workflow deploys the resources defined in your Resource Manager template.

```azurecli
$projectName="[EnterAProjectName]"
$location="centralus"
$resourceGroupName="${projectName}rg"
$appName="http://${projectName}"
$scope=$(az group create --name $resourceGroupName --location $location --query 'id')
az ad sp create-for-rbac --name $appName --role Contributor --scopes $scope --sdk-auth
```

Customize the value of **$projectName** and **$location** in the script. The resource group name is the project name with **rg** appended. You need to specify the resource group name in your workflow.

The script outputs a JSON object similar to this:

```json
{
   "clientId": "<GUID>",
   "clientSecret": "<GUID>",
   "subscriptionId": "<GUID>",
   "tenantId": "<GUID>",
   (...)
}
```

Copy the JSON output and store it as a GitHub secret within your GitHub repository. See [Prerequisite](#prerequisites) if you don't have a repository yet.

1. From your GitHub repository, select the **Settings** tab.
1. Select **Secrets** from the left menu.
1. Enter the following values:

    - **Name**: AZURE_CREDENTIALS
    - **Value**: (Paste the JSON output)
1. Select **Add secret**.

You need to specify the secret name in the workflow.

## Add Resource Manager template

Add a Resource Manager template to the GitHub repository. If you don't have one, you can use the following template. The template creates a storage account.

```url
https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
```

You can put the file anywhere in the repository. The workflow sample in the next section assumes the template file is named **azuredeploy.json**, and it is stored in a folder called **templates** at the root of your repository.

## Create workflow

The workflow file must be stored in the **.github/workflow** folder at the root of your repository. The workflow file extension can be either **.yml** or **.yaml**.

You can either create a workflow file and then push/upload the file to the repository, or use the following procedure:

1. From your GitHub repository, select **Actions** from the top menu.
1. Select **New workflow**.
1. Select **set up a workflow yourself**.
1. Rename the workflow file if you prefer a different name other than **main.yml**. For example: **deployStorageAccount.yml**.
1. Replace the content of the yml file with the following:

    ```yml
    name: Deploy ARM Template

    on:
      push:
        branches:
          - master
        paths:
          - ".github/workflows/deployStorageAccount.yml"
          - "templates/azuredeploy.json"

    jobs:
      deploy-storage-account-template:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout source code
            uses: actions/checkout@master

          - name: Login to Azure
            uses: azure/login@v1
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}


          - name: Deploy ARM Template
            uses: azure/CLI@v1
            with:
              inlineScript: |
                az deployment group create --resource-group myResourceGroup --template-file ./templates/azuredeploy.json
    ```

    The workflow file has three sections:

    - **name**: The name of the workflow.
    - **on**: The name of the GitHub events that triggers the workflow. The workflow is trigger when there is a push event on the master branch, which modifies at least one of the two files specified. The two files are the workflow file and the template file.

        > [!IMPORTANT]
        > Verify the two files and their paths match yours.
    - **jobs**: A workflow run is made up of one or more jobs. There is only one job called **deploy-storage-account-template**.  This job has three steps:

        - **Checkout source code**.
        - **Login to Azure**.

            > [!IMPORTANT]
            > Verify the secret name matches to what you saved to your repository. See [Configure deployment credentials](#configure-deployment-credentials).
        - **Deploy ARM template**. Replace the value of **resourceGroupName**.  If you used the Azure CLI script in [Configure deployment credentials](#configure-deployment-credentials), the generated resource group name is the project name with **rg** appended. Verify the value of **templateLocation**.

1. Select **Start commit**.
1. Select **Commit directly to the master branch**.
1. Select **Commit new file** (or **Commit changes**).

Because the workflow is configured to be triggered by either the workflow file or the template file being updated, the workflow starts right after you commit the changes.

## Check workflow status

1. Select the **Actions** tab. You shall see a **Create deployStorageAccount.yml** workflow listed. It takes 1-2 minutes to execute the workflow.
1. Select the workflow to open it.
1. Select **deploy-storage-account-template** (job name) from the left menu. The job name is defined in the workflow.
1. Select **Deploy ARM Template** (step name) to expand it. You can see the REST API response.

## Next steps

For a step-by-step tutorial that guides you through the process of creating a template, see [Tutorial: Create and deploy your first ARM template](template-tutorial-create-first-template.md).
