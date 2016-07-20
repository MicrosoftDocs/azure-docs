<properties
   pageTitle="Using JSON formatted tags to create a schedule for Azure VM startup and shutdown | Microsoft Azure"
   description="This article demonstrates how to use JSON strings on tags to automate the scheduling of VM startup and shutdown."
   services="automation"
   documentationCenter=""
   authors="MGoedtel"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/18/2016"
   ms.author="magoedte;paulomarquesc" />

# Azure Automation scenario: Using JSON-formatted tags to create a schedule for Azure VM startup and shutdown

Customers often want to schedule the startup and shutdown of virtual machines to help reduce subscription costs or support business and technical requirements.  

The following scenario enables you to set up automated startup and shutdown of your VMs by using a tag called Schedule at a resource group level or virtual machine level in Azure. This schedule can be configured from Sunday to Saturday with a startup time and shutdown time.  

We do have some out-of-the-box options. These include:
-  [Virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) with auto scale settings that enable you to scale in or out.
- [DevTest Labs](../devtest-lab/devtest-lab-overview.md) service, which has the built-in capability of scheduling startup and shutdown operations.

However, these options only support specific scenarios and cannot be applied to IaaS VMs.   

When the Schedule tag is applied to a resource group, it's also applied to all virtual machines inside that resource group. If a schedule is also directly applied to a VM, the last schedule takes precedence in the following order:

1.  Schedule applied to a resource group
2.  Schedule applied to a resource group and virtual machine in the resource group
3.  Schedule applied to a virtual machine

This scenario essentially takes a JSON string with a specified format and adds it as a the value for a tag called Schedule.  Then a runbook lists all resource groups and virtual machines and identifies the schedules for each VM based on the scenarios listed earlier. Next it loops through the VMs that have schedules attached and evaluates what action should be taken. For example, it determines which VMs need to be stopped, shut down, or ignored.

These runbooks authenticate by using the [Azure Run As account](../automation/automation-sec-configure-azure-runas-account.md).

## Download the runbooks for the scenario

This scenario consists of four PowerShell Workflow runbooks that you can download from the [TechNet Gallery](https://gallery.technet.microsoft.com/Azure-Automation-Runbooks-84f0efc7) or the [GitHub](https://github.com/paulomarquesdacosta/azure-automation-scheduled-shutdown-and-startup) repository for this project.

Runbook | Description
----------|----------
Test-ResourceSchedule | Checks each virtual machine schedule and performs shutdown or startup depending on the schedule
Add-ResourceSchedule | Adds the Schedule tag to a VM or resource group
Update-ResourceSchedule | Modifies the existing Schedule tag by replacing it with a new one
Remove-ResourceSchedule | Removes the Schedule tag from a VM or resource group


## Install and configure this scenario

### Install and publish the runbooks

After downloading the runbooks, you can import them by using the procedure in [Creating or importing a runbook in Azure Automation](automation-creating-importing-runbook.md#importing-a-runbook-from-a-file-into-Azure-Automation).  Publish each runbook after it has been successfully imported into your Automation account.


### Add a schedule to the Test-ResourceSchedule runbook

Follow these steps to enable the schedule for the Test-ResourceSchedule runbook.  This is the runbook that verifies which virtual machines will be started, shut down, or left as is.

1. From the Azure portal, open your Automation account, and then click the  **Runbooks** tile.
2. On the **Test-ResourceSchedule** blade, click the **Schedules** tile.
3. On the **Schedules** blade, click **Add a schedule**.
4. On the **Schedules** blade, select **Link a schedule to your runbook**. Then select **Create a new schedule**.
5.  On the **New schedule** blade, type in the name of this schedule, for example: HourlyExecution.
6. For the schedule **Start**, set start time to an hour increment.  
7. Select **Recurrence**, and for **Reoccur every** interval select **1 hour** .
8. Verify that **Set expiration** is set to **No**, and then click **Create** to save your new schedule.
9. On the **Schedule Runbook** options blade, select **Parameters and run settings**. In the Test-ResourceSchedule **Parameters** blade, enter the name of your subscription in the **SubscriptionName** field.  This is the only parameter that's required for the runbook.  When you're finished, click **OK**.  


The runbook schedule should look like the following when it's completed:

![Configured Test-ResourceSchedule runbook](./media/automation-scenario-start-stop-vm-wjson-tags/automation-schedule-config.png)<br>

## Schedule JSON format

This solution basically takes a JSON string with a specified format and adds it as a the value for a tag called Schedule. Then a runbook lists all resource groups and virtual machines and identifies the schedules for each virtual machine.

The runbook loops over the virtual machines that have schedules attached and checks what actions should be taken. The following is an example of how the solutions should be formatted:

    {
       "TzId": "Eastern Standard Time",
        "0": {  
           "S": "11",
           "E": "17"
        },
        "1": {
           "S": "9",
           "E": "19"
        },
        "2": {
           "S": "9",
           "E": "19"
        },
    }

Here is some detailed information about this structure:

1. The format of this JSON structure is optimized to work around the 256-character limitation of a single tag value in Azure.

2. *TzId* represents the time zone of the virtual machine.  This ID can be obtained by using the TimeZoneInfo .NET class in a PowerShell session-- **[System.TimeZoneInfo]::GetSystemTimeZones()**.

    ![GetSystemTimeZones in PowerShell](./media/automation-scenario-start-stop-vm-wjson-tags/automation-get-timzone-powershell.png)

    - Weekdays are represented with a numeric value of zero to six.  The value 0 equals Sunday.
    - The start time is represented with the **S** attribute, and its value is in a 24-hour format.
    - The end or shutdown time is represented with the **E** attribute, and its value is in a 24-hour format.

    If the **S** and **E** attributes each have a value of zero (0), the virtual machine will be left in its present state at the time of evaluation.   

3. If you want to skip evaluation for a specific day of the week, don’t add the section of related day of week.  In the following example, only Monday is evaluated, and the other days of the week are ignored:

        {
          "TzId": "Eastern Standard Time",
           "1": {
             "S": "11",
             "E": "17"
           }
        }

## Tag resource groups or VMs

To shut down VMs, you need to tag either the VMs or the resource groups where they're located. Virtual machines that don't have a Schedule tag are not evaluated. Therefore, they aren't started or shut down.

There are two ways to tag resource groups or VMs with this solution. You can do it directly from the portal. Or you can use the **Add-ResourceSchedule**, **Update-ResourceSchedule** and **Remove-ResourceSchedule** runbooks.

### Tag through the portal

Follow these steps to tag a virtual machine or resource group in the portal.

1. Flatten the JSON string and verify that there aren't any spaces.  Your JSON string should look like this:

        {"TzId":"Eastern Standard Time","0":{"S":"11","E":"17"},"1":{"S":"9","E":"19"},"2": {"S":"9","E":"19"},"3":{"S":"9","E":"19"},"4":{"S":"9","E":"19"},"5":{"S":"9","E":"19"},"6":{"S":"11","E":"17"}}


2. Select the **Tag** icon for a VM or resource group to apply this schedule.

![VM tag option](./media/automation-scenario-start-stop-vm-wjson-tags/automation-vm-tag-option.png)    
3. Tags are defined following a Key/Value pair. Type **Schedule** in the **Key** field, and paste the JSON string into **Value** field. Then click **Save**.  Your new tag should now appear in the list of tags for your resource.

![VM schedule tag](./media/automation-scenario-start-stop-vm-wjson-tags/automation-vm-schedule-tag.png)


### Tag from PowerShell

All imported runbooks contain help information at the beginning of the script that describes how to execute the runbooks directly from PowerShell. The Add-ScheduleResource and Update-ScheduleResource runbooks can be called from PowerShell by passing required parameters that enable you to create or update the Schedule tag on a VM or resource group outside of the portal.  

To create, add, and delete tags through PowerShell, you first need to [set up your PowerShell environment for Azure](../powershell-install-configure.md). After you have completed the setup, you can proceed with the following steps.

### Create a schedule tag with PowerShell

1. Open a PowerShell session. Then run the following to authenticate with your Run As account and to specify a subscription:   

        Conn = Get-AutomationConnection -Name AzureRunAsConnection
        Add-AzureRMAccount -ServicePrincipal -Tenant $Conn.TenantID `
        -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint
        Select-AzureRmSubscription -SubscriptionName "MySubscription"

2. Define a schedule hash table. Here is an example of how it should be constructed:

        $schedule= @{ "TzId"="Eastern Standard Time"; "0"= @{"S"="11";"E"="17"};"1"= @{"S"="9";"E"="19"};"2"= @{"S"="9";"E"="19"};"3"= @{"S"="9";"E"="19"};"4"= @{"S"="9";"E"="19"};"5"= @{"S"="9";"E"="19"};"6"= @{"S"="11";"E"="17"}}

3. Define the parameters that are required by the runbook. In the following example, we are targeting a VM:

        $params = @{"SubscriptionName"="MySubscription";"ResourceGroupName"="ResourceGroup01"; `
        "VmName"="VM01";"Schedule"=$schedule}

    If you’re tagging a resource group, remove the *VMName* parameter from the $params hash table as follows:

        $params = @{"SubscriptionName"="MySubscription";"ResourceGroupName"="ResourceGroup01"; `
        "Schedule"=$schedule}

4. Run the **Add-ResourceSchedule** runbook with the following parameters to create the Schedule tag:

        Start-AzureRmAutomationRunbook -Name "Add-ResourceSchedule" -Parameters $params `
        -AutomationAccountName "AutomationAccount" -ResourceGroupName "ResourceGroup01"

5. To update a resource group or virtual machine tag, execute the **Update-ResourceSchedule** runbook with the following parameters:

        Start-AzureRmAutomationRunbook -Name "Update-ResourceSchedule" -Parameters $params `
        -AutomationAccountName "AutomationAccount" -ResourceGroupName "ResourceGroup01"

### Remove a schedule tag with PowerShell

1. Open a PowerShell session and run the following to authenticate with your Run As account and select and specify a subscription:

        Conn = Get-AutomationConnection -Name AzureRunAsConnection
        Add-AzureRMAccount -ServicePrincipal -Tenant $Conn.TenantID `
        -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint
        Select-AzureRmSubscription -SubscriptionName "MySubscription"

2. Define the parameters that are required by the runbook. In the following example, we are targeting a VM:

        $params = @{"SubscriptionName"="MySubscription";"ResourceGroupName"="ResourceGroup01" `
        ;"VmName"="VM01"}

    If you’re removing a tag from a resource group, remove the *VMName* parameter from the $params hash table as follows:

        $params = @{"SubscriptionName"="MySubscription";"ResourceGroupName"="ResourceGroup01"}

3. Execute the **Remove-ResourceSchedule** runbook to remove the Schedule tag:

        Start-AzureRmAutomationRunbook -Name "Remove-ResourceSchedule" -Parameters $params `
        -AutomationAccountName "AutomationAccount" -ResourceGroupName "ResourceGroup01"

4. To update a resource group or virtual machine tag, execute the **Remove-ResourceSchedule** runbook with the following parameters:

        Start-AzureRmAutomationRunbook -Name "Remove-ResourceSchedule" -Parameters $params `
        -AutomationAccountName "AutomationAccount" -ResourceGroupName "ResourceGroup01"


>[AZURE.NOTE] It is recommended you proactively monitor these runbooks (and the virtual machine states) to verify that your virtual machines are being shut down and started accordingly.  

To view the details of the **Test-ResourceSchedule** runbook job in the Azure portal, select the **Jobs** tile of the runbook. The job summary displays the input parameters and the Output Stream, in addition to general information about the job and any exceptions if they occurred.  

The **Job Summary** includes messages from the output stream and warning and error streams. Select the **Output** tile to view detailed results from the runbook execution.

![Test-ResourceSchedule Output](./media/automation-scenario-start-stop-vm-wjson-tags/automation-job-output.png)  

## Next steps

-  To get started with PowerShell workflow runbooks, see [My first PowerShell workflow runbook](automation-first-runbook-textual.md).
-  To learn more about runbook types, and their advantages and limitations, see [Azure Automation runbook types](automation-runbook-types.md).
-  For more information about PowerShell script support features, see [Native PowerShell script support in Azure Automation](https://azure.microsoft.com/blog/announcing-powershell-script-support-azure-automation-2/).
-  To learn more about runbook logging and output, see [Runbook output and messages in Azure Automation](automation-runbook-output-and-messages.md).
-  To learn more about an Azure Run As account and how to authenticate your runbooks by using it, see [Authenticate runbooks with Azure Run As account](../automation/automation-sec-configure-azure-runas-account.md).
