---
title: 'Tutorial: Implement CI/CD with GitOps using Azure Arc-enabled Kubernetes clusters'
description: This tutorial walks through setting up a CI/CD solution using GitOps with Azure Arc enabled Kubernetes clusters. For a conceptual take on this workflow, see the CI/CD Workflow using GitOps - Azure Arc enabled Kubernetes article. 
author: tcare
ms.author: tcare
ms.service: azure-arc
ms.topic: tutorial 
ms.date: 02/29/2021
ms.custom: template-tutorial 
---
# Tutorial: Implement CI/CD with GitOps using Azure Arc-enabled Kubernetes clusters


This tutorial walks through setting up a CI/CD solution using GitOps with Azure Arc enabled Kubernetes clusters. For more information on this architecture, see the (TODO: link) architecture overview.

By the end of this tutorial, you'll have an GitOps enabled CI/CD workflow with the sample Azure Vote app.
If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
## Before you begin

This tutorial assumes you're familiar with the following technologies and tutorials:


#### Configurations and GitOps with Azure Arc enabled Kubernetes
  - See the [conceptual overview](https://docs.microsoft.com/azure/azure-arc/kubernetes/conceptual-configurations) for more information on the architecture of GitOps with Azure Arc enabled Kubernetes clusters.
  - Walk through the [GitOps tutorial](https://docs.microsoft.com/azure/azure-arc/kubernetes/tutorial-use-gitops-connected-cluster) to understand the commands you'll use to deploy GitOps for your CI/CD environment.
#### Azure DevOps
  - You'll be using Azure DevOps to host the repos and pipelines for CI/CD.
  - See the [user tutorial](https://docs.microsoft.com/azure/devops/user-tutorial/sign-up-invite-teammates) to get started with Azure DevOps.
  - Ensure you have [permissions](https://docs.microsoft.com/azure/devops/organizations/security/about-permissions) to create and use [Azure Repos](https://docs.microsoft.com/azure/devops/repos/get-started/what-is-repos) and [Azure Pipelines](https://docs.microsoft.com/azure/devops/pipelines/get-started/pipelines-get-started).
#### Azure Container Registry
  - You'll use an Azure Container Registry to deploy images for the sample application.
  - If you're using Azure Kubernetes Services (AKS) to host Kubernetes, you can follow the [Authentication Guide](https://docs.microsoft.com/azure/aks/cluster-container-registry-integration) to connect Azure Container Registry (ACR) with AKS.
  - For non-AKS and local clusters, see the [image pull secret](https://docs.microsoft.com/azure/container-registry/container-registry-auth-kubernetes) tutorial.
  - You'll need to create connections during the tutorial.
- A local or [Azure Cloud shell](https://docs.microsoft.com/azure/cloud-shell/overview) environment with `kubectl` and the Azure CLI (`az`) commands installed and updated.
  - Make sure that you have Azure Arc Kubernetes CLI extensions installed and updated, as explained in the [Arc Connection](https://docs.microsoft.com/azure/azure-arc/kubernetes/quickstart-connect-cluster#install-the-azure-arc-enabled-kubernetes-cli-extensions) tutorial.

With these resources on hand, you're ready to create the GitOps CI/CD workflow.

## Create an Azure Arc-enabled Kubernetes Cluster
The cluster hosts the app and the GitOps operator used for continuous deployment.

This tutorial and the example code assume you're naming your cluster **arc-cicd-cluster**.

Create and connect a Kubernetes cluster to Azure arc using the [cluster connection quickstart](https://docs.microsoft.com/azure/azure-arc/kubernetes/connect-cluster).

## Import application and GitOps repos into Azure Repos

Import an application repo (TODO: link to architecture section) and a GitOps repo (TODO: link to architecture section) into Azure Repos. For this tutorial, use the following example repos:

* **arc-cicd-demo-src** application repo
   * URL: https://github.com/tcare/arc-cicd-demo-src
   * Contains the example Azure Vote App that you will deploy using GitOps.
* **arc-cicd-demo-gitops** GitOps repo
   * URL: https://github.com/tcare/arc-cicd-demo-gitops
   * Works as a base for your cluster resources that house the Azure Vote App.

Learn more about [importing Git repos](https://docs.microsoft.com/azure/devops/repos/git/import-git-repository?view=azure-devops).

#### Application Repo
Import the application repo example at (TODO: finalize repo link) https://github.com/tcare/arc-cicd-demo-src. The repo should have the name **arc-cicd-demo-src**.

The application repo contains the example Azure Vote App application that you'll be deploying using GitOps.

#### GitOps
Import the GitOps repo example at (TODO: finalize repo) https://github.com/tcare/arc-cicd-demo-gitops. The repo should have the name **arc-cicd-demo-gitops**.

The GitOps repo is a base for your cluster resources that declaratively house Azure Vote App.

>[!NOTE]
> Importing and using two separate repositories for application and GitOps repos can improve security and simplicity. The application and GitOps repositories' permissions and visibility can be tuned individually. 
> For example, the cluster administrator may not find the changes in application code relevant to the desired state of the cluster. Conversely, an application developer doesn't need to know the specific parameters for each environment - a set of test values that provide coverage for the parameters may be sufficient.

## Connect the GitOps repo

To continuously deploy your app, connect the application repo to your cluster using GitOps. Your **arc-cicd-demo-gitops** GitOps repo contains the basic resources to get your app up and running on your **arc-cicd-cluster** cluster.

The initial GitOps cluster contains only a (TODO: final link) manifest that creates the **dev** namespace corresponding to the first deployment environment.

The GitOps connection that you create will automatically:
* Sync the manifests in the manifest directory.
* Update the cluster state. 

The CI/CD workflow will populate the manifest directory with additional manifests to deploy the app.


1. [Create a new GitOps connection](https://docs.microsoft.com/azure/azure-arc/kubernetes/tutorial-use-gitops-connected-cluster) to your newly imported **arc-cicd-demo-gitops** repo in Azure Repos. 

   ```az k8sconfiguration create \
     --name cluster-config \
     --cluster-name arc-cicd-cluster \
     --resource-group myResourceGroup \
     --operator-instance-name cluster-config \
     --operator-namespace cluster-config \
     --repository-url https://dev.azure.com/<Your organization>/arc-cicd-demo-gitops \
     --https-user <Azure Repos username> \
     --https-key <Azure Repos PAT token> \
     --scope cluster \
     --cluster-type connectedClusters \
     --operator-params='--git-readonly --git-path=arc-cicd-cluster/manifests'

1. Ensure that Flux *only* uses the **arc-cicd-cluster/manifests** directory as the base path. Define the path by using the following operator parameter:

   `--git-path=arc-cicd-cluster/manifests`


> [!NOTE]
> If you are using an HTTPS connection string and are having connection problems, ensure you omit the username prefix in the URL. For example, `https://alice@dev.azure.com/contoso/arc-cicd-demo-gitops` must have `alice@` removed. The `--https-user` specifies the user instead, for example `--https-user alice`.

For example, if you are creating the cluster using Azure CLI, then your command might look similar to:
```
az k8sconfiguration create \
  --name cluster-config \
  --cluster-name arc-cicd-cluster \
  --resource-group AzureArcTest \
  --operator-instance-name cluster-config \
  --operator-namespace cluster-config \
  --repository-url https://dev.azure.com/<Your organization>/arc-cicd-demo-gitops \
  --https-user <Azure Repos username> \
  --https-key <Azure Repos PAT token> \
  --scope cluster \
  --cluster-type connectedClusters \
  --operator-params='--git-readonly --git-path=arc-cicd-cluster/manifests'
```

1. Check the state of the deployment in Azure Portal. 
   * If successful, you'll see a `dev` namespace created in your cluster.

## Import the CI/CD pipelines

Now that you've synced a GitOps connection, you'll need to import the CI/CD pipelines that create the manifests.

The application repo contains a .pipeline folder with the pipelines you'll use for PRs, CI, and CD. Import and rename the three pipelines provided in the sample repo:

| Pipeline file name | Description |
| ------------- | ------------- | 
| (TODO: link) .pipelines/az-vote-pr-pipeline.yaml  | The application PR pipeline, named **arc-cicd-demo-src PR** |
| (TODO: link) .pipelines/az-vote-ci-pipeline.yaml | The application CI pipeline, named **arc-cicd-demo-src CI** |
| (TODO: link) .pipelines/az-vote-cd-pipeline.yaml | The application CD pipeline, named **arc-cicd-demo-src CD** |



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
Enable your Kubernetes cluster to pull images from your ACR. If it is private, authentication will be required.

#### Connect ACR to existing AKS clusters

Integrate an existing ACR with existing AKS clusters using the following command:

```azurecli
az aks update -n arc-cicd-cluster -g myResourceGroup --attach-acr arc-demo-acr

#### Create an image pull secret

To connect non-AKS and local clusters to your ACR, create an image pull secret. Kubernetes uses image pull secrets to store information needed to authenticate your registry. 

Create an image pull secret with the following kubectl command:
```console
kubectl create secret docker-registry <secret-name> \
    --namespace <namespace> \
    --docker-server=<container-registry-name>.azurecr.io \
    --docker-username=<service-principal-ID> \
    --docker-password=<service-principal-password>
> [!TIP]
> To avoid having to set an imagePullSecret for every Pod, consider adding the imagePullSecret to the Service account in the `dev` and `stage` namespaces. See the [Kubernetes tutorial](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) for more information.

## Create environment variable groups

### App repo variable group
[Create a variable group](https://docs.microsoft.com/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml) named **az-vote-app-dev**. Set the following values:
| Variable | Value |
| -------- | ----- |
| AZ_ACR_NAME | (your ACR instance, e.g. azurearctest.azurecr.io) |
| AZURE_SUBSCRIPTION | (your Azure Service Connection, which should be **arc-demo-acr** from earlier in the tutorial) |
| AZURE_VOTE_IMAGE_REPO | The full path to the Azure Vote App repo, for example azurearctest.azurecr.io/azvote |
| ENVIRONMENT_NAME | Dev |
| MANIFESTS_BRANCH | master |
| MANIFESTS_REPO | The Git connection string for your GitOps repo |
| PAT | A [created PAT token](https://docs.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#create-a-pat) with Read/Write source permissions. Save it to use later when staging variable group. |
| SRC_FOLDER | azure-vote | 
| TARGET_CLUSTER | arc-cicd-cluster |
| TARGET_NAMESPACE | dev |

> [!IMPORTANT]
> Mark your PAT as a secret type. In your applications, consider linking secrets from an [Azure KeyVault](https://docs.microsoft.com/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml#link-secrets-from-an-azure-key-vault). 
> 
### Stage environment variable group

1. Clone the az-vote-app-dev variable group. 
1. Change the name to **az-vote-app-stage**.
1. Ensure the following values for the corresponding variables:

| Variable | Value |
| -------- | ----- |
| ENVIRONMENT_NAME | Stage |
| MANIFESTS_BRANCH | stage |
| TARGET_NAMESPACE | stage |

You're now ready to deploy to the dev and stage environments.

## Deploy the dev environment for the first time
With the CI and CD pipelines created, you can now deploy the app for the first time. Run the CI pipeline on the master branch.

### CI pipeline

During the initial CI pipeline run, you may get a resource authorization error in reading the service connection name. 
1. Verify the variable being accessed is AZURE_SUBSCRIPTION.
1. Authorize the use. 
1. Rerun the pipeline.

1. Ensure the application change passed all automated quality checks for deployment. 
1. Perform any extra validation that couldn't be completed in the PR pipeline. 
    * Specific to GitOps, you also publish the artifacts for the commit that will be deployed by the CD pipeline. 
1. Verify the Docker image has changed and the new image is pushed.

### CD pipeline
The successful CI pipeline run triggers the CD pipeline to complete the deployment process. You'll deploy to each environment incrementally, requiring approval for each deployment change and between each environment.

> [!TIP]
> If the CD pipeline does not automatically trigger: 
> 1. Verify the name matches the branch trigger in (TODO: final link) .pipelines/arc-cd.yml. 
>    * It should be `arc-cicd-demo-src CI`. 
> 1. Rerun the CI pipeline.

Once the template and manifest changes to the GitOps repo have been generated, the CD pipeline will create a commit, push it, and create a PR for approval. 
1. Open the PR link given in the task. 
1. Verify the changes to the GitOps repo. You should see:
   * High-level Helm template changes.
   * Low-level Kubernetes manifests that show the underlying changes to the desired state. 
1. If everything looks good, approve and complete the PR.

1. After a few minutes, Flux picks up the change and starts the deployment. 
1. Forward the port locally using `kubectl` and ensure the app works correctly using:

   `kubectl port-forward -n dev svc/azure-vote-front 8080:80`

1. View the Azure Vote app in your browser at http://localhost:8080/.

1. Vote for your favorites and get ready to make some changes to the app.

## Set up environment approvals
Upon app deployment, you can not only make changes to the code or templates, but you can also unintentionally put the cluster into a bad state.

If the dev environment reveals a break after deployment, keep it from going to subsequent environments using environment approvals.

1. In your Azure DevOps project, go to the environment that needs to be protected.
1. Navigate to **Approvals and Checks** for the resource.
1. Select **Create**.
1. Provide the approvers and an optional message. 
1. Select **Create** again to complete the addition of the manual approval check.

For more details, see the [Define approval and checks](https://docs.microsoft.com/azure/devops/pipelines/process/approvals?view=azure-devops&tabs=check-pass) tutorial.

Next time the CD pipeline runs, the pipeline will pause after the GitOps PR creation. Verify the change has been synced properly and passes basic functionality. Approve the check from the pipeline to let the change flow to the next environment.
## Make an application change

With this baseline set of templates and manifests representing the state on the cluster, you'll make a small change to the app. 

1. In the **arc-cicd-demo-src** repo, edit (TODO: final link) /azure-vote/src/azure-vote-front/config_file.cfg file.

1. Since "Cats vs Dogs" isn't getting enough votes, change it to "Tabs vs Spaces" to drive up the vote count.

1. Commit the change in a new branch, push it, and create a pull request. 
   * This is the typical developer flow that will start the CI/CD lifecycle.

## PR validation pipeline

The PR pipeline is the first line of defense against a faulty change. Usual application code quality checks include linting and static analysis. From a GitOps perspective, you also need to assure the same quality for the resulting infrastructure to be deployed.

The application's Dockerfile and Helm charts can be linted in a similar way to the application. 

Errors found during linting range from:
* Incorrectly formatted YAML files, to 
* Best practice suggestions, such as setting CPU and Memory limits for your application. 

To get the best coverage from Helm linting for this example, you will need to substitute values that are reasonably similar to those used in a real environment.

Errors found during pipeline execution appear in the test results section of the run. From here, you can:
* Track the useful statistics on the error types.
* Find the first commit on which they were detected.
* Stack trace style links to the code sections that caused the error.

For more information on the linting performed in this example and its implementation, see the (TODO: link) pipelines/LINTING.md file in the repo.

Once the pipeline run has finished, you have assured the quality of the application code and the template that will deploy it. You can now approve and complete the PR. The CI will run again, regenerating the templates and manifests, before triggering the CD pipeline.

> [!TIP]
> In a real environment, don't forget to set branch policies to ensure the PR passes your quality checks. For more information, see the [Set branch policies](https://docs.microsoft.com/azure/devops/repos/git/branch-policies?view=azure-devops) article.

## Start the CD process

The successful CI pipeline run will triggers the CD pipeline to complete the deployment process. You'll deploy to each environment incrementally, requiring approval for each deployment change and between each environment.

Once the changes to the GitOps repo have been generated, the CD pipeline will create a commit, push it, and create a PR for approval. Open the PR link that is given in the task, and verify the changes to the GitOps repo. You should see both the high level Helm template changes, and the low level Kubernetes manifests that show the underlying changes to the desired state. If everything looks good, approve and complete the PR.

Soon after the PR completes, Flux will pick up the change and start the deployment. By default, Flux checks for Git changes every 5 minutes.

## Test the environment
As a basic smoke test, navigate to the application page and verify the voting app now displays Tabs vs Spaces.

> [!TIP]
> A future version of Flux will allow notifications to be sent with status updates during a deployment.

## Multiple environments
After the initial deployment has completed, the pipeline waits for approval before starting deployment to the next environment. The CD process will then restart for the next environment.

## Next steps

In this tutorial you have set up a full CI/CD workflow that implements DevOps from application development through deployment. Changes to the app automatically trigger validation and deployment, gated by manual approvals.

Advance to our conceptual article to learn more about GitOps and configurations with Azure Arc enabled Kubernetes.

> [!div class="nextstepaction"]
> [Configurations and GitOps with Azure Arc enabled Kubernetes](https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/conceptual-configurations)
