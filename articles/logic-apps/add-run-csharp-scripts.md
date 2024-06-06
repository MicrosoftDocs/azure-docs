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

- The Azure portal saves your script as a .csx file in the same folder as your **workflow.json** file, which stores the JSON definition for your workflow, and deploys the file to your logic app resource along with the workflow definition. Azure Logic Apps compiles this file to make the script ready for execution.

  You can rename the .csx file for easier management during deployment. However, each time you rename the script, the new version overwrites the previous version.

- The script is local to the workflow. To use the same script in other workflows, in the Kudo console, find the script file, open the shortcut menu, and then copy the script to reuse in other workflows.

## Add the Execute CSharp Script Code action

1. In the [Azure portal](https://portal.azure.com), open your Standard workflow in the designer.

1. In the designer, [follow these general steps to add the **Inline Code Operations** action named **Execute CSharp Script Code action** to your workflow](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. After the action information pane opens, on the **Parameters** tab, in the **Code File** box, enter your script, for example:

   :::image type="content" source="media/add-run-csharp-scripts/action-sample-script.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, Request trigger, Execute CSharp Script Code action with information pane open, and Response action. Information pane shows sample C# script." lightbox="media/add-run-csharp-scripts/action-sample-script.png":::

   This example continues with the following sample script code:

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
 
       //// Dereference the 'name' property from the trigger payload.
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
   

1. When you're done, save your workflow.

## View the script file



## How scripting works in this scenario

The .csx format allows you to write less "boilerplate" and focus on writing just a C# function. Instead of wrapping everything in a namespace and class, just define a Run method. Include any assembly references and namespaces at the beginning of the file as usual. The name of this method is predefined, and your workflow can run only invoke this Run method at runtime. 

Data from your workflow flows into your Run method through parameter of WorkflowContext type. In addition to the workflow context, you can also have this method take function logger as a parameter and a cancellation tokens (needed if your script is long running and needs to be gracefully terminate in case of Function Host is shutting down).

## Related content
