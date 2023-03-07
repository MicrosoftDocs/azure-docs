---
title: Remove servers and disable protection | Microsoft Docs
description: This article describes how to unregister servers from a Site Recovery vault, and to disable protection for virtual machines and physical servers.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 06/18/2019
ms.author: ankitadutta

---

# Remove servers and disable protection

This article describes how to unregister servers from a Recovery Services vault, and how to disable protection for machines protected by Site Recovery.


## Unregister a  configuration server

If you replicate VMware VMs or Windows/Linux physical servers to Azure, you can unregister an unconnected configuration server from a vault as follows:

1. [Disable protection of virtual machines](#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure).
2. [Disassociate or delete](vmware-azure-set-up-replication.md#disassociate-or-delete-a-replication-policy) replication policies.
3. [Delete the configuration server](vmware-azure-manage-configuration-server.md#delete-or-unregister-a-configuration-server)

## Unregister a VMM server

1. Stop replicating virtual machines in clouds on the VMM server you want to remove.
2. Delete any network mappings used by clouds on the VMM server that you want to delete. In **Site Recovery Infrastructure** > **For System Center VMM** > **Network Mapping**, right-click the network mapping > **Delete**.
3. Note the ID of the VMM server.
4. Disassociate replication policies from clouds on the VMM server you want to remove.  In **Site Recovery Infrastructure** > **For System Center VMM** >  **Replication Policies**, double-click the associated policy. Right-click the cloud > **Disassociate**.
5. Delete the VMM server or active node. In **Site Recovery Infrastructure** > **For System Center VMM** > **VMM Servers**, right-click the server > **Delete**.
6. If your VMM server was in a Disconnected state, then download and run the [cleanup script](unregister-vmm-server-script.md) on the VMM server. Open PowerShell with the **Run as Administrator** option, to change the execution policy for the default (LocalMachine) scope. In the script, specify the ID of the VMM server you want to remove. The script removes registration and cloud pairing information from the server.
5. Run the cleanup script on any secondary VMM server.
6. Run the  cleanup script on any other passive VMM cluster nodes that have the Provider installed.
7. Uninstall the Provider manually on the VMM server. If you have a cluster, remove from all nodes.
8. If your virtual machines were replicating to Azure, you need to uninstall the Microsoft Recovery Services agent from Hyper-V hosts in the deleted clouds.

## Unregister a Hyper-V host in a Hyper-V Site

Hyper-V hosts that aren't managed by VMM are gathered into a Hyper-V site. Remove a host in a Hyper-V site as follows:

1. Disable replication for Hyper-V VMs located on the host.
2. Disassociate policies for the Hyper-V site. In **Site Recovery Infrastructure** > **For Hyper-V Sites** >  **Replication Policies**, double-click the associated policy. Right-click the site > **Disassociate**.
3. Delete Hyper-V hosts. In **Site Recovery Infrastructure** > **For Hyper-V Sites** > **Hyper-V Hosts**, right-click the server > **Delete**.
4. Delete the Hyper-V site after all hosts have been removed from it. In **Site Recovery Infrastructure** > **For Hyper-V Sites** > **Hyper-V Sites**, right-click the site > **Delete**.
5. If your Hyper-V host was in a **Disconnected** state, then run the following script on each Hyper-V host that you removed. The script cleans up settings on the server, and unregisters it from the vault.


```powershell
        pushd .
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
            $idMgmtCloudContainerId='IdMgmtCloudContainerId'


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
                if($regNode.IdMgmtCloudContainerId -ne $null)
                {
                    "Removing IdMgmtCloudContainerId"
                    Remove-ItemProperty -Path $asrHivePath -Name $idMgmtCloudContainerId
                }
                "Registry keys removed."
            }

            # First retrieve all the certificates to be deleted
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
            Write-Host "Error occurred" -ForegroundColor "Red"
            $error[0]
            Write-Host "FAILED" -ForegroundColor "Red"
        }
        popd
```


## Disable protection for a VMware VM or physical server (VMware to Azure)

1. In **Protected Items** > **Replicated Items**, right-click the machine > **Disable replication**.
2. In **Disable replication** page, select one of these options:
    - **Disable replication and remove (recommended)** - This option remove the replicated item from Azure Site Recovery and the replication for the machine is stopped. Replication configuration on Configuration Server is cleaned up and Site Recovery billing for this protected server is stopped. Note that this option can only be used when Configuration Server is in connected state.
    - **Remove** - This option is  supposed to be used only if the source environment is deleted or not accessible (not connected). This removes the replicated item from Azure Site Recovery (billing is stopped). Replication configuration on the Configuration Server **will not** be cleaned up.

> [!NOTE]
> In both the options mobility service will not be uninstalled from the protected servers, you need to uninstall it manually. If you plan to protect the server again using the same Configuration server, you can skip uninstalling the mobility service.

> [!NOTE]
> If you have already failed over a VM and it is running in Azure, note that disable protection doesn't remove / affect the failed over VM.
## Disable protection for a Azure VM (Azure to Azure)

-  In **Protected Items** > **Replicated Items**, right-click the machine > **Disable replication**.
> [!NOTE]
> mobility service will not be uninstalled from the protected servers, you need to uninstall it manually. If you plan to protect the server again, you can skip uninstalling the mobility service.

## Disable protection for a Hyper-V virtual machine (Hyper-V to Azure)

> [!NOTE]
> Use this procedure if you're replicating Hyper-V VMs to Azure without a VMM server. If you are replicating your virtual machines using the **System Center VMM to Azure** scenario, then follow the instructions Disable protection for a Hyper-V virtual machine replicating using the System Center VMM to Azure scenario

1. In **Protected Items** > **Replicated Items**, right-click the machine > **Disable replication**.
2. In **Disable replication**, you can select the following options:
   - **Disable replication and remove (recommended)** -  This option remove the replicated item from Azure Site Recovery and the replication for the machine is stopped. Replication configuration on the on-premises virtual machine will be cleaned up and Site Recovery billing for this protected server is stopped.
   - **Remove** - This option is  supposed to be used only if the source environment is deleted or not accessible (not connected). This removes the replicated item from Azure Site Recovery (billing is stopped). Replication configuration on the on-premises virtual machine **will not** be cleaned up.

    > [!NOTE]
    > If you chose the **Remove** option then run the following set of scripts to clean up the replication settings on-premises Hyper-V Server.

    > [!NOTE]
    > If you have already failed over a VM and it is running in Azure, note that disable protection doesn't remove / affect the failed over VM.

1. On the source Hyper-V host server, to remove replication for the virtual machine. Replace SQLVM1 with the name of your virtual machine and run the script from an administrative PowerShell

```powershell
    $vmName = "SQLVM1"
    $vm = Get-WmiObject -Namespace "root\virtualization\v2" -Query "Select * From Msvm_ComputerSystem Where ElementName = '$vmName'"
    $replicationService = Get-WmiObject -Namespace "root\virtualization\v2"  -Query "Select * From Msvm_ReplicationService"
    $replicationService.RemoveReplicationRelationship($vm.__PATH)
```

## Disable protection for a Hyper-V virtual machine replicating to Azure using the System Center VMM to Azure scenario

1. In **Protected Items** > **Replicated Items**, right-click the machine > **Disable replication**.
2. In **Disable replication**, select one of these options:

   - **Disable replication and remove (recommended)** -  This option remove the replicated item from Azure Site Recovery and the replication for the machine is stopped. Replication configuration on the on-premises virtual machine is cleaned up and Site Recovery billing for this protected server is stopped.
   - **Remove** - This option is  supposed to be used only if the source environment is deleted or not accessible (not connected). This removes the replicated item from Azure Site Recovery (billing is stopped). Replication configuration on the on-premises virtual machine **will not** be cleaned up.

     > [!NOTE]
     > If you chose the **Remove** option, then tun the following scripts to clean up the replication settings on-premises VMM Server.
3. Run this script on the source VMM server, using PowerShell (administrator privileges required) from the VMM console. Replace the placeholder **SQLVM1** with the name of your virtual machine.

    ```powershell
    $vm = get-scvirtualmachine -Name "SQLVM1"
    Set-SCVirtualMachine -VM $vm -ClearDRProtection
    ```

4. The above steps clear the replication settings on the VMM server. To stop replication for the virtual machine running on the Hyper-V host server, run this script. Replace SQLVM1 with the name of your virtual machine, and host01.contoso.com with the name of the Hyper-V host server.

```powershell
    $vmName = "SQLVM1"
    $hostName  = "host01.contoso.com"
    $vm = Get-WmiObject -Namespace "root\virtualization\v2" -Query "Select * From Msvm_ComputerSystem Where ElementName = '$vmName'" -computername $hostName
    $replicationService = Get-WmiObject -Namespace "root\virtualization\v2"  -Query "Select * From Msvm_ReplicationService"  -computername $hostName
    $replicationService.RemoveReplicationRelationship($vm.__PATH)
```

## Disable protection for a Hyper-V virtual machine replicating to secondary VMM Server using the System Center VMM to VMM scenario

1. In **Protected Items** > **Replicated Items**, right-click the machine > **Disable replication**.
2. In **Disable replication**, select one of these options:

   - **Disable replication and remove (recommended)** -  This option remove the replicated item from Azure Site Recovery and the replication for the machine is stopped. Replication configuration on the on-premises virtual machine is cleaned up and Site Recovery billing for this protected server is stopped.
   - **Remove** - This option is  supposed to be used only if the source environment is deleted or not accessible (not connected). This removes the replicated item from Azure Site Recovery (billing is stopped). Replication configuration on the on-premises virtual machine **will not** be cleaned up. Run the following set of scripts to clean up the replication settings on-premises virtual machines.
     > [!NOTE]
     > If you chose the **Remove** option, then tun the following scripts to clean up the replication settings on-premises VMM Server.

3. Run this script on the source VMM server, using PowerShell (administrator privileges required) from the VMM console. Replace the placeholder **SQLVM1** with the name of your virtual machine.

    ```powershell
    $vm = get-scvirtualmachine -Name "SQLVM1"
    Set-SCVirtualMachine -VM $vm -ClearDRProtection
    ```

4. On the secondary VMM server, run this script to clean up the settings for the secondary virtual machine:

    ```powershell
    $vm = get-scvirtualmachine -Name "SQLVM1"
    Remove-SCVirtualMachine -VM $vm -Force
    ```

5. On the secondary VMM server, refresh the virtual machines on the Hyper-V host server, so that the secondary VM gets detected again in the VMM console.
6. The above steps clear up the replication settings on the VMM server. If you want to stop replication for the virtual machine, run the following script oh the primary and secondary VMs. Replace SQLVM1 with the name of your virtual machine.

    ```powershell
    Remove-VMReplication –VMName "SQLVM1"
    ```
