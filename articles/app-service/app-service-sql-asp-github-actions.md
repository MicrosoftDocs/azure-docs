---
title: "Tutorial: Use GitHub Actions to deploy to App Service and connect to a database"
description: Deploy a database-backed ASP.NET core app to Azure with GitHub Actions
ms.devlang: csharp
ms.topic: tutorial
ms.date: 09/13/2021
ms.author: jukullam
ms.custom: github-actions-azure
---

# Tutorial: Use GitHub Actions to deploy to App Service and connect to a database

Learn how to set up a GitHub Actions workflow to deploy a ASP.NET Core application with an [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview) backend. When you're finished, you have an ASP.NET app running in Azure and connected to SQL Database. You'll first use an [ARM template](../azure-resource-manager/templates/overview.md) to create resources.

This tutorial does not use containers. If you want to deploy to a containerized ASP.NET Core application, see [Use GitHub Actions to deploy to App Service for Containers and connect to a database](app-service-sql-github-actions.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Use a GitHub Actions workflow to add resources to Azure with a Azure Resource Manager template (ARM template)
> - Use a GitHub Actions workflow to build an ASP.NET Core application

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you'll need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).
  - A GitHub repository to store your Resource Manager templates and your workflow files. To create one, see [Creating a new repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).

## Download the sample

[Fork the sample project](https://github.com/Azure-Samples/dotnetcore-sqldb-ghactions) in the Azure Samples repo.

```
https://github.com/Azure-Samples/dotnetcore-sqldb-ghactions
```

## Create the resource group

Open the Azure Cloud Shell at https://shell.azure.com. You can alternately use the Azure CLI if you've installed it locally. (For more information on Cloud Shell, see the [Cloud Shell Overview](../cloud-shell/overview.md).)

```azurecli-interactive
az group create --name {resource-group-name} --location {resource-group-location}
```

## Generate deployment credentials

You'll need to authenticate with a service principal for the resource deployment script to work. You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
    az ad sp create-for-rbac --name "{service-principal-name}" --sdk-auth --role contributor --scopes /subscriptions/{subscription-id}
```

In the example, replace the placeholders with your subscription ID, resource group name, and service principal name. The output is a JSON object with the role assignment credentials that provide access to your App Service app. Copy this JSON object for later. For help, go to [configure deployment credentials](https://github.com/Azure/login#configure-deployment-credentials).

```output
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

## Configure the GitHub secret for authentication

[!INCLUDE [include](~/articles/reusable-content/github-actions/create-secrets-service-principal.md)]

## Add GitHub secrets for your build

1. Create [two new secrets](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository) in your GitHub repository for `SQLADMIN_PASS` and `SQLADMIN_LOGIN`. Make sure you choose a complex password, otherwise the create step for the SQL database server will fail. You won't be able to access this password again so save it separately.

2. Create an `AZURE_SUBSCRIPTION_ID` secret for your Azure subscription ID. If you do not know your subscription ID, use this command in the Azure Shell to find it. Copy the value in the `SubscriptionId` column.
    ```azurecli
    az account list -o table
    ```
 
## Create Azure resources

The create Azure resources workflow runs an [ARM template](../azure-resource-manager/templates/overview.md) to deploy resources to Azure. The workflow:

- Checks out source code with the [Checkout action](https://github.com/marketplace/actions/checkout).
- Logs into Azure with the [Azure Login action](https://github.com/marketplace/actions/azure-login) and gathers environment and Azure resource information.
- Deploys resources with the [Azure Resource Manager Deploy action](https://github.com/marketplace/actions/deploy-azure-resource-manager-arm-template).

To run the create Azure resources workflow:

1. Open the `infraworkflow.yml` file in `.github/workflows` within your repository.

1. Update the value of `AZURE_RESOURCE_GROUP` to your resource group name.

1. Set the input for `region` in your ARM Deploy actions to your region. 
    1. Open `templates/azuredeploy.resourcegroup.parameters.json` and update the `rgLocation` property to your region.
 
1. Go to **Actions** and select **Run workflow**.

   :::image type="content" source="media/github-actions-workflows/github-actions-run-workflow.png" alt-text="Run the GitHub Actions workflow to add resources.":::

1. Verify that your action ran successfully by checking for a green checkmark on the **Actions** page.

   :::image type="content" source="media/github-actions-workflows/create-resources-success.png" alt-text="Successful run of create resources. ":::

1. After you've created your resources, go to **Actions**, select Create Azure Resources, disable the workflow. 
 
    :::image type="content" source="media/github-actions-workflows/disable-workflow-github-actions.png" alt-text="Disable the Create Azure Resources workflow.":::

## Create a publish profile secret

1. In the Azure portal, open your new staging App Service (Slot) created with the `Create Azure Resources` workflow.

1. Select **Get Publish Profile**.

1. Open the publish profile file in a text editor and copy its contents. 

1. Create a new GitHub secret for `AZURE_WEBAPP_PUBLISH_PROFILE`. 

## Build and deploy your app

To run the build and deploy workflow:

1. Open your `workflow.yaml` file in `.github/workflows` within your repository.

1. Verify that the environment variables for `AZURE_RESOURCE_GROUP`, `AZURE_WEBAPP_NAME`, `SQLSERVER_NAME`, and `DATABASE_NAME` match the ones in `infraworkflow.yml`.

1. Verify that your app deployed by visiting the URL in the Swap to production slot output. You should see a sample app, My TodoList App. 
 
## Clean up resources

If you no longer need your sample project, delete your resource group in the Azure portal and delete your repository on GitHub. 

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure and GitHub integration](/azure/developer/github/)