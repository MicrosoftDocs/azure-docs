<properties
   pageTitle="Add Azure automation runbooks to recovery plans | Microsoft Azure"
   description="This article describes how Azure Site Recovery now enables you to extend recovery plans using Azure Automation to complete complex tasks during recovery to Azure"
   services="site-recovery"
   documentationCenter=""
   authors="ruturaj"
   manager="mkjain"
   editor=""/>

<tags
   ms.service="site-recovery"
   ms.devlang="powershell"
   ms.tgt_pltfrm="na"
   ms.topic="article"
   ms.workload="required"
   ms.date="08/23/2016"
   ms.author="ruturajd@microsoft.com"/>


# Add Azure automation runbooks to recovery plans


This tutorial describes how Azure Site Recovery integrates with Azure
Automation to provide extensibility to recovery plans. Recovery plans
can orchestrate recovery of your virtual machines protected using Azure Site Recovery for both replication to secondary cloud and replication to Azure scenarios. They also help in making the recovery **consistently accurate**, **repeatable**, and **automated**. If you are failing over your virtual machines to Azure, integration with Azure Automation extends the
recovery plans and gives you capability to execute runbooks, thus allowing powerful automation tasks.

If you have not heard about Azure Automation yet, sign up
[here](https://azure.microsoft.com/services/automation/) and
download their sample scripts
[here](https://azure.microsoft.com/documentation/scripts/). Read
more about [Azure Site
Recovery](https://azure.microsoft.com/services/site-recovery/) and
how to orchestrate recovery to Azure using recovery plans
[here](https://azure.microsoft.com/blog/?p=166264).

In this tutorial, we will look at how you can integrate Azure Automation
runbooks into recovery plans. We will automate simple tasks that earlier
required manual intervention and see how to convert a multi-step
recovery into a single-click recovery action. We will also look at how you
can troubleshoot a simple script if it goes wrong.

## Customize the recovery plan

1. Let us begin by operning the resource blade of the recovery plan. You can see the recovery plan has two virtual machines added to it for recovery. 

![](media/site-recovery-runbook-automation-new/essentials-rp.png)
---------------------

2. Click on the customize button to begin adding a runbook. This will open the recovery plan customize blade.


![](media/site-recovery-runbook-automation-new/customize-rp.png)


3. Right click on the start group 1 and select to add a 'Add post action'.

4. Select to choose a script in the new blade.

5. Name the script 'Hello World'.

6. Choose an Automation Account name. This is the Azure Automation account. Note that this account can be in any Azure geography but has to be in the same subscription as the Site Recovery vault.

7. Select a runbook from the Automation Account. This is the script that will run during the execution of the recovery plan after the recovery of first group.

![](media/site-recovery-runbook-automation-new/update-rp.png)


8. Select OK to save the script. This will add the script to the post action group of Group 1: Start.


![](media/site-recovery-runbook-automation-new/addedscript-rp.png)


## Salient points of adding a script

1. You can right click on the script and choose to 'delete step' or 'update script'.

2. A script can run on the Azure while failover from On-premises to Azure, and can run on Azure as a primary side script before shutdown, during failback from Azure to on-premises.

3. When a script runs, it will inject a recovery plan context.

Below is an example of how the context variable looks.

        {"RecoveryPlanName":"hrweb-recovery",

        "FailoverType":"Test",

        "FailoverDirection":"PrimaryToSecondary",

        "GroupId":"1",

        "VmMap":{"7a1069c6-c1d6-49c5-8c5d-33bfce8dd183":

                {"CloudServiceName":"pod02hrweb-Chicago-test",

                "RoleName":"Fabrikam-Hrweb-frontend-test"}

                }

        }


The table below contains name and description for each variable in the context.

**Variable name** | **Description**
---|---
RecoveryPlanName | Name of plan being run. Helps you take action based on name using the same script
FailoverType | Specifies whether the failover is test, planned, or unplanned.
FailoverDirection | Specify whether recovery is to primary or secondary
GroupID | Identify the group number within the recovery plan when the plan is running
VmMap | Array of all the virtual machines in the group
VMMap key | Unique key (GUID) for each VM. It's the same as the VMM ID of the virtual machine where applicable.
RoleName | Name of the Azure VM that's being recovered
CloudServiceName | Azure Cloud Service name under which the virtual machine is created.
CloudServiceName (in Resource Manager deployment model) | Azure Resource Group name under which the virtual machine is created.


## Passing parameters to a runbook

There is no first class mechanism to pass a parameter to a runbook. However, if you want to use the same script via multiple recovery plans you can use the Recovery Plan Context variable 'RecoveryPlanName' and use the below experimental technique to pass additional parameters.

Consider that you want to pass 3 parameters to a runbook. Let us encode them into a JSON form
{"Var1":"testautomation","Var2":"Unplanned","Var3":"PrimaryToSecondary"}

Use [AA complex variable](https://azure.microsoft.com/en-in/documentation/articles/automation-variables/#variable-types Complex variable) to create a new Automation asset.
Name the variable as <RecoveryPlanName>-params.
You can use the reference here to create a [omplex variable](https://msdn.microsoft.com/library/dn913767.aspx?f=255&MSPPError=-2147217396).

For different recovery plans, name the variable as

1. coveryPlanName1>-params
2. coveryPlanName2>-params
3. coveryPlanName3>-params

Now, in the script refer to the params as

1. Get the RP name from the $rpname = $Recoveryplancontext variable
2. Get asset of $paramValue = "$($rpname)-params"
3. Use this as a param for the recovery plan.

As an example, to get the complex variable/parameter for the SharepointApp recovery plan, create an Azure Automation complex variable called 'SharepointApp-params'.

Use it in the recovery plan by extracting the variable from the asset using the statement Get-AzureAutomationVariable [-AutomationAccountName] <String> [-Name] $paramValue. [Reference this for more details](https://msdn.microsoft.com/library/dn913772.aspx)

This way the same script can be used for different recovery plan by storing the plan specific parameters in the assets.

## Sample scripts

While we walked through automating one commonly used task of adding an endpoint to an Azure virtual machine in this tutorial, you could do a number of other powerful automation tasks using Azure automation. Microsoft and the Azure Automation community provide sample runbooks which can help you get started creating your own solutions, and utility runbooks, which you can use as building blocks for larger automation tasks. Start using them from the gallery and build  powerful one-click recovery plans for your applications using Azure Site Recovery.

## Additional Resources

[Azure Automation Overview](http://msdn.microsoft.com/library/azure/dn643629.aspx "Azure Automation Overview")

[Sample Azure Automation Scripts](http://gallery.technet.microsoft.com/scriptcenter/site/search?f[0].Type=User&f[0].Value=SC%20Automation%20Product%20Team&f[0].Text=SC%20Automation%20Product%20Team "Sample Azure Automation Scripts")
