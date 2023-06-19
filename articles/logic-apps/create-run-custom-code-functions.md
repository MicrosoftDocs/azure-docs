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

1. Open Visual Studio Code. On the Activity Bar, select the **Azure** icon. (Keyboard: Shift+Alt+A)

1. In the **Azure** window that opens, on the **Workspace** toolbar, select **Create new logic app workspace**. 

   :::image type="content" source="media/create-run-custom-code-functions/create-workspace.png" alt-text="Screenshot shows Visual Studio Code, Azure window, and selected option for Create new logic app workspace.":::

1. In the **Create new logic app workspace** prompt that appears, find and select the local folder that you created for your project.

   :::image type="content" source="media/create-run-custom-code-functions/select-local-folder.png" alt-text="Screenshot shows Visual Studio Code with prompt to select a local folder for workflow project.":::

1. Follow the prompts to provide the following example values:

   | Item | Example value |
   |------|---------------|
   | Workspace name | **MyLogicAppWorkspace** |
   | Function name | **WeatherForecast** |
   | Namespace name | **Contoso.Enterprise** |
   | Workflow template: <br>- **Stateful Workflow** <br>- **Stateless Workflow** | **Stateful Workflow** |
   | Workflow name | **MyWorkflow** |

1. Select **Open in current window**.

   After you finish this step, Visual Studio Code creates your workspace, which includes a function project and a logic app workflow project, by default, for example:

   :::image type="content" source="media/create-run-custom-code-functions/created-workspace.png" alt-text="Screenshot shows Visual Studio Code with created workspace.":::

   | Node | Description |
   |------|-------------|
   | **<*workspace-name*>** | Contains both your function project and logic app workflow project. |
   | **Functions** | Contains the artifacts for your function project. For example, the **<*function-name*>.cs** file is the code file where you can author your code. |
   | **LogicApp** | Contains the artifacts for your logic app project, including a blank workflow. |

## Write your code

1. In your workspace, expand the **Functions** node, if not already expanded.

1. Open the **<*function-name*>.cs** file.

   By default, this file contains sample code that has the following code elements along with the previously provided example values where appropriate:

   - Namespace name
   - Class name
   - Function name
   - Function parameters
   - Return type
   - Complex type

   The following example shows the complete sample code:

   ```csharp
   //------------------------------------------------------------
   // Copyright (c) Microsoft Corporation. All rights reserved.
   //------------------------------------------------------------

   namespace Contoso.Enterprise
   {
       using System;
       using System.Collections.Generic;
       using System.Threading.Tasks;
       using Microsoft.Azure.Functions.Extensions.Workflows;
       using Microsoft.Azure.WebJobs;

       /// <summary>
       /// Represents the WeatherForecast flow invoked function.
       /// </summary>
       public static class WeatherForecast
       {
           /// <summary>
           /// Executes the logic app workflow.
           /// </summary>
           /// <param name="zipCode">The zip code.</param>
           /// <param name="temperatureScale">The temperature scale (e.g., Celsius or Fahrenheit).</param>
           [FunctionName("WeatherForecast")]
           public static Task<Weather> Run([WorkflowActionTrigger] int zipCode, string temperatureScale)
           {
               // Generate random temperature within a range based on the temperature scale
               Random rnd = new Random();
               var currentTemp = temperatureScale == "Celsius" ? rnd.Next(1, 30) : rnd.Next(40, 90);
               var lowTemp = currentTemp - 10;
               var highTemp = currentTemp + 10;

               // Create a Weather object with the temperature information
               var weather = new Weather()
               {
                   ZipCode = zipCode,
                   CurrentWeather = $"The current weather is {currentTemp} {temperatureScale}",
                   DayLow = $"The low for the day is {lowTemp} {temperatureScale}",
                   DayHigh = $"The high for the day is {highTemp} {temperatureScale}"
               };

               return Task.FromResult(weather);
           }

           /// <summary>
           /// Represents the weather information.
           /// </summary>
           public class Weather
           {
               /// <summary>
               /// Gets or sets the zip code.
               /// </summary>
               public int ZipCode { get; set; }

               /// <summary>
               /// Gets or sets the current weather.
               /// </summary>
               public string CurrentWeather { get; set; }

               /// <summary>
               /// Gets or sets the low temperature for the day.
               /// </summary>
               public string DayLow { get; set; }

               /// <summary>
               /// Gets or sets the high temperature for the day.
               /// </summary>
               public string DayHigh { get; set; }
           }
       }
   }
   ```

   The function definition includes a default `Run` method that you can use to get started. This sample `Run` method demonstrates some of the capabilities available with the custom code feature, such as passing different inputs and outputs, including complex .NET types.

1. Replace the sample function code with your own, and edit the default `Run` method for your own scenarios. Or, you can copy the function, including the `[FunctionName("<*function-name*>")]` declaration, and then rename the function with a unique name. You can then edit the renamed function to meet your needs.

This example continues with the sample code without any changes.

## Compile and build your code

After you finish writing your code, compile to make sure that no build errors exist. Your function project automatically includes build tasks that compiles your code and adds that compiled code to the **lib\custom\net472** folder in your logic app project where workflows look for custom code to run.

1. In Visual Studio Code, from the **Terminal** menu, select **New Terminal**.

1. From the working directory list that appears, select **Functions** as your current working directory for the new terminal.

   :::image type="content" source="media/create-run-custom-code-functions/compile-function-project.png" alt-text="Screenshot shows Visual Studio Code, prompt for current working directory, and selected Functions directory.":::

   Visual Studio Code opens a terminal window with a command prompt.

1. In the **Terminal** window, at the command prompt, enter **dotnet restore**.

   Visual Studio Code analyzes your projects and determines whether they're up-to-date.

   :::image type="content" source="media/create-run-custom-code-functions/dotnet-restore-complete.png" alt-text="Screenshot shows Visual Studio Code, Terminal window, and completed dotnet restore command.":::

1. After the command prompt reappears, enter **dotnet build**. Or, from the **Terminal** menu, select **Run Build Task**.

   If your build succeeds, the **Terminal** window reports that the **Build succeeded**.

1. In your workspace, expand the following nodes: **LogicApp** > **lib\custom** > **net472**.

1. Confirm that the following items exist in your logic app project

   - Multiple assembly (DLL) files, including a file named **<*function-name*>.dll**, that are required to run your code.

   - A subfolder named **<*function-name*>** that contains a **function.json** file. This file contains the metadata about the function code that you wrote. The workflow designer uses this file to determine the necessary inputs and outputs when calling your code.

   The following example shows sample generated assemblies and other files in the logic app project:

   :::image type="content" source="media/create-run-custom-code-functions/generated-assemblies.png" alt-text="Screenshot shows Visual Studio Code and logic app workspace with function project and logic app project, now with the generated assemblies and other required files.":::

## Call your code from a workflow

After you confirm that your code compiles and that your logic app project contains the necessary files for your code to run, open the default workflow that's included with your logic app project.

1. In your workspace, under **LogicApp**, expand the **<*workflow-name*>** node, open the shortcut menu for **workflow.json**, and select **Open Designer**.

   On the workflow designer that opens, the default workflow, included with your logic app project, appears with the following trigger and actions:

   - The built-in [Request trigger named **When a HTTP request is received**](../connectors/connectors-native-reqres.md)
   - The built-in action named **Call a local function in this logic app**
   - The built-in [Response action named **Response**](../connectors/connectors-native-reqres.md), which you use to reply to the caller only when you use the Request trigger

1. Select the action named **Call a local function in this logic app**.

1. After the action information pane opens to the right, review and confirm that the **Function name** parameter value is set to the function that you want to run. Review or change any other parameter values that your function uses.

## Debug your code and workflow

1. Repeat the following steps to start the Azurite storage emulator *three* times: one time each for the following Azure Storage services:

   - Azure Blob Service
   - Azure Queue Service
   - Azure Table Service

   1. From the Visual Studio Code **View** menu, select **Command Palette**.

   1. At the prompt that appears, find and select **Azurite: Start Blob Service**.

   1. From the working directory list that appears, select **LogicApp**.

   1. Repeat these steps for **Azurite: Start Queue Service** and **Azurite: Start Table Service**.

   You're successful when the Visual Studio Code taskbar at the bottom of the screen shows the three storage services running, for example:

   :::image type="content" source="media/create-run-custom-code-functions/storage-services-running.png" alt-text="Screenshot shows Visual Studio Code taskbar with Azure Blob Service, Azure Queue Service, and Azure Table Service running.":::

1. On the Visual Studio Code Activity Bar, select **Run and Debug**. (Keyboard: Ctrl+Shift+D)

   :::image type="content" source="media/create-run-custom-code-functions/run-debug.png" alt-text="Screenshot shows Visual Studio Code Activity Bar with Run and Debug selected.":::

1. From the **Run and Debug** list, select **Attach to logic app (LogicApp)**, if not already selected, and then select **Play** (green arrow).

   :::image type="content" source="media/create-run-custom-code-functions/attach-debugger-logic-app.png" alt-text="Screenshot shows Run and Debug list with Attach to logic app selected and Play button selected.":::

   The **Terminal** window opens and shows the started debugging process. The **Debug Console** window then appears and shows the debugging statuses. At the bottom of Visual Studio Code, the task bar turns orange, indicating that the .NET debugger is loaded.

1. From the **Run and Debug** list, select **Attach to .NET Functions (Functions)**, and then select **Play** (green arrow).

   :::image type="content" source="media/create-run-custom-code-functions/attach-debugger-net-functions.png" alt-text="Screenshot shows Run and Debug list with Attach to NET Functions selected and Play button selected.":::

1. To set any breakpoints, in your function definition (**<*function-name*>.cs**) or workflow definition (**workflow.json**), find the line number where you want the breakpoint, and select the column to the left, for example:

   :::image type="content" source="media/create-run-custom-code-functions/set-breakpoint.png" alt-text="Screenshot shows Visual Studio Code and the open function code file with a breakpoint set for a line in code.":::

1. To manually run the Request trigger in your workflow, find the trigger URL:

   1. From your logic app project, open the **workflow.json** file's shortcut menu, and select **Overview**.

      On the workflow's **Overview** page, the **Run trigger** button is available for when you want to manually start the workflow. Under **Workflow Properties**, the **Callback URL** value is the URL for a callable endpoint that's created by the Request trigger in your workflow. You can send requests to this URL to trigger your workflow from other apps, including other logic app workflows.

      :::image type="content" source="media/create-run-custom-code-functions/workflow-overview.png" alt-text="Screenshot shows Visual Studio Code and workflow's Overview page opened.":::

  1. On the **Overview** page toolbar, select **Run trigger**.

     After your workflow starts to run, the debugger activates your first breakpoint.

  1. On the **Run** menu or debugger toolbar, select a [debug action](https://code.visualstudio.com/docs/editor/debugging#_debug-actions).

     After the workflow run completes, the **Overview** page shows the finished run and basic details about that run.

1. To review more information about the workflow run, select the finished run. Or, from the list next to the **Duration** column, select **Show run**.

   :::image type="content" source="media/create-run-custom-code-functions/workflow-run-history.png" alt-text="Screenshot shows Visual Studio Code and finished workflow run.":::

## Deploy your code

You can deploy your custom code in the same way that you deploy your logic app project. Whether you deploy from Visual Studio Code or use a CI/CD DevOps process, make sure that you build your code and that all dependent assemblies exist in the logic app project's **lib/custom/net472** folder before you deploy.

## Next steps

[Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)