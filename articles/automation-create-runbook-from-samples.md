<properties linkid="automation-create-runbook-from-samples" urlDisplayName="Get Started with Azure Automation" pageTitle="Get Started with Azure Automation" metaKeywords="" description="Learn how to import and run an automation job in Azure." metaCanonical="" services="automation" documentationCenter="" title="Get Started with Azure Automation" authors="" solutions="" manager="" editor="" />


# Get started with Azure Automation

Microsoft Azure Automation provides a way for developers to automate the manual, long-running, error-prone, and frequently repeated tasks that are commonly performed in a cloud environment. You can create, monitor, manage, and deploy resources in your Azure environment using runbooks, which under the hood are Windows PowerShell workflows. To learn more about Automation, see the [Automation Overview Guide](http://go.microsoft.com/fwlink/p/?LinkId=392861). 

This tutorial walks you through the steps to import a sample "Hello World" runbook into Azure Automation, execute the runbook, and then view its output.

>[WACOM.NOTE] For more help getting started with Automation, learn how to automate Azure operations using the PowerShell cmdlets <a href="http://blogs.technet.com/b/keithmayer/archive/2014/04/04/step-by-step-getting-started-with-windows-azure-automation.aspx">here</a>.

## Samples and utility runbooks

The Azure Automation team has created a number of runbook samples to help you get started with Automation.  These samples cover basic Automation concepts and are intended to help you learn how to write your own runbooks.  

The Automation team has also created utility runbooks that you can use as building blocks for larger Automation tasks.  

>[WACOM.NOTE] It's a best practice to write small, modular, reusable runbooks. We also strongly recommend that you create your own utility runbooks for commonly used scenarios after you’re familiar with Automation.  

You can view and download the Automation team’s sample and utility runbooks on [Script Center](http://go.microsoft.com/fwlink/p/?LinkId=393029). 

## The Automation community and feedback

Runbooks from the community and from other Microsoft teams are also published on  [Script Center](http://go.microsoft.com/fwlink/?LinkID=391681). 

<strong>Give us feedback!</strong>  If you are looking for an Automation runbook solution or integration module, post a Script Request on the Script Center. If you have an idea for a new feature for Automation, post it on [User Voice](http://feedback.windowsazure.com/forums/34192--general-feedback).

[WACOM.INCLUDE [create-account-note](../includes/create-account-note.md)]

## High-level steps for this tutorial

1. [Sign up for Automation preview](#preview)
2. [Download a sample runbook](#download-sample)
3. [Import, run, and view the output of the sample runbook](#import-sample)

## <a name="preview"></a>Sign up for the Azure Automation Preview

To start using Automation, you’ll need an active Azure subscription with the Microsoft Azure Automation preview feature enabled. 

- On the **Preview Features** page, click **try it now**. 

	![Enable Preview](./media/automation/automation_00_EnablePreview.png)

## <a name="download-sample"></a>Download a sample runbook from the Script Center

1.	Go to  [Script Center](http://go.microsoft.com/fwlink/p/?LinkId=393029), and then click **Hello World for Azure Automation**.

2.	Click the file name, **Write-HelloWorld.ps1**, next to **Download**, and then save the file to your computer.


## <a name="import-sample"></a>Import, run, and view the sample runbook in Azure Automation

1.	Log in to the [Azure Management Portal](http://manage.windowsazure.com).

2.	In the Management Portal, click **Create an Automation Account**.

	>[WACOM.NOTE] If you’ve already created an automation account, you can skip to step 4.

	![Create Account](./media/automation/automation_01_CreateAccount.png)

3.	On the **Add a New Automation Account** page, enter a name for the account, and then click the check mark.

	![Add New Account](./media/automation/automation_02_addnewautoacct.png)
 
4.	On the **Automation** page, click the new account you just created.
 
	![New Account](./media/automation/automation_03_NewAutoAcct.png)

5.	Click **RUNBOOKS**.

	![Runbooks Tab](./media/automation/automation_04_RunbooksTab.png)
  
6.	Click **IMPORT**.

	![Import](./media/automation/automation_05_Import.png)

7.	Browse to the **Write-HelloWorld.ps1** script you downloaded, and then click the check mark.

	![Browse](./media/automation/automation_06_Browse.png)	
 
8.	Click **Write-HelloWorld**.

	![Imported Runbook](./media/automation/automation_07_ImportedRunbook.png)

9.	Click **AUTHOR**, and then click **DRAFT**. For this runbook, you don’t need to make any modifications.  

	You can now see the contents of **Write-HelloWorld.ps1**. You can modify the contents of a runbook in Draft mode. 

	![Author Draft](./media/automation/automation_08_AuthorDraft.png)  
 
10.	Click **PUBLISH** to promote the runbook so it's ready for production use.

	![Publish](./media/automation/automation_085_Publish.png)
   
11.	When you are prompted to save and publish the runbook, click **Yes**.
 
	![Save and Pub prompt](./media/automation/automation_09_SavePubPrompt.png)

12.	Click **PUBLISHED**, and then click **START**.

	![Published](./media/automation/automation_10_PublishStart.png)
 
13.	On the **Specify the runbook parameter values** page, type a **Name** that will be used as an input parameter for the Write-HelloWorld.ps1 script, and then click the check mark.

	![Runbook Parameters](./media/automation/automation_11_RunbookParams.png)
  
14.	Click **JOBS** to check the status of the runbook job you just started, and then click the timestamp in the **JOB START** column to view the job summary.

	![Runbook Status](./media/automation/automation_12_RunbookStatus.png)

15.	On the **SUMMARY** page you can see the summary, input parameters, and output of the job.
 
	![Runbook Summary](./media/automation/automation_13_RunbookSummary_callouts.png)

## See Also

- [Automation Overview](http://go.microsoft.com/fwlink/p/?LinkId=392860)
- [Runbook Authoring Guide](http://go.microsoft.com/fwlink/p/?LinkID=301740)
- [Automation Forum](http://go.microsoft.com/fwlink/p/?LinkId=390561)
- [Automate Azure operations using Azure Automation and the PowerShell cmdlets](http://blogs.technet.com/b/keithmayer/archive/2014/04/04/step-by-step-getting-started-with-windows-azure-automation.aspx)
