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

1. After the action information pane opens, on the **Parameters** tab, in the **Code File** box, update the prepopluated sample code with your own script code. Make sure to define the **Run** method and include any necessary assembly references and namespaces at the top of the file.

   The **Run** method name is predefined, and your workflow executes only by calling this **Run** method at runtime. Data from your workflow flows into the **Run** method through the parameter that has **WorkflowContext** type. The **WorkflowContext** object not only gives your code access to outputs from the trigger, any preceding actions, and the workflow, you can also use this method to accept a function logger as a parameter and cancellation token. This token is necessary if you have a long-running script that requires graceful termination in case the function host shuts down.

   The following example shows the action's **Parameters** tab with the sample script code:

   :::image type="content" source="media/add-run-csharp-scripts/action-sample-script.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, Request trigger, Execute CSharp Script Code action with information pane open, and Response action. Information pane shows sample C# script." lightbox="media/add-run-csharp-scripts/action-sample-script.png":::

   The following example shows the sample script code:

   ```csharp
   // Add the required libraries.
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
 
       //// Dereferences the 'name' property from the trigger payload.
       var name = triggerOutputs?["body"]?["name"]?.ToString();
 
       //// To get the action outputs from a preceding action, you can uncomment and use the following code.
       //var actionOutputs = (await context.GetActionResults("Compose").ConfigureAwait(false)).Outputs;

       //// The following logs appear in the Application Insights traces table.
       //log.LogInformation("Outputting results.");

       //var name = null;

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

   For more information, see the following documentation:

  - ["#r" - Reference external assemblies](/azure/azure-functions/functions-reference-csharp?tabs=functionsv2%2Cfixed-delay%2Cazure-cli#referencing-external-assemblies)
  - []

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

## Related content

[Add and run JavaScript code snippets](add-run-javascript-code-snippets.md)