---
title: Use the Azure Automation graphical runbook SDK (preview)
description: This article tells how to use the Azure Automation graphical runbook SDK (preview).
services: automation
ms.subservice: process-automation
ms.date: 07/20/2018
ms.topic: conceptual
---

# Use the Azure Automation graphical runbook SDK (preview)

[Graphical runbooks](automation-graphical-authoring-intro.md) help manage the complexities of the underlying Windows PowerShell or PowerShell Workflow code. The Microsoft Azure Automation graphical authoring SDK enables developers to create and edit graphical runbooks for use with Azure Automation. This article describes basic steps in creating a graphical runbook from your code.

## Prerequisites

Import the `Orchestrator.GraphRunbook.Model.dll` package by downloading the [SDK](https://www.microsoft.com/download/details.aspx?id=50734).

## Create a runbook object instance

Reference the `Orchestrator.GraphRunbook.Model` assembly and create an instance of the `Orchestrator.GraphRunbook.Model.GraphRunbook` class:

```csharp
using Orchestrator.GraphRunbook.Model;
using Orchestrator.GraphRunbook.Model.ExecutableView;

var runbook = new GraphRunbook();
```

## Add runbook parameters

Instantiate `Orchestrator.GraphRunbook.Model.Parameter` objects and add them to the runbook:

```csharp
runbook.AddParameter(
 new Parameter("YourName") {
  TypeName = typeof(string).FullName,
   DefaultValue = "World",
   Optional = true
 });

runbook.AddParameter(
 new Parameter("AnotherParameter") {
  TypeName = typeof(int).FullName, ...
 });
```

## Add activities and links

Instantiate activities of appropriate types and add them to the runbook:

```csharp
var writeOutputActivityType = new CommandActivityType {
 CommandName = "Write-Output",
  ModuleName = "Microsoft.PowerShell.Utility",
 InputParameterSets = new [] {
  new ParameterSet {
   Name = "Default",
    new [] {
     new Parameter("InputObject"), ...
    }
  },
  ...
 }
};

var outputName = runbook.AddActivity(
 new CommandActivity("Output name", writeOutputActivityType) {
  ParameterSetName = "Default",
   Parameters = new ActivityParameters {
    {
     "InputObject",
     new RunbookParameterValueDescriptor("YourName")
    }
   },
   PositionX = 0,
   PositionY = 0
 });

var initializeRunbookVariable = runbook.AddActivity(
 new WorkflowScriptActivity("Initialize variable") {
  Process = "$a = 0",
   PositionX = 0,
   PositionY = 100
 });
```

Activities are implemented by the following classes in the `Orchestrator.GraphRunbook.Model` namespace.

|Class  |Activity  |
|---------|---------|
|CommandActivity     | Invokes a PowerShell command (cmdlet, function, etc.).        |
|InvokeRunbookActivity     | Invokes another runbook inline.        |
|JunctionActivity     | Waits for all incoming branches to finish.        |
|WorkflowScriptActivity     | Executes a block of PowerShell or PowerShell Workflow code (depending on the runbook type) in the context of the runbook. This is a powerful tool, but do not overuse it: the UI will show this script block as text; the execution engine will treat the provided block as a black box, and will make no attempts to analyze its content, except for a basic syntax check. If you just need to invoke a single PowerShell command, prefer CommandActivity.        |

> [!NOTE]
> Don't derive your own activities from the provided classes. Azure Automation can't use runbooks with custom activity types.

You must provide `CommandActivity` and `InvokeRunbookActivity` parameters as value descriptors, not direct values. Value descriptors specify how to produce the actual parameter values. The following value descriptors are currently provided:


|Descriptor  |Definition  |
|---------|---------|
|ConstantValueDescriptor     | Refers to a hard-coded constant value.        |
|RunbookParameterValueDescriptor     | Refers to a runbook parameter by name.        |
|ActivityOutputValueDescriptor     | Refers to an upstream activity output, allowing one activity to "subscribe" to data produced by another activity.        |
|AutomationVariableValueDescriptor     | Refers to an Automation Variable asset by name.         |
|AutomationCredentialValueDescriptor     | Refers to an Automation Certificate asset by name.        |
|AutomationConnectionValueDescriptor     | Refers to an Automation Connection asset by name.        |
|PowerShellExpressionValueDescriptor     | Specifies a free-form PowerShell expression that will be evaluated just before invoking the activity.  <br/>This is a powerful tool, but do not overuse it: the UI will show this expression as text; the execution engine will treat the provided block as a black box, and will make no attempts to analyze its content, except for a basic syntax check. When possible, prefer more specific value descriptors.      |

> [!NOTE]
> Don't derive your own value descriptors from the provided classes. Azure Automation can't use runbooks with custom value descriptor types.

Instantiate links connecting activities and add them to the runbook:

```csharp
runbook.AddLink(new Link(activityA, activityB, LinkType.Sequence));

runbook.AddLink(
 new Link(activityB, activityC, LinkType.Pipeline) {
  Condition = string.Format("$ActivityOutput['{0}'] -gt 0", activityB.Name)
 });
```

## Save the runbook to a file

Use `Orchestrator.GraphRunbook.Model.Serialization.RunbookSerializer` to serialize a runbook to a string:

```csharp
var serialized = RunbookSerializer.Serialize(runbook);
```

You can save this string to a file with the **.graphrunbook** extension. The corresponding runbook can be imported into Azure Automation.
The serialized format might change in the future versions of `Orchestrator.GraphRunbook.Model.dll`. We promise backward compatibility: any runbook serialized with an older version of `Orchestrator.GraphRunbook.Model.dll` can be deserialized by any newer version. Forward compatibility is not guaranteed: a runbook serialized with a newer version may not be deserializable by older versions.

## Next steps

For more information, see [Author graphical runbooks in Azure Automation](automation-graphical-authoring-intro.md).