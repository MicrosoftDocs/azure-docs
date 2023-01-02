---
title: Create Azure Functions on Linux using a custom image
description: Learn how to create Azure Functions running on a custom Linux image.
ms.date: 10/04/2022
ms.topic: tutorial
ms.custom: "devx-track-csharp, mvc, devx-track-python, devx-track-azurepowershell, devx-track-azurecli, devdivchpfy22"
zone_pivot_groups: programming-languages-set-functions-full
---

# Create a function on Linux using a custom container

In this tutorial, you create and deploy your code to Azure Functions as a custom Docker container using a Linux base image. You typically use a custom image when your functions require a specific language version or have a specific dependency or configuration that isn't provided by the built-in image.

::: zone pivot="programming-language-other"
Azure Functions supports any language or runtime using [custom handlers](functions-custom-handlers.md). For some languages, such as the R programming language used in this tutorial, you need to install the runtime or more libraries as dependencies that require the use of a custom container.
::: zone-end

Deploying your function code in a custom Linux container requires [Premium plan](functions-premium-plan.md) or a [Dedicated (App Service) plan](dedicated-plan.md) hosting. Completing this tutorial incurs costs of a few US dollars in your Azure account, which you can minimize by [cleaning-up resources](#clean-up-resources) when you're done.

You can also use a default Azure App Service container as described in [Create your first function hosted on Linux](./create-first-function-cli-csharp.md?pivots=programming-language-python). Supported base images for Azure Functions are found in the [Azure Functions base images repo](https://hub.docker.com/_/microsoft-azure-functions-base).

In this tutorial, you learn how to:

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"
> [!div class="checklist"]
> * Create a function app and Dockerfile using the Azure Functions Core Tools.
> * Build a custom image using Docker.
> * Publish a custom image to a container registry.
> * Create supporting resources in Azure for the function app.
> * Deploy a function app from Docker Hub.
> * Add application settings to the function app.
> * Enable continuous deployment.
> * Enable SSH connections to the container.
> * Add a Queue storage output binding.
::: zone-end
::: zone pivot="programming-language-other"
> [!div class="checklist"]
> * Create a function app and Dockerfile using the Azure Functions Core Tools.
> * Build a custom image using Docker.
> * Publish a custom image to a container registry.
> * Create supporting resources in Azure for the function app.
> * Deploy a function app from Docker Hub.
> * Add application settings to the function app.
> * Enable continuous deployment.
> * Enable SSH connections to the container.
::: zone-end

You can follow this tutorial on any computer running Windows, macOS, or Linux.

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]

[!INCLUDE [functions-requirements-cli](../../includes/functions-requirements-cli.md)]

<!---Requirements specific to Docker --->
You also need to get a Docker and Docker ID:

+ [Docker](https://docs.docker.com/install/)  

+ A [Docker ID](https://hub.docker.com/signup)

[!INCLUDE [functions-cli-create-venv](../../includes/functions-cli-create-venv.md)]

## Create and test the local functions project

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
In a terminal or command prompt, run the following command for your chosen language to create a function app project in the current folder:  
::: zone-end  
::: zone pivot="programming-language-csharp"  

# [In-process](#tab/in-process)
```console
func init --worker-runtime dotnet --docker
```

# [Isolated process](#tab/isolated-process)
```console
func init --worker-runtime dotnet-isolated --docker
```
---
::: zone-end  
::: zone pivot="programming-language-javascript"  
```console
func init --worker-runtime node --language javascript --docker
```
::: zone-end  
::: zone pivot="programming-language-powershell"  
```console
func init --worker-runtime powershell --docker
```
::: zone-end  
::: zone pivot="programming-language-python"  
```console
func init --worker-runtime python --docker
```
::: zone-end  
::: zone pivot="programming-language-typescript"  
```console
func init --worker-runtime node --language typescript --docker
```
::: zone-end
::: zone pivot="programming-language-java"  
In an empty folder, run the following command to generate the Functions project from a [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html):

# [Bash](#tab/bash)
```bash
mvn archetype:generate -DarchetypeGroupId=com.microsoft.azure -DarchetypeArtifactId=azure-functions-archetype -DjavaVersion=8 -Ddocker
```
# [PowerShell](#tab/powershell)
```powershell
mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=8" "-Ddocker"
```
# [Cmd](#tab/cmd)
```cmd
mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=8" "-Ddocker"
```
---

The `-DjavaVersion` parameter tells the Functions runtime which version of Java to use. Use `-DjavaVersion=11` if you want your functions to run on Java 11. When you don't specify `-DjavaVersion`, Maven defaults to Java 8. For more information, see [Java versions](functions-reference-java.md#java-versions).

> [!IMPORTANT]
> The `JAVA_HOME` environment variable must be set to the install location of the correct version of the JDK to complete this article.

Maven asks you for values needed to finish generating the project on deployment.
Follow the prompts and provide the following information:

| Prompt | Value | Description |
| ------ | ----- | ----------- |
| **groupId** | `com.fabrikam` | A value that uniquely identifies your project across all projects, following the [package naming rules](https://docs.oracle.com/javase/specs/jls/se6/html/packages.html#7.7) for Java. |
| **artifactId** | `fabrikam-functions` | A value that is the name of the jar, without a version number. |
| **version** | `1.0-SNAPSHOT` | Select the default value. |
| **package** | `com.fabrikam.functions` | A value that is the Java package for the generated function code. Use the default. |

Type `Y` or press Enter to confirm.

Maven creates the project files in a new folder named _artifactId_, which in this example is `fabrikam-functions`.
::: zone-end

::: zone pivot="programming-language-other"  
```console
func init --worker-runtime custom --docker
```
::: zone-end

The `--docker` option generates a *Dockerfile* for the project, which defines a suitable custom container for use with Azure Functions and the selected runtime.

::: zone pivot="programming-language-java"  
Navigate into the project folder:

```console
cd fabrikam-functions
```
::: zone-end  
::: zone pivot="programming-language-csharp"  

# [In-process](#tab/in-process)
No changes are needed to the Dockerfile.
# [Isolated process](#tab/isolated-process)
Open the Dockerfile and add the following lines after the first `FROM` statement, if not already present:

```docker
# Build requires 3.1 SDK
COPY --from=mcr.microsoft.com/dotnet/core/sdk:3.1 /usr/share/dotnet /usr/share/dotnet
```
---
::: zone-end  
::: zone pivot="programming-language-csharp"
Use the following command to add a function to your project, where the `--name` argument is the unique name of your function and the `--template` argument specifies the function's trigger. `func new` creates a C# code file in your project.

```console
func new --name HttpExample --template "HTTP trigger" --authlevel anonymous
```
::: zone-end

::: zone pivot="programming-language-other,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"
Use the following command to add a function to your project, where the `--name` argument is the unique name of your function and the `--template` argument specifies the function's trigger. `func new` creates a subfolder matching the function name that contains a configuration file named *function.json*.

```console
func new --name HttpExample --template "HTTP trigger" --authlevel anonymous
```
::: zone-end  
::: zone pivot="programming-language-other"
In a text editor, create a file in the project folder named *handler.R*. Add the following code as its content:

```r
library(httpuv)

PORTEnv <- Sys.getenv("FUNCTIONS_CUSTOMHANDLER_PORT")
PORT <- strtoi(PORTEnv , base = 0L)

http_not_found <- list(
  status=404,
  body='404 Not Found'
)

http_method_not_allowed <- list(
  status=405,
  body='405 Method Not Allowed'
)

hello_handler <- list(
  GET = function (request) {
    list(body=paste(
      "Hello,",
      if(substr(request$QUERY_STRING,1,6)=="?name=") 
        substr(request$QUERY_STRING,7,40) else "World",
      sep=" "))
  }
)

routes <- list(
  '/api/HttpExample' = hello_handler
)

router <- function (routes, request) {
  if (!request$PATH_INFO %in% names(routes)) {
    return(http_not_found)
  }
  path_handler <- routes[[request$PATH_INFO]]

  if (!request$REQUEST_METHOD %in% names(path_handler)) {
    return(http_method_not_allowed)
  }
  method_handler <- path_handler[[request$REQUEST_METHOD]]

  return(method_handler(request))
}

app <- list(
  call = function (request) {
    response <- router(routes, request)
    if (!'status' %in% names(response)) {
      response$status <- 200
    }
    if (!'headers' %in% names(response)) {
      response$headers <- list()
    }
    if (!'Content-Type' %in% names(response$headers)) {
      response$headers[['Content-Type']] <- 'text/plain'
    }

    return(response)
  }
)

cat(paste0("Server listening on :", PORT, "...\n"))
runServer("0.0.0.0", PORT, app)
```

In *host.json*, modify the `customHandler` section to configure the custom handler's startup command.

```json
"customHandler": {
  "description": {
      "defaultExecutablePath": "Rscript",
      "arguments": [
      "handler.R"
    ]
  },
  "enableForwardingHttpRequest": true
}
```
::: zone-end

To test the function locally, start the local Azure Functions runtime host in the root of the project folder.
::: zone pivot="programming-language-csharp"  
```console
func start  
```
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"
```console
func start  
```
::: zone-end  
::: zone pivot="programming-language-typescript"  
```console
npm install
npm start
```
::: zone-end  
::: zone pivot="programming-language-java"  
```console
mvn clean package  
mvn azure-functions:run
```
::: zone-end
::: zone pivot="programming-language-other"
```console
R -e "install.packages('httpuv', repos='http://cran.rstudio.com/')"
func start
```
::: zone-end

After you see the `HttpExample` endpoint written to the output, navigate to `http://localhost:7071/api/HttpExample?name=Functions`. The browser must display a "hello" message that echoes back `Functions`, the value supplied to the `name` query parameter.

Press **Ctrl**+**C** to stop the host.

## Build the container image and test locally

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-java,programming-language-typescript"
(Optional) Examine the *Dockerfile* in the root of the project folder. The *Dockerfile* describes the required environment to run the function app on Linux. The complete list of supported base images for Azure Functions can be found in the [Azure Functions base image page](https://hub.docker.com/_/microsoft-azure-functions-base).
::: zone-end

::: zone pivot="programming-language-other"
Examine the *Dockerfile* in the root of the project folder. The *Dockerfile* describes the required environment to run the function app on Linux. Custom handler applications use the `mcr.microsoft.com/azure-functions/dotnet:3.0-appservice` image as its base.

Modify the *Dockerfile* to install R. Replace the contents of the *Dockerfile* with the following code:

```dockerfile
FROM mcr.microsoft.com/azure-functions/dotnet:3.0-appservice 
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

RUN apt update && \
    apt install -y r-base && \
    R -e "install.packages('httpuv', repos='http://cran.rstudio.com/')"

COPY . /home/site/wwwroot
```
::: zone-end

In the root project folder, run the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command, provide a name as `azurefunctionsimage`, and tag as `v1.0.0`. Replace `<DOCKER_ID>` with your Docker Hub account ID. This command builds the Docker image for the container.

```console
docker build --tag <DOCKER_ID>/azurefunctionsimage:v1.0.0 .
```

When the command completes, you can run the new container locally.

To test the build, run the image in a local container using the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command, replace `<docker_id>` again with your Docker Hub account ID, and add the ports argument as `-p 8080:80`:

```console
docker run -p 8080:80 -it <docker_id>/azurefunctionsimage:v1.0.0
```

::: zone pivot="programming-language-csharp"
# [In-process](#tab/in-process)
After the image starts in the local container, browse to `http://localhost:8080/api/HttpExample?name=Functions`, which must display the same "hello" message as before. Because the HTTP triggered function you created uses anonymous authorization, you can call the function running in the container without having to obtain an access key. For more information, see [authorization keys].
# [Isolated process](#tab/isolated-process)
After the image starts in the local container, browse to `http://localhost:8080/api/HttpExample`, which must display the same greeting message as before. Because the HTTP triggered function you created uses anonymous authorization, you can call the function running in the container without having to obtain an access key. For more information, see [authorization keys].

---
::: zone-end
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-other"
After the image starts in the local container, browse to `http://localhost:8080/api/HttpExample?name=Functions`, which must display the same "hello" message as before. Because the HTTP triggered function you created uses anonymous authorization, you can call the function running in the container without having to obtain an access key. For more information, see [authorization keys].
::: zone-end  

After verifying the function app in the container, press **Ctrl**+**C** to stop the docker.

## Push the image to Docker Hub

Docker Hub is a container registry that hosts images and provides image and container services. To share your image, which includes deploying to Azure, you must push it to a registry.

1. If you haven't already signed in to Docker, do so with the [`docker login`](https://docs.docker.com/engine/reference/commandline/login/) command, replacing `<docker_id>` with your Docker Hub account ID. This command prompts you for your username and password. A "sign in Succeeded" message confirms that you're signed in.

    ```console
    docker login
    ```

1. After you've signed in, push the image to Docker Hub by using the [`docker push`](https://docs.docker.com/engine/reference/commandline/push/) command, again replace the `<docker_id>` with your Docker Hub account ID.

    ```console
    docker push <docker_id>/azurefunctionsimage:v1.0.0
    ```

1. Depending on your network speed, pushing the image for the first time might take a few minutes (pushing subsequent changes is much faster). While you're waiting, you can proceed to the next section and create Azure resources in another terminal.

## Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create three resources:

* A [resource group](../azure-resource-manager/management/overview.md), which is a logical container for related resources.
* A [Storage account](../storage/common/storage-account-create.md), which is used to maintain state and other information about your functions.
* A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following commands to create these items. Both Azure CLI and PowerShell are supported.

1. If you haven't done already, sign in to Azure.

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az login
    ```

    The [`az login`](/cli/azure/reference-index#az-login) command signs you into your Azure account.

    # [Azure PowerShell](#tab/azure-powershell) 
    ```azurepowershell
    Connect-AzAccount
    ```

    The [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet signs you into your Azure account.

    ---

1. Create a resource group named `AzureFunctionsContainers-rg` in your chosen region.

    # [Azure CLI](#tab/azure-cli)
    
    ```azurecli
    az group create --name AzureFunctionsContainers-rg --location <REGION>
    ```
 
    The [`az group create`](/cli/azure/group#az-group-create) command creates a resource group. In the above command, replace `<REGION>` with a region near you, using an available region code returned from the [az account list-locations](/cli/azure/account#az-account-list-locations) command.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name AzureFunctionsContainers-rg -Location <REGION>
    ```

    The [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup) command creates a resource group. You generally create your resource group and resources in a region near you, using an available region returned from the [`Get-AzLocation`](/powershell/module/az.resources/get-azlocation) cmdlet.

    ---

1. Create a general-purpose storage account in your resource group and region.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group AzureFunctionsContainers-rg --sku Standard_LRS
    ```

    The [`az storage account create`](/cli/azure/storage/account#az-storage-account-create) command creates the storage account. 

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzStorageAccount -ResourceGroupName AzureFunctionsContainers-rg -Name <STORAGE_NAME> -SkuName Standard_LRS -Location <REGION>
    ```

    The [`New-AzStorageAccount`](/powershell/module/az.storage/new-azstorageaccount) cmdlet creates the storage account.

    ---

    In the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Storage names must contain 3 to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account [supported by Functions](storage-considerations.md#storage-account-requirements).
    
1. Use the command to create a Premium plan for Azure Functions named `myPremiumPlan` in the **Elastic Premium 1** pricing tier (`--sku EP1`), in your `<REGION>`, and in a Linux container (`--is-linux`).

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp plan create --resource-group AzureFunctionsContainers-rg --name myPremiumPlan --location <REGION> --number-of-workers 1 --sku EP1 --is-linux
    ```
    # [Azure PowerShell](#tab/azure-powershell)
    ```powershell
    New-AzFunctionAppPlan -ResourceGroupName AzureFunctionsContainers-rg -Name MyPremiumPlan -Location <REGION> -Sku EP1 -WorkerType Linux
    ```
    ---
    We use the Premium plan here, which can scale as needed. For more information about hosting, see [Azure Functions hosting plans comparison](functions-scale.md). For more information on how to calculate costs, see the [Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).

    The command also creates an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

## Create and configure a function app on Azure with the image

A function app on Azure manages the execution of your functions in your hosting plan. In this section, you use the Azure resources from the previous section to create a function app from an image on Docker Hub and configure it with a connection string to Azure Storage.

1. Create a function app using the following command:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp create --name <APP_NAME> --storage-account <STORAGE_NAME> --resource-group AzureFunctionsContainers-rg --plan myPremiumPlan --deployment-container-image-name <DOCKER_ID>/azurefunctionsimage:v1.0.0
    ```

    In the [`az functionapp create`](/cli/azure/functionapp#az-functionapp-create) command, the *deployment-container-image-name* parameter specifies the image to use for the function app. You can use the [az functionapp config container show](/cli/azure/functionapp/config/container#az-functionapp-config-container-show) command to view information about the image used for deployment. You can also use the [`az functionapp config container set`](/cli/azure/functionapp/config/container#az-functionapp-config-container-set) command to deploy from a different image.

    > [!NOTE]  
    > If you're using a custom container registry, then the *deployment-container-image-name* parameter will refer to the registry URL.

    # [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg -PlanName myPremiumPlan -StorageAccount <STORAGE_NAME> -DockerImageName <DOCKER_ID>/azurefunctionsimage:v1.0.0
    ```
    ---
    
    In this example, replace `<STORAGE_NAME>` with the name you used in the previous section for the storage account. Also, replace `<APP_NAME>` with a globally unique name appropriate to you, and `<DOCKER_ID>` with your Docker Hub account ID. When you're deploying from a custom container registry, use the `deployment-container-image-name` parameter to indicate the URL of the registry.
    
    > [!TIP]  
    > You can use the [`DisableColor` setting](functions-host-json.md#console) in the *host.json* file to prevent ANSI control characters from being written to the container logs.

1. Use the following command to get the connection string for the storage account you created:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az storage account show-connection-string --resource-group AzureFunctionsContainers-rg --name <STORAGE_NAME> --query connectionString --output tsv
    ```

    The connection string for the storage account is returned by using the [`az storage account show-connection-string`](/cli/azure/storage/account) command.

    # [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    $storage_name = "glengagtestdockerstorage"
    $key = (Get-AzStorageAccountKey -ResourceGroupName AzureFunctionsContainers-rg -Name $storage_name)[0].Value
    $string = "DefaultEndpointsProtocol=https;EndpointSuffix=core.windows.net;AccountName=" + $storage_name + ";AccountKey=" + $key
    Write-Output($string) 
    ```
    The key returned by the [`Get-AzStorageAccountKey`](/powershell/module/az.storage/get-azstorageaccountkey) cmdlet is used to construct the connection string for the storage account.

    ---    

    Replace `<STORAGE_NAME>` with the name of the storage account you created earlier.

1. Use the following command to add the setting to the function app:
 
    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp config appsettings set --name <APP_NAME> --resource-group AzureFunctionsContainers-rg --settings AzureWebJobsStorage=<CONNECTION_STRING>
    ```
    The [`az functionapp config appsettings set`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-ppsettings-set) command creates the setting.

    # [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    Update-AzFunctionAppSetting -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg -AppSetting @{"AzureWebJobsStorage"="<CONNECTION_STRING>"}
    ```
    The [`Update-AzFunctionAppSetting`](/powershell/module/az.functions/update-azfunctionappsetting) cmdlet creates the setting.

    ---

    In this command, replace `<APP_NAME>` with the name of your function app and `<CONNECTION_STRING>` with the connection string from the previous step. The connection should be a long encoded string that begins with `DefaultEndpointProtocol=`.
 
1. The function can now use this connection string to access the storage account.

> [!NOTE]
> If you publish your custom image to a private container registry, you must also set the `DOCKER_REGISTRY_SERVER_USERNAME` and `DOCKER_REGISTRY_SERVER_PASSWORD` variables. For more information, see [Custom containers](../app-service/reference-app-settings.md#custom-containers) in the App Service settings reference.

## Verify your functions on Azure

With the image deployed to your function app in Azure, you can now invoke the function as before through HTTP requests.
In your browser, navigate to the following URL:

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-other"  
`https://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`  
::: zone-end  
::: zone pivot="programming-language-csharp"  
# [In-process](#tab/in-process) 
`https://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`
# [Isolated process](#tab/isolated-process)
`https://<APP_NAME>.azurewebsites.net/api/HttpExample`

---
:::zone-end  

Replace `<APP_NAME>` with the name of your function app. When you navigate to this URL, the browser must display similar output as when you ran the function locally.

## Enable continuous deployment to Azure

You can enable Azure Functions to automatically update your deployment of an image whenever you update the image in the registry.

1. Use the following command to enable continuous deployment and to get the webhook URL:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp deployment container config --enable-cd --query CI_CD_URL --output tsv --name <APP_NAME> --resource-group AzureFunctionsContainers-rg
    ```
    
    The [`az functionapp deployment container config`](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-config) command enables continuous deployment and returns the deployment webhook URL. You can retrieve this URL at any later time by using the [`az functionapp deployment container show-cd-url`](/cli/azure/functionapp/deployment/container#az-functionapp-deployment-container-show-cd-url) command.

    # [Azure PowerShell](#tab/azure-powershell)
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

1. In your *Dockerfile*, append the string `-appservice` to the base image in your `FROM` instruction.

    ::: zone pivot="programming-language-csharp"
    ```Dockerfile
    FROM mcr.microsoft.com/azure-functions/dotnet:3.0-appservice
    ```
    ::: zone-end

    ::: zone pivot="programming-language-javascript"
    ```Dockerfile
    FROM mcr.microsoft.com/azure-functions/node:2.0-appservice
    ```
    ::: zone-end

    ::: zone pivot="programming-language-powershell"
    ```Dockerfile
    FROM mcr.microsoft.com/azure-functions/powershell:2.0-appservice
    ```
    ::: zone-end

    ::: zone pivot="programming-language-python"
    ```Dockerfile
    FROM mcr.microsoft.com/azure-functions/python:2.0-python3.7-appservice
    ```
    ::: zone-end

    ::: zone pivot="programming-language-typescript"
    ```Dockerfile
    FROM mcr.microsoft.com/azure-functions/node:2.0-appservice
    ```
    ::: zone-end
    
1. Rebuild the image by using the `docker build` command again, replace the `<docker_id>` with your Docker Hub account ID.

    ```console
    docker build --tag <docker_id>/azurefunctionsimage:v1.0.0 .
    ```

1. Push the updated image to Docker Hub, which should take considerably less time than the first push. Only the updated segments of the image need to be uploaded now.

    ```console
    docker push <docker_id>/azurefunctionsimage:v1.0.0
    ```
    
1. Azure Functions automatically redeploys the image to your functions app; the process takes place in less than a minute.

1. In a browser, open `https://<app_name>.scm.azurewebsites.net/` and replace `<app_name>` with your unique name. This URL is the Advanced Tools (Kudu) endpoint for your function app container.

1. Sign in to your Azure account, and then select the **SSH** to establish a connection with the container. Connecting might take a few moments if Azure is still updating the container image.

1. After a connection is established with your container, run the `top` command to view the currently running processes.

    :::image type="content" source="media/functions-create-function-linux-custom-image/linux-custom-kudu-ssh-top.png" alt-text="Screenshot that shows Linux top command running in an SSH session.":::

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"

## Write to Azure Queue Storage

Azure Functions lets you connect your functions to other Azure services and resources without having to write your own integration code. These *bindings*, which represent both input and output, are declared within the function definition. Data from bindings is provided to the function as parameters. A *trigger* is a special type of input binding. Although a function has only one trigger, it can have multiple input and output bindings. For more information, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

This section shows you how to integrate your function with an Azure Queue Storage. The output binding that you add to this function writes data from an HTTP request to a message in the queue.

[!INCLUDE [functions-cli-get-storage-connection](../../includes/functions-cli-get-storage-connection.md)]
::: zone-end

::: zone pivot="programming-language-csharp"  
## Register binding extensions
::: zone-end 

[!INCLUDE [functions-register-storage-binding-extension-csharp](../../includes/functions-register-storage-binding-extension-csharp.md)]

[!INCLUDE [functions-add-output-binding-cli](../../includes/functions-add-output-binding-cli.md)]

::: zone pivot="programming-language-csharp"  
[!INCLUDE [functions-add-storage-binding-csharp-library](../../includes/functions-add-storage-binding-csharp-library.md)]  
::: zone-end  
::: zone pivot="programming-language-java" 
[!INCLUDE [functions-add-output-binding-java-cli](../../includes/functions-add-output-binding-java-cli.md)]
::: zone-end  

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"

## Add code to use the output binding

With the queue binding defined, you can now update your function to write messages to the queue using the binding parameter.
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [functions-add-output-binding-python](../../includes/functions-add-output-binding-python.md)]
::: zone-end  

::: zone pivot="programming-language-javascript"  
[!INCLUDE [functions-add-output-binding-js](../../includes/functions-add-output-binding-js.md)]
::: zone-end  

::: zone pivot="programming-language-typescript"  
[!INCLUDE [functions-add-output-binding-ts](../../includes/functions-add-output-binding-ts.md)]
::: zone-end  

::: zone pivot="programming-language-powershell"  
[!INCLUDE [functions-add-output-binding-powershell](../../includes/functions-add-output-binding-powershell.md)]  
::: zone-end

::: zone pivot="programming-language-csharp"  
[!INCLUDE [functions-add-storage-binding-csharp-library-code](../../includes/functions-add-storage-binding-csharp-library-code.md)]
::: zone-end 

::: zone pivot="programming-language-java"
[!INCLUDE [functions-add-output-binding-java-code](../../includes/functions-add-output-binding-java-code.md)]

[!INCLUDE [functions-add-output-binding-java-test-cli](../../includes/functions-add-output-binding-java-test-cli.md)]
::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"
## Update the image in the registry

1. In the root folder, run `docker build` again, and this time update the version in the tag to `v1.0.1`. As before, replace `<docker_id>` with your Docker Hub account ID.

    ```console
    docker build --tag <docker_id>/azurefunctionsimage:v1.0.1 .
    ```

1. Push the updated image back to the repository with `docker push`.

    ```console
    docker push <docker_id>/azurefunctionsimage:v1.0.1
    ```

1. Because you configured continuous delivery, updating the image in the registry again automatically updates your function app in Azure.

## View the message in the Azure Storage queue

In a browser, use the same URL as before to invoke your function. The browser must display the same response as before, because you didn't modify that part of the function code. The added code, however, wrote a message using the `name` URL parameter to the `outqueue` storage queue.

[!INCLUDE [functions-add-output-binding-view-queue-cli](../../includes/functions-add-output-binding-view-queue-cli.md)]

::: zone-end

## Clean up resources

If you want to continue working with Azure Function using the resources you created in this tutorial, you can leave all those resources in place. Because you created a Premium Plan for Azure Functions, you'll incur one or two USD per day in ongoing costs.

To avoid ongoing costs, delete the `AzureFunctionsContainers-rg` resource group to clean up all the resources in that group:

```azurecli
az group delete --name AzureFunctionsContainers-rg
```

## Next steps

+ [Monitoring functions](functions-monitoring.md)
+ [Scale and hosting options](functions-scale.md)
+ [Kubernetes-based serverless hosting](functions-kubernetes-keda.md)

[authorization keys]: functions-bindings-http-webhook-trigger.md#authorization-keys
