---
title: "Quickstart: Build and deploy your app from your local filesystem to Azure Container Apps"
description: Build your container app from local source and deploy in Azure Container Apps using az containerapp up.
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


# Quickstart: Build from local source code and deploy you application in Azure Container Apps

This article demonstrates how to build and deploy a microservice to Azure Container Apps from local source code using the programming language of your choice. In this quickstart, you create a backend web API service that returns a static collection of music albums.  

> [!NOTE]
> This sample application is available as both a containerized (source contains a Dockerfile) as well as uncontainerized version (source contains no Dockerfile). We suggest you choose the variant that aligns most closely with your own application source. Choosing the uncontainerized path will be easier for you if you're new to containers.

The following screenshot shows the output from the album API service you deploy.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
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
```

# [Azure PowerShell](#tab/azure-powershell)

Define the following variables in your PowerShell console.

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$API_NAME="album-api"
```

---

## Aquire the sample code to be build and deployed

Download and extract the API sample application in the language of your choice.

::: zone pivot="with-Dockerfile"

# [C#](#tab/csharp)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-csharp/zip/refs/heads/main) from the [azure-samples/containerapps-albumapi-csharp repo](https://github.com/azure-samples/containerapps-albumapi-csharp).

After you extract the downloaded file navigate into the `containerapps-albumapi-csharp-main/src` directory and proceed to the next step.


# [Java](#tab/java)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-java/zip/refs/heads/main) from the [azure-samples/containerapps-albumapi-java repo](https://github.com/azure-samples/containerapps-albumapi-java).

After you extract the downloaded file navigate into the `containerapps-albumapi-java-main/src` directory and proceed to the next step.

> [!NOTE] 
> The Java sample only supports a Maven build, which results in an executable JAR file. The build uses the default settings, as passing in environment variables is not supported.


# [JavaScript](#tab/javascript)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-javascript/zip/refs/heads/main) from the [azure-samples/containerapps-albumapi-javascript repo](https://github.com/azure-samples/containerapps-albumapi-javascript).

After you extract the downloaded file navigate into the `containerapps-albumapi-javascript-main/src` directory and proceed to the next step.


# [Python](#tab/python)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-python/zip/refs/heads/main) from the [azure-samples/containerapps-albumapi-python repo](https://github.com/azure-samples/containerapps-albumapi-javascript).

After you extract the downloaded file navigate into the `containerapps-albumapi-python-main/src` directory and proceed to the next step.


# [Go](#tab/go)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-go/zip/refs/heads/main) from the [azure-samples/containerapps-albumapi-csharp repo](https://github.com/azure-samples/containerapps-albumapi-go).

After you extract the downloaded file navigate into the `containerapps-albumapi-go-main/src` directory and proceed to the next step.


::: zone-end
::: zone pivot="without-Dockerfile"


# [C#](#tab/csharp)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-csharp/zip/refs/heads/buildpack) from the [azure-samples/containerapps-albumapi-csharp/tree/buildpack repo (buildpack branch)](https://github.com/azure-samples/containerapps-albumapi-csharp/tree/buildpack).

After you extract the downloaded file navigate into the `containerapps-albumapi-csharp-buildpack/src` directory and proceed to the next step.


# [Java](#tab/java)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-java/zip/refs/heads/buildpack) from the [azure-samples/containerapps-albumapi-java/tree/buildpack repo (buildpack branch)](https://github.com/azure-samples/containerapps-albumapi-java/tree/buildpack).

After you extract the downloaded file navigate into the `containerapps-albumapi-java-buildpack/src` directory and proceed to the next step.

> [!NOTE] 
> The Java sample only supports a Maven build, which results in an executable JAR file. The build uses the default settings, as passing in environment variables is not supported.


# [JavaScript](#tab/javascript)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-javascript/zip/refs/heads/buildpack) from the [azure-samples/containerapps-albumapi-javascript/tree/buildpack repo (buildpack branch)](https://github.com/azure-samples/containerapps-albumapi-javascript/tree/buildpack).

After you extract the downloaded file navigate into the `containerapps-albumapi-javascript-buildpack/src` directory and proceed to the next step.


# [Python](#tab/python)

[Download the source code](https://codeload.github.com/azure-samples/containerapps-albumapi-python/zip/refs/heads/buildpack) from the [azure-samples/containerapps-albumapi-python/tree/buildpack repo (buildpack branch)](https://github.com/azure-samples/containerapps-albumapi-javascript/tree/buildpack).

After you extract the downloaded file navigate into the `containerapps-albumapi-python-buildpack/src` directory and proceed to the next step.

::: zone-end

---




## Build and deploy the container app

Build and deploy your first container app with the `containerapp up` command. This command will:

- Create the resource group
::: zone pivot="with-Dockerfile"
- Create an Azure Container Registry
- Build the container image and push it to the registry
::: zone-end
::: zone pivot="without-Dockerfile"
- Automatically create a default registry as part of your environment
- Auto-detect the language and build the image automatically using the appropriate Buildpack
- Push the image into Azure Container App's default registry
::: zone-end
- Create the Container Apps environment with a Log Analytics workspace
- Create and deploy the container app using the build container image

::: zone pivot="with-Dockerfile"

The `up` command uses the Dockerfile in the root of the repository to build the container image. The target port is defined by the EXPOSE instruction in the Dockerfile. That's the port that will be used to send ingress traffic to the container.

::: zone-end
::: zone pivot="without-Dockerfile"

If the `up` command doesn't find a Dockerfile it will automatically try and use Buildpacks in order to turn your application source into a runable container. In this case we need to tell the `up` command which port will be used.

::: zone-end


Please note the `.` (dot) in the command below. It assumes you are in the `src` directory of the extracted sample API application.

# [Bash](#tab/bash)

::: zone pivot="with-Dockerfile"

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --source .
```

::: zone-end
::: zone pivot="without-Dockerfile"

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --ingress external \
  --target-port 8080 \
  --source .
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
    --source .
```

::: zone-end
::: zone pivot="without-Dockerfile"

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --ingress external `
    --target-port 8080 `
    --source .
```

::: zone-end


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
