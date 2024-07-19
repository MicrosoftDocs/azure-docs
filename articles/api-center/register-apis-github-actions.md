---
title: Register APIs using GitHub Actions - Azure API Center
description: TBD...
ms.service: api-center
ms.topic: how-to
ms.date: 07/18/2024
ms.author: danlep
author: dlepow
ms.custom: devx-track-azurecli
# Customer intent: As an API developer, I want to automate the registration of APIs in my API center using a CI/CD workflow based on GitHub Actions.
---

# Register APIs in your API center using GitHub Actions

This article shows how to set up a GitHub Actions workflow to register APIs in your organization's [API center](overview.md). [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions) is ...


General configuration steps are similar to those in [Deploy to App Service using GitHub Actions](../app-service/deploy-github-actions).

**Benefits of using GitHub Actions to register APIs in your API center:**
* Save time and reduces manual effort
* Ensures consistency in API registration
* Minimizes risk of errors

GitHub Actions provides:
* Consistent and repeatable workflow for every new API
* Uniform management of all APIs    


<!-- Add Video link? -->

## Scenario overview

In this scenario, you ...
The following diagram shows the steps to register APIs in your API center using GitHub Actions.



:::image type="content" source="media/register-apis-github-actions/scenario-overview.svg" alt-text="Diagram showing a GitHub actions workflow to register API in an Azure API center.":::

<!-- Explain steps here -->

1. Set up a GitHub Actions workflow in your repository.
1. Create a branch from the main branch in your GitHub repository.
1. Commit changes and push them to the new branch.
1. Create a pull request to merge the new branch into the main branch.
1. Merge the pull request.
1. The merge triggers a GitHub Actions workflow that registers the APIs in your API center.


## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* Permissions to create a service principal in the tenant (--check--)
* A GitHub account and a GitHub repo
* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Set up a GitHub Actions workflow




### Set up the Azure login action with a service principal secret

See [steps](../app-service/deploy-github-actions?tabs=openid%2Caspnetcore#1-generate-deployment-credentials) to generate deployment credentials for your repository.


> [!NOTE]
> he recommended way to authenticate with Azure API Center for GitHub Actions is with OpenID Connect. This is an authentication method that uses short-lived tokens. Setting up OpenID Connect with GitHub Actions is more complex but offers hardened security.

For example, create a service principal using the [az ad sp create-for-rbac](/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command:

```azurecli
apiCenter=<api-center-name>
resourceGroup=<resource-group-name>
spName=<service-principal-name>

apicResourceId=$(az apic show --name $apiCenter --resource-group $resourceGroup --query "id" --output tsv)

az ad sp create-for-rbac --name $spName --role Contributor --scopes $apicResourceId --json-auth

```

Copy the JSON output to a secure location. The output should look similar to the following:

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

[!INCLUDE [include](~/../articles/reusable-content/github-actions/create-secrets-service-principal.md)]

### Add the workflow file to your GitHub repository

      # Please create following environment variables to deploy to azure resource: RESOURCE_GROUP, SERVICE_NAME, FILE_LOCATION
      # RESOURCE_GROUP: Azure Resource Group name, please ensure the resource group already created.
      # SERVICE_NAME: Azure API Center resource name, please ensure the API Center resource already created.
      # FILE_LOCATION: API Definition file location
      # https://docs.github.com/en/actions/learn-github-actions/variables#creating-configuration-variables-for-a-repository

```yml


```



## Add API specification to the repository







## Related content

* [Using secrets in a GitHub Actions](https://docs.github.com/en/actions/reference/encrypted-secrets)

<!-- TBD- >