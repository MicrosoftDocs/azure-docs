---
title: Install Mobility Service (VMware or physical to Azure) | Microsoft Docs
description: Learn how to install the Mobility Service agent to protect your on-premises VMware VMs and physical servers with Azure Site Recovery.
author: Rajeswari-Mamilla
ms.service: site-recovery
ms.topic: article
ms.date: 07/06/2018
ms.author: ramamill
---

# Install the Mobility service 

Azure Site Recovery Mobility Service is installed on VMware VMs and physical servers that you want to replicate to Azure. The service captures data writes on a computer and then forwards them to the process server. Deploy Mobility Service to every computer (VMware VM or physical server) that you want to replicate to Azure. You can deploy the Mobility Service on the servers and VMware VMs you want to protect using the following methods:


* [Install using software deployment tools like System Center Configuration Manager](vmware-azure-mobility-install-configuration-mgr.md)
* [Install with Azure Automation and Desired State Configuration (Automation DSC)](vmware-azure-mobility-deploy-automation-dsc.md)
* [Install manually from the UI](vmware-azure-install-mobility-service.md#install-mobility-service-manually-by-using-the-gui)
* [Install manually from a command prompt](vmware-azure-install-mobility-service.md#install-mobility-service-manually-at-a-command-prompt)
* [Install using the Site Recovery push installation](vmware-azure-install-mobility-service.md#install-mobility-service-by-push-installation-from-azure-site-recovery)


>[!IMPORTANT]
> Beginning with version 9.7.0.0, **on Windows VMs**, the Mobility Service installer also installs the latest available [Azure VM agent](../virtual-machines/extensions/features-windows.md#azure-vm-agent). When a computer fails over to Azure, the computer meets the agent installation prerequisite for using any VM extension.
> </br>On **Linux VMs**, WALinuxAgent has to be manually installed.

## Prerequisites
Complete these prerequisite steps before you manually install Mobility Service on your server:
1. Sign in to your configuration server, and then open a command prompt window as an administrator.
2. Change the directory to the bin folder, and then create a passphrase file.

    ```
    cd %ProgramData%\ASR\home\svsystems\bin
    genpassphrase.exe -v > MobSvc.passphrase
    ```
3. Store the passphrase file in a secure location. You use the file during Mobility Service installation.
4. Mobility Service installers for all supported operating systems are in the %ProgramData%\ASR\home\svsystems\pushinstallsvc\repository folder.

### Mobility Service installer-to-operating system mapping

To see a list of Operating System versions with a compatible Mobility Service package refer to the list of [supported operating systems for VMware virtual machines and physical servers](vmware-physical-azure-support-matrix.md#replicated-machines).

| Installer file template name| Operating system |
|---|--|
|Microsoft-ASR\_UA\*Windows\*release.exe | Windows Server 2008 R2 SP1 (64-bit) </br> Windows Server 2012 (64-bit) </br> Windows Server 2012 R2 (64-bit) </br> Windows Server 2016 (64-bit) |
|Microsoft-ASR\_UA\*RHEL6-64\*release.tar.gz | Red Hat Enterprise Linux (RHEL) 6.* (64-bit only) </br> CentOS 6.* (64-bit only) |
|Microsoft-ASR\_UA\*RHEL7-64\*release.tar.gz | Red Hat Enterprise Linux (RHEL) 7.* (64-bit only) </br> CentOS 7.* (64-bit only) |
|Microsoft-ASR\_UA\*SLES12-64\*release.tar.gz | SUSE Linux Enterprise Server 12 SP1,SP2,SP3 (64-bit only)|
|Microsoft-ASR\_UA\*SLES11-SP3-64\*release.tar.gz| SUSE Linux Enterprise Server 11 SP3 (64-bit only)|
|Microsoft-ASR\_UA\*SLES11-SP4-64\*release.tar.gz| SUSE Linux Enterprise Server 11 SP4 (64-bit only)|
|Microsoft-ASR\_UA\*OL6-64\*release.tar.gz | Oracle Enterprise Linux 6.4, 6.5 (64-bit only)|
|Microsoft-ASR\_UA\*UBUNTU-14.04-64\*release.tar.gz | Ubuntu Linux 14.04 (64-bit only)|
|Microsoft-ASR\_UA\*UBUNTU-16.04-64\*release.tar.gz | Ubuntu Linux 16.04 LTS server (64-bit only)|
|Microsoft-ASR_UA\*DEBIAN7-64\*release.tar.gz | Debian 7 (64-bit only)|
|Microsoft-ASR_UA\*DEBIAN8-64\*release.tar.gz | Debian 8 (64-bit only)|

## Install Mobility Service manually by using the GUI

>[!IMPORTANT]
> If you use a configuration server to replicate Azure IaaS virtual machines from one Azure subscription/region to another, use the command-line-based installation method.

[!INCLUDE [site-recovery-install-mob-svc-gui](../../includes/site-recovery-install-mob-svc-gui.md)]

## Install Mobility Service manually at a command prompt

### Command-line installation on a Windows computer
[!INCLUDE [site-recovery-install-mob-svc-win-cmd](../../includes/site-recovery-install-mob-svc-win-cmd.md)]

### Command-line installation on a Linux computer
[!INCLUDE [site-recovery-install-mob-svc-lin-cmd](../../includes/site-recovery-install-mob-svc-lin-cmd.md)]


## Install Mobility Service by push installation from Azure Site Recovery
You can do a push installation of Mobility Service by using Site Recovery. All target computers must meet the following prerequisites.

[!INCLUDE [site-recovery-prepare-push-install-mob-svc-win](../../includes/site-recovery-prepare-push-install-mob-svc-win.md)]

[!INCLUDE [site-recovery-prepare-push-install-mob-svc-lin](../../includes/site-recovery-prepare-push-install-mob-svc-lin.md)]


> [!NOTE]
After Mobility Service is installed, in the Azure portal, select **+ Replicate** to start protecting these VMs.

## Update Mobility Service

> [!WARNING]
> Ensure that the configuration server, scale-out process servers, and any master target servers that are a part of your deployment are updated before you start updating Mobility Service on the protected servers.

1. On the Azure portal, browse to the *name of your vault* > **Replicated items** view.
2. If the configuration server was already updated to the latest version, you see a notification that reads "New Site recovery replication agent update is available. Click to install."

     ![Replicated items window](.\media\vmware-azure-install-mobility-service\replicated-item-notif.png)
3. Select the notification to open the virtual machine selection page.
4. Select the virtual machines you want to upgrade mobility service on, and select **OK**.

     ![Replicated items VM list](.\media\vmware-azure-install-mobility-service\update-okpng.png)

The Update Mobility Service job starts for each of the selected virtual machines.

> [!NOTE]
> [Read more](vmware-azure-manage-configuration-server.md) on how to update the password for the account used to install Mobility Service.

## Uninstall Mobility Service on a Windows Server computer
Use one of the following methods to uninstall Mobility Service on a Windows Server computer.

### Uninstall by using the GUI
1. In Control Panel, select **Programs**.
2. Select **Microsoft Azure Site Recovery Mobility Service/Master Target server**, and then select **Uninstall**.

### Uninstall at a command prompt
1. Open a command prompt window as an administrator.
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
