---
title: Use VMware HCX Run Commands 
description: Use VMware HCX Run Commands in Azure VMware Solution
ms.topic: how-to
ms.service: azure-vmware
ms.custom: engagement-fy23
ms.date: 3/22/2024
---

# Use VMware HCX Run Commands
In this article, learn how to use VMware HCX Run Commands. Use run commands to perform operations that would normally require elevated privileges through a collection of PowerShell cmdlets. This document outlines the available VMware HCX Run Commands and how to use them. 

## Restart VMware HCX Manager 

This Command checks for active VMware HCX migrations and replications. If none are found, it restarts the VMware HCX Cloud Manager (VMware HCX VM's guest OS). 

1. Navigate to the Run Command panel under Operations in an Azure VMware Solution private cloud on the Azure portal. Select package "Microsoft.AVS.HCX" to view available HCX run commands.  
   
1. Select the **Microsoft.AVS.HCX** package dropdown menu and select the **Restart-HcxManager** command. 
1. Set parameters and select **Run**. 
Optional run command parameters.   

    If the parameters are used incorrectly, they can halt active migrations, and replications and cause other issues. Brief description of each parameter with an example of when it should be used.  
    
    **Hard Reboot Parameter** - Restarts the virtual machine instead of the default of a GuestOS Reboot. This command is like pulling the power plug on a machine. We don't want to risk disk corruption so a hard reboot should only be used if a normal reboot fails, and all other options are exhausted.  
    
    **Force Parameter** - If there are ANY active HCX migrations/replications, this parameter avoids the check for active HCX migrations/replications. If the Virtual machine is in a powered off state, this parameter powers the machine on.  

    **Scenario 1**: A customer has a migration that is stuck in an active state for weeks and they need a restart of HCX for a separate issue. Without this parameter, the script fails due to the detection of the active migration. 
    **Scenario 2**: The VMware HCX Cloud Manager is powered off and the customer would like to power it back on.

    :::image type="content" source="media/hcx-commands/restart-command.png" alt-text="Diagram that shows run command parameters for Restart-HcxManager command." border="false" lightbox="media/hcx-commands/restart-command.png":::   

1. Wait for command to finish. It can take few minutes for the VMware HCX appliance to come online. 

## Scale VMware HCX manager  
Use the Scale VMware HCX Cloud Manager Run Command to increase the resource allocation of your VMware HCX Cloud Manager virtual machine to 8 vCPUs and 24-GB RAM from the default setting of 4 vCPUs and 12-GB RAM, ensuring scalability. 

**Scenario**: Mobility Optimize Networking (MON) requires VMware HCX Scalability. For more details on [MON scaling](https://kb.vmware.com/s/article/88401)  

>[!NOTE] 
> VMware HCX Cloud Manager will be rebooted during this operation, and this may affect any ongoing migration processes. 

1. Navigate to the Run Command panel on in an Azure VMware Solution private cloud on the Azure portal. 

1. Select the **Microsoft.AVS.HCX** package dropdown menu and select the **Set-HcxScaledCpuAndMemorySetting** command.
 
    :::image type="content" source="media/hcx-commands/set-hcx-scale.png" alt-text="Diagram that shows run command parameters for Set-HcxScaledCpuAndMemorySetting command." border="false" lightbox="media/hcx-commands/set-hcx-scale.png"::: 
 
1. Agree to restart VMware HCX by toggling ``AgreeToRestartHCX`` to **True**. 
    You need to acknowledge that the virtual machine will be restarted.  
    
     
    >[!NOTE]
    > If this required parameter is set to false that cmdlet execution will fail. 

1. Select **Run** to execute.
    This process takes between 10-15 minutes.  
   
    >[!NOTE]
    > VMware HCX cloud manager will be unavailable during the scaling. 

## Take a snapshot of VMware HCX Cloud Manager 

1. Navigate to the Run Command panel on in an Azure VMware Solution private cloud on the Azure portal. 

2. Select the **Microsoft.AVS.HCX** package dropdown menu and select the **New-HCXManagerSnapshot** command.

3. Specify Optional Command parameters as needed. Available command parameters available are as below:
**Description** - A description for the snapshot.
**Force** - Force parameter bypasses the alert of active HCX migrations or replications, allowing the snapshot to be created even if these processes are in progress. If any warnings are triggered, the snapshot creation proceeds regardless of the detected conditions.
**Memory** - Memory snapshots preserve the live state of a virtual machine, allowing for precise recovery if an upgrade or change does not go as expected. They do not require quiescing, ensuring an exact capture of the VM's running state. If memory is not included, the snapshot saves only disk data, which remains crash-consistent unless explicitly quiesced.
**Quiesce** - Quiescing a virtual machine ensures that its file system is in a consistent state when a snapshot is taken. This is useful for automated or periodic backups, especially when the VM's activity is unknown. Quiesced snapshots require VMware Tools and are unavailable if the VM is powered off or has large-capacity disks.

4. Select **Run** to execute.

  >[!NOTE]
  > Snapshots created via run commands are retained for 72 hours and will be automatically deleted without prior notice.

## List all snapshots on VMware HCX Cloud Manager

1. Navigate to the Run Command panel on in an Azure VMware Solution private cloud on the Azure portal. 

1. Select the **Microsoft.AVS.HCX** package dropdown menu and select the **Get-HCXManagerSnapshot** command.

1. Select **Run** to execute.

1. The snapshot details will be displayed under the **Output** tab. <br>


## Update the description of the existing snapshot for VMware HCX Cloud Manager

1. Navigate to the Run Command panel on in an Azure VMware Solution private cloud on the Azure portal. 

2. Select the **Microsoft.AVS.HCX** package dropdown menu and select the **Update-HCXManagerSnapshotDescription** command.

3. Specify mandatory Command parameters as described below:
 **SnapshotName** - Name of the snapshot. You can use **Get-HCXManagerSnaphot** run command to list existing snapshots.
 **NewDescription** - A description for the snapshot.

4. Select **Run** to execute.

## Delete VMware HCX Cloud Manager snapshot

1. Navigate to the Run Command panel on in an Azure VMware Solution private cloud on the Azure portal. 

2. Select the **Microsoft.AVS.HCX** package dropdown menu and select the **Remove-HCXManagerSnapshot** command.

3. Specify mandatory Command parameters as described below:
 **SnapshotName** - Name of the snapshot.

4. Specify Optional Command parameters as needed. Available command parameters available are as below:
 **RunAsync** - Indicates that the command returns immediately without waiting for the task to complete. In this mode, the output of the cmdlet is a Task object.
 **Force** - If any warnings are triggered, the snapshot deletion proceeds regardless of the detected conditions. 
 **EnableDebug** - Indicates that the cmdlet is run only to display the changes that would be made and actually no objects are modified.


 ## Next step
To learn more about Run Commands, see [Run Commands](using-run-command.md).
