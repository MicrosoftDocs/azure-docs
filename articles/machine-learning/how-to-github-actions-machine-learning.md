---
title: GitHub Actions for CI/CD
titleSuffix: Azure Machine Learning
description: Learn about how to create a GitHub Actions workflow to train a model on Azure Machine Learning 
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: juliakm
ms.author: jukullam
ms.date: 09/07/2022
ms.topic: how-to
ms.custom: github-actions-azure
---

# Use GitHub Actions with Azure Machine Learning

Get started with [GitHub Actions](https://docs.github.com/en/actions) to train a model on Azure Machine Learning. 

This article will teach you how to create a GitHub Actions workflow that builds and deploys a machine learning model to [Azure Machine Learning](/azure/machine-learning/overview-what-is-azure-machine-learning). You'll train a [scikit-learn](https://scikit-learn.org/) linear regression model on the NYC Taxi dataset. 

This tutorial uses [Azure Machine Learning Python SDK v2](/python/api/overview/azure/ml/installv2), which is in public preview, and [Azure CLI ML extension v2](/cli/azure/ml). 

GitHub Actions uses a workflow YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.


## Prerequisites 

- Complete the [Quickstart: Get started with Azure Machine Learning](/azure/machine-learning/quickstart-create-resources) to:
    - Create a workspace
    - Create a cloud-based compute instance to use for your development environment
    - Create a cloud-based compute cluster to use for training your model. The cluster should have the name `cpu-cluster`
- Have a GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

## Step 1. Get the code

Fork the following repo at GitHub:

```
https://github.com/azure/azureml-examples
```

## Step 2. Authenticate with Azure

You'll need to first define how to authenticate with Azure. You can use a service principal or OpenID Connect. 

### Generate deployment credentials

# [Service principal](#tab/userlevel)

service principal
Create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
az ad sp create-for-rbac --name "myML" --role contributor \
                            --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name> \
                            --sdk-auth
```

In the example above, replace the placeholders with your subscription ID, resource group name, and app name. The output is a JSON object with the role assignment credentials that provide access to your App Service app similar to below. Copy this JSON object for later.

```output 
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

# [OpenID Connect](#tab/openid)

OpenID Connect is an authentication method that uses short-lived tokens. Setting up [OpenID Connect with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) is more complex process that offers hardened security. 

1.  If you don't have an existing application, register a [new Active Directory application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md). Create the Active Directory application. 

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

    This command will output JSON with an `appId` that is your `client-id`. Save the value to use as the `AZURE_CLIENT_ID` GitHub secret later. 

    You'll use the `objectId` value when creating federated credentials with Graph API and reference it as the `APPLICATION-OBJECT-ID`.

1. Create a service principal. Replace the `$appID` with the appId from your JSON output. 

    This command generates JSON output with a different `objectId` and will be used in the next step. The new  `objectId` is the `assignee-object-id`. 
    
    Copy the `appOwnerTenantId` to use as a GitHub secret for `AZURE_TENANT_ID` later. 

    ```azurecli-interactive
     az ad sp create --id $appId
    ```

1. Create a new role assignment by subscription and object. By default, the role assignment will be tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, and `$assigneeObjectId` with the generated `assignee-object-id`. Learn [how to manage Azure subscriptions with the Azure CLI](/cli/azure/manage-azure-subscriptions-azure-cli). 

    ```azurecli-interactive
    az role assignment create --role contributor --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName --subscription $subscriptionId --assignee-object-id  $assigneeObjectId --assignee-principal-type ServicePrincipal
    ```

1. Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for your active directory application.

    * Replace `APPLICATION-OBJECT-ID` with the **objectId (generated while creating app)** for your Active Directory application.
    * Set a value for `CREDENTIAL-NAME` to reference later.
    * Set the `subject`. The value of this is defined by GitHub depending on your workflow:
      * Jobs in your GitHub Actions environment: `repo:< Organization/Repository >:environment:< Name >`
      * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
      * For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull_request`.
    
    ```azurecli
    az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/<APPLICATION-OBJECT-ID>/federatedIdentityCredentials' --body '{"name":"<CREDENTIAL-NAME>","issuer":"https://token.actions.githubusercontent.com","subject":"repo:organization/repository:ref:refs/heads/main","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
    ```
    
To learn how to create a Create an active directory application, service principal, and federated credentials in Azure portal, see [Connect GitHub and Azure](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

---

### Create secrets

# [Service principal](#tab/userlevel)

1. In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Actions**. Select **New repository secret**.

2. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name `AZ_CREDS`.

 # [OpenID Connect](#tab/openid)

ou need to provide your application's **Client ID**, **Tenant ID**, and **Subscription ID** to the login action. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.

1. In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Actions**. Select **New repository secret**.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your Active Directory application for your GitHub secrets:

    |GitHub Secret  | Active Directory Application  |
    |---------|---------|
    |AZURE_CLIENT_ID     |      Application (client) ID   |
    |AZURE_TENANT_ID     |     Directory (tenant) ID    |
    |AZURE_SUBSCRIPTION_ID     |     Subscription ID    |

1. Save each secret by selecting **Add secret**.

---


<!--TODO: Update compute-cluster in pipeline.yml OR give computer cluster name cpu-cluster -->

## Step 3. Update `setup.sh` to connect to your Azure Machine Learning workspace

You'll need to update the CLI setup file variables to match your workspace. 

1. In your cloned repository, go to `azureml-examples/cli/`. 
1. Edit `setup.sh` and update these variables in the file. 
   
    |Variable  | Description  |
    |---------|---------|
    |GROUP     |      Name of resource group    |
    |LOCATION     |    Location of your workspace (example: `eastus2`)    |
    |WORKSPACE     |     Name of Azure ML workspace     | 

## Step 4. Update `pipeline.yml` with your compute cluster name

You'll use a `pipeline.yml` file to deploy your Azure ML pipeline. This is a machine learning pipeline and not a DevOps pipeline. You only need to make this update if you're using a name other than `cpu-cluster` for your computer cluster name. 

1. In your cloned repository, go to `azureml-examples/cli/jobs/pipelines/nyc-taxi/pipeline.yml`. 
1. Each time you see `compute: azureml:cpu-cluster`, update the value of `cpu-cluster` with your compute cluster name. There are five updates.

## Step 5: Run your GitHub Actions workflow

1. In your cloned repository, open `.github/workflows/cli-jobs-pipelines-nyc-taxi-pipeline.yml`.
1. Select **View runs**. 
1. Enable workflows by selecting **I understand my workflows, go ahead and enable them**.
1. Select the **cli-jobs-pipelines-nyc-taxi-pipeline workflow** and choose to **Enable workflow**. 
1. Select **Run workflow** and choose the option to **Run workflow** now. 



<!--TODO: Add workflow breakdown -->

<!--TODO: Add OPENID Scenario -->

## Clean up resources

When your resource group and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository. 

## Next steps

> [!div class="nextstepaction"]
> [Create and run machine learning pipelines with Azure Machine Learning SDK](./how-to-create-machine-learning-pipelines.md)
