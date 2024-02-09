---
title: 'Tutorial: Run GitHub Actions runners and Azure Pipelines agents with Azure Container Apps jobs'
description: Learn to create self-hosted CI/CD runners and agents with jobs in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 06/01/2023
ms.author: cshoe
zone_pivot_groups: container-apps-jobs-self-hosted-ci-cd
---

# Tutorial: Deploy self-hosted CI/CD runners and agents with Azure Container Apps jobs

GitHub Actions and Azure Pipelines allow you to run CI/CD workflows with self-hosted runners and agents. You can run self-hosted runners and agents using event-driven Azure Container Apps [jobs](./jobs.md).

Self-hosted runners are useful when you need to run workflows that require access to local resources or tools that aren't available to a cloud-hosted runner. For example, a self-hosted runner in a Container Apps job allows your workflow to access resources inside the job's virtual network that isn't accessible to a cloud-hosted runner.

Running self-hosted runners as event-driven jobs allows you to take advantage of the serverless nature of Azure Container Apps. Jobs execute automatically when a workflow is triggered and exit when the job completes.

You only pay for the time that the job is running.

::: zone pivot="container-apps-jobs-self-hosted-ci-cd-github-actions"

In this tutorial, you learn how to run GitHub Actions runners as an [event-driven Container Apps job](jobs.md#event-driven-jobs).

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your self-hosted runner
> * Create a GitHub repository for running a workflow that uses a self-hosted runner
> * Build a container image that runs a GitHub Actions runner
> * Deploy the runner as a job to the Container Apps environment
> * Create a workflow that uses the self-hosted runner and verify that it runs

> [!IMPORTANT]
> Self-hosted runners are only recommended for *private* repositories. Using them with public repositories can allow dangerous code to execute on your self-hosted runner. For more information, see [Self-hosted runner security](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#self-hosted-runner-security).

::: zone-end

::: zone pivot="container-apps-jobs-self-hosted-ci-cd-azure-pipelines"

In this tutorial, you learn how to run Azure Pipelines agents as an [event-driven Container Apps job](jobs.md#event-driven-jobs).

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your self-hosted agent
> * Create an Azure DevOps organization and project
> * Build a container image that runs an Azure Pipelines agent
> * Use a manual job to create a placeholder agent in the Container Apps environment
> * Deploy the agent as a job to the Container Apps environment
> * Create a pipeline that uses the self-hosted agent and verify that it runs

> [!IMPORTANT]
> Self-hosted agents are only recommended for *private* projects. Using them with public projects can allow dangerous code to execute on your self-hosted agent. For more information, see [Self-hosted agent security](/azure/devops/pipelines/agents/linux-agent#permissions).

::: zone-end

> [!NOTE]
> Container apps and jobs don't support running Docker in containers. Any steps in your workflows that use Docker commands will fail when run on a self-hosted runner or agent in a Container Apps job.

## Prerequisites

- **Azure account**: If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).

- **Azure CLI**: Install the [Azure CLI](/cli/azure/install-azure-cli).
::: zone pivot="container-apps-jobs-self-hosted-ci-cd-azure-pipelines"
- **Azure DevOps organization**: If you don't have a DevOps organization with an active subscription, you [can create one for free](https://azure.microsoft.com/services/devops/).
::: zone-end

Refer to [jobs restrictions](jobs.md#jobs-restrictions) for a list of limitations.

## Setup

1. To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

    # [Bash](#tab/bash)
    ```bash
    az login
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az login
    ```

    ---

1. Ensure you're running the latest version of the CLI via the `upgrade` command.

    # [Bash](#tab/bash)
    ```bash
    az upgrade
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az upgrade
    ```

    ---

1. Install the latest version of the Azure Container Apps CLI extension.

    # [Bash](#tab/bash)
    ```bash
    az extension add --name containerapp --upgrade
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az extension add --name containerapp --upgrade
    ```

    ---

1. Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces if you haven't already registered them in your Azure subscription.

    # [Bash](#tab/bash)
    ```bash
    az provider register --namespace Microsoft.App
    az provider register --namespace Microsoft.OperationalInsights
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az provider register --namespace Microsoft.App
    az provider register --namespace Microsoft.OperationalInsights
    ```

    ---

1. Define the environment variables that are used throughout this article.

    ::: zone pivot="container-apps-jobs-self-hosted-ci-cd-github-actions"

    # [Bash](#tab/bash)
    ```bash
    RESOURCE_GROUP="jobs-sample"
    LOCATION="northcentralus"
    ENVIRONMENT="env-jobs-sample"
    JOB_NAME="github-actions-runner-job"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    $RESOURCE_GROUP="jobs-sample"
    $LOCATION="northcentralus"
    $ENVIRONMENT="env-jobs-sample"
    $JOB_NAME="github-actions-runner-job"
    ```

    ---

    ::: zone-end

    ::: zone pivot="container-apps-jobs-self-hosted-ci-cd-azure-pipelines"

    # [Bash](#tab/bash)
    ```bash
    RESOURCE_GROUP="jobs-sample"
    LOCATION="northcentralus"
    ENVIRONMENT="env-jobs-sample"
    JOB_NAME="azure-pipelines-agent-job"
    PLACEHOLDER_JOB_NAME="placeholder-agent-job"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    $RESOURCE_GROUP="jobs-sample"
    $LOCATION="northcentralus"
    $ENVIRONMENT="env-jobs-sample"
    $JOB_NAME="azure-pipelines-agent-job"
    $PLACEHOLDER_JOB_NAME="placeholder-agent-job"
    ```

    ---

    ::: zone-end

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary around container apps and jobs so they can share the same network and communicate with each other.

> [!NOTE]
> To create a Container Apps environment that's integrated with an existing virtual network, see [Provide a virtual network to an internal Azure Container Apps environment](vnet-custom-internal.md?tabs=bash).

1. Create a resource group using the following command.

    # [Bash](#tab/bash)
    ```bash
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az group create `
        --name "$RESOURCE_GROUP" `
        --location "$LOCATION"
    ```

    ---

1. Create the Container Apps environment using the following command.

    # [Bash](#tab/bash)
    ```bash
    az containerapp env create \
        --name "$ENVIRONMENT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az containerapp env create `
        --name "$ENVIRONMENT" `
        --resource-group "$RESOURCE_GROUP" `
        --location "$LOCATION"
    ```

    ---

::: zone pivot="container-apps-jobs-self-hosted-ci-cd-github-actions"

## Create a GitHub repository for running a workflow

To execute a workflow, you need to create a GitHub repository that contains the workflow definition.

1. Navigate to [GitHub](https://github.com/new) and sign in.

1. Create a new repository by entering the following values.

    | Setting | Value |
    |---|---|
    | Owner | Select your GitHub username. |
    | Repository name | Enter a name for your repository. |
    | Visibility | Select **Private**. |
    | Initialize this repository with | Select **Add a README file**. |

    Leave the rest of the values as their default selection.

1. Select **Create repository**.

1. In your new repository, select **Actions**.

1. Search for the *Simple workflow* template and select **Configure**.

1. Select **Commit changes** to add the workflow to your repository.

The workflow runs on the `ubuntu-latest` GitHub-hosted runner and prints a message to the console. Later, you replace the GitHub-hosted runner with a self-hosted runner.

## Get a GitHub personal access token

To run a self-hosted runner, you need to create a personal access token (PAT) in GitHub. Each time a runner starts, the PAT is used to generate a token to register the runner with GitHub. The PAT is also used by the GitHub Actions runner scale rule to monitor the repository's workflow queue and start runners as needed.

1. In GitHub, select your profile picture in the upper-right corner and select **Settings**.

1. Select **Developer settings**.

1. Under *Personal access tokens*, select **Fine-grained tokens**.

1. Select **Generate new token**.

1. In the *New fine-grained personal access token* screen, enter the following values.

    | Setting | Value |
    |---|---|
    | Token name | Enter a name for your token. |
    | Expiration | Select **30 days**. |
    | Repository access | Select **Only select repositories** and select the repository you created. |

    Enter the following values for *Repository permissions*.

    | Setting | Value |
    |---|---|
    | Actions | Select **Read-only**. |
    | Administration | Select **Read and write**. |
    | Metadata | Select **Read-only**. |

1. Select **Generate token**.

1. Copy the token value.

1. Define variables that are used to configure the runner and scale rule later.

    # [Bash](#tab/bash)
    ```bash
    GITHUB_PAT="<GITHUB_PAT>"
    REPO_OWNER="<REPO_OWNER>"
    REPO_NAME="<REPO_NAME>"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    $GITHUB_PAT="<GITHUB_PAT>"
    $REPO_OWNER="<REPO_OWNER>"
    $REPO_NAME="<REPO_NAME>"
    ```

    ---

    Replace the placeholders with the following values:

    | Placeholder | Value |
    |---|---|
    | `<GITHUB_PAT>` | The GitHub PAT you generated. |
    | `<REPO_OWNER>` | The owner of the repository you created earlier. This value is usually your GitHub username. |
    | `<REPO_NAME>` | The name of the repository you created earlier. This value is the same name you entered in the *Repository name* field. |

## Build the GitHub Actions runner container image

To create a self-hosted runner, you need to build a container image that executes the runner. In this section, you build the container image and push it to a container registry.

> [!NOTE]
> The image you build in this tutorial contains a basic self-hosted runner that's suitable for running as a Container Apps job. You can customize it to include additional tools or dependencies that your workflows require.

1. Define a name for your container image and registry.

    # [Bash](#tab/bash)
    ```bash
    CONTAINER_IMAGE_NAME="github-actions-runner:1.0"
    CONTAINER_REGISTRY_NAME="<CONTAINER_REGISTRY_NAME>"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    $CONTAINER_IMAGE_NAME="github-actions-runner:1.0"
    $CONTAINER_REGISTRY_NAME="<CONTAINER_REGISTRY_NAME>"
    ```

    ---

    Replace `<CONTAINER_REGISTRY_NAME>` with a unique name for creating a container registry. Container registry names must be *unique within Azure* and be from 5 to 50 characters in length containing numbers and lowercase letters only.

1. Create a container registry.

    # [Bash](#tab/bash)
    ```bash
    az acr create \
        --name "$CONTAINER_REGISTRY_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Basic \
        --admin-enabled true
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az acr create `
        --name "$CONTAINER_REGISTRY_NAME" `
        --resource-group "$RESOURCE_GROUP" `
        --location "$LOCATION" `
        --sku Basic `
        --admin-enabled true
    ```

    ---

1. The Dockerfile for creating the runner image is available on [GitHub](https://github.com/Azure-Samples/container-apps-ci-cd-runner-tutorial/tree/main/github-actions-runner). Run the following command to clone the repository and build the container image in the cloud using the `az acr build` command.

    # [Bash](#tab/bash)
    ```bash
    az acr build \
        --registry "$CONTAINER_REGISTRY_NAME" \
        --image "$CONTAINER_IMAGE_NAME" \
        --file "Dockerfile.github" \
        "https://github.com/Azure-Samples/container-apps-ci-cd-runner-tutorial.git"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az acr build `
        --registry "$CONTAINER_REGISTRY_NAME" `
        --image "$CONTAINER_IMAGE_NAME" `
        --file "Dockerfile.github" `
        "https://github.com/Azure-Samples/container-apps-ci-cd-runner-tutorial.git"
    ```

    ---

    The image is now available in the container registry.

## Deploy a self-hosted runner as a job

You can now create a job that uses to use the container image. In this section, you create a job that executes the self-hosted runner and authenticates with GitHub using the PAT you generated earlier. The job uses the [`github-runner` scale rule](https://keda.sh/docs/latest/scalers/github-runner/) to create job executions based on the number of pending workflow runs.

1. Create a job in the Container Apps environment.

    # [Bash](#tab/bash)
    ```bash
    az containerapp job create -n "$JOB_NAME" -g "$RESOURCE_GROUP" --environment "$ENVIRONMENT" \
        --trigger-type Event \
        --replica-timeout 1800 \
        --replica-retry-limit 1 \
        --replica-completion-count 1 \
        --parallelism 1 \
        --image "$CONTAINER_REGISTRY_NAME.azurecr.io/$CONTAINER_IMAGE_NAME" \
        --min-executions 0 \
        --max-executions 10 \
        --polling-interval 30 \
        --scale-rule-name "github-runner" \
        --scale-rule-type "github-runner" \
        --scale-rule-metadata "github-runner=https://api.github.com" "owner=$REPO_OWNER" "runnerScope=repo" "repos=$REPO_NAME" "targetWorkflowQueueLength=1" \
        --scale-rule-auth "personalAccessToken=personal-access-token" \
        --cpu "2.0" \
        --memory "4Gi" \
        --secrets "personal-access-token=$GITHUB_PAT" \
        --env-vars "GITHUB_PAT=secretref:personal-access-token" "REPO_URL=https://github.com/$REPO_OWNER/$REPO_NAME" "REGISTRATION_TOKEN_API_URL=https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runners/registration-token" \
        --registry-server "$CONTAINER_REGISTRY_NAME.azurecr.io"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az containerapp job create -n "$JOB_NAME" -g "$RESOURCE_GROUP" --environment "$ENVIRONMENT" `
        --trigger-type Event `
        --replica-timeout 1800 `
        --replica-retry-limit 0 `
        --replica-completion-count 1 `
        --parallelism 1 `
        --image "$CONTAINER_REGISTRY_NAME.azurecr.io/$CONTAINER_IMAGE_NAME" `
        --min-executions 0 `
        --max-executions 10 `
        --polling-interval 30 `
        --scale-rule-name "github-runner" `
        --scale-rule-type "github-runner" `
        --scale-rule-metadata "github-runner=https://api.github.com" "owner=$REPO_OWNER" "runnerScope=repo" "repos=$REPO_NAME" "targetWorkflowQueueLength=1" `
        --scale-rule-auth "personalAccessToken=personal-access-token" `
        --cpu "2.0" `
        --memory "4Gi" `
        --secrets "personal-access-token=$GITHUB_PAT" `
        --env-vars "GITHUB_PAT=secretref:personal-access-token" "REPO_URL=https://github.com/$REPO_OWNER/$REPO_NAME" "REGISTRATION_TOKEN_API_URL=https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runners/registration-token" `
        --registry-server "$CONTAINER_REGISTRY_NAME.azurecr.io"
    ```

    ---

    The following table describes the key parameters used in the command.

    | Parameter | Description |
    | --- | --- |
    | `--replica-timeout` | The maximum duration a replica can execute. |
    | `--replica-retry-limit` | The number of times to retry a failed replica. |
    | `--replica-completion-count` | The number of replicas to complete successfully before a job execution is considered successful. |
    | `--parallelism` | The number of replicas to start per job execution. |
    | `--min-executions` | The minimum number of job executions to run per polling interval. |
    | `--max-executions` | The maximum number of job executions to run per polling interval. |
    | `--polling-interval` | The polling interval at which to evaluate the scale rule. |
    | `--scale-rule-name` | The name of the scale rule. |
    | `--scale-rule-type` | The type of scale rule to use. To learn more about the GitHub runner scaler, see the KEDA [documentation](https://keda.sh/docs/latest/scalers/github-runner/). |
    | `--scale-rule-metadata` | The metadata for the scale rule. |
    | `--scale-rule-auth` | The authentication for the scale rule. |
    | `--secrets` | The secrets to use for the job. |
    | `--env-vars` | The environment variables to use for the job. |
    | `--registry-server` | The container registry server to use for the job. For an Azure Container Registry, the command automatically configures authentication. |

    The scale rule configuration defines the event source to monitor. It's evaluated on each polling interval and determines how many job executions to trigger. To learn more, see [Set scaling rules](scale-app.md).

The event-driven job is now created in the Container Apps environment. 

## Run a workflow and verify the job

The job is configured to evaluate the scale rule every 30 seconds. During each evaluation, it checks the number of pending workflow runs that require a self-hosted runner and starts a new job execution for pending workflow, up to a configured maximum of 10 executions.

To verify the job was configured correctly, you modify the workflow to use a self-hosted runner and trigger a workflow run. You can then view the job execution logs to see the workflow run.

1. In the GitHub repository, navigate to the workflow you generated earlier. It's a YAML file in the `.github/workflows` directory.

1. Select **Edit in place**.

1. Update the `runs-on` property to `self-hosted`:

    ```yaml
    runs-on: self-hosted
    ```

1. Select **Commit changes...**.

1. Select **Commit changes**.

1. Navigate to the **Actions** tab.

    A new workflow is now queued. Within 30 seconds, the job execution will start and the workflow will complete soon after.

    Wait for the action to complete before going on the next step.

1. List the executions of the job to confirm a job execution was created and completed successfully.

    # [Bash](#tab/bash)
    ```bash
    az containerapp job execution list \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --output table \
        --query '[].{Status: properties.status, Name: name, StartTime: properties.startTime}'
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az containerapp job execution list `
        --name "$JOB_NAME" `
        --resource-group "$RESOURCE_GROUP" `
        --output table `
        --query '[].{Status: properties.status, Name: name, StartTime: properties.startTime}'
    ```

    ---

::: zone-end

::: zone pivot="container-apps-jobs-self-hosted-ci-cd-azure-pipelines"

## Create an Azure DevOps project and repository

To execute a pipeline, you need an Azure DevOps project and repository.

1. Navigate to [Azure DevOps](https://aex.dev.azure.com/) and sign in to your account.

1. Select an existing organization or create a new one.

1. In the organization overview page, select **New project** and enter the following values.

    | Setting | Value |
    |---|---|
    | *Project name* | Enter a name for your project. |
    | *Visibility* | Select **Private**. |

1. Select **Create**.

1. From the side navigation, select **Repos**.

1. Under *Initialize main branch with a README or .gitignore*, select **Add a README**.

1. Leave the rest of the values as defaults and select **Initialize**.

## Create a new agent pool

Create a new agent pool to run the self-hosted runner.

1. In your Azure DevOps project, expand the left navigation bar and select **Project settings**.

    :::image type="content" source="media/runners/azure-devops-project-settings.png" alt-text="Screenshot of the Azure DevOps project settings button.":::

1. Under the *Pipelines* section in the *Project settings* navigation menu, select **Agent pools**.

    :::image type="content" source="media/runners/azure-devops-agent-pools.png" alt-text="Screenshot of Azure DevOps agent pools button.":::

1. Select **Add pool** and enter the following values.

    | Setting | Value |
    |---|---|
    | *Pool to link* | Select **New**. |
    | *Pool type* | Select **Self-hosted**. |
    | *Name* | Enter **container-apps**. |
    | *Grant access permission to all pipelines* | Select this checkbox. |

1. Select **Create**.

## Get an Azure DevOps personal access token

To run a self-hosted runner, you need to create a personal access token (PAT) in Azure DevOps. The PAT is used to authenticate the runner with Azure DevOps. It's also used by the scale rule to determine the number of pending pipeline runs and trigger new job executions.

1. In Azure DevOps, select *User settings* next to your profile picture in the upper-right corner.

1. Select **Personal access tokens**.

1. In the *Personal access tokens* page, select **New Token** and enter the following values.

    | Setting | Value |
    |---|---|
    | *Name* | Enter a name for your token. |
    | *Organization* | Select the organization you chose or created earlier. |
    | *Scopes* | Select **Custom defined**. |
    | *Show all scopes* | Select **Show all scopes**.  |
    | *Agent Pools (Read & manage)* | Select **Agent Pools (Read & manage)**. |

    Leave all other scopes unselected.

1. Select **Create**.

1. Copy the token value to a secure location.

    You can't retrieve the token after you leave the page.

1. Define variables that are used to configure the Container Apps jobs later.

    # [Bash](#tab/bash)
    ```bash
    AZP_TOKEN="<AZP_TOKEN>"
    ORGANIZATION_URL="<ORGANIZATION_URL>"
    AZP_POOL="container-apps"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    $AZP_TOKEN="<AZP_TOKEN>"
    $ORGANIZATION_URL="<ORGANIZATION_URL>"
    $AZP_POOL="container-apps"
    ```

    ---

    Replace the placeholders with the following values:

    | Placeholder | Value | Comments |
    |---|---|---|
    | `<AZP_TOKEN>` | The Azure DevOps PAT you generated. | |
    | `<ORGANIZATION_URL>` | The URL of your Azure DevOps organization. | For example, `https://dev.azure.com/myorg` or `https://myorg.visualstudio.com`. |

## Build the Azure Pipelines agent container image

To create a self-hosted agent, you need to build a container image that runs the agent. In this section, you build the container image and push it to a container registry.

> [!NOTE]
> The image you build in this tutorial contains a basic self-hosted agent that's suitable for running as a Container Apps job. You can customize it to include additional tools or dependencies that your pipelines require.

1. Back in your terminal, define a name for your container image and registry.

    # [Bash](#tab/bash)
    ```bash
    CONTAINER_IMAGE_NAME="azure-pipelines-agent:1.0"
    CONTAINER_REGISTRY_NAME="<CONTAINER_REGISTRY_NAME>"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    $CONTAINER_IMAGE_NAME="azure-pipelines-agent:1.0"
    $CONTAINER_REGISTRY_NAME="<CONTAINER_REGISTRY_NAME>"
    ```

    ---

    Replace `<CONTAINER_REGISTRY_NAME>` with a unique name for creating a container registry.

    Container registry names must be *unique within Azure* and be from 5 to 50 characters in length containing numbers and lowercase letters only.

1. Create a container registry.

    # [Bash](#tab/bash)
    ```bash
    az acr create \
        --name "$CONTAINER_REGISTRY_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Basic \
        --admin-enabled true
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az acr create `
        --name "$CONTAINER_REGISTRY_NAME" `
        --resource-group "$RESOURCE_GROUP" `
        --location "$LOCATION" `
        --sku Basic `
        --admin-enabled true
    ```

    ---

1. The Dockerfile for creating the runner image is available on [GitHub](https://github.com/Azure-Samples/container-apps-ci-cd-runner-tutorial/tree/main/azure-pipelines-agent). Run the following command to clone the repository and build the container image in the cloud using the `az acr build` command.

    # [Bash](#tab/bash)
    ```bash
    az acr build \
        --registry "$CONTAINER_REGISTRY_NAME" \
        --image "$CONTAINER_IMAGE_NAME" \
        --file "Dockerfile.azure-pipelines" \
        "https://github.com/Azure-Samples/container-apps-ci-cd-runner-tutorial.git"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az acr build `
        --registry "$CONTAINER_REGISTRY_NAME" `
        --image "$CONTAINER_IMAGE_NAME" `
        --file "Dockerfile.azure-pipelines" `
        "https://github.com/Azure-Samples/container-apps-ci-cd-runner-tutorial.git"
    ```

    ---

    The image is now available in the container registry.

## Create a placeholder self-hosted agent

Before you can run a self-hosted agent in your new agent pool, you need to create a placeholder agent. The placeholder agent ensures the agent pool is available. Pipelines that use the agent pool fail when there's no placeholder agent.

You can run a manual job to register an offline placeholder agent. The job runs once and can be deleted. The placeholder agent doesn't consume any resources in Azure Container Apps or Azure DevOps.

1. Create a manual job in the Container Apps environment that creates the placeholder agent.

    # [Bash](#tab/bash)
    ```bash
    az containerapp job create -n "$PLACEHOLDER_JOB_NAME" -g "$RESOURCE_GROUP" --environment "$ENVIRONMENT" \
        --trigger-type Manual \
        --replica-timeout 300 \
        --replica-retry-limit 0 \
        --replica-completion-count 1 \
        --parallelism 1 \
        --image "$CONTAINER_REGISTRY_NAME.azurecr.io/$CONTAINER_IMAGE_NAME" \
        --cpu "2.0" \
        --memory "4Gi" \
        --secrets "personal-access-token=$AZP_TOKEN" "organization-url=$ORGANIZATION_URL" \
        --env-vars "AZP_TOKEN=secretref:personal-access-token" "AZP_URL=secretref:organization-url" "AZP_POOL=$AZP_POOL" "AZP_PLACEHOLDER=1" "AZP_AGENT_NAME=placeholder-agent" \
        --registry-server "$CONTAINER_REGISTRY_NAME.azurecr.io"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
        az containerapp job create -n "$PLACEHOLDER_JOB_NAME" -g "$RESOURCE_GROUP" --environment "$ENVIRONMENT" `
        --trigger-type Manual `
        --replica-timeout 300 `
        --replica-retry-limit 1 `
        --replica-completion-count 1 `
        --parallelism 1 `
        --image "$CONTAINER_REGISTRY_NAME.azurecr.io/$CONTAINER_IMAGE_NAME" `
        --cpu "2.0" `
        --memory "4Gi" `
        --secrets "personal-access-token=$AZP_TOKEN" "organization-url=$ORGANIZATION_URL" `
        --env-vars "AZP_TOKEN=secretref:personal-access-token" "AZP_URL=secretref:organization-url" "AZP_POOL=$AZP_POOL" "AZP_PLACEHOLDER=1" "AZP_AGENT_NAME=placeholder-agent" `
        --registry-server "$CONTAINER_REGISTRY_NAME.azurecr.io"
    ```

    ---

    The following table describes the key parameters used in the command.

    | Parameter | Description |
    | --- | --- |
    | `--replica-timeout` | The maximum duration a replica can execute. |
    | `--replica-retry-limit` | The number of times to retry a failed replica. |
    | `--replica-completion-count` | The number of replicas to complete successfully before a job execution is considered successful. |
    | `--parallelism` | The number of replicas to start per job execution. |
    | `--secrets` | The secrets to use for the job. |
    | `--env-vars` | The environment variables to use for the job. |
    | `--registry-server` | The container registry server to use for the job. For an Azure Container Registry, the command automatically configures authentication. |

    Setting the `AZP_PLACEHOLDER` environment variable configures the agent container to register as an offline placeholder agent without running a job.

1. Execute the manual job to create the placeholder agent.

    # [Bash](#tab/bash)
    ```bash
    az containerapp job start -n "$PLACEHOLDER_JOB_NAME" -g "$RESOURCE_GROUP"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az containerapp job start -n "$PLACEHOLDER_JOB_NAME" -g "$RESOURCE_GROUP"
    ```

    ---

1. List the executions of the job to confirm a job execution was created and completed successfully.

    # [Bash](#tab/bash)
    ```bash
    az containerapp job execution list \
        --name "$PLACEHOLDER_JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --output table \
        --query '[].{Status: properties.status, Name: name, StartTime: properties.startTime}'
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az containerapp job execution list `
        --name "$PLACEHOLDER_JOB_NAME" `
        --resource-group "$RESOURCE_GROUP" `
        --output table `
        --query '[].{Status: properties.status, Name: name, StartTime: properties.startTime}'
    ```

    ---

1. Verify the placeholder agent was created in Azure DevOps.

    1. In Azure DevOps, navigate to your project. 
    1. Select **Project settings** > **Agent pools** > **container-apps** > **Agents**.
    1. Confirm that a placeholder agent named `placeholder-agent` is listed and its status is offline.

1. The job isn't needed again. You can delete it.
    
    # [Bash](#tab/bash)
    ```bash
    az containerapp job delete -n "$PLACEHOLDER_JOB_NAME" -g "$RESOURCE_GROUP"
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az containerapp job delete -n "$PLACEHOLDER_JOB_NAME" -g "$RESOURCE_GROUP"
    ```

    ---

## Create a self-hosted agent as an event-driven job

Now that you have a placeholder agent, you can create a self-hosted agent. In this section, you create an event-driven job that runs a self-hosted agent when a pipeline is triggered.

# [Bash](#tab/bash)
```bash
az containerapp job create -n "$JOB_NAME" -g "$RESOURCE_GROUP" --environment "$ENVIRONMENT" \
    --trigger-type Event \
    --replica-timeout 1800 \
    --replica-retry-limit 1 \
    --replica-completion-count 1 \
    --parallelism 1 \
    --image "$CONTAINER_REGISTRY_NAME.azurecr.io/$CONTAINER_IMAGE_NAME" \
    --min-executions 0 \
    --max-executions 10 \
    --polling-interval 30 \
    --scale-rule-name "azure-pipelines" \
    --scale-rule-type "azure-pipelines" \
    --scale-rule-metadata "poolName=$AZP_POOL" "targetPipelinesQueueLength=1" \
    --scale-rule-auth "personalAccessToken=personal-access-token" "organizationURL=organization-url" \
    --cpu "2.0" \
    --memory "4Gi" \
    --secrets "personal-access-token=$AZP_TOKEN" "organization-url=$ORGANIZATION_URL" \
    --env-vars "AZP_TOKEN=secretref:personal-access-token" "AZP_URL=secretref:organization-url" "AZP_POOL=$AZP_POOL" \
    --registry-server "$CONTAINER_REGISTRY_NAME.azurecr.io"
```

# [PowerShell](#tab/powershell)
```powershell
az containerapp job create -n "$JOB_NAME" -g "$RESOURCE_GROUP" --environment "$ENVIRONMENT" `
    --trigger-type Event `
    --replica-timeout 1800 `
    --replica-retry-limit 1 `
    --replica-completion-count 1 `
    --parallelism 1 `
    --image "$CONTAINER_REGISTRY_NAME.azurecr.io/$CONTAINER_IMAGE_NAME" `
    --min-executions 0 `
    --max-executions 10 `
    --polling-interval 30 `
    --scale-rule-name "azure-pipelines" `
    --scale-rule-type "azure-pipelines" `
    --scale-rule-metadata "poolName=$AZP_POOL" "targetPipelinesQueueLength=1" `
    --scale-rule-auth "personalAccessToken=personal-access-token" "organizationURL=organization-url" `
    --cpu "2.0" `
    --memory "4Gi" `
    --secrets "personal-access-token=$AZP_TOKEN" "organization-url=$ORGANIZATION_URL" `
    --env-vars "AZP_TOKEN=secretref:personal-access-token" "AZP_URL=secretref:organization-url" "AZP_POOL=$AZP_POOL" `
    --registry-server "$CONTAINER_REGISTRY_NAME.azurecr.io"
```

---

The following table describes the scale rule parameters used in the command.

| Parameter | Description |
| --- | --- |
| `--min-executions` | The minimum number of job executions to run per polling interval. |
| `--max-executions` | The maximum number of job executions to run per polling interval. |
| `--polling-interval` | The polling interval at which to evaluate the scale rule. |
| `--scale-rule-name` | The name of the scale rule. |
| `--scale-rule-type` | The type of scale rule to use. To learn more about the Azure Pipelines scaler, see the KEDA [documentation](https://keda.sh/docs/latest/scalers/azure-pipelines/). |
| `--scale-rule-metadata` | The metadata for the scale rule. |
| `--scale-rule-auth` | The authentication for the scale rule. |

The scale rule configuration defines the event source to monitor. It's evaluated on each polling interval and determines how many job executions to trigger. To learn more, see [Set scaling rules](scale-app.md).

The event-driven job is now created in the Container Apps environment. 

## Run a pipeline and verify the job

Now that you've configured a self-hosted agent job, you can run a pipeline and verify it's working correctly.

1. In the left-hand navigation of your Azure DevOps project, navigate to **Pipelines**.

1. Select **Create pipeline**.

1. Select **Azure Repos Git** as the location of your code.

1. Select the repository you created earlier.

1. Select **Starter pipeline**.

1. In the pipeline YAML, change the `pool` from `vmImage: ubuntu-latest` to `name: container-apps`.

    ```yaml
    pool:
      name: container-apps
    ```

1. Select **Save and run**.

    The pipeline runs and uses the self-hosted agent job you created in the Container Apps environment.

1. List the executions of the job to confirm a job execution was created and completed successfully.

    # [Bash](#tab/bash)
    ```bash
    az containerapp job execution list \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --output table \
        --query '[].{Status: properties.status, Name: name, StartTime: properties.startTime}'
    ```

    # [PowerShell](#tab/powershell)
    ```powershell
    az containerapp job execution list `
        --name "$JOB_NAME" `
        --resource-group "$RESOURCE_GROUP" `
        --output table `
        --query '[].{Status: properties.status, Name: name, StartTime: properties.startTime}'
    ```

    ---

::: zone-end

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Clean up resources

Once you're done, run the following command to delete the resource group that contains your Container Apps resources.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)
```bash
az group delete \
    --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)
```powershell
az group delete `
    --resource-group $RESOURCE_GROUP
```

---

To delete your GitHub repository, see [Deleting a repository](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/deleting-a-repository).

## Next steps

> [!div class="nextstepaction"]
> [Container Apps jobs](jobs.md)
