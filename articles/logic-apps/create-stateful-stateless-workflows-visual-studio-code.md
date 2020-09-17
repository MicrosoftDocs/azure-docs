---
title: Create automation workflows (preview) in Visual Studio Code
description: Create stateless or stateful automation workflows with the Azure Logic Apps (Preview) extension in Visual Studio Code to integrate apps, data, cloud services, and on-premises systems
services: logic-apps
ms.suite: integration
ms.reviewer: deli, vikanand, hongzili, sopai, absaafan, logicappspm
ms.topic: conceptual
ms.date: 09/22/2020
---

# Create stateful or stateless automation workflows in Visual Studio Code with the Azure Logic Apps (Preview) extension

> [!IMPORTANT]
> This capability is in public preview, is provided without a service level agreement, and 
> isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To create automation tasks that integrate across apps, data, cloud services, and systems, you use Visual Studio Code and the Azure Logic Apps (Preview) extension to build and run [*stateful* and *stateless* logic app workflows](#stateful-stateless). These logic app workflows are created with the new **Logic App (Preview)** resource type in Azure and are powered by the [Azure Functions](../azure-functions/functions-overview.md) runtime.

![Screenshot that shows Visual Studio Code and logic app workflow.](./media/create-stateful-stateless-workflows-visual-studio-code/visual-studio-code-logic-apps-overview.png)

This article provides a high-level overview about stateful and stateless logic app workflows, how to create these workflows by using the public preview extension, and how to publish or deploy these workflows directly from Visual Studio Code to Azure or a [Docker container that you can run anywhere](/dotnet/architecture/microservices/container-docker-introduction/docker-defined).

<a name="whats-new"></a>

## What's in this public preview?

This public preview extension brings many current and additional Logic Apps capabilities to your local development experience in Visual Studio Code, for example:

* Build integration and automation workflows from [300+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors.md) for Software-as-a-Service (SaaS) and Platform-as-a-Service (PaaS) apps and services plus connectors for on-premises systems.

  * Some managed connectors such as Azure Service Bus, Azure Event Hubs, and SQL Server run similarly to built-in native triggers and actions such as Azure Functions and Azure API Management.

  * Create and deploy workflows that can run anywhere because the Azure Logic Apps service generates Shared Access Signature (SAS) connection strings that these workflows can use for sending requests to the cloud connection runtime endpoint. Logic Apps saves these connection strings with other application settings so that you can easily store these values in Azure Key Vault when you deploy to Azure.

* Create stateless workflows that respond faster, have higher throughput, and cost less to run because the run histories and data between actions don't persist in external storage. Optionally, you can enable run history for easier debugging. For more information, see [Stateful versus stateless workflows](#stateful-stateless).

* Test your workflows locally in the Visual Studio Code development environment.

* Publish and deploy your workflows from Visual Studio Code directly to various hosting environments, such as [Azure App Service](../app-service/environment/intro.md) and Docker containers.

<a name="stateful-stateless"></a>

## Stateful versus stateless workflows

* *Stateful*

  Create stateful workflows when you need to keep, review, or reference data from previous events. These workflows save the input and output for each action in external storage, which makes run details and history review possible after each run finishes. Stateful workflows provide high resiliency if or when outages happen. After services and systems are restored, you can reconstruct interrupted workflow runs from the saved state and rerun the workflows to completion.

* *Stateless*

  Create stateless workflows when you don't need to keep, review, or reference data from previous events. These workflows save the input and output for each action only in memory, rather than in external storage. Stateless workflows provide faster performance with quicker response times, higher throughput, and reduced running costs because run details and history aren't kept. However, if or when outages happen, interrupted runs aren't automatically restored, so the caller needs to manually resubmit interrupted runs. For easier debugging, you can [enable run history](#run-history) for stateless workflows.

  > [!NOTE]
  > Stateless workflows currently support only actions and not triggers for [managed connectors](../connectors/apis-list.md#connector-types). 
  > For more information, see [Azure Triggers - GitHub Issue #136](https://github.com/Azure/logicapps/issues/136).

For information about how nested workflows behave differently between stateful and stateless workflows, see [Nested workflow behavior differences between stateful and stateless workflows](#nested-workflow-behavior).

## Prerequisites

### Access and connectivity

* Access to the internet so that you can download the requirements, connect from Visual Studio Code to your Azure account, and publish from Visual Studio Code to Azure, a Docker container, or other environment.

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* To build the same example workflow in this article, you need an Office 365 Outlook email account that uses a Microsoft work or school account to sign in.

  If you choose to use a different [email connector that's supported by Azure Logic Apps](/connectors/), such as Outlook.com or [Gmail](../connectors/connectors-google-data-security-privacy-policy.md), you can still follow the example, and the general overall steps are the same, but your user interface and options might differ in some ways. For example, if you use the Outlook.com connector, use your personal Microsoft account instead to sign in.

* Before you can sign in and connect to services and systems that require authentication from your workflow in Visual Studio Code, you have to first create these connections in a temporary logic app by using the [Azure portal](https://portal.azure.com). After you create these connections, you can delete the temporary logic app because connections are Azure resources that exist independently from the logic app.

  > [!IMPORTANT]
  > When you create the temporary logic app, make sure that you use the same Azure 
  > subscription and region as the workflow that you want to build in Visual Studio Code.

### Tools

* [Visual Studio Code 1.30.1 (January 2019) or higher](https://code.visualstudio.com/), which is free. Also, download and install these additional tools for Visual Studio Code, if you don't have them already:

  * [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account), which provides a single common Azure sign-in and subscription filtering experience for all other Azure extensions  in Visual Studio Code.

  * [C# for Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp), which enables F5 functionality to run your workflow.

  * [Azure Functions Core Tools 3.0.14492 or 2.0.14494](../azure-functions/functions-run-local.md#install-the-azure-functions-core-tools), which includes a version of the same runtime that powers the Azure Functions runtime that runs in Visual Studio Code.

    > [!IMPORTANT]
    > If you have an installation that's earlier than these versions, uninstall that version first, 
    > or make sure that the PATH environment variable points at the version that you download and install.
    >
    > If you want to use the [**Inline Code** action](../logic-apps/logic-apps-add-run-inline-code.md) 
    > for running JavaScript code, you need to use the Azure Functions runtime version 3x because the 
    > action doesn't support version 2x. Also, this action currently isn't supported on Linux operating systems.

  * [Azure Logic Apps (Preview) extension for Visual Studio Code 0.0.1](https://go.microsoft.com/fwlink/p/?linkid=2143167). This public preview extension provides the capability for you to create stateful and stateless workflows and to test them locally in Visual Studio Code.

    > [!IMPORTANT]
    > If you created workflows with the private preview extension, these workflows won't work with 
    > the public preview extension. However, you can migrate these workflows by uninstalling the 
    > private preview extension, performing the required cleanup, and installing the public preview 
    > extension. You can then create your new project in Visual Studio Code, and copy your previously 
    > created workflow's definition into your new project.
    >
    > So, before you install the public preview extension, make sure that you uninstall any earlier versions, and delete these artifacts:
    >
    > * The `Microsoft.Azure.Functions.ExtensionBundle.Workflows` folder, which contains previous extension bundles and is located along this path:
    >
    >   `C:\Users\<username>\AppData\Local\Temp\Functions\ExtensionBundles`
    >
    > * The `microsoft.azure.workflows.webjobs.extension` folder, which is the [NuGet](/nuget/what-is-nuget) cache for the private preview extension and is located along this path:
    >
    >   `C:\Users\<username>\.nuget\packages`

    To install the public preview extension, follow these steps:

    1. In Visual Studio Code, on the left toolbar, select **Extensions**.

    1. In the extensions search box, enter `azure logic apps preview`. From the results list, select **Azure Logic Apps (Preview)** **>** **Install**.

       After the installation completes, the public preview extension appears in the **Extensions: Installed** list.

       ![Screenshot that shows Visual Studio Code's installed extensions list with the "Azure Logic Apps (Preview)" extension underlined.](./media/create-stateful-stateless-workflows-visual-studio-code/azure-logic-apps-extension-installed.png)

* To test the example workflow that you create in this article, you need a tool that can send calls to the Request trigger, which is the first step in example workflow. If you don't have such a tool, you can download, install, and use [Postman](https://www.postman.com/downloads/).

### Storage requirements

Based on the operating system where you are running Visual Studio Code, set up the corresponding storage requirement.

#### **Mac OS**

1. Sign in to the [Azure portal](https://portal.azure.com), and [create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal), which is a [prerequisite for Azure Functions](../azure-functions/storage-considerations.md).

1. [Find and copy the storage account's connection string](../storage/common/storage-account-keys-manage.md?tabs=azure-portal#view-account-access-keys), for example:

   `DefaultEndpointsProtocol=https;AccountName=fabrikamstorageaccount;AccountKey=<access-key>;EndpointSuffix=core.windows.net`

   ![Screenshot that shows the Azure portal with storage account access keys and connection string copied.](./media/create-stateful-stateless-workflows-visual-studio-code/find-storage-account-connection-string.png)

1. Save the string somewhere safe so that you can later add the string to the `local.settings.json` files in the project that you use for creating your workflow in Visual Studio Code.

When you later try to open the Logic App Designer for your workflow, you get a message that the `Workflow design time could not be started`. After this message appears, you have to add the storage account's connection string to the two `local.settings.json` files in the project, and retry opening the designer again.

#### Windows or other OS

1. Download and install [Azure Storage Emulator 5.10](https://go.microsoft.com/fwlink/p/?linkid=717179).

1. To run the emulator, you need to have a local SQL DB installation, such as the free [SQL Server 2019 Express Edition](https://go.microsoft.com/fwlink/p/?linkid=866658). For more information, see [Use the Azure Storage emulator for development and testing](../storage/common/storage-use-emulator.md).

> [!IMPORTANT]
> Before you open the Logic App Designer to create your workflow, make sure that you start the emulator. 
> Otherwise, you get a message that the `Workflow design time could not be started`. For more information, 
> review [Azure Storage Emulator Dependency - GitHub Issue #96](https://github.com/Azure/logicapps/issues/96).
>
> ![Screenshot that shows the Azure Storage Emulator running.](./media/create-stateful-stateless-workflows-visual-studio-code/start-storage-emulator.png)

## Set up Visual Studio Code

1. To make sure that all the extensions are correctly installed, reload or restart Visual Studio Code.

1. Enable or check that Visual Studio Code automatically finds and installs extension updates so that your public preview extension gets the latest updates.

   To check this setting, follow these steps:

   1. On the **File** menu, go to **Preferences** **>** **Settings**.

   1. On the **User** tab, go to **Features** **>** **Extensions**.

   1. Confirm that **Auto Check Updates** and **Auto Update** are selected.

1. Enable or check that these **Azure Logic Apps (Preview)** extension settings are set up in Visual Studio Code:

   * **Azure Logic Apps V2: Panel Mode**
   * **Azure Logic Apps V2: Project Runtime**

   1. On the **File** menu, go to **Preferences** **>** **Settings**.

   1. On the **User** tab, go to **>** **Extensions** **>** **Azure Logic Apps (Preview)**.

   1. Under **Azure Logic Apps V2: Panel Mode**, confirm that **Enable panel mode** is selected. Under **Azure Logic Apps V2: Project Runtime**, set the version to **~3** or **~2**, based on the [Azure Functions Core Tools version](#prerequisites) that you installed earlier.

      > [!IMPORTANT]
      > If you want to use the [**Inline Code** action](../logic-apps/logic-apps-add-run-inline-code.md) 
      > for running JavaScript code, make sure that you use Project Runtime version 3 because the action 
      > doesn't support version 2. Also, this action currently isn't supported on Linux operating systems.

      ![Screenshot that shows Visual Studio Code settings for "Azure Logic Apps (Preview)" extension.](./media/create-stateful-stateless-workflows-visual-studio-code/azure-logic-apps-preview-settings.png)

<a name="connect-azure-account"></a>

## Connect to your Azure account

1. On the Visual Studio Code toolbar, select the Azure icon.

   ![Screenshot that shows Visual Studio Code toolbar and selected Azure icon.](./media/create-stateful-stateless-workflows-visual-studio-code/visual-studio-code-azure-icon.png)

1. In the Azure pane, under **Azure: Logic Apps (Preview)**, select **Sign in to Azure**. When the Visual Studio Code authentication page appears, sign in with your Azure account.

   ![Screenshot that shows Azure pane and selected link for Azure sign in.](./media/create-stateful-stateless-workflows-visual-studio-code/sign-in-azure-subscription.png)

   After you sign in, the Azure pane shows the subscriptions in your Azure account. If the expected subscriptions don't appear, or you want the pane to show only specific subscriptions, follow these steps:

   1. In the subscriptions list, move your pointer next to the first subscription until the **Select subscriptions** button (filter icon) appears. Select the filter icon.

      ![Screenshot that shows Azure pane and selected filter icon.](./media/create-stateful-stateless-workflows-visual-studio-code/filter-subscription-list.png)

      Or, in the Visual Studio Code status bar, select your Azure account. 

   1. When another subscriptions list appears, select the subscriptions that you want, and then make sure that you select **OK**.

> [!NOTE]
> For various reasons, Visual Studio Code signs you out from your Azure account. 
> When necessary, Visual Studio Code prompts you to sign back in, or you can manually sign back in.

<a name="create-project"></a>

## Create a local project

Before you can create your workflow, create a local project to use for managing and deploying your workflow in Visual Studio Code. The underlying project is very similar to an Azure Functions project, also known as a function app project.

1. On your computer, create a local folder to use for the project that you'll later create in Visual Studio Code.

1. In Visual Studio Code, close any and all open folders.

1. In the Azure pane, next to **Azure: Logic Apps (Preview)**, select **Create New Project** (icon that shows a folder and lightning bolt).

   ![Screenshot that shows Azure pane toolbar with "Create New Project" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/create-new-project-folder.png)

1. If Windows Defender Firewall prompts you to grant network access for `Code.exe`, which is Visual Studio Code, and for `func.exe`, which is the Azure Functions Core Tools, select **Private networks, such as my home or work network** **>** **Allow access**.

1. Browse to the location where you created your project folder, select that folder and continue.

   ![Screenshot that shows "Select Folder" dialog box with a newly created project folder and the "Select" button selected.](./media/create-stateful-stateless-workflows-visual-studio-code/select-project-folder.png)

1. From the templates list that appears, select either **Stateful Workflow** or **Stateless Workflow**. This example selects **Stateful Workflow**.

   ![Screenshot that shows the workflow templates list with "Stateful Workflow" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/select-stateful-stateless-workflow.png)

1. Provide a name for your workflow and press Enter. This example uses `example-workflow` as the name.

   ![Screenshot that shows the "Create a new Stateful Workflow (3/4)" box and "example-workflow" as the workflow name.](./media/create-stateful-stateless-workflows-visual-studio-code/name-your-workflow.png)

1. From the next list that appears, select **Open in current window**.

   ![Screenshot that shows list with "Open in current window" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/select-project-location.png)

   Visual Studio Code reloads, opens the Explorer pane, and shows your project, which now includes automatically generated project files. For example, the project has a folder that shows your workflow's name. Inside this folder, the `workflow.json` file contains your workflow's underlying JSON definition.

   ![Screenshot that shows the Explorer window with project folder, workflow folder, and "workflow.json" file.](./media/create-stateful-stateless-workflows-visual-studio-code/local-project-created.png)

Next, open the `workflow.json` file in the Logic App Designer.

### Open the workflow definition file in Logic App Designer

Before you try opening your workflow definition file in the designer, make sure that the Azure Storage Emulator is running. For more information, review the [Prerequisites](#prerequisites).

1. Expand the project folder for your workflow. Open the `workflow.json` file's shortcut menu, and select **Open in Designer**.

   ![Screenshot that shows Explorer pane and shortcut window for the workflow.json file with "Open in Designer" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/open-definition-file-in-designer.png)

   If you get the error message that the `Workflow design time could not be started`, follow these steps based on the operating system that you use:

   **Mac OS**

   1. In your project, find and open the `local.settings.json` files, which are in your project's root folder and the `workflow-designtime` folder.

      ![Screenshot that shows Explorer pane and 'local.settings.json` files in your project.](./media/create-stateful-stateless-workflows-visual-studio-code/local-settings-json-files.png)

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

   In Visual Studio Code, check the output from the preview extension.

   1. From the **View** menu, select **Output**.

   1. From the list on the **Output** title bar, select **Azure Logic Apps** so that you can view the output for the preview extension, for example:

      ![Screenshot that shows Visual Studio Code's Output window with "Azure Logic Apps" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/check-outout-window-azure-logic-apps.png)

   1. Review the output and check whether this error message appears:

      ```text
      A host error has occurred during startup operation '<operation-ID>'.
      System.Private.CoreLib: The file 'C:\Users\<your-username>\AppData\Local\Temp\Functions\
      ExtensionBundles\Microsoft.Azure.Functions.ExtensionBundle.Workflows\1.1.1\bin\
      DurableTask.AzureStorage.dll' already exists.
      Value cannot be null. (Parameter 'provider')
      Application is shutting down...
      Initialization cancellation requested by runtime.
      Stopping host...
      Host shutdown completed.
      ```

      This error can happen if you previously tried to open the designer, and then discontinued or deleted your project. To resolve this error, delete the `ExtensionBundles` folder at this location `...\Users\<your-username>\AppData\Local\Temp\Functions\ExtensionBundles`, and retry opening the `workflow.json` file in the designer.

1. From the **Enable connectors in Azure** list, select **Use connectors from Azure**, which applies to all managed connectors that are available in the Azure portal, not only connectors for Azure services.

   ![Screenshot that shows Explorer pane with "Enable connectors in Azure" list open and "Use connectors from Azure" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/use-connectors-from-azure.png)

   > [!NOTE]
   > Stateless workflows currently support only actions and not triggers for [managed connectors](../connectors/apis-list.md#connector-types). 
   > For more information, see [Azure Triggers - GitHub Issue #136](https://github.com/Azure/logicapps/issues/136).

1. From the resource groups list, select **Create new resource group**.

   ![Screenshot that shows Explorer pane with resource groups list and "Create new resource group" selected](./media/create-stateful-stateless-workflows-visual-studio-code/create-select-resource-group.png)

1. Provide a name for the resource group, and press Enter. This example uses `example-workflow-rg`.

   ![Screenshot that shows Explorer pane and resource group name box.](./media/create-stateful-stateless-workflows-visual-studio-code/enter-name-for-resource-group.png)

1. From the locations list, find and select the Azure region to use for your resource group and resources. This example uses **West Central US**.

   ![Screenshot that shows Explorer pane with locations list and "West Central US" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/select-azure-region.png)

   After you perform this step, Visual Studio Code opens the Logic App Designer.

   > [!NOTE]
   > When Visual Studio Code starts the workflow design-time API, a message appears that 
   > startup might take a few seconds. You can ignore this message or select **OK**.

   After the Logic App Designer appears, the **Choose an operation** prompt appears on the designer and is selected by default, which shows the **Add an action** pane.

   ![Screenshot that shows Logic App Designer.](./media/create-stateful-stateless-workflows-visual-studio-code/workflow-app-designer.png)

1. Next, [add a trigger and actions](#add-trigger-actions) to your workflow.

<a name="add-trigger-actions"></a>

## Add a trigger and actions

After you open the Logic App Designer from your `workflow.json` file's shortcut menu, the **Choose an operation** prompt appears on the designer and is selected by default. You can now start creating your workflow by adding a trigger and actions.

The workflow in this example uses this trigger and these actions:

* The built-in [Request trigger](../connectors/connectors-native-reqres.md), **When a HTTP request is received**, which receives inbound calls or requests and creates an endpoint that other services or logic apps can call.

* The [Office 365 Outlook action](../connectors/connectors-create-api-office365-outlook.md), **Send an email**.

  > [!IMPORTANT]
  > For connections that you want to use in workflow built with Visual Studio Code, you have 
  > to first create these connections by using the Logic App Designer in Azure portal. Make sure that 
  > you create these connections in a logic app that uses the same Azure subscription and region as 
  > the workflow that you build in Visual Studio Code. After you create the connections, you can 
  > delete the logic app. Connections are Azure resources that exist separately from the logic app.

* The built-in [Response action](../connectors/connectors-native-reqres.md), which you use to send a reply and return data back to the caller.

### Add the Request trigger

1. Next to the designer, in the **Add a trigger** pane, under the **Choose an operation** search box, make sure that **Built-in** is selected so that you can select a trigger that runs natively.

1. In the **Choose an operation** search box, enter `when a http request`, and select the built-in Request trigger that's named **When a HTTP request is received**.

   ![Screenshot that shows Logic App Designer and **Add a trigger** pane with "When a HTTP request is received" trigger selected.](./media/create-stateful-stateless-workflows-visual-studio-code/add-request-trigger.png)

   When the trigger appears on the designer, the trigger's details pane opens to show the trigger's properties, settings, and other actions.

   ![Screenshot that shows Logic App Designer with the "When a HTTP request is received" trigger selected and trigger details pane open.](./media/create-stateful-stateless-workflows-visual-studio-code/request-trigger-added-to-designer.png)

   > [!TIP]
   > If the details pane doesn't appear, makes sure that the trigger is selected on the designer.

1. If you have to delete an item on the designer, follow these steps:

   1. On the designer, select the item.

   1. In the item's details pane that opens to the right side, select the ellipses (**...**) button **>** **Delete**. To confirm the deletion, select **OK**.

      ![Screenshot that shows selected item on designer with open details pane and with selected ellipses button and "Delete" option.](./media/create-stateful-stateless-workflows-visual-studio-code/delete-item-from-designer.png)

### Add the Office 365 Outlook action

1. On the designer, under the trigger that you added, select **New step**.

   The **Choose an operation** prompt appears on the designer, and the **Add an action pane** reopens so that you can select the next action.

1. On the **Add an action** pane, under the **Choose an operation** search box, select **Azure** so that you can find and select an action for a managed connector that's deployed in Azure.

   This example selects and uses the Office 365 Outlook action, **Send an email (V2)**.

   ![Screenshot that shows Logic App Designer and **Add an action** pane with Office 365 Outlook "Send an email" action selected.](./media/create-stateful-stateless-workflows-visual-studio-code/add-send-email-action.png)

1. On the designer, if the Office 365 Outlook action doesn't appear selected, select that action.

1. On the action's details pane that appears, select **Sign in** so that you can create a connection to your email account.

   ![Screenshot that shows Logic App Designer and **Send an email (V2)** pane with "Sign in" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/send-email-action-sign-in.png)

1. When Visual Studio Code prompts you for consent to access your email account, select **Open**.

   ![Screenshot that shows the Visual Studio Code prompt to permit access.](./media/create-stateful-stateless-workflows-visual-studio-code/visual-studio-code-open-external-website.png)

   > [!TIP]
   > To prevent future prompts, select **Configure Trusted Domains** 
   > so that you can add the authentication page as a trusted domain.

1. Follow the subsequent prompts to sign in, allow access, and allow returning to Visual Studio Code.

   > [!NOTE]
   > If too much time passes before you complete the prompts, the authentication process times out and fails. 
   > In this case, return to the designer and retry signing in to create the connection.

1. When the Azure Logic Apps preview extension prompts you for consent to access your email account, select **Open**. Follow the subsequent prompt to allow access.

   ![Screenshot that shows the preview extension prompt to permit access.](./media/create-stateful-stateless-workflows-visual-studio-code/allow-preview-extension-open-uri.png)

   > [!TIP]
   > To prevent future prompts, select **Don't ask again for this extension**.

1. On the designer, if the **Send an email** action doesn't appear selected, select that action.

1. On the action's details pane, on the **Parameters** tab, provide the required information for the action, for example:

   ![Screenshot that shows Logic App Designer with details for Office 365 Outlook "Send an email" action.](./media/create-stateful-stateless-workflows-visual-studio-code/send-email-action-details.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **To** | Yes | <*your-email-address*> | The email recipient, which can be your email address for test purposes. This example uses the fictitious email, `sophiaowen@fabrikam.com`. |
   | **Subject** | Yes | `An email from your example workflow` | The email subject |
   | **Body** | Yes | `Hello from your example workflow!` | The email body content |
   ||||

   > [!NOTE]
   > If you want to make any changes in the details pane on the **Settings**, **Run After**, 
   > or **Static Result** tab, make sure that you select **Done** to commit those changes 
   > before you switch tabs or change focus to the designer. Otherwise, Visual Studio Code 
   > won't keep your changes. For more information, review the [Known Issues section](#known-issues).

1. On the designer, select **Save**.

Next, debug and test your workflow locally in Visual Studio Code.

<a name="debug-test-workflow-locally"></a>

## Debug and test your workflow

1. To help you more easily debug a stateless workflow, you can [enable the run history for that workflow](#run-history).

1. On the Visual Studio Code toolbar, open the **Run** menu, and select **Start Debugging** (F5).

   The **Terminal** window opens so that you can review the debugging session.

1. Now, find the callback URL for the endpoint on the Request trigger.

   1. Reopen the Explorer pane so that you can view your project.

   1. From the `workflow.json` file's shortcut menu, select **Overview**.

      ![Screenshot that shows the Explorer pane and shortcut window for the workflow.json file with "Overview" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/open-workflow-overview.png)

   1. Find the **Callback URL** value, which looks similar to this URL for the example Request trigger:

      `http://localhost:7071/api/<workflow-name>/triggers/manual/invoke?api-version=2020-05-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=<shared-access-signature>`

      ![Screenshot that shows your workflow's overview page with callback URL](./media/create-stateful-stateless-workflows-visual-studio-code/find-callback-url.png)

1. To test the callback URL by triggering the workflow, open [Postman](https://www.postman.com/downloads/) or your preferred tool for creating and sending requests.

   This example continues by using Postman. For more information, see [Postman Getting Started](https://learning.postman.com/docs/getting-started/introduction/).

   1. On the Postman toolbar, select **New**.

      ![Screenshot that shows Postman with New button selected](./media/create-stateful-stateless-workflows-visual-studio-code/postman-create-request.png)

   1. On the **Create New** pane, under **Building Blocks**, select **Request**.

   1. In the **Save Request** window, under **Request name**, provide a name for the request, for example, `Test workflow trigger`.

   1. Under **Select a collection or folder to save to**, select **Create Collection**.

   1. Under **All Collections**, provide a name for the collection to create for organizing your requests, press Enter, and select **Save to <*collection-name*>**. This example uses `Logic Apps requests` as the collection name.

      Postman's request pane opens so that you can send a request to the callback URL for the Request trigger.

      ![Screenshot that shows Postman with the opened request pane](./media/create-stateful-stateless-workflows-visual-studio-code/postman-request-pane.png)

   1. Return to Visual Studio Code. from the workflow's overview page, copy the **Callback URL** property value.

   1. Return to Postman. On the request pane, next the method list, which currently shows **GET** as the default request method, paste the callback URL that you previously copied in the address box, and select **Send**.

      ![Screenshot that shows Postman and callback URL in the address box with Send button selected](./media/create-stateful-stateless-workflows-visual-studio-code/postman-test-call-back-url.png)

      The example workflow sends an email that appears similar to this example:

      ![Screenshot that shows Outlook email as described in the example](./media/create-stateful-stateless-workflows-visual-studio-code/workflow-app-result-email.png)

1. In Visual Studio Code, return to your workflow's overview page.

   After the request that you sent triggers the workflow, the overview page shows the workflow's run status and history. For more information about run statuses, see [Review runs history](../logic-apps/monitor-logic-apps.md#review-runs-history).

   ![Screenshot that shows your workflow's overview page with run status and history](./media/create-stateful-stateless-workflows-visual-studio-code/post-trigger-call.png)

   > [!TIP]
   > If the run status doesn't appear, try refreshing the overview page by selecting **Refresh**.

1. To review the statuses for each step in a specific run and the step's inputs and outputs, select the ellipses (**...**) button for that run, and select **Show Run**.

   ![Screenshot that shows your workflow's run history row with ellipses button and "Show Run" selected](./media/create-stateful-stateless-workflows-visual-studio-code/show-run-history.png)

   Visual Studio Code shows the run statuses for each action.

1. To review the inputs and outputs for each step, expand the step that you want to inspect. To further review the raw inputs and outputs for that step, select **Show raw inputs** or **Show raw outputs**.

   ![Screenshot that shows the status for each step in the workflow plus the inputs and outputs in the expanded "Send an email" action](./media/create-stateful-stateless-workflows-visual-studio-code/run-history-details.png)

1. To stop the debugging session, on the **Run** menu, select **Stop Debugging** (Shift + F5).

<a name="return-response"></a>

## Return a response to the caller

To return a response back to the caller that sent a request to your workflow, you can use the built-in [Response action](../connectors/connectors-native-reqres.md) for a workflow that starts with the Request trigger.

1. On the Logic App Designer, under the **Send an email** action, select **New step**.

   The **Choose an operation** prompt appears on the designer, and the **Add an action pane** reopens so that you can select the next action.

1. On the **Add an action** pane, under the **Choose an action** search box, make sure that **Built-in** is selected. In the search box, enter `response`, and select the **Response** action.

   ![Screenshot that shows Logic App Designer with the Response action selected.](./media/create-stateful-stateless-workflows-visual-studio-code/add-response-action.png)

1. On the designer, select the **Response** action so that the action's details pane appears.

   ![Screenshot that shows Logic App Designer with the "Response" action's details pane open and the "Body" property set to the "Send an email" action's "Body" property value.](./media/create-stateful-stateless-workflows-visual-studio-code/response-action-details.png)

1. On the **Parameters** tab, provide the required information for the function that you want to call.

   This example returns the **Body** property value that's output from the **Send an email** action.

   1. Click inside the **Body** property box so that the dynamic content list appears and shows the available output values from the preceding trigger and actions in the workflow.

      ![Screenshot that shows the "Response" action's details pane with the mouse pointer inside the "Body" property so that the dynamic content list appears.](./media/create-stateful-stateless-workflows-visual-studio-code/open-dynamic-content-list.png)

   1. In the dynamic content list, under **Send an email**, select **Body**.

      ![Screenshot that shows the open dynamic content list. In the list, under the "Send an email" header, the "Body" output value is selected.](./media/create-stateful-stateless-workflows-visual-studio-code/select-send-email-action-body-output-value.png)

      When you're done, the Response action's **Body** property is now set to the **Send an email** action's **Body** output value.

      ![Screenshot that shows the status for each step in the workflow plus the inputs and outputs in the expanded "Response" action.](./media/create-stateful-stateless-workflows-visual-studio-code/response-action-details-body-property.png)

1. On the designer, select **Save**.

<a name="retest-workflow"></a>

## Retest your workflow

After you make updates to your workflow, you can run another test by rerunning the debugger in Visual Studio and sending another request to trigger your updated workflow, similar to the steps in [Debug and test your workflow](#debug-test-workflow-locally).

1. On the Visual Studio Code toolbar, open the **Run** menu, and select **Start Debugging** (F5).

1. In Postman or your tool for creating and sending requests, send another request to trigger your workflow.

1. On the workflow's overview page, check the status for the most recent run. To view the status, inputs, and outputs for each step in that run, select the ellipses (**...**) button for that run, and select **Show Run**.

   For example, here's the step-by-step status for a run after the sample workflow was updated with the Response action.

   ![Screenshot that shows the status for each step in the updated workflow plus the inputs and outputs in the expanded "Response" action.](./media/create-stateful-stateless-workflows-visual-studio-code/run-history-details-rerun.png)

1. To stop the debugging session, on the **Run** menu, select **Stop Debugging** (Shift + F5).

<a name="publish-to-azure"></a>

## Publish workflow to Azure

From Visual Studio Code, you can deploy your project directly to Azure, which publishes your workflow using the new **Logic App (Preview)** resource type. Similar to the function app resource in Azure Functions, deployment for this new resource type requires that you select an [Azure App Service hosting plan and pricing tier](../app-service/overview-hosting-plans.md), which you can set up during deployment. For more information about hosting plans and pricing, review these topics:

* [Scale up an in Azure App Service](../app-service/manage-scale-up.md)
* [Azure Functions scale and hosting](../azure-functions/functions-scale.md)

 You can publish your workflow as a new resource, which automatically creates any additional necessary resources, such as an [Azure Storage account, similar to function app requirements](../azure-functions/storage-considerations.md). Or, you can publish your workflow to a previously deployed **Logic App (Preview)** resource, which the deployment process overwrites in Azure.

### Enable run history for publishing to deployed Logic App (Preview) resources

If you choose to publish to an already deployed **Logic App (Preview)** resource, follow these steps to enable the workflow's run history:

1. In the [Azure portal](https://portal.azure.com), find and select the deployed **Logic App (Preview)** resource.

1. On that resource's menu, under **API**, select **CORS**.

1. On the **CORS** pane, under **Allowed Origins**, add the wildcard character (*).

1. When you're done, on the **CORS** toolbar, select **Save**.

![Screenshot that shows the Azure portal with a deployed Logic Apps (Preview) resource. On the resource menu, "CORS" is selected with a new entry for "Allowed Origins" set to the wildcard "*" character.](./media/create-stateful-stateless-workflows-visual-studio-code/enable-run-history-deployed-logic-app.png)

For more information, see [Run history of function apps - GitHub Issue #104](https://github.com/Azure/logicapps/issues/104).

### Publish as a new Logic App (Preview) resource

1. On the Visual Studio Code toolbar, select the Azure icon.

1. Under **Azure: Logic Apps (Preview)**, select the **Local Project (*your-project-name*)** folder. On the toolbar, select **Deploy to Logic App**.

   ![Screenshot that shows the "Azure: Logic Apps (Preview)" pane with the "Local Project (<your-project-name>)" folder selected and pane's toolbar with "Deploy to Logic App" selected.](./media/create-stateful-stateless-workflows-visual-studio-code/deploy-to-logic-app.png)

1. From the list that Visual Studio Code opens, select from these options:

   * **Create new Logic App (Preview) in Azure** (quick create)
   * **Create new Logic App (Preview) in Azure - Advanced**
   * A previously deployed **Logic App (Preview)** resource, if any exist

   This example selects the non-advanced **Create new Logic App (Preview) in Azure** option.

   ![Screenshot that shows the "Azure: Logic Apps (Preview)" pane with a list that has quick and advanced creation options and also any existing logic apps to select instead.](./media/create-stateful-stateless-workflows-visual-studio-code/select-create-logic-app-options.png)

1. If you choose to create a **Logic App (Preview)** resource, follow these steps:

   1. Provide a globally unique name for your new logic app.

      ![Screenshot that shows the "Azure: Logic Apps (Preview)" pane and a prompt to provide a name for the new logic app to create.](./media/create-stateful-stateless-workflows-visual-studio-code/enter-logic-app-name.png)

   1. Select a hosting plan for your new logic app. This example selects **App Service Plan**.

      ![Screenshot that shows the "Azure: Logic Apps (Preview)" pane and a prompt to select "App Service Plan" or "Premium".](./media/create-stateful-stateless-workflows-visual-studio-code/select-hosting-plan.png)

   1. Create a new Windows App Service plan or select an existing plan. This example selects **Create new App Service Plan**.

      ![Screenshot that shows the "Azure: Logic Apps (Preview)" pane and a prompt to "Create new App Service Plan" or select an existing Windows App Service plan.](./media/create-stateful-stateless-workflows-visual-studio-code/create-app-service-plan.png)

   1. Provide a name for the new App Service plan, and then select an App Service [pricing tier](https://azure.microsoft.com/pricing/details/app-service/windows/) to use. This example selects the **F1 Free** plan.

      ![Screenshot that shows the "Azure: Logic Apps (Preview)" pane and a prompt to select a pricing tier.](./media/create-stateful-stateless-workflows-visual-studio-code/select-pricing-tier.png)

    1. Select either **Create new resource group** or an existing resource group to use for the new resources. If you create a new group, provide a name and the location or region to use for the new group.

   When you're done, Visual Studio Code starts creating and deploying the resources necessary for publishing your workflow.

1. To review and monitor the deployment process, on the **View** menu, select **Output**. From the Output window toolbar list, select **Azure Logic Apps**.

   ![Screenshot that shows the Output window with the "Azure Logic Apps" selected in the toolbar list along with the deployment progress and statuses.](./media/create-stateful-stateless-workflows-visual-studio-code/logic-app-deployment-output-window.png)

1. To confirm that your workflow deployed successfully, sign in to the Azure portal. On the Azure search bar, find and select your deployed logic app.

   ![Screenshot that shows the Azure portal and the search bar with search results for deployed logic app, which appears selected.](./media/create-stateful-stateless-workflows-visual-studio-code/find-deployed-workflow-azure-portal.png)

<a name="deploy-to-docker"></a>

## Deploy to Docker container

By using the [.NET Core command-line interface (CLI) tool](/dotnet/core/tools/), you can build your project, and then publish your build. You can then build and use a [Docker container](/visualstudio/docker/tutorials/docker-tutorial#what-is-a-container) as the destination for deploying your workflow. For more information, review these topics:

* [Introduction to Containers and Docker](/dotnet/architecture/microservices/container-docker-introduction/)
* [Introduction to .NET and Docker](/dotnet/core/docker/introduction)
* [Docker terminology](/dotnet/architecture/microservices/container-docker-introduction/docker-terminology)
* [Tutorial: Get started with Docker](/visualstudio/docker/tutorials/docker-tutorial)

1. To build your project, open a command-line prompt, and run this command:

   `dotnet build -c release`

   For more information, see the [dotnet build](/dotnet/core/tools/dotnet-build/) reference page.

1. Publish your build by running this command:

   `dotnet publish`

   For more information, see the [dotnet publish](/dotnet/core/tools/dotnet-publish/) reference page.

1. Build a Docker container by using a Docker file for a .NET workflow and running this command:

   `docker build --tag local/workflowcontainer .`

   For example, here's a sample Docker file for a .NET workflow, but replace the <*storage-account-connection-string*> value with your Azure Storage account's connection string:

   ```text
   FROM mcr.microsoft.com/azure-functions/dotnet:3.0.13614-appservice
   ENV AzureWebJobsStorage <storage-account-connection-string>
   ENV AzureWebJobsScriptRoot=/home/site/wwwroot \ AzureFunctionsJobHost__Logging__Console__IsEnabled=true
   COPY ./bin/Release/netcoreapp3.1/publish/ /home/site/wwwroot
   ```

   For more information, see [docker build](https://docs.docker.com/engine/reference/commandline/build/).

1. Run the container locally by using this command:

   `docker run -p 8080:80 local/workflowcontainer`

   For more information, see [docker run](https://docs.docker.com/engine/reference/commandline/run/).

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

<a name="run-history"></a>

## Run history for stateless workflows

To more easily debug a stateless workflow, you can enable the run history for that workflow, and then disable the run history when you're done.

### For a stateless workflow running in Visual Studio Code

If you are working on and running the stateless workflow locally in Visual Studio Code, follow these steps:

1. In your project, find and expand the `workflow-designtime` folder. Find and open the `local.settings.json` file.

1. Add the `Workflow.<yourWorkflowName>.operationOptions` property and set the value to `WithStatelessRunHistory`, for example:

   **Mac OS**

   ```json
   {
      "IsEncrypted": false,
      "Values": {
         "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=fabrikamstorageaccount;AccountKey=<access-key>;EndpointSuffix=core.windows.net",
         "FUNCTIONS_WORKER_RUNTIME": "dotnet",
         "FUNCTIONS_EXTENSIONBUNDLE_SOURCE_URI": "https://workflowscdn.azureedge.net/2020-05-preview",
         "Workflow.<yourWorkflowName>.OperationOptions": "WithStatelessRunHistory"
      }
   }
   ```

   **Windows or other OS**

   ```json
   {
      "IsEncrypted": false,
      "Values": {
         "AzureWebJobsStorage": "UseDevelopmentStorage=true",
         "FUNCTIONS_WORKER_RUNTIME": "dotnet",
         "FUNCTIONS_EXTENSIONBUNDLE_SOURCE_URI": "https://workflowscdn.azureedge.net/2020-05-preview",
         "Workflow.<yourWorkflowName>.OperationOptions": "WithStatelessRunHistory"
      }
   }
   ```

1. To disable the run history when you're done, either delete the `Workflow.<yourWorkflowName>.OperationOptions` property and its value, or set the property to `None`.

### For a stateless workflow running in the Azure portal

If you already deployed your project to the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com), find and open your **Logic App (Preview)** resource.

1. On the logic app's menu, under **Settings**, select **Configuration**.

1. On the **Application Settings** tab, select **New application setting**.

1. On the **Add/Edit application setting** pane, in the **Name** box, enter this operation option name: 

   `Workflow.<yourWorkflowName>.OperationOptions`

1. In the **Value** box, enter the following value: `WithStatelessRunHistory`

   For example:

   ![Screenshot that shows the Azure portal and Logic App (Preview) resource with the "Configuration" > "New application setting" < "Add/Edit application setting" pane open and the "Workflow.<yourWorkflowName>OperationOptions" option set to "WithStatelessRunHistory".](./media/create-stateful-stateless-workflows-visual-studio-code/stateless-operation-options-run-history.png)

1. When you're done, select **OK**. On the **Configuration** pane, select **Save**.

<a name="nested-workflow-behavior"></a>

## Nested workflow differences between stateful and stateless

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

<a name="known-issues"></a>

## Known issues

* Stateless workflows currently support only actions and not triggers for [managed connectors](../connectors/apis-list.md#connector-types). For more information, see [Azure Triggers - GitHub Issue #136](https://github.com/Azure/logicapps/issues/136).

* In Visual Studio Code, when you are working in the Logic App Designer, and you have the details pane open for a trigger or action, any changes that you make in the **Settings**, **Run After**, or **Static Result** tab don't persist if you don't select **Done** before you switch tabs or select another item on the designer.

  Make sure that you commit your changes before you switch tabs or change focus to the designer. Otherwise, Visual Studio Code won't keep your changes.

* The [**Inline Code** action](../logic-apps/logic-apps-add-run-inline-code.md), which you can use for running JavaScript code, currently isn't supported on Linux operating systems or on the Azure Functions runtime version 2. If you want to use this action on a non-Linux OS, make sure that you install [Azure Functions Core Tools 3.0.14492](../azure-functions/functions-run-local.md#install-the-azure-functions-core-tools), which includes a version of the same runtime that powers the Azure Functions runtime that runs in Visual Studio Code. For more information, see [Prerequisites](#prerequisites).

* In Visual Studio Code, no scrollbar appears when you try to zoom in or zoom out, which prevents you from viewing content that appears off the screen.

  * To restore the original view, reset the zoom level with either option:

    * Press **Ctrl** + **NumPad0**.

    * From the **View** menu, select **Appearance** **>** **Reset Zoom**.

  * To change the zoom level on only the Logic App Designer canvas, use the Logic App Designer's zoom controls, which appear at the bottom of the canvas.

    ![Screenshot that shows the Logic App Designer canvas and the zoom controls at the canvas bottom](./media/create-stateful-stateless-workflows-visual-studio-code/zoom-levels-designer-canvas.png)

## Next steps

We'd like to hear from you! To report bugs, provide feedback or suggestions, and ask questions about the public preview extension, please visit our [feedback site](https://aka.ms/lafeedback).