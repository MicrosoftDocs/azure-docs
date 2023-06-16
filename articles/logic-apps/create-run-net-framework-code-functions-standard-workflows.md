---
title: Create and run .NET Framework code from Standard workflows
description: Author and run code using the .NET Framework from Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, azla
ms.topic: how-to
ms.date: 05/23/2023
---

# Create and run .NET Framework code from Standard workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

For integration solutions where you have to write and run .NET Framework code with your Standard logic app workflow, you can use Visual Studio Code with the Azure Logic Apps (Standard) extension. This capability provides the following benefits:

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

- Custom code authoring currently isn't available in the Azure portal.

  However, after you deploy your custom code to Azure, you can use the **Call a local function in this logic app** built-in action and deployed functions to run code and reference the outputs in subsequent actions like in any other workflow. You can view the run history, inputs, and outputs for the built-in action.

## Create a code project

The latest Azure Logic Apps (Standard) extension for Visual Studio Code includes a code project template that provides a streamlined experience for writing, debugging, and deploying your own code with your workflows. This project template creates a workspace file and two sample projects: one project to write your code, the other project to create your workflows. 

> [!NOTE]
>
> You can't use the same project for both your code and workflows.

1. On the Visual Studio Code Activity toolbar, select the **Azure** icon.

1. In the **Azure** window that opens, on the **Workspace** toolbar, select **Create new code project**. Find and select the local folder that you created for your project.

1. Follow the prompts to provide the following information:

   - Workspace name
   - Function name
   - Namespace name
   - Workflow template, either stateful or stateless
   - Workflow name

1. Select **Open in current window**.

   After you finish this step, Visual Studio Code creates your workspace, which contains a function project and a logic app project, for example:

## Write your code

The function project includes a .cs file that contains the function with the name that you previously provided. This function includes a default Run method that you can use to get started.  This sample method demonstrates some of the capabilities found in calling in our custom code feature including passing different inputs and outputs including complex .NET types.
Note: You can modify the existing Run method to meet your needs, or you can copy and paste the function, including the [FunctionName(“function-name”)] declaration, and rename it to ensure there is a unique name associated with it. Modify this new function as you see fit.

1. In your workspace, expand **Functions**, if not already expanded, and open the <*your-function-name*>.cs file, which contains the following code elements:

   - Class namespace
   - Class name
   - Function name
   - Function parameters
   - Return type
   - Complex type

1. 

## Compile and build your code

After you finish writing your code, compile that code to make sure that no build errors exist.

1. From the Visual Studio Code **Terminal** menu, select **New Terminal**.

1. From the working directory list that appears, select **Functions** as your current working directory for the new terminal.

   Visual Studio Code opens a command prompt window.

1. At the command prompt, enter **dotnet restore**.

   Visual Studio Code analyzes your projects and determines whether they're up-to-date to restore.

1. After the command prompt reappears, enter **dotnet build**. Or, from the **Terminal** menu, select **Run Build Task**.

1. In your workspace, expand **LogicApp** > **lib\custom** > **net472**, and confirm that the following items exist:

   - Multiple assembly (DLL) files, including a file named **<*your-function-name*>.dll**, which are required to run your code.

   - A subfolder named **<*your-function-name*>**, which you provided earlier, that contains a **function.json** file.
   
     This file contains the metadata about the function code that you wrote. The workflow designer uses this file to determine the necessary inputs and outputs when calling your code.


## Configure custom code to call from a workflow
