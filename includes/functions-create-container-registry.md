---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: include
ms.date: 01/03/2025
ms.author: glenga
---

## Choose your development language

First, you use Azure Functions tools to create your project code as a function app in a Docker container using a language-specific Linux base image. Make sure to select your language of choice at the top of the article. 

Core Tools automatically generates a Dockerfile for your project that uses the most up-to-date version of the correct base image for your functions language. You should regularly update your container from the latest base image and redeploy from the updated version of your container. For more information, see [Creating containerized function apps](../articles/azure-functions/functions-how-to-custom-container.md#creating-containerized-function-apps).

## Prerequisites 

Before you begin, you must have the following requirements in place:

::: zone pivot="programming-language-csharp"
+ Install the [.NET 8.0 SDK](https://dotnet.microsoft.com/download).

+ Install [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md#v2) version 4.0.5198, or a later version.
::: zone-end  
<!---add back programming-language-other-->
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"
+ Install [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md#v2) version 4.x.
:::zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"
+ Install a version of [Node.js](https://nodejs.org/) that is [supported by Azure Functions](../articles/azure-functions/functions-reference-node.md#supported-versions).
::: zone-end

::: zone pivot="programming-language-python"
+ Install a version of Python that is [supported by Azure Functions](../articles/azure-functions/functions-reference-python.md#python-version). 
::: zone-end
::: zone pivot="programming-language-powershell"
+ Install the [.NET 6 SDK](https://dotnet.microsoft.com/download).
::: zone-end
::: zone pivot="programming-language-java"  
+ Install a version of the [Java Developer Kit](/azure/developer/java/fundamentals/java-jdk-long-term-support) that is [supported by Azure Functions](../articles/azure-functions/functions-reference-java.md#supported-versions).

+ Install [Apache Maven](https://maven.apache.org) version 3.0 or above.
::: zone-end
<!---removing the other pivot until we camn get ACA tested with custom handlers
::: zone pivot="programming-language-other"
+ Development tools for the language you're using. This tutorial uses the [R programming language](https://www.r-project.org/) as an example.
::: zone-end
-->
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or a later version.

If you don't have an [Azure subscription](../articles/guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

<!---Requirements specific to Docker -->
To publish the containerized function app image you create to a container registry, you need a Docker ID and [Docker](https://docs.docker.com/install/) running on your local computer. If you don't have a Docker ID, you can [create a Docker account](https://hub.docker.com/signup).

### [Azure Container Registry](#tab/acr)

You also need to complete the [Create a container registry](/azure/container-registry/container-registry-get-started-portal#create-a-container-registry) section of the Container Registry quickstart to create a registry instance. Make a note of your fully qualified login server name.

### [Docker Hub](#tab/docker)

You should be all set.

---

>[!IMPORTANT]
>This article currently shows how to connect to the container registry by using shared secret credentials. For the best security, you should instead use only a managed identity-based connection to Azure Container Registry using Microsoft Entra authentication. For more information, see the [Functions developer guide](../articles/azure-functions/functions-reference.md#connections).

[!INCLUDE [functions-cli-create-venv](functions-cli-create-venv.md)]

## Create and test the local functions project

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
In a terminal or command prompt, run the following command for your chosen language to create a function app project in the current folder:  
::: zone-end  
::: zone pivot="programming-language-csharp"  

```console
func init --worker-runtime dotnet-isolated --docker
```
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

### [Bash](#tab/bash)
```bash
mvn archetype:generate -DarchetypeGroupId=com.microsoft.azure -DarchetypeArtifactId=azure-functions-archetype -DjavaVersion=8 -Ddocker
```
### [PowerShell](#tab/powershell)
```powershell
mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=8" "-Ddocker"
```
### [Cmd](#tab/cmd)
```cmd
mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=8" "-Ddocker"
```
---

The `-DjavaVersion` parameter tells the Functions runtime which version of Java to use. Use `-DjavaVersion=11` if you want your functions to run on Java 11. When you don't specify `-DjavaVersion`, Maven defaults to Java 8. For more information, see [Java versions](../articles/azure-functions/functions-reference-java.md#java-versions).

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
<!---
:: zone pivot="programming-language-other"  
```console
func init --worker-runtime custom --docker
```
::: zone-end
-->
The `--docker` option generates a *Dockerfile* for the project, which defines a suitable container for use with Azure Functions and the selected runtime.

::: zone pivot="programming-language-java"  
Navigate into the project folder:

```console
cd fabrikam-functions
```
::: zone-end  
::: zone pivot="programming-language-csharp"
Use the following command to add a function to your project, where the `--name` argument is the unique name of your function and the `--template` argument specifies the function's trigger. `func new` creates a C# code file in your project.

```console
func new --name HttpExample --template "HTTP trigger"
```
::: zone-end
<!---add back programming-language-other-->
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"
Use the following command to add a function to your project, where the `--name` argument is the unique name of your function and the `--template` argument specifies the function's trigger. `func new` creates a subfolder matching the function name that contains a configuration file named *function.json*.

```console
func new --name HttpExample --template "HTTP trigger"
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
::: zone pivot="programming-language-csharp"  
After you see the `HttpExample` endpoint written to the output, navigate to that endpoint. You should see a welcome message in the response output.
::: zone-end  
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"
After you see the `HttpExample` endpoint written to the output, navigate to `http://localhost:7071/api/HttpExample?name=Functions`. The browser must display a "hello" message that echoes back `Functions`, the value supplied to the `name` query parameter.
::: zone-end

Press **Ctrl**+**C** (**Command**+**C** on macOS) to stop the host.

## Build the container image and verify locally

(Optional) Examine the _Dockerfile_ in the root of the project folder. The _Dockerfile_ describes the required environment to run the function app on Linux. The complete list of supported base images for Azure Functions can be found in the [Azure Functions base image page](https://hub.docker.com/_/microsoft-azure-functions-base).

In the root project folder, run the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command, provide a name as `azurefunctionsimage`, and tag as `v1.0.0`. Replace `<DOCKER_ID>` with your Docker Hub account ID. This command builds the Docker image for the container.

```console
docker build --tag <DOCKER_ID>/azurefunctionsimage:v1.0.0 .
```

When the command completes, you can run the new container locally.

To verify the build, run the image in a local container using the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command, replace `<DOCKER_ID>` again with your Docker Hub account ID, and add the ports argument as `-p 8080:80`:

```console
docker run -p 8080:80 -it <DOCKER_ID>/azurefunctionsimage:v1.0.0
```

::: zone pivot="programming-language-csharp"
After the image starts in the local container, browse to `http://localhost:8080/api/HttpExample`, which must display the same greeting message as before. Because the HTTP triggered function you created uses anonymous authorization, you can call the function running in the container without having to obtain an access key. For more information, see [authorization keys].
::: zone-end  
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"
After the image starts in the local container, browse to `http://localhost:8080/api/HttpExample?name=Functions`, which must display the same "hello" message as before. Because the HTTP triggered function you created uses anonymous authorization, you can call the function running in the container without having to obtain an access key. For more information, see [authorization keys].
::: zone-end  

After verifying the function app in the container, press **Ctrl**+**C** (**Command**+**C** on macOS) to stop execution.

## Publish the container image to a registry 

To make your container image available for deployment to a hosting environment, you must push it to a container registry. As a security best practice, you should use an Azure Container Registry instance and enforce managed identity-based connections. Docker Hub requires you to authenticate using shared secrets, which make your deployments more vulnerable.   

### [Azure Container Registry](#tab/acr)

Azure Container Registry is a private registry service for building, storing, and managing container images and related artifacts. You should use a private registry service for publishing your containers to Azure services.

1. Use this command to sign in to your registry instance using your current Azure credentials:

    ```azurecli
    az acr login --name <REGISTRY_NAME>
    ```

    In the previous command, replace `<REGISTRY_NAME>` with the name of your Container Registry instance.

1. Use this command to tag your image with the fully qualified name of your registry login server:

    ```docker
    docker tag <DOCKER_ID>/azurefunctionsimage:v1.0.0 <LOGIN_SERVER>/azurefunctionsimage:v1.0.0 
    ```
    
    Replace `<LOGIN_SERVER>` with the fully qualified name of your registry login server and `<DOCKER_ID>` with your Docker ID.

1.  Use this command to push the container to your registry instance:
 
    ```docker
    docker push <LOGIN_SERVER>/azurefunctionsimage:v1.0.0
    ```
 
### [Docker Hub](#tab/docker)

Docker Hub is a container registry that hosts images and provides image and container services. 

1. If you haven't already signed in to Docker, do so with the [`docker login`](https://docs.docker.com/engine/reference/commandline/login/) command, replacing `<docker_id>` with your Docker Hub account ID. This command prompts you for your username and password. A "sign in Succeeded" message confirms that you're signed in.

    ```console
    docker login
    ```

1. After you've signed in, push the image to Docker Hub by using the [`docker push`](https://docs.docker.com/engine/reference/commandline/push/) command, again replace the `<docker_id>` with your Docker Hub account ID.

    ```console
    docker push <DOCKER_ID>/azurefunctionsimage:v1.0.0
    ```

    Depending on your network speed, pushing the image for the first time might take a few minutes. Subsequent changes are pushed faster. 

---

[authorization keys]: ../articles/azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys
