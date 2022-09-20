---
title: Build, test, and deploy containers to Azure Kubernetes Service using GitHub Actions
description:  Learn how to use GitHub Actions to deploy your container to Kubernetes
services: container-service
ms.topic: article
ms.date: 08/02/2022
ms.custom: github-actions-azure
---

# GitHub Actions for deploying to Kubernetes service

[GitHub Actions](https://docs.github.com/en/actions) gives you the flexibility to build an automated software development lifecycle workflow. You can use multiple Kubernetes actions to deploy to containers from Azure Container Registry to Azure Kubernetes Service with GitHub Actions.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).
- An existing AKS cluster with an attached Azure Container Registry (ACR).

## Configure integration between Azure and your GitHub repository

When using GitHub Actions, you need to configure the integration between Azure and your GitHub repository. For more details on connecting your GitHub repository to Azure, see [Use GitHub Actions to connect to Azure][connect-gh-azure].

## Available actions

GitHub Actions helps you automate your software development workflows from within GitHub. For more details on using GitHub Actions with Azure, see [What is GitHub Actions for Azures][github-actions].

The below table shows the available GitHub Actions that integrate specifically with AKS.

| Name | Description | More details |
|---|---|---|
|`azure/aks-set-context`|Set the target AKS cluster context which will be used by other actions or run any kubectl commands.|[azure/aks-set-context][azure/aks-set-context]|
|`azure/k8s-set-context`|Set the target Kubernetes cluster context which will be used by other actions or run any kubectl commands.|[azure/k8s-set-context][azure/k8s-set-context]|
|`azure/k8s-bake`|Bake manifest file to be used for deployments using Helm, kustomize or kompose.|[azure/k8s-bake][azure/k8s-bake]|
|`azure/k8s-create-secret`|Create a generic secret or docker-registry secret in the Kubernetes cluster.|[azure/k8s-create-secret][azure/k8s-create-secret]|
|`azure/k8s-deploy`|Deploy manifests to Kubernetes clusters.|[azure/k8s-deploy][azure/k8s-deploy]|
|`azure/k8s-lint`|Validate/lint your manifest files.|[azure/k8s-lint][azure/k8s-lint]|
|`azure/setup-helm`|Install a specific version of Helm binary on the runner.|[azure/setup-helm][azure/setup-helm]|
|`azure/setup-kubectl`|Installs a specific version of kubectl on the runner.|[azure/setup-kubectl][azure/setup-kubectl]|
|`azure/k8s-artifact-substitute`|Update the tag or digest for container images.|[azure/k8s-artifact-substitute][azure/k8s-artifact-substitute]|
|`azure/aks-create-action`|Create an AKS cluster using Terraform.|[azure/aks-create-action][azure/aks-create-action]|
|`azure/aks-github-runner`|Set up self-hosted agents for GitHub Actions.|[azure/aks-github-runner][azure/aks-github-runner]|

In addition, the example in the next section uses the [azure/acr-build][azure/acr-build] action.

## Example of using GitHub Actions with AKS

As an example, you can use GitHub Actions to deploy an application to your AKS cluster every time a change is pushed to your GitHub repository. This example uses the [Azure Vote][gh-azure-vote] application.

> [!NOTE]
> This example uses a service principal for authentication with your ACR and AKS cluster. Alternatively, you can configure Open ID Connect (OIDC) and update the `azure/login` action to use OIDC. For more details, see [Set up Azure Login with OpenID Connect authentication][oidc-auth].

### Fork and update the repository

Navigate to the [Azure Vote][gh-azure-vote] repository and click the **Fork** button.

Once the repository is forked, update `azure-vote-all-in-one-redis.yaml` to use your ACR for the `azure-vote-front` image

```yaml
...
      containers:
      - name: azure-vote-front
        image: <registryName>.azurecr.io/azuredocs/azure-vote-front:v1
...
```

> [!IMPORTANT]
> The update to `azure-vote-all-in-one-redis.yaml` must be committed to your repository before you can complete the later steps.

### Create secrets

Create a service principal to access your resource group with the `Contributor` role using the following command, replacing:

- `<SUBSCRIPTION_ID>` with the subscription ID of your Azure account
- `<RESOURCE_GROUP>` with the name of the resource group where your ACR is located

```azurecli-interactive
az ad sp create-for-rbac \
    --name "ghActionAzureVote" \
    --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP> \
    --role Contributor \
    --sdk-auth
```

The following shows an example output from the above command.

```output
{
  "clientId": <clientId>,
  "clientSecret": <clientSecret>,
  "subscriptionId": <subscriptionId>,
  "tenantId": <tenantId>,
  ...
}
```

In your GitHub repository, create the below secrets for your action to use. To create a secret:
1. Navigate to the repository's settings, and click *Secrets* then *Actions*.  
1. For each secret, click *New Repository Secret* and enter the name and value of the secret.

For more details on creating secrets, see [Encrypted Secrets][github-actions-secrets].

|Secret name  |Secret value  |
|---------|---------|
|AZURE_CREDENTIALS|The entire JSON output from the `az ad sp create-for-rbac` command|
|service_principal | The value of `<clientId>`|
|service_principal_password| The value of `<clientSecret>`|
|subscription| The value of `<subscriptionId>`|
|tenant|The value of `<tenantId>`|
|registry|The name of your registry|
|repository|azuredocs|
|resource_group|The name of your resource group|
|cluster_name|The name of your cluster|


### Create actions file

Create a `.github/workflows/main.yml` in your repository with the following contents:

```yaml
name: build_deploy_aks
on:
  push:
    paths:
      - "azure-vote/**"
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code 
        uses: actions/checkout@v3
      - name: ACR build
        id: build-push-acr
        uses: azure/acr-build@v1
        with:
          service_principal: ${{ secrets.service_principal }}
          service_principal_password: ${{ secrets.service_principal_password }}
          tenant: ${{ secrets.tenant }}
          registry: ${{ secrets.registry }}
          repository: ${{ secrets.repository }}
          image:  azure-vote-front
          folder: azure-vote
          branch: master
          tag: ${{ github.sha }}
      - name: Azure login
        id: login
        uses: azure/login@v1.4.3
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Set AKS context
        id: set-context
        uses: azure/aks-set-context@v3
        with:
          resource-group: '${{ secrets.resource_group }}' 
          cluster-name: '${{ secrets.cluster_name }}'
      - name: Setup kubectl
        id: install-kubectl
        uses: azure/setup-kubectl@v3
      - name: Deploy to AKS
        id: deploy-aks
        uses: Azure/k8s-deploy@v4
        with:
          namespace: 'default'
          manifests: |
             azure-vote-all-in-one-redis.yaml
          images: '${{ secrets.registry }}.azurecr.io/${{ secrets.repository }}/azure-vote-front:${{ github.sha }}'
          pull: false 
```

> [!IMPORTANT]
> The `.github/workflows/main.yml` file must be committed to your repository before you can run the action.

The `on` section contains the event that triggers the action. In the above file, the action is triggered when a change is pushed to the `azure-vote` directory.

In the above file, the `steps` section contains each distinct action, which is executed in order:
1. *Checkout source code* uses the [GitHub Actions Checkout Action][actions/checkout] to clone the repository.
1. *ACR build* uses the [Azure Container Registry Build Action][azure/acr-build] to build the image and upload it to your registry.
1. *Azure login* uses the [Azure Login Action][azure/login] to sign in to your Azure account.
1. *Set AKS context* uses the [Azure AKS Set Context Action][azure/aks-set-context] to set the context for your AKS cluster.
1. *Setup kubectl* uses the [Azure AKS Setup Kubectl Action][azure/setup-kubectl] to install kubectl on your runner.
1. *Deploy to AKS* uses the [Azure Kubernetes Deploy Action][azure/k8s-deploy] to deploy the application to your Kuberentes cluster.

Confirm that the action is working by updating `azure-vote/azure-vote/config_file.cfg` to the following and pushing the changes to your repository:

```output
# UI Configurations
TITLE = 'Azure Voting App'
VOTE1VALUE = 'Fish'
VOTE2VALUE = 'Dogs'
SHOWHOST = 'false'
```

In your repository, click on *Actions* and confirm a workflow is running. Once complete, confirm the workflow has a green checkmark and the updated application is deployed to your cluster.

## Next steps

Review the following starter workflows for AKS. For more details on using starter workflows, see [Using starter workflows][use-starter-workflows].

- [Azure Kubernetes Service (Basic)][aks-swf-basic]
- [Azure Kubernetes Service Helm][aks-swf-helm]
- [Azure Kubernetes Service Kustomize][aks-swf-kustomize]
- [Azure Kubernetes Service Kompose][aks-swf-kompose]

> [!div class="nextstepaction"]
> [Learn how to create multiple pipelines on GitHub Actions with AKS](/training/modules/aks-deployment-pipeline-github-actions)

> [!div class="nextstepaction"]
> [Learn about Azure Kubernetes Service](/azure/architecture/reference-architectures/containers/aks-start-here)

[oidc-auth]: /azure/developer/github/connect-from-azure?tabs=azure-cli%2Clinux#use-the-azure-login-action-with-openid-connect
[aks-swf-basic]: https://github.com/actions/starter-workflows/blob/main/deployments/azure-kubernetes-service.yml
[aks-swf-helm]: https://github.com/actions/starter-workflows/blob/main/deployments/azure-kubernetes-service-helm.yml
[aks-swf-kustomize]: https://github.com/actions/starter-workflows/blob/main/deployments/azure-kubernetes-service-kustomize.yml
[aks-swf-kompose]: https://github.com/actions/starter-workflows/blob/main/deployments/azure-kubernetes-service-kompose.yml
[use-starter-workflows]: https://docs.github.com/actions/using-workflows/using-starter-workflows#using-starter-workflows
[github-actions]: /azure/developer/github/github-actions
[github-actions-secrets]: https://docs.github.com/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository
[azure/aks-set-context]: https://github.com/Azure/aks-set-context
[azure/k8s-set-context]: https://github.com/Azure/k8s-set-context
[azure/k8s-bake]: https://github.com/Azure/k8s-bake
[azure/k8s-create-secret]: https://github.com/Azure/k8s-create-secret
[azure/k8s-deploy]: https://github.com/Azure/k8s-deploy
[azure/k8s-lint]: https://github.com/Azure/k8s-lint
[azure/setup-helm]: https://github.com/Azure/setup-helm
[azure/setup-kubectl]: https://github.com/Azure/setup-kubectl
[azure/k8s-artifact-substitute]: https://github.com/Azure/k8s-artifact-substitute
[azure/aks-create-action]: https://github.com/Azure/aks-create-action
[azure/aks-github-runner]: https://github.com/Azure/aks-github-runner
[azure/acr-build]: https://github.com/Azure/acr-build
[azure/login]: https://github.com/Azure/login
[connect-gh-azure]: /azure/developer/github/connect-from-azure?tabs=azure-cli%2Clinux
[gh-azure-vote]: https://github.com/Azure-Samples/azure-voting-app-redis
[actions/checkout]: https://github.com/actions/checkout
