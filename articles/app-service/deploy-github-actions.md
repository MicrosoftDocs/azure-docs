---
title: Configure CI/CD with GitHub Actions
description: Learn how to deploy your code to Azure App Service from a CI/CD pipeline with GitHub Actions. Customize the build tasks and execute complex deployments.
ms.devlang: na
ms.topic: article
ms.date: 10/25/2019
ms.author: jafreebe
ms.reviewer: ushan
ms.custom: devx-track-python

---

# Deploy to App Service using GitHub Actions

[GitHub Actions](https://help.github.com/en/articles/about-github-actions) gives you the flexibility to build an automated software development lifecycle workflow. With the Azure App Service Actions for GitHub, you can automate your workflow to deploy to [Azure App Service](overview.md) using GitHub Actions.

> [!IMPORTANT]
> GitHub Actions is currently in beta. You must first [sign-up to join the preview](https://github.com/features/actions) using your GitHub account.
> 

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

For an Azure App Service workflow, the file has three sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Define a service principal. <br /> 2. Create a GitHub secret. |
|**Build** | 1. Set up the environment. <br /> 2. Build the web app. |
|**Deploy** | 1. Deploy the web app. |

## Generate deployment credentials

# [User-level credentials](#tab/userlevel)

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) by using the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). You can run this command using [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

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

# [App-level credentials](#tab/applevel)

You can use app-level credentials by using the publish profile for your app. Go to your app's management page in the portal. In the **Overview** page, click **Get Publish profile** option.

You will need the contents of the file later.

---

## Configure the GitHub secret

# [User-level credentials](#tab/userlevel)

In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

To use [user-level credentials](#generate-deployment-credentials), paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name like `AZURE_CREDENTIALS`.

When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

# [App-level credentials](#tab/applevel)

In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

To use [app-level credentials](#generate-deployment-credentials), paste the contents of the downloaded publish profile file into the secret's value field. Give the secret the name like `azureWebAppPublishProfile`.

When you configure the workflow file later, you use the secret for the input `publish-profile` of the deploy Azure Web App action. For example:
    
```yaml
- uses: azure/webapps-deploy@v2
  with:
    publish-profile: ${{ secrets.azureWebAppPublishProfile }}
```

---

## Set up the environment

Setting up the environment can be done using one of the setup actions.

|**Language**  |**Setup Action**  |
|---------|---------|
|**.NET**     | `actions/setup-dotnet` |
|**Java**     | `actions/setup-java` |
|**JavaScript** | `actions/setup-node` |
|**Python**     | `actions/setup-python` |

The following examples show the part of the workflow that sets up the environment for the various supported languages:

**JavaScript**

```yaml
    - name: Setup Node 10.x
      uses: actions/setup-node@v1
      with:
        node-version: '10.x'
```
**Python**

```yaml
    - name: Setup Python 3.6
      uses: actions/setup-python@v1
      with:
        python-version: 3.6
```

**.NET**

```yaml
    - name: Setup Dotnet 2.2.300
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: '2.2.300'
```

**Java**

```yaml
    - name: Setup Java 1.8.x
      uses: actions/setup-java@v1
      with:
        # If your pom.xml <maven.compiler.source> version is not in 1.8.x
        # Please change the Java version to match the version in pom.xml <maven.compiler.source>
        java-version: '1.8.x'
```

## Build the web app

This depends on the language and for languages supported by Azure App Service, this section should be the standard build steps of each language.

The following examples show the part of the workflow that builds the web app, in the various supported languages.

**JavaScript**

```yaml
    - name: 'Run npm'
      shell: bash
      run: |
        # If your web app project is not located in your repository's root
        # Please change your directory for npm in pushd
        pushd .
        npm install
        npm run build --if-present
        npm run test --if-present
        popd
```

**Python**

```yaml
    - name: 'Run pip'
      shell: bash
      run: |
        # If your web app project is not located in your repository's root
        # Please change your directory for pip in pushd
        pushd .
        python -m pip install --upgrade pip
        pip install -r requirements.txt --target=".python_packages/lib/python3.6/site-packages"
        popd
```

**.NET**

```yaml
    - name: 'Run dotnet build'
      shell: bash
      run: |
        # If your web app project is not located in your repository's root
        # Please consider using pushd to change your path
        pushd .
        dotnet build --configuration Release --output ./output
        popd
```

**Java**

```yaml
    - uses: actions/checkout@v1
    - name: Set up JDK 1.8
      uses: actions/setup-java@v1
      with:
        java-version: 1.8
    - name: Build with Maven
      run: mvn -B package --file pom.xml
```
## Deploy to App Service

To deploy your code to an App Service app, use the `azure/webapps-deploy@v2` action. This action has four parameters:

| **Parameter**  | **Explanation**  |
|---------|---------|
| **app-name** | (Required) Name of the App Service app | 
| **publish-profile** | (Optional) Publish profile file contents with Web Deploy secrets |
| **package** | (Optional) Path to package or folder. *.zip, *.war, *.jar or a folder to deploy |
| **slot-name** | (Optional) Enter an existing Slot other than the Production slot |

# [User-level credentials](#tab/userlevel)

Below is the sample workflow to build and deploy a Node.js app to Azure using an Azure service principal. Note how the `creds` input references the `AZURE_CREDENTIALS` secret that you created earlier.

```yaml
on: [push]

name: Node.js

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    # checkout the repo
    - name: 'Checkout GitHub Action' 
      uses: actions/checkout@master
   
    - uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
        
    - name: Setup Node 10.x
      uses: actions/setup-node@v1
      with:
        node-version: '10.x'
    
    - name: 'npm install, build, and test'
      run: |
        npm install
        npm run build --if-present
        npm run test --if-present
               
    # deploy web app using Azure credentials
    - uses: azure/webapps-deploy@v2
      with:
        app-name: 'node-rn'

    # Azure logout 
    - name: logout
      run: |
        az logout
```

# [App-level credentials](#tab/applevel)

Below is the sample workflow to build and deploy a Node.js app to Azure using the app's publish profile. Note how the `publish-profile` input references the `azureWebAppPublishProfile` secret that you created earlier.

```yaml
# File: .github/workflows/workflow.yml

on: push

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    # checkout the repo
    - name: 'Checkout GitHub Action' 
      uses: actions/checkout@master
    
    - name: Setup Node 10.x
      uses: actions/setup-node@v1
      with:
        node-version: '10.x'
    - name: 'npm install, build, and test'
      run: |
        npm install
        npm run build --if-present
        npm run test --if-present
       
    - name: 'Run Azure webapp deploy action using publish profile credentials'
          uses: azure/webapps-deploy@v2
          with: 
            app-name: node-rn
            publish-profile: ${{ secrets.azureWebAppPublishProfile }}
```

---

## Next steps

You can find our set of Actions grouped into different repositories on GitHub, each one containing documentation and examples to help you use GitHub for CI/CD and deploy your apps to Azure.

- [Actions workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)

- [Azure login](https://github.com/Azure/login)

- [Azure WebApp](https://github.com/Azure/webapps-deploy)

- [Azure WebApp for containers](https://github.com/Azure/webapps-container-deploy)

- [Docker login/logout](https://github.com/Azure/docker-login)

- [Events that trigger workflows](https://help.github.com/en/articles/events-that-trigger-workflows)

- [K8s deploy](https://github.com/Azure/k8s-deploy)

- [Starter Workflows](https://github.com/actions/starter-workflows)