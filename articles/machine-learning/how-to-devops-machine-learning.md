---
title: Azure DevOps for CI/CD
titleSuffix: Azure Machine Learning
description: Use Azure Pipelines for flexible MLOps automation
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: fkriti
ms.author: kritifaujdar
ms.reviewer: larryfr
ms.date: 06/06/2023
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

This article teaches you how to create an Azure Pipeline that builds and deploys a machine learning model to [Azure Machine Learning](overview-what-is-azure-machine-learning.md). 

This tutorial uses [Azure Machine Learning Python SDK v2](/python/api/overview/azure/ai-ml-readme) and [Azure CLI ML extension v2](/cli/azure/ml). 

## Prerequisites

* Complete the [Create resources to get started](quickstart-create-resources.md) to:
    * Create a workspace
* [Create a cloud-based compute cluster](how-to-create-attach-compute-cluster.md#create) to use for training your model
* Azure Machine Learning extension for Azure Pipelines. This extension can be installed from the Visual Studio marketplace at [https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.azureml-v2](https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.azureml-v2). 

## Step 1: Get the code

Fork the following repo at GitHub:

```
https://github.com/azure/azureml-examples
```

## Step 2: Sign in to Azure Pipelines

[!INCLUDE [include](~/articles/reusable-content/devops-pipelines/sign-in-azure-pipelines.md)]

[!INCLUDE [include](~/articles/reusable-content/devops-pipelines/create-project.md)]

## Step 3: Create a service connection

You can use an existing service connection.

# [Azure Resource Manager](#tab/arm)

You need an Azure Resource Manager connection to authenticate with Azure portal. 

1. In Azure DevOps, select **Project Settings** and open the **Service connections** page.

1. Choose **+ New service connection** and select **Azure Resource Manager**.

1. Select the default authentication method, **Service principal (automatic)**.

1. Create your service connection. Set your preferred scope level, subscription, resource group, and connection name. 

    :::image type="content" source="media/how-to-devops-machine-learning/machine-learning-arm-connection.png" alt-text="Screenshot of ARM service connection.":::

# [Generic](#tab/generic)

1. In Azure DevOps, select **Project Settings** and open the **Service connections** page.

1. Choose **+ New service connection** and select **Generic**.

1. Use ```https://management.azure.com``` and provide a service connection name. Don't provide any authentication related information.

1. Create your service connection.

---


## Step 4: Create a pipeline

1. Go to **Pipelines**, and then select **New pipeline**.

1. Do the steps of the wizard by first selecting **GitHub** as the location of your source code.

1. You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.

1. When you see the list of repositories, select your repository.

1. You might be redirected to GitHub to install the Azure Pipelines app. If so, select **Approve & install**.

1. Select the **Starter pipeline**. You'll update the starter pipeline template.

## Step 5: Build your YAML pipeline to submit the Azure Machine Learning job

Delete the starter pipeline and replace it with the following YAML code. In this pipeline, you'll:

* Use the Python version task to set up Python 3.8 and install the SDK requirements.
* Use the Bash task to run bash scripts for the Azure Machine Learning SDK and CLI.
* Use the Azure CLI task to submit an Azure Machine Learning job. 

Select the following tabs depending on whether you're using an Azure Resource Manager service connection or a generic service connection. In the pipeline YAML, replace the value of variables with your resources.

# [Using Azure Resource Manager service connection](#tab/arm)

```yaml
name: submit-azure-machine-learning-job

trigger:
- none

variables:
  service-connection: 'machine-learning-connection' # replace with your service connection name
  resource-group: 'machinelearning-rg' # replace with your resource group name
  workspace: 'docs-ws' # replace with your workspace name

jobs:
- job: SubmitAzureMLJob
  displayName: Submit AzureML Job
  timeoutInMinutes: 300
  pool:
    vmImage: ubuntu-latest
  steps:
  - checkout: none
  - task: UsePythonVersion@0
    displayName: Use Python >=3.8
    inputs:
      versionSpec: '>=3.8'

  - bash: |
      set -ex

      az version
      az extension add -n ml
    displayName: 'Add AzureML Extension'

  - task: AzureCLI@2
    name: submit_azureml_job_task
    displayName: Submit AzureML Job Task
    inputs:
      azureSubscription: $(service-connection)
      workingDirectory: 'cli/jobs/pipelines-with-components/nyc_taxi_data_regression'
      scriptLocation: inlineScript
      scriptType: bash
      inlineScript: |
      
      # submit component job and get the run name
      job_name=$(az ml job create --file single-job-pipeline.yml -g $(resource-group) -w $(workspace) --query name --output tsv)

      # Set output variable for next task
      echo "##vso[task.setvariable variable=JOB_NAME;isOutput=true;]$job_name"

```
# [Using generic service connection](#tab/generic)
```yaml
name: submit-azure-machine-learning-job

trigger:
- none

variables:
  subscription_id: '00000000-0000-0000-0000-000000000000' # replace with your subscription id
  service-connection: 'generic-machine-learning-connection' # replace with your generic service connection name
  resource-group: 'machinelearning-rg' # replace with your resource group name
  workspace: 'docs-ws' # replace with your workspace name

jobs:
- job: SubmitAzureMLJob
  displayName: Submit AzureML Job
  timeoutInMinutes: 300
  pool:
    vmImage: ubuntu-latest
  steps:
  - checkout: none
  - task: UsePythonVersion@0
    displayName: Use Python >=3.8
    inputs:
      versionSpec: '>=3.8'

  - bash: |
      set -ex

      az version
      az extension add -n ml
      az login --identity
      az account set --subscription $(subscription_id)

    displayName: 'Add AzureML Extension and get identity'

  - task: AzureCLI@2
    name: submit_azureml_job_task
    displayName: Submit AzureML Job Task
    inputs:
      workingDirectory: 'cli/jobs/pipelines-with-components/nyc_taxi_data_regression'
      scriptLocation: inlineScript
      scriptType: bash
      inlineScript: |
      
      # submit component job and get the run name
      job_name=$(az ml job create --file single-job-pipeline.yml -g $(resource-group) -w $(workspace) --query name --output tsv)


      # Set output variable for next task
      echo "##vso[task.setvariable variable=JOB_NAME;isOutput=true;]$job_name"

      # Get a bearer token to authenticate the request in the next job
      export aadToken=$(az account get-access-token --resource=https://management.azure.com --query accessToken -o tsv)
      echo "##vso[task.setvariable variable=AAD_TOKEN;isOutput=true;issecret=true]$aadToken"
     
```
---

## Step 6: Wait for Azure Machine Learning job to complete


In step 5, you added a job to submit an Azure Machine Learning job. In this step, you add another job that waits for the Azure Machine Learning job to complete. 


# [Using Azure Resource Manager service connection](#tab/arm)

If you're using an Azure Resource Manager service connection, you can use the "Machine Learning" extension. You can search this extension in the [Azure DevOps extensions Marketplace](https://marketplace.visualstudio.com/search?target=AzureDevOps&category=Azure%20Pipelines&visibilityQuery=public&sortBy=Installs) or go directly to the [extension](https://marketplace.visualstudio.com/items?itemName=ms-air-aiagility.azureml-v2). Install the "Machine Learning" extension.

> [!IMPORTANT]
> Don't install the __Machine Learning (classic)__ extension by mistake; it's an older extension that doesn't provide the same functionality.

In the Pipeline review window, add a Server Job. In the steps part of the job, select __Show assistant__ and search for __AzureML__. Select the __AzureML Job Wait__ task and fill in the information for the job. 

The task has four inputs: `Service Connection`, `Azure Resource Group Name`, `AzureML Workspace Name` and `AzureML Job Name`. Fill these inputs. The resulting YAML for these steps is similar to the following example: 

> [!NOTE]
> * The Azure Machine Learning job wait task runs on a **server job**, which doesn't use up expensive agent pool resources and requires no additional charges. Server jobs (indicated by `pool: server`) run on the same machine as your pipeline. For more information, see [Server jobs](/azure/devops/pipelines/process/phases#server-jobs).
> * One Azure Machine Learning job wait task can only wait on one job. You'll need to set up a separate task for each job that you want to wait on.
> * The Azure Machine Learning job wait task can wait for a maximum of 2 days. This is a hard limit set by Azure DevOps Pipelines. 

```yml
- job: WaitForAzureMLJobCompletion
  displayName: Wait for AzureML Job Completion
  pool: server
  timeoutInMinutes: 0
  dependsOn: SubmitAzureMLJob
  variables: 
    # We are saving the name of azureMl job submitted in previous step to a variable and it will be used as an inut to the AzureML Job Wait task
    azureml_job_name_from_submit_job: $[ dependencies.SubmitAzureMLJob.outputs['submit_azureml_job_task.AZUREML_JOB_NAME'] ] 
  steps:
  - task: AzureMLJobWaitTask@1
    inputs:
      serviceConnection: $(service-connection)
      resourceGroupName: $(resource-group)
      azureMLWorkspaceName: $(workspace)
      azureMLJobName: $(azureml_job_name_from_submit_job)
```

# [Using generic service connection](#tab/generic)

If you're using the Generic Service connection, you can't use the task provided by Azure Machine Learning extension. Instead, call the API directly using an `InvokeRESTAPI` task. The following YAML example demonstrates how to use the API.

```yml
- job: WaitForJobCompletion
  displayName: Wait for AzureML Job Completion
  pool: server
  timeoutInMinutes: 0
  dependsOn: SubmitAzureMLJob
  variables: 
    job_name_from_submit_task: $[ dependencies.SubmitAzureMLJob.outputs['submit_azureml_job_task.JOB_NAME'] ] 
    AAD_TOKEN: $[ dependencies.SubmitAzureMLJob.outputs['submit_azureml_job_task.AAD_TOKEN'] ]
  steps:
  - task: InvokeRESTAPI@1
    inputs:
      connectionType: connectedServiceName
      serviceConnection: $(service-connection)
      method: PATCH
      body: "{ \"Properties\": { \"NotificationSetting\": { \"Webhooks\": { \"ADO_Webhook_$(system.TimelineId)\": { \"WebhookType\": \"AzureDevOps\", \"EventType\": \"RunTerminated\", \"PlanUri\": \"$(system.CollectionUri)\", \"ProjectId\": \"$(system.teamProjectId)\", \"HubName\": \"$(system.HostType)\", \"PlanId\": \"$(system.planId)\", \"JobId\": \"$(system.jobId)\", \"TimelineId\": \"$(system.TimelineId)\", \"TaskInstanceId\": \"$(system.TaskInstanceId)\", \"AuthToken\": \"$(system.AccessToken)\"}}}}}"
      headers: "{\n\"Content-Type\":\"application/json\", \n\"Authorization\":\"Bearer $(AAD_TOKEN)\" \n}"
      urlSuffix: "subscriptions/$(subscription_id)/resourceGroups/$(resource-group)/providers/Microsoft.MachineLearningServices/workspaces/$(workspace)/jobs/$(job_name_from_submit_task)?api-version=2023-04-01-preview"
      waitForCompletion: "true"
```
---


## Step 7: Submit pipeline and verify your pipeline run

Select __Save and run__. The pipeline will wait for the Azure Machine Learning job to complete, and end the task under `WaitForJobCompletion` with the same status as the Azure Machine Learning job. For example:
Azure Machine Learning job `Succeeded` == Azure DevOps Task under `WaitForJobCompletion` job `Succeeded`
Azure Machine Learning job `Failed` == Azure DevOps Task under `WaitForJobCompletion` job `Failed`
Azure Machine Learning job `Cancelled` == Azure DevOps Task under `WaitForJobCompletion` job `Cancelled`

 
> [!TIP]
> You can view the complete Azure Machine Learning job in [Azure Machine Learning studio](https://ml.azure.com).


## Clean up resources

If you're not going to continue to use your pipeline, delete your Azure DevOps project. In Azure portal, delete your resource group and Azure Machine Learning instance.
