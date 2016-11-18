---
title: Add Azure automation runbooks to recovery plans | Microsoft Docs
description: This article describes how Azure Site Recovery now enables you to extend recovery plans using Azure Automation to complete complex tasks during recovery to Azure
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: gauravd
editor: ''

ms.assetid: ecece14d-5f92-4596-bbaf-5204addb95c2
ms.service: site-recovery
ms.devlang: powershell
ms.tgt_pltfrm: na
ms.topic: article
ms.workload: required
ms.date: 10/23/2016
ms.author: ruturajd@microsoft.com

---
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

    ![](media/site-recovery-runbook-automation-new/essentials-rp.PNG)
- - -
1. Click on the customize button to begin adding a runbook. This will open the recovery plan customize blade.

    ![](media/site-recovery-runbook-automation-new/customize-rp.PNG)


1. Right click on the start group 1 and select to add a 'Add post action'.
2. Select to choose a script in the new blade.
3. Name the script 'Hello World'.
4. Choose an Automation Account name. This is the Azure Automation account. Note that this account can be in any Azure geography but has to be in the same subscription as the Site Recovery vault.
5. Select a runbook from the Automation Account. This is the script that will run during the execution of the recovery plan after the recovery of first group.

    ![](media/site-recovery-runbook-automation-new/update-rp.PNG)
6. Select OK to save the script. This will add the script to the post action group of Group 1: Start.

    ![](media/site-recovery-runbook-automation-new/addedscript-rp.PNG)


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

| **Variable name** | **Description** |
| --- | --- |
| RecoveryPlanName |Name of plan being run. Helps you take action based on name using the same script |
| FailoverType |Specifies whether the failover is test, planned, or unplanned. |
| FailoverDirection |Specify whether recovery is to primary or secondary |
| GroupID |Identify the group number within the recovery plan when the plan is running |
| VmMap |Array of all the virtual machines in the group |
| VMMap key |Unique key (GUID) for each VM. It's the same as the VMM ID of the virtual machine where applicable. |
| RoleName |Name of the Azure VM that's being recovered |
| CloudServiceName |Azure Cloud Service name under which the virtual machine is created. |
| CloudServiceName (in Resource Manager deployment model) |Azure Resource Group name under which the virtual machine is created. |

## Using complex variables per recovery plan
Sometimes, a runbook requires more information than just the RecoveryPlanContext. There is no first class mechanism to pass a parameter to a runbook. However, if you want to use the same script via multiple recovery plans you can use the Recovery Plan Context variable 'RecoveryPlanName' and use the below experimental technique to use an Azure Automation complex variable in a runbook. The example below shows how you can create three different complex variable assets and use them in the runbook based on the name of the recovery plan.

Consider that you want to use 3 additional parameters in a runbook. Let us encode them into a JSON form
{"Var1":"testautomation","Var2":"Unplanned","Var3":"PrimaryToSecondary"}

Use [AA complex variable](../automation/automation-variables.md#variable-types) to create a new Automation asset.
Name the variable as <RecoveryPlanName>-params.
You can use the reference here to create a [complex variable](https://msdn.microsoft.com/library/dn913767.aspx?f=255&MSPPError=-2147217396).

For different recovery plans, name the variable as

1. recoveryPlanName1>-params
2. recoveryPlanName2>-params
3. recoveryPlanName3>-params

Now, in the script refer to the params as

1. Get the RP name from the $rpname = $Recoveryplancontext variable
2. Get asset of $paramValue = "$($rpname)-params"
3. Use this as a complex variable for the recovery plan by calling Get-AzureAutomationVariable [-AutomationAccountName] <String> -Name $paramValue.

As an example, to get the complex variable/parameter for the SharepointApp recovery plan, create an Azure Automation complex variable called 'SharepointApp-params'.

Use it in the recovery plan by extracting the variable from the asset using the statement Get-AzureAutomationVariable [-AutomationAccountName] <String> [-Name] $paramValue. [Reference this for more details](https://msdn.microsoft.com/library/dn913772.aspx)

This way the same script can be used for different recovery plan by storing the plan specific complex variable in the assets.

## Sample scripts
For a repository of scripts that you can directly import into your automation account, please see [Kristian Nese's OMS repository for scripts](https://github.com/krnese/AzureDeploy/tree/master/OMS/MSOMS/Solutions/asrautomation)

The script here is an Azure Resource Manager template that will deploy all the below scripts

* NSG

The NSG runbook will assign Public IP addresses to every VM within the Recovery Plan and attach their virtual network adapters to a Network Security Group that will allow default communication

* PublicIP

The Public IP runbook will assign Public IP addresses to every VM within the Recovery Plan. Access to the machines and applications will depend on the firewall settings within each guest

* CustomScript

The CustomScript runbook will assign Public IP addresses to every VM within the Recovery Plan and install a custom script extension that will pull the script you refer to during deployment of the template

* NSGwithCustomScript

The NSGwithCustomScript runbook will assign Public IP addresses to every VM within the Recovery Plan, install a custom script using extension and connect the virtual network adapters to a NSG allowing default inbound and outbound communication for remote access

## Additional Resources
[Azure Automation Service Run as Account](../automation/automation-sec-configure-azure-runas-account.md)

[Azure Automation Overview](http://msdn.microsoft.com/library/azure/dn643629.aspx "Azure Automation Overview")

[Sample Azure Automation Scripts](http://gallery.technet.microsoft.com/scriptcenter/site/search?f\[0\].Type=User&f\[0\].Value=SC%20Automation%20Product%20Team&f\[0\].Text=SC%20Automation%20Product%20Team "Sample Azure Automation Scripts")
