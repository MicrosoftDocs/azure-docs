---
title: "Tutorial: Build and deploy your app to Azure Container Apps"
description: Build and deploy your app to Azure Container Apps with az containerapp create command.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
  - ignite-2023
ms.topic: tutorial
ms.date: 05/11/2022
ms.author: cshoe
zone_pivot_groups: container-apps-image-build-type
---


# Tutorial: Build and deploy your app to Azure Container Apps

This article demonstrates how to build and deploy a microservice to Azure Container Apps from a source repository using the programming language of your choice.

This tutorial is the first in a series of articles that walk you through how to use core capabilities within Azure Container Apps. The first step is to create a back end web API service that returns a static collection of music albums.

> [!NOTE]
> You can also build and deploy this app using the [az containerapp up](/cli/azure/containerapp#az_containerapp_up) by following the instructions in the [Quickstart: Build and deploy an app to Azure Container Apps from a repository](quickstart-code-to-cloud.md) article.  The `az containerapp up` command is a fast and convenient way to build and deploy your app to Azure Container Apps using a single command.  However, it doesn't provide the same level of customization for your container app.

 The next tutorial in the series will build and deploy the front end web application to Azure Container Apps.

The following screenshot shows the output from the album API deployed in this tutorial.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Prerequisites

To complete this project, you need the following items:

::: zone pivot="acr-remote"

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Sign up for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

::: zone-end

::: zone pivot="docker-local"

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Sign up for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Docker Desktop | Docker provides installers that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). <br><br>From your command prompt, type `docker` to ensure Docker is running. |

::: zone-end

[!INCLUDE [container-apps-setup-cli-only.md](../../includes/container-apps-setup-cli-only.md)]

Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.

[!INCLUDE [container-apps-code-to-cloud-setup.md](../../includes/container-apps-code-to-cloud-setup.md)]


## Prepare the GitHub repository

Navigate to the repository for your preferred language and fork the repository.

# [C#](#tab/csharp)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-csharp) to fork the repo to your account.

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-csharp.git code-to-cloud
```

# [Go](#tab/go)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-go) to fork the repo to your account.

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-go.git code-to-cloud
```

# [Java](#tab/java)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-java) to fork the repo to your account.

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-java.git code-to-cloud
```

> [!NOTE]
> The Java sample only supports a Maven build, which results in an executable JAR file. The build uses the default settings, as passing in environment variables is not supported.

# [JavaScript](#tab/javascript)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-javascript) to fork the repo to your account.

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-javascript.git code-to-cloud
```

# [Python](#tab/python)

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-python) to fork the repo to your account.

Now you can clone your fork of the sample repository.

Use the following git command to clone your forked repo into the *code-to-cloud* folder:

```git
git clone https://github.com/$GITHUB_USERNAME/containerapps-albumapi-python.git code-to-cloud
```

---

Next, change the directory into the root of the cloned repo.

```console
cd code-to-cloud/src
```

## Create an Azure resource group

Create a resource group to organize the services related to your container app deployment.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Location $Location -Name $ResourceGroup
```

---

## Create an Azure Container Registry

Next, create an Azure Container Registry (ACR) instance in your resource group to store the album API container image once it's built.

# [Bash](#tab/bash)

```azurecli
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$acr = New-AzContainerRegistry -ResourceGroupName $ResourceGroup -Name $ACRName -Sku Basic -EnableAdminUser
```

---

::: zone pivot="acr-remote"

## Build your application

With [ACR tasks](../container-registry/container-registry-tasks-overview.md), you can build and push the docker image for the album API without installing Docker locally.  

### Build the container with ACR

Run the following command to initiate the image build and push process using ACR. The `.` at the end of the command represents the docker build context, meaning this command should be run within the *src* folder where the Dockerfile is located.

# [Bash](#tab/bash)

```azurecli
az acr build --registry $ACR_NAME --image $API_NAME .
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az acr build --registry $ACRName --image $APIName .
```

---

Output from the `az acr build` command shows the upload progress of the source code to Azure and the details of the `docker build` and `docker push` operations.

::: zone-end

::: zone pivot="docker-local"

## Build your application

The following steps, demonstrate how to build your container image locally using Docker and push the image to the new container registry.

### Build the container with Docker

The following command builds a container image for the album API and tags it with the fully qualified name of the ACR login server. The `.` at the end of the command represents the docker build context, meaning this command should be run within the *src* folder where the Dockerfile is located.

# [Bash](#tab/bash)

```azurecli
docker build --tag $ACR_NAME.azurecr.io/$API_NAME .
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
docker build --tag "$ACRName.azurecr.io/$APIName" .
```

---

### Push the image to your container registry

First, sign in to your Azure Container Registry.

# [Bash](#tab/bash)

```azurecli
az acr login --name $ACR_NAME
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az acr login --name $ACRName
```

---

Now, push the image to your registry.

# [Bash](#tab/bash)

```azurecli
docker push $ACR_NAME.azurecr.io/$API_NAME
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
docker push "$ACRName.azurecr.io/$APIName"
```

---

::: zone-end

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary around a group of container apps.

Create the Container Apps environment using the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION"
```

# [Azure PowerShell](#tab/azure-powershell)

A Log Analytics workspace is required for the Container Apps environment.  The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to  variables.

```azurepowershell
$WorkspaceArgs = @{
    Name = 'my-album-workspace'
    ResourceGroupName = $ResourceGroup
    Location = $Location
    PublicNetworkAccessForIngestion = 'Enabled'
    PublicNetworkAccessForQuery = 'Enabled'
}
New-AzOperationalInsightsWorkspace @WorkspaceArgs
$WorkspaceId = (Get-AzOperationalInsightsWorkspace -ResourceGroupName $ResourceGroup -Name $WorkspaceArgs.Name).CustomerId
$WorkspaceSharedKey = (Get-AzOperationalInsightsWorkspaceSharedKey -ResourceGroupName $ResourceGroup -Name $WorkspaceArgs.Name).PrimarySharedKey
```

To create the environment, run the following command:

```azurepowershell
$EnvArgs = @{
    EnvName = $Environment
    ResourceGroupName = $ResourceGroup
    Location = $Location
    AppLogConfigurationDestination = 'log-analytics'
    LogAnalyticConfigurationCustomerId = $WorkspaceId
    LogAnalyticConfigurationSharedKey = $WorkspaceSharedKey
}

New-AzContainerAppManagedEnv @EnvArgs
```

---

## Deploy your image to a container app

Now that you have an environment created, you can create and deploy your container app with the `az containerapp create` command.

Create and deploy your container app with the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name $API_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_NAME.azurecr.io/$API_NAME \
  --target-port 3500 \
  --ingress 'external' \
  --registry-server $ACR_NAME.azurecr.io \
  --query properties.configuration.ingress.fqdn
```

* By setting `--ingress` to `external`, your container app is accessible from the public internet.

* The `target-port` is set to `3500` to match the port that the container is listening to for requests.

* Without a `query` property, the call to `az containerapp create` returns a JSON response that includes a rich set of details about the application. Adding a query parameter filters the output to just the app's fully qualified domain name (FQDN).

# [Azure PowerShell](#tab/azure-powershell)

To create the container app, create template objects that you pass in as arguments to the `New-AzContainerApp` command.

Create a template object to define your container image parameters.

```azurepowershell
$ImageParams = @{
    Name = $APIName
    Image = $ACRName + '.azurecr.io/' + $APIName + ':latest'
}
$TemplateObj = New-AzContainerAppTemplateObject @ImageParams
```

You need run the following command to get your registry credentials.

```azurepowershell
$RegistryCredentials = Get-AzContainerRegistryCredential -Name $ACRName -ResourceGroupName $ResourceGroup
```

Create a registry credential object to define your registry information, and a secret object to define your registry password.  The `PasswordSecretRef` refers to the `Name` in the secret object.  

```azurepowershell
$RegistryArgs = @{
    Server = $ACRName + '.azurecr.io'
    PasswordSecretRef = 'registrysecret'
    Username = $RegistryCredentials.Username
}
$RegistryObj = New-AzContainerAppRegistryCredentialObject @RegistryArgs

$SecretObj = New-AzContainerAppSecretObject -Name 'registrysecret' -Value $RegistryCredentials.Password
```

Get your environment ID.

```azurepowershell
$EnvId = (Get-AzContainerAppManagedEnv -EnvName $Environment -ResourceGroup $ResourceGroup).Id
```

Create the container app.

```azurepowershell
$AppArgs = @{
    Name = $APIName
    Location = $Location
    ResourceGroupName = $ResourceGroup
    ManagedEnvironmentId = $EnvId
    TemplateContainer = $TemplateObj
    ConfigurationRegistry = $RegistryObj
    ConfigurationSecret = $SecretObj
    IngressTargetPort = 3500
    IngressExternal = $true
}
$MyApp = New-AzContainerApp @AppArgs

# show the app's fully qualified domain name (FQDN).
$MyApp.IngressFqdn
```

* By setting `IngressExternal` to `external`, your container app is accessible from the public internet.
* The `IngressTargetPort` parameter is set to `3500` to match the port that the container is listening to for requests.

---

## Verify deployment

Copy the FQDN to a web browser.  From your web browser, navigate to the `/albums` endpoint of the FQDN.

:::image type="content" source="media/quickstart-code-to-cloud/azure-container-apps-album-api.png" alt-text="Screenshot of response from albums API endpoint.":::

## Clean up resources

If you're not going to continue on to the [Communication between microservices](communicate-between-microservices.md) tutorial, you can remove the Azure resources created during this quickstart. Run the following command to delete the resource group along with all the resources created in this quickstart.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroup -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

This quickstart is the entrypoint for a set of progressive tutorials that showcase the various features within Azure Container Apps. Continue on to learn how to enable communication from a web front end that calls the API you deployed in this article.

> [!div class="nextstepaction"]
> [Tutorial: Communication between microservices](communicate-between-microservices.md)
