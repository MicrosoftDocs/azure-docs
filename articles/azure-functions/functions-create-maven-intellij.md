---
title: Create a Java function in Azure Functions using IntelliJ 
description: Learn how to use IntelliJ to create an HTTP-triggered Java function and then run it in a serverless environment in Azure.
author: karlerickson
ms.topic: quickstart
ms.date: 05/28/2024
ms.author: jialuogan
ms.devlang: java
ms.custom: mvc, devcenter, devx-track-java, devx-track-extended-java
---

# Create your first Java function in Azure using IntelliJ

This article shows you how to use Java and IntelliJ to create an Azure function.

Specifically, this article shows you:

- How to create an HTTP-triggered Java function in an IntelliJ IDEA project.
- Steps for testing and debugging the project in the integrated development environment (IDE) on your own computer.
- Instructions for deploying the function project to Azure Functions.

<!-- TODO ![Access a Hello World function from the command line with cURL](media/functions-create-java-maven/hello-azure.png) -->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An [Azure supported Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-support-on-azure), version 8, 11, 17 or 21. (Java 21 is currently only supported in preview on Linux only)
- An [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) Ultimate Edition or Community Edition installed
- [Maven 3.5.0+](https://maven.apache.org/download.cgi)
- Latest [Function Core Tools](https://github.com/Azure/azure-functions-core-tools)

## Install plugin and sign in

To install the Azure Toolkit for IntelliJ and then sign in, follow these steps:

1. In IntelliJ IDEA's **Settings/Preferences** dialog (Ctrl+Alt+S), select **Plugins**. Then, find the **Azure Toolkit for IntelliJ** in the **Marketplace** and select **Install**. After it's installed, select **Restart** to activate the plugin.

   :::image type="content" source="media/functions-create-first-java-intellij/marketplace.png" alt-text="Azure Toolkit for IntelliJ plugin in Marketplace." lightbox="media/functions-create-first-java-intellij/marketplace.png":::

2. To sign in to your Azure account, open the **Azure Explorer** sidebar, and then select the **Azure Sign In** icon in the bar on top (or from the IDEA menu, select **Tools > Azure > Azure Sign in**).

   :::image type="content" source="media/functions-create-first-java-intellij/intellij-azure-login.png" alt-text="The IntelliJ Azure Sign In command." lightbox="media/functions-create-first-java-intellij/intellij-azure-login.png":::

3. In the **Azure Sign In** window, select **OAuth 2.0**, and then select **Sign in**. For other sign-in options, see [Sign-in instructions for the Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/sign-in-instructions).

   :::image type="content" source="media/functions-create-first-java-intellij/intellij-azure-login-popup.png" alt-text="The Azure Sign In window with device login selected." lightbox="media/functions-create-first-java-intellij/intellij-azure-login-popup.png":::

4. In the browser, sign in with your account and then go back to IntelliJ. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, then select **Select**.

   :::image type="content" source="media/functions-create-first-java-intellij/intellij-azure-login-selectsubs.png" alt-text="The Select Subscriptions dialog box." lightbox="media/functions-create-first-java-intellij/intellij-azure-login-selectsubs.png":::

## Create your local project

To use Azure Toolkit for IntelliJ to create a local Azure Functions project, follow these steps:

1. Open IntelliJ IDEA's **Welcome** dialog, select **New Project** to open a new project wizard, then select **Azure Functions**.

   :::image type="content" source="media/functions-create-first-java-intellij/create-functions-project.png" alt-text="Create function project." lightbox="media/functions-create-first-java-intellij/create-functions-project.png":::

1. Select **Http Trigger**, then select **Next** and follow the wizard to go through all the configurations in the following pages. Confirm your project location, then select **Finish**. Intellj IDEA then opens your new project.

   :::image type="content" source="media/functions-create-first-java-intellij/create-functions-project-finish.png" alt-text="Create function project finish." lightbox="media/functions-create-first-java-intellij/create-functions-project-finish.png":::

## Run the project locally

To run the project locally, follow these steps:

> [!IMPORTANT]
> You must have the JAVA_HOME environment variable set correctly to the JDK directory that is used during code compiling using Maven. Make sure that the version of the JDK is at least as high as the `Java.version` setting.

1. Navigate to *src/main/java/org/example/functions/HttpTriggerFunction.java* to see the code generated. Beside line 24, you should see a green **Run** button. Select it and then select **Run 'Functions-azur...'**. You should see your function app running locally with a few logs.

   :::image type="content" source="media/functions-create-first-java-intellij/local-run-functions-project.png" alt-text="Local run project." lightbox="media/functions-create-first-java-intellij/local-run-functions-project.png":::

   :::image type="content" source="media/functions-create-first-java-intellij/local-run-functions-output.png" alt-text="Local run project output." lightbox="media/functions-create-first-java-intellij/local-run-functions-output.png":::

1. You can try the function by accessing the displayed endpoint from browser, such as `http://localhost:7071/api/HttpExample?name=Azure`.

   :::image type="content" source="media/functions-create-first-java-intellij/local-run-functions-test.png" alt-text="Local run function test result." lightbox="media/functions-create-first-java-intellij/local-run-functions-test.png":::

1. The log is also displayed in your IDEA. Stop the function app by selecting **Stop**.

   :::image type="content" source="media/functions-create-first-java-intellij/local-run-functions-log.png" alt-text="Local run function test log." lightbox="media/functions-create-first-java-intellij/local-run-functions-log.png":::

## Debug the project locally

To debug the project locally, follow these steps:

1. Select the **Debug** button in the toolbar. If you don't see the toolbar, enable it by choosing **View** > **Appearance** > **Toolbar**.

   :::image type="content" source="media/functions-create-first-java-intellij/local-debug-functions-button.png" alt-text="Local debug function app button." lightbox="media/functions-create-first-java-intellij/local-debug-functions-button.png":::

1. Select line 20 of the file *src/main/java/org/example/functions/HttpTriggerFunction.java* to add a breakpoint. Access the endpoint `http://localhost:7071/api/HttpTrigger-Java?name=Azure` again and you should find that the breakpoint is hit. You can then try more debug features like **Step**, **Watch**, and **Evaluation**. Stop the debug session by selecting **Stop**.

   :::image type="content" source="media/functions-create-first-java-intellij/local-debug-functions-break.png" alt-text="Local debug function app break." lightbox="media/functions-create-first-java-intellij/local-debug-functions-break.png":::

## Create the function app in Azure

Use the following steps create a function app and related resources in your Azure subscription:

1. In Azure Explorer in your IDEA, right-click **Function App** and then select **Create**.

1. Select **More Settings** and provide the following information at the prompts:

   | Prompt              | Selection                                                                                                   |
   |---------------------|-------------------------------------------------------------------------------------------------------------|
   | **Subscription**    | Choose the subscription to use.                                                                             |
   | **Resource Group**  | Choose the resource group for your function app.                                                            |
   | **Name**            | Specify the name for a new function app. Here you can accept the default value.                             |
   | **Platform**        | Select **Windows-Java 17** or another platform as appropriate.                                              |
   | **Region**          | For better performance, choose a [region](https://azure.microsoft.com/regions/) near you.                   |
   | **Hosting Options** | Choose the hosting options for your function app.                                                           |
   | **Plan**            | Choose the App Service plan pricing tier you want to use, or select **+** to create a new App Service plan. |

   > [!IMPORTANT]
   > To create your app in the Flex Consumption plan, select **Flex Consumption**. The [Flex Consumption plan](flex-consumption-plan.md) is currently in preview.

1. Select **OK**. A notification is displayed after your function app is created.

## Deploy your project to Azure

To deploy your project to Azure, follow these steps:

1. Select and expand the Azure icon in IntelliJ Project explorer, then select **Deploy to Azure -> Deploy to Azure Functions**.

   :::image type="content" source="media/functions-create-first-java-intellij/deploy-functions-to-azure.png" alt-text="Deploy project to Azure." lightbox="media/functions-create-first-java-intellij/deploy-functions-to-azure.png":::

1. You can select the function app from the previous section. To create a new one, select **+** on the **Function** line. Type in the function app name and choose the proper platform. Here, you can accept the default value. Select **OK** and the new function app you created is automatically selected. Select **Run** to deploy your functions.

   :::image type="content" source="media/functions-create-first-java-intellij/deploy-functions-create-app.png" alt-text="Create function app in Azure." lightbox="media/functions-create-first-java-intellij/deploy-functions-create-app.png":::

   :::image type="content" source="media/functions-create-first-java-intellij/deploy-functions-log.png" alt-text="Deploy function app to Azure log." lightbox="media/functions-create-first-java-intellij/deploy-functions-log.png":::

## Manage function apps from IDEA

To manage your function apps with **Azure Explorer** in your IDEA, follow these steps:

1. Select **Function App** to see all your function apps listed.

   :::image type="content" source="media/functions-create-first-java-intellij/explorer-view-functions.png" alt-text="View function apps in explorer." lightbox="media/functions-create-first-java-intellij/explorer-view-functions.png":::

1. Select one of your function apps, then right-click and select **Show Properties** to open the detail page.

   :::image type="content" source="media/functions-create-first-java-intellij/explorer-functions-show-properties.png" alt-text="Show function app properties." lightbox="media/functions-create-first-java-intellij/explorer-functions-show-properties.png":::

1. Right-click your **HttpTrigger-Java** function app, then select **Trigger Function in Browser**. You should see that the browser is opened with the trigger URL.

   :::image type="content" source="media/functions-create-first-java-intellij/explorer-trigger-functions.png" alt-text="Screenshot shows a browser with the U R L." lightbox="media/functions-create-first-java-intellij/explorer-trigger-functions.png":::

## Add more functions to the project

To add more functions to your project, follow these steps:

1. Right-click the package **org.example.functions** and select **New -> Azure Function Class**.

   :::image type="content" source="media/functions-create-first-java-intellij/add-functions-entry.png" alt-text="Add functions to the project entry." lightbox="media/functions-create-first-java-intellij/add-functions-entry.png":::

1. Fill in the class name **HttpTest** and select **HttpTrigger** in the create function class wizard, then select **OK** to create. In this way, you can create new functions as you want.

   :::image type="content" source="media/functions-create-first-java-intellij/add-functions-trigger.png" alt-text="Screenshot shows the Create Function Class dialog box." lightbox="media/functions-create-first-java-intellij/add-functions-trigger.png":::

   :::image type="content" source="media/functions-create-first-java-intellij/add-functions-output.png" alt-text="Add functions to the project output." lightbox="media/functions-create-first-java-intellij/add-functions-output.png":::

## Cleaning up functions

Select one of your function apps using **Azure Explorer** in your IDEA, then right-click and select **Delete**. This command might take several minutes to run. When it's done, the status refreshes in **Azure Explorer**.

:::image type="content" source="media/functions-create-first-java-intellij/delete-function.png" alt-text="Screenshot shows Delete selected from a context menu." lightbox="media/functions-create-first-java-intellij/delete-function.png":::

## Next steps

You've created a Java project with an HTTP triggered function, run it on your local machine, and deployed it to Azure. Now, extend your function by continuing to the following article:

> [!div class="nextstepaction"]
> [Adding an Azure Storage queue output binding](./functions-add-output-binding-storage-queue-java.md)
