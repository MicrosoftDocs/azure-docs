---
title: Add a script to a recovery plan for disaster recovery with Azure Site Recovery | Microsoft Docs
description: Learn how to add a VMM script to a recovery plan for disaster recovery of Hyper-V VMs in VMM clouds. 
author: rajani-janaki-ram
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 11/27/2018
ms.author: rajanaki

---
# Add a VMM script to a recovery plan

This article describes how to create a System Center Virtual Machine Manager (VMM) script and add it to a recovery plan in [Azure Site Recovery](site-recovery-overview.md).

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Prerequisites

You can use PowerShell scripts in your recovery plans. To be accessible from the recovery plan, you must author the script and place the script in the VMM library. Keep the following considerations in mind while you write the script:

* Ensure that scripts use try-catch blocks, so that exceptions are handled gracefully.
    - If an exception occurs in the script, the script stops running, and the task shows as failed.
    - If an error occurs, the remainder of the script doesn't run.
    - If an error occurs when you run an unplanned failover, the recovery plan continues.
    - If an error occurs when you run a planned failover, the recovery plan stops. Fix the script, check that it runs as expected, and then run the recovery plan again.
        - The `Write-Host` command doesn’t work in a recovery plan script. If you use the `Write-Host` command in a script, the script fails. To create output, create a proxy script that in turn runs your main script. To ensure that all output is piped out, use the **\>\>** command.
        - The script times out if it doesn't return within 600 seconds.
        - If anything is written to STDERR, the script is classified as failed. This information is displayed in the script execution details.

* Scripts in a recovery plan run in the context of the VMM service account. Ensure that this account has read permissions for the remote share on which the script is located. Test the script to run with the same level of user rights as the VMM service account.
* VMM cmdlets are delivered in a Windows PowerShell module. The module is installed when you install the VMM console. To load the module into your script, use the following command in the script: 

    `Import-Module -Name virtualmachinemanager`

    For more information, see [Get started with Windows PowerShell and VMM](https://technet.microsoft.com/library/hh875013.aspx).
* Ensure that you have at least one library server in your VMM deployment. By default, the library share path for a VMM server is located locally on the VMM server. The folder name is MSCVMMLibrary.

  If your library share path is remote (or if it's local but not shared with MSCVMMLibrary), configure the share as follows, using \\libserver2.contoso.com\share\ as an example:
  
  1. Open the Registry Editor, and then go to **HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\Azure Site Recovery\Registration**.

  1. Change the value for **ScriptLibraryPath** to **\\\libserver2.contoso.com\share\\**. Specify the full FQDN. Provide permissions to the share location. This is the root node of the share. To check for the root node, in VMM, go to the root node in the library. The path that opens is the root of the path. This is the path that you must use in the variable.

  1. Test the script by using a user account that has the same level of user rights as the VMM service account. Using these user rights verifies that standalone, tested scripts run the same way that they run in recovery plans. On the VMM server, set the execution policy to bypass, as follows:

     a. Open the **64-bit Windows PowerShell** console as an administrator.
     
     b. Enter **Set-executionpolicy bypass**. For more information, see [Using the Set-ExecutionPolicy cmdlet](https://technet.microsoft.com/library/ee176961.aspx).

     > [!IMPORTANT]
     > Set **Set-executionpolicy bypass** only in the 64-bit PowerShell console. If you set it for the 32-bit PowerShell console, the scripts don't run.

## Add the script to the VMM library

If you have a VMM source site, you can create a script on the VMM server. Then, include the script in your recovery plan.

1. In the library share, create a new folder. For example, \<VMM server name>\MSSCVMMLibrary\RPScripts. Place the folder on the source and target VMM servers.
1. Create the script. For example, name the script RPScript. Verify that the script works as expected.
1. Place the script in the \<VMM server name>\MSSCVMMLibrary folder on the source and target VMM servers.

## Add the script to a recovery plan

After you've added VMs or replication groups to a recovery plan and created the plan, you can add the script to the group.

1. Open the recovery plan.
1. In the **Step** list, select an item. Then, select either **Script** or **Manual Action**.
1. Specify whether to add the script or action before or after the selected item. To move the position of the script up or down, select the **Move Up** and **Move Down** buttons.
1. If you add a VMM script, select **Failover to VMM script**. In **Script Path**, enter the relative path to the share. For example, enter **\RPScripts\RPScript.PS1**.
1. If you add an Azure Automation runbook, specify the Automation account in which the runbook is located. Then, select the Azure runbook script that you want to use.
1. To ensure that the script works as expected, do a test failover of the recovery plan.


## Next steps
* Learn more about [running failovers](site-recovery-failover.md).

