---
title: 'Tutorial: Implement CI/CD with GitOps using Azure Arc-enabled Kubernetes clusters'
description: This tutorial walks through setting up a CI/CD solution using GitOps with Azure Arc-enabled Kubernetes clusters.
ms.topic: tutorial
ms.date: 05/08/2023
ms.custom: template-tutorial, devx-track-azurecli
---
# Tutorial: Implement CI/CD with GitOps using Azure Arc-enabled Kubernetes clusters

> [!IMPORTANT]
> This tutorial uses GitOps with Flux v1. GitOps with Flux v2 is now available for Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters; [go to the tutorial that uses GitOps with Flux v2](./tutorial-gitops-flux2-ci-cd.md). We recommend [migrating to Flux v2](conceptual-gitops-flux2.md#migrate-from-flux-v1) as soon as possible.
>
> Support for Flux v1-based cluster configuration resources created prior to January 1, 2024 will end on [May 24, 2025](https://azure.microsoft.com/updates/migrate-your-gitops-configurations-from-flux-v1-to-flux-v2-by-24-may-2025/). Starting on January 1, 2024, you won't be able to create new Flux v1-based cluster configuration resources.

In this tutorial, you'll set up a CI/CD solution using GitOps with Azure Arc-enabled Kubernetes clusters. Using the sample Azure Vote app, you'll:

> [!div class="checklist"]
> * Create an Azure Arc-enabled Kubernetes cluster.
> * Connect your application and GitOps repos to Azure Repos.
> * Import CI/CD pipelines.
> * Connect your Azure Container Registry (ACR) to Azure DevOps and Kubernetes.
> * Create environment variable groups.
> * Deploy the `dev` and `stage` environments.
> * Test the application environments.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Before you begin

This tutorial assumes familiarity with Azure DevOps, Azure Repos and Pipelines, and Azure CLI.

* Sign into [Azure DevOps Services](https://dev.azure.com/).
* Complete the [previous tutorial](./tutorial-use-gitops-connected-cluster.md) to learn how to deploy GitOps for your CI/CD environment.
* Understand the [benefits and architecture](./conceptual-configurations.md) of this feature.
* Verify you have:
  * A [connected Azure Arc-enabled Kubernetes cluster](./quickstart-connect-cluster.md#connect-an-existing-kubernetes-cluster) named **arc-cicd-cluster**.
  * A connected Azure Container Registry (ACR) with either [AKS integration](../../aks/cluster-container-registry-integration.md) or [non-AKS cluster authentication](../../container-registry/container-registry-auth-kubernetes.md).
  * "Build Admin" and "Project Admin" permissions for [Azure Repos](/azure/devops/repos/get-started/what-is-repos) and [Azure Pipelines](/azure/devops/pipelines/get-started/pipelines-get-started).
* Install the following Azure Arc-enabled Kubernetes CLI extensions of versions >= 1.0.0:

  ```azurecli
  az extension add --name connectedk8s
  az extension add --name k8s-configuration
  ```
  * To update these extensions to the latest version, run the following commands:

    ```azurecli
    az extension update --name connectedk8s
    az extension update --name k8s-configuration
    ```

## Import application and GitOps repos into Azure Repos

Import an [application repo](./conceptual-gitops-ci-cd.md#application-repo) and a [GitOps repo](./conceptual-gitops-ci-cd.md#gitops-repo) into Azure Repos. For this tutorial, use the following example repos:

* **arc-cicd-demo-src** application repo
   * URL: https://github.com/Azure/arc-cicd-demo-src
   * Contains the example Azure Vote App that you will deploy using GitOps.
* **arc-cicd-demo-gitops** GitOps repo
   * URL: https://github.com/Azure/arc-cicd-demo-gitops
   * Works as a base for your cluster resources that house the Azure Vote App.

Learn more about [importing Git repos](/azure/devops/repos/git/import-git-repository).

>[!NOTE]
> Importing and using two separate repositories for application and GitOps repos can improve security and simplicity. The application and GitOps repositories' permissions and visibility can be tuned individually.
> For example, the cluster administrator may not find the changes in application code relevant to the desired state of the cluster. Conversely, an application developer doesn't need to know the specific parameters for each environment - a set of test values that provide coverage for the parameters may be sufficient.

## Connect the GitOps repo

To continuously deploy your app, connect the application repo to your cluster using GitOps. Your **arc-cicd-demo-gitops** GitOps repo contains the basic resources to get your app up and running on your **arc-cicd-cluster** cluster.

The initial GitOps repo contains only a [manifest](https://github.com/Azure/arc-cicd-demo-gitops/blob/master/arc-cicd-cluster/manifests/namespaces.yml) that creates the **dev** and **stage** namespaces corresponding to the deployment environments.

The GitOps connection that you create will automatically:
* Sync the manifests in the manifest directory.
* Update the cluster state.

The CI/CD workflow will populate the manifest directory with extra manifests to deploy the app.


1. [Create a new GitOps connection](./tutorial-use-gitops-connected-cluster.md) to your newly imported **arc-cicd-demo-gitops** repo in Azure Repos.

   ```azurecli
   az k8s-configuration create \
      --name cluster-config \
      --cluster-name arc-cicd-cluster \
      --resource-group myResourceGroup \
      --operator-instance-name cluster-config \
      --operator-namespace cluster-config \
      --repository-url https://dev.azure.com/<Your organization>/<Your project>/_git/arc-cicd-demo-gitops \
      --https-user <Azure Repos username> \
      --https-key <Azure Repos PAT token> \
      --scope cluster \
      --cluster-type connectedClusters \
      --operator-params='--git-readonly --git-path=arc-cicd-cluster/manifests'
   ```

1. Ensure that Flux *only* uses the `arc-cicd-cluster/manifests` directory as the base path. Define the path by using the following operator parameter:

   `--git-path=arc-cicd-cluster/manifests`

   > [!NOTE]
   > If you are using an HTTPS connection string and are having connection problems, ensure you omit the username prefix in the URL. For example, `https://alice@dev.azure.com/contoso/project/_git/arc-cicd-demo-gitops` must have `alice@` removed. The `--https-user` specifies the user instead, for example `--https-user alice`.

1. Check the state of the deployment in Azure portal.
   * If successful, you'll see both `dev` and `stage` namespaces created in your cluster.

## Import the CI/CD pipelines

Now that you've synced a GitOps connection, you'll need to import the CI/CD pipelines that create the manifests.

The application repo contains a `.pipeline` folder with the pipelines you'll use for PRs, CI, and CD. Import and rename the three pipelines provided in the sample repo:

| Pipeline file name | Description |
| ------------- | ------------- |
| [`.pipelines/az-vote-pr-pipeline.yaml`](https://github.com/Azure/arc-cicd-demo-src/blob/master/.pipelines/az-vote-pr-pipeline.yaml)  | The application PR pipeline, named **arc-cicd-demo-src PR** |
| [`.pipelines/az-vote-ci-pipeline.yaml`](https://github.com/Azure/arc-cicd-demo-src/blob/master/.pipelines/az-vote-ci-pipeline.yaml) | The application CI pipeline, named **arc-cicd-demo-src CI** |
| [`.pipelines/az-vote-cd-pipeline.yaml`](https://github.com/Azure/arc-cicd-demo-src/blob/master/.pipelines/az-vote-cd-pipeline.yaml) | The application CD pipeline, named **arc-cicd-demo-src CD** |



## Connect your ACR
Both your pipelines and cluster will be utilizing ACR to store and retrieve Docker images.

### Connect ACR to Azure DevOps
During the CI process, you'll deploy your application containers to a registry. Start by creating an Azure service connection:

1. In Azure DevOps, open the **Service connections** page from the project settings page. In TFS, open the **Services** page from the **settings** icon in the top menu bar.
2. Choose **+ New service connection** and select the type of service connection you need.
3. Fill in the parameters for the service connection. For this tutorial:
   * Name the service connection **arc-demo-acr**. 
   * Select **myResourceGroup** as the resource group.
4. Select the **Grant access permission to all pipelines**. 
   * This option authorizes YAML pipeline files for service connections. 
5. Choose **OK** to create the connection.

### Connect ACR to Kubernetes
Enable your Kubernetes cluster to pull images from your ACR. If it's private, authentication will be required.

#### Connect ACR to existing AKS clusters

Integrate an existing ACR with existing AKS clusters using the following command:

```azurecli
az aks update -n arc-cicd-cluster -g myResourceGroup --attach-acr arc-demo-acr
```

#### Create an image pull secret

To connect non-AKS and local clusters to your ACR, create an image pull secret. Kubernetes uses image pull secrets to store information needed to authenticate your registry.

Create an image pull secret with the following `kubectl` command. Repeat for both the `dev` and `stage` namespaces.
```console
kubectl create secret docker-registry <secret-name> \
    --namespace <namespace> \
    --docker-server=<container-registry-name>.azurecr.io \
    --docker-username=<service-principal-ID> \
    --docker-password=<service-principal-password>
```

To avoid having to set an imagePullSecret for every Pod, consider adding the imagePullSecret to the Service account in the `dev` and `stage` namespaces. See the [Kubernetes tutorial](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) for more information.

## Create environment variable groups

### App repo variable group
[Create a variable group](/azure/devops/pipelines/library/variable-groups) named **az-vote-app-dev**. Set the following values:

| Variable | Value |
| -------- | ----- |
| AZ_ACR_NAME | (your ACR instance, for example. azurearctest.azurecr.io) |
| AZURE_SUBSCRIPTION | (your Azure Service Connection, which should be **arc-demo-acr** from earlier in the tutorial) |
| AZURE_VOTE_IMAGE_REPO | The full path to the Azure Vote App repo, for example azurearctest.azurecr.io/azvote |
| ENVIRONMENT_NAME | Dev |
| MANIFESTS_BRANCH | `master` |
| MANIFESTS_FOLDER | `azure-vote-manifests` |
| MANIFESTS_REPO | `arc-cicd-demo-gitops` |
| ORGANIZATION_NAME | Name of Azure DevOps organization |
| PROJECT_NAME | Name of GitOps project in Azure DevOps |
| REPO_URL | Full URL for GitOps repo |
| SRC_FOLDER | `azure-vote` | 
| TARGET_CLUSTER | `arc-cicd-cluster` |
| TARGET_NAMESPACE | `dev` |

### Stage environment variable group

1. Clone the **az-vote-app-dev** variable group.
1. Change the name to **az-vote-app-stage**.
1. Ensure the following values for the corresponding variables:

| Variable | Value |
| -------- | ----- |
| ENVIRONMENT_NAME | Stage |
| TARGET_NAMESPACE | `stage` |

You're now ready to deploy to the `dev` and `stage` environments.

## Give More Permissions to the Build Service
The CD pipeline uses the security token of the running build to authenticate to the GitOps repository. More permissions are needed for the pipeline to create a new branch, push changes, and create pull requests.

1. Go to `Project settings` from the Azure DevOps project main page.
1. Select `Repositories`.
1. Select `<GitOps Repo Name>`.
1. Select `Security`. 
1. For the `<Project Name> Build Service (<Organization Name>)`, allow `Contribute`, `Contribute to pull requests`, and `Create branch`.

For more information, see:
- [Grant VC Permissions to the Build Service](/azure/devops/pipelines/scripts/git-commands?preserve-view=true&tabs=yaml&view=azure-devops#version-control)
- [Manage Build Service Account Permissions](/azure/devops/pipelines/process/access-tokens?preserve-view=true&tabs=yaml&view=azure-devops#manage-build-service-account-permissions)


## Deploy the dev environment for the first time
With the CI and CD pipelines created, run the CI pipeline to deploy the app for the first time.

### CI pipeline

During the initial CI pipeline run, you may get a resource authorization error in reading the service connection name.
1. Verify the variable being accessed is AZURE_SUBSCRIPTION.
1. Authorize the use.
1. Rerun the pipeline.

The CI pipeline:
* Ensures the application change passes all automated quality checks for deployment.
* Does any extra validation that couldn't be completed in the PR pipeline.
    * Specific to GitOps, the pipeline also publishes the artifacts for the commit that will be deployed by the CD pipeline.
* Verifies the Docker image has changed and the new image is pushed.

### CD pipeline
During the initial CD pipeline run, you'll be asked to give the pipeline access to the GitOps repository. Select View when prompted that the pipeline needs permission to access a resource. Then, select Permit to grant permission to use the GitOps repository for the current and future runs of the pipeline.

The successful CI pipeline run triggers the CD pipeline to complete the deployment process. You'll deploy to each environment incrementally.

> [!TIP]
> If the CD pipeline does not automatically trigger:
> 1. Verify the name matches the branch trigger in [`.pipelines/az-vote-cd-pipeline.yaml`](https://github.com/Azure/arc-cicd-demo-src/blob/master/.pipelines/az-vote-cd-pipeline.yaml)
>    * It should be `arc-cicd-demo-src CI`.
> 1. Rerun the CI pipeline.

Once the template and manifest changes to the GitOps repo have been generated, the CD pipeline will create a commit, push it, and create a PR for approval.
1. Open the PR link given in the `Create PR` task output.
1. Verify the changes to the GitOps repo. You should see:
   * High-level Helm template changes.
   * Low-level Kubernetes manifests that show the underlying changes to the desired state. Flux deploys these manifests.
1. If everything looks good, approve and complete the PR.

1. After a few minutes, Flux picks up the change and starts the deployment.
1. Forward the port locally using `kubectl` and ensure the app works correctly using:

   `kubectl port-forward -n dev svc/azure-vote-front 8080:80`

1. View the Azure Vote app in your browser at `http://localhost:8080/`.

1. Vote for your favorites and get ready to make some changes to the app.

## Set up environment approvals
Upon app deployment, you can not only make changes to the code or templates, but you can also unintentionally put the cluster into a bad state.

If the dev environment reveals a break after deployment, keep it from going to later environments using environment approvals.

1. In your Azure DevOps project, go to the environment that needs to be protected.
1. Navigate to **Approvals and Checks** for the resource.
1. Select **Create**.
1. Provide the approvers and an optional message.
1. Select **Create** again to complete the addition of the manual approval check.

For more details, see the [Define approval and checks](/azure/devops/pipelines/process/approvals) tutorial.

Next time the CD pipeline runs, the pipeline will pause after the GitOps PR creation. Verify the change has been synced properly and passes basic functionality. Approve the check from the pipeline to let the change flow to the next environment.

## Make an application change

With this baseline set of templates and manifests representing the state on the cluster, you'll make a small change to the app.

1. In the **arc-cicd-demo-src** repo, edit [`azure-vote/src/azure-vote-front/config_file.cfg`](https://github.com/Azure/arc-cicd-demo-src/blob/master/azure-vote/src/azure-vote-front/config_file.cfg) file.

2. Since "Cats vs Dogs" isn't getting enough votes, change it to "Tabs vs Spaces" to drive up the vote count.

3. Commit the change in a new branch, push it, and create a pull request.
   * This is the typical developer flow that will start the CI/CD lifecycle.

## PR validation pipeline

The PR pipeline is the first line of defense against a faulty change. Usual application code quality checks include linting and static analysis. From a GitOps perspective, you also need to assure the same quality for the resulting infrastructure to be deployed.

The application's Dockerfile and Helm charts can use linting in a similar way to the application.

Errors found during linting range from:
* Incorrectly formatted YAML files, to
* Best practice suggestions, such as setting CPU and Memory limits for your application.

> [!NOTE]
> To get the best coverage from Helm linting in a real application, you will need to substitute values that are reasonably similar to those used in a real environment.

Errors found during pipeline execution appear in the test results section of the run. From here, you can:
* Track the useful statistics on the error types.
* Find the first commit on which they were detected.
* Stack trace style links to the code sections that caused the error.

Once the pipeline run has finished, you have assured the quality of the application code and the template that will deploy it. You can now approve and complete the PR. The CI will run again, regenerating the templates and manifests, before triggering the CD pipeline.

> [!TIP]
> In a real environment, don't forget to set branch policies to ensure the PR passes your quality checks. For more information, see the [Set branch policies](/azure/devops/repos/git/branch-policies) article.

## CD process approvals

A successful CI pipeline run triggers the CD pipeline to complete the deployment process. Similar to the first time you can the CD pipeline, you'll deploy to each environment incrementally. This time, the pipeline requires you to approve each deployment environment.

1. Approve the deployment to the `dev` environment.
1. Once the template and manifest changes to the GitOps repo have been generated, the CD pipeline will create a commit, push it, and create a PR for approval.
1. Open the PR link given in the task.
1. Verify the changes to the GitOps repo. You should see:
   * High-level Helm template changes.
   * Low-level Kubernetes manifests that show the underlying changes to the desired state.
1. If everything looks good, approve and complete the PR.
1. Wait for the deployment to complete.
1. As a basic smoke test, navigate to the application page and verify the voting app now displays Tabs vs Spaces.
   * Forward the port locally using `kubectl` and ensure the app works correctly using:
   `kubectl port-forward -n dev svc/azure-vote-front 8080:80`
   * View the Azure Vote app in your browser at http://localhost:8080/ and verify the voting choices have changed to Tabs vs Spaces. 
1. Repeat steps 1-7 for the `stage` environment.

Your deployment is now complete. This ends the CI/CD workflow.

## Clean up resources

If you're not going to continue to use this application, delete any resources with the following steps:

1. Delete the Azure Arc GitOps configuration connection:
   ```azurecli
   az k8s-configuration delete \
   --name cluster-config \
   --cluster-name arc-cicd-cluster \
   --resource-group myResourceGroup \
   --cluster-type connectedClusters
   ```

2. Remove the `dev` namespace:
   * `kubectl delete namespace dev`

3. Remove the `stage` namespace:
   * `kubectl delete namespace stage`

## Next steps

In this tutorial, you have set up a full CI/CD workflow that implements DevOps from application development through deployment. Changes to the app automatically trigger validation and deployment, gated by manual approvals.

Advance to our conceptual article to learn more about GitOps and configurations with Azure Arc-enabled Kubernetes.

> [!div class="nextstepaction"]
> [CI/CD Workflow using GitOps - Azure Arc-enabled Kubernetes](./conceptual-gitops-ci-cd.md)
