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
# Implement CI/CD with GitOps using Azure Arc-enabled Kubernetes clusters

## Step by Step

This tutorial walks through setting up a CI/CD solution using GitOps with Azure Arc enabled Kubernetes clusters. For more information on this architecture, see the (TODO: link) architecture overview.

By the end of this tutorial, you'll have an GitOps enabled CI/CD workflow with the sample Azure Vote app.

### Before you begin

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

### Import the repos into Azure Repos

To complete this tutorial, you'll need to have an application repo (TODO: link to architecture section) and a GitOps repo (TODO: link to architecture section) in Azure Repos. For more information on importing external repos into Azure Repos, see the [Import a Git repo](https://docs.microsoft.com/azure/devops/repos/git/import-git-repository?view=azure-devops) documentation.

#### Application Repo
Import the application repo example at (TODO: finalize repo link) https://github.com/tcare/arc-cicd-demo-src. The repo should have the name **arc-cicd-demo-src**.

The application repo contains the example Azure Vote App application that you'll be deploying using GitOps.

#### GitOps
Import the GitOps repo example at (TODO: finalize repo) https://github.com/tcare/arc-cicd-demo-gitops. The repo should have the name **arc-cicd-demo-gitops**.

The GitOps repo is a base for your cluster resources that declaratively house Azure Vote App.

>[!NOTE]
> Having separate repositories for application and GitOps repos is advantageous.
> From the view of a cluster administrator, the changes in application code may not be relevant to the desired state of the cluster. Conversely for an application developer, knowing the specific parameters for each environment is not necessarily important - having a set of test values that provide coverage for the parameters may be sufficient.
> Using two repos can improve security since the permissions and visibility of the application and GitOps repositories can be tuned individually. For example, the GitOps repo could be administered by a smaller group with strict permissions.

### Understanding and connecting the GitOps repo

To continuously deploy your app, you'll need to connect the application repo to your cluster using GitOps. Your **arc-cicd-demo-gitops** repo contains the basic resources to get started your app up and running on your **arc-cicd-cluster** cluster.

Initially, the GitOps cluster only contains a (TODO: final link) manifest that creates the **dev** namespace corresponding to the first deployment environment.

The GitOps connection that you'll create will automatically sync the manifests in the manifest dir and update the cluster state. The CI/CD workflow will populate this directory with additional manifests to deploy the app.

#### Connect the GitOps repo

Create a new GitOps connection to your newly imported **arc-cicd-demo-gitops** repo in Azure Repos. When creating your GitOps connection, ensure that **only** the **arc-cicd-cluster/manifests** directory is the base path used by Flux, the GitOps operator. You can define the path by using the following operator parameter:

`--git-path=arc-cicd-cluster/manifests`

Use the [GitOps tutorial](https://docs.microsoft.com/azure/azure-arc/kubernetes/tutorial-use-gitops-connected-cluster) for detailed instructions on connecting the GitOps repo to your Azure Arc-enabled Kubernetes cluster.

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

Check the state of the deployment in Azure Portal. If successful, you should see a `dev` namespace created in your cluster.

### Import the pipelines

Now that you have a GitOps connection syncing, you'll need to create the CI/CD pipelines that create the manifests.

The application repo contains a .pipeline folder that has the pipelines you'll use for PRs, CI, and CD.

Import and rename the three pipelines provided in the sample repo:
- (TODO: link) .pipelines/az-vote-pr-pipeline.yaml - The application PR pipeline, named **arc-cicd-demo-src PR**
- (TODO: link) .pipelines/az-vote-ci-pipeline.yaml - The application CI pipeline, named **arc-cicd-demo-src CI**
- (TODO: link) .pipelines/az-vote-cd-pipeline.yaml - The CD pipeline, named **arc-cicd-demo-src CD**

### Connect your Azure Container Registry
Both your pipelines and cluster will be utilizing Azure Container Registry (ACR) to store and retrieve Docker images.

#### Connect ACR to Azure DevOps
During the CI process you'll be deploying the application containers to a registry. [Create an Azure service connection](https://docs.microsoft.com/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml#create-a-service-connection) for your ACR resource. Name the service connection **arc-demo-acr**. Make sure to select the resource group you will be using.

#### Connect ACR to Kubernetes
Your Kubernetes cluster needs to be able to pull images from your ACR. If it is private, authentication will be required.

- If you're using **Azure Kubernetes Service (AKS)** to host Azure Arc-enabled Kubernetes, you can follow the [Authentication Guide](https://docs.microsoft.com/azure/aks/cluster-container-registry-integration) to connect ACR with AKS.

- For non-AKS and local clusters, see the [image pull secret](https://docs.microsoft.com/azure/container-registry/container-registry-auth-kubernetes) tutorial.
> [!TIP]
> To avoid having to set an imagePullSecret for every Pod, consider adding the imagePullSecret to the Service account in the `dev` and `stage` namespaces. See the [Kubernetes tutorial](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) for more information.

### Create environment variable groups

#### App repo variable group
[Create a variable group](https://docs.microsoft.com/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml) and name it **az-vote-app-dev**. Set the following values:
| Variable | Value |
| -------- | ----- |
| AZ_ACR_NAME | (your ACR instance, e.g. azurearctest.azurecr.io) |
| AZURE_SUBSCRIPTION | (your Azure Service Connection, which should be **arc-demo-acr** from earlier in the tutorial) |
| AZURE_VOTE_IMAGE_REPO | The full path to the Azure Vote App repo, for example azurearctest.azurecr.io/azvote |
| ENVIRONMENT_NAME | Dev |
| MANIFESTS_BRANCH | master |
| MANIFESTS_REPO | The Git connection string for your GitOps repo |
| PAT | A [created PAT token](https://docs.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#create-a-pat) with Read/Write source permissions. Save it for later use in the Stage variable group. |
| SRC_FOLDER | azure-vote | 
| TARGET_CLUSTER | arc-cicd-cluster |
| TARGET_NAMESPACE | dev |

> [!IMPORTANT]
> Mark your PAT as a secret type. In your applications, consider linking secrets from an [Azure KeyVault](https://docs.microsoft.com/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml#link-secrets-from-an-azure-key-vault). 
> 
#### Stage environment variable group

Clone the az-vote-app-dev variable group and change the name to **az-vote-app-stage**

Ensure values for the following fields:

| Variable | Value |
| -------- | ----- |
| ENVIRONMENT_NAME | Stage |
| MANIFESTS_BRANCH | stage |
| TARGET_NAMESPACE | stage |

You should now have all the variables required for deployment to the dev and stage environments.

### Deploying the dev environment for the first time
With the CI and CD pipelines created, you can now deploy the app for the first time. Run the CI pipeline on the master branch.

#### CI pipeline

The first time the CI pipeline runs, you may get an error about authorization of resources to read the service connection name. Check the variable being accessed is AZURE_SUBSCRIPTION and authorize the use. Rerun the pipeline.

Completion of the CI pipeline ensures that the application change has completed all automated checks to pass quality gates for deployment. In addition to the code quality checks performed in the PR, additional validation can be performed that may not be relevant or feasible in the PR pipeline. Specific to GitOps, we also publish the artifacts for the commit that will be deployed by the CD pipeline. Note the Docker image has changed and the new image is pushed.

#### CD pipeline
The successful CI pipeline run will now trigger the CD pipeline to complete the deployment process. We will deploy to each environment incrementally, requiring approval for each deployment change and between each environment.

> [!TIP]
> If the CD pipeline does not automatically trigger, verify the name matches the branch trigger in (TODO: final link) .pipelines/arc-cd.yml. It should be `arc-cicd-demo-src CI`. Re-run the CI pipeline and try again.

Once the template and manifest changes to the GitOps repo have been generated, the CD pipeline will create a commit, push it, and create a PR for approval. Open the PR link that is given in the task, and verify the changes to the GitOps repo. You should see both the high level Helm template changes, and the low level Kubernetes manifests that show the underlying changes to the desired state. If everything looks good, approve and complete the PR.

A few minutes after the PR completes, Flux will pick up the change and start the deployment. Forward the port locally using `kubectl` and check the app works correctly:

`kubectl port-forward -n dev svc/azure-vote-front 8080:80`

You should see the Azure Vote app in your browser at http://localhost:8080/.

Vote for your favorite and get ready to make some changes to the app.

### Set up environment approvals
With the app deployed, it's easy to make changes to the code or templates to update the app. However, it is also easy to put the cluster into a bad state unintentionally.

If the dev environment reveals a break after deployment, you will want to be able to stop it from going to subsequent environments. To achieve this, you can use environment approvals.

Set up approvals for the dev environment following the [Define approval and checks](https://docs.microsoft.com/azure/devops/pipelines/process/approvals?view=azure-devops&tabs=check-pass) tutorial.

Next time the CD pipeline runs, the pipeline will pause after the GitOps PR has been created. Once you have verified the change has been synced properly and passes basic functionality, approve the check from the pipeline to let the change flow to the next environment.
### Make an application change

Now that you have a baseline set of template and manifests that represent the state on the cluster, you'll make a small change to the app. In the **arc-cicd-demo-src** repo, edit (TODO: final link) /azure-vote/src/azure-vote-front/config_file.cfg file.

Cats vs Dogs isn't getting enough votes, so you can change it to something to drive up the vote count: Tabs vs Spaces.

Commit the change in a new branch, push it, and create a pull request. This is the typical developer flow that will start the CI/CD lifecycle.

### PR Validation Pipeline

The PR pipeline is the first line of defense against a faulty change. In addition to the usual code quality checks on an application such as linting and static analysis, from a GitOps perspective we need to also assure the same quality for the resulting infrastructure that will be deployed.

The Dockerfile and Helm charts for the application can be linted in a similar way to the application. Example errors found in the linting step may range from incorrectly formatted YAML files to best practice suggestions, such as setting CPU and Memory limits for your application. In order to get the best coverage from Helm linting, you will need to substitute values that are reasonably similar to those used in a real environment.

Errors found during pipeline execution appear in the test results section of the run. From here you can track the errors found, including useful statistics on the error types, the first commit they were detected, and stack trace style links to the code sections that caused the error.

For more information on the linting performed in this example and its implementation, see the (TODO: link) pipelines/LINTING.md file in the repo.

Once the pipeline run has finished, you have performed the due diligence of assuring the quality of the application code and the template that will deploy it. You can now approve and complete the PR. The CI will run once again, regenerating the templates and manifests, before triggering the CD pipeline.

> [!TIP]
> In a real environment, don't forget to set branch policies to ensure the PR passes your quality checks. For more information, see the [Set branch policies](https://docs.microsoft.com/azure/devops/repos/git/branch-policies?view=azure-devops) article.

### Start the CD process

The successful CI pipeline run will triggers the CD pipeline to complete the deployment process. You'll deploy to each environment incrementally, requiring approval for each deployment change and between each environment.

Once the changes to the GitOps repo have been generated, the CD pipeline will create a commit, push it, and create a PR for approval. Open the PR link that is given in the task, and verify the changes to the GitOps repo. You should see both the high level Helm template changes, and the low level Kubernetes manifests that show the underlying changes to the desired state. If everything looks good, approve and complete the PR.

Soon after the PR completes, Flux will pick up the change and start the deployment. By default, Flux checks for Git changes every 5 minutes.

### Testing the environment
As a basic smoke test, navigate to the application page and verify the voting app now displays Tabs vs Spaces.

> [!TIP]
> A future version of Flux will allow notifications to be sent with status updates during a deployment.

### Multiple environments
After the initial deployment has completed, the pipeline waits for approval before starting deployment to the next environment. The CD process will then restart for the next environment.

## In Summary

In this tutorial you have set up a full CI/CD workflow that implements DevOps from application development through deployment. Changes to the app automatically trigger validation and deployment, gated by manual approvals.
