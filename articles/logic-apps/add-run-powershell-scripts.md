---
title: Add and run PowerShell in Standard workflows
description: Write and run PowerShell inline from Standard workflows to perform custom integration tasks using Inline Code operations in Azure Logic Apps.
ms.service: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, azla
ms.topic: how-to
ms.date: 06/10/2024
# Customer intent: As a logic app workflow developer, I want to write and run PowerShell so that I can perform custom integration tasks in Standard workflows for Azure Logic Apps.
---

# Add and run PowerShell scripts inline with Standard workflows for Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To perform custom integration tasks inline with your Standard workflow in Azure Logic Apps, you can directly add and run PowerShell from your workflow in the Azure portal. For this task, use the **Inline Code** action named **Execute PowerShell Code**. This action returns the result from your PowerShell code so you can use that output in your workflow's subsequent actions.

This capability provides the following benefits:

- Write your own scripts within the workflow designer to solve complex integration challenges. No other service plans are necessary.

  This benefit streamlines workflow development plus reduces the complexity and cost with managing more services.

- Generate a dedicated code file, which provides a personalized scripting space within your workflow.

- Integrate with [Azure Functions PowerShell Functions](../azure-functions/functions-reference-powershell.md), which provides powerful functionality and inheritance for advanced task execution.

- Deploy scripts alongside your workflows.

This guide shows how to add the action in your workflow and add the PowerShell script code that you want to run.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The Standard logic app workflow where you want to add your PowerShell script. The workflow must already start with a trigger. For more information, see [Create example Standard logic app workflows](create-single-tenant-workflows-azure-portal.md).

  You can use any trigger for your scenario, but as an example, this guide uses the **Request** trigger named **When a HTTP request is received** and also the **Response** action. The workflow runs when another application or workflow sends a request to the trigger's endpoint URL. The sample script returns the results from code execution as output that you can use in subsequent actions.

## Considerations

- The Azure portal saves your script as a PowerShell script file (.csx) in the same folder as your **workflow.json** file, which stores the JSON definition for your workflow, and deploys the file to your logic app resource along with the workflow definition. Azure Logic Apps compiles this file to make the script ready for execution.

  The .csx file format lets you write less "boilerplate" and focus just on writing a PowerShell function. You can rename the .csx file for easier management during deployment. However, each time you rename the script, the new version overwrites the previous version.

- The script is local to the workflow. To use the same script in other workflows, [view the script file in the **KuduPlus** console](#view-script-file), and then copy the script to reuse in other workflows.

## Limitations

| Name | Limit | Notes |
|------|-------|-------|
| Script run duration | 10 minutes | If you have scenarios that need longer durations, use the product feedback option to provide more information about your needs. |
| Output size | 100 MB | Output size depends on the output size limit for actions, which is generally 100 MB. |

## Add the Execute PowerShell Code action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. In the designer, [follow these general steps to add the **Inline Code Operations** action named **Execute PowerShell Code action** to your workflow](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. After the action information pane opens, on the **Parameters** tab, in the **Code File** box, update the prepopluated sample code with your own script code.

   - At the top of the script, [import the necessary namespaces](#import-namespaces) and [add any required assembly references](#add-assembly-references) as usual.

   - Implement the **`Run`** method:

     - The **`Run`** method name is predefined, and your workflow executes only by calling this **Run** method at runtime.

     - To access data coming from your workflow, the **`Run`** method accepts this data through a parameter with  **WorkflowContext** type. You can use the **WorkflowContext** object for the following tasks:

       - [Access trigger outputs, preceding action outputs, and your workflow](#access-trigger-action-outputs).

       - [Access environment variables and logic app setting values](#access-environment-variables-app-settings).

     - To return the script's results or other data to your workflow, implement the **`Run`** method with a return type. For more information, see [Return data to your workflow](#return-data-to-workflow).

     - To log the output from your script in PowerShell, implement the **`Run`** method to accept a function logger through a parameter with **`ILogger`** type, and use **`log`** as the argument name for easy identification. Avoid including **`Console.Write`** in your script.

       > [!IMPORTANT]
       > 
       > If you have a long-running script that requires graceful termination in case the function host shuts down, 
       > include a cancellation token, which is required, with your function logger.

       For more information, see the following sections:

       - [Log output to a stream](#log-output-stream).

       - [Log output to Application Insights](#log-output-application-insights).

   The following example shows the action's **Parameters** tab with the sample script code:

   :::image type="content" source="media/add-run-csharp-scripts/action-sample-script.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, Request trigger, Execute CSharp Script Code action with information pane open, and Response action. Information pane shows sample PowerShell script." lightbox="media/add-run-csharp-scripts/action-sample-script.png":::

   The following example shows the sample script code:

   ```csharp
   /// Add the required libraries.
   #r "Newtonsoft.Json"
   #r "Microsoft.Azure.Workflows.Scripting"
   using Microsoft.AspNetCore.Mvc;
   using Microsoft.Extensions.Primitives;
   using Microsoft.Extensions.Logging;
   using Microsoft.Azure.Workflows.Scripting;
   using Newtonsoft.Json.Linq;

   /// <summary>
   /// Executes the inline PowerShell code.
   /// </summary>
   /// <param name="context">The workflow context.</param>
   /// <remarks> The entry-point to your code. The function signature should remain unchanged.</remarks>
   public static async Task<Results> Run(WorkflowContext context, ILogger log)
   {
       var triggerOutputs = (await context.GetTriggerResults().ConfigureAwait(false)).Outputs;

       /// Dereferences the 'name' property from the trigger payload.
       var name = triggerOutputs?["body"]?["name"]?.ToString();

       /// To get the outputs from a preceding action, you can uncomment and repurpose the following code.
       //var actionOutputs = (await context.GetActionResults("<action-name>").ConfigureAwait(false)).Outputs;

       /// The following logs appear in the Application Insights traces table.
       //log.LogInformation("Outputting results.");

       /// var name = null;

       return new Results
       {
           Message = !string.IsNullOrEmpty(name) ? $"Hello {name} from CSharp action" : "Hello from CSharp action."
       };
   }

   public class Results
   {
       public string Message {get; set;}
   }
   ```

   For more information, see ["#r" - Reference external assemblies](/azure/azure-functions/functions-reference-csharp?tabs=functionsv2%2Cfixed-delay%2Cazure-cli#referencing-external-assemblies).

1. When you're done, save your workflow.

<a name="view-script-file"></a>

## View the script file

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource that has the workflow you want.

1. On the logic app resource menu, under **Development Tools**, select **Advanced Tools**.

1. On the **Advanced Tools** page, select **Go**, which opens the **KuduPlus** console.

1. Open the **Debug console** menu, and select **CMD**.

1. Go to your logic app's root location: **site/wwwroot**

1. Go to your workflow's folder, which contains the .csx file, along this path: **site/wwwroot/{workflow-name}**

1. Next to the file name, select **Edit** to open and view the file.

## Custom commandlets

### Get-TriggerOutput

Gets the output from the workflow's trigger.

#### Syntax

```azurepowershell
`Get-TriggerOutput`
```

#### Parameters

None.

### Get-ActionOutput

Gets the output from another action in the workflow. This object is returned as a **PowershellWorkflowOperationResult**.

#### Syntax

```azurepowershell
Get-ActionOutput [ -ActionName <String> ]
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **ActionName** | String | The name of the action in the workflow with the output that you want to reference. |

### Push-WorkflowOutput

Pushes an output to the workflow from the **Execute PowerShell Code** action. Please note values from Write-Host/Write-Debug/Write-Output will not be returned to the workflow. Returning a value with a ‘return’ statement will also not be returned to the workflow. Those commandlets can be used to write trace messages that can be viewed within application insights.  

#### Syntax

```azurepowershell
Push-WorkflowOutput [-Output <Object>] [-Clobber]  
```
#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **Output** | Varies. | The output that you want to return to the workflow. This output can have any type. |
| **Clobber** | Varies. | An optional switch parameter that you can use to override the previously pushed output. |

<a name="access-trigger-action-outputs"></a>

## Access workflow trigger and action outputs in your script

To access data from your workflow, use the following methods available for the **`WorkflowContext`** context object:

- **`GetTriggerResults`** method

  To access trigger outputs, use this method to return an object that represents the trigger and its outputs, which are available through the **`Outputs`** property. This object has **JObject** type, and you can use square brackets (**[]**) indexer to access various properties in the trigger outputs.

  For example, the following sample code gets the data from the **`body`** property in the trigger outputs:

  ```csharp
  public static async Task<Results> Run(WorkflowContext context, ILogger log)
  {
      var triggerOutputs = (await context.GetTriggerResults().ConfigureAwait(false)).Outputs;
      var body = triggerOutputs["body"];
  }
  ```

- **`GetActionResults`** method

  To access action outputs, use this method to return an object that represents the action and its outputs, which are available through the **`Outputs`** property. This method accepts an action name as a parameter, for example:

  ```csharp
  public static async Task<Results> Run(WorkflowContext context, ILogger log)
  {

      var actionOutputs = (await context.GetActionResults("actionName").ConfigureAwait(false)).Outputs;
      var body = actionOutputs["body"];
  }
  ```

<a name="access-environment-variables-app-settings"></a>

## Access environment variables or app setting value

To get an environment variable or an app setting value, use the **`System.Environment.GetEnvironmentVariable`** method, for example:

```csharp
public static void Run(WorkflowContext context, ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
    log.LogInformation(GetEnvironmentVariable("AzureWebJobsStorage"));
    log.LogInformation(GetEnvironmentVariable("WEBSITE_SITE_NAME"));
}

public static string GetEnvironmentVariable(string name)
{
    return name + ": " +
    System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
}
```

<a name="return-data-to-workflow"></a>

## Return data to your workflow



<a name="log-output-application-insights"></a>

## View logs in Application Insights

To view the logs from your workflow, follow these steps:

1. In the Azure portal, on the logic app resource menu, under **Settings**, select **Application Insights**, and then select your logic app.

1. On the **Application Insights** menu, under **Monitoring**, select **Logs**.

1. Create a query to find any traces or errors from your workflow execution, for example:

   ```text
   union traces, errors
   | project TIMESTAMP, message
   ```

## Private modules



## Public modules

You can find public modules hosted in the [PowerShell gallery](https://www.powershellgallery.com). A Standard logic app resource can support up to 10 public modules. To use any public module, you must enable this capability by following these steps, although the first step is already enabled by default:

1. opening the workflow's **host.json** file and setting the **managed dependency** property to **true**, which is enabled by default in a logic app, for example:

```javascript
{

    "managedDependency": {

        "enabled": true

    }

}
```

1. Next go to advanced tools in your logic apps panel. And go to Kudu and go to the app root level of your Logic App (C:\home\site\wwwroot). Click on the requirements.psd1 file and include the name and version of the module you are trying to reference. The supported syntax is MajorNumber.* or exact module version, as shown in the following requirements.psd1 example: Here is an example:  

@{ 

Az = '1.*' 

SqlServer = '21.1.18147' 

} 

### Considerations for public modules

If you use dependency management, the following considerations apply:

- To download modules, public modules require access to the [PowerShell Gallery](https://www.powershellgallery.com). If you're running a logic app locally, make sure that the Azure Logic Apps runtime can access the gallery's URL (`https://www.powershellgallery.com`) by adding any required firewall rules.

- Managed dependencies currently don't support modules that require you to accept a license, either by accepting the license interactively or by providing the **-AcceptLicense** option when you run **Install-Module**.

## Compilation errors

In this release, the web-based editor includes limited IntelliSense support, which is still under improvement. Any compilation errors are detected when you save your workflow, and the Azure Logic Apps runtime compiles your script. These errors appear in your logic app's error logs.

## Runtime errors

### A workflow action doesn't return any output.

Make sure that you use **Push-WorkflowOutput**.

### Execute PowerShell Code action fails: "The term 'Hello-World' is not recognized..."

The following error happens if you incorrectly add your module to the **requirements.psd1** file or when your private module doesn't exist in the following path: **C:\home\site\wwwroot\Modules\{moduleName}.

**The term 'Hello-World' is not recognized as a name of a cmdlet, function, script file, or executable program. Check the spelling of the name or if a path was included, verify the path is correct and try again.**

### Execute PowerShell Code action fails: "Cannot bind argument to parameter 'Output' because it is null."

This error happens when you try to push a null object to the workflow. Confirm whether the object that you're sending with **Push-WorkflowOutput** is null.

## WorkflowContext class

Represents a workflow context.

### Methods

#### GetActionResult(string actionName)

Gets the result from a specific action in the workflow.

The asynchronous version uses [**Task<>**](/dotnet/api/system.threading.tasks.task-1) as the return type, for example:

`Task<WorkflowOperationResult> GetActionResult(string actionName)`

##### Parameters

**`actionName`**: The action name.

##### Returns

The asynchronous version returns a **`Task`** object that represents the asynchronous operation. The task result contains a **`WorkflowOperationResult`** object. For information about the **WorkflowOperationResult** object properties, see [WorkflowOperationResult class](#workflowoperationresult-class).

#### RunTriggerResult()

Gets the result from the trigger in the workflow.

The asynchronous version uses [**Task<>**](/dotnet/api/system.threading.tasks.task-1) as the return type, for example:

`Task<WorkflowOperationResult> RunTriggerResult()`

##### Parameters

None.

##### Returns

The asynchronous version returns a **`Task`** object that represents the asynchronous operation. The task result contains a **`WorkflowOperationResult`** object. For information about the **WorkflowOperationResult** object properties, see [WorkflowOperationResult class](#workflowoperationresult-class).

<a name="workflowoperationresult-class"></a>

## WorkflowOperationResult class

Represents the result from a workflow operation.

### Properties

| Name | Type | Description |
|------|------|-------------|
| **Name** | String | Gets or sets the operation name. |
| **Inputs** | JToken | Gets or sets the operation execution inputs. |
| **Outputs** | JToken | Gets or sets the operation execution outputs. |
| **StartTime** | DateTime? | Gets or sets the operation start time. |
| **EndTime** | DateTime? | Gets or sets the operation end time. |
| **OperationTrackingId** | String | Gets or sets the operation tracking ID. |
| **Code** | String | Gets or sets the status code for the action. |
| **Status** | String | Gets or sets the status for the action. |
| **Error** | JToken | Gets or sets the error for the action. |
| **TrackedProperties** | JToken | Gets or sets the tracked properties for the action. |

## Related content

[Add and run JavaScript code snippets](add-run-javascript.md)
