---
title: Create and run .NET Framework code from Standard workflows
description: Write and run code using the .NET Framework from Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, azla
ms.topic: how-to
ms.custom: devx-track-dotnet
ms.date: 08/07/2023
# Customer intent: As a logic app workflow developer, I want to write and run my own .NET Framework code to perform custom integration tasks.
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
- Support BizTalk Server migration scenarios so you can lift-and shift custom .NET Framework investments from on premises to the cloud.

With the capability to write your own code, you can accomplish scenarios such as the following:

- Custom business logic implementation
- Custom parsing to extract information from an inbound message
- Data validation and simple transformations
- Message shaping for outbound messages to another system, such as an API
- Calculations

However, custom code isn't suitable for scenarios such as the following:

- Processes that take more than 10 minutes to run
- Large message and data transformations
- Complex batching and debatching scenarios
- BizTalk Server pipeline components that implement streaming

For more information about limitations in Azure Logic Apps, see [Limits and configuration - Azure Logic Apps](logic-apps-limits-and-config.md).

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
> You can't use the same project folder for both your code and workflows.

1. Open Visual Studio Code. On the Activity Bar, select the **Azure** icon. (Keyboard: Shift+Alt+A)

1. In the **Azure** window that opens, on the **Workspace** section toolbar, from the **Azure Logic Apps** menu, select **Create new logic app workspace**. 

   :::image type="content" source="media/create-run-custom-code-functions/create-workspace.png" alt-text="Screenshot shows Visual Studio Code, Azure window, Workspace section toolbar, and selected option for Create new logic app workspace.":::

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

After you finish writing your code, compile to make sure that no build errors exist. Your function project automatically includes build tasks, which compile and then add your code to the **lib\custom** folder in your logic app project where workflows look for custom code to run. These tasks put the assemblies in the **lib\custom\net472** folder.

1. In Visual Studio Code, from the **Terminal** menu, select **New Terminal**.

1. From the working directory list that appears, select **Functions** as your current working directory for the new terminal.

   :::image type="content" source="media/create-run-custom-code-functions/compile-function-project.png" alt-text="Screenshot shows Visual Studio Code, prompt for current working directory, and selected Functions directory.":::

   Visual Studio Code opens a terminal window with a command prompt.

1. In the **Terminal** window, at the command prompt, enter **dotnet restore**.

   Visual Studio Code analyzes your projects and determines whether they're up-to-date.

   :::image type="content" source="media/create-run-custom-code-functions/dotnet-restore-complete.png" alt-text="Screenshot shows Visual Studio Code, Terminal window, and completed dotnet restore command.":::

1. After the command prompt reappears, enter **dotnet build**. Or, from the **Terminal** menu, select **Run Task**. From the task list, select **build (Functions)**.

   If your build succeeds, the **Terminal** window reports that the **Build succeeded**.

1. Confirm that the following items exist in your logic app project:

   - In your workspace, expand the folowing folders: **LogicApp** > **lib\custom** > **net472**. Confirm that the subfolder named **net472** contains the multiple assembly (DLL) files required to run your code, including a file named **<*function-name*>.dll**.

   - In your workspace, expand the folowing folders: **LogicApp** > **lib\custom** > **<*function-name*>**. Confirm that the subfolder named **<*function-name*>** contains a **function.json** file, which includes the metadata about the function code that you wrote. The workflow designer uses this file to determine the necessary inputs and outputs when calling your code.

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

   The action's information pane opens to the right.

   :::image type="content" source="media/create-run-custom-code-functions/default-workflow.png" alt-text="Screenshot shows Visual Studio Code, workflow designer, and default workflow with trigger and actions.":::

1. Review and confirm that the **Function Name** parameter value is set to the function that you want to run. Review or change any other parameter values that your function uses.

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

1. To manually run the Request trigger in your workflow, open the workflow's **Overview** page.

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

You can deploy your custom code in the same way that you deploy your logic app project. Whether you deploy from Visual Studio Code or use a CI/CD DevOps process, make sure that you build your code and that all dependent assemblies exist in the logic app project's **lib/custom/net472** folder before you deploy. For more information, see [Deploy Standard workflows from Visual Studio Code to Azure](create-single-tenant-workflows-visual-studio-code.md#deploy-azure).

## Troubleshoot problems

### Action information pane error

On the workflow designer, when you select the built-in action named **Call a local function in this logic app**, the action's information pane shows the following message:

`Failed to retrieve dynamic inputs. Error details: `

In this scenario, examine your logic app project to check whether the **LogicApp\lib\custom** folder is empty. If empty, from the **Terminal** menu, select **Run Task** > **build Functions**.

### No process with the specified name is currently running

If you get this error message when you run your workflow, you likely have the debugger process attached to .NET Functions, rather than to your logic app.

To fix this problem, from the **Run and Debug** list, select **Attach to logic app (LogicApp)**, and then select **Play** (green triangle).

### Package not imported correctly

If the Output window shows an error similar to the following message, make sure that you have .NET 6.0 installed. If you have this version installed, try uninstalling and then reinstalling.

`C:\Users\yourUserName\.nuget\packages\microsoft.net.sdk.functions\4.2.0\build\Microsoft.NET.Sdk.Functions.targets(83,5): warning : The ExtensionsMetadataGenerator package was not imported correctly. Are you missing 'C:\Users\yourUserName\.nuget\packages\microsoft.azure.webjobs.script.extensionsmetadatagenerator\4.0.1\build\Microsoft.Azure.WebJobs.Script.ExtensionsMetadataGenerator.targets' or 'C:\Users\yourUserName\.nuget\packages\microsoft.azure.webjobs.script.extensionsmetadatagenerator\4.0.1\build\Microsoft.Azure.WebJobs.Script.ExtensionsMetadataGenerator.props'? [C:\Desktop\...\custom-code-project\MyLogicAppWorkspace\Function\WeatherForecast.csproj] WeatherForecast -> C:\Desktop\...\custom-code-project\MyLogicAppWorkspace\Function\\bin\Debug\net472\WeatherForecast.dll C:\Users\yourUserName\.nuget\packages\microsoft.net.sdk.functions\4.2.0\build\Microsoft.NET.Sdk.Functions.Build.targets(32,5): error : It was not possible to find any compatible framework version [C:\Desktop\...\custom-code-project\MyLogicAppWorkspace\Function\WeatherForecast.csproj] C:\Users\yourUserName\.nuget\packages\microsoft.net.sdk.functions\4.2.0\build\Microsoft.NET.Sdk.Functions.Build.targets(32,5): error : The specified framework 'Microsoft.NETCore.App', version '6.0.0' was not found. [C:\Desktop\...\custom-code-project\MyLogicAppWorkspace\Function\WeatherForecast.csproj] C:\Users\yourUserName\.nuget\packages\microsoft.net.sdk.functions\4.2.0\build\Microsoft.NET.Sdk.Functions.Build.targets(32,5): error : - Check application dependencies and target a framework version installed at: [C:\Desktop\...\custom-code-project\MyLogicAppWorkspace\Function\WeatherForecast.csproj]`

### Build failures

If your function doesn't include variables, and you build your code, the Output window might show the following error messages:

`C:\Users\yourUserName\...\custom-code-project\Function\func.cs (24,64): error CS1031: Type expected [C:\Users\yourUserName\...\custom-code-project\Function\func.csproj]`<br>
`C:\Users\yourUserName\...\custom-code-project\Function\func.cs (24,64): error CS1001: Identifier expected [C:\Users\yourUserName\...\custom-code-project\Function\func.csproj]`

`Build FAILED.`

`C:\Users\yourUserName\...\custom-code-project\Function\func.cs (24,64): error CS1031: Type expected [C:\Users\yourUserName\...\custom-code-project\Function\func.csproj]`<br>
`C:\Users\yourUserName\...\custom-code-project\Function\func.cs (24,64): error CS1001: Identifier expected [C:\Users\yourUserName\...\custom-code-project\Function\func.csproj]`

`0 Warning(s)`<br>
`2 Error(s)`

To fix this problem, in your code's `Run` method, append the following parameter:

`string parameter1 = null`

The following example shows how the `Run` method signature appears:

`public static Task<Weather> Run([WorkflowActionTrigger] int zipCode, string temperatureScale, string parameter1 = null)`

## Next steps

[Create Standard workflows with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)
