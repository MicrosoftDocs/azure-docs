---
title: Create stateless and stateful workflows with Visual Studio Code
description: Create stateless and stateful workflows by using Azure Logic Apps and Visual Studio Code
services: logic-apps
ms.suite: integration
ms.reviewer: deli, logicappspm
ms.topic: conceptual
ms.date: 09/22/2020
---

# Create stateless and stateful workflows by using Azure Logic Apps and Visual Studio Code


## What is stateless?

* *Stateful*

  These workflows save the input and output for each action in external storage, which makes detailed review possible after each run finishes. Also, stateful workflows provide high resiliency if interruptions, such as outages, happen. After systems are restored, you can reconstruct a workflow run from the saved state and rerun the workflow to completion. Create stateful workflows when you need to preserve and reference data from previous events.

* *Stateless*

  These workflows only save the input and output for each action in memory, rather than in external storage. Stateless workflows offer faster performance with decreased response times, high throughput, and decreased running costs due to not persisting data. However, if interruptions, such as outages, happen, in-progress runs aren't automatically restored, so the caller needs to manually resubmit the interrupted runs. Create stateless workflows when you don't need to preserve or reference data from previous events.

  > [!TIP]
  > For easier debugging or if necessary, you can enable run history capability for stateless workflows.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Access to the internet so that you can sign in to your Azure subscription and the Azure portal

* Download and install these tools:

  * [Visual Studio Code version 1.25.1 or later](https://code.visualstudio.com/), which is free

  * Azure Functions Core Tools, which you can download and install from these locations:

    > [!NOTE]
    > If you previously installed the Azure Functions Core Tools, 
    > uninstall them first, or make sure that the PATH environment variable 
    > points at the appropriate version specified here.

    * [Azure Functions Core Tools 3.0.2569 Win x64 (MSI)](https://functionscdn.azureedge.net/public/3.0.2569/func-cli-3.0.2569-x64.msi)

    * [Azure Functions Core Tools 3.0.2569 Win x86 (MSI)](https://functionscdn.azureedge.net/public/3.0.2569/func-cli-3.0.2569-x86.msi)

  * [C# for Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp), which enables F5 functionality to run your workflow

  * If you don't have the standalone Azure Storage Emulator, download and install the latest version. Before you can start, if you never used the emulator before, you need to initialize the emulator. You also need to have a local SQL DB, such as SQL Express, installed for the storage emulator to use. For more information, see [Use the Azure Storage emulator for development and testing](../storage/common/storage-use-emulator.md).

   Or, use [Azurite](https://github.com/Azure/Azurite/blob/master/README.md) instead?

## Set up environment

1. To install the preview extension, follow these steps:

   1. Download the preview [Azure Functions for Visual Studio Code extension 0.22.1-alpha (ZIP)](https://workflowscdn.azureedge.net/2020-05-preview/VsExtension/LogicAppsVSCodeExtension-0.22.1-alpha.zip) to your local computer, and extract the ZIP file.

      > [!NOTE]
      > This extension includes the capability for you to create stateless and stateful workflow apps with Azure Logic Apps 
      > and replaces any currently installed Azure Functions extension but preserves the capability to author Azure Functions.

   1. On the Visual Studio Code left toolbar, select **Extensions**. From the **Extensions** menu, select the ellipses (**...**) button > **Install from VSIX**.

      ![Screenshot that shows Visual Studio extension menu with selected ellipsis button and Install from VSIX menu command](./media/create-stateless-stateful-workflows/install-from-vsix.png)

1. Disable automatic updates for extensions in Visual Studio Code so that the preview extension isn't overwritten by the public extension when you restart Visual Studio Code.

   1. On the **File** menu, select **Preferences** > **Settings**.

   1. Under **User**, expand **Features**, and select **Extensions**.

   1. Under **Auto Update**, clear **When enabled, automatically installs updates for extensions. The updates are fetched from a Microsoft online service**.

      ![Screenshot that shows Visual Studio extension settings with cleared checkbox for auto update](./media/create-stateless-stateful-workflows/disable-extension-auto-update.png)

1. After you install all the requirements, reload Visual Studio Code so that the extensions are correctly installed. Or, you can close and reopen Visual Studio Code.

1. Set Visual Studio Code to use Azure Functions Project Runtime version 3.

   1. On the **File** menu, select **Preferences** > **Settings**.

   1. Under **User**, expand **Extensions**, and select **Azure Functions**.

   1. Under **Azure Functions Project Runtime**, select **~3**.

      ![Screenshot that shows Visual Studio Code extension settings with Azure Functions Project Runtime set to ~3](./media/create-stateless-stateful-workflows/azure-functions-project-runtime-version.png)

1. If you have a previous version of the extension bundle, clean up any existing bundle binaries in this location:

   `%TEMP%\Functions\ExtensionBundles\Microsoft.Azure.Functions.ExtensionBundle.Workflows*`

1. For deployment to Azure, check that you can browse for your app in the Azure portal by using the [preview URL](https://portal.azure.com/?websitesextension_workflowspreview=true).

## Connect to your Azure account

1. On the Visual Studio Code toolbar, select the Azure icon.

   ![Screenshot that shows Visual Studio Code toolbar and selected Azure icon](./media/create-stateless-stateful-workflows/visual-studio-code-azure-icon.png)

1. In the Azure pane, under **Azure: Functions**, select **Sign in to Azure**. When the Microsoft sign-in page prompts you, sign in with your Azure account.

   ![Screenshot that shows Azure pane and selected link for Azure sign in](./media/create-stateless-stateful-workflows/sign-in-azure-subscription.png)

   After you sign in, the Azure pane shows the Azure subscriptions that are associated with your account.

   If the Azure pane doesn't show the subscriptions that you expect don't appear, or you want to view only specific subscriptions, follow these steps:

   1. Move your pointer over the first subscription in the list so that the **Select subscriptions** filter icon appears. Select the filter icon.

      ![Screenshot that shows Azure pane and selected filter icon](./media/create-stateless-stateful-workflows/filter-subscription-list.png)

   1. From the list that appears, select the subscriptions that you want to appear, and then select **OK**.

## Create workflow app project

1. Before you start, make sure that you close any open folders or files in Visual Studio Code.

1. In the Azure pane, next to **Azure: Functions**, select **Create new project**.

   ![Screenshot that shows Azure pane toolbar with "Create new project" selected](./media/create-stateless-stateful-workflows/create-new-project-folder.png)

1. Browse to the location where you want to save your project. Create a folder for your project, select that folder, and then select **Select**.

   ![Screenshot that shows dialog box with "Create new project" selected](./media/create-stateless-stateful-workflows/select-project-folder.png)

1. From the languages list that appears, select **C#**.

   ![Screenshot that shows a languages list with C# selected](./media/create-stateless-stateful-workflows/select-language-for-project.png)

1. From the templates list that appears, select **Skip for now**.

   ![Screenshot that shows a templates list with "Skip for now" selected](./media/create-stateless-stateful-workflows/select-project-template.png)

1. From the locations list, select **Open in current window**.

   ![Screenshot that shows locations list with "Open in current window" selected](./media/create-stateless-stateful-workflows/select-project-location.png)

   After Visual Studio Code reloads, the Explorer pane opens and shows your new workflow app project.

   ![Screenshot that shows Explorer pane and workflow app project](./media/create-stateless-stateful-workflows/workflow-app-project-created.png)

   If a prompt to restore unresolved dependencies appears, ignore that prompt for now.

1. On the Visual Studio Code toolbar, select the Azure icon to reopen the Azure pane.

1. In the Azure pane, next to **Azure: Functions**, select **Create workflow**.

   ![Screenshot that shows Azure pane toolbar with "Create workflow" selected](./media/create-stateless-stateful-workflows/create-workflow-app-project.png)

1. From the templates list that appears, select **Stateful Workflow**.

   ![Screenshot that shows a templates list with "Stateful Workflow" selected](./media/create-stateless-stateful-workflows/select-stateful-workflow.png)

## Test your workflow app


## Deploy to Docker container

1. Build your project by running this command:

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

1. To get the callback URL for the Request triggers, send this request:

   `POST /runtime/webhooks/flow/api/management/workflows/<workflow-name>/triggers/<trigger-name>/listCallbackUrl?api-version=2019-10-01-edge-preview&code={master-key}`

   The <*master-key*> value is defined in the storage account that you set for `AzureWebJobsStorage` in the file, "azure-webjobs-secrets/{deployment-name}/host.json", where you can find the value in this section:

   ```json
   {
     <...>
     "masterKey": {
        "name": "master",
        "value": "{master-key}",
        "encrypted": false
     },
     <...>
   }
   ```

   For more information about the master key value, see [Using Docker Compose](https://github.com/Azure/azure-functions-docker/issues/84).

1. 
