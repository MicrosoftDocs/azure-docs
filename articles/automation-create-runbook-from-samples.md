<properties linkid="automation-create-runbook-from-samples" urlDisplayName="Get Started with Windows Azure Automation" pageTitle="Get Started with Windows Azure Automation" metaKeywords="" description="Learn how to import and run an automation job in Windows Azure." metaCanonical="" services="automation" documentationCenter="" title="Get Started with Windows Azure Automation" authors=""  solutions="" writer="" manager="" editor=""  />


# Get started with Windows Azure Automation

This tutorial walks you through the steps to import and execute an automation job in Windows Azure. 

Windows Azure Automation provides a way for IT pros and developers to automate business processes. You can create, monitor, manage, and deploy resources in your environment by using a runbook, which under the hood is a Windows PowerShell Workflow. To learn more about Automation, see the [Automation Overview Guide](http://go.microsoft.com/fwlink/p/?LinkId=392861). 

This tutorial walks you through the steps to import a sample runbook into Windows Azure, execute the runbook, and then check its status.

## Samples and utility runbooks

The Windows Azure Automation team has created runbook samples to help you get started with Automation.  These samples cover basic Automation concepts and are intended to help you learn how to write your own runbooks.  

The product team has also created utility runbooks that you can use as building blocks for larger Automation tasks.  

[WACOM.TIP] It is a best practice to write small, modular, reusable runbooks. We also strongly recommend that you create your own utility runbooks after you’re familiar with Automation runbooks.  

You can view and download the Automation team’s sample and utility runbooks at the [Script Center](http://go.microsoft.com/fwlink/p/?LinkId=393029). 

## The Automation community and feedback

Runbooks from the community and other Microsoft teams are also published on the [Script Center](http://go.microsoft.com/fwlink/?LinkID=391681). 

<strong>Give us feedback!</strong>  If you are looking for a runbook solution, post a Script Request on the Script Center or if you  or have an idea for a new feature for Automation post them on [User Voice](http://feedback.windowsazure.com/forums/34192--general-feedback).

[WACOM.INCLUDE [create-account-note](../includes/create-account-note.md)]

## Download a sample runbook from the Script Center

1.	Go to the [Script Center](http://go.microsoft.com/fwlink/p/?LinkId=393029), and then click **Hello World for Windows Azure Automation**.

2.	Click the file name, **Write-HelloWorld.ps1**, next to **Download**, and then save the file to your computer.


## Import the sample runbook to Windows Azure

1.	Log in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2.	In the Management Portal, click **Create an Automation Account**.

	[WACOM.NOTE] If you’ve already created an automation account, you can skip to step 4.

	![Create Account](./media/automation/automation_01_CreateAccount.png)

3.	On the **Add a New Automation Account** page, enter a name for the account, and then click the check mark.

	![Add New Account](./media/automation/automation_02_addnewautoacct.png)
 
4.	On the **automation** page, click the new account you just created.
 
	![New Account](./media/automation/automation_03_NewAutoAcct.png)

5.	Click **RUNBOOKS**.

	![Runbooks Tab](./media/automation/automation_04_RunbooksTab.png)
  
6.	Click **IMPORT**.

	![Import](./media/automation/automation_05_Import.png)

7.	Browse to the **Write-HelloWorld.ps1** script you downloaded, and then click the check mark.

	![Browse](./media/automation/automation_06_Browse.png)	
 
8.	Click **Write-HelloWorld**.

	![Imported Runbook](./media/automation/automation_07_ImportedRunbook.png)

9.	Click **AUTHOR**, and then click **DRAFT**.

	You can now see the contents of **Write-HelloWorld.ps1**. You can modify the contents of a runbook in Draft mode. 

	![Author Draft](./media/automation/automation_08_AuthorDraft.png)  
 
10.	Click **PUBLISH**.

	![Publish](./media/automation/automation_085_Publish.png)
   
11.	When you are prompted, if you want to save and publish the runbook, click **Yes**.
 
	![Save and Pub prompt](./media/automation/automation_09_SavePubPrompt.png)

12.	Click **PUBLISHED**, and then click **START**.

	![Published](./media/automation/automation_10_PublishStart.png)
 
13.	On the **Specify the runbook parameter values** page, type a **Name** that will be used as an input parameter for the Write-HelloWorld.ps1 script, and then click the check mark.

	![Runbook Parameters](./media/automation/automation_11_RunbookParams.png)
  
14.	Click **JOBS** to check the status, and then click the timestamp in the **JOB START** column to view the job summary.

	![Runbook Status](./media/automation/automation_12_RunbookStatus.png)

15.	On the **SUMMARY** page you can see the job summary, input parameters, and output of the script.
 
	![Runbook Summary](./media/automation/automation_13_RunbookSummary_callouts.png)

## See Also

- [Automation Overview](http://go.microsoft.com/fwlink/p/?LinkId=392860)
- [Runbook Authoring Guide](http://go.microsoft.com/fwlink/p/?LinkID=301740)
- [Automation Forum](http://go.microsoft.com/fwlink/p/?LinkId=390561)
