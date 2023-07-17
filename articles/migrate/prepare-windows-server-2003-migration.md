---
title: Prepare Windows Server 2003 servers for migration with Azure Migrate
description: Learn how to prepare Windows Server 2003 servers for migration with Azure Migrate.
author: vijain
ms.author: vijain
ms.manager: kmadnani
ms.topic: how-to
ms.service: azure-migrate
ms.date: 12/12/2022
ms.custom: engagement-fy23
---


# Prepare Windows Server 2003 machines for migration

This article describes how to prepare machines running Windows Server 2003 for migration to Azure. 


> [!NOTE]
> [Windows Server 2003 extended support](/troubleshoot/azure/virtual-machines/run-win-server-2003#microsoft-windows-server-2003-end-of-support) ended on July 14, 2015.  The Azure support team continues to help in troubleshooting issues that concern running Windows Server 2003 on Azure. However, this support is limited to issues that don't require OS-level troubleshooting or patches. Migrating your applications to Azure instances running a newer version of Windows Server is the recommended approach to ensure that you are effectively leveraging the flexibility and reliability of the Azure cloud. However, if you still choose to migrate your Windows Server 2003 to Azure, you can use the Migration and modernization tool if your Windows Server is a VM running on VMware or Hyper-V.


- You can use agentless migration to migrate [Hyper-V VMs](tutorial-migrate-hyper-v.md) and [VMware VMs](tutorial-migrate-vmware.md) to Azure.
- In order to connect to Azure VMs after migration, Hyper-V Integration Services must be installed on the Azure VM. Windows Server 2003 machines don't have this installed by default.
- There's no direct download link to install Hyper-V Integration Services, so you need to do the following:
    - For Hyper-V VMs that don't have it installed, you extract installation files for Integration Services on a machine running Windows Server 2012 R2/Windows Server 2012 with the Hyper-V role, and then copy the installer to the Windows Server 2003 machine. The installation files aren't available on machines running Windows Server 2016.
    - For VMware VMs, you create a startup task that installs Integration Services when the Azure VM starts after migration.


## Install on Hyper-V VMs

Before migration, check whether Hyper-V Integration Services is installed, and then install if needed.

1. Follow [these instructions](/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services#turn-an-integration-service-on-or-off-using-hyper-v-manager) to check whether it's installed.
2. If it isn't installed, sign into a machine running Windows Server 2012 R2/Windows Server 2012 with the Hyper-V role.
3. Navigate to the installation file at **C:\Windows\System32\vmguest.iso**, and mount the file.
2. Copy the installation folder to the Windows Server 2003 machine, and install Integration Services.
4. After installation, you can leave the default settings in Integration Services. 

## Install on VMware VMs

1. Sign into a machine running Windows Server 2012 R2/Windows Server 2012 with the Hyper-V role.
2. Navigate to the installation file at **C:\Windows\System32\vmguest.iso**, and mount the file.
3. Copy the installation folder to the VMware VM.
4. From the command line on the VM, run ```gpedit.msc```.
5. Open **Computer Configuration** > **Windows Settings** > **Scripts (Startup/Shutdown)**.
6. In **Startup** > **Add** > **Script Name**, type the setup.exe address.
7. After migration to Azure, the script runs the first time the Azure VM starts.
8. Manually restart the Azure VM. There's a pop-up in boot diagnostics to indicate that a restart is needed.
9. After the script runs and Hyper-V Integration Services is installed on the Azure VM, you can remove the script from startup.
10. After installation, you can leave the default settings in Integration Services. 

## Next steps

- Review migration requirements for [VMware](migrate-support-matrix-vmware-migration.md) and [Hyper-V](migrate-support-matrix-hyper-v-migration.md) VMs.
- Migrate [VMware](server-migrate-overview.md) and [Hyper-V](tutorial-migrate-hyper-v.md) VMs.
