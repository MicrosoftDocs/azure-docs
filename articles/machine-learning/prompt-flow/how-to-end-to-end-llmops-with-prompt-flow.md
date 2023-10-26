---
title: Set up end-to-end LLMOps with Prompt Flow and GitHub (preview)
titleSuffix: Azure Machine Learning
description: Learn about using Azure Machine Learning to set up an end-to-end LLMOps pipeline that runs a web classification flow that classifies a website based on a given URL.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
author: abeomor
ms.author: osomorog
ms.reviewer: lagayhar
ms.date: 09/12/2023
---
# Set up end-to-end LLMOps with prompt flow and GitHub (preview)

Azure Machine Learning allows you to integrate with [GitHub Actions](https://docs.github.com/actions) to automate the machine learning lifecycle. Some of the operations you can automate are:

- Running prompt flow after a pull request
- Running prompt flow evaluation to ensure results are high quality
- Registering of prompt flow models
- Deployment of prompt flow models

In this article, you learn about using Azure Machine Learning to set up an end-to-end LLMOps pipeline that runs a web classification flow that classifies a website based on a given URL. The flow is made up of multiple LLM calls and components, each serving  different functions. All the LLMs used are managed and store in your Azure Machine Learning workspace in your Prompt flow connections.

> [!TIP]
> We recommend you understand how we integrate [LLMOps with Prompt flow](how-to-integrate-with-llm-app-devops.md).

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Machine Learning](https://azure.microsoft.com/free/).
- An [Azure Machine Learning workspace](../how-to-manage-workspace.md#create-a-workspace).
- Git running on your local machine.
- GitHub as the source control repository.

> [!NOTE]
>Git version 2.27 or newer is required. For more information on installing the Git command, see https://git-scm.com/downloads and select your operating system.

> [!IMPORTANT]
>The CLI commands in this article were tested using Bash. If you use a different shell, you may encounter errors.

### Set up authentication with Azure and GitHub

Before you can set up a Prompt flow project with Azure Machine Learning, you need to set up authentication for Azure GitHub.

#### Create service principal

   Create one production service principal for this demo. You can add more depending on how many environments, you want to work on (development, production or both). Service principals can be created using one of the following methods:

1. Launch the [Azure Cloud Shell](https://shell.azure.com).

    > [!TIP]
    > The first time you've launched the Cloud Shell, you'll be prompted to create a storage account for the Cloud Shell.

1. If prompted, choose **Bash** as the environment used in the Cloud Shell. You can also change environments in the drop-down on the top navigation bar

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/cli-1.png" alt-text="Screenshot of the Cloud Shell with bash selected showing connections to the PowerShell terminal. " lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/cli-1.png":::

1. Copy the following bash commands to your computer and update the **projectName**, **subscriptionId**, and **environment** variables with the values for your project. This command will also grant the **Contributor** role to the service principal in the subscription provided. This is required for GitHub Actions to properly use resources in that subscription.

    ``` bash
    projectName="<your project name>"
    roleName="Contributor"
    subscriptionId="<subscription Id>"
    environment="<Prod>" #First letter should be capitalized
    servicePrincipalName="Azure-ARM-${environment}-${projectName}"
    # Verify the ID of the active subscription
    echo "Using subscription ID $subscriptionID"
    echo "Creating SP for RBAC with name $servicePrincipalName, with role $roleName and in scopes     /subscriptions/$subscriptionId"
    az ad sp create-for-rbac --name $servicePrincipalName --role $roleName --scopes /subscriptions/$subscriptionId --sdk-auth 
    echo "Please ensure that the information created here is properly save for future use."
    ```

1. Copy your edited commands into the Azure Shell and run them (**Ctrl** + **Shift** + **v**).

1. After running these commands, you'll be presented with information related to the service principal. Save this information to a safe location, you'll use it later in the demo to configure GitHub.

    ```json

      {
      "clientId": "<service principal client id>",  
      "clientSecret": "<service principal client secret>",
      "subscriptionId": "<Azure subscription id>",  
      "tenantId": "<Azure tenant id>",
      "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
      "resourceManagerEndpointUrl": "https://management.azure.com/", 
      "activeDirectoryGraphResourceId": "https://graph.windows.net/", 
      "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
      "galleryEndpointUrl": "https://gallery.azure.com/",
      "managementEndpointUrl": "https://management.core.windows.net/" 
      }
    ```

1. Copy all of this output, braces included. Save this information to a safe location, it will be use later in the demo to configure GitHub repo.

1. Close the Cloud Shell once the service principals are created.

### Setup GitHub repo

1. Fork example repo. [LLMOps Demo Template Repo](https://github.com/Azure/llmops-gha-demo/fork) in your GitHub organization. This repo has reusable LLMOps code that can be used across multiple projects. 

### Add secret to GitHub repo

1. From your GitHub project, select **Settings**:

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/github-settings.png" alt-text="Screenshot of the GitHub menu bar on a GitHub project with settings selected. " lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/github-settings.png":::

1. Then select **Secrets and variables**, then **Actions**:

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/github-secrets.png" alt-text="Screenshot of on GitHub showing the security settings with security and actions highlighted." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/github-secrets.png":::

1. Select **New repository secret**. Name this secret **AZURE_CREDENTIALS** and paste the service principal output as the content of the secret. Select **Add secret**.

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/github-secrets-string.png" alt-text="Screenshot of GitHub Action secrets when creating a new secret. " lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/github-secrets-string.png":::

1. Add each of the following additional GitHub secrets using the corresponding values from the service principal output as the content of the secret:  

    - **GROUP**: \<Resource Group Name\>
    - **WORKSPACE**: \<Azure ML Workspace Name\>
    - **SUBSCRIPTION**: \<Subscription ID\>

    |Variable  | Description  |
    |---------|---------|
    |GROUP     |      Name of resource group    |
    |SUBSCRIPTION     |    Subscription ID of your workspace    |
    |WORKSPACE     |     Name of Azure Machine Learning workspace     |  

> [!NOTE]
> This finishes the prerequisite section and the deployment of the solution accelerator can happen accordingly.

## Setup connections for prompt flow

Connection helps securely store and manage secret keys or other sensitive credentials required for interacting with LLM and other external tools, for example, Azure Content Safety.

In this guide, we'll use flow `web-classification`, which uses connection `azure_open_ai_connection` inside, we need to set up the connection if we haven’t added it before.

Go to workspace portal, select `Prompt flow` -> `Connections` -> `Create` -> `Azure OpenAI`, then follow the instruction to create your own connections. To learn more, see [connections](concept-connections.md).

## Setup runtime for Prompt flow 
Prompt flow's runtime provides the computing resources required for the application to run, including a Docker image that contains all necessary dependency packages.

In this guide, we will use a runtime to run your prompt flow. You need to create your own [Prompt flow runtime](how-to-create-manage-runtime.md)

Go to workspace portal, select **Prompt flow** -> **Runtime** -> **Add**, then follow the instruction to create your own connections

## Setup variables for prompt flow and GitHub Actions

Clone repo to your local machine.

```bash
    git clone https://github.com/<user-name>/llmops-gha-demo
 ```

### Update workflow to connect to your Azure Machine Learning workspace

1. Update `run-eval-pf-pipeline.yml` and `deploy-pf-online-endpoint-pipeline.yml` to connect to your Azure Machine Learning workspace.
    You'll need to update the CLI setup file variables to match your workspace.

1. In your cloned repository, go to `.github/workflow/`.
1. Verify `env` section in the `run-eval-pf-pipeline.yml` and `deploy-pf-online-endpoint-pipeline.yml` refers to the workspace secrets you added in the previous step.

### Update run.yml with your connections and runtime

You'll use a `run.yml` file to deploy your Azure Machine Learning pipeline. This is a flow run definition. You only need to make this update if you're using a name other than `pf-runtime` for your [prompt flow runtime](how-to-create-manage-runtime.md). You'll also need to update all the `connections` to match the connections in your Azure Machine Learning workspace and `deployment_name` to match the name of your GPT 3.5 Turbo deployment associate with that connection.

1. In your cloned repository, open `web-classification/run.yml` and `web-classification/run_evaluation.yml` 
1. Each time you see `runtime: <runtime-name>`, update the value of `<runtime-name>` with your runtime name.
1. Each time you see `connection: Default_AzureOpenAI`, update the value of `Default_AzureOpenAI`  to match the connection name in your Azure Machine Learning workspace.
1. Each time you see `deployment_name: gpt-35-turbo-0301`, update the value of `gpt-35-turbo-0301` with the name of your GPT 3.5 Turbo deployment associate with that connection.

## Sample prompt run, evaluation and deployment scenario

This is a flow demonstrating multi-class classification with LLM. Given an url, it will classify the url into one web category with just a few shots, simple summarization and classification prompts.

This training pipeline contains the following steps:

**Run prompts in flow:**

- Compose a classification flow with LLM.
- Feed few shots to LLM classifier.
- Upload prompt test dataset.
- Bulk run prompt flow based on dataset.

**Evaluate results:**

- Upload ground test dataset
- Evaluation of the bulk run result and new uploaded ground test dataset

**Register prompt flow LLM app:**

- Check in logic, Customer defined logic (accuracy rate, if >=90% you can deploy)

**Deploy and test LLM app:**

- Deploy the PF as a model to production
- Test the model/prompt flow real-time endpoint.

## Run and evaluate prompt flow in Azure Machine Learning with GitHub Actions

Using a [GitHub Action workflow](../how-to-github-actions-machine-learning.md#step-5-run-your-github-actions-workflow) we'll trigger actions to run a Prompt Flow job in Azure Machine Learning.

This pipeline will start the prompt flow run and evaluate the results. When the job is complete, the prompt flow model will be registered in the Azure Machine Learning workspace and be available for deployment.

1. In your GitHub project repository, select **Actions**  

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/github-actions.png" alt-text="Screenshot of GitHub project repository with Action page selected. " lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/github-actions.png":::

1. Select the `run-eval-pf-pipeline.yml` from the workflows listed on the left and the select **Run Workflow** to execute the Prompt flow run and evaluate workflow. This will take several minutes to run.

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/github-training-pipeline.png" alt-text="Screenshot of the pipeline run in GitHub. " lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/github-training-pipeline.png":::

1. The workflow will only register the model for deployment, if the accuracy of the classification is greater than 60%. You can adjust the accuracy threshold in the `run-eval-pf-pipeline.yml` file in the `jobMetricAssert` section of the workflow file. The section should look like:

    ```yaml
    id: jobMetricAssert
    run: |
        export ASSERT=$(python promptflow/llmops-helper/assert.py result.json 0.6)
    ```

    You can update the current `0.6` number to fit your preferred threshold.

1. Once completed, a successful run and all test were passed, it will register the Prompt Flow model in the Azure Machine Learning workspace.
  
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/github-training-step.png" alt-text="Screenshot of training step in GitHub Actions. " lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/github-training-step.png":::

    > [!NOTE]
    > If you want to check the output of each individual step, for example to view output of a failed run, select a job output, and then select each step in the job to view any output of that step.

With the Prompt flow model registered in the Azure Machine Learning workspace, you're ready to deploy the model for scoring.

## Deploy prompt flow in Azure Machine Learning with GitHub Actions

This scenario includes prebuilt workflows for deploying a model to an endpoint for real-time scoring. You may run the workflow to test the performance of the model in your Azure Machine Learning workspace.

### Online endpoint  

1. In your GitHub project repository, select **Actions**.  

1. Select the **deploy-pf-online-endpoint-pipeline** from the workflows listed on the left and select **Run workflow** to execute the online endpoint deployment pipeline workflow. The steps in this pipeline will create an online endpoint in your Azure Machine Learning workspace, create a deployment of your model to this endpoint, then allocate traffic to the endpoint.

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/github-online-endpoint.png" alt-text="Screenshot of GitHub Actions for online endpoint showing deploy prompts with prompt flow workflow." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/github-online-endpoint.png":::

1. Once completed, you'll find the online endpoint deployed in the Azure Machine Learning workspace and available for testing.

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/web-class-online-endpoint.png" alt-text="Screenshot of Azure Machine Learning studio on the endpoints page showing real time endpoint tab." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/web-class-online-endpoint.png":::

1. To test this deployment, go to the **Endpoints** tab in your Azure Machine Learning workspace, select the endpoint and select the **Test** tab. You can use the sample input data located in the cloned repo at `/deployment/sample-request.json` to test the endpoint.

    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/online-endpoint-test.png" alt-text="Screenshot of Azure Machine Learning studio on the endpoints page showing how to test the endpoint." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/online-endpoint-test.png":::

> [!NOTE] 
> Make sure you have already [granted permissions to the endpoint](how-to-deploy-for-real-time-inference.md#grant-permissions-to-the-endpoint) before you test or consume the endpoint.

## Moving to production

This example scenario can be run and deployed both for Dev and production branches and environments. When you're satisfied with the performance of the prompt evaluation pipeline, Prompt Flow model, deployment in testing, development pipelines, and models can be replicated and deployed in the production environment.

The sample Prompt flow run and evaluation and GitHub workflows can be used as a starting point to adapt your own prompt engineering code and data.

## Clean up resources

1. If you're not going to continue to use your pipeline, delete your GitHub project.
1. In Azure portal, delete your resource group and Azure Machine Learning instance.

## Next steps

- [Install and set up Python SDK v2](https://aka.ms/sdk-v2-install)
- [Install and set up Python CLI v2](../how-to-configure-cli.md)
