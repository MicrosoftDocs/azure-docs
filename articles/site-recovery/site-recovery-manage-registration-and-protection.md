---
title: Remove servers and disable protection | Microsoft Docs
description: This article describes how to unregister servers from a Site Recovery vault, and to disable protection for virtual machines and physical servers.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: cfreeman
editor: ''

ms.assetid: ef1f31d5-285b-4a0f-89b5-0123cd422d80
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 03/27/2017
ms.author: raynew

---

# Remove servers and disable protection

The Azure Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy. The service orchestrates replication, failover and recovery of virtual machines and physical servers. Machines can be replicated to Azure, or to a secondary on-premises data center. For a quick overview read [What is Azure Site Recovery?](site-recovery-overview.md)

This article describes how to unregister servers from a Recovery Services vault in the Azure portal, and how to disable protection for machines protected by Site Recovery.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Unregister a connected configuration server

If you replicate VMware VMs or Windows/Linux physical servers to Azure, you can unregister a connected configuration server from a vault as follows:

1. Disable machine protection. In **Protected Items** > **Replicated Items**, right-click the machine > **Delete**.
2. Disassociate any policies. In **Site Recovery Infrastructure** > **For VMWare & Physical Machines** > **Replication Policies**, double-click the associated policy. Right-click the configuration server > **Disassociate**.
3. Remove any additional on-premises process or master target servers. In **Site Recovery Infrastructure** > **For VMWare & Physical Machines** > **Configuration Servers**, right-click the server > **Delete**.
4. Delete the configuration server.
5. Manually uninstall the Mobility service running on the master target server (this will be either a separate server, or running on the configuration server).
6. Uninstall any additional process servers.
7. Uninstall the configuration server.
8. On the configuration server, uninstall the instance of MySQL that was installed by Site Recovery.
9. In the registry of the configuration server delete the key ``HKEY_LOCAL_MACHINE\Software\Microsoft\Azure Site Recovery``.

## Unregister a unconnected configuration server

If you replicate VMware VMs or Windows/Linux physical servers to Azure, you can unregister an unconnected configuration server from a vault as follows:

1. Disable machine protection. In **Protected Items** > **Replicated Items**, right-click the machine > **Delete**. Select **Stop managing the machine**.
2. Remove any additional on-premises process or master target servers. In **Site Recovery Infrastructure** > **For VMWare & Physical Machines** > **Configuration Servers**, right-click the server > **Delete**.
3. Delete the configuration server.
4. Manually uninstall the Mobility service running on the master target server (this will be either a separate server, or running on the configuration server).
5. Uninstall any additional process servers.
6. Uninstall the configuration server.
7. On the configuration server, uninstall the instance of MySQL that was installed by Site Recovery.
8. In the registry of the configuration server delete the key ``HKEY_LOCAL_MACHINE\Software\Microsoft\Azure Site Recovery``.

## Unregister a connected VMM server

As a best practice, we recommend that you unregister the VMM server when it's connected to Azure. This ensures that settings on the VMM servers (and on other VMM servers with paired clouds) are cleaned up properly. You should only remove an unconnected server if there's a permanent issue with connectivity. If the VMM server isn’t connected, you will need to manually run a script to clean up settings.

1. Stop replicating VMs in clouds on the VMM server you want to remove.
2. Delete any network mappings used by clouds on the VMM server you want to delete. In **Site Recovery Infrastructure** > **For System Center VMM** > **Network Mapping**, right-click the network mapping > **Delete**.
3. Disassociate replication policies from clouds on the VMM server you want to remove.  In **Site Recovery Infrastructure** > **For System Center VMM** >  **Replication Policies**, double-click the associated policy. Right-click the cloud > **Disassociate**.
4. Delete the VMM server or active VMM node. In **Site Recovery Infrastructure** > **For System Center VMM** > **VMM Servers**, right-click the server > **Delete**.
5. Uninstall the Provider manually on the VMM server. If you have a cluster, remove from all nodes.
6. If you're replicating to Azure, manually remove the Microsoft Recovery Services agent from Hyper-V hosts in the deleted clouds.



### Unregister an unconnected VMM server

1. Stop replicating VMs in clouds on the VMM server you want to remove.
2. Delete any network mappings used by clouds on the VMM server that you want to delete. In **Site Recovery Infrastructure** > **For System Center VMM** > **Network Mapping**, right-click the network mapping > **Delete**.
3. Note the ID of the VMM server.
4. Disassociate replication policies from clouds on the VMM server you want to remove.  In **Site Recovery Infrastructure** > **For System Center VMM** >  **Replication Policies**, double-click the associated policy. Right-click the cloud > **Disassociate**.
5. Delete the VMM server or active node. In **Site Recovery Infrastructure** > **For System Center VMM** > **VMM Servers**, right-click the server > **Delete**.
6. Download and run the [cleanup script](http://aka.ms/asr-cleanup-script-vmm) on the VMM server. Open PowerShell with the **Run as Administrator** option, to change the execution policy for the default (LocalMachine) scope. In the script, specify the ID of the VMM server you want to remove. The script removes registration and cloud pairing information from the server.
5. Run the cleanup script on any other VMM servers that contain clouds that are paired with clouds on the VMM server you want to remove.
6. Run the  cleanup script on any other passive VMM cluster nodes that have the Provider installed.
7. Uninstall the Provider manually on the VMM server. If you have a cluster, remove from all nodes.
8. If you replicating to Azure, you can remove the Microsoft Recovery Services agent from Hyper-V hosts in the deleted clouds.

## Unregister a Hyper-V host in a Hyper-V Site

Hyper-V hosts that aren't managed by VMM are gathered into a Hyper-V site. Remove a host in a Hyper-V site as follows:

1. Disable replication for Hyper-V VMs located on the host.
2. Disassociate policies for the Hyper-V site. In **Site Recovery Infrastructure** > **For Hyper-V Sites** >  **Replication Policies**, double-click the associated policy. Right-click the site > **Disassociate**.
3. Delete Hyper-V hosts. In **Site Recovery Infrastructure** > **For System Center VMM** > **Hyper-V Hosts**, right-click the server > **Delete**.
4. Delete the Hyper-V site after all hosts have been removed from it. In **Site Recovery Infrastructure** > **For System Center VMM** > **Hyper-V Sites**, right-click the site > **Delete**.
5. Run the following script on each Hyper-V host that you removed. The script cleans up settings on the server, and unregisters it from the vault.


        `` pushd .
        try
        {
             $windowsIdentity=[System.Security.Principal.WindowsIdentity]::GetCurrent()
             $principal=new-object System.Security.Principal.WindowsPrincipal($windowsIdentity)
             $administrators=[System.Security.Principal.WindowsBuiltInRole]::Administrator
             $isAdmin=$principal.IsInRole($administrators)
             if (!$isAdmin)
             {
                "Please run the script as an administrator in elevated mode."
                $choice = Read-Host
                return;       
             }

            $error.Clear()    
            "This script will remove the old Azure Site Recovery Provider related properties. Do you want to continue (Y/N) ?"
            $choice =  Read-Host

            if (!($choice -eq 'Y' -or $choice -eq 'y'))
            {
            "Stopping cleanup."
            return;
            }

            $serviceName = "dra"
            $service = Get-Service -Name $serviceName
            if ($service.Status -eq "Running")
            {
                "Stopping the Azure Site Recovery service..."
                net stop $serviceName
            }

            $asrHivePath = "HKLM:\SOFTWARE\Microsoft\Azure Site Recovery"
            $registrationPath = $asrHivePath + '\Registration'
            $proxySettingsPath = $asrHivePath + '\ProxySettings'
            $draIdvalue = 'DraID'

            if (Test-Path $asrHivePath)
            {
                if (Test-Path $registrationPath)
                {
                    "Removing registration related registry keys."    
                    Remove-Item -Recurse -Path $registrationPath
                }

                if (Test-Path $proxySettingsPath)
            {
                    "Removing proxy settings"
                    Remove-Item -Recurse -Path $proxySettingsPath
                }

                $regNode = Get-ItemProperty -Path $asrHivePath
                if($regNode.DraID -ne $null)
                {            
                    "Removing DraId"
                    Remove-ItemProperty -Path $asrHivePath -Name $draIdValue
                }
                "Registry keys removed."
            }

            # First retrive all the certificates to be deleted
            $ASRcerts = Get-ChildItem -Path cert:\localmachine\my | where-object {$_.friendlyname.startswith('ASR_SRSAUTH_CERT_KEY_CONTAINER') -or $_.friendlyname.startswith('ASR_HYPER_V_HOST_CERT_KEY_CONTAINER')}
            # Open a cert store object
            $store = New-Object System.Security.Cryptography.X509Certificates.X509Store("My","LocalMachine")
            $store.Open('ReadWrite')
            # Delete the certs
            "Removing all related certificates"
            foreach ($cert in $ASRcerts)
            {
                $store.Remove($cert)
            }
        }catch
        {    
            [system.exception]
            Write-Host "Error occured" -ForegroundColor "Red"
            $error[0]
            Write-Host "FAILED" -ForegroundColor "Red"
        }
        popd``



## Disable protection for a VMware VM or physical server

1. In **Protected Items** > **Replicated Items**, right-click the machine > **Delete**.
2. In **Remove Machine**, select one of these options:
    - **Disable protection for the machine (recommended)**. Use this option to stop replicating the machine. Site Recovery settings will be cleaned up automatically. You will only see this option in the following circumstances:
        - **You've resized the VM volume**—When you resize a volume the virtual machine goes into a critical state. Select this option to disables protection while retaining recovery points in Azure. When you enable protection for the machine again, the data for the resized volume will be transferred to Azure.
        - **You've recently run a failover**—After you've run a failover to test your environment, select this option to start protecting on-premises machines again. It disables each virtual machine, and then you need to enable protection for them again. Disabling the machine with this setting doesn't affect the replica virtual machine in Azure. Don't uninstall the Mobility service from the machine.
    - **Stop managing the machine**. If you select this option, the machine will only be removed from the vault. On-premises protection settings for the machine won’t be affected. To remove settings on the machine, and to remove the machine from the Azure subscription, you need to clean the settings by uninstalling the Mobility service.

## Disable protection for a Hyper-V VM in a VMM cloud

1. In **Protected Items** > **Replicated Items**, right-click the machine > **Delete**.
2. In **Remove Machine**, select one of these options:

    - **Disable protection for the machine (recommended)**. Use this option to stop replicating the machine. Site Recovery settings will be cleaned up automatically.
    - **Stop managing the machine**. If you select this option, the machine will only be removed from the vault. On-premises protection settings for the machine won’t be affected. To remove settings on the machine, and to remove the machine from the Azure subscription, you need to clean the settings up manually, using the instructions below. Note that if you select to delete the virtual machine and its hard disks, they'll be removed from the target location.

### Clean up protection settings - replication to a secondary VMM site

If you selected **Stop managing the machine** and you replicating to a secondary site, run this script on the primary server to clean up the settings for the primary virtual machine. In the VMM console click the PowerShell button to open the VMM PowerShell console. Replace SQLVM1 with the name of your virtual machine.

         ``$vm = get-scvirtualmachine -Name "SQLVM1"
         Set-SCVirtualMachine -VM $vm -ClearDRProtection``
2. On the secondary VMM server run this script to clean up the settings for the secondary virtual machine:

        ``$vm = get-scvirtualmachine -Name "SQLVM1"
        Remove-SCVirtualMachine -VM $vm -Force``
3. On the secondary VMM server, refresh the virtual machines on the Hyper-V host server, so that the secondary VM gets detected again in the VMM console.
4. The above steps clear up the replication settings on the VMM server. If you want to stop replication for the virtual machine, run the following script oh the primary and secondary VMs. Replace SQLVM1 with the name of your virtual machine.

        ``Remove-VMReplication –VMName “SQLVM1”``

### Clean up protection settings - replication to Azure

1. If you selected **Stop managing the machine** and you replicate to Azure, run this script on the source VMM server, using PowerShell from the VMM console.
        ``$vm = get-scvirtualmachine -Name "SQLVM1"
        Set-SCVirtualMachine -VM $vm -ClearDRProtection``
2. The above steps clear the replication settings on the VMM server. To stop replication for the virtual machine running on the Hyper-V host server, run this script. Replace SQLVM1 with the name of your virtual machine, and host01.contoso.com with the name of the Hyper-V host server.

        ``$vmName = "SQLVM1"
        $hostName  = "host01.contoso.com"
        $vm = Get-WmiObject -Namespace "root\virtualization\v2" -Query "Select * From Msvm_ComputerSystem Where ElementName = '$vmName'" -computername $hostName
        $replicationService = Get-WmiObject -Namespace "root\virtualization\v2"  -Query "Select * From Msvm_ReplicationService"  -computername $hostName
        $replicationService.RemoveReplicationRelationship($vm.__PATH)``


## Disable protection for a Hyper-V VM in a Hyper-V Site

Use this procedure if you're replicating Hyper-V VMs to Azure without a VMM server.

1. In **Protected Items** > **Replicated Items**, right-click the machine > **Delete**.
2. In **Remove Machine**, you can select the following options:

   - **Disable protection for the machine (recommended)**. Use this option to stop replicating the machine. Site Recovery settings will be cleaned up automatically.
   - **Stop managing the machine**. If you select this option the machine will only be removed from the vault. On-premises protection settings for the machine won’t be affected. To remove settings on the machine, and to remove the virtual machine from the Azure subscription, you need to clean the settings up manually. If you select to delete the virtual machine and its hard disks they will be removed from the target location.
3. If you selected **Stop managing the machine**, run this script on the source Hyper-V host server, to remove replication for the virtual machine. Replace SQLVM1 with the name of your virtual machine.

        $vmName = "SQLVM1"
        $vm = Get-WmiObject -Namespace "root\virtualization\v2" -Query "Select * From Msvm_ComputerSystem Where ElementName = '$vmName'"
        $replicationService = Get-WmiObject -Namespace "root\virtualization\v2"  -Query "Select * From Msvm_ReplicationService"
        $replicationService.RemoveReplicationRelationship($vm.__PATH)
