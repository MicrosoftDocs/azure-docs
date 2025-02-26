---
title: Custom container CI/CD from GitHub Actions
description: Learn how to use GitHub Actions to deploy your custom Linux container to App Service from a CI/CD pipeline.
ms.topic: article
ms.date: 02/14/2025
ms.reviewer: ushan
ms.custom: github-actions-azure, devx-track-azurecli, linux-related-content
ms.devlang: azurecli
author: cephalin
ms.author: cephalin
zone_pivot_groups:  app-service-containers-github-actions
---

# Deploy a custom container to App Service using GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) gives you the flexibility to build an automated software development workflow. With the [Azure Web Deploy action](https://github.com/Azure/webapps-deploy), you can automate your workflow to deploy custom containers to [App Service](overview.md) using GitHub Actions.

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that are in the workflow.

For an Azure App Service container workflow, the file has three sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Retrieve a service principal or publish profile. <br /> 2. Create a GitHub secret. |
|**Build** | 1. Create the environment. <br /> 2. Build the container image. |
|**Deploy** | 1. Deploy the container image. |

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join). You need to have code in a GitHub repository to deploy to Azure App Service. 
- A working container registry and Azure App Service app for containers. This example uses Azure Container Registry. Make sure to complete the full deployment to Azure App Service for containers. Unlike regular web apps, web apps for containers don't have a default landing page. Publish the container to have a working example.
    - [Learn how to create a containerized Node.js application using Docker, push the container image to a registry, and then deploy the image to Azure App Service](/azure/developer/javascript/tutorial-vscode-docker-node-01)
  		
## Generate deployment credentials

The recommended way to authenticate with Azure App Services for GitHub Actions is with OpenID Connect. You can also authenticate with a service principal or a Publish Profile. 

Save your publish profile credential or service principal as a [GitHub secret](https://docs.github.com/en/actions/reference/encrypted-secrets) to authenticate with Azure. You'll access the secret within your workflow. 

# [Publish profile](#tab/publish-profile)

A publish profile is an app-level credential. Set up your publish profile as a GitHub secret. 

1. Go to your app service in the Azure portal. 

1. On the **Overview** page, select **Get Publish profile**.

    > [!NOTE]
    > As of October 2020, Linux web apps will need the app setting `WEBSITE_WEBDEPLOY_USE_SCM` set to `true` **before downloading the file**. This requirement will be removed in the future. See [Configure an App Service app in the Azure portal](./configure-common.md), to learn how to configure common web app settings.  

1. Save the downloaded file. You'll use the contents of the file to create a GitHub secret.

# [Service principal](#tab/service-principal)

* Create a Microsoft Entra application with a service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1#create-a-service-principal), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).
* Create a client secret for your service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-2?branch=main#create-a-service-principal-containing-a-password), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps?#password-based-authentication).
* Copy the values for **Client ID**, **Client Secret**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.
* Assign an appropriate role to your service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#assign-a-role-to-the-application), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-5#create-or-remove-a-role-assignment), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#manage-service-principal-roles).


# [OpenID Connect](#tab/openid)

OpenID Connect is an authentication method that uses short-lived tokens. Setting up [OpenID Connect with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) is more complex process that offers hardened security. 

To use [Azure Login action](https://github.com/marketplace/actions/azure-login) with OIDC, you need to configure a federated identity credential on a Microsoft Entra application or a user-assigned managed identity.

**Option 1: Microsoft Entra application**

* Create a Microsoft Entra application with a service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-1#create-a-service-principal), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#create-a-service-principal).
*  Copy the values for **Client ID**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.
* Assign an appropriate role to your service principal by [Azure portal](/entra/identity-platform/howto-create-service-principal-portal#assign-a-role-to-the-application), [Azure CLI](/cli/azure/azure-cli-sp-tutorial-5#create-or-remove-a-role-assignment), or [Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps#manage-service-principal-roles).
* [Configure a federated identity credential on a Microsoft Entra application](/entra/workload-id/workload-identity-federation-create-trust) to trust tokens issued by GitHub Actions to your GitHub repository. 

**Option 2: User-assigned managed identity**

* [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity).
*  Copy the values for **Client ID**, **Subscription ID**, and **Directory (tenant) ID** to use later in your GitHub Actions workflow.
* [Assign an appropriate role to your user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#manage-access-to-user-assigned-managed-identities).
* [Configure a federated identity credential on a user-assigned managed identity](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity) to trust tokens issued by GitHub Actions to your GitHub repository.

---
## Configure the GitHub secret for authentication

# [Publish profile](#tab/publish-profile)

In [GitHub](https://github.com/), browse your repository. Select **Settings > Security > Secrets and variables > Actions > New repository secret**.

To use [app-level credentials](#generate-deployment-credentials), paste the contents of the downloaded publish profile file into the secret's value field. Name the secret `AZURE_WEBAPP_PUBLISH_PROFILE`.

When you configure your GitHub workflow, you use the `AZURE_WEBAPP_PUBLISH_PROFILE` in the deploy Azure Web App action. For example:
    
```yaml
- uses: azure/webapps-deploy@v2
  with:
    publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

# [Service principal](#tab/service-principal)

In [GitHub](https://github.com/), browse your repository. Select **Settings > Security > Secrets and variables > Actions > New repository secret**.

To use [user-level credentials](#generate-deployment-credentials), paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret a name, like `AZURE_CREDENTIALS`.

When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

```yaml
- uses: azure/login@v2
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

# [OpenID Connect](#tab/openid)

You need to provide your application's **Client ID**, **Tenant ID** and **Subscription ID** to the login action. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.

1. Open your GitHub repository and go to **Settings > Security > Secrets and variables > Actions > New repository secret**.

    > [!NOTE]
    > To enhance workflow security in public repositories, use [environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) instead of repository secrets. If the environment requires approval, a job cannot access environment secrets until one of the required reviewers approves it.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your Active Directory application for your GitHub secrets. You can find these values in the Azure portal by searching for your active directory application. 

    |GitHub Secret  | Active Directory Application  |
    |---------|---------|
    |AZURE_CLIENT_ID     |      Application (client) ID   |
    |AZURE_TENANT_ID     |     Directory (tenant) ID    |
    |AZURE_SUBSCRIPTION_ID     |     Subscription ID    |

1. Save each secret by selecting **Add secret**.

---

## Configure GitHub secrets for your registry

Define secrets to use with the Docker Login action. The example in this document uses Azure Container Registry for the container registry. 

1. Go to your container in the Azure portal or Docker and copy the username and password. You can find the Azure Container Registry username and password in the Azure portal under **Settings** > **Access keys** for your registry. 

2. Define a new secret for the registry username named `REGISTRY_USERNAME`. 

3. Define a new secret for the registry password named `REGISTRY_PASSWORD`. 

## Build the Container image

::: zone pivot="github-actions-containers-linux"

The following example show part of the workflow that builds a Node.js Docker image. Use [Docker Login](https://github.com/azure/docker-login) to log into a private container registry. This example uses Azure Container Registry but the same action works for other registries. 


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

You can also use [Docker sign-in](https://github.com/azure/docker-login) to log into multiple container registries at the same time. This example includes two new GitHub secrets for authentication with docker.io. The example assumes that there's a Dockerfile at the root level of the registry. 

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

::: zone-end  

::: zone pivot="github-actions-containers-windows"

The following example shows part of the workflow that builds a Windows Docker image. Use [Docker Login](https://github.com/azure/docker-login) to log into a private container registry. This example uses Azure Container Registry but the same action works for other registries. 


```yaml
name: Windows Container Workflow
on: [push]
jobs:
  build:
    runs-on: windows-latest
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

You can also use [Docker sign-in](https://github.com/azure/docker-login) to log into multiple container registries at the same time. This example includes two new GitHub secrets for authentication with docker.io. The example assumes that there's a Dockerfile at the root level of the registry. 

```yml
name: Windows Container Workflow
on: [push]
jobs:
  build:
    runs-on: windows-latest
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

::: zone-end  


## Deploy to an App Service container

To deploy your image to a custom container in App Service, use the `azure/webapps-deploy@v2` action. This action has seven parameters:

| **Parameter**  | **Explanation**  |
|---------|---------|
| **app-name** | (Required) Name of the App Service app | 
| **publish-profile** | (Optional) Applies to Web Apps(Windows and Linux) and Web App Containers(linux). Multi container scenario not supported. Publish profile (\*.publishsettings) file contents with Web Deploy secrets | 
| **slot-name** | (Optional) Enter an existing Slot other than the Production slot |
| **package** | (Optional) Applies to Web App only: Path to package or folder. \*.zip, \*.war, \*.jar or a folder to deploy |
| **images** | (Required) Applies to Web App Containers only: Specify the fully qualified container image(s) name. For example, 'myregistry.azurecr.io/nginx:latest' or 'python:3.7.2-alpine/'. For a multi-container app, multiple container image names can be provided (multi-line separated) |
| **configuration-file** | (Optional) Applies to Web App Containers only: Path of the Docker-Compose file. Should be a fully qualified path or relative to the default working directory. Required for multi-container apps. |
| **startup-command** | (Optional) Enter the start-up command. For ex. dotnet run or dotnet filename.dll |

::: zone pivot="github-actions-containers-linux"

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
      uses: actions/checkout@main
    
    - name: 'Sign in via Azure CLI'
      uses: azure/login@v2
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

# [OpenID Connect](#tab/openid)

```yaml
on: [push]
name: Linux_Container_Node_Workflow

permissions:
      id-token: write
      contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    # checkout the repo
    - name: 'Checkout GitHub Action' 
      uses: actions/checkout@main
    
    - name: 'Sign in via Azure CLI'
      uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    
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

::: zone-end  

::: zone pivot="github-actions-containers-windows"

# [Publish profile](#tab/publish-profile)

```yaml
name: Windows_Container_Workflow

on: [push]

jobs:
  build:
    runs-on: windows-latest

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

name: Windows_Container_Workflow

jobs:
  build-and-deploy:
    runs-on: windows-latest
    steps:
    # checkout the repo
    - name: 'Checkout GitHub Action' 
      uses: actions/checkout@main
    
    - name: 'Sign in via Azure CLI'
      uses: azure/login@v2
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

# [OpenID Connect](#tab/openid)

```yaml
on: [push]
name: Windows_Container_Workflow

permissions:
      id-token: write
      contents: read

jobs:
  build-and-deploy:
    runs-on: windows-latest
    steps:
    # checkout the repo
    - name: 'Checkout GitHub Action' 
      uses: actions/checkout@main
    
    - name: 'Sign in via Azure CLI'
      uses: azure/login@v2
      with:
        client-id: ${{ secrets.AZURE_CLIENT_ID }}
        tenant-id: ${{ secrets.AZURE_TENANT_ID }}
        subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    
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

::: zone-end

---

## Next steps

You can find our set of Actions grouped into different repositories on GitHub, each one containing documentation and examples to help you use GitHub for CI/CD and deploy your apps to Azure.

- [Actions workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)

- [Azure sign-in](https://github.com/Azure/login)

- [Azure WebApp](https://github.com/Azure/webapps-deploy)

- [Docker sign-in/out](https://github.com/Azure/docker-login)

- [Events that trigger workflows](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)

- [K8s deploy](https://github.com/Azure/k8s-deploy)

- [Starter Workflows](https://github.com/actions/starter-workflows)
