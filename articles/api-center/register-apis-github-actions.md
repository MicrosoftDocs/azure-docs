---
title: Register APIs using GitHub Actions - Azure API Center
description: Learn how to automate the registration of APIs in your API center using a CI/CD workflow based on GitHub Actions.
ms.service: api-center
ms.topic: how-to
ms.date: 07/19/2024
ms.author: danlep
author: dlepow
ms.custom: devx-track-azurecli
# Customer intent: As an API developer, I want to automate the registration of APIs in my API center using a CI/CD workflow based on GitHub Actions.
---

# Register APIs in your API center using GitHub Actions

This article shows how to set up a basic GitHub Actions workflow to register an API in your organization's [API center](overview.md) when an API specification file is added to a GitHub repository. [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions) is a CI/CD platform that automates software workflows, enabling you to build, test, and deploy your code right from GitHub.


General configuration steps are similar to those in [Deploy to App Service using GitHub Actions](../app-service/deploy-github-actions), which provides more detail.

**Benefits of using GitHub Actions to register APIs in your API center:**
* Save time and reduces manual effort
* Ensures consistency in API registration
* Minimizes risk of errors

GitHub Actions provides:
* Consistent and repeatable workflow for every new API
* Uniform management of all APIs    


<!-- Add Video link? -->
## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* Permissions to create a service principal in the tenant
* A GitHub account and a GitHub repo in which you can configure secrets and GitHub Actions workflows
* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Scenario overview

The following diagram shows how API registration in your API center can be automated using GitHub Actions.

:::image type="content" source="media/register-apis-github-actions/scenario-overview.svg" alt-text="Diagram showing a GitHub actions workflow to register API in an Azure API center.":::


1. Set up a GitHub Actions workflow in your repository that triggers when a pull request that adds an API definition file is merged.
1. Create a branch from the main branch in your GitHub repository.
1. Add an API definition file, commit the changes, and push them to the new branch.
1. Create a pull request to merge the new branch into the main branch.
1. Merge the pull request.
1. The merge triggers a GitHub Actions workflow that registers the APIs in your API center.

## Set up a GitHub Actions workflow

In this section, you set up the GitHub Actions workflow for this scenario:

* Create an Azure service principal to use for configuring credentials for the GitHub Actions workflow.
* Add the credentials as a secret in your GitHub repository.
* Configure a GitHub Actions workflow that triggers when a pull request adding an API definition file is merged. The workflow YAML file includes a step that uses the Azure CLI to register the API in your API center from the definition file.


### Set up a service principal secret

In the following steps, create a Microsoft Entra service principal to use for configuring credentials for the GitHub Actions workflow. The service principal is used to authenticate with Azure to register the API.

> [!NOTE]
> Configuring a service principal is shown for demonstration purposes. The recommended way to authenticate with Azure for GitHub Actions is with OpenID Connect, an authentication method that uses short-lived tokens. Setting up OpenID Connect with GitHub Actions is more complex but offers hardened security. See [steps](../app-service/deploy-github-actions?tabs=openid%2Caspnetcore#1-generate-deployment-credentials).

Create a service principal using the [az ad sp create-for-rbac](/cli/azure/ad#az-ad-sp-create-for-rbac) command. The following example first uses the [az apic show](/cli/azure/az/apic#az-apic-show) command to retrieve the resource ID of the API center. The service principal is then created with the Contributor role for the API center.

```bash

```azurecli
apiCenter=<api-center-name>
resourceGroup=<resource-group-name>
spName=<service-principal-name>

apicResourceId=$(az apic show --name $apiCenter --resource-group $resourceGroup --query "id" --output tsv)

az ad sp create-for-rbac --name $spName --role Contributor --scopes $apicResourceId --json-auth

```

Copy the JSON output, which should look similar to the following:

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

In [GitHub](https://github.com/), browse your repository. Select **Settings > Security > Secrets and variables > Actions > New repository secret**.

Paste the entire JSON output from the Azure CLI command into the secret's value field. Name the secret `AZURE_CREDENTIALS`.

When you configure the GitHub workflow file later, you use the secret for the input `creds` of the [Azure/login](https://github.com/marketplace/actions/azure-login). For example:

```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

### Add the workflow file to your GitHub repository

A GitHub Actions workflow is represented by a YAML (.yml) definition file. This definition contains the various steps and parameters that make up the workflow. [Learn more](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

The following is a basic workflow file for this example that you can use or modify. 

In this example:
* the workflow is triggered when a pull request that adds a specified JSON definition is closed on the main branch
* The Azure credentials saved in your repo are used to sign into the Azure CLI
* The [az apic register](/cli/azure/apic/api#az-apic-api-register) command registers the API in the API center specified in the environment variables

To configure the workflow file:

1. Copy and save the file under a name such as `register-api.yml`.
1. Update the values for the environment variables to match your API center in Azure.
1. Update the expected path where you'll add the definition file in the repository.
1. Add this file in the  `/.github/workflows/` path in your GitHub repository.

> [!TIP]
> If you use the [Visual Studio Code extension](use-vscode-extension.md) for Azure API Center, you can create a starting workflow file from the extension which you can then modify for your scenario. In the Command Palette, select **Azure API Center: Register APIs**. Select **CI/CD** > **GitHub**. 

```yml
name: Register API Definition to Azure API Center
on:
  pull_request:
    types: [closed]
    branches:
      - main

permissions:
  id-token: write
  contents: read

env:
  # Set this to your Azure API Center resource group name
  RESOURCE_GROUP: <YOUR_RESOURCE_GROUP>
  # Set this to your Azure API Center service name
  SERVICE_NAME: <YOUR_API_CENTER>
  # Set this to the location of your API definition file
  # Example: ./APIs/catfacts-api/07-15-2024.json
  API_FILE_LOCATION: <YOUR_PATH_TO_API_DEFINITION>

jobs:
  register:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v2
      - name: Azure login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Register to API Center
        uses: azure/CLI@v2
        with:
          azcliversion: latest
          inlineScript: |
            az apic api register -g ${{ env.RESOURCE_GROUP }} -n ${{ env.SERVICE_NAME }} --api-location ${{ env.API_FILE_LOCATION }}
```


## Add API definition file to the repository

Test the workflow by adding an API definition file to the repository. Follow these high-level steps, which are typical of a development workflow. For details on working with GitHub branches, see the [GitHub documentation](https://docs.github.com/en/github/collaborating-with-pull-requests/getting-started/about-collaborative-development-models).

1. Create a new branch from the main branch in your repository.
1. Add the API definition file to the repository at the path specified in the workflow file (for example, `./APIs/catfacts-api/07-15-2024.json`).
1. Commit the changes and push them to the new branch.
1. Create a pull request to merge the new branch into the main branch.
1. After review, merge the pull request. The merge triggers the GitHub Actions workflow that registers the API in your API center.

    :::image type="content" source="media/register-apis-github-actions/workflow-action.png" alt-text="Screenshot showing successful workflow run in GitHub.":::

## Verify the API registration

Verify that the API is registered in your API center.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **Assets**, select **APIs**.
1. The newly registered API should appear in the list of APIs.


:::image type="content" source="media/register-apis-github-actions/api-registered-api-center.png" alt-text="Screenshot of API registered in API Center after workflow."::: 

## Extend the scenario

The following sections provide suggestions for extending the scenario to meet your specific requirements.

## Add a new version to existing API

To add a new API version to an API that's already registered in your API center:

1. Update the workflow file to specify the new API definition file at an existing path in the repository. Example: `./APIs/catfacts-api/07-16-2024.json`.
1. Change to your existing working branch in the repository.
1. Add the new API definition file to the repository at the specified path.
1. Follow typical steps to create a pull request to merge the changes into the main branch, and merge the pull request.
1. The GitHub Actions workflow triggers and registers the new API version in the existing API in your API center. 


## Add metadata to the API registration

You can add metadata for the API registration, defined using the [metadata schema](metadata.md) in your API center. For example




## Related content

* [Using secrets in a GitHub Actions](https://docs.github.com/en/actions/reference/encrypted-secrets)
* [Creating configuration variables for a repository](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
