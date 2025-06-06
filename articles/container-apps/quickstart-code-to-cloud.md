---
title: "Quickstart: Build and deploy your app from your local filesystem to Azure Container Apps"
description: Build your container app from local source and deploy in Azure Container Apps using az containerapp up.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.topic: quickstart
ms.date: 11/07/2024
ms.author: cshoe
---

# Quickstart: Build and deploy from local source code to Azure Container Apps

This article demonstrates how to build and deploy a microservice to Azure Container Apps from local source code using the programming language of your choice. In this quickstart, you create a backend web API service that returns a static collection of music albums.  

The following screenshot shows the output from the album API service you deploy.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
| Git | Install [Git](https://git-scm.com/downloads). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Setup

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```bash
az login
```

# [PowerShell](#tab/powershell)

```powershell
az login
```

---

To ensure you're running the latest version of the CLI, run the upgrade command.

# [Bash](#tab/bash)

```bash
az upgrade
```

# [PowerShell](#tab/powershell)

```powershell
az upgrade
```

---

Next, install or update the Azure Container Apps extension for the CLI.


# [Bash](#tab/bash)

```bash
az extension add --name containerapp --upgrade --allow-preview true
```

# [PowerShell](#tab/powershell)

```powershell
az extension add --name containerapp --upgrade --allow-preview true
```

---

Now that the current extension is installed, register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces.

# [Bash](#tab/bash)

```bash
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
```

# [PowerShell](#tab/powershell)

```powershell
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
```

---

## Create environment variables

Now that your CLI setup is complete, you can define the environment variables that are used throughout this article.

# [Bash](#tab/bash)

Define the following variables in your bash shell.

```bash
export RESOURCE_GROUP="album-containerapps"
export LOCATION="canadacentral"
export ENVIRONMENT="env-album-containerapps"
export API_NAME="album-api"
```

# [PowerShell](#tab/powershell)

Define the following variables in your PowerShell console.

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$API_NAME="album-api"
```

---

## Get the sample code

Run the following command to clone the sample application in the language of your choice and change into the project source folder.

# [C#](#tab/csharp)

```bash
git clone https://github.com/azure-samples/containerapps-albumapi-csharp.git
cd containerapps-albumapi-csharp/src
```

# [Java](#tab/java)

```bash
git clone https://github.com/azure-samples/containerapps-albumapi-java.git
cd containerapps-albumapi-java
```

# [JavaScript](#tab/javascript)

```bash
git clone https://github.com/azure-samples/containerapps-albumapi-javascript.git
cd containerapps-albumapi-javascript/src
```

# [Python](#tab/python)

```bash
git clone https://github.com/azure-samples/containerapps-albumapi-python.git
cd containerapps-albumapi-python/src
```

# [Go](#tab/go)

```bash
git clone https://github.com/azure-samples/containerapps-albumapi-go.git
cd containerapps-albumapi-go/src
```

---

## Build and deploy the container app

First, run the following command to create the resource group that will contain the resources you create in this quickstart.

# [Bash](#tab/bash)

```bash
az group create --name $RESOURCE_GROUP --location $LOCATION
```

# [PowerShell](#tab/powershell)

```powershell
az group create --name $RESOURCE_GROUP --location $LOCATION
```

---

Build and deploy your first container app with the `containerapp up` command. This command will:

- Create the resource group
- Create an Azure Container Registry
- Build the container image and push it to the registry
- Create the Container Apps environment with a Log Analytics workspace
- Create and deploy the container app using the built container image

The `up` command uses the Dockerfile in project folder to build the container image. The `EXPOSE` instruction in the Dockerfile defines the target port, which is the port used to send ingress traffic to the container.

In the following code example, the `.` (dot) tells `containerapp up` to run in the current directory of the project that also contains the Dockerfile.

# [Bash](#tab/bash)

```bash
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --source .
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --source .
```

---

> [!NOTE]
> If the command returns an error with the message "AADSTS50158: External security challenge not satisfied", run `az login --scope https://graph.microsoft.com//.default` to log in with the required permissions and then run the `az containerapp up` command again.

## Verify deployment

Locate the container app's URL in the output of the `az containerapp up` command. Navigate to the URL in your browser. Add `/albums` to the end of the URL to see the response from the API.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Limits

The maximum size for uploading source code is 200MB. If the upload goes over the limit, error 413 is returned.

## Clean up resources

If you're not going to continue on to the [Deploy a frontend](communicate-between-microservices.md) tutorial, you can remove the Azure resources created during this quickstart with the following command.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If the group contains resources outside the scope of this quickstart, they are also deleted.

# [Bash](#tab/bash)

```bash
az group delete --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
az group delete --name $RESOURCE_GROUP
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

After completing this quickstart, you can continue to [Tutorial: Communication between microservices in Azure Container Apps](communicate-between-microservices.md) to learn how to deploy a front end application that calls the API.

> [!div class="nextstepaction"]
> [Tutorial: Communication between microservices](communicate-between-microservices.md)
