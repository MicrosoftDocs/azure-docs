---
title: Register APIs with GitHub Actions
titleSuffix: Azure API Center
description: Learn how to automate the registration of APIs in your API center by using a CI/CD workflow based on GitHub Actions.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 02/20/2026
ms.author: danlep
author: dlepow
ms.custom: devx-track-azurecli
# Customer intent: As an API developer, I want to automate the registration of APIs in my API center by using a CI/CD workflow based on GitHub Actions.
---

# Register APIs in your API center by using GitHub Actions

This article shows how to set up a basic [GitHub Actions workflow](https://docs.github.com/actions/how-tos/write-workflows) to register an API in your organization's [API center](overview.md). The registration occurs when an API specification file is added to a GitHub repository.

Using a GitHub Actions workflow to register APIs in your API center provides a consistent and repeatable CI/CD process for every new or updated API. The workflow can be extended to include steps such as adding metadata to the API registration.

The following diagram shows how API registration in your API center can be automated with a GitHub Actions workflow.

:::image type="content" source="media/register-apis-github-actions/scenario-overview.svg" border="false" alt-text="Diagram showing steps to trigger a GitHub actions workflow to register an API in an Azure API center." lightbox="media/register-apis-github-actions/scenario-overview.svg":::

The process includes the following steps:

1. Set up a GitHub Actions workflow in your repository that triggers when a pull request that adds an API definition file is merged.
1. Create a branch from the main branch in your GitHub repository.
1. Add an API definition file, commit the changes, and push to the new branch.
1. Create a pull request to merge the new branch into the main branch.
1. Merge the pull request.
1. The merge triggers a GitHub Actions workflow that registers the API in your API center.

> [!NOTE]
> Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Prerequisites

* An API center in your Azure subscription. You can create an API center by following the procedure in [Quickstart: Create your API center (Azure portal)](set-up-api-center.md).

* Permissions to create a service principal in the Microsoft Entra ID tenant.

* A GitHub account and a GitHub repo in which you can configure secrets and GitHub Actions workflows.

* For Azure CLI:

   [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

   [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

## Set up a GitHub Actions workflow

In this section, you set up the GitHub Actions workflow for this scenario:

* Create a service principal to use for Azure credentials in the workflow.
* Add the credentials as a secret in your GitHub repository.
* Configure a GitHub Actions workflow that triggers when a pull request that adds an API definition file is merged. The workflow YAML file includes a step that uses the Azure CLI to register the API in your API center from the definition file.

### Set up a service principal secret

The following steps create a Microsoft Entra ID service principal, which is used to add credentials to the workflow to authenticate with Azure.

> [!NOTE]
> Configuring a service principal is shown for demonstration purposes. The recommended way to authenticate with Azure for GitHub Actions is with OpenID Connect, an authentication method that uses short-lived tokens. Setting up OpenID Connect with GitHub Actions is more complex but offers hardened security. For more information, see [Deploy to Azure App Service by using GitHub Actions - Generate deployment credentials for OpenID Connect](../app-service/deploy-github-actions.md?tabs=openid%2Caspnetcore#generate-deployment-credentials).

Create a service principal by using the [az ad sp create-for-rbac](/cli/azure/ad#az-ad-sp-create-for-rbac) command. The following example first uses the [az apic show](/cli/azure/apic#az-apic-show) command to retrieve the resource ID of the API center. The service principal is then created with the Azure API Center Service Contributor role for the API center.

#### [Bash](#tab/bash)

```azurecli
#! /bin/bash
apiCenter=<api-center-name>
resourceGroup=<resource-group-name>
spName=<service-principal-name>

apicResourceId=$(az apic show --name $apiCenter --resource-group $resourceGroup --query "id" --output tsv)

az ad sp create-for-rbac --name $spName --role "Azure API Center Service Contributor" --scopes $apicResourceId --json-auth
```

#### [PowerShell](#tab/powershell)

```azurecli
# PowerShell syntax
$apiCenter = "<api-center-name>"
$resourceGroup = "<resource-group-name>"
$spName = "<service-principal-name>"

$apicResourceId = $(az apic show --name $apiCenter --resource-group $resourceGroup --query "id" --output tsv)

az ad sp create-for-rbac --name $spName --role "Azure API Center Service Contributor" --scopes $apicResourceId --json-auth
```
---

Copy the JSON output, which should look similar to the following example:

```json
{
  "clientId": "<GUID>",
  "clientSecret": "<GUID>",
  "subscriptionId": "<GUID>",
  "tenantId": "<GUID>",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  [...other endpoints...]
}
```

### Add the service principal as a GitHub secret

After you have the service principal, add it as a GitHub secret:

1. In [GitHub](https://github.com/), browse your repository, and select **Settings** in the top menu bar.

1. In the left navigation under **Security**, select **Secrets and variables** > **Actions** 

1. Select **New repository secret**.

1. In the **Secret** field, paste the entire JSON output from the Azure CLI command. For the **Name**, enter `AZURE_CREDENTIALS`. Select **Add secret**.

   The secret is listed under **Repository secrets**.

   :::image type="content" source="media/register-apis-github-actions/repository-secrets-github.png" alt-text="Screenshot of secrets for Actions in a GitHub repository.":::

When you configure the GitHub workflow file later, you use the secret for the input `creds` of the [Azure/login](https://github.com/marketplace/actions/azure-login) action. For example:

```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

### Add the workflow file to your GitHub repository

A GitHub Actions workflow is specified in a YAML (_.yml_) definition file. This definition contains the various steps and parameters that make up the workflow. For more information, see [Workflow syntax for GitHub Actions](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax).

The following example provides a basic workflow file that you can use or modify.

* The workflow triggers when a pull request that adds a JSON definition in the `APIs` path is closed on the main branch.

* The location of the definition is extracted from the pull request by using a GitHub script, which is authenticated with the default GitHub token.

* The Azure credentials saved in your repository are used to sign into Azure.

* The [az apic register](/cli/azure/apic/api#az-apic-api-register) command registers the API in the API center specified in the environment variables.

Follow these steps to configure the workflow file:

1. Copy and save the file under a name such as `register-api.yml`.

1. Confirm or update the name of the repository folder (`APIs`) where you plan to add the API definition file.

1. Add this workflow file in the `/.github/workflows/` path in your GitHub repository.

1. Set the [Actions variables](https://docs.github.com/actions/how-tos/write-workflows/choose-what-workflows-do/use-variables) `SERVICE_NAME` and `RESOURCE_GROUP` in your repository for your API center name and resource group name in Azure.

> [!TIP]
> Using the [Visual Studio Code extension](build-register-apis-vscode-extension.md) for Azure API Center, you can generate a starting workflow file by running an extension command. In the Command Palette (**Ctrl**+**Shift**+**P**), enter **Azure API Center: Register API** and select **CI/CD** > **GitHub**. You can then modify or extend the file for your scenario.

Here's the example workflow file:

```yml
name: Register API Definition to Azure API Center
on:
  pull_request:
    types: [ closed ]
    branches:
      - [ "main" ]
    paths:
      - "APIs/**/*.json"
permissions:
  contents: read
  pull-requests: read
jobs:
  register:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v2
      
      - name: Get specification file path in the PR
        id: get-file-location
        uses: actions/github-script@v5
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const pull_number = context.payload.pull_request.number;
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const files = await github.rest.pulls.listFiles({
              owner,
              repo,
              pull_number
            });
            if (files.data.length === 1) {
              const filename = files.data[0].filename;
              core.exportVariable('API_FILE_LOCATION', filename);
              console.log(`API_FILE_LOCATION: ${{ env.API_FILE_LOCATION }}`);
            }
            else {
              console.log('The PR does not add exactly one specification file.');
            }

      - name: Azure login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Register to API Center
        uses: azure/CLI@v2
        with:
          azcliversion: latest
          inlineScript: |
            az apic api register -g ${{ vars.RESOURCE_GROUP }} -n ${{ vars.SERVICE_NAME }} --api-location ${{ env.API_FILE_LOCATION }}
```

## Add API definition file to the repository

Test the workflow by adding an API definition file to the repository. Follow these high-level steps, which are typical of a development workflow. For details on working with GitHub branches, see [About collaborative development models](https://docs.github.com/pull-requests/collaborating-with-pull-requests/getting-started/about-collaborative-development-models) in the GitHub documentation.

1. Create a new working branch from the main branch in your repository.

1. Add the API definition file to the repository in the `APIs` path. For example, `APIs/catfacts-api/07-15-2024.json`.

1. Commit the changes and push them to the working branch.

1. Create a pull request to merge the working branch into the main branch.

1. After review, merge the pull request. The merge triggers the GitHub Actions workflow that registers the API in your API center.

   :::image type="content" source="media/register-apis-github-actions/workflow-action.png" alt-text="Screenshot showing successful workflow run in GitHub.":::

## Verify the API registration

Verify that the API is registered in your API center.

1. In the [Azure portal](https://portal.azure.com), browse to your API center.

1. In the left navigation, expand the **Inventory** section, and select **Assets**.

1. Verify that the newly registered API appears in the list.

:::image type="content" source="media/register-apis-github-actions/api-registered-api-center.png" alt-text="Screenshot of a new API registered in API Center after the workflow runs."::: 

## Add a new API version

You can add a new version to an existing API in your API center by following the same steps with a slight modification.

1. Change to the same working branch in your repo, or create a new working branch.

1. Add a new API definition file to the repository in the `APIs` path, in the folder for an existing API. For example, if you previously added a Cat Facts API definition, add a new version such as `APIs/catfacts-api/07-22-2024.json`.

1. Commit the changes and push them to the working branch.

1. Create a pull request to merge the working branch into the main branch.

1. After review, merge the pull request. The merge triggers the GitHub Actions workflow that registers the new API version in your API center.

1. In the Azure portal, browse to your API center and confirm that the new version for the API is registered.

## Extend the scenario

You can extend the GitHub Actions workflow to include other steps, such as adding metadata for the API registration. For example:

1. Using the [metadata schema](metadata.md) in your API center, create a metadata JSON file to apply metadata values to your API registration. 

   For example, if the metadata schema includes properties such as `approver`, `team`, and `cost center`, a metadata JSON file might look like this:

   ```json
   {
     "approver": "admin-user@contoso.com",
     "team": "Store API dev team",
     "costCenter": "12345"  
   }
   ```

1. Upload a metadata JSON file in the folder for each API in the repository. 

1. Add a workflow step to apply the metadata to the API registration by using the [az apic api update](/cli/azure/apic/api#az-apic-api-update) command. In the following example, the API ID and metadata file are passed in environment variables, which would be set elsewhere in the workflow file.

   ```yml
   [...]
   - name: Apply metadata to API in API Center
        uses: azure/CLI@v2
        with:
          azcliversion: latest
          inlineScript: |
            az apic api update -g ${{ vars.RESOURCE_GROUP }} -n ${{ vars.SERVICE_NAME }} --api-id {{ env.API_ID }} --custom-properties {{ env.METADATA_FILE }}
   ```

## Related content

* [Secrets in GitHub Actions](https://docs.github.com/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
* [Workflow syntax for GitHub Actions](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax)
