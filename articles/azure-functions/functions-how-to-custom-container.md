---
title: Working with Azure Functions in containers
description: Learn how to work with function apps running in Linux containers.
ms.date: 07/27/2024
ms.topic: how-to
ms.custom: build-2023, linux-related-content, build-2024
zone_pivot_groups: functions-container-hosting
---

# Working with containers and Azure Functions

:::zone pivot="container-apps"
This article demonstrates the support that Azure Functions provides for working with containerized function apps running in an Azure Container Apps environment. For more information, see [Azure Container Apps hosting of Azure Functions](functions-container-apps-hosting.md). 
::: zone-end
:::zone pivot="azure-functions,azure-arc"
This article demonstrates the support that Azure Functions provides for working with function apps running in Linux containers. 
::: zone-end

Choose the hosting environment for your containerized function app at the top of the article.

If you want to jump right in, the following article shows you how to create your first function running in a Linux container and deploy the image from a container registry to a supported Azure hosting service:

:::zone pivot="container-apps"
> [Create your first containerized Azure Functions on Azure Container Apps](functions-deploy-container-apps.md)

To learn more about deployments to Azure Container Apps, see [Azure Container Apps hosting of Azure Functions](./functions-container-apps-hosting.md). 
:::zone-end
:::zone pivot="azure-functions"
> [Create your first containerized Azure Functions](functions-deploy-container.md)
:::zone-end
:::zone pivot="azure-arc"
> [Working with containers and Azure Functions](functions-how-to-custom-container.md?pivots=azure-arc)
::: zone-end

>[!IMPORTANT]
>This article currently shows how to connect to the default storage account by using a connection string. For the best security, you should instead create a managed identity-based connection to Azure Storage using Microsoft Entra authentication. For more information, see the [Functions developer guide](./functions-reference.md#connections).

## Creating containerized function apps

Functions makes it easy to deploy and run your function apps as Linux containers, which you create and maintain. Functions maintains a set of [language-specific base images](https://mcr.microsoft.com/catalog?search=functions) that you can use when creating containerized function apps.

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]

For a complete example of how to create the local containerized function app from the command line and publish the image to a container registry, see [Create a function app in a local container](functions-create-container-registry.md). 

## Generate the Dockerfile

Functions tooling provides a Docker option that generates a Dockerfile with your functions code project. You can use this file with Docker to create your functions in a container that derives from the correct base image (language and version). 

The way you create a Dockerfile depends on how you create your project.

### [Command line](#tab/core-tools)

+ When you create a Functions project using [Azure Functions Core Tools](./functions-run-local.md), include the `--docker` option when you run the [`func init`](./functions-core-tools-reference.md#func-init) command, as in the following example:

    ```console  
    func init --docker
    ```
+ You can also add a Dockerfile to an existing project by using the `--docker-only` option when you run the [`func init`](./functions-core-tools-reference.md#func-init) command in an existing project folder, as in the following example:

    ```console 
    func init --docker-only
    ```

For a complete example, see [Create a function app in a local container](functions-create-container-registry.md#create-and-test-the-local-functions-project).

### [Visual Studio Code](#tab/vs-code)

The Azure Functions extension for Visual Studio Code creates your Dockerfile when it creates your code project. To create a containerized code project:

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette and search for and run the command `Azure Functions: Create New Containerized Project...`.

1. Select a folder for your new code project, choose **Select**, and follow the remaining prompts.

1. After your project is created, you can open and review the Dockerfile in the root folder you chose for your     project.

### [Visual Studio](#tab/vs)

+ When you create a Functions project, make sure to check the **Enable Docker** option on the **Additional Information** page of the new project dialog. 

+ You can always add a Dockerfile to an existing project by using the `--docker-only` option when you run the [`func init`](./functions-core-tools-reference.md#func-init) command in the Terminal windows of an existing project folder, as in the following example:

    ```console 
    func init --docker-only
    ```  

---

## Create your function app in a container

With a Functions-generated Dockerfile in your code project, you can use Docker to create the containerized function app on your local computer. The following `docker build` command creates an image of your containerized functions from the project in the local directory:

```console
docker build --tag <DOCKER_ID>/<IMAGE_NAME>:v1.0.0 .
``` 

For an example of how to create the container, see [Build the container image and verify locally](functions-create-container-registry.md#build-the-container-image-and-verify-locally).

## Update an image in the registry

When you make changes to your functions code project or need to update to the latest base image, you need to rebuild the container locally and republish the updated image to your chosen container registry. The following command rebuilds the image from the root folder with an updated version number and pushes it to your registry:    

### [Azure Container Registry](#tab/acr)

```azurecli
az acr build --registry <REGISTRY_NAME> --image <LOGIN_SERVER>/azurefunctionsimage:v1.0.1 .
```

Replace `<REGISTRY_NAME>` with your Container Registry instance and `<LOGIN_SERVER>` with the login server name.

### [Docker Hub](#tab/docker)

```console
docker build --tag <DOCKER_ID> azurefunctionsimage:v1.0.1 .
docker push <DOCKER_ID> azurefunctionsimage:v1.0.1
```

Replace `<DOCKER_ID>` with your Docker Hub account ID.

---

At this point, you need to update an existing deployment to use the new image. You can update the function app to use the new image either by using the Azure CLI or in the [Azure portal]: 

### [Azure CLI](#tab/azure-cli2)

```azurecli
az functionapp config container set --image <IMAGE_NAME> --registry-password <SECURE_PASSWORD>--registry-username <USER_NAME> --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

In this example, `<IMAGE_NAME>` is the full name of the new image with version. Private registries require you to supply a username and password. Store these credentials securely.

### [Azure portal](#tab/portal)
:::zone pivot="container-apps"  
1. In the [Azure portal], locate your function app and select **Settings** > **Configuration** on the left-hand side. 

1. Under **Image settings**, update the **Image tag** value to the update version in the registry, and then select **Save**.

The specified image version is deployed to your app.
::: zone-end  
:::zone pivot="azure-functions"  
1. In the [Azure portal], locate your function app and select **Deployment** > **Deployment center** on the left-hand side. 

1. Under **Settings**, select **Container registry** for **Source**, update the **Full Image Name and Tag** value to the update version in the registry, and then select **Save**.

The specified image version is deployed to your app.
::: zone-end  

---

:::zone pivot="azure-functions"  
You should also consider [enabling continuous deployment](#enable-continuous-deployment-to-azure).
::: zone-end  
:::zone pivot="azure-functions"  
## Azure portal create using containers

When you create a function app in the [Azure portal], you can choose to deploy the function app from an image in a container registry. To learn how to create a containerized function app in a container registry, see [Create your function app in a container](#create-your-function-app-in-a-container).

The following steps create and deploy an existing containerized function app from a container registry.

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the **New** page, select **Compute** > **Function App**.

1. Under **Select a hosting option**, choose **Premium plan** > **Select**. 

    This creates a function app hosted by Azure Functions in the [Premium plan](functions-premium-plan.md), which supports dynamic scaling. You can also choose to run in an **App Service plan**, but in this kind of dedicated plan you must manage the [scaling of your function app](functions-scale.md).

1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription in which you create your function app. |
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which you create your function app. You should create a resource group because there are [known limitations when creating new function apps in an existing resource group](functions-scale.md#limitations-for-creating-new-function-apps-in-an-existing-resource-group).|
    | **Function App name** | Unique name<sup>*</sup> | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    | **Do you want to deploy code or container image?**| Container image | Deploy a containerized function app from a registry. To create a function app in registry, see [Create a function app in a local container](functions-create-container-registry.md). |
    |**Region**| Preferred region | Select a [region](https://azure.microsoft.com/regions/) that's near you or near other services that your functions can access. | 
    | **Linux plan** | New plan (default) | Creates a new Premium plan to host your app. You can also choose an existing premium plan. |
    | **Pricing plan** | Elastic Premium EP1 | `EP1` is the most affordable plan. You can choose a larger plan if you need to. |
    | **Zone Redundancy** | Disabled | You don't need this feature in a nonproduction app. | 
  
    <sup>*</sup>App name must be globally unique among all Azure Functions hosted apps.

1. Accept the default options of creating a new storage account on the **Storage** tab and a new Application Insight instance on the **Monitoring** tab. You can also choose to use an existing storage account or Application Insights instance.

1. Select **Review + create** to review the app configuration selections.

1. On the **Review + create** page, review your settings, and then select **Create** to provision the function app using a default base image.

1. After your function app resource is created, select **Go to resource** and in the function app page select **Deployment center**.

1. In the **Deployment center**, you can connect your container registry as the source of the image. You can also enable GitHub Actions or Azure Pipelines for more robust continuous deployment of updates to your container in the registry. 
::: zone-end   
:::zone pivot="container-apps"  
## Azure portal create using containers

When you create a Container Apps-hosted function app in the [Azure portal], you can choose to deploy your function app from an image in a container registry. To learn how to create a containerized function app in a container registry, see [Create your function app in a container](#create-your-function-app-in-a-container).

The following steps create and deploy an existing containerized function app from a container registry.

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the **New** page, select **Compute** > **Function App**.

1. Under **Select a hosting option**, choose **Container Apps environment** > **Select**.  

1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription in which you create your function app. |
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which you create your function app. You should create a resource group because there are [known limitations when creating new function apps in an existing resource group](functions-scale.md#limitations-for-creating-new-function-apps-in-an-existing-resource-group).|
    | **Function App name** | Unique name<sup>*</sup> | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Region**| Preferred region | Select a [region](https://azure.microsoft.com/regions/) that's near you or near other services that your functions can access. |
 
   <sup>*</sup>App name must be unique within the Azure Container Apps environment. 

1. Still on the **Basics** page, accept the suggested new environment for **Azure Container Apps environment**. To minimize costs, the new default environment is created in the **Consumption + Dedicated** with the default workload profile and without zone redundancy. For more information, see [Azure Container Apps hosting of Azure Functions](functions-container-apps-hosting.md).       

    You can also choose to use an existing Container Apps environment. To create a custom environment, instead select **Create new**. In the **Create Container Apps Environment** page, you can add nondefault workload profiles or enable zone redundancy. To learn about environments, see [Azure Container Apps environments](../container-apps/environment.md).

1. Select the **Deployment** tab and unselect **Use quickstart image**. Otherwise, the function app is deployed from the base image for your function app language.

1. Choose your **Image type**, public or private. Choose **Private** if you're using Azure Container Registry or some other private registry. Supply the **Image** name, including the registry prefix. If you're using a private registry, provide the image registry authentication credentials. The **Public** setting only supports images stored publicly in Docker Hub.

1. Under **Container resource allocation**, select your desired number of CPU cores and available memory. If your environment has other workload profiles added, you can select a nondefault **Workload profile**. Choices on this page affect the cost of hosting your app. See the [Container Apps pricing page](https://azure.microsoft.com/pricing/details/container-apps/) to estimate your potential costs. 
   
1. Select **Review + create** to review the app configuration selections.

1. On the **Review + create** page, review your settings, and then select **Create** to provision the function app and deploy your container image from the registry.
::: zone-end  

## Work with images in Azure Functions

When your function app container is deployed from a registry, Functions maintains information about the source image. 

### [Azure CLI](#tab/azure-cli2)

Use the following commands to get data about the image or change the deployment image used:

 +  [`az functionapp config container show`](/cli/azure/functionapp/config/container#az-functionapp-config-container-show): returns information about the image used for deployment. 

 +  [`az functionapp config container set`](/cli/azure/functionapp/config/container#az-functionapp-config-container-set): change registry settings or update the image used for deployment, as shown in the previous example.

### [Azure portal](#tab/portal)
:::zone pivot="container-apps"  
1. In the [Azure portal], locate your function app and select **Settings** > **Configuration** on the left-hand side. 

1. Under **Image settings**, you can review information about the currently deployed image or change the deployment to a different image. You can also change the container environment allocation settings.

1. To make updates, modify any of the image settings, such as the **Image tag**, or container environment allocation settings and select **Save**.

Based on your changes, a new image is deployed to your app or new allocations are provisioned.
::: zone-end  
:::zone pivot="azure-functions"  
1. In the [Azure portal], locate your function app and select **Deployment** > **Deployment center** on the left-hand side. 

1. Under **Settings**, select **Container registry** for **Source** and you can review information about the currently deployed image.
 
1. To make updates, modify any of the image settings, such as the **Full Image Name and Tag** and then select **Save**.

The new image is deployed to your app based on your new settings.
::: zone-end 

---

:::zone pivot="container-apps"  
## Container Apps workload profiles

Workload profiles are feature of Container Apps that let you better control your deployment resources. Azure Functions on Azure Container Apps also supports workload profiles. For more information, see [Workload profiles in Azure Container Apps](../container-apps/workload-profiles-overview.md). 

You can also set the amount of CPU and memory resources allocated to your app. 

You can create and manage both workload profiles and resource allocations using the Azure CLI or in the Azure portal. 

### [Azure CLI](#tab/azure-cli2)

You enable workload profiles when you create your container app environment. For an example, see [Create a container app in a profile](../container-apps/workload-profiles-manage-cli.md#create-a-container-app-in-a-profile). 

You can add, edit, and delete profiles in your environment. For an example, see [Add profiles](../container-apps/workload-profiles-manage-cli.md#add-profiles).  

When you create a containerized function app in an environment that has workload profiles enabled, you should also specify the profile in which to run. You specify the profile by using the `--workload-profile-name` parameter of the [`az functionapp create`](/cli/azure/functionapp#az-functionapp-create) command, like in this example:

```azurecli
az functionapp create --name <APP_NAME> --storage-account <STORAGE_NAME> --environment MyContainerappEnvironment --resource-group AzureFunctionsContainers-rg --functions-version 4 --runtime <LANGUAGE_STACK> --image <IMAGE_URI> --workload-profile-name <PROFILE_NAME> --cpu <CPU_COUNT> --memory <MEMORY_SIZE> 
```

In the [`az functionapp create`](/cli/azure/functionapp#az-functionapp-create) command, the `--environment` parameter specifies the Container Apps environment and the `--image` parameter specifies the image to use for the function app. In this example, replace `<STORAGE_NAME>` with the name you used in the previous section for the storage account. Also, replace `<APP_NAME>` with a globally unique name appropriate to you. 

To set the resources allocated to your app, replace `<CPU_COUNT>` with your desired number of virtual CPUs, with a minimum of 0.5 up to the maximum allowed by the profile. For `<MEMORY_SIZE>`, choose a dedicated memory amount from 1 GB up to the maximum allowed by the profile. 

You can use the [`az functionapp container set`](/cli/azure/functionapp/config/container#az-functionapp-config-container-set) command to manage the allocated resources and the workload profile used by your app.

```azurecli
az functionapp container set --name <APP_NAME> --resource-group AzureFunctionsContainers-rg --workload-profile-name  <PROFILE_NAME> --cpu <CPU_COUNT> --memory <MEMORY_SIZE> 
```

### [Azure portal](#tab/portal)

You enable workload profiles when you create your container app environment. For an example, see [Create a container app in a profile](../container-apps/workload-profiles-manage-portal.md#create-a-container-app-in-a-workload-profile). 

You can add, edit, and delete profiles in your environment. For an example, see [Add profiles](../container-apps/workload-profiles-manage-portal.md#add-profiles).

When you create a containerized function app in an environment that has workload profiles enabled, you should also specify the profile in which to run. In the portal, you can choose your profile during the create process.

---  

::: zone-end  
## Application settings

Azure Functions lets you work with application settings for containerized function apps in the standard way. For more information, see [Use application settings](functions-how-to-use-azure-function-app-settings.md#settings).  

:::zone pivot="container-apps"
## Enable continuous deployment to Azure

When you host your containerized function app on Azure Container Apps, there are two ways to set up continuous deployment from a source code repository:

+ [Azure Pipelines](./functions-how-to-azure-devops.md#deploy-a-container)
+ [GitHub Actions](./functions-how-to-github-actions.md?tabs=container)

You aren't currently able to continuously deploy containers based on image changes in a container registry. You must instead use these source-code based continuous deployment pipelines.

::: zone-end
:::zone pivot="azure-functions"
## Enable continuous deployment to Azure

> [!IMPORTANT]
> Webhook-based deployment isn't currently supported when running your container in an [Elastic Premium plan](functions-premium-plan.md). If you need to use the continuous deployment method described in this section, instead deploy your container in an [App Service plan](dedicated-plan.md). When running in an Elastic Premium plan, you need to manually restart your app whenever you make updates to your container in the repository. 
>
> You can also configure continuous deployment from a source code repository using either [Azure Pipelines](./functions-how-to-azure-devops.md#deploy-a-container) or [GitHub Actions](https://github.com/Azure/azure-functions-on-container-apps/blob/main/samples/GitHubActions/Func_on_ACA_GitHubAction_deployment.yml).
 
<!--- replace with [GitHub Actions](./functions-how-to-github-actions.md?tabs=container) after the updated article is published. --> 

You can enable Azure Functions to automatically update your deployment of an image whenever you update the image in the registry.

1. Use the following command to enable continuous deployment and to get the webhook URL:

    ### [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp deployment container config --enable-cd --query CI_CD_URL --output tsv --name <APP_NAME> --resource-group AzureFunctionsContainers-rg
    ```
    
    The [`az functionapp deployment container config`](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-config) command enables continuous deployment and returns the deployment webhook URL. You can retrieve this URL at any later time by using the [`az functionapp deployment container show-cd-url`](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-show-cd-url) command.
    
    ### [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    Update-AzFunctionAppSetting -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg -AppSetting @{"DOCKER_ENABLE_CI" = "true"}
    Get-AzWebAppContainerContinuousDeploymentUrl -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg
    ```
    
    The `DOCKER_ENABLE_CI` application setting controls whether continuous deployment is enabled from the container repository. The [`Get-AzWebAppContainerContinuousDeploymentUrl`](/powershell/module/az.websites/get-azwebappcontainercontinuousdeploymenturl) cmdlet returns the URL of the deployment webhook.
    
    ---    
    
    As before, replace `<APP_NAME>` with your function app name.

1. Copy the deployment webhook URL to the clipboard.

1. Open [Docker Hub](https://hub.docker.com/), sign in, and select **Repositories** on the navigation bar. Locate and select the image, select the **Webhooks** tab, specify a **Webhook name**, paste your URL in **Webhook URL**, and then select **Create**.

    :::image type="content" source="./media/functions-create-function-linux-custom-image/dockerhub-set-continuous-webhook.png" alt-text="Screenshot showing how to add the webhook in your Docker Hub window.":::  

1. With the webhook set, Azure Functions redeploys your image whenever you update it in Docker Hub.

## Enable SSH connections

SSH enables secure communication between a container and a client. With SSH enabled, you can connect to your container using App Service Advanced Tools (Kudu). For easy connection to your container using SSH, Azure Functions provides a base image that has SSH already enabled. You only need to edit your *Dockerfile*, then rebuild, and redeploy the image. You can then connect to the container through the Advanced Tools (Kudu).

1. In your *Dockerfile*, append the string `-appservice` to the base image in your `FROM` instruction, as in the following example:
 
    ```Dockerfile
    FROM mcr.microsoft.com/azure-functions/node:4-node18-appservice
    ```

    This example uses the SSH-enabled version of the Node.js version 18 base image. Visit the [Azure Functions base image repos](https://mcr.microsoft.com/en-us/catalog?search=functions) to verify that you're using the latest version of the SSH-enabled base image.
    
1. Rebuild the image by using the `docker build` command, replace the `<DOCKER_ID>` with your Docker Hub account ID, as in the following example.

    ```console
    docker build --tag <DOCKER_ID>/azurefunctionsimage:v1.0.0 .
    ```

1. Push the updated image to Docker Hub, which should take considerably less time than the first push. Only the updated segments of the image need to be uploaded now.

    ```console
    docker push <DOCKER_ID>/azurefunctionsimage:v1.0.0
    ```
    
1. Azure Functions automatically redeploys the image to your functions app; the process takes place in less than a minute.

1. In a browser, open `https://<app_name>.scm.azurewebsites.net/` and replace `<app_name>` with your unique name. This URL is the Advanced Tools (Kudu) endpoint for your function app container.

1. Sign in to your Azure account, and then select the **SSH** to establish a connection with the container. Connecting might take a few moments if Azure is still updating the container image.

1. After a connection is established with your container, run the `top` command to view the currently running processes.

    :::image type="content" source="media/functions-create-function-linux-custom-image/linux-custom-kudu-ssh-top.png" alt-text="Screenshot that shows Linux top command running in an SSH session.":::
::: zone-end
:::zone pivot="container-apps"  
<!---For when we support connecting to the container console -->
::: zone-end

## Related articles

The following articles provide more information about deploying and managing containers:

+ [Azure Container Apps hosting of Azure Functions](./functions-container-apps-hosting.md)
+ [Scale and hosting options](functions-scale.md)
+ [Kubernetes-based serverless hosting](functions-kubernetes-keda.md)


[Azure portal]: https://portal.azure.com