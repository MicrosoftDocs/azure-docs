---
title: Set up LLMOps with prompt flow and Azure DevOps
titleSuffix: Azure Machine Learning
description: Learn how to set up a sample LLMOps environment and pipeline on Azure DevOps for prompt flow project
services: machine-learning
author: jiaochenlu
ms.author: chenlujiao
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
ms.reviewer: lagayhar
ms.date: 10/24/2023
ms.custom:
  - cli-v2
  - sdk-v2
  - ignite-2023
---

# Set up end-to-end LLMOps with prompt flow and Azure DevOps (preview)

Large Language Operations, or **LLMOps**, has become the cornerstone of efficient prompt engineering and LLM-infused application development and deployment. As the demand for LLM-infused applications continues to soar, organizations find themselves in need of a cohesive and streamlined process to manage their end-to-end lifecycle.

Azure Machine Learning allows you to integrate with [Azure DevOps pipeline](/azure/devops/pipelines/) to automate the LLM-infused application development lifecycle with prompt flow.

Azure Machine Learning Prompt Flow provides a streamlined and structured approach to developing LLM-infused applications. Its well-defined process and lifecycle guides you through the process of building, testing, optimizing, and deploying flows, culminating in the creation of fully functional LLM-infused solutions.

## LLMOps Prompt Flow Features

LLMOps with prompt flow is a "LLMOps template and guidance" to help you build LLM-infused apps using prompt flow. It provides the following features:

- **Centralized Code Hosting**: This repo supports hosting code for multiple flows based on prompt flow, providing a single repository for all your flows. Think of this platform as a single repository where all your prompt flow code resides. It's like a library for your flows, making it easy to find, access, and collaborate on different projects.

- **Lifecycle Management**: Each flow enjoys its own lifecycle, allowing for smooth transitions from local experimentation to production deployment.
    :::image type="content" source="./media/how-to-end-to-end-azure-devops-with-prompt-flow/pipeline.png" alt-text="Screenshot of pipeline." lightbox = "./media/how-to-end-to-end-azure-devops-with-prompt-flow/pipeline.png":::

- **Variant and Hyperparameter Experimentation**: Experiment with multiple variants and hyperparameters, evaluating flow variants with ease. Variants and hyperparameters are like ingredients in a recipe. This platform allows you to experiment with different combinations of variants across multiple nodes in a flow.

- **Multiple Deployment Targets**: The repo supports deployment of flows to Kubernetes, Azure Managed computes driven through configuration ensuring that your flows can scale as needed.
    :::image type="content" source="./media/how-to-end-to-end-azure-devops-with-prompt-flow/endpoints.png" alt-text="Screenshot of endpoints." lightbox = "./media/how-to-end-to-end-azure-devops-with-prompt-flow/endpoints.png":::

- **A/B Deployment**: Seamlessly implement A/B deployments, enabling you to compare different flow versions effortlessly. Just as in traditional A/B testing for websites, this platform facilitates A/B deployment for prompt flow. This means you can effortlessly compare different versions of a flow in a real-world setting to determine which performs best.
    :::image type="content" source="./media/how-to-end-to-end-azure-devops-with-prompt-flow/a-b-deployments.png" alt-text="Screenshot of deployments." lightbox = "./media/how-to-end-to-end-azure-devops-with-prompt-flow/a-b-deployments.png":::

- **Many-to-many dataset/flow relationships**: Accommodate multiple datasets for each standard and evaluation flow, ensuring versatility in flow test and evaluation. The platform is designed to accommodate multiple datasets for each flow.

- **Comprehensive Reporting**: Generate detailed reports for each variant configuration, allowing you to make informed decisions. Provides detailed Metric collection, experiment and variant bulk runs for all runs and experiments, enabling data-driven decisions in csv as well as HTML files.
    :::image type="content" source="./media/how-to-end-to-end-azure-devops-with-prompt-flow/variants.png" alt-text="Screenshot of flow variants report." lightbox = "./media/how-to-end-to-end-azure-devops-with-prompt-flow/variants.png":::
    :::image type="content" source="./media/how-to-end-to-end-azure-devops-with-prompt-flow/metrics.png" alt-text="Screenshot of metrics report." lightbox = "./media/how-to-end-to-end-azure-devops-with-prompt-flow/metrics.png":::

Other features for customization:
- Offers **BYOF** (bring-your-own-flows). A **complete platform** for developing multiple use-cases related to LLM-infused applications.

- Offers **configuration based development**. No need to write extensive boiler-plate code.

- Provides execution of both **prompt experimentation and evaluation** locally as well on cloud.

- Provides **notebooks for local evaluation** of the prompts. Provides library of functions for local experimentation.

- Endpoint testing within pipeline after deployment to check its availability and readiness.

- Provides optional Human-in-loop to validate prompt metrics before deployment.

LLMOps with prompt flow provides capabilities for both simple as well as complex LLM-infused apps. It's completely customizable to the needs of the application.

## LLMOps Stages

The lifecycle comprises four distinct stages:

- **Initialization:** Clearly define the business objective, gather relevant data samples, establish a basic prompt structure, and craft a flow that enhances its capabilities.

- **Experimentation:** Apply the flow to sample data, assess the prompt's performance, and refine the flow as needed. Continuously iterate until satisfied with the results.

- **Evaluation & Refinement:** Benchmark the flow's performance using a larger dataset, evaluate the prompt's effectiveness, and make refinements accordingly. Progress to the next stage if the results meet the desired standards.

- **Deployment:** Optimize the flow for efficiency and effectiveness, deploy it in a production environment including A/B deployment, monitor its performance, gather user feedback, and use this information to further enhance the flow.

By adhering to this structured methodology, Prompt Flow empowers you to confidently develop, rigorously test, fine-tune, and deploy flows, leading to the creation of robust and sophisticated AI applications. 

LLMOps Prompt Flow template formalize this structured methodology using code-first approach and helps you build LLM-infused apps using Prompt Flow using tools and process relevant to Prompt Flow. It offers a range of features including Centralized Code Hosting, Lifecycle Management, Variant and Hyperparameter Experimentation, A/B Deployment, reporting for all runs and experiments and more.

The repository for this article is available at [LLMOps with Prompt flow template](https://github.com/microsoft/llmops-promptflow-template)

## LLMOps process Flow

    :::image type="content" source="./media/how-to-end-to-end-azure-devops-with-prompt-flow/llmops-pf-process.png" alt-text="LLMOps Prompt Flow Process." lightbox = "./media/how-to-end-to-end-azure-devops-with-prompt-flow/llmops-pf-process.png":::

1. This is the initialization stage. Here, flows are developed, data is prepared and curated and LLMOps related configuration files are updated.
2. After local development using Visual Studio Code along with Prompt Flow extension, a pull request is raised from feature branch to development branch. This results in executed the Build validation pipeline. It also executes the experimentation flows.
3. The PR is manually approved and code is merged to the development branch
4. After the PR is merged to the development branch, the CI pipeline for dev environment is executed. It executes both the experimentation and evaluation flows in sequence and registers the flows in Azure Machine Learning Registry apart from other steps in the pipeline. 
5. After the completion of CI pipeline execution, a CD trigger ensures the execution of CD pipeline that deploys the standard flow from Azure Machine Learning Registry as an Azure Machine Learning online endpoint  and executed integration and smoke tests on the deployed flow. 
6. A release branch is created from the development branch or a pull request is raised from development branch to release branch.
7. The PR is manually approved and code is merged to the release branch. After the PR is merged to the release branch, the CI pipeline for prod environment is executed. It executes both the experimentation and evaluation flows in sequence and registers the flows in Azure Machine Learning Registry apart from other steps in the pipeline. 
8. After the completion of CI pipeline execution, a CD trigger ensures the execution of CD pipeline that deploys the standard flow from Azure Machine Learning Registry as an Azure Machine Learning online endpoint and executed integration and smoke tests on the deployed flow. 

From here on, you can learn **LLMOps with prompt flow** by following the end-to-end samples we provided, which help you build LLM-infused applications using prompt flow and Azure DevOps. Its primary objective is to provide assistance in the development of such applications, leveraging the capabilities of prompt flow and LLMOps.

> [!TIP]
> We recommend you understand how we integrate [LLMOps with prompt flow](how-to-integrate-with-llm-app-devops.md).

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- An Azure Machine Learning workspace.
- Git running on your local machine.
- An [organization](/azure/devops/organizations/accounts/create-organization) in Azure DevOps. Organization in Azure DevOps helps to collaborate, Plan and track your work and code defects, issues and Set up continuous integration and deployment.
- The [Terraform extension for Azure DevOps](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks) if you're using Azure DevOps + Terraform to spin up infrastructure


> [!NOTE]
>
>Git version 2.27 or newer is required. For more information on installing the Git command, see https://git-scm.com/downloads and select your operating system

> [!IMPORTANT]
>The CLI commands in this article were tested using Bash. If you use a different shell, you may encounter errors.


## Setup Prompt Flow

Prompt Flow uses connections resource to connect to endpoints like Azure OpenAI, OpenAI or Azure AI Search and uses runtime for the execution of the flows. These resources should be created before executing the flows in Prompt Flow.

### Set up connections for prompt flow

Connections can be created through Prompt Flow UI(https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/concept-connections?view=azureml-api-2) or using the REST API. Please follow the guidelines mentioned at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#setup-connections-for-prompt-flow to create connections for Prompt Flow. The sample flows use 'aoai' connection and connection named 'aoai' should be created to execute them.

### Setup compute and runtime for Prompt flow

Runtimes can be created through Prompt Flow UI(https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/concept-runtime?view=azureml-api-2) or using the REST API. Please follow the guidelines mentioned at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#setup-runtime-for-prompt-flow to setup compute and runtime for Prompt Flow. The same runtime name should be used in the LLMOps_config.json file explained later.


## Setup Azure Service Principal

An Azure `service principal` is a security identity that applications, services, and automation tools use to access Azure resources. It represents an application or service that needs to authenticate with Azure and access resources on your behalf. Please follow the guidelines mentioned at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#create-azure-service-principal to create Service Principal in Azure. This Service Principal is later  used to configure Azure DevOps Service connection and Azure DevOps pipelines to authenticate and connect to Azure Services. The jobs executed in Prompt Flow for both `experiment and evaluation runs` are under the identity of this Service Principal. Moreover, both the `compute` and `runtime` are created using the same Service Principal.

The setup provides `owner` permissions to the Service Principal. This is because the CD Pipeline automatically provides access to the newly provisioned Azure Machine Learning Endpoint access to Azure Machine Learning workspace for reading connections information. It also adds it to Azure Machine Learning Workspace associated key vault policy with `get` and `list` secret permissions. The owner permission can be changed to `contributor` level permissions by changing pipeline YAML code and removing the step related to permissions.


## Set up Azure DevOps

There are multiple steps that should be undertaken for setting up LLMOps process using Azure DevOps.

### Create new Azure DevOps project

Please follow the guidelines mentioned at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#create-new-azure-devops-project to create a new Azure DevOps project using Azure DevOps UI. 

### Set up authentication between Azure DevOps and Azure

Please follow the guidelines mentioned at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#set-up-authentication-with-azure-and-azure-devops to use the earlier created Service Principal and setup authentication between Azure DevOps and Azure Services. This step configures a new Azure DevOps Service Connection that stores the Service Principal information. The pipelines in the project can read the connection information using the connection name. This helps to configure Azure DevOps steps to connect to Azure automatically with basic configuration steps.


### Create an Azure DevOps Variable Group

Please follow the guidelines mentioned at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#create-an-azure-devops-variable-group to create a new Variable group and add a variable related to the Azure DevOps Service Connection. The Service principal name is available automatically as environment variable to the pipelines. 


### Configure Azure DevOps repository and pipelines

This repo uses two branches - `main` and `development` for code promotions and execution of pipelines in lieu of changes to code in them. Please follow the guidelines mentioned at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#configure-azure-devops-local-and-remote-repository to setup your own local as well as remote repository to use code from this repository.

The steps involves cloning both the `main and development branches` from the repository and associating the code to refer to the new Azure DevOps repository. Apart from code migration, pipelines - both PR and dev pipelines are configured such that they are executed automatically based on PR creation and merge triggers. The branch policy for development branch should also configured to execute PR pipeline for any PR raised on development branch from a feature branch. The 'dev' pipeline is executed when the PR is merged to the development branch. The 'dev' pipeline consists of both CI and CD phases.

There is also human in the loop implemented within the pipelines. After the CI phase in `dev` pipeline is executed, the CD phase follows after manual approval. The approval should happen from Azure DevOps pipeline build execution UI. The default time-out is 60 minutes after which the pipeline will be rejected and CD phase will not execute. Manually approving the execution will lead to execution of the CD steps of the pipeline. The manual approval is configured to send notifications to 'replace@youremail.com'. It should be replaced with an appropriate email Id.

## Test the pipelines

Please follow the guidelines mentioned at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#test-the-pipelines to test the pipelines. The steps are

1. Raise a PR(Pull Request) from a feature branch to development branch.
2. The PR pipeline should execute automatically as result of branch policy configuration.
3. The PR is then merged to the development branch.
4. The associated 'dev' pipeline is executed. This will result in full CI and CD execution and result in provisioning or updation of existing Azure Machine Learning Endpoints. 

The test outputs should be similar to ones shown at https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#example-prompt-run-evaluation-and-deployment-scenario


## Local execution

To harness the capabilities of the **local execution**, follow these installation steps:

1. **Clone the Repository**: Begin by cloning the template's repository from its [GitHub repository](https://github.com/microsoft/llmops-promptflow-template.git).

```bash
git clone https://github.com/microsoft/llmops-promptflow-template.git
```

2. **setup env file**: create .env file at top folder level and provide information for items mentioned. Add as many connection names as needed. All the flow examples in this repo uses AzureOpenAI connection named `aoai`. Add a line `aoai={"api_key": "","api_base": "","api_type": "azure","api_version": "2023-03-15-preview"}` with updated values for api_key and api_base. If additional connections with different names are used in your flows, they should be added accordingly. Currently, flow with AzureOpenAI as provider as supported. 

```bash

experiment_name=
connection_name_1={ "api_key": "","api_base": "","api_type": "azure","api_version": "2023-03-15-preview"}
connection_name_2={ "api_key": "","api_base": "","api_type": "azure","api_version": "2023-03-15-preview"}
```
3. Prepare the local conda or virtual environment to install the dependencies.

```bash

python -m pip install promptflow promptflow-tools promptflow-sdk jinja2 promptflow[azure] openai promptflow-sdk[builtins] python-dotenv

```

4. Bring or write your flows into the template based on documentation [here](./docs/how_to_onboard_new_flows.md).

5. Write python scripts similar to the provided examples in local_execution folder.

## Next steps
* [LLMOps with Prompt flow template](https://github.com/microsoft/llmops-promptflow-template) on GitHub
* [Prompt flow open source repository](https://github.com/microsoft/promptflow)
* [Install and set up Python SDK v2](/python/api/overview/azure/ai-ml-readme)
* [Install and set up Python CLI v2](../how-to-configure-cli.md)

