---
title: Create a Java function from the command line - Azure Functions
description: Learn how to create a Java function from the command line, then publish the local project to serverless hosting in Azure Functions.
ms.date: 11/03/2020
ms.topic: quickstart
ms.custom: [devx-track-java]
ROBOTS: NOINDEX,NOFOLLOW
---

# Quickstart: Create a Java function in Azure from the command line

> [!div class="op_single_selector" title1="Select your function language: "]
> - [Java](create-first-function-cli-java.md)
> - [Python](create-first-function-cli-python.md)
> - [C#](create-first-function-cli-csharp.md)
> - [JavaScript](create-first-function-cli-node.md)
> - [PowerShell](create-first-function-cli-powershell.md)
> - [TypeScript](create-first-function-cli-typescript.md)

Use command-line tools to create a Java function that responds to HTTP requests. Test the code locally, then deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your <abbr title="The profile that maintains billing information for Azure usage.">Azure account</abbr>.

If Maven is not your preferred development tool, check out our similar tutorials for Java developers using [Gradle](./functions-create-first-java-gradle.md), [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/quickstart-functions) and [Visual Studio Code](create-first-function-vs-code-java.md).

## 1. Prepare your environment

Before you begin, you must have the following:

+ An Azure account with an active <abbr title="The basic organizational structure in which you manage resources in Azure, typically associated with an individual or department within an organization.">subscription</abbr>. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.

+ The [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

+ The [Java Developer Kit](/azure/developer/java/fundamentals/java-jdk-long-term-support), version 8 or 11. The `JAVA_HOME` environment variable must be set to the install location of the correct version of the JDK.

+ [Apache Maven](https://maven.apache.org), version 3.0 or above.

### Prerequisite check

+ In a terminal or command window, run `func --version` to check that the <abbr title="The set of command line tools for working with Azure Functions on your local computer.">Azure Functions Core Tools</abbr> are version 3.x.

+ Run `az --version` to check that the Azure CLI version is 2.4 or later.

+ Run `az login` to sign in to Azure and verify an active subscription.

<br>
<hr/>

## 2. Create a local function project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific <abbr title="The type of event that invokes the function’s code, such as an HTTP request, a queue message, or a specific time.">trigger</abbr>. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

1. In an empty folder, run the following command to generate the Functions project from a [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html). 

    # [Bash](#tab/bash)

    ```bash
    mvn archetype:generate -DarchetypeGroupId=com.microsoft.azure -DarchetypeArtifactId=azure-functions-archetype -DjavaVersion=8
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=8" 
    ```

    # [Cmd](#tab/cmd)

    ```cmd
    mvn archetype:generate "-DarchetypeGroupId=com.microsoft.azure" "-DarchetypeArtifactId=azure-functions-archetype" "-DjavaVersion=8"
    ```

    ---

    <br/>
    <details>
    <summary><strong>To run functions on Java 11</strong></summary>

    Use `-DjavaVersion=11` if you want your functions to run on Java 11. To learn more, see [Java versions](functions-reference-java.md#java-versions).
    </details>

1. Maven asks you for values needed to finish generating the project on deployment.
    Provide the following values when prompted:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | **groupId** | `com.fabrikam` | A value that uniquely identifies your project across all projects, following the [package naming rules](https://docs.oracle.com/javase/specs/jls/se6/html/packages.html#7.7) for Java. |
    | **artifactId** | `fabrikam-functions` | A value that is the name of the jar, without a version number. |
    | **version** | `1.0-SNAPSHOT` | Choose the default value. |
    | **package** | `com.fabrikam` | A value that is the Java package for the generated function code. Use the default. |

1. Type `Y` or press Enter to confirm.

    Maven creates the project files in a new folder with a name of _artifactId_, which in this example is `fabrikam-functions`. 

1. Navigate into the project folder:

    ```console
    cd fabrikam-functions
    ```

<br/>
<details>
<summary><strong>What's created in the LocalFunctionProj folder?</strong></summary>

This folder contains various files for the project, such as *Function.java*, *FunctionTest.java*, and *pom.xml*. There are also configurations files named
[local.settings.json](functions-run-local.md#local-settings-file) and
[host.json](functions-host-json.md). Because *local.settings.json* can contain secrets
downloaded from Azure, the file is excluded from source control by default in the *.gitignore*
file.
</details>

<br/>
<details>
<summary><strong>Code for Function.java</strong></summary>

*Function.java* contains a `run` method that receives request data in the `request` variable is an [HttpRequestMessage](/java/api/com.microsoft.azure.functions.httprequestmessage) that's decorated with the [HttpTrigger](/java/api/com.microsoft.azure.functions.annotation.httptrigger) annotation, which defines the trigger behavior. 

:::code language="java" source="~/azure-functions-samples-java/src/main/java/com/functions/Function.java":::

The response message is generated by the [HttpResponseMessage.Builder](/java/api/com.microsoft.azure.functions.httpresponsemessage.builder) API.

The archetype also generates a unit test for your function. When you change your function to add bindings or add new functions to the project, you'll also need to modify the tests in the *FunctionTest.java* file.
</details>

<br/>
<details>
<summary><strong>Code for pom.xml</strong></summary>

Settings for the Azure resources created to host your app are defined in the **configuration** element of the plugin with a **groupId** of `com.microsoft.azure` in the generated *pom.xml* file. For example, the configuration element below instructs a Maven-based deployment to create a function app in the `java-functions-group` resource group in the `westus` <abbr title="A geographical reference to a specific Azure datacenter in which resources are allocated.">region</abbr>. The function app itself runs on Windows hosted in the `java-functions-app-service-plan` plan, which by default is a serverless Consumption plan.

:::code language="java" source="~/azure-functions-samples-java/pom.xml" range="62-107":::

You can change these settings to control how resources are created in Azure, such as by changing `runtime.os` from `windows` to `linux` before initial deployment. For a complete list of settings supported by the Maven plug-in, see the [configuration details](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Functions:-Configuration-Details).
</details>

<br>
<hr/>

## 3. Run the function locally

1. **Run your function** by starting the local Azure Functions runtime host from the *LocalFunctionProj* folder:

    ```console
    mvn clean package
    mvn azure-functions:run
    ```

    Toward the end of the output, the following lines should appear:

    <pre class="is-monospace is-size-small has-padding-medium has-background-tertiary has-text-tertiary-invert">
    ...

    Now listening on: http://0.0.0.0:7071
    Application started. Press Ctrl+C to shut down.

    Http Functions:

            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ...
    </pre>

    If HttpExample doesn't appear as shown above, you likely started the host from outside the root folder of the project. In that case, use <kbd>Ctrl+C</kbd> to stop the host, navigate to the project's root folder, and run the previous command again.

1. **Copy the URL** of your `HttpExample` function from this output to a browser and append the query string `?name=<YOUR_NAME>`, making the full URL like `http://localhost:7071/api/HttpExample?name=Functions`. The browser should display a message like `Hello Functions`:

    ![Result of the function run locally in the browser](./media/functions-create-first-azure-function-azure-cli/function-test-local-browser.png)

    The terminal in which you started your project also shows log output as you make requests.

1. When you're done, use <kbd>Ctrl+C</kbd> and choose <kbd>y</kbd> to stop the functions host.

<br>
<hr/>

## 4. Deploy the function project to Azure

A function app and related resources are created in Azure when you first deploy your functions project. Settings for the Azure resources created to host your app are defined in the *pom.xml* file. In this article, you'll accept the defaults.

<br/>
<details>
<summary><strong>To create a function app running on Linux</strong></summary>

To create a function app running on Linux instead of Windows, change the `runtime.os` element in the *pom.xml* file from `windows` to `linux`. Running Linux in a consumption plan is supported in [these regions](https://github.com/Azure/azure-functions-host/wiki/Linux-Consumption-Regions). You can't have apps that run on Linux and apps that run on Windows in the same resource group.
</details>

1. Before you can deploy, sign in to your Azure subscription using either Azure CLI or Azure PowerShell. 

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az login
    ```

    The [az login](/cli/azure/reference-index#az_login) command signs you into your Azure account.

    # [Azure PowerShell](#tab/azure-powershell) 
    ```azurepowershell
    Connect-AzAccount
    ```

    The [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet signs you into your Azure account.

    ---

1. Use the following command to deploy your project to a new function app.

    ```console
    mvn azure-functions:deploy
    ```

    The deployment packages the project files and deploys them to the new function app using [zip deployment](functions-deployment-technologies.md#zip-deploy). The code runs from the deployment package in Azure.

<br/>
<details>
<summary><strong>What's created in Azure?</strong></summary>

+ Resource group. Named as _java-functions-group_.
+ Storage account. Required by Functions. The name is generated randomly based on Storage account name requirements.
+ Hosting plan. Serverless hosting for your function app in the _westus_ region. The name is _java-functions-app-service-plan_.
+ Function app. A function app is the deployment and execution unit for your functions. The name is randomly generated based on your _artifactId_, appended with a randomly generated number.
</details>

<br>
<hr/>

## 5. Invoke the function on Azure

Because your function uses an HTTP trigger, you **invoke it by making an HTTP request to its URL** in the browser or with a tool like <abbr title="A command line tool for generating HTTP requests to a URL; see https://curl.se/">curl</abbr>.

# [Browser](#tab/browser)

Copy the complete **Invoke URL** shown in the output of the `publish` command into a browser address bar, appending the query parameter `&name=Functions`. The browser should display similar output as when you ran the function locally.

![The output of the function run on Azure in a browser](../../includes/media/functions-run-remote-azure-cli/function-test-cloud-browser.png)

# [curl](#tab/curl)

Run [`curl`](https://curl.haxx.se/) with the **Invoke URL**, appending the parameter `&name=Functions`. The output of the command should be the text, "Hello Functions."

![The output of the function run on Azure using curl](../../includes/media/functions-run-remote-azure-cli/function-test-cloud-curl.png)

---

[!INCLUDE [functions-streaming-logs-cli-qs](../../includes/functions-streaming-logs-cli-qs.md)]

<br>
<hr/>

## 6. Clean up resources

If you continue to the [next step](#next-steps) and add an Azure Storage <abbr title="In Azure Storage, a means to associate a function with a storage queue, so that it can create messages on the queue.">queue output binding</abbr>, keep all your resources in place as you'll build on what you've already done.

Otherwise, use the following command to delete the resource group and all its contained resources to avoid incurring further costs.

 # [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name java-functions-group
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name java-functions-group
```

---

<br>
<hr/>

## Next steps

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-java)
