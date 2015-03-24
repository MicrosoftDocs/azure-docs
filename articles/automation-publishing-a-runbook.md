<properties 
   pageTitle="Publishing a Runbook"
   description="Publishing a Runbook"
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

# Publishing a Runbook


Each runbook in Azure Automation has a Draft and a Published version. Only the Published version is available to be run, and only the Draft version can be edited. The Published version is unaffected by any changes to the Draft version. When the Draft version should be made available, then you publish it which overwrites the Published version with the Draft version.

## To Publish a Runbook Using the Azure Management Portal

1. In the Azure Management Portal, select **Automation** and then then click the name of an automation account.

1. Select the **Runbooks** tab.

1. Locate the runbook to edit and click on its name.

1. At the top of the screen, click **Author**.

1. Click **Draft**.

1. At the bottom of the screen, click **Publish** and then **Yes** to the verification message.

## To Publish a Runbook in Using Windows PowerShell

You can use the [Publish-AzureAutomationRunbook](http://aka.ms/runbookauthor/cmdlet/publishazurerunbook) cmdlet to publish a runbook with Windows PowerShell. The following sample commands show how to publish a sample runbook.

	$automationAccountName = "MyAutomationAccount"
	$runbookName = "Sample-TestRunbook"
	
	Publish-AzureAutomationRunbook –AutomationAccountName $automationAccountName –Name $runbookName
