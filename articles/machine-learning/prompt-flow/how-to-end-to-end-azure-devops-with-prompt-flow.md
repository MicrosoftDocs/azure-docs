---
title: Set up LLMOps with Azure DevOps
titleSuffix: Azure Machine Learning
description: Learn how to set up a sample LLMOps environment and pipeline on Azure DevOps for prompt flow project
services: machine-learning
author: jiaochenlu
ms.author: chenlujiao
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
ms.reviewer: larryfr
ms.date: 10/24/2023
ms.custom: cli-v2, sdk-v2
---

# Set up end-to-end LLMOps with prompt flow and Azure DevOps (preview)

Large Language Operations, or **LLMOps**, has become the cornerstone of efficient prompt engineering and LLM-infused application development and deployment. As the demand for LLM-infused applications continues to soar, organizations find themselves in need of a cohesive and streamlined process to manage their end-to-end lifecycle.

Azure Machine Learning allows you to integrate with [Azure DevOps pipeline](/azure/devops/pipelines/) to automate the LLM-infused application development lifecycle with prompt flow. 

In this article, you can learn **LLMOps with prompt flow** by following the end-to-end practice we provided, which help you build LLM-infused applications using prompt flow and Azure DevOps. It provides the following features:

* Centralized Code Hosting
* Lifecycle Management
* Variant and Hyperparameter Experimentation
* A/B Deployment
* Many-to-many dataset/flow relationships
* Multiple Deployment Targets
* Comprehensive Reporting
* Offers **configuration based development**. No need to write extensive boiler-plate code.
* Provides **execution of both prompt experimentation** and evaluation locally as well on cloud.


> [!TIP]
> We recommend you understand how we integrate [LLMOps with prompt flow](how-to-integrate-with-llm-app-devops.md).

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- An Azure Machine Learning workspace.
- Git running on your local machine.
- An [organization](/azure/devops/organizations/accounts/create-organization) in Azure DevOps.
- [Azure DevOps project](../how-to-devops-machine-learning.md) that will host the source repositories and pipelines.
- The [Terraform extension for Azure DevOps](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks) if you're using Azure DevOps + Terraform to spin up infrastructure


> [!NOTE]
>
>Git version 2.27 or newer is required. For more information on installing the Git command, see https://git-scm.com/downloads and select your operating system

> [!IMPORTANT]
>The CLI commands in this article were tested using Bash. If you use a different shell, you may encounter errors.

## Set up authentication with Azure and DevOps

Before you can set up an MLOps project with Azure Machine Learning, you need to set up authentication for Azure DevOps.

### Create service principal
   For the use of the demo, the creation of one or two service principles is required, depending on how many environments, you want to work on (Dev or Prod or Both). These principles can be created using one of the following methods:

# [Create from Azure Cloud Shell](#tab/azure-shell)

1. Launch the [Azure Cloud Shell](https://shell.azure.com).

    > [!TIP]
    > The first time you've launched the Cloud Shell, you'll be prompted to create a storage account for the Cloud Shell.

1. If prompted, choose **Bash** as the environment used in the Cloud Shell. You can also change environments in the drop-down on the top navigation bar
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/PS_CLI1_1.png" alt-text="Screenshot of the cloud shell environment dropdown. "lightbox = "/media/how-to-end-to-end-llmops-with-prompt-flow/PS_CLI1_1.png":::

1. Copy the following bash commands to your computer and update the** projectName**,** subscriptionId**, and **environment variables** with the values for your project. If you're creating both a Dev and Prod environment, you'll need to run this script once for each environment, creating a service principal for each. This command will also grant the **Contributor** role to the service principal in the subscription provided. This is required for Azure DevOps to properly use resources in that subscription.
     ``` bash
        projectName="<your project name>"
        roleName="Contributor"
        subscriptionId="<subscription Id>"
        environment="<Dev|Prod>" #First letter should be capitalized
        servicePrincipalName="Azure-ARM-${environment}-${projectName}"
        # Verify the ID of the active subscription
        echo "Using subscription ID $subscriptionID"
        echo "Creating SP for RBAC with name $servicePrincipalName, with role $roleName and in scopes     /subscriptions/$subscriptionId"
        az ad sp create-for-rbac --name $servicePrincipalName --role $roleName --scopes /subscriptions/$subscriptionId
        echo "Please ensure that the information created here is properly save for future use."
     ```

1. Copy your edited commands into the Azure Shell and run them (Ctrl + Shift + v).

1. After running these commands, you'll be presented with information related to the service principal. Save this information to a safe location, it will be use later in the demo to configure Azure DevOps.
    
     ```json
     {
       "appId": "<application id>",
       "displayName": "Azure-ARM-dev-Sample_Project_Name",
       "password": "<password>",
       "tenant": "<tenant id>"
     }
     ```

1. Repeat **Step 3** if you're creating service principals for Dev and Prod environments. For this demo, we'll be creating only one environment, which is Prod.

1. Close the Cloud Shell once the service principals are created.

# [Create from Azure portal](#tab/azure-portal)

1. Navigate to [Azure App Registrations](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType~/null/sourceTypeMicrosoft_AAD_IAM)

1. Select **New Registration**.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/SP-setup-ownership-tab.png" alt-text="Screenshot of service principal setup." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/SP-setup-ownership-tab.png":::

1. Go through the process of creating a Service Principle (SP) selecting **Accounts in any organizational directory (Any Microsoft Entra directory - Multitenant)** and name it **Azure-ARM-Dev-ProjectName**. Once created, repeat and create a new SP named **Azure-ARM-Prod-ProjectName**. Replace **ProjectName** with the name of your project so that the service principal can be uniquely identified.

1. Go to **Certificates & Secrets** and add for each SP **New client secret**, then store the value and secret separately.

1. To assign the necessary permissions to these principals, select your respective [subscription](https://portal.azure.com/#view/Microsoft_Azure_BillingSubscriptionsBlade?) and go to IAM. Select **+Add** then select **Add Role Assignment**.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/SP-setup-iam-tab.png" alt-text="Screenshot of the add role assignment page." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/SP-setup-iam-tab.png":::

1. Select Contributor and add members selecting + Select Members. Add the member **Azure-ARM-Dev-ProjectName** as create before.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/SP-setup-role-assignment.png" alt-text="Screenshot of the add role assignment selection" lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/SP-setup-role-assignment.png":::

1. Repeat step here, if you deploy Dev and Prod into the same subscription, otherwise change to the prod subscription and repeat with **Azure-ARM-Prod-ProjectName**. The basic SP setup is successfully finished.

---

### Set up Azure DevOps

1. Navigate to [Azure DevOps](https://go.microsoft.com/fwlink/?LinkId=2014676&githubsi=true&clcid=0x409&WebUserId=2ecdcbf9a1ae497d934540f4edce2b7d). 

1. Select **create a new project** (Name the project mlopsv2 for this tutorial).
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/ado-create-project.png" alt-text="Screenshot of ADO Project" lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/ado-create-project.png":::

1. In the project under **Project Settings** (at the bottom left of the project page) select **Service Connections**.

1. Select **Create Service Connection**.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/create_first_service_connection.png" alt-text="Screenshot of ADO New Service connection button." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/create_first_service_connection.png":::

1. Select **Azure Resource Manager**, select **Next**, select **Service principal (manual)**, select **Next** and select the **Scope Level Subscription**.
    - Subscription Name - Use the name of the subscription where your service principal is stored.
    - Subscription Id - Use the `subscriptionId` you used in **Step 1** input as the Subscription ID
    - Service Principal Id - Use the `appId` from **Step 1** output as the Service Principal ID
    - Service principal key - Use the `password` from **Step 1** output as the Service Principal Key
    - Tenant ID - Use the `tenant` from **Step 1** output as the Tenant ID

1. Name the service connection **Azure-ARM-Prod**.

1. Select **Grant access permission to all pipelines**, then select **Verify and Save**.

The Azure DevOps setup is successfully finished.

### Set up source repository with Azure DevOps

1. Open the project you created in [Azure DevOps](https://dev.azure.com/)

1. Open the Repos section and select **Import Repository**
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/import_repo_first_time.png" alt-text="Screenshot of Azure DevOps import repo first time." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/import_repo_first_time.png":::

1. Enter https://github.com/Azure/mlops-v2-ado-demo into the Clone URL field. Select import at the bottom of the page
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/import_repo_Git_template.png" alt-text="Screenshot of Azure DevOps import MLOps demo repo." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/import_repo_Git_template.png":::

1. Open the **Project settings** at the bottom of the left hand navigation pane

1. Under the Repos section, select **Repositories**. Select the repository you created in previous step Select the **Security** tab

1. Under the User permissions section, select the **mlopsv2 Build Service** user. Change the permission **Contribute** permission to **Allow** and the Create branch permission to **Allow**.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/ado-permissions-repo.png" alt-text="Screenshot of Azure DevOps permissions." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/ado-permissions-repo.png":::

1. Open the **Pipelines** section in the left hand navigation pane and select on the 3 vertical dots next to the **Create Pipelines** button. Select **Manage Security**.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/ado-open-pipelinesSecurity.png" alt-text="Screenshot of Pipeline security." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/ado-open-pipelinesSecurity.png":::

1. Select the **mlopsv2 Build Service** account for your project under the Users section. Change the permission **Edit build pipeline** to **Allow**
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/ado-add-pipelinesSecurity.png" alt-text="Screenshot of Add security." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/ado-add-pipelinesSecurity.png":::

> [!NOTE]
> This finishes the prerequisite section and the deployment of the solution accelerator can happen accordingly.

### Setup connections for prompt flow

Connection helps securely store and manage secret keys or other sensitive credentials required for interacting with LLM and other external tools, for example, Azure Content Safety.

Go to workspace portal, select `Prompt flow` -> `Connections` -> `Create` -> `Azure OpenAI`, then follow the instruction to create your own connections. To learn more, see [connections](../prompt-flow/concept-connections.md).

### Setup runtime for prompt flow

Prompt flow's runtime provides the computing resources required for the application to run, including a Docker image that contains all necessary dependency packages.

In this guide, we will use a runtime to run your prompt flow. You need to create your own [prompt flow runtime](../prompt-flow/how-to-create-manage-runtime.md).

Go to workspace portal, select `Prompt flow` -> `Runtime` -> `Add`, then follow the instruction to create your own connections.


## Practice with the end-to-end solution

In order to augment LLM-infused applications with LLMOps and engineering rigor, we provide a solution "**LLMOps with prompt flow**", which serves as a valuable resource. Its primary objective is to provide assistance in the development of such applications, leveraging the capabilities of prompt flow and LLMOps.

### Overview of the solution

LLMOps with prompt flow is a "LLMOps template and guidance" to help you build LLM-infused apps using prompt flow. It provides the following features:

- **Centralized Code Hosting**: This repo supports hosting code for multiple flows based on prompt flow, providing a single repository for all your flows. Think of this platform as a single repository where all your prompt flow code resides. It's like a library for your flows, making it easy to find, access, and collaborate on different projects.

- **Lifecycle Management**: Each flow enjoys its own lifecycle, allowing for smooth transitions from local experimentation to production deployment.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/pipeline.png" alt-text="Screenshot of pipeline." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/pipeline.png":::

- **Variant and Hyperparameter Experimentation**: Experiment with multiple variants and hyperparameters, evaluating flow variants with ease. Variants and hyperparameters are like ingredients in a recipe. This platform allows you to experiment with different combinations of variants across multiple nodes in a flow.

- **Multiple Deployment Targets**: The repo supports deployment of flows to Kubernetes, Azure Managed computes driven through configuration ensuring that your flows can scale as needed.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/endpoints.png" alt-text="Screenshot of endpoints." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/endpoints.png":::

- **A/B Deployment**: Seamlessly implement A/B deployments, enabling you to compare different flow versions effortlessly. Just as in traditional A/B testing for websites, this platform facilitates A/B deployment for prompt flow flows. This means you can effortlessly compare different versions of a flows in a real-world setting to determine which performs best.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/a-b-deployments.png" alt-text="Screenshot of deployments." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/a-b-deployments.png":::

- **Many-to-many dataset/flow relationships**: Accommodate multiple datasets for each standard and evaluation flow, ensuring versatility in flow test and evaluation. The platform is designed to accommodate multiple datasets for each flow.

- **Comprehensive Reporting**: Generate detailed reports for each variant configuration, allowing you to make informed decisions. Provides detailed Metric collection, experiment and variant bulk runs for all runs and experiments, enabling data-driven decisions in csv as well as HTML files.
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/variants.png" alt-text="Screenshot of flow variants report." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/variants.png.png":::
    :::image type="content" source="./media/how-to-end-to-end-llmops-with-prompt-flow/metrics.png" alt-text="Screenshot of metrics report." lightbox = "./media/how-to-end-to-end-llmops-with-prompt-flow/metrics.png":::

Other features for customization:
- Offers **BYOF** (bring-your-own-flows). A **complete platform** for developing multiple use-cases related to LLM-infused applications.

- Offers **configuration based development**. No need to write extensive boiler-plate code.

- Provides execution of both **prompt experimentation and evaluation** locally as well on cloud.

- Provides **notebooks for local evaluation** of the prompts. Provides library of functions for local experimentation.

- Endpoint testing within pipeline after deployment to check its availability and readiness.

- Provides optional Human-in-loop to validate prompt metrics before deployment.

LLMOps with prompt flow provides capabilities for both simple as well as complex LLM-infused apps. It is completely customizable to the needs of the application.

### Local practice

1. **Clone the Repository**: To harness the capabilities of the practice and execution, you can get started by cloning the [example Github repository](https://github.com/microsoft/llmops-promptflow-template).

    ```bash
    git clone https://github.com/microsoft/llmops-promptflow-template.git
    ```

2. **Setup env file**: Create .env file at top folder level and provide information for items mentioned. 
    1. Add **runtime** name created in [Setup runtime for prompt flow](#setup-runtime-for-prompt-flow) step.
    1. Add as many **connection** names as needed, whish you have created in [Setup connections for prompt flow](#setup-connections-for-prompt-flow) step:
    ```bash
    subscription_id=
    resource_group_name=
    workspace_name=
    runtime_name=
    experiment_name=
    <<connection name>>={ 
        "api_key": "",
        "api_base": "",
        "api_type": "azure",
        "api_version": "2023-03-15-preview"
    }

    ```
3. Prepare the **local conda or virtual environment** to install the dependencies.
    ```bash
    python -m pip install promptflow promptflow-tools promptflow-sdk jinja2 promptflow[azure] openai promptflow-sdk[builtins]

    ```
4. Bring or write **your flows** into the template based on documentation [here](https://github.com/microsoft/llmops-promptflow-template/blob/main/docs/how_to_setup.md).

5. Write lpython scripts in notebooks folder similar to provided examples there.

More details on how to use the template can be found in the [Github repository](https://github.com/microsoft/llmops-promptflow-template).


## Next steps
* [LLMOps wit prompt flow template](https://github.com/microsoft/llmops-promptflow-template) on Github
* [prompt flow open source repository](https://github.com/microsoft/promptflow)
* [Install and set up Python SDK v2](https://aka.ms/sdk-v2-install)
* [Install and set up Python CLI v2](../how-to-configure-cli.md)
* [Azure MLOps (v2) solution accelerator](https://github.com/Azure/mlops-v2) on GitHub






