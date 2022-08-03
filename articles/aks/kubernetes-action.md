---
title: Build, test, and deploy containers to Azure Kubernetes Service using GitHub Actions
description:  Learn how to use GitHub Actions to deploy your container to Kubernetes
services: container-service
author: azooinmyluggage
ms.topic: article
ms.date: 05/16/2022
ms.author: atulmal
ms.custom: github-actions-azure
---

# GitHub Actions for deploying to Kubernetes service

[GitHub Actions](https://docs.github.com/en/actions) gives you the flexibility to build an automated software development lifecycle workflow. You can use multiple Kubernetes actions to deploy to containers from Azure Container Registry to Azure Kubernetes Service with GitHub Actions. 

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  
- A working Kubernetes cluster
    - [Tutorial: Prepare an application for Azure Kubernetes Service](tutorial-kubernetes-prepare-app.md)

## Workflow file overview

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

For a workflow targeting AKS, the file has three sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | Generate deployment credentials. |
|**Build** | Build & push the container image  |
|**Deploy** | 1. Set the target AKS cluster |
| |2. Create a generic/docker-registry secret in Kubernetes cluster  |
||3. Deploy to the Kubernetes cluster|

## Create a service principal

# [Service principal](#tab/userlevel)

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) by using the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). You can run this command using [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP> --sdk-auth
```

In the above command, replace the placeholders with your subscription ID, and resource group. The output is the role assignment credentials that provide access to your resource. The command should output a JSON object similar to this.

```json
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```
Copy this JSON object, which you can use to authenticate from GitHub.

# [Open ID Connect](#tab/openid)

Open ID Connect is an authentication method that uses short-lived tokens. Setting up [Open ID Connect with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) is more complex process that offers hardened security. 

1.  If you do not have an existing application, register a [new Active Directory application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). Create the Active Directory application. 

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

    This command will output JSON with an `appId` that is your `client-id`. Save the value to use as the `AZURE_CLIENT_ID` GitHub secret later. 

    You'll use the `objectId` value when creating federated credentials with Graph API and reference it as the `APPLICATION-OBJECT-ID`.

1. Create a service principal. Replace the `$appID` with the appId from your JSON output. 

    This command generates JSON output with a different `objectId` and will be used in the next step. The new  `objectId` is the `assignee-object-id`. 
    
    Copy the `appOwnerTenantId` to use as a GitHub secret for `AZURE_TENANT_ID` later. 

    ```azurecli-interactive
     az ad sp create --id $appId
    ```

1. Create a new role assignment by subscription and object. By default, the role assignment will be tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, and `$assigneeObjectId` with the generated `assignee-object-id`. Learn [how to manage Azure subscriptions with the Azure CLI](/cli/azure/manage-azure-subscriptions-azure-cli). 

    ```azurecli-interactive
    az role assignment create --role contributor --subscription $subscriptionId --assignee-object-id  $assigneeObjectId --scopes /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/--assignee-principal-type ServicePrincipal
    ```

1. Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for your active directory application.

    * Replace `APPLICATION-OBJECT-ID` with the **objectId (generated while creating app)** for your Active Directory application.
    * Set a value for `CREDENTIAL-NAME` to reference later.
    * Set the `subject`. The value of this is defined by GitHub depending on your workflow:
      * Jobs in your GitHub Actions environment: `repo:< Organization/Repository >:environment:< Name >`
      * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
      * For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull_request`.
    
    ```azurecli
    az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/<APPLICATION-OBJECT-ID>/federatedIdentityCredentials' --body '{"name":"<CREDENTIAL-NAME>","issuer":"https://token.actions.githubusercontent.com","subject":"repo:organization/repository:ref:refs/heads/main","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
    ```
    
To learn how to create a Create an active directory application, service principal, and federated credentials in Azure portal, see [Connect GitHub and Azure](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

---


## Configure the GitHub secrets

# [Service principal](#tab/userlevel)

Follow the steps to configure the secrets:

1. In [GitHub](https://github.com/), browse to your repository, select **Settings > Secrets > New repository secret**.

    :::image type="content" source="media/kubernetes-action/secrets.png" alt-text="Screenshot shows the Add a new secret link for a repository.":::

2. Paste the contents of the above `az cli` command as the value of secret variable. For example, `AZURE_CREDENTIALS`.

3. Similarly, define the following additional secrets for the container registry credentials and set them in Docker login action. 

    - REGISTRY_USERNAME
    - REGISTRY_PASSWORD

4. You will see the secrets as shown below once defined.

    :::image type="content" source="media/kubernetes-action/kubernetes-secrets.png" alt-text="Screenshot shows existing secrets for a repository.":::

# [OpenID Connect](#tab/openid)

You need to provide your application's **Client ID**, **Tenant ID**, and **Subscription ID** to the login action. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.

1. Open your GitHub repository and go to **Settings**.

1. Select **Settings > Secrets > New secret**.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your Active Directory application for your GitHub secrets:

    |GitHub Secret  | Active Directory Application  |
    |---------|---------|
    |AZURE_CLIENT_ID     |      Application (client) ID   |
    |AZURE_TENANT_ID     |     Directory (tenant) ID    |
    |AZURE_SUBSCRIPTION_ID     |     Subscription ID    |

1. Similarly, define the following additional secrets for the container registry credentials and set them in Docker login action. 

    - REGISTRY_USERNAME
    - REGISTRY_PASSWORD

---

##  Build a container image and deploy to Azure Kubernetes Service cluster

The build and push of the container images is done using `azure/docker-login@v1` action. 


```yml
env:
  REGISTRY_NAME: {registry-name}
  CLUSTER_NAME: {cluster-name}
  CLUSTER_RESOURCE_GROUP: {resource-group-name}
  NAMESPACE: {namespace-name}
  APP_NAME: {app-name}
  
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@main
    
    # Connect to Azure Container Registry (ACR)
    - uses: azure/docker-login@v1
      with:
        login-server: ${{ env.REGISTRY_NAME }}.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }} 
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    # Container build and push to a Azure Container Registry (ACR)
    - run: |
        docker build . -t ${{ env.REGISTRY_NAME }}.azurecr.io/${{ env.APP_NAME }}:${{ github.sha }}
        docker push ${{ env.REGISTRY_NAME }}.azurecr.io/${{ env.APP_NAME }}:${{ github.sha }}
      working-directory: ./<path-to-Dockerfile-directory>

```

### Deploy to Azure Kubernetes Service cluster

To deploy a container image to AKS, you will need to use the `azure/k8s-deploy@v1` action. This action has five parameters:

| **Parameter**  | **Explanation**  |
|---------|---------|
| **namespace** | (Optional) Choose the target Kubernetes namespace. If the namespace is not provided, the commands will run in the default namespace | 
| **manifests** |  (Required) Path to the manifest files, that will be used for deployment |
| **images** | (Optional) Fully qualified resource URL of the image(s) to be used for substitutions on the manifest files |
| **imagepullsecrets** | (Optional) Name of a docker-registry secret that has already been set up within the cluster. Each of these secret names is added under imagePullSecrets field for the workloads found in the input manifest files |
| **kubectl-version** | (Optional) Installs a specific version of kubectl binary |

> [!NOTE]
> The manifest files should be created manually by you. Currently there are no tools that will generate such files in an automated way, for more information see [this sample repository with example manifest files](https://github.com/MicrosoftDocs/mslearn-aks-deploy-container-app/tree/master/kubernetes).

Before you can deploy to AKS, you'll need to set target Kubernetes namespace and create an image pull secret. See [Pull images from an Azure container registry to a Kubernetes cluster](../container-registry/container-registry-auth-kubernetes.md), to learn more about how pulling images works. 

```yaml
  # Create namespace if doesn't exist
  - run: |
      kubectl create namespace ${{ env.NAMESPACE }} --dry-run=client -o json | kubectl apply -f -  

  # Create image pull secret for ACR
  - uses: azure/k8s-create-secret@v1
    with:
      container-registry-url: ${{ env.REGISTRY_NAME }}.azurecr.io
      container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
      container-registry-password: ${{ secrets.REGISTRY_PASSWORD }}
      secret-name: ${{ env.SECRET }}
      namespace: ${{ env.NAMESPACE }}
      arguments: --force true
```


Complete your deployment with the `azure/k8s-deploy@v1` action. Replace the environment variables with values for your application. 

# [Service principal](#tab/userlevel)

```yaml

on: [push]

# Environment variables available to all jobs and steps in this workflow
env:
  REGISTRY_NAME: {registry-name}
  CLUSTER_NAME: {cluster-name}
  CLUSTER_RESOURCE_GROUP: {resource-group-name}
  NAMESPACE: {namespace-name}
  SECRET: {secret-name}
  APP_NAME: {app-name}
  
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@main
    
    # Connect to Azure Container Registry (ACR)
    - uses: azure/docker-login@v1
      with:
        login-server: ${{ env.REGISTRY_NAME }}.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }} 
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    # Container build and push to a Azure Container Registry (ACR)
    - run: |
        docker build . -t ${{ env.REGISTRY_NAME }}.azurecr.io/${{ env.APP_NAME }}:${{ github.sha }}
        docker push ${{ env.REGISTRY_NAME }}.azurecr.io/${{ env.APP_NAME }}:${{ github.sha }}
      working-directory: ./<path-to-Dockerfile-directory>
    
    # Set the target Azure Kubernetes Service (AKS) cluster. 
    - uses: azure/aks-set-context@v1
      with:
        creds: '${{ secrets.AZURE_CREDENTIALS }}'
        cluster-name: ${{ env.CLUSTER_NAME }}
        resource-group: ${{ env.CLUSTER_RESOURCE_GROUP }}
    
    # Create namespace if doesn't exist
    - run: |
        kubectl create namespace ${{ env.NAMESPACE }} --dry-run=client -o json | kubectl apply -f -
    
    # Create image pull secret for ACR
    - uses: azure/k8s-create-secret@v1
      with:
        container-registry-url: ${{ env.REGISTRY_NAME }}.azurecr.io
        container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
        container-registry-password: ${{ secrets.REGISTRY_PASSWORD }}
        secret-name: ${{ env.SECRET }}
        namespace: ${{ env.NAMESPACE }}
        arguments: --force true
    
    # Deploy app to AKS
    - uses: azure/k8s-deploy@v1
      with:
        manifests: |
          ${{ github.workspace }}/manifests/deployment.yaml
          ${{ github.workspace }}/manifests/service.yaml
        images: |
          ${{ env.REGISTRY_NAME }}.azurecr.io/${{ env.APP_NAME }}:${{ github.sha }}
        imagepullsecrets: |
          ${{ env.SECRET }}
        namespace: ${{ env.NAMESPACE }}
```

# [Open ID Connect](#tab/openid)

The Azure Kubernetes Service set context action ([azure/aks-set-context](https://github.com/Azure/aks-set-context)) can be used to set cluster context before other actions like [k8s-deploy](https://github.com/Azure/k8s-deploy). For Open ID Connect, you'll use the Azure Login action before set context.

```yaml

on: [push]

# Environment variables available to all jobs and steps in this workflow
env:
  REGISTRY_NAME: {registry-name}
  CLUSTER_NAME: {cluster-name}
  CLUSTER_RESOURCE_GROUP: {resource-group-name}
  NAMESPACE: {namespace-name}
  SECRET: {secret-name}
  APP_NAME: {app-name}
  
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@main
    
    # Connect to Azure Container Registry (ACR)
    - uses: azure/docker-login@v1
      with:
        login-server: ${{ env.REGISTRY_NAME }}.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }} 
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    # Container build and push to a Azure Container Registry (ACR)
    - run: |
        docker build . -t ${{ env.REGISTRY_NAME }}.azurecr.io/${{ env.APP_NAME }}:${{ github.sha }}
        docker push ${{ env.REGISTRY_NAME }}.azurecr.io/${{ env.APP_NAME }}:${{ github.sha }}
      working-directory: ./<path-to-Dockerfile-directory>
    
    - uses: azure/login@v1
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

    # Set the target Azure Kubernetes Service (AKS) cluster. 
    - uses: azure/aks-set-context@v2.0
      with:
        cluster-name: ${{ env.CLUSTER_NAME }}
        resource-group: ${{ env.CLUSTER_RESOURCE_GROUP }}
    
    # Create namespace if doesn't exist
    - run: |
        kubectl create namespace ${{ env.NAMESPACE }} --dry-run=client -o json | kubectl apply -f -
    
    # Create image pull secret for ACR
    - uses: azure/k8s-create-secret@v1
      with:
        container-registry-url: ${{ env.REGISTRY_NAME }}.azurecr.io
        container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
        container-registry-password: ${{ secrets.REGISTRY_PASSWORD }}
        secret-name: ${{ env.SECRET }}
        namespace: ${{ env.NAMESPACE }}
        arguments: --force true
    
    # Deploy app to AKS
    - uses: azure/k8s-deploy@v1
      with:
        manifests: |
          ${{ github.workspace }}/manifests/deployment.yaml
          ${{ github.workspace }}/manifests/service.yaml
        images: |
          ${{ env.REGISTRY_NAME }}.azurecr.io/${{ env.APP_NAME }}:${{ github.sha }}
        imagepullsecrets: |
          ${{ env.SECRET }}
        namespace: ${{ env.NAMESPACE }}
```
---


## Clean up resources

When your Kubernetes cluster, container registry, and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository. 

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Kubernetes Service](/azure/architecture/reference-architectures/containers/aks-start-here)

> [!div class="nextstepaction"]
> [Learn how to create multiple pipelines on GitHub Actions with AKS](/learn/modules/aks-deployment-pipeline-github-actions)

### More Kubernetes GitHub Actions

* [Kubectl tool installer](https://github.com/Azure/setup-kubectl) (`azure/setup-kubectl`): Installs a specific version of kubectl on the runner.
* [Kubernetes set context](https://github.com/Azure/k8s-set-context) (`azure/k8s-set-context`): Set the target Kubernetes cluster context which will be used by other actions or run any kubectl commands.
* [AKS set context](https://github.com/Azure/aks-set-context) (`azure/aks-set-context`): Set the target Azure Kubernetes Service cluster context.
* [Kubernetes create secret](https://github.com/Azure/k8s-create-secret) (`azure/k8s-create-secret`): Create a generic secret or docker-registry secret in the Kubernetes cluster.
* [Kubernetes deploy](https://github.com/Azure/k8s-deploy) (`azure/k8s-deploy`): Bake and deploy manifests to Kubernetes clusters.
* [Setup Helm](https://github.com/Azure/setup-helm) (`azure/setup-helm`): Install a specific version of Helm binary on the runner.
* [Kubernetes bake](https://github.com/Azure/k8s-bake) (`azure/k8s-bake`): Bake manifest file to be used for deployments using helm2, kustomize or kompose.
* [Kubernetes lint](https://github.com/azure/k8s-lint) (`azure/k8s-lint`): Validate/lint your manifest files.