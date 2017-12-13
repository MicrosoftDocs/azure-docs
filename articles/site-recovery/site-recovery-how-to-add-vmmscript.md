---
title: How to add scripts to recovery plan in Azure Site Recovery | Microsoft Docs
description: Describes the pre-requisites in adding a new script to a recovery plan in VMM to Azure
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: shons
editor: ''

ms.assetid: 72408c62-fcb6-4ee2-8ff5-cab1218773f2
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 12/13/2017
ms.author: ruturaj

---
# Add VMM scripts to recovery plan


This article provides information about creating and adding VMM scripts for recovery plans in [Azure Site Recovery](site-recovery-overview.md).

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Pre-requisites of adding a script to recovery plan

You can use PowerShell scripts in your recovery plans. You will need to author them and place them in the VMM library to be accessible from the recovery plan. Below are some considerations while you write the script.

* Ensure that scripts use try-catch blocks so that the exceptions are handled gracefully.
    - If there is an exception in the script, it stops running and the task shows as failed.
    - If an error occurs, any remaining part of the script doesn't run.
    - If an error occurs when you run an unplanned failover, the recovery plan continues.
    - If an error occurs when you run a planned failover, the recovery plan stops. You need to fix the script, check that it runs as expected, and then run the recovery plan again.
        - The Write-Host command doesn’t work in a recovery plan script, and the script will fail. To create output, create a proxy script that in turn runs your main script. Make sure that all output is piped out using the >> command.
        - The script times out if it doesn't return within 600 seconds.
        - If anything is written out to STDERR, the script is classified as failed. This information is displayed in the script execution details.

* Scripts in a recovery plan run in the context of the VMM Service account. Make sure this account has Read permissions for the remote share on which the script is located. Test the script to run at the VMM service account privilege level.
* VMM cmdlets are delivered in a Windows PowerShell module. The module is installed when you install the VMM console. It can be loaded into your script, using the following command in the script:
   - Import-Module -Name virtualmachinemanager. [Learn more](https://technet.microsoft.com/library/hh875013.aspx).
* Ensure you have at least one library server in your VMM deployment. By default, the library share path for a VMM server is located locally on the VMM server, with the folder name MSCVMMLibrary.
    * If your library share path is remote (or local but not shared with MSCVMMLibrary), configure the share as follows (using \\libserver2.contoso.com\share\ as an example):
      * Open the Registry Editor and navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\Azure Site Recovery\Registration**.
      * Edit the value **ScriptLibraryPath** and place it as \\libserver2.contoso.com\share\. Specify the full FQDN. Provide permissions to the share location. Note that this is the root node of the share. **To check this, you can browse the library at the root node in VMM. The path that opens will be the root of the path - the one you will need to use in the variable**.
      * Ensure that you test the script with a user account that has the same permissions as the VMM service account. This checks that standalone tested scripts run in the same way as they will in recovery plans. On the VMM server, set the execution policy to bypass as follows:
        * Open the **64-bit Windows PowerShell** console using elevated privileges.
        * Type: **Set-executionpolicy bypass**. [Learn more](https://technet.microsoft.com/library/ee176961.aspx).

> [!IMPORTANT]
> You should set execution policy to Bypass on the 64-bit powershell only. If you have set it for the 32-bit powershell, the scripts will not exeute.

## Add the script to the VMM library

If you have a VMM source site, you can create a script on the VMM server, and include it in your recovery plan.

1. Create a new folder in the library share. For example, \<VMMServerName>\MSSCVMMLibrary\RPScripts. Place it on the source and target VMM servers.
2. Create the script (for example RPScript), and check it works as expected.
3. Place the script in the location \<VMMServerName>\MSSCVMMLibrary, on the source and target VMM servers.

## Add the script to a recovery plan

You can add the script to the group after you've added VMs or replication groups to it, and created the plan.

1. Open the recovery plan.
2. Click an item in the **Step** list, and then click **Script** or **Manual Action**.
3. Specify whether to want to add the script or action before or after the selected item. Use the **Move Up** and **Move Down**  buttons, to move the position of the script up or down.
4. If you add a VMM script, select **Failover to VMM script**. In **Script Path**, type the relative path to the share. In the VMM example below, you specify the path: **\RPScripts\RPScript.PS1**.
5. If you add an Azure automation run book, specify the Azure Automation account in which the runbook is located, and select the appropriate Azure runbook script.
6. Do a test failover of the recovery plan, to make sure the script works as expected.


## Next steps

[Learn more](site-recovery-failover.md) about running failovers.
