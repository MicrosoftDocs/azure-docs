---
title: Create stateful and stateless workflows with Visual Studio Code
description: Create stateful and stateless workflows by using Azure Logic Apps and Visual Studio Code
services: logic-apps
ms.suite: integration
ms.reviewer: vikanand, logicappspm
ms.topic: conceptual
ms.date: 09/10/2020
---

# Create stateful and stateless workflows by using Azure Logic Apps and Visual Studio Code - Public Preview

When you use Visual Studio Code and the preview extension, Azure Functions for Visual Studio Code, you can build stateful or stateless workflow apps that are powered by [Azure Functions](../azure-functions/functions-overview.md). You can test your workflow apps on your local computer and deploy to multiple hosting environments, such as Azure App Service, Azure function apps, or as Docker containers that can run anywhere that you want. The preview extension brings many Azure Logic Apps capabilities to your local development experience and provides additional capabilities, for example:

<a name="stateful-stateless"></a>

## What are stateful and stateless?

* *Stateful*

  Create stateful workflow apps when you need to keep, review, or reference data from previous events. These workflows save the input and output for each action in external storage, which makes run details and history review possible after each run finishes. Stateful workflows provide high resiliency if or when outages happen. After services and systems are restored, you can reconstruct interrupted workflow runs from the saved state and rerun the workflows to completion.

* *Stateless*

  Create stateless workflow apps when you don't need to keep, review, or reference data from previous events. These workflows save the input and output for each action only in memory, rather than in external storage. Stateless workflows provide faster performance with quicker response times, higher throughput, and reduced running costs because run details and history aren't kept. However, if or when outages happen, interrupted runs aren't automatically restored, so the caller needs to manually resubmit interrupted runs. For easier debugging, you can [enable run history](#enable-run-history) for stateless workflows.

  Currently, stateless workflows support only actions, not triggers, for [managed connectors](../connectors/apis-list.md#connector-types). For more information, see [Azure Triggers - GitHub Issue #136](https://github.com/Azure/logicapps/issues/136).

<a name="nested-workflow-behavior"></a>

### Nested workflow behavior

You can [make a workflow callable](../logic-apps/logic-apps-http-endpoint.md) by other workflows by using the [Request](../connectors/connectors-native-reqres.md) trigger, [HTTP Webhook](../connectors/connectors-native-webhook.md) trigger, or managed connector triggers that have the [ApiConnectionWehook type](../logic-apps/logic-apps-workflow-actions-triggers.md#apiconnectionwebhook-trigger) and can receive HTTPS requests.

Here are the behavior patterns that nested workflows can follow after a parent workflow calls a child workflow:

* Asynchronous polling pattern

  The parent doesn't wait for a response to their initial call, but continually checks the child's run history until the child finishes running. By default, stateful workflows follow this pattern, which is ideal for long-running child workflows that might exceed [request timeout limits](../logic-apps/logic-apps-limits-and-config.md).

* Synchronous pattern ("fire and forget")

  The child acknowledges the call by immediately returning a `202 ACCEPTED` response, and the parent continues to the next action without waiting for the results from the child. Instead, the parent receives the results when the child finishes running. Child stateful workflows that don't include a Response action always follow the synchronous pattern. For child stateful workflows, the run history is available for you to review.

  To enable this behavior, in the workflow's JSON definition, set the `OperationOptions` property to `DisableAsyncPattern`. For more information, see [Trigger and action types - Operation options](../logic-apps/logic-apps-workflow-actions-triggers.md#operation-options).

* Trigger and wait

  For a child stateless workflow, the parent waits for a response that returns the results from the child. This pattern works similar to using the built-in [HTTP trigger or action](../connectors/connectors-native-http.md) to call a child workflow. Child stateless workflows that don't include a Response action immediately return a `202 ACCEPTED` response, but the parent waits for the child to finish before continuing to the next action. These behaviors apply only to child stateless workflows.

This table specifies the child workflow's behavior based on whether the parent and child are stateful, stateless, or are mixed workflow types:

| Parent workflow | Child workflow | Child behavior |
|-----------------|----------------|----------------|
| Stateful | Stateful | Asynchronous or synchronous with `operationOptions=DisableSynPattern` setting |
| Stateful | Stateless | Trigger and wait |
| Stateless | Stateful | Synchronous |
| Stateless | Stateless | Trigger and wait |
||||

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Access to the internet so that you can download the requirements and sign in to your Azure account

* To follow along with the example workflow app that you create in this topic, you'll need an Office 365 Outlook email account where you sign in with a Microsoft work or school account.

  You can use a different [email service that's supported by Azure Logic Apps](/connectors/), such as Outlook.com or Gmail. If you use a different email service, the overall general steps are the same, but your user interface might differ slightly. For example, if you use Outlook.com, you'll use your personal Microsoft account to sign in.

  > [!IMPORTANT]
  > If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic apps. 
  > If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can 
  > [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). 
  > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

* [Visual Studio Code 1.25.1 or higher](https://code.visualstudio.com/), which is free, along with these tools for Visual Studio Code:

  * [C# for Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp), which enables F5 functionality to run your workflow

  * [Azure Functions Core Tools 3.0.2569 or higher](../azure-functions/functions-run-local.md). If you have an earlier installation, uninstall that version first, or make sure that the PATH environment variable points at the appropriate version specified here after you download and install the core tools:

    * [Win x64 (MSI)](https://functionscdn.azureedge.net/public/3.0.2569/func-cli-3.0.2569-x64.msi)

    * [Win x86 (MSI)](https://functionscdn.azureedge.net/public/3.0.2569/func-cli-3.0.2569-x86.msi)

  * [Azure Functions for Visual Studio Code 0.22.1-alpha (ZIP)](https://workflowscdn.azureedge.net/2020-05-preview/VsExtension/LogicAppsVSCodeExtension-0.22.1-alpha.zip)

    This public preview extension provides the capability for you to create stateless and stateful workflow apps and replaces any currently installed Azure Functions extension but preserves the capability to author Azure Functions. For other information about the Azure Functions extension for Visual Studio Code.

    1. Download the ZIP file to your local computer and extract file.

    1. In Visual Studio Code, on the left toolbar, select **Extensions**. From the **Extensions** menu, select the ellipses (**...**) button **>** **Install from VSIX**.

       ![Screenshot that shows Visual Studio extension menu with selected ellipses button and the "Install from VSIX menu command".](./media/create-stateless-stateful-workflows/install-from-vsix.png)

* Based on the operating system where you are running Visual Studio Code, set up the corresponding storage:

  **Mac OS**

  1. Sign in to the [Azure portal](https://portal.azure.com).
  
  1. [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal).

  1. [Find and copy the storage account's connection string](../storage/common/storage-account-keys-manage.md?tabs=azure-portal#view-account-access-keys), for example:

     `DefaultEndpointsProtocol=https;AccountName=fabrikamstorageaccount;AccountKey=<access-key>;EndpointSuffix=core.windows.net`

     ![Screenshot that shows Azure portal with storage account access keys and connection string copied.](./media/create-stateless-stateful-workflows/find-storage-account-connection-string.png)

  1. Save the string somewhere safe so that you can later add the string to the `local.settings.json` files in your function app project.

     When you later try to open the Logic App Designer for your workflow app in the function app project that you created, you get a message that the `Workflow design time could not be started`. After this message appears, you have to add the storage account's connection string to the two `local.settings.json` files in the function app project, and retry opening the designer again.

  **Windows or another OS**

  Download and install [Azure Storage Emulator 5.10](https://go.microsoft.com/fwlink/?LinkId=717179&clcid=0x409). To run the emulator, you also need to have a local SQL DB installation, such as the free [SQL Server 2019 Express Edition](https://go.microsoft.com/fwlink/?linkid=866658). For more information, see [Use the Azure Storage emulator for development and testing](../storage/common/storage-use-emulator.md).

  > [!IMPORTANT]
  > Before you create your workflow app, make sure that you first start the emulator. 
  > Otherwise, when you try to open your workflow app in the Logic App Designer, 
  > you get a message that the `Workflow design time could not be started`. For more 
  > information, see [Azure Storage Emulator Dependency - GitHub Issue #96](https://github.com/Azure/logicapps/issues/96).
  >
  > ![Screenshot that shows Azure Storage Emulator running.](./media/create-stateless-stateful-workflows/start-storage-emulator.png)

* Before you can connect to any services or systems in workflow apps that you build with Visual Studio Code, you have to first create these connections in the [Azure portal](https://portal.azure.com) by creating a logic app and using the Logic App Designer.

  > [!IMPORTANT]
  > For these connections, make sure that you create a logic app that uses the same Azure subscription and 
  > region as the workflow app that you plan to build in Visual Studio Code. After you create these connections, 
  > you can delete the logic app. Connections are Azure resources that exist separately from the logic app.

* To test the example workflow app that you create in this doc, you need a tool that can send calls to the Request trigger that starts the example workflow. If you don't have such a tool, you can download and install [Postman](https://www.postman.com/downloads/).

## Set up development environment

After you install all the extensions, disable automatic extension updates for Visual Studio Code so that the preview extension isn't overwritten by the public extension when you restart Visual Studio Code.

1. In Visual Studio Code, on the **File** menu, select **Preferences** **>** **Settings**.

1. Under **User**, expand **Features**, and select **Extensions**.

1. Under **Auto Update**, clear **When enabled, automatically installs updates for extensions. The updates are fetched from a Microsoft online service**.

   ![Screenshot that shows Visual Studio extension settings with cleared checkbox for auto update.](./media/create-stateless-stateful-workflows/disable-extension-auto-update.png)

1. To make sure that all the extensions are correctly installed, reload or restart Visual Studio Code.

1. Set Visual Studio Code to use Azure Functions Project Runtime version 3.

   1. On the **File** menu, select **Preferences** **>** **Settings**.

   1. Under **User**, expand **Extensions**, and select **Azure Functions**.

   1. Under **Azure Functions Project Runtime**, select **~3**.

      ![Screenshot that shows Visual Studio Code extension settings with Azure Functions Project Runtime set to "~3".](./media/create-stateless-stateful-workflows/azure-functions-project-runtime-version.png)

      For more information, see [Azure Functions runtime versions overview.](../azure-functions/functions-versions.md).

1. If you have a previous version of the extension bundle, clean up any existing bundle binaries in this location:

   `%TEMP%\Functions\ExtensionBundles\Microsoft.Azure.Functions.ExtensionBundle.Workflows*`

1. For deployment to Azure, check that you can browse for your app in the Azure portal by using the [preview URL](https://portal.azure.com/?websitesextension_workflowspreview=true).

## Connect to your Azure account

1. On the Visual Studio Code toolbar, select the Azure icon.

   ![Screenshot that shows Visual Studio Code toolbar and selected Azure icon.](./media/create-stateless-stateful-workflows/visual-studio-code-azure-icon.png)

1. In the Azure pane, under **Azure: Functions**, select **Sign in to Azure**. When the Microsoft sign-in page prompts you, sign in with your Azure account.

   ![Screenshot that shows Azure pane and selected link for Azure sign in.](./media/create-stateless-stateful-workflows/sign-in-azure-subscription.png)

   After you sign in, the Azure pane shows your account's Azure subscriptions. If the expected subscriptions don't appear, or you want to view only specific subscriptions, follow these steps:

   1. Move your pointer over the first subscription in the list so that the **Select subscriptions** filter icon appears. Select the filter icon.

      ![Screenshot that shows Azure pane and selected filter icon.](./media/create-stateless-stateful-workflows/filter-subscription-list.png)

   1. From the list that appears, select the subscriptions that you want to appear, and select **OK**.

   > [!TIP]
   > Later, if Visual Studio Code signs you out from Azure, you're prompted to sign back in when necessary.

## Create an Azure Functions project

Before you create your workflow, create a local Azure Functions project ([function app project](../azure-functions/functions-develop-vs-code.md#create-an-azure-functions-project)) for deploying and managing your workflow app using Visual Studio Code. This project is similar to the function app that you'd create in the Azure portal to use for organizing and managing functions. For more information, see [Develop Azure functions by using Visual Studio Code](../azure-functions/functions-develop-vs-code.md).

1. Before you start, make sure that you close any open folders or files in Visual Studio Code.

1. In the Azure pane, next to **Azure: Functions**, select **Create new project** (folder with lightning bolt icon).

   ![Screenshot that shows Azure pane toolbar with "Create new project" selected.](./media/create-stateless-stateful-workflows/create-new-project-folder.png)

1. Browse to the location where you want to save your project. Create a folder for your project, select that folder, and select **Select**.

   ![Screenshot that shows dialog box with "Create new project" selected.](./media/create-stateless-stateful-workflows/select-project-folder.png)

1. From the languages list that appears, select **C#** for this example.

   ![Screenshot that shows a languages list with C# selected.](./media/create-stateless-stateful-workflows/select-language-for-project.png)

1. From the templates list that appears, select **Skip for now** so that you can continue without having to create a function at this time. You'll create a function later.

   <!--
   ![Screenshot that shows a templates list with "Skip for now" selected.](./media/create-stateless-stateful-workflows/select-project-template.png)
   -->

1. From the locations list, select **Open in current window**.

   <!--
   ![Screenshot that shows locations list with "Open in current window" selected.](./media/create-stateless-stateful-workflows/select-project-location.png)
   -->

   After Visual Studio Code reloads, the Explorer pane opens and shows your local function app project.

   ![Screenshot that shows Explorer pane and function app project.](./media/create-stateless-stateful-workflows/function-app-project-created.png)

Now, continue creating your workflow app.

<a name="create-blank-workflow"></a>

## Create a blank workflow app

1. On the Visual Studio Code toolbar, select the Azure icon to reopen the Azure pane.

1. In the Azure pane, next to **Azure: Functions**, select **Create workflow**.

   ![Screenshot that shows Azure pane toolbar with "Create workflow" selected.](./media/create-stateless-stateful-workflows/create-function-app-project.png)

1. From the templates list that appears, select either **Stateful Workflow** or **Stateless Workflow**. Provide a name for your workflow app.

   This example selects **Stateful Workflow** and uses `example-workflow` as the name.

   ![Screenshot that shows a templates list with "Stateful Workflow" and "Stateless Workflow".](./media/create-stateless-stateful-workflows/select-stateful-stateless-workflow.png)

   In your project folder, Visual Studio Code adds a workflow app folder that has the specified name and a `workflow.json` file, which stores your workflow's JSON definition.

   ![Screenshot that shows Explorer window with project folder, workflow folder, and .json file.](./media/create-stateless-stateful-workflows/sample-workflow-folder.png)

1. From the `workflow.json` file's shortcut menu, select **Open in Designer**.

   ![Screenshot that shows Explorer pane and shortcut window for workflow.json file with Open in Designer selected.](./media/create-stateless-stateful-workflows/open-definition-file-in-designer.png)

   If Windows Defender Firewall prompts you to grant access for the `func.exe`, which is the Azure Functions Core Tools, select **Private networks, such as my home or work network** **>** **Allow access**.

   ![Screenshot that shows Windows Defender Firewall with "Private networks, such as my home or work network" selected and "Allow access" selected.](./media/create-stateless-stateful-workflows/windows-defender-firewall.png)

   If you get the error message that the `Workflow design time could not be started`, follow these steps based on the operating system that you use:

   **Mac OS**

   1. In your function app project, find and open the `local.settings.json` files, which are in your project's root folder and the `workflow-designtime` folder.

      ![Screenshot that shows Explorer pane and 'local.settings.json` files in your function app project.](./media/create-stateless-stateful-workflows/local-settings-json-files.png)

   1. In each file, find the `AzureWebJobsStorage` property, for example:

      ```json
      {
        "IsEncrypted": false,
        "Values": {
          "AzureWebJobsStorage": "UseDevelopmentStorage=true",
          "FUNCTIONS_WORKER_RUNTIME": "dotnet",
          "FUNCTIONS_EXTENSIONBUNDLE_SOURCE_URI": "https://workflowscdn.azureedge.net/2020-05-preview"
        }
      }
      ```

   1. Replace the `AzureWebJobsStorage` property value with the connection string that you saved earlier from your storage account, for example:

      ```json
      {
        "IsEncrypted": false,
        "Values": {
          "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=fabrikamstorageaccount;AccountKey=<access-key>;EndpointSuffix=core.windows.net",
          "FUNCTIONS_WORKER_RUNTIME": "dotnet",
          "FUNCTIONS_EXTENSIONBUNDLE_SOURCE_URI": "https://workflowscdn.azureedge.net/2020-05-preview"
        }
      }
      ```

   1. Save your changes, and try reopening the `workflow.json` file in the designer.

   **Windows or another OS**

   * Make sure that the Azure Storage Emulator is running. For more information, see 
   [Azure Storage Emulator Dependency - GitHub Issue #96](https://github.com/Azure/logicapps/issues/96).

   **Additional troubleshooting**

   * In Visual Studio Code, check the output from the Azure Functions extension.

     1. From the **View** menu, select **Output**.

     1. From the list on the **Output** title bar, select **Azure Functions** so that you can view the output for the Azure Functions extension.

        ![Screenshot that shows Visual Studio Code's Output window with "Azure Functions" selected.](./media/create-stateless-stateful-workflows/check-outout-window-azure-functions.png)

     1. Review the output and check whether this error message appears:

        ```text
        A host error has occurred during startup operation '<operation-ID>'.
        System.Private.CoreLib: The file 'C:\Users\<your-username>\AppData\Local\Temp\Functions\ExtensionBundles\Microsoft.Azure.Functions.ExtensionBundle.Workflows\1.1.1\bin\DurableTask.AzureStorage.dll' already exists.
        Value cannot be null. (Parameter 'provider')
        Application is shutting down...
        Initialization cancellation requested by runtime.
        Stopping host...
        Host shutdown completed.
        ```

        This error can happen if you previously tried to open the designer, and then discontinued or deleted your function app project. To resolve this error, delete the `ExtensionBundles` folder at this location `...\Users\<your-username>\AppData\Local\Temp\Functions\ExtensionBundles`, and retry opening the `workflow.json` file in the designer.

   * Try closing and reopening Visual Studio Code, and then your function app project. Retry opening the `workflow.json` file in the Logic App Designer.

1. From the **Enable connectors in Azure** list, select **Use connectors from Azure**, which applies to all managed connectors that are available in the Azure portal, not only connectors for Azure services.

   ![Screenshot that shows Explorer pane with "Enable connectors in Azure" list open and "Use connectors from Azure" selected.](./media/create-stateless-stateful-workflows/use-connectors-from-azure.png)

   > [!NOTE]
   > Currently, stateless workflows support only actions, not triggers, for managed connectors. For more information, see [Azure Triggers - GitHub Issue #136](https://github.com/Azure/logicapps/issues/136).

1. From the resource groups list, select **Create new resource group**.

   ![Screenshot that shows Explorer pane with resource groups list and "Create new resource group" selected](./media/create-stateless-stateful-workflows/create-select-resource-group.png)

1. From the locations list, select the Azure region to use for your resource group and resources. This example uses **West Central US**.

   ![Screenshot that shows Explorer pane with locations list and "West Central US" selected.](./media/create-stateless-stateful-workflows/select-azure-region.png)

   After you perform this step, Visual Studio Code opens the Logic App Designer.

   > [!NOTE]
   > When Visual Studio Code starts the workflow design-time API, a message appears that 
   > startup might take a few seconds. You can ignore this message or select **OK**.

   After the Logic App Designer appears, the **Choose an operation** prompt appears on the designer and is selected by default, which shows the **Add an action** pane.

   ![Screenshot that shows Logic App Designer.](./media/create-stateless-stateful-workflows/workflow-app-designer.png)

1. Next, [add a trigger and actions](#add-trigger-actions) to your workflow app.

<a name="add-trigger-actions"></a>

## Add a trigger and actions

After you open the Logic App Designer from your `workflow.json` file's shortcut menu, the **Choose an operation** prompt appears on the designer and is selected by default. You can now start creating your workflow app by adding a trigger and actions.

The workflow in this example uses this trigger and these actions:

* The built-in [Request trigger](../connectors/connectors-native-reqres.md), **When a HTTP request is received**, which receives inbound calls or requests and creates an endpoint that other services or logic apps can call

* The [Office 365 Outlook action](../connectors/connectors-create-api-office365-outlook.md), **Send an email**

  > [!IMPORTANT]
  > For connections that you want to use in workflow apps built with Visual Studio Code, you have 
  > to first create these connections by using the Logic App Designer in Azure portal. Make sure that 
  > you create these connections in a logic app that uses the same Azure subscription and region as 
  > the workflow app that you build in Visual Studio Code. After you create the connections, you can 
  > delete the logic app. Connections are Azure resources that exist separately from the logic app.

* The built-in Local Function Operations action, **Invoke a function in this function app**, which calls a function that you later create in your local function app project

* The built-in [Response action](../connectors/connectors-native-reqres.md), which you use to send a reply and return data back to the caller

1. Next to the designer, in the **Add an action** pane, under the **Choose an operation** search box, make sure that **Built-in** is selected. In the search box, enter `when a http request`, and select the built-in Request trigger that's named **When a HTTP request is received**.

   ![Screenshot that shows Logic App Designer and **Add an action** pane with "When a HTTP request is received" trigger selected.](./media/create-stateless-stateful-workflows/add-request-trigger.png)

   > [!TIP]
   > If you have to delete an item that you added to the designer, follow these steps:
   >
   > 1. On the Logic App Designer, select the item.
   >
   > 1. In the item's details pane that opens to the right side, select the ellises (**...**) button **>** **Delete**.
   > 
   >    ![Screenshot that shows selected item on designer with open details pane and with selected ellipses button and "Delete" option.](./media/create-stateless-stateful-workflows/delete-item-from-designer.png)

1. Under the trigger that now appears on the designer, select **New step**.

   The **Choose an operation** prompt appears on the designer, and the **Add an action pane** reopens so that you can select the next action.

1. On the **Add an action** pane, under the **Choose an operation** search box, select **Azure** so that you can find and select a managed connector.

   For this example, select the Office 365 Outlook action, **Send an email (V2)**.

   ![Screenshot that shows Logic App Designer and **Add an action** pane with Office 365 Outlook "Send an email" action selected.](./media/create-stateless-stateful-workflows/add-send-email-action.png)

1. On the designer, select the Office 365 Outlook action. When the **Send an email (V2)** pane appears, select **Sign in** so that you can create a connection to your email account.

   ![Screenshot that shows Logic App Designer and **Send an email (V2)** pane with "Sign in" selected.](./media/create-stateless-stateful-workflows/send-email-action-sign-in.png)

1. Follow the prompts to permit access from Visual Studio Code and the extension to your email account and finish signing in.

   ![Screenshot that shows Visual Studio Code prompt to open authentication website to sign in.](./media/create-stateless-stateful-workflows/visual-studio-code-open-external-website.png)

   > [!TIP]
   > To prevent this prompt from appearing again, select **Configure Trusted Domains** 
   > so that you can add the authentication page as a trusted domain.

   ![Screenshot that shows Visual Studio Code prompt to open Azure Functions extension.](./media/create-stateless-stateful-workflows/allow-extension-azure-functions.png)

   > [!TIP]
   > To prevent this prompt from appearing again, select **Don't ask again for this extension**.

1. On the **Parameters** tab, provide the required information for the email action, for example:

   ![Screenshot that shows Logic App Designer with details for Office 365 Outlook "Send an email" action.](./media/create-stateless-stateful-workflows/send-email-action-details.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **To** | Yes | <*your-email-address*> | The email recipient, which can be your email address for test purposes. This example uses the fictitious email, `sophiaowen@fabrikam.com`. |
   | **Subject** | Yes | `An email from your workflow app` | The email subject |
   | **Body** | Yes | `Hello from your example workflow app!` | The email body content |
   ||||

1. On the designer, select **Save**.

1. Continue by following one of these paths:

   * [Debug and test your workflow app on your local computer](#debug-test-workflow-locally).

   * Create an Azure function that you can directly call from your workflow app.

<a name="create-call-azure-function"></a>

## Create and call an Azure function

To add your own code that you can directly call and run from your workflow app, add an Azure function to your project. For more information, see [Add a function to your project](../azure-functions/functions-develop-vs-code.md#add-a-function-to-your-project).

### Create the Azure function

1. On the Visual Studio Code toolbar, select the Azure icon to reopen the Azure pane.

1. In the Azure pane, next to **Azure: Functions**, select **Create Function** (lightning icon).

   ![Screenshot that shows Azure pane with "Create Function" selected.](./media/create-stateless-stateful-workflows/select-create-function.png)

1. From the templates list, select **Workflow Action Trigger**, which currently supports only C#. For more information, see [Workflow Action Trigger Function Template - GitHub Issue #92](https://github.com/Azure/logicapps/issues/92).

   ![Screenshot that shows templates list with "Workflow Action Trigger" selected.](./media/create-stateless-stateful-workflows/select-function-template.png)

1. Provide a name for the function, for example, `MyExampleFunction`.

1. Provide a namespace for the function, for example, `MyExampleFunctionNamespace`.

   Visual Studio Code opens a `MyExampleFunction.cs` file, which is a new C# class library (.cs) file that is now included in your function app project. Currently, this .cs file contains sample code that you replace with your own code.

   ![Screenshot that shows open "MyExampleFunction.cs" file open.](./media/create-stateless-stateful-workflows/myexamplefunction-csharp-code-file.png)

1. Save your function's class library file.

### Call the function from the workflow app

1. Return to the Logic App Designer and your workflow app.

1. Under the **Send an email** action, select **New step**.

   The **Choose an operation** prompt appears on the designer, and the **Add an action pane** reopens so that you can select the next action.

1. On the **Add an action** pane, under the **Choose an action** search box, make sure that **Built-in** is selected. In the search box, enter `local function operations`. Select the Local Function Operations action, **Invoke a function in this function app**.

   ![Screenshot that shows Logic App Designer with Local Function Operations "Invoke a function in this function app" action selected.](./media/create-stateless-stateful-workflows/add-local-function-operations.png)

1. On the designer, select the **Invoke a function in this function app** action so that the action's details pane appears.

1. On the **Parameters** tab, provide the required information for the function that you want to call, for example:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Function Name** | Yes | `<function-name>` | The name for your previously created function. This example specifies the previously created function, `MyExampleFunction`. |
   ||||

   ![Screenshot that shows Logic App Designer with the "Invoke a function in this function app" action's details pane open and the "Function Name" property set to the function name.](./media/create-stateless-stateful-workflows/invoke-function-details.png)

1. When you're done, on the designer, select **Save**.

<a name="return-response"></a>

## Return a response to the caller

To send a reply and return data back to the caller of your workflow app, add the built-in [Response action](../connectors/connectors-native-reqres.md).

1. On the Logic App Designer, under the **Send an email** action, select **New step**.

   The **Choose an operation** prompt appears on the designer, and the **Add an action pane** reopens so that you can select the next action.

1. On the **Add an action** pane, under the **Choose an action** search box, make sure that **Built-in** is selected. In the search box, enter `response`, and select the **Response** action.

   ![Screenshot that shows Logic App Designer with the Response action selected.](./media/create-stateless-stateful-workflows/add-response-action.png)

1. On the designer, select the **Response** action so that the action's details pane appears.

   ![Screenshot that shows Logic App Designer with the "Response" action's details pane open and the "Body" property set to the "Invoke a function in this function app" action's "Body" property value.](./media/create-stateless-stateful-workflows/response-action-details.png)

1. On the **Parameters** tab, provide the required information for the function that you want to call.

   This example returns the **Body** property value that's output from the **Invoke a function in this function app** action.

   1. Click inside the **Body** property box so that the dynamic content list appears and shows the available output values from the preceding trigger and actions in the workflow.

      ![Screenshot that shows the "Response" action's details pane with the mouse pointer inside the "Body" property so that the dynamic content list appears.](./media/create-stateless-stateful-workflows/open-dynamic-content-list.png)

   1. In the dynamic content list, under **Invoke a function in this function app**, select **Body**.

      ![Screenshot that shows the open dynamic content list. In the list, under "Invoke a function in this function app" header, the "Body" output value is selected.](./media/create-stateless-stateful-workflows/select-function-action-body-output-value.png)

      When you're done, the Response action's **Body** property is now set to the **Invoke a function in this function app** action's **Body** output value.

      ![Screenshot that shows the "Response" action's details pane with the "Body" property set to the "Invoke a function in this function app" action's "Body" output value.](./media/create-stateless-stateful-workflows/response-action-details-body-property.png)

1. On the designer, select **Save**.

<a name="debug-test-workflow-locally"></a>

## Debug and test your workflow

1. To help you more easily debug stateless workflows, you can [enable the run history capability on the workflow](#enable-run-history).

1. On the Visual Studio Code toolbar, on the **Run** menu, select **Start Debugging** (F5).

   The **Terminal** window opens so that you can monitor the debugging session.

1. After the debugging process completes, find the callback URL for the endpoint on the Request trigger.

   1. Open the `workflow.json` file's shortcut menu, and select **Overview**.

   1. Find the **Callback URL** value, which looks similar to this URL for the example Request trigger:

      `http://localhost:7071/api/<workflow-name>/triggers/manual/invoke?api-version=2020-05-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=<shared-access-signature>`

      ![Screenshot that shows your workflow's overview page with callback URL](./media/create-stateless-stateful-workflows/find-callback-url.png)

1. To test the callback URL by triggering the workflow, open [Postman](https://www.postman.com/downloads/) or your preferred tool for creating and sending requests.

   This example continues by using Postman. For more information, see [Postman Getting Started](https://learning.postman.com/docs/getting-started/introduction/).

   1. On the Postman toolbar, select **New**.

      ![Screenshot that shows Postman with New button selected](./media/create-stateless-stateful-workflows/postman-create-request.png)

   1. On the **Create New** pane, under **Building Blocks**, select **Request**.

   1. In the **Save Request** window, under **Request name**, provide a name for the request, for example, `Test workflow app trigger`.

   1. Under **Select a collection or folder to save to**, select **Create Collection**.

   1. Under **All Collections**, provide a name for the collection to create for organizing your requests, press Enter, and select **Save to <*collection-name*>**. This example uses `Logic Apps requests` as the collection name.

      Postman's request pane opens so that you can send a request to the callback URL for the Request trigger.

      ![Screenshot that shows Postman with the opened request pane](./media/create-stateless-stateful-workflows/postman-request-pane.png)

   1. Return to Visual Studio Code. from the workflow's overview page, copy the **Callback URL** property value.

   1. Return to Postman. On the request pane, next the method list, which currently shows **GET** as the default request method, paste the callback URL that you previously copied in the address box, and select **Send**.

      ![Screenshot that shows Postman and callback URL in the address box with Send button selected](./media/create-stateless-stateful-workflows/postman-test-call-back-url.png)

      The example workflow sends an email that appears similar to this example:

      ![Screenshot that shows Outlook email as described in the example](./media/create-stateless-stateful-workflows/workflow-app-result-email.png)

1. In Visual Studio Code, return to your workflow app's overview page.

   After the request that you sent triggers the workflow, the overview page shows the workflow's run history.

   ![Screenshot that shows your workflow's overview page with run history](./media/create-stateless-stateful-workflows/post-trigger-call.png)

1. To view the run history details, open the ellipses (**...**) list, and select **Show Run**.

   ![Screenshot that shows your workflow's run history row with ellipses and "Show Run" selected](./media/create-stateless-stateful-workflows/show-run-history.png)

   Visual Studio Code shows the run history details for each action.

1. To view the raw inputs and outputs for a trigger or action, expand the step that you want to inspect, and select **Show raw inputs** or **Show raw outputs**.

   ![Screenshot that shows your workflow's run history details with the "Send an email" action expanded](./media/create-stateless-stateful-workflows/run-history-details.png)

1. To stop the debugging session, on the **Run** menu, select **Stop Debugging** (Shift + F5).

## Deploy to Docker container

By using the .NET Core command-line interface (CLI), you can build a Docker container for deploying your workflow app.

1. To build your project, open a command-line prompt, and run this command:

   `dotnet build -c release`

1. Publish your build by running this command:

   `dotnet publish`

1. Build a Docker container with a workflow by running this command:

   `docker build --tag local/workflowcontainer .`

   For example, here's a sample Docker file for a .NET workflow, but replace the <*storage-connection-string*> value with your connection string to Azure Storage:

   ```text
   FROM mcr.microsoft.com/azure-functions/dotnet:3.0.13614-appservice
   ENV AzureWebJobsStorage <storage-connection-string>
   ENV AzureWebJobsScriptRoot=/home/site/wwwroot \ AzureFunctionsJobHost__Logging__Console__IsEnabled=true
   COPY ./bin/Release/netcoreapp3.1/publish/ /home/site/wwwroot
   ```

1. Start the container by locally running this command:

   `docker run -p 8080:80 local/workflowcontainer`

1. To get the callback URL for the Request trigger, send this request:

   `POST /runtime/webhooks/flow/api/management/workflows/<workflow-name>/triggers/<trigger-name>/listCallbackUrl?api-version=2019-10-01-edge-preview&code={master-key}`

   The <*master-key*> value is defined in the storage account that you set for `AzureWebJobsStorage` in the file, `azure-webjobs-secrets/<deployment-name>/host.json`, where you can find the value in this section:

   ```json
   {
     <...>
     "masterKey": {
        "name": "master",
        "value": "<master-key>",
        "encrypted": false
     },
     <...>
   }
   ```

   For more information about the master key value, see [Using Docker Compose - GitHub Issue #84](https://github.com/Azure/azure-functions-docker/issues/84).

## Deploy to function app in Azure

You can publish your function app project directly to Azure from Visual Studio Code. This process either creates a function app and the related resources in your Azure subscription or deploys to an existing function app.

* If you publish to a new function app in Azure, you're offered both a quick creation path and an advanced creation path for your function app.

* If you publish to an existing function app in Azure, you overwrite the contents for that app in Azure. To enable the workflow app's run history when you deploy to a function app, follow these steps:

  1. In the [Azure portal](https://portal.azure.com), find and select your function app.

  1. On the function app's menu, under **API**, select **CORS**.

  1. On the **CORS** pane, under **Allowed Origins**, add the wildcard character (*).

     For more information, see [Run history of function apps - GitHub Issue #104](https://github.com/Azure/logicapps/issues/104).

<a name="enable-run-history"></a>

## Enable run history for stateless workflows

For easier debugging when you work with a stateless workflow, you can enable the run history capability for that workflow so that you can save and inspect the run in detail.

### For a stateless workflow running in Visual Studio Code

If you are working on and running the stateless workflow locally in Visual Studio Code, open the `local.settings.json` file, add the `operationOptions` property, and set the property value to `WithStatelessRunHistory`, for example:

In your workflow app's JSON definition (`workflow.json`) file, you can change the trigger's default behavior by adding the [**`operationOptions`** property](../logic-apps/logic-apps-workflow-actions-triggers.md#operation-options) to the [trigger's JSON definition](../logic-apps/logic-apps-workflow-actions-triggers.md#triggers-overview).

```json
"triggers": {
   "manual": {
      "kind": "Http",
      "type": "Request",
      "inputs": {
         "schema": {},
      },
      "operationOptions": "WithStatelessRunHistory"
   }
},
```

### For a stateless workflow running in the Azure portal

If you've deployed the function app project for your workflow to the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com), find and open your function app.

1. On the function app menu, under **Settings**, select **Configuration**.

1. Under **Application Settings**, select **New application setting**.

1. On the **Add/Edit application setting** pane, in the **Name** box, enter `Workflow.<your-workflow-name>.OperationOptions`.

1. In the **Value** box, enter `WithStatelessRunHistory`. When you're done, select **OK**.

## Next steps

For more information, bugs, questions, or suggestions about the preview extension, please [post them on the issues board in the GitHub repo for Logic Apps Preview](https://github.com/Azure/logicapps/issues) by using the `preview` label plus these labels as appropriate: `bug`, `question`, or `enhancement`
