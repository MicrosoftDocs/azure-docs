---
title: Add and run PowerShell in Standard workflows
description: Write and run PowerShell script code in Standard workflows to perform custom integration tasks using Inline Code operations in Azure Logic Apps.
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, swghimire, shahparth, azla
ms.topic: how-to
ms.date: 08/13/2024
# Customer intent: As a logic app workflow developer, I want to write and run PowerShell code so that I can perform custom integration tasks in Standard workflows for Azure Logic Apps.
---

# Add and run PowerShell script code in Standard workflows for Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To perform custom integration tasks inline with your Standard workflow in Azure Logic Apps, you can directly add and run PowerShell code from within your workflow. For this task, use the **Inline Code** action named **Execute PowerShell Code**. This action returns the results from your PowerShell code so that you can use this output in your workflow's subsequent actions.

This capability provides the following benefits:

- Write your own scripts within the workflow designer so you can solve complex integration challenges. No other service plans are necessary.

  This benefit streamlines workflow development plus reduces the complexity and cost with managing more services.

- Generate a dedicated code file, which provides a personalized scripting space within your workflow.

- Integrate with [Azure Functions PowerShell Functions](../azure-functions/functions-reference-powershell.md), which provides powerful functionality and inheritance for advanced task execution.

- Deploy scripts alongside your workflows.

This guide shows how to add the action in your workflow and add the PowerShell code that you want to run.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The Standard logic app workflow where you want to add your PowerShell script. The workflow must already start with a trigger. For more information, see [Create example Standard logic app workflows](create-single-tenant-workflows-azure-portal.md).

  You can use any trigger for your scenario, but as an example, this guide uses the **Request** trigger named **When a HTTP request is received** and also the **Response** action. The workflow runs when another application or workflow sends a request to the trigger's endpoint URL. The sample script returns the results from code execution as output that you can use in subsequent actions.

## Considerations

- The Azure portal saves your script as a PowerShell script file (.ps1) in the same folder as your **workflow.json** file, which stores the JSON definition for your workflow, and deploys the file to your logic app resource along with the workflow definition.

  The **.ps1** file format lets you write less "boilerplate" and focus just on writing PowerShell code. If you rename the action, the file is also renamed, but not vice versa. If you directly rename the file, the renamed version overwrites the previous version. If the action name and file names don't match, the action can't find the file and tries to create a new empty file.

- The script is local to the workflow. To use the same script in other workflows, [view the script file in the **KuduPlus** console](#view-script-file), and then copy the script to reuse in other workflows.

## Limitations

| Name | Limit | Notes |
|------|-------|-------|
| Script run duration | 10 minutes | If you have scenarios that need longer durations, use the product feedback option to provide more information about your needs. |
| Output size | 100 MB | Output size depends on the output size limit for actions, which is generally 100 MB. |

## Add the Execute PowerShell Code action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. In the designer, [follow these general steps to add the **Inline Code Operations** action named **Execute PowerShell Code** to your workflow](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. After the action information pane opens, on the **Parameters** tab, in the **Code File** box, update the prepopulated sample code with your own code.

     - To access data coming from your workflow, see [Access workflow trigger and action outputs in your script](#access-trigger-action-outputs) later in this guide.

     - To return the script's results or other data to your workflow, see [Return data to your workflow](#return-data-to-workflow).

   The following example shows the action's **Parameters** tab with the sample script code:

   :::image type="content" source="media/add-run-powershell-scripts/action-sample-script.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, Request trigger, Execute PowerShell Code action with information pane open, and Response action. Information pane shows sample PowerShell script." lightbox="media/add-run-powershell-scripts/action-sample-script.png":::

   The following example shows the sample script code:

   ```powershell
   # Use the following cmdlets to retrieve outputs from prior steps.
   # $triggerOutput = Get-TriggerOutput
   # $ActionOutput = Get-ActionOutput -ActionName <action-name>

   $customResponse =  [PSCustomObject]@{
      Message = "Hello world!"
   }

   # Use Write-Debug/Write-Host/Write-Output/ to log messages to Application Insights.
   # Write-Host/Write-Output/Write-Debug and 'return' won't return an output to the workflow.
   # Write-Host "Sending to Application Insight logs"

   # Use Push-WorkflowOutput to push outputs into subsequent actions.
   Push-WorkflowOutput -Output $customResponse
   ```

   The following example shows a custom sample script:

   ```powershell
   $action = Get-TriggerOutput
   $results = "Hello from PowerShell!"
   Push-WorkflowOutput -Output $results
   ```

1. When you finish, save your workflow.

After you run your workflow, you can review the workflow output in Application Insights, if enabled. For more information, see [View output in Application Insights](#log-output-application-insights).

<a name="access-trigger-action-outputs"></a>

## Access workflow trigger and action outputs in your script

The output values from the trigger and preceding actions are returned using a custom object, which has multiple parameters. To access these outputs and make sure that you return the value that you want, use the [**Get-TriggerOutput**](#get-triggeroutput), [**Get-ActionOutput**](#get-actionoutput), and [**Push-WorkflowOutput**](#push-workflowoutput) cmdlets plus any appropriate parameters described in the following table, for example:

```powershell
$trigger = Get-TriggerOutput
$statusCode = $trigger.status.ToString();
$action = Get-ActionOutput -ActionName Compose
$actionOutput = $action.outputs['actionOutput'].ToString();
$populatedString = "Send the $statusCode for the trigger status and $actionOutputName."

Push-WorkflowOutput -Output $populatedString
```

> [!NOTE]
>
> In PowerShell, if you reference an object that has **JValue** type inside a complex object, and you 
> add that object to a string, you get a format exception. To avoid this error, use **ToString()**.

### Trigger and action response outputs

The following table lists the outputs that are generated when you call **Get-ActionOutput** or **Get-TriggerOutput**. The return value is a complex object called **PowershellWorkflowOperationResult**, which contains thee following outputs.

| Name | Type | Description |
|------|------|-------------|
| **Name** | String | The name for the trigger or action. |
| **Inputs** | JToken | The input values passed into the trigger or action. |
| **Outputs** | JToken | The outputs from the executed trigger or action. |
| **StartTime** | DateTime | The start time for the trigger or action. |
| **EndTime** | DateTime | The end time for the trigger or action. |
| **ScheduledTime** | DateTime | The scheduled time to run the trigger or action or trigger. |
| **OriginHistoryName** | String | The origin history name for triggers with the **Split-On** option enabled. |
| **SourceHistoryName** | String | The source history name for a resubmitted trigger. |
| **TrackingId** | String | The operation tracking ID. |
| **Code** | String | The status code for the result. |
| **Status** | String | The run status for the trigger or action, for example, **Succeeded** or **Failed**. |
| **Error** | JToken | The HTTP error code. |
| **TrackedProperties** | JToken | Any tracked properties that you set up. |

<a name="return-data-to-workflow"></a>

## Return outputs to your workflow

To return any outputs to your workflow, you must use the [**Push-WorkflowOutput** cmdlet](#push-workflowoutput).

## Custom PowerShell commands

The **Execute PowerShell Code** action includes following custom [PowerShell commands (cmdlets)](/powershell/scripting/powershell-commands) for interacting with your workflow and other operations in your workflow:

### Get-TriggerOutput

Gets the output from the workflow's trigger.

#### Syntax

```powershell
Get-TriggerOutput
```

#### Parameters

None.

### Get-ActionOutput

Gets the output from another action in the workflow and returns an object named **PowershellWorkflowOperationResult**.

#### Syntax

```powershell
Get-ActionOutput [ -ActionName <String> ]
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **ActionName** | String | The name of the action in the workflow with the output that you want to reference. |

### Push-WorkflowOutput

Pushes output from the **Execute PowerShell Code** action to your workflow, which can pass back any object type. If the return value is null, you get a null object error from the cmdlet.

> [!NOTE]
>
> The **Write-Debug**, **Write-Host**, and **Write-Output** cmdlets don't return values 
> to your workflow. The **return** statement also doesn't return values to your workflow. 
> However, you can use these cmdlets to write trace messages that appear in Application Insights. 
> For more information, see [Microsoft.PowerShell.Utility](/powershell/module/microsoft.powershell.utility).

#### Syntax

```powershell
Push-WorkflowOutput [-Output <Object>] [-Clobber]
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **Output** | Varies. | The output that you want to return to the workflow. This output can have any type. |
| **Clobber** | Varies. | An optional switch parameter that you can use to override the previously pushed output. |

## Authenticate and authorize access with a managed identity using PowerShell

With a [managed identity](/entra/identity/managed-identities-azure-resources/overview), your logic app resource and workflow can authenticate and authorize access to any Azure service and resource that supports Microsoft Entra authentication without including credentials in your code.

From inside the **Execute PowerShell Code** action, you can authenticate and authorize access with a managed identity so that you can perform actions on other Azure resources where you enabled access. For example, you can restart a virtual machine or get the run details of another logic app workflow.

To use the managed identity from inside the **Execute PowerShell Code** action, you must follow these steps:

1. [Follow these steps to set up the managed identity on your logic app and grant the managed identity access on the target Azure resource](authenticate-with-managed-identity.md?tabs=standard).

   On the target Azure resource, review the following considerations:

   - On the **Role** tab, a **Contributor** role is usually sufficient.

   - On the **Add role assignment** page, on the **Members** tab, for the **Assign access to** property, make sure that you select **Managed identity**.

   - After you select **Select members**, on the **Select managed identities** pane, select the managed identity that you want to use.

1. In your **Execute PowerShell Code** action, include the following code as the first statement:

   ```powershell
   Connect-AzAccount -Identity
   ```

1. Now, you can work with the Azure resource using cmdlets and modules.

<a name="view-script-file"></a>

## View the script file

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource that has the workflow you want.

1. On the logic app resource menu, under **Development Tools**, select **Advanced Tools**.

1. On the **Advanced Tools** page, select **Go**, which opens the **KuduPlus** console.

1. Open the **Debug console** menu, and select **CMD**.

1. Go to your logic app's root location: **site/wwwroot**

1. Go to your workflow's folder, which contains the .ps1 file, along this path: **site/wwwroot/{workflow-name}**

1. Next to the file name, select **Edit** to open and view the file.

<a name="log-output-application-insights"></a>

## View logs in Application Insights

1. In the [Azure portal](https://portal.azure.com), on the logic app resource menu, under **Settings**, select **Application Insights**, and then select your logic app.

1. On the **Application Insights** menu, under **Monitoring**, select **Logs**.

1. Create a query to find any traces or errors from your workflow execution, for example:

   ```text
   union traces, errors
   | project TIMESTAMP, message
   ```

## Modules

PowerShell modules are self-contained, reusable units that include various components, for example:

- Cmdlets: Individual commands that perform specific tasks.
- Providers: Allow access to data stores, such as the registry or file system, as if they were drives.
- Functions: Reusable code blocks that perform specific actions.
- Variables: Store data for use within the module.
- Other types of resources.

A module organizes PowerShell code, making it easier to distribute. For example, you can create your own modules to package and make related functionality more manageable and shareable. The **Execute PowerShell Code** action lets you import both public and private PowerShell modules.

### Public modules

To find publicly available modules, visit the [PowerShell gallery](https://www.powershellgallery.com). A Standard logic app resource can support up to 10 public modules. To use any public module, you must enable this capability by following these steps:

1. In the [Azure portal](https://portal.azure.com), on your logic app resource menus, under Development Tools, select **Advanced Tools**.

1. On the **Advanced Tools** page, select **Go**.

1. On the **Kudu Plus** toolbar, from the **Debug console** menu, select **CMD**.

1. Browse to your logic app's root level at **C:\home\site\wwwroot** by using the directory structure or the command line.

1. Open the workflow's **host.json** file, and set the **managed dependency** property to **true**, which is already set by default.

   ```json
   "managedDependency": {
       "enabled": true
   }
   ```

1. Open the file named **requirements.psd1**. Include the name and version for the module that you want by using the following syntax: **MajorNumber.\*** or the exact module version, for example:

   ```powershell
   @{
       Az = '1.*'
       SqlServer = '21.1.18147'
   } 
   ```

#### Considerations for public modules

If you use dependency management, the following considerations apply:

- To download modules, public modules require access to the [PowerShell Gallery](https://www.powershellgallery.com).

- Managed dependencies currently don't support modules that require you to accept a license, either by accepting the license interactively or by providing the **-AcceptLicense** option when you run **Install-Module**.

### Private modules

You can generate your own private PowerShell modules. To create your first PowerShell module, see [Write a PowerShell Script Module](/powershell/scripting/developer/module/how-to-write-a-powershell-script-module).

1. In the [Azure portal](https://portal.azure.com), on your logic app resource menu, under Development Tools, selects **Advanced Tools**.

1. On the **Advanced Tools** page, select **Go**.

1. On the **Kudu Plus** toolbar, from the **Debug console** menu, select **CMD**.

1. Browse to your logic app's root level at **C:\home\site\wwwroot** by using the directory structure or the command line.

1. Create a folder named **Modules**.

1. In the **Modules** folder, create a subfolder with the same name as your private module.

1. In your private module folder, add your private PowerShell module file with the **psm1** file name extension. You can also include an optional PowerShell manifest file with the **psd1** file name extension.

When you're done, your complete logic app file structure appears similar to the following example:

```text
MyLogicApp
-- execute_powershell_script.ps1
-- mytestworkflow.json
Modules
-- MyPrivateModule
--- MyPrivateModule.psd1
--- MyPrivateModule.psm1
-- MyPrivateModule2
--- MyPrivateModule2.psd1
--- MyPrivateModule2.psm1
requirements.psd1
host.json
```

## Compilation errors

In this release, the web-based editor includes limited IntelliSense support, which is still under improvement. Any compilation errors are detected when you save your workflow, and the Azure Logic Apps runtime compiles your script. These errors appear in your logic app's error logs.

## Runtime errors

### A workflow action doesn't return any output.

Make sure that you use the **Push-WorkflowOutput** cmdlet.

### Execute PowerShell Code action fails: "The term '{some-text}' is not recognized..."

If you incorrectly reference a public module in the **requirements.psd1** file or when your private module doesn't exist in the following path: **C:\home\site\wwwroot\Modules\{module-name}**, you get the following error:

**The term '{some-text}' is not recognized as a name of a cmdlet, function, script file, or executable program. Check the spelling of the name or if a path was included, verify the path is correct and try again.**

> [!NOTE]
>
> By default, the Az* modules appear in the **requirements.psd1** file, but they're commented out at file creation.
> When you reference a cmdlet from the module, make sure to uncomment the module.

### Execute PowerShell Code action fails: "Cannot bind argument to parameter 'Output' because it is null."

This error happens when you try to push a null object to the workflow. Confirm whether the object that you're sending with **Push-WorkflowOutput** is null.

## Related content

- [Add and run JavaScript code snippets](add-run-javascript.md)
- [Add and run C# scripts](add-run-csharp-scripts.md)
