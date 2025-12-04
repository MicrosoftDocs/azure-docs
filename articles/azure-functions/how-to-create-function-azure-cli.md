---
title: Create a function in Azure from the command line
description: Learn how to use command line tools, such as Azure Functions Core Tools, to create a function code project, create Azure resources, and publish function code to run in Azure Functions.
ms.date: 07/22/2025
ms.topic: quickstart
ms.custom: devx-track-csharp, devx-track-azurecli, devx-track-azurepowershell, mode-other, devx-track-dotnet
zone_pivot_groups: programming-languages-set-functions-full
---

# Quickstart: Create a function in Azure from the command line

In this article, you use local command-line tools to create a function that responds to HTTP requests. After verifying your code locally, you deploy it to a serverless Flex Consumption hosting plan in Azure Functions. 

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account. 

Make sure to select your preferred development language at the top of the article.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

[!INCLUDE [functions-requirements-azure-cli](../../includes/functions-requirements-azure-cli.md)]
::: zone pivot="programming-language-other"  
### [Go](#tab/go)
+ [Go](https://go.dev/doc/install), latest version recommended. Use the `go version` command to check your version.
### [Rust](#tab/rust)
+ Rust toolchain using [rustup](https://www.rust-lang.org/tools/install). Use the `rustc --version` command to check your version.
---
::: zone-end  
+ [Azure CLI](/cli/azure/install-azure-cli)

+ The [`jq` command line JSON processor](https://jqlang.org/download/), used to parse JSON output, and is also available in Azure Cloud Shell.

[!INCLUDE [functions-install-core-tools](../../includes/functions-install-core-tools.md)]

[!INCLUDE [functions-cli-create-venv](../../includes/functions-cli-create-venv.md)]

## Create a local code project and function

In Azure Functions, your code project is an app that contains one or more individual functions that each respond to a specific trigger. All functions in a project share the same configurations and are deployed as a unit to Azure. In this section, you create a code project that contains a single function.
::: zone pivot="programming-language-csharp" 
1. In a terminal or command prompt, run this [`func init`](./functions-core-tools-reference.md#func-init) command to create a function app project in the current folder:  
 
    ```console
    func init --worker-runtime dotnet-isolated 
    ```

::: zone-end  
::: zone pivot="programming-language-javascript"  
1. In a terminal or command prompt, run this [`func init`](./functions-core-tools-reference.md#func-init) command to create a function app project in the current folder:  
 
    ```console
    func init --worker-runtime node --language javascript 
    ```

::: zone-end  
::: zone pivot="programming-language-powershell"  
1. In a terminal or command prompt, run this [`func init`](./functions-core-tools-reference.md#func-init) command to create a function app project in the current folder:  
 
    ```console
    func init --worker-runtime powershell 
    ```

::: zone-end  
::: zone pivot="programming-language-python"  
1. In a terminal or command prompt, run this [`func init`](./functions-core-tools-reference.md#func-init) command to create a function app project in the current folder:  
 
    ```console
    func init --worker-runtime python 
    ```

::: zone-end  
::: zone pivot="programming-language-typescript" 
 1. In a terminal or command prompt, run this [`func init`](./functions-core-tools-reference.md#func-init) command to create a function app project in the current folder:  
 
    ```console
    func init --worker-runtime node --language typescript 
    ```

::: zone-end
::: zone pivot="programming-language-other" 
 1. In a terminal or command prompt, run this [`func init`](./functions-core-tools-reference.md#func-init) command to create a function app project in the current folder:  
 
    ```console
    func init --worker-runtime custom 
    ```

::: zone-end
::: zone pivot="programming-language-java"
<!--- The Maven archetype requires it's own create flow...-->  
1. In an empty folder, run this `mvn` command to generate the code project from an Azure Functions [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html):


    ### [Bash](#tab/bash)
    
    ```bash
    mvn archetype:generate -DarchetypeGroupId=com.microsoft.azure -DarchetypeArtifactId=azure-functions-archetype -DjavaVersion=17
    ```
    
    ### [PowerShell](#tab/powershell)
    
    ```powershell
    mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=17" 
    ```
    
    ### [Cmd](#tab/cmd)
    
    ```cmd
    mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=17"
    ```
    
    ---

    > [!IMPORTANT]
    > + Use `-DjavaVersion=11` if you want your functions to run on Java 11. To learn more, see [Java versions](functions-reference-java.md#java-versions). 
    > + Set the `JAVA_HOME` environment variable to the install location of the correct version of the JDK to complete this article.

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

    You can review the template-generated code for your new HTTP trigger function in _Function.java_ in the _\src\main\java\com\fabrikam_ project directory.
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-other" 
2. Use this [`func new`](./functions-core-tools-reference.md#func-new) command to add a function to your project:

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "function"
    ```

    A new code file is added to your project. In this case, the `--name` argument is the unique name of your function (`HttpExample`) and the `--template` argument specifies an HTTP trigger. 
::: zone-end

The project root folder contains various files for the project, including configurations files named [local.settings.json](functions-develop-local.md#local-settings-file) and [host.json](functions-host-json.md). Because _local.settings.json_ can contain secrets downloaded from Azure, the file is excluded from source control by default in the _.gitignore_ file.
::: zone pivot="programming-language-other"
[!INCLUDE [functions-custom-handler-create-function-code](../../includes/functions-custom-handler-create-function-code.md)]  
::: zone-end 
## Run the function locally

Verify your new function by running the project locally and calling the function endpoint. 

1. Use this command to start the local Azure Functions runtime host in the root of the project folder: 
    ::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-other"
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

    Toward the end of the output, the following lines appear:

    <pre>
    ...

    Now listening on: http://0.0.0.0:7071
    Application started. Press Ctrl+C to shut down.

    Http Functions:

            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ...

    </pre>


1. Copy the URL of your `HttpExample` function from this output to a browser and browse to the function URL. You should receive a success response with a "hello world" message.

    >[!NOTE]
    > Because access key authorization isn't enforced when running locally, the function URL returned doesn't include the access key value and you don't need it to call your function. 

1. When you're done, use **Ctrl**+**C** and choose `y` to stop the functions host.

[!INCLUDE [functions-create-azure-resources-cli](../../includes/functions-create-azure-resources-flex-cli.md)]

## Update application settings

To enable the Functions host to connect to the default storage account by using shared secrets, replace the `AzureWebJobsStorage` connection string setting with several settings that are prefixed with `AzureWebJobsStorage__`. These settings define a complex setting that your app uses to connect to storage and Application Insights with a user-assigned managed identity.

1. Use this script to get the client ID of the user-assigned managed identity and uses it to define managed identity connections to both storage and Application Insights:
 
    ```azurecli
    clientId=$(az identity show --name func-host-storage-user \
        --resource-group AzureFunctionsQuickstart-rg --query 'clientId' -o tsv)
    az functionapp config appsettings set --name <APP_NAME> --resource-group "AzureFunctionsQuickstart-rg" \
        --settings AzureWebJobsStorage__accountName=<STORAGE_NAME> \
        AzureWebJobsStorage__credential=managedidentity AzureWebJobsStorage__clientId=$clientId \
        APPLICATIONINSIGHTS_AUTHENTICATION_STRING="ClientId=$clientId;Authorization=AAD"
    ```

    In this script, replace `<APP_NAME>` and `<STORAGE_NAME>` with the names of your function app and storage account, respectively.
     

1. Run the [az functionapp config appsettings delete](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-delete) command to remove the existing `AzureWebJobsStorage` connection string setting, which contains a shared secret key:

    ```azurecli
    az functionapp config appsettings delete --name <APP_NAME> --resource-group "AzureFunctionsQuickstart-rg" --setting-names AzureWebJobsStorage
    ```

    In this example, replace `<APP_NAME>` with the names of your function app. 

At this point, the Functions host can connect to the storage account securely by using managed identities instead of shared secrets. You can now deploy your project code to the Azure resources.

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-other"
[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]
::: zone-end
::: zone pivot="programming-language-java"
## Update the pom.xml file

After you successfully create your function app in Azure, update the pom.xml file so that Maven can deploy to your new app. Otherwise, Maven creates a new set of Azure resources during deployment.

1. In Azure Cloud Shell, use this [`az functionapp show`](/cli/azure/functionapp#az-functionapp-show) command to get the deployment container URL and ID of the new user-assigned managed identity:

    ```azurecli
    az functionapp show --name <APP_NAME> --resource-group AzureFunctionsQuickstart-rg  \
        --query "{userAssignedIdentityResourceId: properties.functionAppConfig.deployment.storage.authentication.userAssignedIdentityResourceId, \
        containerUrl: properties.functionAppConfig.deployment.storage.value}"
    ```

    In this example, replace `<APP_NAME>` with the names of your function app. 

1. In the project root directory, open the pom.xml file in a text editor, locate the `properties` element, and update these specific property values:

    | Property name | Value |
    | ---- | ---- |
    |`java.version` | Use the same [supported language stack version](supported-languages.md) you verified locally, such as `17`. |
    |`azure.functions.maven.plugin.version`| `1.37.1` |
    |`azure.functions.java.library.version`| `3.1.0` |   
    |`functionAppName`| The name of your function app in Azure. | 

1. Find the `configuration` section of the `azure-functions-maven-plugin` and replace it with this XML fragment:

    ```xml
    <configuration>
        <appName>${functionAppName}</appName>
        <resourceGroup>AzureFunctionsQuickstart-rg</resourceGroup>
        <pricingTier>Flex Consumption</pricingTier>
        <region>....</region>
        <runtime>
            <os>linux</os>
            <javaVersion>${java.version}</javaVersion>
        </runtime>
        <deploymentStorageAccount>...</deploymentStorageAccount>
        <deploymentStorageResourceGroup>AzureFunctionsQuickstart-rg</deploymentStorageResourceGroup>
        <deploymentStorageContainer>...</deploymentStorageContainer>
        <storageAuthenticationMethod>UserAssignedIdentity</storageAuthenticationMethod>
        <userAssignedIdentityResourceId>...</userAssignedIdentityResourceId>
        <appSettings>
            <property>
                <name>FUNCTIONS_EXTENSION_VERSION</name>
                <value>~4</value>
            </property>
        </appSettings>
    </configuration>
    ```

1. In the new `configuration` element, make these specific replacements of the ellipses (`...`) values:  

    | Configuration | Value |
    | ---- | ---- |
    |`region` | The region code of your existing function app, such as `eastus`. |
    |`deploymentStorageAccount`| The name of your storage account. |
    |`deploymentStorageContainer`| The name of the deployment share, which comes after the `\` in the `containerUrl` value you obtained. |   
    |`userAssignedIdentityResourceId`| The fully qualified resource ID of your managed identity, which you obtained. | 

1. Save your changes to the _pom.xml_ file. 

You can now use Maven to deploy your code project to your existing app.  

## Deploy the function project to Azure

1. From the command prompt, run this command:

    ```console
    mvn clean package azure-functions:deploy
    ```

1. After your deployment succeeds, run this Core Tools command to get the URL endpoint value, including the access key:

    ```
    func azure functionapp list-functions <APP_NAME> --show-keys
    ```
    
    In this example, again replace `<APP_NAME>` with the name of your app.

1. Copy the returned endpoint URL and key, which you use to invoke the function endpoint.    
::: zone-end

## Invoke the function on Azure

Because your function uses an HTTP trigger and supports GET requests, you invoke it by making an HTTP request to its URL using the function-level access key. It's easiest to execute a GET request in a browser. 

Paste the URL and access key you copied into a browser address bar. 

The endpoint URL should look something like this example:

`https://contoso-app.azurewebsites.net/api/httpexample?code=aabbccdd...`

In this case, you must also provide an access key in the query string when making a GET request to the endpoint URL. Using an access key is recommended to limit access from random clients. When making a POST request using an HTTP client, you should instead provide the access key in the `x-functions-key` header.

When you navigate to this URL, the browser should display similar output as when you ran the function locally.

[!INCLUDE [functions-cleanup-resources-cli](../../includes/functions-cleanup-resources-cli.md)]

## Next steps

> [!div class="nextstepaction"]
> [Connect to Azure Queue Storage](functions-add-output-binding-storage-queue-cli.md)
