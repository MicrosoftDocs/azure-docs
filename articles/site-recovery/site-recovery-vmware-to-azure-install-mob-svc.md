---
title: Install Mobility Service (VMware or physical to Azure) | Microsoft Docs
description: Learn how to install the Mobility Service agent to protect your on-premises computers.
services: site-recovery
documentationcenter: ''
author: AnoopVasudavan
manager: gauravd
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: backup-recovery
ms.date: 06/29/2017
ms.author: anoopkv
---

# Install Mobility Service (VMware or physical to Azure)
Azure Site Recovery Mobility Service captures data writes on a computer, and then forwards them to the process server. Deploy Mobility Service to every computer (VMware VM or physical server) that you want to replicate to Azure. You can deploy Mobility Service to the servers that you want to protect by using the following methods:


* [Install Mobility Service by using software deployment tools like System Center Configuration Manager](site-recovery-install-mobility-service-using-sccm.md)
* [Install Mobility Service by using Azure Automation and Desired State Configuration (Automation DSC)](site-recovery-automate-mobility-service-install.md)
* [Install Mobility Service manually by using the graphical user interface (GUI)](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-manually-by-using-the-gui)
* [Install Mobility Service manually at a command prompt](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-manually-at-a-command-prompt)
* [Install Mobility Service by push installation from Azure Site Recovery](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-by-push-installation-from-azure-site-recovery)


>[!IMPORTANT]
> Beginning with version 9.7.0.0, on Windows virtual machines (VMs), the Mobility Service installer also installs the latest available [Azure VM agent](../virtual-machines/windows/extensions-features.md#azure-vm-agent). When a computer fails over to Azure, the computer meets the agent installation prerequisite for using any VM extension.

## Prerequisites
Complete these prerequisite steps before you manually install Mobility Service on your server:
1. Sign in to your configuration server, and then open a Command Prompt window as an administrator.
2. Change the directory to the bin folder, and then create a passphrase file:

    ```
    cd %ProgramData%\ASR\home\svsystems\bin
    genpassphrase.exe -v > MobSvc.passphrase
    ```
3. Store the passphrase file in a secure location. You use the file during the Mobility Service installation.
4. Mobility Service installers for all supported operating systems are in the %ProgramData%\ASR\home\svsystems\pushinstallsvc\repository folder.

### Mobility Service installer-to-operating system mapping

| Installer file template name| Operating system |
|---|--|
|Microsoft-ASR\_UA\*Windows\*release.exe | Windows Server 2008 R2 SP1 (64-bit) </br> Windows Server 2012 (64-bit) </br> Windows Server 2012 R2 (64-bit) |
|Microsoft-ASR\_UA\*RHEL6-64*release.tar.gz| Red Hat Enterprise Linux (RHEL) 6.4, 6.5, 6.6, 6.7, 6.8 (64-bit only) </br> CentOS 6.4, 6.5, 6.6, 6.7, 6.8 (64-bit only) |
|Microsoft-ASR\_UA\*RHEL7-64\*release.tar.gz | Red Hat Enterprise Linux (RHEL) 7.1, 7.2 (64-bit only) </br> CentOS 7.0, 7.1, 7.2 (64-bit only)</br> CentOs 7.3 (migration only) |
|Microsoft-ASR\_UA\*SLES11-SP3-64\*release.tar.gz| SUSE Linux Enterprise Server 11 SP3 (64-bit only)|
|Microsoft-ASR\_UA\*SLES11-SP4-64\*release.tar.gz| SUSE Linux Enterprise Server 11 SP4 (64-bit only)|
|Microsoft-ASR\_UA\*OL6-64\*release.tar.gz | Oracle Enterprise Linux 6.4, 6.5 (64-bit only)|
|Microsoft-ASR\_UA\*UBUNTU-14.04-64\*release.tar.gz | Ubuntu Linux 14.04 (64-bit only)|


## Install Mobility Service manually by using the GUI

>[!IMPORTANT]
> If you are using a **Configuration Server** to replicate **Azure IaaS virtual machines** from one Azure Subscription/Region to another then **use the Command-line based installation** method

[!INCLUDE [site-recovery-install-mob-svc-gui](../../includes/site-recovery-install-mob-svc-gui.md)]

## Install Mobility Service manually at a command prompt

### Command-line installation on a Windows computer
[!INCLUDE [site-recovery-install-mob-svc-win-cmd](../../includes/site-recovery-install-mob-svc-win-cmd.md)]

### Command-line installation on a Linux computer
[!INCLUDE [site-recovery-install-mob-svc-lin-cmd](../../includes/site-recovery-install-mob-svc-lin-cmd.md)]


## Install Mobility Service by push installation from Azure Site Recovery
To do a push installation of Mobility Service by using Site Recovery, all target computers must meet the following prerequisites.

[!INCLUDE [site-recovery-prepare-push-install-mob-svc-win](../../includes/site-recovery-prepare-push-install-mob-svc-win.md)]

[!INCLUDE [site-recovery-prepare-push-install-mob-svc-lin](../../includes/site-recovery-prepare-push-install-mob-svc-lin.md)]


> [!NOTE]
After Mobility Service is installed, in the Azure portal, select the **Replicate** button to start protecting these VMs.

## Uninstall Mobility Service on a Windows Server computer
Use one of the following methods to uninstall Mobility Service on a Windows Server computer.

### Uninstall by using the GUI
1. In Control Panel, select **Programs**.
2. Select **Microsoft Azure Site Recovery Mobility Service/Master Target server**, and then select **Uninstall**.

### Uninstall at a command prompt
1. Open a Command Prompt window as an administrator.
2. To uninstall Mobility Service, run the following command:

```
MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
```

## Uninstall Mobility Service on a Linux computer
1. On your Linux server, sign in as a **root** user.
2. In a terminal, go to /user/local/ASR.
3. To uninstall Mobility Service, run the following command:

```
uninstall.sh -Y
```
