<properties 
   pageTitle="Testing a Runbook"
   description="Testing a Runbook"
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/16/2015"
   ms.author="bwren" />

# Testing a Runbook

You can test the Draft version of a runbook in the Azure Management Portal while leaving the published version of the runbook unchanged. This allows you to verify that the runbook is working correctly before replacing the published version.

When you test a runbook, the Draft runbook is executed and any actions that it performs are completed. No job history is created, but the [Output](../automation-runbook-output-and-messages#Output) and [Warning and Error](../automation-runbook-output-and-messages#WarningError) streams are displayed in the Test Output Pane. Messages to the [Verbose Stream](../automation-runbook-output-and-messages#Verbose) are displayed in the Output Pane only if the [$VerbosePreference variable](../automation-runbook-output-and-messages#PreferenceVariables) is set to Continue.

When a runbook is tested, it still executes the workflow normally and performs any actions against resources in the environment. For this reason, you should only test runbooks at non-production resources.

## To Test a Runbook in Azure Automation

To test a runbook, [open the Draft version of the runbook in the Azure Management Portal](../automation-editing-a-runbook#Portal). Click the Test button at the bottom of the screen to start the test.

You can stop or suspend the runbook while it is being tested with the buttons underneath the Output Pane. When you suspend the runbook, it completes the current activity before being suspended. Once the runbook is suspended, you can stop it or restart it.

