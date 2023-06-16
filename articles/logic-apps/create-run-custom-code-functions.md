---
title: Create and run .NET Framework code from Standard workflows
description: Write and run code using the .NET Framework from Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, azla
ms.topic: how-to
ms.date: 05/23/2023
---

# Create and run .NET Framework code from Standard workflows in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For integration solutions where you have to author and run .NET Framework code from your Standard logic app workflow, you can use Visual Studio Code with the Azure Logic Apps (Standard) extension. This extension provides the following capabilities and benefits:

- Create code that has the flexibility and control to solve your most challenging integration problems.
- Debug code locally in Visual Studio Code. Step through your code and workflows in the same debugging session.
- Deploy code alongside your workflows. No other service plans are necessary.
- Support BizTalk Server migration scenarios Lift and shift your custom .NET Framework investments from on-premises to the cloud with 

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code with the Azure Logic Apps (Standard) extension. To meet these requirements, see the prerequisites for [Create Standard workflows in single-tenant Azure Logic Apps with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

  - The custom code capability is currently available only in Visual Studio Code, running on a Windows operating system.

  - This capability currently supports calling .NET Framework 4.7.2 assemblies. 

- A local folder to use for creating your code project

## Limitations

Custom code authoring currently isn't available in the Azure portal. However, after you deploy your custom code to Azure, you can use the **Call a local function in this logic app** built-in action and deployed functions to run code and reference the outputs in subsequent actions like in any other workflow. You can view the run history, inputs, and outputs for the built-in action.

## Create a code project

The latest Azure Logic Apps (Standard) extension for Visual Studio Code includes a code project template that provides a streamlined experience for writing, debugging, and deploying your own code with your workflows. This project template creates a workspace file and two sample projects: one project to write your code, the other project to create your workflows. 

> [!NOTE]
>
> You can't use the same project for both your code and workflows.

1. On the Visual Studio Code Activity Bar, select the **Azure** icon. (Keyboard: Shift+Alt+A)

1. In the **Azure** window that opens, on the **Workspace** toolbar, select **Create new logic app workspace**. 

1. In the **Create new logic app workspace** prompt that appears, find and select the local folder that you created for your project.

1. Follow the prompts to provide the following information:

   - Workspace name
   - Function name
   - Namespace name
   - Workflow template, either stateful or stateless
   - Workflow name

1. Select **Open in current window**.

   After you finish this step, Visual Studio Code creates your workspace, which includes a function project and a logic app project, by default, for example:

## Write your code

1. In your workspace, expand **Functions**, if not already expanded, and open the <*your-function-name*>.cs file, which contains the following code elements, with the information that you previously provided:

   - Namespace with the previously provided name
   - Class name
   - Function with the previously provided name
   - Function parameters
   - Return type
   - Complex type

   The function definition includes a default `Run` method that you can use to get started. This sample method demonstrates some of the capabilities available with the custom code feature, such as passing different inputs and outputs, including complex .NET types.

   > [!TIP]
   >
   > You can edit the default `Run` method for your own scenarios. Or, you can copy the function, 
   > including the `[FunctionName("<*function-name*>")]` declaration, and then rename the function, 
   > using a unique name. You can then edit the renamed function to meet your needs.

1. 

## Compile and build your code

After you finish writing your code, compile that code to make sure that no build errors exist. Your function project automatically includes build tasks that compiles your code and adds that compiled code to the **lib\custom\net472** folder in your logic app project where workflows look for custom code to run.

1. From the Visual Studio Code **Terminal** menu, select **New Terminal**.

1. From the working directory list that appears, select **Functions** as your current working directory for the new terminal.

   Visual Studio Code opens a command prompt window.

1. At the command prompt, enter **dotnet restore**.

   Visual Studio Code analyzes your projects and determines whether they're up-to-date to restore.

1. After the command prompt reappears, enter **dotnet build**. Or, from the **Terminal** menu, select **Run Build Task**.

1. In your workspace, expand **LogicApp** > **lib\custom** > **net472**, and confirm that the following items exist:

   - Multiple assembly (DLL) files, including a file named **<*your-function-name*>.dll**, that are required to run your code.

   - A subfolder named **<*your-function-name*>** that contains a **function.json** file. This file contains the metadata about the function code that you wrote. The workflow designer uses this file to determine the necessary inputs and outputs when calling your code.

## Add the action to call your code from a workflow

After you confirm that your code compiles, and that your logic app project contains the necessary files for your code to run, set up the **Call a local function in this logic app** built-in action in your workflow.

1. In your workspace, under **LogicApp**, expand **<*your-workflow-name*>**, open the shortcut menu for **workflow.json**, and select **Open Designer**.

1. After the workflow designer opens, [follow these steps to add the Request trigger named **When a HTTP request is received** to your workflow](create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

1. Now [follow these steps to add the built-in action named **Call a local function in this logic app** to your workflow](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. After the action information pane appears to the right, confirm that the **Function name** parameter value is set to the function that you want. Review or change any other parameter values that your function uses.

## Debug your code and workflow

1. Repeat the following steps to start the Azurite storage emulator *three* times. Each time starts each of the following Azure Storage services:

   - Azure Blob Service
   - Azure Table Service
   - Azure Queue Service

   1. From the Visual Studio Code **View** menu, select **Command Palette**.

   1. At the prompt that appears, enter **/**, and then enter **Azurite: Start**.

   1. From the working directory list that appears, select **LogicApp**.

   You're successful when the bottom of the screen shows the three storage services running, for example:

1. On the Visual Studio Code Activity Bar, select **Run and Debug**. (Keyboard: Ctrl+Shift+D)

1. In the **Run and Debug** list, make sure that **Attach to Logic App (LogicApp)** is selected. Select the **Play** button (green arrow).

1. From the **Run and Debug** list, select **Attach to .NET Functions (Functions)**. Select the **Play** button (green arrow).

1. To fire the Request trigger in your workflow, find the trigger URL:

   1. Return to view your workspace and projects.

   1. In your logic app project, open the **workflow.json** file's shortcut menu, and select **Overview**.

   1. Make sure the **Run trigger** button is still enabled.

   1. On the **Overview** page, under **Workflow Properties**, find the **Callback URL** value, which is the URL for the endpoint created by the Request trigger.

## Deploy your code

You can deploy your custom code in the same way that you deploy your logic app project. Whether you deploy from Visual Studio Code or use a CI/CD DevOps process, make sure that you build your code and that all dependent assemblies exist in the logic app project's **lib/custom/net472** folder before you deploy.

## Next steps

[Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)