---
title: GitHub Actions for CI/CD
titleSuffix: Azure Machine Learning
description: Learn about how to create a GitHub Actions workflow to train a model on Azure Machine Learning 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: juliakm
ms.author: jukullam
ms.date: 10/19/2020
ms.topic: conceptual
ms.custom: github-actions-azure
---

# Use GitHub Actions with Azure Machine Learning

Get started with [GitHub Actions](https://docs.github.com/en/actions) to train a model on Azure Machine Learning. 

> [!NOTE]
> GitHub Actions for Azure Machine Learning are provided as-is, and are not fully supported by Microsoft. If you encounter problems with a specific action, open an issue in the repository for the action. For example, if you encounter a problem with the aml-deploy action, report the problem in the [https://github.com/Azure/aml-deploy]( https://github.com/Azure/aml-deploy) repo.

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

## Workflow file overview

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has four sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Define a service principal. <br /> 2. Create a GitHub secret. |
|**Connect** | 1. Connect to the machine learning workspace. <br /> 2. Connect to a compute target. |
|**Run** | 1. Submit a training run. |
|**Deploy** | 1. Register model in Azure Machine Learning registry. 1. Deploy the model. |

## Create repository

Create a new repository off the [ML Ops with GitHub Actions and Azure Machine Learning template](https://github.com/machine-learning-apps/ml-template-azure). 

1. Open the [template](https://github.com/machine-learning-apps/ml-template-azure) on GitHub. 
2. Select **Use this template**. 

    :::image type="content" source="media/how-to-github-actions-machine-learning/gh-actions-use-template.png" alt-text="Select use this template":::
3. Create a new repository from the template. Set the repository name to `ml-learning` or a name of your choice. 


## Generate deployment credentials

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

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

## Configure the GitHub secret

1. In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

2. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name `AZURE_CREDENTIALS`.

## Connect to the workspace

Use the [Azure Machine Learning Workspace action](https://github.com/marketplace/actions/azure-machine-learning-workspace) to connect to your Azure Machine Learning workspace. 

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