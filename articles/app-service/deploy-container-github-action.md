---
title: Custom container CI/CD from GitHub Actions
description: Learn how to use GitHub Actions to deploy your custom Linux container to App Service from a CI/CD pipeline.
ms.devlang: na
ms.topic: article
ms.date: 10/25/2019
ms.author: jafreebe
ms.reviewer: ushan

---

# Deploy a custom container to App Service using GitHub Actions

[GitHub Actions](https://help.github.com/en/articles/about-github-actions) gives you the flexibility to build an automated software development lifecycle workflow. With the [Azure Web Deploy action](https://github.com/Azure/webapps-deploy), you can automate your workflow to deploy custom containers to [App Service](overview.md) using GitHub Actions.

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

For an Azure App Service container workflow, the file has three sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1.  service principal or publish profile. <br /> 2. Create a GitHub secret. |
|**Build** | 1. Set up the environment. <br /> 2. Build the container image. |
|**Deploy** | 1. Deploy the container image. |

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  
- A working container registry and Azure App Service app for containers. This example uses Azure Container Registry. 
    - Get started with 

## Generate deployment credentials

The recommended way to authenticate with Azure App Services for GitHub Actions is with a publish profile. You can also authenticate with a service principal but the process requires more steps. 

Save your publish profile credential or service principal as a [GitHub secret](https://docs.github.com/en/actions/reference/encrypted-secrets) to authenticate with Azure. You'll access the secret within your workflow. 

# [Publish profile](#tab/publish-profile)

A publish profile is an app-level credential. Set up your publish profile as a GitHub secret. 

1. Go to your app service in the Azure portal. 

1. On the **Overview** page, select **Get Publish profile**.

1. Save the downloaded file. You'll use the contents of the file to create a GitHub secret.

# [Service principal](#tab/service-principal)

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac&preserve-view=true) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
az ad sp create-for-rbac --name "myApp" --role contributor \
                            --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name> \
                            --sdk-auth
```

In the example above, replace the placeholders with your subscription ID, resource group name, and app name. The output is a JSON object with the role assignment credentials that provide access to your App Service app similar to below. Copy this JSON object for later.

```output 
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

> [!IMPORTANT]
> It is always a good practice to grant minimum access. The scope in the previous example is limited to the specific App Service app and not the entire resource group.
---

## Configure the GitHub secret

In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

Paste the contents of the JSON output from [Create a service principal](#create-a-service-principal) as the value of secret variable. Give the secret the name like `AZURE_CREDENTIALS`.

When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

## Configure the GitHub secret for authentication

# [Publish profile](#tab/publish-profile)

In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

To use [app-level credentials](#generate-deployment-credentials), paste the contents of the downloaded publish profile file into the secret's value field. Name the secret `AZURE_WEBAPP_PUBLISH_PROFILE`.

When you configure your GitHub workflow, you use the `AZURE_WEBAPP_PUBLISH_PROFILE` in the deploy Azure Web App action. For example:
    
```yaml
- uses: azure/webapps-deploy@v2
  with:
    publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

# [Service principal](#tab/service-principal)

In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

To use [user-level credentials](#generate-deployment-credentials), paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name like `AZURE_CREDENTIALS`.

When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

---

## Configure GitHub secrets for your registry

Define secrets to use with the Docker Login action. 

1. Go to your container in the Azure Portal or Docker and copy the username and password. 

2. Define a new secret for the registry username named `REGISTRY_USERNAME`. 

3. Define a new secret for the registry password named `REGISTRY_PASSWORD`. 

## Build the Container image

The following example show part of the workflow that builds a Node.JS Docker image. Use [Docker Login](https://github.com/azure/docker-login) to log into a private container registry. This example uses Azure Container Registry but the same action works for other registries. 

# [Publish profile](#tab/publish-profile)

```yaml
name: Linux Container Node Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - uses: azure/docker-login@v1
      with:
        login-server: mycontainer.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    - run: |
        docker build . -t mycontainer.azurecr.io/myapp:${{ github.sha }}
        docker push mycontainer.azurecr.io/myapp:${{ github.sha }}     
```

You can also use [Docker Login](https://github.com/azure/docker-login) to log into multiple container registries at the same time. This example includes two new GitHub secrets for authentication with docker.io.

```yml
name: Linux Container Node Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - uses: azure/docker-login@v1
      with:
        login-server: mycontainer.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    - uses: azure/docker-login@v1
      with:
        login-server: index.docker.io
        username: ${{ secrets.DOCKERIO_USERNAME }}
        password: ${{ secrets.DOCKERIO_PASSWORD }}
    - run: |
        docker build . -t mycontainer.azurecr.io/myapp:${{ github.sha }}
        docker push mycontainer.azurecr.io/myapp:${{ github.sha }}     
```
# [Service principal](#tab/service-principal)

This example shows how to build a Node.JS Docker image using a service principal for authentication. 

```yaml
on: [push]

name: Linux_Container_Node_Workflow

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    # checkout the repo
    - name: 'Checkout GitHub Action' 
      uses: actions/checkout@master

    - name: 'Login via Azure CLI'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}   
    - uses: azure/docker-login@v1
      with:
        login-server: mycontainer.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}  
    - run: |
        docker build . -t mycontainer.azurecr.io/myapp:${{ github.sha }}
        docker push mycontainer.azurecr.io/myapp:${{ github.sha }}      
    - name: Azure logout
      run: |
        az logout
```

---

## Deploy to an App Service container

To deploy your image to a custom container in App Service, use the `azure/webapps-container-deploy@v2` action. This action has five parameters:

| **Parameter**  | **Explanation**  |
|---------|---------|
| **app-name** | (Required) Name of the App Service app | 
| **slot-name** | (Optional) Enter an existing Slot other than the Production slot |
| **images** | (Required) Specify the fully qualified container image(s) name. For example, 'myregistry.azurecr.io/nginx:latest' or 'python:3.7.2-alpine/'. For a multi-container app, multiple container image names can be provided (multi-line separated) |
| **configuration-file** | (Optional) Path of the Docker-Compose file. Should be a fully qualified path or relative to the default working directory. Required for multi-container apps. |
| **container-command** | (Optional) Enter the start-up command. For ex. dotnet run or dotnet filename.dll |

Below is the sample workflow to build and deploy a Node.js app to a custom container in App Service. 

# [Publish profile](#tab/publish-profile)

```yaml
name: Linux Container Node Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - uses: azure/docker-login@v1
      with:
        login-server: mycontainer.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}

    - run: |
        docker build . -t mycontainer.azurecr.io/myapp:${{ github.sha }}
        docker push mycontainer.azurecr.io/myapp:${{ github.sha }}     

    - uses: azure/webapps-deploy@v2
      with:
        app-name: 'myapp'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        images: 'mycontainer.azurecr.io/myapp:${{ github.sha }}'
```
# [Service principal](#tab/service-principal)

```yaml
on: [push]

name: Linux_Container_Node_Workflow

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    # checkout the repo
    - name: 'Checkout GitHub Action' 
      uses: actions/checkout@master
    
    - name: 'Login via Azure CLI'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - uses: azure/docker-login@v1
      with:
        login-server: mycontainer.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    - run: |
        docker build . -t mycontainer.azurecr.io/myapp:${{ github.sha }}
        docker push mycontainer.azurecr.io/myapp:${{ github.sha }}     
      
    - uses: azure/webapps-deploy@v2
      with:
        app-name: 'myapp'
        images: 'mycontainer.azurecr.io/myapp:${{ github.sha }}'
    
    - name: Azure logout
      run: |
        az logout
```

---

## Next steps

You can find our set of Actions grouped into different repositories on GitHub, each one containing documentation and examples to help you use GitHub for CI/CD and deploy your apps to Azure.

- [Actions workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)

- [Azure login](https://github.com/Azure/login)

- [Azure WebApp](https://github.com/Azure/webapps-deploy)

- [Docker login/logout](https://github.com/Azure/docker-login)

- [Events that trigger workflows](https://help.github.com/en/articles/events-that-trigger-workflows)

- [K8s deploy](https://github.com/Azure/k8s-deploy)

- [Starter Workflows](https://github.com/actions/starter-workflows)