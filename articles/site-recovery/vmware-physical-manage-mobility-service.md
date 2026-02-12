---
title: Manage the Mobility agent for VMware/physical servers with Azure Site Recovery
description: Manage Mobility Service agent for disaster recovery of VMware VMs and physical servers to Azure using the  Azure Site Recovery service.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.date: 02/12/2026
# Customer intent: As an IT administrator managing disaster recovery for VMware VMs and physical servers, I want to efficiently update and manage the Mobility agent, so that I can ensure reliable data replication and recovery to Azure.
---

# Manage the Mobility agent

You set up the mobility agent on your server when you use Azure Site Recovery for disaster recovery of VMware VMs and physical servers to Azure. The mobility agent coordinates communications between your protected machine and the configuration server or scale-out process server. It also manages data replication. This article summarizes common tasks for managing the mobility agent after you deploy it.

>[!TIP]
>To download the installer for a specific OS or Linux distro, refer to the guidance [here](vmware-physical-mobility-service-overview.md#locate-installer-files). To automatically update from the portal, you don't need to download the installer. [ASR automatically fetches the installer from configuration server and updates the agent](#update-mobility-service-from-azure-portal).

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Update mobility service from Azure portal

1. Before you start, ensure that the configuration server, scale-out process servers, and any master target servers that are part of your deployment are updated before you update the Mobility Service on protected machines.
    1. From version 9.36 onwards, for SUSE Linux Enterprise Server 11 SP3, RHEL 5, and Debian 7, ensure the latest installer is [available on the configuration server and scale-out process server](vmware-physical-mobility-service-overview.md#download-latest-mobility-agent-installer-for-suse-11-sp3-suse-11-sp4-rhel-5-cent-os-5-debian-7-debian-8-debian-9-oracle-linux-6-and-ubuntu-1404-server).
1. In the portal, open the vault > **Replicated items**.
1. If the configuration server is the latest version, you see a notification that reads "New Site recovery replication agent update is available. Click to install."

     :::image type="content" source="./media/vmware-azure-install-mobility-service/replicated-item-notif.png" alt-text="Replicated items window.":::

1. Select the notification. In **Agent update**, select the machines on which you want to upgrade the Mobility service. Then select **OK**.

     :::image type="content" source="./media/vmware-azure-install-mobility-service/update-okpng.png" alt-text="Replicated items VM list.":::

1. The **Update Mobility Service** job starts for each of the selected machines. The process updates the mobility agent to the version of the configuration server. For example, if the configuration server is on version 9.33, the process updates the mobility agent on a protected VM to version 9.33.

## Update Mobility service through PowerShell script on Windows server

Before you start, make sure that the configuration server, scale-out process servers, and any master target servers that are part of your deployment are updated. Update these servers before you update the Mobility Service on protected machines.

Use the following script to upgrade the Mobility Service on a server through a PowerShell cmdlet.

```azurepowershell
Update-AzRecoveryServicesAsrMobilityService -ReplicationProtectedItem $rpi -Account $fabric.fabricSpecificDetails.RunAsAccounts[0]
```

## Update Mobility service manually on each protected server

1. Before you start, ensure that the configuration server, scale-out process servers, and any master target servers that are part of your deployment are updated before you update the Mobility Service on protected machines.

1. [Locate the agent installer](vmware-physical-mobility-service-overview.md#locate-installer-files) based on the operating system of the server.

>[!IMPORTANT]
> If you're replicating Azure IaaS VMs from one Azure region to another, don't use this method. For information about all available options, see [our guidance](azure-to-azure-autoupdate.md).

1. Copy the installation file to the protected machine, and run it to update the Mobility Service.

## Update account used for push installation of Mobility service

When you deployed Site Recovery, to enable push installation of the Mobility service, you specified an account that the Site Recovery process server uses to access the machines and install the service when replication is enabled for the machine. If you want to update the credentials for this account, follow [these instructions](vmware-azure-manage-configuration-server.md#modify-credentials-for-mobility-service-installation).

## Uninstall Mobility service

### On a Windows machine

Uninstall the service from the UI or from a command prompt.

- **From the UI**: In the Control Panel of the machine, select **Programs**. Select **Microsoft Azure Site Recovery Mobility Service/Master Target server** > **Uninstall**.
- **From a command prompt**: Open a command prompt window as an administrator on the machine. Run the following command:
    ```
    MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
    ```

### On a Linux machine
1. On the Linux machine, sign in as a **root** user.
1. In a terminal, go to `/usr/local/ASR`.
1. Run the following command:
   ```bash
   ./uninstall.sh -Y
   ```

## Install Site Recovery VSS provider on source machine

You need the Azure Site Recovery VSS provider on the source machine to generate application consistency points. If the installation of the provider didn't succeed through push installation, follow the guidelines in this section to install it manually.

1. Open an admin command prompt window.
1. Go to the mobility service installation location. For example, `C:\Program Files (x86)\Microsoft Azure Site Recovery\agent`.
1. Run the script `InMageVSSProvider_Uninstall.cmd`. This step uninstalls the service if it already exists.
1. Run the script `InMageVSSProvider_Install.cmd` to install the VSS provider manually.

## Next steps

- [Set up disaster recovery for VMware VMs](vmware-azure-tutorial.md)
- [Set up disaster recovery for physical servers](physical-azure-disaster-recovery.md)
