---
title: Add and run C# scripts in Standard workflows
description: Write and run C# scripts inline from Standard workflows to perform custom integration tasks using Inline Code operations in Azure Logic Apps.
ms.service: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, azla
ms.topic: how-to
ms.date: 06/10/2024
# Customer intent: As a logic app workflow developer, I want to write and run my own C# scripts so that I can perform custom integration tasks in Standard workflows for Azure Logic Apps.
---

# Add and run C# scripts inline with Standard workflows for Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To perform custom integration tasks inline with your Standard workflow in Azure Logic Apps, you can directly add and run simple C# scripts from your workflow in the Azure portal. For this task, use the **Inline Code** action named **Execute CSharp Script Code**. This action returns the result from the script so you can use that output in your workflow's subsequent actions.

This capability provides the following benefits:

- Write your own scripts to solve more complex integration problems without having to separately provision Azure Functions.

  This benefit streamlines workflow development plus reduces the complexity and cost with managing more services.

- Deploy scripts alongside your workflows. No other service plans are necessary.

This guide shows how to add the action in your workflow and add the C# script code that you want to run.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The Standard logic app workflow where you want to add your C# script. The workflow must already start with a trigger. For more information, see [Create example Standard logic app workflows](create-single-tenant-workflows-azure-portal.md).

  You can use any trigger for your scenario, but as an example, this guide uses the **Request** trigger named **When a HTTP request is received** and also the **Response** action. The workflow runs when another application or workflow sends a request to the trigger's endpoint URL. The sample script returns the results from code execution as output that you can use in subsequent actions.

## Example scenarios

The following list describes some example scenarios where you can use a script helps with certain integration tasks:

- You have a payload where you want to parse and perform transformations or manipulations beyond built-in expressions and data operations capabilities. For example, you can use a script to return a modified schema for downstream processing.

- Manage Azure resources such as virtual machines and start or step them, based on some business logic.

- Run a stored procedure on a SQL server that needs to run on a schedule and store the results on SharePoint.

- Log workflow errors with detailed information by saving to Azure Storage or to email or notify your team.

- Encrypt and decrypt data to comply with API security standards.

- Pass a file into the script to zip or unzip for an HTTP request.

- Aggregate data from various APIs and files to create daily reports

## Considerations

- The Azure portal saves your script as a C# script file (.csx) in the same folder as your **workflow.json** file, which stores the JSON definition for your workflow, and deploys the file to your logic app resource along with the workflow definition. Azure Logic Apps compiles this file to make the script ready for execution.

  The .csx file format lets you write less "boilerplate" and focus just on writing a C# function. You can rename the .csx file for easier management during deployment. However, each time you rename the script, the new version overwrites the previous version.

- The script is local to the workflow. To use the same script in other workflows, [view the script file in the **KuduPlus** console](#view-script-file), and then copy the script to reuse in other workflows.

## Limitations

| Name | Limit | Notes |
|------|-------|-------|
| Script run duration | 10 minutes | If you have scenarios that need longer durations, use the product feedback option to provide more information abour your needs. |
| Output size | 100 MB | Output size depends on the output size limit for actions, which is generally 100 MB.

## Add the Execute CSharp Script Code action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. In the designer, [follow these general steps to add the **Inline Code Operations** action named **Execute CSharp Script Code action** to your workflow](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. After the action information pane opens, on the **Parameters** tab, in the **Code File** box, update the prepopluated sample code with your own script code.

   - At the top of the script, [import the necessary namespaces](#import-namespaces) and [add required assembly references](#add-assembly-references) as usual. You can also [add private modules](#add-private-modules), if needed.

   - Implement the **`Run`** method:

     - The **`Run`** method name is predefined, and your workflow executes only by calling this **Run** method at runtime.

     - To access data coming from your workflow, the **`Run`** method accepts this data through a parameter with  **WorkflowContext** type. You can use the **WorkflowContext** object for the following tasks:

       - [Access trigger outputs, preceding action outputs, and your workflow](#access-trigger-action-outputs).

       - [Access environment variables and logic app setting values](#access-environment-variables-app-settings).

     - To return the script's results or other data to your workflow, implement the **`Run`** method with a return type. If you want an asynchronous version, implement the **`Run`** method as a **`Task<>`**, and set the return value to the script action's outputs body, which any subsequent workflow actions can then reference. For more information, see [Return data to your workflow](#return-data-to-workflow).

     - To log the output from your script in C#, implement the **`Run`** method to accept a function logger through a parameter with **`ILogger`** type, and use **`log`** as the argument name for easy identification. Avoid including **`Console.Write`** in your script.

       > [!IMPORTANT]
       > 
       > If you have a long-running script that requires graceful termination in case the function host shuts down, 
       > include a cancellation token, which is required, with your function logger.

       For more information, see [Log output to a streaming log or Application Insights](#log-output).

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

To find and view the C# script file (.csx), follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource that has the workflow you want.

1. On the logic app resource menu, under **Development Tools**, select **Advanced Tools**.

1. On the **Advanced Tools** page, select **Go**, which opens the **KuduPlus** console.

1. Open the **Debug console** menu, and select **CMD**.

1. Browse to the following folder location, which contains the .csx file: **site/wwwroot/{workflow-name}**

1. Next to the file name, select **Edit** to open and view the file.

<a name="import-namespaces"></a>

## Import namespaces

To import namespaces, do so with the **`using`** clause as usual. The following list includes an automatically imported namespaces, so they're optional for you to include in your script:

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
public static async Task<Results> Run(WorkflowContext context, ILogger log)
```

The following list includes automatically assemblies that are add by the Azure Functions hosting environment:

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

<a name="Add-private-modules"></a>

## Add private modules

If necessary, you can add and store custom modules at the logic app level by using the **KuduPlus** console. In your logic app's directory, at the root level, you can add an **Modules** folder where you can create another folder with your module's name. Here, you can add a PowerShell module (.psm1) file. At your logic app's root level, you can also add any PowerShell manifest (.psd1) files that you might want to use, such as a **`requirements.psd1`** file.

To go to your logic app's directory, [follow the same steps to find your script's .csx file in the **KuduPlus** console](#view-script-file).

Here is an example folder and file structure:

```text
| Modules
  || HelloWorldModule
     ||| HelloWorldModule.psm1
     ||| HelloWorldModule.psd1
| MyLogicApp
  || workflow.json
| host.json
| requirements.psd1
```

<a name="access-trigger-action-outputs"></a>

## Access workflow trigger and action outputs in your script

The **`WorkflowContext`** context object has the following methods that you can use to access the data from your workflow:

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

Your **`Run`** method can have a return type. If you want an async version, the method can also be a **`Task<>`**, so that the return value is set as the script action's outputs body, which any subsequent workflow actions can reference.

        ```csharp
        public static void Run(WorkflowContext context, ILogger log)
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

        -or-

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

<a name="log-output"></a>

## Log output to streaming log or Application Insights

To log output to your streaming logs in C#, include an argument with **`ILogger`**  type. We recommend that you name it log. Avoid using Console.Write in in your script.


public static void Run(WorkflowContext context, ILogger log) 

{ 

    log.LogInformation($"C# script has executed successfully"); 

} 

 

Custom metrics logging 

You can use the LogMetric extension method on ILogger to create custom metrics in Application Insights. Here's a sample method call: 

 logger.LogMetric("TestMetric", 1234); 

## Compilation errors

The web-based editor has limited IntelliSense support at this time, and we are working on improving as we make this capability generally available. Any compilation error will hence be detected at save time when the logic app runtime compiles the script. These errors will appear in the error-logs of your logic

## Runtime errors

Any error that happens at execution time in the script will propagate back to the workflow and the script action will be marked as failed with the error object representing the exception that was thrown from your script.

 A screenshot of a computer

Description automatically generated

## Example scripts

Uncompressing a ZIP file containing multiple text files retrieved from an HTTP action into an array of strings

// Add the required libraries

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

/// Executes the inline csharp code.

/// </summary>

/// <param name="context">The workflow context.</param>

public static async Task<List<string>> Run(WorkflowContext context)

{

  var outputs = (await context.GetActionResults("HTTP_1").ConfigureAwait(false)).Outputs;

  var base64zipFileContent = outputs["body"]["$content"].ToString();



  // Decode base64 to bytes

  byte[] zipBytes = Convert.FromBase64String(base64zipFileContent);



  List<string> fileContents = new List<string>();

  // Create an in-memory stream from the zip bytes

  using (MemoryStream zipStream = new MemoryStream(zipBytes))

  {

      // Extract files from the zip archive

      using (ZipArchive zipArchive = new ZipArchive(zipStream))

      {

          foreach (ZipArchiveEntry entry in zipArchive.Entries)

          {

              // Read each file's content

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



Encrypt Data using a key from App-Settings



// Add the required libraries

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

## WorkflowContext Class

Represents the context of a workflow.

Methods

Task<WorkflowOperationResult> GetActionResult(string actionName)
Gets the result of a specific action within the workflow.

Parameters

actionName
The name of the action.

Returns

A Task representing the asynchronous operation. The task result contains a WorkflowOperationResult object.

Task<WorkflowOperationResult> RunTriggerResult()
Gets the result of the workflow trigger.

Returns

A Task representing the asynchronous operation. The task result contains a WorkflowOperationResult object with the following properties:

WorkflowOperationResult Class

Represents the result of a workflow operation.

Properties

string Name
Gets or sets the operation name.

JToken Inputs
Gets or sets the operation execution inputs.

JToken Outputs
Gets or sets the operation execution outputs.

DateTime? StartTime
Gets or sets the operation start time.

DateTime? EndTime
Gets or sets the operation end time.

string OperationTrackingId
Gets or sets the operation tracking id.

string Code
Gets or sets the status code of the action.

string Status
Gets or sets the status of the action.

JToken Error 
Gets or sets the error of the action

JToken TrackedProperties 
Gets or sets the tracked properties of the action

## Related content

[Add and run JavaScript code snippets](add-run-javascript.md)