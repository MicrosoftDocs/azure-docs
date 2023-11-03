---
title: 'Build and deploy JAR files to Azure Container Apps'
description: Build your java application to a JAR file and deploy it to Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.author: cshoe
ms.service: container-apps
ms.topic: quickstart
ms.date: 11/03/2023
ms.custom: ignite-2023
---

# Quickstart: Build and deploy JAR to Azure Container Apps

This article demonstrates how to build and deploy a JAR file to Azure Container Apps. JAR files are archive files that include a Java-specific manifest file. They're built on the ZIP format and typically have a .jar file extension.

In this quickstart, you'll create a backend web API service that returns a static collection of music albums.  After completing this quickstart, you can continue to [Tutorial: Communication between microservices in Azure Container Apps](communicate-between-microservices.md) to learn how to deploy a front end application that calls the API.

The following screenshot shows the output from the album API service you deploy.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Java | Install the [JDK](/java/openjdk/install), recommend 17 or later|
| Maven | Install the [Maven](https://maven.apache.org/download.cgi).|

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
RESOURCE_GROUP="album-containerapps"
LOCATION="canadacentral"
ENVIRONMENT="env-album-containerapps"
API_NAME="album-api"
SUBSCRIPTION=<your-subscription-id>
```

You can check your subscription ID with:

```azurecli
az account list --output table
```

# [Azure PowerShell](#tab/azure-powershell)

Define the following variables in your PowerShell console.

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$API_NAME="album-api"
$SUBSCRIPTION=<your-subscription-id>
```

You can check your subscription ID with:

```powershell
az account list --output table
```

---

## Prepare the GitHub repository
Now you can clone the sample repository.

Use the following git command to clone the sample app into the *code-to-cloud* folder:

```git
git clone https://github.com/azure-samples/containerapps-albumapi-java code-to-cloud
```

```git
cd code-to-cloud
```

## Build a JAR file
> [!NOTE]
> The Java sample only supports a Maven build, which results is an executable JAR file. The build uses default settings as passing in environment variables is unsupported.

Build the project with [Maven](https://maven.apache.org/download.cgi).
# [Bash](#tab/bash)

```azurecli
mvn clean package -DskipTests
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
mvn clean package -DskipTests
```

---

## Run the project locally

# [Bash](#tab/bash)

```azurecli
java -jar target\containerapps-albumapi-java-0.0.1-SNAPSHOT.jar
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
java -jar target\containerapps-albumapi-java-0.0.1-SNAPSHOT.jar
```

---

Test run the project on the localhost: http://localhost:8080/albums, you should be able to see the returned list of the JSON objects.

## Deploy the JAR file to Azure Container Apps

Build and deploy your first container app from your local JAR file with the `containerapp up` command. This command will:

- Create the resource group
- Create an Azure Container Registry
- Build the container image and push it to the registry
- Create the Container Apps environment with a Log Analytics workspace
- Create and deploy the container app using a public container image

The `up` command uses the Docker file in the root of the repository to build the container image.  The target port is defined by the EXPOSE instruction in the Docker file.  A Docker file isn't required to build a container app.

# [Bash](#tab/bash)

```azurecli
az containerapp up \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --artifact ./target/containerapps-albumapi-java-0.0.1-SNAPSHOT.jar \
  --ingress external \
  --target-port 8080 \
  --subscription $SUBSCRIPTION
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp up `
    --name $API_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --environment $ENVIRONMENT `
    --artifact ./target/containerapps-albumapi-java-0.0.1-SNAPSHOT.jar `
    --ingress external `
    --target-port 8080 `
    --subscription $SUBSCRIPTION
```

---

## Verify deployment

Copy the FQDN to a web browser.  From your web browser, go to the `/albums` endpoint of the FQDN.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

Follow these steps in the Azure portal to remove the resources you created:

1. Select the **msdocscontainerapps** resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name **msdocscontainerapps** in the *Are you sure you want to delete "my-container-apps"* confirmation dialog.
1. Select **Delete**.
    The process to delete the resource group may take a few minutes to complete.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)