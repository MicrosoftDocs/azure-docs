---
title: About the Mobility Service for disaster recovery of VMware VMs and physical servers with Azure Site Recovery | Microsoft Docs
description: Learn about the Mobility Service agent for disaster recovery of VMware VMs and physical servers to Azure using the Azure Site Recovery service.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 11/27/2018
ms.author: ramamill
---


# About the Mobility service for VMware VMs and physical servers

When you set up disaster recovery for VMware VMs and physical servers using [Azure Site Recovery](site-recovery-overview.md), you install the Site Recovery Mobility service on each on-premises VMware VM and physical server.  The Mobility service captures data writes on the machine, and forwards them to the Site Recovery process server. You can deploy the Mobility Service using the following methods:

[Push installation](vmware-azure-install-mobility-service.md): Configure Site Recovery to perform a push installation of the Mobility service: To do this, when you set up disaster recovery, you also set up an account that the Site Recovery process server can use to access the VM or physical server for the purposes of installing the service.
[Install manually](vmware-physical-mobility-service-install-manual.md): You can install the Mobility service manually on each machine using the UI or command prompt.
[Automated deployment](vmware-azure-mobility-install-configuration-mgr.md): You can automate installation with software deployment tools such as System Center Configuration Manager.

## Azure Virtual Machine agent

- **Windows VMs**: From version 9.7.0.0 of the Mobility service, the [Azure VM agent](../virtual-machines/extensions/features-windows.md#azure-vm-agent) is installed by the Mobility service installer. This ensures that when the machine fails over to Azure, the Azure VM meets the agent installation prerequisite for using any Vm extension.
- **Linux VMs**: The  [WALinuxAgent](https://docs.microsoft.com/azure/virtual-machines/extensions/update-linux-agent) must be installed manually on the Azure VM after failover.

## Installer files

The table summarizes the installer files for each VMware VM and physical server operating system. You can review [supported operating systems](vmware-physical-azure-support-matrix.md#replicated-machines) before you start.


**Installer file** | **Operating system (64-bit only)** 
--- | ---
Microsoft-ASR\_UA\*Windows\*release.exe | Windows Server 2016; Windows Server 2012 R2; Windows Server 2012; Windows Server 2008 R2 SP1 
Microsoft-ASR\_UA\*RHEL6-64\*release.tar.gz | Red Hat Enterprise Linux (RHEL) 6.* </br> CentOS 6.*
Microsoft-ASR\_UA\*RHEL7-64\*release.tar.gz | Red Hat Enterprise Linux (RHEL) 7.* </br> CentOS 7.* 
Microsoft-ASR\_UA\*SLES12-64\*release.tar.gz | SUSE Linux Enterprise Server 12 SP1,SP2,SP3 
Microsoft-ASR\_UA\*SLES11-SP3-64\*release.tar.gz| SUSE Linux Enterprise Server 11 SP3 
Microsoft-ASR\_UA\*SLES11-SP4-64\*release.tar.gz| SUSE Linux Enterprise Server 11 SP4 
Microsoft-ASR\_UA\*OL6-64\*release.tar.gz | Oracle Enterprise Linux 6.4, 6.5
Microsoft-ASR\_UA\*UBUNTU-14.04-64\*release.tar.gz | Ubuntu Linux 14.04
Microsoft-ASR\_UA\*UBUNTU-16.04-64\*release.tar.gz | Ubuntu Linux 16.04 LTS server
Microsoft-ASR_UA\*DEBIAN7-64\*release.tar.gz | Debian 7 
Microsoft-ASR_UA\*DEBIAN8-64\*release.tar.gz | Debian 8

## Anti-virus on replicated machines

If machines you want to replicate have active anti-virus software running, make sure you exclude the Mobility service installation folder from anti-virus operations (*C:\ProgramData\ASR\agent*). This ensures that replication works as expected.

## Update the Mobility service

1. Before you start ensure that the configuration server, scale-out process servers, and any master target servers that are a part of your deployment are updated before you update the Mobility Service on protected machines.
2. In the portal open the vault > **Replicated items**.
3. If the configuration server is the latest version, you see a notification that reads "New Site recovery replication agent update is available. Click to install."

     ![Replicated items window](./media/vmware-azure-install-mobility-service/replicated-item-notif.png)

4. Click the notification, and in **Agent update**, select the machines on which you want to upgrade the Mobility service. Then click **OK**.

     ![Replicated items VM list](./media/vmware-azure-install-mobility-service/update-okpng.png)

5. The Update Mobility Service job starts for each of the selected machines.

## Update the acount used for push installation of the Mobility service

When you deployed Site Recovery, to enable push installation of the Mobility service, you specified an account that the Site Recovery process server uses to access the machines and install the service when replication is enabled for the machine. If you want to update the credentials for this account, follow [these instructions](vmware-azure-manage-configuration-server.md).

## Uninstall the Mobility service

### On a Windows machine

Uninstall from the UI or from a command prompt.

- **From the UI**: In the Control Panel of the machine, select **Programs**. Select **Microsoft Azure Site Recovery Mobility Service/Master Target server** > **Uninstall**.
- **From a command prompt**: Open a command prompt window as an administrator on the machine. Run the following command: 
    ```
    MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
    ```

## On a Linux machine
1. On the Linux machine, sign in as a **root** user.
2. In a terminal, go to /user/local/ASR.
3. Run the following command:

    ```
    uninstall.sh -Y
    ```

## Next steps

[Set up push installation for the Mobility service](vmware-azure-install-mobility-service.md).
