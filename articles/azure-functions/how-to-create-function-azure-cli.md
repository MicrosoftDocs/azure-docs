---
title: "Create a function in Azure using the Azure CLI"
description: "Learn how to create an Azure Functions code project from the command line using the Azure CLI, then publish the local project to serverless hosting in Azure Functions."
ms.date: 07/08/2025
ms.topic: quickstart
ms.custom: devx-track-csharp, devx-track-azurecli, devx-track-azurepowershell, mode-other, devx-track-dotnet
zone_pivot_groups: programming-languages-set-functions
---

# Quickstart: Create a function in Azure from the command line

In this article, you use command-line tools locally to create a function that responds to HTTP requests. After verifying your code locally, you deploy it to a serverless hosting plan in Azure Functions. 

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Configure your local environment

Before you begin, you must have the following:

[!INCLUDE [functions-requirements-azure-cli](../../includes/functions-requirements-azure-cli.md)]

+ The [`jq` command line JSON processor](https://jqlang.org/download/), used to parse JSON output, and is also available in Azure Cloud Shell.

[!INCLUDE [functions-install-core-tools](../../includes/functions-install-core-tools.md)]

## Create a local function project and function

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
1. In a terminal or command prompt, run the following command for your chosen language to create a function app project in the current folder:  
::: zone-end  
::: zone pivot="programming-language-csharp"  

    ```console
    func init --worker-runtime dotnet-isolated 
    ```
::: zone-end  
::: zone pivot="programming-language-javascript"  
    ```console
    func init --worker-runtime node --language javascript 
    ```
::: zone-end  
::: zone pivot="programming-language-powershell"  
    ```console
    func init --worker-runtime powershell 
    ```
::: zone-end  
::: zone pivot="programming-language-python"  
    ```console
    func init --worker-runtime python 
    ```
::: zone-end  
::: zone pivot="programming-language-typescript"  
    ```console
    func init --worker-runtime node --language typescript 
    ```
::: zone-end
::: zone pivot="programming-language-java"
<!--- The Maven archetype requires it's own create flow...-->  
1. In an empty folder, run this `mvn` command to generate the code project from an Azure Functions [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html):


    ### [Bash](#tab/bash)
    
    ```bash
    mvn archetype:generate -DarchetypeGroupId=com.microsoft.azure -DarchetypeArtifactId=azure-functions-archetype -DjavaVersion=8
    ```
    
    ### [PowerShell](#tab/powershell)
    
    ```powershell
    mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=8" 
    ```
    
    ### [Cmd](#tab/cmd)
    
    ```cmd
    mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=8"
    ```
    
    ---

    > [!IMPORTANT]
    > + Use `-DjavaVersion=11` if you want your functions to run on Java 11. To learn more, see [Java versions](functions-reference-java.md#java-versions). 
    > + The `JAVA_HOME` environment variable must be set to the install location of the correct version of the JDK to complete this article.

2. Maven asks you for values needed to finish generating the project on deployment.   
    Provide the following values when prompted:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | **groupId** | `com.fabrikam` | A value that uniquely identifies your project across all projects, following the [package naming rules](https://docs.oracle.com/javase/specs/jls/se6/html/packages.html#7.7) for Java. |
    | **artifactId** | `fabrikam-functions` | A value that is the name of the jar, without a version number. |
    | **version** | `1.0-SNAPSHOT` | Choose the default value. |
    | **package** | `com.fabrikam` | A value that is the Java package for the generated function code. Use the default. |

3. Type `Y` or press Enter to confirm.

    Maven creates the project files in a new folder with a name of _artifactId_, which in this example is `fabrikam-functions`. 
 
4. Navigate into the project folder:

    ```console
    cd fabrikam-functions
    ```
::: zone-end  

    The project root folder contains various files for the project, including configurations files named [local.settings.json](functions-develop-local.md#local-settings-file) and [host.json](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python" 
2. Use this `func new` command to add a function to your project:

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```

    A new code file is added to your project. In this case, the `--name` argument is the unique name of your function (`HttpExample`) and the `--template` argument specifies an HTTP trigger. 
::: zone-end
## Run the function locally

1. Run your function by starting the local Azure Functions runtime host from the root folder:

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

    Toward the end of the output, the following lines should appear:

    <pre>
    ...

    Now listening on: http://0.0.0.0:7071
    Application started. Press Ctrl+C to shut down.

    Http Functions:

            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ...

    </pre>

    >[!NOTE]
    > If HttpExample doesn't appear as shown above, you likely started the host from outside the root folder of the project. In that case, use **Ctrl**+**C** to stop the host, navigate to the project's root folder, and run the previous command again.

1. Copy the URL of your `HttpExample` function from this output to a browser and browse to the function URL and you should receive success response with a "hello world" message.

1. When you're done, use **Ctrl**+**C** and choose `y` to stop the functions host.

[!INCLUDE [functions-create-azure-resources-cli](../../includes/functions-create-azure-resources-flex-cli.md)]

## Update application settings

To enable the Functions host to connect to the default storage account using shared secrets, you must replace the `AzureWebJobsStorage` connection string setting with a complex setting, prefixed with `AzureWebJobsStorage`, that uses the user-assigned managed identity to connect to the storage account.

1. Remove the existing `AzureWebJobsStorage` connection string setting:

    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="52" :::

    The [az functionapp config appsettings delete](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-delete) command removes this setting from your app.

1. Add equivalent settings, with an `AzureWebJobsStorage__` prefix, that define a user-assigned managed identity connection to the default storage account:
 
    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="47-51" :::
     
At this point, the Functions host is able to connect to the storage account securely using managed identities. You can now deploy your project code to the Azure resources

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

## Invoke the function on Azure

Because your function uses an HTTP trigger and supports GET requests, you invoke it by making an HTTP request to its URL. It's easiest to do this in a browser.

Copy the complete **Invoke URL** shown in the output of the publish command into a browser address bar. When you navigate to this URL, the browser should display similar output as when you ran the function locally.

---

[!INCLUDE [functions-streaming-logs-cli-qs](../../includes/functions-streaming-logs-cli-qs.md)]

[!INCLUDE [functions-cleanup-resources-cli](../../includes/functions-cleanup-resources-cli.md)]

## Next steps

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md?pivots=programming-language-csharp&tabs=isolated-process)
> [!div class="nextstepaction"]
> [Connect to Azure Queue Storage](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-csharp&tabs=isolated-process)
