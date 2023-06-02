---
title: 'Tutorial: Run GitHub Actions runners and Azure Pipelines agents with Azure Container Apps jobs'
description: Learn to create self-hosted CI/CD runners and agents with jobs in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 06/01/2023
ms.author: cshoe
zone_pivot_groups: container-apps-jobs-self-hosted-ci-cd
---

# Tutorial: Deploy self-hosted CI/CD runners and agents with Azure Container Apps jobs

GitHub Actions and Azure Pipelines allow you to run CI/CD workflows with self-hosted runners and agents. Self-hosted runners are useful when you need to run workflows that require access to local resources or tools that are not available in a cloud-hosted runner. For example, self-hosted runners running as a Container Apps job allow your workflow to access resources inside the job's virtual network that are not accessible from a cloud-hosted runner.

::: zone pivot="container-apps-jobs-self-hosted-ci-cd-github-actions"

In this tutorial, you learn how to run GitHub Actions runners as an [event-driven Container Apps job](jobs.md#event-driven-jobs).

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your job
> * Create a GitHub repository for running a workflow that uses a self-hosted runner
> * Build a container image that runs a GitHub Actions runner
> * Deploy the runner job to the Container Apps environment
> * Create a workflow that uses the self-hosted runner and verify that it runs

> [!IMPORTANT]
> Self-hosted runners are only recommended for *private* repositories. Using them with public repositories can allow dangerous code to execute on your self-hosted runner. For more information, see [Self-hosted runner security](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#self-hosted-runner-security).

::: zone-end

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- See [Jobs preview limitations](jobs.md#jobs-preview-restrictions) for a list of limitations.
::: zone pivot="container-apps-jobs-self-hosted-ci-cd-github-actions"
- An Azure DevOps organization with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/services/devops/).
::: zone-end

## Setup

1. To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

    ```azurecli
    az login
    ```

1. Ensure you're running the latest version of the CLI via the upgrade command.

    ```azurecli
    az upgrade
    ```

1. Install the latest version of the Azure Container Apps CLI extension.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

1. Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces if you haven't already registered them in your Azure subscription.

    ```azurecli
    az provider register --namespace Microsoft.App
    az provider register --namespace Microsoft.OperationalInsights
    ```

1. Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.

    ```azurecli
    RESOURCE_GROUP="jobs-sample"
    LOCATION="northcentralus"
    ENVIRONMENT="env-jobs-sample"
    JOB_NAME="github-actions-runner-job"
    ```

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary around container apps and jobs so they can share the same network and communicate with each other.

1. Create a resource group using the following command.

    ```azurecli
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```

1. Create the Container Apps environment using the following command.

    ```azurecli
    az containerapp env create \
        --name "$ENVIRONMENT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```
## Create a GitHub repository for running a workflow

To execute a workflow, you need to create a GitHub repository that contains the workflow definition. In this section, you create a GitHub repository and add a workflow.

1. Navigate to [GitHub](https://github.com) and sign in to your account or create a new one.

1. Create a new repository.
    - In the **Repository name** field, enter a name for your repository.
    - Select **Private** visibility.
    - Select **Add a README file**.
    - Select **Create repository**.

1. In your new repository, select **Actions**.

1. Search for the *Simple workflow* template and select **Configure**.

1. Select **Commit changes** to add the simple workflow to your repository.

The workflow runs on the `ubuntu-latest` GitHub-hosted runner and prints a message to the console. Later, you replace the GitHub-hosted runner with a self-hosted runner.

## Obtain a GitHub personal access token

To run a self-hosted runner, you need to create a personal access token (PAT) in GitHub. The PAT is used to authenticate the runner with GitHub.

1. In GitHub, select your profile picture in the upper-right corner and select **Settings**.

1. Select **Developer settings**.

1. Under *Personal access tokens*, select **Fine-grained tokens**.

1. Select **Generate new token**.

1. In the *New fine-grained personal access token* screen, enter the following information:
    - In *Token name*, enter a name for your token.
    - In *Expiration*, select **90 days**. Note that you'll need to update the job with a new token before it expires.
    - Under *Repository access*, select **Only select repositories**.
        - Select the repository you created earlier.
    - Under *Repository permissions*:
        - Select **Read** access to *metadata*
        - Select **Read and write** access to *administration*
    - Select **Generate token**.

1. Copy the token value.

1. Define variables that will be used to configure the Container Apps jobs later.

    ```bash
    GITHUB_PAT="<GITHUB_PAT>"
    REPO_OWNER="<REPO_OWNER>"
    REPO_NAME="<REPO_NAME>"
    ```

    Replace the placeholders with the following values:
    - `<GITHUB_PAT>`: The GitHub PAT you generated.
    - `<REPO_OWNER>`: The owner of the repository you created earlier. This is usually your GitHub username.
    - `<REPO_NAME>`: The name of the repository you created earlier. This is the same name you entered in the *Repository name* field.

## Build the GitHub Actions runner container image

To create a self-hosted runner, you need to build a container image that runs the runner. In this section, you build the container image and push it to a container registry.

> [!NOTE]
> The image you build in this tutorial contains a basic self-hosted runner that is suitable for running as a Container Apps job. You can customize it to include additional tools or dependencies that your workflows require.

1. Define a name for your container image and registry.

    ```bash
    CONTAINER_IMAGE_NAME="github-actions-runner:1.0"
    CONTAINER_REGISTRY_NAME="<CONTAINER_REGISTRY_NAME>"
    ```

    Replace `<CONTAINER_REGISTRY_NAME>` with a unique name for creating a container registry. Container registry names must be *unique within Azure* and be from 5 to 50 characters in length containing numbers and lowercase letters only.

1. Create a container registry.

    ```azurecli
    az acr create \
        --name "$CONTAINER_REGISTRY_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Basic \
        --admin-enabled true
    ```

1. The Dockerfile for creating the runner image is available on [GitHub](https://github.com/Azure-Samples/container-apps-ci-cd-runner-tutorial/tree/main/github-actions-runner). Run the following command to clone the repository and build the container image in the cloud using the `az acr build` command.

    ```azurecli
    az acr build \
        --registry "$CONTAINER_REGISTRY_NAME" \
        --image "$CONTAINER_IMAGE_NAME" \
        --file "Dockerfile.github" \
        "https://github.com/Azure-Samples/container-apps-ci-cd-runner-tutorial.git"
    ```

    The image is now available in the container registry.

## Create a job

Now that you have a container image that runs a GitHub Actions runner, you can create a job that uses it. In this section, you create a job that executes the self-hosted runner and authenticates with GitHub using the PAT you generated earlier. It uses the [`github-runner` scale rule](https://keda.sh/docs/latest/scalers/github-runner/) to create job executions based on the number of pending workflow runs.

1. Create a job in the Container Apps environment.

    ```azurecli
    az containerapp job create -n $JOB_NAME -g $RESOURCE_GROUP --environment $ENVIRONMENT \
        --trigger-type Event \
        --replica-timeout 300 \
        --replica-retry-limit 0 \
        --replica-completion-count 1 \
        --parallelism 1 \
        --image $CONTAINER_REGISTRY_NAME.azurecr.io/$CONTAINER_IMAGE_NAME \
        --min-executions 0 \
        --max-executions 10 \
        --polling-interval 30 \
        --scale-rule-name 'github-runner' \
        --scale-rule-type 'github-runner' \
        --scale-rule-metadata 'github-runner=https://api.github.com' "owner=$REPO_OWNER" 'runnerScope=repo' "repos=$REPO_NAME" 'targetWorkflowQueueLength=1' \
        --scale-rule-auth 'personalAccessToken=personal-access-token' \
        --cpu '2.0' \
        --memory '4Gi' \
        --secrets "personal-access-token=$GITHUB_PAT" \
        --env-vars 'GITHUB_PAT=secretref:personal-access-token' "REPO_URL=https://github.com/$REPO_OWNER/$REPO_NAME" "REGISTRATION_TOKEN_API_URL=https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runners/registration-token" \
        --registry-server "$CONTAINER_REGISTRY_NAME.azurecr.io"
    ```

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
    | `--scale-rule-type` | The type of scale rule to use. |
    | `--scale-rule-metadata` | The metadata for the scale rule. |
    | `--scale-rule-auth` | The authentication for the scale rule. |
    | `--secrets` | The secrets to use for the job. |
    | `--env-vars` | The environment variables to use for the job. |
    | `--registry-server` | The container registry server to use for the job. For an Azure Container Registry, the command automatically configures authentication. |

    The scale rule configuration defines the event source to monitor. It's evaluated on each polling interval and determines how many job executions to trigger. To learn more, see [Set scaling rules](scale-app.md).

The event-driven job is now created in the Container Apps environment. 

## Run a workflow and verify the job

The job is configured to evaluate the scale rule every 30 seconds, which checks the number of pending workflow runs that require a self-hosted runner. For each evaluation period, it starts a new job execution for pending workflow, up to a maximum of 10 executions.

To verify the job was configured correctly, you modify the workflow to use a self-hosted runner and trigger a workflow run. You can then view the job execution logs to see the workflow run.

1. In the GitHub repository, navigate to the workflow you generated earlier. It's a YAML file in the `.github/workflows` directory.

1. Select **Edit**.

1. Replace the `runs-on` property with the following:

    ```yaml
    runs-on: self-hosted
    ```

1. Select **Commit changes...** and then **Commit changes**.

1. Navigate to the **Actions** tab.

    You should see a new workflow run that's queued. Within 30 seconds, the job execution should start and the workflow run should complete.

1. List the executions of the job to confirm a job execution was created and completed successfully.

    ```azurecli
    az containerapp job execution list \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --output json
    ```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Clean up resources

Once you're done, run the following command to delete the resource group that contains your Container Apps resources.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

```azurecli
az group delete \
    --resource-group $RESOURCE_GROUP
```

To delete your GitHub repository, see [Deleting a repository](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/deleting-a-repository).

## Next steps

> [!div class="nextstepaction"]
> [Container Apps jobs](jobs.md)
