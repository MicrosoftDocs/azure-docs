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

This article will teach you how to create an GitHub Actions workflow that builds and deploys a machine learning model to [Azure Machine Learning](/azure/machine-learning/overview-what-is-azure-machine-learning). You'll train a scikit-learn linear regression model on the NYC Taxi dataset. 

This tutorial uses [Azure Machine Learning Python SDK v2](/python/api/overview/azure/ml/installv2), which is in public preview, and [Azure CLI ML extension v2](/cli/azure/ml). 

GitHub Actions uses a workflow YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.


## Prerequisites 

- Complete the [Quickstart: Get started with Azure Machine Learning](/azure/machine-learning/quickstart-create-resources) to:
    - Create a workspace
    - Create a cloud-based compute instance to use for your development environment
    - Create a cloud-based compute cluster to use for training your model. The cluster should have the name `cpu-cluster`
- Have a GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

## Step 1: Get the code

Fork the following repo at GitHub:

```
https://github.com/azure/azureml-examples
```

## Step 2: Authenticate with Azure

To authenticate, you'll define how to authenticate with Azure. You can use a service principal or OpenID Connect. 

### Generate deployment credentials

# [Service principal](#tab/userlevel)

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

1.  If you do not have an existing application, register a [new Active Directory application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md). Create the Active Directory application. 

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

    This command will output JSON with an `appId` that is your `client-id`. Save the value to use as the `AZURE_CLIENT_ID` GitHub secret later. 

    You will use the `objectId` value when creating federated credentials with Graph API and reference it as the `APPLICATION-OBJECT-ID`.

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

1. In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

2. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name `AZURE_CREDENTIALS`.

 # [OpenID Connect](#tab/openid)

---

The file has four sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Define a service principal. <br /> 2. Create a GitHub secret. |
|**Connect** | 1. Connect to the machine learning workspace. <br /> 2. Connect to a compute target. |
|**Run** | 1. Submit a training run. |
|**Deploy** | 1. Register model in Azure Machine Learning registry. 1. Deploy the model. |

## Create repository

 <!-- TODO: Replace with Clone https://github.com/Azure/azureml-examples/ -->

Create a new repository off the [ML Ops with GitHub Actions and Azure Machine Learning template](https://github.com/machine-learning-apps/ml-template-azure). 

1. Open the [template](https://github.com/machine-learning-apps/ml-template-azure) on GitHub. 
2. Select **Use this template**. 

    :::image type="content" source="media/how-to-github-actions-machine-learning/gh-actions-use-template.png" alt-text="Select use this template":::
3. Create a new repository from the template. Set the repository name to `ml-learning` or a name of your choice. 




<!--TODO: Update setup.sh file in CLI, all 3 attributes -->
<!--TODO: Update compute-cluster in pipeline.yml OR give computer cluster name cpu-cluster -->
## Connect to the workspace

Use the **Azure Machine Learning Workspace action** to connect to your Azure Machine Learning workspace. 

```yaml
    - name: Connect/Create Azure Machine Learning Workspace
      id: aml_workspace
      uses: Azure/aml-workspace@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
```

By default, the action expects a `workspace.json` file. If your JSON file has a different name, you can specify it with the `parameters_file` input parameter. If there is not a file, a new one will be created with the repository name.


```yaml
    - name: Connect/Create Azure Machine Learning Workspace
      id: aml_workspace
      uses: Azure/aml-workspace@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
          parameters_file: "alternate_workspace.json"
```
The action writes the workspace Azure Resource Manager (ARM) properties to a config file, which will be picked by all future Azure Machine Learning GitHub Actions. The file is saved to `GITHUB_WORKSPACE/aml_arm_config.json`. 

## Connect to a Compute Target in Azure Machine Learning

Use the [Azure Machine Learning Compute action](https://github.com/Azure/aml-compute) to connect to a compute target in Azure Machine Learning.  If the compute target exists, the action will connect to it. Otherwise the action will create a new compute target. The [AML Compute action](https://github.com/Azure/aml-compute) only supports the Azure ML compute cluster and Azure Kubernetes Service (AKS). 

```yaml
    - name: Connect/Create Azure Machine Learning Compute Target
      id: aml_compute_training
      uses: Azure/aml-compute@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
```
## Submit training run

Use the [Azure Machine Learning Training action](https://github.com/Azure/aml-run) to submit a ScriptRun, an Estimator or a Pipeline to Azure Machine Learning. 

```yaml
    - name: Submit training run
      id: aml_run
      uses: Azure/aml-run@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
```

## Register model in registry

Use the [Azure Machine Learning Register Model action](https://github.com/Azure/aml-registermodel) to register a model to Azure Machine Learning.

```yaml
    - name: Register model
      id: aml_registermodel
      uses: Azure/aml-registermodel@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
          run_id:  ${{ steps.aml_run.outputs.run_id }}
          experiment_name: ${{ steps.aml_run.outputs.experiment_name }}
```

## Deploy model to Azure Machine Learning to ACI

Use the [Azure Machine Learning Deploy action](https://github.com/Azure/aml-deploy) to deploys a model and create an endpoint for the model. You can also use the Azure Machine Learning Deploy to deploy to Azure Kubernetes Service. See [this sample workflow](https://github.com/Azure-Samples/mlops-enterprise-template) for a model that deploys to Azure Kubernetes Service.

```yaml
    - name: Deploy model
      id: aml_deploy
      uses: Azure/aml-deploy@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
          model_name:  ${{ steps.aml_registermodel.outputs.model_name }}
          model_version: ${{ steps.aml_registermodel.outputs.model_version }}

```

## Complete example

Train your model and deploy to Azure Machine Learning. 

```yaml
# Actions train a model on Azure Machine Learning
name: Azure Machine Learning training and deployment
on:
  push:
    branches:
      - master
    # paths:
    #   - 'code/*'
jobs:
  train:
    runs-on: ubuntu-latest
    steps:
    # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
    - name: Check Out Repository
      id: checkout_repository
      uses: actions/checkout@v2
        
    # Connect or Create the Azure Machine Learning Workspace
    - name: Connect/Create Azure Machine Learning Workspace
      id: aml_workspace
      uses: Azure/aml-workspace@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
    
    # Connect or Create a Compute Target in Azure Machine Learning
    - name: Connect/Create Azure Machine Learning Compute Target
      id: aml_compute_training
      uses: Azure/aml-compute@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
    
    # Submit a training run to the Azure Machine Learning
    - name: Submit training run
      id: aml_run
      uses: Azure/aml-run@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}

    # Register model in Azure Machine Learning model registry
    - name: Register model
      id: aml_registermodel
      uses: Azure/aml-registermodel@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
          run_id:  ${{ steps.aml_run.outputs.run_id }}
          experiment_name: ${{ steps.aml_run.outputs.experiment_name }}

    # Deploy model in Azure Machine Learning to ACI
    - name: Deploy model
      id: aml_deploy
      uses: Azure/aml-deploy@v1
      with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
          model_name:  ${{ steps.aml_registermodel.outputs.model_name }}
          model_version: ${{ steps.aml_registermodel.outputs.model_version }}

```

## Clean up resources

When your resource group and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository. 

## Next steps

> [!div class="nextstepaction"]
> [Create and run machine learning pipelines with Azure Machine Learning SDK](./how-to-create-machine-learning-pipelines.md)
