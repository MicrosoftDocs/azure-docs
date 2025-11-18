---
title: Add and Run C# Scripts in Standard Workflows
description: Learn to write and run C# scripts to complete custom integration tasks with Standard workflows using Inline Code operations in Azure Logic Apps.
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, shahparth, azla
ms.topic: how-to
ms.date: 11/19/2025
# Customer intent: As an integration developer working with Azure Logic Apps, I want to write and run C# scripts to complete custom integration tasks with Standard workflows in Azure Logic Apps.
---

# Add and run C# scripts with Standard workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

To perform custom integration tasks inline with your Standard workflow in Azure Logic Apps, you can directly add and run C# scripts from within your workflow. For this task, use the **Inline Code** action named **Execute CSharp Script Code**. This action returns the results from your script so that you can use this output in your workflow's subsequent actions.

This capability provides the following benefits:

- Write your own scripts within the workflow designer so that you can solve more complex integration challenges without having to use Azure Functions. No other service plans are necessary.

  This benefit streamlines workflow development plus reduces the complexity and cost with managing more services.

- Generate a dedicated code file, which provides a personalized scripting space within your workflow.

- Deploy scripts alongside your workflows.

This guide shows how to add the action in your workflow and add the C# script code that you want to run.

## Prerequisites

* An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* The Standard logic app workflow where you want to add your C# script. The workflow must already start with a trigger. For more information, see [Create example Standard logic app workflows](create-single-tenant-workflows-azure-portal.md).

  You can use any trigger for your scenario, but as an example, this guide uses the **Request** trigger named **When an HTTP request is received** and also the **Response** action. The workflow runs when another application or workflow sends a request to the trigger's endpoint URL. The sample script returns the results from code execution as output that you can use in subsequent actions.

## Example scenarios

The following list describes some example scenarios where you can use a script to help with certain integration tasks:

- Parse and perform transformations or manipulations on a payload beyond the built-in expressions and data operations capabilities. For example, you can use a script to return a modified schema for downstream processing.

- Manage Azure resources such as virtual machines and start or step them, based on some business logic.

- Run a stored procedure on a SQL server that needs to run on a schedule and store the results on SharePoint.

- Log workflow errors with detailed information by saving to Azure Storage or to email or notify your team.

- Encrypt and decrypt data to comply with API security standards.

- Pass a file into the script to zip or unzip for an HTTP request.

- Aggregate data from various APIs and files to create daily reports

## Considerations

- The Azure portal saves your script as a C# script file (.csx) in the same folder as your **workflow.json** file, which stores the JSON definition for your workflow, and deploys the file to your logic app resource along with the workflow definition. Azure Logic Apps compiles this file to make the script ready for execution.

  The **.csx** file format lets you write less "boilerplate" and focus just on writing a C# function. You can rename the .csx file for easier management during deployment. However, each time you rename the script, the new version overwrites the previous version.

- The script is local to the workflow. To use the same script in other workflows, [view the script file in the **KuduPlus** console](#view-script-file), and then copy the script to reuse in other workflows.

## Limitations

| Name | Limit | Notes |
|------|-------|-------|
| Script run duration | 10 minutes | If you have scenarios that need longer durations, use the product feedback option to provide more information about your needs. |
| Output size | 100 MB | Output size depends on the output size limit for actions, which is generally 100 MB. |

## Add the Execute CSharp Script Code action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. In the designer, [follow these general steps to add the **Inline Code Operations** action named **Execute CSharp Script Code** to your workflow](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. After the action information pane opens, on the **Parameters** tab, in the **Code File** box, update the prepopulated sample code with your own script code.

   - At the top of the script, [import the necessary namespaces](#import-namespaces) and [add any required assembly references](#add-assembly-references) as usual.

   - Implement the **`Run`** method:

     - The **`Run`** method name is predefined, and your workflow executes only by calling this **Run** method at runtime.

     - To access data coming from your workflow, the **`Run`** method accepts this data through a parameter with  **WorkflowContext** type. You can use the **WorkflowContext** object for the following tasks:

       - [Access trigger outputs, preceding action outputs, and your workflow](#access-trigger-action-outputs).

       - [Access environment variables and logic app setting values](#access-environment-variables-app-settings).

     - To return the script's results or other data to your workflow, implement the **`Run`** method with a return type. For more information, see [Return data to your workflow](#return-data-to-workflow).

     - To log the output from your script in C#, implement the **`Run`** method to accept a function logger through a parameter with **`ILogger`** type, and use **`log`** as the argument name for easy identification. Avoid including **`Console.Write`** in your script.

       > [!IMPORTANT]
       > 
       > If you have a long-running script that requires graceful termination in case the function host shuts down, 
       > include a cancellation token, which is required, with your function logger.

       For more information, see the following sections:

       - [Log output to a stream](#log-output-stream).

       - [Log output to Application Insights](#log-output-application-insights).

   The following example shows the action's **Parameters** tab with the sample script code:

   :::image type="content" source="media/add-run-csharp-scripts/action-sample-script.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, Request trigger, Execute CSharp Script Code action with information pane open, and Response action. Information pane shows sample C# script." lightbox="media/add-run-csharp-scripts/action-sample-script.png":::

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
   /// Executes the inline C# code.
   /// </summary>
   /// <param name="context">The workflow context.</param>
   /// <remarks> The entry-point to your code. The function signature should remain unchanged.</remarks>
   public static async Task<Results> Run(WorkflowContext context, ILogger log)
   {
       var triggerOutputs = (await context.GetTriggerResults().ConfigureAwait(false)).Outputs;

       /// Dereferences the 'name' property from the trigger payload.
       var name = triggerOutputs?["body"]?["name"]?.ToString();

       /// To get the outputs from a preceding action, you can uncomment and repurpose the following code.
       // var actionOutputs = (await context.GetActionResults("<action-name>").ConfigureAwait(false)).Outputs;

       /// The following logs appear in the Application Insights traces table.
       // log.LogInformation("Outputting results.");
       // var name = null;

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

1. When you finish, save your workflow.

After you run your workflow, you can review the workflow output in Application Insights, if enabled. For more information, see [View logs in Application Insights](#view-logs-in-application-insights).

<a name="import-namespaces"></a>

## Import namespaces

To import namespaces, do so with the **`using`** clause as usual. The following list includes automatically imported namespaces, so they're optional for you to include in your script:

```text
System
System.Collections.Generic
System.IO
System.Linq
System.Net.Http
System.Threading.Tasks
Microsoft.Azure.WebJobs
Microsoft.Azure.WebJobs.Host
```

<a name="add-assembly-references"></a>

## Add references to external assemblies

To reference .NET Framework assemblies, use the **`#r "<assembly-name>`** directive, for example:

```csharp
/// Add the required libraries.
#r "Newtonsoft.Json"
#r "Microsoft.Azure.Workflows.Scripting"
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Workflows.Scripting;
using Newtonsoft.Json.Linq;

public static async Task<Results> Run(WorkflowContext context)
{
    <...>
}

public class Results
{
    <...>
}
```

The following list includes assemblies automatically added by the Azure Functions hosting environment:

```text
mscorlib
System
System.Core
System.Xml
System.Net.Http
Microsoft.Azure.WebJobs
Microsoft.Azure.WebJobs.Host
Microsoft.Azure.WebJobs.Extensions
System.Web.Http
System.Net.Http.Formatting
Newtonsoft.Json
```

<a name="reuse-csx-files"></a>

## Include other .csx files

If you have existing .csx files, you can use the classes and methods from those files in your **Execute CSharp Script Code** action. For this task, you can use the `#load` directive in your *execute_csharp_code.csx* file. This directive works only with .csx files, not .cs files. You have the following options:

- Load a .csx file directly into your action.

  The .csx file must exist in the same folder as the workflow that contains the **Execute CSharp Script Code** action. See [Load .csx directly](#load-directly).

- Reference a .csx file that exists in a shared folder for your logic app.

  The shared folder must exist in the `site/wwwroot/` folder path for your logic app. See [Reference .csx file in a shared folder](#reference-from-shared-folder).

<a name="load-directly"></a>

### Load .csx file directly

The following example *execute_csharp_code.csx* file shows how to load a script file named *loadscript.csx* into an **Execute CSharp Script Code** action using the `#load` directive:

```csharp
// Add the required libraries
#r "Newtonsoft.Json"
#r "Microsoft.Azure.Workflows.Scripting"
#load "loadscript.csx"
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Workflows.Scripting;
using Newtonsoft.Json.Linq;

/// <summary>
/// Execute the inline C# code.
/// </summary>
/// <param name="context">The workflow context.</param>
/// <remarks> This is the entry-point to your code. The function signature should remain unchanged.</remarks>
public static async Task<Results> Run(WorkflowContext context, ILogger log)
{
    var name = RunScript().ToString();
    return new Results
    {
        Message = !string.IsNullOrEmpty(name) ? $"Hello {name} from CSharp action" : "Hello from CSharp action."
    };
}
```

<a name="reference-from-shared-folder"></a>

### Reference .csx file in a shared folder

You can use the `#load` directive to reference a .csx file that exists in a shared folder for your logic app resource. This `shared` folder must exist in the `site/wwwroot/` folder path for your logic app resource.

To add the script file to the `shared` folder, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app sidebar, under **Development Tools**, select **Advanced Tools**.

1. On the **Advanced Tools** page, select **Go**, which opens the **Kudu+** console.

1. Open the **Debug console** menu, and select **CMD**.

1. Go to your logic app's root location: **site/wwwroot**

1. Go to the **shared** folder. If this folder doesn't exist, create the folder.

   1. On the toolbar, next to the folder name, select the plus sign (**+**), then select **New folder**.

   1. Enter `shared` for the folder name.

   1. Open the new `shared` folder.

1. Drag the script file to import into the `shared` folder.

The following example *execute_csharp_code.csx* file shows how to reference the uploaded script file named *importcript.csx* into an **Execute CSharp Script Code** action using the `#load` directive:

```csharp
// Add the required libraries
#r "Newtonsoft.Json"
#r "Microsoft.Azure.Workflows.Scripting"
#load "..\shared\importscript.csx"
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Workflows.Scripting;
using Newtonsoft.Json.Linq;

/// <summary>
/// Execute the inline C# code.
/// </summary>
/// <param name="context">The workflow context.</param>
/// <remarks> This is the entry-point to your code. The function signature should remain unchanged.</remarks>
public static async Task<Results> Run(WorkflowContext context, ILogger log)
{
    var name = RunScript().ToString();
    return new Results
    {
        Message = !string.IsNullOrEmpty(name) ? $"Hello {name} from CSharp action" : "Hello from CSharp action." 
    }; 
} 
```

## Import NuGet packages

[NuGet](/nuget/what-is-nuget) is a Microsoft-supported way to create, publish, host, discover, consume, and share .NET code libraries called *packages*. The **Execute CSharp Script Code** action supports the capability to import NuGet packages by using a *function.prof* file, located at the root of the workflow folder, for example:

`site/wwwroot/<workflow-name>/workflow.json`<br>
`site/wwwroot/<workflow-name>/function.proj`

For example, you can use the following *function.proj* file to import NuGet packages into your **Execute CSharp Script Code** action:

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
       <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
    <ItemGroup>
        <PackageReference Include="Serilog" Version="4.3.0" />
        <PackageReference Include="Serilog.Sinks.Console" Version="6.0.0" />
        <PackageReference Include="Serilog.Sinks.File" Version="7.0.0" />
     </ItemGroup>
</Project>
```

- For a C# script (.csx) file, you must set `TargetFramework` to `netstandard2.0`.

  This requirement doesn't mean that package versions are limited to `netstandard2.0`. You can still reference packages for `net6.0` and later.

- When the *function.proj* file initializes, you must restart the logic app so that the Azure Logic Apps runtime can recognize and consume the file.

After restart completes, the runtime automatically gets the required assemblies from NuGet.org and puts the assembly in the appropriate folder for your script to use. Although you don't need to manually load these assemblies, make sure to directly reference the packages in your code by using standard `using` statements, for example:

```csharp
using System.Net;
using Newtonsoft.Json;
using Serilog;

public static async Task<Output> Run(WorkflowContext context)
{
    Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .CreateLogger();

    // Write log messages
    Log.Information("Hello, Serilog with Console sink!");
    Log.Warning("This is a warning message.");

    var outputReturn = new Output()
    { 
        Message = "Utilizing my serilog logger."
    }; 

    return outputReturn;
} 

public class Output
{ 
    public string Message { get; set; }
} 
```

<a name="log-output-stream"></a>

## Log output to a stream

In your **`Run`** method, include a parameter with **`ILogger`** type and **`log`** as the name, for example:

```csharp
public static void Run(WorkflowContext context, ILogger log)
{
    log.LogInformation($"C# script successfully executed.");
}
``` 

<a name="log-output-application-insights"></a>

## Log output to Application Insights

To create custom metrics in Application Insights, use the **`LogMetric`** extension method on **`ILogger`**.

The following example shows a sample method call: 

`logger.LogMetric("TestMetric", 1234);`

<a name="access-trigger-action-outputs"></a>

## Access workflow trigger and action outputs in your script

To access data from your workflow, use the following methods available for the **`WorkflowContext`** context object:

- **`GetTriggerResults`** method

  To access trigger outputs, use this method to return an object that represents the trigger and its outputs, which are available through the **`Outputs`** property. This object has **JObject** type, and you can use the square brackets (**[]**) as an indexer to access various properties in the trigger outputs.

  The following example gets the data from the **`body`** property in the trigger outputs:

  ```csharp
  public static async Task<Results> Run(WorkflowContext context, ILogger log)
  {

      var triggerOutputs = (await context.GetTriggerResults().ConfigureAwait(false)).Outputs;
      var body = triggerOutputs["body"];

      return new Results;

  }

  public class Results
  {
      <...>
  }
  ```

- **`GetActionResults`** method

  To access action outputs, use this method to return an object that represents the action and its outputs, which are available through the **`Outputs`** property. This method accepts an action name as a parameter. The following example gets the data from the **`body`** property in the outputs from an action named *action-name*:

  ```csharp
  public static async Task<Results> Run(WorkflowContext context, ILogger log)
  {

      var actionOutputs = (await context.GetActionResults("action-name").ConfigureAwait(false)).Outputs;
      var body = actionOutputs["body"];

      return new Results;

  }

  public class Results
  {
      <...>
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

For this task, implement your **`Run`** method with a return type and **`return`** statement. If you want an asynchronous version, implement the **`Run`** method with a **`Task<return-type>`** attribute and the **`async`** keyword. The return value is set to the script action's outputs **`body`** property, which any subsequent workflow actions can then reference.

The following example shows a **`Run`** method with a **`Task<Results>`** attribute, the **`async`** keyword, and a **`return`** statement:

```csharp
public static async Task<Results> Run(WorkflowContext context, ILogger log)
{
    return new Results
    {
        Message = !string.IsNullOrEmpty(name) ? $"Returning results with status message."
    };
}

public class Results
{
    public string Message {get; set;}
}
```

<a name="view-script-file"></a>

## View the script file

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource that has the workflow you want.

1. On the logic app sidebar, under **Development Tools**, select **Advanced Tools**.

1. On the **Advanced Tools** page, select **Go**, which opens the **KuduPlus** console.

1. Open the **Debug console** menu, and select **CMD**.

1. Go to your logic app's root location: **site/wwwroot**

1. Go to your workflow's folder, which contains the .csx file, along this path: **site/wwwroot/{workflow-name}**

1. Next to the file name, select **Edit** to open and view the file.

## View logs in Application Insights

1. In the [Azure portal](https://portal.azure.com), on the logic app sidebar, under **Settings**, select **Application Insights**. Select your logic app.

1. On the **Application Insights** sidebar, under **Monitoring**, select **Logs**.

1. Create a query to find any traces or errors from your workflow execution, for example:

   ```text
   union traces, errors
   | project TIMESTAMP, message
   ```

## Compilation errors

In this release, the web-based editor includes limited IntelliSense support, which is still under improvement. Any compilation errors are detected when you save your workflow, and the Azure Logic Apps runtime compiles your script. These errors appear in your logic app's error logs.

## Runtime errors

If an error happens when your script executes, Azure Logic Apps performs these steps:

- Passes the error back to your workflow.
- Marks the script action as **Failed**.
- Provides an error object that represents the exception thrown from your script.

The following example shows a sample error:

**The function 'CSharp_MyLogicApp-InvalidAction_execute_csharp_script_code.csx' failed with the error 'The action 'nonexistent' does not exist in the workflow.' when executing. Please verify function code is valid.**

## Example scripts

The following example scripts perform various tasks that you might

### Decompress a ZIP file with text files from an HTTP action into a string array

```csharp
// Add the required libraries.
#r "Newtonsoft.Json"
#r "Microsoft.Azure.Workflows.Scripting"
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Azure.Workflows.Scripting;
using System;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Collections.Generic;

/// <summary>
/// Executes the inline C# code.
/// </summary>
/// <param name="context">The workflow context.</param>
public static async Task<List<string>> Run(WorkflowContext context)
{

    var outputs = (await context.GetActionResults("HTTP_1").ConfigureAwait(false)).Outputs;
    var base64zipFileContent = outputs["body"]["$content"].ToString();

    // Decode base64 to bytes.
    byte[] zipBytes = Convert.FromBase64String(base64zipFileContent);

    List<string> fileContents = new List<string>();

    // Creates an in-memory stream from the zip bytes.
    using (MemoryStream zipStream = new MemoryStream(zipBytes))
    {

        // Extracts files from the zip archive.
        using (ZipArchive zipArchive = new ZipArchive(zipStream))
        {

            foreach (ZipArchiveEntry entry in zipArchive.Entries)
            {

                // Read each file's content.
                using (StreamReader reader = new StreamReader(entry.Open()))
                {
                    string fileContent = reader.ReadToEnd();
                    fileContents.Add(fileContent);
                }
            }
        }
    }

    return fileContents;
}
```

### Encrypt data using a key from app settings

```csharp
// Add the required libraries.
#r "Newtonsoft.Json"
#r "Microsoft.Azure.Workflows.Scripting"
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Azure.Workflows.Scripting;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

/// <summary>
/// Executes the inline csharp code.
/// </summary>
/// <param name="context">The workflow context.</param>
public static async Task<string> Run(WorkflowContext context)
{

    var compose = (await context.GetActionResults("compose").ConfigureAwait(false)).Outputs;
    var text = compose["sampleData"].ToString();

    return EncryptString(text);

}

public static string EncryptString(string plainText)
{

    var key = Environment.GetEnvironmentVariable("app-setting-key");
    var iv = Environment.GetEnvironmentVariable("app-setting-iv");

    using (Aes aesAlg = Aes.Create())
    {

        aesAlg.Key = Encoding.UTF8.GetBytes(key);
        aesAlg.IV = Encoding.UTF8.GetBytes(iv);
        ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

        using (MemoryStream msEncrypt = new MemoryStream())
        {

            using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
            {

                using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                {
                    swEncrypt.Write(plainText);
                }

            }

             return Convert.ToBase64String(msEncrypt.ToArray());

        }
    }
}
```

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
