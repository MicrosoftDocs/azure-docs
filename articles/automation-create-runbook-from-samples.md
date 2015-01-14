<properties urlDisplayName="Get Started with Azure Automation" pageTitle="Get Started with Azure Automation" metaKeywords="" description="Learn how to import and run an automation job in Azure." metaCanonical="" services="automation" documentationCenter="" title="" authors="bwren" solutions="" manager="stevenka" editor=""/>

<tags ms.service="automation" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="1/13/2015" ms.author="bwren" />


# Get started with Azure Automation
This guide provides an introduction to Azure Automation and lists resources that you can access to learn and use it.  A tutorial is provided to assist you in configuring Azure Automation for first use, importing and running a simple runbook, and then determining the next steps that you will require to import and create more complex and useful runbooks for working with your Azure environment.


## What is Azure Automation?

Microsoft Azure Automation provides a way for users to automate the manual, long-running, error-prone, and frequently repeated tasks that are commonly performed in a cloud environment. You can create, monitor, manage, and deploy resources in your Azure environment using runbooks, which are based on Windows PowerShell workflows. 

 In this video, Eamon O'Reilly and Scott Hanselman introduce Azure Automation service. (Duration: 10:55)  

> [AZURE.VIDEO azure-automation-101-with-powershell-and-eamon-o-reilly]

## <a name="resources"></a>Resources

A variety of resources are available for you to learn how to use Azure Automation and create your own runbooks.

- [Azure Automation Library](http://go.microsoft.com/fwlink/p/?LinkId=392860) provides complete documentation on the configuration and administration of Azure Automation and for authoring your own runbooks. 
- [Azure PowerShell cmdlets](http://msdn.microsoft.com/en-us/library/jj156055.aspx) provides information for automation Azure operations using Windows PowerShell.  Runbooks use these cmdlets to work with Azure resources.
- [Azure Automation Blog](http://azure.microsoft.com/blog/tag/azure-automation) provides the latest information on Azure Automation from Microsoft.
- [Automation Forum](http://go.microsoft.com/fwlink/p/?LinkId=390561) allows you to post questions about Azure Automation to be addressed by Microsoft and the Automation community.


## Samples and utility runbooks

Microsoft and the Automation community provide sample runbooks that can help you get started creating your own solutions and utility runbooks that you can use as building blocks for larger Automation tasks. You can either download these runbooks from [Script Center](http://go.microsoft.com/fwlink/p/?LinkId=393029) or import them directly into Azure Automation.  For more details, see [Runbook Gallery](http://aka.ms/runbookgallery).
  

## Feedback

<strong>Give us feedback!</strong>  If you are looking for an Automation runbook solution or integration module, post a Script Request on the Script Center. If you have an idea for a new feature for Automation, post it on [User Voice](http://feedback.windowsazure.com/forums/34192--general-feedback).


## Tutorial
This tutorial walks you through the steps to create an automation account and then import a sample "Hello World" runbook into Azure Automation, execute the runbook, and then view its output.

To complete this tutorial, you need an Azure account. If you have not already done so, you can <a href="/en-us/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF" target="_blank">activate your MSDN subscriber benefits</a> or <a href="/en-us/pricing/free-trial/?WT.mc_id=A85619ABF" target="_blank">sign up for a free trial</a>.

[WACOM.INCLUDE [automation-note-authentication](../includes/automation-note-authentication.md)]


### High-level steps for this tutorial

1. [Create Automation Account](#automationaccount)
2. [Import Runbook from Runbook Gallery](#importrunbook)
3. [Publish Runbook](#publishrunbook)
4. [Start Runbook](#startrunbook)


### <a name="automationaccount"></a>Create an Automation Account

You must have at least one automation account in your Azure Automation environment.  For more information, see [Automation Accounts](http://aka.ms/runbookauthor/azure/automationaccounts) in the Automation Library.  If you've already created an automation account, you can skip this step.

1.	Log in to the [Azure Management Portal](http://manage.windowsazure.com).

2.	In the Management Portal, click **Create an Automation Account**.  

	![Create Account](./media/automation/automation_01_CreateAccount.png)

3.	On the **Add a New Automation Account** page, enter a name for the account, and then click the check mark.

	![Add New Account](./media/automation/automation_02_addnewautoacct.png)

### <a name="importrunbook"></a>Import Runbook from Runbook Gallery

The [Runbook Gallery](http://aka.ms/runbookgallery) includes sample runbooks that you can download or import directly into your Azure Automation environment.
 
4.	On the **Automation** page, click the new account you just created.
 
	![New Account](./media/automation/automation_03_NewAutoAcct.png)

5.	Click **RUNBOOKS**.

	![Runbooks Tab](./media/automation/automation_04_RunbooksTab.png)
  
6.	Click **New** > **Runbook** > **From Gallery**.

	![Runbook Gallery](./media/automation/automation_05_ImportGallery.png)

7.  Select the **Tutorial** category and then **Hello World for Azure Automation**. Click the right arrow button.

	![Import Runbook](./media/automation/automation_06_ImportRunbook.png)

8.  Review the contents of the runbook and then click the right arrow button.

	![Runbook Definition](./media/automation/automation_07_RunbookDefinition.png)

8.	Review the details of the runbook and then click the check mark button.

	![Runbook Details](./media/automation/automation_08_RunbookDetails.png)

## <a name="publishrunbook"></a>Publish Runbook 

Before the runbook can be used, it must be published.  For more information, see [Publishing a Runbook](http://aka.ms/runbookauthor/azure/publishrunbook).

9.	When the runbook has finished importing, click **Write-HelloWorld**.

	![Imported Runbook](./media/automation/automation_07_ImportedRunbook.png)

9.	Click **AUTHOR**, and then click **DRAFT**.  

	You can modify the contents of a runbook in Draft mode. For this runbook, you don’t need to make any modifications.

	![Author Draft](./media/automation/automation_08_AuthorDraft.png)  
 
10.	Click **PUBLISH** to promote the runbook so it's ready for production use.

	![Publish](./media/automation/automation_085_Publish.png)
   
11.	When you are prompted to save and publish the runbook, click **Yes**.
 
	![Save and Pub prompt](./media/automation/automation_09_SavePubPrompt.png)

## <a name="startrunbook"></a>Start Runbook

With the runbook imported and published, you can run it and inspect the output.  For more information, see [Starting a Runbook](http://aka.ms/runbookauthor/azure/startrunbook) and [Runbook Output and Messages](http://aka.ms/runbookauthor/azure/runbookoutput).

12.	With the **Write-HelloWorld** runbook open, click **START**.

	![Published](./media/automation/automation_10_PublishStart.png)
 
13.	On the **Specify the runbook parameter values** page, type a **Name** that will be used as an input parameter for the Write-HelloWorld.ps1 script, and then click the check mark.

	![Runbook Parameters](./media/automation/automation_11_RunbookParams.png)
  
14.	Click **JOBS** to check the status of the runbook job you just started, and then click the timestamp in the **JOB START** column to view the job summary.

	![Runbook Status](./media/automation/automation_12_RunbookStatus.png)

15.	On the **SUMMARY** page you can see the summary, input parameters, and output of the job.
 
	![Runbook Summary](./media/automation/automation_13_RunbookSummary_callouts.png)


# <a name="nextsteps">Next Steps 
1. This tutorial uses a simple runbook that does not manage Azure services. Most runbooks will use [Azure cmdlets](http://msdn.microsoft.com/en-us/library/jj156055.aspx) that require authentication to your Azure subscription. You must follow the instructions at [Configuring Azure for Management by Runbooks](http://aka.ms/azureautomationauthentication) in order to configure your Azure subscription to work with these runbooks.  
2. Refer to the [Resources](#resources) listed above for information on obtaining existing runbooks and creating your own runbooks to use in Azure Automation.
3. Subscribe to the [Azure Automation Blog](http://azure.microsoft.com/blog/tag/azure-automation) to stay up to date with the latest information on Azure Automation.

