<properties 
	pageTitle="Testing a runbook in Azure Automation | Microsoft Azure"
	description="Before you publish a runbook in Azure Automation, you can test it to ensure that works as expected.  This article describes how to test a runbook and view its output."
	services="automation"
	documentationCenter=""
	authors="mgoedtel"
	manager="jwhit"
	editor="tysonn" />
<tags 
	ms.service="automation"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="infrastructure-services"
	ms.date="05/24/2016"
	ms.author="magoedte;bwren" />

# Testing a runbook in Azure Automation
When you test a runbook, the [Draft version](automation-creating-importing-runbook.md#publishing-a-runbook) is executed and any actions that it performs are completed. No job history is created, but the [Output](automation-runbook-output-and-messages.md#output-stream) and [Warning and Error](automation-runbook-output-and-messages.md#message-streams) streams are displayed in the Test output Pane. Messages to the [Verbose Stream](automation-runbook-output-and-messages.md#message-streams) are displayed in the Output Pane only if the [$VerbosePreference variable](automation-runbook-output-and-messages.md#preference-variables) is set to Continue.

Even though the draft version is being run, the runbook still executes the workflow normally and performs any actions against resources in the environment. For this reason, you should only test runbooks at non-production resources.

The procedure to test each [type of runbook](automation-runbook-types.md) is the same, and there is no difference in testing between the textual editor and the graphical editor in the Azure portal.  


## To test a runbook in the Azure portal

You can work with any [runbook type](automation-runbook-types.md) in the Azure portal.

1. Open the Draft version of the runbook in either the [textual editor](automation-editing-a-runbook.md#Portal) or [graphical editor](automation-graphical-authoring-intro.md).
2. Click the **Test** button to open the Test blade.
3. If the runbook has parameters, they will be listed in the left pane where you can provide values to be used for the test.
4. If you want to run the test on a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md), then change **Run Settings** to **Hybrid Worker** and select the name of the target group.  Otherwise, keep the default **Azure** to run the test in the cloud.
5. Click the **Start** button to start the test.
6. If the runbook is [PowerShell Workflow](automation-runbook-types.md#powershell-workflow-runbooks) or [Graphical](automation-runbook-types.md#graphical-runbooks), then you can stop or suspend it while it is being tested with the buttons underneath the Output Pane. When you suspend the runbook, it completes the current activity before being suspended. Once the runbook is suspended, you can stop it or restart it.
7. Inspect the output from the runbook in the output pane.


## Next Steps

- To learn how to create or import a runbook, see [Creating or importing a runbook in Azure Automation](automation-creating-importing-runbook.md)
- To learn more about Graphical Authoring, see [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md)
- To get started with PowerShell workflow runbooks, see [My first PowerShell workflow runbook](automation-first-runbook-textual.md)
- To learn more about configuring runboks to return status messages and errors, including recommended practices, see [Runbook output and messages in Azure Automation](automation-runbook-output-and-messages.md)