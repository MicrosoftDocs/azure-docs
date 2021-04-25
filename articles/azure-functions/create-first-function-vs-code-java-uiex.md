---
title: Create a Java function using Visual Studio Code - Azure Functions
description: Learn how to create a Java function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.  
ms.topic: quickstart
ms.date: 11/03/2020
ROBOTS: NOINDEX,NOFOLLOW
---

# Quickstart: Create a Java function in Azure using Visual Studio Code

[!INCLUDE [functions-language-selector-quickstart-vs-code](../../includes/functions-language-selector-quickstart-vs-code.md)]

Use Visual Studio Code to create a Java function that responds to HTTP requests. Test the code locally, then deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your <abbr title="The profile that maintains billing information for Azure usage.">Azure account</abbr>.

If Visual Studio Code isn't your preferred development tool, check out our similar tutorials for Java developers using [Maven](create-first-function-cli-java.md), [Gradle](./functions-create-first-java-gradle.md) and [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/quickstart-functions).

## 1. Prepare your environment

Before you get started, make sure you have the following requirements in place:

+ An Azure account with an active <abbr title="The basic organizational structure in which you manage resources in Azure, typically associated with an individual or department within an organization.">subscription</abbr>. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Java Developer Kit](/azure/developer/java/fundamentals/java-jdk-long-term-support), version 8 or 11.

+ [Apache Maven](https://maven.apache.org), version 3.0 or above.

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Java extension pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)  

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

<br/>
<hr/>

## 2. <a name="create-an-azure-functions-project"></a>Create your local Functions project

1. Choose the Azure icon in the **Activity bar**, then in the **Azure: Functions** area, select the **Create new project...** icon.

    ![Choose Create a new project](./media/functions-create-first-function-vs-code/create-new-project.png)

1. **Choose a directory location** for your project workspace then choose **Select**.

1. Provide the following information at the prompts:

    + **Select a language for your function project**: Choose `Java`.

    + **Select a version of Java**: Choose `Java 8` or `Java 11`, the Java version on which your functions run in Azure. Choose a Java version that you've verified locally.

    + **Provide a group ID**: Choose `com.function`.

    + **Provide an artifact ID**: Choose `myFunction`.

    + **Provide a version**: Choose `1.0-SNAPSHOT`.

    + **Provide a package name**: Choose `com.function`.

    + **Provide an app name**: Choose `myFunction-12345`.

    + **Authorization level**: Choose `Anonymous`, which enables anyone to call your function endpoint.

    + **Select how you would like to open your project**: Choose `Add to workspace`.

<br/>

<details>
<summary><strong>Can't create a function project?</strong></summary>

The most common issues to resolve when creating a local Functions project are:
* You do not have the Azure Functions extension installed. 
</details>

<br/>
<hr/>

## 3. Run the function locally

1. Press <kbd>F5</kbd> to start the function app project.

1. In the **Terminal**, see the URL endpoint of your function running locally.

    ![Local function VS Code output](media/functions-create-first-function-vs-code/functions-vscode-f5.png)

1. With Core Tools running, go to the **Azure: Functions** area. Under **Functions**, expand **Local Project** > **Functions**. Right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="../../includes/media/functions-run-function-test-local-vs-code/execute-function-now.png" alt-text="Execute function now from Visual Studio Code":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press <kbd>Enter</kbd> to send this request message to your function.  

1. When the function executes locally and returns a response, a notification is raised in Visual Studio Code. Information about the function execution is shown in **Terminal** panel.

1. Press <kbd>Ctrl + C</kbd> to stop Core Tools and disconnect the debugger.

<br/>

<details>
<summary><strong>Can't run the function locally?</strong></summary>

The most common issues to resolve when running a local Functions project are:
* You do not have the Core Tools installed. 
*  If you have trouble running on Windows, make sure that the default terminal shell for Visual Studio Code isn't set to WSL Bash. 
</details>

<br/>
<hr/>

## 4. Sign in to Azure

To publish your app, sign in to Azure. If you're already signed in, go to the next section.

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure...**.

    ![Sign in to Azure within VS Code](../../includes/media/functions-sign-in-vs-code/functions-sign-into-azure.png)

1. When prompted in the browser, **choose your Azure account** and **sign in** using your Azure account credentials.

1. After you've successfully signed in, close the new browser window and go back to Visual Studio Code.

<br/>
<hr/>

## 5. Publish the project to Azure

Your first deployment of your code includes creating a Function resource in your Azure subscription.

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app...** button.

    ![Publish your project to Azure](../../includes/media/functions-publish-project-vscode/function-app-publish-project.png)

1. Provide the following information at the prompts:

    + **Select folder**: Choose the folder that contains your function app. 

    + **Select subscription**: Choose the subscription to use. You won't see this if you only have one subscription.

    + **Select Function App in Azure**: Choose `Create new Function App`.

    + **Enter a globally unique name for the function app**: Type a name that is unique across Azure in a URL path. The name you type is validated to ensure global uniqueness.

    - **Select a location for new resources**:  For better performance, choose a [region](https://azure.microsoft.com/regions/) near you.

1. A notification is displayed after your function app is created and the deployment package is applied. Select **View Output** to see the creation and deployment results.

    ![Create complete notification](../../includes/media/functions-publish-project-vscode/function-create-notifications.png)

<br/>

<details>
<summary><strong>Can't publish the function?</strong></summary>

This section created the Azure resources and deployed your local code to the Function app. If that didn't succeed:

* Review the Output for error information. The bell icon in the lower right corner is another way to view the output. 
* Did you publish to an existing function app? That action overwrites the content of that app in Azure.
</details>

<br/>

<details>
<summary><strong>What resources were created?</strong></summary>

When completed, the following Azure resources are created in your subscription, using names based on your function app name:

* **Resource group**: A resource group is a logical container for related resources in the same region.
* **Azure Storage account**: A Storage resource maintains state and other information about your project.
* **Consumption plan**: A consumption plan defines the underlying host for your serverless function app.
* **Function app**: A function app provides the environment for executing your function code and group functions as a logical unit.
* **Application Insights**: Application Insights tracks usage of your serverless function.

</details>

<br/>
<hr/>

## 6. Run the function in Azure

1. Back in the **Azure: Functions** area in the side bar, expand your subscription, your new function app, and **Functions**. Right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="../../includes/media/functions-vs-code-run-remote/execute-function-now.png" alt-text="Execute function now in Azure from Visual Studio Code":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.  

1. When the function executes in Azure and returns a response, a notification is raised in Visual Studio Code.

<br/>
<hr/>

## 7. Clean up resources

If you don't plan to continue to the [next step](#next-steps), delete the function app and its resources to avoid incurring any further costs.

1. In Visual Studio Code, select the Azure icon in the Activity bar, then select the Functions area in the side bar.
1. Select the function app, then right-click and select **Delete Function app...**.

<br/>
<hr/>

## Next steps

Expand the function by adding an <abbr title="In Azure Storage, a means to associate a function with a storage queue, so that it can create messages on the queue.">output binding</abbr>. This binding writes the string from the HTTP request to a message in an Azure Queue Storage queue.

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-java)
