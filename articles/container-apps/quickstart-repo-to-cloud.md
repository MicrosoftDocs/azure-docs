---
title: "Quickstart: Build and deploy your app from a repository to Azure Container Apps"
description: Build your container app from a code repository and deploy in Azure Container Apps using az containerapp up.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.topic: quickstart
ms.date: 12/19/2023
ms.author: cshoe
zone_pivot_groups: container-apps-image-build-from-repo
---


# Quickstart: Build and deploy your container app from a code repository in Azure Container Apps

This article demonstrates how to build and deploy a microservice to Azure Container Apps from a Github repository using the programming language of your choice. In this quickstart, you create a sample microservice which represents a backend web API service that returns a static collection of music albums.

This sample microservice is available as both a containerized (source contains a Dockerfile) as well as uncontainerized version (source contains no Dockerfile). We suggest you choose the variant that aligns most closely with your own source code. Choosing the uncontainerized path will be easier for you if you're new to containers.

> [!NOTE]
> You can also build and deploy this sample application from your local filesystem. For more information, see [Build from local source code and deploy you application in Azure Container Apps](quickstart-code-to-cloud.md).

The following screenshot shows the output from the album API service you deploy.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::


## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|


## Setup

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az login
```

---

Ensure you're running the latest version of the CLI via the upgrade command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az upgrade
```

---

Next, install or update the Azure Container Apps extension for the CLI.

# [Bash](#tab/bash)

```azurecli
az extension add --name containerapp --upgrade
```

# [Azure PowerShell](#tab/azure-powershell)


```azurepowershell
az extension add --name containerapp --upgrade
```

---

Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces if you haven't already registered them in your Azure subscription.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
```

```azurecli
az provider register --namespace Microsoft.OperationalInsights
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az provider register --namespace Microsoft.App
```

```azurepowershell
az provider register --namespace Microsoft.OperationalInsights
```

---

Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.


# [Bash](#tab/bash)

Define the following variables in your bash shell.

```azurecli
export RESOURCE_GROUP="album-containerapps"
export LOCATION="canadacentral"
export ENVIRONMENT="env-album-containerapps"
export API_NAME="album-api"
export GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

::: zone pivot="with-Dockerfile"
Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Next, define a container registry name unique to you.

```azurecli
export ACR_NAME="acaalbums"$GITHUB_USERNAME
```
::: zone-end

# [Azure PowerShell](#tab/azure-powershell)

Define the following variables in your PowerShell console.

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$API_NAME="album-api"
$GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

::: zone pivot="with-Dockerfile"
Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Next, define a container registry name unique to you.

```powershell
$ACR_NAME="acaalbums"+$GITHUB_USERNAME
```
::: zone-end


---



## Prepare the GitHub repository

In a browser window, go to the GitHub repository for your preferred language and fork the repository.


# [C#](#tab/csharp)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-csharp) to fork the repo to your account.


::: zone pivot="without-Dockerfile"

# [Java](#tab/java)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-java) to fork the repo to your account.

> [!NOTE] 
> The Java sample only supports a Maven build, which results in an executable JAR file. The build uses the default settings, as passing in environment variables is not supported.

:::zone-end


# [JavaScript](#tab/javascript)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-javascript) to fork the repo to your account.


# [Python](#tab/python)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-python) to fork the repo to your account.


::: zone pivot="without-Dockerfile"

# [Go](#tab/go)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-go) to fork the repo to your account.

::: zone-end

---

## Build and deploy the container app

Build and deploy your first container app from your forked GitHub repository with the `containerapp up` command. This command will:

- Create the resource group
- Create an Azure Container Registry
- Build the container image and push it to the registry
- Create the Container Apps environment with a Log Analytics workspace
- Create a GitHub Action workflow to build and deploy the container app

- Create the resource group
- Create the Container Apps environment with a Log Analytics workspace
::: zone pivot="with-Dockerfile"
- Create an Azure Container Registry
::: zone-end
::: zone pivot="without-Dockerfile"
- Automatically create a default registry as part of your environment
::: zone-end
- Create a GitHub Action workflow to build and deploy the container app

Once new code it pushed to the code repository the Github Action will:

::: zone pivot="with-Dockerfile"
- Build the container image and push it to the Azure Container Registry
- Deploy the container image to the created container app
::: zone-end
::: zone pivot="without-Dockerfile"
- Auto-detect the language and build the image automatically using the appropriate Buildpack
- Push the image into Azure Container App's default registry to be deployed from there
::: zone-end

::: zone pivot="with-Dockerfile"
The `up` command uses the Dockerfile in the root of the repository to build the container image. The target port is defined by the EXPOSE instruction in the Dockerfile.  A Docker file isn't required to build a container app. 
::: zone-end

::: zone pivot="without-Dockerfile"
For the container app to be accessible let's ensure we also enable ingress traffic to the correct port of where the application container will listen. The containers will be build to listen on port 8080.
::: zone-end

In the command below replace the `<YOUR_GITHUB_REPOSITORY_NAME>` with your GitHub repository name in the form of `https://github.com/<owner>/<repository-name>` or `<owner>/<repository-name>`.

# [Bash](#tab/bash)

::: zone pivot="with-Dockerfile"

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --context-path ./src \
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

::: zone-end
::: zone pivot="without-Dockerfile"

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --context-path ./src \
  --ingress external \
  --target-port 8080 \
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

::: zone-end


# [Azure PowerShell](#tab/azure-powershell)

::: zone pivot="with-Dockerfile"

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --context-path ./src `
    --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

::: zone-end
::: zone pivot="without-Dockerfile"

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --context-path ./src `
    --ingress external `
    --target-port 8080 `
    --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

::: zone-end


---

Using the URL and the user code displayed in the terminal, go to the GitHub device activation page in a browser and enter the user code to the page.  Follow the prompts to authorize the Azure CLI to access your GitHub repository.  

The `up` command creates a GitHub Action workflow in your repository *.github/workflows* folder. The workflow is triggered to build and deploy your container app when you push changes to the repository.

---

## Verify deployment

Copy the FQDN to a web browser.  From your web browser, go to the `/albums` endpoint of the FQDN.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Clean up resources

If you're not going to continue on to the [Deploy a frontend](communicate-between-microservices.md) tutorial, you can remove the Azure resources created during this quickstart with the following command.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If the group contains resources outside the scope of this quickstart, they are also deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az group delete --name $RESOURCE_GROUP
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next step

After completing this quickstart, you can continue to [Tutorial: Communication between microservices in Azure Container Apps](communicate-between-microservices.md) to learn how to deploy a front end application that calls the API.

> [!div class="nextstepaction"]
> [Tutorial: Communication between microservices](communicate-between-microservices.md)
