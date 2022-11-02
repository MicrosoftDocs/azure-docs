---
title: Azure DevOps for CI/CD
titleSuffix: Azure Machine Learning
description: Use Azure Pipelines for flexible MLOps automation
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: juliakm
ms.author: jukullam
ms.date: 09/28/2022
ms.topic: how-to
ms.custom: devops-pipelines-deploy
---

# Use Azure Pipelines with Azure Machine Learning

**Azure DevOps Services | Azure DevOps Server 2022 - Azure DevOps Server 2019**

You can use an [Azure DevOps pipeline](/azure/devops/pipelines/) to automate the machine learning lifecycle. Some of the operations you can automate are:

* Data preparation (extract, transform, load operations)
* Training machine learning models with on-demand scale-out and scale-up
* Deployment of machine learning models as public or private web services
* Monitoring deployed machine learning models (such as for performance or data-drift analysis)

This article will teach you how to create an Azure Pipeline that builds and deploys a machine learning model to [Azure Machine Learning](overview-what-is-azure-machine-learning.md). You'll train a scikit-learn linear regression model on the Diabetes dataset.

This tutorial uses [Azure Machine Learning Python SDK v2](/python/api/overview/azure/ml/installv2) and [Azure CLI ML extension v2](/cli/azure/ml). 

## Prerequisites

Complete the [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md) to:
* Create a workspace
* Create a cloud-based compute instance to use for your development environment
* Create a cloud-based compute cluster to use for training your model

## Step 1: Get the code

Fork the following repo at GitHub:

```
https://github.com/azure/azureml-examples
```

## Step 2: Sign in to Azure Pipelines

[!INCLUDE [include](~/articles/reusable-content/devops-pipelines/sign-in-azure-pipelines.md)]

[!INCLUDE [include](~/articles/reusable-content/devops-pipelines/create-project.md)]

## Step 3: Create an Azure Resource Manager connection

You'll need an Azure Resource Manager connection to authenticate with Azure portal. 

1. In Azure DevOps, open the **Service connections** page.

1. Choose **+ New service connection** and select **Azure Resource Manager**.

1. Select the default authentication method, **Service principal (automatic)**.

1. Create your service connection. Set your subscription, resource group, and connection name. 

    :::image type="content" source="media/how-to-devops-machine-learning/machine-learning-arm-connection.png" alt-text="Screenshot of ARM service connection.":::


## Step 4: Create a pipeline

1. Go to **Pipelines**, and then select **New pipeline**.

1. Do the steps of the wizard by first selecting **GitHub** as the location of your source code.

1. You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.

1. When you see the list of repositories, select your repository.

1. You might be redirected to GitHub to install the Azure Pipelines app. If so, select **Approve & install**.

1. Select the **Starter pipeline**. You'll update the starter pipeline template.

## Step 5: Create variables

You should already have a resource group in Azure with [Azure Machine Learning](overview-what-is-azure-machine-learning.md). To deploy your DevOps pipeline to AzureML, you'll need to create variables for your subscription ID, resource group, and machine learning workspace. 

1. Select the Variables tab on your pipeline edit page.  

    :::image type="content" source="media/how-to-devops-machine-learning/machine-learning-select-variables.png" alt-text="Screenshot of variables option in pipeline edit. ":::   
 
1. Create a new variable, `Subscription_ID`, and select the checkbox **Keep this value secret**. Set the value to your [Azure portal subscription ID](../azure-portal/get-subscription-tenant-id.md).
1. Create a new variable for `Resource_Group` with the name of the resource group for Azure Machine Learning (example: `machinelearning`). 
1. Create a new variable for `AzureML_Workspace_Name` with the name of your Azure ML workspace (example: `docs-ws`).
1. Select **Save** to save your variables. 

## Step 6: Build your YAML pipeline

Delete the starter pipeline and replace it with the following YAML code. In this pipeline, you'll:

* Use the Python version task to set up Python 3.8 and install the SDK requirements.
* Use the Bash task to run bash scripts for the Azure Machine Learning SDK and CLI.
* Use the Azure CLI task to pass the values of your three variables and use papermill to run your Jupyter notebook and push output to AzureML. 

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.8'
- script: pip install -r sdk/dev-requirements.txt
  displayName: 'pip install notebook reqs'
- task: Bash@3
  inputs:
    filePath: 'sdk/setup.sh'
  displayName: 'set up sdk'

- task: Bash@3
  inputs:
    filePath: 'cli/setup.sh'
  displayName: 'set up CLI'

- task: AzureCLI@2
  inputs:
    azureSubscription: 'your-azure-subscription'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
           sed -i -e "s/<SUBSCRIPTION_ID>/$(SUBSCRIPTION_ID)/g" sklearn-diabetes.ipynb
           sed -i -e "s/<RESOURCE_GROUP>/$(RESOURCE_GROUP)/g" sklearn-diabetes.ipynb
           sed -i -e "s/<AML_WORKSPACE_NAME>/$(AZUREML_WORKSPACE_NAME)/g" sklearn-diabetes.ipynb
           sed -i -e "s/DefaultAzureCredential/AzureCliCredential/g" sklearn-diabetes.ipynb
           papermill -k python sklearn-diabetes.ipynb sklearn-diabetes.output.ipynb
    workingDirectory: 'sdk/jobs/single-step/scikit-learn/diabetes'
```


## Step 7: Verify your pipeline run

1. Open your completed pipeline run and view the AzureCLI task. Check the task view to verify that the output task finished running. 
 
   :::image type="content" source="media/how-to-devops-machine-learning/machine-learning-azurecli-output.png" alt-text="Screenshot of machine learning output to AzureML.":::

1. Open Azure Machine Learning studio and navigate to the completed `sklearn-diabetes-example` job. On the **Metrics** tab, you should see the training results. 

    :::image type="content" source="media/how-to-devops-machine-learning/machine-learning-training-results.png" alt-text="Screenshot of training results.":::

## Clean up resources

If you're not going to continue to use your pipeline, delete your Azure DevOps project. In Azure portal, delete your resource group and Azure Machine Learning instance.