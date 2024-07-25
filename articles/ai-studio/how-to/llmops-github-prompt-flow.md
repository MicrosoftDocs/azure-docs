---
title: LLMOps with prompt flow and GitHub in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to set up a LLMOps environment and workflows in Github for prompt flow project using Azure AI Studio.
services: azure-ai-studio
author: ritesh-modi
ms.author: rimod
ms.service: azure-ai-studio
ms.topic: how-to
ms.reviewer: lagayhar
ms.custom:
  - cli-v2
  - sdk-v2
  - ignite-2024
  - build-2024
---

# Elevating LLMOps with Prompt Flow and GitHub: A Unified Strategy for AI Workflows

Large Language Operations, or LLMOps, is the cornerstone of efficient prompt engineering and LLM-infused application development and deployment. As the demand for LLM-infused applications continues to soar, organizations find themselves in need of a cohesive and streamlined process to manage their end-to-end lifecycle.

Azure AI Studio allows you to integrate with GitHub to automate the LLM-infused application development lifecycle with prompt flow.

Azure AI Studio Prompt Flow provides a streamlined and structured approach to developing LLM-infused applications. Its well-defined process and lifecycle guides you through the process of building, testing, optimizing, and deploying flows, culminating in the creation of fully functional LLM-infused solutions.

## LLMOps Prompt Flow Features

LLMOps with prompt flow is a "LLMOps template and guidance" to help you build LLM-infused apps using prompt flow. It provides the following features:

- This template can be used for both **Azure AI Studio and Azure Machine Learning**.

- It can be used for both **AZURE and LOCAL execution**.

- It supports all types of flow - **Python Class flows, Function flows and YAML flows**.

- It supports **Github, Azure DevOps and Jenkins CI/CD orchestration**.

- It supports pure **python based Evaluation** as well using promptflow-evals package.

- It supports INNER-LOOP Experimentation and Evaluation.

- It supports OUTER-LOOP Deployment and Inferencing.

- It supports **Centralized Code Hosting** for multiple flows based on prompt flow, providing a single repository for all your flows. Think of this platform as a single repository where all your prompt flow code resides. It's like a library for your flows, making it easy to find, access, and collaborate on different projects.

- Each flow enjoys its own **Lifecycle Management**, allowing for smooth transitions from local experimentation to production deployment.
    :::image type="content" source="../media/prompt-flow/llmops/workflow.png" alt-text="Screenshot of workflow." lightbox = "../media/prompt-flow/llmops/workflow.png":::

- Experiment with multiple **Variant and Hyperparameter Experimentation**, evaluating flow variants with ease. Variants and hyperparameters are like ingredients in a recipe. This platform allows you to experiment with different combinations of variants across multiple nodes in a flow.

- The repo supports deployment of flows to **Azure App Services, Kubernetes, Azure Managed computes** driven through configuration ensuring that your flows can scale as needed. It also generates **Docker images** infused with Flow compute session and your flows for deployment to **any target platform and Operating system** supporting Docker.
    :::image type="content" source="../media/prompt-flow/llmops/endpoints.png" alt-text="Screenshot of endpoints." lightbox = "../media/prompt-flow/llmops/endpoints.png":::

- Seamlessly implement **A/B Deployment**, enabling you to compare different flow versions effortlessly. As in traditional A/B testing for websites, this platform facilitates A/B deployment for prompt flow. This means you can effortlessly compare different versions of a flow in a real-world setting to determine which performs best.
    :::image type="content" source="../media/prompt-flow/llmops/a-b-deployments.png" alt-text="Screenshot of deployments." lightbox = "../media/prompt-flow/llmops/a-b-deployments.png":::

- Accommodates **Many-to-many dataset/flow relationships** for each standard and evaluation flow, ensuring versatility in flow test and evaluation. The platform is designed to accommodate multiple datasets for each flow.

- It supports **Conditional Data and Model registration**  by creating a new version for dataset in Azure AI Studio Data Asset and flows in model registry only when there's a change in them, not otherwise.

- Generates **Comprehensive Reporting** for each **variant configuration**, allowing you to make informed decisions. Provides detailed Metric collection, experiment, and variant bulk runs for all runs and experiments, enabling data-driven decisions in csv as well as HTML files.
    :::image type="content" source="../media/prompt-flow/llmops/variants.png" alt-text="Screenshot of flow variants report." lightbox = "../media/prompt-flow/llmops/variants.png":::

Other features for customization:
- Offers **BYOF** (bring-your-own-flows). A **complete platform** for developing multiple use-cases related to LLM-infused applications.

- Offers **configuration based development**. No need to write extensive boiler-plate code.

- Provides execution of both **prompt experimentation and evaluation** locally as well on cloud.

- Endpoint testing within workflow after deployment to check its availability and readiness.

- Provides optional Human-in-loop to validate prompt metrics before deployment.

LLMOps with prompt flow provides capabilities for both simple as well as complex LLM-infused apps. It's customizable to the needs of the application.

## LLMOps Stages

The lifecycle comprises four distinct stages:

1. **Initialization:** Clearly define the business objective, gather relevant data samples, establish a basic prompt structure, and craft a flow that enhances its capabilities.

2. **Experimentation:** Apply the flow to sample data, assess the prompt's performance, and refine the flow as needed. Continuously iterate until satisfied with the results.

3. **Evaluation & Refinement:** Benchmark the flow's performance using a larger dataset, evaluate the prompt's effectiveness, and make refinements accordingly. Progress to the next stage if the results meet the desired standards.

4. **Deployment:** Optimize the flow for efficiency and effectiveness, deploy it in a production environment including A/B deployment, monitor its performance, gather user feedback, and use this information to further enhance the flow.

By adhering to this structured methodology, Prompt Flow empowers you to confidently develop, rigorously test, fine-tune, and deploy flows, leading to the creation of robust and sophisticated AI applications. 

LLMOps Prompt Flow template formalizes this structured methodology using code-first approach and helps you build LLM-infused apps using Prompt Flow using tools and process relevant to Prompt Flow. It offers a range of features including Centralized Code Hosting, Lifecycle Management, Variant and Hyperparameter Experimentation, A/B Deployment, reporting for all runs and experiments and more.

The repository for this article is available at [LLMOps with Prompt flow template.](https://github.com/microsoft/llmops-promptflow-template)

## LLMOps process Flow

:::image type="content" source="../media/prompt-flow/llmops/llmops-studio-ai-promptflow.svg" alt-text="Screenshot of LLMOps prompt flow Process." lightbox = "../media/prompt-flow/llmops/llmops-studio-ai-promptflow.svg":::

1. The prompt engineer/data scientist opens a feature branch where they work on the specific task or feature. The prompt engineer/data scientist iterates on the flow using prompt flow for Microsoft Visual Studio Code, periodically committing changes and pushing those changes to the feature branch.

2. Once local development and experimentation are completed, the prompt engineer/data scientist opens a pull request from the Feature branch to the Main branch. The pull request (PR) triggers a PR workflow. This workflow runs fast quality checks that should include:

    1. Execution of experimentation flows
    2. Execution of configured unit tests
    3. Compilation of the codebase
    4. Static code analysis

3. The workflow can contain a step that requires at least one team member to manually approve the PR before merging. The approver can't be the committer and they mush have prompt flow expertise and familiarity with the project requirements. If the PR isn't approved, the merge is blocked. If the PR is approved, or there's no approval step, the feature branch is merged into the Main branch.

4. The merge to Main triggers the build and release process for the Development environment. Specifically:

    a. The CI workflow is triggered from the merge to Main. The CI workflow performs all the steps done in the PR workflow, and the following steps:
        1. Experimentation flow
        2. Evaluation flow
        3. Registers the flows in the AI Studio Registry when changes are detected
    b. The CD workflow is triggered after the completion of the CI workflow. This flow performs the following steps:
        1. Deploys the flow from the Machine Learning registry to a AI Studio Deployment
        2. Runs integration tests that target the online endpoint
        3. Runs smoke tests that target the online endpoint

5. An approval process is built into the release promotion process – upon approval, the CI & CD processes described in steps 4.a. & 4.b. are repeated, targeting the Test environment. Steps a. and b. are the same, except that user acceptance tests are run after the smoke tests in the Test environment.

6. The CI & CD processes described in steps 4.a. & 4.b. are run to promote the release to the Production environment after the Test environment is verified and approved.

7. After release into a live environment, the operational tasks of monitoring performance metrics and evaluating the deployed language models take place. This includes but isn't limited to:
    - Detecting data drifts
    - Observing the infrastructure
    - Managing costs
    - Communicating the model's performance to stakeholders

From here on, you can learn **LLMOps with prompt flow** by following the end-to-end samples we provided, which help you build LLM-infused applications using prompt flow and GitHub. Its primary objective is to provide assistance in the development of such applications, using the capabilities of prompt flow and LLMOps.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [Azure AI Studio](https://azure.microsoft.com/free/).
- An Azure AI Studio Hub and Project.
- Git running on your local machine.
- GitHub as the source control repository.


> [!NOTE]
>
>Git version 2.27 or newer is required. For more information on installing the Git command, see https://git-scm.com/downloads and select your operating system

> [!IMPORTANT]
>The CLI commands in this article were tested using Bash. If you use a different shell, you may encounter errors.


## Set up Prompt Flow

Prompt Flow uses connections resource to connect to endpoints like Azure OpenAI, OpenAI, or Azure AI Search and uses compute session for the execution of the flows. These resources should be created before executing the flows in Prompt Flow.

### Set up connections for prompt flow

Connections can be created through **prompt flow portal UI** or using the **REST API**. Follow the [guidelines](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/Azure_devops_how_to_setup.md#setup-connections-for-prompt-flow) to create connections for prompt flow. 


> [!NOTE]
>
> The sample flows use 'aoai' connection and connection named 'aoai' should be created to execute them.


## Set up GitHub Repository

There are multiple steps that should be undertaken for setting up LLMOps process using GitHub Repository.

### Fork and configure the repo

Follow the [guidelines](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/github_workflows_how_to_setup.md#set-up-github-repo) to create a forked repo in your GitHub organization. This repo uses two branches - `main` and `development` for code promotions and execution of workflows in lieu of changes to code in them.

### Set up authentication between GitHub and Azure

Follow the [guidelines](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/github_workflows_how_to_setup.md#set-up-authentication-with-azure-and-github) to use the earlier created Service Principal and set up authentication between GitHub repository and Azure Services. 

This step configures a GitHub Secret that stores the Service Principal information. The workflows in the repository can read the connection information using the secret name. This helps to configure GitHub workflow steps to connect to Azure automatically.


### Cloning the repo

Follow the [guidelines](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/github_workflows_how_to_setup.md#cloning-the-repo) to create a new local repository. 

This helps us create a new feature branch from development branch and incorporate changes.


## Test the workflows

Follow the [guidelines](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/github_workflows_how_to_setup.md#cloning-the-repos) to test the workflows. The steps are

1. Raise a PR(Pull Request) from a feature branch to development branch.
2. The PR workflow should execute automatically as result of branch policy configuration.
3. The PR is then merged to the development branch.
4. The associated 'dev' workflow is executed. This results in full CI and CD execution and result in provisioning or updating of existing Azure AI Studio Deployment. 

The test outputs should be similar to ones shown at [here](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/github_workflows_how_to_setup.md#example-prompt-run-evaluation-and-deployment-scenario).


## Local execution

To harness the capabilities of the **local execution**, follow these installation steps:

1. **Clone the Repository**: Begin by cloning the template's repository from its [GitHub repository](https://github.com/microsoft/llmops-promptflow-template.git).

```bash
git clone https://github.com/microsoft/llmops-promptflow-template.git
```

2. **Set up env file**: create .env file at top folder level and provide information for items mentioned. Some samples are shown next

```bash

SUBSCRIPTION_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_OPENAI_API_KEY=xxxxxxxxxxxxx
AZURE_OPENAI_ENDPOINT=https://xxxxxxx
MODEL_CONFIG_AZURE_ENDPOINT=https://xxxxxxx
MODEL_CONFIG_API_KEY=xxxxxxxxxxx
MAX_TOTAL_TOKEN=4096
AOAI_API_KEY=xxxxxxxxxx
AOAI_API_BASE=https://xxxxxxxxx
```
3. Prepare the local conda or virtual environment to install the dependencies.

```bash

python -m pip install -r ./.github/requirements/execute_job_requirements.txt

```

4. Change the value of `EXECUTION_TYPE` to `LOCAL` in `config.py` file located within `llmops/` directory.

```python

EXECUTION_TYPE = "LOCAL"

```

```bash

python -m llmops.common.prompt_pipeline --subscription_id xxxx --base_path math_coding --env_name dev --output_file run_id.txt --build_id 100

```

Evaluations can be run using the `prompt_eval.py` python script locally.

```bash
python -m llmops.common.prompt_eval --run_id run_id.txt --subscription_id xxxxx --base_path math_coding  --env_name dev  --build_id 100
```

5. Bring or write your flows into the template based on documentation [here](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/how_to_onboard_new_flows.md).

## Next steps
* [LLMOps with Prompt flow template](https://github.com/microsoft/llmops-promptflow-template/) on GitHub
* [LLMOps with Prompt flow template documentation](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/github_workflows_how_to_setup.md) on GitHub
* [FAQS for LLMOps with Prompt flow template](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/faqs.md)
* [Prompt flow open source repository](https://github.com/microsoft/promptflow)
* [Install and set up Python SDK v2](/python/api/overview/azure/ai-ml-readme)
