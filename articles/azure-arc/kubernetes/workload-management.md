---
title: 'Explore workload management in a multi-cluster environment with GitOps'
description: Explore typical use-cases that Platform and Application teams face on a daily basis working with Kubernetes workloads in a multi-cluster environment.
keywords: "GitOps, Flux, Kubernetes, K8s, Azure, Arc, AKS, ci/cd, devops"
author: eedorenko
ms.author: iefedore
ms.topic: how-to
ms.date: 03/29/2023
---

# Explore workload management in a multi-cluster environment with GitOps

Enterprise organizations, developing cloud native applications, face challenges to deploy, configure and promote a great variety of applications and services across multiple Kubernetes clusters at scale. This environment may include Azure Kubernetes Service (AKS) clusters, clusters running on other public cloud providers, or clusters in on-premises data centers that are connected to Azure through the Azure Arc. Refer to the [conceptual article](conceptual-workload-management.md) exploring the business process, challenges and solution architecture.

This article walks you through an example scenario of the workload deployment and configuration in a multi-cluster Kubernetes environment. First, you deploy a sample infrastructure with a few GitHub repositories and AKS clusters. Next, you work through a set of use cases where you act as different personas working in the same environment: the Platform Team and the Application Team.

## Prerequisites

In order to successfully deploy the sample, you need:

- An Azure subscription. If you don't already have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli)
- [GitHub CLI](https://cli.github.com)
- [Helm](https://helm.sh/docs/helm/helm_install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
- [jq](https://stedolan.github.io/jq/download/)
- GitHub token with the following scopes: `repo`, `workflow`, `write:packages`, `delete:packages`, `read:org`, `delete_repo`.

## 1 - Deploy the sample

To deploy the sample, run the following script:

```bash
mkdir kalypso && cd kalypso
curl -fsSL -o deploy.sh https://raw.githubusercontent.com/microsoft/kalypso/main/deploy/deploy.sh
chmod 700 deploy.sh
./deploy.sh -c -p <prefix. e.g. kalypso> -o <github org. e.g. eedorenko> -t <github token> -l <azure-location. e.g. westus2> 
```

This script may take 10-15 minutes to complete. After it's done, it reports the execution result in the output like this:

```output
Deployment is complete!
---------------------------------
Created repositories:
  - https://github.com/eedorenko/kalypso-control-plane
  - https://github.com/eedorenko/kalypso-gitops
  - https://github.com/eedorenko/kalypso-app-src
  - https://github.com/eedorenko/kalypso-app-gitops
---------------------------------
Created AKS clusters in kalypso-rg resource group:
  - control-plane
  - drone (Flux based workload cluster)
  - large (ArgoCD based workload cluster)
---------------------------------  
```

> [!NOTE]
> If something goes wrong with the deployment, you can delete the created resources with the following command:
> 
> ```bash
> ./deploy.sh -d -p <preix. e.g. kalypso> -o <github org. e.g. eedorenko> -t <github token> -l <azure-location. e.g. westus2> 
> ```

### Sample overview

This deployment script created an infrastructure, shown in the following diagram:

:::image type="content" source="media/workload-management/infra-diagram.png" alt-text="Diagram showing the infrastructure of the sample.":::

There are a few Platform Team repositories:

- [Control Plane](https://github.com/microsoft/kalypso-control-plane): Contains a platform model defined with high level abstractions such as environments, cluster types, applications and services, mapping rules and configurations, and promotion workflows.
- [Platform GitOps](https://github.com/microsoft/kalypso-gitops): Contains final manifests that represent the topology of the multi-cluster environment, such as which cluster types are available in each environment, what workloads are scheduled on them, and what platform configuration values are set.
- [Services Source](https://github.com/microsoft/kalypso-svc-src): Contains high-level manifest templates of sample dial-tone platform services.
- [Services GitOps](https://github.com/microsoft/kalypso-svc-gitops): Contains final manifests of sample dial-tone platform services to be deployed across the clusters.

The infrastructure also includes a couple of the Application Team repositories:

- [Application Source](https://github.com/microsoft/kalypso-app-src): Contains a sample application source code, including Docker files, manifest templates and CI/CD workflows.
- [Application GitOps](https://github.com/microsoft/kalypso-app-gitops): Contains final sample application manifests to be deployed to the deployment targets.

The script created the following Azure Kubernetes Service (AKS) clusters:

- `control-plane` - This cluster is a management cluster that doesn't run any workloads. The `control-plane` cluster hosts [Kalypso Scheduler](https://github.com/microsoft/kalypso-scheduler) operator that transforms high level abstractions from the [Control Plane](https://github.com/microsoft/kalypso-control-plane) repository to the raw Kubernetes manifests in the [Platform GitOps](https://github.com/microsoft/kalypso-gitops) repository.
- `drone` - A sample workload cluster. This cluster has the [GitOps extension](conceptual-gitops-flux2.md) installed and it uses `Flux` to reconcile manifests from the [Platform GitOps](https://github.com/microsoft/kalypso-gitops) repository. For this sample, the `drone` cluster can represent an Azure Arc-enabled cluster or an AKS cluster with the Flux/GitOps extension.
- `large` - A sample workload cluster. This cluster has `ArgoCD` installed on it to reconcile manifests from the [Platform GitOps](https://github.com/microsoft/kalypso-gitops) repository.

### Explore Control Plane

The `control plane` repository contains three branches: `main`, `dev` and `stage`. The `dev` and `stage` branches contain configurations that are specific for `Dev` and `Stage` environments. On the other hand, the `main` branch doesn't represent any specific environment. The content of the `main` branch is common and used by all environments. Any change to the `main` branch is a subject to be promoted across environments. For example, a new application or a new template can be promoted to the `Stage` environment only after successful testing on the `Dev` environment.

The `main` branch:

|Folder|Description|
|------|-----------|
|.github/workflows| Contains GitHub workflows that implement the promotional flow.|
|.environments| Contains a list of environments with pointers to the branches with the environment configurations.|
|templates| Contains manifest templates for various reconcilers (for example, Flux and ArgoCD) and a template for the workload namespace.| 
|workloads| Contains a list of onboarded applications and services with pointers to the corresponding GitOps repositories.|  

The `dev` and `stage` branches:

|Item|Description|
|----|-----------|
|cluster-types| Contains a list of available cluster types in the environment. The cluster types are grouped in custom subfolders. Each cluster type is marked with a set of labels. It specifies a reconciler type that it uses to fetch the manifests from GitOps repositories. The subfolders also contain a number of config maps with the platform configuration values available on the cluster types.|
|configs/dev-config.yaml| Contains config maps with the platform configuration values applicable for all cluster types in the environment.|
|scheduling| Contains scheduling policies that map workload deployment targets to the cluster types in the environment.|
|base-repo.yaml| A pointer to the place in the `Control Plane` repository (`main`) from where the scheduler should take templates and workload registrations.| 
|gitops-repo.yaml| A pointer to the place in the `Platform GitOps` repository to where the scheduler should PR generated manifests.|

> [!TIP]
> The folder structure in the `Control Plane` repository doesn't really matter. This example provides one way of organizing files in the repository, but feel free to do it in your own preferred way. The scheduler is interested in the content of the files, rather than where the files are located.

## 2 - Platform Team: Onboard a new application

The Application Team runs their software development lifecycle. They build their application and promote it across environments. They're not aware of what cluster types are available and where their application will be deployed. But they do know that they want to deploy their application in `Dev` environment for functional and performance testing and in `Stage` environment for UAT testing.

The Application Team describes this intention in the [workload](https://github.com/microsoft/kalypso-app-src/blob/main/workload/workload.yaml) file in the [Application Source](https://github.com/microsoft/kalypso-app-src) repository:

```yaml
apiVersion: scheduler.kalypso.io/v1alpha1
kind: Workload
metadata:
  name: hello-world-app
  labels:
    type: application
    family: force
spec:
  deploymentTargets:
    - name: functional-test
      labels:
        purpose: functional-test
        edge: "true"
      environment: dev
      manifests:
        repo: https://github.com/microsoft/kalypso-app-gitops
        branch: dev
        path: ./functional-test
    - name: performance-test
      labels:
        purpose: performance-test
        edge: "false"
      environment: dev
      manifests:
        repo: https://github.com/microsoft/kalypso-app-gitops
        branch: dev
        path: ./performance-test   
    - name: uat-test
      labels:
        purpose: uat-test
      environment: stage
      manifests:
        repo: https://github.com/microsoft/kalypso-app-gitops
        branch: stage
        path: ./uat-test   
```

This file contains a list of three deployment targets. These targets are marked with custom labels and point to the folders in [Application GitOps](https://github.com/microsoft/kalypso-app-gitops) repository where the Application Team generates application manifests for each deployment target.

With this file, Application Team requests Kubernetes compute resources from the Platform Team. In response, the Platform Team must register the application in the [Control Plane](https://github.com/microsoft/kalypso-control-plane) repo.
 
To register the application, open a terminal and use the following script: 

```bash
export org=<github org>
export prefix=<prefix>

# clone the control-plane repo
git clone https://github.com/$org/$prefix-control-plane control-plane
cd control-plane

# create workload registration file

cat <<EOF >workloads/hello-world-app.yaml
apiVersion: scheduler.kalypso.io/v1alpha1
kind: WorkloadRegistration
metadata:
  name: hello-world-app
  labels:
    type: application
spec:
  workload:
    repo: https://github.com/$org/$prefix-app-src
    branch: main
    path: workload/
  workspace: kaizen-app-team
EOF

git add .
git commit -m 'workload registration'
git push
```

> [!NOTE]
> For simplicity, this example pushes changes directly to `main`. In practice, you'd create a pull request to submit the changes.  

With that in place, the application is onboarded in the control plane. But the control plane still doesn't know how to map the application deployment targets to all of the cluster types.

### Define application scheduling policy on Dev

The Platform Team must define how the application deployment targets will be scheduled on cluster types in the `Dev` environment. To do this, submit scheduling policies for the `functional-test` and `performance-test` deployment targets with the following script:  

```bash
# Switch to dev branch (representing Dev environemnt) in the control-plane folder
git checkout dev
mkdir -p scheduling/kaizen

# Create a scheduling policy for the functional-test deployment target
cat <<EOF >scheduling/kaizen/functional-test-policy.yaml
apiVersion: scheduler.kalypso.io/v1alpha1
kind: SchedulingPolicy
metadata:
  name: functional-test-policy
spec:
  deploymentTargetSelector:
    workspace: kaizen-app-team
    labelSelector:
      matchLabels:
        purpose: functional-test
        edge: "true"
  clusterTypeSelector:
    labelSelector:
      matchLabels:
        restricted: "true"
        edge: "true"
EOF

# Create a scheduling policy for the performance-test deployment target
cat <<EOF >scheduling/kaizen/performance-test-policy.yaml
apiVersion: scheduler.kalypso.io/v1alpha1
kind: SchedulingPolicy
metadata:
  name: performance-test-policy
spec:
  deploymentTargetSelector:
    workspace: kaizen-app-team
    labelSelector:
      matchLabels:
        purpose: performance-test
        edge: "false"
  clusterTypeSelector:
    labelSelector:
      matchLabels:
        size: large
EOF

git add .
git commit -m 'application scheduling policies'
git config pull.rebase false
git pull --no-edit
git push
```

The first policy states that all deployment targets from the `kaizen-app-team` workspace, marked with labels `purpose: functional-test` and `edge: "true"` should be scheduled on all environment cluster types that are marked with label `restricted: "true"`. You can treat a workspace as a group of applications produced by an application team.

The second policy states that all deployment targets from the `kaizen-app-team` workspace, marked with labels `purpose: performance-test` and `edge: "false"` should be scheduled on all environment cluster types that are marked with label `size: "large"`.

This push to the `dev` branch triggers the scheduling process and creates a PR to the `dev` branch in the `Platform GitOps` repository:

:::image type="content" source="media/workload-management/pr-to-dev-with-app-assignment.png" alt-text="Screenshot showing a PR to dev environment with application assignment." lightbox="media/workload-management/pr-to-dev-with-app-assignment.png":::

Besides `Promoted_Commit_id`, which is just tracking information for the promotion CD flow, the PR contains assignment manifests. The `functional-test` deployment target is assigned to the `drone` cluster type, and the `performance-test` deployment target is assigned to the `large` cluster type. Those manifests will land in `drone` and `large` folders that contain all assignments to these cluster types in the `Dev` environment.
 
The `Dev` environment also includes `command-center` and `small` cluster types:

 :::image type="content" source="media/workload-management/dev-cluster-types.png" alt-text="Screenshot showing cluster types in the Dev environment.":::

However, only the `drone` and `large` cluster types were selected by the scheduling policies that you defined.

### Understand deployment target assignment manifests

Before you continue, take a closer look at the generated assignment manifests for the `functional-test` deployment target. There are `namespace.yaml`, `config.yaml` and `reconciler.yaml` manifest files.

`namespace.yaml` defines a namespace that will be created on any `drone` cluster where the `hello-world` application runs.
 
```yaml
apiVersion: v1
kind: Namespace
metadata:
  labels:
    deploymentTarget: hello-world-app-functional-test
    environment: dev
    someLabel: some-value
    workload: hello-world-app
    workspace: kaizen-app-team
  name: dev-kaizen-app-team-hello-world-app-functional-test
```

`config.yaml` contains all platform configuration values available on any `drone` cluster that the application can use in the `Dev` environment.
 
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: platform-config
  namespace: dev-kaizen-app-team-hello-world-app-functional-test
data:
  CLUSTER_NAME: Drone
  DATABASE_URL: mysql://restricted-host:3306/mysqlrty123
  ENVIRONMENT: Dev
  REGION: East US
  SOME_COMMON_ENVIRONMENT_VARIABLE: "false"
```

`reconciler.yaml` contains Flux resources that a `drone` cluster uses to fetch application manifests, prepared by the Application Team for the `functional-test` deployment target.
 
```yaml
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: GitRepository
metadata:
  name: hello-world-app-functional-test
  namespace: flux-system
spec:
  interval: 30s
  ref:
    branch: dev
  secretRef:
    name: repo-secret
  url: https://github.com/<github org>/<prefix>-app-gitops
---
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: hello-world-app-functional-test
  namespace: flux-system
spec:
  interval: 30s
  path: ./functional-test
  prune: true
  sourceRef:
    kind: GitRepository
    name: hello-world-app-functional-test
  targetNamespace: dev-kaizen-app-team-hello-world-app-functional-test
```

> [!NOTE]
> The `control plane` defines that the `drone` cluster type uses `Flux` to reconcile manifests from the application GitOps repositories. The `large` cluster type, on the other hand, reconciles manifests with `ArgoCD`. Therefore `reconciler.yaml` for the `performance-test` deployment target will look differently and contain `ArgoCD` resources.

### Promote application to Stage

Once you approve and merge the PR to the `Platform GitOps` repository, the `drone` and `large` AKS clusters that represent corresponding cluster types start fetching the assignment manifests. The `drone` cluster has [GitOps extension](conceptual-gitops-flux2.md) installed, pointing to the `Platform GitOps` repository. It reports its `compliance` status to Azure Resource Graph: 

:::image type="content" source="media/workload-management/drone-compliance-state.png" alt-text="Screenshot showing compliance state details for the drone cluster.":::

The PR merging event starts a GitHub workflow `checkpromote` in the `control plane` repository. This workflow waits until all clusters with the [GitOps extension](conceptual-gitops-flux2.md) installed that are looking at the `dev` branch in the `Platform GitOps` repository are compliant with the PR commit. In this example, the only such cluster is `drone`.

:::image type="content" source="media/workload-management/checkpromote-to-dev.png" alt-text="Screenshot showing promotion to dev.":::

Once the `checkpromote` is successful, it starts the `cd` workflow that promotes the change (application registration) to the `Stage` environment. For better visibility, it also updates the git commit status in the `control plane` repository:

:::image type="content" source="media/workload-management/dev-git-commit-status.png" alt-text="Screenshot showing git commit status deploying to dev.":::

> [!NOTE]
> If the `drone` cluster fails to reconcile the assignment manifests for any reason, the promotion flow will fail. The commit status will be marked as failed, and the application registration will not be promoted to the `Stage` environment.

Next, configure a scheduling policy for the `uat-test` deployment target in the stage environment:  

```bash
# Switch to stage branch (representing Stage environemnt) in the control-plane folder
git checkout stage
mkdir -p scheduling/kaizen

# Create a scheduling policy for the uat-test deployment target
cat <<EOF >scheduling/kaizen/uat-test-policy.yaml
apiVersion: scheduler.kalypso.io/v1alpha1
kind: SchedulingPolicy
metadata:
  name: uat-test-policy
spec:
  deploymentTargetSelector:
    workspace: kaizen-app-team
    labelSelector:
      matchLabels:
        purpose: uat-test
  clusterTypeSelector:
    labelSelector: {}
EOF

git add .
git commit -m 'application scheduling policies'
git config pull.rebase false
git pull --no-edit
git push
```

The policy states that all deployment targets from the `kaizen-app-team` workspace marked with labels `purpose: uat-test` should be scheduled on all cluster types defined in the environment. 

Pushing this policy to the `stage` branch triggers the scheduling process, which creates a PR with the assignment manifests to the `Platform GitOps` repository, similar to those for the `Dev` environment.

As in the case with the `Dev` environment, after reviewing and merging the PR to the `Platform GitOps` repository, the `checkpromote` workflow in the `control plane` repository waits until clusters with the [GitOps extension](conceptual-gitops-flux2.md) (`drone`) reconcile the assignment manifests.

 :::image type="content" source="media/workload-management/check-promote-to-stage.png" alt-text="Screenshot showing promotion to stage.":::

On successful execution, the commit status is updated.

:::image type="content" source="media/workload-management/stage-git-commit-status.png" alt-text="Screenshot showing successful commit status.":::

## 3 - Application Dev Team: Build and deploy application

The Application Team regularly submits pull requests to the `main` branch in the `Application Source` repository. Once a PR is merged to `main`, it starts a CI/CD workflow. Here, the workflow will be started manually.

 Go to the `Application Source` repository in GitHub. On the `Actions` tab, select `Run workflow`.

:::image type="content" source="media/workload-management/run-workflow-button.png" alt-text="Screenshot showing the Run workflow option.":::

The workflow performs the following actions:

- Builds the application Docker image and pushes it to the GitHub repository package.
- Generates manifests for the `functional-test` and `performance-test` deployment targets. It uses configuration values from the `dev-configs` branch. The generated manifests are added to a pull request and auto-merged in the `dev` branch.
- Generates manifests for the `uat-test` deployment target. It uses configuration values from the `stage-configs` branch. 

:::image type="content" source="media/workload-management/cicd-workflow.png" alt-text="Screenshot showing the CI/CD workflow." lightbox="media/workload-management/cicd-workflow.png":::

The generated manifests are added to a pull request to the `stage` branch waiting for approval:

:::image type="content" source="media/workload-management/app-pr-to-stage.png" alt-text="Screenshot showing a PR to stage.":::

To test the application manually on the `Dev` environment before approving the PR to the `Stage` environment, first verify how the `functional-test` application instance works on the `drone` cluster:

```bash
kubectl port-forward svc/hello-world-service -n dev-kaizen-app-team-hello-world-app-functional-test 9090:9090 --context=drone

# output:
# Forwarding from 127.0.0.1:9090 -> 9090
# Forwarding from [::1]:9090 -> 9090

```

While this command is running, open `localhost:9090` in your browser. You'll see the following greeting page:

:::image type="content" source="media/workload-management/dev-greeting-page.png" alt-text="Screenshot showing the Dev greeting page.":::

The next step is to check how the `performance-test` instance works on the `large` cluster:

```bash
kubectl port-forward svc/hello-world-service -n dev-kaizen-app-team-hello-world-app-performance-test 8080:8080 --context=large

# output:
# Forwarding from 127.0.0.1:8080 -> 8080
# Forwarding from [::1]:8080 -> 8080

```

This time, use `8080` port and open `localhost:8080` in your browser.

Once you're satisfied with the `Dev` environment, approve and merge the PR to the `Stage` environment. After that, test the `uat-test` application instance in the `Stage` environment on both clusters.

Run the following command for the `drone` cluster and open `localhost:8001` in your browser:
 
```bash
kubectl port-forward svc/hello-world-service -n stage-kaizen-app-team-hello-world-app-uat-test 8001:8000 --context=drone
```

Run the following command for the `large` cluster and open `localhost:8002` in your browser:

 ```bash
kubectl port-forward svc/hello-world-service -n stage-kaizen-app-team-hello-world-app-uat-test 8002:8000 --context=large
```

> [!NOTE]
> It may take up to three minutes to reconcile the changes from the application GitOps repository on the `large` cluster. 

The application instance on the `large` cluster shows the following greeting page:

 :::image type="content" source="media/workload-management/stage-greeting-page.png" alt-text="Screenshot showing the greeting page on stage.":::

## 4 - Platform Team: Provide platform configurations

Applications in the clusters grab the data from the very same database in both `Dev` and `Stage` environments. Let's change it and configure `west-us` clusters to provide a different database url for the applications working in the `Stage` environment:

```bash
# Switch to stage branch (representing Stage environemnt) in the control-plane folder
git checkout stage

# Update a config map with the configurations for west-us clusters
cat <<EOF >cluster-types/west-us/west-us-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: west-us-config
  labels:
     platform-config: "true"
     region: west-us
data:
  REGION: West US
  DATABASE_URL: mysql://west-stage:8806/mysql2
EOF

git add .
git commit -m 'database url configuration'
git config pull.rebase false
git pull --no-edit
git push
```

The scheduler scans all config maps in the environment and collects values for each cluster type based on label matching. Then, it puts a `platform-config` config map in every deployment target folder in the `Platform GitOps` repository. The `platform-config` config map contains all of the platform configuration values that the workload can use on this cluster type in this environment.

In a few seconds, a new PR to the `stage` branch in the `Platform GitOps` repository appears:

:::image type="content" source="media/workload-management/stage-db-url-update-pr.png" alt-text="Screenshot showing a PR to update the database URL on stage." lightbox="media/workload-management/stage-db-url-update-pr.png":::

Approve the PR and merge it.

The `large` cluster is handled by ArgoCD, which, by default, is configured to reconcile every three minutes. This cluster doesn't report its compliance state to Azure like the clusters such as `drone` that have the [GitOps extension](conceptual-gitops-flux2.md). However, you can still monitor the reconciliation state on the cluster with ArgoCD UI. 

To access the ArgoCD UI on the `large` cluster, run the following command:

```bash
# Get ArgoCD username and password
echo "ArgoCD username: admin, password: $(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" --context large| base64 -d)"
# output:
# ArgoCD username: admin, password: eCllTELZdIZfApPL

kubectl port-forward svc/argocd-server 8080:80 -n argocd --context large
```

Next, open `localhost:8080` in your browser and provide the username and password printed by the script. You'll see a web page similar to this one:

 :::image type="content" source="media/workload-management/argocd-ui.png" alt-text="Screenshot showing the Argo CD user interface web page." lightbox="media/workload-management/argocd-ui.png":::

Select the `stage` tile to see more details on the reconciliation state from the `stage` branch to this cluster. You can select the `SYNC` buttons to force the reconciliation and speed up the process.

Once the new configuration has arrived to the cluster, check the `uat-test` application instance at `localhost:8002` after 
running the following commands:

```bash
kubectl rollout restart deployment hello-world-deployment -n stage-kaizen-app-team-hello-world-app-uat-test --context=large
kubectl port-forward svc/hello-world-service -n stage-kaizen-app-team-hello-world-app-uat-test 8002:8000 --context=large
```

You'll see the updated database url:

:::image type="content" source="media/workload-management/updated-db-url-page.png" alt-text="Screenshot showing a page with updated database url." lightbox="media/workload-management/updated-db-url-page.png":::

## 5 - Platform Team: Add cluster type to environment

Currently, only `drone` and `large` cluster types are included in the `Stage` environment. Let's include the `small` cluster type to `Stage` as well. Even though there's no physical cluster representing this cluster type, you can see how the scheduler reacts to this change.

```bash
# Switch to stage branch (representing Stage environemnt) in the control-plane folder
git checkout stage

# Add "small" cluster type in west-us region
mkdir -p cluster-types/west-us/small
cat <<EOF >cluster-types/west-us/small/small-cluster-type.yaml
apiVersion: scheduler.kalypso.io/v1alpha1
kind: ClusterType
metadata:
  name: small
  labels: 
    region: west-us
    size: small
spec:
  reconciler: argocd
  namespaceService: default
EOF

git add .
git commit -m 'add new cluster type'
git config pull.rebase false
git pull --no-edit
git push
```

In a few seconds, the scheduler submits a PR to the `Platform GitOps` repository. According to the `uat-test-policy` that you created, it assigns the `uat-test` deployment target to the new cluster type, as it's supposed to work on all available cluster types in the environment.

:::image type="content" source="media/workload-management/small-cluster-type-assignment.png" alt-text="Screenshot showing the assignment for the small cluster type." lightbox="media/workload-management/small-cluster-type-assignment.png":::

## Clean up resources
When no longer needed, delete the resources that you created. To do so, run the following command:

```bash
# In kalypso folder
./deploy.sh -d -p <preix. e.g. kalypso> -o <github org. e.g. eedorenko> -t <github token> -l <azure-location. e.g. westus2> 
```

## Next steps

You have performed tasks for a few common workload management scenarios in a multi-cluster Kubernetes environment. There are many other scenarios you may want to explore. Continue to use the sample and see how you can implement use cases that are most common in your daily activities.

To understand the underlying concepts and mechanics deeper, refer to the following resources:

> [!div class="nextstepaction"]
> - [Concept: Workload Management in Multi-cluster environment with GitOps](conceptual-workload-management.md)
> - [Sample implementation: Workload Management in Multi-cluster environment with GitOps](https://github.com/microsoft/kalypso)

