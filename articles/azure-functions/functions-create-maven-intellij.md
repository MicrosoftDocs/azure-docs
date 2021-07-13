---
title: Create a Java function in Azure Functions using IntelliJ 
description: Learn how to use IntelliJ to create a simple HTTP-triggered Java function, which you then publish to run in a serverless environment in Azure.
author: yucwan
ms.topic: how-to
ms.date: 07/01/2018
ms.author: yucwan
ms.custom: mvc, devcenter, devx-track-java
---

# Create your first Java function in Azure using IntelliJ

This article shows you:
- How to create an HTTP-triggered Java function in an IntelliJ IDEA project.
- Steps for testing and debugging the project in the integrated development environment (IDE) on your own computer.
- Instructions for deploying the function project to Azure Functions

<!-- TODO ![Access a Hello World function from the command line with cURL](media/functions-create-java-maven/hello-azure.png) -->

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Set up your development environment

To create and publish Java functions to Azure using IntelliJ, install the following software:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
+ An [Azure supported Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-jdk-long-term-support) for Java 8
+ An [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) Ultimate Edition or Community Edition installed
+ [Maven 3.5.0+](https://maven.apache.org/download.cgi)
+ Latest [Function Core Tools](https://github.com/Azure/azure-functions-core-tools)


## Installation and sign in

1. In IntelliJ IDEA's Settings/Preferences dialog (Ctrl+Alt+S), select **Plugins**. Then, find the **Azure Toolkit for IntelliJ** in the **Marketplace** and click **Install**. After installed, click **Restart** to activate the plugin. 

    ![Azure Toolkit for IntelliJ plugin in Marketplace][marketplace]

2. To sign in to your Azure account, open sidebar **Azure Explorer**, and then click the **Azure Sign In** icon in the bar on top (or from IDEA menu **Tools/Azure/Azure Sign in**).
    ![The IntelliJ Azure Sign In command][intellij-azure-login]

3. In the **Azure Sign In** window, select **Device Login**, and then click **Sign in** ([other sign in options](/azure/developer/java/toolkit-for-intellij/sign-in-instructions)).

   ![The Azure Sign In window with device login selected][intellij-azure-popup]

4. Click **Copy&Open** in **Azure Device Login** dialog .

   ![The Azure Login Dialog window][intellij-azure-copycode]

5. In the browser, paste your device code (which has been copied when you click **Copy&Open** in last step) and then click **Next**.

   ![The device login browser][intellij-azure-link-ms-account]

6. In the **Select Subscriptions** dialog box, select the subscriptions that you want to use, and then click **Select**.

   ![The Select Subscriptions dialog box][intellij-azure-login-select-subs]
   
## Create your local project

In this section, you use Azure Toolkit for IntelliJ to create a local Azure Functions project. Later in this article, you'll publish your function code to Azure. 

1. Open IntelliJ Welcome dialog, select *Create New Project* to open a new Project wizard, select *Azure Functions*.

    ![Create function project](media/functions-create-first-java-intellij/create-functions-project.png)

1. Select *Http Trigger*, then click *Next* and follow the wizard to go through all the configurations in the following pages; confirm your project location then click *Finish*; Intellj IDEA will then open your new project.

    ![Create function project finish](media/functions-create-first-java-intellij/create-functions-project-finish.png)

## Run the project locally

1. Navigate to `src/main/java/org/example/functions/HttpTriggerFunction.java` to see the code generated. Beside the line *17*, you will notice that there is a green *Run* button, click it and select *Run 'azure-function-exam...'*, you will see that your function app is running locally with a few logs.

    ![Local run project](media/functions-create-first-java-intellij/local-run-functions-project.png)

    ![Local run project output](media/functions-create-first-java-intellij/local-run-functions-output.png)

1. You can try the function by accessing the printed endpoint from browser, like `http://localhost:7071/api/HttpTrigger-Java?name=Azure`.

    ![Local run function test result](media/functions-create-first-java-intellij/local-run-functions-test.png)

1. The log is also printed out in your IDEA, now, stop the function app by clicking the *stop* button.

    ![Local run function test log](media/functions-create-first-java-intellij/local-run-functions-log.png)

## Debug the project locally

1. To debug the function code in your project locally, select the *Debug* button in the toolbar. If you don't see the toolbar, enable it by choosing **View** > **Appearance** > **Toolbar**.

    ![Local debug function app button](media/functions-create-first-java-intellij/local-debug-functions-button.png)

1. Click on line *20* of the file `src/main/java/org/example/functions/HttpTriggerFunction.java` to add a breakpoint, access the endpoint `http://localhost:7071/api/HttpTrigger-Java?name=Azure` again , you will find the breakpoint is hit, you can try more debug features like *step*, *watch*, *evaluation*. Stop the debug session by click the stop button.

    ![Local debug function app break](media/functions-create-first-java-intellij/local-debug-functions-break.png)

## Deploy your project to Azure

1. Right click your project in IntelliJ Project explorer, select *Azure -> Deploy to Azure Functions*

    ![Deploy project to Azure](media/functions-create-first-java-intellij/deploy-functions-to-azure.png)

1. If you don't have any Function App yet, click *+* in the *Function* line. Type in the function app name and choose proper platform, here we can simply accept default. Click *OK* and the new function app you just created will be automatically selected. Click *Run* to deploy your functions.

    ![Create function app in Azure](media/functions-create-first-java-intellij/deploy-functions-create-app.png)

    ![Deploy function app to Azure log](media/functions-create-first-java-intellij/deploy-functions-log.png)

## Manage function apps from IDEA

1. You can manage your function apps with *Azure Explorer* in your IDEA, click on *Function App*, you will see all your function apps here.

    ![View function apps in explorer](media/functions-create-first-java-intellij/explorer-view-functions.png)

1. Click to select on one of your function apps, and right click, select *Show Properties* to open the detail page. 

    ![Show function app properties](media/functions-create-first-java-intellij/explorer-functions-show-properties.png)

1. Right click on your *HttpTrigger-Java* function app, and select *Trigger Function*, you will see that the browser is opened with the trigger URL.

    ![Screenshot shows a browser with the U R L.](media/functions-create-first-java-intellij/explorer-trigger-functions.png)

## Add more functions to the project

1. Right click on the package *org.example.functions* and select *New -> Azure Function Class*. 

    ![Add functions to the project entry](media/functions-create-first-java-intellij/add-functions-entry.png)

1. Fill in the class name *HttpTest* and select *HttpTrigger* in the create function class wizard, click *OK* to create, in this way, you can create new functions as you want.

    ![Screenshot shows the Create Function Class dialog box.](media/functions-create-first-java-intellij/add-functions-trigger.png)
    
    ![Add functions to the project output](media/functions-create-first-java-intellij/add-functions-output.png)

## Cleaning up functions

1. Deleting functions in Azure Explorer
      
      ![Screenshot shows Delete selected from a context menu.](media/functions-create-first-java-intellij/delete-function.png)
      

## Next steps

You've created a Java project with an HTTP triggered function, run it on your local machine, and deployed it to Azure. Now, extend your function by...

> [!div class="nextstepaction"]
> [Adding an Azure Storage queue output binding](./functions-add-output-binding-storage-queue-java.md)


[marketplace]:./media/functions-create-first-java-intellij/marketplace.png
[intellij-azure-login]: media/functions-create-first-java-intellij/intellij-azure-login.png
[intellij-azure-popup]: media/functions-create-first-java-intellij/intellij-azure-login-popup.png
[intellij-azure-copycode]: media/functions-create-first-java-intellij/intellij-azure-login-copyopen.png
[intellij-azure-link-ms-account]: media/functions-create-first-java-intellij/intellij-azure-login-linkms-account.png
[intellij-azure-login-select-subs]: media/functions-create-first-java-intellij/intellij-azure-login-selectsubs.png
